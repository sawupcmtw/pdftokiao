import { z } from 'zod';
import { loadPdf } from '../core/loader/index.js';
import { parseDeck } from './parsers/index.js';
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
function addMetrics(acc, metrics) {
    acc.totalInputTokens += metrics.usage.inputTokens;
    acc.totalOutputTokens += metrics.usage.outputTokens;
    acc.totalLatencyMs += metrics.latencyMs;
    acc.apiCalls++;
    acc.totalRetries += metrics.retryAttempts;
    if (metrics.cacheHit)
        acc.cacheHits++;
}
function logMetricsSummary(metrics) {
    console.log('[deck-orchestrator] ====== Pipeline Metrics ======');
    console.log(`[deck-orchestrator] API Calls: ${metrics.apiCalls} (${metrics.cacheHits} cache hits)`);
    console.log(`[deck-orchestrator] Tokens: ${metrics.totalInputTokens} in / ${metrics.totalOutputTokens} out`);
    console.log(`[deck-orchestrator] Latency: ${metrics.totalLatencyMs}ms total`);
    console.log(`[deck-orchestrator] Retries: ${metrics.totalRetries}`);
    console.log('[deck-orchestrator] ==============================');
}
const DeckOrchestratorInputSchema = z.object({
    pdfPath: z.string(),
    pages: z
        .tuple([z.number().int().positive()])
        .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),
    deckName: z.string(),
    deckDescription: z.string().optional(),
    instruction: z.string().optional(),
});
export async function orchestrateDeck(payload) {
    const startPage = payload.pages[0];
    const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0];
    try {
        console.log('[deck-orchestrator] Starting Deck parsing pipeline...');
        console.log(`[deck-orchestrator] PDF: ${payload.pdfPath}`);
        console.log(`[deck-orchestrator] Pages: ${startPage}-${endPage}`);
        const pipelineMetrics = createMetricsAccumulator();
        console.log('[deck-orchestrator] Step 1: Loading PDF...');
        const pdfBuffer = await loadPdf(payload.pdfPath);
        console.log(`[deck-orchestrator] Loaded PDF (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
        console.log('[deck-orchestrator] Step 2: Parsing vocabulary cards...');
        const parserResult = await parseDeck({
            pdf: pdfBuffer,
            pages: payload.pages,
            description: `Vocabulary/flashcard content from pages ${startPage}-${endPage}`,
            crossId: `deck-${startPage}-${endPage}`,
            instruction: payload.instruction,
        });
        addMetrics(pipelineMetrics, parserResult.metrics);
        const cards = parserResult.cards;
        console.log(`[deck-orchestrator] Parsed ${cards.length} vocabulary cards`);
        console.log('[deck-orchestrator] Step 3: Building final output...');
        const deck = {
            type: 'deck',
            attributes: {
                name: payload.deckName,
                description: payload.deckDescription || '',
                position: 1,
            },
            cards,
        };
        console.log('[deck-orchestrator] Pipeline completed successfully');
        logMetricsSummary(pipelineMetrics);
        return { data: deck };
    }
    catch (error) {
        console.error('[deck-orchestrator] Pipeline failed:', error);
        throw new Error(`Deck orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
//# sourceMappingURL=deck-orchestrator.task.js.map