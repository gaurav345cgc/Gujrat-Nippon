# GNIPL CMS — Implementation Plan (Pre-Code Reference)

**Status:** Planning — do not implement until this document is reviewed and Phase 0 is signed off.  
**Use:** Read this file in full before writing any CMS code. Treat it as the frozen spec for scope, schema, APIs, caching, and file layout.  
**Contract reference:** Master Service & Project Agreement — CMS-style content management for predefined website pages, technical SEO, and agreed Phase 1 routes.  
**Related guides:**
- [`cms-build-execution-plan.md`](./cms-build-execution-plan.md) — **phase map / build tracker** (check boxes here during implementation)
- [`cms-fallback-copy-review.md`](./cms-fallback-copy-review.md) — Phase 0 seed copy for content owner approval
- [`admin-implementation-plan.md`](./admin-implementation-plan.md) — contractual admin scope (CMS is in-scope there)
- [`admin-build-execution-plan.md`](./admin-build-execution-plan.md) — completed admin modules (auth, brochures, FAQs, leads, analytics); CMS was explicitly deferred
- [`gnipl-content-guide.md`](./gnipl-content-guide.md) — tone and vocabulary for all editable copy
- [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md) — title tag format, keyword placement, meta length guidance

**Recommended build order:** 0 → 1 → 2 → 3 → 4 → 5 → 6 (tracked in [`cms-build-execution-plan.md`](./cms-build-execution-plan.md))

---

## 0. What this CMS is (and is not)

### Goal

Let **Admin** and **Editor** users update **predefined** page content — headings, descriptions, hero blocks, CTAs, contact information, and SEO metadata — without editing source code. Public pages must stay **cache-friendly** and show published changes on a **normal reload** (no hard refresh) via targeted `revalidatePath` + `revalidateTag`.

### In scope

| Area | Included |
|------|----------|
| Page content editing | Home, About, Products/Services, Industries, Certifications, Careers, Contact, Privacy, Terms, Cookies |
| Section types | `hero`, `text`, `cta`, `contact_info`, `seo` only |
| Workflows | Save draft, preview draft, publish, restore revision |
| SEO | Per-page title, meta description, canonical, robots, OG fields |
| Caching | Published-only public reads; tag + path invalidation on publish |
| Permissions | Reuse existing `ADMIN` / `EDITOR` RBAC |

### Out of scope (non-negotiable for this build)

- Freeform drag-and-drop page builder
- Arbitrary HTML blobs or deeply nested block trees
- Rich-text WYSIWYG editors in public bundles (plain text + controlled line breaks only)
- CMS editing for brochure PDFs, FAQs, leads, or analytics (already built separately)
- Industry detail pages (`/industries/[slug]`) — static for now; CMS covers listing page only
- Product card catalog (`lib/data/products.ts`) — CMS covers page intro/hero/CTA/SEO, not per-product CRUD
- Multilingual content
- Media library / image upload in CMS v1 (hero background images stay static assets)
- Nav/footer link structure editing (copy in shared contact block only; link list stays code)

---

## 1. Repo baseline (today)

### Already built — reuse, do not rebuild

| Module | Location | CMS relationship |
|--------|----------|-------------------|
| Supabase auth + RBAC | `lib/auth/*`, `utils/supabase/*`, `proxy.ts` | CMS admin routes use same session guards |
| Admin shell | `app/admin/(protected)/layout.tsx`, `AdminSidebar.tsx` | Add "Pages" nav item under content links |
| Tagged admin cache | `lib/admin/cache/*` | Extend pattern for CMS admin list reads |
| FAQ sanitization | `lib/faqs/sanitize.ts` | Reuse or extract shared text sanitizer |
| Audit logging | `lib/auth/audit.ts` | Log publish, restore, draft save |
| Service-role Supabase client | `lib/supabase/admin.ts` | CMS writes bypass RLS where needed |

### Hardcoded today — CMS will wrap, not delete immediately

