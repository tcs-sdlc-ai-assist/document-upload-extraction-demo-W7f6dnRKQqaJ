'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDocuments } from '@/src/contexts/DocumentContext';
import { useSnackbar } from '@/src/contexts/SnackbarContext';
import { DocumentRecord } from '@/src/lib/types';
import { ROUTES } from '@/src/lib/constants';

interface DocumentDetailProps {
  documentId: string;
  onNavigate?: (path: string) => void;
}

function getFileIcon(fileType: string): React.ReactNode {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ fontSize: 48, color: 'error.main' }} aria-hidden="true" />;
    case 'docx':
      return <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} aria-hidden="true" />;
    case 'txt':
      return <TextSnippetIcon sx={{ fontSize: 48, color: 'text.secondary' }} aria-hidden="true" />;
    default:
      return <InsertDriveFileIcon sx={{ fontSize: 48, color: 'text.secondary' }} aria-hidden="true" />;
  }
}

function getStatusChip(status: DocumentRecord['extractionStatus']): React.ReactNode {
  switch (status) {
    case 'completed':
      return (
        <Chip
          icon={<CheckCircleIcon fontSize="small" />}
          label="Completed"
          size="small"
          color="success"
          variant="filled"
          aria-label="Status: Completed"
        />
      );
    case 'failed':
      return (
        <Chip
          icon={<ErrorIcon fontSize="small" />}
          label="Failed"
          size="small"
          color="error"
          variant="filled"
          aria-label="Status: Failed"
        />
      );
    case 'processing':
      return (
        <Chip
          icon={<AutorenewIcon fontSize="small" />}
          label="Processing"
          size="small"
          color="primary"
          variant="outlined"
          aria-label="Status: Processing"
        />
      );
    case 'pending':
      return (
        <Chip
          icon={<HourglassEmptyIcon fontSize="small" />}
          label="Pending"
          size="small"
          color="warning"
          variant="outlined"
          aria-label="Status: Pending"
        />
      );
    default:
      return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

function DocumentDetail({ documentId, onNavigate }: DocumentDetailProps) {
  const { getDocumentById, deleteDocument, loading } = useDocuments();
  const { showSuccess, showError } = useSnackbar();

  const document = getDocumentById(documentId);

  const handleDelete = () => {
    if (!document) return;

    const result = deleteDocument(document.id);
    if (result.success) {
      showSuccess(`"${document.fileName}" deleted successfully.`);
      if (onNavigate) {
        onNavigate(ROUTES.DOCUMENTS);
      }
    } else {
      showError(result.error || 'Failed to delete document.');
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate(ROUTES.DOCUMENTS);
    }
  };

  const handleCopyText = async () => {
    if (!document || !document.extractedText) return;

    try {
      await navigator.clipboard.writeText(document.extractedText);
      showSuccess('Text copied to clipboard!');
    } catch {
      showError('Failed to copy text to clipboard.');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress aria-label="Loading document" />
      </Box>
    );
  }

  if (!document) {
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
          Document not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          The document you are looking for does not exist or has been deleted.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          aria-label="Back to documents"
        >
          Back to Documents
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Button
          variant="text"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          aria-label="Back to documents"
        >
          Back to Documents
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          aria-label={`Delete ${document.fileName}`}
        >
          Delete
        </Button>
      </Box>

      <Card
        sx={{
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            {getFileIcon(document.fileType)}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {document.fileName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                {getStatusChip(document.extractionStatus)}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                File Type
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {document.fileType.toUpperCase()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                File Size
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatFileSize(document.fileSize)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Upload Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatTimestamp(document.uploadTimestamp)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Extraction Status
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {document.extractionStatus.charAt(0).toUpperCase() +
                  document.extractionStatus.slice(1)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {document.extractionStatus === 'failed' && document.errorMessage && (
        <Alert severity="error" role="alert" sx={{ mb: 3 }}>
          {document.errorMessage}
        </Alert>
      )}

      {document.extractionStatus === 'processing' && (
        <Alert severity="info" role="status" sx={{ mb: 3 }}>
          Document is currently being processed. Please check back shortly.
        </Alert>
      )}

      {document.extractionStatus === 'pending' && (
        <Alert severity="warning" role="status" sx={{ mb: 3 }}>
          Document is pending processing.
        </Alert>
      )}

      {document.extractionStatus === 'completed' && (
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Extracted Text
            </Typography>
            {document.extractedText && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyText}
                aria-label="Copy extracted text to clipboard"
              >
                Copy
              </Button>
            )}
          </Box>

          {document.extractedText ? (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 500,
                overflow: 'auto',
                backgroundColor: 'background.default',
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  m: 0,
                }}
              >
                {document.extractedText}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No text was extracted from this document.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default DocumentDetail;