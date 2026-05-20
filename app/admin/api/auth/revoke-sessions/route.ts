import { requireValidSession } from '@/lib/auth/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) {
    return jsonError('Unauthorized', 401);
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.signOut(session.user.id, 'global');

  if (error) {
    return jsonError('Could not revoke sessions.', 500);
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: 'auth.sessions_revoked_all',
    ip: getClientIp(request),
  });

  return jsonOk({
    message: 'All sessions have been revoked. Sign in again on other devices.',
  });
}
