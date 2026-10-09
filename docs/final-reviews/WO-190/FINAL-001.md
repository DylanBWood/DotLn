# WO-190 FINAL-001 — final review

**Verdict:** pass. `npm run work-orders -- index` now writes two pages from one fold: `docs/work-orders/README.md` opens on the active line, the proposed sequence with its lane pairs and the Active and Open cards in sequence order, and `docs/work-orders/HISTORY.md` holds every settled card with the sources and limits and the release-tag record; an umbrella record is a header class the index lists under Superseded and `resume activate` refuses by name; `index --check` judges both pages and refuses an open order with no place in the sequence; the console reads the history page as a second source; and the roadmap leads with the rungs still ahead. All ten original criteria are met at the integrated subject. This review found no new defect: the findings block is empty. The verifier's one follow-up (D011) was taken here as an adjacent repair of this order's own evidence (D013), and the four follow-ups the executor boarded (D003, D006, D007, D008) stay boarded with their reopening conditions.

**Subject:** [`docs/work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md`](../../work-orders/WO-190-index-and-roadmap-show-the-work-ahead.md) on branch `wo-190`, uncommitted over `main`. The order was executed and verified over base `e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc`; `main` had moved to `298c2c77cab9b413d43a6f758bcab1b55aae011a` (WO-188 and its v0.71.0 release) by this review, so the subject was integrated onto that base before judgment.

- Three code identities, each named with what judged it. VER-001 judged `1233ba12111f336e94645ea298a162df6c192b2db1417d37b25649cea4201201` over the original base, with the executor's passing review row. Integration, the console retime and the sixteen comment rewordings gave `4939b97a8d91e44bb8d74ddd7a860b0524313bb0f7f195e1479c7fe1996e207d`, at which the first review gate here failed one suite (process-debt: main's helper-reuse test refusing one direct Git spawn in this order's roadmap test). The swap to the library's `spawnGit` gave `152d7fec6e7cfdfe28d4991233b331ddc134b506f1f75413d41cf463675e4c0d`, the identity this review's passing row covers and the reviewed state to commit. Every code edit this review made is listed under Integration; none changes behavior.
- The order differs from `main` only in its heading's version label, `(v0.71.1)`, retimed from `(v0.70.1)` by the release preparation at integration. The ten criteria are the original text; none was waived.
- No ideation receipt exists for this order: `docs/evidence/WO-190/` holds no `ideation.md`, and the order's nomination provenance is the operator's notes of 2026-10-02 (captured in ignored intake) synthesized by the 2026-10-02 planning pass, so there is no breakout receipt or promoted document to digest.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.295), and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the fixture suite, the five WO-190 tests, the baseline activation contrast, the console fixture check and the gates.

**Process cost:** entry 92706 tokens; handoff 17152011 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage ca5a3004-8ef7-4e76-bcd4-5b42d270b223`.

- Entry was observed at 2026-10-09T15:42:52.318Z, after 2 steps and 1 command.
- Handoff was observed at 17:03:39.041Z, after 119 steps and 111 commands. It counts 16,684,955 cached input, 337,808 cache-write, 2,218 uncached input and 127,030 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Wall clock: integration and its regeneration took about four minutes; the bounded probes under a minute in all; the document gate 92.9 s and then 124.9 s; the review gates 1,493.7 s (failed) and 1,648.2 s (passed). The two review gates are most of the review's elapsed time. The first ran 87 fresh tasks because `main` changed the declared sources of nearly every machinery suite, and it was repeated because one line in a test file violated a rule `main` introduced after this order was verified.
- Tradeoff: the gate was run twice rather than the test file being edited before the first run, because the helper-reuse rule lives in a suite this order's diff does not touch and nothing short of the gate named it; the comment-label rule, by contrast, was run alone before the gate and its sixteen refusals fixed first. No two-arm cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-190/FINAL-001.md`.

Read in full: the order; VER-001 with its probe, baseline runner and transcript; the control log; `handoff.md`; D001 to D011 and the helper's draft D012; the adversary and improver dispositions as the handoff and VER-001 record them; the whole authored subject diff; product 07 §Independent workflows and integration and §Verification review and attack; product 08 §PRs and commits; WO-188 D025 and D026 (the two new rules that met this order's bytes) and its FINAL-001 integration paragraph; `scripts/lib/git.mjs` and `scripts/test-helper-reuse.mjs` for the substitution.

