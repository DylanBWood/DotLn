# WO-230 — A target publish describes the change its pull request shows: the Change table, the base-tree exemption and the no-change check are taken from the merge base of the subject and the target's base branch when the subject has moved past its activation base, the body names the activation base that merge base descends from, and the plan gate's path advisory skips the launchpad's own record paths

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** patch. A correction of the base the session
publish's Change table, base-tree exemption and no-change check are computed
from, one added clause in the composed body's closing sentence, and one
filter in a plan-gate advisory; no new command, event, state field, registry
field or admission rule. Assigned at activation under the standing opt-out
default.
**Cost:** adds, in `scripts/lib/target-publish.mjs`, one helper that fetches
the target's base branch through the lane and reads the merge base of the
subject and that branch, threaded into `publishTargetDraft` and
`publishTargetWorktree` where they call `targetChanges`, `baseTreePaths`
and `composeTargetBody` and where they refuse an unchanged tree; in
`scripts/lib/github-body.mjs`, the Change section's closing sentence naming
the activation base when it differs from the described base; in
`scripts/lib/plan-receipts.mjs`, a filter in `targetOrderPathAdvisories`
for an order's own record paths; cases in
`scripts/test-target-worktree-publish.mjs` and
`scripts/test-plan-refutation.mjs`; two sentences in product 07; decisions.
Removes the state the operator's fork met on 2026-10-24: a verified target
order whose draft publish is refused before any push because the table
describes 515 files from an activation base the base branch has since
passed, 17 of them earlier orders' moved records whose identifiers the lint
refuses, and a plan gate that advises renaming the kit's own evidence files
(eight of the fork's eleven advisories). Re-mints: none known; no edition
names `target-publish.mjs`, `github-body.mjs` or `plan-receipts.mjs` as a
source (a read of `scripts/sync.mjs`, the compiler sources and the harness
manifest at `5173e80a`); the executor runs `npm run sync` and `node
scripts/harness.mjs check` before handoff and records the result.
Wall-clock: one fetch and one `git merge-base` per publish, both already
paid by the push and the close. Context bytes: this file, about 22,000.
Steps: 9.
**Nomination provenance:** the fork's WO-013 final review of 2026-10-24
(its FINAL-001 finding F1 and decisions WO-013-D008 and WO-013-D009, read
on this machine in the fork's WO-013 worktree), carried by the operator's
dispatch of 2026-10-24 (ignored capture SHA-256
`99666faaed554acceaac9a21f0aa1bc3e50c3a6b7f320b7bf514954cb4856923`): the
operator chose the fork's route (a), a core fix taken through a kit update,
during that review, and directed this pass to place the order next. Filed
by the [2026-10-24 second pass](../planning/target-publish-base-2026-10-24.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; the fork is the operator's own project, and this order
copies nothing from its text beyond order ids, commit ids, counts and generic
terms.
**Depends on:** WO-227 (closed, v0.91.0: the outward lint's identifier
refusal for a target's artifacts, the composed body and its Change-table
rows), WO-221 (closed, v0.85.0: the `--draft` form at `verified`), WO-080
(closed, v0.96.0: the index's stale mark per repository base, the signal
that an order's base is behind its base branch). No open order edits
`target-publish.mjs`, `github-body.mjs` or `plan-receipts.mjs`.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-227",
    "relation": "satisfied-by-close",
    "reason": "the identifier refusal and the composed body whose Change table this order computes from a different base"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "the draft publish form this order corrects"
  },
  {
    "workOrderId": "WO-080",
    "relation": "reference-only",
    "reason": "the index's stale mark already shows the condition this order's publish then handles; nothing here changes the index"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator resume phrases — how
you get dispatched (the `--draft` sentence at lines 465 to 469), §Workflow
closeout and releases (the session publish paragraph at 2005 to 2020 and the
records paragraph at 1880 to 1895), §Operator-opened planning pass item 5;
`scripts/lib/target-publish.mjs` (`observeTarget` 753 to 799 and
`targetChanges` 803 to 827; `publishTargetDraft` 974 to 1130: the registry
check 997 to 1001, the no-change check 1019 to 1022, the change and body
reads 1111 to 1125; `publishTargetWorktree` 1295 to 1395: the equals-base
refusal 1334 to 1337, the change read 1352 to 1356, the body read with
`kitPaths` 1376 to 1395; `lintArtifacts` 1864 to 1960, the `existed` and
`kit` exemptions 1915 to 1923); `scripts/lib/github-body.mjs`
(`targetChangeSection` 1096 to 1106, `composeTargetBody` 1125 to 1175, the
baseline sentence 1070 to 1071); `scripts/lib/plan-receipts.mjs`
(`executionPlanPaths` 1604 to 1616, `targetOrderPathAdvisories` 1617 to
1690); `scripts/lib/control.mjs` (`CORRECTABLE_FIELDS` 25);
`scripts/lib/target-worktrees.mjs` (the registry's base check 427, the
descent check 470 to 487); `scripts/lib/target-worktree-close.mjs`
(`fetchRemoteBranch` at 459); `scripts/lib/target-worktree-fixture.mjs` (the
declared base and the later commit 114 to 127);
`scripts/test-target-worktree-publish.mjs` (the Change-table lint cases 1799
to 1808); `scripts/test-plan-refutation.mjs` (the advisory cases 2708 to
2709); `docs/evidence/WO-227/decisions.md` D004; the fork's
`docs/evidence/WO-013/decisions.md` D008 and D009 and
`docs/final-reviews/WO-013/FINAL-001.md` F1 (read-only, in the fork's
WO-013 worktree on the operator's machine).

**Objective:** When a registered target order's subject descends from a
base-branch commit later than its activation base, the session publish's
pull request describes the change the forge shows and nothing more, and the
plan gate warns only about paths a publish would meet:

- **The table and its exemptions come from the merge base.** In
  `publishTargetDraft` and `publishTargetWorktree`, the base for
  `targetChanges`, `baseTreePaths` and `composeTargetBody` is the merge
  base of the subject commit (the draft commit; the records commit) and the
  target's base branch as fetched at publish, whenever the activation base is
  an ancestor of that merge base; when the two are equal, every byte of
  today's table, exemptions and body is unchanged. A subject that does not
  descend from the activation base still refuses as today.
- **The no-change checks compare against the described base.** A working
  tree equal to the described base's tree refuses "no change to draft"; a
  records commit equal to it refuses "no target change to publish".
- **The body says which base it describes.** The Change section's closing
  sentence names the described base and, when it differs from the
  activation base, adds "activated at base <activation>, which <described>
  descends from". The activation base stays the base of every record,
  event, registry entry and verification; nothing rebinds it.
- **The fetch comes first and a failed fetch refuses.** The base branch is
  fetched through the lane before the merge base is read, as release close
  fetches it; a fetch failure refuses before any push, naming the remote,
  with the prepared work retained for the retry.
- **The plan gate advises on target paths only.** `targetOrderPathAdvisories`
  skips an Execution-plan path under the order's own record roots
  (`docs/evidence/WO-NNN/`, `docs/verifications/WO-NNN/`,
  `docs/final-reviews/WO-NNN/`, as the launchpad's configured roots
  resolve them), because those files reach a target only as moved kit
  records, which the lint exempts from the identifier rule by design; a
  target-side path carrying an identifier or a review word is advised as
  today.

**Observed gap (dated 2026-10-24 at `main` `5173e80a`):**

- `publishTargetDraft` computes `targetChanges(entry.target,
  state.baseCommit, draftCommit)` (1111) and composes the body with
  `baseCommit: state.baseCommit` and `baseTreePaths(entry.target,
  state.baseCommit, …)` (1114 to 1125), passing no `kitPaths`;
  `publishTargetWorktree` reads the same three from `subject.baseCommit`
  (1352 to 1356, 1376 to 1395) with `kitPaths` from `targetRecordSources`.
  `state.baseCommit` is set only by `WorkOrderActivated`;
  `CORRECTABLE_FIELDS` (`control.mjs` 25) exclude it; the registry entry
  must equal it (`target-worktrees.mjs` 427; `worktree.mjs` 680), and the
  pre-publish check requires only that HEAD descend from it (470 to 487).
- The lint lifts the identifier rule for a Change row whose path the base
  tree held (`existed`) or the kit's records commit wrote (`kit`)
  (`target-publish.mjs` 1915 to 1923). A moved record of an earlier order is
  neither when the base tree predates it, so its path is refused, and an
  identifier is repaired, never confirmed (WO-227).
- The fork's case: WO-013 was activated at base `bc9133e9`, DotLn-Angular's
  initial commit, which the fork's planning pass of 2026-10-24 wrote as a
  stand-in for its predecessor WO-007's merge commit (its D5 to D10: "each
  base the predecessor's merge commit", set "by the pass that follows it");
  WO-007 had not merged when the orders were cut at 01:41 that day and
  merged as `2ab4f28` at 12:23, and no fork pass ran before WO-013 was
  activated. The draft commit's parent is `2ab4f28` and its tree the
  verified tree; `git diff --name-only bc9133e9 <draft>` lists 515 files,
  `2ab4f28 <draft>` 83; the publish refused `pr-body refused:
  identifier.launchpad` with 26 findings on 17 Change-table rows, every one
  a `docs/dotln/` record of WO-004 to WO-007 (the fork's D008, D009,
  FINAL-001 F1). `bc9133e9` is an ancestor of `2ab4f28` and of the draft
  (`git merge-base --is-ancestor`, read on this machine). Main at the time
  the orders were cut, `90fa6e8`, would have failed the same way: the table
  would then carry all of WO-007's change, its moved records included. The
  only correct base did not exist when the order was cut.
- Core's own orders carry no `**Repository:**` line (0 of the order files
  at `5173e80a`): a launchpad order's base is `main` when `worktree start`
  branches and is never behind it. Only a registered target order pins a
  base in its text at planning time, and the kit's publish diffs from that
  pinned base instead of from the branch the pull request will merge into.
- The fixture already holds the shape: `target-worktree-fixture.mjs` commits
  `later.txt` ("not in declared base") on the target's `main` after the
  declared base (114 to 127), and no publish case fast-forwards the order
  worktree onto it before publishing, so no case meets the stale table.
- `targetOrderPathAdvisories` (1617 to 1690) reads every backticked path in
  an open target order's Execution plan and advises when it carries a
  launchpad identifier or a review word, with no distinction between a
  target-side path and the launchpad's own record paths; the fork's `plan
  check` at v0.94.0 prints eleven advisories on eight orders, eight of them
  on `docs/evidence/WO-NNN/…` and `docs/final-reviews/WO-NNN/RELEASE-NOTES.md`
  (its planning pass of 2026-10-24, §4; its request block, item 1).
- The index marks a member stale when its base is behind its base branch
  (WO-080, v0.96.0), so the operator can see the condition before a
  publish; nothing changes what the publish then does.

**Design (scope discipline):**

- Merge base, not the draft commit's parent. The parent equals the merge
  base when the branch sits at the base branch's head, the fork's case, but
  names the previous published commit when the branch carries one (a second
  final publish after a repair), while the forge's pull request diff is
  always from the merge base; the table then matches what the reviewer sees
  on the forge in every case.
- No base advance event and no correctable `baseCommit`. The activation base
  is the subject of `BaselineWitnessed`, the verification and the registry
  entry, and the body renders "Baseline reproduced or walked at commit
  {base}" (`github-body.mjs` 1070 to 1071); rebinding it would name a base
  no baseline was walked at. Declined in the map with its reopening
  condition.
- The episode form keeps the request's base. `observeTarget` (753 to 799)
  binds the effect receipt's diff hash to the request's base and a
  resident's episode works from the base it was handed; an episode whose
  subject integrates a later base-branch commit is a Known issue with its
  reopening observation, not this order's change.
- Fetch through the lane, as release close does (`fetchRemoteBranch`), so a
  stale local `origin/<baseBranch>` cannot choose a base the forge no
  longer agrees with; the publish already needs the remote for its push, so
  a fetch failure refuses nothing a push would have admitted.
- Unchanged when equal. When the merge base equals the activation base (the
  fixture's declared base with `later.txt` unintegrated; every core fixture
  today) the table, exemptions, checks and body are byte for byte today's,
  and the existing cases prove it without edits.
- The retry identity is unchanged: a prepared draft commit is reused while
  its tree, parent and title match (product 07); a retry after the base
  branch advanced recomputes the table from the new merge base, which is
  what "Changed inputs refuse with the work retained" already requires of
  the body.

**Deliverables:** the described-base helper and its use in both session
publish forms; the no-change checks against it; the closing sentence; the
advisory filter; the paired-control fixture cases; the product 07 sentences;
`docs/evidence/WO-230/README.md`, `controls.json` and `decisions.md`.

**Acceptance criteria (all required)**

1. In the target-worktree fixture, with the order worktree fast-forwarded
   onto the base branch's later commit before `node scripts/worktree.mjs
   publish WO-999 --target-worktree --draft …`, the Change table lists only
   the order's own files, its closing sentence names the merge base and
   "activated at base <declared>, which <merge base> descends from", and
   the lint judges only those rows. The paired control: the same case at
   the base commit lists `later.txt` in the table. Both recorded in
   `docs/evidence/WO-230/controls.json`.
2. The final publish form (`publishTargetWorktree`) computes its table,
   exemptions and body from the same described base: a fixture case with a
   moved record of an earlier order present on the base branch but absent
   from the activation base's tree publishes with that record in neither
   the table nor the lint's findings when the subject descends from the
   base branch's head; the existing final publish cases pass without
   edits, their tables unchanged.
3. The draft form refuses "no change to draft" for a working tree equal to
   the described base's tree, and the final form refuses "no target change
   to publish" for a records commit equal to it; both cases in the fixture.
4. A fetch failure of the base branch at publish refuses before any push,
   names the remote without a path, and retains the prepared work; the
   retry reuses the prepared commit when its tree, parent and title match.
5. A subject that does not descend from the activation base refuses as
   today ("target HEAD does not descend from the activated base commit");
   the existing case stands.
6. `npm run plan -- check` on a fixture target order whose Execution plan
   names `docs/evidence/WO-901/host-qualification.md`,
   `docs/final-reviews/WO-901/RELEASE-NOTES.md` and `docs/WO-006-notes.md`
   prints one identifier advisory, for `docs/WO-006-notes.md`; the existing
   review-word advisory for `fixtures/gem-board.json` stands.
7. Product 07's `--draft` sentence and its session publish paragraph say
   which base the table describes and when the activation base is named
   beside it; `npm run publication:check`, `npm run test:docs` and `npm test
   -- --review` pass at handoff; the decisions record the fixture's
   before-and-after file counts (criterion 1), the merge-base-over-parent
   decision, the declined base advance and the episode form's Known issue.

**Preflight:** `npm test -- --only target-worktree` and `npm test -- --only
target-publish` for steps 2 to 5; `npm test -- --only github-body` and `npm
test -- --only outward-lint` for step 4; `npm test -- --only plan-refutation`
for step 6; `npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --` for the steps that edit their declared
sources; then one `npm test -- --review` (07-execution-guide.md §Preflight
before the full gate).

**Execution plan (the executor follows these steps in order; observed at `5173e80a`, 2026-10-24):**

1. `docs/evidence/WO-230/README.md` (new): at the base, reproduce the fork's
   shape in the fixture: fast-forward the order worktree onto the target's
   later commit, run the draft publish, record the table's file count with
   `later.txt` in it (or the lint's refusal when the fixture's later file
   carries a term), as the before measurement of criterion 1.
2. `scripts/lib/target-publish.mjs`: one helper that, given the registry
   entry, the activated state and the subject commit, fetches the base
   branch through the lane (reusing the close's fetch), reads `git
   merge-base <subject> refs/remotes/origin/<baseBranch>`, requires the
   activation base to be an ancestor of it (else the activation base is the
   described base), and returns the described base with the activation
   base; thread it through `publishTargetDraft`: the no-change check,
   `targetChanges`, `baseTreePaths` and `composeTargetBody`.
3. The same in `publishTargetWorktree`: the equals-base refusal and the
   three reads, with `kitPaths` as today.
4. `scripts/lib/github-body.mjs`: `targetChangeSection` and
   `composeTargetBody` take the activation base and render the closing
   clause when it differs; the lint sections and row offsets are unchanged,
   which `scripts/test-github-body.mjs` or the suite's existing cases show.
5. `scripts/test-target-worktree-publish.mjs`: the paired-control cases of
   criteria 1 to 5, recorded in `docs/evidence/WO-230/controls.json`.
6. `scripts/lib/plan-receipts.mjs`: the record-root filter in
   `targetOrderPathAdvisories`, resolving the roots as `docRelative` does;
   `scripts/test-plan-refutation.mjs`: the case of criterion 6.
7. Product 07: the two sentences (criterion 7); `npm run publication:check`.
8. `docs/evidence/WO-230/decisions.md`: the counts, the design decisions and
   the Known issues of this order with their reopening observations.
9. `npm run sync`, `node scripts/harness.mjs check`, `npm run meta`, `npm
   run test:docs`, `npm test -- --review`; handoff.

**Evidence gate:** the Preflight suites; the paired controls of steps 1 and
5 recorded in `docs/evidence/WO-230/controls.json`; `npm run test:docs`;
`npm test -- --review`. No live model run and no publish against a real
forge: the fixture's forge stands in, as it does for WO-227's cases.

**Write-back duty:** criterion 7 and step 7.

**Known issues and carry-ins:**

- The episode form (`observeTarget`) keeps the request's base by design;
  reopen when a resident's episode integrates a later base-branch commit
  before its publication and the table misstates the change.
- A base advance event or a correctable `baseCommit` is declined (the map's
  candidate of this pass); reopen when an order needs its activation base
  itself rebound, a baseline re-walked at the new base, or when the index's
  stale mark must clear without a publish.
- The fork's three target-side fixture names that carry a platform order id
  (`segments/WO-221.json`, `segments/WO-226.json`, `wo-221-derived-v0.json`)
  are refused by the lint at their first publish unless renamed: a new path
  carrying a launchpad identifier is refused, and only after that first
  commit is the path the target's own vocabulary. This order changes no
  lint rule (WO-227); the answer block of the filing pass tells the fork.
- The fork's WO-014 and WO-016 share WO-013's activation base; this order's
  publish covers them with no change on their side, and the fork's next
  planning pass sets each new order's base when its predecessor has merged
  (its D008's last sentence).
- A planning-time rule that refuses or warns on a target order's base behind
  its base branch at `worktree start` is not filed: the index's stale mark
  (WO-080) is that signal. Reopen when an instance activates a second order
  on a stale base after this order ships.

**Non-goals:** a new lifecycle event or a correctable `baseCommit`; a change
to the episode form's base or its diff hash; the outward lint's rules
(WO-227); a `worktree start` refusal or advisory on a declared base behind
the base branch; renaming any file in a target; a planning-time rule that
sets a target order's base; the pull request's forge-side base branch,
which stays the registered `baseBranch`.

**Operator-review assumptions**

1. The pull request should describe the order's own change as the forge
   shows it, not every commit since the activation base.
2. The activation base remains the verification's base; no record is
   rewritten and no event is added.
3. The fork takes the fix through a starter update and then dispatches
   `resume: fix` on WO-013 (its D009 route); until then WO-013 stays
   verified and unpublished by its own safe default.
