import { LRUCache } from 'lru-cache';
import { createHash } from 'crypto';
const CACHE_CONFIG = {
    max: 100,
    ttl: 3600000,
};
const cache = new LRUCache(CACHE_CONFIG);
export function getCached(key) {
    return cache.get(key);
}
export function setCached(key, value) {
    cache.set(key, value);
}
export function generateCacheKey(prompt, images) {
    const hash = createHash('sha256');
    hash.update(prompt);
    if (images && images.length > 0) {
        images.forEach((image) => {
            hash.update(image);
        });
    }
    return hash.digest('hex');
}
export function clearCache() {
    cache.clear();
}
export function getCacheStats() {
    return {
        size: cache.size,
        max: CACHE_CONFIG.max,
        ttl: CACHE_CONFIG.ttl,
    };
}
export { cache };
//# sourceMappingURL=response-cache.js.map