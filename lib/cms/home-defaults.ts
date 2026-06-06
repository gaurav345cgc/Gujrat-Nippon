import type { CtaPayload, TextPayload } from '@/lib/cms/types';

export type HomeServiceCard = {
  title: string;
  description: string;
};

export type HomeCapability = {
  title: string;
  text: string;
  cta: string;
};

export type HomeProductTeaser = {
  title: string;
  desc: string;
};

export const HOME_SERVICE_CARDS: HomeServiceCard[] = [
  {
    title: 'Plant and Machinery Engineering',
    description:
      'We undertake design, manufacture and supply of plant and machineries for metal processing and allied industries, including rolling mill lines, tube mills, slitting and cut-to-length lines, and related project support as per customer specifications and agreed delivery terms.',
  },
  {
    title: 'Equipment Refurbishment',
    description:
      'We carry out revamping and repair of heavy-wear machinery and components to agreed technical standards, including weld rebuild, machining and inspection, with the objective of reducing downtime and restoring reliable operation.',
  },
  {
    title: 'Modernization and Retrofitting',
    description:
      'We provide modernization and retrofitting of existing mechanical and electrical plant, including furnaces, slitting lines, strip galvanising and colour coating lines, to improve productivity and align equipment with current operating requirements.',
  },
  {
    title: 'Industrial Sourcing and Supply',
    description:
      'We procure and supply industrial spares, chemicals, greases, lubricants and capital equipment through strategic alliances with manufacturers, with competitive pricing and dependable documentation for domestic and export shipments.',
  },
];

export const HOME_CAPABILITIES: HomeCapability[] = [
  {
    title: 'Plant and Machinery for Metal Processing',
    text: 'We undertake design, manufacture and supply of plant and machineries for metal processing industries, including hot and cold rolling mill lines, tube mill lines, slitting and cut-to-length lines, strip galvanising and colour coating lines, deep drawing presses, heat treatment furnaces and related equipment, executed in accordance with customer requirements and agreed quality standards. Complete project supply can be arranged where the contract scope requires it.',
    cta: 'Enquire for plant and machinery',
  },
  {
    title: 'Machinery Refurbishment and Repair',
    text: 'We carry out revamping of existing projects and refurbishment of heavy-wear components to agreed drawings and specifications, including weld rebuild, machining and non-destructive testing where applicable, with the objective of restoring dependable operation and reducing unplanned downtime.',
    cta: 'Contact us for refurbishment',
  },
  {
    title: 'Plant Modernization and Retrofitting',
    text: 'We provide retrofitting and modernization of mechanical and electrical systems in existing plants, including upgrades to slitting lines, colour coating lines and furnace installations, so that equipment continues to meet production and safety expectations under current operating conditions.',
    cta: 'Discuss modernization scope',
  },
  {
    title: 'Capital Equipment Supply',
    text: 'We supply capital equipment and packaged machinery through established manufacturer associations, with emphasis on technical clarification, documentation and dispatch planning. We cater to project-specific and repeat-order requirements in domestic and international markets.',
    cta: 'Request equipment quotation',
  },
  {
    title: 'Industrial Spares and Components',
    text: 'We maintain supply arrangements for mechanical, electrical, hydraulic and pneumatic spares and components for steel plants and process industries, with focus on correct specification, reliable quality and timely delivery to support maintenance schedules.',
    cta: 'Send spares enquiry',
  },
  {
    title: 'Industrial Chemicals, Greases and Lubricants',
    text: 'We offer greases, lubricants and industrial chemicals for plant maintenance and production processes, supplied as per customer specifications and batch requirements, with commitment to consistent grades and transparent documentation.',
    cta: 'Request product details',
  },
  {
    title: 'Power and Electrical Equipment',
    text: 'We supply diesel and gas generator sets, transformers, substations and low-voltage electrical panels for industrial applications, selected to match load, site and regulatory requirements, with support for installation-related coordination where agreed.',
    cta: 'Enquire for electrical supply',
  },
  {
    title: 'Export and Project Logistics',
    text: 'We execute export orders and project shipments with attention to packing, documentation and compliance with import regulations in destination countries. Our customers include operations in Africa, the Middle East, Asia and other regions where reliable supply and integrity in dealings are valued.',
    cta: 'Contact for export requirements',
  },
];

