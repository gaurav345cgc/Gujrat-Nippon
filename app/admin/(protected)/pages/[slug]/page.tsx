import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageEditor from '@/components/admin/cms/PageEditor';
import { getPageBySlug } from '@/lib/cms/service';
import { asPageSlug } from '@/lib/cms/slug';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = asPageSlug(slug);
  return {
    title: pageSlug ? `Edit ${pageSlug}` : 'Edit page',
    robots: { index: false, follow: false },
  };
}

export default async function AdminPageEditorPage({ params }: Props) {
  const { slug } = await params;
  const pageSlug = asPageSlug(slug);
  if (!pageSlug) notFound();

  const snapshot = await getPageBySlug(pageSlug);
  if (!snapshot) notFound();

  return <PageEditor initialPage={snapshot} slug={pageSlug} />;
}
