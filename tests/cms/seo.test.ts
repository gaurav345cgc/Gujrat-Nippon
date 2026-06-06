import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PAGE_SLUGS, PAGE_REGISTRY } from '../../lib/cms/constants';
import { resolveSeoMetadata } from '../../lib/cms/metadata';
import { getFallbackSeo } from '../../lib/cms/payloads';
import {
  APPROVED_CONTRACTUAL_SEO,
  SEO_META_MAX_LEN,
  SEO_META_MIN_LEN,
  SEO_TITLE_MAX_LEN,
  isIndexableRobots,
} from '../../lib/cms/seo-baseline';
import { buildSitemapEntries } from '../../lib/cms/sitemap';
import { pathToAbsoluteUrl } from '../../lib/cms/site-url';

describe('CMS SEO baseline', () => {
  it('fallback SEO titles are unique across contractual pages', () => {
    const titles = PAGE_SLUGS.map((slug) => getFallbackSeo(slug).seoTitle);
    assert.equal(new Set(titles).size, titles.length);
  });

  it('fallback meta descriptions are unique across contractual pages', () => {
    const descriptions = PAGE_SLUGS.map((slug) => getFallbackSeo(slug).metaDescription);
    assert.equal(new Set(descriptions).size, descriptions.length);
  });

  it('approved contractual SEO matches payloads fallbacks', () => {
    for (const [slug, approved] of Object.entries(APPROVED_CONTRACTUAL_SEO)) {
      const fallback = getFallbackSeo(slug as (typeof PAGE_SLUGS)[number]);
      assert.equal(fallback.seoTitle, approved.seoTitle, `${slug} seoTitle`);
      assert.equal(fallback.metaDescription, approved.metaDescription, `${slug} metaDescription`);
    }
  });

  it('fallback titles and descriptions meet length rules', () => {
    for (const slug of PAGE_SLUGS) {
      const seo = getFallbackSeo(slug);
      assert.ok(
        seo.seoTitle.length <= SEO_TITLE_MAX_LEN,
        `${slug} title too long (${seo.seoTitle.length} > ${SEO_TITLE_MAX_LEN})`
      );
      assert.ok(
        seo.metaDescription.length >= SEO_META_MIN_LEN,
        `${slug} meta too short (${seo.metaDescription.length})`
      );
      assert.ok(
        seo.metaDescription.length <= SEO_META_MAX_LEN,
        `${slug} meta too long (${seo.metaDescription.length})`
      );
    }
  });

  it('resolveSeoMetadata adds canonical URLs from page paths', () => {
    for (const slug of PAGE_SLUGS) {
      const metadata = resolveSeoMetadata(slug, getFallbackSeo(slug));
      const expected = pathToAbsoluteUrl(PAGE_REGISTRY[slug].path);
      assert.equal(metadata.alternates?.canonical, expected, `${slug} canonical`);
    }
  });

  it('buildSitemapEntries only emits absolute URLs', () => {
    const entries = buildSitemapEntries([
      { path: '/', published_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' },
      { path: '/about', published_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' },
    ]);
    assert.equal(entries.length, 2);
    assert.match(entries[0].url, /^https?:\/\//);
    assert.match(entries[1].url, /\/about$/);
  });

  it('isIndexableRobots excludes noindex values', () => {
    assert.equal(isIndexableRobots('index,follow'), true);
    assert.equal(isIndexableRobots('noindex,follow'), false);
  });
});

describe('CMS SEO infrastructure files', () => {
  it('uses dynamic app/sitemap.ts instead of public/sitemap.xml', () => {
    assert.equal(existsSync(resolve(process.cwd(), 'app/sitemap.ts')), true);
    assert.equal(existsSync(resolve(process.cwd(), 'public/sitemap.xml')), false);
  });

  it('robots.ts disallows /admin/', () => {
    const robotsSource = readFileSync(resolve(process.cwd(), 'app/robots.ts'), 'utf8');
    assert.match(robotsSource, /disallow:\s*['"]\/admin\//);
  });

  it('preview route sets noindex metadata', () => {
    const previewSource = readFileSync(
      resolve(process.cwd(), 'app/admin/(protected)/pages/[slug]/preview/page.tsx'),
      'utf8'
    );
    assert.match(previewSource, /index:\s*false/);
    assert.match(previewSource, /follow:\s*false/);
  });
});
