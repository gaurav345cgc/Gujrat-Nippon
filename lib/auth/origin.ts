/**
 * CSRF-style origin checks for admin auth API routes.
 * Allows NEXT_PUBLIC_SITE_URL, Vercel deployment URLs, ALLOWED_ORIGINS, and the request host.
 */

function normalizeOrigin(value: string): string | null {
  try {
    const url = value.includes('://') ? new URL(value) : new URL(`https://${value}`);
    return url.origin;
  } catch {
    return null;
  }
}

function addOrigin(set: Set<string>, value: string | undefined | null): void {
  if (!value?.trim()) return;
  const origin = normalizeOrigin(value.trim());
  if (origin) set.add(origin);
}

/** Origins permitted for browser POSTs to admin auth APIs. */
export function getAllowedOrigins(request?: Request): Set<string> {
  const allowed = new Set<string>();

  addOrigin(allowed, process.env.NEXT_PUBLIC_SITE_URL);

  for (const entry of process.env.ALLOWED_ORIGINS?.split(',') ?? []) {
    addOrigin(allowed, entry);
  }

  if (process.env.VERCEL_URL) {
    addOrigin(allowed, process.env.VERCEL_URL);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    addOrigin(allowed, process.env.VERCEL_BRANCH_URL);
  }

  if (request) {
    const fromRequest = getRequestOrigin(request);
    if (fromRequest) allowed.add(fromRequest);
  }

  return allowed;
}

/** Public site base URL (no trailing slash) for redirects and emails. */
export function getSiteUrl(request?: Request): string {
  const fromRequest = request ? getRequestOrigin(request) : null;
  if (fromRequest) return fromRequest;

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured) return configured;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }

  return 'http://localhost:3000';
}

export function getRequestOrigin(request: Request): string | null {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!host) return null;

  const hostname = host.split(',')[0]?.trim();
  if (!hostname) return null;

  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
    (hostname.includes('localhost') ? 'http' : 'https');

  return normalizeOrigin(`${proto}://${hostname}`);
}

/**
 * Returns an error message when the Origin header is present and not allowed.
 * Missing Origin is allowed (non-browser clients).
 */
export function getOriginValidationError(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  const allowed = getAllowedOrigins(request);
  if (allowed.has(origin)) return null;

  return 'Invalid request origin.';
}
