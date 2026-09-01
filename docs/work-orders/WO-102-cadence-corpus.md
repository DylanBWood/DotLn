# WO-102 — Cadence virtual-time grid sweep and golden vector corpus (version assigned at activation)

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
v0.2.1 close. Independent of WO-101 (disjoint fixture and harness filenames)
and of the mainline; the two kernel-corpus orders can grind in either order.

**Cites (read these sections):** packages/kernel/README.md (evaluation limited
to Cadence `Once, After, Every, Until, Gate, Backoff`); 02-domain-model.md
(Cadence temporal algebra, virtual-time evaluation, conditions-as-data);
03-architecture.md §Corpus policy (layout being extended — see Corpus-layout
note); docs/work-orders/WO-002-pure-kernel.md (settled deferrals); the
shipped `evaluateCadence` in `packages/kernel/src/core.ts` — the read-only
oracle: Every alignment arithmetic, the LCG `draw`
(`imul(state,1664525)+1013904223 >>> 0`), and the Backoff clamp/jitter
formula; 07-execution-guide.md §Model-specific notes and the precedence rule.

**Objective:** An exhaustive golden-vector corpus for the six evaluated
cadence constructors. Honesty clause up front: the independent in-harness
reimplementation of the LCG and Backoff formula pins the SHIPPED formula at
the base commit — a drift and porting alarm — not conformance to any external
specification; the formula's only documentation is `core.ts` itself, so a
disagreement means implementation drift or a harness bug, never spec
violation. Sweeps: (a) boundary matrices for `Once`/`After`/`Every` — now
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
poisoned `Date.now`/`Math.random`. (e) The eight deferred kinds (`Burst,
Calendar, Window, While, Sequence, Merge, Race, Repeat`) pinned as throws in
ONE marked file (`corpus/harness/wo102-deferral-pins.test.mjs`) so a later
implementing rung retires it cheaply.

**Authority (bounded):**
- MAY create new files only under `corpus/fixtures/cadence/`,
  `corpus/harness/`, and `corpus/manifests/` (including
  `corpus/manifests/runs/`), plus `corpus/README.md` if absent.
- MUST NOT modify any existing repo file (packages, scripts, package.json,
  root tsconfig, all of docs/). Exempt: the standing lifecycle machinery when
  running in the control-plane slot — `docs/control/resume.jsonl` appends via
  `scripts/resume.mjs`, the regenerated `docs/control/current.md`, checkpoint
  refs, and numbered `docs/verifications/WO-102/` artifacts. Ledger duty
  waived by this clause (precedence rule); note the skipped duty in the
  result.
- Divergence between shipped behavior and the reimplementation, or any
  boundary surprise, is a numbered finding in
  `corpus/manifests/findings-WO-102.md` with a reproducing vector — never a
  fix, never a doc edit.
- Zero new dependencies; nothing added to the root `test` script or any
  release-evidence command.
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
sandbox); `npm run build && npm test` green at the base commit. Fully offline
and model-invocation-free thereafter.

**Deliverables:**
1. `corpus/harness/generate-cadence-corpus.mjs` — seeded deterministic
   generator with `--write`/`--check` modes, embedding the versioned
   predicate registry.
2. `corpus/fixtures/cadence/` — sharded JSONL golden vectors (cadence AST +
   env {now, rngState} + optional event + expected `{dueAt, rngState, trace}`
   or expected-throw), within a stated committed-size budget; larger grids
   regenerable-from-seed with manifest-only commitment.
3. `corpus/harness/wo102-*.test.mjs` — vector replay harness, property
   sweeps, the independent Backoff/LCG reference implementation, and the
   marked deferral-pin file.
4. `corpus/manifests/WO-102.json` (seed, grid bounds, counts per constructor
   and per boundary class — absent-startAt and at-startAt classes included —
   the frozen predicate registry, fixture hashes, base commit, toolchain
   profile) and `corpus/manifests/runs/WO-102-<commit>.log`.
5. Generator self-tests (planted known vectors, including at least one
   hand-computed Backoff vector verified against both implementations).

**Acceptance criteria (all required):**
1. Every evaluated constructor has stated grid bounds and per-class counts in
   the manifest, covering every boundary class named in the Objective — the
   absent-startAt and at-startAt fixed-point cells explicitly among them.
2. All committed vectors pass against the shipped kernel;
   shipped-vs-reference Backoff/LCG cross-check agrees over the full grid, or
   disagreements are quarantined as numbered findings (worded as drift
   alarms, per the honesty clause).
3. Clamp, threading, and purity properties hold over the full sweep, not just
   committed shards.
4. `--check` regeneration is byte-identical from the recorded seed.
5. Deferral pins prove all eight deferred kinds still throw; no deferred
   semantics are implemented anywhere.

**Evidence gate (executable):** `npm run build && node
corpus/harness/generate-cadence-corpus.mjs --seed <recorded> --check && node
--test corpus/harness/wo102-*.test.mjs`, transcript captured under
`corpus/manifests/runs/` with counts matching the manifest.

**Non-goals:** implementing `Burst/Calendar/Window/While/Sequence/Merge/
Race/Repeat` semantics (settled arrive-on-contact deferral — do not
relitigate); scheduler IR or activation-event capture (explicitly deferred
until real planning uses expose a need); claiming external-spec conformance
for the LCG/Backoff math (the shipped code is the only spec); kernel edits of
any kind; performance claims (WO-107's lane); root test-script wiring;
docs/product or ledger write-backs.
