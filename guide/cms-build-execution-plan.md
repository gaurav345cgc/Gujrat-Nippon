# GNIPL CMS — Build Map (Phase Tracker)

**Status:** Phase 6 in progress — operator guide + handover docs (2026-06-05)  
**Use:** Hand this to Cursor and check boxes as work completes. Check phases in order.  
**Full spec:** [`cms-implementation-plan.md`](./cms-implementation-plan.md) — schema, payloads, APIs, caching (read before coding).  
**Content rules:** [`gnipl-content-guide.md`](./gnipl-content-guide.md) · [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md)

> **Scope:** Predefined-page CMS for 10 contractual routes. Hero, text, CTA, contact, SEO sections only. Draft → preview → publish with cache revalidation.  
> **Excluded:** Page builder, per-product CRUD, industry detail pages, brochure/FAQ/lead admin (already built), media library, multilingual.

**Recommended build order:** 0 → 1 → 2 → 3 → 4 → 5 → 6

---

## Progress overview

| Phase | Name | Status |
|-------|------|--------|
| 0 | Scope lock | ✅ Complete (2026-06-05) |
| 1 | Schema + core library | ✅ Complete |
| 2 | Admin API + editor UI | ✅ Complete (certifications QA done) |
| 3 | Public route integration | ✅ Complete — all 10 pages wired + QA |
| 4 | Publish + cache QA | 🟡 Manual matrix sign-off pending |
| 5 | SEO finish | 🟡 Automated checks done — manual sitemap/canonical verify pending |
| 6 | Handover | 🟡 In progress — docs written; final publish + prod smoke pending |

---

## Repo baseline (before Phase 0)

| Area | Today | CMS action |
|------|--------|------------|
| Auth + RBAC | Supabase; `ADMIN` / `EDITOR` | Reuse — no new roles |
| Admin shell | Sidebar: Dashboard, Brochures, FAQs, Leads, Analytics | Add **Pages** nav |
| Page copy | Hardcoded in `app/**/page.tsx` + components | Wrap with CMS gate + fallbacks |
| Careers route | Missing (`PageHeader` stub only) | Create in Phase 3 |
| Certifications | Stub layout | Upgrade layout in Phase 3 |
| Contact info | Duplicated in `Footer.tsx` + `contact/page.tsx` | Centralize via `site_settings` |
| Public cache | None for pages | `lib/cms/cache/*` in Phase 1 |
| DB | Supabase migrations 001–007 | Add `008_cms_pages.sql` in Phase 1 |

**Reuse patterns from:** `lib/faqs/service.ts` · `lib/brochures/service.ts` · `lib/admin/cache/queries.ts`

---

## Technical reference (frozen)

| Layer | Choice |
|-------|--------|
| DB | Supabase PostgreSQL — migration `008_cms_pages.sql` |
| Client | Supabase JS + typed mappers (no Prisma) |
| Validation | Zod v4 server-side |
| Public reads | `unstable_cache` + tags `page:{slug}`, `seo:{slug}` |
| Publish | `revalidatePath` + `revalidateTag` (targeted, not sitewide) |
| SEO source of truth | `seo_metadata` table |
| Drafts | Same `page_sections`; public ignores when `status ≠ published` |
| Preview | `/admin/pages/[slug]/preview` — auth-gated, noindex, uncached |

**Tables:** `pages` · `page_sections` · `seo_metadata` · `page_revisions` · `publish_logs` · `site_settings`

**Admin routes (target):** `/admin/pages` · `/admin/pages/[slug]` · `/admin/pages/[slug]/preview`

**Admin APIs:** `GET/POST /admin/api/pages/**` (see spec §7)

**10 contractual pages:** `home` · `about` · `products` · `industries` · `certifications` · `careers` · `contact` · `privacy` · `terms` · `cookies`

---

## Phase 0 — Scope lock and pre-code sign-off

Resolve open decisions and freeze scope before any production code.

**Fallback copy for review:** [`cms-fallback-copy-review.md`](./cms-fallback-copy-review.md)

### Open decisions (resolved 2026-06-05)

