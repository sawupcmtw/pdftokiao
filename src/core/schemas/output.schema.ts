import { z } from 'zod'
import {
  AudioUrlsSchema,
  ExplanationSchema,
  OptionSchema,
  QuestionSchema,
} from './question.schema.js'
import { DeckSchema } from './deck.schema.js'

/**
 * Schema for QuestionGroup attributes
 * Note: material_id and import_key are added by CLI, not part of AI-generated output
 */
export const QuestionGroupAttributesSchema = z.object({
  /** Optional text content for the question group (e.g., reading passage for EMI) */
  text: z.string().optional(),

  /** Audio URLs for the question group */
  audio_urls: AudioUrlsSchema.nullable().optional(),

  /** Image URL for the question group */
  image_url: z.string().url().nullable().optional(),
})

/**
 * Schema for QuestionGroup data structure
 */
export const QuestionGroupDataSchema = z.object({
  /** Type identifier */
  type: z.literal('question_group'),

  /** Question group attributes */
  attributes: QuestionGroupAttributesSchema,

  /** Optional explanation for the entire group (used in EMI types) */
  explanation: ExplanationSchema.optional(),

  /** Optional shared options (used in EMI types) */
  options: z.array(OptionSchema).optional(),

  /** Array of questions in the group */
  questions: z.array(QuestionSchema).min(1),
})

/**
 * Schema for the complete QuestionGroup output
 */
export const QuestionGroupSchema = z.object({
  data: QuestionGroupDataSchema,
})

// Export inferred types
export type QuestionGroupAttributes = z.infer<typeof QuestionGroupAttributesSchema>
export type QuestionGroupData = z.infer<typeof QuestionGroupDataSchema>
export type QuestionGroup = z.infer<typeof QuestionGroupSchema>

/**
 * Schema for Deck output wrapper (matches QuestionGroup structure pattern)
 */
export const DeckOutputSchema = z.object({
  data: DeckSchema,
})

export type DeckOutput = z.infer<typeof DeckOutputSchema>

/**
 * Schema for combined orchestrator output
 * Array containing either QuestionGroup or DeckOutput items
 */
export const OrchestratorOutputSchema = z.array(
  z.union([QuestionGroupSchema, DeckOutputSchema])
)

export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>

// ============================================
// Pipeline Metrics & Logging Types
// ============================================

/** Individual AI call log entry */
export interface AICallLog {
  /** Goal/purpose of this AI call (e.g., "Tag hint image 1", "Parse question 3 (fill_in)") */
  goal: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
  cacheHit: boolean
  retries: number
}

/** Aggregated pipeline metrics */
export interface PipelineMetrics {
  totalInputTokens: number
  totalOutputTokens: number
  totalLatencyMs: number
  cacheHits: number
  apiCalls: number
  totalRetries: number
}

/** Extended orchestrator result including metrics and call logs */
export interface OrchestratorResult {
  output: OrchestratorOutput
  metrics: PipelineMetrics
  callLogs: AICallLog[]
  startTime: Date
  endTime: Date
}
