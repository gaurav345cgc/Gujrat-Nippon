import { Metadata } from 'next';
import BrochuresManager from '@/components/admin/BrochuresManager';
import { getCachedBrochuresList } from '@/lib/admin/cache/queries';

export const metadata: Metadata = {
  title: 'Brochures',
  robots: { index: false, follow: false },
};

export default async function AdminBrochuresPage() {
  const initialBrochures = await getCachedBrochuresList();
  return <BrochuresManager initialBrochures={initialBrochures} />;
}
