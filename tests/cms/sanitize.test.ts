import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCmsText, sanitizePhone } from '../../lib/cms/sanitize';

describe('CMS sanitize', () => {
  it('strips script tags and HTML', () => {
    assert.equal(sanitizeCmsText('<b>Hello</b><script>alert(1)</script>'), 'Hello');
  });

  it('normalizes whitespace', () => {
    assert.equal(sanitizeCmsText('  multiple   spaces  '), 'multiple spaces');
  });

  it('preserves newlines in body mode', () => {
    assert.equal(sanitizeCmsText('Line one\n\nLine two', true), 'Line one\n\nLine two');
  });

  it('sanitizes phone numbers', () => {
    assert.equal(sanitizePhone('+91-22-4099 7000<script>'), '+91-22-4099 7000');
  });
});
