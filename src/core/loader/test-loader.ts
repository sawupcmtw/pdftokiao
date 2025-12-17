import { readdir, readFile, stat } from 'fs/promises'
import { join, basename } from 'path'
import type { SupplementaryPdf, SupplementaryScope } from '../schemas/index.js'

/**
 * Represents a discovered test case
 */
export interface TestCase {
  name: string
  pages: [number] | [number, number]
  pdfPath: string
  instruction?: string
  hintPaths: string[]
  folderPath: string
  supplementaryPdfs: SupplementaryPdf[]
}

/**
 * Custom error for test loader operations
 */
export class TestLoaderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TestLoaderError'
  }
}

// Regex: matches "CONTENT-[start]" or "CONTENT-[start,end]" with .pdf extension
const PDF_PATTERN = /^CONTENT-\[(\d+)(?:,(\d+))?\]\.pdf$/i

// Regex: matches supplementary PDF files with scope
// Examples: SUPP-all.pdf, SUPP-pages-1-5.pdf, SUPP-type-single_select.pdf, SUPP-questions-1,2,5.pdf
const SUPP_PATTERN =
  /^SUPP-(all|pages-(\d+)(?:-(\d+))?|type-(single_select|multi_select|fill_in|short_answer)|questions-(\d+(?:,\d+)*))\.pdf$/i

// File name constants
const INSTRUCTION_FILE = 'INST.txt'
const HINT_PATTERN = /^IMAGE-.+\.(jpg|jpeg|png)$/i

/**
 * Parse a PDF filename to extract page range
 * @param filename - PDF filename like "CONTENT-[1,2].pdf" or "CONTENT-[1].pdf"
 * @returns Parsed pages, or null if invalid format
 */
export function parsePdfFilename(filename: string): { pages: [number] | [number, number] } | null {
  const match = filename.match(PDF_PATTERN)
  if (!match) {
    return null
  }

  const startPage = parseInt(match[1]!, 10)
  const endPage = match[2] ? parseInt(match[2], 10) : undefined

  if (startPage < 1) {
    return null
  }

  if (endPage !== undefined) {
    if (endPage < 1 || startPage > endPage) {
      return null
    }
    return { pages: [startPage, endPage] }
  }

  return { pages: [startPage] }
}

/**
 * Parse a supplementary PDF filename to extract scope
 * @param filename - PDF filename like "SUPP-all.pdf" or "SUPP-pages-1-5.pdf"
 * @returns Parsed scope, or null if invalid format
 */
export function parseSupplementaryFilename(filename: string): SupplementaryScope | null {
  const match = filename.match(SUPP_PATTERN)
  if (!match) {
    return null
  }

  const scopeStr = match[1]!.toLowerCase()

  // Handle 'all' scope
  if (scopeStr === 'all') {
    return { type: 'all' }
  }

  // Handle 'pages-X' or 'pages-X-Y' scope
  if (scopeStr.startsWith('pages-')) {
    const startPage = parseInt(match[2]!, 10)
    const endPage = match[3] ? parseInt(match[3], 10) : startPage
    if (startPage < 1 || endPage < startPage) {
      return null
    }
    return { type: 'pages', startPage, endPage }
  }

  // Handle 'type-X' scope
  if (scopeStr.startsWith('type-')) {
    const questionType = match[4]!.toLowerCase() as
      | 'single_select'
      | 'multi_select'
      | 'fill_in'
      | 'short_answer'
    return { type: 'type', questionType }
  }

  // Handle 'questions-X,Y,Z' scope
  if (scopeStr.startsWith('questions-')) {
    const questionNumbers = match[5]!.split(',').map((n) => parseInt(n, 10))
    if (questionNumbers.some((n) => n < 1 || isNaN(n))) {
      return null
    }
    return { type: 'questions', questionNumbers }
  }

  return null
}

/**
 * Find all supplementary PDFs in a directory
 * @param folderPath - Path to search
 * @returns Array of supplementary PDF metadata
 */
async function findSupplementaryPdfs(folderPath: string): Promise<SupplementaryPdf[]> {
  const supplementaryPdfs: SupplementaryPdf[] = []

  try {
    const files = await readdir(folderPath)
    for (const file of files) {
      const scope = parseSupplementaryFilename(file)
      if (scope) {
        supplementaryPdfs.push({
          path: join(folderPath, file),
          scope,
          filename: file,
        })
      }
    }
  } catch {
    // Ignore errors
  }

  // Sort by scope type for consistent ordering: all > pages > type > questions
  const scopeOrder: Record<string, number> = { all: 0, pages: 1, type: 2, questions: 3 }
  supplementaryPdfs.sort((a, b) => scopeOrder[a.scope.type]! - scopeOrder[b.scope.type]!)

  return supplementaryPdfs
}

/**
 * Find the CONTENT-[pages].pdf file in a directory
 * @param folderPath - Path to search
 * @returns Object with pdfPath and pages, or null if not found
 */
