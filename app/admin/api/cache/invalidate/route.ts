import { z } from 'zod';
import { requireValidSession } from '@/lib/auth/guards';
import { ADMIN_CACHE_TAGS, type AdminCacheTag } from '@/lib/admin/cache/tags';
import { invalidateAdminCache } from '@/lib/admin/cache/invalidate';
import { invalidatePagesModule } from '@/lib/cms/cache/invalidate';
import { asPageSlug } from '@/lib/cms/slug';
import { jsonError, jsonOk } from '@/lib/http';

const TAG_VALUES = Object.values(ADMIN_CACHE_TAGS) as [AdminCacheTag, ...AdminCacheTag[]];

const bodySchema = z
  .object({
    tags: z.array(z.enum(TAG_VALUES)).optional(),
    cmsSlug: z.string().optional(),
  })
  .refine((data) => (data.tags?.length ?? 0) > 0 || !!data.cmsSlug, {
    message: 'Provide tags or cmsSlug.',
  });

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid cache invalidation request.', 400);

  const invalidated: string[] = [];

  if (parsed.data.tags?.length) {
    invalidateAdminCache(...parsed.data.tags);
    invalidated.push(...parsed.data.tags);
  }

  if (parsed.data.cmsSlug) {
    const slug = asPageSlug(parsed.data.cmsSlug);
    if (!slug) return jsonError('Invalid CMS page slug.', 400);
    invalidatePagesModule(slug);
    invalidated.push(`cms:${slug}`);
  }

  return jsonOk({ ok: true, invalidated });
}
