# WO-086 decisions

## WO-086-D001

```json
{
  "id": "WO-086-D001",
  "date": "2026-09-29",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.55.1, the next patch above the observed release baseline v0.55.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.55.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-086-generated-release-history.md"
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

## WO-086-D002 — Economy experiment: a scripted, hash-checked notes move

```json
{
  "id": "WO-086-D002",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Adopt a scripted transfer for the notes move: a scratch script reads the five ranges from the base revision with git show, refuses unless the working roadmap equals the base and each boundary line is as observed, writes the receipt and the new roadmap, and prints each range's SHA-256; an independent pass then finds each range exactly once in the receipt.",
  "question": "Can the 65 KB of notes move byte for byte by a script checked against the base revision, instead of reading the section into the session and writing it back with the editor?",
  "alternatives": [
    "Editor transfer: read lines 21-983 and the two outside ranges, then write the receipt and edit the roadmap by hand.",
    "Scripted transfer from git show of the base revision, with boundary assertions and a SHA-256 per range."
  ],
  "observation": "Pre-registered: adopt only if every range is found exactly once in the receipt with the base revision's SHA-256 within 300 s. Result: 5 of 5 ranges, 65,277 bytes, each found once; the dry run and the apply took 10 s of wall clock by shell timestamps.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 10,
    "tokens": null,
    "commands": [
      "node <scratchpad>/move-notes.mjs <worktree> 3a68c517668555ae201feb8f1d51ee86c9e9ada0",
      "node <scratchpad>/move-notes.mjs <worktree> 3a68c517668555ae201feb8f1d51ee86c9e9ada0 --apply"
    ],
    "source": "Shell timestamps before the dry run and after the apply; writing the script is not included. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node <scratchpad>/move-notes.mjs <worktree> 3a68c517668555ae201feb8f1d51ee86c9e9ada0 --apply"
    ],
    "summary": "A one-time move: no per-order saving is claimed and the editor alternative was not timed. The script is also the byte-identity proof criterion 2 asks for, and no note passed through the session's context."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-28",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "Named after the first code edits of this dispatch, not before them: the entry questions to the operator came first, and the notes move had not started when it was named.",
    "docs/evidence/WO-167/decisions.md WO-167-D002: the latest experiment recorded as adopted (2026-09-28); WO-116, WO-173 and WO-065 recorded experiments after it in an order no source records, so the count since stays null.",
    "After review, a sixth range (WO-011's note, 760 bytes) moved by the same method: base bytes from git show, a SHA-256 check and a single-occurrence check in the receipt (D011)."
  ],
  "rejected": [
    {
      "option": "Editor transfer",
      "reason": "About 65 KB through the session twice, with no mechanical proof of byte identity."
    }
  ],
  "reopenWhen": "A later move of product prose times the editor alternative, or a moved range is found altered in the receipt."
}
```

## WO-086-D003 — Goal alignment

```json
{
  "id": "WO-086-D003",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Execute the order as a removal of reading cost from the two-lane workflow: the tags become the release record shown as a generated table, a collision writes one decision and no prose, and the notes leave product 06 whole.",
  "goalAlignment": {
    "missionAndCriticalPath": "The critical path runs two lanes in parallel (product 07 §Independent workflows); the operator reported that the retiming prose every pair wrote into the roadmap made parallel orders unattractive (2026-09-25 standard pass, item 3). A second lane now adds no paragraph a reader of 06, 07 or the README meets.",
    "traps": {
      "policyResistance": "The docs check, release prepare and product 07 now agree: prepare writes no dated paragraph, 07 no longer asks for one (D005), and the check refuses a receipt-shaped one (a bold label ending in a dated '(…):') under Release boundary as anywhere else; wider detection is boarded (D013).",
      "tragedyOfTheCommons": "The check costs one batched read of the recorded tags plus one of any unrecorded candidate in the document gate (about 50 ms for 114 tags); no suite, lane or role text is added.",
      "driftToLowPerformance": "06's counted bytes rise only by standing policy the heading exemption had hidden (D004); the exemption narrows from 72,105 bytes of mixed prose to one 31,279-byte block the check verifies.",
      "escalation": "One registered exemption replaces one heading exemption; no approval step or gate is added.",
      "successToTheSuccessful": "Version assignment at publication (map candidate 1) remains the recorded structural alternative; this order is its smaller probe, as planned.",
      "shiftingTheBurden": "Assignment and collision records are machine-written; the regeneration command is named in the block, and a stale table reports instead of failing a sibling's gate.",
      "ruleBeating": "The exemption holds only while the block equals its recorded tags' rows, so a hand-written note inside the markers fails (fixture); the Operator default label ends with a full stop like its standing neighbours because it is a rule, not a receipt.",
      "seekingTheWrongGoal": "Judged by what a reader meets (no per-order notes or retiming prose on the first-met surfaces), not by the byte count, which rises."
    },
    "naiveInterventionism": "Useful functions kept: the notes survive byte for byte, the release policy stays in 06, the heading and README claim keep their checks, and the index's tag rule is reused rather than copied. Consumers: the console reads 06's H1 and pending rungs only; the publication index loses two rows for headings that left; edition locks are refreshed. Reversible: the receipt's ranges can be moved back by their recorded hashes.",
    "noOp": "Every order keeps writing two paragraphs into 06 and the README-adjacent prose keeps growing; rejected by the operator's 2026-09-25 item 3 and the order's objective."
  },
  "evidence": [
    "docs/planning/standard-pass-2026-09-25.md §4",
    "docs/product/07-execution-guide.md §Goal-aligned decisions",
    "docs/work-orders/WO-086-generated-release-history.md Objective and Operator-review assumptions"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "The operator named the cost; the order is the planned smaller probe."
    }
  ],
  "reopenWhen": "A collision still needs a hand step or yields a review finding after this order (map candidate 1), or the table's newer-tag report is ignored long enough that the table misleads."
}
```

## WO-086-D004 — Operator authorization: the standing release policy stays and 06's ceiling is restated

```json
{
  "id": "WO-086-D004",
  "date": "2026-09-29",
  "dispatch": "resume: next; operator answer to the executor's question on 06's standing release policy",
  "decision": "Keep the standing release policy of product 06 §Release boundary in place and counted, changed only where this order makes it wrong, and restate 06's ceiling from its counted bytes at landing: 97,156 counted bytes, ceiling 99,100, above the base entry 91,876. Criterion 4's clause that the entry does not exceed its base is amended to name this exception; only the notes move to the receipt.",
  "evidence": [
    "Base 3a68c517: §Release boundary (lines 21-983) holds 110 per-order notes, two forward-retiming subsections and 10,090 bytes of standing release policy (lines 692-700, 728-740, 860-982), several of whose rules no other product document states (phrase search of docs/product, docs/PLAYBOOK.md and README.md: no-release closeout, patch/minor/major, version ownership, never tag the feature branch, the legal-gate summary).",
    "The order's figures use two conventions: 545 lines at 64f9326f is the part before the first subsection; 910 lines at 5f3849ec is the whole section including the policy (planning document of 2026-09-28 §10.3).",
    "node scripts/docs-check.mjs at base: 06 counted 90,074 and exempt 72,105; after landing: counted 97,156 and exempt 31,264 (the registered block); ceil(97,156 x 1.02) = 99,100.",
    "Operator, 2026-09-29, in this dispatch: chose keep-policy-and-raise-ceiling over moving the policy with the notes and condensing it to fit; then said the questions were unclear, and after a plain restatement (keep the rules and raise the limit once, noting that the operator approved it) replied 'go'."
  ],
  "rejected": [
    {
      "option": "Move the policy with the notes",
      "reason": "Rules that only 06 states would live only in a planning receipt of retired notes."
    },
    {
      "option": "Condense the policy to about 3 KB to fit the base ceiling",
      "reason": "An editorial rewrite of normative release text beyond the order's write-backs; the operator chose to keep it."
    },
    {
      "option": "Leave criterion 4 unmet for an operator waiver",
      "reason": "The operator authorized the change as an amendment of the clause, which plan amend-order binds to this decision."
    }
  ],
  "reopenWhen": "A consolidation (WO-087 or a document-maintenance pass) moves or condenses the release policy and lowers 06's ceiling in the same change, or a reader finds a live rule that only the receipt states."
}
```

## WO-086-D005 — Operator authorization: release prepare assigns a missing activation target

```json
{
  "id": "WO-086-D005",
  "date": "2026-09-29",
  "dispatch": "resume: next; operator answer to the executor's question on activation assignment",
  "decision": "npm run release -- prepare completes a missing activation target: a heading ending with '(version assigned at activation)' takes the next version above the latest observed tag under the order's classification, the README claim takes the same version, and the order's decisions record the base and classification. Product 07 §Discipline's duty clause names the command instead of a roadmap paragraph.",
  "evidence": [
    "At base, release prepare refused a heading without a strict version (scripts/lib/release-preparation.mjs lines 62-67); executors assigned by hand and wrote an activation-completion paragraph in 06 (WO-065-D007, WO-116-D009, WO-173-D009).",
    "With the heading exemption retired, docs-check refuses that paragraph as a new receipt, while product 07 lines 1466-1467 still asked for it.",
    "The order's Cost line: release prepare at activation writes the target into the order heading.",
    "Operator, 2026-09-29, in this dispatch: chose 'release prepare assigns it'; after the plain restatement (have npm run release -- prepare fill the version in automatically, and fix the guide) replied 'go'.",
    "This order's own target: npm run release -- prepare --local printed 'Assigned WO-086: v0.55.1, the next patch above the observed release baseline v0.55.0.' and recorded WO-086-D001; a second run printed 'WO-086 target v0.55.1 remains current.'"
  ],
  "rejected": [
    {
      "option": "Keep the manual assignment and only drop the roadmap paragraph from product 07",
      "reason": "Leaves a hand step the command can do from inputs it already checks."
    },
    {
      "option": "Leave product 07 as it was",
      "reason": "The next executor following it would meet a docs-check refusal."
    },
    {
      "option": "Write the target into the WorkOrderActivated event",
      "reason": "No activation event carries a target (docs/control/orders/*.jsonl); adding one changes the event schema, which this patch order excludes, and product 07 says prepare never appends control events. The order's 'activation event (as today)' does not match the code; map candidate 1 owns that change."
    }
  ],
  "reopenWhen": "An assignment picks a version that a merged but unpublished order on main already claims, or map candidate 1 moves assignment to publication."
}
```

## WO-086-D006 — The generated table and its check

```json
{
  "id": "WO-086-D006",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Generate the roadmap's release history with npm run release -- list --markdown (print) and --markdown --write (rewrite the registered block in place) from localReleaseRecords, the work-order index's own reader: the block records the tags it was generated from, each recorded tag must remain available and unchanged, rows join the orders their manifests name, and a newer local tag is reported and never refuses. The docs check exempts the one registered block (06-roadmap.md, dotln-release-history) and holds it to its tags, so a hand edit inside the markers fails. Only comment lines count as markers or lookalikes, so display text naming the marker cannot break the block. Columns: version; the tag's UTC date; order links with the heading's name before its first colon as display text; the version step over the manifest's previous release; component versions. Newest first.",
  "evidence": [
    "Real tags: 114 annotated DotLn tags rendered in about 50 ms, 31,279 exempt bytes; the default release list, its cache and the console's parser are unchanged. The manifest-free v0.2.0 row takes its component versions from docs/releases/v0.2.0.md, the record its order join already reads.",
    "Receipt 032's carry-in: the command that regenerates the table is npm run release -- list --markdown --write, named in the block; a recorded tag the checkout lacks fails the docs check with 'missing or changed recorded release tag: <tag>', as the index check does.",
    "Fixtures (scripts/test-docs-check.mjs): the table equals release list's tags, applications and orders for four tags, one order's heading carries no version, and a lightweight and an unrelated annotated tag are excluded; a changed row and a hand-written receipt inside the block refuse at their line; a newer tag is reported; a deleted or re-made recorded tag is named.",
    "Fixtures also cover a manifest-free v0.2.0 whose components come from its record, and an order heading that names the marker, whose generated block passes its own check."
  ],
  "rejected": [
    {
      "option": "Read the table through release list's per-tag cache (WO-164)",
      "reason": "Its records hold no dates, component versions, order paths or v0.2.0's historical join, and live only in an ignored local lane; one batched read of the recorded tags is fast, and the index's reader already validates snapshots. WO-164's dependency is met by its merge."
    },
    {
      "option": "Classification from each order's Release classification line",
      "reason": "The tag is the record: v0.17.0 and v0.23.0 were minor releases whose manifest orders declared patch, and 21 older orders have no strict line."
    },
    {
      "option": "Check the table in release check-surfaces",
      "reason": "That rule set also gates worktree publish and release close; the check belongs with the exemption it justifies, in the document gate, and adds no publication-time dependency on local tags."
    },
    {
      "option": "Regenerate the table inside worktree integrate",
      "reason": "Criterion 3 requires the collision path to change no product document; the table stays valid for its recorded tags and reports newer ones."
    },
    {
      "option": "A second marker block in product 10",
      "reason": "The Design registers one pair; product 10 had 222 bytes of headroom and gets a pointer (D009)."
    }
  ],
  "reopenWhen": "The newer-tag report grows by more than a few releases without regeneration, a checkout without the recorded tags must pass the document gate, or a second generated product block is proposed."
}
```

## WO-086-D007 — The collision record and its failure path

```json
{
  "id": "WO-086-D007",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "At a collision release prepare changes the heading and the README version claim and records the collision once: under worktree integrate (--integration) in the helper's integration decision while that decision is still to be written, whose JSON evidence and release line carry the superseded and new targets and the baseline; otherwise, including a later integration pass after the stub exists, as a decision prepare appends to the order's decisions record. The stub waits for a preparation that failed, so a retime on a continuation is recorded by the stub it then writes. --integration refuses without that pending integration. A decisions record Git reports unmerged, or one that still holds conflict markers, makes prepare refuse with the path and the remedy before any write in every mode, and the stub applies the same test; a record prepare creates must land inside the repository. The meter is read before any edit, so a refusal writes nothing. The roadmap is neither read nor written.",
  "evidence": [
    "scripts/test-worktree-integration.mjs: both integration fixtures append exactly one decision, the integration decision, whose release line reads 'Retimed WO-998: v9000.0.1 → v9000.0.2 above the observed release baseline v9000.0.1.'; docs/product is unchanged against the fetched main and the README differs at most in its version claim.",
    "Same file: a failed first pass withholds the stub and a repaired continuation records the retime once in it; a tag landing after the stub is written is recorded once by prepare's own decision (superseded v9000.0.5, new v9000.0.6, baseline v9000.0.5); a conflicted record leaves heading, README, record and products unchanged and names the path and remedy.",
    "scripts/test-release-preparation.mjs: 12 tests, including a real unmerged index entry with marker-free bytes and a staged record with markers, each refusing in both modes and with a current target, and records refused through a symlinked directory or a dangling link.",
    "scripts/test-release.sh case prepare_independent: prepare --local --integration without a pending integration refuses and writes nothing.",
    "At base, release prepare wrote the note after the order's activation paragraph wherever it stood (WO-039's note landed under Post-1.0 horizons), and a meter failure after the edits left them on disk.",
    "Independent review of this implementation (2026-09-29) found the unrecorded continuation (F1), the unguarded flag (F4), the current-target conflict case (F2) and the unchecked created record (F3); each is fixed here with the fixture above."
  ],
  "rejected": [
    {
      "option": "Prepare appends its own decision under integrate too",
      "reason": "Two records of one collision; criterion 3 asks for exactly one."
    },
    {
      "option": "Fall back to a roadmap or README paragraph when the record cannot be written",
      "reason": "The Design forbids a prose fallback (receipt 029's finding)."
    },
    {
      "option": "Reorder integrate so the stub is written before prepare",
      "reason": "Writing the stub first cannot know the preparation's outcome; withholding it until the preparation ran keeps one record per collision."
    }
  ],
  "reopenWhen": "A collision needs a hand step or yields a review finding after this order, or a conflicted record is met that neither the index test nor the marker test detects."
}
```

## WO-086-D008 — The notes move, byte for byte

```json
{
  "id": "WO-086-D008",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Move the hand-kept notes byte for byte to docs/planning/release-history-notes.md: six ranges of the base revision's product 06 plus the WO-117 paragraph added on main at 4d7c3319, read from Git and checked by SHA-256. The earliest note held is dated 2026-08-31 and the latest 2026-09-29. The one-line pointer and the registered block stand where the notes stood; the standing policy follows them.",
  "evidence": [
    "docs/product/06-roadmap.md at 3a68c517, lines 23-690 (48,675 bytes): sha256 bce0ffc38542f01b985daa62dab72f7036e305a7934bfcd95c5da9026d5566d1",
    "lines 702-726 (3,480 bytes): sha256 172740115111eaa89cc836c62ce8546433b29835b87daa44549b69795ab36350",
    "lines 742-858 (9,836 bytes), with both forward-retiming subsections: sha256 61e2a47517303195ccaadbf92de78efefae9b235e4799622e81a6c31bc53a380",
    "line 2036 (1,036 bytes), WO-010 under the v0.12.0 rung: sha256 9009ce9d8a5badbb641f7ae0ab528cd2922c9330e48c052d055dea6506214e80",
    "lines 2077-2086 (760 bytes), WO-011's activation completion under the v0.13.0 rung, moved after review (D011): sha256 9f3c977a19d1fd7e457c26b854a855d2be83d81f03bdba94d2206aca2f3d517b",
    "lines 2313-2340 (2,250 bytes), WO-039, WO-047 and WO-068 under Post-1.0 horizons: sha256 245eb8955c774592af5b849156cf93bb4835e1c3c7e71cc2f09a18d33dd9abf5",
    "An independent pass found each of the six ranges exactly once in the receipt and none in the new 06, compared against git show 3a68c517:docs/product/06-roadmap.md.",
    "Standing text changed where the move made it wrong: 'below' in the WO-132 contract now names the release-history notes; the collision rule says the order's decision records it instead of 'a dated migration note'; 'the retiming rule' reads 'the collision rule above'; the Operator default label, which the retired exemption would now report as a new receipt, ends with a full stop like its standing neighbours, because it is a standing rule rather than a receipt."
  ],
  "rejected": [
    {
      "option": "Move by heading structure",
      "reason": "Lines 786-982 sit under the 2026-09-04 subsection in the outline, so a heading-range move would carry the standing policy with it."
    },
    {
      "option": "Leave the seven notes outside the section",
      "reason": "Criterion 4 allows no activation-completion or collision paragraph outside the markers; the WO-010, WO-011, WO-039, WO-047 and WO-068 notes are the same hand-kept kind."
    }
  ],
  "reopenWhen": "A reader needs a moved note back in a product document, or a range is found altered against its recorded hash."
}
```

## WO-086-D009 — The other write-backs

```json
{
  "id": "WO-086-D009",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "decision": "Land the remaining write-backs: product 07's integration sentence now names 'the integration decision' in place of 'a dated roadmap note' (4 bytes longer) and its §Discipline duty names the command (D005); product 10 gains a pointer to the generated table after the axes list and names 'a recorded decision' in place of 'a dated migration note'; docs/README.md and doc-ceilings.json's policy name the one registered block; the publication index loses the two forward-retiming rows whose headings left; the docs-check baseline loses the six 06 shapes whose paragraphs moved; the README changes only its version claim; the edition locks are refreshed. CLAUDE.md's shared-memory line was already edited by the 2026-09-25 pass. The inherited ledger duty is discharged by this file and its decisions-index row.",
  "evidence": [
    "Counted bytes: 07 from 154,821 to 154,878 under 157,212; 10 from 25,603 to 25,744 under 25,825.",
    "Retiming vocabulary on 06 outside the receipt: none (grep -i retim); on the README and CLAUDE.md: none.",
    "docs/work-orders/README.md marks WO-086 'Inherited ledger duty: discharge with this order's decisions file ... no lifecycle ledger append'."
  ],
  "rejected": [
    {
      "option": "A marker block in product 10",
      "reason": "One registered pair; the pointer fits 10's headroom."
    },
    {
      "option": "Rewrite product 07's other retiming sentences",
      "reason": "The order keeps the mechanism text; only the named sentence and the duty the operator authorized change."
    }
  ],
  "reopenWhen": "A reader meets retiming prose on a first-met surface, or product 10's headroom is needed by another writer."
}
```

## WO-086-D010 — A product 07 claim this order leaves standing

```json
{
  "id": "WO-086-D010",
  "date": "2026-09-29",
  "dispatch": "resume: next",
  "kind": "finding",
  "decision": "Board, not fix: product 07 §Independent workflows says 'npm test runs check-surfaces --local before expensive suites', but the release-surfaces suite is a document-lane suite that npm run test:docs runs and npm test does not. The sentence shares the paragraph whose one named sentence this order edits, and the order keeps that mechanism text.",
  "evidence": [
    "scripts/test-runner.mjs classifySuite lists release-surfaces among the document suites; selection runs document rows only under --document.",
    "docs/product/07-execution-guide.md §Independent workflows and integration, the paragraph beginning 'The existing resume phrases remain the operator interface.'"
  ],
  "rejected": [
    {
      "option": "Correct it here",
      "reason": "The order fences product 07 to one sentence and the operator-authorized duty; the correction is a document-maintenance edit."
    }
  ],
  "followup": "Next document-maintenance pass: say that npm run test:docs runs check-surfaces --local, or move release-surfaces into the product gate. Paths: docs/product/07-execution-guide.md, scripts/test-runner.mjs. Check: npm run test:docs. Priority low; no gate depends on the sentence.",
  "reopenWhen": "A reader relies on npm test to check release surfaces, or a pass edits that paragraph."
}
```

## WO-086-D011 — Correction: the notes were selected by label

```json
{
  "id": "WO-086-D011",
  "date": "2026-09-29",
  "dispatch": "resume: next; correction after the executor's independent review",
  "kind": "correction",
  "decision": "Move WO-011's activation completion as a sixth range and restate 06's landing figures: 96,395 counted bytes and a 98,323 ceiling (the base entry was 91,876), superseding the 97,156 and 99,100 that WO-086-D004 recorded when it was bound. The authorization in D004 stands unchanged.",
  "misread": "I selected the notes outside §Release boundary by their labels ('activation completion', 'collision retiming', 'integration note', 'release assignment'), so '**WO-011 source (2026-09-06):** the omitted activation target is assigned `v0.13.0`' stayed in 06 although it is an activation completion by content. D004 also gives 10,090 bytes for lines 692-700, 728-740 and 860-982, which hold 10,087; the 10,090 counts their three blank separators.",
  "meant": "Every activation-completion, collision-retiming and forward-retiming paragraph by content, as criterion 4 reads, and D004's figures as the ranges measure.",
  "changed": "Base lines 2077-2086 moved byte for byte to the receipt (sha256 9f3c977a19d1fd7e457c26b854a855d2be83d81f03bdba94d2206aca2f3d517b, D008), its baseline shape was removed, the receipt names three later roadmap sections, and doc-ceilings.json and the receipt's ceiling section carry 96,395 and 98,323. The standing policy is 10,087 bytes in its stated ranges, or 10,090 with their blank separators.",
  "evidence": [
    "Independent review, 2026-09-29, finding WO086-DOC-01, confirmed by its verifier: 06 lines 1389-1398 were byte-identical to base 2077-2086 and outside the markers.",
    "grep for 'omitted', 'activation target', 'is assigned `v', 'collision', 'retim' and 'release assignment' in the new 06 outside the generated block: only standing policy remains (lines 163, 236, 238 and 242), and two unrelated uses of 'collision'.",
    "node scripts/docs-check.mjs: 06 counted 96,395, exempt 31,279, ceiling 98,323, 0 failures."
  ],
  "rejected": [
    {
      "option": "Edit D004's figures in place",
      "reason": "plan amend-order bound D004's bytes; this correction records the landing figures instead, and D004's authorization is unchanged."
    },
    {
      "option": "Leave the WO-011 note, since its label differs",
      "reason": "Criterion 4 names the paragraph kind, not its label."
    }
  ],
  "reopenWhen": "Another activation-completion, collision or forward-retiming paragraph is found in 06 outside the markers."
}
```

## WO-086-D012 — Transition for lanes that wrote roadmap notes before this order

```json
{
  "id": "WO-086-D012",
  "date": "2026-09-29",
  "dispatch": "resume: next; after the executor's independent review",
  "kind": "finding",
  "decision": "Record the transition for the two lanes whose work carries old-style §Release boundary paragraphs: WO-117 (this order's planned pair) and WO-172. WO-117 merged to main at 4d7c3319 during this dispatch and published v0.56.0, so its '**WO-117 activation completion (2026-09-29):**' paragraph now stands under main's §Release boundary: WO-086's final-review integration resolves 06 by keeping this order's pointer and registered block, moves that landed paragraph byte for byte into docs/planning/release-history-notes.md with its SHA-256 and updates the receipt's dates and D008, and regenerates the table, which then lists v0.56.0. That is integration bookkeeping, not a finding; the retime of v0.55.1 above v0.56.0 is recorded by the integration decision (D007). A lane that integrates main after this order, WO-172 today, keeps main's generated block and moves its own activation, scope and collision notes into its own decisions record, never back into 06, where the docs check now refuses them as new receipts. The order's placement premise that WO-117 does not edit 06 did not hold: it followed product 07's old duty.",
  "evidence": [
    "git --no-pager show origin/main:docs/product/06-roadmap.md: '**WO-117 activation completion (2026-09-29):** assigned application `v0.56.0`…' directly under '## Release boundary'; git tag -l v0.56.0 names the published tag; origin/main is 4d7c3319.",
    "The wo-172 worktree's 06 adds '**WO-172 activation completion**', '**WO-172 scope expansion**' and '**WO-172 collision retiming**' (2026-09-29) paragraphs under the same heading (independent review finding C1, confirmed).",
    "git merge-file of this order's 06 with each lane's 06 over their bases exits 1 with conflicts spanning the section.",
    "node scripts/docs-check.mjs on this subject reports v0.56.0 as a newer local release tag without refusing."
  ],
  "rejected": [
    {
      "option": "Keep a heading exemption until the lanes land",
      "reason": "It reopens the exemption this order retires and the V2 hole WO-085's verification found."
    },
    {
      "option": "Edit the sibling worktrees from here",
      "reason": "One writer per worktree; each lane's own actor resolves its integration."
    }
  ],
  "followup": "WO-117 and WO-172 lanes, and WO-086's final review: at integration, keep main's generated release-history block in docs/product/06-roadmap.md; move each lane's activation, scope or collision paragraph into that lane's decisions record (or, if already on main, into docs/planning/release-history-notes.md with its SHA-256 and D008 updated). Check: npm run test:docs (docs-check).",
  "reopenWhen": "A lane's integration keeps an activation or collision paragraph in 06, or the receipt's byte-identity check fails after a landed paragraph moves."
}
```

## WO-086-D013 — Receipt detection misses dated labels without the bold colon form

```json
{
  "id": "WO-086-D013",
  "date": "2026-09-29",
  "dispatch": "resume: next; after the executor's independent review",
  "kind": "finding",
  "decision": "Board, not fix: the docs check recognizes a receipt only as a paragraph whose first child is bold and whose label ends in a dated '(…):' or names an operator direction. A dated bold label ending in a full stop, or an unbolded label such as base 06's 'WO-068 release assignment (2026-09-16):', passes. After this order a per-order note could still enter 06 in those shapes; the recognizer is WO-085's and widening it is a planning decision (WO-085 D009 O1, D015 V1).",
  "evidence": [
    "scripts/docs-check.mjs productContent: the receipt shape tests /\\([^)]*\\d{4}-\\d{2}-\\d{2}[^)]*\\)\\s*:/ on a bold first child only.",
    "Independent review finding WO086-DOC-02, confirmed: '**WO-999 activation completion (2026-09-30).**' and an unbolded 'WO-999 activation completion (2026-09-30):' each give 0 receipts."
  ],
  "rejected": [
    {
      "option": "Widen the recognizer here",
      "reason": "Outside this order's fence; WO-085's planning items already hold the question (FUP-a6b9c4dc86ac8995)."
    }
  ],
  "followup": "Next document-maintenance pass: decide whether docs-check's receipt shape also refuses dated per-order labels ending in a full stop or unbolded, at least under product 06; paths scripts/docs-check.mjs and scripts/test-docs-check.mjs; check npm run test:docs.",
  "reopenWhen": "A per-order dated note enters a product document in one of these shapes."
}
```

## WO-086-D014 — Follow-up rows this change touches

```json
{
  "id": "WO-086-D014",
  "date": "2026-09-29",
  "dispatch": "resume: next; completion advisory on the follow-up rows this change touches",
  "kind": "finding",
  "decision": "Of the 16 pending follow-up rows that name a file this change touches or WO-086 (npm run plan -- followups --touching), this order fixes the first defect of FUP-406744f5e9966250 (WO-169-D006): a stub written on a pass whose release preparation failed no longer keeps 'Release preparation: pending.', because the stub now waits for the preparation and a retime after the stub exists is recorded by release prepare's own decision (D007). Its second defect, a failed stash apply that leaves stage applying, is outside this order's seam and stays. Every other row is left as it is: three are this order's own boards (FUP-439252e49f6381fc, FUP-b86a71ffd5b1e334, FUP-2855ce1f2ac2005a); FUP-38ced82ed597d07b (version at publication) and FUP-84bc6f15abd1e45f (the README block regenerated) reopen when this order closes, not before; the rest match a path without sharing a seam. The final review disposes the rows whose conditions occurred.",
  "evidence": [
    "npm run plan -- followups --touching: 16 matched rows of 169 pending.",
    "Left, textual match only: FUP-f1c7a256bec46737 (cold-start ceilings), FUP-50cda1c03ecd8ea8 (harness prune), FUP-56b599e15f97e666 (resident state), FUP-8cfd3ff52146a016 (a release close --publish fixture), FUP-acfe4bfda716d8fb (usage attribution of corrections), FUP-e2cf2122a642d1e0 (release list on a non-array changedFiles; the default listing is unchanged here), FUP-fd05316b6030ef73 (product 02 standing text), FUP-07d0d6b377e55321 (the roadmap's remaining sections, WO-087's seam), FUP-cd1a227413938345 (product documents owned as wholes).",
    "FUP-fa028783f3f6b17f (meter and closeout residue) reopens on the next order that edits release preparation, which this order is; its items (the reviewer procedure's order, the renderer's dispatch rows, observed-facts matching, a WO-140 paragraph) do not share this order's seam, and its 'no files changed' item was fixed by WO-160 (scripts/test-release.sh case prepare_independent asserts the meter file is listed)."
  ],
  "rejected": [
    {
      "option": "Fix the stash-apply stage here",
      "reason": "Outside the collision record this order changes; no real integration has met it (WO-169-D006)."
    }
  ],
  "reopens": {
    "decisionId": "WO-169-D006",
    "observation": "WO-086 edits the decision-stub stage of scripts/lib/worktree-integration.mjs: the stub no longer keeps 'Release preparation: pending.' after a failed pass (WO-086-D007, fixtures 'a retime that lands on a continuation' and 'a tag that lands after the stub is written'); the stash-apply stage defect is untouched."
  },
  "reopenWhen": "The final review finds a listed row whose seam this change opened and that this decision leaves unaddressed."
}
```

## WO-086-D015 — Verification: a post-edit output failure loses collision provenance

```json
{
  "id": "WO-086-D015",
  "date": "2026-09-29",
  "dispatch": "resume: verify; independent VER-001",
  "kind": "finding",
  "decision": "Fail criterion 3 on F1: release prepare --integration can change the heading and README claim before an ancillary PR write fails; the integration helper then withholds its decision, and continuation records only that the new target remains current, losing the superseded target and release baseline. Preserve implementation for the executor's repair; the verifier changes no behavior.",
  "evidence": [
    "docs/verifications/WO-086/VER-001.md F1: the collision reviewer and the root verifier each reproduced the edge in an isolated copy of scripts/test-worktree-integration.mjs's real-Git fixture.",
    "Create a regular file at docs/final-reviews/WO-998 in fixture({ authored: false }); integrate exits 1 with EEXIST after the heading changes from v9000.0.1 to v9000.0.2 and before any decisions record exists. Remove that blocker and integrate --continue exits 0; the only decision says target v9000.0.2 remains current and contains neither superseded v9000.0.1 nor the release baseline.",
    "scripts/release.mjs:2296 applies preparation before the PR mkdir/write at 2326-2327 and the outcome emission at 2336; scripts/lib/release-preparation.mjs:260-262 suppresses a separate collision decision under --integration; scripts/lib/worktree-integration.mjs:393-403 withholds the stub on the first failure and accepts the current-target outcome on continuation.",
    "Existing checks still pass: fresh release-preparation and worktree-integration suites 28/28; fresh document gate 23/23; the full review gate's complete 39-suite passing row covers current code identity 72f5c2f8f239a02109af84626795d099195c14c7d4f3e9741a470444364ea2da. They do not cover a failure after preparation edits."
  ],
  "rejected": [
    {
      "option": "Pass because the existing continuation fixture is green",
      "reason": "That fixture fails the meter before preparation writes; it does not establish the promised collision record after a later output failure."
    },
    {
      "option": "Have the verifier repair implementation",
      "reason": "Independent verification records a finding and preserves the executor's repair duty."
    }
  ],
  "followup": "WO-086 resume: fix, F1: retain the original collision outcome durably across post-edit failures and continuation, or restore preparation edits when later output fails, so exactly one decision records the superseded target, new target and release baseline. Paths: scripts/release.mjs, scripts/lib/release-preparation.mjs, scripts/lib/worktree-integration.mjs, scripts/test-worktree-integration.mjs. Add the post-apply PR failure reproduction as a regression fixture; run npm test -- --review and npm run test:docs, then fresh independent verification. Priority medium; criterion 3 is unmet.",
  "reopenWhen": "A repair reproduces F1 with one complete collision record, including after continuation, and independent verification passes criterion 3."
}
```

## WO-086-D016 — Operator scope: integrate main during repair

```json
{
  "id": "WO-086-D016",
  "date": "2026-09-29",
  "dispatch": "resume: fix; scope expand: merge main in",
  "kind": "authorization",
  "decision": "Include canonical worktree integrate WO-086 in this repair, resolve its authored conflicts, regenerate projections and execute affected checks. Keep original VER-001 and recovery refs; never describe its verdict as judging integrated bytes.",
  "operatorAuthorization": "scope expand: merge main in",
  "evidence": [
    "Operator message during resume: fix on 2026-09-29: scope expand: merge main in.",
    "Product 07 §Independent workflows and integration admits the canonical helper in repairing and preserves checkpoints and the named stash.",
    "Current source requires repairing or final-review; ignored intake listing is empty."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Integrating published upstream work now avoids another conflict-resolution pass before the repaired parallel-lane evidence reaches fresh verification.",
    "traps": {
      "policyResistance": "Use the canonical helper rather than bypass its preservation and regeneration.",
      "tragedyOfTheCommons": "One read-only reviewer, reused for repair and integration; root is the sole writer.",
      "driftToLowPerformance": "All five criteria remain required on the integrated subject.",
      "escalation": "No new phase, approval step or gate.",
      "successToTheSuccessful": "Manual merge remains possible but duplicates recovery and generation already supplied by the helper.",
      "shiftingTheBurden": "The actor resolves conflicts within this authorized dispatch.",
      "ruleBeating": "Keep original verdict immutable and run affected checks on current bytes.",
      "seekingTheWrongGoal": "Judge preserved behavior and complete provenance, not merge or receipt counts."
    },
    "naiveInterventionism": "Preserve upstream behavior, the order’s changes, retired-note bytes and recovery refs; inspect conflicts rather than choose a whole side blindly.",
    "noOp": "Leaving main unmerged declines explicit operator scope and defers known conflicts to final review."
  },
  "rejected": [
    {
      "option": "Merge with raw Git commands",
      "reason": "Canonical integration supplies checkpoints, retained stash and producers."
    },
    {
      "option": "Defer to final review",
      "reason": "Operator explicitly requested integration in the repair."
    }
  ],
  "reopenWhen": "A conflict changes behavior, contracts or acceptance; record the bounded resolution and establish its executable evidence."
}
```

## WO-086-D017 — Preserve the incoming WO-117 release note

```json
{
  "id": "WO-086-D017",
  "date": "2026-09-29",
  "dispatch": "resume: fix; scope expand: merge main in",
  "decision": "Resolve the sole authored roadmap conflict with the generated release-history block and preserve main’s newly landed WO-117 activation paragraph byte for byte in the existing release-history notes. Keep main’s authored README live-console text. Original six archived ranges and VER-001 remain unchanged.",
  "evidence": [
    "Canonical integration: original base 3a68c517, fetched main 4d7c3319; checkpoint refs/dotln/checkpoint/WO-086/6 and named stash retained.",
    "git show 4d7c3319:docs/product/06-roadmap.md differs from the original base only by this note under Release boundary.",
    "Main roadmap lines 23–33: 741 bytes, SHA-256 4245a38c1ee4523fba3c56fbf1cd37c13503956955a0cd3b7969c7a9685ac84b; found exactly once in docs/planning/release-history-notes.md and absent from current roadmap.",
    "Archive first/last note dates remain 2026-08-31 and 2026-09-29; D008 now names both source revisions."
  ],
  "rejected": [
    {
      "option": "Keep the old-style note in the roadmap",
      "reason": "It violates criterion 4 and the registered-exemption rule."
    },
    {
      "option": "Discard the incoming paragraph",
      "reason": "D012 and criterion 2 require byte-preserving retirement."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D012",
    "observation": "WO-117 has landed on fetched main; its 11-line note moved into the existing archive with the original bytes and SHA-256."
  },
  "reopenWhen": "Another lane integrates an old-style release paragraph or an archived range changes."
}
```

## WO-086-D018

<!-- integration refs/dotln/checkpoint/WO-086/6 -->

```json
{
  "id": "WO-086-D018",
  "date": "2026-09-29",
  "dispatch": "resume: fix; worktree integrate WO-086",
  "decision": "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
  "evidence": [
    "refs/dotln/checkpoint/WO-086/6",
    "base 3a68c517668555ae201feb8f1d51ee86c9e9ada0",
    "upstream 4d7c3319aed15abc9ae80a2ea3badadfcba5e878",
    "release preparation: Retimed WO-086: v0.55.1 → v0.56.1 above the observed release baseline v0.56.0. Files changed: docs/work-orders/WO-086-generated-release-history.md, README.md, docs/evidence/WO-086/meta.json, docs/final-reviews/WO-086/PR.md. Meter snapshot: docs/evidence/WO-086/meta.json, 3288 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-29. Original base: `3a68c517668555ae201feb8f1d51ee86c9e9ada0`.
Fetched main: `4d7c3319aed15abc9ae80a2ea3badadfcba5e878`. Checkpoint: `refs/dotln/checkpoint/WO-086/6`.
Named stash retained: `99d94205a11e72e7bfd0a3ea3787a086cac4125e` (WO-086 integrate 2026-09-29).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-086: v0.55.1 → v0.56.1 above the observed release baseline v0.56.0. Files changed: docs/work-orders/WO-086-generated-release-history.md, README.md, docs/evidence/WO-086/meta.json, docs/final-reviews/WO-086/PR.md. Meter snapshot: docs/evidence/WO-086/meta.json, 3288 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final review. The order, VER-001, VER-002 and VER-003 keep their recorded subjects. The integration fast-forwarded to fetched main, and the one authored resolution (06) kept the generated block and moved main's WO-117 note byte for byte into the release-history notes (D017). VER-002 and VER-003 judged all five criteria again on the integrated bytes, and the D022 repair followed the merge, so no criterion is carried across bases. At final review `git fetch origin` still reported main at `4d7c3319`, so no second integration was run. The retime to v0.56.1 above v0.56.0 changes only the application label; `packages/`, `package.json` and `package-lock.json` equal main, so no component version collides, and this order mints no evidence edition. Final review owns its independent acceptance judgment, recorded in [FINAL-001](../../final-reviews/WO-086/FINAL-001.md).
Authored conflicts observed: docs/product/06-roadmap.md.
Affected checks are printed by the command; results remain untested until executed.

## WO-086-D019 — Preserve collision inputs through ancillary output failures

```json
{
  "id": "WO-086-D019",
  "date": "2026-09-29",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "Write the meter snapshot and PR meter block before applying the release-preparation plan. On any ancillary filesystem failure the original heading, README claim and collision decision remain unchanged; continuation recomputes and records the original collision exactly once. Core plan writes retain their existing rollback. Preserve the printed changed-file order.",
  "evidence": [
    "VER-001 F1 reproduced a regular file blocking docs/final-reviews/WO-998 after the target had changed.",
    "scripts/release.mjs currently collects meta before apply, so moving apply after ancillary outputs does not change the meter collection’s subject.",
    "scripts/lib/release-preparation.mjs applyReleasePreparation checks source bytes and restores its own partial writes.",
    "Read-only review supports sequencing rather than introducing an integration receipt protocol; original F1 plus a PR.md directory cover mkdir and read failure paths."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Remove reconstruction of collision provenance from operator recovery so parallel orders remain independently repairable.",
    "traps": {
      "policyResistance": "Release preparation and integration agree: failed preparation preserves original collision inputs, and successful preparation supplies the stub’s complete outcome.",
      "tragedyOfTheCommons": "Reuse one reader and the existing fixtures and gates; no new producer.",
      "driftToLowPerformance": "Criterion 3 requires complete provenance despite passing old tests.",
      "escalation": "Reorder existing outputs without another state protocol.",
      "successToTheSuccessful": "Compare durable journaling and rollback instead of assuming the existing sequence is required.",
      "shiftingTheBurden": "Retry records the collision without manual reconstruction.",
      "ruleBeating": "Check exact original input bytes after failure and complete original/replacement/baseline evidence after continuation.",
      "seekingTheWrongGoal": "Measure complete recovered collision evidence, not a success exit alone."
    },
    "naiveInterventionism": "Keep meter collection semantics, core rollback, printed paths, classification and the single integration decision. Ancillary outputs may exist after a core refusal; these are recomputed on retry. This is filesystem failure sequencing, not a process-crash or stdout delivery guarantee.",
    "noOp": "Would keep the confirmed acceptance defect; rejected."
  },
  "rejected": [
    {
      "option": "Persist a pending outcome in the integration receipt",
      "reason": "Adds shared protocol and needs recovery for failed apply; sequencing prevents the demonstrated loss with a smaller change."
    },
    {
      "option": "Roll back all ancillary outputs and target edits together",
      "reason": "Requires extending the transaction across snapshot and PR producers; those writes can finish before the core plan instead."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D015",
    "observation": "Repair the named F1 class by keeping core inputs unchanged on ancillary filesystem failures; executable evidence follows in the repair handoff."
  },
  "reopenWhen": "A filesystem failure can still leave a changed target without its collision record, or a process interruption/stdout failure is shown to require broader recovery guarantees."
}
```

## WO-086-D020 — Integrated repair evidence and carried-forward claims

```json
{
  "id": "WO-086-D020",
  "date": "2026-09-29",
  "dispatch": "resume: fix; repair handoff",
  "decision": "The integrated executor subject meets all five criteria, including the repaired filesystem-failure class in VER-001 F1. Hand off for fresh independent verification; VER-001 remains the failed judgment of its original subject. The integration draft remains for final review’s own assessment.",
  "evidence": [
    "Integrated original base 3a68c517668555ae201feb8f1d51ee86c9e9ada0 with fetched main 4d7c3319aed15abc9ae80a2ea3badadfcba5e878 by canonical worktree integrate; fast-forward HEAD now equals fetched main; checkpoint refs/dotln/checkpoint/WO-086/6 and named stash retained.",
    "Two blocked-PR regressions pass: original EEXIST parent-file blocker and nonempty PR.md directory causing EISDIR. Both preserve exact heading and README bytes and no decision on failure, then record exactly one complete original collision on continuation. Focused run 2/2 in 30.04 s.",
    "Fixture correction: the initial empty PR.md directory vanished during Git stash cleanup, so that case did not exercise its intended failure (1/2 passed). Added a regular blocker file inside the directory; both cases then executed the intended error and passed.",
    "npm test -- --review: 31 suites passed, 0 failed, 324.054 s, 75 fresh tasks, recorded 2026-09-29T18:51:45.607Z; complete passing code identity eb3e0a372c8dc0e5cbe2aa802545d982552552c3cad55bc7f1bee89adb832c44. The review selection is now against integrated main, so it no longer includes the eight incoming sibling machinery suites that widened the initial executor’s selection to 39.",
    "npm run test:docs: 23 checks passed, 0 failed, 15.126 s, recorded 2026-09-29T18:45:58.318Z, same code identity eb3e0a372c8dc0e5cbe2aa802545d982552552c3cad55bc7f1bee89adb832c44; completion reruns the document gate on the final evidence text.",
    "Byte identity: all six original archive ranges keep D008’s SHA-256 values and each occurs once in the archive and zero times in the roadmap; D017’s additional main paragraph is 741 bytes and likewise occurs once/zero. Total archived ranges: 66,778 bytes.",
    "Current history: 115 recorded annotated tags including v0.56.0/WO-117. Current counted 06 bytes 96,395, exempt block 31,537; unchanged ceiling 98,323 = ceil(96,395 × 1.02); zero receipt shapes under Release boundary. Products 07 and 10 remain 154,878 and 25,744 counted bytes.",
    "publication:check, harness check, release check-surfaces --local and git diff --check pass; package.json and package-lock.json equal integrated HEAD. Components are unchanged against v0.56.0, and the patch target is v0.56.1.",
    "VER-001 bytes equal the integration checkpoint’s copy. One read-only agent reviewed diagnosis and final changes in two turns, no descendants; the root remained the sole writer. Explicit count 1 against cap 20; the harness observed zero admissions and uncounted coverage remains unknown."
  ],
  "carriedForwardClaims": {
    "criterion1": "History generation and recorded-tag behavior unchanged; fresh docs fixtures plus refreshed 115-tag table check the integrated subject.",
    "criterion2": "Original six ranges retain their hashes; main adds one preserved range (D017).",
    "criterion3": "Fresh blocked-output recovery cases establish the repaired class; normal collision/conflict cases remain in the complete integration suite.",
    "criterion4": "Generated snapshots/locks updated and incoming roadmap paragraph archived; original authorized ceiling and product write-backs remain valid.",
    "criterion5": "Fresh product and document gates pass; no dependency added by this order."
  },
  "rejected": [
    {
      "option": "Reuse VER-001’s met claim for criterion 3",
      "reason": "Its criterion 3 was unmet; repaired behavior needs fresh executable evidence and independent verification."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D015",
    "observation": "F1’s ancillary filesystem-failure class passes on the integrated repaired subject; independent verification still owns the next verdict."
  },
  "reopenWhen": "Fresh verification finds an incomplete collision record or another criterion unmet."
}
```

## WO-086-D021 — Verification: a failed integration stub after a successful retime loses collision provenance

```json
{
  "id": "WO-086-D021",
  "date": "2026-09-29",
  "dispatch": "resume: verify; independent VER-002",
  "kind": "finding",
  "decision": "Fail criterion 3 on F2, a defect VER-001 missed in the subject it judged; the executor's repair fixed F1 as reported and did not introduce F2. The integration decision stub follows a successful release prepare --integration; when that stub cannot be written, the heading and README already carry the new target; continuation reruns preparation, which reports only that the new target remains current, and the stub then records that line without the superseded target or the baseline. The verifier changes no behavior.",
  "evidence": [
    "docs/verifications/WO-086/VER-002.md F2: isolated real-Git copies of scripts/test-worktree-integration.mjs's fixture({ authored: false }), run from the verifier's session scratch; no real worktree, remote or tag was changed.",
    "Variant 1: a regular file at docs/evidence/WO-998. First pass exits 1 with 'Pending: integration decision stub: EEXIST ... mkdir .../docs/evidence/WO-998'; heading and README claim already read v9000.0.2. After the blocker is removed, --continue exits 0 and writes one decision whose release evidence is 'WO-998 target v9000.0.2 remains current.'; the record contains no v9000.0.1.",
    "Variant 2: docs/evidence/WO-998 as a symlink to a directory inside the repository. Prepare's containment check admits it; the stub's put() refuses 'integration destination escapes its worktree'; the continuation records the same incomplete line.",
    "Present before the repair: git diff --stat between refs/dotln/checkpoint/WO-086/3 (VER-001's subject) and this subject is empty for scripts/lib/worktree-integration.mjs and scripts/lib/release-preparation.mjs. VER-001 reproduced only the PR output and asked for only that fixture; this is a verification miss, not an executor failure.",
    "Source: scripts/lib/worktree-integration.mjs regenerate() computes stubbed from the marker and passes --integration while no stub exists, then assigns receipt.release from the rerun, replacing the saved retime outcome from the first pass; decisionStub() is the only writer of the collision record under --integration (scripts/lib/release-preparation.mjs appends none).",
    "The executor's claims otherwise reproduce: the five WO-086 integration fixtures (including both F1 blocked-PR regressions) and 12 preparation tests pass fresh; npm test -- --review reuses the complete passing row at code identity eb3e0a372c8dc0e5cbe2aa802545d982552552c3cad55bc7f1bee89adb832c44; npm run test:docs passes 23/23."
  ],
  "rejected": [
    {
      "option": "Board F2 outside the declared criteria",
      "reason": "It is the observable failure criterion 3 excludes and VER-001 failed: a completed continuation records one incomplete collision decision. Verification's earlier miss does not change what the current bytes do."
    },
    {
      "option": "Have the verifier repair implementation",
      "reason": "Independent verification records a finding and preserves the executor's repair duty."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D015",
    "observation": "VER-001's finding covered only the PR output; the integration decision stub, unchanged since that subject, fails the same criterion after a successful release prepare --integration."
  },
  "followup": "WO-086 resume: fix, F2: once release preparation under worktree integrate has changed the target, its superseded target, new target and baseline must reach exactly one integration decision even when the stub write fails and the pass is continued (for example, keep the pass's saved retime outcome when a continuation's rerun only reports the target as current, or record the collision where the stub cannot be written). Paths: scripts/lib/worktree-integration.mjs, scripts/release.mjs, scripts/lib/release-preparation.mjs, scripts/test-worktree-integration.mjs. Add regression fixtures for a stub blocked by a regular file and by a symlink at docs/evidence/WO-NNN; run npm test -- --review and npm run test:docs, then fresh independent verification. Priority medium; criterion 3 is unmet.",
  "reopenWhen": "A repair records one complete collision decision after a failed stub write and continuation, and independent verification passes criterion 3."
}
```

## WO-086-D022 — File the saved preparation outcome before preparing again

```json
{
  "id": "WO-086-D022",
  "date": "2026-09-29",
  "dispatch": "resume: fix; VER-002 F2",
  "decision": "When an integration has a successful saved release-preparation outcome but no integration decision marker, write that decision from the saved outcome before invoking preparation again. If the stub still fails, withhold preparation and retain the outcome and target. Once the stub succeeds, invoke ordinary preparation so any newer collision gets its own decision through the existing post-stub path. Keep the receipt format, core rollback and F1 output ordering.",
  "evidence": [
    "VER-002 F2 and regenerate() show receipt.release survives the failed stub but is overwritten by the next successful prepare before decisionStub consumes it.",
    "receipt.release is assigned only when the spawned prepare command succeeds; integrateWorktree saves it even when regeneration has pending steps.",
    "decisionStub's checkpoint marker makes repeated filing idempotent; the existing late-tag fixture records a later collision with ordinary prepare after the marker exists.",
    "One read-only agent reviewed both the failure and this sequencing alternative; root remains the sole writer. Explicit dispatch fan-out: one agent, no descendants, cap 20.",
    "D002's existing economy experiment was read before implementation and remains the order's only experiment. No adjacent item is diagnosed; the queue is empty."
  ],
  "correction": "D019's claim that successful preparation always supplies the stub's complete outcome was too broad. VER-002 demonstrates that a later stub failure lets retry overwrite it. F1 ordering remains correct; this repair extends recovery to the saved successful outcome.",
  "goalAlignment": {
    "missionAndCriticalPath": "Make independent parallel lanes recover without the operator reconstructing release provenance; preserve the smaller release-history probe and its recorded contracts.",
    "traps": {
      "policyResistance": "Preparation waits until the integration recorder consumes its saved success, so the producers cannot undo each other's evidence.",
      "tragedyOfTheCommons": "One reused reader, existing real-Git fixtures and required gates; no new producer or receipt history.",
      "driftToLowPerformance": "Require complete original/replacement/baseline records rather than accept green tests that omitted retry.",
      "escalation": "Sequence existing operations without another gate, event or recovery protocol.",
      "successToTheSuccessful": "Compare accumulated history and rollback with sequence repair; publication-time version assignment remains the existing map candidate.",
      "shiftingTheBurden": "Continuation files saved evidence without a manual reconstruction step.",
      "ruleBeating": "Fixtures assert saved bytes during blocked retries and each complete transition exactly once after recovery, including a newer collision.",
      "seekingTheWrongGoal": "Judge complete recoverable provenance and unchanged product prose, not successful exit or fixture counts."
    },
    "naiveInterventionism": "Retain all existing producers, classification, one draft integration decision, separate later-collision decisions, core rollback, recovery refs and stash. Only a retry with an unfiled successful outcome changes order. Process interruption and partial low-level writes remain untested; this does not add crash atomicity.",
    "noOp": "Preserves the independently reproduced criterion 3 failure and operator reconstruction burden; rejected."
  },
  "rejected": [
    {
      "option": "Accumulate successful preparation stdout in a receipt history",
      "reason": "A new history protocol is unnecessary when the existing saved outcome can be filed before another preparation; repeated no-op output would also need deduplication."
    },
    {
      "option": "Keep only the first outcome but continue preparing before filing it",
      "reason": "A newer tag can cause another collision while the stub remains blocked and that outcome would then be lost."
    },
    {
      "option": "Roll target edits back when the stub fails",
      "reason": "Extends rollback across separate producers despite the existing receipt already holding the complete outcome needed for recovery."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D021",
    "observation": "Repair the recorded zero-write stub failure and continuation class; fresh regression and full-gate evidence will be recorded at handoff."
  },
  "reopenWhen": "A successful saved preparation outcome can still be overwritten before filing, a later collision lacks its own complete decision, or executed evidence establishes a broader interruption/partial-write defect."
}
```

## WO-086-D023 — F2 repair evidence and handoff

```json
{
  "id": "WO-086-D023",
  "date": "2026-09-29",
  "dispatch": "resume: fix; VER-002 F2; repair handoff",
  "decision": "Hand off the repaired subject for fresh independent verification. The executor judges all five criteria met on the recorded final code identity. Saved successful preparation is filed before another preparation; a blocked stub retains its outcome and target, and a later collision is recorded separately after the original stub succeeds. Preserve both failed verification reports and the existing integration recovery material.",
  "evidence": [
    "The three new stub regressions failed against the previous implementation: 0 passed, 3 failed, 43.625 s. Regular-file and symlink continuations lost v9000.0.1 and the baseline; the repeated blocked retry still invoked preparation.",
    "Focused WO-086 run before the final diagnostic extension: 8/8 passed in 107.195 s; transcript docs/evidence/WO-086/stub-recovery-fixtures.txt. Includes F1 blockers, F2 blockers, repeated blocked continuation with a newer tag, the authored-conflict refusal and the existing post-stub collision path.",
    "Final fixture extension: after the saved stub succeeds, force ordinary preparation to fail at PR.md with EISDIR; the saved complete outcome stays, no false pending-stub message is printed, and a further continuation completes with exactly one integration record. The final full gate runs these extended bytes.",
    "Fresh npm test -- --review: 31 suites passed, 0 failed, 359.026 s, 75 fresh tasks, recorded 2026-09-29T19:19:52.302Z; code identity db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52; evidence host-gate:db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52:npm test. Complete transcript: docs/evidence/WO-086/stub-recovery-review-gate.txt. Final worktree-integration suite passed in 257.121 s.",
    "Fresh npm run test:docs: 23 passed, 0 failed, 14.932 s, recorded 2026-09-29T19:21:09.403Z at the same code identity. Completion checks the final document bytes inline again.",
    "node --test scripts/test-release-preparation.mjs: 12/12 passed, 1.639 s. Local release prepare keeps v0.56.1; no component source changed and package.json/package-lock.json equal integrated HEAD.",
    "Current release list --markdown equals the 115-row roadmap block. Its recorded-tag check reports no failure and no newer tag. Seven archive ranges, 66,778 bytes, match all D008/D017 SHA-256 values, each occurring once in the archive and zero times in current product 06.",
    "Product 06 counts 96,395 bytes, exempts 31,537, reports no failures and keeps ceiling 98,323 = ceil(96,395 x 1.02). Publication locks, plan check, 31 harness surfaces and git diff HEAD --check pass. Write-backs and the bound D004/D016 amendments remain present.",
    "VER-001 and VER-002 equal checkpoint refs/dotln/checkpoint/WO-086/9 byte for byte. Their SHA-256 values are 6825700c6cb484bcddfc056ac6743e035e27f21646488e02557da7b46945116b and f2b728ed8a05ea850ced6f279ef5064bcfc4158579b5ae143714d4dca97a63de, respectively.",
    "One read-only agent reviewed diagnosis and final source/fixtures in three turns without descendants; no blocker remains in that review. Explicit count one of cap 20; root is the only writer. D002 remains the sole economy experiment and the adjacent queue has no item."
  ],
  "correction": "The earlier handoff and D020 judged criterion 3 met after F1, but VER-002 independently showed the omitted F2 stub-write path still failed. This handoff replaces that current criterion judgment with evidence for both paths; neither earlier verification report is rewritten.",
  "rejected": [
    {
      "option": "Reuse the earlier passing gate at eb3e0a37",
      "reason": "The repair changes executable source and fixtures; its final code identity needs its own complete gate."
    },
    {
      "option": "Treat these executor checks as a verification verdict",
      "reason": "A separate resume: verify dispatch owns the fresh independent judgment."
    }
  ],
  "reopens": {
    "decisionId": "WO-086-D022",
    "observation": "The final gate verifies the retained-outcome rule, including another failed preparation after filing and a newer collision during blocked recovery."
  },
  "reopenWhen": "Fresh verification falsifies any criterion, a blocked continuation loses saved evidence, or a later collision is omitted or recorded more than once."
}
```

## WO-086-D024 — Final review: pass, and the hardening items it met

```json
{
  "id": "WO-086-D024",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "kind": "finding",
  "decision": "Pass WO-086 on FINAL-001. The review met seven hardening items and fixed none of them, since a reviewer writes no behavior; none falsifies a criterion. Board them as one follow-up. (1) A hand-run release prepare --local --integration is admitted while an integration is pending even after its stub was written or while a saved outcome waits, and then its retime is recorded nowhere; the helper never passes the flag in those states, and the flag is documented nowhere outside the code. (2) Ordinary release prepare writes decisions.md through a symlinked docs/evidence/WO-NNN whose target lies inside the repository, where the integration stub's put() refuses. (3) The conflict-marker test needs both a <<<<<<< and a >>>>>>> line, so a record keeping only <<<<<<< and ======= passes. (4) A directory at decisions.md aborts an integration pass with a bare EISDIR outside run(), with no pending lines; the continuation after it is removed still records one complete decision. (5) The docs check passes silently when the whole generated release-history block is removed from 06: nothing is exempted, but the table's absence goes unnoticed. (6) Deleting an older row together with its snapshot entry passes, with the tag reported as newer; this is the work-order index's own rule. (7) An annotated release tag with no message body crashes the docs check's newer-tag read, as it already crashes release list; release close cannot make one.",
  "evidence": [
    "Two read-only reviewers dispatched by this final review, each reproducing in temporary repositories outside the worktree, with the worktree's status unchanged: items 1-4 from the collision-path review (E1: stub written, index step failed, tag v9000.0.5 landed, a manual --integration run retimed v9000.0.5 to v9000.0.6 and --continue completed with no v9000.0.6 in the record; E2: stub blocked, tag v9000.0.2 landed, the manual run retimed to v9000.0.3, which appears nowhere in the record); items 5-7 from the release-history review.",
    "Source: scripts/release.mjs's --integration guard checks only the receipt's workOrder, complete and stage; scripts/lib/release-preparation.mjs holds the heading and README to realpath equality but decisions.md only to containedRegularFile or a contained ancestor, and decisionsConflicted's marker pattern needs both marker lines; scripts/lib/worktree-integration.mjs regenerate() reads the decisions record before run(); scripts/lib/release-history.mjs checkReleaseHistory returns no failure when historyBlock finds no marker, and its newer-tag read sits outside the try.",
    "Criteria unaffected: criterion 3 names the collision through release prepare and the integrate helper, which never invokes --integration after its stub or with a saved outcome (VER-003 and the collision reviewer's fresh 8/8 WO-086 fixtures and 12/12 preparation tests); criteria 1 and 4 name the block's rows and exemption, which the release-history reviewer's probes held (changed rows, receipts inside the block, unregistered, quoted, fenced and misplaced pairs, demoted or hidden headings, CRLF and BOM).",
    "D006 already records the other observation: worktree integrate does not regenerate the block (deliberately, since the collision path writes no product document), so two lanes that each ran --write would meet the snapshot line as an authored conflict; its reopening condition covers a stale table.",
    "Observation, not a finding: 06's standing Operator default paragraph still names WO-028, WO-026, WO-020 and WO-030 as applications of the 2026-09-04 default. These are clauses of standing policy, not activation-completion paragraphs; D004's reopening condition gives a consolidation (WO-087) the choice of moving them."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order removes the reading cost the operator named for running two lanes at once: the release record is the tag, a collision writes one decision, and no paragraph lands on the surfaces a reader meets first. The pass lets the next pair integrate against a generated table instead of hand-kept notes.",
    "traps": {
      "policyResistance": "release prepare, the integrate helper, the docs check and product 07 now agree on one collision record; the boarded items are edges where a human bypasses the helper, not places where the producers disagree.",
      "tragedyOfTheCommons": "Two read-only reviewers out of 20 slots, no descendants; one product gate at the final code identity.",
      "driftToLowPerformance": "The pass rests on reproduced hashes, table equality and three verifications, not on suite counts; the two failed verifications stand unrewritten.",
      "escalation": "No new gate, event or approval step; the items go to the register, not into a new refusal written by the reviewer.",
      "successToTheSuccessful": "Version assignment at publication (FUP-38ced82ed597d07b) stays the structural alternative; this review records its misuse edge as evidence for that candidate's reopening judgment after close.",
      "shiftingTheBurden": "Every item is recorded with its reproduction and paths, so the next writer inherits a bounded fix, not a rediscovery.",
      "ruleBeating": "The exemption holds only while the block equals its recorded tags; removing the block exempts nothing, so item 5 is visibility, not a hole.",
      "seekingTheWrongGoal": "Judged by what a reader of 06, 07 and the README meets and by complete collision provenance through the helper, not by byte counts, which rise under D004."
    },
    "naiveInterventionism": "The reviewer changes no behavior: the executor's sequencing, the fixtures, recovery refs, the integration stash and both failed reports are preserved.",
    "noOp": "Failing the review for items that need manual misuse or contrived tags would send a verified order into a fourth repair cycle without any criterion being unmet; leaving the items as report prose would lose them. Both are rejected."
  },
  "rejected": [
    {
      "option": "Fail the review on item 1",
      "reason": "Criterion 3 names the collision through release prepare and the integrate helper; item 1 needs a hand-run of an internal flag the helper never passes in those states."
    },
    {
      "option": "Fix the items in review",
      "reason": "A reviewer never writes a behavioral fix and certifies it (product 07 §Independent workflows and integration)."
    }
  ],
  "followup": "Next order that edits release preparation, the integrate helper or the release-history check, or a document-maintenance pass: harden the collision recorder and the table check. Refuse release prepare --integration once the integration's stub marker exists or a saved release outcome waits, or admit it only through a token the helper passes. Hold decisions.md to the heading's realpath rule. Treat a lone conflict marker line as conflicted. Read the decisions record inside run() in regenerate(). Refuse a missing registered block in 06. Report a bodiless tag as a failure, not a crash. Paths: scripts/release.mjs, scripts/lib/release-preparation.mjs, scripts/lib/worktree-integration.mjs, scripts/lib/release-history.mjs, scripts/docs-check.mjs, with their tests. Checks: node --test scripts/test-release-preparation.mjs scripts/test-worktree-integration.mjs scripts/test-docs-check.mjs, npm run test:docs, npm test -- --review. Priority low: no helper path loses a record.",
  "reopenWhen": "A real integration or release preparation meets one of these items, or a collision through the helper still needs a hand step."
}
```

## WO-086-D025 — Correction: the release-history notes ended in a blank line

```json
{
  "id": "WO-086-D025",
  "date": "2026-09-29",
  "dispatch": "resume: final review",
  "kind": "correction",
  "decision": "Append a short 'Byte identity' section after the last moved range of docs/planning/release-history-notes.md, so the file no longer ends in that range's blank line. No moved byte changes.",
  "misread": "Criterion 5's 'git diff --check clean' was judged with git diff HEAD --check and git diff --cached --check while the receipt was untracked, so neither saw it. Staged at final review, git diff --cached --check reported 'docs/planning/release-history-notes.md:907: new blank line at EOF'.",
  "meant": "The committed subject passes git diff --check, and all seven moved ranges stay byte-identical, as criteria 2 and 5 read together require.",
  "changed": "The receipt's last range, main 4d7c3319 lines 23-33 (741 bytes), ends with source line 33, a blank line inside its hashed bytes, so deleting that line would break D017's SHA-256. The final review instead added a closing section after it; this is a document correction, not behavior. All seven ranges were recomputed from git show afterwards: each keeps its D008 or D017 SHA-256 and occurs once in the receipt and zero times in 06, 66,778 bytes in all.",
  "evidence": [
    "git diff --cached --check after staging: exit 2, docs/planning/release-history-notes.md:907: new blank line at EOF.",
    "git show 4d7c3319:docs/product/06-roadmap.md line 33 is empty; the range's bytes end in two newlines.",
    "VER-003 criterion 5: 'git diff HEAD --check and git diff --cached --check are clean', recorded while the receipt was untracked (VER-002 criterion 2: 'The receipt is untracked')."
  ],
  "rejected": [
    {
      "option": "Delete the trailing blank line",
      "reason": "It is the last byte of a hashed range; criterion 2 requires the range byte for byte."
    },
    {
      "option": "Fail the review and route a repair",
      "reason": "A whitespace fix to a document leaves every behavior, criterion judgment and hash unchanged; product 07 routes behavioral fixes and acceptance defects to repair, and this record makes the correction visible."
    }
  ],
  "reopenWhen": "A moved range's hash no longer matches, or a verification again judges git diff --check while new files are untracked."
}
```