| Route | File | Editable areas (target) |
|-------|------|-------------------------|
| `/` | `app/page.tsx` + `Hero.tsx`, `HomeAbout.tsx`, `HomeProducts.tsx` | Hero headline; home about teaser text + CTA; SEO |
| `/about` | `app/about/page.tsx` | Hero, company overview, mission, vision, leadership intro, CTA, SEO |
| `/products` | `app/products/page.tsx` + `PageHero` | Page hero, intro, category intro text, CTA, SEO |
| `/industries` | `app/industries/page.tsx` | Page hero, intro, industry cards intro, CTA, SEO |
| `/certifications` | `app/certifications/page.tsx` | Page heading, intro, compliance text, CTA, SEO (page is stub — flesh out layout in Phase 3) |
| `/contact` | `app/contact/page.tsx` | Page heading, intro, contact block, form intro, SEO |
| `/privacy` | `app/privacy/page.tsx` | Hero heading, intro, legal text blocks, SEO |
| `/terms` | `app/terms/page.tsx` | Same pattern as privacy |
| `/cookies` | `app/cookies/page.tsx` | Same pattern as privacy |

### Gaps to close during CMS build

| Gap | Action |
|-----|--------|
| **Careers page missing** | Create `app/careers/page.tsx` + seed CMS page `careers` (contract requires it) |
| **Contact duplicated** | Address/phone/email in `Footer.tsx`, `contact/page.tsx` — centralize via `contact_info` block + optional `site_settings` |
| **Certifications stub** | Apply real layout (match Products/Industries `PageHero` pattern) before CMS wiring |
| **No public cache layer for pages** | Introduce `lib/cms/*` gate with `unstable_cache` (mirror `lib/admin/cache/queries.ts`) |
| **Prisma schema** | Ignore for CMS — all tables go in `supabase/migrations/008_cms_pages.sql` |

---

## 2. Frozen technical decisions

Read and accept these before Phase 1. Changing them mid-build requires updating this document first.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Supabase PostgreSQL (new migration `008`) | Matches auth, brochures, FAQs, analytics |
| ORM | None — Supabase JS client + typed mappers | Consistent with `lib/brochures/service.ts`, `lib/faqs/service.ts` |
| Validation | Zod v4 server-side | Already in project |
| Text sanitization | Strip scripts/HTML; normalize whitespace | Reuse FAQ sanitizer patterns |
| Public reads | `unstable_cache` + tags `page:{slug}`, `seo:{slug}` | Proven in admin cache module |
| Publish invalidation | `revalidatePath(path)` + `revalidateTag('page:{slug}')` + `revalidateTag('seo:{slug}')` | Targeted, not sitewide |
| Draft storage | Same `page_sections` rows; page `status = draft` means public reads ignore | No separate draft table in v1 |
| Revisions | Full snapshot JSON in `page_revisions` on every draft save and publish | Matches FAQ revision pattern |
| Preview | Protected route `/admin/pages/[slug]/preview` — never cached, `robots: noindex` | Drafts never leak publicly |
| SEO runtime | `generateMetadata` async per route calling `getPublishedSeo(slug)` | Fallback to current static `metadata` export values |
| Shared contact | Single `contact_info` section on `contact` page; Footer reads via `getPublishedContactInfo()` cached helper | Publish contact → revalidate `/contact` + `layout:footer` tag |
| Protected slugs | Fixed enum — cannot delete or change slug/path without admin confirmation flag | Contractual pages are immutable routes |

---

## 3. Database schema

**File to create:** `supabase/migrations/008_cms_pages.sql`

### 3.1 Enums

```sql
-- page_status: draft | published | archived
-- section_type: hero | text | cta | contact_info | seo
```

### 3.2 Tables

