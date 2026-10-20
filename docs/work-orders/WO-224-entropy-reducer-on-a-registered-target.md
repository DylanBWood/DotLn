# WO-224 — The Entropy Reducer reviews a registered target repository or a workstream's repositories: `npm run entropy -- review --repository <id> [<commit>]` and `--workstream WS-NNN` freeze the registered clone at a recorded commit the way the launchpad is frozen, run the pinned reviewer, the blinded refutation and the immutable receipts in the launchpad, dispose into its register with rows a pass allocates to the workstream's orders, and ship in the kit (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. Two flags on `entropy review` and
`entropy subject`, a subject record whose `repository` names a registration
id, receipts and candidate headings that name the repository and commit,
and the review guide's text. No existing refusal weakens; the launchpad
subject, its receipts and its checks are unchanged. Assigned at activation
under the standing opt-out default.
**Cost:** adds the repository and workstream subjects in
`scripts/lib/entropy-review.mjs` (`resolveSubject`, `freezeSubject`,
`subjectRecord`, `beginEntropyReview`, `fileEntropyReview`,
`beginEntropyRefutation`, `fileEntropyRefutation`, `disposeEntropyFinding`,
`entropySubject`) and their flags in `scripts/entropy.mjs`; the workstream
block reader (the `dotln-workstream` JSON block of
`docs/workstreams/WS-NNN-*.md`); fixture cases in
`scripts/test-entropy-review.mjs` over a fixture launchpad with a registered
fixture target; the review guide and the product 07, 05 and 12 sentences
the write-backs step names. Removes the state the gap records: an
instance that can review its launchpad and not the repositories where its
product code lives, so the discipline the launchpad has (a frozen subject,
a pinned reviewer, a blinded refutation, immutable receipts, operator
disposition into the register) stops at the control plane. Per-episode
cost at the pinned actor: about 993 s and USD 9.50 by the REVIEW-002
observation (product 07 §Operator-opened planning pass), USD 9.32, 5.03
and 7.21 per review-and-refutation pair for REVIEW-005 to REVIEW-007 (the
2026-10-20 entropy pass §5.3), paid once per member repository of a
workstream; the fixtures run the `fake` transport. Re-mints:
`packages/skeleton/src/entropy-review-protocol.ts` and
`packages/skeleton/src/loadouts/entropy-reducer.ts` are registered sources
(`scripts/lib/evidence-sources.mjs` lines 77, 85, 170 and 209) and the
protocol file is in `FEEDBACK_SOURCE_PATHS`
(`packages/skeleton/src/feedback-audit.ts`); the design keeps both files
unchanged (the subject schema already admits any string `repository`, and
the loadout compiles against the `repo` path it is given), so no re-mint
and no live feedback episode is owed unless a step must edit one of them,
in which case the executor records the deterministic re-mint and runs one
live feedback self-host episode on Codex `gpt-6.1-sol` at `max` or Claude
Code `claude-opus-5-5` at `xhigh`, no authorization needed, cost accepted.
`scripts/entropy.mjs` and `scripts/lib/entropy-review.mjs` are declared
machinery sources of `launchpad-planning` (`machinerySources` in
`scripts/test-runner.mjs`), so `npm test -- --review` runs before handoff.
Wall-clock: a target review adds one clone of the registered clone and one
checkout at the named commit, as the launchpad review does today; a
workstream review runs its episodes in sequence. Commands: `--repository
<id> [<commit>]` and `--workstream WS-NNN` on `review` and `subject`.
Context bytes: this file, about 26,000. Tokens: unknown until run. Steps:
11.
**Nomination provenance:** the operator's request of 2026-10-20, carried
in the `planning: standard planning pass +` dispatch of that day (ignored
capture, SHA-256
`794059fbb2ede05d959a20f2608863a7eb3293ffaefb7009c8407c71a51b15c3`): a way
to run the Entropy Reducer against a workstream's repositories, with the
same frozen subject, pinned reviewer, blinded refutation, immutable
receipts and operator disposition into the launchpad's register, exported
in the kit; the operator's observation that no order or register row plans
it, confirmed by this pass over the orders and the map. Planner-synthesized
by the [2026-10-20 fork-answers pass](../planning/fork-answers-and-entropy-targets-2026-10-20.md).
Opaque identifier, not a priority. Clean-room screen: the subject is the
operator's own public repository, the reviewer's clean-room stop screen is
unchanged, and the fixtures are the kit's.
**Depends on:** WO-151 (closed, v0.42.0: the command family); WO-165
(closed, v0.52.1: the route agreement); WO-071 (closed: registered target
repositories and the clone mapping). WO-219 (step 22: the frozen copy's
route home and the refs digest) and WO-080 (the workstream convention's
final text) are referenced with no typed edge: this order places the
workstream reader on the kit template's JSON block as it reads today, and
whichever of WO-219 and this order runs second rebases on the first.
**Recommended placement:** after WO-080 in the serial queue: the three
batches run first, WO-080 settles the workstream document the `--workstream`
form reads, and WO-219's confinement guard on the frozen copy lands before
a copy of a target is frozen. The operator may move it by one sequence
edit; the fork gains the capability at the first starter release after
this order's close. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-151",
    "relation": "satisfied-by-close",
    "reason": "the entropy command family this order extends"
  },
  {
    "workOrderId": "WO-165",
    "relation": "satisfied-by-close",
    "reason": "the pinned route and its receipts"
  },
  {
    "workOrderId": "WO-071",
    "relation": "satisfied-by-close",
    "reason": "the registered target repository and its recorded clone this order freezes"
  },
  {
    "workOrderId": "WO-219",
    "relation": "reference-only",
    "reason": "step 22's frozen-copy confinement; whichever runs second rebases"
  },
  {
    "workOrderId": "WO-080",
    "relation": "reference-only",
    "reason": "the workstream document convention the --workstream form reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Operator-opened
planning pass (the `planning: entropy reducer` paragraph), §Workflow
closeout and releases (the registered-target paragraphs), §Where the
control plane finds its documents; 05-pattern-library.md (the Entropy
Reducer paragraph); 12-workstream-application.md §One workstream across
repositories; `docs/instance/entropy-reducer/README.md` §The subject,
§What the reviewer may run, §Receipts, dispositions and the register;
`scripts/lib/entropy-review.mjs` (`freezeSubject`, line 334;
`resolveSubject`, line 363; `subjectRecord`, line 373;
`beginEntropyReview`, line 1084; `fileEntropyReview`, line 1242;
`beginEntropyRefutation`, line 1455; `disposeEntropyFinding`, line 1905;
`entropySubject`, line 2070); `scripts/entropy.mjs` (the usage block);
`packages/skeleton/src/entropy-review-protocol.ts` (`assertEntropySubject`,
line 149; `entropyReviewPrompt`, line 421);
`packages/skeleton/src/loadouts/entropy-reducer.ts`
(`compileReviewerWorkOrder`, line 1251); `scripts/lib/target-worktrees.mjs`
(`recordedRepositoryClone`, line 282; `cloneMapPath`);
`scripts/lib/target-record-reader.mjs` (`readTargetRecord`'s lookup of the
clone); `scripts/kit/workstream.template.md` (the `dotln-workstream` JSON
block); `scripts/test-entropy-review.mjs`; `docs/planning/entropy-reviews/REVIEW-007.md`;
the [2026-10-20 planning document](../planning/fork-answers-and-entropy-targets-2026-10-20.md)
§5.

**Objective:** An operator at a launchpad, core or an exported instance,
runs the Entropy Reducer against a registered target repository or a
workstream's repositories with the discipline the launchpad review has:

- **The subject is a registered repository at a recorded commit.** `npm run
  entropy -- review --repository <id> [<commit>]` freezes a copy of the
  registered clone (`recordedRepositoryClone`, read in the order WO-223
  gives the moved-record reader) at the named commit, or at the clone's
  fetched base-branch head when none is named, exactly as the launchpad is
  frozen: a clone with no hard links and no checkout, detached at the
  commit, under the launchpad's scratch lane, with the dependency copy when
  the clone has one; the subject record's `repository` is the registration
  id, its hash covers it, and the receipt's subject names the repository,
  the commit and the frozen path. The pinned reviewer runs the same
  compiled program over that copy; the host revalidates the return; the
  receipt is filed and bound in the launchpad as today.
- **The refutation and the binding follow the subject.** `refute` freezes
  the same repository at the same commit for the blinded second worker; the
  filing's binding is the explicit-commit route (the named commit still
  resolves to the reviewed tree in the clone), the clone's refs and tracked
  status are witnessed before and after the episode and recorded, and the
  launchpad's own tracked status is recorded, not the subject.
