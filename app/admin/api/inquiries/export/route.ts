import { requireValidSession } from '@/lib/auth/guards';
import { inquiriesExportFilename, inquiriesToCsv } from '@/lib/admin/inquiriesCsv';
import { listInquiries, type InquiryRow } from '@/lib/analytics/service';
import { jsonError } from '@/lib/http';

const EXPORT_LIMIT = 5000;

export async function GET(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const statusParam = new URL(request.url).searchParams.get('status');
  const status =
    statusParam === 'new' || statusParam === 'read' || statusParam === 'archived'
      ? (statusParam as InquiryRow['status'])
      : undefined;

  try {
    const inquiries = await listInquiries(EXPORT_LIMIT, status);
    const csv = inquiriesToCsv(inquiries);
    const suffix = status ? `-${status}` : '';
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${inquiriesExportFilename(`leads${suffix}`)}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return jsonError('Failed to export inquiries.', 500);
  }
}
