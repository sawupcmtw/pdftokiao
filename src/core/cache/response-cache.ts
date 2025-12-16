import { LRUCache } from 'lru-cache';
import { createHash } from 'crypto';

/**
 * LRU cache configuration
 */
const CACHE_CONFIG = {
  max: 100, // Maximum number of entries
  ttl: 3600000, // 1 hour in milliseconds
};

/**
 * Singleton LRU cache instance for AI responses
 */
const cache = new LRUCache<string, any>(CACHE_CONFIG);

/**
 * Get a cached value by key
 * @param key - The cache key
 * @returns The cached value or undefined if not found
 */
export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

/**
 * Set a value in the cache
 * @param key - The cache key
 * @param value - The value to cache
 */
export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}

/**
 * Generate a deterministic cache key from prompt and images
 * @param prompt - The text prompt
 * @param images - Optional array of image buffers
 * @returns A SHA-256 hash as the cache key
 */
export function generateCacheKey(
  prompt: string,
  images?: Buffer[],
): string {
  const hash = createHash('sha256');

  // Hash the prompt
  hash.update(prompt);

  // Hash each image buffer if provided
  if (images && images.length > 0) {
    images.forEach((image) => {
      hash.update(image);
    });
  }

  return hash.digest('hex');
}

/**
 * Clear all cached entries
 * Useful for testing or memory management
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 * @returns Object containing cache size and max size
 */
export function getCacheStats() {
  return {
    size: cache.size,
    max: CACHE_CONFIG.max,
    ttl: CACHE_CONFIG.ttl,
  };
}

/**
 * Export the cache instance for advanced usage
 */
export { cache };
