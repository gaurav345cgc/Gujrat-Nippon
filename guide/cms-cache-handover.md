# CMS cache and publish behavior — handover

How published content reaches the public site, and what happens on publish.

## Read path (public pages)

1. Each contractual route calls `resolvePublicPage(slug)` (`lib/cms/gate.ts`).
2. That uses `getCachedPublishedPage(slug)` (`lib/cms/cache/queries.ts`) — `unstable_cache` with tag `page:{slug}`.
3. `getPublishedPage()` (`lib/cms/public.ts`) returns **null** unless `pages.status = 'published'` and `published_at` is set.
4. When null, the page renders from `lib/cms/payloads.ts` fallbacks (same copy as pre-CMS).

**SEO:** `generateCmsMetadata(slug)` → `getCachedPublishedSeo(slug)` (tag `seo:{slug}`) or fallback SEO.

**Footer contact:** `app/layout.tsx` → `getCachedPublishedContactInfo()` (tag `layout:footer`) or `GLOBAL_CONTACT` fallback.

## Publish path (admin)

1. Editor saves draft → `POST /admin/api/pages/[id]/draft` → upsert sections + `page_revisions`.
2. Editor publishes → `POST /admin/api/pages/[id]/publish` → `publishPage()` in `lib/cms/service.ts`:
   - Validates and saves draft snapshot
   - Sets `pages.status = 'published'`, `published_at`
   - Contact page: upserts `site_settings.global_contact`
   - Calls `publishRevalidation(slug)` (`lib/cms/revalidate.ts`)

## Revalidation (targeted, not sitewide)

On publish of page `X`:

| Action | Target |
|--------|--------|
| `revalidatePath` | That page's path only (e.g. `/about`) |
| `revalidatePath` | `/sitemap.xml` (all publishes) |
| `revalidateTag` | `page:{slug}`, `seo:{slug}`, `sitemap` |
| Extra tag | `layout:footer` when publishing **contact** |

A row is inserted into `publish_logs` with:

- `paths_revalidated` — array of paths
- `tags_revalidated` — array of tags
- `status` — `success` or `partial` (if revalidation throws)
- `error_message` — set when status is `partial`

## Cache TTL

Tags are the primary invalidation mechanism. TTL fallbacks in `lib/cms/cache/config.ts`:

- `page`, `seo`, `contact`: 3600 seconds

If tag invalidation fails, content may be stale for up to 1 hour.

## Draft vs published

| State | Public HTML | Public metadata |
|-------|-------------|-----------------|
| Draft only | Fallback from `payloads.ts` | Fallback SEO |
| Published | DB sections via cache | DB `seo_metadata` via cache |

Draft content never appears on public routes. Admin preview (`/admin/pages/[slug]/preview`) uses `getPageBySlug` (draft OK), requires login, `robots: noindex`.

## Manual QA matrix (Phase 4)

Run after first publish:

1. **Draft isolation** — Edit about hero, save draft, do not publish → public `/about` unchanged.
2. **Publish update** — Publish change → normal reload shows new copy.
3. **SEO update** — Publish new meta description → view source shows new value.
4. **Targeted invalidation** — Publish one page → check `publish_logs` paths/tags; other pages unchanged.
5. **Preview gate** — Open `/admin/pages/about/preview` logged out → redirect to login.
6. **Preview noindex** — Preview page source contains `noindex`.
7. **Contact → Footer** — Publish contact phone change → footer updates on reload.
8. **Revision restore** — Restore revision, publish → live site matches restored content.
9. **EDITOR publish** — Log in as EDITOR → publish succeeds.
10. **INACTIVE block** — Deactivate user → CMS API returns 401.

## Operator commands

```bash
npm run db:migrate:cms    # verify CMS tables
npm run db:seed:cms       # idempotent seed (draft) — disaster recovery
npm run test:cms          # validation + SEO unit tests
npm run qa:cms:phase4     # Phase 4 infrastructure audit
npm run qa:cms:phase5     # Phase 5 SEO + sitemap audit
```

**Operator guide:** [`cms-operator-guide.md`](./cms-operator-guide.md)

## Manual cache bust (admin)

`POST /admin/api/cache/invalidate` with body:

```json
{ "cmsSlug": "about" }
```

Or combined with admin tags:

```json
{ "tags": ["faqs:list"], "cmsSlug": "contact" }
```

## Security summary

- No public `/api/pages` — CMS reads are server-only via `lib/cms/public.ts`.
- Admin CMS APIs require `requireValidSession()` (ACTIVE ADMIN or EDITOR).
- Contractual slug/path cannot be changed via API.
- CTA URLs and text sanitized in `lib/cms/validate.ts` + `sanitize.ts`.
