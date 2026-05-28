# HellScript AI

HellScript AI is a Next.js 15 hackathon project for understanding GitHub repositories faster with repository context, dashboard views, and AI-powered guidance.

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- OpenRouter-ready API route structure
- GitHub and Coral integration points

## Local setup

```bash
npm install
npm run dev
```

## Environment variables

Create `.env.local` from `.env.example` and set:

- `GITHUB_TOKEN`
- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL`
- `CORAL_API_KEY`

## Project structure

- `app/` route files and API routes
- `components/` reusable UI pieces
- `lib/` shared helpers and provider utilities
- `types/` shared TypeScript models
