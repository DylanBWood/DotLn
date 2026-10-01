# WO-105 — Crash-shape corpus: store truncation sweep, skeleton recovery sweep, golden traces, and fixture-tree families (v0.61.1)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Evidence only: new files under
`corpus/` and the operator-approved test protocol registration below;
no runtime, package-manifest or contract change. Assigned at activation
under the standing opt-out default; a close without a release needs the
operator's direction.
**Cost:** adds seeded store-log and fixture-tree generators with
`--write` and `--check` modes, an every-offset truncation sweep of the
store and of the skeleton's crash recovery, golden trace fixtures of the
canonical demo, signature-distinct tree families with structural ground
truth, harnesses, a manifest, an append-only observations file and run
transcripts under `corpus/`, and a findings file if a finding arises;
nothing joins the root `npm test`, and nothing is added under
`packages/skeleton/test/`. Removes nothing that runs; it pins truncation
and recovery behavior over every cut the manifest declares. Re-mints:
none; apart from the operator-approved registration, the order adds new
files only and edits none of the registered
oracles it reads (`packages/kernel/src/core.ts`,
`packages/kernel/src/store.ts`, `packages/skeleton/src/scenario.ts`,
`packages/skeleton/fixtures/repo-tree.json`). Wall-clock, tokens and
context bytes are unknown until run.
**Operator-authorized exception (2026-10-01):** the operator approved one
entry in `packages/kernel/test/fixtures/jsonl-protocols.json`, declaring
`corpus/manifests/WO-105-observations.jsonl` as crash-corpus classified
observations. The document gate otherwise treats that required file as an
EventEnvelope stream. This is the sole exception to the existing-file
boundary beyond lifecycle records, including criterion 6 and the kernel
edit non-goal below; decoder, test implementation and recorded observation
bytes remain unchanged. See `docs/evidence/WO-105/decisions.md`
WO-105-D009/D010. The earlier authorization to install the pinned browser
locally is recorded in WO-105-D008.
**Nomination provenance:** filed on 2026-09-01 (`1c3ec8aa`) in the
adjacent work-order series for autonomous Codex downtime; it consolidates
the former WO-105 (store lane) and WO-106 (skeleton lane) candidates, and
its identifier is a stable, opaque reference, as the same day's identity
update settled when it retired the series' provisional renumbering. On
2026-09-03 its scope was split: WO-017 absorbed the physical
malformed-line lane, and this order kept the truncation sweeps and the
valid-object anomalies WO-017 did not decide. Opaque identifier, not a
priority. Clean-room screen: the corpus is original generated test data;
no stop condition. Amended by the 2026-09-28 planning pass, which
re-observed the order on `main` at `5f3849ec`: it is restated in the
current form; by the scope split's own rule the three anomaly families
the positive decoder now refuses leave the corpus; the golden traces'
reason is restated after WO-008; a family excluded from the live run is
excluded from the identity check; its release, authority and gates follow
today's lifecycle
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-004 merged (the reviewed environment baseline; closed,
v0.2.1); WO-017 merged (the reviewed kernel truthfulness boundary; closed,
v0.3.5). Independent of the other adjacent orders.
**Recommended placement:** outside the sequence; the planning map names
WO-107 the first candidate for adjacent evidence work and this order an
alternative. Apart from the approved protocol registration, it adds files
only under `corpus/fixtures/store/`,
`corpus/fixtures/golden-traces/`, `corpus/fixtures/skeleton-trees/`,
`corpus/harness/` and `corpus/manifests/`, so its new corpus files are disjoint from every
queued order. Before it is sequenced a planning pass decides whether the
sweep is still wanted, whether the golden traces still earn a corpus
record beside the root suite's frozen decision traces, whether it
releases as a patch or closes without a release at the operator's
direction, and which delivery order it pairs with as the evidence entry.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-004",
    "relation": "satisfied-by-close",
    "reason": "The reviewed environment baseline is required."
  },
  {
    "workOrderId": "WO-017",
    "relation": "satisfied-by-close",
    "reason": "The reviewed kernel truthfulness boundary is required before crash-shape fixtures."
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the kernel loop) and §Memory and observation (the event store:
append-only JSONL, `evt_<n>` assigned at the store boundary; deterministic
replay); 03-architecture.md §Session lifecycle & resilience (the
failure-injection matrix: rows 1 and 3 at v0.1.0; rows 2, 4 and 6
established by WO-009, closed at `v0.10.0`) and §Corpus policy;
09-audit-resilience-privacy.md §Bootstrap sequence step 5
(crash-after-effect ambiguity simulation), whose WO-009 timing comes from
the failure-injection matrix and WO-007's explicit deferral of bootstrap
steps 4–7 — cite those two for the deferral fence, not step 5 alone;
`docs/work-orders/WO-003-walking-skeleton.md` (the 13-step scenario
contract, live-vs-replay identity, the crash-recovery hook, and the
explicitly non-normative hand-assembled loadout); 04-interfaces.md
preamble (same normalized program + state + event + seed ⇒ same
decision); `docs/work-orders/WO-008-composition-compiler.md` AC6
(identical decision traces after compilation) and
`packages/skeleton/fixtures/wo003-decision-traces.json` (the frozen
traces it compares); `packages/kernel/test/store-decode.test.ts` and
`packages/kernel/test/fixtures/malformed-envelopes.json` (what the root
suite binds of the decoder); the shipped `appendEvent`/`decodeLog`/`encodeLog`
in `packages/kernel/src/store.ts`, `replay`/`replayOutbox` in `core.ts`, and
`runScenario`/`replayScenario`/`ScenarioOptions` (`crashAfterPersist`,
`recoveryLogTransform`) in `packages/skeleton/src/scenario.ts` — all
read-only oracles; `corpus/README.md`; 07-execution-guide.md
§Model-specific notes and §Discipline (the precedence rule; release
assignment is opt-out); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** One corpus of executable crash shapes across both layers of the
spine, plus the golden traces that pin today's behavior. STORE LANE — (a)
round-trip laws over generated logs of varied sizes:
`decodeLog(encodeLog(events))` identity; `appendEvent` numbering across empty
and well-formed LF-terminated logs, payloads containing escaped newlines, and
the separately classified CRLF family—no unterminated or blank-line form is an
accepted numbering variant; eventId monotonicity over long append chains. (b)
Truncation sweep: for each
generated log (plus the deterministic 13-step demo log regenerated in-harness
via the shipped scenario), cut at EVERY byte offset and classify:
line-boundary cut ⇒ clean prefix decode exactly equal to the untruncated
prefix; mid-line cut ⇒ loud `decodeLog` failure; the invariant is that NO cut
yields a silent third class (a successful parse diverging from the true
prefix). Honesty clause: for the landed decode contract, this invariant is
near-provable — no strict prefix of a minified JSON object parses — so the
sweep's value is the persistent classified corpus and boundary pins, not
discovery; the acceptance claims are worded as pinning, not finding. (c)
Retained valid-object anomaly families: CRLF and deep nesting — each
classified {decodes-with-behavior-X | throws}, and where decode succeeds,
`replay`/`replayOutbox` run-twice determinism still holds. Duplicated and
out-of-order eventIds and duplicated whole lines are no longer retained:
the positive decoder refuses each with `EVENT_ORDER`, and the root suite
binds it (WO-045, `v0.20.0`). (d) Machine-readable
results: one record per cut point/family
(log seed, offset, outcome class). SKELETON LANE — (e) Golden trace corpus:
run the canonical 13-step demo at the pinned base commit and commit its full
kernel DecisionTrace sequence, event log, and glyph-scene output as golden
fixtures, recording the EXACT regeneration command and scenario invocation
alongside the base commit so any consumer can re-derive it. The root suite
already freezes the demo's decision traces and compares every live trace
to them (WO-008, `v0.4.0`), so this record is no tripwire before WO-008;
it keeps the traces, the event log, the glyph scene and the regeneration
command together as raw material for a consumer. (f)
Crash-truncation sweep: drive `runScenario(fixture, {crashAfterPersist: true,
recoveryLogTransform})` with transforms cutting the persisted log at every
line boundary and byte offset, plus retained valid-object anomaly families,
asserting per cut: adapter effect count never exceeds one per commandId;
pending commands are recomputed from the surviving log; live-vs-replay trace
identity wherever the log decodes; loud failure wherever it cannot — never
silent divergence. (g) Fixture-tree family generator: a seeded generator
producing committed repo-tree families (varying file count, reference-graph
shapes including cycles, orphans, every classification mix, planted deletion
candidates), each paired with machine-readable STRUCTURAL ground truth
(inventory counts, reachability, orphan set) and a validator proving output
matches its own ground truth and same seed ⇒ byte-identical output. Each
committed family MUST demonstrate a distinct behavioral signature through the
shipped scenario (different candidate set, classification mix, or trace
shape, recorded in the manifest) and N is capped accordingly — same-signature
families are redundant fixtures that rot. A family that trips an assertion
the shipped scenario or its reactor throws (for example
`reactor did not declare a NoOp` in `scenario.ts`, or
`deletion unexpectedly authorized` in `reactor.ts`) is classified as a
numbered finding or excluded-with-reason in the manifest — never silently
dropped. Ground truth is explicitly labeled
non-normative structural data; honest downstream consumers are 09-audit's
deferred step-5 crash-ambiguity evidence gathering and the eventual store
swap implied by ADR-0002's JSONL-first stance, where this corpus becomes the
compatibility oracle — no claim is made that WO-009's rows 2/4/6 contract
requires it.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-01 at `1c3ec8aa`):**

