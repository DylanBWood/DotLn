# WO-188 executor handoff

Twenty-four boarded machinery items in one order. Items 2 and 6 were found
already done by WO-195 and are recorded not reproduced (D004, D008); item 22
landed in WO-196 and this order owes its measure (D024). Every other item is
implemented with its fixture, the five evidence editions are re-minted, the
harness bundle is re-emitted, the write-backs are in place, and the close
register is prepared. One record per item is in `decisions.md` (D003 to
D026), with the re-mints, registries and write-backs in D027 to D029.

VER-001 failed criteria 1, 24 and 27; this `resume: fix` dispatch repairs the
three findings in place and records them as WO-188-D033 to D035, each with the
rule the repaired path now holds and a case the report did not quote. The
scratch inventory reads Git's untracked listing as well as its ignored one, so
a repository no ignore rule covers is scratch like any other and leaves at
close with its record. The body-link check walks the installed Markdown
parser's link, image and definition nodes, and the rewriter reads every
single-line CommonMark inline link. The console loopback closes every
connection after its response: the gate failure was Node's keep-alive timer
destroying an idle socket that the stalled client had just reused, reproduced
under load and traced in `repair-001/loopback-probes.txt`. No scratch
repository is present in the worktree, the follow-up queue held no item, and
the close register gains the row for the verification follow-up
FUP-de0faf98b2487c8f.

VER-002 failed criterion 24 with two findings; this second `resume: fix`
dispatch repairs both in place as WO-188-D038 and D039. An empty destination is
now a relative link: the shared predicate no longer exempts it, so the profile
refuses it by name and the rewriter writes the link as its text, as it does a
bare fragment or an escaping path. The rewriter masks code and raw HTML at the
installed parser's own positions instead of a backtick expression and a fence
tracker of its own, so a code span of any backtick runs, a span across lines, a
code block or raw HTML keeps its bytes, and refusal and rewriting share one
reading of what is prose. The verifier's three probes exit 0 after the repair
(`repair-002/verifier-002-probes.txt`), the parser's view of each case the
repair rests on is recorded (`repair-002/parser-oracle.txt`), and the
publication fixture now commits the mixed-backtick example and an `[empty]()`
link and compares the published lines. The close register gains rows for
FUP-3c96f0fb5b283866, FUP-c6b2a2b66fd0847c and the reopened D034's
FUP-98dd4b8af0b34182. The follow-up queue holds one item, completed: the
sealed release case now owns its fixture name (WO-188-D040), an adjacent
defect the order's own check `bash scripts/test-release.sh` met, which the
runner's per-case invocations never reached.

VER-003 failed under the main-behavior rule with one blocking finding and
boarded one follow-up; this third `resume: fix` dispatch repairs both in place
as WO-188-D043 and D044. The rewriter and the profile now read a body as the
lines the installed parser counts, ended by a newline, a carriage return and
newline, or a lone carriage return, each kept with its ending and a leading
byte-order mark outside the count as it is for the parser; the parser's
positions therefore land on the inventory's lines whatever ending each uses,
code on a carriage-return line keeps its bytes, a link on one is rewritten, and
a valid body no longer fails publication on a coordinate the inventory cannot
address. A link is rewritten only where the parser renders one and at the
destination the parser renders, escapes and character references resolved, so
an escaped parenthesis addresses the file it names, a scheme spelled by
reference stays absolute, and the brackets around a nested link stay text while
the link inside them is rewritten. The verifier's three probes rerun after the
repair (`repair-003/verifier-003-probes.txt`): the API attack reports zero
preservation failures over its 36 cases and the escaped destination at the
parser's target, failing only its closing assertion that the follow-up still
reproduces; the current publication and its newline control exit 0 with the
literal preserved. The parser's reading the repair rests on is recorded
(`repair-003/line-endings-oracle.txt`), the extended unit fixture fails its two
new tests against the pre-repair checkpoint (`repair-003/before-repair.txt`),
and the publication fixture now commits a carriage-return body and checks its
code and its absolute link at the forge double. The close register gains rows
for FUP-a95dab688b9bdaaf, FUP-860e9c5b60e43758 and the reopened D039's
FUP-eb7648ea4530f48a; D044 boards the percent-encoded destination as a
follow-up. The follow-up queue held no item.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

