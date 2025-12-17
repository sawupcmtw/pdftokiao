import { type CallMetrics } from '../core/ai/gemini-client.js';
import type { QuestionGroup } from '../core/schemas/index.js';
import { type SupplementaryPdf } from '../core/schemas/index.js';
export interface AnswerEnricherInput {
    questionGroup: QuestionGroup;
    supplementaryPdfs: SupplementaryPdf[];
    pageMap?: Map<number, number[]>;
}
export interface EnrichmentLogEntry {
    questionPosition: number;
    sourceFile: string;
    fieldsUpdated: string[];
    confidence: 'high' | 'medium' | 'low';
}
export interface AnswerEnricherResult {
    enrichedGroup: QuestionGroup;
    metrics: CallMetrics[];
    enrichmentLog: EnrichmentLogEntry[];
}
export declare function enrichAnswers(payload: AnswerEnricherInput): Promise<AnswerEnricherResult>;
//# sourceMappingURL=answer-enricher.task.d.ts.map