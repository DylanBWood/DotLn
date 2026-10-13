# WO-080 — Workstreams from document to board and pilot: a launchpad holds one workstream document per outcome whose member orders declare it, the generated index and the actor board's Workstreams section group the members with repository, base, phase, verdict, integration state and staleness from one committed record, and four of product 12's demonstrations pass as automated fixtures over a real-Git launchpad with three target repositories (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor, the highest of the merged orders: the
board section is an additive `uifa-board-v1` extension in `packages/console`;
the convention, field, index projection, fixtures and evidence were patch.
No event type. Assigned at activation under the standing opt-out default.
**Cost:** adds the workstream convention and template under the configured
`workstreams` root (and the kit seed's final text), the `**Workstream:**`
field, the index grouping with a stale mark and its record of target facts,
the board's Workstreams section with one fixture case and the console's
minor release, one real-Git fixture suite with four demonstrations and its
runner row, fixtures, and the product 12, 07 and 04 and console README
write-backs (no byte figure binds them; ceilings are planning's). Removes
nothing that runs today: no workstream document, field, grouping, board
section or demonstration fixture exists. Removes, against running the three
merged orders, two order cycles (two activations, verifications, final
reviews and release closes), each with the full gate runs a cycle pays:
since receipt 044, 2.29 full runs and 61 minutes of full gate per closed
order (planning document §12). No live feedback episode or re-mint
collapses; none was owed. Wall-clock: one implementation activation longer
than any of the three alone, unknown until run; the new suite joins every
later fresh gate, so the executor records its wall-clock. Measurement
exception: beyond the one full `npm test -- --review` the Preflight
allows, step 19 pays one fresh plain `npm test -- --fresh`, timed, to read
the stand-down reversal condition (a fresh `npm test` above six minutes on
the operator's host) with the new suite included. It is a measurement, run
once after the last code edit and repeated only under product 07's rule
for a full run (a relevant change or a diagnosed invalidation, the reason
recorded), never to look again. Its cost is one fresh
run of the product rows, unmeasured at this base; the planning map's
reading of thirteen final-review product gates from 2026-09-19 to
2026-09-21 found 256 to 536 s, median 483 s (§Candidate — cold-gate
structural cuts). Context bytes: one executor
session reads the union of three orders' citations instead of three
sessions each reading its own; unknown until run. Commands: none new for the
operator; `npm run work-orders -- index` gains the grouping,
`npm run evidence:console -- --write` regenerates six cases and `npm test`
gains the `workstream-pilot` row. Tokens: unknown until run. Steps: 21 in
place of 27 (11, 10 and 6): one write-back step and one handoff in place of
three each. Re-mints: none; `scripts/work-orders.mjs`, its fixtures, the
template, the new suite, `scripts/test-runner.mjs` and every path under
`packages/console` are not registered evidence sources
(`scripts/lib/evidence-sources.mjs`); `scripts/lib/config.mjs` is a reasoned
import exclusion of every edition (same file, line 369); the release label
the console's minor writes into `package-lock.json` is normalized out of
every edition's projection (`evidenceSourceContent` in
`packages/skeleton/src/evidence-editions.mjs`; `feedbackSourceFile` in
`packages/skeleton/src/feedback-audit.ts`). An edit to `scripts/lib/git.mjs`,
`helpers.mjs` or `paths.mjs`, which every edition registers, would owe a
deterministic re-mint of each edition it stales. WO-083 depends on this
order.
**Nomination provenance:** WO-034's "workstream as a document plus
projections" item (index half), its board half and its synthetic pilot, cut
into the bounded children WO-080, WO-081 and WO-082 at the operator's
2026-09-08 correction; WO-083, the operator-witnessed real run, stays
separate. Amended by the 2026-09-28 planning pass at `5f3849ec`
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10): WO-071 had closed and product 07's headroom made WO-167 a dependency;
the staleness column states what it shows for an unreadable target and how
the committed index stays checkable; the board's fixture workstream arrives
as a new case with no schema field; the collision follows product 12's one
writer per worktree and the fixtures declare their set; write-backs are
bounded, final criteria name both gates, and FUP-0126 (the workstream
application), FUP-0050 (the synthetic pilot) and FUP-0070 (the sibling
workflow pilot) are carried. Amended by the 2026-10-13 standard pass at
`6dbd8771` ([planning document](../planning/standard-pass-2026-10-13.md)
§6): placement and gaps restated; the target facts recorded on the committed
line, reversing the 2026-10-07 decision because the board reads them there
(the consumer FUP-7d1f987c4cfbb93f's reopening names); the two-page index
(WO-190) and WO-074's kit template named; the board's return list keeps
`history` and its version starts from 0.4.2; the pilot's title, Objective,
Design and criterion name the four demonstrations its plan kept, and its
suite row declares the kit exclusion every exporting suite declares since
WO-201. Merged by the 2026-10-13 standard planning pass under the operator's
sizing direction (planning document §12): WO-081 and WO-082 are absorbed
here. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition; synthetic fixtures only.
**Depends on:** WO-072 merged (the id-to-clone mapping and target worktree
lifecycle whose Git state members report, and the target worktrees the
pilot runs; closed, v0.75.0); WO-167 merged (closed, v0.53.1); WO-071 merged
(member orders name registered repositories; closed, `v0.38.0`); WO-075
merged (a fixture launchpad exported with its build; closed, v0.72.0);
WO-032 merged (the board this order extends; closed, `v0.14.0`). No queued
order.
**Recommended placement:** position 4 of the serial queue (the operator
keeps core's next thirty orders serial; planning document §12.4), after
WO-213 and before WO-204, because WO-083 (after WO-192, before WO-207)
depends hard on its workstream convention, which the run's `WS-001` copy
follows, and on its synthetic pilot, which precedes the witnessed run.
The merge also advances the board's Workstreams section, with the
console's minor release, ahead of WO-083, which does not use it (the
receipts 041 to 044 known issue below): that board work lengthens this
activation and so delays the run. In exchange the board half pays no
order cycle of its own, one of the two cycles the merge saves overall
(planning document §12.3). This order edits `scripts/work-orders.mjs`, a new
`scripts/lib/work-order-workstream.mjs`, their fixtures, the generated
index, `scripts/kit/workstream.template.md`, `docs/workstreams/`,
`packages/console`, a new `scripts/test-workstream-pilot.mjs` with its
runner row, products 12, 07 and 04 and the decisions file. WO-088 (after
WO-183, before WO-091) also edits `scripts/work-orders.mjs` and product 07 for its
allowed-section check and lists `Workstream` in its allowed set; the Design
states how the two meet in either order. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-072",
    "relation": "hard",
    "reason": "the id-to-clone mapping and target worktree lifecycle whose Git state the members report, and the target worktrees the pilot runs from a launchpad"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "closed at v0.53.1; the fold this order's product 07 write-back followed"
  },
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "member orders name registered repositories"
  },
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "a fixture launchpad exported with its build"
  },
  {
    "workOrderId": "WO-032",
    "relation": "satisfied-by-release",
    "release": "v0.14.0",
    "reason": "the board it extends"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 12-workstream-application.md §One
workstream across repositories (two workstreams on one repository) and
§What exists and what must be proved (the six demonstrations);
02-domain-model.md §Memory and observation (Workstream); 03-architecture.md
§Ports (the source revision guard); 04-interfaces.md §Plural UI hosts, one
projection contract and §Actor board v0; 13-uifa-roles.md §UIFA showrunner;
07-execution-guide.md §Where the control plane finds its documents (the
`**Repository:**` field) and §Preflight before the full gate;
`scripts/work-orders.mjs` (`parseHeader`, `readTagSnapshot`, the `--check`
path); `scripts/lib/work-order-repository.mjs`; `scripts/lib/config.mjs`
(the `workstreams` root); `scripts/test-configuration-root.mjs`;
`packages/console/README.md` (§Contract for another UI host);
`packages/console/src/work.ts` (`projectWork`);
`packages/console/src/text-sources.ts` (`parseWorkOrderIndex`);
`packages/console/uifa-board-v1.schema.json` (the section definition);
`packages/console/fixtures/manifest.json` (the five cases and their pinned
inputs); `packages/skeleton/src/loadouts/feedback.ts` (the writer unit,
version 2); `docs/work-orders/WO-088-phrase-table-single-source.md` (the
allowed-section check); `docs/control/doc-ceilings.json`;
`docs/planning/machinery-stand-down-2026-09-15.md` §8;
`docs/planning/work-order-map.md` §Candidate — cold-gate structural cuts
(the product-gate readings the measurement exception is set against);
`docs/work-orders/WO-034-cross-repository-workstream-pilot.md` (history:
the umbrella's wording); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `docs/workstreams/WS-NNN-<slug>.md` carries the outcome,
acceptance contract, member orders (each naming repository and base), the
dependency and compatibility plan and delivery states; an order may declare
`**Workstream:** WS-NNN`; the index groups members and shows repository,
base, phase, verdict and integration state, and marks a member stale when
its declared base is no longer the target's integration base. The actor
board's Work panel gains a Workstreams section with the same columns from
the index's committed record, as an additive view-model extension whose
fixture expectations regenerate through the existing command. A real-Git
fixture builds three target repositories (service, client, documentation)
and a launchpad exported by WO-074 and WO-075; one workstream with three
member orders exercises four of product 12's demonstrations: a
single-repository task reaching closed from a target worktree (D1); a
cross-repository task whose client member proceeds against a pinned
contract fixture while the service member lands first (D2); two workstreams
on one repository, where an occupied worktree refuses a second writer (the
refusal half of D4); and a session restart in a target worktree resuming
from `resume: next` under the emitted bundle (D6). Stale marks that spread
from a source-revision change to dependent members (D3), the conflict half
of D4, an unavailable execution edge shown blocked with its manual handoff
(D5) and a workstream-level next safe action stay FUP-b28d36edaa8630b1's
candidates. No control event or schema changes.

**Observed gap, index (restated 2026-10-13 at `main` `6dbd8771`; dated
2026-09-28 at `5f3849ec`; first observed 2026-09-08 at `33e2c25`):**

- "Workstream" is vocabulary only: no workstream document is tracked and
  `scripts/work-orders.mjs` has no workstream handling, so nothing groups
  orders into an outcome.
- The configuration loader declares a `workstreams` document root (default
  `docs/workstreams`) that only the launchpad export uses: it seeds an
  instance's `docs/workstreams/README.md` from
  `scripts/kit/workstream.template.md` (`scripts/launchpad.mjs` lines 931 to
  934), whose text says the index does not yet read the field; core holds no
  document under the root, and the loader's comment (`scripts/lib/config.mjs`
  lines 29 and 30) still says the root carries no control-plane surface.
  `scripts/test-configuration-root.mjs` refuses a quoted `docs/...` literal
  in any control-plane script.
- The `**Repository:** <id> @ <base-commit>` field that member orders rely
  on shipped with WO-071 (`scripts/lib/work-order-repository.mjs`; product
  07 and product 12 describe it).
- `parseHeader` is a tolerant view that attributes an unknown header field
  instead of refusing it, and no check reads an order's sections; WO-088
  plans a positive check over them, with the allowed set documented in
  product 07.
- The index has two pages since WO-190 (v0.71.1): `README.md` holds the
  work ahead and `HISTORY.md` the settled cards, the sources and the
  release-tag record. `index --check` regenerates release rows from that
  recorded snapshot (`readTagSnapshot`, `scripts/work-orders.mjs` line 733)
  and reports newer tags without refusing, so the committed index checks on
  any host; a target's integration base is host state of the same kind.

**Observed gap, board (dated 2026-09-28, `main` at `5f3849ec`; first
observed 2026-09-08 at `33e2c25`; the last bullet observed 2026-10-13 at
`6dbd8771`):**

- The board knows orders, not outcomes: the Work panel's five sections
  (`work-order-index`, `orders`, `worktrees`, `releases`, `usage`) hold
  none that groups orders, and `workstreamId` appears in the console only
  as the event scope that keys acceptance matrices in the Actors panel.
- The Work panel turns every field line of an index row into a cell, and
  the fixture manifest pins each case's inputs by SHA-256; the `control`
  case reads the pinned `workOrderIndex` input, so a workstream added to
  that input would change that case's existing sections too.
- `uifa-board-v1.schema.json` closes every object; a section is one element
  of a panel's `sections` array, with a free-form `id`.
- The console is component `0.3.1`; since the board shipped it has gained
  the runtime-status host and the resident command client.
- Product 04 holds 59,662 bytes under a ceiling of 60,856 at `5f3849ec`;
  the executor re-measures at its base.
- At `6dbd8771` the console is `0.4.2`; the Work panel returns six
  sections (`packages/console/src/work.ts` line 308), WO-190's two index
  pages having added `work-order-history`; and the `control` case reads
  `inputs/workOrderIndex-wo190.md` and `inputs/workOrderHistory-wo190.md`,
  while `inputs/workOrderIndex.md` keeps its bytes as a retained input.

**Observed gap, pilot (restated 2026-10-13 at `main` `6dbd8771`; dated
2026-09-28 at `5f3849ec`; first observed 2026-09-08 at `33e2c25`):**

- None of the demonstrations has a fixture, and no workstream document
  exists; the index half of this order adds the convention.
- Pieces the demonstrations reuse have landed: registered targets (WO-071,
  `v0.38.0`), the target-worktree harness bundle (WO-049, `v0.25.0`), the
  first live external source change (WO-053, `v0.29.3`), the target
  publish path (WO-064, `v0.43.0`), the exported launchpad (WO-074,
  `v0.70.0`; WO-075, `v0.72.0`) and target worktrees (WO-072, `v0.75.0`:
  `worktree clone`, `worktree start`, resume through the launchpad,
  `release close` with no release).
- Since WO-201 (`v0.77.0`), a kit's `npm test` runs every suite row with no
  `kit: "core-only: <reason>"` exclusion, and each suite that exports a
  launchpad declares one (`scripts/test-runner.mjs` lines 722, 733 and
  739).
- Product 12 lets two workstreams touch one repository with one writer per
  worktree, and the writer unit refuses a second writer into an occupied
  worktree on any branch; it does not refuse two workstreams that hold
  separate worktrees.

**Design (scope discipline):**

- Staleness follows the source-revision guard's shape as a projection.
- The generator resolves the `workstreams` root through
  `scripts/lib/config.mjs`; no literal document root enters a script.
- The grouping keeps every `### WO-NNN` row of the index whole, because the
  console parses those rows (`parseWorkOrderIndex`) in its document test.
- A member's integration base and containment are read from its target
  repository's Git state. A target the generating host cannot read shows
  `unknown` in each cell that needs it, never current or stale. The index
  records the target facts it read, with the target commit it observed, in
  the grouping's JSON line on `README.md`, the page the board reads, and
  `index --check` regenerates the grouping from that record, as it
  regenerates release rows from the tag snapshot; a target whose state moved
  since is reported, not refused.
- The field needs no admission from WO-088's allowed-section check today,
  because `parseHeader` attributes an unknown field. If that check is on
  `main` at this order's base, the field joins its allowed set and the 07
  sentence that lists it in this change; if it is not, WO-088 admits the
  field when it lands. Either order works.
- The board gets one section and no new panel; the text sources it parses
  remain the pinned index text. The section is one more element of the
  Work panel's `sections` array, so the schema is unchanged; a new field on
  a view, panel, section or row would change it and is not part of this
  order.
- The fixture workstream arrives as a new board case with its own pinned
  index input. The five existing cases keep theirs, so their expected
  outputs change only by the new section: empty where the case's index
  holds no workstream grouping, `unavailable` where the case has no index
  or the adapter cannot parse the grouping, as for every other source.
- The pilot demonstrates D1, D2, the refusal half of D4 and D6 (scope
  decided by the 2026-10-07 pass's no-code screen), each one named fixture
  with its own assertion.
- The collision demonstration follows product 12: two workstreams keep
  separate worktrees of one repository. The fixture dispatches a second
  writer into the worktree the other workstream's member holds and shows it
  refused by the one-writer-per-worktree rule.
- **Declined alternatives, recorded:** a `WorkstreamOpened` event (no
  consumer needs outcome-level legality yet); re-reading each target at
  `index --check` (a host without a target's checkout would refuse a
  correct index; reopen when targets are only registered on hosts that hold
  their checkouts); a typed dependency on WO-088 (the field needs no
  admission from it; reopen if WO-088 lands a metadata set a later order may
  not extend); target facts rendered live
  and kept out of the committed index (decided 2026-10-07, reversed
  2026-10-13: step 10 reads them from the committed line, which changes
  only at an explicit `index` run, as the tag snapshot does); a separate workstream page; a workstream added to the
  `control` case's pinned index (it changes that case's existing sections;
  reopen if the pinned index is re-recorded for another reason); a live run
  here (WO-083); two workstreams writing one worktree as the whole collision
  (product 12 gives each workstream its own worktree; reopen if product 12
  changes that profile); D3, the conflict half of D4, D5 and a
  workstream-level next safe action here (the 2026-10-07 no-code screen;
  register row FUP-b28d36edaa8630b1 reopens when an order builds one).

**Execution plan (the executor follows these steps in order; steps 1 to 9
and 17 to 19 observed at `6dbd8771`, 2026-10-13, first written at
`bd437eb2`; steps 10 to 16 observed at `bd437eb2`, 2026-10-07, with steps 10,
11, 13, 15 and 16 re-observed at `6dbd8771`, 2026-10-13; the board's marker
name, field names and fixture bytes come from steps 4 and 7):**

1. `scripts/lib/work-order-workstream.mjs` (new): `parseWorkstreamDeclaration(markdown, path)`
   modelled on `parseRepositoryDeclaration` (`dependencyHeader`;
   `^\*\*Workstream:\*\*\s+(WS-\d{3})\s*$`; refuse a duplicate or malformed field). Check:
   `npm test -- --only work-orders-fixtures` (`scripts/test-work-orders.sh`).
2. `scripts/work-orders.mjs`: `parseHeader` (line 77) gains `workstream`; `readIndex` (line
   228) carries it per row. Target reads stay out of `readIndex` (called by
   `plan-receipts.mjs` and `planning-conditions.mjs`) and `parseHeader` (called by
   `plan-failures.mjs` and `plan-subject.mjs`). Check: `npm test -- --only work-orders-fixtures`;
   `npm test -- --only plan-refutation` (those callers).
3. Same file: `readTargetFacts(root, rows)`, called only by `main` without `--check`: the
   repository's `baseBranch` plus WO-072's clone map (`scripts/lib/target-worktrees.mjs`);
   `runGit(clone, [...], { raw: true })` for `rev-parse --verify refs/heads/<baseBranch>^{commit}`
   and `merge-base --is-ancestor <baseCommit> <tip>`; an unreadable target gives `unknown`.
   The facts, with the target commit observed per member, are recorded in the grouping's JSON
   line (step 4), and `index --check` regenerates the grouping from that record (step 5).
   Check: `npm test -- --only work-orders-fixtures`.
4. Same file: `renderIndex({ rows, sequence, groups = [], workstreams = [] })` (line 590)
   emits `## Workstreams` before `## Active` on `README.md`: `### WS-NNN` and one list line per
   member, never a `### WO-NNN` heading (`parseWorkOrderIndex` would read a duplicate row and
   `projectBoard` refuses duplicate targets); the grouping and its recorded target facts as one
   JSON line on `README.md`, `<!-- dotln-workstreams: {...} -->`, with members (repository,
   base, phase, verdict, integration, stale and the observed target commit) and `edges`, so
   the board (step 10) and the pilot (step 18) parse JSON and never the rendered Markdown
   (prose-parsing screen); `renderSources` (line 703, on `HISTORY.md`) "Header observation"
   names the field and the record. Check: `npm test -- --only work-orders-fixtures`;
   `npm test -- --only index`.
5. Same file, `--check`: the grouping regenerates from the recorded facts; no target is
   re-read, judged or refused. Check: `npm test -- --only index`.
6. `docs/workstreams/README.md` (new; creates the directory): the convention plus a fenced
   template; the document carries a JSON block between `<!-- dotln-workstream:start -->` and
   `<!-- dotln-workstream:end -->`:
   `{ "id", "members": [{ "workOrderId", "repositoryId" }], "edges": [{ "from", "to", "relation" }] }`;
   membership stays sourced from `**Workstream:**` and the generator refuses a differing block.
   "Integration state" is the enum `current`, `behind` (the base is an ancestor of the tip),
   `diverged`, `unknown`; stale means not `current`. Resolve the root through
   `docPath(root, "workstreams")` (configuration-root refuses `docs/...` literals); the README
   escapes the `WS-NNN-*.md` glob. In `scripts/kit/workstream.template.md`, the instance seed
   since WO-074, the paragraph saying the index does not yet read the field is replaced by
   the final convention (`scripts/kit/` is a declared source of
   `launchpad-planning`, `scripts/test-runner.mjs` line 115); the loader comment at
   `scripts/lib/config.mjs` lines 29 and 30 is corrected in place. Check:
   `npm test -- --only work-orders-fixtures`; `npm test -- --only configuration-root`;
   `npm test -- --only launchpad-planning`.
7. `scripts/test-work-orders.mjs`: `await check("WO-080 members group with repository, base,
   phase, verdict, integration state and staleness")` (`makeRepo`, `writeLog`, `commit`, a
   `dotln.config.json` with two repositories copying `authorityProfile` and
   `registeredRepository` from `scripts/test-configuration-root.mjs` lines 69 to 89, two
   target repositories, three members; each cell equals the header, the segment or
   `rev-parse`; no fixture path in the render) and `await check("WO-080 moved base stays stale
   beside a green sibling; unreadable target is unknown; --check passes with targets absent")`,
   which also reads the committed `dotln-workstreams` line's per-member fields (criterion 2).
   Check: `npm test -- --only work-orders-fixtures`.
8. If WO-088's allowed-section check is on `main` at the base, add `Workstream` to its allowed
   set. Check: `npm test -- --only work-orders-fixtures`; `npm test -- --only index`.
9. `npm run work-orders -- index`; check `npm run work-orders -- index --check` (the `index`
   row).
10. `packages/console/src/text-sources.ts`: add
    `export function parseWorkstreams(text: string): readonly TextRow[]`. Require the
    generated-index prologue as `parseWorkOrderIndex` (line 151) does; find exactly one
    `<!-- dotln-workstreams: ... -->` line: none returns `[]`, more than one throws; parse it
    with `JSON.parse` and map each member to
    `{ key: "<WS>/<WO>", line, values: { workstream, workOrder, repository, base, phase, verdict, integration, stale } }`.
    Nothing reads the rendered Markdown section (prose-parsing screen). Check:
    `npm test -- --only console`.
11. `packages/console/src/work.ts`, `projectWork` (line 81): add
    `const workstreams = ctx.section("workstreams", "Workstreams", sources.workOrderIndex, "docs/work-orders/README.md", (text, ref) => parseWorkstreams(text).map(...))`.
    Row id `id("workstream-member", row.key)`; cells use
    `known(key, label, value, ctx.ref(ref, "workstreams:<key>"))`; link to
    `indexed.get(workOrder).id` when present (the board refuses a link with no target);
    evaluate it after `usage` and return
    `[status, constellation, releases, index, history, usage, workstreams]` (line 308 returns
    the six sections without `workstreams` today). Evidence ids are insertion-ordered, so an
    empty or unavailable section adds none and the five existing cases keep theirs. Decided
    2026-10-07: on a parse failure the section shares the index's ref, so
    `ProjectionContext.section` re-notes `docs/work-orders/README.md` as unavailable while
    `work-order-index` stays available; step 15 covers that flip. No separate ref (it would
    change every case's `sources` list). Check: `npm test -- --only console`.
12. `packages/console/fixtures/inputs/workOrderIndex-workstreams.md` (new): the committed
    fixture index step 7's test generates; it must hold no physical path. Check: with
    steps 13 and 14.
13. `packages/console/fixtures/manifest.json`: input `workOrderIndexWorkstreams` (`ref`
    `docs/work-orders/README.md`, `format` `text`, `sha256` from `shasum -a 256`), the case
    `"workstreams": { "workOrderIndex": "workOrderIndexWorkstreams" }`, one provenance
    sentence appended to `capture`; the other inputs untouched. Check:
    `git diff --exit-code --diff-filter=MD <base> -- packages/console/fixtures/inputs/`;
    `npm test -- --only console-docs`.
14. `npm run evidence:console -- --write` (writes `expected/workstreams.{json,txt,html}` and
    rewrites the five existing cases); check `npm run evidence:console -- --check`; criterion
    3 by a printing script in the evidence directory: for each existing case, remove the
    `workstreams` section from the new JSON and compare it with
    `git show <base>:packages/console/fixtures/expected/<case>.json`; re-render the filtered
    board with `renderTerminal` and `renderHtml` from `packages/console/dist/src/render.js`
    and compare with the base txt and html. Check: `npm test -- --only console-docs`.
15. `packages/console/test/board.test.ts`: `test("[document] WO-080 workstreams case shows
    every column and the stale mark")`, `test("WO-080 an index without the marker gives an
    empty section; a malformed marker makes it unavailable")`, `test("WO-080 a view without
    the workstreams section validates and renders in text and HTML")` (`schemaMatches`,
    `renderTerminal`, `renderHtml`); add `workstreams` to the available-section list of the
    WO-032 host collection case (the test at line 1204; its list at lines 1284 to 1297).
    Check: `npm run test:console`; `npm test -- --only console`;
    `npm test -- --only console-docs`.
16. `packages/console/package.json` and the `packages/console` entry in `package-lock.json`
    (line 486): 0.4.2 to 0.5.0. Check: `npm test -- --only release-surfaces`.
17. `scripts/test-workstream-pilot.mjs` (new). Import `./test-fixture-temporary.mjs` first.
    Build the service, client and docs target repositories with `runGit`
    (`scripts/lib/git.mjs`); export a launchpad with `node scripts/launchpad.mjs export <dir>`
    (as `scripts/test-launchpad-planning.mjs` line 153 runs it); write `dotln.config.json` with
    three `repositories` entries copying the `registeredRepository` helper from
    `scripts/test-configuration-root.mjs` line 80; record the clones with
    `node <launchpad>/scripts/worktree.mjs clone <id> <path>` (as
    `scripts/test-target-worktree.mjs` line 189 does); author `WS-001` under the workstreams
    root and three member orders carrying `**Repository:** <id> @ <sha>` and
    `**Workstream:** WS-001` (the convention of steps 1 and 6). Check:
    `node --test scripts/test-workstream-pilot.mjs`.
18. Same file, four named tests, each asserting on JSON, never on terminal text
    (prose-parsing screen): "WO-080 D1 single repository: one member reaches closed from a
    target worktree" (`phase` from `resume status --json` and the member's record entry);
    "WO-080 D2 cross repository: client proceeds against the pinned contract fixture while
    service lands first" (the client base commit holds the fixture blob through
    `git rev-parse <sha>:<path>`, and the service close precedes it); "WO-080 D4 two
    workstreams on one repository: an occupied worktree refuses a second writer" (seed a
    foreign reservation with `seedHarnessWriter` from `packages/skeleton/dist/src/harness-host.js`
    and spawn the worktree's `.claude/hooks/concurrent-work-requires-worktrees.mjs` with a
    PreToolUse Edit payload on stdin, following the WO-039 foreign-writer test at
    `scripts/test-harness.mjs` line 4719 and `invoke` at line 1045; expect
    `hookSpecificOutput.permissionDecision` deny); "WO-080 D6 session restart resumes from
    resume next in the target worktree under the emitted bundle" (run
    `node <launchpad>/scripts/resume.mjs next` from the worktree and
    `node <launchpad>/scripts/harness.mjs check --target <worktree>`). Which members are
    dependent comes from step 4's JSON `edges`. Check:
    `node --test scripts/test-workstream-pilot.mjs`.
