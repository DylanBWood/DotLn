# WO-222 decisions

## WO-222-D001

```json
{
  "id": "WO-222-D001",
  "date": "2026-10-19",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.86.0, the next minor above the observed release baseline v0.85.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.85.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-222-the-complete-run-fits-the-machine.md"
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

## WO-222-D002

```json
{
  "id": "WO-222-D002",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Preserve the observed baseline and all current cases rather than treating the order's estimates as executable facts. The main checkout's three latest passing complete review rows are the before series; the new worktree has none. They are three different historical code identities, which before.json keeps separately. The order says 38 target-worktree tests; the checked base contains 39 declarations registering 60 case names after parameter expansion. Every original case-body line moved exactly once and all 60 names are retained. The order also describes the measurement script as three runs, but its implementation required five; new schema 2 series execute the three runs criterion 5 requests, while schema 1 checks retain their five-run contract.",
  "evidence": [
    "readGateChecks: passing complete review rows recorded 2026-10-19T03:15:23.923Z, 07:55:04.693Z and 10:58:31.828Z; before median 2538373 ms; largest task peak RSS 1509638144 bytes.",
    "The registration-only collector over the original scripts/test-target-worktree.mjs and each split file reports the same 60 names; source relocation accounts for all 4133 original case/helper-body lines exactly once.",
    "scripts/measure-gates.mjs at activation: schemaVersion 1, runs.length 5 and ordinal <= 5."
  ],
  "rejected": [
    {
      "option": "Trim the case inventory to the stated 38",
      "reason": "The order requires every base case; its numeric description is stale."
    },
    {
      "option": "Run five after attempts",
      "reason": "Criterion 5 and the accepted cost explicitly require three."
    }
  ],
  "reopenWhen": "The observed source or baseline selection is shown to omit a required case or a more recent passing complete review row at activation."
}
```

## WO-222-D003

```json
{
  "id": "WO-222-D003",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "The scheduler reads a frozen projection of before.json in scripts/lib/gate-scheduling-baseline.json: each baseline row's maximum task RSS and the latest sample of each task. Product tasks must not read the active order's protected evidence, so they do not read before.json. The structural host check compares gateBytes divided by recorded capacity with the maximum measured peak. The first acquirer records host capacity under the existing lane lock, and later acquirers inherit it. Legacy taskShare and hostLanes budget keys cannot override this derivation; current and exported budget templates omit them. Shared files use an explicit group limit of two so target-worktree and the existing launchpad split stay bounded when capacity rises to eight.",
  "evidence": [
    "docs/evidence/WO-222/before.json; scripts/lib/host-resources.mjs, host-lanes.mjs and test-runner.mjs at activation.",
    "Executor role and product 07 protect the active evidence record from product-task reads.",
    "The original launchpad split held two slots per file under four lanes; increasing capacity alone would admit all three files concurrently."
  ],
  "rejected": [
    {
      "option": "Read the live evidence directory from product tasks",
      "reason": "It violates the existing evidence-read boundary."
    },
    {
      "option": "Honor an old fixed four-lane budget override",
      "reason": "The work order requires a host observation, and an exported configuration must remain portable."
    }
  ],
  "reopenWhen": "A later measurement changes a task classification or required peak, or an exported instance needs a distinct measured baseline."
}
```

## WO-222-D004

```json
{
  "id": "WO-222-D004",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.86.0 locally and bump @dotln/skeleton from 0.61.0 to 0.62.0 for the expanded deadline capacity contract. Update the console's internal skeleton dependency and lockfile without changing the console's own version because its runtime behavior is unchanged. Keep the harness-host version, all other component versions and publication controls unchanged. The three scheduling levers are provisional until the three-run series meets criterion 5; a rejected lever will be reverted and the classification reassessed.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.86.0 above local v0.85.0.",
    "packages/skeleton/src/gate-deadlines.mjs now accepts scheduler declarations above four under the recorded capacity; packages/console/package.json pins the skeleton workspace."
  ],
  "rejected": [
    {
      "option": "Bump every component",
      "reason": "Only the skeleton package has changed behavioral sources."
    },
    {
      "option": "Accept the speedup estimate before measurement",
      "reason": "The after median and task deadlines decide whether the changes ship."
    }
  ],
  "reopenWhen": "The measured series rejects a contract-changing lever, or another component gains a behavior change before handoff."
}
```

## WO-222-D005

```json
{
  "id": "WO-222-D005",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Read measurement deadline samples from the recorded gate row, retaining successful samples when DOTLN_GATE_MEASURE_DEADLINES=1. Ordinary runs retain only deadline hits. The initial measurement path matched the runner but violated the configuration-root rule against a new literal document root; the executor's initial dismissal of the worker's path uncertainty was incomplete. The gate now binds timeline and deadline observations together without a second path derivation. Also correct the README's labels: critical-path work and wait are not total task work and scheduler idle.",
  "evidence": [
    "The first complete npm test -- --review row, recorded 2026-10-19T15:08:13.650Z, failed configuration-root after 13283 ms and named scripts/measure-gates.mjs's literal diagnostics path.",
    "runGate already reads its deadline log into deadlineDiagnostics but originally filtered it to hits; measurement mode now retains all samples. The new runner fixture compares recorded successful deadline rows with the executed task timeline and checks the normal-mode exclusion.",
    "The design worker found the README table's two mislabeled criticalPath fields; self-review.md records the correction and both workers' counts."
  ],
  "rejected": [
    {
      "option": "Add an exception for a duplicated literal diagnostics path",
      "reason": "The recorded gate row can carry the exact observations without a second filesystem contract."
    },
    {
      "option": "Retain all successful deadline samples in ordinary runs",
      "reason": "Only the explicitly requested measurement series needs that additional record volume."
    }
  ],
  "reopenWhen": "A future runner no longer records the deadline observations required by measurement acceptance, or the measured record volume requires a separately bound sample artifact."
}
```

## WO-222-D006

```json
{
  "id": "WO-222-D006",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Publish the measurement fields without machine-local diagnostics. Apply the same projection to the three before rows and to each after row; keep identities, timing, memory, peers and task observations, while omitting temporary product-read paths, host-holder details, raw output and duplicate raw deadline samples. Keep the originals in the local gate index and the measurement's local attempt logs. No timing or memory value is changed by projection.",
  "evidence": [
    "A field-only scan of before.json found 258 local-path values, all in taskTimeline.productReadLog; those fields do not establish any acceptance measurement.",
    "scripts/measure-gates.mjs exports measurementGate; its fixture checks exact preservation of the measured fields while excluding synthetic local diagnostics.",
    "The second complete review row, recorded 2026-10-19T15:20:46.782Z, passed 83 executed tasks and failed runner-fixtures on an invalid Unicode regex escape in the new case collector. The escape is removed; edited module syntax is checked before the next complete run."
  ],
  "rejected": [
    {
      "option": "Copy the full local diagnostic records into committed measurement evidence",
      "reason": "Temporary file paths and raw output add no timing claim and do not resolve on another checkout."
    }
  ],
  "reopenWhen": "A later analysis needs an omitted observation to establish a measurement claim; add a portable bound projection rather than a machine-local path."
}
```

## WO-222-D007

```json
{
  "id": "WO-222-D007",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Calculate task, bounded-command and guard-registration memory limits from the capacity recorded in the host directory that entry point uses. A caller selecting a private registry must not silently divide its gate share by the default registry's capacity. The CLI containment fixture records its intended four-lane capacity in its second private registry as well. Extend the existing detached-descendant fixture to assert the wrapper and child budgets before checking the surviving-process refusal.",
  "evidence": [
    "The third complete review row, recorded 2026-10-19T15:28:16.942Z after 140476 ms, failed one of runner-fixtures' 207 tests: the detached-descendant wrapper was killed at 33554432 bytes instead of reaching its surviving-process result. The other 206 tests passed, including the new scheduler, overlap, measurement and case-inventory fixtures.",
    "executeSuite selected the fixture's four-lane hostDirectory but called memoryBudgets without that directory's recorded capacity, so it used the default eight-lane registry. Additional inputs inspected: scripts/lib/bounded-command.mjs and scripts/lib/host-guard-state.mjs; their explicit-directory entry points had the same lookup pattern.",
    "The focused reproduction of double and triple forks passed after the fix (2026-10-19T15:31:49Z); wrapper and child both reported 67108864-byte budgets and the detached process was refused as a surviving process."
  ],
  "rejected": [
    {
      "option": "Increase the fixture's budget to hide the registry mismatch",
      "reason": "It would preserve inconsistent capacity and memory observations."
    }
  ],
  "reopenWhen": "An entry point gains a distinct registry selection mechanism; its capacity and memory lookup must continue to use that same selection."
}
```

## WO-222-D008

```json
{
  "id": "WO-222-D008",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Run the historical v0.81.0 README upgrade fixture's CLI commands with their standalone deadline environment. Remove only the current scheduler's load declaration from that case's child environment; retain inherited host reservations, memory enforcement and the outer task deadline. The archived parser predates capacities above four. Also include docs/control/budgets.json in the expected rewritten seeds because this release intentionally removes fixed taskShare and hostLanes defaults. Every upgrade step and assertion remains.",
  "evidence": [
    "The fourth complete review row, recorded 2026-10-19T15:50:30.938Z after 908062 ms, failed launchpad-planning when the archived v0.81.0 export rejected DOTLN_GATE_CONCURRENCY=8. Runner fixtures, harness fixtures and process-debt passed.",
    "The focused reproduction advanced past the archived export and exposed the expected seed-list update. The budget-template diff removes taskShare and hostLanes; starter refresh therefore correctly reports docs/control/budgets.json as rewritten.",
    "The focused historical upgrade case passed at 2026-10-19T15:56:49.480Z in 39388 ms under a shared, eight-lane parent declaration, with a 3221225472-byte memory budget."
  ],
  "rejected": [
    {
      "option": "Clamp the inherited peer declaration to four",
      "reason": "That would misstate the parent's actual capacity. The documented standalone procedure needs no scheduler declaration."
    },
    {
      "option": "Isolate the entire launchpad-planning suite",
      "reason": "The incompatibility belongs to the archived parser, and does not justify a new scheduling restriction on the current suite."
    }
  ],
  "reopenWhen": "The historical upgrade fixture intentionally exercises an old scheduler under a current declaration; that scenario needs an explicit compatibility contract instead of the standalone README procedure."
}
```

## WO-222-D009

```json
{
  "id": "WO-222-D009",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator reports planner contention, then prioritizes uninterrupted gate completion",
  "decision": "Continue the required complete review and measured series uninterrupted under the operator's latest direction. A temporary operational guard stopped this worktree twice when the named planner instance requested the host; that made the planner responsive but discarded complete-run progress. The operator then explicitly directed that other work may wait and that stopping and starting was not improving overall progress. The guard is stopped. Record fair cross-gate admission as a separate follow-up; this order's measurements still judge its declared scheduling levers.",
  "evidence": [
    "The operator reported that this session's gate blocked a document gate, identified the planner instance, then clarified that running gates is the purpose of this order.",
    "The instance's passing document row at 2026-10-19T16:24:21.663Z lasted 1559852 ms, including 1554557 ms waiting for kit-verify's four-slot lease. Elapsed time excluding that wait was 5295 ms. Its last wait observation named this run's two-slot vertical judgment task.",
    "This worktree's fifth complete review was stopped through harness evidence --stop at 2026-10-19T16:24:16.197Z after 1579894 ms. Its completed tasks remain in a stopped row; no pass was supplied. The host registry then showed zero live leases for this worktree.",
    "The current instance uses the prior fixed-four host-lane reader and asks for all four lanes for kit verification. This branch records eight-lane capacity. Both readers share the registry; the older reader waits while any other top-level lease exists. Neither reader records admission order or bounds another gate's wait.",
    "The guard stopped the sixth review at 2026-10-19T16:45:44.104Z after 236256 ms; the planner document row passed at 16:45:50.264Z in 7998 ms with 2766 ms total host-lane wait. It stopped the seventh review at 16:48:09.185Z after 98302 ms; the planner row passed at 16:48:15.088Z in 6176 ms with 880 ms total host-lane wait. Stopped rows supply no passing claim.",
    "The operator subsequently said to let anything else wait and noted that stopping and starting was not making overall progress faster. The watcher exited successfully before the uninterrupted review continued."
  ],
  "rejected": [
    {
      "option": "Keep stopping complete runs for each short gate",
      "reason": "The operator rejected that operational tradeoff after two observed restarts; a scheduler solution must preserve completed work and provide admission rather than cancellation."
    },
    {
      "option": "Leave all required runs on hold",
      "reason": "The operator clarified that completing those runs is this order's purpose."
    },
    {
      "option": "Rewrite the planner instance or introduce a new host admission protocol during this scheduling measurement",
      "reason": "The instance has its own writer, and a cross-version fairness protocol needs its own compatibility and waiting-time evidence."
    }
  ],
  "followup": "Add fair host admission across independent gates, with an explicit compatibility path for fixed-four clients, preserved nested reservations, and a regression that bounds a short document gate's wait while a complete gate continues admitting work.",
  "reopenWhen": "The operator changes the execution priority, or a subsequent order supplies measured fair admission across installed client versions."
}
```

## WO-222-D010

```json
{
  "id": "WO-222-D010",
  "date": "2026-10-19",
  "dispatch": "resume: next",
  "decision": "Move the unchanged launchpad command parser into the shared target-worktree fixture and import it from both the start and publication files. The split had retained every case body but left this cross-group helper private to the start file. Keep every assertion and the original helper behavior.",
  "evidence": [
    "The eighth complete review failed at 2026-10-19T17:00:10.288Z after 495102 ms. The target publication file passed seven of eight cases; the interrupted-records case raised ReferenceError: launchpadCommands is not defined.",
    "Source inspection found the helper declaration in test-target-worktree-start.mjs and its additional consumer in test-target-worktree-publish.mjs. The other top-level helpers remain within their consumer files.",
    "The focused interrupted-records case passed under the eight-lane parent declaration at 2026-10-19T17:03:31.872Z: one test, zero failures, 18486 ms bounded duration."
  ],
  "rejected": [
    {
      "option": "Duplicate the helper or remove the assertion",
      "reason": "A shared fixture preserves the original single behavior and all coverage."
    }
  ],
  "reopenWhen": "A future split introduces another cross-file helper dependency; move it into the shared fixture with both consumers verified."
}
```

## WO-222-D011

```json
{
  "id": "WO-222-D011",
  "date": "2026-10-19",
  "dispatch": "resume: next; explicit operator scope expansion for a maintained architecture record",
  "decision": "Add a standalone, maintained architecture decision record at docs/architecture/gate-execution.md, referenced by product 07 and available for future work orders to cite and extend. Research established scheduling approaches in books, primary papers and public implementation repositories; trace this project's prior attempts; compare alternatives, invariants, measurements and migration tradeoffs. Keep the ordinary work-order decision records and link their architectural consequences into that shared document. Add criterion 9 without weakening the original eight criteria or authorizing an unmeasured scheduling rewrite.",
  "evidence": [
    "The operator explicitly requested research into known scheduling tradeoffs, books and other GitHub implementations, and an ADR around the architecture rather than restarting the investigation with each work order.",
    "The operator then confirmed that this must be its own document that many work orders can reference and add to, while normal decision records continue as usual.",
    "The existing tree has docs/product/03-architecture.md and order-local decisions, but the scoped file inventory found no standalone gate-execution architecture record."
  ],
  "rejected": [
    {
      "option": "Leave the research only in WO-222 decisions",
      "reason": "The operator explicitly asked for one maintained document shared across work orders."
    },
    {
      "option": "Treat external designs as permission to replace the scheduler immediately",
      "reason": "Research must establish fit and migration evidence; the existing safety and measurement obligations remain."
    }
  ],
  "reopenWhen": "A later work order changes the gate execution architecture or contradicts a recorded tradeoff; update the shared record and link that order's decision and evidence."
}
```

## WO-222-D012

```json
{
  "id": "WO-222-D012",
  "date": "2026-10-19",
  "dispatch": "resume: next; operator-authorized architecture research, D011",
  "decision": "Establish docs/architecture/gate-execution.md as the maintained cross-order architecture record and link it from product 07. Keep required-work selection and evidence truth separate from local task scheduling and shared host admission. The next candidate is a versioned admission queue under the existing host lock, with fairness between gates, accurate short-task reservations, preserved nested progress and an explicit fixed-four-client migration boundary. This is a researched proposal, not a new runtime protocol in WO-222. Keep the operator's optional throughput/coexistence profiles at the end as a later comparison, without adding configuration now.",
  "evidence": [
    "WO-222-D009 records the 1554.557-second short-gate lease wait and the two operational stops; the old and new host-lane readers have availability checks but no ordered admission intent.",
    "The architecture record traces checked decisions from WO-126, WO-128, WO-131, WO-132, WO-115, WO-173, WO-185, WO-186, WO-216, WO-221 and WO-222, including reversals, identity defects and whole-order cost limits.",
    "Primary research inspected on 2026-10-19: OSTEP scheduling chapters, Google SRE chapter 21, GNU make job slots, Go weighted semaphore, Bazel ResourceManager, Ninja scheduler and pools, the DRF NSDI 2011 paper and Slurm backfill documentation; exact links and applicability limits are in the architecture record.",
    "The ninth complete review passed at 2026-10-19T17:34:15.780Z: 1669246 ms, 102 fresh tasks, zero reused, no failure, code identity 7d314f019c96d489689f0e1e858f9393d8ffbb97eaf8ce65c56ef54881e70bc3. The required three-run retention series remains a separate obligation."
  ],
  "rationale": "The traps are optimizing one task instead of the whole gate, treating throughput as responsiveness, repeating removed caching machinery without a net-benefit case, and promising fairness across clients that do not speak the protocol. The record carries measured reversals and separates proposals from implemented contracts. NoOp leaves the same architectural choices scattered across work orders.",
  "rejected": [
    {
      "option": "Keep this research only in the current work order's decisions",
      "reason": "The operator explicitly requested a maintained standalone record that later work orders can cite and extend."
    },
    {
      "option": "Replace the runner or install a central broker during this measurement",
      "reason": "The current order measures three bounded levers; a new admission authority also needs ownership, recovery, evidence and version-compatibility validation."
    },
    {
      "option": "Claim that a fair queue guarantees an immediate short-gate start",
      "reason": "Nonpreemptive held work still occupies capacity; a latency bound also needs headroom, bounded task granularity or safe preemption."
    }
  ],
  "reopenWhen": "An order implements host admission or resource profiles, changes required-work selection or reuse, or supplies controlled evidence that reverses a retained architecture choice. Update this shared record and keep that order's own decision and measured acceptance."
}
```

## WO-222-D013

```json
{
  "id": "WO-222-D013",
  "date": "2026-10-19",
  "dispatch": "resume: next; bounded adjacent repair adjacent-0002",
  "decision": "Retain the failed first fresh-series attempt and repair two distinct faults before another series. The measurement selector now reads the canonical npm test review row within the attempt's start/end window, rather than looking for the package alias npm run test:full. The target-publication case wrapper now uses deadlineLimit(measuredMs, 2 * measuredMs), retaining every cold baseline, standalone bound, scenario and assertion while applying the scheduler's declared load.",
  "evidence": [
    "The first fresh-series attempt ran from 2026-10-19T17:39:20.616Z to 2026-10-19T18:01:53.877Z. Its canonical row at 18:01:53.576Z records 1351827 ms, exit 1 and 95 freshly executed tasks at code identity 7d314f019c96d489689f0e1e858f9393d8ffbb97eaf8ce65c56ef54881e70bc3. The other seven tasks were not executed after the failure.",
    "target-publish's non-retryable triage case passed all four scenario subtests but its after hook failed the fixed twice-900-ms duration assertion; the case reported 2037 ms under the eight-lane, factor-16 declaration. No outer task timed out.",
    "scripts/test-runner.mjs records complete reviews with checkId npm test and gateSelection review. scripts/measure-gates.mjs had searched checkId npm run test:full, which left gate null and deadlines empty in the original series artifact. The initial statement that no row existed was wrong; the row existed under the canonical id.",
    "after-attempt-1-original.json preserves the original failed artifact unchanged. after-attempt-1.json recovers the projected row and deadline summaries from the same attempt's recorded time window, with explicit recovery provenance; no gate index row was altered.",
    "The bounded non-retryable triage reproduction under the eight-lane declaration passed at 2026-10-19T18:07:16.007Z: five tests, zero failures, 1049 ms bounded duration. The existing real-run measurement fixture was extended to run a fresh review, select its actual canonical row, and exclude alias, plain and out-of-window decoys; it passed at 18:07:20.733Z, 887 ms bounded duration."
  ],
  "rationale": "The traps are erasing a failed attempt, confusing a failed timing assertion with a missing gate record, and inflating all timeouts to hide load. Preserve both original and recovered evidence, select by the runner's actual contract, and derive only the existing case assertion from the already-validated scheduler declaration. NoOp retains a load-sensitive assertion and leaves the series unable to read any real complete review.",
  "rejected": [
    {
      "option": "Remove the timing assertion or replace the measured baseline with a larger constant",
      "reason": "The baseline is still the standalone measurement. The changed condition is declared concurrency; the existing load helper expresses that condition without losing the standalone bound."
    },
    {
      "option": "Discard the failed attempt and count the earlier passing review as a measurement run",
      "reason": "The order requires three fresh sequential runs at the handoff identity, and the failure must remain visible."
    },
    {
      "option": "Rename the canonical runner check id to match the package alias",
      "reason": "The evidence and lifecycle consumers use npm test. The defect is the measurement consumer's lookup, not the canonical identity."
    }
  ],
  "reopenWhen": "A complete run still exceeds a correctly derived case bound, or the runner's canonical selection contract changes; diagnose the retained failing row before changing a bound or selecting another record."
}
```

## WO-222-D014

```json
{
  "id": "WO-222-D014",
  "date": "2026-10-19",
  "dispatch": "resume: next; final measured disposition",
  "decision": "Retain host-derived capacity capped at eight, its shared registry record and the gate-share-per-lane memory budget. On this host the capacity is eight and the task budget is 3221225472 bytes. This is retention under the combined series, not an isolated causal estimate for capacity.",
  "evidence": [
    "The three fresh complete runs took 1671462, 1668518 and 1664190 ms at 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543; median 1668518 ms against the selected historical before median 2538373 ms, a 34.2682% reduction. All 306 fresh task executions passed with zero outer task deadline hits. The checked host has 16 logical processors and 51539607552 physical bytes.",
    "before.json and after.json retain all task timelines and peaks; the README compares medians, critical paths, task durations and peers. The largest after task RSS is 1524416512 bytes, below the enforced budget.",
    "Median summed task duration rose from 4763870 to 5361182 ms. Shorter wall completion does not establish less CPU work, less total task duration or whole-order savings."
  ],
  "rationale": "The traps are accepting an estimated speedup, treating occupied lanes as CPU utilization, and multiplying a fixed task share as lanes rise. The measured complete-run reduction clears the required 20%; the budget is derived and enforced. NoOp retains the four-lane complete-run baseline.",
  "rejected": [
    {
      "option": "Retain four lanes",
      "reason": "The selected complete-run comparison clears the required improvement with the derived budget and all task deadlines intact."
    },
    {
      "option": "Claim the capacity change alone saved 34.2682%",
      "reason": "The prescribed series changes all three levers and uses historical before identities; it does not isolate this contribution."
    }
  ],
  "reopenWhen": "Revert this lever when a later pass's complete-run median rises above this order's before median of 2538373 ms; retain that measurement and reassess the release classification and the other levers together. A task deadline failure also reopens its admission and bound before retention."
}
```

## WO-222-D015

```json
{
  "id": "WO-222-D015",
  "date": "2026-10-19",
  "dispatch": "resume: next; final measured disposition",
  "decision": "Retain overlap: 2 on harness-fixtures, process-debt and worktree-integration, admitting only baseline-qualified light shared peers and preserving inherited nested reservations. The combined series clears the retention threshold. Do not claim that all three tasks actually ran under peers.",
  "evidence": [
    "The three fresh complete runs took 1671462, 1668518 and 1664190 ms at 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543; median 1668518 ms against the selected historical before median 2538373 ms, a 34.2682% reduction. All 306 fresh task executions passed with zero outer task deadline hits. The checked host has 16 logical processors and 51539607552 physical bytes.",
    "Harness-fixtures before durations were 271863/289445/292279 ms and after durations 305366/305818/306221 ms; actual peak peers were 2/2/2. Every observed peer satisfied the frozen light-task classification.",
    "Process-debt before durations were 95298/101141/102758 ms and after durations 101736/101524/103737 ms; actual peak peers were 0/0/0. Worktree-integration before durations were 153678/165928/167345 ms and after durations 166323/166331/156749 ms; actual peak peers were 0/0/0.",
    "Each exclusive task declared concurrency three and factor six on this host; every outer bound remained 900000 ms and none fired. Real-peer duration evidence exists for harness-fixtures only; fixtures cover generic overlap admission and nested reservations.",
    "The 18 inner hits across 125320 samples are the six deliberate failure-path sites per run listed in the README. Exact task/site matching distinguishes them from outer task deadlines."
  ],
  "rejected": [
    {
      "option": "Restore full exclusive reservation for all three tasks",
      "reason": "The combined series meets the 20% criterion, with actual bounded light overlap on harness-fixtures and no outer timeout."
    },
    {
      "option": "Admit any shared task or remove exclusive reservations",
      "reason": "Neither is the tested contract; the baseline eligibility rule and nested reservation prevent borrowing heavy or already-reserved work."
    },
    {
      "option": "Claim a measured peer-contention result for process-debt or worktree-integration",
      "reason": "They had no actual overlapping peer in these trials."
    }
  ],
  "reopenWhen": "Revert this lever when a later pass's complete-run median rises above this order's before median of 2538373 ms; retain that measurement and reassess the release classification and the other levers together. A task deadline failure also reopens its admission and bound before retention."
}
```

## WO-222-D016

```json
{
  "id": "WO-222-D016",
  "date": "2026-10-19",
  "dispatch": "resume: next; final measured disposition",
  "decision": "Retain the four target-worktree file tasks with group limit two and individual 900000-ms deadlines, preserving the 39 base declarations and all 60 expanded case names. Retention follows the combined complete-run result; the group span alone did not improve by 20%.",
  "evidence": [
    "The three fresh complete runs took 1671462, 1668518 and 1664190 ms at 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543; median 1668518 ms against the selected historical before median 2538373 ms, a 34.2682% reduction. All 306 fresh task executions passed with zero outer task deadline hits. The checked host has 16 logical processors and 51539607552 physical bytes.",
    "Before group spans were 544281/575715/611354 ms; after spans were 519876/522495/526916 ms. Their medians are 575715 and 522495 ms, a 9.2442% reduction.",
    "Summed target-worktree duration rose from a 575681-ms median to 893851 ms. The after files ranged from 68607 to 337524 ms, all below their own 900000-ms bounds. The README retains every per-file sample and both case-name inventories.",
    "The registration fixture and complete runs establish the actual 60-name inventory; D010 records the cross-file helper repair, so case-name equality is not represented as sufficient executable proof."
  ],
  "rejected": [
    {
      "option": "Keep the monolithic file or merely raise its deadline",
      "reason": "The combined complete-run comparison meets the required threshold with the bounded split; a larger monolithic deadline does not establish shorter completion."
    },
    {
      "option": "Claim the split alone caused a 20% improvement",
      "reason": "Its measured group-span reduction is 9.2442%, summed group duration increased, and no same-source ablation was prescribed or run."
    }
  ],
  "reopenWhen": "Revert this lever when a later pass's complete-run median rises above this order's before median of 2538373 ms; retain that measurement and reassess the release classification and the other levers together. A task deadline failure also reopens its admission and bound before retention."
}
```

## WO-222-D017

```json
{
  "id": "WO-222-D017",
  "date": "2026-10-19",
  "dispatch": "resume: next; evidence-edition interpretation checked against source",
  "decision": "Use the implemented evidence contracts for step 11: retain the new live feedback episode and feedback-001 edition, the newly minted authority/001 edition, and the current installed harness generated by sync. Preserve the immutable WO-042 live harness records as historical observations. The harness checker has no separate current-live-edition mint operation; do not manufacture a new historical observation to satisfy the order's shorthand.",
  "evidence": [
    "scripts/harness-evidence.mjs calls checkEvidenceImports and checkHarness for the current source and generated installation, then checks immutable live records against the v0.16.0 manifest. Its returned liveEdition explicitly says historical; no claim of a current live run.",
    "The live feedback self-host episode completed in this executor session on Codex gpt-6.1-sol/max: ten base fixtures passed and ten removal fixtures failed as required; its audit, verification and pins select feedback-001.",
    "npm run sync regenerated the installed harness manifest and hook surfaces. The complete review and all three forced-fresh after runs passed feedback-evidence, authority-evidence, harness-evidence and evidence-sources at the handoff code identity."
  ],
  "rejected": [
    {
      "option": "Rewrite WO-042 live observations or invent a current live harness run",
      "reason": "Those records prove their original subject, and the current checker explicitly preserves that boundary."
    },
    {
      "option": "Leave generated harness surfaces stale",
      "reason": "The current installation is still required and checked; preserving historical observations does not excuse stale generated outputs."
    }
  ],
  "reopenWhen": "The harness evidence contract gains a distinct deterministic current edition or an explicitly authorized new live qualification; record its actual subject and provenance without altering historical observations."
}
```

## WO-222-D018

```json
{
  "id": "WO-222-D018",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up for the host lane capacity record's refusal text. The record (lane-capacity.json in the per-user host registry) fails closed, which is right. A record holding 0, 9, the string \"8\" or no capacity refuses with 'Invalid recorded host lane capacity'. A record that is not JSON, or is empty, refuses with the bare parser message ('Unexpected token ...' or 'Unexpected end of JSON input'). Neither text names the record or a remedy. By the code, every reader then refuses on every clone of the host until the record is removed by hand: the gate entry (registerGuardTree, then acquireHostLaneCapacity), the bounded wrapper, agent-session registration, executeSuite and the structural host check all read it through recordedHostLaneCapacity. atomicJson writes the record by rename, so ordinary operation does not leave a partial file; the reproduction forges it. No criterion breaks: criterion 1's first-acquirer record and inheritance hold, and main had no such record.",
  "evidence": [
    "docs/evidence/WO-222/verification-001/probes.mjs registry under the bounded wrapper, 2026-10-19T20:30:51Z, exit 0: forged records {\"capacity\":0}, {\"capacity\":9}, {\"capacity\":\"8\"} and {} refuse acquisition with 'Invalid recorded host lane capacity'; 'not json' and an empty record refuse with the JSON parser's message.",
    "scripts/lib/host-resources.mjs recordedHostLaneCapacity (rethrows every error but ENOENT; the range check names no path); scripts/lib/host-lanes.mjs capacityUnderLock; the readers in scripts/test-runner.mjs (executeSuite, runGateChecks), scripts/lib/bounded-command.mjs, scripts/lib/host-guard-state.mjs and scripts/structural-checks.mjs checkHost."
  ],
  "rejected": [
    {
      "option": "Route the refusal as blocking",
      "reason": "Failing closed is the right outcome, and no criterion or behavior main had breaks; the defect is the text an operator recovers from."
    },
    {
      "option": "Re-derive the capacity silently when the record is invalid",
      "reason": "Clones could then disagree about capacity while leases are live, against criterion 1's single recorded capacity."
    },
    {
      "option": "Correct the message in this verification",
      "reason": "A verifier never edits the implementation it judges; the defect is boarded with its reproduction."
    }
  ],
  "followup": "Next order editing scripts/lib/host-resources.mjs or scripts/lib/host-lanes.mjs: an unreadable or invalid host lane capacity record refuses with one message naming the record by label (the host registry's lane-capacity record), what is wrong with it and the remedy (remove it while no gate runs; the next acquirer records it again under the lane lock); add fixtures for malformed JSON and an out-of-range capacity that assert that message from acquireHostLanes and memoryBudgets. Keep failing closed.",
  "reopenWhen": "A gate, bounded probe or session registration refuses on the capacity record, or the record's format or location changes."
}
```

## WO-222-D019

```json
{
  "id": "WO-222-D019",
  "date": "2026-10-19",
  "dispatch": "resume: verify",
  "decision": "VER-001 boards a follow-up on the light-peer classification and records that planning receipt 048's criterion 3 reopen condition fired in the after series. The classification follows the order's Design, the latest baseline sample of each task. launchpad:file:test-launchpad-seeds.mjs is therefore light on its 10:58:31Z sample (4.820 s, 467,156,992 bytes), although its two earlier before samples peaked at 526,663,680 and 572,801,024 bytes. In each after run it started while harness-fixtures ran, with harness-fixtures as its only active peer, and peaked at 623,509,504, 593,985,536 and 629,784,576 bytes: above the 512 MiB light bound. It reserves two slots, so it takes both overlap lanes. The receipt's condition reads 'A row classified light in before.json records a task over 60 s or 512 MB while beside an exclusive row'. Nothing failed: the task took 4.5 to 4.7 s under its 900 s bound, harness-fixtures passed under its own bound, and the task budget is 3,221,225,472 bytes. Criterion 3 is a fixture criterion and holds; the implementation matches the Design's rule and product 07's sentence. The README and D015 say every observed peer qualifies under the frozen baseline. That is true of the classification but silent on the observation. The same receipt's criterion 5 condition ('a kept lever's own tasks ... show no per-task gain in the README table') reads as fired for the overlap lever, as worded. The harness-fixtures median rose from 289.445 to 305.818 s, and the other two exclusive rows had no peer. D015 already records those measurements and retains the lever on the combined median, as criterion 5 allows.",
  "evidence": [
    "docs/evidence/WO-222/after.json taskTimeline, runs 1 to 3: launchpad:file:test-launchpad-seeds.mjs started at 18:44:38.148Z, 19:12:31.725Z and 19:40:23.177Z with concurrentAtStart [harness-fixtures], inside harness-fixtures' windows (18:40:33.967Z to 18:45:39.343Z, 19:08:27.312Z to 19:13:33.139Z, 19:36:18.637Z to 19:41:24.870Z); peakRssBytes 623509504, 593985536 and 629784576; reservedSlots 2.",
    "docs/evidence/WO-222/before.json and scripts/lib/gate-scheduling-baseline.json: the seeds samples at 03:15:23.923Z, 07:55:04.693Z and 10:58:31.828Z peaked at 526663680, 572801024 and 467156992 bytes; the baseline carries the last. Of the 79 light tasks, console and the seeds file have an earlier before sample over a bound; generated and the seeds file exceed one in an after run, and only the seeds file did so beside an exclusive row.",
    "docs/evidence/WO-222/verification-001/probes.mjs timelines and baseline under the bounded wrapper, 2026-10-19T20:31:08Z: every peer of the three exclusive rows is in lightSuiteNames(), peak two at once; the module's 79 light tasks equal a recomputation from before.json.",
    "Planning receipt 2026-10-19-planning-12151725d1073489-048 known issues for WO-222, criteria 3 and 5, as printed by the verify briefing."
  ],
  "rejected": [
    {
      "option": "Route the admission as blocking",
      "reason": "Criterion 3 holds at its fixture, the Design names the latest-sample rule the implementation applies, and no task failed or reached a bound; the receipt routed this observation to a reopen condition, not to a criterion."
    },
    {
      "option": "Withdraw the overlap lever in this verification",
      "reason": "Criterion 5 keeps a lever on the combined median, which clears one fifth against both the before median and the fastest before row; a verifier never edits the implementation it judges."
    }
  ],
  "followup": "Next order editing the light classification (scripts/test-runner.mjs lightSuiteNames and scripts/lib/gate-scheduling-baseline.json): classify a task light only when every sample the baseline holds for it is under both bounds, or move the rule to a declared row property checked against the live gate index and defaulting to heavy, as receipt 048 proposed; add a fixture whose task is light on its latest sample and heavy on an earlier one, and assert it waits beside an exclusive row. The planning pass that reads receipt 048's reopen conditions takes the two fired ones with this decision and D015.",
  "reopenWhen": "A light peer beside an exclusive row reaches a deadline or is ended by its memory budget, or a later measured series still shows a light-classified task over either bound beside an exclusive row."
}
```

## WO-222-D020 — Final review: integration took in nothing; every acceptance claim carried forward to FINAL-001

<!-- integration refs/dotln/checkpoint/WO-222/6 -->

```json
{
  "id": "WO-222-D020",
  "date": "2026-10-19",
  "dispatch": "resume: final review; worktree integrate WO-222",
  "decision": "Integration took in nothing: the base, local main and the fetched origin/main are all 6ebc6d9bac690768557721dfe101c31382d8da7c, the merge base is that commit and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-222/6, 0e799385b2aae95192acb0b8fd66f486d978a51f), retained its named stash be3b6f1ba82a1e357c5f95633c3efa9ea3780350, re-applied the work without an authored conflict and regenerated projections only: the runtime, the harness bundle and manifest, the control projection, the release preparation (meter snapshot and PR meter block), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. No intake backup was named: git ls-files --others --ignored --exclude-standard under docs/intake lists no file. Every acceptance claim is carried forward unchanged to FINAL-001: VER-001's nine criterion judgments at code identity 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543, the identity its VerificationCompleted event of 2026-10-19T20:44:29.361Z records with the complete review row of 20:03:32.850Z (host-gate:0473e667…:npm test, forced fresh, 102 freshly executed tasks, zero failures, 1664.190 s) and the document row of 20:44:11.027Z; the executor's ImplementationReady event of 20:13:25.991Z at the same identity with its document row of 20:12:50.629Z; VER-001's F1 and F2 as boarded (D018, D019); the operator's scope expansion D011 and criterion 9 as bound in the planning log by the PlanExecutionAmended event of 2026-10-19T17:04:27.413Z against receipt 048, which recomputes from the current order bytes under the amendment's normalization as 26,926 characters and sha256:95ca7d2f0af165f977cdd1034e29b3feba748dae9bad60852943ff97d19f850a from the filed source sha256:5b26ef88ba28512f5b0599d3b735ef8d33a6b9d4aef16e66593c9d841fc157cc. Before integration the tree differed from the dispatch checkpoint 5 only in docs/control/current.md, docs/control/orders/WO-222.jsonl and docs/work-orders/README.md, none code; after it the code identity recomputes as 0473e667… and the gate index holds no active run, so the integrated identity is the one VER-001 judged. Release preparation keeps application v0.86.0 under the order's minor classification: local tags end at v0.85.0, and check-surfaces --local passes 57 checks with the release block v0.86.0, @dotln/skeleton the only component whose source changed (0.61.0 to 0.62.0, the console pin and lockfile following) and no bump required for the other five; no dependency is added. The authority (WO-222/001) and feedback (WO-222/001) editions this order minted stay selected; the authority, feedback and harness-evidence checks pass and every generated surface is current after integration, so integration owes no re-mint and no live episode. The product gate criterion 8 requires is the standing complete review row at the integrated identity, reused under WO-221 D017; no second run of the same bytes is owed, and FINAL-001 records it.",
  "evidence": [
    "refs/dotln/checkpoint/WO-222/6 (0e799385b2aae95192acb0b8fd66f486d978a51f); docs/control/local/integration.json: preservationCommit 0e799385…, mergeCommit null, complete true, stage applied, untrackedConflicts []; the helper printed Bases 6ebc6d9b -> 6ebc6d9b, Authored conflicts: none, and the regenerated list above",
    "git rev-parse main, HEAD and git merge-base HEAD main: each 6ebc6d9bac690768557721dfe101c31382d8da7c; git log HEAD..main prints nothing; git diff --stat refs/dotln/checkpoint/WO-222/5 refs/dotln/checkpoint/WO-222/6 lists docs/control/current.md, docs/control/orders/WO-222.jsonl and docs/work-orders/README.md only",
    "gateCodeIdentity(root) from packages/skeleton/src/gate-evidence.mjs, read at 2026-10-19T21:24Z after integration: 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543; activeGateRuns(root): none; readGateChecks(root): npm test review rows at that identity recorded 18:39:15.107Z (fresh, 1746.973 s) and 19:07:56.043Z, 19:35:46.443Z and 20:03:32.850Z (forced-fresh, 1671.462, 1668.518 and 1664.190 s), each exit 0 with 102 fresh and 0 reused tasks; npm run test:docs rows at that identity 20:12:50.629Z, 20:40:53.725Z and 20:44:11.027Z, each exit 0",
    "The verifier's eight saved probes rerun under node scripts/harness.mjs bounded at 2026-10-19T21:24:59Z to 21:25:10Z after integration, each exit 0 with the observations VER-001 recorded: capacity-table, registry, scheduler-table (102 tasks at 16, 8, 4 and 2 processors, no violation), timelines, cases (60 names equal), series (34.27% below the before median, 25.46% below the fastest before row, no task timed out), baseline (79 light tasks equal) and host-budget",
    "Affected checks after integration, 2026-10-19T21:26Z, each exit 0: npm run publication:check (both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces; local-terms list present), npm run release -- check-surfaces --local (57 PASS: release block v0.86.0 against latest local tag v0.85.0; skeleton src changed, observed 0.62.0 against 0.61.0; beacons, browser-evidence, compiler, console and kernel unchanged; workspace pins exact), npm run meta -- --check (the standing WO-150-D003 reopen candidate only), node scripts/authority-evidence.mjs --check (37 bundle comparisons), node scripts/feedback-evidence.mjs --check (feedback-001 judged the current source: ten passing regressions, ten removal failures), node scripts/harness-evidence.mjs --check (34 current generated surfaces; the WO-042 live smokes historical), node scripts/measure-gates.mjs --check docs/evidence/WO-222/after.json (3 runs, all passed first time); git diff --check exit 0; npm run format:check clean; git diff --quiet on scripts/lib/gate-evidence.mjs and packages/skeleton/src/gate-evidence.mjs exit 0",
    "VER-001's SHA-256 (9dbe9da72ca46606f8410b78e88c99202393559ab3d70ee1e4f5611c313ca205) equals the reportHash its VerificationCompleted event recorded; the order's base and working bytes normalized as scripts/lib/plan-continuation.mjs executionAmendmentSource hash to the D011 amendment's recorded sourceOrderHash and, over its recorded orderLength 26926, its orderHash",
    "git ls-files --others --ignored --exclude-standard -- docs/intake/ prints nothing; docs/intake holds chats, images and notes with no ignored file"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR meter block and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    },
    {
      "option": "Start a second complete review run at the unchanged identity",
      "reason": "WO-221 D017: the identity, not the dispatch time, says what was tested; four passing complete rows stand at this identity, the newest covering every required suite with executed passing tasks, and a second run of the same bytes adds no coverage for about 28 minutes of gate time."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-19. Original base: `6ebc6d9bac690768557721dfe101c31382d8da7c`.
Fetched main: `6ebc6d9bac690768557721dfe101c31382d8da7c`. Checkpoint: `refs/dotln/checkpoint/WO-222/6` (`0e799385b2aae95192acb0b8fd66f486d978a51f`).
Named stash retained: `be3b6f1ba82a1e357c5f95633c3efa9ea3780350` (WO-222 integrate 2026-10-19).
Intake backup: none named; `docs/intake` holds no ignored file, so the helper's intake check required no archive.
Resolved projections: none.
Release preparation: WO-222 target v0.86.0 remains current. Files changed: docs/evidence/WO-222/meta.json, docs/final-reviews/WO-222/PR.md. Meter snapshot: docs/evidence/WO-222/meta.json, 4168 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-001's nine criterion judgments and the executor's completion at code identity `0473e667…`, which the integrated tree keeps; VER-001's F1 and F2 as boarded (D018, D019); D011 and criterion 9 as bound in the planning log against receipt 048. No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: the three printed checks other than the complete run pass on the integrated tree at 21:26 UTC (evidence above); the complete run is the standing complete review row at the integrated identity, reused under WO-221 D017 and recorded in FINAL-001.

## WO-222-D021 — Final review: pass FINAL-001 at the integrated subject; the cross-gate overlap lease leads three boarded follow-ups

```json
{
  "id": "WO-222-D021",
  "date": "2026-10-19",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-222 at the integrated subject, code identity 0473e667e09a0a65bd923cfd23faa1c719d0e4f059ff50142aac99080eff1543, which integration left unchanged (D020). All nine criteria hold, criterion 9 on the text the operator's D011 amendment added. Criterion 8's product gate is the standing complete review row at that identity, npm test -- --review recorded 2026-10-19T20:03:32.850Z, forced fresh, 102 freshly executed tasks, zero failures, 1664.190 s, the newest of four passing complete rows there, reused under WO-221 D017; its document gate is the npm run test:docs row this review records after its last document edit. The verification sequence (VER-001, pass) names no blocking claim, so the cheap reproduction before any expensive validation was the verifier's eight saved probes rerun under the bounded wrapper at the integrated tree; all eight reproduce. One read-only dotln-worker reader, given the order and the diff, traced the scheduler admission at capacities 1 to 8, the capacity record, the deadline declarations, the budgets, the measurement checker and the file split, and found no correctness defect in the admission loop or the checker; of its nine items three are boarded below and six are observations in the report. VER-001's F1 (D018) and F2 (D019) stay boarded and unrepaired: F1's repair edits recordedHostLaneCapacity in scripts/lib/host-resources.mjs, a feedback source path, so the Adjacent Repair would stale the feedback edition and owe a live self-host episode and a complete run at a new identity for a message text; F2's rule is the one the order's Design names, and changing it reschedules the runs the after series measured. Three follow-ups are boarded with repair rules and one register row, none breaking a criterion or a behavior main had as a contract. F1: the overlap lanes are open to any other gate on the host. An exclusive row now takes a host lease of its reserved slots only (reservedSlots, scripts/test-runner.mjs about lines 1371 to 1376: concurrency minus overlap, six of eight here), and the registry admits any top-level request whose slots fit the recorded capacity (scripts/lib/host-lanes.mjs, the siblings sum against recordedCapacity) without knowing light from heavy; a second gate on the host can therefore run runner-fixtures beside harness-fixtures, and the light-only rule holds inside one gate only. At main the exclusive lease held all four of four slots. The after series ran with no other gate, so it cannot show the effect; criterion 3 is a fixture criterion and holds. F2: the per-lane task budget now applies to work that is not a lane. The guard budgets a bare process group, any owned process outside an explicit task or gate registration such as a session's shell command, MCP server or browser tree, at the smaller of the live protected and gate registrations' taskBytes and physical memory times DEFAULT_MEMORY.taskShare (scripts/host-guard.mjs about lines 370 to 377), and registerAgentSession records taskBytes for the session (scripts/lib/host-guard-state.mjs); both figures are now the gate share divided by the lanes, 3,221,225,472 bytes on this host against 12,884,901,888 at main, and one gigabyte on a sixteen-processor, sixteen-gigabyte host. No kill was observed in this order's fourteen complete attempts or its three sessions, and the bounded wrapper's lower budget is the stated design; the session and bare-group budgets are an unstated consequence. F3: the structural host refusal names no lever. checkHost prints the per-lane budget, the measured peak and the lane count (scripts/structural-checks.mjs line 33) but not that memory.gateShare in docs/control/budgets.json is the configurable term, and product 07 names no remedy either; a sixteen-processor host with sixteen gigabytes refuses every gate, focused ones included, with no stated way out. Planning receipt 048's criterion 3 condition fired in the after series and its criterion 5 per-task clause reads as fired for the overlap lever, as D019 records; this review records both again for the planning pass. The register row FUP-3054caf98649935d's condition occurred, since this order edits docs/control/budgets.json; the reopens record below carries the observation. The reader wrote one file outside the repository, a sorted list of the base file's test declarations in the host scratchpad, and nothing else; it ran no node, npm, test or gate.",
  "evidence": [
    "docs/final-reviews/WO-222/FINAL-001.md: the verdict, the criterion judgments, the findings block, the register and the executed checks",
    "The verifier's eight saved probes rerun under node scripts/harness.mjs bounded at 2026-10-19T21:24:59Z to 21:25:10Z after integration, each exit 0: capacity-table (stubbed 1, 2, 3, 4, 8, 15, 16, 17, 32 and 64 processors give 1, 1, 1, 2, 4, 7, 8, 8, 8 and 8; one lane more refuses), registry (first derivation 2 recorded, 8 and 1 inherit it, request 3 refuses naming both; forged records refuse), scheduler-table (102 tasks at 16, 8, 4 and 2 processors, two seeds, every task once, no violation, peak slots 8, 4, 2 and 1), timelines (harness-fixtures overlapped 74 light tasks, at most two at once; the other two exclusive rows none; reserved 6, declared shared/3), cases (39 declarations, 60 names, equal sets), series (34.27% below the before median, 25.46% below the fastest before row, no task timed out, largest duration-to-deadline ratio 0.618), baseline (79 light tasks equal; largest peak 1,509,638,144 bytes), host-budget (16 processors and 24 GiB admit; 8 and 16 admit; 8 and 8 refuse at 1,073,741,824 below 1,509,638,144; 4 and 8 and 32 and 64 admit)",
    "The dotln-worker reader (read-only, dispatched 2026-10-19T21:24:59Z, 233,379 subagent tokens, 89 tool uses, 1,015.7 s): nine items, of which the cross-gate overlap lease, the bare-group and session budget and the remedy-less refusal are the three follow-ups above; its sound-trace list covers the admission loop at capacities 1 to 8, the record under the lanes lock and atomic rename, the deadline declarations, the legacy budget keys, the checker's rejection of failed, stopped and deadline-ended runs, and the split's line multiset and helpers",
    "scripts/test-runner.mjs: reservedSlots gives an explicitly isolated row concurrency minus overlapSlots; executeTask acquires a host lease of that many slots; scripts/lib/host-lanes.mjs acquireHostLanes: siblings' slots plus the request against parent slots or recordedCapacity, no light or heavy distinction; git show HEAD:scripts/lib/host-lanes.mjs: capacity fixed at four and an isolated row reserved all of it",
    "scripts/host-guard.mjs: protectedPids are the guard, the protected registrations and the gates; a bare group's budgetBytes is Math.min over live protected or gate registrations' limits.taskBytes and sample.physicalBytes * DEFAULT_MEMORY.taskShare; scripts/lib/host-resources.mjs DEFAULT_MEMORY.taskShare is 1 / 2 / hostLaneCapacity(); scripts/lib/host-guard-state.mjs registerAgentSession records limits: memoryBudgets(repo, { capacity: recordedHostLaneCapacity(directory) }); git show HEAD:scripts/lib/host-resources.mjs taskShare 1 / 4",
    "docs/evidence/WO-222/after.json: the largest task tree footprint in the three runs is runner-fixtures at 1,204,318,992, 1,251,200,360 and 1,213,742,456 bytes against RSS peaks of 1,472,954,368, 1,524,416,512 and 1,488,748,544 bytes and a 3,221,225,472-byte budget; gate peak footprint 2,269,064,616, 2,155,674,112 and 2,225,968,248 bytes; the RSS-based screen is therefore the conservative side of the footprint the monitor enforces",
    "scripts/structural-checks.mjs line 33: the refusal line names the budget, the peak and the lane count; grep gateShare docs/product/07-execution-guide.md finds nothing; the host-budget probe at 16 processors and 16 GiB: exit 1",
    "npm run meta -- --check at the integrated tree: REOPEN WO-150-D003 {\"metric\":\"coldStartBytes.executor\",\"operator\":\">\",\"value\":24576}; coldStartBytes 29,214; git diff docs/control/budgets.json removes taskShare and hostLanes; FUP-3054caf98649935d reopenWhen: the next order that edits docs/control/budgets.json records the reopens observation",
    "npm run plan -- followups --touching at revision 2543bb0c…: 12 matched of 162 pending, 8 distinct rows; the authority-copy share is 11,737,223 of 208,623,431 docs/evidence bytes (5.63%) with 239 copies"
  ],
  "rationale": "The traps were routing the order's designed behaviors as regressions (the smaller probe budget, the smaller nested reservation on small hosts, the synthetic-host refusal), repairing a message text at the price of a live episode and a complete run, reading the reader's confident items as findings before tracing them, and leaving a fired register condition in prose. Each follow-up names its code, its trigger and its repair rule; the two designed behaviors stay observations. NoOp would have consumed the rows and the handoff and left the cross-gate lease, the session budget and the fired budgets row unrecorded.",
  "rejected": [
    {
      "option": "Route F1 as blocking",
      "reason": "Criterion 3 is a fixture criterion and holds; the order's Design reserves every lane but two and gives the registry no light-or-heavy term, so the cross-gate opening is a gap in the Design rather than a divergence from it; the series and every gate of this order ran alone, no incident was observed, and D009 already boards cross-gate admission for a later order."
    },
    {
      "option": "Repair F2, F3 or VER-001 F1 in this review through Adjacent Repair",
      "reason": "Each edits scripts/lib/host-resources.mjs, scripts/host-guard.mjs or scripts/structural-checks.mjs, which are runner-fixtures and harness-fixtures machinery sources, and host-resources.mjs is a feedback source path; the repair owes a live self-host episode, a re-mint and a complete run at a new identity, about an hour of gate time, for defects that break no criterion and were not observed to fire on this host."
    },
    {
      "option": "Remove the unrun scripts/test-target-worktree.mjs import shim as a boy-scout cleanup",
      "reason": "Deleting a tracked code file changes the code identity and owes a complete run; the shim is five import lines whose claim the case probe's registration already checks. It stays an observation for the next order editing the suite."
    },
    {
      "option": "Treat the reader's items as findings on its word",
      "reason": "Each boarded item was traced at the named lines and quantified from after.json or the probes before it entered the block; the six others were either designed behaviors, already boarded, or fixture-only."
    }
  ],
  "followup": "Three repairs for the next order editing the scheduler or the host guard. F1, next order editing scripts/test-runner.mjs or scripts/lib/host-lanes.mjs: keep an exclusive row's host lease at the full capacity and lend its overlap lanes to its light peers as nested leases under that lease, or carry a light-only marker in the lease record that the registry honors for other gates' requests, so another gate's heavy task never runs beside harness-fixtures, process-debt or worktree-integration; add a two-registry fixture in which a second gate's heavy request waits while the exclusive row holds its lease and a light request is admitted. F2, next order editing scripts/host-guard.mjs or scripts/lib/host-resources.mjs: give bare process groups and agent-session registrations a budget tied to the host share or the gate share rather than the per-lane task budget, or state in product 07 that a session's non-gate process groups are budgeted at the per-lane figure and why; add a guard fixture asserting the bare-group budget on a stubbed sixteen-processor, sixteen-gigabyte host. F3, next order editing scripts/structural-checks.mjs: make the per-lane refusal name the lever (memory.gateShare in docs/control/budgets.json, with the value that would admit) or say that the host's memory per lane is too small, and say the same in product 07's §Preflight before the full gate; add a fixture asserting the remedy text.",
  "reopens": {
    "decisionId": "WO-150-D003",
    "observation": "WO-222 edits docs/control/budgets.json (it removes taskShare and hostLanes). At this tree npm run meta -- --check prints the predicate coldStartBytes.executor > 24576 as its one reopen candidate against an executor cold start of 29,214 bytes; the ceiling stays the operator's reserved efficiency pass (FUP-f1c7a256bec46737), and this observation discharges FUP-3054caf98649935d's condition for the planning pass that reads it."
  },
  "reopenWhen": "A second gate's heavy task is observed beside an exclusive row and that row reaches a deadline or is ended by its budget; the guard ends a session's or a bare group's process tree at the per-lane budget; a host refuses the per-lane screen in real use; or a later pass's complete-run median rises above 2538373 ms."
}
```
