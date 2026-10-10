# WO-198 — A worktree's gate judges only what its branch can see, records the shared refs it saw, and names the ones that moved when a task fails (v0.73.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. Gate rows gain a shared-ref snapshot,
a failure gains one line, and a fixture reproduces a sibling merge during
a worktree's gates; a read of shared state the fixture shows flipping a
task is repaired at its cause. Assigned at activation under the standing
opt-out default.
**Cost:** adds a `sharedRefs` record on every gate row
(`scripts/test-runner.mjs`, the row built around line 2360;
`packages/skeleton/src/gate-evidence.mjs` `beginGateRun`, line 405), one
delta line on a failed row, one `runner-fixtures` case that advances
`main` and adds a tag while a linked worktree runs its document and plain
gates (`scripts/test-runner.test.mjs`), and one sentence in product 07
§Independent workflows and integration. Removes: the hour an operator
spends finding out that a passing suite failed because a sibling merged
(the operator reported it on 2026-10-07 as happening more than once; the
record holds one documented instance, WO-179 D012, 2026-10-01, a review
selection taken against the moving `origin/main` tip, which WO-186
answered with the merge base). Re-mints: `gate-evidence.mjs` is a
registered evidence source in three editions
(`scripts/lib/evidence-sources.mjs`), re-minted deterministically; no
feedback-judged file changes, so no live episode; `scripts/test-runner.mjs`
is a declared machinery source, so `npm test -- --review` runs before
handoff. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's messages of 2026-10-07 (captured
verbatim in ignored intake; SHA-256 in the ledger section of that date):
merging into main immediately breaks a suite that passed in a parallel
worktree; WO-179 D012 and its VER-002 follow-up (reopen when a planning
pass counts a review rerun caused by main movement). Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: repository records
only; no stop condition. The
[planning document](../planning/machinery-reset-2026-10-07.md) §4.1.
**Depends on:** WO-196 merged (it edits the runner first; the preflight
and composition this order's fixture exercises).
**Recommended placement:** the machinery lane of the second pair after
WO-196, beside WO-075. WO-075 edits `scripts/launchpad.mjs`, product 03
and `docs/LEGAL.md`; this order edits the runner, its fixture file and
`gate-evidence.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-196",
    "relation": "hard",
    "reason": "the runner's preflight and review composition this order's fixture runs under; both orders edit scripts/test-runner.mjs"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Independent
workflows and integration; `docs/evidence/WO-179/decisions.md` D012 and
the VER-002 follow-up that names `changedMachinery`;
`docs/evidence/WO-186/decisions.md` D006; `scripts/lib/gate-reuse.mjs`
(`consultableMain`, line 112: a worktree reads main's gate index for
reuse); `scripts/work-orders.mjs` (`localReleaseTags`; the `--check`
branch at line 681 reports newer tags without refusing);
`scripts/lib/release-history.mjs` (the same rule for product 06);
`scripts/release.mjs` `check-surfaces --local` (line 2889: local
ancestors of HEAD only); `scripts/lib/contributions.mjs`
(`origin/main..HEAD`); `scripts/lib/planning-followups.mjs` lines 647 to
658 (the merge base); `scripts/test-worktree-integration.mjs` (a
launchpad with a linked worktree, lines 209 and 298, the pattern the
fixture copies).

**Objective:** A gate in a linked worktree gives the same result before
and after a sibling merges into `main` and tags a release, every row says
which shared refs it saw, and a failed row says which of them moved since
the last row of that gate, so the next such failure is attributed in one
line instead of an hour.

**Observed gap (dated 2026-10-07, `main` at `bd437eb2`):**

- Git worktrees share tags, branches and `refs/dotln/`. Six readers of
  shared state were found at HEAD (Cites); each is bounded to HEAD's
  ancestors, the merge base or a report-only notice, and no non-test
  script diffs against the `origin/main` tip. One documented flip
  remains in the record: WO-179 D012, the review selection, fixed by
  WO-186. The operator reports later flips; worktree gate rows leave with
  the worktree at release close, so main's index (902 rows since
  2026-09-28) cannot show them, and nothing on a row says what the shared
  refs were when it ran.
- `scripts/test-runner.test.mjs` has no case that runs a gate in a linked
  worktree while `main` moves.

**Design (scope discipline):**

- The snapshot is small and read once at gate start and once at the end:
  `origin/main` and `main` commit ids (or `absent`), the count and newest
  name of local annotated `v*` tags, and the count of `refs/dotln/` refs.
  It is recorded as `sharedRefs: { start, end }` on the row.
- The delta line prints only when the row fails and at least one field
  differs from the previous row of the same check in this checkout, or
  between `start` and `end`: `shared refs moved: origin/main
  <old>..<new>; tags +<name>`. A passing row prints nothing.
- The fixture is the reproduction, not a theory: whatever task it shows
  flipping is repaired at its cause in this order, under Adjacent Repair,
  with the repair's own regression. If nothing flips, the fixture stays
  as the guard.
- **Declined alternatives, recorded:** copying tags out of worktrees'
  reach (Git has no per-worktree tag namespace); forbidding merges while
  a gate runs (the operator's parallel workflow, WO-186 D020).

**Execution plan (the executor follows these steps in order):**

1. `packages/skeleton/src/gate-evidence.mjs`: export
   `readSharedRefs(root)` returning `{ originMain, main, tags: { count,
   newest }, dotlnRefs }` from `git rev-parse --verify
   refs/remotes/origin/main^{commit}` (and `refs/heads/main`), `git
   for-each-ref --format=%(refname:short) refs/tags/v*` and `git
   for-each-ref refs/dotln/`; a missing ref reads `absent`. Check:
   `node --test packages/skeleton/dist/test/gate-evidence.test.js` after
   `npm run build` if that file exists (`ls packages/skeleton/test/` at
   the base; otherwise the `runner-fixtures` case in step 4 covers it).
2. `scripts/test-runner.mjs`, `runGateChecks`: call `readSharedRefs`
   before the preflight stage and after the last task; put `sharedRefs:
   { start, end }` on the row object built with `checkId`, `treeHash`
   and `codeIdentity` (around line 2360). Check: `npm test -- --only
   format` then `node -e` over `readGateChecks` prints the field on the
   newest row.
3. Same file, the failure summary: when `exitCode !== 0`, read the
   previous row of the same `checkId` in this checkout
   (`readGateChecks(repo)` filtered by `checkId`, the latest before this
   run) and print the delta line when any field differs between that
   row's `end` and this row's `start`, or between this row's `start` and
   `end`. Check: the step 4 case.
4. `scripts/test-runner.test.mjs`: add
   `test("WO-198 a sibling merge and tag during a worktree's gates change no result and are named on the row")`:
   build a launchpad repository with one commit on `main` and a bare
   `origin` (copy the pattern of `scripts/test-worktree-integration.mjs`
   lines 200 to 300), add a linked worktree on branch `wo-900`, run the
   document and plain gates in the worktree with the reduced `table`
   option the fixtures already use (search `table:` in the file), record
   both rows; then in the main checkout commit a change to a file the
   reduced table's tasks read, create an annotated tag `v9000.0.1`, push
   `main` and the tag to `origin`; rerun both gates in the worktree and
   assert: every task that passed still passes, each row carries
   `sharedRefs.start` and `.end`, the second rows' `start.tags.count` is
   one higher, and no delta line was printed (exit 0). Add a second
   case that forces one task to fail in the second run (write a
   failing fixture file) and asserts the delta line names
   `origin/main` and `+v9000.0.1`. Check: `npm test -- --only
   runner-fixtures`.
5. If step 4's first case shows a task flipping, read that task's reads
   of shared state (start from the six readers in Cites), repair it to
   HEAD's ancestors, the merge base or the recorded snapshot, add the
   task's own regression, and record the cause in the decisions. If
   nothing flips, record that in the decisions with the fixture's output.
6. Write-backs: product 07 §"## Independent workflows and integration":
   one sentence, in place, that a worktree's gate judges only what its
   branch can see, records the shared refs it saw and names those that
   moved when a task fails; `docs/evidence/WO-198/decisions.md`;
   publication locks refreshed with `npm run publication:check`.
7. Re-mint the editions `scripts/lib/evidence-sources.mjs` lists for
   `gate-evidence.mjs` (`node scripts/authority-evidence.mjs --write`,
   `node scripts/artifact-identity-evidence.mjs --write`,
   `node scripts/verification-evidence.mjs --write`, each after
   `npm run build`), then check each with `--check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-198/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the snapshot and delta line with their cases, the
sibling-merge fixture, any repair the fixture drives with its regression,
the re-mints, the write-backs.

**Acceptance criteria (all required)**

1. Every gate row recorded at this order's identity carries
   `sharedRefs.start` and `sharedRefs.end` with the four fields; a
   missing ref reads `absent` and never throws.
2. A failed row whose shared refs differ from the previous row of the
   same check, or between its own start and end, prints exactly one
   `shared refs moved:` line naming each changed field; a passing row
   prints none.
3. The `runner-fixtures` case passes: a commit and an annotated tag
   landed on `main` and pushed to `origin` between two runs of the
   worktree's document and plain gates change no task's result, and the
   second rows carry the new snapshot; the forced-failure case prints the
   delta line.
4. A task the fixture showed flipping is repaired at its cause with its
   own regression and the cause recorded; otherwise the decisions record
   that no task flipped, with the fixture output.
5. The write-backs land in place; the re-mints are recorded;
   `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the row readback;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
and again at final review. No live row.

**Write-back duty:** as listed in step 6.

**Known issues and carry-ins:**

- WO-179 VER-002's follow-up (reopen when a planning pass counts a
  review rerun caused by main movement) is allocated here as the fixture.
- Receipt known issue (2026-10-07 pass): the fixture's reduced table may
  not include the task the operator saw flip; the delta line is what
  makes the next live flip attributable. Reopen when a live flip after
  this order prints no delta line.

**Non-goals:** the review selection (WO-186 did it); the runner's
preflight and composition (WO-196); a per-worktree tag namespace; any
change to release close.

**Operator-review assumptions**

1. The operator names the suite and the three failing cases the next time
   a passing suite fails after a merge; with that, the executor extends
   the fixture's table to include that task before step 5.
