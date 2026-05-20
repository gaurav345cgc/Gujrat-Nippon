# Admin Panel Implementation Plan

Prepared for production delivery of the website admin system defined in the Master Service & Project Agreement. This phase map is limited to the admin portion of Phase 1 and is structured so an engineering agent can execute it directly in Cursor.[file:1]

## 1. Scope Lock

The admin implementation must stay strictly inside the contracted admin scope: secure login with role-based access for Admin and Editor, CMS-style content management for website pages, brochure and FAQ management, lead viewing and export, and basic analytics covering page views, downloads, and inquiries.[file:1]

The implementation must also satisfy acceptance and handover obligations: working admin credentials at delivery, complete administrative access, user-management instructions, independence from the service provider for routine updates, and inclusion of documentation, database export, and component disclosure in the final handover package.[file:1]

### In-scope modules

- Authentication and authorization.[file:1]
- Admin user and role management for Admin and Editor only.[file:1]
- CMS for agreed website pages only.[file:1]
- Brochure library management with replace flow and download tracking.[file:1]
- FAQ management for the rule-based chatbot knowledge source.[file:1]
- Lead inbox with list, filters, detail view, and CSV export.[file:1]
- Basic analytics dashboard for page views, brochure downloads, and inquiries only.[file:1]
- Auditability, security hardening, backup/export, and handover readiness needed for production use and contractual delivery.[file:1]

### Explicitly out of scope

- AI chatbot, document-trained chatbot, automations, CRM or ERP integrations, advanced analytics, marketing automation, payments, multilingual features, and any third-party business integrations unless separately approved as a change request.[file:1]

### Non-negotiable delivery constraints

- Client-owned accounts must be used wherever technically feasible for hosting, email, analytics, domain, SSL, chatbot, and CDN services.[file:1]
- Full admin-level access, keys, and ownership documentation must be handed over at or before go-live.[file:1]
- Post-go-live support beyond warranty is not implied; therefore the admin must be operable without developer dependence for routine tasks.[file:1]

## 2. Delivery Principles

Build the admin as a stable internal product, not as a quick CRUD screen. Every module should be designed around four production goals: controlled permissions, safe content publishing, recoverability, and clean operator experience.[file:1]

### Engineering rules

- Prefer boring and maintainable architecture over clever abstractions.
- Keep every admin action idempotent where possible.
- Every destructive action must support confirmation, attribution, and recovery.
- All user-visible validations must also exist server-side.
- No secret, key, or privileged operation should depend on frontend trust.
- Admin features should degrade safely; a failed analytics card must not block brochure uploads or lead exports.
- Use feature boundaries so each module can be tested and signed off independently.

### Suggested production baseline

- Server-rendered or SPA admin is acceptable, but use a single protected admin application under `/admin`.
- All admin APIs should live behind authenticated routes and a permission middleware.
- All writes should be versioned or logged.
- All uploads should be stored with deterministic metadata, checksum, MIME validation, and replace history.
- All exports should be generated on the server and streamed or downloaded securely.

## 3. Target Capabilities

### 3.1 Authentication and access control

#### Functional target

- Secure login screen.
- Role-based access with exactly two roles: `admin` and `editor`.[file:1]
- Session management with secure cookies or equivalent hardened auth flow.
- Password reset flow for admin users.
- Logout from current session.
- Optional forced logout from all sessions for compromised accounts.

#### Permission matrix

| Capability | Admin | Editor |
|---|---|---|
| View dashboard | Yes | Yes |
| Edit page content | Yes | Yes |
| Publish page content | Yes | Yes, if no approval workflow is introduced |
| Manage brochures | Yes | Yes |
| Replace brochure files | Yes | Yes |
| Manage FAQs | Yes | Yes |
| View leads | Yes | Yes |
| Export leads CSV | Yes | Yes |
| View analytics | Yes | Yes |
| Manage users | Yes | No |
| Change system settings | Yes | No |
| Access audit logs | Yes | Read-only optional |

#### Security checklist

