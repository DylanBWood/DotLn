# WO-185 decisions

## WO-185-D027 — current repair outcomes and handoff

```json
{
  "id": "WO-185-D027",
  "date": "2026-10-03",
  "dispatch": "resume: fix; FINAL-001; handoff after adjacent-0006 and adjacent-0007",
  "decision": "Retain all three main repairs and the twelve D021 dispositions. Keep D026 intervals and the first repair full-review budget basis: the second full review confirms margins above four and sampling work below two percent. Record all eight criteria met in the handoff, finish output/usage observations and record repair-complete; independent re-verification and final review remain separate.",
  "evidence": [
    "repair-final001-host-fixtures-final.txt: current source passes 34/34 in 64.408 seconds; bounded wrapper duration 64.456 seconds and peak 1059239648 bytes. The fresh review also passes runner-fixtures (66.59 seconds).",
    "repair-final001-review-rerun.txt and repair-final001-gate-measurements.json: 40/40 suites, 85 fresh tasks, 823.041 seconds, recorded 2026-10-03T19:46:16.187Z, current code identity 85cce5d52bf2d7309145878f6574ee3896c54eba582ffe864c69a2bba47be1cc; selection equals --review --list and all 85 task peaks are recorded.",
    "Task/gate/host sampled peaks 1076933024/1424571400/at most 1721155256 bytes. Budget margins 11.96/18.09/at least 19.96. Runner sampling work 7630.093 ms, 0.927061 percent; shared guard delta 9104.796 ms, 1.106238 percent across 19:32:31.824Z–19:47:56.606Z, with no new shared-guard incident. This daemon retains older source; the window is conservative and not a causal slowdown estimate.",
    "repair-final001-corpus.txt: unmodified kernel passes 24/24. repair-final001-corpus-drift-measurements.json at the final identity: each file detects the full-grid RNG drift in 2.663–4.207 seconds at 235156808–268847736 bytes under 805306368, with total 126792, kept 32 and the unchanged bounded digest. The final 34/34 fixture run also generates a two-finding nonfinite quarantine and passes all three files at that same copied kernel.",
    "repair-final001-docs.txt: npm run test:docs passes 24/24 in 39.111 seconds, row 2026-10-03T19:49:13.281Z at the current source identity. repair-final001-publication.txt passes; harness check passes 32 generated surfaces; git diff --check HEAD is clean.",
    "Adjacent queue revision 32: adjacent-0006 and adjacent-0007 completed, no queued/running item. The original failed 32/34 fixture run, both passing full reviews, all immutable independent reports and recovery references are preserved.",
    "Process-cost readback: 10332352 total tokens including 9835136 cached input tokens; codex-transcript-counter, dispatch scope, cutoff 2026-10-03T19:48:34.842Z. Dollar cost unavailable. Two equivalent 40/40, 85-task review outcomes cost 1813.320 seconds combined gate wall; the different windows do not establish a causal speedup. No subagent or additional economy experiment was started."
  ],
  "alternatives": [
    "Keep the measured first review as basis and carry the current recheck with its qualifications",
    "Replace the original measurement or infer a causal speedup",
    "Record completion without current gate coverage"
  ],
  "rejected": [
    {
      "option": "Replace the original measurement or infer a causal speedup",
      "reason": "Preserve the observed two-percent trigger and both comparable outcomes. The measured sampler work is useful, but different review windows do not isolate its causal effect."
    },
    {
      "option": "Record completion without current gate coverage",
      "reason": "The repair now has a fresh passing review covering the exact selection, a passing document row and the criterion-specific fixtures; retain those bindings."
    }
  ],
  "goalAlignment": "D023 and D026’s eight-trap comparisons stand at handoff. Policy resistance: one shared timing/budget interface. Commons: reduced recorded runner work with one writer. Drift: full failure-path, quarantine and ownership fixtures pass. Escalation: no dependency, service installation or tool refusal added. Success to the successful: the first passing review still triggered the required correction. Shifting the burden: ledger failures no longer require operator rescue. Rule beating: both measured gates remain with their identities and source limits. Seeking the wrong goal: judge stopped processes and reproducible commands, not receipt volume. Naive Interventionism: keep the existing supervision, early censuses and byte budgets; state the added interval-based growth. NoOp would have retained the three reproduced defects and the measured timing trigger.",
  "followupReadback": {
    "source": "npm run plan -- followups --touching, all three pages at register revision e8d86819df6e41118264df1634583ddacd89f09d66f87c6c5fb54f9885c51b6c; textual matches are pointers, not findings",
    "matched": 24,
    "fixedWithinThisRepair": [
      "FUP-84cf4b296783d303 (D018)",
      "FUP-8934512b05a3c570 (D019)",
      "FUP-81ad883bf1d8c9cc (D020)",
      "FUP-973bf7b53a14f177 (D021)"
    ],
    "leftWithExistingRoute": [
      "FUP-f1c7a256bec46737",
      "FUP-069dff5d52d98e0d",
      "FUP-312a88f5e185c3b1",
      "FUP-33173b7f87004a9c",
      "FUP-4b70089b028849f0",
      "FUP-51c310284c2fea17",
      "FUP-895692b9939c8181",
      "FUP-a6cf30a8b7bc4a83",
      "FUP-acfe4bfda716d8fb",
      "FUP-adf6621e7f958dd8",
      "FUP-b3454d6ce3594ef3",
      "FUP-d093f77bd927f9dc",
      "FUP-d0a9719cc2e4ec55",
      "FUP-e821aa2ced3aa111",
      "FUP-ec72b2ea596bdc75",
      "FUP-fb8cbeabbddef397",
      "FUP-fd05316b6030ef73",
      "FUP-a5c6ac8cb40bd52a",
      "FUP-bf96425734635b32",
      "FUP-c1a89d52cc314af9"
    ],
    "reason": "These remaining pointers cover other planning surfaces, the prior repaired VER-001 route, no-mark ownership, live-guard upgrade and worktree CLI ordering. This repair records the four FINAL-001 rows as fixed and introduces no separate remainder from D021; independent final review disposes reopened seams. It does not infer that every matched trigger is unfired or broaden this repair into those other mechanisms."
  },
  "reopenWhen": "Independent verification contradicts a rule or criterion, another host/window breaks the margin or two-percent trigger, or attributable growth exceeds the stated interval tradeoff. No-mark ownership, live-guard upgrades and unexercised Linux/Xcode-only paths keep the recorded qualifications."
}
```

## WO-185-D026 — sampling interval correction after the full repair gate

```json
{
  "id": "WO-185-D026",
  "date": "2026-10-03",
  "dispatch": "resume: fix; FINAL-001; adjacent-0007 revision 1",
  "decision": "Raise the configured and fallback signal/steady-footprint intervals from 500/2000 to 1000/4000 ms, as criterion 2 requires after the runner sampling cost crossed two percent. Refresh the budget basis from this repair full review and recheck at the changed identity. Preserve the first passing gate and its above-threshold measurement; retain startup/launch/finish censuses, pressure/swap escalation, all byte budgets and D002 as the sole economy assessment.",
  "evidence": [
    "repair-final001-review.txt: fresh npm test -- --review passed 40/40 suites and 85 tasks in 990.279 seconds, recorded 2026-10-03T19:17:49.624Z at bf5bdd3dbafb90b1b9dd25b4de74f82d34ab5d2e440d7d528d1ee70047e0eab0.",
    "repair-final001-gate-initial-measurements.json: runner sampling work 25527.415 ms / gate wall = 2.5778 percent; shared guard delta 10890.822 ms = 1.0998 percent across the conservative 19:01:17.900Z–19:18:45.499Z snapshot window. Accumulated sampler work is not a causal slowdown estimate. The shared daemon predates this repair; disposable guards exercise current source.",
    "All 85 task peaks are recorded. Task/gate/host peaks are 1100039120/1787537328/at most 1721155256 bytes, with the 12/24/32 GiB budgets 11.71/14.42/at least 19.96 times those sampled figures. The host value is the shared daemon lifetime maximum.",
    "At the recorded approximate 3.4 GiB/s growth rate, nominal growth during a 4-second steady-footprint interval is 13.6 GiB (6.8 more than before); during a 1-second pressure/swap tick it is 3.4 GiB (1.7 more). Census, scheduling and signal latency add to this estimate, so it is not a hard overshoot guarantee. The early launch census and low-budget fixture intervals remain intact.",
    "repair-final001-docs-initial.txt: npm run test:docs passed 24/24 in 39.43 seconds. This completes adjacent-0006 before the new interval item starts."
  ],
  "alternatives": [
    "Double both configured/default intervals and measure the next full review",
    "Raise only steady-footprint sampling",
    "Suppress recorded sampler work or reduce early ownership observations",
    "NoOp"
  ],
  "rejected": [
    {
      "option": "Raise only steady-footprint sampling",
      "reason": "Startup and pressure paths also take full censuses on signal ticks, so it may leave the measured trigger unresolved."
    },
    {
      "option": "Suppress recorded sampler work or reduce early ownership observations",
      "reason": "Changing the accounting or weakening launch/finish ownership observations would evade the acceptance claim."
    },
    {
      "option": "NoOp",
      "reason": "The first repair row crosses criterion 2’s explicit two-percent trigger. Record and act on the checked figure."
    }
  ],
  "goalAlignment": "The shared-host prerequisite stays on the source-to-deliverable critical path. Policy resistance: keep one interval/budget interface across entry points. Commons: reduce recurring census work while retaining one writer and one fresh rerun. Drift to low performance: preserve all failure and ownership fixtures. Escalation: add no command refusal, dependency or account setting. Success to the successful: a passing suite count cannot override a measured cost trigger. Shifting the burden: retain automatic stops and write-failure handling. Rule beating: preserve the first measurement and judge the changed identity. Seeking the wrong goal: reduce actual sampling work rather than its reported counter. Naive Interventionism: limit the correction to supported timing knobs and state the added detection-window growth. NoOp keeps an explicit criterion unsatisfied; changing unrelated supervision would add risk without evidence.",
  "reopenWhen": "The changed-identity gate still records sampler work above two percent, a fixture contradicts the stop/ownership rule, or measured detection latency/growth invalidates the stated interval tradeoff. A current-code shared-daemon benchmark remains subject to the existing live-guard upgrade follow-up."
}
```

## WO-185-D025 — D021 dispositions within the recorded repair

```json
{
  "id": "WO-185-D025",
  "date": "2026-10-03",
  "dispatch": "resume: fix; FINAL-001; adjacent-0006 revision 1",
  "decision": "Fix all twelve D021 items in the existing surfaces. Preserve audit attempts instead of deleting duplicate evidence, keep suite execution policy distinct from the bounded probe's fidelity contract, and use disposable CLI infrastructure without adding a production root override. All focused fixtures passed before the final gate; final assertions remain subject to that gate and independent verification.",
  "evidence": [
    "repair-final001-host-fixtures-rerun.txt: 34/34 pass in 66.14 seconds on Darwin 27.0.0 arm64, 51539607552 physical bytes; bounded task peak 1089714248 bytes. No allocation ceiling or configured production budget was raised.",
    "1: runner-fixtures now declares scripts/fixtures/detached-descendant.c; the selection fixture verifies the declaration consumed by changedMachinery.",
    "2: worktree/clone lane fixtures use the runner's reservation formula. Each pair also runs with the OS CPU readback replaced by 4 and 2 CPUs in its own child process. They reserve the unused capacity explicitly, observe peak reservations of 4, 2 and 1 respectively, print named waits and pass without exceeding the shared four.",
    "3: the guard retains the registered/group PID for cleanup and incident lookup, names the largest member via process/processPid, and retains killedProcesses in the checkout ledger. A bare shell sharing a group with memory-growth stops with the allocator named and both members targeted.",
    "4: observeSwapGrowth is shared by guard and runner. A completed footprint census resets its swap baseline, as does reclaimed swap; unavailable swap never becomes a baseline. The deterministic fixture checks twenty steady ticks and a subsequent growth window. Continuous pressure still escalates as before.",
    "5: guard and runner attach the root PID/birth stopId, including the registration's birth after a root exits. plan failures deduplicates that identity; the fixture preserves two ledger attempts, including an empty later kill list, and counts one stop. Historical rows without stopId retain their row count.",
    "6: killOwned continues after each non-ESRCH signal error; the guard records killErrors alongside its budget incident and retries denied members rather than marking them killed. Simulated EPERM denies one group and member while the next target still receives both signals; the incident fixture preserves the denial. No host permission was changed to induce a real EPERM.",
    "7: killOwned revalidates ownership against the current table, uses the current pgid and also signals each validated PID after group signals. The deterministic fixture changes a member's group, includes a reused PID, and verifies the late-escape PID signal; existing real detached-descendant fixtures also pass. A kernel-atomic PID handle remains outside this sampled mechanism.",
    "8: stdout diagnostic recognition accepts indented TAP not-ok lines. A nested failure's name and message survive 48000 later stdout bytes with a bounded retained diagnostic buffer.",
    "9: runGate passes its entry-validated parent lease to scheduling and base comparisons; scheduleSuites resolves any inherited token once. The nested fixture invalidates the later lookup token after entry and both tasks still suballocate the parent reservation. A genuinely expired parent still fails acquisition.",
    "10: each final stop check preserves an already-observed operator signal even if resourceGateFailure arrives later. SIGINT, SIGTERM and SIGHUP during aggregation followed by a planted memory incident each leave no row.",
    "11: runner gate-scope incidents now carry process and stopId fields. The task/gate membership-publication fixture asserts the gate process name while exercising the stop despite a failed registration/lease publication.",
    "12: the escaped and hanging Node fixtures self-expire independently and capture PID births for teardown; lane runner children are also registered for teardown. Native fixture output now states its effective min(one-eighth RAM, 240 MiB) allocation ceiling, and stop assertions compare with that same bound. Real CLI invocations replace only their process's OS temporary-root observation, start their private guard outside the wrapped command and clean it up. Neither production root resolution nor account/tool settings change."
  ],
  "rejected": [
    {"option": "Delete a duplicate incident", "reason": "Separate witnesses and cleanup attempts are useful audit evidence; deduplicate the count by recorded identity instead."},
    {"option": "Turn a transient per-task parent lookup failure into top-level lane allocation", "reason": "It can deadlock against the outer gate's reservation. Keep the validated parent; an unreadable holder census fails acquisition."},
    {"option": "Add a CLI environment override for the host directory", "reason": "It would weaken the machine-wide rendezvous contract. A fixture-local OS boundary replacement tests the real CLI without exporting that bypass."},
    {"option": "Defer these local corrections as twelve follow-ups", "reason": "The diagnosed changes fit the already-open repair and share its fixtures and final gate. NoOp would leave confirmed selection, portability and diagnostic gaps."}
  ],
  "goalAlignment": "D023's eight-trap comparison still holds: one interface and one gate avoid escalation and commons waste; current identity and failure fixtures prevent rule beating; autonomous cleanup reduces operator rescue. Preserve useful sampling, identities and audit history rather than replacing supervision. These changes add no dependency or publication authority.",
  "reopenWhen": "A current-identity fixture or independent verification contradicts a disposition; stop identities diverge across witnesses, an unwritable record disables cleanup, or an actual kernel race escapes the sampled identity checks. Existing no-mark ownership, live-guard upgrade and worktree CLI ordering follow-ups retain their recorded routes."
}
```

