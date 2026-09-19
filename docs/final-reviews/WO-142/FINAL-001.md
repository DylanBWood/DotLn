# WO-142 FINAL-001 — Final review of the outstanding cleanup

**Verdict: pass.** All seven acceptance criteria hold at the reviewed subject, and Part E's two rows hold. The verification sequence is four reports: VER-001, VER-002 and VER-003 failed, each on real-use failures that passing fixtures had hidden, and VER-004 passed with every earlier finding resolved or owned. Nothing VER-004 passed was contradicted by what this review read or ran. This review found one thing that would have broken release close and fixed it before its gate: three new source files were untracked, and the code identity that release close consumes lists tracked files only. It closed criterion 5's outstanding operator clause, which VER-004 handed to final review, from the operator's statement and its own observation of the checkout. It met two limits in the new prune command and two items that lived only in report sentences, and boarded all four as decisions with follow-ups, which is the rule this order introduces. This reviewer changed no source, test, product document or generated surface; it staged three files, wrote three decisions, this report, the pull-request body and the release notes, and refreshed the generated indexes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"xhigh","source":"operator-attested"}

The harness version was read with `claude --version`. The model is the operator's `/model` selection at the start of this session. `CLAUDE_EFFORT` reads `xhigh`. No effective-model or effective-effort readback channel is claimed.

## Subject and integration

- The order: [WO-142](../../work-orders/WO-142-outstanding-cleanup.md) as amended by Part E, authorized by the operator's scope expansion recorded verbatim in [D010](../../evidence/WO-142/decisions.md#wo-142-d010--integrate-main-and-upgrade-node-and-typescript).
- Branch `wo-142`; `HEAD` = `main` = `origin/main` = `c5b2b0e7` after a fetch at about 17:02Z. Nothing newer exists to integrate. The latest tag is `v0.31.2`, which WO-084 published, so the staged minor `v0.32.0` is correctly timed under the existing classification.
- The tree: 199 tracked files changed (+7,670, −2,093) and 64 untracked at entry, all uncommitted; tree hash `806256e9` at the gate. The latest checkpoint at entry was `refs/dotln/checkpoint/WO-142/17`.
- The `final-review` dispatch was recorded by the prompt hook at 2026-09-19T16:52:33.730Z and was not repeated. `resume status` named this report's path and `final-review-result` as the one legal action.

**Ideation receipt.** The dispatch briefing names one; none exists for this order. `docs/evidence/WO-142/` holds no ideation record, so there was nothing of that kind to judge.

**Instrument disclosure.** Several instruments under review also observed this review, and each claim that rests on one says so. The regenerated hooks reserved this session's writer. The live-gate guard (row B3) judged this session's commands during its own gate: it admitted plain `grep`, `ls` and the bounded `git --no-pager … diff` form, and refused `node -e`, `awk` and two greps whose quoted patterns contained `[` or `*`, which is D018 reproducing as recorded. The observed-facts block (row B2) reported this session's one background task as `completed` with elapsed time fixed at 308,563 ms. The follow-up collector (row A1) processed this review's three decisions: the ordinary one created no feed row and the two with a `followup` created one each. `release prepare` refreshed the meter in the pull-request body while printing "no files changed", which is D020 reproducing as recorded.

**Fan-out.** Planned: at most three read-only helpers batched by Part, against a remaining budget of 20. Actual: none, because four verification rounds had already reverted, mutated and replayed the subject row by row, and the questions left for final review were small and specific. At 17:08:14Z `harness usage` reported count 0, cap 20, remaining 20, `exact-observed`, uncounted remainder unknown.

## What this review changed before its gate

`packages/skeleton/src/gate-evidence.mjs` computes two identities. `gateTreeHash` includes untracked files. `gateCodeIdentity`, which keys the passing `npm test` row that release close consumes without rerunning a suite, lists `git ls-files` for the working tree and the full committed tree for a revision; its own comment says to stage new source files before the reviewer's gate. At entry three intended source files were untracked: `.node-version` (row E1), `packages/skeleton/src/live-reactor-driver.ts` (row B13) and `scripts/lib/harness-prune.mjs` (row D1). A gate run in that state would have recorded a code identity that omits them, and the committed identity at close would have differed. They were staged with `git add` before the gate; no bytes changed. The four verifiers' gates covered these files through the tree hash, so no verification result is affected.

## The review gate

| Check | Result |
| --- | --- |
| `npm test -- --review`, Node 26.9.0, once, after staging | **35 passed, 0 failed, 307.84 s, 79 fresh tasks, exit 0.** Row recorded 2026-09-19T17:01:30.723Z, code identity `b9bd4886`, tree hash `806256e9`, execution mode fresh, 0 reused suites |
| `npm run test:docs` | recorded under Document gate below |
| `git diff --check`; `git diff --cached --check` | recorded under Document gate below |

VER-003 compared this selection with plain `npm test` and found all 21 of its suites included. The duration sits with the four earlier runs on this subject (303 to 311 s).

## Acceptance criteria

