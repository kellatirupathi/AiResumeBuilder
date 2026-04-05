# NxtResume

NxtResume is a full-stack AI resume builder for creating ATS-friendly resumes, exporting polished PDFs, generating public share links, and publishing developer portfolios from the same profile data.

## Overview

This repository contains the complete NxtResume application:

- A React + Vite frontend for profile management, resume editing, AI-assisted writing, ATS analysis, portfolio generation, and admin screens.
- An Express + MongoDB backend for authentication, resume storage, PDF generation, Google Drive uploads, GitHub Pages portfolio publishing, notifications, and admin operations.

The product is built around one reusable user profile. That profile powers:

1. Resume creation and editing
2. AI-generated summaries, experience bullets, and project bullets
3. ATS scoring against real job descriptions
4. PDF download and public sharing
5. Portfolio generation and publishing

## Core Features

- Email/password auth, Google login, session-based user flow, password reset, and profile management
- Resume dashboard with create, edit, clone, version save, and revert support
- Multiple resume templates with frontend preview templates and matching backend PDF templates
- AI-assisted summary, experience, and project content generation using configurable LLM providers
- ATS checker for saved resumes or uploaded PDFs against pasted job descriptions
- PDF generation through Handlebars HTML templates and PDFSpark
- Public resume sharing and Google Drive upload/update flow
- Portfolio generation published to GitHub Pages from backend profile data
- Admin panel for users, resumes, admin accounts, stats, notifications, reminders, and NIAT ID management
- Email notifications and reminder workflows

## Product Flow

1. Complete the profile with personal info, education, experience, projects, skills, and certifications.
2. Create a resume tailored to a target role.
3. Use AI tools to generate or improve content where needed.
4. Run the ATS checker with a real job description.
5. Download the resume as PDF or generate a public share link.
6. Generate a portfolio from the saved profile when needed.

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- TanStack Query
- Framer Motion
- `pdfjs-dist` for PDF text extraction

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Google APIs
- Octokit
- Brevo email API

### Integrations

- OpenAI
- Mistral
- Google OAuth
- Google Drive
- GitHub Pages
- PDFSpark

## Repository Structure

```text
AiResumeBuilder/
|-- Frontend/                        # React + Vite app
|   |-- src/pages/                   # User, ATS, admin, docs, dashboard screens
|   |-- src/Services/                # API clients and AI service integration
|   `-- src/pages/dashboard/edit-resume/components/templates/
|                                    # On-screen resume preview templates
|-- Backend/                         # Express API
|   |-- src/controller/              # Route handlers
|   |-- src/routes/                  # User, resume, pdf, admin, cron routes
|   |-- src/services/                # PDF, Drive, GitHub, email services
|   `-- src/templates/               # Handlebars templates used for PDF output
`-- README.md
```

## How Rendering Works

NxtResume uses two rendering layers for resumes:

- Frontend JSX templates for live editing and preview
- Backend Handlebars templates for final PDF generation

When a user downloads a PDF:

1. The frontend requests the backend PDF endpoint.
2. The backend loads the matching Handlebars template from `Backend/src/templates`.
3. Resume data is injected with theme-aware styling helpers.
4. The generated HTML is sent to PDFSpark.
5. The PDF is returned to the user or uploaded to Google Drive for shareable access.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database
- Google OAuth credentials
- Google Drive service account credentials
- OpenAI and/or Mistral API access if you want AI features enabled
- PDFSpark endpoint access for PDF generation

### Install Dependencies

```bash
cd Backend
npm install
```

```bash
cd Frontend
npm install
```

### Configure Environment Variables

Create local `.env` files in both `Backend/` and `Frontend/`. Do not commit populated secrets.

#### `Backend/.env`

```env
MONGODB_URI=
PORT=5001
NODE_ENV=Dev
ALLOWED_SITE=http://localhost:5173

JWT_SECRET_KEY=
AUTH_SESSION_DAYS=7
USER_JWT_EXPIRES_IN=7d
ADMIN_JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=

BREVO_API_KEY=
FROM_NAME=NxtResume
FROM_EMAIL=

PDFSPARK_API_URL=https://pdfspark.dev/api/v1/pdf/from-html
PDFSPARK_TIMEOUT_MS=30000

GOOGLE_CREDENTIALS_BASE64=
GOOGLE_APPLICATION_CREDENTIALS=
GOOGLE_DRIVE_FOLDER_ID=

GITHUB_PAT=
GITHUB_USERNAME=
GITHUB_PORTFOLIO_REPO=

CRON_SECRET=
```

#### `Frontend/.env`

```env
VITE_APP_URL=http://localhost:5001/
VITE_PUBLIC_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=

VITE_OPENAI_API_KEY=
VITE_OPENAI_MODEL=gpt-4.1-mini
VITE_OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions

VITE_MISTRAL_API_KEY=
VITE_MISTRAL_MODEL=mistral-medium-latest
VITE_MISTRAL_ENDPOINT=https://api.mistral.ai/v1/chat/completions

VITE_STRAPI_API_KEY=
VITE_BASE_URL=
```

Notes:

- `VITE_APP_URL` is used by the Vite dev proxy to forward `/api` requests to the backend.
- The backend expects `ALLOWED_SITE` to match the frontend origin for CORS and auth cookies.
- For Google Drive auth, use either `GOOGLE_CREDENTIALS_BASE64` or `GOOGLE_APPLICATION_CREDENTIALS`.
- `VITE_STRAPI_API_KEY` and `VITE_BASE_URL` are only needed if you still rely on the legacy `Frontend/src/Services/GlobalApi.js` flow.

### Run the App

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## Available Scripts

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

### Backend

- `npm run dev` - start the Express server with nodemon
- `npm start` - start the production server
- `npm run job:send-reminders` - run the reminder job manually
- `npm run backfill` - backfill missing Drive links

## API Surface

Main backend route groups:

- `/api/users` - auth, session, profile, password reset, portfolio generation, notification preferences
- `/api/resumes` - create, update, delete, clone, versioning, public resume view tracking, Drive link generation
- `/api/pdf` - authenticated PDF download and public PDF access
- `/api/admin` - admin auth, stats, user management, resume management, notifications, reminders
- `/api/niat-ids` - protected NIAT ID management
- `/api/cron` - scheduled-job endpoints protected by a cron secret

## Important Application Notes

- Resume preview templates in the frontend and PDF templates in the backend are separate files. If a design changes in the preview, the matching Handlebars template should usually be updated too.
- ATS analysis is designed around real job description text, not just keyword lists or links.
- Portfolio generation publishes user-specific HTML to a GitHub Pages repository from the backend.
- Public resume sharing depends on generating a PDF and uploading or updating it in Google Drive.
- The app uses cookie-based auth, so frontend and backend origin settings must stay aligned.

## Suggested Deployment Setup

- Deploy the frontend and backend separately or behind the same domain with `/api` routed to the backend.
- Host MongoDB remotely.
- Store all secrets in your deployment platform, not in committed `.env` files.
- Configure GitHub, Google Drive, Brevo, and PDFSpark before enabling the full production flow.

## Status

This repository is a working full-stack product, not a starter template. The codebase already includes:

- end-user resume workflows
- ATS and AI features
- admin management screens
- PDF and share-link generation
- portfolio publishing support

If you plan to open-source or productionize it further, the next practical step is to add sanitized `.env.example` files for both the frontend and backend and rotate any previously exposed credentials.
