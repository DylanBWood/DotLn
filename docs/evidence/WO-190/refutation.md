# WO-190 design refutation: criteria lens

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back, unknown), given the order and the executor's design note, read-only, on 2026-10-09 before any implementation. Findings as returned, each with the executor's disposition in the implemented design. Counts: 21 found; 19 fixed; 2 recorded. A link a worker quoted is shown with its parenthesis escaped so it reads as text.

## F1 (major) — design note §3 line 24 (README: 'Sections rendered: Active, Open only. Link definitions … for EVERY row … No ## Sources and limits'); packages/console/src/text-sources.ts:156-160

- **Claim:** On the new README the link definitions come straight after the last Open card. The console's parseWorkOrderIndex reads every line up to the next h1-h3 heading and treats any line starting with `[WO-` as the card title. So the last README card gets a link-definition line as its title. This breaks the work view's index row, and the regenerated console fixtures will show a title change that the order's carry-in ('their difference is the added source and the cards' new page') does not account for.
- **Evidence:** text-sources.ts:156 `while (i + 1 < lines.length && !/^#{1,3} /u.test(lines[i + 1]!))` and :160 `if (line.startsWith("[WO-")) values["title"] = plainText(line);`. Today `## Sources and limits` stops the loop before the definitions. Simulation, read-only (scratch parse.mjs): cutting the pages at `## Closed` and appending the definitions gives `TITLE CHANGED WO-198 … split: [WO-199]: WO-199-the-vertical-survives-an-interrupt.md` on the base README, and `TITLE CHANGED WO-109 … split: [WO-109]: WO-109-shape-first-source-remine.md` on packages/console/fixtures/inputs/workOrderIndex.md. runtimeOrdersFromIndex is unaffected because it matches only `^- `.
- **Proposed fix:** Change parseWorkOrderIndex (already in scope) so it takes the title only from an inline-link line (`/^\[WO-\d{3} [^\]]*\]\(/`) and stops a card at a `^\[WO-\d{3}\]: ` definition. Add a text-adapter test where the last card is followed directly by definitions, and confirm the regenerated fixtures change no title.
- **Disposition:** fixed: parseWorkOrderIndex takes the title only from an inline-link line and ends a card at a definition line (D005)

## F2 (major) — design note §11 line 75 (test-resume.sh case '(fails at 08845c71 because superseded entries never block)'); order criterion 4 lines 226-229 and step 4 line 177

- **Claim:** Criterion 4 requires that the activation fixture fails against 08845c71. The design only infers this and plans no run or evidence file. A verifier who reads only the order, the diff and the evidence files has nothing showing the case fails at 08845c71, or that it fails for the right reason: activation succeeding, not some unrelated refusal.
- **Evidence:** At 08845c71 and at the base, `activate` goes from workOrderDeclaration straight to readDependencies (scripts/resume.mjs:1296-1328), and superseded entries never block (dependencies.mjs `superseded: ["by"]`; Sources text 'supersessions never block'). Nothing records a run of the new case against 08845c71's resume.mjs and lib. test-resume.sh copies `$script_dir/resume.mjs` and `lib` into the fixture (lines 25-26), so the old sources have to be supplied on purpose. Running the whole 08845c71 suite would fail earlier on unrelated cases.
- **Proposed fix:** Put the umbrella case in a fresh sub-fixture where activation would otherwise succeed. Add an evidence step: extract `scripts/resume.mjs` and `scripts/lib` from 08845c71 (`git archive 08845c71 scripts/resume.mjs scripts/lib | tar -x -C <tmp>`), run the same invocation, and record exit 0 plus the appended WorkOrderActivated event (so assert_refusal fails) in docs/evidence/WO-190/activation-08845c71.txt. Cite that file from the criterion 4 handoff line.
- **Disposition:** fixed: the umbrella case lives in its own fixture repository; docs/evidence/WO-190/activation-08845c71.txt records the run against the 08845c71 scripts (exit 0, event appended) and against this order's (refused)

## F3 (major) — design note §9 line 62 (planned roadmap test); order criterion 7 'no rung's body text is changed' line 244

- **Claim:** Nothing tests or records the criterion 7 clause that no rung's body text is changed. The planned test checks heading order, the first pending rung, the absence of `WO-` in headings and the marker position only. After the reorder, a naive per-section diff would also wrongly report a change: Post-1.0 horizons becomes the section just before `<!-- prettier-ignore -->` / `## v0.0.0`, so it picks up that line in check-publication's section slicing.
- **Evidence:** 06-roadmap.md:322-323 `<!-- prettier-ignore -->` then `## v0.0.0 …`. Post-1.0 horizons (line 715) currently runs to EOF. check-publication.mjs headings() ends a section at the next heading of the same or higher level, so the comment line falls inside the previous section. The design §9 test list has no body comparison.
- **Proposed fix:** Add a test, or a recorded evidence command, that maps each rung heading in `git show e3b38663:docs/product/06-roadmap.md` to the new file (with the two renamed headings mapped explicitly). It compares each body, normalized only for trailing blank lines and a trailing `<!-- prettier-ignore -->`, and asserts they are equal. Record the result in handoff for criterion 7.
- **Disposition:** fixed: the roadmap test compares every rung body with the base commit's, normalized for trailing blank lines and a trailing prettier-ignore line, while the recorded hash matches

## F4 (major) — design note §9 line 62 (permanent test in scripts/test-docs-check.mjs asserting the live roadmap's headings deepEqual docs/evidence/WO-190/roadmap-order.json)

