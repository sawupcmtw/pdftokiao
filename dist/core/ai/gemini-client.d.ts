import { z } from 'zod';
export declare const DEFAULT_MODEL = "gemini-3-pro-preview";
export declare const DEFAULT_TEMPERATURE = 0.7;
export declare const MAX_RETRIES = 3;
export declare const INITIAL_RETRY_DELAY = 1000;
export interface UsageMetrics {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cachedInputTokens?: number;
}
export interface CallMetrics {
    usage: UsageMetrics;
    latencyMs: number;
    cacheHit: boolean;
    retryAttempts: number;
}
export interface GenerateResult<T> {
    object: T;
    metrics: CallMetrics;
}
export interface FileInput {
    buffer: Buffer;
    mimeType: string;
}
export interface GenerateOptions<T extends z.ZodType> {
    prompt: string;
    images?: Buffer[];
    pdf?: Buffer;
    files?: FileInput[];
    schema: T;
    cacheKey?: string;
    temperature?: number;
    model?: string;
}
export declare class GeminiError extends Error {
    readonly cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
export declare function generateStructured<T extends z.ZodType>(options: GenerateOptions<T>): Promise<GenerateResult<z.infer<T>>>;
export declare function clearCache(): void;
export declare function getCacheStats(): {
    size: number;
    max: number;
    ttl: number;
};
//# sourceMappingURL=gemini-client.d.ts.map