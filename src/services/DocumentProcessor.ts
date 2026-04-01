import { DocumentRecord } from '@/src/lib/types';
import { validateFile } from '@/src/services/FileValidator';
import { extractText } from '@/src/services/TextExtractor';
import { clean } from '@/src/services/TextCleaner';
import * as StorageManager from '@/src/services/StorageManager';
import * as SessionManager from '@/src/services/SessionManager';
import * as ErrorHandler from '@/src/services/ErrorHandler';
import { PipelineError } from '@/src/services/ErrorHandler';
import { getFileExtension } from '@/src/services/FileValidator';

export interface ProcessResult {
  success: boolean;
  document?: DocumentRecord;
  error?: PipelineError;
}

async function processDocument(file: File): Promise<ProcessResult> {
  const userId = SessionManager.getUserId();

  if (!userId) {
    const error = ErrorHandler.createError('AUTH_REQUIRED');
    ErrorHandler.handle(error);
    return { success: false, error };
  }

  // Step 1: Validate file
  const validationResult = validateFile(file);
  if (!validationResult.valid) {
    const error = ErrorHandler.fromValidationResult(validationResult);
    if (error) {
      return { success: false, error };
    }
  }

  // Step 2: Create initial document record
  const documentId = StorageManager.generateDocumentId();
  const extension = getFileExtension(file.name);

  const document: DocumentRecord = {
    id: documentId,
    userId,
    fileName: file.name,
    fileType: extension.replace('.', ''),
    fileSize: file.size,
    uploadTimestamp: new Date().toISOString(),
    extractedText: '',
    extractionStatus: 'pending',
  };

  // Save initial record as pending
  const initialSave = StorageManager.save(document);
  if (!initialSave.success) {
    const error = ErrorHandler.fromStorageError(initialSave.error);
    return { success: false, error };
  }

  // Step 3: Extract text
  document.extractionStatus = 'processing';
  StorageManager.save(document);

  try {
    const extractionResult = await extractText(file);

    if (!extractionResult.success) {
      const error = ErrorHandler.fromExtractionResult(extractionResult);
      document.extractionStatus = 'failed';
      document.errorMessage = extractionResult.errorMessage;
      StorageManager.save(document);
      return { success: false, document, error: error! };
    }

    // Step 4: Clean text
    const cleanedText = clean(extractionResult.text);

    // Step 5: Update document with extracted text
    document.extractedText = cleanedText;
    document.extractionStatus = 'completed';

    const finalSave = StorageManager.save(document);
    if (!finalSave.success) {
      const error = ErrorHandler.fromStorageError(finalSave.error);
      return { success: false, error };
    }

    return { success: true, document };
  } catch (err) {
    const error = ErrorHandler.fromUnknownError(err);
    document.extractionStatus = 'failed';
    document.errorMessage = error.message;
    StorageManager.save(document);
    return { success: false, document, error };
  }
}

function getAllDocuments(userId?: string): DocumentRecord[] {
  const effectiveUserId = userId || SessionManager.getUserId() || undefined;
  return StorageManager.loadAll(effectiveUserId);
}

function deleteDocument(id: string): { success: boolean; error?: PipelineError } {
  const result = StorageManager.deleteDocument(id);

  if (!result.success) {
    const error = ErrorHandler.fromStorageError(result.error);
    return { success: false, error };
  }

  return { success: true };
}

function getDocumentById(id: string): DocumentRecord | null {
  return StorageManager.getById(id);
}

function deleteAllUserDocuments(userId?: string): { success: boolean; error?: PipelineError } {
  const effectiveUserId = userId || SessionManager.getUserId();

  if (!effectiveUserId) {
    const error = ErrorHandler.createError('AUTH_REQUIRED');
    ErrorHandler.handle(error);
    return { success: false, error };
  }

  const result = StorageManager.deleteAllByUser(effectiveUserId);

  if (!result.success) {
    const error = ErrorHandler.fromStorageError(result.error);
    return { success: false, error };
  }

  return { success: true };
}

export {
  processDocument,
  getAllDocuments,
  deleteDocument,
  getDocumentById,
  deleteAllUserDocuments,
};