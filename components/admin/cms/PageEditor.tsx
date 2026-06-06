'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PageEditorActions from '@/components/admin/cms/PageEditorActions';
import RevisionPicker from '@/components/admin/cms/RevisionPicker';
import SectionFormContact from '@/components/admin/cms/SectionFormContact';
import SectionFormCta from '@/components/admin/cms/SectionFormCta';
import SectionFormHero from '@/components/admin/cms/SectionFormHero';
import SectionFormSeo from '@/components/admin/cms/SectionFormSeo';
import SectionFormText from '@/components/admin/cms/SectionFormText';
import { PAGE_REGISTRY, TEMPLATE_SECTIONS } from '@/lib/cms/constants';
import { normalizeEditorPayload } from '@/lib/cms/editor';
import { validatePageDraft } from '@/lib/cms/validate';
import type {
  ContactInfoPayload,
  CtaPayload,
  HeroPayload,
  PageEditorPayload,
  PageSlug,
  PageSnapshot,
  SectionPayload,
  SeoPayload,
  TextPayload,
} from '@/lib/cms/types';
import { useAdminFeedback } from '@/lib/admin/useAdminFeedback';

type Props = {
  initialPage: PageSnapshot;
  slug: PageSlug;
};

type FormProps = {
  snapshot: PageSnapshot;
  slug: PageSlug;
  onSnapshotChange: (snapshot: PageSnapshot) => void;
  setError: (message: string | null) => void;
  success: (message: string, title?: string) => void;
};

