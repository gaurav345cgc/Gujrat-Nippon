import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { getOriginValidationError, getSiteUrl } from '@/lib/auth/origin';
import { checkLoginRateLimit } from '@/lib/auth/rate-limit';
import { writeAuditLog } from '@/lib/auth/audit';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const schema = z.object({
  email: z.string().email(),
});

const genericMessage =
  'If an account exists for that email, password reset instructions have been sent.';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const originError = getOriginValidationError(request);
  if (originError) {
    return jsonError(originError, 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return jsonError('Invalid request.', 400);
  }

  const email = parsed.data.email.toLowerCase().trim();

  const rate = await checkLoginRateLimit(email, ip);
  if (!rate.allowed) {
    return jsonError('Too many requests. Try again later.', 429);
  }

  const redirectTo = `${getSiteUrl(request)}/admin/auth/callback?next=/admin/reset-password`;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  await writeAuditLog({
    action: 'auth.password_reset_requested',
    metadata: { email },
    ip,
  });

  return jsonOk({ message: genericMessage });
}
