import { z } from 'zod';
import { generateStructured } from '../core/ai/gemini-client.js';
import { HintTagSchema } from '../core/schemas/index.js';
const HintTaggerInputSchema = z.object({
    hints: z.array(z.instanceof(Buffer)),
});
const HintTaggerOutputSchema = z.object({
    tags: z.array(HintTagSchema),
});
export async function tagHints(payload) {
    try {
        console.log(`[hint-tagger] Processing ${payload.hints.length} hint images...`);
        const tags = [];
        const allMetrics = [];
        for (let imageIndex = 0; imageIndex < payload.hints.length; imageIndex++) {
            const hintBuffer = payload.hints[imageIndex];
            if (!hintBuffer) {
                throw new Error(`Hint buffer at index ${imageIndex} is undefined`);
            }
            console.log(`[hint-tagger] Analyzing hint image ${imageIndex + 1}/${payload.hints.length}...`);
            const prompt = `Analyze this hint image and determine the question type.

Question types:
- single_select: Multiple choice question with one correct answer
- multi_select: Multiple choice question with multiple correct answers
- fill_in: Fill-in-the-blank question
- short_answer: Short answer or essay question

Provide:
1. The question type
2. A brief description of what the hint shows

Return the result in the specified format.`;
            const { object: result, metrics } = await generateStructured({
                prompt,
                images: [hintBuffer],
                schema: z.object({
                    type: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),
                    description: z.string(),
                }),
                cacheKey: `hint-tag-${imageIndex}`,
            });
            allMetrics.push(metrics);
            const metricsStr = metrics.cacheHit
                ? 'CACHE HIT'
                : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
            console.log(`[hint-tagger] Hint ${imageIndex + 1}: ${metricsStr}`);
            tags.push({
                imageIndex,
                type: result.type,
                description: result.description,
            });
            console.log(`[hint-tagger] Hint ${imageIndex + 1}: type=${result.type}, description="${result.description}"`);
        }
        console.log(`[hint-tagger] Completed tagging ${tags.length} hints`);
        return { output: { tags }, metrics: allMetrics };
    }
    catch (error) {
        console.error('[hint-tagger] Error processing hints:', error);
        throw new Error(`Failed to tag hint images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=hint-tagger.task.js.map