- **Claim:** The design makes WO-190's evidence JSON a standing input to the document gate. The next legitimate roadmap heading edit (a rung closing, a new rung, a rename) would fail `npm run test:docs`. A planning pass may not fix that by editing the evidence, because a pass never edits immutable evidence.
- **Evidence:** product 07:1289-1290 'A planning pass never activates, implements, tags, publishes, merges, edits immutable evidence…'. Design §9: 'reads the real roadmap's headings … and asserts deepEqual with the JSON'. Pending rungs are expected to move to closed as they ship.
- **Proposed fix:** Keep the permanent assertions to invariants: the intro links ../work-orders/README.md; the first `##` after the intro is pending; every pending rung precedes every closed rung; no pending heading names an id that umbrellaRecord() classes as an umbrella; the release-history end marker is the last marker. Make the exact deepEqual self-retiring: store the roadmap's sha256 in the JSON and run the exact comparison only while the live file has that hash, printing a notice otherwise. Record this resolution of step 8 in decisions.
- **Disposition:** fixed: durable invariants are asserted always; the exact order and body checks retire as a visible skip when the masked hash changes (D006)

## F5 (major) — scripts/test-concurrent-control.mjs:197-214 (not in design §11)

- **Claim:** This test merges two branches that each close an order and regenerate the index. It asserts that every merge conflict is in docs/control/current.md or docs/work-orders/README.md. With HISTORY.md, both branches insert a Closed card at the same place, so HISTORY.md conflicts and the assertion fails. The design does not list this test.
- **Evidence:** `conflicts.every((path) => ["docs/control/current.md", "docs/work-orders/README.md"].includes(path))` at lines 203-209. closeOrder runs `command(root, "work-orders", ["index"])` then commits (lines 172-173). Closed cards are id-sorted under one `## Closed` heading, so both branches insert between the same neighbouring lines (or both replace the same `None.`).
- **Proposed fix:** Add docs/work-orders/HISTORY.md to the allowlist (and to the 'Resolved generated projection conflicts' path). Add the test to §11 and run it in the review gate.
- **Disposition:** fixed: docs/work-orders/HISTORY.md joined the merge-conflict allowlist of scripts/test-concurrent-control.mjs; the review gate's release suite passed

## F6 (major) — scripts/test-derived-orders.mjs:435; scripts/test-work-orders.mjs:1406-1411 (neither in design §11)

- **Claim:** These existing assertions break under the design and are not in the fixture-adjustment list. test-derived-orders expects a withdrawn derived order in section 'Closed', but the design moves withdrawn rows to 'Withdrawn'. The typed-index test splits `renderIndex(...)` output on `## Closed\n` and `## Historical\n`, which no longer exist on README, so `.split(...)[1]` is undefined and throws a TypeError.
- **Evidence:** test-derived-orders.mjs:435 `assert.equal(readIndex(root, []).rows[0].section, "Closed");` after a `withdraw` (lines 406-428). test-work-orders.mjs:1408-1411 `for (const section of ["Closed", "Historical"]) assert.doesNotMatch(rendered.split(`## ${section}\n`)[1].split(/\n## /)[0], /\bblocked\b/)` where `rendered = renderIndex(projection)`.
- **Proposed fix:** Update test-derived-orders to expect 'Withdrawn'. Point the typed-index assertions at renderHistory(projection) and include Withdrawn and Superseded. List both in §11. Also run `grep -rn 'renderIndex\|readIndex\|section' scripts/test-*.mjs` as the completeness check.
- **Disposition:** fixed: test-derived-orders expects Withdrawn; the typed-index and withdrawn-index assertions read renderHistory output

## F7 (major) — design note (no section covers criterion 8); order criterion 8 lines 245-247

- **Claim:** The design has no step for criterion 8. No audit lists the links into the index, and at least one tracked link will point at a page that no longer holds its target, because the Sources and limits text (the evidence-label definitions) and the release attribution of settled orders move to HISTORY.md.
- **Evidence:** docs/planning/work-order-map.md:3881 'The [index]\(../work-orders/README.md) defines its evidence labels' (the label definitions are renderSources, which moves to HISTORY). docs/PLAYBOOK.md:186 links the generated index 'for header, control, typed dependency, and local release evidence'. docs/product/13-uifa-roles.md:67 links it for 'what a release contained'. `git grep` found no `README.md#` card anchors, so docs-check alone passes and says nothing about where a link's target now lives.
- **Proposed fix:** Add a step: `git grep -n 'work-orders/README.md\|(README.md)' -- '*.md'` over docs/ and the root Markdown files. Classify each link by what it cites, retarget or add a HISTORY.md link where the cited content moved (work-order-map §Status boundaries at minimum), record the audit table in decisions, and cite `npm run test:docs` (docs-check) as the green link check.
- **Disposition:** fixed: D007 records the link audit; PLAYBOOK, the map's status boundaries and product 13 were retargeted

## F8 (major) — design note §10 line 69; docs/product/07-execution-guide.md:1202; docs/product/03-architecture.md:2369

