import { buildCsv } from '@/lib/admin/csv';
import type { InquiryRow } from '@/lib/analytics/service';

const HEADERS = [
  'Received',
  'Source',
  'Name',
  'Company',
  'Email',
  'Phone',
  'Subject',
  'Status',
  'Message',
  'ID',
];

export function inquiriesToCsv(rows: InquiryRow[]): string {
  const data = rows.map((i) => [
    i.created_at,
    i.source,
    i.name,
    i.company ?? '',
    i.email,
    i.phone ?? '',
    i.subject,
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
