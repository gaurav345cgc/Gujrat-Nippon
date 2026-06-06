/**
 * Seeds contractual CMS pages, sections, and SEO from lib/cms/payloads.ts (site defaults).
 *
 * To refresh defaults from current DB content first: npm run db:export:cms-defaults
 *
 * Prerequisites: supabase/migrations/008_cms_pages.sql applied.
 *
 * Run: npm run db:seed:cms
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';
import { PAGE_REGISTRY, PAGE_SLUGS } from '../lib/cms/constants';
import { getPageEditorDefaults } from '../lib/cms/defaults';
import { GLOBAL_CONTACT } from '../lib/cms/payloads';
import type { PageSlug, SectionType } from '../lib/cms/types';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const actorEmail = (process.env.ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();

async function main() {
  const admin = createAdminClient();

  const { error: pagesCheck } = await admin.from('pages').select('id', { head: true, count: 'exact' });
  if (pagesCheck) {
    throw new Error(
      `CMS pages table missing (${pagesCheck.message}). Run supabase/migrations/008_cms_pages.sql first.`
    );
  }

  const { data: users } = await admin.auth.admin.listUsers();
  const actor = users?.users?.find((u) => u.email?.toLowerCase() === actorEmail);
  const actorId = actor?.id ?? null;

  for (const slug of PAGE_SLUGS) {
    const registry = PAGE_REGISTRY[slug];
    const editorDefaults = getPageEditorDefaults(slug as PageSlug);

    const { data: existing } = await admin.from('pages').select('id').eq('slug', slug).maybeSingle();

    let pageId = existing?.id as string | undefined;

    if (pageId) {
      const { error } = await admin
        .from('pages')
        .update({
          path: registry.path,
          title: registry.title,
          template: registry.template,
          updated_by: actorId,
        })
        .eq('id', pageId);
      if (error) throw error;
      console.log(`Updated page: ${slug}`);
    } else {
      const { data: inserted, error } = await admin
        .from('pages')
        .insert({
          slug,
          path: registry.path,
          title: registry.title,
          template: registry.template,
          status: 'draft',
          created_by: actorId,
          updated_by: actorId,
        })
        .select('id')
        .single();
      if (error) throw error;
      pageId = inserted.id as string;
      console.log(`Created page: ${slug}`);
    }

    for (const section of editorDefaults.sections) {
      const { error } = await admin.from('page_sections').upsert(
        {
          page_id: pageId,
          section_key: section.section_key,
          section_type: section.section_type as SectionType,
          payload_json: section.payload_json,
          sort_order: section.sort_order ?? 0,
          is_active: section.is_active ?? true,
        },
        { onConflict: 'page_id,section_key' }
      );
      if (error) throw error;
    }

    const { error: seoErr } = await admin.from('seo_metadata').upsert(
      {
        page_id: pageId,
        seo_title: editorDefaults.seo.seoTitle,
        meta_description: editorDefaults.seo.metaDescription,
        canonical_url: editorDefaults.seo.canonicalUrl ?? null,
        robots: editorDefaults.seo.robots ?? 'index,follow',
        og_title: editorDefaults.seo.ogTitle ?? editorDefaults.seo.seoTitle,
        og_description: editorDefaults.seo.ogDescription ?? editorDefaults.seo.metaDescription,
      },
      { onConflict: 'page_id' }
    );
    if (seoErr) throw seoErr;
  }

  const { error: contactErr } = await admin.from('site_settings').upsert(
    {
      key: 'global_contact',
      payload_json: GLOBAL_CONTACT,
      updated_by: actorId,
    },
    { onConflict: 'key' }
  );
  if (contactErr) throw contactErr;

  console.log('CMS seed complete (status=draft for all pages).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
