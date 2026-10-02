# WO-107 — Deterministic profiling harness and first baseline observation corpus (v0.64.1)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Evidence only: new files under
`corpus/`; no runtime, package or contract change. Assigned at activation
under the standing opt-out default; a close without a release needs the
operator's direction.
**Cost:** adds `corpus/harness/profile.mjs` (scenario registry, warm-up,
repetition and interleaving engine with a recorded run-order seed,
environment and machine-load profiler, distribution reporter and a
generated comparison), a provisional record schema, the observation
records of two executions and a generated comparison report under
`corpus/baselines/`, schema and self tests, and run transcripts under
`corpus/manifests/runs/`; nothing joins the root `npm test`. Removes the
absence of an observed baseline: the capability table's efficiency cells
read `E0 — unknown` (26 lines at `5f3849ec`), and the roadmap names this
order the route to the first observed column of the
declared-versus-observed cost loop. Re-mints: none; the order adds new
files only, and
the functions it measures live in registered sources it reads and does
not edit. One skeleton suite run took 286.5 to 309.5 s in WO-115's
same-source comparison, so scenario (f) costs at least that per
repetition. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** filed on 2026-09-01 (`1c3ec8aa`) in the
adjacent work-order series for autonomous Codex downtime; its identifier
is a stable, opaque reference, as the same day's identity update settled
when it retired the series' provisional renumbering. The planning map
names it the first candidate for adjacent evidence work, because the
operator's declared-versus-observed cost loop needs an observed baseline
column before analysis. Opaque identifier, not a priority. Clean-room
screen: the observations measure this repository's own code; no stop
condition. Amended by the 2026-09-28 planning pass, which re-observed the
order on `main` at `5f3849ec`: it is restated in the current form; the
re-runnable check reads the committed observations instead of appending
to them; the single-point and retention criteria declare their sets; the
roadmap citations name their headings; its release, authority and gates
follow today's lifecycle
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-004 merged (measurements require the reviewed
environment baseline; closed, v0.2.1); all measurements are pinned to the
order's base commit. WO-005 is a reference only (closed, v0.2.2): its
efficiency-measurement non-goal binds its own scope, not this order.
**Recommended placement:** outside the sequence; the planning map names
it the first candidate for adjacent evidence work. It adds files only
under `corpus/harness/`, `corpus/baselines/` and `corpus/manifests/runs/`,
so it is disjoint from every queued order. Before it is sequenced a
planning pass decides whether the baseline is still wanted, whether it
releases as a patch or closes without a release at the operator's
direction, the repetition count for scenario (f) the operator accepts,
and which delivery order it pairs with as the evidence entry. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-004",
    "relation": "satisfied-by-close",
    "reason": "Measurements require the reviewed environment baseline."
  },
  {
    "workOrderId": "WO-005",
    "relation": "reference-only",
    "reason": "The mainline efficiency non-goal does not constrain this independent measurement order."
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Counterfactual profiling
work orders (the full measurement contract: immutable pinned baseline,
exact commands, environment and toolchain profile, warm-up, repetition
and run-order rules, resource vector, distribution-and-uncertainty
reporting, append-only machine-readable results; its capability-table
field list is "can add", a candidate shape, not pinned), §Capability
progression policies and its subsection §Efficiency as a separate
capability axis (the E0 to E5 scale; E1 is "representative baseline and
resource vector exist"), and the roadmap preamble's pacing rules; WO-087
moves the roadmap's policy sections to the planning map under the same
slugs, so the executor cites them where they stand at its base;
00-vision.md §What DotLn is not (point of view before efficiency);
05-pattern-library.md §Candidate — Beware of Naive Interventionism, an
unsettled candidate cited as posture, not as a pinned mechanism;
03-architecture.md §Corpus policy; `corpus/README.md`;
`docs/work-orders/WO-005-capability-table.md` (the `E0 — unknown` default
this order's output makes upgradeable later);
`docs/planning/capability-table.md`;
`docs/evidence/WO-115/scheduling-comparison.json` (the measured suite
durations); 07-execution-guide.md §Model-specific notes and §Discipline
(the precedence rule; release assignment is opt-out); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Measurement only — no candidates, no interventions, no
interpretation. Build a deterministic profiling harness (node builtins:
`node:perf_hooks`, `process.hrtime.bigint`, `process.memoryUsage`,
`os.loadavg`) and produce the repository's first admissible baseline
observations at the pinned commit for: (a) `replay` throughput vs generated
log size (several sizes); (b) `evaluateCadence` cost over representative
grids per constructor; (c) `stableHash`/`commandId` throughput over
representative input classes; (d) `decodeLog`/`encodeLog` throughput vs log
size; (e) the 13-step skeleton demo end-to-end, live and replay; (f) full
`npm run build` and kernel+skeleton `node --test` suite durations. Contract
per the roadmap: declared warm-up iterations; N repetitions per scenario with
the run ORDER randomized from a recorded seed and interleaved across
scenarios; every observation record carries {base commit,
environment/toolchain profile (os, cpu model, node/tsc versions), scenario
id, repetition count, run-order seed, resource vector, distribution stats
(min/p25/p50/p90/max, mean, stddev)} PLUS machine-load indicators sampled at
run boundaries (load average, process/system memory pressure) so a later
reader can reject a noisy baseline recorded on a busy machine instead of
trusting it as E1 evidence. Records are append-only JSONL; regressions,
outliers, and no-signal results are retained, never pruned. The record schema
is pinned IN THIS ORDER as `corpus/baselines/SCHEMA-WO-107.md` with an
explicit non-normative/provisional header — promotion into product docs is a
later reviewed pass, not this order's authority.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-01 at `1c3ec8aa`):**

- `corpus/baselines/` does not exist, and the capability table's
  efficiency cells read `E0 — unknown` (26 lines) with none at E1, so no
  baseline of the kind the roadmap's profiling contract defines exists.
  Measurements of other kinds do: gate durations
  (`scripts/measure-gates.mjs`), a scheduling comparison
  (`docs/evidence/WO-115/scheduling-comparison.json`), a build comparison
  (`docs/evidence/WO-126/build-comparison.json`) and beacon benchmarks.
- Scenario (f) has grown: the skeleton suite had 1 test file at
  `1c3ec8aa` and has 44 at `5f3849ec`, the kernel suite 9 and 13; one
  skeleton suite run took 286.5 to 309.5 s in WO-115's comparison, and the
  suite needs the outside of any sandbox. The executor re-measures these
  at its base.
- As filed, the gate's two profiling commands append two executions to the
  committed observations file each time the gate runs, so a verifier who
  runs it changes the committed evidence and the input of the comparison
  it then regenerates and checks.
- The roadmap's field list for the capability table still reads "can
  add", and "Beware of Naive Interventionism" is still a candidate in
  product 05.
- `corpus/` exists since WO-101 (`383ee550`, 2026-09-01) with its entry
  point `corpus/README.md`; product 03 §Corpus policy has recorded the
  generated corpora since its 2026-09-06 synchronization. Neither names a
  baselines lane, and `npm test` runs a corpus test only by name.
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

- **Operator-authorized exception, 2026-10-02:** add exactly one entry for
  this order's observations JSONL to
  `packages/kernel/test/fixtures/jsonl-protocols.json`. The existing strict
  EventEnvelope test otherwise misclassifies this new evidence protocol.
  No runtime or test assertion changes are authorized. Measurements retain
  the pinned runtime and disclose this classification-only metadata overlay;
  the first execution and failed attempt remain retained. See
  [WO-107-D007](../evidence/WO-107/decisions.md#wo-107-d007).

- New files only, under `corpus/harness/`, `corpus/baselines/` and
  `corpus/manifests/runs/`. No existing file is edited apart from the
  records the lifecycle's own commands write: `docs/planning/`,
  `docs/product/06-roadmap.md`, `docs/README.md` and the ledger stay
  untouched. `corpus/README.md` exists, so the lane's commands are
  recorded in its schema file and transcripts (operator-review
  assumption 2).
- Measurement only: no optimization candidate is implemented, measured or
  suggested; anything that looks like a bottleneck is a neutral
  observation record plus at most a numbered note in
  `corpus/baselines/findings-WO-107.md`. Interpretation is deferred.
- Zero new dependencies; nothing is added to the root `test` script; no
  benchmark library (node builtins only, per ADR-0002's amendment rule).
- The executor declares the warm-up and repetition counts before the first
  execution, stating scenario (f)'s expected duration from the measured
  suite time (operator-review assumption 4).
- The executor runs the two executions and the comparison's generation
  once and captures their transcripts; the re-runnable check reads the
  committed observations and appends nothing.
- The work is offline and invokes no model after `npm run build`; it needs
  no operator decision mid-flight, and the executor's work has no external
  effect: no push, pull request, tag, publish, install, configuration
  change or destructive Git operation.
- **Declined alternatives, recorded:** re-running the executions inside
  the re-runnable gate (each run appends two executions and changes the
  comparison's input; reopen if the harness writes each execution to a
  file of its own).

**Deliverables:**

- `corpus/harness/profile.mjs`: the deterministic harness (scenario
  registry, warm-up, repetition and interleaving engine with a recorded
  run-order seed, environment and machine-load profiler, distribution
  reporter, and a `--compare` mode that generates the comparison report
  from the observation file).
- `corpus/baselines/SCHEMA-WO-107.md`: the provisional observation-record
  schema with its non-normative header.
- `corpus/baselines/observations-<commit>.jsonl`: append-only observation
  records for every scenario, from two complete independent harness
  executions with separately seeded run orders.
- `corpus/baselines/WO-107-comparison.md`: the generated report comparing
  the two executions' distributions per scenario, surfacing
  between-execution disagreement and the recorded machine-load indicators
  prominently (overlap and variance presentation only; no verdicts, no
  thresholds).
- `corpus/harness/wo107-schema.test.mjs`: `node:test` validation that
  every observation record conforms to the pinned schema with all required
  fields (commit, environment, seeds, distributions, load indicators)
  well-formed, plus harness self-tests (a deterministic dummy scenario
  proving the repetition and interleaving engine records what it ran).
- `corpus/manifests/runs/WO-107-<commit>.log`: captured transcripts of
  both executions and of the comparison's generation.

**Acceptance criteria (all required)**

1. Every scenario has observations from two complete executions with
   distinct recorded run-order seeds, distribution stats, full environment
   profiles, and boundary-sampled machine-load indicators.
2. The schema-validation suite passes over every committed record.
3. The comparison report is generated by the harness's `--compare` mode
   from the committed observations, and `--compare --check` over the same
   file reproduces it byte for byte without appending to it; the report
   presents distributions and between-execution disagreement without
   verdicts or thresholds.
4. The observation file is append-only in form (one record per line,
   keyed to the commit), and each record's statistics are computed over
   all of its declared repetitions, outliers included, which the record
   shows by the count its statistics used.
5. In the comparison report and the observation records, every timing and
   resource figure carries its distribution; machine-load indicators are
   boundary samples and are labeled so. The criterion is judged against
   the declared set; a case outside it is a follow-up, not a failure.
6. The decisions file records the seeds and the warm-up and repetition
   counts, and no existing file is edited beyond the lifecycle's own
   records and the one classification entry authorized in WO-107-D007.
7. After `npm run build`,
   `node corpus/harness/profile.mjs --compare corpus/baselines/observations-<commit>.jsonl --check`
   and `node --test corpus/harness/wo107-*.test.mjs` pass; `npm test` and
   `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the transcripts under `corpus/manifests/runs/` of the
executor's two executions
(`node corpus/harness/profile.mjs --seed <s1> --out corpus/baselines/observations-<commit>.jsonl`,
then the same with `--seed <s2>`) and of the comparison's generation
(`--compare` with `--out corpus/baselines/WO-107-comparison.md`); the
re-runnable check of criterion 7, which appends nothing; `npm test` and
`npm run test:docs` before `implementation-ready` and at final review.
No live row.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** optimization candidates, code changes, or promotion decisions
(the counterfactual-profiling comparison machinery and candidate families are
a later reviewed program); editing the capability table or claiming any
E-level (a later order links these observations); pinning the
roadmap's candidate `efficiencyLevel/baseline/resourceVector/...` field list
into product docs (preserved-open — this order's schema is provisional and
corpus-local); statistical significance verdicts or thresholds
(preserved-open); root test-script wiring; product-document write-backs;
naming the lane in `corpus/README.md` or product 03 §Corpus policy.

**Operator-review assumptions**

1. The order releases as a patch under the opt-out default.
2. The lane's commands live in its schema file and transcripts;
   `corpus/README.md` and product 03 §Corpus policy name the lane in a
   later order's documentation change; this order modifies no existing
   file.
3. The executor runs the executions and records the load indicators;
   they, not the time of the run, decide whether a reader trusts the
   baseline.
4. The executor declares the warm-up and repetition counts before the
   first execution, with scenario (f)'s expected duration from the
   measured suite time.
