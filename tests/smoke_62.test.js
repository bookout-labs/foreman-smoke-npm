import assert from 'node:assert/strict';
import { lstatSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('root smoke_62.txt is a regular file containing exactly smoke 62 and one LF', () => {
  const fixture = new URL('../smoke_62.txt', import.meta.url);

  assert.ok(lstatSync(fixture).isFile(), 'smoke_62.txt must be a regular file');
  assert.deepEqual(readFileSync(fixture), Buffer.from('smoke 62\n'));
});
