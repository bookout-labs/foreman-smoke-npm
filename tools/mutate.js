import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function mutation(statement) {
  const condition = /^if \((.+)\) \{$/u.exec(statement);
  if (condition) return ['negate', `if (!(${condition[1]})) {`];
  if (/^return .+;$/u.test(statement)) return ['return', 'return undefined;'];
  if (/^throw .+;$/u.test(statement)) return ['throw', 'void 0;'];
}

for (const entry of readFileSync(0, 'utf8').split(/\r?\n/u)) {
  const sample = /^(src\/.+\.js):(\d+)$/u.exec(entry);
  if (!sample) continue;
  const [, path, number] = sample;
  if (path.split('/').includes('..') || !existsSync(path)) continue;

  const original = readFileSync(path, 'utf8');
  const lines = original.split('\n');
  const index = Number(number) - 1;
  const statement = lines[index]?.trim();
  const change = statement && mutation(statement);
  if (!change) continue;
  const [kind, replacement] = change;
  const digest = createHash('sha256').update(statement).digest('hex').slice(0, 12);

  lines[index] = lines[index].replace(statement, replacement);
  try {
    writeFileSync(path, lines.join('\n'));
    const { error, status, signal } = spawnSync('npm', ['run', 'check'], { stdio: 'ignore' });
    if (error) throw error;
    if (status !== 0 && status !== 1) {
      throw new Error(`npm run check ended with ${signal ?? status}`);
    }
    console.log(JSON.stringify({
      line: entry,
      id: `${path}:${kind}:${digest}`,
      result: status === 0 ? 'survived' : 'killed',
    }));
  } finally {
    writeFileSync(path, original);
  }
}
