import { createAdminClient } from '@/lib/supabase/admin';
import { GLOBAL_CONTACT } from '@/lib/cms/payloads';
import { getPageEditorDefaults } from '@/lib/cms/defaults';
import { publishRevalidation, type PublishRevalidationResult } from '@/lib/cms/revalidate';
import { PAGE_REGISTRY, TEMPLATE_SECTIONS } from '@/lib/cms/constants';
import { normalizeEditorPayload } from '@/lib/cms/editor';
import { validatePageDraft } from '@/lib/cms/validate';
import type {
  ContactInfoPayload,
  PageEditorPayload,
  PageRecord,
  PageRevisionRecord,
  PageSlug,
  PageSnapshot,
  SectionRecord,
  SeoRecord,
} from '@/lib/cms/types';

const PAGE_COLUMNS =
  'id, slug, path, title, template, status, published_at, created_by, updated_by, created_at, updated_at';

const SECTION_COLUMNS =
  'id, page_id, section_key, section_type, payload_json, sort_order, is_active, created_at, updated_at';

const SEO_COLUMNS =
  'id, page_id, seo_title, meta_description, canonical_url, robots, og_title, og_description, updated_at';

function mapPage(row: Record<string, unknown>): PageRecord {
  return {
    id: row.id as string,
    slug: row.slug as string,
    path: row.path as string,
    title: row.title as string,
    template: row.template as PageRecord['template'],
    status: row.status as PageRecord['status'],
    published_at: (row.published_at as string) ?? null,
    created_by: (row.created_by as string) ?? null,
    updated_by: (row.updated_by as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapSection(row: Record<string, unknown>): SectionRecord {
  return {
    id: row.id as string,
    page_id: row.page_id as string,
    section_key: row.section_key as string,
    section_type: row.section_type as SectionRecord['section_type'],
    payload_json: row.payload_json as SectionRecord['payload_json'],
    sort_order: row.sort_order as number,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapSeo(row: Record<string, unknown>): SeoRecord {
  return {
    id: row.id as string,
    page_id: row.page_id as string,
    seo_title: (row.seo_title as string) ?? null,
    meta_description: (row.meta_description as string) ?? null,
    canonical_url: (row.canonical_url as string) ?? null,
    robots: (row.robots as string) ?? 'index,follow',
    og_title: (row.og_title as string) ?? null,
    og_description: (row.og_description as string) ?? null,
    updated_at: row.updated_at as string,
  };
}

export async function getPageBySlug(slug: PageSlug): Promise<PageSnapshot | null> {
  const admin = createAdminClient();
  const { data: page, error } = await admin.from('pages').select(PAGE_COLUMNS).eq('slug', slug).maybeSingle();
  if (error) throw error;
  if (!page) return null;
  return loadPageSnapshot(page.id as string, mapPage(page));
}

export async function getPageById(id: string): Promise<PageSnapshot | null> {
  const admin = createAdminClient();
  const { data: page, error } = await admin.from('pages').select(PAGE_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!page) return null;
  return loadPageSnapshot(id, mapPage(page));
}

async function loadPageSnapshot(pageId: string, page: PageRecord): Promise<PageSnapshot> {
  const admin = createAdminClient();
  const [sectionsRes, seoRes] = await Promise.all([
    admin
      .from('page_sections')
      .select(SECTION_COLUMNS)
      .eq('page_id', pageId)
      .order('sort_order', { ascending: true }),
    admin.from('seo_metadata').select(SEO_COLUMNS).eq('page_id', pageId).maybeSingle(),
  ]);

  if (sectionsRes.error) throw sectionsRes.error;
  if (seoRes.error) throw seoRes.error;

  return {
    page,
    sections: (sectionsRes.data ?? []).map(mapSection),
    seo: seoRes.data ? mapSeo(seoRes.data) : null,
  };
}

export function buildSnapshot(page: PageRecord, sections: SectionRecord[], seo: SeoRecord | null): PageSnapshot {
  return { page, sections, seo };
}

export async function listPagesAdmin(): Promise<PageRecord[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('pages')
    .select(PAGE_COLUMNS)
    .order('title', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapPage);
}

export async function saveDraft(
  pageId: string,
  slug: PageSlug,
  input: PageEditorPayload,
  actorId: string
): Promise<PageSnapshot> {
  const validated = validatePageDraft(slug, input);
  if (!validated.ok) throw new Error(validated.error);

  const admin = createAdminClient();
  const registry = PAGE_REGISTRY[slug];
  const templateDefs = TEMPLATE_SECTIONS[registry.template];

  const { error: pageErr } = await admin
    .from('pages')
    .update({ updated_by: actorId, updated_at: new Date().toISOString() })
    .eq('id', pageId);
  if (pageErr) throw pageErr;

  for (const section of validated.data.sections) {
    const def = templateDefs.find((d) => d.section_key === section.section_key);
    const { error } = await admin.from('page_sections').upsert(
      {
        page_id: pageId,
        section_key: section.section_key,
        section_type: section.section_type,
        payload_json: section.payload_json,
        sort_order: section.sort_order ?? def?.sort_order ?? 0,
        is_active: section.is_active ?? true,
      },
      { onConflict: 'page_id,section_key' }
    );
    if (error) throw error;
  }

  const seo = validated.data.seo;
  const { error: seoErr } = await admin.from('seo_metadata').upsert(
    {
      page_id: pageId,
      seo_title: seo.seoTitle,
      meta_description: seo.metaDescription,
      canonical_url: seo.canonicalUrl ?? null,
      robots: seo.robots ?? 'index,follow',
      og_title: seo.ogTitle ?? seo.seoTitle,
      og_description: seo.ogDescription ?? seo.metaDescription,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'page_id' }
  );
  if (seoErr) throw seoErr;

  const snapshot = await getPageById(pageId);
  if (!snapshot) throw new Error('Page not found after save.');

  const { error: revErr } = await admin.from('page_revisions').insert({
    page_id: pageId,
    snapshot_json: snapshot,
    revision_note: input.revision_note ?? null,
    created_by: actorId,
  });
  if (revErr) throw revErr;

  return snapshot;
}

export async function publishPage(
  pageId: string,
  slug: PageSlug,
  input: PageEditorPayload,
  actorId: string
): Promise<{ snapshot: PageSnapshot; revalidated: PublishRevalidationResult }> {
  const snapshot = await saveDraft(pageId, slug, input, actorId);
  const admin = createAdminClient();
  const publishedAt = new Date().toISOString();

  const { error: publishErr } = await admin
    .from('pages')
    .update({
      status: 'published',
      published_at: publishedAt,
      updated_by: actorId,
    })
    .eq('id', pageId);
  if (publishErr) throw publishErr;

  if (slug === 'contact') {
    const contactSection = input.sections.find((s) => s.section_key === 'contact_info');
    const contactPayload = (contactSection?.payload_json ?? GLOBAL_CONTACT) as ContactInfoPayload;
    await admin.from('site_settings').upsert(
      {
        key: 'global_contact',
        payload_json: contactPayload,
        updated_by: actorId,
      },
      { onConflict: 'key' }
    );
  }

  snapshot.page.status = 'published';
  snapshot.page.published_at = publishedAt;

  const revalidated = await publishRevalidation(slug, pageId, actorId);
  return { snapshot, revalidated };
}

export async function restorePageDefaults(
  pageId: string,
  slug: PageSlug,
  actorId: string
): Promise<PageSnapshot> {
  const admin = createAdminClient();
  const registry = PAGE_REGISTRY[slug];
  const templateDefs = TEMPLATE_SECTIONS[registry.template];
  const allowedKeys = new Set(templateDefs.map((def) => def.section_key));

  const { error: pageErr } = await admin
    .from('pages')
    .update({
      template: registry.template,
      path: registry.path,
      title: registry.title,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId);
  if (pageErr) throw pageErr;

  const { data: existingSections, error: listErr } = await admin
    .from('page_sections')
    .select('section_key')
    .eq('page_id', pageId);
  if (listErr) throw listErr;

  for (const row of existingSections ?? []) {
    const sectionKey = row.section_key as string;
    if (allowedKeys.has(sectionKey)) continue;

    const { error: deleteErr } = await admin
      .from('page_sections')
      .delete()
      .eq('page_id', pageId)
      .eq('section_key', sectionKey);
    if (deleteErr) throw deleteErr;
  }

  const payload = getPageEditorDefaults(slug);
  const snapshot = await saveDraft(pageId, slug, {
    ...payload,
    revision_note: 'Restored site defaults',
  }, actorId);

  const { error: draftErr } = await admin
    .from('pages')
    .update({
      status: 'draft',
      published_at: null,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId);
  if (draftErr) throw draftErr;

  snapshot.page.status = 'draft';
  snapshot.page.published_at = null;

  return snapshot;
}

export async function restoreRevision(
  pageId: string,
  slug: PageSlug,
  revisionId: string,
  actorId: string
): Promise<PageSnapshot> {
  const admin = createAdminClient();
  const { data: revision, error } = await admin
    .from('page_revisions')
    .select('id, page_id, snapshot_json')
    .eq('id', revisionId)
    .eq('page_id', pageId)
    .maybeSingle();

  if (error) throw error;
  if (!revision) throw new Error('Revision not found.');

  const revisionSnapshot = revision.snapshot_json as PageSnapshot;
  const payload = normalizeEditorPayload(slug, revisionSnapshot);
  const snapshot = await saveDraft(pageId, slug, {
    ...payload,
    revision_note: `Restored revision ${revisionId}`,
  }, actorId);

  const { error: draftErr } = await admin
    .from('pages')
    .update({
      status: 'draft',
      published_at: null,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId);
  if (draftErr) throw draftErr;

  snapshot.page.status = 'draft';
  snapshot.page.published_at = null;

  return snapshot;
}

export async function listRevisions(pageId: string): Promise<PageRevisionRecord[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('page_revisions')
    .select('id, page_id, snapshot_json, revision_note, created_by, created_at')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    page_id: row.page_id as string,
    snapshot_json: row.snapshot_json as PageSnapshot,
    revision_note: (row.revision_note as string) ?? null,
    created_by: (row.created_by as string) ?? null,
    created_at: row.created_at as string,
  }));
}
