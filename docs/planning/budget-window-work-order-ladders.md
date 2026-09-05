# Budget windows and concurrent work-order planning — candidate trial

**Planning observation:** 2026-09-04 during WO-020. The operator wants to finish
useful work early in available usage windows and create an uninterrupted period
for other activities. Using an allowance early may also leave room to benefit
from an actually observed promotion or unexpected reset. This is an exploratory
strategy; faster completion, more usable capacity, and more free time are
hypotheses to test. The operator subsequently clarified the enabling design:
the control state machine should support **zero to many concurrent work orders,
with potentially different workflow steps per order**. Two lanes are the first
candidate capacity setting, not the model's cardinality or a permanent phase
barrier. The [Fable planning handoff](#fable-planning-handoff) asks for the higher
order work that defines this workflow and derives a usable lane plan.

The same design should let each public contribution follow its own track.
The shared view answers which orders are queued, active, blocked, under review,
or complete, with evidence and update time. Release views answer which reviewed
changes were included in each published release and connect back to those
tracks. A contribution can relate to one or more bounded orders; the planner
must define that mapping and any grouping of sub-tasks without equating an
external tracker artifact, a work order, and a release.

Extend that model to tenant-scoped tracks. Planning supplies required
dependencies and recommended order as explicit inputs for each track; the
scheduler combines them with cross-track dependencies, shared integration
conflicts, and current capacity. Track ownership does not create an isolated
queue that can ignore another track's prerequisite. Re-evaluate readiness when
prerequisites, evidence, available actors, or the integration base change, and
show the blocker and updated recommendation. This is the intended way to
coordinate timing as tracks multiply.

An observation and admission policy must govern how many tracks can accept
new work and how much work is active at each step. The operator's constraint
analogy contributes the distinction between useful contribution to completed
work and merely activating available capacity. Track existence, an admitted
order, and an actively executing step are different counts. Monitor the
limiting step, waiting work and its age, completion rate, available actors,
and completion/recovery reserves from recorded observations. Limit admission
or defer/pause upstream work when more production would only accumulate ahead
of the constraint. An idle slot can be the policy's intended result.

Planning must define global, per-track/tenant, and per-step limits, the
observation window and unknown/stale-input behavior, and how the limiting step
is identified and reconsidered. Pauses occur at declared safe boundaries with
reason, retained state, and a resumption condition; in-flight effects still
need reconciliation and required review remains accounted for. Include
fairness and starvation handling. Start with a bounded observable policy and
test a saturated verification step throttling implementation, a moved
constraint, and resumption after capacity returns. These are planning
requirements; no metering or automatic pause is active in the current helper.

## Single sequence — current default

The [marked planning sequence](work-order-map.md#recommendation-and-rationale)
remains the editable source of the normal order. The
[generated work-order index](../work-orders/README.md) displays its current
progress, so there is no second checklist to maintain here. At this dated
observation the sequence is:

```text
020 → 021 → 029 → 009 → 022 → 010 → 011
```

For each order: Codex implementation → fresh Opus 5 verification → fresh Fable
final review, with the existing repair loop and each authority's effort floor.
These are the operator's proposed phase assignments for this trial, not fixed
global model identities or evidence that a particular account can launch them.
Actual model/version/effort and availability remain per-dispatch attestations.

## Two ladders — proposed alternative after WO-020

Finish, independently verify, final-review, and merge WO-020 before this trial.
The table preserves the current preference to put Beacons and pinned identity
before the real worker, and the worker's mount profile before Senses.

| Wave | Perception ladder                                                                | Execution ladder                                                                       | Start condition                                                                                                               |
| ---- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1    | [WO-021 — control-plane Beacons](../work-orders/WO-021-control-plane-beacons.md) | [WO-029 — pinned artifact identity](../work-orders/WO-029-pinned-artifact-identity.md) | WO-020 merged; both authorities' other dependencies and environment preflight rechecked; parallel closeout gate below passed. |
| 2    | Wait for the worker profile.                                                     | [WO-009 — real disposable worker](../work-orders/WO-009-real-disposable-worker.md)     | Wave 1 integrated and required evidence current.                                                                              |
| 3    | [WO-022 — Senses](../work-orders/WO-022-senses.md)                               | [WO-010 — independent verification](../work-orders/WO-010-independent-verification.md) | WO-009 merged; WO-022's v2/host/key preflight and WO-010's transport preflight pass.                                          |
| 4    | Available capacity; no filler order is assigned.                                 | [WO-011 — feedback compiler](../work-orders/WO-011-feedback-compiler.md)               | WO-010 complete and integrated; wave 3's combined subject is settled.                                                         |

The two lanes, in a plain editor:

```text
PERCEPTION                    EXECUTION
WO-021                        WO-029
  wait for WO-009              WO-009
WO-022                        WO-010
                              WO-011
```

This gives two candidate paired waves, not a permanently full pair of lanes.
WO-029's placement before WO-009 is a recommendation in its authority;
WO-009's hard prerequisite is WO-008 plus observed transport evidence.
WO-022 can use its specified path-capability boundary before WO-009 exists,
but this candidate retains the current preferred worker-before-Senses order.
WO-010 depends on WO-009, and WO-011 depends on WO-010 plus the existing
accounting/transport evidence. The proposed layout does not rewrite those
authorities or promote dependency-token observations into hard dependencies.

For a paired wave, the operator's initial model-role example is:

| Phase        | Perception worktree    | Execution worktree     |
| ------------ | ---------------------- | ---------------------- |
| Implement    | Codex session A        | Codex session B        |
| Verify       | Fresh Opus 5 session A | Fresh Opus 5 session B |
| Final review | Fresh Fable session A  | Fresh Fable session B  |

At most one writable coding actor owns each worktree. Each verifier follows the
existing blinding contract, and a failed order returns through its own repair
and fresh verification. The table illustrates role assignments; it imposes no
shared phase clock. One order may be verifying while another implements, and
an order with a different declared workflow may have different steps. The
planner must preserve each authority's required evidence while defining those
independent transitions. Lane assignment is a scheduling projection over
dependencies, eligible work, available actors, and capacity.

## Feasibility and integration gate

The repository's current helper dispatches one active order per checkout.
Separate worktrees isolate writable files, but both branches still change
`docs/control/resume.jsonl`, generated projections, common docs, and release
claims. Wave 1 also overlaps skeleton integration surfaces; wave 3 meets at
transport, observation, and evidence boundaries. Exact write sets must be
rechecked against the activated authorities.

An executable, in-memory observation of `scripts/lib/control.mjs` used the
synthetic sequence “activate WO-901; activate WO-902; implementation ready for
WO-901.” The fold returned WO-902 in `ready-to-verify`. This is evidence of the
current fold's one-order assumption, not a valid lifecycle sequence or a
production event. Interleaving branch logs is therefore not a concurrency
protocol. The live CLI separately refuses activation unless its current phase
is `none` or `closed`.

The follow-on must change the control model to represent independent orders
and prove closeout with synthetic branches: retain each order's event/report
history, attribution, and checkpoints; serialize main integration; resolve
release-target assignment; and revalidate a remaining branch against the newly
merged base. Substantive integration changes require fresh verification; a
passing report on the old base cannot certify a changed combined subject.
Tested integration is part of the new model's evidence, not a substitute for
the requested concurrent lifecycle support. This follow-on is unallocated and
adds no gate to WO-020's current implementation.

## Fable planning handoff

Use a Fable planning session to turn this candidate into bounded work orders.
The higher order planning task produces the enabling control/workflow plan and
the rules for deriving a lane plan. The implementation orders then deliver
that behavior; the hand-drawn two-lane example above is a trial input, not an
existing generator.

Read this document and the marked recommendation in `work-order-map.md`, then
the following focused inputs:

- `../product/07-execution-guide.md` — resume dispatch, ideation, lifecycle
  evidence, compatibility with current handoffs, and release authority.
- `../PLAYBOOK.md` — the operator's current lifecycle and concurrency surface.
- `../product/03-architecture.md` — agentic communication, statecharts,
  resource models, and the resource-pressure candidate.
- `../product/06-roadmap.md` — concurrent-workflow candidate and existing
  planning preferences; `../product/10-ir-compatibility.md` — version axes,
  transformation paths, and derived compatibility views.
- `../../scripts/lib/control.mjs`, `../../scripts/resume.mjs`,
  `../../scripts/worktree.mjs`, `../../scripts/release.mjs`, and their tests;
  inspect the event fold and integration behavior before selecting storage.
- The current authorities for WO-021, WO-029, WO-009, WO-022, WO-010, and
  WO-011; revalidate dependencies, shared write surfaces, and release claims.

The planning output must make these choices reviewable:

| Concern                           | Required planning result                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concurrent state                  | Represent zero, one, and multiple in-flight orders independently. Every transition, actor/report association, checkpoint, and failure source identifies its order. An operator's selected order is navigation context, not the entire state model.                                                                                                                                    |
| Different workflows               | Define how an order declares its steps and legal transitions, and how that definition is pinned while work is active. Preserve the existing implementation → verification → final-review contract as the current default. Choose the smallest useful representation for variation; document any unsupported workflow shapes.                                                          |
| Dispatch and lane generation      | Derive a bounded lane/wave plan from the current queue, prerequisites, write/integration conflicts, phase-specific actor availability, and capacity. Handle zero available slots, blocked work, an order advancing ahead of its neighbor, and a repair consuming a slot. Decide what is deterministic and where operator judgment remains.                                            |
| Tenant-scoped tracks              | Define what a tenant owns and what a track groups before selecting a schema. Carry required dependencies and recommended ordering across tenant/track boundaries; scope status, actor authority, and capacity/reserves explicitly. Test cross-track prerequisites, cycles, blocked tenants, shared conflicts, and readiness changes without misattributing events or widening access. |
| Constraint and admission control  | Distinguish open tracks, admitted orders, active steps, and completed throughput. Select observations and limits that govern upstream admission or safe pause when a downstream step is constrained. Define stale/unknown inputs, reserves, fairness, pause/resume evidence, and a trial where another implementer would only grow the verification queue.                            |
| Canonical history and integration | Choose append/concurrency coordination and replay semantics, main integration ordering, projection regeneration, and release-target assignment. Prove that an event cannot advance another order and that merging one branch does not erase or reinterpret another's evidence.                                                                                                        |
| Contribution and release views    | Give independent contributions attributable tracks and a shared status projection over all known orders. Keep completion, integration, and release inclusion distinguishable. Derive release membership from immutable published commit/manifest evidence and define navigation in both directions; include stale, missing, unreleased, and changed-integration cases.                |
| Compatibility                     | Choose direct support, a versioned derived view, migration, or an explicit unsupported boundary for each affected artifact. Explain the cost and fidelity. Preserve historical source/evidence and never guess an ambiguous legacy event association. Compatibility implementation is discretionary; a claimed path must satisfy product 10.                                          |
| Trial and evaluation              | Produce the initial one-lane/two-lane plan and meaningful fixtures for independent progress, differing steps, illegal transitions, crash/resume, interleaved history, failed verification, integration changes, and stale projections. Compare reviewed completion time, operator effort, and time away.                                                                              |

Number and order the resulting implementation work orders using the existing
planning process. Each needs citations, bounded scope, acceptance criteria,
evidence, migration/compatibility disposition, and per-order model/effort
assignments. Decide whether the planner can derive the first lane projection
from declared data immediately or whether a later generator is required;
do not make a general scheduling engine a prerequisite for the smallest useful
concurrent-workflow slice.

Copyable planning request:

> Plan the concurrent work-order workflow described in
> `docs/planning/budget-window-work-order-ladders.md`. Start from the current
> implementation and authorities. Produce bounded work orders for zero to many
> concurrent orders with independently declared steps, plus the dependency and
> capacity rules that generate an initial one-lane or two-lane work plan.
> Choose compatibility per affected surface, considering versioned computed or
> cached views where useful. Include independent contribution tracks, a shared
> status view, and traceability from each release to its included changes and
> work orders. Extend dependencies and recommended ordering to tenant-scoped
> tracks, including cross-track prerequisites and changing readiness. Keep
> track admission and active work bounded by observed constraints, with safe
> pause/resume and completed throughput as the outcome. Keep historical
> evidence attributable and test the combined
> integration subject. The operator's initial role preference is Codex
> implementation, Opus 5 verification, and Fable final review per order. Show
> unresolved product decisions and the smallest useful first slice.

## Budget policy and evidence

The operator prefers **early useful consumption followed by time away**, rather
than stretching routine work over the whole allowance period. Budget pressure
can favor the queued deliverable and its completion reserve while deferring
discretionary maintenance. Keep implementation capacity and verification/final-
review capacity visible separately, including any shared provider or model
limits. Do not create work to consume an allowance or leave both lanes unable
to complete their required review.

Use actual displayed reset times and confirmed temporary allowances as inputs;
leave missing values unknown. The operator's reported windows and extra resets
remain dated observations. The planning lookup on 2026-09-04 used the
[OpenAI usage documentation](https://learn.chatgpt.com/docs/pricing) and
[Claude reset documentation](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)
as reference points, not account measurements.
Evaluate comparable completed orders by elapsed time through final review and
integration, operator interventions/active time, time free of project attention,
usage by phase, abandoned/restarted work, integration repair, and idle waiting.
Protect the same acceptance and assurance contract in both layouts. Retain two
lanes only if that evidence improves the operator's outcome; a smaller or
single-lane batch remains a valid result.
