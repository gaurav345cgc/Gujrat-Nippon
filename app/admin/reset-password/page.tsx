import { Suspense } from 'react';
import { Metadata } from 'next';
import ResetPasswordForm from '@/components/admin/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="admin-auth-wrap">
      <Suspense fallback={<p>Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
