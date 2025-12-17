export declare class ImageLoaderError extends Error {
    readonly cause?: Error | undefined;
    constructor(message: string, cause?: Error | undefined);
}
export declare function loadImage(filePath: string): Promise<Buffer>;
export declare function loadImages(filePaths: string[]): Promise<Buffer[]>;
export declare function getImageMetadata(buffer: Buffer): {
    format: 'png' | 'jpeg' | 'webp' | 'unknown';
    size: number;
};
//# sourceMappingURL=image-loader.d.ts.map