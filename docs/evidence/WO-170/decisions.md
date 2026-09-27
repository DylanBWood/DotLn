# WO-170 decisions

## WO-170-D001 — One collection serves the meter block and the snapshot

```json
{
  "id": "WO-170-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "release prepare writes the order's snapshot from the one collectMeta call that already renders the pull-request meter block; no targeted collection of the order's row is added.",
  "question": "Does release prepare need a separate, cheaper collection of the order's own row for the snapshot, or can the snapshot reuse the collection the meter block already makes?",
  "alternatives": [
    "Reuse the single collectMeta result for both the meter block and the snapshot.",
    "Add a targeted collection that computes only the order's row for the snapshot."
  ],
  "observation": "Three runs of collectMeta on the unmodified source in this worktree, 2026-09-27T20:36:45Z to 20:36:46Z: 185 ms, 199 ms and 198 ms, six orders each, 159,462 bytes of meter. Pre-registered threshold: add the targeted collection only if the median is 10 s or more, because release prepare runs at least twice per order. The median is 0.2 s.",
  "budget": { "wallSeconds": 300 },
  "execution": "run",
  "cost": {
    "wallSeconds": 6,
    "tokens": null,
    "commands": [
      "node --input-type=module -e '<import scripts/lib/meta.mjs; time collectMeta(cwd)>' (three times)"
    ],
    "source": "Shell timestamps from the pre-registration check at 20:36:40Z to the last run at 20:36:46Z; the runs' own timings in session scratch wo170-experiment.jsonl. Recording here was not timed separately. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["npm run release -- prepare --local"],
    "summary": "No saving claimed: the kept method adds no collection, and a second one would have cost about 0.2 s per prepare."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-25", "experimentsSinceAdoption": null },
  "evidence": [
    "scripts/release.mjs prepare: one collectMeta(toolRoot) feeds renderMetaTable and writeOrderSnapshot",
    "docs/evidence/WO-169/decisions.md WO-169-D001: the latest adopted improvement is dated 2026-09-25 (WO-159); the count of experiments since is recorded by no one source, so it stays null"
  ],
  "rejected": [
    {
      "option": "A targeted collection of the order's row",
      "reason": "A second code path for the same values, to save well under a second per prepare."
    }
  ],
  "reopenWhen": "collectMeta takes 10 s or more in an order's worktree, or release prepare is run on every tool call."
}
```

## WO-170-D002 — The snapshot is the order's own row, bounded, written where its journals are

```json
{
  "id": "WO-170-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "release prepare writes docs/evidence/WO-NNN/meta.json beside the meter block, from the same collection, only when the checkout holds a session journal of the order; otherwise it writes no snapshot and prints 'Meter snapshot not written: this checkout holds no session journal of WO-NNN.' The file holds the order's own row: its metrics, its corrections with their source, its operator directions, its usage totals by role, its dispatch rows with their observed values (an absent value reads unavailable), and its declared supports; no other order, no deltas, no usage rows, no cold-start profiles and no document sizes. It is indented to the row's fields, and a dispatch row, a role's totals or a unit map stays on one line. A snapshot over 8,192 bytes is not written, and the command says so. A later prepare replaces it. A closed or withdrawn order's snapshot is never rewritten ('WO-NNN is closed; its committed snapshot is its record'), because the meter reads no journal of a closed order (D003) and main holds a release-close journal of each. meta --write docs/evidence/WO-NNN/meta.json writes the same row under the same conditions; meta-baseline.json keeps the whole meter.",
  "evidence": [
    "scripts/lib/meta.mjs orderSnapshot, snapshotText, writeOrderSnapshot; scripts/release.mjs prepare; scripts/meta.mjs --write",
    "scripts/test-release.sh release_case_prepare_independent: no journal, no snapshot and the message; with a journal, the order's row of at most 8 KB is written and listed beside PR.md",
    "scripts/test-process-debt.mjs 'WO-170 the order's snapshot is its own bounded row, written only where its journals are': six roles with every per-role value observed and 24 named correction units fit; the snapshot reads back as the order's row once the journals are gone; meta --write refuses a closed order and a checkout without a journal, then writes the row",
    "Measured: pretty JSON of that heaviest fixture was 9,282 bytes and the bound refused it; with the one-line inner objects it is written. This order's own snapshot was 2,784 bytes mid-implementation; the largest recovered snapshot is 3,550 bytes (WO-043)",
    "In a first measurement the cold-start profiles (1,064 bytes) and document sizes (803 bytes) were a third of this order's 5,624-byte snapshot; metrics.coldStartBytes keeps the order's measured cold start"
  ],
  "rationale": "Mission and critical path: the meter is the record a planning pass reads to judge whether machinery removed operator rescue; without a committed per-order row, every order closed after its worktree left read null or a false zero (shifting the burden, seeking the wrong goal). Rule beating: the fixtures assert the values read back after the journals are deleted, and a checkout without a journal writes nothing, so the file cannot be produced from nothing. Commons and drift: 8 KB per order, measured, instead of about 100 KB for a whole meter. Policy resistance and escalation: no gate, refusal or schema change; release prepare keeps its preconditions and message lines, adding one. Success to the successful: the whole-meter snapshot was the existing mechanism and was rejected on size. Naive Interventionism: the existing reader shape (snapshot.orders[].workOrder) is kept, so the old snapshots read unchanged and the cost reconciliation reads a usage-only snapshot as no historical metrics; reversible by deleting the files. NoOp keeps every later order unavailable on main.",
  "rejected": [
    {
      "option": "A whole-meter snapshot per order",
      "reason": "The order declines it: about 100 KB each, and it holds other orders' rows."
    },
    {
      "option": "Plain two-space JSON",
      "reason": "The heaviest fixture exceeded 8 KB on indentation alone."
    },
    {
      "option": "Keep cold-start profiles and document sizes in the snapshot",
      "reason": "Neither is in the order's list of what the snapshot holds, together they were a third of the row, and the cold-start maximum stays in metrics."
    },
    {
      "option": "Write the snapshot at release close",
      "reason": "The order declines it: the worktree and its journals may be gone, which is the defect."
    }
  ],
  "reopenWhen": "A written snapshot is refused for size on a real order, or a planning pass needs a per-order value the row does not hold."
}
```

