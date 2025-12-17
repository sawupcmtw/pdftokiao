import { z } from 'zod'

/**
 * Schema for ParseInput - validates input for the PDF parsing process
 * Note: materialId and importKey are handled separately by CLI
 */
export const ParseInputSchema = z.object({
  /** PDF file as a Buffer */
  pdf: z.instanceof(Buffer),

  /** Page range to parse - either a single page [n] or a range [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Array of hint images as Buffers */
  hints: z.array(z.instanceof(Buffer)),

  /** Optional instruction string for parsing guidance */
  instruction: z.string().optional(),
})

export type ParseInput = z.infer<typeof ParseInputSchema>
