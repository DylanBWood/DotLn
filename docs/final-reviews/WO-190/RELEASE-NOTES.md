## Release overview

This release makes the generated work-order index and the roadmap open on the work ahead. `docs/work-orders/README.md` now holds the active line, the proposed sequence with its lane pairs marked, and one card per active or sequenced order, the Open cards in sequence order; every settled card (closed, withdrawn, superseded, historical), the index's sources and limits and the release-tag record move to a companion page, `docs/work-orders/HISTORY.md`, one link away. The page a reader opens for what is next shrinks from 780,937 bytes to about 76,000. Six order files that were superseded whole (umbrella records) are listed under Superseded with the orders that carry them and can no longer be activated. `index --check` judges both pages, names the stale one, and refuses an open order that has no place in the sequence. The roadmap is reordered so that the rungs still ahead come first and the generated release history last. The visible changes:
- Two generated pages from one fold, written together and checked together; every order file has a card on exactly one of them.
- An umbrella record is a header class (the `**Umbrella record:**` label plus typed superseded entries): listed under Superseded with its successors, refused at `npm run resume -- activate` with a message naming them, and recorded by no control event.
- `index --check` refuses an open order absent from the proposed sequence, naming it; active orders and derived drafts are not judged.
- The console's work view reads the history page as a second source, so a release row still links to the card of every order it names.
- The roadmap's introduction links the index as the list of orders in sequence; its two pending rung headings no longer name carrier orders.

The release is for operators and maintainers who open the index, the roadmap or the console to see what comes next, and for planners who keep the sequence.

## Read before upgrading

- **Links into the index to a settled order's card now resolve on `HISTORY.md`.** The index page keeps only the active and sequenced cards. Every tracked document in this repository was retargeted; a document outside it that links `docs/work-orders/README.md#wo-nnn` for a closed, withdrawn, superseded or historical order should link `docs/work-orders/HISTORY.md#wo-nnn` instead. The sequence, the Now line and the open cards stay on `README.md`.
- **`npm run work-orders -- index` writes two files.** `HISTORY.md` is generated beside `README.md`, marked `dotln-generated` with the same check attribute, and must be committed with it; `index --check` refuses when either page is missing or stale, and its message names the page. `scripts/lib/meta.mjs` and the worktree integration helper treat both as the generated index.
- **An open order needs a place in the sequence.** `index --check`, which every lifecycle transition and the document gate run, refuses an Open order absent from the marked sequence in `docs/planning/sequence.md` and names it. An order superseded whole takes the umbrella label plus typed superseded entries instead; active orders and derived drafts are exempt. A label without typed entries is an ordinary open draft and is judged.
- **An umbrella record cannot be activated.** `resume activate` on one refuses with `activation refused: WO-NNN is an umbrella record superseded by WO-901, WO-902; activate a successor instead` and appends nothing; recorded control state on such an order, where any exists, still wins over the header.
- **The console reads one more file.** `collectSources` reads `docs/work-orders/HISTORY.md`; a missing history page is an unavailable section, a page without cards is valid and empty, and a card on both pages makes the history section unavailable rather than a second truth. The console's five pinned fixture families were regenerated; the control case reads two synthetic pages split from the 2026-09-07 single-page snapshot.
- **The roadmap's two pending headings were renamed** (`Harness lowering and rule migration`, `Launchpad and cross-repository workstreams`, each without its `→ WO-…` suffix); the status index rows follow. Three queued orders cite the old headings word for word, boarded for the next planning pass (D006). The pending rung bodies still name umbrella carriers, boarded for the next planning pass that touches the roadmap (D008).
- **Component versions.** Application v0.71.1 is a patch over v0.71.0. `@dotln/console` moves from 0.4.1 to 0.4.2 (retimed from 0.4.1 at integration, because v0.71.0 consumed that version); the kernel, compiler and skeleton are unchanged. No dependency is added.

## Substantive changes

**Two pages from one fold.** `scripts/work-orders.mjs` reads the orders once and renders `README.md` (`renderIndex`: the Now line, the sequence with ` · pair N` on both rows of each two-entry group, the Active cards, the Open cards in sequence order with unplaced derived drafts after them, and only the link definitions those rows use) and `HISTORY.md` (`renderHistory`: Closed, Withdrawn in its own section, Superseded with a summary row per umbrella naming its successors, Historical, the sources and limits, the tag record). Both temporaries are written before either page is replaced; a leftover temporary refuses by name. `--check` reads the tag snapshot from the history page, runs the topology and coverage checks, compares each page and names the stale one, and proves the two pages partition the orders (`checkPartition`). The card format is unchanged, so the resident's status projection (`runtimeOrdersFromIndex`) needs no change and is proved over the real page.

