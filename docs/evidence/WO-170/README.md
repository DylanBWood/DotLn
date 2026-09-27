# WO-170 implementation evidence

Recorded 2026-09-27 for `resume: next` by the executor session (Claude Code,
`claude-opus-5-5`, effort xhigh). This is the executor's result, ready for
independent verification; it is not a verification verdict or a final review.
Local paths are written as `<worktree>`, `<main checkout>` and
`<session-scratch>`.

## What changed

| Item | Change | Decision | Fixture |
| --- | --- | --- | --- |
| 1 | `release prepare` writes `docs/evidence/WO-NNN/meta.json`, the order's own row within 8 KB, beside the meter block and from the same collection, only in a checkout holding a session journal of the order and only while the order is open; otherwise it prints why. `meta --write …/meta.json` writes the same row under the same conditions | D001, D002 | `release_case_prepare_independent` in `scripts/test-release.sh`; `WO-170 the order's snapshot is its own bounded row, written only where its journals are` |
| 2 | For a closed order the meter reads journal values from its snapshot row, otherwise unavailable, never from a later session's journal or usage activity; a correction count from no journal is `null` | D003 | `WO-170 a closed order's snapshot stands for its journals, and with neither they read unavailable`; `WO-141 meter retains only journal-derived historical correction counts` (now `null`) |
| 3 | Usage by role from this checkout, then the snapshot, then the retained usage copies (read without following links, a torn line skipped and named), each role's source named; one unknown dispatch keeps the total unknown; the last recorded observation of a dispatch wins whatever order the copies are read in (repair, VER-001 F1) | D004, D017 | `WO-170 a retained usage copy supplies the order's tokens by role and names its source`; `WO-170 the latest retained observation of a dispatch wins past preservation's tenth collision` |
| 4 | `operatorDirections`: control-prefixed and legacy operator dispatches and the three off-ramp events, a table column, a shifting-the-burden indicator and directions list, and `closedDirections` for every closed order; intake captures per ledger planning pass beside it | D005, D006, D013 | `WO-170 operator directions equal a hand count of committed decisions and off-ramp events` |
| 5 | One recovery: 77 snapshots of usage totals by role; 76 name their copy's SHA-256, and WO-067's copy, which holds five planning rows it does not carry, is listed without one | D007 | `WO-170 recovery carries usage totals by role and each retained copy's digest, keeping a whole-meter row`; [recovery.json](recovery.json) |
| 6 | The prune reads a copy's digest only from `usageCopies` (FUP-50cda1c03ecd8ea8) | D008 | `WO-171 a lane holding a usage copy is retained until a committed snapshot carries it` (new case) |
| 7 | Product 07 in place (+40 bytes), v0.52.8, publication locks | D010, D011 | `npm run test:docs`, `npm run publication:check` |

## Acceptance criteria

1. **Snapshot written where the journals are, and only there.** The release
   case runs `release prepare --local` in a fixture worktree: with no journal it
   prints `Meter snapshot not written: this checkout holds no session journal
   of WO-099.` and no `meta.json` exists; after one journal of WO-099 (and one
   row of another order) it lists `docs/evidence/WO-099/meta.json` beside
   `PR.md`, prints its size, the file is at most 8,192 bytes and holds only
   WO-099's row with one guard refusal, one Stop refusal and one correction.
   The process-debt fixture writes the heaviest row the meter holds (six roles,
   every per-role value, 24 named units) within the bound, reads it back as
   the order's row after the journals are deleted, and runs `meta --write`,
   which refuses a closed order and a checkout without a journal.
2. **Snapshot or unavailable on a checkout without the journals.** With a
   snapshot and a closed order the meter reports its guard refusals, Stop
   refusals, corrections, commands, steps, bytes read and read-obligation bytes;
   with neither, each is `null` (a release-close journal and usage row of the
   order are present and ignored), `operatorCorrections` is `null` with source
   `unavailable`, and the table cell reads `unavailable`.
3. **Retained usage copy.** 154 tokens from two copies (the collision name
   included, another file ignored), per role, with `source.usage` naming the
   copies; per-role precedence and an unknown dispatch are covered. After the
   repair, eleven observations of one dispatch preserved through
   `.from-WO-999-10` give 200 tokens in both readers, not 190 (D017).
4. **Directions.** Two `scope expand:`, one `operator override:` and one
   `RecordCorrected` give 4; an order with none gives 0; the table column, the
   text line, the shifting-the-burden indicator and its directions list carry
   it. The committed cost table is not regenerated (D009): its traps are
   `trapRows`', which carry the series. Every closed order's count is in
   `closedDirections` and one text line of `npm run meta`.
