# WO-240 — Node 24 beside Node 26: the launchpad and every export run on Node 24.15 and later in the 24 line and on Node 26, the engines field says exactly that in every package, the gate's host check refuses a runtime outside the range, one complete gate run under Node 24.15.0 is recorded, and the kit README states the runtimes and the private-clone recipe (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Front page:** README.md
**Release classification:** minor. A second supported runtime for every
instance, carried by the exported `package.json`; one new host check that
refuses only a runtime outside the declared range; two README passages and
two front-page sentences.
Assigned at activation under the standing opt-out default.
**Cost:** adds, in `package.json` and the six `packages/*/package.json`, the
engines range `^24.15.0 || ^26.0.0` in place of `>=26.0.0 <27`; in
`scripts/structural-checks.mjs` `checkHost`, one comparison of
`process.version` against the root engines range that refuses outside it,
naming the range and the running version, with its fixture in the suite
that declares `scripts/structural-checks.mjs` (`declarations` or
`generated`, as `npm test -- --list --review` names them at activation) and
a case in the `launchpad` suite that an export's `package.json` carries the
root range; one recorded complete gate run under Node 24.15.0
(`docs/evidence/WO-240/node24-gate.json`: the Node version, the gate row,
the exit code, the command); the fixes that run finds, if any; two sentences
in `README.md` under the `**Front page:**` field (the Node line, and the
founding lesson at line 86 restated without naming an earlier system, the
operator's item 3.a of 2026-10-30, which the planning pass could not apply
on its branch because the front page changes only through an order); two
passages in `scripts/kit/README.client.md` §First steps (the supported
runtimes; the private-clone recipe). Removes: the state where the only runtime any gate
has ever run under is the one on the operator's machine, where nothing
compares the running Node to the engines field, and where an instance on a
Node 24 host is told by `npm ci` that it is unsupported while every script
runs. Wall-clock: one extra complete gate run under Node 24.15.0 (the
complete run's recent median is 24.9 minutes; WO-239's VER-001 run took 33
min 21 s), plus `fnm install 24.15.0` and one `npm ci` under it (minutes).
Recurring cost: the host check adds one semver comparison to every gate
start; the executor records `checkHost`'s duration from the gate's task
rows before and after. Context bytes: this file, about 16,000. Commands: no
new command. Tokens: unknown until run. Steps: 8. Re-mints: `package.json`
is a common source of the evidence inventories
(`scripts/lib/evidence-sources.mjs`), so each edition whose check the
engines change stales is re-minted deterministically, the feedback edition
by carry (`package.json` is not in `FEEDBACK_SOURCE_PATHS`); no live
feedback episode. `package.json` and `scripts/structural-checks.mjs` are
declared machinery sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's dispatch of 2026-10-30, item 1
("support node v24.15.0 in addition to current node 26") and item 4 (the
starter cloned at work into a private repository; the recipe checked), in
ignored intake `docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30.md`
(SHA-256 `94d4f4bd85efaf035a89353d6ad88abedf8e1d29c2c298fe1b3d69b62806bd8a`).
Filed by the [2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen: no
stop condition; the private repository is named only as such.
**Depends on:** WO-226 (closed: the kit runtime after an update, whose
bootstrap the recipe runs); WO-075 (closed: the export carries
the compiled runtime and `package.json` is generated from core's, so the
engines change reaches every instance through the kit).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-226",
    "relation": "satisfied-by-close",
    "reason": "the export's bootstrap and harness check the recipe runs"
  },
  {
    "workOrderId": "WO-075",
    "relation": "satisfied-by-close",
    "reason": "the export generates its package.json from core's, so the engines range travels with the kit"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `package.json` (`engines` at line 52;
`devDependencies` at 47: `@types/node` 26.6.2, `prettier` 3.9.6,
`typescript` 7.0.2); `packages/{beacons,browser-evidence,compiler,console,kernel,skeleton}/package.json`
(`engines`); `.node-version` (`26.9.0`); `scripts/launchpad.mjs` 406 to 416
and 473 (the export's `package.json` spreads `corePackage.engines`);
`scripts/structural-checks.mjs` (`checkHost` at 23, `checkDeclarations` at
54); `scripts/test-runner.mjs` (the `host` task; `machinerySources` naming
`scripts/structural-checks.mjs` at 160 and 413); `scripts/bootstrap.mjs`
(`npm ci --ignore-scripts`, then `harness emit`; no runtime check);
`scripts/lib/product-read-guard.mjs` 290 (`fs.globSync`);
`scripts/test-runner.test.mjs` 3422 to 3438 (`fs.glob`, `fs.promises.glob`);
`packages/compiler/test/purity.test.ts` (`process.getBuiltinModule`);
`scripts/test-gate-followups.mjs` (`--test-isolation`); `README.md` line
45; `scripts/kit/README.client.md` §First steps and §Taking upstream
updates (the remote named `upstream`, `remote.upstream.tagOpt --no-tags`);
`docs/evidence/WO-239/verification-001.json` (the complete gate's
`requiredSuites` and 2,000,806 ms duration, the figure the Node 24 run is
compared with).

**Objective:** A launchpad or an export runs on Node 24.15 or later in the 24
line, or on Node 26, and says so: every package's engines field carries the
range, the gate refuses a runtime outside it at its first task instead of
failing somewhere inside a suite, and a complete gate has actually passed
under Node 24.15.0 with the record to show it. An operator cloning the
starter into a private repository on a Node 24 host follows one README
passage from `gh repo create` to `node scripts/harness.mjs check` and meets
no warning the kit did not predict.

**Observed gap (dated 2026-10-30 at `main` `4090d70d`):**

- `engines` reads `>=26.0.0 <27` in the root `package.json` and in all six
  `packages/*/package.json`; `.node-version` pins `26.9.0`; `fnm list` on
  the operator's machine shows only `v26.9.0`. `fnm ls-remote` on
  2026-10-30 lists the 24 line through `v24.22.2` (Krypton), so `24.15.0`
  exists and is a past release of the line the operator's other host runs.
- No continuous integration exists (`.github/workflows` is absent); the
  only gate runs are local, so no runtime but the one installed has ever
  verified a release.
- Nothing compares the running Node to the engines field: `bootstrap.mjs`
  runs `npm ci --ignore-scripts` (which prints an `EBADENGINE` warning
  outside the range and continues, since no `.npmrc` sets `engine-strict`)
  and `harness emit`; `checkHost` judges memory pressure only.
- The export's `package.json` spreads `corePackage.engines`
  (`scripts/launchpad.mjs` 416 and 473), so the starter at v0.103.1 carries
  `>=26.0.0 <27` too, and the kit README states no runtime at all; core's
  README says "With Node 26, two commands install the workspace".
- A static scan on 2026-10-30 of `scripts/` and `packages/*/src` for APIs
  newer than Node 24 found three families, all present in 24: `fs.globSync`
  and `fs.glob` (added v22.0.0, stable since v24.0.0 by the Node 24
  reference), `process.getBuiltinModule` (v22.3.0) and `--test-isolation`
  (v22.8.0); none of `node:sqlite`, `Error.isError`, `RegExp.escape`,
  `Uint8Array.fromBase64`, `Math.sumPrecise`, `Iterator.concat`,
  `DisposableStack`, `import.meta.main`, `zstd`, `process.execve`,
  `util.diff` or `assert.partialDeepStrictEqual` is used. The locked
  dependencies require `>=16.20.0`, `>=20` and `>=14`. A static scan is a
  reading, not a run; the complete gate under 24.15.0 is the evidence.
- The operator's private-clone recipe was rehearsed by the filing pass
  against local stand-ins (a bare mirror of the starter checkout at
  v0.103.1 with one tag, and an empty bare repository for the private
  origin): `git clone --no-tags` carried `tagOpt --no-tags` into the
  renamed `upstream` remote, so the explicit `git config` line is
  redundant and harmless; no tag reached the clone, before or after a plain
  `git fetch upstream`; `git push -u origin main` set `main` to track
  `origin/main`; `node scripts/bootstrap.mjs` ran `npm ci` and `harness
  emit` (35 generated surfaces) and `node scripts/harness.mjs check`
  passed with one advisory, `local-terms list: unavailable`, which the kit
  README's step 4 resolves and the operator's two commands omit. The
  rehearsal ran under Node 26.9.0, so it says nothing about Node 24.

**Design (scope discipline):**

- **The range says what is tested.** `^24.15.0 || ^26.0.0`: the 24 line
  from the version the operator's other host runs, and the 26 line.
  Rejected: `>=24.15.0 <27` (axis: it admits Node 25, which is neither a
  long-term-support line nor one any gate runs under; the field should
  name only what the gate has passed on).
- **The gate refuses what the field excludes.** `checkHost` compares
  `process.version` with the root engines range and refuses outside it,
  naming both; an instance's export carries the same field and the same
  check. Rejected: relying on `npm ci`'s `EBADENGINE` warning (axis: a
  warning nobody reads versus a refusal at the gate's first task with the
  remedy named). Rejected: a continuous-integration matrix (axis: the
  repository runs no CI and the operator's direction keeps gates local; one
  recorded run under 24.15.0 plus a standing host check is the evidence a
  local gate can give).
- **The development default stays on 26.** `.node-version` keeps `26.9.0`;
  the kit exports no `.node-version` (none is in `KIT-MANIFEST.json`), so an
  instance pins its own. Rejected: lowering `.node-version` to 24 (axis: the
  default follows the newest supported line; the 24 support is a range, not
  a move).
- **Types stay at 26.** `@types/node` 26.6.2 stays; the only guard against
  a 26-only API entering the tree is the recorded Node 24 gate run and the
  host check an instance on 24 runs at every gate. Rejected: pinning
  `@types/node` to 24 (axis: types are compile-time and would hide the 26
  APIs the 26 line may legitimately use once the range changes again).
- **The recipe is documented where an instance reads it.** The kit README's
  §First steps gains the supported runtimes and the private-clone recipe,
  with the local-terms step named as the one the recipe does not replace.
  Rejected: a new document (axis: the README is the instance's one entry
  point and already holds §Taking upstream updates, which names the
  `upstream` remote).
- **Live-run surfaces at the base.** `checkHost`: exists. The export's
  `package.json` generation: exists. A Node 24 binary on the executor's
  host: absent (`fnm install 24.15.0`). A gate row that records
  `process.version`: absent; this order records the version in its own
  evidence file and does not change the gate index.

**Execution plan (the executor follows these steps in order; observed at `4090d70d`, 2026-10-30):**

1. `package.json` and `packages/{beacons,browser-evidence,compiler,console,kernel,skeleton}/package.json`:
   `engines.node` becomes `^24.15.0 || ^26.0.0`; `npm install
   --package-lock-only` regenerates the lockfile's workspace entries
   without changing a dependency version. Check: `npm test -- --only
   configuration-root`; `npm test -- --only build`.
2. `scripts/structural-checks.mjs` `checkHost` (line 23): read the root
   `package.json` engines range and refuse when `process.version` is
   outside it, naming the range, the version and `node scripts/bootstrap.mjs`
   as unaffected; the comparison uses no new dependency (a small range
   reader for `^major.minor.patch` alternatives in `scripts/lib/`, with its
   cases). Fixture: a stubbed version inside (24.15.0, 26.9.0) and outside
   (22.2.0, 25.9.0, 27.0.0) the range. Check: the suite `npm test -- --list
   --review` names for `scripts/structural-checks.mjs` (`declarations` or
   `generated`), spelled in the Preflight line at activation.
3. `scripts/test-launchpad*.mjs` (the export case that reads the generated
   `package.json`): assert the export's `engines.node` equals the root's
   range. Check: `npm test -- --only launchpad`.
4. The Node 24 run: `fnm install 24.15.0`; `fnm exec --using 24.15.0 node
   --version`; `fnm exec --using 24.15.0 npm ci`; `fnm exec --using 24.15.0
   npm run build`; `fnm exec --using 24.15.0 npm test -- --review` in the
   background, awaited with `node scripts/harness.mjs evidence --wait`;
   `docs/evidence/WO-240/node24-gate.json` records the command, the Node
   version, the gate row's identity, duration and exit code. A failure under
   24 is fixed in the source that fails, the fix re-run under both lines,
   and the cause recorded in `docs/evidence/WO-240/decisions.md`. Then `npm
   ci` under 26 again, so the checkout's `node_modules` is the development
   line's.
5. `README.md` under the `**Front page:**` field (product 07 §Documentation
   freshness and ownership): line 45 names both lines ("With Node 24.15 or
   later in the 24 line, or Node 26, two commands install the workspace and
   run the first proof"), and the sentence at line 86 that names an earlier
   system is restated as the mechanism ("a bigger prompt, and a bigger
   prompt collapses: roughly 140 rules loaded as prose bring **the whole
   stash into every map**"), outside the "What runs today" block and its
   line budget. Check: `npm run test:docs` (the front-page check admits the
   change under the field).
6. `scripts/kit/README.client.md` §First steps: one passage naming the
   runtimes (Node 24.15 or later in the 24 line, or Node 26; `harness check`
   and every gate refuse another) and one passage with the private-clone
   recipe as the operator wrote it, in order: `gh repo create <org>/<name>
   --private`; `git clone --no-tags <starter url> <name>`; `git remote
   rename origin upstream`; `git config remote.upstream.tagOpt --no-tags`
   (redundant after the clone, kept because it is the same line §Taking
   upstream updates gives an existing clone); `git remote add origin <private
   url>`; `git push -u origin main`; `node scripts/bootstrap.mjs`; `node
   scripts/harness.mjs check`; then step 4's local-terms list and step 7's
   `npm run meta`, which the recipe does not replace. Check: `npm test --
   --only launchpad` (the README is a kit file); `npm run publication:check`.
7. Write-backs: `docs/evidence/WO-240/decisions.md` (the range, the host
   check's measured cost before and after from the gate's task rows, the
   Node 24 run's result); re-mint each edition `package.json` stales
   (`scripts/lib/evidence-sources.mjs`; the feedback edition by carry);
   `npm run meta`; `node scripts/lineage.mjs index --check`.
8. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` under Node 26 in the background awaited with `node
   scripts/harness.mjs evidence --wait`; `docs/evidence/WO-240/handoff.md`;
   `npm run test:docs` once after the last document edit; `npm run resume
   -- implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the engines range in seven packages and the regenerated
lockfile; the host check with its fixture; the export case; the recorded
Node 24.15.0 complete run and any fix it needed; the two README passages;
the decisions and re-mints.

**Acceptance criteria (all required)**

1. `engines.node` reads `^24.15.0 || ^26.0.0` in `package.json` and in all
   six `packages/*/package.json`; the lockfile's workspace entries carry the
   same range and no dependency version changed (`git diff
   package-lock.json` shows engines lines only).
2. `checkHost` refuses a stubbed `process.version` of `22.2.0`, `25.9.0`
   and `27.0.0`, naming the range and the version, and admits `24.15.0`,
   `24.22.2` and `26.9.0`; the fixture is in the suite that declares
   `scripts/structural-checks.mjs`; the gate's `host` task row on this
   checkout records the check's duration, and `docs/evidence/WO-240/decisions.md`
   names that duration before and after the change.
3. `docs/evidence/WO-240/node24-gate.json` records one complete `npm test
   -- --review` run under Node `v24.15.0` with exit code 0, its gate row
   identity and duration, and the command that produced it; a fix made for
   Node 24, if any, is named in the decisions with the failing suite and
   the cause.
4. An export's generated `package.json` carries the root range (the
   `launchpad` suite's case).
5. `README.md` names both lines and no longer names an earlier system in
   its founding lesson, with the "What runs today" block and its line budget
   unchanged; `scripts/kit/README.client.md` §First steps names the runtimes
   and carries the private-clone recipe ending in `node scripts/harness.mjs
   check` and naming the local-terms step it does not replace; `npm run
   publication:check` is green.
6. Each edition `package.json` stales is re-minted deterministically with
   its cause in the decisions; `npm run evidence:artifact -- --check` (or
   the edition's own check) is green.
7. `npm test -- --review` and `npm run test:docs` green under Node 26 at
   the final code identity; `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only configuration-root` and `npm test --
--only build` for step 1; the suite `npm test -- --list --review` names for
`scripts/structural-checks.mjs` for step 2 (`npm test -- --only declarations`
or `npm test -- --only generated`, written in at activation); `npm test --
--only launchpad` for steps 3 and 6; `npm run test:docs` when a document
changes; each under `node scripts/harness.mjs bounded --`; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixture of criterion 2 and the recorded run of
criterion 3; the deterministic re-mints of criterion 6; `npm test --
--review` before `implementation-ready`, final review reusing the passing
complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in steps 5 to 7 and criterion 5.

**Known issues and carry-ins:**

- The gate index records no Node version per row, so "which runtime
  verified this release" is answered by this order's evidence file and by
  the host check, not by the rows (reopen: a second instance runtime is
  supported, or a release breaks on one line after passing on the other).
- A host without `fnm` installs Node 24.15.0 its own way; the order names
  the binary, not the manager (reopen: the executor's host has no version
  manager and no Node 24 binary can be installed, which is a failure
  artifact under product 07 §Research and guided-operator work orders).
- Carry-in from WO-235's FINAL-001 escape (FUP-4c704bb1ea210f14,
  WO-235-D065): `scripts/lib/evidence-sources.mjs` still registers
  `scripts/lib/off-ramps.mjs` under `commonSources` although no registered
  source imports it after the direction ledger's removal; this order
  re-mints the editions `package.json` stales anyway, so it removes that
  stale declaration in the same re-mint, under a dated decision naming the
  cause, and runs `npm run evidence:artifact -- --check` and `npm test --
  --only evidence-sources` (reopen: a registered source imports
  `off-ramps.mjs` again).
- The kit's `README.client.md` is a kit file: an instance that edited its
  README keeps its bytes under the update's refusal rule and reads the new
  passages from `upstream/main` (reopen: the fork reports the refusal).

**Non-goals:** supporting Node 25 or 22; changing `.node-version`; adding
continuous integration; pinning `@types/node` to 24; changing what
`bootstrap.mjs` does; a per-row runtime field in the gate index; any change
to the starter's history or remote names.

**Operator-review assumptions:** that `24.15.0` is the floor because it is
the version the operator's other host runs today, and that a later 24.x on
that host is admitted by the caret range; that the operator wants the
recipe written into the kit README as given, with the redundant `git
config` line kept for symmetry with §Taking upstream updates; that one
recorded complete run under 24.15.0 is the evidence standard, since the
repository runs no CI.
