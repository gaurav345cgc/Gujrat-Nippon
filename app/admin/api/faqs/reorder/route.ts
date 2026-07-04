import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { reorderFaqs } from '@/lib/faqs/service';
import { faqReorderSchema } from '@/lib/faqs/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = faqReorderSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid reorder payload.', 400);

  try {
    await reorderFaqs(parsed.data.orderedIds, session.user.id);

    await writeAuditLog({
      actorId: session.user.id,
      action: 'faq.reordered',
      entityType: 'faq',
      entityId: undefined,
      metadata: { orderedIds: parsed.data.orderedIds },
      ip,
    });

    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Reorder failed.';
    return jsonError(message, 500);
  }
}
