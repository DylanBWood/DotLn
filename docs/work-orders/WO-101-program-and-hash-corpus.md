# WO-101 — Program stepper enumeration, continuation round-trip, and hash-identity corpus, v0.2.0

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Release classification:** `v0.2.0` internal tooling/evidence-only close.
This version is strictly below the latest published tag, `v0.2.1`, so release
close MUST record the honest no-release result and MUST NOT create or push a
tag. The reserved v0.2.2 (WO-005) and v0.2.3 (WO-006) rungs are unchanged.

**Activation correction — 2026-09-01:** WO-101 was activated before its
version and close disposition were pinned and before dependency preflight was
completed. The operator explicitly authorized this in-place authority
correction after dispatch. This note records the timing deviation rather than
presenting the prerequisite as having occurred before activation; the
append-only `WorkOrderActivated` event
remains unchanged. The operator also authorized executor-side dependency
provisioning for this episode.
**Historical series note (superseded):** reserved adjacent WO-10x series;
numbering provisional — the
operator may renumber at activation. This order absorbs the durable kernel of
the withdrawn WO-104 hash-identity candidate (see Objective lane c).
**Identity update — 2026-09-01:** the provisional renumbering option above is
superseded for identifier identity. Retain `WO-101` as this order's stable,
opaque reference; represent its evidence/corpus purpose and grouping in the
provisional work-order map and future explicit metadata. This update changes no
other scope or completion evidence.
**Depends on:** WO-004 merged — branch from `origin/main` at or after the
v0.2.1 close. No dependency on WO-005..WO-011 in either direction.

**Cites (read these sections):** packages/kernel/README.md (the pinned
evaluation subset: Program `Done, Emit, Invoke, Await, Sequence, Guard`);
02-domain-model.md (Program grammar, Continuation, DecisionTrace; the
deterministic outbox identity — `commandId = cmd_ + 16-hex FNV-1a-64` over
UTF-8 of `ep:<episodeId>:<d>:<i>` / `ws:<workstreamId>:<d>:<i>` with the
empty-episodeId fallback); docs/lineage/idea-ledger.md adopted entry
"Namespace-tagged command identity" (the shipped episodeId/workstreamId
collision that silently swallowed a command — provenance for lane c);
docs/work-orders/WO-002-pure-kernel.md (settled deferrals); 03-architecture.md
§Corpus policy (layout being extended — see Corpus-layout note); the shipped
`stepProgram`/`decideProgram`/`serializeContinuation`/`stableHash`/`commandId`
in `packages/kernel/src/` (read-only oracle); 07-execution-guide.md
§Model-specific notes and the precedence rule.

**Objective:** Turn the kernel's headline determinism claim from example-based
tests into an exhaustive regression floor. (a) Program lane: enumerate ALL
Program ASTs up to a bounded depth/size over the six implemented constructors
and a small atom alphabet (event types, PredicateRefs, commandIds, payload
shapes including null/array/non-object/missing-result cells for the
Invoke/Await matching table), and pin per input: `stepProgram`/`decideProgram`
determinism (repeat-call deep-equality); purity under poisoned
`Date.now`/`Math.random` (the existing ac1/ac2 poison pattern);
`deserializeContinuation(serializeContinuation(p))` deep-equals `p` at every
residual; the full factorial Invoke/Await matching truth table (event type ×
correlationId × commandId × payload shape), pinning exact
residual/emitted/intents/waits per cell; Sequence normalization laws (Done
absorption, empty list, nested residuals); and the five deferred kinds
(`Choose, All, Race, Repeat, Compensate`) throwing exactly the deferral error,
pinned in ONE clearly marked file (`corpus/harness/wo101-deferral-pins.test.mjs`)
so a later rung retires it cheaply. The predicate registry used for Guard
cells is itself versioned corpus data, frozen alongside the vectors and
recorded in the manifest — Guard expectations are meaningless without it.
(b) The enumeration bound, atom alphabet, and per-kind/per-cell counts are
stated in the manifest. (c) Hash-identity lane (absorbed from WO-104, with
the collision sweep deliberately dropped as statistically empty): golden
vectors — thousands of generated inputs covering Unicode surrogates and
combining characters, multi-byte sequences, embedded colons, empty and very
long ids, control bytes, numeric-string edges — each with its exact
`stableHash` hex and, for id tuples, exact `commandId`, verified against an
INDEPENDENT in-harness FNV-1a-64 reimplementation (32-bit-pair arithmetic, no
BigInt — a genuinely different code path from the shipped BigInt version,
anchored on published FNV-1a-64 test values); NFC-vs-NFD inputs pinned as
hashing differently, explicitly, so nobody "fixes" byte-honest behavior
silently; and targeted regression probes proving `episodeId == workstreamId`
inputs produce distinct commandIds ONLY because of the `ep:`/`ws:` namespace
tag — the ledger incident re-derived as a permanent executable regression.
Cross-implementation byte agreement over the full generated set is the drift
alarm; no bulk collision search is performed or claimed.

**Authority (bounded):**
- MAY create new files only under `corpus/fixtures/program/`,
  `corpus/fixtures/ids/`, `corpus/harness/`, and `corpus/manifests/`
  (including `corpus/manifests/runs/`), plus `corpus/README.md` if absent.
