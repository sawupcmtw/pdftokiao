import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import { EMISingleSelectQuestionSchema, OptionSchema, ExplanationSchema, } from '../../core/schemas/index.js';
const EMISingleSelectParserInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    description: z.string(),
    crossId: z.string(),
    startPosition: z.number().int().positive(),
    instruction: z.string().optional(),
});
const EMIGroupOutputSchema = z.object({
    text: z.string().nullable().optional(),
    options: z.array(OptionSchema),
    explanation: ExplanationSchema.optional(),
    questions: z.array(EMISingleSelectQuestionSchema),
});
export async function parseEMISingleSelect(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const pageRange = startPage === endPage ? `page ${startPage}` : `pages ${startPage}-${endPage}`;
    try {
        console.log(`[parser-emi-single-select] Parsing EMI question group (crossId: ${payload.crossId}) on ${pageRange}...`);
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

Return the complete EMI question group in the import API format.`;
        const { object: emiGroup, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: EMIGroupOutputSchema,
            cacheKey: `emi-single-select-${payload.crossId}-${payload.startPosition}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[parser-emi-single-select] ${payload.crossId}: ${metricsStr}`);
        console.log(`[parser-emi-single-select] Successfully parsed ${emiGroup.questions.length} questions ` +
            `with ${emiGroup.options.length} shared options`);
        return {
            groupText: emiGroup.text ?? null,
            groupOptions: emiGroup.options,
            groupExplanation: emiGroup.explanation,
            questions: emiGroup.questions,
            metrics,
        };
    }
    catch (error) {
        console.error('[parser-emi-single-select] Error parsing EMI questions:', error);
        throw new Error(`Failed to parse EMI single-select questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=emi-single-select.task.js.map