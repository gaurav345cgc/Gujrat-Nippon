/** Fine-grained Next.js cache tags for admin data modules. */
export const ADMIN_CACHE_TAGS = {
  dashboardSummary: 'dashboard:summary',
  brochuresList: 'brochures:list',
  faqsList: 'faqs:list',
  leadsList: 'leads:list',
  analyticsSummary: 'analytics:summary',
  analyticsDaily: 'analytics:daily',
  analyticsTopBrochures: 'analytics:top-brochures',
  usersList: 'users:list',
} as const;

export type AdminCacheTag = (typeof ADMIN_CACHE_TAGS)[keyof typeof ADMIN_CACHE_TAGS];
