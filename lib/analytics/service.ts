import { createAdminClient } from '@/lib/supabase/admin';
import {
  invalidateAnalyticsModule,
  invalidateLeadsModule,
} from '@/lib/admin/cache/invalidate';

export type AnalyticsSummary = {
  pageViews30d: number;
  downloads30d: number;
  inquiries30d: number;
  inquiriesNew: number;
  inquiriesTotal: number;
};

export type DailyMetric = {
  date: string;
  pageViews: number;
  downloads: number;
  inquiries: number;
};

export type TopBrochureDownload = {
  id: string;
  title: string;
  slug: string;
  downloads30d: number;
  downloadCount: number;
};

export type InquiryRow = {
  id: string;
  source: 'contact' | 'chatbot';
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'closed' | 'spam' | 'archived';
  created_at: string;
  updated_at: string;
};

const INQUIRY_SELECT =
  'id, source, name, company, email, phone, subject, message, status, created_at, updated_at';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function recordPageView(path: string): Promise<void> {
  const normalized = path.split('?')[0] || '/';
  if (
    normalized.startsWith('/admin') ||
    normalized.startsWith('/api') ||
    normalized.startsWith('/_next')
  ) {
    return;
  }
  const admin = createAdminClient();
  await admin.from('page_views').insert({ path: normalized.slice(0, 500) });
  invalidateAnalyticsModule();
}

export async function recordBrochureDownloadEvent(brochureId: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from('brochure_download_events').insert({ brochure_id: brochureId });
  invalidateAnalyticsModule();
}

export async function createInquiry(input: {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: InquiryRow['source'];
}): Promise<InquiryRow> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('inquiries')
    .insert({
      source: input.source ?? 'contact',
      name: input.name.trim(),
      company: input.company?.trim() || null,
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      subject: input.subject.trim(),
      message: input.message.trim(),
      status: 'new',
    })
    .select(INQUIRY_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to save inquiry');
  invalidateLeadsModule();
  invalidateAnalyticsModule();
  return data as InquiryRow;
}

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const admin = createAdminClient();
  const since = daysAgoIso(days);

  const [viewsRes, downloadsRes, inquiries30Res, inquiriesNewRes, inquiriesTotalRes] =
    await Promise.all([
      admin.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', since),
      admin
        .from('brochure_download_events')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since),
      admin.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', since),
      admin
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new'),
      admin.from('inquiries').select('id', { count: 'exact', head: true }),
    ]);

  return {
    pageViews30d: viewsRes.count ?? 0,
    downloads30d: downloadsRes.count ?? 0,
    inquiries30d: inquiries30Res.count ?? 0,
    inquiriesNew: inquiriesNewRes.count ?? 0,
    inquiriesTotal: inquiriesTotalRes.count ?? 0,
  };
}

export async function getDailyMetrics(days = 14): Promise<DailyMetric[]> {
  const admin = createAdminClient();
  const since = daysAgoIso(days - 1);

  const [viewsRes, downloadsRes, inquiriesRes] = await Promise.all([
    admin.from('page_views').select('created_at').gte('created_at', since),
    admin.from('brochure_download_events').select('created_at').gte('created_at', since),
    admin.from('inquiries').select('created_at').gte('created_at', since),
  ]);

  const buckets = new Map<string, DailyMetric>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, pageViews: 0, downloads: 0, inquiries: 0 });
  }

  function bump(rows: { created_at: string }[] | null, field: keyof Omit<DailyMetric, 'date'>) {
    for (const row of rows ?? []) {
      const key = row.created_at.slice(0, 10);
      const b = buckets.get(key);
      if (b) b[field]++;
    }
  }

  bump(viewsRes.data, 'pageViews');
  bump(downloadsRes.data, 'downloads');
  bump(inquiriesRes.data, 'inquiries');

  return [...buckets.values()];
}

export async function getTopBrochureDownloads(
  days = 30,
  limit = 5
): Promise<TopBrochureDownload[]> {
  const admin = createAdminClient();
  const since = daysAgoIso(days);

  const { data: events, error } = await admin
    .from('brochure_download_events')
    .select('brochure_id')
    .gte('created_at', since);

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const e of events ?? []) {
    counts.set(e.brochure_id, (counts.get(e.brochure_id) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  if (sorted.length === 0) return [];

  const ids = sorted.map(([id]) => id);
  const { data: brochures } = await admin
    .from('brochures')
    .select('id, title, slug, download_count')
    .in('id', ids);

  const byId = new Map((brochures ?? []).map((b) => [b.id, b]));

  return sorted.map(([id, downloads30d]) => {
    const b = byId.get(id);
    return {
      id,
      title: b?.title ?? 'Unknown',
      slug: b?.slug ?? '',
      downloads30d,
      downloadCount: b?.download_count ?? 0,
    };
  });
}

export async function listInquiries(
  limit = 100,
  status?: InquiryRow['status'],
  source?: InquiryRow['source']
): Promise<InquiryRow[]> {
  const admin = createAdminClient();
  let query = admin
    .from('inquiries')
    .select(INQUIRY_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (source) query = query.eq('source', source);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as InquiryRow[];
}

export async function getInquiryById(id: string): Promise<InquiryRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('inquiries')
    .select(INQUIRY_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as InquiryRow | null) ?? null;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryRow['status']
): Promise<InquiryRow> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('inquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(INQUIRY_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Update failed');
  invalidateLeadsModule();
  return data as InquiryRow;
}
