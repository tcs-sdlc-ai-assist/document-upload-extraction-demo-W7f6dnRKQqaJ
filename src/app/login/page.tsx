'use client';

import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';
import LoginForm from '@/src/components/auth/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = React.useState(ROUTES.LOGIN);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setCurrentPath(ROUTES.DASHBOARD);
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
        <CircularProgress aria-label="Loading authentication" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress aria-label="Redirecting to dashboard" />
      </Box>
    );
  }

  return <LoginForm onNavigate={handleNavigate} />;
}