import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapHeroToPageHero } from '../../lib/cms/map-hero';

describe('mapHeroToPageHero', () => {
  it('maps industries hero: subheadline as label, headline split into title parts', () => {
    const mapped = mapHeroToPageHero(
      {
        headline: 'Industries We Serve',
        subheadline: 'Industries & services',
        body: 'Industries served metal processing India and allied sectors.',
      },
      {}
    );

    assert.equal(mapped.label, 'Industries & services');
    assert.equal(mapped.titleMain, 'Industries');
    assert.equal(mapped.titleAccent, 'We Serve');
    assert.equal(mapped.description, 'Industries served metal processing India and allied sectors.');
  });

  it('splits headline on comma for products-style titles', () => {
    const mapped = mapHeroToPageHero({
      headline: 'Industrial Machinery, Spares & Equipment Supply',
      subheadline: 'Explore Our Solutions',
      body: 'Body text',
    });

    assert.equal(mapped.label, 'Explore Our Solutions');
    assert.equal(mapped.titleMain, 'Industrial Machinery');
    assert.equal(mapped.titleAccent, 'Spares & Equipment Supply');
  });
});
