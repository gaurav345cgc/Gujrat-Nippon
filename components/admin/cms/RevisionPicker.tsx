'use client';

import { useCallback, useEffect, useState } from 'react';

import type { PageSnapshot } from '@/lib/cms/types';

type RevisionRow = {
  id: string;
  revision_note: string | null;
  created_at: string;
};

type Props = {
  pageId: string;
  refreshToken?: number;
  onRestored: (snapshot: PageSnapshot) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export default function RevisionPicker({
  pageId,
  refreshToken = 0,
  onRestored,
  onError,
  onSuccess,
}: Props) {
  const [revisions, setRevisions] = useState<RevisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [restoring, setRestoring] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/admin/api/pages/${pageId}/revisions`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      onError(data.error ?? 'Failed to load revisions.');
      return;
    }
    setRevisions(data.revisions ?? []);
    if (data.revisions?.[0]?.id) setSelectedId(data.revisions[0].id);
  }, [pageId, onError]);

  useEffect(() => {
    load();
  }, [load, refreshToken]);

  async function handleRestore() {
    if (!selectedId) return;
    setRestoring(true);
    const res = await fetch(
      `/admin/api/pages/${pageId}/revisions/${selectedId}/restore`,
      { method: 'POST' }
    );
    const data = await res.json();
    setRestoring(false);
    if (!res.ok) {
      onError(data.error ?? 'Restore failed.');
      return;
    }
    if (!data.page) {
      onError('Restore succeeded but page data was missing.');
      return;
    }
    onSuccess('Revision restored as draft.');
    onRestored(data.page as PageSnapshot);
    load();
  }

  return (
    <section className="admin-card" style={{ marginTop: '1.5rem' }}>
      <h2 className="admin-card-section-title">Revision history</h2>
      {loading ? (
        <p className="admin-table-empty">Loading revisions…</p>
      ) : revisions.length === 0 ? (
        <p className="admin-table-empty">No revisions yet. Save a draft to create one.</p>
      ) : (
        <div className="admin-form">
          <label>
            Select revision
            <select
              className="admin-select-inline"
              style={{ width: '100%', marginBottom: '1rem' }}
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {revisions.map((revision) => (
                <option key={revision.id} value={revision.id}>
                  {new Date(revision.created_at).toLocaleString()}
                  {revision.revision_note ? ` — ${revision.revision_note}` : ''}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleRestore}
            disabled={restoring || !selectedId}
          >
            {restoring ? 'Restoring…' : 'Restore as draft'}
          </button>
        </div>
      )}
    </section>
  );
}
