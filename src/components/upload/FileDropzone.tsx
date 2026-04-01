'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDocuments } from '@/src/contexts/DocumentContext';
import { useSnackbar } from '@/src/contexts/SnackbarContext';
import { validateFile } from '@/src/services/FileValidator';
import {
  SUPPORTED_EXTENSIONS,
  SUPPORTED_MIME_TYPES,
  MAX_FILE_SIZE_LABEL,
} from '@/src/lib/constants';

type UploadStatus = 'idle' | 'validating' | 'processing' | 'success' | 'error';

function FileDropzone() {
  const { processDocument, processing } = useDocuments();
  const { showSuccess, showError } = useSnackbar();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setStatusMessage('');
  }, []);

  const handleValidateAndProcess = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      setUploadStatus('validating');
      setStatusMessage('Validating file...');

      const validationResult = validateFile(file);
      if (!validationResult.valid) {
        const errorMessage = validationResult.errors.join(' ');
        setUploadStatus('error');
        setStatusMessage(errorMessage);
        showError(errorMessage);
        return;
      }

      setUploadStatus('processing');
      setStatusMessage('Processing document...');

      const result = await processDocument(file);

      if (result.success) {
        setUploadStatus('success');
        setStatusMessage('Document processed successfully!');
        showSuccess('Document uploaded and processed successfully!');
      } else {
        const errorMessage = result.error || 'Failed to process document';
        setUploadStatus('error');
        setStatusMessage(errorMessage);
        showError(errorMessage);
      }
    },
    [processDocument, showSuccess, showError]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver(false);

      if (processing) return;

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        handleValidateAndProcess(files[0]);
      }
    },
    [processing, handleValidateAndProcess]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        handleValidateAndProcess(files[0]);
      }
      // Reset input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleValidateAndProcess]
  );

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleClearFile = useCallback(() => {
    resetState();
  }, [resetState]);

  const isProcessing = uploadStatus === 'validating' || uploadStatus === 'processing';
  const acceptTypes = SUPPORTED_MIME_TYPES.join(',');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Paper
        elevation={dragOver ? 6 : 2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          border: '2px dashed',
          borderColor: dragOver
            ? 'primary.main'
            : uploadStatus === 'error'
            ? 'error.light'
            : uploadStatus === 'success'
            ? 'success.light'
            : 'divider',
          backgroundColor: dragOver
            ? 'action.hover'
            : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          cursor: isProcessing ? 'default' : 'pointer',
          opacity: isProcessing ? 0.85 : 1,
        }}
        role="region"
        aria-label="File upload drop zone"
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
          {uploadStatus === 'idle' && (
            <>
              <CloudUploadIcon
                sx={{ fontSize: 56, color: dragOver ? 'primary.main' : 'text.secondary' }}
                aria-hidden="true"
              />
              <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
                Drag & drop your document here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click the button below to browse
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {SUPPORTED_EXTENSIONS.map((ext) => (
                  <Chip
                    key={ext}
                    label={ext.toUpperCase()}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Maximum file size: {MAX_FILE_SIZE_LABEL}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadFileIcon />}
                onClick={handleBrowseClick}
                disabled={processing}
                aria-label="Browse files to upload"
              >
                Browse Files
              </Button>
            </>
          )}

          {isProcessing && (
            <>
              <InsertDriveFileIcon
                sx={{ fontSize: 48, color: 'primary.main' }}
                aria-hidden="true"
              />
              {selectedFile && (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedFile.name}
                </Typography>
              )}
              {selectedFile && (
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)}
                </Typography>
              )}
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress
                  aria-label="Processing document"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {statusMessage}
              </Typography>
            </>
          )}

          {uploadStatus === 'success' && (
            <>
              <CheckCircleIcon
                sx={{ fontSize: 48, color: 'success.main' }}
                aria-hidden="true"
              />
              {selectedFile && (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedFile.name}
                </Typography>
              )}
              <Alert
                severity="success"
                sx={{ width: '100%' }}
                action={
                  <IconButton
                    size="small"
                    onClick={handleClearFile}
                    aria-label="Clear and upload another file"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {statusMessage}
              </Alert>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<UploadFileIcon />}
                onClick={() => {
                  resetState();
                  handleBrowseClick();
                }}
                aria-label="Upload another file"
              >
                Upload Another
              </Button>
            </>
          )}

          {uploadStatus === 'error' && (
            <>
              <ErrorIcon
                sx={{ fontSize: 48, color: 'error.main' }}
                aria-hidden="true"
              />
              {selectedFile && (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedFile.name}
                </Typography>
              )}
              <Alert
                severity="error"
                sx={{ width: '100%' }}
                action={
                  <IconButton
                    size="small"
                    onClick={handleClearFile}
                    aria-label="Dismiss error"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {statusMessage}
              </Alert>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadFileIcon />}
                onClick={() => {
                  resetState();
                  handleBrowseClick();
                }}
                aria-label="Try uploading again"
              >
                Try Again
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </Box>
  );
}

export default FileDropzone;