import { revalidateTag } from 'next/cache';
import { ADMIN_CACHE_TAGS, type AdminCacheTag } from '@/lib/admin/cache/tags';
import { logCacheInvalidate } from '@/lib/admin/cache/log';

export function invalidateAdminCache(...tags: AdminCacheTag[]): void {
  const unique = [...new Set(tags)];
  if (unique.length === 0) return;

  try {
    logCacheInvalidate(unique);
    for (const tag of unique) {
      revalidateTag(tag, 'max');
    }
  } catch {
    // Outside a request context (scripts, etc.).
  }
}

export function invalidateBrochuresModule(): void {
  invalidateAdminCache(ADMIN_CACHE_TAGS.brochuresList, ADMIN_CACHE_TAGS.dashboardSummary);
}

export function invalidateFaqsModule(): void {
  invalidateAdminCache(ADMIN_CACHE_TAGS.faqsList, ADMIN_CACHE_TAGS.dashboardSummary);
}

export function invalidateLeadsModule(): void {
  invalidateAdminCache(
    ADMIN_CACHE_TAGS.leadsList,
    ADMIN_CACHE_TAGS.dashboardSummary,
    ADMIN_CACHE_TAGS.analyticsSummary,
    ADMIN_CACHE_TAGS.analyticsDaily
  );
}

export function invalidateAnalyticsModule(): void {
  invalidateAdminCache(
    ADMIN_CACHE_TAGS.analyticsSummary,
    ADMIN_CACHE_TAGS.analyticsDaily,
    ADMIN_CACHE_TAGS.analyticsTopBrochures,
    ADMIN_CACHE_TAGS.dashboardSummary
  );
}

export function invalidateUsersModule(): void {
  invalidateAdminCache(ADMIN_CACHE_TAGS.usersList);
}
