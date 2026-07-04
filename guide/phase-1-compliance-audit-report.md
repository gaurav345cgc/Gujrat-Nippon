# GNIPL Phase 1 Compliance Audit Report

Audit date: 2026-05-30
Audited workspace: `D:\GitHub\GNIL\gujarat-nippon`
Audit basis: attached client QA checklist, `guide/admin-build-execution-plan.md`, `guide/admin-implementation-plan.md`, source inspection, route/build/test/lint verification.

## Executive Summary

Overall compliance score: 62%

Launch readiness: Not ready for client acceptance. The site builds with network access and the recent rule-based chatbot redesign is present, but Phase 1 acceptance is blocked by missing contractual pages, incomplete contact fields, missing product detail pages, unverified database workflows, failing lint, incomplete SEO/security hardening, and a lead data model mismatch between `inquiries` and the newer `leads` table.

Important scope note: the local scope documents conflict. `guide/admin-build-execution-plan.md` explicitly says the current admin build is "No CMS" and excludes CMS page editing. `guide/admin-implementation-plan.md` includes CMS-style page management. This must be resolved with the client before final acceptance. I have marked CMS as a scope conflict rather than a straightforward implementation failure.

## Verification Performed

- `npm run test`: Passed. 11 FAQ validation/sanitization tests passed.
- `npm run lint`: Failed. 11 errors and 20 warnings remain.
- `npx next build`: Failed in sandbox because `next/font` could not fetch Google Fonts; passed when rerun with network access.
- Static route inventory: Checked all `app/` routes and admin/public API routes.
- Source audit: Checked public pages, admin guards, brochure/download implementation, lead ingestion, analytics, chatbot, SEO metadata, security headers, and migrations.
- Browser/mobile visual QA: Not completed in this audit pass because the available in-app browser bridge previously rejected the session trust handshake. Responsive findings below are static-code risks unless otherwise stated.

## Scope Compliance Matrix

| Phase 1 requirement | Status | Evidence / issue |
|---|---:|---|
| Home page | Implemented | `app/page.tsx` exists with metadata. |
| About page | Implemented | `app/about/page.tsx` exists. |
| Products / Services listing | Partially implemented | `app/products/page.tsx` lists cards, but no detail pages. |
| Product/service detail pages | Missing | `next.config.ts` redirects `/products/:slug` to `/products`; no `app/products/[slug]`. |
| Industries listing | Implemented | `app/industries/page.tsx` exists. |
| Industry detail pages | Implemented | `app/industries/[slug]/page.tsx` with static params. |
| Certifications / quality page | Partially implemented | Page exists, but content is thin/generic and says ISO 27001/9001 without visible proof files. |
| Careers page | Missing | No `app/careers/page.tsx`; sitemap also omits `/careers`. |
| Contact page | Partially implemented | Exists, but form lacks required Company and Subject fields. |
| Privacy / Terms / Cookie pages | Partially implemented | Exist, but legal copy is thin and metadata incomplete. |
| Public downloads/brochures page | Partially implemented | `/brochures` uses DB API; `/downloads` uses old static mock data. Two competing resource pages exist. |
| Brochure download tracking | Partially implemented | `/download/[slug]` increments count after file retrieval, but count update is non-atomic. |
| Admin secure login | Partially implemented | Supabase Auth, origin checks, rate limiting present; needs live credential and negative-path verification. |
| Admin roles Admin / Editor | Partially implemented | Guards exist for users/deletes; many module writes allow any valid admin session as intended by current matrix. |
| CMS page editing | Scope conflict / Missing if required | Current build map excludes CMS; broader implementation plan requires it. No CMS routes exist. |
| Brochure admin | Partially implemented | Upload/replace/edit/reorder/delete/version restore present; live DB/storage testing not completed. |
| FAQ admin | Implemented with gaps | CRUD/reorder/status and tests exist; public chatbot is hardcoded and does not consume admin FAQ API. |
| Lead management | Partially implemented | Admin reads `inquiries`; migration creates separate `leads`; no company/subject/source normalization. |
| CSV export | Partially implemented | Export exists, but CSV formula injection is not neutralized. |
| Basic analytics | Partially implemented | Page views, downloads, inquiries tracked; lacks bot filtering/dedup/date UI and live accuracy verification. |
| Rule-based chatbot | Partially implemented | Correct four categories and direct answers; Talk to Human posts to `/api/inquiries`, not `leads`; not admin-FAQ driven. |
| Security baseline | Partially implemented | Admin headers and auth guards exist; CSP, public form rate limiting, CSRF for public writes, and upload malware scanning absent. |
| SEO readiness | Partially implemented | Basic titles/descriptions exist; no dynamic sitemap route, no canonical/Open Graph/Twitter metadata, no structured data. |
| Performance readiness | Partially implemented | Build passes with network; many large unoptimized images and `<img>` lint warnings remain. |

