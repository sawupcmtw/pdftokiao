import { z } from 'zod'
import { loadPdf, loadImages } from '../core/loader/index.js'
import type { QuestionGroup, Question, SupplementaryPdf } from '../core/schemas/index.js'
import type { CallMetrics } from '../core/ai/gemini-client.js'
import { tagHints } from './hint-tagger.task.js'
import { analyzePages } from './page-analyzer.task.js'
import {
  parseSingleSelect,
  parseMultiSelect,
  parseFillIn,
  parseShortAnswer,
} from './parsers/index.js'
import { enrichAnswers } from './answer-enricher.task.js'

/** Aggregated metrics for the entire pipeline */
interface PipelineMetrics {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  totalLatencyMs: number
  cacheHits: number
  apiCalls: number
  totalRetries: number
}

/** Create empty metrics accumulator */
function createMetricsAccumulator(): PipelineMetrics {
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
function addMetrics(acc: PipelineMetrics, metrics: CallMetrics): void {
  acc.totalInputTokens += metrics.usage.inputTokens
  acc.totalOutputTokens += metrics.usage.outputTokens
  acc.totalCost += metrics.usage.cost
  acc.totalLatencyMs += metrics.latencyMs
  acc.apiCalls++
  acc.totalRetries += metrics.retryAttempts
  if (metrics.cacheHit) acc.cacheHits++
}

/** Log the final pipeline metrics summary */
function logMetricsSummary(metrics: PipelineMetrics): void {
  console.log('[orchestrator] ====== Pipeline Metrics ======')
  console.log(`[orchestrator] API Calls: ${metrics.apiCalls} (${metrics.cacheHits} cache hits)`)
  console.log(
    `[orchestrator] Tokens: ${metrics.totalInputTokens} in / ${metrics.totalOutputTokens} out`
  )
  console.log(`[orchestrator] Cost: $${metrics.totalCost.toFixed(6)}`)
  console.log(`[orchestrator] Latency: ${metrics.totalLatencyMs}ms total`)
  console.log(`[orchestrator] Retries: ${metrics.totalRetries}`)
  console.log('[orchestrator] ==============================')
}

/**
 * Input schema for orchestrator
 */
const OrchestratorInputSchema = z.object({
  /** Path to PDF file */
  pdfPath: z.string(),

  /** Page range to parse - either a single page [n] or a range [start, end] */
  pages: z
    .tuple([z.number().int().positive()])
    .or(z.tuple([z.number().int().positive(), z.number().int().positive()])),

  /** Array of paths to hint images */
  hintPaths: z.array(z.string()),

  /** Optional instruction string for parsing guidance */
  instruction: z.string().optional(),

  /** Material ID number */
  materialId: z.number().int().positive(),

  /** Import key string (UUID format recommended) */
  importKey: z.string().min(1),

  /** Optional array of supplementary PDFs for answer enrichment */
  supplementaryPdfs: z
    .array(
      z.object({
        path: z.string(),
        scope: z.any(),
        filename: z.string(),
      })
    )
    .optional(),
})

export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>

/**
 * Main pipeline coordinator
 *
 * This function orchestrates the entire PDF parsing pipeline:
 * 1. Load PDF and hint images using loaders
 * 2. Run hint tagger to analyze hints
 * 3. Run page analyzer to map pages to questions
 * 4. Run appropriate parsers in parallel for each question
 * 5. Group results by type + crossId
 * 6. Merge outputs into final QuestionGroup JSON
 */
export async function orchestrate(payload: OrchestratorInput): Promise<QuestionGroup> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]

  try {
    console.log('[orchestrator] Starting PDF parsing pipeline...')
    console.log(`[orchestrator] PDF: ${payload.pdfPath}`)
    console.log(`[orchestrator] Pages: ${startPage}-${endPage}`)
    console.log(`[orchestrator] Hints: ${payload.hintPaths.length} files`)

    // Initialize metrics accumulator
    const pipelineMetrics = createMetricsAccumulator()

    // Step 1: Load files
    console.log('[orchestrator] Step 1: Loading files...')

    const pdfBuffer = await loadPdf(payload.pdfPath)
    console.log(`[orchestrator] Loaded PDF (${(pdfBuffer.length / 1024).toFixed(2)} KB)`)

    const hintBuffers = await loadImages(payload.hintPaths)
    console.log(`[orchestrator] Loaded ${hintBuffers.length} hint images`)

    // Step 2: Run hint tagger (if hints provided)
    console.log('[orchestrator] Step 2: Analyzing hints...')
    const hintTagResult =
      hintBuffers.length > 0
        ? await tagHints({ hints: hintBuffers })
        : { output: { tags: [] }, metrics: [] }
    const hintTags = hintTagResult.output.tags
    // Collect metrics from hint tagger
    for (const m of hintTagResult.metrics) {
      addMetrics(pipelineMetrics, m)
    }
    console.log(`[orchestrator] Tagged ${hintTags.length} hints`)

    // Step 3: Run page analyzer
    console.log('[orchestrator] Step 3: Analyzing pages...')
    const pageAnalyzerResult = await analyzePages({
      pdf: pdfBuffer,
      pages: payload.pages,
      hintTags,
    })
    const pageMaps = pageAnalyzerResult.output.pageMaps
    // Collect metrics from page analyzer
    addMetrics(pipelineMetrics, pageAnalyzerResult.metrics)
    console.log(`[orchestrator] Analyzed ${pageMaps.length} pages`)

    // Step 4: Group questions by crossId and type
    console.log('[orchestrator] Step 4: Grouping questions...')

    const questionMap = new Map<
      string,
      {
        type: string
        pages: Set<number>
        description: string
      }
    >()

    for (const pageMap of pageMaps) {
      for (const item of pageMap.included) {
        const crossId = item.crossId || `page-${pageMap.page}-${item.type}`

        if (!questionMap.has(crossId)) {
          questionMap.set(crossId, {
            type: item.type,
            pages: new Set([pageMap.page]),
            description: item.description || '',
          })
        } else {
          questionMap.get(crossId)!.pages.add(pageMap.page)
        }
      }
    }

    console.log(`[orchestrator] Found ${questionMap.size} questions`)

    // Step 5: Parse each question in parallel
    console.log('[orchestrator] Step 5: Parsing questions...')

    const parsePromises: Promise<{ question: Question; metrics: CallMetrics }>[] = []
    let position = 1

    for (const [crossId, questionInfo] of questionMap.entries()) {
      // Get the page range for this question
      const questionPages = Array.from(questionInfo.pages).sort((a, b) => a - b)
      const questionStartPage = questionPages[0]!
      const questionEndPage = questionPages[questionPages.length - 1]!
      const pageRange: [number] | [number, number] =
        questionStartPage === questionEndPage
          ? [questionStartPage]
          : [questionStartPage, questionEndPage]

      const parserInput = {
        pdf: pdfBuffer,
        pages: pageRange,
        description: questionInfo.description,
        crossId,
        position,
        instruction: payload.instruction,
      }

      // Call the appropriate parser based on type
      let parsePromise: Promise<{ question: Question; metrics: CallMetrics }>

      switch (questionInfo.type) {
        case 'single_select':
          parsePromise = parseSingleSelect(parserInput)
          break
        case 'multi_select':
          parsePromise = parseMultiSelect(parserInput)
          break
        case 'fill_in':
          parsePromise = parseFillIn(parserInput)
          break
        case 'short_answer':
          parsePromise = parseShortAnswer(parserInput)
          break
        default:
          console.warn(`[orchestrator] Unknown question type: ${questionInfo.type}, skipping`)
          continue
      }

      parsePromises.push(parsePromise)
      position++
    }

    // Wait for all parsers to complete
    const parseResults = await Promise.all(parsePromises)

    // Extract questions and collect metrics
    const questions: Question[] = []
    for (const result of parseResults) {
      questions.push(result.question)
      addMetrics(pipelineMetrics, result.metrics)
    }
    console.log(`[orchestrator] Parsed ${questions.length} questions`)

    // Step 6: Build final QuestionGroup
    console.log('[orchestrator] Step 6: Building final output...')

    let questionGroup: QuestionGroup = {
      data: {
        type: 'question_group',
        attributes: {
          material_id: payload.materialId,
          import_key: payload.importKey,
        },
        questions,
      },
    }

    // Step 7: Enrich with supplementary PDFs (if provided)
    if (payload.supplementaryPdfs && payload.supplementaryPdfs.length > 0) {
      console.log('[orchestrator] Step 7: Enriching with supplementary PDFs...')

      const enrichResult = await enrichAnswers({
        questionGroup,
        supplementaryPdfs: payload.supplementaryPdfs as SupplementaryPdf[],
      })

      // Collect metrics
      for (const m of enrichResult.metrics) {
        addMetrics(pipelineMetrics, m)
      }

      // Log enrichment summary
      console.log(`[orchestrator] Enriched ${enrichResult.enrichmentLog.length} questions`)
      for (const entry of enrichResult.enrichmentLog) {
        console.log(
          `[orchestrator]   Q${entry.questionPosition}: ${entry.fieldsUpdated.join(', ')} ` +
            `(${entry.confidence} confidence from ${entry.sourceFile})`
        )
      }

      // Use enriched group as final output
      questionGroup = enrichResult.enrichedGroup
    } else {
      console.log('[orchestrator] Step 7: No supplementary PDFs, skipping enrichment')
    }

    console.log('[orchestrator] Pipeline completed successfully')

    // Log final metrics summary
    logMetricsSummary(pipelineMetrics)

    return questionGroup
  } catch (error) {
    console.error('[orchestrator] Pipeline failed:', error)
    throw new Error(
      `Orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