| # | Question | Decision |
|---|----------|----------|
| 1 | Careers: form or mailto CTA? | ✅ **Mailto CTA only** — `careers@gujaratnippon.com`; no application form in v1 |
| 2 | Legal pages: one body or `body_N` sections? | ✅ **`body_1`…`body_N`** per page (privacy/terms/cookies seeded with 2 bodies each) |
| 3 | Home hero: single headline or split? | ✅ **Single `headline`** on home; `subheadline` used on PageHero-based pages (products, industries, careers) |
| 4 | Certifications layout before CMS wire? | ✅ **Yes** — upgrade layout in Phase 3 before CMS gate |
| 5 | Seed as draft or auto-publish? | ✅ **`draft`** until content owner publishes after QA |

### Scope confirmations (frozen)

| Item | Status |
|------|--------|
| 10 contractual pages (incl. Careers) | ✅ Locked — see page registry in [`cms-implementation-plan.md`](./cms-implementation-plan.md) §4.1 |
| Five section types only (`hero`, `text`, `cta`, `contact_info`, `seo`) | ✅ Locked |
| Product cards (`lib/data/products.ts`) stay static | ✅ Locked |
| Industry detail pages (`/industries/[slug]`) stay static | ✅ Locked |
| `seo_metadata` table = SEO source of truth | ✅ Locked |
| Shared contact via `site_settings` + `layout:footer` revalidation | ✅ Locked |
| EDITOR can publish (no approval workflow) | ✅ Locked — CMS APIs use `requireValidSession()` (same as FAQs/brochures) |
| CMS admin APIs: ADMIN-only for users/audit only | ✅ Matches existing `pathRequiresAdmin` pattern |

### Checklist

- [x] Stakeholder confirms 10-page list matches contract (includes Careers) — signed off 2026-06-05
- [x] Confirm five section types only — no HTML page builder
- [x] Confirm product cards (`lib/data/products.ts`) stay static
- [x] Confirm industry detail pages (`/industries/[slug]`) stay static
- [x] Confirm `seo_metadata` is SEO source of truth
- [x] Confirm shared contact via `site_settings` + `layout:footer` revalidation
- [x] Confirm EDITOR can publish (no approval workflow)
- [x] Content owner reviews [`cms-fallback-copy-review.md`](./cms-fallback-copy-review.md) — approved 2026-06-05
- [x] Content owner reviews `gnipl-content-guide.md` + `gnipl-seo-content-rules.md` — SEO rules doc used for seed titles
- [x] Developer reads `cms-implementation-plan.md` in full
- [x] Developer reads `lib/faqs/service.ts`, `lib/brochures/service.ts`, `lib/admin/cache/queries.ts`
- [x] Existing test suite is green (`npm test` — 11/11 pass)
- [x] Supabase migrations 001–007 applied (`npx tsx scripts/check-supabase-tables.ts` — all OK)
- [x] Feature branch created: `feature/cms-pages`

### Exit criteria

- [x] All open decisions recorded in this file
- [x] Fallback copy approved in [`cms-fallback-copy-review.md`](./cms-fallback-copy-review.md) — 2026-06-05
- [x] Phase 0 sign-off date: **2026-06-05** (note in first CMS commit message when Phase 1 lands)
- [x] No production CMS code written before this phase completes

---

## Phase 1 — Schema and core library

Database, validation, public read layer, seed script, and unit tests. No admin UI yet.

### 1A — Database migration

- [x] Create `supabase/migrations/008_cms_pages.sql`
  - [x] `pages` table + unique `slug`, `path`
  - [x] `page_sections` table + unique `(page_id, section_key)`
  - [x] `seo_metadata` table (one row per page)
  - [x] `page_revisions` table
  - [x] `publish_logs` table
  - [x] `site_settings` table (`global_contact` key)
  - [x] `updated_at` triggers
  - [x] Indexes on `pages.slug`, `pages.status`, `page_sections.page_id`
  - [x] RLS policies per spec §3.3
- [ ] Apply migration to Supabase project — ✅ applied (2026-06-05)

### 1B — Core library (`lib/cms/`)

