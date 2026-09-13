# WO-128 decisions

## WO-128-D001

```json
{
  "id": "WO-128-D001",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next selected WO-128 in its dedicated worktree.",
  "decision": "Diagnose the twelve nominated gates from retained rows and cited reports, then measure isolated deadlines and shared-cap execution before selecting bounds or removing exclusivity. Include reachable shared host helpers in the deadline inventory. Missing historical logs remain unknown.",
  "evidence": [
    "docs/work-orders/WO-128-fresh-gates-pass-first-time.md",
    "docs/verifications/WO-125/VER-003.md#observations",
    "docs/evidence/WO-126/decisions.md#wo-126-d012",
    "scripts/test-runner.mjs"
  ],
  "rejected": [
    {
      "option": "Leave the current deadlines and exclusivity unchanged without measurement",
      "reason": "NoOp preserves recurring failed fresh gates and operator rescue on the route to independently verified runtime work."
    },
    {
      "option": "Raise all constants, serialize every suite, or retry automatically",
      "reason": "These can conceal defects, consume shared compute, or normalize recurring failure without diagnosing its cause."
    }
  ],
  "reopenWhen": "Measurements show a correctness defect, a missing deadline class, or instrument overhead large enough to distort the comparison."
}
```

Goal alignment: dependable first-pass validation removes recurring supervision
from the critical path to the independently verified source-to-deliverable loop.
Policy resistance is checked by retaining preflights, exact-tree evidence and
publication controls. Commons costs include the explicitly required measurement
series and its waiting time. Drift is judged against first-pass success, not a
larger timeout alone. Escalation and shifting the burden are checked by avoiding
automatic retries and recurring operator rescue. Success to the successful is
checked by remeasuring the exclusive workaround. Rule beating is checked with
slow doubles, complete task coverage and retained failed attempts. Seeking the
wrong goal is checked by comparing elapsed time and reliability rather than
receipt count. Under Naive Interventionism, existing hung-process detection,
read-only collection and useful process-boundary tests are retained; the first
probe only records numeric subprocess timings. Changes remain locally
reversible without discarding source or historical evidence.

## WO-128-D002

```json
{
  "id": "WO-128-D002",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next, followed by Continue with the bounded fixture repair after the executor's asynchronous check-in.",
  "decision": "Give the two planning cost fixtures explicitly empty synthetic budget acceptances. Their cost tables already declare no acceptances, while the copied live budget now contains an operator exception. Preserve the stale-evidence assertions and the production validator.",
  "evidence": [
    "scripts/test-plan-refutation.mjs",
    "docs/control/budgets.json",
    "docs/evidence/WO-128/fixture-results.md"
  ],
  "rejected": [
    {
      "option": "Change the production freshness check or retry the unchanged fixtures",
      "reason": "The isolated failures are mismatched fixture data, not a timeout. NoOp leaves two required checks failing; weakening the validator would hide a real mismatch."
    }
  ],
  "reopenWhen": "A fixture explicitly needs to exercise a nonempty acceptance history; it must then declare that synthetic history in both inputs."
}
```

This bounded data repair retains the D001 safeguards. It restores useful checks
on the critical path without changing runtime policy, adding dependencies or
adding recurring operator work. The other system-trap risks are unchanged.

## WO-128-D003

```json
{
  "id": "WO-128-D003",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next; diagnosis-first requirement in WO-128.",
  "kind": "correction",
  "decision": "Withdraw the neutral-instrument claim and retain the unknown-startup-adapter refusal; use explicit deadline observation instead.",
  "misread": "A temporary NODE_OPTIONS preload was treated as a neutral timing instrument for the runner fixtures.",
  "meant": "Unknown startup adapters deliberately disable reusable suite evidence, so that probe changes an input the reuse fixtures judge.",
  "changed": "Retained the failed probe separately; it is not a product failure or a passing baseline. Use explicit deadline wrappers in the shipped code and ordinary execution for the runner baseline, preserving the unknown-adapter refusal.",
  "evidence": [
    "scripts/lib/suite-evidence.mjs",
    "scripts/test-suite-evidence.mjs",
    "docs/evidence/WO-128/fixture-results.md"
  ],
  "rejected": [
    {
      "option": "Whitelist the temporary preload or relax the cache assertions",
      "reason": "That changes the reuse contract to accommodate the instrument, outside this order's purpose."
    }
  ],
  "reopenWhen": "An explicit observer cannot cover a reachable deadline without changing its behavior."
}
```

