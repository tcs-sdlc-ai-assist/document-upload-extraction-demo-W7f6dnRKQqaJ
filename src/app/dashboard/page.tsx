'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDocuments } from '@/src/contexts/DocumentContext';
import { ROUTES } from '@/src/lib/constants';
import AppLayout from '@/src/components/layout/AppLayout';
import EmptyState from '@/src/components/common/EmptyState';
import { DocumentRecord } from '@/src/lib/types';

function getFileIcon(fileType: string): React.ReactNode {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ fontSize: 36, color: 'error.main' }} aria-hidden="true" />;
    case 'docx':
      return <DescriptionIcon sx={{ fontSize: 36, color: 'primary.main' }} aria-hidden="true" />;
    case 'txt':
      return <TextSnippetIcon sx={{ fontSize: 36, color: 'text.secondary' }} aria-hidden="true" />;
    default:
      return <InsertDriveFileIcon sx={{ fontSize: 36, color: 'text.secondary' }} aria-hidden="true" />;
  }
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { documents, loading: docsLoading, documentCount } = useDocuments();
  const [currentPath, setCurrentPath] = useState(ROUTES.DASHBOARD);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setCurrentPath(ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || docsLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress aria-label="Loading dashboard" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const completedDocs = documents.filter((doc) => doc.extractionStatus === 'completed');
  const failedDocs = documents.filter((doc) => doc.extractionStatus === 'failed');
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.uploadTimestamp).getTime() - new Date(a.uploadTimestamp).getTime())
    .slice(0, 5);

  return (
    <AppLayout activePath={currentPath} onNavigate={handleNavigate}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back, {user?.username}! Here&apos;s an overview of your documents.
        </Typography>

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {documentCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Documents
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} aria-hidden="true" />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {completedDocs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                }}
              >
                <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} aria-hidden="true" />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {failedDocs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardActionArea
                onClick={() => handleNavigate(ROUTES.UPLOAD)}
                aria-label="Upload a new document"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1,
                  }}
                >
                  <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload a new document
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Access Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
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
                onClick={() => handleNavigate(ROUTES.UPLOAD)}
                aria-label="Go to upload page"
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Upload Document
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload PDF, DOCX, or TXT files for text extraction
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
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
                onClick={() => handleNavigate(ROUTES.DOCUMENTS)}
                aria-label="Go to document history"
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 48, color: 'primary.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Document History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage all your uploaded documents
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Uploads */}
        <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Uploads
        </Typography>

        {recentDocuments.length === 0 ? (
          <EmptyState
            title="No documents yet"
            description="Upload your first document to get started with text extraction."
            actionLabel="Upload Document"
            actionIcon={<UploadFileIcon />}
            onAction={() => handleNavigate(ROUTES.UPLOAD)}
          />
        ) : (
          <Grid container spacing={2}>
            {recentDocuments.map((doc: DocumentRecord) => (
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
                    onClick={() => handleNavigate(`${ROUTES.DOCUMENTS}/${doc.id}`)}
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
                        {doc.extractionStatus === 'completed' && (
                          <Chip
                            icon={<CheckCircleIcon fontSize="small" />}
                            label="Completed"
                            size="small"
                            color="success"
                            variant="filled"
                            aria-label="Status: Completed"
                          />
                        )}
                        {doc.extractionStatus === 'failed' && (
                          <Chip
                            icon={<ErrorIcon fontSize="small" />}
                            label="Failed"
                            size="small"
                            color="error"
                            variant="filled"
                            aria-label="Status: Failed"
                          />
                        )}
                        {doc.extractionStatus === 'processing' && (
                          <Chip
                            label="Processing"
                            size="small"
                            color="primary"
                            variant="outlined"
                            aria-label="Status: Processing"
                          />
                        )}
                        {doc.extractionStatus === 'pending' && (
                          <Chip
                            label="Pending"
                            size="small"
                            color="warning"
                            variant="outlined"
                            aria-label="Status: Pending"
                          />
                        )}
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
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </AppLayout>
  );
}