- **Claim:** Criterion 9 requires product 07's sentences on the generated index to name both pages. The design edits lines 318, 327 and 823 but misses line 1202, which will say something false: that the generated index's Closed section is the record of closed sequence entries. Product 03 carries the same sentence, plus the claim that withdrawn entries are listed there, and it also becomes false.
- **Evidence:** 07:1201-1202 'the sequence revision, from which closed entries leave at each pass (the generated index's Closed section is their record)'. 03:2369-2371 'the generated work-order index's Closed section is their record. A withdrawn entry (WO-158) … is listed there under its disposition.' The design moves Closed to HISTORY.md and gives withdrawn rows their own section.
- **Proposed fix:** Edit 07:1202 in place to name the history page's Closed and Withdrawn sections. Edit 03:2369-2371 the same way (it carries `dotln-check=suite:publication`, so rerun publication:check), or record it as a dated follow-up in decisions. Re-grep both documents for 'Closed section' before handoff.
- **Disposition:** fixed: product 07 line 1202 and product 03's planning-sequence paragraph name the history page

## F9 (major) — order criterion 1 lines 211-217 vs criterion 2 lines 218-220; design note §2-§3

- **Claim:** Taken literally, criterion 1 contradicts criterion 2 for the repository as it stands, and the design does not record how it reads them. The sequence holds four closed entries (WO-196, WO-199, WO-197, WO-074). Criterion 1's 'one card per active or sequenced order' would put their cards on README, while criterion 2 forbids closed cards there. Unsequenced derived drafts would sit on README even though they are neither active nor sequenced, and they belong to none of the four HISTORY classes.
- **Evidence:** Read-only readIndex over the worktree: sections {Historical: 2, Closed: 157, Open: 37, Active: 1}; 'seq closed: WO-196 WO-199 WO-197 WO-074'. Design §3 renders Active and Open only, and §2 sends unsequenced open rows to Open, after the sequenced ones.
- **Proposed fix:** Record a decision that reads 'sequenced' as 'open and in the sequence': settled sequence entries stay in the README list (checked or withdrawn), with their cards on HISTORY.md. Derived drafts are Open on README. Assert that reading in the two-pages fixture and in the repository partition test (README cards = Active ∪ Open; HISTORY = Closed ∪ Withdrawn ∪ Superseded ∪ Historical).
- **Disposition:** recorded: D002 records the reading: settled sequence entries keep their rows with their cards on the history page; derived drafts are Open cards; the partition check and fixtures assert it

## F10 (minor) — design note §5 line 36 and Q1; order Design bullet lines 132-135 and criterion 5

- **Claim:** The coverage refusal exempts Active rows and derived drafts. The Design bullet says the refusal covers any order 'that is neither settled nor an umbrella record', which includes both. The exemptions are neither tested nor recorded as decisions.
- **Evidence:** Design §5: 'Active rows are not judged … Derived drafts are exempt'. The planned two-pages fixture proves only 'umbrella absent from the sequence passes'. Fixtures that need the Active exemption: test-harness.mjs:428, test-process-debt.mjs:2989/2993 (WO-999 activated at 1680-1689), test-derived-orders.mjs:157, test-portfolio.mjs:430.
- **Proposed fix:** Record both exemptions as decisions. Cite product 07 §Derived work and intent (lines 464-480: drafts filed by `dotln intent` and admitted by a resident are 'visible in the work-order index') and the fixtures above. Add two fixture cases, an unsequenced Active order and an unsequenced derived draft, that pass `index --check`, next to the WO-904 refusal.
- **Disposition:** fixed: D004 records both exemptions with evidence; fixtures cover an unsequenced active order, a derived draft and an umbrella

## F11 (minor) — design note §4 line 29 ('Superseded cards add one line `- Successors: …`'); order Non-goals line 285

- **Claim:** A new `- Successors:` card field changes what a card prints, which the order lists as a non-goal. It also repeats information the card already carries: the References line prints `WO-049: superseded (…) by WO-049` for every successor.
- **Evidence:** work-orders.mjs renderIndex References line: '`${entry.by ? ` by ${entry.by}` : ""}`'. Non-goals: 'changing what a card prints'. parseWorkOrderIndex would also turn the new line into a new console cell.
- **Proposed fix:** Print the successors outside the cards, as a summary list directly under `## Superseded` (`- [WO-033] — superseded by WO-049, WO-064, …`). Keep the card fields unchanged and record the choice.
- **Disposition:** fixed: successors are a summary list under `## Superseded`, outside the cards (D003)

## F12 (minor) — design note §3 line 22; scripts/work-orders.mjs:482

- **Claim:** The README sentence 'Checks mean passing final review; release evidence and its limits are below.' becomes false once Sources and limits and the tag record move to HISTORY.md. The design adds sentences to that block but does not change this one.
- **Evidence:** renderIndex line 482: 'Checks mean passing final review; release evidence and its limits are below.' Design §3: 'The sentence block after the list gains: …' and 'No ## Sources and limits … on this page'.
- **Proposed fix:** Change the sentence to point to [the history page]\(HISTORY.md) for release evidence and its limits. Assert the README text in the two-pages fixture.
- **Disposition:** fixed: the index page says where release evidence and its limits live

## F13 (minor) — design note §11 line 74 and order Design bullet line 117 ('the Open cards in sequence order with pairs marked')

- **Claim:** The Design bullet attaches the pair marking to the Open cards, while the design marks pairs only on the sequence list rows. One existing regex anchored with `$` will also break if its order falls in a two-entry group.
- **Evidence:** test-work-orders.mjs:1341 `/^- \[ \] \[WO-030\] — prerequisite · \*\*withdrawn: superseded\*\*$/m`. Design §3: `· pair 1` appended after the status.
- **Proposed fix:** Record that the list's pair marks satisfy 'pairs marked', or add a non-card line before each pair's cards in the Open section (a plain paragraph, not a heading, so neither parser is affected). Update the anchored regexes.
- **Disposition:** fixed: D002 records that the sequence rows carry the pair marks; the anchored regexes accept the marks

