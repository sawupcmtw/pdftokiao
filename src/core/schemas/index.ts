// Zod schemas for validation

// Input schemas
export { ParseInputSchema, type ParseInput } from './input.schema.js'

// Hint schemas
export { HintTagSchema, type HintTag } from './hint.schema.js'

// Page map schemas
export { PageMapSchema, PageItemSchema, type PageMap, type PageItem } from './page-map.schema.js'

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
} from './question.schema.js'

// Output schemas
export {
  QuestionGroupAttributesSchema,
  QuestionGroupDataSchema,
  QuestionGroupSchema,
  DeckOutputSchema,
  OrchestratorOutputSchema,
  type QuestionGroupAttributes,
  type QuestionGroupData,
  type QuestionGroup,
  type DeckOutput,
  type OrchestratorOutput,
  type AICallLog,
  type PipelineMetrics,
  type OrchestratorResult,
} from './output.schema.js'

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
} from './supplementary.schema.js'

// Deck schemas
export {
  WordTypeSchema,
  CardExplanationSchema,
  CardTextContentSchema,
  CardAttributesSchema,
  CardSchema,
  DeckAttributesSchema,
  DeckSchema,
  DeckDataSchema,
  type WordType,
  type CardExplanation,
  type CardTextContent,
  type CardAttributes,
  type Card,
  type DeckAttributes,
  type Deck,
  type DeckData,
} from './deck.schema.js'
