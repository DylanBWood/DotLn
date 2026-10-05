# WO-186 FINAL-001 — final review

**Verdict:** fail on criterion 3. WO-186 asked that gate time follow the change: three slow cases repaired at their cause, a rerun that runs only the tasks with no passing result at the code identity, a fresh worktree that reads main's row, an identity that covers untracked code, and a role that writes its own records while its product gate runs. A fresh `npm test -- --review` at the reviewed code identity passed 36 of 36 suites with 86 fresh tasks, and ten of the eleven criteria are met. One defect in the completion's claim check was reproduced here, in a file the order declares. A reviewer does not write and certify a fix, so the order returns to repair:

- **F1 (criterion 3): the claim check answers with main's row after the worktree's own run of a task failed.** In a linked worktree that stands on main's passing row and has no `npm test` row of its own at that identity, a failed `npm test -- --only <task>` is that task's latest run. The runner treats it so and runs the task on the next plain run. The claim check accepts main's row with no advisory. That masks a later failed run with an older pass, which is the rule VER-001 set for this criterion and which D035 and product 07 state as held ([D041](../../evidence/WO-186/decisions.md#wo-186-d041--final-review-fail-on-criterion-3-the-claim-check-answers-with-mains-row-after-the-worktrees-own-run-failed)).
- **R1 to R3:** three lower items, each reproduced here, go to the same repair through Adjacent Repair (D041).
- **Unreproduced items:** eight items this review read and did not execute, and three record notes, ride with that repair for one disposition each ([D042](../../evidence/WO-186/decisions.md#wo-186-d042--final-review-items-read-and-not-reproduced-for-the-repair-to-dispose)).

**Subject:** [`docs/work-orders/WO-186-gate-time-follows-the-change.md`](../../work-orders/WO-186-gate-time-follows-the-change.md) on branch `wo-186`, uncommitted over `main` at `2816c773008c66b8ab0ac4a0fd73c21b7df9f2d0`. `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, the merge base and `HEAD` all name that commit, at dispatch and again after the gate, so no integration was due and the helper was not run. The dispatch checkpoint is `refs/dotln/checkpoint/WO-186/9` (`e1258476`).

- The reports: the recorded `reportHash` of VER-001 and of VER-002 each equals the report's current SHA-256.
- The order: it differs from `main` in its heading's version label, `(v0.66.3)`, and in D020's amendment of the objective and of criteria 1 and 9, which the operator directed and `docs/control/plan-refutations.jsonl` records as `PlanExecutionAmended`. This review judged the amended text.
- The identity: the gate code identity is `dea58b070d67cc37483fb0ceabb9d7fb55e46fda478169cae7e63554a255870a`, the identity VER-002 judged. This review staged the three new source files (`scripts/lib/case-marker.mjs`, `scripts/lib/case-reporter.mjs`, `packages/skeleton/fixtures/wo186-role-baseline.json`) before the gate, and the identity did not move, as criterion 4 requires. They stay staged.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.289","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. Before the result was recorded, this review put one choice to the operator: waive criterion 3 and let the review pass on the gate already run, which the reviewer recommended on cycle cost, or fail and repair. The operator chose to fail and repair, on the ground that deferring a known defect adds more work than fixing it now. The finding and its evidence were fixed before the question and did not change with the answer. The harness version comes from `claude --version` and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not the effective one. The order recommends `reviewer any`. Disclosure: this is the model that wrote the VER-001 repair (D033 to D040). VER-002 was judged by a different model family, and F1 was first raised by a fresh-context agent of this model and then reproduced by execution.

Subagent plan, stated before the first spawn: three read-only review agents against the cap of 20, with 0 observed at entry and no descendants, one per surface group: reuse and identity; write admission, read guard and reporting; test integrity and the measurement record. Each was told to change nothing and to run no suite, and none wrote in the worktree. Their reported usage was 296,309, 333,649 and 375,604 tokens. The harness counts 3 subagents, exact-observed, with 17 of 20 remaining.

**Process cost:** entry 89154 tokens; handoff 21027272 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 37c8cec0-39e8-4a1b-982d-f8178b2e618d`.

- Entry was observed at 2026-10-05T18:07:57.165Z.
- Handoff was observed at 18:47:57.484Z, after D041, D042, this report's text and the operator's choice, and before the result transition and its inline document gate. It counts 20,470,778 cached input, 416,943 cache-write, 160 uncached input and 139,391 output tokens over 133 steps and 75 commands.
- Both readings count reused cached input, so they do not measure live context. The subagents' tokens above are outside this total. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the gate: 1,268.106 s, of which its build waited 385.587 s for host lanes that another worktree's gate held.

## Goal-aligned judgment

The mission contribution is trust in a recorded result. The order lets a role skip gate work by standing on rows at a code identity, and the completion's claim check is where a role's statement that `npm test` passed is held against those rows. The verifier consumes the same lookup. The question for this review was whether a skipped task is always backed by a pass that the latest run at the identity still supports.

- **Rule beating:** the fixtures for the repaired rule all use a repository with its own `npm test` rows. F1 is the one arrangement the main lookup was built for, and no fixture ran it.
- **Drift to low performance:** product 07 now says a later failed run "is never masked by an older pass". Passing would publish that sentence beside a reproduced exception. This review did not narrow the sentence to fit.
- **Shifting the burden:** the reviewer's forced-fresh gate still runs every task before a merge, so F1 cannot put a false pass on `main` by itself. VER-001 gave the same backstop no weight for F1, and this review follows it.
- **Escalation and the tragedy of the commons:** a fail costs a repair, a verification and another review gate. The last four recorded review gates took 899 to 1,268 s. One batch carries F1, R1 to R3 and D042's items, the repair rule below closes the class so the next review does not find the next arrangement, and the waiver was put to the operator before recording.
- **Success to the successful:** two verifications, the earlier phases' review agents and four review gates do not settle a case none of them ran.
- **Seeking the wrong goal:** the measured outcome is not a shorter order. The records say so themselves: the plain gate's median fell 73.577 s across phases measured before the repair, the document gate's rose 27.697 s at seven gates an order, and no whole-order time was measured. Criteria 1 and 9 ask for the record, not for a saving, and the record is honest.
- **Naive Interventionism:** no source was edited. Staging is the only change to the subject.
- **NoOp:** without a verdict the order stays in final review. A pass would merge the claim check as it is.
- **Policy resistance:** unchanged.

## What this review read

- **The whole order, VER-001, VER-002, the handoff, D016, D020 and D031 to D040, `costs.md` and `close-register.md`.**
- **Reuse, in full:** `scripts/lib/gate-reuse.mjs`, and in `scripts/test-runner.mjs` the lookup and all-carried path, the end-of-gate identity and output checks, the recorded row and `changedMachinery`.
- **Identity and admission:** the diffs of `packages/skeleton/src/gate-evidence.mjs` (`gateCodeIdentity`, `gateRecordPath`, `prospectiveRealpath`, the gate kind) and `packages/skeleton/src/harness-host.ts` (`activeGateWriteRefusal`), with `harnessControl`.
- **The claim check:** `requireGateClaims` in `scripts/lib/handoff-ledger.mjs` and `completeCoverage` in `scripts/lib/suite-evidence.mjs`.
- **Write-backs:** the diffs of product 07 §Discipline, `README.md`, `docs/AI-HARNESS-SECURITY.md`, `CLAUDE.md`, the generator string in `packages/compiler/src/harness.ts`, the loadout text, `docs/control/budgets.json`, the package manifests and the lock file.
- **By the three agents:** every other changed source and test file, the read guard, the markers and reporter, the planning conditions and the measurement files. Each finding below that rests on an agent's reading alone says so.

## Criteria

**Criterion 1:** met. D003, D004, D005 and D024 record the causes and match the diffs. The records agent recomputed each median by hand from the five retained observations: the harness case 1.924 → 1.758 s, the skeleton task 355.779 → 229.754 s and the integration task 307.349 → 226.064 s, each set five passing, executed runs. Skeleton and integration miss 200 s and 150 s, and `costs.md` with `final-case-profiles.json` supplies the profile the criterion admits instead. The same agent read the three test diffs: the lock matrix keeps its twelve assertions, all eight cells and its 120 s and 10 s deadlines; the harness case's fifteen assertions are untouched; no assertion line of the integration suite changed. `defect-controls*.json` record each planted defect caught. In this review's gate the skeleton task took 231.652 s and integration 240.385 s, one observation beside a sibling gate.

**Criterion 2:** met. In this review's gate row all 86 tasks carry one to five `slowestCases`, and the integration suite reported each case's start and end as it ran. R2 stands beside this criterion.

**Criterion 3:** unmet (F1). Every clause of the criterion's own scenario holds, and its fixtures passed in this review's gate: one failed task reruns alone in another shell and session and composes a claimable row; `--again` and `--review` run every task; stopped, partial, timed-out and failed observations supply no pass; the build travels only with the output it attested. The defect is in what VER-001 required for this criterion and D035 parts 5 and 6 adopted: a task's latest run at the identity decides, for the claim as well as the runner. In a worktree that stands on main's row, the claim check does not follow the worktree's own later failure.

**Criterion 4:** met. Staging the three new files left the subject's own identity unchanged. The fixtures for an untracked edit, a staged file, a symbolic alias and the `docs/LEGAL.md` pin passed in the gate. D007 and D013 route all eight suites WO-174 D013 names. D033 states which copy and shell readers remain outside the identity, and `close-register.md` returns FUP-b28b870422a74166 to open. R1 stands beside this criterion.

**Criterion 5:** met. "WO-186 a fresh worktree reads main's passes without modifying main, while a changed source runs" passed in the gate. This review's probe showed the same control: a fresh worktree at main's identity has its claim answered by main's row, location `main`.

**Criterion 6:** met. The sibling-advance fixture passed in the gate. `changedMachinery` diffs from `git merge-base HEAD origin/main`, falls back to `main`, and otherwise selects every machinery suite, so a missing base widens the selection.

**Criterion 7:** met. The generated-hook live-gate fixture and the read-guard fixtures passed in the gate. The admission applies only while every live run is a product gate (`harness-host.ts:3792`). During this session's review gate the hook refused the two shell commands this review submitted outside its read-only list and admitted the listed read forms; no record write was attempted then. The admission agent traced `gateRecordPath` and the three call sites and found no path admitted outside the active order's three directories. `CLAUDE.md` and all twelve role roots carry the narrowed sentence, the executor, verifier and reviewer roots carry the role sentence, and no root keeps the old wording. R3 stands beside this criterion.

**Criterion 8:** met. `npm run plan -- conditions`, run here under the bounded wrapper in 18.5 s, lists the five longest gate tasks against their earlier thirty-day medians and 1.5× thresholds, from this review's own gate row: `harness-fixtures` 328.662 s against 251.402, `worktree-integration` 240.385 against 121.969 (holds), `skeleton` 231.652 against 295.465, `target-publish` 153.837 against 15.135 (holds) and `worktree` 123.436 against 84.274. It shows the plain gate's thirty-day median, 294.876 s, against 360 s.

**Criterion 9:** met. The plain medians 495.605 → 422.027 s and the review medians 506.452 → 814.813 s recompute from the retained observations. `costs.md` reconciles each Cost-line item and books no hypothetical saving. `replay-affected.mjs` and its output for thirty orders are kept. Both comparisons were measured before the VER-001 repair, on different selections for the review gate, and the records say so. At the reviewed identity the only timings are single review gates: the repair's 899.49 s and this review's 1,268.106 s.

**Criterion 10:** met. Product 07 §Discipline states task reuse, the identity's coverage, the main lookup, the merge-base selection and the narrowed refusal in place, with no dated paragraph. The generated sentence, README's test paragraph and refusal sentence and the security document agree with it. `close-register.md` gives each provenance row's disposition for close. One sentence, on a later failed run never being masked, is true once F1 is repaired.

**Criterion 11:** met. `npm test -- --review` passed as recorded below. `npm run test:docs` passed at this subject with D041, D042 and this report's findings in place: 29 passed, 0 failed, 67.04 s, recorded 2026-10-05T18:44:30.238Z. The operator's choice was recorded after it, and the result transition runs the gate again inline. `git diff --check` and `git diff --cached --check` are clean. The package changes are the compiler 0.25.1 → 0.25.2 and skeleton 0.52.2 → 0.52.3 versions, their source constants, the console's exact pins and the lock file's version lines. No dependency is added.

## Findings for repair

**F1 — criterion 3, correctness, in `scripts/lib/gate-reuse.mjs`.**

- **Reproduction:** a bounded probe in this session's scratch, on a scratch Git repository with the runner fixtures' table and the subject's own `runGate`, `coveringTaskResults`, `coveringGateCheck` and `requireGateClaims`.

| Step | Where | Result |
| --- | --- | --- |
| `runGate --serial --again` | main | exit 0, recorded 18:32:16.822Z at identity `aa47908b…` |
| `git worktree add`; claim checked | worktree, no row | accepted on main's row (criterion 5's intended behaviour) |
| `runGate --only beta --serial`, with `beta` made to fail by an ignored marker | worktree | `suite:beta`, exit 1, recorded 18:32:17.085Z at the same identity |
| `coveringTaskResults` | worktree | carries `build` and `alpha`, not `beta` |
| `coveringGateCheck`, `requireGateClaims` | worktree | main's row, no displaced task; claim accepted with no advisory |
| plain `runGate --serial` | worktree | runs `beta` alone, composed, exit 1; the claim is then refused |

- **Cause:** with no row of the claim's check in the worktree, `coveringGateCheck` takes both the candidate rows and the other-check rows from main (`gate-reuse.mjs:362-364`). A task is displaced only when `own !== row && !pass` (`:371-378`). For main's row `own === row`, so the missing pass is never consulted, although `decidingPass` reads the worktree's own rows first and returns none.
- **Reach:** a worktree that stands on main's row and has never recorded an `npm test` row at that identity. That is the population the main lookup serves. Once a plain `npm test` records a row there, the existing fixture's path applies and the failure displaces.
- **Rule a repair must hold:** the claim check accepts a complete row only while each task it names has, as its latest run among the executions this worktree may consult, that row's own result or a pass that may be carried. The worktree's own runs, under the claim's check or another, decide before main's, as they already do for the runner.
- **Close the class, not the case:** the runner's lookup and the claim's are two functions that must agree, and nothing asserts that they do. Fixtures have been written one arrangement at a time, and this arrangement survived all of them, as VER-001's F1 and the seven holes D035 lists from the repair's own reviewers each survived the ones before. That reading is this review's inference from the code and the records. Either the claim check takes each task's standing from the one decision the runner uses, or one table-driven fixture asserts that the claim check accepts a row exactly when the runner would carry every task it names, over these arrangements: own `npm test` rows or none; main consulted or not; the latest run under the claim's check or another; that run passed or failed.

The operator was offered a waiver of criterion 3 before this result was recorded and chose repair.

**R1 — an identity that cannot be computed, or a main index that cannot be read, records the claim as stated.** After a green row, one untracked symbolic link among the identity's paths makes `gateCodeIdentity` and the runner throw, and `requireGateClaims` resolves with "Gate index unavailable: Code identity does not support symbolic source aliases: scripts/new.mjs; the npm test claim of criterion 3 is recorded as stated." A malformed `checks.json` in main does the same for a fresh worktree. The catch in `handoff-ledger.mjs:252-260` is older than this order and is documented for gate storage that cannot be read; this order added both new ways to reach it. Rule: either refuse the claim or state both cases in product 07 beside the advisory, with a fixture for whichever is chosen.

**R2 — reporter lines spend the progress budget.** In this review's gate log, 921 of 1,314 lines are forwarded `PROGRESS CASE {…}` lines. `compiler`, `kernel`, `skeleton` and `runner-fixtures` each forwarded exactly 80, the cap, and each heartbeat's "last report:" is a truncated case line. The lines are parsed for durations and then fall through to the forwarding branch, where the `PROGRESS ` prefix bypasses the one-second throttle (`test-runner.mjs:1193-1236`, cap at `:1085`). After the cap, a `not ok` line is no longer shown live. No task failed in this gate, so that effect was read, not observed. Rule: a case line supplies its duration and is neither forwarded nor counted.

**R3 — a callback `fs.open` with the flags omitted is not observed.** On Node v26.9.0 the subject's guard recorded no event for `fs.open(record, (e, fd) => fs.close(fd, () => done()))`, with or without an `fstatSync` of the descriptor, and one event when the flags were given. The wrapper tests the callback's source text for `r` or `+` in the flags position (`product-read-guard.mjs:255-262`, `:432-442`). D033's rule names opens in their callback form. No product task was found using the form. The same probe refuted two other candidates: `fs.exists`, and ESM or `require` loads of a record, are observed.

**D042** lists what was read and not executed: a gate-level failure in a single-suite row that displaces nothing; a gate that throws after its tasks ran; untracked files in the identity's excluded classes; three older narrowing cases in `changedMachinery`; a timed-out case in the markers; the reporter's raw path; the hook's status lookup before its cheap admissions, measured here at 150 to 163 ms a call with no gate running; and the runner fixture's loosened reuse-line assertion. It also carries three record notes on `PR.md` and `costs.md`.

## Integration, carry-ins and follow-ups

- **Integration:** none due. Both bases are `2816c773`, and no claim is carried across a merge. `git ls-remote --tags origin v0.66.3` returns nothing, so the version does not collide.
- **Receipt 038:** its reopening condition did not occur in this gate. Every task ran fresh and passed at the identity whose rows the executor and verifier consumed. F1 is a different path to the situation that receipt names: a pass taken from another checkout that this checkout's own run contradicts.
- **D038 and D039** keep their planning owners. This review opened neither.
- **Register rows:** `close-register.md`'s dispositions are the closing actor's. The `followups --touching` disposition belongs to the passing review after repair.
- **Not done, because the verdict is fail:** no commit, no `PR.md` or `RELEASE-NOTES.md` authoring, and no publication. The existing `PR.md` is the executor's draft and is left as it is.

## Verification sequence

1. **Activation:** 2026-10-05T00:55:22Z, checkpoint 1.
2. **Implementation** (Codex CLI 0.160.0, `gpt-6-astra`, max, `codex-session-readback`): `ImplementationReady` at 09:43:51Z, checkpoint 2. D001 to D030, including D020's operator-directed amendment.
3. **[VER-001](../../verifications/WO-186/VER-001.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh, subagents): fail at 14:36:46Z. Criterion 3 was unmet: a composed row reported a pass against build output made at another identity, and an older pass survived a later failure (F1). R1 to R8 went to the repair (D031), and D032 was boarded.
4. **Repair** (Claude Code 2.1.289, `claude-fable-5-1`, xhigh): requested 14:38:20Z, completed 17:37:35Z, checkpoint 6. D033 to D040.
5. **[VER-002](../../verifications/WO-186/VER-002.md)** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): pass at 17:56:21Z.
6. **This review** (Claude Code 2.1.289, `claude-fable-5-1`, xhigh): dispatched 18:07:47Z, checkpoint 9. D041 and D042.

