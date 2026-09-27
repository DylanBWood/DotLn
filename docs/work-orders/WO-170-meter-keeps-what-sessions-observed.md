# WO-170 — The meter keeps what an order's sessions observed and counts the operator's directions: a bounded per-order snapshot is written while the journals exist, retained usage is read and recovered once for closed orders, an unread journal reads unavailable instead of zero, and directions per closed order form a series (v0.52.8)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. One file written by an existing command,
two more inputs read by the meter, one corrected label and one added
series; no control-event schema, gate step, journal format or contract
change. Assigned at activation under the standing opt-out default.
**Cost:** adds a per-order meter snapshot of at most 8 KB
(`docs/evidence/WO-NNN/meta.json`, the order's own row only) written by
`release prepare` in the worktree whose journals it summarizes; a read of
the usage copies `worktree finish` retains, and one recovery of their
totals by role into snapshots for the orders already closed (73 retained
copies, 2,141 rows, in the main checkout on 2026-09-27); a count of the
operator's
directions per order from the public record (decision dispatches that
begin with `scope expand:`, `operator override:`, `analysis:` or
`conversation only:`, the three off-ramp event types, and the number of
intake captures a planning pass cites, never their text); one column in
the meter table. Removes: twelve of the fourteen trap series reading null
or a false zero for the five orders closed on 2026-09-25 and 2026-09-26
(below); "tokens unavailable" on `main` for an order whose pull request
recorded them; the hand count a planning pass makes to answer how often
the operator had to step in. Re-mints: none, provided the reading stays in
`scripts/lib/meta.mjs` and `scripts/release.mjs`;
`packages/skeleton/src/correction-observation.mjs` and `observed-facts.ts`
are registered evidence sources and are not edited. Wall-clock, tokens and
context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's 2026-09-25 nomination (the
babysitting rate, measured; map item 5 of that pass) and the operator's
2026-09-27 answer, captured in ignored intake (SHA-256 in the ledger
section), which delegated the open decisions to the planner and admitted
later orders; register rows FUP-a33f893036882d16 (the babysitting rate)
and FUP-85562931791378d4 (session journals are discarded at teardown);
receipt 031's finding that WO-168's and WO-169's benefits cannot be read
from the supplied meter. Planner-synthesized. Opaque identifier, not a
priority. Clean-room screen: no stop condition; the count of intake
captures is a number and no capture is read.
**Depends on:** WO-126 merged (the meter and its snapshot option; closed);
WO-160 merged (the last edit of `release prepare`'s message; closed,
v0.51.0); WO-158 merged (the off-ramp event types; closed, v0.49.0).
**Recommended placement:** a one-entry slot directly after WO-164 and
WO-171. This order edits `scripts/lib/meta.mjs`, `scripts/meta.mjs` and
the `prepare` command of `scripts/release.mjs`; WO-169 edits one label in
`meta.mjs` and WO-164 edits the `list` command of `release.mjs`, so it
follows both closes and precedes WO-086, which rewrites what
`release prepare` writes at a collision. It lands before the operator's
next `harness prune --apply`, which WO-171 makes practical and which
would otherwise remove the usage copies this order recovers; WO-171
guards that case. It may run beside WO-162 or WO-163. A recommendation,
not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the process meter and its snapshot option"
  },
  {
    "workOrderId": "WO-160",
    "relation": "satisfied-by-close",
    "reason": "the last edit of release prepare's message"
  },
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the off-ramp event types the direction count reads"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/meta.mjs` (`collectMeta`;
`hookObservations`, which reads the checkout's own journals; `usageRows`,
which reads `local/process/usage.jsonl` only; the fallback to the order's
`meta.json`; the trap indicators; `renderMetaTable`); `scripts/meta.mjs`
(`--write`, `--plan-cost`); `scripts/release.mjs` (`prepare`, the meter
block it writes into the pull-request body);
`packages/skeleton/src/correction-observation.mjs` (`correctionCounts`,
read only); `docs/planning/cost-table.json` (the trap series);
`docs/final-reviews/WO-166/PR.md` (the meter block as the worktree saw
it); `docs/evidence/WO-126/meta.json` (a whole-meter snapshot, 96,881
bytes); `docs/planning/work-order-map.md` §Candidates — returns from the
standard pass (recorded 2026-09-25, second), items 3 and 5; the
[2026-09-27 planning document](../planning/onesie-twosie-followup-drain-2026-09-27.md)
§13 and §14.

**Objective:** the meter on `main` answers, for every order closed after
this one, what its sessions observed and how often the operator directed,
overrode or corrected the work, from a committed record; a value it could
not observe reads unavailable, never zero.

**Observed gap (dated 2026-09-27, `main` at `4c34b332`):**

1. The meter reads hook journals from the checkout it runs in. An order's
   journals live in its worktree and leave with it; for a closed order the
   meter falls back to `docs/evidence/WO-NNN/meta.json`, which
   `npm run meta -- --write` can produce. WO-043 and WO-126 have one
   (116,758 and 96,881 bytes, the whole meter); no order since has, and no
   lifecycle step writes it.
2. In the cost table of 2026-09-27 the five trap signals carry fourteen
   indicator series for WO-070, WO-115, WO-165, WO-085 and WO-166. Eleven
   are null for every order or for all but one; `operatorCorrections` is
   0 for all five; `machineryShare` and `gateStepCount` are the two that
   are measured.
