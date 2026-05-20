import { Metadata } from 'next';
import { redirectIfNotAdmin } from '@/lib/auth/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = {
  title: 'Audit Log',
  robots: { index: false, follow: false },
};

function actionStatus(action: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
  if (action.includes('deleted') || action.includes('revoke')) return 'danger';
  if (action.includes('created')) return 'success';
  if (action.includes('updated') || action.includes('reordered')) return 'info';
  if (action.includes('status')) return 'warning';
  return 'neutral';
}

export default async function AdminAuditPage() {
  await redirectIfNotAdmin();

  const admin = createAdminClient();
  const { data: logs } = await admin
    .from('audit_logs')
    .select('id, action, actor_id, entity_type, entity_id, ip, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(100);

  const entries = logs ?? [];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Audit log"
        count={entries.length}
        countLabel="events"
        subtitle="Last 100 security and admin actions across the panel."
      />

      <section className="admin-card admin-card-flat">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Actor</th>
                <th>IP</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty">
                    No audit entries yet.
                  </td>
                </tr>
              ) : (
                entries.map((row) => {
                  const status = actionStatus(row.action);
                  return (
                    <tr key={row.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <strong>{new Date(row.created_at).toLocaleDateString()}</strong>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {new Date(row.created_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status admin-status--${status}`}>
                          <span className="admin-status-dot" />
                          {row.action}
                        </span>
                      </td>
                      <td>
                        {row.entity_type ?? '—'}
                        {row.entity_id && (
                          <>
                            <br />
                            <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                              {row.entity_id.slice(0, 8)}…
                            </span>
                          </>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem', maxWidth: 120 }}>
                        {row.actor_id ? `${row.actor_id.slice(0, 8)}…` : '—'}
                      </td>
                      <td>{row.ip ?? '—'}</td>
                      <td style={{ fontSize: '0.8rem', maxWidth: 240 }}>
                        {row.metadata ? JSON.stringify(row.metadata) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
