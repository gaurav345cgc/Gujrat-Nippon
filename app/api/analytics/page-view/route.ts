import { recordPageView } from '@/lib/analytics/service';
import { pageViewSchema } from '@/lib/analytics/validate';
import { jsonError, jsonOk } from '@/lib/http';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = pageViewSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid path.', 400);

  try {
    await recordPageView(parsed.data.path);
    return jsonOk({ ok: true });
  } catch {
    return jsonError('Could not record view.', 500);
  }
}