- [ ] Passwords hashed with Argon2id or bcrypt with strong cost factor.
- [ ] Login rate limiting per IP and per email.
- [ ] Brute-force lockout or progressive backoff.
- [ ] CSRF protection for cookie-based sessions.
- [ ] Secure, HttpOnly, SameSite cookies.
- [ ] Session expiry and idle timeout.
- [ ] Rotation of session identifier after login.
- [ ] Server-side authorization on every protected route.
- [ ] Structured security logs for failed logins and role changes.
- [ ] First-admin bootstrap flow disabled after initial setup.

### 3.2 CMS for website pages

#### Functional target

The admin must allow CMS-style editing for all agreed Phase 1 pages: Home, About Us, Products/Services, Industries Served/Applications, Certifications/Quality/Compliance, Careers, Contact Us, Privacy Policy, Terms & Conditions, and Cookie Policy.[file:1]

#### Content model checklist

- [ ] Page entity with slug, title, SEO title, meta description, canonical URL field if needed, status, updatedAt, updatedBy.
- [ ] Section-based content blocks, not one giant HTML blob.
- [ ] Rich text support with sanitized output.
- [ ] Media picker for page images/files if media exists in current site scope.
- [ ] Draft and published state.
- [ ] Preview capability before publish.
- [ ] Revision history for each page update.
- [ ] Restore previous revision.
- [ ] Validation rules per page type.
- [ ] Slug protection for contractual pages unless admin intentionally changes it.

#### Publishing checklist

- [ ] Save draft.
- [ ] Publish now.
- [ ] Unpublish only where safe and not for mandatory legal pages unless explicitly allowed.
- [ ] Track who changed what and when.
- [ ] Prevent accidental blank publish through minimum required fields.

### 3.3 Brochure management

#### Functional target

The downloads area must support brochure cards with title, description, file size, and last updated date, plus secure file hosting, download count tracking, and admin functions to upload, replace, and manage brochures.[file:1]

#### Brochure module checklist

- [ ] Brochure entity with title, short description, category if needed, storage key, original filename, size, MIME type, checksum, version, lastUpdated, published flag.
- [ ] Upload brochure file.
- [ ] Replace brochure file while preserving brochure identity and download history.
- [ ] Edit brochure metadata.
- [ ] Archive/unpublish brochure.
- [ ] Sort/reorder brochure cards if the frontend needs ordering.
- [ ] Track total downloads per brochure.
- [ ] Track last download timestamp optionally for admin insight.
- [ ] Keep old file record for rollback and audit.

#### Upload hardening checklist

- [ ] Allowlist MIME types and extensions, likely PDF only unless otherwise approved.
- [ ] Enforce max file size.
- [ ] Virus or malware scan hook if infrastructure supports it.
- [ ] Rename or store with generated keys instead of trusting client filename.
- [ ] Prevent direct public directory traversal and unsafe file serving.
- [ ] Return correct content-disposition and content-type headers on download.
- [ ] Avoid broken links during replace by using stable brochure identifiers.

### 3.4 FAQ management

#### Functional target

FAQ entries must be manageable from admin because the chatbot is rule-based and uses predefined responses for products/services, brochure downloads, contact details, and working hours, with a talk-to-human capture path.[file:1]

#### FAQ checklist

- [ ] FAQ entity with question, answer, category, sort order, active flag.
- [ ] Add, edit, disable, reorder FAQ items.
- [ ] Validation for duplicate or near-duplicate question slugs.
- [ ] Character limits to keep chatbot responses concise.
- [ ] Version/audit trail for FAQ edits.
- [ ] Test mode or preview payload for chatbot consumption.

### 3.5 Lead management

#### Functional target

The admin must support viewing stored inquiries and exporting leads as CSV from contact forms and related human-handoff captures.[file:1]

#### Lead module checklist

- [ ] Lead entity with source, name, email, phone, company, message, page/source context, consent flags if collected, createdAt, status, notes.
- [ ] List view with pagination.
- [ ] Filters for date range, source, status, and search by name/email/phone.
- [ ] Detail drawer or page.
- [ ] CSV export matching selected filters.
- [ ] Safe encoding and escaping in CSV to prevent formula injection.
- [ ] Mark as new, contacted, closed, spam, archived.
- [ ] Internal notes field with editor attribution.
- [ ] Export audit log with who exported and when.

