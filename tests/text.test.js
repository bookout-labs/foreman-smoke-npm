import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeWhitespace, truncateWords } from 'foreman-smoke-npm';

test('normalization preserves ordinary text', () => {
  assert.equal(normalizeWhitespace('Silver birch'), 'Silver birch');
});

test('normalization removes leading and trailing whitespace', () => {
  assert.equal(normalizeWhitespace('  Silver birch  '), 'Silver birch');
});

test('normalization collapses repeated spaces', () => {
  assert.equal(normalizeWhitespace('Silver   birch'), 'Silver birch');
});

test('normalization collapses tabs and line breaks', () => {
  assert.equal(normalizeWhitespace('Silver\t\r\nbirch'), 'Silver birch');
});

test('normalization handles Unicode whitespace', () => {
  assert.equal(normalizeWhitespace('\u00a0Silver\u2003birch\u00a0'), 'Silver birch');
});

test('normalization preserves Unicode letters and punctuation', () => {
  assert.equal(normalizeWhitespace('  Café,  東京! '), 'Café, 東京!');
});

test('normalization accepts an empty string', () => {
  assert.equal(normalizeWhitespace(''), '');
});

test('normalization turns whitespace alone into an empty string', () => {
  assert.equal(normalizeWhitespace(' \n\t '), '');
});

test('normalization rejects non-string inputs', () => {
  for (const input of [null, undefined, 42, {}, ['Silver']]) {
    assert.throws(() => normalizeWhitespace(input), TypeError);
  }
});

test('truncation retains only the requested words', () => {
  assert.equal(truncateWords('Silver birch grows here', 2), 'Silver birch');
});

test('truncation normalizes whitespace before counting words', () => {
  assert.equal(truncateWords('  Silver\t birch\n grows ', 2), 'Silver birch');
});

test('truncation keeps an exact-length sentence', () => {
  assert.equal(truncateWords('Silver birch', 2), 'Silver birch');
});

test('truncation keeps sentences shorter than the limit', () => {
  assert.equal(truncateWords('Silver birch', 8), 'Silver birch');
});

test('truncation accepts a zero-word limit', () => {
  assert.equal(truncateWords('Silver birch', 0), '');
});

test('truncation accepts empty and whitespace-only strings', () => {
  assert.equal(truncateWords('', 3), '');
  assert.equal(truncateWords(' \t\n ', 3), '');
});

test('truncation preserves punctuation and Unicode words', () => {
  assert.equal(truncateWords('Café, 東京! Next.', 2), 'Café, 東京!');
});

test('truncation rejects invalid word limits', () => {
  for (const limit of [-1, 1.5, NaN, Infinity, '2', null, undefined, 2 ** 53]) {
    assert.throws(() => truncateWords('Silver birch', limit), RangeError);
  }
});

test('truncation rejects non-string text even with a zero-word limit', () => {
  assert.throws(() => truncateWords(null, 0), TypeError);
});
