# WO-186 — Gate time goes where the change is: three slow cases fixed at their cause, a rerun runs only what has no passing result, a fresh worktree reuses main's row, and a role writes its records while the gate runs (v0.66.3)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. The runner's reuse composes results
per task at one code identity, the identity covers untracked code, one
hook refusal is narrowed for an order's own record paths, three test
cases are repaired; no suite is removed and no assertion is dropped.
Assigned at activation under the standing opt-out default.
**Cost:** adds task-level reuse at an unchanged code identity
(`scripts/test-runner.mjs`, `scripts/lib/gate-reuse.mjs`,
`scripts/lib/suite-evidence.mjs`), untracked code in the identity
(`packages/skeleton/src/gate-evidence.mjs`), a read-only lookup of the
main checkout's rows from a worktree, the merge base as the review
selection's base, the narrowed live-gate refusal
(`packages/skeleton/src/harness-host.ts`), per-case durations on the
gate row, five condition rows at planning entry
(`scripts/lib/planning-conditions.mjs`), and repairs in three test
files. Removes, by the record: about 180 s that one harness-fixture case
has gained since 2026-09-08 (2.77 s then), in a suite that holds every
lane; about 150 s that the integration suite gained between 2026-09-29
and 2026-09-30; a lock-matrix case of 170 s that the skeleton suite runs
on every gate; full reruns at an identity that already has passing
results (14 rerun pairs, 8,384 s of wall-clock, of which 9% to 36% of
task time needed running); full first gates in a worktree whose code
equals main's; and the minutes a role cannot write its own report while
its gate runs. What the plain and review gates take afterwards is
measured by criterion 9, not promised here. Re-mints: `gate-evidence.mjs`
and `harness-host.ts` are registered evidence sources in three editions,
re-minted deterministically, and the harness bundle is re-emitted;
neither is judged by the feedback verifier, so no live episode;
`scripts/test-runner.mjs` is a declared machinery source, so
`npm test -- --review` runs before handoff. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 9
(captured in ignored intake; SHA-256 in the ledger section of that
date); the machinery stand-down's own reopening condition (a
once-per-order product gate above six minutes fresh), which the record
shows met since 2026-09-19; register rows FUP-e96221b106cd136a (cold-gate
structural cuts), FUP-a9a0591a63757bf2 (the structural cut re-measured),
FUP-7629e03c6573f5cb and FUP-71602ec08bc81e9d (untracked sources outside
the identity), FUP-986fa3905beb0695 (WO-179 D015), FUP-5cc91ab6105d2eeb
(WO-174 D019), FUP-331423b3559f5cfa (WO-174 D021) and
FUP-b28b870422a74166 (WO-174 D013); the 2026-10-02 planning pass's
measurements over 10,256 gate rows and its replay of an affected
selection over the last 30 orders
([planning document](../planning/standard-pass-2026-10-02.md) §4).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: repository and local gate records only; no stop condition.
**Depends on:** WO-185 merged (it edits the runner first: budgets,
signals and shared lanes); WO-173, WO-174 and WO-179 merged (whole-row
reuse, the read guard and the verifier's use of the executor's row;
closed).
**Recommended placement:** the machinery lane of the second pair,
beside WO-123. This order edits `scripts/test-runner.mjs`,
`scripts/lib/gate-reuse.mjs`, `scripts/lib/suite-evidence.mjs`,
`scripts/lib/planning-conditions.mjs`,
`packages/skeleton/src/gate-evidence.mjs`,
`packages/skeleton/src/harness-host.ts`,
`packages/skeleton/test/resident.test.ts`, `scripts/test-harness.mjs`,
`scripts/test-worktree-integration.mjs` and the runner's fixtures;
WO-123 edits the continuation, the resident state and the source-change
guards. Both release the skeleton; the later integration re-mints once
more, deterministically. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-185",
    "relation": "hard",
    "reason": "the runner's budgets, signal handling and shared lanes, edited first"
  },
  {
    "workOrderId": "WO-173",
    "relation": "satisfied-by-close",
    "reason": "whole-row reuse at a code identity, which this order refines to tasks"
  },
  {
    "workOrderId": "WO-174",
    "relation": "satisfied-by-close",
    "reason": "the product read guard and the excluded-input findings this order closes"
  },
  {
    "workOrderId": "WO-179",
    "relation": "satisfied-by-close",
    "reason": "the verifier consumes the executor's row; its D015 is the selection base this order fixes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/test-runner.mjs` (the suite
table, `changedMachinery`, `executeSuite`, `scheduleSuites`,
`runGateChecks`); `scripts/lib/gate-reuse.mjs` (`coveringGateCheck`);
`scripts/lib/suite-evidence.mjs` (`completeCoverage`);
`packages/skeleton/src/gate-evidence.mjs` (`gateCodeIdentity`,
`gateTreeHash`, the live-gate input test); `harness-host.ts` (the
live-gate refusal); `docs/planning/machinery-stand-down-2026-09-15.md`
§3, §4, §5 rule 10 and §7 (why the earlier reuse layers were removed and
what a later one must prove); `docs/evidence/WO-173/decisions.md` D004
and D018; `docs/evidence/WO-174/decisions.md` D011, D013, D019 and D021;
`docs/evidence/WO-179/decisions.md` D015;
`docs/evidence/WO-173/matrix-durations.json`;
`docs/evidence/WO-039/repair-004-checks-004.txt` (the harness case at
2.77 s); `packages/skeleton/test/resident.test.ts` (the lock matrix);
`scripts/test-harness.mjs` (the reservation cases and `raceHarness`);
`scripts/test-worktree-integration.mjs`; the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§4.

