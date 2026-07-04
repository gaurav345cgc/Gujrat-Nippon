import { Suspense } from 'react';
import { Metadata } from 'next';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRefreshButton from '@/components/admin/AdminRefreshButton';
import DashboardKpis from '@/components/admin/dashboard/DashboardKpis';
import SessionActions from '@/components/admin/SessionActions';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

function DashboardKpiFallback() {
  return (
  <>
      <section className="admin-kpi-grid" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="admin-kpi-card admin-skeleton-card" />
        ))}
      </section>
      <div className="admin-card admin-skeleton-card admin-skeleton-card--tall" />
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Operational overview for Gujarat Nippon International — manage content, leads, and site assets."
        actions={<AdminRefreshButton />}
      />

      <Suspense fallback={<DashboardKpiFallback />}>
        <DashboardKpis />
      </Suspense>

      <SessionActions />
    </div>
  );
}