- MUST NOT modify any existing repo file (`packages/*` src and test,
  `scripts/`, `package.json`, root `tsconfig.json`, all of `docs/`). Exempt:
  the standing lifecycle machinery when running in the control-plane slot —
  `docs/control/resume.jsonl` appends via `scripts/resume.mjs`, the
  regenerated `docs/control/current.md`, checkpoint refs under
  `refs/dotln/checkpoint/...`, and numbered `docs/verifications/WO-101/`
  artifacts. Ledger duty waived by this clause (precedence rule); note the
  skipped duty in the result.
- Any kernel/spec divergence or cross-implementation disagreement is a
  numbered finding in `corpus/manifests/findings-WO-101.md` with a
  reproducing vector — never an in-place fix, never a doc edit.
- Zero new dependencies (node builtins + the pinned toolchain). Nothing is
  added to the root `test` script: the sweep stays outside the declared
  release-evidence chain until an operator deliberately promotes it.
- No external effects: no push/PR/tag/publish/install/config
  mutation/destructive git. Checkpoints only via the existing lifecycle
  machinery.

**Corpus-layout note:** `corpus/` does not exist yet; 03-architecture.md
§Corpus policy's sanitized/fixtures/manifests tree governs the sanitized
source/incident corpus, not generated test corpora. This order extends the
layout with generated evidence material; whichever adjacent order lands first
creates `corpus/README.md` distinguishing the two. Record as an open question
that a later doc pass must sync §Corpus policy (no `docs/` authority here).

**Isolation & control plane:** one writable agent, own worktree from the clean
main checkout. Default is in-slot activation via `npm run worktree -- start`
between mainline activations, with the standard resume phases and the pinned
close disposition. If run outside the slot as explicitly sequenced adjacent
work, the operator names the closeout path at activation (numbered
verification, final review, PR, explicit no-release disposition). The choice
happens at activation, not mid-flight.

**Preflight (operator/executor):** This execution environment has network
access, and the executor MAY provision missing dependencies with `npm ci`;
the earlier network-disabled assumption was incorrect. `npm ci` and
`npm run build && npm test` must be green at the base commit before corpus
execution. Once provisioned, the corpus run is fully offline and
model-invocation-free.

**Deliverables:**
1. `corpus/harness/generate-program-corpus.mjs` and
   `corpus/harness/generate-id-corpus.mjs` — seeded deterministic generators
   (same seed ⇒ byte-identical output) with `--write` and `--check`
   (regenerate-and-diff) modes; the id generator contains the independent
   no-BigInt FNV-1a-64 reference implementation; the program generator embeds
   the versioned predicate registry.
2. `corpus/fixtures/program/` — sharded JSONL vectors (input AST + optional
   event + expected ProgramStep or expected-throw) and
   `corpus/fixtures/ids/{stable-hash-vectors,command-id-vectors}.jsonl`, each
   within a stated committed budget; anything larger is regenerable-from-seed
   with only its manifest committed.
3. `corpus/harness/wo101-*.test.mjs` — node:test harnesses replaying every
   committed vector against the built kernel
   (`packages/kernel/dist/src/index.js`), the property sweeps over the full
   enumeration, the cross-implementation hash agreement, the namespace-tag
   regression probes, and the marked deferral-pin file.
4. `corpus/manifests/WO-101.json` — seeds, depth/size bounds, atom alphabet,
   the frozen predicate registry (or its hash and path), per-kind and per-cell
   counts, fixture hashes, pinned base commit, toolchain profile.
5. `corpus/manifests/runs/WO-101-<commit>.log` — captured full-run transcript.
6. Proportionate generator self-tests (planted known vectors, including
   published FNV-1a-64 values and at least one hand-computed commandId) — a
   small script is not an evidence-free note.

**Acceptance criteria (all required):**
1. The enumeration bound, alphabet, and frozen predicate registry are stated
   in the manifest, and per-kind counts prove every implemented constructor
   and every Invoke/Await truth-table cell is covered.
2. Every committed vector passes against the shipped kernel, or is a
   quarantined expected-fail vector cross-referenced to a numbered finding.
3. Round-trip and determinism properties hold over the full enumeration (not
   only committed shards); shipped and reference hash implementations agree on
   every generated input, and the NFC/NFD and namespace-tag probes pass.
4. `--check` proves corpus regeneration is byte-identical from the recorded
   seeds.
5. The deferral-pin file proves all five deferred kinds still throw, and
   nothing anywhere implements their semantics.

**Evidence gate (executable):** `npm run build && node
corpus/harness/generate-program-corpus.mjs --seed <recorded> --check && node
corpus/harness/generate-id-corpus.mjs --seed <recorded> --check && node --test
corpus/harness/wo101-*.test.mjs`, with the transcript captured to
`corpus/manifests/runs/` and counts matching the manifest.

**Non-goals:** implementing or speculating semantics for
`Choose/All/Race/Repeat/Compensate` (settled arrive-on-contact deferral — do
not relitigate); bulk collision searching (statistically empty for a 64-bit
hash; the cross-implementation agreement check is the real alarm); defining
or pinning `semanticHash`/`normalize` (WO-008's write-back — preserved until
then); changing the hash function or id scheme even if a finding recommends
it; kernel edits (found defects become findings); Cadence sweeps (WO-102's
lane); root test-script wiring; docs/product or ledger write-backs.
