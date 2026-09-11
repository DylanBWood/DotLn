# WO-043 decisions

## WO-043-D001

```json
{
  "id": "WO-043-D001",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 typed dependency design and acceptance criteria 1–4",
  "decision": "Keep dependency authority in the work-order header and share one parser and projection between index, selected CLI status and activation. Closure evidence retains the final-review verdict. Typed release readiness observes current local annotated DotLn tags in HEAD ancestry, independently of the index's historical release-attribution snapshot.",
  "evidence": [
    "scripts/lib/dependencies.mjs",
    "scripts/test-work-orders.mjs: typed parser, projection, ancestry and index/status parity fixtures",
    "scripts/test-dependency-resume.mjs: refusal preserves event and projection bytes"
  ],
  "rejected": [
    "A separate registry would duplicate the authority file.",
    "Control-log waiver events would change the phase-only schema outside this order.",
    "Token-based activation refusal would recreate the historical-reference defect.",
    "Using the attribution tag snapshot for dependency readiness could disagree with current status when a required release becomes available.",
    "A scheduler or recommendation engine is outside the selected dependency question."
  ],
  "reopenWhen": "A concrete consumer needs a dependency source beyond work-order authorities, or measured status cost warrants a cache that preserves the same current ancestry evidence."
}
```

The pure lifecycle `statusProjection` keeps an optional dependency argument;
the CLI supplies the selected authority's projection. Historical revision
consumers can keep projecting lifecycle state without silently reading current
work-order files. No selection yields `dependencies: null`.

## WO-043-D002

```json
{
  "id": "WO-043-D002",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 forward-only migration; later dated umbrella decision in WO-036",
  "decision": "Migrate all 85 currently open records, including WO-118 through WO-125 from the revised horizon. Preserve all 40 closed or historical authorities byte-for-byte. Transcribe the graph's entries, supplement its four corpus nodes from their Depends on prose, and represent umbrella successors as non-blocking superseded entries. WO-036 follows its later 2026-09-09 supersession by WO-126.",
  "evidence": [
    "docs/evidence/WO-043/migration.json: 85 prose comparisons and 245 typed entries",
    "docs/planning/critical-path-2026-09-08.json: observed 109 nodes and 207 edges",
    "docs/work-orders/WO-036-evidence-runner.md: 2026-09-09 umbrella notice",
    "docs/work-orders/WO-102-cadence-corpus.md",
    "docs/work-orders/WO-103-authority-outbox-corpus.md",
    "docs/work-orders/WO-105-crash-shape-corpus.md",
    "docs/work-orders/WO-107-profiling-baseline.md"
  ],
  "rejected": [
    "Backfilling closed WO-042 would violate the order's forward-only fence; both its unchanged token projection and the seed graph's satisfied entries have no blocker.",
    "Stopping at WO-117 would omit the same planning pass's revised open horizon.",
    "Keeping WO-036's old release dependencies as its current meaning would ignore the later operator-authored umbrella decision.",
    "Rewriting the dated graph to conceal its omissions would erase migration evidence."
  ],
  "reopenWhen": "A later reviewed planning decision changes a relation, a deferral is waived with a date, or a successor no longer carries the named umbrella obligation."
}
```

For an umbrella entry, `workOrderId` identifies a successor and `by` names that
same successor. This lists every child without a prohibited self-reference to
the umbrella. Supersession conveys lineage; it neither blocks dependencies nor
grants activation authority to an umbrella whose notice says it is not activatable.

## WO-043-D003

```json
{
  "id": "WO-043-D003",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; standing release assignment default and WO-043 patch classification",
  "decision": "Assign application v0.17.1 above the observed local annotated v0.17.0 baseline. Keep all component versions because the deliverable changes only control-plane scripts and documents. Prepare the release locally.",
  "evidence": [
    "docs/product/06-roadmap.md: Release boundary",
    "docs/work-orders/WO-043-typed-dependency-truth.md: release classification",
    "npm run release -- prepare --local: target v0.17.1 remains current"
  ],
  "rejected": [
    "A component bump would claim a package change that this order does not contain.",
    "Publication is not authorized by the executor dispatch."
  ],
  "reopenWhen": "A sibling release consumes v0.17.1 before integration, or an authorized scope change alters a component's compatibility impact."
}
```

