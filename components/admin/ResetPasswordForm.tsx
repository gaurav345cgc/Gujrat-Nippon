'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

export default function ResetPasswordForm() {
  const { setError, success } = useAdminFeedback();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 10) {
      setError('Password must be at least 10 characters.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await fetch('/admin/api/auth/password-updated', { method: 'POST' });
    success('You can sign in with your new password.', 'Password updated');
    setDone(true);
    await supabase.auth.signOut();
  }

  if (!ready) {
    return (
      <div className="admin-card">
        <p className="admin-alert admin-alert-error">
          Invalid or expired reset link.{' '}
          <Link href="/admin/forgot-password">Request a new link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h1 style={{ marginTop: 0 }}>Set new password</h1>
      {done ? (
        <p className="admin-link-muted" style={{ margin: 0 }}>
          Password updated.{' '}
          <Link href="/admin/login">Sign in</Link>
        </p>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            required
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  );
}
