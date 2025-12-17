import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { MultiSelectQuestionSchema } from '../../core/schemas/index.js';
const MultiSelectParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    position: z.number().int().positive(),
    instruction: z.string().optional(),
});
export async function parseMultiSelect(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-multi-select] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`);
        const prompt = `Parse the multi-select (multiple choice with multiple correct answers) question found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Focus only on ${pageRange} and extract the following information:

1. Question attributes:
   - position: ${payload.position}
   - text: The question text (HTML supported)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Array containing all correct answers, e.g., [["A", "C"]] for options A and C
   - assessment_form: "multi_select"

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

Important: This is a multi-select question, so there may be multiple correct answers.

Return the complete question in the import API format.`;
        const { object: question, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: MultiSelectQuestionSchema,
            cacheKey: `multi-select-${payload.crossId}-${payload.position}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-multi-select] Q${payload.position}: ${metricsStr}`);
        console.log(`[parser-multi-select] Successfully parsed question ${payload.position} ` +
            `with ${question.options.length} options and ${question.attributes.answer[0]?.length || 0} correct answers`);
        return { question, metrics };
    }
    catch (error) {
        console.error('[parser-multi-select] Error parsing question:', error);
        throw new Error(`Failed to parse multi-select question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=multi-select.task.js.map