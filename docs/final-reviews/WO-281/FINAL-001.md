# WO-281 — FINAL-001

**Verdict:** pass. All six criteria are met. No finding blocks; one is boarded
as a follow-up.

Reviewed on 2026-11-16 UTC: branch `wo-281` as its working tree stands over
`main` at `5edc7798b9eccaa880467d41a28b6a43f4b54226`, code identity
`63a17b38c1ef26919b8e722d4cdd8ea47e62752d1d69c1aa9261a389fc7ea796`. The
review changed no byte of the subject: no source, no test, and no sentence of
the guide, the map or product 07. It wrote this report, the pull-request body,
the release notes, one decision
([D029](../../evidence/WO-281/decisions.md#wo-281-d029--final-review-the-verified-subject-passes-and-is-left-byte-for-byte-the-reviewers-own-comparison-of-the-guides-prose-with-its-base-and-one-follow-up-on-sentences-that-keep-the-bases-dense-wording))
and one read-only script with its output.

The reviewer ran in Claude Code 2.1.325 on `claude-fable-5-2` at max effort,
as the session's readback supplies. The order recommends high for the
reviewer; the operator's selected session was kept and the actual value is
attested. No worker was launched.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-fable-5-2","effort":"max","source":"claude-session-readback"}

**Process cost:** entry 263,366 tokens; handoff 51,078,098 tokens; source claude-transcript-message-usage

Both readings have dispatch scope: entry at `2026-11-16T03:21:49.180Z`, and
handoff preparation at `2026-11-16T03:53:58.613Z`, before the document gate.
The handoff figure is 274 input, 50,411,504 cached input, 536,360 cache write
and 129,960 output tokens; dollar cost is unknown, since the host reports
none. Dispatch standing then: 0 h 33 min of 8 h 0 min, complete runs 0 of 3.
Final counters stay in the ignored receipts and the response.

## Integration

`npm run worktree -- integrate WO-281` took in nothing: `origin/main` is
`5edc7798b`, the branch's base, so nothing was merged, resolved or retimed,
and no claim of the verification is carried across a new base. The code
identity is the one the executor's complete review run and the verifier
judged. That run's passing row, recorded at `2026-11-16T01:06:46.448Z` (45
suites, none failed, 0 h 56 min), is therefore reused, and this review
started no complete run. `npm run release -- prepare`, reading origin's tags,
left `v1.1.0` as the target.

## What was read

The order; the whole diff of source and tests; the rewritten guide whole, all
4,365 lines; the map's template beside the text the export rendered in code
before; the two changed passages of product 07, word by word against the base;
core's map; the decisions D001 to D028; VER-001 and its evidence; the
executor's handoff; and the second reader's report. The verification's one
finding, a follow-up, has no blocking claim to reproduce.

## Criteria

**Criterion 1:** met. The recorded
[difference](../../evidence/WO-281/inventory-difference.md) lists three code
spans of the base as absent and every one as named, and nothing else of the
four kinds: `diff WO-NNN`, `apply WO-NNN` and `draft WO-NNN --new`, each
renamed to its whole command and listed with its reason under
`inventoryRemovals` in
[D022](../../evidence/WO-281/decisions.md#wo-281-d022--round-ones-fixes-as-built-the-rule-table-regenerated-a-case-for-criterion-3-no-refusal-over-the-figure-the-cases-the-reviewers-found-missing-and-the-guide-and-the-map-changed-where-a-reader-was-stopped-or-the-text-read-as-filler).
The review recomputed the four kinds with a script of its own, which reads
none of the order's inventory files:
[guide-facts.mjs](../../evidence/WO-281/final-001/guide-facts.mjs) finds 17 of
17 headings, 89 of 89 block lines, 70 of 70 link targets and 792 of 795 code
spans of the base in the candidate, the same three absent
([its output](../../evidence/WO-281/final-001/guide-facts.json)). The fifteen
second-level headings keep the base's text and order, the guide's 86 distinct
links to its own headings all resolve, and no anchor is duplicated. Every
heading another document links resolves by the document gate's link check,
whose passing row this result consumes.

**Criterion 2:** met. The complete review row covers `launchpad`,
`launchpad-planning`, `sync-fixtures` and `registrations` whole, and the guide
they read is the guide reviewed here: its SHA-256 is the one read before that
run began, and its Git blob is the one checkpoint 3 holds.
`node scripts/lib/operator-commands.mjs --check` prints
`docs/OPERATOR.md is current` at the reviewed tree. For the refresh rule the
review ran the launchpad suite's case alone under the bounded wrapper: starter
refresh publishes one verified commit and preserves every refusal boundary, 1
passed in 0 h 3 min. In it a starter whose `docs/README.md` holds the first
export's bytes is previewed and refreshed to the current map, and one whose
owner changed the map keeps it through a preview and a refresh, named under
seeds kept with its reason. The seed rule was read against that case
(`scripts/lib/starter-seeds.mjs`): an export's bytes are proven by one of five
recorded hashes or by the template the starter carried, the map never refuses
a refresh, and a missing map is added with the other absent seeds.

**Criterion 3:** met. The case named for this criterion in
`scripts/test-harness.mjs` passed alone under the bounded wrapper at the
reviewed tree, and in the complete run's `harness-fixtures` suite. It names
the clause, finds the rule once in the reviewer's root as emit installs it
for `.claude` and for `.agents`, and finds the same clause in product 07.
`node scripts/harness.mjs check` reports 37 generated surfaces. The clause is
in this session's own loaded reviewer skill, and this review applied it.

**Criterion 4:** met. `node scripts/docs-check.mjs` at the reviewed tree
prints `long paragraphs: over 120 words (documents.paragraphWords in
docs/control/budgets.json); none among the paragraphs this branch adds or
changes in standing documents` and passes with 0 failures; the document gate
relays that line. The case named for this criterion in
`scripts/test-docs-check.mjs` passed alone under the bounded wrapper: a long
paragraph and a long list item the branch adds and a long paragraph it edits
in place are each listed by file and line; an untouched paragraph, a record, a
fenced block, a table cell and an instance's kit document are not; and a
figure of 200, a null, an unusable value and a misspelled key each exit zero.
That case's suite, `docs-check-fixtures`, is one of the document gate's. The
budgets loader's case shows a mistyped figure stops no dispatch. The
criterion's words, the advisory's list for the standing documents, are read
as the executor and the verifier read them: the gate lists what the branch
wrote and `node scripts/docs-check.mjs --long-paragraphs` prints every
standing document's, 1,541 paragraphs in 307 files today
([D010](../../evidence/WO-281/decisions.md#wo-281-d010--step-4-the-document-check-lists-the-long-paragraphs-a-branch-writes-in-standing-documents-at-a-figure-of-120-words-and-prints-the-whole-list-on-request)).

**Criterion 5:** met. The [reader's record](../../evidence/WO-281/reader-record.md)
holds a first reader's two answer sets for the ten tasks, from the base at
`5edc7798b` and from the candidate as it stood then, named by its SHA-256,
and a second reader's answers from the final candidate alone. The second
text's SHA-256 and Git blob are those of the guide reviewed here, so the
guide has not been edited since that reading. The record states its limits:
the first reader had seen both texts, and its candidate text was not kept.

**Criterion 6:** met. `npm test -- --review` stands on the passing complete
row at the reviewed code identity: the review selection's 45 suites, none
unrun and none failed. The plain `npm test` selection is part of that run,
and the result transition's reader takes the same row for a plain claim. The
row holds by name the seven Preflight suites of the review selection
(`launchpad`, `launchpad-planning`, `sync-fixtures`, `registrations`,
`harness-fixtures`, `plan-refutation`, `runner-fixtures`); its `generated`
task checks the evidence editions the Preflight line also names, and
`docs-check-fixtures` runs in the document gate. `npm run test:docs` stands
on the document gate run once after this report's last edit, whose passing
row for the candidate tree the result transition consumes.

## The changed standing documents

The rule this order extends has the final reviewer judge each changed
standing document's diff. Each was read as its reader would read it.

- **The kit guide.** A replacement in place. Its running text holds no dated
  account: the sentences that name a version, such as what an instance older
  than `v1.0.0` does, say what is so for a reader on that version and were the
  base's. No passage is one its reader cannot follow. The paragraph the order
  names first, on publishing a target order's change, was read sentence by
  sentence against its rewrite, and every fact of it is there.
- **Product 07.** Three short paragraphs added, each stating what is so, and
  two long paragraphs split at their sentences. A word-level diff shows the
  additions, one full stop made a comma before the added clause and one colon
  made a full stop, and nothing else.
- **Core's map, `docs/README.md`.** One paragraph added on the list.
- **The front page and the commands page.** The version line alone.

The inventory reads headings, code and links, and nothing of the prose. So
the review's script also aligns the base's prose with the candidate: of the
1,017 sentences of the base, the content words of 924 stand together in one
run of at most eight adjacent blocks of the candidate, 87 more hold at least
four fifths of theirs, and six hold less. All 93 were read. One is the dated
account of the build overlay's migration, which the executor's decisions name
as dropped. The rest are restated: what they lack is words of form, step
numbers that became links, and the order numbers and dates of the dropped
accounts. The figure finds a dropped passage and proves no meaning; the
reading above is what the judgment rests on.

## Findings

One finding, a follow-up of class escape: it was in the verified subject and
inside verification's reading of the guide.

F1. Five sentences of the guide keep the base's wording and need a second
reading. Under Hooks, the sentence that counts the hook processes a call
starts reads at first as though a read started a shell command; the table
above it gives the counts. The others are what the gate's static reading of
Git forms leaves out, a session whose count falls in the usage report, which
commit is the update's own merge, and which readings of the process table a
prune makes. Each can be followed with the table or the sentence beside it,
so none returns to repair and none fails a criterion. None was reworded here:
the guide's bytes are what the complete run's suites, the verifier and the
second reader judged, and a reviewer who rewrites them certifies its own
text. D029 boards them for the order that next writes into the guide, as
FUP-28c9cf8ed5401f5e.

The verification's follow-up stands as recorded: replaying the order's
inventory or map-rendering script in place replaces filed records
(FUP-5797443b7cab8b6b). This review's script writes no file.

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "Five sentences of the kit guide keep the base's dense wording and need a second reading; WO-281-D029 boards their rewording for the order that next writes into the guide."
  }
]
<!-- dotln-findings:end -->

## Release surfaces and commits

`v1.1.0`, a minor above `v1.0.1`. `@dotln/skeleton` is 0.92.0 for the clause
its role text gained, and the console's pin and the lockfile follow it; no
other component changed. `npm run release -- check-surfaces --local`,
`npm run format:check`, `npm run publication:check` and `git diff --check`
each pass at the reviewed tree. The pull-request body and the five-section
release notes are beside this report; the notes' Read before upgrading says
the guide was rewritten with its facts kept, where the removals are listed,
and that the section headings keep their anchors, as the order's write-back
duty asks.

The branch is committed as four changes: the starter's `v1.0.1` refresh
receipt in the sibling register, and the roadmap's `v1.0.1` row, each its own
commit because neither is this order's deliverable; the order's change; and
the records.

## For the operator's reading

The order leaves the reading of the rewritten guide to the operator, at the
pull request. Six choices of the executor's ship as they stand unless the
operator says otherwise, and none is a criterion's to settle. The first, the
second and the last three are the five the handoff names; the third is the
order's own assumption.

1. Core's own `docs/README.md` is not rewritten; the order's map was read as
   the one every instance carries.
2. The document gate prints the figure's line and the long paragraphs the
   branch wrote, and the whole list on request.
3. The figure is 120 words, the executor's first setting.
4. The update's second command block is not split after its merge line; a
   sentence above it states the pause.
5. Two sections, Owned cleanup and retention and Document quality, keep an
   opening that says only what they cover, and the map's template opens with
   its three pointers.
6. The guide is longer: 4,365 lines for 2,765.

## Limits

Nothing was published live and no starter was refreshed: the release close
does that, and its refresh will rewrite the real starter's map. No reader was
timed. The complete run was not repeated; its row stands by identity. The
long-paragraph list judges length and never whether a passage can be
followed, which stays a reader's judgment.

## Terms screen

`node scripts/terms.mjs branch`, run after the last edit of these records,
listed no line in either class, so there was none to read: zero lines read.
The list was neither printed nor quoted.

## Goal alignment and cost

The outcome matched the plan recorded in D029: the verified subject passes
unchanged, its complete row is reused, and the review's own evidence stands
beside it. The three traps named there were each met by the reading itself:
the guide was read whole before any earlier conclusion was taken, no sentence
of it was rewritten by the role that certifies it, and passages were judged,
never the page's length.

On cost: the review's time went to reading and to its records, 0 h 33 min of
the dispatch before the document gate, and it started no complete run where a
fresh one costs 0 h 56 min. A fan-out of review workers would have added
readings of a text that twelve reviews had already read; the script compares
all 1,017 sentences in a few seconds of one process, and its misses are few
enough to read by hand.