#### Privacy checklist

- [ ] Store only required lead fields.
- [ ] Mask sensitive fields in logs.
- [ ] Apply retention strategy or at least mark for future purge policy.
- [ ] Restrict lead access to authenticated admin users only.
- [ ] Include ownership/export readiness because lead data belongs exclusively to the client.[file:1]

### 3.6 Basic analytics

#### Functional target

The admin analytics must remain basic and limited to page views, downloads, and inquiries, consistent with the agreement; advanced analytics dashboards are explicitly excluded.[file:1]

#### Analytics checklist

- [ ] Dashboard cards for total page views, brochure downloads, total inquiries.
- [ ] Date range selector.
- [ ] Top pages by views.
- [ ] Top brochures by downloads.
- [ ] Inquiry trend by day or week.
- [ ] Empty-state handling when analytics starts from zero.
- [ ] Timezone handling aligned with client preference.
- [ ] Clear label that analytics is basic operational reporting, not a BI suite.

#### Data collection checklist

- [ ] Track frontend page view event with bot filtering baseline.
- [ ] Track brochure download event at server edge or API layer, not only client side.
- [ ] Track inquiry submission success event.
- [ ] Deduplicate obvious duplicate events where feasible.
- [ ] Avoid blocking main user flow on analytics write failure.

## 4. Phase Map

## Phase 0 — Contract-to-build alignment

Goal: freeze the admin implementation against the agreement so no out-of-scope work leaks in.[file:1]

### Deliverables

- Scope checklist signed internally.
- Admin feature inventory.
- Role matrix.
- Page inventory.
- Data entity inventory.
- Definition of done for each module.

### Checklist

- [ ] Convert agreement scope into engineering tickets.
- [ ] Mark excluded items as non-buildable without change request.
- [ ] List every admin-managed page and content section.
- [ ] Confirm brochure lifecycle requirements.
- [ ] Confirm FAQ usage by chatbot.
- [ ] Confirm lead fields captured by all forms.
- [ ] Confirm analytics metrics are only the basic three buckets.
- [ ] Define acceptance evidence required for M3 and M4, including working credentials.[file:1]

## Phase 1 — Architecture and data design

Goal: define stable module boundaries, schema, permissions, and infrastructure assumptions before UI coding begins.

### Technical outputs

- Route map for `/admin`.
- Database schema.
- Permission middleware spec.
- File storage contract.
- Audit log model.
- Export format spec.

### Checklist

- [ ] Define entities: User, Session, AuditLog, Page, PageRevision, Brochure, BrochureVersion, FAQ, Lead, AnalyticsEvent.
- [ ] Define relations and indexes.
- [ ] Add soft-delete or archive strategy where appropriate.
- [ ] Decide revision strategy for pages and FAQs.
- [ ] Decide whether brochure replace creates a version row or immutable file reference chain.
- [ ] Define analytics aggregation approach: raw events plus materialized summaries, or direct rollups.
- [ ] Define storage abstraction so brochure hosting can sit on local disk, object storage, or existing hosting infra.[file:1]
- [ ] Define environment variables and secret handling.
- [ ] Define backup/export strategy for DB and uploads aligned with handover duties.[file:1]

## Phase 2 — Auth and RBAC foundation

Goal: make the admin secure before any business module is exposed.

### Build order

1. Auth schema and user seed flow.
2. Login/logout/password reset.
3. Session middleware.
4. Role middleware.
5. Protected layout and navigation.
6. User management for Admin only.

### Checklist

- [ ] Create user table with role enum `admin|editor`.
- [ ] Implement invite or bootstrap for first admin.
- [ ] Implement login form with generic error messaging.
- [ ] Add rate limit and lockout protections.
- [ ] Add password reset token flow.
- [ ] Build session inspection endpoint.
- [ ] Add role guards to every module route.
- [ ] Build Admin-only user management screen.
- [ ] Allow create, deactivate, reset password, and role change for users.
- [ ] Log every user-management change in audit log.
- [ ] Add integration tests for unauthorized access attempts.

## Phase 3 — CMS pages module

Goal: allow non-technical admins to manage agreed website pages safely and reversibly.[file:1]

