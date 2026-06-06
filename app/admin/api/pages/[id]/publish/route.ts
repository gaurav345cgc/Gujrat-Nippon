import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { getPageById, publishPage } from '@/lib/cms/service';
import { asPageSlug } from '@/lib/cms/slug';
import type { PageEditorPayload } from '@/lib/cms/types';
import { pageEditorPayloadSchema } from '@/lib/cms/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = pageEditorPayloadSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid page data.', 400);

  try {
    const existing = await getPageById(id);
    if (!existing) return jsonError('Page not found.', 404);

    const slug = asPageSlug(existing.page.slug);
    if (!slug) return jsonError('Contractual page slug cannot be changed.', 400);

    const result = await publishPage(id, slug, parsed.data as PageEditorPayload, session.user.id);

    await writeAuditLog({
      actorId: session.user.id,
      action: 'cms.page.publish',
      entityType: 'page',
      entityId: id,
      metadata: {
        slug,
        status: result.snapshot.page.status,
        revalidation: result.revalidated.status,
        paths: result.revalidated.paths,
      },
      ip,
    });

    return jsonOk({ page: result.snapshot, revalidated: result.revalidated });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Publish failed.';
    return jsonError(message, 500);
  }
}
