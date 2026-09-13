# WO-128 — Fresh gates pass first time: every wall-clock deadline a gate child can hit survives the full gate's load, and the exclusive-suite workaround is re-measured (v0.17.3)

**Model:** any capable model for the runner, the collector budget and the
fixtures; the measurement series runs on the operator's machine. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure and one console
collector bound; no exported runtime capability or contract changes; the gate
row gains additive fields. Assigned at activation under the standing opt-out
default.
**Cost:** adds one operator-run measurement series inside the order (five
fresh full gates at the 2026-09-12 durations of 476–839 s, once, or twice
if the shared-cap series fails and the retained configuration is measured
again) and one
diagnostic record per deadline hit (bytes on disk, no context read); adds no
step to any phase. Removes the failed fresh full gate and its rerun: on
2026-09-11/12 twelve fresh full gates across WO-043, WO-125 and WO-127 failed
on a load-sensitive deadline or on a tree changed during the run, 8,387 s in
total, and each was followed by a passing rerun of 41–419 s. If the
exclusivity re-measurement passes, it also removes up to 206 s of
concurrency-one time per fresh gate, the `harness-fixtures` and
`process-debt` spans measured at 2026-09-12T16:08Z. Context bytes, commands
and tokens per gate are unchanged; gate runs per phase drop from two to one.
**Nomination provenance:** the operator's 2026-09-12 planning dispatch
relaying a second model's plan for proof-carrying gates; the pass measured the
retained gate rows on the operator's host and found the failed fresh gates
the largest waste, which the relayed plan did not name; WO-125's VER-001 O6,
VER-003 O3, VER-004 AC5 and FINAL-001 item 3, which nominated the console
collector timeout for a separate order and named the next planning pass its
owner; the map's console host-collection candidate (FUP-0054, named by
WO-039's fifth repair receipt). Planner-synthesized draft; the dispatch is
preserved verbatim in the pass's ignored capture. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-126 merged (the runner, the exclusive scheduling of
WO-126-D012 and the suite reuse of WO-126-D009; closed at `v0.17.0`); WO-125
merged (gate-input protection during live runs and the console diagnosis in
its reports; closed at `v0.17.2`).
**Recommended placement:** first of the three gate orders, alone in its lane,
before WO-129. It edits `scripts/test-runner.mjs`, the gate-row fields in
`scripts/lib/suite-evidence.mjs`, `packages/console/src/collect.ts`,
`scripts/test-harness.mjs`, `scripts/test-plan-refutation.mjs`,
`scripts/test-runner.test.mjs` and their fixtures. Orders that do not touch
the runner may run beside it. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the runner, its exclusive scheduling (D012) and its suite reuse (D009)"
  },
  {
    "workOrderId": "WO-125",
    "relation": "satisfied-by-close",
    "reason": "gate-input protection during live runs and the console diagnosis in its reports"
  },
  {
    "workOrderId": "WO-039",
    "relation": "reference-only",
    "reason": "the fifth repair receipt ordered the console suite after the package suites and left the collector budget unchanged"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (process
budget; write once, run once; gate execution and reuse); §Goal-aligned
decisions; `scripts/test-runner.mjs` (`suites`, `scheduleSuites`,
`expandSuiteTasks`, `runGateChecks`); `scripts/lib/suite-evidence.mjs`
(`suiteEnvironment`, `reusableResult`); `scripts/lib/gate-evidence.mjs`
(`recordGateChecks`); `packages/console/src/collect.ts` (the 60 s command
budget); `scripts/test-harness.mjs` (the 20 s process deadlines and fixture
barriers); `scripts/test-runner.test.mjs` (the timeout case);
`docs/verifications/WO-125/VER-001.md` (O6), `VER-003.md` (O3), `VER-004.md`
(AC5); `docs/final-reviews/WO-125/FINAL-001.md` (item 3);
`docs/evidence/WO-126/decisions.md` (D009, D012, D026);
`docs/evidence/WO-127/decisions.md` (D004, D005, D007);
`docs/planning/work-order-map.md` §Preserved unallocated candidates (the
console host-collection candidate).

**Objective:** A fresh full gate on the operator's host fails only for a real
defect or for a host load outside the declared load class, and its diagnostic
says which. Every wall-clock deadline a gate child can reach is either derived from
that suite's own measured baseline through a load factor the scheduler
declares, or protected by a scheduler load class that bounds its concurrent
peers; a deadline hit names the deadline, the measured duration and the tasks
running beside it. The gate row records each task's start, end and concurrent
peers, so the cold gate's critical path can be computed from the row. The
exclusive scheduling of `harness-fixtures` and `process-debt` is re-measured
with that repair in place and dropped or retained on evidence.

**Observed gap (dated 2026-09-12, `main` at `baa7a9e`):** from the host's
retained gate rows (`docs/control/local/harness/checks.json` and
`check-history/`) and the WO-125 reports.

- Twelve fresh full gates failed on 2026-09-11/12 and every one was followed
  by a passing rerun: `console` in six (WO-043 at 06:08Z; WO-125 at 12:48Z,
  13:29Z, 14:10Z, 14:51Z and 15:39Z, 794–839 s each), `plan-refutation:current`
  in two (WO-043 at 06:08Z with `console`; WO-125 at 02:25Z, 704 s, the task at
  100–104 s), `harness-fixtures` in two (WO-127 at 03:56Z, 62 s; WO-125 at
  03:29Z, 142 s), `runner-fixtures` in one (WO-127 at 03:20Z, 58 s), and a
  tree changed during the run in two (WO-043 at 17:19Z; WO-125 at 22:52Z,
  before WO-125's gate-input protection landed). The failed gates total
  8,387 s. At an identical tree the rerun re-executed the failed suite with the
  nine non-reusable tasks and passed in 41–47 s; the `console` retry alone took
  30–36 s.
- The `console` signature is test 18, "host collection reads current
  sources…": `release:list` returns `unavailable` after 87–92 s under gate
  load, consistent with the collector's 60 s per-command budget at
  `packages/console/src/collect.ts:78`; alone the command took 17 s and the
  test 23–26 s (VER-001 O6, VER-003 O3, VER-004 AC5). FINAL-001 item 3 names
  the next planning pass as the owner of the nomination.
- `scripts/test-harness.mjs` holds 20 s process deadlines and fixture barriers
  (lines 228, 1941, 2339 and 2423 at this revision); WO-127-D004 to D006
  traced one stall to a synchronous stdin read and repaired it, and rejected
  raising timeouts as a repair. The `plan-refutation:current` and
  `runner-fixtures` deadline sites are not established: the closeout disposed
  of their logs, so the order's diagnosis names them or records them unknown.
- Durations inflate under load. The 2026-09-12T16:08Z fresh gate (475 s wall,
  1,229 s of task time) ran `harness-fixtures` 134 s, `process-debt` 63 s,
  `worktree` 137 s, `skeleton` 89 s and `plan-refutation:fixtures` 188 s; the
  02:43Z fresh gate inside a role session (733 s wall, 2,044 s of task time)
  ran the same tasks at 160, 93, 237, 162 and 355 s. This pass did not isolate
  the cause (sandbox, concurrent sessions or suite growth since WO-126's
  279 s cold measurement); the order's diagnosis records what it can.
- The exclusive workaround costs the gate its parallelism: at 16:08Z the two
  exclusive suites held the gate at concurrency one for 206 of 475 s, then
  240 s ran at the cap of four; perfect packing of the same task time over
  four slots is 307 s.

**Design (scope discipline):**

- Diagnosis first, from the retained rows and the order's own instrumented
  fresh runs. Each deadline site is repaired at its cause: a bound that exists
  to catch a hung process becomes a function of the suite's measured baseline
  and a declared load factor the scheduler passes to gate children, and a
  bound that cannot be derived is protected by a scheduler load class that
  limits the suite's concurrent peers. The choice per site is measured, not
  assumed. A hit records the deadline, the measured duration and the
  concurrent tasks in the retained diagnostic log.
- The console collector keeps its read-only guarantee and a bound; the bound
  stops being a host-independent constant, or the release listing is shared
  across the gate, whichever the measurement supports. The test's assertion
  must not depend on host load.
- The gate row gains, per task, start, end and the names of tasks running at
  its start (additive fields). An offline computation over one recorded row
  yields the critical path; that trace is the entry evidence for the cold-gate
  structural candidate in product 07.
- Exclusivity is re-measured with the repair in place. The order neither
  assumes it can be dropped nor keeps it by inertia; WO-126-D012's reopening
  condition names exactly this evidence.
- **Declined alternatives, recorded:** raising every timeout by a constant
  (hides regressions; WO-127-D004 rejected it as a repair); serializing every
  suite (WO-126-D012 rejected it; the exclusive spans already cost 43 % of the
  cold gate); marking `console` exclusive (adds its 47–92 s to the
  concurrency-one span without repairing the collector); retrying failed
  suites automatically inside one gate (a retry is a diagnosed decision under
  07 §Discipline, not a runner default).

**Deliverables:** the diagnosis record; the runner's load factor, load classes
and per-task concurrency fields; the collector bound; the repaired deadline
sites and their fixtures; the exclusivity measurement; the write-backs below.

**Acceptance criteria (all required)**

1. A diagnosis record in `docs/evidence/WO-128/` lists, for each of the twelve
   failed fresh gates of 2026-09-11/12, the failing task, its deadline site,
   its duration under load and alone, and the tasks concurrent with it, from
   the retained rows and the WO-125 reports; a site the disposed logs cannot
   establish is recorded as unknown, not guessed.
2. Every fixed wall-clock deadline a gate child can reach, at least the console
   collector budget, the harness fixture process deadlines and barriers, the
   plan-refutation cases and the runner fixture's timeout case, is inventoried
   with its baseline alone and under the gate's declared load, and each is
   either derived from that baseline through a declared load factor or
   protected by a scheduler load class; a hit records the deadline, the
   measured duration and the concurrent tasks in the retained diagnostic, and
   a fixture proves it with a slow double under simulated load.
3. The gate row records, per task, its start, end and the names of tasks
   running at its start; a runner fixture proves the fields and an offline
   critical-path computation over one recorded gate.
4. Exclusivity re-measured: with criterion 2 in place, `harness-fixtures` and
   `process-debt` run under the shared cap in five consecutive
   `npm run test:full -- --fresh` runs on the operator's host; if all five
   pass, the exclusive flags are removed, the wall-clock is recorded beside
   the 2026-09-12T16:08Z run and that series is the series of criterion 5;
   if any fails on load, the flags stay, the failure is recorded, and
   criterion 5's series runs in the retained configuration. Either outcome
   closes the criterion.
5. Five consecutive `npm run test:full -- --fresh` runs on the operator's host,
   run outside the sandbox and recorded in the evidence directory, pass first
   time in the configuration criterion 4 keeps; a run that fails for a defect
   unrelated to load is a repair finding, not a retry, and a run that fails
   for a load outside the declared class is recorded with its diagnostic and
   restarts the count.
6. Write-backs land: 07 §Discipline (the gate execution and reuse bullet),
   `docs/evidence/WO-128/decisions.md` with dispatch sources and reopening
   conditions, the decisions index, FUP-0054's disposition and this order's
   execution record; `npm test` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** `npm run harness -- evidence`; the five operator-run fresh
rows; the fixture transcripts; the diagnosis record.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** the suite input key and the cache location (WO-129); input
declarations for the whole-tree suites (WO-130); making any suite faster than
its own baseline alone; a general scheduler or a per-suite resource model
beyond the load class; the cold-gate structural cuts (07 §Candidate —
cold-gate structural cuts); a runner-level automatic retry.

**Operator-review assumptions**

1. The operator runs the five fresh gates outside the sandbox and accepts
   their wall-clock as the order's measurement.
2. A load-derived collector bound is acceptable; WO-039's fifth repair left the
   constant unchanged by the operator's decision, and this order records the
   change as a new decision with the measured evidence rather than editing
   that record.

## Execution record

2026-09-12: implemented under `resume: next`, with the operator's explicit approval of
the bounded two-fixture planning repair. [Execution evidence](../evidence/WO-128/README.md)
maps all six acceptance criteria. [D001–D009](../evidence/WO-128/decisions.md)
record sources, corrections, measured costs, alternatives and reopening conditions.

The retained configuration uses the shared cap of four. Five consecutive
outside-sandbox fresh full gates pass all 78 tasks with zero reuse:
689,520, 692,702, 694,561, 697,079, 699,430 ms. The earlier series's fifth failure was
diagnosed with a quiet-host signal negative control, repaired at the fixture
protocol, and the count restarted. Its failed evidence remains immutable.
The accepted median 694,561 ms exceeds the exact prior 476,304 ms gate;
no speedup is claimed. Product 07 now contains the observed cold-gate trace.

The collector retains read-only operations with a finite load-derived bound;
all reachable deadline families and missing historical observations are
documented. Planning freshness checks and semantic test timers remain intact.
The fresh fast gate passes 12/12 (113,874 ms); the canonical final evidence
command and lifecycle transition enforce current full/diff evidence and output
review. FUP-0054's duplicate lineage points to the settled console collection
candidate. No new dependency is introduced. Prepared local target: v0.17.3
(skeleton 0.15.3, console 0.1.5), preserving publication controls.

Actor: Codex CLI 0.154.0, gpt-6-astra, max, operator-attested. Usage comes from
the canonical transcript-counter dispatch observations, not an inferred total.
Formal verification and final review remain their separately dispatched roles.
