import type { AppRole } from '@/lib/auth/types';

export function isAdmin(role: AppRole | string | undefined): boolean {
  return role === 'ADMIN';
}

export function canManageUsers(role: AppRole | string | undefined): boolean {
  return isAdmin(role);
}

export function pathRequiresAdmin(pathname: string): boolean {
  if (pathname.startsWith('/admin/users')) return true;
  if (pathname.startsWith('/admin/api/users')) return true;
  if (pathname.startsWith('/admin/audit')) return true;
  return false;
}