## F14 (minor) — design note §7 line 50 ('a history row whose id the index already holds throws')

- **Claim:** If the duplicate check throws inside the row mapper after some history rows are already in `indexed`, the history section comes back empty while `indexed` keeps those entries. Release rows then link to targets that are not on the board, and projectBoard throws for the whole board instead of marking one section unavailable. Duplicates are realistic, because the two-page write is not atomic.
- **Evidence:** work.ts:49 `indexed.set(row.key, result)` inside the map. context.ts section() catches and returns `rows: []`. board.ts:216-217 `if (!targetSet.has(link.target)) throw new Error("board link has no recorded target")`.
- **Proposed fix:** Parse the history page, check its keys against `indexed`, and only then add any rows. Add a board test with an overlapping card that expects the section to be unavailable and the board to still render.
- **Disposition:** fixed: the history page's keys are checked against the shared map before any row enters it; an overlap fails only the history section (test added)

## F15 (minor) — packages/console/src/text-sources.ts:166; design note §7 line 49

- **Claim:** parseWorkOrderIndex refuses a page with no cards. After the split, empty pages are valid states: HISTORY.md in a fresh launchpad instance (only WO-001, active) and README.md between work orders with an empty queue. In those states the console marks the section invalid or unavailable.
- **Evidence:** text-sources.ts:166 `if (!rows.length) throw new Error("work-order index contains no rows")`. scripts/launchpad.mjs seeds only WO-001, which activation makes Active (test-launchpad.mjs:450-466).
- **Proposed fix:** Accept zero rows on a recognized generated page; context.ts already reports 'The source records no entries'. Add a case for each page.
- **Disposition:** fixed: a recognized page without cards parses to zero rows

## F16 (minor) — design note §5 line 34; scripts/work-orders.mjs:669-676

- **Claim:** README.md gets a containment refusal (a symlinked or non-regular page refuses, tested at test-work-orders.mjs:927-928), but the design does not apply it to HISTORY.md. The two pages are also written one after the other, so a leftover HISTORY.md.tmp can leave README updated and HISTORY stale.
- **Evidence:** main(): `if (existsSync(destination) && !containedRegularFile(destination, root)) throw …` for README only. Design §5 writes each page through its own `.tmp` and rename.
- **Proposed fix:** Apply the containment refusal to HISTORY.md. Before writing either page, check that neither `.tmp` exists, then write both temporaries, then rename both. Add the symlink case for HISTORY.md.
- **Disposition:** fixed: both destinations are contained and both temporaries are judged before either page is replaced; HISTORY symlink and temporary cases added

## F17 (minor) — order Known issues lines 281-283 vs design note §9 line 64

- **Claim:** The order says this edit removes more from product 06 than it adds. The design's own byte accounting is a net gain of about 110 non-exempt bytes (about 150 bytes of sentence, minus 40 bytes of heading suffixes). The order's claim is unsupported and is not corrected.
- **Evidence:** Design §9: 'the roadmap gains ~150 bytes of sentence and loses 40 bytes of heading suffixes'.
- **Proposed fix:** Measure the non-exempt bytes before and after with docs-check and record the correction in decisions. The ceiling is advisory, so the gain needs no other action.
- **Disposition:** fixed: D006 corrects the order's byte claim with measured values

## F18 (minor) — design note §1 line 7; docs/work-orders/WO-113-work-order-files-stable-contracts.md:225-230

- **Claim:** Queued WO-113 plans to move each `**Umbrella record (...)**` paragraph out of the six order files into their evidence READMEs, leaving 'a dateless pointer'. WO-190's class needs the label in the leading header. Unless that pointer keeps the `**Umbrella record:**` label, WO-113 would silently de-class all six. They would then fail coverage, and activation would stop refusing them.
- **Evidence:** WO-113 step 5: 'move each `**Umbrella record (...)**` paragraph … byte for byte; … leave a dateless pointer'. Design label regex `^\*\*Umbrella record( \(\d{4}-\d{2}-\d{2}\))?:\*\*` is limited to the leading header.
- **Proposed fix:** Record a reopening condition and a follow-up: WO-113's pointer must keep the undated `**Umbrella record:**` label in the leading header, which the regex already accepts. Name the dependency in decisions so the planner can amend WO-113.
- **Disposition:** recorded: D003's follow-up FUP-1a12e83d22825ee3: WO-113's pointer must keep the label and typed entries in the leading header

## F19 (minor) — scripts/launchpad.mjs:566; scripts/lib/planning-conditions.mjs:375; scripts/worktree.mjs:456-469

- **Claim:** Three single-page assumptions remain outside the design. The kit-seeded docs/README.md says 'its README is the index', although the instance will also get HISTORY.md. The 'order-index' planning condition times renderIndex only. `worktree start`, the activation route that `commandFor("activate")` advertises, creates the worktree and branch before the umbrella refusal fires.
- **Evidence:** launchpad.mjs:566 seed text. planning-conditions.mjs:375 `renderIndex(readIndex(process.cwd()))`. worktree.mjs:456 `worktree add` precedes the activate spawn at :457-469. WO-075 (the pair) edits launchpad.mjs, and WO-072 owns worktree.mjs.
- **Proposed fix:** Do not edit launchpad.mjs or worktree.mjs, because of the pair and lane conflicts. Record dated follow-ups for both. Include renderHistory in the order-index condition, or record that the measurement changed.
- **Disposition:** fixed: planning-conditions' order-index timer renders both pages; the launchpad seed text and `worktree start` are D007's follow-up FUP-bd3e66761dc301ed, owned by the pair's and WO-072's lanes

