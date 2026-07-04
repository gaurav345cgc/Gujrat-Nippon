import { PAGE_SLUGS } from '@/lib/cms/constants';
import type { PageSlug } from '@/lib/cms/types';

export function asPageSlug(slug: string): PageSlug | null {
  return (PAGE_SLUGS as readonly string[]).includes(slug) ? (slug as PageSlug) : null;
}
