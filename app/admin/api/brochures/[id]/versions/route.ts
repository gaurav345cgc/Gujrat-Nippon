import { requireValidSession } from '@/lib/auth/guards';
import { listBrochureVersions } from '@/lib/brochures/service';
import { jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  try {
    const versions = await listBrochureVersions(id);
    return jsonOk({ versions });
  } catch {
    return jsonError('Failed to load versions.', 500);
  }
}
