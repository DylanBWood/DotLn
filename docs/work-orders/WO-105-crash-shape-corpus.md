# WO-105 — Crash-shape corpus: store truncation sweep, skeleton recovery sweep, golden traces, and fixture-tree families (version assigned at activation)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Before
`resume -- activate`, the planner MUST rewrite this H1 to carry exactly one
strict `vX.Y.Z` (`scripts/release.mjs` refuses any other heading at close) and
MUST pin the close disposition: a version strictly below the latest published
tag (honest no-release close) or an operator-authorized, dated retiming.
Never an unauthorized patch between the reserved v0.2.2 (WO-005) and v0.2.3
(WO-006) rungs. Expected class: internal tooling/evidence only.
**Historical series note (superseded):** reserved adjacent WO-10x series;
numbering provisional — the
operator may renumber at activation. This order consolidates the former
WO-105 (store lane) and WO-106 (skeleton lane) candidates.
**Identity update — 2026-09-01:** the provisional renumbering option above is
superseded for identifier identity. Retain `WO-105` as this order's stable,
opaque reference; represent purpose and grouping in the provisional work-order
map and future explicit metadata. This update changes no other scope.
**Depends on:** WO-004 merged and WO-017 landed — branch from `origin/main`
after the WO-017 close. Independent of the other adjacent orders.

**Scope split — 2026-09-03:** WO-017 absorbed the physical malformed-line lane
as a product fix with root-suite tests: partial or complete unterminated tails,
blank or whitespace-only lines, and non-object JSON values now fail closed with
the physical line number. This order no longer builds a parallel corpus for
those cases. It retains every-byte truncation sweeps and valid-object semantic
anomalies that WO-017 does not decide: CRLF classification, duplicate or
out-of-order event IDs, deep nesting, and duplicated whole object lines. The
remaining corpus measures the landed codec rather than preserving the buggy
one.

