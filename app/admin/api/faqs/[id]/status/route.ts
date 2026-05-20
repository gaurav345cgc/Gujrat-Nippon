import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { summarizeFaqChanges } from '@/lib/faqs/audit';
import { updateFaqStatus } from '@/lib/faqs/service';
import { faqStatusSchema } from '@/lib/faqs/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = faqStatusSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid status update.', 400);

  try {
    const faq = await updateFaqStatus({
      id,
      useInChatbot: parsed.data.useInChatbot,
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'faq.status_changed',
      entityType: 'faq',
      entityId: id,
      metadata: summarizeFaqChanges(parsed.data as Record<string, unknown>),
      ip,
    });

    return jsonOk({ faq });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Status update failed.';
    return jsonError(message, 500);
  }
}
