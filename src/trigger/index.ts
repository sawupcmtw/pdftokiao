// Export all Trigger.dev tasks

// Agent tasks
export { hintTaggerTask } from './hint-tagger.task.js';
export { pageAnalyzerTask } from './page-analyzer.task.js';

// Parser tasks
export {
  singleSelectParserTask,
  multiSelectParserTask,
  fillInParserTask,
  shortAnswerParserTask,
} from './parsers/index.js';

// Orchestrator task
export { orchestratorTask } from './orchestrator.task.js';
