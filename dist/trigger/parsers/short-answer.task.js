import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { ShortAnswerQuestionSchema } from '../../core/schemas/index.js';
const ShortAnswerParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    position: z.number().int().positive(),
    instruction: z.string().optional(),
});
export async function parseShortAnswer(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-short-answer] Parsing question at position ${payload.position} (crossId: ${payload.crossId}) on ${pageRange}...`);
        const prompt = `Parse the short-answer or essay question found on ${pageRange} of this PDF.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Focus only on ${pageRange} and extract the following information:

1. Question attributes:
   - position: ${payload.position}
   - text: The question text (HTML supported)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Empty array [[]] (short-answer questions don't have predefined answers)
   - assessment_form: "short_answer"

2. Optional explanation:
   - note: Guidance, rubric, or sample answer (or null)
   - translation: Translation if present (or null)
   - vocabs_note: Vocabulary notes (or null)

Note: Short-answer questions do NOT have options and do NOT have a specific answer array.

Return the complete question in the import API format.`;
        const { object: question, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: ShortAnswerQuestionSchema,
            cacheKey: `short-answer-${payload.crossId}-${payload.position}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-short-answer] Q${payload.position}: ${metricsStr}`);
        console.log(`[parser-short-answer] Successfully parsed question ${payload.position}`);
        return { question, metrics };
    }
    catch (error) {
        console.error('[parser-short-answer] Error parsing question:', error);
        throw new Error(`Failed to parse short-answer question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=short-answer.task.js.map