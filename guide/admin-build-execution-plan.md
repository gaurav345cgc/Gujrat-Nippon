# GNIPL Admin Panel — Build Map

**Status:** Active development tracker (brochures, FAQs, leads, analytics, users, audit) · **CMS Pages module live** — see [`cms-operator-guide.md`](./cms-operator-guide.md)  
**Use:** Hand this to Cursor and check boxes as work completes.  
**Contract reference:** [`admin-implementation-plan.md`](./admin-implementation-plan.md) (full agreement).  
**CMS reference:** [`cms-build-execution-plan.md`](./cms-build-execution-plan.md) · [`cms-operator-guide.md`](./cms-operator-guide.md)

> **Scope:** Auth, brochures, FAQs, leads, basic analytics, audit/security, QA, handover.  
> **CMS page editing:** Built separately — `/admin/pages` (10 contractual routes). Tracked in [`cms-build-execution-plan.md`](./cms-build-execution-plan.md).  
> **Still excluded:** AI chatbot, CRM/ERP, advanced analytics, multilingual, marketing automation, payments, third-party integrations.

**Recommended build order:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

---

## Repo baseline (before Phase 0)

| Area | Today | Action in this build |
|------|--------|----------------------|
| `/admin` shell | Exists; Pages, Brochures, FAQs, Leads, Analytics | Wire real modules |
| Auth | Supabase session | Phase 1 |
| Brochures | S3 + DB | Phase 2 |
| Contact / chatbot | Forms persisted | Phase 4 |
| FAQs | Admin + public API | Phase 3 |
| Page copy | **CMS** — `/admin/pages` | [`cms-operator-guide.md`](./cms-operator-guide.md) |

---

## Technical reference (frozen)

| Layer | Choice |
|-------|--------|
| DB | PostgreSQL + Prisma |
| Auth | Auth.js v5, Credentials, bcrypt/Argon2id |
| Files | S3 or Cloudflare R2 (client-owned) |
| Email | Client-owned SMTP or Resend (password reset, optional lead alerts) |

**Entities this build:** `User`, `Session`, `Brochure`, `BrochureVersion`, `Faq`, `Lead`, `LeadNote`, `AnalyticsEvent`, `AuditLog`

**Admin routes (target):** `/admin/login` · `/admin` (dashboard) · `/admin/brochures` · `/admin/faqs` · `/admin/leads` · `/admin/analytics` · `/admin/users` (Admin only) · `/admin/audit` (Admin only)

**Public APIs:** `POST /api/leads` · `GET /api/faqs` (chatbot) · `POST /api/analytics/track` · `GET /download/[slug]`

---

## Phase 0 — Scope lock

This admin build includes secure login with role-based access, brochure management, FAQ management, lead viewing/export, and basic analytics for page views, downloads, and inquiries.

It explicitly excludes CMS-style page editing for now, plus AI chatbot, CRM/ERP integrations, advanced analytics dashboards, multilingual support, marketing automation, payments, and third-party system integrations.

### Checklist

- [ ] Freeze the admin scope before coding
- [ ] Confirm only two roles: Admin and Editor
- [ ] Confirm no CMS page editor is being built
- [ ] Confirm brochure, FAQ, leads, analytics, audit, and handover requirements
- [ ] Confirm client-owned accounts wherever technically feasible
- [ ] Confirm final admin routes and naming
- [ ] Confirm change-request boundary for future CMS work

### Exit criteria

- [ ] Scope is locked
- [ ] No out-of-scope features are mixed into the plan
- [ ] Cursor can build against a stable, narrow admin spec

---

## Phase 1 — Auth and RBAC

The agreement requires secure login with role-based access for Admin and Editor, and the handover must provide working admin/editor credentials.

This phase is the foundation for every other module because every route and write action depends on permissions.

### Build tickets

- [x] Login page
- [x] Session creation and logout
- [x] Password reset flow
- [x] Session expiry and revoke-all sessions
- [x] Admin-only user management
- [x] Route guards and permission middleware

### Checklist

- [x] Hash passwords securely (Supabase Auth)
- [x] Add login rate limiting (`login_attempts` + `/admin/api/auth/login`)
- [x] Add brute-force protection (lockout after failed attempts)
- [x] Add secure cookies and HTTPS-only session behavior (Supabase SSR + prod secure cookies)
- [x] Add CSRF protection if using cookie-based auth (SameSite cookies + origin check on login API)
- [x] Seed or bootstrap the first Admin user
- [x] Restrict user management to Admin only
- [x] Hide unauthorized UI elements for Editors
- [x] Enforce authorization on the backend, not just the UI
- [x] Log login success, login failure, password reset, role change, and deactivation

### Exit criteria

- [x] Admin and Editor can log in
- [x] Unauthorized access is blocked at API level
- [x] User management is safe and auditable

---

## Phase 2 — Brochure management

The contract requires brochure upload, replacement, secure file hosting, metadata display, and download count tracking.

This module should behave like a small content library with versioning rather than a one-off file upload screen.

### Build tickets

