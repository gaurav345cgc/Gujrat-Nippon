import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PAGE_SLUGS, PAGE_REGISTRY, TEMPLATE_SECTIONS } from '../../lib/cms/constants';
import { getPageEditorDefaults } from '../../lib/cms/defaults';
import { normalizeEditorPayload } from '../../lib/cms/editor';
import { validatePageDraft } from '../../lib/cms/validate';
import type { PageSnapshot } from '../../lib/cms/types';

describe('normalizeEditorPayload', () => {
  it('fills missing careers sections from defaults', () => {
    const defaults = getPageEditorDefaults('careers');
    const heroDefault = defaults.sections.find((section) => section.section_key === 'hero');

    const snapshot: PageSnapshot = {
      page: {
        id: 'page-id',
        slug: 'careers',
        path: '/careers',
        title: 'Careers',
        template: 'about',
        status: 'draft',
        published_at: null,
        created_by: null,
        updated_by: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      sections: heroDefault
        ? [
            {
              id: 'section-id',
              page_id: 'page-id',
              section_key: 'hero',
              section_type: 'text',
              payload_json: { headline: 'Edited headline', body: 'Edited body' },
              sort_order: 0,
              is_active: true,
              created_at: '2026-01-01T00:00:00.000Z',
              updated_at: '2026-01-01T00:00:00.000Z',
            },
          ]
        : [],
      seo: null,
    };

    const editor = normalizeEditorPayload('careers', snapshot);
    const keys = editor.sections.map((section) => section.section_key);

    assert.deepEqual(keys, TEMPLATE_SECTIONS.careers.map((def) => def.section_key));
    assert.equal(editor.sections.find((section) => section.section_key === 'hero')?.section_type, 'hero');
    assert.equal(
      (editor.sections.find((section) => section.section_key === 'hero')?.payload_json as { headline: string })
        .headline,
      'Edited headline'
    );
    assert.equal(editor.seo.seoTitle, defaults.seo.seoTitle);
  });

  it('matches getPageEditorDefaults when snapshot only has defaults content', () => {
    const defaults = getPageEditorDefaults('careers');
    const snapshot: PageSnapshot = {
      page: {
        id: 'page-id',
        slug: 'careers',
        path: '/careers',
        title: 'Careers',
        template: 'careers',
        status: 'draft',
        published_at: null,
        created_by: null,
        updated_by: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      sections: defaults.sections.map((section, index) => ({
        id: `section-${index}`,
        page_id: 'page-id',
        section_key: section.section_key,
        section_type: section.section_type,
        payload_json: section.payload_json,
        sort_order: section.sort_order ?? index,
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      })),
      seo: {
        id: 'seo-id',
        page_id: 'page-id',
        seo_title: defaults.seo.seoTitle,
        meta_description: defaults.seo.metaDescription,
        canonical_url: defaults.seo.canonicalUrl ?? null,
        robots: defaults.seo.robots ?? 'index,follow',
        og_title: defaults.seo.ogTitle ?? null,
        og_description: defaults.seo.ogDescription ?? null,
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    };

    const editor = normalizeEditorPayload('careers', snapshot);
    assert.equal(editor.sections.length, defaults.sections.length);
    assert.equal(editor.seo.seoTitle, defaults.seo.seoTitle);
  });

  it('covers all contractual pages with valid defaults and template alignment', () => {
    for (const slug of PAGE_SLUGS) {
      const defaults = getPageEditorDefaults(slug);
      const validation = validatePageDraft(slug, defaults);
      assert.equal(validation.ok, true, `${slug}: ${validation.ok ? '' : validation.error}`);

      const template = PAGE_REGISTRY[slug].template;
      const expectedKeys = TEMPLATE_SECTIONS[template]
        .filter((def) => defaults.sections.some((section) => section.section_key === def.section_key))
        .map((def) => def.section_key);

      const snapshot: PageSnapshot = {
        page: {
          id: `${slug}-id`,
          slug,
          path: PAGE_REGISTRY[slug].path,
          title: PAGE_REGISTRY[slug].title,
          template: 'about',
          status: 'draft',
          published_at: null,
          created_by: null,
          updated_by: null,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
        sections: [],
        seo: null,
      };

      const editor = normalizeEditorPayload(slug, snapshot);
      assert.deepEqual(
        editor.sections.map((section) => section.section_key),
        expectedKeys,
        `${slug} section keys`
      );
    }
  });
});
