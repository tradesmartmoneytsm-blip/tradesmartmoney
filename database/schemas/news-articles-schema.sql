-- ============================================================
-- news_articles: cached India market news for real-time feed
-- ============================================================
-- Ingested by /api/cron/update-news and on-demand by
-- /api/news-feed (when the cache is stale).
-- Realtime INSERTs are streamed to the /news page client.
-- ============================================================

create table if not exists public.news_articles (
  id            uuid primary key default gen_random_uuid(),
  source_url    text unique not null,            -- dedupe key (original article link)
  title         text not null,
  summary       text,
  category      text not null default 'Markets', -- Markets | Results | Companies | Policy
  source        text not null,                   -- display name, e.g. 'Economic Times Markets'
  impact        text not null default 'Neutral', -- Positive | Negative | Neutral
  symbols       text[] not null default '{}',    -- tagged NSE symbols, e.g. {RELIANCE,TCS}
  published_at  timestamptz not null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_news_articles_published
  on public.news_articles (published_at desc);
create index if not exists idx_news_articles_symbols
  on public.news_articles using gin (symbols);

-- Row Level Security: public read, writes only via service role
alter table public.news_articles enable row level security;

drop policy if exists "Public read news articles" on public.news_articles;
create policy "Public read news articles"
  on public.news_articles
  for select
  to anon, authenticated
  using (true);

-- Enable realtime replication for INSERT events
do $$
begin
  alter publication supabase_realtime add table public.news_articles;
exception
  when duplicate_object then null; -- already added
  when others then null;
end $$;
