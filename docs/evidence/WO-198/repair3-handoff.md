# WO-198 third repair handoff

Dispatch: `resume: fix`, repairing [VER-003](../../verifications/WO-198/VER-003.md)
F4. Earlier handoffs remain in [repair2-handoff.md](repair2-handoff.md),
[repair1-handoff.md](repair1-handoff.md) and
[implementation-handoff.md](implementation-handoff.md). Filed reports and
historical evidence editions are preserved.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

The canonical briefing supplies these selected session values. The executor's
recommended effort remains xhigh; no effective-effort claim is made.

**Criterion 1:** met — the latest document and review rows at code identity 87bce92bb6e71517b977d75da3e904a4977c11a8b7c9f92c6e394253bbb4662d carry all four sharedRefs fields at start and end. [repair3-row-readback.json](repair3-row-readback.json) records them and independent agreement with the persisted hot index. Direct damaged-ref tests retain all fields without throwing; unsuccessful enumeration counts record absent, never zero or partial values.
**Criterion 2:** met — [repair3-fixture-transcript.txt](repair3-fixture-transcript.txt) records all 14 focused tests passing. Known movement retains exactly one failure-only line across both intervals and round trips. Broken tags before and during passing gates, and unreadable tags or origin/main in failed gates, retain their rows and single summaries without fabricated movement. An unavailable enumeration supplies no snapshot baseline; an unresolvable branch supplies no branch baseline.
**Criterion 3:** met — the linked-worktree sibling commit/tag case passes document and plain gates with unchanged task results and updated snapshots; its forced failure names all four known changed fields once. The new passing document/plain damaged-tag witnesses each record one durable passing row. The complete runner-fixtures suite also passed in the required review.
**Criterion 4:** met — no task flipped in the reduced-table sibling reproduction; D002 records the original observation and D012 the rerun. VER-003 F4 is repaired at all four diagnostic Git-read boundaries with direct and linked-worktree regressions, including recovery and a branch-read failure not quoted by the report. The reduced table does not prove every live task ignores shared state.
**Criterion 5:** met — npm run test:docs passed 32 fresh checks in 114.714 seconds at 2026-10-09T22:49:08.242Z. npm test -- --review passed all 38 required suites at 23:02:15.560Z in 771.097 seconds, composing two fresh tasks with 88 eligible reused tasks at the same code identity. Format and vertical ran afresh; vertical passed in 763.463 seconds within its unchanged 900-second deadline. Code identity and build output stayed unchanged. [repair3-gate-transcript.txt](repair3-gate-transcript.txt) and the row readback preserve the passing evidence and both failed attempts. The in-place write-backs and publication locks pass their checks; authority, artifact-identity and verification revision 003 editions were minted and checked; git diff --check is clean; no dependency was added.

self-review: found 1; fixed 1; recorded 0 — two separate root passes and the
later documentation finding in [repair3-self-review.md](repair3-self-review.md).
These are executor passes, not independent worker judgments. No agent was
launched; the two-worker requirement applies before implementation-ready only.

D012 records the repaired rule, evidence, alternatives and reopening conditions.
Strict identity and persistence reads retain their behavior. The conservative
diagnostic omits branch creation/deletion through absent and snapshot intervals
with an unreadable enumeration. Known observations retain their comparisons.
Movement is correlation, not proof of a task failure's cause. The outcome
matches the repair's stated rule and bounded plan.

D013 preserves the historical Git read failure and the later vertical deadline
failure. The Git object existed and the controls passed; the first cause is
unknown. Every completed case in the timed-out vertical run passed, and its
three test files match the earlier passing run. The controlled current-identity
review passed within the original bound; that does not establish the earlier
timing cause. No timeout or scheduling behavior was changed. D014 corrects the
stale review-freshness statement against WO-196, the runner and its executed
composition regression.

Application v0.73.1, skeleton 0.57.1 and harness host 0.35.1 remain compatible
unpublished patches. Local release preparation retains the target. The
harness pins immutable snapshot c73fec2724b847db, with earlier snapshots
retained. Feedback retains the WO-073 edition and its checked WO-199 live audit;
no changed file belongs to its live-feedback source list. The canonical
material inventory is empty.

FUP-2e2e883bf668446d, source revision 2, is settled on the repaired F4 rule and
passing current-identity gates. VER-001 B1 remains deferred on
FUP-f5f10101e717d59b under D004. Adjacent queue revision 10 records both items
completed and no next item.

Final authored outputs are read before repair-complete. Available process-cost
counters, source, scope and cutoff are retained in ignored receipts and the
response; unavailable final counters and dollar cost are unknown. Independent
re-verification remains a separate dispatch.
