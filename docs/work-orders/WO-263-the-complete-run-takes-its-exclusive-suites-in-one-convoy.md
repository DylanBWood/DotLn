# WO-263 — The complete run takes its exclusive suites in one convoy: the queue drains heavy work for them once instead of once per suite, the longest target-worktree file starts first, and WO-222's overlap lever is reassessed against the run it was meant to shorten

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** patch. The runner's queue order for exclusive
rows and one row's file order; no suite, assertion, deadline or admission
limit changes; no instance action. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/test-runner.mjs` (`expandSuiteTasks`), one
shared priority for the exclusive rows, and in the `target-worktree` row a
changed file order; one ordering case in `scripts/test-runner.test.mjs`; two
fresh complete review runs paid by the executor as the same-source
comparison product 07 requires of a scheduling change (about 50 minutes
before and an unmeasured time after, on this host's seven-row series of
40.2 to 53.9 minutes); product 07 and the decisions. Removes, by the reading
below, one of the two or three separate drains a complete run pays today
(6.9 and 7.2 minutes in the row read) and about two minutes of the
target-worktree group's tail; the measured before and after go in the
decisions and are not a criterion. Tokens and wall-clock: unknown until this
order's handoff records them. Re-mints: none; `scripts/test-runner.mjs` is a
declared source of the `runner-fixtures` machinery suite, so the final
criterion names `npm test -- --review`. Steps: the executor's, below.
**Nomination provenance:** the operator's dispatch of 2026-11-08 (ignored
capture SHA-256
`a0fe7ccd9a08aa47c2a61fb80aecfc290248c7a1024a9b6cbfd53574914fd111`), item 4
(efficiencies);
[WO-222-D015](../evidence/WO-222/decisions.md)'s reopening condition (a
later pass's complete-run median above 2,538,373 ms), met by this pass's
reading of seven fresh rows at a median of 2,747 s; the cold-gate candidate
(FUP-e96221b106cd136a), deferred on 2026-10-31 for want of a named cause,
which this pass's reading names.
**Depends on:** WO-221 and WO-222 (closed: the priority leads, the light
classification and the overlap lever this order reorders and reassesses);
WO-244 (active) and WO-260 (open): both edit other parts of
`scripts/test-runner.mjs` first.
**Recommended placement:** fifth, after WO-262. It shortens every later
order's final review and stops nothing today, so it follows the three
orders on the operator's laptop path.
**Cites (read these sections):** `scripts/test-runner.mjs`
(`suitePriorityLeads`, `expandSuiteTasks`, `explicitlyIsolated`,
`overlapSlots`, `reservedSlots`, `lightSuiteNames`, and in the scheduling
loop `canJoin` and the head check that stops admission for an isolated
row); `scripts/lib/gate-scheduling-baseline.json`; product 07 §Preflight
before the full gate (the scheduling paragraph and the same-source rule);
[WO-221-D018](../evidence/WO-221/decisions.md) (why failed and changed
suites lead); [WO-222-D015](../evidence/WO-222/decisions.md) and D019 (the
overlap lever and the light peers); WO-242-D021 and WO-258-D029 (why
`sync-fixtures` runs alone).

**Objective:** A complete review run stops paying a separate drain for each
exclusive suite. Its four exclusive rows run as one convoy, placed by the
strongest lead any of them carries, so heavy work drains for them once; a
suite that failed last still starts first; and the run's time before and
after is on record.

**Observed gap (dated 2026-11-08 at `main` `13e8d47eb`, v0.122.0):**

- The series. This checkout's gate index holds seven fresh passing complete
  review rows from 2026-11-06 to 2026-11-08, with walls of 45.3, 45.8,
  44.2, 51.7, 53.9, 40.2 and 50.0 minutes: a median of 45.8 minutes
  (2,747 s) on a host with eight lanes. A sweep over each row's task
  timeline finds 24.1 to 42.3 of those minutes with at most three tasks
  running and 18.1 to 25.2 with at most one. The index is local and
  ignored; the numbers are this pass's observation of it.
- The cause, read in the code and checked against the row of
  2026-11-08T02:37Z. `expandSuiteTasks` gives an exclusive row priority 200
  and every other row 0 or 80, then adds `suitePriorityLeads`' lead (failed
  3000, changed since the last gate 2000, changed on the branch 100).
  `harness-fixtures`, `sync-fixtures`, `process-debt` and
  `worktree-integration` are exclusive, so each ends up wherever its own
  lead puts it. In the scheduling loop, when the highest-priority unblocked
  row is isolated and cannot join the tasks already running, admission
  stops until they finish; an exclusive row can join only light tasks, and
  only light tasks can start beside it. In that run three heavy rows
  started at minute 2.9, `harness-fixtures` then waited for the last of
  them until 10.1, two launchpad files and `plan-refutation` started at
  19.5, `sync-fixtures` then waited until 26.4, and the remaining heavy
  files (target-worktree, vertical and four suites) started only at 36.6,
  after the last exclusive row. The two waits are 7.2 and 6.9 minutes with
  one to three tasks running.
- Two recorded conditions. WO-222-D015 says to revert its overlap lever and
  reassess the levers together when a later pass's complete-run median
  rises above 2,538,373 ms; the series above is at 2,747 s. WO-221-D018,
  which set the lead ordering on the operator's direction so that a stale
  assertion fails within minutes, reopens when the ordering lengthens a run
  by more than the exclusive convoy it displaces; the two waits total 14.1
  minutes against a convoy of 19.6, so that condition is not met and the
  leads stay.
- The target-worktree group runs two files at a time in declared order
  (start, publish, close, release). The close file is the longest (9.1
  minutes in that row) and starts third, so the group spans 13.1 minutes
  where close-first would span about 11.2. The launchpad row already
  declares its longer file first for this reason.
- The thirty-day plain-gate reading that the cold-gate row's last
  disposition watched (above 600 s) reads 1,134 s today from one sample of
  2026-10-24; it is not a median of anything recent and is not this
  order's evidence.

**Design (scope discipline):**

- The exclusive rows share one priority, the highest any of them would
  have carried, so the queue takes them back to back with their light
  peers and heavy work drains for them once. A heavy row whose lead is
  above the convoy's (it failed last and no exclusive row did) still
  starts before it, which keeps WO-221-D018's fast failure. Rejected:
  putting the convoy above every lead (the axis is feedback: a failed
  heavy suite would then wait about twenty minutes behind suites that did
  not fail). Rejected: admitting heavy rows during a drain (the axis is
  what the reservation protects: an exclusive row's deadlines were measured
  with only light peers).
- No reservation changes. `sync-fixtures` keeps the whole host
  (WO-242-D021, WO-258-D029), and the three overlap rows keep two light
  peers unless the reassessment below removes one. Rejected: raising the
  target-worktree group's limit (the axis is risk: its close file already
  takes most of its deadline at two files wide).
- WO-222-D015's instruction is carried out as a reading, not a reflex: the
  after row shows whether light peers ran beside each overlap row. A row
  beside which none ran in either comparison row loses its `overlap`; a
  row that used it keeps it, with the row cited.
- The evidence is the same-source comparison product 07 requires of a
  scheduling change: one fresh complete review run before the change and
  one after, at trees that differ only by this order's change, both
  passing, with no outer deadline hit and no memory kill.

**Execution plan (the executor follows these steps in order; observed at `13e8d47eb`, 2026-11-08):**

1. Before any edit, run one fresh complete review run (`npm test --
   --review --fresh`) at the activation base in the order's worktree and keep its gate row's wall, its task
   timeline and its `scheduled first:` line under
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
3. `scripts/test-runner.mjs` (the `target-worktree` row): declare
   `scripts/test-target-worktree-close.mjs` first, the other three files in
   their present order; the runner test that names the launchpad row's file
   order gains the same assertion for this row. Check: `npm test -- --only
   runner-fixtures` and `npm test -- --only target-worktree`.
4. Run one fresh complete review run (the same command) on the candidate and keep the same
   three readings under `docs/evidence/WO-263/after.json`. From the two
   rows, record in the decisions the walls, the minutes with at most three
   tasks running, and for `harness-fixtures`, `process-debt` and
   `worktree-integration` whether a light peer ran beside each; remove
   `overlap` from a row beside which none ran in either row, and run
   `npm test -- --only runner-fixtures` again if one is removed.
5. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: product 07 §Preflight before the full gate (the
   scheduling paragraph: the exclusive rows' shared priority and the
   target-worktree file order, beside the launchpad sentence);
   `docs/evidence/WO-263/decisions.md`, which answers WO-222-D015's
   condition and leaves WO-221-D018's leads in force. Then the handoff
   sequence of product 07 §Discipline, with the review ladder's findings
   judged as §Verification review and attack states.

**Deliverables:** the shared priority with its ordering case; the
target-worktree file order with its assertion; the two comparison rows and
the reassessment; the write-back and the decisions.

**Acceptance criteria (all required)**

1. In `scripts/test-runner.test.mjs`'s ordering case, `expandSuiteTasks`
   returns the exclusive rows adjacent to one another, ahead of a heavy row
   that changed since the last gate when an exclusive row carries that lead
   too, and behind a heavy row that failed last when no exclusive row
   failed. Check: `npm test -- --only runner-fixtures`.
2. The expanded `target-worktree` group lists the close file's task first,
   and `npm test -- --only target-worktree` passes.
3. `docs/evidence/WO-263/before.json` and `after.json` each hold a passing
   fresh complete review row's timeline, from trees that differ only in the
   files this order changes; in the after row no task that is neither
   exclusive nor light starts between the start of the first exclusive
   row and the start of the last.
4. Each of `harness-fixtures`, `process-debt` and `worktree-integration`
   either shows at least one light peer beside it in a comparison row,
   cited in the decisions, or no longer declares `overlap`.
5. Product 07 §Preflight before the full gate states the exclusive rows'
   shared priority and the target-worktree file order and links this
   order's decisions. Check: `npm run test:docs`.
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only runner-fixtures` for steps 2 to 4;
`npm test -- --only target-worktree` for step 3; the structural phase; the
two fresh complete review runs of steps 1 and 4 are this order's evidence,
and final review reuses the after row at an unchanged identity.

