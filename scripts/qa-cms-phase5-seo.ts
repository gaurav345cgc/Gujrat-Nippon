/**
 * Phase 5 SEO audit — fallback copy, canonicals, sitemap/robots/preview infrastructure.
 * Run: npm run qa:cms:phase5
 */
import { config } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';
import { PAGE_SLUGS, PAGE_REGISTRY } from '../lib/cms/constants';
import { getFallbackSeo } from '../lib/cms/payloads';
import { getPublishedPagesForSitemap } from '../lib/cms/public';
import {
  APPROVED_CONTRACTUAL_SEO,
  SEO_META_MAX_LEN,
  SEO_META_MIN_LEN,
  SEO_TITLE_MAX_LEN,
} from '../lib/cms/seo-baseline';
import { pathToAbsoluteUrl } from '../lib/cms/site-url';
import type { PageSlug } from '../lib/cms/types';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

type Check = { name: string; ok: boolean; detail: string };

const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
  console.log('CMS Phase 5 — SEO audit\n');

  record('app/sitemap.ts exists', existsSync(resolve(process.cwd(), 'app/sitemap.ts')), 'dynamic sitemap');
  record(
    'Stale public/sitemap.xml removed',
    !existsSync(resolve(process.cwd(), 'public/sitemap.xml')),
    'no static conflict'
  );

  const robotsSource = readFileSync(resolve(process.cwd(), 'app/robots.ts'), 'utf8');
  record('robots.ts blocks /admin/', /disallow:\s*['"]\/admin\//.test(robotsSource), 'admin disallowed');

  const previewSource = readFileSync(
    resolve(process.cwd(), 'app/admin/(protected)/pages/[slug]/preview/page.tsx'),
    'utf8'
  );
  record(
    'Preview route noindex',
    /index:\s*false/.test(previewSource) && /follow:\s*false/.test(previewSource),
    'robots metadata on preview'
  );

  const metadataSource = readFileSync(resolve(process.cwd(), 'lib/cms/metadata.ts'), 'utf8');
  record(
    'Canonical URLs derived from page paths',
    metadataSource.includes('pathToAbsoluteUrl') && metadataSource.includes('resolveSeoMetadata'),
    'lib/cms/metadata.ts'
  );

  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const slug of PAGE_SLUGS) {
    const seo = getFallbackSeo(slug);
    const titleUnique = !titles.has(seo.seoTitle);
    titles.add(seo.seoTitle);
    record(`${slug}: unique title`, titleUnique, seo.seoTitle);

    const descUnique = !descriptions.has(seo.metaDescription);
    descriptions.add(seo.metaDescription);
    record(`${slug}: unique meta description`, descUnique, `${seo.metaDescription.length} chars`);

    record(
      `${slug}: title length ≤ ${SEO_TITLE_MAX_LEN}`,
      seo.seoTitle.length <= SEO_TITLE_MAX_LEN,
      `${seo.seoTitle.length} chars`
    );
    record(
      `${slug}: meta length ${SEO_META_MIN_LEN}-${SEO_META_MAX_LEN}`,
      seo.metaDescription.length >= SEO_META_MIN_LEN && seo.metaDescription.length <= SEO_META_MAX_LEN,
      `${seo.metaDescription.length} chars`
    );

    const approved = APPROVED_CONTRACTUAL_SEO[slug as PageSlug];
    if (approved) {
      record(
        `${slug}: matches approved SEO rules doc`,
        seo.seoTitle === approved.seoTitle && seo.metaDescription === approved.metaDescription,
        'gnipl-seo-content-rules.md'
      );
    }

    const expectedCanonical = pathToAbsoluteUrl(PAGE_REGISTRY[slug].path);
    record(`${slug}: canonical path mapping`, expectedCanonical.endsWith(slug === 'home' ? '/' : PAGE_REGISTRY[slug].path) || slug === 'home', expectedCanonical);
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from('pages').select('slug, status').limit(1);
    record('Supabase pages table reachable', !error, error?.message ?? 'OK');

    const sitemapPages = await getPublishedPagesForSitemap();
    record(
      'Sitemap reads published indexable pages',
      Array.isArray(sitemapPages),
      `${sitemapPages.length} published path(s)`
    );

    for (const entry of sitemapPages) {
      record(`Sitemap path registered: ${entry.path}`, Boolean(PAGE_REGISTRY[Object.entries(PAGE_REGISTRY).find(([, reg]) => reg.path === entry.path)?.[0] as PageSlug]), entry.path);
    }
  } catch (error) {
    record('Supabase sitemap query', false, error instanceof Error ? error.message : 'Unknown error');
  }

  const failed = checks.filter((check) => !check.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
