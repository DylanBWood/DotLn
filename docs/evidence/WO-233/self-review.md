# Executor self-review

## Original implementation review

Two fresh read-only workers reviewed the work order and diff using
`codex-spawn-agent`, `gpt-6.1-sol`, effort `max`. No worker wrote repository
files or ran tests. The executor remained the only writer. Two admissions
were used; the same workers checked the first fixes.

The criteria adversary reported four original findings and two distinct
follow-up defects introduced during their repair. Its additional shell
observation continued the original ancestor-protection finding. The design
improver reported two original findings and two introduced defects. A later
criteria recheck reported three additional cleanup and retention defects.
The final criteria recheck identified the follow-up worker transition and a
retention-policy change during a session. The worker transition had already
been corrected in source outside its supplied patch; its requested end-to-end
regression now passes. The criteria worker's total is eleven distinct findings; the design worker's is
four. The table records both reports and their dispositions.

| Finding | Source correction | Executable coverage |
| --- | --- | --- |
| A retained child could be removed through its parent, including shell EXIT | Gate, prune and session cleanup respect nested owners; automatic shell teardown uses the completion route | Nested retained parent/child fixture; shell lifecycle cases |
| Normal failing-test teardown removed diagnostic roots | Whole gate-fixture teardown waits for the recorded suite outcome; shell nonzero EXIT marks failure | Runner child `node:test` case with `t.after` and container exit cleanup |
| Logging a removal recreated a deleted worktree | Skip ledger writes when its owning repository no longer exists | Orphan capture/deleted worktree fixture |
| Retained nested roots counted files twice | Count the outer retained inventory once | Exact nested inventory/churn assertions |
| Deleting a child changed its legacy parent's age | Judge all nested owners, then remove an eligible ancestor as one checked tree | Legacy parent with eligible owned child apply fixture |
| Promotion and parent inventories overlapped | Count nested promoted material through its containing root | Exact parent/promoted-child churn assertions |
| Lifetime ledger grew and was replayed without a bound | Independent root-token segments retire after removal and durable gate metrics | Repeated root disposal and explicit gate retirement fixture |
| A malformed unrelated marker stopped session cleanup | Filter registration metadata before opening markers; isolate errors per matching root | Unrelated malformed marker, own blocker and healthy own root fixture |
| Generic retirement could erase unfinished gate metrics | Only explicit terminal gate retirement removes gate segments | Generic retirement retains metrics until explicit terminal retirement |
| Segment readers/retirees raced with independent deletion | Skip vanished segments and make retirement deletion idempotent | Concurrent execution in the complete gate; source-level ENOENT handling |
| Crash recovery ignored explicit or class null retention | Normal completion and terminal-row recovery share one retention judgment | Terminal-row crash recovery with null capture override and null scratch class |
| Gate-end deletion bypassed a sibling's writer or lane | Check foreign live/unknown reservations and lanes before changing or deleting a root; serialize gate cleanup with prune | Nested runtime capture protected first by a live sibling writer, then by its lane |
| Orphan retention counted from creation instead of owner exit | Apply records the first proven-dead observation and starts the full orphan window then; preview writes nothing | Long-lived owner, death observation, full post-observation window and later apply |
| A restarted review worker could lose scratch protection before another status observation | Preserve every dispatched task without positive terminal evidence | Spawn, observed completion, follow-up, then immediate session cleanup preserves scratch without another worker-status snapshot |
| Session completion deleted a class whose policy changed to null after creation | Check the recomputed completion policy before removal | Change session-scratch retention from 24 hours to null and assert completion preserves it |

self-review: found 15; fixed 15; recorded 0

These are source review dispositions. The complete gate and final handoff
supply the executed validation; the workers did not claim a passing gate.

## Repair of VER-004

This run used three fresh read-only workers through `codex-spawn-agent`,
with the prescribed `gpt-6.1-sol`, effort `max`: `repair_criteria`,
`repair_design` and `repair_consistency`. They did not inherit the parent
conversation, write files, run tests or spawn descendants. The initial
inputs were the current work order and repair diff; additional specific
implementation and metadata sources were authorized as requested. Actual
effective-session model readback was unavailable; these are supplied pins.
The three earlier interrupted workers produced no completed reviews and
count toward session admissions only. This run started six workers total.

The criteria reviewer found three defects, the design reviewer two and the
consistency reviewer seven, including transferred metadata findings.

| Reviewer / finding | Correction | Check or supporting evidence |
| --- | --- | --- |
| Criteria: absent child gate id or inner completion suppresses live containing-gate protection | Exempt only completion of the actual containing gate | Ordinary-prune controls with and without an own gate id and with an inner completion |
| Criteria: an older authorization prefix shadows approved appended scope | Prefer the most specific bound source for committed validation | Successive replacement and append fixtures |
| Criteria: current decision metadata or a pending withdrawal rewrites committed authorization | Read the committed log prefix and decision bytes for committed validation; keep workspace latest-only | Same-decision writeback rebind and pending-withdrawal fixtures |
| Design: recovery cannot resume after writing its backup or first partial marker update | Compute completion before one marker write; validate and reuse the exact original backup | Source recheck accepted the correction; successful original recovery and read-only follow-up retain all five markers |
| Design: an interrupted synthetic-control removal leaves an empty directory without its marker and cannot resume | Require the existing archived record, unchanged filesystem identity and an empty directory before restoring the marker and completing token-checked disposal | Source recheck accepted the correction; recovery preserves the real failed fixture and all original marker bytes |
| Consistency: the decision describes one recovered record while execution recovered five | D069 supersedes D060 with the full checked set and preservation conditions | repair-ver004-recovery.json and source inspection |
| Consistency: current evidence summaries describe earlier repairs and omit the third reviewer | Label historical README results and update current obligations | README and session-failure record; final handoff review follows the complete run |
| Consistency: product guidance overstates what the summary advisory parses | Describe its existing line-shape check accurately, preserving the three-reviewer duty | Existing verification-review fixture covers the actual accepted forms |
| Consistency: planning write-back guidance omits the committed/workspace distinction | Explain each snapshot's authorization source in product 07 | D068 and the successive-amendment implementation |
| Consistency: the three-reviewer migration leaves an old test expectation and two-report verifier consumers | Update the existing role test, generated verifier roots, product guide and playbook to all three current execution/repair reports | Eight executor-supports tests pass in the bounded reproduction; generated roles and current role oracle are refreshed |
| Consistency: committed decision hashing differs from the current reader for authored metadata keys | Apply the same metadata projection in both snapshots, preserving historical serialization | Extra path/workOrder/anchor/recordSource keys in the successive-amendment fixture |
| Consistency, transferred from the document gate: three current dispatch labels lack the required initial control prefix | Correct the labels without changing their failure descriptions; rebind D066 and restore D067 as the latest approved scope through the existing amendment command | D074 and repair-ver004-docs-failed001.json preserve the failed gate; the direct planning check after rebinding passes |

self-review: found 12; fixed 12; recorded 0

The criteria reviewer statically confirmed all three corrections; the design
reviewer confirmed both. The consistency reviewer confirmed its first six
corrections and initially passed the final write-backs. The document gate then
found the malformed dispatch labels; that class was transferred to the same
reviewer, who also identified the dependent D066 binding. D074 records both
corrections and the passing planning check. The same reviewer confirmed the
corrected final write-backs and all seven consistency fixes with no new
finding, before the document gate is rerun.

The third complete run passes with 114 fresh tasks across 48 suites;
repair-ver004-review-evidence.json records it. Both unchanged VER-004 probes
pass in repair-ver004-probes.json. The final document check remains required
before repair-complete.
