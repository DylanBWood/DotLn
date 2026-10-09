# WO-190 self-review: Improver of design, simplicity and maintainability

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back, unknown), given only the order and the executor's change set, read-only, on 2026-10-09 before `implementation-ready`. Findings as returned, each with the executor's disposition. Counts: 17 found; 17 fixed; 0 recorded. A link a worker quoted is shown with its parenthesis escaped so it reads as text.

## F1 (major) — docs/evidence/WO-190/decisions.md:184 (WO-190-D006 observation), :188 (evidence, ceiling bullet), :210 (effect.summary)

- **Claim:** WO-190-D006 gives several roadmap offsets in bytes, but they are UTF-16 code-unit offsets from String.indexOf. Its base figure therefore contradicts the order's own byte measurement. The same decision also credits 181 bytes to the added sentence, but 181 is the net change; the sentence alone is 221 bytes.
- **Evidence:** D006 says "the first pending rung starts after 1,468 bytes in either arm (63,798 at the base) and the first closed rung after 17,375", and its effect summary repeats "after 1,468 bytes instead of 63,798". I measured both files with node over the working tree and `git show e3b38663:docs/product/06-roadmap.md`. Base: characters to the first pending rung 63798, bytes 63915. The order's Observed gap also says "after 63,915 bytes". Current: characters 1468, bytes 1474. First closed rung: characters 17375, bytes 17436. The 244 and 38,828 figures are correct in both units because that text is ASCII-only. On the ceiling: "it adds 181 non-exempt bytes (the sentence) and removes the two 20-byte suffixes". The sentence plus its blank line is 221 bytes, each suffix is 20 bytes, and the file total went from 79,891 to 80,072 bytes. So 181 = 221 − 40 is the net change, not the sentence.
- **Proposed fix:** Restate the measurements in bytes: 1,474 (base 63,915) and 17,436. Alternatively keep the current numbers and label them characters. Reword the ceiling bullet to: "the sentence adds 221 bytes and the two suffixes remove 40, a net +181 non-exempt bytes (41,309 → 41,490)".
- **Disposition:** fixed: D006 restated in bytes with the sentence (221), the suffixes (40) and the net (+181) separated

## F2 (minor) — scripts/test-docs-check.mjs:215-222

- **Claim:** When the exact-order check retires, it prints a console line and returns, so node:test still reports a full pass. A gate summary cannot tell a retired exact check from a judged one. This matters for criterion 7, which the order says is judged on the committed JSON.
- **Evidence:** The code is `if (hash !== record.sha256WithoutReleaseHistory) { console.log(`WO-190 roadmap-order.json records an earlier revision ...`); return; }`. Running `node --test --test-name-pattern='WO-190' scripts/test-docs-check.mjs` gives `ℹ pass 1 … ℹ skipped 0` today, and the retired path reports the same counts. Retirement is likely soon: `git log --since=2026-09-01 e3b38663 -- docs/product/06-roadmap.md` lists 128 commits, and 15 of them changed the heading set. Final review runs after `worktree integrate`. If main has touched the roadmap by then, the exact order is silently not judged at that gate.
- **Proposed fix:** Split the test in two. Keep the durable invariants as they are. Make the exact-order and body check its own test that takes `t` and calls `t.skip(`retired: ${document} no longer hashes to roadmap-order.json`)` instead of `console.log` plus `return`. TAP and the gate summary then show a skip, not a pass.
- **Disposition:** fixed: the exact checks are a subtest that skips visibly on retirement

## F3 (minor) — scripts/test-work-orders.mjs:311-321

- **Claim:** The expected value of the README card-order assertion is a ternary whose condition is always true. The sort and filter chain is dead code that hides a simple literal.
- **Evidence:** The expected value is `["WO-034", ...openDrafts.map(([id]) => id).filter((id) => id !== "WO-035")].sort(...).filter((id) => id !== "WO-035").length ? ["WO-034", "WO-035", ...openDrafts.map(([id]) => id)] : []`. The condition array always has 6 elements, so the expected value is always `["WO-034","WO-035","WO-036",…,"WO-040"]`.
- **Proposed fix:** Replace it with `assert.deepEqual(cardIds(first), ["WO-034", "WO-035", ...openDrafts.map(([id]) => id)], "Active card, then Open cards in sequence order");`.
- **Disposition:** fixed: literal expected array with a comment naming the two-pages fixture as the ordering proof

## F4 (minor) — scripts/test-work-orders.mjs:1551-1555

