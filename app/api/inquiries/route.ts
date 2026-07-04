import { createInquiry } from '@/lib/analytics/service';
import { inquiryCreateSchema } from '@/lib/analytics/validate';
import { sendLeadNotification } from '@/lib/email/lead-notification';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';
import { checkPublicFormRateLimit } from '@/lib/security/public-rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkPublicFormRateLimit(ip)) {
    return jsonError('Too many requests. Please try again later.', 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = inquiryCreateSchema.safeParse(body);
  if (!parsed.success) return jsonError('Please check your form and try again.', 400);
  if (parsed.data.website) return jsonError('Please check your form and try again.', 400);

  try {
    const inquiry = await createInquiry(parsed.data);
    void sendLeadNotification(inquiry).catch((error) => {
      console.error('Lead notification failed', inquiry.id, error);
    });
    return jsonOk({ ok: true, inquiryId: inquiry.id }, 201);
  } catch (e) {
    console.error('Inquiry create failed', ip, e);
    return jsonError('Could not send your message. Please try again later.', 500);
  }
}
