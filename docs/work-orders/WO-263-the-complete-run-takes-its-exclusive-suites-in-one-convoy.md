# WO-263 — The complete run takes its exclusive suites in one convoy and runs the largest on the lanes it holds: the queue drains heavy work for the exclusive rows once, the hook suite's cases run as concurrent shards inside its reservation, the longest target-worktree file starts first, and the pass's gate reading counts the runs the lifecycle makes

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** patch. The runner's queue order for exclusive
rows, one row's expansion into shards, one row's file order and one
reading of the planning conditions; no suite's assertions or deadlines
change; no instance action. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/test-runner.mjs` (`expandSuiteTasks`), one
shared priority for the exclusive rows, the expansion of the
`harness-fixtures` row into shard tasks and a changed file order in the
`target-worktree` row; one shard helper under `scripts/lib/` from which the nine files the hook
row loads take their `test`; cases in `scripts/test-runner.test.mjs`; in
`scripts/lib/planning-conditions.mjs`, the complete-run reading; two fresh
complete review runs paid by the executor as the same-source comparison
product 07 requires of a scheduling change (46.7 minutes in the committed
row of 2026-11-06 and 52.1 in that of 2026-11-09, so about 100 minutes);
product 07 and the decisions. Removes, by the reading below, one of the
two or three separate drains a complete run pays today (6.9 and 7.2
minutes in the row the 2026-11-08 pass read), about two minutes of the
target-worktree group's tail, and the single-process run of the hook
suite, which took 591 of a complete run's 2,801 seconds on 2026-11-06
while holding six of eight lanes; the measured before and after go in the
decisions and are not a criterion. Tokens and wall-clock: unknown until
this order's handoff records them. Re-mints: none;
`scripts/test-runner.mjs` is a declared source of the `runner-fixtures`
machinery suite, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`), item 4
(efficiencies);
[WO-222-D015](../evidence/WO-222/decisions.md)'s reopening condition; the cold-gate candidate (FUP-e96221b106cd136a) and its rows
(FUP-7d7c75dfd2d1026c, FUP-dc31f381950a0b45), whose
condition that the operator name gate time as a goal the dispatch of
2026-11-09 meets (ignored capture SHA-256
`7fba59d31bea0047abb5eb0d381e2f90f3d110dbaf81b6157511d6e320d5f4e7`, item 1,
second goal); [the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md),
which read the committed gate rows, kept the convoy and added the shards
and the reading.
**Depends on:** WO-221 and WO-222 (closed: the priority leads, the light
classification and the overlap lever this order reorders and reassesses).
No open order.
**Recommended placement:** second, after WO-262. It has no open
dependency, and each order after it pays several complete runs.
**Cites (read these sections):** `scripts/test-runner.mjs`
(`suitePriorityLeads`, `expandSuiteTasks`, `explicitlyIsolated`,
`overlapSlots`, `reservedSlots`, `lightSuiteNames`, the `group` and
`groupLimit` properties, and in the scheduling loop `canJoin` and the head
check that stops admission for an isolated row);
`scripts/lib/gate-scheduling-baseline.json`;
`scripts/lib/planning-conditions.mjs` (the plain-gate reading); product 07
§Preflight before the full gate (the scheduling paragraph and the
same-source rule); [WO-221-D018](../evidence/WO-221/decisions.md) (why
failed and changed suites lead);
[WO-222-D015](../evidence/WO-222/decisions.md) and D019 (the overlap lever
and the light peers); [WO-131-D014](../evidence/WO-131/decisions.md) (why
the hook suite is isolated); WO-242-D021 and WO-258-D029 (why
`sync-fixtures` runs alone);
`docs/evidence/WO-255/repair-003/complete-gate.json` (the committed row
read below).

**Objective:** A complete review run stops paying a separate drain for each
exclusive suite and stops running its largest exclusive suite in one
process on a reservation of six lanes. Its four exclusive rows run as one
convoy, placed by the strongest lead any of them carries; the hook suite's
cases run as shards inside its reservation; a suite that failed last still
starts first; and the run's time before and after is on record, in a
reading the next pass can take from the runs the lifecycle makes.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- Where a complete run's time goes. The committed row
  `docs/evidence/WO-255/repair-003/complete-gate.json` (2026-11-06) has a
  wall of 2,801 seconds for 44 tasks whose durations sum to 7,791 seconds,
  which eight lanes could hold in about a third of that wall. The four
  exclusive rows took 1,386 seconds of it: `harness-fixtures` 591,
  `sync-fixtures` 350, `worktree-integration` 303 and `process-debt` 142.