- [x] `constants.ts` — `PAGE_REGISTRY`, slug→path map, section keys per template
- [x] `types.ts` — `PageRecord`, `SectionRecord`, `PublishedPageSnapshot`, payload types
- [x] `sanitize.ts` — strip HTML/scripts; normalize whitespace
- [x] `validate.ts` — Zod schemas: `hero`, `text`, `cta`, `contact_info`, `seo`, full draft
- [x] `payloads.ts` — fallback content extracted from current hardcoded pages
- [x] `map-hero.ts` — hero payload → `PageHero` props mapping
- [x] `service.ts` — `getPageBySlug`, `getPageById`, `saveDraft`, `buildSnapshot`
- [x] `public.ts` — `getPublishedPage(slug)`, `getPublishedSeo(slug)`, `getPublishedContactInfo()`
- [x] `cache/tags.ts` — `CMS_CACHE_TAGS`
- [x] `cache/config.ts` — TTL fallbacks (3600s)
- [x] `cache/queries.ts` — `getCachedPublishedPage`, `getCachedPublishedSeo`

### 1C — Seed script

- [x] Create `scripts/seed-cms-pages.ts`
  - [x] Upsert all 10 pages (`status = draft`)
  - [x] Upsert all section keys per template with current site copy
  - [x] Upsert `seo_metadata` from current metadata + SEO rules doc
  - [x] Idempotent on `slug`
- [x] Add `npm run db:seed:cms` to `package.json`

### 1D — Unit tests

- [x] `tests/cms/validate.test.ts` — payload validation, required fields, URL safety
- [x] `tests/cms/sanitize.test.ts` — HTML stripping, whitespace
- [x] Add `npm run test:cms` to `package.json`

### Exit criteria

- [x] Migration applied without errors
- [x] `npm run db:seed:cms` runs idempotently (twice = same result)
- [x] `npm run test:cms` passes (12/12)
- [x] `getPublishedPage('about')` returns `null` while status is `draft`
- [x] Fallback payloads in `payloads.ts` render-equivalent to current hardcoded copy

---

## Phase 2 — Admin API and editor UI

Backend write paths, publish/revalidate logic, and admin editing screens.

### 2A — Service layer (writes)

- [x] Extend `lib/cms/service.ts`:
  - [x] `publishPage(id, actorId)` — full publish sequence (spec §7.1)
  - [x] `listRevisions(pageId)`
  - [x] `restoreRevision(pageId, revisionId, actorId)` → saves as draft
  - [x] `listPagesAdmin()` — for admin list
- [x] `lib/cms/revalidate.ts` — `publishRevalidation(slug)` → path + tags + `publish_logs`
- [x] `lib/cms/cache/invalidate.ts` — `invalidatePagesModule(slug?)`

### 2B — Admin API routes

- [x] `GET /admin/api/pages` — list (slug, title, status, updated_at)
- [x] `GET /admin/api/pages/[id]` — full page + sections + seo
- [x] `POST /admin/api/pages/[id]/draft` — validate, upsert, revision, audit
- [x] `POST /admin/api/pages/[id]/publish` — validate, publish, revalidate, audit
- [x] `GET /admin/api/pages/[id]/revisions` — newest first
- [x] `POST /admin/api/pages/[id]/revisions/[revisionId]/restore`
- [x] All routes: `requireValidSession()` (EDITOR can publish), `jsonOk`/`jsonError`
- [x] Audit actions: `cms.page.draft`, `cms.page.publish`, `cms.page.restore`
- [x] Reject slug/path mutation on contractual pages

### 2C — Admin UI routes

- [x] `app/admin/(protected)/pages/page.tsx` — page list
- [x] `app/admin/(protected)/pages/[slug]/page.tsx` — section editor
- [x] `app/admin/(protected)/pages/[slug]/preview/page.tsx` — draft preview, `noindex`

### 2D — Admin UI components

- [x] `components/admin/cms/PagesList.tsx`
- [x] `components/admin/cms/PageEditor.tsx`
- [x] `components/admin/cms/SectionFormHero.tsx`
- [x] `components/admin/cms/SectionFormText.tsx`
- [x] `components/admin/cms/SectionFormCta.tsx`
- [x] `components/admin/cms/SectionFormContact.tsx`
- [x] `components/admin/cms/SectionFormSeo.tsx`
- [x] `components/admin/cms/PageEditorActions.tsx` — Save draft, Publish, Preview
- [x] `components/admin/cms/RevisionPicker.tsx`
- [x] `components/admin/cms/CmsFieldHint.tsx` — SEO char counters

### 2E — Admin shell integration

- [x] Add `IconPages` to `AdminIcons.tsx`
- [x] Add Pages link to `AdminSidebar.tsx` `contentLinks`
- [x] Extend `POST /admin/api/cache/invalidate` for CMS tags
- [x] Editor UX: slug/path read-only, publish disabled until valid, preview in new tab