| # | Criterion | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Rows file complete, one state each, reverted-subject evidence, returns bounded | **met** | [rows.md](../../evidence/WO-142/rows.md) lists all 51 groups plus E1 and E2. One return, B12(b), not starred, owned by D002; A7 not reproduced with its pre-edit references listed. VER-001 to VER-004 between them reverted or mutated every fixed row group; the two survivors VER-004 records are an equivalent mutant and an unreachable guard. The rows file labels which evidence is source inspection only |
| 2 | Feed fixture both forms; B17 rule in three roles; untriaged count recorded | **met** | The fixtures pass in the gate. The rule is in this reviewer's own loaded role text. On the integrated tree `npm run plan -- followups` read 428 total, 91 pending, 10 untriaged, recorded in [D021](../../evidence/WO-142/decisions.md#wo-142-d021--record-the-operators-prune-apply-and-the-integrated-tree-observations) beside 364 before the planning pass and zero after; after this review's decisions it reads 430, 93, 12 |
| 3 | A title-stamp-only order stays carried | **met** | VER-001's real-data probe; `plan-refutation` passes in the gate; `scripts/lib/plan-direct.mjs` unchanged since |
| 4 | `harness check`; two-advisory and read-list fixtures; four refusals still refuse | **met** | The harness suites pass in the gate. The live-gate write refusal fired on this session's own commands. The guard source was read in full: the nine earlier programs keep their vocabulary and each new program is bounded |
| 5 | Prune preview deletes nothing; apply removes exactly the listed paths; operator run recorded | **met** | Fixtures pass in the gate; two verifiers showed identical full listings across a real preview. The operator clause is recorded in D021, below |
| 6 | Write-backs land; `publication:check` passes | **met** | VER-001 to VER-004 read each write-back; `publication` runs inside the document gate below |
| 7 | `npm test` once at final review; `test:docs`; `git diff --check`; no new dependency but E1's; no new suppression | **met** | The gate above and the document gate below. VER-002 diffed the lockfile: only TypeScript 7.0.2, its twenty optional platform packages, `@types/node` 26.6.2 and `undici-types`. VER-002 scanned all added lines for suppressions and test skips: none |

**Part E.** E1: every manifest declares `engines.node` `>=26.0.0 <27`, `.node-version` reads 26.9.0, TypeScript is pinned at 7.0.2 in the root and skeleton manifests, and this review's gate ran under Node 26.9.0. E2: the fenced WO-084 paths show no diff against `main`, and no tracked verification, final review or receipt of another order changed; the only tracked changes under the report, receipt, evidence and control directories are the control projection, the append-only refutation log, the edition selector and row C7's README paragraph.

## Criterion 5's operator clause

VER-004 O3 left this for final review. During this dispatch the operator stated that they ran `harness prune --apply` on this worktree after verification and will run it on `main` after release close. This review then observed, without taking the statement on trust: the recorded previews listed 100,586,859 and 100,589,334 bytes; now the dead cache and the one unpinned snapshot are absent, the listing shows 660 bytes of markers from sessions that ended since, and seven pinned snapshots remain. The operator's own output was not captured, so the exact deleted total is unknown; the two absent paths account for 100,586,859 bytes. `main`'s pinned snapshot has the deleted snapshot's name and is intact, because a pin resolves under its own checkout. The dead cache lived in the shared Git directory, so it is already gone for `main`. All of this is in D021.

## Verification sequence

| Report | Verdict | What it established |
| --- | --- | --- |
| [VER-001](../../verifications/WO-142/VER-001.md) | fail | Four rows passed their fixtures and failed in real use: the index refresh pushed the prompt hook past its 12 s limit (A4 ★), background Bash tasks and native notices never reached the journal (B2 ★), seven read forms admitted at activation were refused (B3), and a replaced assertion was weaker than the one it replaced (B14). Fourteen non-blocking findings; three older defects boarded |
| [VER-002](../../verifications/WO-142/VER-002.md) | fail | Repair 001 held except for a native `killed` status left non-terminal and thirteen further read forms still refused: the repair had restored the quoted examples, not the class. Part E judged met |
| [VER-003](../../verifications/WO-142/VER-003.md) | fail | Repair 002 held, with read parity shown over 55,949 real commands, except that a finished task was demoted to `unknown` by a later statusless observation, live and on 35 replayed tasks |
| [VER-004](../../verifications/WO-142/VER-004.md) | pass | Repair 003 holds live, under thirteen mutations and under replay: 0 of 632 finished tasks misstated, against 41 for the previous observer |

Each failure is the kind a fixture cannot find and only real input can, and each repair answered with the class and a corpus. The reports disclose their instruments, their own errors and what rests on helper evidence alone. This review relies on them for row-level reversion and did not repeat it.

## Judgments on carried items

