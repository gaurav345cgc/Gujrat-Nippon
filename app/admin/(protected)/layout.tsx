import { redirectIfUnauthenticated } from '@/lib/auth/guards';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminSessionProvider } from '@/components/admin/AdminSessionProvider';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await redirectIfUnauthenticated();

  return (
    <AdminSessionProvider user={session.user}>
      <div className="admin-shell">
        <AdminSidebar
          user={{
            name: session.user.name ?? 'User',
            email: session.user.email ?? '',
            role: session.user.role,
          }}
        />
        <main className="admin-main">
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
    </AdminSessionProvider>
  );
}
