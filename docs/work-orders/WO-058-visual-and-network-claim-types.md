# WO-058 — `verification-v1` gains `visual` and `network` claim types with witness rules: a DOM-only witness cannot satisfy a visual criterion, a network claim needs request evidence, and a console error is a failing witness (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A compatible extension of the
`verification-v1` contract (two claim types, five witness kinds) with the
compiler package bumped; every existing capsule and matrix fixture is
unchanged. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the contract slice), cut as a bounded order at the operator's same-day
correction; WO-010 deferred these claim types to their consumer. Planner-
synthesized draft; captures and hashes in the ledger section of that date.
Opaque identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-010 merged (the claim-typed evidence contract this order
extends; satisfied at `v0.12.0`).
**Recommended placement:** any free lane, before WO-059; it edits the
compiler's verification contract module and its fixtures and product 02. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-010",
    "relation": "satisfied-by-release",
    "release": "v0.12.0",
    "reason": "the claim-typed evidence contract it extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Independent
verification v1 (claim types, witnesses, the acceptance matrix);
10-ir-compatibility.md §Separate version axes (compatible extension rules);
`docs/evidence/WO-010/README.md` (the deferred claim types);
`packages/compiler/src/` (the verification contract module) and its tests;
`packages/skeleton/src/verification-protocol.ts` (the matrix fold's inputs).

**Objective:** Extend the contract so a criterion may be typed `visual` or
`network` and be satisfied only by the witness kinds those types admit:
`screenshot` (content hash bound to the criterion id), `dom-snapshot`,
`accessibility-snapshot`, `network-trace` (request and response shapes) and
`console-capture`; the fold rules that a visual criterion with only DOM or
accessibility witnesses is `unverified`, a network criterion without a trace
witness is `unverified`, and a console error captured during a witnessed
scenario is a failing witness for every criterion of that scenario; all with
fixtures that need no browser.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `verification-v1` types claims as behavior and evidence; visual and
  network claims have no type and no witness kind, so a screenshot today is
  narrative.

**Design (scope discipline):**

- The claim types and witness kinds are additive enum members; the
  acceptance-matrix fold gains three rules; the contract version stays `1`
  if the reviewer agrees the extension is compatible (a capsule without the
  new members validates unchanged), otherwise `2` with the migration noted.
- Witness objects are plain data with hashes; no browser code in the
  compiler.
- **Declined alternatives, recorded:** a free-form evidence kind (the fold
  could not judge it); OCR-derived witnesses (out of scope).

**Deliverables:** the contract extension, the fold rules, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. A visual criterion with only `dom-snapshot` and `accessibility-snapshot`
   witnesses folds to `unverified`; with a `screenshot` bound to its id it
   folds to the witness's verdict.
2. A network criterion without a `network-trace` witness folds to
   `unverified`; with one whose request shape matches, to the verdict.
3. A `console-capture` witness carrying an error marks every criterion of
   its scenario failing, and an implementer-emitted success event cannot
   relabel it (the existing matrix rule).
4. Every WO-010 fixture and evidence edition validates unchanged; the
   compiler package version and the contract-version decision are recorded
   in 10.
5. Write-backs land: 02 §Independent verification v1 (the types and rules),
   10 §Separate version axes, ledger entry; a fresh artifact-identity
   evidence edition if the compiler bump requires it.
6. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the adapter that produces the witnesses (WO-059); a browser
dependency; changing behavior claims.

**Operator-review assumptions**

1. Contract version `1` with a compatible extension is acceptable; the
   reviewer may require `2`.
