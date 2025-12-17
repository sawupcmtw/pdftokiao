import { z } from 'zod';

/**
 * Schema for audio URLs - single URL string
 * Note: Simplified from union type due to Gemini API schema limitations with z.record()
 */
export const AudioUrlsSchema = z.string().url();

/**
 * Schema for Explanation - includes note, translation, and vocabs_note
 */
export const ExplanationSchema = z.object({
  attributes: z.object({
    /** Explanation note (supports HTML) */
    note: z.string().nullable().optional(),

    /** Translation text (supports HTML) */
    translation: z.string().nullable().optional(),

    /** Vocabulary notes */
    vocabs_note: z.string().nullable().optional(),
  }),
});

/**
 * Schema for Option attributes
 */
export const OptionAttributesSchema = z.object({
  /** Option symbol (e.g., "A", "B", "C") */
  symbol: z.string(),

  /** Option text content */
  text: z.string(),

  /** Optional LaTeX content */
  latex: z.string().nullable().optional(),

  /** Audio URLs for the option */
  audio_urls: AudioUrlsSchema.nullable().optional(),

  /** Image URL for the option */
  image_url: z.string().url().nullable().optional(),
});

/**
 * Schema for Option - includes attributes and optional explanation
 */
export const OptionSchema = z.object({
  attributes: OptionAttributesSchema,
  explanation: ExplanationSchema.optional(),
});

/**
 * Base schema for all question attributes
 */
export const BaseQuestionAttributesSchema = z.object({
  /** Position of the question in the group */
  position: z.number().int().positive(),

  /** Question text (supports HTML) */
  text: z.string(),

  /** Optional LaTeX content */
  latex: z.string().nullable().optional(),

  /** Audio URLs for the question */
  audio_urls: AudioUrlsSchema.nullable().optional(),

  /** Image URL for the question */
  image_url: z.string().url().nullable().optional(),

  /** Answer array (array of arrays for multiple blanks/possibilities) */
  answer: z.array(z.array(z.string())),

  /** Custom data - JSON string for flexibility */
  custom: z.string().nullable().optional(),

  /** Blank identifier for fill-in questions with numbered blanks */
  blank_identifier: z.string().optional(),
});

/**
 * Schema for Single-select question attributes
 */
export const SingleSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
  assessment_form: z.literal('single_select'),
});

/**
 * Schema for Multi-select question attributes
 */
export const MultiSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
  assessment_form: z.literal('multi_select'),
});

/**
 * Schema for Fill-in question attributes
 */
export const FillInQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
  assessment_form: z.literal('fill_in'),
});

/**
 * Schema for Short-answer question attributes
 */
export const ShortAnswerQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
  assessment_form: z.literal('short_answer'),
});

/**
 * Schema for EMI Single-select question attributes
 */
export const EMISingleSelectQuestionAttributesSchema = BaseQuestionAttributesSchema.extend({
  assessment_form: z.literal('emi_single_select'),
});

/**
 * Base question schema with common structure
 * Note: Not currently used but kept for potential future use
 */
// const _BaseQuestionSchema = z.object({
//   attributes: BaseQuestionAttributesSchema,
//   meta: z.record(z.any()).optional(),
//   explanation: ExplanationSchema.optional(),
// });

/**
 * Schema for Single-select question
 */
export const SingleSelectQuestionSchema = z.object({
  attributes: SingleSelectQuestionAttributesSchema,
  explanation: ExplanationSchema.optional(),
  options: z.array(OptionSchema),
});

/**
 * Schema for Multi-select question
 */
export const MultiSelectQuestionSchema = z.object({
  attributes: MultiSelectQuestionAttributesSchema,
  explanation: ExplanationSchema.optional(),
  options: z.array(OptionSchema),
});

/**
 * Schema for Fill-in question (no options)
 */
export const FillInQuestionSchema = z.object({
  attributes: FillInQuestionAttributesSchema,
  explanation: ExplanationSchema.optional(),
});

/**
 * Schema for Short-answer question (no options)
 */
export const ShortAnswerQuestionSchema = z.object({
  attributes: ShortAnswerQuestionAttributesSchema,
  explanation: ExplanationSchema.optional(),
});

/**
 * Schema for EMI Single-select question (options at group level)
 */
export const EMISingleSelectQuestionSchema = z.object({
  attributes: EMISingleSelectQuestionAttributesSchema,
  explanation: ExplanationSchema.optional(),
});

/**
 * Union schema for any question type
 */
export const QuestionSchema = z.union([
  SingleSelectQuestionSchema,
  MultiSelectQuestionSchema,
  FillInQuestionSchema,
  ShortAnswerQuestionSchema,
  EMISingleSelectQuestionSchema,
]);

// Export inferred types
export type AudioUrls = z.infer<typeof AudioUrlsSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;
export type OptionAttributes = z.infer<typeof OptionAttributesSchema>;
export type Option = z.infer<typeof OptionSchema>;
export type BaseQuestionAttributes = z.infer<typeof BaseQuestionAttributesSchema>;
export type SingleSelectQuestionAttributes = z.infer<typeof SingleSelectQuestionAttributesSchema>;
export type MultiSelectQuestionAttributes = z.infer<typeof MultiSelectQuestionAttributesSchema>;
export type FillInQuestionAttributes = z.infer<typeof FillInQuestionAttributesSchema>;
export type ShortAnswerQuestionAttributes = z.infer<typeof ShortAnswerQuestionAttributesSchema>;
export type EMISingleSelectQuestionAttributes = z.infer<typeof EMISingleSelectQuestionAttributesSchema>;
export type SingleSelectQuestion = z.infer<typeof SingleSelectQuestionSchema>;
export type MultiSelectQuestion = z.infer<typeof MultiSelectQuestionSchema>;
export type FillInQuestion = z.infer<typeof FillInQuestionSchema>;
export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;
export type EMISingleSelectQuestion = z.infer<typeof EMISingleSelectQuestionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