Reviewed: the complete subject diff against `main` after integration: the generator (`scripts/work-orders.mjs`: `parseHeader`, `checkSequenceCoverage`, `readIndex`, `renderCard`, `renderSection`, `renderIndex`, `renderHistory`, `renderSources`, `readTagSnapshot`, `checkPartition`, `main`), the umbrella helper (`scripts/lib/dependencies.mjs`), the activation refusal (`scripts/resume.mjs`), the two readers of the generated index (`scripts/lib/meta.mjs`, `scripts/lib/worktree-integration.mjs`), the planning condition, `.gitattributes`, the console (`types.ts`, `collect.ts`, `text-sources.ts`, `work.ts`, the fixture manifest and the two synthetic inputs), the five affected suites and the two package tests, the roadmap reorder (judged by a sorted-line comparison with the base and by its test), the write-backs (root README, docs README, PLAYBOOK, the planning map, products 03, 07 and 13, the status index, the console README), the evidence and this order's generated projections. The two generated pages and the regenerated console outputs were judged by their generators' checks and by independent card scans, not read line by line.

Lenses, and why:

- **Correctness and tests:** a generator split in two with a partition invariant, a new header class, a new refusal in a check that every lifecycle transition runs, and a parser that two runtime readers depend on.
- **Design and coupling:** whether the page contract the resident reads survived unchanged, and whether the second source adds a second truth to the console.
- **Operator flow:** what a reader of the index, the roadmap or the console sees first, and what an operator who activates an umbrella record is told.
- **Maintainer in six months:** the Open-ordering rule, the exemptions of the coverage check, and the roadmap test that retires itself.
- **Release surfaces:** final review is acceptance, and this one carried two version collisions.

Goal alignment:

- **Traps:**
  - Treating VER-001's pass as the verdict after `main` moved under the subject: every criterion was re-derived at the integrated tree, and the review gate ran at the integrated identity.
  - Reading the two rule refusals from `main` (comment labels, helper reuse) as findings against this order: by product 07 they are integration bookkeeping, recorded in D012 with the command and line that enforces each.
  - Writing a behavioral fix and certifying it: the only code edits here are comment text and a one-call substitution with identical arguments, each verified by the test that demanded it.
- **What I did:** integrated, retimed, reconciled, re-ran the fixtures and the gates, and judged the criteria from fresh runs; took D011's follow-up because it names the final review and is two clauses of this order's own evidence; left every other board where D010 put it.
- **NoOp:** leaving the order unreviewed keeps a 685,899-byte index as the page a reader opens for the work ahead, and keeps six umbrella records activatable.

Integration: `npm run worktree -- integrate WO-190 --intake-backup <archive>` (the archive from `npm run backup:intake` into the session scratch, 3 files) checkpointed the work (checkpoint 6), kept the named stash `704e2c4d779853df2fb4c3023cbb987b63bef902`, fetched `main` at `298c2c77` against the base `e3b38663` and fast-forwarded the uncommitted branch. One authored conflict, `packages/console/fixtures/manifest.json`: both sides appended a sentence to the manifest's capture string; resolved by keeping `main`'s string whole and appending this order's sentence after it, so neither recording is lost. `--continue` regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (retimed v0.70.1 to v0.71.1 under the recorded patch classification, because WO-188 published v0.71.0 at `main`'s head), the decisions index, the follow-up register, meta, the work-order index and the publication locks, and the selected console fixtures. Three further reconciliations, each bookkeeping by product 07's list and none a finding: `npm run release -- check-surfaces --local` refused the console at 0.4.1 because v0.71.0 had consumed that version and this order's console source differs from it, so D009's bump is retimed to 0.4.2 with its declared compatibility impact unchanged; `main`'s comment-labels row (WO-188 D025) refused sixteen comment lines in nine of this order's files that led with an order identifier, and each now leads with its explanation and carries the identifier after it, comment text only in files no edition registers; and `main`'s helper-reuse test (in the process-debt suite) refused the direct `spawnSync("git", …)` in this order's roadmap test, which now calls `spawnGit` from `scripts/lib/git.mjs` with the same arguments and options. [D012](../../evidence/WO-190/decisions.md#wo-190-d012--integration-at-final-review-main-moved-by-wo-188-the-release-target-the-console-version-sixteen-comments-and-one-git-spawn-reconciled) records both bases, the resolution, the retimes, the carried-forward claims and the affected checks, all of which pass. `main` did not change the roadmap, the sequence or this order's evidence; its edits to the four shared sources are comment rewordings, and its additions to the shared suites merged beside this order's without conflict.

