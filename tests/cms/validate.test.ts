import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ctaPayloadSchema,
  heroPayloadSchema,
  validatePageDraft,
  validateSectionPayload,
} from '../../lib/cms/validate';

describe('CMS section validation', () => {
  it('rejects javascript: href on CTA', () => {
    const result = validateSectionPayload('cta', {
      heading: 'Contact',
      buttonLabel: 'Go',
      buttonHref: 'javascript:alert(1)',
    });
    assert.equal(result.ok, false);
  });

  it('accepts relative path on CTA', () => {
    const result = validateSectionPayload('cta', {
      heading: 'Contact',
      buttonLabel: 'Go',
      buttonHref: '/contact',
    });
    assert.equal(result.ok, true);
  });

  it('accepts mailto href on CTA', () => {
    const result = validateSectionPayload('cta', {
      heading: 'Careers',
      buttonLabel: 'Email',
      buttonHref: 'mailto:careers@gujaratnippon.com',
    });
    assert.equal(result.ok, true);
  });

  it('requires hero headline', () => {
    const parsed = heroPayloadSchema.safeParse({ headline: '' });
    assert.equal(parsed.success, false);
  });

  it('rejects invalid email on contact_info', () => {
    const result = validateSectionPayload('contact_info', {
      address: 'Mumbai',
      phone: '+91-22-4099 7000',
      email: 'not-an-email',
    });
    assert.equal(result.ok, false);
  });
});

describe('CMS page draft validation', () => {
  it('rejects missing required about section', () => {
    const result = validatePageDraft('about', {
      sections: [
        {
          section_key: 'hero',
          section_type: 'hero',
          payload_json: { headline: 'About Gujarat Nippon' },
        },
      ],
      seo: {
        seoTitle: 'About Us — Gujarat Nippon International',
        metaDescription:
          'Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years of execution across 510+ projects worldwide.',
      },
    });
    assert.equal(result.ok, false);
  });

  it('accepts minimal valid contact draft', () => {
    const result = validatePageDraft('contact', {
      sections: [
        {
          section_key: 'page_header',
          section_type: 'text',
          payload_json: {
            heading: 'Contact Us',
            body: 'Submit your enquiry to our Mumbai office.',
          },
        },
        {
          section_key: 'contact_info',
          section_type: 'contact_info',
          payload_json: {
            address: '21, Navyug Industrial Estate, Mumbai – 400069',
            phone: '+91-22-4099 7000',
            email: 'info@gujaratnippon.com',
          },
        },
        {
          section_key: 'form_intro',
          section_type: 'text',
          payload_json: {
            heading: 'Enquiry form',
            body: 'Complete the form below.',
          },
        },
      ],
      seo: {
        seoTitle: 'Contact Us — Mumbai MIDC Office | Gujarat Nippon International',
        metaDescription:
          'Contact Gujarat Nippon International at our Mumbai MIDC office for turnkey project enquiries, industrial machinery requirements and export-import consultations.',
      },
    });
    assert.equal(result.ok, true);
  });
});

describe('CMS CTA schema', () => {
  it('parses valid CTA payload', () => {
    const parsed = ctaPayloadSchema.safeParse({
      heading: 'Discuss your requirement',
      buttonLabel: 'Contact Us',
      buttonHref: '/contact',
    });
    assert.equal(parsed.success, true);
  });
});
