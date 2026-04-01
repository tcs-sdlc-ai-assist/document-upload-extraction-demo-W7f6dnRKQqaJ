import { ValidationResult, ExtractionResult } from '@/src/lib/types';

export type ErrorCode =
  | 'UNSUPPORTED_TYPE'
  | 'FILE_TOO_LARGE'
  | 'FILE_EMPTY'
  | 'VALIDATION_FAILED'
  | 'EXTRACTION_FAILED'
  | 'STORAGE_FAILED'
  | 'STORAGE_QUOTA_EXCEEDED'
  | 'AUTH_REQUIRED'
  | 'AUTH_FAILED'
  | 'UNKNOWN_ERROR';

export type ErrorCategory = 'validation' | 'extraction' | 'storage' | 'auth' | 'unknown';

export interface PipelineError {
  code: ErrorCode;
  category: ErrorCategory;
  message: string;
  originalError?: unknown;
}

const USER_FRIENDLY_MESSAGES: Record<ErrorCode, string> = {
  UNSUPPORTED_TYPE: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed size of 5MB.',
  FILE_EMPTY: 'The uploaded file is empty. Please select a valid file.',
  VALIDATION_FAILED: 'File validation failed. Please check the file and try again.',
  EXTRACTION_FAILED: 'Failed to extract text from the document. Please try again or use a different file.',
  STORAGE_FAILED: 'Failed to save the document. Please try again.',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please delete some documents to free up space.',
  AUTH_REQUIRED: 'You must be logged in to perform this action.',
  AUTH_FAILED: 'Authentication failed. Please log in again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

function categorizeError(code: ErrorCode): ErrorCategory {
  switch (code) {
    case 'UNSUPPORTED_TYPE':
    case 'FILE_TOO_LARGE':
    case 'FILE_EMPTY':
    case 'VALIDATION_FAILED':
      return 'validation';
    case 'EXTRACTION_FAILED':
      return 'extraction';
    case 'STORAGE_FAILED':
    case 'STORAGE_QUOTA_EXCEEDED':
      return 'storage';
    case 'AUTH_REQUIRED':
    case 'AUTH_FAILED':
      return 'auth';
    default:
      return 'unknown';
  }
}

function createError(code: ErrorCode, originalError?: unknown, customMessage?: string): PipelineError {
  return {
    code,
    category: categorizeError(code),
    message: customMessage || USER_FRIENDLY_MESSAGES[code],
    originalError,
  };
}

function handle(error: PipelineError): void {
  console.error(`[${error.category.toUpperCase()}] ${error.code}: ${error.message}`);
  if (error.originalError) {
    console.error('Original error:', error.originalError);
  }
}

function fromValidationResult(result: ValidationResult): PipelineError | null {
  if (result.valid) return null;

  const errors = result.errors;

  let code: ErrorCode = 'VALIDATION_FAILED';
  if (errors.some((e) => e.toLowerCase().includes('unsupported file type'))) {
    code = 'UNSUPPORTED_TYPE';
  } else if (errors.some((e) => e.toLowerCase().includes('exceeds'))) {
    code = 'FILE_TOO_LARGE';
  } else if (errors.some((e) => e.toLowerCase().includes('empty'))) {
    code = 'FILE_EMPTY';
  }

  const message = errors.join(' ');
  const pipelineError = createError(code, undefined, message);
  handle(pipelineError);
  return pipelineError;
}

function fromExtractionResult(result: ExtractionResult): PipelineError | null {
  if (result.success) return null;

  const pipelineError = createError(
    'EXTRACTION_FAILED',
    undefined,
    result.errorMessage || USER_FRIENDLY_MESSAGES.EXTRACTION_FAILED
  );
  handle(pipelineError);
  return pipelineError;
}

function fromStorageError(error?: string): PipelineError {
  let code: ErrorCode = 'STORAGE_FAILED';
  if (error && error.toLowerCase().includes('quota')) {
    code = 'STORAGE_QUOTA_EXCEEDED';
  }

  const pipelineError = createError(code, undefined, error || USER_FRIENDLY_MESSAGES[code]);
  handle(pipelineError);
  return pipelineError;
}

function fromUnknownError(error: unknown): PipelineError {
  const message = error instanceof Error ? error.message : USER_FRIENDLY_MESSAGES.UNKNOWN_ERROR;
  const pipelineError = createError('UNKNOWN_ERROR', error, message);
  handle(pipelineError);
  return pipelineError;
}

function formatForDisplay(error: PipelineError): string {
  return error.message;
}

export {
  createError,
  handle,
  fromValidationResult,
  fromExtractionResult,
  fromStorageError,
  fromUnknownError,
  formatForDisplay,
  categorizeError,
};