# WO-187 FINAL-001 — final review

**Verdict:** pass. WO-187 asked that verification become the implementation review and the attack, that the executor self-review with a fresh adversary before each completion, that the verify briefing carry an order's known issues, that final-review findings be classed and counted, and that spawned workers run at a pinned model and effort. This review judged the eight criteria, with criterion 6 as the operator's recorded direction amended it, against the subject integrated with `main` at `602f7e83`. All eight are met and nothing blocking was found. Seven low findings are boarded as follow-ups: three were present in the verified subject, and four ask for something the order did not set out to do ([D052](../../evidence/WO-187/decisions.md#wo-187-d052--pass-the-integrated-subject-and-board-seven-low-findings), [D051](../../evidence/WO-187/decisions.md#wo-187-d051--ship-the-sub-agent-duties-as-filed-and-board-a-separate-improver-sub-agent-for-planning)). A fresh `npm test -- --review` at the integrated identity passed 39 of 39 suites. This review also made two process errors of its own, recorded in D050 and D053; one of them filled the host's disk for a few minutes.

**Subject:** [`docs/work-orders/WO-187-verification-attacks-and-reviews.md`](../../work-orders/WO-187-verification-attacks-and-reviews.md) on branch `wo-187`, uncommitted, integrated during this review from base `c44ba6c60d7a3049f15edc4ce106b2dcc518b551` to `main` at `602f7e83190cb4b8e8b9521feee8262e00fff485` (WO-123, v0.67.0). The dispatch checkpoint is `refs/dotln/checkpoint/WO-187/21` (`8b813032`), and the integration checkpoint is `/22`.

- The reports: the recorded `reportHash` of VER-001 to VER-005 each equals the report's current SHA-256.
- The order: it differs from `main` in its heading's version label, in criterion 6 and in one sentence of its first known issue. The criterion 6 change is the operator's direction of 2026-10-05, recorded in D003 and bound by a `PlanExecutionAmended` row in `docs/control/plan-refutations.jsonl`. `npm run plan -- check` exits 0.
- Ideation: no ideation breakout receipt applies, and the evidence folder holds none. Operator directions given during execution and verification are recorded in D003, D013, D019 and D042, and those given during this review in D051.
- Carried bytes: every non-document path that differs from checkpoint 18, VER-005's subject, is a path upstream also changed, and the order's five new source files hash equal to that checkpoint ([D048](../../evidence/WO-187/decisions.md#wo-187-d048--integrate-main-at-602f7e83-during-final-review), [D049](../../evidence/WO-187/decisions.md#wo-187-d049--integration-resolutions-the-skeleton-retime-and-the-integrated-gate)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.291","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. During the review they asked whether the sub-agent duties match what they had asked planning for, confirmed that an adversary at the executor's and the repair's completion is what they asked for, and chose to ship as filed and board a separate improver sub-agent (D051). They added that this was no direction to fail the review, and that if it did fail the boarded item should join the repair. They made no choice about the verdict. The harness version comes from `claude --version`. The model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it; it is the selected effort, not the effective one. The order recommends `reviewer any`. The fourth repair ran on the same model as this review, in a separate session; VER-005, which judged that repair, ran on a different one.

Subagent plan, stated before the first spawn: one fresh `dotln-worker` adversary over the order and the whole integrated diff, zero descendants, and one further slot in reserve, against the cap of 20 with 0 observed at entry. One was launched by type with no model override; the reserve was not used. The host reported 308,683 worker tokens, 132 tool uses and 1,607,429 ms when the worker reported, and 309,040 tokens and 2,200,635 ms when its own last background wait ended. The worker reported its model as claude-opus-5-5 and no effort. The counter at handoff reads 1 subagent, exact-observed, with 19 remaining and an unknown uncounted remainder.

**Process cost:** entry 91968 tokens; handoff 45189426 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 5acf83cc-ea9b-4353-8a7b-45abc5de1c58`.

- Entry was observed at 2026-10-06T13:42:43.805Z.
- Handoff was observed at 14:39:36.093Z, after the product gate, the register batch and D048 to D053, and before this report, the document gate and the result transition. It counts 44,509,732 cached input, 494,844 cache-write, 282 uncached input and 184,568 output tokens over 181 steps and 122 commands.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The worker's tokens are the host's figure and sit outside the root total.
- The largest waits were the fresh adversary (1,607 s to its report) and the product gate (1,348.92 s). The gate started 1,185 s after the adversary was dispatched and ran alongside it for 422 s. The adversary reports that the live gate refused writes to its scratch directory, so its comparison of `plan start` and `resume` against `main` did not run.

## Goal-aligned judgment

The mission contribution is a verification that finds what final review used to find, and a count that says whether it does. The count starts with this report.

- **Rule beating and seeking the wrong goal:** VER-005's pass was not taken as the goal. This review integrated `main`, re-derived the checks the integration could move, ran the gate fresh and had a fresh worker attack the whole diff. The seven findings are classed by where they arose, not so as to flatter the first measured count.
- **Policy resistance and fixes that fail:** four repairs of this order each opened a new defect in the readers until the fourth removed the prose inference. None of the seven findings loses a record, a count or a carry-in in a supported workflow, so none returns the order to a fifth repair. The basis for routing the nearest one, F2, is stated with it.
- **Shifting the burden:** the operator answered one question about intent, once, and D051 carries the remainder to planning. Byte figures are settled within the recorded direction and none is put to the operator (D019).
- **Drift to low performance:** the two evidence editions the new base staled were re-minted, not relabelled, and the executor's prepared decline of one register row was not applied where it would have dropped items that still hold.
- **Escalation and success to the successful:** one worker, one gate, no new check or phase. The integration reused upstream's live feedback audit, as its own check prescribes.
- **The commons:** this review failed it once. Two probe copies wrote 155 GB of a sparse file's zeros and filled the shared volume until they were removed (D053).
- **Naive Interventionism:** the review changed no behavioral source. Its edits are version labels, selectors, the fixture capture, evidence and the write-backs.
- **NoOp:** leaving the order unmerged keeps the one-sentence verifier duty and no count.

## Whether verification showed the three duties

The order's evidence gate asks this review to say whether the order's own verification ran under the new text. It did. VER-001 names the three duties of product 07 §Verification review and attack, the lenses it used and why, a table of variations tried per axis, its own reading of the whole diff, and one fresh `dotln-worker` given only the order and the diff, whose eight items the verifier judged itself. VER-002 to VER-005 do the same, and each re-derives the criteria its repair touched. VER-004's review duty produced the finding that ended the repair cycle: the readers inferred records from prose, and the simpler alternative was a declared format.

## Criteria

- **Criterion 1:** met. On the integrated tree both generated verifier roots carry the one duty sentence, the `Read:` directive for product 07 §Verification review and attack and the sentence "This limits product-gate reruns, never probes." Both executor roots carry the self-review sentence. The product 07 section holds the variation axes, the review's questions, the three routes, the re-verification rule and the six-row lens catalog. `npm run harness -- check` passes with 33 generated surfaces.
- **Criterion 2:** met. On the integrated tree the lifecycle fixture passes in 15,528 ms, printing the order's carry-in sections and the receipt's known issue. Against `08845c71:scripts/resume.mjs` it fails at "verify must print the order's known issues" (`scripts/test-verification-review.mjs:129`). The briefing prints the latest receipt that names the order, which is the reading the order's Design gives; F5 boards what that leaves out.
- **Criterion 3:** met. The lifecycle fixture, run by this review at the integrated subject and again by the document gate, records `implementation-ready` with exactly one advisory naming the line when the handoff lacks it and none when the line is present. The executor's handoff carries `self-review: found 12; fixed 9; recorded 3`.
- **Criterion 4:** met. The same fixture records the three class counts and `unclassed` on the event, names an unclassed blocking finding in one advisory, records every result, and prints per-order counts from `plan failures` and the last-ten figure from `plan start` over a synthetic log. The criterion's "finding line" is an entry of the report's findings block since the VER-004 repair: prose is never counted, a report with no block is unmeasured with an advisory, and D042 records the operator's view that this change of reader needed no authorization. This report is the first to carry the block; before recording, `reviewFindings` read it as measured with escape 3, integration 0, new-scope 4 and unclassed 0.
- **Criterion 5:** met. Product 07 holds the lens catalog in the section the verifier's text cites by name, §Model-specific notes says a spawned Claude worker's effort comes from the generated definition, and `docs/PLAYBOOK.md` says the verifier is fed the order's known issues. `harness check` covers `.claude/agents/dotln-worker.md`, and the compiler and harness cases that fail on a hand-edited `model:` or `effort:` ran in the gate; this review read both. `worker-pin-probe.json` records a worker spawned by that type from a root at `low`, with the host reporting no worker model or effort. This review's own worker, launched by type from a root at `xhigh`, was likewise reported by the host with no effort.
- **Criterion 6:** met. Before and after measures of all twelve roots are recorded (D005, D046). On the integrated tree they are unchanged: executor 29,777 bytes, verifier 26,077, reviewer 27,882, release-close 18,485, planner 20,303 and refuter 19,582, with both skill trees equal. `docs/control/budgets.json` has no diff and no acceptance was added. The executor's 531-byte overrun stays on FUP-8ce4b4b0104ba41b under D003.
- **Criterion 7:** met. D006 and D046 give each role sentence and the finding it answers, the decisions index lists D001 to D053, and this review applied the register write-back: FUP-19cd701c25446383 is retargeted to WO-188 and FUP-e62d0d2771185a38 is returned to open with what remains (see Register).
- **Criterion 8:** met.
  - `npm test -- --review` passed on the integrated tree at code identity `23cf9cb2d54aca6bacfc46a0036c91f22fb7e26e0e81cc132f960c5907b3ceff`: 39 passed, 0 failed, 1,348.92 s, 89 fresh tasks, forced-fresh, recorded 2026-10-06T14:33:27.454Z. Upstream's vertical suite is the thirty-ninth and took 712.59 s.
  - `npm run test:docs` passed 29 of 29 tasks in 85.48 s with this report, D048 to D053, PR.md and RELEASE-NOTES.md in place; the code identity after it still equals the product gate's. The result transition runs it again inline.
  - `git diff --check` and `git diff --cached --check` exit 0.
  - Package changes are the compiler 0.25.3, the skeleton 0.53.1 and the console's exact pins; the lockfile differs from `main` only in those labels. No dependency is added, and the diff adds no lint or type suppression.

## Findings

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "The docs-check byte advisory accepts any evidence decision with an open follow-up, with no tie to the document it excuses and no planning decision."},
  {"id": "F2", "route": "follow-up", "class": "escape", "summary": "verify records its dispatch before building the briefing, so a missing order file or a non-directory receipts path leaves the phase at verifying with no briefing until the path is restored."},
  {"id": "F3", "route": "follow-up", "class": "escape", "summary": "The reviewer root names the three finding classes without their definitions or a read directive for the section that defines them."},
  {"id": "F4", "route": "follow-up", "class": "new-scope", "summary": "No route describes a defect a reviewer fixes within the boy-scout bound on a passing review, so such fixes can go unlisted and uncounted."},
  {"id": "F5", "route": "follow-up", "class": "new-scope", "summary": "The verify briefing prints no carry-in held on a planning map row and says nothing when the latest receipt names no known issue."},
  {"id": "F6", "route": "follow-up", "class": "new-scope", "summary": "The operator described a separate principal-engineer improver sub-agent beside the adversary; the order filed one dual-role worker, and the difference is boarded at the operator's choice."},
  {"id": "F7", "route": "follow-up", "class": "new-scope", "summary": "A recursive copy of a repository holding a sparse Beacon group file writes its logical size out in full, and nothing a prober reads warns of it; two probe copies of this review filled the disk."}
]
<!-- dotln-findings:end -->

The class is `escape` where the defect was present in VER-005's subject, whose source bytes this review carried unchanged, and inside what product 07 tells a verifier to examine. It is `new-scope` where the finding asks for something the order's Design did not set out to do. Nothing arose from integrating `main` or preparing the release, so no finding is `integration`. Every finding is routed `follow-up`: none loses a record, a count or a carry-in in a supported workflow.

- **F1 (follow-up, escape):** `advisoryByteFollowup` in `scripts/docs-check.mjs` accepts any evidence decision that has a `followup` string and an open or deferred register row. It does not check that the decision concerns the document it excuses, and naming one needs no planning decision. VER-003 boarded the missing bound (D033) and VER-005 the allocation consequence (D047); this specific is new. The file is outside the order's declared surfaces and the route follows the operator's recorded direction (D013, D019), so it is boarded with D033's row.
- **F2 (follow-up, escape):** `verify` appends `VerificationRequested` and only then builds the briefing (`scripts/resume.mjs:1371-1378`), and `verificationKnownIssues` reads the order and the receipts directory unguarded. This review reproduced it in a private copy of the fixture repository. With the order file moved after `implementation-ready`, or `docs/planning/refutations` replaced by a regular file, `verify` exits 1, prints no report path and leaves `VerificationRequested` as the last event, and `resume briefing` fails while the state lasts. After the path is restored, `resume briefing` exits 0, names the report and prints the carry-in. The surface is declared, so the routing needs a reason: no supported workflow reaches either state, because every earlier lifecycle command has just read the order at its recorded path and the receipts path is a directory or absent, and restoring the path loses nothing. VER-005 judged the sibling case in the same module, a hand-corrupted receipt, the same way (D047). A real `verify` that errors after recording is this row's reopening condition and would be a blocking defect.
- **F3 (follow-up, escape):** the reviewer root names the three classes and says product 07 defines them, but carries neither the definitions nor a `Read:` directive for that section, as the verifier root does. A reviewer of another order can class findings without having read what the classes mean.
- **F4 (follow-up, new-scope):** no route describes a defect a reviewer fixes within the boy-scout bound on a passing review. Product 07 defines `blocking` as failing the verdict and `follow-up` as a boarded item. The order's own record counts 21 such self-fixes among what final reviews found, so they can go unlisted and uncounted. The three routes are the order's operator-review assumption 3.
- **F5 (follow-up, new-scope):** the verify briefing prints the order's sections and the latest receipt's known issues, as the Design says. It prints no carry-in held on a planning map row, which `docs/work-orders/WO-112-core-run-loop-proof.md` lines 149 and 170 point at, and it says nothing when the latest receipt names no known issue for the order, so "none" and "cleared" read alike.
- **F6 (follow-up, new-scope):** the operator described wanting a separate principal-engineer improver sub-agent beside the adversary. The order filed one dual-role worker at executor completion and the verifier's own implementation review. The operator chose to ship as filed and board the difference (D051).
- **F7 (follow-up, new-scope):** the fixture repository holds a Beacon group file with a logical size of 96,383,980,230 bytes that occupies almost nothing on disk. A recursive copy writes that size out in full. The skeleton README says never to copy such a file as content; the role text and product 07, which is what a prober reads, do not. The adversary's probe and this review's each made that copy (D053).

## The fresh adversary's other items

The worker read only the order and the integrated diff (SHA-256 `a99b61f1bda9376ef2222676e00abb7a5d33f865c8b2773ae4b8c8c90a3452ef`), and no evidence, report, decision or register file. It reported twelve items and said none stops a result from recording or breaks criteria 1 to 5 as written. Its first, second, third, fifth and sixth items are F1, F2, F4, F5 and F3 above. The rest, as this review judged them:

- **A prose finding beside a block is not counted.** This is the declared format, stated in the reviewer root and product 07 and pinned by a fixture row. Criterion 4 above gives the reading.
- **The worker pin is written in three places and the name patterns disagree.** Already boarded by VER-001 (D020) and VER-003 (D034). The executor's prepared disposition would have declined D020's row for its class-label half; this review kept the row open for these items.
- **The installer replaces an existing `.claude/agents/dotln-worker.md` without an ownership check.** `scripts/lib/harness.mjs` refuses replacement of an unowned file only under `.codex/`, and treats the new path as it already treats `.claude/hooks` and the `dotln-` skills. No finding.
- **The `plan start` block is 968 of 1,024 bytes on the real record.** D016 chose what to drop to keep the bound, and names a block that again exceeds it as its reopening condition. No finding.
- **The executor root is 531 bytes over its ceiling; a stale `self-review:` line silences the advisory.** Both are recorded: FUP-8ce4b4b0104ba41b, and receipt 040's criterion-3 known issue with D041.
- **An unmeasured review stays unmeasured.** `findingCounts` is not a field the `correct` off-ramp sets (`scripts/resume.mjs:1695`). This joins D045's row, which already asks whether the reviewer gets a reading of its block before the result records.

It also checked and found sound: that no class or block shape throws or refuses at `final-review-result`, across deep nesting, 50,000 entries, mixed line endings and look-alike characters; that partial, duplicate-id and two-block reports record unmeasured rather than a lower count; the fixture at the subject and against `08845c71`; all 15 real carry-in sections across 193 orders; the installer's owned-file walk; the amendment's binding to the current order text; and this review's integration bookkeeping.

## Integration

- `npm run worktree -- integrate WO-187` fast-forwarded from `c44ba6c6` to `main` at `602f7e83` (WO-123, v0.67.0), with preservation checkpoint `/22` and named stash `154b7ff3`. No ignored intake file exists in this worktree, so no intake backup was named. Six authored conflicts were resolved and `--continue` completed generation (D048, D049).
- Versions: the skeleton's patch bump is retimed from 0.52.4 to 0.53.1, above upstream's 0.53.0, and pins beacons 0.1.1. The compiler keeps 0.25.3 and the harness host 0.34.5. v0.67.1 stays above v0.67.0, so the release was not retimed again. `npm run release -- check-surfaces --local` passes.
- Product 07's ceiling entry takes upstream's 168,083 bytes and planning decision and keeps this order's `advisoryDecision`. The document measures 7,798 bytes over and reports as an advisory on FUP-0a7c93eed06727ce.
- Editions: authority 002 and feedback 002 were stale on the new base. Authority was re-minted as revision 003. Feedback 003 carries upstream's live audit, WO-123 feedback-013, as that edition's own check prescribes, with no live episode: this order changes no file the feedback verifier judges. Artifact identity 001 and verification 001 verify unchanged. The console's self-hosted fixture was re-recorded for feedback 003.

## Register

`npm run plan -- followups --touching --work-order WO-187` returned 40 rows at register revision `1d300f831ced5cc30ec06d5a1cf0097034a3410be577a7c3ddb5e398f1bc734c`, read through every returned cursor. The two rows allocated to this order were read with `--show`. `npm run meta` minted rows for D051 and D052 and left the register at `15027a29d57b99eaaa1d418bec58fadaaf4bfa7e154c47125941dd620ccd498a`. One `followups --apply` batch of 21 requests moved it to `94155e9f8df05e431e9e4e45526dfcec795e4bf2c1c3e2cd52f36ee36f68ebb5`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-19cd701c25446383 (alternatives candidate) | allocated to WO-188 | WO-187 delivered the review for a simpler alternative; WO-188 item 22 keeps the experiment change. |
| FUP-e62d0d2771185a38 (WO-065 D008) | open | The fresh adversary is delivered; the personal delegation profile of product 05 remains. |
| FUP-dd7caa31b91f2e70 (D039), FUP-d46dde0ef39e0048 (D025), FUP-c3cc1f043b44f257 (D032) | settled | The repairs were delivered and verified, and the prose readers are gone. |
| FUP-2ac34ad96c41dfed (D040) | duplicate of D039's row | As D040 directs. |
| FUP-57c781f9462cd31b (D024) | declined | Its class forms concerned prose; its briefing case is a stated, advised boundary. |
| FUP-82e9f0bda503c40c (D020) | open, narrowed | Not declined as prepared: the worker pin, the shared name, the two name patterns and escapes shown as 0 for unmeasured orders still hold. |
| FUP-3f9d788f4d8c89ac (D034), FUP-67a07b670440cf5a (D045), FUP-0e62f2c7cfd0ed54 (D033) | open | Each narrowed or extended with what this review observed. |
| FUP-c64a12400f061738 (D041), FUP-e835d826e9af5417 (D042), FUP-de6162b279f66709 (D043), FUP-cde72b7860c03c18 (D021), FUP-d5605723a86254eb (D023) | open | For planning, as their decisions say. |
| FUP-c95ffe4a84e49cbb (D047) | deferred | At the priority D047 sets, with its conditions. |
| FUP-0a7c93eed06727ce (D013), FUP-f1c7a256bec46737 (WO-054 D006) | open | New measurements after integration; the product 07 row must stay open or deferred for its advisory to hold. |
| FUP-f4bf5a4ada0c1420 (D051), FUP-1315c82ef74fb832 (D052) | open | This review's follow-ups. |

FUP-8ce4b4b0104ba41b and FUP-ea936acad1506e18 stay open as recorded. The other textual matches were judged by D009 and D018, and this review changed none of their seams. FUP-adf6621e7f958dd8's condition has not occurred: every `authority.json` copy together is 5.79% of `docs/evidence` bytes against 10% for repeated copies, and `scripts/authority-evidence.mjs` is unchanged. FUP-16a4af39c710459b and FUP-5e52eb500e395237 are WO-186's untriaged rows and are not this order's to dispose.

## Verification sequence

1. **Activation:** 2026-10-05T21:21:57Z.
2. **Implementation** (Codex CLI 0.160.1, `gpt-6.1-sol`, max): `ImplementationReady` at 23:31:42Z. D001 to D018.
3. **[VER-001](../../verifications/WO-187/VER-001.md)** (Claude Code 2.1.290, `claude-opus-5-5`, xhigh): fail at 23:55:22Z on criteria 2 and 4 (F1, F2), with R1 to R3 (D019 to D021).
4. **Repair** (Claude Code 2.1.290, `claude-opus-5-5`, xhigh): 23:57:34Z to 2026-10-06T01:01:36Z. D022 to D024.
5. **[VER-002](../../verifications/WO-187/VER-002.md)** (Codex CLI 0.160.1, `gpt-6.1-sol`, max): fail at 01:17:29Z on criteria 2 and 4 (F1, F2), with R1 (D025).
6. **Repair** (Codex CLI 0.160.1, `gpt-6.1-sol`, max): 01:18:41Z to 02:05:18Z. D026 to D031.
7. **[VER-003](../../verifications/WO-187/VER-003.md)** (Claude Code 2.1.290, `claude-opus-5-5`, xhigh): fail at 02:31:36Z on criteria 2 and 4 (F1), with R1 to R3 (D032 to D034).
8. **Repair** (Codex CLI 0.160.1, `gpt-6-astra`, max): 02:39:47Z to 03:15:48Z. D035 to D038.
9. **[VER-004](../../verifications/WO-187/VER-004.md)** (Claude Code 2.1.291, `claude-opus-5-5`, xhigh): fail at 05:24:14Z on criteria 2 and 4 (F1, the readers infer records from prose) (D039 to D043).
10. **Repair** (Claude Code 2.1.291, `claude-fable-5-1`, xhigh): 05:24:53Z to 06:49:54Z. D044 to D046 replaced the prose readers with exact formats.
11. **[VER-005](../../verifications/WO-187/VER-005.md)** (Codex CLI 0.160.1, `gpt-6-astra`, max): pass at 10:24:55Z (D047).
12. **This review** (Claude Code 2.1.291, `claude-fable-5-1`, xhigh): dispatched 13:42:34Z, checkpoint 21. D048 to D053.

The five verifications took 866.9 s to 3,886.2 s from dispatch to result, with a median of 1,351.5 s, against the 842 s median the order records from before. They judged a subject that failed four times, so the figures are not a like-for-like comparison.

## Executed checks

Every probe outside the gates was read-only or ran under `node scripts/harness.mjs bounded`, one at a time, except as the last item says.

- **State:** `resume status --json`, `harness writer --show`, usage at entry and handoff, `git fetch origin main` and the base comparison.
- **Hashes:** the five report hashes against their control events; the five new source files against checkpoints 18 and 21.
- **Integration:** the four edition checks before and after the re-mint, console fixtures, `harness check`, `npm run publication:check`, `npm run release -- check-surfaces --local`, `node scripts/docs-check.mjs`, and the two whitespace checks.
- **Criteria:** the generated roots' sentences by search; the cold-start bytes of all twelve roots; the lifecycle fixture at the subject and against `08845c71`.
- **Findings:** the F2 reproduction over three probe orders (two abnormal states and a control), with the restore step; the source reads behind F1, F3, F4 and F5; the fixture's file sizes behind F7.
- **Gates:** `npm test -- --review` once, after the integration's last source change; `npm run plan -- check`; `npm run test:docs` on the final documents.
- **Register:** the touching listing through every cursor, `--show` for four rows, the `authority.json` byte share, and the `--apply` batch.
- **Clean room:** a search of this order's records and new sources for home paths, host temporary paths and address-like strings. It found the local worktree path 78 times in four evidence files, 74 of them in the copied gate row `repair-004/review-gate.json` and two in D043's quoted wait line, and a host temporary path twice in one VER-002 probe record. `main` already carries such paths in eight evidence files. It found no employer material, credential or internal address; the one address-like string is the fixture's `fixture@example.invalid`.
- **One overlap:** the criterion 2 fixture probe ran while the adversary could still have been probing, and the gate was started before the adversary reported.

## The reviewer's own errors

- **The index.** After the integration completed, one comparison command of this review ran `git add -N -- .` and then `git reset -q`, which emptied the index. The reviewer role forbids a reset. No working-tree byte changed. The five new source files the executor had staged were staged again before the gate, and each hashes equal to checkpoints 18 and 21 ([D050](../../evidence/WO-187/decisions.md#wo-187-d050--the-reviewer-cleared-the-index-during-a-comparison-and-restored-it)).
- **The disk.** The adversary's probe copied the fixture repository at about 14:08Z and its copy held 90 GB. This review's own reproduction made the same copy after the gate had recorded its row, and wrote 65 GB until the volume reported no space left. The volume stood at 1.0 GiB available until both copies were removed, which returned it to 159 GiB. The worktree, the control log and the register were checked afterwards and are intact. Whether any other process on the host met an error in those minutes is unknown ([D053](../../evidence/WO-187/decisions.md#wo-187-d053--the-reviewers-reproduction-probe-filled-the-disk-and-was-removed)).

## Limits

- The worker's effective effort, dollar cost, and the future escape rate and verification time are unobserved. The order's own measure needs the ten orders after this one.
- This report's three `escape` findings are low follow-ups; the count does not weigh severity.
- The adversary did not read the evidence, so it could not confirm the boarded overruns or the edition contents; this review checked those itself. Its comparison of `plan start` against `main` did not run.
- Every earlier final review reads unmeasured, so `plan start` reports the escape rate as unknown until the ten most recently reviewed orders are all measured.