**Umbrella records.** `scripts/lib/dependencies.mjs` exports `umbrellaSuccessors`: the exact `**Umbrella record( (date))?:**` label in the leading header plus at least one typed `superseded` entry with `by`; the successors are those entries' `by` values, deduplicated, never read from prose. `parseHeader` carries the class; `readIndex` settles such an order as `superseded` unless control state records a lifecycle; `scripts/resume.mjs` refuses activation before dependency checks, naming the successors.

**Sequence coverage.** `checkSequenceCoverage` refuses an Open row that is neither an umbrella record nor a derived draft and is absent from the sequence, with the remedy in the message; it is kept apart from `checkSequenceTopology`, which historical planning receipts still judge.

**The console's second source.** `BoardSources.workOrderHistory`; `parseWorkOrderIndex` takes the page title, ends a card at the link definitions, and accepts a page without cards; `projectWork` indexes both pages before the status and release rows link to them, as a `work-order-index` and a `work-order-history` section.

**The roadmap.** Whole sections moved: the introduction with one added sentence linking the index, the five pending rungs with v1.0.0 and the post-1.0 horizons, then the closed rungs, then `## Release boundary` with the generated history at its end. No rung body changed; a sorted-line comparison with the base shows only the two renamed headings, the added sentence and one blank line. `docs/evidence/WO-190/roadmap-order.json` records the landing order and a masked hash; the test asserts the durable invariants always and the exact order and bodies while the hash matches, retiring visibly otherwise.

**Fixtures and tests.** `scripts/test-work-orders.mjs` gains a two-page fixture with one order per class, the stale-page diagnostics, the coverage refusal and the temporary-write guard; `scripts/test-resume.sh` the activation refusal and the labelled draft that still activates, with the baseline contrast at `08845c71` recorded in evidence; `scripts/test-derived-orders.mjs` the derived draft passing `index --check`; `packages/console/test/board.test.ts` the parser pins and the release-link equality over both real pages against the base; `packages/skeleton/test/runtime-status.test.ts` the resident reader over the real pages; `scripts/test-docs-check.mjs` the roadmap test.

## Progressive polish

`docs/README.md` §Map, `docs/PLAYBOOK.md`, the planning map's status boundaries, products 03, 07 and 13 and the console README name the two pages and the companion's purpose; the status index rows follow the two renamed headings; the two publication locks were refreshed. The planning condition that times the index renders both pages. At integration, sixteen code comments that led with the order identifier were reworded to lead with their explanation, and the roadmap test reads the base commit through the library's `spawnGit`, both to satisfy rules WO-188 introduced after this order was verified; neither changes behavior. D006's description of the roadmap test was aligned with the implemented checks at final review (D013).

## Evidence and compatibility

Application `v0.71.1` is a patch release over `v0.71.0`, built from WO-190 integrated onto `main` at `298c2c77`. `@dotln/console` 0.4.2; kernel, compiler, skeleton, beacons and browser-evidence versions are unchanged. No dependency is added.

The verification sequence:
- [VER-001](../../verifications/WO-190/VER-001.md) passed on seven independent probe groups, the fresh fixture suite, the baseline activation contrast and the fresh document gate, consuming the executor's passing review row at the verified identity.
- [FINAL-001](FINAL-001.md) passed at the integrated subject: the fixture suite fresh (24 of 24), the five WO-190 tests with the exact roadmap subtest live, the baseline contrast replayed, the console fixtures, the release surfaces, and both gates at the integrated code identity.

This review's `npm test -- --review` at code identity `152d7fec6e7cfdfe28d4991233b331ddc134b506f1f75413d41cf463675e4c0d` passed 35 suites and 87 fresh tasks in 1,648.2 s (2026-10-09T17:03:18Z); the executor's row at the verified identity `1233ba12…` passed 35 suites in 1,411.2 s and VER-001 consumed it. `npm run test:docs` passes 31 of 31 at the same identity.

Known limitations:
- The exact roadmap checks retire as a visible skip once a later pass changes the document outside its generated block; the durable invariants keep running.
- Three queued orders cite the renamed roadmap headings word for word, and the pending rung bodies still name umbrella carriers; both are boarded for the next planning pass ([D006](../../evidence/WO-190/decisions.md#wo-190-d006--the-roadmap-is-reordered-by-moving-whole-sections-the-exact-order-is-evidence-that-retires-itself), [D008](../../evidence/WO-190/decisions.md#wo-190-d008--the-pending-rung-bodies-still-name-umbrella-records-a-planning-pass-retargets-them)).
- The launchpad kit's seeded README text still says the instance's README is the index, and `worktree start` on an umbrella record runs before the activation refusal ([D007](../../evidence/WO-190/decisions.md#wo-190-d007--links-into-the-index-and-the-sentences-about-it-what-moved-what-was-retargeted-what-stays)).
- The console's two-page fixture inputs are a synthetic split of the 2026-09-07 snapshot, not generator output beyond the cards.
- `HISTORY.md` is about 710,000 bytes; whether the forge renders a page of that size in full was not observed.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-190/decisions.md) and the [handoff](../../evidence/WO-190/handoff.md).