**Cites (read these sections):** 02-domain-model.md (Event store: append-only
JSONL, `evt_<n>` edge-assigned at the store boundary; deterministic replay);
03-architecture.md failure-injection matrix (rows 1/3 shipped; rows 2/4/6
reserved for WO-009 at its activation-assigned application version) and
§Corpus policy (layout being extended —
see Corpus-layout note); 09-audit-resilience-privacy.md §Bootstrap sequence
step 5 (crash-after-effect ambiguity simulation), whose WO-009 timing comes
from the failure-injection matrix and WO-007's explicit deferral of bootstrap
steps 4–7 — cite those two for the deferral fence, not step 5 alone;
docs/work-orders/WO-003-walking-skeleton.md (the 13-step scenario contract,
live-vs-replay identity, the crash-recovery hook, and the explicitly
NON-NORMATIVE hand-assembled loadout); 04-interfaces.md preamble (same
normalized program + state + event + seed ⇒ same decision);
docs/work-orders/WO-008-composition-compiler.md AC6 (identical decision
traces after compilation); the shipped `appendEvent`/`decodeLog`/`encodeLog`
in `packages/kernel/src/store.ts`, `replay`/`replayOutbox` in `core.ts`, and
`runScenario`/`replayScenario`/`ScenarioOptions` (`crashAfterPersist`,
`recoveryLogTransform`) in `packages/skeleton/src/scenario.ts` — all
read-only oracles.

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
Retained valid-object anomaly families: CRLF, duplicated eventIds, out-of-order
eventIds, deep nesting, and duplicated whole lines — each classified
{decodes-with-behavior-X | throws}, and where decode succeeds,
`replay`/`replayOutbox` run-twice determinism still holds. (d) Machine-readable
results: one record per cut point/family
(log seed, offset, outcome class). SKELETON LANE — (e) Golden trace corpus:
run the canonical 13-step demo at the pinned base commit and commit its full
kernel DecisionTrace sequence, event log, and glyph-scene output as golden
fixtures, recording the EXACT regeneration command and scenario invocation
alongside the base commit so any consumer can re-derive it. This is offered
raw material and a drift tripwire between now and WO-008 — WO-008's AC6
contract is live re-execution and this corpus cannot bind it. (f)
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
families are redundant fixtures that rot. A family that trips runScenario's
internal asserts (e.g. "unexpected cadence pulse", "deletion unexpectedly
authorized") is classified as a numbered finding or excluded-with-reason in
the manifest — never silently dropped. Ground truth is explicitly labeled
non-normative structural data; honest downstream consumers are 09-audit's
deferred step-5 crash-ambiguity evidence gathering and the eventual store
swap implied by ADR-0002's JSONL-first stance, where this corpus becomes the
compatibility oracle — no claim is made that WO-009's rows 2/4/6 contract
requires it.

**Authority (bounded):**
- MAY create new files only under `corpus/fixtures/store/`,
  `corpus/fixtures/golden-traces/`, `corpus/fixtures/skeleton-trees/`
  (including `corpus/fixtures/skeleton-trees/README.md` — the lane's
  non-normative labeling lives at this explicit in-tree path),
  `corpus/harness/`, and `corpus/manifests/` (including
  `corpus/manifests/runs/`), plus `corpus/README.md` if absent.
- MUST NOT modify any existing repo file — especially `packages/skeleton/`
  in its entirety, including `fixtures/repo-tree.json` (WO-007/WO-008/WO-009
  own pieces of that package), and `packages/skeleton/test/` is FORBIDDEN for
  new files precisely because the root test glob would auto-promote them into
  the declared release-evidence chain. Exempt: the standing lifecycle
  machinery when running in the control-plane slot — `docs/control/resume.jsonl`
  appends via `scripts/resume.mjs`, the regenerated `docs/control/current.md`,
  checkpoint refs, and numbered `docs/verifications/WO-105/` artifacts.
  Ledger duty waived by this clause (precedence rule); note the skipped duty
  in the result.
- Behavioral surprises (a silent-divergence cut, a nondeterministic decode or
  replay) become numbered findings in `corpus/manifests/findings-WO-105.md`
  with log seed + offset — never a store or scenario fix, never new recovery
  machinery.
- Zero new dependencies; nothing added to root `test`. Full sweep results are
  committed as compact classified summaries; raw per-offset records beyond
  the stated budget are regenerable from seed.
- No external effects: no push/PR/tag/publish/install/config
  mutation/destructive git.

**Corpus-layout note:** `corpus/` does not exist yet; 03-architecture.md
§Corpus policy's sanitized/fixtures/manifests tree governs the sanitized
source/incident corpus, not generated test corpora. This order extends the
layout with generated evidence material; whichever adjacent order lands first
creates `corpus/README.md` distinguishing the two. Record as an open question
that a later doc pass must sync §Corpus policy (no `docs/` authority here).

**Isolation & control plane:** one writable agent, own worktree from the clean
main checkout. Default is in-slot activation via `npm run worktree -- start`
between mainline activations, with the standard resume phases and the pinned
close disposition; if run outside the slot, the operator names the closeout
path at activation (numbered verification, final review, PR, explicit
no-release disposition). Zero mid-flight operator decisions.

**Preflight (operator):** node_modules provisioned (network-disabled Codex
sandbox); `npm run build && npm test` green at base. Fully offline and
model-invocation-free thereafter.

**Deliverables:**
1. `corpus/harness/generate-store-corpus.mjs` (seeded log generator: valid
   envelopes over a small event alphabet with correlation/causation chains,
   command results, duplicates; `--write`/`--check`) and
   `corpus/harness/truncation-sweep.mjs` (the every-offset cutter/classifier
   with declared log sizes and seed).
2. `corpus/harness/skeleton-crash-sweep.mjs` — the every-offset
   truncation/mutation driver over the shipped ScenarioOptions hooks, seeded
   and classified — and `corpus/harness/generate-tree-corpus.mjs` (seeded,
   `--write`/`--check`) with
   `corpus/fixtures/skeleton-trees/<family>/{tree.json, ground-truth.json}`
   for the capped, signature-distinct families.
3. `corpus/fixtures/store/` — committed representative logs and retained
   valid-object anomaly fixtures with per-fixture expected classification;
   `corpus/fixtures/golden-traces/WO-105-demo-<commit>.json` — the canonical
   run's decision traces, event log, and glyph scene, keyed to the base
   commit with its exact regeneration command recorded inside the fixture.
4. `corpus/harness/wo105-*.test.mjs` — round-trip laws, the
   no-silent-divergence pin over the full store sweep, retained-family
   classification, decode-then-replay determinism, golden replay assertion,
   skeleton crash-sweep invariants (at-most-one effect per commandId,
   recomputed pending commands, live-vs-replay identity), and the
   tree↔ground-truth validator with determinism properties.
5. `corpus/manifests/WO-105.json` (seeds, log sizes, total cut points per
   lane, outcome-class distributions, family inventory with behavioral
   signatures and any excluded-with-reason families, fixture hashes, base
   commit, toolchain profile); append-only
   `corpus/manifests/WO-105-observations.jsonl` (classified sweep records);
   `corpus/manifests/runs/WO-105-<commit>.log`.
6. Generator/classifier/validator self-tests with planted known cut points of
   each class and planted known-invalid trees.

**Acceptance criteria (all required):**
1. The manifest states seeds, log sizes, and the total cut points actually
   executed per lane; the captured transcript corroborates the counts.
2. The no-silent-divergence pin holds over every store cut point and the
   at-most-one-effect-per-commandId and recomputed-pending invariants hold
   over every skeleton cut point, or violations are quarantined numbered
   findings.
3. Every retained valid-object anomaly family has an explicit pinned classification
   (decode-success cases additionally prove replay determinism), and every
   committed tree family passes its own ground-truth validator, demonstrates
   its recorded distinct behavioral signature, and regenerates byte-identical
   from seed; assert-tripping families are findings or excluded-with-reason,
   never silently dropped.
4. The golden corpus replays green against the shipped scenario at the base
   commit, and live-vs-replay identity holds across every fixture family.
5. `--check` regeneration is byte-identical from recorded seeds, and the
   non-normative labeling is present in
   `corpus/fixtures/skeleton-trees/README.md` and every ground-truth file
   header.

**Evidence gate (executable):** `npm run build && node
corpus/harness/generate-store-corpus.mjs --seed <recorded> --check && node
corpus/harness/truncation-sweep.mjs --seed <recorded> && node
corpus/harness/generate-tree-corpus.mjs --seed <recorded> --check && node
corpus/harness/skeleton-crash-sweep.mjs --seed <recorded> && node --test
corpus/harness/wo105-*.test.mjs`, transcript captured under
`corpus/manifests/runs/` with counts matching the manifest.

**Non-goals:** failure-matrix rows 2/4/6 (WO-009's contract);
the physical malformed-line cases fixed and bound by WO-017;
crash-ambiguity reconciliation machinery or any recovery repair logic
(deferred WO-009 audit steps — this order classifies and pins, it does not
reconcile); SQLite or any persistence change (ADR-0002: JSONL first); pinning
the non-normative loadout object or any Seiri evidence/claim-type/
proposal-packet schema (WO-008/WO-010 territory and preserved-open); binding
WO-008's AC6 (its contract is live re-execution; the golden corpus is offered
raw material); store, kernel, or skeleton edits; modifying
`repo-tree.json`; root test-script wiring; docs/product or ledger
write-backs.
