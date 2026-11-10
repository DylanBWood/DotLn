# WO-270 — An initiative is laid out before its orders are cut: a workstream document carries the layout of a multi-week effort (what exists, what is asked, the way there in phases with the work each needs and what may run side by side), a planning pass files only the next wave of orders from it, and the kit guide gives that rolling way of planning

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor high; verifier high; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. One section in the workstream template;
one sentence in the planner's text; a recipe in the kit guide; cases that
a workstream may hold planned work with no order file. No check is added.
Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/kit/workstream.template.md`, a `## Layout`
section; in `packages/skeleton/src/loadouts/contributor.ts` (the planner),
one sentence; cases in `scripts/test-work-orders.mjs` and the launchpad
planning cases; the kit guide, product 07 and the decisions. Removes
these states: an effort of twenty to sixty orders written as full order
files before its first week, about a megabyte of contract at the size of
recent orders, all of it judged by one refuter and re-judged when week
three changes the plan; an operator and a team with nowhere to read and
argue with the plan before it is orders. No recurring work is added to a
gate, a hook, a prune or a close. Tokens and wall-clock: unknown until
this order's handoff records them. Re-mints: the editions the registered sources this order edits stale,
deterministically; no file in
`FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed.
`packages/skeleton/src/loadouts/contributor.ts` is a declared source of
machinery suites, so the final criterion names `npm test -- --review`.
Steps: the executor's, below.
**Nomination provenance:** the operator's statement of 2026-11-09 that
the work instance must take a new initiative and plan the whole effort
over 4 to 16 weeks on a limited budget (ignored capture SHA-256
`b0d47c79b7177b1ba603220acaa9c9feaf219b0a59d03b074d7a0adbf48f11bb`), which
is the reopening condition of FUP-855495d77825af2b (the initiative layout
before orders are cut, recorded 2026-10-24), allocated by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-080 (closed: the workstream document and its index
grouping); WO-202 (closed: an instance's own planning pass); WO-268 (open: the area notes a layout's account of what exists links to;
this order's template names them and does not need them to exist);
WO-264 (open: it makes each shared rule a record that names its roles,
and this order's sentence is such a record naming the planner).
**Recommended placement:** eleventh, after WO-269. It is the second of the
work instance's three jobs, and it is small.
**Cites (read these sections):** `scripts/kit/workstream.template.md`;
`scripts/lib/work-order-workstream.mjs` (`parseWorkstreamDocument`, which
reads the marked block); `scripts/lib/plan-subject.mjs` (the sequence's
limit and the one-order-file rule for each entry and each separate-track
member); `scripts/lib/planning-document.mjs` (the pass document's
headings); the kit guide §Planning in this instance; product 07
§Operator-opened planning pass (order size; what a standard pass files)
and §Research and guided-operator work orders.

**Objective:** An operator hands a planning pass the description of an
initiative and gets back a layout to read, argue with and revise: what
the instance understands exists, what the initiative asks, and the way
from one to the other in phases, with the work each phase needs, what
depends on what and what can run side by side. Orders are filed from it
a wave at a time, and the layout is revised as waves land.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- There is no tier between an idea and an order. `scripts/lib/plan-subject.mjs`
  requires exactly one committed order file for every sequence entry and
  every member of a separate-track workstream, and holds a sequence to at
  most 100 orders. A workstream document has an outcome, an acceptance
  contract, rules, member orders, a dependency plan and delivery states,
  and every member it lists is a filed order.
- A filed order is a full contract. The orders this pass filed run from
  about 14 to 27 kilobytes each, with an execution plan that names files
  and functions. Sixty of them is on the order of a megabyte written
  before any is run, by a planner that has not yet seen what the first
  wave teaches.
- One refuter judges a pass's new orders. Receipt 066 judged four orders
  in nine minutes; a first pass that files a whole initiative gives one
  worker several times its useful reading.
- The need was recorded and deferred. FUP-855495d77825af2b describes the
  layout the operator and the team argue with before any order is cut,
  and names the carriers that exist: the target-scoped planning pass with
  `plan target-publish`, the research order and the workstream document.
- An instance's seeded sequence carries no rules on order size or on how
  far ahead to file.

**Design (scope discipline):**

- The layout is a section of the workstream document, which is a standing
  document: it states the plan as it stands and is revised in place. It
  holds four things in prose and plain tables: what exists, linking the
  target's area notes where there are any; what the initiative asks, in
  the instance's own words; the way there, as phases, each with the work
  it needs named as planned items that are not orders, what each depends
  on and which may run side by side; and what is unknown, with the
  research that would settle it. Planned items have no identifiers and no
  order files; an item becomes an order when a pass files it. Rejected: a
  typed block of planned items that the index and the plan check read
  (the axis is what a check can honestly judge: the layout is the part of
  planning that is argument, and a schema for it would be machinery
  before any use). Rejected: draft order files for the whole effort (the
  axis is the gap itself).
- A pass files the next wave. The planner's text says that for an
  initiative it writes or revises the layout first and files only the
  orders the next wave needs, the ones whose inputs are known; the
  refuter judges those and the sequence. The layout is published to the
  target's documentation root with `plan target-publish` when the team
  reads the plan there.
- Budget is read from the instance's own record. The layout's phases may
  carry the planner's estimate of orders and spend, taken from the usage
  report of WO-266 where the instance has orders to read; an estimate is
  a statement in a document and no check reads it.
- Nothing is enforced. The parser reads the marked block as it does
  today, and a workstream without a layout is as valid as before.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/kit/workstream.template.md`: add the `## Layout` section to
   the template with its four parts and one worked example for an
   invented outcome, and say in the page's opening that planned items
   are not member orders. Check: `npm test -- --only launchpad`.
