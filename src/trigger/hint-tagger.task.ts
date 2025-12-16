import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { generateStructured } from '../core/ai/gemini-client.js';
import { HintTagSchema, type HintTag } from '../core/schemas/index.js';

/**
 * Input schema for hint tagger task
 */
const HintTaggerInputSchema = z.object({
  /** Array of hint image Buffers */
  hints: z.array(z.instanceof(Buffer)),
});

type HintTaggerInput = z.infer<typeof HintTaggerInputSchema>;

/**
 * Output schema for hint tagger task
 */
const HintTaggerOutputSchema = z.object({
  /** Array of hint tags with question type detection */
  tags: z.array(HintTagSchema),
});

type HintTaggerOutput = z.infer<typeof HintTaggerOutputSchema>;

/**
 * Agent 1: Tag hint images
 *
 * This task analyzes hint images to detect question types and generate descriptions.
 * It processes each hint image using Gemini to identify:
 * - Question type (single_select, multi_select, fill_in, short_answer)
 * - Description of the hint content
 */
export const hintTaggerTask = task({
  id: 'hint-tagger',
  run: async (payload: HintTaggerInput): Promise<HintTaggerOutput> => {
    try {
      console.log(`[hint-tagger] Processing ${payload.hints.length} hint images...`);

      const tags: HintTag[] = [];

      // Process each hint image
      for (let imageIndex = 0; imageIndex < payload.hints.length; imageIndex++) {
        const hintBuffer = payload.hints[imageIndex];

        console.log(`[hint-tagger] Analyzing hint image ${imageIndex + 1}/${payload.hints.length}...`);

        // Create prompt for hint analysis
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

        // Use Gemini to analyze the hint image
        const result = await generateStructured({
          prompt,
          images: [hintBuffer],
          schema: z.object({
            type: z.enum(['single_select', 'multi_select', 'fill_in', 'short_answer']),
            description: z.string(),
          }),
          cacheKey: `hint-tag-${imageIndex}`,
        });

        // Add the tag with image index
        tags.push({
          imageIndex,
          type: result.type,
          description: result.description,
        });

        console.log(`[hint-tagger] Hint ${imageIndex + 1}: type=${result.type}, description="${result.description}"`);
      }

      console.log(`[hint-tagger] Completed tagging ${tags.length} hints`);

      return { tags };
    } catch (error) {
      console.error('[hint-tagger] Error processing hints:', error);
      throw new Error(
        `Failed to tag hint images: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
