'use client';

import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme, IconButton, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Header from '@/src/components/layout/Header';
import Sidebar from '@/src/components/layout/Sidebar';
import { useAuth } from '@/src/contexts/AuthContext';
import { ROUTES } from '@/src/lib/constants';

const DRAWER_WIDTH = 240;

interface AppLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

function AppLayout({ children, activePath = '', onNavigate }: AppLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (onNavigate) {
        onNavigate(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, loading, onNavigate]);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

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
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        activePath={activePath}
        onNavigate={handleNavigate}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: '64px',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {!isDesktop && (
          <Box sx={{ p: 1 }}>
            <IconButton
              onClick={handleSidebarOpen}
              aria-label="Open navigation menu"
              size="medium"
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
          }}
          role="main"
          aria-label="Main content"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;