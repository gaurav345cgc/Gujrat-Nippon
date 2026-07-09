# GNIPL Phase 1 — QA Testing Handoff

**For:** Testing / QA engineer  
**Client:** Gujarat Nippon International Pvt Ltd  
**Contract:** [`MS&AGREEMENT.md`](./MS&AGREEMENT.md) — Section 3.1 (Phase 1 scope), Section 10 (acceptance criteria), Section 2 (Defect definition)  
**Project:** Corporate website + admin panel (`Gujrat-Nippon` repo)  
**Last updated:** July 2026

---

## 1. What you are testing

Phase 1 deliverables per the agreement:

| Area | Contract reference |
|------|------------------|
| 11 public website pages | MS §3.1 — Website Pages |
| Brochures & downloads | MS §3.1 — Brochures & Downloads |
| Contact & lead management | MS §3.1 — Contact & Lead Management |
| Rule-based chatbot (basic) | MS §3.1 — Chatbot |
| Admin panel (roles, CMS, modules) | MS §3.1 — Admin Panel |
| SEO, performance, security baseline | MS §3.1 — SEO, Performance & Security |

**Explicitly OUT of scope (Phase 2 — do not fail Phase 1 for these):**

- AI / document-trained chatbot  
- CRM / ERP integrations  
- Advanced analytics dashboards  
- Multi-language  
- Marketing automation  
- Payment gateways  
- Third-party system integrations  

---

## 2. Defect vs change request

Per MS §2, a **Defect** is a reproducible failure of Phase 1 deliverables per §3.1, **not** caused by:

- Client hosting / third-party outage  
- Client-provided content or assets  
- Changes made by client or others after delivery  

**Not a defect (change request):** new pages, new features, design overhauls, integrations listed in Phase 2.

**Report defects with:** steps to reproduce, expected vs actual, browser/device, URL, screenshot or recording, severity (Critical / High / Medium / Low).

---

## 3. Acceptance criteria (MS §10)

A milestone passes when:

1. Pages load on **Chrome, Firefox, Safari, Edge** (latest 2 versions)  
2. **Forms, downloads, chatbot** work per scope  
3. **Admin** accessible with working credentials  
4. **Phase 1 scope** delivered as documented  

Also test **mobile-responsive** layout (agreement §3.1).

---

## 4. Environment setup

### 4.1 Prerequisites

- Node.js 20+  
- Git access to this repository  
- Supabase project with migrations applied (see §5)  
- `.env.local` configured (see §6)

### 4.2 Run locally

```bash
npm install
npm run db:seed          # admin + editor users (needs env vars)
npm run db:setup:storage # brochure + thumbnail buckets
npm run db:seed:brochures  # optional — sample PDFs
npm run db:seed:faqs       # optional — FAQ seed
npm run db:seed:cms        # optional — CMS page rows
npm run dev
```

- **Public site:** `http://localhost:3000`  
- **Admin login:** `http://localhost:3000/admin/login`  
- **Admin dashboard:** `http://localhost:3000/admin` (redirects to login if not authenticated)

### 4.3 Production / staging

Use the URL and credentials provided by the project lead. Confirm `NEXT_PUBLIC_SITE_URL` and Supabase redirect URLs match the environment.

### 4.4 Automated checks (run before manual QA)

```bash
npm run lint      # record pass/fail
npm run test      # FAQ + CMS unit tests
npm run build     # must pass for release
```

---

## 5. Database migrations (run in order)

Apply in Supabase SQL Editor (or use team migration process):

| File | Purpose |
|------|---------|
| `001_profiles_and_audit.sql` | Users, roles, audit log |
| `002_login_attempts.sql` | Login rate limiting |
| `003_brochures.sql` | Brochures + PDF bucket |
| `004_brochure_thumbnails_bucket.sql` | Thumbnail bucket |
| `005_faqs.sql` | FAQs |
| `006_faqs_drop_slug_and_public.sql` | FAQ cleanup |
| `007_analytics.sql` | Page views, inquiries |
| `008_cms_pages.sql` | CMS pages |
| `008_chatbot_leads_and_faq_updates.sql` | Chatbot FAQ fields |
| `009_inquiries_lead_fields.sql` | Lead fields on inquiries |
| `010_atomic_brochure_download_count.sql` | Download counter |

