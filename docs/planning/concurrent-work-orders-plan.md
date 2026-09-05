# Concurrent work orders — plan for the control change and its lanes

**Planning result:** 2026-09-05, the planning pass after the `v0.6.0` close,
discharging the
[Fable planning handoff](budget-window-work-order-ladders.md#fable-planning-handoff).
This document answers the handoff's required planning results, files the
smallest useful first slice as
[WO-030](../work-orders/WO-030-concurrent-control-state.md), and records the
later slices as unfiled candidates with the condition that files each. It grants
no activation authority and changes no immutable evidence. The
[marked sequence](work-order-map.md#recommendation-and-rationale) is the
editable recommendation; this plan explains it.

**Implementation update (2026-09-05, WO-030 source):** the first slice is
implemented with the existing lifecycle contract, direct legacy support, and
per-segment release/index proofs. The [executor evidence](../evidence/WO-030/README.md)
contains the baseline comparisons and real-Git integration transcript. It is
pending independent verification and final review. All later slices and the
first measured paired wave retain their own evidence requirements.

## What was found

The executable observation in the ladders document still holds at `v0.6.0`:
`scanControl` in `scripts/lib/control.mjs` keeps a single state object, and a
`WorkOrderActivated` event overwrites the active order and resets every field,
so a second activation silently captures the first order's later events. Every
one of the eight event types already carries `workOrderId`, so attribution data
exists in the log; only the fold discards it after activation. The single
`docs/control/resume.jsonl` file is appended in each work-order branch, so two
concurrent branches would meet as a textual merge conflict at the pull request,
and `release.mjs` proves append-only history by byte-prefix comparison of that
one file (`addedControlEvents`), while the index attributes releases through the
same prefix rule. Any concurrency design has to preserve those two proofs.

Two queued orders already assume per-order state: WO-021 emits a beacon after
every transition for “the active work order” and composes a group beacon from
member counts per phase across worktrees, and WO-026's index folds every order.
Placing the control change before WO-021 lets the beacon hook be written once
against the model it needs, which is why the recommended sequence now reads
WO-030 → WO-021 ∥ WO-029.

## Decisions against the handoff table

| Concern                           | Decision for the first slice                                                                                                                                                                                                                                                                                                                                                                                                                             | Deferred to a later slice                                                                                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Concurrent state                  | One append-only segment per order, `docs/control/orders/WO-NNN.jsonl`, created at activation. The historical `docs/control/resume.jsonl` is a frozen legacy segment: it is read first, its events keep their ordinals, and an order whose activation lives there keeps appending there until it closes. The fold produces one state per order; legality consults only the named order's state. A foreign `workOrderId` inside a segment refuses at fold. | Nothing; this is the whole state model. Event schema stays `1`; the segment layout is a separate storage axis and is documented, not versioned into events.                          |
| Different workflows               | Not in the first slice. Every order keeps the existing implementation → verification → final-review contract, and the fold's phase table is unchanged. The segment layout leaves room for a per-order declared workflow later because each segment begins with its own activation event.                                                                                                                                                                 | A `workflow` field on activation naming a pinned step table, with the current contract as the only registered workflow until a second is needed.                                     |
| Dispatch and lane generation      | A hand-executable rule set (below) that the showrunner applies to the marked sequence; the map records the resulting waves. No generator.                                                                                                                                                                                                                                                                                                                | A generated lane projection over declared dependencies, write surfaces, and capacity, filed after one paired wave has been run by hand and its friction is known.                    |
| Tenant-scoped tracks              | Not in scope; there is one operator and one tenant.                                                                                                                                                                                                                                                                                                                                                                                                      | Define tenant and track ownership only when a second owner exists; until then it is speculation without a consumer.                                                                  |
| Constraint and admission control  | One rule, applied by hand: do not start a new implementation while two orders already wait for verification and the verifier capacity is one session. Recorded pauses go in the map.                                                                                                                                                                                                                                                                     | An observed admission policy with queue age, completion rate, and reserves, once two lanes have produced enough closed orders to measure anything.                                   |
| Canonical history and integration | Per-order segments make “an event cannot advance another order” structural. Main integration stays serialized through pull requests; merging one branch touches only its own segment and the shared generated projections, which regenerate. The append-only proof and release attribution run per segment.                                                                                                                                              | Nothing structural; a rebase helper for a remaining branch after a sibling merges is an automation candidate if the manual step recurs.                                              |
| Contribution and release views    | The existing index already attributes closed orders to releases; WO-030 extends that attribution per segment and lists every in-flight order with its phase and freshness.                                                                                                                                                                                                                                                                               | Contribution tracks, group and sub-task mapping, and bidirectional release-membership navigation, filed at the first outside contribution or the licensing gate, whichever is first. |
| Compatibility                     | Direct support for the legacy log: no rewrite, no migration event, byte-identical historical ordinals and `times` output. New orders use segments. `status --json` keeps its existing top-level fields for the selected order and adds `orders[]`, so `worktree.mjs` and `release.mjs` keep reading the same shape.                                                                                                                                      | A derived single-stream view (all segments merged by `recordedAt`) only if a consumer needs cross-order chronology; it would be a labeled projection, never a legality input.        |
| Trial and evaluation              | The first paired wave is WO-021 ∥ WO-029 immediately after WO-030 merges. Record for each order: elapsed per phase from `status`, operator interventions, integration repair, and time away.                                                                                                                                                                                                                                                             | Comparison against the single-lane baseline after two paired waves.                                                                                                                  |

## Lane rules the showrunner can apply by hand

1. **Eligible:** every `Depends on` token is control-closed, the activation
   preflight in the map is satisfied, and the environment preflight holds.
2. **No shared write surface in one wave:** two orders whose “primary affected
   surfaces” intersect in the map's catalog do not run concurrently. Product
   docs, the map, and the ledger are not conflicts; they merge as ordinary text
   and the second final review reconciles wording.
3. **Capacity:** two lanes at most, and a repair loop occupies its lane.
4. **Verification reserve:** with one verifier session available, do not start
   a third implementation while two orders wait for verification.
5. **Serial integration:** merge in final-review order; a lane whose base moved
   materially re-runs its evidence before its own final review, and a
   substantive integration change returns through repair and fresh
   verification.
6. **Idle is allowed:** an empty lane is a legal outcome, not a failure to plan.

Applied to the current horizon these rules give:

```text
wave 0   WO-030                      (alone: it changes the fold everyone reads)
wave 1   WO-021        ∥  WO-029     (beacons vs compiler identity: disjoint surfaces)
wave 2   WO-009        ∥  WO-031     (worker transport vs read-only usage projection)
wave 3   WO-022        ∥  WO-010     (senses vs independent verification, after WO-009)
wave 4   WO-011                      (depends on WO-010)
```

WO-031 is small enough to wait in a free lane; it is recommended after WO-030
because it reads every order's segment through the same fold.

## Later slices, unfiled

| Slice                                            | Files when                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Lane plan projection                             | One paired wave has completed under the hand rules and a recurring manual step is named.                               |
| Declared per-order workflows                     | A second workflow shape has a real consumer (for example, a corpus order that needs no final review).                  |
| Admission and observation policy                 | Two lanes have produced at least four closed orders, so queue age and completion rate mean something.                  |
| Contribution tracks and release-membership views | The first outside contribution is accepted, or the licensing gate in `docs/LEGAL.md` is passed, whichever comes first. |
| Tenant-scoped tracks                             | A second owner or tenant exists.                                                                                       |

## Unresolved product decisions

- Whether a derived cross-order chronology (all segments ordered by
  `recordedAt`) is ever needed, given that legality never uses time.
- Whether a beacon per order (WO-021) should read the segment directly or the
  `orders[]` projection.
- How a lane pause is recorded once admission control exists: a control event,
  a map note, or both.
- Whether contribution tracks map one-to-one onto work orders or group several.

## Reversal conditions

- If the operator prefers Beacons dogfood before concurrency, WO-021 runs before
  WO-030 and the first paired wave moves one step later; nothing else changes.
- If the per-segment layout proves awkward for a consumer, a union-merged single
  file is the recorded alternative; it was declined here because it reorders
  global ordinals and weakens the byte-prefix proofs.
