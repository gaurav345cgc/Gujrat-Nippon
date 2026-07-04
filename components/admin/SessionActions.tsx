'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

export default function SessionActions() {
  const router = useRouter();
  const { setError, info } = useAdminFeedback();

  async function revokeAll() {
    const res = await fetch('/admin/api/auth/revoke-sessions', { method: 'POST' });
    const data = await res.json();

    if (res.ok) {
      info(data.message ?? 'All sessions ended. Signing you out…', 'Sessions revoked');
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } else {
      setError(data.error ?? 'Could not revoke sessions.');
    }
  }

  return (
    <section className="admin-card">
      <h2 className="admin-card-section-title">Security</h2>
      <p className="admin-link-muted">
        Revoke all active sessions on every device. You will be signed out here as well.
      </p>
      <button type="button" className="admin-btn admin-btn-secondary" onClick={revokeAll}>
        Revoke all sessions
      </button>
    </section>
  );
}
