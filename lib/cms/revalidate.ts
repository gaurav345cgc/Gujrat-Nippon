import { revalidatePath, revalidateTag } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { SLUG_TO_PATH } from '@/lib/cms/constants';
import { invalidatePagesModule } from '@/lib/cms/cache/invalidate';
import { CMS_CACHE_TAGS } from '@/lib/cms/cache/tags';
import type { PageSlug } from '@/lib/cms/types';

export type PublishRevalidationResult = {
  paths: string[];
  tags: string[];
  status: 'success' | 'partial' | 'failed';
  error?: string;
};

export async function publishRevalidation(
  slug: PageSlug,
  pageId: string,
  actorId: string
): Promise<PublishRevalidationResult> {
  const path = SLUG_TO_PATH[slug];
  const tags = [CMS_CACHE_TAGS.page(slug), CMS_CACHE_TAGS.seo(slug), CMS_CACHE_TAGS.sitemap];
  if (slug === 'contact') {
    tags.push(CMS_CACHE_TAGS.layoutFooter);
  }

  const paths = [path, '/sitemap.xml'];
  let status: PublishRevalidationResult['status'] = 'success';
  let errorMessage: string | null = null;

  try {
    revalidatePath(path, 'page');
    revalidatePath('/sitemap.xml');
    for (const tag of tags) {
      revalidateTag(tag, 'max');
    }
    invalidatePagesModule(slug);
  } catch (e) {
    status = 'partial';
    errorMessage = e instanceof Error ? e.message : 'Revalidation failed';
  }

  const admin = createAdminClient();
  await admin.from('publish_logs').insert({
    page_id: pageId,
    published_by: actorId,
    paths_revalidated: paths,
    tags_revalidated: tags,
    status,
    error_message: errorMessage,
  });

  return {
    paths,
    tags,
    status,
    error: errorMessage ?? undefined,
  };
}
