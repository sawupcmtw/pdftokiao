import { QuestionGroupSchema } from '../schemas/index.js';
function validateParserResult(result) {
    for (const question of result.questions) {
        if (question.attributes.assessment_form !== result.type) {
            throw new Error(`Question type mismatch: expected ${result.type}, got ${question.attributes.assessment_form}`);
        }
    }
}
function validateEMIResult(result) {
    if (result.type !== 'emi_single_select') {
        return;
    }
    if (!result.groupOptions || result.groupOptions.length === 0) {
        throw new Error('EMI single-select questions must have groupOptions defined');
    }
    for (const question of result.questions) {
        if ('options' in question && question.options && question.options.length > 0) {
            throw new Error('EMI single-select questions should not have individual options; options should be at group level');
        }
    }
}
function assignPositions(questions, startPosition) {
    return questions.map((question, index) => ({
        ...question,
        attributes: {
            ...question.attributes,
            position: startPosition + index,
        },
    }));
}
export function mergeQuestionGroups(results, _config) {
    if (!results || results.length === 0) {
        throw new Error('Cannot merge empty results array');
    }
    for (const result of results) {
        validateParserResult(result);
        validateEMIResult(result);
    }
    const hasMultipleEMI = results.filter((r) => r.type === 'emi_single_select').length > 1;
    if (hasMultipleEMI) {
        throw new Error('Cannot merge multiple EMI results with different group-level attributes. ' +
            'EMI questions must be in a single parser result.');
    }
    const emiResult = results.find((r) => r.type === 'emi_single_select');
    const groupOptions = emiResult?.groupOptions;
    const groupExplanation = emiResult?.groupExplanation;
    const groupText = emiResult?.groupText;
    let allQuestions = [];
    let currentPosition = 1;
    for (const result of results) {
        const questionsWithPositions = assignPositions(result.questions, currentPosition);
        allQuestions = allQuestions.concat(questionsWithPositions);
        currentPosition += result.questions.length;
    }
    if (allQuestions.length === 0) {
        throw new Error('Cannot create QuestionGroup with no questions');
    }
    const questionGroup = {
        data: {
            type: 'question_group',
            attributes: {
                ...(groupText && { text: groupText }),
            },
            questions: allQuestions,
            ...(groupOptions && { options: groupOptions }),
            ...(groupExplanation && { explanation: groupExplanation }),
        },
    };
    try {
        QuestionGroupSchema.parse(questionGroup);
    }
    catch (error) {
        throw new Error(`Failed to validate merged QuestionGroup: ${error instanceof Error ? error.message : String(error)}`);
    }
    return questionGroup;
}
export function mergeQuestionGroupsToJSON(results, config, pretty = true) {
    const questionGroup = mergeQuestionGroups(results, config);
    return JSON.stringify(questionGroup, null, pretty ? 2 : 0);
}
//# sourceMappingURL=output-merger.js.map