### Build order

1. Page list.
2. Page editor.
3. Draft/publish.
4. Revision history.
5. Preview.
6. SEO fields.

### Checklist

- [ ] Create page schema with status and SEO fields.
- [ ] Seed required page records for all contractual pages.[file:1]
- [ ] Build page list with status, last editor, updated date.
- [ ] Build modular section editor.
- [ ] Sanitize rich text on save and render.
- [ ] Add required-field validation per page type.
- [ ] Add preview URL or preview mode.
- [ ] Save revision snapshot on every publish.
- [ ] Add restore previous revision.
- [ ] Add unsaved-changes warning.
- [ ] Add slug and page deletion safeguards for legal and mandatory pages.
- [ ] Test browser compatibility on latest two versions of major browsers as acceptance requires.[file:1]

## Phase 4 — Brochure management module

Goal: make brochure operations safe, traceable, and operationally simple.[file:1]

### Build order

1. Brochure list.
2. Upload flow.
3. Replace flow.
4. Publish/archive.
5. Download tracking.
6. File delivery hardening.

### Checklist

- [ ] Create brochure and brochure version schema.
- [ ] Build upload UI with progress and validation.
- [ ] Auto-calculate file size and checksum.
- [ ] Persist original filename separately from storage key.
- [ ] Build replace workflow preserving brochure public identity.
- [ ] Update `lastUpdated` automatically on replacement.[file:1]
- [ ] Keep previous versions for rollback/admin audit.
- [ ] Build archive/unpublish action.
- [ ] Implement secure download endpoint.
- [ ] Increment download count on successful delivery.[file:1]
- [ ] Prevent double-counting obvious refresh spam where feasible.
- [ ] Add tests for invalid type, oversized file, broken replace, and deleted asset references.

## Phase 5 — FAQ module

Goal: give admins a reliable source of truth for chatbot answers within the rule-based scope.[file:1]

### Checklist

- [ ] Build FAQ list, create, edit, reorder, deactivate.
- [ ] Add category support for products/services, brochure help, contact, working hours, human handoff.[file:1]
- [ ] Add validation for blank, duplicate, or excessively long content.
- [ ] Expose a clean read endpoint or service layer for chatbot consumption.
- [ ] Add audit trail and update timestamps.
- [ ] Add preview/test response utility for internal QA.

## Phase 6 — Lead management module

Goal: make inquiries operationally usable and exportable for the client team.[file:1]

### Build order

1. Lead schema and ingestion mapping.
2. Lead list and filters.
3. Lead detail.
4. Statusing and notes.
5. CSV export.
6. Export logging.

### Checklist

- [ ] Map all lead sources: contact form, careers form if stored similarly, chatbot talk-to-human capture where applicable.[file:1]
- [ ] Normalize fields into one lead table or one view over multiple sources.
- [ ] Build list with pagination and search.
- [ ] Build filters by source, date, and status.
- [ ] Build detail view.
- [ ] Add notes/status updates.
- [ ] Build CSV export for current filter set.[file:1]
- [ ] Escape CSV cells to prevent spreadsheet formula execution.
- [ ] Add export size guardrails for very large datasets.
- [ ] Log user, timestamp, and filter params for every export.
- [ ] Add QA cases for empty export, unicode text, commas, quotes, and long messages.

## Phase 7 — Basic analytics module

Goal: surface only the operational analytics promised in the agreement and nothing more.[file:1]

### Checklist

- [ ] Define events: `page_view`, `brochure_download`, `inquiry_created`.
- [ ] Decide event ingestion path.
- [ ] Add bot filtering or at least basic user-agent filtering for page views.
- [ ] Build aggregate queries for dashboard cards.
- [ ] Build top pages and top brochures widgets.
- [ ] Build inquiry trend chart or simple table.
- [ ] Add date filters with sane defaults.
- [ ] Ensure analytics failure does not break end-user pages.
- [ ] Reconcile analytics data with GA4 where useful, while keeping client ownership of analytics accounts.[file:1]

## Phase 8 — Security hardening and operational readiness

Goal: convert a working admin into a production-grade admin.

### Hardening checklist