3. That zero is not an observation. With no journal and no snapshot the
   meter calls `correctionCounts([])`, which returns a total of 0 labeled
   `session-journal`, and the meter's own legend says an unavailable
   observation is not zero.
4. `usageRows` reads `docs/control/local/process/usage.jsonl` of the
   checkout. `worktree finish` retains each order's copy under
   `docs/control/local/retained/WO-NNN/process/usage.jsonl`, which nothing
   reads: `main` reports WO-166's tokens as unavailable, and WO-166's pull
   request body records 82,672,267. The main checkout holds 73 such
   copies with 2,141 rows (executor 791, verifier 876, reviewer 458,
   release-close 11, planner 5); its own usage file holds planner,
   release-close and refuter rows only. The copies are local and ignored,
   and `harness prune --apply` lists their lanes for removal.
5. Nothing counts the operator's directions. The public record holds them:
   807 decision dispatches on 2026-09-27, of which 16 begin
   `scope expand:`, 3 `operator override:` and 13 an older `operator …`
   label; fourteen orders carry at least one, WO-085 and WO-166 among
   them. No `OperatorOverrideRecorded`, `RecordCorrected` or
   `CriterionWaived` event has been appended yet, so that part of the
   series starts at zero observed events, which is an observation.

**Design (scope discipline):**

- The snapshot holds the order's own row: its metrics, its corrections
  with their source, its usage totals by role and the direction count,
  within 8 KB. `release prepare` writes it beside the meter block it
  already renders, in the worktree, so the reviewer's record commit
  carries it. A later `prepare` in the same worktree replaces it; a
  snapshot is never written from a checkout that holds no journal of the
  order, and the command says so.
- The meter prefers, in order: live journals, the order's snapshot, the
  retained usage copy for usage alone; otherwise unavailable. A
  correction count computed from no journal reads unavailable.
- Recovery, once: for every closed order with a retained usage copy in
  the main checkout, the executor writes the order's snapshot with its
  usage totals by role and nothing else, reading the main checkout's
  lane from the worktree; an order without a copy is listed as
  unavailable in the decisions. The snapshots are committed with this
  order, so the totals survive a prune.
- `operatorDirections` is computed from committed files, so `main`
  computes it for every closed order without a snapshot; it is rendered
  beside `operatorCorrections` and joins the shifting-the-burden series.
  The dispatch prefixes are the four the docs check already requires;
  dispatches filed before that rule are counted when they begin with
  `operator`.
- The cost table carries the series for the orders it already lists; its
  64 KB bound stays.
- **Declined alternatives, recorded:** committing the journals (they hold
  command text and paths; the snapshot is the public summary); a snapshot
  of the whole meter per order (about 100 KB each); writing the snapshot
  at release close (the worktree may be gone, which is the defect);
  counting operator messages from chat or intake text (private; a count
  of captures a pass already cites is the most the public record
  carries); a threshold or refusal on the direction count (it is a
  measurement; a planning pass reads it).

**Deliverables:** the bounded snapshot and its writer; the two readers;
the corrected unavailable label; the direction count, column and series;
fixtures; the write-backs.

**Acceptance criteria (all required)**

1. In a fixture worktree with journals, `release prepare` writes
   `docs/evidence/WO-NNN/meta.json` of at most 8 KB holding that order's
   row; the same command in a checkout with no journal of the order
   writes nothing and says why.
2. In a fixture main with the snapshot and no journal, the meter reports
   the snapshot's guard refusals, stop refusals, corrections, commands
   and read bytes for the order; with neither, each reads unavailable and
   `operatorCorrections` is null, not 0.
3. With only a retained usage copy, the meter reports the order's tokens
   from it and names the source.
4. `operatorDirections` equals a hand count on a fixture order with two
   `scope expand:` decisions, one `operator override:` decision and one
   `RecordCorrected` event, and is 0, observed, on a fixture order with
   none; the meter table and the cost table's shifting-the-burden signal
   carry it.
5. This order's own pull-request body shows its snapshot's figures, and
   its final review records the direction count for the five orders
   closed on 2026-09-25 and 2026-09-26 as `main` computes it. A snapshot
   with usage totals by role exists for every closed order whose retained
   usage copy the main checkout held at activation, each within 8 KB, and
   the decisions list the orders for which none was available.
6. Write-backs land: product 07's meter sentences, edited in place within
   300 bytes; decisions; the register rows named in the provenance are
   retargeted at close.
7. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; no registered evidence source
   edited.

**Evidence gate:** the fixture transcripts; the snapshot this order's own
`release prepare` wrote; the direction counts of criterion 5;
`npm test -- --review` before `implementation-ready`, because
`scripts/lib/meta.mjs` is a declared source of machinery suites, and again
at final review. No live row.

**Write-back duty:** product 07, in place; decisions; the register rows.

**Non-goals:** recovering journal-derived signals for orders whose
worktrees are gone (their journals no longer exist; only usage totals are
recovered); retaining the journals themselves;
`manualCloseoutSteps`, `emergencyPasses`, `bypassTools`, `adHocScripts`
and `reAnnouncements`, which have no recorded source yet; any threshold on
the counts; the console board; the usage observer.

**Operator-review assumptions**

1. A direction is counted from what the record already publishes; the
   count says how often the operator stepped in, not whether the step was
   a fault.
2. A patch with no live row is right for a measurement whose criteria are
   fixtures and one observed snapshot.
