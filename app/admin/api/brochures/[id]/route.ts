import { z } from 'zod';
import { invalidateBrochuresModule } from '@/lib/admin/cache/invalidate';
import { requireValidAdminSession, requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { createAdminClient } from '@/lib/supabase/admin';
import { BROCHURE_CATEGORIES } from '@/lib/brochures/constants';
import { deleteBrochure, slugExists } from '@/lib/brochures/service';
import { slugifyTitle } from '@/lib/brochures/slug';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.enum(BROCHURE_CATEGORIES).optional(),
  thumbnailUrl: z.string().max(500).nullable().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  slug: z.string().min(1).max(80).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid update.', 400);

  const admin = createAdminClient();
  const { data: existing } = await admin.from('brochures').select('slug').eq('id', id).single();
  if (!existing) return jsonError('Brochure not found.', 404);

  const updates: Record<string, unknown> = {
    updated_by: session.user.id,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.title !== undefined) updates.title = parsed.data.title.trim();
  if (parsed.data.description !== undefined) updates.description = parsed.data.description.trim();
  if (parsed.data.category !== undefined) updates.category = parsed.data.category;
  if (parsed.data.thumbnailUrl !== undefined) updates.thumbnail_url = parsed.data.thumbnailUrl;
  if (parsed.data.published !== undefined) updates.published = parsed.data.published;
  if (parsed.data.sortOrder !== undefined) updates.sort_order = parsed.data.sortOrder;

  if (parsed.data.slug !== undefined) {
    const slug = slugifyTitle(parsed.data.slug);
    if (await slugExists(slug, id)) return jsonError('Slug already in use.', 409);
    updates.slug = slug;
  }

  const { data: brochure, error } = await admin.from('brochures').update(updates).eq('id', id).select().single();
  if (error || !brochure) return jsonError('Update failed.', 500);

  let action = 'brochure.updated';
  if (parsed.data.published === false) action = 'brochure.archived';
  else if (parsed.data.published === true) action = 'brochure.published';

  await writeAuditLog({
    actorId: session.user.id,
    action,
    entityType: 'brochure',
    entityId: id,
    metadata: parsed.data,
    ip,
  });

  invalidateBrochuresModule();
  return jsonOk({ brochure });
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await requireValidAdminSession();
  if (!session) return jsonError('Only admins can delete brochures.', 403);

  const { id } = await context.params;
  const ip = getClientIp(request);

  try {
    const brochure = await deleteBrochure(id);
    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.deleted',
      entityType: 'brochure',
      entityId: id,
      metadata: { slug: brochure.slug, title: brochure.title },
      ip,
    });
    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Delete failed.';
    return jsonError(message, 500);
  }
}