## WO-170-D003 — After the close, journal values come from the snapshot or read unavailable

```json
{
  "id": "WO-170-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "For an order that is not closed, the checkout's session journals win, as before. For a closed order the checkout's journals are not read: journal-derived values (guard and Stop refusals, corrections, commands, steps, bytes read into context, authorship and hook timing, overall and per role) come from the order's snapshot row, and otherwise read unavailable. A snapshot written from journals (corrections labelled session-journal) supplies them all; the row of an earlier whole-meter snapshot (WO-043, WO-049, WO-126) supplies its journal values but not its corrections, which were the old decision count. A closed order's commands and steps never come from usage activity, which on main is the release-close session; the usage totals by role keep them with their source. A correction count computed from no journal is null with source 'unavailable', never 0. The row names where its journal values came from in source.journals.",
  "evidence": [
    "The main checkout's journals, read-only on 2026-09-27: every closed order that has one holds release-close rows only (for example WO-164 335 rows, WO-165 458, WO-169 399), plus planner and unlabelled sessions",
    "Under the order's literal order (live journals first) the first implementation reported, on main, corrections 0 and guard refusals 2 for WO-169 from its release-close session alone, while a planning worktree, which holds no journal of a closed order, would read the snapshot: the two checkouts disagree and one presents a single session as the order",
    "scripts/test-process-debt.mjs 'WO-170 a closed order's snapshot stands for its journals, and with neither they read unavailable': a release-close journal with a refusal, a Stop refusal and a correction is ignored for the closed order; without a snapshot each journal value is null and the table shows 'unavailable'; with one, the snapshot's guard refusals, Stop refusals, corrections, commands, steps and bytes are reported; 'WO-141 meter retains only journal-derived historical correction counts' now reads null for a legacy snapshot",
    "The committed cost table of 2026-09-27 lists operatorCorrections 0 with source session-journal for WO-070, WO-115, WO-165, WO-085 and WO-166, from correctionCounts([])",
    "Review before the gate (D012): with the usage fallback, main reported step counts of 491 to 874 for five closed orders whose journal source was unavailable, from release-close and recovered usage activity; a legacy row without corrections crashed the reader once journal values were read from it (caught by the fixture)"
  ],
  "rationale": "The order's Design ranks live journals before the snapshot. That ranking holds in the order's worktree; after the close, the only journal a checkout can hold of the order is a later session's, so honouring it literally would replace the snapshot on main with the release-close session for every order closed after this one, which defeats the objective. Reading closed orders from committed files alone also makes main and a planning worktree report the same values. A closed order without a journal snapshot (every order closed before this one) now reads unavailable on main where it read the release-close session.",
  "rejected": [
    {
      "option": "Live journals first, literally",
      "reason": "On main a release-close journal would stand for the whole order and override its snapshot."
    },
    {
      "option": "The snapshot plus journal rows recorded after its cutoff",
      "reason": "About 2,200 of 85,248 journal rows on main carry no timestamp, and the sum would count a later session into the order's record."
    }
  ],
  "reopenWhen": "A closed order's worktree journals are retained somewhere a checkout reads, or a planning pass needs release-close session behaviour per order."
}
```

## WO-170-D004 — Usage by role: this checkout, then the snapshot, then the retained copy

```json
{
  "id": "WO-170-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Usage is chosen per role: this checkout's usage observations when it holds any for the role; otherwise the snapshot's usage totals for the role; otherwise the rows of the retained usage copies in docs/control/local/retained/WO-NNN (process/usage.jsonl and preservation's .from-WO-NNN names). Order tokens and cost sum over the chosen sources with the existing rule, one unknown dispatch keeping the total unknown; the snapshot's own order total is read only when no role has a source, so a prepare-time total never stands in for an unknown later dispatch. The row carries usageByRole with each role's totals and source, source.usage names every role's source, and the text meter prints 'Usage by role' lines and marks retained rows.",
  "evidence": [
    "scripts/test-process-debt.mjs 'WO-170 a retained usage copy supplies the order's tokens by role and names its source': 154 tokens from two copies, a non-usage file ignored; with a live release-close row and a snapshot verifier total, each role keeps its own source (162); one unknown dispatch makes the total unknown; 'WO-170 a closed order's snapshot stands for its journals…': an unknown release-close dispatch makes the total unknown although the snapshot's metrics.tokens is 999; 'WO-170 a retained lane is read without following links or failing on a torn line'",
    "Main's own usage file holds release-close, planner and refuter rows (251 rows on 2026-09-27); executor, verifier and reviewer rows exist only in the retained copies",
    "WO-166: its pull-request body records 82,672,267 tokens at release prepare; its retained copy gives 105,946,825 (executor 52,837,626, verifier 29,743,726, reviewer 23,365,473), because the reviewer's usage rows were recorded after prepare (the PR body shows the reviewer at 90,915)"
  ],
  "rationale": "The order's ranking is kept. Per-role choice lets main add the release-close usage it observes itself to the snapshot's worktree roles without double counting, because a role's rows live in one place. Known limit, recorded for the planner: a snapshot written by the reviewer's release prepare holds the usage recorded before it, and outranks the fuller retained copy for those roles; the refresh after the order's last usage row is the open register row FUP-dc6c139003bd4b89, which this order does not duplicate.",
  "rejected": [
    {
      "option": "The retained copy before the snapshot",
      "reason": "The copy is local and pruned; main would report one figure until a prune and another after it, and a planning worktree never sees the copy."
    },
    {
      "option": "One order-level source for all usage",
      "reason": "On main it would drop either the release-close rows or the worktree roles."
    }
  ],
  "reopenWhen": "A planning pass compares an order's tokens across checkouts and finds the prepare-time snapshot misleading, or FUP-dc6c139003bd4b89 is taken up."
}
```

