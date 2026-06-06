import { PAGE_REGISTRY, TEMPLATE_SECTIONS } from '@/lib/cms/constants';
import { getPageEditorDefaults } from '@/lib/cms/defaults';
import type { PageEditorPayload, PageSlug, PageSnapshot, SeoPayload } from '@/lib/cms/types';

function snapshotToSeoPayload(snapshot: PageSnapshot): SeoPayload {
  return snapshot.seo
    ? {
        seoTitle: snapshot.seo.seo_title ?? '',
        metaDescription: snapshot.seo.meta_description ?? '',
        canonicalUrl: snapshot.seo.canonical_url ?? undefined,
        robots: (snapshot.seo.robots as SeoPayload['robots']) ?? 'index,follow',
        ogTitle: snapshot.seo.og_title ?? undefined,
        ogDescription: snapshot.seo.og_description ?? undefined,
      }
    : { seoTitle: '', metaDescription: '' };
}

/** Align DB sections with contractual template (slug is source of truth, not page.template). */
export function normalizeEditorPayload(slug: PageSlug, snapshot: PageSnapshot): PageEditorPayload {
  const registry = PAGE_REGISTRY[slug];
  const templateDefs = TEMPLATE_SECTIONS[registry.template];
  const defaults = getPageEditorDefaults(slug);
  const snapshotMap = new Map(snapshot.sections.map((section) => [section.section_key, section]));
  const defaultMap = new Map(defaults.sections.map((section) => [section.section_key, section]));

  const sections: PageEditorPayload['sections'] = [];

  for (const def of templateDefs) {
    const fromSnapshot = snapshotMap.get(def.section_key);
    const fromDefault = defaultMap.get(def.section_key);
    const payload_json = fromSnapshot?.payload_json ?? fromDefault?.payload_json;
    if (!payload_json) continue;

    sections.push({
      section_key: def.section_key,
      section_type: def.section_type,
      payload_json: structuredClone(payload_json),
      sort_order: def.sort_order,
      is_active: fromSnapshot?.is_active ?? true,
    });
  }

  const seoFromSnapshot = snapshotToSeoPayload(snapshot);
  const seo =
    seoFromSnapshot.seoTitle || seoFromSnapshot.metaDescription
      ? seoFromSnapshot
      : { ...defaults.seo };

  return { sections, seo };
}

export function snapshotToEditorPayload(snapshot: PageSnapshot): PageEditorPayload {
  const seo = snapshotToSeoPayload(snapshot);

  return {
    sections: snapshot.sections.map((section) => ({
      section_key: section.section_key,
      section_type: section.section_type,
      payload_json: section.payload_json,
      sort_order: section.sort_order,
      is_active: section.is_active,
    })),
    seo,
  };
}
