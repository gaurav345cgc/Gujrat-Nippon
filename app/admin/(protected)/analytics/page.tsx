import { Suspense } from 'react';
import { Metadata } from 'next';
import AnalyticsContent from '@/components/admin/analytics/AnalyticsContent';

export const metadata: Metadata = {
  title: 'Analytics',
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="admin-page">
      <Suspense fallback={<AdminAnalyticsFallback />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

function AdminAnalyticsFallback() {
  return (
    <>
      <div className="admin-skeleton-header" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-skeleton-line admin-skeleton-line--title" />
        <div className="admin-skeleton-line admin-skeleton-line--subtitle" />
      </div>
      <section className="admin-kpi-grid" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="admin-kpi-card admin-skeleton-card" />
        ))}
      </section>
      <div className="admin-card admin-skeleton-card admin-skeleton-card--tall" />
    </>
  );
}
