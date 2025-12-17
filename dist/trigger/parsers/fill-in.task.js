import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { FillInQuestionSchema } from '../../core/schemas/index.js';
const FillInParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    position: z.number().int().positive(),
    instruction: z.string().optional(),
});
export async function parseFillIn(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-fill-in] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`);
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

Return the complete question in the import API format.`;
        const { object: question, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: FillInQuestionSchema,
            cacheKey: `fill-in-${payload.crossId}-${payload.position}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-fill-in] Q${payload.position}: ${metricsStr}`);
        console.log(`[parser-fill-in] Successfully parsed question ${payload.position} ` +
            `with ${question.attributes.answer.length} blank(s)`);
        return { question, metrics };
    }
    catch (error) {
        console.error('[parser-fill-in] Error parsing question:', error);
        throw new Error(`Failed to parse fill-in question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=fill-in.task.js.map