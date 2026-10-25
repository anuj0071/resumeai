# ResumeAI — AI Resume Builder & ATS Checker

A beginner-friendly BCA project built with React, TypeScript, Vite, and Tailwind CSS. Create and edit resumes, switch between three templates, export a print-ready PDF, and compare a resume with a job description using a transparent, rule-based estimate.

## Features

- Public landing page with five swipeable resume-template previews.
- Separate signed-in user and admin workspaces, with admin-only dashboard and About page.
- Supabase email/password sign-up and authentication; the configured admin account is `ankurempire008@gmail.com`.
- Resume editor with personal details, education, skills, projects, experience, certifications, achievements, and links.
- Five resume themes: Classic, Modern, Minimal, Professional, and Creative.
- Live preview and browser-based PDF export. Choose **Save as PDF** in the print dialog.
- Local draft autosave, resume list, delete/download actions, and ATS history.
- PDF text extraction and DOCX text extraction happen in the browser. Files are not uploaded.
- ATS estimate: 70% keyword overlap, 20% presence of education/skills/projects/experience, and 10% resume text detail.
- Rule-based writing refinements and job-description keyword suggestions; no qualification or experience claims are generated.
- Resume drafts and ATS history are saved in browser local storage, isolated by signed-in account.
- The public Supabase anon key is used for browser authentication; never expose a Supabase service-role key.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Create a Supabase project, copy `.env.example` to `.env.local`, and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **Project Settings → API**. These are the public project URL and anon/publishable key. Never put a service-role key in a `VITE_` variable. Restart Vite after changing environment variables.

In Supabase **Authentication → URL Configuration**, set the local Site URL to `http://localhost:5173` and add `http://localhost:5173/auth` as a redirect URL. Open the local URL printed by Vite. Drafts and analysis history are saved in that browser's local storage, scoped to the signed-in account.

To grant the admin role, create and confirm the account using `ankurempire008@gmail.com`, then run [`supabase/admin-role.sql`](./supabase/admin-role.sql) in the Supabase SQL Editor. Sign out and sign back in so the refreshed JWT contains the admin role. The admin email alone is not enough to enter the admin interface.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## PDF export

Select **Download PDF** in the builder. The browser print dialog opens with the resume preview formatted for A4 printing; choose **Save as PDF** to download it. This avoids uploading resume content to a conversion service. The dashboard's download action opens the same flow for the selected draft.

## ATS estimate: what it means

The score is an educational estimate, **not a real employer ATS score or hiring prediction**. The checker extracts readable text from a PDF or DOCX file, ranks recurring non-stop-word terms in the job description, and looks for those terms in the resume. The score combines:

1. Keyword overlap: 70% of the score.
2. Presence of education, skills, projects, and experience indicators: 20%.
3. Resume text detail, capped at 1,200 characters: 10%.

Missing terms are suggestions only. Add a term only when it accurately describes the applicant. A scanned image-only PDF may have no selectable text; use a text-based PDF or DOCX instead. Uploads are limited to 8 MB.

## Authentication, roles, and privacy

Supabase Auth handles account sign-up, email confirmation, and sign-in. The admin workspace requires both the configured admin email and a trusted `app_metadata.role = "admin"` claim; regular signed-in users see the resume tools without the admin dashboard or About page. A user cannot assign their own `app_metadata` role from the browser. The included SQL updates only the admin account's metadata.

Drafts and ATS history stay in browser local storage and use per-account keys. Uploaded files are read in memory by the browser. The app does not upload resumes or store them in Supabase. This is a client-only application: route and interface gating is not a substitute for server-side authorization if protected backend APIs or shared user data are added later. Never put service-role credentials in browser-exposed `VITE_` variables. No AI provider is needed for the included local writing tools.

## Deploy

Build with `npm run build`, then publish the `dist/` directory using Vercel. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel project's environment variables for Production, Preview, and Development, then redeploy. In Supabase **Authentication → URL Configuration**, set the production Site URL and add the production `/auth` URL to the allowed redirects. Vercel's SPA rewrite is in `vercel.json`.

## BCA project demonstration / viva

Suggested demo flow:

1. Open the landing page and explain the responsive feature sections.
2. Browse the five resume templates and select one to sign up or sign in.
3. Create a user account, then fill in personal details, education, skills, and projects in the builder.
4. Review the live preview and choose **Download PDF → Save as PDF**.
5. Sign in as the configured admin to access the admin dashboard and About page.
6. Open **ATS Checker**, upload a text-based resume PDF/DOCX, paste a job description, and analyze it.

The sample resume is clearly presented as starter content; replace it with truthful personal information before using it for applications. Authentication and a configured Supabase project are required for sign-in and role-aware routes; the template gallery remains public.
