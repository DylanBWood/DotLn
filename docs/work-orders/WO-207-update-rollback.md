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
configuration section whose declared suites an exported instance's `npm test`
appends to its consumer selection and runs fresh (core's own gate is
unchanged). The update keeps its shape, except that it refuses before any
write when its rollback record cannot be written. Assigned at activation
under the standing opt-out default.
**Cost:** adds the update log, retained copies and `rollback` form in
`scripts/launchpad.mjs`; the manifest's build partition, the update
channel, the compatibility guard and `build --pin|--take` there, with
`build.pin` in `scripts/lib/config.mjs` and the pinned emit and check in
`scripts/lib/harness.mjs`; the `extensions` section, a loader
`scripts/lib/extensions.mjs` (new) and the `source` selector in
`scripts/lib/vertical-runtime.mjs`; fixture adapters; the `suites` section, `scripts/lib/kit-gate.mjs` (new, `instanceSuiteRows`)
and the kit branch of `scripts/test-runner.mjs`;
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
(planning document §12.1). The 2026-10-13 pass also listed a rerun of every
carried kit suite after each instance-only change; WO-213-D014 (2026-10-15,
v0.83.0) removed that state before this order ran, and the 2026-10-21 pass
struck the reuse tier that targeted it. The merge removes two order cycles
(two activations, verifications, final reviews and release closes, each
with its full gate runs; planning document §12 records 2.29 full runs and
61 minutes of full gate per closed order since receipt 044, and phase
medians of 16.9 minutes for verification and 24.8 for final review); no
live feedback episode collapses, since no part owed one. Wall-clock: each
update gains one copy per replaced or removed file whose bytes change, a
log row (both measured by the fixture) and a plan partition; a rollback
costs its restores; a vertical start pays one dynamic import per declared
`source` adapter; the emit's cost is unchanged; in an exported instance a gate appends the selected declared suites to
WO-213's consumer selection (the six structural tasks and `kit-verify`,
fresh), while core's gate is unchanged; the `launchpad` suite gains one export
case that runs the kit's `npm test` once after an instance-path change (the
personal fork records `npm test` at 11.6 s on its v0.85.0 update branch and
49.56 s in a fresh worktree at v0.88.0, seven tasks and no carried suite, with
30 s of the latter a host-lane wait). Commands:
adds `rollback`, `export --update <dir> --rollback`, `--channel`,
`build --pin|--take` and, in an instance, `npm test -- --only <declared
suite>`; one `npm test -- --review` before handoff and one at final review
in place of three of each, after targeted `--only` runs. Context bytes: one
order at cold start in place of three (this file, about 72,000 bytes,
against the parts' 59,550; it carries the fork's update route and gate,
which no part held). Tokens: unknown until run. Steps: 23 in place of the
parts' 27. Re-mints: `scripts/lib/harness.mjs` is a registered source of the authority
edition and of the harness evidence check (`scripts/lib/evidence-sources.mjs`;
a build-only exclusion for the other three editions), so the authority edition
is re-minted deterministically through `npm run sync` and `npm test -- --only
harness-evidence` must pass (a check of the harness sources and their import
closure, not a minted edition: `docs/evidence/current.json` holds the
authority, artifact-identity, verification and feedback editions only); `config.mjs` is a reasoned import exclusion
(line 369); `launchpad.mjs`, `vertical-runtime.mjs` and the new loader are
not registered. No feedback-judged file changes unless step 4's recorded
decision adds the load record's type to `residentEventTypes` in
`packages/skeleton/src/resident-state.ts` (`FEEDBACK_SOURCE_PATHS`,
`feedback-audit.ts` line 33; a common source of every edition,
`evidence-sources.mjs` line 65): that edit adds every edition's re-mint,
the feedback re-mint and one live feedback self-host episode. The declared-suite tier owes no re-mint: `scripts/test-runner.mjs` and the new
`scripts/lib/kit-gate.mjs` are not registered evidence sources, and this order
leaves `scripts/lib/gate-reuse.mjs` (a common source of every edition since
2026-10-18, `0623f3a3`) and `packages/skeleton/src/gate-evidence.mjs` (a
common source of every edition) unedited; editing either would re-mint every
minted edition through `npm run sync`, feedback by carry. The launchpad, the kit templates and the
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
one, which cuts the upgrade order, and that the operator makes no commits of their own (planning document §12.1);
the declared-suite tier is the planner's proposal from that pass's read-only
gate research (§12.7), not an operator decision (assumption 8), and the
kit-identity reuse tier proposed beside it was struck by the 2026-10-21 pass
after WO-213-D014 decided the instance's consumer selection ([planning
document](../planning/fork-notes-and-operator-questions-2026-10-21.md) §9). WO-207, WO-208 and WO-209 were merged into
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
and WO-060 (closed: `decodeSourceBundle`) merged. WO-215 (closed, v0.81.0: core's release close refreshes the starter) is no
dependency beyond admitting the update-log row in the refresh's staged-set
check (step 13): the upgrade order takes whichever starter revision its
planning pass names, however that revision reached the starter.
**Recommended placement:** after WO-083 and before WO-193 in the serial queue
(position 12 after the 2026-10-21 pass placed four fork-unblocking orders
first; the operator keeps core's next thirty orders serial, planning document
§12.4): the operator placed the update's rollback after the measured run the
2026-10-11 route direction named, and WO-083 is that run. The personal
instance has meanwhile closed its WO-001, WO-003 to WO-006 and WO-009 to
WO-012 and taken starter updates through its pull requests #1, #3, #8 and #16,
with no rollback need recorded in its planning or order files. WO-210 (closed,
v0.82.0) rewrote `scripts/launchpad.mjs` and the client README's §Taking
upstream updates; this order edits that text as landed. A recommendation, not
a dependency token.

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
`renderUpdatePlan`, `writeReplacement`); `scripts/test-launchpad-export.mjs` and `scripts/test-launchpad-update.mjs`
(the `launchpad` row runs the update file with the export and seeds files as
arguments; `scripts/test-launchpad.mjs` is a barrel whose own cases never run;
the update case, the refresh case and `scripts/fixtures/launchpad-cases.json`,
which pins the 34 top-level cases); `scripts/lib/config.mjs`
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
- **Its way in.** An instance takes a starter update through the session-run
  route the client README records since WO-210: the incoming revision
  previewed from a detached worktree of that revision, the merge on an update
  branch, the re-emit and lineage index, one commit, the push and the update
  pull request the operator merges (the personal fork took its #1, #3, #8 and
  #16 this way). For the operator's instances the upgrade order a planning
  pass (dedicated, or part of one) cuts from the kit's template is that
  route's recorded form: it names the starter revision, the channel and each
  refused path's resolution, carries the route as its plan, runs the channel's
  `build` form after the merge and passes the gate below; the template's
  rollback form takes the way back the same way. A planning branch writes only
  `docs/` and root Markdown (WO-135), so the pass never applies kit files.
- **Its gate.** The consumer selection WO-213 decided (WO-213-D014: the six
  structural tasks and `kit-verify`, run fresh; carried kit suites stay
  explicit `--only` and `--machinery` diagnostics) plus the instance's own
  additions, the planner's proposal (assumption 8): suites it declares in
  `dotln.config.json` `suites` (name, command and sources), selected by
  changed sources, appended to that selection and run fresh, with each
  extension adapter naming the suite that covers it. Core's own gate is
  unchanged.
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
- The client README's §Taking upstream updates (from line 585 at `926b8234`)
  carries WO-210's session-run route (a detached-worktree preview, the merge
  on an update branch, the re-emit, the update pull request); it names no
  rollback, and `git revert` by hand also reverts the instance's own later
  commits. - `scripts/lib/starter-refresh.mjs` (WO-215, v0.81.0) runs
  `planKitUpdate` and `applyKitUpdate` in the starter's worktree, stages
  everything and refuses any staged path outside the plan, the manifest, the
  seeds and `CLAUDE.md` ("staged outside the plan"). An update-log row at the
  instance-owned `docs/control/kit/updates.jsonl` would be staged outside the
  plan, so every release close's refresh would refuse until the refresh admits
  the row (observed 2026-10-21 at `926b8234`).
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
- `SECTION_KEYS` (`config.mjs`) holds eleven sections at `926b8234`
  (`version`, `roots`, `repositories`, `classes`, `build`, `release`, `kit`,
  `derivedOrders`, `portfolios`, `contributions`, `historicalWorkOrders`); an
  unknown section refuses.
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