The inherited ledger duty is discharged here and in the generated decisions
index under the executor skill's forward-only substitution. The product
write-backs retain the three distinct answers: legal action, dependency
eligibility and recommendation.

## WO-043-D004

```json
{
  "id": "WO-043-D004",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 required header migration and full application gate",
  "decision": "Extend planning continuation only for WO-043's reviewed dependency transcription. Compare relation fields with the seed at the original judgment revision, require that seed to remain byte-identical, preserve the four corpus prose mappings and reviewed umbrella successors, and remove only the inserted metadata block before the existing byte-preservation checks. Preserve the original planning receipts and their subject hashes.",
  "evidence": [
    "The first canonical full gate passed 35 suites and failed the console live release-list observation and plan-refutation:current.",
    "scripts/lib/plan-continuation.mjs and scripts/lib/plan-dependency-migration.mjs",
    "scripts/test-plan-refutation.mjs: reviewed migration before and after commit, unchanged receipt, refusal of omitted edges, changed relations, unreviewed waiver, objective edit, seed drift and absent migration authority",
    "The current planning gate accepted 74 typed migrations inside its judged horizon; the migration receipt independently covers all 85 open authorities."
  ],
  "rejected": [
    "Rewriting immutable planning receipts would replace the independent judgment with executor-authored evidence.",
    "Ignoring arbitrary dependency blocks would silently admit new planning decisions.",
    "Dropping the planning gate would leave the required full application check incomplete.",
    "Changing package behavior to mask a transient source-unavailable observation would exceed this order's no-packages fence without a demonstrated package defect."
  ],
  "reopenWhen": "A later planning pass changes dependency meanings, the original seed is intentionally revised, or another migration needs its own reviewed authority and bounded continuation rule."
}
```

Same-day correction: I initially treated the new dependency headers as ordinary
execution metadata, but the existing continuation comparator recognizes only
specific execution updates. The full gate exposed that mismatch. The bounded
transcription rule above supplies the missing classification without changing
the judged plan. I also changed the assigned release heading to `(v0.17.1)`,
the established release-assignment form.

The initial console failure reported `release:list` unavailable; a standalone
`npm run release --silent -- list` then exited successfully with the local
release records. A timeout under concurrent load is a possible cause, not an
established diagnosis. The canonical retry must pass that same console check.

## WO-043-D005

```json
{
  "id": "WO-043-D005",
  "date": "2026-09-11",
  "dispatch": "Operator resume: fix against VER-001 F1",
  "decision": "Restore planned for the mixed Work-order navigation and identity section and refresh the edition source locks after the repair and operator-authorized product write-backs.",
  "evidence": [
    "docs/verifications/WO-043/VER-001.md: F1",
    "docs/product/06-roadmap.md: Work-order navigation and identity retains broader candidate claims",
    "docs/publication/audience-status-index.md: least-mature mixed-section rule"
  ],
  "rejected": [
    "Implemented would overclaim the remaining planning-row and scheduling design.",
    "Removing the retained candidate claims would expand the publication repair into a product decision."
  ],
  "reopenWhen": "Independent evidence establishes every remaining material claim in the section or a reviewed section split gives implemented claims their own row."
}
```

Same-day correction: the implementation classified the whole section from its
newly delivered dependency projection. The section still contains planned
material; its index row must remain planned.

## WO-043-D006

```json
{
  "id": "WO-043-D006",
  "date": "2026-09-11",
  "dispatch": "Operator ideation for first-party scope expand: and conversation only: commands, followed by the side-question clarification",
  "decision": "Document both prefixes in the session command contract and carry them in the shared floor and generated role instructions. Scope expand adds the stated bounded work with its durable receipt; conversation only answers a side question and continues the current work order without changing scope or requiring another resume command.",
  "evidence": [
    "docs/evidence/WO-043/ideation-commands-and-usage.md",
    "docs/product/07-execution-guide.md: Operator resume phrases and the existing WO-126-D019 continuation rule",
    "docs/lineage/idea-ledger.md: 2026-09-11 first-party session commands"
  ],
  "rejected": [
    "Treating conversation only as a persistent pause contradicts the operator's explicit definition.",
    "Automatically capturing the side question as ideation would infer a write instruction the prefix does not supply.",
    "Changing lifecycle events or implementing WO-088's deferred phrase-table generator is unnecessary for this session command contract."
  ],
  "reopenWhen": "The operator changes the command meaning or a concrete interaction exposes an ambiguity."
}
```

