import type { FaqCategory } from '@/lib/faqs/constants';

export type ChatbotFaqPayload = {
  id: string;
  question: string;
  answer: string;
  category: string;
  buttonLabel: string | null;
  buttonUrl: string | null;
};

export type ChatbotViewKey = 'products' | 'industries' | 'resources' | 'contact';

export type ChatOption =
  | {
      label: string;
      kind: 'answer';
      answer: string;
      cta?: { label: string; href: string };
    }
  | {
      label: string;
      kind: 'link';
      href: string;
      answer: string;
    }
  | {
      label: string;
      kind: 'lead';
      answer: string;
    };

/** Map admin FAQ categories → chatbot menu sections. */
export const CHATBOT_VIEW_CATEGORIES: Record<ChatbotViewKey, readonly FaqCategory[]> = {
  products: ['products'],
  industries: ['general', 'trust'],
  resources: ['brochures'],
  contact: ['contact', 'working_hours', 'human_handoff'],
};

export function faqToChatOption(faq: ChatbotFaqPayload): ChatOption {
  if (faq.category === 'human_handoff') {
    return { label: faq.question, kind: 'lead', answer: faq.answer };
  }

  const cta =
    faq.buttonUrl && faq.buttonLabel
      ? { label: faq.buttonLabel, href: faq.buttonUrl }
      : undefined;

  if (faq.buttonUrl?.startsWith('/')) {
    return {
      label: faq.question,
      kind: 'link',
      href: faq.buttonUrl,
      answer: faq.answer,
    };
  }

  return {
    label: faq.question,
    kind: 'answer',
    answer: faq.answer,
    cta,
  };
}

export function mergeFaqsIntoCategoryOptions(
  view: ChatbotViewKey,
  fallbackOptions: ChatOption[],
  faqs: ChatbotFaqPayload[]
): ChatOption[] {
  const allowed = new Set<string>(CHATBOT_VIEW_CATEGORIES[view]);
  const fromApi = faqs
    .filter((f) => allowed.has(f.category))
    .map(faqToChatOption);

  if (fromApi.length === 0) return fallbackOptions;

  if (view === 'contact') {
    const hasLead = fromApi.some((o) => o.kind === 'lead');
    const fallbackLead = fallbackOptions.find((o) => o.kind === 'lead');
    if (!hasLead && fallbackLead) {
      return [...fromApi, fallbackLead];
    }
  }

  return fromApi;
}