#### `pages`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `slug` | `text` UNIQUE NOT NULL | Immutable for contractual pages |
| `path` | `text` UNIQUE NOT NULL | e.g. `/about` |
| `title` | `text` NOT NULL | Admin display name |
| `template` | `text` NOT NULL | `home`, `about`, `products`, `industries`, `certifications`, `careers`, `contact`, `legal` |
| `status` | `text` NOT NULL | `draft` \| `published` \| `archived` |
| `published_at` | `timestamptz` | Set on publish |
| `created_by` | `uuid` FK → `auth.users` | |
| `updated_by` | `uuid` FK → `auth.users` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

#### `page_sections`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `page_id` | `uuid` FK → `pages` ON DELETE CASCADE | |
| `section_key` | `text` NOT NULL | Stable key per template, e.g. `hero`, `mission`, `cta_primary` |
| `section_type` | `text` NOT NULL | One of five allowed types |
| `payload_json` | `jsonb` NOT NULL | Validated Zod shape per type |
| `sort_order` | `int` NOT NULL DEFAULT 0 | |
| `is_active` | `boolean` NOT NULL DEFAULT true | Soft-disable without delete |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Unique constraint:** `(page_id, section_key)`

#### `seo_metadata`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `page_id` | `uuid` FK → `pages` UNIQUE | One row per page |
| `seo_title` | `text` | Max 70 chars (warn at 60) |
| `meta_description` | `text` | Max 160 chars (warn at 155) |
| `canonical_url` | `text` | Optional absolute URL |
| `robots` | `text` DEFAULT `'index,follow'` | |
| `og_title` | `text` | Falls back to `seo_title` |
| `og_description` | `text` | Falls back to `meta_description` |
| `updated_at` | `timestamptz` | |

> **Note:** Spec also lists `seo` as a section type. Implementation uses **`seo_metadata` table as source of truth** for runtime SEO. The `seo` section type in `page_sections` is optional for editor UI grouping only — on save, sync into `seo_metadata`. Do not duplicate reads from both places on the public site.

#### `page_revisions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `page_id` | `uuid` FK → `pages` | |
| `snapshot_json` | `jsonb` NOT NULL | Full page + sections + seo snapshot |
| `revision_note` | `text` | Optional editor note |
| `created_by` | `uuid` FK → `auth.users` | |
| `created_at` | `timestamptz` | |

#### `publish_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `page_id` | `uuid` FK → `pages` | |
| `published_by` | `uuid` FK → `auth.users` | |
| `published_at` | `timestamptz` | |
| `paths_revalidated` | `text[]` | e.g. `{/about}` |
| `tags_revalidated` | `text[]` | e.g. `{page:about,seo:about}` |
| `status` | `text` | `success` \| `partial` \| `failed` |
| `error_message` | `text` | |

#### `site_settings` (optional v1 — recommended for shared contact)

| Column | Type | Notes |
|--------|------|-------|
| `key` | `text` PK | e.g. `global_contact` |
| `payload_json` | `jsonb` | Same shape as `contact_info` payload |
| `updated_by` | `uuid` | |
| `updated_at` | `timestamptz` | |

Use when Footer and Contact page must stay in sync. Publish contact page can upsert `site_settings.global_contact` and revalidate `layout:footer`.

### 3.3 RLS policies

| Table | Public | Authenticated EDITOR+ | Service role |
|-------|--------|----------------------|--------------|
| `pages` | SELECT where `status = 'published'` only | No direct client access | Full access via admin API |
| `page_sections` | SELECT via published page join | No direct client access | Full access via admin API |
| `seo_metadata` | SELECT via published page join | No direct client access | Full access via admin API |
| `page_revisions` | None | None | Admin API only |
| `publish_logs` | None | None | Admin API only |
| `site_settings` | SELECT `global_contact` only | No | Admin API writes |

**Rule:** Public site never queries Supabase from the browser for CMS content. All public reads go through server-side `lib/cms/public.ts` using service role or a tightly scoped RPC.

### 3.4 Seed data

