# WO-080 decisions

## WO-080-D001 — Keep target observations separate from document truth

```json
{
  "id": "WO-080-D001",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Read Workstream only in leading metadata and validate the document block against it. Read targets only during explicit index generation and reuse recorded Git facts during check. Self uses observed launchpad HEAD against main. NoOp leaves no workstream record or board source and does not deliver WO-080. The traps are silently divergent membership and turning unreadable targets into fresh or stale claims; named refusals and unknown observations address them.",
  "evidence": [
    "scripts/work-orders.mjs readIndex, readTargetFacts and main; scripts/lib/work-order-workstream.mjs",
    "WO-080 Design and criteria 1-2; scripts/test-work-orders.mjs real-Git fixture cases"
  ],
  "rejected": [
    {
      "option": "Read targets again during index --check",
      "reason": "A host without the registered clone cannot reproduce that observation; the order explicitly requires snapshot checks."
    },
    {
      "option": "Add a workstream control event",
      "reason": "This deliverable is a projection and no outcome-level transition consumer is in scope."
    }
  ],
  "reopenWhen": "A consumer needs workstream-level legality or a different explicit self-base declaration."
}
```

## WO-080-D002 — Separate queue placement while preserving the order-card contract

```json
{
  "id": "WO-080-D002",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Mark the existing WS-002 block track separate under its recorded operator direction. Omit its members from Proposed order and put their complete Open cards after sequenced cards in identifier order. Preserve every existing card exactly once: the order requires grouping lines without duplicate WO headings and the console links those cards. No planning sequence amendment is needed; a separate member may be absent from or retained in the marked sequence.",
  "evidence": [
    "docs/workstreams/WS-002-predecessor-track.md; WO-080 execution steps 4-6",
    "scripts/work-orders.mjs checkPartition and packages/console/src/work.ts indexPage"
  ],
  "rejected": [
    {
      "option": "Drop the member card entirely",
      "reason": "It would violate the existing two-page partition and remove the board link target."
    },
    {
      "option": "Keep the separate member in Proposed order",
      "reason": "The recorded operator direction explicitly excludes it from the serial queue."
    }
  ],
  "reopenWhen": "The operator asks for different separate-track presentation or the card partition contract changes."
}
```

## WO-080-D003 — Retain the board source reference and additive schema

```json
{
  "id": "WO-080-D003",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Append Workstreams after usage and parse only the committed JSON line. Share the existing index source reference: a malformed grouping makes this section unavailable and re-notes that source unavailable while the ordinary index section stays available. Empty or unavailable new sections allocate no evidence ids, preserving old fixtures after removing the new section.",
  "evidence": [
    "WO-080 execution steps 10-15 and shared-ref decision",
    "packages/console/src/context.ts section; packages/console/uifa-board-v1.schema.json section definition",
    "docs/evidence/WO-080/compare-board.mjs compares all original inputs and all three original output formats"
  ],
  "rejected": [
    {
      "option": "Introduce a second source reference or schema field",
      "reason": "The order explicitly retains the source list and unchanged schema."
    }
  ],
  "reopenWhen": "A later consumer needs section-specific source availability rather than the documented shared-ref behavior."
}
```

## WO-080-D004 — Keep the pilot synthetic and confined to its four demonstrations

```json
{
  "id": "WO-080-D004",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Use a committed disposable source copy for the real export and real target worktrees, lifecycle commands and writer hook. All remotes used for synchronization are local fixture repositories. D1, D2, the occupied-worktree refusal in D4 and D6 are the declared set; these mechanics do not claim operator usefulness or prove D3, D5, conflicts or a workstream-level next action.",
  "evidence": [
    "WO-080 Design, execution steps 17-19 and criterion 5",
    "scripts/test-workstream-pilot.mjs; scripts/lib/target-worktree-fixture.mjs and scripts/test-launchpad-planning.mjs existing fixture patterns"
  ],
  "rejected": [
    {
      "option": "Turn the synthetic pilot into the operator-witnessed run",
      "reason": "That is WO-083 and is outside this order."
    }
  ],
  "reopenWhen": "A new order builds a candidate in FUP-b28d36edaa8630b1 or WO-083 records the witnessed run."
}
```

## WO-080-D005 — Release only the changed component

