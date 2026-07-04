/**
 * Export current CMS page sections + SEO from Supabase into payloads.ts defaults.
 * Run: npm run db:export:cms-defaults
 */
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';
import { PAGE_REGISTRY, PAGE_SLUGS } from '../lib/cms/constants';
import { getPageEditorDefaults } from '../lib/cms/defaults';
import type { PageSlug, SeoPayload } from '../lib/cms/types';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

function jsString(value: string): string {
  return JSON.stringify(value);
}

function formatPayload(obj: Record<string, unknown>, indent: string): string {
  const lines = Object.entries(obj).map(([key, val]) => {
    if (typeof val === 'string') {
      return `${indent}${key}: ${jsString(val)},`;
    }
    return `${indent}${key}: ${jsString(String(val))},`;
  });
  return `{\n${lines.join('\n')}\n${indent.slice(2)}}`;
}

async function main() {
  const admin = createAdminClient();
  const pageBlocks: string[] = [];
  let globalContact: Record<string, unknown> | null = null;

  const { data: contactSetting } = await admin
    .from('site_settings')
    .select('payload_json')
    .eq('key', 'global_contact')
    .maybeSingle();
  if (contactSetting?.payload_json) {
    globalContact = contactSetting.payload_json as Record<string, unknown>;
  }

  for (const slug of PAGE_SLUGS) {
    const registry = PAGE_REGISTRY[slug];
    const baseline = getPageEditorDefaults(slug);
    const { data: page } = await admin.from('pages').select('id').eq('slug', slug).maybeSingle();
    if (!page) {
      console.warn(`Skip ${slug}: not in DB — using baseline defaults only`);
    }

    const { data: sections } = page
      ? await admin
          .from('page_sections')
          .select('section_key, payload_json')
          .eq('page_id', page.id)
          .order('sort_order', { ascending: true })
      : { data: [] };

    const { data: seoRow } = page
      ? await admin
          .from('seo_metadata')
          .select('seo_title, meta_description, canonical_url, robots, og_title, og_description')
          .eq('page_id', page.id)
          .maybeSingle()
      : { data: null };

    const dbSectionMap = new Map(
      (sections ?? []).map((row) => [row.section_key as string, row.payload_json as Record<string, unknown>])
    );

    const sectionLines: string[] = [];
    for (const section of baseline.sections) {
      const payload = dbSectionMap.get(section.section_key) ?? section.payload_json;
      sectionLines.push(`      ${section.section_key}: ${formatPayload(payload as Record<string, unknown>, '        ')},`);
    }

    const seo: SeoPayload = {
      seoTitle: (seoRow?.seo_title as string) || baseline.seo.seoTitle,
      metaDescription: (seoRow?.meta_description as string) || baseline.seo.metaDescription,
      canonicalUrl: (seoRow?.canonical_url as string) || baseline.seo.canonicalUrl,
      robots: (seoRow?.robots as string) || baseline.seo.robots || 'index,follow',
      ogTitle: (seoRow?.og_title as string) || baseline.seo.ogTitle || baseline.seo.seoTitle,
      ogDescription:
        (seoRow?.og_description as string) || baseline.seo.ogDescription || baseline.seo.metaDescription,
    };

    const seoLines = [
      `      seoTitle: ${jsString(seo.seoTitle)},`,
      `      metaDescription: ${jsString(seo.metaDescription)},`,
    ];
    if (seo.canonicalUrl) seoLines.push(`      canonicalUrl: ${jsString(seo.canonicalUrl)},`);
    if (seo.robots && seo.robots !== 'index,follow') seoLines.push(`      robots: ${jsString(seo.robots)},`);
    if (seo.ogTitle) seoLines.push(`      ogTitle: ${jsString(seo.ogTitle)},`);
    if (seo.ogDescription) seoLines.push(`      ogDescription: ${jsString(seo.ogDescription)},`);

    pageBlocks.push(`  ${slug}: {
    sections: {
${sectionLines.join('\n')}
    },
    seo: {
${seoLines.join('\n')}
    },
  },`);

    console.log(`Exported: ${slug} (${sectionLines.length} template sections)`);
  }

  const contactBlock = globalContact
    ? `export const GLOBAL_CONTACT: ContactInfoPayload = ${formatPayload(
        {
          heading: (globalContact.heading as string) ?? 'Contact Info',
          address: globalContact.address as string,
          phone: globalContact.phone as string,
          email: globalContact.email as string,
          ...(globalContact.workingHours ? { workingHours: globalContact.workingHours as string } : {}),
          ...(globalContact.mapUrl ? { mapUrl: globalContact.mapUrl as string } : {}),
        },
        '  '
      )};`
    : null;

  const file = `import type {
  ContactInfoPayload,
  CtaPayload,
  HeroPayload,
  PageSlug,
  PublishedPageSnapshot,
  SeoPayload,
  TextPayload,
} from '@/lib/cms/types';
import { PAGE_REGISTRY } from '@/lib/cms/constants';

${contactBlock ?? `export const GLOBAL_CONTACT: ContactInfoPayload = {
  heading: 'Contact Info',
  address:
    '21, Navyug Industrial Estate, M.I.D.C Cross Road, J.B. Nagar, Andheri (East), Mumbai – 400069',
  phone: '+91-22-4099 7000',
  email: 'info@gujaratnippon.com',
};`}

type FallbackPage = {
  sections: Record<string, HeroPayload | TextPayload | CtaPayload | ContactInfoPayload>;
  seo: SeoPayload;
};

const FALLBACK_PAGES: Record<PageSlug, FallbackPage> = {
${pageBlocks.join('\n')}
};

export function getFallbackPage(slug: PageSlug): PublishedPageSnapshot {
  const registry = PAGE_REGISTRY[slug];
  const fallback = FALLBACK_PAGES[slug];
  return {
    slug,
    path: registry.path,
    title: registry.title,
    template: registry.template,
    published_at: new Date(0).toISOString(),
    sections: fallback.sections,
    seo: fallback.seo,
  };
}

export function getFallbackSeo(slug: PageSlug): SeoPayload {
  return FALLBACK_PAGES[slug].seo;
}

export function getFallbackContactInfo(): ContactInfoPayload {
  return { ...GLOBAL_CONTACT };
}

/** All fallback pages for seed script. */
export function getAllFallbackPages(): Record<PageSlug, FallbackPage> {
  return FALLBACK_PAGES;
}
`;

  const outPath = resolve(process.cwd(), 'lib/cms/payloads.ts');
  writeFileSync(outPath, file, 'utf8');
  console.log(`\nWrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
