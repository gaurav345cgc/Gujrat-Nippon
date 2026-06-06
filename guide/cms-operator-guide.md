# GNIPL CMS — Operator guide

How content editors update the 10 contractual website pages without developer help.

**Related docs:** [`cms-cache-handover.md`](./cms-cache-handover.md) · [`gnipl-content-guide.md`](./gnipl-content-guide.md) · [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md)

---

## Access

1. Log in at `/admin/login` as **Admin** or **Editor**.
2. Open **Pages** in the admin sidebar (`/admin/pages`).
3. Click a page name to open the editor (`/admin/pages/[slug]`).

Both roles can save drafts, preview, publish, restore revisions, and reset to defaults.

---

## Daily workflow: edit → draft → preview → publish

### 1. Edit content

Each page shows fixed sections (hero, text blocks, CTAs, contact info, SEO). Slug and URL path are **read-only**.

- Edit fields in the section cards.
- SEO is at the bottom (title, meta description, canonical URL optional, robots).
- **Save draft** stores changes in the database and creates a revision snapshot. The **live site does not change** until you publish.

### 2. Preview (optional)

Click **Preview** (or open `/admin/pages/[slug]/preview` in a new tab).

- Shows **draft** content, not the live site.
- Requires login; search engines are blocked (`noindex`).
- Use this to proofread before publish.

### 3. Publish

When validation passes, click **Publish**.

- Sets page status to **published** and updates the public site on the next normal page load.
- **Contact page:** publishing **Contact info** also updates the **footer** on every page (address, phone, email).
- Check `publish_logs` in Supabase (or ask dev) if content does not appear after reload.

### 4. Restore a previous version

Use **Revision picker** at the bottom of the editor:

- **Restore as draft** loads an old snapshot into the editor and saves as draft (does **not** auto-publish).
- Review in preview, then **Publish** when ready.

### 5. Reset to site defaults

**Reset to defaults** reloads copy from `lib/cms/payloads.ts` (developer-maintained baseline), saves as **draft**, and demotes the page to draft status. You must **Publish** again for the live site to change.

Use when the editor has drifted or after a developer updates default copy.

---

## What you can edit vs what stays in the template

### All pages

| Editable in CMS | Stays in site code |
|-----------------|-------------------|
| Headlines, body text, CTA labels and links | Navbar, logo, layout, CSS |
| SEO title, meta description, robots | Page structure and section order |
| Contact address, phone, email (contact page) | CIN line in footer and contact page |
| | Most images (see per-page below) |

### Home (`/`)

**Editable:** hero headline; about teaser; service cards (4); capability carousel slides (8); products carousel titles/descriptions (12); section headings; bottom CTA; SEO.

**Static:** hero background; capability side image; product carousel **images**; “Download Brochure” labels; navbar/footer chrome. Footer contact comes from published **Contact → Contact info**.

### About (`/about`)

**Editable:** hero; company overview; stats row (`Label\|Value` per line); philosophy intro; philosophy tab titles (4); goals section; vision & mission; CTAs; SEO.

**Static:** hero background; philosophy side image; goal card **photos**; decorative carousel arrows; “READ MORE” on goal cards.

### Products (`/products`)

**Editable:** hero; six product card **titles and descriptions**; SEO.

**Static:** product card **images** (fixed by card position).

### Industries (`/industries`)

**Editable:** hero; intro texts; eight industry card **titles and descriptions**; SEO.

**Static:** card **images**; industry detail URLs (`/industries/[slug]` pages and slugs are fixed in code).

### Certifications, Careers, Legal (privacy, terms, cookies)

Fully text-driven through CMS sections listed in the editor. Layout matches the public page template.

### Contact (`/contact`)

**Editable:** page header, contact info block, form intro, SEO.

**Static:** enquiry form fields and CIN. **Footer sync:** publish contact info to update site-wide footer.

---

## SEO checklist for editors

Before publishing a page:

1. **Title** — unique; keyword first, brand last (see [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md)).
2. **Meta description** — unique; roughly 50–160 characters; factual B2B tone.
3. **Robots** — leave `index,follow` unless the page should be hidden from search.
4. **Canonical URL** — optional; if empty, the site auto-uses the correct page URL on publish.

After publishing all pages, confirm `/sitemap.xml` lists only published paths (unpublished pages are omitted).

---

## Cache and “why don’t I see my change?”

| Situation | What the public sees |
|-----------|----------------------|
| Saved draft only | Old published content, or fallback copy if never published |
| Just published | New content after a normal browser reload (no hard refresh needed) |
| Contact info published | Footer updates on all pages after reload |

Details: [`cms-cache-handover.md`](./cms-cache-handover.md).

If content is still stale after publish, an Admin can call **cache invalidate** (API) or wait up to 1 hour (TTL fallback).

---

## Disaster recovery (developers / IT)

These commands reset CMS data from repo defaults. **Run only when instructed** — they overwrite draft content in the database.

```bash
npm run db:migrate:cms   # verify CMS tables exist
npm run db:seed:cms      # upsert all 10 pages + sections + SEO (status = draft)
```

After seeding, editors must **Publish** each page again for the live site to use DB content.

Export current DB defaults back to code (developers only):

```bash
npm run db:export:cms-defaults
```

---

## QA commands (developers)

```bash
npm run test:cms          # validation + SEO unit tests
npm run qa:cms:phase4     # publish/cache infrastructure
npm run qa:cms:phase5     # SEO + sitemap audit
```

---

## The 10 contractual pages

| Page | Admin slug | Public path |
|------|------------|-------------|
| Home | `home` | `/` |
| About | `about` | `/about` |
| Products | `products` | `/products` |
| Industries | `industries` | `/industries` |
| Certifications | `certifications` | `/certifications` |
| Careers | `careers` | `/careers` |
| Contact | `contact` | `/contact` |
| Privacy | `privacy` | `/privacy` |
| Terms | `terms` | `/terms` |
| Cookies | `cookies` | `/cookies` |

**Not in CMS:** product detail subpages, industry detail pages (`/industries/[slug]`), brochures, downloads, FAQ content (separate admin modules).

---

## Support boundaries

- **Editors can:** change approved copy, CTAs, contact info, SEO, publish and restore revisions.
- **Developers needed for:** new pages, new sections, layout/CSS changes, new images in templates, schema or code changes.

For implementation detail see [`cms-implementation-plan.md`](./cms-implementation-plan.md) and [`cms-build-execution-plan.md`](./cms-build-execution-plan.md).
