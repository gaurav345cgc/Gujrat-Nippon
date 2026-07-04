import type { AdminCacheTag } from '@/lib/admin/cache/tags';

const enabled =
  process.env.ADMIN_CACHE_DEBUG === '1' ||
  (process.env.NODE_ENV === 'development' && process.env.ADMIN_CACHE_DEBUG !== '0');

export function logCacheFetch(tag: AdminCacheTag): void {
  if (!enabled) return;
  console.info(`[admin-cache] fetch (cache miss or revalidate) ${tag}`);
}

export function logCacheInvalidate(tags: AdminCacheTag[]): void {
  if (!enabled) return;
  console.info(`[admin-cache] invalidate ${tags.join(', ')}`);
}
