import { revalidateTag } from 'next/cache';
import { CMS_CACHE_TAGS } from '@/lib/cms/cache/tags';
import type { PageSlug } from '@/lib/cms/types';

export function invalidatePagesModule(slug?: PageSlug): void {
  const tags: string[] = [CMS_CACHE_TAGS.pagesList];
  if (slug) {
    tags.push(CMS_CACHE_TAGS.page(slug), CMS_CACHE_TAGS.seo(slug));
    if (slug === 'contact') {
      tags.push(CMS_CACHE_TAGS.layoutFooter);
    }
  }

  const unique = [...new Set(tags)];
  try {
    for (const tag of unique) {
      revalidateTag(tag, 'max');
    }
  } catch {
    // Outside request context (scripts, etc.).
  }
}
