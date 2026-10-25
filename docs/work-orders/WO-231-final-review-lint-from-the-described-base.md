# WO-231 — The final-review lint of a target order's commits reads the described base: `final-review-result pass` lints the commits between the subject and its merge base with the target's fetched base branch when the activation base is that merge base's ancestor, names the range and the activation base in a refusal, and keeps today's activation-base range for a subject the base branch has not passed (v0.97.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** patch. A correction of the commit range one
review-time lint reads, one shared helper carrying a rule the publish
already applies, and one message; no new command, event, state field,
registry field or admission rule. Assigned at activation under the standing
opt-out default.
**Cost:** adds one small module, `scripts/lib/target-base.mjs`, holding the
described-base choice `describedTargetBase` already makes (the merge base
when the activation base is its ancestor, else the activation base), called
from `scripts/lib/target-publish.mjs` after its fetch and from
`scripts/lib/target-commit-lint.mjs` with the clone's fetched base-branch
ref; in `target-commit-lint.mjs`, the range and the message; two cases and
their paired control in `scripts/test-target-worktree-start.mjs`; one
sentence in product 07; decisions. Removes the state the DotLn-Angular fork
met on 2026-10-24: a verified target order whose `final-review-result pass`
is refused on commits already merged on the target's base branch, which no
one can repair. Re-mints: none known; no edition names
`target-commit-lint.mjs` or `target-publish.mjs` as a source (a read of
`scripts/lib/evidence-sources.mjs` and the harness manifest at `0027d9c1`);
the executor runs `npm run sync` and `node scripts/harness.mjs check` before
handoff and records the result. Wall-clock: one `git rev-parse` and one `git
merge-base` per review, no fetch. Context bytes: this file, about 19,000.
Steps: 8.
**Nomination provenance:** the DotLn-Angular fork's WO-013 FINAL-002 of
2026-10-24 (read on this machine in the fork's WO-013 worktree, read-only),
carried by the operator's dispatch of 2026-10-24T23:52Z (ignored capture
SHA-256
`40b671e9178bdef0bbdf809e2c442fbdccf1d8d09471290a5ce9675464bf22be`), and
the operator's mid-turn direction of 2026-10-25 in the same capture that a
starter release must not break or block the instance that takes it. Filed
by the [2026-10-25 pass](../planning/fork-returns-and-review-lint-2026-10-25.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; the fork is the operator's own project, and this order
copies nothing from its text beyond order ids, commit ids, counts and generic
terms.
**Depends on:** WO-230 (closed, v0.96.1: the publish's described base and the
rule this order shares), WO-227 (closed, v0.91.0: the lint's rules, which
this order leaves unchanged). No open order edits `target-commit-lint.mjs`,
`target-publish.mjs` or `test-target-worktree-start.mjs`.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-230",
    "relation": "satisfied-by-close",
    "reason": "the described-base rule the publish applies and this order moves into a shared helper the review lint also calls"
  },
  {
    "workOrderId": "WO-227",
    "relation": "satisfied-by-close",
    "reason": "the outward lint's commit rules, applied unchanged to a narrower range"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator resume phrases — how
you get dispatched (the target review sentence at line 676, "A passing final
review binds the clean target commit and its review gate"), §Workflow
closeout and releases (the session publish paragraph at 2018 to 2027: "the
subject's merge base with the fetched target base branch when it descends
from the activation base, otherwise the activation base"), §Operator-opened
planning pass item 5; `scripts/lib/target-commit-lint.mjs` (`targetCommits`
19 to 27; `lintReviewedTargetCommits` 30 to 66, the range at 31 to 36, the
format refusal 41 to 48, the identifier refusal 52 to 59, the comment at 29
"Final review reads commit objects without loading the publication
runtime"); `scripts/resume.mjs` (`final-review-result` 1750 to 1772: the
subject bound at 1762 to 1767 and the lint call at 1768 to 1772);
`scripts/lib/target-worktrees.mjs` (`reviewedTargetSubject` 412 to 495,
`baseCommit: state.baseCommit` at 492); `scripts/lib/target-publish.mjs`
(`describedTargetBase` 830 to 862: the ancestor check 837 to 842, the fetch
843 to 850, the merge-base choice 851 to 861; `publishTargetWorktree`'s lint
of `changes.commits` at 1469 to 1479; `targetChanges` 803 to 827);
`scripts/lib/github-repository.mjs` (`fetchRemoteBranch` 264 to 288);
`scripts/lib/outward-lint.mjs` (the commit subject rules 690 to 710,
`subjectLengthLimit` at 705 to 706); `scripts/test-target-worktree-start.mjs`
(the two review-lint cases 1516 to 1563: a nonconventional subject, a
90-character subject; `prepareFinalReview` and `withFixture` imported from
`scripts/lib/target-worktree-fixture.mjs` at 13 to 17);
`scripts/lib/target-worktree-fixture.mjs` (the target's `main` with
`later.txt` pushed after the declared base, 114 to 127); the fork's
`docs/final-reviews/WO-013/FINAL-002.md` (read-only, in the fork's WO-013
worktree on the operator's machine).

**Objective:** When a registered target order's subject descends from a
base-branch commit later than its activation base, `final-review-result
pass` judges the commits the pull request will carry and nothing more:

- **The range is the subject's own commits.** `lintReviewedTargetCommits`
  lints `<described base>..<subject>`, where the described base is the
  merge base of the subject and the clone's fetched base-branch ref
  (`refs/remotes/origin/<baseBranch>`) whenever the activation base is an
  ancestor of that merge base, and the activation base otherwise; the choice
  is the rule `describedTargetBase` applies at publish, moved into one
  helper both call.
- **A refusal says what it read.** The message names the number of commits
  linted, the described base, the activation base when the two differ, and
  the subject, so an operator reading "subject.length: 90 of 72 characters"
  can see which commit and which range produced it.
- **Nothing recorded changes.** `targetSubject.baseCommit` in
  `FinalReviewCompleted` stays the activation base, `targetGate` binds the
  same reviewed commit, and the publish's own lint of `changes.commits` from
  the fetched merge base is unchanged.
- **No fetch at review.** The lint reads the ref the clone already holds (the
  reviewer's `worktree integrate` fetched it, and the publish fetches again
  through the lane before it lints the same commits); when the ref is
  absent, the lint reads from the activation base as today and says so.

**Observed gap (dated 2026-10-25 at `main` `0027d9c1`):**

- `lintReviewedTargetCommits` (`target-commit-lint.mjs` 30 to 36) lints
  `targetCommits(entry.target, subject.baseCommit, subject.commit)`, and
  `reviewedTargetSubject` (`target-worktrees.mjs` 492) binds `baseCommit` to
  `state.baseCommit`, the activation base. WO-230 (v0.96.1) moved the
  publish's Change table, exemptions and no-change check to
  `describedTargetBase` (`target-publish.mjs` 833 to 862) and its lint of the
  published commits to `changes.commits` from that base (1469 to 1479); it
  did not touch this lint, which `resume.mjs` calls at `final-review-result
  pass` (1768 to 1772) before any event is appended.
- The fork's case, read on this machine in `DotLn-Angular-wo013` (branch
  `wo-013` at `99a30be`): `git rev-list bc9133e9..99a30be` lists 17 commits,
  16 of them reachable from the target's `main` (`2ab4f28`); two merged
  subjects measure 78 and 90 characters (`90fa6e8`, `2e983e8`); the merge
  base of `99a30be` and `main` is `2ab4f28`, one commit below the subject,
  whose subject measures 61. `final-review-result pass` printed `target
  publish refused: commit message format refused before final review:
  subject.length: 90 of 72 characters` and recorded nothing (the fork's
  FINAL-002, 2026-10-24T23:16Z to 23:45Z). The refused commits are the
  target's own history: nothing in the order, the launchpad or the fork can
  change them.
- Every other reader of a target order's base keeps the activation base on
  purpose: `target-gate.mjs` 28 and `target-worktree-close.mjs` 315 compare
  the registry entry with the activated state; `github-body.mjs` 657 to 979
  verify records against the activation base and 1097 to 1154 render the
  described base beside it; `target-worktrees.mjs` 427 and 480 check the
  registry and descent. Only this lint describes a change and reads the
  wrong base for it.
- The fixture already holds the shape: `target-worktree-fixture.mjs` pushes
  `later.txt` to the target's `main` after the declared base (114 to 127),
  so the clone's `refs/remotes/origin/main` is one commit past the base in
  every case; the two review-lint cases (1516 to 1563) commit on the order
  branch at the declared base, so their merge base with that ref is the
  declared base and their refusals are unchanged by this order. No case
  fast-forwards the order branch onto `main` before the review.
- The 2026-10-24 second pass that filed WO-230 enumerated the publish's
  reads of the activation base and not every reader of the field; receipt
  054 did not raise it either. The planning document of this pass records
  the correction and the screen it adds to product 07.

**Design (scope discipline):**

- One rule in one place. The choice "merge base when the activation base is
  its ancestor, else the activation base" leaves `describedTargetBase` for a
  small module (`scripts/lib/target-base.mjs`) with no publication imports,
  because `target-commit-lint.mjs` deliberately loads no publication runtime
  (its comment at 29); `describedTargetBase` calls it after its fetch and
  the lint calls it with the clone's ref. Rejected: a second copy of the
  rule in the lint (axis: two copies drift; the fork's case is exactly a
  rule applied in one place and not the other).
- The fetched ref, not a fetch. A review is a judgment, not an effect; the
  reviewer's `worktree integrate` fetched the base branch moments before,
  and the publish fetches through the lane and lints `changes.commits` from
  the fetched merge base, so a stale ref at review only lints more commits
  and is corrected at publish. Rejected: `fetchRemoteBranch` at review
  (axis: a network call and a refusal path inside the review transition;
  it would make `final-review-result pass` need the remote).
- Merged commits are the target's own vocabulary. Commits reachable from the
  base branch are already on the forge; the lint's purpose is to stop a
  commit the order adds from carrying an identifier that cannot be repaired
  after the review. Rejected: raising the subject limit or exempting merged
  commits by message (axis: a rule weakened to pass against a range made
  right).
- Absent ref, old range. A clone with no `refs/remotes/origin/<baseBranch>`
  is linted from the activation base as today, with the absence named, so
  a never-fetched clone fails loud rather than quietly skipping history.

**Deliverables:** the shared helper; the lint's range and message; the
publish calling the helper; the paired-control cases; the product 07
sentence; `docs/evidence/WO-231/README.md`, `controls.json` and
`decisions.md`.

**Acceptance criteria (all required)**

1. In the target-worktree start fixture, with the target's base branch
   carrying, after the declared base, a merged commit whose conforming
   subject is over 72 characters, the clone's base-branch ref fetched, the
   order branch fast-forwarded onto that ref and one conforming commit
   added, `npm run resume -- final-review-result pass <actor-flags>` exits
   0 and appends `FinalReviewCompleted` with `targetSubject.baseCommit`
   equal to the activation base. The paired control: the same case at the
   base refuses `subject.length: <n> of 72 characters`. Both arms' exit
   codes recorded in `docs/evidence/WO-231/controls.json`.
2. The two existing cases stand without edits: a nonconventional subject
   and a 90-character subject committed on the order branch at the declared
   base are refused as today, because their merge base with the fetched ref
   is the declared base.
3. A refusal names the range: the count of commits linted, the described
   base, "activated at base <activation base>" when the two differ, and the
   subject commit, before the rule finding; a clone whose
   `refs/remotes/origin/<baseBranch>` is absent is linted from the
   activation base and the message says the ref was absent. Both in the
   fixture.
4. `describedTargetBase` in `target-publish.mjs` calls the shared helper
   and every existing publish case passes without edits, its tables and
   closing sentences unchanged.
5. Product 07's target review sentence (§Operator resume phrases, line 676)
   says which commits the review lints and from which base; `npm run
   publication:check`, `npm run test:docs` and `npm test -- --review` pass
   at handoff; the decisions record the fork's counts (17 commits from the
   activation base, 1 from the merge base) and the no-fetch decision.

**Preflight:** `npm test -- --only target-worktree` for steps 2 to 5; `npm
test -- --only target-publish` for step 4; `npm test -- --only
configuration-root` for every script step; `npm run test:docs` when a
document changes; each under `node scripts/harness.mjs bounded --` for the
steps that edit their declared sources; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `0027d9c1`, 2026-10-25):**

1. `docs/evidence/WO-231/README.md` (new): at the base, reproduce the fork's
   shape in the fixture (a long merged subject on the target's `main`, the
   order branch fast-forwarded onto it, one conforming commit) and record
   the refusal as the before measurement of criterion 1.
2. `scripts/lib/target-base.mjs` (new): one exported function taking a Git
   reader, the activation base, the subject and the base-branch tip, and
   returning `{ baseCommit, activationBase }` by the rule
   `describedTargetBase` applies today (lines 851 to 861); no publication
   import.
3. `scripts/lib/target-commit-lint.mjs`: resolve
   `refs/remotes/origin/<entry.baseBranch>` in the target (absent is a named
   state), call the helper, lint `baseCommit..commit`, and prefix each
   refusal with the range sentence of criterion 3.
4. `scripts/lib/target-publish.mjs`: `describedTargetBase` keeps its
   ancestor check and fetch and delegates the choice to the helper.
5. `scripts/test-target-worktree-start.mjs`: the cases of criteria 1 and 3
   with their paired control, recorded in `docs/evidence/WO-231/controls.json`.
6. Product 07: the sentence of criterion 5; `npm run publication:check`.
7. `docs/evidence/WO-231/decisions.md`: the counts, the no-fetch decision,
   the helper's placement.
8. `npm run sync`, `node scripts/harness.mjs check`, `npm run meta`, `npm
   run test:docs`, `npm test -- --review`; handoff.

**Evidence gate:** the Preflight suites; the paired controls of steps 1 and
5 recorded in `docs/evidence/WO-231/controls.json`; `npm run test:docs`;
`npm test -- --review`. No live model run and no publish against a real
forge: the fixture's forge stands in, as it does for WO-230's cases.

**Write-back duty:** criterion 5 and step 6.

**Known issues and carry-ins:**

- A stale `refs/remotes/origin/<baseBranch>` lints more commits than the
  forge's pull request will carry and can refuse a merged subject; the
  message names the range so the remedy (fetch, then retry) is visible, and
  the publish's own lint reads the fetched merge base. Reopen when a review
  is refused on a merged commit after a fetch, or when the review and the
  publish disagree on a commit set in the field.
- The DotLn-Angular fork's WO-013 waits for the release that carries this
  order and its starter update; its FINAL-002 stands as a truthful fail and
  its next review reuses pull request #6 (the fork's FINAL-002). Nothing in
  the fork is this order's to change.

**Non-goals:** a fetch at review; a change to the outward lint's rules or
the 72-character limit (WO-227); a change to `targetSubject`, `targetGate`
or any recorded base; the publish's lint, already from the described base
(WO-230); the episode form.

**Operator-review assumptions**

1. A review should refuse only commits the order adds; the target's merged
   history is not the reviewer's to repair.
2. The activation base remains the review's recorded base; no record is
   rewritten.
3. The fork takes the fix through a starter update and dispatches its final
   review again; until then WO-013 stays verified and unpublished.
