// Export all pipeline functions

// Agent functions
export { tagHints, type HintTaggerInput, type HintTaggerOutput } from './hint-tagger.task.js';
export {
  analyzePages,
  type PageAnalyzerInput,
  type PageAnalyzerOutput,
} from './page-analyzer.task.js';

// Parser functions
export {
  parseSingleSelect,
  parseMultiSelect,
  parseFillIn,
  parseShortAnswer,
} from './parsers/index.js';

// Orchestrator function
export { orchestrate, type OrchestratorInput } from './orchestrator.task.js';

// Answer enricher function
export {
  enrichAnswers,
  type AnswerEnricherInput,
  type AnswerEnricherResult,
  type EnrichmentLogEntry,
} from './answer-enricher.task.js';
