export const FAQ_CATEGORIES = [
  'general',
  'products',
  'brochures',
  'contact',
  'working_hours',
  'human_handoff',
  'trust',
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  general: 'General',
  products: 'Products & services',
  brochures: 'Brochures & downloads',
  contact: 'Contact & leads',
  working_hours: 'Working hours',
  human_handoff: 'Human handoff',
  trust: 'Trust & company info',
};

export const FAQ_LANGUAGES = ['en', 'hi'] as const;

export type FaqLanguage = (typeof FAQ_LANGUAGES)[number];

export const MAX_FAQ_QUESTION_LEN = 300;
export const MAX_FAQ_ANSWER_LEN = 2000;
export const MAX_FAQ_KEYWORDS = 12;
