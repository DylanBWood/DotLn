# WO-040 — Rule migration, batch one: the migration ledger and the first batch of feedback shapes compiled through the harness target (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Umbrella record (2026-09-08):** superseded whole by bounded children at the operator's same-day correction of the critical-path planning pass; not activatable. Its obligations are carried by WO-096 (the migration ledger and whole-set classification), WO-097 (batch 1a: six rung-1 and rung-2 units with their retirements) and WO-098 (batch 1b: six units including a skill and a cadence unit, the measurement and the batch template). Its observed-gap sentence "no unit has a host-observed live activation" is stale since WO-039's live records; the children state the current gap. The text below is preserved as the record the children cite; nothing in it grants activation.

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds compiled units, handlers, and a
generated migration projection; the feedback contract stays at its version
unless a new handler kind requires a compatible extension, which the order
records. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-06 phase-two redirect, from the
operator's correction of the first phase-two pass, and the founding north
star's migration milestone, which said to prove the compiler on ten
representative incidents and then scale to the corpus (ledger §Notes 001;
synthesized, nothing copied). WO-011 delivered the ten; no order carried the
rest. Planner-synthesized draft; the operator's correction is preserved
locally as a compaction-safety capture. Opaque identifier, not a priority.
The clean-room screen applies with particular force here: the predecessor's
rule files exist only outside this repository and are never an input; the
operator's own intake ideation names rule shapes and annotates them, and
that ideation is synthesized into generic units as WO-011's ten already
were. Shapes that describe an employer's tracker, environments, logins,
teams, or projects are excluded or generalized to a public class, and the
migration ledger says which.
**Depends on:** WO-039 merged (the `harness-v1` target and the Contributor
build the batch is equipped into); WO-011 merged (the feedback contract and
the ten units; satisfied at `v0.13.0`).
**Recommended placement:** wave 2, lane B, beside WO-033, with which it shares
no primary write surface (this order edits the compiler's feedback module,
the skeleton's loadouts, and the migration projection; WO-033 must not).
Later batches are cut from this order's template and float into free lanes.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-096",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-096.",
    "by": "WO-096"
  },
  {
    "workOrderId": "WO-097",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-097.",
    "by": "WO-097"
  },
  {
    "workOrderId": "WO-098",
    "relation": "superseded",
    "reason": "2026-09-08 planning split: this umbrella's obligations are carried by WO-098.",
    "by": "WO-098"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story (the
roughly 140 accumulated rules and what compiling them means) and §The core
bet; 02-domain-model.md §Feedback (FeedbackUnit, the mechanism hierarchy, gem
maturity, semantic correction events) and §Feedback compiler v1;
06-roadmap.md §v0.13.0 — Feedback compiler v1 (the ten and the measured
exit); 01-principles.md Principles 5, 7, and 11; 13-uifa-roles.md §UIFA
engineer and §UIFA tester; 03-architecture.md §Corpus policy;
`docs/lineage/idea-ledger.md` §Notes 001 and §Chat 002 (the founding
inventory of rule categories, the frustration-response shape, and the
"single-serve" session shape); `packages/compiler/src/feedback.ts`;
`packages/skeleton/src/loadouts/feedback.ts`, `feedback-boundary.ts`;
`scripts/feedback-evidence.mjs`; `docs/evidence/WO-011/README.md` (the
measurement method this order repeats).

**Objective:** Give the one-paragraph story a path to completion. Classify
every remaining feedback shape the operator has named into the founding
migration taxonomy, record each with its chosen rung and status in a
generated migration ledger, compile the first batch of at least twelve new
units through the harness target into the Contributor build, and measure
how many shapes now govern live sessions by mechanism rather than by prose.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- Ten shapes are compiled. The operator's intake names roughly 140. The
  roadmap after `v0.13.0` runs console, launchpad, pattern workshop,
  source-to-deliverable, `v1.0.0`; the remaining shapes appear on no rung.
- There is no ledger of shapes: nothing records which are compiled, which
  are candidates, which are knowledge references, which are obsolete, and
  which are excluded because they describe an employer's environment.
- The ten units' maturity stats have controlled-fixture observations only;
  no unit has a host-observed live activation, because no live session runs
  under them (WO-039 closes that).
- The success metric the vision names, a session that gets a build rather
  than a biography, has never been reported as a number.

**Design (scope discipline):**

- **The migration ledger is a generated projection over typed rows.** Add
  `corpus/feedback/migration.json`: one row per shape with a generic
  `shapeId`, its taxonomy category (`invariant`, `reactor`, `evaluator`,
  `transformer`, `workflow`, `knowledge`, `preference`, `incident`,
  `obsolete`), the cheapest sufficient rung, its status
  (`compiled` with the unit id, `batch-N` with the batch it is assigned to,
  `reference` for knowledge that stays an on-demand reference, or
  `declined` with a reason), whether it governs live sessions by
  `mechanism`, `prose`, or `none` (a `reference` row is never `mechanism`),
  and a one-line synthesized source note that cites the ledger, never
  intake. Shapes that describe an employer's tracker, environment, login,
  team, or project **do not get rows**: the committed file carries only a
  count per exclusion class (`excluded.employer-specific: N`), with no
  name, reason, or paraphrase, and the operator's local classification of
  those shapes stays in ignored intake. `npm run feedback -- migration`
  renders `docs/lineage/feedback-migration.md` from the rows with the
  counts per status and per governance mode; `--check` in `npm test`
  refuses a stale render, refuses a compiled unit missing from the rows,
  and runs WO-039's **local-terms check** over every row id, note, unit id,
  incident summary, and behavior sentence: the operator's plaintext list of
  terms that must not re-enter (the commercial tracker's name, the
  predecessor's name, employer host and gateway and policy words, and any
  term the operator adds) lives only in ignored local state, nothing about
  it is committed or hashed into a committed file, a match refuses the
  render, and an absent list reports `unavailable` rather than passing.
  The whole-set denominator (how many shapes the operator's intake names)
  cannot be verified from committed files by construction; the ledger pins
  it to the intake capture's SHA-256 and the operator, who owns the intake,
  attests the count in the receipt, disclosed as an operator attestation.
  Governance mode is derived, not classified, by one rule: a shape whose
  status is `reference` or `declined` is `none`; a shape is `mechanism`
  only when its unit is equipped in the Contributor build **and** no
  always-on sentence restating it remains in the instruction file, the
  marked block, or the guide's always-on portion, which a fixture proves by
  pinning the retired sentence's hash and asserting its absence; every
  other shape is `prose`. Removal runs in both directions: each retired
  sentence is mapped to the unit that covers it (sentence to unit), and a
  reverse-mapping fixture fails the batch when any always-on sentence
  removed in the order has no covering unit, so the required byte fall
  cannot be reached by deleting a correction no unit carries.
- **Classification of the whole set.** Every shape the operator's intake
  names is classified in this order, including the ten already compiled
  (marked `compiled`) and the shapes WO-033's camouflage lint and WO-039's
  hooks already cover (marked `compiled` against those orders). A shape
  that names a commercial tracker, a work login or environment, a team
  convention, or a specific project is counted under its exclusion class
  and gets no row, or is generalized to a public class such as
  "tracked-work artifact reads include their paired images" only where a
  generic shape exists with no employer detail, in which case the generic
  row says it was generalized and nothing more. The redundant sentences a
  batch retires are removed in the same order, never merely nominated.
- **Batch selection rule.** Batch one holds at least twelve new units chosen
  so that: every taxonomy category that can lower to a mechanism has at
  least one member across the ten plus the batch; at least eight lower to
  rung 1 or 2 (a deterministic check or a generated hook), because those
  retire prose fastest and prove the target; at least one lowers to a role
  skill at rung 7; at least one is a cadence-shaped unit (a wait, retry, or
  stall threshold expressed as a kernel `Cadence`); none duplicates a unit
  already compiled. Beside the twelve, at least one `reference`-class shape
  is recorded as a reference the role skill names on demand; a reference
  is not a unit, is not counted among the twelve, and is never counted as
  governing a session by mechanism. Candidate shapes from the ledger's founding inventory include the
  working-directory-and-root check before any repository command, existence
  checks for paths cited in a result, committed-prose lints (typography and
  a single spelling convention) and the formatter run after Markdown edits,
  background-process and browser cleanup at stop, vocabulary camouflage in
  outward artifacts (shared with WO-033's lint), waiting for parallel
  dispatches to complete before reporting, stall and retry thresholds, no
  re-derivation of durable research already recorded, no redundant re-reads
  witnessed by read receipts, a pull-request body grounded in the branch
  diff, and dispatch before any main-thread read when a delegation is
  pending. The executor selects on contact with the real shapes and records
  why each was chosen.
- **Each unit is complete.** The full FeedbackUnit shape, a synthesized
  incident citing public lineage, a regression fixture that fails when the
  mechanism is removed, maturity stats, the declared handler, and its
  lowering through `harness-v1` into the Contributor build. A new handler
  kind is added to the compiler only when no existing kind fits, with the
  compatible extension recorded in 02 and the compiler version bumped per
  10-ir-compatibility.md.
- **Measurement.** Repeat WO-011's method: for each unit, the mechanism
  present and removed; the matched instruction-byte comparison against the
  prose equivalent; and the new whole-set numbers: shapes by status, shapes
  governing live sessions by mechanism versus prose before and after this
  batch, startup context by WO-039's method, and the list of execution-guide
  and instruction-file sentences the batch makes redundant. Removing those
  sentences is done here only when bounded and covered by the same checks;
  otherwise it is nominated for WO-035.
- **The batch template.** The order's result records the procedure as a
  template (selection rule, classification, unit shape, lowering,
  measurement, write-backs) so that batch two is cut by copying it, and the
  migration ledger names the next batch's candidates. The template is the
  deliverable that makes the remaining batches routine.
- **Declined alternatives, recorded:** importing or paraphrasing any
  predecessor file (clean room); migrating every shape in one order (the
  north star's own anti-goal); a scoring model for which rule matters (the
  attention policy's frequency baseline is measured, not assumed); prose
  units at rung 9 for convenience (a shape that only lowers to prose is a
  `reference` or a finding, not a unit).

**Deliverables:** `corpus/feedback/migration.json`, its renderer and check,
and `docs/lineage/feedback-migration.md`; at least twelve new compiled
units with fixtures and maturity stats, equipped into the Contributor build
and lowered through `harness-v1`; the measurement; the batch template; the
write-backs below.

**Acceptance criteria (all required)**

1. The migration ledger classifies every shape the operator's intake names,
   with the ten existing units marked `compiled`, employer-specific shapes
   present only as a count per exclusion class with no row, the denominator
   pinned to the intake capture's hash with the operator's attestation
   disclosed, and the counts per status and governance mode rendered from
   the derived rule; `--check` refuses a stale render, a missing compiled
   unit, a `mechanism` row whose retired sentence is still present, and any
   row or unit text matching the local-terms list, proven by a fixture row
   that carries a synthetic term.
2. At least twelve new units satisfy the selection rule (all lowerable
   categories covered; at least eight at rung 1 or 2; at least one skill and
   one cadence), each with the full FeedbackUnit shape and a regression
   fixture that fails when its mechanism is removed; at least one reference
   is recorded beside them and counted as `reference`, never as a unit.
3. Every batch unit lowers through `harness-v1` into the Contributor build,
   `harness check` still passes after the regenerated configuration is
   committed, and the hook fixtures of WO-039 cover each new hook.
4. The measurement is directional, derived, and cannot be satisfied by
   relabeling: per-unit instruction-byte comparison; for each unit compiled
   in the batch, the always-on sentence that stated it is removed in this
   order, with the retired sentence's hash pinned and its absence asserted
   by fixture; the derived count of shapes governed by mechanism is higher,
   and by prose lower, after the batch than before it; the instruction file
   and every role's directed-load total under WO-039's criterion 6 method
   (every file the instruction file or the skill directs before acting,
   derived mechanically) are strictly lower after the batch than before
   it; the reverse-mapping fixture proves every always-on sentence removed
   in this order has a covering unit in the batch or in the ten, and fails
   on a fixture removal that has none; the independent verifier searches
   the whole always-on set for any restatement, paraphrased or not, of
   each unit labeled `mechanism` and records the search, and a found
   restatement reverts that shape to `prose` before the counts are
   reported; and the list of sentences that
   remain names why each could not be retired here. A batch whose bytes do
   not fall fails this criterion, and so does a batch whose fall includes
   an uncovered removal; removal is not nominated to WO-035 for a sentence
   this batch's units cover.
5. The batch template is recorded in the result and the migration ledger
   names batch two's candidates.
6. Write-backs land: 02 §Feedback compiler v1 (the batch and any handler
   extension); 06 (the harness-lowering and migration rung's status); 13
   engineer and tester rows; README "What runs today"; a dated
   capability-table row for `feedback.migration` with the counts;
   publication index rows and both edition locks; ledger entry.
7. `npm test` green; `git diff --check` clean; no new dependency; kernel
   unchanged; the local-terms check has run over every committed row and
   unit text with the operator's list present (reported, not assumed), and
   a reviewer reads each incident summary against the ledger reference it
   cites.

**Evidence gate:** the fixture transcripts for criteria 2 and 3; the
measurement for criterion 4; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** more than one batch (batches two onward are the recorded
candidate "Rule migration, batches two onward" in the planning map's
preserved candidates: one batch per wave from wave 4, each cut from this
order's template, each named in the migration ledger before it is filed);
any predecessor file or wording; the harness target itself (WO-039); the
console (WO-032); the pattern shelf (WO-037); a general attention-policy
engine; changing lifecycle legality.

**Operator-review assumptions**

1. The operator may add or strike candidate shapes through an `ideation:`
   note before activation; the selection rule stays.
2. Employer-specific shapes are excluded by default; a generalized public
   class is admitted only when the executor can state it without any
   employer detail.
3. The redundant-sentence removals in this order are bounded to sentences
   the batch's mechanisms provably cover, which criterion 4's reverse-mapping
   fixture enforces rather than assumes; the rest go to WO-035.
