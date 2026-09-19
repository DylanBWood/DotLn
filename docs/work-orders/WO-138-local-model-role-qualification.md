# WO-138 — Local-model role qualification pilot: three representative read-only DotLn tasks with independently checked outputs, run locally and remotely with repeats, decide which inspection roles a local model may fill and at what reliability and cost (version assigned at activation)

**Model:** the pinned local artifact from WO-137's packet and one existing
remote inspection transport; any capable model for the agent. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch, evidence-only. An evaluation harness
under `scripts/probes/` with deterministic oracles and an evidence
directory; nothing under `packages/` beyond a catalog write-back sentence.
Assigned at activation under the standing opt-out default.
**Cost:** removes the standing assumption in the actor catalog that local
episodes stay inspection-only indefinitely, and its opposite. Adds one
evaluation harness with deterministic tests over recorded envelopes and one
evidence directory; budget three tasks × two models × five repeats (30
baseline episodes) plus five one-factor cells and three tool-failure cells,
and one operator session of at most 30 minutes for the T2 ranking,
recorded; wall-clock unmeasured until run; live runs never inside
`npm test`.

**Nomination provenance:** 06-roadmap.md §Candidate — local-model
usefulness experiments (the matched-comparison program; operator ideation
2026-09-16); the operator-endorsed third-party brief of 2026-09-17, §4; the
[2026-09-17 pass](../planning/vision-into-use-2026-09-17.md) §3 (M5) and
§13. Planner-synthesized draft. Clean-room screen: the fixtures are this
repository's public evidence and a seeded scratch repository.

**Depends on:** WO-110 merged (the local transport that runs the episodes);
WO-137 merged (the pinned artifact and the readiness row).

**Recommended placement:** lane pair with WO-071, after WO-110's merge.
Activation preflight (amended 2026-09-19 at the operator's direction to keep
testing local models): WO-137's execution record must show a successful live
inference row and pin the artifact. WO-137 closed `inconclusive` for one
reason that does not bear on this pilot: it ran with networking permitted,
so it could not prove the runner sends nothing off the machine. Every input
of this pilot is committed public material or a seeded scratch repository,
so that proof is not required here; it is required before any local role
reads private material, and this order qualifies none. A `negative` WO-137,
or a record with no successful live row, keeps this order queued. The typed
graph expresses closes, not outcomes, so this sentence and criterion 1 carry
the requirement. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-110",
    "relation": "hard",
    "reason": "the local-model transport that runs the episodes"
  },
  {
    "workOrderId": "WO-137",
    "relation": "hard",
    "reason": "the pinned artifact and the readiness row"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Counterfactual profiling
work orders (the profiling contract) and §Candidate — local-model usefulness
experiments; 03-architecture.md §Runtime primitive catalogs (actor kinds);
`docs/work-orders/WO-110-local-model-transport.md`;
`docs/work-orders/WO-119-executable-discovery-producer.md` (the candidates
task T2 ranks); `docs/verifications/WO-052/VER-001.md` (a receipt of the
shape task T1 summarizes); 07-execution-guide.md §Research and
guided-operator work orders.

**Objective:** The question: for three read-only tasks with deterministic
oracles — T1, summarize a verification receipt into a fixed-schema abstract
whose claims a checker matches against the receipt's own labeled rows; T2,
rank the discovery producer's candidates for a seeded scratch repository
against a held-out operator ranking; T3, classify hook-journal rows into a
closed set against a labeled sample — does the local model meet the
reliability the inspection role needs (schema validity, oracle agreement,
variability across five repeats, latency, resource use, interventions),
compared with one remote transport under the same order, build and prompt;
and how much does one prompt or support change move it, one factor at a
time with each build identified by hash? The decision it informs: which of
the three roles enters the catalog for the local actor kind with its
measured floor, and what the next qualification (bounded implementation or
independent verification) must show before it is attempted.

**Observed gap (dated 2026-09-17, `main` at `ec502c9`):**

- No local episode has completed a DotLn task; WO-110's non-goals exclude
  quality; the catalog's local kind has no measured role.

**Design (scope discipline):**

- One pinned WorkOrder per task, one baseline build, five repeats per cell;
  schema validity by the existing envelope validator; oracle agreement by a
  deterministic checker; evaluator disagreement recorded where the oracle is
  a ranking; three cells inject a failing tool or unexpected data and record
  the behavior; the inspection envelope only, no write.
- Provenance per the profiling contract; results reported as distributions
  and disagreement, never a single score or a leaderboard.
- Floors pre-registered here, before any trial: per task, schema validity in
  5 of 5 repeats; oracle agreement median at least 0.9 for T1 and T3 and a
  Spearman rank correlation of at least 0.7 for T2; within 10 points of the
  remote comparator's agreement under the same conditions; median latency at
  most 120 s per episode on this host; no operator intervention inside an
  episode. The operator may revise a floor at activation with a dated note
  before the trials, never after them.
- Live runs happen only when no product gate is running on the host.
- **Declined alternatives, recorded:** bounded implementation or
  verification cells (later, separate orders each); more than one remote
  model; toy tasks; downloads beyond WO-137's pin.

**Deliverables:** the evaluation harness with tests; `docs/evidence/WO-138/`
with envelopes, distributions and the decision packet; the write-backs
below.

**Acceptance criteria (all required)**

1. WO-137's execution record shows a successful live inference row (its
   outcome may be `ready`, or `inconclusive` only for the missing no-egress
   proof) and the artifact this order pins is the one it recorded; the order
   is not activated otherwise. Every episode input is committed public
   material or the seeded scratch repository, and the packet states that no
   no-egress claim is made and no role that reads private material is
   qualified.
   Each of the thirty baseline episodes has a recorded envelope or a typed
   failure; no episode's success is self-reported.
2. Per task and model: schema-valid rate, oracle agreement, variability
   across repeats, median latency, tokens per second and interventions; the
   tool-failure behavior is described from the records.
3. The one-factor cells identify each build by hash and change exactly one
   factor.
4. The packet's outcome is exactly one of `ready` (each task the local model
   meets at its pre-registered floor), `negative` (none) or `inconclusive`
   (the blocker), reported against the floors as written at activation; the
   operator time spent on the T2 ranking is recorded; nothing in it promotes
   a capability level or qualifies implementation or verification.
5. Live runs never inside `npm test`; the harness's deterministic tests run
   over recorded envelopes and pass inside it.
6. Write-backs land: 03 (the local kind's qualified roles, dated); 06's
   candidate disposition; ledger entry. `npm test` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the evidence directory; the harness's tests; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** source-writing or verification qualification; a leaderboard;
a second remote model; changing the remote transports; any capability-level
claim.

**Operator-review assumptions**

1. T2's oracle needs the operator's ranking of the seeded candidates once,
   recorded as a bounded human input.
2. The floors are pre-registered in this order; the packet reports against
   them, and a change is a dated note before the trials.
