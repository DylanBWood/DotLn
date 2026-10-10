# WO-198 fourth repair handoff

Dispatch: `resume: fix`, repairing [VER-004](../../verifications/WO-198/VER-004.md)
F5. Earlier handoffs remain in [repair3-handoff.md](repair3-handoff.md),
[repair2-handoff.md](repair2-handoff.md), [repair1-handoff.md](repair1-handoff.md)
and [implementation-handoff.md](implementation-handoff.md).

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.162.1","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}

These are the selected session values from the canonical briefing. The order
recommends xhigh; no effective-effort claim is made.

**Criterion 1:** met — both passing rows at code identity a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8 carry all four sharedRefs fields at start and end. [repair4-row-readback.json](repair4-row-readback.json) agrees independently with the persisted hot index. Missing branches record absent; unavailable reads record unreadable without throwing or consuming partial output. The current-identity runner-fixtures suite passes the missing, damaged-ref and launch-failure cases.
**Criterion 2:** met — [repair4-fixture-transcript.txt](repair4-fixture-transcript.txt) records 17 focused tests passing, and the full current-identity runner-fixtures suite passes in 126.537 seconds. The comparison names branch creation/removal through absent, withholds only each unreadable field on either side, and preserves the remaining readable changes. A linked-worktree witness names origin/main absent..<commit> exactly once between two failed gates and reads both durable rows and the summary independently. Existing failure-only, during-run, round-trip and malformed/legacy-baseline cases pass. D017 states the repaired rule and the permitted choice to record dangling/non-commit refs as absent.
**Criterion 3:** met — the linked-worktree sibling commit and annotated tag change no task result in the document and plain gates; the second rows contain the new snapshot and passing rows print no delta. Its forced-failure case names all four changed fields once. Both the focused transcript and the complete current-identity runner-fixtures pass establish the regression.
**Criterion 4:** met — no task flipped in the reduced-table sibling reproduction. D002 records the original observation; D017 and the current transcripts record its rerun. F5 is repaired at the reader and field comparison with direct combinations and one new linked-worktree witness. The extra unreadable refs/dotln/ comparison cases were not quoted by VER-004. The reduced table does not prove that every live task ignores shared state.
**Criterion 5:** met — npm run test:docs passed all 32 suites with 32 fresh tasks in 126.059 seconds at 2026-10-10T00:05:43.731Z; npm test -- --review passed all 38 required suites with 90 fresh tasks in 1731.679 seconds at 2026-10-10T00:34:59.431Z. Vertical passed in 878.244 seconds within its unchanged 900-second deadline. Both rows retain unchanged code identity and build output. [repair4-docs-gate.txt](repair4-docs-gate.txt), [repair4-review-gate.txt](repair4-review-gate.txt) and the row readback preserve that evidence. Product 07's sentence and publication lock are corrected in place; revision 004 authority, artifact-identity and verification editions are minted and checked; git diff --check is clean; no dependency was added.

self-review: found 0; fixed 0; recorded 0 — two separate executor passes in
[repair4-self-review.md](repair4-self-review.md). These are not independent
worker judgments. No agent was spawned; the two-worker duty applies before
implementation-ready only. The original worker reports remain preserved.

D017 records the evidence, alternatives and reopening condition. The outcome
matches the announced rule: absent participates in comparisons, unreadable
withholds only its own field, and diagnostic reads preserve gate outcomes,
rows and summaries. Movement is correlation, not proof of a failure's cause.
Strict identity and persistence helpers retain their behavior.

D018 records the corrected generator invocation and immutable revision 004
selection. Application v0.73.1, skeleton 0.57.1 and harness host 0.35.1 remain
unpublished compatible patches. The installed harness selects immutable
snapshot 17cefbf2c2f320ac and retains earlier snapshots. The retained WO-073
feedback edition carries the checked WO-199 feedback-004 live audit; the
changed files are outside its live-subject source list and no live episode
was launched.

D019 records the passing subject, timings and correction of a premature chat
claim based on progress lines. All 34 historical verification-report and
revision-001/002/003 evidence files byte-match checkpoint 17. Earlier reports
and evidence remain unchanged. No repository file was written and no agent
was started while either gate ran; the native commands and canonical waiters
have exited, with zero active gates.

FUP-3ff0f28b45270ead, source revision 1, is settled on D017's rule and D019's
passing current-identity evidence. B1 remains deferred under D004 on
FUP-f5f10101e717d59b. The adjacent queue's two prior items are complete, with
no next item; the canonical material inventory is empty.

Final authored outputs are read before repair-complete. Final process-cost
counters stay in ignored receipts and the response, naming their source,
scope and cutoff. Dollar cost is unknown. Independent re-verification is
still a separate dispatch.
