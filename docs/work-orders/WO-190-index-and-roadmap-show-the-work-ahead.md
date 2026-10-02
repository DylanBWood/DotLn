# WO-190 — The work-order index and the roadmap lead with the work ahead, in one sequence; history moves to a companion page (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor high; verifier high; reviewer any.
**Track:** machinery
**Release classification:** patch. One generated page split in two, one
header class read by the index and by activation, one refusal in the
index check, one document reordered, one more text source for the
console's work view; no new runtime capability. Assigned at activation
under the standing opt-out default.
**Cost:** adds a generated companion page for settled orders
(`docs/work-orders/HISTORY.md`), an `umbrella` reading of the order
header used by the index and by activation, one refusal in
`index --check` for an open order that has no place in the sequence
(`scripts/work-orders.mjs`, `scripts/resume.mjs`), and the companion as
a second source of the console's work view (`packages/console/src`).
Removes from the page a reader opens to see what is next: 309,934 bytes
of closed cards, a 284,852-byte hidden tag record and six superseded
records shown as open work (of 685,899 bytes, about 76,000 remain);
from the roadmap, the 63,915 bytes a reader passes before the first
rung that is still ahead, and the umbrella records its pending rungs
name as carriers. Re-mints: none of the edited files is a registered
evidence source or a file the feedback verifier judges;
`scripts/work-orders.mjs` and `scripts/resume.mjs` are declared
machinery sources, so `npm test -- --review` runs before handoff.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 8
(captured in ignored intake; SHA-256 in the ledger section of that
date); the 2026-10-02 planning pass's measurement of the index, the
roadmap and the sequence file
([planning document](../planning/standard-pass-2026-10-02.md) §7).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: generated pages over this repository's own records; no stop
condition.
**Depends on:** WO-158 merged (withdrawn entries and the sequence rule
that settled entries leave the list; closed); WO-086 merged (the
generated release history in the roadmap; closed).
**Recommended placement:** the machinery lane of the sixth pair, beside
WO-072. This order edits `scripts/work-orders.mjs`, `scripts/resume.mjs`
(activation), `scripts/lib/meta.mjs` and
`scripts/lib/worktree-integration.mjs` where they name the index,
`packages/console/src` (`collect.ts`, `work.ts`, `text-sources.ts`) and
product 06; WO-072 edits `scripts/worktree.mjs` and the target
lifecycle. WO-185 and WO-187, before it, edit `scripts/resume.mjs`. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "withdrawn orders and the rule that settled entries leave the sequence"
  },
  {
    "workOrderId": "WO-086",
    "relation": "satisfied-by-close",
    "reason": "the generated release history block this order moves below the rungs"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/work-orders.mjs` (`parseHeader`,
`parseSequenceGroups`, `checkSequenceTopology`, `readIndex`,
`renderIndex`, `renderSources`, `readTagSnapshot`, `checkIndex`);
`scripts/resume.mjs` (activation and the legal-action table);
`packages/skeleton/src/runtime-status-contract.ts`
(`runtimeOrdersFromIndex`); `packages/console/src/text-sources.ts`
(`parseWorkOrderIndex`) and `work.ts` (the release rows' links);
`scripts/lib/release-history.mjs` and the registered-block rule in
`scripts/docs-check.mjs`; `docs/planning/sequence.md`;
`docs/product/06-roadmap.md` whole; the header of
`docs/work-orders/WO-033-compiled-starter-export.md` (an umbrella
record); product 07 §Operator recovery controls (why `withdraw` does not
apply to an authored order that was never activated); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§7.

**Objective:** Someone who opens the index or the roadmap to learn what
comes next sees that first and sees all of it: every order still to run,
once, in the order it is planned to run. What is finished stays one link
away.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- `docs/work-orders/README.md` is 685,899 bytes in 3,577 lines. The
  queue is 2,209 bytes of it. Closed cards are 309,934 bytes (45.2%);
  one hidden comment holding the release-tag record is 284,852 bytes
  (41.5%). Whether the forge renders a page of that size in full was
  not observed.
- Open cards are printed in identifier order, not in the sequence's
  order, so the list and the cards below it disagree about what is next.
- "Other open work" lists seven orders. Six are umbrella records whose
  header says they were superseded whole and cannot be activated
  (WO-033, WO-034, WO-035, WO-036, WO-037, WO-040); the index prints each
  as a draft whose dependencies are ready. The seventh, WO-014, had no
  place in the sequence until this pass put it last.
- Nothing but the header's prose stops an umbrella record from being
  activated: a search of `scripts/work-orders.mjs`, `scripts/resume.mjs`
  and `scripts/lib/` for the word finds it only in a one-time migration
  helper. `withdraw` does not apply, because it is legal from phase
  `none` only for an allocated derived order.
- `docs/product/06-roadmap.md` is 79,287 bytes. Generated release
  history and the closed rungs come first; the first rung still ahead
  starts at line 550, after 63,915 bytes (80.6%). The pending rungs name
  umbrella records and closed orders as their carriers; 25 of the 26
  orders in the sequence appear nowhere in the roadmap.
- Two runtime readers parse the index page: the resident's status
  projection keeps the cards under the Active and Open headings, and
  the console's work view reads every card and links each release row
  to the cards of the orders it names.

**Design (scope discipline):**

- **Two pages from one fold.** `README.md` holds the line that says what
  is active now, the sequence in its order, then the Active cards and
  the Open cards, the Open cards in sequence order with pairs marked,
  and a link to the companion. `HISTORY.md` holds the closed, withdrawn,
  superseded and historical cards, the sources-and-limits text and the
  tag record. Both are written by `npm run work-orders -- index` and
  checked by `--check`; link definitions resolve from either page.
- **The page contract the runtime reads is kept.** The first line, the
  generated-by sentence, the Active and Open headings and every card
  field stay as they are, so the resident's projection needs no change.
  The console reads the companion as a second source so that a release
  row still links to the card of each order it names.
- **Umbrella is a header class.** `parseHeader` reads the
  `**Umbrella record` line and the successors it names. The index prints
  such an order under "Superseded" in the companion with its successors;
  `resume -- activate` refuses it with a typed message naming them. No
  control event is invented and no order file is edited.
- **Every open order has a position.** `index --check` refuses when an
  order that is neither settled nor an umbrella record is absent from
  the sequence, and names it. "Other open work" has nothing left to
  list and is removed.
- **The roadmap is reordered, not rewritten.** After its introduction it
  links the index as the list of orders in sequence; the rungs still
  ahead come next; closed rungs follow; the generated release history
  moves to the end between its existing markers. Pending rung headings
  stop naming umbrella records as carriers: the index is the one place
  that lists the orders, so the roadmap cannot fall behind it again.
- **Declined alternatives, recorded:** deleting closed cards (they are
  the readable record of each order's release and review, and other
  pages link to them); a control event that closes an umbrella record
  (it would say a review passed that never ran); naming each rung's
  queued orders in the roadmap behind a new check (a second list to keep
  in step with the sequence, and one more refusal for every planning
  pass); a generated copy of the sequence inside the roadmap (a product
  document rewritten at lifecycle transitions); splitting the roadmap
  into two documents (its links and its ceiling are per file, and the
  reorder gives the reader the same thing).

**Deliverables:** the two generated pages; the header class and the
activation refusal; the index refusal; the console's second source; the
reordered roadmap; fixtures; the write-backs below.

**Acceptance criteria (all required)**

1. `npm run work-orders -- index` writes `docs/work-orders/README.md`
   with the active line, the sequence in order and one card per active
   or sequenced order, the Open cards in sequence order, and
   `docs/work-orders/HISTORY.md` with every other order under Closed,
   Withdrawn, Superseded or Historical. Every order file appears on
   exactly one of the two pages; a test proves it over the repository
   and over a fixture with each class.
2. `README.md` holds no card for a closed, withdrawn, superseded or
   historical order and no tag record; its size is recorded before and
   after in the decisions.
3. `index --check` still detects a changed header, control state,
   sequence or tag object on either page, and its stale-page message
   names the page that is stale; `scripts/lib/meta.mjs` and
   `scripts/lib/worktree-integration.mjs` treat both pages as the
   generated index.
4. An order whose header carries an umbrella record is printed under
   Superseded with its named successors, and `npm run resume -- activate`
   on it refuses with a typed message that names them; fixtures cover
   both, and the activation fixture fails against `08845c71`.
5. `index --check` refuses a fixture in which an open order that is not
   an umbrella record is missing from the sequence, naming the order;
   the repository passes.
6. `runtimeOrdersFromIndex` over the new `README.md` returns the active
   and queued orders with no source change to
   `packages/skeleton/src/runtime-status-contract.ts`; the console's
   work view, reading both pages, gives every release row the same
   evidence links as at this order's base, shown by a test over the
   repository's two pages.
7. In `docs/product/06-roadmap.md` the introduction links the index as
   the list of orders in sequence; the first rung heading after it is
   the first rung still ahead; no pending rung heading names an umbrella
   record; the closed rungs and then the generated release history
   follow; the registered-block rule of the document check passes with
   the block in its new place; no rung's body text is changed.
8. Links into the index from tracked documents resolve to the page that
   now holds their target; a link check over `docs/` and the root
   Markdown files is green.
9. Write-backs: `docs/README.md` names the companion page; product 07's
   sentences on the generated index name both pages; the console
   package README names its second source; the decisions file; the
   publication locks refreshed.
10. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1, 4 and 5; the test of
criterion 6; the two generated pages; `npm test -- --review` before
`implementation-ready`, because `scripts/work-orders.mjs` and
`scripts/resume.mjs` are declared machinery sources, and again at final
review. No live row.

**Write-back duty:** as listed in criteria 7 and 9.

**Known issues and carry-ins:**

- The index's delivery line for WO-112 and WO-118 is written into the
  generator by identifier (`renderIndex`); it moves with their cards and
  is not generalized here.
- The console's pinned fixture families include an index source; they
  are regenerated, and their difference is the added source and the
  cards' new page.
- Product 06 is a bounded document; the generated release history is
  exempt from its ceiling, and this order's edit removes more than it
  adds.

**Non-goals:** the front page (WO-189); changing what a card prints;
the sequence file's own text (trimmed by the 2026-10-02 pass);
generating rungs; any change to closing, withdrawing or release
evidence.

**Operator-review assumptions**

1. "Only future work" means the index page itself; history stays in the
   repository on a companion page one link away.
2. An umbrella record is shown as superseded and refused at activation
   without a control event.
3. The roadmap keeps one file; the reader meets pending rungs first, and
   the index is the single list of orders.
