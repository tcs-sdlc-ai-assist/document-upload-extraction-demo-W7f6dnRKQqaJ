import { DocumentRecord } from '@/src/lib/types';
import { STORAGE_KEYS } from '@/src/lib/constants';

const DOCUMENTS_KEY = STORAGE_KEYS.DOCUMENTS;

function loadAll(userId?: string): DocumentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    const documents: DocumentRecord[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return documents.filter((doc) => doc.userId === userId);
    }
    return documents;
  } catch {
    return [];
  }
}

function getById(id: string): DocumentRecord | null {
  try {
    const documents = loadAll();
    return documents.find((doc) => doc.id === id) || null;
  } catch {
    return null;
  }
}

function save(document: DocumentRecord): { success: boolean; error?: string } {
  try {
    const documents = loadAll();
    const existingIndex = documents.findIndex((doc) => doc.id === document.id);

    if (existingIndex !== -1) {
      documents[existingIndex] = document;
    } else {
      documents.push(document);
    }

    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
    return { success: true };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return { success: false, error: 'Storage quota exceeded. Please delete some documents to free up space.' };
    }
    const message = error instanceof Error ? error.message : 'Failed to save document';
    return { success: false, error: message };
  }
}

function deleteDocument(id: string): { success: boolean; error?: string } {
  try {
    const documents = loadAll();
    const filtered = documents.filter((doc) => doc.id !== id);

    if (filtered.length === documents.length) {
      return { success: false, error: 'Document not found' };
    }

    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete document';
    return { success: false, error: message };
  }
}

function deleteAllByUser(userId: string): { success: boolean; error?: string } {
  try {
    const documents = loadAll();
    const filtered = documents.filter((doc) => doc.userId !== userId);

    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete documents';
    return { success: false, error: message };
  }
}

function generateDocumentId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export {
  loadAll,
  getById,
  save,
  deleteDocument,
  deleteAllByUser,
  generateDocumentId,
};