**Objective:** A role waits on a gate for as long as its change needs
and no longer. The slowest cases cost what their assertions need; a
rerun never repeats a task that already passed at the same code; a new
worktree does not repeat main's gate; and the minutes a gate does take
are minutes the role spends writing its record. Final review still runs
everything. Judge elapsed work under the operator's normal parallel
work-order workflow, retaining contention as part of the observed cost.

**Observed gap (dated 2026-10-02, `main` at `08845c71`; gate figures are
medians of passing four-lane rows in the main checkout's gate index,
10,256 rows from 2026-09-09):**

- A plain `npm test` took 252 s on 2026-09-15, 327 s since 2026-09-26
  and 492 s in October (three runs); `npm test -- --review` with the two
  exclusive suites took 639 s and 838 s. An order pays three fresh
  product gates (1,660 s) and seven document gates (201 s) at the
  median, 22.5% of all recorded phase time.
- Four suites carry the time: `skeleton` 341.5 s (about 140 s on
  2026-09-15), `harness-fixtures` 306.5 s, `worktree-integration` 287.2 s
  (135 s on 2026-09-29, 279 s the next day; cause unrecorded) and the
  45 release cases, 236.5 s across lanes. With the two exclusive suites
  selected, one task runs alone for 57% to 61% of the gate.
- Inside them, three cases: the lock matrix in `resident.test.ts`
  (170.5 s alone on 2026-09-28; eight cells, each with its own
  deadline); the harness case "an operator release judges, retires and
  journals one observed reservation" (2.77 s on 2026-09-08; a gap of
  158 s to 193 s before its result in three review logs of 2026-10-01;
  cause unknown); and the integration suite's two real-generator cases
  (about 11 s each on 2026-09-27; current per-case times unknown
  because the suite reports nothing until it ends).
- Plain `npm test` runs every product suite whatever changed, and the
  only reuse is of a whole passing row at the same code identity. A
  rerun after one failed task, or after the selection grew from plain to
  review, runs everything again: 14 such pairs since 2026-09-27 took
  8,384 s, where the tasks with no passing result were 9% to 36% of the
  task time.
- The identity hashes tracked paths only, so an edited untracked source
  can reuse a green row (WO-173 D018), and staging new files at final
  review changes the identity and forces a fresh run. Seven product
  script suites read tracked documents the identity excludes (WO-174
  D013), so a reused row can be false for them.
- A worktree's gate index is its own; rows reach main only at close. A
  new worktree whose code equals main's runs a full gate: the five
  orders of the last thirty that changed only corpus or documents paid
  fifteen fresh gates, 10,129 s.
- The review selection diffs against the moving tip of `origin/main`,
  so a sibling's merge widens it at an unchanged identity (WO-179 D015).
- While a gate is live, the hook refuses a write to any tracked or
  untracked file in the worktree, the order's own report and decisions
  included; the product gate's identity excludes those paths.