**Process cost:** third repair dispatch at handoff: totalTokens 6,024,144 (inputTokens 936; cachedInputTokens 5,708,341; cacheWriteInputTokens 215,223; outputTokens 99,644; reasoningOutputTokens unknown, counter-unavailable; costUsd unknown, counter-unavailable); source claude-transcript-message-usage; scope dispatch; cutoff 2026-10-09T09:31:38.183Z; 63 steps and 62 commands observed; subagents 0 of 20, exact-observed, 20 remaining; this repair's entry readback was 146,761 total tokens at 2026-10-09T08:33:14Z. The second repair dispatch recorded 6,769,043 total tokens (95,479 output) with 71 steps, 66 commands and 0 subagents at its 2026-10-09T06:53:36Z cutoff. The first repair dispatch recorded 10,300,490 total tokens (170,452 output) with 106 steps, 105 commands and 0 subagents at its 2026-10-09T04:30:06Z cutoff. The implementation dispatch recorded 122,754,776 total tokens (767,748 output) with 442 steps, 418 commands and 13 of 20 subagents at its 2026-10-09T01:56:28Z cutoff.

**Criterion 1:** met. In `scripts/test-release.sh` the material case removes a nested repository with commits outside the scratch lanes, one an earlier completion had declared kept and, since the VER-001 repair, one at `outside-lanes/probe` that no ignore rule covers and that was created after the reviewed candidate, each with no flag and no blocker, and the close record names each with its head commit and whether a remote held it; the intake-lane repository is preserved; `close_completion` shows one advisory naming a present repository; the generated executor root's step 5 says remove. The verifier's reproduction `verifier-001/scratch-release.mjs` exits 0 with cleanup clean, one removal recorded and no blocker. D003 records each of the seven sub-items of WO-176's D033, D034 and D037 as present or gone with the fixture that shows it; WO-188-D033 records the repair rule.

**Criterion 2:** met. `scripts/test-close-admission.mjs` admits the plain close, the material close, its disposable form, a scoped row and the printed `Material retry:` line and still denies the near misses; the release fixture's recorded blocker commands begin with the quoted runtime and release script paths. The single builder is WO-195's, recorded not reproduced in D004.

**Criterion 3:** met. `createrecovery` fails the forge double first at create and then at authentication after a published tag, and the record's tag outcome is set; `material_settle` prints the material command and every kept worktree; the hooks planted in a nested repository leave no marker, of which the file monitor is the live proof (D005).

**Criterion 4:** met. `release_case_submodule_force` keeps a derived worktree holding a populated committed submodule with an unpushed commit, with an intake unit present, and refuses before any scratch removal; `createrecovery` records `already-published` after the view failure; `material_derived` names the dirty derived worktree as the operator's with the exact settle command; `release_case_malformed_material` leaves a close record with outcome `refused` for `--material x=keep` (D006).

**Criterion 5:** met. `scripts/test-harness.mjs` shows a prune removing the `.partial` beside a whole proof (D007).

**Criterion 6:** met. The admission is withheld under a typed-correction state at this order's base, by WO-195; recorded not reproduced in D008 with the passing fixtures.

**Criterion 7:** met. `scripts/test-harness.mjs` journals a queued task notification with source `host-task-notification`, an unflushed transcript as `unattributed`, and `scripts/test-plan-refutation.mjs` shows `plan failures` excluding the notification row (D009). The enqueue-with-content shape is boarded as FUP-d4493f4251e69c87.

**Criterion 8:** met. D010 holds the Copilot observation from `docs/discovery/copilot-cli-2026-10-08.md`: CLI 1.0.89 loaded the shared file with the event named and fired the other hooks 30 times, so the event is registered; `scripts/test-harness.mjs` shows a failed Bash call with a shell diagnostic answered at the call with one counted row and the transcript route answering it no second time; the hook answered a live zsh failure in this session under Claude Code 2.1.295 at 2026-10-08T23:35:18Z.

**Criterion 9:** met. `scripts/test-plan-refutation.mjs` counts a decision whose dispatch names a correction and carries neither the kind nor a misread field, from the persisted ids (D011, with its limit).

**Criterion 10:** met. `scripts/test-docs-check.mjs` yields two keys for two attributed provenance fields; the repository run reports no current advisory (D012).

**Criterion 11:** met. `scripts/test-docs-check.mjs` fails a product 06 without its release-history block and a tag whose annotation cannot be read (D013).

**Criterion 12:** met. A tracked document gaining an absolute home path fails with file and line; the 214 lines in 124 files that hold one today pass by baseline; `scripts/test-entropy-review.mjs` shows the subject repository written as `.` with the subject hash unchanged (D014).

**Criterion 13:** met under the order's own 2026-10-07 carry-in reading: a typed `operatorQuote` without a capture digest fails, the attributed-words regex stays advisory, the eight paraphrased lines no longer match, `operator-word-repair.json` lists each with its file, and the repository run reports no current finding (D015).

**Criterion 14:** met. `scripts/test-release-preparation.mjs` and `prepare_independent` show the two waiting states refused, a symlinked evidence directory refused, a lone marker pair reported as a conflict and the pending line for a directory at the decisions path (D016).

