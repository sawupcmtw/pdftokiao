import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { CardSchema } from '../../core/schemas/index.js';
const DeckParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    instruction: z.string().optional(),
});
const DeckParserOutputSchema = z.object({
    cards: z.array(CardSchema),
});
export async function parseDeck(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-deck] Parsing vocabulary cards (crossId: ${payload.crossId}) on ${pageRange}...`);
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

Return all vocabulary cards found on ${pageRange}.`;
        const { object: result, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: DeckParserOutputSchema,
            cacheKey: `deck-${payload.crossId}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-deck] ${payload.crossId}: ${metricsStr}`);
        console.log(`[parser-deck] Successfully parsed ${result.cards.length} vocabulary cards`);
        return { cards: result.cards, metrics };
    }
    catch (error) {
        console.error('[parser-deck] Error parsing vocabulary cards:', error);
        throw new Error(`Failed to parse vocabulary cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=deck.task.js.map