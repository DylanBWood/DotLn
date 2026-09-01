# WO-007 — Audit-record baseline (three projections), v0.3.0

**Model:** any capable model.
**Release classification:** `v0.3.0` minor — adds backwards-compatible audit
record and projection capability to the `v0.2.x` source application.
**Depends on:** WO-003 complete (its 13-step demo's JSONL log is the
fixture).

**Cites (read these sections):** 09-audit-resilience-privacy.md (the concern
table, §Canonical audit record, §Fidelity levels, §Persistence and recovery
classes, §Bootstrap sequence — steps 1–3 are this order's scope);
02-domain-model.md (EventEnvelope, Event store, Watcher); 03-architecture.md
§Platform and instance boundary (audit compiles through a shared record
vocabulary).

**Objective:** Bootstrap steps 1–3 of the audit map, against the walking
skeleton's real event log: enumerate the demo's consequential actions and the
questions an operator/verifier must answer about each; pin a minimal
AuditRecord envelope for WorkOrder dispatch, authority decision, external
effect, result, verification, and recovery — as references into the event
store, never a second truth; and produce three projections from the demo log:
an L0 receipt, a causal timeline, and governed raw JSON.

**Scope discipline (one step at a time):**
- Projections are pure folds over the JSONL log, disposable and rebuildable
  (09's projection persistence class). The harness may read the file; the
  folds do no I/O.
- Required properties per action class only — a refusal needs more detail
  than a NoOp; nothing populates every field (09 says so explicitly).
- Steps 4–7 of the bootstrap sequence are explicitly deferred: no access
  control, no crash-ambiguity simulation (that machinery is v0.5.0's), no
  backup/restore exercise, no dashboards.

**Constraints:** zero new runtime dependencies; lives beside or inside the
skeleton package (smallest coherent layout, noted in the result); kernel
untouched.

**Acceptance criteria (all required)**
1. The consequential-action enumeration exists, with the question each record
   answers, per audience (operator and verifier at minimum).
2. The minimal AuditRecord type compiles, and every record references
   canonical ids (eventId/commandId/episodeId) instead of copying payloads.
3. The three projections run over the WO-003 demo log: L0 receipt (outcome,
   scope, time, actor, evidence link), causal timeline ordered by
   correlation/causation, governed raw JSON; each lossy view names its
   omissions and links one level down (09's fidelity rule).
4. Step 9's structural refusal appears in the receipt and timeline with its
   authority decision visible.
5. Re-running the projections over a replayed log yields identical output.

**Write-back duty:** the pinned minimal envelope and its action classes go
back into 09-audit-resilience-privacy.md (candidate → pinned for this rung);
the roadmap's v0.3.0 line already points here; ledger duty applies.

**Evidence gate:** captured projection outputs over the real demo log; every
criterion mapped to a named test or captured output.

**Non-goals:** bootstrap steps 4–7 (access enforcement, crash-ambiguity
reconciliation, restore exercise, dashboards); privacy/retention/redaction
machinery; SQLite; signed export packages; operational logging/metrics (the
concern table keeps them distinct).