## Earlier findings

- **Adversary (10 found; 9 fixed; 1 recorded) and improver (17 found; 17 fixed):** every disposition in the handoff was read, and the consequential ones hold at the integrated tree: the console component bump (adversary F1, D009; retimed here), the baseline refusal contrast (replayed here: accepted at `08845c71`, refused without a control segment now), the HISTORY-prefixed tag refusal, the visible retirement of the exact roadmap check, recorded control state winning over the umbrella header (the fixture's WO-910), the empty-page parser and the release-link preservation (the console test over both pages). The one recorded item is D008's follow-up (umbrella carriers in the pending rung bodies), which criterion 7 forbids this order to edit.
- **VER-001 (pass; F1 follow-up):** D006's description of the roadmap test lagged the executor's final self-review fixes. Taken here: the two clauses are aligned in place, D013 records what was misread, what was meant and what changed, and the register row FUP-72a61540baa55755 is settled from [the request file](../../evidence/WO-190/final-001-followup-request.json). The exact subtest ran live in this review's runs (0 skipped), so the retirement path D006 now describes was not exercised; the test's own `exact.skip` branch is the evidence for it.
- **D010's twenty-five left rows** are unchanged by this review: none of their seams closed here.

## Criterion judgments

**Criterion 1:** met

- `npm run work-orders -- index` writes both pages; `index --check` passes both at the integrated tree (the `index` row of both document-gate runs, and a direct run). An independent card scan over the repository's pages finds 31 cards on `README.md` (the active WO-190 and the 30 sequenced open orders, in sequence order) and 166 on `HISTORY.md`, 197 in all, each identity once, equal to the number of authority files; the skeleton test asserts the same disjointness and that every history card sits under one of the four settled headings.
- The fixture suite (`bash scripts/test-work-orders.sh`, fresh here: 24 passed) proves the partition over a fixture with one order per class (Active, an activated umbrella, an Open pair plus a single, Closed, Withdrawn, Superseded, Historical) and that the Open cards follow the sequence rather than identifier order (WO-904, WO-902, WO-903), with ` · pair N` on both rows of each two-entry group; the repository's page shows six pairs.

**Criterion 2:** met

- `README.md` renders only `## Proposed order`, `## Active` and `## Open` and carries no `dotln-work-order-tags` record (0 occurrences; the history page has 1); the skeleton test asserts no settled phase among its items. Sizes: 780,937 bytes at the base, 78,228 at the executor's handoff and 78,393 at verification (D002), 75,841 after integration here (WO-188's close moved its card to the history page); `HISTORY.md` 709,879. Different named cutoffs, not contradictory figures.

**Criterion 3:** met

- The fresh fixture suite turns a changed closed header, open header, control event, sequence order, edited history card and edited index card into `HISTORY.md is stale at line N` or `README.md is stale at line N` as the case requires, and a missing or changed tag object into `HISTORY.md: missing or changed recorded release tag: v1.0.0`, with both pages left unchanged. `scripts/lib/meta.mjs` `sizePaths` and `scripts/lib/worktree-integration.mjs` `pureProjection` name both pages (and the integration helper regenerated both as projections during this review); `.gitattributes` marks `HISTORY.md` `dotln-generated dotln-check=suite:index`.

**Criterion 4:** met

- `HISTORY.md` lists WO-033, WO-034, WO-035, WO-036, WO-037 and WO-040 under `## Superseded`, each with a summary row naming the successors its typed entries name. The fixture asserts the row, the card, `typed; activation not applicable`, and that the same header with a recorded activation (WO-910) stays Active. `bash scripts/test-resume.sh` (in the review gate) asserts the refusal text, no stack trace, no control segment, and that a label without typed entries still activates. The verifier's baseline runner, replayed here, activates WO-900 with the scripts extracted from `08845c71` (exit 0, `WorkOrderActivated`) and is refused by this order's scripts (`activation refused: WO-900 is an umbrella record superseded by WO-901, WO-902; activate a successor instead`, exit 1, no segment).

**Criterion 5:** met

