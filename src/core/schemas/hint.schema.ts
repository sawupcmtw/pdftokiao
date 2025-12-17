import { z } from 'zod'

/**
 * Schema for HintTag - describes a hint tag for question type detection
 */
export const HintTagSchema = z.object({
  /** Index of the hint image */
  imageIndex: z.number().int().nonnegative(),

  /** Type of question detected in the hint */
  type: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),

  /** Description of the hint content */
  description: z.string(),
})

export type HintTag = z.infer<typeof HintTagSchema>
