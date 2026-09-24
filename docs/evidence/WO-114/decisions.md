# WO-114 decisions — runtime status projection

Dispatch: `resume: next`, 2026-09-24. Actor: Codex CLI 0.156.1,
`gpt-6-sol`, effort `xhigh` (session readback). Authority:
`docs/work-orders/WO-114-runtime-status-projection.md`.

## WO-114-D001

```json
{
  "id": "WO-114-D001",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 objective and criteria 1–4",
  "decision": "Define runtime-status-v1 in compiler, project the resident's folded log and the generated work-order index into a local atomic file after each resident event, and let the console read and watch that file. Export only selected status fields and coded reasons.",
  "evidence": [
    "The current skeleton package depends on compiler; console depends on both compiler and skeleton. A contract in console would reverse the resident's dependency direction.",
    "ResidentTransaction.append folds and persists each resident event under the append lock; ResidentHost.tick and presence/handoff commands all use ResidentStore transactions.",
    "The generated index has Active and Open sections with State, Dependencies and Verification fields; WO-120-derived orders appear under the same WO-NNN headings.",
    "Actor specs may contain absolute command and working-directory paths or a local endpoint, and mission-hold prose may include finding evidence. Those raw objects cannot enter the privacy-limited projection."
  ],
  "rejected": [
    {"option": "NoOp", "reason": "The actor board is a historical, invocation-time view and the resident currently emits no live status file, so the order's operator-flow outcome remains missing."},
    {"option": "Contract in console", "reason": "The resident would have to depend on its UI host or duplicate the contract."},
    {"option": "A second work-order status source", "reason": "It would disagree with the generated index and miss derived identities or lifecycle changes."},
    {"option": "Copy raw event payloads and actor specifications", "reason": "Their command, working-directory, endpoint and finding fields can disclose physical paths or local identifiers."}
  ],
  "reopenWhen": "A second resident consumer needs fields the versioned contract cannot safely express, or fixture evidence shows the index adapter loses an open order or a status transition."
}
```

Goal alignment: the projection lets the operator see resident activity and order
state without supervising a terminal session. It advances the always-on runtime
and its UI consumer on the current critical path. Policy resistance and lower-
performance drift are checked by deriving from the folded log and generated
index; the projection cannot grant authority. The shared-compute cost is an
atomic local write per event, measured by the required checks rather than an
extra service. One contract and one text host limit escalation. The fixture
must prove behavior, not merely validate a JSON shape (rule beating and wrong
goal). The console can be replaced without losing the contract (success to the
successful), and a restart rebuilds the file without operator rescue (shifting
the burden). Naive Interventionism favors the existing log, lock and console
host; NoOp leaves the live status gap. The file is disposable and reversible.

## WO-114-D002

```json
{
  "id": "WO-114-D002",
  "kind": "experiment",
  "date": "2026-09-24",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "decision": "Keep the current method; decline a separate economy experiment before implementation.",
  "question": "Would a small timing probe choose a cheaper event-publication method for WO-114?",
  "alternatives": ["Write the required per-event projection under the existing append lock", "Probe transaction-end-only writing or a separate watcher"],
  "observation": "The order requires publication on each event as well as each tick; transaction-end-only writing can omit intermediate event states, and a separate watcher adds another process. The required fixture and npm test will measure the viable method's correctness and regression.",
  "budget": {"wallSeconds": 900},
  "execution": "declined",
  "reason": "The alternatives do not meet the same event-publication behavior, so timing them would not decide between viable methods.",
  "cost": {"wallSeconds": 0, "tokens": null, "commands": ["No experimental command: declined"], "source": "No separate economy probe was run; preparation and this receipt are part of ordinary order work and were not separately timed."},
  "effect": {"wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["No experimental command: declined"], "summary": "No economy method was adopted; required acceptance checks will test the implementation."},
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {"lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null},
  "evidence": ["WO-114 objective requires every event and tick; ResidentTransaction.append is the common write boundary for host and external presence/handoff events."],
  "rejected": [{"option": "Run a timing-only probe", "reason": "The proposed shortcuts have different semantics and cannot replace the required publication point."}],
  "reopenWhen": "A measured per-event write cost threatens a required gate and a semantically equivalent bounded alternative is available."
}
```

## WO-114-D003

