import { readFile } from 'fs/promises'
import { access } from 'fs/promises'
import { constants } from 'fs'
import { createRequire } from 'module'

// pdf-parse uses CommonJS exports, use createRequire for proper ESM compatibility
const require = createRequire(import.meta.url)
const pdf: typeof import('pdf-parse') = require('pdf-parse')

/**
 * Custom error class for PDF loader errors
 */
export class PdfLoaderError extends Error {
  constructor(
    message: string,
    public override readonly cause?: Error
  ) {
    super(message)
    this.name = 'PdfLoaderError'
  }
}

/**
 * Load entire PDF as Buffer
 * @param filePath - Path to the PDF file
 * @returns Promise<Buffer> - The PDF file as a Buffer
 * @throws {PdfLoaderError} If file doesn't exist, is not accessible, or is not a valid PDF
 */
export async function loadPdf(filePath: string): Promise<Buffer> {
  try {
    // Check if file exists and is accessible
    await access(filePath, constants.F_OK | constants.R_OK)
  } catch (error) {
    throw new PdfLoaderError(
      `File not found or not accessible: ${filePath}`,
      error instanceof Error ? error : undefined
    )
  }

  // Validate file extension
  if (!filePath.toLowerCase().endsWith('.pdf')) {
    throw new PdfLoaderError(`Invalid file format: Expected .pdf file, got ${filePath}`)
  }

  try {
    const buffer = await readFile(filePath)

    // Validate that it's a valid PDF by checking the magic number
    if (!buffer.toString('utf-8', 0, 5).startsWith('%PDF-')) {
      throw new PdfLoaderError(`Invalid PDF format: File does not appear to be a valid PDF`)
    }

    return buffer
  } catch (error) {
    if (error instanceof PdfLoaderError) {
      throw error
    }
    throw new PdfLoaderError(
      `Failed to load PDF file: ${filePath}`,
      error instanceof Error ? error : undefined
    )
  }
}

/**
 * Extract specific pages from a PDF as image buffers
 *
 * NOTE: This function currently uses pdf-parse for text extraction.
 * For actual image extraction, you'll need to install additional packages:
 * - pdf-to-png-converter: For converting PDF pages to PNG images
 * - pdf-lib: For advanced PDF manipulation
 * - canvas: Required by some PDF-to-image libraries
 *
 * Example installation:
 * pnpm add pdf-to-png-converter
 *
 * @param pdf - PDF file as Buffer
 * @param pages - Page range: single page [3] or range [1, 5]
 * @returns Promise<Buffer[]> - Array of image buffers (one per page)
 * @throws {PdfLoaderError} If page range is invalid or extraction fails
 */
export async function extractPages(
  pdfBuffer: Buffer,
  pages: [number] | [number, number]
): Promise<Buffer[]> {
  try {
    // Parse PDF to get metadata
    const data = await pdf(pdfBuffer)
    const totalPages = data.numpages

    // Validate page range
    if (pages.length > 2) {
      throw new PdfLoaderError(`Invalid page range format: Expected [page] or [startPage, endPage]`)
    }

    const startPage = pages[0]
    const endPage = pages.length === 2 ? pages[1] : pages[0]

    // Validate page numbers
    if (startPage < 1 || endPage < 1) {
      throw new PdfLoaderError(`Invalid page numbers: Page numbers must be >= 1`)
    }

    if (startPage > totalPages || endPage > totalPages) {
      throw new PdfLoaderError(
        `Invalid page range: PDF has ${totalPages} pages, but requested pages ${startPage}-${endPage}`
      )
    }

    if (startPage > endPage) {
      throw new PdfLoaderError(
        `Invalid page range: Start page (${startPage}) must be <= end page (${endPage})`
      )
    }

    // TODO: Implement actual PDF-to-image conversion
    // This is a placeholder implementation
    // You'll need to install and use a package like pdf-to-png-converter

    // For now, throw an error indicating the feature is not yet implemented
    // In production, this should convert each page to a PNG/JPEG image
    throw new PdfLoaderError(
      `PDF-to-image conversion not yet implemented. ` +
        `Please install pdf-to-png-converter or similar package. ` +
        `Requested pages: ${startPage}-${endPage} from ${totalPages} total pages.`
    )

    // Example implementation with pdf-to-png-converter (when installed):
    /*
    const { pdfToPng } = await import('pdf-to-png-converter');

    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      const pngPages = await pdfToPng(pdfBuffer, {
        pageNumbers: [pageNum],
        outputType: 'buffer'
      });

      if (pngPages.length > 0) {
        pageBuffers.push(pngPages[0].content as Buffer);
      }
    }

    return pageBuffers;
    */
  } catch (error) {
    if (error instanceof PdfLoaderError) {
      throw error
    }
    throw new PdfLoaderError(
      `Failed to extract pages from PDF`,
      error instanceof Error ? error : undefined
    )
  }
}

/**
 * Get PDF metadata including number of pages
 * @param pdfBuffer - PDF file as Buffer
 * @returns Promise with PDF metadata
 */
export async function getPdfMetadata(pdfBuffer: Buffer): Promise<{
  numPages: number
  info?: {
    Title?: string
    Author?: string
    Subject?: string
    Creator?: string
    Producer?: string
    CreationDate?: Date
    ModDate?: Date
  }
}> {
  try {
    const data = await pdf(pdfBuffer)

    const result: {
      numPages: number
      info?: {
        Title?: string
        Author?: string
        Subject?: string
        Creator?: string
        Producer?: string
        CreationDate?: Date
        ModDate?: Date
      }
    } = {
      numPages: data.numpages,
    }

    if (data.info) {
      result.info = {
        Title: data.info.Title,
        Author: data.info.Author,
        Subject: data.info.Subject,
        Creator: data.info.Creator,
        Producer: data.info.Producer,
        CreationDate: data.info.CreationDate,
        ModDate: data.info.ModDate,
      }
    }

    return result
  } catch (error) {
    throw new PdfLoaderError(
      `Failed to get PDF metadata`,
      error instanceof Error ? error : undefined
    )
  }
}