## F20 (minor) — design note §12 line 81; order criterion 10 lines 252-253

- **Claim:** The handoff sequence has no `git diff --check` step and no evidence for 'no new dependency', so a verifier who reads only evidence cannot judge criterion 10.
- **Evidence:** Design §12 order: 'implement -> prepare -> format -> test:docs -> npm test -- --review -> handoff.md -> self-review -> implementation-ready'.
- **Proposed fix:** Add `git diff --check` and `git diff --stat e3b38663 -- package.json package-lock.json` (empty) before handoff, and cite both outputs on the criterion 10 line.
- **Disposition:** fixed: the handoff cites `git diff --check` and the dependency-surface diff on criterion 10

## F21 (minor) — design note §9 line 62 and §11 line 74 (criteria 3 and 7 test coverage)

- **Claim:** The planned tests leave parts of criteria 3 and 7 unchecked. For criterion 7 there is no assertion that the intro links ../work-orders/README.md, and the 'no umbrella in pending headings' check only looks at 'Application version pending' headings. For criterion 3 the two-pages fixture names no mutation set, and no test covers the meta.mjs or worktree-integration.mjs changes.
- **Evidence:** Design §9 test list; §11 'proving criteria 1, 2, 3, 4 (index side) and 5' with no cases listed for criterion 3.
- **Proposed fix:** For criterion 7, assert the intro link, and check every pending heading against the ids umbrellaRecord() classes as umbrellas. For criterion 3, mutate a header, a control state and the sequence so each page goes stale in turn, change a tag object in HISTORY's snapshot, and assert each message names the stale page. Add one integration case where a HISTORY.md conflict is resolved by regeneration.
- **Disposition:** fixed: the fixture turns a header, a control event, a sequence edit and each page's bytes stale in turn with the page named; the intro link is asserted; every pending heading is checked

Summary as returned: The design gets the core right: the umbrella class from typed entries, the activation refusal placed before readDependencies, the two-page fold that keeps the runtime contract, and a position-free move of the release-history block. As written, though, a verifier would judge criteria 4, 7, 8 and 9 incompletely evidenced or unmet, because there is no 08845c71 run, no rung-body proof, no link audit, and product 07:1202 is missed. It would also break the console's last-card title and three existing tests (test-concurrent-control, test-derived-orders:435, test-work-orders:1408). The highest-value changes are four: fix parseWorkOrderIndex's link-definition capture; record the activation run against 08845c71's sources; replace the permanent exact-JSON roadmap test with invariants plus a rung-body comparison against e3b38663; and add the missed tests and write-backs to the plan.

---

# WO-190 design refutation: runtime lens

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back, unknown), given the order and the executor's design note, read-only, on 2026-10-09 before any implementation. Findings as returned, each with the executor's disposition in the implemented design. Counts: 17 found; 15 fixed; 2 recorded. A link a worker quoted is shown with its parenthesis escaped so it reads as text.

## F1 (major) — packages/console/src/text-sources.ts:156-160 with design note §3 (README layout) and §7 (fixture split)

- **Claim:** The planned README ends with the last Open card followed directly by the link definitions. The console's parseWorkOrderIndex therefore overwrites that card's title with the last link-definition line. Because the regenerated fixtures would record the wrong title, every test would still pass.
- **Evidence:** parseWorkOrderIndex keeps reading lines into a card until it sees a heading: `while (i + 1 < lines.length && !/^#{1,3} /u.test(lines[i + 1]!))`. Any line starting with `[WO-` overwrites the card's title: `if (line.startsWith("[WO-")) values["title"] = plainText(line);`. At base, the `## Closed`…`## Sources and limits` headings closed every card before the definitions; design §3 renders 'Active, Open only' followed by 'Link definitions `[WO-NNN]: file` for EVERY row'. I ran the built parser (packages/console/dist/src/text-sources.js) on a README whose definitions follow the Open cards: the title came back as "[WO-199]: WO-199-the-vertical.md". With a `## ` heading before the definitions it came back as "WO-073 — Repository class". The README half of the hand-split fixture (§7: 'title..Open cards (plus its link definitions)') has the same shape, so `console-fixtures.mjs --write` would record the wrong title.
- **Proposed fix:** Pick one: (a) place the link definitions before `## Active` on README.md (after the sentence block); or (b) make parseWorkOrderIndex take the title only from the first `[WO-` line of a card and end a card at a `^\[WO-\d{3}\]: ` definition line. A trailing `## …` section would also end the console card, but runtimeOrdersFromIndex keeps `current` open under unknown `##` headings, so such a trailer must hold no `- Field: value` bullets. Add a test that the last Open card's title equals its authority H1, over the repository README and the fixture.
- **Disposition:** fixed: as the criteria lens's F1

## F2 (major) — scripts/test-resume.sh:1005-1006; scripts/test-derived-orders.mjs:435; scripts/test-work-orders.mjs:1341, 1343, 1352, 1407-1411 (design note §11)

