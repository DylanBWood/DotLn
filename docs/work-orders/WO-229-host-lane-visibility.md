# WO-229 — A gate says who it waited for: each WAIT line labels its holders as this checkout, another checkout or unknown without printing a path, the gate summary and the recorded row carry the gate's lane wait apart from its work, the planning condition reports an execution-only median beside the wall-clock one and marks a contended sample, `node scripts/harness.mjs lanes` lists live holders read-only, and the structural tasks' full-capacity requests are measured against their need (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. New fields on the recorded gate row, a
longer WAIT line and summary line, one read-only `harness` subcommand, two
new figures in the planning condition and a measurement the decisions
record; no admission rule changes in this order (the request sizing is
measured and decided, not changed, unless the measurement meets the
criterion's bound). Assigned at activation under the standing opt-out
default.
**Cost:** adds, in `scripts/lib/host-lanes.mjs`, a `relation` per holder
observation and the WAIT formatter's label; in `scripts/test-runner.mjs`,
the gate-level `hostLaneWait` object on the recorded row and the summary
line's wait figure; in `scripts/lib/gate-timeline.mjs`, `laneWaitMs` apart
from `gapMs`; in `scripts/lib/gate-reuse.mjs`, the strip list; in
`scripts/lib/planning-conditions.mjs`, the execution-only median, the
`contended` flag and a lane snapshot in the host context; in
`scripts/harness.mjs`, `lanes`; a non-mutating holder read in
`host-lanes.mjs`; the measurement script and its record; cases in
`scripts/test-host-guard.test.mjs`, `scripts/test-runner.test.mjs`,
`scripts/test-gate-deadlines.mjs` and `scripts/test-plan-refutation.mjs`;
product 07 and the architecture record's sentences. Removes the state the
fork met twice: a document gate whose summary says 304.86 s or 1,520.76 s
while every task's printed duration is under 6 s, WAIT lines that name
holders the gate cannot schedule without saying whose they are, and a
planning condition that reads another checkout's complete run as the
document gate's own cost. Re-mints: `scripts/lib/gate-reuse.mjs` is a
common source of every edition (since `0623f3a3`), so every minted edition
is re-minted deterministically through `npm run sync`, the feedback edition
by carry; `scripts/test-runner.mjs` and `scripts/lib/host-lanes.mjs` are
`runner-fixtures` and host-guard sources, so `npm test -- --review` runs
before handoff. No live feedback episode is owed. Wall-clock: the relation
label is one `realpath` per holder per WAIT; the snapshot is one directory
read; the measurement is one bounded series the executor runs outside a
gate. Context bytes: this file, about 22,000. Steps: 11.
**Nomination provenance:** the fork's planning pass of 2026-10-21 (items 2
and 10 of its request block, in the operator's dispatch, ignored capture
SHA-256 `4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`):
the question whether a first run in a fresh checkout builds output later
runs reuse or the lane rule serializes the document gate's fixture tasks,
asked at 304.86 s on a 16-CPU host and again at 1,520.76 s with every task
under 6 s, and what the fork should measure next. Answered by the
[2026-10-21 pass](../planning/fork-notes-and-operator-questions-2026-10-21.md)
§4 from a read-only research pass over the lane and runner sources:
cross-checkout contention in the per-user registry, neither a first-run
build nor the gate's own serialization. WO-222-D009 (2026-10-19) observed
the same mechanism from the other side (an instance's document row waited
1,554 s behind core's complete run) and WO-217-D040 (2026-10-21) declined a
new-client-only fair queue. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: no stop condition; the fork's figures are from
its public planning documents.
**Depends on:** WO-185 (closed: the per-user host registry), WO-222
(closed, v0.86.0: the recorded capacity, overlap and file lanes), WO-217
(closed, v0.89.0: the `:overlap` reservation and D040). WO-219 and WO-220
edit the runner with no typed edge: whichever runs second rebases.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-185",
    "relation": "satisfied-by-close",
    "reason": "the per-user host registry whose holders this order labels"
  },
  {
    "workOrderId": "WO-222",
    "relation": "satisfied-by-close",
    "reason": "the recorded capacity and the scheduler whose waits this order attributes"
  },
  {
    "workOrderId": "WO-217",
    "relation": "satisfied-by-close",
    "reason": "the :overlap reservation and D040, which this order measures against rather than reopens"
  },
  {
    "workOrderId": "WO-219",
    "relation": "reference-only",
    "reason": "it edits the runner for other rows; whichever runs second rebases"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Preflight before the full
gate (the consumer selection, the structural tasks, the host-lane registry
paragraph at lines 3146 to 3152), the Host resources bullet (2253 to 2266);
`docs/architecture/gate-execution.md` (lines 23 to 31 the candidate queue,
60 and 84 to 86 the wait claim, 176 to 179 "Correct request sizes at their
source"); `scripts/lib/host-resources.mjs` (`hostLaneCapacity` 22 to 26,
`hostStateRoot` 87 to 99, `ensureHostRoot` 101 to 112, `readRecords` 616 to
634); `scripts/lib/host-lanes.mjs` (`capacityUnderLock` 17 to 25,
`laneHolderAlive` 40 to 55, `liveHolders` 96 to 122, the default `onWait`
133 to 136, admission 185 to 202, the record 204 to 214, the observation
257 to 285, the poll 290); `scripts/test-runner.mjs` (`executeTask` 2088 to
2150: `hostLaneWaitMs` at 2150, the observed row 2108 to 2133; the
structural, kit-verify and build requests 2224 to 2276; the `:overlap`
reservation 2370 to 2389; the PASS line 3270 to 3272; the check row 3372 to
3471 and `taskTimeline` 3446; the summary 3575 to 3577; `--list` 2860 to
2867); `scripts/lib/gate-timeline.mjs` (`gateCriticalPath` 4 to 54, `waitMs`
40 to 45); `scripts/lib/gate-reuse.mjs` (the strip list 252 to 273);
`scripts/lib/planning-conditions.mjs` (the rows 83 to 98, the plain-gate
condition 136 to 147, the task conditions 163 to 184, the measurement 344
to 371, the budget 392, the host context 409 to 414, the render 551);
`scripts/harness.mjs` (the usage at 51 to 52); `docs/evidence/WO-222/decisions.md`
D009 and D018; `docs/evidence/WO-217/decisions.md` D040 and D041 (private
host paths omitted from registry diagnostics); `docs/evidence/WO-185/decisions.md`
D001 and D015; the [2026-10-21 planning
document](../planning/fork-notes-and-operator-questions-2026-10-21.md) §4.

**Objective:** When a gate waits, the operator can read who it waited for
and how long, in the terminal, in the recorded row and in the planning
condition, without any checkout's path leaving its machine; and the cause of
most cross-checkout waiting, the structural tasks' full-capacity requests,
is measured so the next pass can decide it:

- **WAIT names the relation.** Each holder in a WAIT line carries `this
  checkout`, `another checkout` or `checkout unknown` (a record without a
  `worktree` field), compared by `realpath` against the waiter's own
  worktree; the path is never printed.
- **The summary and the row carry the wait.** The gate summary line appends
  the gate's lane wait as the union of its tasks' wait intervals, split by
  relation (`; 1,512.3 s waiting for host lanes (1,512.3 s behind another
  checkout)`); the recorded check row gains `hostLaneWait: { wallMs,
  byRelation, holders: [{ task, slots, relation, nested }] }` with no path;
  `gateCriticalPath` splits `waitMs` into `laneWaitMs` and `gapMs`; gate
  reuse strips the new fields as it strips the old.
- **The planning condition tells the two apart.** The document-gate
  condition reports the wall-clock median as today and, beside it, an
  execution-only median (wall minus the recorded lane wait) read from each
  sample's recorded row, marks a sample that waited behind another checkout
  `contended`, and the host context carries a lane snapshot (holder count
  and slots by relation) in place of `other host activity unknown`; which
  figure `holds` judges is the decisions file's recorded choice (the
  planner proposes the execution-only figure for the cost condition and the
  wall figure for the operator's experience, both shown).
- **A read-only listing.** `node scripts/harness.mjs lanes` prints the live
  holders (relation, task, slots, age, nested, owner alive) and the recorded
  capacity through a non-mutating read, so an instance answers "is it me?"
  without reading JSON by hand or taking the lock.
- **The cause is measured, not assumed.** The executor measures, outside a
  gate, the CPU and RSS of each structural task and `kit-verify` in core and
  in a fixture export, and records in the decisions what a right-sized host
  request for each would be against the recorded capacity; if the
  measurement shows a task needing fewer than half the capacity, the
  request is sized to the measurement and the admission regression
  (criterion 5) proves a short document gate's wait is bounded while a
  complete gate runs; otherwise the order records the measurement and
  changes no request.

**Observed gap (dated 2026-10-21 at `main` `926b8234`):**

- The lane registry is per user and machine-wide (`hostStateRoot`: the
  per-user temporary root joined with `dotln-host-v1-<uid>`, ignoring
  `TMPDIR`, cwd and the checkout; `host-resources.mjs` 87 to 99), by
  recorded decision (WO-185-D001 and D015: separate clones must not each
  admit a full gate); kits carry the same scripts, so every checkout,
  worktree, clone and exported instance of one user shares it. Capacity is
  the first acquirer's `lane-capacity.json` (`min(8, floor(cpus/2))`; 8 on
  16 CPUs). Admission has no queue: a request is admitted only when the
  same-parent holders' slots plus the request fit the capacity, else the
  waiter polls every 100 ms (`host-lanes.mjs` 195 to 202, 290); a
  full-capacity request waits until no other top-level lease exists on the
  host.
