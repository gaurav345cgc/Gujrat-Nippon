'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

export default function ForgotPasswordForm() {
  const { setError, info } = useAdminFeedback();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/admin/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Could not send reset email. Try again later.');
      return;
    }

    info(
      data.message ??
        'If an account exists for that email, password reset instructions have been sent.',
      'Check your inbox'
    );
  }

  return (
    <div className="admin-card">
      <h1 style={{ marginTop: 0 }}>Forgot password</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="admin-btn" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="admin-link-muted" style={{ marginTop: '1rem' }}>
        <Link href="/admin/login">Back to sign in</Link>
      </p>
    </div>
  );
}
