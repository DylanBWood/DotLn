# WO-089 — Capability table fold: the dated addenda fold into the rows they reassess in a prepared table that a planning pass installs, and the fold raises no level (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** machinery
**Release classification:** patch. One document fold with a migration note.
Assigned at activation under the standing opt-out default.
**Cost:** adds a folded capability table prepared at
`docs/evidence/WO-089/capability-table-folded.md` (one row per capability
id present at the order's base, each with the level, citation and
`Last change` of that id's latest dated assessment, the prior text kept
under a migration note) and a fold map naming every dated section and the row that
now carries it. Removes, once a planning pass installs it, the dated
sections as separate text (23 at `5f3849ec`, more at the order's base,
since orders ahead of it append sections, WO-117 and WO-095 among them)
and the reading they cost a planner. Re-mints: none; the capability table
is not a registered evidence source. It is an input of the planning
subject (`scripts/lib/plan-subject.mjs`), so its rows change only under a
new refutation receipt. Wall-clock, tokens and context bytes are unknown
until run.
**Nomination provenance:** WO-035's capability-table item, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition. Register row FUP-0023, the critical-path plan's deferred
documentation reset, is allocated to WO-084 to WO-090 by the 2026-09-19
cleanup pass, which held this order to be rewritten as a planning act.
Amended by the 2026-09-28 planning pass, which re-observed the order on
`main` at `5f3849ec`: the table's rows change only in a planning pass
because the plan check refuses a rewritten row between receipts, the
verification row the order called missing already exists, and each level
is its latest assessment's, with the gate that reads the table named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** none open. The dated planning deferral until WO-053 is
met: WO-053 passed final review on 2026-09-18 (closed, `v0.29.3`).
**Recommended placement:** last in the serial run, after WO-088, under the
2026-09-19 hold ("rewrite as a planning act") that the 2026-09-25 pass
kept (`docs/planning/outstanding-cleanup-2026-09-19.md` §4 and §5;
`docs/planning/standard-pass-2026-09-25.md` §7;
`docs/planning/sequence.md`); this amendment makes the table change a
planning pass's act. It writes `docs/evidence/WO-089/` and reads
`docs/planning/capability-table.md`, to which orders ahead of it append
dated sections (WO-117 and WO-095 among them); the fold takes every
section present at its base. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "documentation structure is not the product bottleneck",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/planning/capability-table.md` (the
inventory, §Reading the table and the dated sections: 23 at `5f3849ec`);
`docs/final-reviews/` (the verdicts some levels cite);
`scripts/lib/plan-subject.mjs` (the capability cells the subject reads);
`scripts/lib/plan-continuation.mjs` (`reassessments`,
`capabilityHistoryRepair`, the capability comparison in
`checkPlanContinuation`) and `scripts/lib/plan-receipts.mjs` (the plan
check's continuation); 07-execution-guide.md §Operator-opened planning
pass (a committed overwrite of a capability row is restored and appended
as a dated reassessment; a new receipt judges a complete committed
subject); `scripts/test-runner.mjs` (the `plan` and
`plan-refutation-current` suites);
`docs/planning/outstanding-cleanup-2026-09-19.md` §4 and §5.

**Objective:** Prepare, for the planning pass that installs it, the fold of
each dated section into the row it reassesses using the `Last change`
column; carry the WO-056 reassessment's `runtime.independent-verification`
row, which cites WO-010, WO-054 and WO-055, into the inventory; keep the
historical assessment text under a dated migration note; and promote no
level without the evidence the dated sections already cite.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The table holds a twelve-row inventory and 23 dated sections (ten at
  `33e2c25`), seven before §Reading the table and sixteen after it; orders
  ahead of this one append more.
- The row the order called missing exists: the WO-056 dated reassessment
  of 2026-09-20 assesses `runtime.independent-verification` at level 1,
  citing WO-010, WO-054 and WO-055. The inventory rows for transports and
  verification still read level 0.
- Three dated rows (WO-143's, WO-147's and WO-064's) and one inventory row
  (the walking skeleton's) link a final review; the other levels cite
  fixtures, live receipts or implementation evidence, and §Reading the
  table ties no level to a final review.
- Between planning receipts the plan check admits the table only when its
  judged bytes stay an unchanged prefix and everything after them is
  sections headed `## WO-NNN dated addition` or `dated reassessment` with
  a date; a rewritten row fails with "existing capability source
  changed", and the only admitted repair moves the changed row back into
  a dated appendix (`scripts/lib/plan-continuation.mjs`, `plan-receipts.mjs`;
  product 07 §Operator-opened planning pass). A fold is a subject change
  that needs a new refutation receipt.
- `npm test` runs product suites only; the suites that read the table,
  `plan` and `plan-refutation-current`, run under `npm run test:docs`
  (`scripts/test-runner.mjs`).

**Design (scope discipline):**

- One row per capability; the migration note preserves the prior text.
- The fold is a planning act: the table's rows change only in a planning
  pass whose refutation receipt judges the folded table. This order
  prepares the folded text and its map under `docs/evidence/WO-089/` and
  leaves `docs/planning/capability-table.md` unchanged, so the plan check
  passes on its branch; the next planning pass installs the prepared text
  under its own receipt and folds any section appended after this order's
  base the same way (operator-review assumption 2).
