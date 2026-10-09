# WO-075 — Kit runtime and harness bundle in the export: the launchpad export carries a pinned, byte-identical runtime build and the Contributor build's compiled bundle whose hooks import that runtime, verified by `harness check` inside the export (v0.72.0)

**Model:** any capable model; the executor runs the recorded smoke in the
actual harness. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. The export gains the build; no runtime
package capability change. Assigned at activation under the standing opt-out
default.
**Cost:** adds to the export the compiled output the kit's scripts, hooks
and `harness` command import, with its manifest entries and a rebuild
comparison, the Contributor bundle emitted inside the export, the smoke
record, fixtures, at most 300 bytes in product 03, an observation in
`docs/LEGAL.md` and a capability-table section; it edits
`scripts/launchpad.mjs`. Removes the build-less kit: without the build no
generated hook governs a session opened in an export. WO-076, WO-077,
WO-078, WO-082 and WO-118 depend on it. Re-mints: none expected, since the
bundle is the existing Contributor emit and no registered source changes.
If the executor takes up the carry-in FUP-a058e82c0bbd9b6d, each edition
that the registered sources it edits stale is re-minted deterministically
(among them `packages/skeleton/src/gate-evidence.mjs`,
`packages/skeleton/src/writer-teardown.mjs`,
`packages/compiler/src/codex-continuation.mjs` and
`scripts/harness-context.mjs`), and
`packages/skeleton/src/usage-observation.mjs`, which the feedback verifier
judges, owes one live feedback episode, which the executor runs on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, with no
authorization. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-033 phase 3 (the build half: "the export
carries the build"), cut into a bounded child at the operator's 2026-09-08
correction. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition. Amended by the 2026-09-28 planning
pass, which re-observed the order on `main` at `5f3849ec`: the bundle keeps
the Contributor emit's relative snapshot import, since WO-049's import root
is absolute and target-only, the runtime travels where the kit's scripts
read it, the smoke is the executor's, and the register's and the map's
carry-ins are written in
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-074 merged (the kit the runtime and bundle are placed
in); WO-042 merged (grants with provenance in the exported bundle; closed,
v0.16.0). WO-049 (closed, v0.25.0) is a reference only: its import root is
absolute and admitted for target-worker profiles alone, so this order does
not reuse it.
**Recommended placement:** in the serial run after WO-074 and before
WO-072. This order edits `scripts/launchpad.mjs`, product 03,
`docs/LEGAL.md` and `docs/planning/capability-table.md`; WO-077 and WO-078
edit `scripts/launchpad.mjs` after it, and WO-074 before it writes the same
product 03 section and `docs/LEGAL.md`. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the kit the runtime and bundle are placed in"
  },
  {
    "workOrderId": "WO-049",
    "relation": "reference-only",
    "reason": "the target import root, absolute and target-only, which this order does not reuse"
  },
  {
    "workOrderId": "WO-042",
    "relation": "hard",
    "reason": "grants with provenance in the exported bundle"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Harness compiler v1;
03-architecture.md §Agent enablement skills and §Platform and instance
boundary; `docs/LEGAL.md` §Decision — 2026-09-06 (the runtime build travels
under the decided terms) and §Decision gates; `scripts/lib/harness.mjs`
(`harnessInstallation`: the pinned runtime files and the content-addressed
snapshot); `packages/compiler/src/harness.ts` (the import-root and snapshot
validation); `docs/work-orders/WO-049-target-worktree-bundle.md`
(`importRoot`; the Contributor emit keeps relative imports);
`scripts/lib/process-budget.mjs` (cold-start bytes per role);
`scripts/test-runner.mjs` (`classifySuite`), `scripts/harness-entry.mjs`
and `scripts/bootstrap.mjs` (each builds first);
`docs/evidence/WO-070/decisions.md` D009 and register row
FUP-a058e82c0bbd9b6d in `docs/planning/followups.json`;
`docs/evidence/WO-069/decisions.md` D002; 07-execution-guide.md
§Discipline (outside-project write grants) and §Operator-opened planning
pass (what a judged-source edit owes); `docs/planning/capability-table.md`;
`docs/work-orders/WO-033-compiled-starter-export.md`, as history only (the
Design bullets led "Phase 3 — launchpad export carries the build." and
"License files at export.").

**Objective:** The export carries the unminified compiled output the kit's
scripts, the generated hooks and the `harness` command import, at the paths
core's scripts read (`packages/<name>/dist/`), byte-identical to core's
build at the named commit and manifest-listed, with no npm publication and
no package source; the Contributor build's compiled bundle for the kit's
Contributor profiles (settings, hooks, role skills, the marked block),
whose hooks import the content-addressed runtime snapshot by relative path
as core's do; `node scripts/harness.mjs check` passing inside the export;
and a recorded smoke in which a session opened in the export is refused a
denied effect by a generated hook and resolves a role skill by resume
phrase.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No export exists to carry a build: WO-074 is open.
- The compiler admits an import root only for a target-worker profile and
  only as an absolute path, and a target-worker profile has PreToolUse
  guards and no skills (`packages/compiler/src/harness.ts`). The
  Contributor bundle's hooks already import the runtime snapshot by
  relative path (`../../.runtime/harness/<hash>/...`), and the compiler
  admits a snapshot only at `.runtime/harness/<16 hex>`, which Git ignores.
- `harnessInstallation` hashes forty compiled files of the compiler and the
  skeleton from `packages/<name>/dist/` (`scripts/lib/harness.mjs`), the
  paths the kit's scripts import; the executor re-counts them at its base.
- Core's runner classifies `harness` as a document suite, which plain
  `npm test` does not select; `npm test`, `npm run test:docs`,
  `npm run harness` and `scripts/bootstrap.mjs` each build the TypeScript
  packages first.
- The checked context measure is cold-start bytes per role (the installed
  `CLAUDE.md` plus the role skill), with ceilings in
  `docs/control/budgets.json`; WO-039's directed-load comparison survives
  in `scripts/harness-context.mjs` against a pinned base.
- `docs/LEGAL.md` says a `THIRD_PARTY_NOTICES` file becomes due when a
  built or bundled artifact is distributed, and its gates keep that open.

**Design (scope discipline):**

- The build is copied from `packages/*/dist` at the named commit to the same
  paths and hashed; a fixture rebuilds and compares.
- The bundle is the Contributor emit as built: `node scripts/harness.mjs
  emit` inside the export installs the snapshot from the copied build, and
  its hooks import it by relative path, so they carry no absolute path. The
  compiler's import-root and snapshot validation do not change.
- The check runs as `node scripts/harness.mjs check`: `npm run harness`,
  `npm test` and `npm run test:docs` build the packages first, which a kit
  without package source cannot do, and core classifies `harness` as a
  document suite (WO-074's operator-review assumption 2 holds the in-place
  suite question).
- Cold-start bytes per role are measured inside the export by the rule
  `scripts/lib/process-budget.mjs` applies and reported beside core's.
- The runtime build travels under the decided Apache-2.0 terms with the
  `NOTICE`, as `docs/LEGAL.md` §Decision — 2026-09-06 decides for the kit.
- Carried in from register row FUP-a058e82c0bbd9b6d (WO-070-D009, allocated
  2026-09-27): one module identity for the build-free modules
  `gate-evidence`, `usage-observation`, `writer-teardown` and
  `codex-continuation`, with the packages' ignored local lane following the
  launchpad configuration; an explicit tool root for kit inputs in
  `harness-context`, `harness-probe`, `probe-codex-effort` and
  `harness-live-smoke`, whose outputs keep the launchpad; fixture names in
  `copilot-qualification` and `harness-live-smoke` computed against the
  fixture root; checked under a `DOTLN_LAUNCHPAD` that is not the scripts'
  checkout and a configuration with non-default roots. Priority low;
  criterion 5 records whether this order takes it up.
- Carried in from the map's row (WO-144, 2026-09-19): a destination outside
  the roots the role is granted needs an operator-named absolute root on
  the executing role or an equipped support, since order contracts do not
  yet supply grants. The fixtures write under the system temporary root,
  which the default roles' grants cover; the executor runs the smoke,
  launching the actual harness in the export as
  `scripts/harness-live-smoke.mjs` launches it in core.
- WO-069-D002 reopens if the vendored kit needs a launchpad that neither
  the ascent nor `DOTLN_LAUNCHPAD` can name; the executor records it.
- **Declined alternatives, recorded:** publishing packages; minified output
  (reviewable compiled output is the point); a `kit/runtime/` location (the
  byte-identical scripts import `packages/<name>/dist/` and the compiler
  refuses another snapshot location; reopen with an order that relocates
  both); WO-049's absolute import root for the Contributor bundle (the
  compiler refuses it; reopen if a fork's hooks must import a runtime
  outside the fork).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; steps 1 to 5 are written against WO-074's `scripts/launchpad.mjs` and are re-read at the base):**