- [x] Brochure list
- [x] Create brochure record
- [x] Upload file
- [x] Replace file
- [x] Edit title, description, and publish state
- [x] Archive/unpublish brochure
- [x] Track download counts
- [x] Keep file version history

### Checklist

- [x] Validate file type and size
- [x] Use generated storage keys, not raw filenames
- [x] Save original filename separately
- [x] Preserve brochure identity when a file is replaced
- [x] Keep old versions for rollback
- [x] Increment download count only after successful delivery
- [x] Prevent broken links on replace
- [x] Add audit logs for upload, replace, archive, and delete
- [x] Add empty and error states
- [ ] Test invalid uploads, oversized files, repeated downloads, and replaced-file behavior
- [ ] Migrate existing PDFs from `public/brochures/` to object storage (`npm run db:seed:brochures`)
- [ ] Remove duplicate root `brochures/` folder after migration

### Exit criteria

- [x] Brochures can be managed safely by Admin and Editor
- [x] Replacement does not break existing brochure entries
- [x] Download tracking works reliably

---

## Phase 3 — FAQ management

The chatbot is rule-based and uses predefined FAQ responses only, so the FAQ admin must stay structured and simple.

The goal is to let the team manage chatbot answers without developer help.

### Build tickets

- [x] FAQ list (API: `GET /admin/api/faqs`)
- [x] Add FAQ (`POST /admin/api/faqs`)
- [x] Edit FAQ (`PATCH /admin/api/faqs/:id`)
- [x] Disable FAQ (`PATCH /admin/api/faqs/:id/status`, soft delete)
- [x] Reorder FAQ (`POST /admin/api/faqs/reorder`)
- [x] Categorize FAQ entries (category field + validation)
- [ ] Preview chatbot-facing content (admin UI — later)

### Checklist (backend)

- [x] Validate duplicate / near-duplicate questions
- [x] Support categories: general, products, brochures, contact, working_hours, human_handoff, trust
- [x] Length limits on Q&A
- [x] Active/inactive + use_in_chatbot + use_in_public_faq flags
- [x] Sort order via reorder API
- [x] Audit: create, update, delete, reorder, status change
- [x] Service: `listFaqsForChatbot()` (active + use_in_chatbot only)
- [x] Soft delete + `faq_revisions` history
- [x] Seed script + unit tests (`npm run test:faqs`)
- [ ] Admin UI for FAQs (separate task)
- [ ] No public `/api/faqs` or chatbot widget until explicitly requested

### Exit criteria (backend)

- [x] FAQs manageable via admin API with auth/RBAC
- [x] Chatbot-ready query interface in `@/lib/faqs`
- [x] All mutations audited
- [ ] End-to-end API test against live Supabase (optional)

---

## Phase 4 — Lead management

The contract requires database storage of inquiries, email notifications, and CSV export of leads.

This module should become the operational inbox for the client team.

### Build tickets

- [ ] Lead list
- [ ] Lead detail view
- [ ] Search and filters
- [ ] Status updates
- [ ] Internal notes
- [ ] CSV export
- [ ] Export audit log

### Checklist

- [ ] Capture all agreed lead sources (contact form, chatbot handoff)
- [ ] Normalize lead fields into one schema
- [ ] Add pagination
- [ ] Add filters for date, source, and status
- [ ] Add search by name, email, or phone
- [ ] Add internal notes with author attribution
- [ ] Add statuses: new, contacted, closed, spam, archived
- [ ] Generate CSV on the server
- [ ] Escape CSV cells to avoid formula injection
- [ ] Log who exported what and when
- [ ] Wire `/contact` form and chatbot handoff to `POST /api/leads`
- [ ] Optional: email notification on new lead (client-owned email account)
- [ ] Test empty exports, unicode, commas, quotes, and large datasets

### Exit criteria

- [ ] Leads are visible and manageable
- [ ] CSV export works cleanly
- [ ] Access is restricted to authenticated users only

---

## Phase 5 — Basic analytics

The agreement only allows basic analytics: page views, downloads, and inquiries.

Do not turn this into a BI tool — advanced analytics is explicitly excluded.

### Build tickets

- [ ] Event capture for page views
- [ ] Event capture for brochure downloads
- [ ] Event capture for inquiries
- [ ] Summary dashboard
- [ ] Date range filters
- [ ] Top pages and top brochures cards or tables
- [ ] Inquiry trend view

### Checklist

- [ ] Define event schema (`page_view`, `brochure_download`, `inquiry_created`)
- [ ] Decide raw events vs rollups
- [ ] Add date range filtering
- [ ] Add bot-filtering baseline if practical
- [ ] Make analytics failure non-blocking on public site
- [ ] Deduplicate obvious duplicate events
- [ ] Show proper empty states
- [ ] Keep analytics clearly labeled as basic reporting
- [ ] Do not add funnels, cohorts, attribution, or advanced dashboards
- [ ] Count brochure downloads server-side on `/download/[slug]` (authoritative)

### Exit criteria

- [ ] Basic metrics display correctly
- [ ] Event tracking is stable
- [ ] Scope stays within contract

---

## Phase 6 — Audit and security

