# WO-103 — Authorization guard and outbox factorial decision-table corpus (version assigned at activation)

**Model:** Codex (any capable tier); any capable model may substitute. State the
model and effort actually run in the result (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Evidence only: new files under
`corpus/`; no runtime, package or contract change. Assigned at activation
under the standing opt-out default; a close without a release needs the
operator's direction.
**Cost:** adds a seeded factorial generator with `--write` and `--check`
modes and an independent eight-rule precedence and semantic-revocation
oracle, sharded cells under `corpus/fixtures/authority/` and
`corpus/fixtures/outbox/`, replay, property and permutation harnesses
under `corpus/harness/`, a generated precedence table, a manifest and run
transcripts under `corpus/manifests/`, and a findings file if a finding
arises; nothing joins the root `npm test`. Removes nothing that runs; it
widens failure-matrix rows 1 and 3 into exhaustive form. Re-mints: none;
the order adds new files only and edits neither the kernel, a registered
source of every edition, nor the registered corpus modules. Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** filed on 2026-09-01 (`1c3ec8aa`) in the
adjacent work-order series for autonomous Codex downtime, parallel to the
mainline; its identifier is a stable, opaque reference, as the same day's
identity update settled when it retired the series' provisional
renumbering. On 2026-09-03 it was retargeted to the authority and outbox
contract WO-017 shipped, so it is not activated from an older base.
WO-017's final review carried one open item to this oracle (FINAL-001,
adjudication 8), which the 2026-09-19 cleanup pass recorded on this
order's planning map row. Opaque identifier, not a priority. Clean-room
screen: the corpus is original generated test data; no stop condition.
Amended by the 2026-09-28 planning pass, which re-observed the order on
`main` at `5f3849ec`: it is restated in the current form; the carry-in is
written in; the never-throws and outbox criteria quarantine what the
Objective already quarantines; its release, authority and gates follow
today's lifecycle
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-017 merged (the reviewed kernel truthfulness boundary
is the corpus baseline; closed, v0.3.5); WO-004 merged (satisfied
transitively by WO-017; closed, v0.2.1). Independent of the other
adjacent orders.
**Recommended placement:** outside the sequence; the planning map names
WO-107 the first candidate for adjacent evidence work and this order an
alternative. It adds files only under `corpus/fixtures/authority/`,
`corpus/fixtures/outbox/`, `corpus/harness/` and `corpus/manifests/`, so
it is disjoint from every queued order. Before it is sequenced a planning
pass decides whether the factorial is still wanted, whether it releases
as a patch or closes without a release at the operator's direction, and
which delivery order it pairs with as the evidence entry. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-017",
    "relation": "satisfied-by-close",
    "reason": "The reviewed kernel truthfulness boundary is the corpus baseline."
  },
  {
    "workOrderId": "WO-004",
    "relation": "satisfied-by-close",
    "reason": "The environment prerequisite is satisfied transitively by WO-017."
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Events and decisions
(the kernel loop) and §Identity and composition (AuthorityEnvelope, the
structural authorization guard, semantic revocation conditions, the
own-property resource rule, the Command outbox protocol, `CommandPersisted`,
`CommandResult` and `CommandRefused`); `docs/lineage/idea-ledger.md`
adopted entries "Refuse, never throw, at the authority boundary" and
"Namespace-tagged command identity"; 03-architecture.md §Session lifecycle
& resilience (the failure-injection matrix: rows 1 and 3 at v0.1.0; rows
2, 4 and 6 established by WO-009, closed at `v0.10.0`) and §Corpus policy;
the shipped `authorize`, `persistCommand`, `applyCommandResult` and
overloaded `replayOutbox` in `packages/kernel/src/core.ts`, the read-only
oracle, with the eight-rule refusal order, the exclusive expiry boundary,
the shared predicate registry, the trailing-`*` prefix `effectMatches`
and the `Object.hasOwn` resource rule; `packages/skeleton/src/audit.ts`
(`semanticAuthorityInputsAreComplete`) and
`docs/final-reviews/WO-017/FINAL-001.md` §Adjudications, item 8 (the
carry-in); `corpus/README.md`; 07-execution-guide.md §Model-specific notes
and §Discipline (the precedence rule; release assignment is opt-out); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

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

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-01 at `1c3ec8aa`):**

