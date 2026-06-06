import { requireValidSession } from '@/lib/auth/guards';
import { getPageById } from '@/lib/cms/service';
import { jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;

  try {
    const page = await getPageById(id);
    if (!page) return jsonError('Page not found.', 404);
    return jsonOk({ page });
  } catch {
    return jsonError('Failed to load page.', 500);
  }
}
