import { Metadata } from 'next';
import PagesList from '@/components/admin/cms/PagesList';
import { listPagesAdmin } from '@/lib/cms/service';

export const metadata: Metadata = {
  title: 'Pages',
  robots: { index: false, follow: false },
};

export default async function AdminPagesPage() {
  try {
    const pages = await listPagesAdmin();
    return (
      <PagesList
        initialPages={pages.map((page) => ({
          id: page.id,
          slug: page.slug,
          path: page.path,
          title: page.title,
          status: page.status,
          updated_at: page.updated_at,
        }))}
      />
    );
  } catch {
    return <PagesList />;
  }
}
