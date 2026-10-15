# WO-210 — An instance's own orders, a registered target's among them, publish and reach release close: an exported instance's release surfaces, seeds and refutation goal standard stop failing on core-only inputs; a target order is gated by the target's own declared tests, its passing final review binds the target commit and those tests' rows, its records land in the target's own documentation root as a records-only commit that `worktree publish --target-worktree` pushes after the reviewed commit and opens a pull request for under the registered profile and an operator grant, the instance keeps the control segment and a link to each record and publishes them with no release, a target-scoped planning pass publishes its documents into the same root, its close updates the clone's base itself and lists ignored directories once, and target-facing text names only target-native references (v0.82.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. The release surfaces gain a kit mode for
`docs/LEGAL.md` and a target-order rule; release close reads carried inputs
in a kit; `scripts/release.mjs` exports a read-only manifest preview; the kit
carries one more document; the seeds gain a version and a release block; the
goal standard gains a kit composition and an optional instance purpose; two
suite rows run in a kit; the outward lint gains a rule; the episode route
renders target-native evidence; target orders gain a publication form, two
optional fields on their final-review event (`targetSubject`, `targetGate`),
a records-only commit with a new control event (`TargetRecordsCommitted`), a
no-release records publication of the control segment and the links, and a
close that fetches the target's base; a registered repository gains two
optional configuration keys (`gate`, `documentationRoot`); the target gate
runner (`node scripts/target-gate.mjs`), a `resume target-records` action and
a `plan target-publish` action are added. Core's surfaces, goal standard and
historical subject hashes, a self order's gate claims and publication, and
the episode route's binding, authorization and push lane keep their behavior.
An instance exported before this order that takes the update and holds an
order fails the `release-surfaces` row of each gate that selects it while a
self order's heading carries no version or its README holds no release block
(`scripts/release.mjs` lines 466-471 and 579-590), until the README's
one-time remedy is applied, which the executor of the instance's next order
makes on the operator's word. In an instance whose registered repository
declares no `gate`, a target order whose met criterion names a gate now
refuses at completion, naming the missing declaration. Assigned at activation
under the standing opt-out default.
**Cost:** adds a kit branch to `licenseSurfaceRules`
(`scripts/license-surfaces.mjs`); in `scripts/release.mjs` a target-order
branch of `checkSurfaces` and `releaseBlockRule`, a kit path for
`compatibility`, a named zero-marker remedy in a kit and an exported
`previewReleaseManifest`; one kit document (`KIT_FILES`); a version,
classification and release block in two seeds; a kit goal-standard
composition and a purpose declaration (`scripts/lib/plan-subject.mjs`); two
rows that run in a kit (`scripts/test-runner.mjs`); the `identifier.runtime`
rule (`scripts/lib/outward-lint.mjs`); `targetNativeReference`,
`targetChangeSection`, `targetGateSection` and a frozen per-row evidence table
(`scripts/lib/github-body.mjs`) used by the episode body, the session body and
the disposition reply; `targetSubject` and `targetGate` on a target order's
passing `FinalReviewCompleted` (a few host Git reads of the target at that
transition) with their fold checks; two optional keys on a registered
repository, `gate` and `documentationRoot`, and `targetDocRelative`
(`scripts/lib/config.mjs`); a working-directory and a timeout option on the
bounded wrapper (`scripts/lib/bounded-command.mjs`); the target gate
(`scripts/lib/target-gate.mjs` and the runner `scripts/target-gate.mjs`),
whose rows a target order's gate claims resolve to
(`scripts/lib/handoff-ledger.mjs`, `scripts/lib/lifecycle-evidence.mjs`); the
records-only commit (`scripts/lib/target-records.mjs`, the `resume
target-records` action) with the `TargetRecordsCommitted` event and its fold;
the `worktree publish WO-NNN --target-worktree` form and
`publishTargetWorktree` with a host publication log under the main checkout's
ignored control local directory; a no-release records publication that proves
an unchanged launchpad code identity in place of a reviewer `npm test` row
(`scripts/lib/release-records.mjs`); a target-scoped planning publication
(`scripts/lib/target-planning.mjs`, the `plan target-publish` action); the
records' links on the generated index (`scripts/work-orders.mjs`); a target
order's briefings naming the documentation root and the target gate
(`scripts/resume.mjs`); a close that fetches the target's base and
fast-forwards the clone's, and a directory-collapsed close refusal with its
remedy; new or changed cases in the `license-fixtures`, `launchpad`,
`runner-fixtures`, `launchpad-planning`, `outward-lint`, `github-body`,
`target-publish`, `resume`, `target-worktree`, `configuration-root`,
`worktree` and `work-orders-fixtures` suites. Removes: an instance order's
failure at `worktree publish`'s surface step, at prepare from the seeds and at
the manifest build; core's purpose, critical-path targets and three links to
files the kit lacks from an instance's refutation subject; the README's
`docs/LEGAL.md` limit and two core-only rows; the store identifiers a target's
pull-request body and replies carry (WO-118-D010); the hand merge that is
today the only way WO-072's fixture closes a target order; release notes
required of a branch that releases nothing; a launchpad `npm test` row
demanded of a target order's completions and of its records publication,
which in the operator's fork is the kit's own gate (fresh in 41.7 s in the
fixture export, planning document §12.7), replaced by the target's own
declared tests, which no lifecycle step runs today; the instance's own copy
of a target order's decisions and reports, which become a link; the update of
the target clone's base branch after a merge, which today only a hand Git
step performs;
the per-file ignored listing; usage errors that depend on a worktree having
main checked out; and, by
merging three orders that would run one after another on one route, two
order cycles: two activations, two verifications, two final reviews and two
release closes, each with its full gate runs (planning document §12: 2.29
full runs and 61 minutes of full gate per closed order since receipt 044). No
constituent owed a live feedback episode. Wall-clock: `launchpad-planning`
grows by a release drive (about twenty lifecycle commands, four surface checks
each running the six `npm publish --dry-run` rules of
`scripts/license-surfaces.mjs` lines 95-151, two refute prompts) and a
target-order drive through clone, start, review, two publications to a `gh`
stub and close; it read 33.15 s and 40.8 s at WO-202's review (WO-202-D013).
`target-worktree` grows by the binding, publication, close and route cases
and by the target gate, records-only commit, planning publication and base
update cases (10 tests in 27.8 s, WO-072-D007); `outward-lint`,
`github-body`, `target-publish`, `resume`, `license-fixtures`,
`configuration-root`, `runner-fixtures`, `worktree` and `work-orders-fixtures`
grow by their cases; the executor records each against the base. A target
order's gate runs take whatever the target's declared commands take: no
real-fork gate duration is recorded in core (planning document §12.7), so
DotLn-Angular's is unknown until it declares its gate. An instance's three
gate selections gain two rows, measured by WO-201's export case. Context
bytes: the four marker lines this planning pass adds to product 07
§Goal-aligned decisions (about 130 bytes) enter every role's directed read of
that section; the client README grows by a block and four paragraphs; product
07 §Operator resume phrases — how you get dispatched gains two sentences, in
no role's standing directed read (§Read order for a cold start); a target
order's four briefings grow by about two sentences each and its pass message
by two; products 03 and 12 and `docs/repositories/README.md` change by a
sentence or a paragraph each, in place. Commands: none new for the operator
or a self order; for a target order the roles run `node
scripts/target-gate.mjs WO-NNN [--review]` and `npm run resume --
target-records`, and a target-scoped planning pass runs `npm run plan --
target-publish`; a session publish and a planning publication each make one
`gh` availability check, one push and one `gh pr create`; a target order's
release close makes one fetch. Tokens are unknown until run. Steps: a target
order's executor and verifier run the target gate in place of `npm test`; its
final review gains four (commit the reviewed target change before the result;
run the target gate's review selection unless a passing row stands at those
bytes; record the records-only commit; run the target publish beside the
records publish); an instance exported earlier pays one remedy step, which
the executor of its next order makes; the operator types the same phrases and
merges the same pull requests and no longer updates the clone's base; a self
order's steps are unchanged. Re-mints: none; no edited file is in
`FEEDBACK_SOURCE_PATHS` (`packages/skeleton/src/feedback-audit.ts` line 15)
or registered in `scripts/lib/evidence-sources.mjs`; the registered
`scripts/lib/paths.mjs` (lines 121, 177 and 344) and
`scripts/lib/gate-evidence.mjs` with the skeleton module it re-exports (lines
56-57, 157, 255 and 326) are imported, never edited; `scripts/lib/config.mjs` is excluded from every
edition because its repository validation is outside their recorded behaviour
(`evidenceImportExclusions`, lines 367-370); `package.json`, a common source
of every edition (line 10), is not edited, so the runner has no npm script.
Declared machinery sources
change (`scripts/test-runner.mjs` `machinerySources`, lines 113-139, 155, 184,
207-209, 250-276, 319-321 and 366-367; `configuration-root` covers `scripts/`,
line 242), so `npm test -- --review` runs before handoff.
**Nomination provenance:** filed by the 2026-10-13 standard planning pass
(branch `planning/2026-10-13-standard-pass`, base `main` at `6dbd8771`;
[planning document](../planning/standard-pass-2026-10-13.md) §4 and §5) as
three orders. WO-210 rested on the operator's direction of 2026-10-11 that the
instance becomes usable for the operator's own planning and orders after
WO-203 (`docs/planning/sequence.md` lines 36-43 at `6dbd8771`), a premise the
pass found false at publication (`scripts/worktree.mjs` lines 745-760 with
`scripts/license-surfaces.mjs` lines 218-243) and in the refutation's goal
standard (`scripts/lib/plan-subject.mjs` line 562); it carried
FUP-a065bc5b99e40660 (WO-202-D010, VER-001 F2: the release-surface read fails
on `docs/LEGAL.md` once an instance order exists) and FUP-3cceac0fff2dba94
(WO-202-D012, VER-001 F4: the instance refutation's goal standard carries
core's purpose and critical-path targets). WO-211 was the pass's first
finding: a session-driven target order has no publication route, although
WO-083's step 5 and criterion 1 and WO-192's objective rely on one; the
2026-10-11 route pass wrote that route and planning receipt 044 did not catch
it; it carried FUP-00b15d92d53011b2 (WO-072-D010: the target close's
ignored-material refusal lists every file and names no remedy) and
FUP-a5c6ac8cb40bd52a (WO-185-D016: publish argument checks after the
main-worktree lookup), whose reopening condition its design met. WO-214 rested
on receipt 044's WO-118 criterion:3 known issue, whose condition occurred
(WO-118 FINAL-001), and carried FUP-a272d577fd351b43 (WO-118-D010:
target-facing text carries runtime identifiers outside the declared outward
set); the pass had split it out of WO-211 under the 2026-09-08 cut (one seam
and one outcome per order), which the operator has since said is not a
standing rule, and this merge undoes that split. Merged by the 2026-10-13
standard planning pass under the operator's sizing direction (planning
document §12): WO-211 and WO-214 are absorbed into this order. Amended in a
second round by the same pass under the operator's 2026-10-13 directions on
target-order gates, on where a repository's knowledge lives, on working only
from a starter fork and on making no repository change by hand (planning
document §12.7, §12.8 and §12.10): the target gate, the documentation root,
the records-only commit, the instance's links, the reduced records
publication, the target-scoped planning publication and the close's own base
update join this order. They stay in this one order because each is a
precondition of the same publication and close: they edit the functions this
order already changes (`final-review-result`, `publishTargetWorktree`, the
self publish, the target close and the export case), and a separate order
would re-edit them and pay another order cycle on the same route.
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
fixture exports and launchpads, synthetic orders and references, scratch bare
origins and targets with a `gh` stub, and a synthetic registered repository
only; nothing of any instance or operator repository.
**Depends on:** WO-072 merged (closed, v0.75.0: target orders, their
`repositoryId` in control state, the target worktree lifecycle and registries,
the launchpad records branch and the no-release close); WO-201 merged (closed,
v0.77.0: the runner's kit mode and the export gate case); WO-202 merged
(closed, v0.78.0: the planning commands in a kit, the zero-order kit branch of
`check-surfaces --local` and the export fixture this order extends); WO-064
merged (closed, v0.43.0: the episode route, its generated body, readiness rows
and outward lint, its push lane and its operator-grant rule, reused and kept);
WO-066 merged (closed: the pull-request loop whose disposition reply this
order maps); WO-118 merged (closed, v0.80.0: D010's observation). No queued
order. The marker blocks in product 07 §Goal-aligned decisions are written by
this planning pass before activation; this order only reads them.
**Recommended placement:** position 2 of the serial queue (planning document
§12), after WO-215 and before WO-213: the operator's instance cannot publish
or release its own orders, gate a target order on the target's own tests or
keep a target's records in the target until this order lands, and the fork's
foundational Angular work starts at its release (planning document §12.4);
WO-213, WO-192 and WO-083 depend on it (hard). It follows WO-215, whose
release close carries each later core release into the starter the fork takes
it from (`docs/planning/sequence.md`). A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-072",
    "relation": "satisfied-by-close",
    "reason": "target orders, their repositoryId in control state, the target worktree lifecycle, its registries, the launchpad records branch and the no-release close this order repairs, publishes from and closes through"
  },
  {
    "workOrderId": "WO-201",
    "relation": "satisfied-by-close",
    "reason": "the runner's kit mode and the export gate case that judges the two suite rows this order lets run in a kit"
  },
  {
    "workOrderId": "WO-202",
    "relation": "satisfied-by-close",
    "reason": "the planning commands in a kit, the zero-order kit branch of check-surfaces and the export fixture this order extends"
  },
  {
    "workOrderId": "WO-064",
    "relation": "satisfied-by-close",
    "reason": "the episode route's generated body, readiness rows, outward lint, push lane and operator-grant rule, which this order changes, reuses and keeps"
  },
  {
    "workOrderId": "WO-066",
    "relation": "satisfied-by-close",
    "reason": "the pull-request loop whose disposition reply this order maps to target-native references"
  },
  {
    "workOrderId": "WO-118",
    "relation": "satisfied-by-close",
    "reason": "the delivered pull request and reply in which D010 observed the runtime identifier forms"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Preflight before the
full gate; §Goal-aligned decisions (read only: the `dotln-goal-rules` blocks
this planning pass adds); §Operator resume phrases — how you get dispatched
(the final-review and release-close authority paragraph and the publication
paragraph after it); §Workflow closeout and releases (the registered-target
close paragraph, the `worktree publish` paragraph and the "Target publish
(WO-064)" paragraph); §Where the control plane finds its documents (the
target-orders paragraph); §Independent workflows and integration
(verification and final review judge their recorded subject);
§Operator-opened planning pass (the platform-first standard paragraph);
§Discipline (the bounded wrapper); 03-architecture.md §Platform and instance
boundary (the kit slice; the license posture); 02-domain-model.md §Actors and
episodes (the edge) (the `PullRequestOpened` paragraph); `docs/PLAYBOOK.md`
§The loop, per work order (steps 2, 4 and 5); `docs/LEGAL.md` §Current state;
`docs/evidence/WO-202/decisions.md` D002, D010, D012 and D013;
`docs/evidence/WO-072/decisions.md` (D002, D003, D007, D008 and D010 among
them) and `docs/work-orders/WO-072-target-worktree-lifecycle.md` Execution
plan step 1 (the two-worktree shape);
`docs/evidence/WO-064/decisions.md` D001 to D004;
`docs/evidence/WO-118/decisions.md` D006 and D010;
`docs/evidence/WO-185/decisions.md` D016;
`.claude/skills/dotln-reviewer/SKILL.md` (read only: the pass procedure and
authority sentence); `scripts/release.mjs` (`repositoryFile`,
`readWorkOrderAuthority`, `releaseBlockRule`, `checkSurfaces`,
`compatibility`, `criticalNotes`, `baseManifest`, `close`, the
`check-surfaces` action); `scripts/license-surfaces.mjs`;
`scripts/lib/release-preparation.mjs`; `scripts/worktree.mjs` (`main`,
`readTrackedTextAtHead`, `startTargetWorktree`, both `publish` forms);
`scripts/resume.mjs` (`appendTransition`, `final-review-result`);
`scripts/lib/control.mjs` (the fold); `scripts/lib/lifecycle-evidence.mjs`;
`scripts/lib/release-records.mjs` (`reviewedProductGate`);
`scripts/lib/target-worktrees.mjs`; `scripts/lib/target-worktree-close.mjs`;
`scripts/lib/target-publish.mjs` (`readTargetPublishRequest`, `pushUrl`,
`pushObservedCommit`, `disposeReviewThread`, `authorizePublication`,
`observeTarget`, `readinessArtifacts`, `lintArtifacts`,
`publishTargetOrder`); `scripts/lib/github-body.mjs`;
`scripts/lib/outward-lint.mjs`, `scripts/outward-lint.mjs` and
`docs/control/outward-vocabulary.json`; `scripts/lib/authority-grants.mjs`;
`scripts/lib/config.mjs` (repository and profile keys);
`scripts/lib/contributions.mjs`; `scripts/lib/plan-subject.mjs` (`section`,
the kit standard inputs, `buildGoalSubject`); `scripts/launchpad.mjs`
(`KIT_FILES`, the seeds); `scripts/kit/README.client.md` §First steps,
§Planning in this instance and §What runs here, and what does not;
`scripts/kit/first-order.template.md`; `scripts/test-launchpad-planning.mjs`;
`scripts/test-target-worktree.mjs`; `scripts/test-target-publish.mjs`;
`scripts/test-launchpad.mjs` (the WO-201 case from line 741; a fixture
handoff at lines 1238-1260); `scripts/test-runner.test.mjs` (the kit-only
case at line 97); `scripts/test-license-surfaces.mjs` (`withFixture`);
`scripts/test-outward-lint.mjs`; `scripts/test-github-body.mjs`;
`scripts/test-control-segments.mjs`; WO-083's Design, step 5 and criterion 1
and WO-192's Objective and Authority bullet, as the consumers. Second round:
the [planning document](../planning/standard-pass-2026-10-13.md) §12.7,
§12.8 and §12.10; 03-architecture.md §Platform and instance boundary (the
target's documentation root); 12-workstream-application.md §One workstream
across repositories; 07-execution-guide.md §Preflight before the full gate
(a target order's own checks) and §Operator-opened planning pass (a planning
pass's pull request and its authorization); `docs/repositories/README.md`
(registration keys and classes); `docs/evidence/WO-201/gate-in-kit.json`;
`scripts/lib/config.mjs` (`REPOSITORY_KEYS`, `validateRepositories`,
`resolveRoots`); `scripts/lib/handoff-ledger.mjs` (`GATE_NAMES`,
`requireGateClaims`); `scripts/lib/bounded-command.mjs`;
`packages/skeleton/src/gate-evidence.mjs` (`gateTreeHash`,
`recordGateChecks`, `readGateChecks`, `findGateCheck`, `gateCodeIdentity`;
read only); `scripts/lib/evidence-sources.mjs` (`commonSources`,
`evidenceImportExclusions`); `scripts/lib/git.mjs` (`removeMergedBranch`);
`scripts/work-orders.mjs` (the row and card of a target order);
`scripts/refute-plan.mjs` (`plan start`); `scripts/test-configuration-root.mjs`;
`scripts/test-runner.test.mjs` (the `requireGateClaims` and
`reviewedProductGate` cases); `scripts/test-work-orders.sh`; WO-213's record
screen, which later covers the records this order writes into a target.

**Objective:** In an exported instance, the instance's own orders, a
registered target's among them, publish and reach release close; a target
order is gated by the target's own declared tests and its records stay with
the target; and every text a target receives names only target-native
references. `release
check-surfaces` in every form, `license-surfaces` and therefore a self
order's `release prepare`, `worktree publish` surface step and `release
close` judge the instance's own surfaces and never fail on a core-only input
the kit does not carry: `docs/LEGAL.md`'s pins are reported unavailable by
name unless the instance declares that file, which is then judged; release
close reads its manifest template and the event-envelope schema version from
carried inputs; the seeded first order and README carry the first version and
release block. A registered repository may declare in the launchpad
configuration a `gate` (named commands with their timeouts and a plain and a
review selection) and a `documentationRoot` (default `docs`, laid out as the
launchpad's default document roots, so core's own `docs/` qualifies). `node
scripts/target-gate.mjs WO-NNN [--review]` runs a selection in the target
worktree under the bounded wrapper and records rows bound to the target
worktree's exact bytes, its HEAD and the selection; a target order's
completions resolve every gate claim except the document gate to those rows,
and failed, stale or missing target evidence refuses them. A
registered-target order's passing `final-review-result` records the target
commit it reviewed and the target gate's review rows at that commit; `npm run
resume -- target-records` then writes the order's file, decisions,
verification and final-review reports into the target's documentation root as
one records-only commit after the reviewed commit and records, in the
instance's control state, the repository, commit and path of each, which the
generated index shows. `worktree publish WO-NNN --target-worktree --branch
<type>/<slug> --title "<title>" --body-file <path>` pushes exactly that
records-only commit (refusing one that touches anything outside the root, and
gate evidence that failed, is stale or is missing) to the named branch on the
target's origin and opens one pull request against the registered base
branch, only when the registered authority profile allows `repo.push` and
`pr.open` and an admitted operator grant names both, after the branch, every
commit message, the title and the body pass the outward lint, with every
refusal before the first remote call and no launchpad branch moved. The
order's records branch carries the control segment, raw evidence and the
links, passes the committed surface check without a version and publishes
through the self form with no release-notes file and, while its launchpad
code identity is unchanged, with no launchpad `npm test` row; a target close
fetches the target's base branch and fast-forwards the clone's itself, keeps
WO-072-D003's refusal, lists each ignored directory once and names the
remedy. A target-scoped planning pass publishes its planning document and the
target's product-document edits into the same root through an ordinary pull
request. The outward lint
refuses runtime store identifiers in every artifact kind, and the episode
route's body and disposition reply cite commits, sections and outcomes while
recorded payloads and `deliverableReady`'s rows keep the judgment's
references. In an instance the refutation's goal standard is the
`dotln-goal-rules` blocks of product 07 §Goal-aligned decisions plus the
instance's declared purpose, named unavailable when undeclared. Core's
surfaces, goal standard and historical subject hashes and the episode route's
binding, authorization and push lane are unchanged, and so are a self order's
gate claims. The client README states what an instance's refutation judges,
what its release surfaces check, what a target order's publication needs and
how a registered repository declares its gate and documentation root.

**Observed gap (dated 2026-10-13 at main 6dbd8771):**

- **Publication stops at the surface step.** The self `worktree publish` runs
  `node scripts/release.mjs check-surfaces --committed WO-NNN` and returns
  its failure (`scripts/worktree.mjs` lines 745-760). `checkSurfaces`
  (`scripts/release.mjs` line 759) always appends `licenseSurfaceRules` (line
  796), whose pin rule reads `docs/LEGAL.md` and records `FAIL
  license-surfaces docs/LEGAL.md pins` when it is missing
  (`scripts/license-surfaces.mjs` lines 218-243). The kit does not carry that
  file (`KIT_FILES.documents`, `scripts/launchpad.mjs` lines 190-195;
  `UPSTREAM.md` names it as an upstream pointer, lines 500-503). The action's
  only kit branch (`scripts/release.mjs` lines 3085-3095) covers `--local`
  with no order; `release close` runs the same check before any tag (lines
  2336-2359). WO-202-D010 observed `check-surfaces --local` exit 1 on the
  release block and the `docs/LEGAL.md` pins once WO-001 was activated and
  versioned.
- **The seeds cannot be prepared.** The seeded first order's heading carries
  neither a version nor the `(version assigned at activation)` placeholder,
  and the template has no Release classification
  (`scripts/kit/first-order.template.md` lines 1-5); `planReleasePreparation`
  refuses both (`scripts/lib/release-preparation.mjs` lines 140-158) and
  refuses a first target with no observed tag (lines 181-184). The seeded
  README (`scripts/kit/README.client.md`, written by `scripts/launchpad.mjs`
  line 922) holds no `DOTLN-RELEASE` marker; prepare refuses without one
  ordered block (lines 160-169) and `releaseBlockRule` fails on zero markers
  (`scripts/release.mjs` lines 579-590). D010 read that FAIL as order state
  prepare writes; prepare rewrites an existing block and never creates one.
  D010's prepare attempt stopped earlier, at the branch-name check.
- **Release close reads two core-only inputs after the surface check.**
  `baseManifest` (`scripts/release.mjs` lines 1222-1240) reads
  `docs/releases/tag-manifest.template.json` through `repositoryFile`, which
  throws on a missing path (lines 270-276); the kit lacks it. `compatibility`
  (lines 901-912) reads `packages/kernel/src/types.ts`; the kit carries
  `dist/src` only (`RUNTIME_OUTPUT`, launchpad.mjs line 85), committed in an
  instance (`scripts/kit/gitignore.template` line 31). The kernel declares
  `readonly schemaVersion: 1` on `EventEnvelope` (`packages/kernel/src/types.ts`
  line 18) and builds declarations; this checkout's uncommitted build output
  `packages/kernel/dist/src/types.d.ts` carries it at line 15 (that an
  export's build matches is an inference). The dry run and the publishing
  close both reach `baseManifest` (lines 2443-2451); no fixture runs close in
  an export.
- **A target order's records branch cannot publish.** `readWorkOrderAuthority`
  requires one strict heading version (`scripts/release.mjs` lines 466-471)
  for every order, including a registered-target order, whose state carries
  `repositoryId` (lines 411-416) and whose close records `no-release` before
  any surface rule (lines 2299-2319). WO-072's fixture target order has no
  heading version (`scripts/test-target-worktree.mjs` line 118). Its records
  branch reaches main through the self path (WO-072 Execution plan step 1),
  whose surface step refuses on the heading and whose release-notes step
  requires notes for every publication (`scripts/worktree.mjs` lines 784-806);
  WO-072's fixture merges that branch by hand.
- **No route publishes a session-driven target order.** `worktree publish
  WO-NNN --target <request.json>` (`scripts/worktree.mjs` lines 701-725)
  needs a request with `loadout` and `store` (`readTargetPublishRequest`,
  `scripts/lib/target-publish.mjs` lines 80-127), and `publishTargetOrder`
  (line 1054) binds the source-change episode in that store (`readEpisode`,
  lines 553-592). WO-072's start prints a session handoff (`cd <target>`,
  `codex`, `resume: next`; `scripts/worktree.mjs` lines 458-462) and creates
  no episode store (`targetStartPlan`, `scripts/lib/target-worktrees.mjs`
  lines 161-169). The self form pushes the launchpad's own `wo-NNN` to the
  launchpad's origin (lines 726-868, 738-744, 844-860); the target branch is
  never pushed. `docs/PLAYBOOK.md` lines 255-258 say "target publication
  policy remains separate", WO-072 lists publishing as a non-goal (its line
  315), and its fixture closes a target order only by merging both `wo-999`
  branches by hand (`scripts/test-target-worktree.mjs` lines 503-565).
- **Its consumers assume one.** At `6dbd8771` (line numbers of that
  commit), WO-083's step 5 publishes with `worktree
  publish WO-NNN --target <request> --require-deliverable-ready` (WO-083 lines
  256-261) and its criterion 1 names the target pull request opened by
  `worktree publish` (line 299), on a route driven by WO-192's router or
  hand-opened sessions (lines 202-207). WO-192 carries an order "to a pull
  request ready to merge" (its lines 137-139) under a final-review authority
  that pushes the order's branch and opens the pull request (lines 245-248),
  and leaves publication to fixtures (lines 397-399).
- **Final review's authority names only the self branch.** Product 07
  §Operator resume phrases — how you get dispatched lets a passing reviewer
  commit the reviewed state, push only its work-order branch and open the
  mergeable pull request, committing after the recorded pass. The generated
  reviewer skill (`.claude/skills/dotln-reviewer/SKILL.md`) commits after the
  passing result, runs only the self `worktree publish`, and says the phrase
  authorizes only pushing its WO branch and opening its PR.
- **Nothing binds a target commit to the passing final review.** Every
  transition run from a target worktree acts on the order launchpad
  (`repoRoot` is `findLaunchpad()`, `scripts/resume.mjs` line 133;
  WO-072-D002). `VerificationCompleted` (lines 1505-1514) and
  `FinalReviewCompleted` (lines 1638-1648) record report path and hash,
  verdict, actor and `requireLifecycleEvidence(repoRoot, ...)`;
  `appendTransition` adds the launchpad's checkpoint (lines 311-337;
  `scripts/lib/checkpoint.mjs` lines 8-46). That evidence is the launchpad's
  `gateTreeHash` (`scripts/lib/lifecycle-evidence.mjs` line 74) and its `npm
  test` row (lines 124-127 and 226-245), keyed by the launchpad's
  `gateCodeIdentity` (`packages/skeleton/src/gate-evidence.mjs` line 756),
  which `reviewedProductGate` compares with the launchpad's HEAD
  (`scripts/lib/release-records.mjs` lines 91-139). The fold keeps a target
  order's `repositoryId` and `baseCommit` from activation
  (`scripts/lib/control.mjs` lines 259-276) and nothing of the target at the
  review (lines 336-343). The target's commit appears in no event; a report
  can name it only in prose, which no check may read.
- **The target branch's name fails the outward lint.** Both worktrees use
  `wo-NNN` (`scripts/lib/target-worktrees.mjs` line 122); the branch rule
  requires `<type>/<slug>` (`scripts/lib/outward-lint.mjs` lines 98-103). A
  probe of `lintOutwardArtifact` at 6dbd8771 with
  `docs/control/outward-vocabulary.json`: `wo-211` is refused `branch.shape`;
  `feat/target-session-publish` passes.
- **A session order has no compiled loadout to authorize against.** The
  episode route authorizes through the compiled loadout's operator grant, its
  WorkOrder operations and the kernel guard (`authorizePublication`,
  `scripts/lib/target-publish.mjs` lines 630-671). A target order's authority
  is its registered `authorityProfile` (`scripts/lib/config.mjs` lines 83-92
  and 205-270), echoed by the start handoff (`scripts/worktree.mjs` line
  462); `operator` grants are admitted only from the committed
  `packages/skeleton/loadouts/grants.json` (`scripts/lib/authority-grants.mjs`
  lines 21-48), which the kit seeds as `[]` (`scripts/launchpad.mjs` line
  1007).
- **Target-facing text carries runtime store identifiers the lint passes**
  (FUP-a272d577fd351b43). `readinessArtifacts` builds `commit:`
  (`scripts/lib/target-publish.mjs` line 939), `source-event:` (929-934),
  `baseline-event:` (979-986), `verification:` (806) and `review-event:`
  (1000-1006) references and the `delivery-preparation` alias (892);
  `generateTargetPullRequest` prints each Deliverable-ready row's and known
  review item's references (`scripts/lib/github-body.mjs` lines 1035-1038 and
  1044-1049); `disposeReviewThread` posts the judgment's references
  (`scripts/lib/target-publish.mjs` lines 445-449). A probe at 6dbd8771: a
  pr-body holding `source-event:evt_3`, `verification:vertical_k_0`,
  `review-event:evt_9`, `delivery-preparation#/checks` and
  `contract:criterion:0` passes `lintOutwardArtifact`, whose only callers are
  `target-publish.mjs` (line 1026) and its CLI (`scripts/outward-lint.mjs`
  line 68). WO-118-D010 observed these forms in a delivered pull request and
  a posted reply. WO-083's Design keeps the launchpad's vocabulary in the
  launchpad, and its criterion 1 judges the pull request with this lint.
- **The target close lists every ignored file and names no remedy**
  (FUP-00b15d92d53011b2): `closeTargetWorktree` runs `git ls-files --others
  --ignored --exclude-standard` without `--directory` and throws the joined
  list (`scripts/lib/target-worktree-close.mjs` lines 84-106) before the
  dry-run return (line 107); WO-072-D010's probe refused `deps/pkg/a.js`,
  `b.js` and `c.js`.
- **Argument checks follow the main-worktree lookup.** `mainWorktree(toolRoot)`
  (`scripts/worktree.mjs` line 581) runs before the `publish --target`
  argument checks (lines 704-712), so a usage error depends on some worktree
  having main checked out (FUP-a5c6ac8cb40bd52a).
- **The goal standard carries core's targets.** `buildGoalSubject` sets
  `goalStandard` to the whole carried §Goal-aligned decisions
  (`scripts/lib/plan-subject.mjs` line 562) while it reports the instance's
  critical path unavailable (lines 563-574). That section states core's
  purpose (its opening paragraph) and critical-path targets with a link to a
  file the kit lacks (the next paragraph), and links a core planning document
  (the Platform lens paragraph) and a core receipt (the shared-supports
  paragraph). WO-202-D012 observed it in the fixture's refute prompt. An
  instance `docs/product/00-vision.md` must carry core's thesis headings
  (plan-subject.mjs lines 18-27 and 361-365), so it is no neutral home for a
  purpose.
- **A target order is gated on the launchpad, and the target's own tests
  never run** (planning document §12.7). `requireGateClaims`
  (`scripts/lib/handoff-ledger.mjs` line 221) needs, for a criterion recorded
  met whose text matches `GATE_NAMES` (lines 51-55, `/\bnpm test\b/` among
  them), a passing complete launchpad `npm test` row at the launchpad's code
  identity, and runs the launchpad document gate inline; so a criterion that
  names the target's own `npm test` demands a launchpad row. Final review only
  advises when no launchpad row exists (`scripts/lib/lifecycle-evidence.mjs`
  lines 124-131). A repository class's `checks` reach only the resident path
  (`applyRepositoryClass`, `scripts/lib/authority-grants.mjs` line 69), whose
  named test commands run with a 30-second limit
  (`packages/skeleton/src/verification-worktree.ts` line 180) that may be
  insufficient for browser or integration suites; the human lifecycle never
  reads classes. `findGateCheck` and `requireGateChecks`
  (`packages/skeleton/src/gate-evidence.mjs` lines 1007-1037) key a row other
  than `npm test` by `gateTreeHash`, the exact non-ignored bytes of a worktree
  (line 543), and `requireGateChecks` has no lifecycle caller. The bounded
  wrapper runs its command in the launchpad with a fixed 900-second deadline
  (`scripts/lib/bounded-command.mjs` lines 43-52). In the fixture export the
  kit's `npm test` ran fresh in 41.7 s and `npm run test:docs` in 14.0 s
  (`docs/evidence/WO-201/gate-in-kit.json`); no real-fork gate duration is
  recorded.
- **The records branch's publication needs a launchpad `npm test` row.**
  `reviewedProductGate` (`scripts/lib/release-records.mjs` lines 91-139),
  called by the self publish (`scripts/worktree.mjs` line 827), refuses
  without a passing reviewer `npm test` row whose code identity equals HEAD's,
  although a target order's launchpad diff holds records only and
  `gateCodeIdentity` leaves out `docs/`, `.claude/`, `.agents/` and root
  Markdown except `docs/control/outward-vocabulary.json`
  (`packages/skeleton/src/gate-evidence.mjs` lines 816-824).
- **A target's knowledge stays in the instance.** A target order's file,
  decisions, verification and final-review reports are written in the order
  launchpad and reach only the launchpad's records branch (WO-072 Execution
  plan step 1). `repositories.<id>` admits only `baseBranch`,
  `worktreeParent`, `repositoryClass`, `authorityProfile`, `profile`,
  `automationLogins` and `linkHosts` (`scripts/lib/config.mjs` lines 74-82),
  so no target declares where its records live, and the generated index shows
  a target order's repository and base (`scripts/work-orders.mjs` line 536)
  and nothing of where its records are. No route writes a planning document
  or a product document into a target. The operator directed on 2026-10-13
  that a target keeps its own product documents, planning passes and order
  records, published in the same pull request as each change through a
  records-only commit after the reviewed code commit, while raw evidence stays
  in the instance, which holds its own data or a link to each record (planning
  document §12.8; products 03 and 12 now say so).
- **The target close needs a hand Git step.** `closeTargetWorktree` judges
  containment against the clone's local base branch
  (`scripts/lib/target-worktree-close.mjs` lines 47-56), and
  `removeMergedBranch` deletes with `git branch -d` (`scripts/lib/git.mjs`
  lines 149-158), so after a forge merge someone must update the clone's base
  branch first; from 2026-10-13 the operator makes no repository change by
  hand (planning document §12).
- **Gates and README.** `release-surfaces` and `license-surfaces` are
  core-only in a kit (`scripts/test-runner.mjs` lines 672-678 and 708-712;
  client README table lines 225 and 233), and the README's limits paragraph
  records the `docs/LEGAL.md` failure (lines 265-270). WO-201's export case
  (`scripts/test-launchpad.mjs` line 906) and the runner's kit-only case
  (`scripts/test-runner.test.mjs` line 105) assert `release-surfaces` is not
  carried. The export runs `check-surfaces --local` only before any order
  (`scripts/test-launchpad-planning.mjs` line 309), and no export fixture
  declares `worktreeParent`.
- **The license posture.** Product 03 §Platform and instance boundary: the
  starter, the personal instance and DotLn-Angular carry core's three license
  files unchanged and are never exported with `--license none`.

**Design (scope discipline):**

- **Kit detection** is WO-201's rule (`isKitRoot`, `scripts/test-runner.mjs`
  lines 75-76): `KIT-MANIFEST.json` at the root (in the revision's tree for a
  committed read) and `hasPackageSources(root)` false (imported from
  `scripts/lib/paths.mjs`, unchanged), defined where used;
  `scripts/test-runner.mjs` is never imported by product code.
- **License pins.** In a kit with no `docs/LEGAL.md`, the pin rule yields one
  non-failing line that names `docs/LEGAL.md`, begins with neither `PASS` nor
  `FAIL` and says core's pins are judged only where the instance declares that
  file. A declared file is judged as in core; a symbolic link or non-regular
  entry at that path fails. Every other license rule (the three file hashes,
  the manifests' license, `private`, `prepublishOnly`, `publishConfig`, the
  publish dry-run refusal) is unchanged in a kit: the operator's instances
  carry core's files, so those rules judge carried bytes.
- **Seeds.** The README seed gains `## Releases in this instance`, opening
  with the three release-block lines holding `releaseClaimLine("v0.1.0")`
  (release-preparation.mjs lines 25-26). The first-order seed's heading ends
  `(v0.1.0)` and gains a minor Release classification with one sentence. The
  first order prepares with no tag (prepare keeps a current target when no
  tag is observed, lines 252-269); later orders are assigned above the
  instance's own tags. In an instance exported earlier, the executor first
  follows the README's update procedure on the operator's dispatch. If the
  block remains absent afterwards, it adds the two marker lines and claim
  line named by the zero-marker remedy, supplies the order's version and
  records the repair in its decisions. No hand step belongs to the operator.
- **Release close inputs.** The kit carries
  `docs/releases/tag-manifest.template.json` (schema-1 shape only). In a kit,
  `compatibility` reads the schema version from
  `packages/kernel/dist/src/types.d.ts` with the existing pattern (lines
  907-911) and `criticalNotes` treats that path as `types.ts`. The exported
  `previewReleaseManifest(root, workOrderId)` builds the manifest
  `baseManifest` would build for the closed order at the current revision with
  no evidence, writing nothing, so a fixture exercises the builder without a
  forge. The decisions list every repository path release close reads after
  its surface check with its kit availability; another core-only read is
  handled the same way inside the Boy Scout bound or recorded as left.
- **Target orders' surface rule.** When the state carries `repositoryId`,
  `checkSurfaces` reads the authority without a version, and
  `releaseBlockRule` judges the block's structure as today (one ordered block,
  exactly the generated claim line for one strict version) plus a claim at or
  above the latest release when one exists; its PASS line says the target
  order records no release. Component-version, workspace-pin, body-profile and
  license rules are unchanged.
- **Goal standard.** This planning pass wraps the platform-neutral spans of
  product 07 §Goal-aligned decisions in `<!-- dotln-goal-rules:start -->` /
  `<!-- dotln-goal-rules:end -->` pairs; core's purpose, critical-path,
  Platform lens and shared-supports paragraphs stay outside. In a kit,
  `goalStandard` is the section's heading line, each block's content (the
  lines strictly between its markers) in source order, then the content of
  the single `<!-- dotln-purpose:start -->` / `<!-- dotln-purpose:end -->`
  block of `docs/product/purpose.md` (via `docRelative(root, "product",
  "purpose.md")`) when that file exists, otherwise the line `unavailable:
  docs/product/purpose.md; this instance has not declared its purpose`. The
  decisions record the exact composition. Refusals, named by path: a kit
  section with no goal-rules block or unbalanced markers; a purpose file
  without exactly one block, with an empty block, or reached through a
  symbolic link. Block content is carried verbatim, never interpreted. In
  core the standard stays the whole section, so historical subject hashes are
  unchanged; this pass's refutation judges the markers once.
- **Gates.** `release-surfaces` and `license-surfaces` lose their `kit:`
  declarations; WO-201's export case judges the three selections with them,
  and the two cases that used `release-surfaces` as the uncarried example name
  a row that stays core-only. The `release` row's `kit:` reason drops the
  tag-manifest template, which the kit now carries.
- **Target-native references.** A rule `identifier.runtime` in
  `lintOutwardArtifact` refuses, in every artifact kind, `source-event:`,
  `baseline-event:`, `review-event:`, `verification:` and `contract:` when an
  identifier character follows directly, `delivery-preparation#` and
  `evt_<digits>`, each with its exact span; the forms are a frozen export of
  `scripts/lib/outward-lint.mjs`, so every instance's lint carries them. Prose
  such as "Independent verification: acceptance matrix"
  (`scripts/lib/github-body.mjs` lines 949 and 973) passes. The episode body
  renders each Deliverable-ready row's evidence as target-native text (head and
  base commit ids, sections of the same body, test outcomes) through a fixed
  per-row table, a frozen export of `scripts/lib/github-body.mjs` whose name
  and rows the decisions record, and each known review item's references
  through an exported pure `targetNativeReference`; `deliverableReady` (line
  538) and the references it returns to the preview and to
  `--require-deliverable-ready` are unchanged. The disposition reply posts
  mapped references (a commit-qualified path as `<path> at <commit>`,
  `contract:criterion:<n>` as acceptance criterion n+1, others omitted, the
  head commit when none remains) while the recorded `PullRequestThreadDisposed`
  payload keeps the judgment's. Test commands stay out of target text
  (WO-064-D003: they can carry a machine path).
