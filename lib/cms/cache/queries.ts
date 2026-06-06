import { unstable_cache } from 'next/cache';
import { CMS_CACHE_TTL } from '@/lib/cms/cache/config';
import { CMS_CACHE_TAGS } from '@/lib/cms/cache/tags';
import {
  getPublishedContactInfo,
  getPublishedPage,
  getPublishedPagesForSitemap,
  getPublishedSeo,
} from '@/lib/cms/public';
import type { ContactInfoPayload, PageSlug, PublishedPageSnapshot, SeoPayload } from '@/lib/cms/types';

export async function getCachedPublishedPage(
  slug: PageSlug
): Promise<PublishedPageSnapshot | null> {
  const cached = unstable_cache(
    async () => getPublishedPage(slug),
    ['cms-published-page', slug],
    { tags: [CMS_CACHE_TAGS.page(slug)], revalidate: CMS_CACHE_TTL.page }
  );
  return cached();
}

export async function getCachedPublishedSeo(slug: PageSlug): Promise<SeoPayload | null> {
  const cached = unstable_cache(
    async () => getPublishedSeo(slug),
    ['cms-published-seo', slug],
    { tags: [CMS_CACHE_TAGS.seo(slug)], revalidate: CMS_CACHE_TTL.seo }
  );
  return cached();
}

export async function getCachedPublishedContactInfo(): Promise<ContactInfoPayload | null> {
  const cached = unstable_cache(
    async () => getPublishedContactInfo(),
    ['cms-global-contact'],
    { tags: [CMS_CACHE_TAGS.layoutFooter], revalidate: CMS_CACHE_TTL.contact }
  );
  return cached();
}

export async function getCachedPublishedPagesForSitemap() {
  const cached = unstable_cache(
    async () => getPublishedPagesForSitemap(),
    ['cms-sitemap-pages'],
    { tags: [CMS_CACHE_TAGS.sitemap, CMS_CACHE_TAGS.pagesList], revalidate: CMS_CACHE_TTL.page }
  );
  return cached();
}
