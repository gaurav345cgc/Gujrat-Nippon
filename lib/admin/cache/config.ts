/** TTL fallbacks (seconds) when tag invalidation is missed. */
export const ADMIN_CACHE_TTL = {
  /** Live counters — short TTL + invalidation on writes. */
  volatile: 30,
  /** Leads list. */
  leads: 60,
  /** Brochure / FAQ lists. */
  moderate: 120,
  /** User list (changes rarely). */
  users: 300,
} as const;