```json
{
  "id": "WO-080-D005",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Bump console from the observed base 0.4.8 to 0.5.0 for the additive Workstreams section. Keep the uifa-board-v1 schema, all other component versions, private-package controls and dependency graph unchanged. The application release follows the authorized minor classification through release prepare --local.",
  "evidence": [
    "packages/console/package.json at activation base 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6",
    "WO-080 Release classification and execution step 16"
  ],
  "rejected": [
    {
      "option": "Repeat the stale 0.4.4 version cited by the plan",
      "reason": "The checked activation base is 0.4.8; its next minor is still 0.5.0."
    }
  ],
  "reopenWhen": "Integration changes the release baseline or a later change breaks the contract."
}
```

## WO-080-D006 — Normalize the existing minor declaration

```json
{
  "id": "WO-080-D006",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Correct the active order release declaration punctuation from minor, to minor. so the existing release preparation parser recognizes the already-authorized minor classification. No classification, scope or criterion changes. The first preparation attempt wrote nothing.",
  "evidence": [
    "npm run release -- prepare --local refused: release prepare requires one explicit patch, minor, or major Release classification",
    "scripts/lib/release-preparation.mjs requires a period after the classification; WO-080 already declares minor and console 0.5.0"
  ],
  "rejected": [
    {
      "option": "Broaden the release parser in this order",
      "reason": "The active declaration can use its established format without changing shared lifecycle behavior."
    }
  ],
  "reopenWhen": "A future planning convention intentionally admits a different release declaration syntax."
}
```

## WO-080-D007

