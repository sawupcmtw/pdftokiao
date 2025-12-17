import { z } from 'zod';
import { generateStructured, type CallMetrics } from '../core/ai/gemini-client.js';
import { loadPdf } from '../core/loader/index.js';
import type { Question, QuestionGroup } from '../core/schemas/index.js';
import {
  type SupplementaryPdf,
  type SupplementaryScope,
  type ExtractedAnswer,
  ExtractedAnswerSchema,
} from '../core/schemas/index.js';

/**
 * Input for the answer enricher
 */
export interface AnswerEnricherInput {
  /** Parsed questions from orchestrator */
  questionGroup: QuestionGroup;
  /** Array of supplementary PDFs to process */
  supplementaryPdfs: SupplementaryPdf[];
  /** Optional page map for scope matching (position -> pages) */
  pageMap?: Map<number, number[]>;
}

/** Log entry for enrichment tracking */
export interface EnrichmentLogEntry {
  questionPosition: number;
  sourceFile: string;
  fieldsUpdated: string[];
  confidence: 'high' | 'medium' | 'low';
}

/** Result from the enrichment process */
export interface AnswerEnricherResult {
  enrichedGroup: QuestionGroup;
  metrics: CallMetrics[];
  enrichmentLog: EnrichmentLogEntry[];
}

/**
 * Check if a question matches the given scope
 */
function questionMatchesScope(
  question: Question,
  scope: SupplementaryScope,
  pageMap?: Map<number, number[]>
): boolean {
  switch (scope.type) {
    case 'all':
      return true;

    case 'pages':
      if (!pageMap) return true; // If no page map, include all
      const questionPages = pageMap.get(question.attributes.position) || [];
      return questionPages.some((p) => p >= scope.startPage && p <= scope.endPage);

    case 'type':
      return question.attributes.assessment_form === scope.questionType;

    case 'questions':
      return scope.questionNumbers.includes(question.attributes.position);

    default:
      return false;
  }
}

/**
 * Create prompt for extracting answers from supplementary PDF
 */
function createExtractionPrompt(scope: SupplementaryScope, questionPositions: number[]): string {
  const scopeDescription = (() => {
    switch (scope.type) {
      case 'all':
        return 'all questions';
      case 'pages':
        return `questions on pages ${scope.startPage}-${scope.endPage}`;
      case 'type':
        return `${scope.questionType.replace('_', ' ')} questions`;
      case 'questions':
        return `questions ${scope.questionNumbers.join(', ')}`;
    }
  })();

  return `This PDF contains answer keys and/or explanations for ${scopeDescription}.

Extract the following information for each question found:

1. Question number/position (match to positions: ${questionPositions.join(', ')})
2. Correct answer(s) - format as array of arrays:
   - Single choice: [["A"]]
   - Multiple choice: [["A"], ["C"]]
   - Fill-in: [["answer text"]]
   - Multiple blanks: [["blank1 answer"], ["blank2 answer"]]
3. Explanation details (if present):
   - note: Detailed explanation or rationale for the answer
   - translation: Translation if present (for language questions)
   - vocabs_note: Vocabulary notes if present
4. Confidence level:
   - high: Answer is clearly stated/marked
   - medium: Answer is inferred from context
   - low: Uncertain about the mapping

Guidelines:
- Match question numbers to the provided positions
- Extract all answer variations if multiple are given
- Include full explanations, not just summaries
- Mark confidence as 'low' if unsure about the mapping
- If a question is not found in this PDF, do not include it

Return extracted answers in the specified format.`;
}

/**
 * Merge extracted answer into existing question
 */
function mergeAnswerIntoQuestion(
  question: Question,
  extracted: ExtractedAnswer,
  overwrite: boolean = false
): { question: Question; fieldsUpdated: string[] } {
  const fieldsUpdated: string[] = [];
  const updated = structuredClone(question);

  // Check if question has existing answer
  const hasExistingAnswer =
    question.attributes.answer.length > 0 && (question.attributes.answer[0]?.length ?? 0) > 0;

  // Update answer if extracted has higher confidence or question has no answer
  if (!hasExistingAnswer || (overwrite && extracted.confidence === 'high')) {
    updated.attributes = {
      ...updated.attributes,
      answer: extracted.answer,
    };
    fieldsUpdated.push('answer');
  }

  // Update explanation if extracted has content
  if (extracted.explanation) {
    const hasExistingExplanation =
      question.explanation?.attributes?.note ||
      question.explanation?.attributes?.translation ||
      question.explanation?.attributes?.vocabs_note;

    if (!hasExistingExplanation || overwrite) {
      updated.explanation = {
        attributes: {
          note: extracted.explanation.note ?? question.explanation?.attributes?.note ?? null,
          translation:
            extracted.explanation.translation ?? question.explanation?.attributes?.translation ?? null,
          vocabs_note:
            extracted.explanation.vocabs_note ?? question.explanation?.attributes?.vocabs_note ?? null,
        },
      };
      fieldsUpdated.push('explanation');
    }
  }

  return { question: updated, fieldsUpdated };
}