```json
{
  "id": "WO-114-D003",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 release classification and write-backs",
  "decision": "Assign application v0.47.0 above the observed local v0.46.2 tag, and bump only the changed compiler, skeleton and console components to 0.19.0, 0.40.0 and 0.2.0. Preserve kernel 0.6.0. The compiler's new exported contract, resident publication and console status command are additive minor changes.",
  "evidence": [
    "git tag --list --sort=-version:refname and release list both showed v0.46.2 as the latest local release in this worktree.",
    "WO-114 declares a minor application release; its heading still had the activation placeholder and README named v0.46.2 when release prepare --local first refused for lack of a strict heading version.",
    "The changed source is in compiler, skeleton and console. Kernel source is untouched. release prepare --local subsequently reported that v0.47.0 remains current."
  ],
  "rejected": [
    {"option": "Retain the placeholder", "reason": "The local release-preparation check requires exactly one strict work-order heading version."},
    {"option": "Bump kernel", "reason": "No kernel source or compatibility contract changed in this order."},
    {"option": "Patch component bumps", "reason": "Each changed component exposes a new additive status capability, not only a repair."}
  ],
  "reopenWhen": "Final review integrates a newer main release or an already-consumed component version and must retime under the same minor classification."
}
```

Same-day correction: I initially treated the order's “version assigned at
activation” wording as evidence that activation had assigned a version. The
checked heading still held the placeholder, `README.md` still named `v0.46.2`,
and `release prepare --local` refused. The intended duty is to assign the
declared minor target during execution before preparation; I set `v0.47.0`,
recorded the roadmap activation note, and reran preparation successfully.

## WO-114-D004

```json
{
  "id": "WO-114-D004",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 criterion 2 and full npm test",
  "decision": "Place the public runtime-status-v1 schema and console decoder in packages/console; keep the producer's matching type and index adapter in skeleton, which console already consumes. Keep compiler at 0.18.0 and bump only skeleton to 0.40.0 and console to 0.2.0. Preserve the existing actor-board fixture bytes.",
  "evidence": [
    "WO-114 explicitly permits the contract in compiler or console and requires existing board fixtures to remain byte-identical.",
    "The first npm test with compiler 0.19.0 failed the WO-032 selfhost snapshot and mechanism-count test: compileFeedbackUnits keys the policy hash on COMPILER_PACKAGE_VERSION, while the pinned WO-154 feedback edition was recorded under 0.18.0.",
    "The console already depends on skeleton, so it can consume a producer type and decoder without a new dependency. The schema in console is the public interchange contract."
  ],
  "rejected": [
    {"option": "Regenerate actor-board snapshots", "reason": "That would violate WO-114 criterion 2's byte-identical board fixture requirement and hide the historical feedback edition's drift."},
    {"option": "Compile the historical feedback policy as current", "reason": "The actor board deliberately labels an edition unavailable after compiler identity moves; reinterpreting it would weaken that evidence boundary."},
    {"option": "Retain compiler 0.19.0 without source changes", "reason": "A component bump without its new source contract would impose the same fixture cost for no compiler deliverable."}
  ],
  "reopenWhen": "A future common contract requires compiler-owned semantics beyond this file interchange and supplies a separately selected current feedback evidence edition."
}
```

Same-day correction: D001 placed the contract in compiler, and D003 included a
compiler `0.19.0` bump. The full gate showed that choice conflicts with the
order's pinned actor-board fixture requirement through the compiler's feedback
policy hash. The contract is now in console, its producer and decoder share the
skeleton type, and the compiler source and version remain at `0.18.0`. The
first gate was stopped after the confirmed console failure; it did not record a
passing check and will be rerun on the corrected subject.

## WO-114-D005

```json
{
  "id": "WO-114-D005",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 criterion 1 and WO-016 AC1 regression",
  "decision": "Expose the next cadence time through a read-only presence-machine method, and have both the resident policy path and the runtime-status projector use it. Keep cadence evaluation in the existing policy interpreter.",
  "evidence": [
    "The second npm test passed the actor-board fixture but failed WO-016 AC1 because runtime-status.ts directly called evaluateCadence, which the architecture test confines to the policy interpreter.",
    "PresenceMachine already owns phase selection and due-time evaluation for dispatch; the new nextCadenceAt method returns the same due time without advancing the machine.",
    "The focused WO-016 scenario and WO-114 status tests passed after moving the call."
  ],
  "rejected": [
    {"option": "Duplicate the cadence calculation in the projector", "reason": "That would create a second policy interpretation and risk a status/dispatch mismatch."},
    {"option": "Relax the WO-016 architecture assertion", "reason": "It enforces a pre-existing single decision owner and the status view does not need to change that boundary."}
  ],
  "reopenWhen": "A future cadence contract needs fields that PresenceMachine cannot expose without mutating policy state."
}
```