## Critical Issues

1. Missing Careers page
Severity: Critical
Evidence: no `app/careers/page.tsx`; `Test-Path app\careers\page.tsx` returned false. `components/PageHeader.tsx` contains `/careers` header data, but no route.
Why it is a problem: Careers is listed in the approved page audit scope. A client checking `/careers` will hit 404.
Exact fix: Add `app/careers/page.tsx`, metadata, sitemap entry, navigation/footer link if required, and responsive content.
Scope violation: Yes, if Careers is in Phase 1 public website scope.

2. Product/service detail pages are absent
Severity: Critical
Evidence: `next.config.ts:7` permanently redirects `/products/:slug` to `/products`; no `app/products/[slug]/page.tsx`.
Why it is a problem: The audit requires category/detail pages, every card testability, and search-friendly URLs. Current product cards are not deep-linkable and industry "related products" all link back to `/products`.
Exact fix: Create `app/products/[slug]/page.tsx`, product data slugs, `generateStaticParams`, metadata, detail CTA links, and remove the redirect.
Scope violation: Yes.

3. Contact and chatbot leads do not match required lead schema
Severity: Critical
Evidence: `components/contact/ContactForm.tsx:23` posts only `{ name, email, phone, message }`; `components/RuleBasedChatbot.tsx:280` posts to `/api/inquiries`; `lib/analytics/service.ts:75` writes to `inquiries`; `supabase/migrations/008_chatbot_leads_and_faq_updates.sql:11` creates a separate `leads` table.
Why it is a problem: Required fields include Company and Subject for contact. Chatbot Talk to Human must save and appear in admin. The implementation stores company inside the message body and does not use the `leads` table/source model.
Exact fix: Normalize on one table, preferably `leads`, with `source`, `name`, `company`, `email`, `phone`, `subject`, `message`, `status`, timestamps. Update `/api/inquiries` or replace it with `/api/leads`, update contact/chatbot forms, admin list/export, analytics counts, and migrations.
Scope violation: Yes.

4. CMS requirement unresolved
Severity: Critical if broader contract controls; Low if current "No CMS" build map controls
Evidence: `guide/admin-build-execution-plan.md:9` excludes CMS; `guide/admin-implementation-plan.md:101` requires CMS for agreed pages. No `/admin/pages` or `pages` schema/API exists.
Why it is a problem: This is an acceptance ambiguity. If the client expects CMS, Phase 1 fails.
Exact fix: Get written scope confirmation. If CMS is required, add pages/page revisions schema, admin pages UI, draft/publish/revision restore, SEO fields, and route rendering integration.
Scope violation: Depends on the controlling document.

## High Priority Issues

1. Lint fails
Severity: High
Evidence: `npm run lint` reports 11 errors and 20 warnings, including `components/HomeServices.tsx:6`, `components/SmoothScroll.tsx:17`, admin React hook errors, memoization errors, and script import errors.
Why it is a problem: Failing lint is a release-quality and CI blocker.
Exact fix: Replace `any`, fix React hook/set-state warnings, correct memo dependencies, modernize/remove `scripts/remove-motion2.js`, and convert remaining `<img>` where appropriate.
Scope violation: Yes, QA/release readiness.

2. CSV export is not formula-injection safe
Severity: High
Evidence: `lib/admin/csv.ts` escapes quotes/commas but does not prefix values beginning with `=`, `+`, `-`, `@`, tab, or carriage return.
Why it is a problem: A malicious lead can create a CSV formula payload that executes when opened in Excel/Sheets.
Exact fix: In `escapeCsvField`, prefix dangerous leading characters with `'` before quoting.
Scope violation: Yes, security/export hardening.

