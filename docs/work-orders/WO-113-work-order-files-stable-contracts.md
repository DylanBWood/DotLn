# WO-113 — Work-order files are stable contracts: state changes live in control events, receipts in evidence directories, judgment in verifications and the release decision in final reviews, checked forward from a cutoff and migrated for the open orders (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** machinery
**Release classification:** patch. One check in the work-order tooling and
a forward-only migration of open orders' dated notes. Assigned at activation
under the standing opt-out default.
**Cost:** adds one check in `scripts/work-orders.mjs`, run by
`index --check`, over the order files filed after the cutoff (the allowed
fields in their order, a date only in the observed gap's lead, no dated
heading and no receipt or reconciliation section), with fixtures; the
move of the open orders' dated notes to their evidence READMEs with a
pointer left behind; at most 700 bytes in product 07; the generated
index's Sources and limits. Removes the dated notes open orders carry in
their files (at `5f3849ec`: six umbrella records, one redirect note, four
identity updates, one compatibility amendment, one scope split and one
dated problem lead). Re-mints: none; `scripts/work-orders.mjs`,
`scripts/lib/derived-contract.mjs` and `scripts/lib/dependencies.mjs` are
not registered evidence sources, and no source the feedback verifier
judges is edited. Wall-clock, tokens and context bytes are unknown until
run.
**Nomination provenance:** the 2026-09-08 external audit's separation rule
(the work-order file must stop becoming the execution log), restated by the
operator during the critical-path planning pass's correction; the
repository's existing homes for each surface. Planner-synthesized draft;
captures and hashes in the ledger section of that date. Opaque identifier,
not a priority. Clean-room screen: no stop condition. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the check admits the observed gap's dated lead, which product
07 requires, and the planning continuation's execution record; the
section rule binds orders filed after the cutoff; the notes to migrate
are those the open orders carry at its base, relative links rewritten;
the product 07 write-back is bounded behind WO-167; the final criterion
names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-043 merged (supersession and deferral become typed
entries, so no dated prose is needed for them; closed, v0.17.1); WO-026
merged (the index; satisfied at `v0.5.2`); WO-167 merged (closed, v0.53.1).
**Recommended placement:** in the serial run after WO-118 and before
WO-080. This order edits `scripts/work-orders.mjs` (the check), its
fixtures, the open orders' dated notes, the evidence READMEs that receive
them, product 07 §Discipline and the generated index. WO-080, the next
entry, also edits `scripts/work-orders.mjs` and writes product 07;
WO-173, earlier in the sequence, writes 07 §Discipline too. The index
reports the order dependency-ready at `5f3849ec`; the WO-167 edge holds
it until the fold lands. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
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
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "closed at v0.53.1; the fold this order's product 07 write-back followed"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline
(forward-only enforcement: a new guard binds new work; never back-fill
history; the precedence rule) and §Documentation freshness and ownership;
07-execution-guide.md §Operator-opened planning pass (the dated observed
gap each planner-synthesized draft carries); 09-audit-resilience-privacy.md
§Canonical audit record; `docs/verifications/README.md` and
`docs/final-reviews/` (the judgment and decision homes); `docs/evidence/`
(the receipt homes); `docs/control/` (the state homes);
`scripts/work-orders.mjs` (`parseHeader`); `scripts/lib/dependencies.mjs`
(`dependencyHeader`, the dependency refusal);
`scripts/lib/derived-contract.mjs` (`checkGeneratedSections`,
`SECTION_SETS`); `scripts/lib/plan-continuation.mjs` (the
execution-record appendix); `scripts/docs-check.mjs` (`linkFailures`);
the open orders carrying dated notes, listed in the observed gap; register
row FUP-0025 (the umbrella-note migration); the planning map's catalog
row for this order (WO-157 criterion 14); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Make the five surfaces machine-kept: a work-order file holds
the stable contract (title, metadata, typed dependencies, cites, objective,
gap, design, deliverables, criteria, non-goals, assumptions); a state change
is a control event; a receipt lives under `docs/evidence/WO-NNN/`;
independent judgment is a `VER-NNN`; the release decision is a `FINAL-NNN`.
A check refuses, for orders filed after the cutoff, any dated note or
receipt paragraph in the order file (a bold lead holding a date other
than the observed gap's, a heading containing a date, a "receipt" or
"reconciliation" section), and the open orders' existing dated notes move
to their evidence READMEs, verbatim apart from relative links, with a
one-line pointer; the umbrella records' prose moves beside the typed
`superseded` entries they already carry.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Open orders carry dated notes: six umbrella records (WO-033, WO-034,
  WO-035, WO-036, WO-037, WO-040), one redirect note (WO-035), four
  identity updates (WO-102, WO-103, WO-105, WO-107), one compatibility
  amendment (WO-103), one scope split (WO-105) and one dated problem lead
  (WO-014). All but WO-014's sit in the region `parseHeader` reads, from
  the title to the first heading or the `**Objective:**` lead. No open
  order holds a heading with a date, or a receipt or reconciliation
  section, below its title, and no open order still carries a retarget
  reconciliation or an ideation breakout receipt. Planning passes amend
  open orders, so the executor re-measures this set at its base.
