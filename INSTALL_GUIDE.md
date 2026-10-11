# Pinly — Installation & Deployment Guide

This guide details step-by-step setup and deployment instructions for Pinly.

---

## 1. Prerequisites

- **Node.js:** v18.0.0 or higher
- **NPM:** v9.0.0 or higher
- **Modern Browser:** Chrome, Edge, Safari, Firefox

---

## 2. Environment Variables Setup

Pinly includes a `.env.example` blueprint in the project root:

```ini
# GEMINI_API_KEY: Required for Live Voice Review Assistant and AI summaries
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Public URL where this applet is hosted
APP_URL="https://your-domain.com"
```

To configure:
1. Create a `.env` file in the project root.
2. Populate the required keys without committing secrets to version control.

---

## 3. Local Development

Run the reproducible setup script to test configuration:

```bash
# Run one-command setup verification
npm run setup

# Launch development server
npm run dev
```

The application will be accessible at: `http://localhost:3000`.

---

## 4. Verification & Testing

Verify that all TypeScript types and code linting checks pass cleanly:

```bash
# Run type check and lint
npm run lint

# Compile and bundle build
npm run build
```

---

## 5. Production Deployment

### Option A: Vercel / Cloud Run / Netlify
1. Connect the Git repository.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variables (`GEMINI_API_KEY`, `APP_URL`).

### Option B: Node.js Server
For standalone deployments running the built assets:
```bash
npm run build
npm run preview
```
