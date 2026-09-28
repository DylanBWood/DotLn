# WO-162 FINAL-001 — final review

**Verdict:** pass. WO-162 asked that a standard helper inside the scripts unit and the compiler be defined once and imported, with outputs, stored digests and error messages unchanged, and that the divergences its inventory found be decided, not merged. The subject does that. `scripts/lib/git.mjs` holds the only two Git subprocess declarations, one new module `scripts/lib/helpers.mjs` holds the fixture writer, the pretty-JSON serializer, the bare-hex digest and six receipt helpers, five named JSON readers call `scripts/lib/paths.mjs`, and `compile.ts` imports the two normalizers it used to re-declare. [VER-001](../../verifications/WO-162/VER-001.md) failed on criterion 5 as written and on three decision records under criterion 7. [VER-002](../../verifications/WO-162/VER-002.md) passed all eight criteria after the operator amended criterion 5 and the repair corrected the records. This review read the full subject diff against the original order, merged `main` after WO-163 published, resolved four authored conflicts and the one import WO-163's pull request named, and ran the review gate on the merged subject: 44 passed, 0 failed. It wrote no behavior. It records one first gate attempt that failed at a preflight through my own sequencing, and an index reset I should not have run (Reviewer errors).

**Subject:** [`docs/work-orders/WO-162-in-unit-helper-reuse.md`](../../work-orders/WO-162-in-unit-helper-reuse.md) on branch `wo-162`, uncommitted. Original base: `6f9494649db9a4984911801ae320788264d84ff9`. Integrated base: `main` at `5531cda9cd6f5462e21338226430bfcd34c6e19e`, which is WO-163 published as `v0.52.9`; `git ls-remote origin refs/heads/main` and local `main` both named it. The dispatch checkpoint is `refs/dotln/checkpoint/WO-162/9` (`017caa40`) and the integration checkpoint is `refs/dotln/checkpoint/WO-162/10` (`d77d2f70`).

- The recorded `reportHash` values of VER-001 (`sha256:e0b1bd3a…`) and VER-002 (`sha256:597e7bac…`) equal the reports' current SHA-256.
- The order's text differs from `main` in four places: its heading's version label, criterion 5's four-file exception, criterion 8's permitted overlap, and the two dated sections that explain them. Each amendment is the operator's, recorded as D003 and D012 and bound by a `PlanExecutionAmended` row. The other criteria are the original ones.
- Between the repair checkpoint 6, which VER-002 judged, and checkpoint 10, only `docs/control/current.md`, the order's control segment, the work-order index and VER-002 itself changed. No source byte changed after VER-002 until the integration.
- The review gate ran at code identity `8d9335071cb792b7aa62ac090e93d7a08bb840b539c1dd36b9be15f5abd5cb1a`, tree `a96af7df`. That is the merged subject, not the bytes VER-002 judged; the Integration section states which claims are carried forward and which were measured again.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and, while the review ran, told me that WO-163's pull request carries integration instructions. I read that pull request and WO-163 D011 before merging. The operator made no choice about the verdict and was asked nothing. The harness version is from `claude --version`, and the model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session: the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry. Twelve read-only helpers in VER-001, seven in the repair and a second independent verification had already read this subject, so I read the diff myself. None was spawned.

**Process cost:** entry 89984 tokens; handoff 30969253 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage ffbe437a-47c5-445f-81dc-d82f2bbe4256`. The entry reading was observed at 2026-09-28T02:53:09.385Z. The handoff reading was observed at 03:29:43.569Z, after the judgment text, the pull-request body, the release notes and the follow-up batch were written and before `test:docs` and the result transition. It counts 30,305,671 cached input, 547,506 cache-write, 196 uncached input and 115,880 output tokens over 146 steps and 95 commands. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. Both readings count reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The largest wait was the review gate, 644.87 s; I read the test half of the diff and drafted in session scratch while it ran. Reading the whole diff myself cost more tokens than WO-163's review spent, and less than another helper fan-out over a subject that nineteen helpers and two verifications had already read.

## Goal-aligned judgment

The order is not on a lifecycle critical path, and planning receipt 028 said so: it names no blocked outcome, and its benefit is maintenance. A fix to a Git call, a fixture writer or a digest now lands in one definition instead of in dozens of copies, and the exported `sha256` that returns a prefixed string no longer sits beside bare-hex copies under the same name. The questions for this review were whether any caller's behavior moved, whether the amended criterion still measures what the order meant, and whether the merge with WO-163 changed either answer.

- **Policy resistance** was receipt 028's first known issue: a caller that returned null on failure could become one that throws. It did not happen. `scripts/lib/meta.mjs` and `scripts/lib/authority-probe.mjs` keep their null-on-failure result through `onFailure`, callers that read a raw status or bytes call `spawnGit` or `execGit` with their original arguments, and no decision records a converted site. No fixture in this review's gate met a new refusal. The receipt's reopening condition is not met.
- **Seeking the wrong goal** was its second. The meter reads WO-162's `machineryShare` as 0.367 at cutoff 2026-09-28T03:30:47Z, below the 0.524 the receipt named, and `elapsedPerCodeByte` as 27.23, which is not the series' first value: WO-126, WO-170 and WO-163 carry one. That reopening condition is not met either. The cost is real all the same. The meter counts 92,198,379 observed tokens for this order, this review's 30,969,253 among them, spent on a change whose intended result is that nothing observable changes. No meter signal measures the benefit, so this report claims none beyond the removed copies.
- **Rule beating:** the fixed-input regression compares each former writer definition with the shared writer, not with each file's own adopter. Two other measurements close that gap: VER-001's adopter-level differentials, and this review's gate, which runs every adopter's own suite. The amended criterion 5 names four files and one cause, and the 177-path comparison still has to pass for every other path. It passed again on the merged tree.
- **Drift to low performance:** criterion 5 was amended to the standard the release gates allow, not waived and not quietly read down. The repair corrected D004's false premise in place instead of appending to it.
- **Shifting the burden:** this order cost the operator attention three times before this review, and each is recorded (VER-001's stopped workflow, D013, D016). WO-163 D011 moved the integration fix out of the operator's hands into a record, and it worked as intended: one line, corrected before `scripts/worktree.mjs` ran again. My own failed first gate cost about one minute and no operator attention.
- **Tragedy of the commons, escalation:** no gate step, refusal or dependency is added. The one new regression runs inside the existing `process-debt` suite and takes about 2.7 s.
- **Success to the successful:** immaterial. The helper homes existed or are one small module.
- **Naive Interventionism:** the four divergences stay separate, each with its callers named, and the two defects found while deciding them are follow-ups, not repairs. The skeleton validator kit stays excluded, with its measurement added to the map.
- **NoOp** leaves the copies, the import hazard and the unrecorded divergences.

## Criteria

**Criterion 1:** met

`git grep -n 'spawnSync("git"\|execFileSync("git"' scripts` returns only `scripts/lib/git.mjs` lines 13 and 14, before the merge and on the merged tree with untracked files included. Every former wrapper I read passes its original flags, buffer limit, environment, timeout and failure message: the hookless and fixture-identity variants as leading arguments, the two null-on-failure wrappers through `onFailure`. Wrappers that ran with `cwd` now pass `-C`, which differs only when the directory is missing; VER-001 found no caller that reaches that. VER-001's 33-case differential is carried forward (Integration).

**Criterion 2:** met

No file under `scripts/` defines a generic mkdir-then-write helper or a pretty-JSON serializer other than `scripts/lib/helpers.mjs`. The two Copilot files keep mode `0o600` through the `mode` option, and the integration helper's guarded `put` stays separate. Four files keep a create-the-directory-then-write sequence inside a function with its own purpose (`license-surfaces.mjs`, `lib/meta.mjs`, `probes/local-model-role-qualification.mjs`, `test-release-preparation.mjs`), and one inline pretty-JSON call remains in `scripts/test-release.sh`. They are sites, not definers, and the order left inline sites with their own semantics alone.

**Criterion 3:** met

Both receipt modules import `timestamp`, `validDigest`, `exact`, `parseWithLabel`, `ensureDirectory` and `locked` from the shared module, and each keeps its own `validReceiptId`. The two named test files changed their setup helpers, which criteria 1 and 2 require. No assertion changed: across all 33 changed test files the count of test cases and of `throws` and `rejects` calls is equal before and after, no `skip`, `todo` or `only` is added, and every changed assertion line is a call-site rewrite with the same expected value. VER-001 ran the unchanged baseline bytes of both named files against the new modules, 73 of 73; those modules and tests equal the verified bytes. The `plan-refutation` suite passed in this review's gate.

**Criterion 4:** met

The five readers in `lib/meta`, `lib/harness-prune`, `test-portfolio`, `resident-bind` and `lib/entropy-review` reach `parseJson` or `readJsonFile`. The new `rawErrors` option hands each caller the native error, so each caller's own label or fallback is unchanged, and the default path of both functions is unchanged. VER-001's 102-case differential is carried forward; `resident-bind` and `portfolio` passed in this review's gate.

**Criterion 5:** met

`node docs/evidence/WO-162/compare-fixtures.mjs` on the merged tree: 177 fixture-tree paths, 173 byte-identical, none added, none missing, and the four changed paths are the four the amended criterion names. `main` changed no fixture-tree path between the two bases. `sha256Hex` is exported from `scripts/lib/helpers.mjs` and re-exported beside the unchanged prefixed `sha256` in `scripts/lib/plan-subject.mjs` (D008), and the regression's digest case passed for the eight former definers. Two bare-hex one-liners under other names remain and are outside the order's count: the exported `identityDigest` in `scripts/reactor-identity.mjs` and a test-local `actor` in `scripts/test-process-debt.mjs`. Both predate the order, and operator-review assumption 1 leaves a single wrapper alone.

**Criterion 6:** met

`compile.ts` declares neither `compareText` nor `orderedUnique` and imports both from `normalize.ts`, whose two declarations gained only `export`. `packages/compiler/fixtures`, `packages/compiler/test` and `corpus/` have no diff. The `compiler` and `artifact-corpus` suites passed in this review's gate. Both names join the package's public surface, because `index.ts` re-exports the module.

**Criterion 7:** met

D004 to D007 each decide one divergence and name the dependent callers, and no `inside`, `same`, `text` or `closesFence` definition changed. The two latent defects are named follow-ups and neither is fixed here: `FUP-8369f2b4284e70a8` for paths whose spelling differs from the filesystem's identity, and `FUP-b789b81160c008ea` for text that one interface accepts and another refuses. Both rows are disposed below.

**Criterion 8:** met

`node scripts/authority-evidence.mjs --check` exits 0 on the merged tree with revision 003 selected, and every evidence edition under `docs/evidence/WO-162` equals its verified bytes. `npm test -- --review` passed 44 suites with 0 failed, and `npm run test:docs` passed after this report, the pull-request body and the release notes were written (Checks). `git diff --check` and `git diff --cached --check` are clean. The manifests and the lockfile change only `@dotln/compiler` 0.19.3 to 0.19.4 and its two pins. The diff adds no lint, type or format suppression. Every edit in a file WO-163 names is a helper adoption; WO-163's moves and retirements arrived from `main` and are kept whole.

## Integration

`npm run worktree -- integrate WO-162` fast-forwarded the uncommitted branch from `6f949464` to `5531cda9`, retained checkpoint 10 and the named stash `96a49820`, and needed no merge commit. It resolved five generated projections itself and stopped on four authored conflicts. [D017](../../evidence/WO-162/decisions.md#wo-162-d017) records both bases and each resolution.

| Path | Resolution |
| --- | --- |
| `scripts/lib/github-repository.mjs` | No conflict: Git carried this order's added import across WO-163's rename, where `./lib/git.mjs` does not resolve. Corrected to `./git.mjs` before the helper ran again, as WO-163 D011 and its pull request said. |
| `scripts/authority-mutation-evidence.mjs` | WO-163's historical check and its retired `--write` are kept whole. This order's adoption is applied to what remains: `runGit` with the same exec options, and `sha256Hex`. |
| `scripts/lib/release-fixtures.mjs` | WO-163's removal of the command block and of the import only that block used, with this order's `spawnGit` import. |
| `scripts/test-worktree-integration.mjs` | WO-163's two-entry copy list, with this order's `runGit` call. |
| `docs/product/06-roadmap.md` | Both activation notes, WO-162's above WO-163's; release preparation added the retiming note. |

Six other scripts that both orders edit merged without a conflict. For all ten merged paths, every line that differs from `main` is a helper import, a call-site rewrite with the same arguments and options, `prettyJson`, `sha256Hex` or `readJsonFile`, the registration of this order's modules in the runner, or the copy of three library files into one isolated fixture.

- **Version.** `v0.52.9` is WO-163's published tag. Release preparation retimed this order's unpublished patch to `v0.52.10` under its recorded classification. `@dotln/compiler` 0.19.4 stays valid: WO-163 changed no package source.
- **Carried forward with their original evidence:** criteria 1 to 4, 6 and 7. Of the code paths that differ from the verified checkpoint, seven equal `main`'s bytes, ten are the merged paths above, and the two new files equal the verified bytes. Every other helper home and adopter is unchanged since VER-002.
- **Measured again on the merged tree:** criteria 5 and 8, by the fixture comparison, the helper regression, the authority check, the historical mutation check and the review gate.
- **Evidence editions.** None was re-minted by the integration, and the console fixtures equal their pre-integration bytes.

## Rows

`npm run plan -- followups --touching` returned 29 rows at register revision `988bcab8d738969de8d439547d139b61ccfef769404d23af0bc8413e86e1ccc0` (four pages). One batch through `followups --apply` disposed all 29, and the register moved to `b1bac9d018303b93d120bf5242648d5b9be0ebfea1e2beb977fa4f556328df5a`. Each reason cites this report. Several rows reopen at "the next order that edits" a file this order edited. Where this order's edit is a helper adoption, its non-goals exclude the behavior change the row asks for, so the row is deferred again under the same condition and the reason says so.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-7932ccddcde95d4f (WO-163 D011) | the shared scripts | settled | This review made the import correction and resolved the shared paths (D017). |
| FUP-5e2f4ce16f9e8be1 | the three authority revisions | open, for the planner | Its first condition is met by measurement: 783 evidence files totalling 29.52 MB were added since the last commit before 2026-09-21. WO-162's share is 0.6 MB, and its two unselected revisions are 76 KB each. |
| FUP-beb13d8d099d2917 | the receipt modules, WO-162 | open, for the planner | The row waited on this order's refactor of the same helpers; it returns to the planner as WO-162 closes. |
| FUP-8369f2b4284e70a8 (D004) | WO-162 | open, for the next planning pass | The variant-spelling containment defect, reproduced in scratch and not fixed here. |
| FUP-9625ca888d7d08f5 (D016) | `plan-receipts.mjs`, WO-162 | open, for the planner | How a wrong execution amendment is corrected. This review accepts D016's removal of the executor's own uncommitted row (Findings). |
| FUP-045a0a480f95bcc7 (WO-163 D012) | `github-repository.mjs` | open, for the planner | WO-062 and WO-065 still cite the old path; this order changes one import in the moved file. |
| FUP-71fc2efc208f597a | decisions.md, index | open, unchanged | WO-162's decisions paraphrase the operator and record two selected option labels (D003, D012); they quote no operator chat. |
| FUP-60eff31012712921 | WO-162 | deferred, condition restated from D006 | D006 decided the divergence. A probe showed text one validator accepts and another refuses; no production transfer joins the two surfaces. |
| FUP-b789b81160c008ea (D006) | WO-162 | deferred, same condition | The interface mismatch is recorded; text contracts are this order's non-goal. |
| FUP-005a8af5234cb3f3 | WO-162 | deferred, same condition | The map candidate gained this order's measurement, as the write-back duty requires. |
| FUP-4a1d1fc3611506a1 | `resident-bind.mjs` | deferred, same condition | Helper adoption only; the profile comparison it asks for is a behavior change. |
| FUP-e55e258d37cb3f20 | `planning-followups.mjs`, `refute-plan.mjs` | deferred, same condition | Helper adoption only; the three feed defects are untouched. |
| FUP-b1163d128e371b7f | `test-runner.mjs` | deferred, same condition | `changedMachinery` gained a call-site rewrite only. Both new files are declared in `process-debt` and were staged before this review's gate. |
| FUP-e821aa2ced3aa111 | `git.mjs`, `test-runner.mjs` | deferred, same condition | Helper adoption only; TAP selection and the other members are untouched. |
| FUP-406744f5e9966250 | `worktree-integration.mjs` | deferred, same condition | This integration met neither defect: generation waited for the conflicts, and the stub was written once with its release line. |
| FUP-50cda1c03ecd8ea8 | `harness-prune.mjs`, meta.json | deferred, same condition | The proof text is serialized by the shared helper with the same bytes; usage retention is untouched. |
| FUP-e62c63344f52405f | `harness-prune.mjs` | deferred, same condition | `stash-drop.mjs` is untouched. |
| FUP-e2cf2122a642d1e0 | `release-list-cache.mjs`, `release.mjs` | deferred, same condition | The release listing and `manifestWorkOrders` are untouched. |
| FUP-8cfd3ff52146a016 | `release.mjs`, `test-harness.mjs` | deferred, same condition | Release close and the writer protocol are untouched. |
| FUP-fa028783f3f6b17f | `lib/meta.mjs`, `release.mjs` | deferred, same condition | The meter's reader and Git wrapper adopt helpers; release preparation's behavior is untouched. |
| FUP-4475529d727a4d25 | `paths.mjs` | deferred, same condition | Neither corpus script changed. |
| FUP-50a41e39f51a3e01 | `plan-direct.mjs` | deferred, same condition | One serializer call; no order edited the goal standard. |
| FUP-56b599e15f97e666 | `evidence-sources.mjs` | deferred, same condition | Three registered sources added; `resident-state.ts` is unchanged. |
| FUP-7f9a27e6ed6c44b3 | `work-orders.mjs` | deferred, same condition | One unused import removed. |
| FUP-94bff00e748a26af | `test-observed-facts.mjs` | deferred, same condition | `observed-facts.ts` is unchanged. |
| FUP-acfe4bfda716d8fb | current.md | deferred, same condition | Generated projection only. |
| FUP-ea936acad1506e18 | `lib/harness.mjs` | deferred, same condition | The bundle's pins moved with the compiler label; its shape did not, and `harness check` reports 31 surfaces. |
| FUP-f1c7a256bec46737 | `harness-context.mjs` | deferred, same condition | Every role profile reads delta 0; the smallest headroom is the reviewer's 405 bytes. |
| FUP-fd05316b6030ef73 | README.md, the index | deferred, same condition | The release line and a generated index; the writer text is untouched. |

## Findings

No finding is routed to repair, and no criterion fails.

- **D016, judged.** The executor removed its own superseded amendment row from `docs/control/plan-refutations.jsonl` by hand and named this review as the judge of that. The 27 committed rows are a byte prefix of the working log (their SHA-256 is equal), the two remaining rows bind D003 and D012, and `npm run plan -- check` exits 0 on the merged tree with the retimed heading. The removed row was never committed and its hashes are recorded. I accept the removal as bounded and recorded. The machinery gap that made it necessary is `FUP-9625ca888d7d08f5`.
- **Observation: planning counts.** The order counts 20 writers, 9 serializers and 8 digest copies; the activation tree held 31, 11 and more than 8, and all were adopted. The order's premises that no `scripts/` source is registered and that its files are disjoint from WO-163's were both wrong (D010, D003). None changes a criterion.
- **Observation: unused names.** A TypeScript check of the 94 changed script modules found no unresolved name, missing export or unresolvable import. It reported nine unused names in changed files; the eight I checked by count occur as often in the baseline bytes and on no changed line.

## Reviewer errors in this session

- **A failed first gate.** I completed D017 and started `npm test -- --review` without refreshing the decisions index. The gate's `meta` preflight refused in 3.61 s (9 passed, 35 failed, recorded 2026-09-28T03:08:48.431Z). That row records my sequencing, not the subject. I ran `npm run meta` and the document gate, then the review gate once more.
- **An index reset.** While classifying paths I ran `git add -N .` followed by `git reset -q -- .`. The procedure says never to reset. It touched the index only: it unstaged what the integration had staged and changed no working-tree byte. I confirmed 129 modified and 6 untracked paths, no unmerged path and no intent-to-add entry, read the four resolutions again, and staged the subject before the gate. D017 records it.
- **Refused or mistyped commands.** `harness evidence --status` is not a command and was refused with its usage text. Beside the live gate a heredoc and an unquoted glob were each refused with nothing written. An unquoted list variable produced two empty diff files, which I rebuilt. I joined two files' output with `echo ==========`, and zsh expanded the `=` word, the same error two earlier reviewers recorded.

## Verification sequence

1. **Implementation** (executor, Codex CLI 0.157.1, `gpt-6-astra`, ultra recorded as xhigh with subagents, `codex-session-readback`): activated at 2026-09-27T23:42:13Z; `ImplementationReady` at 2026-09-28T00:34:01Z, checkpoint 2. D001 to D011.
2. **[VER-001](../../verifications/WO-162/VER-001.md)** (Claude Code 2.1.283, `claude-opus-5-5`, ultracode recorded as xhigh with subagents, `claude-session-readback`): fail at 01:33:24Z. F1: D004 rested on a false premise and a reproduced defect had no follow-up. F2: D005 and D006 omitted dependent callers. F3: criterion 5 unmet as written, with no code repair available. Six criteria met.
3. **Repair** (executor, Claude Code 2.1.283, `claude-fable-5-1`, ultracode recorded as xhigh with subagents, `claude-session-readback`): `RepairRequested` at 01:34:32Z; the operator amended criterion 5 (D012); `RepairCompleted` at 02:40:28Z, checkpoint 6. D012 to D016.
4. **[VER-002](../../verifications/WO-162/VER-002.md)** (Codex CLI 0.157.1, `gpt-6-sol`, xhigh, `codex-session-readback`): pass on all eight criteria at 02:51:53Z, checkpoint 8.
5. **FINAL-001** (this report): dispatched at 02:52:55Z, checkpoint 9. Integrated `main` at `5531cda9` (D017). No finding routed to repair.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, local `main`, merge base at entry | `5531cda9`, `5531cda9`, `6f949464`; integration due |
| Report hashes | VER-001 `e0b1bd3a…` and VER-002 `597e7bac…` equal their recorded `reportHash` |
| Source bytes since VER-002 | checkpoint 6 to 10: two control projections, the control segment and VER-002 only |
| Subject diff read | 129 tracked files and 6 untracked entries at entry. Read line by line: 60 production scripts, 33 test scripts, 2 new scripts, 3 compiler sources, 3 package manifests and the lockfile. Read by their changed lines: 4 console fixtures and the 14 generated hook and manifest files, whose changes are the compiler label, the policy hash, the runtime snapshot and its pins |
| TypeScript 7.0.2 `--checkJs` over the 94 changed script modules | no unresolved name, missing export or unresolvable import |
| Assertion comparison over 33 changed test files | test cases, `throws` and `rejects` equal; no skip added; `assert.` calls equal, or one more in three files where a fixture option asserts on failure |
| Added suppressions | none |
| `npm run worktree -- integrate WO-162`, then `--continue` | exit 1 with four authored conflicts, then exit 0; `v0.52.9` retimed to `v0.52.10` |
| Criterion 1 search on the merged tree, with untracked files | `scripts/lib/git.mjs` lines 13 and 14 only |
| `node --test scripts/test-helper-reuse.mjs` | 4 passed, 0 failed: 31 former writers over 99 inputs, 4 serializer families, 8 digest definers, Git and receipt adapters |
| `node docs/evidence/WO-162/compare-fixtures.mjs` | exit 0; 177 rows, 173 unchanged, 4 changed, none added |
| `node scripts/authority-evidence.mjs --check` | exit 0; revision 003 |
| `node scripts/authority-mutation-evidence.mjs --check` | exit 0; 178 recorded, 330 current, 57 unchanged, the figures WO-163's review read |
| `node scripts/release-fixtures.mjs list .` | 44 cases |
| `node scripts/harness.mjs check` | 31 generated surfaces; local-terms list unavailable |
| `npm run publication:check`, `npm run plan -- check`, `node scripts/meta.mjs --check` | pass, exit 0, exit 0 |
| `npm run release -- check-surfaces --local` | every row PASS |
| `npm test -- --review`, first attempt | exit 1 at the `meta` preflight, 3.61 s (Reviewer errors) |
| `npm test -- --review` | 44 passed, 0 failed, 644.87 s, 88 fresh tasks, exit 0; recorded 2026-09-28T03:20:29.903Z; code identity `8d933507…`, tree `a96af7df`; row `host-gate:8d9335071cb792b7aa62ac090e93d7a08bb840b539c1dd36b9be15f5abd5cb1a:npm test` |
| `npm run plan -- followups --touching`, then `--apply` of a 29-request batch | 29 rows at `988bcab8…`; all applied; register `b1bac9d0…` |
| `npm run release -- prepare --local` | `v0.52.10` remains current; wrote the snapshot (4,156 bytes) and the PR meter block at cutoff 2026-09-28T03:30:47.281Z |
| `git diff --check`, `git diff --cached --check` | clean |
| `npm run test:docs` | 23 passed, 0 failed, 12.59 s, 23 fresh tasks, after this report, the pull-request body, the release notes and the register batch were written. It was rerun after this row was written. |

## Evidence gate, write-back, non-goals and assumptions

- **Evidence gate:** the regression transcript is [helper-regression.txt](../../evidence/WO-162/helper-regression.txt), the before and after digest comparison is [fixture-digests.json](../../evidence/WO-162/fixture-digests.json) with its script, and `npm test -- --review` ran at final review. No live row, as the order states.
- **Write-back:** decisions D001 to D017, and the work-order map's skeleton validator candidate with this order's measurement: 12 declarations, 2,280 bytes, 162 calls and 996 surplus bytes.
- **Non-goals held:** no skeleton protocol file changed, no cross-unit package was added, the generated hooks keep their inlined helpers, and the `inside`, `same`, `text` and fence semantics are decided and unchanged.
- **Operator-review assumptions:** (1) single wrappers and two-line copies were left, among them the two bare-hex one-liners criterion 5 names above. (2) Both latent defects became follow-up rows, not repairs.

## Handoff

On pass, this review commits the reviewed state in coherent commits with plain subjects and runs `npm run worktree -- publish WO-162` with the reviewed title and the committed `docs/final-reviews/WO-162/PR.md`. That pushes the `wo-162` branch and opens its pull request. The operator's phrase authorizes nothing further. The merge, `main`, the `v0.52.10` tag and the release stay with the operator and release close, which runs in the `main` checkout after the merge.