- **Dispositions land in the launchpad's register and can target the
  workstream's orders.** `dispose … accept` appends the candidate under a
  heading that names the review, the repository and the commit, so the
  collector's row names the target and a planning pass allocates it with
  `--apply` to any order of the launchpad, the workstream's members
  included; proposal packets file under `docs/proposals/` as today.
- **A workstream is its member repositories.** `review --workstream WS-NNN`
  reads the distinct `repositoryId`s of the workstream document's
  `dotln-workstream` JSON block, runs one episode per repository in
  sequence (the launchpad itself when a member names `self`), files one
  receipt per repository carrying the workstream id, and `subject
  --workstream WS-NNN` reports consume, pending or review per repository,
  consuming before producing as today.
- **The kit carries it.** The commands are kit files already; a kit fixture
  instance with a registered fixture target runs the subject and the review
  under the `fake` transport, and the review guide states the subjects.

**Observed gap (dated 2026-10-20 at `main` `a6b68245`):**

- `freezeSubject` (`scripts/lib/entropy-review.mjs` line 334) clones `root`,
  the launchpad, and detaches at `baseCommit`; `resolveSubject` (line 363)
  resolves a revision of the launchpad; `subjectRecord` (line 373) writes
  `repository: "."` and hashes the commit, the tracked-status digest and
  the scratch inventory; `beginEntropyReview` (line 1084) takes a
  `revision` of the launchpad and nothing else about the subject;
  `beginEntropyRefutation` (line 1455) freezes `root` at
  `review.subject.baseCommit` and sets `repository: "."` again; the usage
  block of `scripts/entropy.mjs` offers `review [<commit>]` and no
  repository or workstream flag. The compiled program is a census of the
  paths `git ls-files` names in the frozen copy
  (`packages/skeleton/src/entropy-review-protocol.ts`, line 438), and the
  loadout compiles against whatever `repo` path it is given
  (`compileReviewerWorkOrder`, line 1251). A registered target repository
  is a separate clone under the registration's `worktreeParent`
  (`scripts/lib/target-worktrees.mjs`), so it is never in the subject.