## WO-185-D024 — fixture corrections during FINAL-001 repair

```json
{
  "id": "WO-185-D024",
  "kind": "correction",
  "date": "2026-10-03",
  "dispatch": "resume: fix; FINAL-001",
  "misread": "The first isolated-CLI fixture started its private guard as a child of the CLI, unlike the already-running shared guard in production. The first ledger-failure fixture required killOwned to return a root that the task's direct budget-stop callback had already killed. A bare harness evidence invocation was also used during preparation as though it were a status read.",
  "meant": "CLI infrastructure starts outside the wrapped command's process tree. A successful prompt kill can leave the later revalidated census with no remaining root; disappearance, the typed failure and no survivor establish the stop. harness evidence runs projection preparation and checks; it is not a read-only gate-status query.",
  "changed": "Start and register each fixture CLI's private guard before invoking that CLI, retain fixture cleanup, and assert process disappearance instead of a nonempty later kill list. Preserve the first 32/34 transcript. Use host completion for running commands and explicit gate-marker reads for gate state; do not repeat the evidence invocation for status.",
  "decision": "Correct the fixture assumptions and continue with a fresh focused run, retaining the typed-stop and no-survivor assertions. The operator selected gpt-6.1-sol, max, Codex CLI 0.160.0 by session readback; no subagent was started.",
  "evidence": [
    "repair-final001-host-fixtures.txt: 32 passed, 2 failed, 59.00 seconds. The isolated CLI's command emitted bounded-result memory-budget and its own exit 125, but its outer fixture wrapper found that CLI's private guard and lock process alive and returned surviving-process.",
    "The same transcript records the allocator stopped at 69173752 bytes under the 67108864-byte budget with host and checkout ledger failures reported. The test failed on a nonempty killedProcesses assertion, before reaching its gate-row case.",
    "node scripts/harness.mjs evidence during preparation printed Prepared owned evidence projections and Final evidence passed in 3.3 seconds against the existing pre-repair rows. It did not establish evidence for the subsequent repaired code."
  ],
  "rejected": [
    {"option": "Ignore the outer wrapper's survivor judgment", "reason": "The fixture must respect the production ownership boundary, not suppress a real surviving child."},
    {"option": "Delay the direct budget kill to populate a later census", "reason": "The order requires stopping promptly; telemetry does not justify a slower kill."},
    {"option": "Discard the failed fixture transcript", "reason": "It records what was wrong and what the corrected test changes."}
  ],
  "reopenWhen": "A corrected fixture leaves a descendant or a typed result is lost; a later status inspection starts unrequested evidence work."
}
```

## WO-185-D023 — FINAL-001 repair scope and rules

```json
{
  "id": "WO-185-D023",
  "date": "2026-10-03",
  "dispatch": "resume: fix; FINAL-001",
  "decision": "Repair D018-D020 and disposition D021 within the declared runner, guard, wrapper and corpus surfaces. A resource stop kills before recording; recording or membership-publication failures cannot escape a monitor tick. Manifest findings retain the generator's encoded representation while executable grid values are decoded. A bounded probe preserves argv and the caller's environment; gate suites retain their existing expansion and environment policy. Reuse D002, the order's only economy assessment, without a second experiment.",
  "evidence": [
    "Canonical resume status selected WO-185, needs-fix, legal action fix; dispatch selected FINAL-001 and reserved this Codex session as the worktree's single writer.",
    "process-monitor.mjs calls appendIncident and onMembers before task.fail; host-resources.mjs has three throwing incident writes.",
    "All three wo102 files decode manifest.findings, while inspectRow stores vector, expected and actual with encodeNumbers.",
    "bounded-command.mjs calls executeSuite without distinguishing a probe; executeSuite expands every non-option asterisk argument and applies suiteEnvironment.",
    "D021's source observations identify fixture selection, CPU-dependent lane accounting, group-leader naming, lifetime swap baseline, duplicate counting, kill error handling, census-time pgids, indented TAP retention, repeated inherited-lease lookup, signal/resource precedence and missing gate process fields. These remain source observations until the new fixtures execute."
  ],
  "alternatives": ["Repair these bounded surfaces and execute the affected fixtures plus the required review gate", "Defer the reproduced main findings", "Replace supervision or weaken the evidence gates"],
  "rejected": [
    {"option": "Defer the reproduced main findings", "reason": "They break the order's own stop and reproducibility contracts; NoOp retains the reproduced failure paths."},
    {"option": "Replace supervision or weaken the evidence gates", "reason": "The existing ownership and sampled-budget interfaces remain useful. Local corrections are reversible and need no new dependency, account setting or gate."}
  ],
  "goalAlignment": "This risk-reduction prerequisite protects the shared host on the source-to-deliverable critical path. Policy resistance and fixes that fail: no record write conditions the kill, and the probe wrapper faithfully runs the command. Commons: use one writer, no subagents and one fresh full-review gate after focused checks. Drift to low performance: require the same-kernel nonfinite quarantine round trip. Escalation: preserve existing interfaces and refuse no new tool class. Success to the successful: prior passing gates do not excuse FINAL-001's reproduced defects. Shifting the burden: automatic stop survives ledger failure. Rule beating: exercise unavailable writes and nonempty findings, including a case absent from the report. Seeking the wrong goal: judge stopped processes and reproducible commands, not receipt count. Naive Interventionism: retain useful budgets, intervals, ownership, suite policy and publication controls; limit changes to the recorded findings and fixture hygiene. NoOp leaves operator rescue possible and two declared tools unreliable.",
  "reopenWhen": "A focused fixture, the fresh review gate or independent verification contradicts a repair rule; a D021 disposition needs a mechanism outside these bounded surfaces."
}
```

## WO-185-D001 — containment and host scope

```json
{
  "id": "WO-185-D001",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Implement footprint supervision shared by the runner, bounded wrapper and detached host guard; resolve coordination from the operating system's per-user temporary directory, independent of clone, worktree and TMPDIR. Preserve historical WO-107 measurements and its original RSS wrapper.",
  "evidence": [
    "WO-102 D010 and WO-105 D006 record the uncontrolled failure and the cross-session rescue; they do not establish its allocation mechanism",
    "WO-107 D003 rejects artificially low heap caps; D008 records a 1239662592-byte resident gate peak, not a footprint baseline",
    "scripts/test-runner.mjs retains all output and has no process-signal handlers; its concurrency cap belongs to one invocation",
    "getconf DARWIN_USER_TEMP_DIR resolves the same system-temp root that os.tmpdir reports on this host; sysctl hw.memsize reports 51539607552 bytes",
    "The installed macOS SDK declares proc_pid_rusage and ri_phys_footprint; top -l 1 confirms a readable MEM field but takes about 0.39 seconds for one snapshot"
  ],
  "rejected": [
    {"option": "Reuse the historical RSS watchdog as the new memory guarantee", "reason": "It cannot observe compressed footprint; changing it also changes a retained measurement protocol."},
    {"option": "A repository-local guard or lane lock", "reason": "Separate clones would each admit a full gate and miss the host-wide contract."},
    {"option": "Install a service or change account settings", "reason": "The authorized lifecycle command can start the guard without that effect."},
    {"option": "NoOp", "reason": "It retains the observed need for another session to rescue the host."}
  ],
  "reopenWhen": "Measured sampling cost, a missed attributable process, budget overshoot or a second-clone fixture contradicts the promised protection."
}
```

This prerequisite protects the shared machine and operator attention needed for the source-to-deliverable loop. Policy resistance favors one set of budgets consumed by all three entry points; commons favors host-wide accounting; drift keeps typed failure and current-identity evidence; escalation avoids another tool-call refusal or approval rule; success-to-the-successful compares the old sampler with a footprint reader; shifting the burden removes recurring operator rescue; rule beating requires real process kills and descendant checks; seeking the wrong goal keeps machine usability ahead of a gate-count proxy. Naive Interventionism preserves suite selection, historical evidence, publication controls and normal heap behavior, with bounded fixtures before the full gate.

## WO-185-D002 — economy assessment

```json
{
  "id": "WO-185-D002",
  "kind": "experiment",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "question": "Can the historical bounded-command sampler be reused unchanged for the guard and runner?",
  "decision": "Decline an additional benchmark and preserve the historical sampler unchanged; implement the required footprint reader separately.",
  "evidence": ["corpus/harness/wo107-bounded.mjs reads aggregate RSS, while the order requires nonresident footprint accounting"],
  "rejected": [{"option":"Benchmark RSS-only reuse", "reason":"It cannot establish the required footprint contract, regardless of its speed."}],
  "alternatives": ["Reuse the RSS sampler", "Preserve it and implement the order's shared footprint reader"],
  "observation": "Source inspection shows the historical sampler reads only RSS. The required compressed-memory case excludes unchanged reuse. A performance experiment on it would not decide this contract.",
  "budget": {"wallSeconds": 600},
  "execution": "declined",
  "reason": "The deciding observation is already in readable source; preserve the historical protocol and avoid an unnecessary benchmark.",
  "cost": {"wallSeconds": 0, "tokens": null, "commands": ["none (execution declined)"], "source": "No additional experiment executed; prerequisite source reads belong to implementation preparation."},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["none (execution declined)"], "summary": "No economy improvement claimed; the required containment change remains D001."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "reopenWhen": "A future measurement contract can use the historical RSS-only monitor without weakening its claims."
}
```

## WO-185-D004 — native ownership, coordination and bounded assertion evidence

```json
{
  "id": "WO-185-D004",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Use a small native macOS footprint/identity census, a pipe-held kernel flock, and a pre-exec task registration barrier. Preserve birth identities when a top MEM footprint fallback is used. Replace sweep structural assertions with bounded count/digest/retained-finding diagnostics.",
  "evidence": [
    "The installed SDK exposes proc_pid_rusage. The working native reader reports ri_phys_footprint; a 64 MiB fixture budget stops IOSurface ledger growth near 70 MiB while RSS remains about 8 MiB. This tests nonresident accounting, not forced compression.",
    "The CLT compiler and its selected SDK compile the helpers. /usr/bin/clang initially selected an incompatible toolchain; matching the CLT compiler to xcrun's SDK corrected the build without a dependency or account change.",
    "Apple's public XNU proc_internal.h documents the original-parent unique ID as surviving reparenting; the private proc_info ABI was checked on this host. The immediate detached-child fixture now fails with that child named and killed.",
    "The executable lock recovery fixture kills its owner and verifies three waiters serialize. There is no stale-file unlink or arbitrary-timeout reclamation.",
    "corpus-measurements.json records three passing controls (1.2–5.5 s, at most 492823384 bytes) and three planted RNG-threading drifts (1.6–2.4 s, at most 267601064 bytes), all below the 805306368-byte task budget.",
    "The single legacy confirmation materialized 126792 findings and reached 875107688 bytes before a typed stop at 3.610 s. The sampled stack includes inspectValue, createErrDiff, AssertionError, innerFail and deepStrictEqual, with array/object formatting above them.",
    "The stack confirms assertion-error construction/formatting as the sampled grower. It does not independently prove the inferred typed-array line-diff stage or attribute the second historical event."
  ],
  "rejected": [
    {
      "option": "PS lstart as a fallback ownership identity",
      "reason": "Second-precision text is incompatible with native births and could reclaim live reservations during a reader failure."
    },
    {
      "option": "A hard-link lock reclaimed by inode-check then unlink",
      "reason": "Two reclaimers can race and unlink a replacement holder; kernel flock releases on owner-pipe death."
    },
    {
      "option": "Start the executable before registering its root",
      "reason": "A fast native daemonizer can exit before its birth/unique ID is observed. The launcher waits on fd 3 then execs with the same PID."
    },
    {
      "option": "Force compression or remove fixture ceilings",
      "reason": "The owned IOSurface ledger reproduces low RSS with growing footprint under a five-second/240 MiB fixture limit and the required one-eighth physical ceiling."
    },
    {
      "option": "Retain structural equality for sweep arrays",
      "reason": "The confirmation reaches error formatting with an unbounded array; scalar assertion fields and at most 32 retained findings remove that input."
    },
    {
      "option": "NoOp",
      "reason": "It retains the directly reproduced unbounded failure path."
    }
  ],
  "reopenWhen": "A supported host cannot read identities/footprint, the private kernel ABI changes, a consumer bypasses bounded findings, or current-identity fixtures disagree."
}
```