## WO-114-D006

```json
{
  "id": "WO-114-D006",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 final gate and evidence-source correction",
  "decision": "Regenerate the harness snapshot, mint WO-114 revision 001 authority and feedback editions, run a new live feedback verifier episode, and select those editions in docs/evidence/current.json. Keep the existing console actor-board fixture recordings pinned to their historical inputs so their bytes remain unchanged.",
  "evidence": [
    "The third npm test failed only WO-154 criterion 3: presence-machine.ts changed, and the selected WO-155 feedback edition correctly refused to inherit an older live audit. The source is explicitly registered in scripts/lib/evidence-sources.mjs.",
    "Harness emit refreshed 31 generated surfaces and the pinned runtime snapshot after the presence-machine change. The new WO-114 authority edition then passed --check with 34 bundle comparisons.",
    "A first live-audit attempt stopped before worker launch because /var is an alias for /private/var on this host. Recovery through the physical path completed the same store with ten fixtures, 1192 saved instruction bytes, and a codex-cli-exec verifier; the WO-114 feedback edition's --check says its live audit judged the current source.",
    "Console fixture --check passed for all five existing cases after selecting the new evidence editions; those fixtures retain their previously pinned input recordings."
  ],
  "rejected": [
    {"option": "Exclude presence-machine.ts from the feedback source set", "reason": "Cadence dispatch policy is judged behavior and the registered source must remain covered."},
    {"option": "Carry the WO-155 live audit into this edition", "reason": "The changed policy source invalidates its judged behavioral identity; WO-154 criterion 3 explicitly refuses that inheritance."},
    {"option": "Re-pin and regenerate the actor-board fixture recordings", "reason": "WO-114 criterion 2 requires existing board fixture bytes to remain identical; their historical recording remains valid for that fixture."}
  ],
  "reopenWhen": "A later registered behavior change makes the WO-114 evidence stale, or a console consumer can no longer read the selected edition without changing historical fixture bytes."
}
```

## WO-114-D007

```json
{
  "id": "WO-114-D007",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-114 acceptance and goal-alignment review",
  "decision": "Hand the completed status projection to independent verification with application target v0.47.0. The local file serves the operator's live visibility goal without a second status authority or service. Keep the per-event sync cost visible as unmeasured rather than claiming an economy gain.",
  "evidence": [
    "The fake-clock fixture pins five successive file hashes and compares the complete file after restart; privacy assertions and console watcher/section fixtures pass.",
    "The final npm test passed 27 suites with 0 failures in 344.96 s; test:docs passed 21 checks with 0 failures; the historical console fixture check passed all five cases.",
    "Authority and feedback revision 001, harness check, publication check, release surface check, format check and git diff --check passed on the implementation subject.",
    "The projection reads the resident fold and generated index, grants no action, and records coded reasons. This avoids a parallel work-order truth and keeps raw host details out of the UI file."
  ],
  "rejected": [
    {"option": "Claim a measured runtime saving", "reason": "The accepted per-event file and directory sync adds I/O; no comparable timing measurement was taken."},
    {"option": "Broaden this order to the loopback or Angular host", "reason": "WO-115 and the operator's fork own those consumers; the shared file and schema complete WO-114's boundary."}
  ],
  "reopenWhen": "Independent verification finds a fixture gap, privacy leak or event-to-file mismatch, or measured per-event sync cost threatens resident operation."
}
```

## WO-114-D008 — VER-001: the gate, the order section and projection failure isolation need repair