- `assertEntropySubject` (protocol line 149) requires `repository` to be a
  string and nothing more; the fixture asserts `"."`
  (`scripts/test-entropy-review.mjs` line 264). `entropySubject` (line
  2070) and `unconsumedReview` (line 2029) read the filed reviews without
  regard to a subject repository, because there is one.
- The kit template `scripts/kit/workstream.template.md` carries a
  `dotln-workstream` JSON block (`{ id, members: [{ workOrderId,
  repositoryId }], edges }`); the operator's instance holds `WS-001` for
  DotLn-Angular in that shape; WO-080 makes the generated index read it
  and may replace the template's text.
- No order and no register row plans a review of a target repository or a
  workstream: WO-193 names Entropy Reducer proposal packets as a request
  source; FUP-c7f181269a96c4c5 is the cadence candidate; the map's
  candidate sections name neither subject (grep over `docs/work-orders/`,
  `docs/planning/work-order-map.md` and `docs/product/` on 2026-10-20).
- The confinement findings REVIEW-007 made on the launchpad's frozen copy
  (ER7-001: the copy keeps the source as `origin`) apply to a frozen target
  unchanged; WO-219 step 22 repairs them for `freezeSubject`.

**Design (scope discipline):**

- *One freeze path, parameterized.* `freezeSubject(source, commit)` takes
  the repository to clone; the launchpad passes `root`, the target form
  passes the recorded clone. The subject record carries the registration
  id in `repository` (the launchpad keeps `"."`), the clone's path only in
  `scratchRepository` as today, and the hash covers the id. Rejected: a
  second freeze path for targets (axis: one witness chain; two paths drift
  apart); freezing the target's order worktree instead of its clone (axis:
  the subject is a recorded commit, and an order worktree is live work).
