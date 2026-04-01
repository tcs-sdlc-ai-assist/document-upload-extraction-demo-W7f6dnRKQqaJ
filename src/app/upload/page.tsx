'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDocuments } from '@/src/contexts/DocumentContext';
import { ROUTES } from '@/src/lib/constants';
import AppLayout from '@/src/components/layout/AppLayout';
import FileDropzone from '@/src/components/upload/FileDropzone';

export default function UploadPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { processing } = useDocuments();
  const [currentPath, setCurrentPath] = useState(ROUTES.UPLOAD);

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
        <CircularProgress aria-label="Loading upload page" />
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
          Upload Document
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload PDF, DOCX, or TXT files to extract text content.
        </Typography>

        <FileDropzone />
      </Box>
    </AppLayout>
  );
}