## Executed checks

Every probe outside the gate was read-only or ran under `node scripts/harness.mjs bounded`, one at a time, on scratch repositories. Scripts and transcripts are in this session's DotLn scratch.

- **State:** `npm run resume --silent -- status --json`, `node scripts/harness.mjs writer --show`, usage at entry and handoff, `git ls-remote origin refs/heads/main` before and after the gate.
- **Hashes and identity:** report hashes against the control events; `gateCodeIdentity` before staging, after staging and after the gate.
- **Product gate:** `npm test -- --review`, recorded 2026-10-05T18:30:55.265Z at code identity `dea58b07…`, tree `ef3c7adb`: exit 0, forced fresh, 36 suites, 86 tasks fresh and none carried, `identityUnchanged` and `buildOutputUnchanged` true, 1,268.106 s. Its transcript has no `not ok` line.
- **Document gate:** `npm run test:docs` at this subject, as criterion 11 records.
- **F1 and R1:** the claim-check probe, 18:32:16Z to 18:32:18Z, with the steps tabled above and the two R1 cases.
- **R3:** the read-guard probe, eight forms.
- **Criterion 8:** `npm run plan -- conditions`, bounded.
- **Hook cost:** five serial and four concurrent `resume.mjs status --json` calls, bounded.
- **Role text and clean room:** counts of the two generated sentences across `CLAUDE.md` and the twelve role roots, a search for the old wording, and a search of the order's new records for home paths and private identifiers.

