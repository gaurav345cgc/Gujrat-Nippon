import { requireValidAdminSession, requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { summarizeFaqChanges } from '@/lib/faqs/audit';
import { getFaqById, softDeleteFaq, updateFaq } from '@/lib/faqs/service';
import { faqUpdateSchema, validateFaqPatch } from '@/lib/faqs/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;

  try {
    const faq = await getFaqById(id);
    if (!faq) return jsonError('FAQ not found.', 404);
    return jsonOk({ faq });
  } catch {
    return jsonError('Failed to load FAQ.', 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = faqUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid update.', 400);

  const fieldError = validateFaqPatch(parsed.data);
  if (fieldError) return jsonError(fieldError, 400);

  try {
    const faq = await updateFaq({
      id,
      ...parsed.data,
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'faq.updated',
      entityType: 'faq',
      entityId: id,
      metadata: summarizeFaqChanges(parsed.data as Record<string, unknown>),
      ip,
    });

    return jsonOk({ faq });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Update failed.';
    return jsonError(message, 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await requireValidAdminSession();
  if (!session) return jsonError('Only admins can delete FAQs.', 403);

  const { id } = await context.params;
  const ip = getClientIp(request);

  try {
    const existing = await getFaqById(id);
    if (!existing) return jsonError('FAQ not found.', 404);

    await softDeleteFaq(id, session.user.id);

    await writeAuditLog({
      actorId: session.user.id,
      action: 'faq.deleted',
      entityType: 'faq',
      entityId: id,
      metadata: summarizeFaqChanges({ question: existing.question }),
      ip,
    });

    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Delete failed.';
    return jsonError(message, 500);
  }
}
