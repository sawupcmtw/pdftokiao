import { z } from 'zod';
import { generateStructured, type CallMetrics } from '../core/ai/gemini-client.js';
import { PageMapSchema } from '../core/schemas/index.js';

/**
 * Input schema for page analyzer
 */
const PageAnalyzerInputSchema = z.object({
  /** PDF file as Buffer */
  pdf: z.instanceof(Buffer),

  /** Page range to analyze - [start] or [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Hint tags from the hint tagger */
  hintTags: z.array(
    z.object({
      imageIndex: z.number(),
      type: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),
      description: z.string(),
    })
  ),
});

export type PageAnalyzerInput = z.infer<typeof PageAnalyzerInputSchema>;

/**
 * Output schema for page analyzer
 */
const PageAnalyzerOutputSchema = z.object({
  /** Array of page maps showing what's included on each page */
  pageMaps: z.array(PageMapSchema),
});

export type PageAnalyzerOutput = z.infer<typeof PageAnalyzerOutputSchema>;

/** Output with metrics for aggregation */
export interface PageAnalyzerResult {
  output: PageAnalyzerOutput;
  metrics: CallMetrics;
}

/**
 * Analyze PDF pages
 *
 * This function analyzes PDF pages to match hints to pages and detect questions.
 * It uses the hint tags to understand what question types to look for,
 * then maps each page to the questions it contains.
 */
export async function analyzePages(payload: PageAnalyzerInput): Promise<PageAnalyzerResult> {
  const startPage = payload.pages[0];
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];

  try {
    console.log(
      `[page-analyzer] Analyzing pages ${startPage}-${endPage} with ${payload.hintTags.length} hints...`
    );

    // Create a summary of hint tags for context
    const hintsSummary =
      payload.hintTags.length > 0
        ? payload.hintTags
            .map((tag) => `- Hint ${tag.imageIndex + 1}: ${tag.type} - ${tag.description}`)
            .join('\n')
        : 'No hints provided';

    // Prepare prompt for analyzing pages
    const prompt = `Analyze pages ${startPage} to ${endPage} of this PDF and map each page to the questions it contains.

Available hints:
${hintsSummary}

For each page in the range (${startPage} to ${endPage}), identify:
1. What question(s) appear on that page
2. The question type (single_select, multi_select, fill_in, short_answer)
3. A brief description
4. A crossId to group questions that span multiple pages (use format: "q1", "q2", etc.)

Guidelines:
- If a question spans multiple pages, use the same crossId for all pages
- Each page can contain parts of multiple questions
- Use the hints to help identify question types
- Only analyze pages ${startPage} through ${endPage}

Return a page map for each page showing what's included.`;

    // Analyze PDF directly
    const { object: result, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: z.object({
        pageMaps: z.array(PageMapSchema),
      }),
      cacheKey: `page-analysis-${startPage}-${endPage}`,
    });

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, $${metrics.usage.cost.toFixed(6)}, ${metrics.latencyMs}ms`;
    console.log(`[page-analyzer] Pages ${startPage}-${endPage}: ${metricsStr}`);

    console.log(`[page-analyzer] Generated ${result.pageMaps.length} page maps`);

    // Log details for debugging
    result.pageMaps.forEach((pageMap) => {
      const items = pageMap.included
        .map((item) => `${item.type}${item.crossId ? ` (${item.crossId})` : ''}`)
        .join(', ');
      console.log(`[page-analyzer] Page ${pageMap.page}: ${items}`);
    });

    return { output: { pageMaps: result.pageMaps }, metrics };
  } catch (error) {
    console.error('[page-analyzer] Error analyzing pages:', error);
    throw new Error(
      `Failed to analyze PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
