# WO-200 FINAL-001 — final review

**Verdict:** pass. WO-200 restores the WO-107 profiling lane's provenance and watches its hash-pinned bytes where they change: the one comment WO-188 rewrote in `corpus/harness/profile.mjs` is back at its earlier bytes, so the four collector files hash to `1d618f2f…` again and all 72 committed records validate; the four files carry `dotln-pinned-bytes`, which the comment scan honors beside `dotln-generated`, and `.prettierignore` lists them; the lane's schema test is the machinery row `wo107-schema`, selected by `npm test -- --review` only when one of its five declared sources changed against the merge base; two tests compare the attribute set, the formatter ignores and the row's sources to the collector's own literal input list; and the classification case validates the historical fixture while requiring today's fixture to retain WO-107's exact declaration. All five criteria, as amended by [D002](../../evidence/WO-200/decisions.md#wo-200-d002--operator-authorized-classification-test-repair), hold at the integrated subject, which keeps every judged byte of the subject VER-001 passed. The verification sequence is one passing verification, which boarded one follow-up and one planning record that stay boarded ([D005](../../evidence/WO-200/decisions.md#wo-200-d005--verification-pass-ver-001-board-the-declaration-tests-textual-reading-of-the-formatter-ignore-list-which-a-negation-line-defeats), [D006](../../evidence/WO-200/decisions.md#wo-200-d006--verification-planning-receipt-044s-criterion-5-reopening-condition-for-wo-200-has-occurred)). This review found no new defect ([D008](../../evidence/WO-200/decisions.md#wo-200-d008--final-review-pass-final-001-at-the-integrated-subject-two-carried-in-register-rows-re-deferred-by-name)).

**Subject:** [`docs/work-orders/WO-200-pinned-collector-bytes-observed.md`](../../work-orders/WO-200-pinned-collector-bytes-observed.md) on branch `wo-200`, uncommitted over `main` at `73061e52b16d29de0621794f0662a0b50e60d775`. `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all name that commit, and origin lists no `wo-200` branch, so integration merged nothing ([D007](../../evidence/WO-200/decisions.md#wo-200-d007)).

- The gate code identity is `1acd288a7b1119d141c3413027731d51b8e9d647d7544562f6bcd682e5ff3cc7`, the identity VER-001 judged and the executor's review row covers. `gateCodeIdentity` returned it after integration. This review edited no code byte.
- The recorded `reportHash` of VER-001 (`sha256:256e9a11…`) equals the report's current SHA-256.
- The order differs from `main` by its heading's version label, `(v0.76.1)`, assigned at activation ([D003](../../evidence/WO-200/decisions.md#wo-200-d003)), and by the operator-authorized amendment D002, bound in `docs/control/plan-refutations.jsonl` as `PlanExecutionAmended` at 2026-10-12T02:44:07.147Z: step 8a, criterion 1's harness clause and the classification carry-in paragraph. The criteria are judged as amended.
- No ideation receipt exists for this order: `docs/evidence/WO-200/` holds no `ideation.md`. The nomination provenance is Entropy Reducer finding ER6-001 and its packet in REVIEW-006, both survivors of REFUTATION-007, re-measured by the 2026-10-10 entropy planning pass (its §5.1 weighs the NoOp and the declined alternatives and allocates FUP-8f0561e50754114f and FUP-069dff5d52d98e0d here), the 2026-10-11 standard pass (receipt 042's known issue became the anchor rule of step 7 and criterion 2) and planning receipt 044 (2026-10-11) with two known issues; all are judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry. This session ran every check the verdict rests on and read the executor's and verifier's transcripts at their labelled results, so no worker was needed.

**Process cost:** entry 196039 tokens; handoff 4287728 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 91bee8c2-5634-466e-b6c9-5413465f8cee`.

- Entry was observed at 2026-10-12T04:17:56.801Z after 4 steps and 3 commands.
- Handoff was observed at 04:41:44Z after 83 steps and 82 commands, after the document and review gates. It counts 3,937,628 cached input, 264,314 cache-write, 804 uncached input and 84,982 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The sample predates the result transition's inline document gate, the commit series and the publish; the response reports the later counter. Reasoning tokens and dollar cost are unavailable.
- Tradeoff: the fresh product gate was not rerun. The code identity is unchanged from the executor's passing review row and VER-001, the order names `npm test -- --review` at final review, and this review ran it in the handoff sequence, where it reuses the passing tasks at that identity. VER-001's nine list-mutation and seven selection probes were read at their transcript rather than re-run; the lane, the comment check, the fixtures, the coverage case, both selections and the hash were run here directly.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-200/FINAL-001.md`.

Read in full: the order with its known issues and carry-ins; VER-001; this order's D001 to D006; `handoff.md` and `self-review.md`; the control log `docs/control/orders/WO-200.jsonl`; the executor's `PR.md` draft (prose and meter); product 07 §Verification review and attack and §Independent workflows and integration; product 08 §PRs and commits and §Release-note edition; the four reader profiles and their balanced examples; receipt 044's WO-200 judgment; the 2026-10-10 planning document §5; WO-107 D010 and WO-105 D012, the decisions the carry-ins come from; WO-076's FINAL-001, PR body, release notes and D010 as the form of the previous final review. Read at their labelled results: the executor's `scratch-proofs.log` and the verifier's `verification-001-probes.log`; the four probe scripts were not read in full.

Reviewed: the complete implementation diff against `main`: `.gitattributes` (the comment and four rows), `.prettierignore` (four paths), `scripts/lib/comment-labels.mjs` (`commentFiles`: two attribute names in one `check-attr -z` call, the three-field loop, the renamed set and message), `scripts/lib/machinery-coverage.mjs` (one reasoned exclusion), `scripts/test-runner.mjs` (the exported `machinerySources` entry, the `protection` sentence and the row with `needsBuild`), `scripts/test-comment-labels.mjs` (the fixture case and the real-repository case), `corpus/harness/wo107-schema.test.mjs` (the runner import, the classification repair and the pinned-bytes case) and `corpus/harness/profile.mjs` (the one comment hunk); the write-backs to product 03 §Corpus policy, `corpus/baselines/SCHEMA-WO-107.md`, the README release claim, both publication locks and the order text; the regenerated indexes by their diff stats. Cross-checked against the diff: `digest`, `protocolHash` and `protocolLineage` in `profile.mjs` (lines 215 to 262), the runner's `isMainModule` guard, `spawnGit`'s use of the process working directory, the register's disposition and target rules in `scripts/lib/planning-followups.mjs`, and `integrateWorktree` and `verifyIntake` in `scripts/lib/worktree-integration.mjs`.

Lenses, and why:

- Correctness and tests: two parsers over source literals and an attribute loop whose field count changed.
- Design and coupling: three mirrored lists kept honest by one anchor, and the duplicated extraction D004 records.
- Maintainer in six months: whether the rule is written where the next person edits a collector.
- Release surfaces: final review is acceptance, and this order ships a patch with no component change.

Integration: `npm run worktree -- integrate WO-200` fetched `main` equal to the base, checkpointed the work, retained its named stash, re-applied it without an authored conflict and regenerated projections only. `docs/intake/` holds no ignored file, so no backup archive was needed. D007 records the carried-forward claims and the affected checks, all of which pass. No component version collides: local tags and origin both end at v0.76.0, which names the base commit, and neither lists v0.76.1; `package.json` and `package-lock.json` are not in the diff.

Disclosure: instruments under review also recorded this work. `scripts/test-runner.mjs`, which this order changes, produced the executor's review row this review consumes and the two `--list` selections above; `scripts/lib/comment-labels.mjs`, which this order changes, runs inside `npm run test:docs`; and `.prettierignore`, which this order extends, is read by `npm run format` and the format preflight. Each was also judged directly: the row's selection was observed from the runner's own listing in both gates, the comment check ran alone on the real repository, and Prettier's effective ignore was read with `--file-info` for each collector.

## Known issues and the ideation receipt

- **Receipt 044, criterion 2 (known issue):** the order's Cost line reads as if the drift class were removed for both named instances while WO-105's lane is a non-goal. Not triggered. No WO-200 handoff, decision or publication surface claims the class removed beyond the attributed files: the only "class" outside "classification" is D001's cause-class sentence, and this review's PR body and release notes state that the protection covers the four files `protocolLineage` names and that WO-105's lane keeps FUP-d093f77bd927f9dc. The review row failed on nothing it should have passed and passed on nothing it should have failed in VER-001's probes.
- **Receipt 044, criterion 5 (known issue):** occurred. WO-200 activated with D001 naming no consumer of the WO-107 baseline. VER-001 recorded it in D006 and boarded FUP-2eddaaaa1ea5d3c3 for the next planning pass; no acceptance criterion depends on it, and the other condition, WO-118's activation recorded as delayed by WO-200, is not observed. This review leaves the board as planning's.
- **2026-10-11 standard pass (receipt 042's known issue):** `protocolLineage`'s input list anchors the three lists. Held by criterion 2 below: VER-001's M4 and M7 fail until every list follows (M4b), and the executor's scratch proofs show the same.
- **2026-10-10 entropy pass carry-ins, FUP-8f0561e50754114f and FUP-069dff5d52d98e0d:** allocated here for the WO-107 lane; disposed under Register below by what the change did.
- **Depends on:** no queued order. WO-188 (closed, v0.71.0) made the comment edit this order reverses, and WO-107 (closed, v0.59.0) filed the lane; both are on `main`.
- **Operator-review assumption 1** (the lane passes at the activation base): did not occur. The executor's `schema-before.log` records 13 tests, 10 pass and 3 fail at the base, two of them `known collector revision` and the third the classification fixture drift D002 then authorized repairing.

## Criterion judgments

**Criterion 1:** met

- This review's bounded run of `node --test corpus/harness/wo107-schema.test.mjs` in the built tree (04:23:20Z to 04:23:21Z, exit 0): 14 tests, 14 pass, 0 fail.
- SHA-256 over the four files in `protocolHash`'s exact shape (`<name>\n<content>` joined by newlines) prints `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`.
- `git diff --stat 3e29dd9d -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs` is empty: all four are byte-identical to WO-107's commit. The tracked diff under `corpus/` is the one comment hunk in `profile.mjs` and the schema test.
- The schema test's diff is the runner import, the pinned-bytes case and the classification repair, which leaves `validateClassification` and the shared kernel fixture unchanged. VER-001's M8 and M8b (delete or change WO-107's live declaration) fail with "the live registry retains the exact profiling declaration"; M8c (an added sibling registration) passes, as D002 authorized.

**Criterion 2:** met

- `git ls-files -z | git check-attr -z --stdin dotln-pinned-bytes` reports `set` for exactly `profile.mjs`, `wo107-bounded.mjs`, `wo107-records.mjs` and `wo107-scenarios.mjs` under `corpus/harness/`.
- `prettier --file-info` reports `"ignored": true` for each of the four and `false` for `wo107-schema.test.mjs`.
- `machinerySources["wo107-schema"]` names the schema test and the four collectors, and the diff shows the list.
- Both new tests extract the anchor from `protocolLineage`'s own literal `names` array (`/const names = (\[[^\]]+\]);/` over the function's source); the schema case also requires `protocolHash`'s literal to match it in order. Each list is compared to that anchor by deep equality, never to another list.
- Each test is shown failing once in a scratch copy: the executor's `scratch-proofs.log` records both declaration tests failing for a missing attribute, a missing ignore line, a missing review source, a fifth lineage input, a removed lineage input and a fifth live-hash input, and VER-001's mutation probe records M1 to M7, M9 and M10 failing the schema case and all but M3 and M6 failing the comment-labels case, with M4b passing both. The handoff records the proofs.

**Criterion 3:** met

- This review's bounded `node scripts/comment-labels.mjs` (04:23:21Z to 04:23:23Z, exit 0) printed `PASS comment labels: 548 code files; 81 baselined lines; 0 failures`.
- `docs/control/comment-baseline.json` has no `corpus` entry and is byte-identical to `main`.
- This review's bounded `node --test scripts/test-comment-labels.mjs` (04:23:23Z to 04:23:24Z, exit 0): 7 pass, 0 fail, including the WO-200 fixture case, in which the attributed `collector.mjs` holding `// after D007.` is absent from `commentFiles`, the check passes, and a direct read of that file still finds its `decision-number` label.