- The fixture drops WO-903 from the sequence and `index --check` refuses `docs/planning/sequence.md: open orders absent from the proposed sequence: WO-903; add each to the marked sequence …`; a label without typed entries (WO-908) is refused by name; the umbrella WO-907 and the active WO-901, absent from the sequence, pass; a derived draft passes in `scripts/test-derived-orders.mjs`. The repository passes. D004's two exemptions (active orders, derived drafts) are disclosed on both pages and in the refusal text; the Design bullet's set is honored for ordinary Open rows.

**Criterion 6:** met

- `packages/skeleton/src/runtime-status-contract.ts` is unchanged against `main` (`git diff --stat` names it nowhere). The skeleton test runs `runtimeOrdersFromIndex` over the repository's `README.md` and asserts its items equal the cards under Active and Open, none settled, disjoint from the history page's cards, and that the history page is refused as an index. The console test builds the release rows over the two real pages and over `git show e3b38663:docs/work-orders/README.md`, restricted to the 148 tags that page recorded, and asserts equal links, that the links differ without the history page, and that every base card is on exactly one page; both passed fresh here and in the gates. The parser test pins each page's title, ends a card at the link definitions, accepts an empty page, and makes an overlapping card fail only the history section. `node scripts/console-fixtures.mjs --check`: all five families match after the manifest resolution.

**Criterion 7:** met

- The introduction's third paragraph links the index as the list of orders in sequence; the first heading after it is `## Application version pending — Harness lowering and rule migration`; the two pending headings carry no carrier; the closed rungs follow and `## Release boundary` with the generated block closes the file. A sorted-line comparison of the reordered document with the base shows exactly the two renamed headings, the three lines of the added sentence and one blank line, so no rung body changed. The roadmap test's durable invariants and its exact subtest both ran and passed here (the masked hash still matches `roadmap-order.json`; `main` did not touch the file). The document gate's registered-block rule passes with 38,582 exempt bytes in the new place; 41,490 non-exempt against the 45,440 ceiling (D006 records the net +181 bytes against the order's "removes more than it adds").

**Criterion 8:** met

