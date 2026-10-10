# WO-198 repair handoff

Dispatch: `resume: fix`, repairing [VER-001](../../verifications/WO-198/VER-001.md)
F1. The initial executor handoff is preserved in
[implementation-handoff.md](implementation-handoff.md), with its original
gate readback, transcripts and worker reports.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.0","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

The order recommends executor xhigh. These fields record the current session
selection supplied by the Codex briefing, without claiming effective-effort
proof.

**Criterion 1:** met — [repair-row-readback.json](repair-row-readback.json) records both gate rows at repaired identity ea32fb1e1fc56cf81ad6b61b5dd3962bc25d0a32c827473d57ca324346d3822e, each with complete four-field sharedRefs.start and sharedRefs.end. The focused transcript retains the absent-branch and annotated-only tag case. Snapshots remain diagnostic metadata outside the identity calculation and verdict.
**Criterion 2:** met — [repair-fixture-transcript.txt](repair-fixture-transcript.txt) records the original failure-only delta and round-trip cases, plus sixteen incomplete/malformed baselines that each record exit 1, complete current snapshots and one summary without a fabricated delta. A null-tags baseline still permits exactly one during-run line naming all four changed fields. D005 states the whole-snapshot rule; a legacy or malformed latest row supplies no baseline.
**Criterion 3:** met — runner-fixtures passed in 97.181 seconds as a fresh task in npm test -- --review. The focused command passed all 22 tests, including the sibling document/plain runs before and after the commit and annotated tag push, the forced failure and the added malformed-record cases. Both passing gates carry the new snapshots.
**Criterion 4:** met — no task flipped in the reduced-table fixture. D002 records the original output and checked readers; D005 and the repair transcript record the successful rerun. The repair addresses the independently reproduced diagnostic crash, with its own regression cases.
**Criterion 5:** met — npm run test:docs passed 32 checks in 100.983 seconds; npm test -- --review passed 38 suites, 90 fresh tasks and zero failures in 1488.838 seconds at the repaired identity. Product 07 states the malformed-baseline rule in place, publication locks pass, and the three immutable WO-198 revision 001 editions pass their individual checks after a bounded build. git diff --check is clean. The existing compatible patch labels and workspace pin remain the release changes; no dependency was added.

self-review: found 0; fixed 0; recorded 0 — repair uses the two separate root
passes recorded in [repair-self-review.md](repair-self-review.md). No fresh
worker was spawned; the executor skill's worker requirement applies before
implementation-ready only. The initial two independent worker reports remain
in [self-review.md](self-review.md).

The repaired rule holds: a missing or malformed earlier snapshot cannot
prevent recording the failed gate or its summary, and the current valid
start/end interval remains independently comparable. The focused red run
reproduced the crash and false deltas before the guard; the passing run and
full review establish the repaired behavior. The outcome matches the intended
repair scope.

The source change moves the code identity from e985b95a9c5f8e7f54e776a39fd3bee984148136747604aff369d9c13359eb1e
to ea32fb1e1fc56cf81ad6b61b5dd3962bc25d0a32c827473d57ca324346d3822e.
The document row was recorded at 2026-10-09T19:48:23.880Z and the review row at
2026-10-09T20:13:18.609Z. No repository edit or agent launch occurred during
either gate. The repair matrix took 7.787 seconds in the full review; D005
records this cost without treating different shared-host runs as equivalent
timing measurements.

VER-001 B1 remains boarded on D004's existing follow-up
FUP-f5f10101e717d59b: the harness evidence writer can replace a failed runner
row with a snapshot-less row. This repair changes neither that writer nor
previous-row selection. The reduced-table live-case and two-sample limits in
D002 still apply; the diagnostic records movement, not its causal role in a
failure. Independent re-verification is the next role.

Release preparation retained application v0.72.1 from the local v0.72.0 tag
snapshot, skeleton 0.56.1 and harness host 0.35.1, with the existing console
workspace pin. Authority, artifact-identity and verification retain WO-198
revision 001; the checked feedback edition retains its existing live audit.
The material inventory found no nested repository outside intake. The
adjacent queue is empty at revision 0.

Process cost is in the ignored session receipts and final response, with the
counter source, scope and cutoff; dollar cost is unavailable. No elapsed-time
estimate substitutes for usage counters.
