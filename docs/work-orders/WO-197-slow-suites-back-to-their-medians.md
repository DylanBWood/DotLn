# WO-197 — Three gate tasks that grew past their thirty-day medians are brought back at their cause, and the vertical suite's slowest cases are named (v0.69.1)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. Test cases are repaired at their cause;
no runtime behavior changes unless a case shows a defect, which is then a
bounded Adjacent Repair recorded in the decisions. Assigned at activation
under the standing opt-out default.
**Cost:** adds the per-case timing readback for the three tasks, the
repairs in `scripts/test-target-publish.mjs`,
`scripts/test-worktree-integration.mjs` and `scripts/test-harness.mjs`
(and the library files a case's cause lies in), one bound assertion per
repaired case, and a timing record for `scripts/test-vertical.mjs` and
`scripts/test-vertical-judgment.mjs`. Removes, by the record of
`npm run plan -- conditions` on 2026-10-07: `target-publish` at 356.405 s
against a median of 17.803 s over 354 samples; `worktree-integration` at
288.470 s against 125.581 s over 411 samples; `harness-fixtures` at
399.784 s against 261.423 s over 223 samples. Together about 680 s of
every fresh review gate (1,841 to 1,863 s in WO-112). Re-mints: none
expected; the three test files are not registered evidence sources
(checked 2026-10-07 in `scripts/lib/evidence-sources.mjs`); if a cause
lies in a registered source, each edition it stales is re-minted
deterministically and the executor records which. The three test files
are declared machinery sources of their suites, so `npm test -- --review`
runs before handoff. Wall-clock, tokens and context bytes are unknown
until run.
**Nomination provenance:** the three gate-task reopening conditions of
register row FUP-e96221b106cd136a that hold on 2026-10-07 (`npm run plan
-- conditions`: `gate-task:target-publish`, `gate-task:worktree-integration`
and `gate-task:harness-fixtures` each above 1.5 times their earlier
median); the operator's dispatch of 2026-10-07 (orders take more than a
day). Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: local gate records only; no stop condition. The
[planning document](../planning/machinery-reset-2026-10-07.md) §4.
**Depends on:** WO-196 merged (the gate preflight and the review
composition, so this order's own gates are paid once); WO-186 merged
(per-case durations on the gate row; closed, v0.66.3).
**Recommended placement:** the machinery lane of the first pair after
WO-196, beside WO-074. WO-074 adds `scripts/launchpad.mjs`, one suite
row in `scripts/test-runner.mjs` and product 03; this order edits three
test files and the library files their causes name, and never
`scripts/test-runner.mjs`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-196",
    "relation": "hard",
    "reason": "the gate preflight and the review composition this order's own gates rely on"
  },
  {
    "workOrderId": "WO-186",
    "relation": "hard",
    "reason": "per-case durations on the gate row, which step 1 reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (host
resources; the bounded wrapper); `docs/evidence/WO-186/decisions.md` D009
(case and growth evidence on the row) and D036 (the lane-peer growth);
`docs/planning/standard-pass-2026-10-02.md` §4 (the gate measurements);
`scripts/lib/gate-evidence.mjs` and `packages/skeleton/src/gate-evidence.mjs`
(`readGateChecks`, line 827, the row reader); `scripts/measure-gates.mjs`
(the timeline summary); the [planning document](../planning/machinery-reset-2026-10-07.md)
§4.

**Objective:** Each of the three tasks runs fresh, at this order's code
identity, at or below its thirty-day median before the growth plus one
quarter, because the case that grew is repaired at its cause, and the
vertical suite's three slowest cases are recorded with what each waits
on.

**Observed gap (dated 2026-10-07, `main` at `bd437eb2`):**

- `npm run plan -- conditions` at 05:46Z: `target-publish` latest fresh
  task 356.405 s, median 17.803 s (354 samples), threshold 26.705 s,
  holds; `worktree-integration` 288.470 s, median 125.581 s (411
  samples), threshold 188.372 s, holds; `harness-fixtures` 399.784 s,
  median 261.423 s (223 samples), threshold 392.135 s, holds;
  `vertical` 849.925 s, median 722.186 s (25 samples), threshold
  1,083.279 s, does not hold but is the largest single task of the review
  gate (840 to 843 s in each of WO-112's three final gates).
- The cause of each growth is unknown. The rows since WO-186 carry
  per-case durations (WO-186 criterion 9), so the case and the first row
  that shows it are readable without a rerun.
- `target-publish` is `scripts/test-target-publish.mjs` (suite row at
  `scripts/test-runner.mjs` line 616); `worktree-integration` is
  `scripts/test-worktree-integration.mjs` (line 644); `harness-fixtures`
  is `scripts/test-harness.mjs` (line 786, group `hook-heavy`,
  exclusive); `vertical` is `scripts/test-vertical.mjs` with
  `scripts/test-vertical-judgment.mjs` (line 622, `fileConcurrency` 2,
  `loadSlots` 2, outside confinement).

**Design (scope discipline):**

- Find the case before touching code: the gate rows name it. A repair
  changes the case's own waiting (a timer, a retry, a real network or
  filesystem wait, a copied repository, a serial loop) and never weakens
  what the case asserts. If a case waits on a product defect (a retry
  that always fails, a watcher that never fires), the defect is an
  Adjacent Repair in the declared surfaces, recorded in the decisions.
- Each repaired case gets a bound assertion on its own duration under
  the bounded wrapper, set at twice its measured repaired duration, so
  the next growth is seen at the case.
