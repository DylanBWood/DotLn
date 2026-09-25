# WO-111 repair — 2026-09-24

Dispatch: `resume: fix`, source VER-001. This report records completed
in-scope repairs for re-verification. It does not declare a verification pass
or close the work order.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.156.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

| Finding | Repair and disposition |
| --- | --- |
| B1 | Both v2 receipts and living claims disclose the user Codex configuration change. The read-only census found 36 DotLn scratch/probe trust entries among 43 trusted projects, 34 scratch paths absent. See the [diagnosis](codex-trust-diagnosis.md). **Criterion 2 remains unmet**; D011 / FUP-3c34a8ffbf61376f owns the runtime isolation fix. D012 records the broader inventory. The operator keeps that follow-up independent of WO-111’s outcome (D014). Settings are untouched; the observed criterion-2 failure is preserved for re-verification. |
| B2, m5 | R2 answered in the human work-order map and critical-path plan, including the audit's four-to-twelve-hour implementation measure, incomparable live-episode costs, missing token/dollar baselines and integration-package growth from 46 to 93 top-level source files. No efficiency win or physical package split inferred. |
| B3 | Moved the authorized ledger clarification above the founding corpus, regenerated its index and registered the original two sanitized JSONL streams as evidence projections in the kernel test fixture registry. |
| M1 | Receipts explicitly say no live in-flight return was exercised; recorded phase rules and existing fake-actor kill/finish test are cited. No new live proof claimed. |
| M2 | Separate mission resident/subject/hold made explicit; accurate contract drift replaces the fixture-error explanation, and the portfolio's budget exhaustion is the only observed competing stop cause. Combined mission supervision remains unproven. |
| M3 | Raw-log replay computes ceiling, pending eligibility and timing; both receipts state accounting methods and project each worker/verifier launch, with effective identity unknown. The first also projects its mission launch. Presence authorship is a launch claim. |
| m1–m2 | Caller abort disclosed. Return cancellation uses a no-return replay control; current text links the return receipt for reset/cancellation. |
| m3–m4 | Snapshot exclusions, ignored writes and incomplete first-window generator/command provenance disclosed; no retroactive transcript fabricated. |
| m6 | New JSON arrays use one projection, include refusal reasons, document separate away-time bases and use null offsets for logical-zero configuration events. Original streams retained unchanged. |
| m7–m8 | Wall time corrected to resident timestamp accounting; release preparation's staged PR write acknowledged; reopened FUP-0083/FUP-0108/FUP-0110 named in implementation report. |

[Corrected first receipt](receipt-v2.json), [corrected return receipt](return-receipt-v2.json)
and [implementation](implementation.md) are the current account. Original
receipts, streams, collectors and VER-001 remain inspectable. No branch commit,
push or publication occurred; the runtime source, generated configurations and
dependencies remain unchanged. The only package edit is the two-entry test
fixture registration selected by VER-001 B3.

## Executed evidence

- `node docs/evidence/WO-111/repair-receipts.mjs check`: passed; exact v2
  regeneration from retained logs, original stream hashes, twelve portfolio
  launch records, one mission launch, and return/no-return control assertions.
- `npm run test:docs`: 21 passed, 0 failed, 21 fresh tasks, 24.89 s (final document run before the D014 handoff correction).
- `npm run plan -- check`: passed.
- `npm run publication:check`: passed after reviewing the edition outlines
  against changed claims and refreshing their source locks.
- `npm run release -- prepare --local`: v0.46.3 remains current under patch
  classification; local tag observation only. The staged PR process meter is
  refreshed separately from version assignments.
- `git diff --check`: passed before the product gate.
- `npm test`: 27 passed, 0 failed, 71 fresh tasks, 291.53 s. Subsequent
  changes are document/evidence corrections, with unchanged product code
  identity; the corrected collector is checked separately.

Output review caught an error in the new collector before handoff: pending
count read an absent `pending` property and defaulted to zero. The inspected
`ResidentState` stores episode status in `episodes`. The collector now counts
`dispatched` values there and asserts zero. Both raw prefixes actually contain
five `observed` episodes and no dispatched episode, so the result bytes are
unchanged. The original receipts, streams and VER-001 were also compared
directly with checkpoint 4 and are byte-identical.

No new economy experiment or delegated agent was used. D002 remains the single
experiment record. The adjacent queue was read at revision 0 with no items;
these repairs are the selected failure report's obligations, not new queued
work. The broader trust inventory reopens the existing D011 defect.

## Handoff and independent follow-up

The document repair is complete and ready for re-verification. The observed
config changes remain in the receipts; this handoff claims neither a successful
containment proof nor a verification pass. The verifier judges WO-111’s outcome
on its recorded subject and the operator’s direction.

D013 incorrectly treated the independent runtime follow-up as a prerequisite
for this repair handoff. The operator explicitly rejected that dependency:
“either it is a follow up irrespective of this work order turns out or it is
fixed here.” D014 corrects the interpretation. FUP-3c34a8ffbf61376f remains
independent regardless of WO-111’s outcome; this order does not wait for a new
planning pass, a new order or that follow-up’s completion. Runtime isolation
and settings cleanup are not part of this document repair. Original evidence
and VER-001 are preserved; no finding or acceptance criterion is silently
rewritten.
