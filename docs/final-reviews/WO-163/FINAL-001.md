# WO-163 FINAL-001 — final review

**Verdict:** pass. WO-163 asked that the top level of `scripts/` hold only entry points, the library only library files, that generated files be marked generated, and that nothing tracked be kept because no one decided. The subject moves three import-only modules into `scripts/lib/`, turns the library's one command block into the `scripts/release-fixtures.mjs` entry point, retires three planning inputs by decision, marks the follow-up register `dotln-generated`, and closes WO-142 D008 and WO-099 D007 by recorded dispositions. [VER-001](../../verifications/WO-163/VER-001.md) failed on criterion 4's diff-stat clause and on three document-baseline exceptions the executor added. [VER-002](../../verifications/WO-163/VER-002.md) passed criteria 1, 2, 3, 5 and 6 after the repair, with criterion 4 unmet and waived by the operator at ordinal 6. This review read the full subject diff against the original order, re-ran the review gate, checked the old paths and the retired inputs' readers again, and retargeted the register row criterion 5 leaves to the close. It changed no source. It records one reviewer failure as a correction ([D021](../../evidence/WO-163/decisions.md#wo-163-d021--correction-the-final-reviewer-asked-the-operator-to-confirm-a-waiver-they-had-already-given)).

**Subject:** [`docs/work-orders/WO-163-5s-sort-and-set-in-order.md`](../../work-orders/WO-163-5s-sort-and-set-in-order.md) on branch `wo-163`, uncommitted, over `main` at `6f9494649db9a4984911801ae320788264d84ff9`. `git ls-remote origin refs/heads/main`, `origin/main`, local `main` and the merge base all name `6f949464`, so no integration was needed or run. The dispatch checkpoint is `refs/dotln/checkpoint/WO-163/10` (`9ac3668f`).

- The recorded `reportHash` values of VER-001 (`sha256:7ae622c2…`) and VER-002 (`sha256:a1f169ed…`) equal the reports' current SHA-256.
- The order's text differs from `main` only in its heading's `(v0.52.9)` label, written at activation. The six criteria are the original ones.
- The review gate ran at code identity `d7e3fc140b4795843c79dcca85602b47997e71151db95c61490cb86c411bd118`, the identity of the repair's gate row that VER-002 matched to its subject, so the tracked non-generated code is the code VER-002 judged. What this review wrote afterwards is documents and the ignored register request only: D021, the decisions index, the register, the refreshed snapshot and meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. I asked them once whether the criterion 4 waiver stands. They confirmed it, then objected that they had already waived it and should not have been asked again, and directed that this be recorded as my failure (D021, and the errors section below). They made no other choice about the verdict. The harness version is the one this session's earlier dispatches recorded and `claude --version` reports; the model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry. The executor's reviewers and skeptic, VER-001's two helpers and two independent verifications had already read this subject, and the code diff is a rename plus small edits. None was spawned.