- `corpus/` exists since WO-101 (`383ee550`, 2026-09-01) with its entry
  point `corpus/README.md`, WO-101's ID and Program lanes and WO-108's
  mutation lane; product 03 §Corpus policy has recorded the generated
  corpora since its 2026-09-06 synchronization. Neither names a store,
  golden-trace or tree lane, and `npm test` runs a corpus test only by
  name (WO-101's ID test).
- The positive decoder (WO-045, `e0bb3bff`, 2026-09-15) requires each
  line's `eventId` to equal `evt_<line number>`, so duplicated and
  out-of-order identifiers and duplicated whole lines fail with
  `EVENT_ORDER`; it refuses unknown envelope fields, walks deep nesting
  with an explicit stack and accepts CRLF. The root suite binds
  `EVENT_ORDER`, CRLF and deep nesting.
- WO-008 closed at `v0.4.0`: the root suite freezes the demo's decision
  traces and compares every live trace to them, and the demo now runs the
  compiled Seiri loadout. WO-007, WO-009 and WO-010, which the order named
  as owners of skeleton pieces, are closed as well.
- `ScenarioOptions` still carries `crashAfterPersist` and
  `recoveryLogTransform`, beside `equippedLoadout`, `onEvents`,
  `onExecutorClaim` and `verifier`; `scenario.ts` has changed in nine
  commits since 2026-09-04. No shipped assertion reads "unexpected cadence
  pulse"; `deletion unexpectedly authorized` is thrown by
  `packages/skeleton/src/reactor.ts`.
- The runner expands every compiled `packages/skeleton/test/` file into
  `npm test`, so a test file added there joins the release evidence.
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

- New files only, under `corpus/fixtures/store/`,
  `corpus/fixtures/golden-traces/`, `corpus/fixtures/skeleton-trees/`
  (including `corpus/fixtures/skeleton-trees/README.md`, where the lane's
  non-normative labeling lives), `corpus/harness/` and
  `corpus/manifests/` (with `corpus/manifests/runs/`). No existing file is
  edited apart from the records the lifecycle's own commands write and
  the operator-approved single test protocol registration above:
  `packages/skeleton/` stays untouched, `fixtures/repo-tree.json`
  included, and no file is added under `packages/skeleton/test/`, which
  the runner would promote into the release evidence. `corpus/README.md`
  exists, so the lane's commands are recorded in its manifest
  (operator-review assumption 2).
- WO-017 absorbed the physical malformed-line lane as a product fix with
  root-suite tests (partial or complete unterminated tails, blank or
  whitespace-only lines and non-object JSON values fail closed with the
  physical line number), and WO-045's positive decoder refuses duplicated
  and out-of-order identifiers and duplicated whole lines with
  `EVENT_ORDER`, bound in the root suite. This order builds no parallel
  corpus for those cases; it retains every-byte truncation sweeps and the
  CRLF and deep-nesting families. The remaining corpus measures the landed
  codec rather than preserving an earlier one.
- Behavioral surprises (a silent-divergence cut, a nondeterministic decode
  or replay) become numbered findings in
  `corpus/manifests/findings-WO-105.md` with log seed and offset, never a
  store or scenario fix and never new recovery machinery.
- Zero new dependencies; nothing is added to the root `test` script. Full
  sweep results are committed as compact classified summaries; raw
  per-offset records beyond the stated budget are regenerable from seed.
  The work is offline and invokes no model after `npm run build`, and it
  needs no operator decision mid-flight.
- The executor's work has no external effect: no push, pull request, tag,
  publish, configuration change or destructive Git operation. The
  operator's local pinned-browser installation exception is recorded in
  WO-105-D008; no other installation is authorized.
- **Declined alternatives, recorded:** a parallel corpus for cases the
  root suite binds (the scope split's rule; reopen when the decoder's
  contract changes).

**Deliverables:**

- `corpus/harness/generate-store-corpus.mjs` (a seeded log generator:
  valid envelopes over a small event alphabet with correlation and
  causation chains, command results and duplicates; `--write` and
  `--check`) and `corpus/harness/truncation-sweep.mjs` (the every-offset
  cutter and classifier with declared log sizes and seed).
- `corpus/harness/skeleton-crash-sweep.mjs`, the every-offset truncation
  and mutation driver over the shipped `ScenarioOptions` hooks, seeded and
  classified, and `corpus/harness/generate-tree-corpus.mjs` (seeded,
  `--write` and `--check`) with
  `corpus/fixtures/skeleton-trees/<family>/{tree.json, ground-truth.json}`
  for the capped, signature-distinct families.
- `corpus/fixtures/store/`: committed representative logs and the retained
  valid-object anomaly fixtures with per-fixture expected classification;
  `corpus/fixtures/golden-traces/WO-105-demo-<commit>.json`: the canonical
  run's decision traces, event log and glyph scene, keyed to the base
  commit with its exact regeneration command recorded inside the fixture.
- `corpus/harness/wo105-*.test.mjs`: round-trip laws, the
  no-silent-divergence pin over the full store sweep, retained-family
  classification, decode-then-replay determinism, the golden replay
  assertion, skeleton crash-sweep invariants (at most one effect per
  commandId, recomputed pending commands, live-vs-replay identity), and
  the tree-to-ground-truth validator with determinism properties.
- `corpus/manifests/WO-105.json` (seeds, log sizes, total cut points per
  lane, outcome-class distributions, family inventory with behavioral
  signatures and any excluded-with-reason families, fixture hashes, base
  commit, toolchain profile); the append-only
  `corpus/manifests/WO-105-observations.jsonl` (classified sweep records);
  `corpus/manifests/runs/WO-105-<commit>.log`.
- Generator, classifier and validator self-tests with planted known cut
  points of each class and planted known-invalid trees.

**Acceptance criteria (all required)**

1. The manifest states seeds, log sizes, and the total cut points actually
   executed per lane; the captured transcript corroborates the counts.
2. The no-silent-divergence pin holds over every store cut point of the
   declared logs, and the at-most-one-effect-per-commandId and
   recomputed-pending invariants hold over every skeleton cut point the
   manifest declares, or violations are quarantined numbered findings. The
   criterion is judged against the declared set; a case outside it is a
   follow-up, not a failure.
3. The CRLF and deep-nesting families each have an explicit pinned
   classification (decode-success cases additionally prove replay
   determinism), and every committed tree family passes its own
   ground-truth validator, demonstrates its recorded distinct behavioral
   signature, and regenerates byte-identical from seed; assert-tripping
   families are findings or excluded-with-reason, never silently dropped.
4. The golden corpus replays green against the shipped scenario at the
   base commit, and live-vs-replay identity holds across every fixture
   family that completes a live run; a family excluded with its reason has
   no live run to compare.
5. `--check` regeneration is byte-identical from recorded seeds, and the
   non-normative labeling is present in
   `corpus/fixtures/skeleton-trees/README.md` and every ground-truth file
   header.
6. The decisions file records the seeds, the log sizes, the family
   inventory and each finding's number, and no existing file is edited
   beyond the lifecycle's own records and the one operator-approved
   observations-protocol registration in
   `packages/kernel/test/fixtures/jsonl-protocols.json`.
7. After `npm run build`, the store and tree generators' `--check` from
   the recorded seeds, the two sweeps and
   `node --test corpus/harness/wo105-*.test.mjs` pass with counts matching
   the manifest; `npm test` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the transcript under `corpus/manifests/runs/` of
`npm run build`,
`node corpus/harness/generate-store-corpus.mjs --seed <recorded> --check`,
`node corpus/harness/truncation-sweep.mjs --seed <recorded>`,
`node corpus/harness/generate-tree-corpus.mjs --seed <recorded> --check`,
`node corpus/harness/skeleton-crash-sweep.mjs --seed <recorded>` and
`node --test corpus/harness/wo105-*.test.mjs`, with counts matching the
manifest; `npm test` and `npm run test:docs` before
`implementation-ready` and at final review. No live row.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** failure-matrix rows 2, 4 and 6 (established by WO-009);
the physical malformed-line cases WO-017 fixed and the `EVENT_ORDER` cases
WO-045's decoder refuses, both bound in the root suite; crash-ambiguity
reconciliation machinery or any recovery repair logic (this order
classifies and pins; it does not reconcile); SQLite or any persistence
change (ADR-0002: JSONL first); pinning the loadout object or any Seiri
evidence, claim-type or proposal-packet schema; binding WO-008's AC6,
which the root suite already runs; store, kernel, or skeleton edits;
modifying `repo-tree.json`; root test-script wiring; product-document
write-backs; naming the lane in `corpus/README.md` or product 03 §Corpus
policy.

**Operator-review assumptions**

1. The order releases as a patch under the opt-out default.
2. The lane's commands live in its manifest; `corpus/README.md` and
   product 03 §Corpus policy name the lane in a later order's
   documentation change; this order modifies no existing file beyond
   lifecycle records and the operator-approved protocol registration.
3. The three families the positive decoder refuses with `EVENT_ORDER`
   leave the corpus by the scope split's own rule; CRLF and deep nesting
   stay for their replay-determinism checks.
4. The golden traces stay as one corpus record of the demo beside the
   root suite's frozen decision traces; a planning pass may drop them
   before the order is sequenced.
