import { requireValidSession } from '@/lib/auth/guards';
import { updateInquiryStatus, type InquiryRow } from '@/lib/analytics/service';
import { jsonError, jsonOk } from '@/lib/http';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed', 'spam', 'archived']),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError('Invalid status.', 400);

  try {
    const inquiry = await updateInquiryStatus(id, parsed.data.status as InquiryRow['status']);
    return jsonOk({ inquiry });
  } catch {
    return jsonError('Update failed.', 500);
  }
}