1. `scripts/launchpad.mjs`: add `RUNTIME_PACKAGES = ["kernel", "compiler", "skeleton"]`
   and `copyRuntime(root, destination)` copying `packages/<name>/dist/src/**` and each
   `packages/<name>/package.json`, never `dist/test` or `*.tsbuildinfo`. This is the hook
   closure `scripts/harness-live-smoke.mjs` lines 86 to 110 build a working runtime from.
   Refuse when `git status --porcelain -- packages tsconfig.json package.json package-lock.json`
   is non-empty, then call `atomicBuild()` (`scripts/build.mjs`) so the copy is the commit's
   build. A kit script whose import closure needs `packages/console` or
   `packages/browser-evidence` is left out of `KIT_FILES` and named in the decisions; the
   criteria judge the hook closure and the `resume` and `harness` commands.
2. Same file: add each runtime file to the manifest `files` with its sha256; extend
   `kitLockfile` with `packages/kernel`, `packages/compiler`, `packages/skeleton` and their
   `node_modules/@dotln/<name>` links (skeleton pins typescript at core's version).
3. `scripts/kit/gitignore.template` (WO-074): must not ignore `packages/*/dist/` or
   `*.tsbuildinfo` under packages, so a starter can commit its runtime; keep `/.runtime/`
   ignored.
4. Same file: after writing, spawn `node scripts/harness.mjs emit` with cwd = the export
   and `DOTLN_LAUNCHPAD` unset; list the emitted surfaces (the entries of core's
   `.claude/harness-manifest.json`) in the manifest. A fresh clone lacks the ignored
   `.runtime/harness/<hash>` snapshot and hooks report `snapshot-missing`
   (`packages/compiler/src/harness.ts` lines 710 to 721), so `README.client.md` says to run
   `node scripts/harness.mjs emit` after cloning.
5. `scripts/test-launchpad.mjs`, new cases: the runtime matches a rebuild at the named
   commit (clone, `npm ci --offline`, `node scripts/build.mjs`, `cmp` each manifest-listed
   dist file); `harness check` passes in the export and refuses a one-byte drift; no
   manifest-listed hook has an absolute import specifier (search `import("/` and
   `from "/`); no `packages/*/src/**/*.ts` in the export. Check: `npm test -- --only launchpad`.
6. Cold start: `measureColdStarts(exportRoot)` and `measureColdStarts(TOOL_ROOT)`
   (`scripts/lib/process-budget.mjs` line 87); assert no role's export bytes exceed core's;
   write `docs/evidence/WO-075/cold-start.json`.
7. The smoke, run by the executor: in a committed Git copy of the export,
   `DOTLN_LIVE_HARNESS=1 node scripts/harness-live-smoke.mjs executor 001` with cwd = the
   export. The script requires cwd to be the launchpad and a Git top level (lines 34 to 42),
   opens the session in a scratch repository built from the export's scripts and dist
   (lines 68 to 110) and writes `WO-042/harness-live/executor-001.json` under the export's
   evidence root (lines 59 to 63); copy it, identifiers as shapes, to
   `docs/evidence/WO-075/`. That is the session the criteria mean (2026-10-07 pass).
8. FUP-a058e82c0bbd9b6d: record taken up or deferred in `docs/evidence/WO-075/decisions.md`.
   Taken up, it edits `packages/skeleton/src/usage-observation.mjs`, a feedback-judged file,
   and owes the live feedback episode the Cost line names.
9. Write-backs: `docs/product/03-architecture.md` §"## Platform and instance boundary" (the
   build travels with the kit, in place); `docs/LEGAL.md` §"## Current state" (dated
   observation: the runtime build travels under the decided terms, and assumption 2's
   THIRD_PARTY_NOTICES reading); `docs/planning/capability-table.md`: a new
   `## WO-075 dated addition (<date>)` section with the header
   `| Capability and scope | Current assessment | Evidence and remaining gate |` and a
   `launchpad.starter` row; `node scripts/check-publication.mjs --print-locks` into
   `docs/publication/audience-status-index.md`; `npm run publication:check`.
10. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-075/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the runtime copy and its manifest entries, the exported
bundle, the smoke record, the carry-in's disposition, the write-backs below.

**Acceptance criteria (all required)**

1. The exported runtime is byte-identical to core's build at the named
   commit (rebuild and `cmp`), sits at the paths the kit's scripts import,
   is manifest-listed, and contains no package source.
2. `node scripts/harness.mjs check` passes inside the export and refuses a
   one-byte drift in an emitted surface; no hook the manifest lists holds an
   absolute path in an import specifier.
3. The executor's recorded smoke shows a session the actual harness opens
   in the export refused a denied effect by a generated hook and resolving
   a role skill by resume phrase, with identifiers reduced to shapes.
4. The cold-start bytes of each role inside the export (its `CLAUDE.md`
   plus the role skill) are reported beside core's at the export's commit
   and are not larger for any role.
5. The decisions file disposes of FUP-a058e82c0bbd9b6d: taken up here, with
   its checks under a `DOTLN_LAUNCHPAD` that is not the scripts' checkout,
   or deferred with its reason. If this order edits
   `packages/skeleton/src/usage-observation.mjs`, the executor runs one
   live feedback episode after that edit on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, and the decisions record the
   configuration.
6. Write-backs land: 03 §Platform and instance boundary (the build travels
   with the kit), in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth, and an overrun is an advisory the next pass reads); WO-074, WO-073 and WO-193 also write product
   03. `docs/LEGAL.md` §Current
   state (a dated observation, that section's form: the runtime build
   travels under the decided terms); `docs/planning/capability-table.md` (a
   `WO-075 dated addition` section with a `launchpad.starter` row at its
   evidenced level, the table's form); the decisions file; the publication
   locks refreshed.
7. The re-mints the Cost line names are recorded; `npm test -- --review`
   and `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the fixture transcripts; the smoke record; the
cold-start comparison; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/launchpad.mjs` is a declared source of configuration-root, and
again at final review. The executor's smoke is the live row this order
owes, with a live feedback row only if criterion 5 edits
`usage-observation.mjs`.

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected above: product 03 headroom and its
  co-writer list; `scripts/copilot-qualification.mjs` in the Cost line is
  `scripts/lib/copilot-qualification.mjs`.
- Decided by the 2026-10-07 pass: the runtime subset is the hook closure
  (kernel, compiler, skeleton `dist/src`); the live smoke's scratch
  repository built from the export is the session the criteria mean.
  Reopen: a kit command fails on a missing package.
- Blocked on WO-074 for the export function, the manifest schema, the
  template directory and the fixture file; the executor re-reads them at
  the base before step 1.

**Non-goals:** the overlay (WO-076); update (WO-077); package publication;
wiring `harness check` into the export's `npm test` (WO-074's
operator-review assumption 2); a new import-root mechanism.

**Operator-review assumptions**

1. Compiled output under the decided license is reviewable distribution;
   package source stays out.
2. `docs/LEGAL.md` makes a `THIRD_PARTY_NOTICES` file due when a built or
   bundled artifact is distributed. This order copies only the project's
   own compiled output, which bundles no third-party file (dependencies
   install from the registry), so it writes no notices file and its
   LEGAL.md observation records that reading; an export that copies a
   third-party file reopens it.
3. The export's check runs as `node scripts/harness.mjs check`, not inside
   the export's `npm test` as first drafted, because core classifies
   `harness` as a document suite and builds before it runs.
