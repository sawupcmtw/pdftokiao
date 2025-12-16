import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { generateStructured } from '../../core/ai/gemini-client.js';
import {
  ShortAnswerQuestionSchema,
  type ShortAnswerQuestion,
} from '../../core/schemas/index.js';

/**
 * Input schema for short-answer parser
 */
const ShortAnswerParserInputSchema = z.object({
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

type ShortAnswerParserInput = z.infer<typeof ShortAnswerParserInputSchema>;

/**
 * Parse short-answer questions
 *
 * This task parses short-answer or essay questions from PDF pages.
 * Short-answer questions don't have options or predefined answers.
 * It extracts:
 * - Question text, latex, audio URLs, image URL
 * - Empty answer array (since there's no single correct answer)
 * - Optional explanations or guidance
 */
export const shortAnswerParserTask = task({
  id: 'parser-short-answer',
  run: async (payload: ShortAnswerParserInput): Promise<ShortAnswerQuestion> => {
    try {
      console.log(`[parser-short-answer] Parsing question at position ${payload.position} (crossId: ${payload.crossId})...`);

      // Create prompt for parsing
      const prompt = `Parse this short-answer or essay question from the PDF pages.

Description: ${payload.description}
${payload.instruction ? `\nAdditional instructions: ${payload.instruction}` : ''}

Extract the following information:

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

      // Use Gemini to parse the question
      const question = await generateStructured({
        prompt,
        images: payload.pages,
        schema: ShortAnswerQuestionSchema,
        cacheKey: `short-answer-${payload.crossId}-${payload.position}`,
      });

      console.log(
        `[parser-short-answer] Successfully parsed question ${payload.position}`
      );

      return question;
    } catch (error) {
      console.error('[parser-short-answer] Error parsing question:', error);
      throw new Error(
        `Failed to parse short-answer question: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
