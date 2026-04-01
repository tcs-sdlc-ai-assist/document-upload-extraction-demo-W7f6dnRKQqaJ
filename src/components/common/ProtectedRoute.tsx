'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNavigate?: (path: string) => void;
}

function ProtectedRoute({ children, onNavigate }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (onNavigate) {
        onNavigate(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, loading, onNavigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;