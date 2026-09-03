# ADR-0007 — Presence is a policy input, not a one-way authority brake

**Status:** Accepted (2026-09-03)

## Context

The operator's founding ideation proposed an upside-down autonomy curve during
absence, progressive stakes, and a reset or repeating cycle. An early synthesis
recast that into the categorical rule that authority must never increase while
the operator is away. That recasting then propagated into the idea ledger,
principles, vision, README, and architecture.

The categorical rule does not follow from the original interaction shape. It
also conflates four distinct questions: what work receives attention, how much
work may be attempted, which effects are authorized, and which capabilities the
execution environment actually exposes. A conservative decay profile is useful,
but it is one selectable policy rather than the meaning of operator absence.
Under ADR-0006, `PresencePolicy` is a reusable platform mechanism; every
direction, threshold, ceiling, and transition chosen through it is instance
doctrine.

## Decision

1. Treat operator presence state and elapsed absence as explicit inputs to an
   implementation's **PresencePolicy**. Neither input has an intrinsic
   monotonic effect on autonomy.
2. Keep four outputs separately inspectable:
   - attention priority among candidate actions;
   - work scope and resource budget—the task, time, token, and work-volume
     allocation, which does not itself authorize an effect;
   - effect authority or the authority profile selected; and
   - observed external capability, which policy cannot manufacture.
3. Permit an owner to preauthorize time-conditioned transitions on any of the
   first three outputs. A declared policy may hold, shrink, grow, peak, step by
   tranche, stop, reset, or loop within a declared ceiling. Growth is real
   authority growth when the policy changes allowed effects or the selected
   authority regime's consumption limits; it must not be relabeled as mere
   scheduling.
4. Elapsed time is sufficient to trigger a transition when the owner has made it
   a condition of the active policy and recorded clock/presence events establish
   that condition. Ambient wall time is not an input to a deterministic policy.
   In the absence of a declaration, the affected axes hold: elapsed time neither
   shrinks nor grows them. Return, expiry, threshold, outcome, budget, loss, or
   another recorded event may stop or reset the progression.
5. Favoring housekeeping during absence is an attention and disruption-cost
   choice, not proof that authority must shrink. The author's reference profile
   may progressively widen bounded cleanup scope because such work can have low
   return-time comprehension cost, while a different saved profile stays
   read-only or authorizes higher-impact effects.
6. Preserve the operator's working **Blackjack +3** lens as a candidate explicit
   subgame, not merely a gambling metaphor: successful or otherwise qualifying
   rounds can advance a progressive stake, while a selected threshold or event
   resets or loops the game without silently ratcheting past its ceiling. Exact
   dealing, `+3`, stake, loss, unlock, cap, and reset semantics require a later
   design and representative fixture.
7. A PresencePolicy may select authority over a high-impact adapter only when
   that adapter and resource are deliberately available to the implementation.
   It cannot make a provider, harness, sandbox, operating system, destination,
   account, or service accept an effect outside its independent control plane.
8. The walking skeleton's no-deletion envelope and return-time pulse
   cancellation remain one narrow fixture. They demonstrate a guard and a
   policy choice, not platform conformance or the final personal profile.
9. At work-order scale, PresencePolicy may activate or reprioritize an
   explicitly selected unattended portfolio. Small orders already inside
   standing authority can be eligible first; larger-authority orders become
   optional candidates when the operator preauthorizes them. Lack of a new
   ordering message neither creates that portfolio nor grants its effects.

## Consequences

- Principles 10 and 14 describe declared, inspectable presence policy rather
  than mandatory decay.
- Earlier ledger statements that forbid absence-conditioned growth are retained
  historically and explicitly superseded; the `AuthorityEnvelope`, per-action
  utility, evidence-gated escalation, and `NoOp` mechanisms remain useful.
- An implementation that declares `PresencePolicy` support must expose a
  machine-readable account of which axis changes, the transition condition,
  current tranche, active window, ceiling, stop/reset, replenishment/loop
  behavior, and source of the grant at its DotLn interchange boundary. A rich
  inspector remains optional. A single “autonomy” score is insufficient.
- A future test matrix needs at least hold, shrink, grow, peak-and-decay,
  reset/loop, operator-return race, unavailable-adapter, and high-impact-effect
  cases. It must prove that attention changes do not silently mutate authority
  and that authority changes do not fabricate capability.
- Work-order preauthorization means “eligible if dependencies, policy, and
  capacity permit” unless an order is explicitly marked required. Selection,
  activation, authorization, and completion remain distinct states.
- WO-016 changes documentation only for this decision. It adds no
  PresencePolicy schema, Blackjack subgame, authority transition, adapter,
  settings mode, or runtime behavior.

## Alternatives rejected

- **Absence always shrinks authority.** Useful as a conservative saved profile,
  but it erases the operator's progressive-autonomy idea and is not a platform
  invariant.
- **Absence automatically grows authority.** This merely replaces one universal
  direction with another and makes elapsed time an undeclared grant.
- **Call every increase “scope” while claiming authority is unchanged.** Some
  policies really do authorize new effects or larger limits; the inspector must
  tell the truth about that transition.
- **Use one scalar autonomy curve.** Priority, scope, authority, and capability
  can move independently and need separate projections.

## Amendments

None.