**Process cost:** entry 81968 tokens; handoff 13781636 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage fefa2b9d-fc12-444f-ba0b-3252bad306d1`. The entry reading was observed at 2026-09-28T02:22:00.201Z. The handoff reading was observed at 02:39:06.685Z, after the judgment text, the PR body and the release notes were written and before `test:docs` and the result transition. It counts 13,509,173 cached input, 213,403 cache-write, 168 uncached input and 58,892 output tokens over 94 steps and 78 commands. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. Both readings count reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The largest wait was the review gate, 569.08 s. I drafted D021 and the publication files in session scratch while it ran, because repository writes are refused during a live gate.

## Goal-aligned judgment

The order is not on a lifecycle critical path. Its benefit is maintenance: a reader of `scripts/` can trust that a top-level file is something someone runs, a diff no longer presents the register as hand-written, and every retired file names where its content lives on. The questions for this review were whether the moves changed any behaviour beyond the paths, whether each retirement and disposition is sourced, and whether any criterion passes on a proxy.

- **Rule beating** was the planning receipt's named risk for criterion 4, and it did not happen. `git check-attr` reports `dotln-generated` set and `diff` and `binary` unspecified, so the register stays inside `git diff` and `git diff --check`. Receipt 028's reopening condition for criterion 4 (a diff-disabling attribute) is not met. The diff-stat clause stays unmet and is waived; nothing claims it.
- **Drift to low performance** was the receipt's named risk for criterion 5. The historical route was taken, but the check does not stay failing: it exits 0 on a narrower claim that its own output states, and it still fails on a changed record or a missing killing-test title. Receipt 028's reopening condition for criterion 5 (historical beside a still-failing check) is not met. VER-001's F2 caught the other drift, three baseline exceptions that hid broken links, and the repair removed them rather than renaming them.
- **Policy resistance:** the fixtures that copy scripts by name resisted the move, and each followed it. The runner's machinery-source lists keep every earlier row and gain one.
- **Seeking the wrong goal:** the goal was decided residue, not a smaller file count. The fourth dispositions input stays because a live document links it, and the mutation tool stays because WO-042's evidence names its commands.
- **Shifting the burden:** this review added burden to the operator by asking them to re-confirm a waiver they had already given (D021). D011 moves the WO-162 integration fix into the record the second final review reads, rather than leaving it for the operator to find after a clean merge disables `worktree integrate`.
- **Tragedy of the commons, escalation, success to the successful:** no gate, refusal, dependency or sustaining check is added.
- **Naive Interventionism:** no live episode was run to satisfy D007's wording, and the closed WO-042 and WO-030 records keep their measured facts.
- **NoOp** leaves three misleading top-level files, a library file with a command block, three unread inputs, a register shown as authored, and a check that fails on every tree.

## Criteria

**Criterion 1:** met

All three modules are under `scripts/lib/`, and the old paths are gone. `git diff -M` reports `github-body.mjs` and `github-repository.mjs` as 100% renames; neither has a relative import. `release-notes.mjs` changes only line 1, `./lib/config.mjs` to `./config.mjs`. A search of `scripts`, `packages`, `corpus`, `.claude`, `.agents` and `package.json` finds every importer on the new path and no old path. `docs/discovery`, `scripts/fixtures` and `.claude/harness-manifest.json` name none of the three. `npm run harness -- check` reported 31 generated surfaces, and the three discovery fixtures in `scripts/test-process-debt.mjs` passed (3 of 3, 1.34 s). In this review's gate `github-body`, `worktree`, `worktree-integration`, `release`, `configuration-root`, `target-publish`, `runner-fixtures` and `harness-fixtures` passed.

**Criterion 2:** met

`git grep` for `isMainModule(`, `process.argv`, `process.exit`, `import.meta.main` and a shebang under `scripts/lib` finds only the definition of `isMainModule` in `paths.mjs`. `scripts/lib/release-fixtures.mjs` loses the block and the import only the block used. `scripts/release-fixtures.mjs` carries the block unchanged: `list .` prints 44 cases, an unknown action exits 1, and running the library prints nothing. The diff of `scripts/test-runner.mjs` adds one row, `scripts/release-fixtures.mjs` in `runner-fixtures`, and removes none.

**Criterion 3:** met

The three inputs are deleted in the index. Searching `scripts`, `packages`, `corpus`, `.claude`, `.agents`, `package.json` and `docs/planning/refutations` for each file name finds only receipts 028 to 032, which quote the order's Cost line; none reads them. [D004](../../evidence/WO-163/decisions.md#wo-163-d004--three-one-shot-planning-inputs-retire-and-one-live-link-is-rewritten-first) names the receipt that carries each input's entries (008 for process debt; 013 for the two identical nine-entry inputs), the last commit of each and the grep. VER-001 independently confirmed that mapping over bytes that have not changed. The one live link, in the work-order map, now names the retired file in code text, commit `c0a60b6d` and receipt 013. `npm run test:docs` passed after this report was written (Checks).

**Criterion 4:** unmet, waived by 6

`.gitattributes` line 5 reads `/docs/planning/followups.json dotln-generated`. `git check-attr` reports `dotln-generated: set`, `diff: unspecified`, `binary: unspecified`. `git diff HEAD --stat` still shows the register as an ordinary text file (358 insertions at this review), so the diff-stat clause is unmet, as VER-001 F1 found. Canonical status lists criterion 4 waived at ordinal 6, and VER-002 matched the capture's SHA-256 to the event. The waiver stands on that record ([D021](../../evidence/WO-163/decisions.md#wo-163-d021--correction-the-final-reviewer-asked-the-operator-to-confirm-a-waiver-they-had-already-given)). The textual diff stays readable, which is what receipt 028 required.

**Criterion 5:** met

- **WO-142 D008.** [D008](../../evidence/WO-163/decisions.md#wo-163-d008--the-wo-042-mutation-reproduction-is-kept-as-a-historical-record) takes the historical arm, and [the note beside the evidence](../../evidence/WO-042/mutations/README.md) marks it. `node scripts/authority-mutation-evidence.mjs --check` exits 0 at this review, printing 178 recorded files, 330 current and 57 unchanged, and stating that lexical presence is not active coverage. The transcript and summary have no diff against `main`.
- **WO-099 D007.** [D007](../../evidence/WO-163/decisions.md#wo-163-d007--wo-099-d007-was-discharged-on-2026-09-20-no-episode-is-run) records that WO-099-D010 discharged it on 2026-09-20. Its register row `FUP-abcc64ad8f8c79b9` has been settled since 2026-09-21 and needs no new disposition.
- **Retargeted at close.** This review settled `FUP-4050fe828a686c1e` against its revision 3, the one D008's `reopens` object created, with a reopening condition for a failing historical check or a wanted current-source reproduction (Rows).

**Criterion 6:** met

`npm test -- --review` passed: 32 passed, 0 failed, 569.08 s, 76 fresh tasks, exit 0 (Checks). `npm run test:docs` passed after this report, the PR body and the release notes were written. `git diff --check` and `git diff --cached --check` are clean. `package.json`, the lockfile and `packages/` have no diff against `main`, so no dependency is added. The diff under `scripts/` adds no lint, type or format suppression.

## Rows

After D021 was synced, `npm run plan -- followups --touching` returned sixteen rows at register revision `01b460d28d4553b369f1c6e00478e45122a4398fde33847ed8ea18623c672322` (two pages). One batch through `followups --apply` disposed all sixteen, and the register moved to `fe18cb3d2bec59f2c1730be978abc16586255d060fae3b083294f5e064a09bcf`. Each reason cites this report.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-4050fe828a686c1e (allocated) | the mutation tool, WO-163 | settled at revision 3 | Criterion 5: the reproduction is marked historical and the check exits 0 (D008, D017). |
| FUP-71fc2efc208f597a | decisions.md, index | open, unchanged | WO-163's decisions paraphrase the operator's replies and quote no operator chat. |
| FUP-50cda1c03ecd8ea8 | harness-prune.mjs, meta.json | deferred, same condition | One import specifier changed; the byte-proof writer is untouched. |
| FUP-8cfd3ff52146a016 | release.mjs, test-release.sh | deferred, same condition | Imports, one pattern and the fixture calls changed; release close is untouched. |
| FUP-acfe4bfda716d8fb | current.md | deferred, same condition | Generated projection only; usage attribution is untouched. |
| FUP-b1163d128e371b7f | test-runner.mjs | deferred, same condition | The new entry point is declared and was staged before each review gate. |
| FUP-e2cf2122a642d1e0 | release.mjs | deferred, same condition | The release listing and `manifestWorkOrders` are untouched. |
| FUP-e62c63344f52405f | harness-prune.mjs | deferred, same condition | `stash-drop.mjs` is untouched. |
| FUP-e821aa2ced3aa111 | test-runner.mjs | deferred, same condition | One declared-source line; TAP selection is untouched. |
| FUP-fa028783f3f6b17f | release.mjs | deferred, same condition | Release preparation is not edited. |
| FUP-fd05316b6030ef73 | README and evidence READMEs | deferred, same condition | The writer text is untouched. |
| FUP-045a0a480f95bcc7 (D012) | WO-163 | open, for the planner | WO-062 and WO-065 cite the old path. |
| FUP-667e12ad11c15caf (D009) | WO-163 | open, for the planner | A current-commit mutation campaign is undecided. |
| FUP-756224e6e2cbf35a (D021) | WO-163 | open, for the next planning pass | Minted by this review. |
| FUP-7932ccddcde95d4f (D011) | the shared scripts | open, for the second final review | WO-162's import must become `./git.mjs`. |
| FUP-e96e0676a5c34f98 (D020) | WO-163 | open, narrowed | Operator half void (D021); the Codex `executorOf` gap is carried. |

## Findings

No finding is routed to repair, and no criterion fails.

- **Reviewer failure, recorded as a correction ([D021](../../evidence/WO-163/decisions.md#wo-163-d021--correction-the-final-reviewer-asked-the-operator-to-confirm-a-waiver-they-had-already-given)).** I asked the operator to confirm that the criterion 4 waiver stands. The waiver stood on its record: the operator's captured words, their hash matching the event, and `resume waive` admitting it. VER-002 had already judged the recording route nonblocking. The question pushed bookkeeping back onto the operator for the third time in this order. D021's follow-up asks the planner to stop routing a hash-matched off-ramp back to the operator.
- **Observation: the WO-030 table's rows are no longer column-aligned** in the Markdown source, because three link destinations grew. Markdown is outside the format gate, it renders the same, and re-padding would rewrite every row of a closed record. Left as is.

## Reviewer errors in this session

- I asked the operator to confirm a waiver they had already given (D021). The operator directed that it be recorded as my failure.
- While reading the diff I ran `git add -N .`, which marked five untracked files as intent-to-add: the order's control log, its meter snapshot, the PR draft and both verification reports. `worktree integrate` refuses an intent-to-add entry (D010). I removed exactly those five index entries with `git update-index --force-remove` and confirmed that the files were intact and the index matched its state at entry.
- I joined two files' output with `echo =====`. zsh expanded the `=` word, and the command exited 1 after the first file printed, the same error WO-170's reviewer recorded. I read the second file on its own.
- Beside the live gate I tried `shasum`, `git worktree list`, a `cut` pipe, an unquoted glob and an edit to the decisions file. Each was refused with nothing written. I drafted in session scratch and applied the edits after the gate.

## Verification sequence

1. **Implementation** (executor, Claude Code 2.1.283, `claude-fable-5-1`, xhigh from `ultracode` with subagents, `claude-session-readback`): activated at 2026-09-27T23:42:46Z; `ImplementationReady` at 2026-09-28T01:33:20Z. D001 to D013. Three reviewers and a skeptic upheld nineteen findings, none blocking; the corrections were to the record (D013). Its gate passed 32 suites in 571.49 s.
2. **[VER-001](../../verifications/WO-163/VER-001.md)** (Codex CLI 0.157.1, `gpt-6-astra`, ultra recorded as xhigh with subagents, `codex-session-readback`): fail at 01:51:15Z. F1: criterion 4's diff-stat clause unmet. F2: three new baseline exceptions suppressed links the move broke. N1: the historical check's lexical title test overclaimed coverage. D014 to D016.
3. **Repair** (executor, Codex CLI 0.157.1, `gpt-6-astra`, xhigh with subagents): `RepairRequested` at 01:52:37Z. The operator waived criterion 4, recorded as `CriterionWaived` ordinal 6 at 02:07:54Z. `RepairCompleted` at 02:11:52Z. D017 repaired F2 and N1; D018 records F1's investigation and the waiver. Its gate passed 32 suites in 570.93 s at code identity `d7e3fc14…`.
4. **[VER-002](../../verifications/WO-163/VER-002.md)** (Claude Code 2.1.283, `claude-opus-5-5`, xhigh, `claude-session-readback`): pass at 02:20:29Z, criterion 4 unmet, waived by 6. It matched the repair's gate row to the current code identity and ran no product suite (D019). N1 recorded the waiver's recording route (D020).
5. **FINAL-001** (this report): dispatched at 02:21:50Z, checkpoint 10. No finding routed to repair; D021 records the reviewer's error.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, merge base | all `6f949464`; no integration at review |
| Tags | local and `origin` end at `v0.52.8`; `v0.52.9` is free |
| `npm test -- --review` | 32 passed, 0 failed, 569.08 s, 76 fresh tasks, exit 0; recorded 2026-09-28T02:33:56.673Z; code identity `d7e3fc14…`, tree `ed6d0dd5`; row `host-gate:d7e3fc140b4795843c79dcca85602b47997e71151db95c61490cb86c411bd118:npm test` |
| Old paths in code, discovery, fixtures and the harness manifest | none |
| Readers of the three retired inputs | receipts 028 to 032 only, quoting the order's Cost line |
| `git check-attr dotln-generated diff binary -- docs/planning/followups.json` | set, unspecified, unspecified |
| `node scripts/authority-mutation-evidence.mjs --check` | exit 0; 178 recorded, 330 current, 57 unchanged |
| `node --test --test-name-pattern='discovery' scripts/test-process-debt.mjs` | 3 passed, 0 failed, 1.34 s |
| `node scripts/release-fixtures.mjs list .`, the library directly, an unknown action | 44 cases; no output; exit 1 |
| `npm run harness -- check` | 31 generated surfaces; local-terms list unavailable |
| `npm run release -- prepare --local` | `v0.52.9` remains current; wrote the snapshot (4,125 bytes) and the PR meter block at cutoff 2026-09-28T02:37:15.988Z |
| `npm run plan -- followups --touching`, then `--apply` of a 16-request batch | 16 rows at `01b460d2…`; all applied; register `fe18cb3d…` |
| `npm run publication:check` | pass |
| `npm run release -- check-surfaces --local` | 51 PASS, 0 FAIL |
| `node scripts/harness-context.mjs --check`, `node scripts/meta.mjs --check`, `npm run plan -- check` | exit 0, exit 0, exit 0 |
| `git diff --check`, `git diff --cached --check` | clean |
| WO-042 transcript and summary, document baseline, manifests, lockfile, `packages/` | no diff against `main` |
| `npm run test:docs` | 23 passed, 0 failed, 12.90 s, 23 fresh tasks, after this report, the PR body and the release notes were written. It was rerun after this row was written. |

## Evidence gate, write-back, non-goals and assumptions

- **Evidence gate:** the grep transcripts are [greps.txt](../../evidence/WO-163/greps.txt); section 3 records the three WO-030 links before the repair. The fixture runs are in the [evidence README](../../evidence/WO-163/README.md) and VER-001. `npm test -- --review` ran at final review, as the order requires. No live row: the mission-check episode was not run (D007).
- **Write-back:** decisions D001 to D021; the WO-142 row (`FUP-4050fe828a686c1e`) retargeted by this review; the WO-099 row (`FUP-abcc64ad8f8c79b9`) settled since 2026-09-21 and unchanged; product 05's 5S section gains the dated sentence naming this pass as the first launchpad Sort.
- **Non-goals held:** no helper is consolidated (WO-162's), no planning document is archived, no sustaining check is added, no local residue is removed, and no behaviour changes beyond the paths and the retired `--write` mode, which the order's D008 route requires.
- **Operator-review assumptions:** (1) `docs/README.md` states no layout rule for `scripts/` and `scripts/lib/`, and no scripts README exists; the layout follows the existing pairs of an entry point and its library (evidence README, Limits). (2) `harness prune --apply` stays with the operator; this review ran neither preview nor apply.

## Handoff

On pass, this review commits the reviewed state in coherent commits with plain subjects and runs `npm run worktree -- publish WO-163` with the reviewed title and the committed `docs/final-reviews/WO-163/PR.md`. That pushes the `wo-163` branch and opens its pull request. The operator's phrase authorizes nothing further. The merge, `main`, the `v0.52.9` tag and the release stay with the operator and release close, which runs in the `main` checkout after the merge.
