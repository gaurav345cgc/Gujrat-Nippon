import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/admin/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="admin-auth-wrap">
      <ForgotPasswordForm />
    </div>
  );
}
