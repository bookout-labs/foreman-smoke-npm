---
name: verify-foreman-smoke-npm
description: Verify a change to foreman-smoke-npm, a synthetic Node text library with no app to start. Use to prove an acceptance criterion with the repository's own check, the library's exports and the files the change adds.
---

# Verify foreman-smoke-npm

The repository has no app, server, sign-in or secrets. A user's surface is its files and the exports of `src/text.js`.

## Run the check

From the repository root, with the Node and npm versions in `package.json` (`.nvmrc` pins Node):

```sh
npm ci
npm run check
```

`npm run check` runs `node --test`. It passes when the summary shows `fail 0` and the exit code is 0. Neither command changes a tracked file.

For JUnit evidence, run the `check` command from `.foreman/contract.yaml`. It runs the same suite and writes `reports/junit.xml`.

## Drive a criterion

- A criterion about a file's content: read the file at the tested head with `git show HEAD:<path>` and compare its exact bytes, trailing newline included.
- A criterion about the library: call the export with `node --input-type=module -e 'import { normalizeWhitespace } from "./src/text.js"; console.log(JSON.stringify(normalizeWhitespace("...")))'` and compare the printed value.

## Evidence

For each criterion, record the command, its exit code and its output, and the head commit it ran at (`git rev-parse HEAD`). A criterion passes only when that output shows the expected result. A check that was not run, or output that doesn't show the criterion, leaves it unverified.

## Cleanup

Nothing to stop. `node_modules/` and `reports/` are ignored. `git status --short` must be empty afterward.
