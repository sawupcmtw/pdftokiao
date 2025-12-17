import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import { extname } from 'path';
export class ImageLoaderError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'ImageLoaderError';
    }
}
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];
function isSupportedImageFormat(filePath) {
    const ext = extname(filePath).toLowerCase();
    return SUPPORTED_FORMATS.includes(ext);
}
function validateImageBuffer(buffer, filePath) {
    const magicBytes = buffer.slice(0, 12);
    const isPng = magicBytes[0] === 0x89 &&
        magicBytes[1] === 0x50 &&
        magicBytes[2] === 0x4e &&
        magicBytes[3] === 0x47;
    const isJpeg = magicBytes[0] === 0xff && magicBytes[1] === 0xd8 && magicBytes[2] === 0xff;
    const isWebp = magicBytes[0] === 0x52 &&
        magicBytes[1] === 0x49 &&
        magicBytes[2] === 0x46 &&
        magicBytes[3] === 0x46 &&
        magicBytes[8] === 0x57 &&
        magicBytes[9] === 0x45 &&
        magicBytes[10] === 0x42 &&
        magicBytes[11] === 0x50;
    if (!isPng && !isJpeg && !isWebp) {
        const ext = extname(filePath).toLowerCase();
        throw new ImageLoaderError(`Invalid image format: File ${filePath} does not appear to be a valid ${ext} image`);
    }
}
export async function loadImage(filePath) {
    try {
        await access(filePath, constants.F_OK | constants.R_OK);
    }
    catch (error) {
        throw new ImageLoaderError(`File not found or not accessible: ${filePath}`, error instanceof Error ? error : undefined);
    }
    if (!isSupportedImageFormat(filePath)) {
        const ext = extname(filePath).toLowerCase();
        throw new ImageLoaderError(`Unsupported image format: ${ext}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
    }
    try {
        const buffer = await readFile(filePath);
        validateImageBuffer(buffer, filePath);
        return buffer;
    }
    catch (error) {
        if (error instanceof ImageLoaderError) {
            throw error;
        }
        throw new ImageLoaderError(`Failed to load image file: ${filePath}`, error instanceof Error ? error : undefined);
    }
}
export async function loadImages(filePaths) {
    if (!Array.isArray(filePaths)) {
        throw new ImageLoaderError('filePaths must be an array');
    }
    if (filePaths.length === 0) {
        return [];
    }
    try {
        const buffers = await Promise.all(filePaths.map(async (filePath, index) => {
            try {
                return await loadImage(filePath);
            }
            catch (error) {
                throw new ImageLoaderError(`Failed to load image at index ${index}: ${filePath}`, error instanceof Error ? error : undefined);
            }
        }));
        return buffers;
    }
    catch (error) {
        if (error instanceof ImageLoaderError) {
            throw error;
        }
        throw new ImageLoaderError(`Failed to load one or more images`, error instanceof Error ? error : undefined);
    }
}
export function getImageMetadata(buffer) {
    const magicBytes = buffer.slice(0, 12);
    let format = 'unknown';
    if (magicBytes[0] === 0x89 &&
        magicBytes[1] === 0x50 &&
        magicBytes[2] === 0x4e &&
        magicBytes[3] === 0x47) {
        format = 'png';
    }
    else if (magicBytes[0] === 0xff && magicBytes[1] === 0xd8 && magicBytes[2] === 0xff) {
        format = 'jpeg';
    }
    else if (magicBytes[0] === 0x52 &&
        magicBytes[1] === 0x49 &&
        magicBytes[2] === 0x46 &&
        magicBytes[3] === 0x46 &&
        magicBytes[8] === 0x57 &&
        magicBytes[9] === 0x45 &&
        magicBytes[10] === 0x42 &&
        magicBytes[11] === 0x50) {
        format = 'webp';
    }
    return {
        format,
        size: buffer.length,
    };
}
//# sourceMappingURL=image-loader.js.map