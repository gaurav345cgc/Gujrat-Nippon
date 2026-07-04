import type { TextPayload } from '@/lib/cms/types';

export type IndustryCardAsset = {
  slug: string;
  image: string;
};

export const INDUSTRY_CARD_ASSETS: IndustryCardAsset[] = [
  { slug: 'steel-metal-processing', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800' },
  { slug: 'automotive', image: 'https://images.unsplash.com/photo-1518985289906-8dceaa1b8ef0?auto=format&fit=crop&q=80&w=800' },
  { slug: 'plastics-moulding', image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800' },
  { slug: 'chemical-manufacturing', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800' },
  { slug: 'global-logistics', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80&w=800' },
  { slug: 'energy-power', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800' },
  { slug: 'construction-materials', image: 'https://images.unsplash.com/photo-1541888081198-d1a2dd6b59d9?auto=format&fit=crop&q=80&w=800' },
  { slug: 'consumer-goods', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800' },
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
