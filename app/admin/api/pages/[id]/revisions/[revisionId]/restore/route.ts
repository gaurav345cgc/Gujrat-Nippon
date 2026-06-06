import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { getPageById, restoreRevision } from '@/lib/cms/service';
import { asPageSlug } from '@/lib/cms/slug';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string; revisionId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id, revisionId } = await context.params;
  const ip = getClientIp(request);

  try {
    const existing = await getPageById(id);
    if (!existing) return jsonError('Page not found.', 404);

    const slug = asPageSlug(existing.page.slug);
    if (!slug) return jsonError('Contractual page slug cannot be changed.', 400);

    const snapshot = await restoreRevision(id, slug, revisionId, session.user.id);

    await writeAuditLog({
      actorId: session.user.id,
      action: 'cms.page.restore',
      entityType: 'page',
      entityId: id,
      metadata: {
        slug,
        revisionId,
        status: snapshot.page.status,
      },
      ip,
    });

    return jsonOk({ page: snapshot });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Restore failed.';
    return jsonError(message, 500);
  }
}