2. `scripts/test-work-orders.mjs` and `scripts/test-launchpad-planning.mjs`:
   a case each that a workstream document carrying a layout whose planned
   items have no order file passes `npm run work-orders -- index --check`
   and `npm run plan -- check` in an instance fixture, and that an item
   added to the marked block's members without an order file is still
   refused as today. Check: `npm test -- --only work-orders-fixtures` and
   `npm test -- --only launchpad-planning`.
3. `packages/skeleton/src/loadouts/contributor.ts` (a rule record naming
   the planner): one sentence, for a dispatch that describes an initiative, to write or
   revise the workstream's layout before filing and to file only the next
   wave. Check: `npm test -- --only skeleton` and `npm test -- --only
   compiler`.
4. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §Planning in this instance (the
   rolling way: lay out, file a wave, run it, revise; where the layout
   lives and how the team reads it; that an instance sets its own rule on
   order size); product 07 §Operator-opened planning pass (the layout as
   a planning artifact of an instance);
   `docs/evidence/WO-270/decisions.md`. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the template's section and example; the two cases; the
planner's sentence; the recipe; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. A fresh export's `docs/workstreams/README.md` carries the layout
   section with its four parts and the statement that planned items are
   not member orders.
2. In an instance fixture, a workstream document whose layout names
   planned items with no order files passes `npm run work-orders -- index
   --check` and `npm run plan -- check`, and a member added to the marked
   block without an order file is refused as at the base.
3. Every installed planner root carries step 3's sentence. Check: `node
   scripts/harness.mjs check`.
4. The kit guide §Planning in this instance states the rolling way of
   planning and where the layout lives, and links this order's decisions.
   Check: `npm run test:docs`.
5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for step 1; `npm test --
--only work-orders-fixtures` and `npm test -- --only launchpad-planning`
for step 2; `npm test -- --only skeleton` and `npm test -- --only
compiler` for step 3; the structural phase; the complete run with `npm
test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-270/`: the exported page's
section; the outputs of criterion 2's four runs; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 4 and criterion 4; sources and
reopening conditions in `docs/evidence/WO-270/decisions.md`.

**Known issues and carry-ins:**

- FUP-855495d77825af2b: this order is its allocation. The back-and-forth
  mode that row calls riffing is the operator and a planning session
  revising the layout; no dispatch phrase is added for it.
- Whether the parser admits the new heading without change is read in
  step 2's cases; if it does not, the executor records the smallest
  change that admits it in the same step.
- A typed layout that the index shows (planned counts by phase) reopens
  when an instance has run two initiatives this way and the operator
  wants the view.
- The workstream page is a seed. A new export carries the layout section;
  an existing instance has its own copy of the page and meets the layout
  in the kit guide, and this order's release says in its Read before
  upgrading that the seeded page changed and where the new text is.
- An estimate of an initiative's spend is only as good as the instance's
  record of comparable orders; the layout says where its figures came
  from.

**Non-goals:** a schema for the layout or a check that reads it;
identifiers for planned items; a new dispatch phrase or mode; changing
the sequence's limit or the one-order-file rule; pacing or a budget
check.

**Operator-review assumptions:** that a layout in prose, revised in place
and argued with, is the right first form, with orders cut a wave at a
time; that the workstream document is its home because the outcome and
the rules already live there; and that the first real initiative will
show what, if anything, should become typed.
