import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEMPLATE_SECTIONS } from '@/lib/cms/constants';
import { getPageBySlug } from '@/lib/cms/service';
import { asPageSlug } from '@/lib/cms/slug';
import type {
  ContactInfoPayload,
  CtaPayload,
  HeroPayload,
  SectionPayload,
  TextPayload,
} from '@/lib/cms/types';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = asPageSlug(slug);
  return {
    title: pageSlug ? `Preview ${pageSlug}` : 'Preview',
    robots: { index: false, follow: false },
  };
}

function renderSection(key: string, type: string, payload: SectionPayload) {
  if (type === 'hero') {
    const hero = payload as HeroPayload;
    return (
      <section key={key} style={{ marginBottom: '2rem' }}>
        {hero.subheadline ? <p style={{ opacity: 0.7 }}>{hero.subheadline}</p> : null}
        <h2>{hero.headline}</h2>
        {hero.body ? <p style={{ whiteSpace: 'pre-wrap' }}>{hero.body}</p> : null}
      </section>
    );
  }

  if (type === 'text') {
    const text = payload as TextPayload;
    return (
      <section key={key} style={{ marginBottom: '2rem' }}>
        {text.heading ? <h3>{text.heading}</h3> : null}
        <div style={{ whiteSpace: 'pre-wrap' }}>{text.body}</div>
      </section>
    );
  }

  if (type === 'cta') {
    const cta = payload as CtaPayload;
    return (
      <section key={key} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h3>{cta.heading}</h3>
        {cta.body ? <p>{cta.body}</p> : null}
        <a href={cta.buttonHref}>{cta.buttonLabel}</a>
      </section>
    );
  }

  if (type === 'contact_info') {
    const contact = payload as ContactInfoPayload;
    return (
      <section key={key} style={{ marginBottom: '2rem' }}>
        {contact.heading ? <h3>{contact.heading}</h3> : null}
        <p style={{ whiteSpace: 'pre-wrap' }}>{contact.address}</p>
        <p>{contact.phone}</p>
        <p>{contact.email}</p>
        {contact.workingHours ? <p>{contact.workingHours}</p> : null}
      </section>
    );
  }

  return null;
}

export default async function AdminPagePreviewPage({ params }: Props) {
  const { slug } = await params;
  const pageSlug = asPageSlug(slug);
  if (!pageSlug) notFound();

  const snapshot = await getPageBySlug(pageSlug);
  if (!snapshot) notFound();

  const defs = TEMPLATE_SECTIONS[snapshot.page.template];
  const sectionMap = new Map(snapshot.sections.map((s) => [s.section_key, s]));

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
          Draft preview — not the live site.{' '}
          <Link href={`/admin/pages/${pageSlug}`}>Back to editor</Link>
        </p>
        <h1>{snapshot.page.title}</h1>
        <p>
          Status: <strong>{snapshot.page.status}</strong> · Path: {snapshot.page.path}
        </p>
      </div>

      {defs.map((def) => {
        const section = sectionMap.get(def.section_key);
        if (!section || section.is_active === false) return null;
        return renderSection(def.section_key, section.section_type, section.payload_json);
      })}

      {snapshot.seo ? (
        <section style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
          <h2>SEO (draft)</h2>
          <p>
            <strong>Title:</strong> {snapshot.seo.seo_title}
          </p>
          <p>
            <strong>Description:</strong> {snapshot.seo.meta_description}
          </p>
        </section>
      ) : null}
    </div>
  );
}