```json
{
  "id": "WO-114-D008",
  "date": "2026-09-24",
  "dispatch": "resume: verify",
  "decision": "Record VER-001 as a failed verification and route WO-114 to repair. F1 (major, criterion 5): the product gate failed in one of two verifier runs because per-event status publication pushed the existing WO-143 thirty-round restart test past its 60 s timeout. F2 (major, objective and criteria 1 and 4): the work-order section depends on which writer published last, because the default index path is relative to the installed module and only the host accepts an override. F3 (major, design): a projection failure aborts the resident's authoritative operation after its event is durable. F4-F6 (minor): console watch robustness, schema/decoder and record inaccuracies, and status-render sanitization. The verifier changes no implementation, fixture or edition.",
  "reopens": {
    "decisionId": "WO-114-D002",
    "observation": "Its reopening condition held: a measured per-event write cost threatens a required gate. Isolated, alternating runs of packages/skeleton/dist/test/resident.test.js 'WO-143 thirty consecutive kill/restart rounds' took 31.8 and 32.4 s on a HEAD build and 48.0, 39.3 and 41.3 s on the WO-114 subject against a 60 s timeout; the full gate timed it out. The test performs 777 status publications; one atomic write with file and directory fsync measured 9.0 ms (a reviewer measured 14.2 ms), while reading and parsing the 391 KB index measured 0.9 ms."
  },
  "evidence": [
    "npm test on the unchanged verification subject, run 1: 26 passed, 1 failed, 406.02 s; skeleton 433 tests, 432 passed, 1 cancelled: 'WO-143 thirty consecutive kill/restart rounds remain openable on once and loop paths' timed out after 60000 ms (packages/skeleton/test/resident.test.ts:864-865). Run 2: 27 passed, 0 failed, 352.62 s. The executor's one recorded run passed (344.96 s), so the failure is intermittent",
    "F2: a ResidentHost using the repository build published 54 available orders; one recordHarnessHeartbeat call from the generated hooks' harness snapshot (.claude/hooks/presence-pretooluse.mjs:5, .runtime/harness/68c6cb9c738d03a0, which has no docs/ tree) then published workOrders unavailable with no items. resident-store.ts:122-124 anchors the default index to import.meta.url; resident-store.ts:255, 280 and 302 build helper stores without the host's workOrderIndexPath; dotln.ts:124-127 passes none, ignoring DOTLN_LAUNCHPAD",
    "F3: with the index unreadable at the dispatch append, ResidentHost.tick rejected (EISDIR) after ScriptEpisodeDispatched was durable; adapter.run was never called and the episode was later recorded ScriptEpisodeLost. start() rejected and left the lifetime lock held in-process; recordPresenceObservation threw after OperatorPresenceObserved was durable and skipped its ClockSampled. The triggers were synthetic; the code path is the same for any throw inside publish (resident-store.ts:95-105, 132-165, 197)",
    "F4: console status --watch rendered each atomic replacement twice on darwin and exited 1 with an uncaught ENOENT stack trace carrying the absolute store path when the file was deleted (packages/console/src/runtime-status.ts:78-81); malformed and foreign-version replacements also crash it",
    "F5 and F6: runtime-status-v1.schema.json requires ^WO-[0-9]{3}$ for liveEpisodes[].order and holds[].order while decodeRuntimeStatus admits any string there; D004 places the decoder in console although it is defined in skeleton; console README says the schema is exported by @dotln/console, whose exports map has only '.'; the status render keeps bidi overrides that the board renderer strips (console render.ts:12-18)",
    "D007's own reopening condition also held: independent verification found an event-to-file mismatch (F2) and a measured per-event sync cost that threatens resident operation (F1)",
    "docs/verifications/WO-114/VER-001.md records reproduction, acceptance matrix, independent checks and limits"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-114 gives the operator live visibility of the always-on resident and its order state without supervising a terminal; WO-115 and the Angular consumer read the same file. A file whose order section flips with each heartbeat, a projection able to lose a dispatched episode, and a gate that no longer passes reliably each defeat that outcome on the critical path.",
    "traps": {
      "policyResistance": "Only the host honours a configured index; helpers and the harness snapshot resolve their own, so the projection fights itself.",
      "tragedyOfTheCommons": "Per-event file and directory fsync spends the shared gate's timing margin; an unrelated WO-143 test pays for it.",
      "driftToLowPerformance": "Accepting an intermittent timeout as flakiness would lower the gate's standard; the A/B measurement attributes it.",
      "escalation": "The repair should restore margin and containment without adding a gate, a service or a second status source.",
      "successToTheSuccessful": "The host path is well covered by the executor fixture; the heartbeat and helper writers were not, and they are where the defects surface.",
      "shiftingTheBurden": "Without containment the operator must diagnose a lost episode or a held lock caused by a disposable file.",
      "ruleBeating": "The pinned hashes pass because the fixture appends through its own store with the same index; the property it stands for does not hold across writers.",
      "seekingTheWrongGoal": "The goal is a truthful live view from every writer, not five stable hashes from one writer."
    },
    "naiveInterventionism": "The verifier keeps implementation, fixtures, editions and the WO-143 test unchanged; the smallest probes were an isolated A/B against a scratch HEAD build, a publication counter and scratch stores. Loosening the WO-143 timeout would hide the cost rather than remove it.",
    "noOp": "Passing would ship an intermittently failing gate, a projection that loses orders during every live worker episode, and a disposable file that can abort authoritative work. Recording findings for repair is warranted."
  },
  "rejected": [
    {
      "option": "Pass because the gate passed in two of three recorded runs",
      "reason": "A gate that fails intermittently on the subject is not reliably green, and the isolated A/B attributes a 23-51% slowdown of the timed-out test to WO-114's publication cost. F2 and F3 fail independently of the gate."
    },
    {
      "option": "Treat the WO-143 timeout as unrelated flakiness",
      "reason": "The HEAD build ran the same test in about 32 s; the subject needs 39-48 s in isolation, and 777 publications at the measured write cost account for the difference."
    },
    {
      "option": "Change the implementation or the WO-143 timeout during verification",
      "reason": "The verifier judges the implementation independently; the repair belongs to the executor."
    }
  ],
  "followup": "WO-114 executor on resume: fix: resolve VER-001-F1 to F6. Restore the product gate's margin by reducing per-event publication cost without weakening the WO-143 test or dropping per-event publication; make every writer of a store (host, presence, heartbeat through the harness snapshot, handoff answer, mission-hold clear) project the same selected launchpad index and add a fixture for a helper and a snapshot-hosted heartbeat; contain projection failures so the log-authoritative operation completes and the next publish rebuilds the file, with a regression for a failing publish at dispatch, start and presence; make console status --watch survive deletion and invalid or foreign files with one render per change; align the schema and decoder order rule and correct D004 and the README export wording; sanitize bidi controls in the status render as the board does. Priority: high.",
  "reopenWhen": "An independent rerun of npm test passes with the WO-143 test back within its original margin, every writer publishes the same order section, and a failing publish no longer aborts a durable resident operation."
}
```