*The way in and the gate (restated 2026-10-21 at `926b8234`; observed
2026-10-13 at `6dbd8771`):*

- At `6dbd8771` the client README left the update to the reader's hands
(refused files resolved by hand before a commit; `git fetch`, `preview
--from`, `git merge` and `harness emit` typed by the reader). WO-210 (v0.82.0)
replaced that with the session-run route (§Taking upstream updates, from
"Inside an instance, its own session takes a starter update"): the session
previews the revision with the incoming revision's own launchpad from a
detached `.runtime/upstream-preview` worktree (the instance's launchpad
refuses a manifest naming a later schema), merges on an update branch,
re-emits, indexes lineage, commits, pushes and opens the update pull request
the operator merges; afterwards it fast-forwards `main` and runs `node
scripts/bootstrap.mjs`. The personal fork took its #1, #3, #8 and #16 this way
and records each in a planning pass and a registration order (its WO-011 for
v0.85.0, WO-012 for v0.88.0). The operator makes no commits of their own
(planning document §12.1). The only carried order templates are the first
order's and the workstream's (`scripts/kit/first-order.template.md`,
`workstream.template.md`); none serves an update.
- In a kit root, a plain or review `npm test` is the consumer selection
  WO-213 decided (`scripts/test-runner.mjs` `instanceSelection`, a kit root
  without `--only` or `--machinery`): the six structural tasks and
  `kit-verify`, run fresh, with the reuse block skipped (WO-213-D014,
  2026-10-15, v0.83.0; product 07 §Preflight before the full gate: "An
  upstream update or missing comparison ref never expands these consumer
  defaults"; README §What runs here, and what does not). D014 rejected
  rerunning carried platform fixtures for every instance order and reusing a
  pass at committed code identity alone, and reopens only when a consumer
  default selects a fixture. Carried kit suites run only as explicit `--only`
  or `--machinery` diagnostics. The personal fork records `npm test` at 11.6 s
  (v0.85.0 update branch) and 49.56 s in a fresh worktree (v0.88.0), seven
  tasks and no carried suite; the 41.7 s figure
  (`docs/evidence/WO-201/gate-in-kit.json`) is the WO-201 fixture's kit gate
  before WO-213. Nothing runs an instance's own tests: no `suites` section
  exists.
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
  declared-suite tier, assumption 8): a `suite` that names no declared
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
- **The build is the compiled definitions and what they import:**
  `build.files` is the relative-import closure of `contributor.js` and
  `feedback.js` inside `packages/skeleton/dist/src/loadouts/`, computed from
  the compiled import graph at export (at `926b8234`: `contributor.js`,
  `feedback.js`, `executor-supports.js`, `process-cost.js`,
  `goal-alignment.js` and `prompt-support.js`; a kit commits `dist`), with the
  semantic hash and compiler version; everything else listed, the hooks'
  runtime and the loadouts' imports outside the directory
  (`../harness-command.js`, `../version.js`) included, is machinery. A closure
  limited to the two entry modules would let a `machinery` update replace a
  support module under a pinned `contributor.js`, so the emit would mix two
  revisions and criterion 9's equality would fail whenever those modules
  differ.
