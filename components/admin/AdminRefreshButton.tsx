'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ADMIN_CACHE_TAGS } from '@/lib/admin/cache/tags';

const DASHBOARD_TAGS = [
  ADMIN_CACHE_TAGS.dashboardSummary,
  ADMIN_CACHE_TAGS.analyticsSummary,
  ADMIN_CACHE_TAGS.analyticsDaily,
  ADMIN_CACHE_TAGS.analyticsTopBrochures,
] as const;

/** Soft-refresh dashboard/analytics widgets (invalidates tags + re-fetches RSC). */
export default function AdminRefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="admin-btn admin-btn-secondary"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch('/admin/api/cache/invalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tags: [...DASHBOARD_TAGS] }),
          }).catch(() => undefined);
          router.refresh();
        });
      }}
    >
      {pending ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}