- **Claim:** Section 11's list of tests to adjust leaves out tests that break under the design: the Closed, Historical and Sources text leaves renderIndex output, Withdrawn becomes its own section, and the pair mark changes sequence-row endings.
- **Evidence:** test-resume.sh:1005 calls `renderIndex({ rows: [{ …, phase: "closed", section: "Closed", … }], sequence: [], releases: [] })` and :1006 asserts `/Latest attestation: harness human;.*account claude-2/`. Under §3 renderIndex no longer prints Closed cards, and the call passes no `groups` for the pair mark. test-derived-orders.mjs:435 `assert.equal(readIndex(root, []).rows[0].section, "Closed")` covers a withdrawn derived order, which §2 moves to 'Withdrawn'. In test-work-orders.mjs withdrawn-index, :1341 is `$`-anchored: `/^- \[ \] \[WO-030\] — prerequisite · \*\*withdrawn: superseded\*\*$/m`. Its sequence is a single two-entry group, so §3 appends ` · pair 1` and the match fails. :1343 `rendered.split("## Closed\n")[1].split(...)` throws a TypeError, and :1352 `/never counts as a pass/` looks for renderSources text that moves to HISTORY. typed-index :1410 `rendered.split(`## ${section}\n`)[1].split(/\n## /)[0]` for Closed and Historical also throws a TypeError on README-only output.
- **Proposed fix:** Add these to the §11 inventory. Move the Closed, Withdrawn and Historical assertions to renderHistory output. In test-resume.sh render the closed row through renderHistory (or put the attestation assertion on an Active row). Make renderIndex default `groups` to `[]` (or derive them from `sequence`). Expect section 'Withdrawn' in test-derived-orders. Accept the ` · pair N` suffix in the withdrawn-index row regex.
- **Disposition:** fixed: test-resume.sh renders the closed row through renderHistory; test-derived-orders expects Withdrawn; the anchored and section-splitting assertions were moved or widened; renderIndex defaults groups to []

## F3 (major) — scripts/test-plan-refutation.mjs:181 and :3725-3752 (design note §11 'historical-topology')

- **Claim:** The planned fix for the frozen 45765940 fixture is incomplete. The fixture repository also holds makeRepo's WO-901 and WO-902 drafts, which are not in the frozen sequence, so the coverage refusal still fires at line 3752.
- **Evidence:** makeRepo writes `for (const id of ["WO-901", "WO-902"]) write(repo, orderPath(id), order(id));` (:181). The case then overwrites PLAN_MAP with the frozen `corrected` sequence and copies in only the frozen WO files. `git ls-tree -r --name-only 45765940 docs/work-orders/ | grep WO-90` is empty, and the frozen sequence has no WO-90x. I computed it in memory with parseDependencies, readControl at that revision and the umbrella rule. The open non-umbrella orders outside the frozen sequence are WO-014, WO-102, WO-103, WO-105 and WO-107; the six umbrellas carry both the label and typed entries. WO-901 and WO-902 add two more. `assert.doesNotThrow(() => workOrders(["index", "--check"], repo))` (:3752) would throw 'open orders absent from the proposed sequence: …WO-901, WO-902'.
- **Proposed fix:** Append all seven ids (WO-014, WO-102, WO-103, WO-105, WO-107, WO-901, WO-902) as a final group of the written copy, leaving the `corrected` variable that the 24/36-entry assertions inspect unchanged. My check found no blocking edge from a sequenced order to any of them, so topology still passes. Alternatively, remove the two fixture files in this case. Keep the `prior` case asserting the topology message first.
- **Disposition:** fixed: the frozen fixture's sequence copy appends WO-014, WO-102, WO-103, WO-105, WO-107, WO-901 and WO-902 as a final group (D004)

## F4 (major) — design note §9 (roadmap-order.json test in scripts/test-docs-check.mjs); order 'Declined alternatives'

- **Claim:** An exact deepEqual between the live roadmap's headings and docs/evidence/WO-190/roadmap-order.json ties a document that changes often to a closed order's evidence file. The next rung rename or added rung will fail test:docs, and the planner cannot fix the test from a planning branch.
- **Evidence:** Since 2026-09-01, 15 commits changed the roadmap's heading set (looping over `git log` for 06-roadmap.md and comparing heading hashes). They include executor commits eddce52e (WO-009), fa70c9e3 (WO-010) and 10a224a9 (WO-011), which renamed rungs on shipping, and planning commits e3bed98e, a2c20eac and d3dc5a01. CLAUDE.md says planning/ branches refuse writes outside docs/ and root Markdown, so a planner could only repair the test by editing WO-190's own evidence JSON. The order declined 'a second list to keep in step … and one more refusal for every planning pass'.
- **Proposed fix:** Judge exact equality against the roadmap at the revision that last changed the JSON (`git log -1 --format=%H -- docs/evidence/WO-190/roadmap-order.json`; use the working tree while the JSON is uncommitted or modified), so the criterion-7 evidence stays fixed. Keep only durable rules on the live roadmap: one marker pair, the end marker as the last marker line, no 'Application version pending' heading naming WO-, and the first `##` after the H1 not a released version.
- **Disposition:** fixed: as the criteria lens's F4: durable invariants always, the exact checks only while the masked hash matches

## F5 (major) — docs/product/07-execution-guide.md:1200-1203 (§Operator-opened planning pass); design note §10

- **Claim:** The product 07 write-back skips a sentence that names the generated index's Closed section. After the split that section is on HISTORY.md, so criterion 9 ('product 07's sentences on the generated index name both pages') would be judged unmet.
- **Evidence:** 07:1201-1202: 'the sequence revision, from which closed entries leave at each pass (the generated index's Closed section is their record)'. Design §10 edits only lines 318 and 327 (§Operator resume phrases) and the §Operator recovery controls sentence at 823 ('listed unchecked under the index's Closed section').
- **Proposed fix:** Edit 07:1202 in place to name the history page's Closed section. Then refresh locks: software-engineer-toc.md:135 links 07's H1, whose section spans the whole document.
- **Disposition:** fixed: product 07 line 1202 names the history page's Closed section

