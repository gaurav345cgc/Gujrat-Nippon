-- Run after 001_profiles_and_audit.sql

create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip text,
  success boolean not null default false,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists login_attempts_email_created_idx
  on public.login_attempts (email, created_at desc);

create index if not exists login_attempts_ip_created_idx
  on public.login_attempts (ip, created_at desc)
  where ip is not null;

alter table public.login_attempts enable row level security;

-- No policies: only service role (server) reads/writes this table.