import { PAGE_REGISTRY, TEMPLATE_SECTIONS } from '@/lib/cms/constants';
import { getFallbackPage } from '@/lib/cms/payloads';
import type { PageEditorPayload, PageSlug, SectionPayload } from '@/lib/cms/types';

/** Site default copy from payloads.ts — used for seed, public fallback, and editor reset. */
export function getPageEditorDefaults(slug: PageSlug): PageEditorPayload {
  const fallback = getFallbackPage(slug);
  const defs = TEMPLATE_SECTIONS[PAGE_REGISTRY[slug].template];

  const sections = defs
    .map((def) => {
      const payload_json = fallback.sections[def.section_key];
      if (!payload_json) return null;
      return {
        section_key: def.section_key,
        section_type: def.section_type,
        payload_json: payload_json as SectionPayload,
        sort_order: def.sort_order,
        is_active: true,
      };
    })
    .filter((section): section is NonNullable<typeof section> => section !== null);

  return {
    sections,
    seo: { ...fallback.seo },
  };
}
