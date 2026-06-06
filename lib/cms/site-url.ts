const DEFAULT_SITE_URL = 'https://gujaratnippon.com';

/** Public site origin (no trailing slash). */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

/** Absolute URL for a site path (`/` → origin + `/`). */
export function pathToAbsoluteUrl(path: string, baseUrl = getSiteUrl()): string {
  if (path === '/') return `${baseUrl}/`;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
