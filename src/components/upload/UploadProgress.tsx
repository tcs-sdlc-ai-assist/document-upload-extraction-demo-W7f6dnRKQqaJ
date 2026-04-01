'use client';

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Chip,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

type UploadStage = 'validating' | 'extracting' | 'cleaning' | 'complete' | 'error';

interface UploadProgressProps {
  fileName: string;
  fileSize?: number;
  stage: UploadStage;
  errorMessage?: string;
}

const STAGE_CONFIG: Record<
  UploadStage,
  {
    label: string;
    color: 'primary' | 'success' | 'error' | 'warning' | 'info';
    icon: React.ReactNode;
    progressValue?: number;
  }
> = {
  validating: {
    label: 'Validating...',
    color: 'info',
    icon: <HourglassEmptyIcon fontSize="small" />,
    progressValue: 20,
  },
  extracting: {
    label: 'Extracting text...',
    color: 'primary',
    icon: <AutorenewIcon fontSize="small" />,
    progressValue: 55,
  },
  cleaning: {
    label: 'Cleaning text...',
    color: 'primary',
    icon: <CleaningServicesIcon fontSize="small" />,
    progressValue: 85,
  },
  complete: {
    label: 'Complete',
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
    progressValue: 100,
  },
  error: {
    label: 'Error',
    color: 'error',
    icon: <ErrorIcon fontSize="small" />,
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function UploadProgress({ fileName, fileSize, stage, errorMessage }: UploadProgressProps) {
  const config = STAGE_CONFIG[stage];
  const isProcessing = stage === 'validating' || stage === 'extracting' || stage === 'cleaning';
  const isComplete = stage === 'complete';
  const isError = stage === 'error';

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: isError
          ? 'error.light'
          : isComplete
          ? 'success.light'
          : 'divider',
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
      }}
      role="status"
      aria-label={`Upload progress: ${config.label}`}
      aria-live="polite"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
        }}
      >
        <InsertDriveFileIcon
          sx={{
            fontSize: 36,
            color: isError
              ? 'error.main'
              : isComplete
              ? 'success.main'
              : 'primary.main',
          }}
          aria-hidden="true"
        />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {fileName}
          </Typography>
          {fileSize !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(fileSize)}
            </Typography>
          )}
        </Box>
        <Chip
          icon={config.icon as React.ReactElement}
          label={config.label}
          size="small"
          color={config.color}
          variant={isComplete || isError ? 'filled' : 'outlined'}
          aria-label={`Status: ${config.label}`}
        />
      </Box>

      <Box sx={{ width: '100%', mb: isError && errorMessage ? 1.5 : 0 }}>
        {isProcessing && config.progressValue !== undefined && (
          <LinearProgress
            variant="determinate"
            value={config.progressValue}
            color={config.color}
            sx={{ borderRadius: 1, height: 6 }}
            aria-label={`Progress: ${config.progressValue}%`}
          />
        )}
        {isComplete && (
          <LinearProgress
            variant="determinate"
            value={100}
            color="success"
            sx={{ borderRadius: 1, height: 6 }}
            aria-label="Progress: 100%"
          />
        )}
        {isError && (
          <LinearProgress
            variant="determinate"
            value={100}
            color="error"
            sx={{ borderRadius: 1, height: 6 }}
            aria-label="Progress: error"
          />
        )}
      </Box>

      {isError && errorMessage && (
        <Typography
          variant="body2"
          color="error.main"
          sx={{ mt: 1 }}
          role="alert"
        >
          {errorMessage}
        </Typography>
      )}

      {isProcessing && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block' }}
        >
          Please wait while your document is being processed...
        </Typography>
      )}

      {isComplete && (
        <Typography
          variant="caption"
          color="success.main"
          sx={{ mt: 1, display: 'block' }}
        >
          Document processed successfully!
        </Typography>
      )}
    </Paper>
  );
}

export default UploadProgress;