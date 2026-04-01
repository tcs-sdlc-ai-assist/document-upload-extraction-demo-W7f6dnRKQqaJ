'use client';

import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';
import SignupForm from '@/src/components/auth/SignupForm';

export default function SignupPage() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = React.useState(ROUTES.REGISTER);

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

  return <SignupForm onNavigate={handleNavigate} />;
}