'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';
  const { setError } = useAdminFeedback();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/admin/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Invalid email or password.');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="admin-card">
      <div className="admin-auth-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Image src="/logo.svg" alt="Gujarat Nippon International Pvt Ltd Logo" width={64} height={64} style={{ width: 'auto', height: '64px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>Gujarat Nippon International Pvt Ltd Admin</h1>
      </div>
      <p className="admin-link-muted" style={{ marginTop: 0 }}>
        Sign in to manage brochures, FAQs, and site content.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="admin-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="admin-link-muted" style={{ marginTop: '1rem' }}>
        <Link href="/admin/forgot-password">Forgot password?</Link>
      </p>
    </div>
  );
}