The assertion check discovers WO-102 and direct helper/sweep consumers in corpus/harness; its lexical dataflow covers aliases, destructured kept/findings and element access. It remains a scoped judgment, not a general JavaScript proof. No npm dependency was added; D007 records the changed skeleton version and console pin. The native helper requires a compiler; Linux's resident-plus-swap reader is explicitly a different accounting source and is unqualified here. Ordinary signal loss is reported; a live unreadable footprint fails supervision. A completely unavailable process inventory cannot identify a safe bare-process target and never reclaims reservations as if the owner had died.

Kernel source: [original-parent identity](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/sys/proc_internal.h), [published private proc-info ABI](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/sys/proc_info_private.h).

## WO-185-D005 — adversarial corrections

```json
{
  "id": "WO-185-D005",
  "kind": "correction",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "misread": "The first implementation treated wrapper-specific reduced task budgets as candidates for the whole session's bare-task budget, and treated sampled PID ancestry, live runner ownership, merged output tails and independent stale-lock reclamation as sufficient.",
  "meant": "A reduced probe budget belongs to that probe only. Process identities, surviving tasks and nested leases must remain owned across runner death; resource stops must stay typed; diagnostic retention and lock recovery must tolerate the actual races.",
  "changed": "Confine reduced budgets to explicit tasks; validate root birth; add original-parent IDs and the launch barrier; retain live descendants in lane records; suballocate nested reservations; lease base comparisons; retain early failure diagnostics separately; stop through trusted process groups before cleanup observations; preserve resource-failure rows; replace the stale lock with flock; exclude guard infrastructure from its liveness; count protected gate runners in host aggregate and escalate their resource stop after one second.",
  "decision": "Keep the corrections and the adversarial findings as evidence. Preserve the wider survivor guarantee as unmet where sampled ownership cannot establish it.",
  "evidence": [
    "The one operator-authorized read-only adversarial worker judged all implementation/architecture surfaces; no second writer or descendant worker was admitted.",
    "fixtures-complete.txt and guard-lifecycle.txt name the executable resource, signal, output, clone, nested/orphan lease, lock-recovery and owner-exit cases.",
    "guard-gate-budget.txt records a typed failed gate row and localMemoryStops, rather than an operator interruption. A guard-first resource incident also makes the enclosing wrapper fail, so the fixture expects that typed outer failure.",
    "launch-breach.txt proves an immediate pre-exec budget breach exits 125 without an unhandled control-pipe EPIPE.",
    "The gate runner remains protected long enough to record an incident; if it remains live after the one-second grace, the guard sends a verified stop without targeting the agent.",
    "Full-gate resource evidence is still to be measured; no absolute containment or successful final review is inferred from these development checks."
  ],
  "rejected": [
    {
      "option": "Broaden the reduced test budget to sibling commands",
      "reason": "That can kill unrelated healthy session processes."
    },
    {
      "option": "Reclaim the lane solely because its runner exited",
      "reason": "Its live task tree and subleases still consume host capacity."
    },
    {
      "option": "Treat missing ownership or footprint as zero",
      "reason": "It would manufacture a passing bound and could reclaim live owners."
    },
    {
      "option": "Pass a gate resource stop through the operator interruption route",
      "reason": "Memory breaches require a typed failed row, whereas operator SIGINT/TERM/HUP require no row."
    },
    {
      "option": "Protect gate runner PIDs by removing them from host accounting",
      "reason": "Protection from signals and footprint accounting are different duties."
    }
  ],
  "reopenWhen": "A current executable fixture or adversarial replay contradicts one of these corrections."
}
```

## WO-185-D006 — recorded survivor guarantee limitation

```json
{
  "id": "WO-185-D006",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Record criterion 3 as unmet for the broader detached-descendant guarantee. Do not narrow the order, waive it, or present a polling guard as absolute containment. Preserve the implemented controls and board the missing ownership mechanism for explicit planning.",
  "evidence": [
    "lineage-limit.c is a zero-allocation native double-fork fixture with a two-second self exit. lineage-limit.txt records a successful root task while its detached grandchild survived; the probe identified and killed that owned fixture afterward.",
    "The child's original-parent unique ID identifies the unobserved intermediate, not the registered task root. Neither current ppid nor the sampled history can reconstruct that edge.",
    "The installed SDK says NOTE_TRACK/NOTE_CHILD are unsupported since macOS 10.5. Original-parent IDs improve a direct detach but do not supply a complete historical ancestor chain.",
    "The same limit applies to a bare session command whose short-lived shell/intermediate backgrounds a process and disappears before the guard census.",
    "Product 07 and AI-HARNESS-SECURITY state this limit; the work order's criterion remains unchanged."
  ],
  "rejected": [
    {
      "option": "Mark the entire survivor guarantee met because the direct-child fixture passes",
      "reason": "The bounded double-fork counterexample is executable evidence against it."
    },
    {
      "option": "Raise poll frequency until the race appears to vanish",
      "reason": "A finite interval cannot prove every short-lived intermediate was observed and would increase overhead."
    },
    {
      "option": "Claim deprecated kernel fork tracking is usable",
      "reason": "The installed SDK contradicts that claim."
    },
    {
      "option": "Read arbitrary unrelated process environments or install a privileged service",
      "reason": "Those effects are outside this clean-room execution and the order explicitly excludes a service/account change."
    },
    {
      "option": "NoOp on the remaining gap",
      "reason": "It would hide a reachable ancestry escape; retain a public follow-up and an unmet criterion."
    }
  ],
  "followup": "Establish complete ownership for descendants through unobserved intermediate exits, including ignored-wrapper bare commands; compare an inheritable ownership mechanism with an authorized OS event source. Pin the double-fork fixture and inventory-loss behavior before claiming absolute host protection. Paths: scripts/lib/host-resources.mjs, scripts/host-guard.mjs, scripts/test-runner.mjs; high priority.",
  "reopenWhen": "An authorized ownership mechanism passes the immediate multi-level detach case without importing unrelated process material, targeting unrelated roots or changing unapproved host settings."
}
```

This preserves the mission's usable shared host and evidence floor: avoiding a false guarantee is more valuable than a completion label. The shipped controls remove the reproduced assertion grower, bound ordinary owned trees and coordinate gates; the missing historical ancestry edge remains a real defect for independent verification. No operator waiver has been supplied.

## WO-185-D007 — compatibility and release preparation

```json
{
  "id": "WO-185-D007",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Prepare root patch v0.65.1 locally and bump skeleton 0.51.0 to 0.51.1 for the added shared role sentence. Update the console's exact workspace pin and lockfile; leave other component versions and publication controls unchanged.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.65.1 above the reachable local v0.65.0 baseline and recorded D003.",
    "Only skeleton/src changes component behavior; runner/corpus machinery is outside a package source. No dependency is added.",
    "npm run build and harness emit --loadout contributor regenerate the installed role roots; no harness-host source or registered feedback source is edited."
  ],
  "rejected": [
    {
      "option": "A major/minor package bump",
      "reason": "This adds bounded resource procedure without changing public IR or product APIs."
    },
    {
      "option": "Publish from this executor",
      "reason": "Publication remains a separate authorized role."
    }
  ],
  "reopenWhen": "Integration consumes either staged version or changes a component compatibility impact."
}
```


## WO-185-D008 — evidence preflight and startup measurement corrections

```json
{
  "id": "WO-185-D008",
  "kind": "correction",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "misread": "Keeping registration in resume.mjs was treated as sufficient to carry the selected authority edition, and a pre-exec sample followed by a two-second interval was treated as a useful peak basis for every short task.",
  "meant": "The required generated role sentence changes authority bundle output even without a hook-source change. A short executable can finish between registration and the first ordinary footprint sample.",
  "changed": "Preserve WO-124 authority revision 003, mint and select WO-185 authority revision 001. Add a post-launch sample within 100 ms and full samples on signal ticks during each task's startup window; retain the normal two-second interval afterward. Include escalation and unavailable-observation time in runner sampling cost.",
  "decision": "Keep immutable evidence and current-source checks; measure executable startup as well as the paused launcher before choosing the budget basis.",
  "evidence": [
    "The first npm test -- --review stopped at authority-evidence after 4686 ms, naming stale WO-124 revision 003 bundle-diff.json. It was not a passing full-gate baseline.",
    "authority-evidence.mjs --write --edition WO-185 --revision 001 recorded the new deterministic authority files without replacing the historical selection's bytes.",
    "The startup fixture allocates 67108864 bytes for 350 ms: its successful 409-ms task records 80725936 bytes of footprint before the ordinary two-second interval.",
    "The subsequent bounded build records 311237088 bytes of task-tree footprint, rather than the approximately 1.3 MiB launcher-only observation in the stopped gate.",
    "The startup fixture's first attempt was a setup failure because the existing command expander treats an asterisk in an inline argument as a test glob. Using the equivalent numeric byte constant makes the two selected tests pass; runner expansion behavior is unchanged."
  ],
  "rejected": [
    {
      "option": "Rewrite the old authority revision or restore generated role bytes to pass",
      "reason": "Both discard an authorized change or its immutable evidence."
    },
    {
      "option": "Call the launcher's peak the compiler's memory baseline",
      "reason": "The executable fixture disproves that measurement's usefulness for short tasks."
    },
    {
      "option": "Claim continuously observed maximum memory",
      "reason": "These are sampled peaks; allocation between samples and the recorded lineage gap remain limitations."
    }
  ],
  "reopenWhen": "Current authority checks differ, a short task's executable footprint is not sampled, or measured sampling cost exceeds the order's two-percent limit."
}
```

## WO-185-D009 — full-review and independent-review repairs

```json
{
  "id": "WO-185-D009",
  "kind": "correction",
  "date": "2026-10-03",
  "dispatch": "resume: next; authorized continuation",
  "misread": "The native exec barrier's exit 127 was treated as an ordinary program failure, the WO-179 role snapshot was treated as the current oracle after an authorized role change, and duplicate registration removal was treated as bookkeeping without ownership transfer. The base-comparison lease used an environment field that execution does not read, and released registrations were assumed to reach the stale-history deletion branch.",
  "meant": "Launch errors must retain their typed identity; immutable role snapshots need a linked successor. Removing a duplicate must preserve observed descendants, nested base checks must inherit the actual lease, and an explicitly released registration disappears before the next census can filter it.",
  "changed": "Report exec errno over the pre-exec fd-3 channel, close it on successful exec, and retain ordinary exit 127 as an ordinary program result. Preserve WO-179 and mint/select WO-185's default and opt-out hashes linked to its exact historical SHA-256. Merge PID/birth and both unique-ID histories into a surviving same-live-root registration before any ownership census; prune only proven-deleted duplicates and sweep histories for released IDs. Pass the base lease through executionEnvironment. Expose tracked history counts in private guard metrics and advertise the bounded CLI in its usage text.",
  "decision": "Repair the encountered launch/oracle regressions and the independently found ownership, lease and history defects before a fresh full review. Preserve the separate D006 unmet criterion rather than treating an already-observed ownership repair as proof of complete ancestry.",
  "evidence": [
    "The second full npm test -- --review ran 864351 ms: 38 suites passed, two failed, and 85 tasks executed. process-debt named the old WO-179 current role oracle; runner-fixtures classified a missing executable as inherited rather than unknown.",
    "That completed but failed run measured runner sampling at 13624.530425 ms (1.576 percent of gate wall time). The primary guard's before/after window measured a conservative 9719.554509-ms increment (1.125 percent of gate wall time); its window extends beyond the gate. These observations do not stand as a passing full-gate budget basis.",
    "The bounded WO-145 optional-economy fixture passes with the new WO-185 oracle, preserving the complete historical snapshot chain and removing only the executor economy paragraph on opt-out. Adjacent item adjacent-0001 owns this repair.",
    "The read-only adversarial worker identified loss of already established descendant ownership, the base-comparison environment-field mismatch and retention of histories after task registration files are released. It ran no probes or tests and made no file changes.",
    "The five selected bounded launch/registration/lease tests pass in 3.754 seconds. The ownership fixture observes three processes before the intermediate exits, registers the survivor afterward, prunes the original registration, then stops the reparented grandchild at 97159064 bytes under a 67108864-byte budget. Its allocation is 80 MiB with a ten-second self-exit, below one eighth of host physical memory.",
    "The released-history fixture observes nine tracked registrations, explicitly releases eight, and measures one remaining history in the same long-lived guard. The nested base fixture holds all four parent lanes and completes its nested product gate at both current and base bytes, leaving the intentional ordinary outer failure classified inherited.",
    "The missing-program case now reports launch errno 2 and an unknown base comparison, while ordinary executed document failures retain introduced/inherited classification.",
    "The same read-only adversarial worker reread all three repairs and found no new P1/P2 defect. Its proof caveat is preserved: the three-process metric is aggregate, not a PID-specific observation. The fixture's reparented PID, late survivor registration, pruning and typed-kill assertions exercise ownership transfer. This session has two explicitly tracked workers against the cap of twenty, with no planned descendants; the harness counter has unknown coverage of earlier workers.",
    "The first guard restart incorrectly used the bounded-probe wrapper: its normal descendant sweep reported and killed the intentionally persistent guard and lock helper. The corrected monitor-management command uses the guard's lifecycle API outside a probe task, verifies that all live session registrations belong to this agent and that no gate is live, and retains one session after pruning 28 deleted fixture repositories. No foreign or unidentified process is killed."
  ],
  "rejected": [
    {
      "option": "Restore the old role bytes or edit WO-179's immutable snapshot",
      "reason": "That erases an authorized required sentence or historical evidence."
    },
    {
      "option": "Remove duplicate registration history before transferring it",
      "reason": "A late registration cannot reconstruct an already reparented descendant; the adversarial finding and bounded fixture establish the distinction."
    },
    {
      "option": "Keep released histories for the entire agent session",
      "reason": "Completed tasks would accumulate permanent private bookkeeping. Explicit release follows task cleanup."
    },
    {
      "option": "Treat an inaccessible repository as deleted",
      "reason": "Only ENOENT or ENOTDIR establish deletion; other stat failures preserve supervision."
    },
    {
      "option": "Call the failed full review green or reuse it for criterion 8",
      "reason": "Two checks failed and the repairs change the code identity. A fresh full review remains required."
    }
  ],
  "reopenWhen": "A linked snapshot changes, a launch failure loses its type, transferred ownership or released-history counts disagree with the fixture, or a nested base check requests independent capacity while its parent holds all four lanes."
}
```