**File to create:** `scripts/seed-cms-pages.ts`  
**npm script:** `"db:seed:cms": "npx tsx scripts/seed-cms-pages.ts"`

Seed must:
1. Insert all 10 contractual pages with `status = 'draft'` initially (or `published` after content extraction is verified).
2. Insert every predefined `section_key` per template with payloads extracted from current hardcoded `.tsx` content.
3. Insert `seo_metadata` from current `export const metadata` values and `gnipl-seo-content-rules.md` where they differ.
4. Be **idempotent** — safe to re-run (upsert on `slug`).

---

## 4. Predefined pages and section maps

### 4.1 Page registry (immutable)

| Slug | Path | Template | Title (admin) |
|------|------|----------|---------------|
| `home` | `/` | `home` | Home |
| `about` | `/about` | `about` | About Us |
| `products` | `/products` | `products` | Products / Services |
| `industries` | `/industries` | `industries` | Industries Served |
| `certifications` | `/certifications` | `certifications` | Certifications / Quality |
| `careers` | `/careers` | `careers` | Careers |
| `contact` | `/contact` | `contact` | Contact Us |
| `privacy` | `/privacy` | `legal` | Privacy Policy |
| `terms` | `/terms` | `legal` | Terms & Conditions |
| `cookies` | `/cookies` | `legal` | Cookie Policy |

### 4.2 Section keys per page

#### Home (`template: home`)

| section_key | section_type | Maps to component |
|-------------|--------------|-------------------|
| `hero` | `hero` | `components/Hero.tsx` |
| `about_teaser` | `text` | `components/HomeAbout.tsx` (body paragraphs + CTA label) |
| `products_teaser_heading` | `text` | `components/HomeProducts.tsx` heading only (cards stay static) |
| `cta_bottom` | `cta` | Optional bottom CTA if added |

#### About (`template: about`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `hero` | Yes |
| `company_overview` | `text` | Yes |
| `mission` | `text` | Yes |
| `vision` | `text` | Yes |
| `leadership_intro` | `text` | Yes |
| `cta` | `cta` | Yes |

#### Products (`template: products`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `hero` | Yes — maps to `PageHero` props |
| `intro` | `text` | Yes |
| `category_intro` | `text` | Yes — single intro above product grid |
| `cta` | `cta` | Yes |

#### Industries (`template: industries`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `hero` | Yes |
| `intro` | `text` | Yes |
| `cards_intro` | `text` | Yes |
| `cta` | `cta` | Yes |

#### Certifications (`template: certifications`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `hero` | Yes |
| `intro` | `text` | Yes |
| `compliance_body` | `text` | Yes — ISO sections as structured text blocks in one payload or split into `compliance_1`, `compliance_2` |
| `cta` | `cta` | No |

#### Careers (`template: careers`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `hero` | Yes |
| `intro` | `text` | Yes |
| `culture` | `text` | Yes |
| `cta` | `cta` | Yes — e.g. "Send your CV to careers@..." |

#### Contact (`template: contact`)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `page_header` | `text` | Yes — H1 + intro |
| `contact_info` | `contact_info` | Yes |
| `form_intro` | `text` | Yes — text above `ContactForm` |

#### Legal (`template: legal` — privacy, terms, cookies)

| section_key | section_type | Required |
|-------------|--------------|----------|
| `hero` | `text` | Yes — heading + last-updated line |
| `intro` | `text` | Yes |
| `body_1` … `body_6` | `text` | As many as needed per page; keys fixed at seed time |

Each page also has one `seo_metadata` row (not a freeform section_key on public reads).

---

## 5. Payload schemas (Zod)

**File to create:** `lib/cms/validate.ts`

### 5.1 Shared rules

