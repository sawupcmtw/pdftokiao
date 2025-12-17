import type { SupplementaryPdf, SupplementaryScope } from '../schemas/index.js';
export interface TestCase {
    name: string;
    pages: [number] | [number, number];
    pdfPath: string;
    instruction?: string;
    hintPaths: string[];
    folderPath: string;
    supplementaryPdfs: SupplementaryPdf[];
}
export declare class TestLoaderError extends Error {
    constructor(message: string);
}
export declare function parsePdfFilename(filename: string): {
    pages: [number] | [number, number];
} | null;
export declare function parseSupplementaryFilename(filename: string): SupplementaryScope | null;
export declare function discoverTestCases(baseDir: string): Promise<TestCase[]>;
export declare function loadTestCase(folderPath: string): Promise<TestCase>;
export declare function formatTestCase(testCase: TestCase): string;
export declare function formatSupplementaryScope(scope: SupplementaryScope): string;
//# sourceMappingURL=test-loader.d.ts.map