19. `scripts/test-runner.mjs`: `nodeTests("workstream-pilot", "scripts/test-workstream-pilot.mjs", { protects: "product 12's demonstrations hold over a real-Git launchpad and three targets" })`,
    a product row (not in `machinerySources`, not `document`) carrying
    `kit: "core-only: package TypeScript and build configuration needed to export"`, as every
    suite that exports a launchpad does (lines 722, 733 and 739); decide
    `needs: OUTSIDE_CONFINEMENT` by one confined run (unknown whether the hooks nest
    `sandbox-exec`). Check: `npm test -- --list`; `npm test -- --only runner-fixtures` and
    `npm test -- --only registrations` (`scripts/test-runner.mjs` is a declared source of both,
    lines 321 and 441); `/usr/bin/time -p npm test -- --only workstream-pilot` for the suite's
    wall-clock. Then, once the Preflight line passes and after the last code edit, the order's
    one measurement exception (Cost): `/usr/bin/time -p npm test -- --fresh` (the runner's
    `--fresh` runs the selection instead of reusing a covering row, `scripts/test-runner.mjs`
    line 2251), recorded for the six-minute condition and repeated only under the full-run
    rule of 07-execution-guide.md §Preflight before the full gate.
20. Write-backs: product 12 §"## One workstream across repositories" (the convention, in
    place) and §"## What exists and what must be proved" (the demonstrations' status, naming
    the four shown and the four candidates, in place); product 07 §"### Where the control
    plane finds its documents" (the field, one sentence after the `**Repository:**`
    paragraph); product 04 §"### Actor board v0" (the section sentence, in place);
    `packages/console/README.md` §"## Contract for another UI host" (the Work table row gains
    the section's cell keys) and §"## Recorded evidence and reproduction" (its "Five cases"
    sentence, line 359, becomes six); `docs/evidence/WO-080/README.md` (new: the fixture
    transcripts and the wall-clock readings) and `docs/evidence/WO-080/decisions.md` (new,
    with step 11's shared-ref decision); `npm run meta`;
    `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`. Check:
    `npm run test:docs`.
21. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-080/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Acceptance criteria (all required)**

1. A fixture launchpad with two registered repositories holds a workstream
   of three member orders, and the generated index shows them grouped
   under it. Each column equals the value the fixture sets in the member's
   header, its control segment or its target repository's Git history, and
   the render holds none of the fixture's physical paths (the launchpad
   root, the target checkouts and the worktree parent).