## WO-128-D004

```json
{
  "id": "WO-128-D004",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next selecting the complete deadline and exclusivity deliverable.",
  "decision": "Declare shared scheduling at at most four slots and isolated scheduling at one slot. Pass twice the slot count as the load factor, using measured solo baselines with the existing standalone bound as a floor. Preserve fixed bounds whose measured work fits the declared peer cap. Instrument timed subprocesses through explicit imports, and instrument manual barriers and watchdogs directly. Record current peers, numeric duration and host load on a hit; do not infer a defect from elapsed time alone. Add task intervals, start peers and scheduler predecessor edges for offline critical-path calculation. Trial the two formerly exclusive suites under the shared cap, with the five-run outcome deciding retention.",
  "evidence": [
    "docs/verifications/WO-125/VER-003.md#observations",
    "docs/evidence/WO-126/decisions.md#wo-126-d012",
    "docs/evidence/WO-128/isolated-baselines.json",
    "docs/evidence/WO-128/diagnosis.md",
    "packages/skeleton/src/gate-deadlines.mjs"
  ],
  "rejected": [
    {
      "option": "Add a gate-wide preload or a general resource scheduler",
      "reason": "Explicit wrappers cover the existing subprocess boundaries without changing Node startup policy or adding a new scheduling model."
    },
    {
      "option": "Change semantic worker leases or mutation verdict timers to improve test timing",
      "reason": "Those timers express behavior being tested. Preserve their values, bound their scheduler peers, and record their deliberate hits."
    }
  ],
  "reopenWhen": "A slow double, inventory gap, first-pass failure, invalid reuse observation or measurement shows the declared load class or instrumentation is insufficient."
}
```

D001's goal and trap comparisons apply. The historical collector inflated beyond
four times its solo observation; twice the shared slot count leaves explicit
headroom without changing the standalone bound. A normalized one-minute host
load above two, or more peers than the declared cap allows, is reported as
outside the measured class. Other hits retain an unestablished cause for
diagnosis; CPU load is an observation, not proof of causality. The five-run
series must test this choice, and cannot be replaced by an unchanged retry.

## WO-128-D005

```json
{
  "id": "WO-128-D005",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next and the standing classified-release opt-out default.",
  "decision": "Complete the missing activation target as application v0.17.3 above the observed local v0.17.2 tag. Patch skeleton to 0.15.3 for internal deadline observation and console to 0.1.5 for the load-derived collector bound. Preserve compiler, kernel, exported contracts, package privacy and publication controls.",
  "evidence": [
    "docs/work-orders/WO-128-fresh-gates-pass-first-time.md",
    "docs/product/06-roadmap.md#release-boundary",
    "packages/skeleton/package.json",
    "packages/console/package.json"
  ],
  "rejected": [
    {
      "option": "Bump unchanged components or defer the assigned patch preparation",
      "reason": "Neither matches the bounded compatibility impact or the standing release duty."
    }
  ],
  "reopenWhen": "A newer release baseline collides with this unpublished target, or a compatibility-impacting change enters the authorized scope."
}
```

## WO-128-D006

