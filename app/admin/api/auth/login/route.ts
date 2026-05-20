import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { checkLoginRateLimit, recordLoginAttempt } from '@/lib/auth/rate-limit';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const origin = request.headers.get('origin');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl && origin && !origin.startsWith(new URL(siteUrl).origin)) {
    return jsonError('Invalid request origin.', 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError('Invalid email or password.', 400);
  }

  const email = parsed.data.email.toLowerCase().trim();

  const rate = await checkLoginRateLimit(email, ip);
  if (!rate.allowed) {
    return jsonError(
      `Too many failed attempts. Try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minutes.`,
      429
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    await recordLoginAttempt(email, ip, false);
    await writeAuditLog({
      action: 'auth.login_failed',
      metadata: { email, reason: 'invalid_credentials' },
      ip,
    });
    return jsonError('Invalid email or password.', 401);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', data.user.id)
    .single();

  if (!profile || profile.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    await recordLoginAttempt(email, ip, false, data.user.id);
    await writeAuditLog({
      actorId: data.user.id,
      action: 'auth.login_failed',
      metadata: { email, reason: 'inactive_or_missing_profile' },
      ip,
    });
    return jsonError('Invalid email or password.', 401);
  }

  await recordLoginAttempt(email, ip, true, data.user.id);
  await writeAuditLog({
    actorId: data.user.id,
    action: 'auth.login_success',
    metadata: { email, role: profile.role },
    ip,
  });

  return jsonOk({ ok: true });
}
