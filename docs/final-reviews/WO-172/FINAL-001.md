# WO-172 — FINAL-001

**Verdict:** pass. All eleven criteria are met on the integrated subject. Three read-only reviewers found seven low-priority items outside the criteria, in the shell observer and `plan failures`. None breaks a criterion's written text, and a reviewer writes no behavior, so they are boarded as one follow-up ([D059](../../evidence/WO-172/decisions.md#wo-172-d059--final-review-pass-and-the-items-it-boards)). The review also corrects three evidence statements that said more than their sources hold ([D060](../../evidence/WO-172/decisions.md#wo-172-d060--correction-evidence-said-more-than-the-observer-does)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.285","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 84240 tokens; handoff 21891787 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-172 and allocated this path. The actor values are this session's:

- Claude Code 2.1.285 (`claude --version`);
- model `claude-opus-5-5`;
- effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Both counters have dispatch scope, and dollar cost and reasoning tokens were unavailable:

- Entry cutoff: 2026-09-29T23:18:20.176Z.
- Handoff sample: 2026-09-29T23:50:14.657Z, before this report was filed.
- The handoff total is mostly cached input (21,540,354 tokens).

Fan-out plan: three read-only reviewers out of the 20 remaining slots, one per group of criteria, with no descendants. The harness observed 3 admissions, all linked. The task notifications report these subagent token counts:

- 197,261 for criteria 1 to 5;
- 204,481 for criterion 11;
- 212,325 for the documents and privacy review.

The root was the only writer. Each reviewer found the repository's status unchanged after its run.

## Subject, integration and evidence

The original base is `8c28f47900ec796b827cc8856be1310aebd7408d`.

