# WO-185 FINAL-002 — final review

**Verdict:** pass. WO-185 asked that no process tree a DotLn session or gate starts can take the host down. This review judged the original order's eight criteria against the repaired subject, and all eight are met. FINAL-001's three findings no longer reproduce. This review reran FINAL-001's own ledger-failure driver and its wrapper commands, and the fresh gate ran the nonfinite round-trip fixture; each now behaves as its rule requires. A fresh `npm test -- --again --review` at the reviewed code identity passed 40 of 40 suites with 85 fresh tasks. The repair's source diff matches D023 to D027. VER-004's five residual low items stay recorded in D028; none breaks a criterion or prevents a stop. This review changed no source and filed no new finding. It disposed eleven register rows, including criterion 7's retarget of FUP-4feed3b6e7a451ef. It also records one correction, D029: no gate runs the unchanged `wo102` files, although FINAL-001 and VER-004 said one did, so this review ran them directly.

**Subject:** [`docs/work-orders/WO-185-no-order-can-exhaust-the-host.md`](../../work-orders/WO-185-no-order-can-exhaust-the-host.md) on branch `wo-185`, uncommitted over `main` at `340a67c9797520213345ef6ba9c72bff8df2e0a1`. After `git fetch origin`, `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, the merge base and `HEAD` all name `340a67c9`, so no integration was due. The dispatch checkpoint is `refs/dotln/checkpoint/WO-185/20` (`0aa8b8c3`).

- The recorded `reportHash` of VER-001 to VER-004 and FINAL-001 each equals the report's current SHA-256.
- The order differs from `main` only in its heading's version label, `(v0.66.1)`. The eight criteria are the original text.
- The repair's thirteen source files were unstaged at dispatch. This review staged them before the gate, so every non-documentation change is staged. They are the whole source difference from FINAL-001's checkpoint 14. Staging left the gate code identity at `85cce5d52bf2d7309145878f6574ee3896c54eba582ffe864c69a2bba47be1cc`, the identity VER-004 judged.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.289","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version`, and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it; it is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before any work that could spawn: none, against the cap of 20, with 0 observed at entry. The repair diff since FINAL-001 is 934 lines across thirteen files, 715 of them fixture tests, so this session read it directly. FINAL-001's three audit agents had already covered the earlier full diff. No subagent ran.

