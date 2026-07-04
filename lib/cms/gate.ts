import { getCachedPublishedPage } from '@/lib/cms/cache/queries';
import { getFallbackPage } from '@/lib/cms/payloads';
import type { PageSlug, PublishedPageSnapshot } from '@/lib/cms/types';

/** Published CMS content or hardcoded fallback — safe for public rendering while pages stay draft. */
export async function resolvePublicPage(slug: PageSlug): Promise<PublishedPageSnapshot> {
  const published = await getCachedPublishedPage(slug);
  return published ?? getFallbackPage(slug);
}