- In an instance's `test:docs`, 7 of the 14 tasks (the six structural tasks
  and `kit-verify`) each request all `concurrency` slots (`test-runner.mjs`
  2224 to 2257), and the local scheduler runs them one after another by
  design; the other 7 rows reserve one slot. A gate's own leases are
  released before its local lanes free (2200 to 2206), so its own tasks
  never block each other at the registry. The holder names the fork saw
  (`target-worktree:file:…`, `skeleton`, `release:case:…`,
  `release-preparation`, `worktree-integration`) are core product tasks an
  instance's document selection cannot schedule (2787 to 2833), and no
  document script in that selection starts a nested gate. The waits
  therefore came from another checkout's gate, most likely core's product
  run; which checkout and at what version is unrecorded, because nothing
  records it.
- The WAIT line prints the waiter, `waitedMs` and, per holder, task, slots,
  age, owner alive or exited, surviving task processes, retained subleases
  and the nested and released flags (`host-lanes.mjs` 133 to 136, 257 to
  285), never the holder's worktree, pid or gate; the record holds the
  absolute `worktree` path (204 to 214; `test-runner.mjs` 2147).
  `hostLaneWaitMs` is recorded per task with `hostLaneSlots` and up to 32
  `hostLaneWaitObservations` (2108 to 2150); the PASS line prints
  execution-only `durationMs` (3270 to 3272; the clock starts after the
  lease, 1463) and the summary prints wall-clock `check.durationMs` with no
  wait figure (3378, 3575 to 3577). `gateCriticalPath.waitMs` mixes lane
  wait with scheduling gaps (`gate-timeline.mjs` 40 to 45), while the
  architecture record says lane waiting is recorded apart from work (84 to
  86). Reuse strips the wait fields (`gate-reuse.mjs` 252 to 273).