## WO-170-D005 — What counts as an operator direction

```json
{
  "id": "WO-170-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "operatorDirections is computed on every checkout from committed files: the order's decision records whose dispatch begins with 'scope expand:', 'operator override:', 'analysis:' or 'conversation only:'; records filed before the docs check that begin with 'operator' in either case, except a lifecycle dispatch 'Operator resume:' (or 'Operator's resume') that names no direction, that is none of the four control phrases and no word beginning 'direct' or 'correct'; and the order's OperatorOverrideRecorded, RecordCorrected and CriterionWaived events. Each record counts once. The value is a number, 0 when none is recorded, with a byKind breakdown and its source; it is a column of the meter table, an indicator of the shifting-the-burden signal and a directions list beside its corrections, and closedDirections lists it for every closed order, with one text line, whatever the meter's five-order window. The snapshot copies it; the reader recomputes it.",
  "evidence": [
    "scripts/docs-check.mjs validDispatch: since WO-085 every unbaselined dispatch carries one of seven control prefixes, so only baselined records can begin with another 'operator' form",
    "Count at main (cb526f1d), 871 decisions: scope expand 17, operator override 3, analysis 0, conversation only 0, legacy operator labels 51 (13 lowercase, 33 capitalized, such as 'Operator correction during resume' and 'Operator direction 2026-09-13 during resume', and five lifecycle dispatches naming a direction: WO-125-D003, WO-125-D005, WO-126-D005, WO-128-D009, WO-129-D001); 49 lifecycle dispatches not counted; no off-ramp event yet; 25 orders with at least one",
    "The five orders closed on 2026-09-25 and 2026-09-26, as main computes it (closedDirections from collectMeta on the main checkout with this order's library): WO-070 0, WO-115 0, WO-165 0, WO-085 2, WO-166 2 (all four are scope expand: dispatches to merge or integrate main)",
    "scripts/test-process-debt.mjs 'WO-170 operator directions equal a hand count of committed decisions and off-ramp events': two scope expand, one operator override and one RecordCorrected give 4; an order with none gives 0; the table, the text meter and the trap carry it; the legacy rule counts three of eight forms"
  ],
  "rationale": "The order's words are 'begin with operator', and its gap counted 13 lowercase labels. Reading the rule case-sensitively would leave out 33 records that are plainly the operator correcting or directing the work, from the orders of 2026-09-09 to 2026-09-24, while counting every capitalized lifecycle dispatch would add 49 ordinary dispatches; five of the 54 lifecycle dispatches carry a direction in their own words and count. The count measures how often the operator stepped in, not whether that was a fault (operator-review assumption 1); no threshold is attached.",
  "rejected": [
    {
      "option": "Lowercase 'operator' only",
      "reason": "Leaves out 33 capitalized corrections and directions."
    },
    {
      "option": "Every dispatch beginning with 'operator' in any case",
      "reason": "Counts 49 'Operator resume:' lifecycle dispatches that are only the ordinary dispatch every order has."
    },
    {
      "option": "Count an operator override twice when both its decision and its OperatorOverrideRecorded event exist",
      "reason": "Kept as two records: the order's criterion counts decisions and events separately, and no override event exists yet to show the pairing."
    }
  ],
  "reopenWhen": "A planning pass finds a counted record that is not an operator direction, or a direction the record holds that is not counted."
}
```

## WO-170-D006 — Intake captures are counted per planning pass, not per order

```json
{
  "id": "WO-170-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "The meter counts, for each dated planning pass section of docs/lineage/idea-ledger.md, the distinct paths under the configured intake root it cites (never their text; a trailing full stop or comma is not part of a path, and a fenced line is not a heading) and lists them as planningCaptures on the shifting-the-burden signal and as one text line. They are not added to any order's operatorDirections.",
  "evidence": [
    "25 dated planning pass sections on 2026-09-27; distinct intake paths and SHA-256 citations agree for 21 and differ for four (2026-09-25 second judgment 1 path and 0 hashes, 2026-09-12 1 and 2, 2026-09-08 4 and 5, 2026-09-04 1 and 0)",
    "No committed record ties a capture to one order: a pass files several orders, and a full-scope refutation receipt judges nearly all of them",
    "scripts/test-process-debt.mjs directions test: a pass citing one note twice (once at the end of a sentence) and another once counts 2; a fenced planning-pass heading and an ideation section are not passes"
  ],
  "rationale": "The order's Cost line counts the captures a planning pass cites; its criteria count decisions and events per order. A capture attributed to every order a pass filed would multiply one operator message.",
  "rejected": [
    {
      "option": "Count SHA-256 citations",
      "reason": "A section can cite a capture's path without its hash, and cite other hashes."
    },
    {
      "option": "Attribute a pass's captures to each order it filed",
      "reason": "One capture would count once per order."
    }
  ],
  "reopenWhen": "The ledger records captures in a structured field, or a pass needs captures per order."
}
```

## WO-170-D007 — The one recovery: 77 retained copies, 37 closed orders without one

