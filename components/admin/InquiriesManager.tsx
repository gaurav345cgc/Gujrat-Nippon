'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { downloadCsv } from '@/lib/admin/csv';
import { inquiriesExportFilename, inquiriesToCsv } from '@/lib/admin/inquiriesCsv';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';
import { useAdminReconcile } from '@/lib/admin/useAdminReconcile';

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
};

type InquiriesManagerProps = {
  initialInquiries?: InquiryRow[];
};

export default function InquiriesManager({ initialInquiries }: InquiriesManagerProps) {
  const [inquiries, setInquiries] = useState<InquiryRow[]>(initialInquiries ?? []);
  const [loading, setLoading] = useState(!initialInquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const { setError, success } = useAdminFeedback();
  const { reconcile } = useAdminReconcile();

  const load = useCallback(async () => {
    const res = await fetch('/admin/api/inquiries');
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Failed to load inquiries');
      return;
    }
    setInquiries(data.inquiries);
  }, [setError]);

  useEffect(() => {
    if (initialInquiries) return;
    load();
  }, [load, initialInquiries]);

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === 'new').length,
      read: inquiries.filter((i) => i.status === 'read').length,
      archived: inquiries.filter((i) => i.status === 'archived').length,
    }),
    [inquiries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.phone ?? '').toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, statusFilter]);

  const selected = useMemo(
    () => (selectedId ? inquiries.find((i) => i.id === selectedId) ?? null : null),
    [inquiries, selectedId]
  );

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  useEffect(() => {
    if (!selected || selected.status !== 'new') return;
    void setStatus(selected.id, 'read', { silent: true });
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- mark read once when opening

  async function setStatus(
    id: string,
    status: InquiryRow['status'],
    opts?: { silent?: boolean }
  ) {
    const previous = inquiries;
    setInquiries((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
    const res = await fetch(`/admin/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setInquiries(previous);
      setError(data.error ?? 'Could not update status');
      return;
    }
    if (data.inquiry) {
      setInquiries((list) => list.map((i) => (i.id === id ? data.inquiry : i)));
    }
    if (!opts?.silent) {
      success('Inquiry status updated.', 'Updated');
      void reconcile(load);
    }
  }

  function exportFiltered() {
    if (filtered.length === 0) {
      setError('No leads to export for the current filters.');
      return;
    }
    const suffix = statusFilter !== 'all' ? `-${statusFilter}` : '-filtered';
    downloadCsv(inquiriesExportFilename(`leads${suffix}`), inquiriesToCsv(filtered));
    success(`Exported ${filtered.length} lead(s).`, 'Export ready');
  }

  async function exportAll() {
    setExporting(true);
    try {
      const qs =
        statusFilter !== 'all' ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res = await fetch(`/admin/api/inquiries/export${qs}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Export failed');
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? inquiriesExportFilename('leads');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      success('CSV download started.', 'Exported');
    } catch {
      setError('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  }

  function openLead(id: string) {
    setSelectedId(id);
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Leads"
        count={inquiries.length}
        countLabel="inquiries"
        subtitle="Contact form submissions from the public site. Click a row to view the full message."
        actions={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={exportFiltered}
              disabled={loading || filtered.length === 0}
            >
              Export filtered ({filtered.length})
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={exportAll}
              disabled={loading || exporting}
            >
              {exporting ? 'Exporting…' : 'Export all (CSV)'}
            </button>
          </>
        }
      />

      <div className="admin-pills" role="tablist" aria-label="Filter by status">
        {(
          [
            { key: 'all' as const, label: 'All', count: counts.all },
            { key: 'new' as const, label: 'New', count: counts.new },
            { key: 'read' as const, label: 'Read', count: counts.read },
            { key: 'archived' as const, label: 'Archived', count: counts.archived },
          ] as const
        ).map((pill) => (
          <button
            key={pill.key}
            type="button"
            role="tab"
            className={`admin-pill${statusFilter === pill.key ? ' active' : ''}`}
            onClick={() => setStatusFilter(pill.key)}
          >
            {pill.label}
            <span className="admin-pill-badge">{pill.count}</span>
          </button>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <span aria-hidden>🔍</span>
          <input
            type="search"
            placeholder="Search by name, email, or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <section className="admin-card admin-card-flat">
        <div className="admin-table-wrap">
          {loading ? (
            <p className="admin-table-empty">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="admin-table-empty">
              {inquiries.length === 0
                ? 'No inquiries yet. Submissions from /contact will appear here.'
                : 'No inquiries match your filters.'}
            </p>
          ) : (
            <table className="admin-table admin-table--clickable">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr
                    key={i.id}
                    className={[
                      i.status === 'new' ? 'admin-table-row--highlight' : '',
                      selectedId === i.id ? 'admin-table-row--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => openLead(i.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLead(i.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View inquiry from ${i.name}`}
                  >
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong>{new Date(i.created_at).toLocaleDateString()}</strong>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(i.created_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>
                      {i.name}
                      {i.phone && (
                        <>
                          <br />
                          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                            {i.phone}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <a
                        href={`mailto:${i.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {i.email}
                      </a>
                    </td>
                    <td className="admin-table-cell-truncate">{i.message}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="admin-select-inline"
                        value={i.status}
                        onChange={(e) =>
                          setStatus(i.id, e.target.value as InquiryRow['status'])
                        }
                        aria-label={`Status for ${i.name}`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {selected && (
        <>
          <button
            type="button"
            className="admin-lead-backdrop"
            aria-label="Close lead details"
            onClick={() => setSelectedId(null)}
          />
          <aside
            className="admin-lead-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-lead-detail-title"
          >
            <header className="admin-lead-detail-header">
              <div>
                <h2 id="admin-lead-detail-title" className="admin-lead-detail-title">
                  {selected.name}
                </h2>
                <p className="admin-lead-detail-meta">
                  {new Date(selected.created_at).toLocaleString()}
                  {selected.status === 'new' && (
                    <span className="admin-lead-badge">New</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                className="admin-lead-detail-close"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <dl className="admin-lead-detail-fields">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </dd>
              </div>
              {selected.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${selected.phone.replace(/\s/g, '')}`}>{selected.phone}</a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Status</dt>
                <dd>
                  <select
                    className="admin-select-inline"
                    value={selected.status}
                    onChange={(e) =>
                      setStatus(selected.id, e.target.value as InquiryRow['status'])
                    }
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </dd>
              </div>
              <div className="admin-lead-detail-message">
                <dt>Message</dt>
                <dd>{selected.message}</dd>
              </div>
            </dl>

            <footer className="admin-lead-detail-footer">
              <a className="admin-btn" href={`mailto:${selected.email}`}>
                Reply by email
              </a>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  downloadCsv(
                    inquiriesExportFilename(`lead-${selected.id.slice(0, 8)}`),
                    inquiriesToCsv([selected])
                  );
                }}
              >
                Export this lead
              </button>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}