- The document-gate planning condition is the median of three wall-clock
  timings of `test-runner.mjs --document` under a 300 s budget
  (`planning-conditions.mjs` 344 to 371, 392), never reading the recorded
  row's `hostLaneWaitMs`; a contended run times out and the row becomes
  unknown; the host context says `other host activity unknown` (409 to
  414, 551). The fork's own register row (a median above 30 s) fired on
  1,520.76 s of wall-clock, with 15.35 s recorded for the same gate on its
  `main` the same day.
- WO-222-D009 attributed an instance document row's 1,554,557 ms of wait to
  kit-verify's four-slot lease behind core's complete run and asked for fair
  cross-gate admission; WO-217-D040 declined a new-client-only fair queue
  (fixed-four clients publish no waiting intent) and reopens only with a
  compatible migration or adapter; the architecture record proposes
  "accurate requests for short structural work" and "Correct request sizes
  at their source" as unshipped steps (23 to 31, 176 to 179). No
  measurement of the structural tasks' CPU need exists.

**Design (scope discipline):**

- *Relation, not identity.* The waiter already passes its `worktree`
  (`test-runner.mjs` 2147, 2383, 3295); the observation mapping compares
  `realpath(holder.worktree)` with `realpath(waiter.worktree)` and emits
  `relation`; a record without `worktree` is `unknown`. Rejected: a salted
  checkout tag (axis: another registry file with a lifecycle, for a
  distinction between two other checkouts no one has asked for); the path
  (axis: WO-217-D041's rule and the records quoted into committed evidence,
  as D009 quoted wait observations).
