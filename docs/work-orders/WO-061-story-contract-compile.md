# WO-061 — StoryContract compile: a pure function derives classified, provenance-bearing statements and acceptance criteria from a SourceBundle, labels model-inferred statements as such, and a source revision invalidates exactly the derived items it touched (v0.63.0)

**Model:** any capable model for the pure compiler; the inference slot's
model episode is a labeled fixture double here. State the model and effort
actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new public contract (`StoryContract`
v1) and a pure compile in the compiler package; no dependency. Assigned at
activation under the standing opt-out default.
**Cost:** adds one story-contract module in `packages/compiler/src/` (the
contract types, `compileStoryContract`, `revise`, and the rule patterns as
exported data), its export from the package index, its registration or
recorded exclusion in `scripts/lib/evidence-sources.mjs`, fixture bundles
with inference doubles, and at most 200 bytes in product 12 and 150 in
product 06. Removes: nothing derives a contract from a bundle, and the one
story contract the runtime reads is a hand-written file the mission check
loads. WO-124 and WO-123 depend on it. Re-mints: deterministic, each
edition that `packages/compiler/src/index.ts`,
`packages/compiler/package.json` or `scripts/lib/evidence-sources.mjs`
stales; the compiler release moves the policy hash the console binds, so
the feedback edition is carried (`feedback-evidence --carry`), the console
is re-pinned and the console self-host fixtures that hold the compiler
label follow it (WO-154 D011; WO-162 D012); no source the feedback
verifier judges is edited, so no live episode. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the compile slice), cut as a bounded order at the operator's same-day
correction; the operator's parity item "full intake and understanding of
requirements". Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition. Amended by the 2026-09-28 planning pass, which
re-observed the order on `main` at `5f3849ec`: criteria are drafts that
WO-124 completes and the `visual` type waits on WO-058, the classifier
states what it does with a statement no rule decides, and the
registration, the re-mints, the bounded write-backs and both gates are
named ([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-060 merged (the bundle it compiles from); WO-058 merged
(the `visual` claim type a criterion drawn from a visual annotation
carries); WO-054 (reference only: its criteria are what the verification
host consumes; closed at `v0.30.0`).
**Recommended placement:** third of the serial run, after WO-058 and
WO-059 and before WO-124, which depends on it. This order edits
`packages/compiler/src/` (a new story-contract module and the package's
export), its tests, `scripts/lib/evidence-sources.mjs`, the console's
pins, product 12 §What exists and what must be proved and the pipeline
sentence of product 06; WO-066 amends that sentence before it and WO-124
after it, and WO-060 and WO-058 re-mint the editions and re-pin the
console before it. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-060",
    "relation": "hard",
    "reason": "the bundle it compiles from"
  },
  {
    "workOrderId": "WO-058",
    "relation": "hard",
    "reason": "the visual claim type a criterion drawn from a visual annotation carries"
  },
  {
    "workOrderId": "WO-054",
    "relation": "reference-only",
    "reason": "its criteria are what the verification host consumes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §One outcome
from request to return, §Replacing a successful but costly workflow (the
replacement table's intake behavior) and §What exists and what must be
proved; 06-roadmap.md §Application version pending — Source-to-deliverable
vertical (the source revision guard); 02-domain-model.md §Independent
verification v1 (`AcceptanceCriterion`);
`packages/compiler/src/verification.ts` (`copyCriterion`,
`verificationLine`); `packages/skeleton/src/mission-check-protocol.ts`
(`MissionStoryContract`; read, not edited);
`docs/work-orders/WO-060-source-bundle-contract.md` (the bundle, its spans
and revisions); `docs/work-orders/WO-058-visual-and-network-claim-types.md`
(the `visual` claim type); `docs/lineage/idea-ledger.md` (the Statement
classification taxonomy); `scripts/lib/evidence-sources.mjs` (the
inventories and the import closure check);
`docs/evidence/WO-154/decisions.md` D011 and
`docs/evidence/WO-162/decisions.md` D012 (what a compiler release owes);
the [2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `compileStoryContract(bundle, inferences?)` returns
`{ contractId, bundleHash, statements[], criteria[], openDecisions[] }`
where every statement carries a class from the fixed set (requirement,
non-requirement, struck, example, question, answer, visual annotation,
current-behavior observation, inference, assumption, contradiction, open
decision), a provenance span into the bundle, and an origin of `rule` (a
deterministic rule decided it) or `inferred` (a supplied model inference
decided it, never promoted to `rule`); criteria are derived only from
requirement statements; and `revise(contract, newBundle)` invalidates the statements whose spans
changed, everything derived from them, and every statement an explicit
`supersedes` relation names, so a new decision elsewhere in the artifact
can retire an unedited earlier requirement.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Nothing derives a contract from an artifact: `packages/compiler/src/`
  holds eighteen modules at `5f3849ec` and none defines a source bundle or
  a story contract; the bundle arrives with WO-060.
- The one story contract the runtime reads is still typed by hand: since
  2026-09-20 the mission check (WO-099) reads an optional
  repository-relative story-contract file into
  `MissionStoryContract { storyId, clauses }`. This order's `StoryContract`
  is a different, compiled type.
- A `verification-v1` criterion needs a claim type of `state` or
  `behavior`, an evidence source, at least one repository-path surface, at
  least one required check and a description of one line of at most 2,000
  characters (`copyCriterion` at `5f3849ec`). A statement's text and span
  supply no surface and no check, and `visual` arrives with WO-058.
- The twelve classes the objective fixes are the idea ledger's statement
  classification taxonomy, which names eleven, with `open decision` added;
  no tracked document lists twelve.

**Design (scope discipline):**

- Deterministic rules for what text can decide: struck-through spans are
  `struck`; sections whose heading matches a declared out-of-scope pattern
  are `non-requirement`; interrogative discussion entries are `question`;
  the next entry by another role is recorded only as the structural fact
  `follows`, and an `answer` relation is `inferred` with evidence or left
  `open`, never decided by position; image references are
  `visual annotation`; everything else is a candidate for the inference
  slot.
- The bundle carries text, so the rules read declared markup in it (a
  strike's delimiters, the out-of-scope patterns, the interrogative form);
  the patterns are data the module exports, as WO-060's screen shapes are.
- The inference slot takes a list of `{ span, class, rationale }` supplied by
  a caller (a model episode in WO-112, a fixture double here); each is
  recorded as `inferred` with its rationale; a supplied inference may not
  change a structural fact (a strike, a heading, an order of entries) but
  may attach a semantic relation to it (an answer, a supersession) with
  evidence; ambiguity is recorded as `open`, never resolved by default. A
  relation entry is `{ span, relation, target, evidence, rationale }`, with
  `relation` either `answers` or `supersedes`.
- A statement no rule decides and no supplied entry classifies is recorded
  with the class `open decision` and listed in `openDecisions[]`; the
  compile never gives it a class by default.
- The unit of revision is the section or discussion entry: a change to any
  byte of one invalidates every statement derived from it and what derives
  from those, and nothing in an unchanged section or entry.
- Criteria: one criterion draft per requirement statement with the
  statement as its text and the span as provenance, typed `behavior` by
  default and `visual` when the statement references a visual annotation.
  A draft carries the `AcceptanceCriterion` fields this order can derive
  (`criterionId`, `description`, `claimType`, `evidenceSource: "live"`, the
  source the `worktree-snapshot` profile requires); `codeSurfaces` and
  `requiredChecks` are WO-124's to derive. The description is the
  statement's text with each line break replaced by one space; a statement
  longer than 2,000 characters then derives no draft and is listed in
  `openDecisions[]`.
- **Declined alternatives, recorded:** a model deciding every class (the
  contract must be reproducible from the bundle plus a recorded inference
  list); an impact map (WO-124); complete criteria with placeholder
  surfaces or checks (a placeholder would pass `copyCriterion` and claim
  scope nobody derived; reopen when WO-124's surfaces become an input of
  the compile); truncating a long statement into a description (it would
  change what the criterion says; reopen if the contract widens its
  description).

**Deliverables:** the contract, compile, revise, fixtures, the
registration, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. Over this order's fixture bundles, which hold at least one struck span,
   one heading matching a declared out-of-scope pattern, one interrogative
   discussion entry, one image reference and one requirement, and over
   WO-060's six valid bundles, every statement carries a span that
   resolves, the rule classes match a pinned expectation, and recompiling
   the same bundle with the same inference list is byte-identical.
2. A class entry whose span overlaps a rule-decided span in any byte
   refuses, naming both spans; a relation entry with evidence may attach to
   a rule-decided span and is recorded `inferred`; a class entry over an
   undecided span is recorded `inferred` with its rationale. In the
   fixtures of criteria 1 and 4, no statement a supplied entry decided
   carries the origin `rule`.
3. A revised bundle that changes one section invalidates exactly the
   statements and criterion drafts derived from that section's spans and
   what derives from them, and nothing in an unchanged section or entry; a
   revision that adds a decision superseding an unedited earlier
   requirement invalidates that requirement through the `supersedes`
   relation, proven by diffs of the contracts.
4. Fixtures with interleaved questions, an unanswered question, quoted
   earlier planning, a later reversal and a superseding decision yield the
   pinned structural facts, `inferred` relations only where a relation
   entry with evidence was supplied, and `open` otherwise; none of them
   yields an `answers` relation without a supplied entry, and a statement
   no rule decides and no entry classifies is listed in `openDecisions[]`.
   The criterion is judged against these fixtures; a case outside them is
   a follow-up, not a failure.
5. Each criterion draft's `criterionId`, `description` and `claimType` pass
   the checks `copyCriterion` applies to them; completed with one fixture
   surface and one fixture check, every draft passes `copyCriterion`
   whole, `visual` ones included; a requirement longer than 2,000
   characters on one line derives no draft and is listed in
   `openDecisions[]`.
6. Write-backs land, each in place with no dated paragraph: 12 §What
   exists and what must be proved (the compile from a bundle to classified
   statements and criterion drafts; at most 200 bytes added, against 360
   bytes of headroom on 2026-09-28; WO-080, WO-082, WO-083, WO-112 and
   WO-118 also write 12, so the executor re-measures the headroom at its
   base, and where the bound does not fit it consolidates the section it
   edits in the same change; a ceiling is raised only by a
   planning-document decision) and 06 §Application version pending —
   Source-to-deliverable vertical (the revision guard's invalidation, in
   the pipeline sentence; at most 150 bytes, against 1,802 bytes of
   headroom on 2026-09-28; WO-086 and WO-087 change 06 before this order,
   and WO-066 and WO-124 amend the same sentence, under the same rule);
   the decisions file; the publication locks refreshed.
7. The new module is registered or excluded with a reason in
   `scripts/lib/evidence-sources.mjs`; every edition the Cost line names
   is re-minted or carried and the console re-pinned; the decisions record
   each.
8. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`packages/compiler/src/index.ts` is a declared source of the five evidence
suites and `scripts/lib/evidence-sources.mjs` of the evidence-sources
suite, and again at final review. No live row.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the adapter (WO-062); an impact map; the enterprise tracker;
a model episode in tests; `codeSurfaces` and `requiredChecks` (WO-124);
the mission check's `MissionStoryContract` and the story file it reads,
which keep their shape; re-reading the artifact for a new revision.

**Operator-review assumptions**

1. The class set is the twelve the objective lists, the idea ledger's
   eleven with `open decision` added; adding one is a contract change.
2. The contract's criteria are drafts that WO-124 completes with surfaces
   and checks; the compile emits no placeholder.
3. A requirement's line breaks become spaces in its description, and one
   longer than 2,000 characters is an open decision rather than a
   truncated criterion.
