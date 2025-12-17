import { z } from 'zod'
import { loadPdf } from '../core/loader/index.js'
import type { Deck, Card } from '../core/schemas/index.js'
import type { CallMetrics } from '../core/ai/gemini-client.js'
import { parseDeck } from './parsers/index.js'

/** Aggregated metrics for the deck pipeline */
interface DeckPipelineMetrics {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  totalLatencyMs: number
  cacheHits: number
  apiCalls: number
  totalRetries: number
}

/** Create empty metrics accumulator */
function createMetricsAccumulator(): DeckPipelineMetrics {
  return {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    totalLatencyMs: 0,
    cacheHits: 0,
    apiCalls: 0,
    totalRetries: 0,
  }
}

/** Add metrics from a single call to the accumulator */
function addMetrics(acc: DeckPipelineMetrics, metrics: CallMetrics): void {
  acc.totalInputTokens += metrics.usage.inputTokens
  acc.totalOutputTokens += metrics.usage.outputTokens
  acc.totalCost += metrics.usage.cost
  acc.totalLatencyMs += metrics.latencyMs
  acc.apiCalls++
  acc.totalRetries += metrics.retryAttempts
  if (metrics.cacheHit) acc.cacheHits++
}

/** Log the final pipeline metrics summary */
function logMetricsSummary(metrics: DeckPipelineMetrics): void {
  console.log('[deck-orchestrator] ====== Pipeline Metrics ======')
  console.log(`[deck-orchestrator] API Calls: ${metrics.apiCalls} (${metrics.cacheHits} cache hits)`)
  console.log(
    `[deck-orchestrator] Tokens: ${metrics.totalInputTokens} in / ${metrics.totalOutputTokens} out`
  )
  console.log(`[deck-orchestrator] Cost: $${metrics.totalCost.toFixed(6)}`)
  console.log(`[deck-orchestrator] Latency: ${metrics.totalLatencyMs}ms total`)
  console.log(`[deck-orchestrator] Retries: ${metrics.totalRetries}`)
  console.log('[deck-orchestrator] ==============================')
}

/**
 * Input schema for deck orchestrator
 */
const DeckOrchestratorInputSchema = z.object({
  /** Path to PDF file */
  pdfPath: z.string(),

  /** Page range to parse - either a single page [n] or a range [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Name for the deck */
  deckName: z.string(),

  /** Optional description for the deck */
  deckDescription: z.string().optional(),

  /** Import key string (UUID format recommended) */
  importKey: z.string().min(1),

  /** Optional instruction string for parsing guidance */
  instruction: z.string().optional(),
})

export type DeckOrchestratorInput = z.infer<typeof DeckOrchestratorInputSchema>

/**
 * Deck output wrapper matching Kiao import API
 */
export interface DeckOutput {
  data: Deck
}

/**
 * Main Deck pipeline coordinator
 *
 * This function orchestrates the PDF parsing pipeline for vocabulary/flashcard content:
 * 1. Load PDF
 * 2. Parse vocabulary cards using AI
 * 3. Build Deck JSON output matching Kiao import API format
 */
export async function orchestrateDeck(payload: DeckOrchestratorInput): Promise<DeckOutput> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]

  try {
    console.log('[deck-orchestrator] Starting Deck parsing pipeline...')
    console.log(`[deck-orchestrator] PDF: ${payload.pdfPath}`)
    console.log(`[deck-orchestrator] Pages: ${startPage}-${endPage}`)

    // Initialize metrics accumulator
    const pipelineMetrics = createMetricsAccumulator()

    // Step 1: Load PDF
    console.log('[deck-orchestrator] Step 1: Loading PDF...')
    const pdfBuffer = await loadPdf(payload.pdfPath)
    console.log(`[deck-orchestrator] Loaded PDF (${(pdfBuffer.length / 1024).toFixed(2)} KB)`)

    // Step 2: Parse vocabulary cards
    console.log('[deck-orchestrator] Step 2: Parsing vocabulary cards...')
    const parserResult = await parseDeck({
      pdf: pdfBuffer,
      pages: payload.pages,
      description: `Vocabulary/flashcard content from pages ${startPage}-${endPage}`,
      crossId: `deck-${startPage}-${endPage}`,
      instruction: payload.instruction,
    })

    // Collect metrics
    addMetrics(pipelineMetrics, parserResult.metrics)

    const cards: Card[] = parserResult.cards
    console.log(`[deck-orchestrator] Parsed ${cards.length} vocabulary cards`)

    // Step 3: Build Deck output
    console.log('[deck-orchestrator] Step 3: Building final output...')

    const deck: Deck = {
      type: 'deck',
      attributes: {
        name: payload.deckName,
        description: payload.deckDescription || '',
        import_key: payload.importKey,
        last_review_time: null,
        removed_card_ids: [],
        ref_deck_id: null,
        is_referenced: true,
        discarded_at: null,
        starred_card_ids: [],
        familiarity: null,
        previewable: false,
        study_due_on: null,
        position: 1,
        mastered_cards_count: 0,
        is_default: false,
      },
      cards,
    }

    console.log('[deck-orchestrator] Pipeline completed successfully')

    // Log final metrics summary
    logMetricsSummary(pipelineMetrics)

    return { data: deck }
  } catch (error) {
    console.error('[deck-orchestrator] Pipeline failed:', error)
    throw new Error(
      `Deck orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
