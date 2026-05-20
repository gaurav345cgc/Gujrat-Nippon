'use client';

import type { ReactNode } from 'react';
import { AdminToastProvider } from '@/components/admin/AdminToastProvider';

export default function AdminProviders({ children }: { children: ReactNode }) {
  return <AdminToastProvider>{children}</AdminToastProvider>;
}