The agreement requires secure admin access, standard security headers, and privacy readiness. Client-generated data belongs exclusively to the client.

This phase turns the admin into a production-grade system rather than a functional prototype.

### Build tickets

- [ ] Audit log table
- [ ] Audit middleware / write hooks
- [ ] Security headers
- [ ] Input validation
- [ ] Upload hardening
- [ ] Error handling
- [ ] Rate limiting
- [ ] Session hardening
- [ ] Backup and restore readiness

### Checklist

- [ ] Log all important writes
- [ ] Log auth events
- [ ] Log exports
- [ ] Log user management changes
- [ ] Log brochure actions
- [ ] Log FAQ changes
- [ ] Apply security headers to admin routes
- [ ] Keep secrets out of logs
- [ ] Validate every admin input on the server
- [ ] Restrict file uploads tightly
- [ ] Add DB indexes for admin-heavy queries
- [ ] Document backup and restore steps
- [ ] Test privilege boundaries carefully
- [ ] Remove bootstrap/debug routes from production

### Exit criteria

- [ ] Admin actions are auditable
- [ ] Security baseline is solid
- [ ] Backup and recovery are understood

---

## Phase 7 — QA and acceptance

A milestone is accepted when admin access is provided with working credentials and the agreed scope is delivered as documented.

This phase proves the admin is ready for real use.

### Test buckets

- [ ] Auth and RBAC
- [ ] Brochure CRUD and downloads
- [ ] FAQ CRUD and chatbot compatibility
- [ ] Lead viewing/export
- [ ] Basic analytics
- [ ] Audit logging
- [ ] Security and negative cases

### Checklist

- [ ] Test unauthenticated access to all admin routes
- [ ] Test Editor access boundaries
- [ ] Test Admin-only routes
- [ ] Test password reset and session revoke
- [ ] Test brochure upload/replace/download tracking
- [ ] Test FAQ create/edit/disable/reorder
- [ ] Test lead filters, detail view, and CSV export
- [ ] Test analytics with no data and seeded data
- [ ] Test audit logs for all important actions
- [ ] Test invalid inputs and production error states
- [ ] Test latest browser behavior where practical (Chrome, Firefox, Safari, Edge — latest two versions)
- [ ] Fix all release-blocking issues

### Exit criteria

- [ ] No critical or major defects remain
- [ ] Admin can be demonstrated from a clean account
- [ ] The client can use the admin without developer help

---

## Phase 8 — Handover and independence

Handover must include admin credentials, documentation, source code, database export, and third-party component details. The client should not depend on the service provider for routine admin tasks after handover.

### Handover checklist

- [ ] Create final Admin and Editor credentials
- [ ] Deliver admin login instructions
- [ ] Deliver admin guide: brochures, FAQs, leads, analytics, users, **and CMS pages** ([`cms-operator-guide.md`](./cms-operator-guide.md))
- [ ] Deliver source code or repo access
- [ ] Deliver database export and schema notes
- [ ] Deliver third-party component and license list
- [ ] Deliver brochure storage map and restore steps
- [ ] Confirm client ownership of relevant accounts wherever feasible
- [ ] Confirm temporary provider access is limited to warranty/support needs
- [ ] Confirm client data ownership and export readiness
- [ ] Confirm no hidden dependencies remain
- [x] CMS page editing — live at `/admin/pages` ([`cms-build-execution-plan.md`](./cms-build-execution-plan.md))

### Exit criteria

- [ ] Client can operate the admin independently
- [ ] Handover artifacts are complete
- [ ] Warranty support can proceed without blocking normal use

---

## Permission matrix (reference)

| Capability | Admin | Editor |
|------------|:-----:|:------:|
| Dashboard | ✓ | ✓ |
| Brochures | ✓ | ✓ |
| FAQs | ✓ | ✓ |
| View leads | ✓ | ✓ |
| Export leads CSV | ✓ | ✓ |
| Analytics | ✓ | ✓ |
| Manage users | ✓ | ✗ |
| System settings | ✓ | ✗ |
| Audit logs | ✓ | optional read-only |

---

## Definition of done

The admin panel is **done** only when the client can:

1. Securely log in as Admin or Editor
2. Manage brochures and FAQs without a developer
3. Review and export leads
4. See basic analytics (page views, downloads, inquiries)
5. Receive full documentation and credentials for independent routine use
6. Edit and publish contractual page copy via CMS ([`cms-operator-guide.md`](./cms-operator-guide.md))

**CMS page editing** is delivered as part of the overall admin platform — operator docs in [`cms-operator-guide.md`](./cms-operator-guide.md).

---

## Document map

| File | Purpose |
|------|---------|
| **`admin-build-execution-plan.md`** (this file) | Phase map + checklists for current build |
| `admin-implementation-plan.md` | Full contract scope |
| `cms-operator-guide.md` | CMS edit / publish / restore for content editors |
| `cms-cache-handover.md` | Cache and revalidation behavior |
| `website-administration-guide.md` | *Create at Phase 8* |
| `technical-setup.md` | *Create at Phase 8* |

---

*Last updated: May 2026 — track progress by checking boxes above.*