- **Claim:** The WO-907 umbrella fixture builds a third dependency entry and then filters it out by index, which is dead fixture code.
- **Evidence:** The code is `[dependency("WO-902", "superseded", { by: "WO-902" }), dependency("WO-903", "superseded", { by: "WO-903" }), dependency("WO-902", "reference-only"),].filter((entry, index) => index !== 2)`.
- **Proposed fix:** Pass the two superseded entries directly and drop the reference-only entry and the `.filter`.
- **Disposition:** fixed: the two superseded entries are passed directly through an umbrellaHeader helper shared with WO-910

## F5 (minor) — scripts/test-docs-check.mjs:163-182; docs/evidence/WO-190/roadmap-order.json:6 (note); test title at :131

- **Claim:** The test first asserts that no pending heading matches `/WO-\d{3}/`. That makes the per-umbrella `line.includes(id)` loop unreachable. The repository-wide readdirSync plus umbrellaRecord scan only feeds that loop and the `umbrellas.length >= 1` sanity check. The test title and the JSON note also describe the weaker invariant ("no umbrella record"), while D006 and the code enforce the stronger one ("no order").
- **Evidence:** Line 176 is `assert.doesNotMatch(line, /WO-\d{3}/, ...)`, followed at line 179 by `for (const id of umbrellas) assert.ok(!line.includes(id), ...)`. The JSON note says "no umbrella record in a pending heading". D006 says "no pending heading names an order or an umbrella record".
- **Proposed fix:** Remove the umbrella scan (lines 163-174 and 179-182) and the `umbrellaRecord` import. Retitle the test and update the JSON note to "no pending rung heading names an order". If the narrower criterion-7 reading is wanted instead, keep the umbrella loop and drop the general regex. Do not keep both.
- **Disposition:** fixed: the umbrella scan and its import are gone; the general rule (no pending heading names an order) stays, and the test title and roadmap-order.json note say so

## F6 (minor) — scripts/test-docs-check.mjs:144

- **Claim:** A durable-invariant assertion depends on where prettier happens to wrap the intro sentence, so a reflow alone would fail the docs gate.
- **Evidence:** The assertion is `assert.match(intro, /listed once, in the order they are planned to\nrun/);`. The test is meant to stay durable after the exact checks retire, and planning passes edit this file.
- **Proposed fix:** Use `/listed once, in the order they are planned to\s+run/`, or drop the prose match and keep only the link assertion on line 143.
- **Disposition:** fixed: the intro assertion matches across a reflow (`\s+`)

## F7 (minor) — packages/console/test/board.test.ts:896 and :843

- **Claim:** Two assertions use unexplained numbers. One bound is loose enough to hide a missing release row. The other pins the panel count of the whole board, so an unrelated new panel would break this WO-190 test.
- **Evidence:** Line 896 is `assert.ok(Object.keys(before).length >= recorded.size - 1);`. Running `node scripts/release.mjs list` and comparing it with the base page's `dotln-work-order-tags` record gives: recorded 148, every recorded tag listed, so `before` has exactly 148 keys and the `- 1` slack has no use. Line 843 is `assert.equal(overlapping.panels.length, 5);`.
- **Proposed fix:** Use `assert.equal(Object.keys(before).length, recorded.size)`. Replace the panel count with `assert.equal(overlapping.panels.length, projectBoard(control).panels.length)` so the test only claims that the overlap does not drop a panel.
- **Disposition:** fixed: the release-row count equals the recorded tag count, and the panel count is compared with the control board's

## F8 (minor) — scripts/test-work-orders.mjs:~496-506 ("a new release tag preserves the recorded check…") and :543-559 ("missing or changed recorded tag objects refuse without rewriting the index")

- **Claim:** These tag-record tests still compare only README.md, but the tag record now lives on HISTORY.md. "Without rewriting the index" is no longer checked on the page that holds the record. The `notEqual` after `index` passes only because WO-040's open card changes disposition, not because the tag observation was refreshed.
- **Evidence:** Both tests take `const original = readFileSync(indexFile, "utf8")`, where indexFile is docs/work-orders/README.md, and compare only that file. readTagSnapshot now reads `actual.history` (scripts/work-orders.mjs:842), and README no longer contains `dotln-work-order-tags` (asserted at :298).
- **Proposed fix:** In both tests also capture `historyFile`. Assert it is unchanged after each `--check`. After `index`, assert it now contains the new tag (for example `/Local annotated release tags used: .*`v2\.0\.0`/`).
- **Disposition:** fixed: both tag-record tests snapshot HISTORY.md, assert it unchanged after `--check`, and assert the refreshed tag list appears there after `index`

## F9 (minor) — scripts/work-orders.mjs:865-895 (main, write branch)

