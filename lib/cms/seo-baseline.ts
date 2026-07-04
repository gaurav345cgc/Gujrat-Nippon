import type { PageSlug } from '@/lib/cms/types';

/** Target from gnipl-seo-content-rules.md; approved contractual titles may slightly exceed this. */
export const SEO_TITLE_TARGET_LEN = 65;
export const SEO_TITLE_MAX_LEN = 85;
export const SEO_META_MIN_LEN = 50;
export const SEO_META_MAX_LEN = 160;

/** Approved contractual-page SEO from guide/gnipl-seo-content-rules.md (meta trimmed to ≤160). */
export const APPROVED_CONTRACTUAL_SEO: Partial<
  Record<PageSlug, { seoTitle: string; metaDescription: string }>
> = {
  home: {
    seoTitle: 'Turnkey Plant Engineering & Industrial Supply — Gujarat Nippon International',
    metaDescription:
      'Gujarat Nippon International undertakes turnkey design, manufacture and supply of plant and machineries for metal processing in India, Africa and the GCC.',
  },
  about: {
    seoTitle: 'About Us — 18+ Years in Industrial Engineering | Gujarat Nippon International',
    metaDescription:
      'Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years across 510+ projects.',
  },
  industries: {
    seoTitle: 'Industries We Serve — Steel, Plastics, Energy & More | Gujarat Nippon',
    metaDescription:
      'We cater to steel and metal processing, automotive, plastics, chemicals, energy and logistics with engineering solutions and sourced capital equipment.',
  },
  products: {
    seoTitle: 'Industrial Machinery & Equipment Supply — Gujarat Nippon International',
    metaDescription:
      'Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial use.',
  },
  contact: {
    seoTitle: 'Contact Us — Mumbai MIDC Office | Gujarat Nippon International',
    metaDescription:
      'Contact Gujarat Nippon International at our Mumbai MIDC office for turnkey project enquiries, industrial machinery requirements and export-import consultations.',
  },
};

export function isIndexableRobots(robots: string | undefined): boolean {
  const value = (robots ?? 'index,follow').trim().toLowerCase();
  return !value.startsWith('noindex');
}
