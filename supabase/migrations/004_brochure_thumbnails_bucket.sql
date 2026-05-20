-- Public bucket for brochure card thumbnails (images only).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brochure-thumbnails',
  'brochure-thumbnails',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can read thumbnail objects (public marketing site).
create policy "brochure_thumbnails_select_public"
  on storage.objects for select
  using (bucket_id = 'brochure-thumbnails');

create policy "brochure_thumbnails_admin_all"
  on storage.objects for all
  using (bucket_id = 'brochure-thumbnails' and public.is_admin())
  with check (bucket_id = 'brochure-thumbnails' and public.is_admin());

create policy "brochure_thumbnails_editor_write"
  on storage.objects for insert
  with check (
    bucket_id = 'brochure-thumbnails'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "brochure_thumbnails_editor_update"
  on storage.objects for update
  using (
    bucket_id = 'brochure-thumbnails'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );

create policy "brochure_thumbnails_editor_delete"
  on storage.objects for delete
  using (
    bucket_id = 'brochure-thumbnails'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'ACTIVE'
        and p.role in ('ADMIN', 'EDITOR')
    )
  );
