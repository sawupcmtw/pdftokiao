import { z } from 'zod'

/**
 * Schema for ParseInput - validates input for the PDF parsing process
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

  /** Material ID number */
  materialId: z.number().int().positive(),

  /** Import key string (UUID format recommended) */
  importKey: z.string().min(1),
})

export type ParseInput = z.infer<typeof ParseInputSchema>