- The six umbrella orders already carry typed `superseded` entries (14,
  4, 7, 1, 5 and 3) beside their prose records; only the prose moves.
  Register row FUP-0025 allocated the umbrella-note migration to this
  order on 2026-09-19.
- `checkGeneratedSections` already refuses, for generated authorities
  only, a heading outside their six sections and any bold lead holding a
  date, and requires typed dependencies; its comment leaves the global
  migration to this order. An allocation event carries the digest of the
  section set it was written under, and a superseded set stays in
  `SECTION_SETS` (WO-157 criterion 14, WO-120 D007).
- Product 07 §Operator-opened planning pass requires each
  planner-synthesized draft to carry a dated observed gap, and every
  order the 2026-09-28 pass wrote carries one as a bold lead that may
  wrap over two lines; a rule refusing every dated bold lead would refuse
  them all.
- The planning continuation check admits one appended
  `## Execution record` section as an order file's execution update; 18
  closed orders carry one, the latest appended on 2026-09-25 (WO-160),
  and no open order does.
- WO-036's umbrella record links `WO-126-process-debt.md` relatively;
  moved byte for byte into its evidence README, the link would name a
  missing file, which the document gate refuses.
- The dependency refusal still tells the operator to change a relation
  "in this authority file with a dated reviewed note".
- Product 07 holds 188,390 of its 188,399 counted bytes at `5f3849ec`;
  WO-167's fold resets the ceiling, and the executor re-measures it at
  its base.

**Design (scope discipline):**

- The cutoff is the activation date; closed and historical orders are never
  edited (their notes are history).
- The check is a positive rule over the order's sections; the allowed
  section set is documented in 07. The allowed fields, in this order:
  Model; Effort; Release classification; Cost; Nomination provenance;
  Depends on; Recommended placement; an optional Repository line; the
  typed dependency block; Cites; Objective; Observed gap; Design;
  Deliverables; Acceptance criteria; Evidence gate; Write-back duty;
  Non-goals; Operator-review assumptions; after them, at most the one
  `## Execution record` section the planning continuation check admits.
  Every field but the Repository line is required.
- A date stands in one bold lead, the observed gap's
  (`**Observed gap (dated …):**`, which may wrap over two lines). Any
  other bold lead holding a date, a heading below the title holding a
  date and a section headed as a receipt or a reconciliation are refused.
  The title is not a section.
- The section rule binds orders filed after the cutoff. An open order
  filed before it is judged by the date rule once its notes have moved;
  its other older-form sections stay, as the guide's forward-only rule
  keeps history.
- A lead or heading the check cannot classify is refused with the path
  and the line; an order whose filing date the check cannot read is
  judged as filed after the cutoff.
- Each moved note keeps its bytes except relative links, which are
  rewritten to resolve from the evidence directory; the decisions file
  lists each rewritten link. The pointer left in the order holds no date.
- The umbrella records' prose moves beside the typed `superseded` entries
  the six orders already carry; the migration is this order's by register
  row FUP-0025.