| Field rule | Constraint |
|------------|------------|
| All text fields | Sanitize via shared helper; no HTML except `\n` in `body` fields |
| `headline`, `heading` | Required where marked; 1–120 chars |
| `body` | 1–4000 chars (legal pages up to 12000) |
| `primaryCtaHref`, `buttonHref` | Relative path (`/contact`) or `https://` URL; reject `javascript:` |
| `email` | Valid email format |
| `phone` | 5–40 chars; strip non-phone chars for display safety |
| `seo_title` | 10–70 chars |
| `meta_description` | 50–160 chars |
| `robots` | Enum: `index,follow` \| `noindex,follow` \| `noindex,nofollow` |
| `canonical_url` | Optional valid URL on same host |

### 5.2 Payload shapes (frozen)

```typescript
// hero
{ headline, subheadline?, body?, primaryCtaLabel?, primaryCtaHref?, secondaryCtaLabel?, secondaryCtaHref? }

// text
{ heading?, body }

// cta
{ heading, body?, buttonLabel, buttonHref }

// contact_info
{ heading?, address, phone, email, workingHours?, mapUrl? }

// seo (editor → seo_metadata table)
{ seoTitle, metaDescription, canonicalUrl?, robots?, ogTitle?, ogDescription? }
```

### 5.3 PageHero mapping helper

**File:** `lib/cms/map-hero.ts`

Map `hero` payload → `PageHero` props:

| Payload field | PageHero prop |
|---------------|---------------|
| `headline` | `titleMain` + `titleAccent` (split on first comma or use `subheadline` for accent) |
| `body` | `description` |
| `subheadline` | `label` |
| Background image | **Not CMS-editable v1** — template-specific static default in page component |

Document the split rule in code comments so editors know how headline maps to the two-line hero.

---

## 6. Library module layout

Create these files in Phase 1–2. Do not scatter CMS logic across page components.

```
lib/cms/
├── constants.ts          # PAGE_REGISTRY, section keys, slug→path map
├── types.ts              # PageRecord, SectionRecord, PublishedPageSnapshot, etc.
├── sanitize.ts           # Text sanitization (extract/re-export from faqs if shared)
├── validate.ts           # Zod schemas per section type + full page draft schema
├── payloads.ts           # Default/fallback payloads from current hardcoded content
├── service.ts            # Admin: getPage, saveDraft, publish, listRevisions, restore
├── public.ts             # getPublishedPage(slug), getPublishedSeo(slug), getPublishedContactInfo()
├── revalidate.ts         # publishRevalidation(slug) → path + tags + publish_log
├── cache/
│   ├── tags.ts           # CMS_CACHE_TAGS
│   ├── queries.ts        # getCachedPublishedPage, getCachedPublishedSeo
│   └── config.ts         # TTL fallbacks (long — invalidation-driven)
└── map-hero.ts           # hero payload → PageHero props
```

### 6.1 Public gate pattern (required on every contractual route)

```typescript
// Pseudocode — every public page.tsx follows this
const cms = await getCachedPublishedPage('about');
const content = cms ?? FALLBACK_ABOUT; // from lib/cms/payloads.ts
// Pass `content.sections.hero` into layout/components
```

```typescript
// generateMetadata pattern
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getCachedPublishedSeo('about');
  if (!seo) return FALLBACK_ABOUT_METADATA;
  return { title: { absolute: seo.seoTitle }, description: seo.metaDescription, ... };
}
```

**Rule:** If `pages.status !== 'published'`, public gate returns `null` and page uses `payloads.ts` fallback. This allows gradual rollout page by page.

### 6.2 Cache tags

**File:** `lib/cms/cache/tags.ts`

```typescript
export const CMS_CACHE_TAGS = {
  page: (slug: string) => `page:${slug}`,
  seo: (slug: string) => `seo:${slug}`,
  pagesList: 'pages:list',
  layoutFooter: 'layout:footer',
  layoutNav: 'layout:nav',
} as const;
```

| Event | Invalidate |
|-------|------------|
| Publish page X | `revalidatePath(path)`, `page:X`, `seo:X` |
| Publish contact / global contact | Above + `layout:footer`, optionally `/` if home shows contact |
| Admin list refresh | `pages:list` |

