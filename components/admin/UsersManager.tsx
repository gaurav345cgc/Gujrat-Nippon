'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminUserRow } from '@/lib/admin/listUsers';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt: string | null;
  createdAt: string;
};

function toUserRow(u: AdminUserRow): UserRow {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status as UserRow['status'],
    lastLoginAt: null,
    createdAt: u.createdAt,
  };
}

type UsersManagerProps = {
  initialUsers?: AdminUserRow[];
};

export default function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState<UserRow[]>(
    () => (initialUsers ?? []).map(toUserRow)
  );
  const [loading, setLoading] = useState(!initialUsers);
  const { setError, flash, success } = useAdminFeedback();
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR' as 'ADMIN' | 'EDITOR',
  });

  const load = useCallback(async () => {
    const res = await fetch('/admin/api/users');
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Failed to load users');
      return;
    }
    setUsers(data.users);
  }, [setError]);

  useEffect(() => {
    if (initialUsers) return;
    // Client fallback when server-provided initial data is unavailable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load, initialUsers]);

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch('/admin/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error ?? 'Create failed');
      return;
    }
    setForm({ name: '', email: '', password: '', role: 'EDITOR' });
    flash('They can sign in with the temporary password you set.', 'User created');
    if (data.user) {
      setUsers((prev) => [
        {
          ...data.user,
          lastLoginAt: null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  }

  function resetCreateForm() {
    setError(null);
    setForm({ name: '', email: '', password: '', role: 'EDITOR' });
  }

  async function updateUser(id: string, patch: Partial<UserRow>) {
    const previous = users;
    setUpdatingId(id);
    setUsers((list) =>
      list.map((u) =>
        u.id === id
          ? {
              ...u,
              ...(patch.name !== undefined ? { name: patch.name } : {}),
              ...(patch.role !== undefined ? { role: patch.role } : {}),
              ...(patch.status !== undefined ? { status: patch.status } : {}),
            }
          : u
      )
    );
    setError(null);
    const res = await fetch(`/admin/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    setUpdatingId(null);
    if (!res.ok) {
      setUsers(previous);
      setError(data.error ?? 'Update failed');
      return;
    }
    if (data.user) {
      setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
    }
    if (patch.role !== undefined) {
      success(
        patch.role === 'ADMIN'
          ? 'This user can manage users and delete content.'
          : 'This user can edit brochures and FAQs.',
        'Role updated'
      );
    }
    if (patch.status !== undefined) {
      success(
        patch.status === 'ACTIVE'
          ? 'They can sign in to the admin panel again.'
          : 'They can no longer access the admin panel.',
        patch.status === 'ACTIVE' ? 'User activated' : 'User deactivated'
      );
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Users"
        count={users.length}
        countLabel="accounts"
        subtitle="Admin only — create and manage panel users."
      />

      <section className="admin-card">
        <h2 className="admin-card-section-title">Create user</h2>
        <p className="admin-link-muted" style={{ marginTop: '-0.25rem' }}>
          Use a new email — not one already listed in the table below.
        </p>
        <form
          className="admin-form"
          onSubmit={createUser}
          style={{ maxWidth: 420 }}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore
          data-bwignore
        >
          <label htmlFor="create-user-name">Name</label>
          <input
            id="create-user-name"
            name="create-user-name"
            required
            autoComplete="off"
            value={form.name}
            onChange={(e) => updateForm('name', e.target.value)}
          />
          <label htmlFor="create-user-email">Email</label>
          <input
            id="create-user-email"
            name="create-user-email"
            type="email"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="new.user@company.com"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
          />
          <label htmlFor="create-user-password">Temporary password</label>
          <input
            id="create-user-password"
            name="create-user-password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => updateForm('password', e.target.value)}
          />
          <label htmlFor="create-user-role">Role</label>
          <select
            id="create-user-role"
            name="create-user-role"
            value={form.role}
            onChange={(e) => updateForm('role', e.target.value as 'ADMIN' | 'EDITOR')}
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn" disabled={creating}>
              {creating ? 'Creating…' : 'Create user'}
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" onClick={resetCreateForm}>
              Clear form
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card admin-card-flat" aria-labelledby="users-table-heading">
        <h2 id="users-table-heading" className="admin-card-section-title">
          Users
        </h2>
        <div className="admin-table-wrap">
          {loading ? (
            <p className="admin-table-empty">Loading…</p>
          ) : users.length === 0 ? (
            <p className="admin-table-empty">No users yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={updatingId === u.id ? 'admin-row--pending' : undefined}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="admin-select-inline"
                        value={u.role}
                        onChange={(e) =>
                          updateUser(u.id, { role: e.target.value as UserRow['role'] })
                        }
                      >
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={
                          u.status === 'ACTIVE'
                            ? 'admin-status admin-status--success'
                            : 'admin-status admin-status--neutral'
                        }
                      >
                        <span className="admin-status-dot" />
                        {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {u.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          disabled={updatingId === u.id}
                          onClick={() => updateUser(u.id, { status: 'INACTIVE' })}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          disabled={updatingId === u.id}
                          onClick={() => updateUser(u.id, { status: 'ACTIVE' })}
                        >
                          Activate
                        </button>
                      )}
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
