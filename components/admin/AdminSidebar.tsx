'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { AppRole } from '@/lib/auth/types';
import {
  IconChart,
  IconChevron,
  IconDashboard,
  IconFile,
  IconHelp,
  IconInbox,
  IconShield,
  IconUserGear,
} from '@/components/admin/AdminIcons';

type Props = {
  user: { name: string; email: string; role: AppRole };
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  adminOnly?: boolean;
};

const contentLinks: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <IconDashboard />, exact: true },
  { href: '/admin/brochures', label: 'Brochures', icon: <IconFile /> },
  { href: '/admin/faqs', label: 'FAQs', icon: <IconHelp /> },
];

const operationsLinks: NavItem[] = [
  { href: '/admin/leads', label: 'Leads', icon: <IconInbox /> },
  { href: '/admin/analytics', label: 'Analytics', icon: <IconChart /> },
];

const systemLinks: NavItem[] = [
  { href: '/admin/users', label: 'Users', icon: <IconUserGear />, adminOnly: true },
  { href: '/admin/audit', label: 'Audit log', icon: <IconShield />, adminOnly: true },
];

const ADMIN_PREFETCH_ROUTES = [
  ...contentLinks,
  ...operationsLinks,
  ...systemLinks,
].map((item) => item.href);

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'GN';
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin-sidebar-collapsed');
    if (stored === '1') setCollapsed(true);
  }, []);

  useEffect(() => {
    ADMIN_PREFETCH_ROUTES.forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0');
      return next;
    });
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  function renderGroup(title: string, items: NavItem[]) {
    const visible = items.filter((item) => !item.adminOnly || user.role === 'ADMIN');
    if (visible.length === 0) return null;

    return (
      <div className="admin-nav-group" key={title}>
        <p className="admin-nav-group-title">{title}</p>
        <ul className="admin-nav-list">
          {visible.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch
                className={`admin-nav-link${isActive(link.href, link.exact) ? ' active' : ''}`}
                title={collapsed ? link.label : undefined}
              >
                {link.icon}
                <span className="admin-nav-label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const roleLabel = user.role === 'ADMIN' ? 'Admin Manager' : 'Editor';

  return (
    <aside className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-brand-icon">
          <Image src="/logo.svg" alt="Gujarat Nippon International Pvt Ltd Logo" width={32} height={32} style={{ width: 'auto', height: '32px' }} />
        </span>
        <span className="admin-sidebar-brand-text">
          <span>Gujarat Nippon International Pvt Ltd</span>
        </span>
        <button
          type="button"
          className="admin-sidebar-collapse"
          onClick={toggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IconChevron />
        </button>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {renderGroup('Content', contentLinks)}
        {renderGroup('Operations', operationsLinks)}
        {renderGroup('System', systemLinks)}
      </nav>

      <footer className="admin-user-footer">
        <div className="admin-user-card">
          <div className="admin-user-avatar" aria-hidden>
            {initials(user.name)}
          </div>
          <div className="admin-user-details">
            <p className="admin-user-name">{user.name}</p>
            <p className="admin-user-role">{roleLabel}</p>
          </div>
        </div>
        <button type="button" className="admin-logout-link" onClick={handleSignOut}>
          Log out
        </button>
      </footer>
    </aside>
  );
}
