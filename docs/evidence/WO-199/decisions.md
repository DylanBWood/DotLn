# WO-199 decisions

## WO-199-D003 — Correct the zombie diagnosis and preserve already accepted receipts

```json
{
  "id": "WO-199-D003",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Correct the initial diagnosis of the revocation EPERM: it was described in chat as a launch race, but the checked ps observation showed an already-exited, unreaped zombie group. Treat EPERM as no proof of absence and wait within the settlement bound for ESRCH. Preserve the durable receipt when the post-persistence crash fixture interrupts the host: the receipt has already passed admission and must not acquire a terminal refusal.",
  "evidence": [
    "The bounded diagnostic probe at 2026-10-08T00:50:28.293Z recorded EPERM for SIGKILL and signal 0 on the same group; ps -p <writer> -o pid=,ppid=,pgid=,stat=,uid= reported Z. Queuing pre-spawn stops did not remove that observation, so launch timing was not the demonstrated cause.",
    "The current WO-199 recovery regressions pass through crash-vertical, crash-direct, revoke-vertical and a still-running orphan. The identity-mismatch regression leaves the unrelated identity untouched.",
    "Existing older-receipt recovery tests simulate a crash by throwing in afterReceiptSaved. Recording that hook as host-admission-receipt would poison an accepted receipt; the fixture boundary now preserves replay. Genuine receipt-save errors still record host-admission-receipt."
  ],
  "rejected": [
    { "option": "Treat EPERM as absence", "reason": "The writer or descendants may still exist; only ESRCH establishes group absence." },
    { "option": "Turn a post-persistence crash into an admission refusal", "reason": "The saved, admitted receipt is the established recovery subject." }
  ],
  "reopenWhen": "Settlement cannot establish group absence within its bound, or a receipt saved before a crash loses exact replay."
}
```

## WO-199-D001 — Preserve writer ownership and termination before accepting recovery

```json
{
  "id": "WO-199-D001",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Repair the recorded wrapper, interrupt and admission seams. Await the wrapper's launch identity before recording SourceChangeProcessStarted; keep separate writer groups and require termination before integrity. Record a writer's native process birth identity and revalidate it before recovery signals a surviving group. Pass a run-owned abort signal from dotln vertical to the source host and preserve the pending vertical command on interruption. Class post-result admission failures by the host check without a transport interruption.",
  "evidence": [
    "baseline.json: the agreed bounded probe reproduced all three FINAL-001 outcomes at entry; crash-vertical lacks its group, crash-direct observes, revoke-vertical records neither termination nor interruption.",
    "source-change-host.ts explicitly refuses to signal saved PIDs because of reuse; scripts/lib/host-resources.mjs already exposes native PID/birth/group observations for macOS and Linux.",
    "VerticalHost records any source-change exception as a terminal refused step; an operator interrupt must leave its persisted command pending instead.",
    "The work order requires a live feedback episode after the last judged-source edit. Complete behavioral review before that episode to avoid invalidating it."
  ],
  "goalAlignment": {
    "traps": "Policy resistance: keep group separation and termination-before-integrity rather than bypassing recovery checks. Naive intervention: a saved group alone cannot authorize a kill, so match its birth identity. Shifting the burden: leave interrupted commands pending for rerun instead of asking the operator to clear state. Drift: keep D061 and resident scheduling outside this order.",
    "noOp": "The reproduced failures remain and WO-118 cannot safely rely on stop and rerun."
  },
  "rejected": [
    { "option": "Kill a saved numeric group without identity", "reason": "A reused process ID could belong to another host task." },
    { "option": "Return writers to the host process group or infer termination from elapsed time", "reason": "Both weaken the recorded termination boundary." },
    { "option": "Clear a refused vertical by hand", "reason": "The order explicitly repairs recovery so the operator need not rescue it." }
  ],
  "reopenWhen": "A regression or independent review demonstrates missing termination, identity reuse, a writer outliving the 10-second signal bound, or an interrupted issue sealing refused."
}
```

## WO-199-D002