- **The change section is shared.** `targetChangeSection` is today's `##
  Change` block of `generateTargetPullRequest`, extracted unchanged, so the
  session body ends with the section the episode body carries.
- **The binding.** A passing `final-review-result` of an order whose fold
  carries `repositoryId` records `targetSubject { repositoryId, branch,
  baseCommit, commit }` on `FinalReviewCompleted`, read by the host from the
  registered target worktree (`targetWorktreeForOrder`,
  `scripts/lib/target-worktrees.mjs` line 195) with `HOST_GIT_READ`
  (`scripts/lib/github-repository.mjs` lines 6-17): the registry entry's
  repository and base equal the fold's, the target is on its `wo-NNN` branch
  with clean tracked and non-ignored untracked files, and the base is an
  ancestor of HEAD, which is `commit`. A failing condition refuses the pass
  by name and records nothing; no path enters the event (WO-072-D002); a fail
  verdict records no target. The fold validates the field when present
  (refused for an order activated without a repository or when repository,
  base or branch differs from the activation); absent is admitted for earlier
  segments. Publication binds to the latest passing `FinalReviewCompleted` in
  the order launchpad's committed control (`readControl(<order launchpad>,
  "HEAD")`, as `reviewedProductGate` reads, `scripts/lib/release-records.mjs`
  line 92): the target's `refs/heads/wo-NNN` must name the recorded
  records-only commit, whose single parent is `targetSubject.commit` (the
  records-only commit below), and the push lane re-verifies the fetched branch
  before pushing `<records commit>:refs/heads/<branch>` (`pushObservedCommit`,
  `scripts/lib/target-publish.mjs` lines 202-242, check at 228-232).
- **The reviewed target state is a commit.** The reviewer commits the
  reviewed target change on `wo-NNN` before a passing result; the refusal and
  the pass message say so, and product 07's authority paragraph grants it
  (step 59). A target that moves after the pass, other than by the
  records-only commit, is not re-bound: the session publish refuses naming
  both commits, and the tool never moves the branch.
- **The session form.** `worktree publish WO-NNN --target-worktree --branch
  <type>/<slug> --title "<title>" --body-file <path>`, beside the unchanged
  episode form, finds the order launchpad as the self form does
  (`scripts/worktree.mjs` lines 738-742), requires it and the target clean,
  reads the body at the order launchpad's HEAD as a committed contained regular
  file (`readTrackedTextAtHead`, lines 93-120) and calls
  `publishTargetWorktree` (`scripts/lib/target-publish.mjs`). Before any
  remote call that function requires the binding, a passing `targetGate` whose
  `commit` is `targetSubject.commit` and a `TargetRecordsCommitted` in the
  order launchpad's committed control; requires the target's `wo-NNN` to name
  the recorded records commit, whose single parent is `targetSubject.commit`
  and whose diff against it adds or changes exactly the recorded records under
  the documentation root (a deletion, a rename's source, a mode change or any
  path outside the root refuses, naming each path); refuses a reviewed commit
  equal to the base; authorizes `repo.push` and `pr.open` through the kernel guard with
  the registered profile as the envelope (`authorize`,
  `packages/kernel/src/core.ts` lines 336-455; a profile requiring evidence or
  revocation predicates refuses, since this route supplies neither) and an
  admitted grant with `grantedBy: operator`, both effects in its effects and
  operations and the registered id as its `repo`; derives the forge
  repository from origin's single configured push URL (`pushUrl`'s rule, lines
  175-196); refuses a changed path that is the bundle manifest
  `.claude/target-worker-manifest.json` or in its installed set (read as
  `scripts/lib/target-worktree-close.mjs` lines 84-93 read it); builds the
  body as the reviewed file followed by `targetChangeSection` over the
  target's objects from the base to the records commit and `targetGateSection`
  (the gate's command names, outcomes and durations and the reviewed commit;
  no command text, no evidence reference); lints the branch, every commit
  message from base to the records commit, the title and the whole body, `identifier.runtime` included,
  against the main checkout, where the ignored local-terms list lives
  (`scripts/lib/terms.mjs` line 14; inference: a fresh order worktree holds
  none), absent terms refusing (`lintArtifacts`, lines 1023-1044); and checks
  the GitHub body profile and AI attribution. Then, under the publication
  lock: `ensureGh`, whose resolved repository must equal the derived one; the
  push; `gh pr create --base <registered baseBranch>`; and `PullRequestOpened
  { repositoryId, number, headSha }`, `repositoryId` being the derived forge
  repository as product 02 defines the field, by `target-publish-host` in a
  log under the main checkout's ignored control local directory
  (`target-publications/WO-NNN/`). A rerun for the same head reports it and
  pushes nothing. No launchpad branch moves. The form takes no
  `--require-deliverable-ready`: its readiness is the bound review.
- **The records branch records no release and holds the links.** When the
  order's state carries `repositoryId`, the self form's release-notes step
  accepts no notes file and prints that the target order records no release.
  The branch carries the control segment (with `TargetRecordsCommitted`), the
  raw evidence and nothing the event moved: the form refuses when the
  committed control holds no `TargetRecordsCommitted` for the order, and when
  the branch adds a file at an order launchpad path the event moved. In place
  of `reviewedProductGate` it calls `reviewedLaunchpadIdentity`, which proves
  `gateCodeIdentity` at HEAD equal to that at the branch's merge base with
  `origin/main` and returns a body block naming both identities and stating
  that no launchpad code changed; when they differ it falls back to
  `reviewedProductGate` and its reviewer `npm test` row. Its other steps
  (surface check, body profile, attribution, contribution sign-off) are
  unchanged, and a self order still needs its notes and its row.
- **Target close listing.** `closeTargetWorktree` keeps D003's refusal,
  retention and owned-file exclusion, lists each ignored entry outside the
  bundle once with `--directory` (a directory of only bundle-owned files is
  not listed), and names the remedy with the exact close command
  (`releaseCloseCommand`, `scripts/lib/git.mjs` lines 161-167): move or remove
  the listed paths, then rerun it.
- **Disposable Finder metadata (operator scope expansion, 2026-10-14).**
  Regular untracked `.DS_Store` files at any depth do not make the target
  worktree or its clone's base checkout dirty at release close, whether Git
  ignores them or not. Dry runs preserve them; a publishing close may delete
  them before its Git operations. Tracked changes, symlinks, directories
  named `.DS_Store` and every other foreign file keep their existing checks.
  WO-210-D014 records the operator's authorization and the bounded exception
  to D003's ignored-material refusal.
  The same exception applies to starter refresh's checkout-cleanliness check
  (`scripts/lib/starter-refresh.mjs`), covered by the existing
  `scripts/test-release.sh` starter-refresh case. WO-210-D017 records this
  second release-close route under the same operator direction.
- **Starter seeds and verified-main recovery (operator expansion, 2026-10-14).**
  On release close, refresh a changed seed template into the starter only
  when its destination still matches a prior export. A customized, missing or
  non-regular destination for a changed template refuses by path before
  publication; an unchanged template leaves such a destination intact. A
  destination matching an older proven export can still advance after a
  kit-only update. The operator delegated this final-review choice on
  2026-10-14 (WO-210-D028). The refresh row
  names every rewritten seed. Keep ordinary instance ownership and actions.
  Extend the recovery drive from v0.81.0's seeds: WO-001 is activated on main,
  verified pass with its control segment and reports uncommitted, then the
  starter receives this release. The instance's session fast-forwards that
  update and recovers the order into wo-001 without hand-editing release inputs
  or losing its control and records. The README assigns those operations to
  the session after operator direction; the operator supplies phrases and
  merges pull requests. WO-210-D020 binds this expansion and reopens WO-215's
  seed-refresh known issue. The original F1–F5 repair remains in scope.
- **The close updates the clone's base itself.** Before its containment
  check, a publishing close runs `git fetch origin <baseBranch>` in the clone
  and fast-forwards the clone's local base branch to `origin/<baseBranch>`
  (`git merge --ff-only` when the base is checked out in a clean clone
  worktree, `git fetch origin <baseBranch>:<baseBranch>` otherwise); a
  non-fast-forward, a dirty checkout of the base or a failed fetch refuses by
  name with the clone's refs unchanged. The dry run fetches and judges
  containment against `origin/<baseBranch>`, moving no local branch. WO-072's
  containment rule (ancestry in the clone, then `git branch -d`) is
  unchanged; what changes is who updates the base: release close, on the
  operator's `resume: release close` phrase, never a hand Git step (operator
  direction, 2026-10-13).
- **Argument checks first.** The order id and both publish forms' arguments
  are validated before `mainWorktree(toolRoot)`.
- **The target gate.** `repositories.<id>.gate` is `{ commands, plain,
  review }`: `commands` maps one or more names (a lowercase letter, then
  lowercase letters, digits and hyphens) to `{ argv, timeoutMs }`, `argv` a
  non-empty array of non-empty strings run without a shell and `timeoutMs` a
  positive safe integer; `plain` is a non-empty list of declared names and
  `review` a list that holds every plain name and may add more; an unknown
  key, an undeclared name or a malformed entry refuses by path, as
  `validateRepositories` refuses today. `node scripts/target-gate.mjs WO-NNN
  [--review]`, run from the order launchpad or from the target worktree with
  `DOTLN_LAUNCHPAD` set as WO-072's handoff prints it, resolves the order's
  target worktree through `targetWorktreeForOrder`, reads the target
  worktree's `gateTreeHash` and HEAD, runs each selected command in
  the selection's order through `boundedCommand` with the target worktree as its
  working directory and the command's own timeout (memory budgets stay the
  launchpad's), reads the tree and HEAD again, and records with
  `recordGateChecks` in the order launchpad's gate index one row per command
  (`checkId` `target:<repository-id>:<name>`) and one selection row (`checkId`
  `target:<repository-id>`, with `selection` `plain` or `review`, the names
  run, `treeHash`, `commit`, `repositoryId`, `executed`, `exitCode`,
  `durationMs`, `evidenceRef` and `recordedAt`). The selection row passes only
  when every command exited 0 within its timeout and the tree and HEAD read
  the same before and after; a command that changes the target's tracked or
  non-ignored untracked bytes fails it by name. Output stays in the ignored
  check-output lane, never in target text. With no `gate` declared the runner
  refuses naming the missing declaration and records nothing.
- **A target order's gate claims.** For an order whose state carries
  `repositoryId`, `requireGateClaims` resolves a met criterion that names
  `npm test`, `npm test -- --review` or the runner to the target gate: the
  latest selection row of that repository at the target worktree's current
  `gateTreeHash`, a review claim needing a `review` row and a plain claim a
  row whose names hold the plain selection. It refuses, naming the selection,
  the tree and the runner command, when no such row exists (missing), when
  the latest such row failed (failed; a later passing row at the same bytes
  supersedes it), or when rows exist only at another tree (stale). It never
  looks up a launchpad `npm test` row for a target order, so the `\bnpm
  test\b` hazard is gone. A criterion naming `npm run test:docs` still runs
  the launchpad document gate. The completions carry `targetGate` in place of
  `productGate`; a self order's claims are unchanged.
- **Final review binds the gate to the reviewed commit.** A passing
  `final-review-result` of a target order, after `reviewedTargetSubject` has
  required the target clean at `targetSubject.commit`, requires the review
  selection's latest row at the target's current tree to have passed and
  records `targetGate { repositoryId, commit, treeHash, selection, names,
  durationMs, evidenceRef, recordedAt }` beside `targetSubject`, `commit`
  being `targetSubject.commit`: the worktree is clean at that commit, so the
  tested bytes are the commit's. A failed, stale or missing review row, or no
  declared gate, refuses the pass by name and records nothing. The fold
  validates `targetGate` when present (exact keys, `commit` equal to
  `targetSubject.commit`, `selection` `review`). An earlier passing run at the
  same bytes is reused; the reviewer runs the review selection only when none
  passed there.
- **The documentation root.** `repositories.<id>.documentationRoot` is a
  relative normalized POSIX path, checked as `worktreeParent` is (default
  `docs`). `targetDocRelative(repository, key, ...segments)` gives a record's
  path as a launchpad whose only declared root is `docs: <documentationRoot>`
  would (`resolveRoots`, `scripts/lib/config.mjs` line 129): product
  documents under `<root>/product/`, planning passes under `<root>/planning/`,
  an order's file under `<root>/work-orders/`, its decisions under
  `<root>/evidence/WO-NNN/` and its reports under `<root>/verifications/WO-NNN/`
  and `<root>/final-reviews/WO-NNN/`. With the default, core's own `docs/`
  already has this layout, so core can become a registered target later
  without moving a record (planning document §12.10). No script names a
  document root (the `configuration-root` suite scans every non-test script,
  `scripts/test-runner.mjs` line 242). A target order's briefings name the
  root in the target worktree as repo-native authority beside the profile,
  and the runner command its gate claims stand on; the roles' standing text
  follows in WO-192.
- **The records-only commit.** After a passing final review the reviewer runs
  `npm run resume -- target-records <actor-flags>`, a lifecycle action so its
  event goes through `appendTransition` (`scripts/resume.mjs` line 331). It
  requires the target worktree clean at `targetSubject.commit` on `wo-NNN`; a
  rerun with a commit already recorded reports it when the target's `wo-NNN`
  names it and refuses otherwise. It reads, as contained regular files of the
  order launchpad worktree, the order's file at its activated path, its
  decisions file and every verification and final-review report the order's
  events record, each report's SHA-256 equal to the hash its event recorded;
  screens each with the local-terms list (a match refuses by file and line
  without printing the term; the private-path screen is WO-213's); writes
  each at its `targetDocRelative` path, refusing a path that already exists in
  the target with other bytes, a symbolic link on the way or a non-regular
  entry; commits them as one commit whose single parent is
  `targetSubject.commit`, with a conventional `docs:` subject that passes the
  outward lint; and appends `TargetRecordsCommitted { repositoryId, branch,
  parent, commit, root, records: [{ kind, path, sha256 }] }`, `kind` being
  `order`, `decisions`, `verification` or `final-review`. The order's file
  stays in the instance as its activation authority; the decisions file and
  the reports then leave the order launchpad worktree, so the instance holds a
  link to each, not a second copy. The fold admits the event only after a
  passing `FinalReviewCompleted` that carries `targetSubject`, with
  `repositoryId`, `branch` and `parent` equal to it, a 40- or 64-hex `commit`,
  `root` the registered root and each path under it, and keeps it as
  `targetRecords`. The records' contents are the instance's records, which the
  operator directed into the target (planning document §12.8): the outward
  lint judges the pull request's branch, commit messages, title and body, not
  the files under the root.
- **Links.** The generated index's card for a target order
  (`scripts/work-orders.mjs`, the row at line 436 and the card at line 536)
  names, from `targetRecords`, the repository, the records commit and each
  record's path, in place of a decisions link, so the instance is never
  ignorant of where a target's records live (operator direction, 2026-10-13).
- **Target-scoped planning publication.** A planning pass for a registered
  repository drafts the target's planning document and product-document edits
  in its session scratch (a root every role may write,
  `packages/skeleton/src/loadouts/contributor.ts` lines 231-244), reading the
  target's current text from the registered clone at a commit it names. `npm
  run plan -- target-publish <repository-id> --base <commit> --from
  <directory> --branch docs/<slug> --title <title> --body-file <path>`
  fetches the registered base branch, requires `--base` to be an ancestor of
  `origin/<baseBranch>`, adds a temporary worktree of the clone on the named
  branch from `--base`, writes each regular file under `--from` at the same
  relative path under the documentation root (refusing a symbolic link, a
  non-regular entry, a path that escapes the root, and any path outside the
  root's `planning` and `product` segments), commits them with a conventional
  `docs:` subject, and publishes as the session form does: the registered
  profile and an admitted operator grant naming `repo.push` and `pr.open`; the
  outward lint of the branch, the commit message, the title and the body with
  local terms; the body profile and attribution; then, under the publication
  lock, `ensureGh`, the push, `gh pr create --base <registered baseBranch>`
  and the publication log. It then removes the temporary worktree and the
  local branch and prints each document's repository, commit and path, which
  the pass records as links in its own planning document. Every refusal
  precedes the first remote call. The planning dispatch phrase is the
  operator's authorization for the push and the pull request, as it is for
  the pass's own `:memo:` pull request (product 07 §Operator-opened planning
  pass). The orders, the sequence and the refutation stay in the instance,
  so the plan subject and its hashes are unchanged.
- **One export.** The release drive, the target-order drive with its
  publications and the goal-standard cases extend the existing export in
  `scripts/test-launchpad-planning.mjs`; no second export.
- **Declined alternatives, recorded:** seeding core's `docs/LEGAL.md` (core's
  record, with history that is not the instance's); every license rule
  unavailable in a kit (they judge carried bytes); judging a declared instance
  `docs/LEGAL.md` against its own pins (no instance the operator keeps adopts
  other terms; reopen below); prepare creating a missing README block (a
  creating write into an instance-owned file is new authority; a seed and a
  named remedy suffice); a first-version rule inside prepare (a hidden
  convention); a new kit-action kind (kit actions are a closed set); skipping
  the release-block rule for target orders (the claim would go unjudged);
  running a self order's `release close --dry-run` in the export (it needs a
  GitHub-shaped origin, a forge double, a merged origin and a reviewer `npm
  test` row, as `scripts/test-release.sh` builds from line 77; the preview
  exercises the builder far cheaper); exclusion markers around core's spans
  (links in neutral paragraphs would stay carried); reading the purpose from
  the instance's vision (it requires core's thesis headings); seeding a
  purpose (WO-202-D002); moving core's purpose out of §Goal-aligned decisions
  (planning's section, read by every role); a content identity over the target
  working tree, which would let the reviewer commit after the result
  (`gateCodeIdentity` excludes `docs/`, root Markdown and `.claude/`,
  `packages/skeleton/src/gate-evidence.mjs` lines 816-824, which are target
  code, and working-tree bytes differ from committed blobs under filters and
  line-ending conversion; a commit id is exact and is what the push carries);
  recording the target commit on `VerificationCompleted` too (publication
  consumes the final review's record; left to the planner); optional fields on
  the `--target <request.json>` form (its schema and binding are the
  episode's); generating the session body from the order's Markdown (a
  free-form reading, of a launchpad-facing text; a committed reviewer body is
  the self route's practice, `scripts/worktree.mjs` lines 761-777); compiling
  a loadout for a session order (none exists; the profile is the envelope the
  handoff echoes); pushing the local `wo-NNN` name (it fails the branch rule);
  a close that removes ignored material as `git worktree remove` does
  (reopens D003); editing the reviewer skill's source,
  `packages/skeleton/src/loadouts/contributor.ts`, a registered source of the
  authority, feedback and harness editions (`scripts/lib/evidence-sources.mjs`
  lines 163, 261 and 332), which would add their re-mints and a harness emit
  for text the refusal, pass message, briefings and product 07 carry (WO-192
  edits that file next and writes the target-order role text); declaring the
  runtime forms admitted in the vocabulary (FUP-a272d577fd351b43's other
  branch); placing them in `docs/control/outward-vocabulary.json` (the kit
  does not carry it, `scripts/kit/README.client.md` lines 215, 228 and 238,
  and instances configure their own, WO-118-D006); a vocabulary-only edit
  (every episode publish would refuse while the generator emits the forms);
  the vertical's branch name `fix/intent-<key>` (no form matches it). Second
  round: the class `checks` route for a target gate (class checks are evidence
  names tied to the resident path and its 30-second limit, and require
  launchpad declarations, `scripts/lib/authority-grants.mjs` lines 78-88); a
  target gate identity that leaves out the documentation root (the target's
  own tests may read it; the exact tree is what binds the tested bytes); an
  `npm run target-gate` script (`package.json` is a common source of every
  evidence edition, `scripts/lib/evidence-sources.mjs` line 10, so the edit
  would owe five re-mints); editing `packages/skeleton/src/gate-evidence.mjs`
  (a registered source of several editions; the target lookup lives in an
  unregistered module that imports it); the records written into the target
  by the roles' own edit tools (a write outside the session's project is
  refused without a granted root; a host command writes them and publication
  judges the commit); the records in a pull request of their own (the
  operator chose the change's pull request, planning document §12.8); keeping
  the decisions and reports in the instance as well (two copies diverge; the
  instance keeps a link); moving the order's file out of the instance (it is
  the activation authority whose hash the control events carry); the
  target-scoped planning document replacing the instance's own planning
  record (the refutation's subject, the receipts and the pass registration
  read the instance's records, `scripts/lib/plan-subject.mjs`); one root per
  record kind (one root laid out as the launchpad's lets core qualify
  unchanged); leaving the clone's base update to the operator (the operator
  makes no repository change by hand from 2026-10-13; the earlier reason for
  declining a fetch inside the close, that it changes WO-072's containment
  rule, does not hold, since containment is still judged by ancestry in the
  clone).

**Execution plan (the executor follows these steps in order; observed at `6dbd8771`, 2026-10-13):**

1. `scripts/test-launchpad-planning.mjs`: before any product change, add a
   release probe to the existing export: a scratch bare `origin` with `main`
   pushed; `npm run resume -- activate WO-001
   docs/work-orders/WO-001-environment-truth.md` on `main`, then `git switch
   -c wo-001`; the WO-001 heading `(v0.1.0)`, a minor Release classification
   line and the README's three release-block lines written by the probe;
   commit; `npm run
   release -- prepare --local`; `npm run release -- check-surfaces --local`;
   a fixture handoff (`scripts/test-launchpad.mjs` lines 1238-1260) and
   fixture reports to `closed` (`closeOrder`, `scripts/test-target-worktree.mjs`
   lines 225-252); commit; `node scripts/release.mjs check-surfaces
   --committed WO-001` (`worktree publish`'s surface step); `node
   scripts/license-surfaces.mjs` and `--committed`. Record every non-PASS
   line in `docs/evidence/WO-210/decisions.md` with its cause (core-only
   input, unseeded instance surface, or order state) and disposition.
   Expected from the code read (an inference until run): the `docs/LEGAL.md`
   pins FAIL in each read and nothing else. Check: `npm test -- --only
   launchpad-planning`.
2. `scripts/license-surfaces.mjs` `licenseSurfaceRules` (line 153): the kit
   test; with no `docs/LEGAL.md` (absent from the revision's tree, or no
   work-tree entry) the pin rule (lines 218-244) pushes `{ pass: true, line:
   "unavailable license-surfaces docs/LEGAL.md pins: ..." }` naming the
   resolved path; otherwise unchanged. Check: step 3.
3. `scripts/test-license-surfaces.mjs`: cases on `withFixture` (lines 22-36)
   plus `KIT-MANIFEST.json` for criterion 2 (absent file in the work tree and
   at a revision; core's file; a pinless file; a symbolic link; no
   `KIT-MANIFEST.json`). Check: `npm test -- --only license-fixtures`.
4. `scripts/release.mjs`: `readWorkOrderAuthority` (line 457) takes `{
   versioned }`; `checkSurfaces` (line 759) passes `versioned:
   !state.repositoryId`; `releaseBlockRule` (line 551) applies the Design's
   target-order rule over the structural checks of lines 565-602. Check:
   `npm test -- --only release` and `npm test -- --only target-worktree`.
5. `scripts/release.mjs`: the kit paths of `compatibility` (line 901) and
   `criticalNotes` (line 1186); the zero-marker remedy (lines 585-590); the
   exported `previewReleaseManifest` (`parseControlStateAt`,
   `workOrderAuthority`, `latestVersion` of local tags, `baseManifest` with
   empty evidence). Record every path `close` reads after line 2343
   (`baseManifest` and its callees, `releaseEdition`, `tagMessage`) with its
   kit availability. Check: `npm test -- --only release`.
6. `scripts/launchpad.mjs` `KIT_FILES.documents` (line 190): add
   `["releases", "tag-manifest.template.json"]`. Check: `npm test -- --only
   launchpad` (WO-074's criterion 1 case).
7. `scripts/kit/first-order.template.md`: the heading ends `(v0.1.0)`; after
   the Effort line, a minor Release classification: "The instance's first
   release: its environment-truth record." Check: `npm test -- --only
   launchpad`; judged in step 57.
8. `scripts/kit/README.client.md`: `## Releases in this instance` after `##
   Planning in this instance`, opening with `<!-- DOTLN-RELEASE-BEGIN -->`,
   ``This source prepares DotLn `v0.1.0`.`` and `<!-- DOTLN-RELEASE-END -->`
   (prose in step 58). Check: `npm test -- --only launchpad`; judged in step
   57.
9. `scripts/lib/plan-subject.mjs` `buildGoalSubject` (line 530): in a kit
   (the test at line 569) compose `goalStandard` and refuse as the Design
   states, reading the purpose file through the `has`/`read` helpers (and
   `committed.readMany` when present); core keeps `section(guide,
   "Goal-aligned decisions")`. Check: `npm test -- --only plan-refutation`
   and `npm test -- --only plan-refutation-current`.
10. `scripts/test-runner.mjs`: remove the `kit:` lines of `release-surfaces`
    (line 673) and `license-surfaces` (line 709); drop "tag-manifest
    template" from the `release` row's reason. Check: steps 11 and 12.
11. `scripts/test-launchpad.mjs` WO-201 case (line 741): its
    unavailable-selection loop (line 906) names a row that stays core-only.
    Check: `npm test -- --only launchpad`; record the observed selection
    lists for step 58.
12. `scripts/test-runner.test.mjs` kit-only case (line 97): its rejection
    loop (line 105) names a row that stays core-only. Check: `npm test --
    --only runner-fixtures`.
13. `scripts/lib/outward-lint.mjs` `lintOutwardArtifact` (line 55): the
    exported frozen `runtimeIdentifierForms` and `identifier.runtime` over
    every kind, matched on the NFKC-lowercased text (line 9) with exact spans,
    status by the existing findings rule (line 163), `checks` gaining its
    entry. Check: step 14.
14. `scripts/test-outward-lint.mjs`: each form refused in each kind whose
    shape admits it, with its span; "Independent verification: acceptance
    matrix for <sha>" and `**Contract:**` pass. Check: `npm test -- --only
    outward-lint`.
15. `scripts/lib/github-body.mjs`: export `targetNativeReference(ref, { head,
    base })`, `targetChangeSection({ baseCommit, headCommit, files })` from
    lines 1018-1027 and the frozen per-row table; `generateTargetPullRequest`
    (line 906) renders the Deliverable-ready evidence (lines 1035-1038) and
    the known items' evidence (lines 1044-1049) through them, naming how many
    references were omitted. Check: step 16.
16. `scripts/test-github-body.mjs`: the mapping, the table's text, the
    omitted count and an unchanged `deliverableReady` result. Check: `npm test
    -- --only github-body`.
17. `scripts/lib/target-publish.mjs` `disposeReviewThread` (line 425): the
    posted body (lines 445-449) maps `judgment.evidenceRefs` through
    `targetNativeReference` (`head` the recorded pull request's head, `base`
    the episode's), citing `commit <head>` when none remains; `payload` (lines
    450-458) unchanged. Check: step 18.
18. `scripts/test-target-publish.mjs`: the WO-064 AC1/AC2 case (line 1206)
    asserts the body's Deliverable-ready section and known items hold no
    runtime form and pass the lint (the pinned
    `scripts/fixtures/target-publish/body.md` covers only the part before,
    lines 1277-1284); the WO-066 AC2 reject case (line 3124) asserts the
    stub's reply holds none and the payload keeps the judgment's references.
    Check: `npm test -- --only target-publish`.
19. `scripts/worktree.mjs` `main` (line 471): validate the order id and both
    publish forms' arguments before `mainWorktree(toolRoot)` (line 581); the
    `--target-worktree` usage beside the episode form's (lines 709-712) and in
    the closing usage (line 1042). Check: step 20, and `npm test -- --only
    worktree` (the self form's usage and publication cases).
20. `scripts/test-target-publish.mjs`: the usage case (lines 1518-1531) runs
    with no worktree on main (FUP-a5c6ac8cb40bd52a's reproduction) and covers
    the new form, refusing `--require-deliverable-ready` with it. Check: `npm
    test -- --only target-publish`.
21. `scripts/lib/target-worktrees.mjs`: export `reviewedTargetSubject(launchpad,
    state)` per the binding, through `targetWorktreeForOrder` (line 195) and
    `physicalDirectory` (line 38), returning the four fields or throwing the
    named condition. Check: step 25.
22. `scripts/lib/control.mjs` fold, `FinalReviewCompleted` (lines 336-343):
    validate `targetSubject` when present (exact keys; the activation's
    repository and base; `branch` `wo-` with the order's digits; a 40- or
    64-hex commit), refusing as the activation check does (lines 260-270).
    Check: step 23.
23. `scripts/test-control-segments.mjs` (run by `scripts/test-resume.sh` line
    1062): a valid field folds and each variant refuses. Check: `npm test --
    --only resume`.
24. `scripts/resume.mjs` `final-review-result` (lines 1584-1655): for a pass
    with `repositoryId`, call `reviewedTargetSubject(repoRoot, state)` after
    `completionActor` (lines 1589-1595) and before any record, add
    `targetSubject` to the event (lines 1638-1648), and give a target order's
    pass message (lines 1649-1652) the commit-first step, the target publish
    form and the records publish. Check: step 25.
25. `scripts/test-target-worktree.mjs`: `closeOrder` (lines 225-252) keeps
    working for orders with no target change; criterion 10's cases through
    both launchpad routes. Check: `npm test -- --only target-worktree`.
26. `scripts/lib/target-publish.mjs`: export `publishTargetWorktree` per the
    Design, reusing `pushUrl`'s rule, `pushObservedCommit`, `lintArtifacts`,
    `ensureGh`, `executeGh` and `withTemporaryBody`, and a helper factored from
    `observeTarget`'s numstat and commit reads (lines 721-753) that both use
    (`observeTarget` keeps its digest check); step 46 adds the records and
    gate checks. Check: step 28, and `npm test -- --only target-publish` (the
    episode route over the factored helper).
27. `scripts/worktree.mjs`: the `--target-worktree` dispatch beside the
    episode form (line 701) finds the order launchpad (lines 738-742),
    requires it clean, reads the body with `readTrackedTextAtHead` and passes
    the registry `readAuthorityGrantRegistry` reads there. Check: step 28, and
    `npm test -- --only worktree`.
28. `scripts/test-target-worktree.mjs`: the fixture copies
    `scripts/outward-lint.mjs` and the modules `target-publish.mjs` imports
    (its lines 1-44; the executor confirms each resolves), writes the outward
    vocabulary under its control root (line 103), a local-terms list in
    main's ignored control local directory and an operator grant in
    `packages/skeleton/loadouts/grants.json`, puts a `gh` stub and Git wrapper
    on `PATH` as `scripts/test-target-publish.mjs` lines 236-290 do (a shared
    helper beside `scripts/test-beacon-fixture.mjs` if extracted, recorded in
    the decisions), gives the target clone a bare origin behind a GitHub URL,
    and covers criterion 11. Check: `npm test -- --only target-worktree`.
29. `scripts/worktree.mjs` self `publish`, release-notes step (lines
    784-806): the no-release form for an order whose state carries
    `repositoryId`; step 48 adds the identity proof and the two refusals.
    Check: step 30, and `npm test -- --only worktree` (a self order's notes
    are still required).
30. `scripts/test-target-publish.mjs`: the self form on a fixture target
    order's records branch to a `gh` stub with no notes, and a self order
    without notes refusing. Check: `npm test -- --only target-publish`.
31. `scripts/lib/target-worktree-close.mjs` `closeTargetWorktree` (lines
    96-106): the listing and remedy; step 50 adds the base update. Check:
    step 32.
32. `scripts/test-target-worktree.mjs`: WO-072-D010's reproduction beside
    WO-072's criterion 4 test (lines 503-565), covering criterion 12. Check:
    `npm test -- --only target-worktree`.
33. `scripts/lib/config.mjs`: `REPOSITORY_KEYS` (line 74) gains `gate` and
    `documentationRoot`; `validateRepositories` (line 368) validates both as
    the Design states and returns `documentationRoot` (default `docs`) and the
    declared `gate`; export `targetDocRelative(repository, key, ...segments)`
    over `resolveRoots` (line 129). Check: step 34.
34. `scripts/test-configuration-root.mjs`: beside "registered repositories
    expose a validated public profile" (line 239), criterion 15's
    declarations, refusals and paths. Check: `npm test -- --only
    configuration-root`.
35. `scripts/lib/bounded-command.mjs` `boundedCommand` (line 5): `cwd` and
    `timeoutMs` options (defaults the repository and today's 900,000 ms, line
    52) passed to `executeSuite`, whose second parameter is the spawn's working
    directory and third its deadline (`scripts/test-runner.mjs` lines 1095-1098
    and the spawn's `cwd`, line 1194); memory budgets stay the launchpad's
    (line 10); the CLI form is unchanged. A case in `scripts/test-runner.test.mjs`
    runs a probe command in another directory under a short timeout. Check:
    `npm test -- --only runner-fixtures`.
36. `scripts/lib/target-gate.mjs` (new): `targetGateDeclaration`,
    `runTargetGate` and `targetGateEvidence` per the Design, importing
    `gateTreeHash`, `recordGateChecks` and `readGateChecks` through
    `scripts/lib/gate-evidence.mjs` (unchanged), `targetWorktreeForOrder` and
    `boundedCommand`. Check: step 38.
37. `scripts/target-gate.mjs` (new): the runner `target-gate WO-NNN
    [--review]`, resolving the launchpad as `scripts/resume.mjs` does
    (`findLaunchpad`, line 133) and printing one line per command and the
    selection's outcome. Check: step 38.
38. `scripts/test-target-worktree.mjs`: criterion 16's cases on WO-072's
    fixture with a declared gate of synthetic commands (one passing, one
    failing, one outliving its timeout, one changing a tracked file). Check:
    `npm test -- --only target-worktree`.
39. `scripts/lib/handoff-ledger.mjs` `GATE_NAMES` (lines 51-55) and
    `requireGateClaims` (line 221), with its three callers in
    `scripts/resume.mjs` (lines 1417, 1501 and 1549) passing the order's state
    and `completionHandoff` (line 1102) carrying `targetGate`: the target-order
    resolution of the Design; a self order's path unchanged. Check: step 40,
    and `npm test -- --only resume`.
40. `scripts/test-runner.test.mjs`: beside the `requireGateClaims` cases (from
    line 3996), criterion 17 over a fixture gate index written with
    `recordGateChecks`. Check: `npm test -- --only runner-fixtures`.
41. `scripts/lib/lifecycle-evidence.mjs` (lines 124-131 and the returned
    fields, 230-252) and `scripts/resume.mjs` `final-review-result` (step
    24's site): for a passing target order, `targetGateEvidence` of the review
    selection at the target's tree, refusing as the Design states, and
    `targetGate` on `FinalReviewCompleted` beside `targetSubject` in place of
    the launchpad advisory. Check: step 42.
42. `scripts/lib/control.mjs` (step 22's site) and
    `scripts/test-control-segments.mjs`: `targetGate` validated when present;
    `scripts/test-target-worktree.mjs`: criterion 10's gate clauses through
    both launchpad routes. Check: `npm test -- --only resume` and `npm test --
    --only target-worktree`.
43. `scripts/lib/control.mjs` fold: `TargetRecordsCommitted` admitted and
    kept as `targetRecords` per the Design, with `targetSubject` kept from the
    passing `FinalReviewCompleted`; `scripts/test-control-segments.mjs`: a
    valid event folds and each variant of criterion 18's fold clause refuses.
    Check: `npm test -- --only resume`.
44. `scripts/lib/target-records.mjs` (new) and `scripts/resume.mjs`: the
    records-only commit of the Design as the `target-records` action, legal
    only after a passing final review of a target order (`legalActions`, line
    214), appending through `appendTransition` (line 331), and the pass
    message (step 24) naming it. Check: step 45.
45. `scripts/test-target-worktree.mjs`: criterion 18's cases. Check: `npm
    test -- --only target-worktree`.
46. `scripts/lib/target-publish.mjs` `publishTargetWorktree` (step 26) and
    `scripts/lib/github-body.mjs`: the records commit and gate checks and the
    push of the records commit, per the Design; export `targetGateSection(gate)`
    beside `targetChangeSection`. Check: step 47.
47. `scripts/test-target-worktree.mjs`: criterion 11's records and gate
    refusals and the pushed records commit; `scripts/test-github-body.mjs`:
    `targetGateSection`'s text holds the names, outcomes, durations and
    commit, no `argv` text and no evidence reference. Check: `npm test --
    --only target-worktree` and `npm test -- --only github-body`.
48. `scripts/lib/release-records.mjs` (beside `reviewedProductGate`, line 91)
    and `scripts/worktree.mjs` self `publish` (line 827 and step 29's site):
    `reviewedLaunchpadIdentity` and the records branch's two refusals per the
    Design; cases beside the `reviewedProductGate` cases of
    `scripts/test-runner.test.mjs` (from line 2471). Check: `npm test --
    --only runner-fixtures` and `npm test -- --only worktree`.
49. `scripts/test-target-publish.mjs`: step 30's case extended to criterion
    19. Check: `npm test -- --only target-publish`.
50. `scripts/lib/target-worktree-close.mjs` `closeTargetWorktree` (before
    `containsBranch`, lines 47-56): the base fetch and fast-forward of the
    Design. Check: step 51.
51. `scripts/test-target-worktree.mjs`: criterion 12's base refusals (a
    non-fast-forward clone base; a dirty checkout of it). Check: `npm test --
    --only target-worktree`.
52. `scripts/test-target-worktree.mjs`: criterion 13's route case, after the
    target gate, the records-only commit and the base update exist. Check:
    `npm test -- --only target-worktree`.
53. `scripts/work-orders.mjs` (the row at line 436, the card at line 536):
    a target order's `records` from `targetRecords` and the card's links;
    `scripts/test-work-orders.sh`: criterion 20's case. Check: `npm test --
    --only work-orders-fixtures` and `npm test -- --only index`.
54. `scripts/lib/target-planning.mjs` (new) and `scripts/refute-plan.mjs`:
    the `target-publish` action of the Design, beside `plan start` (line 347).
    Check: step 55, and `npm test -- --only plan`.
55. `scripts/test-target-worktree.mjs`: criterion 21's cases with a bare
    target origin behind a GitHub URL and the `gh` stub of step 28. Check:
    `npm test -- --only target-worktree`.
56. `scripts/resume.mjs` briefings (`executionBriefing`, `repairBriefing`,
    `verificationBriefing` and `finalReviewBriefing`, lines 1090-1100): for a
    target order, the documentation root in the target worktree as
    repo-native authority and the runner command its gate claims stand on;
    the final-review briefing also names the commit-first step,
    `target-records` and both publications. Check: `npm test -- --only
    resume`.
57. `scripts/test-launchpad-planning.mjs`: the probe becomes the binding case
    with no hand edits, asserting criteria 3 to 6, 14 and 20 in the one
    export: prepare, the two surface reads, a declared `docs/LEGAL.md` and the
    removed-marker remedy; a target order WO-002 (a `dotln.config.json`
    registering one synthetic repository with a `worktreeParent`, an authority
    profile allowing `repo.push` and `pr.open`, as
    `scripts/test-target-worktree.mjs` lines 100-113 do, a `gate` of one
    synthetic command and the default `documentationRoot`; a header declaring
    a `**Repository:** <id> @ <40-hex>` line; no heading version), a scratch
    bare target origin behind a GitHub URL, `worktree clone` and `worktree
    start` (that file's lines 76-99 and 188-189), a committed target change,
    the target gate's review selection, fixture reports, commits with a
    matching `Signed-off-by` trailer, the instance's outward vocabulary, a
    synthetic local-terms list and an operator grant committed in the export's
    `packages/skeleton/loadouts/grants.json`, driven to `closed` on `wo-002`;
    `resume target-records`; `check-surfaces --committed WO-002` and its two
    negatives; both publications to the `gh` stub; WO-001's publication
    without notes refusing; both merges and `release close`; the index card's
    links; `previewReleaseManifest` imported through `node --input-type=module
    -e` as the case imports skeleton modules (lines 330-340); the refute
    prompt's `goalReview.goalStandard`, its link targets, a committed
    `docs/product/purpose.md` block and the refusals; `plan -- receipt` and
    `plan -- check`. Record any lifecycle refusal met in the export with its
    cause. Check: `node scripts/harness.mjs bounded -- npm test -- --only
    launchpad-planning`; record the duration.
58. `scripts/kit/README.client.md`: §"## Releases in this instance" prose
    after the block; §"## Planning in this instance": the goal-standard
    paragraph and the release-read bullet (lines 147-150) rewritten, and one
    paragraph on a target-scoped pass's `plan target-publish`; §"## First
    steps": item 4 gains one sentence (a target order's publication also needs
    the instance's own `docs/control/outward-vocabulary.json` and an operator
    grant for the registered repository in
    `packages/skeleton/loadouts/grants.json`, neither of which the kit
    carries; an instance order's executor commits both on the operator's
    stated values, recording the operator's word, and writes the ignored
    local-terms list from the terms the operator states; it names the session
    form), item 5 gains one sentence (a registered repository declares its
    `gate` and its `documentationRoot`; a target order is gated by that gate
    and keeps its records in that root), and item 6 names the seeded `v0.1.0`;
    §"## What runs here, and what does not": step 11's selection lists, the two
    table rows (lines 225 and 233) removed, the `release` row following step
    10, and the `docs/LEGAL.md` limit sentence (lines 265-270) removed. Check:
    `npm test -- --only launchpad`.
59. Write-back, headings re-read at the base: `docs/product/07-execution-guide.md`
    §"## Workflow closeout and releases": after the paragraph beginning "A
    registered target closes with `no-release`", the records branch's surface
    rule and an instance's surfaces, and that paragraph gains the directory
    listing, its remedy and the close's own fetch and fast-forward of the
    clone's base; the "**Target publish (WO-064).**" paragraph gains the
    session route (binding, form, refusals, record, no launchpad branch
    moved; the records branch's publication with no release notes, its links
    and its unchanged-identity proof) and states that the body and the
    disposition reply cite target-native references and the lint refuses the
    runtime forms in every target-facing artifact; one paragraph after it, in
    place: a registered repository's `gate` and `documentationRoot`, a target
    order's gate claims on the target gate's rows, `targetGate` at final
    review, the records-only commit and its link, and a target-scoped planning
    pass's publication; §"### Preflight before the full gate": its sentence on
    a target order's own checks names the runner; §"### Where the control
    plane finds its documents", the "Target orders pair" paragraph: a passing
    final review records the reviewed target commit and its gate, and a
    target's records live under its documentation root; §"## Operator resume
    phrases — how you get dispatched", in the paragraph beginning "`resume:
    final review` and `resume: release close` carry narrowly scoped
    external-effect authority": "For a registered-target order the reviewer
    commits the reviewed target change on its `wo-NNN` branch before
    recording the passing result, records the order's records in the target's
    documentation root as one records-only commit after it, and may push that
    commit to one conventional branch on the target's origin and open its pull
    request with `worktree publish WO-NNN --target-worktree` under an admitted
    operator grant; it never merges either. Release close of a target order
    fetches the target's base branch and fast-forwards the clone's before it
    judges containment."; §"## Operator-opened planning pass": one paragraph
    on an instance's refutation goal standard after the platform-first
    standard paragraph (ending "Missing cost observations remain unknown."),
    never inside its span "the point is to create a platform, … before a
    later pass pays it again.", and one sentence on a target-scoped pass's
    publication after the paragraph on the pass's own `:memo:` pull request;
    each in place; §"## Goal-aligned decisions" is not edited. Check: `npm run
    test:docs`.
60. Write-back: `docs/product/03-architecture.md` §"## Platform and instance
    boundary": the kit documents gain the tag-manifest template and one
    clause on `docs/LEGAL.md` in an instance, and the sentence on a target's
    documentation root names the `documentationRoot` and `gate` keys and the
    launchpad layout it follows, in place. Check: `npm run test:docs`.
61. Write-back: `docs/product/02-domain-model.md` §"## Actors and episodes
    (the edge)": the `PullRequestOpened` paragraph gains the session route's
    log, `FinalReviewCompleted.targetSubject` and `targetGate`, and
    `TargetRecordsCommitted`, in place. Check: `npm run test:docs`.
62. Write-back: `docs/PLAYBOOK.md` §"## The loop, per work order": step 2's
    "target publication policy remains separate" sentence, step 4's target
    final review (the target gate and the records-only commit) and step 5's
    two merges with release close's own base update, in place. Check: `npm
    run test:docs`.
63. Write-back: `docs/LEGAL.md` §"## Current state": the `license-surfaces`
    paragraph states the kit rule. Check: `npm run test:docs`.
64. Write-back: `docs/product/12-workstream-application.md` §"## One
    workstream across repositories" (the heading re-read at the base): the
    sentence on what an Angular order pays names the repository's declared
    gate and the instance's document gate, and the sentence on what
    DotLn-Angular receives names the records-only commit under its
    documentation root, in place. Check: `npm run test:docs`.
65. Write-back: `docs/repositories/README.md`: one paragraph after the
    classes paragraph on `gate` and `documentationRoot`, with the rule that a
    target gate row binds the tested bytes, the selection and, at final
    review, the reviewed commit. Check: `npm run test:docs`.
66. `docs/evidence/WO-210/decisions.md`: the observation record, the release
    close paths, the goal-standard composition, the forms, the per-row table,
    the reply mapping, the binding, the session form, the body source, the
    authority rule, the publication log's home, the no-release records
    publication, the close listing, the gate declaration and its row shape,
    the claim resolution, the root's default and layout, the records set and
    its link event, the unchanged-identity proof, the planning publication,
    the close's base update, the suite durations and the dispositions of
    FUP-a065bc5b99e40660, FUP-3cceac0fff2dba94, FUP-a272d577fd351b43,
    FUP-00b15d92d53011b2 and FUP-a5c6ac8cb40bd52a; then `npm run meta`; `node
    scripts/lineage.mjs index --check`; `node scripts/check-publication.mjs
    --print-locks`; `npm run work-orders -- index`; `npm run
    publication:check`. Check: `npm run test:docs`.
67. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test --
    --review`; complete `docs/evidence/WO-210/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Deliverables:** the observation record; the kit license rule and its
cases; the target-order surface rule; the kit release-close inputs and the
preview; the carried template; the seeded version, classification and release
block; the kit goal standard and purpose declaration; the two rows running in
a kit and the two cases that named one; the identifier rule; the
target-native episode body and reply and the exported change and gate
sections; the binding and its fold check; the gate and documentation-root
declarations; the bounded wrapper's options; the target gate runner and its
rows; a target order's gate claims and `targetGate`; the records-only commit,
its event and fold; the session publish form, function and log; the
no-release records publication with its links and unchanged-identity proof;
the index links; the target-scoped planning publication; the close's base
update and listing; a target order's briefings; the argument ordering; the
extended export case; the client README; the write-backs below.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-210/decisions.md` records, from the probe run before any
   product change, every non-PASS line of `check-surfaces --local` (WO-001
   active, versioned and prepared), of `node scripts/release.mjs
   check-surfaces --committed WO-001` (WO-001 closed; the command `worktree
   publish` runs as its surface step, `scripts/worktree.mjs` lines 745-753)
   and of `license-surfaces` in the fixture export, each with its cause and
   disposition; after the change no line caused by a core-only input fails.
