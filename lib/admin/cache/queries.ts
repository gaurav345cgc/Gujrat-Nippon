import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { listAdminUsers } from '@/lib/admin/listUsers';
import { ADMIN_CACHE_TTL } from '@/lib/admin/cache/config';
import { logCacheFetch } from '@/lib/admin/cache/log';
import { ADMIN_CACHE_TAGS } from '@/lib/admin/cache/tags';
import {
  getAnalyticsSummary,
  getDailyMetrics,
  getTopBrochureDownloads,
  listInquiries,
  type AnalyticsSummary,
} from '@/lib/analytics/service';
import { listBrochuresAdmin, type BrochureListItem } from '@/lib/brochures/service';
import { listFaqsAdmin, type FaqRecord } from '@/lib/faqs/service';
import type { InquiryRow } from '@/lib/analytics/service';
import type { AdminUserRow } from '@/lib/admin/listUsers';

export type DashboardSummary = {
  brochureCount: number;
  faqCount: number;
  publishedCount: number;
  analytics: AnalyticsSummary;
};

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  logCacheFetch(ADMIN_CACHE_TAGS.dashboardSummary);
  const admin = createAdminClient();
  const [brochuresRes, faqsRes, publishedRes, analytics] = await Promise.all([
    admin.from('brochures').select('id', { count: 'exact', head: true }),
    admin.from('faqs').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    admin
      .from('brochures')
      .select('id', { count: 'exact', head: true })
      .eq('published', true),
    getAnalyticsSummary(30).catch(() => ({
      pageViews30d: 0,
      downloads30d: 0,
      inquiries30d: 0,
      inquiriesNew: 0,
      inquiriesTotal: 0,
    })),
  ]);

  return {
    brochureCount: brochuresRes.count ?? 0,
    faqCount: faqsRes.count ?? 0,
    publishedCount: publishedRes.count ?? 0,
    analytics,
  };
}

export const getCachedDashboardSummary = unstable_cache(
  fetchDashboardSummary,
  ['admin-dashboard-summary'],
  { tags: [ADMIN_CACHE_TAGS.dashboardSummary], revalidate: ADMIN_CACHE_TTL.volatile }
);

async function fetchCachedBrochuresList(): Promise<BrochureListItem[]> {
  logCacheFetch(ADMIN_CACHE_TAGS.brochuresList);
  return listBrochuresAdmin();
}

export const getCachedBrochuresList = unstable_cache(
  fetchCachedBrochuresList,
  ['admin-brochures-list'],
  { tags: [ADMIN_CACHE_TAGS.brochuresList], revalidate: ADMIN_CACHE_TTL.moderate }
);

async function fetchCachedFaqsList(): Promise<FaqRecord[]> {
  logCacheFetch(ADMIN_CACHE_TAGS.faqsList);
  return listFaqsAdmin();
}

export const getCachedFaqsList = unstable_cache(
  fetchCachedFaqsList,
  ['admin-faqs-list'],
  { tags: [ADMIN_CACHE_TAGS.faqsList], revalidate: ADMIN_CACHE_TTL.moderate }
);

async function fetchCachedLeadsList(): Promise<InquiryRow[]> {
  logCacheFetch(ADMIN_CACHE_TAGS.leadsList);
  return listInquiries(500);
}

export const getCachedLeadsList = unstable_cache(
  fetchCachedLeadsList,
  ['admin-leads-list'],
  { tags: [ADMIN_CACHE_TAGS.leadsList], revalidate: ADMIN_CACHE_TTL.leads }
);

async function fetchCachedAnalyticsSummary(): Promise<AnalyticsSummary> {
  logCacheFetch(ADMIN_CACHE_TAGS.analyticsSummary);
  return getAnalyticsSummary(30);
}

export const getCachedAnalyticsSummary = unstable_cache(
  fetchCachedAnalyticsSummary,
  ['admin-analytics-summary'],
  { tags: [ADMIN_CACHE_TAGS.analyticsSummary], revalidate: ADMIN_CACHE_TTL.volatile }
);

async function fetchCachedDailyMetrics() {
  logCacheFetch(ADMIN_CACHE_TAGS.analyticsDaily);
  return getDailyMetrics(14);
}

export const getCachedDailyMetrics = unstable_cache(
  fetchCachedDailyMetrics,
  ['admin-analytics-daily'],
  { tags: [ADMIN_CACHE_TAGS.analyticsDaily], revalidate: ADMIN_CACHE_TTL.volatile }
);

async function fetchCachedTopBrochureDownloads() {
  logCacheFetch(ADMIN_CACHE_TAGS.analyticsTopBrochures);
  return getTopBrochureDownloads(30, 8);
}

export const getCachedTopBrochureDownloads = unstable_cache(
  fetchCachedTopBrochureDownloads,
  ['admin-analytics-top-brochures'],
  { tags: [ADMIN_CACHE_TAGS.analyticsTopBrochures], revalidate: ADMIN_CACHE_TTL.volatile }
);

async function fetchCachedUsersList(): Promise<AdminUserRow[]> {
  logCacheFetch(ADMIN_CACHE_TAGS.usersList);
  return listAdminUsers();
}

export const getCachedUsersList = unstable_cache(
  fetchCachedUsersList,
  ['admin-users-list'],
  { tags: [ADMIN_CACHE_TAGS.usersList], revalidate: ADMIN_CACHE_TTL.users }
);
