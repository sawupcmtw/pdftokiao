import { Command } from 'commander';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { discoverTestCases, loadTestCase, formatTestCase, formatSupplementaryScope, TestLoaderError, } from '../../core/loader/test-loader.js';
import { loadPdf, loadImages, PdfLoaderError, ImageLoaderError } from '../../core/loader/index.js';
import { ParseInputSchema } from '../../core/schemas/index.js';
import { orchestrate } from '../../trigger/index.js';
const DEFAULT_TEST_DIR = './test_files';
const VALID_TYPES = [
    'single_select',
    'multi_select',
    'fill_in',
    'short_answer',
    'emi_single_select',
    'deck',
];
function parseTypeFilter(filterStr) {
    if (!filterStr)
        return undefined;
    const types = filterStr.split(',').map((t) => t.trim());
    for (const t of types) {
        if (!VALID_TYPES.includes(t)) {
            throw new Error(`Invalid question type: "${t}". Valid types: ${VALID_TYPES.join(', ')}`);
        }
    }
    return types;
}
export function createTestCommand() {
    const testCmd = new Command('test');
    testCmd
        .description('Load and run test cases from organized test folders')
        .argument('[name]', 'Test case folder name (e.g., "example")')
        .option('-l, --list', 'List all discovered test cases')
        .option('-r, --run', 'Run the parser on the test case')
        .option('-d, --dir <path>', 'Test files directory', DEFAULT_TEST_DIR)
        .option('-t, --only-type <types>', 'Only parse specific question types (comma-separated: single_select,multi_select,fill_in,short_answer,emi_single_select,deck)')
        .action(async (name, options) => {
        try {
            const testDir = resolve(options.dir);
            if (options.list) {
                await listTestCases(testDir);
                return;
            }
            if (!name) {
                console.error('Error: Test case name is required.');
                console.error('Usage: pdftokiao test <name> [options]');
                console.error('       pdftokiao test --list');
                process.exit(1);
            }
            const folderPath = join(testDir, name);
            let testCase;
            try {
                testCase = await loadTestCase(folderPath);
            }
            catch (error) {
                if (error instanceof TestLoaderError) {
                    console.error(`Error: ${error.message}`);
                }
                else {
                    console.error(`Error loading test case: ${name}`);
                }
                process.exit(1);
            }
            console.log('\n=== Test Case Loaded ===');
            console.log(`Name: ${testCase.name}`);
            console.log(`Pages: ${testCase.pages.length === 1 ? testCase.pages[0] : `${testCase.pages[0]}-${testCase.pages[1]}`}`);
            console.log(`PDF: ${testCase.pdfPath}`);
            console.log(`Hints: ${testCase.hintPaths.length} image(s)`);
            if (testCase.hintPaths.length > 0) {
                testCase.hintPaths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
            }
            console.log(`Supplementary PDFs: ${testCase.supplementaryPdfs.length} file(s)`);
            if (testCase.supplementaryPdfs.length > 0) {
                testCase.supplementaryPdfs.forEach((supp, i) => console.log(`  ${i + 1}. ${supp.filename} (${formatSupplementaryScope(supp.scope)})`));
            }
            console.log(`Instruction: ${testCase.instruction ? 'Yes' : 'No'}`);
            if (testCase.instruction) {
                console.log(`  "${testCase.instruction.substring(0, 100)}${testCase.instruction.length > 100 ? '...' : ''}"`);
            }
            if (options.run) {
                const onlyTypes = parseTypeFilter(options.onlyType);
                if (onlyTypes) {
                    console.log(`\nFiltering to types: ${onlyTypes.join(', ')}`);
                }
                await runTestCase(testCase, onlyTypes);
            }
            else {
                console.log('\nUse --run to execute the parser on this test case.');
            }
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
    return testCmd;
}
async function listTestCases(testDir) {
    console.log(`\nScanning for test cases in: ${testDir}\n`);
    try {
        const testCases = await discoverTestCases(testDir);
        if (testCases.length === 0) {
            console.log('No test cases found.');
            console.log('\nEach folder should contain CONTENT-[pages].pdf');
            console.log('Examples: CONTENT-[1].pdf, CONTENT-[1,5].pdf');
            return;
        }
        console.log(`Found ${testCases.length} test case(s):\n`);
        for (const tc of testCases) {
            console.log(`  ${formatTestCase(tc)}`);
        }
        console.log('\nUse: pdftokiao test <name> to view details');
        console.log('Use: pdftokiao test <name> --run to run parser');
    }
    catch (error) {
        if (error instanceof TestLoaderError) {
            console.error(`Error: ${error.message}`);
        }
        else {
            throw error;
        }
    }
}
async function getNextRunNumber(testCasePath) {
    const outputsDir = join(testCasePath, 'outputs');
    try {
        const entries = await readdir(outputsDir, { withFileTypes: true });
        const runNumbers = entries
            .filter((e) => e.isDirectory() && /^\d+$/.test(e.name))
            .map((e) => parseInt(e.name, 10));
        return runNumbers.length > 0 ? Math.max(...runNumbers) + 1 : 1;
    }
    catch {
        return 1;
    }
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60)
        return `${seconds.toFixed(2)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
}
function formatLogs(result, testCase, runNumber, questionCount, deckCardCount) {
    const lines = [];
    const { metrics, callLogs, startTime, endTime } = result;
    const totalMs = endTime.getTime() - startTime.getTime();
    lines.push('='.repeat(60));
    lines.push('PDF TO KIAO - Pipeline Execution Log');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push('--- Run Information ---');
    lines.push(`Test Case: ${testCase.name}`);
    lines.push(`Run Number: ${runNumber}`);
    lines.push(`Started: ${startTime.toISOString()}`);
    lines.push(`Completed: ${endTime.toISOString()}`);
    lines.push('');
    lines.push('--- Input Summary ---');
    lines.push(`PDF: ${testCase.pdfPath}`);
    const pageStr = testCase.pages.length === 1 ? `${testCase.pages[0]}` : `${testCase.pages[0]}-${testCase.pages[1]}`;
    lines.push(`Pages: ${pageStr}`);
    lines.push(`Hint Images: ${testCase.hintPaths.length}`);
    lines.push(`Supplementary PDFs: ${testCase.supplementaryPdfs.length}`);
    lines.push('');
    lines.push('--- Output Summary ---');
    lines.push(`Questions Parsed: ${questionCount}`);
    lines.push(`Deck Cards Parsed: ${deckCardCount}`);
    lines.push('');
    lines.push(`--- AI Calls (${metrics.apiCalls} total, ${metrics.cacheHits} cache hits) ---`);
    lines.push(' #  Goal                                          Tokens In/Out      Time     Cache');
    callLogs.forEach((log, i) => {
        const num = String(i + 1).padStart(2, ' ');
        const goal = log.goal.padEnd(44, ' ').slice(0, 44);
        const tokens = `${log.inputTokens.toLocaleString()} / ${log.outputTokens.toLocaleString()}`.padStart(16, ' ');
        const time = `${log.latencyMs}ms`.padStart(9, ' ');
        const cache = log.cacheHit ? '  HIT' : '';
        lines.push(`${num}  ${goal}  ${tokens}  ${time}${cache}`);
    });
    lines.push('');
    lines.push('--- Totals ---');
    lines.push(`Input Tokens:  ${metrics.totalInputTokens.toLocaleString()}`);
    lines.push(`Output Tokens: ${metrics.totalOutputTokens.toLocaleString()}`);
    lines.push(`Total Tokens:  ${(metrics.totalInputTokens + metrics.totalOutputTokens).toLocaleString()}`);
    lines.push(`Total Retries: ${metrics.totalRetries}`);
    lines.push('');
    lines.push('--- Timing ---');
    lines.push(`Total Time: ${formatDuration(totalMs)}`);
    lines.push(`AI Latency: ${formatDuration(metrics.totalLatencyMs)}`);
    lines.push(`Overhead:   ${formatDuration(totalMs - metrics.totalLatencyMs)}`);
    lines.push('');
    lines.push('='.repeat(60));
    return lines.join('\n');
}
async function runTestCase(testCase, onlyTypes) {
    console.log('\n=== Running Parser ===\n');
    console.log(`\nLoading PDF: ${testCase.pdfPath}`);
    let pdfBuffer;
    try {
        pdfBuffer = await loadPdf(testCase.pdfPath);
        console.log(`  PDF loaded successfully (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
    }
    catch (error) {
        if (error instanceof PdfLoaderError) {
            throw new Error(`Failed to load PDF: ${error.message}`);
        }
        throw error;
    }
    let hintBuffers = [];
    if (testCase.hintPaths.length > 0) {
        console.log(`\nLoading ${testCase.hintPaths.length} hint image(s)...`);
        try {
            hintBuffers = await loadImages(testCase.hintPaths);
            console.log('  All hint images loaded successfully');
        }
        catch (error) {
            if (error instanceof ImageLoaderError) {
                throw new Error(`Failed to load hint images: ${error.message}`);
            }
            throw error;
        }
    }
    console.log('\nValidating input schema...');
    ParseInputSchema.parse({
        pdf: pdfBuffer,
        pages: testCase.pages,
        hints: hintBuffers,
        instruction: testCase.instruction,
    });
    console.log('  Input validated successfully');
    console.log('\n=== Running Pipeline ===\n');
    let result;
    try {
        result = await orchestrate({
            pdfPath: testCase.pdfPath,
            pages: testCase.pages,
            hintPaths: testCase.hintPaths,
            instruction: testCase.instruction,
            supplementaryPdfs: testCase.supplementaryPdfs,
            onlyTypes,
        });
        console.log('[test] Pipeline completed');
    }
    catch (e) {
        throw new Error(`Pipeline failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    const { output } = result;
    const questionGroups = output.filter((item) => item.data.type === 'question_group');
    const decks = output.filter((item) => item.data.type === 'deck');
    const testCasePath = dirname(testCase.pdfPath);
    const runNumber = await getNextRunNumber(testCasePath);
    const outputDir = join(testCasePath, 'outputs', String(runNumber));
    console.log(`\nCreating output directory: ${outputDir}`);
    await mkdir(outputDir, { recursive: true });
    const writtenFiles = [];
    if (questionGroups.length > 0) {
        const questionGroupPath = join(outputDir, 'question-group.json');
        await writeFile(questionGroupPath, JSON.stringify(questionGroups, null, 2), 'utf-8');
        writtenFiles.push(questionGroupPath);
    }
    if (decks.length > 0) {
        const deckPath = join(outputDir, 'deck.json');
        await writeFile(deckPath, JSON.stringify(decks, null, 2), 'utf-8');
        writtenFiles.push(deckPath);
    }
    const questionCount = questionGroups.reduce((sum, qg) => {
        const data = qg.data;
        return sum + (data.questions?.length || 0);
    }, 0);
    const deckCardCount = decks.reduce((sum, d) => {
        const data = d.data;
        return sum + (data.cards?.length || 0);
    }, 0);
    const logsContent = formatLogs(result, testCase, runNumber, questionCount, deckCardCount);
    const logsPath = join(outputDir, 'logs.txt');
    await writeFile(logsPath, logsContent, 'utf-8');
    writtenFiles.push(logsPath);
    console.log('\n=== Success ===');
    console.log(`Run #${runNumber} - Output written to:`);
    for (const file of writtenFiles) {
        console.log(`  ${file}`);
    }
}
//# sourceMappingURL=test.js.map