- [ ] Apply security headers consistently on admin routes where applicable.[file:1]
- [ ] Enforce HTTPS in production.[file:1]
- [ ] Validate and sanitize all inputs.
- [ ] Add centralized error handling with safe messages.
- [ ] Add structured logs with request correlation IDs.
- [ ] Add audit log viewer for critical admin actions.
- [ ] Add database indexes for admin-heavy queries.
- [ ] Add pagination limits to prevent expensive queries.
- [ ] Add upload size limits at reverse proxy and app layer.
- [ ] Add backup routine for database and uploaded brochure assets.
- [ ] Add restore drill for at least one database backup and one brochure file rollback.
- [ ] Remove dead code, debug routes, seed endpoints, and verbose production logs.
- [ ] Review all secrets and rotate any temporary project credentials before handover.[file:1]

## Phase 9 — QA, UAT, and acceptance

Goal: prove the admin satisfies contractual delivery and is safe for go-live.[file:1]

### Test matrix

- Functional testing.
- Permission testing.
- Negative-path testing.
- Cross-browser testing.
- Mobile responsiveness for any admin views that may reasonably be used on mobile, though desktop-first admin UX is acceptable.[file:1]
- Performance sanity testing.
- Handover rehearsal.

### Checklist

- [ ] Test every route as unauthenticated user.
- [ ] Test every route as editor.
- [ ] Test every route as admin.
- [ ] Test login failures, resets, expired sessions, and forced logout.
- [ ] Test draft/publish/revision restore for pages.
- [ ] Test brochure upload/replace/archive/download count behavior.
- [ ] Test FAQ CRUD and chatbot data consumption.
- [ ] Test lead search/filter/export with edge-case data.
- [ ] Test analytics counts with seeded events.
- [ ] Test latest two versions of Chrome, Firefox, Safari, and Edge for acceptance criteria.[file:1]
- [ ] Produce a defect log classified by critical, major, minor severity matching warranty language.[file:1]
- [ ] Fix all release-blocking defects.

## Phase 10 — Handover and independence package

Goal: complete the admin in a way that satisfies the agreement’s ownership and independence clauses.[file:1]

### Handover checklist

- [ ] Create final admin credentials for client Admin and Editor roles.[file:1]
- [ ] Transfer or confirm ownership of hosting, email, analytics, domain, SSL, chatbot, and CDN accounts under client ownership wherever feasible.[file:1]
- [ ] Provide admin-level access, API keys, and ownership docs.[file:1]
- [ ] Export production database and schema documentation.[file:1]
- [ ] Deliver source code repo or full editable codebase.[file:1]
- [ ] Deliver brochure storage structure notes and restore steps.
- [ ] Deliver technical setup documentation.[file:1]
- [ ] Deliver website administration guide covering content updates, brochure uploads, FAQ management, lead export, and user management.[file:1]
- [ ] Deliver third-party component list with license and ownership status.[file:1]
- [ ] Remove service-provider-only dependencies for routine admin use.[file:1]
- [ ] Document any warranty-period temporary accesses retained by the service provider.[file:1]

## 5. Recommended data model

This model keeps the admin implementation simple while still production-grade.

### Core tables

- `users`: id, name, email, password_hash, role, status, last_login_at, created_at, updated_at.
- `sessions`: id, user_id, ip, user_agent, created_at, expires_at, revoked_at.
- `pages`: id, slug, title, template, seo_title, meta_description, status, published_at, updated_by, updated_at.
- `page_revisions`: id, page_id, revision_no, snapshot_json, created_by, created_at.
- `brochures`: id, slug, title, description, current_version_id, published, sort_order, created_by, updated_by, updated_at.
- `brochure_versions`: id, brochure_id, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256, version_no, created_by, created_at.
- `faqs`: id, question, answer, category, sort_order, is_active, updated_by, updated_at.
- `leads`: id, source, name, email, phone, company, subject, message, context_json, status, assigned_to, notes_count, created_at, updated_at.
- `lead_notes`: id, lead_id, note, created_by, created_at.
- `analytics_events`: id, event_type, subject_type, subject_id, page_slug, referrer, user_agent_hash, ip_hash, occurred_at.
- `audit_logs`: id, actor_user_id, action, entity_type, entity_id, metadata_json, ip, created_at.