```json
{
  "id": "WO-128-D006",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next; complete deadline inventory and current evidence required by WO-128.",
  "decision": "Include the beacon contention smoke-test timer and the discovery helper in the scoped inventory. Pin the new internal deadline helper with the frozen harness runtime and include it in the feedback source snapshot. Regenerate authority and source-pinned feedback evidence in new WO-128 editions, preserving historical editions and the existing live read-only feedback audit protocol.",
  "evidence": [
    "scripts/benchmark-beacon-contention.mjs",
    "scripts/discover.mjs",
    "scripts/test-beacon-fixture.mjs",
    "packages/skeleton/test/control-beacon-cli.test.ts",
    "packages/skeleton/src/feedback-audit.ts",
    "scripts/lib/harness.mjs",
    "docs/evidence/WO-128/isolated-baselines.json"
  ],
  "rejected": [
    {
      "option": "Leave reachable timers unobserved or reuse evidence whose source snapshot predates the imported helper",
      "reason": "NoOp would leave a coverage hole or stale evidence. Including the helper preserves the existing evidence boundary without weakening checks or changing exported contracts."
    }
  ],
  "reopenWhen": "A newly reachable timer or runtime dependency is absent from the inventory or its pinned evidence closure."
}
```

D001's goal and trap comparisons remain applicable. The extra source closure
and existing audit are necessary evidence work, not a new recurring phase gate.

The first remaining-task baseline found an executor-introduced fixture closure
gap: the minimal worktree bootstrap copied `gate-evidence.mjs` without its new
`gate-deadlines.mjs` import. The trace established `ERR_MODULE_NOT_FOUND`, not
a timeout. The shared bootstrap now copies that dependency. The failed
observation is retained. A subsequent fresh fast gate found the same omission
in the beacon CLI test's separate minimal source copy. Its contention smoke
script now imports the helper, so that copy list includes it too. That gate
finished in 118.79 s with 11 passing tasks and only the module-resolution
failure; it was not a load timeout. Both failures precede the five-run series.

## WO-128-D007

```json
{
  "id": "WO-128-D007",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next; diagnose and repair a non-load defect found by the required five-run series before restarting its count.",
  "decision": "Repair the signal-cleanup fixture protocol. Start the real release-suite shell in its own process group, wait for a foreground child to acknowledge that the real cleanup traps are installed, and signal that owned group. Keep the 15-second deadline and both exit-status and residue assertions. Preserve the failed first series and restart five fresh gates on the repaired source under the shared cap.",
  "evidence": [
    "docs/evidence/WO-128/shared-series-001.json",
    "docs/evidence/WO-128/signal-cleanup.json",
    "docs/evidence/WO-128/fixture-results.md",
    "scripts/test-fixture-temp-root.sh",
    "scripts/test-release.sh",
    "https://github.com/nodejs/node/blob/v22.17.0/doc/api/child_process.md",
    "https://github.com/nodejs/node/blob/v22.17.0/doc/api/process.md"
  ],
  "rejected": [
    {
      "option": "Accept four passes, raise the 15-second deadline, or repeat the unchanged fixture",
      "reason": "The fifth run failed and the quiet-host negative control reproduces shell-only signaling with a waiting child. A longer deadline does not repair signal delivery."
    },
    {
      "option": "Retain exclusivity for harness-fixtures and process-debt because of this failure",
      "reason": "Both suites had finished before the failed cleanup probe; its diagnostic had three different peers and host load 0.498 per CPU. The waiting-child reproduction establishes a fixture protocol defect independent of shared load, so criterion 5 calls for repair and a new series."
    }
  ],
  "reopenWhen": "The explicit ready handshake, owned-group interruption, expected exit status, or root-residue check fails under the declared load."
}
```

This is the diagnosis path D001 and D004 require. The first series costs
3,450,874 ms across five fresh attempts; all observations remain evidence,
and its four passes do not count toward acceptance of the repaired source.
The new waiting child makes the old shell-only signal fail deterministically
without load. A redundant second group signal after process exit was removed
after the negative control exposed an `EPERM`; each interruption path now
sends its terminating signal once. No error is suppressed to obtain a pass.
The unchanged deadline and negative control guard against rule beating and
drift; the measured cost prevents hiding the commons cost or treating receipt
count as the goal. The other D001 trap comparisons remain applicable.

## WO-128-D008

