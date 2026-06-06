import { requireValidSession } from '@/lib/auth/guards';
import { getPageById, listRevisions } from '@/lib/cms/service';
import { jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;

  try {
    const page = await getPageById(id);
    if (!page) return jsonError('Page not found.', 404);

    const revisions = await listRevisions(id);
    return jsonOk({
      revisions: revisions.map((revision) => ({
        id: revision.id,
        page_id: revision.page_id,
        revision_note: revision.revision_note,
        created_by: revision.created_by,
        created_at: revision.created_at,
      })),
    });
  } catch {
    return jsonError('Failed to load revisions.', 500);
  }
}