### Index checklist

- [ ] Unique index on users.email.
- [ ] Unique index on pages.slug.
- [ ] Unique index on brochures.slug.
- [ ] Composite indexes for leads `(source, created_at)` and `(status, created_at)`.
- [ ] Composite indexes for analytics `(event_type, occurred_at)` and `(page_slug, occurred_at)`.
- [ ] Index on audit logs `(entity_type, entity_id, created_at)`.

## 6. API surface

### Auth

- `POST /admin/api/auth/login`
- `POST /admin/api/auth/logout`
- `POST /admin/api/auth/forgot-password`
- `POST /admin/api/auth/reset-password`
- `GET /admin/api/me`

### Users

- `GET /admin/api/users`
- `POST /admin/api/users`
- `PATCH /admin/api/users/:id`
- `POST /admin/api/users/:id/reset-password`

### Pages

- `GET /admin/api/pages`
- `GET /admin/api/pages/:id`
- `POST /admin/api/pages/:id/draft`
- `POST /admin/api/pages/:id/publish`
- `GET /admin/api/pages/:id/revisions`
- `POST /admin/api/pages/:id/revisions/:revisionId/restore`

### Brochures

- `GET /admin/api/brochures`
- `POST /admin/api/brochures`
- `PATCH /admin/api/brochures/:id`
- `POST /admin/api/brochures/:id/replace-file`
- `POST /admin/api/brochures/:id/archive`
- `GET /download/:slug`

### FAQs

- `GET /admin/api/faqs`
- `POST /admin/api/faqs`
- `PATCH /admin/api/faqs/:id`
- `POST /admin/api/faqs/reorder`

### Leads

- `GET /admin/api/leads`
- `GET /admin/api/leads/:id`
- `PATCH /admin/api/leads/:id`
- `GET /admin/api/leads/export.csv`

### Analytics

- `GET /admin/api/analytics/summary`
- `GET /admin/api/analytics/top-pages`
- `GET /admin/api/analytics/top-brochures`
- `GET /admin/api/analytics/inquiries-trend`

### Audit

- `GET /admin/api/audit-logs`

## 7. UI map

### Primary screens

- Login
- Dashboard
- Pages
- Page Editor
- Brochures
- Brochure Editor
- FAQs
- Leads
- Analytics
- Users (Admin only)
- Audit Log (Admin only or read-only to Admin)
- Profile / Password change

### UI checklist

- [ ] Consistent sidebar navigation.
- [ ] Clear role-aware menu visibility.
- [ ] Success/error toast pattern.
- [ ] Inline form validation.
- [ ] Empty states for first-time setup.
- [ ] Loading and skeleton states.
- [ ] Confirm dialogs for destructive actions.
- [ ] Accessible labels, keyboard navigation, and focus states.

## 8. Production readiness gate

A module is not “done” when the screen works once. It is done only when it passes this gate.

### Gate checklist

- [ ] All routes protected correctly.
- [ ] Happy path tested.
- [ ] Failure path tested.
- [ ] Permission path tested.
- [ ] Audit logging added for critical writes.
- [ ] Validation and sanitization complete.
- [ ] Performance acceptable on realistic data volume.
- [ ] Docs updated.
- [ ] Seed/demo/test artifacts removed from production.

## 9. Cursor execution order

Use this exact execution order in Cursor to avoid rework.

1. Scaffold admin shell, auth, session handling, and RBAC.
2. Create core schema and migrations.
3. Build user management.
4. Build pages CMS with revisions and SEO fields.
5. Build brochure module with secure file storage and replace versioning.
6. Build FAQ module.
7. Build lead module with CSV export hardening.
8. Build analytics event ingestion and dashboard.
9. Add audit logs across all write flows.
10. Add tests, security hardening, backups, and deployment config.
11. Run UAT checklist.
12. Prepare handover artifacts and final docs.[file:1]

## 10. Definition of done

The admin part is complete only when all agreed admin features are live, secure, documented, client-accessible, and independently operable by the client after handover, with working credentials and complete administrative access provided as required by the agreement.[file:1]
