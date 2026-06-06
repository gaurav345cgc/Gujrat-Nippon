import { createAdminClient } from '@/lib/supabase/admin';
import type {
  ContactInfoPayload,
  PageSlug,
  PublishedPageSnapshot,
  SectionPayload,
  SeoPayload,
} from '@/lib/cms/types';
import { PAGE_REGISTRY } from '@/lib/cms/constants';
import { isIndexableRobots } from '@/lib/cms/seo-baseline';
import { getFallbackContactInfo, getFallbackPage, getFallbackSeo } from '@/lib/cms/payloads';

const PAGE_COLUMNS =
  'id, slug, path, title, template, status, published_at, created_by, updated_by, created_at, updated_at';

const SECTION_COLUMNS =
  'id, page_id, section_key, section_type, payload_json, sort_order, is_active, created_at, updated_at';

const SEO_COLUMNS =
  'id, page_id, seo_title, meta_description, canonical_url, robots, og_title, og_description, updated_at';

function mapSeoRow(row: Record<string, unknown>): SeoPayload {
  return {
    seoTitle: (row.seo_title as string) ?? '',
    metaDescription: (row.meta_description as string) ?? '',
    canonicalUrl: (row.canonical_url as string) ?? undefined,
    robots: (row.robots as string) ?? 'index,follow',
    ogTitle: (row.og_title as string) ?? undefined,
    ogDescription: (row.og_description as string) ?? undefined,
  };
}

/** Published page snapshot only. Returns null if not published (caller uses fallback). */
export async function getPublishedPage(slug: PageSlug): Promise<PublishedPageSnapshot | null> {
  const admin = createAdminClient();
  const { data: page, error } = await admin
    .from('pages')
    .select(PAGE_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!page?.published_at) return null;

  const { data: sections, error: secErr } = await admin
    .from('page_sections')
    .select(SECTION_COLUMNS)
    .eq('page_id', page.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (secErr) throw secErr;

  const { data: seoRow, error: seoErr } = await admin
    .from('seo_metadata')
    .select(SEO_COLUMNS)
    .eq('page_id', page.id)
    .maybeSingle();

  if (seoErr) throw seoErr;

  const sectionMap: Record<string, SectionPayload> = {};
  for (const row of sections ?? []) {
    sectionMap[row.section_key as string] = row.payload_json as SectionPayload;
  }

  const registry = PAGE_REGISTRY[slug];

  return {
    slug,
    path: page.path as string,
    title: page.title as string,
    template: registry.template,
    published_at: page.published_at as string,
    sections: sectionMap,
    seo: seoRow ? mapSeoRow(seoRow) : getFallbackSeo(slug),
  };
}

export async function getPublishedSeo(slug: PageSlug): Promise<SeoPayload | null> {
  const admin = createAdminClient();
  const { data: page, error } = await admin
    .from('pages')
    .select('id, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!page) return null;

  const { data: seoRow, error: seoErr } = await admin
    .from('seo_metadata')
    .select(SEO_COLUMNS)
    .eq('page_id', page.id)
    .maybeSingle();

  if (seoErr) throw seoErr;
  if (!seoRow) return null;

  return mapSeoRow(seoRow);
}

export type PublishedSitemapPage = {
  path: string;
  published_at: string;
  updated_at: string;
};

/** Published contractual pages eligible for sitemap (excludes noindex). */
export async function getPublishedPagesForSitemap(): Promise<PublishedSitemapPage[]> {
  const admin = createAdminClient();
  const { data: pages, error } = await admin
    .from('pages')
    .select('id, path, published_at, updated_at')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .order('path', { ascending: true });

  if (error) throw error;
  if (!pages?.length) return [];

  const pageIds = pages.map((page) => page.id as string);
  const { data: seoRows, error: seoErr } = await admin
    .from('seo_metadata')
    .select('page_id, robots')
    .in('page_id', pageIds);

  if (seoErr) throw seoErr;

  const robotsByPageId = new Map(
    (seoRows ?? []).map((row) => [row.page_id as string, (row.robots as string) ?? 'index,follow'])
  );

  return pages
    .filter((page) => isIndexableRobots(robotsByPageId.get(page.id as string)))
    .map((page) => ({
      path: page.path as string,
      published_at: page.published_at as string,
      updated_at: page.updated_at as string,
    }));
}

export async function getPublishedContactInfo(): Promise<ContactInfoPayload | null> {
  const admin = createAdminClient();

  const { data: setting, error: settingErr } = await admin
    .from('site_settings')
    .select('payload_json')
    .eq('key', 'global_contact')
    .maybeSingle();

  if (settingErr) throw settingErr;
  if (setting?.payload_json) {
    return setting.payload_json as ContactInfoPayload;
  }

  const contactPage = await getPublishedPage('contact');
  if (contactPage?.sections.contact_info) {
    return contactPage.sections.contact_info as ContactInfoPayload;
  }

  return null;
}

/** Resolve published page or hardcoded fallback for public rendering. */
export async function resolvePublishedPage(slug: PageSlug): Promise<PublishedPageSnapshot> {
  const published = await getPublishedPage(slug);
  return published ?? getFallbackPage(slug);
}

/** Resolve published SEO or hardcoded fallback. */
export async function resolvePublishedSeo(slug: PageSlug): Promise<SeoPayload> {
  const published = await getPublishedSeo(slug);
  return published ?? getFallbackSeo(slug);
}

/** Resolve contact info: published global → published contact page → fallback. */
export async function resolvePublishedContactInfo(): Promise<ContactInfoPayload> {
  const published = await getPublishedContactInfo();
  return published ?? getFallbackContactInfo();
}
