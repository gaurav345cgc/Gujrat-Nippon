import { z } from 'zod';
import { requireValidSession } from '@/lib/auth/guards';
import { ADMIN_CACHE_TAGS, type AdminCacheTag } from '@/lib/admin/cache/tags';
import { invalidateAdminCache } from '@/lib/admin/cache/invalidate';
import { jsonError, jsonOk } from '@/lib/http';

const TAG_VALUES = Object.values(ADMIN_CACHE_TAGS) as [AdminCacheTag, ...AdminCacheTag[]];

const bodySchema = z.object({
  tags: z.array(z.enum(TAG_VALUES)).min(1),
});

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid tags.', 400);

  invalidateAdminCache(...parsed.data.tags);
  return jsonOk({ ok: true, invalidated: parsed.data.tags });
}