```json
{
  "id": "WO-170-D007",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "For every closed order with a retained usage copy in the main checkout, docs/evidence/WO-NNN/meta.json now holds its usage totals by role and, in usageCopies, the lane path, SHA-256 and row count of each copy whose every row it carries; a copy holding a row it does not carry (another order's, or a line that is not JSON) is listed in uncarriedCopies without a digest, so the prune keeps that lane. That is WO-067's copy, whose five planning rows (workOrder null, two sessions of 2026-09-15) exist nowhere else. An order whose existing snapshot or baseline has its own row (WO-043 and WO-126 meta.json, WO-049 meta-baseline.json) keeps that row's metrics, corrections, observed dispatch values and declared supports, and gains the recovered totals; its whole-meter file is replaced by that bounded row, and the baselines are not touched. The closed orders with no retained usage copy are WO-003 to WO-013, WO-015 to WO-032, WO-038, WO-039, WO-041, WO-042, WO-101, WO-108, WO-109 and WO-127: no snapshot is available for them.",
  "evidence": [
    "docs/evidence/WO-170/recovery.json: 114 closed orders, 77 snapshots, 2,262 usage rows, the largest snapshot 3,550 bytes, the list of the 37 without a copy; written by one run of recoveredUsageSnapshot and snapshotText against the main checkout (docs/evidence/WO-170/README.md gives the script)",
    "The order counted 73 copies and 2,141 rows; the four more lanes (WO-169, WO-168, WO-171 and WO-164) were created on 2026-09-27 before this order's activation at 20:29:23Z, and no lane was created after it; without them the rows are 2,141 (executor 791, verifier 876, reviewer 458, release-close 11, planner 5)",
    "37 of the 77 orders have at least one role whose total is unknown, because a harness row with unavailable counters carries dispatch scope; their totals stay null for that role",
    "WO-171's prune releases a lane only when HEAD's meta.json names each copy's digest (harness-prune.mjs usageRetention), and its fixtures name them in a top-level usageCopies list; the register row FUP-dc6c139003bd4b89 asks this order to choose that field",
    "scripts/test-process-debt.mjs 'WO-170 recovery carries usage totals by role and each retained copy's digest, keeping a whole-meter row': a copy with another order's rows and a copy with a torn line are listed without their digest",
    "Review before the gate (D012): the first run named WO-067's copy in usageCopies, which after the merge would have let the prune delete the only record of those planning rows; WO-067's snapshot was rewritten with the first run's recovery time, and the rule changed none of the other 76"
  ],
  "rationale": "The order's recovery writes usage totals and nothing else; for the three orders that already had a row, 'nothing else' would have dropped the metrics the meter reads for them today, and keeping their whole-meter files would leave WO-043 and WO-126 over 8 KB (116,758 and 96,881 bytes) and their lanes retained. The kept row is theirs, unchanged. VER-002 of WO-043 cites an earlier observation of that file, which the file had already stopped holding before this order (WO-171-D004 records a later one).",
  "rejected": [
    {
      "option": "A reusable recovery command",
      "reason": "The order asks for one recovery; the function is exported and tested, and the run is recorded."
    },
    {
      "option": "Leave WO-043 and WO-126 as whole-meter files",
      "reason": "Over 8 KB and without the digests, so criterion 5 fails for them and the prune never releases their lanes."
    },
    {
      "option": "Usage totals only, for WO-043, WO-049 and WO-126 too",
      "reason": "The meter would stop reading their recorded gate, read and cost metrics."
    }
  ],
  "reopenWhen": "A retained copy changes after this recovery, or a lane is found that the recovery did not read."
}
```

## WO-170-D008 — The prune reads digests only from usageCopies

```json
{
  "id": "WO-170-D008",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "usageRetention in scripts/lib/harness-prune.mjs releases a lane only when every usage copy's SHA-256 is the sha256 of an entry of the committed snapshot's top-level usageCopies list, instead of anywhere in its text.",
  "evidence": [
    "Register row FUP-50cda1c03ecd8ea8 (WO-171-D014), deferred until 'WO-170 or any other producer writes a SHA-256 into meta.json'; this order is that producer",
    "scripts/test-harness.mjs 'WO-171 a lane holding a usage copy is retained until a committed snapshot carries it': a committed snapshot naming the digest under another key keeps the lane; it fails against the substring rule (checked by restoring that rule in place and rerunning) and passes with the field rule; all nine WO-171 prune tests pass"
  ],
  "rationale": "Adjacent repair within this order's bound: the reopening condition fires with this order, the fix is nine lines in the one function, and the fixture shape WO-171 wrote already names the field. The row's second defect, a proof partial left beside a whole proof, is untouched and stays with the row.",
  "rejected": [
    {
      "option": "Leave the substring match",
      "reason": "A snapshot that names a skipped copy's digest would release its lane."
    }
  ],
  "reopenWhen": "A producer needs to carry a copy's digest outside usageCopies."
}
```

## WO-170-D009 — The committed cost table is not regenerated by this order

```json
{
  "id": "WO-170-D009",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "docs/planning/cost-table.json stays as the 2026-09-27 pass wrote it. The series reaches it through trapRows, whose traps meta --plan-cost copies whole: the next planning pass's --plan-cost carries operatorDirections, the directions list and the planning captures on the shifting-the-burden signal, for the orders it lists, within the unchanged 64 KB bound.",
  "evidence": [
    "Receipt 2026-09-27-planning-c559862e028dfb80-032 is a goal review whose evidenceHash is built from the cost table's trap values (scripts/lib/plan-subject.mjs), and scripts/lib/plan-continuation.mjs refuses a changed hash, so regenerating the table fails plan check in npm run test:docs",
    "scripts/meta.mjs --plan-cost: traps: meta.traps",
    "scripts/test-process-debt.mjs directions test asserts the shifting-the-burden indicator and directions list from collectMeta"
  ],
  "rationale": "The table is a planning pass's output bound to that pass's receipt; rewriting it from an executor worktree would break the pass's record for a value the next pass recomputes.",
  "rejected": [
    {
      "option": "Regenerate the table now",
      "reason": "Breaks the plan check and rewrites another dispatch's evidence."
    }
  ],
  "reopenWhen": "The next planning pass runs --plan-cost and the series is missing or unreadable."
}
```

## WO-170-D010 — Product 07 edited in place within its 49-byte headroom

