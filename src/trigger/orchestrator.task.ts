import { task } from '@trigger.dev/sdk/v3';
import { z } from 'zod';
import { loadImages } from '../core/loader/index.js';
import { extractPages } from '../core/loader/index.js';
import type { QuestionGroup, Question } from '../core/schemas/index.js';
import { hintTaggerTask } from './hint-tagger.task.js';
import { pageAnalyzerTask } from './page-analyzer.task.js';
import {
  singleSelectParserTask,
  multiSelectParserTask,
  fillInParserTask,
  shortAnswerParserTask,
} from './parsers/index.js';

/**
 * Input schema for orchestrator task
 */
const OrchestratorInputSchema = z.object({
  /** Path to PDF file */
  pdfPath: z.string(),

  /** Page range to parse - either a single page [n] or a range [start, end] */
  pages: z.tuple([z.number().int().positive()]).or(
    z.tuple([z.number().int().positive(), z.number().int().positive()])
  ),

  /** Array of paths to hint images */
  hintPaths: z.array(z.string()),

  /** Optional instruction string for parsing guidance */
  instruction: z.string().optional(),

  /** Material ID number */
  materialId: z.number().int().positive(),

  /** Import key string (UUID format recommended) */
  importKey: z.string().min(1),
});

type OrchestratorInput = z.infer<typeof OrchestratorInputSchema>;

/**
 * Main pipeline coordinator
 *
 * This task orchestrates the entire PDF parsing pipeline:
 * 1. Load PDF and hint images using loaders
 * 2. Trigger hint tagger to analyze hints
 * 3. Trigger page analyzer to map pages to questions
 * 4. Trigger appropriate parsers in parallel for each question
 * 5. Group results by type + crossId
 * 6. Merge outputs into final QuestionGroup JSON
 */
export const orchestratorTask = task({
  id: 'orchestrator',
  run: async (payload: OrchestratorInput): Promise<QuestionGroup> => {
    try {
      console.log('[orchestrator] Starting PDF parsing pipeline...');
      console.log(`[orchestrator] PDF: ${payload.pdfPath}`);
      console.log(`[orchestrator] Pages: ${payload.pages.join('-')}`);
      console.log(`[orchestrator] Hints: ${payload.hintPaths.length} files`);

      // Step 1: Load files using loaders
      console.log('[orchestrator] Step 1: Loading files...');

      const hintBuffers = await loadImages(payload.hintPaths);
      console.log(`[orchestrator] Loaded ${hintBuffers.length} hint images`);

      // Note: extractPages is not yet implemented in the loader
      // For now, we'll throw an error with instructions
      console.log('[orchestrator] Step 2: Extracting PDF pages...');

      // This will be implemented when PDF-to-image conversion is added
      // const pdfBuffer = await loadPdf(payload.pdfPath);
      // const pageBuffers = await extractPages(pdfBuffer, payload.pages);

      throw new Error(
        'PDF page extraction is not yet implemented. ' +
        'The extractPages function in pdf-loader.ts needs to be completed with ' +
        'a PDF-to-image conversion library like pdf-to-png-converter.'
      );

      // The following code shows the intended flow once extractPages is implemented:
      /*
      console.log(`[orchestrator] Extracted ${pageBuffers.length} pages`);

      // Step 2: Trigger hint tagger
      console.log('[orchestrator] Step 3: Analyzing hints...');
      const hintTagResult = await hintTaggerTask.triggerAndWait({
        hints: hintBuffers,
      });
      const hintTags = hintTagResult.output.tags;
      console.log(`[orchestrator] Tagged ${hintTags.length} hints`);

      // Step 3: Trigger page analyzer
      console.log('[orchestrator] Step 4: Analyzing pages...');
      const startPage = payload.pages[0];
      const pageAnalyzerResult = await pageAnalyzerTask.triggerAndWait({
        pages: pageBuffers,
        hintTags,
        startPage,
      });
      const pageMaps = pageAnalyzerResult.output.pageMaps;
      console.log(`[orchestrator] Analyzed ${pageMaps.length} pages`);

      // Step 4: Group questions by crossId and type
      console.log('[orchestrator] Step 5: Grouping questions...');

      // Create a map of crossId -> { type, pages, description }
      const questionMap = new Map<string, {
        type: string;
        pages: Set<number>;
        description: string;
      }>();

      for (const pageMap of pageMaps) {
        for (const item of pageMap.included) {
          const crossId = item.crossId || `page-${pageMap.page}-${item.type}`;

          if (!questionMap.has(crossId)) {
            questionMap.set(crossId, {
              type: item.type,
              pages: new Set([pageMap.page]),
              description: item.description || '',
            });
          } else {
            questionMap.get(crossId)!.pages.add(pageMap.page);
          }
        }
      }

      console.log(`[orchestrator] Found ${questionMap.size} questions`);

      // Step 5: Parse each question in parallel
      console.log('[orchestrator] Step 6: Parsing questions...');

      const parsePromises: Promise<Question>[] = [];
      let position = 1;

      for (const [crossId, questionInfo] of questionMap.entries()) {
        // Get the page buffers for this question
        const questionPages = Array.from(questionInfo.pages)
          .sort((a, b) => a - b)
          .map(pageNum => pageBuffers[pageNum - startPage]);

        const parserInput = {
          pages: questionPages,
          description: questionInfo.description,
          crossId,
          position,
          instruction: payload.instruction,
        };

        // Trigger the appropriate parser based on type
        let parsePromise: Promise<any>;

        switch (questionInfo.type) {
          case 'single_select':
            parsePromise = singleSelectParserTask.triggerAndWait(parserInput);
            break;
          case 'multi_select':
            parsePromise = multiSelectParserTask.triggerAndWait(parserInput);
            break;
          case 'fill_in':
            parsePromise = fillInParserTask.triggerAndWait(parserInput);
            break;
          case 'short_answer':
            parsePromise = shortAnswerParserTask.triggerAndWait(parserInput);
            break;
          default:
            console.warn(`[orchestrator] Unknown question type: ${questionInfo.type}, skipping`);
            continue;
        }

        parsePromises.push(parsePromise.then(result => result.output));
        position++;
      }

      // Wait for all parsers to complete
      const questions = await Promise.all(parsePromises);
      console.log(`[orchestrator] Parsed ${questions.length} questions`);

      // Step 6: Build final QuestionGroup
      console.log('[orchestrator] Step 7: Building final output...');

      const questionGroup: QuestionGroup = {
        data: {
          type: 'question_group',
          attributes: {
            material_id: payload.materialId,
            import_key: payload.importKey,
          },
          questions,
        },
      };

      console.log('[orchestrator] Pipeline completed successfully');

      return questionGroup;
      */
    } catch (error) {
      console.error('[orchestrator] Pipeline failed:', error);
      throw new Error(
        `Orchestrator pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
