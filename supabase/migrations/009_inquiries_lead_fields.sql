-- Normalize public contact/chatbot submissions into one lead-friendly inquiries table.

alter table public.inquiries
  add column if not exists source text not null default 'contact',
  add column if not exists company text,
  add column if not exists subject text not null default 'General inquiry',
  add column if not exists updated_at timestamptz not null default now();

update public.inquiries
set
  source = coalesce(nullif(source, ''), 'contact'),
  subject = coalesce(nullif(subject, ''), 'General inquiry'),
  status = case when status = 'read' then 'contacted' else status end,
  updated_at = coalesce(updated_at, created_at, now());

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_status_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries drop constraint inquiries_status_check;
  end if;
end $$;

alter table public.inquiries
  add constraint inquiries_status_check
  check (status in ('new', 'contacted', 'closed', 'spam', 'archived'));

alter table public.inquiries
  drop constraint if exists inquiries_source_check;

alter table public.inquiries
  add constraint inquiries_source_check
  check (source in ('contact', 'chatbot'));

create index if not exists inquiries_source_created_at_idx
  on public.inquiries (source, created_at desc);
