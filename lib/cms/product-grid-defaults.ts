import type { TextPayload } from '@/lib/cms/types';

export const PRODUCT_GRID_ASSETS = [
  { image: '/product_4.png' },
  { image: '/product_1.png' },
  { image: '/product_3.png' },
  { image: '/product_2.png' },
  { image: '/product_3.png' },
  { image: '/product_4.png' },
] as const;

export const PRODUCT_GRID_DEFAULTS: TextPayload[] = [
  { heading: 'Industrial Spares & Consumables', body: 'Comprehensive electrical, mechanical, hydraulic, and pneumatic supplies.' },
  { heading: 'Chemicals, Grease & Lubricants', body: 'High-quality preventative maintenance supplies for industrial use.' },
  { heading: 'Turnkey Plant & Machineries', body: 'Design, manufacture and supply of plant machineries for metal processing.' },
  { heading: 'Capital Equipment', body: 'Representing reputed International Companies (Zhuoshen, Vietsteel, Maker).' },
  { heading: 'Plastic Moulding Systems', body: 'Advanced plastic moulding technologies by Gujarat Nippon International Pvt Ltd.' },
  { heading: 'Logic Plastics Manufacturing', body: 'High-volume production lines for various renowned multinational brands.' },
];

export function buildProductGridSections(): Record<string, TextPayload> {
  const sections: Record<string, TextPayload> = {};
  PRODUCT_GRID_DEFAULTS.forEach((card, index) => {
    sections[`product_card_${index + 1}`] = card;
  });
  return sections;
}

export function resolveProductGridCards(sections: Record<string, unknown>): TextPayload[] {
  const fromCms: TextPayload[] = [];
  for (let index = 1; index <= PRODUCT_GRID_DEFAULTS.length; index += 1) {
    const section = sections[`product_card_${index}`];
    if (section) fromCms.push(section as TextPayload);
  }
  if (fromCms.length >= PRODUCT_GRID_DEFAULTS.length) {
    return fromCms.slice(0, PRODUCT_GRID_DEFAULTS.length);
  }
  return [...fromCms, ...PRODUCT_GRID_DEFAULTS.slice(fromCms.length)];
}
