import type { MetadataRoute } from 'next';
import { getCachedPublishedPagesForSitemap } from '@/lib/cms/cache/queries';
import { buildSitemapEntries } from '@/lib/cms/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getCachedPublishedPagesForSitemap();
  return buildSitemapEntries(pages);
}