Full setup notes: [`admin-auth-setup.md`](./admin-auth-setup.md)

---

## 6. Test accounts & env vars

Obtain from project lead (do not commit secrets):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs / sitemap |
| `ALLOWED_ORIGINS` | Admin POST CSRF (e.g. `http://localhost:3000`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin role test user |
| `EDITOR_EMAIL` / `EDITOR_PASSWORD` | Editor role test user |
| `RESEND_API_KEY` (optional) | Lead email notifications |

**Roles to test:**

| Role | Should access | Should NOT access |
|------|---------------|-------------------|
| **ADMIN** | All admin modules including Users, Audit | — |
| **EDITOR** | Dashboard, Pages, Brochures, FAQs, Leads, Analytics | `/admin/users`, `/admin/audit` |

---

## 7. Test matrix — public website

### 7.1 Pages (must exist, load, responsive)

| # | Route | Contract page | Pass criteria |
|---|-------|---------------|---------------|
| 1 | `/` | Home | Loads; hero/sections visible; no console errors |
| 2 | `/about` | About Us | Company overview content; mobile OK |
| 3 | `/products` | Products / Services listing | Product cards visible |
| 4 | `/products/[slug]` | Product detail | **Verify:** detail page or redirect — see §9 |
| 5 | `/industries` | Industries listing | Cards + links to detail |
| 6 | `/industries/[slug]` | Industry detail | Each industry slug loads |
| 7 | `/certifications` | Certifications / Quality | Content + compliance info |
| 8 | `/careers` | Careers | Page + basic form if present |
| 9 | `/contact` | Contact Us | Form with required fields |
| 10 | `/privacy` | Privacy Policy | Legal content |
| 11 | `/terms` | Terms & Conditions | Legal content |
| 12 | `/cookies` | Cookie Policy | Legal content |
| 13 | `/brochures` | Brochures / downloads | Cards from DB |
| 14 | `/downloads` | Downloads page | **Verify:** static vs DB — see §9 |

**Cross-cutting per page:**

- [ ] Title tag present (View Source / DevTools)  
- [ ] Meta description present where applicable  
- [ ] Navbar + footer links work  
- [ ] No horizontal scroll on mobile (375px, 768px, 1280px)  
- [ ] Images load (no broken assets)  

### 7.2 CMS public behaviour (10 contractual pages)

CMS pages: home, about, products, industries, certifications, careers, contact, privacy, terms, cookies.

| Test | Steps | Expected |
|------|-------|----------|
| Unpublished fallback | Visit page before any CMS publish | Shows built-in fallback layout (not blank) |
| Publish flow | Admin → Pages → edit → Save draft → Preview → Publish | Live URL shows CMS content without hard refresh (new incognito tab) |
| SEO after publish | View page source after publish | Title/description match CMS SEO fields |
| Draft not public | Save draft only, do not publish | Public URL still shows fallback |

Operator steps: [`cms-operator-guide.md`](./cms-operator-guide.md)

### 7.3 Contact form

| # | Test | Expected |
|---|------|----------|
| 1 | Submit with all required fields | Success message; row in admin Leads |
| 2 | Submit empty required fields | Validation errors; no DB row |
| 3 | Invalid email | Rejected |
| 4 | Company + Subject fields | Stored and visible in admin lead detail |
| 5 | Email notification (if Resend configured) | Email received at configured address |

### 7.4 Brochures & downloads

| # | Test | Expected |
|---|------|----------|
| 1 | `/brochures` lists published brochures | Title, description, size, date shown |
| 2 | Download / open PDF | File downloads or opens; correct MIME |
| 3 | Download count | Increments in admin (may need refresh) |
| 4 | Unpublished brochure | Not visible on public site |
| 5 | `/download/[slug]` direct URL | Works for valid slug; 404 for invalid |

### 7.5 Chatbot (rule-based only)

| # | Test | Expected |
|---|------|----------|
| 1 | Widget visible on public pages | Opens/closes |
| 2 | FAQ categories | Products, brochures, contact, hours (or as configured) |
| 3 | Predefined answers | Match admin FAQ content (if FAQ-driven) |
| 4 | “Talk to a Human” | Lead capture form; submission appears in admin Leads |
| 5 | No AI behaviour | No open-ended LLM answers (out of scope) |

### 7.6 SEO & technical

| # | Test | Expected |
|---|------|----------|
| 1 | `/robots.txt` | Returns valid robots file |
| 2 | `/sitemap.xml` | Lists public URLs; includes key pages |
| 3 | HTTPS (production) | Valid certificate |
| 4 | Admin security headers | Check `/admin` response headers (X-Frame-Options, etc.) |

SEO copy rules: [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md)

---

## 8. Test matrix — admin panel

### 8.1 Authentication

| # | Test | Expected |
|---|------|----------|
| 1 | Login with valid ADMIN | Redirect to `/admin` dashboard with sidebar |
| 2 | Login with valid EDITOR | Same except no Users/Audit nav |
| 3 | Wrong password | Error; no session |
| 4 | Inactive user | Blocked |
| 5 | Logout / session revoke | Cannot access protected routes |
| 6 | Forgot password flow | Email + reset (if configured in Supabase) |
| 7 | Direct URL `/admin/users` as EDITOR | Redirect or forbidden |

### 8.2 CMS — Pages (`/admin/pages`)

| # | Test | Expected |
|---|------|----------|
| 1 | List all 10 pages | All contractual slugs present |
| 2 | Edit hero + text | Save draft succeeds |
| 3 | Preview draft | `/admin/pages/[slug]/preview` shows draft only |
| 4 | Publish | Live site updates (incognito test) |
| 5 | Revision history | Restore previous revision works |
| 6 | Restore defaults | Resets to fallback copy |
| 7 | Validation | Cannot publish empty required fields |

### 8.3 Brochures (`/admin/brochures`)

| # | Test | Expected |
|---|------|----------|
| 1 | Upload PDF | Appears in list |
| 2 | Replace file | New version; public download uses new file |
| 3 | Thumbnail upload / URL | Card image on `/brochures` |
| 4 | Publish / draft status | Draft hidden on public site |
| 5 | Reorder | Order reflected on public page |
| 6 | Delete / archive | Removed from public |

### 8.4 FAQs (`/admin/faqs`)

| # | Test | Expected |
|---|------|----------|
| 1 | Create / edit / delete FAQ | CRUD works |
| 2 | Publish / unpublish | Affects chatbot or public FAQ API |
| 3 | Reorder | Order respected in chatbot |

### 8.5 Leads (`/admin/leads`)

| # | Test | Expected |
|---|------|----------|
| 1 | List shows contact + chatbot submissions | Name, email, company, subject, message |
| 2 | Status update | e.g. new → contacted |
| 3 | CSV export | Downloads; opens in Excel without formula injection issues |
| 4 | Filter / search (if present) | Works |

### 8.6 Analytics (`/admin/analytics`)

| # | Test | Expected |
|---|------|----------|
| 1 | Page views | Increments after visiting public pages |
| 2 | Download counts | Reflect brochure downloads |
| 3 | Inquiry counts | Match lead submissions |

### 8.7 Users & audit (ADMIN only)

| # | Test | Expected |
|---|------|----------|
| 1 | Create editor user | Can log in with EDITOR role |
| 2 | Deactivate user | Cannot log in |
| 3 | Audit log | Login, publish, brochure actions logged |

---

## 9. Known items to verify (may be defects)

Use this list during testing. Mark **Pass / Fail / N/A** and log defects.

| Item | What to check | Notes |
|------|---------------|-------|
| Product detail pages | `/products/some-slug` — real page vs redirect | `next.config.ts` may redirect to `/products`; placeholder page may exist |
| `/downloads` vs `/brochures` | Two download experiences | Agreement mentions downloads page; confirm which is canonical |
| Chatbot FAQ source | Answers match admin FAQs | Older audit noted hardcoded chatbot — verify current build |
| `leads` vs `inquiries` table | Single source of truth in admin | App uses `inquiries`; migration may also define `leads` |
| Logo / favicon | `/logo.svg` loads | Missing asset = broken branding |
| Cookie consent banner | Visible on first visit | Component may exist but not mounted |
| Lint / build | `npm run lint` and `npm run build` | Record results in test report |
| CMS publish without hard refresh | Incognito after publish | Core acceptance for CMS |
| CSV export safety | Lead with name `=cmd` | Should not execute formulas in Excel |

Prior audit (May 2026): [`phase-1-compliance-audit-report.md`](./phase-1-compliance-audit-report.md) — **re-verify**; codebase may have changed since then.

---

## 10. Browsers & devices

| Environment | Versions |
|-------------|----------|
| Desktop Chrome | Latest + previous |
| Desktop Firefox | Latest |
| Desktop Safari | Latest (macOS) |
| Desktop Edge | Latest |
| Mobile Safari | iOS current |
| Mobile Chrome | Android current |

Viewport widths: **375**, **768**, **1280**, **1920**.

---

## 11. Defect report template

Copy per issue:

```
ID: GNIPL-###
Title: [short summary]
Severity: Critical | High | Medium | Low
Contract area: [e.g. MS §3.1 Contact & Lead Management]
URL: 
Browser / device: 
Steps to reproduce:
1.
2.
3.
Expected (per agreement / scope doc):
Actual:
Screenshot / video:
Reproducible: Yes / No / Intermittent
```

**Severity guide:**

- **Critical:** Blocker — page 404, cannot login, data loss, security hole, payment of milestone blocked  
- **High:** Major feature broken; workaround difficult  
- **Medium:** Feature partial; workaround exists  
- **Low:** Cosmetic, copy, minor UX  

---

## 12. Reference documents

| Document | Use for |
|----------|---------|
| [`MS&AGREEMENT.md`](./MS&AGREEMENT.md) | **Legal scope & acceptance** |
| [`admin-implementation-plan.md`](./admin-implementation-plan.md) | Admin feature spec |
| [`cms-operator-guide.md`](./cms-operator-guide.md) | CMS test steps |
| [`cms-build-execution-plan.md`](./cms-build-execution-plan.md) | CMS delivery checklist |
| [`gnipl-seo-content-rules.md`](./gnipl-seo-content-rules.md) | SEO expectations |
| [`gnipl-content-guide.md`](./gnipl-content-guide.md) | Content tone (informational) |
| [`admin-auth-setup.md`](./admin-auth-setup.md) | Env + migration setup |
| [`phase-1-compliance-audit-report.md`](./phase-1-compliance-audit-report.md) | Prior gap analysis |

---

## 13. Suggested test execution order

1. Environment setup + migrations + seed users  
2. `npm run build` + `npm run test` + `npm run lint`  
3. Public pages smoke (all routes, mobile)  
4. Contact form + chatbot → verify leads in admin  
5. Brochure download + count  
6. Admin auth (ADMIN + EDITOR roles)  
7. CMS: draft → preview → publish → public verify  
8. Brochures / FAQs / analytics / users / audit modules  
9. SEO (`robots.txt`, `sitemap.xml`, meta tags)  
10. Regression on browsers from §10  
11. File defect report using §11  

---

## 14. Sign-off template

| Area | Tester | Date | Pass / Fail | Notes |
|------|--------|------|-------------|-------|
| Public pages | | | | |
| CMS publish | | | | |
| Contact & leads | | | | |
| Brochures & downloads | | | | |
| Chatbot | | | | |
| Admin auth & roles | | | | |
| Admin modules | | | | |
| SEO & technical | | | | |
| Cross-browser | | | | |
| **Overall Phase 1** | | | | |

**Tester name / signature:** _______________  
**Date:** _______________

---

*Questions on scope: refer to MS&AGREEMENT Section 3.1. Questions on setup: project lead / dev team.*
