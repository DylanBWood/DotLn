# WO-207 — Instance update control: an instance takes kit machinery with its build pinned or followed, keeps its own code at a manifest-excluded extension root that the kit's machinery loads through the SourceAdapter port and no update touches, rolls back its last update to the prior kit state, and takes a starter update only through an upgrade order its own planning pass cuts, gated by kit conformance and its own declared suites (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. An `extensions` configuration section, a
loader and a `source` selector on vertical issues (the GitHub issue source
stays the default); a kit manifest at schema 2 partitioning build from
machinery (schema 1 still read), an update channel whose default `both` is
today's behavior, and a `build.pin` that `harness emit` and `check` honor;
an instance-owned update log, retained copies in the ignored local lane and
a `rollback` form; a carried upgrade-order template; a `suites`
configuration section and, in an exported instance only, a kit identity
under which `npm test` reuses the carried kit suites (core's own gate is
unchanged). The update keeps its shape, except that it refuses before any
write when its rollback record cannot be written. Assigned at activation
under the standing opt-out default.
**Cost:** adds the update log, retained copies and `rollback` form in
`scripts/launchpad.mjs`; the manifest's build partition, the update
channel, the compatibility guard and `build --pin|--take` there, with
`build.pin` in `scripts/lib/config.mjs` and the pinned emit and check in
`scripts/lib/harness.mjs`; the `extensions` section, a loader
`scripts/lib/extensions.mjs` (new) and the `source` selector in
`scripts/lib/vertical-runtime.mjs`; fixture adapters; the `suites` section,
`scripts/lib/kit-gate.mjs` (new), a kit-identity lookup in
`scripts/lib/gate-reuse.mjs` and the kit branch of `scripts/test-runner.mjs`;
`verifyKit` honoring a declared pin; the upgrade-order template
`scripts/kit/upgrade-order.template.md` (new); cases in seven test files
across six suites; the kit's example configuration and client README.
Removes the states the record names: Git archaeology by hand as the only
way back from an update (the operator, 2026-10-11, for the work instance); a
prose-only `SourceAdapter` port whose only adapter lives in core, with
nowhere an instance's own code loads from (FUP-3e22cf6f99f02005); compiled
definitions that arrive with every machinery update; the hand-run upgrade
the client README directs (fetch, merge, re-emit, refusals resolved by hand,
then a commit), which the operator's 2026-10-13 no-commits direction retires
(planning document §12.1); a rerun of every carried kit suite after each
instance-only change (an inference from the whole-identity key; a fresh kit
`npm test` took 41.7 s in the WO-201 export fixture, planning document
§12.7). The merge removes two order cycles
(two activations, verifications, final reviews and release closes, each
with its full gate runs; planning document §12 records 2.29 full runs and
61 minutes of full gate per closed order since receipt 044, and phase
medians of 16.9 minutes for verification and 24.8 for final review); no
live feedback episode collapses, since no part owed one. Wall-clock: each
update gains one copy per replaced or removed file whose bytes change, a
log row (both measured by the fixture) and a plan partition; a rollback
costs its restores; a vertical start pays one dynamic import per declared
`source` adapter; the emit's cost is unchanged; in an exported instance a
gate after an instance-only change runs `kit-verify`, `format` and the
selected instance suites instead of every carried suite, while core's gate
is unchanged; the `launchpad` suite gains one export case that runs the
kit's `npm test` twice (a real fork's gate duration is unrecorded). Commands:
adds `rollback`, `export --update <dir> --rollback`, `--channel`,
`build --pin|--take` and, in an instance, `npm test -- --only <declared
suite>`; one `npm test -- --review` before handoff and one at final review
in place of three of each, after targeted `--only` runs. Context bytes: one
order at cold start in place of three (this file, about 72,000 bytes,
against the parts' 59,550; it carries the fork's update route and gate,
which no part held). Tokens: unknown until run. Steps: 23 in place of the
parts' 27. Re-mints:
`scripts/lib/harness.mjs` is a registered source of the authority and
harness editions (`scripts/lib/evidence-sources.mjs` lines 176 and 343; a
build-only exclusion for the other three, lines 384 to 392), which are
re-minted deterministically; `config.mjs` is a reasoned import exclusion
(line 369); `launchpad.mjs`, `vertical-runtime.mjs` and the new loader are
not registered. No feedback-judged file changes unless step 4's recorded
decision adds the load record's type to `residentEventTypes` in
`packages/skeleton/src/resident-state.ts` (`FEEDBACK_SOURCE_PATHS`,
`feedback-audit.ts` line 33; a common source of every edition,
`evidence-sources.mjs` line 65): that edit adds every edition's re-mint,
the feedback re-mint and one live feedback self-host episode. The gate
tiers owe no re-mint: `scripts/test-runner.mjs`, `scripts/lib/gate-reuse.mjs`
and the new `scripts/lib/kit-gate.mjs` are not registered evidence sources,
and the kit identity lives outside `packages/skeleton/src/gate-evidence.mjs`,
a common source of every edition (`evidence-sources.mjs` line 57), which
this order leaves unedited. The launchpad, the kit templates and the
harness library are declared machinery sources (`scripts/test-runner.mjs`
lines 114, 115 and 213), and the runner and its reuse lookup are
`runner-fixtures` sources, so `npm test -- --review` runs before handoff.
**Nomination provenance:** the rollback: operator direction of 2026-10-11,
item (d), second half, of the three-repository route dispatch (ignored
capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`), and
the operator's answer 5 in the conversation-only session the same day
(ignored capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`), asking
for a way to undo an update, needed for the work instance; amended by the
2026-10-13 standard pass at `6dbd8771`
([planning document](../planning/standard-pass-2026-10-13.md) §6) after
WO-203 landed (anchors restated, the fork's merge route given its rollback
source, two update-path items carried). The extension point: item (g) of
the same dispatch and the operator's tenth message in that session (the
work fork will carry its own functionality, an enterprise-tracker import
and the v1 integration among it, while base machinery still arrives as an
update), the request FUP-3e22cf6f99f02005 (the 2026-10-02 candidate for an
instance-owned source adapter's port) waited for; re-observed by the
2026-10-13 pass on its catalog row. The build channel: item (h) of the same
dispatch (the planner chooses between the Contributor loadout as a
definition pack and a pinned build; the personal instance defaults to both
channels; the work instance decides per update), with the same session
locating the build in `contributor.ts` and finding no channel; the planner
chose the pinned build and recorded the definition pack as a candidate
(FUP-d2897b117391bb26); amended by the 2026-10-13 pass at `6dbd8771` (§6)
after WO-076 widened the boundary (gap and imports restated, the guard's
minor-version and import comparison, the channel under `build: none`, one
revision-preview item carried). The fork's way in and its gate: the
operator's 2026-10-13 directions during the standard pass that the fork
opts into a starter update through a dedicated planning pass, or part of
one, which cuts the upgrade order, and that the operator makes no commits
of their own (planning document §12.1); the two gate tiers are the
planner's proposal from that pass's read-only gate research (§12.7), not
an operator decision (assumption 8). WO-207, WO-208 and WO-209 were merged into
WO-207 by the 2026-10-13 standard planning pass under the operator's sizing
direction (planning document §12). Planner-synthesized. Opaque identifier,
not a priority. Clean-room screen: fixture instances are scratch
artifacts; the work instance is named only as such; the enterprise tracker
only by the generic term, with no adapter for it written or described; the
fixture adapter reads a local JSON file.
**Depends on:** WO-203 (hard: the update's planning and applying halves,
which the rollback reuses and the channel partitions, and the renderer
both print through; closed v0.79.0); WO-076 (hard: the instance-owned,
manifest-excluded convention the extension root follows, and the overlay
that composes over the pinned build; closed v0.76.0); WO-077 (closed,
v0.74.0: the update), WO-112 (closed: the vertical's intake and fetch seam)
and WO-060 (closed: `decodeSourceBundle`) merged. WO-215 (core's release
close pushes each release into the starter) is no dependency: the upgrade
order takes whichever starter revision its planning pass names, however
that revision reached the starter.
**Recommended placement:** position 8 of the serial queue (the operator
keeps core's next thirty orders serial; planning document §12.4), after
WO-083 and before WO-193: the operator placed the update's rollback after
the first real run in the 2026-10-11 route direction, and WO-083 is that
run. WO-210, earlier in the queue, edits `scripts/launchpad.mjs` and the
client README first; this order rebases on it. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-203",
    "relation": "hard",
    "reason": "the update's planning and applying halves the rollback reuses and the channel partitions, and the renderer both print through"
  },
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance-owned, manifest-excluded convention the extension root follows, and the overlay that composes over the pinned build; both change harness emit"
  },
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "the update this order undoes and partitions into channels"
  },
  {
    "workOrderId": "WO-112",
    "relation": "satisfied-by-close",
    "reason": "the vertical's intake and the fetch seam the adapter plugs into"
  },
  {
    "workOrderId": "WO-060",
    "relation": "satisfied-by-close",
    "reason": "decodeSourceBundle, the port's input contract every adapter's output passes through"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (kit, instance and overlay sets; what DotLn exports is a build;
the update), §Package ecosystem and marketplaces (definition and
integration packs; the executable-code review burden; "Distribution never
implies activation"; updates create new versions and a semantic diff) and
§Ports (`SourceAdapter`, `decodeSourceBundle`, the declared screen);
12-workstream-application.md §Arriving at the desk (the constrained managed
host; the work instance) and §One workstream across repositories (the
update loop); 07-execution-guide.md §Preflight before the full gate;
`docs/decisions/0002-kernel-first-agentic-core.md` §Decision, item 2;
`docs/work-orders/WO-076-instance-build-overlay.md` (the overlay's
composition); `scripts/launchpad.mjs` (`kitManifest`, `KIT_FILES`,
`kitPath`, `readPriorManifest`, `planUpdate` and its `instance-owned
collision` rule, `planInstanceActions`, `readKitActions` and the three
action kinds with their refusals, `planKitUpdate`, `applyKitUpdate`,
`updateKit`, `KIT_MANIFEST_PENDING`, `previewFromRevision`,
`renderUpdatePlan`, `writeReplacement`); `scripts/test-launchpad.mjs`
(the update case at line 2112); `scripts/lib/config.mjs`
(`SECTION_KEYS`, `BUILD_KEYS`, `validateBuild` as the model,
`resolveRoots`, `docRelative`); `scripts/lib/harness.mjs`
(`harnessInstallation`, the definition imports, `decodeBuildOverlay`,
`runtimeFiles`, `runtimeSnapshot`, the manifest's `origin.semanticHash`
and `compilerPackageVersion`, `preserveHarnessRuntime`, `checkHarness`);
`scripts/lib/vertical-runtime.mjs` (`readVerticalConfiguration`,
`referencesIssue`, `prepare()` and its fetch seam,
`requireCompleteIssueBundle`); `packages/skeleton/src/github-issue-source.ts`
(`fetchIssueBundle`, `IssueBundleResult`, `IssueSourceRefusal`);
`packages/compiler/src/source-bundle.ts` (`SourceBundle`,
`decodeSourceBundle`);
`packages/skeleton/src/resident-state.ts` (`residentEventTypes`);
`packages/skeleton/src/loadouts/contributor.ts` and `feedback.ts`;
`.claude/harness-manifest.json` (`origin`, `compilerPackageVersion`);
`scripts/kit/README.client.md` §First steps, §Planning in this instance,
§What runs here, and what does not, §Taking upstream updates, §Kit files
and instance files and §Opting in to instance actions;
`scripts/kit/dotln.config.example.json`; `scripts/kit/gitignore.template`;
`scripts/kit/first-order.template.md` (the carried order template this
order's template follows); `scripts/launchpad.mjs` `verifyKit` and
`KIT_FILES` (the `scripts` tree travels whole); `scripts/test-runner.mjs`
(`isKitRoot`, `changedMachinery`, `machinerySources`, the kit branch and
the reuse block after it); `scripts/lib/gate-reuse.mjs` (`identityRows`,
`coveringTaskResults`); `packages/skeleton/src/gate-evidence.mjs`
(`gateCodeIdentity`, read, not edited); `scripts/lib/config.mjs`
`validateKit`; `docs/evidence/WO-201/gate-in-kit.json` (the kit's three
gate selections); 07-execution-guide.md §Operator-opened planning pass
(the planning branch's write boundary, WO-135) and §Where the control plane
finds its documents (the configuration sections); the
[2026-10-13 planning document](../planning/standard-pass-2026-10-13.md)
§12.1 (the no-commits rule; the fork's opt-in) and §12.7 (the gate
research and the open overlay question); the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5 and §12 (its readings of receipt 044 for this order's next amendment).

**Objective:** An instance controls the kit updates it takes, from core and
inside the instance:

- **Its own code.** `dotln.config.json` may declare `extensions`: a root
  outside every kit tree (default `extensions/`) and adapters by kind
  (`source`, `effect`, `projection`). A vertical issue naming
  `source: "<id>"` has `prepare()` load that adapter, record
  `ExtensionLoaded { id, kind, path, sha256 }` and call its `fetchBundle`
  in place of `fetchIssueBundle`, with the bundle passing the same checks
  as the GitHub source's; `effect` and `projection` adapters are admitted
  and listed, never imported here. No export, manifest or update touches
  the root; the README states the review burden. The first consumer is a
  fixture adapter; the enterprise-tracker adapter is the work instance's.
- **Its build.** The kit manifest names its build (the compiled definition
  modules, their semantic hash and compiler version). An update takes
  `both` (today's), `machinery` (build modules kept at their pinned bytes,
  `build.pin` recorded, emit, check and `kit-verify` honoring it) or `build`
  (the build alone, then the re-emit), and refuses an incompatible pairing
  before any write; inside an instance, the upgrade order runs
  `build --pin` or `build --take` after its merge, as the channel the
  operator chose. WO-076's overlay composes over whichever build is pinned.
- **Its way back.** Each update logs what it did and keeps retained copies,
  refusing before any write when it cannot. `rollback` inside the instance,
  or `export --update <dir> --rollback` from core, returns the kit files
  and manifest to the logged state before the last update, reverses the
  reversible instance actions (the update's `build.pin` among them), lists
  the rest by id, logs itself and prints the re-emit, which the role that
  ran it runs next; it refuses, naming the path or row, after a later kit
  edit, when the update is not the latest, or when a prior file has no
  verified source.
- **Its way in.** An instance takes a starter update only through an
  upgrade order that a planning pass (dedicated, or part of one) cuts from
  the kit's template. A planning branch writes only `docs/` and root
  Markdown (WO-135), so the pass never applies kit files. The order
  previews the update (WO-203), merges the named starter revision, runs the
  channel's `build` form, re-emits the build and passes the kit
  conformance tier; the template's rollback form takes the way back the
  same way.
- **Its gate (the planner's proposal, assumption 8).** Kit conformance:
  `kit-verify` on every gate, and the carried kit suites once per kit
  identity, a hash over the manifest-listed paths (and, while the overlay
  question stays open, the overlay file). The instance's own
  additions: suites it declares in `dotln.config.json` `suites` (name,
  command and sources), selected by changed sources, with each extension
  adapter naming the suite that covers it. Core's own gate is unchanged.
- **No step is the operator's by hand.** The operator gives the word (the
  starter revision, the channel, how each refused path resolves, a
  rollback), types the dispatch phrases and merges the pull request; a
  role runs every command and makes every commit (operator direction,
  2026-10-13; planning document §12.1).

**Observed gap (restated 2026-10-13 at `main` `6dbd8771`; dated 2026-10-11
at `82b7fdb7`):**

*The way back (restated 2026-10-13 at `main` `6dbd8771`; dated 2026-10-11
at `82b7fdb7`):*

- WO-203 split the update into `planKitUpdate` (`scripts/launchpad.mjs`
  line 1695) and `applyKitUpdate` (line 1801), with `updateKit` (line 1861)
  a wrapper and `renderUpdatePlan` (line 1950) the shared renderer; the
  `KIT-MANIFEST.pending.json` journal (lines 1813 to 1833) serves an
  interrupted run's retry, not an undo, and the prior manifest is gone once
  the new one is written.
- Replaced files are overwritten through `writeReplacement` (line 1504);
  nothing keeps their prior bytes or records which commit held them, and
  an update taken on an uncommitted tree has no committed prior.
- Instance actions move roots, add configuration fields and change phrases
  (`planInstanceActions`, line 1519); nothing records how to reverse each.
- The client README's §Taking upstream updates (from line 331) ends with
  the true-fork paragraph and WO-203's in-instance route (`preview --from
  <ref>`, then `git merge`); it names no rollback, and `git revert` by hand
  also reverts the instance's own later commits.
- A fork that merges a starter revision runs no update of its own
  (`previewFromRevision`, line 1893, writes nothing; line 1943); once this
  order lands, the starter's committed log rows and their
  `preUpdateCommit` arrive through the merge, its retained copies do not.
- The work instance, a private fork on a constrained managed host where
  core is never installed (product 12, 2026-10-11), takes updates by Git
  merge and holds no core checkout.

*The instance's own code (dated 2026-10-11 at `82b7fdb7`; re-observed
2026-10-13 at `6dbd8771`, reading true; anchors re-checked there by the
merge):*

- The `SourceAdapter` port is prose (product 03 §Ports); the only adapter
  is `fetchIssueBundle` (`github-issue-source.ts` line 409), which
  `prepare()` calls through `external.fetchIssueBundle ?? fetchIssueBundle`
  (`vertical-runtime.mjs` line 524), a seam only the tests use.
- `readVerticalConfiguration` (line 161) admits issue keys `number`,
  `draftId`, `inferences`, `revisionId`, `baselineAssessment` and `intake`
  (lines 204 to 231); nothing names a source.
- `SECTION_KEYS` (`config.mjs` line 94) holds nine sections; an unknown
  section refuses.
- An unlisted directory survives an update (`planUpdate` refuses a new kit
  path an instance file occupies, line 1412), but nothing loads code from
  one.
- ADR-0002's Decision, item 2, keeps the enterprise-tracker adapter a
  future optional plug-in outside core; product 03 §Package ecosystem names
  integration packs and their review burden; nothing implements either.

*The build (restated 2026-10-13 at `6dbd8771`; dated 2026-10-11 at
`82b7fdb7`):*

- `scripts/lib/harness.mjs` imports `contributorConfiguredProgram`,
  `contributorSupportIds`, `contributorProfiles` and `targetWorkerProfiles`
  from `packages/skeleton/dist/src/loadouts/contributor.js` (lines 38 to
  43) and `personalFeedback` from `feedback.js` (line 44);
  `harnessInstallation` (line 299) records the semantic hash and compiler
  version in the manifest's `origin` and `compilerPackageVersion`.
- WO-076 (v0.76.0) made `contributorConfiguredProgram` take the overlay
  (`contributor.ts` line 916), decoded in machinery (`decodeBuildOverlay`,
  line 62) and composed in the build (`overlayContributor`, line 692);
  `build: none` returns a manifest with no `origin` and no profiles (lines
  319 to 333). The compiler moved from 0.26.0 to 0.27.0 across that
  contract change; every component is below 1.0.
- `kitManifest` (`launchpad.mjs` line 337; schema 1, line 66) lists every
  file without a partition, so an update replaces the definition modules
  with every machinery change; `BUILD_KEYS` (`config.mjs` line 67) records
  no pin or channel; `checkHarness` (line 640) would read a pinned older
  module as drift; WO-076's overlay has one build per kit revision to
  compose over.
- The loadout is TypeScript compiled into the skeleton package, not data a
  definition pack (product 03 §Package ecosystem) could carry; WO-096 is
  the queued order that moves rules into compiled units.
- A channel that lives only in the update command does not reach the work
  instance, which updates by Git merge.

*Found by the merge (2026-10-13 at `6dbd8771`):* no writer admits
`ExtensionLoaded`: the vertical records through `ResidentStore`
(`vertical-runtime.mjs` lines 675 to 678), which admits only
`residentEventTypes` (`resident-state.ts` line 313), and the launchpad
control log refuses an unknown type (`scripts/lib/control.mjs` line 452).
`build: "none"` is an overlay value (`harness.mjs` lines 105 to 112), not a
configuration key. The `configuration-root` suite refuses a literal `docs/`
path in any non-test script but `config.mjs` (the test at
`scripts/test-configuration-root.mjs` line 592).

*The way in and the gate (observed 2026-10-13 at `6dbd8771`):*

- The client README leaves the update to the reader's hands: refused files
  are resolved by hand before the update is committed (line 365), and the
  in-instance route is `git fetch`, `preview --from`, `git merge` and
  `harness emit`, typed by the reader (lines 380 to 389); §First steps
  (line 78) and §Planning in this instance (line 119) begin by committing
  the export. The operator now makes no commits of their own and runs no
  repository-changing command by hand (planning document §12.1). The only
  carried order template is the first order's
  (`scripts/kit/first-order.template.md`); none serves an update.
- In a kit root, `npm test` drops the core-only rows and runs `kit-verify`
  first (`scripts/test-runner.mjs` lines 2285 to 2300), then carries passing
  task results only from rows at the current whole code identity
  (`coveringTaskResults`, line 2327; `scripts/lib/gate-reuse.mjs`
  `identityRows`, line 130), never `format` or `kit-verify` (lines 2329 and
  2330). `gateCodeIdentity` (`packages/skeleton/src/gate-evidence.mjs` line
  756) covers every path outside `docs/`, `.claude/`, `.agents/` and root
  Markdown, `dotln.config.json` and instance code included. Inference:
  registering a target or editing instance code reruns every carried
  suite. The WO-201 export fixture ran a fresh kit `npm test` in 41.7 s
  (`docs/evidence/WO-201/gate-in-kit.json`); no real fork's gate duration
  is recorded.
- No rule covers tests of instance-owned code: the suite table is a kit
  file, editing one is the true-fork path (client README §Taking upstream
  updates), and `kit` admits only `applyInstanceActions` (`config.mjs`
  `validateKit`, line 334).
- `verifyKit` (`launchpad.mjs` line 1302) refuses any differing
  `packages/<name>/dist/` file (line 1315), and the build modules sit under
  `packages/skeleton/dist/`. Inference: a `build --pin` on the merge path,
  which restores older modules under the merged starter manifest, would
  fail `kit-verify` on every gate unless verification honors the pin.

**Design (scope discipline):**

*The extension point.*

- One declared root outside the kit: `extensions.root` is relative, not a
  symlink, and not under `scripts/`, `packages/`, `docs/` or any kit path
  (`kitPath`, `launchpad.mjs` line 1206); every module is contained in it.
  Core declares none, so no export carries an extension.
- `loadExtension` imports a `source` module by file URL after containment
  checks, validates `{ id, kind, referenceFor, fetchBundle }` (a wrong shape
  is a typed refusal naming the id) and returns its SHA-256 for the record.
- `effect` and `projection` adapters are admitted by declaration (kind, a
  contained regular file, its SHA-256) and listed by `listExtensions(kind)`
  for the publish port and view-model projections, never imported, since
  importing runs top-level code and no consumer asks yet (the route
  document's §12 reading).
- The port's contract is the GitHub source's: `fetchBundle(reference, {
  directory, cwd })` returns `IssueBundleResult`;
  `requireCompleteIssueBundle`, the declared screen and `decodeSourceBundle`
  run unchanged; the adapter never sees the model or the worktree.
- Selection is per issue: `source: "<id>"` selects the adapter, absent
  means the GitHub source; the adapter's `referenceFor(number)` supplies
  the reference the draft must name, and `referencesIssue` keeps its rule
  for GitHub issues.
- A malformed `extensions` section refuses the configuration, as every
  malformed section does (the §12 reading keeps this rule).
- Each adapter names the instance suite that covers it (`suite`, the
  gate's second tier, assumption 8): a `suite` that names no declared
  suite, or whose suite's `sources` do not contain the adapter's module,
  refuses the configuration naming the key.
- The load record: step 4 decides where `ExtensionLoaded` is written and
  records it in the decisions before any edit; adding it to
  `residentEventTypes` owes the conditional re-mints and episode the Cost
  names; criterion 2 judges the record where the decision places it.
- Review burden stated, not enforced: the README names the filesystem,
  network and credential reach an instance's code gets inside the
  vertical's process, the hashed record and that an adapter change is
  reviewed like any instance source change; the harness's refusals judge
  the vertical's effects as today. v1 mining stays with WO-193 and
  FUP-0115.

*The build channel.*

- **The choice, recorded.** A definition pack would make the loadout data
  the compiler reads, which is the rule migration's subject (WO-096) and
  product 10's IR work; a pinned build keeps the modules,
  partitions the manifest and lets the current compiler lower from them.
  The pinned build is chosen; the pack stays a candidate
  (FUP-d2897b117391bb26), reopened when the definitions compile from data
  or a second owner needs a build core does not ship.
- **The build is the compiled definitions:** `build.files` names
  `contributor.js` and `feedback.js` under
  `packages/skeleton/dist/src/loadouts/`, with the semantic hash and
  compiler version; everything else listed, the hooks' runtime included,
  is machinery.
- **Channel in the plan.** Under `machinery` the build files are planned
  `keep` at their prior hashes and the configuration records
  `build.pin = { files, semanticHash, compilerPackageVersion, commit }`;
  under `build` only the build files are planned; under `both` today's
  plan. The preview shows the partition and the channel.
- **Compatibility guard.** Compilers are compatible when their major
  versions match from 1.0 and, below 1.0, their minor versions match
  (WO-076 changed the import contract while the compiler moved only from
  0.26.0 to 0.27.0), and when the pinned definition modules export every
  name the installed harness library imports. The guard compares no
  parameters: a parameter the pinned modules take differently is found by
  criterion 9's equality case. An incompatible `machinery` or `build`
  update refuses before any write and prints the two choices
  (`--channel both`, or take nothing).
- **Build none.** Under an overlay's `build: "none"` the channel is `both`
  and no pin is recorded; a channel or pin declared beside it refuses
  where configuration and overlay are read together (`harnessInstallation`,
  and `planKitUpdate` before any write). That branch, `decodeBuildOverlay`
  and `overlayContributor` are not edited.
- **The emit and the check honor the pin:** `harnessInstallation` imports
  the definitions from the pinned files (kit files at pinned bytes,
  tracked in the instance); `checkHarness` expects the pinned hashes where
  a pin is declared; `origin` records the pinned semantic hash.
- **The merge path.** `build --pin` restores the two modules from
  `git show <pin.commit>:<path>` and verifies them against the pin;
  `build --take` adopts the merged modules and records the new pin; both
  print the re-emit, which the role that ran them runs next. A merge
  brings every kit file; the upgrade order then runs the form its recorded
  channel names. Where a pin is declared, `verifyKit` compares each
  `build.files` path with the pin's hash instead of the manifest's, so
  `kit-verify` passes on pinned modules and still refuses any other
  differing runtime file.
- **Defaults.** Absent `build.channel` means `both`; the personal instance
  keeps it; for the work instance the operator chooses per update, and the
  planning pass that cuts the upgrade order records the choice.

*The update record and the rollback.*

- Each update appends one row to the log: `{ at, fromCommit, toCommit,
  priorManifest: { commit, files: [{ path, sha256 }] }, newManifestSha256,
  preUpdateCommit | null, channel, plan, applied }`, `applied` including a
  `build.pin` written. The log and the retained-copy lane resolve through
  `docRelative` against the destination's configuration (by default
  `docs/control/kit/updates.jsonl` and
  `docs/control/local/kit/rollback/<priorManifestSha256>/<path>`), never as
  literals; the log is instance-owned and never manifest-listed.
- The update refuses before its first write, naming the path, when the
  lane or the log cannot be written (fail-closed, the §12 reading).
- Prior bytes come from the retained copy (written before a replace whose
  row is not `unchanged`, or a remove), then `git show
  <preUpdateCommit>:<path>`; a restore counts only when it hashes to the
  prior manifest's entry. Every restore is verified before the first write
  (all or nothing), and the restored manifest is the prior manifest's
  bytes.
- Actions reverse by kind: `rename-root` back when the root is where the
  action left it; `add-config-field` removed when the log says the update
  added it; `change-phrase` back when exactly one occurrence exists; a
  `build.pin` the update wrote removed, restoring the prior `build`
  section; anything else listed by id with the file to edit.
- Refusals, each naming its path or row: a kit file changed since the
  update; an update that is not the latest row; a missing retained copy
  with no committed prior; a destination without a manifest.
- The rollback appends a `rollback` row, prints through `renderUpdatePlan`,
  ends with `re-emit: node scripts/harness.mjs emit`, and writes no receipt
  in core. Refused rows stay untouched, since the update never changed
  them. It restores whatever the row's plan lists, so a channelled
  update needs no special case; a fork rolls back a merged starter row
  through its pre-update commit, having no retained copies, or refuses
  naming the row.
- A role runs every rollback on the operator's word, then the re-emit it
  prints: inside an instance, the executor of an order cut from the
  template's rollback form; from core, a lifecycle role on the operator's
  captured word. The operator runs neither by hand.

*The way in: an upgrade order that a planning pass cuts.*

- **The template.** `scripts/kit/upgrade-order.template.md` (new) travels
  with the `scripts` tree (`KIT_FILES`) in the order form the instance's
  index reads. A planning pass in the instance (the planner, on the
  operator's `planning:` dispatch), dedicated or part of a larger pass,
  copies it into the work-orders root as a new order and fills its
  placeholders: the starter remote and revision, the channel (`both`,
  `machinery` or `build`), and how refused or flagged paths resolve, as the
  operator words it in the pass. The pass writes only under `docs/`, as its
  branch must (WO-135); the preview itself is the order's first step.
- **The order's plan.** Fetch the starter remote; run and record
  `node scripts/launchpad.mjs preview --from <revision>`; resolve each
  refused or flagged path as the order records the operator's word (keep
  the instance's bytes or take the incoming), stopping for a planning pass
  when a path has none; `git merge <revision>`; run `build --take` or `build --pin` as the
  channel says; `node scripts/harness.mjs emit` and `check`;
  `node scripts/launchpad.mjs verify`; the Preflight line, `npm test` and
  `npm run test:docs`; then verification, final review, the pull request
  the operator merges, and release close (WO-210). The rollback form
  replaces fetch, preview and merge with `node scripts/launchpad.mjs
  rollback` and keeps the rest.
- **The order's criteria.** The preview is recorded before the merge; each
  refused or flagged path's resolution cites the operator's word; the merge
  names the planned revision; the channel's form ran and `harness check`
  passes; `kit-verify` passes; the carried kit suites ran fresh at the new
  kit identity; `npm test` and `npm run test:docs` are green; no step is
  left to the operator's hands.

*The fork's gate in two tiers (the planner's proposal, assumption 8).*

- **Kit conformance.** `kitCodeIdentity(root)` (`scripts/lib/kit-gate.mjs`,
  new) hashes each manifest-listed path's mode and bytes in path order,
  plus the overlay file `build.overlay` names. In a kit root (`isKitRoot`)
  every `npm test` row records `kitIdentity`; `kit-verify` and `format`
  run on every gate, as today. While `kit-verify` reports no differing kit
  file, a carried kit suite's latest pass in a row at the same kit identity
  covers it, each carried result naming its source row and kit identity;
  once `kit-verify` reports a differing kit file (the true-fork path), the
  whole code identity keys reuse, as today. The carried suites therefore
  run once per kit update, merge or kit-file edit.
- **The instance's own additions.** `dotln.config.json` `suites` declares
  `{ name, command, sources }`: a lowercase name, an argument array and
  contained relative path prefixes. In a kit root the runner adds each
  declared suite whose `sources` hold a path changed against the merge base
  with `origin/main` (every declared suite without one, as
  `changedMachinery` does), keyed by the whole code identity; `--only
  <name>` runs one; a name equal to a kit row refuses; a failing one fails
  the gate. Each extension adapter names its covering suite (above).
- **The overlay stays as it is.** An overlay edit stays inside the kit
  identity, so it reruns the carried suites, and it adds no machinery row,
  both as today. Whether customizing supports or loadouts through the
  overlay (WO-076) should rerun core's machinery suites is the operator's
  open question (Known issues); this order does not decide it.
- **Core is unchanged.** Outside a kit root, selection and reuse are
  today's, and the kit identity lives outside `gate-evidence.mjs`, so no
  evidence edition goes stale.

*Declined alternatives, recorded:* `git revert` of the update commit
(reverts the instance's later commits too and needs a committed update);
prior bytes in the kit manifest (the kit's, not the instance's history);
heuristic reversal of every action (an unreversible action is listed);
a rollback that runs the re-emit itself (the re-emit stays a separate step
whose output the role reviews and records); adapters
inside the kit tree (an update replaces them); a package registry or
marketplace (product 03's later catalog adapter); wiring effect and
projection consumers here (no instance needs one yet); an adapter API
richer than the GitHub source's; the definition pack now; pinning the
hooks' runtime (engine and definitions would drift against the scripts);
a per-file channel (a third set is a request); a channel inside a Git
merge (the merge is the upgrade order's; the two forms follow it); the
planning pass applying kit files itself (its branch writes only `docs/` and
root Markdown, WO-135); the operator running the upgrade by hand (retired
by the 2026-10-13 direction); the kit identity in
`packages/skeleton/src/gate-evidence.mjs`, the gate research's suggested
home (a common source of every edition, so every edition would re-mint);
an adapter whose missing suite only warns, the research's form (reopen when
an instance must land an adapter before its suite); instance suites as rows
in the runner's table (a kit file, so the true-fork path); dropping the
overlay from the kit identity now (it would decide the operator's open
question).

**Execution plan (the executor follows these steps in order; observed at
`82b7fdb7`, 2026-10-11; re-observed at `6dbd8771`, 2026-10-13, where the
merge re-checked each source anchor):**

1. `scripts/lib/config.mjs`: `SECTION_KEYS` (line 94) gains `extensions`
   and `suites`. `validateSuites`, modelled on `validateBuild` (lines 308
   to 319): an array of `{ name, command, sources }` with unique lowercase
   names, `command` a non-empty array of strings and `sources` contained
   relative path prefixes; absent loads as `[]`. `validateExtensions`, the
   same model: `root` per the Design (default `extensions`), `adapters` an
   array of `{ id, kind, module, suite }` with unique ids, a known kind, a
   module inside the root and a `suite` naming a declared suite whose
   `sources` contain the module; absent loads as `{ root: "extensions",
   adapters: [] }`. `BUILD_KEYS` (line 67) gains `channel` (`both`,
   `machinery`, `build`; absent reads `both`) and `pin`. Check:
   `scripts/test-configuration-root.mjs` cases (`configuration-root`).
2. `scripts/lib/extensions.mjs` (new): `loadExtension(launchpad, entry)` and
   `listExtensions(launchpad, kind)` per the Design, containment through
   `containedRegularFile` (`scripts/lib/paths.mjs` line 14);
   `scripts/test-extensions.mjs` (new) holds its cases and joins the
   `vertical` row's `args` in `scripts/test-runner.mjs` (line 691). Check:
   `vertical`.
3. `scripts/fixtures/extensions/` (new): `fixture-source-adapter.mjs`
   (`{ id: "fixture", kind: "source", referenceFor, fetchBundle }` reading a
   local JSON file into an `IssueBundleResult`-shaped result), and an
   `effect` and a `projection` module whose top-level code would write a
   marker if imported; the fixture configuration declares one suite whose
   `sources` hold the three modules, named by each adapter. Check: steps 2
   and 4 (`vertical`).
4. `scripts/lib/vertical-runtime.mjs`: `readVerticalConfiguration` (line
   161) admits `source` naming a declared adapter, else refuses naming it;
   `prepare()` selects `external.fetchIssueBundle ?? adapterFor(issue) ??
   fetchIssueBundle` at line 524, using `referenceFor` where
   `referencesIssue` (line 155) builds the expected URL; the load record
   lands where the recorded decision places it. Check:
   `scripts/test-vertical.mjs` cases: the fixture vertical with
   `source: "fixture"` from intake to contract, with the record; an
   undeclared id refusing at configuration (`vertical`).
5. `scripts/test-launchpad.mjs`: an export from a core checkout carries no
   path under `extensions/` and the manifest lists none; in a fixture
   instance an update leaves `extensions/` byte-identical and refuses a
   planted kit path inside it as an instance-owned collision. Check:
   `launchpad`.
6. `scripts/kit/dotln.config.example.json`: the `extensions` section, default
   root and no adapters, and an empty `suites` section. Check: the WO-074
   criterion 1 case's `loadConfig`
   of the example (`scripts/test-launchpad.mjs` lines 531 to 540) equals
   the defaults (`launchpad`).
7. `scripts/lib/harness.mjs`: `harnessInstallation` (line 299) reads
   `build.pin` and, when declared, imports the four `contributor.js` names
   and `personalFeedback` from the pinned files, passing the decoded overlay
   as today, and refuses a pin beside `build: "none"`; `checkHarness` (line
   640) expects the pinned hashes; `origin` carries the pinned semantic
   hash. Check: `scripts/test-harness.mjs` cases: emit from a pin equals
   the pinned revision's emit; check passes with the pin and refuses a
   differing module; a pin beside `build: "none"` refuses
   (`harness-fixtures`, `harness`, `evidence-sources`).
8. `scripts/test-harness.mjs`: beside WO-076's overlay cases (from line
   3466), an overlay composed over a pinned build equals its composition at
   the pinned revision. Check: `harness-fixtures`.
9. `scripts/launchpad.mjs`: `kitManifest` (line 337) writes schema 2 (line
   66) with `build: { files, semanticHash, compilerPackageVersion }` from
   the export's emitted harness manifest; `readPriorManifest` (line 1293)
   reads schema 1 as all machinery, and 2. Check: the WO-074 criterion 1
   case (line 350) extended to the partition (`launchpad`).
10. Same file: `planUpdate` (line 1384) takes `channel` and the prior
    manifest's `build` per the Design; `planKitUpdate` (line 1695) reads
    `--channel` or `build.channel`, applies the guard and the build-none
    refusal before any write, and under `machinery` writes `build.pin` into
    the destination's `dotln.config.json` through the configuration writer
    the instance actions use; `renderUpdatePlan` shows the partition and
    channel. Check: cases for the three channels and their previews, the
    guard (a minor change below 1.0 and a pinned module missing an
    imported name each refuse before any write with the two choices), and
    a channel beside an overlay's `build: "none"` refusing before any write
    (`launchpad`).
11. Same file, in the in-instance revision preview only
    (`previewFromRevision`, line 1893): an absent manifest-listed kit path
    the incoming manifest still carries becomes its own local-removal row,
    marked unchanged upstream when its incoming hash equals its prior hash,
    and every other row and declared action still prints, exit 0; the
    from-core preview and the update keep refusing it before any write
    (FUP-9c558fa0f869290e). Check: a case beside the fetched-starter
    preview case (line 2355) with a committed instance removal
    (`launchpad`).
12. Same file, `renderUpdatePlan` (line 1950): label and count a
    byte-identical replace row `unchanged` in the from-core preview and the
    update's summary, as for a revision preview (lines 1952 to 1963),
    leaving `planUpdate`'s kinds, the writes, the receipt and the WO-078
    update cases unchanged (FUP-bf112b957627334d). Check: the core preview
    case lists no unchanged carried path as replace (`launchpad`).
13. Same file, `applyKitUpdate` (line 1801): before the journal's write
    (line 1813), the fail-closed check; before each replace whose row's
    `unchanged` flag (line 1430) is false, and each remove, the retained
    copy (`writeReplacement`); after the manifest write (line 1831), the row
    through a new `appendUpdateLog(destination, row)`, `preUpdateCommit`
    from `git rev-parse HEAD` under `exportEnvironment()` when the
    destination has a commit, else null. Check: the update case at line
    2112 asserts the row and copies; a case with the lane unwritable
    refuses before any write (`launchpad`).
14. `scripts/kit/gitignore.template`: confirm the seeded `.gitignore`
    already ignores `docs/control/local/` (template line 15; asserted at
    `scripts/test-launchpad.mjs` line 545) and record it; add a pattern
    only if the seed lacks it. Check: `git status` after step 13's update
    shows no retained copy (`launchpad`).
15. `scripts/launchpad.mjs`: `export function rollbackKit(destination)` per
    the Design (read the last row, refuse an absent log, a `rollback` row
    or a changed kit file, verify every restore source, then restore, unlink added files,
    reverse or list actions, write the prior manifest, append the row,
    print); CLI forms `export --update <dir> --rollback` and
    `rollback [<dir>]`. Check, in `scripts/test-launchpad.mjs`: (a) restore
    to the prior manifest's hashes, added files gone, removed files back,
    instance files byte-identical; (b) `rename-root`, `add-config-field` and
    `change-phrase` reversed and an unknown-state action listed; (c)
    refusals (a later kit edit; a second rollback; no retained copy and no
    commit) and a restore from Git with a committed prior; (d) both forms
    give identical trees; (e) a fork's merged starter row; (f) rollbacks
    after a `machinery` and a `build` update restore what each plan listed
    and the prior `build` section (`launchpad`).
16. Same file: `build --pin` and `build --take`, refusing when the history
    lacks the pinned blobs or the hashes differ; `verifyKit` (line 1302)
    compares each `build.files` path with the declared pin's hash instead
    of the manifest's, keeping the refusal of any other differing
    `packages/<name>/dist/` file (line 1315). Check: cases on a fixture
    instance that merged a starter revision, `verify` passing after
    `build --pin` (`launchpad`).
17. `scripts/lib/kit-gate.mjs` (new): `kitCodeIdentity(root)` per the
    Design (the manifest through `readPriorManifest`, the overlay path
    through `loadConfig`) and `instanceSuiteRows(root, changedPaths)`;
    `scripts/lib/gate-reuse.mjs` `identityRows` (line 130) and
    `coveringTaskResults` (line 304) take an optional `{ kitIdentity }` that
    selects rows by their recorded `kitIdentity`;
    `machinerySources["runner-fixtures"]` in `scripts/test-runner.mjs` gains
    the new module.
    Check: `runner-fixtures`.
18. `scripts/test-runner.mjs`, the kit branch (line 2285) and the reuse
    block (line 2327): in a kit root, record `kitIdentity` on each
    `npm test` row; while `kit-verify` reports no differing kit file, cover
    carried kit tasks from rows at the same kit identity; append the
    declared suites `instanceSuiteRows` selects; refuse a declared name
    equal to a kit row; `--only <declared name>` runs one. Cases in
    `scripts/test-runner.test.mjs` on a synthetic kit root: an
    instance-only edit reuses every carried suite while `kit-verify` and
    `format` run; a kit-file edit, a manifest change and an overlay edit
    each rerun them; a differing kit file disables kit-identity reuse; a
    declared suite runs only when a changed path lies under its `sources`,
    runs under `--only` and fails the gate when it fails; outside a kit
    root the selection and reuse equal today's. Check: `runner-fixtures`.
19. `scripts/test-launchpad.mjs`: in a fixture export, after one passing
    `npm test`, a `repositories` entry added to `dotln.config.json` leaves
    the kit identity unchanged and the next `npm test` carries every kit
    suite but `kit-verify` and `format`. Check: `launchpad`.
20. `scripts/kit/upgrade-order.template.md` (new), per the Design: the
    order form with placeholders for the starter remote and revision, the
    channel and the resolutions; its plan, rollback form and criteria; each
    step naming the role that takes it. Check: the WO-074 criterion 1 case
    lists it in the manifest (`launchpad`); in
    `scripts/test-launchpad-planning.mjs`, the template filled on the
    fixture instance's planning branch for a fixture revision indexes as an
    Open order under `npm run work-orders -- index --check`, and the branch
    changes no path outside `docs/` (`launchpad-planning`).
21. `scripts/kit/README.client.md`: §"## Taking upstream updates" (line
    331) gains the log, the retained copies (a fresh clone falls back to the
    pre-update commit), the update's fail-closed refusal, both rollback
    forms, the reversals, the listed actions, the refusals, the fork's
    merged-row rollback and the re-emit that follows; its rows follow step
    12 and name the revision preview's local-removal row (step 11); and the
    channel section (the build, the three channels, the guard, the pin, the
    merge-path forms and the default). The same section's in-instance route
    (lines 380 to 389) and its hand resolution before a commit (line 365)
    become the way in: a planning pass cuts the upgrade order from the
    template, and its executor runs every command, the re-emit and any
    rollback included, on the operator's word; from core, the update and a
    rollback are a role's. §"## Instance extensions" (new, after §Kit files
    and instance files): the root, the registration, the `source` exports,
    the record, the listed but unimported kinds, the covering suite, the
    review burden, and that the enterprise-tracker adapter belongs to the
    instance that needs it. §"## What runs here, and what does not" (line
    173): the two gate tiers, the `suites` section and the open overlay
    question. §"## First steps" item 2 (line 84): five `@dotln/*`
    workspaces, as `KIT_WORKSPACES` holds since WO-118 added the console.
    Check: the README travels manifest-listed (the WO-074 criterion 1 case)
    (`launchpad`).
22. Write-backs, in place, each heading re-read at the base:
    `docs/product/03-architecture.md` §"## Platform and instance boundary"
    (the `KIT-MANIFEST.json` clause names schema 2 and its partition; the
    extension, rollback and channel sentences gain their evidence; the
    route paragraph's queued list drops rollback and channel selection),
    §"### Package ecosystem and marketplaces" (the extension root as where
    an instance's integration pack lives today; the definition pack as the
    reopening alternative) and §"## Ports (what keeps work-flavored
    verticals pluggable)" (the `SourceAdapter` bullet's instance-side
    binding); `docs/product/12-workstream-application.md` §"## Arriving at
    the desk" (the "previewed first and reversible" clause, the build
    clause and the adapter sentence gain their evidence) and §"## One
    workstream across repositories" (the update loop gains the channel, the
    opt-in through the upgrade order and the two tiers, each with its
    evidence; the clause saying WO-207 proposes the tiers keeps the
    operator's open overlay question);
    `docs/product/07-execution-guide.md` §"## Operator-opened planning
    pass" (in an instance, a starter update enters only through a planning
    pass that cuts the upgrade order from the template, and the pass
    applies no kit file), §"### Where the control plane finds its
    documents" (the optional sections gain `extensions` and `suites`) and
    §"### Preflight before the full gate" (in an exported instance, the two
    tiers); `docs/evidence/WO-207/decisions.md` (the pinned build with the
    pack's reopening condition; the load record's place; the two §12
    readings; the kit identity's home and the overlay's status quo); the
    authority and harness editions' deterministic re-mints; after a
    `resident-state.ts` edit, every edition's re-mint, the feedback re-mint
    and the live feedback episode; `npm run meta`;
    `node scripts/lineage.mjs index --check`;
    `node scripts/check-publication.mjs --print-locks`;
    `npm run publication:check`. Check: `npm run test:docs`,
    `authority-evidence`, `harness-evidence` (and `feedback-evidence` after
    a feedback re-mint).
23. Handoff: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-207/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Acceptance criteria (all required)**

1. An `extensions` section with a root under a kit tree, a symlinked root,
   an uncontained module, a duplicate id, an unknown kind, or an adapter
   whose `suite` names no declared suite or a suite whose `sources` omit
   its module refuses naming the key, and an absent section loads as the
   default root with no adapters; a `suites` entry with a duplicate or
   non-lowercase name, an empty or non-string `command` or an uncontained
   source refuses naming the key, and an absent section loads as none; a
   `build.channel` outside the three, or a malformed `build.pin`, refuses
   naming the key, and an absent channel reads as `both` (configuration
   cases).
2. The fixture vertical runs from intake to contract with an issue naming
   `source: "fixture"`: the adapter's bundle passes
   `requireCompleteIssueBundle`, the screen and `decodeSourceBundle` as the
   GitHub source's does, and the record the decisions name holds
   `ExtensionLoaded` with the module's SHA-256; an undeclared id refuses at
   configuration; a wrong export shape refuses naming the id (vertical and
   extension cases).
3. Declared `effect` and `projection` adapters are listed by kind with
   their contained paths and SHA-256 and never imported (their top-level
   markers stay absent after listing and after a vertical run); no consumer
   runs them (extension cases).
4. An export from a core checkout carries no path under the extension root
   and the manifest lists none; in a fixture instance an update leaves the
   root byte-identical and refuses a planted kit path inside it (launchpad
   cases).
5. The kit manifest (schema 2) names its build files, semantic hash and
   compiler package version; a schema 1 manifest reads as all machinery
   (fixture).
6. Under `machinery` an update replaces every kit file but the build
   modules, which keep their pinned bytes, records `build.pin` and leaves
   the emitted bundle at the pinned build after the re-emit; under `build`
   only the build modules change and the re-emit produces the new build
   over unchanged machinery; under `both` the plan equals today's; the
   preview shows the partition and the channel in each case (fixture).
7. The from-core preview and the update's summary label and count
   byte-identical replace rows `unchanged`, with `planUpdate`'s kinds, the
   writes and the receipt unchanged; the in-instance revision preview lists
   an absent manifest-listed kit path the incoming manifest still carries as
   a local-removal row (unchanged upstream when its incoming and prior
   hashes match), prints every other row and declared action and exits 0,
   while the from-core preview and the update still refuse it before any
   write (fixture).
8. A `machinery` update whose incoming compiler is incompatible with the
   pin, and a `build` update whose definitions are incompatible with the
   installed compiler, refuse before any write and print the two choices;
   compatibility is the Design's guard (the major from 1.0, the minor below
   it, every imported name present in the pinned modules); a channel or pin
   beside an overlay's `build: "none"` refuses before any emit or update
   write (fixture).
9. `harness emit` from a pinned build produces the pinned revision's
   bundle; `harness check` passes with the pin and refuses a pinned module
   whose bytes differ (fixture).
10. In a fixture instance that merged a starter revision, `build --pin`
    restores and verifies the pinned modules from its history,
    `build --take` adopts the merged modules and moves the pin, each prints
    the re-emit instruction, and both refuse when the history lacks the
    pinned blobs; after `build --pin`, `node scripts/launchpad.mjs verify`
    passes on the pinned modules and still refuses any other differing
    `packages/<name>/dist/` file (fixture).
11. An overlay composed over a pinned build equals its composition at the
    pinned revision (fixture).
12. An update appends one log row (the prior and new commits, the prior
    manifest, the new manifest's hash, the pre-update commit or null, the
    channel, the plan, the applied actions) and retains a copy of each file
    it replaces with different bytes or removes, none for a byte-identical
    replacement, with no retained copy in `git status`; with the lane or
    the log unwritable it refuses before any write, naming the path
    (fixture).
13. A rollback after an update restores every kit file to the prior
    manifest's hash and the prior manifest, removes added files, restores
    removed ones, and leaves every instance file byte-identical (fixture).
14. Reversible actions are reversed (`rename-root`, `add-config-field` the
    update added, `change-phrase`, a `build.pin` the update wrote) and an
    action in an unexpected state is listed by id with the file to edit,
    not guessed (fixture).
15. The rollback refuses, writing nothing and naming the path or row, after
    a later kit edit, with no newer update above the last rollback, and when
    a prior file is restorable from neither source; with a committed prior
    and no retained copy it restores from Git and verifies the hash
    (fixture).
16. The from-core and in-instance forms produce byte-identical trees, each
    appending a `rollback` row and writing no receipt in core; a fork that
    merged a starter revision rolls back from the merged row through the
    pre-update commit, or refuses naming the row; a rollback after a
    `machinery` or `build` update restores what its plan listed and the
    prior `build` section (fixture).
17. Kit conformance (the planner's proposal, assumption 8): in a kit root
    every `npm test` runs `kit-verify` and `format` and records
    `kitIdentity`; after an instance-only edit (configuration, the
    extension root, a declared suite's sources, documents) the carried kit
    suites are carried from a row at the same kit identity, each carried
    result naming its source row; after a kit-file edit, an update, a merge
    that changes a manifest-listed path or an overlay edit they run fresh;
    while `kit-verify` reports a differing kit file, no carried suite is
    reused by kit identity; outside a kit root, selection and reuse equal
    today's (runner fixtures; one export case).
18. The instance's own suites (the planner's proposal, assumption 8): a
    declared suite runs when a path changed against the merge base lies
    under its `sources` (every declared suite without a merge base) and not
    otherwise; `--only <name>` runs it; its failure fails the gate; a name
    equal to a kit row refuses (runner fixtures).
19. The kit carries `scripts/kit/upgrade-order.template.md`,
    manifest-listed; filled on an exported instance's planning branch, it
    indexes as an Open order and the branch changes no path outside
    `docs/`; its plan previews (`preview --from`) before it merges, runs
    the channel's `build` form, re-emits and checks the harness, verifies
    the kit, and runs `npm test` and `npm run test:docs`; its rollback form
    runs `rollback` and the same checks; every step names the role that
    takes it, and none is left to the operator's hands (launchpad and
    launchpad-planning cases; reading).
20. The client README's §Taking upstream updates documents the log, the
    retained copies, the fail-closed refusal, both rollback forms, the
    reversals and refusals, the re-emit, the unchanged rows, the revision
    preview's local-removal row, the channel section and the way in (an
    upgrade order a planning pass cuts; every command a role's, on the
    operator's word, with nothing left to resolve or commit by hand); its
    §Instance extensions states the root, the registration, the `source`
    contract, the record, the unimported kinds, the covering suite and the
    review burden; its §What runs here, and what does not states the two
    gate tiers and the open overlay question; its first steps name five
    workspaces; the example configuration carries the `extensions` and
    `suites` sections.
21. Write-backs land in place with no dated paragraph: product 03 §Platform
    and instance boundary (schema 2; the evidence for the extension point,
    rollback and channel; the queued list), §Package ecosystem (the
    extension root; the definition-pack alternative) and §Ports (the
    binding); product 12 §Arriving at the desk (the evidence) and §One
    workstream across repositories (the channel, the opt-in through the
    upgrade order and the two tiers, with the overlay question kept open);
    product 07 §Operator-opened planning pass (an instance's starter update
    enters only through an upgrade order a planning pass cuts), §Where the
    control plane finds its documents (the two sections) and §Preflight
    before the full gate (the two tiers); the decisions file with the
    recorded choices; the publication locks refreshed. No byte figure binds
    these write-backs.
22. `npm test -- --review` and `npm run test:docs` green; the authority and
    harness editions re-minted; after a `resident-state.ts` edit, every
    edition's re-mint, the feedback re-mint and the one live feedback
    self-host episode landed; `git diff --check` clean; no new dependency.

**Deliverables:** the `extensions` section, loader, record and `source`
selector with fixture adapters; the manifest partition, channel, guard,
pin, pinned emit and check, and merge-path forms; the preview's unchanged
and local-removal rows; the update log, retained copies, rollback forms
and reversals; the `suites` section, the kit identity and the two gate
tiers; `verifyKit` honoring a pin; the upgrade-order template; the
fixture cases; the example configuration and README; the write-backs and
re-mints.

**Preflight:** `npm test -- --only configuration-root` for steps 1–4, 7,
9–13 and 15–18 (it scans each changed non-test script for a literal
document root), `npm test -- --only vertical` for steps 2–4,
`npm test -- --only launchpad` for steps 5–6, 9–16 and 19–21,
`npm test -- --only harness-fixtures` for steps 7–8,
`npm test -- --only harness` and `npm test -- --only evidence-sources` for
step 7, `npm test -- --only runner-fixtures` for steps 17–18,
`npm test -- --only launchpad-planning` for step 20,
`npm test -- --only authority-evidence` and
`npm test -- --only harness-evidence` for step 22 (and
`npm test -- --only feedback-evidence` after a feedback re-mint), and
`npm run test:docs` when a document changes (steps 20–22), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the configuration, extension, vertical, harness,
runner, launchpad and launchpad-planning cases; the re-mints;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(declared machinery sources change: the runner and its reuse lookup are
`runner-fixtures` sources, and `scripts/launchpad.mjs` and `scripts/kit/`
are `launchpad-planning` sources) and again at final review; the live
feedback episode only after a `resident-state.ts` edit.

**Write-back duty:** as listed in criteria 20 and 21.

**Known issues and carry-ins:**

- Retained copies live in the ignored local lane: a fresh clone has none
  and falls back to the pre-update commit, which the log holds only when
  the destination was committed at update time; the README says so.
- FUP-3e22cf6f99f02005 is allocated here: the operator's direction is the
  request its reopening condition awaited.
- 2026-10-13 standard pass, within the Boy Scout bound in paths this order
  edits: FUP-bf112b957627334d (WO-203-D016: the from-core preview and the
  update summary list byte-identical carried paths as replace, 865 on the
  real corpus; step 12), whose `unchanged` flag also spares a retained copy
  (step 13); FUP-9c558fa0f869290e (WO-203-D015: a revision preview refuses
  whole when the instance removed a kit file; step 11); the README's four
  `@dotln/*` workspaces, five since WO-118 (step 21). WO-076 closed
  (v0.76.0) and moved the boundary (step 7); the guard compares the minor
  below 1.0 and the imports; the channel under `build: none` is stated.
- The definition pack is the recorded alternative (FUP-d2897b117391bb26),
  reopened when the definitions compile from data or a second owner needs
  a build core does not ship.
- Pinned definitions run against the current compiler within the guard's
  range; a compiler behavior that range kept but changed is found by
  criterion 9's equality case against the pinned revision's bundle.
- For the work instance the operator chooses the channel per update, the
  planning pass that cuts the upgrade order records it, and that order runs
  `build --pin` or `build --take` after its merge; the channel flag serves
  updates from core.
- **Open for the operator, not decided here:** should an instance rerun
  core's machinery suites when it customizes supports or loadouts through
  its overlay (WO-076)? The proposal reruns the carried kit suites only for
  kit changes and treats overlay changes as the instance's own; that is the
  planner's reading, not an operator decision (planning document §12.7).
  Until the operator answers, this order changes nothing for an overlay
  edit: the overlay file stays inside the kit identity, so an overlay edit
  reruns the carried suites, and it adds no machinery row, both as today.
  Reopen when the operator answers; the answer may drop the overlay from
  the kit identity or add machinery rows for it.
- The two gate tiers are the planner's proposal (assumption 8), drawn from
  the pass's read-only gate research; no real fork's gate duration is
  recorded, and the 41.7 s figure is the WO-201 export fixture's.
- Inference: carrying the kit suites across instance-only changes trusts
  that instance configuration never changes a carried suite's verdict.
  Reopen when a carried suite passes at a kit identity and then fails
  after an instance-only change at the same kit identity.
- The enterprise-tracker adapter is the work instance's first extension,
  never written in core; what it needs beyond this contract arrives as a
  WO-193 request. The effect and projection kinds' first consumer is a
  later order, named by the request that asks for it.
- The load record's place is step 4's recorded decision: no writer admits
  `ExtensionLoaded` at `6dbd8771`, and the parts named a control-log writer
  the vertical does not use.
- FUP-d5d0ef5cf034102e (WO-076-D008) and FUP-9d397b57910ae6ed (WO-076-D011)
  stay deferred: step 7 leaves `decodeBuildOverlay`, `overlayContributor`
  and `harnessInstallation`'s `build: none` branch unedited; editing any
  reopens its row.
- Receipt 044 known issues (2026-10-11), with their reopening observations:
  - The rollback's criterion 1 (now 12): what the update does when its
    retained copies or log row cannot be written was unstated. Reopen when,
    with the local lane unwritable, a fixture update refuses, or completes
    without a log row and without saying rollback is unavailable. The §12
    reading chose the refusal; step 13's case makes that observation by
    design, and the README states the new refusal.
  - The rollback's criterion 1 (now 13): committed before the R3 replan the
    critical path places after WO-083's run, naming no critical-path gate.
    Reopen when that replan drops or reorders WO-207, or an instance needs a
    rollback before WO-207 activates.
  - The extension point's criterion 3 (now 3): unconsumed kinds add load
    surface, since importing runs top-level code. Reopen when no order
    consuming an effect or projection adapter is filed by the R3 replan, or
    a fixture shows such code running at vertical start. They are now
    listed without import.
  - The extension point's criterion 1 (now 1): a malformed `extensions`
    section may refuse every vertical. Reopen when a fixture with a
    malformed section refuses a vertical whose issue names no `source`.
    The §12 reading keeps the configuration's rule.
  - The build channel's criterion 3 (now 8): the guard checked only the
    compiler's major version, and the hooks' runtime is not pinned. Reopen
    when a `machinery` update under a pin within one compiler major passes
    `harness check` and a hook or emitted unit then fails in the fixture
    or an instance.
  - The build channel's criterion 2 (now 6): channel and pin multiply
    update states across both routes ahead of any observed need, committed
    before the R3 replan. Reopen when the R3 replan after WO-083 records
    whether any instance asked to keep its build across a machinery update,
    or drops or reorders WO-207.

**Non-goals:** reverting the instance's own commits; a rollback older than
the last update (one step back, repeated only while each row is the
latest); rolling back an export; a rollback command that runs the re-emit
itself; rollback receipts in core; a tracker-specific adapter in core; v1
mining or rule import (WO-193, FUP-0115); effect and projection consumers;
a package registry or marketplace; sandboxing an adapter beyond the
vertical's existing confinement; the definition pack; pinning the hooks'
runtime; per-file channels; the overlay's own semantics (WO-076); a
channel inside a Git merge; the preview itself (WO-203), which this order
composes with; core's own gate selection and reuse; a target repository's
gate (WO-210); pushing releases into the starter (WO-215); taking a
starter update without a planning pass, or merging the upgrade order's
pull request (the operator's); deciding the overlay question.

**Operator-review assumptions**

1. One step back per rollback is the accepted shape; a deeper undo repeats
   rollback after the intervening rows are rolled back.
2. An action the rollback cannot reverse is listed, not reversed by guess.
3. The GitHub source's result shape is the port's contract; an adapter that
   needs more opens a WO-193 request.
4. Instance code loaded into the vertical's process under the harness's
   existing refusals is the accepted boundary for a first consumer;
   stronger isolation is a later decision.
5. The build is the two compiled definition modules and what they lower
   into; the hooks' runtime is machinery.
6. The personal instance keeps `both`; for the work instance the operator
   chooses per update, through the planning pass that cuts its upgrade
   order, and may stay pinned indefinitely, the true-fork path for the
   build alone, not for the machinery.
7. An update that cannot write its rollback record refuses, and unconsumed
   adapter kinds are listed without import, as the route document's §12
   readings recorded for this order's next amendment.
8. **The two-tier fork gate is the planner's proposal, which the operator
   has not approved** (planning document §12.7): kit conformance
   (`kit-verify` on every gate; the carried kit suites once per kit
   identity over the manifest-listed paths) and the instance's own declared
   suites selected by changed sources, each extension adapter naming its
   covering suite. It sits in steps 1, 3, 6 and 17 to 19 and criteria 1,
   17 and 18. If the operator rejects or changes it before activation, a
   planning pass amends those parts and the rest of the order stands. The
   overlay question stays open (Known issues).
9. A starter update enters an instance only through an upgrade order a
   planning pass cuts; the operator gives the word (the revision, the
   channel, how each refused path resolves, a rollback), types the dispatch
   phrases and merges the pull request, and a role runs every command and
   makes every commit (operator direction, 2026-10-13; planning document
   §12.1).
