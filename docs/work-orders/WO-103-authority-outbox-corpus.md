# WO-103 — Authorization guard and outbox factorial decision-table corpus (version assigned at activation)

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
**Historical series note (superseded):** reserved adjacent WO-10x series,
parallel to the mainline;
numbering provisional — the operator may renumber at activation.
**Identity update — 2026-09-01:** the provisional renumbering option above is
superseded for identifier identity. Retain `WO-103` as this order's stable,
opaque reference; represent purpose and grouping in the provisional work-order
map and future explicit metadata. This update changes no other scope.
**Compatibility amendment — 2026-09-03:** WO-017 changes the shipped authority
and outbox oracles this corpus is meant to exhaust. The objective, outputs, and
acceptance criteria below are retargeted to that post-WO-017 contract; this
order must not be activated from an older base.
**Depends on:** WO-017 merged — branch from `origin/main` at or after its
reviewed close. WO-004 is satisfied transitively. Independent of the other
adjacent orders.

**Cites (read these sections):** 02-domain-model.md (AuthorityEnvelope, the
structural authorization guard, semantic revocation conditions, the
own-property resource rule, the Command outbox protocol,
CommandPersisted/CommandResult/CommandRefused);
docs/lineage/idea-ledger.md adopted entries "Refuse, never throw, at the
authority boundary" and "Namespace-tagged command identity";
03-architecture.md failure-injection matrix (rows 1 and 3 shipped; rows 2/4/6
reserved for WO-009) and §Corpus policy (layout being extended — see
Corpus-layout note); the shipped `authorize`, `persistCommand`,
`applyCommandResult`, and overloaded `replayOutbox` in
`packages/kernel/src/core.ts` — the read-only oracle, including the eight-rule
refusal order, exclusive expiry boundary, shared predicate registry,
trailing-`*` prefix `effectMatches`, and `Object.hasOwn` resource rule;
07-execution-guide.md §Model-specific notes and the precedence rule.

**Objective:** (a) Full factorial sweep of `authorize()`: every combination of
{effect string vs non-string} × {now before/at/after expiresAt — `now >=
expiresAt` is expired, so both adjacent cells are binding} × {revocation event
types 0/1/many, matching/non-matching revokedBy} × {semantic revocation
conditions 0/1/many; events 0/1/many; match early/late/never; complete,
missing, unknown, and throwing predicate environments} × {denied/allowed
pattern shapes: exact, bare `*`, prefix `a*`, overlapping deny-vs-allow} ×
{required evidence subset/superset/empty} × {resource undefined / present /
limit 1/0/negative / prototype-key names `__proto__`, `constructor`,
`toString` exercising the Object.hasOwn rule}. Semantic cases reconstruct
named test predicates in the harness and bind the full condition × event
Cartesian evaluation, state, canonical authorization clock, rng state, params,
and optional policy without serializing executable functions into fixtures.
The oracle for reason strings is the SHIPPED code: pin the exact shipped
strings (e.g. "cannot evaluate revocation", "resource limit exceeded",
"required evidence missing"), never paraphrases. An independent in-harness
precedence oracle computes each cell's expected winner from the documented
eight-step order and is compared cell-by-cell to shipped output.
Expected-output schema per cell: REFUSED cells pin the reason and complete
trace; AUTHORIZED cells pin the minted commandId, returned envelope's
decremented resource limits, and complete grant trace, including canonical
time, condition inputs when consumed, and resource when consumed. The
never-throws property holds over every cell, including forged runtime inputs.
(b) Consumed-envelope threading sweeps: repeated authorization through
returned envelopes until resource exhaustion, pinning the decrement law.
(c) Outbox permutation sweeps under DECLARED CAP DISCIPLINE: the event
alphabet size and enumerated-order count bound are stated in the manifest
before generation (full permutations for alphabets of at most 6 events —
≤ 720 orders per alphabet — plus seeded samples above that size); the executor
MUST cover the stated cross-product exactly, with no discretionary ballooning
and no silent under-coverage. Push CommandPersisted/CommandResult/unknown/
malformed events through both `replayOutbox` projections in the enumerated
orders, asserting idempotence under duplicate delivery, persist-once semantics,
and exact result traces (`accepted`/`dedup`/`unknown` plus
`preceded-persist` when a remembered result completes a later persist).
Include duplicate orphan results and structurally incomplete Command objects;
if an incomplete object reaches `pendingCommands`, quarantine it as a numbered
finding rather than blessing the cast as a valid Command. This widens shipped
failure-matrix rows 1 and 3 into exhaustive form.