- **Claim:** If the second temporary write fails (ENOSPC, EACCES, or an EEXIST race), the first temporary, written by this same run, is left behind. The next run then refuses with "inspect the interrupted index write", even though nothing was interrupted. The refusal message is also written out twice.
- **Evidence:** The pre-check loop throws `work-order index temporary already exists: ${page.temporary}; inspect the interrupted index write before retrying`. The write loop repeats the same string in its EEXIST catch. No catch removes temporaries this run has already created before rethrowing.
- **Proposed fix:** Track the temporaries this run created. On any error in the write loop, unlink them before rethrowing: `const created = []; try { for (const page of writes) { writeFileSync(page.temporary, page.expected, { flag: "wx" }); created.push(page.temporary); } } catch (error) { for (const path of created) rmSync(path, { force: true }); throw error.code === "EEXIST" ? temporaryExists(page) : error; }`. Build the message in one helper, `temporaryExists`.
- **Disposition:** fixed: one temporaryExists helper; temporaries this run created are removed before an error is rethrown

## F10 (minor) — scripts/resume.mjs:1300-1312 and 1316-1319

- **Claim:** The new umbrella check reads the authority file, and a few lines later the allocation branch reads the same file again via the same `workOrderAuthorityPath` call.
- **Evidence:** `const umbrella = umbrellaRecord(readFileSync(workOrderAuthorityPath(repoRoot, workOrderId, workOrderPath), "utf8"), …)` is followed by `if (state.allocation) { … const source = readFileSync(workOrderAuthorityPath(repoRoot, workOrderId, workOrderPath), "utf8");`.
- **Proposed fix:** Read once after `workOrderDeclaration`: `const source = readFileSync(workOrderAuthorityPath(repoRoot, workOrderId, workOrderPath), "utf8");`. Pass `source` to umbrellaRecord, and reuse it in the allocation branch instead of re-reading.
- **Disposition:** fixed: the authority is read once after workOrderDeclaration and reused by the allocation branch

## F11 (minor) — scripts/work-orders.mjs:606 and :399-404

- **Claim:** Now that Withdrawn is its own section, two conditions are redundant. `done` re-checks `phase === "closed"` even though the Closed section now holds only closed rows. The dependency-state test lists by phase exactly the rows that the new HISTORY_SECTIONS constant already names.
- **Evidence:** `const done = row.section === "Closed" && row.phase === "closed";` was needed only while withdrawn rows sat under Closed. The dependency-state condition is `phase === "closed" || phase === "withdrawn" || historical || umbrella ? "typed; activation not applicable"`, and the section ternary just above it assigns exactly those rows to Closed, Withdrawn, Historical or Superseded.
- **Proposed fix:** Use `const done = row.section === "Closed";`. Compute `section` first and use `HISTORY_SECTIONS.includes(section)` for the not-applicable branch, so the settled classes are defined in one place.
- **Disposition:** fixed: `done` is the Closed section; the not-applicable branch is HISTORY_SECTIONS.includes(section)

## F12 (minor) — packages/console/src/work.ts:26-34, 68-85; packages/console/src/text-sources.ts:159

- **Claim:** `indexPage` takes seven positional parameters, two of them adjacent strings (`defaultRef`, `pageTitle`) that are easy to swap. The parser's title refusal does not say which title it expected, although there are now two page titles.
- **Evidence:** The calls are `indexPage(ctx, "work-order-history", "Work-order history index", sources.workOrderHistory, "docs/work-orders/HISTORY.md", INDEX_PAGE_TITLES.history, indexed)`. The parser throws `throw new Error("expected generated work-order index")` for either page.
- **Proposed fix:** Define a const table `{ index: { sectionId, title, ref, pageTitle }, history: {…} }` next to INDEX_PAGE_TITLES and call `indexPage(ctx, indexed, PAGES.history, sources.workOrderHistory)`. Throw `expected generated work-order page starting "${title}"`.
- **Disposition:** fixed: INDEX_PAGES table with sectionId, title, ref and pageTitle; indexPage takes the table row; the parser names the title it expected

## F13 (minor) — packages/console/fixtures/inputs/workOrderIndex-wo190.md:19-25 and both split inputs' definition blocks; packages/console/fixtures/manifest.json capture

