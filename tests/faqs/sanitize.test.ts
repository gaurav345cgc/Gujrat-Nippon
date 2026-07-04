import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeFaqText, sanitizeKeywords } from '../../lib/faqs/sanitize';

describe('FAQ sanitize', () => {
  it('strips script tags and HTML', () => {
    const out = sanitizeFaqText('Hello <script>alert(1)</script> world');
    assert.equal(out, 'Hello world');
  });

  it('normalizes whitespace', () => {
    assert.equal(sanitizeFaqText('  multiple   spaces  '), 'multiple spaces');
  });

  it('deduplicates keywords', () => {
    assert.deepEqual(sanitizeKeywords(['Export', 'export', 'spares']), ['export', 'spares']);
  });
});