Same-day correction: my proposed read-only discussion mode incorrectly implied
that conversation only persisted until a later action command. The operator
meant a side question during uninterrupted work; the final contract preserves
that process.

## WO-043-D007

```json
{
  "id": "WO-043-D007",
  "date": "2026-09-11",
  "dispatch": "Operator explicitly requires every future Codex and Claude session to measure and track actual tokens",
  "decision": "Use one source-aware current-session collector for the explicit harness usage command, Claude Stop hook, meta collection and all four lifecycle completion checks. Require numeric input, output and total counters; reject missing, stale and foreign-session evidence rather than silently storing an unmeasured handoff. Keep private source material local. Bump skeleton from 0.15.0 to 0.15.1 for this bounded repair; retain application v0.17.1 and other component versions.",
  "evidence": [
    "packages/skeleton/src/usage-observation.mjs",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/lifecycle-evidence.mjs",
    "scripts/test-process-debt.mjs: both-harness counter, privacy, deduplication and completion fixtures",
    "docs/evidence/WO-043/ideation-commands-and-usage.md"
  ],
  "rejected": [
    "Keeping collection optional repeats the operator-reported failure.",
    "Summing every transcript with the same worktree can misattribute another session.",
    "Adding cached Codex input twice overstates usage; omitting Claude cache reads and writes understates it.",
    "Inventing zero, prices or missing historical counters would fabricate evidence.",
    "Blocking every Stop would reintroduce the turn-end gate loop; lifecycle completion enforces measurement while Stop reports a collection failure and releases the writer."
  ],
  "reopenWhen": "A harness changes its transcript or counter format, or measured collector cost justifies a faster reader that preserves identity, interval and counting semantics."
}
```

This operator expansion supersedes D003's original no-component-change
observation for the newly authorized skeleton repair only. The original
no-publication authority and all dependency obligations still apply.

## WO-043-D008

```json
{
  "id": "WO-043-D008",
  "date": "2026-09-11",
  "dispatch": "Operator reports Adjacent Repair and Intent to Act require explicit prompting during executor/fix",
  "decision": "Project equipped support duties before subject reads and show installed support identities plus queue state on bare next/fix. Announce the initial action as well as each next queued action. Refuse implementation-ready and repair-complete while an item is queued or running; retain explicit dispositions and required public deferral destinations. Keep actor-attested chat and independent support switches.",
  "evidence": [
    "docs/product/05-pattern-library.md: Intent queue and communication levels",
    "scripts/lib/executor-readiness.mjs",
    "scripts/lib/planning-followups.mjs: requirePlanningHandoffs",
    "scripts/test-process-debt.mjs: bare next/fix, removal, read-only status and unresolved queue fixtures",
    "docs/control/local/adjacent-work.jsonl: adjacent-0001 is the live repair, with an actual intent announcement and steering boundary"
  ],
  "rejected": [
    "Equipped prompt fragments alone do not establish that their duties run.",
    "Treating printed intent text as witnessed chat delivery would overclaim the host observation.",
    "Automatically repairing every imperfection would discard authority and scope judgment.",
    "Implementing the Tinkerer now contradicts the operator's explicit deferral; its existing public candidate carries the near-term planning request."
  ],
  "reopenWhen": "An ordinary fresh-session dispatch omits the duty, unresolved queued work escapes completion, or a bounded ablation demonstrates a smaller effective mechanism."
}
```

## WO-043-D009

