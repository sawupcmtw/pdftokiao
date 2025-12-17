import { Command } from 'commander'
import { writeFile, mkdir, readdir } from 'fs/promises'
import { join, resolve, dirname } from 'path'
import {
  discoverTestCases,
  loadTestCase,
  formatTestCase,
  formatSupplementaryScope,
  TestLoaderError,
  type TestCase,
} from '../../core/loader/test-loader.js'
import { loadPdf, loadImages, PdfLoaderError, ImageLoaderError } from '../../core/loader/index.js'
import { ParseInputSchema } from '../../core/schemas/index.js'
import { orchestrate } from '../../trigger/index.js'
import type { OrchestratorResult } from '../../core/schemas/index.js'

// Default test files directory
const DEFAULT_TEST_DIR = './test_files'

/**
 * Test command - Load and run test cases from organized folders
 */
export function createTestCommand(): Command {
  const testCmd = new Command('test')

  testCmd
    .description('Load and run test cases from organized test folders')
    .argument('[name]', 'Test case folder name (e.g., "example")')
    .option('-l, --list', 'List all discovered test cases')
    .option('-r, --run', 'Run the parser on the test case')
    .option('-d, --dir <path>', 'Test files directory', DEFAULT_TEST_DIR)
    .action(async (name: string | undefined, options) => {
      try {
        const testDir = resolve(options.dir)

        // List mode
        if (options.list) {
          await listTestCases(testDir)
          return
        }

        // Require test case name if not listing
        if (!name) {
          console.error('Error: Test case name is required.')
          console.error('Usage: pdftokiao test <name> [options]')
          console.error('       pdftokiao test --list')
          process.exit(1)
        }

        // Load the specified test case
        const folderPath = join(testDir, name)
        let testCase: TestCase
        try {
          testCase = await loadTestCase(folderPath)
        } catch (error) {
          if (error instanceof TestLoaderError) {
            console.error(`Error: ${error.message}`)
          } else {
            console.error(`Error loading test case: ${name}`)
          }
          process.exit(1)
        }

        // Display test case info
        console.log('\n=== Test Case Loaded ===')
        console.log(`Name: ${testCase.name}`)
        console.log(
          `Pages: ${testCase.pages.length === 1 ? testCase.pages[0] : `${testCase.pages[0]}-${testCase.pages[1]}`}`
        )
        console.log(`PDF: ${testCase.pdfPath}`)
        console.log(`Hints: ${testCase.hintPaths.length} image(s)`)
        if (testCase.hintPaths.length > 0) {
          testCase.hintPaths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))
        }
        console.log(`Supplementary PDFs: ${testCase.supplementaryPdfs.length} file(s)`)
        if (testCase.supplementaryPdfs.length > 0) {
          testCase.supplementaryPdfs.forEach((supp, i) =>
            console.log(`  ${i + 1}. ${supp.filename} (${formatSupplementaryScope(supp.scope)})`)
          )
        }
        console.log(`Instruction: ${testCase.instruction ? 'Yes' : 'No'}`)
        if (testCase.instruction) {
          console.log(
            `  "${testCase.instruction.substring(0, 100)}${testCase.instruction.length > 100 ? '...' : ''}"`
          )
        }

        // Run mode
        if (options.run) {
          await runTestCase(testCase)
        } else {
          console.log('\nUse --run to execute the parser on this test case.')
        }
      } catch (error) {
        console.error('\n=== Error ===')
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('An unexpected error occurred:', error)
        }
        process.exit(1)
      }
    })

  return testCmd
}

/**
 * List all discovered test cases
 */
async function listTestCases(testDir: string): Promise<void> {
  console.log(`\nScanning for test cases in: ${testDir}\n`)

  try {
    const testCases = await discoverTestCases(testDir)

    if (testCases.length === 0) {
      console.log('No test cases found.')
      console.log('\nEach folder should contain CONTENT-[pages].pdf')
      console.log('Examples: CONTENT-[1].pdf, CONTENT-[1,5].pdf')
      return
    }

    console.log(`Found ${testCases.length} test case(s):\n`)
    for (const tc of testCases) {
      console.log(`  ${formatTestCase(tc)}`)
    }
    console.log('\nUse: pdftokiao test <name> to view details')
    console.log('Use: pdftokiao test <name> --run to run parser')
  } catch (error) {
    if (error instanceof TestLoaderError) {
      console.error(`Error: ${error.message}`)
    } else {
      throw error
    }
  }
}