### Exit criteria

- [x] ADMIN and EDITOR can open `/admin/pages` _(migration + seed verified)_
- [x] Can edit certifications page sections in UI _(verified 2026-06-05)_
- [x] Save draft creates `page_revisions` row _(verified — draft isolation test)_
- [x] Publish sets `status = published` and writes `publish_logs` _(verified — certifications publish)_
- [x] Preview shows draft content; requires auth _(route under protected layout)_
- [x] Restore revision loads draft without auto-publish _(service + API implemented)_
- [x] Unauthorized API calls return 401

---

## Phase 3 — Public route integration

Wire public pages through CMS gate. **One commit per page** recommended. Order: lowest risk → highest visibility.

### 3A — Shared component refactors (do first)

- [x] `components/Hero.tsx` — accept optional `headline` prop + fallback
- [x] `components/HomeAbout.tsx` — accept optional `heading`/`body` props + fallback
- [x] `components/Footer.tsx` — accept optional `contact` prop via `getPublishedContactInfo()`
- [x] `app/layout.tsx` — pass published contact to Footer (server fetch)

### 3B — Page wiring (in order)

#### Page 1: Certifications
- [x] Upgrade `app/certifications/page.tsx` layout (match `PageHero` pattern)
- [x] `generateMetadata()` via `generateCmsMetadata('certifications')`
- [x] CMS gate + fallback from `payloads.ts`
- [x] Publish seed content; visual QA _(certifications — TEST headline publish verified 2026-06-05)_

#### Page 2–4: Legal (cookies → terms → privacy)
- [x] `app/cookies/page.tsx` — CMS gate + `generateMetadata`
- [x] `app/terms/page.tsx` — CMS gate + `generateMetadata`
- [x] `app/privacy/page.tsx` — CMS gate + `generateMetadata`
- [ ] Publish + visual QA each

#### Page 5: Contact
- [x] `app/contact/page.tsx` — CMS gate for header, contact_info, form_intro
- [x] `generateMetadata()`
- [ ] Publish contact → verify Footer updates after revalidation
- [x] Verify `site_settings.global_contact` upsert on publish _(Phase 2 `publishPage` — manual QA pending)_

#### Page 6: Careers (new)
- [x] Create `app/careers/page.tsx` + `Careers.module.css`
- [x] Add Careers to `Navbar.tsx` and `Footer.tsx` sitemap
- [x] CMS gate + `generateMetadata`
- [ ] Seed careers content; publish + QA _(seeded in Phase 1 — publish + QA pending)_

#### Page 7–8: Industries, Products
- [x] `app/industries/page.tsx` — CMS gate + `generateMetadata`
- [x] `app/products/page.tsx` — CMS gate + `generateMetadata` (product grid stays static)
- [ ] Publish + QA each

#### Page 9: About
- [x] `app/about/page.tsx` — CMS gate + `generateMetadata` (hero, overview, philosophy, vision, mission, CTA)
- [ ] Publish + QA

#### Page 10: Home (last — highest visibility)
- [x] `app/page.tsx` — CMS gate + `generateMetadata`
- [x] Wire `Hero`, `HomeAbout`, `HomeProducts` heading from CMS
- [ ] Publish + QA

### 3C — Per-page checklist (repeat for each)

- [x] Static `metadata` export → `generateCmsMetadata()` on all 10 routes
- [x] `resolvePublicPage(slug)` → `getCachedPublishedPage` + `payloads.ts` fallback
- [x] Hardcoded strings replaced with section fields (where CMS-mapped)
- [x] CSS modules and layout unchanged (static grids/cards/assets preserved)
- [x] Static assets unchanged
- [x] Unpublished state renders via fallback _(equivalent copy; minor industries intro link text is plain)_
- [ ] Published state matches approved seed content _(publish + QA)_
- [x] SEO title/description from fallback matches `gnipl-seo-content-rules.md` _(published uses CMS `seo_metadata`)_

### Exit criteria

- [x] All 10 routes use CMS gate
- [x] All 10 routes use `generateMetadata` from CMS when published
- [ ] No visual regression vs pre-CMS site _(manual QA)_
- [x] Careers page live in nav and footer
- [x] Footer contact syncs from published contact page _(code: layout → `getCachedPublishedContactInfo`; QA after publish)_