## WO-114-D009 — Correction: VER-001's headline overstates the gate result

```json
{
  "id": "WO-114-D009",
  "kind": "correction",
  "date": "2026-09-24",
  "dispatch": "resume: verify; read-back of VER-001 after its result was recorded",
  "decision": "Read VER-001's verdict line and closing sentence with this qualification: the product gate failed in one of the verifier's two runs on the unchanged subject and passed in the other; the executor's one recorded run passed. The report body, criterion 5 and F1 state this precisely. VER-001 stays byte-identical as recorded in checkpoint 4; the fail verdict is unchanged because F2 and F3 fail independently of the gate.",
  "misread": "The verdict line says 'the product gate fails' and the closing sentence says passing would ship 'a failing gate', which reads as a deterministic failure.",
  "meant": "An intermittent failure attributed to WO-114: run 1 26 passed, 1 failed (WO-143 timeout); run 2 27 passed, 0 failed; isolated A/B 31.8-32.4 s on HEAD against 39.3-48.0 s on the subject.",
  "changed": "Nothing in the immutable report; this record and D008 carry the precise statement.",
  "evidence": [
    "docs/verifications/WO-114/VER-001.md criterion 5 row and F1 'Observed' paragraph",
    "docs/control/orders/WO-114.jsonl VerificationCompleted at 2026-09-24T22:42:59.493Z, checkpoint refs/dotln/checkpoint/WO-114/4"
  ],
  "rejected": [
    {
      "option": "Edit VER-001 after its result was recorded",
      "reason": "A recorded verification report is immutable; checkpoint 4 binds its bytes."
    }
  ],
  "reopenWhen": "A later verification of WO-114 supersedes VER-001."
}
```

## WO-114-D010 — Repair publication and consumer boundaries

