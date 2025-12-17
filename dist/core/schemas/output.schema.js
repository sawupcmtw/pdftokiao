import { z } from 'zod';
import { AudioUrlsSchema, ExplanationSchema, OptionSchema, QuestionSchema, } from './question.schema.js';
import { DeckSchema } from './deck.schema.js';
export const QuestionGroupAttributesSchema = z.object({
    text: z.string().optional(),
    audio_urls: AudioUrlsSchema.nullable().optional(),
    image_url: z.string().url().nullable().optional(),
});
export const QuestionGroupDataSchema = z.object({
    type: z.literal('question_group'),
    attributes: QuestionGroupAttributesSchema,
    explanation: ExplanationSchema.optional(),
    options: z.array(OptionSchema).optional(),
    questions: z.array(QuestionSchema).min(1),
});
export const QuestionGroupSchema = z.object({
    data: QuestionGroupDataSchema,
});
export const DeckOutputSchema = z.object({
    data: DeckSchema,
});
export const OrchestratorOutputSchema = z.array(z.union([QuestionGroupSchema, DeckOutputSchema]));
//# sourceMappingURL=output.schema.js.map