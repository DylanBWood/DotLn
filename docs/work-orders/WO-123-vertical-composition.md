# WO-123 — `dotln vertical` composition: one command sequences the loop's primitives from a filed intent to a terminal pull-request state with each step's receipt, proven with doubles (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One composition command; no new
primitive. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 10): the loop proof combined composition code with the
final live proof. Planner-synthesized draft; the capture's hash is in the
ledger section of that date. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-052 merged (the source-change host); WO-054 and WO-055
merged (verification and repair); WO-059 merged (browser witnesses);
WO-061 and WO-062 merged (the contract from an issue); WO-124 merged
(surfaces from the contract); WO-064, WO-065 and WO-066 merged (delivery
and the pull-request loop).
**Recommended placement:** after the primitives; it adds the command and
fixtures with doubles. A recommendation, not a dependency token.

**Cites (read these sections):** 12-workstream-application.md §One outcome
from request to return; the orders named in Depends on.

**Objective:** `dotln vertical <issue>` sequences: bundle (WO-062) →
contract (WO-061) → surfaces (WO-124) → derived order → source-change
episode (WO-052) → browser witnesses (WO-059) → verification and repair
(WO-054, WO-055) → lint and publish (WO-063, WO-064) → observation and
resolution (WO-065, WO-066) to a terminal state, recording each step's
receipt under the order; it adds no primitive, and every step's failure is
a typed stop with the step named.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No command runs the loop end to end; each primitive has its own entry.

**Design (scope discipline):**

- The command is a continuation in the executable subset so a killed host
  resumes it at the step it reached.

**Deliverables:** the command, fixtures with doubles, the write-backs below.

**Acceptance criteria (all required)**

1. With doubles for every external actor, the command runs from a recorded
   issue to a terminal state and writes one receipt per step; a kill after
   any step resumes at the next.
2. A failing step (a refused capsule, a lint refusal, a `NeedsHuman`) stops
   with the step named and no later step runs.
3. Write-backs land: 07 (the command), ledger entry.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** the live proof (WO-112); the resident-owned run (WO-118).

**Operator-review assumptions**

1. Doubles are sufficient for the composition; the live proofs follow.
