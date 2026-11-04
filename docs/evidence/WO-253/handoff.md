# WO-253 handoff

The executor's ledger for WO-253 (v0.115.0, minor), as repaired after
VER-001: each acceptance criterion judged on its own line with its evidence,
then the review ladders, the complete runs, the measurements the order asks
for, the observations recorded and not fixed, what stays untested, the
follow-ups, the actor attestation and the process cost. Decisions are in
[decisions.md](decisions.md): D001 to D012 from the execution, D013 to D021
from round 1's fixes, D022 and D023 from rounds 2 and 3, D024 and D025 from
the repair after the first complete run failed, D026 and D027 from a defect
found after the second passed, and D028 with the evidence gate's measurements.
D029 to D037 are the verifier's records of VER-001 and of what followed it.
D038 to D042 are this repair's: the operator's direction to keep the budget at
thirty minutes, the order's amendment and the undoing of the verifier's edits
(D038), VER-001 F1's repair (D039), the authority editions (D040, D041), round
1 of its review (D041), and round 2 with its complete run (D042).

**Criterion 1:** met. `scripts/test-runner.test.mjs` "a passed suite's fixture roots leave as the suite ends and a failed suite's stay with their outcome" (runner-fixtures) plants two roots under a passing suite and one under a failing suite in a fixture gate, and asserts that the passing suite's roots leave at its end and the failing suite's root stays with outcome `failed`. After this repair's complete run, `npm test -- --only runner-fixtures` under the bounded wrapper passed at the same code identity `e5f635cd…`: gate `e291c259`, 272 roots removed, 0 retained, 0 blockers. An owner-record census of the system temporary directory then found no root registered under that gate id, nor under the complete run's own gate `82fbe2bc` (D042).

**Criterion 2:** met. `scripts/test-temporary-roots.mjs` "a kit-owned root goes on its record with its unreadable entries repaired, and only an expired closed-journal root is byte-inventoried" (harness-fixtures) plants expired roots of the four record-proven classes, one holding a file the owner cannot read and one holding a mode-000 directory. An apply removes every one, each reported with proof `record`. A recordless root and a malformed one are kept with their reasons, and their mode-000 files stay unread. The expired closed-journal root is removed after its byte inventory: a mode-000 journal is proven with its original mode, and the proof is kept beside the order's lane, outside it (D016). The journal root inside its window is kept without an inventory. The case calls `pruneHarness` with `apply`, the function `node scripts/harness.mjs prune --apply` runs; it passes in this repair's complete run. The CLI itself was not run on planted roots, because it applies host-wide and without a budget.

**Criterion 3:** met. In `scripts/test-fixture-temp-root.sh` (fixture-temp-root):
- "WO253 one process table per prune" counts one reading of the prune's process table for ten roots, no `ps` listing, and one snapshot binary, which is the apply's lane lease (D006).
- "WO253 live writer read per second, not per root" plants twenty roots under a reserved, live writer and counts 2 `ps` listings and 2 writer views (D015).

In `scripts/test-temporary-roots.mjs` (harness-fixtures):
- "a bounded prune over two thousand expired roots stops inside its budget on one table and no byte inventory, and a second run resumes" stops within its 400 ms budget plus 250 ms, with one table read and zero byte inventories; the second run removes the rest.
- "a listing asks its budget once a batch, lists the first batch even when spent, and counts what it did not read" shows that discovery is bounded by the same budget (D014).

Both suites pass in this repair's complete run.

**Criterion 4:** met. `scripts/test-plan-refutation.mjs` "WO-253 plan start runs its prune as a bounded step that says what remains and how to resume, times each step and still opens its branch" (plan-refutation). With `prune.startBudgetMs` set to 1, plan start:
- prints `Prune: removed N; remaining 4; resume with node scripts/harness.mjs prune --apply`;
- keeps the large root as `budget`, shown by its census line `0 candidates, 0 bytes, 1 retained` and the stop line that names it;
- creates the branch and the pass document;
- prints one `<step>: <h> h <m> min` line for each of failures, reader scores, conditions, census, prune and branch.

