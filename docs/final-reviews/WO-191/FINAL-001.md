# WO-191 FINAL-001 — final review

**Verdict:** pass. How DotLn's published text reads is now a committed choice per surface: `docs/control/reader-profiles.json` holds one profile for each of the five publication surfaces, `npm run reader -- profile` with a surface name compiles it to guidance and names the nearest example, `preview` shows three complete versions of the surface for the real release v0.73.1, `worktree publish` and `release prepare` print the guidance beside the drafts they already show, and `npm run reader -- score` with `--record` measures where a fresh reader finds a release's answers and binds each row to the immutable tag it read. All nine criteria are met at the integrated subject, which is byte-identical in every judged file to the subject VER-001 judged. This review found no new defect: the findings block is empty, the verifier's two boards ([D010](../../evidence/WO-191/decisions.md#wo-191-d010), [D011](../../evidence/WO-191/decisions.md#wo-191-d011)) stay boarded, no follow-up row's seam was opened, the three examples per surface are presented below and in the review response, and, because no operator choice was recorded, the committed profile stays `balanced` on every surface as the order's fallback directs ([D013](../../evidence/WO-191/decisions.md#wo-191-d013)).

**Subject:** [`docs/work-orders/WO-191-reader-profiles.md`](../../work-orders/WO-191-reader-profiles.md) on branch `wo-191`, uncommitted over `main` at `b7741e38d68ac659921db757ac19054f84743495`, which is also the order's base: after `git fetch`, `origin/main`, local `main` and the branch base all name that commit, so this review's integration fast-forwarded nothing and resolved no conflict ([D012](../../evidence/WO-191/decisions.md#wo-191-d012)).

- VER-001 judged code identity `aea7bae9685587ee34e6c3ddd256222d42f252ac5efed2e6e008b2bf68c0a90b`. The identity was read before integration and again after the helper's regeneration and is unchanged, so the executor's fresh `npm test -- --review` row at that identity (recorded 2026-10-11T16:42:50.176Z, 39 suites, 91 fresh tasks, 1,428.3 s, exit 0) is the row this review's composed gate reuses. No behavioral byte was edited in this review.
- The order differs from `main` only in its heading's version label, `(v0.74.2)`, assigned at activation as the next patch above the observed v0.74.1 ([D004](../../evidence/WO-191/decisions.md#wo-191-d004)); release preparation during integration reports that target as current. The nine criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-191/` holds no `ideation.md`. The nomination provenance is the 2026-10-02 planning pass (§7) and its refutation receipt 038, whose two WO-191 known issues (criteria 5 and 6) were re-judged by receipts 042 and 043 (criteria 4 and 5); all four are judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict or the profile. The harness version comes from `claude --version` (2.1.296) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer. Two mid-review operator messages, a stray directory-listing command and a note that it had gone to the wrong terminal, were not instructions and changed nothing.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run or read in this session: the reader command on the committed library, the source of the library and its fixtures, the gate rows, the printed affected checks and the examples themselves.

**Process cost:** entry 94209 tokens; handoff 8932233 tokens; source claude-transcript-message-usage

All readings are `dispatch` scope from `node scripts/harness.mjs usage 6a042f53-e7a8-49c8-8ba8-9790b555c8ef`.

- Entry was observed at 2026-10-11T17:13:26.802Z, after 2 steps and 1 command: 67,357 cached input, 26,498 cache-write, 4 uncached input and 350 output tokens.
- Handoff was observed at 2026-10-11T18:06:03.321Z, after both gates had passed and the decisions, this report, the PR body and the release notes were written, 116 steps and 109 commands in: 8,484,479 cached input, 341,960 cache-write, 1,130 uncached input and 104,664 output tokens; subagents observed 0 of the cap of 20. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The final cost line, the result transition, the commits and the publish step follow the cutoff.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate was not run fresh, because integration left the code identity unchanged and the runner composed a passing row from the executor's 90 reused tasks plus the always-fresh format preflight in 6.5 s; a fresh run at this identity cost the executor 1,428.3 s. The document gate ran fresh, as the lifecycle requires, and took 1,465.8 s of wall-clock for 223.3 s of task work; that wait was spent, not saved, and is recorded under Findings and in D013. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-191/FINAL-001.md`.

Read in full: the order; VER-001; the control log's five events; `handoff.md`; D001 to D011 and the helper's draft D012; the complete new files `scripts/lib/reader-profiles.mjs`, `scripts/reader.mjs`, `scripts/test-reader.mjs`, `scripts/test-reader-fixture.mjs` and `packages/skeleton/fixtures/wo191-role-baseline.json`; the complete diffs of `scripts/worktree.mjs`, `scripts/release.mjs`, `scripts/refute-plan.mjs`, `scripts/test-runner.mjs`, `scripts/lib/document-gate-stubs.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, `scripts/test-process-debt.mjs`, `scripts/test-release.sh`, `scripts/test-release-preparation.mjs`, `scripts/test-plan-refutation.mjs`, the three `package.json` files, the lockfile, the kernel JSONL registry fixture, `docs/control/reader-profiles.json`, product 08 §PRs and commits, the two publication locks, the README version claim, the order heading, `docs/evidence/current.json` and the regenerated harness manifest (hash lines only) and skill roots (one added line each); the examples README, the six title and commit-subject variants, `prBody/balanced.md`, `releaseNotes/balanced.md`, `comparison.json`, `illustrations.json`, `baseline-run.json`, the first score row and a per-release summary of all ten; the probe index of `verification-001/`; the control budgets; the follow-up rows that textually touch this change (30, paged); product 08 §PRs and commits and §Release-note edition; the WO-191 entries of refutation receipts 038, 042 and 043; the integrate and publish branches of `scripts/worktree.mjs` and the integration library's argument, merge, receipt and regeneration stages; WO-198's FINAL-001, PR body and release notes as the shape of the record.

Read in part: `prBody/reader.md` (its first forty lines) and `releasePage/balanced.md` (its first sixty), to see the rewrites' shape against the published record. Not read line by line: the three Release-page variants in full, the remaining body and note variants, `facts.json`, `baseline-reader.json`, `self-review.json`, `meta.json` and the re-minted evidence editions; these were judged by `node scripts/reader.mjs check`, by the fresh `authority-evidence`, `artifact-evidence`, `verification-evidence` and `feedback-evidence` tasks of this review's document gate, and by VER-001's reading, which is carried.

Reviewed: the complete subject diff against `main` after integration: 76 files, 12,976 insertions and 53 deletions, of which 46 are new files (12,680 insertions) and 30 are modified; plus the verifier's untracked `docs/evidence/WO-191/verification-001/` (five files) and `docs/verifications/WO-191/VER-001.md`. The authored source is one library of 675 lines, a 60-line command, 471 lines of fixtures, a 62-line synthetic-fixture helper, 4 lines in the publish step, 6 in release preparation, 3 in `plan start`, 15 in the runner, 2 in the document-gate stub list, 2 in the contributor loadout and the fixture additions named above.

Lenses, and why:

- **Correctness and tests:** a parser of operator-authored JSON, an append-only public log whose rows are revalidated against immutable tags, and a scoring prompt whose output is pasted back; the lens is whether anything invented can enter the log or the figures.
- **Design and coupling:** the guidance must stay advisory at both print sites and the profile must never become a refusal; the library is now a declared source of the planning suite and a runtime import of two publication commands.
- **Operator flow:** the operator was promised three versions per surface to choose from and a fallback if they do not; the review must present them and record what stands.
- **Authority and private data:** score rows are public and committed; the reader's metadata and the correction record must carry no capture text.

Goal alignment:

- **Traps:**
  - Carrying VER-001's pass across an integration without reading the integrated bytes and re-deriving the identity.
  - Choosing a profile for the operator because the examples invite a preference.
  - Spending a fresh 24-minute review gate at an identity whose 91 tasks already passed.
  - Treating one slow document gate as a defect of the reader, or hiding it because the gate passed.
  - Repairing D010 or D011 in review because the fix looks small.
- **What I did:**
  - Read the code identity before and after integration, compared the regenerated tree with the pre-merge checkpoint, and let the runner compose the review gate from the executor's passing tasks at the unchanged identity.
  - Presented the three versions of every surface, recorded that no choice exists and that `balanced` stands, and left the examples for a planning pass.
  - Ran the document gate fresh, read its row's task spans against its critical-path accounting, and recorded the wall-clock with its figures and a planning follow-up in D013 without claiming a cause.
  - Left both verifier boards boarded with their owners named, because each is outside the criteria, breaks no behavior `main` had, and a reviewer writes no behavioral fix.
- **NoOp:** leaving the order unreviewed keeps publication style as three dated corrections in product 08 with no setting an author reads while writing, and leaves fifteen written examples and ten baseline scores uncommitted.

## Integration

`npm run backup:intake` archived the three ignored intake files into the session scratch, and `npm run worktree -- integrate WO-191 --intake-backup` with that archive first refused because the executor's 46 new files were intent-to-add entries, which its include-untracked stash cannot preserve; they were staged fully as the helper instructed and the command run again. It checkpointed the work (`refs/dotln/checkpoint/WO-191/6`, `2b2a5407…`), kept the named stash `6dec5abe6a354987f19d15239c349c22bdb2f114`, fetched `main` at the order's base, re-applied the work and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (v0.74.2 remains current above the observed v0.74.1), the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures. `git diff refs/dotln/checkpoint/WO-191/6 --stat` afterwards names only the decision stub, the meter snapshot, the meter block of `PR.md` and the decisions-index row; the verifier's untracked files appear there only because the checkpoint recorded them. The code identity read before and after is `aea7bae9…`. Upstream carries skeleton 0.57.1 and this order advances it to 0.57.2 with the console pin and the lockfile, which no upstream commit consumed; the evidence editions this order minted (WO-191 revision 001 for authority, artifact identity, verification and feedback) remain the selected ones. The printed affected checks passed at the integrated tree: `npm run publication:check` (254 of 254 product headings indexed, three identical dual-voice claim links, both edition pages current, bootstrap checks), `node scripts/harness.mjs check` (34 generated surfaces, exit 0) and `npm run release -- check-surfaces --local` (every license and publish-refusal surface PASS). [D012](../../evidence/WO-191/decisions.md#wo-191-d012) records both bases, the unchanged identity, the component check and the carried-forward claims.

## Earlier findings

- **VER-001 F1** (a scored release whose tag object is missing locally fails the `reader-profiles` row with a raw Git error): boarded as [D010](../../evidence/WO-191/decisions.md#wo-191-d010) and FUP-8b8eb522d1d136c0, owned by the next WO-191 repair or the next order that edits `scripts/lib/reader-profiles.mjs`. By source, `readScores` calls `readPublication` and `taggedProfile` for every row and both run Git through the throwing helper. It is outside the criteria (criterion 5 asks for a named refusal of a quotation not in the text, which holds; criteria 1 and 9 ask for a green document gate, which holds in a repository that has its tags) and breaks no behavior `main` had, since `main` had no such row; by rule it is a follow-up, never blocking, and a reviewer writes no behavioral fix.
- **VER-001 F2** (`score --record` refuses a `null` answer entry with a raw TypeError): boarded as [D011](../../evidence/WO-191/decisions.md#wo-191-d011) and FUP-a4b2cdfb03ddbd2e, same owner. By source, `recordScores` maps `answer.question` over the entries before `scoredAnswer` validates each; nothing is appended, so no score is corrupted. Same routing as F1.
- **Executor self-review** (found 5, fixed 5, recorded 0): a criteria adversary found two fact-preservation omissions in the examples and a design improver found three score-validation and selection defects; all five repairs are recorded in [D005](../../evidence/WO-191/decisions.md#wo-191-d005) and VER-001 reproduced the ones its verdict rests on (the branch-scope anchor, saved-row revalidation, refused reader keys, the due batch selecting its own revision). Those judgments carry; I did not reopen `self-review.json`.
- **The four review-gate repairs** ([D006](../../evidence/WO-191/decisions.md#wo-191-d006) to [D009](../../evidence/WO-191/decisions.md#wo-191-d009)): synthetic fixture inputs so product suites read no repository document, the outcome-only integration receipt, the test-source naming convention and the planning fixture's exact keys, and concrete protection descriptions on the two new runner rows. Each is visible in the diff I read and each suite passed in the executor's fresh row this review reuses. D009's unexplained single failure of the WO-198 shared-tag fixture stays open on its own reopening condition; the test passed in the fresh row and is outside this order's surfaces.

## The examples, presented

The order says the final review presents the three examples per surface. They were written for v0.73.1 ([D003](../../evidence/WO-191/decisions.md#wo-191-d003)); `record` is the surface as published, `balanced` and `reader` rearrange its facts and limits. The positions, in dimension order audience / density / identifiers / machine detail / voice:

| variant | positions |
| --- | --- |
| `record` | maintainer / headline / every claim / inline / plain |
| `balanced` | contributor / account / where they help / summarized / plain |
| `reader` | newcomer / headline / none in prose / linked / warm |

Pull-request title (`npm run reader -- preview prTitle`):

| `record` | `balanced` | `reader` |
| --- | --- | --- |
| :loud_sound: A worktree's gate records the shared refs it saw and names the ones that moved when a task fails | :loud_sound: A worktree's gate records shared refs and names their movement when a task fails | :loud_sound: A worktree's gate saves the shared refs it saw and shows you which moved when a task fails |

Commit subject (`npm run reader -- preview commitSubject`):

| `record` | `balanced` | `reader` |
| --- | --- | --- |
| Record the shared refs a worktree's gate saw and name those that moved when a task fails | Record shared refs at a worktree's gate and name their movement when a task fails | Save the shared refs a worktree's gate saw and show which moved when a task fails |

The three longer surfaces are read with `npm run reader -- preview prBody`, `preview releaseNotes` and `preview releasePage`, or at their paths under `docs/publication/examples/`. Their text sizes after the front matter, in bytes:

| surface | `record` | `balanced` | `reader` |
| --- | ---: | ---: | ---: |
| `prBody` | 8,520 | 6,154 | 6,263 |
| `releaseNotes` | 10,877 | 9,511 | 10,085 |
| `releasePage` | 13,077 | 11,911 | 12,708 |

No operator choice was recorded during execution, verification or this review, so every surface stays `balanced`, as the order's fallback directs and D001 and D013 record. A later change is one edit to `docs/control/reader-profiles.json` in a planning pass after `preview`; the profile in force for a release is the file at that release's tag. The examples' front matter discloses two inconsistencies in the published v0.73.1 sources (the PR's account of the first four verification verdicts differs from the release notes; one polish paragraph labels the harness host version as a skeleton version), and the record release notes' relative links are pinned to the tagged commit; they are historical samples, not a new validation of that release.

## Criterion judgments

**Criterion 1:** met

- [`reader-profiles.json`](../../control/reader-profiles.json) names `prTitle`, `prBody`, `commitSubject`, `releaseNotes` and `releasePage`, each with one valid position per dimension, every surface `balanced`. `node scripts/reader.mjs check` passes at the integrated tree and is the `reader-profiles` row of this review's document gate.
- The fixture "document check rejects each invalid profile fixture before scoring" covers an unknown surface, a missing surface, an unknown dimension and an unknown position and passed in this review's fresh `reader-fixtures` task (5.3 s). By source, `exactKeys` refuses unknown and missing keys at the profile, surface and dimension levels and names the known list; VER-001's eleven mutations of the real file are carried.

**Criterion 2:** met

- D003 names v0.73.1. Fifteen variants exist, each with front matter stating its positions (I read the six title and subject variants and two body and note variants in full, two more in part); `illustrations.json` holds a two-sentence pair for all fifteen positions, each read.
- `comparison.json` records an independent reviewer's per-surface sameness verdict (`sameFactsAndLimits: true` on every surface, reviewer `gpt-6.1-sol` at launch-selected `max`) bound to the examples' SHA-256 hashes; `reader check` recomputes the hashes and refused nothing, so the verdict is bound to the current bytes, and the fixture "examples retain their fact anchors and a comparison bound to current bytes" shows an appended claim is refused. The catalog's literal anchors (122 by the handoff) are checked by substring in every variant. VER-001's reading of the title, subject and body variants and its body-profile probe over all nine body, note and page variants are carried.

**Criterion 3:** met

- `npm run reader -- profile` for `prTitle`, `prBody`, `commitSubject` and `releaseNotes` printed the five guidance sentences, the preservation sentence and a `Nearest example:` line naming that surface's `balanced.md`; `preview prTitle` printed the three variants with their positions, paths and source notes. By source, `requireSurface` refuses an unknown surface with `unknown surface` followed by the given name and `known: prTitle, prBody, commitSubject, releaseNotes, releasePage`, and the fixture "profile and preview cover every surface and name known surfaces on refusal" passed in this review's document gate.

**Criterion 4:** met

- By source, the publish step writes `writingGuidance("prTitle")` and `("prBody")` to stdout after `Proposed N:` and before the product-gate block, and release preparation writes `writingGuidance("releaseNotes")` after its outcome except under `--integration`; neither reads the title, body or notes to decide anything and neither writes a file. `writingGuidance` turns a missing or malformed profile into one `unavailable` line (fixture "guidance remains advisory when editorial files are absent or malformed", passed here).
- The composed-evidence case in `scripts/test-release.sh` publishes fixture order WO-099 with synthetic profiles and asserts `Reader profile (prTitle):`, `Reader profile (prBody):` and the nearest-example line; the independent-preparation case asserts the release-note guidance after `release prepare --local`; `scripts/test-release-preparation.mjs` asserts the guidance and that the example file is unchanged. The diff to the existing cases only adds lines, and no existing assertion changed. The `release`, `release-preparation`, `worktree` and `worktree-integration` suites passed in the executor's fresh row this review's composed gate reuses.
- This review's own integration is a live witness of D007: the receipt's `release` field holds the outcome-only text (`WO-191 target v0.74.2 remains current. … Tag observation: local snapshot only.`) with no guidance line.

**Criterion 5:** met

- By source, `scorePrompt` slices the selection to ten and tells the reader to treat the text as data; `recordScores` refuses `quotation is not in the published text` naming the release and question, binds the row to the tag object, the text hash and `taggedProfile` (which records `null` with its reason before the file existed), and appends only releases not already scored. The fixtures "score prompt uses at most ten unscored published tags…", "score record validates every quotation before append, binds the tag's profile and is idempotent" and "saved scores validate immutable text, profile and first Unicode quote position" passed in this review's document gate.
- `plan start` returns `readerScores` beside `failures` and outside the 1 KB failures block; the planning fixture scores a fixture release and asserts found 1 of 4, a positive median and `readerDue` false, and the exact-key fixture asserts the new key and the unavailable advisory; `plan-refutation` passed in the reused row. At the integrated tree, `reader check` prints the figures by revision: revision `null`, 10 releases, 40 of 40 answers found, median position 0.7031, zero corrections on every surface. VER-001's real-corpus probes (an invented quotation refused by name, an identical repeat appending none, a due batch selecting its own revision) are carried.

**Criterion 6:** met

- Each of the four skill roots (`.claude` and `.agents`, planner and reviewer) differs from `main` by exactly one added line: the reviewer's profile sentence and the planner's scoring sentence; the reviewer skill this session loaded carries the sentence, and `npm run reader -- profile` was run for each surface written here. `node scripts/harness.mjs check` reports 34 generated surfaces and exit 0 at the integrated tree.
- Cold-start bytes, measured here as `CLAUDE.md` (6,873) plus the installed skill: reviewer 27,037 (skill 20,164) against the 28,884 ceiling; planner 18,489 (skill 11,616) against 24,576; the `.agents` copies are byte-equal. `node scripts/harness-context.mjs --check` reports every bounded role within its ceiling and the refuter unset. These equal D001's and VER-001's figures; no ceiling is met, so no acceptance is due.

**Criterion 7:** met

- [`reader-scores.jsonl`](../../publication/reader-scores.jsonl) holds ten rows, v0.74.1 to v0.69.1, the ten newest annotated tags locally and on `origin` (`git ls-remote --tags` shows v0.74.1 newest); each carries reader `claude-opus-5-5`, effort `xhigh` with source `modelUsage readback; launch-selected effort, effective effort unavailable`, a `null` revision with its reason, and four validated answers. [`baseline-run.json`](../../evidence/WO-191/baseline-run.json) records the prompt's SHA-256 and 138,259 bytes, the boundary (empty temporary cwd, tools disabled, replaced system prompt), 40 quoted answers and the host's `modelUsage`. VER-001 reproduced the prompt hash from the committed command with the log removed; carried.

**Criterion 8:** met

- Product 08 §PRs and commits opens with two new paragraphs: the control file as where style is set, the commands, the balanced fallback and the planning-pass change route; then the scoring rule and its limits; the dated corrections of 2026-09-05, 2026-09-07 and 2026-09-09 follow unchanged as the history behind the rule.
- The decisions file holds D001 (the fallback and its reasons) to D011 from execution and verification and D012 and D013 from this review; `npm run meta` regenerated the decisions index and the follow-up register. Both publication locks changed in the diff and `npm run publication:check` reports both edition pages current.

**Criterion 9:** met

- `npm run test:docs` ran fresh at the integrated tree: 34 passed, 0 failed, 1,465.84 s, 34 fresh tasks, recorded 2026-10-11T17:47:41.090Z at code identity `aea7bae9…`; it includes the `reader-profiles` and `reader-fixtures` rows. `npm test -- --review` composed a passing row at the same identity: 39 passed, 0 failed, 6.50 s, 1 fresh task (the format preflight) and 90 reused from the executor's row of 2026-10-11T16:42:50.176Z, recorded 2026-10-11T17:49:23.834Z as `host-gate:aea7bae9…:npm test`, identity and build output unchanged.
- `git diff --check`, `git diff HEAD --check` and `git diff --cached --check` print nothing; `npm run format` changed no file. Root `package.json` adds only the `reader` script; the lockfile changes only the skeleton version (0.57.1 to 0.57.2) and the console's pin on it. No dependency is added.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **This review's document gate took 1,465.8 s of wall-clock for 223.3 s of task work.** The row's `format` task records 6.6 s of duration while its row spans 17:23:15 to 17:46:03; the other 33 tasks ran between 17:46:03 and 17:47:41; the critical path attributes 1,465.6 s to work and 22 ms to waiting. VER-001's row at the same identity took 187.9 s and the executor's 97.6 s. The gate passed every suite, the cause is unknown, and nothing in this order's criteria or receipts names a document-gate duration. It is recorded in [D013](../../evidence/WO-191/decisions.md#wo-191-d013) with a planning follow-up (FUP-a566ba26ee9f909a) under ER4-005's row, where a document-gate median is judged.
- **`reader check` prints `surfaces`, `examples` and `illustrations` as literals** (VER-001's design note). `checkExamples` enforces exactly five surfaces, three variants each and fifteen illustration pairs through `exactKeys` before the literals print, so a drift fails the check rather than misreporting.
- **`taggedProfile(root, release)` takes a tag object id.** The parameter name misleads; every caller passes `row.tagObject` or `publication.tagObject`. Name only.
- **Suite selection for the library.** `scripts/lib/reader-profiles.mjs` is a declared source of the `plan-refutation` machinery suite only. The `release`, `release-preparation`, `worktree` and `worktree-integration` suites that exercise `writingGuidance` carry no `machinerySources` entry, so `classifySuite` marks them product suites and `npm test -- --review` always runs them; a later edit to the library cannot skip them.
- **Public data.** Score rows carry the release, tag object, text hash, revision, three reader keys and four quotations from published text; `validateReader` refuses any other reader key and `recordCorrection` stores a surface, revision and capture hash, never capture text. The examples' absolute links name this repository's public pages at tagged commits.

## Implementation review

- **Correctness.** Every entry point validates before it writes: `recordScores` checks the schema, the reader keys, the release count and duplicates, then every quotation against the publication read from the tag, then that a previously scored release's tag object and text hash are unchanged, and only then appends the fresh rows. `readScores` revalidates each saved row against the tag it names (text hash, tagged profile, quotation offsets and positions), so a hand-edited row is refused by the document gate rather than entering the figures. The profile revision hashes the validated choices in canonical order, so a formatter or key reorder cannot mint a new revision while any changed choice does. `scoreSelection` picks the triggering revision's releases when a reader is due and the newest unscored otherwise, which the fixture with ten newer releases of another revision pins.
- **Design.** Guidance is a pure function of the committed profile and the example library; the two print sites import it lazily and wrap it in `writingGuidance`, so an exported launchpad without the editorial files keeps its publishing flow and a malformed local profile is visible without blocking a publish. The one exception, the `--integration` call, is the receipt-producing path D007 names, and this review's own receipt shows it holding.
- **Operator flow.** `profile` and `preview` answer in one command each, refuse an unknown surface with the known list, and run from any directory because the root comes from the script's location. The score prompt tells the reader to treat the text as data and to return only the fixed JSON; the record command names the release and question when it refuses.
- **Maintainer in six months.** The dimensions, positions, questions and guidance strings live in one frozen table at the top of the library; the fixtures name each behavior they pin. The two things a reader will pause on are the tag-object parameter named `release` and the literal counts in `check`, both noted above.
- **Clean-room screen.** The examples and the baseline quote this repository's own published text; the reader ran in an empty temporary directory with tools disabled; nothing names a managed host, a forge account other than this repository's public pages, or an internal service.

## Follow-up register

`npm run plan -- followups --touching` lists 30 pending rows by textual match at the integrated tree, paged through four cursors. This review disposes none, because no listed row's seam was opened and no condition occurred:

- Two are this order's own boards, minted untriaged by the verifier's decisions: FUP-8b8eb522d1d136c0 (D010) and FUP-a4b2cdfb03ddbd2e (D011). Their owner is named in the decisions; the next planning pass triages them.
- FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost should not grow with closed history) matches the runner and `refute-plan.mjs`. This review's document-gate wall-clock is recorded against it in D013's follow-up; its own condition (the document gate's thirty-day median) is a planning measurement, not one row.
- Five match `packages/skeleton/src/loadouts/contributor.ts` because this order adds two sentences to it: FUP-1315c82ef74fb832, FUP-16a4af39c710459b, FUP-67a07b670440cf5a, FUP-e835d826e9af5417 and FUP-ec72b2ea596bdc75. Neither sentence edits the verifier root, the repairs-after-judgment sentence, the attestation fields or the findings-block rule, so no condition occurred; this report's block is measured and empty.
- Twelve match `scripts/test-runner.mjs`, `scripts/release.mjs`, `scripts/worktree.mjs` or `scripts/refute-plan.mjs` because this order adds rows, prints or a key there: FUP-642d7a4beaed2272, FUP-8fb7ae17dd0fad5b, FUP-a5c6ac8cb40bd52a, FUP-4c4ad5ef3c88547f, FUP-8cfd3ff52146a016, FUP-cc27c2c1a82fed2c, FUP-da471832071118c7, FUP-de6162b279f66709, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a, FUP-d0a9719cc2e4ec55 and FUP-f5f10101e717d59b. None of their named functions or seams (`ensureExistingRelease`, `finishPublishedWorktree`, the publish `--target` argument order, `runHarnessEvidenceChecks`, the format-preflight fixture, lifecycle recording, TAP selection, the guard bookkeeping) is touched.
- The remainder match `README.md`, the generated indexes, `docs/control/current.md`, the register itself, this order's authority edition or the process-debt and release shell fixtures by a trailing path part: FUP-079f827e1b11eb1e, FUP-fb2a080cc9b597d0, FUP-749c959a41178a3b, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-b3454d6ce3594ef3, FUP-dc58e92c5cafc732, FUP-9b0632b0ec72d168, FUP-fd05316b6030ef73 and FUP-4b70089b028849f0. This order commits no submodule, removes no repository, edits no writer text and does not edit `scripts/authority-evidence.mjs`.

## Known issues and carry-ins

- **Receipt 038, criterion 6** (each planning pass pays one reader agent; reopen when passes record reader runs with no unscored release or with scores that change no profile): the order's amended design and the implementation bind the reader to a changed profile with three or more unscored releases or the operator's word; `readerScoresAtStart` reports `readerDue` false otherwise and the planner sentence says the same. The condition is observable only after passes run; carried unchanged.
- **Receipt 038, criterion 5, and receipt 043, criterion 5** (the score is an agent's proxy for whether readers found what they came for, and the addition outweighs a removal of three corrections): the order's Known issues record both with reopening conditions that need the order to land (an operator correction on a profiled surface while its score is unchanged or rising; two scoring runs followed by no profile change or decision citing them). The baseline shows the proxy's reach: all 40 answers were found, which D003 says proves presence, not answer quality. Carried unchanged.
- **Receipt 043, criterion 4** (WO-188's body-profile check refuses relative links and fixes the same surfaces this order profiles, with no stated precedence): VER-001 ran WO-188's `githubBodyProfileFailures` and `relativeLinkFailures` over all nine body, note and page variants and found nothing, and no guidance string asks for a link form (I read the table: `linked` says to link machine detail, not how). The reopening condition, a guidance line or example asking for a form the check refuses, is not observed; carried.
- **The order's own known issues**: the planning document's reading-grade heuristic is not a target and nothing here uses it; whether relative links were broken was settled by WO-188 item 24 before activation and the record note example pins its links to the tagged commit (D005); a reader can quote a sentence that does not answer, which product 08's write-back and the examples README state as a limit of the score.
- **Operator-review assumptions.** 1 (five surfaces and five dimensions to start): holds; more are added by editing the control file, which the validator would then need to learn, so a sixth dimension is a source change, not a file edit. 2 (the operator picks; otherwise `balanced`): no pick was recorded; `balanced` stands. 3 (the planner collects scores, never the final review): honored; this review ran no reader. 4 (no text refused or changed because of a profile or score): holds by source and by the publish, prepare and integration fixtures.

## Publication

The guidance for each surface written here was read with `npm run reader -- profile prTitle|prBody|releaseNotes|commitSubject` (all `balanced`: contributor, account, identifiers where they help, machine detail summarized, plain voice). The PR title is a headline sized by its content: `:sparkles: Each publication surface now has a committed reader profile, chosen from examples and scored by fresh readers`; `:sparkles:` names a new capability (a control file, a command and a scoring record) rather than a text edit. The PR body ([`PR.md`](PR.md)) leads with what changed for the reader, keeps the two boards and the examples' limits under a read-before-merging paragraph, summarizes the gates and links the evidence with paths relative to the stored file, which the publish step rewrites absolute. The release notes ([`RELEASE-NOTES.md`](RELEASE-NOTES.md)) carry the five required sections in order, one physical line per paragraph. Commit subjects are plain; no commit message, title, body or note carries an AI coauthor trailer, a generated-with footer, a session trailer or a session URL.

Goal alignment matched. I re-derived each criterion from the source, the fixtures that ran in this review's document gate and the rows at the unchanged identity rather than carrying VER-001's pass across the integration unread; I presented the examples and recorded the standing fallback instead of choosing; I let the runner compose the review gate; and I recorded the slow document gate with its figures and no invented cause. The NoOp would have left the order unreviewed and the examples unpresented. The background document gate this review started has exited and its row is recorded; no other monitor or agent was started.