2. In a root holding `KIT-MANIFEST.json` and no package sources, with no
   `docs/LEGAL.md`, the license rules emit for the pins exactly one line that
   names `docs/LEGAL.md`, begins with neither `PASS` nor `FAIL` and does not
   fail, in the work tree and at a committed revision; with core's
   `docs/LEGAL.md` declared, its three pin lines are judged as in core; a
   declared `docs/LEGAL.md` that holds no pin, or a symbolic link at that path,
   fails naming it; every other license line in such a root, and every line in
   a root without `KIT-MANIFEST.json`, is unchanged.
3. In the fixture export (default license posture), from the seeds alone with
   no hand edit: after `resume activate WO-001` on branch `wo-001`, `npm run
   release -- prepare --local` exits 0 with the heading at `v0.1.0` and the
   README block holding exactly the generated line; `npm run release --
   check-surfaces --local` exits 0 with no FAIL line and with the
   `docs/LEGAL.md` unavailable line; with WO-001 driven to `closed`, `node
   scripts/release.mjs check-surfaces --committed WO-001` exits 0 with no FAIL
   line; with core's `docs/LEGAL.md` committed, the same command exits 0 with
   three PASS pin lines; with the README's release markers removed, it fails
   on a release-block line that names the two marker lines and the generated
   claim line to add.
