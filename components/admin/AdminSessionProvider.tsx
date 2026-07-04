'use client';

import { createContext, useContext } from 'react';
import type { AppRole } from '@/lib/auth/types';

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
};

const AdminSessionContext = createContext<AdminSessionUser | null>(null);

export function AdminSessionProvider({
  user,
  children,
}: {
  user: AdminSessionUser;
  children: React.ReactNode;
}) {
  return (
    <AdminSessionContext.Provider value={user}>{children}</AdminSessionContext.Provider>
  );
}

export function useAdminSession(): AdminSessionUser {
  const user = useContext(AdminSessionContext);
  if (!user) {
    throw new Error('useAdminSession must be used within AdminSessionProvider');
  }
  return user;
}
