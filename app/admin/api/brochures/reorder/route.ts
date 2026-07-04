import { z } from 'zod';
import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { moveBrochure } from '@/lib/brochures/service';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const bodySchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(['up', 'down']),
});

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid reorder request.', 400);

  try {
    await moveBrochure({
      brochureId: parsed.data.id,
      direction: parsed.data.direction,
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.reordered',
      entityType: 'brochure',
      entityId: parsed.data.id,
      metadata: { direction: parsed.data.direction },
      ip,
    });

    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Reorder failed.';
    return jsonError(message, 500);
  }
}
