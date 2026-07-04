import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { summarizeFaqChanges } from '@/lib/faqs/audit';
import { createFaq, listFaqsAdmin } from '@/lib/faqs/service';
import { faqCreateSchema, validateFaqCreateInput } from '@/lib/faqs/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const faqs = await listFaqsAdmin();
    return jsonOk({ faqs });
  } catch {
    return jsonError('Failed to load FAQs.', 500);
  }
}

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = faqCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid FAQ data.', 400);

  const validated = validateFaqCreateInput(parsed.data);
  if (!validated.ok) return jsonError(validated.error, 400);

  try {
    const faq = await createFaq({
      ...validated.data,
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'faq.created',
      entityType: 'faq',
      entityId: faq.id,
      metadata: summarizeFaqChanges({
        category: faq.category,
        question: faq.question,
      }),
      ip,
    });

    return jsonOk({ faq }, 201);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Create failed.';
    return jsonError(message, 500);
  }
}
