-- Run once in Supabase Dashboard → SQL Editor

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  url text not null unique,
  published_at timestamptz not null,
  source text not null,
  league text,
  created_at timestamptz not null default now()
);

create index if not exists news_articles_published_at_idx
  on public.news_articles (published_at desc);

create index if not exists news_articles_league_idx
  on public.news_articles (league);

alter table public.news_articles enable row level security;

drop policy if exists "Public read news" on public.news_articles;
create policy "Public read news"
  on public.news_articles
  for select
  to anon, authenticated
  using (true);

-- Writes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