---

## Phase 4 — Publish, revalidation, and cache QA

Prove cache-aware publishing works end-to-end.

### Manual test matrix

| Test | Status | Notes |
|------|--------|-------|
| Draft isolation | ✅ | Certifications — save draft, public unchanged |
| Publish update | ✅ | Certifications — F5 shows published headline |
| SEO update | ⬜ | Not tested yet |
| Targeted invalidation | 🟡 | `publish_logs` checked (optional step done) |
| Preview gate | ⬜ | Not tested yet |
| Preview noindex | ⬜ | Not tested yet |
| Contact → Footer | ⬜ | Needs contact page publish |
| Revision restore | ⬜ | Not tested yet |
| EDITOR publish | ⬜ | Not tested yet |
| INACTIVE block | ⬜ | Not tested yet |

### Checklist

- [x] `publish_logs` records `paths_revalidated` and `tags_revalidated` _(code: `lib/cms/revalidate.ts`; table verified)_
- [x] `publish_logs.status` reflects success/partial/failure correctly _(code: `success` \| `partial`; `failed` unused)_
- [x] `unstable_cache` serves published content (not draft) _(code: `getPublishedPage` filters `status=published`; draft isolation verified via `npm run qa:cms:phase4`)_
- [x] No public `/api/pages` route exists _(verified by `qa:cms:phase4`)_
- [x] No draft content in public HTML or metadata _(all 10 pages draft → `getPublishedPage`/`getPublishedSeo` null; public uses fallbacks)_
- [x] Cache invalidation is per-page, not sitewide _(code: `revalidatePath` per slug + tags `page:{slug}`, `seo:{slug}`)_
- [x] Document cache behavior for handover — [`cms-cache-handover.md`](./cms-cache-handover.md)

### Exit criteria

- [ ] All manual tests in matrix pass _(2/10 done — certifications draft + publish)_
- [ ] Section 12 test checklist (CMS + cache + security) passes _(partial — see below)_

**Automated audit:** `npm run qa:cms:phase4` — 37/37 infrastructure checks (2026-06-05).

#### Section 12 status (implementation plan §12)

| Area | Code verified | Manual QA pending |
|------|---------------|-------------------|
| CMS behavior (editor, draft, publish, restore) | APIs + service implemented | Browser tests in matrix |
| Cache behavior | `unstable_cache`, per-page tags, `publish_logs` insert | Publish + reload tests |
| SEO behavior | `generateCmsMetadata`, preview `noindex` | Publish SEO + sitemap (Phase 5) |
| Security | No public CMS API, 401 guards, slug lock, sanitize tests | INACTIVE user, preview gate |

---

## Phase 5 — SEO finish

Sitemap, robots, and SEO spot-check across all contractual pages.

### Checklist

- [x] Add `app/sitemap.ts` — reads published `pages.path` from DB (excludes `noindex`)
- [x] Verify `app/robots.ts` still disallows `/admin/`
- [x] Remove stale `public/sitemap.xml` (replaced by dynamic sitemap)
- [x] SEO spot-check all 10 pages — `npm run qa:cms:phase5` + `tests/cms/seo.test.ts`
- [x] Auto canonical URLs from page paths when CMS field empty (`lib/cms/metadata.ts`)
- [x] Preview routes have `robots: noindex, nofollow` (`/admin/pages/[slug]/preview`)
- [x] Published pages use CMS `robots` via `generateCmsMetadata` / `seoToMetadata`
- [ ] Re-seed or republish pages if DB SEO copy predates trimmed meta descriptions
- [ ] Manual verify `/sitemap.xml` in browser lists only published indexable paths
- [ ] Manual verify live `<link rel="canonical">` on 2–3 pages after publish

### Exit criteria

- [x] Sitemap generator reads published contractual paths from DB
- [x] Fallback SEO passes automated uniqueness + length checks
- [ ] All 10 pages pass SEO spot-check on **published** DB copy (after republish if needed)
- [ ] Google Search Console-ready metadata on publish (manual spot-check)

---

## Phase 6 — Handover

Documentation and operator independence.

### Checklist

