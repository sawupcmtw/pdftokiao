import { z } from 'zod';
import { generateStructured } from '../core/ai/gemini-client.js';
import { loadPdf } from '../core/loader/index.js';
import { ExtractedAnswerSchema, } from '../core/schemas/index.js';
function questionMatchesScope(question, scope, pageMap) {
    switch (scope.type) {
        case 'all':
            return true;
        case 'pages':
            if (!pageMap)
                return true;
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
function createExtractionPrompt(scope, questionPositions) {
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
function mergeAnswerIntoQuestion(question, extracted, overwrite = false) {
    const fieldsUpdated = [];
    const updated = structuredClone(question);
    const hasExistingAnswer = question.attributes.answer.length > 0 && (question.attributes.answer[0]?.length ?? 0) > 0;
    if (!hasExistingAnswer || (overwrite && extracted.confidence === 'high')) {
        updated.attributes = {
            ...updated.attributes,
            answer: extracted.answer,
        };
        fieldsUpdated.push('answer');
    }
    if (extracted.explanation) {
        const hasExistingExplanation = question.explanation?.attributes?.note ||
            question.explanation?.attributes?.translation ||
            question.explanation?.attributes?.vocabs_note;
        if (!hasExistingExplanation || overwrite) {
            updated.explanation = {
                attributes: {
                    note: extracted.explanation.note ?? question.explanation?.attributes?.note ?? null,
                    translation: extracted.explanation.translation ??
                        question.explanation?.attributes?.translation ??
                        null,
                    vocabs_note: extracted.explanation.vocabs_note ??
                        question.explanation?.attributes?.vocabs_note ??
                        null,
                },
            };
            fieldsUpdated.push('explanation');
        }
    }
    return { question: updated, fieldsUpdated };
}
async function processSupplementaryPdf(suppPdf, questions, pageMap) {
    console.log(`[answer-enricher] Processing: ${suppPdf.filename}`);
    const pdfBuffer = await loadPdf(suppPdf.path);
    const matchingPositions = questions
        .filter((q) => questionMatchesScope(q, suppPdf.scope, pageMap))
        .map((q) => q.attributes.position);
    if (matchingPositions.length === 0) {
        console.log(`[answer-enricher] No matching questions for scope`);
        return {
            extractions: [],
            metrics: {
                usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
                latencyMs: 0,
                cacheHit: true,
                retryAttempts: 0,
            },
        };
    }
    const prompt = createExtractionPrompt(suppPdf.scope, matchingPositions);
    const { object: result, metrics } = await generateStructured({
        prompt,
        pdf: pdfBuffer,
        schema: z.object({
            answers: z.array(ExtractedAnswerSchema),
        }),
        cacheKey: `supp-extract-${suppPdf.filename}`,
    });
    const metricsStr = metrics.cacheHit
        ? 'CACHE HIT'
        : `${metrics.usage.totalTokens} tokens, ${metrics.latencyMs}ms`;
    console.log(`[answer-enricher] ${suppPdf.filename}: ${metricsStr}`);
    console.log(`[answer-enricher] Extracted ${result.answers.length} answers`);
    return { extractions: result.answers, metrics };
}
export async function enrichAnswers(payload) {
    console.log(`[answer-enricher] Starting enrichment with ${payload.supplementaryPdfs.length} supplementary PDF(s)...`);
    const allMetrics = [];
    const enrichmentLog = [];
    const enrichedGroup = structuredClone(payload.questionGroup);
    const questions = enrichedGroup.data.questions;
    const extractionMap = new Map();
    for (const suppPdf of payload.supplementaryPdfs) {
        try {
            const { extractions, metrics } = await processSupplementaryPdf(suppPdf, questions, payload.pageMap);
            allMetrics.push(metrics);
            for (const extraction of extractions) {
                const existing = extractionMap.get(extraction.questionNumber) || [];
                existing.push({ extraction, sourceFile: suppPdf.filename });
                extractionMap.set(extraction.questionNumber, existing);
            }
        }
        catch (error) {
            console.error(`[answer-enricher] Error processing ${suppPdf.filename}:`, error);
        }
    }
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const entries = extractionMap.get(question.attributes.position);
        if (!entries || entries.length === 0) {
            continue;
        }
        const confidenceOrder = { high: 3, medium: 2, low: 1 };
        const best = entries.reduce((bestEntry, current) => confidenceOrder[current.extraction.confidence] >
            confidenceOrder[bestEntry.extraction.confidence]
            ? current
            : bestEntry);
        const { question: updated, fieldsUpdated } = mergeAnswerIntoQuestion(question, best.extraction, best.extraction.confidence === 'high');
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
//# sourceMappingURL=answer-enricher.task.js.map