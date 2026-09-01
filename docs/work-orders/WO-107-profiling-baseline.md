# WO-107 — Deterministic profiling harness and first baseline observation corpus (version assigned at activation)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, the planner MUST rewrite this H1 to carry exactly one
strict `vX.Y.Z` (`scripts/release.mjs` refuses any other heading at close) and
MUST pin the close disposition: a version strictly below the latest published
tag (honest no-release close) or an operator-authorized, dated retiming.
Never an unauthorized patch between the reserved v0.2.2 (WO-005) and v0.2.3
(WO-006) rungs. Expected class: internal tooling/evidence only.
**Series note:** reserved adjacent WO-10x series; numbering provisional — the
operator may renumber at activation.
**Depends on:** WO-004 merged — branch from `origin/main` at or after the
v0.2.1 close; all measurements are pinned to that base commit. Independent of
the mainline (WO-005's efficiency-measurement non-goal binds WO-005's scope,
not this order).

**Cites (read these sections):** 06-roadmap.md §Counterfactual profiling work
orders (the full measurement contract: immutable pinned baseline, exact
commands, environment/toolchain profile, warm-up/repetition/run-order rules,
resource vector, distribution-and-uncertainty reporting, append-only
machine-readable results — noting its capability-table field list is "can
add", a candidate shape, not pinned), §Capability progression (E1 =
representative baseline and resource vector exist; never fabricate), and the
roadmap preamble's pacing rules together with §Efficiency as a separate
capability axis and 00-vision.md (the point-of-view-before-efficiency stance;
note that "Beware of Naive Interventionism" in compiled-support form is an
unsettled raw candidate in 05-pattern-library.md, cited as posture, not as a
pinned mechanism); 03-architecture.md §Corpus policy (layout being extended —
see Corpus-layout note); docs/work-orders/WO-005-capability-table.md (the
E0-unknown default this order's output makes upgradeable later).

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

**Authority (bounded):**
- MAY create new files only under `corpus/harness/`, `corpus/baselines/`, and
  `corpus/manifests/runs/` (transcripts), plus `corpus/README.md` if absent.
- MUST NOT modify any existing repo file — in particular `docs/planning/`
  (WO-005's territory), `docs/product/06-roadmap.md`, `docs/README.md`, and
  the ledger. Exempt: the standing lifecycle machinery when running in the
  control-plane slot — `docs/control/resume.jsonl` appends via
  `scripts/resume.mjs`, the regenerated `docs/control/current.md`, checkpoint
  refs, and numbered `docs/verifications/WO-107/` artifacts. Ledger duty
  waived by this clause (precedence rule); note the skipped duty in the
  result.
- MUST NOT implement, measure, or suggest any optimization candidate;
  anything that looks like a bottleneck is a neutral observation record plus
  at most a numbered note in `corpus/baselines/findings-WO-107.md` —
  interpretation is explicitly deferred.
- Zero new dependencies; nothing added to root `test`; no benchmark library
  (node builtins only, per ADR-0002's amendment rule).
- No external effects: no push/PR/tag/publish/install/config
  mutation/destructive git.

**Corpus-layout note:** `corpus/` does not exist yet; 03-architecture.md
§Corpus policy's sanitized/fixtures/manifests tree governs the sanitized
source/incident corpus. `corpus/baselines/` is a new subtree of generated
evidence material outside that policy's named structure; whichever adjacent
order lands first creates `corpus/README.md` distinguishing the two. Record
as an open question that a later doc pass must sync §Corpus policy (no
`docs/` authority here).

**Isolation & control plane:** one writable agent, own worktree from the clean
main checkout; the machine should be otherwise quiet — the operator picks the
window at activation. Default is in-slot activation via
`npm run worktree -- start` between mainline activations, with the standard
resume phases and the pinned close disposition; if run outside the slot, the
operator names the closeout path at activation (numbered verification, final
review, PR, explicit no-release disposition). Zero mid-flight operator
decisions.

**Preflight (operator):** node_modules provisioned (network-disabled Codex
sandbox); `npm run build && npm test` green at base; a quiet machine window
scheduled. Fully offline and model-invocation-free thereafter.

**Deliverables:**
1. `corpus/harness/profile.mjs` — the deterministic harness: scenario
   registry, warm-up/repetition/interleaving engine with recorded run-order
   seed, environment and machine-load profiler, distribution reporter, and a
   `--compare` mode that GENERATES the comparison report from two observation
   files.
2. `corpus/baselines/SCHEMA-WO-107.md` — the provisional observation-record
   schema with its non-normative header.
3. `corpus/baselines/observations-<commit>.jsonl` — append-only observation
   records for every scenario, from TWO complete independent harness
   executions (separately seeded run orders).
4. `corpus/baselines/WO-107-comparison.md` — the GENERATED report comparing
   the two executions' distributions per scenario, surfacing
   between-execution disagreement and the recorded machine-load indicators
   prominently (overlap/variance presentation only — no verdicts, no
   thresholds).
5. `corpus/harness/wo107-schema.test.mjs` — node:test validation that every
   observation record conforms to the pinned schema with all required fields
   (commit, environment, seeds, distributions, load indicators) well-formed;
   plus harness self-tests (a deterministic dummy scenario proving the
   repetition/interleaving engine records what it ran).
6. `corpus/manifests/runs/WO-107-<commit>.log` — captured transcripts of both
   executions and the comparison generation.

**Acceptance criteria (all required):**
1. Every scenario has observations from two complete executions with distinct
   recorded run-order seeds, distribution stats, full environment profiles,
   and boundary-sampled machine-load indicators.
2. The schema-validation suite passes over every committed record.
3. The comparison report is generated by the harness via the gated `--compare`
   command (a regenerate-and-diff in the gate proves it is not hand-written)
   and presents distributions and between-execution disagreement without
   verdicts or thresholds.
4. The observation files are append-only in form (one record per line, keyed
   to commit) and retain all runs including outliers.
5. No numeric result anywhere is presented as a single point without its
   distribution.

**Evidence gate (executable):** `npm run build && node
corpus/harness/profile.mjs --seed <s1> --out
corpus/baselines/observations-<commit>.jsonl && node
corpus/harness/profile.mjs --seed <s2> --out
corpus/baselines/observations-<commit>.jsonl && node
corpus/harness/profile.mjs --compare
corpus/baselines/observations-<commit>.jsonl --out
corpus/baselines/WO-107-comparison.md && node
corpus/harness/profile.mjs --compare
corpus/baselines/observations-<commit>.jsonl --check && node --test
corpus/harness/wo107-*.test.mjs`, transcripts captured under
`corpus/manifests/runs/`.

**Non-goals:** optimization candidates, code changes, or promotion decisions
(the counterfactual-profiling comparison machinery and candidate families are
a later reviewed program); editing the capability table or claiming any
E-level (WO-005 or a successor links these observations); pinning the
roadmap's candidate `efficiencyLevel/baseline/resourceVector/...` field list
into product docs (preserved-open — this order's schema is provisional and
corpus-local); statistical significance verdicts or thresholds
(preserved-open); root test-script wiring; docs/product or ledger
write-backs.
