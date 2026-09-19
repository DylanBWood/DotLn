# WO-142 implementation evidence

The first implementation failed VER-001, and [repair 001](repair-001.md)
failed VER-002. [Repair 002](repair-002.md) failed VER-003.
[Repair 003](repair-003.md) records the terminal-state and prompt-delivery repair.
Repair 001 addressed F1–F4 and N1–N14, integrated WO-084,
and included the operator's Node 26 / TypeScript 7 expansion. The observations
below describe the earlier subject; they are retained as history, not current
passing evidence. Current authority revision 004 records the repaired bundle;
artifact, verification and feedback remain at revision 002. Earlier recordings
are preserved.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

WO-142 prepares application **v0.32.0**: the follow-up collector admits actions,
carried orders survive activation stamps, advisories retain distinct identities,
invalid inputs refuse at their existing boundaries, live documentation matches
recorded outcomes, and local residue has an explicit preview/apply command.
The [row dispositions](rows.md) preserve every obligation. B12(b) is returned
with [a named replay follow-up](decisions.md#wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity);
its starred budget-collision subpart is fixed. A7’s missing ownership context
was not reproduced. A separate pre-existing append normalization issue is
[boarded for replay-scoped work](decisions.md#wo-142-d005--defer-the-pre-existing-append-serialization-divergence).

The original implementation used one repository writer and three reused read-only
helpers to inspect grouped rows and run disposable external counterfactuals. No branch
commit, push, PR, release publication, account change or real prune deletion
was performed. The original executor deferred `npm test`; repair 001 ran the
integrated gate. Verification and final review remain separate dispatches.

## Original implementation observations

The root build passed. The broad package run executed 592 tests: 581 passed;
remaining failures identified stale generated editions/fixtures and two test
assumptions, which were corrected and rerun with their owning test files.
The 66 focused new package checks passed. Work-order fixtures passed 19/19;
runner, observation and mutation fixtures passed 63/63; contribution/license
fixtures passed 9/9. The original combined harness/process run passed 129/138;
its nine failures were traced to intentional advisory behavior, stale entropy
identity or fixture setup, and the corresponding focused checks were rerun.
The final check record below distinguishes those corrective runs from a claim
that the original failing aggregate was green.

[A15 transcripts](a15-transcripts.md) record twelve deliberately broken subjects,
each rejected by its named fixture. [Counterfactuals](counterfactuals.md) cover
all other fixed row groups. Current-subject fixture assertions remain in the
normal existing suites; no new suite or recurring gate was added.

The one live feedback audit used `codex-cli-exec`, selected model
`gpt-6-astra`, effort `xhigh`, CLI `0.155.0`. It completed all acceptance rows,
records ten passing mechanisms and ten removal failures, and measures **1,192
fewer instruction bytes** in the matched feedback projection. Its report and
independent verification event streams are in [feedback](feedback/feedback.json).
The recorder and current-source feedback check both passed. Raw transport
receipts and available usage stay in ignored local storage.

The new authority, artifact identity and synthetic verification editions are
selected by `docs/evidence/current.json`. Historical evidence remains intact.
The entropy migration reproduces the historical hash before proving exactly
four authorized Shape-First changes; Seiri, the frozen decision oracle,
authority envelopes and non-Shape-First definitions retain their checks.
The current compiler fixture hash is `fnv1a64:04b7ff37e73a6cd0`; the separate
review-input fixture hash is `fnv1a64:843ab5458a939d25`. These are different
recorded inputs, not competing identities for one subject.

## Cost and retention observations

The planning record measured 364 untriaged rows before settlement and zero
after it. At the original implementation handoff, index generation reported
419 total, 83 pending and **2 untriaged**. Final review must repeat this on its integrated
subject; this is not a merged-tree claim. New ordinary decisions do not refill the feed; the resident
NoOp and append-normalization follow-ups are intentionally actions. Next planning/refutation/reviewer
observations remain the benefit test, not an invented estimate of saved tokens.

[Cold-start measurement](harness-context.json) counts installed instruction and
role source bytes only. Against activation HEAD, executor, verifier and
reviewer each gained 327 bytes; the other three roles gained zero. Repair 002
refreshes this file: executor 21,176, verifier 18,218 and reviewer 19,436 bytes
in both roots, with headroom 3,400 / 2,262 / 1,044 bytes. The
[activation comparison](decisions.md#wo-142-d006--keep-the-assigned-minor-release-and-measure-the-actual-cost)
is distinct from the tool's historical v0.16.0 baseline. Both harness roots
remain within their existing ceilings. It does not estimate this work order’s task
context or the model’s private instructions.

The entry checkout had one snapshot, 2,747,865 bytes, and a shared dead cache
of 97,838,994 bytes. The [final real preview](prune-preview.json) found four
snapshots totaling 11,098,502 bytes, retained three pinned snapshots and listed
one old snapshot plus the cache as eligible: **100,586,859 bytes**. Full
before/after inventory digests matched, so preview deletion was **zero bytes**.
There were no retained close lanes in this checkout. Five temporary-root prune
fixtures cover explicit apply, safe internal snapshot links, malformed pins,
publication binding, live ownership and durable deleted-lane byte proofs.
Legacy or unknown session ownership is conservatively retained.

Execution duration and usage are reported at handoff with source and cutoff.
Counters unavailable at a stated cutoff are not estimated; final readback is
reported separately. This order adds no periodic
cleanup, extra live refutation, or additional full product gate.

## Final check record

The following is the original implementation check record from 2026-09-19.
[Repair 003](repair-003.md) records the current 35/35 integrated and 19/19
document results. Report-only completion notes do not change the checked
product source or generated editions.

| Check | Observed result |
| --- | --- |
| `npm run test:docs` | **17 passed, 0 failed; 277.50 s; 17 fresh tasks.** Includes build, formatting, release surfaces, publication locks, index, both document suites, planning checks, meta, harness/context and current evidence checks. |
| First final document run | 12 passed, 5 failed: one PR-body soft-wrap failure and four dependent suites not run. The prose correction above was followed by the fully passing run. |
| Corrective package projections | `node --test` over console board, entropy artifact/residue and scenario owning files: **68/68 passed** after edition/fixture corrections. The worker canonical-argument fixture separately passed 1/1; focused new package cases passed 66/66. |
| Corrective harness/process fixtures | B1 observer/advisory identity, B17 and original D1 checks passed 6/6; all previously failing process fixtures passed their corrected focused runs; current WO-039 entropy fixture and A21 caption each passed. New A1/A21/B15 checks passed 4/4. |
| Final prune integration | `node --test --test-name-pattern='WO-142 D1' scripts/test-harness.mjs`: **5/5 passed**, including manifest/publication/link corrections. |
| Planning amendment correction | The original planning fixture run passed 41/42; the corrected anchored-heading/oversized-length case passed 1/1. The original-heading and removed-length-guard counterfactuals each fail their intended assertion. |
| Current generated surfaces | `node scripts/harness.mjs check`: 31 surfaces pass. Authority, artifact-identity, synthetic verification and feedback evidence `--check` commands pass; five console fixtures match JSON, terminal and HTML. |
| Release/lifecycle fixture positives | Backup, checkpoint, resume, worktree, release success/edition/firstrelease/dirty/surfaces commands pass in disposable copies with the applied source/fixture proposals. Twelve A15 counterfactuals fail at their intended assertions. The root's final release-surfaces command also passes. |
| Dependency and diff checks | External package-lock entries match activation HEAD as parsed data; no external dependency added. `git diff --check` passes. Added source-comment lines and both new source files contain no suppression directive. |

The first failing package/harness aggregate is retained as a failed observation;
it is not relabeled as passing. The successful owning-file and focused reruns
discharge those failures. The original handoff deferred the full gate. The
repair receipts above record their integrated checks; they do not claim formal
verification or publication.
