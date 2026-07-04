-- Basic analytics: page views, brochure download log, contact inquiries

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_created_idx on public.page_views (path, created_at desc);

create table if not exists public.brochure_download_events (
  id uuid primary key default gen_random_uuid(),
  brochure_id uuid not null references public.brochures (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists brochure_download_events_created_at_idx
  on public.brochure_download_events (created_at desc);

create index if not exists brochure_download_events_brochure_idx
  on public.brochure_download_events (brochure_id, created_at desc);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

alter table public.page_views enable row level security;
alter table public.brochure_download_events enable row level security;
alter table public.inquiries enable row level security;

-- Service role (admin API) only; public writes go through Next.js API routes.