async function findContentPdf(
  folderPath: string
): Promise<{ pdfPath: string; pages: [number] | [number, number] } | null> {
  try {
    const files = await readdir(folderPath)
    for (const file of files) {
      const parsed = parsePdfFilename(file)
      if (parsed) {
        return {
          pdfPath: join(folderPath, file),
          pages: parsed.pages,
        }
      }
    }
  } catch {
    // Ignore errors
  }
  return null
}

/**
 * Discover all valid test case folders in a directory
 * @param baseDir - Base directory to scan (e.g., "test_files")
 * @returns Array of discovered test cases
 */
export async function discoverTestCases(baseDir: string): Promise<TestCase[]> {
  const testCases: TestCase[] = []

  let entries: string[]
  try {
    entries = await readdir(baseDir)
  } catch {
    throw new TestLoaderError(`Cannot read directory: ${baseDir}`)
  }

  for (const entry of entries) {
    const folderPath = join(baseDir, entry)

    // Check if it's a directory
    try {
      const stats = await stat(folderPath)
      if (!stats.isDirectory()) {
        continue
      }
    } catch {
      continue
    }

    // Check if folder contains a valid CONTENT-[pages].pdf
    const pdfInfo = await findContentPdf(folderPath)
    if (!pdfInfo) {
      continue
    }

    // Load the full test case
    try {
      const testCase = await loadTestCase(folderPath)
      testCases.push(testCase)
    } catch {
      // Skip invalid test cases
      continue
    }
  }

  // Sort by name for consistent ordering
  testCases.sort((a, b) => a.name.localeCompare(b.name))

  return testCases
}

/**
 * Load a single test case from a folder
 * @param folderPath - Path to the test case folder
 * @returns Loaded test case with all file paths resolved
 */
export async function loadTestCase(folderPath: string): Promise<TestCase> {
  const folderName = basename(folderPath)

  // Find CONTENT-[pages].pdf
  const pdfInfo = await findContentPdf(folderPath)
  if (!pdfInfo) {
    throw new TestLoaderError(
      `Missing CONTENT-[pages].pdf in ${folderPath}. Expected format: CONTENT-[1].pdf or CONTENT-[1,3].pdf`
    )
  }

  // Check for optional INST.txt
  let instruction: string | undefined
  const instructionPath = join(folderPath, INSTRUCTION_FILE)
  try {
    await stat(instructionPath)
    instruction = (await readFile(instructionPath, 'utf-8')).trim()
  } catch {
    // Instruction file is optional
  }

  // Find hint images (IMAGE-*.jpg, IMAGE-*.png)
  const hintPaths: string[] = []
  try {
    const files = await readdir(folderPath)
    for (const file of files) {
      if (HINT_PATTERN.test(file)) {
        hintPaths.push(join(folderPath, file))
      }
    }
    // Sort for consistent ordering
    hintPaths.sort()
  } catch {
    // Ignore errors reading directory for hints
  }

  // Find supplementary PDFs (SUPP-*.pdf)
  const supplementaryPdfs = await findSupplementaryPdfs(folderPath)

  const result: TestCase = {
    name: folderName,
    pages: pdfInfo.pages,
    pdfPath: pdfInfo.pdfPath,
    hintPaths,
    folderPath,
    supplementaryPdfs,
  }

  if (instruction) {
    result.instruction = instruction
  }

  return result
}

/**
 * Format a test case for display
 * @param testCase - Test case to format
 * @returns Formatted string representation
 */
export function formatTestCase(testCase: TestCase): string {
  const pageStr =
    testCase.pages.length === 1
      ? `page ${testCase.pages[0]}`
      : `pages ${testCase.pages[0]}-${testCase.pages[1]}`

  const hintStr =
    testCase.hintPaths.length > 0 ? `${testCase.hintPaths.length} hint(s)` : 'no hints'

  const suppStr =
    testCase.supplementaryPdfs.length > 0
      ? `${testCase.supplementaryPdfs.length} supp(s)`
      : 'no supplementary'

  const instStr = testCase.instruction ? 'has instruction' : 'no instruction'

  return `${testCase.name} [${pageStr}] - ${hintStr}, ${suppStr}, ${instStr}`
}

/**
 * Format a supplementary scope for display
 * @param scope - Supplementary scope to format
 * @returns Formatted string representation
 */
export function formatSupplementaryScope(scope: SupplementaryScope): string {
  switch (scope.type) {
    case 'all':
      return 'all questions'
    case 'pages':
      return scope.startPage === scope.endPage
        ? `page ${scope.startPage}`
        : `pages ${scope.startPage}-${scope.endPage}`
    case 'type':
      return `${scope.questionType.replace('_', ' ')} type`
    case 'questions':
      return `questions ${scope.questionNumbers.join(', ')}`
  }
}