**Criterion 15:** met. `ac15-overlay-evidence.txt` steps 7 to 9: with the export removed, five real-generator cases fail on the TypeScript error naming it through the fixture's own build; with the bytes restored all 23 pass (D017).

**Criterion 16:** met. `packages/console/test/collect.test.ts` prints a row with no attribution for a string, an object and a number (D018).

**Criterion 17:** met. The touching listing writes the path with leading parent components; a completion with no `main` prints the working command or says the feed is unavailable; a reserved lane name and a failing revision lookup each refuse (D019).

**Criterion 18:** met. `scripts/test-process-debt.mjs` fails the completion's whitespace check on an untracked file with trailing whitespace and passes one under an exempt path (D020).

**Criterion 19:** met. The fake-worker launch records gpt-6.1-sol at max; each of the six dated-record scripts says so in one comment line; product 07's sentence names no owner (D021).

**Criterion 20:** met. `scripts/test-resident-bind.mjs` names the profile mismatch and prints no launch line (D022).

**Criterion 21:** met. The two duplicates are gone and `scripts/test-helper-reuse.mjs` fails on a bare-hex `sha256` definer or a direct Git spawn, now over untracked scripts too (D023).

**Criterion 22:** met. The executor root holds the fork sentence and no pre-registration or per-order duty; the briefing prints no experiment line and prints an `**Experiment:**` header; every role root carries the goal-alignment sentence once and none asks for all eight lenses; `npm run meta` accepts the existing experiment records; `role-roots-before.txt` and `role-roots-after.txt` record the bytes, the executor root is 21,009 against 21,255 at the base after its restated rules were folded into its numbered steps, and no ceiling moved (D024).

**Criterion 23:** met. `scripts/test-comment-labels.mjs` fails a finding label, a bare decision number and a leading order identifier and passes an explanation; today's 81 lines in 27 edition-registered files pass by baseline; an edited baselined line fails; no file outside every edition holds a finding label (`node scripts/comment-labels.mjs`: 0 failures); only the executor root carries the sentence (`packages/skeleton/test/executor-supports.test.ts`) (D025).

**Criterion 24:** met. `wo199-regeneration.json` records the regenerated body with no unavailable cell and one counting line, every link absolute, and the Release text holding the title once; regenerated again after each repair, the third included, the facts and the Release text are unchanged and the body differs only in its live meter block. `scripts/test-github-body.mjs` shows the profile refusing every link the installed Markdown parser renders with a relative destination, an empty destination among them, and the rewriter writing the single-line forms absolute or as text while leaving every byte the parser renders as code or raw HTML; `scripts/test-worktree.sh` publishes the committed mixed-backtick example byte-for-byte and the empty link as its text through the forge double; the verifier's `verifier-001/api-attacks.mjs` and `verifier-002/links.mjs`, `code-spans.mjs` and `publish.mjs` probes exit 0 (D026, WO-188-D034, D038, D039). After the VER-003 repair the rewriter and the profile read the lines the parser counts, so code on a lone-carriage-return or carriage-return-and-newline line keeps its bytes and a link on such a line is rewritten, and a link's destination is the one the parser renders: the verifier's `verifier-003/links.mjs` reports zero preservation failures over 36 cases and the escaped destination at the parser's target, its `publish.mjs` current run and newline control exit 0 with the literal preserved, `scripts/test-worktree.sh` publishes a carriage-return body through the forge double with its code byte-for-byte and its link absolute, and `scripts/test-github-body.mjs` (29 passed) holds the mixed-ending, byte-order-mark, reference-spelled and nested-bracket cases (WO-188-D043, D044).

**Criterion 25:** met. Authority 003, artifact-identity 001, verification 001 and the carried feedback 001 are re-minted and every check passes (`edition-checks.txt`); the bundle is re-emitted (34 surfaces); D028 confirms from both registries that the only judged sources touched carry release labels and version pins.

**Criterion 26:** met. Product 07 §Discipline, §Workflow closeout and releases and §Model-specific notes, product 05 §Candidate — Tinkerer / Scientist, the security runbook and the refutations README are edited in place with no dated paragraph; one decision per item; `close-register.md` prepares the register dispositions; the publication locks are refreshed and `npm run publication:check` passes (D029).

