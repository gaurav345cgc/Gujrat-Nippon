import type { PageSlug, PageTemplate, SectionType } from '@/lib/cms/types';

export const PAGE_SLUGS = [
  'home',
  'about',
  'products',
  'industries',
  'certifications',
  'careers',
  'contact',
  'privacy',
  'terms',
  'cookies',
] as const satisfies readonly PageSlug[];

export type PageRegistryEntry = {
  slug: PageSlug;
  path: string;
  title: string;
  template: PageTemplate;
};

export const PAGE_REGISTRY: Record<PageSlug, PageRegistryEntry> = {
  home: { slug: 'home', path: '/', title: 'Home', template: 'home' },
  about: { slug: 'about', path: '/about', title: 'About Us', template: 'about' },
  products: { slug: 'products', path: '/products', title: 'Products / Services', template: 'products' },
  industries: { slug: 'industries', path: '/industries', title: 'Industries Served', template: 'industries' },
  certifications: {
    slug: 'certifications',
    path: '/certifications',
    title: 'Certifications / Quality',
    template: 'certifications',
  },
  careers: { slug: 'careers', path: '/careers', title: 'Careers', template: 'careers' },
  contact: { slug: 'contact', path: '/contact', title: 'Contact Us', template: 'contact' },
  privacy: { slug: 'privacy', path: '/privacy', title: 'Privacy Policy', template: 'legal' },
  terms: { slug: 'terms', path: '/terms', title: 'Terms & Conditions', template: 'legal' },
  cookies: { slug: 'cookies', path: '/cookies', title: 'Cookie Policy', template: 'legal' },
};

export const SLUG_TO_PATH: Record<PageSlug, string> = Object.fromEntries(
  PAGE_SLUGS.map((slug) => [slug, PAGE_REGISTRY[slug].path])
) as Record<PageSlug, string>;

export type TemplateSectionDef = {
  section_key: string;
  section_type: SectionType;
  sort_order: number;
  required?: boolean;
};

function listTextSections(
  prefix: string,
  count: number,
  startOrder: number,
  required = true
): TemplateSectionDef[] {
  return Array.from({ length: count }, (_, index) => ({
    section_key: `${prefix}_${index + 1}`,
    section_type: 'text' as SectionType,
    sort_order: startOrder + index,
    required,
  }));
}

const homeTextSections = listTextSections;

export const TEMPLATE_SECTIONS: Record<PageTemplate, TemplateSectionDef[]> = {
  home: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    { section_key: 'about_teaser', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'about_teaser_cta', section_type: 'cta', sort_order: 2, required: true },
    { section_key: 'services_intro', section_type: 'text', sort_order: 3, required: true },
    { section_key: 'services_view_cta', section_type: 'cta', sort_order: 4, required: true },
    ...homeTextSections('service_card', 4, 5),
    { section_key: 'advantage_intro', section_type: 'text', sort_order: 9 },
    ...homeTextSections('capability', 8, 10),
    { section_key: 'products_teaser_heading', section_type: 'text', sort_order: 18 },
    ...homeTextSections('product_teaser', 12, 19, false),
    { section_key: 'cta_bottom', section_type: 'cta', sort_order: 31 },
  ],
  about: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    { section_key: 'company_overview', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'company_stats', section_type: 'text', sort_order: 2, required: true },
    { section_key: 'leadership_intro', section_type: 'text', sort_order: 3, required: true },
    ...listTextSections('philosophy_tab', 4, 4),
    { section_key: 'goals_heading', section_type: 'text', sort_order: 8, required: true },
    { section_key: 'goal_people', section_type: 'text', sort_order: 9, required: true },
    { section_key: 'goal_planet', section_type: 'text', sort_order: 10, required: true },
    { section_key: 'goal_profits', section_type: 'text', sort_order: 11, required: true },
    { section_key: 'goals_more_cta', section_type: 'cta', sort_order: 12, required: true },
    { section_key: 'vision', section_type: 'text', sort_order: 13, required: true },
    { section_key: 'mission', section_type: 'text', sort_order: 14, required: true },
    { section_key: 'cta', section_type: 'cta', sort_order: 15, required: true },
  ],
  products: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    ...listTextSections('product_card', 6, 1),
  ],
  industries: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    { section_key: 'intro', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'cards_intro', section_type: 'text', sort_order: 2 },
    ...listTextSections('industry_card', 8, 3),
  ],
  certifications: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    { section_key: 'intro', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'compliance_body', section_type: 'text', sort_order: 2, required: true },
    { section_key: 'cta', section_type: 'cta', sort_order: 3 },
  ],
  careers: [
    { section_key: 'hero', section_type: 'hero', sort_order: 0, required: true },
    { section_key: 'intro', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'culture', section_type: 'text', sort_order: 2, required: true },
    { section_key: 'cta', section_type: 'cta', sort_order: 3, required: true },
  ],
  contact: [
    { section_key: 'page_header', section_type: 'text', sort_order: 0, required: true },
    { section_key: 'contact_info', section_type: 'contact_info', sort_order: 1, required: true },
    { section_key: 'form_intro', section_type: 'text', sort_order: 2, required: true },
  ],
  legal: [
    { section_key: 'hero', section_type: 'text', sort_order: 0, required: true },
    { section_key: 'intro', section_type: 'text', sort_order: 1, required: true },
    { section_key: 'body_1', section_type: 'text', sort_order: 2, required: true },
    { section_key: 'body_2', section_type: 'text', sort_order: 3, required: true },
  ],
};

export const ROBOTS_VALUES = ['index,follow', 'noindex,follow', 'noindex,nofollow'] as const;

export const MAX_HEADLINE_LEN = 120;
export const MAX_BODY_LEN = 4000;
export const MAX_LEGAL_BODY_LEN = 12000;