- *The explicit-commit route is the target's route.* A target subject is
  always a named commit (the clone's fetched base-branch head when the
  operator names none), so the filing binds the commit to the reviewed
  tree in the clone and records the launchpad's own drift rather than
  refusing it; the clone's `refs` digest and tracked status are the witness
  (WO-219's rule once landed, this order's own otherwise). Rejected:
  refusing a dirty launchpad for a target review (axis: the subject is the
  target; the launchpad's working tree cannot move a target commit).
- *Receipts in the launchpad, named by subject.* `REVIEW-NNN` numbering,
  the control log and `entropy check` are unchanged; the receipt and the
  candidates heading name `<id>@<commit>`. Rejected: filing receipts into
  the target repository (axis: the receipt chain's immutability and the
  launchpad's register; a target's records commit may link them later).
- *A workstream is a sequence of episodes.* One episode per distinct member
  repository, one receipt each with the workstream id; the launchpad
  joins only when a member names `self`. Rejected: one composite frozen
  root holding every member (axis: the compiled census runs in one
  repository, and a composite copy is no repository anyone can name later).
- *No change to the protocol or the loadout unless forced.* The subject
  schema admits the id today and the loadout takes a path; if a step must
  edit either file, the Cost line's re-mint and live episode apply.
  Rejected: a new subject schema version (axis: the feedback and evidence
  editions; a version bump for a field that already fits).
- *Core as a target.* Product 12 makes core a registered target of the
  operator's instance later; nothing here is specific to Angular or to the
  fork, and a review of core from an instance follows the same route once
  core is registered there.

**Deliverables:** the two flags and their paths; the fixture cases; the
review guide and product write-backs; decisions and README.

**Acceptance criteria (all required)**

1. In a fixture launchpad with a registered fixture target, `entropy
   review --repository <id> --transport fake` freezes the target's clone at
   its fetched base-branch head, or at the named commit when one is given,
   and the filed receipt's subject names the repository id, that commit and
   the frozen copy's path, with `repository` equal to the registration id
   and the launchpad's own tracked status recorded rather than refused; a
   case asserts each, and the launchpad review's receipt still records
   `repository: "."`.
2. `entropy refute REVIEW-NNN --transport fake` on that receipt freezes the
   same repository at the same commit, the filed pair passes `entropy
   check`, and the clone's refs and tracked status are byte-identical
   before and after both episodes, recorded in the receipts; a case asserts
   each.
3. `entropy dispose REVIEW-NNN <id> accept '<reason>'` appends the candidate
   under a heading naming the review, the repository and the commit;
   `npm run plan -- followups --sync` mints a row whose title names the
   repository; `--apply` allocates it to a fixture order that is a member
   of the fixture workstream; a case asserts the heading, the row and the
   allocation.
4. `entropy review --workstream WS-NNN --transport fake` over a fixture
   workstream whose block names two repositories files two receipts, each
   carrying the workstream id, and `entropy subject --workstream WS-NNN`
   reports one line per repository (consume, finish the pending dispatch,
   or review); a second `review` while one is pending is refused as today;
   a workstream block that names an unregistered repository refuses before
   any clone.
5. The frozen copy of a target has no route to its clone (no `origin`, or
   a refusing push URL, as WO-219 step 22 gives the launchpad copy) and a
   push attempt from the copy fails in a fixture; a missing clone mapping
   refuses before any clone, naming the lookup order of WO-223.
6. A kit fixture instance runs `entropy subject --repository <id>` and
   `review --repository <id> --transport fake`; the review guide's §The
   subject and §Receipts, dispositions and the register state the target
   and workstream subjects; product 07, 05 and 12 carry the sentences step
   10 names; `npm run meta -- --check` passes.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; where `entropy-review-protocol.ts` or
   `entropy-reducer.ts` changed, the editions re-minted deterministically
   and the live feedback episode recorded.

**Preflight:** `npm test -- --only plan-refutation` for the review, refutation, disposal and workstream steps;
`npm test -- --only entropy` for the receipt chain;
`npm test -- --only target-worktree` for the fixture target and its clone;
`npm test -- --only launchpad` and `npm test -- --only launchpad-planning` for the kit fixture and the guide;
`npm test -- --only skeleton` if the protocol or the loadout changes;
`npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base.

**Execution plan (the executor follows these steps in order; observed at `a6b68245`, 2026-10-20):**

1. `docs/evidence/WO-224/README.md` (new): at the base, what `entropy
   review` freezes (the launchpad only), the subject record's fields, and
   the fixture target the cases will register (the fixture helper of
   `scripts/test-target-worktree-publish.mjs`), written before any change.
   Check: the README names the base behavior with the commands run.
2. `scripts/lib/entropy-review.mjs` (`freezeSubject`, `resolveSubject`,
   `subjectRecord`): `freezeSubject(source, commit)` clones the given
   repository; `resolveSubject` takes either a launchpad revision or a
   registration id with an optional commit, resolves the clone through
   `recordedRepositoryClone` in WO-223's lookup order (running checkout,
   primary checkout, main worktree) and the commit to the clone's
   `refs/remotes/origin/<baseBranch>` head when none is named; the subject
   record carries the registration id in `repository` and hashes it; a
   case per path. Check: `npm test -- --only plan-refutation`, under
   `node scripts/harness.mjs bounded --`.
3. Same file (`beginEntropyReview`, `fileEntropyReview`): the review
   dispatch takes the subject from step 2, compiles the reviewer against
   the frozen target path, and the filing binds the named commit to the
   reviewed tree in the clone, records the launchpad's tracked status
   without refusing on it, and witnesses the clone's refs and tracked
   status before and after; the receipt's subject names the repository
   and commit. Check: `npm test -- --only plan-refutation` and `npm test
   -- --only entropy`, under `node scripts/harness.mjs bounded --`.
4. Same file (`beginEntropyRefutation`, `fileEntropyRefutation`): the
   refutation freezes the review's repository at its commit with the same
   witnesses and files as today. Check: as step 3.
5. Same file (`disposeEntropyFinding`, the candidates heading;
   `entropySubject`, `unconsumedReview`): the heading names the review,
   the repository and the commit; the subject report takes an optional
   repository or workstream and answers per subject. Check: as step 3.
6. `scripts/lib/entropy-review.mjs` (a `workstreamRepositories(root,
   id)` reader) and `scripts/entropy.mjs` (the usage block, `review
   --repository <id> [<commit>]`, `review --workstream WS-NNN`, `subject
   [--repository <id> | --workstream WS-NNN]`): the reader parses the
   `dotln-workstream` JSON block of `docs/workstreams/WS-NNN-*.md`, refuses
   an unregistered member repository before any clone, and the workstream
   review runs one episode per distinct repository in sequence, each
   receipt carrying the workstream id; the launchpad joins when a member
   names `self`. Check: `npm test -- --only plan-refutation`, under `node
   scripts/harness.mjs bounded --`.
7. `scripts/test-entropy-review.mjs`: the cases of criteria 1 to 5 over a
   fixture launchpad with a registered fixture target and a fixture
   workstream of two repositories, under the `fake` transport; the push
   attempt from the frozen copy; the missing-mapping refusal. Check: `npm
   test -- --only plan-refutation` and `npm test -- --only
   target-worktree`.
8. `scripts/test-launchpad-planning.mjs` (or the kit fixture that runs
   the planning commands in an exported instance): the kit fixture
   instance registers a fixture target and runs `entropy subject
   --repository <id>` and `review --repository <id> --transport fake`.
   Check: `npm test -- --only launchpad` and `npm test -- --only
   launchpad-planning`.
9. `docs/evidence/WO-224/decisions.md`: one decision per step with the
   chosen option, the rejected option, the case and the reversal
   condition; whether the protocol or the loadout changed and, if so, the
   re-mint and the live episode's record. Then `npm run meta`. Check: `npm
   run meta -- --check`.
10. Write-backs, in place: `docs/instance/entropy-reducer/README.md` §The
    subject (the target and workstream subjects, the explicit-commit
    binding) and §Receipts, dispositions and the register (the heading
    names the repository); `docs/product/07-execution-guide.md`
    §Operator-opened planning pass (the `planning: entropy reducer`
    paragraph: the subject token and the per-repository episode cost);
    `docs/product/05-pattern-library.md` (the Entropy Reducer paragraph:
    the subject may be a registered target or a workstream);
    `docs/product/12-workstream-application.md` §One workstream across
    repositories (the paragraph beginning "A workstream owns an outcome":
    a workstream's repositories can be reviewed as one subject set). Check:
    `npm run test:docs`.
11. Handoff: `npm run format`; `npm run test:docs`; the gate the
    executor's role text names at the base (the order's Preflight suites,
    then the handoff gate; `npm test -- --review`, because declared
    machinery sources changed); complete `docs/evidence/WO-224/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; `entropy check`; `npm run
test:docs`; the handoff gate. No live model run: the fixtures use the
`fake` transport, and the first live target review is the operator's own
`planning: entropy reducer` dispatch with a subject.

**Write-back duty:** criterion 6 and step 10.

**Known issues and carry-ins:**

- WO-219 step 22 edits `freezeSubject` and the confinement records for the
  launchpad copy (ER7-001); this order parameterizes the same function.
  Whichever runs second rebases, and a frozen target carries the same
  no-route-home rule either way (criterion 5).
- WO-080 may replace the kit's workstream template text; this order reads
  the `dotln-workstream` JSON block as the template carries it today, and
  the block's shape (`members[].repositoryId`) is the contract it relies
  on. If WO-080 changes that shape before this order activates, step 6
  reads WO-080's final block.
- The planner role text (`packages/skeleton/src/loadouts/contributor.ts`)
  names `npm run entropy -- subject` without a subject token; a role-text
  change is not this order's (cold-start headroom), and the phrase
  `planning: entropy reducer` with a trailing repository id or workstream
  id is read by the planner from product 07's sentence of step 10.
- A live review of a target costs the pinned actor's episode per
  repository; the fixtures prove the mechanism and the first live run is
  the operator's dispatch.
- FUP-c7f181269a96c4c5 (the reviewer on a cadence) stays deferred; nothing
  here runs a review unless the operator opens a pass.

**Non-goals:** a review cadence; fixes in the target repository; filing
receipts into the target; registering core as a target of an instance (the
route is the same once product 12's later step registers it); any change to
the compiled program, the lens briefs or the pinned actor; a composite
multi-repository frozen root.

**Operator-review assumptions**

1. The order runs after WO-080 and after WO-219; the operator may move it
   by one sequence edit.
2. The first live target review is the operator's `planning: entropy
   reducer` dispatch naming the fork's registered repository or `WS-001`,
   at the pinned actor's cost per repository.
