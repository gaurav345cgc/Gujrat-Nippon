import Link from 'next/link';
import { getCachedDashboardSummary } from '@/lib/admin/cache/queries';
import {
  IconChart,
  IconFile,
  IconHelp,
  IconInbox,
} from '@/components/admin/AdminIcons';

export default async function DashboardKpis() {
  const { brochureCount, faqCount, publishedCount, analytics } =
    await getCachedDashboardSummary();

  return (
    <>
      <section className="admin-kpi-grid" aria-label="Key metrics">
        <article className="admin-kpi-card">
          <div className="admin-kpi-icon" aria-hidden>
            <IconFile />
          </div>
          <p className="admin-kpi-label">Brochures</p>
          <p className="admin-kpi-value">{brochureCount}</p>
          <span className="admin-kpi-trend admin-kpi-trend--up">↗ {publishedCount} published</span>
        </article>
        <article className="admin-kpi-card">
          <div className="admin-kpi-icon" aria-hidden>
            <IconHelp />
          </div>
          <p className="admin-kpi-label">FAQ entries</p>
          <p className="admin-kpi-value">{faqCount}</p>
          <span className="admin-kpi-trend admin-kpi-trend--up">Chatbot source</span>
        </article>
        <article className="admin-kpi-card">
          <div className="admin-kpi-icon" aria-hidden>
            <IconInbox />
          </div>
          <p className="admin-kpi-label">Inquiries (30d)</p>
          <p className="admin-kpi-value">{analytics.inquiries30d}</p>
          <span className="admin-kpi-trend admin-kpi-trend--neutral">
            {analytics.inquiriesNew} new
          </span>
        </article>
        <article className="admin-kpi-card">
          <div className="admin-kpi-icon" aria-hidden>
            <IconChart />
          </div>
          <p className="admin-kpi-label">Page views (30d)</p>
          <p className="admin-kpi-value">{analytics.pageViews30d}</p>
          <span className="admin-kpi-trend admin-kpi-trend--up">
            {analytics.downloads30d} downloads
          </span>
        </article>
      </section>

      <section className="admin-card">
        <h2 className="admin-card-section-title">Quick actions</h2>
        <div className="admin-quick-grid">
          <Link href="/admin/brochures" className="admin-quick-link" prefetch>
            <strong>Brochures</strong>
            <span>Upload and replace PDF catalogues</span>
          </Link>
          <Link href="/admin/faqs" className="admin-quick-link" prefetch>
            <strong>FAQs</strong>
            <span>Edit chatbot knowledge base</span>
          </Link>
          <Link href="/admin/leads" className="admin-quick-link" prefetch>
            <strong>Leads</strong>
            <span>Review inquiries and export</span>
          </Link>
          <Link href="/admin/analytics" className="admin-quick-link" prefetch>
            <strong>Analytics</strong>
            <span>Views, downloads, and trends</span>
          </Link>
        </div>
      </section>
    </>
  );
}
