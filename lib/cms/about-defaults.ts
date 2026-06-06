import type { CtaPayload, TextPayload } from '@/lib/cms/types';

export type AboutStat = { label: string; value: string };

export const ABOUT_STATS: AboutStat[] = [
  { label: 'Export/Import', value: '210+' },
  { label: 'Industry Projects', value: '510+' },
  { label: 'Years Experience', value: '18+' },
  { label: 'More Efficiency', value: '15%' },
];

export const ABOUT_PHILOSOPHY_TABS = [
  'Manufacturer alliances',
  'Timely execution',
  'Quality standards',
  'After sales support',
];

export const ABOUT_GOALS = [
  {
    heading: 'People',
    body: 'We maintain fair and honest dealings with employees, associates and customers, with emphasis on clear communication, technical training where required, and disciplined execution so that plant and machinery enquiries, spares orders and export shipments are handled in a professional manner.',
  },
  {
    heading: 'Planet',
    body: 'We cater to customers across India, Africa, the GCC and other regions with packing, documentation and supply practices aligned to applicable regulations and site requirements, and we support project and repeat orders without overstating capability beyond the agreed bill of supply.',
  },
  {
    heading: 'Profits',
    body: 'We offer competitive pricing where the enquiry permits, customized solutions as per customer specifications, and dependable quality so that buyers achieve predictable lifecycle value from plant machinery, spares and capital equipment sourced through our office.',
  },
];

export function statsToTextPayload(stats: AboutStat[]): TextPayload {
  return {
    heading: 'Company stats',
    body: stats.map((stat) => `${stat.label}|${stat.value}`).join('\n'),
  };
}

export function parseStatsTextPayload(payload: TextPayload): AboutStat[] {
  return payload.body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value] = line.split('|');
      return { label: (label ?? '').trim(), value: (value ?? '').trim() };
    })
    .filter((stat) => stat.label && stat.value);
}

export function tabToTextPayload(title: string): TextPayload {
  return { heading: title, body: title };
}

export function buildAboutExtraSections(): Record<string, TextPayload | CtaPayload> {
  const sections: Record<string, TextPayload | CtaPayload> = {
    company_stats: statsToTextPayload(ABOUT_STATS),
    goals_heading: { heading: 'Our Goals', body: 'People, planet and profits priorities for Gujarat Nippon International.' },
    goal_people: { heading: ABOUT_GOALS[0].heading, body: ABOUT_GOALS[0].body },
    goal_planet: { heading: ABOUT_GOALS[1].heading, body: ABOUT_GOALS[1].body },
    goal_profits: { heading: ABOUT_GOALS[2].heading, body: ABOUT_GOALS[2].body },
    goals_more_cta: {
      heading: 'More goals',
      buttonLabel: 'MORE GOALS',
      buttonHref: '/contact',
    },
  };

  ABOUT_PHILOSOPHY_TABS.forEach((title, index) => {
    sections[`philosophy_tab_${index + 1}`] = tabToTextPayload(title);
  });

  return sections;
}

export function listAboutTextSections(
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
