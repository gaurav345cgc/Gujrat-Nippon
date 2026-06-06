/** TTL fallbacks (seconds) when tag invalidation is missed. */
export const CMS_CACHE_TTL = {
  /** Published page payloads — invalidation-driven. */
  page: 3600,
  /** Published SEO — invalidation-driven. */
  seo: 3600,
  /** Global contact block. */
  contact: 3600,
} as const;
