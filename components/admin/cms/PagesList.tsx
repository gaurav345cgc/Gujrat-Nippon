'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

type PageRow = {
  id: string;
  slug: string;
  path: string;
  title: string;
  status: string;
  updated_at: string;
};

type Props = {
  initialPages?: PageRow[];
};

function statusClass(status: string): string {
  if (status === 'published') return 'admin-status admin-status--success';
  if (status === 'draft') return 'admin-status admin-status--neutral';
  return 'admin-status admin-status--warning';
}

export default function PagesList({ initialPages }: Props) {
  const [pages, setPages] = useState<PageRow[]>(initialPages ?? []);
  const [loading, setLoading] = useState(!initialPages);
  const { setError } = useAdminFeedback();

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch('/admin/api/pages');
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Failed to load pages.');
      return;
    }
    setPages(data.pages ?? []);
  }, [setError]);

  useEffect(() => {
    if (initialPages) return;
    load();
  }, [load, initialPages]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Pages"
        subtitle="Edit contractual marketing pages. Slug and URL path are fixed per site contract."
      />

      <section className="admin-card admin-card-flat">
        <div className="admin-table-wrap">
          {loading ? (
            <p className="admin-table-empty">Loading pages…</p>
          ) : pages.length === 0 ? (
            <p className="admin-table-empty">
              No pages found. Apply the CMS migration and run <code>npm run db:seed:cms</code>.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td>{page.title}</td>
                    <td>
                      <code>{page.slug}</code>
                    </td>
                    <td>
                      <span className={statusClass(page.status)}>
                        <span className="admin-status-dot" />
                        {page.status}
                      </span>
                    </td>
                    <td>{new Date(page.updated_at).toLocaleString()}</td>
                    <td>
                      <Link
                        href={`/admin/pages/${page.slug}`}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