The repairs stay on the original host-containment critical path. D001's goal-alignment judgment still applies: conserve a shared machine, count actual owned work, preserve diagnostic failures and avoid new tool refusals. No additional economy experiment, host service, setting change or publication is authorized by these corrections.

## WO-185-D010 — measured budget basis and executor handoff

```json
{
  "id": "WO-185-D010",
  "date": "2026-10-03",
  "dispatch": "resume: next; authorized continuation",
  "decision": "Keep the quarter/half/two-thirds shares and 500-ms signal/two-second ordinary footprint intervals. Replace the pending budget basis with the current passing full-review measurements. Hand off the implemented controls with criterion 3 explicitly unmet and preserve the close-bound follow-up duty.",
  "evidence": [
    "npm test -- --review passed 40 suites and 85 fresh tasks in 838131 ms, recorded 2026-10-03T03:37:18.877Z at code identity 7e92106f8118d360eb8df6c4b9bca2bba6611b3f6b3bc4bfc9a92963df03026b.",
    "gate-measurements.json records each task's sampled footprint. The largest task is worktree-integration at 684554984 bytes; the gate peaks at 1127693416 bytes and the shared guard at 1752558448 bytes on a 51539607552-byte host. Budgets are 12884901888, 25769803776 and 34359738368 bytes: 18.822, 22.852 and 19.605 times those observations, all above the required factor of four.",
    "Runner sampling work is 12490.305777999673 ms, 1.4903 percent of gate wall. The same birth-verified guard's before/after delta is 7681.690854000972 ms, a conservative 0.9166 percent. Its observation window is slightly wider than the gate and its prior sampled peak was lower. These are direct sampler elapsed costs, not a paired estimate of causal slowdown.",
    "The runner reports no unavailable signal during this passing run; the shared guard reports original-parent unique identity unavailable in some census rows. The rows and cause were not retained, so no transient explanation is invented. Readable footprint, birth and other signals remained active.",
    "The primary guard's only memory-budget incident in the measurement window is the bounded CLI fixture's memory-growth task with a 33554432-byte test budget, stopped at 44696008 bytes with low resident memory. The surrounding full review passes.",
    "recordGateChecks retains outputRef only for failed or unexecuted diagnostics. Passing task output is not retained; the current host-guard fixture transcript is therefore captured explicitly after the full gate, without rerunning the full gate or the single legacy confirmation.",
    "The explicitly captured current fixture run passes all seventeen tests in 30736.610 ms, preserving host-qualified transcripts in fixtures-current.txt. The zero-allocation double-fork replay at the passing code identity still leaves its detached grandchild alive after a successful 310-ms root task; lineage-limit-current.txt records its verified cleanup and independent two-second self-exit ceiling. This is the remaining D006 counterexample, not a repeated legacy allocation confirmation.",
    "The material inventory reports no nested Git repositories in the selected worktree. The inspected corpus control/drift copies contain no Git initialization or copied Git metadata; transient fixture repositories own their cleanup.",
    "The original corpus follow-up FUP-4feed3b6e7a451ef remains allocated to WO-185 and is retargeted at release close, as criterion 7 says. The independently recorded D006 ancestry gap remains deferred as FUP-d0a9719cc2e4ec55, not waived or settled.",
    "npm run test:docs passes all twenty-four checks in 38937 ms, recorded 2026-10-03T03:42:38.127Z. Updating the ledger from that result changes documentation; the completion command runs its required document gate inline again.",
    "D004's phrase Node packages are unchanged was too broad. The checked package and lockfile diff changes skeleton 0.51.0 to 0.51.1 and the console's exact pin, without adding a dependency; the sentence now names that distinction and points to D007."
  ],
  "rejected": [
    {
      "option": "Reduce the generous shares to the observed working set",
      "reason": "The order and WO-107's operator direction require margin rather than artificially low caps."
    },
    {
      "option": "Raise sampling intervals without a measured cost breach",
      "reason": "Both samplers remain below their individual two-percent limit; a longer interval would permit additional growth."
    },
    {
      "option": "Interpret measured sampler work as an exact total runtime slowdown",
      "reason": "Concurrent sampler timings and wider guard boundaries are observations, not a controlled paired comparison."
    },
    {
      "option": "Rerun the legacy unbounded assertion confirmation for another transcript",
      "reason": "The one authorized bounded confirmation and its stack are already preserved."
    },
    {
      "option": "Settle the original follow-up before close or mark absolute descendant containment met",
      "reason": "Close belongs to its later role and D006 has an executable counterexample."
    }
  ],
  "reopenWhen": "A future full run needs more than one quarter, one half or two thirds of physical memory, either sampler exceeds two percent of comparable gate wall, the private ABI changes, or a qualified ownership mechanism resolves D006."
}
```

At the cited 3.4 GiB/s growth rate, the ordinary two-second footprint interval permits about 6.8 GiB of additional growth per growing process before its next sample, plus observation and termination latency. Pressure/swap escalation can sample on a 500-ms signal tick (about 1.7 GiB at that rate); the runner also samples within 100 ms of launch and on startup signal ticks. Protected gate runners receive a termination request and a one-second cleanup grace before a verified kill. None of these intervals prove a continuous maximum or remove the unobserved-ancestry gap.

The mission outcome is useful but bounded: reproduced assertion growth is removed at its source, owned trees have generous footprint budgets, failures retain bounded diagnostics, and gates coordinate across clones. Operator rescue for those tested paths is replaced by an automatic recorded stop. D001's goal-alignment tradeoffs still stand; the remaining ancestry counterexample prevents an absolute host-safety claim and remains visible for independent verification.

## WO-185-D003

