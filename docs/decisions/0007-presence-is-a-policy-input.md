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

2026-09-24 — **Operator clarification supersedes decision item 6's
"successful or otherwise qualifying rounds can advance a progressive stake"
description.** Blackjack +3 is a side wager using the player's two cards and
the dealer's upcard. In the operator's example a $5 starting stake offers at
most $45 profit on an immediate win; a flat $5 stake loses $5 of net result per
preceding loss. Increasing the next wager by $5 *after each loss* makes profit
on the first subsequent win follow an upside-down curve: an illustrative peak
around twelve losses, then a still-profitable descending half until roughly
break-even around eighteen. The bettor continues during the downswing and
restarts at $5 only after reaching the later cutoff. The figures are the operator's recalled
illustration, not verified odds or payout mathematics. For DotLn, elapsed
operator absence is the opportunity to complete more verified work while
cost, risk and return-time burden accumulate. The losing streak maps to time
away only; no agent success or failure is part of the analogy.
The owner still declares the cap, cutoff and reset. WO-111 tests bounded phase
and return behavior, not positive net benefit or a maximizing absence time.
The operator's five-, ten-, forty-five-, fifty- and ninety-minute examples
illustrate quick discovery, implementation, a broad peak, progressively smaller
but still useful work on the downswing, then the smallest chunk and a reset;
return may interrupt at any stage. None of those times or work classes is a
selected policy. Experiments must find the useful tranches, peak, descending
half and reset point. WO-111's three-phase fixture jumps straight from peak to
probe and thus omits the downswing. See [the current interpretation](../product/03-architecture.md#candidate--progressive-absence-authority-and-return-readiness).

**Placement clarification, same day:** The idea arose when predecessor `v1`
needed the operator to drive a prompt-bound agent interaction by interaction;
a recurring cron trigger kept some work moving during absence. DotLn's
dispatched work orders already advance through explicit phases and status
while the operator is away. The proposed full absence curve belongs to a
future automatic selector and mover of eligible work orders, not to the basic
continuation of an active order. WO-111's scratch portfolio tests a bounded
precursor, not that future allocator in the operator's repository.

2026-09-16 — WO-121 separates human presence, actor liveness and task progress
in `OperatorPresenceObserved`. Activity and stamped prompts never imply human
return; the currently observed harness profiles require explicit away/back
because they cannot establish typed prompt origin. Optional human inactivity
is distinct from phase expiry and actor heartbeat budgets. Return preserves
explicit foreground authority and follows discretionary kill/finish policy.
See [the presence contract](../product/03-architecture.md#operator-presence-policy)
and [decision receipt](../evidence/WO-121/decisions.md).

2026-09-15 — WO-067 compiles the first optional `PresencePolicy` subset:
four named axes, owner-ordered progressive phases, verified-success advancement,
failure/peak reset, discretionary return disposition and idle phase expiry.
Every phase narrows the final compiled base, including its admitted grants and
support restrictions. Capability is observed and unavailable adapters yield a
reasoned NoOp. The compiler emits cadences and transitions; resident evaluation
remains WO-068. General curves and the Blackjack +3 subgame remain candidates.
See [the contract](../product/02-domain-model.md#compiled-presence-policies) and
[decision receipt](../evidence/WO-067/decisions.md).