- Generated authorities keep `checkGeneratedSections` and their section
  set; a change to that set keeps the superseded set in `SECTION_SETS`, so
  historical allocation events still fold (WO-157 criterion 14; the
  planning map's catalog row for this order).
- **Declined alternatives, recorded:** rewriting closed orders; a front-matter
  migration (unselected in the roadmap); refusing every dated bold lead, as
  the generated authorities' check does (it would refuse the dated
  observed gap product 07 requires of every planner-synthesized draft;
  reopen when product 07 stops requiring one); refusing the
  execution-record appendix (the planning continuation check admits it as
  an order's one execution update, so the two checks would contradict
  each other; reopen when that check stops admitting it).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `scripts/work-orders.mjs`: export `ORDER_LEADS`, the exact allowlist of line-start bold
   leads in order: `**Model:**`, `**Effort:**`, `**Track:**`, `**Front page:**`,
   `**Release classification:**`, `**Cost:**`, `**Nomination provenance:**`,
   `**Depends on:**`, `**Recommended placement:**`, `**Repository:**`,
   `**Workstream:**`,
   `**Cites (read these sections):**`, `**Objective:**`, `**Observed gap (dated `,
   `**Design (scope discipline):**`, `**Execution plan (`, `**Deliverables:**`,
   `**Acceptance criteria (all required)**`, `**Evidence gate:**`, `**Write-back duty:**`,
   `**Known issues and carry-ins:**`, `**Non-goals:**`, `**Operator-review assumptions**`
   (`Track`, `Front page`, `Repository`, `Workstream`, `Execution plan` and
   `Known issues and carry-ins` optional); the only heading below the H1 is the literal `## Execution record`. Export
   `orderContractCutoff(root)` (this order's `WorkOrderActivated.recordedAt` in the
   launchpad's control; absent, the section rule is inactive) and
   `orderContractFindings(markdown, path, { sectionRule })` returning `{ path, line, reason }`;
   skip authorities where `parseDerivedProvenance` (`scripts/lib/derived-contract.mjs` line
   71) is non-null, which keep `checkGeneratedSections`. A bold lead's date is read inside the
   bold span only, letting the span wrap lines (`checkGeneratedSections`, line 127, does this;
   a `[^*\n]` regex misses a wrapped date). In `main`'s `--check` (line 681) after
   `readIndex` (line 691), run it over `workOrderAuthorityFiles(root)` (`scripts/lib/paths.mjs`
   line 74): the date rule for open orders, the full rule for orders filed after the cutoff
   (filing date = the earliest `git log --diff-filter=A --format=%cI -- <path>`; an
   uncommitted file reads unreadable and is reported, not refused); throw
   `<path>:<line>: <reason>`. Nothing classifies heading or lead wording (prose-parsing screen).
2. `renderSources` (line 589): add an "Order contract" bullet.
3. `scripts/test-work-orders.mjs`: one `check(...)` case per criterion-1 fixture, a passing
   fixture with a two-line gap lead and one `## Execution record`, and one with an unreadable
   filing date; bind the rule by writing a WO-113 activation segment in the fixture. Check:
   `bash scripts/test-work-orders.sh` (`work-orders-fixtures`).
4. Keep passing, unedited, the six tests that run `index --check` over minimal fixture orders
   (`scripts/test-derived-orders.mjs` line 157, `scripts/test-harness.mjs` 428,
   `scripts/test-plan-refutation.mjs` 3752, `scripts/test-portfolio.mjs` 430,
   `scripts/test-process-debt.mjs` 2989, `scripts/test-work-orders.mjs` 326): a cutoff read
   from each fixture's control leaves the rule inactive there; a constant cutoff would refuse
   them all.
5. Migration (re-scan at the base with a bold-span date scan of every open order): create
   `docs/evidence/WO-033/README.md` and the five others (WO-034, WO-035, WO-036, WO-037,
   WO-040); move each `**Umbrella record (...)**` paragraph and WO-035's
   `**Redirect note (2026-09-06):**` byte for byte; rewrite WO-036's
   `[WO-126](WO-126-process-debt.md)` to `../../work-orders/WO-126-process-debt.md`; leave a
   dateless pointer. These six orders are not in the sequence, so plan continuation does not
   bind them. Check: `npm run test:docs` (`docs-check` `linkFailures`).
6. `git diff --stat <base> -- docs/work-orders/` lists only the six orders and `README.md`
   (criterion 3).
7. Write-backs: product 07 §"## Discipline" (the five surfaces, the allowed fields and the
   date rule, in place); `docs/work-orders/README.md` §"## Sources and limits" (regenerated by
   `npm run work-orders -- index`); `docs/evidence/WO-113/decisions.md` (the cutoff and
   filing-date sources, the allowlist, the moved notes, the rewritten link, a follow-up for
   `scripts/lib/dependencies.mjs` line 258); `npm run meta`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-113/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the check, the migration, the pointers, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. The check runs in `index --check`. For an order filed after the cutoff
   it refuses, naming the path and the line, each of these fixtures: a
   bold lead holding a date other than the observed gap's; a heading below
   the title holding a date; a section headed as a receipt or a
   reconciliation; a lead outside the allowed set, an unclassifiable one
   included; a required field missing; the fields out of order. It passes
   a fixture in the allowed set whose observed-gap lead wraps over two
   lines and which ends in one `## Execution record` section. A fixture
   whose filing date the check cannot read is judged as filed after the
   cutoff. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
2. After migration, every open order at the activation base holds no
   dated note (the observed gap's lead is not a note): its dated notes are
   in its evidence README, each byte-identical apart from relative links
   rewritten to resolve there, each rewrite listed in the decisions file,
   and a pointer holding no date is left in the order; the umbrella
   records' prose is in their evidence READMEs beside the typed
   `superseded` entries the orders already carry. The executor lists the
   notes it moved, measured at its base.
3. Closed and historical orders are byte-identical to the activation base.
4. Write-backs land, each in place with no dated paragraph: 07 §Discipline
   (the five surfaces, the allowed fields and the date rule, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass)); `docs/work-orders/README.md` Sources and
   limits (generated, through `scripts/work-orders.mjs`); the decisions
   file; the publication locks refreshed. WO-072, WO-073, WO-080, WO-188, WO-189, WO-190, WO-192 and WO-193
   also write product 07.
5. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the list of moved notes and
rewritten links; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `scripts/work-orders.mjs` is a declared
source of harness-fixtures and process-debt, and again at final review.
No live row.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** product-doc receipts (WO-085); front matter; editing closed
orders; an open order's older-form sections other than its dated notes;
the generated authorities' section set; the dependency refusal's advice
to add a dated reviewed note (`scripts/lib/dependencies.mjs`), recorded
as a follow-up in the decisions file.

**Operator-review assumptions**

1. The umbrella records this pass added are the last dated notes filed
   before the cutoff; they migrate here.
2. A date stands in an order file only in the observed gap's lead,
   because product 07 requires a dated observed gap.
3. The execution-record appendix the planning continuation check admits
   stays allowed; moving execution records to evidence would change that
   check as well, which this order does not do.
4. An order whose filing date the check cannot read is judged by the full
   rule, which admits nothing the rule would refuse.