```json
{
  "id": "WO-080-D007",
  "date": "2026-10-24",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.96.0, the next minor above the observed release baseline v0.95.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.95.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-080-workstream-document-and-index.md"
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

## WO-080-D008 — Exercise the emitted writer admission

```json
{
  "id": "WO-080-D008",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Use the emitted target hook to acquire the first writer before attempting the second writer. The seedHarnessWriter helper called with the target root seeds a different state directory from runTargetHarnessHook, which stores the target reservation in the launchpad snapshot lane. Acquiring through the real hook demonstrates both admission and refusal without changing the harness. Give the harness check its explicit runtime root when running from the target. The prototype fixture failures were setup errors, not evidence of a product refusal defect.",
  "evidence": [
    "scripts/test-workstream-pilot.mjs confined prototype: missing outward vocabulary, wrong seed lane and missing runtime root; the next confined reproduction passed D4 and D6",
    "packages/skeleton/src/harness-host.ts runTargetHarnessHook and harnessStateDirectory; scripts/harness.mjs target runtime-root resolution"
  ],
  "rejected": [
    {
      "option": "Write a hand-built writer record into the target state lane",
      "reason": "The emitted hook already creates the canonical reservation and is the stronger executable demonstration."
    },
    {
      "option": "Change the product hook or runtime-root default",
      "reason": "The checked behavior is intentional; the fixture must name the emitting launchpad."
    }
  ],
  "reopenWhen": "Target hook storage or the harness command contract changes."
}
```

## WO-080-D009 — Keep the pilot eligible under confinement

```json
{
  "id": "WO-080-D009",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Register workstream-pilot as a product suite with the declared core-only export exclusion and no outside-sandbox requirement. The corrected four-case suite passes inside a Seatbelt profile denying writes to the source checkout. It nests no sandbox operation that fails under this profile. The successful probe took 23.132 seconds including the bounded wrapper; Node reported 23.079 seconds for the suite. The earlier failed setup runs are not timing evidence for completed outcomes.",
  "evidence": [
    "docs/evidence/WO-080/pilot-confined.txt: four passed, zero failed; start 2026-10-24T14:31:36.993Z, finish 2026-10-24T14:32:00.125Z",
    "scripts/test-workstream-pilot.mjs uses a committed scratch source and local fixture remotes; all fixtures are removed by the suite"
  ],
  "rejected": [
    {
      "option": "Mark the suite outside-sandbox without executing a confined probe",
      "reason": "The order requires the environmental need to be decided from execution."
    }
  ],
  "reopenWhen": "A changed pilot requires a nested sandbox operation or fails because the supported host confinement prevents it."
}
```

## WO-080-D010 — Repair the observed fixture failures before a fresh complete gate

```json
{
  "id": "WO-080-D010",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Stop the first complete review gate after work-orders-fixtures and console failed, then repair their named causes: include Workstreams in the existing heading expectation, install the established build-free control-plane files in the new index fixture so its copied CLI resolves its imports, and tag the pinned-input board case document. The stopped harness task is not a harness defect. Reproduce these two known failures with focused runs, then start a fresh complete review gate; no passing row is claimed from the stopped run.",
  "evidence": [
    "2026-10-24T14:46:51.753Z stopped review row: work-orders-fixtures had three failing cases (heading expectation and two missing gate-evidence.mjs imports); console had one excluded-input read requiring a document tag",
    "scripts/test-work-orders.mjs makeRepo already uses installBeaconFixture for its CLI import closure; packages/console/test/board.test.ts pinned-input cases use the document tag",
    "node scripts/harness.mjs evidence --stop confirmed the active run stopped and no pass supplied"
  ],
  "rejected": [
    {
      "option": "Relax the source-read guard or skip fixture assertions",
      "reason": "The declared document partition and existing fixture setup resolve the observed failures without weakening checks."
    }
  ],
  "reopenWhen": "A fresh run exposes a different failure; diagnose that result before changing any other scope."
}
```

## WO-080-D011 — Include the changed workstream seed in the legacy-upgrade oracle

```json
{
  "id": "WO-080-D011",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Update the legacy v0.81.0 upgrade fixture's exact rewritten-seed list to include docs/workstreams/README.md, and assert that its refreshed bytes equal the current kit template. This is the intended consequence of this order's template change, not a change to seed ownership or the updater. Reproduce the failed upgrade scenario alone, then start another complete review gate. The second review ran 1367.858 seconds and failed; it is not the fresh plain measurement this order requires.",
  "evidence": [
    "2026-10-24T15:12:52.173Z review row: launchpad-planning failed at test-launchpad-planning.mjs:1979 because actual rewrittenSeeds additionally named docs/workstreams/README.md",
    "The same run passed work-orders-fixtures, console, all four workstream-pilot demonstrations, harness-fixtures, process-debt, plan-refutation, runner-fixtures, sync-fixtures and the executed target cases; remaining aggregate failures represented unrun tasks after fail-fast",
    "New input read: scripts/test-launchpad-planning.mjs legacy-upgrade scenario and its starter refresh assertions"
  ],
  "rejected": [
    {
      "option": "Remove the workstream template update or weaken the exact seed assertion",
      "reason": "The work order requires the final convention in the kit; the expected rewrite and the resulting bytes can both be checked."
    }
  ],
  "reopenWhen": "A later template or seed-ownership change alters the actual upgrade contract."
}
```

## WO-080-D012 — Document the pilot's core-only exclusion in the starter

```json
{
  "id": "WO-080-D012",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Add workstream-pilot and its existing export-input reason to the starter README's core-only suite table. The suite declaration already excludes it correctly; the exported-instance check exposed the missing documentation. Stop the third review run after that failure, reproduce the failed export case alone, and start a fresh complete run. No exclusion or gate coverage is broadened.",
  "evidence": [
    "2026-10-24T15:18:42.759Z stopped review row; test-launchpad-export.mjs reported README omission: workstream-pilot at line 846",
    "New inputs read: scripts/kit/README.client.md What runs here table and scripts/test-launchpad-export.mjs exported-instance diagnostic check",
    "The legacy-upgrade reproduction passed after D011 in 27.488 seconds; its added expected seed and content assertion were both executed"
  ],
  "rejected": [
    {
      "option": "Remove the declared kit exclusion or weaken the inventory-to-README check",
      "reason": "The pilot exports a launchpad and needs inputs the kit does not carry; its existing exclusion needs to be visible in the shipped instructions."
    }
  ],
  "reopenWhen": "The kit carries the export inputs or its documented diagnostics contract changes."
}
```

## WO-080-D013 — Record the fresh-gate threshold observation for planning

```json
{
  "id": "WO-080-D013",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "The order's single fresh plain measurement passed all 35 selected suites: 1134.406 seconds in the gate row and 1135.28 seconds of external elapsed time. This exceeds the original six-minute stand-down condition. Record the observation for planning alongside the existing cold-gate candidate FUP-e96221b106cd136a, whose allocated order WO-222 is closed. One observation does not establish that candidate's separate thirty-day median condition. Do not infer that this suite caused the crossing: there is no equivalent pre-change measurement at this base. The pilot took 57.017 seconds in this fresh run, 56.845 seconds in the complete review, and 23.079 seconds in its confined standalone probe; these are different execution contexts, not a controlled speed comparison.",
  "evidence": [
    "docs/evidence/WO-080/gate-results.json and fresh-product-gate.txt; plain forced-fresh row recorded 2026-10-24T16:10:09.472Z, zero reuse and unchanged code and build output",
    "docs/planning/machinery-stand-down-2026-09-15.md section 8 and docs/planning/work-order-map.md Candidate — cold-gate structural cuts",
    "Existing follow-up FUP-e96221b106cd136a is allocated to WO-222; canonical status lists WO-222 closed; its reopening includes a plain-gate thirty-day median above 360 seconds"
  ],
  "rejected": [
    {
      "option": "Rerun the measurement to seek a lower value",
      "reason": "The order authorizes one successful fresh measurement after the final code edit; no invalidation occurred."
    },
    {
      "option": "Expand this workstream order into a gate-performance change",
      "reason": "The requested deliverable measures the threshold; selecting a structural repair requires its own diagnosis and planning authority."
    }
  ],
  "followup": "Review the WO-080 fresh plain gate's 1135.28-second elapsed observation against the six-minute stand-down condition and the existing cold-gate candidate FUP-e96221b106cd136a; distinguish the single observation from its thirty-day median trigger and diagnose before allocating a change.",
  "reopenWhen": "A planning pass evaluates the recorded observation, or a relevant code, host or runner change invalidates this measurement."
}
```

## WO-080-D014 — Bind the release declaration's format correction

```json
{
  "id": "WO-080-D014",
  "date": "2026-10-24",
  "dispatch": "resume: next; routine release preparation under the order's declared minor classification",
  "decision": "Bind D006's punctuation-only release declaration correction through the existing execution-amendment command. The operator dispatched resume: next, the reviewed order already specifies minor, and its execution requires release preparation. Preserve the assigned title and every objective, criterion, dependency and non-goal. This records the authorized format repair, not new scope or a planning verdict. Rerun the failed document gate after the binding; the successful product rows retain their unchanged code identity.",
  "evidence": [
    "The document row recorded 2026-10-24T16:18:34.384Z failed plan-refutation-current and plan with existing work-order bytes changed; entropy was unrun after fail-fast.",
    "The WO-080 diff contains only the assigned v0.96.0 title and minor, the changed to minor. The. D006 records release preparation's refusal of the original punctuation.",
    "New inputs read: product 07 continuing-work and execution-amendment rules; scripts/lib/plan-continuation.mjs; scripts/lib/plan-receipts.mjs amendPlanOrder; scripts/lib/document-failures.mjs; and the existing WO-220-D030 release-classification binding. The narrow built-in format exception does not cover this declaration.",
    "A bounded matchesExecutionAmendment check confirmed WO-220-D030 matches both HEAD and workspace. No change to that order is needed. The failed document row's inherited labels came from missing compiled kernel and skeleton modules in the baseline checkout; those labels do not establish the same failure at the base. The correction here is supported by the current order diff and continuation check, not that classification."
  ],
  "rejected": [
    {
      "option": "Revert the required format repair or broaden the planning parser",
      "reason": "The existing release parser requires the explicit declaration format, and the canonical binding preserves the reviewed classification without changing shared behavior."
    },
    {
      "option": "Invent an operator scope expansion or repair another order from the inherited label",
      "reason": "No scope or criterion changes; the existing authorization covers release preparation, and the other order's binding already matches."
    }
  ],
  "reopenWhen": "The classification or any non-bookkeeping order text changes, or the document gate identifies another mismatch."
}
```

## WO-080-D015 — VER-001: pass; board the self member's checkout-dependent integration reading

```json
{
  "id": "WO-080-D015",
  "date": "2026-10-24",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Pass VER-001 at code identity 6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65; all seven criteria are met. Board F1 (follow-up). readTargetFacts takes a self member's base from HEAD of whichever checkout runs npm run work-orders -- index and compares it with that checkout's refs/heads/main. After one unrelated commit on a branch, the self member's recorded integration becomes diverged and its stale mark yes, although nothing about the member changed, and index --check keeps that reading because check reuses recorded facts. The base cell also follows each commit. Criterion 1 asks only that such a member read self, and the order's step 6 says its cells come from the launchpad's Git state, which this satisfies literally; no behavior main had changes, so the route is follow-up. The standard final-review flow fast-forwards and refreshes the index before its commit, so the real corpus's WS-002 member WO-228 normally records current (inference from scripts/lib/worktree-integration.mjs and the reviewer skill's order of steps).",
  "evidence": [
    "docs/evidence/WO-080/verification-001/probes.json indexVariations V16a and V16b: a self member records base HEAD and current on main; after an unrelated commit on branch wo-999 it records diverged, stale yes and the branch HEAD as base, and index --check still passes (V16c).",
    "scripts/work-orders.mjs readTargetFacts: for id self, repository is { baseBranch: \"main\" }, clone is the generating root and base = rev-parse HEAD; docs/workstreams/README.md and product 12 state the same rule.",
    "docs/control/orders/WO-080.jsonl: a self order's WorkOrderActivated event records checkpointSha but no baseCommit, so no member-owned base exists for a self order today."
  ],
  "rejected": [
    {
      "option": "Fail the verification on F1",
      "reason": "It breaks no criterion and no behavior main had; product 07 routes such a defect as a follow-up."
    },
    {
      "option": "Leave F1 in the report only",
      "reason": "A defect met and not fixed is recorded as a decision with a named follow-up."
    },
    {
      "option": "Change readTargetFacts in this verification",
      "reason": "A verifier never edits the implementation it judges."
    }
  ],
  "followup": "A WO-080 repair, if one happens, or the next order that edits readTargetFacts in scripts/work-orders.mjs; low priority. Rule a repair must hold: a self member's base, integration and stale cells describe the member, never the HEAD of the checkout that ran the refresh. A commit unrelated to the member in the generating checkout leaves those cells unchanged; a member with no base of its own reads unknown; the docs/workstreams convention, the kit template and product 12 state the same rule.",
  "reopenWhen": "A repair makes a self member's cells independent of the generating checkout's HEAD with a case that fails without it, or a committed index on main records a self member as diverged."
}
```

## WO-080-D016 — VER-001: board the pilot demonstrations' shared state and D2's self-confirming proof

```json
{
  "id": "WO-080-D016",
  "date": "2026-10-24",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F2 (follow-up). In scripts/test-workstream-pilot.mjs, D4 and D6 read members that D2 starts (orders WO-301 and WO-302), so a single demonstration cannot run alone and a D2 failure is reported as three. D2's client-proof.json assertion reads back the object the test has just written, so it observes nothing the product produced; D2's evidence is its other assertions (the client's pinned contract blob, the service closed and merged first, and the client still active). Criterion 5 asks for four named tests, each with its own assertion, all passing; that holds in the suite and in the canonical rows, so the route is follow-up.",
  "evidence": [
    "docs/evidence/WO-080/verification-001/probes.json pilot.d4Alone: node --test --test-name-pattern=\"WO-080 D4\" scripts/test-workstream-pilot.mjs exits 1 with TypeError: Cannot read properties of undefined (reading 'target').",
    "probes.json pilot.direct: all four named tests pass when the file runs whole; pilot.d4DenyReason: the second writer's deny is DOTLN_TARGET_REFUSED: compiled feedback refused target effect, while the first session in that worktree and the second session in its own worktree are both admitted.",
    "scripts/test-workstream-pilot.mjs D2: write(client.target, \"client-proof.json\", ...) is followed by assert.deepEqual(json(client.target, \"client-proof.json\"), ...) on the same object."
  ],
  "rejected": [
    {
      "option": "Judge criterion 5 unmet",
      "reason": "Each demonstration is one named test with its own assertion and passes in the suite the gate runs; running alone is not part of the criterion."
    },
    {
      "option": "Leave F2 in the report only",
      "reason": "A defect met and not fixed is recorded as a decision with a named follow-up."
    }
  ],
  "followup": "A WO-080 repair, if one happens, or WO-083 when it extends the pilot; low priority. Rule a repair must hold: each named demonstration in scripts/test-workstream-pilot.mjs passes when selected alone with --test-name-pattern, starting the members it needs or taking them from a shared before hook, and every assertion observes a value the code under test produced, never bytes the test itself just wrote.",
  "reopenWhen": "A repair makes each demonstration pass alone with a case or command recorded, or a pilot failure is misattributed because one demonstration's state broke another."
}
```

## WO-080-D017 — VER-001: both of receipt 053's reopening triggers for criterion 5 fired

```json
{
  "id": "WO-080-D017",
  "date": "2026-10-24",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Planning receipt 2026-10-24-planning-783a352b583108a3-053 records against criterion 5 that the new suite joins every fresh core gate with no bound, and names two reopening triggers: step 19's timed fresh run above six minutes, or the workstream-pilot row's recorded wall-clock above the slowest existing structural task's. Both fired. D013 and FUP-7f35e50c5d698168 record the first; nothing records the second. The pilot row took 56.845 s in the complete review and 57.017 s in the fresh plain run; the slowest structural task, generated, took 19.122 s and 19.859 s in those rows. My own single-suite run took 27.91 s for the pilot task and 19.69 s for generated. The known issue is planning's and is not a criterion, so nothing blocks; this decision boards the second trigger beside the first.",
  "evidence": [
    "docs/evidence/WO-080/gate-results.json: the review and forced-fresh plain rows' cases, workstream-pilot 56845 ms and 57017 ms, generated 19122 ms and 19859 ms, the largest of the six structural tasks.",
    "docs/evidence/WO-080/verification-001/probes.json pilot.runner and receipt053Triggers.",
    "docs/planning/refutations/2026-10-24-planning-783a352b583108a3-053.md and docs/planning/work-order-map.md, WO-080's row: the two reopening triggers."
  ],
  "rejected": [
    {
      "option": "Fail criterion 5 or 7 on the gate cost",
      "reason": "Neither criterion bounds the suite's wall-clock; the receipt routes the cost to planning."
    },
    {
      "option": "Fold the observation into FUP-7f35e50c5d698168 without a record",
      "reason": "That row names only the six-minute reading; the per-row trigger is a separate condition planning may dispose differently."
    }
  ],
  "followup": "Planning: receipt 053's second trigger for WO-080 criterion 5 fired (the workstream-pilot row, 56.8 to 57.0 s in the complete and fresh rows, exceeds the slowest structural task, generated, at 19.1 to 19.9 s). Dispose it with FUP-7f35e50c5d698168 and the cold-gate candidate FUP-e96221b106cd136a: bound the row, move it out of plain fresh gates, or decline with the recorded cost.",
  "reopenWhen": "A planning pass disposes the row, or a change to the pilot or the runner moves its recorded wall-clock below the slowest structural task's."
}
```

## WO-080-D018

<!-- integration refs/dotln/checkpoint/WO-080/6 -->

```json
{
  "id": "WO-080-D018",
  "date": "2026-10-24",
  "dispatch": "resume: final review; worktree integrate WO-080",
  "decision": "Integration took in nothing: local main, the main the helper fetched and the branch base are all 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6, the branch carries no commit of its own, no authored conflict arose and no projection was resolved by hand. Carried-forward claims, judged in FINAL-001: the executor's complete review row at code identity 6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65 (npm test -- --review recorded 2026-10-24T15:50:54.906Z, 41 required suites, 107 fresh tasks, none unrun or reused, exit 0, 1,755.504 s), which VER-001 consumed and judged, stands for the integrated tree, because the identity probe read the same value after the merge, after the affected checks and after this review's focused suite runs, and this review changes no code. Application target v0.96.0 remains current over the v0.95.0 baseline with no component-version collision: console 0.5.0 is this order's own bump (D005), the newest tag locally and at origin is v0.95.0, and of docs/work-orders only WO-080 and the generated index name v0.96.0. The selected evidence editions are unchanged inputs: the only changed registered source path is package-lock.json, whose component versions every edition normalizes (VER-001's recomputation), so no re-mint is owed. The sibling registry's v0.95.0 row and the untracked receipt of 2026-10-24T14:12:24Z are release-close bookkeeping carried in at activation, present in no commit of main and consistent with that directory's other receipts. The integration's own regeneration changed only this record, its index row and the order's meter snapshot; every other tracked and untracked file matches the checkpoint's blob. The affected checks the helper printed pass at the reviewed tree, and the complete review row is reused rather than rerun.",
  "evidence": [
    "refs/dotln/checkpoint/WO-080/6",
    "base 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6",
    "upstream 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6",
    "release preparation: WO-080 target v0.96.0 remains current. Files changed: docs/evidence/WO-080/meta.json. Meter snapshot: docs/evidence/WO-080/meta.json, 4170 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity from scripts/lib/gate-evidence.mjs before the integration, after the merge, after the affected checks and after the focused suite runs: 6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65 each time, the identity of the executor's passing npm test -- --review row (2026-10-24T15:50:54.906Z) and of VER-001's subject.",
    "git tag -l and git ls-remote --tags origin: newest v0.95.0 in both; refs/remotes/origin/main after the helper's fetch is 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6; grep -l v0.96.0 over docs/work-orders names WO-080 and README.md only.",
    "Against refs/dotln/checkpoint/WO-080/6 the integrated tree differs in docs/evidence/WO-080/decisions.md (this record), docs/evidence/WO-080/meta.json (the meter snapshot) and docs/lineage/decisions-index.md (this record's row); every other tracked file and every other untracked file hashes to the checkpoint's blob.",
    "Affected checks at the reviewed tree, each exit 0 under node scripts/harness.mjs bounded: npm run publication:check (29 and 45 linked source sections match, both editions current, 255 of 255 product headings indexed); node scripts/harness.mjs check (35 generated surfaces); npm run release -- check-surfaces --local (license surfaces and the seven package publish refusals as expected); npm run meta -- --check (the boarded cold-start and sequence-size advisories, 0 reopen candidates); node docs/evidence/WO-080/compare-board.mjs (five cases equal the base after removing only Workstreams; every existing pinned input and the schema byte-identical).",
    "The ignored intake (3 files) was archived before the merge with npm run backup:intake into the session scratch directory as DotLn-wo080-intake-20261024T170354Z.zip, and the helper verified the archive against the current intake."
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

Integration date: 2026-10-24. Original base: `873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6`.
Fetched main: `873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6`. Checkpoint: `refs/dotln/checkpoint/WO-080/6`.
Named stash retained: `f549cab420504be171f7cd7a0b4177904e015b3e` (WO-080 integrate 2026-10-24).
Resolved projections: none.
Release preparation: WO-080 target v0.96.0 remains current. Files changed: docs/evidence/WO-080/meta.json. Meter snapshot: docs/evidence/WO-080/meta.json, 4170 bytes. Tag observation: local snapshot only.
Carried-forward claims: judged in [FINAL-001](../../final-reviews/WO-080/FINAL-001.md); the executor's complete review row at code identity `6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65` stands for the integrated tree, v0.96.0 remains current with no component-version collision, and the selected editions and the sibling registry row are unchanged evidence inputs. Acceptance: FINAL-001's verdict, recorded by `final-review-result`.
Authored conflicts observed: none.
Affected checks: run at the reviewed tree by the final review, each exit 0 (publication check with both editions current, harness check 35 surfaces, release surfaces, meta check with the boarded advisories, the board comparison script); the complete review row at the unchanged identity is reused.

## WO-080-D019 — Final review: pass at the integrated identity; VER-001's F1 and F2 stay on their rows

```json
{
  "id": "WO-080-D019",
  "date": "2026-10-24",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all seven criteria at code identity 6a931dea2e266c39b20dd81718bbd538efcd36df8d9424ad8618089e98428d65, the identity the executor handed off, VER-001 judged and integration kept, and lists no finding of its own. VER-001's F1 (D015, FUP-2811605b8e865d2d: a self member's base, integration and stale cells follow the HEAD of whichever checkout runs the index refresh) and F2 (D016, FUP-ec2be6f5cb63ae35: D4 and D6 read members D2 starts, and D2's client-proof assertion reads back bytes the test itself wrote) stay on their rows, untriaged, with the repair rules those decisions record. Neither breaks a criterion or behavior main had: no workstream grouping existed before this order, and the four demonstrations pass whole in the complete row, the fresh row, VER-001's three runs and this review's runner reproduction. F1 is not repaired here because its repair is a design choice about where a self member's own base comes from (a self order's WorkOrderActivated event records a checkpointSha and no baseCommit today), the convention, the kit template and product 12 state the current rule and would change with it, an edit to scripts/work-orders.mjs would owe a fresh complete review, and a reviewer never writes a behavioral fix and certifies it. Its real-corpus consequence is bounded by this review's order of steps: the index is refreshed at the result transition while HEAD equals main, so the committed WS-002 line records WO-228 as current with base and target 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6; index --check reuses that record on any host, publish regenerates no index after the commits, and the next explicit refresh on main observes main's own HEAD. F2 is not repaired here because making each demonstration self-sufficient is a test-design change in a product suite that would owe a fresh complete review for a property no criterion names. Receipt 053's criterion-5 known issue has both reopening triggers fired and recorded (D013 with FUP-7f35e50c5d698168 for the 1,134.406 s fresh plain run; D017 with FUP-ed4da61921a5c255 for the pilot row above the slowest structural task) and routes to planning; no criterion bounds the cost, and the order's Cost line paid the one timed measurement it allowed. The eight pending register rows the touching query matches keep their dispositions: FUP-0126 reads needs-review because this order's product 12 write-back changed its source section, which the next planning pass re-triages; FUP-1c36325905c52243, FUP-7f9a27e6ed6c44b3 and FUP-d0a9719cc2e4ec55 are textual matches on WS-002, scripts/work-orders.mjs and scripts/test-runner.mjs whose clauses stand; the four untriaged rows are this order's own boarded decisions, left for planning as D013 and VER-001 recorded.",
  "evidence": [
    "docs/control/orders/WO-080.jsonl: WorkOrderActivated 2026-10-24T14:14:46.029Z, ImplementationReady 16:30:49.099Z (codex-cli 0.164.0, gpt-6-astra, max), VerificationCompleted 16:54:49.936Z (claude-code 2.1.310, claude-opus-5-5, xhigh), FinalReviewRequested 16:55:53.985Z; canonical status at entry: phase final-review, VER-001 pass, FINAL-001 allocated, no waiver, correction, withdrawal or override record.",
    "docs/evidence/WO-080/gate-results.json: the review row at code identity 6a931dea… recorded 2026-10-24T15:50:54.906Z (41 suites, 107 fresh tasks, exit 0, 1,755.504 s, workstream-pilot 56.845 s with four passing demonstrations) and the forced-fresh plain row at 16:10:09.472Z (35 suites, 101 fresh tasks, 1,134.406 s); gateCodeIdentity at the reviewed tree reads the same identity after integration and after every check this review ran.",
    "node scripts/harness.mjs bounded -- npm test -- --only workstream-pilot at the reviewed tree: 8 passed, 0 failed, 44.15 s, the pilot task 28.02 s; -- --only console: 8 passed, 0 failed, the console task 18.17 s.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-080/compare-board.mjs at the reviewed tree: wo009, selfhost, control, refutations and missing each equal the base's JSON, text and HTML after removing only Workstreams; every existing pinned input and uifa-board-v1.schema.json byte-identical to 873e8c0c.",
    "node scripts/harness.mjs bounded -- npm run work-orders -- index --check at the reviewed tree: both pages current; docs/work-orders/README.md line 39 records WS-002/WO-228 as repository self, base and targetCommit 873e8c0ca00fb0fc74a586e6eb9cc9bca1977be6, integration current, stale no, track separate; WO-228 is absent from Proposed order.",
    "scripts/work-orders.mjs main: the --check branch calls projectWorkstreams with readWorkstreamSnapshot(actual.readme) and never readTargetFacts; the write branch calls readTargetFacts, whose self branch reads HEAD of the generating root and refs/heads/main; scripts/worktree.mjs publish runs no index regeneration after the commits.",
    "docs/evidence/WO-080/verification-001/probes.json: indexVariations V16a (self on main: current), V16b (after an unrelated branch commit: diverged, stale yes, base is the branch HEAD), V16c (check still passes); pilot.d4Alone exits 1 with TypeError when D4 runs alone; pilot.direct and pilot.runner pass all four.",
    "npm run plan -- followups --touching under the bounded wrapper at the reviewed tree: register revision 49729c3d60419f3ca2c921d1cf4bc4902a4ce45f2d4ff17bbf881b97ab4994f6, 89 paths, 183 pending, 8 matched: FUP-0126 needs-review (source revision 21); FUP-1c36325905c52243, FUP-7f9a27e6ed6c44b3 and FUP-d0a9719cc2e4ec55 deferred; FUP-2811605b8e865d2d, FUP-7f35e50c5d698168, FUP-ec2be6f5cb63ae35 and FUP-ed4da61921a5c255 untriaged.",
    "docs/planning/refutations/2026-10-24-planning-783a352b583108a3-053.md: WO-080 aligned-with-findings with one criterion-5 known issue whose reopening names the six-minute fresh run and the pilot row above the slowest structural task; both fired per gate-results.json (generated 19.122 s and 19.859 s; pilot 56.845 s and 57.017 s).",
    "git ls-files --others --exclude-standard and git diff main --name-only screened for home paths, account names and credential shapes: no match; docs/workstreams/README.md and scripts/kit/workstream.template.md are byte-identical; the .claude/hooks and harness-manifest diffs change only the runtime snapshot path and the hooks' own file hashes."
  ],
  "rejected": [
    {
      "option": "Repair F1 in this review",
      "reason": "The repair chooses where a self member's own base comes from, a design decision that changes the convention, the kit template and product 12 and owes a fresh complete review; a reviewer never writes a behavioral fix and certifies it, and the committed index on main is not wrong under this review's order of steps."
    },
    {
      "option": "Repair F2 in this review",
      "reason": "Restructuring the pilot's shared state is a test-design change in a product suite that would owe a fresh complete review; criterion 5 asks for four named tests with their own assertions, all passing, which holds."
    },
    {
      "option": "Fail the review on F1 or F2, or on the gate-cost triggers",
      "reason": "Product 07 routes a defect that breaks no criterion and no behavior main had as a follow-up, and receipt 053's known issue is planning's; no criterion bounds the suite's wall-clock."
    },
    {
      "option": "List F1 and F2 as this review's own findings",
      "reason": "Verification found and boarded them; a final review lists only its own findings once, so the block stays empty."
    }
  ],
  "reopenWhen": "A repair makes a self member's cells independent of the generating checkout's HEAD or makes each pilot demonstration pass alone, each with a case that fails without it (the rows' own conditions); a committed index on main records a self member as diverged; or a planning pass disposes the receipt 053 rows."
}
```
