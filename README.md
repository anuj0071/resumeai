# ResumeAI — AI Resume Builder & ATS Checker

A beginner-friendly BCA project built with React, TypeScript, Vite, and Tailwind CSS. Create and edit resumes, switch between three templates, export a print-ready PDF, and compare a resume with a job description using a transparent, rule-based estimate.

## Features

- Responsive homepage, dashboard, resume builder, ATS checker, and About page.
- Resume editor with personal details, education, skills, projects, experience, certifications, achievements, and links.
- Three resume themes: Classic, Modern, and Minimal.
- Live preview and browser-based PDF export. Choose **Save as PDF** in the print dialog.
- Local draft autosave, resume list, delete/download actions, and ATS history.
- PDF text extraction and DOCX text extraction happen in the browser. Files are not uploaded.
- ATS estimate: 70% keyword overlap, 20% presence of education/skills/projects/experience, and 10% resume text detail.
- Rule-based writing refinements and job-description keyword suggestions; no qualification or experience claims are generated.
- No sign-in, API key, or paid service is required.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Drafts and analysis history are saved in that browser's local storage. Use the browser's clear-site-data controls to remove saved project data.

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

## Privacy and optional integrations

The current application has no backend or authentication. Resume drafts and ATS history stay in browser local storage; uploaded files are read in memory by the browser. `.env.example` documents optional Supabase variable names for a future extension, but these settings are not consumed by this version. Do not place service-role credentials in browser-exposed `VITE_` variables. No AI provider is needed for the included local writing tools.

## Deploy

Build with `npm run build`, then publish the `dist/` directory using a static host such as Vercel, Netlify, or GitHub Pages. For client-side routing, configure the host to serve `index.html` for unknown paths. No environment variables are needed for the current feature set.

## BCA project demonstration / viva

Suggested demo flow:

1. Open the landing page and explain the responsive feature sections.
2. Open **Resume Builder**, edit the sample personal details, add a project, and switch template.
3. Review the live preview and choose **Download PDF → Save as PDF**.
4. Open **ATS Checker**, upload a text-based resume PDF/DOCX, paste a job description, and analyze it.
5. Explain matched/missing terms and the score weights displayed beside the estimate.
6. Refresh the browser and show the saved draft and ATS history on the dashboard.

The sample resume is clearly presented as starter content; replace it with truthful personal information before using it for applications.
