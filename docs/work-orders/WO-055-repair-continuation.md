# WO-055 — Repair continuation: a failing verification compiles a bounded repair WorkOrder for a fresh source-change worker, and re-verification runs from the original contract within a declared round limit (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a continuation program and a
repair WorkOrder derivation to the skeleton; no event schema change beyond
the new types under schema 1. Assigned at activation under the standing
opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
E, the loop slice), cut as a bounded order at the operator's same-day
correction; the containment in criterion 1 answers the first refutation
receipt of this pass
([2026-09-08-critical-path-002](../planning/refutations/2026-09-08-critical-path-002.md),
hold on criterion 1): a derivation that takes surfaces and commands from a
read-only verifier's references could widen a writer's scope.
Planner-synthesized draft; captures and hashes in the ledger section of
that date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-054 merged (the finding shape and capsule this loop
consumes); WO-052 merged (the source-change host that executes the repair);
WO-042 merged (the effective envelope and the admitted grants the
derivation is bound to).
**Recommended placement:** after WO-054; it edits `packages/skeleton/src/reactor.ts`
(the verification and source-change slices' continuation), a new
`repair.ts`, and product 02. A recommendation, not a dependency token.

**Cites (read these sections):** 02-domain-model.md §Independent verification v1 (findings; re-verification from the original contract) and §Events and decisions (the
executable program subset: Sequence, Guard, Await); 03-architecture.md
§Session lifecycle & resilience; `packages/kernel/src/core.ts`
(`stepProgram`; continuations); `packages/skeleton/src/reactor.ts`;
`docs/evidence/WO-010/README.md` (the fix route of the loop);
`docs/work-orders/WO-042-authority-provenance.md` (admitted grants; the
effective envelope).

**Objective:** When a verification result is negative, derive a repair
WorkOrder whose surfaces are exactly the files the finding names plus the
tests it cites, both inside the original order's authority (every named
file within the original's declared surfaces, every cited command among its
named test commands, and the effective envelope and operation lists the
original's under WO-042, never wider), whose contract is the original
contract unchanged, and whose round counter is one higher; a finding that
names an outside path or a reproduction command the original did not
permit yields `NeedsHuman` naming it, derives no order and dispatches
nothing, unless a separately admitted provenance-bearing grant (WO-042)
covers exactly that expansion; dispatch the derived order as a fresh
source-change episode through WO-052; re-verify the resulting commit
through WO-054 from the
original contract; stop at the declared round limit with a terminal
`RepairExhausted` event that names the last finding; express the loop as an
executable-subset continuation so a killed host resumes it.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- WO-010's loop proves the fix route with doubles inside one synthetic
  repository; nothing derives a repair order from a finding, bounds it to the
  finding's surfaces, or limits rounds.

**Design (scope discipline):**

- `deriveRepairOrder(finding, order, grants)` is pure: surfaces from the
  finding's evidence references, tests from its reproduction, the contract,
  base and effective envelope unchanged, `round + 1`; it refuses a finding
  without references, and it returns `NeedsHuman` naming the offending path
  or command for a reference outside the order's declared surfaces or a
  reproduction command outside its named test commands, unless an admitted
  grant with provenance covers exactly that expansion, in which case the
  derived order records the grant id and its envelope stays within the
  grant. A read-only verifier is never the source of writer scope.
- The continuation is a `Sequence` of `Invoke` (dispatch repair), `Await`
  (`SourceChangeObserved`), `Invoke` (verify), `Guard` (round limit) in the
  executable subset, persisted like the existing continuations.
- The round limit is a WorkOrder field with a default of two; exhaustion
  appends `RepairExhausted` and the order's next legal action is human.
- **Declined alternatives, recorded:** letting the repair worker read the
  first worker's transcript (fresh worker, contract and finding only);
  unbounded rounds; widening the repair's surfaces beyond the finding;
  widening them beyond the original order on the verifier's word.

**Deliverables:** the derivation, the continuation, the event type, fixtures
with doubles over the WO-052 target including the negative containment
fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. From a fixture finding whose references and reproduction commands lie
   inside the original order, the derived repair order's surfaces equal the
   finding's referenced files, its tests equal the reproduction commands,
   its effective envelope and operation lists equal the original order's,
   and its contract hash equals the original's; a finding without
   references refuses. A finding that names a path outside the original's
   declared surfaces, and one whose reproduction command is not among the
   original's named test commands, each yield `NeedsHuman` naming the path
   or command, derive no order and change no envelope; negative fixtures
   assert that no dispatch event follows and that the persisted envelope is
   byte-identical. The same outside finding with an admitted fixture grant
   (WO-042) covering exactly that path or command derives an order that
   records the grant's id and whose envelope is no wider than the grant
   allows.
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
reuses this derivation and its containment; changing the finding shape.

**Operator-review assumptions**

1. Two rounds is the right default for the first proof; the field is per
   order.
