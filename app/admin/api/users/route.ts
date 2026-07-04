import { z } from 'zod';
import { invalidateUsersModule } from '@/lib/admin/cache/invalidate';
import { requireValidAdminSession } from '@/lib/auth/guards';
import { listAdminUsers } from '@/lib/admin/listUsers';
import { createAdminClient } from '@/lib/supabase/admin';
import { validatePasswordStrength } from '@/lib/auth/password';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const createUserSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(10),
  role: z.enum(['ADMIN', 'EDITOR']),
});

export async function GET() {
  const session = await requireValidAdminSession();
  if (!session) {
    return jsonError('Forbidden', 403);
  }

  try {
    const users = await listAdminUsers();
    return jsonOk({ users });
  } catch {
    return jsonError('Failed to load users.', 500);
  }
}

export async function POST(request: Request) {
  const session = await requireValidAdminSession();
  if (!session) {
    return jsonError('Forbidden', 403);
  }

  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError('Invalid user data.', 400);
  }

  const strengthError = validatePasswordStrength(parsed.data.password);
  if (strengthError) {
    return jsonError(strengthError, 400);
  }

  const email = parsed.data.email.toLowerCase().trim();
  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { name: parsed.data.name.trim() },
  });

  if (createError || !created.user) {
    return jsonError(createError?.message ?? 'Could not create user.', 400);
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: created.user.id,
    name: parsed.data.name.trim(),
    role: parsed.data.role,
    status: 'ACTIVE',
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return jsonError('Could not create user profile.', 500);
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: 'user.created',
    entityType: 'user',
    entityId: created.user.id,
    metadata: { email, role: parsed.data.role },
    ip,
  });

  invalidateUsersModule();

  return jsonOk(
    {
      user: {
        id: created.user.id,
        name: parsed.data.name.trim(),
        email,
        role: parsed.data.role,
        status: 'ACTIVE',
      },
    },
    201
  );
}
