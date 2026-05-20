'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminSession } from '@/components/admin/AdminSessionProvider';
import type { FaqRecord } from '@/lib/faqs/service';
import { IconSearch } from '@/components/admin/AdminIcons';
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  FAQ_LANGUAGES,
  MAX_FAQ_ANSWER_LEN,
  MAX_FAQ_QUESTION_LEN,
  type FaqCategory,
  type FaqLanguage,
} from '@/lib/faqs/constants';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';
import { useAdminReconcile } from '@/lib/admin/useAdminReconcile';

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  language: string;
  version: number;
  sort_order: number;
  is_active: boolean;
  use_in_chatbot: boolean;
  updated_at: string;
};

const emptyCreate = {
  question: '',
  answer: '',
  category: 'general' as FaqCategory,
  keywords: '',
  language: 'en' as FaqLanguage,
  useInChatbot: true,
};

type FaqsManagerProps = {
  initialFaqs?: FaqRecord[];
};

export default function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  const { role: userRole } = useAdminSession();
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs ?? []);
  const [loading, setLoading] = useState(!initialFaqs);
  const { setError, flash, success } = useAdminFeedback();
  const { reconcile } = useAdminReconcile();
  const [create, setCreate] = useState(emptyCreate);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyCreate);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'chatbot' | 'draft'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const chatbot = faqs.filter((f) => f.use_in_chatbot).length;
    const draft = faqs.filter((f) => !f.use_in_chatbot).length;
    return { all: faqs.length, chatbot, draft };
  }, [faqs]);

  const applyFaq = useCallback((faq: FaqRow) => {
    setFaqs((prev) => {
      const index = prev.findIndex((f) => f.id === faq.id);
      if (index < 0) {
        return [...prev, faq].sort((a, b) => a.sort_order - b.sort_order);
      }
      const next = [...prev];
      next[index] = faq;
      return next;
    });
  }, []);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch('/admin/api/faqs');
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Failed to load FAQs');
      return;
    }
    setFaqs(data.faqs);
  }, []);

  useEffect(() => {
    if (initialFaqs) return;
    load();
  }, [load, initialFaqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      if (filterCategory !== 'all' && f.category !== filterCategory) return false;
      if (statusFilter === 'chatbot' && !f.use_in_chatbot) return false;
      if (statusFilter === 'draft' && f.use_in_chatbot) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.keywords.some((k) => k.includes(q))
      );
    });
  }, [faqs, search, filterCategory, statusFilter]);

  const previewFaq = previewId ? faqs.find((f) => f.id === previewId) : null;

  function parseKeywords(raw: string): string[] {
    return raw
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch('/admin/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: create.question,
        answer: create.answer,
        category: create.category,
        keywords: parseKeywords(create.keywords),
        language: create.language,
        useInChatbot: create.useInChatbot,
      }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error ?? 'Create failed');
      return;
    }
    flash('Your new question is in the list.', 'FAQ created');
    void reconcile(load);
    setCreate(emptyCreate);
    setShowCreate(false);
    if (data.faq) applyFaq(data.faq as FaqRow);
  }

  function startEdit(f: FaqRow) {
    setEditingId(f.id);
    setEditDraft({
      question: f.question,
      answer: f.answer,
      category: f.category as FaqCategory,
      keywords: f.keywords.join(', '),
      language: (f.language as FaqLanguage) || 'en',
      useInChatbot: f.use_in_chatbot,
    });
    setPreviewId(null);
  }

  async function saveEdit(id: string) {
    const row = faqs.find((f) => f.id === id);
    if (!row) return;
    const draft = editDraft;
    const optimistic: FaqRow = {
      ...row,
      question: draft.question.trim(),
      answer: draft.answer,
      category: draft.category,
      keywords: parseKeywords(draft.keywords),
      language: draft.language,
      use_in_chatbot: draft.useInChatbot,
      is_active: draft.useInChatbot,
      updated_at: new Date().toISOString(),
    };
    const previous = faqs;
    setSavingId(id);
    setEditingId(null);
    setFaqs((list) => list.map((f) => (f.id === id ? optimistic : f)));
    setError(null);
    const res = await fetch(`/admin/api/faqs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: draft.question,
        answer: draft.answer,
        category: draft.category,
        keywords: parseKeywords(draft.keywords),
        language: draft.language,
        useInChatbot: draft.useInChatbot,
      }),
    });
    const data = await res.json();
    setSavingId(null);
    if (!res.ok) {
      setFaqs(previous);
      setEditingId(id);
      setEditDraft(draft);
      setError(data.error ?? 'Update failed');
      return;
    }
    flash('Changes saved successfully.', 'FAQ updated');
    if (data.faq) applyFaq(data.faq as FaqRow);
  }

  async function patchChatbot(id: string, useInChatbot: boolean) {
    const previous = faqs;
    setFaqs((list) =>
      list.map((f) =>
        f.id === id
          ? {
              ...f,
              use_in_chatbot: useInChatbot,
              is_active: useInChatbot,
            }
          : f
      )
    );
    setError(null);
    const res = await fetch(`/admin/api/faqs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useInChatbot }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFaqs(previous);
      setError(data.error ?? 'Status update failed');
      return;
    }
    if (data.faq) applyFaq(data.faq as FaqRow);
    success(
      useInChatbot
        ? 'The chatbot can now use this answer.'
        : 'Removed from chatbot responses.',
      useInChatbot ? 'Chatbot enabled' : 'Chatbot disabled'
    );
  }

  async function moveFaq(id: string, direction: 'up' | 'down') {
    const i = faqs.findIndex((f) => f.id === id);
    if (i < 0) return;
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= faqs.length) return;
    const orderedIds = faqs.map((f) => f.id);
    [orderedIds[i], orderedIds[j]] = [orderedIds[j], orderedIds[i]];
    const previous = faqs;
    const byId = new Map(faqs.map((f) => [f.id, f]));
    setFaqs(
      orderedIds.map((faqId, sort_order) => ({
        ...byId.get(faqId)!,
        sort_order,
      }))
    );
    setError(null);
    const res = await fetch('/admin/api/faqs/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    });
    if (!res.ok) {
      const data = await res.json();
      setFaqs(previous);
      setError(data.error ?? 'Reorder failed');
      return;
    }
  }

  async function handleDelete(id: string, question: string) {
    if (!window.confirm(`Delete FAQ "${question}"? This soft-deletes the record.`)) return;
    const previous = faqs;
    setDeletingId(id);
    setFaqs((list) => list.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
    if (previewId === id) setPreviewId(null);
    setError(null);
    const res = await fetch(`/admin/api/faqs/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setDeletingId(null);
    if (!res.ok) {
      setFaqs(previous);
      setError(data.error ?? 'Delete failed');
      return;
    }
    flash('The FAQ was removed from your list.', 'FAQ deleted');
    void reconcile(load);
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="FAQs"
        count={faqs.length}
        countLabel="entries"
        subtitle="Chatbot knowledge base. Turn on Use in chatbot when an answer is approved."
        actions={
          <button type="button" className="admin-btn" onClick={() => setShowCreate((s) => !s)}>
            {showCreate ? 'Close form' : '+ Add FAQ'}
          </button>
        }
      />


      <div className="admin-pills" role="tablist" aria-label="Filter by status">
        {(
          [
            { key: 'all' as const, label: 'All FAQs', count: counts.all },
            { key: 'chatbot' as const, label: 'In chatbot', count: counts.chatbot },
            { key: 'draft' as const, label: 'Draft', count: counts.draft },
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
          <IconSearch />
          <input
            type="search"
            placeholder="Search question, answer, or keywords…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-toolbar-actions">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--admin-radius-sm)',
              border: '1px solid var(--admin-border-strong)',
              fontSize: '0.875rem',
            }}
          >
            <option value="all">All categories</option>
            {FAQ_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {FAQ_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showCreate && (
        <section className="admin-card">
          <h2 className="admin-card-section-title">Add FAQ</h2>
          <form className="admin-form" onSubmit={handleCreate} autoComplete="off">
        <label htmlFor="faq-q">Question</label>
        <input
          id="faq-q"
          required
          maxLength={MAX_FAQ_QUESTION_LEN}
          value={create.question}
          onChange={(e) => setCreate({ ...create, question: e.target.value })}
        />
        <label htmlFor="faq-a">Answer (approved content only)</label>
        <textarea
          id="faq-a"
          required
          rows={4}
          maxLength={MAX_FAQ_ANSWER_LEN}
          value={create.answer}
          onChange={(e) => setCreate({ ...create, answer: e.target.value })}
          style={{ width: '100%', marginBottom: '0.75rem', padding: '0.6rem' }}
        />
        <label htmlFor="faq-cat">Category</label>
        <select
          id="faq-cat"
          value={create.category}
          onChange={(e) => setCreate({ ...create, category: e.target.value as FaqCategory })}
        >
          {FAQ_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {FAQ_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <label htmlFor="faq-kw">Keywords (comma-separated)</label>
        <input
          id="faq-kw"
          value={create.keywords}
          onChange={(e) => setCreate({ ...create, keywords: e.target.value })}
        />
        <label htmlFor="faq-lang">Language</label>
        <select
          id="faq-lang"
          value={create.language}
          onChange={(e) => setCreate({ ...create, language: e.target.value as FaqLanguage })}
        >
          {FAQ_LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <fieldset className="admin-form-checks">
          <legend className="admin-form-checks-legend">Chatbot</legend>
          <label className="admin-form-check">
            <input
              type="checkbox"
              checked={create.useInChatbot}
              onChange={(e) => setCreate({ ...create, useInChatbot: e.target.checked })}
            />
            <span>Use in chatbot (default)</span>
          </label>
        </fieldset>
        <button type="submit" className="admin-btn" disabled={creating}>
          {creating ? 'Saving…' : 'Add FAQ'}
        </button>
          </form>
        </section>
      )}

      {previewFaq && (
        <div className="admin-preview-panel">
          <p style={{ margin: '0 0 0.35rem', fontWeight: 600 }}>Preview</p>
          <p style={{ fontWeight: 600 }}>{previewFaq.question}</p>
          <p style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0 0' }}>{previewFaq.answer}</p>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
            onClick={() => setPreviewId(null)}
          >
            Close
          </button>
        </div>
      )}

      <section className="admin-card admin-card-flat">
        <div className="admin-table-wrap">
      {loading ? (
        <p className="admin-table-empty">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-table-empty">
          No FAQs yet. Run <code>npm run db:seed:faqs</code> or add one above.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Chatbot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const globalIndex = faqs.findIndex((x) => x.id === f.id);
              return (
                <Fragment key={f.id}>
                  <tr
                    className={
                      savingId === f.id || deletingId === f.id ? 'admin-row--pending' : undefined
                    }
                    style={!f.use_in_chatbot ? { opacity: 0.6 } : undefined}
                  >
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ padding: '0.15rem 0.35rem' }}
                        disabled={globalIndex <= 0}
                        onClick={() => moveFaq(f.id, 'up')}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem', marginLeft: 2 }}
                        disabled={globalIndex >= faqs.length - 1}
                        onClick={() => moveFaq(f.id, 'down')}
                      >
                        ↓
                      </button>
                    </td>
                    <td>
                      <strong>{f.question}</strong>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {FAQ_CATEGORY_LABELS[f.category as FaqCategory] ?? f.category} · v{f.version}
                      </span>
                      <br />
                      {f.use_in_chatbot ? (
                        <span className="admin-status admin-status--success" style={{ marginTop: 4 }}>
                          <span className="admin-status-dot" />
                          In chatbot
                        </span>
                      ) : (
                        <span className="admin-status admin-status--neutral" style={{ marginTop: 4 }}>
                          <span className="admin-status-dot" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td>
                      <label className="admin-form-check">
                        <input
                          type="checkbox"
                          checked={f.use_in_chatbot}
                          onChange={(e) => patchChatbot(f.id, e.target.checked)}
                        />
                        <span>Use in chatbot</span>
                      </label>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 4 }}
                        onClick={() => setPreviewId(f.id)}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ marginRight: 4 }}
                        onClick={() => startEdit(f)}
                      >
                        Edit
                      </button>
                      {userRole === 'ADMIN' && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem', color: '#b91c1c' }}
                          onClick={() => handleDelete(f.id, f.question)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                  {editingId === f.id && (
                    <tr>
                      <td colSpan={4} className="admin-edit-panel">
                        <p style={{ fontWeight: 600, margin: '0.5rem 0' }}>Edit FAQ</p>
                        <div className="admin-form" style={{ maxWidth: 720 }}>
                          <label>Question</label>
                          <input
                            value={editDraft.question}
                            maxLength={MAX_FAQ_QUESTION_LEN}
                            onChange={(e) => setEditDraft({ ...editDraft, question: e.target.value })}
                          />
                          <label>Answer</label>
                          <textarea
                            rows={4}
                            maxLength={MAX_FAQ_ANSWER_LEN}
                            value={editDraft.answer}
                            onChange={(e) => setEditDraft({ ...editDraft, answer: e.target.value })}
                            style={{ width: '100%', marginBottom: '0.75rem', padding: '0.6rem' }}
                          />
                          <label>Category</label>
                          <select
                            value={editDraft.category}
                            onChange={(e) =>
                              setEditDraft({ ...editDraft, category: e.target.value as FaqCategory })
                            }
                          >
                            {FAQ_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {FAQ_CATEGORY_LABELS[c]}
                              </option>
                            ))}
                          </select>
                          <label>Keywords</label>
                          <input
                            value={editDraft.keywords}
                            onChange={(e) => setEditDraft({ ...editDraft, keywords: e.target.value })}
                          />
                          <fieldset className="admin-form-checks">
                            <legend className="admin-form-checks-legend">Chatbot</legend>
                            <label className="admin-form-check">
                              <input
                                type="checkbox"
                                checked={editDraft.useInChatbot}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, useInChatbot: e.target.checked })
                                }
                              />
                              <span>Use in chatbot</span>
                            </label>
                          </fieldset>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="admin-btn"
                              disabled={savingId === f.id}
                              onClick={() => saveEdit(f.id)}
                            >
                              {savingId === f.id ? 'Saving…' : 'Save'}
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
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
        </div>
      </section>
    </div>
  );
}