- *One gate-level figure.* The summary's wait is the interval union of
  `[startedAt, startedAt + hostLaneWaitMs]` over the gate's tasks, split by
  the relation of the holders observed in that interval, so parallel waits
  are not summed twice. The recorded row carries the same object; the
  timeline splits `laneWaitMs` from `gapMs`; reuse strips both.
- *The condition reads the row it produced.* Each `--slow` sample runs the
  child gate as today and then reads the child's latest `npm run test:docs`
  row from `checks.json` (`checksPath`), taking `hostLaneWait.wallMs` and
  `byRelation`; a sample with `another checkout` wait is `contended`; the
  execution-only median is wall minus that wait. Which figure `holds` reads
  is recorded in the decisions file before the code lands (the planner
  proposes execution-only for the cost condition); the 300 s budget stays,
  and a sample that times out is recorded `unavailable` with its contention
  if the row exists. Rejected: judging on wall-clock alone (axis: another
  checkout's run reopens the document gate's cost); hiding wall-clock (axis:
  the operator's experience is the wall).
- *A read without the lock.* `liveHolders` deletes stale records under the
  lock (96 to 122), so `lanes` uses a new `readHolders(directory)` that
  reads the records and the process table without writing; it says it may
  show a transient state. Rejected: taking the lock for a read (axis:
  contention with the gates it inspects).
- *Measure before sizing.* A bounded script (`scripts/measure-lanes.mjs`,
  or `measure-gates.mjs` extended) runs each structural task and
  `kit-verify` alone under `harness bounded`, records CPU time, RSS peak and
  wall for three runs in core and in a fixture export, and writes
  `docs/evidence/WO-229/structural-need.json`; the decisions file states
  the right-sized request per task against the recorded capacity. The
  request changes only when the measurement meets criterion 5's bound, with
  the regression WO-217-D040 asked for (a short document gate's wait bounded
  while a complete gate continues admitting work). Rejected: resizing on the
  architecture record's proposal without the measurement (axis: admission
  semantics change; D040's reopening condition asks for evidence); a fair
  queue (axis: D040 declined it and its reopening is a client migration,
  not this order).

**Deliverables:** the relation label and the longer WAIT line; the summary
figure, the row object and the timeline split; the condition's two medians,
the `contended` flag and the snapshot; `harness lanes`; the measurement
record and its decision; fixtures; the product 07 and architecture-record
sentences.

**Acceptance criteria (all required)**

1. With two fixture checkouts sharing a temporary registry, a gate waiting
   behind the other's full-capacity lease prints a WAIT line whose holder
   carries `another checkout`, a nested holder of its own carries `this
   checkout`, a record without `worktree` carries `checkout unknown`, and no
   WAIT line, summary line or recorded row contains either checkout's path
   (host-guard and runner fixtures).
2. The gate summary line appends the lane wait as an interval union split by
   relation, and the recorded row's `hostLaneWait` holds `wallMs`,
   `byRelation` and `holders` with no path; `gateCriticalPath` reports
   `laneWaitMs` and `gapMs` whose sum equals the old `waitMs`; a reused task
   carries none of the new fields (runner and gate-deadline fixtures;
   `npm test -- --only plan-refutation` for the reuse strip).
3. `plan conditions --slow` reports, for the document gate, the wall-clock
   median, the execution-only median and per-sample `contended`, reading
   each sample's recorded row; the host context lists holders by relation;
   with an injected contended sample the execution-only median excludes the
   wait and the sample is marked; `holds` reads the figure the decisions
   file names (plan-refutation fixtures).
4. `node scripts/harness.mjs lanes` prints the recorded capacity and the
   live holders (relation, task, slots, age, nested, owner alive) without
   writing a record, deleting a record or taking the lock, and prints no
   path; the usage string names it (host-guard fixture).
5. `docs/evidence/WO-229/structural-need.json` holds three runs per
   structural task and `kit-verify` in core and in a fixture export (CPU
   time, RSS peak, wall) and the decisions file states each task's
   right-sized request against the recorded capacity. If any task's
   measured need is under half the capacity, that task's host request is
   sized to the measurement, local exclusivity kept through the local lanes,
   and a fixture shows a document gate's total lane wait bounded (under the
   complete gate's longest single task) while a complete gate runs in a
   sibling fixture checkout; otherwise the requests are unchanged and the
   decision says why.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; the re-mints of step 10 recorded; product 07
   and the architecture record's sentences updated in place.

**Preflight:** `npm test -- --only host-guard` for steps 2, 7 and 8;
`npm test -- --only runner-fixtures` and `npm test -- --only gate-deadlines`
for steps 3, 4 and 9; `npm test -- --only plan-refutation` for steps 5 and
6; `npm test -- --only configuration-root` for every script step; `npm test
-- --only evidence-sources` and the edition suites for step 10; `npm run
test:docs` when a document changes; each under `node scripts/harness.mjs
bounded --` for the steps that edit their declared sources; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `926b8234`, 2026-10-21):**

