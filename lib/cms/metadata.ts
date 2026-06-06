import type { Metadata } from 'next';
import { PAGE_REGISTRY } from '@/lib/cms/constants';
import { getCachedPublishedSeo } from '@/lib/cms/cache/queries';
import { getFallbackSeo } from '@/lib/cms/payloads';
import { pathToAbsoluteUrl } from '@/lib/cms/site-url';
import type { PageSlug, SeoPayload } from '@/lib/cms/types';

export function seoToMetadata(seo: SeoPayload): Metadata {
  const metadata: Metadata = {
    title: { absolute: seo.seoTitle },
    description: seo.metaDescription,
  };

  if (seo.canonicalUrl) {
    metadata.alternates = { canonical: seo.canonicalUrl };
  }

  if (seo.robots) {
    const [indexPart, followPart] = seo.robots.split(',');
    metadata.robots = {
      index: indexPart?.trim() !== 'noindex',
      follow: followPart?.trim() !== 'nofollow',
    };
  }

  if (seo.ogTitle || seo.ogDescription) {
    metadata.openGraph = {
      title: seo.ogTitle ?? seo.seoTitle,
      description: seo.ogDescription ?? seo.metaDescription,
    };
  }

  return metadata;
}

export function resolveSeoMetadata(slug: PageSlug, seo: SeoPayload): Metadata {
  const canonicalUrl = seo.canonicalUrl ?? pathToAbsoluteUrl(PAGE_REGISTRY[slug].path);
  return seoToMetadata({ ...seo, canonicalUrl });
}

export async function generateCmsMetadata(slug: PageSlug): Promise<Metadata> {
  const published = await getCachedPublishedSeo(slug);
  return resolveSeoMetadata(slug, published ?? getFallbackSeo(slug));
}
