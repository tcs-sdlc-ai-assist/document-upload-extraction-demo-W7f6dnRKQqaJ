# Doc Upload & Extract

A client-side document upload and text extraction application built with Next.js 14, React, and Material UI. Upload PDF, DOCX, or TXT files and extract their text content — all processed locally in the browser with no server-side dependencies.

## Features

### User Authentication
- User registration with username, email, and password validation
- Username must be alphanumeric and between 3–32 characters
- Email format validation and duplicate detection
- Password hashing using SHA-256 via Web Crypto API with btoa fallback
- User login with credential verification
- Logout functionality with session cleanup

### Session Management
- Persistent session storage via localStorage
- Automatic session restoration on page load
- Session context provider (`AuthContext`) for app-wide authentication state
- Protected route component to guard authenticated pages
- Redirect to login page when unauthenticated

### Document Upload & Validation
- Drag-and-drop file upload zone with visual feedback
- Click-to-browse file selection
- Supported file formats: **PDF**, **DOCX**, **TXT**
- File type validation by MIME type and file extension
- File size validation with 5MB maximum limit
- Empty file detection
- Real-time upload status indicators (validating, processing, success, error)

### Text Extraction
- **PDF** text extraction using `pdfjs-dist` with multi-page support
- **DOCX** text extraction using `mammoth`
- **TXT** file reading via FileReader API
- Automatic retry mechanism with up to 2 retries and exponential backoff
- Per-document extraction status tracking (pending, processing, completed, failed)

### Text Cleaning
- Line break normalization (CRLF and CR converted to LF)
- Extra whitespace removal within lines
- Excessive blank line reduction (3+ blank lines collapsed to 2)
- Leading and trailing whitespace trimming

### Data Persistence
- All document records stored in localStorage
- User-scoped document storage and retrieval
- Document CRUD operations (create, read, delete)
- Bulk delete all documents per user
- Unique document ID generation

### User Interface
- Responsive layout with collapsible sidebar navigation
- **Dashboard page**: summary statistics (total, completed, failed documents), quick access cards, recent uploads list
- **Upload page**: file dropzone with supported format chips, progress indicators, success/error feedback
- **History page**: document list with file type icons, status chips, file size and timestamp display, individual and bulk delete actions
- **Document detail page**: full metadata display, extracted text viewer with copy-to-clipboard, error messages for failed extractions
- **Login page**: username and password form with validation and show/hide password toggle
- **Signup page**: registration form with username, email, password, and confirm password fields

### Accessibility
- ARIA labels and roles throughout the UI
- Focus-visible outlines for keyboard navigation
- Skip-to-content link for screen readers
- Mobile-responsive design with breakpoint-aware sidebar (permanent on desktop, temporary drawer on mobile)

