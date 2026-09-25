# Candidate — test the full rising and descending operator-absence curve

**Source and status (2026-09-24):** Operator clarification during WO-111.
This is a synthesized planning candidate, not a selected timing policy or a
new acceptance condition on the active order. [ADR-0007's dated
clarification](../decisions/0007-presence-is-a-policy-input.md#amendments)
and [product 03's candidate](../product/03-architecture.md#candidate--progressive-absence-authority-and-return-readiness)
hold the current meaning. The [WO-111 return receipt](../evidence/WO-111/return-receipt-v2.json)
shows verified probe → widen → peak → immediate probe reset and a separate
return cancellation by log replay against a no-return control with a candidate
still eligible. Neither live return exercised an in-flight episode; the caller
stopped before the next due time. The containment criterion remains unmet
because scratch trust entries changed the user Codex configuration. It does **not**
show the descending half or measure net value.

**Placement:** In predecessor `v1`, a prompt-bound agent waited for the
operator to drive each interaction; a recurring cron trigger was an early
unattended-work mechanism. DotLn's dispatched orders now progress through
their phases and status while the operator is away. This candidate concerns
the later automatic layer that selects and advances further eligible work
orders without a fresh operator dispatch. WO-111's preauthorized scratch
portfolio is a precursor, not evidence that the full allocator or curve is
already in use.

Blackjack +3 supplies the shape, not a formula for worker success. Each game
loss corresponds only to more time with the operator away. Useful unattended
work can grow from small to broad, peak, then continue while becoming
progressively smaller on a still-positive downswing. When the smallest chunk
returns, the policy resets and can repeat if the operator remains away. Return
interrupts the unattended cycle under its selected return rule. The operator's
five-, ten-, forty-five-, fifty- and ninety-minute examples and named refactor
classes explain that shape; none is a proposed fixed threshold or required
work type. Tests and experiments must choose the stages.

**Question for a planning pass:** Which presence profile, if any, produces more
accepted benefit than the review burden, resource cost, risk and mission drift
it adds across absence durations? Compare a conservative small-work profile,
the existing immediate-peak-reset profile and one or more symmetric
small → broad → small candidate profiles over a common synthetic candidate
pool. Pre-register what counts as accepted useful work and how each cost is
measured; report the axes separately before combining them into any payoff
score. A profile whose positive downswing is unsupported should not acquire
one by assertion.

**Representative evidence to demand:**

1. Record elapsed-away time and the eligible work class at each stage. Show
   rising capacity, a bounded peak, a descending interval that still completes
   useful work with progressively smaller scope, a smallest-chunk reset, and
   an optional repeated cycle without ratcheting past its ceiling.
2. Compare observed benefit and cost across several absence lengths on the
   same candidate pool. An upside-down net-payoff claim needs measured rising
   and descending regions and a later cutoff; a phase-name trace alone cannot
   pass it.
3. Exercise return before a scheduled dispatch and during a larger in-flight
   episode, including the chosen kill/finish disposition. Preserve the
   requested foreground work and show no new unattended dispatch on return.
4. Keep agent verification outcomes separate from the game analogy. They
   remain execution evidence and guards, not the “losses” that set the curve.
   Include mission-drift judgments, budget exhaustion and unavailable
   adapters as independent stop or narrowing evidence.
5. Label the operator's actual benefit, risk and review burden unknown where
   the scratch setting cannot measure them. Do not infer an owner-repository
   grant or publish effect from a synthetic run.

A planning pass should first determine whether current compiled phases and
cadences can express the measured schedule. Only then should it file bounded
implementation or live-proof orders for automatic selection across work
orders, with a product-visible status projection showing the current tranche,
ceiling, source grant and why the next reset is due. Reopen this candidate
when comparative measurements select or rule out a profile; an illustrative
minute value is not such a measurement.
