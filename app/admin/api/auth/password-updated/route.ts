import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) {
    return jsonError('Unauthorized', 401);
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: 'auth.password_reset_completed',
    ip: getClientIp(request),
  });

  return jsonOk({ ok: true });
}
