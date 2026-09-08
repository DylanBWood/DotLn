# WO-061 — StoryContract compile: a pure function derives classified, provenance-bearing statements and acceptance criteria from a SourceBundle, labels model-inferred statements as such, and a source revision invalidates exactly the derived items it touched (version assigned at activation)

**Model:** any capable model for the pure compiler; the inference slot's
model episode is a labeled fixture double here. State the model and effort
actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new public contract (`StoryContract`
v1) and a pure compile in the compiler package; no dependency. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
G, the compile slice), cut as a bounded order at the operator's same-day
correction; the operator's parity item "full intake and understanding of
requirements". Planner-synthesized draft; captures and hashes in the ledger
section of that date. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-060 merged (the bundle it compiles from).
**Recommended placement:** after WO-060; it edits `packages/compiler/src/`
(a new story-contract module), its tests and product 12. A recommendation,
not a dependency token.

**Cites (read these sections):** 12-workstream-application.md §One outcome
from request to return and §Replacing a successful but costly workflow (the
replacement table's intake behaviors); 06-roadmap.md §Application version
pending — Source-to-deliverable vertical (the source-revision guard);
02-domain-model.md §Independent verification v1 (AcceptanceCriterion);
`packages/compiler/src/` (the source-bundle module from WO-060).

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

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Nothing derives a contract from an artifact; the vertical's contract would
  be typed by hand, which is the predecessor's shape.

**Design (scope discipline):**

- Deterministic rules for what text can decide: struck-through spans are
  `struck`; sections whose heading matches a declared out-of-scope pattern
  are `non-requirement`; interrogative discussion entries are `question`;
  the next entry by another role is recorded only as the structural fact
  `follows`, and an `answer` relation is `inferred` with evidence or left
  `open`, never decided by position; image references are
  `visual annotation`; everything else is a candidate for the inference
  slot.
- The inference slot takes a list of `{ span, class, rationale }` supplied by
  a caller (a model episode in WO-112, a fixture double here); each is
  recorded as `inferred` with its rationale; a supplied inference may not
  change a structural fact (a strike, a heading, an order of entries) but
  may attach a semantic relation to it (an answer, a supersession) with
  evidence; ambiguity is recorded as `open`, never resolved by default.
- Criteria: one `AcceptanceCriterion` per requirement statement with the
  statement as its text and the span as provenance, typed `behavior` by
  default and `visual` when the statement references a visual annotation.
- **Declined alternatives, recorded:** a model deciding every class (the
  contract must be reproducible from the bundle plus a recorded inference
  list); an impact map (a later candidate).

**Deliverables:** the contract, compile, revise, fixtures, the write-backs
below.

**Acceptance criteria (all required)**

1. Over the WO-060 fixtures, every statement carries a span that resolves,
   the rule classes match a pinned expectation, and recompiling the same
   bundle with the same inference list is byte-identical.
2. A supplied inference over a rule-decided span refuses; an inference over
   an undecided span is recorded as `inferred` with its rationale and never
   as `rule`.
3. A revised bundle that changes one section invalidates exactly the
   statements and criteria derived from that section's spans and nothing
   else; a revision that adds a decision superseding an unedited earlier
   requirement invalidates that requirement through the `supersedes`
   relation, proven by diffs of the contracts.
4. Fixtures with interleaved questions, an unanswered question, quoted
   earlier planning, a later reversal and a superseding decision yield the
   pinned structural facts, `inferred` relations only where an inference
   with evidence was supplied, and `open` otherwise; a positional answer is
   never emitted.
5. The derived criteria validate under the `verification-v1` schema.
6. Write-backs land: 12 (the intake behaviors' status), 06 (the revision
   guard sentence), ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the adapter (WO-062); an impact map; the enterprise tracker;
a model episode in tests.

**Operator-review assumptions**

1. The class set is the audit's twelve; adding one is a contract change.