```json
{
  "id": "WO-128-D008",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next, including the approved bounded planning fixture repair; all six WO-128 acceptance criteria remain in scope.",
  "decision": "Keep harness-fixtures and process-debt under the shared cap after five consecutive fresh full passes, all 78 tasks executed with zero reuse on unchanged source. Retain the diagnosed failed first series. Record the measured wall-clock beside the exact prior gate and settle the console collection follow-up through its preserved FUP-0054 lineage.",
  "evidence": [
    "docs/evidence/WO-128/shared-series-002.json",
    "docs/evidence/WO-128/shared-series-001.json",
    "docs/evidence/WO-128/deadline-comparison.json",
    "docs/evidence/WO-128/README.md",
    "docs/product/07-execution-guide.md#candidate--cold-gate-structural-cuts"
  ],
  "rejected": [
    {
      "option": "Retain exclusivity after all five shared passes",
      "reason": "The assigned reopening test passes; retaining the workaround by inertia contradicts the evidence-based criterion."
    },
    {
      "option": "Claim a speedup, discard the failed series, or allocate structural performance work now",
      "reason": "The median 694561 ms exceeds the prior 476304 ms gate, the failed series is material evidence, and structural cuts remain a separately measured planning candidate."
    }
  ],
  "reopenWhen": "A diagnosed first-pass failure within the declared load class, a new reachable deadline, a changed host/load policy or a materially changed suite baseline invalidates the measurements. Structural cuts require their own planning allocation."
}
```

The outcome advances the reliable-validation part of the critical path.
Policy resistance remains bounded by unchanged preflights, reuse identity and
publication controls. Commons cost is explicit: the failed series cost
3,450,874 ms and the accepted series 3,473,292 ms, 115.40 minutes
combined, before targeted work and the final canonical gate. Drift is judged
by five fresh successes, not larger constants. Escalation and shifting the
burden are checked by the retained no-retry behavior and the repaired fixture
cause. Success to the successful is checked by removing the old workaround
only after measurement. Rule beating is checked by retaining every failed
attempt, negative controls and full inventory. Seeking the wrong goal is
checked by explicitly reporting the longer median, rather than treating more
records as performance. Under Naive Interventionism, semantic timers, real
process boundaries and the read-only collector remain. NoOp would preserve
the demonstrated fixture mismatch, signal defect and inadequate collector
headroom. Five samples support this bounded host decision; they do not prove
that future gates cannot fail. Token observations and their limited scope
remain in the canonical usage meter; no unmeasured dollar cost is invented.

## WO-128-D009

```json
{
  "id": "WO-128-D009",
  "date": "2026-09-12",
  "dispatch": "Operator resume: next; correct the executor-authored write-back rejected by the final canonical gate.",
  "kind": "correction",
  "decision": "Use the existing literal Execution record heading and move its date into the body. Preserve the planning-continuation validator and all work-order authority bytes except the permitted release assignment and execution appendix.",
  "misread": "A dated Execution record heading was treated as the allowed execution appendix.",
  "meant": "The existing continuation contract requires the exact heading ## Execution record, followed by a blank line and body text.",
  "changed": "Corrected the heading and retained the date in its body. The first canonical final gate passed 36 of 37 suites, failing only the current-planning check on this appendix format; it was not a deadline or load failure. Retry the canonical command after the corrected write-back and refreshed projections.",
  "evidence": [
    "scripts/lib/plan-continuation.mjs",
    "docs/work-orders/WO-128-fresh-gates-pass-first-time.md#execution-record",
    "docs/evidence/WO-128/fixture-results.md"
  ],
  "rejected": [
    {
      "option": "Relax the planning continuation validator or repeat the unchanged gate",
      "reason": "The authored appendix did not follow its existing format; correcting that document preserves the authority boundary."
    }
  ],
  "reopenWhen": "A required execution write-back cannot be expressed within the existing appendix contract."
}
```

The failed final gate cost 367,202 ms of runner wall-clock (367,963 ms at
the harness boundary), with 32 fresh and 46 reused tasks; the diff check
passed. This documentation correction leaves the measured implementation
and five-pass series unchanged. D001's trap comparisons remain applicable:
preserve the refusal, account for the extra gate, and repair the cause before
retrying. No new runtime capability, deadline or recurring phase step is added.

## WO-128-D010

