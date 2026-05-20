import { invalidateAnalyticsModule } from '@/lib/admin/cache/invalidate';

/** @deprecated Use invalidateAnalyticsModule from @/lib/admin/cache */
export function revalidateAdminAnalytics(): void {
  invalidateAnalyticsModule();
}