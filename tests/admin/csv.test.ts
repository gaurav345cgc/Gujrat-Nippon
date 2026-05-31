import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeCsvField } from '../../lib/admin/csv';

describe('CSV export safety', () => {
  it('neutralizes spreadsheet formula prefixes', () => {
    assert.equal(escapeCsvField('=cmd|A1'), "'=cmd|A1");
    assert.equal(escapeCsvField('+SUM(A1:A2)'), "'+SUM(A1:A2)");
    assert.equal(escapeCsvField('-10+20'), "'-10+20");
    assert.equal(escapeCsvField('@HYPERLINK'), "'@HYPERLINK");
    assert.equal(escapeCsvField('\n=cmd'), '"\'\n=cmd"');
  });

  it('keeps standard CSV escaping behavior', () => {
    assert.equal(escapeCsvField('hello, world'), '"hello, world"');
    assert.equal(escapeCsvField('plain text'), 'plain text');
  });
});
