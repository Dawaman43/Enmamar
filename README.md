# Enmamar — DSA Learning Assistant (MVP APIs)

This repo scaffolds a Next.js 15 (App Router) TypeScript project with Supabase and Gemini API integration focused on server APIs for an MVP.

## Tech
- Next.js 15 (App Router, TypeScript)
- Supabase (Auth, Database)
- Google Gemini (via @google/generative-ai)
- Tailwind CSS
- Zod for validation

## Setup
1. Copy `.env.local.example` to `.env.local` and fill values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
2. Install dependencies and run the dev server.

## API Endpoints (MVP)
- POST `/api/ai/explain` — body: `{ topic: string, level?: 'beginner'|'intermediate'|'advanced' }`
- POST `/api/ai/hint` — body: `{ problem: string, context?: string }`
- POST `/api/ai/recommend` — body: `{ history: string[] }`
- POST `/api/ai/quiz` — body: `{ topic: string, count?: number }`
- GET `/api/topics`
- GET `/api/progress` — returns current user progress
- POST `/api/progress` — upsert: `{ topic_id: string, status: 'not_started'|'in_progress'|'completed', score?: number }`

AI routes log to `ai_logs` in Supabase.

## Suggested Tables
- users(user_id uuid pk, name text, email text, joined_at timestamptz)
- topics(topic_id uuid pk, title text, description text, difficulty text)
- progress(user_id uuid fk, topic_id uuid fk, status text, score int)
- ai_logs(id uuid pk, user_id uuid fk null, prompt text, response text, created_at timestamptz default now())
- quizzes(quiz_id uuid pk, topic_id uuid fk, question text, answer text, explanation text)

Enable RLS and policies to restrict to `auth.uid() = user_id`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`

Notes: Do not commit secrets. Use Vercel env vars in production.