## F6 (minor) — docs/product/03-architecture.md:2368-2370; docs/PLAYBOOK.md:186-188; scripts/launchpad.mjs:566

- **Claim:** Other prose still describes a single index page and will be inaccurate after the split.
- **Evidence:** 03:2369-2370: 'the generated work-order index's Closed section is their record. A withdrawn entry (WO-158) leaves the same way and is listed there' (Withdrawn becomes its own section on HISTORY.md). PLAYBOOK:186 sends readers to README.md for 'local release evidence', which for settled orders moves to HISTORY.md. The kit seed says 'its README is the index … generates at the first lifecycle transition', but activation in a kit will also generate HISTORY.md.
- **Proposed fix:** Edit 03 and PLAYBOOK in place (03 is publication-checked, so re-run --print-locks), or record them as follow-ups in decisions.md. Leave scripts/launchpad.mjs to a follow-up unless WO-075, the pair, is confirmed not to edit it.
- **Disposition:** fixed: products 03 and PLAYBOOK edited in place; the launchpad seed text is D007's follow-up

## F7 (minor) — design note §7 (work.ts ordering); packages/console/test/board.test.ts:674-701; packages/console/src/work.ts:27-150

- **Claim:** The note gives only the releases section as the reason to compute history early. The `orders` (status) section also reads `indexed`, and an existing test depends on a history-only card being indexed before `status` is projected.
- **Evidence:** In the control fixture, WO-031 is closed (its card is under `## Closed` at workOrderIndex.md:675, so it lands in the history part of the split). The AC5 test projects the WO-031 status row and asserts `row.links.length > 0`. In work.ts the status section builds `links` from `indexed.get(order)`, and its dependencyCheck cell reads the same map.
- **Proposed fix:** State that the history section must be computed before `status`, not only before releases, and add an assertion that a closed order's status row links into the history section.
- **Disposition:** fixed: both pages are indexed before the status section; the AC5 test asserts a closed order's status row links into the history section

## F8 (minor) — packages/console/fixtures/manifest.json:40-44; packages/console/test/fixtures.ts:44-49; design note §7

- **Claim:** Splitting the recorded `workOrderIndex.md` in place changes a pinned input. The note records a sha only for the new input, and the in-place edit departs from the manifest's practice of keeping prior recorded bytes.
- **Evidence:** The manifest pins `workOrderIndex` at sha256 5a250bb7…, and loadFixture fails with 'recorded fixture input changed' on any byte change. Prior inputs are kept as separate files (feedbackUnits-wo126.json, feedbackUnits-wo132.json), and the capture text repeats 'previous source editions retain their bytes'. A hand split also produces a HISTORY input that never existed in the repository.
- **Proposed fix:** Add new inputs (for example workOrderIndex-wo190.md and workOrderHistory-wo190.md, refs README.md and HISTORY.md) and point the `control` case at both. Keep the old input or remove it with a recorded reason. Append a capture sentence describing the split, and update every sha that changes.
- **Disposition:** fixed: two new pinned inputs (workOrderIndex-wo190.md, workOrderHistory-wo190.md); the single-page snapshot keeps its bytes; the capture sentence describes the split

## F9 (minor) — scripts/work-orders.mjs:676-720; design note §5; scripts/test-work-orders.mjs:920-925

- **Claim:** Writing the two pages one at a time can leave them mismatched, and the containment check covers README only.
- **Evidence:** main() runs `containedRegularFile` for README.md only; test-work-orders.mjs:920-925 covers a README symlink but not HISTORY. Under §5 ('write each only when its bytes differ, through <path>.tmp … wx'), a planted README.md.tmp (test-harness.mjs:480-489, test-work-orders.mjs:824-836, test-worktree-integration.mjs:1653) refuses after HISTORY.md may already have been renamed into place. Those tests still pass, because README's EEXIST message is unchanged.
- **Proposed fix:** Before writing anything, validate both destinations with containedRegularFile and confirm both `.tmp` paths are absent; then write. Add fixtures for a HISTORY.md symlink and a planted HISTORY.md.tmp.
- **Disposition:** fixed: as the criteria lens's F16

## F10 (minor) — scripts/test-concurrent-control.mjs:203-209; packages/console/test/board.test.ts:1045-1056

- **Claim:** Two path lists in tests still name only README.md as the generated index.
- **Evidence:** The merge helper asserts every conflict is in `["docs/control/current.md", "docs/work-orders/README.md"]`. In my trace of the current merge order, HISTORY.md probably does not conflict, but any snapshot or Closed-card drift would fail with an opaque message. pureProjection will treat HISTORY.md as generated. The host-collection test snapshots `paths` to prove collection is read-only, and the design adds HISTORY.md as a source but not to that list.
- **Proposed fix:** Add docs/work-orders/HISTORY.md to both lists.
- **Disposition:** fixed: HISTORY.md added to the merge allowlist and the host-collection paths

## F11 (minor) — scripts/lib/planning-conditions.mjs:75-81, 375

- **Claim:** After the split, the 'order-index' planning condition measures only the README render.
- **Evidence:** `"order-index": … renderIndex(readIndex(process.cwd()))`. The method text reads 'median of three readIndex/renderIndex calls, without writing'.
- **Proposed fix:** Measure `renderIndex(i); renderHistory(i)` over one readIndex, and update the method text.
- **Disposition:** fixed: the order-index condition renders both pages and its method text says so

