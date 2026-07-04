import './admin.css';
import AdminProviders from '@/components/admin/AdminProviders';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
