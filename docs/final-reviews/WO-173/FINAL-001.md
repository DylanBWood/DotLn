# WO-173 FINAL-001 — final review

**Verdict:** pass. WO-173 asked that an executor's handoff state, for every acceptance criterion, whether it is met and on what or unmet and why; that a met claim naming a gate stand on that gate's passing row; that an unmet criterion reach the operator and the judge at the next dispatch; that `npm test` not repeat a gate that already passed at the same code identity; and that the resident's lock matrix give each cell its own deadline. The subject does each of these. [VER-001](../../verifications/WO-173/VER-001.md) failed criterion 2 on one defect: a damaged live gate index refused both completions before the promised advisory. The repair made gate storage a completion cannot read or write one advisory, and [VER-002](../../verifications/WO-173/VER-002.md) passed. Criterion 5 is unmet, waived by ordinal 4: the operator accepted the briefing byte overage, the capture hash matches the event, and this review judged the waiver from the record. This review read the full subject diff against the original order, staged the order's work, ran the review gate once at the staged identity, disposed nine register rows and boards one defect it met ([D018](../../evidence/WO-173/decisions.md#wo-173-d018--final-review-passes-and-boards-a-reused-row-that-never-ran-an-untracked-files-bytes)): the new reuse lookup keys on a code identity that does not hash an order's untracked new source. It changed no source and no product document.

**Subject:** [`docs/work-orders/WO-173-handoff-states-what-it-knows.md`](../../work-orders/WO-173-handoff-states-what-it-knows.md) on branch `wo-173` at `333f17ee` plus the working tree, which this review staged. `git ls-remote origin refs/heads/main`, local `main` and the merge base all name `333f17ee`, the commit tagged `v0.53.1`, so the subject already contains current `main` and no integration was needed. The dispatch checkpoint is `refs/dotln/checkpoint/WO-173/10` (`b7befbe0`).

- The recorded `reportHash` of VER-001 (`sha256:2c0e7397…`) and VER-002 (`sha256:987862fb…`) each equal the report's current SHA-256.
- The order's text differs from `main` only in its heading's release label, `(v0.53.2)`. The nine criteria are the original ones.
- The criterion 5 waiver's capture, `docs/intake/notes/WO-173-byte-guidance-2026-09-28.md`, hashes to the recorded `sha256:2ec56a0b…`; the ideation capture on `main` hashes to the `2993746f…` that D006, the ledger and the map record.
- What this review wrote is documents and local state only: D018, the register dispositions and their request file, the refreshed indexes, meter snapshot and PR meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.284","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice about the verdict. The harness version is what `claude --version` reports in this session. The model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value, which `resume status` reads back for this session: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry (exact-observed). Both verifiers had already exercised the fixture families; this review's reading was the whole diff, the two new modules, the decisions and the ideation receipt, which one reader can hold.

**Process cost:** entry 86057 tokens; handoff 14986399 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 9ac91232-a683-4b18-acfa-75e0be43689b`. The entry reading was observed at 2026-09-28T22:02:04.666Z, before the order was read. The handoff reading was observed at 2026-09-28T22:22:03.479Z, after D018, the register dispositions, the PR body, the release notes and this report's judgment text were written and before `test:docs` and the result transition; it counts 14,662,331 tokens of reused cached input, 244,832 of cache writes and 79,062 of output, over 94 steps and 84 commands. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. The largest wait was the review gate, 644.86 s, during which repository writes are refused; this report and the PR and release texts were drafted in session scratch beside it and every repository write followed it.

## Goal-aligned judgment

The order sits on the lifecycle's own critical path: the order counts, from the 96 failed judgments read on 2026-09-28, 27 judgments and 25.2 h of judging and repair that a stated handoff and the checks it names would have removed, and each of the last ten orders paid two to nine product gate runs. The questions for this review were whether a completion can now refuse a handoff for anything but a malformed ledger or a claim its own gate contradicts, whether the gate lookups admit a row that did not test the subject, and whether the new disclosure reaches the reader without re-asking what the operator already decided.

- **Rule beating:** a met line is only a claim, so the completion checks the gates it names against the rows publication already relies on, and a failed, partial or other-identity row never satisfies it. The one route around the check this review found is D018: an untracked source file the identity does not hash. It is boarded, not failed, for the reasons in Findings.
- **Shifting the burden:** an unmet criterion now reaches the verify and final-review briefings with the waiver and amendment routes, at the dispatch where a waiver is legal. This review received the off-ramp sentence and no disclosure for criterion 5, which the record already waives (D017).
- **Policy resistance:** no handoff is refused for a red gate or an unmet line. A completion refuses only a malformed ledger, which the executor answers by writing its lines, and a met claim its named gate contradicts; storage the completion cannot read or write is one advisory (D015). The 2026-09-15 stand-down's rule holds.
- **Drift to low performance:** the ledger's refusals are of form (absent, missing, duplicate, undeclared); an order without a readable criteria list keeps the old behaviour with one advisory.
- **Tragedy of the commons:** the reuse lookup removes repeated ten-minute gates from a host every lane shares, and a matrix cell slowed by another lane's load now fails alone and by name, against a budget of about four times the slowest solo cell, instead of cancelling all eight. The cost is the D018 window, which the final review's staged gate closes before publication.
- **Escalation:** no event type, phase, verdict rule or off-ramp changes; `unmetCriteria` is an optional field the fold validates.
- **Success to the successful and seeking the wrong goal:** the briefing byte bound was waived by the operator rather than met by cutting routes, and D017 removed only filler; the role sentence grew 227 bytes instead of the designed 150 at the operator's direction (D007), which leaves the reviewer 178 bytes and opens a register row (Rows).
- **Naive Interventionism:** the untracked-file selection changes what every review gate selects; the runner fixture shows it selects only suites that declare the file, and the order's gate and completion read one selection.
- **NoOp** keeps the pattern the record counted: of 96 failed judgments, 24 on findings an existing check would have shown before handoff and 13 on gaps the executor had already written down.

## Source changes

I read every changed source file and the two new modules against their tests.

- **`scripts/lib/handoff-ledger.mjs`** (new; D002, D003, D015). `declaredCriteria` reads the numbered items under the order's `Acceptance criteria` heading, joining wrapped lines; `readHandoffLedger` refuses an absent ledger, a missing, duplicated or undeclared criterion through `criterionJudgments`, so a fenced line is not read; `requireGateClaims` looks up `npm test` rows through `coveringGateCheck`, reads the review selection through the runner's own `--review --list`, runs `--document` inline and last, and turns every unreadable index into one advisory. The review form implies the plain one, so criterion 9's text is both a review and a plain claim.
- **`scripts/lib/gate-reuse.mjs`** (new; D004). `completePassingRow` restates the skeleton's partial-row rule; `coveringGateCheck` returns the latest complete passing row at the identity whose `requiredSuites` include the requirement, and a row naming no suites covers only an empty requirement. Its import of the skeleton's gate evidence is lazy, so a copied control plane still loads.
- **`scripts/resume.mjs`**. The ledger is read before the writer release and every other check; the two completions pass the diff check's index error to `requireGateClaims`, append `unmetCriteria` only when a ledger was judged, and print the ledger counts. A gate-claim refusal is thrown inside the dispatch switch, before the post-transition `try` that would rewrite an error as "Completion recorded", so a refused completion keeps its writer and is not reported as recorded; the fixtures pin the `^error: criteria …` form. The verify and final-review briefings leave out a criterion the record already waives.
- **`scripts/lib/lifecycle-evidence.mjs`**. The diff check still refuses; its row write is guarded and the damaged index is left as it is. The tree-hash document-gate advisory is removed. A passing final review still reads its gate row unguarded, as D015 records.
- **`scripts/lib/control.mjs`**. The fold validates `unmetCriteria` as an array of criterion ids and projects it with its ordinal, reset at activation.
- **`scripts/test-runner.mjs`**. `changedMachinery` joins `git ls-files --others --exclude-standard`; the product gate first looks for a covering row and exits 0 with the row printed, before the confinement probe, the build and every suite; `--again` and `--fresh` run the selection; `--document`, `--machinery`, `--only` and `--confined-partial` never reuse.
- **`packages/skeleton/test/resident.test.ts`**. Eight subtests with a 120 s deadline each; the delay fixture runs the matrix in a child `node --test` with `NODE_TEST_CONTEXT` removed and asserts exactly `loop-append-reclaim` fails.
- **`packages/skeleton/src/loadouts/contributor.ts`**. One role sentence; skeleton `0.44.3` to `0.44.4` with the console pin and lockfile.

No change adds a dependency or a lint, type or format suppression.

## Criteria

**Criterion 1:** met

`readHandoffLedger` runs first in both completions and throws before any append. The WO-099 fixture refuses an absent ledger, one without criterion 2, one with two criterion 2 lines, one naming undeclared criterion 3 and one whose only criterion 2 line is fenced, each message naming the identifiers and `criterionLineForms`; the complete ledger records; WO-105, with no numbered list, records with one advisory and no field. Both verifiers judged it met and the review gate ran the fixture on the staged subject.

**Criterion 2:** met

The WO-102 and WO-103 fixtures refuse a met `npm test` claim with no row, a failed row and a partial row; refuse the review form when the row lacks the suite an untracked declared script selects; refuse a met `npm run test:docs` claim with the failing tasks; record with the covering row and a passing document stub; and record the same criteria unmet in every case. A missing runner, for the review listing and for the document gate, and an unreadable archive each advise once and record. VER-001's F1, a damaged live index, is closed: WO-106 and WO-107 damage it three ways across both completions, met and unmet, and each records with one advisory, and VER-002 reproduced that independently. D018 does not bear on this criterion's cases: each is stated at "the current code identity", and the check reads that identity correctly.

**Criterion 3:** met

WO-173's own RepairCompleted (ordinal 7) carries `unmetCriteria: ["5"]` and `resume status` projects it. The WO-101 fixture covers the event, the status line, the verify briefing's two routes, a waiver the verifier's session records while `verifying`, a report judging `unmet, waived by` that ordinal and a passing verification.

**Criterion 4:** met

The runner fixture reuses a covering row with no suite started and nothing recorded while `findGateCheck` still returns the same row; `--again` and `--fresh` run; a changed tracked source, a failed row, a partial row and a plain row under `--review` each run the gate. This review's own `npm test -- --review` did not reuse the executor's row: staging the order's new files moved the identity from `605f737d…` to `702823eb…` and the gate ran. D018 records the case outside this criterion's identity: an edit to an untracked new source file after a row.

**Criterion 5:** unmet, waived by 4

The three sentences are pinned in `scripts/test-off-ramps.mjs`, which the resume suite runs; this review's own final-review briefing carried the off-ramp sentence. The fixed growth is under 400 bytes (next 254, fix 379, verify 253, final-review 109); the conditional disclosure takes verify to +640 and final-review to +496 for one unmet criterion. The operator accepted that overage in the waiver at ordinal 4, whose capture hash matches; it is judged from the record, as the order's own sentence says.

**Criterion 6:** met

The matrix reports eight named subtests, each with a 120 s deadline; the delay fixture fails `loop-append-reclaim` by name and the other seven pass. `matrix-durations.json` records 170.5 s alone and 174.38 s beside a review gate, whose companion is now the gate that overlapped it (VER-001 N2). Its parent test ran in the skeleton suite of this review's gate, which passed. Under `packages/skeleton/src/` only `loadouts/contributor.ts` changes, beside the package's release label.

**Criterion 7:** met

The register advisory states the reworded rule, pinned in `scripts/test-process-debt.mjs`, and the tree-hash document-gate advisory is gone from both completions; WO-173's own completion events carry neither.

**Criterion 8:** met

Product 07 §Discipline and §Retained planning follow-ups carry the rule; product 07 is 154,821 bytes against 154,129 at `main`, 692 added of the 700 allowed; `docs/planning/followups.md` carries the reworded rule; the role sentence is measured before and after in `cold-start-before.json` and `cold-start-after.json`, and `node scripts/harness-context.mjs --check` reports every profile at the after bytes with each verdict unchanged; the decisions file (D001 to D017 at handoff) and the publication locks are current.

**Criterion 9:** met

The authority edition is re-minted as WO-173 revision 001 and selected in `docs/evidence/current.json`; the feedback, artifact-identity and verification edition checks pass unchanged, so no carry is owed (D009). The final review's `npm test -- --review` passed at the staged code identity `702823eb…`: 37 suites, 0 failed, 644.86 s, 81 fresh tasks, exit 0, recorded 2026-09-28T22:19:52.034Z. `npm run test:docs` passed after this report was written (Checks); `git diff --check` and `git diff --cached --check` are clean; the only manifest changes are the skeleton version and its pin. `handoff.md` judges all nine criteria.

## Rows

`npm run plan -- followups --touching` returned 22 pending rows at register revision `1138548d…`. Two rows allocated to WO-173 sit outside the pending feed: `FUP-756224e6e2cbf35a` and `FUP-5a03cc13047c1dc4`. One batch through `followups --apply` disposed nine rows (register `58dd90e3…` to `0890a19e…`, pending 165 to 159); each reason cites this report. The other rows only matched a path or the order by text, and stay as they are under the reworded rule this order lands.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-1d57cbcb226d8f8a (WO-159-D020) | resident.test.ts, WO-173 | settled | Allocated here; the eight subtests landed (D008) and passed in this review's gate. |
| FUP-0a5c04cf5c741559 (WO-060-D009) | resident.test.ts | settled | Its seam opened: the fixed 240 s deadline is gone. |
| FUP-b1163d128e371b7f (WO-169-D007) | test-runner.mjs, WO-173 | settled | `changedMachinery` reads untracked files (D003). |
| FUP-756224e6e2cbf35a (WO-163-D021) | allocated to WO-173 | settled | The off-ramp sentence and the unmet disclosure landed (D005, D017). |
| FUP-5a03cc13047c1dc4 (WO-169-D002) | allocated to WO-173 | settled | The reworded rule landed (D007); this table applies it. |
| FUP-96091899814ccd0c (WO-173-D012) | resume.mjs, WO-173 | settled | VER-001 F1 closed (D015, VER-002). |
| FUP-c3cabf64e06999db (WO-173-D014) | matrix-durations.json | settled | The companion reference is corrected. |
| FUP-8c9a0ab2a894b7fd (WO-173-D013) | WO-173 | settled | The accepted overage stands under the waiver; no trimming is owed. |
| FUP-f1c7a256bec46737 (WO-054-D006) | product 07 | open for planning | Its condition occurred: the reviewer's cold start is 24,398 of 24,576 bytes, 178 of headroom, below 256. D010 listed it as a text match; the role sentence is what moved it. |

Left as they are, each a text match whose condition did not occur: `FUP-4f8cd7989607ad3f` (resident host and state unchanged), `FUP-50cda1c03ecd8ea8` (meta.json by name), `FUP-51c310284c2fea17` (the dispatch release is untouched), `FUP-56b599e15f97e666` and `FUP-fd05316b6030ef73` (the named sentences are unchanged), `FUP-5e2f4ce16f9e8be1` (197,533 bytes under `docs/evidence/WO-173`, under 1 MB), `FUP-acfe4bfda716d8fb` (a generated projection), `FUP-b053a956adb84b6a` (its condition follows this order), `FUP-b789b81160c008ea`, `FUP-ca628adcc713c0b8` and `FUP-e55e258d37cb3f20` (the named folds and planning scripts are untouched), `FUP-e821aa2ced3aa111` (the `node()` consumers are untouched). `FUP-a6cf758ebdd11f1c` (D016), `FUP-0349c7a91fe63917` and `FUP-cd1a227413938345` (D006's candidate) wait for the planning pass, as does D018's new row.

The worktree's adjacent queue: no items (`node scripts/adjacent-work.mjs list`).

## Findings

No finding is routed to repair, and no criterion fails.

- **F1 — A reused row can stand for an untracked file's bytes it never ran** (medium, boarded in [D018](../../evidence/WO-173/decisions.md#wo-173-d018--final-review-passes-and-boards-a-reused-row-that-never-ran-an-untracked-files-bytes)). The runner's reuse lookup and the completion's `npm test` claim both key on `gateCodeIdentity`, which hashes the working-tree bytes of tracked paths only. An order's new source files stay untracked until final review stages them, so an edit to one after a passing row moves neither the identity nor the gate. Reproduction in session scratch through the real `runGate`: a tracked product suite imports an untracked helper; after a passing run the helper was edited to return a wrong value, the identity stayed the same, `npm test` printed the reuse line and exited 0 with no suite started, and `npm test -- --again` exited 1 with `Error: helper returned 2`. Before WO-173 every `npm test` ran and the identity was consulted only after staging, so this order is what makes the gap reachable. I board rather than fail it: criterion 4 and operator-review assumption 2 state the rule in terms of the code identity, which the order's non-goals leave to `gate-evidence.mjs`; publication is unaffected, because the final review stages first and its gate then ran fresh; and this order's own row covers its bytes, since every untracked source file's modification time precedes the inferred 21:34:33Z start of the 21:45:15Z row. The fix is a choice between refusing reuse while identity-bearing untracked files exist and recording their digest beside the row, which changes what every executor's `npm test` does; that is a planning decision, named in D018's follow-up.
- **The reviewer has 178 bytes of cold-start headroom.** The role sentence grew 227 bytes at the operator's direction (D007), past the order's 150-byte design bound, which the operator called a smell rather than a rule. Every verdict stays within its ceiling; the register row whose condition this meets is open for planning (Rows).
- **The fixture's 400-byte assertion measures the fixed sentences only.** The conditional disclosure is outside it by the operator's waiver; D013's follow-up is settled with that acceptance.
- **The meter reports one standing budget breach**, `current/sequenceBytes`, on a file this order does not touch; it predates the order.

## Verification sequence

1. **Implementation** (executor, Claude Code 2.1.284, `claude-fable-5-1`, effort max, `claude-session-readback`): activated at 2026-09-28T19:14:44Z; `ImplementationReady` at 20:53:50Z, checkpoint 2, `unmetCriteria: []`. D001 to D011, including the ideation breakout receipt D006.
2. **[VER-001](../../verifications/WO-173/VER-001.md)** (Codex CLI 0.158.0, `gpt-6-astra`, effort max, `codex-session-readback`): requested at 20:57:59Z; the operator's waiver of criterion 5 recorded by that session at 21:07:55Z, ordinal 4; fail at 21:13:02Z, checkpoint 5. Criterion 2 unmet on F1; criterion 5 unmet, waived by 4; the rest met. D012 to D014.
3. **Repair** (executor, Claude Code 2.1.284, `claude-opus-5-5`, effort xhigh, `claude-session-readback`): requested at 21:16:59Z; completed at 21:50:09Z, checkpoint 7, `unmetCriteria: ["5"]`. D015 to D017.
4. **[VER-002](../../verifications/WO-173/VER-002.md)** (Codex CLI 0.158.0, `gpt-6-sol`, effort max, `codex-session-readback`): requested at 21:52:24Z; pass at 22:00:39Z, checkpoint 9. F1 closed; criterion 5 unmet, waived by 4.
5. **FINAL-001** (this report): dispatched at 22:01:57Z, checkpoint 10. D018; no finding routed to repair.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, local `main`, merge base | all `333f17ee`; no integration needed |
| Tags | local and `origin` end at `v0.53.1` on `333f17ee`; `v0.53.2` is free |
| `npm test -- --review` | 37 passed, 0 failed, 644.86 s, 81 fresh tasks, exit 0; recorded 2026-09-28T22:19:52.034Z; code identity `702823eb…`, tree `3c0cc8fa`; row `host-gate:702823eba03ee57c00c000ee8864e000380a97a704b00cb1eb1391e361eb226c:npm test` |
| SHA-256 of VER-001 and VER-002; of both captures | each equals its record |
| Untracked-source reuse reproduction (session scratch) | identity unchanged after the untracked edit; the plain run reused the stale row and exited 0; `--again` exited 1 |
| Product 07 | 154,129 to 154,821 bytes (`wc -c`), 692 added |
| `node scripts/harness-context.mjs --check` | exit 0; executor 26,513 of 29,246, verifier 23,316 of 25,151, reviewer 24,398 of 24,576 in both skill roots; every verdict unchanged |
| `npm run publication:check` | 267/267 product headings indexed; 30 and 45 linked source sections match |
| `npm run harness -- check` | 31 generated surfaces |
| `node scripts/refute-plan.mjs check` | exit 0 |
| `npm run release -- check-surfaces --local` | exit 0 |
| `npm run release -- prepare --local` | `v0.53.2` remains current; meter snapshot (3,922 bytes) and PR meter block refreshed |
| `npm run meta` | decisions index and register synced with D018; one standing breach, `current/sequenceBytes`, outside this order |
| `npm run plan -- followups --touching`, then `--apply` | 22 rows at `1138548d…` and 2 allocated rows; a nine-request batch applied at `58dd90e3…`; register `0890a19e…`, pending 165 to 159 |
| `node scripts/adjacent-work.mjs list` | no items |
| Manifests, lockfile, suppressions | skeleton `0.44.4` and its pin only; no added lint, type or format suppression |
| `git diff --check`, `git diff --cached --check` | clean |
| `npm run test:docs` | 23 passed, 0 failed, 13.27 s, 23 fresh tasks, exit 0, after this report, the PR body and the release notes were written; a second run on the final bytes of this report also passed 23 of 23 |