With the budget unset, now the thirty-minute default the order's amendment sets (D038), a three-root fixture prints `Prune: removed 3; remaining 0`. The suite passes in this repair's complete run.

**Criterion 5:** met. `scripts/test-release.sh` release:case:close_completion (release):
- The close removes the closed order's two planted roots, one of them holding a mode-000 directory, each with proof `record`, and leaves the other gate's two.
- It records `removed`, `remaining` 0 and `stoppedAt` null on its `prune` step row.
- It prints `Prune: removed N; remaining 0`, the `Prune scope:` line naming the remainder and `node scripts/harness.mjs prune --apply` (D018), and the `Close steps:` line.
- It completes with no unresolved blocker.

The release suite passes in this repair's complete run, under the thirty-minute default.

**Criterion 6:** met. `scripts/test-license-surfaces.mjs` (license-fixtures) asserts that the dry run removes its scratch inside a simulated gate, while a planted `dotln-license-surfaces-*` root of an earlier failed suite, still inside its retention, survives (D003). After this repair's complete run:
- `npm test -- --only license-fixtures` under the bounded wrapper passed (gate `cf48b9bc`, 51 removed, 0 retained, 0 blockers) and left no root under its gate id.
- `node scripts/harness.mjs bounded -- node scripts/license-surfaces.mjs` exited 0.
- The host's `dotln-license-surfaces-*` count was 1,431 before both and 1,431 after them, so the earlier roots survived (D042).

**Criterion 7:** met. The kit guide's §Owned cleanup and retention and product 07 (§Workflow closeout and releases, §Operator recovery controls, §Preflight before the full gate, the plan start paragraph and the verified-root sentence) state as built:
- the suite-end removal;
- the record proof;
- the bounded routine prune, with `prune.startBudgetMs`, now 1,800,000 ms (0 h 30 min) by default at the operator's direction (D038), and its resume;
- the close's scope, with its `Prune scope:` and `Close steps:` lines;
- plan start's timing lines.

VER-001 failed this criterion: the guides said the budget is checked inside every walk and deletion, but a planned snapshot's permission walk and deletion never asked it. Now every walk, byte inventory and deletion of a candidate asks it as it goes: a planned tree's permission walk and deletion (D039), a stash's inventory and a lane's usage copies (D041). The guides say exactly that. They name a shell claim's retirement and a stash's drop as asked once before they start (D042), and the ledger's retirement as unbounded closing bookkeeping. `scripts/test-temporary-roots.mjs` covers VER-001's snapshot stopped as its permission walk starts, a retained lane stopped partway through its deletion with the proof of every file kept, and a stash stopped inside its inventory. Each case fails against a mutant without its check (D041). `docs/evidence/WO-253/VER-001-budget-probe.mjs` exited 1 before the repair and exits 0 after it. `npm run publication:check` passes after the last edit of either guide.

**Criterion 8:** met. `npm test -- --review` passed at code identity `e5f635cdbccb3664a97a6dfc77ab629a4ab4eaf82a1f7bf93d3a13e1281803fd`, tree `948cdf95`, recorded 2026-11-04T12:27:59Z: 46 passed, 0 failed, 120 fresh tasks, 0 h 38 min (evidence `host-gate:e5f635cdbccb3664a97a6dfc77ab629a4ab4eaf82a1f7bf93d3a13e1281803fd:npm test`). `npm run test:docs` runs once after this handoff, the last document edit. `git diff --check` is clean. No dependency was added: package.json and the lockfile change only the `@dotln/skeleton` version and its console pin, 0.81.0 to 0.82.0.

## Review ladders

