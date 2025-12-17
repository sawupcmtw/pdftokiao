import { z } from 'zod';
export const AudioUrlsSchema = z.string().url();
export const ExplanationSchema = z.object({
    attributes: z.object({
        note: z.string().nullable().optional(),
        translation: z.string().nullable().optional(),
        vocabs_note: z.string().nullable().optional(),
    }),
});
export const OptionAttributesSchema = z.object({
    symbol: z.string(),
    text: z.string(),
    latex: z.string().nullable().optional(),
    audio_urls: AudioUrlsSchema.nullable().optional(),
    image_url: z.string().url().nullable().optional(),
});
export const OptionSchema = z.object({
    attributes: OptionAttributesSchema,
    explanation: ExplanationSchema.optional(),
});
export const BaseQuestionAttributesSchema = z.object({
    position: z.number().int().positive(),
    text: z.string(),
    latex: z.string().nullable().optional(),
    audio_urls: AudioUrlsSchema.nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    answer: z.array(z.array(z.string())),
    custom: z.string().nullable().optional(),
    blank_identifier: z.string().optional(),
});
export const SingleSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
    assessment_form: z.literal('single_select'),
});
export const MultiSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
    assessment_form: z.literal('multi_select'),
});
export const FillInQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
    assessment_form: z.literal('fill_in'),
});
export const ShortAnswerQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
    assessment_form: z.literal('short_answer'),
});
export const EMISingleSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
    assessment_form: z.literal('emi_single_select'),
});
export const SingleSelectQuestionSchema = z.object({
    attributes: SingleSelectQuestionAttributesSchema,
    explanation: ExplanationSchema.optional(),
    options: z.array(OptionSchema),
});
export const MultiSelectQuestionSchema = z.object({
    attributes: MultiSelectQuestionAttributesSchema,
    explanation: ExplanationSchema.optional(),
    options: z.array(OptionSchema),
});
export const FillInQuestionSchema = z.object({
    attributes: FillInQuestionAttributesSchema,
    explanation: ExplanationSchema.optional(),
});
export const ShortAnswerQuestionSchema = z.object({
    attributes: ShortAnswerQuestionAttributesSchema,
    explanation: ExplanationSchema.optional(),
});
export const EMISingleSelectQuestionSchema = z.object({
    attributes: EMISingleSelectQuestionAttributesSchema,
    explanation: ExplanationSchema.optional(),
});
export const QuestionSchema = z.union([
    SingleSelectQuestionSchema,
    MultiSelectQuestionSchema,
    FillInQuestionSchema,
    ShortAnswerQuestionSchema,
    EMISingleSelectQuestionSchema,
]);
//# sourceMappingURL=question.schema.js.map