## F12 (minor) — docs/work-orders/WO-083-real-run-launchpad-instance.md:82; WO-096-migration-ledger.md:282-283; WO-098-rule-migration-batch-1b.md:64

- **Claim:** Three queued orders cite the two roadmap headings that step 8 renames, word for word. WO-190 cannot edit those orders without tripping the plan gate.
- **Evidence:** WO-096 names '06 §Application version pending — Harness lowering and rule migration → WO-039 + WO-040' as a write-back target, and WO-083 cites the '→ WO-033 + WO-034' heading. checkPlanGate refuses with 'existing work-order bytes changed' (test-plan-refutation.mjs:4113).
- **Proposed fix:** Record a follow-up (the planning register, or a decision with a reopening condition) so the next planning pass updates the three citations. No link check catches them, because they are prose.
- **Disposition:** recorded: D006's follow-up FUP-168dc7b8d999574b: the next planning pass updates WO-083, WO-096 and WO-098's citations of the renamed headings

## F13 (minor) — design note §3-§4 ('Link definitions … for EVERY row (both pages carry all definitions)')

- **Claim:** Writing every definition on both pages adds about 200 lines to README, puts definitions HISTORY never uses on HISTORY, and changes HISTORY.md whenever any order file is added. That widens planning churn and the integration conflict surface.
- **Evidence:** HISTORY cards use inline links (`link(row.title, …)`, `Authority: …`), so they need no reference definitions. README needs definitions only for the Now line and the sequence rows.
- **Proposed fix:** Give each page only the definitions its own reference links use. 'Link definitions resolve from either page' still holds.
- **Disposition:** fixed: each page defines only the references it uses (D002)

## F14 (minor) — design note §9 (block moved to the end of ## Release boundary); docs/product/10-ir-compatibility.md:63; 06-roadmap.md:23

- **Claim:** Moving the generated block from after the section's first paragraph to the end of the section is a reorder the criteria do not require.
- **Evidence:** 06:23 says 'the table below is generated from them', and 10:63 links 'generated release history' to `06-roadmap.md#release-boundary`. Both historyBlock and productContent find the block wherever it sits, so either placement passes the registered-block rule and criterion 7.
- **Proposed fix:** Move `## Release boundary` whole to after the closed rungs, keeping the block immediately after its first paragraph. Assert the marker pair is inside that last section, not that the end marker is the file's last marker line.
- **Disposition:** recorded: D006 adopts the block at the end of the section, as the order's design, step 8 and criterion 7 say, with the bounded measurement of both arms

## F15 (minor) — design note §7 (parseWorkOrderIndex accepts either title)

- **Claim:** With one parser accepting both titles for both sections, a source pointed at the wrong page parses without error.
- **Evidence:** §7: 'accepts a first line of `# Work orders` OR `# Work-order history`'. work.ts passes each section its own source and default ref.
- **Proposed fix:** Pass the expected title per section, for example `parseWorkOrderIndex(text, "# Work orders")` and `parseWorkOrderIndex(text, "# Work-order history")`, and refuse a mismatch.
- **Disposition:** fixed: each section passes its page title; a mismatch is refused naming the expected title

## F16 (minor) — design note §5 checkSequenceCoverage exemptions; order Design bullet 'Every open order has a position'; criterion 1

- **Claim:** Exempting Active rows and derived drafts goes beyond the order's literal wording. A derived draft also lands on README as an unsequenced card, a class criterion 1 does not foresee.
- **Evidence:** The Design bullet refuses 'an order that is neither settled nor an umbrella record'. Criterion 1 lists README cards as 'one card per active or sequenced order'. Fixtures rely on the Active exemption: test-process-debt.mjs WO-999 is active with an empty sequence and checked at :2993, test-derived-orders.mjs:157 checks an active WO-900, and test-portfolio.mjs:430 checks active derived orders.
- **Proposed fix:** Record both exemptions as decisions with evidence and reopening conditions (07 §Derived work and intent: intent filing must not fail the document gate). Add a two-pages fixture row for a derived draft showing where it is printed.
- **Disposition:** fixed: D004 records both exemptions; fixtures cover an unsequenced active order and a derived draft

## F17 (minor) — design note §9 (publication locks)

- **Claim:** The note says only the edited 07 §Operator resume phrases changes a lock. The evidence shows the lock covers the whole of 07.
- **Evidence:** software-engineer-toc.md:135 links `07-execution-guide.md#execution-guide--for-any-model-session-working-in-this-repo` (the H1). In check-publication.mjs:229-237 an H1 section runs to the end of the document. base-outline.md:33 links 06's H1 but has no Source lock.
- **Proposed fix:** Correct the note: any edit to 07 changes the software-engineer-toc lock. 06's reorder leaves the everyday-ai-user-toc lock unchanged only if the v0.2.2 section, including its trailing `<!-- prettier-ignore -->` line, moves intact. Refresh with --print-locks after all 07 edits.
- **Disposition:** fixed: both edition locks refreshed after every edit of products 03, 07 and 13 and the roadmap

Summary as returned: The design mostly holds up against its runtime readers. Its main gaps are four. The planned README layout makes the console's parseWorkOrderIndex give the last Open card a link-definition line as its title. Several existing tests break outside the §11 inventory (test-resume.sh:1005, test-derived-orders.mjs:435, the typed-index and withdrawn-index tests, and the historical-topology fixture's WO-901/WO-902). The exact-heading roadmap test would fail on the next rung rename. One product 07 sentence about the index's Closed section (line 1202) is missing from the criterion-9 write-back.
