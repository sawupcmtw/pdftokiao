import { LRUCache } from 'lru-cache';
declare const cache: LRUCache<string, any, unknown>;
export declare function getCached<T>(key: string): T | undefined;
export declare function setCached<T>(key: string, value: T): void;
export declare function generateCacheKey(prompt: string, images?: Buffer[]): string;
export declare function clearCache(): void;
export declare function getCacheStats(): {
    size: number;
    max: number;
    ttl: number;
};
export { cache };
//# sourceMappingURL=response-cache.d.ts.map