import { DocumentRecord } from '@/src/lib/types';
import * as StorageManager from '@/src/services/StorageManager';
import * as SessionManager from '@/src/services/SessionManager';

function list(userId?: string): DocumentRecord[] {
  const effectiveUserId = userId || SessionManager.getUserId() || undefined;
  return StorageManager.loadAll(effectiveUserId);
}

function get(id: string): DocumentRecord | null {
  return StorageManager.getById(id);
}

function save(document: DocumentRecord): { success: boolean; error?: string } {
  return StorageManager.save(document);
}

function remove(id: string): { success: boolean; error?: string } {
  return StorageManager.deleteDocument(id);
}

function clear(userId?: string): { success: boolean; error?: string } {
  const effectiveUserId = userId || SessionManager.getUserId();

  if (!effectiveUserId) {
    return { success: false, error: 'User not authenticated' };
  }

  return StorageManager.deleteAllByUser(effectiveUserId);
}

function getByUser(userId: string): DocumentRecord[] {
  return StorageManager.loadAll(userId);
}

function getCompleted(userId?: string): DocumentRecord[] {
  const documents = list(userId);
  return documents.filter((doc) => doc.extractionStatus === 'completed');
}

function getFailed(userId?: string): DocumentRecord[] {
  const documents = list(userId);
  return documents.filter((doc) => doc.extractionStatus === 'failed');
}

function count(userId?: string): number {
  return list(userId).length;
}

export {
  list,
  get,
  save,
  remove,
  clear,
  getByUser,
  getCompleted,
  getFailed,
  count,
};