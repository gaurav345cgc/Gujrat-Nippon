/**
 * Seeds GNIPL starter FAQs (inactive drafts — edit answers in Admin → FAQs).
 *
 * Run after migration 005: npm run db:seed:faqs
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import type { FaqCategory } from '../lib/faqs/constants';
import { normalizeFaqQuestion } from '../lib/faqs/validate';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PLACEHOLDER =
  '[Replace with approved GNIPL content in Admin → FAQs before enabling for chatbot.]';

type SeedRow = { category: FaqCategory; question: string; keywords?: string[] };

/** GNIPL contract-aligned starter set — order matches suggested chatbot flow. */
const SEED: SeedRow[] = [
  { category: 'general', question: 'What is Gujarat Nippon International Private Limited?' },
  { category: 'general', question: 'What products and services does GNIPL offer?' },
  { category: 'general', question: 'Which industries does GNIPL serve?' },
  { category: 'general', question: 'How can I contact GNIPL?' },
  { category: 'working_hours', question: "What are GNIPL's working hours?" },
  { category: 'brochures', question: 'Where can I download GNIPL brochures?' },
  { category: 'brochures', question: 'Are the brochures free to download?' },
  {
    category: 'brochures',
    question: 'Which brochure should I choose for a specific product or service?',
  },
  { category: 'brochures', question: 'How often are brochures updated?' },
  { category: 'brochures', question: 'What should I do if a brochure does not open?' },
  { category: 'contact', question: 'How do I submit an inquiry?' },
  { category: 'contact', question: 'Will GNIPL respond to my inquiry by email?' },
  { category: 'contact', question: 'Can I request a human callback?' },
  { category: 'contact', question: 'What information should I include in my inquiry?' },
  { category: 'contact', question: 'How long does it take to get a response?' },
  { category: 'human_handoff', question: 'How do I talk to a human?' },
  {
    category: 'human_handoff',
    question: 'What happens if the chatbot cannot answer my question?',
  },
  { category: 'human_handoff', question: 'Can I share my contact details for follow-up?' },
  { category: 'trust', question: 'Where is GNIPL located?' },
  {
    category: 'trust',
    question: 'Does GNIPL have certifications or compliance information available?',
  },
  { category: 'trust', question: 'Can GNIPL help with custom requirements?' },
];

async function main() {
  const { data: users } = await admin.auth.admin.listUsers();
  const actorId = users.users[0]?.id ?? null;

  const { data: existingRows } = await admin
    .from('faqs')
    .select('id, question, answer')
    .is('deleted_at', null);

  const byQuestion = new Map<string, { id: string; answer: string }>();
  for (const row of existingRows ?? []) {
    byQuestion.set(normalizeFaqQuestion(row.question).toLowerCase(), {
      id: row.id,
      answer: row.answer,
    });
  }

  let created = 0;
  let skipped = 0;
  let updated = 0;

  for (let i = 0; i < SEED.length; i++) {
    const row = SEED[i];
    const key = normalizeFaqQuestion(row.question).toLowerCase();
    const existing = byQuestion.get(key);

    if (existing) {
      if (existing.answer === PLACEHOLDER || existing.answer?.includes('[Replace with approved')) {
        await admin
          .from('faqs')
          .update({
            category: row.category,
            sort_order: i,
            updated_by: actorId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        updated++;
      } else {
        skipped++;
      }
      continue;
    }

    const { error } = await admin.from('faqs').insert({
      question: row.question,
      answer: PLACEHOLDER,
      category: row.category,
      keywords: row.keywords ?? [],
      language: 'en',
      version: 1,
      sort_order: i,
      is_active: false,
      use_in_chatbot: false,
      created_by: actorId,
      updated_by: actorId,
    });

    if (error) {
      console.warn('Skip:', row.question.slice(0, 50), error.message);
      skipped++;
      continue;
    }

    created++;
    console.log(`+ ${row.question.slice(0, 60)}`);
  }

  console.log(`\nDone. Created ${created}, updated ${updated}, skipped ${skipped}.`);
  console.log('Edit answers at /admin/faqs then enable Use in chatbot.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
