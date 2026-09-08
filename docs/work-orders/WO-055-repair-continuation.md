# WO-055 — Repair continuation: a failing verification compiles a bounded repair WorkOrder for a fresh source-change worker, and re-verification runs from the original contract within a declared round limit (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a continuation program and a
repair WorkOrder derivation to the skeleton; no event schema change beyond
the new types under schema 1. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
E, the loop slice), cut as a bounded order at the operator's same-day
correction. Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-054 merged (the finding shape and capsule this loop
consumes); WO-052 merged (the source-change host that executes the repair).
**Recommended placement:** after WO-054; it edits `packages/skeleton/src/reactor.ts`
(the verification and source-change slices' continuation), a new
`repair.ts`, and product 02. A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Independent verification v1 (findings; re-verification from the original contract) and §Events and decisions (the
executable program subset: Sequence, Guard, Await); 03-architecture.md
§Session lifecycle & resilience; `packages/kernel/src/core.ts`
(`stepProgram`; continuations); `packages/skeleton/src/reactor.ts`;
`docs/evidence/WO-010/README.md` (the fix route of the loop).

**Objective:** When a verification result is negative, derive a repair
WorkOrder whose surfaces are exactly the files the finding names plus the
tests it cites, whose contract is the original contract unchanged, and whose
round counter is one higher; dispatch it as a fresh source-change episode
through WO-052; re-verify the resulting commit through WO-054 from the
original contract; stop at the declared round limit with a terminal
`RepairExhausted` event that names the last finding; express the loop as an
executable-subset continuation so a killed host resumes it.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- WO-010's loop proves the fix route with doubles inside one synthetic
  repository; nothing derives a repair order from a finding, bounds it to the
  finding's surfaces, or limits rounds.

**Design (scope discipline):**

- `deriveRepairOrder(finding, order)` is pure: surfaces from the finding's
  evidence references, tests from its reproduction, the contract and base
  unchanged, `round + 1`; it refuses a finding without references.
- The continuation is a `Sequence` of `Invoke` (dispatch repair), `Await`
  (`SourceChangeObserved`), `Invoke` (verify), `Guard` (round limit) in the
  executable subset, persisted like the existing continuations.
- The round limit is a WorkOrder field with a default of two; exhaustion
  appends `RepairExhausted` and the order's next legal action is human.
- **Declined alternatives, recorded:** letting the repair worker read the
  first worker's transcript (fresh worker, contract and finding only);
  unbounded rounds; widening the repair's surfaces beyond the finding.

**Deliverables:** the derivation, the continuation, the event type, fixtures
with doubles over the WO-052 target, the write-backs below.

**Acceptance criteria (all required)**

1. From a fixture finding, the derived repair order's surfaces equal the
   finding's referenced files, its tests equal the reproduction commands,
   and its contract hash equals the original's; a finding without references
   refuses.
2. With doubles, a planted defect is found, repaired in one round, and
   re-verified green from the original contract; the repair diff touches only
   the declared surfaces (a fixture asserts the diff's paths).
3. A double that repairs wrongly twice ends in `RepairExhausted` naming the
   last finding, and no third dispatch occurs.
4. A kill between the repair commit and re-verification resumes the
   continuation from the persisted program and does not dispatch a second
   repair.
5. Write-backs land: 02 §Independent verification v1 (the repair derivation and round limit),
   skeleton README, ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the live loop (WO-056); review-comment repair (WO-066), which
reuses this derivation; changing the finding shape.

**Operator-review assumptions**

1. Two rounds is the right default for the first proof; the field is per
   order.