### Error Handling
- Centralized error handler with typed error codes and categories (validation, extraction, storage, auth, unknown)
- User-friendly error messages mapped to each error code
- Error boundary component for catching unexpected React errors
- Snackbar notifications for success, error, and info messages
- Console logging for debugging with original error preservation

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router and static export |
| [React 18](https://react.dev/) | UI component library |
| [Material UI (MUI) 6](https://mui.com/) | Component library and theming |
| [pdfjs-dist](https://github.com/nickolasg/pdfjs-dist) | PDF text extraction |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | DOCX text extraction |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [ESLint](https://eslint.org/) | Code linting |

## Folder Structure

```
doc-upload-extract/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard page
│   │   ├── history/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Document detail page
│   │   │   └── page.tsx             # Document history page
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── signup/
│   │   │   └── page.tsx             # Signup page
│   │   ├── upload/
│   │   │   └── page.tsx             # Upload page
│   │   ├── globals.css              # Global styles and CSS reset
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Root page (redirects based on auth)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx        # Login form component
│   │   │   └── SignupForm.tsx        # Signup form component
│   │   ├── common/
│   │   │   ├── EmptyState.tsx       # Empty state placeholder
│   │   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   │   └── ProtectedRoute.tsx   # Auth guard component
│   │   ├── documents/
│   │   │   ├── DocumentDetail.tsx   # Document detail view
│   │   │   └── DocumentList.tsx     # Document list view
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Main app layout with sidebar
│   │   │   ├── Header.tsx           # Top app bar
│   │   │   └── Sidebar.tsx          # Navigation sidebar
│   │   └── upload/
│   │       ├── FileDropzone.tsx     # Drag-and-drop file upload
│   │       └── UploadProgress.tsx   # Upload progress indicator
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication state context
│   │   ├── DocumentContext.tsx      # Document state context
│   │   └── SnackbarContext.tsx      # Snackbar notification context
│   ├── lib/
│   │   ├── constants.ts            # App constants and configuration
│   │   ├── theme.ts                # MUI theme customization
│   │   └── types.ts                # TypeScript type definitions
│   └── services/
│       ├── DocumentProcessor.ts    # Document processing pipeline
│       ├── DocumentStore.ts        # Document storage operations
│       ├── ErrorHandler.ts         # Centralized error handling
│       ├── FileValidator.ts        # File validation logic
│       ├── SessionManager.ts       # Session management
│       ├── StorageManager.ts       # localStorage operations
│       ├── TextCleaner.ts          # Text cleaning utilities
│       ├── TextExtractor.ts        # Text extraction (PDF, DOCX, TXT)
│       └── UserAuth.ts             # User authentication logic
├── .env.example                     # Environment variable template
├── .eslintrc.json                   # ESLint configuration
├── CHANGELOG.md                     # Project changelog
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── vercel.json                      # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd doc-upload-extract
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Application display name shown in the header and auth pages | `Doc Upload & Extract` |

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
```

This generates a static export in the `out/` directory, suitable for deployment to any static hosting provider.

### Lint

Run ESLint to check for code quality issues:

```bash
npm run lint
```

### Start (Production)

Serve the production build locally:

```bash
npm run start
```

## Usage Guide

### 1. Create an Account

Navigate to the signup page and create an account with a username, email, and password. Usernames must be alphanumeric (3–32 characters) and passwords must be at least 6 characters.

### 2. Upload a Document

Go to the **Upload** page and either drag-and-drop a file onto the dropzone or click **Browse Files** to select a file. Supported formats are:

- **PDF** (`.pdf`) — up to 5MB
- **DOCX** (`.docx`) — up to 5MB
- **TXT** (`.txt`) — up to 5MB

The application will validate the file, extract text content, clean the extracted text, and save the result.

### 3. View Extracted Text

Navigate to the **History** page to see all uploaded documents. Click on any document to view its full metadata and extracted text. Use the **Copy** button to copy extracted text to your clipboard.

### 4. Manage Documents

From the **History** page, delete individual documents using the delete icon on each card, or use **Delete All** to remove all documents at once.

### 5. Dashboard Overview

The **Dashboard** page provides a summary of your documents including total count, completed extractions, and failed extractions, along with quick access links and a list of recent uploads.

## Architecture Notes

### Static Export

The application is configured for static export (`output: 'export'` in `next.config.js`), meaning all pages are pre-rendered as static HTML. This enables deployment to any static hosting provider (Vercel, Netlify, GitHub Pages, S3, etc.) without requiring a Node.js server.

### Client-Side Only

All data processing happens entirely in the browser:

- **Authentication**: User credentials are stored in localStorage with SHA-256 password hashing
- **Document storage**: Document records and extracted text are persisted in localStorage
- **Text extraction**: PDF parsing (`pdfjs-dist`), DOCX parsing (`mammoth`), and TXT reading (`FileReader`) all run client-side

No data is sent to any external server.

### State Management

The application uses React Context for global state management:

- **`AuthContext`** — manages user authentication state, login, signup, and logout
- **`DocumentContext`** — manages document CRUD operations, processing state, and document list
- **`SnackbarContext`** — manages toast notification display

### Document Processing Pipeline

When a file is uploaded, it passes through the following pipeline:

1. **Validation** (`FileValidator`) — checks file type, size, and emptiness
2. **Extraction** (`TextExtractor`) — extracts raw text based on file type with retry logic
3. **Cleaning** (`TextCleaner`) — normalizes line breaks, removes extra whitespace, and trims
4. **Storage** (`StorageManager`) — persists the document record to localStorage

### Error Handling

Errors are categorized into typed error codes (`ErrorHandler`) with user-friendly messages. The `ErrorBoundary` component catches unexpected React rendering errors, while the `SnackbarContext` provides non-blocking notifications for operational errors and success messages.

### Deployment

The project includes a `vercel.json` configuration with SPA rewrites for client-side routing support on Vercel. For other hosting providers, configure a fallback to `index.html` for all routes.

## License

This project is private and not licensed for public distribution.