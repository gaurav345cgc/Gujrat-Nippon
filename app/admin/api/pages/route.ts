import { requireValidSession } from '@/lib/auth/guards';
import { listPagesAdmin } from '@/lib/cms/service';
import { jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const pages = await listPagesAdmin();
    return jsonOk({
      pages: pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        path: page.path,
        title: page.title,
        status: page.status,
        updated_at: page.updated_at,
      })),
    });
  } catch {
    return jsonError('Failed to load pages.', 500);
  }
}