1. `docs/evidence/WO-229/README.md` (new): at the base, a WAIT line and a
   summary line from two fixture checkouts sharing a temporary registry,
   the recorded row's fields, `plan conditions --slow`'s document row and
   the `harness` usage string, each with the command run. Check: the README
   names the base behavior.
2. `scripts/lib/host-lanes.mjs`: the observation mapping (257 to 285) adds
   `relation` (`realpath` comparison with the waiter's `worktree`, `unknown`
   when the record has none); the default `onWait` (133 to 136) prints it
   per holder; no path is printed. Check: `npm test -- --only host-guard`.
3. `scripts/test-runner.mjs`: the check row (3372 to 3471) gains
   `hostLaneWait` computed from `taskRows` as the Design's interval union
   by relation; the summary (3575 to 3577) appends the figure when it is
   above zero; `scripts/lib/gate-timeline.mjs` splits `waitMs` into
   `laneWaitMs` and `gapMs`; `scripts/lib/gate-reuse.mjs` (252 to 273)
   strips the new per-task and gate fields. Check: `npm test -- --only
   runner-fixtures`; `npm test -- --only gate-deadlines`.
4. `scripts/test-runner.test.mjs` and `scripts/test-gate-deadlines.mjs`:
   the cases of criteria 1 and 2 (two fixture checkouts, the union
   arithmetic for two overlapping waits, the reuse strip). Check: the same
   suites.
5. `scripts/lib/planning-conditions.mjs` (344 to 371): after each `--slow`
   sample, read the child's latest `npm run test:docs` row from its
   `checks.json`; record `hostLaneWait`; the row reports `wallMedianS`,
   `executionMedianS` and `samples[].contended`; `holds` reads the figure
   named in `docs/evidence/WO-229/decisions.md` (D001, written before this
   step); the host context (409 to 414) and the render (551) carry the lane
   snapshot by relation. Check: `npm test -- --only plan-refutation`.
6. `scripts/test-plan-refutation.mjs`: criterion 3's cases with an injected
   contended sample. Check: `npm test -- --only plan-refutation`.
7. `scripts/lib/host-lanes.mjs`: `readHolders(directory)` (no lock, no
   delete, the process table read as `laneHolderAlive` reads it);
   `scripts/harness.mjs`: `lanes` prints the capacity and the holders as
   criterion 4 states, with the transient-state caveat; the usage string
   names it. Check: `npm test -- --only host-guard`.
8. `scripts/test-host-guard.test.mjs`: criterion 4's case (a seeded
   registry; the directory byte-identical after the read). Check: the same
   suite.