Not re-run: the planted-defect controls, the assertion inventories, the second-process proofs and the replay. Each stands on its recorded run and on VER-001's and VER-002's repetitions. The medians were recomputed by hand from retained fields by an agent while the gate was live, not by script.

## Observations with no finding

- **The gate waited 385.587 s to start.** Its build needs all four host lanes, a sibling worktree's gate held them, and lanes have no queue order (`scripts/lib/host-lanes.mjs` polls). That is WO-185's design and the ordinary parallel workflow D020 says to measure. It is the largest single cost this review paid, and it falls on exactly the gate this order keeps always fresh.
- **Four deadline diagnostics, no failure.** The gate row records one 300 ms worker-transport deadline hit in `skeleton` and three fixture deadlines in `runner-fixtures`, each classified `deadline-hit-cause-unestablished`. Every task passed.
- **Two statistics for one threshold.** The conditions listing holds the plain gate's thirty-day median (294.876 s) below 360 s, while `costs.md` reads this order's after-phase median (422.027 s) as meeting FUP-e96221b106cd136a's condition. They measure different things, and VER-002 noted the same.
- **A local path in one record.** `docs/evidence/WO-186/verify-002-checks.json` names the worktree's absolute path. Many committed records do. It is not employer material.
- **The first conditions row was unknown here.** Its plan-check probe exited 1 because D041 and D042 were written before `npm run meta` refreshed the register. The document gate above ran after that refresh.

The next dispatch is `resume: fix`. The repair re-runs `npm test -- --review` and the runner fixtures before a fresh verification judges D041 and D042.
