import { z } from 'zod'
import { generateStructured, type CallMetrics } from '../core/ai/gemini-client.js'
import { PageMapSchema } from '../core/schemas/index.js'

/**
 * Supported question types for page analysis
 */
export const QuestionTypeEnum = z.enum([
  'single_select',
  'multi_select',
  'fill_in',
  'short_answer',
  'emi_single_select',
  'deck',
])

export type QuestionType = z.infer<typeof QuestionTypeEnum>

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

  /** Hint tags from the hint tagger (optional - will auto-detect if empty) */
  hintTags: z.array(
    z.object({
      imageIndex: z.number(),
      type: QuestionTypeEnum,
      description: z.string(),
    })
  ),

  /** Optional instruction for filtering/guidance */
  instruction: z.string().optional(),
})

export type PageAnalyzerInput = z.infer<typeof PageAnalyzerInputSchema>

/**
 * Output schema for page analyzer
 */
const PageAnalyzerOutputSchema = z.object({
  /** Array of page maps showing what's included on each page */
  pageMaps: z.array(PageMapSchema),
})

export type PageAnalyzerOutput = z.infer<typeof PageAnalyzerOutputSchema>

/** Output with metrics for aggregation */
export interface PageAnalyzerResult {
  output: PageAnalyzerOutput
  metrics: CallMetrics
}

/**
 * Analyze PDF pages
 *
 * This function analyzes PDF pages to match hints to pages and detect questions.
 * It uses the hint tags to understand what question types to look for,
 * then maps each page to the questions it contains.
 */
export async function analyzePages(payload: PageAnalyzerInput): Promise<PageAnalyzerResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]

  try {
    console.log(
      `[page-analyzer] Analyzing pages ${startPage}-${endPage} with ${payload.hintTags.length} hints...`
    )

    // Check if we have hints or need to auto-detect
    const hasHints = payload.hintTags.length > 0

    // Create a summary of hint tags for context
    const hintsSummary = hasHints
      ? payload.hintTags
          .map((tag) => `- Hint ${tag.imageIndex + 1}: ${tag.type} - ${tag.description}`)
          .join('\n')
      : ''

    // Build instruction section if provided
    const instructionSection = payload.instruction
      ? `\nUser instructions: ${payload.instruction}\nFollow these instructions when deciding what content to include or exclude.\n`
      : ''

    // Prepare prompt for analyzing pages
    const prompt = hasHints
      ? `Analyze pages ${startPage} to ${endPage} of this PDF and map each page to the questions it contains.
${instructionSection}
Available hints:
${hintsSummary}

For each page in the range (${startPage} to ${endPage}), identify:
1. What question(s) appear on that page
2. The question type (single_select, multi_select, fill_in, short_answer, emi_single_select, deck)
3. A brief description
4. A crossId to group questions that span multiple pages (use format: "q1", "q2", etc.)
5. A groupId to separate INDEPENDENT question sets (use format: "group-1", "group-2", etc.)

Guidelines for crossId:
- If a question spans multiple pages, use the same crossId for all pages
- Each page can contain parts of multiple questions
- Use the hints to help identify question types

Guidelines for groupId:
- Questions belong to the SAME group if they:
  - Share a common reading passage or context
  - Are part of the same EMI question set (with shared options)
  - Appear under the same section header
  - Are clearly meant to be answered together
- Questions belong to DIFFERENT groups if they:
  - Have different section headers (e.g., "Part A", "Part B", "Section 1")
  - Have separate reading passages or contexts
  - Are clearly independent question sets
- Default to "group-1" if all questions appear to be part of the same set
- EMI questions with shared options MUST all have the same groupId

General guidelines:
- Only analyze pages ${startPage} through ${endPage}
- If user instructions specify to skip or exclude certain sections, do not include them in the output

Return a page map for each page showing what's included.`
      : `Analyze pages ${startPage} to ${endPage} of this PDF and AUTO-DETECT the content type and questions.

NO HINT IMAGES WERE PROVIDED - you must detect the content type directly from the PDF.
${instructionSection}
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
5. A groupId to separate INDEPENDENT question sets (use format: "group-1", "group-2", etc.)

Detection hints:
- EMI (emi_single_select): Look for a shared option list at the top, followed by multiple questions that say things like "Which option best describes..." or "Match the following..."
- Deck (vocabulary): Look for word lists with translations, parts of speech (n., v., adj.), example sentences, or definitions
- Single/Multi select: Look for (A) (B) (C) (D) style options with circle/checkbox indicators
- Fill-in: Look for _____ or blank spaces in sentences
- Short answer: Look for questions followed by answer lines or "Explain..." type prompts

Guidelines for crossId:
- If content spans multiple pages, use the same crossId for all pages
- Each page can contain different types of content
- Be careful to distinguish EMI from regular multiple choice (EMI has SHARED options across questions)

Guidelines for groupId:
- Questions belong to the SAME group if they:
  - Share a common reading passage or context
  - Are part of the same EMI question set (with shared options)
  - Appear under the same section header
  - Are clearly meant to be answered together
- Questions belong to DIFFERENT groups if they:
  - Have different section headers (e.g., "Part A", "Part B", "Section 1")
  - Have separate reading passages or contexts
  - Are clearly independent question sets
- Default to "group-1" if all questions appear to be part of the same set
- EMI questions with shared options MUST all have the same groupId

General guidelines:
- Only analyze pages ${startPage} through ${endPage}
- If user instructions specify to skip or exclude certain sections, do not include them in the output

Return a page map for each page showing what's included.`

    // Build cache key (include instruction hash if present to avoid stale cache)
    const instructionHash = payload.instruction
      ? `-inst-${Buffer.from(payload.instruction).toString('base64').slice(0, 16)}`
      : ''
    const cacheKey = `page-analysis-${startPage}-${endPage}${instructionHash}`

    // Analyze PDF directly
    const { object: result, metrics } = await generateStructured({
      prompt,
      pdf: payload.pdf,
      schema: z.object({
        pageMaps: z.array(PageMapSchema),
      }),
      cacheKey,
    })

    // Log metrics
    const metricsStr = metrics.cacheHit
      ? 'CACHE HIT'
      : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`
    console.log(`[page-analyzer] Pages ${startPage}-${endPage}: ${metricsStr}`)

    console.log(`[page-analyzer] Generated ${result.pageMaps.length} page maps`)

    // Log details for debugging
    result.pageMaps.forEach((pageMap) => {
      const items = pageMap.included
        .map((item) => {
          const ids = [item.crossId, item.groupId].filter(Boolean).join(', ')
          return `${item.type}${ids ? ` (${ids})` : ''}`
        })
        .join(', ')
      console.log(`[page-analyzer] Page ${pageMap.page}: ${items}`)
    })

    return { output: { pageMaps: result.pageMaps }, metrics }
  } catch (error) {
    console.error('[page-analyzer] Error analyzing pages:', error)
    throw new Error(
      `Failed to analyze PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