self-review: found 68; fixed 52; recorded 16; rounds 3 (execution rounds 1 to 3; repair 1, after the first complete run failed, rounds 1 to 3; repair 2, the fix of VER-001, rounds 1 and 2, its round 3 skipped because round 2 admitted no finding and changed no code); unreviewed 0 lines (after repair 2's round 2 only the order's decisions D042, their index rows, the guides' sentence on single-step removals and this handoff changed)

Every worker was a Claude `dotln-worker` (claude-opus-5-5 at xhigh, from the generated definition), launched through the Agent route with no host readback. Each report was recorded with `npm run worker -- record` in the ignored lane `docs/control/local/reviews/WO-253/`, which release close moves into the order's retained lane.

- **Round 1**, tree `af12866b` against the merge base `1bcf9af5b`: criteria (`round-1-criteria.md`, 10 findings), design (`round-1-design.md`, 13) and consistency (`round-1-consistency.md`, 12). Of the 35, 33 were fixed (D013 to D019, D021). Two were recorded: criteria F8, the disposable floor's `*e*`, boarded by D019; and criteria F10, nested roots in another ledger, accepted by D005 (D020).
- **Round 2**, tree `9939dbf1` since `af12866b`. All three reviewers were fresh workers given their own prose reports, since the round-1 workers could not be resumed: `round-2-criteria.md`, `round-2-design.md` and `round-2-consistency.md`. Every round-1 fix held. One finding was admitted, design N1 (grants inside a let-go nested root), as breaking a behavior main had, and it was fixed. Three record corrections and eight observations were recorded (D022).
- **Round 3**, one combined worker, tree `db4fd2e8` since `9939dbf1` (`round-3-combined.md`): N1 held, and five notes were recorded, not fixed (D023). My brief named N1 without its record name; only that id was mapped to `design.2.N1` when the report was recorded.
- **Repair 1**, after the first complete run failed (D024), in `repair-1/`:
  - Round 1, three fresh workers on tree `db8c8b2e` since `db4fd2e8`, found 9 notes: 4 were fixed and 5 recorded (D025).
  - Round 2 resumed the same three workers on tree `a7dd4812`; every finding held, with none new.
  - Round 3, one combined worker on tree `b818e53e` since `a7dd4812`, reviewed D026's fix and recorded two notes (D027).
- **Repair 2**, the fix of VER-001, in `repair-2/`, each worker given the helper's canonical brief, its hash checked against the helper's dry run:
  - Round 1, three fresh workers on tree `71042073` against the merge base `1bcf9af5b`, over the whole diff: criteria (`round-1-criteria.md`, 3 notes), design (`round-1-design.md`, 2 should-fix and 6 notes) and consistency (`round-1-consistency.md`, 2 blocking and 3 notes). Of the 16, 14 were fixed and 2 recorded (D041). The two blocking findings were the verifier's dispatch lines failing the document check, and a stash's inventory that never asked the budget, which design F1 also found.
  - Round 2 resumed the same three workers on tree `948cdf95` since `71042073` (`round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md`): all 14 fixes held, and no new finding was admitted (D042).
  - Round 3 was skipped, since round 2 changed no code.

## Complete runs

1. 2026-11-04T06:24:44Z, code identity `a01afd4c…`: 45 passed, 1 failed (launchpad:file:test-launchpad-export.mjs, the emit closure's pin), 120 fresh, 0 h 35 min. The gate's end also kept a passed suite's root that a new case had filled. Both were repaired (D024). The background task's own exit status was 0 only because of an `echo` I appended to the command, so the result was read from the gate's summary line instead.
2. 2026-11-04T07:36:54Z, code identity `185cdea6…`: 46 passed, 0 failed, 120 fresh, 0 h 41 min. It was superseded by D026's fix to `remaining`, found afterwards by a host-wide preview.
3. 2026-11-04T08:29:35Z, code identity `fefe7375…`: 46 passed, 0 failed, 120 fresh, 0 h 35 min. This is the run VER-001 judged.
4. 2026-11-04T12:27:59Z, code identity `e5f635cd…`, tree `948cdf95`, the tree repair 2's round 2 reviewed: 46 passed, 0 failed, 120 fresh, 0 h 38 min. This is the run criterion 8 stands on.

Main stayed at the merge base `1bcf9af5b` throughout, so no integration was due.

## Measurements

D028 holds the evidence gate's figures for the execution, and D042 those for this repair.

- **Root counts around the passing runs.** The system temporary directory held 5,552 `dotln-*` roots before the third run and 5,554 after it, and 5,554 before the fourth and 5,556 after it. None of the new ones is the gate's own. Each time they are two `failed` roots of a fixture's synthetic gate, from scripts unchanged from main.
- **Gate cleanup.** The third run's end removed 2,263 roots and retained 1, a warm fixture kept by its protocol, with 0 blockers. The suites' own ends removed 234 (runner-fixtures), 15 (license-fixtures), 527 (harness-fixtures), 4 (fixture-temp-root) and 66 (plan-refutation). The fourth run's end removed 2,266 and retained 1, with 0 blockers.
- **VER-001's probe.** Before the repair (VER-001): `checksAfterExpiry` 0, `deletedAfterExpiry` 1, the snapshot gone, `remaining` 0, `stoppedAt` null, exit 1. After it: `checksAfterExpiry` 1, `deletedAfterExpiry` 0, the snapshot kept, `remaining` 1, `stoppedAt` at removal, exit 0 (D039).
- **The budget.** `prune.startBudgetMs` defaults to 1,800,000 ms (0 h 30 min) instead of 60,000 ms (D038). In the verifier's real-clock runs (`real-cleanup-measurements.json`), an 800,000-file snapshot took 146,633 ms (0 h 2 min) to remove without a bound, and the sixty-second budget had left it unremoved.
- **Plan start and the close.** The order's own plan start and close timings belong to later phases: the next planning pass prints plan start's step lines, and this order's release close prints its `Close steps:` line. The before figures are 0 h 17 min to plan start's branch, and WO-241's 0 h 2 min of publication followed by 0 h 16 min of host-wide prune.
- **Proxy for plan start's prune.** A read-only, host-wide bounded preview of main's checkout, using the execution's code, judged every root in 7.5 s: 654 candidates and 5,153 kept, with no stop at the 60 s budget that was then the default.

## Recorded, not fixed

Each item is recorded in the decision named; none breaks an acceptance criterion or a behavior main had.

- **The disposable floor's `*e*`:** the judgment of the matched set at the close is boarded (D019).
- **Nested roots in another ledger:** inside a kept parent, they are judged when the parent goes (D020, accepted by D005).
- **The prune's per-run state:** it is still carried both in the options and in each context (design F8 d, D020 and D022).
- **`remaining` once a listing stops** (D022):
  - it counts every unread entry, so unrelated entries of a temporary base are included;
  - a budget spent before the listing re-reads the same first batch.
- **The publication listing:** it keeps its own 60 s timeout inside the first lane or stash judgment (D022).
- **The reuse strip of the suite-end fields:** no test asserts it (D022).
- **Small inaccuracies** (D022, D023):
  - the RemovalOptions type omits `repaired`;
  - the close's "kept by their records" count includes restricted and unproven roots;
  - `temporaryPrunePaths` now serves fixtures only.
- **Wording** (D023):
  - pruneUnderLock's docblock still says one table serves every owner-liveness judgment;
  - D022 says no judgment reads the options' budget, though planHarnessPrune's per-item gate does;
  - the kit guide's sentence omits that the writer view also lists the table.
- **The N1 regression case:** it exercises the fix only when the walk lists a let-go root before the live one, which it does on this host (D023).
- **The grants accumulator:** it is a public fifth parameter (D023).
- **Selection:** plan-refutation no longer runs when only the budget-key rule changes; harness-fixtures' unit case judges the rule (D025).
- **A suite-end check:** nothing names a passed suite's root kept for a nested owned root; boarded (D025).
- **The stop-and-queue path:** no case covers it, though a reviewer's sweep found it counted correctly (D027).
- **The stop index:** every break in the loop must set it (D027).
- **A planned removal that fails for permissions:** it still stops the whole apply and the ledger's retirement, as on main; boarded (D041).
- **A cheaper walk for the kinds that keep no byte proof:** an optimization, not a defect (D041).
- **Repair 2's round-2 notes** (D042):
  - the stash case exercises its inventory's first budget ask only;
  - the nested-root walk reads each child's marker between its per-directory asks, metadata only;
  - the dead-cache case that stopped mid-deletion became the lane case on the same removal path;
  - the stash case runs Git in its own fixture repository.
- **A stop inside a planned tree:** it leaves the tree partly deleted at its path. A lane's first proof of every file stays, and the finishing prune publishes a second for the files left. A partial snapshot that an install selects again before the next prune is refused with its remedy (D041).

## Untested

- Linux and Codex hosts.
- A real `plan start` or host-wide apply under the new code; only a read-only host-wide preview ran (D028).
- A real routine prune that reaches the thirty-minute budget on a real host.
- The order's own release close. The close fixture of criterion 5 stands in for it, and the close prints its own `Close steps:` line.
- The `harness prune --apply` CLI on planted roots; its function is tested directly (criterion 2).

## Follow-ups

- FUP-89b7b9f657765e83 (D013): optimize the four installed cold starts over their ceilings (deferred).
- FUP-b99d7ad6940b7ebf (D019): judge disposable declarations by what they match at the close (deferred).
- FUP-b1397fa85cbeba51 (D025): name a passed suite's root kept for a nested owned root at the suite's end (deferred).
- FUP-f7d10bd1d1d72b42 (D041): keep a planned candidate whose removal fails for permissions and go on to the next (deferred).
- Carried in and taken: FUP-8bf500303e6adfce (kept starter seeds printed) and FUP-e2951c129de462ce (the disposable floor), both under D011.

## Attestation

This repair:
- **Harness:** claude-code 2.1.318.
- **Model:** claude-opus-5-5, selected by the operator with `/model` ("Set model to `Opus 5.5`").
- **Effort:** max, read back from the host's `CLAUDE_EFFORT=max`; the source is `claude-session-readback`, which reports the selected effort, not the effective one.
- **Workers:** 3 `dotln-worker` launches and 3 re-tasks, 6 of the subagent cap's 20.

The execution ran claude-code 2.1.263 with the same model and effort, and 11 launches and 3 re-tasks.

## Process cost

This repair: `node scripts/harness.mjs usage 52aa7660-fd5d-46d7-a58a-c2ff4795cafa` at 2026-11-04T12:33:52Z, from Claude transcript message usage, scope dispatch:

| Counter | Value |
| --- | --- |
| Input tokens | 380 |
| Cached input tokens | 61,756,902 |
| Cache-write input tokens | 494,272 |
| Output tokens | 246,617 |
| Total tokens | 62,498,171 |
| Reasoning tokens | unknown |
| Cost | unknown |

Dispatch standing was 2 h 5 min of 8 h 0 min, with 1 of 20 complete runs. That standing counts from the repair dispatch the verifier recorded at 10:28:49Z. The complete run took 0 h 38 min of it, and the two review rounds about 0 h 19 min and 0 h 4 min.

The execution: `node scripts/harness.mjs usage e08b9dce-c387-41b5-857d-ebf1201a8829` at 2026-11-04T08:33:50Z, from Claude transcript message usage, scope dispatch: 377,663,711 total tokens (1,462 input, 374,931,474 cached input, 1,767,209 cache-write input, 963,566 output); reasoning tokens and cost unknown. Dispatch standing was 5 h 53 min of 8 h 0 min, with 3 of 20 complete runs.

The outcome matched the operator's direction. The verifier's edits are undone. The budget stays, with a thirty-minute default. Every walk, inventory and deletion of a bounded prune now holds the budget the guides describe.
