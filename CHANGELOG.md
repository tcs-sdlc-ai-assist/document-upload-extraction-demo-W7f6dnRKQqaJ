# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### User Authentication
- User registration with username, email, and password validation
- Username must be alphanumeric and between 3–32 characters
- Email format validation and duplicate detection
- Password hashing using SHA-256 via Web Crypto API with btoa fallback
- User login with credential verification
- Logout functionality with session cleanup

#### Session Management
- Persistent session storage via localStorage
- Automatic session restoration on page load
- Session context provider (`AuthContext`) for app-wide authentication state
- Protected route component to guard authenticated pages
- Redirect to login page when unauthenticated

#### Document Upload & Validation
- Drag-and-drop file upload zone with visual feedback
- Click-to-browse file selection
- Supported file formats: PDF, DOCX, TXT
- File type validation by MIME type and file extension
- File size validation with 5MB maximum limit
- Empty file detection
- Real-time upload status indicators (validating, processing, success, error)

#### Text Extraction
- PDF text extraction using `pdfjs-dist` with multi-page support
- DOCX text extraction using `mammoth`
- TXT file reading via FileReader API
- Automatic retry mechanism with up to 2 retries and exponential backoff
- Per-document extraction status tracking (pending, processing, completed, failed)

#### Text Cleaning
- Line break normalization (CRLF and CR converted to LF)
- Extra whitespace removal within lines
- Excessive blank line reduction (3+ blank lines collapsed to 2)
- Leading and trailing whitespace trimming

#### Data Persistence
- All document records stored in localStorage
- User-scoped document storage and retrieval
- Document CRUD operations (create, read, delete)
- Bulk delete all documents per user
- Unique document ID generation

#### User Interface
- Responsive layout with collapsible sidebar navigation
- **Dashboard page**: summary statistics (total, completed, failed documents), quick access cards, recent uploads list
- **Upload page**: file dropzone with supported format chips, progress indicators, success/error feedback
- **History page**: document list with file type icons, status chips, file size and timestamp display, individual and bulk delete actions
- **Document detail page**: full metadata display, extracted text viewer with copy-to-clipboard, error messages for failed extractions
- **Login page**: username and password form with validation and show/hide password toggle
- **Signup page**: registration form with username, email, password, and confirm password fields
- Material UI (MUI) component library with custom theme
- Mobile-responsive design with breakpoint-aware sidebar (permanent on desktop, temporary drawer on mobile)
- Accessible UI with ARIA labels, roles, focus-visible outlines, and skip-to-content link

#### Error Handling
- Centralized error handler with typed error codes and categories (validation, extraction, storage, auth, unknown)
- User-friendly error messages mapped to each error code
- Error boundary component for catching unexpected React errors
- Snackbar notifications for success, error, and info messages
- Console logging for debugging with original error preservation

#### Developer Experience
- TypeScript strict mode with comprehensive type definitions
- Next.js 14 App Router with static export configuration
- ESLint configuration with Next.js and TypeScript recommended rules
- Path aliases (`@/*`) for clean imports
- Vercel deployment configuration with SPA rewrites
- Environment variable support for app name customization