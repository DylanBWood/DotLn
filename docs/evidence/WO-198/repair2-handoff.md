# WO-198 repair handoff

Dispatch: `resume: fix`, repairing [VER-002](../../verifications/WO-198/VER-002.md)
F2 and the operator-approved F3 cleanup. The additional operator request
`scope expand: merge in main` is complete. Prior handoffs remain in
[repair1-handoff.md](repair1-handoff.md) and
[implementation-handoff.md](implementation-handoff.md); filed verification
reports and historical evidence editions retain their bytes.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The order recommends executor xhigh. This records the current Codex session
selection from the canonical briefing, without claiming effective-effort proof.

**Criterion 1:** met — [repair2-row-readback.json](repair2-row-readback.json) records the integrated document and review rows at f940fd38ea68907c1ced716820e5e1212673264ce2a1891208485ffe4f4fe611. Both carry sharedRefs.start and sharedRefs.end with originMain, main, tags count/newest and dotlnRefs. The focused absent-ref and annotated-tag case passes, and the full runner-fixtures suite passes at this identity.
**Criterion 2:** met — [repair2-fixture-transcript.txt](repair2-fixture-transcript.txt) preserves failure-only, same-check, during-run and round-trip diagnostics. Damaged archive JSON and an unselectable archived timestamp both record exit 1 with complete snapshots and one summary. An unavailable previous baseline suppresses only the since-previous interval: the timestamp case still prints exactly one line naming all four fields that moved during the run. The full integrated runner suite passes these cases.
**Criterion 3:** met — the linked-worktree fixture passes before and after a sibling commit and annotated tag push, with unchanged document/plain task results, updated snapshots and no delta on successful gates. The forced-failure case names the movement. The focused selection passed eleven tests; the integrated review's complete runner-fixtures task passed in 114.331 seconds.
**Criterion 4:** met — no task flipped in the reduced-table reproduction. D002 records the original result; D007 and the second repair transcript record its successful rerun. The independently demonstrated history-read and selection crashes are repaired with their own regressions, including the timestamp input VER-002 did not quote.
**Criterion 5:** met — integrated npm run test:docs passed 32 checks in 121.396 seconds; npm test -- --review passed 38 suites, 90 fresh tasks, zero reused tasks and zero failures in 1643.655 seconds. Product 07 and publication locks are current. Authority, artifact-identity and verification WO-198 revision 002 were written and checked after the integrated build; upstream's selected feedback edition also passed its check. The document gate includes release-surface, publication, harness, evidence, meta and planning checks. git diff --check is clean; root dependencies are unchanged and only existing component labels/pins move.

self-review: found 0; fixed 0; recorded 0 — the two separate root passes and
integration assessment are in [repair2-self-review.md](repair2-self-review.md).
No agent was spawned. The executor skill requires two fresh workers before
implementation-ready only; this repair does not claim independent worker
judgment. The original worker reports remain in [self-review.md](self-review.md).

The repaired rule covers the complete diagnostic lookup: read, parse, sort,
filter and timestamp conversion errors cannot escape it. Failed lookup means
no prior baseline. Current-run comparison and durable recording remain outside
the catch. The before-fix regressions failed with a JSON SyntaxError and a
Date.parse TypeError; both pass with the repair. The result matches the intended
scope and the operator's integration request.

F3 retains the two original whole-gate witnesses and directly checks 21 malformed
shapes plus two valid controls. One bounded comparison measured 7851.751 ms for
the former sixteen-gate matrix versus 981.744 ms for the two retained gates plus
0.379 ms for direct validation. This reduces fourteen fixture-gate executions;
F2 adds two distinct integration regressions. These are single observations,
not medians or a claim about whole-review speed. The integrated full suite ran
under shared load; D004's previously recorded runner-suite growth still stands.

Integration used `npm run worktree -- integrate WO-198` and its continuation.
The branch fast-forwarded from b06c60812cf7a533d9a2286479893abe6904c4b2 to
bb84ae82bd5b8e0b92a3face9578e9c3672ba61a, then reapplied the repair. Four conflicts
were resolved: the current evidence selector, skeleton and console package
files, and the lockfile. The integration receipt reports complete with no
pending step. Checkpoint `refs/dotln/checkpoint/WO-198/10`, its named stash and
the verified external intake archive remain available. D009 and D010 name the
authorization, both bases, resolutions and carried-forward claims.

Release preparation retimed the application to v0.73.1 above v0.73.0. The
compatible skeleton patch is 0.57.1 above upstream 0.57.0, with the existing
console pin; harness host remains 0.35.1. Revision 002 evidence describes the
combined source and preserves revision 001. Feedback retains WO-073's edition
and its carried WO-199 live audit. No new live episode was needed. The final
material inventory found no nested repository outside intake.

The document row was recorded at 2026-10-09T20:51:04.914Z and the review row at
2026-10-09T21:18:36.718Z. Both attest unchanged code and build output. No
repository edit or worker launch occurred during either gate. Only evidence,
follow-up dispositions and handoff text were completed afterward.

FUP-6f4da93aa109f4f1 is settled for F2/F3. Adjacent-0001 is completed at queue
revision 5, with no next item. VER-001 B1 remains deferred on
FUP-f5f10101e717d59b: the harness evidence writer can append a snapshot-less
failed row. D007 preserves latest-row semantics and records that separate
writer follow-up. A damaged hot index can still fail during persistence, as on
main. The reduced-table and two-sample limits in D002 still apply; recorded ref
movement does not by itself prove the cause of a task failure.

Process cost is recorded in ignored session receipts and the final response,
with source, scope and cutoff. Dollar cost is unavailable. Independent
verification is the next dispatch; this handoff is not its verdict.
