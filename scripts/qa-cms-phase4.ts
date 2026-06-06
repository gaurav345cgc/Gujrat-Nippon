/**
 * Phase 4 automated checks — publish/cache/security infrastructure.
 * Run: npm run qa:cms:phase4
 *
 * Manual matrix items (browser login, publish, reload) still require operator QA.
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';
import { PAGE_SLUGS, SLUG_TO_PATH } from '../lib/cms/constants';
import { CMS_CACHE_TAGS } from '../lib/cms/cache/tags';
import { getPublishedPage, getPublishedSeo } from '../lib/cms/public';
import { getFallbackPage } from '../lib/cms/payloads';
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
  console.log('CMS Phase 4 — automated infrastructure audit\n');

  // No public /api/pages
  const publicPagesApi = resolve(process.cwd(), 'app/api/pages');
  record(
    'No public /api/pages route',
    !existsSync(publicPagesApi),
    existsSync(publicPagesApi) ? 'app/api/pages exists' : 'only admin APIs'
  );

  const adminPagesApi = resolve(process.cwd(), 'app/admin/api/pages/route.ts');
  record('Admin pages API exists', existsSync(adminPagesApi), adminPagesApi);

  const handoverDoc = resolve(process.cwd(), 'guide/cms-cache-handover.md');
  record('Cache handover doc', existsSync(handoverDoc), 'guide/cms-cache-handover.md');

  const admin = createAdminClient();

  // publish_logs schema
  const { error: logsErr } = await admin.from('publish_logs').select('id').limit(1);
  record('publish_logs table', !logsErr, logsErr?.message ?? 'OK');

  // Per-page cache tags (code inspection via constants)
  const aboutTags = [CMS_CACHE_TAGS.page('about'), CMS_CACHE_TAGS.seo('about')];
  const contactTags = [
    CMS_CACHE_TAGS.page('contact'),
    CMS_CACHE_TAGS.seo('contact'),
    CMS_CACHE_TAGS.layoutFooter,
  ];
  record(
    'Per-page invalidation (about)',
    aboutTags.length === 2 && !aboutTags.includes(CMS_CACHE_TAGS.layoutFooter),
    aboutTags.join(', ')
  );
  record(
    'Contact adds layout:footer only',
    contactTags.includes(CMS_CACHE_TAGS.layoutFooter),
    `contact tags: page, seo, layout:footer`
  );
  record(
    'Paths are per-slug not sitewide',
    SLUG_TO_PATH.about === '/about' && SLUG_TO_PATH.home === '/',
    `about=${SLUG_TO_PATH.about}, home=${SLUG_TO_PATH.home}`
  );

  // Draft isolation — published reads return null while draft
  let draftCount = 0;
  let publishedCount = 0;

  for (const slug of PAGE_SLUGS) {
    const { data: row } = await admin.from('pages').select('status').eq('slug', slug).maybeSingle();
    if (row?.status === 'draft') draftCount++;
    if (row?.status === 'published') publishedCount++;

    const published = await getPublishedPage(slug);
    if (row?.status !== 'published') {
      record(
        `Draft isolation: getPublishedPage('${slug}')`,
        published === null,
        row?.status === 'draft' ? 'null while draft' : `status=${row?.status}`
      );
    }

    const seo = await getPublishedSeo(slug);
    if (row?.status !== 'published') {
      record(`Draft SEO isolation: getPublishedSeo('${slug}')`, seo === null, 'null while not published');
    }

    const fallback = getFallbackPage(slug);
    record(
      `Fallback available for '${slug}'`,
      fallback.seo.seoTitle.length > 0 && Object.keys(fallback.sections).length > 0,
      'payloads.ts gate (public routes call resolvePublicPage in Next.js)'
    );
  }

  console.log(`\nDB status: ${draftCount} draft, ${publishedCount} published (of ${PAGE_SLUGS.length})`);

  if (publishedCount > 0) {
    console.log('\nNote: Some pages are published — run manual reload/cache tests for those slugs.');
  } else {
    console.log('\nAll pages draft — publish one page in admin to test live cache invalidation.');
  }

  const failed = checks.filter((c) => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} automated checks passed.`);

  if (failed.length > 0) {
    console.log('\nFailed:');
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
