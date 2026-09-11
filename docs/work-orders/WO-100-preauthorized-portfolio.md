# WO-100 — Preauthorized portfolio and work derivation: the operator preauthorizes classes of unattended work with surfaces, effect ceilings per phase and a budget, and the resident derives bounded work orders from the Gardener's candidates inside it, never outside (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A portfolio contract in the configuration
and loadout, a pure derivation, and the resident's activation path. Assigned
at activation under the standing opt-out default.
**Nomination provenance:** the planning map's PresencePolicy candidate ("an
explicitly preauthorized optional WorkOrder portfolio"), the roadmap's
unattended work-order portfolio candidate, and the operator's 2026-09-08
mid-pass description of the predecessor's "operator away" cron doing 5S
work. Planner-synthesized draft; captures and hashes in the ledger section
of that date. Opaque identifier, not a priority. Clean-room screen: no stop
condition.
**Depends on:** WO-068 merged (the resident that derives and dispatches);
WO-052 merged (the source-change host that executes a derived order);
WO-054 merged (every derived order is verified before the curve advances);
WO-042 merged (the derived order's authority is the portfolio's, as a
narrowing with `host-policy` provenance, never wider); WO-119 merged (the executable
discovery producer whose candidates are the input; the Entropy Reducer's
manual review is not a producer); WO-120 merged (a derived order is a
durable record with the same identity and lifecycle).
**Recommended placement:** after WO-052 and WO-054 land; it edits the
configuration schema, adds `packages/skeleton/src/portfolio.ts`, and the
resident's activation path. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-068",
    "relation": "hard",
    "reason": "the resident that derives and dispatches"
  },
  {
    "workOrderId": "WO-052",
    "relation": "hard",
    "reason": "a derived order executes through the source-change host"
  },
  {
    "workOrderId": "WO-054",
    "relation": "hard",
    "reason": "every derived order is verified before the curve advances"
  },
  {
    "workOrderId": "WO-042",
    "relation": "hard",
    "reason": "the derived order's authority is the portfolio's under the floor"
  },
  {
    "workOrderId": "WO-119",
    "relation": "hard",
    "reason": "the executable discovery producer whose candidates are the input"
  },
  {
    "workOrderId": "WO-120",
    "relation": "hard",
    "reason": "a derived order is a durable record with the same identity and lifecycle"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Candidate — unattended
work-order portfolio and §Candidate — budget-window work-order ladders;
03-architecture.md §Candidate — progressive absence authority and return
readiness; 05-pattern-library.md §5S / 6S; 02-domain-model.md §Actors and
episodes (WorkOrder) and §Identity and composition (grants after WO-042);
`packages/skeleton/src/loadouts/entropy-reducer.ts` (the candidates it
emits); `docs/work-orders/WO-055-repair-continuation.md` (the derivation
shape).

**Objective:** A `portfolio` declares the mechanics allowed unattended
(the Gardener's Sort, Shine and Standardize as compiled today; the 5S pieces
as they compile), the surfaces (paths), the effect ceiling per presence
phase, a budget (episodes, tokens where reported, wall time) and the
verification requirement; `deriveWorkOrders(candidates, portfolio, phase)`
is pure: one WO-119 candidate (a misplaced file with a proposed home, a
failing lint or test, a stale generated file, a recurring repair) becomes
one bounded WorkOrder, materialized through WO-120 as a durable record,
whose surfaces are the candidate's files, whose size is within the phase's
ceiling and whose contract is the mechanic's obligation; a candidate outside
the portfolio becomes a `ProductSuggestion` or `NeedsHuman`, never an
order; the resident activates a derived order with `host-policy` provenance
and executes it through WO-052, and the curve advances only after WO-054
verifies it.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The only candidate producer is manual and awaits an operator; no order is
  ever derived from a candidate, and no authority exists for unattended
  activation.

**Design (scope discipline):**

- The portfolio is reviewed text in the configuration and a loadout field;
  its envelope is validated under the floor; the derived order's envelope is
  the intersection of the portfolio and the phase.
- Budget exhaustion is a NoOp with a reason; the resident never exceeds it.
- **Declined alternatives, recorded:** a model choosing what to work on
  (candidates come from the executable producer); operator-authored
  candidate lists as the input; an order that widens its own surfaces on
  contact.

**Deliverables:** the contract, the derivation, the activation path,
fixtures with doubles over the WO-052 target, the write-backs below.

**Acceptance criteria (all required)**

1. From WO-119's candidates over its fixture repository, in-portfolio ones
   derive orders whose surfaces, size and envelope are inside the portfolio
   and phase (fixture-asserted) and materialize as durable records visible
   in the index; out-of-portfolio ones become suggestions or `NeedsHuman`
   and no order.
2. A derived order activates with `host-policy` provenance recorded in the
   activation event, executes through the WO-052 double, is verified through
   the WO-054 double, and only then does the phase advance; a failed
   verification resets the phase.
3. Budget exhaustion yields a NoOp with the reason; nothing dispatches past
   it.
4. Write-backs land: 06 (the portfolio candidate allocated), 03 (the
   progressive-authority candidate's status), 07 §Operator resume phrases
   (declaring a portfolio), ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins and a fresh feedback evidence edition because
   runtime source changed.

**Evidence gate:** the fixture transcripts; `npm test`; the evidence
edition.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** the live unattended hour (WO-111); planning passes by the
resident; publishing (no remote grant in the first portfolio); the full 5S
set (WO-091 to WO-095 extend the candidates); the `intent` admission class
and the remote grants it needs (WO-123).

**Operator-review assumptions**

1. The first portfolio is 5S maintenance in a scratch repository; the
   operator's repositories join by an explicit portfolio edit.