- The `docs-check` row is green over `docs/` and the root Markdown files in both document-gate runs and in a direct bounded run (0 failures). The retargeted citations (PLAYBOOK, the planning map's status boundaries, products 03, 07 and 13) point at the page that now holds their target; citations of the sequence and the open work keep `README.md`.

**Criterion 9:** met

- `docs/README.md` §Map names both pages; product 07 §Operator resume phrases names both pages in its two sentences on the generated index, and §Operator recovery controls and §Operator-opened planning pass name the history page's Closed section; `packages/console/README.md` §Sources and limits names the second source; the decisions file holds D001 to D013; `npm run publication:check` reports both outlines CURRENT and 254 of 254 product headings indexed at the integrated tree.

**Criterion 10:** met

- `npm test -- --review` at code identity `152d7fec…` passed 35 suites and 87 fresh tasks in 1,648.16 s (recorded 2026-10-09T17:03:18.986Z, exit 0), every task fresh because `main` changed the declared sources of the machinery suites (Executed checks below); `npm run test:docs` passes 31 of 31 at the same identity; `git diff --check` is clean. `package.json` is unchanged against `main`; `package-lock.json` differs from `main` only in the console's version line (0.4.1 to 0.4.2); no dependency is added, and no source suppression was introduced (the comment-label and helper-reuse rules were satisfied by rewording and substitution, never by baseline or exemption).

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **Two rules from `main` refused this order's bytes.** The comment-label row refused sixteen leading identifiers and the helper-reuse test refused one direct Git spawn. Both rules landed in WO-188 after this order was verified; both refusals are integration bookkeeping by product 07's list, each is fixed by the remedy the rule itself names, and the first review gate's failure is recorded in D012 with the suite and the line.
- **Two version collisions.** The application target and the console component both collided with v0.71.0. Each is retimed under its recorded classification and recorded in D012; a version collision alone is never a finding.
- **The verifier's probe fails after integration by construction.** `probe.mjs` asserts a passing `npm test` row at the current identity before its groups run, and no row existed at the integrated identities until this review's gate; its groups' claims are covered here by the fixture suite, the five WO-190 tests and the baseline runner, which were replayed. Replayed once more after the passing gate (17:04:11, bounded): all seven groups pass at `152d7fec…`, the partition group reporting 197 authority files, 31 index cards, 166 history cards, 75,841 and 709,879 bytes; the result is kept as [`final-001-probe-result.json`](../../evidence/WO-190/final-001-probe-result.json).
- **Three sizes for the index page across the records** (78,228; 78,393; 75,841): each is a named cutoff, and the criterion's claim is that settled cards and the tag record are absent, which holds at every one.
- **`HISTORY.md` is 709,879 bytes**, larger than the page the order measured, because the settled cards and the tag record moved there whole. The order's design keeps them as the readable record and declines deleting them; whether the forge renders a page of that size in full was not observed by the order and is not observed here.
- **The exemptions of `checkSequenceCoverage`** (active orders, derived drafts) widen the Design bullet's set. D004 discloses them with their reasons and reopening conditions, and the refusal text and both pages say so; the ordinary Open row the criterion names is judged.

## Implementation review

- **Correctness.** `readIndex` keeps the rows in identifier order and gives each its sequence position, so every existing reader sees what it saw; only the index page orders Open cards by position. The umbrella class needs both the label and typed entries, and recorded control state wins over it, so a header edit cannot hide a lifecycle. `main()` judges and writes both temporaries before replacing either page, removes a temporary it created on failure, and refuses a leftover one by name; `--check` reads the tag snapshot from the history page and prefixes a tag-object error with that page. `checkPartition` catches a card on both pages, on neither, or without an authority. The console's `indexPage` throws on a card the other page already holds, which the projection records as an unavailable history section rather than a second truth.
- **Design and coupling.** The resident's contract (first line, generated-by sentence, `## Active`, `## Open`, card fields) is byte-compatible: the skeleton reader is unchanged and its test passes over the real page. The console gains one source and one section; the release rows' links are proved equal to the single-page base. `checkSequenceCoverage` is kept apart from `checkSequenceTopology`, which historical planning receipts still judge, so the new refusal cannot rewrite past receipts.
- **Operator flow.** A reader of the index meets the Now line, the sequence with pairs and the open cards in order, and the history is one link away; an operator who activates an umbrella record is told which successors to activate instead; a planner who forgets to place an open order is told by `index --check` which one and what to do.
- **Maintainer in six months.** The ordering rule, the two exemptions and the umbrella class each sit beside their code with their reasons, now leading with the explanation. The one rule a maintainer must not forget is that the roadmap's exact checks retire by hash: D006 (as corrected) and the test's skip message say so.
- **Clean-room screen.** The generated pages are built from this repository's own records; the fixtures name synthetic orders; nothing in the diff names a host, gateway, vendor policy or private identifier.

## Follow-up register

`npm run plan -- followups --touching --work-order WO-190` lists 31 pending rows by textual match after this review's settlement. This review disposes one, FUP-72a61540baa55755 (D011's description follow-up, settled by D013), and leaves the rest where D010 and the earlier reviews put them:

- Four are this order's own boards (FUP-1a12e83d22825ee3 from D003, FUP-168dc7b8d999574b from D006, FUP-bd3e66761dc301ed from D007, FUP-0e82c9b04b051f66 from D008), untriaged for planning; D006's entry gained a third revision from the description alignment and keeps its key.
- FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost over closed history) stays open: `index --check` still renders and compares both pages, as D010 says.
- The remaining rows match only on product 07, product 03, the roadmap's order, `scripts/resume.mjs`, `scripts/lib/meta.mjs`, `scripts/lib/worktree-integration.mjs` or the shared suites, and this change opens none of their seams.

`npm run meta` reports one standing reopen candidate, WO-150-D003 (`coldStartBytes.executor` above 24576), which the executor and the WO-074 and WO-188 reviews also recorded. This order does not change the executor briefing.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose; its relative links resolve from its own directory, which the publish step rewrites absolute at the reviewed revision.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section patch edition for v0.71.1; `parseReleaseNotes` accepts it.

The proposed PR title is `:children_crossing: The work-order index and the roadmap lead with the work ahead; settled orders move to a history page`. Its gitmoji is `:children_crossing:`, the catalog's mark for an improvement to usability, because the change alters what a reader meets first and nothing about what is recorded. The title leads with the reader's outcome and names the one thing they must know to find what moved. The last five merged titles run 15 to 20 words; this one's 18 come from its two clauses, not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Identities: `4939b97a…` after integration and the comment rewordings, `152d7fec…` after the `spawnGit` substitution.

