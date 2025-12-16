import { Command } from 'commander';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { loadPdf, loadImages, PdfLoaderError, ImageLoaderError } from '../../core/loader/index.js';
import { ParseInputSchema } from '../../core/schemas/index.js';

/**
 * Parse page range string (e.g., "1" or "1,3") into tuple
 */
function parsePageRange(rangeStr: string): [number] | [number, number] {
  const parts = rangeStr.split(',').map(s => parseInt(s.trim(), 10));

  if (parts.length === 1) {
    const page = parts[0];
    if (page === undefined || isNaN(page) || page < 1) {
      throw new Error('Invalid page number. Must be a positive integer.');
    }
    return [page];
  } else if (parts.length === 2) {
    const startPage = parts[0];
    const endPage = parts[1];
    if (startPage === undefined || endPage === undefined || isNaN(startPage) || isNaN(endPage) || startPage < 1 || endPage < 1) {
      throw new Error('Invalid page range. Both pages must be positive integers.');
    }
    if (startPage > endPage) {
      throw new Error('Invalid page range. Start page must be <= end page.');
    }
    return [startPage, endPage];
  } else {
    throw new Error('Invalid page range format. Use "1" for single page or "1,3" for range.');
  }
}

/**
 * Parse command - Main entry point for parsing PDF materials
 */
export function createParseCommand(): Command {
  const parseCmd = new Command('parse');

  parseCmd
    .description('Parse PDF material and convert to Kiao import format')
    .requiredOption('-p, --pdf <path>', 'PDF file path')
    .requiredOption('--pages <range>', 'Page range (e.g., "1" or "1,3")')
    .requiredOption('--material-id <id>', 'Material ID')
    .requiredOption('--import-key <key>', 'Import key')
    .option('-h, --hints <paths...>', 'Hint image file paths')
    .option('-i, --instruction <text>', 'Additional parsing instructions')
    .option('-o, --output <dir>', 'Output directory for JSON files', './output')
    .action(async (options) => {
      try {
        console.log('Starting PDF parsing...\n');

        // 1. Validate and parse inputs
        console.log('Validating inputs...');

        const pdfPath = resolve(options.pdf);
        const outputDir = resolve(options.output);
        const materialId = parseInt(options.materialId, 10);
        const importKey = options.importKey;

        if (isNaN(materialId) || materialId < 1) {
          throw new Error('Material ID must be a positive integer');
        }

        // Parse page range
        const pages = parsePageRange(options.pages);
        console.log(`  Pages: ${pages.join(' to ')}`);

        // 2. Load PDF file
        console.log(`\nLoading PDF: ${pdfPath}`);
        let pdfBuffer: Buffer;
        try {
          pdfBuffer = await loadPdf(pdfPath);
          console.log(`  PDF loaded successfully (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
        } catch (error) {
          if (error instanceof PdfLoaderError) {
            throw new Error(`Failed to load PDF: ${error.message}`);
          }
          throw error;
        }

        // 3. Load hint images (if provided)
        let hintBuffers: Buffer[] = [];
        if (options.hints && options.hints.length > 0) {
          console.log(`\nLoading ${options.hints.length} hint image(s)...`);
          try {
            const hintPaths = options.hints.map((p: string) => resolve(p));
            hintBuffers = await loadImages(hintPaths);
            console.log(`  All hint images loaded successfully`);
          } catch (error) {
            if (error instanceof ImageLoaderError) {
              throw new Error(`Failed to load hint images: ${error.message}`);
            }
            throw error;
          }
        } else {
          console.log('\nNo hint images provided');
        }

        // 4. Validate input against schema
        console.log('\nValidating input schema...');
        ParseInputSchema.parse({
          pdf: pdfBuffer,
          pages,
          hints: hintBuffers,
          instruction: options.instruction,
          materialId,
          importKey,
        });
        console.log('  Input validated successfully');

        // 5. Process the PDF
        console.log('\n=== Processing Pipeline ===');
        console.log('Note: Task orchestration not yet implemented.');
        console.log('This CLI will trigger the Trigger.dev orchestrator task when implemented.\n');

        // TODO: When Trigger.dev tasks are implemented, call the orchestrator:
        // const result = await orchestratorTask.triggerAndWait(input);

        // For now, create a placeholder output structure
        console.log('Creating placeholder output structure...');
        const output = {
          data: {
            type: 'question_group',
            attributes: {
              material_id: materialId,
              import_key: importKey,
            },
            questions: [],
          },
          meta: {
            pages: pages,
            instruction: options.instruction || null,
            hintsProvided: hintBuffers.length,
            status: 'pending_implementation',
            message: 'Orchestrator task integration pending',
          },
        };

        // 6. Create output directory
        console.log(`\nCreating output directory: ${outputDir}`);
        await mkdir(outputDir, { recursive: true });

        // 7. Write output JSON file
        const outputFileName = `parse_output_${importKey}_${Date.now()}.json`;
        const outputPath = join(outputDir, outputFileName);

        console.log(`Writing output to: ${outputPath}`);
        await writeFile(
          outputPath,
          JSON.stringify(output, null, 2),
          'utf-8'
        );

        // 8. Success message
        console.log('\n=== Success ===');
        console.log(`Output written to: ${outputPath}`);
        console.log('\nNext steps:');
        console.log('  1. Implement Trigger.dev orchestrator task');
        console.log('  2. Integrate task calling in this CLI command');
        console.log('  3. Test with real PDF materials\n');

      } catch (error) {
        console.error('\n=== Error ===');
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
        process.exit(1);
      }
    });

  return parseCmd;
}