/**
 * Process a single supplementary PDF and extract answers
 */
async function processSupplementaryPdf(
  suppPdf: SupplementaryPdf,
  questions: Question[],
  pageMap?: Map<number, number[]>
): Promise<{ extractions: ExtractedAnswer[]; metrics: CallMetrics }> {
  console.log(`[answer-enricher] Processing: ${suppPdf.filename}`);

  // Load the supplementary PDF
  const pdfBuffer = await loadPdf(suppPdf.path);

  // Get question positions that match this scope
  const matchingPositions = questions
    .filter((q) => questionMatchesScope(q, suppPdf.scope, pageMap))
    .map((q) => q.attributes.position);

  if (matchingPositions.length === 0) {
    console.log(`[answer-enricher] No matching questions for scope`);
    return {
      extractions: [],
      metrics: {
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0, cost: 0 },
        latencyMs: 0,
        cacheHit: true,
        retryAttempts: 0,
      },
    };
  }

  // Create extraction prompt
  const prompt = createExtractionPrompt(suppPdf.scope, matchingPositions);

  // Call Gemini to extract answers
  const { object: result, metrics } = await generateStructured({
    prompt,
    pdf: pdfBuffer,
    schema: z.object({
      answers: z.array(ExtractedAnswerSchema),
    }),
    cacheKey: `supp-extract-${suppPdf.filename}`,
  });

  // Log metrics
  const metricsStr = metrics.cacheHit
    ? 'CACHE HIT'
    : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
  console.log(`[answer-enricher] ${suppPdf.filename}: ${metricsStr}`);
  console.log(`[answer-enricher] Extracted ${result.answers.length} answers`);

  return { extractions: result.answers, metrics };
}

/**
 * Enrich parsed questions with answers and explanations from supplementary PDFs
 */
export async function enrichAnswers(payload: AnswerEnricherInput): Promise<AnswerEnricherResult> {
  console.log(
    `[answer-enricher] Starting enrichment with ${payload.supplementaryPdfs.length} supplementary PDF(s)...`
  );

  const allMetrics: CallMetrics[] = [];
  const enrichmentLog: EnrichmentLogEntry[] = [];

  // Deep clone the question group to avoid mutations
  const enrichedGroup: QuestionGroup = structuredClone(payload.questionGroup);
  const questions = enrichedGroup.data.questions;

  // Build extraction map: questionPosition -> ExtractedAnswer[]
  const extractionMap = new Map<number, { extraction: ExtractedAnswer; sourceFile: string }[]>();

  // Process each supplementary PDF
  for (const suppPdf of payload.supplementaryPdfs) {
    try {
      const { extractions, metrics } = await processSupplementaryPdf(
        suppPdf,
        questions,
        payload.pageMap
      );
      allMetrics.push(metrics);

      // Add extractions to map
      for (const extraction of extractions) {
        const existing = extractionMap.get(extraction.questionNumber) || [];
        existing.push({ extraction, sourceFile: suppPdf.filename });
        extractionMap.set(extraction.questionNumber, existing);
      }
    } catch (error) {
      console.error(`[answer-enricher] Error processing ${suppPdf.filename}:`, error);
      // Continue with other PDFs
    }
  }

  // Apply extractions to questions
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]!;
    const entries = extractionMap.get(question.attributes.position);

    if (!entries || entries.length === 0) {
      continue;
    }

    // Use highest confidence extraction
    const confidenceOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const best = entries.reduce((bestEntry, current) =>
      confidenceOrder[current.extraction.confidence]! > confidenceOrder[bestEntry.extraction.confidence]!
        ? current
        : bestEntry
    );

    // Merge into question
    const { question: updated, fieldsUpdated } = mergeAnswerIntoQuestion(
      question,
      best.extraction,
      best.extraction.confidence === 'high'
    );

    if (fieldsUpdated.length > 0) {
      questions[i] = updated;
      enrichmentLog.push({
        questionPosition: question.attributes.position,
        sourceFile: best.sourceFile,
        fieldsUpdated,
        confidence: best.extraction.confidence,
      });
    }
  }

  console.log(`[answer-enricher] Enrichment complete. Updated ${enrichmentLog.length} questions.`);

  return {
    enrichedGroup,
    metrics: allMetrics,
    enrichmentLog,
  };
}