**Criterion 4:** met

- `node scripts/test-runner.mjs --review --list` at this worktree, where the five sources changed against the merge base, names `wo107-schema` (with its protection sentence) and `runner-fixtures`; `node scripts/test-runner.mjs --list` prints 32 lines and does not name `wo107-schema` (both bounded, 04:23:24Z to 04:23:25Z, exit 0).
- The pinned-bytes case asserts the row is machinery and neither product nor document, and the WO-174 coverage case (`node --test --test-name-pattern='WO-174 every machinery suite' scripts/test-runner.test.mjs`, bounded, 04:23:24Z, 1 pass) accepts the row with its one reasoned exclusion.
- Both selections are recorded: the executor's `scratch-proofs.log` lines 2, 35 and 69 (absent at an unchanged scratch base, selected after a committed collector comment edit, absent from the plain selection with the same edit), and VER-001's selection probe S0 to S6 (selected for a collector or schema-test edit, uncommitted or committed; absent for an edit to the runner alone, `.gitattributes` alone or a new untracked `corpus/harness/` file; plain absent throughout).
- The executor's review row (`gateSelection: review`, recorded 2026-10-12T03:17:56.952Z) selected and passed `wo107-schema` in 1,494 ms.

**Criterion 5:** met

- D001 records the commit (`1aea2dea`), its date, both hashes, the 36 affected records, the red interval and the cause class. VER-001 established the write order from the plan amendment's read of `decisions.md` at 02:44:07Z, before `profile.mjs`'s first change at 02:44:31Z, with D001 preceding D002 in file and id order; this review adopts that inference as stated.
- Write-backs, in place: the product 03 §Corpus policy sentence follows the corpus entry-point sentence (`npm run publication:check` reports both editions CURRENT with 29 and 45 linked sections); `SCHEMA-WO-107.md` §Commands and retention has one dated line.
- Gates: the executor's `npm test -- --review` row at code identity `1acd288a…` (33 suites, 85 fresh tasks, 1,355.673 s, exit 0, 2026-10-12T03:17:56.952Z); VER-001's `npm run test:docs` at that identity (35 of 35, 04:13:29.730Z); this review's runs in the handoff sequence are in Executed checks below. `git diff --check` is clean before and after integration, and `prettier --check . --ignore-unknown` reports every matched file formatted.
- `package.json` and `package-lock.json` are not in the diff: no new dependency, and no suppression directive appears in the diff.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

