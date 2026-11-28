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

- For a file-content criterion, run `node -e 'console.log(require("node:fs").readFileSync(process.argv[1]).toString("hex"))' '<path>'` from the checkout. Compare the hex output, including `0a` for an expected trailing newline.
- A criterion about the library: call the export with `node --input-type=module -e 'import { normalizeWhitespace } from "./src/text.js"; console.log(JSON.stringify(normalizeWhitespace("...")))'` and compare the printed value.

## Evidence

Use Foreman's published head and changed paths as evidence for head and change-scope checks. Record each command, its exit code, and its output. Mark a criterion unverified when the evidence needed to judge it is missing.

## Cleanup

Nothing to stop. Foreman checks checkout cleanliness afterward.