export const HOME_PRODUCT_TEASERS: HomeProductTeaser[] = [
  { title: 'Plant & Machineries', desc: 'Design, manufacture and supply of plant and equipment for metal processing as per project scope' },
  { title: 'Capital Equipment', desc: 'Supply of industrial machinery and packaged equipment as per project requirements' },
  { title: 'Plastic Moulding Systems', desc: 'Supply and support for plastic moulding lines and related plant requirements' },
  { title: 'Mining & Crushing Equipment', desc: 'Sourcing and supply of mining and crushing equipment for extractive industry customers' },
  { title: 'EOT & Gantry Cranes', desc: 'Material handling cranes supplied to agreed technical and safety standards' },
  { title: 'Industrial Generator Sets', desc: 'Diesel and gas generator sets for industrial power backup and prime power' },
  { title: 'Packaging Machinery', desc: 'Industrial packaging and strapping systems for production and dispatch lines' },
  { title: 'Industrial Pumps', desc: 'Pumps and fluid handling equipment for process and utility applications' },
  { title: 'Refractory Materials', desc: 'High-alumina refractory products for furnaces and high-temperature plant' },
  { title: 'Gearboxes & Drives', desc: 'Power transmission gearboxes and drives for industrial machinery' },
  { title: 'Extrusion Dies & Press Containers', desc: 'Components for aluminium extrusion supplied to drawing and specification' },
  { title: 'MDF Resins & Adhesives', desc: 'Industrial resins and adhesives for MDF and panel manufacturing customers' },
];

export const HOME_PRODUCT_ASSETS = [
  { type: 'PRODUCT', img: '/product_1.png' },
  { type: 'PRODUCT', img: '/product_2.png' },
  { type: 'PRODUCT', img: '/product_3.png' },
  { type: 'PRODUCT', img: '/product_4.png' },
  { type: 'PRODUCT', img: '/brochure.jpg' },
  { type: 'PRODUCT', img: '/product_1.png' },
  { type: 'PRODUCT', img: '/product_2.png' },
  { type: 'PRODUCT', img: '/product_3.png' },
  { type: 'PRODUCT', img: '/product_4.png' },
  { type: 'PRODUCT', img: '/brochure.jpg' },
  { type: 'PRODUCT', img: '/product_1.png' },
  { type: 'PRODUCT', img: '/product_2.png' },
] as const;

const CAPABILITY_CTA_MARKER = '\n\nCTA: ';

export function capabilityToTextPayload(capability: HomeCapability): TextPayload {
  return {
    heading: capability.title,
    body: `${capability.text}${CAPABILITY_CTA_MARKER}${capability.cta}`,
  };
}

export function parseCapabilityTextPayload(payload: TextPayload): HomeCapability {
  const markerIndex = payload.body.lastIndexOf(CAPABILITY_CTA_MARKER);
  if (markerIndex === -1) {
    return {
      title: payload.heading ?? payload.body.slice(0, 40),
      text: payload.body,
      cta: 'Learn more',
    };
  }

  return {
    title: payload.heading ?? payload.body.slice(0, 40),
    text: payload.body.slice(0, markerIndex).trim(),
    cta: payload.body.slice(markerIndex + CAPABILITY_CTA_MARKER.length).trim(),
  };
}

export function serviceCardToTextPayload(card: HomeServiceCard): TextPayload {
  return { heading: card.title, body: card.description };
}

export function productTeaserToTextPayload(teaser: HomeProductTeaser): TextPayload {
  return { heading: teaser.title, body: teaser.desc };
}

export function listHomeTextSections(
  sections: Record<string, unknown>,
  prefix: string,
  count: number
): TextPayload[] {
  const items: TextPayload[] = [];
  for (let index = 1; index <= count; index += 1) {
    const section = sections[`${prefix}_${index}`];
    if (section) items.push(section as TextPayload);
  }
  return items;
}

export function buildHomeListSections(): Record<string, TextPayload | CtaPayload> {
  const sections: Record<string, TextPayload | CtaPayload> = {};

  HOME_SERVICE_CARDS.forEach((card, index) => {
    sections[`service_card_${index + 1}`] = serviceCardToTextPayload(card);
  });

  HOME_CAPABILITIES.forEach((capability, index) => {
    sections[`capability_${index + 1}`] = capabilityToTextPayload(capability);
  });

  HOME_PRODUCT_TEASERS.forEach((teaser, index) => {
    sections[`product_teaser_${index + 1}`] = productTeaserToTextPayload(teaser);
  });

  return sections;
}