4. In the same export, an order WO-002 whose header declares a
   `**Repository:**` line for a repository id registered in the export's
   `dotln.config.json` and whose heading carries no version, started with
   `worktree clone` and `worktree start` and driven to `closed` on `wo-002`,
   passes `node scripts/release.mjs check-surfaces --committed WO-002` with
   exit 0, and its release-block line states that the target order records no
   release; the same check fails when the README block holds a second line,
   and when the block's claim is below the latest release tag the check
   observes (origin's tags for `--committed`, `scripts/release.mjs` line 330);
   `npm test -- --only release` passes, so self orders' surface lines are
   unchanged in core.
5. The export's `KIT-MANIFEST.json` lists
   `docs/releases/tag-manifest.template.json` byte-identical to the commit's;
   at WO-001's closed revision in the export, `previewReleaseManifest` from the
   export's `scripts/release.mjs` returns a manifest whose `release.application`
   is `v0.1.0` and whose `schemas.eventEnvelope` equals the value core's
   `compatibility` derives from `packages/kernel/src/types.ts`, with no
   missing-file error; the decisions list every repository path release close
   reads after its surface check with its availability in a kit.
6. In the export, the `npm run plan -- refute` prompt's
   `goalReview.goalStandard` equals the section heading line, each
   `dotln-goal-rules` block's content of the carried product 07 §Goal-aligned
   decisions in source order, and, with no `docs/product/purpose.md`, the line
   `unavailable: docs/product/purpose.md; this instance has not declared its
   purpose`; every relative link target in it exists in the export; with a
   committed `docs/product/purpose.md` holding exactly one `dotln-purpose`
   block, that block's content replaces the unavailable line; a purpose file
   without exactly one non-empty block, a symbolic link at its path, a carried
   section with no goal-rules block and one with unbalanced goal-rules markers
   each refuse naming the path; `plan -- receipt` and `plan -- check` pass; in
   core the goal standard is the whole section as before (`npm test -- --only
   plan-refutation`) and `npm test -- --only plan-refutation-current` passes.
7. `release-surfaces` and `license-surfaces` carry no `kit:` declaration;
   WO-201's export case (`npm test -- --only launchpad`) passes its three
   selections with the printed not-carried set equal to the declared set, and
   its unavailable-selection check and the runner's kit-only rejection case
   (`npm test -- --only runner-fixtures`) name only rows that stay core-only.
8. The outward lint refuses each runtime form (`source-event:`,
   `baseline-event:`, `review-event:`, `verification:` and `contract:`
   followed directly by an identifier character, `delivery-preparation#`,
   `evt_<digits>`) in each artifact kind whose shape admits it, as
   `identifier.runtime` with its span, and passes the generator's
   "Independent verification:" sentences. In the episode route the generated
   body's Deliverable-ready section and known review items and the posted
   disposition reply hold none of the forms and pass the lint; each evidenced
   Deliverable-ready row's Evidence cell equals the text the frozen per-row
   table exported from `scripts/lib/github-body.mjs` gives for the fixture's
   artifacts and holds no test command; the recorded
   `PullRequestThreadDisposed` payload keeps the judgment's references;
   `deliverableReady`'s returned rows are unchanged; the episode route's other
   existing cases pass unchanged.
9. `targetChangeSection` is exported from `scripts/lib/github-body.mjs`, and
   the episode route's generated body keeps its change section byte-identical
   on the existing target-publish fixture (the pinned
   `scripts/fixtures/target-publish/body.md` part passes unchanged).
10. Over WO-072's real-Git fixture, through both launchpad routes, a passing
    `final-review-result` of a target order whose reviewed change is
    committed on the target's `wo-NNN` appends `FinalReviewCompleted` carrying
    `targetSubject` with exactly `repositoryId`, `branch`, `baseCommit` and
    `commit`, equal to the activation's repository and base, the target's
    branch and its HEAD, and no filesystem path; with a tracked change, a
    non-ignored untracked file, another branch checked out or no registry
    entry for the order it refuses naming the condition and the order's
    segment is byte-identical; a `fail` verdict records no `targetSubject`.
    With a declared gate whose review selection passed at the target's current
    bytes, the event also carries `targetGate` with exactly the Design's keys
    and `commit` equal to `targetSubject.commit`; with no declared gate, no
    review row at the target's current tree, a latest review row that failed,
    or review rows only at another tree, the pass refuses naming the condition
    and the segment is byte-identical. The control fold refuses a
    `targetSubject` on an order activated without a repository, each one whose
    repository, base or branch differs from the activation, and a
    `targetGate` whose commit differs from `targetSubject.commit` or whose
    selection is not `review` (`scripts/test-control-segments.mjs`). A target
    order's pass message names the target change committed before the result,
    `resume target-records`, the target publish form and the records publish.
11. Over the same fixture with a `gh` stub and the target's bare origin behind
    a GitHub URL, `worktree publish WO-NNN --target-worktree --branch
    <type>/<slug> --title <title> --body-file <path>` refuses, with no `gh`
    invocation, no push and the target origin's refs unchanged, when: the
    order launchpad's committed control holds no passing final review, its
    latest carries no `targetSubject` or no `targetGate`, or the order has no
    `TargetRecordsCommitted`; the target's `wo-NNN` differs from the recorded
    records commit, that commit's parent is not `targetSubject.commit`, or its
    diff against the parent touches a path outside the documentation root,
    deletes or renames a file, changes a mode or differs from the recorded
    records (each path named); the target or the order launchpad has tracked
    or non-ignored untracked changes; the reviewed commit equals the base; the
    registered profile denies, omits or has expired either effect, or
    requires evidence or revocation predicates; no admitted grant with
    `grantedBy: operator` names the effect in effects and operations with the
    registered id as `repo` (a `host-policy` grant does not count); origin
    names other than exactly one push URL, or one that is not a GitHub
    repository; the branch, a commit message from base to the records commit,
    the title or the final body fails the outward lint (each naming its rule,
    `identifier.runtime` among them) or local terms are unavailable; the body
    fails the GitHub body profile or carries AI attribution; a changed path is
    the bundle manifest or in its installed set; the body file is not a
    committed contained regular file of the order launchpad. When the
    repository the `gh` check resolves differs from the one derived from
    origin's push URL, it refuses with no push and no pull request. With every
    input valid it pushes exactly the recorded records commit to
    `refs/heads/<branch>` on the target origin with no tags and no upstream
    configuration, opens one pull request against the registered base branch
    whose body is the reviewed file followed by the generated change section
    and the target gate section (the gate's command names, outcomes,
    durations and the reviewed commit, and no command text or runtime
    identifier), and records `PullRequestOpened { repositoryId, number,
    headSha }` in the main checkout's ignored publication log; a rerun reports
    it and pushes nothing; the launchpad's local and origin refs are identical
    before and after. Both publish forms' usage errors, among them
    `--require-deliverable-ready` with the new form, print with no worktree on
    main.
12. With a committed `.gitignore` ignoring `deps/` and files under `deps/pkg/`
    in the target and both branches merged, `release close WO-NNN --dry-run`
    and `--publish` refuse, list `deps/` once with no file under it and no
    bundle-owned path, name the remedy with the exact close command, and leave
    both worktrees, the bundle and the files in place; after the listed paths
    are removed the same command closes with `no-release`. A publishing close
    whose clone base cannot be fast-forwarded to the fetched base, or whose
    base is checked out with changes, refuses naming the condition with the
    clone's refs, both worktrees and the bundle unchanged.
13. In one fixture run a target order whose repository declares a gate and
    the default documentation root is started, its change committed, its gate
    run, verified and passed at final review with `targetGate`; `resume
    target-records` records the records-only commit; the session publish
    opens the target pull request (stub) with that commit; the fixture merges
    the launchpad records branch into the launchpad's main, standing in for
    the operator's merge of its pull request, as WO-072's criterion 4 merges
    it; the forge merge is simulated by a merge commit of the pushed branch on
    the target origin's base, and nothing updates the clone's base branch
    before `release close WO-NNN --publish`, which fetches the base,
    fast-forwards the clone's base branch, records `no-release`, removes both
    worktrees and both `wo-NNN` branches; neither repository has a tag, and
    the target's base holds the order's file, decisions and reports under the
    documentation root.
14. In the export, with the instance's outward vocabulary and a synthetic
    local-terms list seeded as WO-118-D006 seeded them, and an operator grant
    naming `repo.push` and `pr.open` for the registered repository id
    committed in the export's `packages/skeleton/loadouts/grants.json` with its
    registered authority profile allowing both, criterion 4's WO-002, its
    repository declaring a gate of one synthetic command and the default
    documentation root, passes final review with a `targetSubject` and a
    `targetGate`; `resume target-records` records its records-only commit;
    its target branch publishes through the session form and its launchpad
    records branch through the self form with no release-notes file and no
    launchpad `npm test` row (its code identity unchanged), printing that the
    order records no release, each to a `gh` stub; WO-001's self publication
    with no release notes still refuses; after both merge, `release close`
    records `no-release`; the export's generated index card for WO-002 names
    the repository, the records commit and each record's path.
15. `dotln.config.json` admits `repositories.<id>.gate` and
    `repositories.<id>.documentationRoot` as the Design states and refuses,
    by path and key, an unknown key, a command name outside the pattern, an
    empty `argv` or a non-string entry in it, a `timeoutMs` that is not a
    positive safe integer, an empty `plain`, a selection naming an undeclared
    command, a `review` that omits a plain name, and a `documentationRoot`
    that is absolute, unnormalized, holds a backslash or holds an empty or `.`
    segment; an absent `documentationRoot` reads `docs`; `targetDocRelative`
    gives each record kind's path under the default root and under a declared
    one as `resolveRoots` gives it for a launchpad with that base;
    configurations with neither key load unchanged (`npm test -- --only
    configuration-root`). A target order's execution, repair, verification
    and final-review briefings name the documentation root in the target
    worktree as repo-native authority and the runner command its gate claims
    stand on; a self order's briefings are byte-identical.
16. Over WO-072's real-Git fixture with a declared gate of synthetic commands,
    `node scripts/target-gate.mjs WO-NNN` runs the plain selection and
    `--review` the review selection in the target worktree, each command
    under the bounded wrapper with its own timeout, and records in the order
    launchpad's gate index one row per command and one selection row carrying
    the selection, the names, the target worktree's `gateTreeHash`, its HEAD
    and the repository id; the selection row passes only when every command
    exits 0; a failing command, a command that outlives its timeout and a
    command that changes a tracked or non-ignored untracked file each fail it
    naming the command, and the runner exits non-zero; no command output
    reaches a committed file; with no declared gate it refuses naming the
    missing declaration and records nothing.
17. For a target order, a criterion recorded met that names `npm test`, `npm
    test -- --review` or the runner stands only on the target gate:
    `implementation-ready`, `repair-complete` and `verification-result`
    refuse, naming the selection, the target tree and the runner command,
    when no covering selection row exists at the target worktree's current
    tree, when the latest one failed, or when rows exist only at another tree,
    and record `targetGate` when one passed; none of them looks up or
    requires a launchpad `npm test` row for a target order; a criterion
    naming `npm run test:docs` still runs the launchpad document gate; a self
    order's claims and events are unchanged (`npm test -- --only
    runner-fixtures`).
18. After a target order's passing final review, `npm run resume --
    target-records` writes the order's file, its decisions file and every
    verification and final-review report its events record into the target
    worktree at their `targetDocRelative` paths, commits them as one commit
    whose single parent is `targetSubject.commit` with a subject that passes
    the outward lint, and appends `TargetRecordsCommitted` naming the
    repository, branch, parent, commit, root and each record's kind, path and
    SHA-256; the decisions file and the reports leave the order launchpad
    worktree and the order's file stays. It refuses, writing nothing in either
    repository, when the latest final review is not a passing one with
    `targetSubject`, the target is not clean at that commit, a report's bytes
    differ from the hash its event recorded, a record is not a contained
    regular file, a record path exists in the target with other bytes, or a
    record matches the local-terms list (named by file and line, never by the
    term); a rerun with the commit recorded reports it. The fold refuses the
    event before a passing final review, with a repository, branch or parent
    that differs from `targetSubject`, or with a path outside the registered
    root.
19. The self form publishes a target order's launchpad records branch with no
    launchpad `npm test` row when `gateCodeIdentity` at HEAD equals that at
    its merge base with `origin/main`, its body naming both identities; when
    they differ it requires the reviewer `npm test` row as today; it refuses
    a target order whose committed control holds no `TargetRecordsCommitted`
    and a branch that adds a file at an order launchpad path the event moved;
    a self order's publication still requires its reviewer row and its notes
    (`npm test -- --only runner-fixtures`, `npm test -- --only worktree`,
    `npm test -- --only target-publish`).
20. The generated work-order index's card for a target order with
    `targetRecords` names the repository, the records commit and each
    record's path under the documentation root, and no local decisions link;
    `npm test -- --only work-orders-fixtures` and `npm test -- --only index`
    pass.
21. Over WO-072's fixture with a bare target origin behind a GitHub URL and
    the `gh` stub, `npm run plan -- target-publish <repository-id> --base
    <commit> --from <directory> --branch docs/<slug> --title <title>
    --body-file <path>` commits the directory's files at the same paths under
    the documentation root on the named branch from `--base`, pushes it, opens
    one pull request against the registered base branch, records it in the
    publication log, removes its temporary worktree and local branch, and
    prints each document's repository, commit and path; it refuses before any
    remote call, with the target origin's refs unchanged, when `--base` is not
    an ancestor of the fetched base branch, a file is a symbolic link or not
    regular, a path escapes the root or lies outside its `planning` and
    `product` segments, the profile or an operator grant does not admit both
    effects, or the branch, commit message, title or body fails the outward
    lint or the body profile.
22. The manifest-listed client README: §Releases in this instance opens with
    the release block for `v0.1.0` and states what an instance's release
    surfaces check (the release block, component versions, workspace pins,
    the PR and release-notes body profile, the license files and package
    publication guards, and `docs/LEGAL.md`'s pins only where the instance
    declares that file), that the seeded WO-001 carries the first version and
    `release prepare` assigns later ones above the instance's own tags, that a
    target order's records branch records no release and carries the links,
    and the one-time remedy for an instance exported before this order, which
    the executor of its next order applies on the operator's word; §Planning
    in this instance states what the instance's refutation judges (the kit's
    platform rule blocks and the declared purpose or its unavailability,
    never core's purpose or critical path), how to declare a purpose, and how
    a target-scoped pass publishes its documents; §First steps states that a
    target order's publication needs the instance's own outward vocabulary
    and an operator grant for the registered repository, which the kit does
    not carry and an instance order's executor commits on the operator's
    stated values, names the session form, and states how a registered
    repository declares its gate and documentation root; §What runs here, and
    what does not lists the selections observed in step 11 and no longer names
    `docs/LEGAL.md` as a limit or the two rows as core-only.
23. Write-backs land, each in place with no dated paragraph: product 07
    §Workflow closeout and releases (the records branch's surface rule and an
    instance's surfaces; in the "Target publish (WO-064)" paragraph the
    session route, the no-release records publication with its links and its
    unchanged-identity proof, and the target-native references; the paragraph
    after it on the target gate, the documentation root, the records-only
    commit and a target-scoped pass's publication; in the registered-target
    close paragraph the listing, its remedy and the close's own base update),
    §Preflight before the full gate (the runner), §Where the control plane
    finds its documents, §Operator resume phrases — how you get dispatched
    (step 59's registered-target sentences in the final-review authority
    paragraph) and §Operator-opened planning pass (outside the platform-first
    standard's span); product 03 §Platform and instance boundary; product 02
    §Actors and episodes (the edge); product 12 §One workstream across
    repositories; `docs/repositories/README.md`; `docs/PLAYBOOK.md` §The loop,
    per work order; `docs/LEGAL.md` §Current state; the decisions file, with
    the dispositions of FUP-a065bc5b99e40660, FUP-3cceac0fff2dba94,
    FUP-a272d577fd351b43, FUP-00b15d92d53011b2 and FUP-a5c6ac8cb40bd52a; the
    publication locks refreshed. Product 07 §Goal-aligned decisions is not
    edited by this order. No byte figure binds these write-backs.
24. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency. No re-mint and no live feedback episode is owed.
25. Regular untracked `.DS_Store` files at the root and under nested
    directories, both ignored and non-ignored, do not block a registered
    target's release close or the clone base's cleanliness check. A dry run
    keeps their bytes; a publishing close completes without an operator
    cleanup step. A tracked change, a `.DS_Store` symlink, a directory with
    that name and unrelated ignored material still refuse and remain intact.
    The target-close fixtures exercise these cases and verify the bundle's
    exclude block is removed after a successful close.
    Starter refresh also admits regular untracked Finder metadata in its
    recorded checkout, preserves it in a dry run, and continues to refuse
    tracked changes, unrelated untracked files and symbolic links.
26. Release-close starter refresh updates changed seed templates in the
    starter only where the destination matches a prior export. Every other
    difference for a changed template refuses with the destination path
    before any push; customized, missing or non-regular copies of unchanged
    templates are preserved. The refresh
    row records every seed rewritten. Fixtures exercise unchanged prior-export
    copies, customized copies, refusal without publication and retry.
27. The recovery fixture starts with v0.81.0's seed bytes, WO-001 activated on
    main and verified pass, and all of its control and report records still
    uncommitted. It refreshes the starter with this release, has the instance's
    session fast-forward that update and recover WO-001 into wo-001, then passes
    `release prepare --local`, `check-surfaces --committed WO-001` and the
    publication surface step without hand-editing release inputs. The order's
    control segment and records survive the update and recovery.
28. The instance README makes its own session responsible for update and
    recovery after the operator's instruction. The operator's workflow uses
    phrases and pull-request merges and requires no hand-run Git commands.

**Preflight:** `npm test -- --only launchpad-planning` for steps 1 and 57,
`npm test -- --only license-fixtures` and `npm test -- --only
license-surfaces` for steps 2–3, `npm test -- --only release`, `npm test --
--only release-surfaces` and `npm test -- --only target-worktree` for steps
4–5, `npm test -- --only launchpad` for steps 6–8, 10–11 and 58, `npm test --
--only plan-refutation` and `npm test -- --only plan-refutation-current` for
step 9, `npm test -- --only runner-fixtures` for steps 12, 35, 39–40 and 48,
`npm test -- --only outward-lint` for steps 13–14, `npm test -- --only
github-body` for steps 15–16 and 46–47, `npm test -- --only target-publish`
for steps 17–20, 26, 29–30 and 49, `npm test -- --only worktree` for steps 19,
27, 29 and 48, `npm test -- --only resume` for steps 22–23, 39, 41–44 and 56,
`npm test -- --only target-worktree` for steps 21, 24–28, 31–32, 36–38,
41–42, 44–47, 50–52 and 54–55, `npm test -- --only configuration-root` for
steps 33–34, `npm test -- --only work-orders-fixtures` and `npm test -- --only
index` for step 53, `npm test -- --only plan` for step 54, and `npm run
test:docs` for steps 59–66 and whenever a document changes, each under `node
scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the export case under the bounded wrapper (`npm test --
--only launchpad-planning`) with its recorded duration; the fixture
transcripts of criteria 10 to 13 and 15 to 21; `license-fixtures`,
`license-surfaces`, `release`, `release-surfaces`, `target-worktree`,
`plan-refutation`, `plan-refutation-current`, `launchpad`, `runner-fixtures`,
`outward-lint`, `github-body`, `target-publish`, `worktree`, `resume`,
`configuration-root`, `work-orders-fixtures`, `index` and `plan` under `npm
test -- --only`; `npm run test:docs`; `npm test -- --review` before
`implementation-ready` (declared machinery sources change) and again at final
review. No live run: every criterion is judged on fixture exports and
launchpads, synthetic orders, references and gate commands, scratch origins
and a `gh` stub. What the fixtures traverse at 6dbd8771: `worktree clone`, a
target's `worktree start`, the lifecycle from a target worktree through both
launchpad routes and the target close run in `scripts/test-target-worktree.mjs`
(lines 357-565); the `gh` stub, the Git wrapper and a bare origin behind a
GitHub URL run in `scripts/test-target-publish.mjs` (lines 236-290); the
bounded wrapper runs in the launchpad only, with a fixed deadline; the export
runs the planning commands and `check-surfaces --local` with no order; the
binding, the session form, the no-release records publication, the kit
surface rules, the goal-standard composition, the gate and root declarations,
the target gate, the records-only commit and its event, the index links, the
target-scoped planning publication and the close's base update do not exist
(steps 2 to 56 build them); no export with a registered target has run, and
step 57 builds one on the existing export. The first live target gate run,
records-only commit and session publication are the instance's first Angular
order after this order's release (planning document §12.4); WO-083's measured
run is one of those orders.

**Write-back duty:** as listed in criteria 22 and 23.

**Known issues and carry-ins:**

- FUP-06de60fa5d19fe5a (WO-074-D010) is allocated here by the 2026-10-13 pass's
  touching feed. This order edits the self publish check an instance's own
  orders run and the registration fields of `scripts/lib/config.mjs`. So it
  confirms, in the export case, that a fork's publish check reads the
  instance's own operator identity rather than exempting core's, and records
  the result in the decisions.
- FUP-a065bc5b99e40660 (WO-202-D010) is allocated here with its premise
  corrected: the failure reaches an instance's own order at `worktree
  publish`'s surface step before release close, WO-083's Angular order is a
  registered-target order that performs no instance self release close, and
  prepare needs a README block the kit did not seed.
- FUP-3cceac0fff2dba94 (WO-202-D012) is allocated here; this planning pass adds
  the marker blocks and the order only reads them.
- FUP-a272d577fd351b43 (WO-118-D010) is allocated here on its first branch
  (runtime identifiers do not belong in target-facing text), which assumption
  8 puts to the operator; the session body is a reviewed file plus the
  generated change section, linted with the rule.
- FUP-00b15d92d53011b2 (WO-072-D010) is allocated here on the row's first
  route (keep D003, list once, name the remedy).
- FUP-a5c6ac8cb40bd52a (WO-185-D016) is allocated here: this order touches
  `scripts/worktree.mjs` publish argument checks, the row's reopening
  condition.
- The generated reviewer skill still orders the commit after the result and
  names only the self publish, and the executor and verifier skills name
  `npm test`; until WO-192 (placed after this order) writes the target-order
  branch into the executor, verifier and reviewer text, a target order's
  roles follow the briefings, the refusals and the pass message, and product
  07's amended authority paragraph (step 59) is the authority. Reopen: a
  target-order final review stops at the skill's authority sentence.
- The role skills read the whole §Goal-aligned decisions (product 07 §Read
  order for a cold start), so an instance session still reads core's purpose
  and critical-path sentence; this order makes the refutation subject
  neutral, not the session read. Reopen: an instance session's decision or
  receipt cites core's purpose or critical path.
- WO-001's `worktree publish` runs in the export only to its surface step and
  its refusal without notes; the no-release notes step and the contribution
  sign-off run on WO-002's records branch, whose fixture commits carry a
  matching `Signed-off-by` trailer. The sign-off exempts only the author
  identity hard-coded in `scripts/lib/contributions.mjs` line 5
  (FUP-06de60fa5d19fe5a stays deferred; an instance commit by another
  identity needs a DCO sign-off).
- An export made with `--license none` still fails the license-file and
  manifest-license rules, which encode core's decision; no instance the
  operator keeps uses it. Reopen: an instance exported with `--license none`,
  or adopting other terms, runs its release surfaces.
- A self order's release close never runs in an export; the first real
  instance release close is the observation. Reopen: an instance's release
  close fails on a repository input the decisions list as available.
- Instances exported before this order keep their seeds (README §Kit files and
  instance files); once they take the update and hold an order, their
  `release-surfaces` row fails until the README's one-time remedy is applied:
  the executor follows the documented update first and adds a missing block
  and version only if they remain absent afterwards, on the operator's
  dispatch, recording the repair in its decisions; no step is left to the
  operator's hands.
- An instance still declares its critical path at core's dated path
  (`scripts/lib/plan-subject.mjs` lines 563-567), and the generated claim line
  names DotLn (`scripts/lib/release-preparation.mjs` lines 25-26); both are
  left.
- FUP-b28b870422a74166 (reused gate rows over inputs excluded from code
  identity, `docs/LEGAL.md` among them) is left: in a kit the
  `license-surfaces` row now runs and depends on `docs/LEGAL.md`'s presence as
  core's row does.
- The `launchpad-planning` suite's growth is this order's watch: a duration
  above twice the 33.15 s WO-202 recorded is written in the decisions with its
  cause, never trimmed by dropping a case.
- An instance publishes a target order only after its own outward
  vocabulary, local-terms list and operator grant exist (WO-118-D006); the
  kit carries no vocabulary (`scripts/kit/README.client.md` lines 215, 228
  and 238 name it core-only data) and seeds `grants.json` as `[]`. An
  instance order's executor commits the vocabulary and the grant on the
  values the operator states, recording the operator's word as a capture in
  ignored intake with its SHA-256 (the form `resume waive --capture` takes),
  and writes the ignored local-terms list from the terms the operator states;
  the operator merges that order's pull request. The export case seeds all
  three; a kit seed is not this order's, and step 58's README sentence tells
  the instance's roles.
- Target containment after a forge merge: `closeTargetWorktree` proves the
  branch merged into the clone's local base branch (lines 47-56); release
  close now fetches the base and fast-forwards the clone's base branch itself
  (Design), so the operator's only steps are the phrase and the forge merge.
  A squash or rebase merge still leaves `wo-NNN` unmerged by ancestry and the
  close refuses; the route case merges with a merge commit; the PLAYBOOK
  write-back says so; the containment rule is unchanged.
- Every commit from base to the records commit is linted, as the episode
  route lints its commits (`scripts/lib/target-publish.mjs` lines 1147-1152);
  a non-conventional commit refuses the publish naming its rule, and the tool
  never rewrites history.
- `--require-deliverable-ready` applies to the episode form only; WO-083's
  step 5 names the session form (this planning pass's amendment).
- FUP-f82660a8edb23a4d (WO-072-D008) stays with its row: this order reads the
  order launchpad's registry and changes no selection or ownership.
- A target order's `VerificationCompleted` now carries the target gate row
  it stood on (the target tree and HEAD), not a `targetSubject`; whether a
  later order binds verification to a target commit is the planner's.
- The Deliverable-ready reasons for an unmet row name DotLn event types
  (`BaselineWitnessed`, `ReviewCompleted`; `scripts/lib/github-body.mjs` lines
  728, 739, 754, 857 and 864); they print only for a row that
  `--require-deliverable-ready` refuses before publication; reword them within the Boy Scout bound or
  record them as left.
- Test commands stay out of target text (WO-064-D003); outcomes are named.
- The private-path screen for records bound for a target's documentation
  root is WO-213's, placed directly after this order; until an instance takes
  WO-213's release, its records-only commits and planning publications are
  screened by the local-terms list and the outward lint only. Reopen: a
  record published into a target root holds an absolute home path.
- Order identifiers are numbered per instance, so two instances working on
  one target could write records at the same path; the records action
  refuses a path that exists with other bytes rather than overwrite it.
  Reopen: a second instance or work fork registers the same target (a
  namespace for record paths is then the planner's).
- The records-only commit is not re-gated: it adds only records under the
  documentation root after the reviewed commit, and the target's own
  pull-request checks judge the merged result (assumption 13). Reopen: a
  target's declared gate reads its documentation root and a records-only
  commit fails it.
- The records carry the instance's vocabulary into the target by the
  operator's direction (planning document §12.8); the outward lint judges
  the pull request's branch, commit messages, title and body, not the files
  under the root. WO-083's Design sentence on keeping the launchpad's
  vocabulary in the launchpad is amended to match (this pass).
- A target-scoped pass's documents reach the target but are not in the
  refutation subject, which is the instance's sequence and orders. Reopen: a
  target planning document needs independent judgment (WO-088's planning
  contracts are the likely home).
- The forge merges of both pull requests stay the operator's (product 07:
  final review never merges), as do the dispatch phrases; every other
  repository change on this route is a role's (operator direction,
  2026-10-13).
- In the operator's fork a target order no longer pays the kit's `npm test`
  (41.7 s fresh in the fixture export) at its completions or, while the
  launchpad code identity is unchanged, at its records publication; it pays
  the target's declared commands instead, whose durations are unknown until
  DotLn-Angular declares them.
- The verification worker spawned by the resident still runs class `checks`
  under its 30-second limit; this order does not route the resident through
  the target gate. Reopen: a resident-owned order on a registered target
  needs the target's suites.

**Non-goals:** changing the release-notes or sign-off rules of a self order's
publication; the contribution identity (FUP-06de60fa5d19fe5a); an instance
license decision other than core's files; a kit action that edits an existing
instance's README or first order; running a self order's `release close` with
forge doubles; editing product 07 §Goal-aligned decisions or the role skills'
reads; changing core's goal standard code path or any historical subject hash;
an instance critical-path declaration path; merging on the target; a target
release ladder or tag; a source-change episode for session orders; changing
the episode route's binding, authorization or push lane; the vertical's branch
name; role skill text, the generated reviewer skill included (the
briefings, the refusal, the pass message and product 07 carry the target
steps; WO-192 writes the role text); a kit seed for an instance's vocabulary
or grants; containment after squash or rebase merges; target-order selection
messages (FUP-f82660a8edb23a4d); WO-083's own run; a namespace for record
paths across instances; re-gating the records-only commit; moving the
instance's order file out of it; class `checks` as a target gate; refuting a
target planning document's bytes; the resident's verification of target
orders; the fork's own test tiers (WO-207).

**Operator-review assumptions**

1. Core's license files and pins are the posture of every instance the
   operator keeps (product 03 §Platform and instance boundary); an instance
   that declares `docs/LEGAL.md` declares core's pins.
2. An instance's first release is `v0.1.0`, carried by the seeded first order
   and README block.
3. An instance declares its purpose as one `dotln-purpose` block in
   `docs/product/purpose.md`; the kit never seeds one.
4. A target order records no release; its records branch keeps one
   well-formed README claim, never below the latest release.
5. A target order's reviewed subject is a commit on its `wo-NNN` branch, made
   by the reviewer before a passing result.
6. The session route's pull-request body is reviewer-authored and committed in
   the order launchpad, screened by the outward lint and followed by a
   host-generated change section; the title and the remote branch name are the
   reviewer's, screened by the same lint.
7. The registered authority profile is the envelope for session publication,
   and an operator grant naming the registered id in the committed grant
   registry is the operator's authorization. Both the profile and the grant
   registry come from main's committed bytes; the order branch cannot grant
   its own publication (operator-delegated default, WO-210-D028; WO-064's
   effect rule, with the profile in place of a compiled loadout).
8. Runtime evidence identifiers never belong in target-facing text, the
   pull request's branch, commit messages, title, body and replies
   (FUP-a272d577fd351b43's first branch); the records under the
   documentation root are the instance's records and keep their references.
9. Each registered repository declares its gate in the launchpad
   configuration (`repositories.<id>.gate`: named commands with timeouts, a
   plain and a review selection, the review holding every plain command); a
   target order's gate claims resolve only to those rows plus the launchpad's
   document gate, never to core's or the kit's `npm test` (operator
   direction, 2026-10-13; planning document §12.7).
10. A target gate row binds the exact non-ignored bytes of the target
    worktree (`gateTreeHash`), its HEAD and the selection; final review binds
    it to the reviewed commit because the worktree is clean at that commit;
    the latest row at those bytes decides, so a later failure refuses until a
    later pass.
11. The documentation root's key is `documentationRoot` and its default name
    is `docs`, laid out with the launchpad's default segments, so core's
    `docs/` qualifies as a target root unchanged (planning document §12.10);
    a target whose `docs/` holds incompatible material declares another root.
12. A target order's records-only commit carries the order's file (copied;
    the instance keeps its activation authority), its decisions file and
    every verification and final-review report (moved; the instance keeps a
    link); raw evidence, the pull-request body and the control segment stay
    in the instance (planning document §12.8).
13. The records-only commit is not re-gated: it touches only the
    documentation root after the gated commit, and the target's own
    pull-request checks judge the merged result.
14. A target-scoped planning pass publishes its planning document and its
    product-document edits in one ordinary pull request on the target,
    branched from the target commit the planner read; the instance's own
    planning document links them, and the refutation judges the instance's
    subject, not the target documents' bytes.
15. Release close fetches the target's base branch and fast-forwards the
    clone's before judging containment, because the operator makes no
    repository change by hand; the operator types the phrases and merges the
    pull requests (operator direction, 2026-10-13).
