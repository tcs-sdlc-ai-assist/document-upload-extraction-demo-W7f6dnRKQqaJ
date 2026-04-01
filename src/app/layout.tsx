'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/src/lib/theme';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { SnackbarProvider } from '@/src/contexts/SnackbarContext';
import { DocumentProvider } from '@/src/contexts/DocumentContext';
import ErrorBoundary from '@/src/components/common/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Upload documents and extract text from PDF, DOCX, and TXT files." />
        <title>Doc Upload &amp; Extract</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <SnackbarProvider>
              <AuthProvider>
                <DocumentProvider>
                  {children}
                </DocumentProvider>
              </AuthProvider>
            </SnackbarProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}