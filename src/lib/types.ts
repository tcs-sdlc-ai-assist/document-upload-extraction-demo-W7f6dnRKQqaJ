export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  username: string;
  email: string;
  loginAt: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadTimestamp: string;
  extractedText: string;
  extractionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Session | null;
  loading: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ExtractionResult {
  success: boolean;
  text: string;
  errorMessage?: string;
}