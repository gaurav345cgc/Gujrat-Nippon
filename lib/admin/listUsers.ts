import { createAdminClient } from '@/lib/supabase/admin';
import type { AppRole } from '@/lib/auth/types';

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: string;
  createdAt: string;
};

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from('profiles')
    .select('id, name, role, status, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return Promise.all(
    (profiles ?? []).map(async (profile) => {
      const { data: authUser } = await admin.auth.admin.getUserById(profile.id);
      return {
        id: profile.id,
        name: profile.name,
        email: authUser.user?.email ?? '',
        role: profile.role as AppRole,
        status: profile.status,
        createdAt: profile.created_at,
      };
    })
  );
}
