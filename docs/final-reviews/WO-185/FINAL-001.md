# WO-185 FINAL-001 — final review

**Verdict:** fail. WO-185 asked that no DotLn-started process tree can exhaust the host: footprint budgets, a per-user guard, runner budgets and signal handling, shared host lanes, a bounded probe wrapper and bounded corpus assertions. All eight criteria hold at this subject. A fresh `npm test -- --review` at the reviewed code identity passed 40 of 40 suites with 85 fresh tasks. Three findings in the order's own surfaces were reproduced here, and a reviewer does not write and certify a fix, so they return to repair:

- **The runner's budget stop records before it kills.** If the checkout's ledger cannot be written, the runner ends with the over-budget task still alive ([D018](../../evidence/WO-185/decisions.md#wo-185-d018--final-review-finding-a-runner-budget-stop-records-before-it-kills-and-a-failed-ledger-write-ends-the-runner-with-the-task-alive)).
- **A quarantine with a nonfinite value no longer round-trips.** This order's new manifest decoding makes the generator's own quarantine fail the `wo102` tests, a regression against the base and against VER-001 F3's rule ([D019](../../evidence/WO-185/decisions.md#wo-185-d019--final-review-finding-the-wo102-tests-decode-the-manifest-so-a-quarantine-with-a-nonfinite-value-no-longer-round-trips)).
- **`harness bounded` cannot run ordinary commands.** It refuses any argument containing `*` and strips the caller's environment ([D020](../../evidence/WO-185/decisions.md#wo-185-d020--final-review-finding-harness-bounded-cannot-run-ordinary-commands-as-the-role-sentence-directs)).

Three lower confirmed items and nine unreproduced observations ride with that repair for disposition ([D021](../../evidence/WO-185/decisions.md#wo-185-d021--final-review-lower-findings-and-observations-for-the-repair-to-dispose)).

**Subject:** [`docs/work-orders/WO-185-no-order-can-exhaust-the-host.md`](../../work-orders/WO-185-no-order-can-exhaust-the-host.md) on branch `wo-185`, uncommitted over `main` at `340a67c9797520213345ef6ba9c72bff8df2e0a1`. `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, the merge base and `HEAD` all name `340a67c9`, the base D017 integrated, so no further integration was due and the helper was not run. The dispatch checkpoint is `refs/dotln/checkpoint/WO-185/14` (`9219e5fb`).

- The recorded `reportHash` of VER-001, VER-002 and VER-003 each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.66.1)`; the eight criteria are the original text.
- Every non-documentation change is staged. The gate code identity is `c006d5cd65e391efb06fd75f5db91a6d8813123bb9d77ed44aa91df6f0cea06d`, the identity VER-003 judged; no source byte changed after VER-003.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.288","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before the first spawn: three read-only audit agents against the cap of 20, with 0 observed at entry and no descendants. Each batched one group of files: the runner and wrapper; the guard, census and lanes; and the corpus helper, fixtures and write-backs. All three were told to change nothing and to run no tests or allocations. Their reported usage was 164,251, 187,797 and 188,202 tokens. The harness counts 3 subagents, exact-observed, with 17 of 20 remaining.

Every claim below that the verdict rests on was reproduced or read in source by this session. Items D021 marks as unreproduced are the agents' claims, checked only where stated.

**Process cost:** entry 87442 tokens; handoff 15456400 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage e24c6926-05c2-4111-954a-80e5cdde0522`.

- Entry was observed at 2026-10-03T17:31:32.769Z.
- Handoff was observed at 17:55:19.841Z, after the decisions were written and before this report, `test:docs` and the result transition. It counts 15,141,593 cached input, 251,591 cache-write, 172 uncached input and 63,044 output tokens over 90 steps and 71 commands.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The counter's output does not say whether it includes the three agents' 540,250 tokens, so they are named here and not added.
- The largest wait was the fresh gate, 837.84 s. The audits ran during it.
- Tradeoff: the first `npm test -- --review` reused the executor's complete passing row at this identity and started no suite. This review chose `--again` and paid about 14 minutes of host time, for two reasons. The order asks for the gate again at final review. And an earlier passing row once hid an intermittent defect (VER-002 F6). The fresh run passed, so the verdict does not rest on that choice.
- The agents found the leads behind D018, D019 and D020. This session reproduced all three.

## Goal-aligned judgment

The mission contribution is the shared host every order runs on: an automatic, typed and recorded stop replaces an operator or a sibling agent killing processes by hand. The question for this review was whether that stop and its supporting tools ship intact.

- **Shifting the burden to the intervenor** decided D018. The stop the order exists for depends on a file write that runs before the kill. When the write fails, the over-budget group is left to the guard, if one is live, or to a human.
- **Rule beating** decided D019. Every gate passes because the committed manifest holds no findings, so the quarantine round trip that F3's repair claimed is never exercised. The criterion 5 runs pass for the same reason.
- **Policy resistance and escalation** decided D020. A probe wrapper that refuses ordinary commands sends agents back to unwrapped probes, which is how the 2026-10-01 incident began. The fix is a faithful wrapper, not another refusal.
- **Seeking the wrong goal:** eight met criteria and a green 40-suite gate are not the goal. The goal is a stop that holds when the host is failing.
- **Success to the successful:** three verifications and two full gates did not excuse a defect reproduced here in seconds.
- **Drift to low performance:** a quarantine that its own tests reject would teach readers to ignore drift alarms.
- **Tragedy of the commons:** the review spent one extra full gate and three agents. D021 bundles twelve lower items into the already-open repair instead of a cycle each.
- **Naive Interventionism** bounds the response. D018 is a reordering plus guarded writes in one module; D019 changes the readers and adds one fixture; D020 changes only the probe path. Budgets, intervals, ownership rules and the native census stay as they are.
- **NoOp** publishes nothing. `main` keeps today's exposure until the repair closes; the order's measured controls stay uncommitted in this worktree and its checkpoints.

## Criteria

- **Criterion 1:** met. Both growth modes are stopped as gate tasks, under `harness bounded`, and as bare children of a registered session, with typed `memory-budget` stops naming the process, budget and measured peak, and no survivor. `runner-fixtures` passed in this review's gate (37.84 s), including "native footprint stops zero-filled and low-resident growth…". VER-003's literal CLI and runner-only probes cover the paths that the fixture's guard-first stops mask. Limits: D018's ledger-failure path and D021 item 3's naming of the group leader (`zsh` under this harness's shell) are findings against the Design and Objective, not against these fixture runs.
- **Criterion 2:** met. The executor's integrated row records all 85 task peaks and the gate peak. Per VER-003's recomputation, the 12, 24 and 32 GiB budgets are 18.55, 20.79 and at least 23.05 times them. Runner sampling was 1.548% and guard sampling 0.969% of gate wall, both under 2%. `docs/control/budgets.json` names its full-review basis of 15:52:30.844Z, and D017 rechecks it. This review's fresh row (17:48:54.797Z, 837,838 ms) is another full run at the same identity. Limit: D021 item 4, a long-lived guard's swap baseline never resets, so its steady-state cost after swap growth is unmeasured.
- **Criterion 3:** met for the recorded ownership boundary. The signal, detached-child, double/triple-fork, held-endpoint, late-signal and output-tail fixtures passed in this review's gate. VER-003 replayed VER-001's `lineage-limit.c` and VER-002 F6's case. The no-mark daemon limit stays on FUP-d0a9719cc2e4ec55. D018 is a crash path, not one of the criterion's three signals.
- **Criterion 4:** met. "independent worktrees and separate clones share lanes, wait, reclaim a dead holder and reuse one guard" and the nested and dead-runner lane case passed in this review's gate on this 16-CPU host. The coordination root is resolved from the per-user temporary directory, independent of the repository and of TMPDIR. Limit: D021 item 2, the fixture's 4-lanes-per-gate model would fail on a host with fewer than 8 logical CPUs.
- **Criterion 5:** met. The unchanged `wo102` files pass inside this review's gate. VER-003 reproduced the planted Backoff drift failing each file in 2.7–4.3 s under the 805,306,368-byte budget, with total 126792, kept 32 and digest `5ff78514…a1359`. The declared-set assertion check passes and names `assertFindings`. D019 is an adjacent regression in the same surface, not a failure of this criterion's text.
- **Criterion 6:** met. [corpus-measurements.json](../../evidence/WO-185/corpus-measurements.json) and D004 record the command, the 805,306,368-byte budget, the typed stop at 875,107,688 bytes after 3.610 s, and the sampled stack through `deepStrictEqual`, `AssertionError`, `createErrDiff` and `inspectValue`. The helper is judged against that cause. The confirmation script was not preserved, as VER-001 recorded.
- **Criterion 7:** met for the write-backs due before close. The role sentence appears once in each of the 12 generated skill files, sourced from `packages/skeleton/src/loadouts/contributor.ts`. Product 07 §Discipline and `docs/AI-HARNESS-SECURITY.md` state the budgets, guard, shared lanes, held-watch rule and the no-mark limit; this review found no statement there that the code contradicts. Decisions D001–D017 are present, now with D018–D021. FUP-4feed3b6e7a451ef remains `allocated` to WO-185; it is retargeted at close, which this failed review does not reach.
- **Criterion 8:** met at this subject. `npm test -- --again --review` passed: 40 passed, 0 failed, 837.84 s, 85 fresh tasks, recorded 2026-10-03T17:48:54.797Z at code identity `c006d5cd…`. `npm run test:docs` is run inline by this result transition. `git diff --check HEAD` and `git diff --cached --check` both exit 0. Package changes are the skeleton retime 0.52.0→0.52.1 and the console's exact pin; no dependency was added.

## Findings for repair

Each finding is recorded with its evidence, its rule for the repair and its reopen condition in the cited decision. Probe drivers and transcripts are in this session's DotLn scratch under `final-review/`, and every probe ran under `node scripts/harness.mjs bounded`, one at a time.

**F1 — a runner budget stop writes its incident before it kills, and a failed write ends the runner with the task alive** ([D018](../../evidence/WO-185/decisions.md#wo-185-d018--final-review-finding-a-runner-budget-stop-records-before-it-kills-and-a-failed-ledger-write-ends-the-runner-with-the-task-alive)). Severity: medium. The setup was a scratch checkout whose `docs/control/local` is a regular file, a 64 MiB task budget and a self-limited allocator. `executeSuite`'s monitor threw `ENOTDIR` from `appendIncident` (`scripts/lib/host-resources.mjs:471`, via `scripts/lib/process-monitor.mjs:173` in the interval tick), and the runner exited 1. The allocator (pid 76079, measured 81,086,384 bytes) was still alive; only the outer wrapper's survivor sweep killed it. Rule: kill first, and make no record write able to end the runner.

**F2 — the `wo102` manifest readers now decode nonfinite tags that the sweep keeps encoded** ([D019](../../evidence/WO-185/decisions.md#wo-185-d019--final-review-finding-the-wo102-tests-decode-the-manifest-so-a-quarantine-with-a-nonfinite-value-no-longer-round-trips)). Severity: medium, latent. One finding on grid row `cadence-000169` was written with the generator's encoding. Read back the current way, `decodeNumbers(JSON.parse(…))`, it is rejected with digest `eb3b401a…` against `678138c6…`. Read back the base way, `JSON.parse`, it is accepted. A finite-row control is accepted both ways. Rule: a quarantine the generator writes is accepted by all three `wo102` files at the same kernel, nonfinite values included.

**F3 — `harness bounded` changes the command it bounds** ([D020](../../evidence/WO-185/decisions.md#wo-185-d020--final-review-finding-harness-bounded-cannot-run-ordinary-commands-as-the-role-sentence-directs)). Severity: low to medium. `-- node -e "console.log(2*3)"` returns `failureKind: "setup"` ("Unsupported test glob") without running. `FOO=visible … -- printenv FOO` exits 1 with no output. Rule: run the probe's argv verbatim with the caller's environment.

**D021 items** ([D021](../../evidence/WO-185/decisions.md#wo-185-d021--final-review-lower-findings-and-observations-for-the-repair-to-dispose)). Three items are confirmed and are to be fixed:

1. `detached-descendant.c` is missing from the `runner-fixtures` sources.
2. The lane fixture assumes 4 lanes per gate.
3. Bare-child stops name the process-group leader.

Nine are unreproduced and are each to be fixed or recorded as left with their own follow-up:

4. The guard's swap baseline never resets.
5. One breach can produce a guard row and a runner row.
6. An EPERM loses a guard incident.
7. A census-time pgid race in `killOwned`.
8. TAP diagnostic retention for indented subtest failures.
9. A nested gate's lease is looked up again for each task.
10. A signal and a resource stop meeting in a narrow race.
11. The gate-scope stop has no process field.
12. Test hygiene.

## Integration, carry-ins and follow-ups

- **Integration.** None due: `origin/main` is still `340a67c9`, which D017 integrated during repair. D017's carried-forward claims stand unchanged: the criterion 5 drift runs, which VER-003 re-ran at the integrated identity; criterion 6's record; and criterion 7's write-backs. No version collision: the application is v0.66.1 and skeleton 0.52.1, above `main`'s v0.66.0 and 0.52.0.
- **Receipt 038 carry-ins.**
  - Host-wide scope is met by criterion 4's separate-clone case and by the per-user coordination root.
  - No harness configuration gains an allow rule for the wrapper: `grep` finds no `harness bounded` rule in `.claude/settings.json` or `.claude/harness-manifest.json`.
  - Neither reopen condition was observed.
- **Register rows.**
  - FUP-d0a9719cc2e4ec55 (no-mark ownership), FUP-c1a89d52cc314af9 (guard upgrade) and FUP-a5c6ac8cb40bd52a (worktree CLI ordering) keep their recorded routes; this review neither opened their seams nor met their conditions.
  - FUP-4feed3b6e7a451ef's retarget is due at close.
  - The `followups --touching` disposition belongs to the passing review after repair.
- **Not done, because the verdict is fail:** no commit, no `PR.md` or `RELEASE-NOTES.md` authoring, and no publication.

The next dispatch is `resume: fix`. The repair must re-run `npm test -- --review` and the affected fixtures before a fresh verification judges D018–D021.
