import { z } from 'zod'
import { generateStructured, type CallMetrics } from '../../core/ai/gemini-client.js'
import { CardSchema, type Card } from '../../core/schemas/index.js'

/**
 * Input schema for deck parser
 */
const DeckParserInputSchema = z.object({
  /** PDF file as Buffer */
  pdf: z.instanceof(Buffer),

  /** Page range containing vocabulary content - [start] or [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Description from page analyzer */
  description: z.string(),

  /** Cross-reference ID for grouping */
  crossId: z.string(),

  /** Optional instruction for parsing guidance */
  instruction: z.string().optional(),
})

export type DeckParserInput = z.infer<typeof DeckParserInputSchema>

/**
 * Schema for deck parser output from AI
 */
const DeckParserOutputSchema = z.object({
  /** Array of vocabulary cards */
  cards: z.array(CardSchema),
})

/** Output with metrics for aggregation */
export interface DeckParserResult {
  cards: Card[]
  metrics: CallMetrics
}

/**
 * Parse vocabulary cards (Deck content) from PDF
 *
 * This parser extracts vocabulary/flashcard content including:
 * - Words with their definitions
 * - Translations (Chinese/English)
 * - Example sentences
 * - Parts of speech (n., v., adj., etc.)
 * - Synonyms, antonyms, similar words
 *
 * The output matches the Kiao import API Deck format.
 */
export async function parseDeck(payload: DeckParserInput): Promise<DeckParserResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]
  const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`

  try {
    console.log(
      `[parser-deck] Parsing vocabulary cards (crossId: ${payload.crossId}) on ${pageRange}...`
    )

    // Create prompt for parsing vocabulary cards
    const prompt = `Parse the vocabulary/flashcard content found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Extract each vocabulary word with its full information:

For each word, extract:
1. word: The vocabulary word itself
2. text_content.explanations (array - one entry per meaning/part of speech):
   - translations: Array of translations/definitions (both English and Chinese if available)
   - sentences: Example sentences showing usage (both English and Chinese if available)
   - synonyms: Similar meaning words
   - antonyms: Opposite meaning words
   - similars: Related words
   - word_types: Parts of speech (use these exact values):
     * n - noun
     * n[C] - countable noun
     * n[U] - uncountable noun
     * adj - adjective
     * v - verb
     * vi - intransitive verb
     * vt - transitive verb
     * adv - adverb
     * prep - preposition
     * phrase - phrase/idiom
     * conj - conjunction
     * aux - auxiliary verb
     * int - interjection
     * pron - pronoun
     * det - determiner
     * art - article
     * abbr - abbreviation
   - notes: Additional notes (phrases, usage tips, etc.)
3. tags: Any category tags
4. word_root: Etymology or root word (if mentioned)
5. notes: General notes for the card

Important:
- A word can have multiple meanings - create separate explanation entries for each
- Include both English and Chinese content when available
- Extract example sentences if provided
- Preserve the exact word forms shown in the PDF

Return all vocabulary cards found on ${pageRange}.`

    // Use Gemini to parse the vocabulary cards from PDF
    const { object: result, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: DeckParserOutputSchema,
      cacheKey: `deck-${payload.crossId}`,
    })

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, $${metrics.usage.cost.toFixed(6)}, ${metrics.latencyMs}ms`
    console.log(`[parser-deck] ${payload.crossId}: ${metricsStr}`)

    console.log(`[parser-deck] Successfully parsed ${result.cards.length} vocabulary cards`)

    return { cards: result.cards, metrics }
  } catch (error) {
    console.error('[parser-deck] Error parsing vocabulary cards:', error)
    throw new Error(
      `Failed to parse vocabulary cards: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
