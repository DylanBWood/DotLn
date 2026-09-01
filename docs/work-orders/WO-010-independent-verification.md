# WO-010 — Independent verification, v0.6.0

**Model:** any capable model.
**Release classification:** `v0.6.0` minor — adds backwards-compatible
verifier episodes, findings, repair continuation, and evidence staleness.
**Depends on:** WO-009 complete.

**Cites (read these sections):** 06-roadmap.md v0.6.0; 03-architecture.md
§Ports `VerificationAdapter` (blinding, claim-typed evidence, Live Witness,
verification-vs-review separation); 02-domain-model.md (VerificationFinding,
AcceptanceEvidenceMatrix, Evaluation, Verification radius); 01-principles.md
Principle 6; docs/PLAYBOOK.md step 3 (the current manual verification loop
whose evidence-bearing shape this rung begins to automate).

**Objective:** Blinded verifier episodes as a first-class mechanism:
claim-typed evidence mapped into the workstream's AcceptanceEvidenceMatrix;
typed VerificationFinding driving a focused repair continuation in a fresh
episode; substantive repair marking affected evidence stale.

**Scope discipline (one step at a time):**
- Two claim types minimum (state claim, behavior claim); visual and network
  claim types arrive with their consumers at later rungs.
- Blinding is structural: the verifier's compiled WorkOrder contains the
  criteria, the diff, and repo access — never the implementer's narrative,
  transcript, or result prose.
- Verification only; independent code review as a separate episode type is
  v0.10.0's pairing.

**Constraints:** verifier episodes dispatch through the WO-009 transports
(fake transport for the deterministic suite); the matrix is a projection over
evidence events, never a hand-edited file; kernel and compiler purity
unchanged; new runtime dependencies only via ADR-0002 §Amendments.

**Acceptance criteria (all required)**
1. A deliberately planted defect is caught by a blinded verifier, repaired
   via a focused continuation in a fresh episode, and re-verified green —
   end to end through the kernel's event loop.
2. The implementer episode never certifies itself, structurally: a test
   proves the verifier's WorkOrder compiles without implementer narrative,
   and no implementer-emitted event can mark a criterion verified.
3. VerificationFinding carries the domain model's full shape (criterion,
   severity, observed vs expected, reproduction steps, evidence refs, likely
   surface), and each blocking finding compiles to a repair WorkOrder.
4. Substantive repair marks affected evidence stale, and staleness is
   visible in `dotln status` / the matrix projection.
5. The AcceptanceEvidenceMatrix lives and updates through the workstream —
   criterion × evidence × status queryable at any point, never a table
   pasted into the deliverable at the end.

**Write-back duty:** the pinned VerificationFinding payload, staleness
semantics, and matrix projection contract go into 02-domain-model.md; ledger
duty applies.

**Evidence gate:** the planted-defect loop captured end to end (dispatch →
finding → repair continuation → re-verification) with event-log excerpts;
every criterion mapped to a named test or witnessed run.

**Non-goals:** independent code-review episodes (v0.10.0); CI classification
and post-PR loops (v0.10.0); the feedback compiler (v0.7.0); rating
projections over verifier agreement (the Comparison fold stays deferred); web
console.
