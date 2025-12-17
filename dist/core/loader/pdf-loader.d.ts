export declare class PdfLoaderError extends Error {
    readonly cause?: Error | undefined;
    constructor(message: string, cause?: Error | undefined);
}
export declare function loadPdf(filePath: string): Promise<Buffer>;
export declare function extractPages(pdfBuffer: Buffer, pages: [number] | [number, number]): Promise<Buffer[]>;
export declare function getPdfMetadata(pdfBuffer: Buffer): Promise<{
    numPages: number;
    info?: {
        Title?: string;
        Author?: string;
        Subject?: string;
        Creator?: string;
        Producer?: string;
        CreationDate?: Date;
        ModDate?: Date;
    };
}>;
//# sourceMappingURL=pdf-loader.d.ts.map