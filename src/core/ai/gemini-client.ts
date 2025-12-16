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
export const DEFAULT_MODEL = 'gemini-2.0-flash-exp';
export const DEFAULT_TEMPERATURE = 0.7;
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000; // 1 second

// Options interface for structured generation
export interface GenerateOptions<T extends z.ZodType> {
  prompt: string;
  images?: Buffer[];
  schema: T;
  cacheKey?: string;
  temperature?: number;
  model?: string;
}

// Error type for better error handling
export class GeminiError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
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
function bufferToDataUrl(
  imageBuffer: Buffer,
  mimeType: string = 'image/png',
): string {
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
 * Generate structured output using Gemini with Zod schemas
 * @param options - Generation options including prompt, images, schema, and cache settings
 * @returns Parsed and validated output matching the schema
 * @throws GeminiError if generation fails after all retries
 */
export async function generateStructured<T extends z.ZodType>(
  options: GenerateOptions<T>,
): Promise<z.infer<T>> {
  const {
    prompt,
    images = [],
    schema,
    cacheKey,
    temperature = DEFAULT_TEMPERATURE,
    model = DEFAULT_MODEL,
  } = options;

  // Generate cache key if not provided
  const effectiveCacheKey =
    cacheKey || generateCacheKey(prompt, images.length > 0 ? images : undefined);

  // Check cache
  const cached = getCached<z.infer<T>>(effectiveCacheKey);
  if (cached !== undefined) {
    // Validate cached data against schema
    try {
      return schema.parse(cached) as z.infer<T>;
    } catch (error) {
      // If cached data doesn't match schema, continue to regenerate
      console.warn('Cached data failed schema validation, regenerating...', error);
    }
  }

  // Prepare image content if images are provided
  const imageContent = images.map((buffer) => ({
    type: 'image' as const,
    image: bufferToDataUrl(buffer),
  }));

  // Combine text and images into messages
  const content: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
    { type: 'text', text: prompt },
    ...imageContent,
  ];

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

      return result.object;
    } catch (error) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === MAX_RETRIES - 1) {
        break;
      }

      // Calculate exponential backoff delay
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);

      // Log retry attempt (in production, use proper logger)
      console.warn(
        `Gemini API call failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${delay}ms...`,
        error,
      );

      // Wait before retrying
      await sleep(delay);
    }
  }

  // If we get here, all retries failed
  throw new GeminiError(
    `Failed to generate structured output after ${MAX_RETRIES} attempts`,
    lastError,
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
