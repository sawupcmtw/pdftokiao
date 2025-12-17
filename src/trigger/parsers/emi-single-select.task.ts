import { z } from 'zod'
import { generateStructured, type CallMetrics } from '../../core/ai/gemini-client.js'
import {
  EMISingleSelectQuestionSchema,
  OptionSchema,
  ExplanationSchema,
  type EMISingleSelectQuestion,
  type Option,
  type Explanation,
} from '../../core/schemas/index.js'

/**
 * Input schema for EMI single-select parser
 */
const EMISingleSelectParserInputSchema = z.object({
  /** PDF file as Buffer */
  pdf: z.instanceof(Buffer),

  /** Page range containing this question group - [start] or [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Description from page analyzer */
  description: z.string(),

  /** Cross-reference ID for grouping */
  crossId: z.string(),

  /** Starting position in the question group */
  startPosition: z.number().int().positive(),

  /** Optional instruction for parsing guidance */
  instruction: z.string().optional(),
})

export type EMISingleSelectParserInput = z.infer<typeof EMISingleSelectParserInputSchema>

/**
 * Schema for EMI group-level output from AI
 * This captures shared options and reading passage at the group level
 */
const EMIGroupOutputSchema = z.object({
  /** Optional reading passage or context for the question group */
  text: z.string().nullable().optional(),

  /** Shared options across all questions in the group */
  options: z.array(OptionSchema),

  /** Optional explanation for the entire group */
  explanation: ExplanationSchema.optional(),

  /** Array of individual questions */
  questions: z.array(EMISingleSelectQuestionSchema),
})

/** Output with metrics for aggregation */
export interface EMISingleSelectParserResult {
  /** Group-level text (reading passage) */
  groupText: string | null
  /** Shared options at group level */
  groupOptions: Option[]
  /** Group-level explanation */
  groupExplanation: Explanation | undefined
  /** Individual questions */
  questions: EMISingleSelectQuestion[]
  /** Metrics from the API call */
  metrics: CallMetrics
}

/**
 * Parse EMI (Extended Matching Items) single-select questions
 *
 * EMI questions are characterized by:
 * - A set of shared options (A, B, C, D, etc.) that apply to all questions
 * - Optional reading passage or context
 * - Multiple sub-questions that reference the shared options
 *
 * This parser extracts:
 * - Shared options at the group level
 * - Optional reading passage
 * - Individual questions with their answers referencing the shared options
 */
export async function parseEMISingleSelect(
  payload: EMISingleSelectParserInput
): Promise<EMISingleSelectParserResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]
  const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`

  try {
    console.log(
      `[parser-emi-single-select] Parsing EMI question group (crossId: ${payload.crossId}) on ${pageRange}...`
    )

    // Create prompt for parsing EMI questions
    const prompt = `Parse the EMI (Extended Matching Items / 配合題) question group found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

EMI questions have SHARED OPTIONS that apply to ALL questions in the group. Each question asks the student to match or select from these shared options.

Focus only on ${pageRange} and extract the following information:

1. Group-level content:
   - text: Reading passage or context (if any, otherwise null)
   - options: The SHARED options that all questions reference (array with symbol, text, etc.)
   - explanation: Group-level explanation (translation of passage, notes, etc.)

2. For each sub-question, extract:
   - position: Starting from ${payload.startPosition}
   - assessment_form: "emi_single_select"
   - text: The question text (HTML supported)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Array containing the correct answer(s), e.g., [["B"]] referencing the shared options
   - explanation: Question-specific explanation (note, translation, vocabs_note)

3. For shared options (at group level):
   - symbol: Option letter (A, B, C, D, etc.)
   - text: Option text
   - latex: LaTeX if present (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - explanation: Optional per-option explanation

Important:
- The options are SHARED across all questions - extract them only once at the group level
- Each question's answer references these shared options by symbol (A, B, C, etc.)
- Questions in EMI groups typically ask "Which option best describes X?" or similar

Return the complete EMI question group in the import API format.`

    // Use Gemini to parse the EMI questions from PDF
    const { object: emiGroup, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: EMIGroupOutputSchema,
      cacheKey: `emi-single-select-${payload.crossId}-${payload.startPosition}`,
    })

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`
    console.log(`[parser-emi-single-select] ${payload.crossId}: ${metricsStr}`)

    console.log(
      `[parser-emi-single-select] Successfully parsed ${emiGroup.questions.length} questions ` +
        `with ${emiGroup.options.length} shared options`
    )

    return {
      groupText: emiGroup.text ?? null,
      groupOptions: emiGroup.options,
      groupExplanation: emiGroup.explanation,
      questions: emiGroup.questions,
      metrics,
    }
  } catch (error) {
    console.error('[parser-emi-single-select] Error parsing EMI questions:', error)
    throw new Error(
      `Failed to parse EMI single-select questions: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
