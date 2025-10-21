-- Supabase schema for Enmamar MVP
-- Run in Supabase SQL editor

create table if not exists public.users (
  user_id uuid primary key default auth.uid(),
  name text,
  email text unique,
  joined_at timestamptz default now()
);

create table if not exists public.topics (
  topic_id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')) default 'beginner'
);

create table if not exists public.categories (
  category_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text
);

create table if not exists public.topic_categories (
  topic_id uuid not null references public.topics(topic_id) on delete cascade,
  category_id uuid not null references public.categories(category_id) on delete cascade,
  primary key (topic_id, category_id)
);

create table if not exists public.progress (
  user_id uuid not null references public.users(user_id) on delete cascade,
  topic_id uuid not null references public.topics(topic_id) on delete cascade,
  status text not null check (status in ('not_started','in_progress','completed')) default 'not_started',
  score int check (score between 0 and 100),
  updated_at timestamptz default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(user_id) on delete set null,
  prompt text,
  response text,
  created_at timestamptz default now()
);

create table if not exists public.quizzes (
  quiz_id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(topic_id) on delete cascade,
  question text not null,
  answer text,
  explanation text
);

-- Courses
create table if not exists public.courses (
  course_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  level text check (level in ('beginner','intermediate','advanced')) default 'beginner',
  created_at timestamptz default now()
);

create table if not exists public.course_topics (
  course_id uuid not null references public.courses(course_id) on delete cascade,
  topic_id uuid not null references public.topics(topic_id) on delete cascade,
  order_index int default 0,
  primary key (course_id, topic_id)
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.progress enable row level security;
alter table public.ai_logs enable row level security;
-- Courses are public-readable; RLS not enabled for simplicity

-- Categories are global, no RLS required

-- Relationships between topics and categories are derived data, no RLS required

-- Policies
create policy if not exists "Users can read/update own profile" on public.users
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Read own progress" on public.progress
  for select using (auth.uid() = user_id);
create policy if not exists "Upsert own progress" on public.progress
  for insert with check (auth.uid() = user_id);
create policy if not exists "Update own progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Insert logs" on public.ai_logs
  for insert with check (true);
create policy if not exists "Read own logs" on public.ai_logs
  for select using (user_id is null or auth.uid() = user_id);
