# WO-190

Someone who opens the generated work-order index or the roadmap to learn what comes next now sees that first and sees all of it. `docs/work-orders/README.md` holds the active line, the proposed sequence with its lane pairs marked, and one card per active or sequenced order, the Open cards in sequence order; every settled card, the index's sources and limits and the release-tag record move to `docs/work-orders/HISTORY.md`, one link away. Before this change the page a reader opened was 780,937 bytes, of which closed cards and a hidden tag record were 87%; open cards were printed in identifier order, so the list and the cards disagreed about what was next; six superseded umbrella records were shown as open work and nothing stopped their activation; and the roadmap's first rung still ahead began after 63,915 bytes of release history and closed rungs. The index page is now about 76,000 bytes and the first pending rung is the first heading after the roadmap's introduction.

**Two pages from one fold.** `npm run work-orders -- index` reads the orders once and writes both pages; `--check` judges both, names the stale one, reads the tag record from the history page, and proves the pages partition the orders: every order file has a card on exactly one of them. The card format and the index page's first line, generated-by sentence and Active and Open headings are unchanged, so the resident's status projection reads the new page without a source change, which its test proves over the real page. The console reads the history page as a second source, projected as its own section, so a release row still links to the card of every order it names; a test over the repository's two pages shows the 148 release rows the single page recorded keep the same evidence links.

**Umbrella records and sequence coverage.** An order superseded whole is now a header class: the `**Umbrella record:**` label in its leading header plus typed superseded entries, whose `by` values name the successors; prose is never read. Such an order is listed under Superseded on the history page with its successors, `npm run resume -- activate` refuses it naming them and appends nothing, and recorded control state, where any exists, still wins. `index --check` refuses an open order that is neither an umbrella record nor a derived draft and has no place in the proposed sequence, naming it and the remedy; the "Other open work" list is gone because nothing is left to put in it.

**The roadmap, reordered.** Whole sections moved: the introduction gains one sentence linking the index as the list of orders in sequence; the five pending rungs with v1.0.0 and the post-1.0 horizons come first; the closed rungs follow; the generated release history ends the file inside the release boundary. No rung body changed, which a sorted-line comparison with the base and a test over a committed heading record prove; the two pending headings lose their `→ WO-…` carrier suffixes, and the status index rows follow.

**Read before merging.** Links to a settled order's card now resolve on `HISTORY.md`; every tracked document here was retargeted, and a document outside this repository that links a closed order's card on `README.md` should move to the history page. `HISTORY.md` is generated beside `README.md` and committed with it. An open order absent from the marked sequence now fails `index --check`, which every lifecycle transition and the document gate run. Three queued orders cite the two renamed roadmap headings word for word and the pending rung bodies still name umbrella carriers; both are boarded for the next planning pass (D006, D008). The launchpad kit's seeded README text and `worktree start`'s order of operations stay with their owners' lanes (D007). At integration `main` had moved by WO-188 and its v0.71.0 release: the application target was retimed to v0.71.1 and the console to 0.4.2 because v0.71.0 consumed 0.4.1; sixteen comment lines that led with the order identifier were reworded and one direct Git spawn in the roadmap test was replaced by the library's `spawnGit`, to satisfy the two rules WO-188 introduced after this order was verified; neither changes behavior (D012).

**Validation.** `bash scripts/test-work-orders.sh` passes 24 of 24 fresh in the executor's, the verifier's and this review's runs, with a two-page fixture holding one order per class, the stale-page diagnostics, the coverage refusal and the activation contrast; the activation fixture activates WO-900 with the scripts of `08845c71` and is refused by this order's scripts, replayed three times. The five WO-190 tests over the real pages pass with the exact roadmap subtest live. VER-001 ran seven independent probe groups and passed every criterion; this review re-derived each at the integrated tree. This review's `npm test -- --review` at code identity `152d7fec6e7cfdfe28d4991233b331ddc134b506f1f75413d41cf463675e4c0d` passed 35 suites and 87 fresh tasks in 1,648.2 s (2026-10-09T17:03:18Z); the executor's row at the verified identity `1233ba12…` passed 35 suites in 1,411.2 s and VER-001 consumed it. `npm run test:docs` passes 31 of 31 at the same identity. Details: [FINAL-001](FINAL-001.md), [VER-001](../../verifications/WO-190/VER-001.md), [decisions](../../evidence/WO-190/decisions.md), [handoff](../../evidence/WO-190/handoff.md).

Application v0.71.1, a patch release over v0.71.0. `@dotln/console` moves to 0.4.2; no other component changes and no dependency is added.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-09T15:47:05.333Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-196 | 14,904,655 / 5 | 5,202,112 | 4 / 69,822 | 88,914,669 /  | 768 | 2 | 0 |
| WO-197 | 19,049,648 (Δ 4,144,993) / 5 | 1,484,836 (Δ -3,717,276) | 3 (Δ -1) / 28,282 (Δ -41,540) | 82,761,669 (Δ -6,153,000) /  | 768 (Δ 0) | 3 (Δ 1) | 4 (Δ 4) |
| WO-199 | 29,582,201 (Δ 10,532,553) / 8 | 5,878,530 (Δ 4,393,694) | 6 (Δ 3) / 46,146 (Δ 17,864) | 158,505,935 (Δ 75,744,266) /  | 768 (Δ 0) | 3 (Δ 0) | 0 (Δ -4) |
| WO-074 | 9,334,169 (Δ -20,248,032) / 3 | 1,043,999 (Δ -4,834,531) | 29 (Δ 23) / 304,340 (Δ 258,194) | 34,680,535 (Δ -123,825,400) /  | 768 (Δ 0) | 2 (Δ -1) | 0 (Δ 0) |
| WO-188 | 45,120,571 (Δ 35,786,402) / 9 | 7,770,554 (Δ 6,726,555) | 13 (Δ -16) / 219,325 (Δ -85,015) | 201,144,864 (Δ 166,464,329) /  | 768 (Δ 0) | 4 (Δ 2) | 0 (Δ 0) |
| WO-190 | 11,662,011 (Δ -33,458,560) / 2 | 1,411,200 (Δ -6,359,354) | 34 (Δ 21) / 707,339 (Δ 488,014) | 51,538,743 (Δ -149,606,121) /  | 768 (Δ 0) | 1 (Δ -3) | 0 (Δ 0) |

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-190/executor | 10,321,865 (Δ -19,769,097) | 752,587 (Δ 85,951) | 768 (Δ -1,658) | 42,508,626 (Δ -110,220,014) | 825 (Δ -1,695) |  / 768 |
| WO-190/verifier | 1,340,146 (Δ -8,872,597) |  |  | 8,937,411 (Δ -39,386,255) | 72 (Δ -300) |  /  |
| WO-190/reviewer | 10,813 (Δ -4,806,053) |  | 25 (Δ -10) | 92,706 (Δ 148) | 29 (Δ -8) |  /  |

43 unavailable observations omitted as blank cells or rows; unavailable is not zero; unset ceilings are not approvals of a future limit.

<!-- dotln-process-meter:end -->