| Check | Window (2026-10-09, UTC) | Exit | Result |
| --- | --- | --- | --- |
| `npm run backup:intake`; `npm run worktree -- integrate WO-190 --intake-backup <archive>`; conflict resolved; `--continue` | 15:45:51–15:47:05 | 1, then 0 | checkpoint 6; stash `704e2c4d…`; one authored conflict; projections regenerated; v0.70.1 → v0.71.1 |
| `npm run release -- check-surfaces --local` before and after the console retime | 15:48, 15:49:38 | 1, then 0 | `@dotln/console … expected a different version`; then every row passes |
| `node scripts/harness.mjs check` | 15:48 | 0 | 34 generated surfaces |
| `npm run publication:check` | 15:48 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/work-orders.mjs index --check` | 15:49 | 0 | both pages current |
| `bash scripts/test-work-orders.sh` (bounded) | 15:49:40–15:50:00 | 0 | 24 passed, 0 failed |
| `node --test --test-name-pattern='WO-190'` over docs-check, the console board test and the skeleton runtime-status test (bounded) | 15:51:17 | 0 | 5 passed, 0 skipped (the exact roadmap subtest ran) |
| `node scripts/console-fixtures.mjs --check` (bounded) | 15:50:04 | 0 | five families match |
| `node docs/evidence/WO-190/verification-001/baseline.mjs` (bounded) | 15:51:18 | 0 | accepted at `08845c71`; refused without event now |
| `node scripts/docs-check.mjs` (bounded) | 15:53:29–15:53:47 | 0 | 0 failures; roadmap 41,490 non-exempt bytes |
| `node scripts/comment-labels.mjs` before and after the rewording | 15:54:29, 15:56 | 1, then 0 | 16 failures in nine files; then 0 failures, 81 baselined lines |
| `npm run meta`; follow-up settlement `--apply`; `npm run format`; `git diff --check` | 15:57–15:58 | 0 | D012 and D013 indexed; FUP-72a61540baa55755 settled; clean |
| `npm run test:docs` (identity `4939b97a…`) | 15:59:56–16:01:30 | 0 | 31 passed, 0 failed, 92.85 s, 31 fresh tasks |
| `npm test -- --review` (identity `4939b97a…`) | 16:01:39–16:26:34 | 1 | 34 passed, 1 failed (process-debt: helper-reuse, one direct Git spawn in `scripts/test-docs-check.mjs`), 1,493.67 s, 87 fresh tasks |
| `node --test scripts/test-helper-reuse.mjs`; the two WO-190 docs-check tests; `node scripts/comment-labels.mjs` (bounded) | 16:32:35–16:32:40 | 0 | 5 passed; 2 passed, 0 skipped; 0 failures |
| `npm run test:docs` (identity `152d7fec…`) | 16:33:42–16:35:48 | 0 | 31 passed, 0 failed, 124.89 s, 31 fresh tasks |
| `npm test -- --review` (identity `152d7fec…`) | 16:35:48–17:03:19 | 0 | 35 passed, 0 failed, 1,648.16 s, 87 fresh tasks |
| `node scripts/harness.mjs evidence` (mis-invoked without arguments; it starts a plain `npm test`, cut off by a pipe) | 16:27:27–16:27:35 | 0 | plain selection, composed: `format` fresh, 78 tasks reused from the failed review row at `4939b97a…`; recorded, not the review row, not consumed |
| `node docs/evidence/WO-190/verification-001/probe.mjs` (bounded), after the passing gate | 17:04:11–17:04:15 | 0 | all seven groups pass at `152d7fec…` |

After the gate figures were filled into this report, the PR body and the release notes, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes. The bounded probes' fixtures and the intake backup live in the session scratch; the fixture suites' own cleanup removed their temporary repositories.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- the manifest conflict resolution; the console version in `packages/console/package.json` and `package-lock.json`; sixteen comment lines in nine files; one call in `scripts/test-docs-check.mjs`;
- D006's two clauses, D012's completion, D013, and `final-001-followup-request.json`;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, publication-lock and console-fixture projections.

No behavior was changed by this review. Goal alignment outcome: matched. Each criterion was re-derived from a fresh run at the integrated subject; the two rule refusals and the two collisions stayed bookkeeping with their commands recorded; the one follow-up taken was the verifier's own nomination, two clauses of this order's evidence; the reviewed state is ready to commit.
