import { Metadata } from 'next';
import { redirectIfNotAdmin } from '@/lib/auth/guards';
import UsersManager from '@/components/admin/UsersManager';
import { getCachedUsersList } from '@/lib/admin/cache/queries';

export const metadata: Metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  await redirectIfNotAdmin();
  const initialUsers = await getCachedUsersList();
  return <UsersManager initialUsers={initialUsers} />;
}
