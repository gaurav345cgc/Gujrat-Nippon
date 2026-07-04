import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import type { AdminSession, ProfileRow } from '@/lib/auth/types';

const loadSession = cache(async function loadSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, status')
    .eq('id', user.id)
    .single<Pick<ProfileRow, 'name' | 'role' | 'status'>>();

  if (!profile || profile.status !== 'ACTIVE') {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
    },
  };
});

export async function requireValidSession(): Promise<AdminSession | null> {
  return loadSession();
}

export async function requireValidAdminSession(): Promise<AdminSession | null> {
  const session = await loadSession();
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function redirectIfUnauthenticated(): Promise<AdminSession> {
  const session = await loadSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

export async function redirectIfNotAdmin(): Promise<AdminSession> {
  const session = await requireValidAdminSession();
  if (!session) {
    redirect('/admin');
  }
  return session;
}