```json
{
  "id": "WO-043-D009",
  "date": "2026-09-11",
  "dispatch": "Operator accepts Process Cost as a first-class support across all six Contributor phases and asks when solution comparisons are made and retained",
  "decision": "Replace the repeated processCost role string with one compiled Process Cost support. Extend the harness role-procedure adapter additively from one roleName to an explicit roleNames set, retaining the legacy shape and rejecting invalid targets. Keep the host meter and mandatory token collection separate from the configurable behavior. Bump compiler to 0.9.1 and skeleton to 0.15.1; retain application v0.17.1. Record comparative judgments in existing phase evidence, not a second log.",
  "evidence": [
    "packages/skeleton/src/loadouts/process-cost.ts",
    "packages/compiler/src/harness.ts: explicit shared role projection",
    "packages/skeleton/test/executor-supports.test.ts: all roles, both harnesses, independent removal and invalid targets",
    "docs/product/07-execution-guide.md: Goal-aligned decisions"
  ],
  "rejected": [
    "NoOp retains a hidden repeated instruction without the support identity the operator requested.",
    "Six duplicate support identities misrepresent one shared behavior.",
    "A global prose-residue facet is not reliably delivered as role equipment by the existing merger.",
    "Making telemetry optional when the behavioral support is removed contradicts the operator's token requirement."
  ],
  "reopenWhen": "Shared role projection drifts, an opted-out behavior removes mandatory measurement, or measured instruction/host cost outweighs the observed reduction in recurring supervision."
}
```

The saved no-support semantic fixture remains `fnv1a64:06245f5c581212f1`.
The shared role projection belongs to the harness target and equipped-support
identity; historical build identities and observations remain unchanged.

## WO-043-D010

```json
{
  "id": "WO-043-D010",
  "date": "2026-09-11",
  "dispatch": "Operator requires every stage to understand DotLn's goal and purpose and check all decisions against goal/critical-path progress, following the all-eight-traps, Naive Interventionism and NoOp direction",
  "decision": "Equip Goal Alignment across all six roles. Use a scoped goal card sourced from the vision, current critical-path plan and selected order. Compare material choices before selection, revisit changed evidence or scope, and compare results at handoff. Retain the mission/path link, action-versus-NoOp rationale, intervention risks and all-eight-trap assessment in existing phase evidence. This is a compiled instruction duty, not a machine claim to observe internal judgment or a generalized causal evaluator.",
  "evidence": [
    "docs/product/00-vision.md: Mission — increase the chance of operator flow",
    "docs/planning/critical-path-2026-09-08.md: always-on runtime and independently verified external source-to-deliverable path",
    "docs/product/07-execution-guide.md: Goal-aligned decisions",
    "packages/skeleton/src/loadouts/goal-alignment.ts"
  ],
  "rejected": [
    "NoOp leaves agents optimizing procedural completion without an explicit link to operator flow.",
    "Treating every process repair as direct product-thesis progress hides its cost and necessary-prerequisite status.",
    "Eight boilerplate paragraphs for every edit add operator burden without demonstrating judgment.",
    "An invented deterministic gate that claims to verify every mental comparison would turn instruction compliance into false evidence."
  ],
  "reopenWhen": "A decision cannot name a supported mission/path contribution, repeated process work delays the selected outcome, or a smaller observed mechanism performs the same judgment with less recurring cost."
}
```

This repair is enabling machinery, not the external-source milestone itself.
Typed dependencies clarify prerequisites; measured usage and automatic support
duties reduce repeated operator rescue before later runtime work. NoOp preserves
the specific reported failures. The intervention preserves existing authority,
phase legality, privacy and independent verification; the smallest probe is the
ordinary-dispatch and both-harness fixture before the full gate.

| Trap                                  | Comparison for this repair                                                                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Policy resistance / fixes that fail   | Preserve the original dependency work and independent role duties; shared supports cannot expand effects or override the operator.                       |
| Tragedy of the commons                | Measure actual phase tokens and preserve the cold-start ceilings; no additional model episode or permanent scanner is added.                             |
| Drift to low performance              | Reject unresolved queue items and absent counter evidence instead of accepting the previous session's deficient baseline.                                |
| Escalation                            | Reuse the existing meter, queue, decision records and final gate; add no new approval cycle or parallel log.                                             |
| Success to the successful             | Compare NoOp, repeated strings, duplicate support identities and shared projection; do not select the old implementation merely because it exists.       |
| Shifting the burden to the intervenor | Ordinary next/fix must expose the duties without the operator naming them; the Tinkerer remains explicitly deferred.                                     |
| Rule beating                          | Test actual CLI entry and completion refusal. Printed intent and populated records do not prove chat delivery or sound judgment.                         |
| Seeking the wrong goal                | Classify this as bounded enablement of reliable work toward the runtime path; byte counts, receipts and green checks alone are not the intended benefit. |

