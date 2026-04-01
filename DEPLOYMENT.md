# Deployment Guide

This document provides detailed instructions for deploying the **Doc Upload & Extract** application to production environments.

## Table of Contents

- [Static Export Overview](#static-export-overview)
- [Vercel Deployment](#vercel-deployment)
  - [One-Click Deploy](#one-click-deploy)
  - [Manual Deployment via CLI](#manual-deployment-via-cli)
- [Environment Variable Configuration](#environment-variable-configuration)
- [Static Export Settings](#static-export-settings)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [CI/CD with GitHub Integration](#cicd-with-github-integration)
- [Alternative Hosting Providers](#alternative-hosting-providers)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Troubleshooting](#troubleshooting)

---

## Static Export Overview

The application is configured as a fully static export (`output: 'export'` in `next.config.js`). This means:

- All pages are pre-rendered as static HTML, CSS, and JavaScript files at build time.
- No Node.js server is required in production.
- The build output is written to the `out/` directory.
- All data processing (authentication, document storage, text extraction) happens entirely client-side using `localStorage` and browser APIs.

This makes the application deployable to **any static hosting provider** — Vercel, Netlify, GitHub Pages, AWS S3, Firebase Hosting, etc.

---

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended deployment platform for Next.js applications.

### One-Click Deploy

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Click **Import** and select your repository.
4. Vercel will auto-detect the Next.js framework. Confirm the following settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm install`
5. Configure environment variables (see [Environment Variable Configuration](#environment-variable-configuration)).
6. Click **Deploy**.

Vercel will build the application, generate the static export, and deploy it to a production URL.

### Manual Deployment via CLI

1. Install the Vercel CLI globally:

```bash
npm install -g vercel
```

2. Authenticate with your Vercel account:

```bash
vercel login
```

3. From the project root, run:

```bash
vercel
```

4. Follow the prompts to link the project to your Vercel account and configure settings.

5. For production deployment:

```bash
vercel --prod
```

6. To set environment variables via CLI:

```bash
vercel env add NEXT_PUBLIC_APP_NAME
```

Enter the value when prompted (e.g., `Doc Upload & Extract`).

---

## Environment Variable Configuration

The application uses a single environment variable for customization:

| Variable | Description | Default | Required |
|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Application display name shown in the header and authentication pages | `Doc Upload & Extract` | No |

### Setting Environment Variables

#### Local Development

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_APP_NAME=Doc Upload & Extract
```

#### Vercel Dashboard

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** → **Environment Variables**.
3. Add the variable:
   - **Key**: `NEXT_PUBLIC_APP_NAME`
   - **Value**: Your desired application name
   - **Environments**: Select Production, Preview, and/or Development as needed.
4. Click **Save**.
5. Redeploy the application for changes to take effect.

> **Note**: Variables prefixed with `NEXT_PUBLIC_` are embedded into the client-side JavaScript bundle at build time. Changing them requires a rebuild and redeployment.

---

## Static Export Settings

The static export is configured in `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?mjs$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]',
      },
    });
    return config;
  },
};
```

### Key Configuration Details

| Setting | Purpose |
|---|---|
| `output: 'export'` | Enables static HTML export to the `out/` directory |
| `images.unoptimized: true` | Disables Next.js Image Optimization API (not available in static exports) |
| `canvas: false` | Prevents `canvas` module resolution errors from `pdfjs-dist` in the build environment |
| PDF worker rule | Bundles the `pdfjs-dist` web worker as a static asset for client-side PDF parsing |

### Build Output

Running `npm run build` generates the `out/` directory with the following structure:

```
out/
├── index.html              # Root page
├── dashboard/
│   └── index.html          # Dashboard page
├── history/
│   └── index.html          # History page
├── login/
│   └── index.html          # Login page
├── signup/
│   └── index.html          # Signup page
├── upload/
│   └── index.html          # Upload page
├── _next/
│   └── static/             # JS, CSS, and static assets
└── static/
    └── worker/             # PDF.js web worker
```

---

## SPA Rewrite Configuration

The `vercel.json` file configures SPA (Single Page Application) rewrites for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/((?!_next|static|favicon.ico).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why This Is Needed

The application uses client-side navigation (state-based routing). When a user navigates directly to a URL like `/dashboard` or `/history/some-id`, the hosting provider needs to serve the appropriate HTML file. The rewrite rule ensures that:

1. Requests to `/_next/*` (JavaScript, CSS bundles) are served as-is.
2. Requests to `/static/*` (static assets like the PDF worker) are served as-is.
3. Requests to `/favicon.ico` are served as-is.
4. **All other requests** are rewritten to `/index.html`, allowing the client-side application to handle routing.

### Dynamic Route Handling

The document detail page uses a dynamic route pattern (`/history/[id]`). Since the static export cannot pre-render every possible document ID, the SPA rewrite ensures that requests like `/history/abc123` are served by the application and resolved client-side.

> **Note**: This `vercel.json` configuration is specific to Vercel. Other hosting providers require equivalent configuration (see [Alternative Hosting Providers](#alternative-hosting-providers)).

---

## CI/CD with GitHub Integration

### Automatic Deployments with Vercel + GitHub

Vercel provides built-in GitHub integration for continuous deployment:

1. **Connect your repository**: Link your GitHub repository to your Vercel project during initial setup.
2. **Production deployments**: Every push to the `main` (or `master`) branch triggers a production deployment automatically.
3. **Preview deployments**: Every pull request generates a unique preview deployment URL for testing changes before merging.
4. **Automatic rollbacks**: If a deployment fails, Vercel retains the previous production deployment.

### Setting Up GitHub Integration

1. Go to your Vercel project **Settings** → **Git**.
2. Ensure the repository is connected.
3. Configure the production branch (default: `main`).
4. Optionally configure ignored build steps or build filters.

### Recommended CI Workflow

For additional quality checks before deployment, add a GitHub Actions workflow:

1. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_NAME: ${{ vars.NEXT_PUBLIC_APP_NAME || 'Doc Upload & Extract' }}

      - name: Verify build output
        run: |
          test -d out || (echo "Build output directory 'out' not found" && exit 1)
          test -f out/index.html || (echo "index.html not found in build output" && exit 1)
```

2. This workflow runs on every push and pull request to `main`, ensuring:
   - Code passes ESLint checks (`npm run lint`)
   - The application builds successfully (`npm run build`)
   - The expected build output exists

### Branch Protection Rules

For production safety, configure GitHub branch protection on `main`:

1. Go to your repository **Settings** → **Branches** → **Branch protection rules**.
2. Add a rule for `main` with:
   - **Require status checks to pass before merging**: Enable and select the CI workflow.
   - **Require pull request reviews before merging**: Recommended for team projects.

---

## Alternative Hosting Providers

### Netlify

1. Build the application:

```bash
npm run build
```

2. Create a `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. Alternatively, create a `out/_redirects` file after building:

```
/*    /index.html   200
```

4. Deploy via the Netlify CLI or connect your GitHub repository in the Netlify dashboard.

### GitHub Pages

1. Build the application:

```bash
npm run build
```

2. Add a `out/.nojekyll` file to prevent Jekyll processing:

```bash
touch out/.nojekyll
```

3. Create a `out/404.html` that redirects to `index.html` for SPA routing:

```bash
cp out/index.html out/404.html
```

4. Deploy the `out/` directory to the `gh-pages` branch using a tool like `gh-pages`:

```bash
npx gh-pages -d out --dotfiles
```

> **Note**: GitHub Pages does not support true SPA rewrites. The `404.html` fallback approach works but may cause a brief 404 status code before the client-side router takes over.

### AWS S3 + CloudFront

1. Build the application:

```bash
npm run build
```

2. Create an S3 bucket with static website hosting enabled.

3. Upload the contents of the `out/` directory to the S3 bucket.

4. Configure the S3 bucket's **Error document** to `index.html` for SPA routing.

5. Create a CloudFront distribution pointing to the S3 bucket:
   - Set the **Default root object** to `index.html`.
   - Configure a custom error response: HTTP 403/404 → `/index.html` with 200 status code.

6. Point your domain to the CloudFront distribution.

---

## Troubleshooting

### Build Fails with "canvas" Module Error

**Symptom**: Build error referencing the `canvas` module from `pdfjs-dist`.

**Solution**: Ensure `next.config.js` includes the canvas alias:

```js
webpack: (config) => {
  config.resolve.alias.canvas = false;
  // ...
  return config;
},
```

This prevents Node.js from trying to resolve the optional `canvas` dependency that `pdfjs-dist` references but does not require in browser environments.

### PDF Worker Not Loading

**Symptom**: PDF text extraction fails with worker-related errors.

**Solution**: Verify the webpack rule in `next.config.js` is correctly bundling the PDF worker:

```js
config.module.rules.push({
  test: /pdf\.worker\.(min\.)?mjs$/,
  type: 'asset/resource',
  generator: {
    filename: 'static/worker/[hash][ext][query]',
  },
});
```

Also ensure that `pdfjs-dist` is installed:

```bash
npm install pdfjs-dist
```

### Routes Return 404 on Refresh

**Symptom**: Navigating directly to `/dashboard`, `/upload`, or `/history/[id]` returns a 404 error.

**Solution**: Configure SPA rewrites on your hosting provider:

- **Vercel**: Ensure `vercel.json` contains the rewrite rule (included in the repository).
- **Netlify**: Add a `_redirects` file or `netlify.toml` with redirect rules.
- **GitHub Pages**: Copy `index.html` to `404.html`.
- **AWS S3/CloudFront**: Configure custom error responses to serve `index.html`.

### Environment Variables Not Applied

**Symptom**: The application displays the default app name instead of the configured value.

**Solution**:

1. Ensure the variable is prefixed with `NEXT_PUBLIC_` (required for client-side access in Next.js).
2. Environment variables are embedded at **build time**, not runtime. After changing a variable, you must rebuild and redeploy.
3. Verify the variable is set in the correct environment (Production, Preview, Development) in your hosting provider's dashboard.

### localStorage Quota Exceeded

**Symptom**: Document uploads fail with a "Storage quota exceeded" error.

**Solution**: The application stores all document data (including extracted text) in `localStorage`, which typically has a 5–10MB limit per origin. To free up space:

1. Navigate to the **History** page.
2. Delete documents you no longer need using the individual delete buttons or the **Delete All** button.
3. Alternatively, clear site data from your browser's developer tools: **Application** → **Storage** → **Clear site data**.

### Build Output Directory Missing

**Symptom**: After running `npm run build`, the `out/` directory does not exist.

**Solution**: Ensure `next.config.js` includes `output: 'export'`. Without this setting, Next.js produces a server-side build instead of a static export.

### Deployment Succeeds but Pages Are Blank

**Symptom**: The deployed site loads but shows a blank white page.

**Solution**:

1. Open the browser developer console and check for JavaScript errors.
2. Verify that the base path is correct — the application assumes deployment at the root (`/`). If deploying to a subpath (e.g., `https://example.com/app/`), you will need to configure `basePath` in `next.config.js`.
3. Ensure all static assets (`_next/`, `static/`) are being served correctly by your hosting provider.

### CORS Issues with PDF Worker

**Symptom**: PDF extraction fails with CORS-related errors in the browser console.

**Solution**: Ensure your hosting provider serves the PDF worker file (`static/worker/*.mjs`) with the correct `Content-Type` header (`application/javascript` or `text/javascript`). Some providers may require explicit MIME type configuration for `.mjs` files.