'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';
import LoginForm from '@/src/components/auth/LoginForm';
import AppLayout from '@/src/components/layout/AppLayout';

export default function RootPage() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(ROUTES.HOME);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        setCurrentPath(ROUTES.DASHBOARD);
      } else {
        setCurrentPath(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress aria-label="Loading application" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onNavigate={handleNavigate} />;
  }

  return (
    <AppLayout activePath={currentPath} onNavigate={handleNavigate}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress aria-label="Redirecting to dashboard" />
      </Box>
    </AppLayout>
  );
}