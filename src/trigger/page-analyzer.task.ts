import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { generateStructured } from '../core/ai/gemini-client.js';
import { PageMapSchema, type PageMap, type HintTag } from '../core/schemas/index.js';

/**
 * Input schema for page analyzer task
 */
const PageAnalyzerInputSchema = z.object({
  /** Array of PDF page Buffers (images) */
  pages: z.array(z.instanceof(Buffer)),

  /** Hint tags from the hint tagger */
  hintTags: z.array(
    z.object({
      imageIndex: z.number(),
      type: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),
      description: z.string(),
    })
  ),

  /** Starting page number (for correct page numbering) */
  startPage: z.number().int().positive(),
});

type PageAnalyzerInput = z.infer<typeof PageAnalyzerInputSchema>;

/**
 * Output schema for page analyzer task
 */
const PageAnalyzerOutputSchema = z.object({
  /** Array of page maps showing what's included on each page */
  pageMaps: z.array(PageMapSchema),
});

type PageAnalyzerOutput = z.infer<typeof PageAnalyzerOutputSchema>;

/**
 * Agent 2: Analyze PDF pages
 *
 * This task analyzes PDF pages to match hints to pages and detect questions.
 * It uses the hint tags to understand what question types to look for,
 * then maps each page to the questions it contains.
 */
export const pageAnalyzerTask = task({
  id: 'page-analyzer',
  run: async (payload: PageAnalyzerInput): Promise<PageAnalyzerOutput> => {
    try {
      console.log(`[page-analyzer] Analyzing ${payload.pages.length} pages with ${payload.hintTags.length} hints...`);

      // Create a summary of hint tags for context
      const hintsSummary = payload.hintTags
        .map((tag) => `- Hint ${tag.imageIndex + 1}: ${tag.type} - ${tag.description}`)
        .join('\n');

      // Prepare prompt for analyzing all pages together
      const prompt = `Analyze these PDF pages and map each page to the questions it contains.

Available hints:
${hintsSummary}

For each page, identify:
1. What question(s) appear on that page
2. The question type (single_select, multi_select, fill_in, short_answer)
3. A brief description
4. A crossId to group questions that span multiple pages (use format: "q1", "q2", etc.)

Guidelines:
- If a question spans multiple pages, use the same crossId for all pages
- Each page can contain parts of multiple questions
- Use the hints to help identify question types
- Number pages starting from ${payload.startPage}

Return a page map for each page showing what's included.`;

      // Analyze all pages together for better context
      const result = await generateStructured({
        prompt,
        images: payload.pages,
        schema: z.object({
          pageMaps: z.array(PageMapSchema),
        }),
        cacheKey: `page-analysis-${payload.startPage}-${payload.pages.length}`,
      });

      console.log(`[page-analyzer] Generated ${result.pageMaps.length} page maps`);

      // Log details for debugging
      result.pageMaps.forEach((pageMap) => {
        const items = pageMap.included.map((item) =>
          `${item.type}${item.crossId ? ` (${item.crossId})` : ''}`
        ).join(', ');
        console.log(`[page-analyzer] Page ${pageMap.page}: ${items}`);
      });

      return { pageMaps: result.pageMaps };
    } catch (error) {
      console.error('[page-analyzer] Error analyzing pages:', error);
      throw new Error(
        `Failed to analyze PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