**TTL:** Use long fallback (e.g. 3600s) because invalidation is primary; mirror `ADMIN_CACHE_TTL` style in `lib/cms/cache/config.ts`.

---

## 7. API routes

All admin CMS APIs live under `app/admin/api/pages/`. Use existing patterns from `app/admin/api/faqs/route.ts`:
- `requireValidAdminSession()` from auth guards
- `jsonOk` / `jsonError` from `lib/http.ts`
- Audit log on publish and restore

| Method | Route | Handler responsibility |
|--------|-------|------------------------|
| `GET` | `/admin/api/pages` | List all pages (slug, title, status, updated_at) — cached with `pages:list` |
| `GET` | `/admin/api/pages/[id]` | Full page + sections + seo for editor |
| `POST` | `/admin/api/pages/[id]/draft` | Validate → upsert sections + seo → create revision → audit |
| `POST` | `/admin/api/pages/[id]/publish` | Validate → save draft → revision → set published → revalidate → publish_log |
| `GET` | `/admin/api/pages/[id]/revisions` | List revisions newest first |
| `POST` | `/admin/api/pages/[id]/revisions/[revisionId]/restore` | Restore snapshot → save as draft (not auto-publish) |

**No public `/api/pages` route.** Public site reads CMS only via server components calling `lib/cms/public.ts`.

### 7.1 Publish sequence (strict order)

1. Validate full payload (all required sections for template).
2. Upsert sections + `seo_metadata` (auto-save).
3. Insert `page_revisions` snapshot.
4. Update `pages.status = 'published'`, `published_at = now()`.
5. If contact page: upsert `site_settings.global_contact`.
6. Call `publishRevalidation(slug)`:
   - `revalidatePath(path, 'page')`
   - `revalidateTag(CMS_CACHE_TAGS.page(slug), 'max')`
   - `revalidateTag(CMS_CACHE_TAGS.seo(slug), 'max')`
   - Extra tags if shared layout affected.
7. Insert `publish_logs` with paths/tags and success/failure.
8. `audit_logs` entry: `cms.page.publish`.
9. Return `{ ok: true, publishedAt, revalidated: { paths, tags } }`.

If step 6 partially fails, set `publish_logs.status = 'partial'` but do not roll back DB publish — content truth is DB; cache will self-heal via TTL.

---

## 8. Admin UI

### 8.1 Routes

| Route | Purpose |
|-------|---------|
| `/admin/pages` | Page list — slug, title, status badge, last updated, Edit link |
| `/admin/pages/[slug]` | Section editor for one page |
| `/admin/pages/[slug]/preview` | Draft preview in site chrome; `noindex` |

### 8.2 Components to create

```
components/admin/cms/
├── PagesList.tsx           # Table of contractual pages
├── PageEditor.tsx          # Shell: tabs or accordion per section group
├── SectionFormHero.tsx
├── SectionFormText.tsx
├── SectionFormCta.tsx
├── SectionFormContact.tsx
├── SectionFormSeo.tsx
├── PageEditorActions.tsx   # Save draft, Publish, Preview, Revisions
├── RevisionPicker.tsx      # Restore modal
└── CmsFieldHint.tsx        # Char counts for SEO fields
```

### 8.3 Editor UX rules

- Show **character counters** on SEO title (target ≤60) and meta description (target ≤155).
- **Publish** button disabled until required sections pass client-side Zod (mirror server).
- **Preview** opens `/admin/pages/[slug]/preview` in new tab — uses draft API read, not published cache.
- **Slug/path** displayed read-only with lock icon for contractual pages.
- **Restore revision** loads into draft state; does not publish until user clicks Publish.
- Reuse `AdminToastProvider` for success/error feedback.
- Reuse `AdminPageHeader`, `AdminPageSkeleton` patterns.

### 8.4 Sidebar update

Add to `contentLinks` in `AdminSidebar.tsx`:

```typescript
{ href: '/admin/pages', label: 'Pages', icon: <IconPages /> }
```

Add `IconPages` to `AdminIcons.tsx`. Add CMS cache tag invalidation to existing `POST /admin/api/cache/invalidate` handler.

---

## 9. Public route integration plan

Work **one page at a time** in Phase 3. Order recommended by risk and visibility:

1. `certifications` (stub — lowest regression risk)
2. `cookies`, `terms`, `privacy` (legal — simple text)
3. `contact` (validates shared contact + footer)
4. `careers` (new page)
5. `industries`, `products`
6. `about`
7. `home` (highest visibility — last)

### 9.1 Per-page refactor checklist

For each `app/**/page.tsx`:

- [ ] Remove static `export const metadata` → `export async function generateMetadata()`
- [ ] Import `getCachedPublishedPage` + fallback payload
- [ ] Replace hardcoded strings with section payload fields
- [ ] Keep CSS modules and layout structure unchanged
- [ ] Keep static assets (images, product grid data) unchanged unless spec says otherwise
- [ ] Verify fallback renders identically when CMS row is draft/unpublished
- [ ] Publish seed content and verify live matches fallback
- [ ] Run SEO checklist from Section 11

### 9.2 Client components

`Hero.tsx`, `HomeAbout.tsx`, `Footer.tsx` are `"use client"` today. **Do not fetch CMS inside them.**

Pattern:
- Server `page.tsx` fetches CMS snapshot.
- Pass props into client components: `<Hero content={sections.hero} />`.
- Refactor client components to accept optional `content` prop with fallback to current hardcoded defaults.

### 9.3 Careers page (new)

Create `app/careers/page.tsx` using `PageHero` + text sections + CTA. Add to `Navbar.tsx` and `Footer.tsx` sitemap links. Seed content aligned with `gnipl-content-guide.md`.

---

## 10. SEO implementation

### 10.1 CMS-owned fields

Per page via `seo_metadata`:
- `seo_title` → `<title>` (prefer `absolute` title format per `gnipl-seo-content-rules.md`)
- `meta_description`
- `canonical_url` (default to `NEXT_PUBLIC_SITE_URL + path`)
- `robots`
- `og_title`, `og_description` (optional; default from title/description)

### 10.2 Not CMS-editable v1

- `app/robots.ts` structure (still disallows `/admin/`)
- `public/sitemap.xml` generation — **Phase 5 task:** add `app/sitemap.ts` that reads published `pages` paths
- Structured data / JSON-LD — future enhancement

### 10.3 Preview SEO

Preview route must set:

```typescript
robots: { index: false, follow: false }
```

---

## 11. Implementation phases

> **Phase map lives in [`cms-build-execution-plan.md`](./cms-build-execution-plan.md).**  
> That file has the full build tracker: per-phase checklists, sub-tickets, manual test matrix, exit criteria, and progress table. Use it during implementation; this document remains the technical spec.

| Phase | Name | Summary |
|-------|------|---------|
| **0** | Scope lock | Sign-off, open decisions, fallback copy review — **no code** |
| **1** | Schema + core library | Migration `008`, `lib/cms/*`, seed, unit tests |
| **2** | Admin API + editor UI | APIs, publish/revalidate, `/admin/pages` screens |
| **3** | Public route integration | CMS gate on 10 pages (certifications → home order) |
| **4** | Publish + cache QA | Manual test matrix, draft isolation, revalidation proof |
| **5** | SEO finish | `app/sitemap.ts`, robots, SEO spot-check all pages |
| **6** | Handover | Operator docs, final publish, client independence |

---

## 12. Test checklist

### CMS behavior

- [ ] Editor can update page heading (text sections)
- [ ] Editor can update hero section
- [ ] Editor can update CTA section
- [ ] Editor can update contact information
- [ ] Editor can update SEO title and meta description
- [ ] Save draft creates `page_revisions` row
- [ ] Publish sets `status = published` and `published_at`
- [ ] Restore revision loads draft without auto-publish
- [ ] ADMIN and EDITOR can publish; INACTIVE user cannot

