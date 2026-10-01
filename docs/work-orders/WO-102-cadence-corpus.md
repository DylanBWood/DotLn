# WO-102 — Cadence virtual-time grid sweep and golden vector corpus (v0.60.3)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Evidence only: new files under
`corpus/`; no runtime, package or contract change. Assigned at activation
under the standing opt-out default; a close without a release needs the
operator's direction.
**Cost:** adds a seeded generator with `--write` and `--check` modes,
sharded golden vectors under `corpus/fixtures/cadence/`, replay and
property harnesses with an independent Backoff and LCG reference under
`corpus/harness/`, a manifest and run transcripts under
`corpus/manifests/`, and a findings file if a finding arises; nothing
joins the root `npm test`. Removes nothing that runs; it adds pinned
vectors for the six evaluated constructors beside the root suite's pins.
Re-mints: none; the order adds new files only and edits neither the
kernel nor the registered corpus modules
(`corpus/harness/id-corpus-lib.mjs`, `corpus/harness/wo101-support.mjs`).
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** filed on 2026-09-01 (`1c3ec8aa`) in the
adjacent work-order series for autonomous Codex downtime, one of the two
kernel-corpus orders with WO-101; its identifier is a stable, opaque
reference, as the same day's identity update settled when it retired the
series' provisional renumbering. Opaque identifier, not a priority.
Clean-room screen: the corpus is original generated test data; no stop
condition. Amended by the 2026-09-28 planning pass, which re-observed the
order on `main` at `5f3849ec`: it is restated in the current form; the
deferred-kind pins WO-017 already ships leave its deliverables; a
property violation is quarantined as a finding, as a divergence already
was; its release, authority and gates follow today's lifecycle
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-004 merged (the reviewed environment baseline; closed,
v0.2.1). WO-101 is a reference only (closed, v0.2.2): it created
`corpus/`, and this order's fixture and harness filenames are disjoint
from its.
**Recommended placement:** outside the sequence; the planning map names
WO-107 the first candidate for adjacent evidence work and this order an
alternative. It adds files only under `corpus/fixtures/cadence/`,
`corpus/harness/` and `corpus/manifests/`, so it is disjoint from every
queued order. Before it is sequenced a planning pass decides whether the
sweep is still wanted beside the root suite's cadence pins, whether it
releases as a patch or closes without a release at the operator's
direction, and which delivery order it pairs with as the evidence entry.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-004",
    "relation": "satisfied-by-close",
    "reason": "The reviewed environment baseline is required before the corpus run."
  },
  {
    "workOrderId": "WO-101",
    "relation": "reference-only",
    "reason": "The corpus orders are independent, with disjoint fixture and harness filenames."
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/kernel/README.md` (evaluation
limited to Cadence `Once`, `After`, `Every`, `Until`, `Gate` and
`Backoff`); 02-domain-model.md §Events and decisions (the kernel loop)
(the Cadence grammar, virtual time and conditions by reference);
03-architecture.md §Corpus policy (the generated corpora it records);
`corpus/README.md` (the entry point and WO-101's lanes);
`docs/work-orders/WO-002-pure-kernel.md` (settled deferrals); the shipped
`evaluateCadence` in `packages/kernel/src/core.ts`, the read-only oracle:
Every alignment arithmetic, the LCG `draw`
(`imul(state,1664525)+1013904223 >>> 0`) and the Backoff clamp and jitter
formula; `packages/kernel/test/ac3-cadence.test.ts` and
`packages/kernel/test/wo017-evaluable-kinds.test.ts` (the classes the
root suite already pins); 07-execution-guide.md §Model-specific notes and
§Discipline (the precedence rule; release assignment is opt-out); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** An exhaustive golden-vector corpus for the six evaluated
cadence constructors. Honesty clause up front: the independent in-harness
reimplementation of the LCG and Backoff formula pins the SHIPPED formula at
the base commit — a drift and porting alarm — not conformance to any external
specification; the formula is documented only by `core.ts` and by the
root-suite tests that pin some of its classes, so a disagreement means
implementation drift or a harness bug, never spec violation. Sweeps: (a)
boundary matrices for `Once`/`After`/`Every` — now
before/at/after startAt; the ABSENT-startAt variant where the constructor
omits the key entirely and the evaluator defaults it (`?? 0`), not only
startAt-present cases; the at-startAt fixed point pinned exactly as shipped
(including whether the due pulse lands at start or start + interval);
interval 1 and huge values; the pinned throw for non-finite or non-positive
`intervalMs`; alignment fixed-point cases. (b) Deep composition enumeration
of `Gate`-in-`Until`-in-`Gate` nesting to a bounded depth against a small
versioned predicate registry (frozen in the manifest), pinning trace strings
and null-vs-due outcomes. (c) Full `Backoff` sweeps across attempt × factor ×
jitter × rngState grids, asserting determinism, `0 ≤ delay ≤ maxMs`, jitter
drawn only from explicit rngState, and exact rngState threading —
cross-checked against the independent reimplementation (32-bit arithmetic on
a different code path, same math). (d) No-wall-clock-leakage property under
poisoned `Date.now`/`Math.random`. The eight deferred kinds (`Burst`,
`Calendar`, `Window`, `While`, `Sequence`, `Merge`, `Race`, `Repeat`) are
not pinned again: WO-017's root-suite test already pins each as a throw.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-01 at `1c3ec8aa`):**

- `corpus/` exists since WO-101 (`383ee550`, 2026-09-01) with its entry
  point `corpus/README.md`, WO-101's ID and Program lanes and WO-108's
  mutation lane; product 03 §Corpus policy has recorded the generated
  corpora since its 2026-09-06 synchronization. Neither names a cadence
  lane, and `npm test` runs a corpus test only by name (WO-101's ID test).
- The kernel (component 0.6.0) evaluates six cadence kinds and throws for
  the other eight; the LCG draw, the `?? 0` start default, the refusal of
  a non-finite or non-positive interval and the Backoff formula are as the
  Objective states.
- The root suite pins some classes the Objective sweeps: `Every` before
  `startAt`, no fixed points over a grid, the non-finite interval
  refusal, the Backoff clamp, the jitter chain and a poisoned ambient
  clock and random source, and each of the eight deferred kinds as a throw
  (WO-017, `v0.3.5`).
- Release preparation requires one classification line that begins
  `patch.`, `minor.` or `major.`, and retimes a heading version at or
  below the latest tag (`v0.52.10`) to the next version of its class, so a
  version below the latest tag no longer yields a close without a
  release; that close is the operator's direction (07 §Discipline).
- The lifecycle writes more than the order's first exemption list named:
  the order's control segment, the generated index, the decisions file,
  release preparation's heading, README block and roadmap note, and
  verification and final-review records.
- The operator's sessions run without a host sandbox; `npm test` refuses
  inside a sandbox in force when a selected suite needs the outside, as
  the skeleton suite does.

**Design (scope discipline):**

- New files only, under `corpus/fixtures/cadence/`, `corpus/harness/` and
  `corpus/manifests/` (with `corpus/manifests/runs/`). No existing file is
  edited apart from the records the lifecycle's own commands write;
  `corpus/README.md` exists, so the lane's commands are recorded in its
  manifest (operator-review assumption 2).
- A divergence between shipped behavior and the reimplementation, or any
  boundary surprise, is a numbered finding in
  `corpus/manifests/findings-WO-102.md` with a reproducing vector, never a
  fix and never a document edit.
- The eight deferred kinds are not pinned again: WO-017's root-suite test
  pins each as a throw.
- Zero new dependencies; nothing is added to the root `test` script or any
  release-evidence command. The work is offline and invokes no model after
  `npm run build`, and it needs no operator decision mid-flight.
- The executor's work has no external effect: no push, pull request, tag,
  publish, install, configuration change or destructive Git operation.
- **Declined alternatives, recorded:** a corpus-local pin file for the
  deferred kinds (the root suite pins them; reopen if that test stops
  covering a deferred kind); claiming external-spec conformance for the
  LCG and Backoff math (the shipped code is the only specification).

**Deliverables:**

- `corpus/harness/generate-cadence-corpus.mjs`: a seeded deterministic
  generator with `--write` and `--check` modes, embedding the versioned
  predicate registry.
- `corpus/fixtures/cadence/`: sharded JSONL golden vectors (cadence AST,
  env `{now, rngState}`, optional event, and the expected
  `{dueAt, rngState, trace}` or the expected throw), within a stated
  committed-size budget; larger grids regenerable from the seed with
  manifest-only commitment.
- `corpus/harness/wo102-*.test.mjs`: the vector replay harness, the
  property sweeps and the independent Backoff and LCG reference
  implementation.
- `corpus/manifests/WO-102.json` (seed, grid bounds, counts per
  constructor and per boundary class, the absent-startAt and at-startAt
  classes included, the frozen predicate registry, fixture hashes, base
  commit, toolchain profile) and `corpus/manifests/runs/WO-102-<commit>.log`.
- Generator self-tests: planted known vectors, including at least one
  hand-computed Backoff vector verified against both implementations.

**Acceptance criteria (all required)**

1. Every evaluated constructor has stated grid bounds and per-class counts
   in the manifest, covering every boundary class named in the Objective,
   the absent-startAt and at-startAt fixed-point cells explicitly among
   them.
2. All committed vectors pass against the shipped kernel; the
   shipped-versus-reference Backoff and LCG cross-check agrees over the
   full grid the manifest declares, or each disagreement is quarantined as
   a numbered finding worded as a drift alarm, per the honesty clause.
3. The clamp, threading and purity properties hold over the full sweep the
   manifest declares, not just the committed shards, or each violation is
   quarantined as a numbered finding with its reproducing vector. The
   criterion is judged against the declared set; a case outside it is a
   follow-up, not a failure.
4. `--check` regeneration is byte-identical from the recorded seed.
5. The decisions file records the seed, the grid bounds and each finding's
   number, and no existing file is edited beyond the lifecycle's own
   records.
6. After `npm run build`, the generator's `--check` from the recorded
   seed and `node --test corpus/harness/wo102-*.test.mjs` pass with counts
   matching the manifest; `npm test` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the transcript under `corpus/manifests/runs/` of
`npm run build`,
`node corpus/harness/generate-cadence-corpus.mjs --seed <recorded> --check`
and `node --test corpus/harness/wo102-*.test.mjs`, with counts matching
the manifest; `npm test` and `npm run test:docs` before
`implementation-ready` and at final review. No live row.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** implementing `Burst`, `Calendar`, `Window`, `While`,
`Sequence`, `Merge`, `Race` or `Repeat` semantics (settled arrive-on-contact
deferral; do not relitigate); scheduler IR or activation-event capture
(deferred until real planning uses expose a need); claiming external-spec
conformance for the LCG and Backoff math (the shipped code is the only
spec); kernel edits of any kind; performance claims (WO-107's lane); root
test-script wiring; product-document write-backs; naming the lane in
`corpus/README.md` or product 03 §Corpus policy.

**Operator-review assumptions**

1. The order releases as a patch under the opt-out default.
2. The lane's commands live in its manifest; `corpus/README.md` and
   product 03 §Corpus policy name the lane in a later order's
   documentation change; this order modifies no existing file.
3. WO-017's root-suite test is the one pin for the eight deferred kinds;
   the corpus adds no second pin file.