- The largest exclusive row is one process. The `harness-fixtures` row
  runs `scripts/test-harness.mjs` (182 cases of its own and 141 in seven
  test files it imports) and `scripts/test-drive.mjs` (74 cases) with a
  file concurrency of one, while `reservedSlots` holds
  six of eight lanes for it and admits two light peers. Most of its cases
  build their own repository through the file's fixture helper, which is
  called 137 times, and spawn the generated hooks against it.
- The series the 2026-11-08 pass read. Seven fresh passing complete review
  rows from 2026-11-06 to 2026-11-08 in this checkout's local gate index
  had walls of 45.3, 45.8, 44.2, 51.7, 53.9, 40.2 and 50.0 minutes, a
  median of 45.8, with 24.1 to 42.3 of those minutes at three tasks or
  fewer and 18.1 to 25.2 at one or none. The index is local and ignored;
  the numbers are that pass's observation of it.
- The drains, read in the code and checked by that pass against the row of
  2026-11-08T02:37Z. `expandSuiteTasks` gives an exclusive row priority
  200 and every other row 0 or 80, then adds `suitePriorityLeads`' lead
  (failed 3000, changed since the last gate 2000, changed on the branch
  100), so each exclusive row lands wherever its own lead puts it. When
  the highest-priority unblocked row is isolated and cannot join the tasks
  running, admission stops until they finish. In that run
  `harness-fixtures` waited 7.2 minutes for heavy rows to end and
  `sync-fixtures` 6.9, with one to three tasks running.
- The target-worktree group runs two files at a time in declared order
  (start, publish, close, release). The close file is the longest and
  starts third; the launchpad row already declares its longer file first.
- The reading passes take is blind to these runs. The plain-gate condition
  in `scripts/lib/planning-conditions.mjs` counts rows whose selection is
  `plain`; every run the lifecycle makes is a review run, so the condition
  read one sample from 2026-10-24 on 2026-11-09 (1,134 seconds), and its
  per-task rows still name a `target-worktree` task that the file split
  retired. The sequence's order-size rule still cites a full run of 24.9
  minutes.
- The run grew with its tests. WO-222's complete run measured 27.8 minutes
  on 2026-10-19; since that commit the test files gained 72,124 lines and
  lost 14,456 across 81 files, and the hook suite went from 122 cases to
  182 and gained the drive file's 74.

**Design (scope discipline):**

- The exclusive rows share one priority, the highest any of them would
  have carried, so the queue takes them back to back with their light
  peers and heavy work drains for them once. A heavy row whose lead is
  above the convoy's (it failed last and no exclusive row did) still
  starts before it, which keeps WO-221-D018's fast failure. The cost is
  stated: when one exclusive row changed and the others did not, the
  unchanged ones now run ahead of a heavy row that changed, which delays
  that row's result by the convoy's length. Rejected: putting the convoy
  above every lead (the axis is feedback: a failed heavy suite would wait
  behind suites that did not fail). Rejected: admitting heavy rows during
  a drain (the axis is what the reservation protects: an exclusive row's
  deadlines were measured with only light peers).
- The hook suite's cases run in shards. Every file the row loads takes its
  `test` from one helper, the row's two files and the seven test files
  `scripts/test-harness.mjs` imports at its top alike; the helper
  registers a case only when a hash of its title falls in the shard the
  environment names, and registers every case when the environment names
  none, so a single case still runs by its name under the bounded wrapper.
  The row declares its shard count as a property any row may carry;
  `expandSuiteTasks` turns it into tasks named `harness-fixtures:shard:<n>`,
  so the lead a failed or changed suite carries reaches every shard, and
  places them in one group whose limit is the shard count, inside the
  row's reservation. Every case is in exactly one shard by construction,
  and a new case needs no registration. Rejected: splitting the file into
  several by subject (the axis is cost: twenty thousand moved lines and
  every list that names the file, for the same schedule). Rejected:
  title patterns per task, as the vertical row uses for one class of
  cases (the axis is drift: a new case whose title matches no pattern
  lands in a remainder nobody sized).
- No reservation changes. `sync-fixtures` keeps the whole host
  (WO-242-D021, WO-258-D029), and the three overlap rows keep two light
  peers unless the reassessment below removes one. Rejected: raising the
  target-worktree group's limit (the axis is risk: its close file already
  takes most of its deadline at two files wide).
- WO-222-D015's instruction is carried out as a reading: the after row
  shows whether light peers ran beside each overlap row. A row beside
  which none ran in either comparison row loses its `overlap`; a row that
  used it keeps it, with the row cited.
- The evidence is the same-source comparison product 07 requires of a
  scheduling change: one fresh complete review run before the change and
  one after, at trees that differ only by this order's change, both
  passing, on a host with no other gate or session running, with no outer
  deadline hit and no memory kill.
