import { z } from 'zod';
import { invalidateUsersModule } from '@/lib/admin/cache/invalidate';
import { requireValidAdminSession } from '@/lib/auth/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';
import type { AppRole, AppStatus } from '@/lib/auth/types';

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(['ADMIN', 'EDITOR']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireValidAdminSession();
  if (!session) {
    return jsonError('Forbidden', 403);
  }

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError('Invalid update.', 400);
  }

  if (id === session.user.id && parsed.data.status === 'INACTIVE') {
    return jsonError('You cannot deactivate your own account.', 400);
  }

  if (id === session.user.id && parsed.data.role && parsed.data.role !== 'ADMIN') {
    return jsonError('You cannot remove your own admin role.', 400);
  }

  const admin = createAdminClient();

  const { data: profile, error: updateError } = await admin
    .from('profiles')
    .update({
      name: parsed.data.name?.trim(),
      role: parsed.data.role as AppRole | undefined,
      status: parsed.data.status as AppStatus | undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, name, role, status')
    .single();

  if (updateError || !profile) {
    return jsonError('User not found.', 404);
  }

  if (parsed.data.status === 'INACTIVE') {
    await admin.auth.admin.signOut(id, 'global');
    await writeAuditLog({
      actorId: session.user.id,
      action: 'user.deactivated',
      entityType: 'user',
      entityId: id,
      ip,
    });
  }

  const { data: authUser } = await admin.auth.admin.getUserById(id);

  await writeAuditLog({
    actorId: session.user.id,
    action: 'user.updated',
    entityType: 'user',
    entityId: id,
    metadata: parsed.data,
    ip,
  });

  invalidateUsersModule();

  return jsonOk({
    user: {
      id: profile.id,
      name: profile.name,
      email: authUser.user?.email ?? '',
      role: profile.role,
      status: profile.status,
    },
  });
}