None. Beyond re-running the lane, the comment check, the fixtures, the coverage case and both selections, this review recomputed the collector hash in `protocolHash`'s shape, compared the four collectors byte for byte with WO-107's commit, read the attribute set over every tracked file and Prettier's effective ignore for each collector on the real repository, confirmed the comment baseline unchanged, and ran the whitespace, format, publication, harness and release-surface checks before and after integration. VER-001's F1, the negation line in `.prettierignore` that defeats the textual formatter check while both declaration tests pass, is the one known gap; it is boarded with its repair rule (D005, FUP-984094128fe71900), breaks no criterion and no behavior `main` had, and a reviewer writes no behavioral fix. The variations not re-run here (VER-001's nine list mutations, seven selection cases, working-directory and formatter variations) were read at their transcript and are consistent with every result this review observed.

## Register

`npm run plan -- followups --touching` matched 16 pending rows at revision `2f7080a9…` by textual match; `npm run meta` left that revision unchanged, since D007 and D008 mint no follow-up. One `followups --apply` batch moved the register to `f8090707…`, after which 18 rows match (the two re-deferred rows now name this review). This review read every matched row and the two carried-in decisions in full.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-8f0561e50754114f (WO-107 D010) | deferred again | Allocated here for the WO-107 lane. Done: the lane's after-base rule (the `wo107-schema` review row judges a change to the pinned bytes), the classification self-test repaired to require WO-107's exact declaration while validating the historical fixture (D002), the collectors restored to protocol `1d618f2f…`, the rule recorded in `SCHEMA-WO-107.md`; D010's three checks pass at this identity. Not done, because each edits the pinned bytes this order declines to change: archiving the second collector revision with `validateProvenance` accepting archived revisions, labelling the registry self-test base-only, ending the comparison report with one newline. WO-105's rule stays on FUP-d093f77bd927f9dc. Settling would hide the remainder. |
| FUP-069dff5d52d98e0d (manual corpus lanes) | deferred again | Allocated here for the WO-107 lane, which now runs in the review gate when its sources change, with its duration in the gate row. Eleven corpus test files, WO-105's lane among them, still run in no gate by their orders' design and keep the row's condition. |

The other rows are textual matches whose seams this change did not open and whose conditions did not occur. FUP-4c4ad5ef3c88547f (WO-188 D048) names `scripts/lib/comment-labels.mjs` and this order: its comment-token item changes which tokens the scan refuses, with baseline consequences, which is outside the order's surfaces as declared (`commentFiles` and `DECISION_NUMBER`) and not a reviewer's edit; the executor did not take it up, no document gate has failed on a comment token, and it is left as it is (D008 records this). FUP-642d7a4beaed2272, FUP-d0a9719cc2e4ec55, FUP-de6162b279f66709, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a and FUP-f5f10101e717d59b name `scripts/test-runner.mjs` for behavior this order does not touch, and `runner-fixtures` passed in the executor's row. FUP-fb8cbeabbddef397 names the document gate's cost: this order adds two comment-labels cases to that gate, and the recorded document gates (131.8 s and 128.6 s) are under its 180 s condition. FUP-441469088613e52a, FUP-adf6621e7f958dd8 and FUP-fd05316b6030ef73 match product 03 or the README's release line; FUP-4b70089b028849f0 matches the register itself; FUP-9b0632b0ec72d168 and FUP-acfe4bfda716d8fb match generated projections. FUP-984094128fe71900 and FUP-2eddaaaa1ea5d3c3 (VER-001) are this order's own boards and stay for planning.

## Observations (not findings)

- The schema case and the comment-labels case each carry the roughly 15-line literal extraction; D004 records the trade against a shared helper that would widen the five-source contract. The collector is pinned and formatter-ignored, so a change to the literals is itself a hash change the row judges.
- The classification case names WO-107's commit by the abbreviated `3e29dd9d` beside the named `BASE` constant; an ambiguous prefix would make `git show` fail loudly.
- `prettier --file-info` reports `inferredParser: null` for the four ignored files, which is Prettier's report for a file it will not read.
- The regenerated `docs/work-orders/HISTORY.md` marks WO-076 released at v0.76.0: a sibling's publication, bookkeeping under product 07 §Independent workflows and integration, not a finding.
- `npm run meta` reports reopening candidate WO-150-D003 (executor cold start 28,112 bytes against 24,576). The same value appears in WO-072's and WO-076's reviews, so it is not a WO-200 observation.

## Release surfaces

`PR.md` carries the reviewed body above the meter the integration regenerated, written under product 08 §PRs and commits and the `prBody` profile: the resulting behavior first and why it matters, how the protection and the classification repair work, the limits a reviewer acts on with their decisions and register rows, and the validation with links relative to the body file. `RELEASE-NOTES.md` has the five sections of product 08 §Release-note edition, one physical line per prose paragraph. The proposed title is a headline with a gitmoji shortcode, sized by the change against the whole merged series and not by the previous title.

## Executed checks

Probes and checks ran under `node scripts/harness.mjs bounded`, one process at a time, at code identity `1acd288a…`; the worktree was only read until the writes this report names. Times are 2026-10-12 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage` at entry | 04:17:56 | 0 | 196,039 tokens, 0 subagents |
| Bounded `node --test corpus/harness/wo107-schema.test.mjs` | 04:23:20–04:23:21 | 0 | 14 passed, 0 failed |
| Bounded `node scripts/comment-labels.mjs` | 04:23:21–04:23:23 | 0 | PASS: 548 code files, 81 baselined lines, 0 failures |
| Bounded `node --test scripts/test-comment-labels.mjs` | 04:23:23–04:23:24 | 0 | 7 passed, 0 failed |
| Bounded `node --test --test-name-pattern='WO-174 every machinery suite' scripts/test-runner.test.mjs` | 04:23:24 | 0 | 1 passed |
| Bounded `node scripts/test-runner.mjs --review --list`, then `--list` | 04:23:24–04:23:25 | 0 | review names `wo107-schema` and `runner-fixtures`; plain (32 lines) does not name `wo107-schema` |
| Hash in `protocolHash`'s shape; `git diff --stat 3e29dd9d` over the four collectors; `check-attr` over `git ls-files`; `prettier --file-info`; comment baseline | before integration | 0 | `1d618f2f…`; empty; exactly the four `set`; ignored true for the four, false for the test; no corpus entry, equal to `main` |
| Bounded `git diff --check`; `prettier --check . --ignore-unknown` | 04:24:14–04:24:23 | 0 | clean; all matched files formatted |
| Bounded `npm run publication:check`; `node scripts/harness.mjs check`; `npm run release -- check-surfaces --local` | 04:24:23–04:24:29 | 0 | both editions CURRENT (29 and 45 linked sections); 34 generated surfaces; 57 passing lines |
| `npm run worktree -- integrate WO-200` | before 04:25:46 | 0 | no-op merge; checkpoint `refs/dotln/checkpoint/WO-200/6` (`dd19e332…`); stash `1c107ab6…` retained; D007 |
| `gateCodeIdentity` after integration | after integrate | 0 | `1acd288a…` |
| Bounded post-integration `npm run publication:check`; `harness check`; `check-surfaces --local`; `git diff --check` | 04:26:30–04:26:36 | 0 | same results as before integration; `.claude/` unchanged against `main` |
| `npm run meta` | before 04:34:15 | 0 | decisions index and register regenerated at revision `2f7080a9…`; reopen candidate WO-150-D003 (not this order's) |
| `npm run plan -- followups --apply` (two re-deferrals) | 04:34:15 | 0 | register `2f7080a9…` to `f8090707…` |
| `npm run format` | 04:35–04:38 | 0 | every script reported unchanged; the reports and decisions formatted |
| `npm run test:docs` | 04:38:13–04:40:22 | 0 | 35 passed, 0 failed, 128.23 s, 35 fresh tasks; the result transition's inline run at the filed bytes follows this table's last edit |
| `npm test -- --review` | 04:40:34–04:40:44 | 0 | 33 passed, 0 failed, 8.56 s, 1 fresh task (`format`), 32 tasks reused from the executor's 03:17:56 row at the same identity |
| `node scripts/harness.mjs usage` at handoff | 04:41:44 | 0 | 4,287,728 tokens, 0 subagents |

Repository writes: this report, `PR.md` and `RELEASE-NOTES.md`; D007's completion and D008; two register dispositions; and the regenerated projections, indexes, locks and meter the integration and `npm run meta` produced. No implementation source was edited. The check log stayed in the session scratch directory; the register request file was written to the ignored `.runtime/` path and removed after the apply.

Goal alignment:

- Traps: deferring to a passing verification instead of rereading the diff and re-running the lane and both selections; widening F1 into a repair the reviewer writes; settling the carried-in rows on partial discharge; taking the adjacent comment-token item as cleanup; sizing the PR title by the previous title.
- NoOp: failing would send a pre-existing textual gap through repair, verification and a 22-minute gate with every criterion already met, and would leave 36 committed records without a verifiable provenance on `main`.
- Outcome: matched. The criteria were judged from this review's own runs and VER-001's probes at the same identity, no new defect was found, the two allocated register rows were re-disposed by what the change did, and the reviewed work is preserved for the commit series.