function sectionLabel(key: string): string {
  const labels: Record<string, string> = {
    about_teaser: 'About teaser (heading + body)',
    about_teaser_cta: 'About teaser — Read more button',
    services_intro: 'Our Services — section intro',
    services_view_cta: 'Our Services — View our services link',
    advantage_intro: 'Engineering Capabilities — section heading',
    products_teaser_heading: 'Products carousel — section heading',
    cta_bottom: 'Bottom CTA (optional)',
    page_header: 'Page header',
    contact_info: 'Contact info (also updates site footer when published)',
    form_intro: 'Form intro',
    company_overview: 'Company overview',
    company_stats: 'Company stats (one per line: Label|Value)',
    leadership_intro: 'Leadership / philosophy intro',
    goals_heading: 'Our Goals — section heading',
    goal_people: 'Goal card — People',
    goal_planet: 'Goal card — Planet',
    goal_profits: 'Goal card — Profits',
    goals_more_cta: 'Our Goals — MORE GOALS button',
    category_intro: 'Category intro (above product grid)',
    cards_intro: 'Industry cards intro',
    compliance_body: 'Compliance body',
  };
  if (labels[key]) return labels[key];

  const serviceCard = key.match(/^service_card_(\d+)$/);
  if (serviceCard) return `Service card ${serviceCard[1]} (title + description)`;

  const capability = key.match(/^capability_(\d+)$/);
  if (capability) {
    return `Capability ${capability[1]} (title + body; end body with "CTA: link text")`;
  }

  const productTeaser = key.match(/^product_teaser_(\d+)$/);
  if (productTeaser) return `Product carousel card ${productTeaser[1]} (title + description)`;

  const philosophyTab = key.match(/^philosophy_tab_(\d+)$/);
  if (philosophyTab) return `Philosophy tab ${philosophyTab[1]} (title only)`;

  const productCard = key.match(/^product_card_(\d+)$/);
  if (productCard) return `Product grid card ${productCard[1]} (title + description)`;

  const industryCard = key.match(/^industry_card_(\d+)$/);
  if (industryCard) return `Industry card ${industryCard[1]} (title + description)`;

  return key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function PageEditorForm({ snapshot, slug, onSnapshotChange, setError, success }: FormProps) {
  const editor = useMemo(() => normalizeEditorPayload(slug, snapshot), [slug, snapshot]);
  const [pageMeta, setPageMeta] = useState(snapshot.page);
  const [sections, setSections] = useState(editor.sections);
  const [seo, setSeo] = useState<SeoPayload>(editor.seo);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [restoringDefaults, setRestoringDefaults] = useState(false);

  const template = PAGE_REGISTRY[slug].template;
  const templateDefs = TEMPLATE_SECTIONS[template];
  const legal = template === 'legal';
  const homeTemplate = template === 'home';

  const payload: PageEditorPayload = useMemo(() => ({ sections, seo }), [sections, seo]);
  const validation = useMemo(() => validatePageDraft(slug, payload), [slug, payload]);

  function updateSection(sectionKey: string, payloadJson: SectionPayload) {
    setSections((prev) =>
      prev.map((section) =>
        section.section_key === sectionKey ? { ...section, payload_json: payloadJson } : section
      )
    );
  }

  function syncFromSnapshot(next: PageSnapshot) {
    onSnapshotChange(next);
  }

  async function saveDraft() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/admin/api/pages/${pageMeta.id}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? 'Save draft failed.');
      return;
    }
    syncFromSnapshot(data.page as PageSnapshot);
    success('Draft saved.', 'Draft saved');
  }

  async function publish() {
    if (!validation.ok) {
      setError(validation.error);
      return;
    }
    setPublishing(true);
    setError(null);
    const res = await fetch(`/admin/api/pages/${pageMeta.id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPublishing(false);
    if (!res.ok) {
      setError(data.error ?? 'Publish failed.');
      return;
    }
    syncFromSnapshot(data.page as PageSnapshot);
    const revalidation = data.revalidated?.status;
    success(
      revalidation === 'partial'
        ? 'Published with partial cache revalidation.'
        : 'Page published.',
      'Published'
    );
  }

  function openPreview() {
    window.open(`/admin/pages/${slug}/preview`, '_blank', 'noopener,noreferrer');
  }

  async function restoreDefaults() {
    if (
      !window.confirm(
        'Reset all sections and SEO to the site defaults from lib/cms/payloads.ts?\n\n' +
          'This saves a draft (page status becomes draft). The live site only updates after Publish. ' +
          'Tip: change a field first to confirm the reset — defaults match payloads.ts, not your last unsaved edit.'
      )
    ) {
      return;
    }
    setRestoringDefaults(true);
    setError(null);
    const res = await fetch(`/admin/api/pages/${pageMeta.id}/restore-defaults`, { method: 'POST' });
    const data = await res.json();
    setRestoringDefaults(false);
    if (!res.ok) {
      setError(data.error ?? 'Reset to defaults failed.');
      return;
    }
    if (!data.page) {
      setError('Reset succeeded but page data was missing.');
      return;
    }
    syncFromSnapshot(data.page as PageSnapshot);
    success('Editor reset to site defaults (saved as draft).', 'Defaults restored');
  }

  return (
    <>
      <section className="admin-card">
        <h2 className="admin-card-section-title">Page details</h2>
        <div className="admin-form">
          <label>
            Slug (read-only)
            <input type="text" value={pageMeta.slug} readOnly />
          </label>
          <label>
            Path (read-only)
            <input type="text" value={pageMeta.path} readOnly />
          </label>
          <label>
            Status
            <input type="text" value={pageMeta.status} readOnly />
          </label>
        </div>
      </section>

      {slug === 'home' ? (
        <section className="admin-card" style={{ marginTop: '1rem' }}>
          <h2 className="admin-card-section-title">Static homepage elements</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--admin-text-muted)' }}>
            Navbar, footer brand, sitemap links, CIN, social placeholders, capability hero image,
            product card images, and &quot;Download Brochure&quot; labels stay in the site template.
            Footer address, phone, and email come from Contact → Contact info when published.
          </p>
        </section>
      ) : null}

      {slug === 'contact' ? (
        <section className="admin-card" style={{ marginTop: '1rem' }}>
          <h2 className="admin-card-section-title">Footer sync</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--admin-text-muted)' }}>
            Publishing contact info updates the footer on every page. CIN stays hardcoded on the contact page
            and footer.
          </p>
        </section>
      ) : null}

      {slug === 'about' ? (
        <section className="admin-card" style={{ marginTop: '1rem' }}>
          <h2 className="admin-card-section-title">Static about page elements</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--admin-text-muted)' }}>
            Hero background, philosophy side image, goal card photos, carousel arrows, and READ MORE buttons on
            goal cards stay in the site template. Industry detail page slugs and card images on Products and
            Industries pages are fixed by index.
          </p>
        </section>
      ) : null}

      {slug === 'products' || slug === 'industries' ? (
        <section className="admin-card" style={{ marginTop: '1rem' }}>
          <h2 className="admin-card-section-title">Static layout elements</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--admin-text-muted)' }}>
            Card images and industry detail URLs are fixed in the template; edit titles and descriptions in the
            card sections below.
          </p>
        </section>
      ) : null}

      {templateDefs.map((def) => {
        const section = sections.find((s) => s.section_key === def.section_key);
        if (!section) return null;

        return (
          <section key={def.section_key} className="admin-card" style={{ marginTop: '1rem' }}>
            <h2 className="admin-card-section-title">
              {sectionLabel(def.section_key)}
              {def.required ? '' : ' (optional)'}
            </h2>
            {section.section_type === 'hero' ? (
              <SectionFormHero
                value={section.payload_json as HeroPayload}
                onChange={(value) => updateSection(def.section_key, value)}
                homeTemplate={homeTemplate}
              />
            ) : null}
            {section.section_type === 'text' ? (
              <SectionFormText
                value={section.payload_json as TextPayload}
                onChange={(value) => updateSection(def.section_key, value)}
                legal={legal}
              />
            ) : null}
            {section.section_type === 'cta' ? (
              <SectionFormCta
                value={section.payload_json as CtaPayload}
                onChange={(value) => updateSection(def.section_key, value)}
              />
            ) : null}
            {section.section_type === 'contact_info' ? (
              <SectionFormContact
                value={section.payload_json as ContactInfoPayload}
                onChange={(value) => updateSection(def.section_key, value)}
              />
            ) : null}
          </section>
        );
      })}

      <section className="admin-card" style={{ marginTop: '1rem' }}>
        <h2 className="admin-card-section-title">SEO</h2>
        <SectionFormSeo value={seo} onChange={setSeo} />
      </section>

      <PageEditorActions
        saving={saving}
        publishing={publishing}
        restoringDefaults={restoringDefaults}
        canPublish={validation.ok}
        validationError={validation.ok ? null : validation.error}
        onSaveDraft={saveDraft}
        onPublish={publish}
        onPreview={openPreview}
        onRestoreDefaults={restoreDefaults}
      />

      <RevisionPicker
        pageId={pageMeta.id}
        onRestored={(next) => syncFromSnapshot(next)}
        onError={setError}
        onSuccess={success}
      />
    </>
  );
}

export default function PageEditor({ initialPage, slug }: Props) {
  const { setError, success } = useAdminFeedback();
  const [snapshot, setSnapshot] = useState(initialPage);
  const [formKey, setFormKey] = useState(0);

  function handleSnapshotChange(next: PageSnapshot) {
    setSnapshot(next);
    setFormKey((key) => key + 1);
  }

  return (
    <div className="admin-page">
      <AdminPageHeader
        title={snapshot.page.title}
        subtitle="Edit contractual page content. Slug and path are fixed."
        actions={
          <Link href="/admin/pages" className="admin-btn admin-btn-secondary">
            Back to pages
          </Link>
        }
      />

      <PageEditorForm
        key={formKey}
        snapshot={snapshot}
        slug={slug}
        onSnapshotChange={handleSnapshotChange}
        setError={setError}
        success={success}
      />
    </div>
  );
}