```json
{
  "id": "WO-170-D010",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Product 07's sentence on the meter's shifting-the-burden row now says it counts the journal's events from the order's meta.json once its journals are gone, and the operator's prefixed or off-ramp directions, without automatic consequence; the superseded clause about decision documents is removed. Net +40 bytes.",
  "evidence": [
    "docs/control/doc-ceilings.json: product 07's ceiling is 188,399 bytes; it measured 188,350 before this edit and 188,390 after (npm run test:docs docs-check)",
    "scripts/docs-check.mjs: raising a ceiling requires a named planning decision"
  ],
  "rationale": "The order allows 300 bytes, but only 49 remained under the ceiling, and raising it is a planning decision.",
  "rejected": [
    {
      "option": "A longer sentence naming the snapshot writer and the retained copies",
      "reason": "64 bytes and more, over the ceiling."
    }
  ],
  "reopenWhen": "A reader cannot find in product 07 where a closed order's meter values come from."
}
```

## WO-170-D011 — Version and register rows

```json
{
  "id": "WO-170-D011",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Application v0.52.8 is assigned at activation, the next patch above the observed local v0.52.7 tag: the heading, the README release line, a roadmap activation paragraph and the two publication locks. No package source changes, so no component version moves. FUP-a33f893036882d16 and FUP-85562931791378d4 stay allocated to WO-170 for the final review to retarget at close. For FUP-dc6c139003bd4b89 this order chooses the field (top-level usageCopies of {path, sha256, rows}) and writes it in the 77 recovered snapshots; a snapshot release prepare writes cannot name a copy that worktree finish makes later, so later orders' lanes stay retained until a refresh after the last usage row, which that row still holds. FUP-50cda1c03ecd8ea8's digest match is done (D008); its proof-partial clause is not.",
  "evidence": [
    "git tag: v0.52.7 is the newest local tag; npm run publication:check passes with the refreshed locks",
    "docs/planning/followups.json: the four rows' latest dispositions",
    "docs/final-reviews/WO-164/FINAL-002.md: the final review retargets register rows at close"
  ],
  "rejected": [
    {
      "option": "Mint a new follow-up for the refresh after the last usage row",
      "reason": "FUP-dc6c139003bd4b89 already holds it; a second row would split one item."
    }
  ],
  "reopenWhen": "A release baseline above v0.52.7 is published before this order's final review."
}
```

## WO-170-D012 — Review before the gate and what it changed

```json
{
  "id": "WO-170-D012",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "finding",
  "decision": "Four read-only reviewers (meter reader, writer and recovery, criteria and claims, adversarial edge cases) read the implementation before the gate; their findings, deduplicated to thirteen, were each checked against the code, and one skeptic then judged all of them against the reviewed code. It confirmed six as defects (1, 2, 3, 4, 5 and 8, below), all fixed with a fixture; it judged the other seven not to be defects in the current data (6: the five-order window is unchanged; 7: the legacy rows are kept on purpose; 9 and 10: no project tool makes a linked lane or a torn copy, and all 2,262 retained rows parse; 11: the ledger backticks every path and has no fence; 12 and 13: coverage and a gate not yet run). Changes 6, 7, 9, 10, 11 and 12 are kept as bounded hardening, each with a fixture, because each is small and the first two serve the order's Design and criterion 5 directly. (1) The cost reconciliation printed 'historical metrics undefined' for 74 usage-only snapshots: a row without metrics is no historical metrics. (2) The recovery named WO-067's copy although five of its twenty rows are planning rows it does not carry: a copy is named only when every row is carried (D007). (3) One unknown live dispatch fell back to the snapshot's prepare-time order total: the order total is read only when no role has a source (D004). (4) A closed order's commands and steps came from release-close and recovered usage activity: they come from its snapshot row or read unavailable (D003). (5) meta --write on main could rewrite a closed order's snapshot from a release-close journal and drop its usageCopies: a closed or withdrawn order's snapshot is not rewritten (D002). (6) Directions were computed only for the meter's five-order window: closedDirections covers every closed order (D005). (7) Earlier whole-meter rows supplied journal values while D003 said unavailable: D003 now names them, source.journals labels them, and their missing corrections no longer crash the reader. (8) Five lifecycle 'Operator resume:' dispatches that carry a direction were excluded: they count (D005). (9) The retained-lane walk followed symlinked directories: it follows none. (10) A torn line in a retained copy crashed collectMeta, and with it resume status on main: retained copies are read leniently and the unreadable lines are named. (11) A capture path with a trailing full stop and a fenced heading were miscounted (D006). (12) No fixture ran meta --write: one does now; no fixture runs meta --plan-cost, declined below. (13) Criterion 7's gate had not run: it runs next.",
  "evidence": [
    "Each fix has a fixture in scripts/test-process-debt.mjs: 'WO-170 a closed order's snapshot stands for its journals…' (3, 4, 5, 6, 7 and the cost reconciliation of 1), 'WO-170 recovery carries…' (2 and a torn copy), 'WO-170 operator directions…' (8, 11), 'WO-170 the order's snapshot is its own bounded row…' (5, 12), 'WO-170 a retained lane is read without following links or failing on a torn line' (9, 10)",
    "The reviewers' reproductions: 74 'historical metrics undefined' lines from renderMeta on this worktree; WO-067's retained copy with five workOrder-null planner rows found nowhere else under the main checkout's docs; a symlinked lane giving 65 copies and 5,000 out-of-lane tokens; a torn line giving SyntaxError from collectMeta",
    "The skeptic's verdicts, one per finding with its reproduction, are in the review workflow's session record: real for 1, 2, 3, 4, 5 and 8 (and their duplicates), not real for 6, 7, 9, 10, 11, 12 and 13"
  ],
  "rationale": "Accuracy over agreement: every finding was reproduced or read in the code before it was changed, and three of them (1, 3, 4) are the order's own rule, that a value the meter could not observe reads unavailable, applied where the first implementation missed it.",
  "rejected": [
    {
      "option": "A fixture that runs meta --plan-cost",
      "reason": "It needs the planning subject fixture of another suite; the table's traps are meta.traps copied whole, which the directions fixture asserts, and the committed table is not regenerated (D009)."
    },
    {
      "option": "Keep the earlier whole-meter rows' journal values unavailable, as the first D003 text said",
      "reason": "The meter read them before this order; dropping them would lose recorded refusals and bytes for WO-043, WO-049 and WO-126. They are kept and labelled."
    }
  ],
  "reopenWhen": "The skeptic's verdicts or the independent verification refute a fix or find a defect the fixtures do not cover."
}
```

