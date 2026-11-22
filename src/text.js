export function normalizeWhitespace(text) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  return text.trim().replace(/\s+/gu, ' ');
}

export function truncateWords(text, maxWords) {
  if (!Number.isSafeInteger(maxWords) || maxWords < 0) {
    throw new RangeError('maxWords must be a nonnegative safe integer');
  }
  const normalized = normalizeWhitespace(text);
  return normalized.split(' ').slice(0, maxWords).join(' ');
}