- An affected selection keyed on each task's inputs would not help
  today. Replayed over the last thirty orders with the repository's own
  import scanner, 99% of product task-seconds stay affected for the
  median order and the wall-clock floor stays at the skeleton suite in
  23 to 25 of 30, because the shell suites copy all of `scripts/`, the
  skeleton suite is one task, and the integration suite clones the whole
  repository.

**Design (scope discipline):**

- **The three slow cases are repaired at their cause, with their
  assertions intact.** For each, the executor measures where the time
  goes before changing anything, records the cause, and shows after the
  change that every assertion still runs and that a planted defect each
  guards is still caught. The lock matrix's eight cells either run
  concurrently, each on its own temporary root, or move to a task of
  their own that the plain gate runs beside the rest of the skeleton
  suite; real deadlines are kept unless the measurement shows a wait
  that asserts nothing.
- **Reuse is per task at one code identity.** `npm test` runs the
  selected tasks that have no passing result at the current identity and
  composes a complete row from fresh and reused results, each reused
  result naming the row it came from; a row is complete only when every
  selected task has a passing result at that identity. `--again` runs
  everything. The final reviewer's `npm test -- --review` always runs
  everything, by rule. A failed, stopped, timed-out or partial result is
  never reused. This adds no key beyond the one WO-173 already trusts.
- **The identity covers the code that runs.** Untracked, non-ignored
  code files enter the identity by path and bytes whatever their index
  status, so staging changes nothing and an untracked edit changes the
  identity. The documents WO-174 D013 found product suites reading enter
  the identity too, or their cases move to the document gate; the
  executor records which for each.
- **A worktree reads main's rows.** With no row of its own at the
  current identity, the lookup also reads the main checkout's index
  through the Git common directory, read-only.
- **The review selection's base is the merge base.**
- **A role writes its records while its product gate runs.** The
  live-gate refusal admits writes under the active order's own evidence,
  verification and final-review directories during a product gate. Every
  other path stays refused, and the document gate's refusal is
  unchanged. A check fails if a product task ever reads those paths.
- **Growth is visible.** The gate row keeps each task's five slowest
  cases; the heartbeat names the running case; planning entry lists the
  five longest tasks against their thirty-day medians and the plain
  gate against six minutes.