- The vertical suite is measured and recorded, not repaired, unless one
  of its three slowest cases waits on a timer rather than on work; that
  repair is in scope and bounded to the case.
- **Declined alternatives, recorded:** lane packing and the shell suites'
  copying of `scripts/` (declined with reopening tests by the 2026-10-02
  pass §15); a global deadline cut (the deadlines are WO-185's and do not
  change the work); raising the thresholds (the growth is real).

**Execution plan (the executor follows these steps in order):**

1. Read the rows. `node -e` over `readGateChecks` from
   `packages/skeleton/src/gate-evidence.mjs` (line 827): for each of the
   three task names, print `recordedAt`, `codeIdentity`, the task's
   `durationMs` and its per-case durations for every row since
   2026-09-07, sorted by time. Save the listing to
   `docs/evidence/WO-197/task-durations.json`. Check: the listing names
   the first row at which each task's duration exceeded its threshold.
2. For each of the three tasks, name the case or cases that account for
   the growth (the per-case durations of the first slow row against the
   last fast row). Record the case names and the commit range between
   the two rows (`git log --oneline <fast-row-identity-commit>..<slow-row-identity-commit>`
   is not available from an identity; instead use the rows' `recordedAt`
   with `git log --since --until --format='%h %s'` on `main`) in
   `docs/evidence/WO-197/decisions.md` D001.
3. Run each suspect case alone under the wrapper:
   `node scripts/harness.mjs bounded -- node --test --test-name-pattern='<case>' scripts/test-target-publish.mjs`
   (and the other two files), three times, and record the durations.
   Check: the recorded durations reproduce the growth outside the gate,
   or the decisions say the growth appears only under gate load (then
   step 4 reads the row's `concurrentAtStart` and lane fields, WO-186
   D036).
4. Repair each case at its cause in its own file or the library file the
   case exercises (read it before changing it; for `target-publish`
   start with `scripts/lib/target-publish.mjs` and
   `scripts/lib/pull-request-observer.mjs`, which WO-112 changed for the
   bounded review-check wait; for `worktree-integration` with
   `scripts/lib/worktree-integration.mjs`; for `harness-fixtures` with
   the fixtures `scripts/test-harness.mjs` builds). Add the bound
   assertion to the case. Check: the case passes three times alone at
   or below the bound.
5. Run the three suites whole, alone, under the wrapper, and record
   their durations beside the thirty-day medians in the decisions.
6. Vertical: run `node scripts/harness.mjs bounded -- node --test scripts/test-vertical.mjs scripts/test-vertical-judgment.mjs`
   once with `--test-reporter=spec` and record the three slowest cases
   and what each waits on (read the case) in
   `docs/evidence/WO-197/vertical-timing.md`. Repair only a case that
   waits on a timer (Design).
7. Write-backs: `docs/evidence/WO-197/decisions.md` (the causes, the
   repairs, the before and after durations, any Adjacent Repair);
   register row FUP-e96221b106cd136a's three task conditions disposed at
   close by the final review; publication locks refreshed if a product
   document changed (none is expected).
8. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-197/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the task-duration listing, the repaired cases with
their bound assertions, the vertical timing record, the decisions file.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-197/task-durations.json` lists, for each of the
   three tasks, every row since 2026-09-07 with per-case durations, and
   D001 names the case and the commit range of each growth.
2. At this order's code identity, a fresh `target-publish` task runs at
   or below 22.254 s (17.803 s plus one quarter); `worktree-integration`
   at or below 156.976 s; `harness-fixtures` at or below 326.779 s. Each
   figure is read from the order's own gate row and from one run alone
   under the bounded wrapper, both recorded.
3. Each repaired case carries a bound assertion at twice its repaired
   duration, and no case's assertions were weakened (the verifier diffs
   the assertions).
4. `docs/evidence/WO-197/vertical-timing.md` names the vertical suite's
   three slowest cases, their durations and what each waits on; a case
   repaired under the Design is named with its before and after.
5. Any product change is an Adjacent Repair recorded in the decisions
   with the case that showed it; otherwise the decisions say no runtime
   file changed.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the duration listing, the alone-runs, the gate row;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
and again at final review. No live row.

**Write-back duty:** as listed in step 7.

**Known issues and carry-ins:**

- FUP-e96221b106cd136a's three `gate-task` conditions are allocated here;
  its `plain-gate` median condition stays with planning.
- FUP-331423b3559f5cfa (WO-174 D021: the 120 s harness saving is
  crossed, `harness-fixtures` at 333.977 s in WO-174's FINAL-001) is
  allocated here with the `harness-fixtures` case.
- Receipt known issue (2026-10-07 pass): the thresholds are one quarter
  above medians measured under the operator's normal parallel workflow
  (WO-186 D020); a run under a heavier host load may miss them for that
  reason alone. The executor records the host load averages beside each
  measurement, as `plan conditions` prints them, and the verifier reads
  them before failing criterion 2.

**Non-goals:** `scripts/test-runner.mjs` (WO-196); lane packing; the
shell suites' copying; the vertical suite's design; deadlines
(WO-185); the document gate.

**Operator-review assumptions**

1. A case that grew because a product change made the work larger (not
   a wait) is recorded with that cause and left, and criterion 2 is
   then recorded unmet with the figure for the operator's waiver or a
   planning re-measure.
2. The medians of 2026-10-07 are the baseline; a later pass re-measures
   them from `plan conditions`.
