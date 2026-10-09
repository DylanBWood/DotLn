# WO-075 self-review: Adversary of the acceptance criteria

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back by the host, unknown), given only the order and the executor's diff, read-only, on 2026-10-09 before `implementation-ready`. Findings as returned, each with the executor's disposition. Counts: 13 found; 12 fixed; 1 recorded.

## F1 (major) — Criterion 3: a generated hook refusing a denied effect

- **Location:** harness-live/executor-001.json (the attribution rows); packages/skeleton/src/harness-host.ts (a FeedbackRefused returns an advisory unless a foreign writer holds the worktree); scripts/harness-live-smoke.mjs `denied`
- **Claim:** The record shows the attribution judgment (`allowed: false`) followed by a delegated advisory ("host permissions decide"), not a refusal row; `deniedEffectRefused` counts the judgment, and `fixtureCommitDidNotExecute` is vacuous for a clean scratch.
- **Evidence:** The record's rows 107 and 108; harness-host.ts: `foreignWriter ? protocolRefusal(...) : protocolAdvisory(reason)` since 2026-09-15 (after the WO-042 records); the CLAUDE.md block: "Other tool and completion judgments are advisory and host permissions decide."
- **Disposition:** fixed: a second smoke in the export runs the writer-isolation scenario (`DOTLN_LIVE_WRITER=foreign-live`), in which a generated hook refuses the session's write dispatch outright and names the holder ([harness-live/writer-foreign-live-001.json](harness-live/writer-foreign-live-001.json)); the smoke now records `requiredDeniedEffectResponse` (`refusal` or `advisory`) beside `requiredDeniedEffectRefused`, so a judgment is never read as a refusal; D005, the capability row and the handoff cite the refusal record for criterion 3's refusal and the executor record for the attribution judgment delegated to host permissions and the role resolution.

## F2 (major) — Criterion 6: the capability-table row at its evidenced level

- **Claim:** The row said "the generated hook refused the attribution commit"; the record shows a delegation.
- **Disposition:** fixed: the row names the writer-isolation refusal and the delegated attribution judgment separately.

## F3 (minor) — Criterion 2 surfaces: what `harness check` verifies in a fork

- **Claim:** README step 3 and the first-order template said the check verifies the compiled runtime; it checks the forty pinned files through the snapshot and the generated surfaces, and KIT-MANIFEST.json hashes the rest.
- **Evidence:** The worker's probe: appending to an unpinned dist file left `harness check` passing; appending to a pinned one was refused.
- **Disposition:** fixed: README step 3 and first-order item 3 say the pinned snapshot and every generated surface, and that KIT-MANIFEST.json hashes the whole runtime (the kit block already said so).

## F4 (minor) — Criterion 1/README: the fork's first commit then `npm ci`

- **Claim:** `npm ci` makes skeleton's bin target executable; the export wrote it 0644, so the README's order (commit, then install) dirties the tree.
- **Evidence:** `git status` in the evidence export after `npm ci`: ` M packages/skeleton/dist/src/dotln.js` (old mode 100644, new mode 100755).
- **Disposition:** fixed: the export writes each runtime package's bin targets with mode 0755 (read from the package.json at the commit); the fresh-clone case asserts `git status --porcelain` is empty after `npm ci` in a committed clone.

## F5 (minor) — Criterion 4: the comparison is from the export the handoff names

- **Claim:** cold-start.json named an earlier export than export-run.md and the smoke.
- **Disposition:** fixed: the pipeline regenerates cold-start.json from the final evidence export, and the record names that export's commit.

## F6 (minor) — Criterion 6 / Cost: product 03 bytes

- **Claim:** The Cost line allowed 300 bytes; the paragraph grew by about 1,100, and D011 did not record the override.
- **Disposition:** fixed: D011 records that the 2026-10-07 ceiling supersedes the Cost line's bound, as WO-074-D010 did; the paragraph was trimmed of fixture outcomes (179,317 bytes against 194,488).

## F7 (minor) — Step 1 deviation: kit scripts that reach omitted packages

- **Claim:** `npm run plan -- conditions` has no build step and reaches `packages/console` through its collect-sources row, which degrades to `unavailable`; D010's "all run the build first" was wrong.
- **Disposition:** fixed: D010 and the client README name the plan-conditions row.

## F8 (minor) — Identifiers as shapes in the committed evidence

- **Claim:** Two decisions named the operator's absolute home-directory checkout path.
- **Disposition:** fixed: `<main-checkout>` in both.

## F9 (note) — WO-074 criterion 3 regression after the build lands

- **Claim:** The declaration-file plant no longer covers the real case: a committed `.ts` module under a runtime package travels as compiled output.
- **Disposition:** fixed: a new case commits a valid module holding the synthetic term and shows the export refused by the local-terms screen naming `packages/skeleton/dist/src/planted-module.js`; D009 records the residual (the screen is what keeps such material out).

## F10 (note) — Criterion 2 wording in the capability row

- **Claim:** "every hook imports the snapshot" is loose; the Codex continuation hook imports only builtins.
- **Disposition:** fixed: "every hook that loads the runtime".

## F11 (note) — Step 4 deviation: refusals after writing

- **Claim:** The emit-mismatch, failed-check and ignored-path refusals leave a partial destination, and D003 did not say so.
- **Disposition:** fixed: the CLI message names the partial export and its missing KIT-MANIFEST.json; D003 records it; the ignore check now runs right after `git init`, before the emit.

## F12 (note) — Criterion 1 / step 5 deviation: what the rebuild proves

- **Claim:** The rebuild shares the running install; only TypeScript's version was compared with the lockfile.
- **Disposition:** fixed in part, recorded in part: exportKit now refuses when any root development dependency's installed version is not the commit lockfile's; the residual (transitive dependencies are not compared) is recorded in D009's reopen condition.

## F13 (note) — Criterion 1: the "no package source" scanner

- **Claim:** The scanner matched only `.ts`; `.mts`, `.cts` and `.tsx` would pass, and `packages/beacons/src/types.d.mts` already travels.
- **Disposition:** fixed: the scanner covers every TypeScript source form under `packages/*/src` outside the build-free Beacon workspace, whose declaration file is a WO-074 kit file.

Per-criterion judgments as returned: 1 met (caveats F12, F13), 2 met (F3, F10), 3 partial (F1), 4 met (F5), 5 met, 6 partial (F2, F6), 7 partial (gates pending at review time), evidence gate partial (F1), execution-plan deviations met (F7, F1, F11 inside the records). Every partial judgment names a finding disposed above.
