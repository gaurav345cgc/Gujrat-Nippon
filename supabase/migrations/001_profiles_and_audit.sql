-- Run in Supabase SQL Editor (Dashboard → SQL) or via Supabase CLI

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'EDITOR' check (role in ('ADMIN', 'EDITOR')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  ip text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN' and status = 'ACTIVE'
  );
$$;

-- Profiles: users read own row; admins read/update all
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin());

-- Audit: authenticated users can insert; admins can read
create policy "audit_insert_authenticated"
  on public.audit_logs for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "audit_select_admin"
  on public.audit_logs for select
  using (public.is_admin());
