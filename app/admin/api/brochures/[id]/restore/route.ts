import { z } from 'zod';
import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { restoreBrochureVersion } from '@/lib/brochures/service';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const schema = z.object({ versionId: z.string().uuid() });

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid request.', 400);

  try {
    await restoreBrochureVersion({
      brochureId: id,
      versionId: parsed.data.versionId,
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.version_restored',
      entityType: 'brochure',
      entityId: id,
      metadata: { versionId: parsed.data.versionId },
      ip,
    });

    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Restore failed.';
    return jsonError(message, 400);
  }
}