Naive Interventionism risk: the legacy single-role compiler adapter, independent
switches, readonly observations and release helper depend on existing behavior.
Preserve and test those interfaces, keep the new multi-role target additive,
and shorten duplicated procedure to pay for shared duties within the current
byte budget. A future measured regression reopens this choice; no automatic
schema rewrite, scope escalation or claim that all trap causality is observed
is introduced.

## WO-043-D011

```json
{
  "id": "WO-043-D011",
  "date": "2026-09-11",
  "dispatch": "Equipped Adjacent Repair during the operator-authorized mandatory-token work; discovered by inspecting the final aggregate without another operator prompt",
  "decision": "Preserve legacy usage records and append a measured replacement referencing the superseded observations. Project the replacement once. Require known same-work-order/role references inside its measured window. Reproduce each original counter vector against the exact source session before reconciling live records. Seven older Claude observations from two overlapping start windows reproduce from one source; their union is 10,029,006 tokens, rather than the 16,938,893 sum of the two latest records.",
  "evidence": [
    "docs/evidence/WO-043/usage-reconciliation.json",
    "scripts/test-process-debt.mjs: source-reconciled overlapping usage",
    "docs/control/local/adjacent-work.jsonl: adjacent-0002, diagnosed and announced before the accounting correction"
  ],
  "rejected": [
    "NoOp publishes an inflated observed total and undermines cost decisions.",
    "Choosing the largest count without replaying the source would assume away potentially distinct concurrent sessions.",
    "Editing or deleting original local observations would erase the recovery and audit trail."
  ],
  "reopenWhen": "A source-verified replacement no longer reproduces its counters, later aggregation counts an overlapping observation twice, or historical attribution cannot be established from source."
}
```

Goal/path contribution: accurate cost evidence supports operator-flow decisions
while preserving the selected runtime path. This is bounded enabling work.
Rule beating and seeking the wrong goal would treat a populated numeric field
as success despite inflated usage; drift would normalize that inflation.
Append-only correction avoids policy resistance and escalation from rewriting
history. Source replay spends a bounded local read rather than operator rescue
or an extra model episode, addressing shared-resource cost and burden shifting.
The decision compares alternatives without favoring the existing sum merely
because it is already implemented. Naive Interventionism is answered by retained
originals, explicit scope and refusal tests; NoOp loses to the reproduced defect.

## WO-043-D012

```json
{
  "id": "WO-043-D012",
  "date": "2026-09-11",
  "dispatch": "Necessary compatibility repair after the authorized shared-role and mandatory-usage implementation failed four existing evidence preflights; operator explicitly authorizes one isolated live Claude audit verifier",
  "decision": "Keep historical evidence immutable, select fresh current artifact/verification/authority/feedback evidence, and preserve the original executor-only removal assertion by explicitly equipping that subset. Retain the saved no-support semantic hash and independent baseline oracle. Add observed Claude CLI 2.1.268 to its exact transport profile without relaxing tools, settings, source, budget or result checks. Console 0.1.4 shares the new current selection; compiler 0.9.1, skeleton 0.15.1 and application v0.17.1 remain assigned.",
  "evidence": [
    "scripts/authority-evidence.mjs: explicit defaultExecutorSupportIds isolation",
    "docs/evidence/current.json",
    "packages/skeleton/src/worker-transport.ts: observed 2.1.268 profile",
    "docs/evidence/WO-043/repair-001.md: validation"
  ],
  "rejected": [
    "NoOp leaves required compatibility checks stale and the console unable to replay current compilation identity.",
    "Overwriting old evidence would erase what its verifier actually saw.",
    "Weakening the live-verifier or independent-oracle assertions would make a passing gate misleading."
  ],
  "reopenWhen": "A replacement does not reproduce its source claims, the isolated equipment test excludes a claimed behavior, or the observed CLI no longer satisfies the restricted transport profile."
}
```

## WO-043-D013

