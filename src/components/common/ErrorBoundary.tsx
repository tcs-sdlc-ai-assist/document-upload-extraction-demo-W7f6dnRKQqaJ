'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as ErrorHandler from '@/src/services/ErrorHandler';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const pipelineError = ErrorHandler.fromUnknownError(error);
    ErrorHandler.handle(pipelineError);

    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      errorMessage: '',
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
            backgroundColor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              maxWidth: 500,
              width: '100%',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
              }}
            >
              <ErrorIcon
                sx={{ fontSize: 64, color: 'error.main' }}
                aria-hidden="true"
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 600 }}
              >
                Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {this.state.errorMessage || 'An unexpected error occurred. Please try again.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                aria-label="Retry"
                sx={{ mt: 1 }}
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;