import type { TextPayload } from '@/lib/cms/types';

export type IndustryCardAsset = {
  slug: string;
  image: string;
};

export const INDUSTRY_CARD_ASSETS: IndustryCardAsset[] = [
  { slug: 'steel-metal-processing', image: '/sven-verweij-4ZHg6OytifQ-unsplash.jpg' },
  { slug: 'automotive', image: '/greg-rosenke-xoxnfVIE7Qw-unsplash.jpg' },
  { slug: 'plastics-moulding', image: '/product_3.png' },
  { slug: 'chemical-manufacturing', image: '/morteza-mohammadi-l0QB40LUoXA-unsplash.jpg' },
  { slug: 'global-logistics', image: '/distribution_image.png' },
  { slug: 'energy-power', image: '/crystal-kwok-XUEdfpPIhXg-unsplash.jpg' },
  { slug: 'construction-materials', image: '/wallace-wang-8wfB4s5OWqQ-unsplash.jpg' },
  { slug: 'consumer-goods', image: '/joanna-stolowicz-XQNG5c6zl-g-unsplash.jpg' },
];

export const INDUSTRY_CARD_DEFAULTS: TextPayload[] = [
  { heading: 'Steel & Metal Processing', body: 'Rolling and coil lines, tube mills, galvanising and spares supply for steel and metal processing plants.' },
  { heading: 'Automotive', body: 'Spares, greases and lubricants, and sourced equipment support for automotive manufacturing and utilities.' },
  { heading: 'Plastics & Moulding', body: 'Injection moulding systems, spares and maintenance supplies for plastics processing and high-volume lines.' },
  { heading: 'Chemical Manufacturing', body: 'Industrial chemicals, greases and lubricants for process plants and maintenance programmes.' },
  { heading: 'Global Logistics', body: 'Export-import coordination, packing and documentation for machinery, spares and capital equipment.' },
  { heading: 'Energy & Power', body: 'Generators, electrical equipment and plant spares for power and industrial utility applications.' },
  { heading: 'Construction Materials', body: 'Equipment, spares and pneumatics or hydraulics consumables for construction materials manufacturing.' },
  { heading: 'Consumer Goods', body: 'Spares, consumables and moulding-related support for high-volume consumer goods production.' },
];

const INDUSTRY_SLUG_BY_HEADING = Object.fromEntries(
  INDUSTRY_CARD_DEFAULTS.map((card, index) => [
    card.heading ?? '',
    INDUSTRY_CARD_ASSETS[index]?.slug ?? 'steel-metal-processing',
  ])
) as Record<string, string>;

export function resolveIndustrySlug(heading: string, index: number): string {
  return INDUSTRY_SLUG_BY_HEADING[heading] ?? INDUSTRY_CARD_ASSETS[index]?.slug ?? 'steel-metal-processing';
}

export function getIndustryImageBySlug(slug: string): string {
  return INDUSTRY_CARD_ASSETS.find((asset) => asset.slug === slug)?.image ?? '/ourindustries.jpg';
}

export function buildIndustryCardSections(): Record<string, TextPayload> {
  const sections: Record<string, TextPayload> = {};
  INDUSTRY_CARD_DEFAULTS.forEach((card, index) => {
    sections[`industry_card_${index + 1}`] = card;
  });
  return sections;
}

export function resolveIndustryCards(sections: Record<string, unknown>): TextPayload[] {
  const fromCms: TextPayload[] = [];
  for (let index = 1; index <= INDUSTRY_CARD_DEFAULTS.length; index += 1) {
    const section = sections[`industry_card_${index}`];
    if (section) fromCms.push(section as TextPayload);
  }
  if (fromCms.length >= INDUSTRY_CARD_DEFAULTS.length) {
    return fromCms.slice(0, INDUSTRY_CARD_DEFAULTS.length);
  }
  return [...fromCms, ...INDUSTRY_CARD_DEFAULTS.slice(fromCms.length)];
}
