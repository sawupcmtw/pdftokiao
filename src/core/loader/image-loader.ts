import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import { extname } from 'path';

/**
 * Custom error class for image loader errors
 */
export class ImageLoaderError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ImageLoaderError';
  }
}

/**
 * Supported image formats
 */
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'] as const;
type SupportedFormat = typeof SUPPORTED_FORMATS[number];

/**
 * Check if file extension is a supported image format
 * @param filePath - Path to the file
 * @returns boolean
 */
function isSupportedImageFormat(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext as SupportedFormat);
}

/**
 * Validate image file by checking magic bytes
 * @param buffer - File buffer
 * @param filePath - Original file path for error messages
 * @returns boolean
 */
function validateImageBuffer(buffer: Buffer, filePath: string): void {
  // Check for common image format magic bytes
  const magicBytes = buffer.slice(0, 12);

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng = magicBytes[0] === 0x89 &&
                magicBytes[1] === 0x50 &&
                magicBytes[2] === 0x4e &&
                magicBytes[3] === 0x47;

  // JPEG: FF D8 FF
  const isJpeg = magicBytes[0] === 0xff &&
                 magicBytes[1] === 0xd8 &&
                 magicBytes[2] === 0xff;

  // WebP: 52 49 46 46 ... 57 45 42 50
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
    throw new ImageLoaderError(
      `Invalid image format: File ${filePath} does not appear to be a valid ${ext} image`
    );
  }
}

/**
 * Load image file as Buffer
 * @param filePath - Path to the image file
 * @returns Promise<Buffer> - The image file as a Buffer
 * @throws {ImageLoaderError} If file doesn't exist, is not accessible, or is not a valid image
 */
export async function loadImage(filePath: string): Promise<Buffer> {
  try {
    // Check if file exists and is accessible
    await access(filePath, constants.F_OK | constants.R_OK);
  } catch (error) {
    throw new ImageLoaderError(
      `File not found or not accessible: ${filePath}`,
      error instanceof Error ? error : undefined
    );
  }

  // Validate file extension
  if (!isSupportedImageFormat(filePath)) {
    const ext = extname(filePath).toLowerCase();
    throw new ImageLoaderError(
      `Unsupported image format: ${ext}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    );
  }

  try {
    const buffer = await readFile(filePath);

    // Validate image format by checking magic bytes
    validateImageBuffer(buffer, filePath);

    return buffer;
  } catch (error) {
    if (error instanceof ImageLoaderError) {
      throw error;
    }
    throw new ImageLoaderError(
      `Failed to load image file: ${filePath}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Load multiple images
 * @param filePaths - Array of paths to image files
 * @returns Promise<Buffer[]> - Array of image buffers
 * @throws {ImageLoaderError} If any file fails to load
 */
export async function loadImages(filePaths: string[]): Promise<Buffer[]> {
  if (!Array.isArray(filePaths)) {
    throw new ImageLoaderError('filePaths must be an array');
  }

  if (filePaths.length === 0) {
    return [];
  }

  try {
    // Load all images in parallel
    const buffers = await Promise.all(
      filePaths.map(async (filePath, index) => {
        try {
          return await loadImage(filePath);
        } catch (error) {
          // Add context about which file in the array failed
          throw new ImageLoaderError(
            `Failed to load image at index ${index}: ${filePath}`,
            error instanceof Error ? error : undefined
          );
        }
      })
    );

    return buffers;
  } catch (error) {
    if (error instanceof ImageLoaderError) {
      throw error;
    }
    throw new ImageLoaderError(
      `Failed to load one or more images`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Get image metadata (basic information)
 * @param buffer - Image buffer
 * @returns Object with basic metadata
 */
export function getImageMetadata(buffer: Buffer): {
  format: 'png' | 'jpeg' | 'webp' | 'unknown';
  size: number;
} {
  const magicBytes = buffer.slice(0, 12);

  let format: 'png' | 'jpeg' | 'webp' | 'unknown' = 'unknown';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (magicBytes[0] === 0x89 &&
      magicBytes[1] === 0x50 &&
      magicBytes[2] === 0x4e &&
      magicBytes[3] === 0x47) {
    format = 'png';
  }
  // JPEG: FF D8 FF
  else if (magicBytes[0] === 0xff &&
           magicBytes[1] === 0xd8 &&
           magicBytes[2] === 0xff) {
    format = 'jpeg';
  }
  // WebP: 52 49 46 46 ... 57 45 42 50
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
