import { z } from 'zod';
import { generateStructured } from '../core/ai/gemini-client.js';
import { PageMapSchema } from '../core/schemas/index.js';
const QuestionTypeEnum = z.enum([
    'single_select',
    'multi_select',
    'fill_in',
    'short_answer',
    'emi_single_select',
    'deck',
]);
const PageAnalyzerInputSchema = z.object({
    pdf: z.instanceof(Buffer),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    hintTags: z.array(z.object({
        imageIndex: z.number(),
        type: QuestionTypeEnum,
        description: z.string(),
    })),
});
const PageAnalyzerOutputSchema = z.object({
    pageMaps: z.array(PageMapSchema),
});
export async function analyzePages(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    try {
        console.log(`[page-analyzer] Analyzing pages ${startPage}-${endPage} with ${payload.hintTags.length} hints...`);
        const hasHints = payload.hintTags.length > 0;
        const hintsSummary = hasHints
            ? payload.hintTags
                .map((tag) => `- Hint ${tag.imageIndex + 1}: ${tag.type} - ${tag.description}`)
                .join('\n')
            : '';
        const prompt = hasHints
            ? `Analyze pages ${startPage} to ${endPage} of this PDF and map each page to the questions it contains.

Available hints:
${hintsSummary}

For each page in the range (${startPage} to ${endPage}), identify:
1. What question(s) appear on that page
2. The question type (single_select, multi_select, fill_in, short_answer, emi_single_select, deck)
3. A brief description
4. A crossId to group questions that span multiple pages (use format: "q1", "q2", etc.)

Guidelines:
- If a question spans multiple pages, use the same crossId for all pages
- Each page can contain parts of multiple questions
- Use the hints to help identify question types
- Only analyze pages ${startPage} through ${endPage}

Return a page map for each page showing what's included.`
            : `Analyze pages ${startPage} to ${endPage} of this PDF and AUTO-DETECT the content type and questions.

NO HINT IMAGES WERE PROVIDED - you must detect the content type directly from the PDF.

For each page in the range (${startPage} to ${endPage}), identify:
1. What question(s) or content appear on that page
2. The content type - detect from these options:
   - single_select: Multiple choice with ONE correct answer (radio buttons, circles, or numbered options)
   - multi_select: Multiple choice with MULTIPLE correct answers (checkboxes, "select all that apply")
   - fill_in: Fill-in-the-blank questions (blanks, underscores, or spaces to fill)
   - short_answer: Open-ended questions requiring written responses
   - emi_single_select: Extended Matching Items / 配合題 - SHARED OPTIONS across multiple questions
     (Look for: a list of options A, B, C, D... followed by multiple sub-questions that reference those options)
   - deck: Vocabulary/flashcard content (word lists with definitions, translations, example sentences)
3. A brief description
4. A crossId to group related content (use format: "q1", "q2", etc.)

Detection hints:
- EMI (emi_single_select): Look for a shared option list at the top, followed by multiple questions that say things like "Which option best describes..." or "Match the following..."
- Deck (vocabulary): Look for word lists with translations, parts of speech (n., v., adj.), example sentences, or definitions
- Single/Multi select: Look for (A) (B) (C) (D) style options with circle/checkbox indicators
- Fill-in: Look for _____ or blank spaces in sentences
- Short answer: Look for questions followed by answer lines or "Explain..." type prompts

Guidelines:
- If content spans multiple pages, use the same crossId for all pages
- Each page can contain different types of content
- Be careful to distinguish EMI from regular multiple choice (EMI has SHARED options across questions)
- Only analyze pages ${startPage} through ${endPage}

Return a page map for each page showing what's included.`;
        const { object: result, metrics } = await generateStructured({
            prompt,
            pdf: payload.pdf,
            schema: z.object({
                pageMaps: z.array(PageMapSchema),
            }),
            cacheKey: `page-analysis-${startPage}-${endPage}`,
        });
        const metricsStr = metrics.cacheHit
            ? 'CACHE HIT'
            : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
        console.log(`[page-analyzer] Pages ${startPage}-${endPage}: ${metricsStr}`);
        console.log(`[page-analyzer] Generated ${result.pageMaps.length} page maps`);
        result.pageMaps.forEach((pageMap) => {
            const items = pageMap.included
                .map((item) => `${item.type}${item.crossId ? ` (${item.crossId})` : ''}`)
                .join(', ');
            console.log(`[page-analyzer] Page ${pageMap.page}: ${items}`);
        });
        return { output: { pageMaps: result.pageMaps }, metrics };
    }
    catch (error) {
        console.error('[page-analyzer] Error analyzing pages:', error);
        throw new Error(`Failed to analyze PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=page-analyzer.task.js.map