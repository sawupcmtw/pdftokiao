import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { SingleSelectQuestionSchema } from '../../core/schemas/index.js';
const SingleSelectParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    position: z.number().int().positive(),
    instruction: z.string().optional(),
});
export async function parseSingleSelect(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-single-select] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`);
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

Return the complete question in the import API format.`;
        const { object: question, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: SingleSelectQuestionSchema,
            cacheKey: `single-select-${payload.crossId}-${payload.position}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-single-select] Q${payload.position}: ${metricsStr}`);
        console.log(`[parser-single-select] Successfully parsed question ${payload.position} ` +
            `with ${question.options.length} options`);
        return { question, metrics };
    }
    catch (error) {
        console.error('[parser-single-select] Error parsing question:', error);
        throw new Error(`Failed to parse single-select question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=single-select.task.js.map