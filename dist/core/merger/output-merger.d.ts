import type { QuestionGroup, Question, Option, Explanation } from '../schemas/index.js';
export interface MergeConfig {
}
export interface ParserResult {
    type: 'single_select' | 'multi_select' | 'fill_in' | 'short_answer' | 'emi_single_select';
    questions: Question[];
    groupOptions?: Option[];
    groupExplanation?: Explanation;
    groupText?: string;
}
export declare function mergeQuestionGroups(results: ParserResult[], _config?: MergeConfig): QuestionGroup;
export declare function mergeQuestionGroupsToJSON(results: ParserResult[], config: MergeConfig, pretty?: boolean): string;
//# sourceMappingURL=output-merger.d.ts.map