import { z } from 'zod';

/**
 * Scope types for supplementary PDFs
 */
export const SupplementaryScopeTypeSchema = z.enum(['all', 'pages', 'type', 'questions']);

export type SupplementaryScopeType = z.infer<typeof SupplementaryScopeTypeSchema>;

/**
 * Discriminated union for supplementary PDF scope
 */
export const SupplementaryScopeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('all'),
  }),
  z.object({
    type: z.literal('pages'),
    startPage: z.number().int().positive(),
    endPage: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('type'),
    questionType: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),
  }),
  z.object({
    type: z.literal('questions'),
    questionNumbers: z.array(z.number().int().positive()),
  }),
]);

export type SupplementaryScope = z.infer<typeof SupplementaryScopeSchema>;

/**
 * Metadata for a discovered supplementary PDF
 */
export const SupplementaryPdfSchema = z.object({
  path: z.string(),
  scope: SupplementaryScopeSchema,
  filename: z.string(),
});

export type SupplementaryPdf = z.infer<typeof SupplementaryPdfSchema>;

/**
 * Extracted answer from a supplementary PDF
 */
export const ExtractedAnswerSchema = z.object({
  questionNumber: z.number().int().positive(),
  answer: z.array(z.array(z.string())), // Matches existing answer format: [["A"]] or [["A"], ["B"]]
  explanation: z
    .object({
      note: z.string().nullable().optional(),
      translation: z.string().nullable().optional(),
      vocabs_note: z.string().nullable().optional(),
    })
    .optional(),
  confidence: z.enum(['high', 'medium', 'low']),
});

export type ExtractedAnswer = z.infer<typeof ExtractedAnswerSchema>;

/**
 * Result from extracting answers from a single supplementary PDF
 */
export const SupplementaryExtractionResultSchema = z.object({
  sourcePdf: z.string(),
  scope: SupplementaryScopeSchema,
  answers: z.array(ExtractedAnswerSchema),
});

export type SupplementaryExtractionResult = z.infer<typeof SupplementaryExtractionResultSchema>;
