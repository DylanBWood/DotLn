# WO-229 decisions

## WO-229-D001 — distinguish execution cost and experienced delay

```json
{
  "id": "WO-229-D001",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Judge the document-gate cost condition on the execution-only median, retaining the wall-clock median and per-sample contention. Subtract only a matching child gate row's measured lane-wait union; unavailable or failed samples remain unavailable. Attribute observed relations without checkout identities. Relation-specific unions can overlap when different holders block at the same time; the total union counts that time once.",
  "evidence": [
    "WO-229 execution steps 1 and 5; README.md base fixture: 1461 ms wall, 1172 ms build lane wait, no relation or gate wait summary",
    "scripts/lib/planning-conditions.mjs currently measures child wall time and loses failed sample details",
    "WO-217-D040 preserves availability-only admission; WO-217-D041 omits private host paths",
    "scripts/lib/host-resources.mjs nativeBinary currently creates the host directory and may compile the process reader"
  ],
  "rejected": [
    {"option": "Judge cost on wall time alone", "reason": "Another checkout's work would be attributed to this document gate."},
    {"option": "Hide wall time or failed samples", "reason": "Both are part of the operator's experience; missing evidence cannot establish low cost."},
    {"option": "Divide a mixed interval arbitrarily between relations", "reason": "The registry records simultaneous blockers, not their causal shares."},
    {"option": "NoOp", "reason": "The controlled baseline reproduces the missing attribution."}
  ],
  "reopenWhen": "A condition consumes an unrelated row, loses a failed contended sample, exposes a checkout path, or observed waiting cannot be reconciled with its total union."
}
```

## WO-229-D003