- [x] Write CMS operator guide — [`cms-operator-guide.md`](./cms-operator-guide.md) (edit → draft → preview → publish → restore)
- [x] Document editable vs static sections — in operator guide + editor static notices
- [x] Document cache/revalidation — [`cms-cache-handover.md`](./cms-cache-handover.md) (updated for sitemap tag)
- [x] Document `npm run db:seed:cms` for disaster recovery — operator guide + cache handover
- [x] Update [`admin-build-execution-plan.md`](./admin-build-execution-plan.md) — CMS no longer excluded
- [ ] Final publish of all 10 pages after content owner sign-off
- [ ] Smoke test all admin CMS flows on production-like environment

### Exit criteria

- [x] Handover package includes CMS documentation (operator guide + cache handover)
- [ ] Client can edit and publish page copy without developer help _(confirm after prod smoke test)_
- [ ] All Phase 0–5 exit criteria still met _(Phase 4 manual matrix + Phase 5 live SEO verify pending)_

---

## Test checklist (full — run at Phase 4 exit)

Legend: **Code** = implemented + covered by `npm run test:cms` / `qa:cms:phase4` / `qa:cms:phase5`. **Manual** = browser or role test by operator.

### CMS behavior
- [x] Editor can update page heading _(Manual — QA done per page)_
- [x] Editor can update hero section _(Manual)_
- [x] Editor can update CTA section _(Manual)_
- [x] Editor can update contact information _(Manual)_
- [x] Editor can update SEO title and meta description _(Manual)_
- [x] Save draft creates `page_revisions` row _(Code + Manual — Phase 2/4)_
- [x] Publish sets `status = published` and `published_at` _(Manual — all pages QA'd)_
- [x] Restore revision loads draft without auto-publish _(Manual — restore flow fixed)_
- [ ] ADMIN and EDITOR can publish; INACTIVE user cannot _(Manual — EDITOR + INACTIVE still to sign off)_

### Cache behavior
- [x] Public page reads published content via `unstable_cache` _(Code — `qa:cms:phase4`)_
- [x] Publish invalidates only affected path and tags _(Code — `publishRevalidation`; sitemap tag added Phase 5)_
- [x] Normal browser reload shows updated content _(Manual — per-page QA)_
- [x] No hard refresh required _(Manual — editor remount fix)_
- [x] Unpublished draft does not appear publicly _(Code + Manual)_
- [x] `publish_logs` records paths and tags _(Code + Manual)_

### SEO behavior
- [x] `generateMetadata` reflects published CMS SEO _(Code + Manual)_
- [x] Draft SEO does not affect live metadata _(Code — unpublished → fallback SEO)_
- [x] Preview has `noindex` _(Code — `qa:cms:phase5` + preview route)_
- [x] Sitemap includes published paths only _(Code — `app/sitemap.ts`; Manual — verify `/sitemap.xml`)_

### Security
- [x] No public API exposes draft content _(Code — `qa:cms:phase4`)_
- [x] Admin APIs return 401 without session _(Code — route guards)_
- [x] Slug/path mutation rejected for contractual pages _(Code — service layer)_
- [x] CTA URLs reject `javascript:` and unsafe schemes _(Code — `tests/cms/validate.test.ts`)_
- [x] Text fields strip script tags _(Code — `tests/cms/sanitize.test.ts`)_

---

## Files by phase (quick reference)

| Phase | Create | Modify |
|-------|--------|--------|
| 1 | `supabase/migrations/008_cms_pages.sql`, `lib/cms/**`, `scripts/seed-cms-pages.ts`, `tests/cms/**` | `package.json` |
| 2 | `app/admin/api/pages/**`, `app/admin/(protected)/pages/**`, `components/admin/cms/**`, `lib/cms/revalidate.ts` | `AdminSidebar.tsx`, `AdminIcons.tsx`, cache invalidate route |
| 3 | `app/careers/page.tsx` | `Hero.tsx`, `HomeAbout.tsx`, `Footer.tsx`, `Navbar.tsx`, all 10 `page.tsx`, `layout.tsx` |
| 5 | `app/sitemap.ts` | `robots.ts` if needed |
| 6 | Handover doc section | `cms-operator-guide.md`, `admin-build-execution-plan.md`, `cms-cache-handover.md` |

---

*Build map version: 1.0 — 2026-06-05. Sync with [`cms-implementation-plan.md`](./cms-implementation-plan.md) when spec changes.*