## WO-170-D013 — The first review gate failed on a literal document root

```json
{
  "id": "WO-170-D013",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "finding",
  "decision": "planningCaptures matched intake paths with a literal docs/intake/ pattern; the configuration-root suite refuses a literal document root in a control-plane script, so the first npm test -- --review failed (33 passed, 1 failed, 637.02 s). The pattern now comes from rootPattern(root, 'intake') in scripts/lib/config.mjs, so a launchpad that moves its intake root is read there. The second run passed.",
  "evidence": [
    "First run, 2026-09-27T21:40:14Z: configuration-root 'no control-plane script keeps a literal document root or a second root derivation' failed with 'scripts/lib/meta.mjs: docs\\/'; every other suite passed",
    "node --test scripts/test-configuration-root.mjs: 13 of 13 after the fix; the real ledger's 25 capture counts are unchanged",
    "Second run, 2026-09-27T21:52:00Z: 34 passed, 0 failed, 632.45 s, 78 fresh tasks, exit 0, code identity cde8bad3efaaedb33a5a07bebdf0b08b3846a9e720268c4fd669d1f02a3f9e7d"
  ],
  "rejected": [
    {
      "option": "Exempt the pattern from the suite",
      "reason": "The intake root is configurable; the literal would read the wrong directory under a moved root."
    }
  ],
  "reopenWhen": "A launchpad with a moved intake root reports capture counts that differ from its ledger."
}
```

## WO-170-D014 — The pending rows this change touches

```json
{
  "id": "WO-170-D014",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "npm run plan -- followups --touching lists eleven pending rows; this order decides one, answers two, and leaves eight for the final review, which disposes rows through the feed. Decided: FUP-acfe4bfda716d8fb (WO-158-D008) asks the next order touching meter attribution whether meta applies RecordCorrected values. The meter shows no attestation field (model, effort, source, harnessVersion, reportPath, checkpoint), and none of its values depends on one, so it applies none; it counts each RecordCorrected event once as an operator direction. Resume usage and the console board, the row's other two consumers, are outside this order (non-goals: the console board, the usage observer). Answered: FUP-dc6c139003bd4b89 (D007, D011) and FUP-50cda1c03ecd8ea8 (D008). Left, with no seam of theirs changed: FUP-fa028783f3f6b17f (meter and closeout residue: this order's prepare now writes and names the snapshot, and a closed order's per-role values come from it; observed-facts.ts is a registered evidence source this order does not edit), FUP-71fc2efc208f597a (these decisions quote no operator chat), FUP-56b599e15f97e666, FUP-f1c7a256bec46737 and FUP-fd05316b6030ef73 (textual matches on product 07 or README), FUP-8cfd3ff52146a016 and FUP-e2cf2122a642d1e0 (release close and release list, untouched; only prepare changed), FUP-e62c63344f52405f (stash drop, untouched; only usageRetention changed).",
  "evidence": [
    "npm run plan -- followups --touching at register revision 51d835a7…, two pages: eleven rows",
    "scripts/lib/meta.mjs: no order row, dispatch row or rendered line reads an attestation field; operatorDirections counts RecordCorrected by type",
    "git diff: scripts/release.mjs changes only the prepare branch; scripts/lib/harness-prune.mjs only usageRetention"
  ],
  "rejected": [
    {
      "option": "Apply RecordCorrected values in the meter",
      "reason": "There is no attestation value in the meter to correct."
    }
  ],
  "reopenWhen": "The meter shows an attestation field, or a verifier finds a touched row's seam changed."
}
```

## WO-170-D015 — Verification found an older retained observation winning after ten collisions

```json
{
  "id": "WO-170-D015",
  "date": "2026-09-27",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "VER-001 F1 fails criterion 3. Preserve the implementation for repair: the retained usage reader and recoveredUsageSnapshot select 190 tokens when the latest supported preservation copy holds 200, and the recovery certifies all eleven copies as carried.",
  "evidence": [
    "docs/verifications/WO-170/VER-001.md F1: independently reproduced by the verifier and one read-only reviewer using recordUsageObservation and reconcileWorktreeMaterial, in temporary repositories",
    "scripts/lib/meta.mjs latestUsage replaces matching dispatch keys in traversal order; retainedUsageCopies sorts filenames lexically; scripts/lib/intake-reconciliation.mjs plan generates numeric .from-WO-NNN-N collision suffixes",
    "At preservation observations 0, 1, 9 and 10, expected totals 100, 110, 190 and 200 produced recovered totals 100, 110, 190 and 190. collectMeta with only the retained lane also reports 190. The current 77 recovered snapshots each have one copy and are unaffected."
  ],
  "rationale": "The useful outcome is a faithful summary that survives worktree removal. Accepting a green suite despite this reproduction would defeat that outcome and could authorize pruning the only newer observation. A bounded repair of observation selection and its regression fixture is sufficient; no new lifecycle guard or observation source is needed.",
  "rejected": [
    {
      "option": "Pass because the current 77 recovered snapshots match their source copies",
      "reason": "The new reader also supports later collision-preserved copies, and the current preservation API produces the failing case."
    },
    {
      "option": "Change implementation during independent verification",
      "reason": "The verifier preserves the judged subject and routes substantive defects to resume: fix."
    }
  ],
  "followup": "WO-170 repair, VER-001 F1: select the latest same-dispatch observation across retained copies independently of lexical filename order, preserve supersession and unknown-value semantics, and add a regression using the current preservation API through at least collision 10. Verify both collectMeta and recoveredUsageSnapshot and ensure recovery never certifies a copy whose newer observation is lost.",
  "reopenWhen": "The repair supplies the expected 200-token latest observation and reruns the affected fixtures and required review gate."
}
```