```json
{
  "id": "WO-229-D003",
  "date": "2026-10-23",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.93.0, the next minor above the observed release baseline v0.92.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.92.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-229-host-lane-visibility.md"
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

## WO-229-D004 — keep inspection outside the mutating reader

```json
{
  "id": "WO-229-D004",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Keep the non-mutating census in host-lanes.mjs: resolve the existing native helper by its source digest and reuse the existing exported parser. Missing helpers report unavailable without compiling. Acquisition continues using its existing mutating reader. Regenerate the three deterministic editions and carry the base feedback edition as the order requires.",
  "evidence": [
    "The first sync refused feedback carry after an attempted readOnly option in host-resources.mjs changed a source judged by the live feedback episode. That option has been relocated, preserving the read-only behavior; no gate row was used to justify reverting a fix.",
    "host-resources.mjs exports parseNativeSnapshot; its nativeBinary creates directories and compiles missing helpers",
    "The first bounded controls passed five cases, including byte-identical registry inspection and a CLI read; the relocated reader will be rechecked",
    "WO-229 steps 7 and 10 require non-mutating inspection and carry, with no live episode"
  ],
  "rejected": [
    {"option": "Add the optional mode to the shared mutating reader", "reason": "It expands the changed behavioral surface to live episode sources; this order explicitly requires no live model run."},
    {"option": "Use process names or second-resolution ps identity", "reason": "The existing lease ownership uses the native kernel identity; a weaker census could mislabel retained holders."},
    {"option": "Allow first-read compilation", "reason": "It violates the read-only listing's no-write criterion."}
  ],
  "reopenWhen": "The native helper naming or output protocol changes, or a read-only command changes registry bytes."
}
```

## WO-229-D002

Measured host requests retain local exclusivity.

```json
{
  "id": "WO-229-D002",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "At recorded capacity 8, use the ceiling of the largest observed CPU/wall ratio across all successful samples, including the retained incomplete attempts with 25 percent headroom, or RSS divided by the per-lane memory budget, whichever is larger, with minimum one. Integer needs: {'format': 3, 'configuration-root': 2, 'registrations': 2, 'declarations': 4, 'generated': 2, 'host': 2, 'kit-verify': 2}. Resize only a need strictly below half that capacity; effective requests: {'format': 3, 'configuration-root': 2, 'registrations': 2, 'declarations': 8, 'generated': 2, 'host': 2, 'kit-verify': 2}. Keep all local lanes for each structural task and kit verification. These observations size requests; they do not establish a worst-case resource bound or fair admission.",
  "evidence": [
    "sizing.json and size-requests.mjs preserve the larger successful declarations sample in attempt002: need four, so its request remains eight; no favorable-sample selection.",
    "structural-need.json: 42 successful measurements, three per task in core and in the v0.92.0 fixture export; CPU, OS peak RSS, wall and ambient load retained",
    "structural-attempt001.json retained the new imports' missing declarations; structural-attempt002.json retained the fixture export's stale meta/index failure. Both were repaired through the named source declarations and fixture sync before the complete series.",
    "scripts/measure-lanes.mjs computes the same request rule from the retained samples",
    "structural-admission.json: full-capacity document wait 3050 ms versus measured-request wait 2108 ms; measured wait is below the complete gate longest task at 3062 ms, while that gate continues admitting peers. Both gates pass in both arms.",
    "Core has no KIT-MANIFEST.json; its three kit-verify runs use core's verifier on the same export, with that distinction explicit in the record."
  ],
  "rejected": [
    {
      "option": "Keep all seven host requests at full capacity",
      "reason": "The successful measurements justify the bounded reductions required by criterion 5."
    },
    {
      "option": "Use one slot universally",
      "reason": "Core formatting and declarations consume more than one CPU on average."
    },
    {
      "option": "Introduce a fair queue",
      "reason": "The order preserves the mixed-client boundary in WO-217-D040."
    }
  ],
  "reopenWhen": "A larger representative CPU/RSS sample, a memory guard failure or the sibling-gate comparison contradicts the measured sizing. A fairness guarantee still needs the compatible-client migration D040 names."
}
```

## WO-229-D005 — base evidence precedes changes

```json
{
  "id": "WO-229-D005",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Retain a real two-checkout waiting fixture and the unavailable base condition, rather than assign a passing baseline median.",
  "evidence": [
    "README.md records the 1461 ms wall fixture, 1172 ms build wait and missing relation/summary fields",
    "The two base document attempts failed on unprepared release-surfaces; release prepare assigned v0.93.0."
  ],
  "rejected": [
    {
      "option": "Treat the base wall time as its own work cost",
      "reason": "The fixture row directly separates 203 ms of work from the waiting span."
    }
  ],
  "reopenWhen": "A repeated fixture no longer reproduces the base gap, or the retained base row is shown to describe different commands."
}
```

## WO-229-D006 — label checkout relation at observation

```json
{
  "id": "WO-229-D006",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Compare realpaths and expose this-checkout, another-checkout or unknown; the terminal renders the corresponding human labels. Unresolvable or absent paths remain unknown.",
  "evidence": [
    "scripts/lib/host-lanes.mjs holderObservation and checkoutRelation",
    "Bounded host controls passed other-checkout, symlinked own nested-holder and legacy missing-worktree cases."
  ],
  "rejected": [
    {
      "option": "Print an identity or salted checkout tag",
      "reason": "The operator asked for relation; an extra identity has no necessary consumer."
    }
  ],
  "reopenWhen": "An alias is mislabeled, a missing path is treated as known, or diagnostics expose a checkout path."
}
```

## WO-229-D007 — union waits and preserve the critical-path total

```json
{
  "id": "WO-229-D007",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Compute one gate wait union from scheduler starts plus measured admission waits. Attribute from retained observation changes; time before the first retained observation and lock time are unknown. Include overlap-reservation observations. Split critical-path waitMs into laneWaitMs and gapMs, preserving the prior total; strip timing and attribution from reused tasks.",
  "evidence": [
    "scripts/lib/gate-timeline.mjs and scripts/test-runner.mjs",
    "The bounded arithmetic control passed and its sum-instead-of-union mutation failed. A real gate printed and recorded another-checkout waiting without paths."
  ],
  "rejected": [
    {
      "option": "Sum per-task waits",
      "reason": "Parallel wait intervals would be counted more than once."
    },
    {
      "option": "Infer relations before the retained observation history",
      "reason": "The capped history does not establish those earlier holders."
    }
  ],
  "reopenWhen": "The recorded union exceeds wall time, a reused task carries old attribution, or the timeline parts no longer sum to waitMs."
}
```

## WO-229-D008 — arithmetic, gate output and reuse controls

```json
{
  "id": "WO-229-D008",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Keep deterministic interval assertions beside a real waiting-gate fixture and both runner and planning reuse checks.",
  "evidence": [
    "controls.json: parallel union positive exit 0, mutated exit 1",
    "scripts/test-gate-deadlines.mjs checks overlapping waits, relation changes, unknown lock time and critical-path gaps",
    "scripts/test-host-guard.test.mjs checks the real summary and recorded row for path omission."
  ],
  "rejected": [
    {
      "option": "Only snapshot the terminal text",
      "reason": "That would not establish union arithmetic or reuse freshness."
    }
  ],
  "reopenWhen": "A renderer-only pass can conceal a wrong recorded wait or a stale carried task."
}
```

## WO-229-D009 — bind slow samples to the child attempt

```json
{
  "id": "WO-229-D009",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Bind each child with a unique planningSampleId and read its newly recorded document row inside that command's time window; retain each sample's wait and contention, with both medians. A failed or missing sample makes the condition unavailable and is not retried; the docs-check condition reuses the same attempts.",
  "evidence": [
    "scripts/test-plan-refutation.mjs: wall medians 110 seconds and execution median 10 seconds; holds false on execution cost",
    "The old-row and timeout controls retain unknown or failed contention appropriately",
    "controls.json: retaining lane delay in execution cost fails the paired assertion."
  ],
  "rejected": [
    {
      "option": "Parse the rounded PASS line as the cost evidence",
      "reason": "The child row supplies full precision, wait and failure evidence."
    },
    {
      "option": "Use the latest historical success",
      "reason": "A child that recorded no row would inherit an unrelated sample."
    }
  ],
  "reopenWhen": "A failed attempt is converted to a value, a stale row is consumed, or docs-check launches duplicate failed attempts."
}
```

## WO-229-D010 — inspect without repairing the registry

```json
{
  "id": "WO-229-D010",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Keep stale records, lock files and native helper preparation unchanged during inspection. Report retained parent reservations and nested holders with ownership and age; aggregate top-level slots separately from contained nested slots.",
  "evidence": [
    "Bounded host controls passed the byte-identical registry and actual lanes CLI assertions, plus absent registry and unprepared reader cases",
    "controls.json: deleting a stale record makes the paired inspection assertion fail."
  ],
  "rejected": [
    {
      "option": "Call liveHolders under the host lock",
      "reason": "Its reclamation is a write and it competes with the admissions being inspected."
    }
  ],
  "reopenWhen": "Inspection creates, deletes or changes registry content, or nested slots are presented as additional host capacity."
}
```

## WO-229-D011 — regenerate selected editions and carry the live audit

```json
{
  "id": "WO-229-D011",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Mint authority, artifact-identity and verification revision 001 under WO-229; carry feedback from WO-225/feedback-001 to WO-229/feedback-001, retaining its WO-217 live audit. Explicit --write generators repaired the absent selected edition files after sync correctly refused unreadable inputs. Sync then reported all selected editions current and refreshed the console selfhost fixture.",
  "evidence": [
    "docs/evidence/current.json selects all four WO-229 revision 001 editions",
    "The three --write commands completed; feedback-evidence --carry reported no live episode; npm run sync passed."
  ],
  "rejected": [
    {
      "option": "Treat an absent edition as a passing stale check",
      "reason": "Sync correctly refuses unreadable evidence instead of blessing it."
    },
    {
      "option": "Run a fresh live episode",
      "reason": "The final implementation does not change the live-judged resource reader; the order requires a deterministic carry."
    }
  ],
  "reopenWhen": "A later edit changes a live-judged source or a selected edition check refuses its source binding."
}
```

## WO-229-D012 — write back the measured behavior

```json
{
  "id": "WO-229-D012",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Update the cited execution-guide sections, gate architecture and kit instructions in place. Prepare application v0.93.0 as an additive minor; package source and dependency versions are unchanged, so no component bump is required.",
  "evidence": [
    "scripts and their tests carry the implementation; no package src file or dependency changes",
    "release prepare --local assigned v0.93.0; generated release surfaces passed during all three core generated measurements",
    "The architecture records the measured requests and retains the explicit lack of a fairness guarantee."
  ],
  "rejected": [
    {
      "option": "Bump all package versions",
      "reason": "No component runtime source changed."
    },
    {
      "option": "Publish a separate instruction document",
      "reason": "The operator and future orders already read the cited existing sections."
    }
  ],
  "reopenWhen": "A package runtime change joins the scope, or later evidence changes the request sizing or admission contract."
}
```

## WO-229-D013 — close independent review findings

```json
{
  "id": "WO-229-D013",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Preserve active admission waits separately from completed-task evidence when a gate stops. Bind slow samples to a unique child marker, retain the runner CLI's message-only failure handling, and run the new planning fixtures only through the fixture selection. Update the paired control with the same child marker.",
  "evidence": [
    "Two fresh read-only codex-spawn-agent workers reviewed only the order and frozen diff, then checked correction diffs; self-review.md records their findings and dispositions.",
    "Four bounded host tests pass, including a real gate that completes its build and stops while waiting behind a sibling: the stopped row retains another-checkout wait and only completed execution evidence.",
    "Two bounded planning fixtures pass with an unrelated concurrent row; the correct marker supplies each sample.",
    "Bounded --check-only passes with only Plan gate output and no fixture TAP output.",
    "The three paired controls pass their positive assertions and reject their mutations after the marker correction."
  ],
  "rejected": [
    {"option": "Use a timestamp window alone", "reason": "An overlapping document invocation could supply the selected row."},
    {"option": "Count only completed tasks' waits at stop", "reason": "The interrupted admission is the contention a failed planning sample needs to preserve."},
    {"option": "Treat waiting tasks as completed execution evidence", "reason": "They have not executed; their wait belongs only in the gate's attribution."}
  ],
  "reopenWhen": "A stopped row loses an active wait, a child consumes an unrelated row, or check-only starts fixture work."
}
```

## WO-229-D014 — prepare the inspection fixture independently of cache history

```json
{
  "id": "WO-229-D014",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Warm the native-reader cache outside the inspection fixture, then explicitly prepare that fixture's reader in a fresh process before taking the byte snapshot. Keep inspection non-mutating and keep its unprepared-reader refusal. Run a fresh complete gate after the focused reproduction and repair.",
  "evidence": [
    "The first complete review row at 2026-10-23T06:10:58.985Z failed runner-fixtures: 221 of 222 cases passed; lanes CLI reads live holders failed with Host process reader unavailable. The run completed before the canonical stop command, which reported no active gate and changed nothing.",
    "host-resources.mjs nativeBinary caches by helper name and returns an existing binary before resolving the requested directory. Earlier cases can therefore leave the fixture registry without its own reader.",
    "Bounded wo229-reader-cache.mjs reproduced successful acquisition in a second registry without a local reader, followed by the expected read-only unavailable result.",
    "The repaired bounded lanes CLI reads case passes with a warmed external cache and still asserts byte-identical inspection and refusal without a prepared reader."
  ],
  "rejected": [
    {"option": "Let inspection compile a missing helper", "reason": "It would violate the read-only acceptance criterion."},
    {"option": "Change the shared reader cache or skip the byte comparison", "reason": "The failed fixture assumed a setup side effect; explicit preparation establishes its intended precondition without changing the live reader or weakening the assertion."}
  ],
  "reopenWhen": "The diagnostic mutates its registry, or its prepared-reader fixture fails independent of cache history."
}
```

## WO-229-D015 — use ordinary budgets for visibility fixtures

```json
{
  "id": "WO-229-D015",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Give the two new real-gate visibility fixtures the ordinary memory budget instead of the helper's deliberate containment ceiling. Retain the small ceiling as the default for every existing containment fixture, and retain the production budgets unchanged.",
  "evidence": [
    "The second complete run's waiting and stopped visibility cases recorded gate memory stops at 286249440 and 286757656 bytes against the helper's 268435456-byte ceiling, before their intended lane assertions.",
    "The fixture helper's gateShare intentionally sets four times 64 MiB for containment cases; the visibility cases test attribution and interruption rather than a memory breach.",
    "Both visibility cases pass together under the ordinary budget in the bounded check at 2026-10-23T06:24:12.343Z."
  ],
  "rejected": [
    {"option": "Raise the containment ceiling everywhere", "reason": "That would change the memory tests' asserted boundary."},
    {"option": "Ignore the resource stop or weaken the pass assertions", "reason": "A killed gate cannot establish the requested lane behavior."}
  ],
  "reopenWhen": "A visibility fixture exceeds ordinary budgets, or a containment fixture no longer verifies its original small ceiling."
}
```

## WO-229-D016 — start the memory-breach fixture from an executed task

```json
{
  "id": "WO-229-D016",
  "date": "2026-10-23",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Replace the existing memory fixture's 500 ms allocation timer with a signal sent by its allocation task to the fixture runner. Keep its 512 MiB gate budget, typed failed-row assertion and local memory-stop assertion. An absent result now reports the captured child output instead of a secondary undefined.slice error. The announced, checked-in adjacent queue item is completed.",
  "evidence": [
    "The second complete run's memory-breach fixture had no gate-budget-result line. A focused nominal run passed, and an 1800 ms admission delay also passed; these did not establish the cause.",
    "A bounded control holding the lane lock for 5000 ms reproduced a memory-budget stop before acquisition and the missing result. Its allocator fired while gate preparation was still pending.",
    "fixture-controls.json records the negative control and both repaired positives. The repaired delayed run recorded a gate memory stop at 624160792 bytes against 536870912 and retained the local stop count.",
    "Queue revision 5 records adjacent-0001 completed after its declared bounded check passed; the actor-attested message check-in followed the announcement and independent visibility-fixture work."
  ],
  "rejected": [
    {"option": "Increase the allocation timer", "reason": "Another preparation delay would recreate the race."},
    {"option": "Raise the memory ceiling or accept an absent result", "reason": "Either would weaken the behavior this fixture is meant to prove."},
    {"option": "Retry until a passing run appears", "reason": "The delayed control supplies a reproducible failure and a bounded repair."}
  ],
  "reopenWhen": "The started-task trigger can still allocate before gate evidence is initialized, or the fixture stops proving the original memory boundary."
}
```

## WO-229-D017 — release the waiting fixture after observed contention

```json
{
  "id": "WO-229-D017",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Release the sibling fixture lease 250 ms after the gate actually prints WAIT. Keep a 30 s failure bound and unconditional cleanup. Add 1250 ms of startup delay to the fixture so the former one-second release timer cannot satisfy it. Preserve the wait, relation, path-omission and recorded-row assertions.",
  "evidence": [
    "The third complete run failed only the waiting fixture's wallMs > 100 assertion in runner-fixtures; the gate itself passed. The canonical stop ended the already-failed complete run and retained its stopped row at 2026-10-23T06:48:09.763Z.",
    "A bounded copy using the original timer plus 1250 ms startup delay reproduced the same assertion failure.",
    "The repaired bounded fixture passes with that delay, using observed WAIT as the release trigger rather than a guess at gate startup time. The earlier focused runner pass therefore did not establish this load-independent setup."
  ],
  "rejected": [
    {"option": "Increase the one-second timer", "reason": "A slower start could still release the holder before the gate waits."},
    {"option": "Drop the wait threshold", "reason": "The fixture must demonstrate real waiting and attribution."}
  ],
  "reopenWhen": "The holder can be released before observed WAIT, or a missing WAIT can leave the fixture unbounded."
}
```

## WO-229-D018 — attribute observed waiting beyond the retained diagnostic history

```json
{
  "id": "WO-229-D018",
  "date": "2026-10-23",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails criterion 2. gateHostLaneWait attributes a task's wait from its retained hostLaneWaitObservations, which acquisition and the runner cap at 32 entries, and labels all time before the first retained entry checkout unknown. A capacity observation is published on every holder change and every 30 s heartbeat, so any wait longer than about 960 s, or with more than 32 holder changes, attributes observed waiting to unknown even when every printed WAIT line names another checkout. The order's Design splits the union by the relation of the holders observed in each interval, and its known issues admit only lock-phase waiting as unknown. Correction to D007: the capped history is the runner's own retention choice, not a limit of what was observed. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-229/verification-001-attribution.mjs, rotating case: a real document gate waits 6,858 ms while a sibling checkout's holders rotate 60 times; all 64 WAIT lines name another checkout, yet the row records 3,436 ms another-checkout and 3,422 ms unknown and the summary prints 3.4 s behind checkout unknown. Exit 1.",
    "The same file, static case: one unchanging other-checkout holder with the heartbeat scaled to 50 ms; 64 published observations all name another checkout, 32 are retained, and 3,533 of 7,064 ms are attributed to unknown.",
    "Inference from the consumed complete row: its 106 tasks give at most 212 holder changes; the last 32 span 837,057 of 1,616,143 ms, so a sibling waiting through that run would attribute at least 48 percent to unknown. With an unchanging holder the order's 1,520.76 s example would still lose about 560 s.",
    "scripts/lib/host-lanes.mjs publishWait and scripts/test-runner.mjs observeWait shift the oldest observation beyond 32; scripts/lib/gate-timeline.mjs starts each task's attribution at unknown until its first retained observation."
  ],
  "rejected": [
    {"option": "Pass criterion 2 on its short-wait fixtures", "reason": "Those fixtures hold fewer than 32 observations constant; the order's motivating waits are 304.86 s and 1,520.76 s."},
    {"option": "Board as a follow-up because product 07 now discloses it", "reason": "The disclosure is the executor's write-back of its own choice; the order admits lock time only, and the split exists to name who a long wait was behind."},
    {"option": "Retain every observation", "reason": "Unbounded records are unnecessary: relation segments change far less often than holders."}
  ],
  "followup": "WO-229 repair: attribute every lane-wait interval to the relations of the holders observed for it, independently of the 32-entry diagnostic cap, for example by a compact per-task relation-segment record or running per-relation totals kept at observation time. Only lock-phase time and time before the first capacity observation stay unknown; no path enters the row. Add fixtures with more than 32 observations of one unchanging other-checkout holder and with more than 32 holder changes, and correct product 07's sentence on time before the retained history.",
  "reopenWhen": "verification-001-attribution.mjs exits 0 on the repaired subject and an independent re-verification confirms attribution for a wait longer than the cap."
}
```

## WO-229-D019 — the bounded document wait must hold while the complete gate still runs

```json
{
  "id": "WO-229-D019",
  "date": "2026-10-23",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails criterion 5. The measured requests leave declarations at full capacity (D002: need four, not under half of eight). A full-capacity request is admitted only when no other top-level holder remains, so a short document gate's wait is bounded by the sibling complete gate's next empty-registry moment, not by its longest task. The executor's sibling fixture meets the inequality only because its complete gate's wall time is within about 190 ms of its longest task; its declarations admission follows the complete gate's last task. Its full-capacity arm also meets the bound, so only the separate 500 ms comparison distinguishes the arms. Varying the complete gate to keep admitting staggered peers after its longest task, the measured document gate waits 5,522 ms against a 3,066 ms longest task. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-229/verification-001-bound.mjs, executor shape: measured document wait 2,078 ms under the 3,066 ms longest task, but declarations (8 slots) waits 1,773 ms and is admitted 87 ms after the complete gate's last task ends; the full-capacity arm waits 3,027 ms, also under its 3,070 ms longest task.",
    "The same file, staggered shape: the complete gate keeps two peers running until about 6.3 s. Full-capacity document wait 6,122 ms; measured 5,522 ms, with declarations admitted 93 ms after the complete gate's last task ends. Both exceed the 3,066 to 3,067 ms longest task. Exit 1.",
    "scripts/lib/host-lanes.mjs admits a request only when its siblings' slots plus the request fit the recorded capacity; scripts/test-runner.mjs structuralHostSlots omits declarations, so it requests all local lanes, eight.",
    "WO-229 Objective and Design: the admission regression proves a short document gate's wait is bounded while a complete gate continues admitting work; criterion 5 bounds it under the complete gate's longest single task."
  ],
  "rejected": [
    {"option": "Pass criterion 5 on the executor's inequality", "reason": "The complete gate had ended before the full-capacity declarations request was admitted, so the fixture did not observe the bound while a complete gate runs."},
    {"option": "Resize declarations during verification", "reason": "The verifier does not modify the subject; the order changes a request only when its need is under half the capacity."}
  ],
  "followup": "WO-229 repair: the criterion 5 fixture must keep the sibling complete gate admitting work until after the document gate's last admission, assert that ordering, and show the document gate's total lane wait under the complete gate's longest single task with the shipped requests; the product 07 and architecture sentences must state what that fixture establishes. Under D002 declarations keeps full capacity, which this variation shows cannot meet the bound. If no sizing within the order's under-half rule meets it, record that in the decisions and stop for the operator to choose between sizing declarations at its measured need, amending criterion 5's sizing rule, or waiving criterion 5.",
  "reopenWhen": "verification-001-bound.mjs exits 0 on the repaired subject, or the operator records an amendment or waiver of criterion 5, followed by independent re-verification."
}
```

## WO-229-D020 — an uncontended gate prints a zero lane-wait clause

```json
{
  "id": "WO-229-D020",
  "date": "2026-10-23",
  "dispatch": "resume: verify",
  "decision": "Follow-up, not blocking. formatHostLaneWait appends its clause whenever wallMs is above zero, and lock acquisition alone makes it positive. A gate with no contention therefore prints 0.0 s waiting for host lanes (0.0 s behind checkout unknown), or about 1 s behind checkout unknown across a complete run. This breaks no criterion; it is a rendering defect in a declared surface.",
  "evidence": [
    "The verifier's suite:evidence-sources row at 2026-10-23T11:42:57.231Z: hostLaneWait.wallMs 45, all unknown, no holders; summary 8 passed; 0 failed; 88.44 s; 8 fresh tasks; 0.0 s waiting for host lanes (0.0 s behind checkout unknown).",
    "The consumed complete row records hostLaneWait.wallMs 1,040, all unknown, with no holders observed."
  ],
  "rejected": [
    {"option": "Block the verdict", "reason": "The figure is accurate in milliseconds and the order counts lock time as unknown; only its rendering misleads."}
  ],
  "followup": "WO-229 repair, within the Boy Scout bound in scripts/lib/gate-timeline.mjs: omit the summary clause, or a relation part, whose rounded figure is zero, so an uncontended gate prints no zero lane wait; keep the recorded milliseconds unchanged.",
  "reopenWhen": "An uncontended gate's summary still prints a zero lane-wait clause after the repair."
}
```

## WO-229-D021 — retain attribution independently of diagnostics

```json
{
  "id": "WO-229-D021",
  "date": "2026-10-23",
  "dispatch": "resume: fix",
  "rows": [
    "FUP-1fcb24c8dc65eacc"
  ],
  "decision": "Keep the last 32 detailed holder observations but retain every change of the observed relation set as compact segments. Coalesce unchanged heartbeats and same-relation holder churn. Carry segments through ordinary, overlap and interrupted admissions; clip inherited segments to each task interval and strip them on reuse. Correct D007: an intentionally discarded observation is not missing evidence. Legacy rows without segments still have only their retained history.",
  "evidence": [
    "The unchanged verification-001-attribution.mjs failed before repair: rotating wait 6840 ms, 3428 ms incorrectly unknown; static wait 7011 ms, 3563 ms incorrectly unknown.",
    "Four bounded lane attribution regression cases passed: more than 32 static heartbeats, rotating holders in a passed gate, rotating holders in a stopped gate, and 80 alternating/mixed/lock relation changes with a late-joining interval."
  ],
  "rejected": [
    {
      "option": "Retain every full holder observation",
      "reason": "Heartbeat and holder churn would grow detailed diagnostic history unnecessarily."
    },
    {
      "option": "Keep per-relation scalar totals only",
      "reason": "Parallel task waits require interval unions; totals alone cannot reconstruct overlap."
    },
    {
      "option": "NoOp",
      "reason": "It discards observations for the long waits this order exists to explain."
    }
  ],
  "reopenWhen": "An observed relation interval is lost, an overlap child inherits a completed parent wait, reused tasks retain attribution, or a path enters the output."
}
```

## WO-229-D022 — authorize declarations at its measured four-slot need

```json
{
  "id": "WO-229-D022",
  "date": "2026-10-23",
  "dispatch": "resume: fix; operator scope authorization",
  "rows": [
    "FUP-725da6a1751568ad"
  ],
  "operatorAuthorization": "After the executor proposed allowing declarations to request its measured four slots while preserving the wait bound and strengthening the sibling regression, the operator asked why the under-half restriction existed. The executor checked the order, its planning pass and planning review and found no documented technical justification for the strict cutoff. The operator then directed: fine make the change.",
  "decision": "Amend WO-229 with one exception: declarations requests its measured integer need of four at capacity eight, retaining the existing CPU headroom, memory screen, local exclusivity and available-slot admission. Keep the under-half rule for other tasks and keep criterion 5's wait bound. Strengthen its fixture with staggered complete-gate peers and an assertion that a peer is admitted after the document gate's last admission. No fair queue or capacity change is authorized.",
  "evidence": [
    "The unmodified verification-001-bound.mjs failed: measured document wait 5158 ms versus longest complete task 3064 ms, declarations admitted 67 ms after the complete gate ended.",
    "sizing.json includes all successful retained samples: declarations need four including 25 percent CPU headroom and the memory check; the strict cutoff previously converted that need to eight.",
    "A temporary paired comparison recorded 5146 ms wait with eight and 3042 ms with four against a 3062 ms longest task; every four-slot-arm document admission preceded the complete gate end. Its wrapper exited 1 because the script selected the unchanged measured arm for its verdict; the printed candidate observations are retained, not represented as a passing process.",
    "New input for the rationale check: docs/planning/refutations/2026-10-22-planning-5bb6c2ac729c3e47-052.md, WO-229 judgment. It repeats the cutoff without deriving it."
  ],
  "rejected": [
    {
      "option": "Reduce declarations without authorization",
      "reason": "The original order explicitly limits the sizing change."
    },
    {
      "option": "Weaken or waive the wait bound",
      "reason": "The operator authorized the measured four-slot request and retained the behavioral requirement."
    },
    {
      "option": "Use only the favorable complete measurement series",
      "reason": "The larger successful retained sample remains relevant; measured need stays four."
    },
    {
      "option": "NoOp",
      "reason": "A request equal to capacity requires an empty registry and retains the reproduced delay."
    }
  ],
  "reopenWhen": "Representative CPU or memory evidence exceeds four slots, the strengthened regression fails, or a broader fairness guarantee is proposed."
}
```

## WO-229-D023 — omit zero-rounded summary figures

```json
{
  "id": "WO-229-D023",
  "date": "2026-10-23",
  "dispatch": "resume: fix; adjacent-0002",
  "rows": [
    "FUP-2b72e7d7d29c9b87"
  ],
  "decision": "Suppress summary totals and relation parts that round to zero at the displayed tenth-of-a-second precision. Keep recorded milliseconds unchanged. If the total rounds above zero but every part rounds to zero, print the total without empty parentheses.",
  "evidence": [
    "repair-controls.json records the passing bounded summary regression, including 45 ms omitted, a 1050 ms total with small relation parts omitted, and a 60 ms total with all three 20 ms parts omitted.",
    "The announced adjacent repair followed the attribution checks and a fresh actor-attested check-in after the operator discussion."
  ],
  "rejected": [
    {
      "option": "Round or discard milliseconds in recorded evidence",
      "reason": "Planning calculations need full precision."
    },
    {
      "option": "Print zero to disclose tiny waits",
      "reason": "The diagnostic would imply meaningful waiting while displaying none."
    }
  ],
  "reopenWhen": "A summary prints a zero figure, the formatter changes recorded data, or its precision changes."
}
```

## WO-229-D024 — confirm completion before starting the dependent gate

```json
{
  "id": "WO-229-D024",
  "date": "2026-10-23",
  "dispatch": "resume: fix",
  "decision": "Correct the executor's sequencing error the same day: a returned session identifier meant sync was still running, not that it had completed. Stop the prematurely started review, confirm sync's successful exit, and run a fresh complete review. Require a successful exit code before dependent work.",
  "evidence": [
    "The executor launched repair review 001 while sync was still running, then stopped its own gate through node scripts/harness.mjs evidence --stop.",
    "repair-gate-runs.json retains the stopped row at 2026-10-23T12:15:55.142Z: exit 1, 11657 ms, one completed task and 105 unrun tasks. It supplies no passing evidence.",
    "The subsequent sync completion returned exit 0 and reported all selected outputs current before review 002 started.",
    "Fresh review 002 passed at 2026-10-23T12:44:05.000Z: 40 suites, 106 fresh tasks, zero failures, no unrun tasks and unchanged code identity. The separate evidence-source check also passed."
  ],
  "rejected": [
    {
      "option": "Count the prematurely launched review as evidence",
      "reason": "Its input preparation had not finished and the gate was stopped."
    },
    {
      "option": "Erase the stopped attempt",
      "reason": "Preserving it makes the actual cost and correction reviewable."
    }
  ],
  "reopenWhen": "A dependent command starts before its prerequisite has returned a successful exit code."
}
```

## WO-229-D025

<!-- integration refs/dotln/checkpoint/WO-229/10 -->

```json
{
  "id": "WO-229-D025",
  "date": "2026-10-23",
  "dispatch": "resume: final review; worktree integrate WO-229",
  "decision": "Integration took in nothing: local main, the main the helper fetched and the branch base are all 62fa26761eba698ee0f8dcf59116bc571de3042c, the branch carries no commit of its own, no authored conflict arose and no projection was resolved by hand. Carried-forward claims, judged in FINAL-001: the executor's complete review row at code identity 8b8351e604dbfcd61436b9aea257adc9342e63e26bc36639611f3810ce288092 stands for the integrated tree, because the identity probe read the same value after the merge and this review edits no source; the amended order (D022) is the order VER-002 judged and the order this review judges; application target v0.93.0 remains current over the v0.92.0 baseline with no component-version collision, since no package manifest or lockfile differs from main; the selected editions (authority, artifact-identity, verification and feedback at WO-229 revision 001) and the sibling registry's v0.92.0 row are unchanged evidence inputs, and the sibling receipt of 2026-10-23T04:55:41Z is release-close bookkeeping present since checkpoint 1 and in no commit of main. The affected checks the helper printed pass at the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-229/10",
    "base 62fa26761eba698ee0f8dcf59116bc571de3042c",
    "upstream 62fa26761eba698ee0f8dcf59116bc571de3042c",
    "release preparation: WO-229 target v0.93.0 remains current. Files changed: docs/evidence/WO-229/meta.json. Meter snapshot: docs/evidence/WO-229/meta.json, 4157 bytes. Tag observation: local snapshot only.",
    "Blob comparison of the working tree against refs/dotln/checkpoint/WO-229/10 after the helper returned: 7,145 entries; only docs/evidence/WO-229/decisions.md (this stub), docs/evidence/WO-229/meta.json and docs/lineage/decisions-index.md differ; nothing added or missing; AGENTS.md is the unchanged symlink.",
    "gateCodeIdentity at the integrated tree: 8b8351e604dbfcd61436b9aea257adc9342e63e26bc36639611f3810ce288092, the identity of the passing complete review row recorded 2026-10-23T12:44:05.000Z.",
    "Affected checks at the integrated tree, each exit 0: npm run publication:check (255 of 255, both editions current); node scripts/harness.mjs check (35 surfaces); npm run release -- check-surfaces --local; npm run meta -- --check (the two boarded WO-226 cold-start breaches, no reopen candidate); git diff --check; npm run format:check; the authority, harness, feedback, artifact-identity and verification evidence checks."
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

Integration date: 2026-10-23. Original base: `62fa26761eba698ee0f8dcf59116bc571de3042c`.
Fetched main: `62fa26761eba698ee0f8dcf59116bc571de3042c`. Checkpoint: `refs/dotln/checkpoint/WO-229/10`.
Named stash retained: `b5371e0e288ce7f3a523c125c8dab24faed83022` (WO-229 integrate 2026-10-23).
Resolved projections: none.
Release preparation: WO-229 target v0.93.0 remains current. Files changed: docs/evidence/WO-229/meta.json. Meter snapshot: docs/evidence/WO-229/meta.json, 4157 bytes. Tag observation: local snapshot only.
Carried-forward claims: judged in [FINAL-001](../../final-reviews/WO-229/FINAL-001.md); the complete review row at code identity `8b8351e604dbfcd61436b9aea257adc9342e63e26bc36639611f3810ce288092` stands for the integrated tree, the amended order is the order judged, v0.93.0 remains current with no component-version collision, and the selected editions and the sibling registry row are unchanged evidence inputs. Acceptance: pass, recorded by `final-review-result`.
Authored conflicts observed: none.
Affected checks: run at the integrated tree by the final review, each exit 0 (publication check 255 of 255, harness check 35 surfaces, release surfaces, meta check with the two boarded breaches, whitespace, formatting and the five edition checks).

## WO-229-D026 — leave the matched register rows and record the registry observation

```json
{
  "id": "WO-229-D026",
  "date": "2026-10-23",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all six criteria at code identity 8b8351e604dbfcd61436b9aea257adc9342e63e26bc36639611f3810ce288092 and disposes no register row. FUP-eed385be08e5bdd9 (WO-226-D022) allocates the role-oracle headroom assertion to the next order that touches scripts/test-gate-followups.mjs; this order's edit to that file adds the two split fields laneWaitMs and gapMs to the critical-path case's expected object and does not open the role-wording seam, and a repair at final review would move the code identity and owe a fresh complete run and re-verification for a change the order never cited, so the row stays untriaged for the order that re-mints the role oracle. FUP-47b7a9b32cea5e57's reopening clause, WO-229 closing without marking contention, has not occurred: the slow condition marks contended samples. The planning receipt's known issue on criterion 3 is half-occurred: D001 selects the execution-only median, and its second clause needs two later passes. The real-registry hash change observed around node scripts/harness.mjs lanes under the bounded wrapper is the wrapper's own guard tree record gaining a member, not a write by the listing.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-229 at register revision 71a8dde6ca5afd7abaf013d84b9763598e9e18680ec1908985427b44c635e753: 6 of 162 pending rows matched (FUP-06744dc23242d044, FUP-47b7a9b32cea5e57, FUP-957602bc42e32e1d, FUP-bfab19adc5e5eac1, FUP-d0a9719cc2e4ec55, FUP-eed385be08e5bdd9); the three WO-229 rows VER-001 boarded (D018 to D020) were settled by D021 to D023 at 2026-10-23T12:14Z.",
    "git diff HEAD -- scripts/test-gate-followups.mjs: two added lines, laneWaitMs: 0 and gapMs: 11000, inside the deepEqual of the case 'critical path separates host-lane waiting from task work'; the role-wording case and its pinned baseline are unchanged.",
    "Under node scripts/harness.mjs bounded, per-entry snapshots of the real registry around the listing differed only in trees/<id>.json, the wrapper's own guard tree registration (1,455 to 1,533 bytes; members 1 to 2); a plain 600 ms node child produced the same growth; two further listings changed nothing; the lanes directory held no record, lane-capacity.json and the lock were untouched; scripts/test-runner.mjs line 2053 is the member bookkeeping that writes it. VER-002 read the hash unchanged (4a132e78…) outside a wrapper, and the host-guard fixture asserts byte-identical registry bytes.",
    "docs/planning/refutations/2026-10-22-planning-5bb6c2ac729c3e47-052.md, WO-229 judgment: aligned-with-findings; known issue on criterion 3 reopening when the decisions file selects the execution-only median for holds and a later planning condition passes while the document gate's wall-clock median rises across two consecutive passes."
  ],
  "rejected": [
    {"option": "Replace the role-oracle inequality in this review", "reason": "It changes a source file outside the order's cited surfaces, moves the code identity and owes a fresh complete run and re-verification; the row names its repair rule for the order that opens that seam."},
    {"option": "Route the registry observation as a finding against criterion 4", "reason": "The listing wrote no lane record, capacity or lock; the changed bytes are the caller's own supervision record, which any sufficiently long child of a bounded command grows."},
    {"option": "Leave the matched rows unmentioned", "reason": "The final review judges each listed row whose seam the change may have opened or whose condition may have occurred."}
  ],
  "reopenWhen": "The order that re-mints the role oracle lands without taking FUP-eed385be08e5bdd9; a listing run outside any bounded wrapper changes a registry byte; or a later planning pass's document condition passes while the wall-clock median rises for the second consecutive pass."
}
```
