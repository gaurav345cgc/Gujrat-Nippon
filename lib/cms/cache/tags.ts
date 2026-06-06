/** Fine-grained Next.js cache tags for CMS published content. */
export const CMS_CACHE_TAGS = {
  page: (slug: string) => `page:${slug}`,
  seo: (slug: string) => `seo:${slug}`,
  pagesList: 'pages:list',
  layoutFooter: 'layout:footer',
  layoutNav: 'layout:nav',
  sitemap: 'sitemap',
} as const;
