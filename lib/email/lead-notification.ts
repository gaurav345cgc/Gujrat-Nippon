import type { InquiryRow } from '@/lib/analytics/service';

const RESEND_API_URL = 'https://api.resend.com/emails';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLeadHtml(lead: InquiryRow): string {
  const rows = [
    ['Source', lead.source === 'chatbot' ? 'Chatbot' : 'Contact form'],
    ['Name', lead.name],
    ['Company', lead.company ?? 'Not provided'],
    ['Email', lead.email],
    ['Phone', lead.phone ?? 'Not provided'],
    ['Subject', lead.subject],
    ['Status', lead.status],
    ['Received', new Date(lead.created_at).toLocaleString('en-IN')],
  ];

  const fields = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h2 style="margin:0 0 12px;">New GNIPL lead received</h2>
      <table style="border-collapse:collapse;margin-bottom:16px;">${fields}</table>
      <p style="font-weight:600;margin:0 0 6px;">Message</p>
      <div style="white-space:pre-wrap;border:1px solid #e5e7eb;padding:12px;border-radius:6px;">${escapeHtml(lead.message)}</div>
    </div>
  `;
}

export async function sendLeadNotification(lead: InquiryRow): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFICATION_FROM;
  const to = process.env.LEAD_NOTIFICATION_TO ?? process.env.ADMIN_EMAIL;

  if (!apiKey || !from || !to) return;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `[GNIPL Lead] ${lead.subject}`,
      html: formatLeadHtml(lead),
      reply_to: lead.email,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`Lead notification failed (${response.status}): ${details.slice(0, 200)}`);
  }
}