```json
{
  "id": "WO-128-D010",
  "date": "2026-09-12",
  "dispatch": "Operator resume: final review; VER-001 F2 against the order's Cost line and objective.",
  "kind": "correction",
  "decision": "Record the measured cost of shared scheduling in the diagnosis, the README and product 07, keep the flags removed as criterion 4 prescribes, and leave restoring them as an open operator decision.",
  "misread": "The order's Cost line predicted that removing exclusivity would save up to 206 s of concurrency-one time per fresh gate, and the diagnosis called the removal a measured benefit.",
  "meant": "Criterion 4 prescribes removal after five shared passes and asks for the wall-clock beside the prior gate; only a same-source comparison isolates what the scheduling change costs.",
  "changed": "VER-001 F2 ran the same 78 tasks on the same source back to back: 462.3 s with harness-fixtures and process-debt exclusive against 666.5 s shared, about 204 s more per fresh gate. The accepted series (689.5 to 699.4 s over 2,674 to 2,711 s of task time) against the prior exclusive gate (476.3 s over 1,229 s) agrees. The diagnosis, the README and product 07 now name that cost. The flags stay removed because criterion 4 prescribes it; restoring them is the operator's decision, and neither reliability repair depends on the shared class.",
  "evidence": [
    "docs/verifications/WO-128/VER-001.md#findings",
    "docs/evidence/WO-128/shared-series-002.json",
    "docs/evidence/WO-128/prior-cold-gate.json",
    "docs/evidence/WO-128/all-isolated-baselines.json",
    "docs/evidence/WO-126/decisions.md#wo-126-d012"
  ],
  "rejected": [
    {
      "option": "Restore the exclusive flags in review",
      "reason": "Criterion 4 prescribes removal after five passes; changing that outcome is a scope decision the operator owns, and one exclusive sample is not the five-run series the criterion demands."
    },
    {
      "option": "Fail the review over the outcome",
      "reason": "A repair cannot act on it without amending the order, so a fail cycle would cost a verification and a review without changing the gate."
    },
    {
      "option": "Keep the benefit wording",
      "reason": "It is an unsupported claim in committed evidence; accuracy takes priority over agreement."
    }
  ],
  "reopenWhen": "The operator decides the scheduling configuration, or a recorded exclusive gate on this source does not reproduce the F2 difference."
}
```

Criterion 4's rule was satisfied while its purpose, regained parallelism, went
the other way; recording the cost checks rule beating and seeking the wrong
goal. Drift to low performance is the risk of normalizing a fresh gate about
45% longer than the prior exclusive one, so the number stays visible beside
the reliability result rather than absorbed into it. Tragedy of the commons:
each shared fresh gate consumes roughly twice the task time of the exclusive
one. NoOp for this correction would publish the unsupported claim; restoring
the flags in review would be Naive Interventionism against the order's own
rule. The change is two rows and reversible; the isolated class still exists.

## WO-128-D011

```json
{
  "id": "WO-128-D011",
  "date": "2026-09-12",
  "dispatch": "Operator resume: final review; VER-001 F1.",
  "decision": "A task skipped for a failed dependency is never a scheduler predecessor. The group edge considers only started tasks, and a fixture schedules the F1 table serially and computes the critical path over the started rows.",
  "evidence": [
    "docs/verifications/WO-128/VER-001.md#findings",
    "scripts/test-runner.mjs",
    "scripts/test-gate-deadlines.mjs"
  ],
  "rejected": [
    {
      "option": "Nominate the crash for a later order",
      "reason": "The gate would exit without recording its failed suites. The repair is one predicate under the existing runner fixtures, and today's single group escapes it only because its members share one dependency list."
    },
    {
      "option": "Tolerate a missing predecessor in the critical-path computation",
      "reason": "That weakens the integrity check the timeline fixture asserts; the timeline should never receive the edge."
    }
  ],
  "reopenWhen": "A recorded gate row names a predecessor absent from its timeline, or a group gains members with different dependency lists that the fixture's skip order does not cover."
}
```

Bounded adjacent repair within a named path under shared checks:
`runner-fixtures` runs the new case, and the final canonical gate executes it.
Scheduling order is unchanged; only the recorded edge differs.
