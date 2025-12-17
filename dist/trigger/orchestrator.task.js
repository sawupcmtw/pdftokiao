import { z } from 'zod';
import { loadPdf, loadImages } from '../core/loader/index.js';
import { tagHints } from './hint-tagger.task.js';
import { analyzePages } from './page-analyzer.task.js';
import { parseSingleSelect, parseMultiSelect, parseFillIn, parseShortAnswer, parseEMISingleSelect, parseDeck, } from './parsers/index.js';
import { enrichAnswers } from './answer-enricher.task.js';
function createMetricsAccumulator() {
    return {
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalLatencyMs: 0,
        cacheHits: 0,
        apiCalls: 0,
        totalRetries: 0,
    };
}
function addMetrics(acc, callLogs, metrics, goal) {
    acc.totalInputTokens += metrics.usage.inputTokens;
    acc.totalOutputTokens += metrics.usage.outputTokens;
    acc.totalLatencyMs += metrics.latencyMs;
    acc.apiCalls++;
    acc.totalRetries += metrics.retryAttempts;
    if (metrics.cacheHit)
        acc.cacheHits++;
    callLogs.push({
        goal,
        inputTokens: metrics.usage.inputTokens,
        outputTokens: metrics.usage.outputTokens,
        latencyMs: metrics.latencyMs,
        cacheHit: metrics.cacheHit,
        retries: metrics.retryAttempts,
    });
}
function logMetricsSummary(metrics) {
    console.log('[orchestrator] ====== Pipeline Metrics ======');
    console.log(`[orchestrator] API Calls: ${metrics.apiCalls} (${metrics.cacheHits} cache hits)`);
    console.log(`[orchestrator] Tokens: ${metrics.totalInputTokens} in / ${metrics.totalOutputTokens} out`);
    console.log(`[orchestrator] Latency: ${metrics.totalLatencyMs}ms total`);
    console.log(`[orchestrator] Retries: ${metrics.totalRetries}`);
    console.log('[orchestrator] ==============================');
}
const OrchestratorInputSchema = z.object({
    pdfPath: z.string(),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    hintPaths: z.array(z.string()),
    instruction: z.string().optional(),
    supplementaryPdfs: z
        .array(z.object({
        path: z.string(),
        scope: z.any(),
        filename: z.string(),
    }))
        .optional(),
});
export async function orchestrate(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    const startTime = new Date();
    try {
        console.log('[orchestrator] Starting PDF parsing pipeline...');
        console.log(`[orchestrator] PDF: ${payload.pdfPath}`);
        console.log(`[orchestrator] Pages: ${startPage}-${endPage}`);
        console.log(`[orchestrator] Hints: ${payload.hintPaths.length} files`);
        const pipelineMetrics = createMetricsAccumulator();
        const callLogs = [];
        console.log('[orchestrator] Step 1: Loading files...');
        const pdfBuffer = await loadPdf(payload.pdfPath);
        console.log(`[orchestrator] Loaded PDF (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
        const hintBuffers = await loadImages(payload.hintPaths);
        console.log(`[orchestrator] Loaded ${hintBuffers.length} hint images`);
        console.log('[orchestrator] Step 2: Analyzing hints...');
        const hintTagResult = hintBuffers.length > 0
            ? await tagHints({ hints: hintBuffers })
            : { output: { tags: [] }, metrics: [] };
        const hintTags = hintTagResult.output.tags;
        for (let i = 0; i < hintTagResult.metrics.length; i++) {
            addMetrics(pipelineMetrics, callLogs, hintTagResult.metrics[i], `Tag hint image ${i + 1}`);
        }
        console.log(`[orchestrator] Tagged ${hintTags.length} hints`);
        console.log('[orchestrator] Step 3: Analyzing pages...');
        const pageAnalyzerResult = await analyzePages({
            pdf: pdfBuffer,
            pages: payload.pages,
            hintTags,
        });
        const pageMaps = pageAnalyzerResult.output.pageMaps;
        addMetrics(pipelineMetrics, callLogs, pageAnalyzerResult.metrics, `Analyze pages ${startPage}-${endPage}`);
        console.log(`[orchestrator] Analyzed ${pageMaps.length} pages`);
        console.log('[orchestrator] Step 4: Grouping questions...');
        const questionMap = new Map();
        const deckPages = [];
        for (const pageMap of pageMaps) {
            for (const item of pageMap.included) {
                if (item.type === 'deck') {
                    if (!deckPages.includes(pageMap.page)) {
                        deckPages.push(pageMap.page);
                    }
                    continue;
                }
                const crossId = item.crossId || `page-${pageMap.page}-${item.type}`;
                if (!questionMap.has(crossId)) {
                    questionMap.set(crossId, {
                        type: item.type,
                        pages: new Set([pageMap.page]),
                        description: item.description || '',
                    });
                }
                else {
                    questionMap.get(crossId).pages.add(pageMap.page);
                }
            }
        }
        console.log(`[orchestrator] Found ${questionMap.size} questions`);
        if (deckPages.length > 0) {
            console.log(`[orchestrator] Found deck content on pages: ${deckPages.sort((a, b) => a - b).join(', ')}`);
        }
        console.log('[orchestrator] Step 5: Parsing questions and deck...');
        const parsePromises = [];
        const emiParsePromises = [];
        let position = 1;
        let emiGroupText = null;
        let emiGroupOptions = [];
        let emiGroupExplanation = undefined;
        for (const [crossId, questionInfo] of questionMap.entries()) {
            const questionPages = Array.from(questionInfo.pages).sort((a, b) => a - b);
            const questionStartPage = questionPages[0];
            const questionEndPage = questionPages[questionPages.length - 1];
            const pageRange = questionStartPage === questionEndPage
                ? [questionStartPage]
                : [questionStartPage, questionEndPage];
            const parserInput = {
                pdf: pdfBuffer,
                pages: pageRange,
                description: questionInfo.description,
                crossId,
                position,
                instruction: payload.instruction,
            };
            const currentPosition = position;
            const currentType = questionInfo.type;
            switch (questionInfo.type) {
                case 'single_select':
                    parsePromises.push(parseSingleSelect(parserInput).then((r) => ({
                        ...r,
                        position: currentPosition,
                        type: currentType,
                    })));
                    break;
                case 'multi_select':
                    parsePromises.push(parseMultiSelect(parserInput).then((r) => ({
                        ...r,
                        position: currentPosition,
                        type: currentType,
                    })));
                    break;
                case 'fill_in':
                    parsePromises.push(parseFillIn(parserInput).then((r) => ({
                        ...r,
                        position: currentPosition,
                        type: currentType,
                    })));
                    break;
                case 'short_answer':
                    parsePromises.push(parseShortAnswer(parserInput).then((r) => ({
                        ...r,
                        position: currentPosition,
                        type: currentType,
                    })));
                    break;
                case 'emi_single_select':
                    emiParsePromises.push(parseEMISingleSelect({
                        pdf: pdfBuffer,
                        pages: pageRange,
                        description: questionInfo.description,
                        crossId,
                        startPosition: position,
                        instruction: payload.instruction,
                    }).then((result) => ({ result, crossId, pages: pageRange })));
                    continue;
                default:
                    console.warn(`[orchestrator] Unknown question type: ${questionInfo.type}, skipping`);
                    continue;
            }
            position++;
        }
        let deckParsePromise = null;
        let deckPageRange = null;
        if (deckPages.length > 0) {
            const sortedDeckPages = deckPages.sort((a, b) => a - b);
            const deckStartPage = sortedDeckPages[0];
            const deckEndPage = sortedDeckPages[sortedDeckPages.length - 1];
            deckPageRange = deckStartPage === deckEndPage ? [deckStartPage] : [deckStartPage, deckEndPage];
            deckParsePromise = parseDeck({
                pdf: pdfBuffer,
                pages: deckPageRange,
                description: `Vocabulary content from pages ${deckStartPage}-${deckEndPage}`,
                crossId: `deck-${deckStartPage}-${deckEndPage}`,
                instruction: payload.instruction,
            });
        }
        const [parseResults, emiResults, deckResult] = await Promise.all([
            Promise.all(parsePromises),
            Promise.all(emiParsePromises),
            deckParsePromise,
        ]);
        const questions = [];
        for (const result of parseResults) {
            questions.push(result.question);
            addMetrics(pipelineMetrics, callLogs, result.metrics, `Parse question ${result.position} (${result.type})`);
        }
        for (const { result, crossId, pages } of emiResults) {
            console.log(`[orchestrator] EMI group ${crossId}: ${result.questions.length} questions, ${result.groupOptions.length} shared options`);
            questions.push(...result.questions);
            const pageStr = pages.length === 2 ? `${pages[0]}-${pages[1]}` : `${pages[0]}`;
            addMetrics(pipelineMetrics, callLogs, result.metrics, `Parse EMI group (${result.questions.length} questions, pages ${pageStr})`);
            if (result.groupOptions.length > 0 && emiGroupOptions.length === 0) {
                emiGroupText = result.groupText;
                emiGroupOptions = result.groupOptions;
                emiGroupExplanation = result.groupExplanation;
            }
        }
        if (deckResult && deckPageRange) {
            console.log(`[orchestrator] Parsed ${deckResult.cards.length} vocabulary cards`);
            const deckPageStr = deckPageRange.length === 2 ? `${deckPageRange[0]}-${deckPageRange[1]}` : `${deckPageRange[0]}`;
            addMetrics(pipelineMetrics, callLogs, deckResult.metrics, `Parse deck (${deckResult.cards.length} cards, pages ${deckPageStr})`);
        }
        console.log(`[orchestrator] Parsed ${questions.length} questions`);
        console.log('[orchestrator] Step 6: Building final output...');
        const output = [];
        if (questions.length > 0) {
            let questionGroup = {
                data: {
                    type: 'question_group',
                    attributes: {
                        ...(emiGroupText ? { text: emiGroupText } : {}),
                    },
                    ...(emiGroupExplanation ? { explanation: emiGroupExplanation } : {}),
                    ...(emiGroupOptions.length > 0 ? { options: emiGroupOptions } : {}),
                    questions,
                },
            };
            if (payload.supplementaryPdfs && payload.supplementaryPdfs.length > 0) {
                console.log('[orchestrator] Step 7: Enriching with supplementary PDFs...');
                const enrichResult = await enrichAnswers({
                    questionGroup,
                    supplementaryPdfs: payload.supplementaryPdfs,
                });
                const suppPdfs = payload.supplementaryPdfs;
                for (let i = 0; i < enrichResult.metrics.length; i++) {
                    const suppFilename = suppPdfs[i]?.filename || `SUPP-${i + 1}`;
                    addMetrics(pipelineMetrics, callLogs, enrichResult.metrics[i], `Enrich from ${suppFilename}`);
                }
                console.log(`[orchestrator] Enriched ${enrichResult.enrichmentLog.length} questions`);
                for (const entry of enrichResult.enrichmentLog) {
                    console.log(`[orchestrator]   Q${entry.questionPosition}: ${entry.fieldsUpdated.join(', ')} ` +
                        `(${entry.confidence} confidence from ${entry.sourceFile})`);
                }
                questionGroup = enrichResult.enrichedGroup;
            }
            else {
                console.log('[orchestrator] Step 7: No supplementary PDFs, skipping enrichment');
            }
            output.push(questionGroup);
        }
        if (deckResult && deckPageRange) {
            const deckStartPage = deckPageRange[0];
            const deckEndPage = deckPageRange.length === 2 ? deckPageRange[1] : deckPageRange[0];
            const deck = {
                type: 'deck',
                attributes: {
                    name: `Vocabulary - Pages ${deckStartPage}-${deckEndPage}`,
                    description: `Vocabulary extracted from PDF pages ${deckStartPage} to ${deckEndPage}`,
                    position: 1,
                },
                cards: deckResult.cards,
            };
            output.push({ data: deck });
        }
        if (output.length === 0) {
            throw new Error('No questions or deck content detected in PDF');
        }
        console.log('[orchestrator] Pipeline completed successfully');
        console.log(`[orchestrator] Output contains ${output.length} item(s): ${output.map((item) => item.data.type).join(', ')}`);
        logMetricsSummary(pipelineMetrics);
        const endTime = new Date();
        return {
            output,
            metrics: pipelineMetrics,
            callLogs,
            startTime,
            endTime,
        };
    }
    catch (error) {
        console.error('[orchestrator] Pipeline failed:', error);
        throw new Error(`Orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=orchestrator.task.js.map