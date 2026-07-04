/**
 * FAQ module — single source of truth for admin and future chatbot integration.
 *
 * Chatbot integration (later): import { listFaqsForChatbot, listFaqsByCategory } from '@/lib/faqs';
 */
export {
  listFaqsForChatbot,
  listFaqsByCategory,
  listFaqsAdmin,
  getFaqById,
  createFaq,
  updateFaq,
  updateFaqStatus,
  softDeleteFaq,
  reorderFaqs,
  listFaqRevisions,
  FAQ_CATEGORIES,
} from '@/lib/faqs/service';

export type { FaqRecord } from '@/lib/faqs/service';
