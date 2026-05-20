'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminSession } from '@/components/admin/AdminSessionProvider';
import { BROCHURE_CATEGORIES } from '@/lib/brochures/constants';
import type { BrochureListItem } from '@/lib/brochures/service';
import { formatFileSize } from '@/lib/brochures/format';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';
import { useAdminReconcile } from '@/lib/admin/useAdminReconcile';

type BrochureRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  published: boolean;
  sort_order: number;
  download_count: number;
  updated_at: string;
  file_size_bytes: number | null;
  original_filename: string | null;
  version_no: number | null;
};

type VersionRow = {
  id: string;
  version_no: number;
  original_filename: string;
  file_size_bytes: number;
  created_at: string;
};

const PUBLISH_OPTIONS = [
  { value: 'draft', label: 'Draft (unpublished)' },
  { value: 'published', label: 'Published' },
] as const;

const emptyCreate = {
  title: '',
  description: '',
  category: 'Technical',
  thumbnailUrl: '',
  publishStatus: 'draft' as (typeof PUBLISH_OPTIONS)[number]['value'],
};

type BrochuresManagerProps = {
  initialBrochures?: BrochureListItem[];
};

export default function BrochuresManager({ initialBrochures }: BrochuresManagerProps) {
  const { role: userRole } = useAdminSession();
  const [brochures, setBrochures] = useState<BrochureRow[]>(initialBrochures ?? []);
  const [loading, setLoading] = useState(!initialBrochures);
  const { setError, flash, success } = useAdminFeedback();
  const { reconcile } = useAdminReconcile();
  const [create, setCreate] = useState(emptyCreate);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createThumbnailFile, setCreateThumbnailFile] = useState<File | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ title: '', description: '', thumbnailUrl: '' });
  const [editOriginalThumbnail, setEditOriginalThumbnail] = useState('');
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const mergeBrochureRow = useCallback(
    (existing: BrochureRow, raw: Record<string, unknown>): BrochureRow => ({
      ...existing,
      slug: (raw.slug as string) ?? existing.slug,
      title: (raw.title as string) ?? existing.title,
      description: (raw.description as string) ?? existing.description,
      category: (raw.category as string) ?? existing.category,
      thumbnail_url:
        raw.thumbnail_url !== undefined
          ? (raw.thumbnail_url as string | null)
          : existing.thumbnail_url,
      published: raw.published !== undefined ? Boolean(raw.published) : existing.published,
      sort_order: raw.sort_order !== undefined ? Number(raw.sort_order) : existing.sort_order,
      download_count:
        raw.download_count !== undefined ? Number(raw.download_count) : existing.download_count,
      updated_at: (raw.updated_at as string) ?? existing.updated_at,
      file_size_bytes:
        raw.file_size_bytes !== undefined
          ? (raw.file_size_bytes as number | null)
          : existing.file_size_bytes,
      original_filename:
        raw.original_filename !== undefined
          ? (raw.original_filename as string | null)
          : existing.original_filename,
      version_no:
        raw.version_no !== undefined ? (raw.version_no as number | null) : existing.version_no,
    }),
    []
  );

  const load = useCallback(async () => {
    const res = await fetch('/admin/api/brochures');
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Failed to load brochures');
      return;
    }
    setBrochures(data.brochures);
  }, []);

  useEffect(() => {
    if (initialBrochures) return;
    load();
  }, [load, initialBrochures]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createFile) {
      setError('Select a PDF file.');
      return;
    }
    setCreating(true);
    setError(null);
    const fd = new FormData();
    fd.append('title', create.title);
    fd.append('description', create.description);
    fd.append('category', create.category);
    if (createThumbnailFile) {
      fd.append('thumbnail', createThumbnailFile);
    } else if (create.thumbnailUrl.trim()) {
      fd.append('thumbnailUrl', create.thumbnailUrl.trim());
    }
    fd.append('published', String(create.publishStatus === 'published'));
    fd.append('file', createFile);

    const res = await fetch('/admin/api/brochures', { method: 'POST', body: fd });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error ?? 'Create failed');
      return;
    }
    const created = data.brochure as { id: string; slug: string };
    const file = createFile;
    const newRow: BrochureRow = {
      id: created.id,
      slug: created.slug,
      title: create.title.trim(),
      description: create.description.trim(),
      category: create.category,
      thumbnail_url: create.thumbnailUrl.trim() || null,
      published: create.publishStatus === 'published',
      sort_order: brochures.length,
      download_count: 0,
      updated_at: new Date().toISOString(),
      file_size_bytes: file?.size ?? null,
      original_filename: file?.name ?? null,
      version_no: 1,
    };
    setBrochures((prev) => [...prev, newRow]);
    flash('The catalogue entry is ready in your list.', 'Brochure created');
    void reconcile(load);
    setCreate(emptyCreate);
    setCreateFile(null);
    setCreateThumbnailFile(null);
    setShowCreate(false);
  }

  function closeCreateForm() {
    setShowCreate(false);
    setCreate(emptyCreate);
    setCreateFile(null);
    setCreateThumbnailFile(null);
  }

  function applyBrochurePatch(row: BrochureRow, patch: Record<string, unknown>): BrochureRow {
    return {
      ...row,
      ...(patch.title !== undefined ? { title: String(patch.title) } : {}),
      ...(patch.description !== undefined ? { description: String(patch.description) } : {}),
      ...(patch.category !== undefined ? { category: String(patch.category) } : {}),
      ...(patch.slug !== undefined ? { slug: String(patch.slug) } : {}),
      ...(patch.thumbnailUrl !== undefined
        ? { thumbnail_url: patch.thumbnailUrl as string | null }
        : {}),
      ...(patch.published !== undefined ? { published: Boolean(patch.published) } : {}),
      ...(patch.sortOrder !== undefined ? { sort_order: Number(patch.sortOrder) } : {}),
    };
  }

  async function patchBrochure(id: string, patch: Record<string, unknown>) {
    const previous = brochures;
    setBrochures((prev) =>
      prev.map((b) => (b.id === id ? applyBrochurePatch(b, patch) : b))
    );
    setError(null);
    const res = await fetch(`/admin/api/brochures/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      setBrochures(previous);
      setError(data.error ?? 'Update failed');
      return false;
    }
    if (data.brochure) {
      setBrochures((prev) =>
        prev.map((b) => (b.id === id ? mergeBrochureRow(b, data.brochure) : b))
      );
    }
    return true;
  }

  async function handleReplace(id: string, file: File) {
    const previous = brochures;
    setReplacingId(id);
    setBrochures((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              original_filename: file.name,
              file_size_bytes: file.size,
              version_no: (b.version_no ?? 0) + 1,
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );
    setError(null);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`/admin/api/brochures/${id}/replace`, { method: 'POST', body: fd });
    const data = await res.json();
    setReplacingId(null);
    if (!res.ok) {
      setBrochures(previous);
      setError(data.error ?? 'Replace failed');
      return;
    }
    flash('A new PDF version is live. The download link stayed the same.', 'PDF replaced');
    if (data.version) {
      setBrochures((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                file_size_bytes: data.version.file_size_bytes,
                original_filename: data.version.original_filename,
                version_no: data.version.version_no,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );
    }
    if (expandedId === id) void loadVersions(id);
  }

  async function loadVersions(id: string) {
    setVersionsLoading(true);
    const res = await fetch(`/admin/api/brochures/${id}/versions`);
    const data = await res.json();
    setVersionsLoading(false);
    if (res.ok) setVersions(data.versions);
  }

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setVersions([]);
    await loadVersions(id);
  }

  function startEdit(b: BrochureRow) {
    setEditingId(b.id);
    const thumb = b.thumbnail_url ?? '';
    setEditDraft({
      title: b.title,
      description: b.description,
      thumbnailUrl: thumb,
    });
    setEditOriginalThumbnail(thumb);
    setEditThumbnailFile(null);
  }

  async function moveBrochure(id: string, direction: 'up' | 'down') {
    const i = brochures.findIndex((b) => b.id === id);
    if (i < 0) return;
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= brochures.length) return;
    const previous = brochures;
    const next = [...brochures];
    [next[i], next[j]] = [next[j], next[i]];
    setBrochures(next.map((b, sort_order) => ({ ...b, sort_order })));
    setError(null);
    const res = await fetch('/admin/api/brochures/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, direction }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBrochures(previous);
      setError(data.error ?? 'Could not reorder');
    }
  }

  async function saveEdit(id: string) {
    const title = editDraft.title.trim();
    const description = editDraft.description.trim();
    const thumbUrl = editDraft.thumbnailUrl.trim();
    const thumbFile = editThumbnailFile;
    const thumbChanged = !!thumbFile || thumbUrl !== editOriginalThumbnail.trim();
    const previousBrochures = brochures;

    setSavingId(id);
    setEditingId(null);
    setEditThumbnailFile(null);
    setError(null);

    const ok = await patchBrochure(id, { title, description });
    if (!ok) {
      setSavingId(null);
      setEditingId(id);
      setEditDraft({ title, description, thumbnailUrl: thumbUrl });
      if (thumbFile) setEditThumbnailFile(thumbFile);
      return;
    }

    if (thumbChanged) {
      if (thumbFile) {
        const preview = URL.createObjectURL(thumbFile);
        setBrochures((prev) =>
          prev.map((b) => (b.id === id ? { ...b, thumbnail_url: preview } : b))
        );
      } else {
        setBrochures((prev) =>
          prev.map((b) => (b.id === id ? { ...b, thumbnail_url: thumbUrl || null } : b))
        );
      }
      const fd = new FormData();
      if (thumbFile) {
        fd.append('thumbnail', thumbFile);
      } else {
        fd.append('thumbnailUrl', thumbUrl);
      }
      const thumbRes = await fetch(`/admin/api/brochures/${id}/thumbnail`, {
        method: 'POST',
        body: fd,
      });
      const thumbData = await thumbRes.json();
      if (!thumbRes.ok) {
        setBrochures(previousBrochures);
        setSavingId(null);
        setEditingId(id);
        setEditDraft({ title, description, thumbnailUrl: thumbUrl });
        if (thumbFile) setEditThumbnailFile(thumbFile);
        setError(thumbData.error ?? 'Thumbnail update failed');
        return;
      }
      if (thumbData.thumbnailUrl) {
        setBrochures((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, thumbnail_url: thumbData.thumbnailUrl as string } : b
          )
        );
      }
    }

    setSavingId(null);
    flash('Title, description, and thumbnail were saved.', 'Brochure updated');
  }

  async function handleDelete(id: string, title: string) {
    if (
      !window.confirm(
        `Delete "${title}" permanently?\n\nThis removes the brochure, all file versions, and storage files. This cannot be undone.`
      )
    ) {
      return;
    }
    const previous = brochures;
    setDeletingId(id);
    setBrochures((prev) => prev.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
    setError(null);
    const res = await fetch(`/admin/api/brochures/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setDeletingId(null);
    if (!res.ok) {
      setBrochures(previous);
      setError(data.error ?? 'Delete failed');
      return;
    }
    flash('The brochure and its files were removed.', 'Brochure deleted');
    void reconcile(load);
  }

  async function restoreVersion(brochureId: string, versionId: string) {
    const restored = versions.find((v) => v.id === versionId);
    if (!restored) return;
    const previous = brochures;
    setRestoringId(versionId);
    setBrochures((prev) =>
      prev.map((b) =>
        b.id === brochureId
          ? {
              ...b,
              file_size_bytes: restored.file_size_bytes,
              original_filename: restored.original_filename,
              version_no: restored.version_no,
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );
    setError(null);
    const res = await fetch(`/admin/api/brochures/${brochureId}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    });
    const data = await res.json();
    setRestoringId(null);
    if (!res.ok) {
      setBrochures(previous);
      setError(data.error ?? 'Restore failed');
      return;
    }
    flash('Visitors will download this older file version.', 'Version restored');
    void loadVersions(brochureId);
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Brochures"
        count={brochures.length}
        countLabel="catalogues"
        subtitle="Upload PDFs to Supabase Storage. Public downloads use /download/[slug]. Use ↑ ↓ to set order on the public brochures page."
        actions={
          <button type="button" className="admin-btn" onClick={() => setShowCreate((s) => !s)}>
            {showCreate ? 'Close form' : '+ Add brochure'}
          </button>
        }
      />

      {showCreate && (
        <section className="admin-card">
          <h2 className="admin-card-section-title">Add brochure</h2>
          <form className="admin-form" onSubmit={handleCreate} autoComplete="off">
        <label htmlFor="b-title">Title</label>
        <input
          id="b-title"
          required
          value={create.title}
          onChange={(e) => setCreate({ ...create, title: e.target.value })}
        />
        <label htmlFor="b-desc">Description</label>
        <textarea
          id="b-desc"
          rows={3}
          value={create.description}
          onChange={(e) => setCreate({ ...create, description: e.target.value })}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.6rem' }}
        />
        <label htmlFor="b-cat">Category</label>
        <select
          id="b-cat"
          value={create.category}
          onChange={(e) => setCreate({ ...create, category: e.target.value })}
        >
          {BROCHURE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1rem' }}>
          <legend style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Thumbnail (optional)</legend>
          <p className="admin-link-muted" style={{ margin: '0 0 0.75rem', fontSize: '0.85rem' }}>
            Paste an image URL or upload a file (JPEG, PNG, WebP, GIF — max 5 MB). Upload takes
            priority if both are provided.
          </p>
          <label htmlFor="b-thumb-url">Image URL</label>
          <input
            id="b-thumb-url"
            placeholder="/brochures_thumbs/corporate.png"
            value={create.thumbnailUrl}
            disabled={!!createThumbnailFile}
            onChange={(e) => setCreate({ ...create, thumbnailUrl: e.target.value })}
          />
          <label htmlFor="b-thumb-file">Upload image</label>
          <input
            id="b-thumb-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            onChange={(e) => setCreateThumbnailFile(e.target.files?.[0] ?? null)}
          />
          {createThumbnailFile && (
            <p className="admin-link-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
              Selected: {createThumbnailFile.name}
              {' · '}
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem' }}
                onClick={() => setCreateThumbnailFile(null)}
              >
                Clear file
              </button>
            </p>
          )}
        </fieldset>
        <label htmlFor="b-publish">Publish status</label>
        <select
          id="b-publish"
          value={create.publishStatus}
          onChange={(e) =>
            setCreate({
              ...create,
              publishStatus: e.target.value as (typeof PUBLISH_OPTIONS)[number]['value'],
            })
          }
        >
          {PUBLISH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label htmlFor="b-file">PDF file (max 50 MB)</label>
        <input
          id="b-file"
          type="file"
          accept="application/pdf,.pdf"
          required
          onChange={(e) => setCreateFile(e.target.files?.[0] ?? null)}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <button type="submit" className="admin-btn" disabled={creating}>
            {creating ? 'Uploading…' : 'Create brochure'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            disabled={creating}
            onClick={closeCreateForm}
          >
            Cancel
          </button>
        </div>
          </form>
        </section>
      )}

      <section className="admin-card admin-card-flat">
        <div className="admin-table-wrap">
      {loading ? (
        <p className="admin-table-empty">Loading…</p>
      ) : brochures.length === 0 ? (
        <p className="admin-table-empty">
          No brochures yet. Click <strong>Add brochure</strong> or run the seed script.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 72 }}>Order</th>
              <th>Title</th>
              <th>Slug / link</th>
              <th>Status</th>
              <th>Downloads</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brochures.map((b, index) => (
              <Fragment key={b.id}>
                <tr
                  className={
                    savingId === b.id ||
                    replacingId === b.id ||
                    deletingId === b.id
                      ? 'admin-row--pending'
                      : undefined
                  }
                >
                  <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    <span className="admin-text-subtle" style={{ marginRight: '0.35rem' }}>
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem', marginRight: 2 }}
                      disabled={index === 0}
                      onClick={() => moveBrochure(b.id, 'up')}
                      aria-label={`Move ${b.title} up`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                      disabled={index === brochures.length - 1}
                      onClick={() => moveBrochure(b.id, 'down')}
                      aria-label={`Move ${b.title} down`}
                      title="Move down"
                    >
                      ↓
                    </button>
                  </td>
                  <td>
                    <strong>{b.title}</strong>
                    <br />
                    <span className="admin-text-subtle">{b.category}</span>
                  </td>
                  <td>
                    <a href={`/download/${b.slug}`} target="_blank" rel="noreferrer">
                      /download/{b.slug}
                    </a>
                  </td>
                  <td>
                    <select
                      className="admin-select-inline"
                      value={b.published ? 'published' : 'draft'}
                      onChange={async (e) => {
                        const published = e.target.value === 'published';
                        const ok = await patchBrochure(b.id, { published });
                        if (ok) {
                          success(
                            published
                              ? 'This brochure appears on the public brochures page.'
                              : 'Hidden from the public site until you publish again.',
                            published ? 'Published' : 'Moved to draft'
                          );
                        }
                      }}
                      aria-label={`Publish status for ${b.title}`}
                    >
                      {PUBLISH_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{b.download_count}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {b.original_filename ? (
                      <>
                        {b.original_filename}
                        <br />
                        {b.file_size_bytes != null ? formatFileSize(b.file_size_bytes) : ''}
                        {b.version_no != null ? ` · v${b.version_no}` : ''}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', marginRight: '0.25rem' }}
                      onClick={() => startEdit(b)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', marginBottom: '0.25rem' }}
                      onClick={() => toggleExpand(b.id)}
                    >
                      Versions
                    </button>
                    <br />
                    <label style={{ fontSize: '0.75rem' }}>
                      Replace PDF
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        style={{ display: 'block', fontSize: '0.7rem', maxWidth: 140 }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleReplace(b.id, f);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {userRole === 'ADMIN' && (
                      <>
                        <br />
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.5rem',
                            marginTop: '0.35rem',
                            color: '#b91c1c',
                            borderColor: '#fecaca',
                          }}
                          disabled={deletingId === b.id}
                          onClick={() => handleDelete(b.id, b.title)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {editingId === b.id && (
                  <tr>
                    <td colSpan={7} className="admin-edit-panel">
                      <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>Edit metadata</p>
                      <div className="admin-form" style={{ maxWidth: 480 }}>
                        <label htmlFor={`edit-title-${b.id}`}>Title</label>
                        <input
                          id={`edit-title-${b.id}`}
                          value={editDraft.title}
                          onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                        />
                        <label htmlFor={`edit-desc-${b.id}`}>Description</label>
                        <textarea
                          id={`edit-desc-${b.id}`}
                          rows={2}
                          value={editDraft.description}
                          onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                          style={{ width: '100%', marginBottom: '0.75rem', padding: '0.6rem' }}
                        />
                        <p style={{ margin: '0 0 0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                          Thumbnail
                        </p>
                        {(editThumbnailFile || editDraft.thumbnailUrl) && (
                          <img
                            src={
                              editThumbnailFile
                                ? URL.createObjectURL(editThumbnailFile)
                                : editDraft.thumbnailUrl
                            }
                            alt="Thumbnail preview"
                            style={{
                              display: 'block',
                              maxWidth: 160,
                              maxHeight: 100,
                              objectFit: 'cover',
                              marginBottom: '0.5rem',
                              borderRadius: 4,
                              border: '1px solid var(--admin-border)',
                            }}
                          />
                        )}
                        <label htmlFor={`edit-thumb-url-${b.id}`}>Image URL</label>
                        <input
                          id={`edit-thumb-url-${b.id}`}
                          placeholder="/brochures_thumbs/corporate.png"
                          value={editDraft.thumbnailUrl}
                          disabled={!!editThumbnailFile}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, thumbnailUrl: e.target.value })
                          }
                        />
                        <label htmlFor={`edit-thumb-file-${b.id}`}>Upload image</label>
                        <input
                          id={`edit-thumb-file-${b.id}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                          onChange={(e) => setEditThumbnailFile(e.target.files?.[0] ?? null)}
                        />
                        {editThumbnailFile && (
                          <p className="admin-link-muted" style={{ fontSize: '0.8rem' }}>
                            Selected: {editThumbnailFile.name}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            className="admin-btn"
                            disabled={savingId === b.id}
                            onClick={() => saveEdit(b.id)}
                          >
                            {savingId === b.id ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {expandedId === b.id && (
                  <tr>
                    <td colSpan={7} className="admin-subpanel">
                      <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>Version history</p>
                      {versionsLoading ? (
                        <p className="admin-link-muted">Loading versions…</p>
                      ) : versions.length === 0 ? (
                        <p className="admin-link-muted">No versions.</p>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                          {versions.map((v) => (
                            <li key={v.id} style={{ marginBottom: '0.35rem' }}>
                              v{v.version_no} — {v.original_filename} ({formatFileSize(v.file_size_bytes)})
                              {b.version_no === v.version_no ? ' (current)' : ''}
                              {b.version_no !== v.version_no && (
                                <button
                                  type="button"
                                  className="admin-btn admin-btn-secondary"
                                  style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                                  disabled={restoringId === v.id}
                                  onClick={() => restoreVersion(b.id, v.id)}
                                >
                                  {restoringId === v.id ? 'Restoring…' : 'Restore'}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
        </div>
      </section>
    </div>
  );
}