- **Channel in the plan.** Under `machinery` the build files are planned
  `keep` at their prior hashes and the configuration records
  `build.pin = { files, semanticHash, compilerPackageVersion, commit }`;
  under `build` only the build files are planned; under `both` today's
  plan. The preview shows the partition and the channel.
- **Compatibility guard.** Compilers are compatible when their major
  versions match from 1.0 and, below 1.0, their minor versions match
  (WO-076 changed the import contract while the compiler moved only from
  0.26.0 to 0.27.0), when the pinned definition modules export every name the installed harness
  library imports, and when every module outside `build.files` that a pinned
  module imports (`../harness-command.js`, `../version.js`) still exports the
  imported names. The guard compares no
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
  with the `scripts` tree (`KIT_FILES`) in the order form the instance's index
  reads. A planning pass in the instance (the planner, on the operator's
  `planning:` dispatch), dedicated or part of a larger pass, copies it into
  the work-orders root as a new order and fills its placeholders: the starter
  remote and revision, the channel (`both`, `machinery` or `build`), and how
  refused or flagged paths resolve, as the operator words it in the pass. The
  pass writes only under `docs/`, as its branch must (WO-135); the preview
  itself is the order's first step. Each numbered step carries a typed role in
  a marker block (`<!-- dotln-step-roles:start -->` … `<!--
  dotln-step-roles:end -->`, a JSON array of `{ step, role }` with `role` from
  `executor`, `verifier`, `reviewer`, `release-close` and `operator`), so a
  check reads the roles without parsing prose; only the pull-request merge
  maps to `operator`. For the operator's instances the order is the recorded
  form of the README's session-run route; the README keeps offering that route
  to an instance owner without an order.