3. Public inquiry endpoint has no public rate limiting/spam controls
Severity: High
Evidence: `/api/inquiries` validates shape only; rate limiting exists only for admin login.
Why it is a problem: Contact/chatbot endpoints can be spammed, causing DB noise, email abuse if notifications are added, and admin overload.
Exact fix: Add IP/user-agent rate limit, honeypot or Turnstile/reCAPTCHA, payload throttling, and audit/spam status handling.
Scope violation: Yes, security and lead quality.

4. Download count update is non-atomic
Severity: High
Evidence: `lib/brochures/service.ts` reads `download_count`, then writes `download_count + 1`.
Why it is a problem: Concurrent downloads can overwrite each other and undercount.
Exact fix: Use a Postgres RPC/function or single SQL update `download_count = download_count + 1`, then insert event transactionally or tolerate event failure separately.
Scope violation: Yes, analytics/download accuracy.

5. Security headers are admin-only and incomplete
Severity: High
Evidence: `next.config.ts:13` applies headers only to `/admin/:path*`; no Content-Security-Policy found.
Why it is a problem: Public pages and forms lack baseline hardening; no CSP means XSS blast radius is larger.
Exact fix: Add site-wide `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, HSTS in production, and a CSP tuned for Next/Supabase/assets.
Scope violation: Yes, security readiness.

6. Brochure/admin DB workflows are not covered by tests
Severity: High
Evidence: Only FAQ tests exist. No tests for uploads, replace, invalid file, download increment, leads, auth, or admin permissions.
Why it is a problem: The highest-risk Phase 1 workflows are unverified.
Exact fix: Add API/service tests with mocked Supabase or integration tests against a test Supabase project.
Scope violation: Yes, QA acceptance.

## Medium Priority Issues

1. `/downloads` and `/brochures` duplicate resource concepts
Severity: Medium
Evidence: `/brochures` loads DB brochures; `/downloads` uses static `lib/data/downloads.ts`.
Why it is a problem: Users and SEO can see stale or inconsistent resources.
Exact fix: Consolidate to one Resource Center route or redirect `/downloads` to `/brochures`; update sitemap/navigation.
Scope violation: Partial.

2. Certifications/legal pages are thin
Severity: Medium
Evidence: `app/certifications/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/cookies/page.tsx` contain minimal placeholder-like copy.
Why it is a problem: Client acceptance and SEO/content quality will be weak; legal copy may be insufficient.
Exact fix: Replace with approved legal/compliance content, certificate evidence/cards, and metadata descriptions.
Scope violation: Partial.

3. SEO metadata is incomplete
Severity: Medium
Evidence: no `metadataBase`, `openGraph`, `twitter`, `alternates.canonical`, or structured data references found; sitemap is static under `public/sitemap.xml`.
Why it is a problem: Search previews, canonicalization, and rich-result eligibility are incomplete.
Exact fix: Add site-wide metadataBase, per-page canonical/Open Graph/Twitter metadata, `app/sitemap.ts`, BreadcrumbList schema, Organization schema, and FAQPage schema when public FAQ exists.
Scope violation: Yes, SEO readiness.

4. Analytics lacks bot filtering and deduplication
Severity: Medium
Evidence: `AnalyticsTracker` sends one page view per browser session path; server stores raw path without user-agent/IP filtering.
Why it is a problem: Dashboard accuracy can be distorted by bots, refreshes, and test traffic.
Exact fix: Store hashed IP/user-agent, add bot baseline filter, dedupe window, date range controls, and timezone alignment.
Scope violation: Partial.

5. Email notifications are not implemented
Severity: Medium
Evidence: No mail provider usage found for inquiries; only Supabase password reset email.
Why it is a problem: Lead response depends on admin login instead of active notification.
Exact fix: Add client-owned SMTP/Resend configuration and non-blocking notification on successful lead create.
Scope violation: Yes if email notification is required by contract; optional in build tracker.

6. Admin lead model lacks company, subject, source, notes, and richer statuses
Severity: Medium
Evidence: `InquiryRow` only has name/email/phone/message/status/created_at.
Why it is a problem: Client cannot triage leads by source, subject, or company; no notes/status workflow beyond new/read/archived.
Exact fix: Expand model and UI to match lead checklist.
Scope violation: Yes.

## Low Priority Improvements

1. Footer social links are dead links
Severity: Low
Evidence: `components/Footer.tsx:57-59` uses `href="#"`.
Fix: Remove until real links are provided or add verified social URLs.
Scope violation: Yes, broken links.

2. Some images use raw `<img>` and large assets
Severity: Low to Medium
Evidence: lint warnings across public pages; public assets include several 4-8 MB images.
Fix: Convert key images to `next/image`, resize/compress large assets, add dimensions/lazy loading.
Scope violation: Performance readiness.

3. Static sitemap omits `/careers`
Severity: Low once careers exists; currently tied to Critical missing page.
Fix: Generate sitemap dynamically from route data.
Scope violation: SEO readiness.

4. Chatbot is hardcoded instead of admin FAQ-driven
Severity: Low to Medium
Evidence: `app/api/faqs/chatbot/route.ts` exists but `components/RuleBasedChatbot.tsx` does not fetch it.
Fix: Either document approved hardcoded chatbot content or load admin-approved FAQs by category with safe fallbacks.
Scope violation: Partial, because FAQ admin was intended to be chatbot knowledge source.

## Security Findings

- Strong points: Supabase auth guards protect admin routes; Admin-only user management and destructive FAQ/brochure deletes are guarded; login origin validation and login rate limiting exist; service role client is server-only.
- Gaps: no CSP; no site-wide security headers; no public form rate limiting; no CSV formula protection; no malware/virus scanning hook for PDF uploads; no CSRF-style origin check on public inquiry writes; no retention policy for lead data; no verified HTTPS/HSTS deployment setting.

## Performance Findings

- Build passes only when Google Fonts are reachable. This is a deploy/build fragility; consider local font files or committed font fallback if CI cannot access Google.
- Multiple large images in `public/` exceed several MB and many components use raw `<img>`, increasing LCP and bandwidth risk.
- `next/font/google` requires network at build time; use `next/font/local` for predictable builds.

## SEO Findings

- Basic title/description exists for most primary pages.
- Missing: Careers page, product detail pages, canonical URLs, Open Graph/Twitter metadata, structured data, dynamic sitemap, and richer legal/certification page content.
- `/products/:slug` redirect prevents search-friendly product URLs.
- `/downloads` and `/brochures` can split resource authority unless one is canonicalized/redirected.

## Chatbot Audit

Implemented:
- Available globally through `app/layout.tsx`.
- Four requested primary categories are present.
- Options answer directly and preserve conversation history.
- Redirect actions are limited to product/industry/resource/contact CTAs.
- Talk to Human form has name, company, email, phone, message.
- No OpenAI/Gemini/Claude/LangChain/RAG/vector/document-training implementation found.

Gaps:
- Talk to Human posts to `/api/inquiries`; company is embedded in message text, not stored structurally.
- No subject/source field.
- Admin FAQ API is not used by the widget.
- Mobile visual verification was not completed in-browser during this audit.

## Admin Panel Audit

Implemented:
- `/admin/login`, protected layout, dashboard, brochures, FAQs, leads, analytics, users, audit pages.
- User management is Admin-only.
- Audit log page is Admin-only.
- Brochure upload/replace/edit/reorder/delete/restore code exists.
- FAQ CRUD/status/reorder code exists.
- Leads list/detail/status/export code exists.

Gaps:
- No CMS pages module if required.
- No test evidence for live Admin vs Editor permission boundaries.
- Export audit logging is absent.
- Lead notes, richer statuses, pagination beyond hard limit, company/subject/source fields absent.
- Delete brochure permanently removes files; recovery exists for versions before delete but not after delete.

## Final Launch Readiness Assessment

Decision: Do not launch for final client acceptance yet.

Minimum release blockers to fix before UAT:
1. Add `/careers`.
2. Add product/service detail pages and remove `/products/:slug` redirect.
3. Resolve CMS scope conflict in writing.
4. Normalize contact/chatbot leads into one schema with company/subject/source.
5. Add public form spam/rate limiting.
6. Fix CSV formula injection.
7. Fix lint errors.
8. Add CSP/site-wide security headers.
9. Add integration tests or documented manual UAT for brochures, downloads, leads, auth/RBAC, and analytics.
10. Complete responsive/browser QA on desktop/tablet/mobile.