- **Integration.** The fourth repair's canonical `worktree integrate`, under the operator's scope expansion ([D047](../../evidence/WO-172/decisions.md#wo-172-d047--operator-authorized-integration-of-main)), fast-forwarded the uncommitted branch to fetched main `fee6ee4c4e98f8b9a9ff80c916e8543688af0ff4`. It kept checkpoint `refs/dotln/checkpoint/WO-172/14`, the named stash `2d820fd0` and the intake archive.
- **No second integration.** At this review `git ls-remote origin` still reported main, `origin/main` and HEAD at `fee6ee4c`.
- **Carried-forward claims.** I completed [D048](../../evidence/WO-172/decisions.md#wo-172-d048)'s carried-forward claims. Main changed none of this order's source or test files. VER-004 and VER-005 judged all eleven criteria on the integrated bytes, so no criterion is carried across bases.
- **Versions.** Skeleton 0.45.2 sits above main's 0.45.1, with the console pin following. The application target is v0.56.2, above v0.56.1; `release prepare` reports it current against origin's tags. Authority edition 010 is selected.
- **Moved roadmap lines.** The twelve roadmap lines the integration moved appear verbatim in the evidence README, and product 06 equals main.

The numbered verification sequence is complete and unchanged:

- [VER-001](../../verifications/WO-172/VER-001.md) failed criteria 3 and 9, on F1–F3:
  - F1: the Entropy Reducer count used the filing time, not the review's end.
  - F2 and F3: the survey lacked role comparisons and took context from after each send time.
- [VER-002](../../verifications/WO-172/VER-002.md) confirmed F1–F3 repaired. It failed criterion 9 on F4 (Claude question-tool answers unread) and F5 (one injected prompt counted). It also boarded an impossible-date bound and two evidence overstatements.
- [VER-003](../../verifications/WO-172/VER-003.md) confirmed F4 and F5 repaired. It failed criteria 9 and 11 on:
  - F6: quoted output produced guidance;
  - F7: process-substitution diagnostics were missed;
  - F8: lane growth repeated an answer;
  - F9: three known phases were left unnamed.
- [VER-004](../../verifications/WO-172/VER-004.md) confirmed F6–F9 repaired. It failed criterion 11 on F10: concurrent observers answered and counted one failed use twice, reproduced live.
- [VER-005](../../verifications/WO-172/VER-005.md) passed all eleven criteria. It confirmed F10's repair live in the host and with mutants.

I recomputed their SHA-256 values, and all five match the `reportHash` values of their `VerificationCompleted` events.

A temporary-index snapshot of the working tree, untracked files included, differs from checkpoint 22 (this dispatch's) only in the generated control projection, the order's control segment, the work-order index and this review's documents. Source, test and package bytes are those VER-005 judged.

I reviewed the full subject diff against `fee6ee4c`:

- `scripts/lib/plan-failures.mjs` and the `failures` and `start` changes in `scripts/refute-plan.mjs`;
- the meter in `scripts/lib/meta.mjs`;
- the classifier and observer in `packages/skeleton/src/harness-command.ts` and `harness-host.ts`;
- the regenerated hooks and manifest;
- the eleven other orders' decision records;
- the order, its cited sections, the handoff, the evidence README and decisions D001–D058, and every write-back.

The three reviewers covered these groups:

- criteria 1 to 5, the planning code and fixtures;
- criterion 11, the observer, generated hooks, `CLAUDE.md` and budgets;
- criteria 6, 7, 9 and 10 with the other documents, and a clean-room and privacy screen of all 113 subject files.

## Criteria

**Criterion 1:** met.

- `npm run plan -- failures --all --until 2026-09-28T04:00:00.000Z` reports:
  - 86 failed verifications and 10 failed final reviews;
  - 99 repairs;
  - 117 orders made ready, 54 of them with a failed first verification;
  - 61 corrections;
  - one waiver;
  - 25 amendments, with one withdrawal and three overridden holds.
  That is 286 items.
- The five corrections above the inventory's 56 are WO-060-D008, WO-116-D013, WO-116-D014, WO-173-D013 and WO-173-D016. All are dated 2026-09-28 and absent at `5f3849ec`, as [criterion-1.json](../../evidence/WO-172/criterion-1.json) and D003 record.
- The reviewer walked every cursor for four windows. Each item was visited exactly once, in export order, and the largest page is exactly 8,192 bytes.
- The fixtures cover each kind, timeless events and a correction by `misread` alone.

**Criterion 2:** met.

- The default window opens at receipt 034's completion, `2026-09-28T17:20:38.855Z`.
- The start block computes to 647 bytes on this repository.
- The fixture covers zero counts, the 1 KB bound and a branch that opens with one reason line. Nothing that can refuse runs before the branch switch.
- I did not run `plan start`, which opens a branch.

**Criterion 3:** met. The count is 23 against REVIEW-003's `endedAt`, and `unknown` with no filed review. VER-001 F1 stays repaired.

**Criterion 4:** met.

- All 124 closed orders carry the four fields.
- The health line reads "first verification failed in 5 of the last 8 closed orders", chosen by close time.
- The cost table measures 60,229 bytes in memory against 65,536.
- `meta --check` passes.

**Criterion 5:** met. The reader agrees with the hand classification on 238 of 241 operator-naming dispatches at the base and 241 of 241 now. It counts each dispatch at most once, and no order counts a lifecycle override or correction beside its own override or correction event.

The held-out 70 of 80 stays FUP-b3454d6ce3594ef3. One observation goes to the next pass: with the reader, the meter's shifting-the-burden series (5, 3, 0, 1, 4, 15) flags one reopen candidate that the WO-170 count would not. The order adds no trap rule; the meter measures and a pass decides (D059).

**Criterion 6:** met.

- The 16 paraphrased fields are the only bytes changed in the eleven other orders' decision records. Substituting the old dispatch strings reproduces HEAD byte for byte.
- Both digests of each field match. Each new value passes `validDispatch` and is 52 to 149 characters with a control prefix.
- The fifteen candidates are judged, two bound fields are held with reasons, and the four moved register rows grew append-only.

**Criterion 7:** met.

- Product 07 grows 351 bytes over main's version: 215 for the planning sentence and 136 for the read observer's.
- The sequence's interim paragraph is removed, and `followups.md` names the command.
- `publication:check` passes.

**Criterion 8:** met.

- `npm test -- --review` exited 0 by reusing the complete passing row at the current code identity, and no suite started. The row: 38 suites, 762.84 s, recorded 2026-09-29T22:57:53.942Z, evidence `host-gate:a893dcbf913ee731807aa0120c66bfd8371ca30217e5b638114ea80c1a5a6142:npm test`. This review changed no source or test byte, so the identity holds.
- `git diff --check` is clean, and so is the untracked evidence once its README's trailing blank line was removed (D060).
- Dependencies change only in skeleton's version and the console's pin, and no suppression directive was added.

**Criterion 9:** met.

- The survey files are byte-identical to VER-004's subject, where the joint comparison regenerated from the frozen record.
- The privacy screen compared 3,711 operator-side items from the retained Claude and Codex transcripts against the subject. It found no 8-word or 40-character overlap beyond agent-written text.
- Runs of four to six words shared with operator messages remain in D013, D021, D022 and one idea-ledger line; none reaches seven words (D059).

**Criterion 10:** met.

- The fourteen shapes and their test are unchanged since VER-004, where 30 of 30 examples passed against RxJS 7.8.2.
- No shape shares a 30-character or 8-word span with the operator's messages.
- The checks show stream behavior, not operator confirmation.

**Criterion 11:** met.

- The Shell rule is 390 bytes, and `CLAUDE.md` changes only by that section.
- The reviewer ceiling is the measured 24,788 bytes plus 4,096, with a dated acceptance.
- A fresh `tsc` compile of both changed modules equals `packages/skeleton/dist` and the pinned runtime, and `harness check` passes.
- The observer writes nothing to stdout or stderr. Every probe exited 0, and rows hold the class, scope and a hashed use.
- Live in this session's host, a command zsh refused was answered once at the next observed call. A reviewer saw the same for its own probe, with no claim directory left.
- F6–F8 and F10 stay repaired under the reviewer's probes.

## Findings and follow-up dispositions

[D059](../../evidence/WO-172/decisions.md#wo-172-d059--final-review-pass-and-the-items-it-boards) boards seven reproduced items as FUP-01e80ba5ce62c72a:

1. A malformed JSON block in a working-tree decisions record makes `plan start` and `plan failures` print the parser's message, which quotes part of that decision.
2. One observed call can hand up to 900 characters for each of at most four earlier failed commands, besides its own 900. A reviewer measured 3,302 characters.
3. A builtin's bad-option guidance takes its subject from the printed line, corroborated by one character of an option word, so up to 120 characters of printed output can enter the guidance.
4. Bad-substitution and bad-math lines are corroborated by the command merely holding `${` or `((`.
5. Deeply nested parentheses classify in quadratic time (20 KB took 4.1 s), and unanswered failed results are classified again at each observed call, against a 15 s hook timeout.
6. A hook killed between its append and its release leaves a claim directory that no prune path removes, and a corrupt claim record ends that call's other answers.
7. Every observed call scans the lane before knowing whether a failed result holds a diagnostic, about 17 ms with a 6 MB lane.

Items 2 to 4 each need output that prints a zsh-form line the command did not cause, or several failed commands in a row. They cost context, never a refusal or a row holding command text. VER-004 boarded the same classes of marginal case, and FUP-d90c46abf5658272 holds them.

[D060](../../evidence/WO-172/decisions.md#wo-172-d060--correction-evidence-said-more-than-the-observer-does) corrects three evidence statements:

- the observer's context bound and its "only what the command itself wrote", in [shell-diagnostics.json](../../evidence/WO-172/shell-diagnostics.json) and the evidence README;
- the README's 215 bytes, which is 351;
- the README's sixteen minted rows, which are 23.

The handoff's criterion 11 line and D038 keep their filed words.

Dispositions of the rows this change touched, from `followups --touching` (43 matched):

- **Settled on the verification sequence** (F1–F10 and the boarded bound and evidence repairs): FUP-e701c2768c38748f, FUP-eb6f41ea2dcbabd6, FUP-42079a068929081b, FUP-a87bd8daf6adf223, FUP-07fbe74aa4440d5e, FUP-e42645118711be72, FUP-320a0f6be5198baa, FUP-86ac0c6cccd9c541 and FUP-4a5df0114c411df3.
- **Settled because their allocation landed:** FUP-80a2f11e1e0874d8 (criterion 5), and FUP-abfdb650f125a77f and FUP-ba35c0b5ae47cfb8 (criterion 3).
- **Settled, WO-172's part discharged:** FUP-b86a71ffd5b1e334. The paragraphs left product 06 for this order's evidence README. D012 had named the decisions record; D048 cites the README, which keeps them out of 06 as the rule intends.
- **Opened for planning:**
  - FUP-71fc2efc208f597a: its reopening condition occurred, as D008 found.
  - FUP-5e2f4ce16f9e8be1: WO-172 commits 1,803,819 bytes of evidence, 714,550 of them ten authority editions of which only 010 is selected.
  - FUP-f1c7a256bec46737: kept open with the reviewer ceiling's new measurement.
- **Deferred again:** FUP-9625ca888d7d08f5 and FUP-e55e258d37cb3f20. This order edits `plan-receipts.mjs`, `planning-followups.mjs` and `refute-plan.mjs` only to export a pattern and the page bound and to add the command.
- **Left as they were:**
  - the order's own planning nominations: D006, D008 to D010, D013, D014, D018, D033, D052, D053 and the map candidates;
  - rows matched only by path: the harness-host rows, the meter and closeout residue, the sequence size, the WO-086 hardening items and the others.

Two items are recorded, not dispositioned:

- The register's append-only revisions still hold earlier dispatch text in seven rows, all present at HEAD. D008's follow-up FUP-f287a595299249ff routes them.
- Ignored intake keeps two WO-172 notes that main's checkout lacks. The closeout helper reconciles worktree intake before removal.

## Executed checks

- Final product row: `npm test -- --review`, executed, exit 0, reused as recorded above.
- `npm run test:docs`: 23 passed, 0 failed, 14.35 s, 23 fresh tasks, run once this report existed.
  - The documents reviewer's run before the report also passed 23 of 23.
  - My first run with the report in place failed only in release-surfaces, which read a backticked `<file>` placeholder in the release notes as raw HTML, and in its eight dependents. Rewording the placeholder fixed it.
  - Completion runs the gate again inline.
- Also passing:
  - `npm run plan -- check`;
  - `npm run meta -- --check`;
  - `node scripts/harness.mjs check` (31 surfaces);
  - `node scripts/authority-evidence.mjs --check`;
  - `npm run publication:check`;
  - `git diff --check`;
  - `npm run release -- prepare` (target current, origin tags).
- The reviewers' focused runs passed: 2 of 2 WO-172 meter cases and 2 of 2 plan fixtures.

## Judgment and publication

[D059](../../evidence/WO-172/decisions.md#wo-172-d059--final-review-pass-and-the-items-it-boards) compares this outcome with the mission, all eight system traps, Naive Interventionism and NoOp.

The observed outcome:

- A pass reads `plan failures` and meets 286 counted failures to 2026-09-28 by one command, where the last pass rebuilt them by hand.
- The meter carries them per order.
- An agent is told what zsh refused, once, at the call or the next one.

Failing the review over the boarded items would start a fifth repair cycle with every criterion met, and leaving them as report prose would lose them. The tradeoff: reusing the complete row at an unchanged code identity saved a 762.84-second rerun, at the cost of not re-executing the suites under this session.

Reviewed PR title: `:chart_with_upwards_trend: Show each planning pass the failed judgments, repairs and corrections since the last one, so failures get a route instead of a hand count`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to adding or updating analytics or tracking code, which is what the order adds for planning.

[PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the upgrade notes and limits. A pass authorizes committing this reviewed state, pushing only `wo-172` and opening its PR. The helper supplies the post-merge release-close handoff.
