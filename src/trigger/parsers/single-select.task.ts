import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import {
  SingleSelectQuestionSchema,
  type SingleSelectQuestion,
} from '../../core/schemas/index.js';

/**
 * Input schema for single-select parser
 */
const SingleSelectParserInputSchema = z.object({
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

type SingleSelectParserInput = z.infer<typeof SingleSelectParserInputSchema>;

/**
 * Parse single-select questions
 *
 * This task parses single-select (multiple choice with one answer) questions from PDF pages.
 * It extracts:
 * - Question text, latex, audio URLs, image URL
 * - Options with symbols, text, latex, audio, and images
 * - Correct answer
 * - Optional explanations for question and options
 */
export const singleSelectParserTask = task({
  id: 'parser-single-select',
  run: async (payload: SingleSelectParserInput): Promise<SingleSelectQuestion> => {
    try {
      console.log(`[parser-single-select] Parsing question at position ${payload.position} (crossId: ${payload.crossId})...`);

      // Create prompt for parsing
      const prompt = `Parse this single-select (multiple choice) question from the PDF pages.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Extract the following information:

1. Question attributes:
   - position: ${payload.position}
   - text: The question text (HTML supported)
   - latex: Any LaTeX notation (or null)
   - audio_urls: Audio URLs if present (or null)
   - image_url: Image URL if present (or null)
   - answer: Array containing the correct answer(s), e.g., [["A"]] for option A
   - assessment_form: "single_select"

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

Return the complete question in the import API format.`;

      // Use Gemini to parse the question
      const question = await generateStructured({
        prompt,
        images: payload.pages,
        schema: SingleSelectQuestionSchema,
        cacheKey: `single-select-${payload.crossId}-${payload.position}`,
      });

      console.log(
        `[parser-single-select] Successfully parsed question ${payload.position} ` +
        `with ${question.options.length} options`
      );

      return question;
    } catch (error) {
      console.error('[parser-single-select] Error parsing question:', error);
      throw new Error(
        `Failed to parse single-select question: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
