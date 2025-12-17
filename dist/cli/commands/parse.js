import { Command } from 'commander';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { loadPdf, loadImages, PdfLoaderError, ImageLoaderError } from '../../core/loader/index.js';
import { ParseInputSchema } from '../../core/schemas/index.js';
import { orchestrate } from '../../trigger/index.js';
function parsePageRange(rangeStr) {
    const parts = rangeStr.split(',').map((s) => parseInt(s.trim(), 10));
    if (parts.length === 1) {
        const page = parts[0];
        if (page === undefined || isNaN(page) || page < 1) {
            throw new Error('Invalid page number. Must be a positive integer.');
        }
        return [page];
    }
    else if (parts.length === 2) {
        const startPage = parts[0];
        const endPage = parts[1];
        if (startPage === undefined ||
            endPage === undefined ||
            isNaN(startPage) ||
            isNaN(endPage) ||
            startPage < 1 ||
            endPage < 1) {
            throw new Error('Invalid page range. Both pages must be positive integers.');
        }
        if (startPage > endPage) {
            throw new Error('Invalid page range. Start page must be <= end page.');
        }
        return [startPage, endPage];
    }
    else {
        throw new Error('Invalid page range format. Use "1" for single page or "1,3" for range.');
    }
}
export function createParseCommand() {
    const parseCmd = new Command('parse');
    parseCmd
        .description('Parse PDF material and convert to Kiao import format')
        .requiredOption('-p, --pdf <path>', 'PDF file path')
        .requiredOption('--pages <range>', 'Page range (e.g., "1" or "1,3")')
        .option('-h, --hints <paths...>', 'Hint image file paths')
        .option('-i, --instruction <text>', 'Additional parsing instructions')
        .option('-o, --output <dir>', 'Output directory for JSON files', './output')
        .action(async (options) => {
        try {
            console.log('Starting PDF parsing...\n');
            console.log('Validating inputs...');
            const pdfPath = resolve(options.pdf);
            const outputDir = resolve(options.output);
            const pages = parsePageRange(options.pages);
            console.log(`  Pages: ${pages.join(' to ')}`);
            console.log(`\nLoading PDF: ${pdfPath}`);
            let pdfBuffer;
            try {
                pdfBuffer = await loadPdf(pdfPath);
                console.log(`  PDF loaded successfully (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
            }
            catch (error) {
                if (error instanceof PdfLoaderError) {
                    throw new Error(`Failed to load PDF: ${error.message}`);
                }
                throw error;
            }
            let hintBuffers = [];
            if (options.hints && options.hints.length > 0) {
                console.log(`\nLoading ${options.hints.length} hint image(s)...`);
                try {
                    const hintPaths = options.hints.map((p) => resolve(p));
                    hintBuffers = await loadImages(hintPaths);
                    console.log(`  All hint images loaded successfully`);
                }
                catch (error) {
                    if (error instanceof ImageLoaderError) {
                        throw new Error(`Failed to load hint images: ${error.message}`);
                    }
                    throw error;
                }
            }
            else {
                console.log('\nNo hint images provided');
            }
            console.log('\nValidating input schema...');
            ParseInputSchema.parse({
                pdf: pdfBuffer,
                pages,
                hints: hintBuffers,
                instruction: options.instruction,
            });
            console.log('  Input validated successfully');
            console.log('\n=== Running Pipeline ===\n');
            const hintPaths = options.hints ? options.hints.map((p) => resolve(p)) : [];
            const output = await orchestrate({
                pdfPath,
                pages,
                hintPaths,
                instruction: options.instruction,
            });
            console.log(`\nCreating output directory: ${outputDir}`);
            await mkdir(outputDir, { recursive: true });
            const outputFileName = `parse_output_${Date.now()}.json`;
            const outputPath = join(outputDir, outputFileName);
            console.log(`Writing output to: ${outputPath}`);
            await writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
            console.log('\n=== Success ===');
            console.log(`Output written to: ${outputPath}`);
        }
        catch (error) {
            console.error('\n=== Error ===');
            if (error instanceof Error) {
                console.error(error.message);
            }
            else {
                console.error('An unexpected error occurred:', error);
            }
            process.exit(1);
        }
    });
    return parseCmd;
}
//# sourceMappingURL=parse.js.map