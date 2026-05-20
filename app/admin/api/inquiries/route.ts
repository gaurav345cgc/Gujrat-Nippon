import { requireValidSession } from '@/lib/auth/guards';
import { listInquiries } from '@/lib/analytics/service';
import { jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const inquiries = await listInquiries(500);
    return jsonOk({ inquiries });
  } catch {
    return jsonError('Failed to load inquiries.', 500);
  }
}
