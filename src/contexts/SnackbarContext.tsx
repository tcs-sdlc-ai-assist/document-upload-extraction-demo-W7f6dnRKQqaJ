'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    []
  );

  const showMessage = useCallback((message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showMessage(message, 'success');
    },
    [showMessage]
  );

  const showError = useCallback(
    (message: string) => {
      showMessage(message, 'error');
    },
    [showMessage]
  );

  const showInfo = useCallback(
    (message: string) => {
      showMessage(message, 'info');
    },
    [showMessage]
  );

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSuccess,
      showError,
      showInfo,
    }),
    [showSuccess, showError, showInfo]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
          role="alert"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export { SnackbarProvider, useSnackbar, SnackbarContext };