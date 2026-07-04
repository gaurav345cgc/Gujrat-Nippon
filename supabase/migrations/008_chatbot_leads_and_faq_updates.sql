-- Add button label and URL to FAQs for the chatbot
alter table public.faqs
  add column if not exists button_label text,
  add column if not exists button_url text;

alter table public.faq_revisions
  add column if not exists button_label text,
  add column if not exists button_url text;

-- Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  message text,
  source text not null default 'chatbot',
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

create policy "leads_select_admin"
  on public.leads for select
  using (public.is_admin() or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    ));

create policy "leads_update_admin"
  on public.leads for update
  using (public.is_admin() or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    ));
