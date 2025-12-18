import { readdir, readFile, stat } from 'fs/promises';
import { join, basename } from 'path';
export class TestLoaderError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TestLoaderError';
    }
}
const PDF_PATTERN = /^CONTENT-\[(\d+)(?:,(\d+))?\]\.pdf$/i;
const SUPP_PATTERN = /^SUPP-(all|pages-(\d+)(?:-(\d+))?|type-(single_select|multi_select|fill_in|short_answer|emi_single_select)|questions-(\d+(?:,\d+)*))\.pdf$/i;
const INSTRUCTION_FILE = 'INST.txt';
const HINT_PATTERN = /^IMAGE-.+\.(jpg|jpeg|png)$/i;
export function parsePdfFilename(filename) {
    const match = filename.match(PDF_PATTERN);
    if (!match) {
        return null;
    }
    const startPage = parseInt(match[1], 10);
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
export function parseSupplementaryFilename(filename) {
    const match = filename.match(SUPP_PATTERN);
    if (!match) {
        return null;
    }
    const scopeStr = match[1].toLowerCase();
    if (scopeStr === 'all') {
        return { type: 'all' };
    }
    if (scopeStr.startsWith('pages-')) {
        const startPage = parseInt(match[2], 10);
        const endPage = match[3] ? parseInt(match[3], 10) : startPage;
        if (startPage < 1 || endPage < startPage) {
            return null;
        }
        return { type: 'pages', startPage, endPage };
    }
    if (scopeStr.startsWith('type-')) {
        const questionType = match[4].toLowerCase();
        return { type: 'type', questionType };
    }
    if (scopeStr.startsWith('questions-')) {
        const questionNumbers = match[5].split(',').map((n) => parseInt(n, 10));
        if (questionNumbers.some((n) => n < 1 || isNaN(n))) {
            return null;
        }
        return { type: 'questions', questionNumbers };
    }
    return null;
}
async function findSupplementaryPdfs(folderPath) {
    const supplementaryPdfs = [];
    try {
        const files = await readdir(folderPath);
        for (const file of files) {
            const scope = parseSupplementaryFilename(file);
            if (scope) {
                supplementaryPdfs.push({
                    path: join(folderPath, file),
                    scope,
                    filename: file,
                });
            }
        }
    }
    catch {
    }
    const scopeOrder = { all: 0, pages: 1, type: 2, questions: 3 };
    supplementaryPdfs.sort((a, b) => scopeOrder[a.scope.type] - scopeOrder[b.scope.type]);
    return supplementaryPdfs;
}
async function findContentPdf(folderPath) {
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
    }
    catch {
    }
    return null;
}
export async function discoverTestCases(baseDir) {
    const testCases = [];
    let entries;
    try {
        entries = await readdir(baseDir);
    }
    catch {
        throw new TestLoaderError(`Cannot read directory: ${baseDir}`);
    }
    for (const entry of entries) {
        const folderPath = join(baseDir, entry);
        try {
            const stats = await stat(folderPath);
            if (!stats.isDirectory()) {
                continue;
            }
        }
        catch {
            continue;
        }
        const pdfInfo = await findContentPdf(folderPath);
        if (!pdfInfo) {
            continue;
        }
        try {
            const testCase = await loadTestCase(folderPath);
            testCases.push(testCase);
        }
        catch {
            continue;
        }
    }
    testCases.sort((a, b) => a.name.localeCompare(b.name));
    return testCases;
}
export async function loadTestCase(folderPath) {
    const folderName = basename(folderPath);
    const pdfInfo = await findContentPdf(folderPath);
    if (!pdfInfo) {
        throw new TestLoaderError(`Missing CONTENT-[pages].pdf in ${folderPath}. Expected format: CONTENT-[1].pdf or CONTENT-[1,3].pdf`);
    }
    let instruction;
    const instructionPath = join(folderPath, INSTRUCTION_FILE);
    try {
        await stat(instructionPath);
        instruction = (await readFile(instructionPath, 'utf-8')).trim();
    }
    catch {
    }
    const hintPaths = [];
    try {
        const files = await readdir(folderPath);
        for (const file of files) {
            if (HINT_PATTERN.test(file)) {
                hintPaths.push(join(folderPath, file));
            }
        }
        hintPaths.sort();
    }
    catch {
    }
    const supplementaryPdfs = await findSupplementaryPdfs(folderPath);
    const result = {
        name: folderName,
        pages: pdfInfo.pages,
        pdfPath: pdfInfo.pdfPath,
        hintPaths,
        folderPath,
        supplementaryPdfs,
    };
    if (instruction) {
        result.instruction = instruction;
    }
    return result;
}
export function formatTestCase(testCase) {
    const pageStr = testCase.pages.length === 1
        ? `page ${testCase.pages[0]}`
        : `pages ${testCase.pages[0]}-${testCase.pages[1]}`;
    const hintStr = testCase.hintPaths.length > 0 ? `${testCase.hintPaths.length} hint(s)` : 'no hints';
    const suppStr = testCase.supplementaryPdfs.length > 0
        ? `${testCase.supplementaryPdfs.length} supp(s)`
        : 'no supplementary';
    const instStr = testCase.instruction ? 'has instruction' : 'no instruction';
    return `${testCase.name} [${pageStr}] - ${hintStr}, ${suppStr}, ${instStr}`;
}
export function formatSupplementaryScope(scope) {
    switch (scope.type) {
        case 'all':
            return 'all questions';
        case 'pages':
            return scope.startPage === scope.endPage
                ? `page ${scope.startPage}`
                : `pages ${scope.startPage}-${scope.endPage}`;
        case 'type':
            return `${scope.questionType.replace('_', ' ')} type`;
        case 'questions':
            return `questions ${scope.questionNumbers.join(', ')}`;
    }
}
//# sourceMappingURL=test-loader.js.map