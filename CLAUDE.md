# Project conventions

## Stack
Next.js (App Router), React, deployed on Vercel. Client-side only — no backend/server components yet.

## Conventions
- Components in PascalCase, one component per file
- Commit messages follow Conventional Commits (feat:, fix:, docs:, chore:)
- Keep components small and single-purpose

## Project rules learned (FE-03)
- AI-reported test completion is not proof — always ask to see actual test file output (pass/fail counts) before trusting that verification happened.
- New components must be explicitly wired into a page/route in the same prompt — never assume the AI will connect a component to where it's actually used.
- Form validation must be manually tested with at least one deliberately invalid input (bad email, empty field) before considering the feature done.