- The pass's reading follows the lifecycle's runs: the complete-run
  condition takes fresh passing complete rows of either selection, each
  labeled with its selection, and a per-task row is read only for a task
  the newest complete row holds.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. Before any edit, run one fresh complete review run (`npm test --
   --review --fresh`) at the activation base in the order's worktree, on a
   host with no other gate or session running, and keep its gate row's
   wall, its task timeline and its `scheduled first:` line under
   `docs/evidence/WO-263/before.json`. Check: the row is passing and fresh
   (no suite reused).
2. `scripts/test-runner.mjs` (`expandSuiteTasks`): after the leads are
   added, give every exclusive row the highest priority any exclusive row
   holds, keeping their relative order. `scripts/test-runner.test.mjs`: one
   ordering case with leads that interleave today (an exclusive row changed
   since the last gate, a heavy row changed since the last gate, an
   exclusive row with the branch lead, a heavy row that failed last), and
   the existing ordering case's expectation updated with its cause and
   provenance named in the decisions. Check: `npm test -- --only
   runner-fixtures`.
3. A shard helper under `scripts/lib/` (new) exporting a `test` that reads
   the shard from the environment and registers a case only in its shard,
   and every case when no shard is named. `scripts/test-harness.mjs`,
   `scripts/test-drive.mjs` and the seven test files the first imports
   (`test-plan-first`, `test-plan-first-boundaries`, `test-dispatch-bound`,
   `test-fixture-temporary`, `test-temporary-roots`, `test-target-harness`
   and `test-observed-facts`): take `test` from the helper.
   `scripts/test-runner.mjs` (`expandSuiteTasks`, the `harness-fixtures`
   row and the source declarations that must name the new helper): a
   `shards` property on a row, expanded into tasks named
   `harness-fixtures:shard:<n>`, each with its shard in its environment,
   grouped under a limit equal to the count and sharing the row's
   reservation; the baseline's samples and the deadline are read by the
   row's name for every shard until a shard has samples of its own.
   `scripts/test-runner.test.mjs`: the case that pins the row's command
   takes the shard tasks' commands, with its cause named in the
   decisions. `scripts/test-runner.test.mjs`: a case that the expansion
   yields every shard once and that the shard tasks are admitted together
   while no task that is neither exclusive nor light starts beside them.
   Check: `npm test -- --only runner-fixtures` and `npm test -- --only
   harness-fixtures`, the second run three times in succession.
4. `scripts/test-runner.mjs` (the `target-worktree` row): declare
   `scripts/test-target-worktree-close.mjs` first, the other three files in
   their present order; the runner test that names the launchpad row's file
   order gains the same assertion for this row. Check: `npm test -- --only
   runner-fixtures` and `npm test -- --only target-worktree`.
5. Run one fresh complete review run (the same command, the same idle
   host) on the candidate and keep the same three readings under
   `docs/evidence/WO-263/after.json`. From the two rows, record in the
   decisions the walls, the minutes with at most three tasks running, the
   hook suite's span, and for `harness-fixtures`, `process-debt` and
   `worktree-integration` whether a light peer ran beside each; remove
   `overlap` from a row beside which none ran in either row, and run
   `npm test -- --only runner-fixtures` again if one is removed.
6. `scripts/lib/planning-conditions.mjs` (the plain-gate condition and its
   per-task rows): read fresh passing complete rows of the review
   selection as well as the plain one, label each sample with its
   selection, and read a per-task row only for a task name the newest complete row
   holds. The cases that assert this reading's rows are updated with it:
   those in `scripts/test-runner.test.mjs` that assert the condition's
   first row and the per-task identifiers, and the one in
   `scripts/test-launchpad-planning.mjs` that asserts a task row's verdict.
   Check: `npm test -- --only runner-fixtures`, `npm test -- --only
   launchpad-planning`, `npm test -- --only plan-refutation` and `npm test
   -- --only process-debt`.
7. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: product 07 §Preflight before the full gate (the
   scheduling paragraph: the exclusive rows' shared priority, the hook
   suite's shards and the target-worktree file order, beside the launchpad
   sentence) and §Operator-opened planning pass (what `plan conditions`
   reads); `docs/planning/sequence.md` (the order-size rule's figure, from
   the after row); `docs/evidence/WO-263/decisions.md`, which answers
   WO-222-D015's condition and leaves WO-221-D018's leads in force. Then
   the handoff sequence of product 07 §Discipline.

**Deliverables:** the shared priority with its ordering case; the shard
wrapper, the row's expansion and its case; the target-worktree file order
with its assertion; the two comparison rows and the reassessment; the
conditions reading; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. In `scripts/test-runner.test.mjs`'s ordering case, `expandSuiteTasks`
   returns the exclusive rows adjacent to one another, ahead of a heavy row
   that changed since the last gate when an exclusive row carries that lead
   too, and behind a heavy row that failed last when no exclusive row
   failed. Check: `npm test -- --only runner-fixtures`.
