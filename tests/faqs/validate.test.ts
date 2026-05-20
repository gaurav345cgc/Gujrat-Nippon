import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyReorder,
  isNearDuplicateQuestion,
  validateFaqCreateInput,
  validateFaqPatch,
} from '../../lib/faqs/validate';

describe('FAQ validation', () => {
  it('rejects empty question on create', () => {
    const result = validateFaqCreateInput({
      question: '   ',
      answer: 'Valid answer.',
      category: 'general',
    });
    assert.equal(result.ok, false);
  });

  it('rejects empty answer on create', () => {
    const result = validateFaqCreateInput({
      question: 'What is GNIPL?',
      answer: '',
      category: 'general',
    });
    assert.equal(result.ok, false);
  });

  it('accepts valid create input', () => {
    const result = validateFaqCreateInput({
      question: 'What is GNIPL?',
      answer: 'GNIPL is an industrial supplier.',
      category: 'general',
    });
    assert.equal(result.ok, true);
  });

  it('rejects invalid category on patch', () => {
    assert.equal(validateFaqPatch({ category: 'invalid' }), 'Invalid category.');
  });

  it('detects near-duplicate questions', () => {
    assert.equal(isNearDuplicateQuestion('What is GNIPL?', 'What is GNIPL?'), true);
    assert.equal(
      isNearDuplicateQuestion(
        'How can I contact GNIPL for support?',
        'Contact GNIPL for support'
      ),
      true
    );
    assert.equal(isNearDuplicateQuestion('Working hours?', 'Brochure download'), false);
  });
});

describe('FAQ reorder', () => {
  it('accepts valid full reorder list', () => {
    const ids = ['a', 'b', 'c'];
    assert.deepEqual(applyReorder(ids, ['c', 'a', 'b']), ['c', 'a', 'b']);
  });

  it('rejects reorder with missing ids', () => {
    assert.equal(applyReorder(['a', 'b'], ['a']), null);
  });

  it('rejects reorder with unknown ids', () => {
    assert.equal(applyReorder(['a', 'b'], ['a', 'x']), null);
  });
});
