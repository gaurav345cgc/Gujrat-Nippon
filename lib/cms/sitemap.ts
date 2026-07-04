import type { MetadataRoute } from 'next';
import { pathToAbsoluteUrl } from '@/lib/cms/site-url';

export type SitemapPageEntry = {
  path: string;
  published_at: string;
  updated_at: string;
};

function sitemapPriority(path: string): number {
  if (path === '/') return 1;
  if (path === '/products' || path === '/industries') return 0.9;
  if (path === '/contact' || path === '/about') return 0.8;
  if (path.startsWith('/privacy') || path.startsWith('/terms') || path.startsWith('/cookies')) {
    return 0.2;
  }
  return 0.5;
}

function sitemapChangeFrequency(path: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (path === '/') return 'weekly';
  if (path === '/products') return 'weekly';
  if (path === '/certifications') return 'yearly';
  return 'monthly';
}

export function buildSitemapEntries(pages: SitemapPageEntry[]): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: pathToAbsoluteUrl(page.path),
    lastModified: new Date(page.updated_at || page.published_at),
    changeFrequency: sitemapChangeFrequency(page.path),
    priority: sitemapPriority(page.path),
  }));
}
