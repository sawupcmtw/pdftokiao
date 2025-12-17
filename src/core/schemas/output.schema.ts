import { z } from 'zod'
import {
  AudioUrlsSchema,
  ExplanationSchema,
  OptionSchema,
  QuestionSchema,
} from './question.schema.js'

/**
 * Schema for QuestionGroup attributes
 */
export const QuestionGroupAttributesSchema = z.object({
  /** Material ID */
  material_id: z.number().int().positive(),

  /** Import key (UUID format recommended) */
  import_key: z.string().min(1),

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
