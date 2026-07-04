-- Run after 001 and 002. Create storage bucket "brochures" in Dashboard if this insert fails.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brochures',
  'brochures',
  false,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.brochures (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null default 'Technical',
  thumbnail_url text,
  published boolean not null default false,
  sort_order int not null default 0,
  download_count int not null default 0,
  current_version_id uuid,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brochure_versions (
  id uuid primary key default gen_random_uuid(),
  brochure_id uuid not null references public.brochures (id) on delete cascade,
  storage_key text not null unique,
  original_filename text not null,
  mime_type text not null default 'application/pdf',
  file_size_bytes bigint not null,
  checksum_sha256 text,
  version_no int not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (brochure_id, version_no)
);

alter table public.brochures
  add constraint brochures_current_version_fkey
  foreign key (current_version_id) references public.brochure_versions (id) on delete set null;

create index if not exists brochures_published_sort_idx
  on public.brochures (published, sort_order, title);

alter table public.brochures enable row level security;
alter table public.brochure_versions enable row level security;

-- Public read published brochures (metadata only)
create policy "brochures_select_published"
  on public.brochures for select
  using (published = true);

create policy "brochure_versions_select_published"
  on public.brochure_versions for select
  using (
    exists (
      select 1 from public.brochures b
      where b.id = brochure_id and b.published = true
    )
  );

-- Admins full access via is_admin()
create policy "brochures_admin_all"
  on public.brochures for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "brochure_versions_admin_all"
  on public.brochure_versions for all
  using (public.is_admin())
  with check (public.is_admin());

-- Editors: read all, insert/update brochures (no delete)
create policy "brochures_editor_select"
  on public.brochures for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "brochures_editor_write"
  on public.brochures for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "brochures_editor_update"
  on public.brochures for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "brochure_versions_editor_all"
  on public.brochure_versions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );
