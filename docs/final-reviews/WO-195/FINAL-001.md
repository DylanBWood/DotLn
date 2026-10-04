# WO-195 FINAL-001 — final review

**Verdict:** pass. WO-195 asked that a Claude release close finish publication and cleanup in the session the operator dispatched, and that a planning pass push its branch and open its pull request. This review judged the original order's eight criteria against the repaired, integrated subject, and all eight are met. VER-001's finding and its three Adjacent Repair items stay settled at this subject. A fresh `npm test -- --again --review` at the reviewed code identity passed 41 of 41 suites with 91 fresh tasks. This review changed no source and filed no new finding. Its only edit to the subject empties four whitespace-only lines in two regression transcripts, which staging exposed to `git diff --cached --check`. It disposed six register rows. [WO-195-D021](../../evidence/WO-195/decisions.md#wo-195-d021--final-review-pass-no-integration-due-one-named-deferral) records the one named deferral: WO-185-D016's `worktree publish --target` ordering in `scripts/worktree.mjs`.

**Subject:** [`docs/work-orders/WO-195-roles-finish-what-was-dispatched.md`](../../work-orders/WO-195-roles-finish-what-was-dispatched.md) on branch `wo-195`, uncommitted over `main` at `72bc3ab39608aa5a058fff8337d1584429289893`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-195/10` (`d7fde2a5`).

- The base: after `git fetch origin main`, `origin/main`, local `main` and `HEAD` all name `72bc3ab3`. That is the upstream D017 to D019 integrated during the repair, from the original base `340a67c9`, so no integration was due.
- The reports: the recorded `reportHash` of VER-001 and VER-002 each equals the report's current SHA-256.
- The order: it differs from `main` only in its heading's version label, `(v0.66.1)` → `(v0.66.2)`, the retime D019 records. The eight criteria are the original text.
- The staging: at dispatch, the integration's retime and projection updates were unstaged: the README release line, the order heading, the skeleton and console package files, two lock-file lines, the evidence selector, the control projection, the decisions index and the work-order index. The order's records (control log, evidence, reports) were untracked. This review staged all of them before the gate. Staging left the gate code identity at `8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46`, the identity VER-002 judged.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.289","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.289). The model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it; it is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before any work that could spawn: none, against the cap of 20, with 0 observed at entry. The source diff against `main` adds 2,708 lines across 42 files. About 1,100 of them repeat the generated recovery in ten hooks, and about 950 are tests and fixtures. Two verifications and two executor consultants had already read it in full, so this session read the behavioral sources directly. No subagent ran.

**Process cost:** entry 86304 tokens; handoff 21035364 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 69ceab50-621b-4fc5-b5ff-7f87b8b868df`.

- Entry was observed at 2026-10-04T15:57:19.618Z.
- Handoff was observed at 16:22:41.928Z, after D021, the register batch and this report's text, and before the last `test:docs` and the result transition. It counts 20,662,558 cached input, 285,583 cache-write, 202 uncached input and 87,021 output tokens over 106 steps and 98 commands. The counter reports 0 subagents, exact-observed, with 20 of 20 remaining.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the fresh gate, 859.85 s. The first observation below records why this review paid it.

## Goal-aligned judgment

The mission contribution is the end of each order's cycle. Before WO-195, half the recorded Claude closes needed the operator's own command, the admission WO-178 added never fired, and each close put about 300 KB of output into the session. The planning pass also left the push and pull request to the operator. The question for this review was whether the close and the planning pass now finish what was dispatched without weakening a refusal.

- **Rule beating and seeking the wrong goal:** a clean summary label is not the goal. This review judged the admission's facts and its place in the refusal order, disk and branch state, and the role bytes, not suite counts.
- **Policy resistance:** the admission requires every fact it required before. This review checked that its new early advisory skips no refusal. The gate-write and planning-branch refusals run before it, an outside-write denial still wins over it, and the branch it short-circuits returns only `allow`, an advisory or `{}`.
- **Success to the successful:** two verifications and a covering gate row did not replace the fresh gate the order names at final review.
- **Drift to low performance:** the deferred items stay register rows with conditions, not report text.
- **Shifting the burden:** the D021 deferral hands planning an unrelated, environment-dependent ordering defect with its reproduction. This order's own close-path fix ships now.
- **Escalation and the tragedy of the commons:** one fresh gate, no subagent, and short probes run one at a time.
- **Naive Interventionism:** a reviewer does not write and certify a fix. This review found no defect that needed one, and changed no source.
- **NoOp:** without a pass, `main` keeps the stranded dispatch, the 300 KB outputs and the half-removed worktrees.

## What this review read

- **The whole order, VER-001, VER-002, the handoff and D001 to D020.**
- **Admission, in full** (`packages/skeleton/src/harness-host.ts`): `releaseCloseAdmission` and its call site in `evaluateExistingHarnessHook`, read against the refusals before it (`activeGateWriteRefusal`, `planningWriteRefusal`) and the outside-write precedence after it.
  - The admission now returns `null` unless the command begins with the exact `<node> <main>/scripts/release.mjs close WO-NNN ` prefix. Past that prefix, a missing dispatch, a dispatch for another order, a typed correction, an inexact spelling, a non-main working directory or tool `cwd`, an illegal action or an unreadable fact each returns an advisory that names it.
  - Main is found by its `refs/heads/main` row, the same rule as `mainWorktree`.
- **The stale-runtime recovery, in full** (`packages/compiler/src/harness.ts`). It runs only for `UserPromptSubmit` with the exact prompt `resume: release close`, and never under Copilot.
  - Before it builds, it requires a session id, a `cwd` that is the root, the root as main's worktree and canonical status listing `release-close`. Under the writer reservation lock, a writer blocker or a live gate stops it.
  - It builds and emits with 120 s bounds, then replays the hook once with a guard variable, so a second pass cannot loop.
  - Only `.claude/hooks/session.mjs` is registered for `UserPromptSubmit` among the generated hooks that carry it, and only that hook's timeout is 600 s.
- **The builder and its users** (`scripts/lib/git.mjs`, `resume.mjs`, `worktree.mjs`, `worktree-material.mjs`, `release.mjs`).
- **Cleanup, in full:** `scripts/lib/worktree-removal.mjs`, `finishPublishedWorktree`, the close entry point and `releaseCloseSummary` in `scripts/release.mjs`, and `removePreservedWorktree` and its two callers in `scripts/worktree.mjs`.
  - The teardown lock lives under the system temporary directory, so removing the subject cannot remove the lock.
  - A permission restore after a successful removal skips paths that no longer exist.
  - The writer is released only when cleanup is not blocked (D009).
- **Roles and write-backs:** `contributor.ts`, the four generated skill files, product 07, `docs/AI-HARNESS-SECURITY.md` and the publication lock.
- **Fixtures:** `scripts/test-close-admission.mjs` and the test diffs of `test-harness.mjs`, `test-release.sh`, `test-worktree.sh`, `test-process-debt.mjs` and the two skeleton tests. The large shell cases were read where the criteria name them, and their run is the gate.

## Criteria

- **Criterion 1:** met. The gate's `harness-fixtures` suite passed, including "WO-195 stale main prepares the runtime then records the normal release-close dispatch", "WO-195 stale fallback withholds preparation and names a missing admission fact" and "WO-195 each script printer produces admitted bytes and missing facts are named", which holds the normal-mode withheld cases. VER-001 ran the same fixtures against an `efe62994` archive, where the stale-main prompt received only the `pins-differ` fallback advisory and no dispatch. That run is `regressions/stale-runtime.txt`. This review read the recovery and the admission as described above.
- **Criterion 2:** met. `releaseCloseCommand` (`scripts/lib/git.mjs:143`) is the only printer. A grep of `scripts`, `packages/skeleton/src` and `packages/compiler/src` finds no bare `node '…release.mjs' close` spelling; the only bare `node` command spellings left are in `scripts/resident-bind.mjs`, which prints no release-close command. `releaseCloseCommand(` has 13 call sites, in `release.mjs`, `resume.mjs`, `worktree.mjs` and `worktree-material.mjs`. The shell fixtures write the actual briefing, publish handoff, prepared output, material output and blocker records, and `test-close-admission.mjs` admits each one. They passed in the gate's `release:case:` cases and its `worktree` suite. The `efe62994` run fails on the actual material command (`regressions/printer-admission.txt`).
- **Criterion 3:** met. `close_completion`, `surfaceclose` and `runtime_refresh` passed in the gate. The summary names `Full report:` and the report sits beside `release-close.json`. VER-001's F1 is settled: the no-release refresh line goes through the report writer (`release.mjs:2194-2199`), and the only direct stdout write left on the close path is the summary in the entry point's `finally`. D005 records the sizes: 512, 763 and 347 bytes. `releaseCloseSummary` did not change in the repair.
- **Criterion 4:** met. `close_completion`, `close_sealed`, `close_leftover`, `close_retry_paths` and `close_receipt_recovery` passed in the gate.
  - (a) A nested `0500` directory is removed after its declared material is preserved, and a symlink target outside the subject keeps `0500`.
  - (b) An unregistered subject directory stays a `leftover` blocker. A re-run removes it when its receipt verifies, and refuses it when the receipt is missing, corrupt or bound to another path.
  - (c) The removing run deletes the branch, and the dry run prints `would-delete`.
  - The three `efe62994` runs fail at the branch preview, the sealed removal and the leftover record (`regressions/results.json`). VER-002 ran the repair's four cases failing against checkpoint 5 and passing at the subject.
- **Criterion 5:** met. `contributor.ts:71` and `:202` carry both sentences. The release-close sentence appears once in each of `.claude/skills/dotln-release-close/SKILL.md` and `.agents/skills/dotln-release-close/SKILL.md`, and the planner sentence once in each planner root. No skill root or skeleton source contains "repeat transitions" or "without repeating publication". Both read as the Design states. The release-close sentence adds "A retry after main moves can refuse and remains a blocker", which the order's known issues require. The planner's existing sentence now ends "Leave implementation, activation and releases to their authorized dispatches". The pass's own pull request is no longer left to another dispatch, and releases still are. `executor-supports.test.ts` asserts every clause in every generated role, and the `skeleton` suite passed in the gate.
- **Criterion 6:** met.
  - Product 07 §Workflow closeout and releases states the completion condition, the retry and the removal rules (lines 1358 to 1415), and §Operator-opened planning pass states the push and pull request (line 1101).
  - The auto-mode row of `AI-HARNESS-SECURITY.md` states when the admission applies.
  - D002 records the means and D005 the measured size.
  - The publication lock for `software-engineer-toc.md` is refreshed, and the `publication` suite passes in the document gate.
  - This review found no statement in these texts that the code contradicts.
- **Criterion 7:** met. `docs/evidence/current.json` selects authority revision 004, re-minted after the integrated bundle staled 003, and artifact-identity, verification and feedback revision 003 (D019). The four evidence suites, `harness` and `harness-evidence` passed in the gate. `node scripts/harness.mjs check` reports 32 generated surfaces.
- **Criterion 8:** met.
  - `npm test -- --again --review` passed: 41 passed, 0 failed, 859.85 s, 91 fresh tasks, recorded 2026-10-04T16:19:50.694Z at code identity `8d2d7373…`, tree `4a8143cc`. Its transcript has no `not ok` line.
  - `npm run test:docs` passed: 24 passed, 0 failed, 39.06 s, 24 fresh tasks, recorded 2026-10-04T16:23:39.155Z at the same code identity, with D021, the register batch, this report, PR.md and RELEASE-NOTES.md in place. The result transition runs it again inline.
  - `git diff --check` and `git diff --cached --check` both exit 0. The cached check first flagged four whitespace-only lines in `regressions/printer-admission.txt` and `regressions/stale-runtime.txt`, files that were untracked when VER-002 ran its checks. They hold Node assertion-diff indentation, two spaces each. This review emptied those four lines and changed no other byte (D021).
  - The package changes are the compiler 0.25.0 → 0.25.1 and skeleton 0.52.1 → 0.52.2 versions, their source constants, the console's exact pin and the lock file's version lines. No package is added or removed.

## Register

`npm run plan -- followups --touching --work-order WO-195` returned 23 rows over three pages at register revision `9e594e2ba413dad2976d38f3db6eaa4a3378b174864401c70d74e589dfe012e1` (116 paths and WO-195, 178 pending). D021's `reopens` observation added a source revision to FUP-a5c6ac8cb40bd52a. One `followups --apply` batch then disposed six rows and the register moved to `8cc8acadda2b82c8b02ef73def596fe44a0314f6d41cf89238ff4e1a78a953a1`. Each reason cites this report.

| Row | Disposition recorded | Why |
| --- | --- | --- |
| FUP-f9c8560de28a24e0 (D012) | settled | F1 and R1 to R3 repaired in D013 to D016. VER-002 ran each case failing before the repair and passing after it, and this review's gate passed them. |
| FUP-a5c6ac8cb40bd52a (WO-185-D016) | deferred, D021's condition | `worktree publish --target` resolves main before it checks its arguments. The defect is in a file this order declares, but it is unrelated and unchanged, and this gate did not meet it (D021). |
| FUP-8cfd3ff52146a016 (WO-166-D008) | deferred, same condition | This order changes when a close releases the writer: a blocked cleanup keeps it for the same session's retry (D009). The fixtures still use the shell adapter, and no real close has run this code. |
| FUP-da471832071118c7 (WO-176-D029) | deferred, same condition | The order keeps the moved-main retry deferred. This change reads close history per path but leaves `ensureExistingRelease` unchanged. |
| FUP-e8f5399db33d0b5a (WO-185-D028) | deferred, same condition | This order edits `scripts/test-runner.mjs` only in its machinery-source table. It opens none of the five guard or runner paths. |
| FUP-f1c7a256bec46737 (WO-054-D006) | open, kept with a new measurement | The release-close role grows 323 bytes and the planner 296. Every role is within its ceiling. |

The other seventeen rows were textual matches. This change did not open their seams, and their conditions did not occur, so they are left as they are.
- FUP-cd1a227413938345: the four product 07 paragraphs carry no date.
- FUP-ec72b2ea596bdc75: the planner's sentence on repairs after a judgment is unchanged.
- FUP-adf6621e7f958dd8: `authority.json` copies are 5.58% of the tracked and pending evidence bytes, against a 10% condition, and `authority-evidence.mjs` is unchanged.
- FUP-fb8cbeabbddef397: the document gate ran in about 40 s.
- FUP-04ec9fa011f39d93: this review's gate met no deterministic failure.
- The rest: FUP-0132, FUP-0804477ea9d640a7, FUP-33173b7f87004a9c, FUP-4b70089b028849f0, FUP-51c310284c2fea17, FUP-7fd69f3bda6fa326, FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-b3454d6ce3594ef3, FUP-d0a9719cc2e4ec55, FUP-e821aa2ced3aa111 and FUP-fd05316b6030ef73.

## Integration and carry-ins

- **Integration:** none due. D017 to D019 integrated `main` at `72bc3ab3` from `340a67c9` during the repair, under the operator's `scope expand: merge in main`.
  - The integration resolved two authored conflicts: the evidence selector and the role oracle, which gained a linked combined oracle.
  - It retimed the skeleton 0.52.1 → 0.52.2 after `main` consumed 0.52.1, and the application to v0.66.2.
  - It re-minted authority revision 004.
  - VER-002 checked that the six core repair sources equal checkpoint 6 byte for byte.
  - This review reads D018's carried-forward claims as complete: D019 and D020 name both bases, the resolved paths, the collision and the checks. The document gate, whose `release-surfaces` task runs `check-surfaces --local`, passes at this subject, and `release prepare` against origin's tags keeps v0.66.2.
- **WO-188 item 2** (one builder for the release-close command) is done here, as the order states.
- **The moved-main retry** stays deferred on FUP-da471832071118c7, as the order requires.

## Verification sequence

1. **Activation:** 2026-10-03T16:31:39Z, checkpoint 1.
2. **Implementation** (Codex CLI 0.160.0, `gpt-6.1-sol`, max, `codex-session-readback`): `ImplementationReady` at 19:27:18Z, checkpoint 2. D001 to D011.
3. **[VER-001](../../verifications/WO-195/VER-001.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): fail at 2026-10-04T05:36:16Z. Criterion 3 was unmet: a no-release close with a stale runtime wrote one line outside its retained report (F1). R1 to R3 went to the repair (D012).
4. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): requested 13:59:34Z, completed 15:40:05Z, checkpoint 7. D013 to D020, including D017 to D019's operator-authorized integration of `main` at `72bc3ab3`.
5. **[VER-002](../../verifications/WO-195/VER-002.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): pass at 15:56:15Z.
6. **This review** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): dispatched 15:57:09Z, checkpoint 10. D021.

## Executed checks

Every probe outside the gate was read-only or ran under `node scripts/harness.mjs bounded`, one at a time. Transcripts are in this session's DotLn scratch.

- **State:** `npm run resume --silent -- status --json`, `node scripts/harness.mjs writer --show`, usage at entry, and `git fetch origin main` with the base comparison.
- **Hashes and identity:** report hashes against the control events; `gateCodeIdentity` before staging, after staging and on the gate row.
- **Product gate:** the plain `npm test -- --review`, which reused the covering row and started no suite, then `npm test -- --again --review`, as recorded under criterion 8. Transcripts: `final-gate.log` and `final-gate-again.log`.
- **Criteria 2 and 5:** source greps for the bare `node` helper spelling and for `releaseCloseCommand(` users; sentence counts in both skill roots; a search for the superseded words.
- **Write-backs:** `node scripts/harness-context.mjs --check`, `node scripts/harness.mjs check` and `git diff --check` with `git diff --cached --check`.
- **Register:** the `followups --touching` pages and the `--apply` batch above, and the `authority.json` byte share.
- **Clean room:** a search of the order's new evidence, reports and diff for home paths and private identifiers found none.

Not re-run: VER-001's `efe62994` archive runs and VER-002's checkpoint-5 variants. Each fails-before clause stands on those recorded runs and on `regressions/`. No live release close, classifier admission or real `npm run build` inside the hook's bounds ran, because the order makes its own close the first live observation.

## Observations with no finding

- **The first gate invocation reused a row.** This review's first `npm test -- --review` found the executor's complete passing row at this identity (2026-10-04T15:29:01.437Z, 41 suites) and started no suite. The order names a run at final review, so this review ran `--again`. That cost 859.85 s of host time. It passed, so the verdict does not rest on the choice.
- **An unreadable unknown receipt fails closed.** VER-002 reproduced it: a truncated `worktree-removal-*.json` that history does not name makes discovery throw. The close records a `cleanup` blocker with its retry, deletes nothing and keeps the branch, but the reason does not name the file. Reaching that state needs a direct `finish` and a torn write.
- **A blocked close keeps main's writer.** This is the intended same-session retry (D009). If the session ends first, the reservation waits for the writer protocol's own release, as before. FUP-8cfd3ff52146a016's condition watches the first real case.
- **A pre-existing reopen candidate.** `npm run meta` reports `REOPEN WO-150-D003` on executor cold-start bytes (28,457 against 24,576). This order leaves the executor role unchanged (Δ 0), so it is not this order's to act on.
- **The role sizes.** release-close is 17,660 bytes of its 21,266 ceiling and the planner 19,478 of 24,576 (`harness-context --check`).

## Publication

The verdict is pass, so this review prepares [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md), records `final-review-result pass`, commits the reviewed state and runs `npm run worktree -- publish WO-195` with that title and body. It does not merge, push `main` or publish a release.
