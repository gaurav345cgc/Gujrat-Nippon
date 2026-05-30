import { invalidateFaqsModule } from '@/lib/admin/cache/invalidate';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  FAQ_CATEGORIES,
  type FaqCategory,
  type FaqLanguage,
} from '@/lib/faqs/constants';
import { sanitizeFaqText, sanitizeKeywords } from '@/lib/faqs/sanitize';
import { isNearDuplicateQuestion, normalizeFaqQuestion } from '@/lib/faqs/validate';

export type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  language: string;
  version: number;
  sort_order: number;
  is_active: boolean;
  use_in_chatbot: boolean;
  last_published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  button_label: string | null;
  button_url: string | null;
};

const FAQ_COLUMNS =
  'id, question, answer, category, keywords, language, version, sort_order, is_active, use_in_chatbot, last_published_at, created_by, updated_by, created_at, updated_at, deleted_at, button_label, button_url';

function mapRow(row: Record<string, unknown>): FaqRecord {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as string,
    keywords: (row.keywords as string[]) ?? [],
    language: row.language as string,
    version: row.version as number,
    sort_order: row.sort_order as number,
    is_active: row.is_active as boolean,
    use_in_chatbot: row.use_in_chatbot as boolean,
    last_published_at: (row.last_published_at as string) ?? null,
    created_by: (row.created_by as string) ?? null,
    updated_by: (row.updated_by as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    deleted_at: (row.deleted_at as string) ?? null,
    button_label: (row.button_label as string) ?? null,
    button_url: (row.button_url as string) ?? null,
  };
}

async function findDuplicateQuestion(
  question: string,
  excludeId?: string
): Promise<FaqRecord | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faqs')
    .select(FAQ_COLUMNS)
    .is('deleted_at', null);
  if (error) throw error;

  const target = normalizeFaqQuestion(question);
  for (const row of data ?? []) {
    const faq = mapRow(row);
    if (excludeId && faq.id === excludeId) continue;
    if (isNearDuplicateQuestion(target, faq.question)) return faq;
  }
  return null;
}

async function saveRevision(faq: FaqRecord, actorId: string) {
  const admin = createAdminClient();
  await admin.from('faq_revisions').insert({
    faq_id: faq.id,
    version: faq.version,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords,
    language: faq.language,
    is_active: faq.is_active,
    use_in_chatbot: faq.use_in_chatbot,
    button_label: faq.button_label,
    button_url: faq.button_url,
    created_by: actorId,
  });
}

export async function getNextFaqSortOrder(): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('faqs')
    .select('sort_order')
    .is('deleted_at', null)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