## WO-170-D016 — Verification found an overbroad statement about legacy journal values

```json
{
  "id": "WO-170-D016",
  "date": "2026-09-27",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "VER-001 N1 records a documentation correction for repair. The implementation evidence's Limits paragraph says journal-derived values of all pre-WO-170 closed orders are unavailable, but the preserved legacy rows of WO-043, WO-049 and WO-126 are exceptions, as D003, D007 and D012 already explain.",
  "evidence": [
    "docs/evidence/WO-170/README.md Limits paragraph; docs/verifications/WO-170/VER-001.md N1",
    "docs/evidence/WO-043/meta.json retains guardRefusals 11 and bytesReadIntoContext 115815398; the verifier read these values directly and the independent recovery audit compared the kept rows with their HEAD sources",
    "scripts/lib/meta.mjs collectMeta reads those legacy metrics with the earlier-whole-meter source label; legacy corrections remain unavailable because they were not journal counts"
  ],
  "rejected": [
    {
      "option": "Leave the unqualified statement",
      "reason": "It contradicts the preserved records and the implemented reader, even though the recovery itself is correct."
    }
  ],
  "followup": "WO-170 repair, VER-001 N1: qualify the implementation evidence's Limits paragraph to name the preserved legacy-row exceptions, without changing their metrics or claiming their historical correction values are journal counts.",
  "reopenWhen": "The evidence summary agrees with the preserved legacy rows and the reader's source labels."
}
```

## WO-170-D017 — Repair: the last recorded observation of a dispatch wins, whatever the read order

```json
{
  "id": "WO-170-D017",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "VER-001 F1 (D015) is repaired in latestUsage, the one selection both readers use: rows of the order are ordered by recordedAt, then by observation.observedAt, before the latest row of each dispatch key replaces the earlier ones; an undated value counts as earlier than any dated one, and rows equal on both keep their read order. Supersession (dropped by identity before selection) and unknown values (a latest row with a null total keeps its role's total unknown) are unchanged. retainedUsageCopies keeps its lexical path order, which now only names copies stably in usageCopies and the source label. The recovery certificate needs no separate rule: every row of a carried copy is now either the selected row of its key, superseded, or recorded no later than the selected row. No second economy experiment is started; D001 remains the order's one.",
  "evidence": [
    "scripts/test-process-debt.mjs 'WO-170 the latest retained observation of a dispatch wins past preservation's tenth collision': eleven recordUsageObservation calls, each followed by reconcileWorktreeMaterial, produce process/usage.jsonl through usage.jsonl.from-WO-999-10; recoveredUsageSnapshot after each gives 100 to 200 in steps of 10, the last certifies 11 copies with none uncarried, and collectMeta on the closed destination reports 200 tokens from the retained copy; two hand-written copies with a dispatch's rows reversed by name and an undated row give 30 in both readers",
    "The same test with the sort replaced by a no-op (the pre-repair read order), in place and restored byte for byte: 190 where 200 is expected, VER-001's figure",
    "Main checkout, 2026-09-27: all 2,262 retained rows and all 251 rows of its own usage file carry a parseable recordedAt, non-decreasing within each file, so the order equals the append order a single file already had; 95 rows lack observation.observedAt (unavailable counters), so that field cannot be the first key",
    "Recomputing recoveredUsageSnapshot for all 77 lanes of the main checkout with the repaired reader matches every committed snapshot's usageByRole and usageCopies (77 of 77, no difference): each lane holds one copy",
    "The nine WO-170 and WO-141 meter fixtures pass with the repair"
  ],
  "rationale": "Mission: the meter's value is a faithful record of what an order's sessions observed that survives worktree removal, so planning can see whether machinery reduces operator supervision; F1 let an older observation stand for a newer one and certified the copy holding the newer one for pruning. Seeking the wrong goal and rule beating: the regression drives the real preservation API past its tenth collision and was shown to fail on the old order, so it cannot pass without the behaviour. Policy resistance: the rule is the one a single usage file already obeyed (append order equals recordedAt order on every observed file), so live readers do not change. Drift to low performance: an undercount is not accepted because the current 77 snapshots happen to be unaffected. Commons and escalation: one sort in one function, no new gate, command, field or agent. Success to the successful: the filename order is kept only where it serves (stable naming), not for selection. Shifting the burden: the operator does not have to notice which copy is newer. Naive Interventionism: consumers are collectMeta's usage by role, the recovery and, through its digests, the prune; the committed snapshots are unchanged, reversal is the one function. NoOp leaves a reproduced wrong total and a certificate that could release the only newer observation.",
  "rejected": [
    {
      "option": "Sort copy names numerically (base, .from-WO-NNN, -2 … -10)",
      "reason": "A suffix records which name a preservation run found free, not when a row was recorded, and the retained-name pattern also admits directory suffixes (process.from-WO-NNN/usage.jsonl) whose order relative to file suffixes carries no time; the rows already carry their recording time."
    },
    {
      "option": "Keep each row's first occurrence across copies, then the read order",
      "reason": "Correct only when every later copy extends an earlier one, which preservation does not guarantee."
    },
    {
      "option": "Order by observation.observedAt first",
      "reason": "95 of the 2,262 retained rows carry none, and a refreshed observation is identified by when it was recorded."
    },
    {
      "option": "A separate certificate check that refuses a copy whose row is newer than the selected one",
      "reason": "With selection by recording time no carried row can be newer than its selected row; a second rule would duplicate the ordering."
    }
  ],
  "reopenWhen": "A usage writer records rows without recordedAt or out of recording order, or two observations of one dispatch are recorded with the same recordedAt and observedAt and differ."
}
```

