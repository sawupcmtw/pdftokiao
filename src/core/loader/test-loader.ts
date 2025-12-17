import { readdir, readFile, stat } from 'fs/promises';
import { join, basename } from 'path';

/**
 * Represents a discovered test case
 */
export interface TestCase {
  name: string;
  pages: [number] | [number, number];
  pdfPath: string;
  instruction?: string;
  hintPaths: string[];
  folderPath: string;
}

/**
 * Custom error for test loader operations
 */
export class TestLoaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestLoaderError';
  }
}

// Regex: matches "CONTENT-[start]" or "CONTENT-[start,end]" with .pdf extension
const PDF_PATTERN = /^CONTENT-\[(\d+)(?:,(\d+))?\]\.pdf$/i;

// File name constants
const INSTRUCTION_FILE = 'INST.txt';
const HINT_PATTERN = /^IMAGE-.+\.(jpg|jpeg|png)$/i;

/**
 * Parse a PDF filename to extract page range
 * @param filename - PDF filename like "CONTENT-[1,2].pdf" or "CONTENT-[1].pdf"
 * @returns Parsed pages, or null if invalid format
 */
export function parsePdfFilename(filename: string): { pages: [number] | [number, number] } | null {
  const match = filename.match(PDF_PATTERN);
  if (!match) {
    return null;
  }

  const startPage = parseInt(match[1]!, 10);
  const endPage = match[2] ? parseInt(match[2], 10) : undefined;

  if (startPage < 1) {
    return null;
  }

  if (endPage !== undefined) {
    if (endPage < 1 || startPage > endPage) {
      return null;
    }
    return { pages: [startPage, endPage] };
  }

  return { pages: [startPage] };
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
    const files = await readdir(folderPath);
    for (const file of files) {
      const parsed = parsePdfFilename(file);
      if (parsed) {
        return {
          pdfPath: join(folderPath, file),
          pages: parsed.pages,
        };
      }
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Discover all valid test case folders in a directory
 * @param baseDir - Base directory to scan (e.g., "test_files")
 * @returns Array of discovered test cases
 */
export async function discoverTestCases(baseDir: string): Promise<TestCase[]> {
  const testCases: TestCase[] = [];

  let entries: string[];
  try {
    entries = await readdir(baseDir);
  } catch {
    throw new TestLoaderError(`Cannot read directory: ${baseDir}`);
  }

  for (const entry of entries) {
    const folderPath = join(baseDir, entry);

    // Check if it's a directory
    try {
      const stats = await stat(folderPath);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }

    // Check if folder contains a valid CONTENT-[pages].pdf
    const pdfInfo = await findContentPdf(folderPath);
    if (!pdfInfo) {
      continue;
    }

    // Load the full test case
    try {
      const testCase = await loadTestCase(folderPath);
      testCases.push(testCase);
    } catch {
      // Skip invalid test cases
      continue;
    }
  }

  // Sort by name for consistent ordering
  testCases.sort((a, b) => a.name.localeCompare(b.name));

  return testCases;
}

/**
 * Load a single test case from a folder
 * @param folderPath - Path to the test case folder
 * @returns Loaded test case with all file paths resolved
 */
export async function loadTestCase(folderPath: string): Promise<TestCase> {
  const folderName = basename(folderPath);

  // Find CONTENT-[pages].pdf
  const pdfInfo = await findContentPdf(folderPath);
  if (!pdfInfo) {
    throw new TestLoaderError(
      `Missing CONTENT-[pages].pdf in ${folderPath}. Expected format: CONTENT-[1].pdf or CONTENT-[1,3].pdf`
    );
  }

  // Check for optional INST.txt
  let instruction: string | undefined;
  const instructionPath = join(folderPath, INSTRUCTION_FILE);
  try {
    await stat(instructionPath);
    instruction = (await readFile(instructionPath, 'utf-8')).trim();
  } catch {
    // Instruction file is optional
  }

  // Find hint images (IMAGE-*.jpg, IMAGE-*.png)
  const hintPaths: string[] = [];
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      if (HINT_PATTERN.test(file)) {
        hintPaths.push(join(folderPath, file));
      }
    }
    // Sort for consistent ordering
    hintPaths.sort();
  } catch {
    // Ignore errors reading directory for hints
  }

  const result: TestCase = {
    name: folderName,
    pages: pdfInfo.pages,
    pdfPath: pdfInfo.pdfPath,
    hintPaths,
    folderPath,
  };

  if (instruction) {
    result.instruction = instruction;
  }

  return result;
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
      : `pages ${testCase.pages[0]}-${testCase.pages[1]}`;

  const hintStr =
    testCase.hintPaths.length > 0 ? `${testCase.hintPaths.length} hint(s)` : 'no hints';

  const instStr = testCase.instruction ? 'has instruction' : 'no instruction';

  return `${testCase.name} [${pageStr}] - ${hintStr}, ${instStr}`;
}
