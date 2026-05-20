-- Phase 3 backend: FAQ source of truth (admin + future chatbot).

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  keywords text[] not null default '{}',
  language text not null default 'en' check (language in ('en', 'hi')),
  version int not null default 1,
  sort_order int not null default 0,
  is_active boolean not null default false,
  use_in_chatbot boolean not null default false,
  last_published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists faqs_question_active_unique
  on public.faqs (lower(trim(question)))
  where deleted_at is null;

create index if not exists faqs_admin_list_idx
  on public.faqs (deleted_at, sort_order, category);

create index if not exists faqs_chatbot_idx
  on public.faqs (is_active, use_in_chatbot, sort_order)
  where deleted_at is null and is_active = true and use_in_chatbot = true;

create table if not exists public.faq_revisions (
  id uuid primary key default gen_random_uuid(),
  faq_id uuid not null references public.faqs (id) on delete cascade,
  version int not null,
  question text not null,
  answer text not null,
  category text not null,
  keywords text[] not null default '{}',
  language text not null,
  is_active boolean not null,
  use_in_chatbot boolean not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (faq_id, version)
);

alter table public.faqs enable row level security;
alter table public.faq_revisions enable row level security;

create policy "faqs_admin_all"
  on public.faqs for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "faqs_editor_select"
  on public.faqs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "faqs_editor_insert"
  on public.faqs for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "faqs_editor_update"
  on public.faqs for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "faq_revisions_admin_all"
  on public.faq_revisions for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "faq_revisions_editor_select"
  on public.faq_revisions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "faq_revisions_editor_insert"
  on public.faq_revisions for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );
