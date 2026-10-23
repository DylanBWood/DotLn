# WO-225 decisions

## WO-225-D001

```json
{
  "id": "WO-225-D001",
  "date": "2026-10-23",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.92.0, the next minor above the observed release baseline v0.91.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.91.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-225-console-host-contracts.md"
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

## WO-225-D002

```json
{
  "id": "WO-225-D002",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Establish the pre-edit baseline (step 1): Retain the corrected bounded baseline and its source-level leak inventory, with private paths represented only by roles. The baseline board, instance and export controls demonstrate that NoOp leaves the requested host blocked.",
  "evidence": [
    "README.md: baseline probe completed 2026-10-23T01:47:56Z; all three path tests true, both segmented sources unavailable, export exited 1."
  ],
  "rejected": [
    {
      "option": "Rely on the planning snapshot without reproduction",
      "reason": "The current tree changed since planning and its test paths and component version differ."
    }
  ],
  "reopenWhen": "A baseline reproduction contradicts the recorded behavior."
}
```

## WO-225-D003

```json
{
  "id": "WO-225-D003",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Code failure reasons at their host boundary (step 2): Map file/command errors to not found, not readable, timed out, command failed (exit N), or invalid format in values.readFailureReason; apply it in attempt and loadout factories. Keep projection context behavior and schema labels. Store parse failures now expose the coded category rather than arbitrary input or exception text.",
  "evidence": [
    "collect.ts and builds.ts raw-message catches at the base; controls.json criterion 1 single-change counterfactual."
  ],
  "rejected": [
    {
      "option": "Replace private path substrings in messages",
      "reason": "Realpath aliases, child stderr and arbitrary thrown values make substring repair incomplete."
    }
  ],
  "reopenWhen": "A legitimate failure category cannot be represented without an additional stable code."
}
```

## WO-225-D004

```json
{
  "id": "WO-225-D004",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Remove refused Beacon directories from the view (step 3): The constellation adapter keeps the refusal reason before the directory separator as the age cell; it leaves ordinary age text and the source CLI format intact.",
  "evidence": [
    "control-beacon-fs.mjs renderControlConstellation appends reason plus colon-space plus refusal.path; board failure test covers that row."
  ],
  "rejected": [
    {
      "option": "Change the Beacon CLI output format",
      "reason": "Other consumers use its diagnostic path; this order owns the board projection boundary."
    }
  ],
  "reopenWhen": "The Beacon emitter changes its refusal grammar."
}
```

## WO-225-D005

```json
{
  "id": "WO-225-D005",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Carry the two schemas in the kit (step 4): Add the two source schemas to KIT_FILES and the export provenance grouping. Extend the bounded export source fixture to include the same files; exports and updated kits validate their listed bytes.",
  "evidence": [
    "launchpad.mjs KIT_FILES; test-launchpad-export.mjs and test-launchpad-update.mjs."
  ],
  "rejected": [
    {
      "option": "Copy the schemas into dist",
      "reason": "A second package contract copy would need another synchronization rule."
    }
  ],
  "reopenWhen": "The kit changes its contract file layout."
}
```

## WO-225-D006

```json
{
  "id": "WO-225-D006",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Treat the carried runtime as the kit build (step 5): The build main entry checks isKitRoot before atomicBuild, reports the no-op, and writes nothing. Core compilation and freshness recording stay on their existing path. Keep bootstrap as the kit restoration command.",
  "evidence": [
    "runtime-inputs.mjs isKitRoot distinguishes manifest roots without package sources; export probe verifies the complete tree and Git status unchanged."
  ],
  "rejected": [
    {
      "option": "Rewrite kit npm script commands",
      "reason": "Keeping script identity avoids a second entrypoint table and admits every build-first command."
    }
  ],
  "reopenWhen": "A kit starts carrying declared package sources or the runtime restoration contract changes."
}
```

## WO-225-D007

```json
{
  "id": "WO-225-D007",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Read segmented and configured control (step 6): The console file adapter mirrors the documented docs/control/orders root defaults, validates contained relative path syntax, and reads the legacy log only when present. Preserve the aggregate order census and its per-order fallback.",
  "evidence": [
    "control-store.mjs readControl and config.mjs root derivation; segmented fixtures with three root layouts and a lying fold."
  ],
  "rejected": [
    {
      "option": "Import the control-store script module into the package",
      "reason": "The console stays a file/CLI host adapter, with lifecycle folding in the scripts."
    }
  ],
  "reopenWhen": "Configuration gains a different root derivation; update the adapter and paired configured-root fixtures together."
}
```

## WO-225-D008

```json
{
  "id": "WO-225-D008",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Serve atomic read projections outside the command lane (step 7): The resident owns a lazy board snapshot, collects via an asynchronous child, coalesces concurrent reads, and atomically renames successful output into console/uifa-board-v1.json. Keep the planned 30-second freshness and 60-second timeout, plus a 16 MiB output limit. Both routes share the existing caller checks, including exact bound Host port, and return 503 on missing/failed projections without receipts. Shutdown kills pending collection. The browser client exposes readRuntimeStatus and readBoard; the package root preserves its file reader and aliases the network function as readConsoleRuntimeStatus.",
  "evidence": [
    "console-loopback.ts command lane and socket/origin/token checks; resident-host.ts starts while holding the store lock; targeted route and snapshot tests; core integration read completed within the 1.7-second two-test run."
  ],
  "rejected": [
    {
      "option": "Synchronous collection, one child per concurrent read, or a console.board command",
      "reason": "Synchronous work blocks the server; duplicate collections waste work; a command would queue and append receipts. A second server also duplicates tokens and ownership."
    }
  ],
  "reopenWhen": "Measured board collection exceeds the configured timeout or output bound, or consumers require another freshness policy."
}
```

## WO-225-D009

```json
{
  "id": "WO-225-D009",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Exercise contracts at their existing test surfaces (step 8): Extend existing console integration tests and add skeleton snapshot/refusal tests at the previously absent named loopback path. Share the board schema checker between board and route tests. Pair positive assertions with authentication, malformed-output, timeout, stale/fresh, lying-fold and baseline controls. Use raw HTTP for forged Host because fetch normalizes it.",
  "evidence": [
    "README.md source correction; controls.json; bounded build passed; targeted checks passed after correcting the Host test."
  ],
  "rejected": [
    {
      "option": "Invent a pre-existing loopback test or use only static route checks",
      "reason": "The named file did not exist and route/lane behavior needs execution."
    }
  ],
  "reopenWhen": "A current full gate finds uncovered behavior or a test ceases to distinguish its negative control."
}
```

## WO-225-D010

```json
{
  "id": "WO-225-D010",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "State current names and component compatibility (step 9): Document UIFA v0 as the actor board exported as uifa-board-v1, and console v1/UIFA v1 as the instance Angular shell. Stage console 0.4.6 within the order's required 0.4.x line and skeleton 0.66.0 for the additive resident routes. Update exact workspace pins; add no dependency. The existing file-reading API remains callable; schema labels stay unchanged.",
  "evidence": [
    "packages/console/package.json was 0.4.5; packages/skeleton/package.json was 0.65.0; order criterion 5 requires 0.4.x; release prepare assigned v0.92.0."
  ],
  "rejected": [
    {
      "option": "Bump either view-model label or rename the existing file reader",
      "reason": "The host additions do not require a new wire schema or an incompatible existing API."
    }
  ],
  "reopenWhen": "A consumer-visible incompatible model/API change is proposed."
}
```

## WO-225-D011

```json
{
  "id": "WO-225-D011",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Write back the host boundary (step 11): Update product 04's parity and later-host sections to name the two read routes, snapshot bounds, unavailable behavior and event-free reads; retain the host-owned UI-state boundary. The first publication check reported only its two expected stale source locks, to be regenerated through sync.",
  "evidence": [
    "product 04 cited paragraphs; npm run publication:check: 255/255 headings, two stale edition locks."
  ],
  "rejected": [
    {
      "option": "Add a core UI-state store or new command ID",
      "reason": "The accepted order assigns UI state to the instance and reads to the projection routes."
    }
  ],
  "reopenWhen": "The instance asks for a contract beyond these read projections."
}
```

## WO-225-D012

```json
{
  "id": "WO-225-D012",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Preserve physical containment in configured control roots: Apply the independent design finding within step 6: verify real paths against the launchpad before reading configuration, a control directory or a segment, and map refusals to not readable. Align the file adapter with the canonical reader and restore fixture environment state through test cleanup even after an assertion failure.",
  "evidence": [
    "self-review.md: design improver P2; control-store.mjs readControl and paths.mjs containedRegularFile; bounded escaped-parent-symlink fixture passed 2026-10-23T02:08:22Z."
  ],
  "rejected": [
    {
      "option": "Keep leaf-only lstat checks",
      "reason": "They admit regular files below an escaped parent symlink, unlike the canonical control reader."
    }
  ],
  "reopenWhen": "The canonical reader changes its containment contract."
}
```

## WO-225-D013

```json
{
  "id": "WO-225-D013",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Keep the measured snapshot bounds: Retain the planned 30-second freshness and 60-second child timeout. Three sequential actual core board CLI collections took 1037, 1039 and 1076 ms (median 1039 ms); the bounds leave headroom while concurrent refresh callers share one child. The synthetic comparison in controls.json takes 127 ms with coded reasons versus 125 ms with raw errors, but only the coded arm meets the no-path outcome.",
  "evidence": [
    "Bounded three-collection probe completed 2026-10-23T02:09:05Z, exit 0, five panels and uifa-board-v1 in each result; controls.json criterion 1; snapshot fixture one child for three reads."
  ],
  "rejected": [
    {
      "option": "Tighten the child timeout to the measured local duration",
      "reason": "A single warm local environment does not bound larger instances or contention."
    }
  ],
  "reopenWhen": "Representative instance measurements exceed these bounds or justify a different freshness contract."
}
```

## WO-225-D014

```json
{
  "id": "WO-225-D014",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Refresh the editions and preserve their live audit (step 10): The sync freshness checks re-minted authority under WO-225 (revision 001 first, followed by immutable successors after runtime and fixture corrections; current.json selects the latest and handoff.md records it); they retained the current artifact-identity and verification WO-226 revision 001 editions because their normalized subjects still match. Explicitly carry the selected base feedback edition WO-226 revision 001 into WO-225 feedback revision 001 and select it in current.json, preserving the live audit from WO-217 without a new live model episode. Sync also refreshes runtime, harness snapshots and publication source locks.",
  "evidence": [
    "npm run sync completed successfully at the current pre-review source; feedback-evidence.mjs --carry docs/evidence/WO-226/feedback-001 --edition WO-225 --revision 001 passed; --check --edition WO-225 --revision 001 passed with ten regressions, ten removal failures and 1192 fewer instruction bytes."
  ],
  "rejected": [
    {
      "option": "Re-run a live model episode or rewrite prior immutable editions",
      "reason": "The carry/check commands confirm unchanged judged behavior; the order requests deterministic re-mints and a carry, not another live run."
    }
  ],
  "reopenWhen": "Freshness checks identify a changed behavior subject requiring a new edition or live judgment."
}
```

## WO-225-D015

```json
{
  "id": "WO-225-D015",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Correct the existing browser-export assertion after the complete gate exposed it: the old WO-115 case expected only invokeConsoleCommand and readConsoleContract. Include the two deliberate new public functions, readBoard and readRuntimeStatus, in that exact list; retain its no-Node-API and command-identity checks. The first review attempt stopped cleanly after this confirmed failure, rather than supplying a pass from its partial results. Run a fresh complete review on the corrected tree.",
  "evidence": [
    "First complete review attempt: console had 25 passing tests and one exact-export assertion failure; the actual list contained precisely the two added client functions. Canonical evidence --stop recorded exit 1/stopped at 2026-10-23T02:17:44.100Z, duration 337566 ms; no passing row."
  ],
  "rejected": [
    {
      "option": "Remove the new exports or weaken the exact-list assertion",
      "reason": "Criterion 4 explicitly requires both functions; enumerating the full supported surface preserves the existing test purpose."
    }
  ],
  "reopenWhen": "The browser entry point intentionally changes again or the corrected assertion fails."
}
```

## WO-225-D016

```json
{
  "id": "WO-225-D016",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Keep the planning export fixture complete after extending KIT_FILES: add both console schemas to its separate copyCoreSource input list, matching the already updated shared launchpad fixture. The second complete review reached both planning scenarios, which correctly refused exports whose synthetic commit lacked the new required files. Stop that failed attempt through the canonical command, reproduce the named planning suite after the fixture correction, then start a fresh complete run.",
  "evidence": [
    "scripts/test-launchpad-planning.mjs copyCoreSource copied only package.json, tsconfig.json, src and test per workspace, omitting root schemas. Both reported failures named packages/console/uifa-board-v1.schema.json. The scripts/*.mjs source-copy search found this builder and scripts/lib/launchpad-fixture.mjs; both now carry the two files. The stopped review row recorded 434287 ms and exit 1 at 2026-10-23T02:27:39.131Z, with no pass.",
    "Bounded node --test scripts/test-launchpad-planning.mjs passed both scenarios after the correction: 2 tests, 0 failures, 159743 ms, completed 2026-10-23T02:30:57.117Z."
  ],
  "rejected": [
    {
      "option": "Make required kit schemas optional during export",
      "reason": "That would violate criterion 3 and conceal an incomplete source fixture instead of verifying the export contract."
    }
  ],
  "reopenWhen": "Another explicitly required kit file is added or a different bounded export-source fixture is introduced."
}
```

## WO-225-D017

```json
{
  "id": "WO-225-D017",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Update the source-build negative control for the kit no-op contract: the older recovery fixture replaced bootstrap with npm run build and expected a missing tsconfig.json failure. That command now correctly succeeds without compiling, so the control reached an unrelated unowned-hook refusal. Invoke exported atomicBuild explicitly in the synthetic control instead, keeping its intended source-build failure and the positive carried-runtime recovery assertions. The production no-op and bootstrap paths remain unchanged. The same fixture now explicitly admits the README template in its build-wording inventory and asserts that it documents the no-op and no writes; executable recovery advice still requires bootstrap for a kit.",
  "evidence": [
    "Third review attempt passed planning and the new kit schema/no-op/console case. The older recovery case failed because its expected npm-build failure no longer applies; the actual refusal named the deliberately unowned synthetic hook.",
    "The canonical stopped row recorded 279388 ms, exit 1, at 2026-10-23T02:37:15.639Z; no passing evidence was supplied.",
    "The first bounded reproduction passed the revised source-build control and then exposed the old build-wording inventory, which omitted the newly documented README no-op. Its exact inventory was extended by that one path and paired with the explicit no-op text assertion.",
    "The corrected bounded recovery fixture passed: 1 test, 0 failures, 15606 ms, completed 2026-10-23T02:38:53.765Z; it covers the forced source-build refusal, positive bootstrap recovery, harness entry, finish and build-advice inventory."
  ],
  "rejected": [
    {
      "option": "Accept the incidental unowned-hook refusal or restore a failing npm build in kits",
      "reason": "The former would stop testing the intended source-build boundary, while the latter contradicts criterion 3."
    }
  ],
  "reopenWhen": "The carried-runtime recovery contract or the explicit atomic source-build entry point changes."
}
```

## WO-225-D018

```json
{
  "id": "WO-225-D018",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Extend the launchpad case census by the new kit-contract test: register its exact name in scripts/fixtures/launchpad-cases.json and update the runner fixture count from 36 to 37. Preserve all prior names, the exact-list comparison, the 900-second task bounds and the maximum of two concurrent launchpad tasks. The changed behavior requires one additional declared case, not a weakened preservation assertion.",
  "evidence": [
    "The fourth complete attempt reported 37 !== 36 in the runner inventory fixture. The full export suite passed in that attempt (27 cases including the new kit contract and corrected runtime recovery).",
    "The stopped review row recorded 223673 ms, exit 1, at 2026-10-23T02:44:07.649Z; no pass.",
    "The corrected bounded census/concurrency case passed: 1 test, 0 failures, 136 ms, completed 2026-10-23T02:44:23.707Z."
  ],
  "rejected": [
    {
      "option": "Remove the total or exact case-name baseline assertion",
      "reason": "The inventory protects against dropped cases and duplicate substitutions, while the new required case should be admitted explicitly."
    }
  ],
  "reopenWhen": "The declared launchpad case inventory changes again."
}
```

## WO-225-D019

```json
{
  "id": "WO-225-D019",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Repeat the complete review after a timing-sensitive nested configuration failure, without changing product code, deadlines or scheduler settings. The planning scenario has passed both a bounded full reproduction and an earlier complete review attempt; the latest run instead reached the nested configuration-root task's existing 30-second timeout. No source-level cause is established, so a deadline increase or a scheduler change is not justified by this observation. Preserve the failed attempt and require a fresh complete pass.",
  "evidence": [
    "The bounded planning suite passed both scenarios in 159743 ms at 2026-10-23T02:30:57.117Z. The third complete attempt passed launchpad-planning in 179.21 s.",
    "The fifth attempt's earlier fixture document check completed configuration-root in 10.28 s; its later integrated-kit review timed that task out at 30127 ms. The outer planning task had loadClass shared, loadFactor 16 and a 900000 ms bound; the root row contains no nested deadline diagnostic. Other activity and the exact timeout cause remain unknown.",
    "The canonical stopped row recorded 832133 ms, exit 1, at 2026-10-23T02:59:40.379Z. No passing complete evidence was supplied. Skeleton, target-publish and the target-worktree start/publish files completed successfully before the stop."
  ],
  "rejected": [
    {
      "option": "Increase the configuration timeout or change scheduler settings after this single timed failure",
      "reason": "That would alter an unrelated execution contract without an established cause or controlled measurement."
    }
  ],
  "reopenWhen": "The same nested timeout recurs, or a reproducible source, load or reservation defect explains it."
}
```

## WO-225-D020

```json
{
  "id": "WO-225-D020",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Complete the executor handoff at the tested code identity (step 12): judge all six criteria with the fixture controls, two independent reviews, current edition selections and the fresh complete review. Run the document gate after the final authored bytes, then let implementation-ready consume both standing rows and release this writer. Keep verification and publication with their separate dispatches.",
  "evidence": [
    "Complete npm test -- --review passed at 2026-10-23T03:23:32.600Z: 38 suites, 104 fresh tasks, no failures, no reused suites, 1349515 ms; code identity d1a5097f274831c453fefd7f339bc806659ca97b315dfc60f862253bea8a3f59.",
    "The previously timed planning suite passed in 162.17 s with the unchanged deadlines. Decisions D015-D019 retain the earlier failures and their corrections or unresolved timing cause.",
    "Canonical nested-repository inventory returned no entries; git diff --check passed."
  ],
  "rejected": [
    {
      "option": "Use the stopped attempts as a composed pass or advance verification in this dispatch",
      "reason": "The executor owes a fresh complete review plus its final document row; verification is an independent role."
    }
  ],
  "reopenWhen": "A later gate or independent verification identifies a current defect."
}
```

## WO-225-D021

```json
{
  "id": "WO-225-D021",
  "date": "2026-10-23",
  "dispatch": "resume: verify",
  "decision": "Route VER-001 F1 as a follow-up, not a blocker: the WO-225 export case in scripts/test-launchpad-export.mjs runs the carried schema tests through a nested node --test whose environment keeps the outer runner's NODE_TEST_CONTEXT, so the nested runner skips every file and exits 0 and the assertion cannot fail. Criterion 3 stays met on independent evidence: with that variable removed, the carried board and runtime-status cases pass in an export (2 of 2), and each fails when its kit schema is moved aside.",
  "evidence": [
    "VER-001 probe under node --test using the fixture's run() and env: the nested carried run printed 'run() is being called recursively within a test file. skipping running files.' and exited 0 with the schemas present and with each schema moved aside.",
    "The same probe with NODE_TEST_CONTEXT removed from the child environment: 2 passed with both schemas; exit 1 with uifa-board-v1.schema.json moved aside (board.test.js fails at load) and exit 1 with runtime-status-v1.schema.json moved aside (ENOENT in the WO-114 shared schema case).",
    "scripts/test-runner.mjs runs scripts/test-launchpad-export.mjs as a node --test file in the launchpad suite; scripts/lib/launchpad-fixture.mjs builds env from process.env without deleting NODE_TEST_CONTEXT, unlike scripts/lib/suite-evidence.mjs and scripts/lib/generated-artifacts.mjs."
  ],
  "rejected": [
    {
      "option": "Fail criterion 3",
      "reason": "The criterion states a behavior of the export, and the independent probe establishes it with a discriminating control; the vacuous assertion is a defect in a declared surface that breaks no criterion, which product 07 §Verification review and attack routes as a follow-up."
    },
    {
      "option": "Repair the test during verification",
      "reason": "A verifier writes evidence and its immutable report, never the implementation it judges."
    }
  ],
  "followup": "Next order or repair editing scripts/test-launchpad-export.mjs or scripts/lib/launchpad-fixture.mjs: run the WO-225 case's carried node --test child with NODE_TEST_CONTEXT removed from its environment, assert that the two named carried cases ran and passed (a positive pass count, not only exit 0), and add the paired control that moves one kit schema aside and expects the carried run to fail.",
  "reopenWhen": "A carried console schema test fails in an export, or another nested node --test child in the launchpad fixtures is found to pass without running."
}
```

## WO-225-D022

```json
{
  "id": "WO-225-D022",
  "date": "2026-10-23",
  "dispatch": "resume: verify",
  "decision": "Route VER-001 F2 as a follow-up: readFailureReason in packages/console/src/values.ts labels a child ended by a signal, or killed for exceeding its output limit, as 'invalid format', although the child produced no judged output. The reason stays coded and path-free, so criterion 1 holds; the label misdirects an operator reading an unavailable source.",
  "evidence": [
    "VER-001 probe through the compiled readFailureReason: execFileSync with maxBuffer exceeded gave code ENOBUFS, status null, signal SIGTERM and reason 'invalid format'; a child that sent itself SIGKILL gave status null, signal SIGKILL and reason 'invalid format'; exit 3 gave 'command failed (exit 3)'; a 100 ms timeout gave 'timed out'.",
    "collectSources runs resume status --all --json with maxBuffer 256000000 and the other commands with 8000000, so the output-limit case is reachable on a large instance."
  ],
  "rejected": [
    {
      "option": "Treat the label as a criterion 1 failure",
      "reason": "Criterion 1 requires coded reasons free of the fixture root, the Node binary and the home directory; this reason meets both requirements."
    }
  ],
  "followup": "Next order editing packages/console/src/values.ts readFailureReason: give a child ended by a signal or by its output limit (ENOBUFS, or status null with a signal) a command-failure code instead of 'invalid format', keep every reason path-free, list the new code in the console README beside the others, and add both cases to the coded-reason test.",
  "reopenWhen": "An instance reports an unavailable console source as 'invalid format' whose command was killed or exceeded its output limit."
}
```

## WO-225-D023

<!-- integration refs/dotln/checkpoint/WO-225/6 -->

```json
{
  "id": "WO-225-D023",
  "date": "2026-10-23",
  "dispatch": "resume: final review; worktree integrate WO-225",
  "decision": "Integrate current main under the final-review dispatch, retaining checkpoint refs/dotln/checkpoint/WO-225/6 and the named stash; docs/intake holds no ignored entry, so no intake backup was owed. Original base and fetched main are both e1dd599769c03dfcea9d3147ce552aaaed2735bf, so the merge was a no-op; no authored conflict, no source change and no code-identity change occurred: the identity stays d1a5097f274831c453fefd7f339bc806659ca97b315dfc60f862253bea8a3f59, the identity the executor handed off and VER-001 judged. Application v0.92.0 remains the minor target over v0.91.0; console 0.4.6 and skeleton 0.66.0 are the order's staged component versions, compiler 0.30.0, kernel 0.6.0, beacons 0.1.1 and browser-evidence 0.1.0 are unchanged, and the authority, harness and feedback edition checks exit 0 at the integrated tree, so no re-mint beyond D014's is owed. Carry forward VER-001's judgments on all six criteria with the complete review row at that identity (npm test -- --review recorded 2026-10-23T03:23:32.600Z, 38 required suites, 104 fresh tasks, exit 0, 1349515 ms); the seven compiled WO-225 cases rerun under the bounded runner at the integrated tree, 7 of 7. Integration introduces no finding.",
  "evidence": [
    "refs/dotln/checkpoint/WO-225/6",
    "base e1dd599769c03dfcea9d3147ce552aaaed2735bf",
    "upstream e1dd599769c03dfcea9d3147ce552aaaed2735bf",
    "release preparation: WO-225 target v0.92.0 remains current. Files changed: docs/evidence/WO-225/meta.json. Meter snapshot: docs/evidence/WO-225/meta.json, 4111 bytes. Tag observation: local snapshot only.",
    "code identity after integration, gateCodeIdentity under node scripts/harness.mjs bounded at 2026-10-23T04:08:14Z: d1a5097f274831c453fefd7f339bc806659ca97b315dfc60f862253bea8a3f59, equal to the executor's passing complete review row (recorded 2026-10-23T03:23:32.600Z, 1349515 ms, 38 required suites, 104 fresh tasks, exit 0) and to VER-001's subject.",
    "compiled WO-225 cases rerun under node scripts/harness.mjs bounded at 2026-10-23T04:11:26Z and again with the TAP reporter: board (2), collect (2) and console-loopback (3) cases, 7 of 7 pass.",
    "affected checks at the integrated tree on 2026-10-23, each exit 0: npm run publication:check (255 of 255 headings, both editions current), node scripts/harness.mjs check (35 surfaces), npm run meta -- --check (the two boarded WO-226 cold-start breaches, no reopen candidate), git diff --check, npm run format:check, node scripts/authority-evidence.mjs --check, node scripts/harness-evidence.mjs --check and node scripts/feedback-evidence.mjs --check; npm run release -- check-surfaces --local runs after the release surfaces are written and is recorded in FINAL-001.",
    "git diff --stat origin/main over package.json, .claude/skills, .agents/skills, .claude/agents and both console schema files is empty and git ls-files --others there lists nothing: no dependency, role-text or contract-label change."
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

Integration date: 2026-10-23. Original base: `e1dd599769c03dfcea9d3147ce552aaaed2735bf`.
Fetched main: `e1dd599769c03dfcea9d3147ce552aaaed2735bf`. Checkpoint: `refs/dotln/checkpoint/WO-225/6`.
Named stash retained: `bd1fd4251a44917eda9bf1618d4c5519b59c26ee` (WO-225 integrate 2026-10-23).
Resolved projections: none.
Release preparation: WO-225 target v0.92.0 remains current. Files changed: docs/evidence/WO-225/meta.json. Meter snapshot: docs/evidence/WO-225/meta.json, 4111 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 6 retain VER-001's evidence at the identical code identity, with the seven compiled WO-225 cases rerun successfully at the integrated tree; no claim changed. No component-version collision (console 0.4.6 and skeleton 0.66.0 are above main's 0.4.5 and 0.65.0 and no sibling order stages either package) and no stale evidence edition. The final document gate is recorded after FINAL-001's last edit.
Authored conflicts observed: none.
Affected checks: npm run publication:check, node scripts/harness.mjs check, npm run meta -- --check, git diff --check, npm run format:check and the three edition checks each exit 0 on 2026-10-23; npm run release -- check-surfaces --local runs after the release surfaces are written; the complete review row at the unchanged identity (2026-10-23T03:23:32.600Z, 1349515 ms) is the row FINAL-001 consumes, so no fresh complete run is started. Details are in FINAL-001.

## WO-225-D024

```json
{
  "id": "WO-225-D024",
  "date": "2026-10-23",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all six criteria at code identity d1a5097f274831c453fefd7f339bc806659ca97b315dfc60f862253bea8a3f59, the identity the executor handed off, VER-001 judged and integration kept. The review read the whole subject diff (58 changed files and two new test files against main), reran the seven compiled WO-225 cases under the bounded runner, reproduced the mechanism of both VER-001 follow-ups at the integrated tree, ran the affected and edition checks, and found no defect of its own. D021 (FUP-268c774fd159addb) and D022 (FUP-ce1f662a6b966a2a) stay on their rows with their repair rules: each edits a declared source, which would move the code identity and owe a fresh complete run and re-verification, for a vacuous test assertion whose behavior VER-001's independent control establishes and for a diagnostic label that stays coded and path-free. The two deferred register rows the textual match lists are left as they are: FUP-1352f54cf999d41e (the console's information architecture) because this order supplies the contracts the shell reads and records no design decision for core's own console, and FUP-7f9a27e6ed6c44b3 (unmeasured growth costs) because the executor measured three core board collections at 1037, 1039 and 1076 ms against its three-second condition. Planning receipt 052's criterion 4 known issue did not fire: a refresh child that exits non-zero, emits invalid output or exceeds its bound returns a typed 503 and keeps the previous snapshot, and concurrent stale reads share one child. The untracked sibling receipt docs/evidence/siblings/DotLn-Enterprise-Starter/2026-10-23T01-36-06-322Z.json is release-close bookkeeping carried into this worktree at activation: it is in every checkpoint of this order from refs/dotln/checkpoint/WO-225/1 on and in no commit of main, and it lands with the order's staging commit as WO-227's did.",
  "evidence": [
    "docs/final-reviews/WO-225/FINAL-001.md: the criterion judgments, the earlier-findings table and the executed checks.",
    "node --test --test-reporter=tap --test-name-pattern='WO-225' over packages/console/dist/test/board.test.js, collect.test.js and packages/skeleton/dist/test/console-loopback.test.js under node scripts/harness.mjs bounded: 7 tests, 7 pass, 0 fail, 1552 ms.",
    "F1 mechanism under node --test at the integrated tree: a nested node --test child inheriting NODE_TEST_CONTEXT=child-v8 over an inner case that fails printed 'skipping running files' and exited 0; with the variable removed the same child exited 1. scripts/lib/launchpad-fixture.mjs builds env from process.env without removing the variable.",
    "F2 through the compiled readFailureReason: {status: null, signal: SIGKILL} and {code: ENOBUFS, status: null, signal: SIGTERM} give 'invalid format'; {status: 3} gives 'command failed (exit 3)'; ETIMEDOUT gives 'timed out'; ENOENT gives 'not found'; EACCES gives 'not readable'.",
    "packages/skeleton/test/console-loopback.test.ts cases 'resident board refresh shares one child, preserves fresh bytes, and atomically replaces stale bytes' and 'board collection timeout and shutdown terminate the child without publishing', and VER-001's HTTP matrix (a child exiting 3 and one exceeding its bound each return 503 and keep the previous file; two concurrent stale reads start one child).",
    "npm run plan -- followups --touching --work-order WO-225 at register revision b1f88737aff53a9b1a777f2ade54b34d385514f4f5a1cd57a1aa4b9b3071c511: 4 of 162 pending rows matched (FUP-1352f54cf999d41e, FUP-7f9a27e6ed6c44b3, FUP-268c774fd159addb, FUP-ce1f662a6b966a2a).",
    "git log --all over the sibling receipt names only this order's checkpoints; git ls-tree main for the path lists nothing."
  ],
  "rejected": [
    {
      "option": "Repair D021's nested test runner or D022's signal label in the review",
      "reason": "Each edits a declared source and moves the code identity, owing a fresh complete run of about 22 minutes and re-verification; neither breaks a criterion, VER-001's control establishes the carried-test behavior, and each row carries its repair rule for the next order editing the surface."
    },
    {
      "option": "Spawn an adversary to re-attack the subject",
      "reason": "VER-001's probes varied corpus, forged inputs, path spelling, working directory and seventeen caller variants, two executor workers reviewed the frozen diff, and this review read the whole diff and reran the compiled cases itself; the one claim a worker could add, a live browser read from the instance's shell, is the fork's console order's first read by the order's own Evidence gate."
    },
    {
      "option": "Start a fresh complete review run",
      "reason": "The code identity is unchanged by integration and by this review, which edits no source, so the executor's passing complete row at that identity is the row the result consumes."
    }
  ],
  "reopenWhen": "Either follow-up's reopening condition occurs (a carried console schema test fails in an export, or an instance reports an unavailable console source as 'invalid format' for a killed or output-limited child); the fork's shell's first live read of the two routes contradicts a criterion judgment here; or a later gate finds a defect at this identity."
}
```
