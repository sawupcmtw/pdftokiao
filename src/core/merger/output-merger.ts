import {
  QuestionGroup,
  QuestionGroupSchema,
  Question,
  Option,
  Explanation,
} from '../schemas/index.js';

/**
 * Configuration for merging parser results
 */
export interface MergeConfig {
  /** Material ID to assign to the question group */
  materialId: number;

  /** Import key (UUID format recommended) */
  importKey: string;
}

/**
 * Parser result structure for a single parsing task
 */
export interface ParserResult {
  /** Question type */
  type: 'single_select' | 'multi_select' | 'fill_in' | 'short_answer' | 'emi_single_select';

  /** Questions from this parser result */
  questions: Question[];

  /** Group-level options (for EMI types) */
  groupOptions?: Option[];

  /** Group-level explanation (for EMI types) */
  groupExplanation?: Explanation;

  /** Group-level text content (for EMI types, e.g., reading passage) */
  groupText?: string;
}

/**
 * Validates that all questions in a parser result match the declared type
 */
function validateParserResult(result: ParserResult): void {
  for (const question of result.questions) {
    if (question.attributes.assessment_form !== result.type) {
      throw new Error(
        `Question type mismatch: expected ${result.type}, got ${question.attributes.assessment_form}`
      );
    }
  }
}

/**
 * Validates EMI-specific constraints
 */
function validateEMIResult(result: ParserResult): void {
  if (result.type !== 'emi_single_select') {
    return;
  }

  // EMI types must have group options
  if (!result.groupOptions || result.groupOptions.length === 0) {
    throw new Error('EMI single-select questions must have groupOptions defined');
  }

  // EMI questions should not have individual options
  for (const question of result.questions) {
    if ('options' in question && question.options && question.options.length > 0) {
      throw new Error(
        'EMI single-select questions should not have individual options; options should be at group level'
      );
    }
  }
}

/**
 * Assigns sequential positions to questions starting from the given position
 */
function assignPositions(questions: Question[], startPosition: number): Question[] {
  return questions.map((question, index) => ({
    ...question,
    attributes: {
      ...question.attributes,
      position: startPosition + index,
    },
  }));
}

/**
 * Merges multiple parser results into a single QuestionGroup
 *
 * @param results - Array of parser results to merge
 * @param config - Configuration including material_id and import_key
 * @returns A validated QuestionGroup object
 *
 * @throws Error if validation fails or if there are conflicting group-level attributes
 *
 * @example
 * ```ts
 * const results: ParserResult[] = [
 *   {
 *     type: 'single_select',
 *     questions: [q1, q2, q3]
 *   },
 *   {
 *     type: 'emi_single_select',
 *     questions: [q4, q5],
 *     groupOptions: [...],
 *     groupText: 'Reading passage...'
 *   }
 * ];
 *
 * const questionGroup = mergeQuestionGroups(results, {
 *   materialId: 12345,
 *   importKey: 'uuid-1234-5678'
 * });
 * ```
 */
export function mergeQuestionGroups(
  results: ParserResult[],
  config: MergeConfig
): QuestionGroup {
  // Validate inputs
  if (!results || results.length === 0) {
    throw new Error('Cannot merge empty results array');
  }

  if (!config.materialId || config.materialId <= 0) {
    throw new Error('Invalid materialId: must be a positive integer');
  }

  if (!config.importKey || config.importKey.trim().length === 0) {
    throw new Error('Invalid importKey: must be a non-empty string');
  }

  // Validate each parser result
  for (const result of results) {
    validateParserResult(result);
    validateEMIResult(result);
  }

  // Check for conflicting group-level attributes
  const hasEMI = results.some(r => r.type === 'emi_single_select');
  const hasMultipleEMI = results.filter(r => r.type === 'emi_single_select').length > 1;

  if (hasMultipleEMI) {
    throw new Error(
      'Cannot merge multiple EMI results with different group-level attributes. ' +
      'EMI questions must be in a single parser result.'
    );
  }

  // Collect group-level attributes from EMI result (if present)
  const emiResult = results.find(r => r.type === 'emi_single_select');
  const groupOptions = emiResult?.groupOptions;
  const groupExplanation = emiResult?.groupExplanation;
  const groupText = emiResult?.groupText;

  // Combine all questions and assign sequential positions
  let allQuestions: Question[] = [];
  let currentPosition = 1;

  for (const result of results) {
    const questionsWithPositions = assignPositions(result.questions, currentPosition);
    allQuestions = allQuestions.concat(questionsWithPositions);
    currentPosition += result.questions.length;
  }

  // Validate that we have at least one question
  if (allQuestions.length === 0) {
    throw new Error('Cannot create QuestionGroup with no questions');
  }

  // Build the QuestionGroup object
  const questionGroup: QuestionGroup = {
    data: {
      type: 'question_group',
      attributes: {
        material_id: config.materialId,
        import_key: config.importKey,
        ...(groupText && { text: groupText }),
      },
      questions: allQuestions,
      ...(groupOptions && { options: groupOptions }),
      ...(groupExplanation && { explanation: groupExplanation }),
    },
  };

  // Validate against schema
  try {
    QuestionGroupSchema.parse(questionGroup);
  } catch (error) {
    throw new Error(
      `Failed to validate merged QuestionGroup: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return questionGroup;
}

/**
 * Merges multiple parser results and returns the JSON string
 *
 * @param results - Array of parser results to merge
 * @param config - Configuration including material_id and import_key
 * @param pretty - Whether to pretty-print the JSON (default: true)
 * @returns JSON string of the QuestionGroup
 */
export function mergeQuestionGroupsToJSON(
  results: ParserResult[],
  config: MergeConfig,
  pretty: boolean = true
): string {
  const questionGroup = mergeQuestionGroups(results, config);
  return JSON.stringify(questionGroup, null, pretty ? 2 : 0);
}
