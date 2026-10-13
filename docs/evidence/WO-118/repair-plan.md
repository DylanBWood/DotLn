# Bounded repair proposal

The initial live run is preserved as failed. The operator authorized both repairs in this order (WO-118-D003).
This is the bounded implementation plan.

1. In `packages/skeleton/src/vertical-host.ts`, leave the existing source-change
   command pending when its worker reports a typed interruption and its current
   launch authority is still positively admitted. The resident can then revisit
   the pending command on its next tick. Reuse `SourceChangeHost`'s existing
   termination proof, integrity checks, command identity, commit recovery and
   two-attempt limit. Other failures and revoked/expired authority keep their
   existing refusal behavior. Prove native interruption before commit,
   interruption after commit, exhausted attempts and authority loss through the
   composed resident/vertical tests; do not broaden recovery to arbitrary errors.
2. In `scripts/launchpad.mjs`, include the compiled console package in the kit's
   runtime package set and update the export tests' explicit inventory. Its
   dependencies are the already-carried kernel, compiler and skeleton packages.
   Prove the exported console CLI can start against the exported resident and
   expose its status. Browser-evidence remains a separate, unexercised visual
   adapter; this status-text scenario requires no browser runtime dependency.
3. Rerun the full proof from an export containing the reviewed candidate bytes,
   using model intake and triage without injected judgments. Retain the initial
   failure alongside the new run. No mainline commit or publication is part of
   this executor dispatch. The proof still owes its fault injections, repair,
   review controls, outward checks, transcripts and independent reviews.

The source interruption distinction needs care: return/revocation can also
interrupt a worker, so the exception must require current authority. A native
signal alone is insufficient evidence to retry. The console's status projection
also has a documented limit: the initial snapshot exposes portfolio phase and
order state but not vertical step details; phase evidence remains the vertical
receipts, as the work order specifies.

## Separately proposed document-gate repair

`npm run plan -- check` currently rejects criterion 6's required status sentence
in product 00: `checkPlanContinuation` fixes the entire story section as a
planning input, while `PlanExecutionAmended` authorizes only order text. No
existing canonical command binds an execution write-back. Preserve the sentence
and the existing reviewed planning receipt.

Additional operator scope authority granted in WO-118-D004: extend the existing amendment's
hashed structured decision with an exact `executionWritebacks` declaration for
`docs/product/00-vision.md`, section `The one-paragraph story`, the unchanged
reviewed criterion's hash, and the reviewed/current section hashes. Validate the
current amendment and decision binding before admitting that exact change; keep
every other fixed input check. No event schema change or new planning pass.
The likely source surfaces are `scripts/lib/plan-receipts.mjs` and
`scripts/lib/plan-continuation.mjs`; regression tests in
`scripts/test-plan-refutation.mjs` must reject an extra byte, changed criterion,
stale hashes, another section/path, missing authorization, withdrawn amendment,
and unrelated vision/role/sequence edits. A short product 07 explanation records
the exact-byte execution path. The operator authorized this bounded third repair in the same executor dispatch.
