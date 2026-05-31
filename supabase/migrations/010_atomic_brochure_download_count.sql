-- Keep public brochure download counters accurate under concurrent requests.

create or replace function public.increment_brochure_download_count(p_brochure_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.brochures
  set
    download_count = download_count + 1,
    updated_at = now()
  where id = p_brochure_id;
$$;
