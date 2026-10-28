# WO-233 evidence

The operator manually removed the accumulated residue before execution. The
smaller original baseline is credited to that manual work. This order puts
cleanup into integration, gate, session and release-close lifecycles.

Base: bca92e77d03880ec57a83d37eebb85a3a8f7ab76, observed 2026-10-27.
[census-before.json](census-before.json) records the original system-temp
dotln and dotln-* census without symlink traversal. The base prune exited 0
with no candidates; the stash count was 0.

[controls.json](controls.json), produced by [controls.mjs](controls.mjs),
records four isolated arms. Completed integration exits 0 in both arms:
the base adds a stash, while the changed implementation drops its own.
The active-phase base arm refuses with exit 1; the changed current-main route
exits 0 and receives the upstream file.

[backfill.json](backfill.json), produced by [backfill.mjs](backfill.mjs),
records executor-run dry/apply/dry commands, all exit 0: zero candidates,
zero removals, 73 retained and zero blockers. These observations do not claim
the operator's earlier deletions as product cleanup.

[VER-001](../../verifications/WO-233/VER-001.md) rejected the original
implementation despite its passing task row in [review-evidence.json](review-evidence.json).
It found retained passing fixtures, broken daemon sampling and scratch deletion
at an ordinary turn end. That report and the original raw evidence remain
unchanged. D024–D038 record the repairs and their failed checks.

The earlier claim that fseventsd was absent was wrong. The command-first ps
column was truncated, hiding a readable daemon. Old null samples do not
establish absence. The corrected sampler uses RSS first and command last;
the current census script shares it.

The prior repair [complete review](repair-review-evidence.json) is recorded
at 2026-10-27T18:14:03.709Z: 112 fresh tasks across 46 required suites, no reused or
unrun tasks, 1,855.716 seconds including cleanup, and unchanged
source/build identities. Cleanup removes 2217 roots, retains 0
and reports zero blockers. Its filesystem probe counted only gate-fixture
roots: [VER-002](../../verifications/WO-233/VER-002.md) subsequently found 45
dead worker captures from that same gate and 21 unowned fixtures from the
document gate. The earlier claim of zero passing roots was too broad.
[repair-verification-probes.json](repair-verification-probes.json)
also records numeric daemon sampling and survival of scratch and its staged file
across an ordinary Stop.

The complete review records fseventsd RSS 19,070,976 bytes before,
19,038,208 at admission and 19,152,896 after, a delta of 81,920.
It inventories 1,051,054 created files, 1,044,046 deleted files
and 20,631,364,586 estimated written bytes. Those are content-inventory
measurements, not physical I/O. One uncontrolled observation cannot establish a
causal effect or a layout benefit; D025 and the final decision retain the
repeatable-comparison condition.

The export task passes in 211.447 seconds. This cold cache run derives two npm ci calls: one cache fill and the retained fresh-install acceptance case; the independent cache-hit consumer adds none.
D017 preserves the three unconditional base install sites, the 205.207-second
original export task and the 419.1-second historical whole plain-gate median.
These scopes and subjects establish no percentage speedup.

The current feedback edition is feedback-002. Its required separate native
verifier completed in 33.397 seconds, ten fixtures and 1,192 saved instruction
bytes; D029 preserves the earlier edition and the physical-path retry.

The operator-requested broader code review found three additional defect
classes, recorded in D034–D035. [review-nested-fixture.json](review-nested-fixture.json)
and [repair-nested-control.json](repair-nested-control.json) preserve the later
test-teardown reproduction and exact control recovery. The seventh repair run's
passing task row and failed filesystem acceptance remain in
[repair-review-incomplete007.json](repair-review-incomplete007.json).

[handoff.md](handoff.md) gives all criterion judgments, review counts and limits.
D019's original review-loop process failure remains recorded; the eight VER-001
repair attempts do not erase that cost. Independent verification and final review are
separate dispatches.

The VER-002 repair is recorded in D043–D046. It covers every registered root
carrying the gate identity, extends declaration coverage through executable
evidence and corpus imports, migrates those factories, and preserves completion
times across repeated cleanup. The unchanged VER-002 residue probe judged
that repair's complete and document rows before its handoff.

The VER-002 repair's [complete review](repair-ver002-review-evidence.json)
passes at 2026-10-27T20:31:18.147Z: 114 fresh tasks across 48 suites,
1,844.626 seconds, 2272 roots removed, only the warm export retained and zero
blockers. [The unchanged verifier probe](repair-ver002-probes.json) finds zero
dead-owner roots from that complete row's passing suites and zero unowned roots
born during the passing document reproduction run. Both of that run's row references
and a readable process table are asserted. The document run removes all 230
roots. That repair's handoff records its final document check and repeated probe.

The second VER-002 repair attempt remains
[task-passing but incomplete](repair-ver002-review-incomplete002.json): seven
synthetic retention controls pinned two test containers. D048 records the
executor's teardown omission, the corrected
[bounded reproduction](repair-ver002-fixture-control.json) and
[checked control recovery](repair-ver002-control-recovery.json). This repair
required three complete attempts; the final pass does not erase those costs.
D049 records the final evidence, measurements, limits and retained follow-ups.

The current repair addresses VER-004 F10. D059 records the shared prune rule;
D069 records recovery of all five checked historical coordination roots,
with original markers and diagnosis windows preserved. The unchanged
VER-004 reproduction passes all five synthetic arms. Its post-review machine
projection finds all 2,256 owned failed roots eligible after their windows
with this worktree's writer released, including 55 trees holding nested
roots. This is a read-only projection, not a claim that they were deleted.

D062, D063, D065 and D066 preserve the operator-designated hard failures.
D067 records the mandatory three-reviewer workflow, including test and
fixture dependencies. D068 records the bounded planning-bookkeeping repair.
Current independent reviews are retained in [self-review.md](self-review.md).
The current [complete review](repair-ver004-review-evidence.json) passes at
2026-10-28T01:54:06.688Z: 114 fresh tasks across 48 suites, 2,241.028 seconds,
2,318 roots removed, only the warm export retained and zero blockers.
[Both unchanged VER-004 probes](repair-ver004-probes.json) pass; the broad
census finds no unaccounted root carrying this passing gate. The same
consistency reviewer initially passed the final write-backs. The document
gate then found three malformed dispatch labels; that transferred finding
and the reviewer's dependent planning-binding correction are recorded in
D074 and [the failed document row](repair-ver004-docs-failed001.json).
The same reviewer confirmed the corrected write-backs and all seven
consistency fixes before the final document check. D070–D072 preserve the two failed complete attempts and
their corrections.