/**
 * Get the next available run number by scanning existing output folders
 */
async function getNextRunNumber(testCasePath: string): Promise<number> {
  const outputsDir = join(testCasePath, 'outputs')
  try {
    const entries = await readdir(outputsDir, { withFileTypes: true })
    const runNumbers = entries
      .filter((e) => e.isDirectory() && /^\d+$/.test(e.name))
      .map((e) => parseInt(e.name, 10))
    return runNumbers.length > 0 ? Math.max(...runNumbers) + 1 : 1
  } catch {
    return 1 // outputs folder doesn't exist yet
  }
}

/**
 * Format duration in human-readable form
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = ms / 1000
  if (seconds < 60) return `${seconds.toFixed(2)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`
}

/**
 * Format pipeline logs as human-readable text
 */
function formatLogs(
  result: OrchestratorResult,
  testCase: TestCase,
  runNumber: number,
  questionCount: number,
  deckCardCount: number
): string {
  const lines: string[] = []
  const { metrics, callLogs, startTime, endTime } = result
  const totalMs = endTime.getTime() - startTime.getTime()

  // Header
  lines.push('='.repeat(60))
  lines.push('PDF TO KIAO - Pipeline Execution Log')
  lines.push('='.repeat(60))
  lines.push('')

  // Run info
  lines.push('--- Run Information ---')
  lines.push(`Test Case: ${testCase.name}`)
  lines.push(`Run Number: ${runNumber}`)
  lines.push(`Started: ${startTime.toISOString()}`)
  lines.push(`Completed: ${endTime.toISOString()}`)
  lines.push('')

  // Input summary
  lines.push('--- Input Summary ---')
  lines.push(`PDF: ${testCase.pdfPath}`)
  const pageStr =
    testCase.pages.length === 1 ? `${testCase.pages[0]}` : `${testCase.pages[0]}-${testCase.pages[1]}`
  lines.push(`Pages: ${pageStr}`)
  lines.push(`Hint Images: ${testCase.hintPaths.length}`)
  lines.push(`Supplementary PDFs: ${testCase.supplementaryPdfs.length}`)
  lines.push('')

  // Output summary
  lines.push('--- Output Summary ---')
  lines.push(`Questions Parsed: ${questionCount}`)
  lines.push(`Deck Cards Parsed: ${deckCardCount}`)
  lines.push('')

  // AI Calls table
  lines.push(`--- AI Calls (${metrics.apiCalls} total, ${metrics.cacheHits} cache hits) ---`)
  lines.push(' #  Goal                                          Tokens In/Out      Time     Cache')
  callLogs.forEach((log, i) => {
    const num = String(i + 1).padStart(2, ' ')
    const goal = log.goal.padEnd(44, ' ').slice(0, 44)
    const tokens = `${log.inputTokens.toLocaleString()} / ${log.outputTokens.toLocaleString()}`.padStart(16, ' ')
    const time = `${log.latencyMs}ms`.padStart(9, ' ')
    const cache = log.cacheHit ? '  HIT' : ''
    lines.push(`${num}  ${goal}  ${tokens}  ${time}${cache}`)
  })
  lines.push('')

  // Totals
  lines.push('--- Totals ---')
  lines.push(`Input Tokens:  ${metrics.totalInputTokens.toLocaleString()}`)
  lines.push(`Output Tokens: ${metrics.totalOutputTokens.toLocaleString()}`)
  lines.push(
    `Total Tokens:  ${(metrics.totalInputTokens + metrics.totalOutputTokens).toLocaleString()}`
  )
  lines.push(`Total Retries: ${metrics.totalRetries}`)
  lines.push('')

  // Timing
  lines.push('--- Timing ---')
  lines.push(`Total Time: ${formatDuration(totalMs)}`)
  lines.push(`AI Latency: ${formatDuration(metrics.totalLatencyMs)}`)
  lines.push(`Overhead:   ${formatDuration(totalMs - metrics.totalLatencyMs)}`)
  lines.push('')

  // Footer
  lines.push('='.repeat(60))

  return lines.join('\n')
}

