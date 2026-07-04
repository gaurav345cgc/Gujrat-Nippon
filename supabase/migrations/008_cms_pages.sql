-- Phase 1 CMS: predefined page content (pages, sections, SEO, revisions, publish logs).

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  path text not null unique,
  title text not null,
  template text not null check (
    template in (
      'home', 'about', 'products', 'industries', 'certifications',
      'careers', 'contact', 'legal'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pages_status_idx on public.pages (status);
create index if not exists pages_slug_idx on public.pages (slug);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  section_key text not null,
  section_type text not null check (
    section_type in ('hero', 'text', 'cta', 'contact_info', 'seo')
  ),
  payload_json jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create index if not exists page_sections_page_id_idx on public.page_sections (page_id);

create table if not exists public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null unique references public.pages (id) on delete cascade,
  seo_title text,
  meta_description text,
  canonical_url text,
  robots text not null default 'index,follow',
  og_title text,
  og_description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  snapshot_json jsonb not null,
  revision_note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists page_revisions_page_id_idx
  on public.page_revisions (page_id, created_at desc);

create table if not exists public.publish_logs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  published_by uuid references auth.users (id) on delete set null,
  published_at timestamptz not null default now(),
  paths_revalidated text[] not null default '{}',
  tags_revalidated text[] not null default '{}',
  status text not null check (status in ('success', 'partial', 'failed')),
  error_message text
);

create table if not exists public.site_settings (
  key text primary key,
  payload_json jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

-- updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists page_sections_set_updated_at on public.page_sections;
create trigger page_sections_set_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

drop trigger if exists seo_metadata_set_updated_at on public.seo_metadata;
create trigger seo_metadata_set_updated_at
  before update on public.seo_metadata
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.seo_metadata enable row level security;
alter table public.page_revisions enable row level security;
alter table public.publish_logs enable row level security;
alter table public.site_settings enable row level security;

-- Public read: published pages only
create policy "pages_select_published"
  on public.pages for select
  using (status = 'published');

create policy "page_sections_select_published"
  on public.page_sections for select
  using (
    exists (
      select 1 from public.pages p
      where p.id = page_id and p.status = 'published'
    )
  );

create policy "seo_metadata_select_published"
  on public.seo_metadata for select
  using (
    exists (
      select 1 from public.pages p
      where p.id = page_id and p.status = 'published'
    )
  );

-- Global contact readable when published (service role also used server-side)
create policy "site_settings_select_global_contact"
  on public.site_settings for select
  using (key = 'global_contact');

-- Admin/editor access for CMS tables (writes go through service role in admin API)
create policy "pages_editor_select"
  on public.pages for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "page_sections_editor_select"
  on public.page_sections for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "seo_metadata_editor_select"
  on public.seo_metadata for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "page_revisions_admin_select"
  on public.page_revisions for select
  using (public.is_admin());

create policy "page_revisions_editor_select"
  on public.page_revisions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "publish_logs_admin_select"
  on public.publish_logs for select
  using (public.is_admin());

create policy "site_settings_editor_select"
  on public.site_settings for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );
