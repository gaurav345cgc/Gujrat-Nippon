import { buildCsv } from '@/lib/admin/csv';
import type { InquiryRow } from '@/lib/analytics/service';

const HEADERS = ['Received', 'Name', 'Email', 'Phone', 'Status', 'Message', 'ID'];

export function inquiriesToCsv(rows: InquiryRow[]): string {
  const data = rows.map((i) => [
    i.created_at,
    i.name,
    i.email,
    i.phone ?? '',
    i.status,
    i.message,
    i.id,
  ]);
  return buildCsv(HEADERS, data);
}

export function inquiriesExportFilename(prefix = 'leads'): string {
  const d = new Date().toISOString().slice(0, 10);
  return `${prefix}-${d}.csv`;
}
