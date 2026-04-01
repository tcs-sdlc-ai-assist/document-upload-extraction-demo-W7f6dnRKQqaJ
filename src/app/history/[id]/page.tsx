'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';
import AppLayout from '@/src/components/layout/AppLayout';
import DocumentDetail from '@/src/components/documents/DocumentDetail';

interface DocumentDetailPageProps {
  params: { id: string };
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(`${ROUTES.DOCUMENTS}/${params.id}`);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setCurrentPath(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress aria-label="Loading document detail" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout activePath={currentPath} onNavigate={handleNavigate}>
      <DocumentDetail documentId={params.id} onNavigate={handleNavigate} />
    </AppLayout>
  );
}