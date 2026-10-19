# WO-222 — The complete run fits the machine: the scheduler takes its lanes from the host's parallelism under a memory budget per lane, light suites run beside the three exclusive suites, and the target-worktree suite runs as file lanes, each lever kept only on before-and-after complete-run timelines (v0.86.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. The scheduler's lane count, the host-lane
registry's capacity and the deadline load declaration change their contract
(`DOTLN_GATE_CONCURRENCY` above four becomes legal), the three exclusive
suites gain an overlap declaration, and the `target-worktree` suite becomes
file rows. No command, flag or refusal is added; `npm test` spellings are
unchanged. Assigned at activation under the standing opt-out default.
**Cost:** adds the lane derivation and its registry capacity record, the
per-lane memory budget, the overlap declaration on the three exclusive rows,
the file split of `scripts/test-target-worktree.mjs`, the fixtures of
criteria 1 to 4, the after series and its README comparison, decisions and
one write-back paragraph. Removes, measured at the latest passing complete
row at the base (`npm test -- --review`, recorded 2026-10-19T10:58:31Z at
code identity `33c9b710…`, read with `readGateChecks` and
`gateCriticalPath`): 2,757 s of wall-clock for 4,840 s of task work, so
1.76 of the four lanes were busy on average; 562 s in which
`harness-fixtures` (292 s), `process-debt` (103 s) and
`worktree-integration` (167 s) each held all four lanes alone; 611 s in
which `target-worktree` ran on one lane from second 29 while the first
exclusive suite waited for the lanes to drain; the four vertical files at
two slots each (465, 299, 446 and 355 s); peak gate RSS 2.85 GB and peak
footprint 1.97 GB against a 25.8 GB gate share, the largest single task
`runner-fixtures` at 1.43 GB. WO-221 D019's row of 2026-10-18T23:05:43Z
read the same shape: about 5,700 lane-seconds under four lanes on sixteen
logical processors, 328 ms of scheduler idle, a 526 s exclusive convoy and
514 s of mixed work bounded by `target-worktree`. The removal this order
claims is bounded by the series it records: criterion 5 keeps each lever
only when the after median is at least one fifth below the before median,
and the inference from the timeline (the mixed phases packing onto eight
lanes and the convoy no longer idling three) is that a passing run falls
from about 46 to about 30 minutes; the series decides, not this estimate.
Every later order pays this run at least once (WO-216's baseline: eleven
complete runs per closed order; WO-221's window: fifteen), so the saving
repeats at each of the sixteen queued orders. Wall-clock: the after series
is three fresh complete runs (about 1.5 to 2.3 hours at today's durations)
plus the implementation; unknown until run. Context bytes: the scheduler
region of `scripts/test-runner.mjs` (about lines 1320 to 1330 and 1922 to
2250), `scripts/lib/host-lanes.mjs`, `scripts/lib/host-resources.mjs`,
`packages/skeleton/src/gate-deadlines.mjs`, `scripts/measure-gates.mjs`
and the split suite, about 300 KB. Commands: none added. Tokens: unknown
until run. Steps: 14. Re-mints and the live episode:
`packages/skeleton/src/gate-deadlines.mjs` and `scripts/lib/host-resources.mjs`
are in `FEEDBACK_SOURCE_PATHS` (`packages/skeleton/src/feedback-audit.ts`
lines 26 and 67), so this order owes one live feedback self-host episode on
Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`,
run in the executor's session with no authorization needed and its cost
accepted; both files are registered evidence sources
(`scripts/lib/evidence-sources.mjs`: `gate-deadlines.mjs` at lines 82, 159,
226, 257 and 328; `host-resources.mjs` at line 53), so each staled edition
is re-minted deterministically; `scripts/test-runner.mjs`,
`scripts/lib/host-lanes.mjs`, `scripts/lib/host-resources.mjs`,
`scripts/measure-gates.mjs` and `scripts/lib/gate-timeline.mjs` are declared
machinery sources of `runner-fixtures` (lines 323 to 372), so
`npm test -- --review` is in the final criterion.
**Nomination provenance:** the 2026-10-19 standard planning pass
([planning document](../planning/standard-pass-2026-10-19.md) §4), from
WO-221 D019 (the gate's cost measured; its capacity levers deferred to a
planned order with a refuter), the register's cold-gate structural-cuts row
(FUP-e96221b106cd136a, open since 2026-10-02 and allocated to this order),
the fired 2026-10-18 NoOp on the `target-worktree` task (two focused rows
of 517 s and 506 s outside a complete run on 2026-10-18, against its 77 s
condition) and the gate index rows of this checkout. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: this repository's
code, records and gate index; fixtures are synthetic; no local path appears
here.
**Depends on:** WO-221 closed (v0.85.0: the lead ordering of changed and
failed suites, the reuse of a passing complete row at an unchanged identity
and D019's measurement this order builds on). No queued order; WO-217 edits
`scripts/test-runner.mjs` after it and rebases (reference only).
**Recommended placement:** position 1 of the serial queue, before WO-217:
every later order pays the complete run several times, so the saving
compounds from the first order after it; the operator may move it by one
sequence edit.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "the lead ordering, the identity reuse rule and the D019 measurement this order builds on"
  },
  {
    "workOrderId": "WO-217",
    "relation": "reference-only",
    "reason": "queued after; its runner rows rebase on the scheduler this order leaves"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Preflight before
the full gate (the scheduling paragraph and the WO-216 measurements),
§Discipline (the handoff sequence), §Operator-opened planning pass (order
size); `docs/evidence/WO-221/decisions.md` D016 to D020;
`docs/evidence/WO-216/README.md` (the base measurements);
`scripts/test-runner.mjs` (`isolated` and `reservedSlots` 1323 to 1327,
`scheduleSuites` 1923 with its default concurrency 1927 to 1930 and the
four-lane refusal 1945 to 1946, `peerConcurrency` 1975 to 1983, the lane
loop 2202 to 2240, `expandSuiteTasks` with the launchpad and vertical splits
2306 to 2345, the `exclusive: true` rows 992, 1178 and 1247, the
`target-worktree` row 909, `fileConcurrency` 1084 to 1087, the
`runner-fixtures` sources 323 to 372); `scripts/lib/host-lanes.mjs`
(`acquireHostLanes` 89 to 110); `scripts/lib/host-resources.mjs`
(`DEFAULT_MEMORY` 22 to 30, the `hostLanes` refusal and the share bytes 92
to 102); `packages/skeleton/src/gate-deadlines.mjs` (`gateLoad` 9 to 23,
`deadlineLimit` 28 to 41); `scripts/measure-gates.mjs` (`--run` and
`--check`, 228 to 233; the series command `npm run test:full -- --fresh`,
139 and 168); `scripts/lib/gate-timeline.mjs` (`gateCriticalPath`);
`scripts/test-runner.test.mjs` (the lane cases at 1941, 2078, 2174 to
2196, 2904 and 7923); `scripts/test-host-guard.test.mjs` (the host-lane
cases); `scripts/test-target-worktree.mjs` (171,587 bytes, 38 top-level
tests); `packages/skeleton/src/feedback-audit.ts` lines 15 to 79.

**Objective:** A complete run uses the machine it runs on. The scheduler's
lane count is derived from the host (the lesser of eight and half the
logical processors, at least one) and recorded by the host-lane registry so
every clone on the host agrees; each lane holds a memory budget of the gate
share divided by the lanes, and a run refuses to start when that budget is
below the largest task peak the base's passing rows record. The three
exclusive suites keep their reservation but admit up to two light peers,
with their deadlines derived from measured work under peers. The
`target-worktree` suite runs as file rows under their own deadlines, two at
a time, with every case kept. Each lever is kept only when the after
series of three fresh complete runs, on the same machine, has a median at
least one fifth below the before median and no task ended at its deadline;
a lever the series does not justify ships in its old form with the series
recorded.

**Observed gap (dated 2026-10-19, main at `f577979e`):** `scheduleSuites`
defaults its concurrency to the lesser of four and half the parallelism and
refuses more than four (lines 1927 to 1930, 1945 to 1946);
`acquireHostLanes` refuses any capacity other than four (host-lanes.mjs
lines 104 to 110); `DEFAULT_MEMORY.hostLanes` is four and the task share is a
fixed quarter of physical memory (host-resources.mjs lines 22 to 30 and 99
to 101), so eight tasks would be budgeted 103 GB on a 51.5 GB host;
`gateLoad` refuses `DOTLN_GATE_CONCURRENCY` above four and derives each
deadline as the solo baseline times two per peer slot (gate-deadlines.mjs
lines 9 to 41). An `isolated` row reserves every lane (`reservedSlots`,
line 1324) and the lane loop lets an exclusive row at the head of the queue
wait for the lanes to drain (lines 2202 to 2240), so a 611 s single-lane
suite that started at second 29 held the first exclusive suite until second
640 in the row the Cost line cites. `expandSuiteTasks` splits only
`launchpad` and `vertical` into file rows (lines 2306 to 2345); the
`target-worktree` row is one 171,587-byte file of 38 tests under one
deadline (line 909), which ran 503 to 624 s in every complete row of
2026-10-18 and 2026-10-19 and 517 s and 506 s alone. The three exclusive
rows carry `exclusive: true` with the comment that their bounds were measured
alone (lines 992, 1178 and 1247). `scripts/measure-gates.mjs --run` records a
series of three fresh complete runs (`npm run test:full -- --fresh`, lines
139 and 168) and `--check` validates one; it is the instrument WO-221 D019
named.

**Design (scope discipline):**

- **Lanes from the host.** One derivation, exported from
  `scripts/lib/host-resources.mjs` beside `DEFAULT_MEMORY`: `hostLaneCapacity()`
  is the lesser of eight and half of `availableParallelism()`, at least one.
  `scheduleSuites` defaults to it and refuses a concurrency above it; the
  host-lane registry records the capacity its first acquirer derived, a later
  acquirer inherits the recorded capacity and refuses only a request for
  more slots than it holds (naming both numbers); `gateLoad` accepts a
  concurrency up to the recorded capacity and keeps the factor of two per
  peer slot; `taskBytes` becomes the gate share divided by the lanes, and
  the host task of the structural phase refuses the run when that budget is
  below the largest task peak RSS of the base's three passing complete rows
  (1.43 GB at filing), naming both. Rejected: a fixed eight (axis:
  portability; an exported instance on four processors would run eight
  lanes on two cores, while the derivation gives it two); no cap at all
  (axis: memory; the gate share bounds the lanes and the per-lane budget is
  what the monitor enforces); a cap read from the budgets file (axis: who
  decides; the machine's parallelism is observed, a number in a file is
  guessed).
- **Light peers beside the exclusive three.** The three `exclusive` rows
  declare `overlap: 2`: they reserve every lane but two, and the two may be
  taken only by light rows, those whose latest recorded task in the base's
  passing rows ran under 60 s with a peak RSS under 512 MB and whose
  `loadClass` is shared; a heavy row waits as today. Nested gates of the
  hook-heavy group keep their inherited reservation, so a light peer never
  takes a slot a nested lease could claim. The exclusive row's own deadline
  under peers is its solo baseline times the factor `gateLoad` derives for
  its declared concurrency (three), and the after series shows whether the
  three rows' durations under peers stay inside it. Rejected: dropping the
  exclusive flag (axis: the cause; the flag exists for the hook-heavy group's
  host-lane contention, which the series must show absent before the flag
  goes); overlap by any shared row (axis: the deadline evidence; D019 held
  that each heavy suite's deadline was measured alone, and a flaky deadline
  costs a full rerun).
- **File lanes for target-worktree.** `scripts/test-target-worktree.mjs` is
  split by its case groups (start and host rules; publish and the draft;
  close and disposable output; the target release and the starter refresh)
  into files whose shared helpers move to `scripts/lib/target-worktree-fixture.mjs`,
  each a `target-worktree:file:<basename>` row as `launchpad` is split, two
  at a time, each under its own 900 s deadline; `machinerySources` and the
  suite row name the new files; `npm test -- --only target-worktree` runs
  them all. Rejected: trimming cases (axis: coverage; every case reproduces
  a WO-210, WO-213 or WO-221 defect); a larger deadline for the one file
  (axis: the cause; the suite's length, not its bound, holds the lane).
- **The vertical's share.** With eight lanes the four vertical files run at
  once at two slots each, which the derivation gives without a further
  split; no vertical file changes in this order. Rejected: splitting
  `test-vertical.mjs` again by statement groups (axis: measurement first;
  the series shows whether the vertical bounds the run once the lanes
  change).
- **The series decides.** The before series is the three latest passing
  complete rows at the base, by identity, duration, task timeline and peak
  RSS, read from the gate index; the after series is three fresh complete
  runs through `scripts/measure-gates.mjs --run` at the handoff identity on
  the same machine. The README compares medians, the critical path and
  each task's duration and peers. A lever whose series shows no gain of one
  fifth, or any task ending at its deadline, ships in its old form and the
  decision records the measurement. Rejected: accepting on the inference
  alone (axis: evidence; D019 required before-and-after timelines).

**Deliverables:** the derivation, registry record, budget and deadline
changes with their fixtures; the overlap declaration; the split suite and
its helpers; the series files and README comparison; decisions; the
re-mints and the live episode; the write-back paragraph. The operator
subsequently added the maintained gate-execution architecture record
(D011 and criterion 9), with research and prior decisions linked for later
work orders.

**Acceptance criteria (all required)**

1. With `availableParallelism()` stubbed to 2, 4, 8, 16 and 32, the
   scheduler's default lane count is 1, 2, 4, 8 and 8; the host-lane
   registry records the capacity its first acquirer derived, a later
   acquirer with a different derivation inherits the recorded capacity, and
   only a request for more slots than the recorded capacity refuses, naming
   both numbers (runner-fixtures).
2. `taskBytes` equals the gate share divided by the lanes; the existing
   memory-growth fixture is ended at the new budget; the structural `host`
   task refuses a run whose per-lane budget is below the largest task peak
   RSS recorded in the base's three passing complete rows, naming both, and
   admits one above it (runner-fixtures).
3. With a fixture table holding one exclusive row declaring `overlap: 2`,
   two light rows and one heavy row, the exclusive row runs with at most the
   two light rows beside it and the heavy row starts only after it ends; a
   nested lease under the exclusive row keeps its inherited reservation;
   `gateLoad` accepts a concurrency of three for the exclusive row and
   derives the factor six, and refuses a concurrency above the recorded
   capacity (runner-fixtures; skeleton).
4. `expandSuiteTasks` turns `target-worktree` into one
   `target-worktree:file:<basename>` row per split file, two at a time, each
   with its own deadline; `npm test -- --only target-worktree` runs them all
   and the set of case names across the files equals the 38 at the base
   (runner-fixtures; target-worktree; the README lists both sets).
5. `docs/evidence/WO-222/before.json` holds the three latest passing complete
   rows at the base (identity, duration, task timeline, peak RSS per task)
   and `docs/evidence/WO-222/after.json` holds three fresh complete runs
   recorded by `scripts/measure-gates.mjs --run` at the handoff identity on
   the same machine; the README's table compares their medians, critical
   paths and per-task durations with peers. The after median is at least
   one fifth below the before median and no after task ended at its
   deadline; or, for each lever the series does not justify, the decision
   records the measurement and that lever ships in its old form (the lane
   derivation retained at four, the overlap declaration absent, or the
   suite unsplit), with the release classification assigned accordingly.
6. The live feedback self-host episode for the edited judged sources is
   recorded and `node scripts/feedback-evidence.mjs --check` passes; the
   authority and harness editions are re-minted and their checks pass
   (feedback-evidence; authority-evidence; harness-evidence; evidence-sources).
7. Write-backs land in place (step 13); the decisions of step 12 are
   recorded; `npm run meta -- --check` passes.
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; `scripts/lib/gate-evidence.mjs` and
   `packages/skeleton/src/gate-evidence.mjs` unchanged.
9. `docs/architecture/gate-execution.md` is a standalone, maintained
   architecture decision record. It traces prior gate work and decisions,
   cites research from books, primary sources and public implementations,
   compares alternatives and tradeoffs, distinguishes implemented behavior
   from proposals, and gives an evidence-based migration and validation plan.
   Product 07 links to it; future work orders can cite and extend it while
   retaining their ordinary decision records (operator scope expansion, D011).

**Preflight:** `npm test -- --only runner-fixtures` for steps 2, 4, 5, 6, 8 and 9;
`npm test -- --only skeleton` for step 3;
`npm test -- --only target-worktree` for step 7;
`npm test -- --only configuration-root` for every script step;
`npm test -- --only authority-evidence`, `npm test -- --only feedback-evidence`,
`npm test -- --only harness-evidence` and `npm test -- --only evidence-sources`
for step 11; `npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then the handoff gate the executor's role text names at
the base.

**Execution plan (the executor follows these steps in order; observed at `f577979e`, 2026-10-19):**

1. `docs/evidence/WO-222/README.md` (new) and `docs/evidence/WO-222/before.json`
   (new): at the base, the three latest passing complete rows from
   `readGateChecks` (identity, recorded time, duration, `taskTimeline`,
   peak RSS per task, `gateCriticalPath`), the lane count and physical
   memory of the machine, and the 38 case names of
   `scripts/test-target-worktree.mjs`. Check: the README holds them and
   `before.json` parses.
2. `scripts/lib/host-resources.mjs`: export `hostLaneCapacity()` (the lesser
   of eight and half of `availableParallelism()`, at least one);
   `DEFAULT_MEMORY.hostLanes` and the refusal at lines 92 to 95 read it;
   `taskBytes` becomes `floor(gateBytes / lanes)` (lines 99 to 101); export
   the largest-peak reader the `host` task uses. Check: step 8.
3. `packages/skeleton/src/gate-deadlines.mjs`: `gateLoad` (lines 9 to 23)
   accepts a concurrency up to the recorded capacity (read from the registry
   record or `DOTLN_GATE_CAPACITY` set by the scheduler), keeps the factor of
   two per peer slot and the isolated rule; `deadlineLimit` unchanged.
   Check: `npm test -- --only skeleton`.
4. `scripts/lib/host-lanes.mjs`: `acquireHostLanes` (lines 89 to 110) takes
   its capacity from the registry record, written by the first acquirer from
   `hostLaneCapacity()`; a later acquirer inherits it; the refusal names the
   requested slots and the recorded capacity; nested leases keep the
   inherited-reservation rule. Check: step 8.
5. `scripts/test-runner.mjs`, lanes and overlap: `scheduleSuites` defaults
   to `hostLaneCapacity()` and refuses more (lines 1927 to 1946);
   `reservedSlots` (line 1324) gives an `isolated` row with `overlap: n`
   every lane but `n`; the lane loop (lines 2202 to 2240) admits only light
   rows (the Design's rule, read from the base's passing rows carried in
   `before.json`) into those lanes while the exclusive row runs;
   `peerConcurrency` and the `DOTLN_GATE_*` environment carry the exclusive
   row's declared concurrency and the capacity; the three `exclusive: true`
   rows (992, 1178, 1247) declare `overlap: 2`; the structural `host` task
   refuses the under-budget case of criterion 2. Check: step 8.
6. `scripts/test-runner.mjs`, `expandSuiteTasks` (lines 2306 to 2345):
   `target-worktree` splits into `target-worktree:file:<basename>` rows as
   `launchpad` does, two at a time, each with `timeoutMs: 900_000`;
   `machinerySources` and the row at line 909 name the files of step 7.
   Check: step 8.
7. `scripts/test-target-worktree.mjs`: split into
   `scripts/test-target-worktree-start.mjs`, `scripts/test-target-worktree-publish.mjs`,
   `scripts/test-target-worktree-close.mjs` and
   `scripts/test-target-worktree-release.mjs` by the Design's case groups,
   shared helpers in `scripts/lib/target-worktree-fixture.mjs` (new), every
   case kept by name. Check: `npm test -- --only target-worktree`; the
   case-name set equality recorded in the README.
8. `scripts/test-runner.test.mjs` and `scripts/test-host-guard.test.mjs`:
   cases for criteria 1 to 4 (the stubbed parallelism table, the registry
   record and inheritance, the budget refusal and admission, the overlap
   table with a nested lease, the file split); the existing lane cases at
   1941, 2078, 2174 to 2196, 2904 and 7923 read the capacity instead of the
   literal four. Check: `npm test -- --only runner-fixtures`.
9. `scripts/measure-gates.mjs`: the series records each task's peers at
   start, peak RSS and the lane capacity beside the fields it records today;
   `--check` validates the new fields. Check: `npm test -- --only runner-fixtures`.
10. `docs/evidence/WO-222/after.json` (new) and the README: at the handoff
    identity, `node scripts/measure-gates.mjs --run docs/evidence/WO-222/after.json`
    (three fresh complete runs, on the same machine, no other gate running);
    the README's comparison table of criterion 5 and the per-lever reading.
    Check: `node scripts/measure-gates.mjs --check docs/evidence/WO-222/after.json`;
    the README holds the table.
11. Re-mints and the live episode: `npm run sync` re-mints the authority and
    harness editions; the live feedback self-host episode runs in this
    session for the edited judged sources, then
    `node scripts/feedback-evidence.mjs --check`. Check: the four evidence
    suites of the Preflight line.
12. `docs/evidence/WO-222/decisions.md`: one decision per lever naming the
    measured before and after, the chosen form, the rejected form and the
    reversal rule (a lever reverts when a later pass's complete-run median
    rises above the before median of this order), plus the deadline reading
    for each exclusive row under peers. Then `npm run meta`. Check:
    `npm run meta -- --check`.
13. Write-backs (headings re-read at the base): product 07 "### Preflight
    before the full gate", the paragraph beginning "Scheduling orders the
    queue by priority" (the lanes from the host, the per-lane budget, the
    light peers beside the exclusive three, the target-worktree file lanes,
    with the measured medians), and the product 07 passage that states the
    four-lane cap or the shared four lanes wherever `grep -n "four lanes"
    docs/product/*.md` finds one at the base. `npm run sync`;
    `npm run publication:check`. Check: `npm run test:docs`.
14. Handoff: `npm run format`; `npm run sync`; `npm run test:docs`; the
    Preflight suites; one complete run `npm test -- --review` in the
    background (never under the bounded wrapper); complete
    `docs/evidence/WO-222/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Evidence gate:** the `runner-fixtures`, `skeleton` and `target-worktree`
suites; the four evidence suites; `before.json`, `after.json` and the
README comparison; `npm run test:docs`; the handoff gate; one live feedback
episode (step 11). The after series is the order's measurement, not a model
run.

**Write-back duty:** criterion 7 and step 13.

**Known issues and carry-ins:**

- FUP-e96221b106cd136a (cold-gate structural cuts, open since the 2026-10-02
  pass): the 2026-10-13 reading that a cut needs less task work or more
  lanes, and that neither had a measured bounded fix, is answered by D019's
  measurement and this order's series; the launchpad split was WO-216's
  first cut.
- FUP-1dce3a6f7ac60eac (WO-221 D019): the three levers in the order D019
  gave them, plus the target-worktree split this pass adds from the fired
  2026-10-18 condition.
- The three exclusive rows' deadlines under peers are unknown until the
  after series runs; a task ending at its deadline in that series keeps the
  overlap declaration off (criterion 5).
- The fork's kit instance runs the same `target-worktree` suite (its
  `plan conditions` held on it at 444 s against a one-sample median on
  2026-10-18); the file split reaches it with the next kit update.
- Raising the lanes raises every deadline derived from a peer count, so a
  hung task takes longer to be ended; the per-task deadlines stay and the
  bounded wrapper's outer bound stays.
- Line numbers above are observed at `f577979e`; the executor re-reads at
  its base.

**Non-goals:** changing any suite's cases; carrying or reusing task results
across identities; the vertical files; a time-budgeted selection; the
document gate's cost (WO-217's rows FUP-fb8cbeabbddef397 and
FUP-211986cdaa9f8c4f); `worktree finish` and the gate index copy (WO-217);
target gates (`scripts/lib/target-gate.mjs`); the bounded wrapper's
deadlines; `gate-evidence.mjs`.

**Operator-review assumptions**

1. The lane count is derived from the machine, never set by hand; eight is
   the ceiling because the exclusive three and the two-slot vertical files
   leave no measured use for more.
2. A lever the series does not justify ships in its old form; the order
   closes truthfully either way, with the series as its evidence.
3. The live feedback episode runs in the executor's session without
   authorization, as product 07 states for judged sources.
