# WO-088 — Planning documents become checked contracts: the operator phrase list has one generated source, the capability table's dated sections fold into its rows in a table a planning pass installs, the index check holds order files to a stable contract, and planning passes register in planning records while the idea ledger keeps the operator's own ideas (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** machinery
**Front page:** README.md
**Release classification:** patch, the highest of the three merged orders
(each patch): a check with fixtures and a forward-only note migration in
the work-order tooling, one generated block with its check, a prepared
document fold, and pass registration moved from the ledger to planning
records with a `plan passes` subcommand and its move. Assigned at
activation under the standing opt-out default.
**Cost:** adds an order-contract check in `scripts/work-orders.mjs`, run by
`index --check`, with fixtures; the move of dated notes outside the
admitted leads to evidence READMEs; when step 1 finds a differing phrase
copy, an emitter behind `scripts/resume.mjs phrases`, two document suites
and the marker pairs; a prepared folded capability table, its fold map and
a check under `docs/evidence/WO-088/`; pass registration by a marker in
planning records (`scripts/lib/plan-passes.mjs`, new), its four readers
switched, `plan passes [--move]`, a lineage refusal of pass headings, the
move of the ledger's planning-pass sections to
`docs/planning/planning-pass-sections.md` (new) with their links, and the
fixtures; write-backs to product 07, the order template, the kit README,
the ledger header and the generated history page. Removes the hand-kept
phrase copies (none differs at `6dbd8771`: a drift risk, not a defect);
once a planning pass installs the fold, the 29 dated capability sections
as separate text and their reading cost; the planning-pass sections in the
ledger (3,481 of its 9,636 lines at `6dbd8771`), and the constraint that a
pass cannot drop its ledger heading without breaking its own refutation
(planning document §12.6); and two order cycles (activation,
verification, final review and release close), each costing in this window
2.29 full gate runs and 61 minutes of full gate per closed order, with
phase medians of 16.9 minutes for verification and 24.8 for final review
(planning document §12). No merged order owed a live feedback episode.
Wall-clock: one implementation longer than any merged order's, unmeasured
until run. Context bytes: one order file of about 59,000 bytes in place of
three of 46,568 at `6dbd8771`; the pass-registration part is new to it.
Commands: adds `npm run plan -- passes [--move]`; the Preflight line's
single-suite checks and one `npm test -- --review` before handoff, in place
of three handoff sequences. Tokens: unknown until run. Steps: 27 in place
of 25. Re-mints: none, unless step 1(e) finds the executor role text still
saying the ledger takes planning synthesis: then step 22 edits
`contributor.ts`, a registered source of the authority, feedback and
harness editions, which are re-minted deterministically, with the harness
re-emit; it is not a file the feedback verifier judges, so no live
episode. Every other edited script and document is unregistered,
`scripts/lib/paths.mjs` is read, not edited
(`scripts/lib/evidence-sources.mjs` at `6dbd8771`), and no file
`FEEDBACK_SOURCE_PATHS` lists is edited. The capability table is a
planning-subject input, so its rows change only under a new refutation
receipt.
**Nomination provenance:** the phrase list and the fold are WO-035's
phrase-table and capability-table items, cut into bounded children at the
operator's 2026-09-08 correction; the 2026-09-19 cleanup pass held the
first with its gap to be re-observed and the second to be rewritten as a
planning act; the 2026-09-28 pass re-observed both at `5f3849ec`. The
order-contract check is the 2026-09-08 external audit's separation rule
(the work-order file must stop becoming the execution log), restated by
the operator during the critical-path pass's correction, with captures
and hashes in that date's ledger section; the 2026-09-28 pass admitted the
dated observed gap and the execution record and bound the section rule to
orders filed after the cutoff
([2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Register rows FUP-0023 (the deferred documentation reset) and
FUP-0025 (the umbrella-note migration). Planner-synthesized; opaque
identifier, not a priority; clean-room screen: no stop condition. WO-088,
WO-089 and WO-113 were merged by the 2026-10-13 standard planning pass
under the operator's sizing direction
([planning document](../planning/standard-pass-2026-10-13.md) §12). The
same pass gave this order pass registration and the move of the ledger's
planning-pass sections, from the operator's 2026-10-13 direction that the
idea ledger hold the operator's own ideas, not planning-pass and work-order
records (planning document §12.1 and §12.6), because the plan tooling finds
passes by their ledger headings and a planning branch cannot change it.
**Depends on:** WO-167 merged (closed, v0.53.1), the fold the product 07
write-backs follow; WO-043 merged (closed, v0.17.1: supersession and
deferral are typed entries); WO-026 merged (the index; satisfied at
`v0.5.2`). The dated planning deferral until WO-053 is met: WO-053 passed
final review on 2026-09-18 (closed, `v0.29.3`).
**Recommended placement:** position 11 of the serial queue (the operator
keeps core's next thirty orders serial; planning document §12.4), after
WO-183 and before WO-091: the queued orders whose output it reads land
first. WO-080 (position 4) adds the `**Workstream:**` field the allowlist
admits, WO-192 (position 6) adds the `drive:` row the phrase check leaves
unjudged, WO-083 (position 7) appends a capability section the fold takes,
and WO-207 (position 8) ships the upgrade-order template through which an
instance takes this order's move. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "closed at v0.53.1; the fold this order's product 07 write-backs follow"
  },
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "documentation structure is not the product bottleneck",
    "until": "WO-053"
  },
  {
    "workOrderId": "WO-043",
    "relation": "hard",
    "reason": "supersession and deferral become typed entries"
  },
  {
    "workOrderId": "WO-026",
    "relation": "satisfied-by-release",
    "release": "v0.5.2",
    "reason": "the index"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Preflight before
the full gate, §Discipline (forward-only enforcement), §Documentation
freshness and ownership, §Operator-opened planning pass (the dated
observed gap; capability reassessments; receipts) and §Operator resume
phrases — how you get dispatched; 09-audit-resilience-privacy.md
§Canonical audit record;
`docs/PLAYBOOK.md` §Resume command surface; `README.md` §The repo runs on
itself; `docs/README.md` §Resuming the control loop;
`docs/planning/capability-table.md` (inventory, §Reading the table, dated
sections); `docs/verifications/README.md`, `docs/final-reviews/`,
`docs/evidence/`, `docs/control/`; `scripts/work-orders.mjs`
(`parseHeader`, `readIndex`, `renderSources`, `main`);
`scripts/lib/dependencies.mjs` (`dependencyHeader`, `UMBRELLA_LABEL`,
`umbrellaSuccessors`, the dependency refusal);
`scripts/lib/derived-contract.mjs` (`checkGeneratedSections`,
`SECTION_SETS`, `parseDerivedProvenance`);
`scripts/lib/plan-continuation.mjs` (`reassessments`,
`capabilityHistoryRepair`, `checkPlanContinuation`, the execution-record
appendix); `scripts/lib/plan-receipts.mjs`; `scripts/lib/plan-subject.mjs`;
`packages/console/src/text-sources.ts` (`CAPABILITY_HEADER`,
`parseCapabilities`); `packages/skeleton/src/loadouts/contributor.ts` and
`packages/skeleton/src/harness-host.ts` (`phraseDispatches`), read, not
edited; `scripts/resume.mjs`; `scripts/test-runner.mjs`;
`docs/control/doc-ceilings.json`, `docs/control/front-page.json`,
`scripts/docs-check.mjs` (`productContent`, `linkFailures`); WO-190 D003;
WO-189 D021 and D023; register rows FUP-0023 and FUP-0025; this order's
catalog row in the planning map (WO-157 criterion 14);
`docs/planning/outstanding-cleanup-2026-09-19.md` §4 and §5 (the holds;
WO-084's byte-identical headings); the 2026-09-28 planning document §10.1;
the planning document §12 (§12.1 and §12.6: the ledger direction). For
pass registration: `scripts/lib/plan-subject.mjs` (`planningPasses`,
`planPaths`); `scripts/lib/plan-receipts.mjs` (the receipt identity check,
`planningPassScope`, `checkPlanGate`); `scripts/lib/plan-direct.mjs`
(`latestPlanningPass`, `planJudgmentScope`); `scripts/lib/meta.mjs`
(`planningCaptures`); `scripts/refute-plan.mjs` (its subcommands);
`scripts/lineage.mjs` (`inspectLedger`, `renderIndex`);
`scripts/docs-check.mjs` (`linkFailures`, heading anchors);
`docs/lineage/idea-ledger.md` (the header; the planning-pass sections;
WO-084's migration note); `docs/lineage/README.md`;
`scripts/kit/README.client.md` §Planning in this instance;
`packages/skeleton/src/loadouts/feedback.ts` (the `decision-lineage`
unit's `sourceRefs`, read); 07-execution-guide.md §Operator-opened ideation
mode (the ledger's write rule).

**Objective:** Four planning surfaces become machine-kept. A work-order
file is the stable contract, while a state change is a control event, a
receipt lives under `docs/evidence/WO-NNN/`, judgment is a `VER-NNN` and
the release decision a `FINAL-NNN`; `index --check` enforces the allowed
fields for orders filed after the cutoff and the date rule for every order
not closed, withdrawn or historical. When a copy differs at the base,
`resume.mjs` emits the seven `resume:` phrases the compiled Contributor
declares between markers in three documents and a check refuses a stale
copy. For the planning pass that installs it, a prepared table folds each
dated capability section into the row it reassesses, carries the WO-056
reassessment's `runtime.independent-verification` row (citing WO-010,
WO-054 and WO-055), keeps the historical text behind a migration note, and
raises or lowers no level. A planning pass registers by one marker line in
its planning record, and the plan tooling finds passes there, not in the
idea ledger; the ledger's planning-pass sections move to a planning record
with their headings byte-identical, so every pass identity and every
receipt resolves as before, while entries tagged as the operator's stay in
the ledger, which now holds the operator's own ideas.

**Observed gap (restated 2026-10-13 at `main` `6dbd8771`; dated 2026-09-28
at `5f3849ec`; first observed 2026-09-08 at `33e2c25`):**

- Order files. At `6dbd8771` each of the 26 open orders carries a dated
  `**Execution plan (… observed at <commit>, <date>):**` lead and no other
  dated bold lead or heading below its title (bold-span scan, 2026-10-13);
  the 2026-09-28 rule, a date only in the observed gap's lead, would refuse
  all 26. Observed-gap leads also read `**Observed gap (restated …)**`
  (WO-080, WO-083, WO-207 in this pass's tree). The six umbrella records
  (WO-033, WO-034, WO-035, WO-036, WO-037, WO-040) carry a dated
  `**Umbrella record (YYYY-MM-DD):**` label and typed `superseded` entries
  (14, 4, 7, 1, 5 and 3); `UMBRELLA_LABEL` reads the label with or without
  its date, and the index lists them under Superseded (WO-190 D003). This
  pass files more in that form, one per committed order a merge absorbed.
  WO-035 also carries `**Redirect note (2026-09-06):**` in its leading
  header; WO-036's record links `WO-126-process-debt.md` relatively. On
  2026-09-28 open orders also carried identity updates (WO-102, WO-103,
  WO-105, WO-107), a compatibility amendment (WO-103), a scope split
  (WO-105) and a dated problem lead (WO-014); none remains at `6dbd8771`.
- `checkGeneratedSections` refuses, for generated authorities only, a
  heading outside their section set and a dated bold lead (its `[^*\n]`
  pattern misses a wrapped date), leaving the global migration to this
  order; a superseded section set stays in `SECTION_SETS` (WO-157
  criterion 14, WO-120 D007). The continuation check admits one appended
  `## Execution record` (18 closed orders carry one, no open order) and
  refuses any other edit to an order the sequence binds ("existing
  work-order bytes changed"). The dependency refusal
  (`scripts/lib/dependencies.mjs` line 283) and product 07 §Operator resume
  phrases still advise "a dated reviewed note". Since WO-190, §Sources and
  limits sits on `docs/work-orders/HISTORY.md`. On 2026-09-28 product 07 held
  188,390 of its 188,399 counted bytes; WO-167 reset that, and ceilings are
  planning's since 2026-10-07.
- Phrase list. On 2026-10-13, as on 2026-09-19, 2026-09-28, 2026-10-07 and
  2026-10-10, no copy differs: the README (§The repo runs on itself) and
  `docs/README.md` (§Resuming the control loop) list the seven `resume:`
  phrases in one order, the playbook (§Resume command surface) the same
  seven with `next` last, and product 07's table in list item 2 of
  §Operator resume phrases holds eleven rows, the seven and four routes
  (waive, withdraw, correct, `operator override: off`). The filed omission
  is not reproduced. `scripts/resume.mjs` holds no list; the phrases are
  the Contributor's role intents (seven `resume:` intents declared next,
  fix, status, times, verify, final review, release close; five `planning:`
  or `ideation:`), five mapped to lifecycle actions in `phraseDispatches`
  since release close joined (`09fe5d88`). Marker pairs grant no exemption
  (`docs/control/doc-ceilings.json`, `scripts/docs-check.mjs`); README bytes
  outside §What runs today need the `**Front page:**` field and a
  `generatedBlocks` entry in `docs/control/front-page.json`, which lists
  only the release block (WO-189 D021, D023).
- Capability table. At `6dbd8771`: 29 dated sections (ten at `33e2c25`,
  23 at `5f3849ec`, 26 on 2026-10-07), seven before §Reading the table; 30
  first-cell ids (29 on 2026-10-07). The WO-056 reassessment (2026-09-20)
  puts `runtime.independent-verification` at level 1 citing WO-010, WO-054
  and WO-055; the inventory's transports and verification rows read 0.
  Rows linking a final review: three dated and one inventory row on
  2026-09-28, five dated on 2026-10-07; §Reading the table ties no level to
  one. Levels are not typed (2026-10-07): four table shapes and a prose
  section, `harness.codex-continuation` reads "Unchanged",
  `runtime.resident` holds two live scoped levels. Between receipts a
  rewritten row fails "existing capability source changed", so a fold needs
  a new refutation receipt. `parseCapabilities`
  (`packages/console/src/text-sources.ts` line 75) accepts five headers and
  `console-docs` runs it on the live table; `CAPABILITY_HEADER` (line 61) is
  the ten-cell inventory header; `plan` and `plan-refutation-current` read
  the table under `npm run test:docs`.
- Pass registration (first observed 2026-10-13 at `6dbd8771`).
  `planningPasses` (`scripts/lib/plan-subject.mjs` line 663) registers each
  ledger `## ` heading holding a date and the words "planning pass", with
  the id `planning-` plus the first 16 hex digits of the heading's SHA-256:
  36 headings at `6dbd8771` (31 of the `— Planning pass:` form, one
  emergency pass, four older-form headings), 37 with this pass's
  registration heading. Their sections hold 3,481 of the ledger's 9,636
  lines and 304 entries, 28 of them tagged `operator-directed` or
  `operator-authorized` in their lead, in seven sections. A receipt's pass
  id is checked from its heading alone (`scripts/lib/plan-receipts.mjs`
  line 220); `planningPassScope` (line 1520) reads the ledger for the
  passes needing receipts; `scripts/lib/plan-direct.mjs` falls back to it
  in `latestPlanningPass` (line 24) and finds a pass's introduction by
  `git log -S` over it in `planJudgmentScope` (line 54);
  `scripts/lib/meta.mjs` `planningCaptures` (line 843) counts intake paths
  per ledger pass section. Apart from the generated lineage index's line
  anchors, no Markdown link points into a pass section by fragment;
  anchorless ledger links name passes in prose (the work-order map's
  NoOps of the 2026-09-16 admission pass, line 827 of this pass's tree; the
  closed WO-135). `packages/skeleton/src/loadouts/feedback.ts` line 225
  cites `#2026-09-09-emergency-process-debt-planning-pass`, an anchor that,
  by docs-check's heading slug rule, matches no heading today (inference).
  `docs/planning/resident-binding-to-active-work-2026-09-20.md` holds the
  heading `## Disposed 2026-09-21 (standard planning pass)`. The kit README
  tells an instance to record its pass in its ledger
  (`scripts/kit/README.client.md` line 123); product 07 §Operator-opened
  planning pass keeps a pass's ledger heading until this order moves
  registration; product 07 §Discipline says the ledger holds the operator's
  own ideas, while the executor, verifier and reviewer role text says it is
  for operator ideation and planning synthesis
  (`packages/skeleton/src/loadouts/contributor.ts` line 95).

**Design (scope discipline):**

- **Cutoff:** the `recordedAt` of the `WorkOrderActivated` event whose
  `workOrderPath` names `WO-088-phrase-table-single-source.md`. Without one
  (an exported instance, a fixture, an instance's own WO-088) the check does
  not run. Closed, withdrawn and historical orders are never judged or
  edited.
- **Section rule** (orders filed after the cutoff): a positive rule over
  line-start bold leads, in step 2's order; Track, Front page, Repository,
  Workstream, Execution plan and Known issues and carry-ins optional, every
  other field required, Preflight directly before Evidence gate; then at
  most one `## Execution record`. An umbrella label (`UMBRELLA_LABEL`) is
  admitted anywhere in the leading header when the typed block holds a
  `superseded` entry, outside the field order. The title is not a section.
- **Date rule** (orders in Active, Open or Superseded, and every order the
  section rule judges): a date stands only in the observed gap's lead
  (which may wrap and hold several dated observations), the execution
  plan's lead and an umbrella label. Any other dated bold lead, a dated
  heading below the title, and a section headed as a receipt or a
  reconciliation are refused. A date is read inside the whole bold span.
- An unclassifiable lead or heading is refused with path and line; an
  unreadable filing date (an uncommitted file) is reported and the section
  rule applies. Leads are exact prefixes; nothing classifies wording
  (prose-parsing screen).
- **Migration:** a dated note outside the admitted leads, in an order the
  date rule judges and the sequence does not bind, moves to its evidence
  README with its bytes kept except relative links, rewritten and listed;
  a dateless pointer is left. Umbrella labels and typed entries stay
  (WO-190 D003). A note in a sequenced order is recorded, not moved.
- Generated authorities keep `checkGeneratedSections`; a change to its set
  keeps the superseded set in `SECTION_SETS`. No edit to
  `scripts/lib/paths.mjs`, `git.mjs` or `helpers.mjs`, which every evidence
  edition registers.
- **Phrase list:** steps 7–12 run only when step 1 finds a copy whose
  phrase set differs (assumption 3). Generated bytes stand between
  markers, count against product 07's ceiling and register no exemption;
  the emitter reads the Contributor's intents, adding no second list; the
  block is a fenced list in declaration order, above the guide's table,
  whose rows stay hand-written. Criterion 4 lists the refusals; rows other
  than `resume:` rows (the four routes, WO-192's `drive:`) are not judged.
- **Fold:** a planning act. This order prepares the folded text and map
  and leaves the table unchanged; the next planning pass installs it under
  its receipt and folds later sections the same way. Each level is its
  id's latest dated assessment's, with that citation and date; none rises
  or falls, and one without a final-review citation keeps its latest
  assessment. One row per id and scope; an unplaceable section is listed
  with the reason and its rows carried unchanged. The map is a persisted
  judgment; code checks structure only.
- **Pass registration** (the ledger holds the operator's own ideas;
  planning document §12.6). A pass registers by one line
  `<!-- dotln-planning-pass: <heading> -->` in a Markdown file directly
  under the planning root, normally its planning document. The heading
  keeps today's rule (a date and the words "planning pass"), so
  `planningPasses` still derives the id and every receipt's identity check
  is unchanged. A marker rather than a heading rule, because the
  resident-binding planning document's `## Disposed 2026-09-21 (standard
  planning pass)` would otherwise register a false pass that needs a
  receipt.
- **The readers.** `planningPassScope` takes the current passes from the
  markers and still reads its exempt set from the ledger at the parent of
  `scripts/refute-plan.mjs`'s introduction (history); `latestPlanningPass`
  falls back to the markers; `planJudgmentScope` dates a pass by the first
  commit that added its marker, else by the first that added its ledger
  heading, as today; `planningCaptures` reads a pass's record from its
  marker to the next marker or the file's end.
- **The move.** `plan passes --move` moves every ledger section whose
  heading matches the rule into `docs/planning/planning-pass-sections.md`
  (new), newest first: the heading byte-identical, so ids and anchors hold
  as WO-084's migration kept them; a marker under it; the bytes kept apart
  from relative links rewritten to resolve from the planning root. An entry
  whose lead tag run carries `operator-directed` or `operator-authorized`
  (a typed tag, so no prose is classified) stays in the ledger
  byte-identical, under `## <date> — Operator entries kept from pass <id>`
  at the moved section's place, linking the moved section; the ledger
  header gains a migration note beside WO-084's. Links whose fragment
  resolved into a moved section are pointed at the record; anchorless
  links are the executor's judged list (step 21). An instance whose ledger
  holds pass headings runs the same command through an upgrade order
  (WO-207's template) when it takes this change, since the lineage check
  then refuses a pass heading in a ledger.
- **What stays.** Closed orders, evidence, verification and final-review
  reports, control records and sequenced orders stay byte-identical; their
  ledger links still resolve to the file. `feedback.ts`'s `sourceRefs`
  stays unedited, because it is a judged feedback source whose edit owes a
  live episode; the decisions file files a follow-up. The ledger's
  work-order sections stay (Non-goals).
- **Declined alternatives, recorded** (each reopens when its stated reason
  stops holding): rewriting closed orders; front matter (unselected in the
  roadmap); refusing every dated bold lead (it refuses the dated gap
  product 07 requires and every plan lead); refusing the execution-record
  appendix (the continuation check admits it); moving umbrella paragraphs
  out (the dated label is the class's header form, used by this pass's
  records); a phrase list inside `resume.mjs` (it edits `contributor.ts` and
  `harness-host.ts`, registered sources of three inventories, for a re-mint
  of each); the guide's eleven-row table generated everywhere (it carries
  guide procedure into two documents); folding in place (the plan check
  fails until a receipt judges it); one appended current-levels
  reassessment (the sections stay); reverting uncited levels to inventory
  values (an assessment); registering passes by a `## ` heading in planning
  documents (a false pass, above); a separate JSON register (a second
  record each pass must keep in step with its document); reading ledger
  headings beside the markers (a new pass could register in the ledger
  again; an instance moves with the command instead); moving the
  operator-tagged entries with their sections (the ledger holds the
  operator's own ideas); moving each section into its own planning
  document (no mechanical map from section to document); editing
  `feedback.ts`'s anchor here (a live feedback episode for one stale
  reference).

**Execution plan (the executor follows these steps in order; observed at `6dbd8771`, 2026-10-13):**

1. `docs/evidence/WO-088/README.md` (new): record the base. `git rev-parse
   HEAD`; (a) the four phrase copies, found by their phrases, each with its
   set and order; (b) `grep -c -E '^## WO-[0-9]{3} dated (addition|reassessment) \(' docs/planning/capability-table.md`
   (29 at `6dbd8771`) and the first-cell id set (30); (c) a bold-span date
   scan of every order under Active, Open or Superseded, naming each dated
   lead and heading by path and line and whether `docs/planning/sequence.md`
   binds the order; (d) the planning passes: each heading `planningPasses`
   reads from `docs/lineage/idea-ledger.md` with its date, id, line span and
   entry count, the entries whose lead tag run carries `operator-directed`
   or `operator-authorized`, every Markdown link whose fragment resolves
   into a pass section, and every anchorless ledger link in a planning
   document, the map, a product document or an open order that names a
   pass; (e) whether the executor's role text
   (`packages/skeleton/src/loadouts/contributor.ts` line 95 at `6dbd8771`;
   WO-192 edits that text earlier in the queue) still says the ledger is
   for planning synthesis. If no copy's set differs from the seven intents,
   skip steps 7–12 and record criterion 4 unmet under assumption 3; if (e)
   finds no such sentence, skip step 22. Check: the recorded output.
2. `scripts/work-orders.mjs`: export `ORDER_LEADS`, exact line-start
   prefixes in order: `**Model:**`, `**Effort:**`, `**Track:**`, `**Front page:**`,
   `**Release classification:**`, `**Cost:**`,
   `**Nomination provenance:**`, `**Depends on:**`,
   `**Recommended placement:**`, `**Repository:**`, `**Workstream:**`,
   `**Cites (read these sections):**`, `**Objective:**`,
   `**Observed gap (`, `**Design (scope discipline):**`,
   `**Execution plan (`, `**Deliverables:**`,
   `**Acceptance criteria (all required)**`, `**Preflight:**`,
   `**Evidence gate:**`, `**Write-back duty:**`,
   `**Known issues and carry-ins:**`, `**Non-goals:**`,
   `**Operator-review assumptions**`; the date-bearing `**Observed gap (`
   and `**Execution plan (`; the heading `## Execution record`. Import
   `UMBRELLA_LABEL` and `umbrellaSuccessors`. Export
   `orderContractCutoff(root)` and
   `orderContractFindings(markdown, path, { sectionRule })` returning
   `{ path, line, reason }`; skip authorities where `parseDerivedProvenance`
   is non-null; do not copy `checkGeneratedSections`'s date pattern
   (`scripts/lib/derived-contract.mjs` line 127). In `main`'s `--check`
   (line 834), after `readIndex` (line 861), run it over the index rows: the
   date rule for Active, Open and Superseded, the section rule too for
   orders filed after the cutoff (filing date: the earliest
   `git log --diff-filter=A --format=%cI -- <path>`). Throw
   `<path>:<line>: <reason>` for every finding. Check:
   `node scripts/work-orders.mjs index --check` names WO-035's redirect note
   until step 6.
3. `scripts/work-orders.mjs` `renderSources` (line 703): an "Order contract"
   bullet (cutoff, both rules, the three date-bearing leads), rendered on
   `docs/work-orders/HISTORY.md`. Check: `npm run work-orders -- index`.
4. `scripts/test-work-orders.mjs`: one `check(...)` per criterion-1
   refusal; passing fixtures for a two-line observed-gap lead with two dated
   observations, a dated plan lead, a trailing `## Execution record`,
   `**Preflight:**` before `**Evidence gate:**`, and a dated umbrella label
   with typed entries; an unreadable filing date; a control without this
   order's activation (not judged). Bind the rule with a WO-088 activation
   segment naming this order's file. Check:
   `npm test -- --only work-orders-fixtures`.
5. Keep passing, unedited, the tests that run `index --check` over fixture
   orders (first calls at `6dbd8771`: `scripts/test-derived-orders.mjs` 157,
   `scripts/test-harness.mjs` 433, `scripts/test-plan-refutation.mjs` 4225,
   `scripts/test-portfolio.mjs` 432, `scripts/test-process-debt.mjs` 2991,
   `scripts/test-work-orders.mjs` 362): a cutoff read from each fixture's
   control leaves the check inactive there, where a constant cutoff would
   refuse them all; a fixture whose control holds this order's activation
   is named in the decisions file with the rule it meets. Check: `npm test -- --only derived-orders`,
   `--only harness-fixtures`, `--only plan-refutation`, `--only portfolio`,
   `--only process-debt`.
6. `docs/work-orders/WO-035-documentation-structure-reset.md` and
   `docs/evidence/WO-035/README.md` (new), plus each unsequenced order step
   1(c) lists: move each dated note outside the admitted leads (at
   `6dbd8771`, WO-035's redirect note) with its bytes kept, relative links
   rewritten; leave a dateless pointer; keep the umbrella label and typed
   entries where `umbrellaRecord` reads them. Check:
   `npm test -- --only index`; `npm test -- --only docs-check`
   (`linkFailures`); `git diff --stat <base> -- docs/work-orders/` lists only
   the migrated orders and the two generated pages.
7. `scripts/lib/phrase-list.mjs` (new): `PHRASE_MARKER =
   "dotln-resume-phrases"`, `phraseStart`, `phraseEnd`, `PHRASE_FILES`
   (`README.md`, `docs/PLAYBOOK.md`, `docs/product/07-execution-guide.md`),
   `resumeIntents(roles)` (intents starting `resume: `, in declaration
   order; decided 2026-10-07), `renderPhraseList(intents)`,
   `phraseListFindings(root, { roles })`, `writePhraseList(root, { roles })`;
   the exact-pair rule modelled on `historyBlock`
   (`scripts/lib/release-history.mjs` line 159); roles from
   `contributorRoles` in `packages/skeleton/dist/src/loadouts/contributor.js`;
   guide rows from the mdast `table` node of the parser
   `scripts/docs-check.mjs` imports (line 33), the first cell exactly one
   `inlineCode` node. Check: step 9.
8. `scripts/resume.mjs` `run` (line 1117): branch `phrases --write|--check`
   before `reportHarnessRuntime` (line 1167) and `readControl` (the body sits
   in `scripts/lib/` because `findLaunchpad()` runs at import, line 133).
   Check: `node scripts/resume.mjs phrases --check` fails before step 10 and
   passes after.
9. `scripts/test-phrase-list.mjs` (new): one case per criterion-4 refusal,
   each named for it, plus "WO-088 list equals the Contributor's seven
   resume intents", "leaves other rows unjudged" and "write changes only
   bytes between markers". Check: `node --test scripts/test-phrase-list.mjs`.
10. Write the pairs: product 07 §"## Operator resume phrases — how you get
    dispatched" (at column 0 after the opening paragraph, outside list item
    2); `docs/PLAYBOOK.md` §"## Resume command surface" and `README.md`
    §"## The repo runs on itself" (each list becomes the pair);
    `docs/control/front-page.json` `generatedBlocks` (`start`, `end`,
    `writer` `node scripts/resume.mjs phrases --write`); `docs/README.md`
    §"## Resuming the control loop" (one line linking
    `PLAYBOOK.md#resume-command-surface`); then
    `node scripts/resume.mjs phrases --write`. Check:
    `node scripts/resume.mjs phrases --check`;
    `npm test -- --only docs-check`.
11. `scripts/test-runner.mjs`: rows
    `node("phrase-list", "scripts/resume.mjs", { args: ["phrases", "--check"], document: true, needsBuild: true })`
    and
    `nodeTests("phrase-list-fixtures", "scripts/test-phrase-list.mjs", { document: true })`,
    each with `protects` (`scripts/test-runner.test.mjs` line 1081). Check:
    `npm test -- --only runner-fixtures`.
12. `scripts/lib/document-gate-stubs.mjs`: add `resume.mjs` and
    `test-phrase-list.mjs`. Check: `npm test -- --only registrations`.
13. `docs/evidence/WO-088/fold-map.json` (new): per dated heading `heading`,
    `line`, `workOrderId`, `date`, `ids`, `placement` (`folded` or
    `unplaced`), `reason`; per id and scope `id`, `sourceHeading`,
    `sourceLine`, `levelCell` (verbatim), `level` (0 to 3 or null), `scope`
    (verbatim or null), `citations` (verbatim targets), `lastChange`; a cell
    with no source reads `unknown` (decided 2026-10-07). Check: step 14.
14. `docs/evidence/WO-088/check-fold-map.mjs` (new evidence script, after
    WO-112's `preflight.mjs`): every dated heading at the base appears once;
    the ids equal the first-cell set `scripts/lib/plan-subject.mjs` reads;
    each `sourceHeading` is the last section holding its id; each
    `levelCell` is a byte substring of its source row. Check:
    `node docs/evidence/WO-088/check-fold-map.mjs <base>`.
15. `docs/evidence/WO-088/capability-table-folded.md` (new): first line
    `# Capability table v1`; Evidence boundary, Selected progression policy
    and Reading the table byte-identical to the base; the inventory under the
    exact `CAPABILITY_HEADER`, one row per id and scope, no other table
    header; a migration note naming and linking the base commit (decided
    2026-10-07). Check:
    `node --input-type=module -e 'import { parseCapabilities } from "./packages/console/dist/src/text-sources.js"; import { readFileSync } from "node:fs"; console.log(parseCapabilities(readFileSync("docs/evidence/WO-088/capability-table-folded.md", "utf8")).length)'`
    prints the row count; `git diff --exit-code <base> --
    docs/planning/capability-table.md`.
16. `scripts/lib/plan-passes.mjs` (new): `PASS_MARKER`
    (`dotln-planning-pass`); `planningPassRecords(root, { revision })`,
    reading every Markdown file directly under the planning root
    (`docRelative(root, "planning")`, never a literal) and returning
    `{ heading, date, id, path, line }` per marker, the id from
    `planningPasses` applied to `## <heading>` (`scripts/lib/plan-subject.mjs`
    line 663, unchanged, so the receipt identity check at
    `scripts/lib/plan-receipts.mjs` line 220 resolves as before); a heading
    registered twice, or one without a date or the words "planning pass",
    refuses; `passSection(root, record)`, the text from a marker to the next
    or the file's end; `movePassSections(root)` per the Design. Check:
    `plan-refutation`.
17. The readers, per the Design: `scripts/lib/plan-receipts.mjs`
    `planningPassScope` (line 1520); `scripts/lib/plan-direct.mjs`
    `latestPlanningPass` (line 24) and `planJudgmentScope` (line 54);
    `scripts/lib/meta.mjs` `planningCaptures` (line 843). Check:
    `plan-refutation`, `process-debt`, `meta`.
18. `scripts/refute-plan.mjs`: `plan passes` prints each registered pass
    (id, date, heading, record path); `plan passes --move` runs
    `movePassSections`, refusing on a dirty tree or on a destination whose
    content differs from what the move would write; a second run, with no
    pass heading left in the ledger, changes nothing. Check:
    `plan-refutation`.
19. `scripts/lineage.mjs` `inspectLedger` (line 26): a dated heading
    holding the words "planning pass" is an error naming its line ("a
    planning pass registers in its planning record"); the kept-entry heading
    passes. Check: `lineage-fixtures`.
20. Fixtures. `scripts/test-plan-refutation.mjs`: the cases that append a
    ledger pass heading (from line 190) register by marker in a planning
    document instead; new cases: a fixture ledger with receipted passes,
    moved, keeps every id, every receipt valid and `latestPlanningPass`
    unchanged; a doubled marker refuses; a planning document's `## `
    heading holding a date and "planning pass" registers nothing; a second
    `--move` changes nothing. `scripts/test-process-debt.mjs`: the
    `planningCaptures` fixture (lines 6264 to 6298) reads a record.
    `scripts/test-lineage.mjs`: the new refusal and the kept-entry heading.
    `scripts/test-launchpad-planning.mjs` (line 222): an instance's pass
    registers by marker in its planning document, and an instance whose
    ledger holds a pass heading runs `plan passes --move` and keeps its
    receipt chain. Check: `plan-refutation`, `process-debt`,
    `lineage-fixtures`, `launchpad-planning`.
21. The move here: `npm run plan -- passes --move`;
    `node scripts/lineage.mjs index`; then each anchorless link step 1(d)
    listed, in a planning document, the map, a product document or an open
    order the sequence does not bind, points at the record; every other
    record keeps its bytes. The decisions file lists each rewritten and
    each left link. Check: `npm run plan -- passes` lists step 1(d)'s ids;
    `npm run plan -- check` (`plan`); `plan-refutation-current`;
    `node scripts/lineage.mjs index --check` (`lineage`); `docs-check`
    (`linkFailures`).
22. Only when step 1(e) found it: in `contributor.ts` line 95, the sentence
    that the ledger is for operator ideation and planning synthesis says
    instead that it holds the operator's own ideas and that a planning pass
    registers in its planning record; `npm run build`;
    `node scripts/harness.mjs emit`; the deterministic re-mints of the
    authority, feedback and harness editions it stales. Check: `harness`,
    `harness-context`, `authority-evidence`, `feedback-evidence`,
    `harness-evidence`.
23. Write-backs: product 07 §"## Discipline" (the five surfaces, the allowed
    fields with Preflight and the umbrella label, the date rule, in place;
    beside WO-084's migration, this order's move under the ledger rule);
    product 07 §"## Operator-opened planning pass" (the standard-artifacts
    item: a planning pass registers by its marker in its planning document,
    and the ledger takes an ideation batch's section only; the clause
    keeping a ledger heading until this order goes);
    `docs/work-orders/TEMPLATE.md` (the allowed fields in order, a
    `**Preflight:**` line, `**Operator-review assumptions**` as the check
    reads it); `scripts/kit/README.client.md` §"## Planning in this
    instance" (line 123: the pass registers by marker in its planning
    document; an instance whose ledger holds pass headings takes the move
    through an upgrade order); the ledger header (the migration note). Check:
    `npm test -- --only docs-check`; `npm test -- --only launchpad`.
24. `npm run work-orders -- index` regenerates `docs/work-orders/README.md`
    and `docs/work-orders/HISTORY.md`. Check: `npm test -- --only index`.
25. `docs/evidence/WO-088/decisions.md` (new): the phrase route; the cutoff
    and filing-date sources; the allowlist and date-bearing leads; moved
    and recorded notes and rewritten links; one decision per unplaced
    section and per scoped-level choice; a follow-up for the dependency
    refusal's advice (`scripts/lib/dependencies.mjs` line 283) and product
    07's matching sentence; the registration form, each moved section, each
    kept entry and each rewritten or left link; a follow-up for
    `feedback.ts`'s ledger anchor; then `npm run meta`. Check:
    `npm test -- --only meta`.
26. `node scripts/check-publication.mjs --print-locks`, then each
    `Source lock:` it reports (`docs/publication/software-engineer-toc.md`
    among them); `npm run publication:check`. Check:
    `npm test -- --only publication`.
27. Handoff sequence: `npm run format`; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-088/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the order-contract check and fixtures; the migrated
notes and pointers; the phrase emitter, markers and check when step 1
routes to them; the prepared folded table, fold map and check; pass
registration, its readers, `plan passes [--move]`, the lineage refusal,
the moved sections, the kept entries and the pointed links; the role-text
sentence when step 1 routes to it; the write-backs below.

**Acceptance criteria (all required)**

1. The check runs in `index --check` once this order's activation sets the
   cutoff. For an order filed after the cutoff it refuses, naming path and
   line, each fixture: a bold lead holding a date outside the observed
   gap's, the execution plan's and an umbrella label; a heading below the
   title holding a date; a section headed as a receipt or a
   reconciliation; a lead outside the allowed set, an unclassifiable one
   included; a required field missing, `**Preflight:**` among them; the
   fields out of order, `**Preflight:**` anywhere but directly before
   `**Evidence gate:**` among them; a dated umbrella label without a typed
   `superseded` entry. For an Open order filed before the cutoff it refuses
   a dated lead outside the three and passes an older-form order without
   one. It passes a fixture in the allowed set whose observed-gap lead wraps
   over two lines with two dated observations, whose plan lead holds its
   date, and which ends in one `## Execution record`, and an umbrella record
   holding `**Umbrella record (YYYY-MM-DD):**` with typed `superseded`
   entries. An unreadable filing date is judged as filed after the cutoff; a
   control with no activation of this order's file is not judged. The
   criterion is judged against the declared set; a case outside it is a
   follow-up, not a failure.
2. After migration no order the date rule judges at the activation base
   holds a dated note outside the three leads: each moved note is in its
   evidence README, byte-identical apart from relative links rewritten to
   resolve there and listed in the decisions file, with a dateless pointer
   left; umbrella labels and typed entries stay in their leading headers. A
   note in an order the sequence binds is recorded, not moved, and this
   criterion is then unmet until a planning pass amends that order. The
   executor lists the notes it moved and recorded, measured at its base.
3. Closed, withdrawn and historical orders, and every order the sequence
   binds, are byte-identical to the activation base.
4. When step 1 finds a copy whose phrase set differs from the seven
   `resume:` intents the compiled Contributor declares, the emitter's list
   is byte-identical between the markers in the README, the playbook and
   product 07 and equals those intents in declaration order; the check
   refuses, each naming the file, a copy changed between its markers, a
   missing or doubled marker, an unreadable file, a guide `resume:` row for
   a phrase the list lacks and a listed phrase with no row, and judges no
   other row; `docs/README.md`'s copy is a one-line pointer; the front-page
   record lists the block. When step 1 finds none, steps 7–12 change
   nothing, the evidence README records the four copies at the base, and
   this criterion is recorded unmet under assumption 3. Judged against the
   declared set; a case outside it is a follow-up, not a failure.
5. `docs/evidence/WO-088/capability-table-folded.md` holds one row per
   capability id and scope present at the base, each with the level,
   citation and `Last change` of that id's latest dated assessment, and the
   prior text under a migration note naming the base commit; the
   `runtime.independent-verification` row carries the WO-056 assessment. No
   folded level differs from the latest dated assessment of its id and
   scope.
6. `docs/evidence/WO-088/fold-map.json` lists every dated section at the
   base by heading with the row that now carries it; an unplaceable section
   is listed with the reason and its rows carried unchanged;
   `check-fold-map.mjs` passes against the base.
7. `docs/planning/capability-table.md` is byte-identical to the base, and
   the prepared file names that base and the sections it folds.
8. Pass identities hold. After the move, `npm run plan -- passes` lists
   exactly the passes `planningPasses` read from the ledger at the
   activation base, with the same ids, dates and headings; every receipt
   under the refutations root still validates, and `npm run plan -- check`
   and `plan-refutation-current` pass. In fixtures, a ledger with receipted
   passes, moved, keeps every id, every receipt valid and the latest pass
   unchanged; a doubled marker refuses; a planning document's `## `
   heading holding a date and "planning pass" registers nothing; a pass
   registered only by its marker is found, judged and dated.
9. The ledger holds the operator's own ideas. It holds no heading with a
   date and the words "planning pass", and `inspectLedger` refuses one;
   each moved section stands in `docs/planning/planning-pass-sections.md`,
   newest first, its heading byte-identical with a marker under it and its
   bytes kept apart from relative links rewritten to resolve there; each
   entry whose lead tag run carries `operator-directed` or
   `operator-authorized` stays in the ledger byte-identical under a dated
   kept-entry heading at its section's place, linking the moved section;
   the ledger header records the migration; `lineage index --check`
   passes; `meta` reports the same planning captures per pass as at the
   base; a second `--move` changes nothing.
10. Links. No Markdown link docs-check judges fails (`linkFailures`); every
    link whose fragment resolved into a moved section resolves into the
    record; each anchorless link step 1(d) listed is pointed at the record
    or listed as left, with its reason, in the decisions file; closed
    orders, evidence, verification and final-review reports, control
    records and sequenced orders are byte-identical to the base.
11. Write-backs land, each in place with no dated paragraph: product 07
    §Discipline (the five surfaces, the allowed fields with Preflight and
    the umbrella label, the date rule; this order's move beside WO-084's
    under the ledger rule); product 07 §Operator-opened planning pass (a
    pass registers by its marker; the ledger takes ideation only);
    `docs/work-orders/TEMPLATE.md`; `docs/work-orders/HISTORY.md` §Sources
    and limits, generated; the kit README §Planning in this instance; the
    ledger header's migration note; when criterion 4's emitter is built,
    product 07 §Operator resume phrases — how you get dispatched gains the
    markers and list (WO-192 writes that section earlier in the queue);
    when step 1(e) found it, the role-text sentence; the decisions file
    with `npm run meta`; the publication locks refreshed.
12. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
    clean; no new dependency. No live feedback episode is owed; the
    authority, feedback and harness re-mints are owed only when step 22
    ran, and are then recorded.

**Preflight:** `npm test -- --only work-orders-fixtures`,
`npm test -- --only index`, `npm test -- --only harness-fixtures`,
`npm test -- --only process-debt`, `npm test -- --only plan-refutation`,
`npm test -- --only derived-orders`, `npm test -- --only portfolio` and
`npm test -- --only configuration-root` for steps 2–5;
`npm test -- --only index` and `npm test -- --only docs-check` for step 6;
`npm test -- --only resume`, `npm test -- --only harness-probe`,
`npm test -- --only harness-fixtures`, `npm test -- --only process-debt`
and `npm test -- --only configuration-root` for steps 7–9;
`npm test -- --only docs-check` for step 10;
`npm test -- --only runner-fixtures` for step 11;
`npm test -- --only registrations` for step 12;
`npm test -- --only plan`, `npm test -- --only plan-refutation-current` and
`npm test -- --only console-docs` for steps 13–15;
`npm test -- --only plan-refutation`, `npm test -- --only process-debt`,
`npm test -- --only meta` and `npm test -- --only configuration-root` for
steps 16–18; `npm test -- --only lineage-fixtures` and
`npm test -- --only configuration-root` for step 19;
`npm test -- --only plan-refutation`, `npm test -- --only process-debt`,
`npm test -- --only lineage-fixtures` and
`npm test -- --only launchpad-planning` for step 20;
`npm test -- --only plan`, `npm test -- --only plan-refutation-current`,
`npm test -- --only lineage` and `npm test -- --only docs-check` for step
21; when step 22 runs, `npm test -- --only harness`,
`npm test -- --only harness-context`, `npm test -- --only harness-fixtures`,
`npm test -- --only runner-fixtures`,
`npm test -- --only authority-evidence`,
`npm test -- --only feedback-evidence` and
`npm test -- --only harness-evidence`; `npm test -- --only docs-check`,
`npm test -- --only launchpad`, `npm test -- --only index`,
`npm test -- --only meta` and `npm test -- --only publication` for steps
23–26; and `npm run test:docs` when a document changes, each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the contract and phrase fixture transcripts; the moved
and recorded notes and rewritten links; the prepared table, fold map and
check transcript; the pass lists before and after the move, the moved
sections, the kept entries and the pointed links; `npm run test:docs` (its
`index`, `docs-check`, `lineage`, `plan` and `plan-refutation-current`
suites read the changed documents, the ledger and the table);
`npm test -- --review` before `implementation-ready`, because the edited
scripts are declared sources of harness-fixtures, harness-probe,
plan-refutation, process-debt, configuration-root, runner-fixtures,
registrations, meta and launchpad-planning; again at final review. No live
row.

**Write-back duty:** as listed in criterion 11.

**Known issues and carry-ins:**

- Receipt 033 (2026-09-28), phrase list: the guide's eleven rows keep the
  waive, withdraw, correct and override-off routes, so a check rejecting
  rows outside the seven conflicts with them. Reopen when the check rejects
  a retained route as outside the list, or a route is removed to pass it.
- Receipt 033, fold: distinct `runtime.resident` assessments (one later
  row preserving WO-147's recovery judgment) must not supersede each other
  under one latest level per id. Reopen when the prepared or installed row
  drops a still-valid assessment's scope or citation, or turns the latest
  bounded level into a reassessment of all `runtime.resident` behavior.
- Receipt 033, check: the dependency refusal still advises a dated
  reviewed note, which the check rejects as a dated lead in new contracts
  and this order leaves unchanged. Reopen when a valid dependency repair
  follows that advice and then fails the index check, or an operator must
  find another recording route.
- Receipt 041 (2026-10-07), phrase list: by its own Cost line it has no
  observed cost; the copies agree, so it adds a refusing check against a
  risk unseen since 2026-09-19 (criterion 4). Reopen when a copy disagrees
  with the Contributor's intents, for example after WO-192 edits the same
  section. The 2026-10-07 pass recommended withdrawal and
  FUP-9b0632b0ec72d168 deferred it (reopen: a copy diverges, or the
  operator withdraws it); step 1 routes it.
- Receipt 041, check: it fails closed in the document gate while the
  dependency refusal advises "a dated reviewed note" (left as a follow-up),
  so one guard's advice can trip the other (criterion 1). Reopen when a
  planning pass or executor records a refusal by the check for a note
  another guard or product 07 told it to write, or guard refusals in orders
  after this one rise above the last five orders' series (5, 34, 0, 19,
  10).
- 2026-10-07 pass: corrected then: release close joined `phraseDispatches`
  (`09fe5d88`); the evidence gate names harness-probe and process-debt;
  WO-123 closed. Decided: declaration order; table rows from the mdast
  node; the `**Front page:**` field (reopen: a copy diverges); the fold a
  persisted judgment checked for structure; one row per id and scope;
  `unknown` cells; the console's five-header constraint (reopen: the parser
  accepts a new header).
- 2026-10-10 entropy pass: the front-page `generatedBlocks` entry (WO-189
  D021, D023; FUP-89e29438bd71c524, FUP-5de3c35ef3d05142); the umbrella
  label and typed entries stay in the header, or the six records become
  open work that fails coverage and activates (WO-190 D003;
  FUP-1a12e83d22825ee3).
- 2026-09-22: WO-157 criterion 14 versions the `WorkOrderIdentityAllocated`
  authority check ahead of this contract (WO-120 D007;
  FUP-a4ae3aeac59d5f9d, FUP-b727e87dbb0cf56e).
- Register: FUP-0023; FUP-0025 (WO-190 delivered the typed entries; the
  labelled paragraphs stay, assumption 6). Deferred until this order's
  activation: FUP-0109 and FUP-5d31b4cd52b01f51 (whole or split orders under
  one umbrella), FUP-0132 (WO-126 D005, change-range review).
  FUP-dc58e92c5cafc732 (WO-087 D011): the capability rows' introduction and
  the frozen historical prefix are hidden from the planning worker; the
  installing pass reviews them.
- Queue, 2026-10-13: WO-189 and WO-073 closed (2026-10-10, 2026-10-09);
  WO-075 and WO-118 closed with their sections present at `6dbd8771`;
  WO-096 and WO-091 append capability sections later, which the installing
  pass folds; the check's former placement was stale and the merge
  replaced it.
- Holds the merged orders carried, and how this order honours them:
  - The phrase part (filed as WO-088) was held by the 2026-09-19 cleanup
    pass with its gap to be re-observed (that document's §4, and §5
    decision 3: reopen when a phrase copy is observed to differ) and
    deferred since 2026-10-10 by FUP-9b0632b0ec72d168 (reopen: a copy
    diverges, or the operator withdraws WO-088). Steps 7–12 run only when
    step 1 observes a differing copy; otherwise criterion 4 is recorded
    unmet for a waiver (assumption 3), so dropping the phrase part is a
    waiver of criterion 4, not a withdrawal of the merged order. The row's
    reopening condition now names a withdrawal that would take all four
    parts; its re-disposition is planning's.
  - The fold part (filed as WO-089) was held to be rewritten as a planning
    act, since the refutation subject reads the capability rows and a fold
    is a subject change at a planning boundary (the 2026-09-19 document's
    §4). This order only prepares the fold and its map, leaves
    `docs/planning/capability-table.md` byte-identical (criterion 7), and a
    planning pass installs it under its receipt (assumption 5).
  - The same pass amended WO-084 to keep ledger headings byte-identical,
    because a receipt addresses a pass by its heading's hash; the move
    keeps every heading byte-identical (criteria 8 and 9).
- The pass count: the planning document's §12.6 counts 32 dated
  planning-pass headings (the `— Planning pass:` form, this pass's
  included); `planningPasses` matches 37 on this pass's tree, the emergency
  pass and four older-form headings included. The move takes every heading
  `planningPasses` matches.
- `packages/skeleton/src/loadouts/feedback.ts` line 225 keeps a ledger
  anchor that matches no heading (an inference from docs-check's slug
  rule); editing that judged source owes a live feedback episode, so the
  decisions file files a follow-up. Reopen when an order edits that file
  for another reason.
- The role text (`contributor.ts` line 95) says the ledger is for operator
  ideation and planning synthesis; step 22 corrects it unless WO-192, which
  edits that role text earlier in the queue, already has.
- The operator's 2026-10-13 direction also names work-order records as not
  belonging in the ledger (planning document §12.1). The ledger's dated
  work-order sections stay here (Non-goals). Reopen when a planning pass
  decides where they go.

**Non-goals:** changing any phrase; the `planning:` and `ideation:`
phrases; the procedure columns of the guide's table; new capabilities; a
level changed by assessment; a change to the continuation check; installing
the fold outside a planning pass; product-doc receipts (WO-085); front
matter; editing closed orders; an open order's older-form sections other
than its dated notes; the generated authorities' section set; the
dependency refusal's advice (a follow-up in the decisions file); moving the
ledger's work-order sections; editing `feedback.ts`; rewriting links in
closed orders, evidence, verification or final-review reports, or control
records; a separate pass register.

**Operator-review assumptions**

1. The resume script emits the vocabulary; the compiled Contributor, where
   the phrases are declared, owns it.
2. The generated block is the seven-phrase list; the guide's table stays
   hand-written and checked.
3. The phrase gap was absent on five passes (2026-09-19 to 2026-10-13). The
   executor re-observes it first; if still absent, the phrase steps are not
   run and criterion 4 is recorded unmet for a waiver, which a verifier or
   reviewer session records on the operator's captured word
   (`npm run resume -- waive`, product 07 §Operator resume phrases), never
   the operator by hand; the other outcomes stand.
4. The fold is bookkeeping, not assessment.
5. This order prepares the fold; the next planning pass installs it under
   its receipt.
6. Umbrella records keep their labelled paragraph, the class's header form
   (WO-190 D003) this pass's records use; other dated notes filed before the
   cutoff migrate here.
7. A date stands only in the observed gap's lead (product 07 requires it),
   the plan lead (every open plan names its base) and an umbrella label.
8. The execution-record appendix stays allowed; moving execution records
   would change the continuation check too.
9. An unreadable filing date is judged by the section rule.
10. The cutoff is keyed to this order's file, so an exported instance, a
    fixture or an instance's own WO-088 is not judged.
11. A planning pass registers by one marker line in its planning record,
    and the plan tooling no longer reads ledger headings for passes; the
    idea ledger holds the operator's own ideas (operator direction,
    2026-10-13).
12. An entry tagged `operator-directed` or `operator-authorized` is the
    operator's own and stays in the ledger when its planning-pass section
    moves (28 entries in seven sections at `6dbd8771`); the rest of each
    section moves with its heading.
13. The moved sections live together in
    `docs/planning/planning-pass-sections.md`, newest first, as WO-084's
    relocation kept the ledger's order.
