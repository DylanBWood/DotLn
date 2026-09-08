# WO-116 — Audit projection served: the canonical audit record's projections are readable through the parity surface with fidelity labels, so a UI can audit what the runtime did without a second source (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One read projection over the WO-007
audit fold exposed through WO-115's surface. Assigned at activation under
the standing opt-out default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
that the runtime has the UI to audit; 09-audit-resilience-privacy.md's
canonical audit record and projections (WO-007). Planner-synthesized draft;
captures and hashes in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-115 merged (the surface); WO-007 merged (the audit fold;
closed).
**Recommended placement:** after WO-115; it adds the projection to the
resident's read commands and a render to the text host. A recommendation,
not a dependency token.

**Cites (read these sections):** 09-audit-resilience-privacy.md §Canonical
audit record, §Fidelity levels and §Audit projections and visualizations;
`packages/skeleton/src/audit.ts`; `docs/work-orders/WO-007-audit-record-baseline.md`.

**Objective:** The `audit` read command returns the canonical audit record's
three projections for a selected order or episode with their fidelity labels
and the causal links the fold recognized; the text host renders them; no
projection includes bytes the privacy rules exclude.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The audit projections exist as a baseline command over the log; no UI
  surface serves them.

**Design (scope discipline):**

- Read-only; the fold is WO-007's; the labeled adjacency fallback stays
  labeled.
- **Declined alternatives, recorded:** a new audit format.

**Deliverables:** the command, the render, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. Over the fixture log, the command's output equals the baseline command's
   projections byte for byte with fidelity labels present.
2. The render shows the three projections and the labels; a privacy fixture
   proves no excluded bytes.
3. Write-backs land: 09 §Audit projections and visualizations (the served
   projection), console README, ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** new audit semantics; visualizations beyond text.

**Operator-review assumptions**

1. Text is the reference render; the fork's shell draws the visualizations.