/**
 * Run the parser on a test case
 */
async function runTestCase(testCase: TestCase): Promise<void> {
  console.log('\n=== Running Parser ===\n')

  // Load PDF
  console.log(`\nLoading PDF: ${testCase.pdfPath}`)
  let pdfBuffer: Buffer
  try {
    pdfBuffer = await loadPdf(testCase.pdfPath)
    console.log(`  PDF loaded successfully (${(pdfBuffer.length / 1024).toFixed(2)} KB)`)
  } catch (error) {
    if (error instanceof PdfLoaderError) {
      throw new Error(`Failed to load PDF: ${error.message}`)
    }
    throw error
  }

  // Load hint images
  let hintBuffers: Buffer[] = []
  if (testCase.hintPaths.length > 0) {
    console.log(`\nLoading ${testCase.hintPaths.length} hint image(s)...`)
    try {
      hintBuffers = await loadImages(testCase.hintPaths)
      console.log('  All hint images loaded successfully')
    } catch (error) {
      if (error instanceof ImageLoaderError) {
        throw new Error(`Failed to load hint images: ${error.message}`)
      }
      throw error
    }
  }

  // Validate input
  console.log('\nValidating input schema...')
  ParseInputSchema.parse({
    pdf: pdfBuffer,
    pages: testCase.pages,
    hints: hintBuffers,
    instruction: testCase.instruction,
  })
  console.log('  Input validated successfully')

  // Run orchestrator pipeline (handles both questions and deck)
  console.log('\n=== Running Pipeline ===\n')

  let result: OrchestratorResult
  try {
    result = await orchestrate({
      pdfPath: testCase.pdfPath,
      pages: testCase.pages,
      hintPaths: testCase.hintPaths,
      instruction: testCase.instruction,
      supplementaryPdfs: testCase.supplementaryPdfs,
    })
    console.log('[test] Pipeline completed')
  } catch (e) {
    throw new Error(`Pipeline failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
  }

  // Extract question groups and decks from output
  const { output } = result
  const questionGroups = output.filter((item) => item.data.type === 'question_group')
  const decks = output.filter((item) => item.data.type === 'deck')

  // Create output directory
  const testCasePath = dirname(testCase.pdfPath)
  const runNumber = await getNextRunNumber(testCasePath)
  const outputDir = join(testCasePath, 'outputs', String(runNumber))
  console.log(`\nCreating output directory: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  // Write outputs
  const writtenFiles: string[] = []

  if (questionGroups.length > 0) {
    const questionGroupPath = join(outputDir, 'question-group.json')
    await writeFile(questionGroupPath, JSON.stringify(questionGroups, null, 2), 'utf-8')
    writtenFiles.push(questionGroupPath)
  }

  if (decks.length > 0) {
    const deckPath = join(outputDir, 'deck.json')
    await writeFile(deckPath, JSON.stringify(decks, null, 2), 'utf-8')
    writtenFiles.push(deckPath)
  }

  // Calculate counts for logs
  const questionCount = questionGroups.reduce((sum, qg) => {
    const data = qg.data as { questions?: unknown[] }
    return sum + (data.questions?.length || 0)
  }, 0)
  const deckCardCount = decks.reduce((sum, d) => {
    const data = d.data as { cards?: unknown[] }
    return sum + (data.cards?.length || 0)
  }, 0)

  // Write logs.txt
  const logsContent = formatLogs(result, testCase, runNumber, questionCount, deckCardCount)
  const logsPath = join(outputDir, 'logs.txt')
  await writeFile(logsPath, logsContent, 'utf-8')
  writtenFiles.push(logsPath)

  console.log('\n=== Success ===')
  console.log(`Run #${runNumber} - Output written to:`)
  for (const file of writtenFiles) {
    console.log(`  ${file}`)
  }
}
