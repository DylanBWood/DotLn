# WO-056 — Live blinded verification and repair: a planted defect in a real repository is caught by a live verifier, repaired by a fresh worker, and re-verified from the original contract, recorded from an outside terminal (version assigned at activation)

**Model:** the actual local harnesses for the worker and verifier episodes,
run by the operator from a terminal outside the sandbox; launch claims
recorded per episode (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. An evidence record; no runtime capability
change; a defect found needs its own bounded order. Assigned at activation
under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
E, the live proof), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
the target is the WO-053 scratch repository.
**Depends on:** WO-055 merged (the loop this episode runs); WO-053 merged
(the live source-change primitive and the receipt shape it extends).
**Recommended placement:** immediately after WO-055; it edits only
`docs/evidence/WO-056/` and a receipt-shape fixture. A recommendation, not a
dependency token.

**Cites (read these sections):** 01-principles.md Principle 6;
02-domain-model.md §Independent verification v1; `docs/evidence/WO-053/README.md` (the
receipt shape); `docs/work-orders/WO-054-verification-over-real-worktree.md`
and `WO-055-repair-continuation.md`.

**Objective:** Prove, live, that a change can be wrong and be caught without
the implementer certifying itself: plant an implementation that passes a
superficial test and violates the contract; a live verifier finds it; a fresh
worker repairs it within the declared surfaces; re-verification passes from
the original contract; and the negative result could not be relabeled by any
implementer-emitted event.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Every verification proof runs with process doubles; no live verifier has
  judged a real diff in a real worktree.

**Design (scope discipline):**

- The WO-053 fixture generator gains a planted-defect variant; the operator
  runs the loop once per installed harness; the receipt records each
  episode's launch claims, the finding, the repair diff paths, the
  re-verification result, elapsed time and, where reported, tokens.
- **Declined alternatives, recorded:** a defect the superficial test catches
  (that proves nothing about blinding); a verifier that sees the transcript.

**Deliverables:** the variant; `docs/evidence/WO-056/README.md` with
sanitized receipts and JSON; the write-backs below.

**Acceptance criteria (all required)**

1. For at least one harness, the live verifier's finding names the contract
   clause violated with expected, observed, reproduction and evidence
   references, while the superficial test passed.
2. The repair episode's commit touches only the finding's surfaces and
   re-verification passes from the original contract hash.
3. A fixture replays the receipt's event log through the matrix fold with an
   injected implementer success event and the negative result stays
   negative.
4. Every claim is labeled `observed`, `launch-claim` or `unknown`.
5. Write-backs land: 06 (the vertical rung's verification sentence), the
   capability table's verification row reassessed, ledger entry.
6. `npm test` green; `git diff --check` clean; no runtime source, generated
   configuration or dependency change.

**Evidence gate:** the receipts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** browser evidence; the operator's repositories; pull requests;
any runtime fix.

**Operator-review assumptions**

1. The operator runs the episodes outside the sandbox and files the receipt.
