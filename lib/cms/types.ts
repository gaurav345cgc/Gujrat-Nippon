export type PageStatus = 'draft' | 'published' | 'archived';

export type PageTemplate =
  | 'home'
  | 'about'
  | 'products'
  | 'industries'
  | 'certifications'
  | 'careers'
  | 'contact'
  | 'legal';

export type SectionType = 'hero' | 'text' | 'cta' | 'contact_info' | 'seo';

export type PageSlug =
  | 'home'
  | 'about'
  | 'products'
  | 'industries'
  | 'certifications'
  | 'careers'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies';

export type HeroPayload = {
  headline: string;
  subheadline?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type TextPayload = {
  heading?: string;
  body: string;
};

export type CtaPayload = {
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
};

export type ContactInfoPayload = {
  heading?: string;
  address: string;
  phone: string;
  email: string;
  workingHours?: string;
  mapUrl?: string;
};

export type SeoPayload = {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
};

export type SectionPayload =
  | HeroPayload
  | TextPayload
  | CtaPayload
  | ContactInfoPayload
  | SeoPayload;

export type PageRecord = {
  id: string;
  slug: string;
  path: string;
  title: string;
  template: PageTemplate;
  status: PageStatus;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SectionRecord = {
  id: string;
  page_id: string;
  section_key: string;
  section_type: SectionType;
  payload_json: SectionPayload;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SeoRecord = {
  id: string;
  page_id: string;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string;
  og_title: string | null;
  og_description: string | null;
  updated_at: string;
};

export type PageRevisionRecord = {
  id: string;
  page_id: string;
  snapshot_json: PageSnapshot;
  revision_note: string | null;
  created_by: string | null;
  created_at: string;
};

export type PageSnapshot = {
  page: PageRecord;
  sections: SectionRecord[];
  seo: SeoRecord | null;
};

export type PublishedPageSnapshot = {
  slug: PageSlug;
  path: string;
  title: string;
  template: PageTemplate;
  published_at: string;
  sections: Record<string, SectionPayload>;
  seo: SeoPayload;
};

export type PageEditorPayload = {
  sections: Array<{
    section_key: string;
    section_type: SectionType;
    payload_json: SectionPayload;
    sort_order?: number;
    is_active?: boolean;
  }>;
  seo: SeoPayload;
  revision_note?: string;
};
