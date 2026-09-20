# WO-110 decisions

## WO-110-D001 — Tinkerer economy experiment: focused skeleton-suite iteration

**Pre-registration.** Recorded before implementation, under the
`tinkerer-economy` support equipped for this order as WO-145-D001's second
trial. Operator authorized equipping it during this dispatch; default
equipment is restored at handoff.

**Question.** WO-110 adds one skeleton source module and one skeleton test
file. Does building and running that single compiled test file give a
materially shorter development feedback loop than the full `npm test` gate,
while the full gate still runs at integration?

**Alternatives.**

1. Run the full `npm test` gate on every development iteration (current
   method; the session's baseline gate row is 252,611 ms).
2. Run `npm run build --silent && node --test <one compiled skeleton test>`
   during iteration and the full `npm test` once at integration.

**Deciding observation.** Compare the recorded full-gate row against three
runs of alternative 2 on the same unmodified source, using
`packages/skeleton/test/worker.test.ts` as the nearest-neighbour stand-in
because WO-110's own test file does not exist yet. Adopt alternative 2 for
this order's iteration only if all three runs pass and the slowest takes less
than half the full-gate row. A timeout, failure or missing counter makes the
result inconclusive. This is a development method only; it never replaces a
required check.

**Budget.** 900 s wall-clock including preparation, measurement and
recording. No child process beyond 180 s.

**Authority.** Inside WO-110's existing authority: it changes only which
already-declared commands this executor runs while iterating. No new
dependency, gate, hook, agent or recurring check.

**Result.**

```json
{
  "id": "WO-110-D001",
  "kind": "experiment",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator authorized equipping tinkerer-economy for this order during the dispatch (WO-145-D001 trial two)",
  "decision": "Adopt build-plus-single-compiled-test-file runs for this order's development iterations; the full npm test gate still runs at integration and before handoff.",
  "question": "Does building and running one compiled skeleton test file give a materially shorter development feedback loop than the full npm test gate, while the full gate still runs at integration?",
  "alternatives": [
    "Run the full npm test gate on every development iteration",
    "Run npm run build --silent plus node --test on one compiled skeleton test file during iteration, and the full npm test gate once at integration"
  ],
  "observation": "All three focused runs must pass and the slowest must take less than half the recorded full-gate row.",
  "budget": {
    "wallSeconds": 900
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 87,
    "tokens": null,
    "commands": [
      "npm test",
      "npm run build --silent && node --test --test-reporter=tap packages/skeleton/dist/test/worker.test.js"
    ],
    "source": "Wall-clock: pre-registration timestamp 2026-09-20T18:02:20.000Z through this result write, measured with Date.now() in the granted session scratch. Per-run durations and exit codes in docs/evidence/WO-110/experiment-measurement.json. Tokens: null because the only available counter is cumulative and dispatch-scoped (node scripts/harness.mjs usage), so no experiment-scoped token delta was observed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "npm test",
      "npm run build --silent && node --test --test-reporter=tap packages/skeleton/dist/test/worker.test.js"
    ],
    "summary": "Full gate: 252.611 s, 21 passing suites. Focused, build included: three runs of 14.175 s, 14.045 s and 14.095 s, 23 passing tests each, slowest 14.175 s against a 126.306 s threshold. Saving 238.436 s per eligible development iteration in this sample, not per order; iteration frequency and token effect are unknown, so per-order values stay null. Final coverage is unchanged because the full gate still runs before handoff."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-20",
    "experimentsSinceAdoption": 0
  },
  "evidence": [
    "docs/evidence/WO-110/experiment-measurement.json",
    "Session gate row: npm test 252611 ms recorded 2026-09-20T17:59:37.720Z",
    "Pre-registered comparison above; unmodified source across all four measurements"
  ],
  "rejected": [
    {
      "option": "Full npm test gate on every iteration",
      "reason": "The focused command finished in 5.6 percent of the full-gate row, far under the pre-registered half threshold; the full gate is still required at integration."
    },
    {
      "option": "Replace the full gate with the focused command",
      "reason": "One file exercises 23 of the suite's tests across 1 of 21 suites and establishes no integration coverage; criterion 4 requires the full gate."
    },
    {
      "option": "Decline the experiment",
      "reason": "The measurement cost 87 s of a 900 s budget and reused an already-recorded gate row rather than spending a second full run."
    }
  ],
  "reopenWhen": "The full gate finds a failure the focused file missed, the skeleton suite's file layout changes, or the third trial's totals fail WO-145-D001's pre-registered reading."
}
```

The stand-in subject is a limit of this record: it measures the iteration loop's
shape, not WO-110's own test file, which did not exist at pre-registration.

## WO-110-D002 — One HTTP episode, no child process and no supervisor

```json
{
  "id": "WO-110-D002",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Implement the third WorkOrderTransport as its own module over an explicit IPv4 loopback HTTP origin, with the endpoint as the test injection point and no disposable supervisor.",
  "evidence": [
    "packages/skeleton/src/worker-transport.ts: both CLI adapters exist only to launch and bound a child process through ProcessRunner",
    "packages/skeleton/src/cli-actor.ts: cli-worker forks cli-episode.js because a detached CLI child outlives its parent",
    "packages/skeleton/test/local-model.test.ts: an aborted dispatch against a live loopback server ends as interrupted with no process to reap",
    "docs/discovery/local-runner-2026-09-18.md: the runner is reached over HTTP, not spawned per episode"
  ],
  "rejected": [
    {"option": "Extend the CLI transport class with an HTTP branch", "reason": "Its whole shape is argv construction, spawn, stdout capture and process-group kill; none of that applies, and the branch would make canonicalWorkerArgs answer for a transport that builds no argv."},
    {"option": "Inject a stubbed fetch client for the doubles", "reason": "A real loopback server exercises the transport's own request construction, bounded reading and parsing; a client stub would assert against the test's own mock."},
    {"option": "Fork a supervisor like cli-worker", "reason": "There is no detached child to outlive the resident; an AbortController ends the episode with the host that started it."}
  ],
  "reopenWhen": "A local runner requires a spawned per-episode process, or the endpoint needs streaming or multi-turn tool calls that a single bounded request cannot carry."
}
```

## WO-110-D003 — The wire shape is WO-137's observed rows, and effort stays a launch claim

```json
{
  "id": "WO-110-D003",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Send the native /api/v0/chat/completions shape with a json_schema response_format and a fixed reasoning_effort of none; record the DotLn effort selector as a launch claim and put no effort value on the wire.",
  "evidence": [
    "docs/discovery/local-runner-2026-09-18.md: the first diagnostic completion spent its whole 64-token cap on reasoning and returned empty content; a second with reasoning_effort none returned READY with zero reasoning tokens",
    "docs/discovery/local-runner-2026-09-18.md: the schema row's parsed object validated against the exact declared schema on that endpoint",
    "docs/discovery/local-runner-2026-09-18.json: fixed decoding temperature 0, top_p 1, seed 424242",
    "packages/skeleton/src/worker-protocol.ts: workerResultSchema is the same contract the CLI adapters pass as --json-schema or --output-schema"
  ],
  "rejected": [
    {"option": "Map DotLn low/medium/high/xhigh/max onto reasoning_effort", "reason": "Only the value none is observed on this runner; inventing a mapping would be an unsourced wire claim, and the Codex adapter already sets the precedent of recording effort as unknown rather than guessing."},
    {"option": "Use the OpenAI-compatible path for everything", "reason": "WO-137 observed the native path for its schema, tool and determinism rows and saw empty stats on the compatible path's recovery response."},
    {"option": "Trust the endpoint's schema enforcement", "reason": "A vendor schema claim is not validation; the host parses the envelope again, as it does for both CLI adapters."}
  ],
  "reopenWhen": "A runner version accepts and echoes an effort selector, the native path changes shape, or an observed row contradicts the none setting."
}
```

## WO-110-D004 — Availability is a declared row, and criterion 2 records the admitted unavailable outcome

```json
{
  "id": "WO-110-D004",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Drive catalog availability from the dated L-U1 row rather than a live probe, ship it as unavailable, and record criterion 2's live smoke as an unavailable row without starting the operator's runner.",
  "evidence": [
    "docs/work-orders/WO-110-local-model-transport.md: criterion 2 admits an envelope or an unavailable row, and activation says the smoke records a ready row from WO-137's packet when one exists or an unavailable row otherwise",
    "docs/discovery/local-runner-2026-09-18.md: overall readiness is graded inconclusive, WO-138's required ready preflight remains unsatisfied, and WO-110 is told to record readiness as unavailable",
    "docs/discovery/local-model-transport-2026-09-20.json: probe ECONNREFUSED, dispatch model-unavailable, at 2026-09-20T18:10Z",
    "packages/skeleton/src/resident-host.ts: adapter.available() returning a reason becomes an ActorUnavailable NoOp"
  ],
  "rejected": [
    {"option": "Probe the endpoint inside available()", "reason": "It is synchronous in the ActorAdapter contract, and a resident must be able to record why no work happened without contacting the operator's machine on every tick."},
    {"option": "Start LM Studio and load the pinned artifact to force an envelope", "reason": "The order pre-decided this branch, no ready row exists, and loading a 16 GB artifact on the operator's host is their call; WO-137 needed explicit authorization for its own load experiment."},
    {"option": "Ship the row as ready because the protocol rows are positive", "reason": "Successful inference is not the readiness contract; the attributable no-egress boundary is still absent."}
  ],
  "followup": "The operator can record an envelope row at any time by starting the endpoint and rerunning scripts/probes/local-model-transport-smoke.mjs --live with a new destination; the reproduction is in the availability row.",
  "reopenWhen": "The operator starts the endpoint and the smoke returns an envelope, or a later order establishes the attributable runner egress boundary and promotes the row to ready."
}
```

## WO-110-D005 — The inspection profile only, fenced on the request kind

```json
{
  "id": "WO-110-D005",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Refuse writer, verification-evidence and plan-refutation requests on their kind before validation, so the local transport carries the inspection profile alone.",
  "evidence": [
    "docs/work-orders/WO-110-local-model-transport.md: the objective names the inspection profile, and a writing profile for the local model is an explicit non-goal",
    "packages/skeleton/src/verification-protocol.ts: isWriterRequest, isEvidenceRequest and isPlanRequest answer on the kind field alone",
    "packages/skeleton/test/local-model.test.ts: both refusals are asserted and the double endpoint receives no request"
  ],
  "rejected": [
    {"option": "Let validateTransportRequest reject the unsupported kinds", "reason": "It would report a profile mismatch rather than the real reason, and would interpret a shape this transport never supports."},
    {"option": "Add a source-change profile here", "reason": "The order declines it: it needs its own observed rows, and no local writer row exists."},
    {"option": "Embed an inference runtime", "reason": "Declined in the order; it would add a dependency and own a model lifecycle the operator already owns."}
  ],
  "reopenWhen": "A local writer or verifier row exists and its own work order authorizes that profile; WO-138 is the qualification order and needs a ready preflight first."
}
```

## WO-110-D006 — Adjacent repair: the worker-lock peer fixture publishes its result atomically

```json
{
  "id": "WO-110-D006",
  "kind": "adjacent",
  "date": "2026-09-20",
  "dispatch": "resume: next; equipped Adjacent Repair",
  "decision": "Publish the WO-143 worker-lock peer fixture's result file with a .part write and renameSync so a polling reader never observes it between creation and its contents landing.",
  "evidence": [
    "Second full gate run failed WO-143 a delayed claimant cannot unlink a successor through a retired target with SyntaxError: Unexpected end of JSON input at resident.test.js:901",
    "packages/skeleton/test/resident.test.ts workerPeer.result() polls existsSync and then reads the file immediately",
    "packages/skeleton/test/fixtures/worker-lock-process.ts published the result with a plain writeFileSync, which creates the path before its bytes land",
    "The same test passed five of five isolated runs, and passed in the baseline gate and the first final gate run, so the fault is load-dependent rather than a WO-110 regression",
    "After the fix: three of three targeted runs and a full gate of 21 passed, 0 failed"
  ],
  "rejected": [
    {"option": "Leave it as observed flakiness", "reason": "It would reach the verifier as an unexplained intermittent failure of an unrelated suite; the cause was diagnosed and the fix is two lines in test support."},
    {"option": "Retry or widen the poll deadline in workerPeer.result()", "reason": "It would hide a real create-then-write race rather than remove it, and a legitimately silent peer should still fail fast."},
    {"option": "Instrument renameSync in the fixture", "reason": "Unnecessary: no current point declares that operation, and adding one would change the fault-injection surface the WO-143 tests pin."}
  ],
  "reopenWhen": "The same test fails again under load, or another fixture is found publishing a file a second process polls for by existence."
}
```

The queue item `adjacent-0001` carries the same diagnosis; its first recorded
cause named stdout and was revised after reading the helper and the fixture.

## WO-110-D007 — The live envelope, and the endpoint's unhonored model field

```json
{
  "id": "WO-110-D007",
  "date": "2026-09-20",
  "dispatch": "operator override: amend, after implementation-ready was recorded",
  "decision": "Record the operator's live run as criterion 2's primary evidence, rest the L-U1 row's justification on the absent egress boundary rather than the superseded listener observation, and record the endpoint's unhonored model field as a named limitation rather than adding a model-identity check to the transport.",
  "evidence": [
    "docs/discovery/local-model-transport-live-2026-09-20.json: outcome envelope, probe HTTP 200 in 21.08 ms, dispatch 14558.64 ms, status completed, beaconClaim inspection-completed, 161-character summary, one candidate with 3 evidence strings",
    "packages/skeleton/src/local-model-transport.ts: outcome envelope is only reachable after parseWorkerResult accepts the result, so the workOrderId, episodeId, resultId, summary bound and inventory-checked candidate path all held",
    "The same packet records model required-model on the wire while the loaded identifier was dotln-local, and the endpoint answered HTTP 200 rather than refusing",
    "docs/discovery/local-runner-2026-09-18.md: overall readiness remains inconclusive and the attributable non-local-egress boundary is still absent",
    "docs/discovery/local-model-transport-2026-09-20.json: the superseded 18:10 row, retained and time-indexed"
  ],
  "rejected": [
    {"option": "Promote the row to ready now that inference works", "reason": "Readiness turns on the attributable egress boundary, not on whether the model answers; WO-137's contract is undischarged and WO-138's preflight stays unsatisfied."},
    {"option": "Reject a response whose model field differs from the request", "reason": "This runner never echoes the requested name, so the check would refuse every live episode; the gap belongs in evidence until a runner exposes the answering artifact."},
    {"option": "Delete the 18:10 unavailable row", "reason": "It was accurately observed and is what the resident's declared row described; both observations stay time-indexed."},
    {"option": "Leave the live packet in /tmp", "reason": "Verification judges the recorded subject, so evidence outside the repository would be lost and later re-derived at cost."}
  ],
  "followup": "WO-138 must obtain the answering model's identity from the runner rather than the request, and must not treat a served response as evidence that the intended artifact answered.",
  "reopenWhen": "A runner version honors or echoes the requested model, an attributable egress boundary is established, or a later live run contradicts this n=1 observation."
}
```

**Bypassed requirements, recorded truthfully.** This decision and the amendment
it describes were written after `implementation-ready` was already recorded, in
the `ready-to-verify` phase, under an explicit `operator override:` for this
session. No lifecycle dispatch was run and no transition was repeated; the
recorded attestation, phase and verdict are unchanged. Hook enforcement was
suspended for the session by that override. The amendment changed one source
constant (`LOCAL_MODEL_ROW.reason`), added one discovery packet and its
narrative, and added this decision; the full gate was rerun afterwards and its
result is reported with the amendment.

## WO-110-D008 — VER-001 F1: the seven order-owned files are formatted, not exempted

```json
{
  "id": "WO-110-D008",
  "kind": "repair",
  "date": "2026-09-20",
  "dispatch": "resume: fix",
  "decision": "Run the repository formatter over exactly the seven files VER-001 F1 named, rather than reformatting the tree or relaxing the format gate.",
  "evidence": [
    "node scripts/test-runner.mjs --document --only format before the repair: 1 passed, 1 failed, 3.17 s, naming the same seven paths VER-001 F1 listed",
    "npx prettier --write over those seven paths only; the tracked part of that diff is 2 files, 8 insertions, 2 deletions",
    "node scripts/test-runner.mjs --document --only format after the repair: 2 passed, 0 failed, 3.08 s",
    "node scripts/harness.mjs check after the rebuild: 31 generated surfaces, no drift, so the reformatted worker-protocol.ts left the pinned runtime output unchanged"
  ],
  "rejected": [
    {"option": "Run npm run format over the whole tree", "reason": "It would mix unrelated reformatting into a repair diff a reviewer has to read; only these seven files were red."},
    {"option": "Add a formatter ignore entry for the new files", "reason": "That weakens a standing gate to hide a mechanical defect, and the no-lint-type-disables floor rejects suppression as a fix."}
  ],
  "reopenWhen": "The formatter version changes, or a later change reintroduces an unformatted order-owned file."
}
```

## WO-110-D009 — VER-001 F2 and F3: new WO-110 authority and feedback editions, at revision 001

```json
{
  "id": "WO-110-D009",
  "kind": "repair",
  "date": "2026-09-20",
  "dispatch": "resume: fix",
  "decision": "Select fresh WO-110 authority and feedback evidence editions rather than rewriting the retained WO-146 bytes, and carry both at revision 001 because the first WO-110 mint was superseded by the skeleton component bump recorded in D010.",
  "evidence": [
    "authority-evidence before the repair: stale WO-146 revision 002 evidence: bundle-diff.json; select a new edition or revision to preserve existing evidence",
    "feedback-evidence before the repair: feedback evidence is stale; FEEDBACK_SOURCE_PATHS in packages/skeleton/src/feedback-audit.ts includes the WO-110-modified actor-catalog.ts, actor-contract.ts, worker-transport.ts and worker-protocol.ts",
    "The .claude diff is entirely the regenerated runtime snapshot hash (723ca3cd51f8b638 to its successor) that follows the changed actor-catalog and actor-contract build output, so the generated surfaces could not be reverted to preserve the WO-146 edition",
    "feedback-audit.ts feedbackSourceFile omits only /version and /license from the lockfile and its workspace entries, so the console workspace pin @dotln/skeleton is inside the feedback subject and the D010 bump invalidated the revision-null mint",
    "The live recording is required, not optional: scripts/feedback-evidence.mjs validateSelfhost asserts the recorded audit subject equals readFeedbackSource(root).subject and requires a claude-cli-print or codex-cli-exec verifier stream",
    "docs/evidence/WO-110/feedback-001 holds feedback.json, selfhost-audit.jsonl and selfhost-verification.jsonl from the live run; docs/evidence/WO-110/authority/001 holds authority.json and bundle-diff.json",
    "After selection: authority-evidence 2 passed, 0 failed; feedback-evidence 2 passed, 0 failed"
  ],
  "rejected": [
    {"option": "Rewrite the WO-146 edition in place", "reason": "Both writers refuse it (evidence edition is immutable; select a new edition), and it would destroy a retained historical observation to make a current subject look green."},
    {"option": "Revert the generated .claude surfaces to keep the WO-146 authority edition", "reason": "Those bytes are derived from the changed build output; reverting them would leave installed hooks importing a snapshot this tree no longer produces."},
    {"option": "Record the selfhost streams with --transport fake", "reason": "The runbook states a fake transport cannot be recorded as the witnessed live self-hosted run, and validateSelfhost rejects any transport outside the two live CLIs."},
    {"option": "Delete the superseded revision-null WO-110 mint", "reason": "Superseded per-order editions are the repository's normal residue (WO-143 feedback, feedback-001, feedback-002; WO-144 authority/001 through 004); a revision preserves what was generated instead of quietly removing it."}
  ],
  "followup": "The revision-null WO-110 authority and feedback editions are superseded residue that no manifest selects; a later cleanup order may prune unselected editions repository-wide rather than per order.",
  "reopenWhen": "A declared feedback or authority source changes again, or the compiler package version moves and invalidates the retained live streams."
}
```

## WO-110-D010 — VER-001 classified release-surfaces as inherited; it is subject-caused, and the skeleton component is bumped

```json
{
  "id": "WO-110-D010",
  "kind": "repair",
  "date": "2026-09-20",
  "dispatch": "resume: fix; equipped Adjacent Repair",
  "decision": "Treat the release-surfaces failure as a fourth subject-caused defect and bump @dotln/skeleton from 0.31.0 to 0.32.0 as a minor, additive change, correcting VER-001's classification of that suite as inherited from base.",
  "evidence": [
    "VER-001 states: release-surfaces and five dependent suites are inherited, while F1-F3 are the three additional current-subject failures",
    "The only failing rule at this subject is: FAIL component-version @dotln/skeleton: src changed; observed 0.31.0; previous v0.35.1 0.31.0; expected a different version",
    "scripts/release.mjs componentVersionRules pushes the revision into the diff only when --committed is given, so the document suite compares the v0.35.1 tag against the working tree, not against a commit",
    "git diff v0.35.1 main -- packages/skeleton/src is empty, so the rule reports src unchanged and passes at the clean base; the change it observes is WO-110's own uncommitted skeleton source",
    "After the bump: node scripts/test-runner.mjs --document --only release-surfaces is 2 passed, 0 failed",
    "The five suites VER-001 called inherited dependents were preflight-blocked, not failing: run directly they are skeleton-docs 38 passed 0 failed, console-docs 2 passed 0 failed, lineage-fixtures 7 passed 0 failed, and refute-plan check exit 0",
    "Compatibility impact is additive: an optional local field on ActorSpec and ActorResult, a local-model-http member added to WorkerTransportName, and a localModelAdapter replacing a module-local unavailable stub; nothing was removed from the exported surface",
    "packages/console/package.json and package-lock.json carry the workspace pin to 0.32.0; scripts/release.mjs workspacePinRules requires the pin to track the component version",
    "packages/skeleton/src/version.ts HARNESS_HOST_VERSION tracks the component version and moved to 0.32.0, which changed the runtime snapshot and required node scripts/bootstrap.mjs to re-emit the 31 generated surfaces"
  ],
  "rejected": [
    {"option": "Defer to VER-001's inherited classification and leave release-surfaces red", "reason": "Evidence before claims: the rule compares the tag against the working tree, and the base diff is empty, so the failure is caused by this subject. Carrying an inherited failure into review is exactly what the executor duty forbids."},
    {"option": "Bump the application target instead of the component", "reason": "The application target was already retimed to v0.36.0; the failing rule is per-component and reads packages/skeleton/package.json."},
    {"option": "Bump @dotln/skeleton to 1.0.0 or a patch", "reason": "The change adds optional surface without removing any, so it is neither breaking nor a fix-only patch; minor matches the order's declared minor classification."},
    {"option": "Leave the console workspace pin at 0.31.0", "reason": "npm would resolve the pin outside the workspace, and workspacePinRules requires the pin to match the component version."}
  ],
  "followup": "VER-001's inherited-failure classification for release-surfaces and its five dependents was not reproduced; the next verification should re-derive the base comparison rather than carry that sentence forward.",
  "reopenWhen": "The component-version rule changes what revision it compares, or a later release retiming changes the skeleton component baseline."
}
```

## WO-110-D011 — Final review: the reproduction block names no worktree path

```json
{
  "id": "WO-110-D011",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "decision": "Within the reviewer's bounded cleanup, replace the literal worktree path that opened the availability record's reproduction block with the playbook's placeholder form, so the block stays runnable after release close removes the worktree.",
  "evidence": [
    "docs/discovery/local-model-transport-2026-09-20.md §Reproduction opened with cd /Users/dylanwood/Projects/DotLn-wo110, the executor's worktree, which release close removes after the merge",
    "docs/PLAYBOOK.md writes the same step as cd <main> and cd ~/Projects/DotLn; docs/discovery/local-runner-2026-09-18.md's reproduction block names no directory at all",
    "git grep on main: the literal home path appears only in seven immutable final reviews and planning receipts, each time as an observation, never as an instruction"
  ],
  "rejected": [
    {"option": "Leave the path as recorded", "reason": "A reader following the block after the merge fails at its first line, because the worktree no longer exists."},
    {"option": "Rewrite the seven committed reports that carry the same literal path", "reason": "They are immutable records of their own subjects, and the path there records where a check ran rather than telling a reader where to go."}
  ],
  "reopenWhen": "A document check begins refusing absolute home paths, or the playbook changes its placeholder form."
}
```

## WO-110-D012 — Final review: a bare `null` completion body is labelled `transport-failed`, boarded up for the next order that touches the transport

```json
{
  "id": "WO-110-D012",
  "date": "2026-09-20",
  "dispatch": "resume: final review",
  "decision": "Leave the verified transport bytes unchanged and record that an HTTP 200 body consisting of the JSON literal null is reported as transport-failed rather than invalid-result; the failure is typed, bounded and reaches the resident as the same worker-failed observation either way.",
  "evidence": [
    "Reviewer probe against a loopback double at this subject: a 200 response whose body is the JSON literal null ended as WorkerFailure transport-failed with detail local endpoint read, because decodeLocalModelResult reads payload.choices on a null payload before its own invalid-result branches",
    "The same probe set: an empty choices array, a non-array choices value, an HTML body and an array content value all ended as invalid-result, and a 503 body naming a missing model ended as model-unavailable",
    "packages/skeleton/src/local-model-actor.ts maps every WorkerFailure code to reason worker-failed with the code in the local observation, so the resident's outcome is identical for both codes",
    "VER-002 passed criterion 1 at these bytes; a source change here would need a fresh product gate and re-verification for a label on a body no observed runner has produced"
  ],
  "rejected": [
    {"option": "Change payload.choices to payload?.choices in this review", "reason": "It is a source edit after the verified subject; the label changes no resident behavior and no recorded row, so a fresh gate and verification cost more than the label is worth inside this order."},
    {"option": "Add a test that pins the current label", "reason": "A test asserting the mislabel would make the later fix harder, not easier."}
  ],
  "followup": "The next order that edits packages/skeleton/src/local-model-transport.ts, WO-138 if it comes first, guards the null payload in decodeLocalModelResult so the case reports invalid-result, and adds the null-body case beside the existing prose and empty-content cases in packages/skeleton/test/local-model.test.ts.",
  "reopenWhen": "A runner is observed returning a bare null body, or local-model-transport.ts changes for any other reason."
}
```