```json
{
  "id": "WO-185-D003",
  "date": "2026-10-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.65.1, the next patch above the observed release baseline v0.65.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.65.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-185-no-order-can-exhaust-the-host.md"
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

## WO-185-D011 — repair ownership and verification defects

```json
{
  "id": "WO-185-D011",
  "date": "2026-10-03",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1–F5 within the original surfaces. Identify inherited task output sockets by their live supervisor peer, supplement sampled ancestry with descriptor ownership, preserve lossless bounded comparisons, refuse oversized quarantine writes before any file change, isolate fixture incidents, and check interruption immediately before writing a gate row.",
  "evidence": [
    "VER-001 reproduces a zero-allocation double fork surviving executeSuite, NaN/Infinity digest aliasing, truncated regeneration rejected by its tests and fixture incidents counted as real work; it identifies the final-await interruption window in source.",
    "The installed macOS SDK sys/proc_info.h and Apple's published libproc headers expose descriptor lists and anonymous Unix socket peer identities. A live runner endpoint can validate the child endpoint without reading arguments, environments or filesystem paths.",
    "D002 is the existing declined economy experiment; repair adds no second experiment. Current session readback is codex-cli 0.160.0, gpt-6-astra, max, codex-session-readback."
  ],
  "rejected": [
    {"option":"Read process environments", "reason":"Unrelated credentials may be present; descriptor identity suffices for the reproduced inherited-pipe escape."},
    {"option":"Increase census frequency", "reason":"It cannot establish an edge that has already vanished and adds host cost."},
    {"option":"Publish a partial quarantine as an exact set", "reason":"Refusing an oversized write preserves the existing exact-reproducer contract with bounded memory."},
    {"option":"NoOp or a prose waiver", "reason":"The authorized repair has executable counterexamples and no operator waiver."}
  ],
  "reopenWhen": "A descriptor-bearing double fork escapes, a recycled identity adopts an unrelated process, the descriptor census exceeds the sampling-cost allowance, or bounded corpus comparisons lose distinctions."
}
```

The repair protects the shared host needed by the source-to-deliverable loop. D001's eight-trap comparison remains applicable: one ownership rule avoids policy resistance; bounded sampling respects the commons; executable counterexamples prevent drift and rule beating; avoiding new refusals limits escalation; descriptor evidence challenges the current sampler rather than favoring it through sunk cost; automatic cleanup removes operator rescue; and safety with truthful limits is the goal rather than a passing label. Naive Interventionism retains suite selection and generous budgets and starts with self-expiring, zero-allocation fixtures. The remaining limit is deliberate loss of every inheritable mark before a sampled ancestry edge, including daemons closing descriptors; the repair will not claim absolute containment of those processes. Public API source: https://github.com/apple-oss-distributions/xnu/blob/main/libsyscall/wrappers/libproc/libproc.h and the installed SDK's sys/proc_info.h.

## WO-185-D012 — repair rules, fixture isolation and corrected probes

**Status correction (D014):** the closing sentence below, that disconnected or
reused descriptors do not establish ownership, is false. VER-002 F6 reproduced
a recycled endpoint adopting unrelated processes; D014 records the correction
and the rule the repair holds. The original text is kept as history.

```json
{
  "id": "WO-185-D012",
  "kind": "correction",
  "date": "2026-10-03",
  "dispatch": "resume: fix",
  "misread": "V8 binary serialization was initially assumed canonical for equivalent plain data; it distinguished equal regenerated full grids. The first quarantine fixture used the temporary directory's symlink spelling, which bypassed the generator's exact main-module URL check. A bare harness evidence invocation was mistakenly used while inspecting gate state; it starts evidence execution.",
  "meant": "The digest needs value equality as well as losslessness; the generator must actually execute in the fixture; gate status is not a request to start a gate.",
  "changed": "Use explicit scalar/container type tags, sorted record keys, signed-zero/nonfinite/undefined/hole distinctions and bounded retained-row comparison; resolve the fixture's physical directory. Stop the prematurely started evidence run through harness evidence --stop before further edits; it records no gate row.",
  "decision": "Keep the qualified descriptor repair and late-stop check, the canonical bounded oracle, typed refusal of oversized exact quarantines, and fixture-local incident attribution. Preserve the seven observed historical fixture incident rows verbatim in an ignored archive outside the production incident ledger.",
  "evidence": [
    "The host fixture run passes 19/19, including full runGate double- and triple-fork failures naming and killing the descendant, a moved inherited stderr descriptor, an unrelated live control, and the actual bounded CLI. Each zero-allocation descendant self-exits after five seconds independently of supervision.",
    "All three stop signals delivered during final row aggregation record no row. The final check is after the dynamic control-store import and immediately before recordGateChecks.",
    "The canonical full-grid regression changes a nonfinite value beyond the first 32 rows and detects it. Additional cases cover null, signed zero, undefined, missing keys, array holes, a lookalike tagged object and reordered equivalent keys. Unsupported object forms are refused rather than silently aliased.",
    "All 24 unchanged WO-102 tests pass in 10.181 seconds (bounded wrapper 10.224 seconds, sampled peak 775367832 bytes). The scratch drift generator reports findings-limit with total 126792, kept 32 and digest before touching its existing manifest or writing fixture/quarantine files. Manifest readers decode the existing nonfinite-number encoding and quarantine rendering preserves it.",
    "VER-001 F4 and the seven-row local readback identify six memory-growth stops at the 33554432-byte test budget and one 1-byte launch probe. Their exact original bytes remain in docs/control/local/harness/memory-incidents-fixtures-WO-185-VER-001.jsonl; the ignored archive receipt records its SHA-256. No incident was deleted or reclassified by a broad name filter. New CLI fixture stops go to the disposable fixture repository, with a test proving the real checkout's ledger is unchanged.",
    "harness evidence --stop reported all three markers stopped, active empty and no check recorded at 2026-10-03T04:41:58Z. The stop receipt remains local. The fresh review gate is still required after the repair.",
    "publication:check passes after refreshing the reviewed product section's source lock; plan check passes 39 receipts/28 passes. Local release preparation retains v0.65.1 and skeleton 0.51.1 without a new dependency or publication."
  ],
  "rejected": [
    {"option":"V8 binary serialization as a canonical digest", "reason":"The unchanged regeneration test supplied a counterexample; canonical typed values preserve the intended equality relation."},
    {"option":"Keep a summary beside a silently truncated exact quarantine", "reason":"Typed refusal before writes keeps the existing exact numbered-set contract and bounded failure path."},
    {"option":"Exclude every reduced-budget stop or process named memory-growth", "reason":"That would hide real work based on a heuristic. Only the seven individually observed historical fixture rows are archived; future isolation happens at launch."},
    {"option":"Claim descriptor marks close every ancestry gap", "reason":"Closing or losing every mark before observation, permission changes and unwrapped bare commands remain outside the qualified mechanism; D006's broader follow-up stays open."}
  ],
  "reopenWhen": "A same-kernel corpus round trip fails, equal plain values digest differently, fixture stops enter the real ledger, or a retained-descriptor descendant escapes."
}
```

The descriptor census scans only processes born at or after the earliest watched task. It compares opaque socket identities in memory; it outputs only matching ownership keys. The live supervisor's birth and socket handle are checked again before accepting a peer match, so disconnected or reused descriptors do not establish ownership. Cancellation preserves the output endpoints until the survivor sweep. Capturing initial descriptors is included in the runner's measured sampling cost. Sampling remains finite; neither these tests nor the ownership mark promise containment of an unobserved daemon that closes its marks.


## WO-185-D013 — measured repair and remaining ownership boundary

```json
{
  "id": "WO-185-D013",
  "date": "2026-10-03",
  "dispatch": "resume: fix; repair handoff",
  "reopens": {
    "decisionId": "WO-185-D006",
    "observation": "The order returned for criterion 3 repair. Inherited output-socket ownership now names and kills unsampled double and triple forks, including a moved descriptor, through runGate and the actual bounded CLI; the broader no-mark/bare-command limit remains."
  },
  "decision": "Deliver repairs for VER-001 F1–F5 with the current passing full review gate, unchanged generous memory shares and unchanged sample intervals. Re-dispose the remaining D006 ownership limit on its existing follow-up rather than carrying its old reproduced-counterexample description forward.",
  "evidence": [
    "npm test -- --review passed 40 suites/85 fresh tasks in 817321 ms at code identity d06bba78794691e654afe47b2bfa14509934648741ee5e20dc4eec8210151094, recorded 2026-10-03T05:01:48.530Z. All 85 tasks record sampled footprint peaks; runner-fixtures includes the repaired host cases.",
    "repair-gate-measurements.json records task/gate/host sampled peaks 668067048/1497849912/1389171024 bytes. Budget-to-peak ratios are 19.287/17.205/24.734. Sampling elapsed work is 1.5536% for the runner, including initial descriptor capture, and conservatively 0.9792% for the newly started guard. The host and gate maxima are sampled at different times; they are not simultaneous or continuous maxima.",
    "The guard used for measurement started at 2026-10-03T04:48:10.445Z, immediately before this full gate. Its whole-lifetime sampling cost through the final observation is an upper bound on work during the gate; no causal slowdown estimate is claimed. The session-owned earlier guard was retired by birth-verified SIGTERM. A bounded refresh probe correctly killed the replacement guard it had itself spawned as an intentional surviving descendant; the canonical full gate then started the measurement guard. No unbounded allocation or second legacy confirmation was run.",
    "repair-host-fixtures.txt records 19/19 focused tests. repair-corpus-control.txt records 24/24 unchanged tests. repair-corpus-measurements.json and repair-corpus-drift.txt record all three planted-drift files failing in 2.593–4.140 seconds, peaking at 249396184–288081760 bytes under 805306368 bytes; each prints total 126792, kept 32 and canonical digest 5ff785148829df9845c7982664ab143d3364c080e1e0f4ebbe32841ad60a1359.",
    "The real incident ledger is isolated from the CLI memory fixture. Seven historical test/probe rows remain verbatim in the ignored archive identified by D012. The full review adds no real-checkout fixture incident.",
    "inventoryMaterial(process.cwd()) returns an empty material list. Corpus scratch copies contain no Git initialization or Git metadata; disposable fixture repositories own their teardown. The material declaration CLI without a path printed usage and made no declaration; the read-only inventory supplied the required observation.",
    "followups --touching was read through all three pages: 18 textual matches. D006 is reopened here and its residual is re-disposed on FUP-d0a9719cc2e4ec55. The other 17 retain their existing routes: this repair changes neither cold-start budgets, corpus lane selection, unattributed-event provenance, writer/adapter/attestation rules, usage attribution, authority storage, direction-reader semantics nor other corpus lanes. No real unattributed memory incident was established. FUP-4feed3b6e7a451ef remains assigned to retarget at close, as criterion 7 directs.",
    "Local release preparation keeps application v0.65.1 and skeleton 0.51.1. The console pin and lockfile agree; no dependency, account setting, branch commit or publication is added."
  ],
  "rejected": [
    {
      "option": "Raise intervals without exceeding the measured cost allowance",
      "reason": "Both samplers are below two percent; extending the interval would permit more growth."
    },
    {
      "option": "Settle the entire D006 ownership follow-up",
      "reason": "The retained descriptor cases now pass, but no-mark and unwrapped unsampled ancestry still lack complete containment."
    },
    {
      "option": "NoOp on repair evidence",
      "reason": "The prior immutable failed verification and historical measurements judge earlier code and must not be presented as current acceptance evidence."
    }
  ],
  "reopenWhen": "A retained-descriptor descendant survives, either sampler exceeds two percent of a comparable full gate, measured peaks require more budget, or a privacy-preserving authorized mechanism covers the remaining no-mark ancestry cases."
}
```

The mission contribution is the now-executed replacement of operator cleanup for the reported detached descendants, reliable bounded drift alarms and uncontaminated failure counts. D001/D011’s eight-trap and Naive Interventionism comparisons hold at this result. At the cited 3.4 GiB/s growth rate, the two-second footprint interval still allows about 6.8 GiB of growth before the next sample, plus observation/termination latency; the 500-ms signal tick permits about 1.7 GiB. These bounds and D006’s remaining scope are disclosed rather than converted into an absolute host-safety claim.

## WO-185-D014 — held descriptor watches and the recycled-identity correction

```json
{
  "id": "WO-185-D014",
  "kind": "correction",
  "date": "2026-10-03",
  "dispatch": "resume: fix (VER-002 F6)",
  "reopens": {
    "decisionId": "WO-185-D011",
    "observation": "VER-002 F6 met D011's reopening condition, a recycled identity adopting an unrelated process: a census using a watch whose supervisor endpoint had closed tagged the runner's own census helper and a sibling process, and npm run test:docs failed twice at the subject identity on surviving-process host-footprint-."
  },
  "misread": "D012 states that re-checking the live supervisor's birth and socket handle before accepting a peer match means disconnected or reused descriptors do not establish ownership. Node closes the runner's ends of a task's stdout and stderr at EOF, before the final census and before the registration is removed, and the kernel hands that descriptor number and socket identity to the next socket the runner opens.",
  "meant": "A descriptor watch confers ownership only while the endpoint its supervisor captured is still that same open endpoint. No census in the runner, the bounded wrapper or the guard may use a watch after its supervisor has released that endpoint, and kernel-identity equality alone never re-establishes ownership.",
  "changed": "holdTaskDescriptors duplicates each captured supervisor endpoint and the published watch names the duplicate. executeSuite withdraws the watch from its monitor (monitor.finish) and removes the registration before it destroys its streams and closes the duplicates. guardCensus drops the tags of any registration no longer present after its census. The native census check is unchanged; its comment now states the recycling the publishers prevent. D012 carries a status correction pointing here; product 07 §Discipline and AI-HARNESS-SECURITY state the corrected rule.",
  "decision": "Repair VER-002 F6 by holding each task's captured output endpoints for exactly as long as their watch is published, withdrawing the watch before release in the runner and the bounded wrapper, and discarding guard tags from watches withdrawn during a census. Keep every other ownership path, the native census and the budgets unchanged.",
  "evidence": [
    "Bounded probe gen-probe.c on this host: 1999 of 2000 back-to-back socketpairs in one process received the just-freed socket's kernel identity (soi_so). proc_pidfdinfo PROC_PIDFDSOCKETINFO reports soi_stat.vst_ino 0 for every socket, while fstat in the owning process reports a per-socket inode (12972976), so the native census cannot read an identity that tells a recycled socket apart; only the supervisor can keep its endpoint from being freed.",
    "Bounded probes dup-probe.mjs and cloexec-probe.mjs: open('/dev/fd/N') duplicates the runner's task socket (fstat inode equal to the original) and keeps it after the stream's own descriptor reports EBADF at close; the duplicate is close-on-exec and absent from a later child's /dev/fd listing.",
    "Pre-repair discrimination: refs/dotln/checkpoint/WO-185/9 extracted to session scratch without Git metadata and run with this repair's fixtures. The held-endpoint fixture failed 3 of 3 runs: the task that closes its outputs early was failed as surviving-process naming an adopted sleep sibling. The docs-shaped gate failed 2 of 3 runs naming host-footprint-, a concurrent task's launcher host-lock-1bc60 and its node, so the old sweep also killed processes of a sibling task in the same gate.",
    "Repaired subject (repair-ver002-host-fixtures.txt, at the passing review identity): node scripts/harness.mjs bounded -- node --test scripts/test-host-guard.test.mjs passes 23 of 23. That includes the guard census that straddles a withdrawal; the held-endpoint case (18 watched censuses, 18 siblings, 3 of them on descriptor numbers the task's streams released, none adopted, each watch keeping its captured inode through the final census and losing it after release); and two docs-shaped gates of 17 tasks each. VER-001 F1's double and triple forks are still named and killed through runGate and the bounded CLI.",
    "npm test -- --review passed 40 suites and 85 fresh tasks in 844857 ms at code identity 579433dde7cd11c418432590ac0d527e310ee5b7044e26099b3e13d70bc6a2b0, recorded 2026-10-03T15:52:30.844Z; every task records a sampled footprint peak. npm run test:docs passed 24 of 24 at 15:36:04.375Z and 15:36:48.015Z after Prettier reflowed the new fixtures, and again at 16:01:13.278Z after the final write-backs, at the same identity; the two earlier runs failed only the format preflight, and feedback-evidence passed in all five.",
    "repair-ver002-gate-measurements.json: task, gate and host sampled peaks 555600112, 1337533840 and 1436777152 bytes against 12, 24 and 32 GiB budgets (ratios 23.19, 19.27 and 23.91). Runner sampling is 1.557% of gate wall; the guard's is 1.109% over the whole lifetime of a guard started from the repaired code at 15:38:25.098Z. The pre-repair guard (started 04:48:10.445Z) was retired first by birth-verified SIGTERM, and a first gate attempt was stopped through harness evidence --stop for that restart and recorded no row. docs/control/budgets.json names this basis; no signal was reported unavailable in this run.",
    "Criterion 5 at this identity (repair-ver002-corpus.txt): the unchanged wo102 files pass 24 of 24 in 9.95 s (bounded peak 762849256 bytes); with the planted Backoff drift each file fails in 2.70–4.21 s at peaks of 250461384–347794296 bytes under the 805306368-byte budget, reporting total 126792, kept 32 and digest 5ff785148829df9845c7982664ab143d3364c080e1e0f4ebbe32841ad60a1359, and generation refuses with findings-limit.",
    "D002 remains this order's single economy experiment (declined); this repair starts none. Session: Claude Code 2.1.288, claude-opus-5-5, effort max read from CLAUDE_EFFORT (selected, not effective)."
  ],
  "rejected": [
    {"option": "Verify a socket generation inside the native census", "reason": "proc_pidfdinfo returns no generation (vst_ino 0); only the owning process can stat its endpoint, so the census cannot tell a recycled socket from the original."},
    {"option": "Exclude the census helper from descriptor tagging", "reason": "It hides one instance only; the pre-repair fixtures also adopted a sibling sleep and a concurrent task's launcher and node."},
    {"option": "Withdraw a watch on the stream's close event", "reason": "The descriptor closes synchronously inside destroy and the event follows on a later turn, so a shared-monitor census can run in between."},
    {"option": "Read the system-wide Unix socket table for generation counts", "reason": "A full table read at every census adds host-wide cost and leaves a time-of-check gap between the descriptor read and the table read."},
    {"option": "NoOp", "reason": "Criterion 3 and npm run test:docs keep failing intermittently, and the sweep can kill a sibling task's processes."}
  ],
  "reopenWhen": "A census adopts a process holding a socket the task did not hand it, a held endpoint outlives its task's release, /dev/fd duplication of a socket fails on a supported host, or a guard tag survives from a registration absent after its census.",
  "followup": "Decide how a live host guard started from older DotLn code yields to a checkout whose guard rule changed. ensureHostGuard (scripts/lib/host-guard-state.mjs) reuses any live guard regardless of its code, so the guard started at 2026-10-03T04:48:10.445Z kept D012's tag rule after this repair until it was retired by birth-verified SIGTERM. Replacing a guard on every version difference would let checkouts at different versions keep replacing one another and drop the guard's in-memory ownership history."
}
```

The rule the repaired code holds: a descriptor watch is published only while
its supervisor holds the captured endpoint open on the descriptor the watch
names; the runner and the bounded wrapper withdraw it from their monitor and
remove its registration before releasing that endpoint, and the guard keeps a
census's descriptor tags only for registrations still present after that
census. Every census that uses a watch therefore reads the original endpoint,
and no recycled descriptor number or kernel identity can adopt a process. The
case VER-002 did not quote is a task that closes its outputs while it keeps
running: the old code released those descriptors mid-task, and a sibling
started afterwards was adopted and killed as the task's survivor.

The repair protects the shared host and the gate rows the source-to-deliverable
loop depends on. Against the eight traps: the target is the truthful ownership
the survivor sweep needs, not a green docs gate (seeking the wrong goal), and
the fixtures check the held identity at every census, not only the absence of
one symptom (rule beating). A deterministic held-endpoint fixture and a
pre-repair failure run guard against drift to low performance. The executor's
earlier passing rows did not outweigh the reproduced mechanism (success to the
successful). The repair stays in the order's surfaces rather than shifting the
burden to the operator or final review. It adds no refusal, approval or
surface (escalation, policy resistance). It adds two held descriptors per
running task and one existence check per watched registration per guard
census (commons). Against Naive Interventionism, the native census, budgets,
intervals and every other ownership path stay as they were. NoOp leaves a
sweep that kills processes the task never started. VER-001 F1's no-mark
daemon limit stays on FUP-d0a9719cc2e4ec55, unchanged by this repair. A live
guard started from older code keeps its older rule until it retires, because
ensureHostGuard reuses any live guard; that question is FUP-c1a89d52cc314af9.

## WO-185-D015 — adjacent fixture compiler and lane-count repairs

```json
{
  "id": "WO-185-D015",
  "date": "2026-10-03",
  "dispatch": "resume: fix; Adjacent Repair adjacent-0003 and adjacent-0004 from VER-002 other observations",
  "decision": "Compile the host-guard native fixtures with the compiler and SDK selection production uses (nativeCompiler), and refuse any hostLanes value other than the shared four when budgets load.",
  "evidence": [
    "VER-002 other observations: scripts/test-host-guard.test.mjs invoked the Command Line Tools clang path directly for both native fixtures while nativeBinary falls back to /usr/bin/clang; memoryBudgets accepted any positive hostLanes while scripts/lib/host-lanes.mjs refuses every capacity other than 4.",
    "After the change no hard-coded compiler path remains outside nativeCompiler (grep over scripts and corpus/harness). The fixtures compile and pass 23 of 23 on this host, which has the Command Line Tools; no Xcode-only host was available, so that path is unexercised.",
    "The new fixture writes hostLanes 2 and 6 and receives the typed refusal at load; 4 loads unchanged. docs/control/budgets.json already records 4."
  ],
  "rejected": [
    {"option": "Let acquireHostLanes honor a configured capacity", "reason": "Every clone and exported instance takes from one host-wide count; a per-checkout capacity would let two checkouts disagree about the shared lanes."},
    {"option": "Skip the native fixtures when the Command Line Tools path is absent", "reason": "That would hide criterion 1 and 3 fixtures on a host production supports through /usr/bin/clang."},
    {"option": "Defer both as follow-ups", "reason": "Both are small, inside the order's own surfaces and covered by its existing fixture file."}
  ],
  "reopenWhen": "A supported host builds the production helpers but not the fixtures, or the operator decides the host lane count should differ, which changes host-lanes.mjs and this check together."
}
```

Both items ran through the adjacent queue (revisions 13–20) with an intent
announcement, a check-in and a passing fixture run each. They change no budget,
lane count or ownership rule.

## WO-185-D016 — review gate held for a main-branch worktree

```json
{
  "id": "WO-185-D016",
  "date": "2026-10-03",
  "dispatch": "resume: fix; operator direction at the repair-complete refusal",
  "decision": "Hold repair-complete until a complete npm test -- --review row passes for the current selection while a main-branch worktree exists, as the operator directed, and board the worktree CLI's ordering defect as a follow-up instead of repairing it in WO-185.",
  "evidence": [
    "repair-complete refused shortly after the 2026-10-03T16:02:17Z handoff usage readback: criteria 2 and 8 name npm test -- --review, and the passing 15:52:30.844Z row (40 suites) lacks evidence-sources, artifact-evidence and verification-evidence. origin/main had advanced to efe62994 (WO-184, #183; committed 15:44:02Z, fast-forwarded into the launchpad at 15:45:15Z) while that gate ran from 15:38:25Z, and review selection diffs against origin/main, so those three suites joined the selection. The merge base stays 53fc6eb8.",
    "The complete rerun recorded 2026-10-03T16:17:40.218Z at the same code identity 579433dde7cd11c418432590ac0d527e310ee5b7044e26099b3e13d70bc6a2b0 passed 42 of 43 suites with 88 fresh tasks. target-publish failed one case, 'WO-064: the CLI names its usage for a malformed target request' (scripts/test-target-publish.mjs:1063), which received 'error: no main-branch control-plane worktree found' instead of the usage text. The same case passed in the 15:52 row.",
    "The launchpad checkout's reflog moves HEAD from main to planning/2026-10-03-release-close-finishes at 2026-10-03T16:03:15Z, 19 s before the rerun began; git worktree list then shows no worktree on refs/heads/main. node scripts/worktree.mjs publish WO-064 --target reproduces the message with exit 1.",
    "scripts/worktree.mjs:402 resolves mainWorktree (scripts/lib/git.mjs:121-128) for every action before the publish --target argument check at :458-467, although a target publish moves no launchpad branch. The ordering predates WO-185 and lies outside its surfaces; this repair changed neither file.",
    "At the refusal the operator chose 'Wait for main (Recommended)' over fixing the CLI in this order or recording criterion 8 unmet."
  ],
  "rejected": [
    {"option": "Fix the CLI ordering in WO-185", "reason": "It is outside the order's surfaces and the operator chose to wait."},
    {"option": "Record criterion 8 unmet now", "reason": "The operator chose to wait for a main-branch worktree and a passing complete row."},
    {"option": "Add a temporary worktree on main to satisfy the lookup", "reason": "Every DotLn tool would then find that worktree as the control plane, including the operator's planning session."},
    {"option": "Cite the 15:52 row alone", "reason": "The completion check correctly requires a row covering the current selection; that row lacks three selected suites."}
  ],
  "reopenWhen": "A main-branch worktree exists and the review gate still fails target-publish, or the follow-up changes the CLI's ordering before this order closes.",
  "followup": "Validate worktree publish --target arguments, and any action that needs no launchpad, before resolving the main-branch control-plane worktree in scripts/worktree.mjs, so usage errors and WO-064's usage test (scripts/test-target-publish.mjs:1063) do not depend on another worktree having main checked out. Reproduce with node scripts/worktree.mjs publish WO-064 --target while no worktree is on main."
}
```

The review gate's environment, not this repair's code, holds completion: the
same identity passed the full gate at 15:52 while the launchpad was on main.
Recording the defect keeps the order's scope and leaves its cause on a named
follow-up rather than in prose. The next `resume: fix` reruns
`npm test -- --review` once a worktree is on main, updates criterion 8's
line with that row and records repair-complete.

## WO-185-D017 — main integrated during repair at the operator's direction

<!-- integration refs/dotln/checkpoint/WO-185/10 -->

```json
{
  "id": "WO-185-D017",
  "date": "2026-10-03",
  "dispatch": "resume: fix; operator scope expansion 'scope expand: merge in main'; npm run worktree -- integrate WO-185",
  "reopens": {
    "decisionId": "WO-185-D016",
    "observation": "D016's hold ended: at this dispatch git worktree list shows /Users/dylanwood/Projects/DotLn on main at 340a67c9, and the complete npm test -- --review at the integrated identity passes target-publish with every other suite."
  },
  "decision": "Integrate main 340a67c9 into the uncommitted WO-185 worktree during repair, as the operator directed, through the canonical integration helper. Resolve the four authored conflicts from main's bytes plus this order's own change: retime skeleton 0.51.1 to 0.52.1, and let release preparation retime the application v0.65.1 to v0.66.1, under the recorded patch classification. Mint and select WO-185 authority revision 002 for the integrated bundle. Re-run both product gates and every affected check at the integrated identity instead of carrying the pre-integration rows forward. Keep docs/control/budgets.json and its basis unchanged after rechecking the basis against the integrated full run.",
  "evidence": [
    "The operator wrote 'scope expand: merge in main' while this dispatch was loading. Product 07 §Independent workflows and integration admits npm run worktree -- integrate in repairing, and the branch had no commits beyond its base 53fc6eb8, so the helper fast-forwarded to 340a67c9. That is 11 commits: WO-184 (#183: v0.66.0, compiler 0.25.0, skeleton 0.52.0, re-emitted harness and re-minted editions) and the WO-195 planning commits (#184). The helper then applied the retained named stash e847391360047f39d5ffb5809a84c3431f1bbf04 ('WO-185 integrate 2026-10-03'). Checkpoint refs/dotln/checkpoint/WO-185/10 holds the pre-integration tree. No branch commit was made.",
    "Preconditions: the one intent-to-add entry, scripts/fixtures/detached-descendant.c, was staged fully, as the helper requires. Intake was backed up with npm run backup:intake to the DotLn session scratch; it is three empty .gitkeep files and is unchanged after integration.",
    "Eleven paths changed on both sides, all generated projections, version surfaces or the edition selection: .claude/harness-manifest.json, README.md, docs/control/current.md, docs/evidence/current.json, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md, package-lock.json, packages/console/package.json and packages/skeleton/package.json. Main changed nothing under packages/kernel or corpus/, and nothing in scripts/test-runner.mjs, scripts/resume.mjs, scripts/harness.mjs or scripts/lib/plan-failures.mjs.",
    "Authored conflicts: packages/skeleton/package.json, packages/console/package.json and package-lock.json were resolved from main's bytes plus the skeleton retime 0.52.0 to 0.52.1. Against its base, the stash had changed these files only by the skeleton bump 0.51.0 to 0.51.1 and its pin. A first resolution took the stash side of all three files and so reverted main's compiler 0.25.0 pins to 0.24.0. It was redone from main's side before anything was staged, and the staged diff against main is the four skeleton version lines alone. docs/evidence/current.json took main's selection, and its authority entry was then moved to WO-185 revision 002.",
    "authority-evidence.mjs --check on the integrated tree failed with 'stale WO-184 revision 003 evidence: bundle-diff.json', because this order's role sentence changes the generated skills on top of WO-184's bundle. Running --write --edition WO-185 --revision 002 minted the new revision, leaving WO-184/003 and WO-185/001 untouched. --check then verified 35 bundle comparisons. Artifact-identity (WO-184/002) and verification evidence checked unchanged.",
    "Release preparation, run by the helper: 'Retimed WO-185: v0.65.1 → v0.66.1 above the observed release baseline v0.66.0' (local tag snapshot). It changed only the version label in the order title, README, meta.json and PR.md.",
    "These affected checks pass at the integrated identity: node scripts/harness.mjs check (32 generated surfaces), npm run release -- check-surfaces --local and npm run publication:check. npm run test:docs passed 24 of 24 with 24 fresh tasks (row 2026-10-03T16:36:11.515Z), feedback-evidence included.",
    "npm test -- --review passed 40 of 40 suites with 85 fresh tasks in 828780 ms at code identity c006d5cd65e391efb06fd75f5db91a6d8813123bb9d77ed44aa91df6f0cea06d (row 2026-10-03T16:50:16.684Z). The suites equal node scripts/test-runner.mjs --review --list at that identity. Among them, runner-fixtures runs scripts/test-host-guard.test.mjs, and target-publish passed because a main-branch worktree existed (repair-ver002-integrated-review.txt).",
    "Budget recheck (repair-ver002-integrated-gate-measurements.json): all 85 tasks record a peak. The largest is 694729064 bytes (worktree-integration), the gate peak is 1239508936 bytes, and the host peak is at most 1490693040 bytes (the guard's lifetime maximum, which did not rise during the gate). The 12, 24 and 32 GiB budgets are 18.55, 20.79 and at least 23.05 times those peaks. Runner sampling was 12831.6 ms, 1.548% of gate wall. Guard sampling was 8028.8 ms, 0.969%: the delta of the live guard's samplingCostMs between snapshots taken just before and just after the gate. The guard recorded no incident during the gate.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-host-guard.test.mjs passes 23 of 23 at the integrated identity in 36.5 s, with a bounded peak of 165705864 bytes (repair-ver002-integrated-host-fixtures.txt). That includes the held-endpoint, guard-straddle, docs-shaped-gate and late-signal fixtures, and VER-001 F1's double and triple forks.",
    "The unchanged wo102 files pass 24 of 24 in 10.09 s at the integrated identity, with a bounded peak of 765028760 bytes (repair-ver002-integrated-corpus.txt). The planted-drift runs of repair-ver002-corpus.txt carry forward because main changed no kernel or corpus path.",
    "The deadline diagnostics flagged as hits are the four planted sites the 15:52 passing row also records: skeleton worker-transport:process and three runner-fixtures sites in test-gate-deadlines.mjs. They are fixtures, not regressions.",
    "Session: Claude Code 2.1.288 (claude --version), claude-opus-5-5, effort xhigh read from CLAUDE_EFFORT (selected, not effective). No subagent was started (usage readback: 0 of 20). D002 remains this order's only economy experiment."
  ],
  "rejected": [
    {"option": "Defer integration to final review, the default in product 07", "reason": "The operator directed it now. Review selection also diffs against origin/main, so integrating lets the repaired subject's gate cover main as it stands."},
    {"option": "Keep WO-185 authority revision 001 or WO-184 revision 003 selected", "reason": "Neither matches the integrated bundle: 001 predates WO-184's skeleton changes, and 003 predates this order's role sentence."},
    {"option": "Overwrite an existing authority revision", "reason": "Recorded revisions are immutable evidence; a new revision preserves both histories."},
    {"option": "Keep skeleton 0.51.1", "reason": "Main already released 0.52.0. Retiming to 0.52.1 keeps the declared patch impact above the consumed version."},
    {"option": "Refresh the budgets.json basis to the integrated run", "reason": "Every integrated peak stays far within budget over four, and the existing basis is still a full review run on this host for the same WO-185 code. budgets.json is part of the gate's code identity, so editing it after the gate would stale the passing row without changing any budget."},
    {"option": "Rewrite reviewed commits or discard the integration stash", "reason": "Both histories and recovery material must remain available."}
  ],
  "reopenWhen": "An integrated check fails on a path main changed, an authored resolution changes behavior, contracts, authority or acceptance, a later advance of main needs another integration before close, or an integrated peak times four exceeds its budget."
}
```

Integration date: 2026-10-03. Original base: `53fc6eb8362cfdb76eb55f8bac9c2be3b5573e0b`.
Fetched main: `340a67c9797520213345ef6ba9c72bff8df2e0a1`. Checkpoint: `refs/dotln/checkpoint/WO-185/10`.
Named stash retained: `e847391360047f39d5ffb5809a84c3431f1bbf04` (WO-185 integrate 2026-10-03).
Resolved projections: README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-185: v0.65.1 → v0.66.1 above the observed release baseline v0.66.0. Files changed: docs/work-orders/WO-185-no-order-can-exhaust-the-host.md, README.md, docs/evidence/WO-185/meta.json, docs/final-reviews/WO-185/PR.md. Meter snapshot: docs/evidence/WO-185/meta.json, 3932 bytes. Tag observation: local snapshot only.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/package.json, packages/skeleton/package.json.

Carried-forward claims, judged by the executor at the integrated identity:

- Re-run here: criteria 1, 3 and 4 (`scripts/test-host-guard.test.mjs`
  23 of 23 under `harness bounded`, and again as runner-fixtures inside
  the passing review row);
  criterion 2 (the integrated row's peaks and sampling costs, and the
  budget recheck); criterion 5's unchanged-kernel control; criterion 8
  (both product gates).
- Carried forward with their original evidence, because main changed no
  path they rest on: criterion 5's planted-drift runs; criterion 6's
  confirmation record; criterion 7's write-backs, which this integration
  did not touch apart from re-emitting the same role sentence into the
  generated skills.
- A later integration at final review assesses only what main changes
  after `340a67c9`.

The integration serves the shared-host mission without widening the order:
the repaired guard and runner are now judged on the tree they will merge
into. Against the eight traps:

- **Seeking the wrong goal.** The target is that the repaired subject holds
  on current main. That is why both product gates were re-run here rather
  than citing pre-integration rows.
- **Rule beating.** No stale edition was restored to pass a check. A new
  revision records the integrated bundle.
- **Drift to low performance.** The budget basis was rechecked against the
  integrated run, not assumed.
- **Success to the successful.** The 15:52 row did not stand in for the new
  identity.
- **Shifting the burden.** The merge, its resolutions and the retime are
  finished here, not left as chores for final review.
- **Escalation and policy resistance.** No refusal, approval or surface was
  added.
- **Commons.** The checks ran one at a time, and the gate took its lanes
  from the shared count.
- **Naive Interventionism.** No code, budget or ownership rule changed.
- **NoOp.** The order would wait on D016 while main moved further away from
  it.

## WO-185-D018 — final review finding: a runner budget stop records before it kills, and a failed ledger write ends the runner with the task alive

```json
{
  "id": "WO-185-D018",
  "date": "2026-10-03",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 and return this finding to repair. In scripts/lib/process-monitor.mjs the task-scope breach (lines 155-175) and the gate-scope breach (lines 95-109) call appendIncident before task.fail. appendIncident (scripts/lib/host-resources.mjs:453-479) makes three unguarded file writes: the host incidents.jsonl, latest-incidents and the checkout's memory-incidents.jsonl. observe runs from a setInterval tick (process-monitor.mjs:181-189) with no try around that step, and the runner installs no uncaughtException handler. A throwing write therefore ends the runner before the over-budget group is killed or a typed row is written. The reviewer does not write the fix.",
  "evidence": [
    "Reproduced under node scripts/harness.mjs bounded on this host (Darwin 27.0.0, arm64, 51539607552 physical bytes), with a scratch repository whose docs/control/local is a regular file and a private host directory with no guard. One executeSuite task ran a Node allocator that touches 8 MiB buffers up to 256 MiB and exits by itself after 6 s, under a 67108864-byte task budget with 50/100-ms intervals.",
    "The runner printed Error: ENOTDIR ... mkdir '<scratch>/repo/docs/control/local/harness' at appendIncident (scripts/lib/host-resources.mjs:471:5) at observe (scripts/lib/process-monitor.mjs:173:11) at Timeout.tick (process-monitor.mjs:187:5), and exited with code 1.",
    "The private host ledger holds the first write: memory-budget, scope task, process node, budget 67108864, measured peak 81086384. The task was never failed or killed by the runner.",
    "The allocator (pid 76079) was still alive when the runner died. The outer bounded wrapper's survivor sweep named it (surviving-process [{pid:76079,name:node}]) and killed it 9 ms after the runner's exit. In a gate the runner is the outermost supervisor: only the shared guard, if live, would stop the group, at its next census.",
    "Contrast: the guard evaluates killOwned inside the incident object before appendIncident (scripts/host-guard.mjs:430 and 475), and a throw there is caught by its loop."
  ],
  "alternatives": [
    "Pass and board the ordering as a follow-up",
    "Write the reordering during review and certify it",
    "Fail with the reproduced finding and route it through repair and fresh verification"
  ],
  "rejected": [
    {"option": "Pass and board the ordering as a follow-up", "reason": "The defect lies in the order's declared surfaces and in the stop path that is the order's purpose. The Objective requires a typed, recorded failure. A full disk or an unwritable checkout is plausible in the very memory-exhaustion event the order targets, because swap grows on the boot volume."},
    {"option": "Write the reordering during review and certify it", "reason": "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it."}
  ],
  "followup": "WO-185 resume: fix — in scripts/lib/process-monitor.mjs, kill and fail the task, and on a gate breach every task, before any incident, registration or lease write. Make each record write unable to end the runner: on failure, keep the typed row and report that the ledger was unavailable. Apply the same rule to the onMembers registration writes that run before the budget check. Pin it with a fixture whose checkout ledger cannot be written, asserting that the task row is memory-budget, no descendant survives and the runner records its gate row.",
  "goalAlignment": "Mission: an automatic, typed stop replaces operator rescue. Shifting the burden: a crash before the kill hands the live group back to the guard or the operator. Rule beating: the passing fixtures all run with a writable ledger, so they cannot see this path. Fixes that fail: recording before killing makes the record a precondition of the stop. Naive Interventionism bounds the response to reordering and guarding writes in one module, with no new mechanism. NoOp ships a stop that a failed write disables.",
  "reopenWhen": "A repaired subject passes a fixture with an unwritable checkout ledger, the task is stopped with a typed row and no survivor, and a fresh verification judges it."
}
```

## WO-185-D019 — final review finding: the wo102 tests decode the manifest, so a quarantine with a nonfinite value no longer round-trips

```json
{
  "id": "WO-185-D019",
  "date": "2026-10-03",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 and return this finding to repair. This order changed the manifest readers in corpus/harness/wo102-properties.test.mjs, wo102-replay.test.mjs and wo102-generators.test.mjs from JSON.parse to decodeNumbers(JSON.parse(...)). Live findings keep nonfinite numbers as tagged {$number} objects: inspectRow and inspectPurity store vector, expected and actual through encodeNumbers. The generator writes manifest.findings with those tags (generate-cadence-corpus.mjs:170). Decoding turns the tags into raw NaN or ±Infinity, which the canonical digest and the kept-row comparison treat as different values. A quarantine the generator writes at a kernel then fails the wo102 tests at the same kernel. At the base, the JSON.parse reader accepted it. This is VER-001 F3's rule, \"A corpus the generator writes is accepted by the wo102 tests at the same kernel\", broken for any finding that carries a nonfinite value, and it meets D012's reopen condition, \"A same-kernel corpus round trip fails\".",
  "evidence": [
    "Reproduced under node scripts/harness.mjs bounded (184 ms, peak 151489904 bytes). A planted constant-output evaluator over grid row cadence-000169 (its vector carries a nonfinite number) gives one numbered finding through findingsCollector. The probe writes {findings: kept} exactly as the generator does, JSON.stringify(encodeNumbers(manifest), null, 2), and reads it back two ways.",
    "Read back with decodeNumbers(JSON.parse(bytes)), as the current tests do: assertFindings rejects it. Totals are equal at 1; digests differ, eb3b401a... against 678138c6....",
    "Read back with JSON.parse(bytes), as at the base: assertFindings accepts it.",
    "Control: the same drift on finite row cadence-000001 is accepted by both readers.",
    "The finding can arise without a nonfinite input. A drift that yields NaN or Infinity in a finite row's output stores it in actual as a tag too.",
    "The committed manifest holds no findings today, so the defect is latent. No gate row detects it, and criterion 5's unchanged-kernel and planted-drift runs both pass."
  ],
  "alternatives": [
    "Pass and board the regression as a follow-up",
    "Fail with the reproduced finding and route it through repair and fresh verification"
  ],
  "rejected": [
    {"option": "Pass and board the regression as a follow-up", "reason": "This order introduced the regression in its own declared surface, corpus/harness/, against a rule its earlier repair claimed to hold (D011, D012). Product 07 returns such an acceptance defect through repair; a reviewer does not write it."}
  ],
  "followup": "WO-185 resume: fix — make the wo102 manifest readers compare findings in the encoding the sweep produces: do not decode manifest.findings, or re-encode them before assertFindings. Add a fixture that writes a quarantine of at most 32 findings, at least one carrying a nonfinite value, through buildCorpus's encoding and asserts that all three wo102 files accept it at the same kernel. Keep VER-001 F2's nonfinite discrimination.",
  "goalAlignment": "Mission: bounded drift alarms whose quarantine remains a reproducible record. Rule beating: the empty manifest lets every gate pass without the round trip ever running. Drift to low performance: a quarantine that its own tests reject trains operators to ignore drift alarms. Naive Interventionism: change only the readers and add one fixture, with the digest, the helper and the refusal unchanged. NoOp ships a latent regression that the next small drift would expose.",
  "reopenWhen": "A repaired subject passes the nonfinite round-trip fixture and the existing wo102 suite, and a fresh verification judges it."
}
```

## WO-185-D020 — final review finding: `harness bounded` cannot run ordinary commands as the role sentence directs

```json
{
  "id": "WO-185-D020",
  "date": "2026-10-03",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 and return this finding to repair together with D018 and D019. scripts/lib/bounded-command.mjs runs a probe through executeSuite unchanged, so it inherits the suite runner's test-glob expansion (scripts/test-runner.mjs expand, about lines 832-840) and its suite environment allowlist. The generated role sentence sends every probe outside a gate through this wrapper, and the Design says the wrapper applies the task budget and prints the typed stop, not that it changes the command.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node -e \"console.log(2*3)\" printed Unsupported test glob: console.log(2*3) and bounded-result {failureKind:setup, exitCode:1}; the command never ran. Any argument containing an asterisk that does not begin with -- fails this way, for example find -name '*.mjs'.",
    "FOO=visible node scripts/harness.mjs bounded -- printenv FOO exited 1 with no output: the probe's environment is reduced to the suite allowlist.",
    "D008 met the same expansion inside the order's own fixture and worked around it with a numeric constant; the wrapper was left with the behaviour."
  ],
  "alternatives": [
    "Board the fidelity gap as a follow-up",
    "Return it to repair with D018 and D019"
  ],
  "rejected": [
    {"option": "Board the fidelity gap as a follow-up", "reason": "The wrapper is a declared deliverable of this order, and the repair cycle D018 and D019 require is already open. Policy resistance: a wrapper that refuses ordinary commands pushes agents back to unwrapped probes, which is how the 2026-10-01 incident began."}
  ],
  "followup": "WO-185 resume: fix — run a bounded probe's argv verbatim (no test-glob expansion) with the caller's environment, plus only the supervision variables the runner needs. Keep the 15-minute deadline and the output tail, or state them in the usage text. Add fixtures for an asterisk argument and an inherited variable through the real CLI.",
  "goalAlignment": "Mission: an agent's probe is bounded without changing what it does. Escalation and policy resistance favour a faithful wrapper over another refusal. Naive Interventionism: change only the probe path, leaving gate suites' expansion and environment unchanged. NoOp leaves the role sentence pointing at a wrapper that fails ordinary commands.",
  "reopenWhen": "A repaired wrapper runs both fixtures through the CLI with the command's own result, and a fresh verification judges it."
}
```

## WO-185-D021 — final review: lower findings and observations for the repair to dispose

```json
{
  "id": "WO-185-D021",
  "date": "2026-10-03",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Return these items to the same repair. Each is fixed within the order's surfaces or recorded as left with its own follow-up; none is to stay only as report text. Items 1-3 were confirmed from source by this review. Items 4-12 come from read-only review agents; the root session checked the code fact where it is stated, and none was reproduced.",
  "evidence": [
    "1 (confirmed). scripts/test-runner.mjs runner-fixtures sources (lines 222-236) list scripts/fixtures/memory-growth.c but not scripts/fixtures/detached-descendant.c. An edit to that fixture alone does not select runner-fixtures under --review.",
    "2 (confirmed from source). The lane fixture in scripts/test-host-guard.test.mjs (lines 806-870) counts 4 lanes per gate. A build row reserves min(4, floor(availableParallelism()/2)) lanes (test-runner.mjs:1741-1750 and reservedSlots), so on a host with fewer than 8 logical CPUs two gates overlap legally, and the fixture fails on peak and WAIT for the wrong reason.",
    "3 (code confirmed; grouping observed). A guard stop of a bare session child names the process-group leader (scripts/host-guard.mjs:342-344 and 464-466). In this Claude Code session the Bash tool's zsh (78525, parent 49224) leads its own group and its child shares it, so a real bare allocation would be named zsh. The fixture passes only because its allocator is spawned detached, leading its own group. The checkout ledger drops killedProcesses (host-resources.mjs:472).",
    "4 (code confirmed). The guard sets baselineSwap only once in its life (host-guard.mjs:103); the runner's monitor is per gate, so its baseline starts fresh with each gate. Once swap grows 128 MiB past a long-lived guard's start, every 500-ms tick takes a full footprint census. Criterion 2's guard cost was measured over a gate from 16:36Z to 16:50Z on a guard started at 15:38:25Z; steady-state cost after swap growth is unmeasured.",
    "5. Guard and runner can both append a memory-budget row for one breach, including a guard row with killedProcesses [], so localMemoryStops can over-count. Not reproduced; narrow timing.",
    "6. A kill error other than ESRCH (for example EPERM) thrown inside the guard's incident construction loses that incident and skips the remaining candidates for that pass; the loop logs each message once.",
    "7. killOwned (host-resources.mjs:433-450) signals each member's census-time pgid. A member that calls setsid between the census and the kill survives and is still listed as killed.",
    "8. Diagnostic retention keeps stdout lines matching an unindented not ok, Error:, AssertionError or DIAGNOSTIC (test-runner.mjs about 998-1010). An indented subtest failure in the dropped head of TAP output may lose its name and message; no fixture covers the stdout path (VER-001 noted this).",
    "9. A nested gate re-looks up its inherited lease per task through inheritedHostLease, which returns null on any census error, so a nested gate can draw from the top-level pool and wait until the outer task's deadline.",
    "10. After an operator signal, a later resource gate failure can still record a failing row, because the stopping() && !resourceGateFailure guards are bypassed: D005's two rules meet in a narrow race.",
    "11. The gate-scope memory stop carries no process field (process-monitor.mjs:96-104), unlike task stops.",
    "12. Test hygiene: the escape and hang fixtures start never-exiting processes with no t.after kill if the behaviour regresses; the CLI fixtures use the real per-user host directory (the real guard and host incidents.jsonl, not the checkout ledger); the criterion 1 ceiling assertion compares with one eighth of physical memory, while the fixture's own self-limit is 240 MiB."
  ],
  "rejected": [
    {"option": "Fail on items 4-12 alone", "reason": "None is reproduced, and several are narrow races or test hygiene. They ride on the repair that D018-D020 already require."}
  ],
  "followup": "WO-185 resume: fix — dispose of D021 items 1-12. Fix items 1-3 within the order's surfaces: add the fixture source; size the lane fixture from the runner's reservation; name the growing process, or the largest member, in bare stops while keeping the group kill. For each of items 4-12, fix it within the bound or record it as left in a decision with its own follow-up and reopen condition.",
  "goalAlignment": "Scale detail to consequence: three confirmed items and nine unconfirmed ones bundled into the already-open repair, rather than one repair or follow-up per item. Commons: no new verification cycle is spent on them alone. NoOp would leave confirmed selection, portability and naming gaps in the order's own fixtures and guard.",
  "reopenWhen": "Each item is fixed with a fixture or recorded as left with its own follow-up, and a fresh verification judges the repaired subject."
}
```

## WO-185-D022 — correction: FINAL-001's document-gate sentence

```json
{
  "id": "WO-185-D022",
  "kind": "correction",
  "date": "2026-10-03",
  "dispatch": "resume: final review; FINAL-001",
  "misread": "FINAL-001's criterion 8 line says that the result transition runs npm run test:docs inline. The reviewer's final-review-result fail transition ran no document gate: the gate index records only its git diff --check row (2026-10-03T17:56:40.001Z) after the review's npm test row.",
  "meant": "Criterion 8 rests on a passing npm run test:docs row at the reviewed subject, either inline or recorded separately.",
  "changed": "The reviewer ran npm run test:docs after the transition: 24 passed, 0 failed, 40.84 s, 24 fresh tasks. The row was recorded 2026-10-03T17:57:44.588Z at code identity c006d5cd65e391efb06fd75f5db91a6d8813123bb9d77ed44aa91df6f0cea06d, tree fc34e2c4. That identity is FINAL-001's, so criterion 8's met judgment stands on that row. FINAL-001 is filed and hashed into its FinalReviewCompleted event, so its text is not edited; this decision corrects the sentence.",
  "decision": "Keep FINAL-001 as filed, with its fail verdict and criterion judgments unchanged, and record this correction with the evidence row.",
  "evidence": [
    "npm run resume -- final-review-result fail printed only the index refresh, the failure message and the effort note.",
    "docs/control/local/harness/checks.json rows after 17:40Z: npm test 0 at 17:48:54.797Z; git diff --check 0 at 17:56:40.001Z; npm run test:docs 0 at 17:57:44.588Z."
  ],
  "rejected": [
    {"option": "Edit the filed FINAL-001 text", "reason": "Its bytes are hashed into the recorded FinalReviewCompleted event, and a filed report is never edited."},
    {"option": "Use the correct off-ramp", "reason": "That route covers a wrong attestation, report path or checkpoint, not a sentence of report prose."}
  ],
  "reopenWhen": "A later reading shows the 17:57:44.588Z row did not judge the reviewed code identity."
}
```

## WO-185-D028 — VER-004: residual low-severity observations in the repaired guard and runner, left with a follow-up

```json
{
  "id": "WO-185-D028",
  "date": "2026-10-04",
  "dispatch": "resume: verify; VER-004",
  "kind": "finding",
  "decision": "Pass VER-004 and record these items as left, with one follow-up. None breaks a criterion, prevents a kill, leaves a survivor or changes a typed stop into an untyped one. Each is confirmed from source by the verifying session, and none was reproduced. The fixes are small and lie in the order's declared surfaces. A further repair cycle for them alone would cost one more repair, verification and full gate, which D021's precedent declined for narrow, unreproduced items.",
  "evidence": [
    "1 (confirmed from source, low). scripts/host-guard.mjs marks a stopped candidate's members from incident.killedProcesses (the monitor-unavailable and memory-budget branches), not from candidate.members. killOwned leaves out protected PIDs (gate runners, session roots) and members already gone at its revalidated census. A later candidate in the same pass that shares those members therefore fails candidate.members.every(killed.has) and can write a second incident and send a second SIGTERM to the runner. In the common case (a host-scope stop followed by its own gate's scope), both rows share one stopId, and plan failures counts the stop once, as D025 item 5 intends. A member that exits between the census and the kill can, however, give a nested task candidate a second incident with a different stopId, which is then counted twice.",
    "2 (confirmed path, timing-dependent, low). scripts/test-runner.mjs terminateGate classifies a signal as a resource stop only through incidentForProcess, a read of the host latest-incidents file. The repaired final checks are stopping() && (interrupted || !resourceGateFailure). If the runner's own monitor has already set resourceGateFailure and its latest-incidents write failed (now non-throwing under D023), a later SIGTERM (from the guard) or an operator signal is classified as interrupted, and the gate records no row. The kill has already happened, and the checkout memory-incidents ledger still holds the typed stop if writable. The window is from the monitor's gate stop to row recording (the task finish timers, about 100 ms, plus aggregation). Criterion 3 requires no row for an operator signal, so only a guard-originated SIGTERM is misattributed.",
    "3 (not introduced by the repair, low). runGateChecks already looked up inheritedHostLease once at entry for its slot count. D025 item 9 now passes that result to every acquire. A transient census failure at entry inside a nested gate therefore makes the whole nested gate allocate top-level, where before each acquire looked up again. Overall exposure is one correlated lookup instead of one per task. The trigger is speculative.",
    "4 (confirmed from source, low). killOwned no longer throws on a denied signal; it reports through onError, which in process-monitor finish() and stopTasks() is the default console logger. The catch blocks there no longer attach monitor-unavailable with the denial. The task still fails as surviving-process if a member survives, and the signal path records no row by design, so only the denial detail on the row is lost.",
    "5 (confirmed from source, cosmetic). A failed task-registration withdrawal sets failure, which the row reports as failureKind launch. Other post-run observation failures in executeSuite use the same convention.",
    "Checks that held, from source with the audit agent and the root session: kill precedes every record write in both monitor scopes; appendIncident catches each of its three destinations, including serialization; onMembers runs after the budget check inside a try; the runner's fail and onGateFailure callbacks cannot throw; the guard's largest-member reduce is unreachable with no members; readCorpusManifest's encoded findings render the same bytes as the generator; a parentLease of null versus undefined is handled correctly.",
    "Executable evidence from this verification: FINAL-001's ledger-failure driver now yields a typed memory-budget row with recordingUnavailable and no survivor; all 34 host-guard fixtures pass in 64.82 s; the three wo102 files fail the planted Backoff drift within the 805306368-byte budget and pass unchanged in the gate row at this identity."
  ],
  "alternatives": [
    "Fail VER-004 and return these items to repair",
    "Pass and leave them only as report text",
    "Pass and record them here with one follow-up"
  ],
  "rejected": [
    {"option": "Fail VER-004 and return these items to repair", "reason": "None breaks a criterion or the stop path the order exists for, and none is reproduced. D021 declined to fail on narrow unreproduced items alone. Commons: another repair, verification and full gate for audit duplication, labels and one ledger-failure race."},
    {"option": "Pass and leave them only as report text", "reason": "Product 07 and the verifier role require a met, unfixed defect to be recorded with a named follow-up."}
  ],
  "followup": "WO-185 residuals (guard and runner bookkeeping): in scripts/host-guard.mjs mark every revalidated-absent or protected member of a stopped candidate as handled, so one pass never writes a second incident for a stopped tree; in scripts/test-runner.mjs terminateGate treat a signal that arrives after the runner's own in-memory resourceGateFailure as part of that resource stop, independent of the latest-incidents file; attach killErrors to finish() and stopTasks() rows; give a registration-withdrawal failure its own failureKind; and consider re-validating an inherited lease once after a failed entry lookup inside a nested gate. Pin each with a deterministic fixture.",
  "goalAlignment": "Mission: automatic, typed stops that hold when the host is failing. All eight traps were compared. Seeking the wrong goal and rule beating: judge the stop path, which holds, not row tidiness. Shifting the burden: no item hands a live tree back to an operator. Tragedy of the commons and escalation: a full repair cycle for these alone spends more shared host and review time than the risk warrants. Drift to low performance and success to the successful: recording them, rather than letting a pass hide them, keeps the bookkeeping accurate. Policy resistance: no new refusal or mechanism. Naive Interventionism: a verifier writes no behavioural fix. NoOp would leave them unrecorded.",
  "reopenWhen": "A plan failures count exceeds the stopped trees it reports, a guard-originated SIGTERM ends a gate as an operator stop with no row, a nested gate waits on its own parent's lanes, or a later order edits these guard or runner paths."
}
```

## WO-185-D029 — correction: the unchanged wo102 files run in no gate

```json
{
  "id": "WO-185-D029",
  "kind": "correction",
  "date": "2026-10-04",
  "dispatch": "resume: final review; FINAL-002",
  "misread": "FINAL-001's criterion 5 line says that the unchanged wo102 files pass inside that review's gate, and VER-004's says that all three pass unchanged in the gate row at its identity. No gate suite runs them. scripts/test-runner.mjs names corpus/harness/wo102- only as a machinery source of runner-fixtures, and no nodeTests entry selects the three files. The only gate coverage is the runner-fixtures case that copies them beside a generated nonfinite quarantine and runs them at that copied kernel.",
  "meant": "Criterion 5's 'passes unchanged on the unmodified kernel' rests on a direct run of the three files at the subject. The corpus lanes are manual by design, as FUP-069dff5d52d98e0d records.",
  "changed": "FINAL-002 ran the three files directly at code identity 85cce5d52bf2d7309145878f6574ee3896c54eba582ffe864c69a2bba47be1cc, one at a time, each under harness bounded --budget-bytes 805306368. properties passed 3/3 at a 258,506,912-byte peak in 1.74 s; generators passed 8/8 at 787,393,208 bytes in 10.26 s; replay passed 13/13 at 230,798,664 bytes in 1.23 s. FINAL-002 states the gate's coverage correctly. FINAL-001 and VER-004 are filed and hashed into their completion events, so their text is not edited.",
  "decision": "Keep criterion 5 met on direct runs: the executor's repair-final001-corpus.txt (24/24) and FINAL-002's own run at the reviewed identity. The two filed reports keep their verdicts; their criterion 5 judgments also rest on direct drift runs, which do not depend on the misstated sentence.",
  "evidence": [
    "grep -rn wo102 over scripts/*.mjs, scripts/lib/*.mjs and the package manifests finds only scripts/test-runner.mjs:237, the machinery-source prefix.",
    "scripts/test-host-guard.test.mjs:2063, 'a generated quarantine with nonfinite findings passes all three wo102 files', copies the files and the kernel into a fixture repository and plants a NaN result before running them.",
    "FINAL-002's npm test -- --again --review transcript names wo102 only in that fixture's subtest line."
  ],
  "rejected": [
    {"option": "Edit the filed FINAL-001 and VER-004 text", "reason": "Their bytes are hashed into recorded completion events, and a filed report is never edited."},
    {"option": "Add the three files to a gate suite in this review", "reason": "The corpus lanes run outside every gate by their orders' design (FUP-069dff5d52d98e0d), the generators file alone takes about 10 s near an 805 MB peak, and a reviewer does not change the gate's selection."}
  ],
  "goalAlignment": "Seeking the wrong goal and rule beating: a claim that a gate covers something must match what the gate runs. Drift to low performance: an uncorrected sentence would teach later roles that the gate guards the corpus lane. Commons: the direct run cost about 13 s. NoOp would leave two filed reports overstating gate coverage.",
  "reopenWhen": "A later reading shows a gate suite that runs the three unchanged files at this identity, or a later report again cites the gate for them."
}
```
