# Admin Auth Setup (Supabase)

Auth uses **Supabase only** — no NextAuth. Sessions are refreshed in `middleware.ts` via `@supabase/ssr`.

## 1. Supabase project

1. Create or use your Supabase project.
2. In **SQL Editor**, run both migrations (in order):
   - [`supabase/migrations/001_profiles_and_audit.sql`](../supabase/migrations/001_profiles_and_audit.sql)
   - [`supabase/migrations/002_login_attempts.sql`](../supabase/migrations/002_login_attempts.sql)
   - [`supabase/migrations/003_brochures.sql`](../supabase/migrations/003_brochures.sql) (brochures + storage bucket)
   - [`supabase/migrations/004_brochure_thumbnails_bucket.sql`](../supabase/migrations/004_brochure_thumbnails_bucket.sql) (public image bucket)
   - [`supabase/migrations/005_faqs.sql`](../supabase/migrations/005_faqs.sql) (FAQ backend — admin/chatbot source of truth)
3. In **Authentication → URL configuration**, add:
   - Site URL: `http://localhost:3000` (dev)
   - Redirect URLs: `http://localhost:3000/admin/auth/callback`

## 2. Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Where to find it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Settings → API (publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API (service role — **server only**) |

## 3. Seed admin users

```bash
npm run db:seed
```

Uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` (and optional `EDITOR_*`).

## 4. Run

```bash
npm run dev
```

Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## File map

| File | Purpose |
|------|---------|
| `utils/supabase/client.ts` | Browser client |
| `utils/supabase/server.ts` | Server Components / Route Handlers |
| `utils/supabase/middleware.ts` | Session refresh + `/admin` route guard |
| `lib/supabase/admin.ts` | Service role (user management) |
| `lib/auth/guards.ts` | Server session + role checks |

## Password reset

1. `/admin/forgot-password` → server API → Supabase email  
2. Link lands on `/admin/auth/callback` → `/admin/reset-password`  
3. User sets a new password via `supabase.auth.updateUser`

## Security (Phase 1)

- Login via **`POST /admin/api/auth/login`** (rate limited, audited)
- Failed attempts stored in `login_attempts` (5 per email / 15 min, 20 per IP)
- Audit log at **`/admin/audit`** (Admin only)

## Roles

Stored in `public.profiles` (`ADMIN` | `EDITOR`). Middleware and API enforce access.

## Brochures (Phase 2)

1. Run migrations `003_brochures.sql` and `004_brochure_thumbnails_bucket.sql` (tables + RLS), **or** create storage buckets only:

```bash
npm run db:setup:storage
```

(`brochures` for PDFs, `brochure-thumbnails` for uploaded card images)
2. Place PDFs in `public/brochures/` (if migrating from the static site).
3. Import:

```bash
npm run db:seed:brochures
```

4. Manage at `/admin/brochures`. Public downloads use `/download/[slug]` (slug is stable across file replacements).
5. Public listing: `GET /api/brochures` (published only).

## FAQs (Phase 3 — backend only)

1. Run migration `005_faqs.sql`.
2. Optional draft seed: `npm run db:seed:faqs` (records start **inactive**).
3. Admin API (authenticated): `GET/POST /admin/api/faqs`, `GET/PATCH/DELETE /admin/api/faqs/:id`, `PATCH /admin/api/faqs/:id/status`, `POST /admin/api/faqs/reorder`.
4. Chatbot integration later: import `listFaqsForChatbot` from `@/lib/faqs` — **no public FAQ route or UI yet**.
5. Run unit tests: `npm run test:faqs`.
