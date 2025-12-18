import { z } from 'zod'
import { loadPdf, loadImages } from '../core/loader/index.js'
import type {
  QuestionGroup,
  Question,
  SupplementaryPdf,
  Option,
  Explanation,
  Deck,
  OrchestratorOutput,
  OrchestratorResult,
  PipelineMetrics,
  AICallLog,
} from '../core/schemas/index.js'
import type { CallMetrics } from '../core/ai/gemini-client.js'
import { tagHints } from './hint-tagger.task.js'
import { analyzePages, QuestionTypeEnum, type QuestionType } from './page-analyzer.task.js'
import {
  parseSingleSelect,
  parseMultiSelect,
  parseFillIn,
  parseShortAnswer,
  parseEMISingleSelect,
  parseDeck,
  type EMISingleSelectParserResult,
  type DeckParserResult,
} from './parsers/index.js'
import { enrichAnswers } from './answer-enricher.task.js'

/** Create empty metrics accumulator */
function createMetricsAccumulator(): PipelineMetrics {
  return {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalLatencyMs: 0,
    cacheHits: 0,
    apiCalls: 0,
    totalRetries: 0,
  }
}

/** Add metrics from a single call to the accumulator and log entry */
function addMetrics(
  acc: PipelineMetrics,
  callLogs: AICallLog[],
  metrics: CallMetrics,
  goal: string
): void {
  acc.totalInputTokens += metrics.usage.inputTokens
  acc.totalOutputTokens += metrics.usage.outputTokens
  acc.totalLatencyMs += metrics.latencyMs
  acc.apiCalls++
  acc.totalRetries += metrics.retryAttempts
  if (metrics.cacheHit) acc.cacheHits++

  // Add to call logs
  callLogs.push({
    goal,
    inputTokens: metrics.usage.inputTokens,
    outputTokens: metrics.usage.outputTokens,
    latencyMs: metrics.latencyMs,
    cacheHit: metrics.cacheHit,
    retries: metrics.retryAttempts,
  })
}

/** Log the final pipeline metrics summary */
function logMetricsSummary(metrics: PipelineMetrics): void {
  console.log('[orchestrator] ====== Pipeline Metrics ======')
  console.log(`[orchestrator] API Calls: ${metrics.apiCalls} (${metrics.cacheHits} cache hits)`)
  console.log(
    `[orchestrator] Tokens: ${metrics.totalInputTokens} in / ${metrics.totalOutputTokens} out`
  )
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

  /** Optional filter to only parse specific question types */
  onlyTypes: z.array(QuestionTypeEnum).optional(),
})

export type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>

/**
 * Main pipeline coordinator
 *
 * This function orchestrates the entire PDF parsing pipeline:
 * 1. Load PDF and hint images using loaders
 * 2. Run hint tagger to analyze hints
 * 3. Run page analyzer to map pages to questions
 * 4. Run appropriate parsers in parallel for each question type (including deck)
 * 5. Group results by type + crossId
 * 6. Merge outputs into final array containing QuestionGroup and/or Deck
 */