- `corpus/` exists since WO-101 (`383ee550`, 2026-09-01) with its entry
  point `corpus/README.md`, WO-101's ID and Program lanes and WO-108's
  mutation lane; product 03 §Corpus policy has recorded the generated
  corpora since its 2026-09-06 synchronization. Neither names an
  authority or outbox lane, and `npm test` runs a corpus test only by name
  (WO-101's ID test).
- The guard applies eight rules in the Objective's order; an envelope
  expires when `now >= expiresAt`; the shipped reason strings include
  `cannot evaluate revocation`, `required evidence missing` and
  `resource limit exceeded` (`authorize`, kernel component 0.6.0).
- `replayOutbox` persists any `CommandPersisted` payload whose `command`
  is an object with a non-empty string `commandId`, with no other
  structural check, so an incomplete command reaches `pendingCommands`.
  Its result traces are `accepted`, `dedup`, `unknown` and
  `preceded-persist`; `applyCommandResult` also returns
  `ignored-event-type` for an event that is not a result, a branch
  `replayOutbox` does not reach.
- Failure-matrix rows 2, 4 and 6 are no longer reserved: WO-009
  established worker recovery for them.
- WO-017's final review found that a `cannot evaluate revocation` refusal
  caused by a missing `state` or a missing `predicateEnv` emits a partial
  trace suffix, which the audit projection's
  `semanticAuthorityInputsAreComplete` does not accept, so the denied
  record stands without its trace link; it carried the case to this
  oracle, whose cells include missing-input environments (FINAL-001,
  adjudication 8).
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

- New files only, under `corpus/fixtures/authority/`,
  `corpus/fixtures/outbox/`, `corpus/harness/` and `corpus/manifests/`
  (with `corpus/manifests/runs/`). No existing file is edited apart from
  the records the lifecycle's own commands write; `corpus/README.md`
  exists, so the lane's commands are recorded in its manifest
  (operator-review assumption 2).
- Any cell where the shipped guard throws, mis-orders precedence or
  diverges from the independent oracle is a numbered finding in
  `corpus/manifests/findings-WO-103.md` with the reproducing cell, never
  an in-place fix, and never a change to refusal reasons or precedence
  even if a finding suggests one; findings go to the operator.
- The missing-input cells include a `cannot evaluate revocation` refusal
  from a missing `state` and from a missing `predicateEnv`; each pins the
  partial trace suffix the guard emits, and the audit projection's
  unlinked record for that refusal is a numbered finding with its
  reproducing cell (WO-017 FINAL-001, adjudication 8; planning map
  catalog row).
- Zero new dependencies; nothing is added to the root `test` script or any
  declared release-evidence command. The work is offline and invokes no
  model after `npm run build`; the choice of closeout is made at
  activation, and no operator decision is needed mid-flight.
- The executor's work has no external effect: no push, pull request, tag,
  publish, install, configuration change or destructive Git operation.
- **Declined alternatives, recorded:** fixing the under-linked audit
  record here (the order pins and records; a fix belongs to an order that
  owns the audit projection; reopen when one does).

**Deliverables:**

- `corpus/harness/generate-authority-corpus.mjs`: a seeded factorial
  generator with `--write` and `--check` (regenerate-and-diff) modes,
  including the independent eight-rule precedence and
  semantic-revocation oracle.
- `corpus/fixtures/authority/` and `corpus/fixtures/outbox/`: sharded
  JSONL cells (inputs, the expected AuthorizationResult or OutboxState and
  the expected branchPath, per the Objective's expected-output schema),
  within a stated committed budget; the full factorial regenerable from
  the seed.
- `corpus/harness/wo103-*.test.mjs`: cell replay, the never-throws
  property over the declared factorial, condition × event evaluation,
  threading, legacy and trace-bearing replay projections, and permutation
  sweeps.
- A generated precedence-matrix reference table at
  `corpus/manifests/WO-103-precedence.md`, produced by the harness and
  never hand-edited; regeneration is part of the gate.
- `corpus/manifests/WO-103.json` (seed, factor levels, permutation caps,
  cell counts, fixture hashes, base commit, toolchain profile) and
  `corpus/manifests/runs/WO-103-<commit>.log`.
- Generator and oracle self-tests with planted known cells.

**Acceptance criteria (all required)**

1. The manifest states every factor, level, and the permutation cap; cell
   counts equal the declared cross-product exactly.
2. Shipped output matches the independent eight-rule precedence oracle for
   every cell — exact shipped reason strings and full traces, and for
   authorized cells the minted commandId and decremented resourceLimits —
   or the divergence is a quarantined numbered finding.
3. The never-throws property holds over every cell of the declared
   factorial (refusals are structural, with trace); every condition sees
   every event, missing or broken semantic inputs fail closed, and a prior
   match never masks a later error; a throwing cell or a masked error is a
   quarantined numbered finding with its reproducing cell, never a fix.
   The criterion is judged against the declared set; a case outside it is
   a follow-up, not a failure.
4. Outbox sweeps over all enumerated orders within the declared cap prove
   duplicate-delivery idempotence, result-before-persist completion and
   exact trace classification; a structurally incomplete command that
   reaches `pendingCommands` is recorded as a quarantined numbered
   finding, as the Objective directs.
5. The cells with a missing `state` and with a missing `predicateEnv` each
   refuse with `cannot evaluate revocation` and pin the partial trace
   suffix the guard emits; the findings file records, with that cell, that
   the audit projection leaves the refusal without its trace link (WO-017
   FINAL-001, adjudication 8).
6. `--check` regeneration is byte-identical from the recorded seed; the
   precedence table is regenerated, not edited.
7. The decisions file records the seed, the factor levels, the cap and
   each finding's number, and no existing file is edited beyond the
   lifecycle's own records.
8. After `npm run build`, the generator's `--check` from the recorded
   seed and `node --test corpus/harness/wo103-*.test.mjs` pass with counts
   matching the manifest; `npm test` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the transcript under `corpus/manifests/runs/` of
`npm run build`,
`node corpus/harness/generate-authority-corpus.mjs --seed <recorded> --check`
and `node --test corpus/harness/wo103-*.test.mjs`, with counts matching
the manifest; `npm test` and `npm run test:docs` before
`implementation-ready` and at final review. No live row.

**Write-back duty:** as listed in criterion 7.

**Non-goals:** failure-matrix rows 2, 4 and 6 (established by WO-009; not
rebuilt here); any transport, host or worktree-lifecycle machinery;
AuditRecord or projections, the audit projection's trace linkage among
them (the under-linked refusal is recorded, not fixed); kernel edits;
changing refusal reasons or precedence even if a finding suggests it;
root test-script wiring; product-document write-backs; naming the lane in
`corpus/README.md` or product 03 §Corpus policy.

**Operator-review assumptions**

1. The order releases as a patch under the opt-out default.
2. The lane's commands live in its manifest; `corpus/README.md` and
   product 03 §Corpus policy name the lane in a later order's
   documentation change; this order modifies no existing file.
3. The under-linked refusal is recorded as a finding with its cell and
   never fixed here; a fix belongs to an order that owns the audit
   projection.
