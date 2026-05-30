import { z } from 'zod';
import {
  FAQ_CATEGORIES,
  FAQ_LANGUAGES,
  MAX_FAQ_ANSWER_LEN,
  MAX_FAQ_QUESTION_LEN,
} from '@/lib/faqs/constants';
import { sanitizeFaqText } from '@/lib/faqs/sanitize';

export function normalizeFaqQuestion(question: string): string {
  return sanitizeFaqText(question);
}

export const faqCreateSchema = z.object({
  question: z.string().min(1).max(MAX_FAQ_QUESTION_LEN),
  answer: z.string().min(1).max(MAX_FAQ_ANSWER_LEN),
  category: z.enum(FAQ_CATEGORIES),
  keywords: z.array(z.string()).optional(),
  language: z.enum(FAQ_LANGUAGES).optional(),
  sortOrder: z.number().int().optional(),
  useInChatbot: z.boolean().optional().default(true),
  buttonLabel: z.string().max(100).optional().nullable(),
  buttonUrl: z.string().max(500).optional().nullable(),
});

export const faqUpdateSchema = faqCreateSchema.partial();

export const faqStatusSchema = z.object({
  useInChatbot: z.boolean(),
});

export const faqReorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export function validateFaqCreateInput(
  input: z.infer<typeof faqCreateSchema>
): { ok: true; data: typeof input } | { ok: false; error: string } {
  const parsed = faqCreateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid FAQ data.' };

  const question = normalizeFaqQuestion(parsed.data.question);
  const answer = sanitizeFaqText(parsed.data.answer);
  if (!question) return { ok: false, error: 'Question is required.' };
  if (!answer) return { ok: false, error: 'Answer is required.' };

  return { ok: true, data: { ...parsed.data, question, answer } };
}

/** Returns true if questions are likely duplicates (exact or very similar). */
export function isNearDuplicateQuestion(a: string, b: string): boolean {
  const na = normalizeFaqQuestion(a).toLowerCase();
  const nb = normalizeFaqQuestion(b).toLowerCase();
  if (na === nb) return true;
  if (na.length >= 20 && nb.length >= 20) {
    if (na.includes(nb) || nb.includes(na)) return true;
  }
  return false;
}

export function validateFaqPatch(params: {
  question?: string;
  answer?: string;
  category?: string;
}): string | null {
  if (params.question !== undefined) {
    const question = normalizeFaqQuestion(params.question);
    if (!question) return 'Question is required.';
    if (question.length > MAX_FAQ_QUESTION_LEN) {
      return `Question must be ${MAX_FAQ_QUESTION_LEN} characters or fewer.`;
    }
  }
  if (params.answer !== undefined) {
    const answer = sanitizeFaqText(params.answer);
    if (!answer) return 'Answer is required.';
    if (answer.length > MAX_FAQ_ANSWER_LEN) {
      return `Answer must be ${MAX_FAQ_ANSWER_LEN} characters or fewer.`;
    }
  }
  if (params.category !== undefined && !(FAQ_CATEGORIES as readonly string[]).includes(params.category)) {
    return 'Invalid category.';
  }
  return null;
}

export function applyReorder(
  currentIds: string[],
  orderedIds: string[]
): string[] | null {
  if (currentIds.length !== orderedIds.length) return null;
  const setA = new Set(currentIds);
  for (const id of orderedIds) {
    if (!setA.has(id)) return null;
  }
  return orderedIds;
}
