-- Run if 005 was applied with slug / use_in_public_faq columns.

drop index if exists public.faqs_slug_active_unique;

alter table public.faq_revisions drop column if exists slug;
alter table public.faq_revisions drop column if exists use_in_public_faq;

alter table public.faqs drop column if exists slug;
alter table public.faqs drop column if exists use_in_public_faq;