- **Declined alternatives, recorded:** a memo keyed on each task's
  declared or observed inputs (the replay: a mean of 26% of task-seconds
  skipped and almost none for the median order, for the four keys the
  stand-down removed; reopen when a re-run of the replay shows the
  median order's affected share at or under 60%); an external build
  graph or cache tool (the tasks' inputs are cross-cutting and partly
  spawned at run time, which a package graph would misstate; no new
  dependency); normalizing version literals out of the identity (one
  product case asserts a package version; the win is unmeasured);
  narrowing what the shell suites copy (34% of task-seconds depend on it
  and no observer sees a shell suite's reads; recorded as a candidate);
  dropping or sampling tests (coverage is not for sale); shared
  scheduling of the two exclusive suites (measured slower in WO-128).

**Deliverables:** the three repaired cases with their cause records;
task-level reuse and its composed rows; the identity change; the main
lookup; the merge-base selection; the narrowed refusal with its check
and role sentence; the per-case durations and condition rows; the
before-and-after measurements; the replay script kept as evidence; the
write-backs below.

**Acceptance criteria (all required)**

1. For each of the three cases the decisions record the measured cause,
   the change, and the median of five runs during ordinary use of this
   host before and after. Parallel work orders remain allowed; record
   observed contention and leave unobserved activity unknown. Do not
   discard or repeat a passing run merely because other work overlaps.
   The harness case's median is at most 10 s, the integration
   suite's at most 150 s and the skeleton suite's at most 200 s; where a
   figure is not met, a profile of the remaining time shows which
   assertion needs it and any observed contention, and the criterion is
   met by that record. Each
   case's assertions are listed before and after, and a planted defect
   for each is still caught.
2. A gate row records each task's five slowest cases with their
   durations, and the integration suite reports each case as it ends.
3. At an identity where an earlier row passed all but one task, `npm
   test` runs that task alone, records a complete row whose other
   results name their source row, and a completion's claim check accepts
   it; `--again` and the reviewer's gate run every task. A second
   process in another shell and session, started after the first row,
   reuses it. A failed, stopped or partial result is never reused, shown
   by a fixture for each.
4. Editing an untracked code file after a green row changes the identity
   and nothing is reused; staging that file changes nothing. Editing
   `docs/LEGAL.md` either changes the identity or fails the document
   gate, and the decisions list, for each of the seven suites WO-174
   D013 names, which route its document input took.
5. In a second worktree whose code identity equals a passing row of the
   main checkout, `npm test` starts no suite and names main's row; with
   one changed code file it runs.
6. With a covering row at a worktree's identity, advancing `origin/main`
   with another order's machinery source leaves the review selection and
   the claim check unchanged; the worktree's own machinery change still
   widens the selection.
7. During a live product gate a write to the active order's
   `docs/evidence`, `docs/verifications` or `docs/final-reviews`
   directory is admitted, and a write to a code file, to another
   order's directory or to the control log is refused; during a live
   document gate all are refused as today. A fixture product task that
   reads the active order's evidence directory fails the check that
   guards the admission. The generated role roots say that the order's
   own records may be written while its product gate runs.
8. `npm run plan -- conditions` lists the five longest gate tasks with
   their thirty-day medians, holding when one exceeds its median by half,
   and the plain gate's median against 360 s.
9. The decisions record the medians of five plain and five review gates
   during ordinary host use before and after this order, including
   parallel work orders, and reconcile them with the Cost line's
   removals item by item. Retain observed contention and unknowns with
   the comparison; do not require a quiet host or discard a passing
   observation solely for overlap. Unequal workloads limit causal
   attribution and must be stated. The replay script and its
   output for the last thirty orders are kept under this order's
   evidence.
10. Write-backs land, each in place with no dated paragraph: product 07
    §Discipline (task-level reuse; what the identity covers; the
    narrowed refusal) and the five-refusals sentence wherever it is
    generated; the README's test paragraph only if a front-page order
    has not already moved it; the decisions file; the register rows the
    provenance names retargeted at close; the publication locks
    refreshed.
11. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Evidence gate:** the cause records and timings of criterion 1; the
second-process rows of criteria 3 and 5; the fixtures of criteria 4, 6
and 7; the measurements of criterion 9; `npm test -- --review` before
`implementation-ready`, because `scripts/test-runner.mjs`,
`gate-evidence.mjs` and `harness-host.ts` are declared machinery
sources, and again at final review. No live row.

**Write-back duty:** as listed in criterion 10.

**Known issues and carry-ins:**

- The stand-down's rule holds: a reuse claim is established only by a
  gate run from a different shell and session (criteria 3 and 5).
- Reused invocations leave no row today, so how often reuse happens is
  unknown; the composed row records it from now on, and a forced fresh
  run records why (WO-174 D019).
- The document gate is untouched: keyed by the whole tree, never
  reused, 38 s in October. Register row FUP-fb8cbeabbddef397 stays open
  with that figure.
- The five-refusals paragraph is generated into `CLAUDE.md` and every
  role root; narrowing the second refusal changes those bytes and the
  cold-start figures, which the executor records.
- A reviewer's gate that stages new files no longer changes the
  identity, but it still runs everything.
- Receipt 038: the identity covers code and the documents suites read,
  not the environment a row was produced in (runtime and tool versions,
  environment variables, host state). A row reused from another shell,
  session or worktree could report a pass that would not reproduce; the
  reviewer's full run is the backstop. Reopen if a reviewer's full gate
  fails a task that a reused row at the same identity reported passing,
  or a verification passes on a reused row that a rerun fails.

**Non-goals:** a per-task input memo; removing, sampling or weakening
any test; the document gate's cost; the exclusive scheduling of the two
hook-heavy suites; what the shell suites copy; memory budgets and
shared lanes (WO-185); what verification examines (WO-187).

**Operator-review assumptions**

1. The figures in criterion 1 are the cases' own earlier recorded
   durations (2.77 s; 135 s; about 140 s for the skeleton suite), with
   room; a case that cannot return to its figure without dropping an
   assertion keeps the assertion and records why.
2. Final review always runs every selected task fresh; every other gate
   may compose.
3. A role may write the active order's own records during its product
   gate; nothing else in the worktree.
4. An affected selection on task inputs is not built now. The replay is
   the evidence, and the same script is the reopening test.