5. **This order's own figures and the recovery.** See below.
6. **Write-backs.** Product 07 in place (D010); decisions D001 to D018; the two
   provenance rows stay allocated for the final review to retarget (D011).
7. **Gates.** See Validation.

## This order's snapshot and the five orders' directions

`npm run release -- prepare --local` in `<worktree>`, after the passing gate,
wrote `docs/evidence/WO-170/meta.json` (2,893 bytes) and the meter block of
[PR.md](../../final-reviews/WO-170/PR.md) from one collection at cutoff
2026-09-27T21:52:35.355Z; the block's WO-170 row and the snapshot hold the same
figures (gate 1,269,473 ms over two runs, 44,212 tokens observed at entry,
1,019 declared prompt tokens, 0 corrections, 0 directions). The repair's
`release prepare`, after its passing gate, replaced both at cutoff
2026-09-27T22:38:58.679Z: 3,264 bytes, the same figures in the snapshot and
the block's WO-170 row (gate 2,553,658 ms over four runs, 80,299,138 tokens:
executor 74,298,993 and verifier 6,000,145, 1,019 declared prompt tokens,
2 corrections, 0 directions). The two corrections are the implementation
session's two `HedgedQuantityObserved` journal events, recorded after its
prepare. The final review's `release prepare` replaces both again.