2. In the fixture, a member whose declared base differs from its target's
   integration base shows stale, and a green sibling leaves it stale; a
   member whose target cannot be read shows `unknown`; `index --check`
   passes on the committed fixture index with the targets' checkouts
   absent. The grouping's `<!-- dotln-workstreams: … -->` line on the
   committed `README.md` records, per member, its repository, base, phase,
   verdict, integration, stale mark and the target commit observed, and
   `index --check` regenerates the grouping from that line alone.
3. A new board fixture case, whose pinned index input holds the fixture
   workstream, renders the Workstreams section with every column and the
   stale mark. The five existing cases (`wo009`, `selfhost`, `control`,
   `refutations`, `missing`) keep their pinned inputs byte-identical, and
   their expected outputs differ from the base only by the new section.
4. The board extension is additive: every case's view validates against
   the unchanged `uifa-board-v1.schema.json`, and a view without the
   section still renders in the text and HTML hosts.
5. Each of the four demonstrations the Design names (D1, D2, the refusal
   half of D4 and D6) is one named fixture with its own assertion, and each
   passes. D3, the conflict half of D4, D5 and a workstream-level next safe
   action are register row FUP-b28d36edaa8630b1's, not criteria here.
   Criteria 1, 2 and 5 are judged against the declared set; a case outside
   it is a follow-up, not a failure.
