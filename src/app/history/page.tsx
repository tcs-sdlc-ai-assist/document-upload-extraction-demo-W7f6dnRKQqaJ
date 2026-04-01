'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';
import AppLayout from '@/src/components/layout/AppLayout';
import DocumentList from '@/src/components/documents/DocumentList';

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(ROUTES.DOCUMENTS);

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
        <CircularProgress aria-label="Loading history page" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout activePath={currentPath} onNavigate={handleNavigate}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
          Document History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View and manage all your uploaded documents.
        </Typography>

        <DocumentList onNavigate={handleNavigate} />
      </Box>
    </AppLayout>
  );
}