# WO-111 implementation and repair — bounded live scratch proof

Initial dispatch: `resume: next`, 2026-09-24; Codex CLI 0.156.1,
gpt-6-sol, xhigh, codex-session-readback. Repair dispatch: `resume: fix`,
2026-09-24; Codex CLI 0.156.1, gpt-6-astra, xhigh,
codex-session-readback. Application patch target remains v0.46.3.

## Current result

**The proof remains incomplete.** [VER-001](../../verifications/WO-111/VER-001.md)
failed. Criterion 2 is contradicted by scratch trust entries added to user
Codex configuration outside the portfolio. This repair corrects evidence and
document defects; it does not fix runtime isolation, change user settings,
rerun live workers or waive acceptance. [D011 and D012](decisions.md) retain
the failure and its runtime follow-up FUP-3c34a8ffbf61376f. As corrected in
D014, that follow-up is independent of WO-111’s outcome and is not a prerequisite
for this repair’s re-verification handoff. The
[trust diagnosis](codex-trust-diagnosis.md) distinguishes WO-111's two entries
from the broader accumulation reported by the operator.

The corrected [first receipt](receipt-v2.json) records a 648,313 ms window:
six discovered 5S candidates, three derived changes in probe → widen → peak,
and a fresh live verification pass for each. Changed-path counts were 1/1/2.
A **separate mission resident** judged the WO-111 DotLn worktree, not the
scratch orders, and accurately found `contract:surfaces` drift over the
omitted `docs/lineage/decisions-index.md` surface. Its hold existed only in
its own store and refused no work there. The portfolio stopped on its exhausted
three-episode budget; the mission hold was not a competing cause.

The corrected [return receipt](return-receipt-v2.json) records a 536,565 ms
window with three more independently verified changes, then probe reset,
an eligible fourth candidate and one episode remaining. The return edge was
252,399 ms before due. Offline replay of the retained prefix with and without
that edge shows cancellation: returned state has no due dispatch and rejects
dispatch, while the no-return control admits it. This uses the runtime under
examination, not an independent policy model. The caller aborted after seeing
present and ended 348 ms after return; zero post-return events alone was not
proof at a due time still minutes away.

Neither live return had an in-flight episode. The recorded phase rule is
discovery `kill`, probe/widen/peak `finish`; the existing
`resident.test.ts` kill/finish test uses fake actors. These windows do not
establish live worker drain/kill behavior or mission supervision of the
portfolio. No verification failed, so a failure reset was not exercised.

Checkout snapshots matched for tracked and nonignored bytes only. Ignored
control records, the first mission store and target `.git/info/exclude`
worker blocks were written. Both scratch targets and launchpads had no Git
remotes. Beyond the observed Codex config change, unmeasured host paths and
network effects remain unknown. Resident wall accounting is timestamp-derived:
182,200 ms plus 183,249 ms, not actor-reported wall time. Tokens alone are
actor-reported, and zero reported tokens does not mean zero usage. Each v2
receipt projects all three worker and three verifier launch claims with
effective identity unknown. Human authorship of presence signals is a launch
claim grounded in D003's operator-message record, not authenticated by the log.

## Repair and reproducibility

The original [receipt](receipt.json), [return receipt](return-receipt.json),
their JSONL streams and original collectors are preserved as the exact
historical subject. Their known overclaims are superseded by the v2 editions.
`repair-receipts.mjs` replays retained local stores and produces new JSON
event arrays with a common field projection, refusal reasons, documented
offset origins and null offsets for logical-zero configuration events.
Original JSONL streams are registered as non-EventEnvelope evidence fixtures
in the kernel test registry; this changes no runtime or generated config.

Reproduce without a live worker:

```sh
node docs/evidence/WO-111/repair-receipts.mjs check
```

The check requires the retained ignored stores. It verifies original stream
digests and exact regenerated v2 bytes, asserts six launch records per window,
and checks the cancellation control. `collect` refuses to overwrite editions.
The first window used earlier generator revisions and a manual synthetic
grant-registry commit; a complete preparation/bind/presence shell transcript
was not retained. The second used the filed seed/run/baseline, but its setup
commands are also not a complete script. No retroactive provenance is invented.

Ledger ordering and its generated index are repaired. R2 is answered in the
actual [planning map](../../planning/work-order-map.md), with cost/session
comparability limits and an integration-package-growth disposition in the
critical-path plan. Living runtime/capability claims identify the separate
mission store, replayed cancellation, snapshot coverage and open containment
failure. Historical decision errors are explicitly corrected in D012.

## Product meaning and follow-up

The operator's Blackjack +3 analogy maps accumulating losses to elapsed
absence only, not agent outcomes. The intended curve has a useful descending
half before smallest-chunk reset; these windows reset directly after peak.
Timing, work classes and net value remain experimental. The order asks for a
bounded window and sets no numbered sixty-minute minimum; neither window
lasted an hour. Current dispatched orders can progress during absence; the
full curve belongs to the future automatic selector of further eligible work.
[The planning candidate](../../planning/full-absence-curve-experiment-2026-09-24.md)
is FUP-441469088613e52a. Original scope-expansion edits also reopened FUP-0083,
FUP-0108 and FUP-0110 to needs-review; no disposition is inferred here.

Release preparation rewrote the staged PR body, contrary to D010's original
statement of no file edits. It did not bump runtime components or dependencies.
The reviewer must derive the final PR body from the eventual verified subject.

## Checks

Original implementation `npm test`: 27 passed, 0 failed, 71 fresh tasks,
346.79 s. Independent VER-001 `npm test`: 27 passed, 0 failed, 71 fresh tasks,
300.50 s. VER-001's document gate failed; those results are historical.
Repair checks and the completed documentary repair are recorded in
[repair.md](repair.md). The repair is ready for re-verification; no verification
pass or order closure is inferred from corrected documentation.