```json
{
  "id": "WO-114-D010",
  "date": "2026-09-24",
  "dispatch": "resume: fix; VER-001-F1 through F6",
  "decision": "Keep per-event atomic replacement but omit durability syncs for the disposable status file. Bind the selected launchpad index in private store metadata so all helper and snapshot writers read the same source. Contain projection I/O failures outside the durable event operation, and recover console watching with deduplicated valid renders and a generic unavailable state. Align decoder order validation with the schema and sanitize display controls.",
  "evidence": [
    "VER-001 measured 777 publications in the unchanged WO-143 restart test, with 9–14 ms per synced publication and an intermittent 60 s timeout.",
    "resident-store.ts calls publish after the event fsync without containment, and its module-relative default index differs between the host and harness snapshot.",
    "dotln.ts already uses the installed kit's control bridge; config.mjs supplies findLaunchpad and docPath including configured work-order roots.",
    "D002 is the order's existing economy experiment; D008 reopened it. This repair uses that measurement and adds no second experiment."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "Reliable live status supports the always-on resident and WO-115 consumer without interrupting actor work.",
    "traps": {
      "policyResistance": "All writers read the store's selected index; no module-relative competing source.",
      "tragedyOfTheCommons": "Remove disposable-file fsync cost while retaining the authoritative log fsync and per-event publication.",
      "driftToLowPerformance": "Keep the existing WO-143 timeout and run its actual kill/restart test.",
      "escalation": "No new service, gate, dependency or scheduler.",
      "successToTheSuccessful": "Exercise helper and snapshot writers in addition to the original host fixture.",
      "shiftingTheBurden": "Publication and watcher failures recover on subsequent updates without operator rescue.",
      "ruleBeating": "Regressions fail at start, dispatch and presence boundaries and compare writer output against replay.",
      "seekingTheWrongGoal": "Judge faithful usable status and uninterrupted resident work, rather than only pinned hashes."
    },
    "naiveInterventionism": "Preserve event durability, append locking and actor policy. Change only disposable publication and consumer handling. A private index binding is configuration, not a second order status source.",
    "noOp": "Leaves independently reproduced episode loss, incorrect order lists, console crashes and gate timing regression."
  },
  "rejected": [
    {
      "option": "Drop intermediate event publications or raise the existing timeout",
      "reason": "Violates the order's publication requirement or weakens existing recovery evidence."
    },
    {
      "option": "Pass an index path separately to every helper and worker environment",
      "reason": "Creates multiple configuration channels that can disagree; store metadata follows every writer, including installed snapshots."
    },
    {
      "option": "Resolve the index from every writer's current working directory",
      "reason": "Worker and helper processes may run outside the selected launchpad."
    }
  ],
  "reopenWhen": "Regressions show that the shared binding disagrees across writers, publication still alters resident progress, or the original recovery test lacks its timing margin."
}
```

## WO-114-D011 — Correct contract and evidence claims

```json
{
  "id": "WO-114-D011",
  "kind": "correction",
  "date": "2026-09-24",
  "dispatch": "resume: fix; VER-001-F5 and evidence source inspection",
  "decision": "Correct the contract location and export claims: the public JSON Schema lives in console as a file; skeleton defines the producer type and decoder, which console re-exports. Keep the two representations with differential acceptance tests and no new runtime dependency. Refresh authority revision 002 after harness regeneration; retain feedback revision 001 because its executable check validates the current registered behavior.",
  "misread": "D004 called the decoder console-owned, and the README described the schema as a package export. During repair I also said the resident-store change required a fresh live feedback audit before checking its registered source set.",
  "meant": "Console owns the schema file and re-exports skeleton's single TypeScript type and decoder; the exports map has no schema subpath. Resident-store is registered in the harness source closure, but FEEDBACK_SOURCE_PATHS does not include it; the feedback checker accepted the existing live audit.",
  "changed": "The README now distinguishes the schema file from code exports. Decoder order validation matches the schema for episodes, holds and work-order rows; a differential fixture covers valid, null and invalid identifiers. The repair uses a new authority edition and retains the checked feedback audit.",
  "evidence": [
    "packages/console/package.json exports only the package root; packages/console/src/index.ts re-exports runtime-status-contract.js from skeleton.",
    "The focused status suite passes 10 tests, including schema/decoder order parity, control sanitization, CLI watch recovery and snapshot-hosted heartbeat parity.",
    "node scripts/feedback-evidence.mjs --check passed after the resident-store changes; authority-evidence.mjs --check refused revision 001 because generated hook bytes changed."
  ],
  "rejected": [
    {
      "option": "Introduce a general JSON Schema runtime validator or generator",
      "reason": "This bounded rule mismatch is repaired and differentially tested without a new dependency or a second executable decoder."
    },
    {
      "option": "Move the contract back into compiler",
      "reason": "D004's verified compiler-version coupling would change the required historical board fixture bytes."
    },
    {
      "option": "Purchase a fresh feedback verifier episode despite a passing source check",
      "reason": "The registered feedback behavior did not change; the existing audit remains evidence for that subject."
    }
  ],
  "reopenWhen": "The schema and decoder diverge beyond bounded validation rules, or a registered feedback behavior change invalidates its current audit."
}
```

