import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getCached, setCached, generateCacheKey, clearCache as clearCacheImpl, getCacheStats as getCacheStatsImpl, } from '../cache/index.js';
export const DEFAULT_MODEL = 'gemini-3-pro-preview';
export const DEFAULT_TEMPERATURE = 0.7;
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000;
export class GeminiError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'GeminiError';
    }
}
function bufferToDataUrl(imageBuffer, mimeType = 'image/png') {
    const base64 = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function formatApiError(error) {
    if (error && typeof error === 'object') {
        const err = error;
        const data = err['data'];
        const apiError = data?.['error'];
        const apiMessage = apiError?.['message'];
        if (typeof apiMessage === 'string') {
            const paths = apiMessage
                .split('\n')
                .filter((line) => line.trim().startsWith('*'))
                .map((line) => {
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
        const message = err['message'];
        if (typeof message === 'string') {
            return message.split('\n')[0] ?? message;
        }
    }
    return String(error);
}
export async function generateStructured(options) {
    const startTime = Date.now();
    const { prompt, images = [], pdf, files = [], schema, cacheKey, temperature = DEFAULT_TEMPERATURE, model = DEFAULT_MODEL, } = options;
    const allBuffers = [...images, ...(pdf ? [pdf] : []), ...files.map((f) => f.buffer)];
    const effectiveCacheKey = cacheKey || generateCacheKey(prompt, allBuffers.length > 0 ? allBuffers : undefined);
    const cached = getCached(effectiveCacheKey);
    if (cached !== undefined) {
        try {
            const validatedObject = schema.parse(cached);
            return {
                object: validatedObject,
                metrics: {
                    usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
                    latencyMs: Date.now() - startTime,
                    cacheHit: true,
                    retryAttempts: 0,
                },
            };
        }
        catch (error) {
            console.warn('Cached data failed schema validation, regenerating...', error);
        }
    }
    const content = [{ type: 'text', text: prompt }];
    for (const buffer of images) {
        content.push({
            type: 'image',
            image: bufferToDataUrl(buffer, 'image/png'),
        });
    }
    if (pdf) {
        content.push({
            type: 'file',
            data: pdf.toString('base64'),
            mimeType: 'application/pdf',
        });
    }
    for (const file of files) {
        content.push({
            type: 'file',
            data: file.buffer.toString('base64'),
            mimeType: file.mimeType,
        });
    }
    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
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
            setCached(effectiveCacheKey, result.object);
            const inputTokens = result.usage?.promptTokens ?? 0;
            const outputTokens = result.usage?.completionTokens ?? 0;
            const totalTokens = result.usage?.totalTokens ?? inputTokens + outputTokens;
            const cachedInputTokens = result.usage?.cachedInputTokens;
            return {
                object: result.object,
                metrics: {
                    usage: {
                        inputTokens,
                        outputTokens,
                        totalTokens,
                        ...(cachedInputTokens !== undefined && { cachedInputTokens }),
                    },
                    latencyMs: Date.now() - startTime,
                    cacheHit: false,
                    retryAttempts: attempt,
                },
            };
        }
        catch (error) {
            lastError = error;
            if (attempt === MAX_RETRIES - 1) {
                break;
            }
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
            console.warn(`Gemini API failed (${attempt + 1}/${MAX_RETRIES}): ${formatApiError(error)}`);
            await sleep(delay);
        }
    }
    throw new GeminiError(`Failed to generate structured output after ${MAX_RETRIES} attempts`, lastError);
}
export function clearCache() {
    clearCacheImpl();
}
export function getCacheStats() {
    return getCacheStatsImpl();
}
//# sourceMappingURL=gemini-client.js.map