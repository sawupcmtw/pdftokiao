import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import {
  MultiSelectQuestionSchema,
  type MultiSelectQuestion,
} from '../../core/schemas/index.js';

/**
 * Input schema for multi-select parser
 */
const MultiSelectParserInputSchema = z.object({
  /** PDF page buffers containing the question */
  pages: z.array(z.instanceof(Buffer)),

  /** Description from page analyzer */
  description: z.string(),

  /** Cross-reference ID for grouping */
  crossId: z.string(),

  /** Position in the question group */
  position: z.number().int().positive(),

  /** Optional instruction for parsing guidance */
  instruction: z.string().optional(),
});

type MultiSelectParserInput = z.infer<typeof MultiSelectParserInputSchema>;

/**
 * Parse multi-select questions
 *
 * This task parses multi-select (multiple choice with multiple answers) questions from PDF pages.
 * It extracts:
 * - Question text, latex, audio URLs, image URL
 * - Options with symbols, text, latex, audio, and images
 * - Multiple correct answers
 * - Optional explanations for question and options
 */
export const multiSelectParserTask = task({
  id: 'parser-multi-select',
  run: async (payload: MultiSelectParserInput): Promise<MultiSelectQuestion> => {
    try {
      console.log(`[parser-multi-select] Parsing question at position ${payload.position} (crossId: ${payload.crossId})...`);

      // Create prompt for parsing
      const prompt = `Parse this multi-select (multiple choice with multiple correct answers) question from the PDF pages.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Extract the following information:

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

      // Use Gemini to parse the question
      const question = await generateStructured({
        prompt,
        images: payload.pages,
        schema: MultiSelectQuestionSchema,
        cacheKey: `multi-select-${payload.crossId}-${payload.position}`,
      });

      console.log(
        `[parser-multi-select] Successfully parsed question ${payload.position} ` +
        `with ${question.options.length} options and ${question.attributes.answer[0]?.length || 0} correct answers`
      );

      return question;
    } catch (error) {
      console.error('[parser-multi-select] Error parsing question:', error);
      throw new Error(
        `Failed to parse multi-select question: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