- **VER-001 O9** observes that the order fences worker-input changes while rows B4, B7 and B15 require them. The order is inconsistent there and the executor followed the rows. The three changes are narrow, named in the rows and listed in the release notes; no further action.
- **VER-001 O12** notes that seven inputs are narrowed where the order counts four. The release notes and the pull-request body say seven.
- **VER-002 O7**: feedback revision 002's independent verifier shared its harness and model family with the repair actor. It is a recorded property of that edition; the `feedback-evidence` check passes and neither repair 003 source is a feedback input.
- **VER-004 O1**: one unpinned guard in the notice parser is unreachable on every real envelope in 1,748 local rows. A coverage note, correctly not a finding.
- **D007** carries a follow-up that E1 then discharged. The register already shows it settled with D011 and D014 as the reason, so the feed is not carrying a finished action.

## Boarded at final review

Row B17's rule applies to this role. Nothing below is left only here.

- **[D022](../../evidence/WO-142/decisions.md#wo-142-d022--board-up-two-prune-limits-met-at-final-review), two prune limits.** An apply recomputes the whole plan once per candidate, and each plan makes a `gh release view` and a `git ls-remote` call for every retained lane. Measured on `main`: one read-only plan takes 21.8 s and lists 58 candidates, so an apply is about twenty minutes as an upper estimate. It is fail-safe. No check met it because fixtures inject the publication observer and this worktree had no retained lane. Separately, this review's gate added 27 target lanes and 20 installation receipts to the checkout's ignored lane (362 to 389, 271 to 291); prune treats each receipt as a pin, so six of seven snapshots here can never be listed. The writing suite is unidentified.
- **[D023](../../evidence/WO-142/decisions.md#wo-142-d023--board-up-two-items-that-lived-only-in-report-sentences), two items that lived in report sentences.** All four verification reports carry, as a limit, that neither worker CLI has accepted row B4's `anyOf` result schema live. The schema has the conservative shape, which is an inference, not an acceptance. And the comment describing `shellWriteTargets` was left above `readCommand` in `packages/skeleton/src/harness-command.ts`; it was not moved because that file feeds the generated hook bundle and a comment edit would cost a regeneration and a fifth authority revision.

Failing the review over D022 was considered and rejected: criterion 5 and the row's required result hold, both limits are fail-safe and on demand, and the meter puts the four verification rounds at about 117 million tokens, which is the scale of what a fifth cycle would be weighed against.

## Clean room over the whole subject

A screen of all 38,610 added lines and new-file lines for home-directory paths, email addresses, URL hosts, credential shapes and the word "internal". No home-directory path and no credential shape. Every email address is an `.invalid` fixture except nine occurrences of an assistant no-reply address, all inside the three recorded feedback event streams, where they are evidence quoting the trailer the attribution check refuses. URL hosts are the npm registry, GitHub, `example.invalid` and the Node documentation. The twelve "internal" lines concern symlinks inside a snapshot, fixture bytes and the contribution guide's clean-room sentence. No `docs/intake/` content was opened. Reads of the `main` checkout were counts, a manifest pin and a read-only prune plan. No stop condition.

## Document gate

| Check | Result |
| --- | --- |
| `npm run test:docs`, Node 26.9.0, with this review's decisions, pull-request body, release notes and report in place | **19 passed, 0 failed, 15.09 s, 19 fresh tasks**, including `index`, `publication`, `meta`, `plan`, `format`, `release-surfaces`, `harness` and the four evidence checks |
| `git diff --check`; `git diff --cached --check` | both clean, exit 0 |
| `node scripts/test-runner.mjs --only github-body`, after the pull-request body was rewritten | 2 passed, 0 failed. This suite runs in the product gate, which preceded the rewrite, and it exercises the checker's fixtures; the publish step validates the committed body itself |

The gate ran after `npm run meta` and the index refresh. Only this table was filled in afterwards, which the procedure admits for reports after a passing gate.

## Goal and handoff

Mission and critical path: the operator asked for one budgeted pass that clears logged issues nobody owned, and the feed and the role rule are what keep that backlog from re-forming. NoOp at this step would have been to pass on VER-004 alone, which would have shipped a gate row that mismatches at release close and an unrecorded operator clause. Naive Interventionism would have been to tune deletion-safety code, or move a comment through the hook bundle, after verification ended; both were declined and boarded. Against the traps: no check was loosened to reach a pass (rule beating, drift to low performance); the criteria were judged as written, including the one the operator had to discharge (seeking the wrong goal); the two new feed rows are the designed cost of the rule, set against a fifth cycle (commons, escalation); the boarded items carry measured reopening conditions, so they do not rest on a later reviewer noticing (shifting the burden). Policy resistance and success to the successful have no bearing here.

Usage at 2026-09-19T17:08:14.934Z, source `claude-transcript-message-usage`, scope dispatch: input 146, cached input 12,492,627, cache writes 240,276, output 68,382, total 12,801,431 tokens; reasoning tokens and cost unknown; 85 steps, 48 commands; subagents 0 of cap 20, exact-observed. Report writing, the document gate, completion and publication follow this cutoff.

The reopening observations the order names remain the benefit test and are not claimed here: the next planning pass's feed size, the next refutation's carried set, and the next reviewer session's gate-time commands. For the last, this session is one early sample: during its gate the guard admitted its plain reads and the bounded Git form, and refused four commands, two by design and two through D018.