**Authority (bounded):**
- MAY create new files only under `corpus/fixtures/authority/`,
  `corpus/fixtures/outbox/`, `corpus/harness/`, and `corpus/manifests/`
  (including `corpus/manifests/runs/`), plus `corpus/README.md` if absent.
- MUST NOT modify any existing repo file. Exempt: the standing lifecycle
  machinery when running in the control-plane slot — `scripts/resume.mjs`
  appends to `docs/control/resume.jsonl`, the regenerated
  `docs/control/current.md`, checkpoint refs under
  `refs/dotln/checkpoint/...`, and numbered
  `docs/verifications/WO-103/VER-NNN.md` (and final-review) artifacts. Ledger
  duty waived by this clause (precedence rule); note the skipped duty in the
  result.
- Any cell where the shipped guard throws, mis-orders precedence, or diverges
  from the independent oracle is a numbered finding in
  `corpus/manifests/findings-WO-103.md` with the reproducing cell — never an
  in-place fix, and never a change to refusal reasons or precedence even if a
  finding suggests one (findings go to the operator).
- Zero new dependencies; nothing added to the root `test` script or any
  declared release-evidence command.
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
between mainline activations, with the standard resume phases. If run outside
the slot as explicitly sequenced adjacent work, the operator names the
closeout path at activation (numbered verification, final review, PR,
explicit no-release disposition). The choice happens at activation, never
mid-flight; zero mid-flight operator decisions.

**Preflight (operator):** WO-017 is merged and its authority/outbox contract is
the pinned base; node_modules provisioned (network-disabled Codex sandbox);
`npm run build && npm test` green at the base commit. Fully offline and
model-invocation-free thereafter.

**Deliverables:**
1. `corpus/harness/generate-authority-corpus.mjs` — seeded factorial generator
   with `--write`/`--check` (regenerate-and-diff) modes; includes the independent
   eight-rule precedence and semantic-revocation oracle.
2. `corpus/fixtures/authority/` and `corpus/fixtures/outbox/` — sharded JSONL
   cells (inputs + expected AuthorizationResult or OutboxState + expected
   branchPath, per the Objective's expected-output schema), within a stated
   committed budget; the full factorial regenerable from seed.
3. `corpus/harness/wo103-*.test.mjs` — cell replay, the never-throws property
   over the full factorial, condition × event evaluation, threading, legacy and
   trace-bearing replay projections, and permutation sweeps.
4. A GENERATED precedence-matrix reference table at
   `corpus/manifests/WO-103-precedence.md` (generated by the harness, never
   hand-edited — regeneration is part of the gate).
5. `corpus/manifests/WO-103.json` (seed, factor levels, permutation caps, cell
   counts, fixture hashes, base commit, toolchain profile) and
   `corpus/manifests/runs/WO-103-<commit>.log`.
6. Generator/oracle self-tests with planted known cells.

**Acceptance criteria (all required):**
1. The manifest states every factor, level, and the permutation cap; cell
   counts equal the declared cross-product exactly.
2. Shipped output matches the independent eight-rule precedence oracle for
   every cell — exact shipped reason strings and full traces, and for authorized
   cells the minted commandId and decremented resourceLimits — or the divergence
   is a quarantined numbered finding.
3. The never-throws property holds over the full factorial (refusals are
   structural, with trace); every condition sees every event, missing or broken
   semantic inputs fail closed, and a prior match never masks a later error.
4. Outbox sweeps prove duplicate-delivery idempotence, result-before-persist
   completion, structurally valid pending commands, and exact trace
   classification over all enumerated orders within the declared cap.
5. `--check` regeneration is byte-identical from the recorded seed; the
   precedence table is regenerated, not edited.

**Evidence gate (executable):** `npm run build && node
corpus/harness/generate-authority-corpus.mjs --seed <recorded> --check &&
node --test corpus/harness/wo103-*.test.mjs`, transcript captured under
`corpus/manifests/runs/` with counts matching the manifest.

**Non-goals:** failure-matrix rows 2/4/6 (WO-009's contract — do not
pre-build); any transport, host, or worktree-lifecycle machinery (WO-009);
AuditRecord or projections (WO-007); kernel edits; changing refusal reasons
or precedence even if a finding suggests it; root test-script wiring;
docs/product or ledger write-backs.