```json
{
  "id": "WO-043-D013",
  "date": "2026-09-11",
  "dispatch": "Operator challenges repeated work-order literals in scripts and requires accuracy over sycophancy across every phase; bounded repair continues under the equipped Adjacent Repair authority",
  "decision": "Centralize current evidence selection in docs/evidence/current.json and one shared resolver consumed by all four evidence commands and the console. Remove current-order literals from gate and package commands and their test normalization. Keep explicit historical pins and independent expected results. Starting another order does not change the manifest; relevant source drift still requires newly recorded evidence. Clarify the already-equipped Correctness over Sycophancy policy in the all-phase goal card and assert its identity and instruction in every generated role for both harnesses.",
  "evidence": [
    "packages/skeleton/src/evidence-editions.mjs",
    "packages/skeleton/test/evidence-editions.test.ts: switch manifest without source edits; preserve historical selection; refuse malformed entries",
    "scripts/test-runner.test.mjs: original 37-command inventory retained",
    "packages/skeleton/test/executor-supports.test.ts: all-role correctness provenance",
    "docs/product/07-execution-guide.md: Goal-aligned decisions"
  ],
  "rejected": [
    "NoOp preserves avoidable repeated edits and requires recurring operator intervention.",
    "Automatically choosing the active order or latest directory confuses current work with validated evidence.",
    "Deriving test expectations from the implementation removes their independent ability to detect regressions.",
    "Adding another correctness support duplicates one already equipped in all roles."
  ],
  "reopenWhen": "A current consumer hardcodes its selection again, the manifest accepts an invalid path, historical expectations drift silently, or all-phase instructions reward agreement over supported claims."
}
```

Goal/path and intervention comparison for D012–D013: one current selection
removes recurring supervision and repairs the evidence prerequisite for the
runtime path. Preserve fixed historical comparisons before changing consumers;
probe a different manifest selection and a refused malformed entry. NoOp keeps
avoidable coupling, while deriving expectations from output would hide defects.
All-eight review: shared selection reduces policy resistance; one resolver and
reused audits conserve the commons; independent assertions prevent drift to low
performance and rule beating; retaining existing checks avoids escalation;
rejecting sunk-cost duplication counters success to the successful; configuration
removes burden from the operator; source validity and flow, rather than a green
label, remain the goal. Source changes still justify fresh proof, so this repair
does not promise that future work never needs new evidence or changed tests.

## WO-043-D014

```json
{
  "id": "WO-043-D014",
  "date": "2026-09-11",
  "dispatch": "Operator resume: fix against VER-002 F2–F5",
  "decision": "Carry the session-prefix contract in all generated Contributor role targets, preserve the saved loadout semantic identity, and restore the entire hand-written floor to HEAD's wording. Compact only the generated release-close procedure to retain its existing context ceiling and duties. Correct product 07's directed-input table. Reproduce historical Codex usage windows before appending reconciliation records, then refresh the public meter and release preparation from measured counters.",
  "evidence": [
    "docs/verifications/WO-043/VER-002.md: F2–F5",
    "packages/compiler/src/harness.ts: HarnessProgram is a separate target input with its own target hash",
    "packages/skeleton/test/executor-supports.test.ts: both-harness generated role assertions and saved loadout identity",
    "docs/evidence/WO-043/repair-002.md"
  ],
  "rejected": [
    "NoOp retains four verified failures and blocks a trustworthy handoff.",
    "Rewording the locked floor or raising its budget repeats F3 instead of repairing it.",
    "A new optional support or compiler interface adds machinery where the existing role target already carries mandatory instructions.",
    "Changing historical counts without source replay, or deleting old observations, loses evidence."
  ],
  "reopenWhen": "Generated commands lose a required meaning, target compaction drops a release duty, or a completed dispatch is omitted or counted twice in the meter."
}
```

This is prerequisite repair for reliable work toward the external-source runtime
path. F2 mistook shared hand-written instructions for generated output; F3 treated
a byte ceiling as permission to reword the floor; F4 missed a newly directed
read; F5 published partial windows. The corrections restore those contracts.
Newly required inputs are the Contributor target, its tests, harness/context and
usage/meta adapters, local counter metadata, and release/publication generators.

All-eight comparison: preserving authority and independent verification avoids
policy resistance; bounded counter replay and reused checks conserve the commons;
explicit output assertions counter drift and rule beating; existing target and
reconciliation mechanisms avoid escalation; comparing them with a new support
avoids sunk-cost preference; generated instructions reduce operator rescue;
accurate commands and measured cost, rather than smaller files or a green label,
remain the goal. Naive Interventionism calls for restoring known floor bytes,
preserving historical observations and loadout identity, and probing generated
output before the full gate. NoOp leaves the reproduced defects in place.