**Process cost:** entry 87511 tokens; handoff 25726949 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 4d36ed5b-2a1d-481b-8370-7451e7bbc5e3`.

- Entry was observed at 2026-10-04T13:58:14.981Z.
- Handoff was observed at 14:27:02.377Z, after D029 and this report's final text, and before the last `test:docs` and the result transition. It counts 25,343,024 cached input, 295,550 cache-write, 242 uncached input and 88,133 output tokens over 134 steps and 105 commands. The counter reports 0 subagents, exact-observed, with 20 of 20 remaining.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the fresh gate, 852.25 s.
- Tradeoff: the order asks for `npm test -- --review` again at final review. The executor's passing row at this identity would have been reused without starting a suite. This review chose `--again` and paid about 14 minutes of host time. An earlier passing row once hid an intermittent ownership defect (VER-002 F6), and the repair changed the runner, the guard and the monitor. The fresh run passed, so the verdict does not rest on that choice.

## Goal-aligned judgment

The mission contribution is the shared host every order runs on. Before WO-185, the only control that ended the 2026-10-01 incident was a sibling agent killing processes by hand. WO-185 replaces that with an automatic, typed and recorded stop. The question for this review was whether that stop and its tools now ship intact.

- **Shifting the burden to the intervenor:** the stop must hold when its own records fail. This review checked the failure path with FINAL-001's driver rather than the repair's own fixture.
- **Rule beating and seeking the wrong goal:** a green gate is not the goal. This review judged killed processes, typed rows, literal wrapper output and a planted drift, not suite counts.
- **Success to the successful:** four verifications and five full gates did not excuse a fresh gate at final review, because the repair changed the runner, the guard and the monitor.
- **Drift to low performance:** the residual items stay visible, as register rows with conditions, not as report text. FUP-c1a89d52cc314af9 is opened for planning, because the live shared guard still runs older code.
- **Tragedy of the commons:** one fresh gate, no subagent, and short probes, each bounded and run one at a time.
- **Escalation and policy resistance:** no new refusal, mechanism, allow rule or dependency. The wrapper now runs ordinary commands faithfully, so agents have no reason to bypass it.
- **Naive Interventionism:** a reviewer does not write and certify a fix. This review found no defect that needed one, and changed no source.
- **NoOp:** without a pass, `main` keeps today's exposure: no budget, no guard and an unbounded corpus failure path. The measured controls would stay in this worktree.

## FINAL-001's findings at this subject

**F1 / D018 (a budget stop recorded before it killed): repaired.** This review copied FINAL-001's driver (`ledger-probe.mjs`, SHA-256 `1b7ae7b1…`) into its own scratch and ran it unchanged under `harness bounded`. The setup is FINAL-001's: a regular file at the checkout's `docs/control/local`, a 64 MiB task budget, an allocator capped at 256 MiB and 6 s, and a private host directory with no guard.

- The runner printed `DotLn incident ledger unavailable (checkout incidents): ENOTDIR …; resource stop remains active and its typed details are reported`.
- It returned a typed row: `failureKind: memory-budget`, process `node`, budget 67,108,864 bytes, measured peak 81,037,256 bytes, and `recordingUnavailable` naming the checkout destination. The private host ledger holds the same typed row.
- The runner exited 0 after 490 ms. The allocator (pid 61669) wrote 8 heartbeats and none after the runner exited, and `ps -p 61669` found no process.
- In source, the task path calls `task.fail`, which kills, before `appendIncident`. The gate path kills every gate member and fails each task before it, `appendIncident` catches each of its three destinations separately, and `onMembers` runs after the budget check inside a `try`.
- Limit: the row lists `killedProcesses: []`, because the runner's own kill precedes the revalidated census. D024 records this.

**F2 / D019 (a nonfinite quarantine no longer round-tripped): repaired.** All three `wo102` files now read the manifest through `readCorpusManifest`, which decodes the grid and keeps `findings` in the sweep's encoding. The fixture "a generated quarantine with nonfinite findings passes all three wo102 files" passed inside this review's `runner-fixtures` run. It uses the real generator to write a two-finding quarantine with a NaN, then runs the three files at that kernel. VER-004 reran FINAL-001's own round-trip case through the repaired reader; this review did not repeat it.

**F3 / D020 (the wrapper changed the command): repaired.** Each of these ran through the real CLI:

| Command | Result |
|---|---|
| `-- node -e "console.log(2*3)"` | prints `6`, exit 0 |
| `FOO=visible … -- printenv FOO` | prints `visible`, exit 0 |
| `-- node -e '…process.argv…' '*.mjs' 'a b' ''` | prints `["*.mjs","a b",""]` |
| `-- sh -c 'echo cwd=$(pwd); exit 7'` | prints the worktree root; the wrapper exits 7 |

Only `row.probe` skips the suite's glob expansion and environment policy; gate suites keep both.

**D021's twelve items** are disposed in D025, and `runner-fixtures` passed in this review's gate. Its subtests include item 3's "a bare group names its largest member and retains the group kill" and item 9's "a nested gate keeps its validated parent lease when later lookup would fail".

## Criteria

- **Criterion 1:** met. `runner-fixtures` passed in this review's gate (66.26 s). It includes "native footprint stops zero-filled and low-resident growth as a gate task, bounded command and bare registered-session child" and "bounded CLI prints typed memory stop and exit 125". VER-004 records those runs' peaks: 69,157,368 to 69,747,144 bytes under a 67,108,864-byte budget, low-resident cases at 8,142,848 resident, and every stop typed, named and leaving no survivor. Each stop fires well below the fixture's own ceiling, the smaller of one eighth of RAM and 240 MiB. This review's ledger probe shows the runner's own path stopping a task with no guard live.
- **Criterion 2:** met. This review's gate row (recorded 2026-10-04T14:13:31.439Z) records `peakFootprintBytes` for all 85 tasks; the largest is `runner-fixtures` at 715,054,392 bytes. The gate peak is 1,134,380,672 bytes.
  - `docs/control/budgets.json` names its basis: the repair's full review of 2026-10-03T19:17:49.624Z at identity `bf5bdd3d…`. Its task, gate and host peaks are 1,100,039,120, 1,787,537,328 and 1,721,155,256 bytes. On this 51,539,607,552-byte host, the 12, 24 and 32 GiB budgets are 11.71, 14.42 and 19.96 times those peaks, each above four. Against this review's row, the task and gate budgets are 18.02 and 22.72 times.
  - That basis run measured runner sampling at 2.578% of gate wall, over the two-percent trigger. D026 raised the intervals to 1 s and 4 s and stated the nominal overshoot at 3.4 GiB/s: 3.4 GiB per signal tick and 13.6 GiB per footprint census, plus latency. In this review's row, runner sampling is 8,136.21 ms of 852,252 ms, which is 0.955%.
  - Limit: the shared guard still runs older code. Its lifetime share, 536,869 ms over 81,470 s, is 0.659%, but that is a lifetime average and not this gate's window. D027's gate-window figure of 1.106% stands.
- **Criterion 3:** met for the recorded ownership boundary. These fixtures passed in this review's gate:
  - SIGINT, SIGTERM and SIGHUP end task groups without a row, including during completed-row aggregation;
  - the escaped-descendant and output-tail fixture;
  - the double- and triple-fork and held-endpoint fixtures;
  - indented TAP diagnostic retention.

  The no-mark daemon limit stays on FUP-d0a9719cc2e4ec55, whose condition has not occurred. D028 item 2, a guard SIGTERM after a failed latest-incident write, records no row. That matches this criterion's no-row rule.
- **Criterion 4:** met. These cases passed in this review's gate on this 16-CPU host:
  - "independent worktrees and separate clones share lanes, wait, reclaim a dead holder and reuse one guard";
  - the nested and dead-runner lane case;
  - the validated-parent-lease case.

  VER-004 recorded the same pairs at 4 and 2 simulated CPUs, peaking at 4, 2 and 1 lanes with named waits. The production coordination root is `dotln-host-v1-501` under the per-user temporary directory, resolved independently of the repository and of `TMPDIR`.
- **Criterion 5:** met. The scratch copy was VER-004's drift copy. Its six `corpus/harness/` files are byte-identical to this subject's, and its kernel differs from this subject's only at `core.js:80` (`rngState: env.rngState`). Under `harness bounded --budget-bytes 805306368`:

  | File | Time | Peak footprint |
  |---|---|---|
  | `wo102-properties` | 3.172 s | 268,633,736 |
  | `wo102-generators` | 4.289 s | 294,127,984 |
  | `wo102-replay` | 2.844 s | 250,051,832 |

  Each file fails and reports total 126792, kept 32 and digest `5ff785148829df9845c7982664ab143d3364c080e1e0f4ebbe32841ad60a1359`; the generators file reports it as a `findings-limit` refusal.

  No gate suite runs the unchanged files: the corpus lanes are manual by design. The gate runs them only as copies, beside a generated quarantine, inside a `runner-fixtures` case. This review therefore ran them directly at the reviewed identity, one at a time under the same 805,306,368-byte bound. `wo102-properties` passed 3/3 at a 258,506,912-byte peak; `wo102-generators` passed 8/8 at 787,393,208 bytes in 10.26 s; `wo102-replay` passed 13/13 at 230,798,664 bytes. FINAL-001 and VER-004 each said the unchanged files pass in the gate. [D029](../../evidence/WO-185/decisions.md#wo-185-d029--correction-the-unchanged-wo102-files-run-in-no-gate) corrects both statements; neither verdict rested on them. The declared-set assertion check runs in `runner-fixtures` and names `assertFindings`.
- **Criterion 6:** met. [corpus-measurements.json](../../evidence/WO-185/corpus-measurements.json) and D004 are unchanged. They record the bounded command, the 805,306,368-byte budget, the typed stop at 875,107,688 bytes after 3.610 s, and the sampled stack through `deepStrictEqual`, `AssertionError`, `createErrDiff` and `inspectValue`. The helper is judged against that cause. VER-001's limit stands: the confirmation script itself was not preserved.
- **Criterion 7:** met.
  - **Role sentence:** "Run a probe outside a gate under `node scripts/harness.mjs bounded -- <command>`, one process at a time…" appears once in each of the 12 generated skill files. It is sourced from `packages/skeleton/src/loadouts/contributor.ts`, and `node scripts/harness.mjs check` passes 32 generated surfaces.
  - **Product 07 §Discipline and `docs/AI-HARNESS-SECURITY.md`** state the budgets, the guard, the shared lanes, kill-before-record, probe fidelity, the 1 s and 4 s intervals with their overshoot, exit 125 and the no-mark limit. This review found no statement there that the code contradicts.
  - **Decisions:** D001 to D028 are present, and this review adds the D029 correction.
  - **Register:** FUP-4feed3b6e7a451ef is retargeted by this review: settled, with a reopening condition (see Register).
- **Criterion 8:** met.
  - `npm test -- --again --review` passed: 40 passed, 0 failed, 852.25 s, 85 fresh tasks, recorded 2026-10-04T14:13:31.439Z at code identity `85cce5d5…`, tree `d54681e0`.
  - `npm run test:docs` passed: 24 passed, 0 failed, 40.37 s, 24 fresh tasks, recorded 2026-10-04T14:24:49.977Z at the same code identity, with this report, PR.md and RELEASE-NOTES.md in place. The first run, at 14:23:42.156Z, failed 14 passed and 10 failed. The notes profile in `release-surfaces` read an angle-bracketed placeholder inside a code span in RELEASE-NOTES.md as raw HTML, and nine dependent tasks failed preflight on it. This review reworded that placeholder in the notes and the PR body and reran the gate. After D029 and this report's final text, it passed again: 24 passed, 0 failed, 43.43 s, recorded 14:27:59.579Z at the same identity. The result transition runs it again inline.
  - `git diff --check HEAD` and `git diff --cached --check` both exit 0.
  - The package changes are the skeleton retime 0.52.0→0.52.1, the console's matching exact pin and the lock file's two version lines. No dependency was added.

## Register

`npm run plan -- followups --touching` returned 25 rows over four pages, at register revision `47f487af28245fb276dea87691b5ee399994699150c3f747d9b81170fe2b7c97` (107 paths and WO-185, 182 pending). FUP-4feed3b6e7a451ef, which is allocated to WO-185 and so absent from the pending feed, joined the same batch. One `followups --apply` batch disposed eleven rows, and the register moved to `5cfa58776b42695da3280efde2c7bf5ef599fcc06dae0146413397f6a3f829d8`. Each reason cites this report.

| Row | Disposition recorded | Why |
| --- | --- | --- |
| FUP-4feed3b6e7a451ef (WO-102 D010, allocated) | settled | Criterion 7's retarget at close: the corpus failure path is bounded at its source, and this review's drift runs held under 805,306,368 bytes. |
| FUP-bf96425734635b32 (D011) | settled | VER-001 F1 to F5 repaired; VER-002 F6 corrected by D014; passing at the final identity. |
| FUP-84cf4b296783d303 (D018) | settled | FINAL-001's ledger driver now yields a typed stop with no survivor. |
| FUP-8934512b05a3c570 (D019) | settled | The nonfinite quarantine fixture passed in this review's gate. |
| FUP-81ad883bf1d8c9cc (D020) | settled | The wrapper commands above. |
| FUP-973bf7b53a14f177 (D021) | settled | D025's dispositions; `runner-fixtures` passed. |
| FUP-e8f5399db33d0b5a (D028) | deferred, D028's condition | The five low items, none reproduced. WO-186 opens the runner next, which meets the condition. |
| FUP-c1a89d52cc314af9 (D014) | open, for planning | The live shared guard, pid 65032, still runs the code from before FINAL-001's repair. |
| FUP-312a88f5e185c3b1 | deferred, condition narrowed to stops of real work | Its literal condition, "the guard records a kill", occurred only for test trees. All 31 rows in the per-user ledger are fixture, probe or lock-helper stops at budgets of at most 805,306,368 bytes, and none is newer than the FINAL-001 repair. |
| FUP-f1c7a256bec46737 | open, kept with a new measurement | The role sentence adds 167 bytes to every role. All roles are within their ceilings, and the verifier has 196 bytes of headroom. |
| FUP-e821aa2ced3aa111 | deferred, same condition | The runner was opened, but no reporter was selected for suites started through `node()`. |

The other fourteen rows were textual matches whose seams this change did not open and whose conditions did not occur, so they are left as they are. They are FUP-069dff5d52d98e0d, FUP-33173b7f87004a9c, FUP-4b70089b028849f0, FUP-51c310284c2fea17, FUP-895692b9939c8181, FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-b3454d6ce3594ef3, FUP-d093f77bd927f9dc, FUP-d0a9719cc2e4ec55, FUP-ec72b2ea596bdc75, FUP-fb8cbeabbddef397 and FUP-fd05316b6030ef73. FUP-a5c6ac8cb40bd52a, the worktree CLI ordering defect from D016, is outside this order's surfaces and stays untriaged for planning.

## Integration and carry-ins

- **Integration:** none due. `origin/main` is still `340a67c9`, which D017 integrated during the second repair. No version collision: the application is v0.66.1 and the skeleton 0.52.1, above `main`'s v0.66.0 and 0.52.0.
- **Receipt 038, host-wide scope:** met by criterion 4's separate-clone case and the per-user coordination root. Neither reopening condition was observed.
- **Receipt 038, approval surface:** no harness configuration gained an allow rule for the wrapper. `grep` finds no `harness bounded` rule in `.claude/settings.json` or `.claude/harness-manifest.json`.

## Verification sequence

1. **Implementation** (Codex CLI 0.160.0, `gpt-6.1-sol`, max, `codex-session-readback`): `ImplementationReady` at 2026-10-03T03:50:22Z, checkpoint 2. D001 to D010.
2. **[VER-001](../../verifications/WO-185/VER-001.md)** (Claude Code 2.1.288, `claude-opus-5-5`, xhigh): fail at 04:15:41Z. Criterion 3 was unmet: a double-forked `setsid()` descendant survived (F1). F2 to F5 were adjacent defects.
3. **Repair** (Codex CLI 0.160.0, `gpt-6-astra`, max): completed 05:07:32Z. D011 to D013.
4. **[VER-002](../../verifications/WO-185/VER-002.md)** (Claude Code 2.1.288, `claude-opus-5-5`, xhigh): fail at 14:57:22Z. F1 to F5 were repaired, but F6 was new: a recycled descriptor watch adopted unrelated processes, and `test:docs` failed twice.
5. **Repair** (Claude Code 2.1.288, `claude-opus-5-5`, xhigh): completed 16:56:45Z. D014 to D017, including D017's integration of `main` at `340a67c9`.
6. **[VER-003](../../verifications/WO-185/VER-003.md)** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): pass at 17:26:10Z.
7. **[FINAL-001](FINAL-001.md)** (Claude Code 2.1.288, `claude-opus-5-5`, xhigh): fail at 17:56:40Z, on D018, D019 and D020, with the D021 items for disposition. D022 corrects one of its sentences.
8. **Repair** (Codex CLI 0.160.0, `gpt-6.1-sol`, max): completed 20:00:55Z. D023 to D027.
9. **[VER-004](../../verifications/WO-185/VER-004.md)** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): pass at 2026-10-04T05:29:09Z, with D028.
10. **This review** (Claude Code 2.1.289, `claude-opus-5-5`, xhigh): dispatched 13:58:06Z, checkpoint 20.

## Executed checks

Every probe ran under `node scripts/harness.mjs bounded`, one at a time, after the gate had finished. Drivers and transcripts are in this session's DotLn scratch under `final002/`.

- **State:** `npm run resume --silent -- status --json`, `node scripts/harness.mjs writer --show`, usage at entry, and `git fetch origin` with the base comparison.
- **Hashes and identity:** report hashes against the control events; `gateCodeIdentity` before staging, after staging and on the gate row.
- **Product gate:** `npm test -- --again --review`, as recorded under criterion 8. Its transcript, `review-gate.txt`, has no `not ok` line.
- **FINAL-001's findings:** the ledger driver and its reader (`ledger-probe.txt`); the four wrapper commands (`wrapper.txt`).
- **Criterion 5:** the three drift runs (`drift.txt`) and the three unchanged files (`unchanged.txt`).
- **Leftovers:** `ps` found no fixture, allocator or probe process afterwards, only the shared guard. The checkout's `docs/control/local/harness/memory-incidents.jsonl` is still absent.
- **Write-backs:** `node scripts/harness-context.mjs --check` and `node scripts/harness.mjs check` (32 surfaces); a count of the role sentence across both skill roots; `git diff --check HEAD` and `git diff --cached --check`.
- **Register:** the per-user incident ledger and guard metrics, and the `followups --touching` pages and `--apply` batch above.

Not re-run: the 34 host-guard fixtures outside the gate (their suite passed inside it); FINAL-001's round-trip case through the repaired reader (VER-004 ran it, and the gate's generated-quarantine fixture covers the path); criterion 6's legacy confirmation, which the order runs once; and the CPU-override lane cases at 4 and 2 CPUs, which VER-004 ran.

## Observations with no finding

- **The unchanged generators file's peak.** Run alone, `wo102-generators` peaked at 787,393,208 bytes, 97.8% of the 805,306,368-byte bound that the executor chose for criterion 5's drift runs. That bound is an evidence setting, not a production budget; the task budget on this host is 12,884,901,888 bytes. A later run of the unchanged file under the same bound could be stopped.
- **The live guard.** The shared guard's log records one `host-footprint-3c340e08c996c6c1 ETIMEDOUT` on a process/footprint inventory, with "retrying remaining observations"; no incident followed. It is the older guard's code and one occurrence, so it is noted here and carried by FUP-c1a89d52cc314af9's opening. No defect in the reviewed code is shown.
- **Probe peaks.** For a probe that ends in tens of milliseconds, the wrapper's `peakFootprintBytes` (1,327,464 bytes for each of the four wrapper commands) is the launch census of the paused launcher. Peaks are sampled, as product 07 states.

## Publication

The verdict is pass, so this review prepares [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md), records `final-review-result pass`, commits the reviewed state and runs `npm run worktree -- publish WO-185` with that title and body. It does not merge, push `main` or publish a release.