6. Write-backs land, each in place with no dated paragraph: 12 §One
   workstream across repositories (the document convention; WO-083 and
   WO-207 also write it); 12 §What exists and what must be proved (the four
   demonstrations shown and the four candidates; WO-083 also writes this
   section); 07 §Where the control plane finds its documents (the field;
   WO-088, WO-192 and WO-193 also write 07), with the allowed set and its 07
   sentence where WO-088's check is on `main` at the base; 04 §Actor board
   v0 (the section; WO-083 and WO-091 also write 04); the console README
   §Contract for another UI host (the Work panel's row) and §Recorded
   evidence and reproduction (six cases); the decisions file; the
   publication locks refreshed. No byte figure binds a write-back.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency. No evidence re-mint and no live feedback
   episode is owed (Cost).

**Deliverables:** the convention and template, the field, the index
grouping with its record of target facts, the board extension and its
render, the new fixture case with regenerated expectations, the console's
minor release, the fixture suite with its runner row, fixtures, and the
write-backs above.

**Preflight:** `npm test -- --only work-orders-fixtures` for steps 1–8,
`npm test -- --only plan-refutation` for step 2, `npm test -- --only index`
for steps 4–5 and 8–9, `npm test -- --only configuration-root` and
`npm test -- --only launchpad-planning` for step 6,
`npm test -- --only console` for steps 10–11 and 15,
`npm test -- --only console-docs` for steps 12–15,
`npm test -- --only release-surfaces` for step 16,
`node --test scripts/test-workstream-pilot.mjs` for steps 17–18 (the suite
step 19 registers), `npm test -- --only runner-fixtures` and
`npm test -- --only registrations` for step 19, and `npm run test:docs` when
a document changes (steps 6, 9 and 20), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate). One measurement
exception beyond that full gate: step 19's single timed `npm test --
--fresh` for the six-minute stand-down condition, run after this line
passes and the last code edit lands, never as a retry (Cost).

**Evidence gate:** the fixture transcripts (the index fixtures, the board
case and the four demonstrations) with the suite's wall-clock and the fresh
`npm test` reading; the regenerated index; the new case's expected outputs
and criterion 3's printing script; `npm run test:docs`; `npm test -- --review`
before `implementation-ready`, because `scripts/work-orders.mjs` is a
declared source of the `launchpad-planning`, `harness-fixtures`,
`plan-refutation` and `process-debt` machinery suites
(`scripts/test-runner.mjs` lines 128, 208, 258 and 381) and of
`configuration-root` by prefix (line 242), `scripts/test-runner.mjs` of
`runner-fixtures` and `registrations` (lines 321 and 441), and every `docs/`
path, product 04 among them, of `registrations` (line 436); and again at
final review. No live row.

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- Register rows carried: FUP-0126 (the workstream application, allocated to
  this order and WO-083), FUP-7d1f987c4cfbb93f (the target facts on the
  committed line; its reopening's consumer is step 10), FUP-0050 (the
  synthetic pilot) and FUP-0070 (the sibling workflow pilot, among the
  WO-069 to WO-083 run). FUP-b28d36edaa8630b1 (the other four
  demonstrations) stays deferred, not carried.
- 2026-10-07 pass: stale facts corrected in place (WO-167, WO-061, WO-112,
  WO-173, WO-172, WO-086, WO-123, WO-116 and WO-117 closed; figures; the
  suites the edited scripts select; the console version; the README's
  "Five cases" write-back). The pilot, classified patch while four of its
  six demonstrations needed capability nothing supplies (the WO-112
  pattern), was narrowed to the four the tree supplies.
- Decided by the 2026-10-07 pass: WO-072 is a hard dependency; the
  workstream document and index grouping are JSON blocks, and the board and
  the pilot read JSON and `resume status --json` fields (prose-parsing
  screen); the integration enum; the shared ref on parse failure (step 11);
  the pilot's suite is a product row counted against the six-minute
  condition. Its decision that target facts are rendered live and never
  committed is reversed by the 2026-10-13 pass (Design): the board is the
  consumer FUP-7d1f987c4cfbb93f's reopening named.
- 2026-10-13 pass: re-observed at `6dbd8771` as the provenance records;
  WO-088, sequenced after this order, names `Workstream` in its allowed
  set; the loader comment at `scripts/lib/config.mjs` lines 29 and 30 is a
  Boy Scout item; the pilot's criterion had named six demonstrations while
  its plan kept four (the criterion-plan agreement screen of product 07
  §Operator-opened planning pass). The merge re-checked three board anchors
  at `6dbd8771`: the WO-032 host collection case's available-section list
  is at `board.test.ts` lines 1284 to 1297 (the board order said line
  1120); the `control` case reads `workOrderIndex-wo190.md`, so step 13's
  check covers every existing input, not `workOrderIndex.md` alone; the
  README's "Five cases" sentence is at line 359.
- Receipt 033 (2026-09-28), recorded against WO-082 before its merge here
  (its criterion 1, now criterion 5): the objective's collision read broader
  than the gap's rule that separate worktrees in one repository are
  allowed. Reopen when the collision demonstration or the resulting
  implementation refuses two otherwise conforming writers in separate
  worktrees only because their repository is the same, rather than showing
  the occupied-worktree collision.
- Receipts 041 to 044, recorded against WO-081 before its merge here (its
  criterion 1, now criterion 3): the goal standard requires prerequisite
  work to name the blocked outcome it enables; the board section names
  none, and with NoOp the same data stays in the index. Since the merge it
  rides in WO-083's typed prerequisite, though WO-083's text names no use of
  the board. Reopen when WO-083's receipt records an intervention or
  restatement caused by workstream state the board did not show.
- Receipts 041 to 044, recorded against WO-082 before its merge here (its
  criterion 1, now criterion 5): the three-repository suite enters the
  product gate with its wall-clock recorded but not bounded, so every later
  fresh gate pays it, the shared cost WO-197 spent an order to reduce.
  Reopen when the suite's recorded wall-clock pushes a fresh plain
  `npm test` above six minutes on the operator's host (the stand-down
  reversal condition).

**Non-goals:** events; re-reading a target repository at `index --check`;
console v1; drag-equip authoring; any other panel; a new schema field; the
real run (WO-083); runtime transports as executors.

**Operator-review assumptions**

1. A document plus projections is enough for the first pilot.
2. The showrunner is the board section's consumer; the section is
   read-only.
3. Synthetic fixtures are evidence for the mechanics, never for usefulness.
