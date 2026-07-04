'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * After a mutation: reconcile local list with server and refresh cached RSC segments.
 * Server-side tag invalidation runs in service layer; this updates the current view.
 */
export function useAdminReconcile() {
  const router = useRouter();

  const reconcile = useCallback(
    async (load?: () => Promise<void>) => {
      if (load) await load();
      router.refresh();
    },
    [router]
  );

  return { reconcile };
}