**Evidence gate:** under `docs/evidence/WO-263/`: `before.json` and
`after.json`; the reassessment of the three overlap rows; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 5 and criterion 5; sources and
reopening conditions in `docs/evidence/WO-263/decisions.md`.

**Known issues and carry-ins:**

- FUP-e96221b106cd136a (the cold-gate candidate): this order is its
  allocation for the ordering cut; its wider packing ideas stay with that
  row's history.
- The leads of the row read here are inferred from the order tasks
  started in; step 1's `scheduled first:` line confirms or corrects them,
  and a different cause found there is recorded before step 2 is written.
- One comparison pair shows a direction, not reliability under every host
  load; the decisions say so, as product 07 says of WO-115's pair.
- The before run costs a complete run that produces no change. It is the
  comparison's control: without it the after row's time has nothing at the
  same source to stand against.
- FUP-7b7e2e59a8ef2e06 (WO-225-D019, a timing-sensitive nested failure):
  if either comparison run meets that failure, the executor records it
  against that row.

**Non-goals:** any change to a suite's assertions, deadlines, memory
budget or reservation; `sync-fixtures`' exclusivity; the group limits;
`resume` as preflight; the light classification's thresholds; the leads'
values; packing beyond the convoy.

**Operator-review assumptions:** that total time of the complete run
matters more than the position of an unchanged exclusive suite in it, while
a suite that failed last keeps its lead; that two complete runs are an
acceptable price for a comparison the guide requires; that the series read
from this checkout's local gate index is representative of this host,
since no other host's rows are readable here; and that a negative result
(the after run no shorter, or a suite missing its deadline) is recorded with
its measurement and the order withdrawn with the change reverted, never
tuned until it passes, which is this order's fallback for a host whose load
the order cannot control.