## WO-114-D012 — Repair outcome

```json
{
  "id": "WO-114-D012",
  "date": "2026-09-24",
  "dispatch": "resume: fix; repair handoff",
  "decision": "Return the repair of VER-001-F1 through F6 for independent verification. Preserve the minor release classification and prepared versions. D010's publication and source-selection changes meet the focused regressions and the full product gate; D011 corrects the contract and evidence records.",
  "evidence": [
    "npm test: 27 passed, 0 failed, 293.52 s, 71 fresh tasks.",
    "The unchanged WO-143 thirty-round kill/restart test for once and loop passed in 32.53 s in isolation and passed inside npm test with its original 60 s timeout.",
    "Ten focused runtime-status tests passed; all five existing actor-board fixture outputs matched byte for byte.",
    "Authority revision 002 and feedback revision 001 checks passed; planning, formatting, publication and diff checks passed; release prepare --local kept v0.47.0.",
    "docs/evidence/WO-114/repair.md maps the six findings to code changes and executed evidence."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The resident continues authoritative work despite projection failure, and the UI retains the launchpad's order list across helper and installed-snapshot writers. This enables the live status consumer without changing its authority.",
    "outcome": "D010's eight-trap and NoOp comparison is unchanged. The original timing standard and per-event visibility are preserved; additional service, dependency and live-audit costs were avoided. The single isolated timing observation supports removal of the measured regression, not a guaranteed per-order saving.",
    "naiveInterventionism": "Event durability, policy and original recovery assertions remain intact; the original status and board fixture bytes still match."
  },
  "rejected": [
    {
      "option": "Mark independent verification passed from executor tests",
      "reason": "Only the separate verifier dispatch can issue that judgment."
    },
    {
      "option": "Change application classification or bump untouched components during repair",
      "reason": "The bounded fixes complete the existing additive deliverable and do not change its compatibility classification."
    }
  ],
  "reopenWhen": "Independent verification reproduces any VER-001 defect or finds a regression against the original order."
}
```

## WO-114-D013 — VER-002: pass; two minor index-source hardening defects boarded up

