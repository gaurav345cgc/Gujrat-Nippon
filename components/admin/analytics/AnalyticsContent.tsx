import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRefreshButton from '@/components/admin/AdminRefreshButton';
import {
  getCachedAnalyticsSummary,
  getCachedDailyMetrics,
  getCachedTopBrochureDownloads,
} from '@/lib/admin/cache/queries';

function formatDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const emptySummary = {
  pageViews30d: 0,
  downloads30d: 0,
  inquiries30d: 0,
  inquiriesNew: 0,
  inquiriesTotal: 0,
};

export default async function AnalyticsContent() {
  let summary = emptySummary;
  let daily: Awaited<ReturnType<typeof getCachedDailyMetrics>> = [];
  let topBrochures: Awaited<ReturnType<typeof getCachedTopBrochureDownloads>> = [];
  let loadError: string | null = null;

  try {
    [summary, daily, topBrochures] = await Promise.all([
      getCachedAnalyticsSummary(),
      getCachedDailyMetrics(),
      getCachedTopBrochureDownloads(),
    ]);
  } catch {
    loadError = 'Analytics tables may be missing. Run supabase/migrations/007_analytics.sql.';
  }

  const maxBar = Math.max(
    1,
    ...daily.flatMap((d) => [d.pageViews, d.downloads, d.inquiries])
  );

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        subtitle="Page views, brochure downloads, and contact inquiries (last 30 days)."
        actions={<AdminRefreshButton />}
      />

      {loadError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {loadError}
        </div>
      )}

      <section className="admin-kpi-grid" aria-label="Summary metrics">
        <article className="admin-kpi-card">
          <p className="admin-kpi-label">Page views (30d)</p>
          <p className="admin-kpi-value">{summary.pageViews30d.toLocaleString()}</p>
          <span className="admin-kpi-trend admin-kpi-trend--up">Public site traffic</span>
        </article>
        <article className="admin-kpi-card">
          <p className="admin-kpi-label">Brochure downloads (30d)</p>
          <p className="admin-kpi-value">{summary.downloads30d.toLocaleString()}</p>
          <span className="admin-kpi-trend admin-kpi-trend--up">PDF download events</span>
        </article>
        <article className="admin-kpi-card">
          <p className="admin-kpi-label">Inquiries (30d)</p>
          <p className="admin-kpi-value">{summary.inquiries30d.toLocaleString()}</p>
          <span className="admin-kpi-trend admin-kpi-trend--neutral">
            {summary.inquiriesNew} new unread
          </span>
        </article>
        <article className="admin-kpi-card">
          <p className="admin-kpi-label">Total inquiries</p>
          <p className="admin-kpi-value">{summary.inquiriesTotal.toLocaleString()}</p>
          <span className="admin-kpi-trend admin-kpi-trend--neutral">All time</span>
        </article>
      </section>

      <section className="admin-card admin-chart-card">
        <div className="admin-page-header" style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Last 14 days</h2>
          <div className="admin-chart-legend">
            <span>
              <i style={{ background: 'var(--admin-info)' }} /> Page views
            </span>
            <span>
              <i style={{ background: '#f59e0b' }} /> Downloads
            </span>
            <span>
              <i style={{ background: 'var(--admin-brand)' }} /> Inquiries
            </span>
          </div>
        </div>
        <div className="admin-chart-bars" role="img" aria-label="Daily engagement chart">
          {daily.map((day) => (
            <div key={day.date} className="admin-chart-bar-group">
              <div className="admin-chart-bar-stack">
                <div
                  className="admin-chart-bar admin-chart-bar--inquiry"
                  style={{ height: `${(day.inquiries / maxBar) * 100}%` }}
                  title={`${day.inquiries} inquiries`}
                />
                <div
                  className="admin-chart-bar admin-chart-bar--revenue"
                  style={{ height: `${(day.downloads / maxBar) * 100}%` }}
                  title={`${day.downloads} downloads`}
                />
                <div
                  className="admin-chart-bar admin-chart-bar--margin"
                  style={{ height: `${(day.pageViews / maxBar) * 100}%` }}
                  title={`${day.pageViews} views`}
                />
              </div>
              <span className="admin-chart-bar-label">{formatDayLabel(day.date)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-two-col">
        <section className="admin-card">
          <h2 className="admin-card-section-title">Top brochures (30d)</h2>
          {topBrochures.length === 0 ? (
            <p className="admin-link-muted">No downloads recorded yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>30d</th>
                  <th>All time</th>
                </tr>
              </thead>
              <tbody>
                {topBrochures.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        /download/{b.slug}
                      </span>
                    </td>
                    <td>{b.downloads30d}</td>
                    <td>{b.downloadCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="admin-card">
          <h2 className="admin-card-section-title">Notes</h2>
          <p className="admin-link-muted" style={{ marginTop: 0 }}>
            Page views are counted once per path per browser session. Download counts include every
            PDF served from <code>/download/[slug]</code>. Inquiries come from the contact form.
          </p>
        </section>
      </div>
    </>
  );
}