**Criterion 27:** met. `npm test -- --review`: 41 passed, 0 failed, 84.19 s, 2 fresh tasks, recorded 2026-10-09T09:31:26Z at the current code identity (32a84b46…a637), composed from the same identity's earlier rows: the full run recorded 2026-10-09T09:24:03Z (1,469.27 s, 93 fresh tasks) passed 40 suites and failed `runner-fixtures` on its format-preflight case, which then passed alone (70.03 s, recorded 09:26:48Z) and is recorded as D045 with its diagnostic; `npm run test:docs`: 31 passed, 0 failed, 99.13 s, 31 fresh tasks, recorded 2026-10-09T09:29:51Z; `git diff --check` clean; no new dependency, the package changes being version pins. The VER-001 F3 loopback failure is diagnosed and removed (WO-188-D035), the console suite passed six consecutive loaded attempts after that repair, and both gates passed again after each repair.

self-review: found 37; fixed 26; recorded 11 (adversary: found 18, fixed 12, recorded 6, in `adversary.md`; improver: found 19, fixed 14, recorded 5, in `improver.md`)

Both workers were fresh `dotln-worker` agents given only the order and the
diff. The adversary's blocking findings (a JSDoc blind spot and a label form
the comment check missed, a wrong registry count in D028, a false clause in
product 05, and criterion 15 evidence taken before the overlay's final form)
are fixed; the improver's should-fix items (scratch removal that lost records
on a later failure, a preview that omitted walk-found repositories, a
submodule refusal that ran after removal and offered a remedy that could not
clear it, stale ignored-material wording, reserved lane names, a weak
regeneration counter) are fixed. Each recorded item names its reason in the
two review files and in the decisions.

Goal alignment matched. The material choices and what came of them: the
scratch boundary is the tracked tree and the intake lane, and the close now
removes undeclared repositories with a record of each head (operator
assumption 1); the comment cleanup covered every file outside the editions,
with the registered files' lines in a baseline that only shrinks; the
failed-command event was registered only after the live Copilot observation
showed the shared file loading with the event named. The one place the
outcome did not match the plan was criterion 22's byte clause, where the
expected fall had already happened in WO-196; the executor root's restated
rules were folded into its steps so the clause holds without dropping a rule.
No two-arm experiment was run: the one fork, how far the comment cleanup
reaches, was settled by the planning document's rule rather than by running
both arms (D025).

For the repair the traps named before acting were rule beating (passing the
two quoted link forms while the class stays open), a premature cause (the
first keep-alive hypothesis did not reproduce in a plain stall and was not
acted on until the traced loaded probe showed which expired timer ran first)
and scope creep (the two adjacent rewriter defects were fixed inside the bound
and nothing else was touched); the NoOp was leaving the parser out of the
runtime check. The outcome matched. One fork appeared, where the idle loopback
socket is closed, and both arms are recorded in WO-188-D035.

For the second repair the traps named before acting were rule beating (closing
`[empty]()` and the two-backtick span alone while the class, text the parser
does not render as a link, stayed open), a second reading of code beside the
parser's (a hand-written delimiter-run scanner, which would disagree with the
parser on spans across lines and on raw HTML) and scope creep (masking raw
HTML is adjacent to the finding; it was taken because it is the same rule at
the same parser positions and costs one list entry, and nothing else was
touched); the NoOp was keeping the backtick expression and adding the two
quoted cases. The outcome matched. No fork appeared: once the parser is the
oracle for links, its positions are the one way to read code the same way.

For the third repair the traps named before acting were rule beating (splitting
on the lone carriage return alone while the byte-order mark and the profile's
own line count stayed apart from the parser's), a second reading of the
destination beside the parser's (a hand-written escape decoder, which would
leave character references as the same finding) and scope creep (the
percent-encoded destination is the same class, but its fix touches path
containment, so it is boarded rather than taken); the NoOp was normalizing
line endings before rewriting, rejected because the published bytes must be
the committed bytes. The outcome matched. One fork appeared, whether to mask by
the parser's offsets or by its line and column; the oracle probe ran both
readings over the same inputs and both arms are recorded in WO-188-D043.

Limits: raw HTML anchors stay outside the body-link check, as they are for the parser (WO-188-D034); criterion 13 is judged by the order's narrowed reading; the comment
baseline and the home-path baseline are not compared with main's copy (D025,
D014); the body-link rewriter reads inline links by pattern in the prose the parser leaves outside code and raw HTML, and refuses rather than rewrites a link split across lines (D034, D039); a destination already percent-encoded in the source is encoded again (D044, FUP-a859aa6cad8f9c6c); the runner's format-preflight fixture failed once under the full review gate after this repair, with an empty nested-gate output, and passed alone, cause not established (D045, FUP-642d7a4beaed2272); a bare or
unreadable nested repository with no other file leaves unrecorded
(FUP-fb2a080cc9b597d0); the gate tree hash still refuses a committed
submodule (FUP-079f827e1b11eb1e). The meter's reopen candidate for WO-150-D003
reads a ceiling the budgets raised to 29,246; the measured executor cold start
is 27,882.