```json
{
  "id": "WO-114-D013",
  "date": "2026-09-24",
  "dispatch": "resume: verify",
  "decision": "Record VER-002 as a passing verification of the repaired WO-114 subject. VER-001-F1 to F6 are resolved and criteria 1-5 are met. Board up two minor defects the independent review found and this verifier reproduced, without routing the order back to repair: VER-002-N1, dotln resident now refuses to start when the launchpad or its configuration cannot be resolved, a precondition the repair introduced to select the projection's index and that 04 and the console README do not state; VER-002-N2, a bound index path that is a FIFO or other blocking special file hangs the resident's first transaction while it holds the append and lifetime locks, so the 04 claims that unreadable index data is visibly unavailable and that a projection failure cannot abort resident work do not hold for that input. The verifier changes no implementation, product document or edition.",
  "reopens": {
    "decisionId": "WO-114-D010",
    "observation": "Its reopening condition 'publication still alters resident progress' holds for one contrived input: with a FIFO as workOrderIndexPath, ResidentStore.readIndex (resident-store.ts:137) blocks in readFileSync during the acquire transaction's publication; host.start() never completed within 5 s, the store recorded 0 events and no status file. Ordinary unreadable inputs (missing file, directory, malformed text, removed binding target) remain contained and publish orders unavailable."
  },
  "evidence": [
    "N1: a scratch store with a valid resident.json; dotln resident --once exited 1 with the generic 'worker host refused; inspect the store and declared environment before retrying' and appended 0 events when DOTLN_LAUNCHPAD named a missing directory and when the launchpad's dotln.config.json was malformed; dotln presence away under the same environment exited 0. An empty launchpad with no index ran and published orders unavailable. The cause is dotln.ts:124-130 calling docPath(findLaunchpad(), 'workOrders', 'README.md') outside any guard; config.mjs:676-677 throws on a missing DOTLN_LAUNCHPAD. The independent reviewer observed exit 0 with 2 events for the missing-launchpad case against the pre-WO-114 harness snapshot's dotln.js, which loads no configuration.",
    "N2: probe-r1-r3.mjs in session scratch: a child host started with a FIFO as workOrderIndexPath was terminated by a 5 s timeout with 0 events and no runtime-status-v1.json. WorkerStore already checks regular files for its own inputs; readIndex does not.",
    "Everything else passed: two npm test runs (27 passed, 0 failed, 293.52 s and 291.85 s); isolated WO-143 at baseline with 777 publications; 12 publications from host, helpers and the real generated hook all equal to replay from their own log prefix; injected ENOSPC, EMFILE and read-only-directory faults aborted nothing; watch recovery; board fixtures byte-identical. docs/verifications/WO-114/VER-002.md records the reproductions."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "WO-114 gives the operator live resident and order visibility and unblocks the WO-115 consumer. The repaired subject delivers that outcome on every ordinary input; N1 and N2 need a broken launchpad declaration or a special file at the index path.",
    "traps": {
      "policyResistance": "All writers now share one bound index; N1 and N2 concern how that one source is resolved, not a second source.",
      "tragedyOfTheCommons": "Another repair cycle would spend a gate run and a verification on edge inputs no ordinary launchpad produces; the follow-up keeps the hardening visible instead.",
      "driftToLowPerformance": "The defects are recorded as defects with a reopening, not waved through as expected behavior.",
      "escalation": "No new gate, service or dependency is proposed; the follow-up is a bounded guard and a regular-file check.",
      "successToTheSuccessful": "The pass rests on probes beyond the executor's own triggers, including the real hook and different fault kinds.",
      "shiftingTheBurden": "N1's generic refusal leaves the operator to diagnose a configuration error; the follow-up asks for the cause to be named or the start to proceed with orders unavailable.",
      "ruleBeating": "Criteria 1-5 are judged on replay parity and uninterrupted work, and the two documented claims that do not hold are named rather than hidden behind met criteria.",
      "seekingTheWrongGoal": "The goal is a truthful live view that cannot stop the resident; N2 is the remaining gap in that goal and is boarded up with a named owner."
    },
    "naiveInterventionism": "The verifier edits no implementation, product document or edition to turn its verdict green; it records the defects and their reproductions.",
    "noOp": "Withholding a pass would return the order to repair for two minor edge-input defects outside the acceptance criteria and delay WO-115; passing without a record would leave two false documented claims. Recording them with a follow-up is warranted."
  },
  "rejected": [
    {
      "option": "Fail VER-002 and route N1 and N2 to repair",
      "reason": "Both need a misconfigured launchpad or a special file at the index path; every acceptance criterion and every VER-001 finding is met on ordinary inputs, and the repair would not change the operator-visible outcome of this order."
    },
    {
      "option": "Treat N1 as intended behavior without a record",
      "reason": "04 and the console README describe the CLI's launchpad selection but not the new refusal, and the refusal message names no cause."
    },
    {
      "option": "Correct 04 or the README during verification",
      "reason": "The verifier holds no product-document editing authority; the correction belongs to the follow-up's owner."
    }
  ],
  "followup": "Resident index-source hardening, for the planner to place (low priority; a bounded fix beside WO-115 or the next resident-host order): resolve the dotln resident CLI's launchpad and index inside a guard so an unresolvable launchpad or malformed configuration either starts with orders unavailable or refuses with a message naming the cause, and document which; make ResidentStore.readIndex accept only a regular file (bounded read, no blocking special files) so a FIFO or device degrades to orders unavailable; optionally sweep stale .runtime-status-*.tmp files at lifetime acquire, since a SIGKILL between temporary write and rename leaves one. Add regressions for a missing DOTLN_LAUNCHPAD, a malformed configuration and a FIFO index; then correct the 04 and console README claims to match.",
  "reopenWhen": "The follow-up lands, or an ordinary launchpad produces either condition, or a later verification of WO-114 supersedes VER-002."
}
```
