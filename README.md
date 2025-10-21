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
   - `SUPABASE_SERVICE_ROLE_KEY` _(optional, lets the app auto-confirm emails so users can log in immediately)_
   - `GEMINI_API_KEY`
2. Install dependencies and run the dev server.
   - Optional: set `ADMIN_TOKEN` in `.env.local` to enable seeding endpoint

## Seed data (recommended)

This project includes admin-only endpoints to seed topics (with categories) and courses so the UI has data to display.

1. Set an admin token in your env and restart the dev server

- In `.env.local`, add a string token (any value you choose):
  - `ADMIN_TOKEN=your-secret-token`
- Restart the dev server so the env is picked up.

2. Seed topics and categories

- PowerShell:

```
curl -X POST http://localhost:3000/api/admin/seed-topics -H "Authorization: Bearer $env:ADMIN_TOKEN"
```

3. Seed courses and link them to topics (by title)

- PowerShell:

```
curl -X POST http://localhost:3000/api/admin/seed-courses -H "Authorization: Bearer $env:ADMIN_TOKEN"
```

4. Verify

- List topics (should return many):

```
curl http://localhost:3000/api/topics
```

- List courses (with topics ordered):

```
curl http://localhost:3000/api/courses
```

Notes:

- The built-in seed endpoints match the current database schema under `db/schema.sql`.
- If you used a different SQL seed elsewhere (with columns such as `subject`, `kind`, or tables like `lessons`, `tags`), it will not match this schema and may fail the transaction; please prefer the endpoints above or adapt your SQL to the schema here.
- After seeding, pages to try:
  - `/topics` (grouped under categories; uncategorized topics show in “General Topics”)
  - `/courses` and `/courses/[id]`

## API Endpoints (MVP)

- POST `/api/ai/explain` — body: `{ topic: string, level?: 'beginner'|'intermediate'|'advanced' }`
- POST `/api/ai/hint` — body: `{ problem: string, context?: string }`
- POST `/api/ai/recommend` — body: `{ history: string[] }`
- POST `/api/ai/quiz` — body: `{ topic: string, count?: number }`
- GET `/api/topics`
- GET `/api/progress` — returns current user progress
- POST `/api/progress` — upsert: `{ topic_id: string, status: 'not_started'|'in_progress'|'completed', score?: number }`
- POST `/api/admin/seed-topics` — insert ~25 topics; header: `Authorization: Bearer ${ADMIN_TOKEN}`

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

Extras:

- Practice IDE at `/practice` runs JavaScript inside a sandboxed iframe. Intended for quick algorithm prototyping.
- Seed topics (PowerShell):
  - `curl -X POST http://localhost:3000/api/admin/seed-topics -H "Authorization: Bearer $env:ADMIN_TOKEN"`