- Each folded level is the level of the latest dated assessment of its
  id, with that assessment's citation and date; the fold raises and
  lowers no level, and a level without a final-review citation keeps its
  latest assessment.
- A dated section the fold cannot place is listed in the map with the
  reason, and its rows are carried unchanged.
- **Declined alternatives, recorded:** folding in place on the order's
  branch (the plan check fails there until a new receipt judges the table;
  reopen if the continuation check gains an admitted fold route); one
  appended dated reassessment restating every level (the check admits it,
  but the sections stay and the table grows; reopen when a planning pass
  prefers a current-levels section to a fold); reverting a level that
  cites no final review to its inventory value (an assessment, which
  operator-review assumption 1 excludes).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

0. Base: `git rev-parse HEAD`; recount
   `grep -c -E '^## WO-[0-9]{3} dated (addition|reassessment) \(' docs/planning/capability-table.md`
   (26 on 2026-10-07, not 23; WO-075, WO-083, WO-098, WO-118 and WO-095 append more before
   this order).
1. `docs/evidence/WO-089/fold-map.json` (new; the write creates the directory): the
   executor's persisted judgment the verifier re-judges. Per dated heading: `heading`,
   `line`, `workOrderId`, `date`, `ids`, `placement` (`folded` or `unplaced`), `reason`.
   Per id: `id`, `sourceHeading`, `sourceLine`, `levelCell` (verbatim), `level` (0 to 3
   or null), `scope` (verbatim or null), `citations` (link targets verbatim), `lastChange`
   (the heading date). Levels are not a typed field in the table (four table shapes and one
   prose section; `harness.codex-continuation` reads "Unchanged"; `runtime.resident` holds
   two live scoped levels), so the fold is a judgment recorded here and code checks only
   structure (prose-parsing screen). One row per id and scope is allowed; a cell with no
   source reads `unknown` (decided 2026-10-07).
2. `docs/evidence/WO-089/check-fold-map.mjs` (new evidence script, as WO-112's
   `preflight.mjs` precedent; `scripts/` stays untouched): every dated heading at the base
   appears once; the ids equal the set `scripts/lib/plan-subject.mjs` finds in first cells of
   `|` lines (29 on 2026-10-07); each `sourceHeading` is the last section holding that id;
   each `levelCell` is a byte substring of its source row. Check:
   `node docs/evidence/WO-089/check-fold-map.mjs <base>`.
3. `docs/evidence/WO-089/capability-table-folded.md` (new): first line `# Capability table v1`;
   Evidence boundary, Selected progression policy and Reading the table byte-identical to the
   base; the inventory under the exact ten-cell `CAPABILITY_HEADER`
   (`packages/console/src/text-sources.ts` line 61), one row per id and scope; no other table
   header, because `parseCapabilities` (line 75) accepts five headers only and the
   `console-docs` suite runs it on the live table. Check:
   `node --input-type=module -e 'import { parseCapabilities } from "./packages/console/dist/src/text-sources.js"; import { readFileSync } from "node:fs"; console.log(parseCapabilities(readFileSync("docs/evidence/WO-089/capability-table-folded.md", "utf8")).length)'`
   prints the row count.
4. The migration note names the base commit; the prior text stays in Git history and the
   folded table links that commit (decided 2026-10-07).
5. `git diff --exit-code <base> -- docs/planning/capability-table.md` (criterion 3: this order
   installs nothing; a planning pass installs the fold).
6. Write-backs: `docs/evidence/WO-089/decisions.md` (new): one decision per unplaced section and
   per scoped-level choice; no product document changes.
7. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-089/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the prepared table, the fold map, the write-backs below.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-089/capability-table-folded.md` holds one row per
   capability id present in the table at the order's base, each with the
   level, citation and `Last change` of that id's latest dated
   assessment, and the prior text under a migration note naming the base
   commit; the `runtime.independent-verification` row carries the WO-056
   assessment. No folded level differs from the latest dated assessment
   of its id.
2. A fold map lists every dated section at the base, by heading, with the
   row that now carries each; a section the fold cannot place is listed
   with the reason, and its rows are carried unchanged.
3. `docs/planning/capability-table.md` is byte-identical to the order's
   base, and the prepared file names that base and the dated sections it
   folds.
4. Write-backs land: the decisions file.
5. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the prepared table and the fold map; `npm run
test:docs`, whose `plan` and `plan-refutation-current` suites read the
table; `npm test -- --review` before `implementation-ready`, because every
path under `docs/` is a declared source of the registrations suite, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- 2026-10-07 pass: stale and corrected above: 26 dated sections (seven
  before "Reading the table", 19 after); five dated rows link a final
  review; WO-117 is closed and its section present; WO-014 is last, not
  this order.
- Decided by the 2026-10-07 pass: the fold is a persisted judgment
  (`fold-map.json`) and code checks structure only (prose-parsing
  screen); one row per id and scope; `unknown` cells; the console's
  five-header constraint binds the prepared table. Reopen: the console
  parser accepts a new header.
- Blocked on WO-075, WO-083, WO-098, WO-118 and WO-095, which append
  sections before this order.

**Non-goals:** new capabilities; a level changed by assessment; a change
to the continuation check; installing the fold outside a planning pass.

**Operator-review assumptions**

1. The fold is bookkeeping, not assessment.
2. This order prepares the fold and the next planning pass installs it
   under its receipt.