### Cache behavior

- [ ] Public page reads published content via `unstable_cache`
- [ ] Publish invalidates only affected path and tags (not full site)
- [ ] Normal browser reload shows updated content within seconds
- [ ] No hard refresh required
- [ ] Unpublished draft does not appear on public route
- [ ] `publish_logs` records paths and tags

### SEO behavior

- [ ] `generateMetadata` reflects published CMS SEO
- [ ] Draft SEO does not affect live metadata
- [ ] Preview has `noindex`
- [ ] Sitemap includes published contractual paths only

### Security

- [ ] No public API exposes draft content
- [ ] Admin APIs return 401 without session
- [ ] Slug/path mutation rejected for contractual pages
- [ ] CTA URLs reject `javascript:` and unsafe schemes
- [ ] Text fields strip script tags

---

## 13. Files to create (summary)

| Path | Phase |
|------|-------|
| `supabase/migrations/008_cms_pages.sql` | 1 |
| `lib/cms/**` | 1 |
| `scripts/seed-cms-pages.ts` | 1 |
| `tests/cms/*.test.ts` | 1 |
| `app/admin/api/pages/**` | 2 |
| `app/admin/(protected)/pages/**` | 2 |
| `components/admin/cms/**` | 2 |
| `app/careers/page.tsx` | 3 |
| `app/sitemap.ts` | 5 |

## 14. Files to modify (summary)

| Path | Change |
|------|--------|
| `components/admin/AdminSidebar.tsx` | Add Pages nav |
| `components/admin/AdminIcons.tsx` | Add pages icon |
| `components/Hero.tsx` | Accept CMS props |
| `components/HomeAbout.tsx` | Accept CMS props |
| `components/Footer.tsx` | Accept contact props |
| `components/Navbar.tsx` | Add Careers link |
| `app/page.tsx`, `app/about/page.tsx`, … | CMS gate + generateMetadata |
| `app/admin/api/cache/invalidate/route.ts` | CMS tags |
| `package.json` | `db:seed:cms`, `test:cms` scripts |
| `guide/admin-build-execution-plan.md` | Note CMS phase active |

---

## 15. Pre-code developer checklist

Before the first line of CMS code is written, confirm:

1. **Read** this document, `gnipl-content-guide.md`, and `gnipl-seo-content-rules.md`.
2. **Read** `lib/faqs/service.ts` and `lib/brochures/service.ts` as patterns for service + revision + cache invalidation.
3. **Read** `lib/admin/cache/queries.ts` as the pattern for `unstable_cache` + tags.
4. **Run** existing test suite — baseline must be green.
5. **Apply** Supabase migrations 001–007 if not already applied.
6. **Agree** fallback payloads with content owner (extracted copy in Phase 0).
7. **Create** a feature branch, e.g. `feature/cms-pages`.
8. **Implement** phases in order — no public route wiring before Phase 1 library tests pass.

---

## 16. Open decisions (resolve in Phase 0)

| # | Question | Default if unanswered |
|---|----------|----------------------|
| 1 | Careers page: form or mailto CTA only? | CTA with email link; no application form in v1 |
| 2 | Legal pages: one `body` section or multiple `body_N`? | Multiple fixed `body_1`…`body_N` seeded per page |
| 3 | Home hero: single headline or split main/accent? | `headline` only in v1; `subheadline` maps to `PageHero.label` where used |
| 4 | Publish certifications before full layout upgrade? | No — layout first, then CMS wire |
| 5 | Auto-publish on seed or keep draft until manual publish? | Seed as `draft`; manual publish after QA |

---

*Document version: 1.0 — 2026-06-05. Update this file when schema, scope, or phase order changes. Code changes that diverge from this plan are defects unless the plan is amended first.*
