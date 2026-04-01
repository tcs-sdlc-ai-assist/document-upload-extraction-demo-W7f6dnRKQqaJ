export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Doc Upload & Extract';

export const STORAGE_KEYS = {
  USERS: 'doc_upload_users',
  SESSION: 'doc_upload_session',
  DOCUMENTS: 'doc_upload_documents',
} as const;

export const SUPPORTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
} as const;

export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt'] as const;

export const SUPPORTED_MIME_TYPES = Object.keys(SUPPORTED_FILE_TYPES) as string[];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const MAX_FILE_SIZE_LABEL = '5MB';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  DOCUMENTS: '/documents',
} as const;