# WO-169 implementation evidence

Dispatch: `resume: next` on 2026-09-27 (UTC). Executor: claude-code 2.1.283,
claude-fable-5-1, effort xhigh (selected, read from the session; the session
ran with workflow orchestration); source claude-session-readback. One writer.
Nine read-only helpers of the session cap of 20: four scouts before
implementation, four reviewers and one refuter after it. None wrote to the
checkout.

## What changed

| Item | Change                                                                                                  | Decision | Fixture                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 1    | `followups --touching [<path or WO-NNN>…]`, its no-term form and one completion advisory                | D002     | four process-debt tests: `WO-169 followups --touching …` (two), `WO-169 the change is read …`, `WO-169 completion advises …` |
| 2    | `followups --export <file> [--all]`                                                                     | D004     | `WO-169 followups --export …`                                                                           |
| 3    | `followups --apply` takes an array                                                                      | D005     | `WO-169 followups --apply …`                                                                            |
| 4    | `worktree integrate` generates after authored conflicts are staged; the stub's release entry is one line | D006     | both real-Git cases, `WO-169 a first invocation …`, `WO-169 a pass whose generator fails …` and `WO-169 the integration record …` |
| 5    | the configuration-root suite declares `scripts/`                                                        | D007     | `WO-169 a changed script …` in the runner fixtures                                                      |
| 6    | the drift rows print `ceiling unset`                                                                    | D008     | the refuter assertions in `WO-155 cold-start trends …`                                                  |

The [decisions](decisions.md) carry each choice with its evidence, rejected
options and reopening condition; D003 is the advisory. The
[fixture transcripts](fixtures.txt) are the evidence gate's first item. No
package source changed, so no component version moves and no evidence edition
is re-minted. No dependency was added, and no role skill, register schema,
collector rule or control-event schema changed.

## Acceptance criteria

1. Met by the four item 1 fixtures. `--touching scripts/lib/meta.mjs` returns
   the rows that name the path, its base name or name it in their latest
   disposition, and neither the settled row nor another file of that name;
   `--touching WO-115` returns the row that names the order and not `WO-1150`;
   the no-term form returns the rows for committed, renamed, deleted,
   uncommitted and untracked files and the active order, and none for a file
   `main` changed after the branch point. `implementation-ready` and
   `repair-complete` print the advisory with the count, the command and the
   rule on one match and stay silent with none; every call resolved, so no
   completion is refused. The criterion's last sentence is the final review's:
   [D011](decisions.md#wo-169-d011--the-rows-this-orders-own-change-touches)
   lists the 14 rows this order's own run returned, with what the executor did
   with each.
2. Met by the export fixture: every pending row with its whole `followup`
   (longer than the feed's 220-character clip) and its whole disposition
   history; standard output holds the counts, the revision and the path only;
   eight destinations outside the two roots are refused and three existing
   files that no export wrote are kept; the feed's pages are byte-identical
   before and after.
3. Met by the batch fixture: three requests, the second valid only on the
   state the first produces, apply under one revision and yield the same
   register bytes as the three single applies under the same clock; an invalid
   second request writes nothing and names index 1.
4. Met by the integration fixtures: with one authored conflict the first pass
   prints the conflict, one pending line and no `Regenerated:` line; it
   generates under `--continue` once the conflict is staged; the stub's release
   entry is one line that ends with one full stop.
5. Met by the runner fixture, which reaches the selection through
   `runGate(["--review", "--list"])`, the function `npm test -- --review --list`
   runs.
6. Met: the drift rows for the refuter read `ceiling unset`. With the old
   expression restored the same test fails on `ceiling unavailable`.
7. Write-backs landed: `docs/planning/followups.md` and product 07 §Retained
   planning follow-ups name the three forms and the three uses in place.
   Product 07 grew by 410 bytes (185,895 to 186,305; the order allows 500):
   412 added in that section, and 2 removed by one corrected sentence in
   §Independent workflows and integration
   ([D006](decisions.md#wo-169-d006--generation-waits-for-authored-conflicts-the-record-holds-the-release-message-as-one-line)).
   Retargeting the six register rows named in the provenance is a duty of
   close.
8. `npm test -- --review` after the last source edit: 34 passed, 0 failed,
   391.52 s, 78 fresh tasks, recorded 2026-09-27T04:13:54.435Z at code identity
   `0aaf8b4c`; it selected the machinery suites configuration-root,
   plan-refutation, runner-fixtures, process-debt, meta and registrations. An
   earlier run before the review's repairs also passed (34 of 34, 393.98 s).
   `npm run test:docs` and `git diff --check` run on the tree handed off,
   after this file is written; the harness records their rows and the
   completion reports them. No new dependency.

## Release

Application `v0.52.4`, the next patch above the observed local `v0.52.3` tag,
assigned under the standing opt-out default: the order was activated with its
target still unassigned, so the executor completed the heading, the README
claim and the roadmap's activation note, and `npm run release -- prepare
--local` then reported the target current. The plan gate reads the heading
change as a release assignment. Both edition locks were refreshed for the
product 07 and roadmap edits; `npm run publication:check` reports both current.

## Replay and review

[touching-replay.json](touching-replay.json) is the replay receipt 032 asked
for, read in
[D009](decisions.md#wo-169-d009--the-replay-receipt-032-asked-for): every
counted row is returned for the orders that opened its seam except three meter
rows for WO-160, which name release preparation in prose. The same replay
measured 13 to 33 rows per order, which D002 records for the planner.

[D010](decisions.md#wo-169-d010--review-before-the-gate-and-what-it-changed)
records the review before the gate: one major, seven minor and nineteen notes,
none blocking, and none refuted by the recheck, which found one further defect
that the repairs had introduced. Eighteen were fixed in this order; the rest
are left with a named follow-up or a stated reason. The reviewers read the
change before the repairs and no reviewer has read the repairs themselves, so
verification is their first independent reading.

## Follow-ups this order names

Four decisions carry a `followup`, and `npm run meta` minted their register
rows: D002 (generated projections in the no-term terms, and the match's
limits), D004 (one rule for a hook's write and a command's write), D006 (two
older defects of the integrate helper) and D007 (untracked scripts in the
review selection).

## Limits

The match is textual. It misses a row that names its seam in other words, and
it lists a row that names a changed document for another reason; the order
accepts both. The export command judges two roots it can resolve without a
session identity and refuses a host scratchpad outside them. The batch's byte
equality with single applies is established under one injected clock, because
two real runs stamp different instants. The fixtures run in throwaway
repositories; no live register row was disposed by this order.
