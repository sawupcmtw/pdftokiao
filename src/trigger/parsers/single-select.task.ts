import { z } from 'zod'
import { generateStructured, type CallMetrics } from '../../core/ai/gemini-client.js'
import { SingleSelectQuestionSchema, type SingleSelectQuestion } from '../../core/schemas/index.js'

/**
 * Input schema for single-select parser
 */
const SingleSelectParserInputSchema = z.object({
  /** PDF file as Buffer */
  pdf: z.instanceof(Buffer),

  /** Page range containing this question - [start] or [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Description from page analyzer */
  description: z.string(),

  /** Cross-reference ID for grouping */
  crossId: z.string(),

  /** Position in the question group */
  position: z.number().int().positive(),

  /** Optional instruction for parsing guidance */
  instruction: z.string().optional(),
})

export type SingleSelectParserInput = z.infer<typeof SingleSelectParserInputSchema>

/** Output with metrics for aggregation */
export interface SingleSelectParserResult {
  question: SingleSelectQuestion
  metrics: CallMetrics
}

/**
 * Parse single-select questions
 *
 * This function parses single-select (multiple choice with one answer) questions from PDF pages.
 * It extracts:
 * - Question text, latex, audio URLs, image URL
 * - Options with symbols, text, latex, audio, and images
 * - Correct answer
 * - Optional explanations for question and options
 */
export async function parseSingleSelect(
  payload: SingleSelectParserInput
): Promise<SingleSelectParserResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]
  const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`

  try {
    console.log(
      `[parser-single-select] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`
    )

    // Create prompt for parsing
    const prompt = `Parse the single-select (multiple choice) question found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Focus only on ${pageRange} and extract the following information:

1. Question attributes:
   - position: ${payload.position}
   - text: The question text (HTML supported)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Array containing the correct answer(s), e.g., [["A"]] for option A
   - assessment_form: "single_select"

2. Options (array):
   - symbol: Option letter (A, B, C, D, etc.)
   - text: Option text
   - latex: LaTeX if present (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)

3. Optional explanation:
   - note: Explanation or rationale (or null)
   - translation: Translation if present (or null)
   - vocabs_note: Vocabulary notes (or null)

4. Optional per-option explanations

Return the complete question in the import API format.`

    // Use Gemini to parse the question from PDF
    const { object: question, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: SingleSelectQuestionSchema,
      cacheKey: `single-select-${payload.crossId}-${payload.position}`,
    })

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, $${metrics.usage.cost.toFixed(6)}, ${metrics.latencyMs}ms`
    console.log(`[parser-single-select] Q${payload.position}: ${metricsStr}`)

    console.log(
      `[parser-single-select] Successfully parsed question ${payload.position} ` +
        `with ${question.options.length} options`
    )

    return { question, metrics }
  } catch (error) {
    console.error('[parser-single-select] Error parsing question:', error)
    throw new Error(
      `Failed to parse single-select question: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
