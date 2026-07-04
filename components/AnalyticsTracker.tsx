'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Records public page views once per path per browser session. */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (seen.current.has(pathname)) return;
    seen.current.add(pathname);

    void fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