9. The measurement: `scripts/measure-lanes.mjs` (new, or `measure-gates.mjs`
   extended) runs each structural task and `kit-verify` alone under
   `node scripts/harness.mjs bounded --`, three times, in core and in a
   fixture export, writing `docs/evidence/WO-229/structural-need.json`
   (task, run, cpuMs, rssPeakBytes, wallMs, capacity); the decisions file
   records the right-sized request per task (D002). If criterion 5's bound
   is met: `scripts/test-runner.mjs` (2224 to 2257) requests the recorded
   size for those tasks, keeping the local all-lanes exclusivity, and
   `scripts/test-gate-deadlines.mjs` gains the bounded-wait fixture (a
   document gate beside a complete gate in a sibling fixture checkout).
   Check: `npm test -- --only runner-fixtures`; `npm test -- --only
   gate-deadlines`.
10. Re-mints: `npm run build`; point `docs/evidence/current.json` at WO-229
    revision 001 for each kind `scripts/lib/gate-reuse.mjs` stales (every
    minted edition); `npm run sync`; `node scripts/feedback-evidence.mjs
    --carry <the feedback edition selected at the base> --edition WO-229
    --revision 001`. Check: `npm test -- --only evidence-sources` and each
    edition's suite.
11. Write-backs, in place, each heading re-read at the base: product 07
    §Preflight before the full gate (the registry paragraph at 3146 to 3152
    gains the relation label, the summary figure and `harness lanes`; one
    sentence that the condition reports both medians), the Host resources
    bullet (the wait figure's place); `docs/architecture/gate-execution.md`
    lines 84 to 86 (the wait claim made exact: `laneWaitMs` apart from
    `gapMs`) and 176 to 179 (the measurement's result and decision);
    `scripts/kit/README.client.md` §What runs here, and what does not (one
    sentence: a long wall-clock with short tasks is a lane wait the summary
    now attributes; `harness lanes` reads the holders);
    `docs/evidence/WO-229/decisions.md` with D001 (the `holds` figure), D002
    (the right-sized requests) and one decision per step; `npm run meta`;
    `npm run publication:check`. Handoff: `npm run format`; `npm run
    test:docs`; `npm test -- --review`; complete
    `docs/evidence/WO-229/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the paired controls of steps 4, 6
and 8 recorded in `docs/evidence/WO-229/controls.json`; the measurement
record; `npm run test:docs`; `npm test -- --review`. No live model run.

**Write-back duty:** criterion 6 and step 11.

**Known issues and carry-ins:**

- The fork's WAIT lines, recorded rows and registry listing were not read;
  that its waits came from another checkout is inferred from the holder
  names (core product tasks its selection cannot schedule) and the
  registry's design, and the fixture of criterion 1 reproduces the
  mechanism. Reopen when the fork's `harness lanes` output during a WAIT
  shows only `this checkout` holders.
- Records written by clients before WO-222 may lack `worktree`; they label
  `checkout unknown`. Reopen when such a client is still observed after the
  starter carries this order.
- The 300 s `--slow` budget still turns a long contended run into
  `unavailable`; this order marks the contention when the row exists and
  does not retry. Reopen when a pass's document condition is `unavailable`
  three passes running with `contended` samples.
- WO-217-D040's reopening (a compatible client migration showing a bounded
  short-gate wait) is not this order's; criterion 5's bounded-wait fixture,
  if the measurement allows the resizing, is evidence toward it and is
  recorded as such.
- The summary figure is derived from recorded intervals; a wait during the
  lane registry lock (the 30 s heartbeat phase) counts as wait with
  relation `unknown`.

**Non-goals:** a fair admission queue or any change to admission order
(WO-217-D040); printing or recording a checkout path; a per-checkout
capacity (WO-185-D015); changing the local scheduler's serial structural
phase; a resident scheduling service; the Codex or Copilot hook paths.

**Operator-review assumptions**

1. The operator wants to know whose gate a wait belongs to before the
   platform changes how gates are admitted.
2. Showing both the wall-clock and the execution-only figure is preferred
   to choosing one, with the condition's judged figure recorded.
3. Request sizing follows the measurement; if the structural tasks need
   the capacity, the requests stay.
