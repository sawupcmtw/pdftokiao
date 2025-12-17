import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import {
  getCached,
  setCached,
  generateCacheKey,
  clearCache as clearCacheImpl,
  getCacheStats as getCacheStatsImpl,
} from '../cache/index.js';

// Configuration
export const DEFAULT_MODEL = 'gemini-3-pro-preview';
export const DEFAULT_TEMPERATURE = 0.7;
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000; // 1 second

// Usage metrics from API response
export interface UsageMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens?: number;
  cost: number;
}

// Call metrics including timing and cache info
export interface CallMetrics {
  usage: UsageMetrics;
  latencyMs: number;
  cacheHit: boolean;
  retryAttempts: number;
}

// Result type including both object and metrics
export interface GenerateResult<T> {
  object: T;
  metrics: CallMetrics;
}

// File input with mime type
export interface FileInput {
  buffer: Buffer;
  mimeType: string;
}

// Options interface for structured generation
export interface GenerateOptions<T extends z.ZodType> {
  prompt: string;
  /** Image buffers (will use image/png mime type) */
  images?: Buffer[];
  /** PDF buffer (will use application/pdf mime type) */
  pdf?: Buffer;
  /** Generic files with explicit mime types */
  files?: FileInput[];
  schema: T;
  cacheKey?: string;
  temperature?: number;
  model?: string;
}

// Error type for better error handling
export class GeminiError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

/**
 * Converts a Buffer image to a base64 data URL
 * @param imageBuffer - The image buffer to convert
 * @param mimeType - The MIME type of the image (defaults to image/png)
 * @returns A data URL string
 */
function bufferToDataUrl(imageBuffer: Buffer, mimeType: string = 'image/png'): string {
  const base64 = imageBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Sleep utility for retry delays
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract concise error info from API errors
 */
function formatApiError(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;

    // Try to get the nested API error message (err.data.error.message)
    const data = err['data'] as Record<string, unknown> | undefined;
    const apiError = data?.['error'] as Record<string, unknown> | undefined;
    const apiMessage = apiError?.['message'];

    if (typeof apiMessage === 'string') {
      // Extract schema paths from the error message
      const paths = apiMessage
        .split('\n')
        .filter((line: string) => line.trim().startsWith('*'))
        .map((line: string) => {
          const match = line.match(/properties\[([^\]]+)\]/g);
          return match
            ? match.map((m) => m.replace(/properties\["|"\]/g, '')).join('.')
            : line.trim();
        });

      if (paths.length > 0) {
        return `Schema error at: ${paths.join(', ')}`;
      }
      return apiMessage.split('\n')[0] ?? apiMessage;
    }

    // Fallback to regular message
    const message = err['message'];
    if (typeof message === 'string') {
      return message.split('\n')[0] ?? message;
    }
  }

  return String(error);
}

/**
 * Generate structured output using Gemini with Zod schemas
 * @param options - Generation options including prompt, images, schema, and cache settings
 * @returns Object with the parsed result and call metrics
 * @throws GeminiError if generation fails after all retries
 */
export async function generateStructured<T extends z.ZodType>(
  options: GenerateOptions<T>
): Promise<GenerateResult<z.infer<T>>> {
  const startTime = Date.now();
  const {
    prompt,
    images = [],
    pdf,
    files = [],
    schema,
    cacheKey,
    temperature = DEFAULT_TEMPERATURE,
    model = DEFAULT_MODEL,
  } = options;

  // Collect all buffers for cache key generation
  const allBuffers = [...images, ...(pdf ? [pdf] : []), ...files.map((f) => f.buffer)];

  // Generate cache key if not provided
  const effectiveCacheKey =
    cacheKey || generateCacheKey(prompt, allBuffers.length > 0 ? allBuffers : undefined);

  // Check cache
  const cached = getCached<z.infer<T>>(effectiveCacheKey);
  if (cached !== undefined) {
    // Validate cached data against schema
    try {
      const validatedObject = schema.parse(cached) as z.infer<T>;
      // Return cache hit with zero-token metrics
      return {
        object: validatedObject,
        metrics: {
          usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0, cost: 0 },
          latencyMs: Date.now() - startTime,
          cacheHit: true,
          retryAttempts: 0,
        },
      };
    } catch (error) {
      // If cached data doesn't match schema, continue to regenerate
      console.warn('Cached data failed schema validation, regenerating...', error);
    }
  }

  // Build content array with all file types
  type ContentPart =
    | { type: 'text'; text: string }
    | { type: 'image'; image: string }
    | { type: 'file'; data: string; mimeType: string };

  const content: ContentPart[] = [{ type: 'text', text: prompt }];

  // Add images
  for (const buffer of images) {
    content.push({
      type: 'image',
      image: bufferToDataUrl(buffer, 'image/png'),
    });
  }

  // Add PDF if provided
  if (pdf) {
    content.push({
      type: 'file',
      data: pdf.toString('base64'),
      mimeType: 'application/pdf',
    });
  }

  // Add generic files
  for (const file of files) {
    content.push({
      type: 'file',
      data: file.buffer.toString('base64'),
      mimeType: file.mimeType,
    });
  }

  // Retry logic with exponential backoff
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Generate structured output using AI SDK
      const result = await generateObject({
        model: google(model),
        schema,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        temperature,
      });

      // Cache the result
      setCached(effectiveCacheKey, result.object);

      // Extract token usage from response
      // Note: Vercel AI SDK uses promptTokens/completionTokens naming
      const inputTokens = result.usage?.promptTokens ?? 0;
      const outputTokens = result.usage?.completionTokens ?? 0;
      const totalTokens = result.usage?.totalTokens ?? inputTokens + outputTokens;

      return {
        object: result.object,
        metrics: {
          usage: {
            inputTokens,
            outputTokens,
            totalTokens,
            cost: 0, // Cost calculation not implemented
          },
          latencyMs: Date.now() - startTime,
          cacheHit: false,
          retryAttempts: attempt,
        },
      };
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === MAX_RETRIES - 1) {
        break;
      }

      // Calculate exponential backoff delay
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);

      // Log retry attempt (in production, use proper logger)
      console.warn(`Gemini API failed (${attempt + 1}/${MAX_RETRIES}): ${formatApiError(error)}`);

      // Wait before retrying
      await sleep(delay);
    }
  }

  // If we get here, all retries failed
  throw new GeminiError(
    `Failed to generate structured output after ${MAX_RETRIES} attempts`,
    lastError
  );
}

/**
 * Clear the AI response cache
 */
export function clearCache(): void {
  clearCacheImpl();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return getCacheStatsImpl();
}
