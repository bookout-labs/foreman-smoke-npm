# foreman-smoke-npm

This repository is a synthetic fixture for the Foreman release smoke in
[bookout-labs/tools#205](https://github.com/bookout-labs/tools/issues/205).
It contains only invented data. The tools release maintainer owns the fixture
contract and runtime or dependency updates.

The fixture contract includes the following properties.

- A small ESM text library with no runtime dependencies and a meaningful `node --test` suite.
- `npm ci` as preflight and `npm run check` as the check command. Both leave the checkout clean.
- Node 26.12.1 and npm 11.20.0, recorded in `package.json`, with Node also pinned in `.nvmrc`.
- A committed npm lockfile at version 3 and an ignored `node_modules/` directory.
- A valid, unrelated TOML package manifest at `tests/fixtures/manifest.toml`.
  Its package and inventory tables deliberately cannot parse as a Foreman FixtureManifest.
  Smoke runs on this target do not pass a `fact_record`.

Run the checks with the recorded runtime versions.

```sh
npm ci
npm run check
```

The library exports `normalizeWhitespace(text)` and `truncateWords(text, maxWords)`.
Both accept strings and use JavaScript whitespace boundaries. Normalization trims
and collapses whitespace into single spaces while preserving letters and punctuation.
Truncation normalizes the string and returns at most `maxWords` whitespace-separated
words. The limit must be a nonnegative safe integer. Zero returns an empty string.
Invalid text throws `TypeError`, and an invalid limit throws `RangeError`.

Like `foreman-smoke`, this repository uses `main`, the `smoke` and `slice` labels,
and a CI job named `test`. It has no issue templates. CI runs the npm preflight
and check on pushes to `main`, pull requests, and merge groups.
