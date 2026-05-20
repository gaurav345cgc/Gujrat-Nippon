import { createInquiry } from '@/lib/analytics/service';
import { inquiryCreateSchema } from '@/lib/analytics/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const parsed = inquiryCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError('Please check your form and try again.', 400);

  try {
    const inquiry = await createInquiry(parsed.data);
    return jsonOk({ ok: true, inquiryId: inquiry.id }, 201);
  } catch (e) {
    console.error('Inquiry create failed', ip, e);
    return jsonError('Could not send your message. Please try again later.', 500);
  }
}
