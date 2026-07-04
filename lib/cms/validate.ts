import { z } from 'zod';
import {
  MAX_BODY_LEN,
  MAX_HEADLINE_LEN,
  MAX_LEGAL_BODY_LEN,
  PAGE_REGISTRY,
  ROBOTS_VALUES,
  TEMPLATE_SECTIONS,
} from '@/lib/cms/constants';
import { sanitizeCmsText, sanitizePhone } from '@/lib/cms/sanitize';
import type { PageEditorPayload, PageSlug, SectionType } from '@/lib/cms/types';

const safeHrefSchema = z
  .string()
  .min(1)
  .max(500)
  .refine(
    (href) => {
      const lower = href.toLowerCase().trim();
      if (lower.startsWith('javascript:') || lower.startsWith('data:')) return false;
      if (href.startsWith('/')) return true;
      try {
        const url = new URL(href);
        return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:';
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL or path.' }
  );

export const heroPayloadSchema = z.object({
  headline: z.string().min(1).max(MAX_HEADLINE_LEN),
  subheadline: z.string().max(MAX_HEADLINE_LEN).optional(),
  body: z.string().max(MAX_BODY_LEN).optional(),
  primaryCtaLabel: z.string().max(80).optional(),
  primaryCtaHref: safeHrefSchema.optional(),
  secondaryCtaLabel: z.string().max(80).optional(),
  secondaryCtaHref: safeHrefSchema.optional(),
});

export const textPayloadSchema = z.object({
  heading: z.string().max(MAX_HEADLINE_LEN).optional(),
  body: z.string().min(1).max(MAX_BODY_LEN),
});

export const legalTextPayloadSchema = z.object({
  heading: z.string().max(MAX_HEADLINE_LEN).optional(),
  body: z.string().min(1).max(MAX_LEGAL_BODY_LEN),
});

export const ctaPayloadSchema = z.object({
  heading: z.string().min(1).max(MAX_HEADLINE_LEN),
  body: z.string().max(MAX_BODY_LEN).optional(),
  buttonLabel: z.string().min(1).max(80),
  buttonHref: safeHrefSchema,
});

export const contactInfoPayloadSchema = z.object({
  heading: z.string().max(MAX_HEADLINE_LEN).optional(),
  address: z.string().min(1).max(500),
  phone: z.string().min(5).max(40),
  email: z.string().email().max(200),
  workingHours: z.string().max(200).optional(),
  mapUrl: safeHrefSchema.optional(),
});

export const seoPayloadSchema = z.object({
  seoTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  canonicalUrl: safeHrefSchema.optional(),
  robots: z.enum(ROBOTS_VALUES).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
});

export const pageEditorSectionSchema = z.object({
  section_key: z.string().min(1),
  section_type: z.enum(['hero', 'text', 'cta', 'contact_info', 'seo']),
  payload_json: z.record(z.string(), z.unknown()),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const pageEditorPayloadSchema = z.object({
  sections: z.array(pageEditorSectionSchema).min(1),
  seo: seoPayloadSchema,
  revision_note: z.string().max(500).optional(),
});

export function schemaForSectionType(
  sectionType: SectionType,
  legal = false
): z.ZodType<Record<string, unknown>> {
  switch (sectionType) {
    case 'hero':
      return heroPayloadSchema;
    case 'text':
      return legal ? legalTextPayloadSchema : textPayloadSchema;
    case 'cta':
      return ctaPayloadSchema;
    case 'contact_info':
      return contactInfoPayloadSchema;
    case 'seo':
      return seoPayloadSchema;
    default:
      return z.object({});
  }
}

export function sanitizeSectionPayload(
  sectionType: SectionType,
  payload: Record<string, unknown>,
  legal = false
): Record<string, unknown> {
  const out = { ...payload };

  if (sectionType === 'contact_info') {
    if (typeof out.email === 'string') out.email = out.email.trim().toLowerCase();
    if (typeof out.phone === 'string') out.phone = sanitizePhone(out.phone);
  }

  for (const key of Object.keys(out)) {
    if (typeof out[key] !== 'string') continue;
    const preserve = sectionType === 'text' && key === 'body';
    out[key] = sanitizeCmsText(out[key] as string, preserve);
  }

  return out;
}

export function validateSectionPayload(
  sectionType: SectionType,
  payload: Record<string, unknown>,
  legal = false
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const sanitized = sanitizeSectionPayload(sectionType, payload, legal);
  const schema = schemaForSectionType(sectionType, legal);
  const parsed = schema.safeParse(sanitized);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid section payload.' };
  }
  return { ok: true, data: parsed.data };
}

export function validatePageDraft(
  slug: PageSlug,
  input: PageEditorPayload
): { ok: true; data: PageEditorPayload } | { ok: false; error: string } {
  const registry = PAGE_REGISTRY[slug];
  const templateDefs = TEMPLATE_SECTIONS[registry.template];
  const legal = registry.template === 'legal';

  const seoResult = validateSectionPayload('seo', input.seo as unknown as Record<string, unknown>);
  if (!seoResult.ok) return { ok: false, error: `SEO: ${seoResult.error}` };

  const sectionMap = new Map(input.sections.map((s) => [s.section_key, s]));

  for (const def of templateDefs) {
    if (!def.required) continue;
    const section = sectionMap.get(def.section_key);
    if (!section || section.is_active === false) {
      return { ok: false, error: `Missing required section: ${def.section_key}` };
    }
    if (section.section_type !== def.section_type) {
      return { ok: false, error: `Section ${def.section_key} must be type ${def.section_type}.` };
    }
    const result = validateSectionPayload(
      def.section_type,
      section.payload_json as unknown as Record<string, unknown>,
      legal && def.section_type === 'text'
    );
    if (!result.ok) {
      return { ok: false, error: `${def.section_key}: ${result.error}` };
    }
  }

  const sanitizedSections: PageEditorPayload['sections'] = [];

  for (const section of input.sections) {
    const result = validateSectionPayload(
      section.section_type,
      section.payload_json as unknown as Record<string, unknown>,
      legal && section.section_type === 'text'
    );
    if (!result.ok) {
      return { ok: false, error: `${section.section_key}: ${result.error}` };
    }
    sanitizedSections.push({
      ...section,
      payload_json: result.data as PageEditorPayload['sections'][number]['payload_json'],
    });
  }

  return {
    ok: true,
    data: {
      ...input,
      seo: seoResult.data as PageEditorPayload['seo'],
      sections: sanitizedSections,
    },
  };
}
