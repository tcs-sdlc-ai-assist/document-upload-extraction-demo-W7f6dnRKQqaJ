'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

function EmptyState({
  title = 'No documents yet',
  description = 'Upload a document to get started with text extraction.',
  actionLabel,
  actionIcon,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <InsertDriveFileIcon
        sx={{ fontSize: 64, color: 'text.disabled' }}
        aria-hidden="true"
      />
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          startIcon={actionIcon}
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;