// Main entry point for pdftokiao library
export * from './core/loader/index.js'
export * from './core/merger/index.js'
export * from './core/schemas/index.js'
export * from './types/index.js'

// Export AI module (includes clearCache and getCacheStats from gemini-client)
export {
  generateStructured,
  clearCache,
  getCacheStats,
  GeminiError,
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  MAX_RETRIES,
  INITIAL_RETRY_DELAY,
  type GenerateOptions,
} from './core/ai/index.js'

// Export cache utilities (with aliases to avoid conflicts)
export { getCached, setCached, generateCacheKey, cache } from './core/cache/index.js'

// asdfasdfkhnaskdn