```json
{
  "id": "WO-199-D002",
  "date": "2026-10-08",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.69.2, the next patch above the observed release baseline v0.69.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.69.1 (local tags)",
    "patch classification declared in docs/work-orders/WO-199-the-vertical-survives-an-interrupt.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-199-D004 — Resolve independent-review recovery gaps

```json
{
  "id": "WO-199-D004",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Fix all three unique independent-review findings and the root-observed missing-intermediate ancestry edge within the recovery duty. A durable stopped attempt bypasses its stale lease, and recovery establishes termination before fencing. Native source dispatch is held on a private launch channel until the group/birth marker is durable. The existing native launcher remains the group supervisor until the actual writer ends, reports its exit over the private channel, and stops remaining group members even if the original host died. The writer never inherits that channel. Older identity-bearing records retain conservative native ancestry recovery; no missing or mismatched identity authorizes a signal. Register the native helper sources in feedback and deterministic edition identities.",
  "evidence": [
    "The criteria adversary found 3 blockers and the design improver found 1 duplicate blocker in the initial diff: immediate rerun before lease expiry, a surviving child after leader exit, and unrestricted execution before durable start recording. Both read-only workers subsequently judged those original findings resolved.",
    "The root checked the native original-parent identity contract: losing both a leader and an intermediate process breaks the ancestry chain for a surviving grandchild. Stable supervision keeps the saved group leader available and self-cleans the group when the actual writer completes; this needs no polling-based inference.",
    "Bounded WO-199 SourceHost regressions, 2026-10-08T01:15:19.617Z-01:15:42.868Z, exit 0: 5 tests pass, including direct/wrapped crashes, live orphan recovery, child/grandchild cleanup, pre-marker host death with no admitted writer, mismatched identity left untouched, revocation, and effect/receipt-save refusals.",
    "The CLI regression now restarts at the next fixture timestamp before its 5-second lease expires; it no longer jumps to timestamp 6000."
  ],
  "goalAlignment": {
    "traps": "Policy resistance: termination evidence and process identity remain mandatory. Naive intervention: do not kill an unproven numeric group. Shifting the burden: remove the test clock workaround and prove an immediate rerun. Drift: retain D061 and resident scheduling outside this order.",
    "noOp": "The test would hide the stale-lease refusal, and a crash could leave an editing writer with no recorded or recoverable group identity."
  },
  "rejected": [
    {
      "option": "Wait for lease expiry before allowing the rerun",
      "reason": "A durable stop proves that the writer cannot renew the lease; the operator should not inherit an artificial wait."
    },
    {
      "option": "Use a numeric group or sampled ancestry alone for every orphan",
      "reason": "PID reuse and missing ancestry cannot establish ownership. A stable native supervisor preserves the saved identity for new launches."
    },
    {
      "option": "Send the prompt only after recording but launch the unrestricted binary beforehand",
      "reason": "The binary can change the repository before reading its prompt. The exec gate holds execution itself."
    }
  ],
  "reopenWhen": "A current regression proves a writer effect before durable start, a stopped attempt refusing immediate restart, a surviving group with lost supervisor identity, or a forged/private result-channel observation."
}
```

## WO-199-D005 — Component compatibility and allocated defect dispositions

```json
{
  "id": "WO-199-D005",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Bump the changed skeleton component from 0.55.0 to 0.55.1 as a compatible defect repair; synchronize the console dependency and workspace lock entries without adding a dependency or changing the console component release. Settle WO-112 D060, D065 and D066 onto this order after the before/after probe, signal restart, and typed-refusal regressions establish their repairs.",
  "evidence": [
    "The application release preparation assigns v0.69.2 under the declared patch classification (D002).",
    "The skeleton fixes existing transport/recovery behavior; the optional dispatch gate and abort signal preserve existing callers. The console changes only its dependency pin.",
    "baseline.json and after.json preserve the agreed reproduction table; handoff.md names the final executed suites and edition checks."
  ],
  "rejected": [
    {
      "option": "Bump an unchanged console implementation or add a new dependency",
      "reason": "Neither is needed for the compatible skeleton repair."
    }
  ],
  "reopenWhen": "A compatibility break, dependency change, or recurrence of any allocated D060/D065/D066 defect is demonstrated."
}
```

The agreed probe's before/after table (full rows and timing in `baseline.json` and `after.json`):

| Case | Baseline | Repaired |
| --- | --- | --- |
| crash-vertical | group absent; recovery lacks termination evidence | group recorded; observed |
| crash-direct | group recorded; observed | group recorded; observed |
| revoke-vertical | neither stop nor interruption recorded | stop and original interruption recorded |

Additional native regressions cover immediate recovery while a writer remains alive, surviving descendants and a double fork, death before the durable start marker with no admitted writer, and a mismatched birth identity left untouched. The real CLI signal regression restarts before lease expiry; its SIGINT writer ignores the graceful signal to exercise bounded SIGKILL escalation.

## WO-199-D006 — Current live and deterministic editions

```json
{
  "id": "WO-199-D006",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Record a new immutable WO-199 revision 001 feedback edition after the final judged-source edit and a live Codex gpt-6.1-sol/max verifier episode. Select WO-199 revision 001 for all four current evidence families and remint the deterministic authority, artifact identity and verification editions. Preserve earlier editions.",
  "evidence": [
    "The bounded live feedback run at 2026-10-08T01:21:21.534Z-01:22:14.519Z exits 0 with phase complete, 10 fixtures, and 1192 fewer instruction bytes in the matched projection.",
    "feedback-evidence --check reports that docs/evidence/WO-199/feedback-001 judged the current source, with all ten present/removal pairs passing.",
    "edition-checks.json records exit-0 current checks for feedback, authority, artifact identity and verification. Current.json selects those four immutable WO-199 editions."
  ],
  "rejected": [
    {
      "option": "Carry the prior live audit across changed source-host/worker transport behavior",
      "reason": "The changed judged behavior requires the new live episode named by criterion 4."
    }
  ],
  "reopenWhen": "Any judged source or registered behavioral dependency changes, or a current edition check fails."
}
```

## WO-199-D007 — Repair the failed review gate and correct its readback

```json
{
  "id": "WO-199-D007",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Correct the incomplete progress readback and repair the four encountered gate issues before rerunning the required sequence. Keep revocation's original typed interrupted reason through the wrapper. Update three historical crash tests to assert the newly required immediate recovery while retaining their exact-effect checks. Remove launchGated when constructing a genuinely historical missing-marker log. Place this order's new CLI/recovery tests in a sibling file in the same vertical product row so they can use its existing second file lane; retain its two lanes and 900000 ms deadline.",
  "evidence": [
    "The first npm test -- --review log ended with 36 passed, 2 failed, 88 fresh tasks, and 1647953 ms. The skeleton row failed three expired-lease expectations and one malformed historical fixture; vertical reached its 900164 ms timeout. The progress update that said no failures were reported had read the log tail and missed FAIL skeleton at line 367. The complete failure-line scan establishes the correction; that run is not passing evidence.",
    "The wrapper used a plain Error for authority revocation, which SourceChangeHost classified transport-failed. It now uses the existing WorkerFailure interrupted reason, and both source-integrity and vertical recovery regressions assert the durable reason.",
    "The bounded source-host and source-integrity suite at 2026-10-08T01:58:02.407Z-01:59:09.837Z exits 0 with 38 tests passing. The sibling CLI/recovery suite at 2026-10-08T02:00:23.649Z-02:01:34.646Z exits 0 with both tests passing, including all three signals and the SIGINT escalation case.",
    "The agreed probe at 2026-10-08T02:02:43.889Z-02:02:50.894Z exits 0: crash-vertical and crash-direct record groups and recover observed; revoke-vertical records stop and interruption with the original interrupted reason.",
    "Both reused read-only workers reviewed the gate repairs and sibling-file inventory change, finding 0 new actionable issues. The required full review gate remains to be rerun; these focused results do not stand in for it.",
    "Correction to the later timing update: the checked completed-case durations in the failed review log are 61719 ms and 18410 ms, totaling 80129 ms for the two WO-199 tests. The chat figure of about 87 seconds was incorrect. D008 records the executable file-order check and the corrected placement."
  ],
  "rejected": [
    { "option": "Restore the old lease-delay expectations", "reason": "They contradict the order's immediate-rerun requirement and would hide a repaired defect." },
    { "option": "Treat a new gated attempt as a legacy missing-marker log", "reason": "The gated marker proves execution was not admitted; a legacy fixture must omit evidence that did not exist in that format." },
    { "option": "Increase the vertical deadline or change the resident scheduler", "reason": "The new tests can run in the row's existing second file lane without changing its bounds or product scope." },
    { "option": "Report the first review run as green based on its tail", "reason": "The full log records two failing rows; only a successful current-identity rerun can meet criterion 5." }
  ],
  "reopenWhen": "The current full review gate fails, a revocation loses its original reason, or the unchanged vertical row bounds cannot contain the existing and new recovery regressions."
}
```

## WO-199-D008 — Preserve the main vertical file's initial test lane

```json
{
  "id": "WO-199-D008",
  "date": "2026-10-07",
  "dispatch": "resume: next",
  "decision": "Rename the new sibling to scripts/test-vertical.recovery.mjs and update only its vertical-row inventory entry. The host's Node test runner starts files in name order; the original hyphenated recovery name took the initial second lane and delayed the main file. The dotted suffix follows the main filename so the main and judgment files start together and recovery uses the next free lane. Retain two file lanes, the 900000 ms row deadline, and all test content.",
  "evidence": [
    "The restarted full review passed skeleton and target-publish. Its vertical progress at row time 100100 ms showed the first main-file case entered 17900 ms earlier, after recovery had held its lane for about 82 seconds. That observation disproved the assumed placement benefit of the initial sibling name.",
    "The root stopped its own gate through harness evidence --stop at 2026-10-08T02:25:56.298Z. The command reported no active run and no check recorded; this interrupted review is not passing gate evidence.",
    "file-order.json records one bounded matched comparison with the host Node binary, three synthetic test files, identical delays and two lanes. With test-vertical-recovery.mjs, judgment and recovery start at 0 ms and main at 247 ms. With test-vertical.recovery.mjs, main and judgment start at 0 ms and recovery at 450 ms. Both arms pass; the changed axis is main-file start delay.",
    "The bounded comparison at 2026-10-08T02:26:32.946Z-02:26:34.490Z exits 0. This scheduling fixture proves file order, not the full vertical row's runtime; the required full review is rerun after the repair."
  ],
  "goalAlignment": {
    "traps": "Naive intervention: measure the host's start order instead of assuming argument order. Drift: keep the existing vertical row, limits and resident behavior. Policy resistance: the interrupted run supplies no passing check.",
    "noOp": "The main file inherits the new recovery file's start delay and the intended use of the spare lane has no critical-path benefit."
  },
  "rejected": [
    { "option": "Keep the first sibling name or reorder only the arguments", "reason": "The observed host sorts names; the matched comparison holds the supplied argument order constant." },
    { "option": "Increase concurrency or the row deadline", "reason": "A bounded filename correction gives the main file its original lane without changing the gate or product limits." }
  ],
  "reopenWhen": "A host runner changes its file-start order, or the current vertical row still exceeds its unchanged deadline."
}
```

## WO-199-D009 — Verification: fail on a signal regression outside the writer step; criteria 1 to 5 hold

```json
{
  "id": "WO-199-D009",
  "date": "2026-10-07",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on F1. It is a regression of behavior main had, shown by a probe, in the order's declared surface (the dotln vertical branch of dotln.ts and the step loop of vertical-host.ts). Criteria 1 to 5 are met at code identity 685d99e40887bd455b285a3a5529918cec59875b0c121c9eee7d003cc6a5cf53. F1 (blocking): dotln vertical now installs SIGINT, SIGTERM and SIGHUP listeners for the whole run (dotln.ts:92-100). Node therefore no longer exits on these signals, and only the writer step listens to the abort. A signal during any other step leaves the host running until that step ends. A judgment episode is bounded at 600 s, and the review-settle poll at 900 s by source. A repeated signal is ignored (dotln.ts:96). At HEAD the vertical branch had no listener, so each signal ended the host at once. F2 (follow-up): writer launches now compile native helpers at product runtime. F3 (follow-up): the abort reaches a repair writer only through an untyped spread, and no regression interrupts a repair writer.",
  "evidence": [
    "F1, docs/evidence/WO-199/verification-001-signal-step-probe.mjs under harness bounded, 2026-10-08T03:32:53.168Z-03:35:04.171Z, exit 0. The probe uses the order's own CLI actor doubles. The writer step completes in the same run, the next verification judgment is held for 30 s, and the host pid alone is signalled. The subject exits 29518 ms after SIGTERM (code 143), 29536 ms after SIGINT (130) and 29541 ms after SIGHUP (129). The HEAD disposition (the same subject with only the new listeners dropped) exits 8 ms after SIGTERM, by signal. Every variant leaves verification pending. An earlier scratch run, 03:24:04Z-03:25:38Z, gave 29540, 29534 and 8 ms. Rows are in verification-001-observations.json.",
    "F1, HEAD disposition: git show HEAD:packages/skeleton/src/dotln.ts lines 85-97 run runVerticalIssue with no listener. At HEAD, dotln.ts, vertical-host.ts, vertical.ts, source-change-host.ts, worker-transport.ts, vertical-runtime.mjs, vertical-primitives.mjs and vertical-transport.mjs hold no SIG listener other than the presence branch's three. D060 records the same: 'Ctrl-C, SIGTERM or a closed terminal now stops only the host'.",
    "F1, reach (source inference, not probed): the review-settle loop (vertical-primitives.mjs:230-272) waits up to SETTLE_LIMITS.timeoutMs 900000 in 15 s polls and never reads the signal, and no child process exists to receive a terminal Ctrl-C there. A judgment child launch is not detached (worker-transport.ts:118-120 groups only resident or writer launches), so a terminal job-wide Ctrl-C reaches a real judgment CLI as well. A signal sent to the host pid alone does not, which is how kill, a process supervisor or WO-118's restart would stop the host.",
    "F2, source: SourceChangeHost dynamically imports scripts/lib/host-resources.mjs (source-change-host.ts:562-580, 612-616, 825-835). taskLauncher() compiles host-lock.c, and on darwin readHostSnapshot compiles host-footprint.c, with clang and xcrun into the user temp root on first use (host-resources.mjs:116-162, 330-370). At HEAD, only gate scripts imported host-resources.mjs (bounded-command, host-guard-state, host-lanes, process-monitor). The product's README and docs name no C toolchain. A launch on a host without one would throw before WorkerAttemptStarted. That is inferred and not observed.",
    "F3, source: RepairHost's source option type (repair-host.ts:71-80) omits signal. vertical-primitives.mjs passes sourceOptions(state), which carries signal, and RepairHost.sourceHost() spreads it into the child SourceChangeHost (repair-host.ts:205-209). The abort reaches a repair writer at runtime only through that untyped spread. Neither test file interrupts a repair writer.",
    "Criteria: the agreed probe at 03:17:28Z-03:17:35Z records crash-vertical group 46728 observed, crash-direct group 47978 observed, and revoke-vertical stop and interruption. The source-change integrity and host suites pass 38 of 38 (03:17:41Z-03:18:51Z). scripts/test-vertical.recovery.mjs passes 2 of 2 (03:18:59Z-03:20:15Z): all three signals, exit codes, group ESRCH, the recorded signal and stop, and an immediate rerun reaching resolved. The feedback, authority, artifact-identity and verification edition checks all pass. npm run format:check passes and git diff --check is clean. The npm test row (gateSelection review, exit 0, recorded 2026-10-08T02:59:07.590Z) matches the current code identity and was not rerun."
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "Criterion 2's recorded WorkerInterrupted presupposes a live writer episode, and it holds in that scenario. F1 fails the verdict by the main-behavior route instead."
    },
    {
      "option": "Route F1 as a follow-up",
      "reason": "Product 07 routes a change that breaks behavior main had, shown by a probe, as blocking. The probe shows HEAD's immediate exit become a wait for the rest of the step, in the order's declared surface."
    },
    {
      "option": "Fail on F2 or F3",
      "reason": "Neither breaks a criterion, and no probe shows either breaking behavior main had. Criterion 5's 'no new dependency' reads as the package dependencies the Cost names, and none was added."
    }
  ],
  "followup": "WO-199 resume: fix. (F1) After SIGINT, SIGTERM or SIGHUP, dotln vertical exits non-zero within a stated bound in every step, not only the writer step. A judgment episode, the review-settle wait or a repair verifier must not hold the host past that bound. Either the run's abort stops every in-flight non-writer episode and wait, or the handler exits once no writer is live and writer settlement has finished. A repeated signal never extends the wait. Keep the writer path's forwarding, 10-second settlement, WorkerInterrupted record and pending step, and keep the README paragraph accurate. Regressions: a signal during a judgment step, and one during the settle wait, exit within the bound with the step still pending, and a rerun resumes. Check: npm test -- --review and npm run test:docs. (F2, boarded) Name the C toolchain prerequisite where dotln vertical's setup is described, or refuse with a named reason when the native launch helper cannot be built. Never weaken the launch gate or birth-identity check to avoid the compile. (F3, boarded) Type signal through RepairHost's source options and add an interrupt case at the repair writer.",
  "reopenWhen": "A repair changes the dotln vertical signal handler, VerticalHost's step loop or the non-writer step waits; a probe shows a signal outside the writer step exiting within the bound; a host without a C toolchain runs dotln vertical; or a repair writer is interrupted."
}
```

## WO-199-D010 — Repair VER-001 F1: a signal ends every step of `dotln vertical` as soon as its synchronous work returns, and a rerun of an interrupted step resumes

```json
{
  "id": "WO-199-D010",
  "date": "2026-10-08",
  "dispatch": "resume: fix",
  "decision": "Close VER-001 F1 by making the run's abort reach every asynchronous episode and wait, not only the writer step. The vertical's transport wrapper (scripts/lib/vertical-transport.mjs) takes the run's AbortSignal: for every request but a source-change writer it stops the child at once and rejects its completion with the hosts' typed WorkerFailure('interrupted', <signal>), so a baseline, verification or review judgment, a repair verifier and the admission intake episode end as soon as the signal arrives and, where they have a store, that store records WorkerInterrupted; a triage episode is stopped and its command stays undecided; the writer keeps the source host's forwarding, 10-second settlement, record and pending step. The primitives make the observation step's check poll and the judgment lease sleep abortable timers, and a shared lease wait honors a stopped episode's 5-second lease before the one fresh attempt for every judgment a rerun resumes and, through a repair-host hook, for a repair verifier: the verification reactor keeps an interrupted episode's lease, the host refuses a fresh attempt as still leased, and the vertical would seal that refusal. The repair host records neither the run's abort nor the lease waiter in its opening, which both entries must reproduce. VerticalHost checks the abort before each step and again after the permitted and start awaits, records a step that returned despite the abort instead of discarding it, and before classifying a step failure lets the loop turn a few times so a terminal-wide signal that killed a synchronous child is handled first and the step stays pending as interrupted rather than sealed as refused; the runtime does the same for admission and admits nothing after a signal. The source host checks the abort before recording an attempt, so an abort before launch burns none of the two dispatches. The CLI keeps its listeners, ignores a repeated signal, keeps the signal's exit code when the run returns, and exits with that code 15 s after it handles the first signal should the run still not have ended. The rule the repaired code holds: after SIGINT, SIGTERM or SIGHUP, dotln vertical exits non-zero within 10 s while a writer is live and as soon as the step's synchronous child command returns in every other step (a Git command within 15 s where the source host runs one, a focused test within 180 s, a witness test within 30 s per test, a forge read or push without a timeout), the backstop counting from when the signal is handled; the interrupted step stays pending and the next run resumes it. Also closed within the repair: F3, signal typed through RepairHost's source options with regressions at a repair writer and a repair verifier; F2, the C toolchain prerequisite named in the skeleton README beside the live-worker opt-in.",
  "evidence": [
    "The verifier's own probe, unchanged, under harness bounded at 2026-10-08T04:10:39.650Z-04:11:21.467Z, exit 0: the subject exits 19, 16 and 19 ms after SIGTERM, SIGINT and SIGHUP in the held verification step (codes 143, 130, 129), against 29518, 29536 and 29541 ms in VER-001; the HEAD disposition exits 11 ms by signal; verification stays pending in every variant. Rows in repair-001-signal-step.json. Rerun after the review's fixes at 2026-10-08T04:58:35.497Z-2026-10-08T04:59:17.613Z, exit 0: 14 ms after SIGTERM (143), 22 ms after SIGINT (130), 20 ms after SIGHUP (129); the HEAD disposition 9 ms.",
    "scripts/test-vertical.recovery.mjs under harness bounded: 2026-10-08T05:23:51.953Z-2026-10-08T05:25:50.679Z, exit 0, 6 of 6, at the final code identity. The three signals at a live writer with a repeated SIGINT inside the 10 s bound; a held verification judgment, a real child, stopped by SIGTERM with the host exiting 143 within 5 s, the child gone, WorkerInterrupted interrupted in its store and the witnesses receipt kept, and a rerun started 2 s inside the stopped episode's lease on the preload's real-time clock waiting it out, recording WorkerLeaseExpired at or after the lease and one fresh attempt before resolving; the observation poll on a declared IN_PROGRESS check ended by SIGINT within 5 s after exactly one check query, the rerun resolving with the check SUCCESS; a repair writer stopped by SIGHUP within 10 s with the signal and stop recorded in the repair's child store, a rerun's held repair verifier stopped by SIGTERM with its interruption recorded, and the in-process entry, without a signal and with the CLI's transport identities, resuming the CLI-opened repair 2 s inside the verifier's lease to resolved with a second attempt after WorkerLeaseExpired; a step failure thrown while a terminal-wide signal is still pending left pending as interrupted, and a step that returned despite the signal keeping its receipt before the run stops. Transcript in repair-001-recovery-tests.txt. The skeleton repair-host, source-change-host and source-change-integrity suites at the same identity: 2026-10-08T05:25:50.789Z-2026-10-08T05:26:52.779Z, exit 0, 38 of 38",
    "scripts/test-vertical-judgment.mjs under harness bounded: 2026-10-08T04:51:22.647Z-2026-10-08T04:58:35.372Z, exit 0, 37 of 37, including the held intake episode stopped by SIGTERM with nothing recorded and the rerun admitting. scripts/test-vertical.mjs: 2026-10-08T05:00:24.376Z-2026-10-08T05:11:44.001Z, exit 0, 160 of 160. The skeleton repair-host, source-change-host and source-change-integrity suites: 2026-10-08T04:59:17.735Z-2026-10-08T05:00:24.257Z, exit 0, 38 of 38. Earlier bounded runs before the review's fixes passed 36 of 36 (04:16:51Z) and 160 of 160 (04:23:48Z); rows in repair-001-suites.json.",
    "Editions: the feedback edition is re-minted as docs/evidence/WO-199/feedback-002 after the last judged-source edit (repair-host.ts, source-change-host.ts; worker-protocol.ts is back to its installed bytes), with the live self-host on codex-cli-exec gpt-6.1-sol max under harness bounded at 2026-10-08T05:26:56.330Z-2026-10-08T05:27:43.204Z, exit 0, phase complete, 10 fixtures, 1192 fewer instruction bytes, from the alias-free session scratchpad (the DotLn scratch under /var is a path alias the verifier mount refuses); current.json selects feedback 002 and keeps authority, artifact-identity and verification at 001, whose checks regenerate unchanged; all four checks pass under bounded (repair-001-edition-checks.json). A shared typed interruption was first placed in worker-protocol.ts and moved to vertical-host.ts, with a local copy in the source host, because worker-protocol.js is a pinned harness runtime file and its change would have forced a hook reinstall in a repair.",
    "Source: reactor.ts admits WorkerAttemptStarted only when activeEpisode is null, the lease expired or occurredAt reached leaseExpiresAt (requireState 'prior episode still leased'); VerificationHost.run throws profile-refused 'prior episode still leased' before a fresh attempt; LEASE_MS is 5000 and heartbeats stop with the host; vertical-primitives.mjs waited for that lease only on a review retry and RepairHost.verify never did. A rerun within 5 s of an interrupted or crashed verification, baseline or repair-verifier judgment was therefore refused and sealed, on main as here.",
    "Source: RepairHost.opening() spread the whole source and verifier option sets into the recorded RepairOpened, which restore compares by canonical JSON; the run's AbortSignal serializes as {} under the CLI entry and is absent under the resident entry, so a repair opened by one entry and resumed by the other threw 'repair recovery request drift' and was sealed refused.",
    "Source: a JS signal listener runs only when the event loop turns; spawnSync (sourceGit 15 s, runFocusedTest 180 s, witnessTest 30 s per test, executeGh and spawnGit untimed) blocks it, so a terminal-wide signal that kills such a child surfaced as a thrown step failure before the listener ran and VerticalHost recorded it refused.",
    "Source: modelIntake's transport was not wrapped and runVerticalIssue read no signal before host.run; the wrapper already stops every child on authority revocation and records the typed interrupted reason (D007), so the operator's abort sits beside it with the writer exemption explicit in one place.",
    "Review: a four-agent read-only workflow (three lenses, one batched refutation) over the repair diff found 27 findings (nine unique); 26 confirmed and one refuted (the two-dispatch cap is the documented recovery contract, README §Recovery). All confirmed findings are fixed in this repair except the pre-existing browser-scenario rerun, boarded in D011; reviews.md records the counts."
  ],
  "goalAlignment": {
    "traps": "Naive intervention: a forced exit alone would orphan judgment children and leave their leases live; the abort stops and records them first. Policy resistance: keep the writer's forwarding and settlement instead of a wrapper SIGKILL, and keep the reactor's lease and the two-dispatch cap. Shifting the burden: the rerun resumes under either entry without the operator clearing state or waiting beyond the 5-second lease. Drift: the intake episode's own behavior, D061 and resident scheduling stay untouched.",
    "noOp": "A signal outside the writer step leaves the host running to the end of a judgment (600 s), a settle poll (900 s) or a repair, and WO-118 cannot stop and rerun a vertical."
  },
  "rejected": [
    { "option": "Thread the abort into VerificationHost and runVerticalJudgment as host options", "reason": "The same behavior spread across judged hosts beside the wrapper that already stops these children on revocation; the wrapper is the one place both stops belong, and the repair host needs only a lease-wait hook." },
    { "option": "Exit from the handler once no writer is live, without aborting non-writer episodes", "reason": "Leaves a judgment, intake or triage child orphaned with its lease live, so the rerun waits or refuses; the abort stops the child and records the interruption." },
    { "option": "A second signal forces an immediate exit", "reason": "Skips the writer's SIGKILL escalation, so a writer that ignores the first signal outlives the host (D001's reopen condition); a repeated signal is ignored and the 15 s backstop bounds the wait." },
    { "option": "Clear an interrupted episode's lease in the reactor on WorkerInterrupted", "reason": "A kernel semantic change outside the declared surfaces; the wait costs at most 5 s and keeps the reactor's guard against two concurrent episodes." },
    { "option": "Run the focused and witness tests and the forge calls asynchronously under the abort", "reason": "Their hosts expose synchronous APIs shared beyond the vertical; the honest bound names each call's own timeout instead." },
    { "option": "Detach the synchronous Git, forge and test children so a terminal signal reaches only the host", "reason": "A detached test or push would outlive a dead host; a few loop turns before classifying a failure let the handler run first and keep the step pending." },
    { "option": "Leave the admission intake unwrapped under the order's intake non-goal", "reason": "The intake episode's classification, record and retry policy are unchanged; only the vertical's abort now reaches its child, as it reaches every step's child, so the backstop never orphans a paid 600 s episode." },
    { "option": "Keep discarding a step's result when the abort arrived after it returned", "reason": "The verifier flagged the discard; the loop's top check still stops before the next step." },
    { "option": "Refuse a missing C toolchain with a typed source-change reason", "reason": "F2 admits naming the prerequisite; a typed refusal needs a new closed-vocabulary reason through the source host, beyond this repair's bound." }
  ],
  "reopenWhen": "A probe shows dotln vertical alive more than 10 s after a signal with a writer live, or alive past the return of the synchronous child command in flight in any other step; a rerun after an interrupted admission, judgment, triage, observation, repair-writer or repair-verifier step, under either entry, is refused or sealed; a terminal-wide signal during a synchronous child seals a step; the 15 s backstop fires in a regression; or a host without a C toolchain runs the vertical and its refusal does not name the prerequisite."
}
```

The verifier's probe, before and after the repair (full rows in `repair-001-signal-step.json`):

| Variant | Signal | Exit after signal, VER-001 | Exit after signal, repaired | Exit |
| --- | --- | --- | --- | --- |
| subject | SIGTERM | 29518 ms | 19 ms | 143 |
| subject | SIGINT | 29536 ms | 16 ms | 130 |
| subject | SIGHUP | 29541 ms | 19 ms | 129 |
| HEAD disposition | SIGTERM | 8 ms | 11 ms | by signal |

## WO-199-D011 — Board the witnesses step's browser scenario, which the abort does not reach and whose rerun refuses its own directory

```json
{
  "id": "WO-199-D011",
  "date": "2026-10-08",
  "dispatch": "resume: fix",
  "kind": "finding",
  "decision": "Board, not fix, the review's one remaining confirmed defect. With a configured browserScenario the witnesses step awaits runScenario with no abort, so a signal there is bounded only by the CLI's 15 s backstop, and the rerun calls runScenario with the same browser-<round> directory and no recoverFrom, whose mkdirSync(directory, { recursive: false }) throws EEXIST, which VerticalHost records refused and the fold seals. The seal on rerun predates WO-199 (a host killed mid-scenario on main left the same directory). The README names the backstop bound for this step.",
  "evidence": [
    "Source: scripts/lib/vertical-primitives.mjs witnesses step awaits (external.browser ?? runScenario)(cfg.browserScenario, { subjectRevision, directory: join(directory, 'browser-<round>') }) with no signal; packages/browser-evidence/src/index.ts creates the directory with recursive: false and recovers prior browsers only through env.recoverFrom.",
    "Review: the rule adversary and the batched refuter both confirmed the gap from source; no regression covers a signal or a rerun during a browser scenario, and the fixture suites configure none."
  ],
  "rejected": [
    { "option": "Race the scenario with the abort and pass recoverFrom or clear the round's directory on rerun", "reason": "The browser-evidence adapter's recovery contract (WO-059) is outside this order's declared surfaces; the fix needs its own regression against the installed adapter." }
  ],
  "followup": "Make the witnesses step's browser scenario abortable by the run's signal and resumable on rerun: pass the round's directory as recoverFrom, or clear it, so a rerun after a signal or crash during the scenario does not refuse with EEXIST; add a regression with the fixture scenario. Until then the README names the 15 s backstop as the bound for this step.",
  "reopenWhen": "A vertical with a configured browserScenario is signalled or crashes during its witnesses step and the rerun is sealed refused, or the backstop fires there in a regression."
}
```

## WO-199-D012

<!-- integration refs/dotln/checkpoint/WO-199/10 -->

```json
{
  "id": "WO-199-D012",
  "date": "2026-10-08",
  "dispatch": "resume: final review; worktree integrate WO-199",
  "decision": "Integration mechanics are complete in the final-review worktree. Fetched main equals the base, 0eb0afa2, so the merge moved nothing, no authored conflict arose and no component version collides: v0.69.2 and skeleton 0.55.1 remain this order's targets. The named stash re-applied this order's uncommitted work. The regeneration changed only documents: this record, docs/evidence/WO-199/meta.json, the PR meter and the decisions index. Dispatch checkpoint 9 and integration checkpoint 10 differ only in docs/control/current.md, the control log and the work-order index, and the code identity stays e86d7a74c5ea939a4c937b4614f16334d841fc6caf862bc4187ee3087abedfc6, which VER-002 judged. VER-002's evidence therefore carries forward unchanged into this review, which made no source edit.",
  "evidence": [
    "refs/dotln/checkpoint/WO-199/10",
    "base 0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958",
    "upstream 0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958",
    "release preparation: WO-199 target v0.69.2 remains current. Files changed: docs/evidence/WO-199/meta.json, docs/final-reviews/WO-199/PR.md. Meter snapshot: docs/evidence/WO-199/meta.json, 4459 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-08. Original base: `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`.
Fetched main: `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`. Checkpoint: `refs/dotln/checkpoint/WO-199/10`.
Named stash retained: `3d3bb8b6aeb0c08bd468b90e1d8336f0a78384d4` (WO-199 integrate 2026-10-08).
Resolved projections: none.
Release preparation: WO-199 target v0.69.2 remains current. Files changed: docs/evidence/WO-199/meta.json, docs/final-reviews/WO-199/PR.md. Meter snapshot: docs/evidence/WO-199/meta.json, 4459 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer. Main did not move, so integration introduced no upstream path. `git diff --stat refs/dotln/checkpoint/WO-199/9 refs/dotln/checkpoint/WO-199/10` lists only docs/control/current.md, docs/control/orders/WO-199.jsonl and docs/work-orders/README.md. gateCodeIdentity returns e86d7a74c5ea939a4c937b4614f16334d841fc6caf862bc4187ee3087abedfc6 before and after integration. VER-002's criterion evidence carries forward; FINAL-001 judges the integrated subject and fails it on a defect present at that same identity (D013), not on anything integration introduced.
Authored conflicts observed: none.
Affected checks, run by the final reviewer on 2026-10-08 at the integrated subject: `npm run publication:check` exit 0; `node scripts/harness.mjs check` exit 0 (33 generated surfaces); `npm run release -- check-surfaces --local` exit 0. `npm test -- --review` was not rerun: FINAL-001 fails, so no reviewer gate row is needed for publication, and the passing review row at this code identity (2026-10-08T05:53:55.360Z) is unchanged.

## WO-199-D013 — Final review: fail on a terminal signal recorded as the writer's test result; criterion 2's exit clause unmet

```json
{
  "id": "WO-199-D013",
  "date": "2026-10-08",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 on F1 and judge criterion 2 unmet; criteria 1, 3, 4 and 5 are met at code identity e86d7a74c5ea939a4c937b4614f16334d841fc6caf862bc4187ee3087abedfc6, the identity VER-002 passed. F1 (blocking, class escape): dotln vertical's listeners keep the host alive through a terminal-wide signal, while the source host's whole post-result admission is synchronous (checkIntegrity, tree.verify, tree.effect, and observe with the focused test for up to 180 s, then the receipt save). A terminal Ctrl-C reaches every process in the foreground job, so it kills the focused test while the host's JavaScript listener cannot yet run. runFocusedTest returns that kill as a result ({exitCode: null, signal: 'SIGINT'}) instead of throwing. observe then records SourceChangeObserved with it as testAfter, saves the receipt and closes the command, and VerticalHost keeps the completed step's receipt (D010: a step that returned despite the signal keeps its receipt). The writer's after-test result is therefore the operator's signal, durably. In the order's own CLI fixture, the later steps then ran without the event loop polling, so Node delivered the signal only after runVerticalIssue returned and the CLI had removed its listeners: the command exited 0 and the issue resolved past the operator's signal. With HEAD's signal disposition (only the new listeners dropped) the same subject dies by SIGINT within 3 ms, leaves source-change pending, records no observation, and its rerun re-runs the test, which passes. The skeleton README's sentence 'The step stays pending, including a step whose synchronous child the terminal's signal killed' is false for this step. Route: blocking twice over. Criterion 2 requires a signal to a running dotln vertical to exit non-zero, and the probe signals it during the writer's own step and observes exit 0. The change also breaks behavior main had: Ctrl-C stopped the command at once and never recorded a result it caused. Class escape: the defect is present at the identity VER-002 judged, inside the instructed scope of criterion 2 and D009's repair rule that a signal ends the run 'in every step'.",
  "evidence": [
    "Committed reproduction: docs/evidence/WO-199/final-001-post-result-signal-probe.mjs with final-001-slow-test-preload.mjs, each run alone under node scripts/harness.mjs bounded at this identity. The probe runs five steps in process, then starts the real CLI (built dotln.js) with the order's CLI actor doubles in its own process group. The preload delays only the post-result focused test, and the probe sends SIGINT to the whole group 500 ms into it, as a terminal Ctrl-C reaches a foreground job. The detached writer group is not signalled. Rows are in final-001-observations.json, with local paths redacted.",
    "subject, 2026-10-08T16:41:29.929Z-16:41:40.514Z, exit 0: the CLI exited 0 3193 ms after the signal. The run state is terminal resolved with nothing pending. The source store holds SourceChangeObserved with testAfter {command 'node fixture-test.mjs', exitCode null, signal 'SIGINT'}, and the source-change receipt is completed with that testAfter. The rerun exited 0 with the same receipt.",
    "head (PROBE_DROP_SIGNAL_LISTENERS=1, as VER-001's probe), 16:41:40.601Z-16:41:54.280Z, exit 0: the CLI died by SIGINT 3 ms after the signal. source-change is pending, with no SourceChangeObserved and no receipt. The rerun exited 0, resolved, and recorded testAfter exitCode 0 with signal null.",
    "subject-diag (PROBE_SIGNAL_DIAG=1), 16:41:54.381Z-16:42:05.072Z, exit 0: the diagnostic listener logged 'handled SIGINT; dotln listeners present 0' and then 'exit code=0 exitCode=undefined'. The signal was delivered only after dotln.ts's finally removed its listeners, so stop() never set the exit code or aborted the run. Exploratory scratch runs at 16:28:24Z, 16:32:25Z and 16:37:29Z gave the same three outcomes.",
    "Source, publication: target-publish.mjs:1117-1118 passes episode.observation.testBefore and testAfter to the generated target PR body. github-body.mjs:757 prints 'Focused test observed by the host: <before> before the change, <after> after it', and github-body.mjs:226-228 renders a signal as signal `SIGINT`. Readiness requires only that the field be present (github-body.mjs:618-619). Not probed.",
    "Reach by source, not probed: a focused-test runner that traps the signal and exits non-zero records a false failure, indistinguishable from a real one. A git command killed in checkIntegrity's sharedState read records SourceChangeIntegrityChecked 'unreadable', which the host never clears ('Once an attempt failed, later restoration cannot erase the finding'), and refuse('shared-repository-unreadable') closes the command, so the rerun seals refused. A git command killed in tree.verify or tree.effect throws inside the admission and records SourceChangeRefused host-admission-<check>, an interruption recorded as a host refusal that the rerun replays as refused. A snapshot witness test killed by the signal (verification-worktree.ts witnessTest, spawnSync up to 30 s, same process group) records 'unavailable' evidence, or 'fail' under a trapping runner, in a completed witnesses receipt.",
    "Inference about production: with real model judgments, the next asynchronous episode would let the event loop deliver the signal, so the CLI would stop there with a non-zero exit. The recorded testAfter, and any killed witness evidence, would remain and reach the PR body. A signal during the final synchronous stretch of a run is lost as in the fixture.",
    "Other final-review checks at this identity: the agreed WO-112 recovery probe under bounded, 16:43:41Z-16:43:47Z, exit 0 (crash-vertical group 45468 observed; crash-direct group 46701 observed; revoke-vertical records the stop and WorkerInterrupted). npm run evidence:feedback -- --check exit 0 (feedback 002 judged the current source). publication:check, harness check and release check-surfaces --local exit 0."
  ],
  "goalAlignment": {
    "traps": "Correctness over sycophancy: two verifications and the executor's review passed this path, so judge it from probes, not from their prose. Anti-oscillation: keep F1 to the signal-during-synchronous-child class; D061, WO-123 D044's return-kill item and resident scheduling stay outside. Naive intervention: a reviewer patch to the judged source host would need a new live episode and an independent verification, so return the order to repair instead of fixing it here.",
    "noOp": "Passing ships v0.69.2 with a vertical that, under the commonest operator stop (Ctrl-C), can record and publish its own interruption as the writer's test outcome, or seal the issue refused; WO-118's kill-and-restart would inherit it."
  },
  "rejected": [
    { "option": "Judge criterion 2 met under D009's live-writer boundary", "reason": "D009 bounded the WorkerInterrupted record, which needs a live writer. The exit clause is unconditional, and the probe signals the running command during the writer's own source-change step and observes exit 0." },
    { "option": "Route F1 as a follow-up", "reason": "It breaks behavior main had, shown by a probe against HEAD's disposition, and leaves a criterion unmet; product 07 routes both as blocking." },
    { "option": "Repair F1 in this final review through Adjacent Repair", "reason": "The fix changes the source host's post-result admission (interruption against observation and refusal, and the rerun's dispatch budget), the witness evidence path and the CLI's signal delivery. It needs new regressions, a live feedback episode after the judged-source edit and independent verification, beyond a reviewer's bound." },
    { "option": "Board only the README sentence", "reason": "The sentence is a symptom; the durable record and the exit code are the defect." }
  ],
  "followup": "WO-199 resume: fix. (F1) After SIGINT, SIGTERM or SIGHUP, no durable record, receipt or step result may carry a child outcome that the signal itself produced, and dotln vertical never completes past the signal with exit 0. (1) In the source host's post-result admission, a synchronous child killed by the run's signal, or one that returns while that signal is pending, yields the run's typed interruption. Never SourceChangeObserved with the killed result, never SourceChangeRefused host-admission-<check>, never a permanent integrity 'unreadable' finding. The source-change step stays pending, and the rerun re-observes the writer's committed result (it re-runs the focused test) rather than seal or silently spend a dispatch; record the chosen budget rule. (2) The same holds for the snapshot witness tests of the witnesses and baseline steps. (3) The CLI lets a pending signal be delivered before it removes its listeners, and VerticalHost lets it be handled before it records a step result and before the next step, so a signal is never lost to a run that does not yield. (4) Correct the skeleton README sentence about synchronous children. Regressions: the committed probe's case (a group-wide SIGINT during the post-result focused test exits 130 within the bound, source-change stays pending, no SourceChangeObserved or SourceChangeRefused is recorded, and the rerun records testAfter exit 0 and resolves), the same for SIGTERM and SIGHUP, and a group-wide signal during a witness test. Keep the live-writer path, criteria 1 and 3 and D010's other rules. The live feedback episode reruns after the last judged-source edit. Check: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair changes the source host's post-result admission, the witness tests' signal handling, the CLI's listener removal or VerticalHost's step loop; or final-001-post-result-signal-probe.mjs (subject variant) shows a non-zero exit within the bound with source-change pending and a rerun recording a passing testAfter."
}
```

The committed probe at this identity (full rows in `final-001-observations.json`):

| Variant | After a group-wide SIGINT during the post-result focused test | Run state | source-change `testAfter` | Rerun |
| --- | --- | --- | --- | --- |
| subject | exit 0, 3193 ms | resolved | `signal: SIGINT` (receipt completed) | exit 0, same receipt |
| HEAD disposition | killed by SIGINT, 3 ms | source-change pending | none recorded | exit 0, `exitCode: 0`, resolved |
| subject with diagnostics | exit 0, 3249 ms; signal handled with 0 dotln listeners present | resolved | `signal: SIGINT` | exit 0, same receipt |

## WO-199-D014 — Repair FINAL-001 F1: pending terminal signals take precedence over host observations and admission failures

```json
{
  "id": "WO-199-D014",
  "date": "2026-10-08",
  "dispatch": "resume: fix; FINAL-001 F1",
  "decision": "Deliver a pending terminal signal at the boundaries of synchronous host calls, before either their returned data or their thrown error can become durable. The source host guards its focused tests, Git admission reads and shared-state comparisons; a run interruption takes precedence over host-admission refusals and the permanent unreadable integrity finding. The stopped writer retains its termination record and the host records WorkerInterrupted with the signal, leaving source-change pending with no observation or receipt. An interrupted host observation of an existing committed result reruns the focused test and shared-state checks without launching a writer or spending a dispatch. The two-dispatch budget still applies to actual writer launches. Snapshot preparation keeps its synchronous public API for existing callers; the vertical and repair host use an asynchronous guarded variant with a signal-delivery boundary after each witness test. Unpublished interrupted preparations remain inspectable, and the vertical chooses a fresh directory on rerun. The vertical delivers pending signals on successful as well as failed step returns, before recording the step and before starting the next; an already accepted clean effect retains its receipt under D010. The CLI checks pending signal delivery before removing its listeners, so even a final return cannot lose the signal's nonzero exit code. The README names these behaviors and the existing synchronous-child timeouts.",
  "evidence": [
    "FINAL-001 F1 and D013 name the admitted class and repair rule; the original probe, preload and report bytes are unchanged.",
    "Bounded signal-boundary-comparison.mjs, 2026-10-08T18:05:00.517Z-18:05:01.911Z, exit 0: both two setImmediate turns and up to five 10 ms timers delivered SIGINT, SIGTERM and SIGHUP after a real synchronous child died. The no-signal arm cost 0.083 ms for two immediates and 54.194 ms for five timers; signal arms cost 0.069-0.108 ms and 10.134-11.201 ms respectively. Chosen axis: signal delivery without a timed wait at every host-call boundary. This is a bounded macOS observation, not an effective-runtime guarantee on untested platforms.",
    "The unchanged final-review probe at the repaired source first exited 130 with source-change pending and no observation, but its rerun refused. The async conversion had returned observe() without awaiting it inside the store's try/finally, releasing the lock before observation completed. Corrected return await keeps the lock through recovery admission. The diagnostic probe at 18:09:25.681Z-18:09:39.182Z exits 129 11 ms after SIGHUP, with WorkerInterrupted(SIGHUP), source-change pending and no receipt; the rerun exits 0, resolves and records testAfter exitCode 0 with signal null.",
    "Regression inputs: scripts/fixtures/vertical/host-call-preload.mjs and scripts/test-vertical.recovery.mjs exercise real group-wide signals during focused tests, a trapping runner, admission Git reads, baseline and candidate witness tests, and a signal queued at the final CLI return. The three targeted tests (eleven scenario branches) passed at 18:12:11.257Z-18:14:21.332Z; the 48 source, integrity, snapshot and repair-host tests passed at 18:16:28.320Z-18:18:06.494Z. Executed results are in repair-002-validation.json and repair-002-probe-results.json.",
    "The first repair review gate reported failures in cached resolution and production/resident triage restart cases: resolution received a Promise instead of a prepared snapshot ('Cannot read properties of undefined (reading files)'), and snapshot preparation encountered ENOENT after its detached checkout had already been removed. The asynchronous snapshot conversion missed this caller. Canonical evidence --stop stopped run d211915d-a430-4452-9cf2-72c4f1f28630 at 18:46:01.620Z, retaining diagnostics and recording no passing check. Resolution now awaits preparation before filing prepared.json, triage and repair await that input, and detached checkout cleanup waits for an asynchronous callback to settle while preserving synchronous callers. The existing checkout regression also checks asynchronous success and rejection cleanup; eleven targeted resolution regressions pass after it. A fresh live feedback episode completes at 18:52:31.049Z-18:53:48.335Z; feedback 004 and authority/artifact-identity/verification 003 check current. The corrected document gate passes 29 checks and the review gate passes 38 suite groups (88 fresh tasks), zero failures, at code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c; the vertical task takes 725.851 s. Canonical rows are retained in repair-002-validation.json."
  ],
  "goalAlignment": {
    "traps": "Do not turn an operator signal into a permanent integrity refusal, erase accepted receipts, signal an unowned group, or spend another writer dispatch merely to observe a committed result. Preserve the existing termination, birth identity, authority and shared-state checks; retain incomplete snapshot files and repeat only unadmitted observations. Keep D061 and the browser-scenario board D011 outside this repair.",
    "noOp": "FINAL-001's reproduced terminal interrupt remains a writer testAfter and can resolve the issue with exit 0 or seal a genuine interruption as refused."
  },
  "rejected": [
    { "option": "Convert all public Git and test APIs to asynchronous child processes", "reason": "The existing synchronous APIs have callers beyond the vertical. Guarded observation boundaries and a shared snapshot preparation core close the named class without changing those callers." },
    { "option": "Keep five 10 ms timer turns at every new boundary", "reason": "Both comparison arms delivered every tested pending signal, but the timer arm added a measured 54 ms to an ordinary call; two immediate turns include the poll phase without that delay." },
    { "option": "Detach focused and witness tests from the terminal group", "reason": "A detached test could outlive a dead host, and direct signals to the host would still need delivery before admission." },
    { "option": "Treat a signalled test as unavailable evidence or a host refusal", "reason": "That is the durable-contamination class FINAL-001 rejects, and it either carries the operator's stop into the receipt or seals the pending issue." },
    { "option": "Redispatch a writer after an interrupted post-result test", "reason": "The writer's committed effect and pre-dispatch test already exist; host re-observation needs no writer and must not consume the remaining dispatch." },
    { "option": "Delete an interrupted snapshot directory", "reason": "Preserve work and diagnostics; an unpublished attempt is retained and a fresh copy is tested on rerun." }
  ],
  "reopenWhen": "A real terminal-wide SIGINT, SIGTERM or SIGHUP becomes a focused or snapshot witness result, an admission refusal or unreadable finding; an interrupted host re-observation launches another writer; a retained incomplete snapshot makes its rerun refuse; or a signal queued at the final CLI return is lost."
}
```

## WO-199-D015 — Verification: pass VER-003; board the recovery path's untyped host refusal, which a refusal coinciding with a signal now reaches

```json
{
  "id": "WO-199-D015",
  "date": "2026-10-08",
  "dispatch": "resume: verify; VER-003",
  "kind": "finding",
  "decision": "Pass VER-003: criteria 1 to 5 are met at code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c, and FINAL-001 F1 is repaired in its unchanged probe and in three variations the executor's regressions held constant. Board F1 (follow-up). When a genuine post-result host refusal coincides with the run's signal, D014's precedence records WorkerInterrupted with the signal and no refusal, as D013 requires. The rerun then reaches SourceChangeHost.run's recovery observation (the effect() and observe(before) calls after the unreceipted-attempt branch). That path has no admission catch, so the same dirty committed tree throws a plain Error and records no SourceChangeRefused. VerticalHost then records the step refused as 'source-change host failed or was unavailable'. The same condition without a signal records SourceChangeRefused host-admission-effect and replays it on rerun. Route: follow-up. Criterion 3's observed gap and design name the dispatch try's post-result admission (lines 789 to 818 at bd437eb2), which types every refusal at this identity. The recovery observation path is unchanged from main, where a signal killed the host and the rerun reached the same untyped throw. No criterion and no behavior main had is broken.",
  "evidence": [
    "docs/evidence/WO-199/verification-003-coincident-refusal-probe.mjs under harness bounded, 2026-10-08T20:04:23.620Z-20:04:25.837Z, exit 0, rows in verification-003-observations.json (coincidentRefusal). Coincident signal: the first run throws interrupted SIGINT and records SourceChangeProcessStopped, WorkerResultObserved and WorkerInterrupted(interrupted, SIGINT). The rerun without a signal throws 'source-change committed tree is dirty; preserve for inspection' and records only SourceChangeIntegrityChecked. No-signal control: the first run records SourceChangeRefused host-admission-effect, and the rerun returns refused host-admission-effect.",
    "Source: packages/skeleton/src/source-change-host.ts run() calls interruptibleHostCall(() => this.tree.effect()) and then return await this.observe(before) with no catch between them and the outer finally. git show main:packages/skeleton/src/source-change-host.ts lines 645-670 hold the same unguarded recovery observation. VerticalHost.run (vertical-host.ts) records a non-signal step failure as refused with reason '<step> host failed or was unavailable'.",
    "Not probed: the same untyped rerun refusal follows a host crash (SIGKILL) after a writer returned a dirty tree, which is the pre-existing recovery path this coincidence now reaches."
  ],
  "rejected": [
    { "option": "Judge criterion 3 unmet", "reason": "The criterion's observed gap and design scope it to the post-result admission inside the dispatch try. At this identity that admission records host-admission-<check> for every genuine refusal, and no path records WorkerInterrupted transport-failed. The recovery observation is a separate, unchanged path." },
    { "option": "Let a genuine refusal take precedence over a coinciding signal", "reason": "The host cannot tell a genuine refusal from a failure the signal caused in a killed child. D013 requires the interruption to win, and the rerun re-derives the genuine condition." }
  ],
  "followup": "Type the source host's recovery observation the way the dispatch admission is typed. When run() re-observes an unreceipted committed result (the effect() and observe(before) calls after recoverTermination), a host check that refuses the result records SourceChangeRefused host-admission-<check> and closes the command refused. A run interruption still takes precedence and records nothing. Regression: the coincident-refusal probe's case, where a rerun after an interrupted dirty-tree admission returns refused host-admission-effect, and the same rerun after a SIGKILL crash.",
  "reopenWhen": "A rerun or resident restart after an interrupted or crashed source-change step is sealed with an untyped 'source-change host failed or was unavailable' refusal, or a repair changes SourceChangeHost.run's recovery observation."
}
```

## WO-199-D016

<!-- integration refs/dotln/checkpoint/WO-199/17 -->

```json
{
  "id": "WO-199-D016",
  "date": "2026-10-08",
  "dispatch": "resume: final review; worktree integrate WO-199",
  "decision": "Integration mechanics are complete in the FINAL-002 worktree. Fetched main equals the base, 0eb0afa2, so the merge moved nothing, no authored conflict arose and no component version collides: v0.69.2 and skeleton 0.55.1 remain this order's targets, and origin holds tags only through v0.69.1. The named stash re-applied this order's uncommitted work, and the regeneration changed only documents and ignored build output. Dispatch checkpoint 16 and integration checkpoint 17 differ only in docs/control/current.md, the control log and the work-order index. The code identity stays 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c, which VER-003 judged and the executor's review row covers. VER-003's evidence therefore carries forward into FINAL-002.",
  "evidence": [
    "refs/dotln/checkpoint/WO-199/17",
    "base 0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958",
    "upstream 0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958",
    "release preparation: WO-199 target v0.69.2 remains current. Files changed: docs/evidence/WO-199/meta.json, docs/final-reviews/WO-199/PR.md. Meter snapshot: docs/evidence/WO-199/meta.json, 4583 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-08. Original base: `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`.
Fetched main: `0eb0afa2ecdd3c6ba5b0fd437bb5bce1fd5f4958`. Checkpoint: `refs/dotln/checkpoint/WO-199/17`.
Named stash retained: `6768e8493cbd76cd617c23c75fa0b7f9bdee1af8` (WO-199 integrate 2026-10-08).
Resolved projections: none.
Release preparation: WO-199 target v0.69.2 remains current. Files changed: docs/evidence/WO-199/meta.json, docs/final-reviews/WO-199/PR.md. Meter snapshot: docs/evidence/WO-199/meta.json, 4583 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final reviewer. Main did not move, so integration introduced no upstream path. `git diff --stat refs/dotln/checkpoint/WO-199/16 refs/dotln/checkpoint/WO-199/17` lists only docs/control/current.md, docs/control/orders/WO-199.jsonl and docs/work-orders/README.md. gateCodeIdentity returns 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c after integration, the identity VER-003 judged. The stash re-application refreshed source modification times without changing content. The feedback check judges content, and it reports feedback 004 current. VER-003's criterion evidence carries forward, and FINAL-002 re-ran the probes its verdict rests on at this identity.
Authored conflicts observed: none.
Affected checks, run by the final reviewer on 2026-10-08 at the integrated subject: `npm run publication:check` exit 0; `node scripts/harness.mjs check` exit 0; `npm run release -- check-surfaces --local` exit 0 (20:27:34Z–20:27:36Z). `npm run evidence:feedback -- --check` and the authority, artifact-identity and verification `--check` runs each exit 0 (20:27:43Z–20:27:47Z). `npm test -- --review` is recorded in FINAL-002 §Executed checks.

## WO-199-D017 — Final review: pass FINAL-002; correct the skeleton README's typed-refusal sentence, which D015's recovery path contradicts

```json
{
  "id": "WO-199-D017",
  "date": "2026-10-08",
  "dispatch": "resume: final review; FINAL-002",
  "kind": "finding",
  "decision": "Pass FINAL-002. All five original criteria are met at code identity 2b3fffa9613834721835b5532d96b0d561d4f1adb0e9678aaa945f39d2fba97c, the identity VER-003 passed, and FINAL-001 F1 stays repaired at the integrated subject. One finding, F1 (follow-up, class escape), is repaired here through Adjacent Repair. The skeleton README said, without qualification, that host checks refusing a returned result record SourceChangeRefused with host-admission-<check>. D015 showed that a rerun's re-observation of an unreceipted committed result throws a plain Error instead and records no SourceChangeRefused. The sentence now limits the typed refusal to the run that receives the result and names the rerun exception with D015. In both runs VerticalHost records a thrown source-host failure as the step reason 'source-change host failed or was unavailable', so the typed check lives only in the source store's SourceChangeRefused. That is unchanged from main and outside criterion 3's design. The correction is documentation only and outside the code identity. D015's FUP-49c4a5f7176252e7 keeps the code repair. Judged boundary, not a finding: two interrupted live-writer dispatches exhaust the step's two-dispatch budget, so the third run refuses recovery-dispatch-exhausted. The README documents this cap and the direct transport shares it. VER-002 recorded it, the VER-001 repair's refuter judged it to be the documented recovery contract, and D014 kept it. Criterion 2's design targets the seal caused by missing termination evidence or a live prior group, and each rerun here resumes from the recorded termination.",
  "evidence": [
    "docs/evidence/WO-199/verification-003-coincident-refusal-probe.mjs under harness bounded at this identity, 2026-10-08T20:29:13.791Z-20:29:15.770Z, exit 0. Coincident signal: the first run throws interrupted SIGINT and records WorkerInterrupted(interrupted, SIGINT). The rerun throws 'source-change committed tree is dirty; preserve for inspection' and records only SourceChangeIntegrityChecked. No-signal control: SourceChangeRefused host-admission-effect, then a rerun that returns refused host-admission-effect.",
    "packages/skeleton/src/vertical-host.ts:227 records a thrown step failure's reason as '<step> host failed or was unavailable'; scripts/lib/vertical-primitives.mjs:563-569 carries the typed refusal into the step only when the source host returns refused.",
    "git check-attr marks packages/skeleton/README.md dotln-documentation, which gateCodeIdentity excludes (packages/skeleton/src/gate-evidence.mjs).",
    "Budget boundary: source-change-host.ts run() refuses recovery-dispatch-exhausted when attempts reach two; VER-002 §Known issues; reviews.md (the VER-001 repair's refuted item); D014 ('The two-dispatch budget still applies to actual writer launches')."
  ],
  "goalAlignment": {
    "traps": "Correctness over sycophancy: three passing judgments preceded this review and FINAL-001 found an escape after two, so the criteria were re-derived from probes at the integrated subject. Anti-oscillation: keep D015's code repair boarded and correct only the sentence that contradicts it. Naive intervention: a reviewer edit to the judged source host would need a new live episode and an independent verification.",
    "noOp": "Shipping the sentence as written tells an operator that every refused post-result check names its check, while a rerun after an interrupt or crash records no typed refusal, as D015 reproduced."
  },
  "rejected": [
    { "option": "Type the recovery observation in this review", "reason": "It edits the judged source host, which needs a live feedback episode and independent verification. D015 boards it with a repair rule and a regression." },
    { "option": "Leave the README sentence and rely on D015", "reason": "A reader of the README does not read D015. The write-back must hold for every path it describes." },
    { "option": "Judge criterion 2 unmet for a second interruption of a live writer", "reason": "The cap is the pre-existing bounded dispatch rule that the direct transport shares and the README states, and three earlier judgments kept it. The criterion's design targets the seal caused by missing termination evidence." }
  ],
  "reopenWhen": "The README's recovery paragraph and the source host disagree again, or a repair types the recovery observation (FUP-49c4a5f7176252e7) and the exception sentence must be removed."
}
```
