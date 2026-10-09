# WO-190 decisions

## WO-190-D001

```json
{
  "id": "WO-190-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.70.1, the next patch above the observed release baseline v0.70.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.70.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-190-D002 — Two pages from one fold: what each page holds and how a reader finds the work ahead

```json
{
  "id": "WO-190-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/work-orders.mjs renders two pages from one readIndex fold. docs/work-orders/README.md keeps the runtime contract byte for byte (line 1 `# Work orders`, the `**Now:**` line, `## Proposed order`, the generated-by sentence, `## Active`, `## Open`, every card field) and holds only the active line, the sequence with its lane pairs and the Active and Open cards, the Open cards in sequence order (a row's `position` in the flat sequence; `rows` stay in identifier order for every other reader). docs/work-orders/HISTORY.md starts with its own title, holds the Closed, Withdrawn (its own section), Superseded and Historical cards, the sources and limits and the release-tag snapshot. Criterion 1's 'one card per active or sequenced order' is read with criterion 2: a settled sequence entry keeps its row in the proposed order (checked, or unchecked with its disposition) and its card on the history page; a derived draft, whose place is its allocation, is an Open card after the sequenced ones. Lane pairs are marked on the sequence rows (` · pair N` on both rows of every two-entry group of the marked sequence), not on the cards, because both runtime readers pin the card format and the sequence list is where a reader reads order. Each page defines only the reference links it uses (the index page: the Now line and the sequence rows; the history page: the Superseded summary rows). `## Other open work` is gone: coverage (D004) leaves it nothing to list.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Design (Two pages from one fold; The page contract the runtime reads is kept), criteria 1, 2 and 6, Non-goals (changing what a card prints)",
    "packages/skeleton/src/runtime-status-contract.ts runtimeOrdersFromIndex: reads line 1, the generated-by sentence, the Active and Open headings and `- Field: value` card lines; unchanged by this order and judged by the [document] WO-190 test in packages/skeleton/test/runtime-status.test.ts over the repository's pages",
    "Index bytes: docs/work-orders/README.md was 780,937 bytes at the base e3b38663 (785,807 in the worktree after activation); after this order README.md is 78,228 bytes (32 cards: 1 active, 31 open) and HISTORY.md 702,128 bytes (165 cards: 157 closed, 6 superseded, 2 historical, 0 withdrawn), measured with wc -c at handoff on 2026-10-09",
    "scripts/test-work-orders.mjs 'WO-190 two pages partition the orders by class …': Open cards WO-904, WO-902, WO-903 in sequence order rather than identifier order; pair marks on the two-entry group only; definitions per page",
    "The pre-implementation refutation (two dotln-workers, 2026-10-09, read-only): the planned per-row definitions on both pages would add about 200 lines to each page and widen the integration conflict surface; the console parser would have taken a definition line as the last Open card's title (fixed in D005)"
  ],
  "goalAlignment": {
    "traps": "Rule beating: leaving the closed cards on the index page as well would keep every reader's contract trivially and fail criterion 2; the pages partition the orders and `--check` proves it. Seeking the wrong goal: marking pairs on the cards would change what a card prints, a non-goal, for a reader who reads order from the list. Shifting the burden: a second hand-kept list of pairs would fall behind the sequence; the marks come from the marked sequence's blank lines, the planner's own convention.",
    "noOp": "Leave the single page: a reader passes 88,550 bytes before the first closed card and a Closed section of 345,410 bytes (Buffer byte offsets on the base page at e3b38663) to learn what is next, and six superseded umbrella records read as open work."
  },
  "rejected": [
    {
      "option": "Pair marks on the Open cards (a card field or a heading suffix)",
      "reason": "Both runtime readers pin `### WO-NNN` and the card fields; a new field changes what a card prints (non-goal) and would become a console cell."
    },
    {
      "option": "Blank-line grouping of the sequence rows, as the sequence file does",
      "reason": "CommonMark renders a list with any blank line between items as one loose list, so the grouping is invisible on the forge."
    },
    {
      "option": "Every link definition on both pages",
      "reason": "About 200 definition lines per page, definitions the history page never uses, and a history page that changes whenever any order file is added."
    },
    {
      "option": "Deleting the closed cards",
      "reason": "Declined by the order: they are the readable record of each order's release and review, and other pages link to them."
    }
  ],
  "reopenWhen": "A reader needs the lane pair visible on the cards themselves; the resident or another runtime reader needs the history page (then its title and generated-by sentence become a contract as the index page's are); or a planning pass asks for the settled sequence entries to leave the index page's list before the pass that removes them from the sequence."
}
```

## WO-190-D003 — The umbrella class is a header reading shared by the index and by activation; successors are a summary list, not a card field

```json
{
  "id": "WO-190-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/lib/dependencies.mjs exports umbrellaSuccessors(markdown, dependencies) and umbrellaRecord(markdown, path, id): an order is an umbrella record when its leading header (the dependencyHeader boundary) holds a line matching `^\\*\\*Umbrella record( \\(\\d{4}-\\d{2}-\\d{2}\\))?:\\*\\*` and its typed dependency block holds at least one `superseded` entry; the successors are those entries' `by` values in entry order, deduplicated, never read from prose. A label without typed entries, or entries without the label, is not an umbrella: the order stays open work, activation admits it as any draft, and the coverage check names it when it has no sequence position (recorded by the resume suite's WO-903 case and the fixture's WO-908). parseHeader carries `umbrella` from the same helper; readIndex gives such a row (with no control state, or an allocation never activated) the section Superseded and the phase word `superseded`, while recorded control state wins (an activated, closed or withdrawn umbrella keeps its lifecycle section). The history page prints the successors as a summary list under `## Superseded` (`- [WO-033] — superseded by WO-049, …`) outside the cards; the card itself is unchanged, and its References line already names every successor with `by`. scripts/resume.mjs activate refuses after workOrderDeclaration and before readDependencies with `<path>: activation refused: WO-NNN is an umbrella record superseded by <ids>; activate a successor instead`, appending no event and editing no file.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Design (Umbrella is a header class), Execution plan steps 1 and 4, criterion 4, Non-goals (changing what a card prints)",
    "The six umbrella files (WO-033, WO-034, WO-035, WO-036, WO-037, WO-040) each carry the label and typed superseded entries (14, 4, 7, 1, 5 and 3 entries); none has a control segment (ls docs/control/orders, grep of docs/control/resume.jsonl, 2026-10-09)",
    "docs/evidence/WO-190/activation-08845c71.txt: the same fixture activates WO-900 (exit 0, WorkOrderActivated appended) with scripts/resume.mjs and scripts/lib extracted from 08845c71, and is refused by this order's scripts naming WO-901, WO-902 with no segment written",
    "scripts/test-resume.sh umbrella case (refusal, no stack trace, no segment) and WO-903 (label only: activates); scripts/test-work-orders.mjs two-pages fixture (WO-907 under Superseded with its summary row and References; WO-908 label-only draft is Open)",
    "product 07 §Operator recovery controls: `withdraw` is legal from phase `none` only for an allocated order, so no off-ramp applies to an authored record that was never activated"
  ],
  "rejected": [
    {
      "option": "A control event that closes or withdraws an umbrella record",
      "reason": "Declined by the order: it would record a review or a withdrawal that never happened; `withdraw` from `none` is reserved for allocated derived orders."
    },
    {
      "option": "Successors read from the label's prose",
      "reason": "Prose is not a contract; the typed entries' `by` values are validated by parseDependencies (require by WO-NNN)."
    },
    {
      "option": "A `- Successors:` card field on Superseded cards",
      "reason": "Changes what a card prints (non-goal) and duplicates the References line; the summary list under the section heading sits outside every card and both parsers ignore it."
    },
    {
      "option": "Refusing a label without typed entries as malformed",
      "reason": "A visible failure already follows: the order shows as open work and the coverage check names it; a refusal would stop the index generator at every lifecycle transition for a prose-only line."
    }
  ],
  "followup": "WO-113 step 5 plans to move each `**Umbrella record (...)**` paragraph out of the six order files into their evidence READMEs, leaving a dateless pointer. The pointer must keep the undated `**Umbrella record:**` label in the leading header (the class regex accepts it) and the typed superseded entries must stay in the header block, or the six would silently become open work that fails coverage and activates again. Natural home: WO-113, before its migration; the planner amends its step. Priority: medium; nothing changes until WO-113 runs.",
  "reopenWhen": "WO-113 moves the umbrella paragraphs; an umbrella record gains control state through a recorded operator override or after its label or typed entries are removed (recorded state then wins and the class no longer applies; the two-pages fixture's WO-910 shows an activated umbrella under Active); or a planning pass supersedes an order whole without typed entries, which this class does not read."
}
```

## WO-190-D004 — Every open order has a position: judged by `index --check`, exempting active orders and derived drafts, tolerated by the write path

```json
{
  "id": "WO-190-D004",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "checkSequenceCoverage(index, source) refuses when a row of section Open without derived provenance has no place in the marked sequence, naming every such order and the two remedies (a sequence entry, or the umbrella class). It runs in `index --check` after checkSequenceTopology and before the byte comparison, so historical topology diagnostics keep their messages, and it is kept out of checkSequenceTopology and checkPlanGate, which historical planning receipts still judge. Active orders are not judged: the Now line and the Active cards show them, and five suites activate orders no sequence names (test-harness, test-process-debt, test-derived-orders, test-portfolio and the dispatch-index fixture). Derived drafts (an allocation with `**Derived provenance:**`) are not judged: a resident files and admits them outside the operator's sequence (product 07 §Derived work and intent) and an intent filing must not fail the document gate; they are Open cards after the sequenced ones. The write path (`index`) does not refuse coverage, because the index refreshes at every lifecycle transition and a draft filed without a position must not break a handoff; `npm run test:docs` carries the refusal through the `index` suite. The frozen 2026-09 fixture in scripts/test-plan-refutation.mjs (commit 45765940) held WO-014, WO-102, WO-103, WO-105 and WO-107 as drafts outside its sequence beside the fixture's own WO-901 and WO-902; its written sequence copy appends them as a final group while the receipt subject it inspects is unchanged.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Design (Every open order has a position), Execution plan step 3, criterion 5 ('an open order that is not an umbrella record')",
    "docs/product/07-execution-guide.md §Derived work and intent: a filed draft is visible in the index with phase `draft`; a resident admits it under standing authorization",
    "scripts/test-derived-orders.mjs 'configured roots and range allocate deterministically …': two allocated, never activated drafts and an empty sequence pass `index --check`; scripts/test-work-orders.mjs two-pages fixture: WO-901 active and unsequenced passes, WO-903 removed from the sequence is refused by name while the write path still writes, and checkSequenceCoverage's unit cases cover Active, Superseded, Closed and derived rows",
    "git ls-tree 45765940 docs/work-orders and the control fold at that revision (2026-10-09): the five drafts have files, no control state and no sequence entry; the six umbrellas carry label and entries there too",
    "The repository today: every Open, non-umbrella order is in docs/planning/sequence.md (the 2026-10-02 pass put WO-014 last), so `index --check` passes (the `index` suite row)"
  ],
  "rejected": [
    {
      "option": "Refusing coverage in the write path too",
      "reason": "implementation-ready, repair-complete and every dispatch regenerate the index; a draft filed without a position would then fail an unrelated handoff instead of the document gate."
    },
    {
      "option": "Judging active orders",
      "reason": "Criterion 5 says open order; an active order has its card and the Now line regardless, and five suites activate unsequenced fixtures."
    },
    {
      "option": "Adding coverage to checkSequenceTopology or the plan gate",
      "reason": "The order keeps the topology check for historical receipts; a coverage failure on a frozen subject would rewrite history."
    }
  ],
  "reopenWhen": "A derived draft stays open across a planning pass with no position (planning may then require one); the operator asks the write path to refuse; or a reader needs the sequence to name active orders."
}
```

## WO-190-D005 — The console reads the history page as a second section; the parser ends a card at the link definitions and accepts an empty page

```json
{
  "id": "WO-190-D005",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "packages/console: BoardSources gains workOrderHistory, collected from docs/work-orders/HISTORY.md; projectWork projects each page through one indexPage helper into its own section (`work-order-index`, `work-order-history`), both computed before the status and release sections so their rows link to a card on either page; a history card whose id the index already holds makes the history section unavailable before any of its rows enters the shared map, so the board still renders and never produces duplicate navigation targets. parseWorkOrderIndex takes the expected page title (`# Work orders` or `# Work-order history`), takes a card's title only from an inline-link line, ends a card at the next heading or at a `[WO-NNN]: ` definition line, and returns zero rows for a recognized page without cards (an empty queue, a fresh instance's history page). The fixture family's control case reads two new pinned inputs, workOrderIndex-wo190.md and workOrderHistory-wo190.md, split from the 2026-09-07 single-page snapshot with every card's bytes unchanged; the single-page snapshot retains its bytes. A [document] test compares every release row's links over the repository's two pages with those over the single page at the base commit e3b38663, restricted to the release tags that page recorded, and shows the history page is what keeps the settled orders' links.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Design (The page contract the runtime reads is kept), Execution plan step 6, criterion 6, Known issues (the pinned fixture families are regenerated)",
    "The pre-implementation refutation: packages/console/src/text-sources.ts:156-160 read every line to the next heading and took any `[WO-` line as the title, so the last Open card of the planned index page would have been titled by a definition line; the built parser was run on such a page and returned `[WO-199]: WO-199-the-vertical.md` as the title",
    "packages/console/src/board.ts: duplicate navigation targets throw for the whole board, so the duplicate is judged before any history row enters `indexed`",
    "packages/console/test/board.test.ts '[document] WO-190 the index parser …' (title from the inline link, card ends at the definitions, empty page, wrong title refused, overlapping card fails only the history section) and '[document] WO-190 the work view reads both generated pages …' (release links equal those at the base; without the history page they differ); the host-collection test lists the history page and section; the AC5 test asserts a closed order's status row links into the history section",
    "node scripts/console-fixtures.mjs --write after npm run build regenerated the five expected families; packages/console/fixtures/manifest.json records the two new inputs' SHA-256 and the capture sentence"
  ],
  "rejected": [
    {
      "option": "One section over both pages",
      "reason": "ctx.section reports one source's availability; two sources need two statuses, and the release rows only need the shared map."
    },
    {
      "option": "Editing the pinned single-page input in place",
      "reason": "The manifest keeps prior recorded bytes (feedbackUnits-wo126.json, feedbackUnits-wo132.json); loadFixture refuses a changed input."
    },
    {
      "option": "Pinning the repository's real pages as the fixture",
      "reason": "The history page is 702 KB, most of it the tag snapshot; the split snapshot exercises both pages at 54 KB."
    }
  ],
  "reopenWhen": "The console needs settled orders grouped by their four classes rather than one history section; a page title changes; or a third generated page appears."
}
```

## WO-190-D006 — The roadmap is reordered by moving whole sections; the exact order is evidence that retires itself

```json
{
  "id": "WO-190-D006",
  "kind": "experiment",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "docs/product/06-roadmap.md is reordered by moving whole line ranges: the H1 and its two paragraphs, one added sentence that links the generated index as the list of orders in sequence, then the rungs still ahead (the five `Application version pending` rungs with their subsection, v1.0.0 and the post-1.0 horizons), then the closed rungs with their `<!-- prettier-ignore -->` lines, then `## Release boundary` whole, with the generated release history moved from after its first paragraph to the end of the section, which is the end of the document. The two pending headings lose their carrier suffixes (`→ WO-039 + WO-040`, `→ WO-033 + WO-034`) and the matching rows of docs/publication/audience-status-index.md follow; no rung body changes. docs/evidence/WO-190/roadmap-order.json records the heading order, the two renamings and the SHA-256 of the document with the registered block masked to its marker lines. scripts/test-docs-check.mjs asserts durable invariants always (the intro links ../work-orders/README.md; the first level-two heading is a pending rung; every pending rung precedes every released v0 rung and v1.0.0 precedes them too; no pending heading names an order (any WO-NNN), so none names an umbrella record; exactly one ordered marker pair, inside the last section, with nothing after the end marker) and asserts the exact heading order and every rung body's equality with the base commit's in a subtest that runs while the masked hash still matches and retires as a visible skip (exact.skip) once it does not. The block placement was a two-way fork judged by one bounded measurement (below).",
  "question": "With `## Release boundary` moved after the closed rungs, should the generated release history stay right after the section's first paragraph, or move to the end of the section (the order's 'moves to the end')?",
  "alternatives": [
    "Block at the end of the section, which is the end of the document (adopted)",
    "Block right after the section's first paragraph, as at the base"
  ],
  "observation": "Measured on the two layouts with node Buffer offsets (2026-10-09; the first measurement used string indexes and was corrected by the self-review): from the `## Release boundary` heading to its first contract paragraph a reader passes 244 bytes with the block at the end and 38,828 bytes with the block after the first paragraph; the first pending rung starts after 1,474 bytes in either arm (63,915 at the base, the order's own figure) and the first closed rung after 17,436. Both arms pass docs-check's registered-block rule and keep 'the table below' true; only the contract prose's reachability differs, and only in the adopted arm does the generated history sit last as the order's design, step 8 and criterion 7 say.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Design (The roadmap is reordered, not rewritten), Execution plan step 8, criterion 7, Known issues (product 06 is bounded; the generated release history is exempt)",
    "A sorted-line diff of the base and the reordered document shows only the two renamed headings, the three lines of the added sentence and one blank line (the reorder script in the session scratch, run 2026-10-09)",
    "scripts/docs-check.mjs after the reorder: docs/product/06-roadmap.md 41,490 non-exempt bytes against 41,309 at landing and the 45,440 ceiling; the order's cost note said the edit removes more than it adds, which is corrected here: the sentence and its blank line add 221 bytes and the two suffixes remove 40, a net +181 non-exempt bytes (41,309 to 41,490; the file 79,891 to 80,072)",
    "product 07 §Operator-opened planning pass: a planning pass never edits immutable evidence, so a permanent exact-order assertion against this order's JSON would fail the next rung rename with no legal repair; 15 commits since 2026-09-01 changed the roadmap's heading set (the refuters' git log count)",
    "npm run publication:check after the edit: 254/254 product headings indexed; both edition locks refreshed with --print-locks"
  ],
  "budget": {
    "wallSeconds": 120
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 2,
    "tokens": null,
    "commands": [
      "node -e (Buffer.indexOf of the heading, the first contract paragraph, the first pending rung and the first closed rung over the reordered file and git show e3b38663:docs/product/06-roadmap.md)"
    ],
    "source": "two inline node measurements over the two layouts, about two seconds of wall clock; tokens not separately attributable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node scripts/docs-check.mjs; node --test scripts/test-docs-check.mjs"
    ],
    "summary": "A reader of the release boundary reaches its contract prose after 244 bytes instead of 38,828, and the work ahead after 1,474 bytes instead of 63,915; no per-order wall-clock or token effect is claimed."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "rejected": [
    {
      "option": "A permanent exact heading-order assertion against the evidence JSON",
      "reason": "It ties a document that changes at every rung close to a closed order's evidence; the exact checks retire when the masked hash changes."
    },
    {
      "option": "Keeping `## Release boundary` where it was, moving only the block",
      "reason": "Step 8 requires the first heading after the introduction to be the first rung still ahead."
    },
    {
      "option": "Splitting the roadmap into two documents",
      "reason": "Declined by the order: its links and its ceiling are per file, and the reorder gives the reader the same thing."
    }
  ],
  "followup": "Three queued orders cite the two renamed roadmap headings word for word: WO-083 (line 82, the launchpad rung), WO-096 (line 283, the migration rung as a write-back target) and WO-098 (line 64). This order cannot edit another order's bytes without tripping the plan gate; the next planning pass updates the three citations to the headings without the carrier suffixes. Priority: low; no link resolves through them.",
  "reopenWhen": "A planning pass adds, renames or closes a rung (the exact checks retire by themselves and the pass re-records the order if it wants a new exact record); product 10's link to #release-boundary needs the table before the contract prose; or the roadmap exceeds its ceiling."
}
```

## WO-190-D007 — Links into the index and the sentences about it: what moved, what was retargeted, what stays

```json
{
  "id": "WO-190-D007",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Every link or sentence in a living document that cites the generated index was audited (git grep over docs/, the root Markdown files, the package READMEs and the kit templates, excluding the immutable evidence, verification and final-review records). Retargeted because their cited content moved to the history page: docs/PLAYBOOK.md §The loop (header, control, typed dependency and local release evidence of settled orders), docs/planning/work-order-map.md §Status boundaries (the evidence labels live in Sources and limits), docs/product/13-uifa-roles.md (what a release contained), docs/product/07-execution-guide.md §Operator resume phrases (the two sentences the order names, now naming both pages), §Operator recovery controls (a withdrawn order is listed under the history page's Withdrawn section) and §Operator-opened planning pass (the Closed section of the history page is the record of closed sequence entries), docs/product/03-architecture.md §Planning sequence (the same sentence and the withdrawn case), docs/README.md §Map and packages/console/README.md §Sources and limits. Left as they are because they cite the index for what still lives on its page (the sequence, open work, dependency readiness, header observations): work-order-map.md lines 9, 2913 and 3902, budget-window-work-order-ladders.md line 56, the dated source-verification record of 2026-09-08 (a historical receipt citing old line numbers), and the lineage pages, whose README.md is the lineage index. The kit seed text in scripts/launchpad.mjs ('its README is the index') and `worktree start`, which creates a worktree and branch before the umbrella refusal fires, stay with their owners' lanes as follow-ups. scripts/lib/planning-conditions.mjs's `order-index` timer renders both pages. The link check over docs/ and the root Markdown files (scripts/docs-check.mjs, 412 declared historical occurrences, 0 failures) is criterion 8's green check.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, criteria 8 and 9, Execution plan step 9",
    "git grep -n -E 'work-orders/README\\.md|\\]\\(README\\.md' over the living documents (2026-10-09): 14 lines, listed above with their disposition",
    "node scripts/docs-check.mjs after the edits: PASS docs check: 15 product documents; 412 declared historical link occurrences; 0 failures",
    "node scripts/check-publication.mjs --print-locks, then both edition locks replaced; PASS publication bootstrap checks",
    "The recommended placement in the order: WO-075, this order's pair, edits scripts/launchpad.mjs, and WO-072 owns scripts/worktree.mjs"
  ],
  "rejected": [
    {
      "option": "Editing scripts/launchpad.mjs's seeded docs/README.md text and scripts/worktree.mjs in this order",
      "reason": "Both files belong to the pair and to WO-072's lane (the order's recommended placement names the disjoint files); a shared file would make the pair's integration a merge instead of bookkeeping."
    },
    {
      "option": "Retargeting every mention of the index to the history page",
      "reason": "Most citations ask for the sequence, open work or dependency readiness, which the index page still holds; only citations of settled evidence moved."
    }
  ],
  "followup": "Two single-page assumptions stay outside this order's files: scripts/launchpad.mjs line 566 seeds a docs/README.md saying the instance's README is the index, although activation in a kit also generates HISTORY.md (home: WO-075 or WO-077, which edit the kit); and scripts/worktree.mjs `worktree start` creates the worktree and branch before `resume activate` refuses an umbrella record, leaving a worktree to remove (home: WO-072, which owns the worktree lifecycle; a pre-check through umbrellaRecord before `worktree add`). Priority: low for both; the kit seed is prose and the start path refuses before any lifecycle event.",
  "reopenWhen": "A kit instance's reader is confused by the seeded README text; `worktree start` on an umbrella record leaves a worktree behind in practice; or a new document cites the index for settled evidence."
}
```

## WO-190-D008 — The pending rung bodies still name umbrella records; a planning pass retargets them

```json
{
  "id": "WO-190-D008",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Criterion 7 forbids changing any rung's body text, so the pending rung bodies of docs/product/06-roadmap.md keep naming WO-033, WO-034, WO-037 and WO-040, the superseded umbrella records, as the carriers of their work (for example '(WO-040, batch one; later batches from its template)' in the first pending rung). The headings no longer do, the index is the one list of orders, and the residue is recorded here for the next planning pass rather than edited by this order.",
  "evidence": [
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, Observed gap ('The pending rungs name umbrella records and closed orders as their carriers') and criterion 7 ('no rung's body text is changed')",
    "grep -o 'WO-[0-9]\\{3\\}' over the pending rung bodies (lines 25 to 265 after the reorder): WO-040, WO-033, WO-034 and WO-037, found by the self-review adversary (F7)"
  ],
  "rejected": [
    {
      "option": "Rewriting the carrier mentions in the rung bodies now",
      "reason": "Criterion 7 forbids body changes, and the rung-body comparison against the base commit would fail."
    }
  ],
  "followup": "The next planning pass that touches docs/product/06-roadmap.md retargets or drops the umbrella carriers named in the pending rung bodies (WO-033, WO-034, WO-037, WO-040), pointing at the successors the history page's Superseded section lists, and re-records roadmap-order.json if it wants a new exact record. Priority: low; the headings and the index already carry the live list.",
  "reopenWhen": "A reader of a pending rung activates a carrier it names; or a planning pass rewrites the rungs."
}
```

## WO-190-D009 — The console component moves to 0.4.1 with its changed source

```json
{
  "id": "WO-190-D009",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "@dotln/console moves from 0.4.0 to 0.4.1 in packages/console/package.json and package-lock.json, the patch step the order's classification names, because its src/ (collect.ts, text-sources.ts, types.ts, work.ts) differs from the v0.70.0 manifest; the kernel, compiler and skeleton sources are unchanged and keep their versions. `release prepare --local` assigns the application target only (D001); the component bump is this record.",
  "evidence": [
    "node scripts/release.mjs check-surfaces --local before the bump: 'FAIL component-version @dotln/console: src changed; observed 0.4.0; previous v0.70.0 0.4.0; expected a different version' (the self-review adversary's F1, the release-surfaces row of npm test); after the bump the same command passes",
    "docs/product/06-roadmap.md §Release boundary: execution must move a component package version whenever that component's src/ differs from the preceding release",
    "git show e5bfcaea --stat (Prepare v0.69.2 with skeleton 0.55.1): the precedent touches the package and the lockfile"
  ],
  "rejected": [
    {
      "option": "A minor step (0.5.0)",
      "reason": "The console gains a second source of an existing view and a parser fix; no new runtime capability."
    }
  ],
  "reopenWhen": "A later edit in this order changes another package's src/, or the release close reports a component mismatch."
}
```

## WO-190-D010 — Follow-up rows that name a file this order touches are left in place

```json
{
  "id": "WO-190-D010",
  "date": "2026-10-09",
  "dispatch": "resume: next; implementation-ready advisory",
  "decision": "The completion advisory named 29 pending follow-up rows that match, by text, a file this change touches or this order's id. Four are this order's own records (FUP-1a12e83d22825ee3 from D003, FUP-168dc7b8d999574b from D006, FUP-bd3e66761dc301ed from D007, FUP-0e82c9b04b051f66 from D008). The other 25 are left in place: their causes lie in files this order edits only in passing (product 07's sentences on the index, product 03's planning paragraph, scripts/resume.mjs's activation step, scripts/lib/meta.mjs's size paths, the roadmap's order) or in surfaces this order does not touch, and none falls inside the Boy Scout bound of a bounded fix that keeps the diff legible. Open rows left: FUP-0a7c93eed06727ce (WO-187-D013, product 07's size), FUP-1315c82ef74fb832 (WO-187-D052, the verify briefing), FUP-67a07b670440cf5a (WO-187-D045, findings-block fields), FUP-f1c7a256bec46737 (WO-054-D006, cold-start ceilings), FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost over closed history; this order moves the settled cards to a second page but index --check still renders both pages, so the row stands). Deferred rows left: FUP-0086, FUP-406744f5e9966250, FUP-4b70089b028849f0, FUP-51c310284c2fea17, FUP-6d91d100269519d7, FUP-7f9a27e6ed6c44b3, FUP-8111fc3dd4c22331, FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-b3454d6ce3594ef3, FUP-bfab19adc5e5eac1, FUP-c95ffe4a84e49cbb, FUP-dc58e92c5cafc732, FUP-fa028783f3f6b17f, FUP-fd05316b6030ef73. Untriaged rows left: FUP-06de60fa5d19fe5a and FUP-e624167a7f6555f6 (WO-074's kit follow-ups), FUP-16a4af39c710459b and FUP-5e52eb500e395237 (WO-186's planning questions).",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-190, followed through its cursor on 2026-10-09: 29 rows (5 open, 15 deferred, 9 untriaged)",
    "The completion advisory of the first implementation-ready attempt: 'fix a row inside the Boy Scout bound or record it as left in the order's decisions, never widen the order'",
    "docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md Non-goals: the front page, what a card prints, the sequence file's text, generating rungs, and any change to closing, withdrawing or release evidence"
  ],
  "rejected": [
    {
      "option": "Closing FUP-fb8cbeabbddef397 (ER4-005) on the strength of the smaller index page",
      "reason": "The gate's cost is unchanged: index --check renders and compares both pages, and the history page holds every settled card and the tag record."
    }
  ],
  "reopenWhen": "The final review disposes a listed row whose seam this order closed; or a later order that edits the same files takes one of the rows."
}
```

## WO-190-D011 — Verification boards the stale description of the roadmap test

```json
{
  "id": "WO-190-D011",
  "date": "2026-10-09",
  "dispatch": "resume: verify",
  "decision": "Record VER-001 F1 as a minor evidence-description follow-up. D006's decision text still describes a repository umbrellaRecord scan and a printed notice when the exact roadmap check retires. The final scripts/test-docs-check.mjs instead rejects every WO-NNN in a pending heading without scanning umbrella records, and retires its exact heading/body subtest with exact.skip. The implementation and roadmap-order.json agree, and the exact subtest ran successfully with zero skips during this verification; no acceptance criterion or prior behavior is broken by this stale description.",
  "evidence": [
    "scripts/test-docs-check.mjs: the pending-heading assertion uses /WO-\\d{3}/; the exact subtest calls exact.skip when the masked hash differs",
    "docs/evidence/WO-190/improver.md F2 and F5: the executor dispositions record the visible skip and removal of the redundant umbrella scan",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-190' scripts/test-docs-check.mjs packages/console/dist/test/board.test.js packages/skeleton/dist/test/runtime-status.test.js: 5 passed, 0 failed, 0 skipped, 2026-10-09T13:53:29Z"
  ],
  "rejected": [
    {
      "option": "Fail a criterion because this description lags the final self-review fixes",
      "reason": "The original criteria hold on executed evidence; the discrepancy describes stronger implemented checks and is a follow-up under product 07's verification rule."
    },
    {
      "option": "Rewrite the executor's recorded decision during independent verification",
      "reason": "Preserve the judged source and identify the correction in this verifier's evidence."
    }
  ],
  "followup": "WO-190 final review or the next evidence-maintenance pass: align D006's roadmap-test description with the current general WO-NNN assertion and visible exact.skip retirement. Preserve the heading/body checks and their recorded result. Priority: low; this is evidence prose, with no failing criterion or executable regression.",
  "reopenWhen": "An actor next updates D006 or changes the roadmap test; the exact check retires before final review, requiring the reviewer to distinguish the current invariant checks from the recorded landing check."
}
```

## WO-190-D012 — Integration at final review: main moved by WO-188; the release target, the console version, sixteen comments and one Git spawn reconciled

<!-- integration refs/dotln/checkpoint/WO-190/6 -->

```json
{
  "id": "WO-190-D012",
  "date": "2026-10-09",
  "dispatch": "resume: final review; worktree integrate WO-190",
  "decision": "Integrate main into the WO-190 worktree at final review. The branch base was e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc and main had moved to 298c2c77cab9b413d43a6f758bcab1b55aae011a (WO-188: twenty-four boarded machinery items, the v0.71.0 release preparation with compiler 0.26.0, skeleton 0.56.0 and console 0.4.1, and its lifecycle records), so the helper checkpointed the work (checkpoint 6), kept the named stash 704e2c4d779853df2fb4c3023cbb987b63bef902, fast-forwarded the uncommitted branch and re-applied the stash. One authored conflict, packages/console/fixtures/manifest.json: both sides appended a sentence to the manifest's capture string (main the WO-188 feedback-001 recording, this order its two-page split note); resolved by keeping main's string whole and appending this order's sentence after it, so neither recording is lost; the JSON parses, the control case still names both WO-190 inputs, and the regenerated console fixtures match. Main's edits to scripts/work-orders.mjs, scripts/lib/dependencies.mjs, packages/console/src/collect.ts and scripts/resume.mjs are comment rewordings; its additions to scripts/lib/meta.mjs, scripts/lib/worktree-integration.mjs and the five shared suites sit beside this order's; all merged without conflict. Two retimes under the recorded patch classification and two reconciliations, all bookkeeping and none a finding: the application target moves from v0.70.1 to v0.71.1 (release preparation; D001's reopening condition, because WO-188 published v0.71.0 at main's head); the console component of D009 moves from 0.4.1 to 0.4.2 in packages/console/package.json and package-lock.json, because v0.71.0 consumed 0.4.1 and this order's console src/ differs from that release, with the compatibility impact D009 declared unchanged (a second source of an existing view and a parser fix); and sixteen comment lines in nine of this order's files (scripts/work-orders.mjs four, scripts/test-work-orders.mjs five, scripts/lib/dependencies.mjs, scripts/resume.mjs, scripts/test-derived-orders.mjs, scripts/test-plan-refutation.mjs, scripts/test-resume.sh, packages/console/src/types.ts, packages/console/test/board.test.ts) that led with an order identifier, refused by main's new comment-labels document row (WO-188 D025), now lead with their explanation and carry the identifier after it: comment text only, in files no evidence edition registers, so no edition is staled; and the roadmap test in scripts/test-docs-check.mjs, which read the base commit's document through spawnSync('git', ['show', …]), now calls spawnGit from scripts/lib/git.mjs with the same arguments and options, because main's helper-reuse test (scripts/test-helper-reuse.mjs, in the process-debt suite) refuses a direct Git spawn under scripts/, which failed the first review gate at the integrated identity (34 passed, 1 failed); the call's result and the assertions on it are unchanged. Carried-forward claims: criteria 1 to 10 at the integrated subject. Main changed none of this order's primary surfaces beyond the comment rewordings above; the roadmap, the sequence and this order's evidence are untouched by main; the claims were re-derived at the integrated tree by the affected checks below, and the review gate's row at the integrated code identity is recorded in FINAL-001.",
  "evidence": [
    "npm run worktree -- integrate WO-190 --intake-backup <session scratch>/DotLn-wo190-intake-20261009T154551Z.zip (npm run backup:intake into the session scratch, 3 files): checkpoint refs/dotln/checkpoint/WO-190/6; stash 704e2c4d779853df2fb4c3023cbb987b63bef902; one authored conflict; --continue regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation, the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures",
    "node scripts/release.mjs check-surfaces --local before the console retime: 'FAIL component-version @dotln/console: src changed; observed 0.4.1; previous v0.71.0 0.4.1; expected a different version'; after it every row passes",
    "node scripts/comment-labels.mjs before the rewording: 16 failures (comment order-lead) in nine files; after: 0 failures, 81 baselined lines unchanged; prettier reformats nothing",
    "npm test -- --review at code identity 4939b97a8d91e44bb8d74ddd7a860b0524313bb0f7f195e1479c7fe1996e207d (2026-10-09T16:26:34Z, 1,493.7 s, 87 fresh tasks): 34 passed, 1 failed; the process-debt suite's only failure was 'scripts/test-docs-check.mjs: spawns git directly; use spawnGit, execGit or runGit from scripts/lib/git.mjs'; after the swap, node --test scripts/test-helper-reuse.mjs passes 5 of 5 and the two WO-190 docs-check tests pass with the exact subtest live; the gate was rerun at the new identity (FINAL-001 §Executed checks)",
    "Affected checks at the integrated tree, 2026-10-09: npm run publication:check (254/254 headings; both outlines CURRENT); node scripts/harness.mjs check (34 generated surfaces); node scripts/work-orders.mjs index --check (both pages current); node scripts/docs-check.mjs (0 failures); bash scripts/test-work-orders.sh (24 passed); node --test --test-name-pattern='WO-190' over scripts/test-docs-check.mjs, the console board test and the skeleton runtime-status test (5 passed, 0 skipped: the exact roadmap subtest ran); node scripts/console-fixtures.mjs --check (five families match); the verification baseline contrast replayed (accepted at 08845c71, refused without event now); git diff --check clean; npm test -- --review at the integrated identity: FINAL-001 §Executed checks",
    "git diff --name-only e3b38663 298c2c77: 266 files, 25 shared with this order's change; docs/product/06-roadmap.md, docs/planning/sequence.md and docs/evidence/WO-190 are not among main's changes"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep the console at 0.4.1 and let release close report the mismatch",
      "reason": "check-surfaces refuses it now, and D009's reopening condition names exactly this collision."
    },
    {
      "option": "Baseline the sixteen comment lines instead of rewording them",
      "reason": "D025's baseline holds registered files only and only shrinks; these files are registered by no edition, and the rule's remedy is the rewording."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification. The release target or the console version collides again before publication."
}
```

Integration date: 2026-10-09. Original base: `e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc`.
Fetched main: `298c2c77cab9b413d43a6f758bcab1b55aae011a`. Checkpoint: `refs/dotln/checkpoint/WO-190/6`.
Named stash retained: `704e2c4d779853df2fb4c3023cbb987b63bef902` (WO-190 integrate 2026-10-09).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-190: v0.70.1 → v0.71.1 above the observed release baseline v0.71.0. Files changed: docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md, README.md, docs/evidence/WO-190/meta.json, docs/final-reviews/WO-190/PR.md. Meter snapshot: docs/evidence/WO-190/meta.json, 4291 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 10 at the integrated subject, re-derived by the affected checks the record names and judged in FINAL-001.
Authored conflicts observed: packages/console/fixtures/manifest.json.
Affected checks: run at the integrated tree; results in the record above and in FINAL-001 §Executed checks.

## WO-190-D013 — Final review aligns D006's description of the roadmap test with the implemented checks

```json
{
  "id": "WO-190-D013",
  "date": "2026-10-09",
  "dispatch": "resume: final review",
  "decision": "D006's decision text is corrected in place, as D011's follow-up (FUP-72a61540baa55755) asked of the final review. What was misread: the test's state before the executor's self-review fixes. What was meant: the implemented test. What changed: two clauses. The pending-heading assertion is now described as written, a rejection of any WO-NNN in a pending heading (so none can name an umbrella record), with no scan of the repository's umbrella records; the exact heading-order and rung-body subtest is described as retiring with a visible exact.skip once the masked hash no longer matches, not as printing a notice. D006's observation, evidence, alternatives, follow-up and reopening condition are unchanged, so its register entry (FUP-168dc7b8d999574b) keeps its key and records the new revision. FUP-72a61540baa55755 is settled by this record.",
  "evidence": [
    "scripts/test-docs-check.mjs 'WO-190 the roadmap leads with the work ahead …': the pending-heading loop asserts doesNotMatch /WO-\\d{3}/; the subtest calls exact.skip('retired: …') when the hash differs",
    "docs/evidence/WO-190/decisions.md D011 and docs/verifications/WO-190/VER-001.md F1: the discrepancy and its route",
    "node --test --test-name-pattern='WO-190' scripts/test-docs-check.mjs at the integrated tree, 2026-10-09: the exact subtest ran and passed (0 skipped)"
  ],
  "rejected": [
    {
      "option": "Leave the stale description to the next evidence-maintenance pass",
      "reason": "The follow-up names the final review first; the fix is two clauses of evidence prose in this order's own decisions file and keeps the diff legible."
    },
    {
      "option": "Append the correction and leave D006's text as filed",
      "reason": "A reader of D006 would still meet the wrong description; the correction is recorded here and the text fixed where it is read."
    }
  ],
  "reopenWhen": "The roadmap test changes again; D006's description then follows it, or a new record says why not."
}
```