## WO-170-D018 — Repair: the evidence names the legacy rows that keep their journal values

```json
{
  "id": "WO-170-D018",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "VER-001 N1 (D016) is corrected in the Limits paragraph of docs/evidence/WO-170/README.md: journal-derived values of orders closed before this one are unavailable except for WO-043, WO-049 and WO-126, which keep the metrics of their earlier whole-meter rows under the meter's 'earlier whole-meter row …; its corrections are not journal counts' label, so their correction counts stay unavailable. No metric, snapshot or reader changes.",
  "evidence": [
    "docs/evidence/WO-043/meta.json, WO-049/meta.json and WO-126/meta.json: each holds its kept row (38, 38 and 34 metric keys; WO-043 guardRefusals 11) and no corrections object",
    "scripts/lib/meta.mjs collectMeta: the journals source label for a closed order held by a non-journal snapshot row reads 'earlier whole-meter row <path> (cutoff …); its corrections are not journal counts'"
  ],
  "rejected": [
    {
      "option": "Drop the legacy rows' journal values to match the old sentence",
      "reason": "D012 item 7 kept them on purpose; the sentence was wrong, not the rows."
    }
  ],
  "reopenWhen": "A legacy row's metrics or its source label change."
}
```

## WO-170-D019 — Final review passes and records that the direction count reads agent-written labels

```json
{
  "id": "WO-170-D019",
  "date": "2026-09-27",
  "dispatch": "resume: final review; operator chose to pass and record the direction-label finding",
  "kind": "finding",
  "decision": "FINAL-001 passes WO-170 on all seven criteria and changes no source. One finding is recorded, not fixed. operatorDirections counts a decision record only when its dispatch field begins with scope expand:, operator override:, analysis: or conversation only: (or, for records filed before the docs check, operator). The dispatch field is written by the dispatched agent, not the operator: the docs check requires one of seven control prefixes followed by up to 240 characters of paraphrase, and resume: is one of the seven. A step the operator took inside a resume: dispatch, which the agent files as 'resume: …; operator …', is not counted. The count therefore measures how agents labelled the operator's steps, not the steps, and reads as a lower bound. The order's Design specified the begins-with rule, so criteria 4 and 5 are met as written; the defect is in the measure's design, not the implementation. During this review the operator said they had never used the dispatch strings the review first cited, which exposed that the field is paraphrase; asked how to proceed, the operator chose to pass and record the finding. This decision's own dispatch is an example: the operator's choice was made inside a resume: dispatch, and the count does not include it.",
  "evidence": [
    "scripts/docs-check.mjs validDispatch: the prefixes planning, ideation, resume, scope expand, conversation only, analysis and operator override; the refusal names 'at most 240 characters of paraphrase'",
    "scripts/lib/meta.mjs operatorDirections: a prefix match at the start of the dispatch, or a legacy /^operator\\b/ label, and the three off-ramp event types",
    "Final-review count over the committed record at main cb526f1d with this order's library: 114 closed orders, 871 dispatches, 71 counted; 165 other dispatches in 44 orders name the operator after a non-direction prefix",
    "WO-115 reads 0 directions; WO-115-D019 and WO-115-D020 have dispatch 'resume: fix; operator scope expand' and record an operator scope expansion, and a third reads 'resume: final review; operator direction after the publish refusal'. WO-070 reads 0 beside 'resume: next; operator scope expansion for acceptance criterion 5'. WO-165 reads 0 beside 'operator requested adversarial subagents'; WO-085 reads 2 beside an uncounted 'operator approved two current link repairs'",
    "Not every such label is a direction: seven WO-115 labels record an operator takeover after a stopped Codex session, and WO-165 records 'operator continue'",
    "docs/work-orders/WO-170-meter-keeps-what-sessions-observed.md Design, fourth bullet: 'The dispatch prefixes are the four the docs check already requires; dispatches filed before that rule are counted when they begin with operator'"
  ],
  "rejected": [
    {
      "option": "Fail the review",
      "reason": "Every criterion is met as written. A repair could not change the counting rule without an amended order or an operator scope expansion, and the snapshots, the recovery and the unavailable-not-zero reading are verified and wanted before the next prune."
    },
    {
      "option": "Widen the reader in this review to any dispatch naming the operator",
      "reason": "It changes verified source after the final gate, and which labels are directions (a takeover after a crash, 'continue', an approval) is a classification for planning to decide against the 165 labels, not for a reviewer to guess."
    },
    {
      "option": "Record it only in the report",
      "reason": "A defect met and not fixed needs a decision and a named follow-up so the next planning pass finds it."
    }
  ],
  "followup": "Planner: make operatorDirections count what the operator directed, not how an agent labelled it. Choose between a structured field that the docs check requires when the operator scope-expands, redirects, approves or takes over within a lifecycle dispatch, and a reader that classifies resume:-prefixed dispatches naming an operator step, judged against a hand classification of the 165 current labels. Until then, the Directions column and the shifting-the-burden series are a lower bound. Priority: medium, before a planning pass relies on the series.",
  "reopenWhen": "A planning pass reads the Directions column or the shifting-the-burden series to judge operator supervision, or the docs check's dispatch rule changes.",
  "rationale": "Mission: a meter on main that says how often the operator had to step in. Seeking the wrong goal is the material lens: a count that follows agent labels can fall while supervision does not, and an agent that files every step under resume: drives it to zero. Shifting the burden: without the finding, a planning pass would read WO-115's 0 as no intervention. Naive Interventionism: editing the verified reader now would spend a new gate on a classification that belongs to planning. NoOp would leave the column presented as a measurement of the operator's steps."
}
```
