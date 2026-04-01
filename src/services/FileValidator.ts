import { ValidationResult } from '@/src/lib/types';
import {
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
} from '@/src/lib/constants';

function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return '';
  return fileName.substring(lastDot).toLowerCase();
}

function validateFileType(file: File): ValidationResult {
  const errors: string[] = [];

  const mimeTypeValid = SUPPORTED_MIME_TYPES.includes(file.type);
  const extension = getFileExtension(file.name);
  const extensionValid = (SUPPORTED_EXTENSIONS as readonly string[]).includes(extension);

  if (!mimeTypeValid && !extensionValid) {
    errors.push(
      `Unsupported file type. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateFileSize(file: File): ValidationResult {
  const errors: string[] = [];

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds the maximum allowed size of ${MAX_FILE_SIZE_LABEL}`);
  }

  if (file.size === 0) {
    errors.push('File is empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateFile(file: File): ValidationResult {
  const typeResult = validateFileType(file);
  const sizeResult = validateFileSize(file);

  const errors = [...typeResult.errors, ...sizeResult.errors];

  return {
    valid: errors.length === 0,
    errors,
  };
}

export { validateFileType, validateFileSize, validateFile, getFileExtension };