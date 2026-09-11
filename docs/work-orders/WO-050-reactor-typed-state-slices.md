# WO-050 — The skeleton reactor's state splits into typed slices behind one decider, with every recorded trace byte-identical, so the next host branch lands in its own slice (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A structural refactor of the skeleton's
reactor state with no event, contract or hash change; the skeleton package
moves. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the phase-two plan's code table (2026-09-06), which
declined a reactor split with the reversal condition "the next order that
adds a host branch carries the split into typed state slices as its first
phase"; the 2026-09-08 critical-path planning pass, whose source-changing
worker candidate honored that condition; and the operator's same-day
correction that the horizon's orders be small, under which the condition is
honored as its own bounded order rather than as a phase of the host order.
Planner-synthesized draft; captures and hashes in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-016 merged (the single reactor for live and replay;
satisfied at `v0.3.6`); WO-010 merged (the verification branch, the last
host branch added; satisfied at `v0.12.0`).
**Recommended placement:** any free lane, before the source-change host
(WO-052), which is the next host branch; it edits `packages/skeleton/src/reactor.ts`
and the state types the hosts read. Sequence it beside WO-047 with a merge of
the shared replay call sites, or after it. A recommendation, not a
dependency token.

**Cites (read these sections):** 03-architecture.md §Layer diagram (one decider; the ownership guard) and §Session lifecycle & resilience;
02-domain-model.md §Events and decisions (Reactor; state is a fold of the
log); `docs/planning/phase-two-plan-2026-09-06.md` §Code table (the declined
split and its reversal condition); `packages/skeleton/src/reactor.ts`,
`worker-host.ts`, `verification-host.ts`, `scenario.ts`;
`packages/skeleton/test/scenario.test.ts` (the frozen 13-step oracle);
`docs/evidence/WO-009/README.md` and `docs/evidence/WO-010/README.md` (the
recorded traces this order must reproduce).

**Objective:** Split the reactor's application state into named typed slices
(the walking-skeleton episode state, the worker episode state, the
verification state, and a reserved slot for the source-change episode) folded
by one decider through one exported reactor, so that WO-052 adds its branch
as a new slice and fold rather than by growing the existing ones, while the
frozen 13-step oracle, every recorded worker and verification trace, and
every semantic projection are byte-identical.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The reactor holds one state object read by three hosts; the phase-two plan
  counted 46 skeleton files and one decider and recorded the split as the
  condition for the next host branch rather than doing it without a
  consumer.
- WO-052 is that next branch. Adding it to the current shape would make the
  fourth host read the same untyped object and would make WO-047's
  projector's only consumer a wider blob.

**Design (scope discipline):**

- One exported `SkeletonState` composed of typed slices with an explicit
  `version: 1` marker on the composed shape; the decider dispatches each
  event type to its slice fold; a slice never reads another slice's fields
  except through a named selector exported beside it.
- `replay` is called with the explicit projector from WO-047 when that order
  has landed, reading RNG state and policy from the kernel-facing slice;
  otherwise the reserved keys stay at the top level and the order records
  that the projector is pending.
- Every host reads through selectors; the ownership guard's one-decider rule
  is unchanged and its test still passes.
- **Declined alternatives, recorded:** a package split (`worker-runtime`,
  `runtime-contracts`, as the audit proposed) before a seam needs it;
  changing any event type or payload; a state schema version on disk (state
  is a fold, never persisted).

**Deliverables:** the slice types, folds and selectors; the host call-site
changes; the identity fixtures; the write-backs below.

**Acceptance criteria (all required)**

1. The frozen 13-step scenario, the WO-009 worker traces, the WO-010
   verification traces and the WO-011 feedback traces replay to byte-identical
   complete Decisions and semantic projections before and after the split
   (`cmp` transcripts).
2. A test enumerates the slices and their event types and fails when an event
   type is folded by two slices or by none.
3. Every host reads state only through exported selectors, proven by a grep
   test over `worker-host.ts`, `verification-host.ts` and `scenario.ts`.
4. The reserved source-change slice exists as an empty typed slot with no
   fold, so WO-052's diff adds a fold and touches no other slice.
5. Write-backs land: 03 §Layer diagram (one sentence on slices); the
   phase-two plan's code table gains a dated note that the reversal condition
   was honored here; skeleton README; ledger entry.
6. `npm test` green; `git diff --check` clean; no new dependency; no hash
   preimage or event schema change; the regenerated bundle pins and a fresh
   feedback evidence edition because runtime source changed.

**Evidence gate:** the identity transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** any new event type or host (WO-052); a package split; the
replay projector itself (WO-047); changing `authorize` or cadence.

**Operator-review assumptions**

1. A byte-identical trace set is sufficient evidence that a structural
   refactor changed no behavior.
