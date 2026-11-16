# WO-281 handoff

WO-281, the kit guide made easy to follow, on branch `wo-281` over `main` at
`5edc7798b`. This handoff covers the implementation, handed off at
01:16 UTC on 2026-11-16 (the dispatch began at 20:07 UTC on
2026-11-15). Main has not moved (`git ls-remote origin refs/heads/main` read
`5edc7798b9ec`, the merge base, at 00:03 UTC), so nothing was integrated.
Release target v1.1.0, a minor
([D001](decisions.md#wo-281-d001)); `@dotln/skeleton` is 0.92.0, since its
role text gained a sentence ([D013](decisions.md#wo-281-d013--the-skeleton-component-is-0920-its-role-text-gained-a-sentence)). Handoff code
identity `63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796`. The decisions are D001 to D026 in
[decisions.md](decisions.md). The branch holds no commit: it commits at
final review.

## For the operator to decide

Five things this execution could not settle from the order's text. None
blocks the handoff; each is the operator's reading.

1. **Core's own `docs/README.md` is not rewritten.** Step 3 names "the map
   `docs/README.md`" and a starter refresh that replaces it. The executor
   read that as the map every instance carries, which the export rendered in
   code and is now the template `scripts/kit/docs-map.template.md`; core's
   own page of that name gained one short paragraph and keeps two long ones
   (316 and 139 words). If the order meant core's page too, that is a second
   rewrite ([D005](decisions.md#wo-281-d005--the-map-this-order-rewrites-is-the-docsreadmemd-every-instance-carries-whose-text-the-export-renders)).
2. **What the document gate prints of the list.** `npm run test:docs` now
   prints one line with the figure and where it came from, then one
   `ADVISORY` line for each long paragraph the branch adds or changes. It
   does not print the whole list of the standing documents, which is some
   1,500 paragraphs; `node scripts/docs-check.mjs --long-paragraphs` prints
   that. Criterion 4's words can be read either way
   ([D010](decisions.md#wo-281-d010--step-4-the-document-check-lists-the-long-paragraphs-a-branch-writes-in-standing-documents-at-a-figure-of-120-words-and-prints-the-whole-list-on-request)).
3. **The update's second command block is not split.** The reviewer of
   instructions, twice, and the second reader each say a person who copies
   that block runs past the pause after `git merge`. The order keeps command
   blocks unchanged, and the commands page's text for that step counts its
   blocks, so the guide says the pause in a sentence above the block. Split,
   it is a change to the guide and to the generated commands page
   ([D025](decisions.md#wo-281-d025--round-two-of-the-review-ladder-every-blocking-finding-of-round-one-confirmed-fixed-seven-new-findings-none-of-which-blocks-the-two-added-reviewers-rechecks-and-no-third-round)).
4. **How the pages open.** The filler reviewer asks that no section open by
   saying what it holds; the order's design asks that each say first what it
   is for. Where a sentence of fact opens a section the forecast is gone;
   two sections (Owned cleanup, Document quality) keep an opening that only
   says what they cover, and the map's template now opens with its three
   pointers ([D025](decisions.md#wo-281-d025--round-two-of-the-review-ladder-every-blocking-finding-of-round-one-confirmed-fixed-seven-new-findings-none-of-which-blocks-the-two-added-reviewers-rechecks-and-no-third-round)).
5. **The guide is longer.** It went from 2,765 to 4,365 lines (27,726 to
   about 33,500 words): the same facts as subsections, steps, lists and
   tables, with no paragraph over 120 words where the base had 63. The order
   says length follows the content and shorter is better where it says the
   same.

## Criteria

**Criterion 1:** met. `node docs/evidence/WO-281/inventory.mjs`, run at 01:08 UTC after the last edit of the guide, reads the base (`5edc7798b`, 2,765 lines) and the candidate (4,365 lines, SHA-256 `2787606d…4ba7`) and prints `absent 3 (named 3, unnamed 0)`: every heading, command-block line and link target of the base is in the candidate, and the three code spans that are not (`diff WO-NNN`, `apply WO-NNN`, `draft WO-NNN --new`) are named with their reason in [D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler)'s `inventoryRemovals`, each now written as its whole command. The readings are [inventory-base.json](inventory-base.json), [inventory-candidate.json](inventory-candidate.json) and [inventory-difference.md](inventory-difference.md). The fifteen second-level headings keep their text and order, and `npm run test:docs` (01:10:52 to 01:13:38 UTC, 29 passed and 0 failed, exit 0) passes its link check, so every heading another document links resolves. Three of round one's reviewers and three of round two's recomputed the inventory independently, each at the tree it read (4,290 and 4,354 lines), and found nothing absent that a decision does not name; the 11 lines changed since are round two's wording fixes, and the run at 01:08 UTC covers them.

**Criterion 2:** met. The complete run (`npm test -- --review`, 00:10:51 to 01:06:47 UTC, 0 h 56 min, 45 passed and 0 failed, 122 fresh tasks, exit 0; `host-gate:63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796:npm test`) ran `launchpad`, `launchpad-planning`, `sync-fixtures` and `registrations` whole and each passed. `node scripts/lib/operator-commands.mjs --check` prints `docs/OPERATOR.md is current` (01:08 UTC). The case "starter refresh publishes one verified commit and preserves every refusal boundary" in `scripts/test-launchpad-update.mjs`, part of `launchpad`, refreshes a starter whose `docs/README.md` holds the first export's bytes and finds the current map, and refreshes one whose owner changed it and finds it kept, with the reason ([D012](decisions.md#wo-281-d012--step-3-the-documentation-map-is-a-kit-template-rewritten-as-a-table-of-the-roots-and-a-starter-refresh-brings-a-copy-an-older-export-wrote-to-it-and-keeps-one-its-owner-changed)). Three expected-data changes in those suites are recorded with their causes ([D008](decisions.md#wo-281-d008--expected-data-the-sentences-two-suites-pin-in-the-guide-four-kept-by-the-guides-wording-and-three-updated-to-the-rewritten-text), [D015](decisions.md#wo-281-d015--expected-data-the-refresh-of-the-v0810-fixtures-starter-now-rewrites-its-map), [D018](decisions.md#wo-281-d018--adjacent-repair-and-two-more-expected-data-changes-the-roadmaps-release-table-gains-the-row-of-v101-and-two-cases-stop-depending-on-where-the-guide-and-a-fixture-set-their-blocks)).

**Criterion 3:** met. The case "WO-281 criterion 3: the final reviewer's root, as emit installs it on each host, says once and in the rule record's words that a changed standing passage its reader cannot follow returns to repair, and product 07 states the same clause" in `scripts/test-harness.mjs` passed in the complete run's `harness-fixtures` suite. It names the clause, finds the rule once in the reviewer's root for `.claude` and for `.agents` as `harnessInstallation()` gives them, and finds the same clause in product 07 §Documentation freshness and ownership. Round one found no such case; it was added in answer ([D020](decisions.md#wo-281-d020--round-one-of-the-review-ladder-the-four-standard-reviewers-thirty-two-findings-three-of-them-blocking-each-with-who-found-it-its-class-and-what-becomes-of-it) F02, [D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler)). `node scripts/harness.mjs check` reports 37 generated surfaces.

**Criterion 4:** met, on the reading in item 2 above. `npm run test:docs` (01:10:52 to 01:13:38 UTC, 29 passed and 0 failed, exit 0) passes and prints `[docs-check] long paragraphs: over 120 words (documents.paragraphWords in docs/control/budgets.json); none among the paragraphs this branch adds or changes in standing documents`. The case "WO-281 criterion 4: …" in `scripts/test-docs-check.mjs` passed in the complete run's `docs-check-fixtures` suite: a 130-word paragraph and a 125-word list item a branch adds, and a 140-word paragraph it edits in place, are each listed by file and line; an untouched paragraph, a record, a fenced block, a table cell and an instance's kit document are not; a figure of 200, null, an unusable value and a misspelled key each exit zero; and nothing fails. The list before and after the rewrite is [long-paragraphs-base.txt](long-paragraphs-base.txt) (the guide among its rows, with a paragraph of 761 words) and [long-paragraphs-candidate.txt](long-paragraphs-candidate.txt) (no row for the guide).

**Criterion 5:** met. [reader-record.md](reader-record.md) holds, whole, a first reader's two answer sets for the ten tasks of [tasks.md](tasks.md), from the base (`docs/KIT.md` at `5edc7798b`) and from the candidate as it stood at 21:37 UTC, and a second reader's answers from the final candidate alone. The first candidate text is named by its SHA-256 only: the guide was edited before a copy was kept, which two reviewers and the third critic found. The second text is named by SHA-256 `2787606d26f649eb427762bb1b7767b657e187ecc088a573d366da5f8c624ba7` and Git blob `5e61a637f6f3b776711959d2d0326e17c12ff37c`, is the guide as it stands in this tree, has not been edited since, and is what `git show refs/dotln/checkpoint/WO-281/3:docs/KIT.md` prints, the checkpoint the completion made ([D014](decisions.md#wo-281-d014--step-6-the-reader-answered-nine-of-the-ten-tasks-more-easily-from-the-rewritten-guide-and-one-about-as-easily-and-its-report-changed-seven-things-in-the-guide), [D016](decisions.md#wo-281-d016--correction-three-records-stated-more-than-their-evidence-held-how-the-reader-read-how-many-order-files-the-lists-figure-covers-and-what-the-critic-ran-on), [D026](decisions.md#wo-281-d026--the-second-reading-of-the-candidate-one-fresh-reader-the-final-text-alone-its-bytes-kept-and-what-it-could-not-find-left-to-planning)).

**Criterion 6:** met. `npm test -- --review` passed as one complete run of this tree, the first and only one: 00:10:51 to 01:06:47 UTC, 0 h 56 min, 45 passed and 0 failed, 122 fresh tasks and none reused, exit 0 (`host-gate:63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796:npm test`). No separate plain `npm test` was run: the closeout selection the briefing prints names this run and the document gate, the run's row is recorded under the check `npm test`, and the review selection runs every suite, of which the plain one is a part (an inference from `scripts/test-runner.mjs`, where `--review` selects the complete run; the verifier's own `npm test` settles it). `npm run test:docs` passed after the last document edit (01:10:52 to 01:13:38 UTC, 29 passed and 0 failed, exit 0).

## Gates

- **The complete run.** `npm test -- --review`, started in the background at 00:10:51 UTC after both review rounds, the second reading and the last edit outside this directory; nothing was written in the worktree and no worker was started while it ran. It ended at 01:06:47 UTC: `npm test: 45 passed; 0 failed; 0 h 56 min; 122 fresh tasks`, exit 0. Its row: check `npm test`, code identity `63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796`, `origin/main` and `main` at `5edc7798b` at its start and its end. It took 56 minutes, where the last order's took 12: all 122 tasks ran fresh and none was reused. The likely cause, which was not checked, is that this change touches the gate runner and the document check.
- **The document gate.** `npm run test:docs`, run once, after the complete run and with this file written but for its lines on this gate: 01:10:52 to 01:13:38 UTC, `npm run test:docs: 29 passed; 0 failed; 0 h 3 min; 29 fresh tasks`, exit 0. It relays the document check's line on the long-paragraph list, which names nothing this branch writes. The only edits after it are in this directory: this file's lines on the gate, and the status capture.
- **Focused suites during the implementation**, 20:19 to 22:46 UTC, each with its own structural checks: sixteen finished runs of `registrations`, `launchpad`, `launchpad-planning`, `sync-fixtures`, `docs-check-fixtures`, `harness-fixtures` and `plan-refutation`, 74 minutes of gate time. They found four failures, each fixed and recorded ([D018](decisions.md#wo-281-d018--adjacent-repair-and-two-more-expected-data-changes-the-roadmaps-release-table-gains-the-row-of-v101-and-two-cases-stop-depending-on-where-the-guide-and-a-fixture-set-their-blocks)); the operator then asked what was taking so long, and the rest went into the one complete run ([D019](decisions.md#wo-281-d019--the-operators-word-on-the-time-the-focused-suites-run-one-at-a-time-had-taken-longer-than-a-complete-run-the-rest-go-into-the-one-complete-run)). The complete run supersedes them all.
- **Single cases under the bounded wrapper** after each round's fixes: the criterion-3 case and the budgets loader's; the criterion-4 case and the relay's; the map's links, the absent seeds and the dependency-free load; the export's five guide cases; the v0.81.0 instance case (43 s); the starter refresh case (198 s). All passed, and the complete run ran each again.
- **Checks read after the last edit:** `node scripts/harness.mjs check` (37 generated surfaces), `node scripts/lib/operator-commands.mjs --check` (current), `npm run meta`, `npm run sync` (nothing regenerated on its last run).

## Review

self-review: found 39; fixed 28; recorded 11; rounds 2; unreviewed 88 lines (round two's own wording fixes to the guide and product 07, made after its reports; they changed no code, so no third round was owed)

The 88 lines are 48 added and 37 removed in the guide, and 2 and 1 in
product 07, all before the complete run. The records written after round
two (D025, D026, the second reading and this file) are evidence. The counts
are the four standard reviewers'; the two added reviewers' findings are
counted in the two bullets below.

- **Round one**, 22:52 to 23:08 UTC, tree `dcc789cf37e1`: three reviewers
  (criteria, design, consistency) and one combined worker, each the
  generated `dotln-worker` (their transcripts name `claude-opus-5-5`; the
  effort, xhigh, is the definition's and was not read back), and the two
  reviewers the operator added, each a Codex worker whose host header names
  `gpt-6-astra` at reasoning effort max. All six read one tree and nothing
  changed while they read. The four found 32 distinct findings, three
  blocking: a table of WO-276 that pins a rule's size and was not
  regenerated; no case behind criterion 3; and a refusal over the figure,
  where the order adds none. All three and 21 others were fixed, 8 recorded
  ([D020](decisions.md#wo-281-d020--round-one-of-the-review-ladder-the-four-standard-reviewers-thirty-two-findings-three-of-them-blocking-each-with-who-found-it-its-class-and-what-becomes-of-it), [D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler),
  [D023](decisions.md#wo-281-d023--correction-two-decisions-said-the-long-paragraph-list-named-nothing-this-branch-wrote-after-step-5-had-changed-two-long-paragraphs-of-product-07-and-the-count-of-base-words-not-held-has-changed-twice)). The two added reviewers made 24
  findings and three patterns; 23 were fixed and one left to planning
  ([D021](decisions.md#wo-281-d021--round-ones-two-added-reviewers-on-gpt-6-astra-thirteen-findings-on-the-pages-as-instructions-and-eleven-on-filler-each-checked-against-the-base-guide-twenty-three-to-be-fixed-and-one-left-to-planning)).
- **Round two**, 23:41 to 23:57 UTC, tree `64738131e550`: the same six,
  each rechecking its own report. The four confirm every blocking finding
  fixed and found seven new ones, none blocking; four were fixed, all in
  documents or evidence, and three recorded. The reviewer of instructions
  found eleven of its thirteen answered and raised seven more, five fixed;
  the filler reviewer found eight of eleven answered and raised no finding
  that stops a reader ([D025](decisions.md#wo-281-d025--round-two-of-the-review-ladder-every-blocking-finding-of-round-one-confirmed-fixed-seven-new-findings-none-of-which-blocks-the-two-added-reviewers-rechecks-and-no-third-round)).
- **No round three:** round two's fixes changed the guide, product 07 and
  one evidence file, and no code.
- **Reports**, in the ignored reviews lane
  `docs/control/local/reviews/WO-281/`: `round-1-` and `round-2-` followed
  by `criteria`, `design`, `consistency`, `combined`, `usability` and
  `filler`, each `.md`; the decisions hold each one's SHA-256.
- **Worker uses:** 17 of the dispatch's cap of 30
  ([D004](decisions.md#wo-281-d004--the-operators-direction-this-dispatchs-worker-cap-is-30)): three critics, two readers, six
  reviewers and their six rechecks.

Recorded and not fixed, for the next order that touches each: the gate
relays the list's status line by its prefix for any task (G01); the figure's
reader lives in the budgets module, whose loader no longer calls it (G02);
no case yet for a map written from an older template (F09); the list reads
the working tree where a caller passes committed changes (F26); two pinned
guide sentences hold link syntax (F29); the added reviewers' launcher is a
second copy of the critic's (F30).

## The meta critic

The operator asked for a meta critic on GPT-6 Astra 45 minutes into the
dispatch ([D002](decisions.md#wo-281-d002--the-operators-direction-one-meta-critic-on-gpt-6-astra-forty-five-minutes-on-launched-on-a-copy-of-the-transcript-that-holds-no-account-address)). Three ran, at 20:51, 22:06 and
23:21 UTC, each on a copy of the session's transcript in which the account's
address is replaced. Each report's path went to the operator in a short
line, each point was checked and accepted, and each report is given whole in
the closing message of the turn.

| Launch | Report (ignored lane) | Points | Decision |
| --- | --- | --- | --- |
| 1 | `docs/control/local/reviews/WO-281/critic-1.md` | A notice recorded without its message; step 2's checks batched without saying so; a progress line that claimed more than the inventory shows | [D007](decisions.md#wo-281-d007--the-first-meta-critics-three-points-each-checked-and-accepted-a-notice-recorded-without-its-message-step-2s-checks-batched-without-saying-so-and-a-progress-line-that-claimed-more-than-the-inventory-shows), [D006](decisions.md#wo-281-d006--correction-d005-says-the-operator-was-told-the-reading-of-the-map-and-the-hosts-transcript-holds-no-such-message-the-notices-the-transcript-lacks-are-sent-again-in-lines-it-keeps) |
| 2 | `docs/control/local/reviews/WO-281/critic-2.md` | A method recorded as performed; two counts that did not match their sources; a reader set tasks a running gate refuses; a requested model recorded as the one that ran | [D017](decisions.md#wo-281-d017--the-second-meta-critics-four-points-each-checked-and-accepted-a-method-recorded-as-performed-two-counts-that-did-not-match-their-sources-a-reader-set-a-task-the-running-gates-refused-and-settings-recorded-as-what-ran), [D016](decisions.md#wo-281-d016--correction-three-records-stated-more-than-their-evidence-held-how-the-reader-read-how-many-order-files-the-lists-figure-covers-and-what-the-critic-ran-on) |
| 3 | `docs/control/local/reviews/WO-281/critic-3.md` | A planned fix recorded as made; the serial suites' cost weighed too late; a reader's text changed before a copy was kept | [D024](decisions.md#wo-281-d024--the-third-meta-critics-three-points-each-checked-and-accepted-a-planned-fix-recorded-as-made-the-cost-of-the-serial-suites-weighed-too-late-and-a-readers-text-changed-before-a-copy-of-it-was-kept) |

A fourth was due at 00:36 UTC unless the complete run had passed; the run was live then and passed at 01:06 UTC, so the clock had ended and none ran.

## For the release's notes

What the release's Read before upgrading must say (the order's write-back
duty), in the final reviewer's words:

- The kit guide, `docs/KIT.md`, is rewritten: each section says first what
  it is for, procedures are numbered steps, rules are lists, options are
  lists or tables. Its facts are kept: every heading, command-block line and
  link target of the earlier guide is in it, and the three code spans that
  were renamed are listed with their reasons in
  `docs/evidence/WO-281/decisions.md` (D022, `inventoryRemovals`).
- The guide's fifteen section headings keep their text, so a link to
  `docs/KIT.md#first-steps` or any other section still resolves. Subsection
  headings are new.
- A starter refresh replaces a starter's `docs/README.md` with the current
  documentation map where the starter still holds an earlier export's
  bytes, and keeps one its owner changed, naming it in `keptSeeds`.
- The document gate lists, and never refuses, a paragraph over 120 words
  that a branch adds or changes in a standing document. An instance sets
  the figure, or `null` for no list, as `documents.paragraphWords` in
  `docs/control/budgets.json`; an instance's own budgets file needs no edit.
- The final reviewer returns to repair a changed standing passage its reader
  cannot follow. An instance takes the sentence with the role text when it
  re-emits on its update branch, as every update does.
- No command, flag or path changes.

## Follow-ups

Four rows of the follow-up register, each from a decision's `followup`:

- `FUP-433d0e43d06b215a` ([D014](decisions.md#wo-281-d014--step-6-the-reader-answered-nine-of-the-ten-tasks-more-easily-from-the-rewritten-guide-and-one-about-as-easily-and-its-report-changed-seven-things-in-the-guide)): gaps the first
  reader found in both texts.
- `FUP-6d8e6bf5dc056d06` ([D020](decisions.md#wo-281-d020--round-one-of-the-review-ladder-the-four-standard-reviewers-thirty-two-findings-three-of-them-blocking-each-with-who-found-it-its-class-and-what-becomes-of-it)): five items from
  round one that are not this order's.
- `FUP-ace4a3d957b6c009` ([D021](decisions.md#wo-281-d021--round-ones-two-added-reviewers-on-gpt-6-astra-thirteen-findings-on-the-pages-as-instructions-and-eleven-on-filler-each-checked-against-the-base-guide-twenty-three-to-be-fixed-and-one-left-to-planning)): a table from a
  gate's refusal to its cause.
- `FUP-6449fdb000fc3414` ([D026](decisions.md#wo-281-d026--the-second-reading-of-the-candidate-one-fresh-reader-the-final-text-alone-its-bytes-kept-and-what-it-could-not-find-left-to-planning)): what the second
  reader did not find or found hard, above all who types a command and who
  runs it, and what the guide leaves to the commands page.

The order's own carry-in stands: the product documents, product 07 first,
rewritten the same way once the operator has read this rewrite. The whole
list (`node scripts/docs-check.mjs --long-paragraphs`) shows where: product
07 has about 140 paragraphs over the figure.

Thirty-five pending rows of the register match this change by a path it
touches or by the order's number (`npm run plan -- followups --touching`,
revision `9f138120555f`). Four are this order's own, above. None of the
others was fixed here; each is left as it is, for the final review to
dispose where this change opened its seam. Six name this order and were
read in full:

- `FUP-5e8a7883add5361b` (WO-277-D030, item 1) asks planning to give this
  order, or decline, four points about the commands page: step paragraphs
  that quote what commands print, a step's paragraph as one comment line,
  what an absent terms list does said in three places, and how to elect
  another host. The order as filed names none of them, so none was taken.
  The second reader's report bears on the second.
- `FUP-d088964c0f58f42e` (WO-277-D009) asks for a regression case for the
  commands page from the order that next changes the page. This order
  changed the page by its version line alone and added no such case.
- `FUP-be21bcb82ee48a3a` (WO-277-D026): items 1 and 2, on a merge that
  stops and on a squash-merged update, are assigned to WO-282 and concern
  behavior; the update section's rewrite kept what the base said. Item 3 is
  the advisory this completion printed (below).
- `FUP-858a24b8de5b5313` (WO-277-D007), `FUP-0b9d1ba5052aa2b7`
  (WO-277-D004) and `FUP-914cd6b111dcac5d` (decisions as choices and the
  guide by rule, deferred to this order for the guide's readability): the
  first two are not the guide's; the third's guide half is this order.

The other twenty-five match by a file alone (`scripts/test-runner.mjs`,
`scripts/docs-check.mjs`, `docs/control/budgets.json` and the like) and
were read by their titles, not one by one.

## After the completion

`implementation-ready` was recorded at 01:16 UTC with 6 criteria met and
none unmet. It printed three advisories, each acted on afterwards in this
directory alone:

- **The review line.** It said this file lacked one. The line was there with
  a reason longer than the 200 characters the reader admits; the reason is
  now shorter and the line reads. The advisory's wording is item 3 of
  `FUP-be21bcb82ee48a3a`.
- **Outputs not read at their current bytes.** Twenty-four files, named in
  the order's control record. The completion was recorded before they were
  read, which the role's rule forbids and two critics of the last order had
  already found in it. They were read afterwards, between 01:19 and
  01:21 UTC: this file, the map's template, the two reviewers' briefs, the
  map renderings' record, core's map inventory, the budgets template, the
  control record and the evidence editions whole; the parts this order
  wrote of the rule table, the guide's inventory difference, the two lists
  of long paragraphs, the inventory and renderings scripts, core's map, the
  seed rules and the two test files; and the head of the front page, the
  commands page, the current-state page, the publication lock and the
  order, whose only changes are the version release preparation wrote.
  Nothing read needed a change outside this directory.
- **Follow-up rows this change touches.** As recorded under Follow-ups.

## What changed beyond the guide

- `scripts/kit/docs-map.template.md` (new), `scripts/launchpad.mjs`,
  `scripts/lib/starter-seeds.mjs`: the map as a template, the export's guard
  that it links every seeded root's README, and the refresh rule
  ([D012](decisions.md#wo-281-d012--step-3-the-documentation-map-is-a-kit-template-rewritten-as-a-table-of-the-roots-and-a-starter-refresh-brings-a-copy-an-older-export-wrote-to-it-and-keeps-one-its-owner-changed)).
- `scripts/docs-check.mjs`, `scripts/lib/process-budget.mjs`,
  `scripts/test-runner.mjs`, `docs/control/budgets.json`: the list, its
  figure, and the gate's relay of its status line
  ([D010](decisions.md#wo-281-d010--step-4-the-document-check-lists-the-long-paragraphs-a-branch-writes-in-standing-documents-at-a-figure-of-120-words-and-prints-the-whole-list-on-request), [D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler)).
- `packages/skeleton/src/loadouts/contributor.ts` and what emit writes from
  it; `docs/product/07-execution-guide.md`: the final reviewer's sentence,
  and two paragraphs split at their sentences
  ([D011](decisions.md#wo-281-d011--step-5-the-final-reviewer-returns-a-changed-standing-passage-its-reader-cannot-follow-in-the-rule-every-role-carries-and-in-product-07), [D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler)).
- `docs/evidence/WO-276/part-f/rule-table.md`: regenerated by its command,
  one size changed ([D022](decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler)).
- `docs/product/06-roadmap.md`, `docs/control/release-history.json`: the row
  of v1.0.1, an adjacent repair ([D018](decisions.md#wo-281-d018--adjacent-repair-and-two-more-expected-data-changes-the-roadmaps-release-table-gains-the-row-of-v101-and-two-cases-stop-depending-on-where-the-guide-and-a-fixture-set-their-blocks)).
- The starter's v1.0.1 refresh receipt and its register rows under
  `docs/siblings/` were in the worktree at its start and are not this
  order's change ([D020](decisions.md#wo-281-d020--round-one-of-the-review-ladder-the-four-standard-reviewers-thirty-two-findings-three-of-them-blocking-each-with-who-found-it-its-class-and-what-becomes-of-it), F32).
- Tests: `scripts/test-docs-check.mjs`, `scripts/test-harness.mjs`,
  `scripts/test-dispatch-bound.mjs`, `scripts/test-launchpad-update.mjs`,
  `scripts/test-launchpad-planning.mjs`, `scripts/test-launchpad-seeds.mjs`,
  `scripts/test-sync.mjs`, `scripts/test-authority-grants.mjs`.

## Terms screen

`node scripts/terms.mjs branch`, run at 01:08 UTC after the complete run and after the last edit outside this directory, printed `local-terms list: present; entries: 0 refuse, 9 context; changed files screened: 86; lines found: 0 refuse, 0 context`. It listed no line, so there was none to read.

## Goal alignment

The order's goal is a guide a person can follow with no fact lost, and
something that holds later write-backs to that. The outcome matches on the
first, by the inventory and two readers, with the limits the readers name:
the guide still leaves what to look for and what to do on a failure to the
commands page, and it does not always say who types a command. On the
second, the list and the reviewer's sentence are in place and each has a
case.

Three traps were met and are recorded where they were corrected. The
executor ran the order's focused suites one at a time for 74 minutes of gate
time before the operator stopped it ([D019](decisions.md#wo-281-d019--the-operators-word-on-the-time-the-focused-suites-run-one-at-a-time-had-taken-longer-than-a-complete-run-the-rest-go-into-the-one-complete-run)). It
stated more than its evidence held four times, each found by a critic or a
reviewer and corrected in a decision of its own
([D006](decisions.md#wo-281-d006--correction-d005-says-the-operator-was-told-the-reading-of-the-map-and-the-hosts-transcript-holds-no-such-message-the-notices-the-transcript-lacks-are-sent-again-in-lines-it-keeps), [D016](decisions.md#wo-281-d016--correction-three-records-stated-more-than-their-evidence-held-how-the-reader-read-how-many-order-files-the-lists-figure-covers-and-what-the-critic-ran-on),
[D023](decisions.md#wo-281-d023--correction-two-decisions-said-the-long-paragraph-list-named-nothing-this-branch-wrote-after-step-5-had-changed-two-long-paragraphs-of-product-07-and-the-count-of-base-words-not-held-has-changed-twice), [D024](decisions.md#wo-281-d024--the-third-meta-critics-three-points-each-checked-and-accepted-a-planned-fix-recorded-as-made-the-cost-of-the-serial-suites-weighed-too-late-and-a-readers-text-changed-before-a-copy-of-it-was-kept)). And it
changed the guide before keeping the text a reader had read
([D026](decisions.md#wo-281-d026--the-second-reading-of-the-candidate-one-fresh-reader-the-final-text-alone-its-bytes-kept-and-what-it-could-not-find-left-to-planning)).

## Attestation and usage

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-fable-5-2","effort":"xhigh","source":"claude-session-readback"}

**Process cost:** entry 112,797 tokens; handoff 281,474,941 tokens; source claude-transcript-message-usage

`node scripts/harness.mjs usage` for this session at 01:07 UTC, scope dispatch: 1,154 input, 279,334,560 cached input, 1,453,180 cache write and 686,047 output tokens; cost unknown (the counter is unavailable). Dispatch standing: 5 h 1 min of 8 h 0 min; complete runs 1 of 20; within. Workers: the hook counted 10 uses (6 launches and 4 re-tasks, all Claude); the seven kit launches on Codex, which no hook sees, are counted by hand (three critics, the two added reviewers and their two rechecks): 17 of the dispatch's cap of 30.

## Evidence in this directory

- [decisions.md](decisions.md), [meta.json](meta.json): D001 to D026.
- [inventory.mjs](inventory.mjs), [inventory-base.json](inventory-base.json),
  [inventory-candidate.json](inventory-candidate.json),
  [inventory-difference.md](inventory-difference.md): criterion 1. The three
  `inventory-README-` files are the same reading of core's map.
- [tasks.md](tasks.md), [reader-record.md](reader-record.md): criterion 5.
- [long-paragraphs-base.txt](long-paragraphs-base.txt),
  [long-paragraphs-candidate.txt](long-paragraphs-candidate.txt): the list
  before and after.
- [map-renderings.mjs](map-renderings.mjs),
  [map-renderings.md](map-renderings.md): the five texts earlier exports
  wrote for the map, whose hashes the refresh recognises.
- [reviewers/](reviewers/launch.mjs): the two added reviewers' briefs and
  their launcher.
- [status.json](status.json): `npm run resume -- status --json` after
  `implementation-ready`, read at 01:20 UTC, with its two location fields
  written as `<worktree>`, the kit's placeholder; it holds no home path.
