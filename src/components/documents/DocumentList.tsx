'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDocuments } from '@/src/contexts/DocumentContext';
import { useSnackbar } from '@/src/contexts/SnackbarContext';
import { DocumentRecord } from '@/src/lib/types';
import { ROUTES } from '@/src/lib/constants';

interface DocumentListProps {
  onNavigate?: (path: string) => void;
}

function getFileIcon(fileType: string): React.ReactNode {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ fontSize: 40, color: 'error.main' }} aria-hidden="true" />;
    case 'docx':
      return <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />;
    case 'txt':
      return <TextSnippetIcon sx={{ fontSize: 40, color: 'text.secondary' }} aria-hidden="true" />;
    default:
      return <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} aria-hidden="true" />;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

function DocumentList({ onNavigate }: DocumentListProps) {
  const { documents, loading, error, deleteDocument, deleteAllDocuments, documentCount } =
    useDocuments();
  const { showSuccess, showError } = useSnackbar();

  const handleDocumentClick = (id: string) => {
    if (onNavigate) {
      onNavigate(`${ROUTES.DOCUMENTS}/${id}`);
    }
  };

  const handleDelete = (event: React.MouseEvent, id: string, fileName: string) => {
    event.stopPropagation();

    const result = deleteDocument(id);
    if (result.success) {
      showSuccess(`"${fileName}" deleted successfully.`);
    } else {
      showError(result.error || 'Failed to delete document.');
    }
  };

  const handleDeleteAll = () => {
    if (documentCount === 0) return;

    const result = deleteAllDocuments();
    if (result.success) {
      showSuccess('All documents deleted successfully.');
    } else {
      showError(result.error || 'Failed to delete documents.');
    }
  };

  const handleNavigateToUpload = () => {
    if (onNavigate) {
      onNavigate(ROUTES.UPLOAD);
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
        <CircularProgress aria-label="Loading documents" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" role="alert" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (documentCount === 0) {
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
          No documents yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Upload a document to get started with text extraction.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadFileIcon />}
          onClick={handleNavigateToUpload}
          aria-label="Upload your first document"
        >
          Upload Document
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
        }}
      >
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Documents ({documentCount})
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweepIcon />}
          onClick={handleDeleteAll}
          aria-label="Delete all documents"
        >
          Delete All
        </Button>
      </Box>

      <Grid container spacing={2}>
        {documents.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.light',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardActionArea
                onClick={() => handleDocumentClick(doc.id)}
                aria-label={`View details for ${doc.fileName}`}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    {getFileIcon(doc.fileType)}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {doc.fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.fileType.toUpperCase()} • {formatFileSize(doc.fileSize)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {getStatusChip(doc.extractionStatus)}
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(doc.uploadTimestamp)}
                    </Typography>
                  </Box>

                  {doc.extractionStatus === 'completed' && doc.extractedText && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {doc.extractedText}
                    </Typography>
                  )}

                  {doc.extractionStatus === 'failed' && doc.errorMessage && (
                    <Typography
                      variant="body2"
                      color="error.main"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {doc.errorMessage}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  px: 1,
                  pb: 1,
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => handleDelete(e, doc.id, doc.fileName)}
                  aria-label={`Delete ${doc.fileName}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DocumentList;