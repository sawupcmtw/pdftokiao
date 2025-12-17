import { Command } from 'commander'
import { writeFile, mkdir, readdir } from 'fs/promises'
import { join, resolve, dirname } from 'path'
import { randomUUID } from 'crypto'
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
import { orchestrate, orchestrateDeck } from '../../trigger/index.js'

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
    .option('--material-id <id>', 'Override material ID (default: auto-generated)')
    .option('--import-key <key>', 'Override import key (default: auto-generated UUID)')
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
          await runTestCase(testCase, options)
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
 * Run the parser on a test case
 */
async function runTestCase(
  testCase: TestCase,
  options: { materialId?: string; importKey?: string }
): Promise<void> {
  console.log('\n=== Running Parser ===\n')

  // Generate or use provided IDs
  const materialId = options.materialId ? parseInt(options.materialId, 10) : Date.now() % 100000
  const importKey = options.importKey || randomUUID()

  if (options.materialId && (isNaN(materialId) || materialId < 1)) {
    throw new Error('Material ID must be a positive integer')
  }

  console.log(`Material ID: ${materialId}`)
  console.log(`Import Key: ${importKey}`)

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
    materialId,
    importKey,
  })
  console.log('  Input validated successfully')

  // Run both orchestrators
  console.log('\n=== Running Pipelines ===\n')

  // Run question orchestrator
  let questionGroupOutput = null
  try {
    console.log('[test] Running question group pipeline...')
    questionGroupOutput = await orchestrate({
      pdfPath: testCase.pdfPath,
      pages: testCase.pages,
      hintPaths: testCase.hintPaths,
      instruction: testCase.instruction,
      materialId,
      importKey,
      supplementaryPdfs: testCase.supplementaryPdfs,
    })
    console.log('[test] Question group pipeline completed')
  } catch (e) {
    console.log(
      `[test] Question parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`
    )
  }

  // Run deck orchestrator
  let deckOutput = null
  try {
    console.log('[test] Running deck pipeline...')
    deckOutput = await orchestrateDeck({
      pdfPath: testCase.pdfPath,
      pages: testCase.pages,
      deckName: testCase.name,
      importKey,
      instruction: testCase.instruction,
    })
    console.log('[test] Deck pipeline completed')
  } catch (e) {
    console.log(`[test] Deck parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
  }

  // Check if we have any output
  if (!questionGroupOutput && !deckOutput) {
    throw new Error('Both question and deck parsing failed - no output generated')
  }

  // Create output directory
  const testCasePath = dirname(testCase.pdfPath)
  const runNumber = await getNextRunNumber(testCasePath)
  const outputDir = join(testCasePath, 'outputs', String(runNumber))
  console.log(`\nCreating output directory: ${outputDir}`)
  await mkdir(outputDir, { recursive: true })

  // Write outputs
  const writtenFiles: string[] = []

  if (questionGroupOutput) {
    const questionGroupPath = join(outputDir, 'question-group.json')
    await writeFile(questionGroupPath, JSON.stringify(questionGroupOutput, null, 2), 'utf-8')
    writtenFiles.push(questionGroupPath)
  }

  if (deckOutput) {
    const deckPath = join(outputDir, 'deck.json')
    await writeFile(deckPath, JSON.stringify(deckOutput, null, 2), 'utf-8')
    writtenFiles.push(deckPath)
  }

  console.log('\n=== Success ===')
  console.log(`Run #${runNumber} - Output written to:`)
  for (const file of writtenFiles) {
    console.log(`  ${file}`)
  }
}
