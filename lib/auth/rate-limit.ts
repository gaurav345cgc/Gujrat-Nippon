import { createAdminClient } from '@/lib/supabase/admin';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_EMAIL = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const LOCKOUT_MS = 30 * 60 * 1000;

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export async function checkLoginRateLimit(
  email: string,
  ip: string | null
): Promise<RateLimitResult> {
  const admin = createAdminClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const normalizedEmail = email.toLowerCase().trim();

  const emailQuery = admin
    .from('login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('email', normalizedEmail)
    .eq('success', false)
    .gte('created_at', since);

  const ipQuery = ip
    ? admin
        .from('login_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('ip', ip)
        .eq('success', false)
        .gte('created_at', since)
    : null;

  const [emailResult, ipResult] = await Promise.all([
    emailQuery,
    ipQuery ?? Promise.resolve({ count: 0, error: null }),
  ]);

  const emailFails = emailResult.count ?? 0;
  const ipFails = ipResult.count ?? 0;

  if (emailFails >= MAX_ATTEMPTS_PER_EMAIL || ipFails >= MAX_ATTEMPTS_PER_IP) {
    return { allowed: false, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000) };
  }

  return { allowed: true };
}

export async function recordLoginAttempt(
  email: string,
  ip: string | null,
  success: boolean,
  userId?: string
): Promise<void> {
  const admin = createAdminClient();
  await admin.from('login_attempts').insert({
    email: email.toLowerCase().trim(),
    ip: ip ?? null,
    success,
    user_id: userId ?? null,
  });
}
