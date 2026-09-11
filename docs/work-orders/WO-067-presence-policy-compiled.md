# WO-067 — PresencePolicy compiled: a build declares how its actor behaves when the operator is away as a progressive curve over attention, scope, effect authority and external capability, lowered to cadences and per-phase envelopes that can only narrow the base (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. An additive `presence` collection in the
loadout graph and its lowering; every program without one keeps its exact
semantic hash; the compiler package moves. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** ADR-0007 (presence is a policy input), product 03
§Operator-presence policy and its candidate on progressive absence
authority, the planning map's unallocated product candidate on profiles,
PresencePolicy and unattended portfolios, and the operator's 2026-09-08
mid-pass direction during the critical-path planning pass: the predecessor
runs an "operator away" cron whose work starts small and widens, and the
successor is an offline application that dispatches several actor kinds on
richer policies than a cron. Planner-synthesized draft; the messages are
preserved verbatim in the pass's ignored correction capture, whose hash is
in the ledger section of that date. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-042 merged (a phase envelope is a narrowing under the
monotone floor; nothing in a presence policy may widen); WO-008 merged
(compiler v1; satisfied at `v0.4.0`).
**Recommended placement:** first order of the resident-runtime gate,
immediately after WO-042, in any free lane beside the codecs and the
harness-truth record; it edits `packages/compiler` (types, compile,
normalize, render), skeleton loadout fixtures and products 02, 03 and 04. A
recommendation, not a dependency token.

**Cites (read these sections):** ADR-0007; 03-architecture.md
§Operator-presence policy and §Candidate — progressive absence authority
and return readiness; 02-domain-model.md §Events and decisions (Cadence;
the executable subset) and §LoadoutGraph v1 payload contract (additive
collections; claims after WO-042); 04-interfaces.md §RPG / Path-of-Exile
view (PULSE and INTERRUPT in the tooltip); 05-pattern-library.md §5S / 6S
(Sustain as the cadence); `docs/planning/work-order-map.md` (the
PresencePolicy candidate's fixture list: hold, decay, progressive authority,
peak/reset/loop, return races, unavailable adapters, preauthorized
portfolio); `packages/compiler/src/compile.ts`, `types.ts`, `render.ts`.

**Objective:** Add an optional, additive `presence` collection to the
loadout graph: a policy names its axes (attention, work scope, effect
authority, observed external capability), an ordered list of phases each
with an entry cadence or condition, a scope (surfaces, a change-size
ceiling, a budget) and an envelope narrowing, a curve rule (`progressive`:
enter the smallest phase on absence, advance one phase after each verified
success, reset to the smallest on any failure or at the peak), a return
rule (`cancel-on-return` applies to phases marked `discretionary`: no new
discretionary dispatch after the operator returns and in-flight
discretionary episodes finish or are killed per the phase, while an
explicitly requested foreground task continues under its own authority) and a decay rule
(what expires after a declared idle time); lower it to kernel cadences,
statechart gates and per-phase effective envelopes that are always a
narrowing of the base; and render the curve in the tooltip's PULSE and
INTERRUPT sections.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- ADR-0007 decides that presence is a policy input and product 03 records
  the four axes and the fixture families; no collection, lowering or
  fixture exists. The Entropy Reducer's reevaluation cadence is prose in
  the 5S set's umbrella.
- Every compiled envelope is one static set; nothing expresses "small
  reversible changes first, more as each verifies, reset at the peak",
  which is the predecessor's unattended behavior the operator described.

**Design (scope discipline):**

- Phases are data; a phase envelope is validated with WO-042's floor (deny
  only, or restore a base allowance); the peak phase may equal the base and
  never exceed it. Change-size ceilings are counted in files and lines by
  the host, not declared by the actor.
- Cadence emissions use the kernel `Cadence` shape and the executable
  subset; the resident host (WO-068) evaluates them; the compiler emits,
  it never schedules.
- The operator's curve is read as: probe (one file, reversible), widen
  (several files in one surface), peak (the portfolio's full scope), then
  reset and loop; the reviewer confirms this reading or edits the fixture
  policy, which is data.
- **Declined alternatives, recorded:** a schedule language in the loadout
  (cadences suffice); presence as a runtime flag outside the build (the
  build must carry it so a fork's actor behaves the same); any phase that
  widens beyond the base.

**Deliverables:** the collection, validation, lowering and render;
fixtures for hold, decay, progressive authority, peak/reset/loop, return
races and unavailable adapters; the write-backs below.

**Acceptance criteria (all required)**

1. A fixture policy with three phases compiles: each phase's effective
   envelope is a narrowing of the base (fixture-asserted per phase), the
   cadence emissions are in the executable subset, and the tooltip pins the
   curve under PULSE and INTERRUPT.
2. A phase that would widen beyond the base refuses with
   `AUTHORITY WIDENING`; a policy with an unknown curve or return rule
   refuses naming the field.
3. Fixtures prove the curve as data: hold (no phase entered while present),
   progressive advance after a verified success, reset on a failure, reset
   at the peak, cancel-on-return with an in-flight discretionary episode killed or
   finished per the phase and a requested foreground task continuing, decay after the idle time, and an unavailable
   adapter yielding a NoOp emission with a reason.
4. Every committed program keeps its exact semantic hash; the three editable
   views round-trip a graph with `presence`.
5. Write-backs land: 02 §LoadoutGraph v1 payload contract (the collection),
   03 §Operator-presence policy (the compiled form), 04 §RPG view (the
   render), 10 §Separate version axes (the compiler version), ADR-0007
   §Amendments (a dated note), ledger entry; publication index rows and
   locks.
6. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the process that evaluates the cadences (WO-068); the work
the phases perform (WO-100); the 5S set's own reevaluation cadence
(WO-094); signed or authenticated presence.

**Operator-review assumptions**

1. The curve reading above matches the predecessor's behavior; the fixture
   policy is data the operator can edit before activation.
