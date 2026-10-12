# WO-201 — The export runs core's suites: `npm test`, `npm run test:docs` and `npm test -- --review` run inside a kit that holds no package source, verifying the carried runtime by its manifest instead of building, and the client README says which suites run in a fork, which stay core's, where the instance's orders live and what editing a kit file means (v0.77.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. The runner gains a kit mode, the kit's
file set gains the compiled tests, the launchpad gains a `verify` form and
the client README's limits paragraph changes; core's own gates keep their
behavior. Assigned at activation under the standing opt-out default.
**Cost:** adds a kit mode to `scripts/test-runner.mjs` (the `build` task
replaced by a manifest verification task when the root holds
`KIT-MANIFEST.json` and `hasPackageSources` in `scripts/lib/paths.mjs` is
false; rows declared core-only listed by name and skipped), a `verify` form
in `scripts/launchpad.mjs`, the compiled tests `packages/<name>/dist/test/**`
and the fixtures they read in the kit's file set (the kit's byte growth is
measured by the fixture and recorded), one fixture case in
`scripts/test-launchpad.mjs` that runs the three gate selections inside one
export under the bounded wrapper, and the client README's §What runs here,
§Kit files and instance files and §Taking upstream updates rewritten.
Removes the kit's recorded limit (`npm test` fails at the build; WO-074
D007), the README paragraph that records it, and the state in which no order
in an instance can pass verification or final review on the instance's own
gate. Wall-clock: the `launchpad` gate task grows by one export plus three
gate runs inside it; that task's latest fresh row already read 123.776 s
against a 49.691 s thirty-day median (25 samples) at `plan conditions` on
2026-10-11T19:18Z after WO-078's two export cases, so the fixture reuses one
export for the three selections and records its own duration (criterion 1).
Re-mints: `scripts/test-runner.mjs`, `scripts/launchpad.mjs` and
`scripts/kit/README.client.md` are not registered evidence sources
(`scripts/lib/evidence-sources.mjs`), so no edition re-mints and no live
feedback episode; the runner and the launchpad are declared sources of
machinery suites, so `npm test -- --review` runs before handoff. Tokens and
context bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (a) of the
three-repository route dispatch (captured verbatim in ignored intake,
SHA-256 `d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`):
the reopening condition of FUP-8fb7ae17dd0fad5b (WO-074 D007, "WO-083's
fork needs core's suites in place") has occurred; WO-075 D011 names a fork's
own gate on the carried runtime as the `launchpad.starter` row's remaining
gate; the operator's client README sentences of items (i) and the ideation
of the same dispatch ride here because a planning branch refuses writes
outside `docs/` and root Markdown (WO-135) and a kit template is kit
content (product 07: a code or configuration change a pass identifies
becomes a work order). Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: the kit and the fixture export are public
artifacts; the README names no instance.
**Depends on:** WO-075 merged (closed, v0.72.0: the compiled runtime in the
kit); WO-077 merged (closed, v0.74.0: the update that carries this change
to an existing export); WO-078 merged (closed, v0.74.3: the receipt step
the export fixture runs through). No queued order.
**Recommended placement:** alone, directly after the WO-076/WO-200 pair and
before WO-202 (which runs the document gate inside an export and needs this
order's kit mode) and WO-118. This order edits `scripts/test-runner.mjs`
(WO-200, beside WO-076, also edits it, so this order follows that pair),
`scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`,
`scripts/kit/README.client.md`, `docs/LEGAL.md` and one clause of product
03. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-075",
    "relation": "satisfied-by-close",
    "reason": "the compiled runtime the kit carries and the suites run against"
  },
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "the update that carries the kit mode and the compiled tests to an existing export"
  },
  {
    "workOrderId": "WO-078",
    "relation": "satisfied-by-close",
    "reason": "the receipt step every export fixture now runs through"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (the kit-slice paragraph, whose last sentence this order
replaces); 07-execution-guide.md §Operator-opened planning pass (the
machinery-source rule for the final criterion) and §Discipline (the bounded
wrapper); `scripts/test-runner.mjs` (the `suites` table from line 601, the
`build` row at line 610, `needsBuild` at lines 2114 and 2208, the CLI
parsing from line 1995, `machinerySources` from line 108, `--list`);
`scripts/launchpad.mjs` (`KIT_FILES`, `RUNTIME_PACKAGES`, `RUNTIME_OUTPUT`,
`BUILD_INPUTS`, `readRuntime`, `prepareKit`, `readPriorManifest`, the CLI
block); `scripts/lib/paths.mjs` (`hasPackageSources`, line 352);
`scripts/kit/README.client.md` §What runs here, and what does not, §Kit
files and instance files and §Taking upstream updates;
`docs/evidence/WO-074/decisions.md` D007 and D011;
`docs/evidence/WO-075/decisions.md` D011; `scripts/test-launchpad.mjs` (the
WO-075 criterion 1 and 2 cases and the WO-074 criteria 1, 2 and 5 case as
the pattern); `docs/LEGAL.md` §Current state (the kit-runtime entry); the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§7 (the README sentences).

**Objective:** Inside an export, a kit without package source, `npm test`,
`npm run test:docs` and `npm test -- --review` run: the runner recognizes a
kit root, verifies the carried compiled runtime against `KIT-MANIFEST.json`
instead of building, runs every suite whose inputs the kit carries, prints
by name each suite the kit cannot run with the reason, and exits green when
the carried suites pass; the client README states which suites run in a
fork and which stay core's, where an instance's orders, evidence and reports
live, that the instance's first planning pass is its own, and that editing a
kit file chooses the true-fork path together with what every later update
does with that file.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- The kit carries `packages/<name>/dist/src/**` and the `scripts/` tree.
  `scripts/test-runner.mjs` declares `node("build", "scripts/build.mjs",
  { build: true })` and every selection whose rows carry `needsBuild` or
  `build` runs that task first (lines 2114 and 2208). `scripts/build.mjs`
  compiles TypeScript the kit omits, so the three selections fail at the
  build in an export (WO-074 D007; the client README §What runs here records
  it as a limit of the kit).
- The compiled tests live under `packages/<name>/dist/test/*.test.js`
  (`nodeTests` rows at lines 734 and 773). `RUNTIME_OUTPUT` is `dist/src`,
  so the kit carries none of them.
- `hasPackageSources(root)` (`scripts/lib/paths.mjs` line 352) already tells
  a kit from core; the export refuses to run from a kit by it (the
  `scripts/test-launchpad.mjs` case at line 1370).
- Some suites copy core documents into their fixtures (`docs/LEGAL.md`, the
  three license files, `docs/releases/tag-manifest.template.json`,
  `docs/control/budgets.json`: the 2026-10-11 standard pass's candidate 1),
  others read core's control history or publication editions; an instance
  holds these differently or not at all, and nothing declares which suites
  an instance can run.
- `gateCodeIdentity` (`packages/skeleton/src/gate-evidence.mjs` line 756)
  lists the revision's tree with `git ls-tree`; in a kit the tracked tree is
  the kit, so the identity rule needs no change (the executor confirms it in
  the fixture).
- FUP-e624167a7f6555f6 (WO-074 D011): `scripts/fixtures/wo138-local-role-qualification.json`
  carries a core verification report's verdict and durations; a suite that
  reads it inside a fork reads core's history.
- The latest fresh `launchpad` gate task read 123.776 s against its 49.691 s
  thirty-day median at `plan conditions` on 2026-10-11 (WO-197's task-growth
  rule, the row FUP-e96221b106cd136a's family reports), after WO-078 added
  the export-receipt and update cases.

**Design (scope discipline):**

- Kit mode is detected, never configured: `KIT-MANIFEST.json` at the root
  and `hasPackageSources(root) === false`. In kit mode the `build` row of
  the `suites` table is replaced by `kit-verify`, which runs
  `node scripts/launchpad.mjs verify`: every manifest-listed file under
  `packages/<name>/dist/` at its manifest hash, refusing by path on the first
  mismatch; other manifest-listed paths that differ are reported in one
  advisory line (`kit: <n> kit files differ from the manifest`) and never
  refuse, because an instance that edited a kit file has chosen the
  true-fork path and still gets its gates. `needsBuild` keeps its meaning:
  the row needs `dist/src`, which the verified kit carries.
- The kit carries the compiled tests and the fixtures they read, so core's
  suites run in a fork rather than a kit-only subset. The compiled tests are
  the project's own output under the same terms as the compiled runtime
  (`docs/LEGAL.md`, the kit-runtime entry WO-075 wrote).
- A suite row that reads a core-only input declares it: `kit: "core-only:
  <reason>"`. In kit mode such rows are not selected and the runner prints
  `kit: <suite> not carried (<reason>)` for each; `--list` shows the same
  set. A row without the declaration runs. The set is determined by running
  every suite in the fixture export, never by reading suite names.
- One export, three selections: the fixture exports once (the receipt step
  included), installs offline as the WO-074 criterion 1 case does, then runs
  the three selections under `node scripts/harness.mjs bounded`, asserts
  exit 0, the `kit-verify` row and the not-carried set, and records the
  durations.
- The README is written from the fixture's observed lists, not from a
  guess; the operator's three sentences of 2026-10-11 (orders and reports
  live in the instance; the first planning pass is its own; editing a kit
  file is the true-fork path) are drafted in the planning document §7 and
  landed here by criterion 5.
- **Declined alternatives, recorded:** a kit-only test runner (WO-074 D007
  declined it; it breaks the byte identity WO-074 criterion 1 requires);
  carrying package TypeScript source (the kit would then need the compiler
  toolchain and lose the compiled-runtime identity); skipping every
  `needsBuild` row in a kit (they need `dist/src`, which the kit carries); a
  configuration flag that says "this is a kit" (the manifest already says
  it); refusing the gates in a true-fork instance (the gates are what tells
  that instance what it broke).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/launchpad.mjs`: add the `verify` form (`launchpad verify [<dir>]`,
   default the current root) as `export function verifyKit(root)`: read the
   manifest with `readPriorManifest`, hash each listed file with `sha256Hex`,
   refuse by path on the first `packages/<name>/dist/` mismatch, count other
   mismatches into the advisory line, print `kit: <n> files verified at
   <commit>`. Extend the CLI block (line 1646 onward) and its usage string.
   Check: a case in `scripts/test-launchpad.mjs` runs `verify` on a fresh
   export (passes), after a one-byte change to a `dist/src` file (refuses,
   naming the path) and after an edit to a script (advisory, exit 0).
2. `scripts/launchpad.mjs`: carry the compiled tests. Beside `RUNTIME_OUTPUT`
   add `RUNTIME_TEST_OUTPUT = "dist/test"`; `readRuntime` (line 689) and the
   manifest list both; add the fixture directories the compiled tests read
   (list them from the imports under `packages/*/test/`; record the list in
   the decisions). `BUILD_INPUTS` already predicts the build at export time
   (`atomicBuild`); the prediction covers the tests. Check: the WO-075
   criterion 1 case (byte-identical rebuild, manifest-listed, no package
   source) extended to `dist/test`.
3. `scripts/test-runner.mjs`: add `const isKitRoot = (root) =>
   existsSync(join(root, "KIT-MANIFEST.json")) && !hasPackageSources(root)`
   (import from `./lib/paths.mjs`); in the `suites` table replace the `build`
   row in kit mode with `node("kit-verify", "scripts/launchpad.mjs",
   { args: ["verify"], build: true, fast: true, outputs: [] })`, so the two
   `table.find((row) => row.build)` sites (lines 2114 and 2208) select it
   without change. Check: `npm test -- --list` inside the fixture export
   shows `kit-verify` and no `build`.
4. `scripts/test-runner.mjs`: run every suite in the fixture export once and
   declare `kit: "core-only: <reason>"` on each row that fails for want of a
   core-only input (the candidates the gap names: the rows that copy
   `docs/LEGAL.md`, the license files, the tag-manifest template or
   `docs/control/budgets.json`, the rows that read core's control history,
   the publication rows that read `docs/publication/*-toc.md`, and the
   reader check whose scored releases' tag objects an instance never has;
   the fixture decides, not the list). In kit mode `selected` drops them and
   prints one `kit: <suite> not carried (<reason>)` line each. Check: the
   fixture asserts the printed set equals the declared set.
5. `scripts/test-launchpad.mjs`: new case "WO-201 criteria 1 to 3: the three
   gate selections run inside an export": export once, `npm ci --offline`
   as the existing case does, then `node scripts/harness.mjs bounded -- npm
   test`, `... npm run test:docs` and `... npm test -- --review` inside the
   export with the environment the WO-074 criteria 1, 2 and 5 case sets;
   assert exit 0, the `kit-verify` row first, the not-carried set, and that
   no `scripts/build.mjs` task ran; write the durations and the kit's byte
   growth to `docs/evidence/WO-201/gate-in-kit.json`. Check:
   `npm test -- --only launchpad`.
6. FUP-e624167a7f6555f6, decided by the fixture: the suite that reads
   `scripts/fixtures/wo138-local-role-qualification.json` either runs on it
   as admitted public kit data or is declared core-only with the fixture
   excluded from `KIT_FILES`; record which in
   `docs/evidence/WO-201/decisions.md` and in the README's list.
7. `scripts/kit/README.client.md`: rewrite §"## What runs here, and what does
   not" from the observed lists (the suites that run; the suites that stay
   core's, each with its reason; `kit-verify` in place of the build); add to
   §"## Kit files and instance files" and §"## Taking upstream updates" the
   sentences the planning document §7 drafted. The README is a kit template
   and travels manifest-listed; the WO-074 criterion 1 case re-hashes it.
8. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Platform and instance boundary": replace the sentence "Running core's
   suites in place still needs the TypeScript source the kit omits." with
   what runs in a kit, in place; `docs/LEGAL.md` §"## Current state": the
   kit-runtime entry gains the compiled tests under the same terms;
   `docs/planning/capability-table.md`: append `## WO-201 dated reassessment
   (<date>)` for `launchpad.starter` only from an observed passing gate in
   the fixture export; `docs/evidence/WO-201/decisions.md`;
   `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-201/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the `verify` form; the compiled tests in the kit; the
runner's kit mode and core-only declarations; the fixture case and its
recorded durations; the README; the write-backs below.

**Acceptance criteria (all required)**

1. In a fixture export with no package source, `npm test`, `npm run
   test:docs` and `npm test -- --review` each exit 0 under the bounded
   wrapper; the first task of each is `kit-verify`, which passes on the
   fresh export and refuses naming the path after a one-byte change to a
   manifest-listed file under `packages/<name>/dist/`; no `scripts/build.mjs`
   task runs; the durations are recorded in `docs/evidence/WO-201/gate-in-kit.json`.
2. Every suite that runs in core runs in the export except the rows declared
   `kit: "core-only: <reason>"`; the runner prints each declared row as not
   carried with its reason, `--list` shows the same set, the fixture asserts
   the printed set equals the declared set, and a row without the
   declaration runs.
3. The kit carries the compiled tests and the fixtures they read,
   manifest-listed and byte-identical to a rebuild at the commit (the WO-075
   criterion 1 case extended); the kit's byte growth is recorded in the
   decisions.
4. `launchpad verify` exists as a command form, passes inside a fresh export,
   refuses a `dist/` mismatch by path, and reports a differing script in one
   advisory line without refusing; the fixture covers the three cases.
5. The client README's §What runs here, and what does not states which
   suites run in a fork and which stay core's with the reason, from the
   fixture's observed lists; §Kit files and instance files states where the
   instance's orders, evidence, verification and final-review reports live
   and that the instance's first planning pass is its own; §Taking upstream
   updates states that editing a kit file is choosing the true-fork path and
   what every later update and `launchpad verify` do with that file; the
   sentences are those the 2026-10-11 route planning document §7 drafted,
   and the README travels manifest-listed.
6. Write-backs land, each in place with no dated paragraph: product 03
   §Platform and instance boundary (the sentence on running the suites in a
   kit); `docs/LEGAL.md` §Current state (the compiled tests under the same
   terms); the capability table's `launchpad.starter` reassessment, only
   from an observed passing gate; the decisions file, with
   FUP-e624167a7f6555f6's decision recorded; the publication locks
   refreshed. No byte figure binds these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture's recorded gate rows inside the export;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(the runner and the launchpad are declared machinery sources) and again at
final review.

**Write-back duty:** as listed in criteria 5 and 6.

**Known issues and carry-ins:**

- FUP-8fb7ae17dd0fad5b (WO-074 D007) is allocated here: its reopening
  condition occurred by the operator's direction of 2026-10-11.
- FUP-e624167a7f6555f6 (WO-074 D011) is allocated here and decided by step 6.
- The `launchpad` gate task's growth (FUP-b531e850b70f6d4e; 123.776 s
  against a 49.691 s median on 2026-10-11) is this order's watch: the fixture reuses one export for the
  three selections and records its duration; a task above twice its median
  at handoff is recorded in the decisions with its cause, never trimmed by
  dropping a selection.
- The client README sentences for item (i) and the ideation of the
  2026-10-11 dispatch ride here because a planning branch refuses writes
  outside `docs/` and root Markdown (WO-135) and a kit template is kit
  content; the planning document §7 holds the drafted text.

**Non-goals:** a gate identity that differs between core and a kit; a
kit-only runner; carrying package TypeScript source; the planning commands
inside an instance (WO-202); the update's preview and rollback (WO-203,
WO-207); emulating core's history or publication editions inside an
instance (such suites are declared core-only).

**Operator-review assumptions**

1. The compiled tests travel in the kit under the same terms as the
   compiled runtime, as `docs/LEGAL.md`'s kit-runtime entry records.
2. A suite that needs a core document or record the instance lacks stays
   core's rather than being emulated, and the README names it.