- **The order's plan** is the README's session-run route with the channel
  added. Fetch the starter remote; `git worktree add --detach
  .runtime/upstream-preview <revision>`, run and record `node
  .runtime/upstream-preview/scripts/launchpad.mjs preview --from <revision>`
  (the incoming revision's launchpad, since the instance's refuses a manifest
  naming a later schema), then remove the worktree; resolve each refused or
  flagged path as the order records the operator's word (keep the instance's
  bytes or take the incoming), stopping for a planning pass when a path has
  none; on the order's worktree branch `git merge <revision>`; run `build
  --take` or `build --pin` as the channel says; `node scripts/harness.mjs
  emit` and `check`; `node scripts/lineage.mjs index`; `node
  scripts/launchpad.mjs verify`; the Preflight line, `npm test` and `npm run
  test:docs`; then verification, final review, the pull request the operator
  merges, and release close (WO-210); the bootstrap after the merge is the kit
  runtime's duty (WO-226). The rollback form replaces fetch, preview and merge
  with `node scripts/launchpad.mjs rollback` and keeps the rest.
- **The order's criteria.** The preview is recorded before the merge; each
  refused or flagged path's resolution cites the operator's word; the merge
  names the planned revision; the channel's form ran and `harness check` passes; `kit-verify` passes; the
  consumer selection and the selected declared suites ran fresh; `npm test`
  and `npm run test:docs` are green; every step's typed role is a role, and
  only the pull-request merge is the operator's.

*The fork's gate: the consumer selection plus the instance's declared suites
(the planner's proposal, assumption 8).*

- **The consumer selection stays WO-213's.** In a kit root a plain or review
`npm test` runs the six structural tasks and `kit-verify` fresh
(`instanceSelection`), reuses nothing and never expands on an upstream update
or a missing comparison ref (WO-213-D014; product 07 §Preflight before the
full gate). This order adds no kit identity and no reuse: the 2026-10-13
pass's kit-conformance tier (a `kitCodeIdentity` over the manifest-listed
paths under which carried kit suites were reused) was struck by the 2026-10-21
pass, since D014 rejected reuse at committed code identity alone and the
carried suites are no longer in the consumer selection it would have spared.
Reopen only on an operator decision that reverses D014. - **The instance's own
additions.** `dotln.config.json` `suites` declares `{ name, command, sources
}`: a lowercase name, an argument array and contained relative path prefixes.
In a kit root the runner appends each declared suite whose `sources` hold a
path changed against the merge base with `origin/main`, run fresh and never
reused; a missing merge base selects no declared suite (the consumer default
is unchanged) unless the decisions file records an operator-approved exception
to product 07 §Preflight before the full gate; `--only <name>` runs one; a
name equal to a kit row refuses; a failing one fails the gate. Each extension
adapter names its covering suite (above). - **The overlay stays as it is.**
Under the consumer selection an overlay edit runs the six structural tasks and
`kit-verify` (the `generated` check covers the active bundle) and adds no
machinery row, as today. Whether customizing supports or loadouts through the
overlay (WO-076) should rerun core's machinery suites is the operator's open
question (Known issues); this order does not decide it. - **Core is
unchanged.** Outside a kit root, selection and reuse are today's;
`scripts/lib/gate-reuse.mjs` and `packages/skeleton/src/gate-evidence.mjs`,
common sources of every edition, are not edited, so no evidence edition goes
stale.

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
root Markdown, WO-135); the operator running the upgrade by hand (retired by the 2026-10-13
direction); a kit identity anywhere, in
`packages/skeleton/src/gate-evidence.mjs` (the gate research's suggested home,
a common source of every edition) or in a new module (struck with the reuse
tier by the 2026-10-21 pass, WO-213-D014);
an adapter whose missing suite only warns, the research's form (reopen when
an instance must land an adapter before its suite); instance suites as rows in the runner's table (a kit file, so the true-fork
path); adding machinery rows for an overlay edit now (it would decide the
operator's open question); an upgrade order that replaces the README's
session-run route for every instance owner (the route stays; the order is its
recorded form for the operator's instances, receipt 045).

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
   `vertical` row's `args` in `scripts/test-runner.mjs`; the runner fixture
   "vertical tasks preserve complementary coverage, guards and the two-task
   concurrency bound" (`scripts/test-runner.test.mjs`) asserts the row's exact
   sorted file list and gains the new file. Check: `vertical`,
   `runner-fixtures`.
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
5. `scripts/test-launchpad-export.mjs`: an export from a core checkout
   carries no path under `extensions/` and the manifest lists none;
   `scripts/test-launchpad-update.mjs`: in a fixture instance an update leaves
   `extensions/` byte-identical and refuses a planted kit path inside it as an
   instance-owned collision. Every new top-level `test(` case in this and the
   later steps is either listed in `scripts/fixtures/launchpad-cases.json`,
   with the count in the runner fixture "launchpad files retain all 34 cases…"
   raised, or written as a subtest of an existing case
   (`scripts/test-launchpad.mjs` is a barrel whose own cases never run).
   Check: `launchpad`, `runner-fixtures`.
6. `scripts/kit/dotln.config.example.json`: the `extensions` section, default
   root and no adapters, and an empty `suites` section. Check: the WO-074 criterion 1 case's `loadConfig` of the example
   (`scripts/test-launchpad-export.mjs`) equals the defaults (`launchpad`).
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
9. `scripts/launchpad.mjs`: `kitManifest` writes schema 2
   (`KIT_MANIFEST_SCHEMA_VERSION`, 1 at `926b8234`) with `build: { files,
   semanticHash, compilerPackageVersion }`, `files` the relative-import
   closure of `contributor.js` and `feedback.js` inside
   `packages/skeleton/dist/src/loadouts/` computed from the compiled import
   graph at export, the hash and version from the export's emitted harness
   manifest; `readPriorManifest` reads schema 1 as all machinery, and 2.
   Check: the WO-074 criterion 1 manifest case
   (`scripts/test-launchpad-export.mjs`) extended to the partition and to the
   closure's six files at the base (`launchpad`).
10. Same file: `planUpdate` (line 1384) takes `channel` and the prior
    manifest's `build` per the Design; `planKitUpdate` (line 1695) reads
    `--channel` or `build.channel`, applies the guard and the build-none
    refusal before any write, and under `machinery` writes `build.pin` into the destination's
    `dotln.config.json` through the configuration writer the instance actions
    use; `renderUpdatePlan` shows the partition and channel. Check, in
    `scripts/test-launchpad-update.mjs`: cases for the three channels and
    their previews, the guard (a minor change below 1.0, a pinned module
    missing an imported name, and a machinery module outside `build.files`
    that lost a name a pinned module imports each refuse before any write with
    the two choices), and a channel beside an overlay's `build: "none"`
    refusing before any write (`launchpad`).
11. Same file, in the in-instance revision preview only
    (`previewFromRevision`, line 1893): an absent manifest-listed kit path
    the incoming manifest still carries becomes its own local-removal row,
    marked unchanged upstream when its incoming hash equals its prior hash,
    and every other row and declared action still prints, exit 0; the
    from-core preview and the update keep refusing it before any write
    (FUP-9c558fa0f869290e). Check: a case beside the fetched-starter preview
    case in `scripts/test-launchpad-update.mjs` with a committed instance
    removal (`launchpad`).
12. Same file, `renderUpdatePlan` (line 1950): label and count a
    byte-identical replace row `unchanged` in the from-core preview and the
    update's summary, as for a revision preview (lines 1952 to 1963),
    leaving `planUpdate`'s kinds, the writes, the receipt and the WO-078
    update cases unchanged (FUP-bf112b957627334d). Check: the core preview case in
    `scripts/test-launchpad-update.mjs` lists no unchanged carried path as
    replace (`launchpad`).
13. Same file, `applyKitUpdate` (line 1801): before the journal's write
    (line 1813), the fail-closed check; before each replace whose row's
    `unchanged` flag (line 1430) is false, and each remove, the retained
    copy (`writeReplacement`); after the manifest write (line 1831), the row
    through a new `appendUpdateLog(destination, row)`, `preUpdateCommit`
    from `git rev-parse HEAD` under `exportEnvironment()` when the destination
    has a commit, else null. `scripts/lib/starter-refresh.mjs`: the refresh
    admits, and requires staged, the update-log path `applyKitUpdate`
    appended, resolved through `docRelative` against the starter, beside the
    plan, the manifest, the seeds and `CLAUDE.md`, so a release close's
    refresh no longer refuses "staged outside the plan" on the row. Check: the
    update case in `scripts/test-launchpad-update.mjs` asserts the row and
    copies; a case with the lane unwritable refuses before any write; the
    refresh case ("starter refresh publishes one verified commit and preserves
    every refusal boundary") asserts the refresh commit carries the log row
    (`launchpad`).
14. `scripts/kit/gitignore.template`: confirm the seeded `.gitignore`
    already ignores `docs/control/local/` (template line 15; asserted in
    `scripts/test-launchpad-export.mjs`) and record it; add a pattern
    only if the seed lacks it. Check: `git status` after step 13's update
    shows no retained copy (`launchpad`).
15. `scripts/launchpad.mjs`: `export function rollbackKit(destination)` per
    the Design (read the last row, refuse an absent log, a `rollback` row
    or a changed kit file, verify every restore source, then restore, unlink added files,
    reverse or list actions, write the prior manifest, append the row,
    print); CLI forms `export --update <dir> --rollback` and
    `rollback [<dir>]`. Check, in `scripts/test-launchpad-update.mjs`: (a)
    restore
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
    `packages/<name>/dist/` file. Check: cases in
    `scripts/test-launchpad-update.mjs` on a fixture instance that merged a
    starter revision, `verify` passing after `build --pin` (`launchpad`).
17. `scripts/lib/kit-gate.mjs` (new): `instanceSuiteRows(root,
    changedPaths)` per the Design (the declared suites through `loadConfig`,
    the changed paths against the merge base, none without one);
    `machinerySources["runner-fixtures"]` in `scripts/test-runner.mjs` gains
    the new module. `scripts/lib/gate-reuse.mjs` is not edited (a common
    evidence source; no kit identity exists). Check: `runner-fixtures`.
18. `scripts/test-runner.mjs`, the kit branch (`instanceSelection` and the
    instance rows): in a kit root, append the declared suites
    `instanceSuiteRows` selects to the consumer selection, run fresh with the
    reuse block still skipped; refuse a declared name equal to a kit row;
    `--only <declared name>` runs one. Cases in `scripts/test-runner.test.mjs`
    on a synthetic kit root: the consumer selection is unchanged when no path
    under a declared suite's `sources` changed; a declared suite runs only
    when a changed path lies under its `sources`, runs under `--only` and
    fails the gate when it fails; a missing merge base selects no declared
    suite; no carried kit suite enters the selection; outside a kit root the
    selection and reuse equal today's. Check: `runner-fixtures`.
19. `scripts/test-launchpad-export.mjs`: in a fixture export that declares
    one suite, after a change to a path under its `sources`, `npm test` runs
    the six structural tasks, `kit-verify` and that suite, and no carried kit
    suite; the case follows step 5's listing rule. Check: `launchpad`,
    `runner-fixtures`.
20. `scripts/kit/upgrade-order.template.md` (new), per the Design: the
    order form with placeholders for the starter remote and revision, the
    channel and the resolutions; its plan (the session-run route with the
    detached-worktree preview and the channel's build form), rollback form and
    criteria; the `dotln-step-roles` marker block giving each numbered step a
    typed role from the fixed set. Check: the WO-074 criterion 1 case lists it
    in the manifest (`launchpad`); in `scripts/test-launchpad-planning.mjs`,
    the template filled on the fixture instance's planning branch for a
    fixture revision indexes as an Open order under `npm run work-orders --
    index --check`, the branch changes no path outside `docs/`, every numbered
    step has a roles entry and only the pull-request merge maps to `operator`
    (`launchpad-planning`); in `scripts/test-launchpad-update.mjs`, a schema-1
    fixture instance previews a schema-2 starter revision through that
    revision's launchpad from a detached `.runtime/upstream-preview` worktree,
    as the plan prescribes, and the instance's own launchpad refuses the same
    manifest (`launchpad`).
21. `scripts/kit/README.client.md`: §"## Taking upstream updates" (from
    line 585 at `926b8234`; the executor re-reads it at the base) gains the
    log, the retained copies (a fresh clone falls back to the pre-update
    commit), the update's fail-closed refusal, both rollback forms, the
    reversals, the listed actions, the refusals, the fork's merged-row
    rollback and the re-emit that follows; its rows follow step 12 and name
    the revision preview's local-removal row (step 11); and the channel
    section (the build as the import closure, the three channels, the guard,
    the pin, the merge-path forms and the default). The section's session-run
    route (from "Inside an instance, its own session takes a starter update"
    through the update-pull-request paragraph) stays and gains the channel's
    build form after the merge and one paragraph on the upgrade order: for the
    operator's instances a planning pass cuts it from the template as the
    route's recorded form, and its executor runs every command, the re-emit
    and any rollback included, on the operator's word; an instance owner
    without an order keeps the route as written; from core, the update and a
    rollback are a role's. §"## Instance extensions" (new, after §Kit files
    and instance files): the root, the registration, the `source` exports,
    the record, the listed but unimported kinds, the covering suite, the
    review burden, and that the enterprise-tracker adapter belongs to the
    instance that needs it. §"## What runs here, and what does not" (line 388 at `926b8234`): beside
    the recorded consumer selection, the declared `suites` appended to it and
    run fresh, and the open overlay question. §"## First steps" item 2 (line 84): five `@dotln/*`
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
    clause and the adapter sentence gain their evidence) and §"## One workstream across repositories" (the update loop gains the
    channel, the upgrade order as the session-run route's recorded form and
    the declared suites, each with its evidence; the clause saying WO-207
    proposes the declared-suite tier keeps the operator's open overlay
    question);
    `docs/product/07-execution-guide.md` §"## Operator-opened planning pass"
    (in the operator's instances a planning pass cuts the upgrade order from
    the template as the recorded form of the session-run update, and the pass
    applies no kit file), §"### Where the control plane finds its
    documents" (the optional sections gain `extensions` and `suites`) and §"### Preflight before the full gate" (in an exported instance, the
    declared suites appended to the consumer selection, which the section's
    consumer rule keeps); `docs/evidence/WO-207/decisions.md` (the pinned build with the pack's reopening condition; the load record's
    place; the two §12 readings; the struck reuse tier and the overlay's
    status quo; a missing merge base's selection); the authority edition's
    deterministic re-mint through `npm run sync` (no harness edition exists:
    `harness-evidence` is a check); after a `resident-state.ts` edit, every
    edition's re-mint, the feedback re-mint and the live feedback episode; `npm run meta`;
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
5. The kit manifest (schema 2) names its build files as the relative-import
   closure of `contributor.js` and `feedback.js` inside
   `packages/skeleton/dist/src/loadouts/` (six files at `926b8234`), its
   semantic hash and compiler package version; a schema 1 manifest reads as
   all machinery (fixture).
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
   it, every imported name present in the pinned modules, every name a pinned
   module imports still exported by the machinery module outside `build.files`
   that it imports); a channel or pin
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
17. The consumer selection (WO-213-D014) is kept: in a kit root `npm test`
    and `npm test -- --review` run the six structural tasks and `kit-verify`
    fresh and append the declared instance suites criterion 18 selects, run
    fresh; no carried kit suite enters either selection and no row is reused;
    outside a kit root, selection and reuse equal today's (runner fixtures;
    one export case).
18. The instance's own suites (the planner's proposal, assumption 8): a
    declared suite runs when a path changed against the merge base lies under
    its `sources` and not otherwise; a missing merge base selects no declared
    suite, the consumer default unchanged, unless the decisions file records
    an operator-approved exception to product 07 §Preflight before the full
    gate; `--only <name>` runs it; its failure fails the gate; a name equal to
    a kit row refuses (runner fixtures).
19. The kit carries `scripts/kit/upgrade-order.template.md`,
    manifest-listed; filled on an exported instance's planning branch, it
    indexes as an Open order and the branch changes no path outside
    `docs/`; its plan previews the revision through that revision's own launchpad from
    a detached `.runtime/upstream-preview` worktree before it merges on the
    order's branch, runs the channel's `build` form, re-emits and checks the
    harness, indexes lineage, verifies the kit, and runs `npm test` and `npm
    run test:docs`; its rollback form runs `rollback` and the same checks; the
    `dotln-step-roles` block gives every numbered step a role from the fixed
    set and only the pull-request merge maps to `operator`; a schema-1 fixture
    instance previews a schema-2 starter revision that way while its own
    launchpad refuses the manifest (launchpad and launchpad-planning cases).
20. The client README's §Taking upstream updates documents the log, the
    retained copies, the fail-closed refusal, both rollback forms, the
    reversals and refusals, the re-emit, the unchanged rows, the revision
    preview's local-removal row, the channel section and the way in (the session-run update pull request,
    with the channel's build form after the merge, and the upgrade order a
    planning pass cuts as its recorded form for the operator's instances;
    every command a role's, on the operator's word, with nothing left to
    resolve or commit by hand; the route kept for an instance owner without an
    order); its
    §Instance extensions states the root, the registration, the `source`
    contract, the record, the unimported kinds, the covering suite and the
    review burden; its §What runs here, and what does not states the consumer selection, the
    declared suites appended to it and the open overlay question; its first steps name five
    workspaces; the example configuration carries the `extensions` and
    `suites` sections.
21. Write-backs land in place with no dated paragraph: product 03 §Platform
    and instance boundary (schema 2; the evidence for the extension point,
    rollback and channel; the queued list), §Package ecosystem (the
    extension root; the definition-pack alternative) and §Ports (the
    binding); product 12 §Arriving at the desk (the evidence) and §One workstream across repositories (the channel, the upgrade order as the
    route's recorded form and the declared suites, with the overlay question
    kept open); product 07 §Operator-opened planning pass (in the operator's
    instances a planning pass cuts the upgrade order as the recorded form of
    the session-run update), §Where the control plane finds its documents (the
    two sections) and §Preflight before the full gate (the declared suites
    appended to the consumer selection); the decisions file with the
    recorded choices; the publication locks refreshed. No byte figure binds
    these write-backs.
22. `npm test -- --review` and `npm run test:docs` green; the authority
    edition re-minted through `npm run sync` and `npm test -- --only
    harness-evidence` passing (a check, not an edition); after a `resident-state.ts` edit, every
    edition's re-mint, the feedback re-mint and the one live feedback
    self-host episode landed; `git diff --check` clean; no new dependency.

**Deliverables:** the `extensions` section, loader, record and `source`
selector with fixture adapters; the manifest partition, channel, guard,
pin, pinned emit and check, and merge-path forms; the preview's unchanged
and local-removal rows; the update log, retained copies, rollback forms
and reversals; the `suites` section and the declared-suite tier over WO-213's consumer
selection; the starter refresh admitting the log row; `verifyKit` honoring a
pin; the upgrade-order template; the
fixture cases; the example configuration and README; the write-backs and
re-mints.

**Preflight:** `npm test -- --only configuration-root` for steps 1–4, 7,
9–13 and 15–18 (it scans each changed non-test script for a literal
document root), `npm test -- --only vertical` for steps 2–4,
`npm test -- --only launchpad` for steps 5–6, 9–16 and 19–21,
`npm test -- --only harness-fixtures` for steps 7–8,
`npm test -- --only harness` and `npm test -- --only evidence-sources` for
step 7, `npm test -- --only runner-fixtures` for steps 2, 17–18 and every step that
adds a top-level launchpad case (5, 9–16, 19–20),
`npm test -- --only launchpad-planning` for step 20,
`npm test -- --only authority-evidence` and `npm test -- --only
harness-evidence` for step 22 (and `npm test -- --only artifact-evidence`,
`verification-evidence` and `feedback-evidence` after a `resident-state.ts`
edit), and
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
  core's machinery suites when it customizes supports or loadouts through its
  overlay (WO-076)? The 2026-10-13 proposal treated overlay changes as the
  instance's own; that is the planner's reading, not an operator decision
  (planning document §12.7). Until the operator answers, this order changes
  nothing for an overlay edit: under the consumer selection it runs the six
  structural tasks and `kit-verify` and adds no machinery row. Reopen when the
  operator answers; the answer may add machinery rows for the overlay. - The
  declared-suite tier is the planner's proposal (assumption 8), drawn from the
  2026-10-13 pass's read-only gate research. The kit-identity reuse tier
  proposed beside it was struck by the 2026-10-21 pass: WO-213-D014
  (2026-10-15) decided the instance's consumer selection, rejected reuse at
  committed code identity alone and reopens only when a consumer default
  selects a fixture; the carried suites the tier would have spared left the
  consumer selection with it. Reopen the tier only on an operator decision
  that reverses D014. - The personal fork records `npm test` at 11.6 s
  (v0.85.0 update branch) and 49.56 s in a fresh worktree (v0.88.0), seven
  tasks and no carried suite, 30 s of the latter a host-lane wait (WO-229
  measures lane waits); the 41.7 s figure is the WO-201 fixture's kit gate
  before WO-213. - Receipt 045 (2026-10-13): "only through an upgrade order"
  read as policy for every instance owner, while it records the operator's
  2026-10-13 direction for the operator's instances; the 2026-10-21 pass made
  the upgrade order the recorded form of the README's session-run route, which
  an instance owner without an order keeps. Reopen when an instance owner
  other than the operator takes a starter update outside an upgrade order and
  the README calls that unsupported.
- The enterprise-tracker adapter is the work instance's first extension,
  never written in core; what it needs beyond this contract arrives as a
  WO-193 request. The effect and projection kinds' first consumer is a
  later order, named by the request that asks for it.
- The load record's place is step 4's recorded decision: no writer admits
  `ExtensionLoaded` at `6dbd8771`, and the parts named a control-log writer
  the vertical does not use.
- FUP-d5d0ef5cf034102e (WO-076-D008) and FUP-9d397b57910ae6ed (WO-076-D011)
  were settled by WO-218 (D022 and D015; v0.87.0); step 7 still leaves
  `decodeBuildOverlay`, `overlayContributor` and `harnessInstallation`'s
  `build: none` branch unedited.
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
composes with; core's own gate selection and reuse; reversing WO-213-D014 or adding any kit
identity; a target repository's gate (WO-210); pushing releases into the
starter (WO-215) beyond admitting the log row in the refresh's staged-set
check; replacing the README's session-run route for an instance owner without
an order; merging the upgrade order's pull request (the operator's); the
bootstrap after the merged update (WO-226); deciding the overlay question.

**Operator-review assumptions**

1. One step back per rollback is the accepted shape; a deeper undo repeats
   rollback after the intervening rows are rolled back.
2. An action the rollback cannot reverse is listed, not reversed by guess.
3. The GitHub source's result shape is the port's contract; an adapter that
   needs more opens a WO-193 request.
4. Instance code loaded into the vertical's process under the harness's
   existing refusals is the accepted boundary for a first consumer;
   stronger isolation is a later decision.
5. The build is the two compiled definition modules with their
   relative-import closure under `packages/skeleton/dist/src/loadouts/`, and
   what they lower into; the hooks' runtime and the loadouts' imports outside
   that directory are machinery.
6. The personal instance keeps `both`; for the work instance the operator
   chooses per update, through the planning pass that cuts its upgrade
   order, and may stay pinned indefinitely, the true-fork path for the
   build alone, not for the machinery.
7. An update that cannot write its rollback record refuses, and unconsumed
   adapter kinds are listed without import, as the route document's §12
   readings recorded for this order's next amendment.
8. **The declared-suite tier is the planner's proposal, which the operator
   has not approved** (planning document §12.7): the instance's own declared
   suites selected by changed sources, appended to WO-213's consumer selection
   and run fresh, each extension adapter naming its covering suite. The
   kit-identity reuse tier proposed beside it on 2026-10-13 was struck by the
   2026-10-21 pass after WO-213-D014. It sits in steps 1, 3, 6 and 17 to 19
   and criteria 1, 17 and 18. If the operator rejects or changes it before activation, a
   planning pass amends those parts and the rest of the order stands. The
   overlay question stays open (Known issues).
9. A starter update reaches the operator's instances through the README's
   session-run update pull request, recorded by an upgrade order a planning
   pass cuts; the operator gives the word (the revision, the channel, how each
   refused path resolves, a rollback), types the dispatch phrases and merges
   the pull request, and a role runs every command and makes every commit
   (operator direction, 2026-10-13; planning document §12.1). This records the
   operator's direction for the operator's instances, not a policy for every
   instance owner (receipt 045).
