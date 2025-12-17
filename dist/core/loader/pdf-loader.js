import { readFile } from 'fs/promises';
import { access } from 'fs/promises';
import { constants } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
export class PdfLoaderError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'PdfLoaderError';
    }
}
export async function loadPdf(filePath) {
    try {
        await access(filePath, constants.F_OK | constants.R_OK);
    }
    catch (error) {
        throw new PdfLoaderError(`File not found or not accessible: ${filePath}`, error instanceof Error ? error : undefined);
    }
    if (!filePath.toLowerCase().endsWith('.pdf')) {
        throw new PdfLoaderError(`Invalid file format: Expected .pdf file, got ${filePath}`);
    }
    try {
        const buffer = await readFile(filePath);
        if (!buffer.toString('utf-8', 0, 5).startsWith('%PDF-')) {
            throw new PdfLoaderError(`Invalid PDF format: File does not appear to be a valid PDF`);
        }
        return buffer;
    }
    catch (error) {
        if (error instanceof PdfLoaderError) {
            throw error;
        }
        throw new PdfLoaderError(`Failed to load PDF file: ${filePath}`, error instanceof Error ? error : undefined);
    }
}
export async function extractPages(pdfBuffer, pages) {
    try {
        const data = await pdf(pdfBuffer);
        const totalPages = data.numpages;
        if (pages.length > 2) {
            throw new PdfLoaderError(`Invalid page range format: Expected [page] or [startPage, endPage]`);
        }
        const startPage = pages[0];
        const endPage = pages.length === 2 ? pages[1] : pages[0];
        if (startPage < 1 || endPage < 1) {
            throw new PdfLoaderError(`Invalid page numbers: Page numbers must be >= 1`);
        }
        if (startPage > totalPages || endPage > totalPages) {
            throw new PdfLoaderError(`Invalid page range: PDF has ${totalPages} pages, but requested pages ${startPage}-${endPage}`);
        }
        if (startPage > endPage) {
            throw new PdfLoaderError(`Invalid page range: Start page (${startPage}) must be <= end page (${endPage})`);
        }
        throw new PdfLoaderError(`PDF-to-image conversion not yet implemented. ` +
            `Please install pdf-to-png-converter or similar package. ` +
            `Requested pages: ${startPage}-${endPage} from ${totalPages} total pages.`);
    }
    catch (error) {
        if (error instanceof PdfLoaderError) {
            throw error;
        }
        throw new PdfLoaderError(`Failed to extract pages from PDF`, error instanceof Error ? error : undefined);
    }
}
export async function getPdfMetadata(pdfBuffer) {
    try {
        const data = await pdf(pdfBuffer);
        const result = {
            numPages: data.numpages,
        };
        if (data.info) {
            result.info = {
                Title: data.info.Title,
                Author: data.info.Author,
                Subject: data.info.Subject,
                Creator: data.info.Creator,
                Producer: data.info.Producer,
                CreationDate: data.info.CreationDate,
                ModDate: data.info.ModDate,
            };
        }
        return result;
    }
    catch (error) {
        throw new PdfLoaderError(`Failed to get PDF metadata`, error instanceof Error ? error : undefined);
    }
}
//# sourceMappingURL=pdf-loader.js.map