Directions as `main` computes them (`closedDirections` from `collectMeta` on
the main checkout at `cb526f1d` with this order's library): WO-070 0, WO-115 0,
WO-165 0, WO-085 2, WO-166 2. Across the record at `main`: 871 decisions,
`scope expand:` 17, `operator override:` 3, legacy operator labels 51, no
off-ramp event
([D005](decisions.md#wo-170-d005--what-counts-as-an-operator-direction)).

## Recovery

One run of `<session-scratch>/recover.mjs <main checkout>` from `<worktree>`
(the script imports `recoveredUsageSnapshot`, `retainedUsageCopies`,
`snapshotText` and `SNAPSHOT_BYTES` from `scripts/lib/meta.mjs` and
`readControl`, and for each closed order with a retained usage copy writes
`snapshotText(recoveredUsageSnapshot(main, order, prior, now, priorPath))`,
where `prior` is the order's existing `meta.json` or `meta-baseline.json`):
77 snapshots, 2,262 usage rows, largest 3,550 bytes; 37 closed orders without a
copy; WO-067's copy listed as uncarried (15 of its 20 rows are WO-067's; its
snapshot was regenerated with the same recovery time after the review); all in
[recovery.json](recovery.json) and
[D007](decisions.md#wo-170-d007--the-one-recovery-77-retained-copies-37-closed-orders-without-one).
The lanes' creation times all precede the activation (20:29:23Z). An
independent read-only replay of the meter's usage rule over the same copies
gave the same 2,262 rows and WO-166's per-role totals (executor 52,837,626,
verifier 29,743,726, reviewer 23,365,473).

## Repair of VER-001

`resume: fix`, 2026-09-27, by the executor session (Claude Code,
`claude-opus-5-5`, effort xhigh).

- **F1** ([D017](decisions.md#wo-170-d017--repair-the-last-recorded-observation-of-a-dispatch-wins-whatever-the-read-order)):
  `latestUsage` orders an order's rows by `recordedAt`, then
  `observation.observedAt`, before the latest row of each dispatch replaces
  the earlier ones, so the lexical order of the retained copies no longer
  decides which observation wins. The new fixture drives
  `recordUsageObservation` and `reconcileWorktreeMaterial` eleven times:
  `recoveredUsageSnapshot` gives 100 to 200, certifies 11 copies, and
  `collectMeta` reports 200 from the retained copy. With the sort replaced by
  a no-op the same fixture reports 190, VER-001's figure. Every retained row
  in the main checkout (2,262) and in its own usage file (251) carries a
  parseable, non-decreasing `recordedAt`. The 77 committed recovered
  snapshots recompute to the same `usageByRole` and `usageCopies`.
- **N1** ([D018](decisions.md#wo-170-d018--repair-the-evidence-names-the-legacy-rows-that-keep-their-journal-values)):
  the Limits paragraph below names WO-043, WO-049 and WO-126 as the rows that
  keep their earlier journal values.

## Review before the gate

Four read-only reviewers and one skeptic read the change before the gate
([D012](decisions.md#wo-170-d012--review-before-the-gate-and-what-it-changed)).
The skeptic confirmed six defects, all fixed with fixtures: the cost
reconciliation's "historical metrics undefined" for usage-only snapshots,
WO-067's partly carried copy, a prepare-time token total standing in for an
unknown dispatch, a closed order's commands and steps taken from release-close
usage, `meta --write` rewriting a closed order's snapshot, and five directive
`Operator resume:` dispatches left uncounted. Six smaller changes it judged
not defects in today's data are kept as hardening, each with a fixture.

## Validation

- `npm test -- --review`, first run 2026-09-27T21:40:14Z: 33 passed, 1 failed
  (configuration-root: a literal `docs/intake/` pattern), 637.02 s. Fixed
  ([D013](decisions.md#wo-170-d013--the-first-review-gate-failed-on-a-literal-document-root)).
- `npm test -- --review`, 2026-09-27T21:52:00Z: **34 passed, 0 failed,
  632.45 s, 78 fresh tasks, exit 0**, code identity
  `cde8bad3efaaedb33a5a07bebdf0b08b3846a9e720268c4fd669d1f02a3f9e7d`,
  including `process-debt`, `meta`, `harness-fixtures`, `configuration-root`,
  `release`, `runner-fixtures` and `registrations`.
- The whole `scripts/test-process-debt.mjs` before the review fixes: 109 of 109.
- [fixtures.txt](fixtures.txt): the WO-170 and WO-141 meter tests (8 of 8), the
  WO-171 prune tests (9 of 9), the release preparation case and the
  configuration-root suite (13 of 13), after the gate.
- Repair of VER-001: `npm run test:docs` 23 passed, 0 failed, 12.74 s;
  `npm test -- --review`, recorded 2026-09-27T22:38:28Z: **34 passed, 0
  failed, 640.10 s, 78 fresh tasks, exit 0**, code identity
  `99f38f8f7c99243b2f14f8761ac6fa79972292c44b5f8bcae9c9fece5529c761`; the
  meter fixtures 9 of 9 and the WO-171 prune tests 9 of 9 after it
  ([fixtures.txt](fixtures.txt)).
- `npm run test:docs` after the evidence was written: 23 passed, 0 failed,
  12.80 s. `npm run publication:check`, `node scripts/meta.mjs --check`,
  `git diff --check` and `prettier --check scripts/` pass. No dependency is
  added, the diff adds no suppression, and no registered evidence source is
  edited (`scripts/lib/evidence-sources.mjs` names none of the changed files).

## Process cost

`node scripts/harness.mjs usage <session>` at 2026-09-27T21:53:10Z, source
`claude-transcript-message-usage`, scope dispatch: 64,112,459 tokens
(input 390, cached input 63,350,041, cache write 506,022, output 256,006;
reasoning and USD unavailable), 213 steps, 171 commands; 9 of 20 subagents,
exact-observed. The two workflows reported 601,583 and 964,739 subagent tokens,
outside that transcript count. At entry the same readback gave 44,212 tokens.

Repair of VER-001: the same readback at entry (2026-09-27T22:20:37Z) gave
84,107 tokens and at handoff (2026-09-27T22:41:26Z) 10,846,467 (input 170,
cached input 10,641,969, cache write 155,763, output 48,565; reasoning and USD
unavailable), 95 steps, 70 commands; 0 of 20 subagents, exact-observed.

## Limits

A snapshot is written at `release prepare`; usage recorded after it (the
reviewer's own, typically) is in the retained copy, which the snapshot
outranks (D004), and a prepare-written snapshot cannot name the copy
`worktree finish` makes later, so later orders' lanes stay retained until the
refresh FUP-dc6c139003bd4b89 holds. Journal-derived values of orders closed
before this one are unavailable and only their usage was recovered (the
order's non-goal), except WO-043, WO-049 and WO-126: each keeps the metrics of
its earlier whole-meter row (WO-043's 11 guard refusals, for example), which
the meter reads under the source label `earlier whole-meter row …; its
corrections are not journal counts`, so their correction counts stay
unavailable (D003, D007, D012 item 7). The direction count reads what the
record publishes; a direction given only in chat is not counted. Added at the
final review
([D019](decisions.md#wo-170-d019--final-review-passes-and-records-that-the-direction-count-reads-agent-written-labels)):
a decision's `dispatch` field is the dispatched agent's paraphrase, so a
direction the agent filed under a `resume:` label is not counted either (165
such labels name the operator at `main`); the count is a lower bound.