2. `expandSuiteTasks` returns one task for each shard of the
   `harness-fixtures` row, the scheduling case admits those tasks together
   with no task that is neither exclusive nor light beside them, and with
   no shard named in the environment `node --test --test-name-pattern
   <title> scripts/test-harness.mjs` runs the named case. Check: `npm test
   -- --only runner-fixtures`.
3. `npm test -- --only harness-fixtures` passes, and the evidence lists
   the titles declared by every file the row loads, the seven imported
   files included, beside the titles the shard tasks ran, each title run
   once and the two lists equal.
4. The expanded `target-worktree` group lists the close file's task first,
   and `npm test -- --only target-worktree` passes.
5. `docs/evidence/WO-263/before.json` and `after.json` each hold a passing
   fresh complete review row's timeline, from trees that differ only in the
   files this order changes; in the after row no task that is neither
   exclusive nor light starts between the start of the first exclusive
   row and the start of the last.
6. Each of `harness-fixtures`, `process-debt` and `worktree-integration`
   either shows at least one light peer beside it in a comparison row,
   cited in the decisions, or no longer declares `overlap`.
7. Given gate rows that hold one fresh passing complete row of the review
   selection and none of the plain selection, `npm run plan -- conditions`
   reports that row as the complete run's sample with its selection named,
   and reports no per-task row for a task name the row does not hold.
8. Product 07 §Preflight before the full gate states the exclusive rows'
   shared priority, the shards and the target-worktree file order and
   links this order's decisions. Check: `npm run test:docs`.
9. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures` for steps 2 to 5;
`npm test -- --only harness-fixtures` for step 3; `npm test -- --only
target-worktree` for step 4; `npm test -- --only runner-fixtures`, `npm test -- --only
launchpad-planning`, `npm test -- --only plan-refutation` and `npm test --
--only process-debt` for step 6; the structural phase; the two fresh complete review runs of
steps 1 and 5 are this order's evidence, and final review reuses the after
row at an unchanged identity.

**Evidence gate:** under `docs/evidence/WO-263/`: `before.json` and
`after.json`; the two title lists of criterion 3 and the three successive
results of step 3; the reassessment of the three overlap rows; the
conditions output of criterion 7; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 7 and criterion 8; sources and
reopening conditions in `docs/evidence/WO-263/decisions.md`.

**Known issues and carry-ins:**

- FUP-e96221b106cd136a (the cold-gate candidate) and the two rows that
  repeat its reading (FUP-7d7c75dfd2d1026c and FUP-dc31f381950a0b45): this
  order is their allocation for the ordering cut and the hook suite. The
  result memo per task keyed by its inputs (FUP-77efd30be6cab5c1) is
  declined again and deferred, not allocated here.
- The leads of the row read by the 2026-11-08 pass are inferred from the
  order tasks started in; step 1's `scheduled first:` line confirms or
  corrects them, and a different cause found there is recorded before step
  2 is written.
- A case of the hook suite that depends on another through shared state,
  or a deadline that fails when shards run together, is recorded with its
  title; the executor lowers the row's shard count until the three
  successive runs of step 3 pass, down to one, and records the count and
  the reason. One shard is today's schedule, and the order still delivers
  its other parts.
- One comparison pair shows a direction, not reliability under every host
  load, and the seven rows the 2026-11-08 pass read spread over 13.7
  minutes; the decisions say what the pair can and cannot show.
- The before run costs a complete run that produces no change. It is the
  comparison's control.
- `sync-fixtures` holds the whole host for one case that makes three full
  syncs (350 seconds on 2026-11-06). It is unchanged here; the 2026-11-09
  pass records it as a candidate.
- If `main` moves between the two comparison runs, the after run is taken
  on the candidate before it integrates `main`, and the integration's own
  run is the lifecycle's, not the comparison's.
- FUP-7b7e2e59a8ef2e06 (WO-225-D019, a timing-sensitive nested failure):
  if either comparison run meets that failure, the executor records it
  against that row.

**Non-goals:** any change to a suite's assertions, deadlines, memory
budget or reservation; `sync-fixtures`' exclusivity or its case; the group
limits; splitting a test file; `resume` as preflight; the light
classification's thresholds; the leads' values; a result memo or reuse of
a task's pass across identities; fail-fast.

**Operator-review assumptions:** that total time of the complete run
matters more than the position of an unchanged exclusive suite in it, while
a suite that failed last keeps its lead; that two complete runs are an
acceptable price for a comparison the guide requires; that the committed
row of 2026-11-06 and the local series the 2026-11-08 pass read represent
this host; and that a negative result (the after run no shorter, or a
suite missing its deadline at every shard count above one) is recorded
with its measurement and that part reverted, never tuned until it passes.
