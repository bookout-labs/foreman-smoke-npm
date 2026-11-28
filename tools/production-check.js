import { setTimeout as delay } from 'node:timers/promises';

// The fixture has no deployment. Commits on main count as deployed.
async function check(commit) {
  if (!/^[a-f0-9]{40}$/iu.test(commit)) {
    console.error('Expected a full commit SHA');
    return 2;
  }

  const url = `https://api.github.com/repos/bookout-labs/foreman-smoke-npm/compare/${commit}...main`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (response.status === 404 || response.status === 422) {
        console.log(`GitHub answered HTTP ${response.status} for ${commit}`);
        return 3;
      }
      if (!response.ok) throw new Error(`GitHub answered HTTP ${response.status}`);

      const { status } = await response.json();
      console.log(`GitHub reports main as ${status} relative to ${commit}`);
      if (status === 'identical' || status === 'ahead') return 0;
      if (status === 'behind' || status === 'diverged') return 3;
      throw new Error('GitHub returned an unknown comparison status');
    } catch (error) {
      console.error(error.message);
      if (attempt < 3) await delay(2_000 * attempt);
    }
  }
  return 3;
}

process.exitCode = await check(process.argv[2]);
