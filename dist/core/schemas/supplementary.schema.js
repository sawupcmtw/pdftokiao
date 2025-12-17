import { z } from 'zod';
export const SupplementaryScopeTypeSchema = z.enum(['all', 'pages', 'type', 'questions']);
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
        questionType: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer', 'emi_single_select']),
    }),
    z.object({
        type: z.literal('questions'),
        questionNumbers: z.array(z.number().int().positive()),
    }),
]);
export const SupplementaryPdfSchema = z.object({
    path: z.string(),
    scope: SupplementaryScopeSchema,
    filename: z.string(),
});
export const ExtractedAnswerSchema = z.object({
    questionNumber: z.number().int().positive(),
    answer: z.array(z.array(z.string())),
    explanation: z
        .object({
        note: z.string().nullable().optional(),
        translation: z.string().nullable().optional(),
        vocabs_note: z.string().nullable().optional(),
    })
        .optional(),
    confidence: z.enum(['high', 'medium', 'low']),
});
export const SupplementaryExtractionResultSchema = z.object({
    sourcePdf: z.string(),
    scope: SupplementaryScopeSchema,
    answers: z.array(ExtractedAnswerSchema),
});
//# sourceMappingURL=supplementary.schema.js.map