- **Claim:** The control case's new two-page inputs have a shape the generator never produces. The index input keeps `## Other open work`, says "release evidence and its limits are below", and both inputs carry all 48 link definitions. A maintainer who treats these inputs as representative of the two-page output would be misled.
- **Evidence:** Section headings of the index input: Proposed order, Other open work, Active, Open. Its line 19 reads "Checks mean passing final review; release evidence and its limits are below.", but that material is on the other input. `grep -c '^\[WO-'` gives 62 lines in the index input (14 titles plus 48 definitions) and 82 in the history input (34 plus 48). D002 says each page defines only the references it uses. I confirmed the card bytes are unchanged (0 differences over 48 cards).
- **Proposed fix:** Add one sentence to the manifest capture: "a synthetic split of the 2026-09-07 page: prose, the Other open work list and all definitions are that page's, not the two-page generator's output". Better, regenerate the two inputs from a fixture repository through renderIndex and renderHistory.
- **Disposition:** fixed: the manifest capture states that the two inputs are a synthetic split of the 2026-09-07 page and that only the cards are generator output; regenerating them from a fixture repository is declined as a larger change for the same coverage

## F14 (minor) — docs/PLAYBOOK.md:186-188

- **Claim:** The rewritten sentence attaches the evidence list ("header, control, typed dependency, and local release evidence") to the history page only. That suggests dependency and control evidence for the work ahead is on HISTORY.md, but the Active and Open cards on README.md carry it.
- **Evidence:** The sentence reads: "Consult the [generated index]\(work-orders/README.md) for the work ahead and its [history page]\(work-orders/HISTORY.md) for settled orders: header, control, typed dependency, and local release evidence; use the …"
- **Proposed fix:** Reword to: "Consult the generated index for header, control, typed dependency and local release evidence: [README.md]\(work-orders/README.md) for the work ahead and its [history page]\(work-orders/HISTORY.md) for settled orders; use the …".
- **Disposition:** fixed: PLAYBOOK sentence reworded as proposed

## F15 (minor) — scripts/work-orders.mjs:222

- **Claim:** The coverage refusal presents "mark it an umbrella record" as a general second remedy. A planner fixing a red gate could mislabel an ordinary draft to silence it, and the refusal would offer no warning.
- **Evidence:** The message is: "open orders absent from the proposed sequence: …; add each to the marked sequence, or mark it an umbrella record (the **Umbrella record:** label in its leading header plus typed superseded entries); a derived draft carries its allocation instead".
- **Proposed fix:** Change it to: "…; add each to the marked sequence of docs/planning/sequence.md (an order superseded whole instead takes the **Umbrella record:** label plus typed superseded entries)".
- **Disposition:** fixed: the refusal names the sequence file as the remedy and describes the umbrella class as what an order superseded whole takes, not as a way to silence the check

## F16 (minor) — docs/evidence/WO-190/decisions.md:42 (WO-190-D002 goalAlignment.noOp)

- **Claim:** The no-op cost combines figures from two different earlier dates (2026-10-07 and 2026-10-02) and presents them undated in a 2026-10-09 decision. Neither figure matches the base this order measured.
- **Evidence:** noOp says "a reader passes 87,643 bytes before the first closed card and 309,934 bytes of closed cards". 87,643 is the 2026-10-07 carry-in figure; 309,934 is the 2026-10-02 figure. Measured with node on `git show e3b38663:docs/work-orders/README.md`: 88,550 bytes before `## Closed` and a Closed section of 345,410 bytes. The same decision's own base figure, 780,937 bytes, does match the base.
- **Proposed fix:** Use the base measurements: "88,550 bytes before the first closed card and 345,410 bytes of closed cards at e3b38663".
- **Disposition:** fixed: D002's no-op uses the base page's own measurements: 88,550 bytes before the first closed card and a 345,410-byte Closed section

## F17 (minor) — scripts/test-work-orders.mjs:1719-1734 and 1753

- **Claim:** The `stale` helper restores only some inputs: the two pages, the sequence, the log and WO-905. A mutation of any other file must be undone by hand afterwards. A later case that mutates a different authority and forgets that step would leave the fixture stale for every following case.
- **Evidence:** After `stale(() => write(target, authorityPath("WO-904"), …), /README\.md is stale/)`, line 1753 has to restore manually: `write(target, authorityPath("WO-904"), header("WO-904", "unassigned"));`.
- **Proposed fix:** Give the helper the path being mutated, `stale(path, mutate, pattern)`, and have it snapshot and restore that path along with the two pages. Then delete the manual restore at line 1753.
- **Disposition:** fixed: stale(path, mutate, pattern) snapshots and restores the mutated path with both pages; the manual restore is gone

Summary as returned: The two-page split, the umbrella class, the coverage refusal and the console's second source mostly hold up. `index --check` passes on the repository, the roadmap test passes with its exact checks active, the fixture split keeps every card's bytes, and the umbrella counts and page sizes in the decisions match the files. The one major finding is that D006 reports character offsets as bytes, contradicting the order's 63,915-byte base. The rest are minor: a self-retiring check that passes silently, dead code and loose numbers in the tests, a few redundancies in the write path and the activation step, and some wording on the remedy and in PLAYBOOK.
