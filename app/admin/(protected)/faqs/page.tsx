import { Metadata } from 'next';
import FaqsManager from '@/components/admin/FaqsManager';
import { getCachedFaqsList } from '@/lib/admin/cache/queries';

export const metadata: Metadata = {
  title: 'FAQs',
  robots: { index: false, follow: false },
};

export default async function AdminFaqsPage() {
  const initialFaqs = await getCachedFaqsList();
  return <FaqsManager initialFaqs={initialFaqs} />;
}