export async function orchestrate(payload: OrchestratorInput): Promise<OrchestratorResult> {
  const startPage = payload.pages[0]
  const endPage = payload.pages.length === 2 ? payload.pages[1] : payload.pages[0]
  const startTime = new Date()

  try {
    console.log('[orchestrator] Starting PDF parsing pipeline...')
    console.log(`[orchestrator] PDF: ${payload.pdfPath}`)
    console.log(`[orchestrator] Pages: ${startPage}-${endPage}`)
    console.log(`[orchestrator] Hints: ${payload.hintPaths.length} files`)
    if (payload.onlyTypes && payload.onlyTypes.length > 0) {
      console.log(`[orchestrator] Type filter: ${payload.onlyTypes.join(', ')}`)
    }

    // Initialize metrics accumulator and call logs
    const pipelineMetrics = createMetricsAccumulator()
    const callLogs: AICallLog[] = []

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
    for (let i = 0; i < hintTagResult.metrics.length; i++) {
      addMetrics(pipelineMetrics, callLogs, hintTagResult.metrics[i]!, `Tag hint image ${i + 1}`)
    }
    console.log(`[orchestrator] Tagged ${hintTags.length} hints`)

    // Step 3: Run page analyzer
    console.log('[orchestrator] Step 3: Analyzing pages...')
    const pageAnalyzerResult = await analyzePages({
      pdf: pdfBuffer,
      pages: payload.pages,
      hintTags,
      instruction: payload.instruction,
    })
    const pageMaps = pageAnalyzerResult.output.pageMaps
    // Collect metrics from page analyzer
    addMetrics(pipelineMetrics, callLogs, pageAnalyzerResult.metrics, `Analyze pages ${startPage}-${endPage}`)
    console.log(`[orchestrator] Analyzed ${pageMaps.length} pages`)

    // Step 4: Group questions by groupId, then by crossId within each group
    console.log('[orchestrator] Step 4: Grouping questions...')

    // Nested structure: groupId -> { questions: Map<crossId, questionInfo>, deckPages: number[] }
    const groupMap = new Map<
      string,
      {
        questions: Map<string, { type: string; pages: Set<number>; description: string }>
        deckPages: number[]
      }
    >()

    for (const pageMap of pageMaps) {
      for (const item of pageMap.included) {
        // Skip types not in filter (if filter is specified)
        if (payload.onlyTypes && payload.onlyTypes.length > 0) {
          if (!payload.onlyTypes.includes(item.type as QuestionType)) {
            continue
          }
        }

        // Determine groupId (default to "group-1" if not specified)
        const groupId = item.groupId || 'group-1'

        // Ensure group exists in map
        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, {
            questions: new Map(),
            deckPages: [],
          })
        }
        const group = groupMap.get(groupId)!

        // Handle deck content separately within each group
        if (item.type === 'deck') {
          if (!group.deckPages.includes(pageMap.page)) {
            group.deckPages.push(pageMap.page)
          }
          continue
        }

        const crossId = item.crossId || `page-${pageMap.page}-${item.type}`

        if (!group.questions.has(crossId)) {
          group.questions.set(crossId, {
            type: item.type,
            pages: new Set([pageMap.page]),
            description: item.description || '',
          })
        } else {
          group.questions.get(crossId)!.pages.add(pageMap.page)
        }
      }
    }

    // Calculate totals for logging
    const totalQuestions = Array.from(groupMap.values()).reduce((sum, g) => sum + g.questions.size, 0)
    const totalDeckPages = Array.from(groupMap.values()).reduce((sum, g) => sum + g.deckPages.length, 0)
    const filterSuffix = payload.onlyTypes?.length ? ' (after type filter)' : ''
    console.log(`[orchestrator] Found ${totalQuestions} questions in ${groupMap.size} group(s)${filterSuffix}`)
    if (totalDeckPages > 0) {
      const allDeckPages = Array.from(groupMap.values())
        .flatMap((g) => g.deckPages)
        .sort((a, b) => a - b)
      console.log(`[orchestrator] Found deck content on pages: ${allDeckPages.join(', ')}`)
    }

    // Step 5: Parse each group's questions and deck in parallel
    console.log('[orchestrator] Step 5: Parsing questions and deck...')

    // Use global position counter across all groups for SUPP PDF compatibility
    let globalPosition = 1

    // Store parsed results for each group
    interface GroupParseResult {
      groupId: string
      questions: Question[]
      emiGroupText: string | null
      emiGroupOptions: Option[]
      emiGroupExplanation: Explanation | undefined
      deckResult: DeckParserResult | null
      deckPageRange: [number] | [number, number] | null
    }
    const groupResults: GroupParseResult[] = []

    // Process each group
    for (const [groupId, group] of groupMap.entries()) {
      console.log(`[orchestrator] Processing group "${groupId}" with ${group.questions.size} questions`)

      const parsePromises: Promise<{
        question: Question
        metrics: CallMetrics
        position: number
        type: string
      }>[] = []
      const emiParsePromises: Promise<{
        result: EMISingleSelectParserResult
        crossId: string
        pages: [number] | [number, number]
      }>[] = []

      // Track EMI group-level data for this group
      let emiGroupText: string | null = null
      let emiGroupOptions: Option[] = []
      let emiGroupExplanation: Explanation | undefined = undefined

      for (const [crossId, questionInfo] of group.questions.entries()) {
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
          position: globalPosition,
          instruction: payload.instruction,
        }

        // Call the appropriate parser based on type
        const currentPosition = globalPosition
        const currentType = questionInfo.type

        switch (questionInfo.type) {
          case 'single_select':
            parsePromises.push(
              parseSingleSelect(parserInput).then((r) => ({
                ...r,
                position: currentPosition,
                type: currentType,
              }))
            )
            break
          case 'multi_select':
            parsePromises.push(
              parseMultiSelect(parserInput).then((r) => ({
                ...r,
                position: currentPosition,
                type: currentType,
              }))
            )
            break
          case 'fill_in':
            parsePromises.push(
              parseFillIn(parserInput).then((r) => ({
                ...r,
                position: currentPosition,
                type: currentType,
              }))
            )
            break
          case 'short_answer':
            parsePromises.push(
              parseShortAnswer(parserInput).then((r) => ({
                ...r,
                position: currentPosition,
                type: currentType,
              }))
            )
            break
          case 'emi_single_select':
            // EMI needs special handling - parse as a group
            emiParsePromises.push(
              parseEMISingleSelect({
                pdf: pdfBuffer,
                pages: pageRange,
                description: questionInfo.description,
                crossId,
                startPosition: globalPosition,
                instruction: payload.instruction,
              }).then((result) => ({ result, crossId, pages: pageRange }))
            )
            // Skip incrementing position here - EMI parser handles positions
            continue
          default:
            console.warn(`[orchestrator] Unknown question type: ${questionInfo.type}, skipping`)
            continue
        }

        globalPosition++
      }

      // Create deck parse promise if deck pages found in this group
      let deckParsePromise: Promise<DeckParserResult> | null = null
      let deckPageRange: [number] | [number, number] | null = null
      if (group.deckPages.length > 0) {
        const sortedDeckPages = group.deckPages.sort((a, b) => a - b)
        const deckStartPage = sortedDeckPages[0]!
        const deckEndPage = sortedDeckPages[sortedDeckPages.length - 1]!
        deckPageRange = deckStartPage === deckEndPage ? [deckStartPage] : [deckStartPage, deckEndPage]

        deckParsePromise = parseDeck({
          pdf: pdfBuffer,
          pages: deckPageRange,
          description: `Vocabulary content from pages ${deckStartPage}-${deckEndPage}`,
          crossId: `deck-${groupId}-${deckStartPage}-${deckEndPage}`,
          instruction: payload.instruction,
        })
      }

      // Wait for all parsers in this group to complete in parallel
      const [parseResults, emiResults, deckResult] = await Promise.all([
        Promise.all(parsePromises),
        Promise.all(emiParsePromises),
        deckParsePromise,
      ])

      // Extract questions and collect metrics
      const questions: Question[] = []
      for (const result of parseResults) {
        questions.push(result.question)
        addMetrics(
          pipelineMetrics,
          callLogs,
          result.metrics,
          `Parse question ${result.position} (${result.type})`
        )
      }

      // Process EMI results
      for (const { result, crossId, pages } of emiResults) {
        console.log(
          `[orchestrator] EMI group ${crossId}: ${result.questions.length} questions, ${result.groupOptions.length} shared options`
        )

        // Add EMI questions to the questions array
        questions.push(...result.questions)
        // Update global position based on EMI questions parsed
        globalPosition += result.questions.length
        const pageStr = pages.length === 2 ? `${pages[0]}-${pages[1]}` : `${pages[0]}`
        addMetrics(
          pipelineMetrics,
          callLogs,
          result.metrics,
          `Parse EMI group (${result.questions.length} questions, pages ${pageStr})`
        )

        // Store group-level EMI data (use first EMI group's data if multiple)
        if (result.groupOptions.length > 0 && emiGroupOptions.length === 0) {
          emiGroupText = result.groupText
          emiGroupOptions = result.groupOptions
          emiGroupExplanation = result.groupExplanation
        }
      }

      // Process deck result and collect metrics
      if (deckResult && deckPageRange) {
        console.log(`[orchestrator] Parsed ${deckResult.cards.length} vocabulary cards in group "${groupId}"`)
        const deckPageStr =
          deckPageRange.length === 2 ? `${deckPageRange[0]}-${deckPageRange[1]}` : `${deckPageRange[0]}`
        addMetrics(
          pipelineMetrics,
          callLogs,
          deckResult.metrics,
          `Parse deck (${deckResult.cards.length} cards, pages ${deckPageStr})`
        )
      }

      console.log(`[orchestrator] Group "${groupId}": parsed ${questions.length} questions`)

      // Store results for this group
      groupResults.push({
        groupId,
        questions,
        emiGroupText,
        emiGroupOptions,
        emiGroupExplanation,
        deckResult,
        deckPageRange,
      })
    }

    const totalQuestionsParsed = groupResults.reduce((sum, g) => sum + g.questions.length, 0)
    console.log(`[orchestrator] Parsed ${totalQuestionsParsed} questions across ${groupResults.length} group(s)`)

    // Step 6: Build final output array
    console.log('[orchestrator] Step 6: Building final output...')

    const output: OrchestratorOutput = []
    let deckPosition = 1

    for (const groupResult of groupResults) {
      // Add QuestionGroup if questions exist
      if (groupResult.questions.length > 0) {
        let questionGroup: QuestionGroup = {
          data: {
            type: 'question_group',
            attributes: {
              // Include EMI group-level text if present
              ...(groupResult.emiGroupText ? { text: groupResult.emiGroupText } : {}),
            },
            // Include EMI group-level explanation if present
            ...(groupResult.emiGroupExplanation ? { explanation: groupResult.emiGroupExplanation } : {}),
            // Include EMI shared options if present
            ...(groupResult.emiGroupOptions.length > 0 ? { options: groupResult.emiGroupOptions } : {}),
            questions: groupResult.questions,
          },
        }

        // Enrich with supplementary PDFs (if provided)
        if (payload.supplementaryPdfs && payload.supplementaryPdfs.length > 0) {
          console.log(`[orchestrator] Enriching group "${groupResult.groupId}" with supplementary PDFs...`)

          const enrichResult = await enrichAnswers({
            questionGroup,
            supplementaryPdfs: payload.supplementaryPdfs as SupplementaryPdf[],
          })

          // Collect metrics (only for first group to avoid duplicate counting)
          if (groupResult === groupResults[0]) {
            const suppPdfs = payload.supplementaryPdfs as SupplementaryPdf[]
            for (let i = 0; i < enrichResult.metrics.length; i++) {
              const suppFilename = suppPdfs[i]?.filename || `SUPP-${i + 1}`
              addMetrics(pipelineMetrics, callLogs, enrichResult.metrics[i]!, `Enrich from ${suppFilename}`)
            }
          }

          // Log enrichment summary
          if (enrichResult.enrichmentLog.length > 0) {
            console.log(`[orchestrator] Enriched ${enrichResult.enrichmentLog.length} questions in group "${groupResult.groupId}"`)
            for (const entry of enrichResult.enrichmentLog) {
              console.log(
                `[orchestrator]   Q${entry.questionPosition}: ${entry.fieldsUpdated.join(', ')} ` +
                  `(${entry.confidence} confidence from ${entry.sourceFile})`
              )
            }
          }

          // Use enriched group as final output
          questionGroup = enrichResult.enrichedGroup
        }

        output.push(questionGroup)
      }

      // Add Deck if deck content exists for this group
      if (groupResult.deckResult && groupResult.deckPageRange) {
        const deckStartPage = groupResult.deckPageRange[0]
        const deckEndPage = groupResult.deckPageRange.length === 2 ? groupResult.deckPageRange[1] : groupResult.deckPageRange[0]

        const deck: Deck = {
          type: 'deck',
          attributes: {
            name: `Vocabulary - Pages ${deckStartPage}-${deckEndPage}`,
            description: `Vocabulary extracted from PDF pages ${deckStartPage} to ${deckEndPage}`,
            position: deckPosition++,
          },
          cards: groupResult.deckResult.cards,
        }

        output.push({ data: deck })
      }
    }

    // Log if no enrichment was done
    if (!payload.supplementaryPdfs || payload.supplementaryPdfs.length === 0) {
      console.log('[orchestrator] Step 7: No supplementary PDFs, skipping enrichment')
    }

    // Check if output is empty
    if (output.length === 0) {
      throw new Error('No questions or deck content detected in PDF')
    }

    console.log('[orchestrator] Pipeline completed successfully')
    console.log(
      `[orchestrator] Output contains ${output.length} item(s): ${output.map((item) => item.data.type).join(', ')}`
    )

    // Log final metrics summary
    logMetricsSummary(pipelineMetrics)

    const endTime = new Date()

    return {
      output,
      metrics: pipelineMetrics,
      callLogs,
      startTime,
      endTime,
    }
  } catch (error) {
    console.error('[orchestrator] Pipeline failed:', error)
    throw new Error(
      `Orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
