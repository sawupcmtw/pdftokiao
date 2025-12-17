import { z } from 'zod'
import { generateStructured, type CallMetrics } from '../../core/ai/gemini-client.js'
import { FillInQuestionSchema, type FillInQuestion } from '../../core/schemas/index.js'

/**
 * Input schema for fill-in parser
 */
const FillInParserInputSchema = z.object({
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

export type FillInParserInput = z.infer<typeof FillInParserInputSchema>

/** Output with metrics for aggregation */
export interface FillInParserResult {
  question: FillInQuestion
  metrics: CallMetrics
}

/**
 * Parse fill-in questions
 *
 * This function parses fill-in-the-blank questions from PDF pages.
 * Fill-in questions don't have options - the answer is directly provided.
 * It extracts:
 * - Question text, latex, audio URLs, image URL
 * - Answer array (can have multiple blanks and multiple acceptable answers)
 * - Optional blank_identifier for numbered blanks
 * - Optional explanations
 */
export async function parseFillIn(payload: FillInParserInput): Promise<FillInParserResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]
  const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`

  try {
    console.log(
      `[parser-fill-in] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`
    )

    // Create prompt for parsing
    const prompt = `Parse the fill-in-the-blank question found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Focus only on ${pageRange} and extract the following information:

1. Question attributes:
   - position: ${payload.position}
   - text: The question text with blanks indicated (HTML supported, use ___ or similar for blanks)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Array of arrays with acceptable answers for each blank
     Example: [["answer1", "alt1"], ["answer2"]] for two blanks
     Or: [["single answer"]] for one blank with one answer
   - blank_identifier: If blanks are numbered (e.g., "(1)", "(2)"), specify format (or omit)
   - assessment_form: "fill_in"

2. Optional explanation:
   - note: Explanation or rationale (or null)
   - translation: Translation if present (or null)
   - vocabs_note: Vocabulary notes (or null)

Note: Fill-in questions do NOT have options.

Return the complete question in the import API format.`

    // Use Gemini to parse the question from PDF
    const { object: question, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: FillInQuestionSchema,
      cacheKey: `fill-in-${payload.crossId}-${payload.position}`,
    })

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`
    console.log(`[parser-fill-in] Q${payload.position}: ${metricsStr}`)

    console.log(
      `[parser-fill-in] Successfully parsed question ${payload.position} ` +
        `with ${question.attributes.answer.length} blank(s)`
    )

    return { question, metrics }
  } catch (error) {
    console.error('[parser-fill-in] Error parsing question:', error)
    throw new Error(
      `Failed to parse fill-in question: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
