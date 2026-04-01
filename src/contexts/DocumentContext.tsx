'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentRecord } from '@/src/lib/types';
import * as DocumentProcessor from '@/src/services/DocumentProcessor';
import * as DocumentStore from '@/src/services/DocumentStore';
import { PipelineError, formatForDisplay } from '@/src/services/ErrorHandler';
import { useAuth } from '@/src/contexts/AuthContext';

interface DocumentContextValue {
  documents: DocumentRecord[];
  loading: boolean;
  processing: boolean;
  error: string | null;
  processDocument: (file: File) => Promise<{ success: boolean; document?: DocumentRecord; error?: string }>;
  deleteDocument: (id: string) => { success: boolean; error?: string };
  deleteAllDocuments: () => { success: boolean; error?: string };
  refreshDocuments: () => void;
  getDocumentById: (id: string) => DocumentRecord | null;
  documentCount: number;
}

const DocumentContext = createContext<DocumentContextValue | undefined>(undefined);

function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const refreshDocuments = useCallback(() => {
    if (!isAuthenticated || !user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      const docs = DocumentStore.list(user.userId);
      setDocuments(docs);
      setError(null);
    } catch {
      setError('Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const processDocumentHandler = useCallback(
    async (file: File): Promise<{ success: boolean; document?: DocumentRecord; error?: string }> => {
      setProcessing(true);
      setError(null);

      try {
        const result = await DocumentProcessor.processDocument(file);

        if (result.success && result.document) {
          refreshDocuments();
          return { success: true, document: result.document };
        }

        const errorMessage = result.error
          ? formatForDisplay(result.error)
          : 'Failed to process document';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } catch {
        const errorMessage = 'An unexpected error occurred while processing the document';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setProcessing(false);
      }
    },
    [refreshDocuments]
  );

  const deleteDocumentHandler = useCallback(
    (id: string): { success: boolean; error?: string } => {
      setError(null);

      const result = DocumentProcessor.deleteDocument(id);

      if (result.success) {
        refreshDocuments();
        return { success: true };
      }

      const errorMessage = result.error
        ? formatForDisplay(result.error)
        : 'Failed to delete document';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    },
    [refreshDocuments]
  );

  const deleteAllDocumentsHandler = useCallback((): { success: boolean; error?: string } => {
    setError(null);

    const result = DocumentProcessor.deleteAllUserDocuments();

    if (result.success) {
      refreshDocuments();
      return { success: true };
    }

    const errorMessage = result.error
      ? formatForDisplay(result.error)
      : 'Failed to delete documents';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }, [refreshDocuments]);

  const getDocumentById = useCallback(
    (id: string): DocumentRecord | null => {
      return DocumentProcessor.getDocumentById(id);
    },
    []
  );

  const documentCount = documents.length;

  const value = useMemo<DocumentContextValue>(
    () => ({
      documents,
      loading,
      processing,
      error,
      processDocument: processDocumentHandler,
      deleteDocument: deleteDocumentHandler,
      deleteAllDocuments: deleteAllDocumentsHandler,
      refreshDocuments,
      getDocumentById,
      documentCount,
    }),
    [
      documents,
      loading,
      processing,
      error,
      processDocumentHandler,
      deleteDocumentHandler,
      deleteAllDocumentsHandler,
      refreshDocuments,
      getDocumentById,
      documentCount,
    ]
  );

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

function useDocuments(): DocumentContextValue {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}

export { DocumentProvider, useDocuments, DocumentContext };