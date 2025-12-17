// Zod schemas for validation

// Input schemas
export { ParseInputSchema, type ParseInput } from './input.schema.js';

// Hint schemas
export { HintTagSchema, type HintTag } from './hint.schema.js';

// Page map schemas
export { PageMapSchema, PageItemSchema, type PageMap, type PageItem } from './page-map.schema.js';

// Question schemas
export {
  AudioUrlsSchema,
  ExplanationSchema,
  OptionAttributesSchema,
  OptionSchema,
  BaseQuestionAttributesSchema,
  SingleSelectQuestionAttributesSchema,
  MultiSelectQuestionAttributesSchema,
  FillInQuestionAttributesSchema,
  ShortAnswerQuestionAttributesSchema,
  EMISingleSelectQuestionAttributesSchema,
  SingleSelectQuestionSchema,
  MultiSelectQuestionSchema,
  FillInQuestionSchema,
  ShortAnswerQuestionSchema,
  EMISingleSelectQuestionSchema,
  QuestionSchema,
  type AudioUrls,
  type Explanation,
  type OptionAttributes,
  type Option,
  type BaseQuestionAttributes,
  type SingleSelectQuestionAttributes,
  type MultiSelectQuestionAttributes,
  type FillInQuestionAttributes,
  type ShortAnswerQuestionAttributes,
  type EMISingleSelectQuestionAttributes,
  type SingleSelectQuestion,
  type MultiSelectQuestion,
  type FillInQuestion,
  type ShortAnswerQuestion,
  type EMISingleSelectQuestion,
  type Question,
} from './question.schema.js';

// Output schemas
export {
  QuestionGroupAttributesSchema,
  QuestionGroupDataSchema,
  QuestionGroupSchema,
  type QuestionGroupAttributes,
  type QuestionGroupData,
  type QuestionGroup,
} from './output.schema.js';

// Supplementary PDF schemas
export {
  SupplementaryScopeTypeSchema,
  SupplementaryScopeSchema,
  SupplementaryPdfSchema,
  ExtractedAnswerSchema,
  SupplementaryExtractionResultSchema,
  type SupplementaryScopeType,
  type SupplementaryScope,
  type SupplementaryPdf,
  type ExtractedAnswer,
  type SupplementaryExtractionResult,
} from './supplementary.schema.js';