/** Admin: all non-deleted FAQs including inactive. */
export async function listFaqsAdmin(): Promise<FaqRecord[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faqs')
    .select(FAQ_COLUMNS)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getFaqById(id: string, includeDeleted = false): Promise<FaqRecord | null> {
  const admin = createAdminClient();
  let q = admin.from('faqs').select(FAQ_COLUMNS).eq('id', id);
  if (!includeDeleted) q = q.is('deleted_at', null);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

/** Chatbot-ready: not deleted, use_in_chatbot = true. */
export async function listFaqsForChatbot(): Promise<FaqRecord[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faqs')
    .select(FAQ_COLUMNS)
    .is('deleted_at', null)
    .eq('use_in_chatbot', true)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function listFaqsByCategory(
  category: FaqCategory,
  options?: { chatbotOnly?: boolean }
): Promise<FaqRecord[]> {
  const admin = createAdminClient();
  let q = admin
    .from('faqs')
    .select(FAQ_COLUMNS)
    .is('deleted_at', null)
    .eq('category', category);

  if (options?.chatbotOnly) q = q.eq('use_in_chatbot', true);

  const { data, error } = await q
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createFaq(params: {
  question: string;
  answer: string;
  category: FaqCategory;
  keywords?: string[];
  language?: FaqLanguage;
  sortOrder?: number;
  useInChatbot?: boolean;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  actorId: string;
}): Promise<FaqRecord> {
  const question = normalizeFaqQuestion(params.question);
  const answer = sanitizeFaqText(params.answer);

  const dup = await findDuplicateQuestion(question);
  if (dup) throw new Error('A similar FAQ question already exists.');

  const useInChatbot = params.useInChatbot ?? true;
  const now = new Date().toISOString();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faqs')
    .insert({
      question,
      answer,
      category: params.category,
      keywords: sanitizeKeywords(params.keywords),
      language: params.language ?? 'en',
      version: 1,
      sort_order: params.sortOrder ?? (await getNextFaqSortOrder()),
      is_active: useInChatbot,
      use_in_chatbot: useInChatbot,
      button_label: params.buttonLabel ?? null,
      button_url: params.buttonUrl ?? null,
      last_published_at: useInChatbot ? now : null,
      created_by: params.actorId,
      updated_by: params.actorId,
    })
    .select(FAQ_COLUMNS)
    .single();

  if (error || !data) throw error ?? new Error('Failed to create FAQ');
  invalidateFaqsModule();
  return mapRow(data);
}

export async function updateFaq(params: {
  id: string;
  question?: string;
  answer?: string;
  category?: FaqCategory;
  keywords?: string[];
  language?: FaqLanguage;
  sortOrder?: number;
  useInChatbot?: boolean;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  actorId: string;
}): Promise<FaqRecord> {
  const existing = await getFaqById(params.id);
  if (!existing) throw new Error('FAQ not found');

  await saveRevision(existing, params.actorId);

  const updates: Record<string, unknown> = {
    updated_by: params.actorId,
    updated_at: new Date().toISOString(),
    version: existing.version + 1,
  };

  if (params.question !== undefined) {
    const question = normalizeFaqQuestion(params.question);
    const dup = await findDuplicateQuestion(question, params.id);
    if (dup) throw new Error('A similar FAQ question already exists.');
    updates.question = question;
  }
  if (params.answer !== undefined) updates.answer = sanitizeFaqText(params.answer);
  if (params.category !== undefined) updates.category = params.category;
  if (params.keywords !== undefined) updates.keywords = sanitizeKeywords(params.keywords);
  if (params.language !== undefined) updates.language = params.language;
  if (params.sortOrder !== undefined) updates.sort_order = params.sortOrder;
  if (params.buttonLabel !== undefined) updates.button_label = params.buttonLabel;
  if (params.buttonUrl !== undefined) updates.button_url = params.buttonUrl;

  if (params.useInChatbot !== undefined) {
    updates.use_in_chatbot = params.useInChatbot;
    updates.is_active = params.useInChatbot;
    if (params.useInChatbot && !existing.use_in_chatbot) {
      updates.last_published_at = new Date().toISOString();
    }
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faqs')
    .update(updates)
    .eq('id', params.id)
    .is('deleted_at', null)
    .select(FAQ_COLUMNS)
    .single();

  if (error || !data) throw error ?? new Error('Update failed');
  invalidateFaqsModule();
  return mapRow(data);
}

export async function updateFaqStatus(params: {
  id: string;
  useInChatbot: boolean;
  actorId: string;
}): Promise<FaqRecord> {
  return updateFaq({
    id: params.id,
    useInChatbot: params.useInChatbot,
    actorId: params.actorId,
  });
}

/** Soft delete — record kept for audit/history. */
export async function softDeleteFaq(id: string, actorId: string): Promise<void> {
  const existing = await getFaqById(id);
  if (!existing) throw new Error('FAQ not found');

  const admin = createAdminClient();
  const { error } = await admin
    .from('faqs')
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false,
      use_in_chatbot: false,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
  invalidateFaqsModule();
}

export async function reorderFaqs(orderedIds: string[], actorId: string): Promise<void> {
  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from('faqs')
    .select('id')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const currentIds = (rows ?? []).map((r) => r.id as string);
  if (currentIds.length !== orderedIds.length) {
    throw new Error('Reorder list must include every FAQ exactly once.');
  }
  const set = new Set(currentIds);
  for (const id of orderedIds) {
    if (!set.has(id)) throw new Error('Invalid FAQ id in reorder list.');
  }

  const now = new Date().toISOString();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error: upErr } = await admin
      .from('faqs')
      .update({ sort_order: i, updated_by: actorId, updated_at: now })
      .eq('id', orderedIds[i]);
    if (upErr) throw upErr;
  }
  invalidateFaqsModule();
}

export async function listFaqRevisions(faqId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faq_revisions')
    .select('id, version, question, answer, category, created_at, created_by')
    .eq('faq_id', faqId)
    .order('version', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export { FAQ_CATEGORIES };
