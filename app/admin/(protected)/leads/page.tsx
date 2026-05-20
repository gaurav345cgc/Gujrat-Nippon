import { Metadata } from 'next';
import InquiriesManager from '@/components/admin/InquiriesManager';
import { getCachedLeadsList } from '@/lib/admin/cache/queries';

export const metadata: Metadata = {
  title: 'Leads',
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  let initialInquiries: Awaited<ReturnType<typeof getCachedLeadsList>> = [];
  try {
    initialInquiries = await getCachedLeadsList();
  } catch {
    // Table may be missing before migration 007.
  }
  return <InquiriesManager initialInquiries={initialInquiries} />;
}
