# WO-219 decisions

## WO-219-D001 — Preserve the source ask and its evidence

```json
{
  "id": "WO-219-D001",
  "date": "2026-10-23",
  "dispatch": "resume: next; operator requests at least four subagents",
  "decision": "Resolve each of the fifty allocated rows against its complete source decision and the current implementation. Keep compound residuals visible; neither a fixed subfinding nor a passing fixture for the old behavior settles an entire unresolved row. Use research and scratch-only patch preparation, with this executor the sole writer in the selected worktree, followed by two fresh review workers.",
  "evidence": [
    "docs/work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md: criteria 1 to 3 and execution steps",
    "docs/evidence/WO-219/followups-before.json: all fifty rows allocated; register pending count 162 at activation baseline",
    "Independent scope research identified seven clearly reserved planning/operator rows, not an irreducible contradiction with the sixteen-row decline-and-packet limit. A Planner prefix alone does not withdraw the concrete repair authority this order supplies.",
    "WO-163-D021 voids the operator-confirmation half of WO-163-D020; the existing waiver is not submitted for reconfirmation."
  ],
  "rejected": [
    {
      "option": "Treat every planning-prefixed excerpt as outside execution authority",
      "reason": "Several source decisions prescribe concrete repairs that this order explicitly admits."
    },
    {
      "option": "Settle compound rows from one named-file fix",
      "reason": "It would drop unresolved parts of their retained source asks."
    }
  ],
  "reopenWhen": "Current source or executable evidence changes a row's judgment, or the operator changes this order's authority."
}
```

## WO-219-D002 — An enqueue without a mode does not establish authorship

```json
{
  "id": "WO-219-D002",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "FUP-d4493f4251e69c87: retain the witnessed mid-turn enqueue route while recording unattributed authorship when its command mode is missing, null or empty. Explicit prompt and task-notification modes keep their existing classifications. Digest-only retention and the existing queued-command attachment rule stay intact.",
  "evidence": [
    "Source read in full: docs/evidence/WO-188/decisions.md#wo-188-d009--item-7-a-host-task-notification-is-journaled-with-its-own-source-and-is-not-an-operator-message",
    "scripts/test-harness.mjs: an enqueue with no recorded command mode retains unknown authorship; Preflight harness-fixtures. The new fixture failed against baseline production bytes with actual operator versus expected unattributed, exit 1, at 2026-10-23T14:00:28Z.",
    "After the isolated promptRoute change and build, the new case and existing marked-notification case both passed, exit 0, at 2026-10-23T14:00:56Z. Final paired reversion details are recorded in repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Infer operator authorship from enqueue delivery alone",
      "reason": "The source observation establishes no commandMode field for that shape, and a host notice can use the same route."
    },
    {
      "option": "Drop the route or message observation entirely",
      "reason": "The latest matching transcript still witnesses delivery and its digest without establishing authorship."
    }
  ],
  "reopenWhen": "The native enqueue schema supplies a reliable authorship field or a recorded mode is classified incorrectly."
}
```

## WO-219-D003 — Own decisions in every phase

```json
{
  "id": "WO-219-D003",
  "date": "2026-10-23",
  "dispatch": "resume: next; operator direction during execution applies to every phase",
  "decision": "The operator directs every phase to make and explain its own decisions in the ADR and decision records, including when a blocker appears, instead of asking the operator to arbitrate implementation or change acceptance criteria. The operator further clarifies that no-op and deferred are acceptable outcomes: choose them when supported, with rationale, consequences and a reopening condition. Continue this order under its existing criteria and authority. Record the evidence, chosen action, tradeoffs, rejected alternatives and reopening condition. A reserved operator choice is retained as an evidence-backed packet with a safe default where this order expressly permits one; it is not an interruption or a request for a response.",
  "evidence": [
    "The operator's two messages during this dispatch reject shifting the burden in every phase and explicitly identify ADRs and decision records as the durable decision surface.",
    "The original fifty-row work order already permits a bounded combined set of declined rows and operator-only packets; no criterion or numerical limit is changed."
  ],
  "rejected": [
    {
      "option": "Ask the operator to choose a fix, change a criterion or increase a budget",
      "reason": "The current direction requires the executor to own those judgments within the existing contract."
    },
    {
      "option": "Treat the direction as permission to waive requirements or invent unavailable evidence",
      "reason": "It authorizes decisions and their records, not false claims or an expanded effects envelope."
    }
  ],
  "reopenWhen": "A later operator direction changes the standing delegation or new evidence requires a documented correction."
}
```

## WO-219-D004 — Correct inspection and probe errors

```json
{
  "id": "WO-219-D004",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Record this executor's oversized aggregate reads and mis-targeted fixture invocations as process failures. They establish no product verdict. Keep full probe output in session scratch and emit bounded case counts and result fields. Inspect a fixture's actual entry contract before launching it; count a positive only when the intended assertions ran.",
  "evidence": [
    "Several combined source reads exceeded their output budgets and were truncated. Subsequent reads select source sections and capped result fields; run-probe.mjs retains complete logs and emits selected case names, counts and the bounded-result record.",
    "Direct node --test calls to test-off-ramps.mjs and test-work-orders.mjs omitted their required owned temporary-root argument. Those failures are invalid controls. The root-fixture wrapper supplies the physical owned fixture root and clears inherited session identity; all 28 work-order fixtures then passed.",
    "The first launchpad-planning name filter selected no nested behavioral case. It is not a positive control. Running the parent test exercised all three new subcases and exposed two real failures for repair.",
    "The first story-writeback run failed a stale fixture string replacement, before the relocation assertion. The helper identified its obsolete plain-text needle after introducing the inline link; the corrected fixture retains the same behavioral obligations.",
    "The Release edition fixture initially expected refusal for a nested-empty link that the existing multipass renderer already normalizes. Baseline publication-normalization test passed; the corrected integration fixture asserts its absolute destination and retains the real quoted-definition refusal.",
    "Status correction at 2026-10-23T17:10Z: the post-repair node --test scripts/test-runner.test.mjs probe passed all165 tests in the primary runner fixture file. It was briefly called the entire runner-fixtures suite in commentary; expandSuiteTasks also adds test-release-fixtures.mjs, test-gate-deadlines.mjs and test-host-guard.test.mjs. The fresh complete gate, not this primary-file probe, covers the full suite.",
    "Sequencing correction before complete run 5: sync ran 17:46:56.314Z\u201317:47:30.714Z while format was mistakenly started at 17:47:21.584Z and finished at 17:47:29.009Z. Both exits were 0. Await both, discard the overlapping format as the final formatting check, and run a fresh standalone format after sync before starting the next complete gate; no gate was active during this overlap."
  ],
  "rejected": [
    {
      "option": "Count exit zero without confirming the intended case ran",
      "reason": "A filtered-out test does not establish its behavior."
    },
    {
      "option": "Treat setup errors or truncated inspection as product findings",
      "reason": "They establish an executor process error, not a failure of the product contract."
    }
  ],
  "reopenWhen": "Another invocation misses its intended assertions or an inspection exceeds its declared output budget.",
  "misread": "Oversized aggregate reads, filtered-out cases and incomplete fixture entry arguments were treated as adequate inspection or an intended probe before their output contract was checked.",
  "meant": "Only a complete bounded inspection and a run that reaches the intended behavioral assertion supply evidence; setup errors and zero selected cases do not.",
  "changed": "Retain full logs in scratch and emit selected summaries; use each fixture's declared owned-root entry contract and confirm matched case counts. Corrected the story link needle, retry call-count expectations and the nested-empty publication expectation. Each valid control now preserves imports and setup and reverts only the recorded behavior."
}
```

## WO-219-D005 — Release compatibility

```json
{
  "id": "WO-219-D005",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Classify the application release as minor. Bump kernel 0.6.0 to 0.7.0 for canonical serialized append returns, compiler 0.30.0 to 0.31.0 for the added declared JWT and URL-userinfo credential refusals, skeleton 0.66.0 to 0.67.0 for changed admission/notification behavior and role contracts, and console 0.4.6 to 0.4.7 for corrected actor projections. Unchanged components keep their versions. No external dependency is added or updated; exact workspace dependency pins follow the bumped components.",
  "evidence": [
    "packages/kernel/src/store.ts and its admitted nonfinite/undefined return comparison preserve log bytes and envelope admission; callers now receive replay-equivalent JSON values.",
    "packages/compiler/src/source-bundle.ts declares the added refused shapes.",
    "packages/skeleton/src/harness-host.ts preserves queued route observations while changing unsupported authorship and target helper admission; packages/skeleton/src/loadouts/contributor.ts records the role duties.",
    "scripts/refute-plan.mjs bounds multipage explicit continuation arguments to 2048 UTF-8 bytes; scripts/resume.mjs admits a retained post-close override record.",
    "package.json and package-lock.json retain the existing dependency set; only the four workspace versions and their exact internal dependency pins change."
  ],
  "rejected": [
    {
      "option": "Patch release for all changes",
      "reason": "The work order requires a minor when command, flag, schema or refusal behavior changes."
    },
    {
      "option": "Bump untouched components",
      "reason": "No source or compatibility change requires it."
    }
  ],
  "reopenWhen": "Integration observes a newer published application or component version, or verification finds a materially different compatibility impact."
}
```

## WO-219-D006

```json
{
  "id": "WO-219-D006",
  "date": "2026-10-23",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.94.0, the next minor above the observed release baseline v0.93.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.93.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-219-boarded-follow-ups-records-roles-and-the-harness.md"
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

## WO-219-D007 — Preserve append admission with canonical return values

```json
{
  "id": "WO-219-D007",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Choose canonical decoded append returns over a new JSON-only draft refusal. Both arms make live values equal replay, but strict admission rejects three of four representative previously serializable draft shapes. Preserve envelope validation and exact appended bytes; return the value that was actually persisted.",
  "evidence": [
    "docs/evidence/WO-219/compatibility-comparison.json: executed bounded comparison, canonical return admits 4/4 with replay equality; strict admission admits only ordinary JSON, 1/4.",
    "packages/kernel/test/store-history.test.ts: 533 stored streams and 25,019 events round-trip byte-identically.",
    "packages/kernel/test/ac2-replay-store.test.ts: canonical appended-return fixture and isolated reversion in repair-controls.json."
  ],
  "rejected": [
    {
      "option": "Strictly reject nonfinite/undefined nested values",
      "reason": "It introduces an admission break for serializable drafts without a replay benefit over canonical return."
    },
    {
      "option": "Keep returning the pre-serialization object",
      "reason": "Live values can differ from the event actually stored and replayed."
    }
  ],
  "reopenWhen": "A caller needs an explicitly typed strict JSON admission API or a supported stored stream fails byte-identical replay."
}
```

## WO-219-D008 — Keep the historical sweep mismatch separate from append proof

```json
{
  "id": "WO-219-D008",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Defer repair of the historical store-sweep test input binding. Its live canonical-demo output differs from the WO-105 pinned manifest identically at this order's base and changed source. Preserve the immutable manifest and use the passing actual stored-stream round-trip and canonical-return controls for this order's append claim; do not call the broader historical assertion green.",
  "evidence": [
    "corpus/harness/truncation-sweep.mjs: canonical-demo is regenerated with the current runScenario(demoTree()) while corpus/harness/wo105-store.test.mjs compares all sweeps to corpus/manifests/WO-105.json.",
    "docs/evidence/WO-219/compatibility-comparison.json: both arms return exit 1 with the same generated and expected demo digests; generator bytes, round-trip laws, deep/CRLF classification, classifier self-tests and all actual stored streams passed.",
    "scripts/test-runner.mjs: the historical WO-105 sweep is not a selected current product suite."
  ],
  "rejected": [
    {
      "option": "Rewrite the filed historical expected digest",
      "reason": "That would rewrite immutable evidence to match the current demo."
    },
    {
      "option": "Attribute the base-identical mismatch to canonical append returns",
      "reason": "The checked base output disproves that causal claim."
    }
  ],
  "followup": "Low priority: bind the historical WO-105 canonical-demo sweep to its filed input (or give the modern-runtime comparison an explicitly current manifest) in corpus/harness/truncation-sweep.mjs and corpus/harness/wo105-store.test.mjs. Preserve corpus/manifests/WO-105.json. Reproduce the same baseline/current digest mismatch and make the named sweep assertion compare the intended subject before treating it as current compatibility evidence.",
  "reopenWhen": "The historical sweep is promoted into a current gate or its intended input binding is repaired under a separately recorded bounded change."
}
```

## WO-219-D009 — Preserve useful rules and board measured cost

```json
{
  "id": "WO-219-D009",
  "date": "2026-10-23",
  "dispatch": "resume: next",
  "decision": "Preserve the authorized shared decision-ownership rules, reviewer input/defensive duties and verifier repair/output duties. Mint a new role oracle linked to the byte-exact WO-226 snapshot and its upstream history. Keep every cold-start ceiling unchanged and board measured overrun for optimization with equivalent usefulness; do not cut needed instructions, raise a ceiling, record an acceptance or ask the operator to decide a byte budget.",
  "evidence": [
    "docs/evidence/WO-219/cold-start.json: measured installed CLAUDE.md plus each role skill before/after.",
    "packages/skeleton/fixtures/wo219-role-baseline.json: contemporary default and economy opt-out roles, prior snapshot hashes.",
    "docs/product/07-execution-guide.md: Process budget retires the older four-KB ceiling-raise route.",
    "WO-219-D003 and rows3,36,38,40 supply the instruction authority."
  ],
  "measuredOverruns": [
    {
      "role": "executor",
      "bytes": 29484,
      "ceiling": 29246,
      "overrun": 238
    },
    {
      "role": "reviewer",
      "bytes": 29584,
      "ceiling": 28884,
      "overrun": 700
    }
  ],
  "rejected": [
    {
      "option": "Use the work order's older ceiling-raise wording",
      "reason": "The current standing product rule explicitly supersedes that historical route."
    },
    {
      "option": "Remove useful review or decision duties to fit the bytes",
      "reason": "Equivalent usefulness has not been demonstrated for a shorter form."
    }
  ],
  "followup": "Optimize the executor and reviewer cold-start text without losing the decision ownership, review inputs, defensive approach, repair authority or output duties. Use WO-219 cold-start.json measured bytes and unchanged budgets as the baseline; require equivalent usefulness and generated-role/opt-out oracle checks before adopting a reduction.",
  "reopenWhen": "A bounded comparison demonstrates a shorter equivalent instruction set, or another required rule changes the measured overrun."
}
```

## WO-219-D010

```json
{
  "id": "WO-219-D010",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Retain the current file-level authored-output witness. Decline the nomination of a new exact unchanged-byte/change-range review mechanism to planning, preserving the residual migration cost rather than classifying authored work orders as generated.",
  "evidence": [
    "docs/evidence/WO-126/decisions.md#wo-126-d005",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/legacy-cost.mjs"
  ],
  "rationale": "A substantive change to an authored file still owes delivery of its current file bytes; the residual read cost is real, while equivalence and stale-byte coverage for a range alternative have not been established.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Designing range provenance in this batch would choose a replacement contract without the comparison the source explicitly asks a later planning pass to make.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A planning comparison supplies exact unchanged-byte proof, current-source/substantive-edit refusal and measured context/command/wall-clock costs.",
  "resolution": {
    "followupId": "FUP-0132",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D011

```json
{
  "id": "WO-219-D011",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep diagnosis in the existing bounded envelope summary and the already implemented typed host-refusal detail. Decline the still-open choice between a richer finding field and a contract-bound repair note to planning; do not treat the later host-detail fix as settlement of that separate choice.",
  "evidence": [
    "docs/evidence/WO-056/decisions.md#wo-056-d008--operator-scope-expansion-repair-both-runtime-defects-in-this-order",
    "packages/compiler/src/verification.ts",
    "packages/skeleton/src/verification-protocol.ts",
    "packages/skeleton/test/verification.test.ts"
  ],
  "rationale": "The finding contract still carries observed/expected witnesses and no durable diagnosis field for repair. A bounded envelope summary is not the proposed richer finding or repair-note channel.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Adding an analysis field or forwarding model narrative without a chosen blinding/input contract would silently select the design the source reserved for comparison.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A bounded planning design chooses the channel and its consumers, preserves witness binding and blinding, and supplies a live refusal/repair reproduction.",
  "resolution": {
    "followupId": "FUP-06da3d34e379e3c1",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D012

```json
{
  "id": "WO-219-D012",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Prepare the verify briefing before appending VerificationRequested. Give reviewers the product 07 Read directive. For a passing review self-fix, retain the existing follow-up route and state in prose that the defect was fixed, rather than add a fourth route. Keep the briefing to the order and latest receipt; map citations remain explicit reads, and an empty issue list is printed as none. Retain unconditional byte advisories, whose current behavior no longer depends on advisoryDecision allocation. Preserve the existing sparse-copy exclusion and per-file size guidance.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d052--pass-the-integrated-subject-and-board-seven-low-findings",
    "scripts/resume.mjs",
    "scripts/lib/verification-briefing.mjs",
    "packages/skeleton/src/loadouts/contributor.ts",
    "scripts/docs-check.mjs",
    "docs/product/07-execution-guide.md",
    "scripts/test-verification-review.mjs: case verification briefing failure preserves phase and next report identity. Preflight resume; repair-controls.json control r03-verification-allocation: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "packages/skeleton/test/executor-supports.test.ts: case review roles carry their repair authority, defensive judgment and durable output duties. Preflight skeleton; repair-controls.json control r03-reviewer-input: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case latest malformed planning findings advise without resurrecting earlier issues and missing ids use the filename. Preflight resume; repair-controls.json control r03-explicit-empty-issues: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case latest malformed planning findings advise without resurrecting earlier issues and missing ids use the filename. Preflight resume; repair-controls.json control r31-malformed-latest-advisory: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "base-controls.json base-existing-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d.",
    "base-controls.json base-review-reader-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d.",
    "base-controls.json base-text-policy: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "The old row combines six independent seams. A partial reviewer-text fix would leave failure atomicity, route semantics, source coverage, obsolete byte-policy assumptions and sparse-copy safety unjudged.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "A fourth route, map-wide implicit briefing expansion or a new byte-ceiling policy adds process without evidence that the existing explicit routes/read declarations fail.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A real verify records before a failed briefing, an existing self-fix cannot be represented truthfully, a valid carry-in is lost under the declared source contract, or a repository copy again expands a sparse Beacon group.",
  "resolution": {
    "followupId": "FUP-1315c82ef74fb832",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "1. Failure atomicity: failed order/receipt reads append no VerificationRequested; record the negative and ordinary path.",
    "2. Reviewer reads definitions from Verification review and attack.",
    "3. Existing follow-up route plus explicit fixed resolution for passing self-fixes; no new route.",
    "4. Order + latest receipt only; explicit empty list versus unavailable; map citations separately read.",
    "5. Current unconditional byte advisory makes advisoryDecision binding/allocation obsolete; use the existing disposition-independent fixture.",
    "6. Product 07 sparse-copy/per-file bound already exists; prove current text rather than duplicate it."
  ]
}
```

## WO-219-D013

```json
{
  "id": "WO-219-D013",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Extend the existing reserved-state coupling tripwire to optional-chained reads through casts, preserving the positive legal-core case and the existing alias/computed/destructure refusals.",
  "evidence": [
    "docs/evidence/WO-142/decisions.md#wo-142-d015--board-up-the-optional-chaining-gap-in-the-kernel-coupling-tripwire-met-during-ver-002",
    "packages/kernel/test/ac2-replay-store.test.ts",
    "packages/kernel/src/core.ts",
    "packages/kernel/test/ac2-replay-store.test.ts: case application-state coupling detector catches optional nested state receivers. Preflight kernel; repair-controls.json control r04-optional-receivers: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "An optional-chained reserved policy read can evade the existing coupling tripwire even though equivalent ordinary forms are refused.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Changing kernel policy semantics or weakening the reserved-state set is unnecessary; this is a tripwire coverage repair.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Any new reserved-state spelling evades the tripwire or legal kernel state access is refused.",
  "resolution": {
    "followupId": "FUP-151541120435fd15",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D014

```json
{
  "id": "WO-219-D014",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Use selected effort readback for this execution and keep Ultracode mode distinct from effort. Leave the unresolved Claude mode representation/readback and any canonical correction of the historical VER-001 actor as an operator packet for the WO-219 pull request; preserve Codex ultra handling and filed reports.",
  "evidence": [
    "docs/evidence/WO-186/decisions.md#wo-186-d039--attest-the-selected-effort-ultracode-is-a-mode-beside-it",
    "scripts/resume.mjs",
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/evidence/WO-186/decisions.md"
  ],
  "rationale": "The generic legacy aliases can conflate a Claude mode with effort when no selected-effort readback is present. The source separately makes a historical recorded-attestation correction the operator's choice.",
  "consequences": "The safe NoOp in the matching packet is selected now. No response or approval is requested; reopen only on the recorded evidence or a later change of direction.",
  "rejected": [
    {
      "option": "Inventing a mode readback, rewriting a filed report or changing Codex's meaning would exceed the supplied evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "At review of the WO-219 pull request, the operator chooses the Claude representation/readback policy and whether an authorized canonical historical correction is due; a host-provided mode readback also reopens this packet.",
  "resolution": {
    "followupId": "FUP-16a4af39c710459b",
    "status": "deferred",
    "mode": "operator-packet"
  },
  "wholeAsk": []
}
```

## WO-219-D015

```json
{
  "id": "WO-219-D015",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "State equipped Tinkerer support in the actual dispatch/briefing receipt when equipped, retain opt-out behavior and preserve the current conditional comparison sentence. Do not invent a past operator decision to omit the support or count generic default installation as the old trial's missing briefing.",
  "evidence": [
    "docs/evidence/WO-099/decisions.md#wo-099-d008",
    "scripts/resume.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-retained-records.mjs: case a declared economy trial discloses its installed support without adding work to ordinary dispatches. Preflight resume; repair-controls.json control r06-experiment-equipment: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The source trial lacked an explicit support receipt despite selection; current default support text alone does not prove that dispatch delivery.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "A new universal experiment gate or a retroactive claim about WO-099's dispatch would add an unrequested behavior or falsify the historical record.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An equipped trial dispatch again omits its explicit support receipt, or opt-out/ordinary dispatch behavior changes.",
  "resolution": {
    "followupId": "FUP-2f0974e3d5d5063a",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D016

```json
{
  "id": "WO-219-D016",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Retain digest/byte-count/prefix/scope observations, latest-native-message route correlation, unknown routes when metadata is absent, and Codex dispatch-only observations. Keep the documented host-delivery and lexical-screen limits; no richer semantic or coverage guarantee is claimed.",
  "evidence": [
    "docs/evidence/WO-178/decisions.md#wo-178-d006--observation-coverage-and-bounded-paraphrases",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/plan-failures.mjs",
    "scripts/test-harness.mjs",
    "base-controls.json base-observation-policy: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d.",
    "base-controls.json base-local-observation-counts: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "Absent host metadata remains unknown and lexical matches remain candidates, not established operator speech. The existing policy deliberately avoids copying message/reason text.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Inferring semantic intent or complete mid-turn delivery from a prefix/correlation would claim facts the host did not observe.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Native host evidence supplies a reliable route field, a current operator-word record lacks required provenance, or a prompt/denial observation persists message text.",
  "resolution": {
    "followupId": "FUP-2f1b441dc2c37776",
    "status": "settled",
    "mode": "already-met"
  },
  "wholeAsk": []
}
```

## WO-219-D017

```json
{
  "id": "WO-219-D017",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "State in the existing destination-adapter paragraphs that a command word after an &> operand makes the invocation opaque, and that the applicable unquoted zsh equals word is an expansion. Preserve the literal discard and current refusal widths.",
  "evidence": [
    "docs/evidence/WO-168/decisions.md#wo-168-d015--repair-of-ver-001-f1-and-f2--followed-by-words-and-zshs--word",
    "docs/AI-HARNESS-SECURITY.md",
    "docs/product/07-execution-guide.md",
    "Document-only ask: docs/product/07-execution-guide.md \u00a7Discipline destination adapter and docs/AI-HARNESS-SECURITY.md live-gate/destination adapter now explain command words after &> and unquoted zsh equals expansion. Final document gate checks these changed statements."
  ],
  "rationale": "The code's conservative shell boundary is more specific than the standing prose.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Widening the shell classifier or refusing every ampersand redirect is unnecessary for this sentence-only row.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A supported shell gives a form declared literal a different command/expansion, or the standing sentence again differs from the shipped adapter.",
  "resolution": {
    "followupId": "FUP-33173b7f87004a9c",
    "status": "settled",
    "mode": "document-only"
  },
  "wholeAsk": []
}
```

## WO-219-D018

```json
{
  "id": "WO-219-D018",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Tolerate emphasized/code-formatted/parenthetical-worker self-review forms; preserve structured findings-block authority so prose quotes, recaps and examples do not become this report's findings. Keep the already implemented singular-label advisory, name a missing receipt identity, show passing integration/new-scope findings as counts rather than failure items, and align owned-agent paths with accepted worker-name digits.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d034--board-the-remaining-low-reader-advisory-and-planning-count-observations",
    "scripts/lib/handoff-ledger.mjs",
    "scripts/lib/review-findings.mjs",
    "scripts/lib/verification-briefing.mjs",
    "scripts/lib/plan-failures.mjs",
    "scripts/lib/harness.mjs",
    "scripts/test-retained-records.mjs: case self-review counts tolerate presentation wrappers without accepting quotations or incomplete counts. Preflight resume; repair-controls.json control r09-presentation-wrappers: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case self-review counts tolerate presentation wrappers without accepting quotations or incomplete counts. Preflight resume; repair-controls.json control r09-label-and-worker: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case latest malformed planning findings advise without resurrecting earlier issues and missing ids use the filename. Preflight resume; repair-controls.json control r09-receipt-filename: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case passing integration and new-scope review counts are not failure items. Preflight resume; repair-controls.json control r09-passing-counts: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case WO-039 installed bundle detects content, missing, unexpected and manifest drift and refuses unowned replacement. Preflight harness-fixtures; repair-controls.json control r09-numeric-owned-agent: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "base-controls.json base-review-reader-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "The original compound row contains presentation, reader and accepted-name mismatches; repairing just self-review tolerance would leave valid reported arms unresolved.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Returning to prose inference for structured finding counts or labelling every passing non-escape count a failure would contradict the later explicit findings contract.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A real supported self-review is falsely advised, quoted/example prose changes a block count, receipt identity is lost, a passing review becomes a failure item, or an accepted worker name cannot be installed.",
  "resolution": {
    "followupId": "FUP-3f9d788f4d8c89ac",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "Common self-review forms.",
    "Only the declared structured block counts. Old prose labels in quotes, repaired recaps, HTML comments and indented examples are ignored; a duplicate/example findings-marker block still deliberately invalidates measurement under the later explicit contract.",
    "Singular Known issue label and missing receiptId.",
    "Passing integration/new-scope counts displayed separately from failures.",
    "Worker-name/owned-path digit agreement."
  ]
}
```

## WO-219-D019

```json
{
  "id": "WO-219-D019",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Narrow bare comment labels to report contexts; validate relative links after every Release section rewrite; recognize only a validated terminal task-notification envelope when transcript attribution is unavailable; carry image identity into reference definitions so raw=true is preserved with query/fragment; allow exact shared/template scratch paths and add a shrink-only home-path baseline writer with stale-entry notices.",
  "evidence": [
    "docs/evidence/WO-188/decisions.md#wo-188-d048--final-review-five-low-findings-of-the-host-and-document-gate-review-worker-boarded",
    "scripts/lib/comment-labels.mjs",
    "scripts/release.mjs",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/github-body.mjs",
    "scripts/docs-check.mjs",
    "scripts/test-comment-labels.mjs: case ordinary short hardware, key, storage and paper tokens and hexadecimal colours are prose; contextual report labels still refuse. Preflight comment-labels-fixtures; repair-controls.json control b1-finding-tokens: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-comment-labels.mjs: case ordinary short hardware, key, storage and paper tokens and hexadecimal colours are prose; contextual report labels still refuse. Preflight comment-labels-fixtures; repair-controls.json control b1-colour-boundary: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release.sh: case edition: external reference images survive definition rewriting. Preflight release; repair-controls.json control b2-quoted-definition: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-preflush-completed: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-preflush-failed: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-preflush-stopped: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-preflush-killed: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-nonterminal: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-missing-id: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-outer-close: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-duplicate-status: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-metadata-pairs: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-summary-status: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-malformed-byte-bound: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-authorship-precedence: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case reference images rewrite their definition with raw bytes and retain exact written-destination spans. Preflight release-preparation; repair-controls.json control b4-reference-definition-image-flag: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case public Shared and explicit scratchpad templates contain no private account; concrete homes and session paths still refuse. Preflight docs-check-fixtures; repair-controls.json control b5-template-shared: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case public Shared and explicit scratchpad templates contain no private account; concrete homes and session paths still refuse. Preflight docs-check-fixtures; repair-controls.json control b5-template-scratchpad: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case public Shared and explicit scratchpad templates contain no private account; concrete homes and session paths still refuse. Preflight docs-check-fixtures; repair-controls.json control b5-traversal-boundary: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case public Shared and explicit scratchpad templates contain no private account; concrete homes and session paths still refuse. Preflight docs-check-fixtures; repair-controls.json control b5-runner-policy: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line. Preflight docs-check-fixtures; repair-controls.json control b5-stale-notice: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line. Preflight docs-check-fixtures; repair-controls.json control b5-writer-command: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line. Preflight docs-check-fixtures; repair-controls.json control b5-writer-no-growth: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line. Preflight docs-check-fixtures; repair-controls.json control b5-retained-fingerprint: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-docs-check.mjs: case home-path baseline maintenance reports stale entries, shrinks only existing fingerprints and refuses laundering a new line. Preflight docs-check-fixtures; repair-controls.json control b5-other-baseline-fields: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "base-controls.json base-nested-publication: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "Each of the five source reproductions describes a different incorrect classification or outward rendering. All five need their own controls before the row can be settled.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Blanket CI/home-path exemptions, message-text logging, explicit-operator attribution overrides or weakening typed/private-path refusals are rejected alternatives inside this whole-row decision.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A public ordinary token/template is falsely refused, a Release retains relative links, an operator prompt is relabelled as a notice, a reference image loses raw semantics, or shrinking the baseline loses a real historical private-path match.",
  "resolution": {
    "followupId": "FUP-4c4ad5ef3c88547f",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "B1 ordinary letter-number tokens and hexadecimal colours versus genuine report labels.",
    "B2 new Release refusal after rewrite covers the remaining quoted-definition relative link. Nested-empty forms are already normalized by the existing multi-pass normalizer; preserve them as successful absolute-link/no-relative-destination controls, not new refusal cases.",
    "B3 validated terminal notification fallback only when transcript attribution is unavailable; retain explicit operator and unknown enqueue handling.",
    "B4 reference-style image definitions retain raw=true without losing query/fragment or span proof.",
    "B5 exact generic template/shared paths, shrink-only baseline, stale-entry reporting and no blanket exemption for the fixture's concrete CI-account home prefix."
  ]
}
```

## WO-219-D020

```json
{
  "id": "WO-219-D020",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep exact goal-standard binding and independent immutable-subject judgment. Decline the new executor snapshot/local-subject-commit route to planning; this batch grants no blanket early-commit exception.",
  "evidence": [
    "docs/evidence/WO-090/decisions.md#wo-090-d006--operator-authorized-local-commits-refresh-the-planning-judgment",
    "scripts/lib/plan-direct.mjs",
    "scripts/lib/plan-continuation.mjs",
    "packages/skeleton/src/loadouts/contributor.ts"
  ],
  "rationale": "A future execution edit to the bound goal standard still meets the committed-subject versus no-early-commit conflict recorded by the source.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Weakening exact-text binding or silently granting local commits would hide the conflict rather than choose and prove a route.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A bounded planning design preserves independent judgment, committed/snapshot identity, stale-byte refusal and publication refusal, or another execution order must edit that section.",
  "resolution": {
    "followupId": "FUP-50a41e39f51a3e01",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D021

```json
{
  "id": "WO-219-D021",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Send the path-free RepairSnapshotPrepared event, revocation actor-ordering and reported implementer SourceChangeObserved behavior together to the bounded host-planning work the source nominates. Preserve the raw positional logs and do not publish sanitized hashed evidence.",
  "evidence": [
    "docs/evidence/WO-056/decisions.md#wo-056-d005--adversarial-pass-bind-facts-to-the-log-make-the-replay-guard-sensitive-always-file",
    "packages/skeleton/src/repair-host.ts",
    "packages/skeleton/src/reactor.ts",
    "packages/skeleton/test/repair.test.ts"
  ],
  "rationale": "The path-bearing event remains in source and revocation handling precedes the host actor filter. The SourceChangeObserved item was originally reported but not reproduced by its executor; it remains an attributed concern, not a new observed failure here.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Fixing one host arm and settling all three, or editing published event bytes, would silently narrow the row or break replay identity.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A planning order authorizes all three named host changes with actor, episode, path-free-log and replay controls, especially before nonempty revocation types are relied on.",
  "resolution": {
    "followupId": "FUP-5d191eb1b77b3431",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D022

```json
{
  "id": "WO-219-D022",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep literal redirects judged by the existing separate adapter and expansions opaque under host permissions. Decline a new expansion-spelled adapter to planning. Use the already recorded standing cold-start ceiling route when an actual reviewed rule requires bytes, rather than preserve the obsolete historical 46-byte figure as a current measurement.",
  "evidence": [
    "docs/evidence/WO-144/decisions.md#wo-144-d009--judge-a-literal-redirect-on-any-program-state-what-stays-unjudged",
    "packages/skeleton/src/harness-command.ts",
    "scripts/test-harness.mjs",
    "docs/control/budgets.json"
  ],
  "rationale": "Expansion-spelled destinations remain unobserved, so the historical incident-class language must not be generalized into a present enforcement guarantee. The old ceiling observation is dated, not a current budget result.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Resolving shell expansions without a chosen shell-state model or treating a historical ceiling value as current would replace evidence with an assumption.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An expansion adapter is explicitly chosen and proved, a literal known outside write is admitted, a legitimate granted write is refused, or a current reviewed rule exceeds its measured cold-start ceiling.",
  "resolution": {
    "followupId": "FUP-6004455b998fa646",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D023

```json
{
  "id": "WO-219-D023",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Retain off-root outside-write judgment and explicit stand-down journal rows for the other four refusals. Decline choosing broader writer/live-gate/planning/subagent behavior until the shared-root planning item defines its state and relative-path semantics.",
  "evidence": [
    "docs/evidence/WO-144/decisions.md#wo-144-d008--judge-outside-writes-from-any-working-directory-keep-hook-rows-in-the-hooks-own-project",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-harness.mjs"
  ],
  "rationale": "The other four refusals still stand down away from the verified worktree root, now observably; journaling is not enforcement.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Silently broadening shared state/Git interpretation or claiming the repaired outside-write fixture proves all four other refusals would exceed the evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A planning design chooses off-root behavior and supplies descendant/outside-root, role-inheritance and relative-destination controls, or a required denial is admitted without a journal row.",
  "resolution": {
    "followupId": "FUP-64a7f9adb355d94e",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D024

```json
{
  "id": "WO-219-D024",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Choose NoOp on the strict block reader: an invalid id, route or one-line summary leaves the whole count unmeasured with its named advisory; it never means zero escapes. Keep the result-time advisory and add no standing read-only pre-record check now. Judge this against the actual ten-order receipt window and preserve both malformed-field examples as named limits.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d045--fix-nine-self-review-findings-record-three-and-board-the-strict-validation-choice",
    "scripts/lib/review-findings.mjs",
    "scripts/lib/plan-failures.mjs",
    "scripts/test-verification-review.mjs",
    "base-controls.json strict-counts-decision: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d.",
    "The base audit found 43 reviews since D045 with no recorded unmeasured review; the recent10-order window has13 attempts, all13 measured. Invalid route and summary examples still leave the whole count unmeasured, so this is a bounded NoOp, not a claim that malformed blocks cannot matter."
  ],
  "rationale": "The malformed-field examples can suppress the aggregate and defer a classless advisory, but the current recorded ten-order window has complete stored counts for every attempt. No field-format loss is established in that window. A future such real occurrence remains the reopening observation.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Counting a malformed block while merely advising would change the explicit measurement contract; adding another mandatory reviewer step without a real occurrence adds recurring cost. Neither alternative is selected now.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A real final review is unmeasured because of id/route/summary despite enumerable entries, especially when that masks a classless blocking finding, or a fresh ten-order window demonstrates that pre-record reading would prevent repeated loss.",
  "resolution": {
    "followupId": "FUP-67a07b670440cf5a",
    "status": "settled",
    "mode": "evidenced-no-op"
  },
  "wholeAsk": [
    "Keep strict invalid-field behavior.",
    "Choose no extra pre-record read step on the recorded real-review window; do not claim the malformed examples are harmless in every future review."
  ]
}
```

## WO-219-D025

```json
{
  "id": "WO-219-D025",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Use the already implemented Codex writer PATH/toolchain grants and bare named-test command. This is prior concrete fulfillment of the requested route, with no new writer design, no absolute private path in a capsule and no rewritten hashed log.",
  "evidence": [
    "docs/evidence/WO-056/decisions.md#wo-056-d002--keep-the-capsule-public-safe-by-construction-never-edit-hashed-bytes",
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/test/writer.test.ts",
    "base-controls.json base-existing-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "The source's original absent-PATH failure is historical; current canonical writer arguments now supply the host Node directory and a fixture uses a bare node command. Root must prove that exact existing route before settlement.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Re-designing the nominated transport or substituting placeholders into capsule-bound commands/logs would add scope or invalidate replay.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A supported writer can no longer resolve its declared bare named test, a required grant becomes unreasonably broad, or a capsule/log exposes private physical command paths.",
  "resolution": {
    "followupId": "FUP-71a27b368d93f135",
    "status": "settled",
    "mode": "already-met"
  },
  "wholeAsk": []
}
```

## WO-219-D026

```json
{
  "id": "WO-219-D026",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Choose canonical decoded return values for append so live consumers receive the same JSON values as replay. Preserve assigned-envelope validation and acceptance of supported JSON payloads; replay every stored-log fixture identically before settling this row.",
  "evidence": [
    "docs/evidence/WO-142/decisions.md#wo-142-d005--defer-the-pre-existing-append-serialization-divergence",
    "packages/kernel/src/store.ts",
    "packages/kernel/test/ac2-replay-store.test.ts",
    "packages/kernel/test/ac2-replay-store.test.ts: case store append returns exactly the event its serialized log replays. Preflight kernel; repair-controls.json control r17-canonical-appended-return: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "WO-219-D007 and compatibility-comparison.json: canonical-return versus stricter-admission comparison and 533 stored streams / 25,019 events byte-identical.",
    "WO-219-D008 records the identical baseline/current historical dynamic-demo mismatch separately; it is not claimed as passing replay evidence."
  ],
  "rationale": "The source reproduction admits nested nonfinite values that serialize differently, so returning the pre-serialization object can diverge from the stored/replayed event.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "A broader new payload-admission refusal is the unchosen alternative; rejecting more values would change the input contract beyond the selected return-value repair.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Any supported payload produces different live/stored/replayed values or any existing stored-log decision/projection differs.",
  "resolution": {
    "followupId": "FUP-75563edf56be23b5",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D027

```json
{
  "id": "WO-219-D027",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Decline the nomination of a broader shared-root-cwd enforcement order to planning. Retain the later repair's journaled stand-down and generated-hook subdirectory coverage; those minimum observations do not answer whether all four older refusals should enforce off-root.",
  "evidence": [
    "docs/evidence/WO-144/decisions.md#wo-144-d007--fail-final-review-on-a-live-admitted-outside-write-board-the-shared-root-cwd-precondition",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-harness.mjs"
  ],
  "rationale": "The shared-root precondition still limits the four older refusals. Its silent-journal part was repaired, but its wider policy question remains open.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Settling the complete nomination from an outside-write/journaling fixture would drop the still-deliberate four-refusal choice.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A planning order chooses and proves broader off-root state/Git/path behavior, or any generated hook again silently admits a call that root evaluation would refuse.",
  "resolution": {
    "followupId": "FUP-76e02136ac324240",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D028

```json
{
  "id": "WO-219-D028",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Retain the existing conditional prompt support and its declared prompt-only cost. Decline the proposed phase rewrite/evidence requirement/extra-episode redesign and ten-order outcome policy to planning; do not claim that prompt presence proves linked phase modification.",
  "evidence": [
    "docs/evidence/WO-188/decisions.md#wo-188-d001--note-for-planning-the-tinkerer-support-does-not-modify-the-phase-it-is-linked-to",
    "packages/skeleton/src/loadouts/prompt-support.ts",
    "packages/skeleton/src/loadouts/executor-supports.ts",
    "packages/skeleton/src/loadouts/contributor.ts"
  ],
  "rationale": "Tinkerer still uses empty semanticsModified/evidence requirements and no extra episode, unlike the proposed typed modifier. Its actual comparison frequency is a separate measured outcome.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Inventing a mandatory second arm, gate, module trigger or universal comparison duty here would choose a product/compiler policy merely to turn the row into a fix.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Planning chooses one bounded modifier with declared cost and a prospective comparison measure, or the recorded trigger/outcome condition makes the current prompt-only form unacceptable.",
  "resolution": {
    "followupId": "FUP-7c909f0880237fba",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D029

```json
{
  "id": "WO-219-D029",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Persist a hash-only cache for failed uses with no classified diagnostic, bound to input and actual classifier bytes. Independently inventory dead nonce-owned shell claims/preparations for pruning, rechecking the same owner before removal. Keep live, replaced, malformed or unowned claims when liveness cannot be established.",
  "evidence": [
    "docs/evidence/WO-178/decisions.md#wo-178-d005--carry-in-remedies-and-retained-limits",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/harness-prune.mjs",
    "scripts/test-harness.mjs",
    "scripts/test-harness.mjs: case generated observer caches empty failed-use classifications without diagnostic rows and invalidates changed inputs or classifier. Preflight harness-fixtures; repair-controls.json control r20-negative-cache-hit: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case prune independently retires dead shell claims and preparations while preserving live and unknown owners. Preflight harness-fixtures; repair-controls.json control r20-independent-prune: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Without negative caching an unclassified failure can be repeatedly scanned; contention recovery alone does not independently clean interrupted preparations.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Caching without input/classifier identity, removing a live replacement, or declaring unsupported shell forms understood would trade cost for lost guidance or unsafe deletion.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A repeated unclassified failure is needlessly reclassified, a stale claim blocks delivery, classifier changes fail to invalidate cache, or pruning removes a live/replaced/unknown owner.",
  "resolution": {
    "followupId": "FUP-7fd69f3bda6fa326",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "Durable empty-result cache.",
    "Independent dead nonce-owned claim/preparation cleanup.",
    "Retain ANSI-C escaped quotes, coproc and minus precommand limits; no full-shell-parser claim."
  ]
}
```

## WO-219-D030

```json
{
  "id": "WO-219-D030",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Adopt the already chosen WO-112-D023 re-binding route: a later amendment of the same order/decision carries its current decision hash, earlier receipt/source-order bindings remain checked, and an edit without re-binding still refuses. No historical control row is removed.",
  "evidence": [
    "docs/evidence/WO-162/decisions.md#wo-162-d016",
    "docs/evidence/WO-112/decisions.md#wo-112-d023--a-decision-corrected-in-place-is-re-bound-not-frozen-by-the-planning-gate",
    "scripts/lib/plan-receipts.mjs",
    "scripts/test-plan-refutation.mjs",
    "base-controls.json base-existing-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "The older source describes a permanent changed-decision conflict, but the later explicit repair now supplies canonical supersession by re-binding.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Deleting stale history or dropping all earlier order amendments would lose evidence; requiring the rejected withdrawal alternative as well would ignore the later chosen route.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "The gate admits an unbound edit, a same-decision re-bind remains stuck, or earlier receipt/source checks are skipped.",
  "resolution": {
    "followupId": "FUP-9625ca888d7d08f5",
    "status": "settled",
    "mode": "already-met"
  },
  "wholeAsk": []
}
```

## WO-219-D031

```json
{
  "id": "WO-219-D031",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep selected effort readback and unchanged historical normalization while the WO-219 pull request carries an operator packet for the Claude mode representation and its interaction with the worker protocol. Record the old spaced-spelling mismatch as unlocated; do not invent a current failed matcher or effective readback.",
  "evidence": [
    "docs/evidence/WO-172/decisions.md#wo-172-d014--release-v0541-and-the-attestation-with-ultracode-independent-of-effort",
    "scripts/resume.mjs",
    "packages/skeleton/src/worker-protocol.ts",
    "docs/evidence/WO-172/decisions.md"
  ],
  "rationale": "Claude mode and legacy effort aliases can describe different facts. The historical spaced-trigger report supplies no current reproducible failing location.",
  "consequences": "The safe NoOp in the matching packet is selected now. No response or approval is requested; reopen only on the recorded evidence or a later change of direction.",
  "rejected": [
    {
      "option": "Changing historical semantics or asserting a cause for an unlocated failure would exceed the evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Review of the WO-219 pull request chooses the cross-harness record policy, a host exposes a mode readback, or an actual spaced-spelling mismatch is captured at a named matcher.",
  "resolution": {
    "followupId": "FUP-a6cf30a8b7bc4a83",
    "status": "deferred",
    "mode": "operator-packet"
  },
  "wholeAsk": []
}
```

## WO-219-D032

```json
{
  "id": "WO-219-D032",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep complete stored events and per-decision serialization comparison. Decline coalescing recorded heartbeats or replacing embedded capsule values with references to planning; do not re-record a short episode or weaken equality to fit a helper.",
  "evidence": [
    "docs/evidence/WO-140/decisions.md#wo-140-d008--repair-the-stored-stream-test-that-a-long-live-verifier-episode-pushed-past-the-engines-string-limit",
    "packages/skeleton/src/reactor.ts",
    "packages/skeleton/test/scenario.test.ts"
  ],
  "rationale": "Repeated full capsules retain a serialization/time cost. The helper avoids one engine-sized string but does not remove that repeated work.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Changing replayed decision shape or the recorded live stream to optimize one consumer would change a runtime/evidence contract without the selected design and historical equivalence evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A stored stream again fails or dominates the suite, or a bounded design proves lower cost with identical replay and immutable evidence.",
  "resolution": {
    "followupId": "FUP-a91115fda9b70272",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D033

```json
{
  "id": "WO-219-D033",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Apply the same four correctable actor fields to usage/meta/console read projections before per-order filtering of full segments. Preserve raw event bytes and correction-recorder actors, chain correction ordinals, and clear replaced effort raw/mode metadata. Expose correction evidence in the console and actual actor attribution in meta phases.",
  "evidence": [
    "docs/evidence/WO-158/decisions.md#wo-158-d008",
    "scripts/lib/control-actor.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/control-usage.mjs",
    "scripts/lib/meta.mjs",
    "packages/console/src/actors.ts",
    "scripts/test-process-debt.mjs: case WO-219 corrected completion actors agree in usage and meta without rewriting history. Preflight process-debt; repair-controls.json control row24-usage-consumes-raw-actors: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-process-debt.mjs: case WO-219 corrected completion actors agree in usage and meta without rewriting history. Preflight process-debt; repair-controls.json control row24-meta-consumes-raw-actors: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "packages/console/test/board.test.ts: case WO-219 console projects chained actor corrections with segment evidence and keeps raw events. Preflight console; repair-controls.json control row24-console-consumes-raw-actors: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-process-debt.mjs: case WO-219 corrected completion actors agree in usage and meta without rewriting history. Preflight process-debt; repair-controls.json control row24-effort-keeps-obsolete-mode: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Previously usage, meta and console consumed completion actors from raw events while status folded corrected values, producing inconsistent attribution.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Rewriting stored events, treating a correction recorder as the original completion actor, or using filtered-array positions as legacy segment ordinals would corrupt history or attribution.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A projection disagrees with a valid correction chain, a correction crosses an activation/order, raw history mutates, or a console field loses its correction evidence.",
  "resolution": {
    "followupId": "FUP-acfe4bfda716d8fb",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D034

```json
{
  "id": "WO-219-D034",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Add a declared JWT credential matcher and URL-reader-owned userinfo-password refusal independent of allowed host. Promote the two old limits into refusal fixtures, update affected consumers/kinds and product 03, and retain incomplete/ordinary-value controls.",
  "evidence": [
    "docs/evidence/WO-060/decisions.md#wo-060-d004--the-screens-declared-set-each-pattern-from-its-public-source",
    "packages/compiler/src/source-bundle.ts",
    "packages/compiler/test/source-bundle.test.ts",
    "docs/product/03-architecture.md",
    "packages/compiler/test/source-bundle.test.ts: case compact JWT shape screens signed and unsecured segments while leaving incomplete forms outside its declared set. Preflight compiler; repair-controls.json control r25-jwt-match: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "packages/compiler/test/source-bundle.test.ts: case URL userinfo passwords refuse independently of the host, with only credential byte spans. Preflight compiler; repair-controls.json control r25-userinfo-match: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The previous declared set deliberately admitted these two concrete credential forms; their new refusal must be explicit and versioned, not an undocumented entropy heuristic.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "An entropy screen, host-allowlist bypass for passwords, regex-only URL userinfo parsing or a missing recorded refusal kind would weaken the chosen declared-shape contract.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A declared shape is missed, a legitimate incomplete/ordinary value is refused, or a consumer persists refused text instead of its location-only outcome.",
  "resolution": {
    "followupId": "FUP-afc1bd32fa034417",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D035

```json
{
  "id": "WO-219-D035",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Preserve the reader and both historical batteries. Carry the acceptance/structured-field choice as an operator packet in the WO-219 pull request; the 70-of-80 held-out agreement stays below the stated 95-in-100 bound and is not relabelled as a successful validation.",
  "evidence": [
    "docs/evidence/WO-172/decisions.md#wo-172-d006--the-direction-reader-judged-against-a-hand-classification-filed-first",
    "scripts/lib/meta.mjs",
    "docs/evidence/WO-172/direction-agreement.json",
    "docs/evidence/WO-172/reader-battery-2.json"
  ],
  "rationale": "The held-out result did not meet the source's generalization target. Existing development cases cannot establish a new accuracy figure.",
  "consequences": "The safe NoOp in the matching packet is selected now. No response or approval is requested; reopen only on the recorded evidence or a later change of direction.",
  "rejected": [
    {
      "option": "Tuning on the held-out misses or silently lowering the acceptance figure would destroy the only held-out observation or change the standard without a recorded decision.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "At review of the WO-219 pull request the operator decides whether the count remains an advisory estimate under its stated limit or a structured field returns; any later new measure uses a fresh battery.",
  "resolution": {
    "followupId": "FUP-b3454d6ce3594ef3",
    "status": "deferred",
    "mode": "operator-packet"
  },
  "wholeAsk": []
}
```

## WO-219-D036

```json
{
  "id": "WO-219-D036",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Choose NoOp on acceptance semantics and decline contract unification until a real handoff-to-mission transfer is introduced or an accepted value is refused late. Keep the C1/Unicode-separator mismatch explicit.",
  "evidence": [
    "docs/evidence/WO-162/decisions.md#wo-162-d006",
    "packages/skeleton/src/handoff-contract.ts",
    "packages/skeleton/src/mission-check-protocol.ts",
    "docs/evidence/WO-162/decisions.md"
  ],
  "rationale": "The validators accept different control/separator classes, but the source demonstrated an interface mismatch without a production transfer or late production refusal.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Changing both interfaces solely to eliminate a synthetic mismatch would add an unchosen acceptance restriction or expansion.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An order introduces that text transfer or a real accepted handoff value is refused by its mission consumer.",
  "resolution": {
    "followupId": "FUP-b789b81160c008ea",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D037

```json
{
  "id": "WO-219-D037",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Send by-reference receipt subjects and hydration-cost judgment to the separate patch order the source explicitly nominates. Keep historical self-contained receipts and their hashes byte-identical.",
  "evidence": [
    "docs/evidence/WO-154/decisions.md#wo-154-d003--the-receipt-subject-group-becomes-its-own-patch-order",
    "scripts/lib/plan-receipts.mjs",
    "scripts/lib/plan-subject.mjs",
    "docs/planning/refutations/README.md"
  ],
  "rationale": "Receipts still carry subjects by value and rebuilding/hydrating consumers has a separate performance and schema tradeoff.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Changing receipt shape here or asserting storage savings without hydration/cost evidence would select a different schema and workload without its nominated comparison.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Planning chooses a bounded receipt representation with unchanged historical bytes and subject hashes, including the interacting subject-build cost, or receipts overtake the named storage share.",
  "resolution": {
    "followupId": "FUP-beb13d8d099d2917",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D038

```json
{
  "id": "WO-219-D038",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Refuse an explicit shell-quoted continuation payload over 2048 UTF-8 bytes when another page is actually required, naming that input limit. Preserve touchingFollowups matching/status semantics, one-page requests, smaller cursor revision binding and the no-argument changed-file query.",
  "evidence": [
    "docs/evidence/WO-169/decisions.md#wo-169-d012--board-a-large-touching-querys-page-limit",
    "scripts/refute-plan.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-process-debt.mjs: case large explicit touching continuations name their input limit while smaller pages and changed-file queries keep their bindings. Preflight process-debt; repair-controls.json control r29-cli-input-policy: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Even with bounded result metadata, a required continuation repeats its explicit shell-quoted query terms and can outgrow a bounded command/page representation. The historical 500-identifier output is not asserted to be the current reproduction; use the new fixture against current CLI source.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Changing status sets or the matcher to hide the row, or rejecting a large one-page request that needs no continuation, would exceed this bounded input-size repair.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A supported default query reaches the bound, a smaller cursor loses its revision/query binding, or an oversized continuation receives an inaccurate row-size diagnosis.",
  "resolution": {
    "followupId": "FUP-c5438ef80c397cf0",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D039

```json
{
  "id": "WO-219-D039",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "For relocation proof only, restore the already hash-authorized story section to its judged bytes. Then apply the unchanged complete-file citation relocation proof to every other byte. Preserve current amendment, criterion and accepted-story binding and historic receipt bytes.",
  "evidence": [
    "docs/evidence/WO-118/decisions.md#wo-118-d020--final-review-follow-up-an-authorized-story-writeback-does-not-compose-with-a-vision-citation-relocation",
    "scripts/lib/plan-continuation.mjs",
    "scripts/test-plan-refutation.mjs",
    "scripts/test-plan-refutation.mjs: case execution writeback admits only exact authorized story bytes with an unchanged reviewed criterion (goal review: false); execution writeback admits only exact authorized story bytes with an unchanged reviewed criterion (goal review: true). Preflight plan-refutation; repair-controls.json control row30-do-not-restore-authorized-story: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "A valid separately committed story writeback, especially one adding a link, previously invalidated an otherwise admitted later citation relocation.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Weakening complete proof, normalizing arbitrary vision changes or trusting a dropped/stale amendment would admit unreviewed content.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A valid committed writeback plus relocation refuses, an unauthorized neighboring change passes, or any historical receipt byte/hash changes.",
  "resolution": {
    "followupId": "FUP-c8ec65f056105759",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D040

```json
{
  "id": "WO-219-D040",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Advise when a newer matching receipt has missing/non-array findings, without treating malformed evidence as an explicit empty list or presenting stale issues as current. Preserve explicit-empty clearing and canonical filing validation. Retain current unconditional byte advisories across follow-up dispositions, so allocation neither grants an exemption nor restores a hard ceiling failure.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d047--judge-the-fresh-adversary-against-the-filed-receipt-contract-and-board-two-design-follow-ups",
    "scripts/lib/verification-briefing.mjs",
    "scripts/docs-check.mjs",
    "scripts/test-verification-review.mjs",
    "scripts/test-docs-check.mjs",
    "scripts/test-retained-records.mjs: case latest malformed planning findings advise without resurrecting earlier issues and missing ids use the filename. Preflight resume; repair-controls.json control r31-malformed-latest-advisory: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "base-controls.json base-existing-fulfillment: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d."
  ],
  "rationale": "Malformed manual records can hide an issue before a later planning check; the old allocation-to-hard-failure byte-policy reproduction no longer describes unconditional advice.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Silently reusing stale findings, accepting malformed canonical filing, changing follow-up closed/pending sets or raising a ceiling is unnecessary and unchosen.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A valid receipt loses issues, a corrupt one reaches briefing without an advisory, explicit clearing regresses, or allocating an unfinished optimization unexpectedly changes advisory enforcement.",
  "resolution": {
    "followupId": "FUP-c95ffe4a84e49cbb",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D041

```json
{
  "id": "WO-219-D041",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Require the event at the subject ordinal to be a passing FinalReviewCompleted before the fold accepts a productGate correction, and refuse a second binding of the same review. Preserve the complete passing gate/identity checks and committed-history consumers.",
  "evidence": [
    "docs/evidence/WO-115/decisions.md#wo-115-d026--repair-the-gate-identity-and-bind-a-product-gate-by-correction-at-the-operators-direction",
    "scripts/lib/control.mjs",
    "scripts/test-off-ramps.mjs",
    "scripts/test-retained-records.mjs: case a product gate correction binds only the actual passing final review once. Preflight resume; repair-controls.json control r32-actual-passing-subject: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-retained-records.mjs: case a product gate correction binds only the actual passing final review once. Preflight resume; repair-controls.json control r32-single-binding: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The old fold checked the declared subject type while a hand-appended event could point at an activation or failed review; the CLI/publication filters alone did not harden the fold.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Trusting a declared type, accepting a second replacement binding or bypassing checkpoint identity would attach reviewed authority to the wrong subject.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A non-passing actual subject or second binding folds, or a legitimate once-only current-identity binding is refused.",
  "resolution": {
    "followupId": "FUP-ca628adcc713c0b8",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D042

```json
{
  "id": "WO-219-D042",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "An enqueue match without a recorded command mode is unattributed, retaining its witnessed mid-turn route and digest. Preserve marked host notifications and explicit operator transcript attribution.",
  "evidence": [
    "docs/evidence/WO-188/decisions.md#wo-188-d009--item-7-a-host-task-notification-is-journaled-with-its-own-source-and-is-not-an-operator-message",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-harness.mjs",
    "scripts/test-harness.mjs: case terminal task notifications before transcript flush are host observations; malformed envelopes and explicit operator copies retain their attribution. Preflight harness-fixtures; repair-controls.json control b3-enqueue-unknown-authorship: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The old queued(undefined) default called an unmarked enqueue the operator even though that shape did not establish authorship.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Matching task-like words alone or declaring every unmarked native user message unattributed would lose stronger existing metadata.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A host notice counts as an operator intervention or an explicit operator transcript row is relabelled a notification.",
  "resolution": {
    "followupId": "FUP-d4493f4251e69c87",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D043

```json
{
  "id": "WO-219-D043",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Preserve historical receipt hashing and the current canonical prompt. Decline choosing how to expose or inventory omitted footer/introduction dependencies until a bounded planning design chooses its representation and affected-source review duty.",
  "evidence": [
    "docs/evidence/WO-087/decisions.md#wo-087-d011",
    "scripts/lib/plan-subject.mjs",
    "scripts/lib/plan-direct.mjs",
    "packages/skeleton/src/plan-refutation-protocol.ts"
  ],
  "rationale": "Full exclusions and historical capability source constraints extend beyond the worker's current bullet/id-level projection. Existing relocation checks do not establish worker visibility.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Changing prompt inputs or historical subject hashes merely to close the row would alter the independent judgment boundary without the selected representation.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Another continuation dependency is hidden from its reviewer, a relocation order needs affected-source review, or planning chooses and tests a bounded dependency inventory.",
  "resolution": {
    "followupId": "FUP-dc58e92c5cafc732",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D044

```json
{
  "id": "WO-219-D044",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Record carried retained-copy digests in ordinary snapshots when the selected usage represents them. Extend the existing explicit meta --write route so a linked checkout refreshes a closed order from registered main's retained copies plus that order's current main usage. Preserve original metrics/cutoff/revision/source, update usage provenance separately, leave mixed/torn copies uncarried and refuse a missing previously carried copy. The refreshed snapshot is reviewed/committed in that worktree before normal integration; the helper writes neither main nor a commit and deletes no retained material.",
  "evidence": [
    "docs/evidence/WO-171/decisions.md#wo-171-d004--a-lane-holding-a-usage-copy-waits-for-a-committed-snapshot-that-carries-it",
    "scripts/lib/meta.mjs",
    "scripts/meta.mjs",
    "scripts/lib/harness-prune.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-process-debt.mjs: case WO-219 normal snapshots digest only retained copies represented in their usage. Preflight process-debt; repair-controls.json control row35-normal-snapshot-omits-carried-proofs: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-process-debt.mjs: case WO-219 a linked worktree refreshes closed usage after late rows without writing main or losing historical metrics. Preflight process-debt; repair-controls.json control row35-refresh-drops-current-main-usage: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-process-debt.mjs: case WO-219 a linked worktree refreshes closed usage after late rows without writing main or losing historical metrics. Preflight process-debt; repair-controls.json control row35-closed-refresh-refused: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "An earlier snapshot can miss verification/review/release-close usage, and digest-only additions before the last row cannot release the retained lane honestly.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "An automatic completion write to clean main, a timestamp/existence-only release rule, loss of original metrics or a digest on unreadable/mixed bytes would weaken preservation.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Any later usage observation arrives after the recorded refresh, a current digest no longer matches the retained copy, a prior carried copy is absent, or refresh drops historical metrics/provenance.",
  "resolution": {
    "followupId": "FUP-dc6c139003bd4b89",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D045

```json
{
  "id": "WO-219-D045",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "State in verifier role text and product 07 that a design-level defect within the order's criteria/declared surfaces is blocking and receives a repair rule without another operator authorization. Reserve operator routing for choices outside that authority.",
  "evidence": [
    "docs/evidence/WO-187/decisions.md#wo-187-d042--ver-004-verifier-process-failures",
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/product/07-execution-guide.md",
    "packages/skeleton/test/executor-supports.test.ts: case review roles carry their repair authority, defensive judgment and durable output duties. Preflight skeleton; repair-controls.json control r36-repair-authority: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The original verifier shifted an already authorized repair rule to the operator and narrowed in-surface obligations.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "A new waiver/approval step for an in-scope repair contradicts the existing routes.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A verifier again asks the operator to authorize an in-surface repair rule or silently narrows it after a process complaint.",
  "resolution": {
    "followupId": "FUP-e835d826e9af5417",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D046

```json
{
  "id": "WO-219-D046",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Apply WO-163-D021: the operator half of D020 was void and the original hash-matched waiver stands; do not ask again. Decline the remaining Codex helper-ancestry enforcement design to planning, preserving the current journal/live-reservation guard and operator-capture requirement.",
  "evidence": [
    "docs/evidence/WO-163/decisions.md#wo-163-d020--the-criterion-4-waiver-stands-its-recorder-was-the-executor-sessions-helper",
    "docs/evidence/WO-163/decisions.md#wo-163-d021--correction-the-final-reviewer-asked-the-operator-to-confirm-a-waiver-they-had-already-given",
    "scripts/lib/off-ramps.mjs"
  ],
  "rationale": "Once the parent reservation was released, current host observations did not identify the executor helper. That is a known role-text enforcement limit, not absence of the existing waiver's authority.",
  "consequences": "No implementation change is selected for this row; the named limitation and reopening owner remain explicit.",
  "rejected": [
    {
      "option": "Reconfirming the waiver, recording a duplicate waiver or inventing ancestry from unrelated actors would repeat the recorded error or assert missing host evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A descendant records an off-ramp without an authorizing capture, the operator disputes an actual distinct route, or reliable descendant identity supports a bounded enforcement design.",
  "resolution": {
    "followupId": "FUP-e96e0676a5c34f98",
    "status": "declined",
    "mode": "decline-to-planning"
  },
  "wholeAsk": []
}
```

## WO-219-D047

```json
{
  "id": "WO-219-D047",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Add the recorded-rule/defensive-repair instruction to reviewer and verifier roles, and require changing approach after the first refusal while preserving the existing second-consecutive-refusal stop and durable record rule.",
  "evidence": [
    "docs/evidence/WO-184/decisions.md#wo-184-d040--hard-error-the-first-final-review-session-looped-on-refusals-and-forced-a-restart",
    "packages/skeleton/src/loadouts/contributor.ts",
    "packages/skeleton/test/executor-supports.test.ts: case review roles carry their repair authority, defensive judgment and durable output duties. Preflight skeleton; repair-controls.json control r38-defensive-review: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Repeating a refused analysis path and working out circumvention delayed the original review and shifted recovery to the operator.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Retrying the same refused path or treating a confinement finding as requiring circumvention research is unnecessary to judge a recorded rule.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A reviewer/verifier repeats a refused line or fails to record the stop/disposition.",
  "resolution": {
    "followupId": "FUP-ebaa803e38670545",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D048

```json
{
  "id": "WO-219-D048",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Update the matching standing sentences in products 02/03/07 and the security document for Codex writer reservation, remaining role-text duties, live-gate Git conditions and printed scratch/default grants. The obsolete README sentence is absent at the base, so that part is an evidenced no-op; the separate README release label is ordinary preparation.",
  "evidence": [
    "docs/evidence/WO-168/decisions.md#wo-168-d009--item-7-the-standing-sentences",
    "docs/product/02-domain-model.md",
    "docs/product/03-architecture.md",
    "docs/product/07-execution-guide.md",
    "README.md",
    "docs/AI-HARNESS-SECURITY.md",
    "base-controls.json base-text-policy: exact recorded base command and output, exit0 at c670e6288ecb221ef2416cef06f920006866bc5d.",
    "Document-only ask: product02 \u00a7Feedback, product07 \u00a7Discipline, product03 \u00a7Platform and instance boundary and docs/AI-HARNESS-SECURITY.md retain the original sections and correct the standing sentences in place. base-text-policy proves the old README sentence is absent. Final document gate checks the current files."
  ],
  "rationale": "Standing prose retained older incomplete descriptions after the shipped writer and scratch behavior changed.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Adding enforcement or new grants while correcting descriptive text would exceed this sentence-only row.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A named standing sentence again directs behavior inconsistent with the implementation or a current cold-start verdict changes.",
  "resolution": {
    "followupId": "FUP-fd05316b6030ef73",
    "status": "settled",
    "mode": "document-only"
  },
  "wholeAsk": []
}
```

## WO-219-D049

```json
{
  "id": "WO-219-D049",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Specify pre-emission bounded audit projections and aggregate read/output budgets, including nested gate logs and truncated batches. Require acknowledgment of a process failure to name its durable record and disposition in the same response. Preserve the distinction between process error and product acceptance failure.",
  "evidence": [
    "docs/evidence/WO-210/decisions.md#wo-210-d039--verification-meta-failures-excessive-context-consumption-and-omitted-logging-commitment",
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/evidence/WO-210/decisions.md",
    "packages/skeleton/test/executor-supports.test.ts: case review roles carry their repair authority, defensive judgment and durable output duties. Preflight skeleton; repair-controls.json control r40-output-duty: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Oversized nested results and truncated combined reads consume context without additional evidence; an acknowledgment without logging disposition loses the process observation.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Restarting completed verification or inventing a new product acceptance gate for those process errors would discard useful evidence or change the wrong contract.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A verifier repeats oversized emission or acknowledges a process failure without naming its durable logging disposition.",
  "resolution": {
    "followupId": "FUP-b3c1a8260bca40b7",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D050

```json
{
  "id": "WO-219-D050",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Queue closed-order overrides in an ignored control pending lane. The next start copies validated records into their original order's control segment and regenerates the projection in the new worktree; remove only unchanged carried pending records. Malformed/unreadable lanes advise and remain in place while start proceeds.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-fork-observations-pass-recorded-2026-10-18",
    "scripts/resume.mjs",
    "scripts/worktree.mjs",
    "scripts/lib/pending-overrides.mjs",
    "scripts/test-off-ramps.mjs: case closed override is retained in the pending record lane. Preflight resume; repair-controls.json control r41-closed-admission: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-worktree.sh: case worktree start carries the closed override to its original order segment. Preflight worktree; repair-controls.json control r41-carry: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-worktree.sh: case worktree start preserves a malformed pending lane and continues with an advisory. Preflight worktree; repair-controls.json control r41-malformed-advisory: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "A post-close override otherwise has no canonical record clean main can carry through a pull request.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Writing tracked evidence on clean main, using a foreign order id in the new segment, or discarding malformed pending data would lose authority/provenance or break segmentation.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An override record is lost, duplicated, moved to the wrong order or blocks start on malformed retained input.",
  "resolution": {
    "followupId": "FUP-b0418fa8b09362be",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D051

```json
{
  "id": "WO-219-D051",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "In an exported instance omit rows whose declared condition sources are absent/core-only before probing them, while keeping local sources. A gate-task hold requires at least three prior fresh samples; missing evidence remains unknown with its observed sample count.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19",
    "scripts/lib/planning-conditions.mjs",
    "scripts/test-launchpad-planning.mjs",
    "scripts/test-plan-refutation.mjs: case gate-task hold waits for three earlier fresh samples. Preflight plan-refutation; repair-controls.json control r42-sample-minimum: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-launchpad-planning.mjs: case planning and release-close reads run in a fresh exported instance. Preflight launchpad-planning; repair-controls.json control r42-source-omission: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "An instance inherited undecidable core conditions and could hold on a one-sample median.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Inventing core observations or hiding local holds would misstate evidence.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An exported instance probes unavailable core sources or a hold is asserted before three baseline observations.",
  "resolution": {
    "followupId": "FUP-10996fedecfde047",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D052

```json
{
  "id": "WO-219-D052",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Keep contained requests and admit outside followup request files only from scratch roots actually granted to the known active session/role, respecting correction/unequip state and link containment. Unknown/narrowed/unrelated roots refuse with the configured control-lane alternative.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-standard-pass-recorded-2026-10-19",
    "scripts/lib/planning-followups.mjs",
    "scripts/test-launchpad-planning.mjs",
    "scripts/test-launchpad-planning.mjs: case planning and release-close reads run in a fresh exported instance. Preflight launchpad-planning; repair-controls.json control r43-outside-admission: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-launchpad-planning.mjs: case planning and release-close reads run in a fresh exported instance. Preflight launchpad-planning; repair-controls.json control r43-host-scratch-fallback: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The command previously rejected the role's granted host scratchpad, causing extra copying through local control.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "An environment variable or generic temporary path alone must not grant authority; a broader filesystem bypass would weaken the refusal.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A valid current-session granted scratch request is refused, an unrelated/narrowed/linked path is admitted, or the alternative path is missing from a refusal.",
  "resolution": {
    "followupId": "FUP-dadc66e1f81f83a5",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D053

```json
{
  "id": "WO-219-D053",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Check every open order's only-suite token against the runner's declared product and machinery suites in that checkout, exempt closed orders and name invalid order/token pairs. List machinery declarations under list --review without changing ordinary review execution selection.",
  "evidence": [
    "docs/planning/work-order-map.md#candidates--returns-from-the-forks-requests-recorded-2026-10-19-second-pass",
    "scripts/work-orders.mjs",
    "scripts/test-runner.mjs",
    "scripts/lib/handoff-ledger.mjs",
    "scripts/test-launchpad-planning.mjs: case planning and release-close reads run in a fresh exported instance. Preflight launchpad-planning; repair-controls.json control r44-preflight-call: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-runner.test.mjs: case review listing includes every available machinery declaration without a change selection. Preflight runner-fixtures; repair-controls.json control r44-review-list-inventory: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "WO-219-D060 and WO-193-D001 stage the future request suite declaration without changing criteria or step4; canonical PlanExecutionAmended binds that metadata repair.",
    "scripts/test-runner.test.mjs: review listing includes every available machinery declaration without a change selection and WO-186 sibling advancement leaves merge-base selection and the review claim unchanged; own machinery still selects. repair-controls.json controls r44-review-list-inventory-final and r44-handoff-selected-view are both positive0/reversion1 under runner-fixtures. WO-219-D066 and runner-integration-audit.json record the final selected-view integration and independent assertion/hash audit; the final inventory control supersedes the earlier source-shape control."
  ],
  "rationale": "A stale core-only token can survive into an instance order and fail only at handoff; the old plain list was not a complete declaration map.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Resolving against list text, silently dropping invalid tokens or changing review execution selection would check a different contract.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An open order names a runner-refused token that index --check admits or an available machinery declaration disappears from the review listing.",
  "resolution": {
    "followupId": "FUP-2304d46e6feb711b",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D054

```json
{
  "id": "WO-219-D054",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Move the configured historical-id refusal into the common parser and carry the correct configuration through current and revision-bound readers. Retain and extend the existing index refusal assertion and prove actual activation through the same guard; an instance declaring none refuses none on that basis.",
  "evidence": [
    "docs/evidence/WO-218/decisions.md#wo-218-d059--ver-002-pass-the-repair-holds-and-the-historical-id-dependency-refusal-no-longer-reaches-the-index-or-the-planning-readers",
    "scripts/lib/dependencies.mjs",
    "scripts/work-orders.mjs",
    "scripts/lib/plan-subject.mjs",
    "scripts/lib/plan-dependency-migration.mjs",
    "scripts/lib/derived-contract.mjs",
    "docs/evidence/WO-218/decisions.md#wo-218-d064",
    "scripts/test-work-orders.sh: case typed parser accepts all relations and refuses malformed authority entries with their source; configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-hard: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-work-orders.sh: case configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-satisfied-by-release: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-work-orders.sh: case typed parser accepts all relations and refuses malformed authority entries with their source; configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-satisfied-by-close: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-work-orders.sh: case typed parser accepts all relations and refuses malformed authority entries with their source; configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-header-context: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-work-orders.sh: case configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-index-context: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-work-orders.sh: case configured historical dependencies refuse through parser, index and activation readers; an empty instance admits the same ids. Preflight work-orders-fixtures; repair-controls.json control history-committed-reader: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-dependency-resume.mjs: case activation rejects configured historical dependencies through the shared parser. Preflight resume; repair-controls.json control history-activation-shared-parser: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The source row names a refusal that had narrowed to lifecycle reads. WO-218-D064 corrects the earlier assertion that no index test existed; this decision does not repeat it. Historical judgments also require the configuration at their own revision.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Keeping activation refusal alone or hard-coding core ids in instances would leave the whole reader reach unresolved.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Any named reader admits a configured historical hard/satisfied edge, an empty configuration falsely refuses one, or a later change silently narrows refusal reach.",
  "resolution": {
    "followupId": "FUP-27e0c0fff9cedb75",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D055

```json
{
  "id": "WO-219-D055",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Bind helper execution to main's committed/configured checkout and the modules actually loaded; accept every retained publication head as a same-tree retry lease with a runnable remedy; stop deletion after the first failure and name checkout/relative path/remedy/rerun; make all listing-limit messages accurate; keep a passing partial structural row from replacing or revoking complete Preflight evidence.",
  "evidence": [
    "docs/evidence/WO-218/decisions.md#wo-218-d062",
    "packages/skeleton/src/harness-host.ts",
    "scripts/lib/target-publish.mjs",
    "scripts/lib/target-worktree-close.mjs",
    "scripts/lib/gate-reuse.mjs",
    "scripts/test-harness.mjs: case WO-221 registered-target admission admits only the bound publication helper at verified and closed and nothing outside the registration. Preflight harness-fixtures; repair-controls.json control f13-planted-node-modules: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case WO-221 registered-target admission admits only the bound publication helper at verified and closed and nothing outside the registration. Preflight harness-fixtures; repair-controls.json control f13-ignored-dist: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case WO-221 registered-target admission admits only the bound publication helper at verified and closed and nothing outside the registration. Preflight harness-fixtures; repair-controls.json control f13-moved-main-ref: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-publish.mjs: case WO-221 the draft form at verified pushes the working tree under a draft pull request that the closed-phase publish reuses. Preflight target-worktree; repair-controls.json control f14-recorded-preparation-lease: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-publish.mjs: case WO-221 the draft form at verified pushes the working tree under a draft pull request that the closed-phase publish reuses. Preflight target-worktree; repair-controls.json control f14-present-head-recovery: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-publish.mjs: case WO-221 the draft form at verified pushes the working tree under a draft pull request that the closed-phase publish reuses. Preflight target-worktree; repair-controls.json control f14-absent-head-recovery: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-close.mjs: case immutable base disposable output stops deletion with the checkout role and retry command. Preflight target-worktree; repair-controls.json control f15-immutable-base: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-close.mjs: case immutable target disposable output stops deletion with the checkout role and retry command. Preflight target-worktree; repair-controls.json control f15-immutable-target: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-close.mjs: case oversized target-files listing names its checkout role and a runnable close retry. Preflight target-worktree; repair-controls.json control f15-listing-target-files: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-close.mjs: case oversized target-directories listing names its checkout role and a runnable close retry. Preflight target-worktree; repair-controls.json control f15-listing-target-directories: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-runner.test.mjs: case Preflight keeps a complete structural pass after a passing partial and refuses a failing partial. Preflight runner-fixtures; repair-controls.json control f20-passing-partial-displaces: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-close.mjs: case oversized judge-only listing names its checkout role and a runnable close retry. Preflight target-worktree; repair-controls.json control f15-listing-judge-only-collision-wrapper: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The source row carries four independently reproduced target lifecycle seams, including three helper-closure trust vectors; all need control evidence.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Trusting a moved main ref, unbound dist/node_modules, only the first retained head, raw absolute filesystem errors or partial structural revocation would preserve the reported defect.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "Any planted module/dist/ref vector is admitted, a same-tree retained retry sticks, deletion proceeds after failure, limit messages omit role/rerun, or focused execution revokes valid complete Preflight evidence.",
  "resolution": {
    "followupId": "FUP-eacf4e6eb0b39fbe",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "F13 loaded closure: planted node_modules, changed dist and moved ref controls.",
    "F14 corrected-title retry after failed edit using any recorded head.",
    "F15 immutable deletion stops further removal; both listings and judge-only overflow name role/rerun and no misleading Git cause.",
    "F20 actual implementation-ready route after a focused partial structural row."
  ]
}
```

## WO-219-D056

```json
{
  "id": "WO-219-D056",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Anchor an already-current starter tag at the earliest manifest-proven refresh commit. Separate history parsing from archive writes, preserve parsed attempts and bounded refusal history, and print a relative completable re-anchor remedy. Record a declared publication target before judgment can refuse. Batch tag annotations without altering starter exclusion, pass the ancestral observation and report original linkHosts indexes.",
  "evidence": [
    "docs/evidence/WO-218/decisions.md#wo-218-d063",
    "scripts/lib/starter-refresh.mjs",
    "scripts/lib/release-tags.mjs",
    "scripts/release.mjs",
    "scripts/lib/config.mjs",
    "scripts/test-launchpad-update.mjs: case starter refresh publishes one verified commit and preserves every refusal boundary. Preflight launchpad; repair-controls.json control f16-current-tip-tag: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-launchpad-update.mjs: case starter refresh publishes one verified commit and preserves every refusal boundary. Preflight launchpad; repair-controls.json control f16-source-ref-ancestor: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case close history retains parsed publication when archiving fails and bounds repeated missing-archive retries. Preflight release-preparation; repair-controls.json control f17-archive-write-reserialization: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case close history retains parsed publication when archiving fails and bounds repeated missing-archive retries. Preflight release-preparation; repair-controls.json control f17-missing-archive-flat-history: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case close history retains parsed publication when archiving fails and bounds repeated missing-archive retries. Preflight release-preparation; repair-controls.json control f17-relative-archive-diagnosis: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case close history retains parsed publication when archiving fails and bounds repeated missing-archive retries. Preflight release-preparation; repair-controls.json control f17-reanchor-reference-reset: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case close history retains parsed publication when archiving fails and bounds repeated missing-archive retries. Preflight release-preparation; repair-controls.json control f17-recovered-publication: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-target-worktree-release.mjs: case WO-221 a target close deletes declared disposable output, judges the base by the fetched tree, refuses a stray .env with the registration remedy and publishes a declared target release. Preflight target-worktree; repair-controls.json control f18-pretag-policy-binding: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release-preparation.mjs: case starter tag classification consumes one batched annotation read. Preflight release-preparation; repair-controls.json control f19-per-tag-process: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-configuration-root.mjs: case registration hosts and target release names refuse invalid instance data at load. Preflight configuration-root; repair-controls.json control f19-original-host-index: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-configuration-root.mjs: case registration hosts and target release names refuse invalid instance data at load. Preflight configuration-root; repair-controls.json control f19-host-wildcard: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-configuration-root.mjs: case registration hosts and target release names refuse invalid instance data at load. Preflight configuration-root; repair-controls.json control f19-host-host-port: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-release.sh: case prepare_independent: release preparation accepts the ancestral observation. Preflight release; repair-controls.json control f19-preparation-observation: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The four source arms cover independent starter/release-history/publication/annotation defects and include repeated refusal safety, not merely success cases.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Tagging an unrelated tip, relabelling parsed bytes unreadable, nesting prior bytes on every retry, calling declared publication no-release or changing baseline exclusions would retain false state.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A tag lands above the refresh commit, history grows recursively/loses parsed binding, an early publication refusal omits its target, annotations are rescanned individually, or host errors name deduplicated indexes.",
  "resolution": {
    "followupId": "FUP-4018cf3118ea113e",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "F16 earliest manifest-proven refresh ancestor.",
    "F17 unwritable archive + missing archive across retries, preserved parsed attempts, bounded size and relative recovery route.",
    "F18 early base refusal records publication target/action before any tag push.",
    "F19 one annotation batch, original starter baseline negative control, ancestral observation, original declared indexes, wildcard and host:port cases."
  ]
}
```

## WO-219-D057

```json
{
  "id": "WO-219-D057",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "On stash-applied continuation refuse or list tracked stash paths with no tree trace and record collisions before explicit acknowledgment, with runnable commands. On build:none emit remove exact generated navigation/runtime guidance from both core and kit floors, preserve custom/clean-room text, and name the missing disclosure in drift messages.",
  "evidence": [
    "docs/evidence/WO-218/decisions.md#wo-218-d064",
    "scripts/lib/worktree-integration.mjs",
    "scripts/lib/harness.mjs",
    "scripts/lib/harness-instruction.mjs",
    "scripts/test-worktree-integration.mjs: case interrupted stash continuation refuses tracked work reverted to HEAD and retains recovery. Preflight worktree-integration; repair-controls.json control r48-f21-tracked-preservation: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-worktree-integration.mjs: case an interrupted stash collision is recorded before its resolution can be acknowledged. Preflight worktree-integration; repair-controls.json control r48-f21-collision-receipt: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case disabled harness keeps core and kit floors while removing built navigation and runtime warnings. Preflight harness-fixtures; repair-controls.json control r48-f22-floor-navigation: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-harness.mjs: case disabled harness keeps core and kit floors while removing built navigation and runtime warnings. Preflight harness-fixtures; repair-controls.json control r48-f22-disclosure-remedy: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "The source row can mark integration applied after its work was reverted and can leave disabled harness floors naming removed generated surfaces.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Accepting upstream bytes as implicit collision acknowledgment or trimming custom/clean-room text to hide generated references would weaken preservation or the locked floor.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "An interrupted integration completes without its stashed work/acknowledgment, or either disabled floor names a removed generated surface or loses custom/clean-room text.",
  "resolution": {
    "followupId": "FUP-4fe22d2e0c8d843d",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": [
    "F21 reverted tracked work and unresolved collision refusal arms.",
    "F22 both emitted floors plus accurate missing-disclosure remedy."
  ]
}
```

## WO-219-D058

```json
{
  "id": "WO-219-D058",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Remove the frozen copy's origin immediately and refuse handoff if any remote remains. Digest source refs before/after both episodes; refuse changed refs on the HEAD route, record changes on explicit-commit routes, and update the checked confinement claim. Test only disposable sources/absent remotes.",
  "evidence": [
    "docs/planning/entropy-reviews/REVIEW-007.md#candidates--accepted-entropy-reducer-findings-review-review-007-recorded-2026-10-20",
    "scripts/lib/entropy-review.mjs",
    "scripts/test-entropy-review.mjs",
    "docs/instance/entropy-reducer/README.md",
    "scripts/test-entropy-review.mjs: case frozen review and refutation copies have no remote route to their fixture source. Preflight plan-refutation; repair-controls.json control r49-no-remote: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-entropy-review.mjs: case a HEAD review refuses a source-ref move even when tracked status stays identical. Preflight plan-refutation; repair-controls.json control r49-head-ref-move: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "scripts/test-entropy-review.mjs: case named-commit reviews and refutations record concurrent source-ref moves without refusing. Preflight plan-refutation; repair-controls.json control r49-named-ref-witness: positive exit 0, isolated reversion exit 1; independently audited assertion."
  ],
  "rationale": "Tracked status/untracked listings alone do not witness ref writes, and a frozen copy retaining its source remote has a route home.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Relying on a sandbox claim alone, testing against a real remote or refusing legitimate concurrent ref changes during a named-commit review would choose the wrong boundary.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "A frozen route retains a remote, a source-ref change escapes its witness, or named-commit concurrency is falsely refused.",
  "resolution": {
    "followupId": "FUP-568da2f2b62ee478",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D059

```json
{
  "id": "WO-219-D059",
  "date": "2026-10-23",
  "dispatch": "resume: next; WO-219 triage, with the operator's direction to own decisions and record evidence, rationale, consequences and reopening conditions",
  "kind": "decision",
  "decision": "Classify current operator-word candidates into attributed speech and incidental JSON/code/document-term quotes, report current counts by class and retain positive unbound-reply detection. Keep the advisory advisory, typed operatorQuote refusal unchanged and existing baseline keys/fingerprints unchanged.",
  "evidence": [
    "docs/planning/entropy-reviews/REVIEW-007.md#candidates--accepted-entropy-reducer-findings-review-review-007-recorded-2026-10-20",
    "scripts/docs-check.mjs",
    "scripts/test-docs-check.mjs",
    "scripts/test-docs-check.mjs: case operator-word advisories classify incidental JSON, code and document terms apart from quoted replies. Preflight docs-check-fixtures; repair-controls.json control r50-operator-word-classes: positive exit 0, isolated reversion exit 1; independently audited assertion.",
    "WO-219-D064 and self-review-controls.json add the two current quoted-request regression controls to the same scripts/test-docs-check.mjs case under docs-check-fixtures, each positive0/reversion1."
  ],
  "rationale": "A single lexical candidate count cannot directly show the source reopening condition without hand-classifying incidental quotes.",
  "consequences": "This row has no outstanding action under the selected decision. The recorded controls or base/document evidence establish the bounded claim; historical records are preserved.",
  "rejected": [
    {
      "option": "Turning the advisory into a hard refusal, rewriting the named historical records or re-fingerprinting the baseline would undo the accepted decision.",
      "reason": "Rejected on the source contract, evidence boundary and bounded scope described above; no intervention is manufactured to meet a disposition quota."
    }
  ],
  "reopenWhen": "The attributed-speech count crosses its recorded threshold after WO-219, a record misstates words, or an incidental class is again counted as speech.",
  "resolution": {
    "followupId": "FUP-46deeb2483a9c28d",
    "status": "settled",
    "mode": "bounded-fix"
  },
  "wholeAsk": []
}
```

## WO-219-D060 — Bind the future-suite metadata repair

```json
{
  "id": "WO-219-D060",
  "date": "2026-10-23",
  "dispatch": "resume: next; required current-declaration check in step 17",
  "decision": "Normalize WO-193's premature request Preflight token through its own recorded amendment. The new check must judge every open order against the current runner. Keep WO-193 step 4 and all criteria byte-identical, retaining its suite registration and both exact checks; its Preflight field requires insertion when the suite exists. No empty suite or checker exception is added.",
  "evidence": [
    "npm run sync refused WO-193 because request is not currently declared; the existing order identifies it as the suite step 4 registers.",
    "docs/evidence/WO-193/decisions.md#wo-193-d001--stage-the-future-suite-until-it-is-registered records the bounded repair and WO-216-D012 precedent.",
    "A byte comparison after removing only the Preflight field is identical to HEAD, including the complete criteria and step 4.",
    "Canonical plan amend-order WO-193 WO-193-D001 binds the unchanged-scope metadata normalization; final planning/index gates check the result."
  ],
  "rejected": [
    {
      "option": "Grandfather one order or accept undeclared future suites",
      "reason": "That would weaken WO-219's required check."
    },
    {
      "option": "Add an empty request suite",
      "reason": "It would imply executable coverage before the feature exists."
    },
    {
      "option": "Delete or relax WO-193's checks",
      "reason": "All criteria and step-4 obligations remain required."
    }
  ],
  "reopenWhen": "WO-193 registers the request suite and inserts its exact Preflight command, or another future-suite declaration encounters the same ordering constraint."
}
```

## WO-219-D061 — Resolve moved execution-amendment decisions through their binding

```json
{
  "id": "WO-219-D061",
  "date": "2026-10-23",
  "dispatch": "scope expand: WO-219 also fixes the plan gate moved-record reader; operator authorization during the active resume: next execution",
  "decision": "Extend WO-219 only to resolving execution-amendment decisions through the existing readDecisions target-record binding. Remove the earlier launchpad-file-only refusal on that path; retain contained-file admission, bound moved-record validation and the exact decision hash equality in validateAmendment. Inspect any other decisions-record containment check on amendment/writeback paths and apply the same rule there. Leave unrelated evidence-reference readers and all publication/effect limits unchanged.",
  "evidence": [
    "Operator field report on 2026-10-23: a closed target order with three execution amendments has its decisions record moved by target-records; the shared reader returns the decisions through the control-segment binding, while the preliminary contained-file check refuses plan and document gates at two released versions. This is operator-reported field evidence; the local fixture independently reproduces the shape.",
    "scripts/lib/plan-receipts.mjs at c670e6288ecb221ef2416cef06f920006866bc5d: amendmentDecision checks containedRegularFile before readDecisions; validateAmendment compares bound.hash === event.decisionHash.",
    "The scope expansion requires one moved closed-target fixture with the fix present and isolated reversion, a same-fixture contained-file control passing in both arms, replayable exit-code evidence, criterion 8 and the Read before upgrading statement."
  ],
  "rationale": "The target binding already supplies the authoritative moved record. Requiring the retired launchpad file before invoking that reader blocks unrelated orders without adding decision-byte protection. The existing hash comparison continues to bind the same decision bytes.",
  "rejected": [
    {
      "option": "Recreate a second decisions file in each affected launchpad",
      "reason": "It bypasses the moved-record contract and risks two divergent records."
    },
    {
      "option": "Relax or remove the execution-amendment decision hash check",
      "reason": "Moving a record changes location, not the bytes accepted by the amendment."
    },
    {
      "option": "Take other items from the fork planning pass",
      "reason": "The authorization expressly excludes them."
    }
  ],
  "reopenWhen": "A fixture shows the shared reader admits an unbound, wrong-target or changed decision, or the operator explicitly authorizes further scope."
}
```

## WO-219-D062

```json
{
  "id": "WO-219-D062",
  "date": "2026-10-23",
  "dispatch": "resume: next; criterion 4 touching-register review",
  "decision": "Leave the eight existing unlisted touching records in their current dispositions. Name all eight in README and retain their source-specific reopening conditions. The three listed operator packets and two separately boarded observations are accounted for independently.",
  "evidence": [
    "docs/evidence/WO-219/touching-audit.json: source-section and changed-hunk review of all eight records; exact unchanged-function/paragraph checks for WO-226-D021 and WO-227-D018.",
    "docs/evidence/WO-219/followups-touching.json: all current and baseline pages agree on the same register.",
    "FUP-00af89947ed9099f: Both changes preserve the migration route. Neither establishes that historical receipt subjects no longer depend on it; no removal or receipt migration is proposed. Retain deferred under the existing proof condition.",
    "FUP-06744dc23242d044: The changed behavior is minimum sample support and instance applicability, not task selection. No lost phase or needed omitted task reading is established by these hunks. Retain deferred with the exact existing condition.",
    "FUP-524a82332e21e127: At the touching-report cutoff there is no Verification event in the canonical WO-219 segment, and elapsed time since activation is about 2 h 24 m. Neither stated trigger is established. Retain deferred.",
    "FUP-7f9a27e6ed6c44b3: The new declaration check can add index work, so the old unused-import-only rationale is not the present rationale. The diff supplies no measured crossing of any recorded threshold and makes no performance-settlement claim. Retain deferred pending the named measurement.",
    "FUP-bfab19adc5e5eac1: These hunks neither adjust the entropy timeout nor supply a qualifying review/refutation episode observation. Retain the existing deferred headroom NoOp and its cadence/threshold.",
    "FUP-d0a9719cc2e4ec55: Test selection does not recover the missing ancestry edge or activate the deferred WO-217 packet. No new detached-survivor observation is supplied by this diff. Preserve deferred and the documented incomplete guarantee.",
    "FUP-589642d0e0c714c8: The exact named edit seam is not opened. Near-miss routing/hints and the WO-178 pipe/redirect expectations remain unchanged; this fix does not restore the hint or record an operator choosing another spelling. Leave untriaged under criterion 4.",
    "FUP-841dca0ce87623e2: This edits the Codex ownership contract, not the private-list contract. It adds no claim about publication confirmation or present-empty lists, and no operator need for that paragraph is supplied. Leave the write-back gap untriaged."
  ],
  "rejected": [
    {
      "option": "Treat every textual match as an instruction to widen this batch",
      "reason": "Criterion 4 explicitly retains other-batch and candidate rows; none of the bounded observations establishes its named reopening trigger."
    }
  ],
  "reopenWhen": "A recorded source-specific condition occurs or the operator explicitly allocates the unlisted work; unknown unmeasured thresholds remain unknown."
}
```

## WO-219-D063

```json
{
  "id": "WO-219-D063",
  "date": "2026-10-23",
  "dispatch": "resume: next under the WO-219-D061 scope expansion",
  "decision": "Use the shared bound decision reader on the execution-amendment path. Accept its existing contained internal-alias behavior rather than introducing a second precheck; outside-root inputs still refuse. No other decision-specific containment check exists on the amendment/writeback paths, so leave generic evidence-reference, receipt, order and product input checks unchanged.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs: amendmentDecision is the only decisions.md containment predicate on the traced path. Its callers cover new amendPlanOrder recording, validateAmendment during plan checking and withdrawal, and active executionWritebacks projection.",
    "scripts/lib/meta.mjs readDecisions and scripts/docs-check.mjs: the existing reader resolves immutable moved rows and carries recordSource/targetRecord as non-enumerable metadata.",
    "docs/evidence/WO-219/moved-amendment-controls.json: fixed contained 0; reverted contained 0; fixed moved 0; reverted moved 1 at the removed precheck. The same cases validate wrong decision hash and missing-id refusals; all four legs keep identical assertions.",
    "scripts/lib/plan-receipts.mjs: bound.workOrder === event.workOrderId && bound.hash === event.decisionHash remains byte-identical."
  ],
  "rejected": [
    {
      "option": "Add another local-file guard before the existing bound reader",
      "reason": "It would reintroduce the moved-record blockade and create a second interpretation of document containment."
    },
    {
      "option": "Modify unrelated evidence-reference readers",
      "reason": "The traced amendment resolution does not call them and the expansion excludes unrelated changes."
    }
  ],
  "reopenWhen": "A fixture or field observation shows a bound moved decision is rejected, a missing/changed decision is admitted, or the common reader weakens physical containment."
}
```

## WO-219-D064 — Preserve quoted requests through incidental-token classification

```json
{
  "id": "WO-219-D064",
  "date": "2026-10-23",
  "dispatch": "resume: next; two fresh executor review workers and one focused follow-up",
  "decision": "Fix both concrete low-severity operator-word classification findings. A document-term match accounts only for its own quotes; any remaining quote keeps mixed or uncertain prose attributed. A whole quoted response formatted as inline code remains visible to that classification, while assignments and embedded code remain incidental. Keep all historical fingerprints and the typed operatorQuote refusal unchanged.",
  "evidence": [
    "docs/evidence/WO-219/self-review/criteria.md: CA-001, quoted requested rename containing field names was misclassified as document-term.",
    "docs/evidence/WO-219/self-review/criteria-repair.md: CA-001 repair accepted by static inspection; CA-002, requested inline-code quotation was erased before classification.",
    "docs/evidence/WO-219/self-review/design.md: 0 concrete findings; production and related test hunks reviewed with stated limits.",
    "scripts/test-docs-check.mjs: operator-word advisories classify incidental JSON, code and document terms apart from quoted replies; added requested/instructed mixed quotes, whole-quoted inline responses, multiple document terms and incidental embedded-code controls.",
    "docs/evidence/WO-219/self-review-controls.json: r50-mixed-quoted-request positive0/reversion1 at attributed-speech versus document-term; r50-inline-quoted-request positive0/reversion1 at attributed-speech versus incidental-code. Both intended assertions are reached."
  ],
  "rejected": [
    {
      "option": "Add only requested to the speech-verb whitelist",
      "reason": "It would leave the same failure for another unenumerated attribution verb and conflate a requested document term with a quoted request."
    },
    {
      "option": "Treat every inline code span as attributed speech",
      "reason": "It would discard the requested incidental code class; only whole quoted responses survive code removal."
    }
  ],
  "reopenWhen": "A sourced case shows an actual quoted response loses attribution or an incidental class breaks its retained fingerprint/advisory contract."
}
```

## WO-219-D065 — Complete the compiler component-version bump

```json
{
  "id": "WO-219-D065",
  "date": "2026-10-23",
  "dispatch": "resume: next; complete-review compiler failure and canonical stop",
  "misread": "I treated the compiler component bump as complete after updating its manifest and internal dependency pins; I omitted the exported package-version constant.",
  "meant": "The manifest and pure compiler constant must name the same executing package version. The existing identity test is the executable contract.",
  "changed": "Set COMPILER_PACKAGE_VERSION to 0.31.0, matching the prepared manifest; regenerate affected artifact identities, harness and evidence editions, then run a fresh complete review. Preserve the failed/stopped run as evidence only.",
  "decision": "Repair the omitted compiler version label without changing compiler behavior or tests. Canonically stop the already-failed complete run to avoid spending the remaining suite work on a known inconsistent subject; it supplies no complete pass.",
  "evidence": [
    "packages/compiler/test/artifact-identity.test.ts: WO-029 the pure compiler package-version constant names the executing package failed in the complete review with actual 0.30.0 and expected 0.31.0.",
    "packages/compiler/src/artifact-identity.ts: the source constant deliberately keeps manifest I/O out of pure compilation.",
    "node scripts/harness.mjs evidence --stop at 2026-10-23T16:41:51.312Z stopped run 0c73b206-8b60-415a-bfaf-eb04ecec3d96; active gates empty.",
    "The bounded search for the four old component versions across compiler, skeleton, kernel and console source found only this compiler constant."
  ],
  "rejected": [
    {
      "option": "Relax the package-version identity assertion or retain the inconsistent constant",
      "reason": "That would publish artifacts naming a compiler version different from the executing package."
    },
    {
      "option": "Claim completed tasks from the stopped run as the complete review",
      "reason": "The required complete gate must pass on the repaired current subject."
    }
  ],
  "reopenWhen": "A current gate or source scan shows another executing-component label differs from its manifest."
}
```

## WO-219-D066 — Separate declaration inventory from execution selection

```json
{
  "id": "WO-219-D066",
  "date": "2026-10-23",
  "dispatch": "resume: next; complete-review runner integration failures",
  "decision": "Separate the complete review inventory from the dynamic execution selection with the read-only --list --selected modifier. Keep --list --review as the full declaration inventory required by row44; make handoff/final-review claims explicitly request the selected view. Preserve the existing selection assertions. Reset the wrong-identity fixture to an independent unbound passing review before its first correction, retaining all consumer assertions under the one-time correction contract.",
  "evidence": [
    "Complete review ending 2026-10-23T16:53:34.671Z: runner-fixtures failed four cases. Release-only and release-shell tests still assumed the old listing; the confined-partial fixture attempted a second productGate correction; the sibling-advance case exposed requireGateClaims reading inventory as execution selection.",
    "scripts/lib/handoff-ledger.mjs reviewSelection: its child request now includes --selected; scripts/test-runner.mjs uses the same selection branch as execution and refuses --selected without --list.",
    "scripts/test-runner.test.mjs: all four formerly failing named cases passed in the serial bounded focused run at 2026-10-23T16:59:50.007Z.",
    "repair-controls.json controls r44-review-list-inventory-final and r44-handoff-selected-view: each is positive0/reversion1 with unchanged fixture assertions. The first supersedes the pre-integration inventory control; the second proves the consumer must not use inventory for review claims.",
    "docs/product/07-execution-guide.md \u00a7Gate execution and reuse records both read-only views."
  ],
  "rationale": "Listing every declaration is necessary for Preflight discovery, while completion must judge the suites selected by the actual change. Using one view for both silently expands the handoff obligation. The correction fixture must reach the consumer identity check through a valid first correction.",
  "rejected": [
    {
      "option": "Restore the old selective --list --review output",
      "reason": "It would abandon the row44 inventory requirement."
    },
    {
      "option": "Weaken the suite-selection or wrong-identity assertions",
      "reason": "The original behavior contracts remain valid and now have explicit fixture inputs."
    },
    {
      "option": "Hide the selected view behind an environment variable",
      "reason": "An explicit side-effect-free listing modifier is reviewable and keeps child-runner shims aligned."
    }
  ],
  "reopenWhen": "A complete-review consumer and actual execution disagree on selection, or a selected listing starts effects instead of returning its inventory."
}
```

## WO-219-D067 — Preserve historical checks while binding current measurements

```json
{
  "id": "WO-219-D067",
  "date": "2026-10-23",
  "dispatch": "resume: next; third complete gate integration repair",
  "decision": "Repair two legacy fixture expectations omitted when integrating D009 and D044. Keep runtime behavior unchanged. Bind the startup-cost fixture to the current WO-219 measurements and the byte-hashed WO-226 predecessor; preserve the prior uniform addition, savings and 256-byte historical headroom assertions on their original data. Record current per-role growth and actual headroom, including negative headroom, and preserve every ceiling. Declare the current oracle as a process-debt source. Update the closed-order fixture to expect the existing explicit linked-checkout refresh guidance, retaining written:false and adding an unchanged-snapshot-bytes assertion.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json: third complete run ended at 2026-10-23T17:25:06.357Z after 755432 ms. Its actual failing timeline task is process-debt; two named assertions failed. Incomplete launchpad/release aggregates are not additional executed assertion failures.",
    "scripts/test-gate-followups.mjs: bounded role wording preserves prior savings and records reviewed startup additions expected the prior 29132-byte executor while current measured bytes were 29484. A filename-only swap would also misapply the earlier uniform 310-byte addition to current per-role growth.",
    "packages/skeleton/fixtures/wo219-role-baseline.json retains the preceding oracle hash and upstream link, existing measured bytes and unchanged ceilings; growthBytes/headroomBytes state the current deltas. scripts/test-runner.mjs adds this current fixture source and retains the historical entries.",
    "scripts/test-process-debt.mjs: WO-170 a closed order's snapshot stands for its journals, and with neither they read unavailable still expected the old reason. D044, writeOrderSnapshot and an existing CLI assertion already specify the linked-checkout refresh route; the unlinked fixture remains unwritten.",
    "docs/evidence/WO-219/process-fixtures-recheck.json: both exact previously failing cases pass under the bounded wrapper, two tests with zero failures/skips/cancellations. A fresh complete gate remains required."
  ],
  "rejected": [
    {
      "option": "Raise a cold-start ceiling, rewrite the historical oracle or discard its savings assertions",
      "reason": "D009 preserves these measurements and limits; only the current-versus-historical fixture binding was missing."
    },
    {
      "option": "Restore the obsolete closed-order runtime refusal",
      "reason": "It would undo D044's authorized explicit retained-usage refresh. The current no-write behavior in an unlinked checkout already matches the intended contract."
    },
    {
      "option": "Treat a focused repair pass as the complete gate",
      "reason": "The full current subject still owes a fresh complete run."
    }
  ],
  "reopenWhen": "A current measured role differs from the current oracle, a historical oracle or ceiling changes unexpectedly, or the closed-order no-write/linked-refresh behavior regresses."
}
```

## WO-219-D068 — Keep emitted-role expectations aligned with authorized ownership

```json
{
  "id": "WO-219-D068",
  "date": "2026-10-23",
  "dispatch": "resume: next; fourth complete gate integration repair",
  "decision": "Update the two legacy shared-role expectations missed when implementing the operator-authorized decision-ownership wording in D003. Keep the exact-once checks across every emitted role, harness profile and economy setting. Also require both replaced arbitration phrases to stay absent. This is a fixture-only correction; the authorized generated role text and every other assigned-rule assertion remain unchanged.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json: the fourth run ended at 2026-10-23T17:44:00.729Z after 765659 ms. Its sole actual failing timeline task is skeleton, with one failing emitted-role case; earlier compiler, runner and process-debt failures passed.",
    "packages/skeleton/test/executor-supports.test.ts: WO-179 and WO-195 emitted roles carry their assigned corrections across support settings still required the old routine-question arbitration sentence. Source inspection also found the immediately adjacent assumption/clarification sentence stale in the same sharedRules array.",
    "packages/skeleton/src/loadouts/contributor.ts sharedCorrections already emits D003 decision ownership and evidence-backed assumptions with reopening conditions. Those runtime bytes are not changed by this repair.",
    "docs/evidence/WO-219/role-wording-recheck.json: after the ordinary build, the exact formerly failing case passes under the bounded wrapper, one test with zero failures/skips/cancellations. Both obsolete phrases are now explicitly refused by that fixture."
  ],
  "rejected": [
    {
      "option": "Restore the old ask-the-operator instruction to satisfy the historical expectation",
      "reason": "That would contradict the operator's explicit standing direction and undo D003."
    },
    {
      "option": "Drop the assigned-rule assertion or derive its expected strings from the implementation",
      "reason": "The independent exact literals continue to guard every generated role and support setting."
    }
  ],
  "reopenWhen": "Generated roles omit or duplicate a selected ownership rule, restore either replaced arbitration phrase, or another independently recorded rule change requires its expectation to be updated."
}
```

## WO-219-D069 — Keep real integration fixtures coherent with the checked metadata

```json
{
  "id": "WO-219-D069",
  "date": "2026-10-23",
  "dispatch": "resume: next; fifth complete gate integration repair",
  "decision": "Repair the real-generator integration fixture's mixed code/metadata subject and two stale decision-label expectations. When the committed fixture history lacks the already-authorized WO-193 amendment, overlay only its approved Preflight field repair, decision and exact canonical amendment row, asserting all other order bytes and the preceding planning log are unchanged. Skip the bridge entirely once that amendment is in cloned history. Preserve all real Git integration, recovery, history and refusal assertions. Expect the existing ancestral-release-tag decision label in both collision records; preserve the distinct local-snapshot stdout label. No runtime checker, tag-selection rule or criterion changes.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json: fifth complete run ended at 2026-10-23T18:04:23.909Z after 922944 ms; worktree-integration was the sole actual failing timeline task, with four failing cases.",
    "scripts/test-worktree-integration.mjs fixture clones committed HEAD then overlays current checker/libraries. Its two real-generator cases therefore retained WO-193's old request Preflight token, despite the active-tree D060/WO-193-D001 amendment already fixing it. The exact amendment is row 95 after the byte-identical 94-row committed planning log.",
    "The fixture overlay retains its historical log prefix and compares order bytes outside Preflight. Its amendment-present branch performs no current-order overlay, avoiding a new dependency on unrelated future WO-193 edits. Focused fixtures use synthetic authorities and do not need the bridge.",
    "The two exact collision evidence arrays now name ancestral local release tags, excluding annotated starter refresh tags, matching scripts/lib/release-preparation.mjs and scripts/release.mjs. Tag observation: local snapshot only remains an unchanged stdout assertion.",
    "docs/evidence/WO-219/integration-fixtures-recheck.json: all four exact previously failing cases pass under the bounded wrapper, with no skips/cancellations.",
    "Two reused read-only workers inspected the named fixture setup paths and release-label expectations. No additional supported mismatch was found in the inspected target-publish, target-worktree, worktree, vertical, and launchpad update/export setup families; this limited source audit does not predict their suite results."
  ],
  "rejected": [
    {
      "option": "Add an empty request suite, bypass Preflight validation or delete unrelated fixture authorities",
      "reason": "The approved metadata repair already exists; those alternatives would invent coverage or avoid the check."
    },
    {
      "option": "Overlay the entire active planning/control state into every fixture",
      "reason": "Only the approved amendment is needed, and the synthetic integration histories and their assertions must stay intact."
    },
    {
      "option": "Change runtime tag labels or weaken collision evidence checks",
      "reason": "The runtime already states the selected tag policy correctly; the two historical expected strings were stale."
    }
  ],
  "reopenWhen": "The fixture mixes an unbound metadata repair with current checker code, changes non-Preflight bytes through this bridge, or its exact collision evidence differs from the selected tag policy."
}
```

## WO-219-D070 — Keep integration fixture inputs inside the product subject

```json
{
  "id": "WO-219-D070",
  "kind": "correction",
  "date": "2026-10-23",
  "dispatch": "resume: next; sixth complete gate product-input correction",
  "decision": "Replace D069's live-source metadata reads with a frozen product fixture containing only the approved old/new Preflight fields, exact canonical amendment and decision text, and prior planning-log hash. Derive the complete repaired order from the isolated committed clone. Check one exact old field, unchanged outside-field bytes, canonical normalized source/approved order hashes, JavaScript string length, stable decision hash and history prefix before writing only the clone. Preserve the amendment-present NoOp. Declare the data through the existing suite row's sources option, retaining product classification and the product-read guard.",
  "misread": "I treated live source coordination records as acceptable inputs to a product integration fixture. Passing the raw case assertions did not exercise the product-read guard.",
  "meant": "The product cases need fixed isolated inputs included in their judged code identity, with no reads of excluded live coordination records. Their product classification and guard remain required.",
  "changed": "scripts/fixtures/worktree-integration/wo193-preflight-bridge.json holds the frozen approved data. scripts/test-worktree-integration.mjs reads it and clone-local records instead of the source checkout's live order/log/decision. scripts/test-runner.mjs declares the file in the existing worktree-integration row sources without adding a machinerySources key or document tags.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json: sixth complete run ended at 2026-10-23T18:18:38.799Z, exit1. All40 worktree-integration assertions passed; its product-read guard separately refused18 reads of the source checkout's work-order and planning records across nine real-generator cases.",
    "The frozen fixture copies only the already-approved WO-193-D001/WO-219-D060 repair. It contains no whole order; all non-Preflight order bytes remain clone-derived.",
    "scripts/lib/plan-continuation.mjs executionAmendmentSource supplies the existing full-source normalization; scripts/lib/plan-receipts.mjs binds sha256 hashes, JavaScript string length and recursively stable decision JSON. The new assertions use those conventions.",
    "Two reused read-only helpers checked the proposed product fixture and the guard/source-identity rules. Adding a machinerySources key would change suite classification; the selected row.sources declaration does not. No guard, identity or policy source is changed.",
    "The required reproduction is node scripts/harness.mjs bounded -- npm test -- --only worktree-integration, retaining an active product-read log and zero excluded-input observations. A focused partial row never supplies the required complete pass.",
    "docs/evidence/WO-219/integration-read-guard-recheck.json: canonical bounded --only worktree-integration passed at 2026-10-23T18:32:25.417Z; the suite row records its active product-read log and zero excluded-input observations. This focused row supplies no complete passing claim."
  ],
  "rejected": [
    {
      "option": "Reclassify the existing product cases or weaken the guard so live coordination reads pass",
      "reason": "The failure correctly exposed an input dependency outside the product subject; changing classification would avoid that contract."
    },
    {
      "option": "Keep using raw node --test as proof of guard success",
      "reason": "Run6 proves raw assertion success is insufficient; the canonical suite runner must exercise the guard."
    },
    {
      "option": "Undo the new Preflight declaration check or the approved metadata repair",
      "reason": "Both are required by this order; an independent fixture can preserve them without live-record reads."
    }
  ],
  "reopenWhen": "The suite observes another excluded live-record read, the frozen canonical bindings disagree, or an authorized source change requires a separately reviewed fixture update."
}
```

## WO-219-D071 — Use the execution view in the exported-instance fixture

```json
{
  "id": "WO-219-D071",
  "kind": "correction",
  "date": "2026-10-23",
  "dispatch": "resume: next; seventh complete gate export-fixture correction",
  "decision": "Make the exported-instance fixture request --list --selected when predicting the suites executed by its ordinary, document and review commands. Keep every execution command and assertion unchanged. The full declaration inventory remains the behavior of plain --list --review; this fixture needs the execution view already introduced in D066. No runtime behavior, criterion, exclusion or diagnostic check changes.",
  "misread": "I repaired the direct runner and handoff consumers in D066 but missed the exported-instance fixture that also compared review listings with executed suites.",
  "meant": "A fixture predicting actual execution must explicitly select the execution view. A declaration inventory may include unavailable core diagnostics and therefore cannot stand for an instance review selection.",
  "changed": "scripts/test-launchpad-export.mjs adds --selected to the existing three-command listing loop. Its no-exclusions, exact suite lists, runtime integrity, document isolation, README, evidence reuse and explicit diagnostic refusal assertions are preserved.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json: seventh complete run ended at 2026-10-23T19:00:34.485Z after 1538892 ms. All selected tasks ran; the sole actual failing task was launchpad:file:test-launchpad-export.mjs, at its exported-instance selection assertion.",
    "scripts/test-launchpad-export.mjs: the exported instance checks runtime, coordination records and explicit diagnostics separately expected no not-carried rows at its selection listing; ordinary --list --review correctly returned the complete declaration inventory.",
    "docs/evidence/WO-219/export-selection-recheck.json: the entire formerly failing case passes with the explicit selection view, retaining all later assertions that were unreachable after the prior listing failure.",
    "Three reused read-only helpers inspected the complete case, remaining literal runner-list consumers and source/edition mappings. No additional supported stale execution-selection consumer was found in scripts or package source; intentional inventory checks and Git --list calls remain unchanged. This is a bounded static scan, not a claim about dynamically constructed callers.",
    "The first focused invocation ended at 2026-10-23T19:02:08.257Z before selection execution because the exported kit formatting preflight caught my unformatted argv edit. Formatting passed before the repeated focused case; the failed preparation remains in export-selection-recheck.json."
  ],
  "rejected": [
    {
      "option": "Remove the no-exclusions or exact selection assertions",
      "reason": "They still describe actual instance execution correctly; only the fixture listing call was stale."
    },
    {
      "option": "Revert the full review declaration inventory or change runtime selection",
      "reason": "That would undo row44 and D066 instead of repairing the remaining consumer."
    }
  ],
  "reopenWhen": "An instance selected listing differs from actual execution, the ordinary declaration inventory loses a declared suite, or a supported consumer still uses inventory as an execution prediction."
}
```

## WO-219-D072

```json
{
  "id": "WO-219-D072",
  "date": "2026-10-23",
  "dispatch": "resume: next; final touching-register read after complete gate pass",
  "decision": "Name the three additional outside-batch matches introduced by the later fixture edits, retain their existing one deferred and two untriaged dispositions as criterion 4 requires, and state the observed conditions rather than claiming they did not occur. No implementation or acceptance change is made after the complete pass.",
  "evidence": [
    "docs/evidence/WO-219/followups-touching.json: the final exact CLI/read comparison finds 16 pending matches over the final changed paths; current and baseline readers return identical pages on register revision a4f7850d4e457b4bd62762dcb5f0a074035dc5ba094307da2ad6f5a63557d6fa.",
    "docs/evidence/WO-219/touching-audit.json finalTouchingAddendum records complete source reads, their exact JSON block hashes and the current implementation boundaries.",
    "FUP-957602bc42e32e1d: The role-edit measurement condition has occurred. Current executor/reviewer headroom is -238/-700 bytes under unchanged ceilings. Retain the existing deferred optimization. D009 and FUP-e08668268dea62b1 record the current measurements and equivalent-usefulness optimization duty; neither observation establishes an acceptable shortening of reviewed duties. Do not claim the old reopening condition is unmet or the optimization is complete.",
    "FUP-268c774fd159addb: The named export fixture was edited by D071. The unrelated WO-225 schema-test child still inherits NODE_TEST_CONTEXT through the shared run helper and checks only its exit. Leave this outside-batch row untriaged under criterion 4. D071 changes only the execution-selection listing; it does not claim to repair the carried schema-test assertion or provide its requested negative control. The full gate pass is not independent evidence that those two nested schema cases executed. The source records separate WO-225 verification evidence; this order makes no new claim about it.",
    "FUP-eed385be08e5bdd9: The named role-cost fixture was edited by D067. It now compares ceiling minus actual installed bytes with recorded headroomBytes, retains exact byte and ceiling pins, and preserves the old inequality only on historical measurements. Leave the row untriaged under criterion 4 while naming the now-present assertion and the existing D067 passing evidence. This is an observation of the necessary integration repair, not a separately allocated disposition or a new claim of its dedicated paired control. Do not present a current negative headroom as historical headroom or silently settle this unlisted row."
  ],
  "rejected": [
    {
      "option": "Silently settle or reallocate the three extra matches",
      "reason": "Criterion 4 explicitly retains other-batch and candidate rows; these are not among the fifty allocated ids."
    },
    {
      "option": "Treat the passing export suite as proof that its unrelated nested schema tests executed",
      "reason": "The source and current helper expose the existing NODE_TEST_CONTEXT limitation; this order does not repair or rely on that assertion."
    },
    {
      "option": "Hide the new matches or say their edit conditions did not occur",
      "reason": "The final changed-file read and current source establish those conditions."
    }
  ],
  "reopenWhen": "A later allocation or planning pass judges the retained records, equivalent-usefulness role optimization is demonstrated, or independent evidence changes one of the stated implementation boundaries."
}
```

## WO-219-D073

```json
{
  "id": "WO-219-D073",
  "kind": "correction",
  "date": "2026-10-23",
  "dispatch": "resume: next; final document-gate repair",
  "decision": "Correct the five document-check failures and the stale baseline entry without changing implementation, criteria or checker rules. Add the control prefix to WO-193-D001 dispatch and canonically rebind that same decision; preserve every order byte and prior event. Replace the three published home-path examples with prose or an explicit fixture-derived replay placeholder, preserving the original mutation bytes and every recorded result/hash. Give D072 the short heading its link names. Run the canonical shrink-only baseline writer to remove the one obsolete exception, preserving all other fields and admitting none.",
  "misread": "I filed the dispatch label, short anchor and synthetic path examples without satisfying their document rules, and initially reported only the first stale notice rather than the complete failure list.",
  "meant": "The final document gate validates these authored records as well as the code tests. A bound decision correction needs its canonical rebind, and publication placeholders must retain a reproducible exact control.",
  "changed": "WO-193-D001 changes only dispatch; plan amend-order appends row 97 for the same order and decision. WO-219-D019 and b5-runner-policy use publication-safe prose and an explicitly described fixture-source template; the resolved 105-byte mutation retains its original SHA-256. D072 heading now resolves the existing link. doc-baseline.json loses one stale fingerprint and no other property.",
  "evidence": [
    "docs/evidence/WO-219/gate-runs.json documentRuns records the failed 80019 ms document attempt ending 2026-10-23T19:42:44.625Z: docs-check was the sole executed failing task, reporting five failures plus one stale notice; later tasks were unrun.",
    "The documentRepairs object records the canonical baseline command, removal of one fingerprint from 510 to 509 with no additions and all other fields unchanged, and the complete passing code identity remaining 1e40476b807fa965dfd33c6a917dd9cef7920a6b35505e29bf59bed84a957409.",
    "The canonical same-decision rebind is supported by scripts/lib/plan-receipts.mjs checkPlanGate and its WO-139 regression. Row 97 retains row 95 receipt, source/order hashes, order length and decision id; the earlier history and frozen product fixture remain byte-identical.",
    "repair-controls.json b5-runner-policy replayBinding pins the fixture hash and extraction rule. Resolving the explicit token reconstructs the original 105-byte new value with SHA-256 b3b4ee730745f587bc70c600125b63560e7fcefdff0d015795bf56ebbae5e0ce; the recorded positive/negative runs and file/log hashes are unchanged. This is a presentation repair, not a new control execution.",
    "Two reused read-only helpers independently checked the canonical rebind and replay-placeholder derivation. The root executed the rebind, exact-byte reconstruction and baseline subset assertions. WO-219-D061 remains byte-identical.",
    "The final touching refresh after these maintenance edits still finds the same 16 rows on the same register revision; every row is named, and all fifty recorded --show reads remain at their latest source revision."
  ],
  "rejected": [
    {
      "option": "Edit an old amendment event, skip its hash comparison or leave the changed decision unbound",
      "reason": "The existing append-only rebind preserves the old receipt/source validation and binds the corrected current decision."
    },
    {
      "option": "Exempt the new examples or add baseline fingerprints",
      "reason": "Examples can be rendered with explicit placeholders; the baseline writer correctly refuses new admissions and only shrinks."
    },
    {
      "option": "Silently change the recorded negative mutation or its results",
      "reason": "The fixture-source template resolves to exactly the original bytes; the existing execution evidence stays intact."
    }
  ],
  "reopenWhen": "The document gate rejects the corrected records, a template resolves to different mutation bytes, the canonical decision rebind diverges, or a maintenance edit changes the passed code identity."
}
```

## WO-219-D074 — VER-001: fail; criterion 6 is unmet because the closed-order override route has no product write-back

```json
{
  "id": "WO-219-D074",
  "date": "2026-10-23",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 at code identity 1e40476b807fa965dfd33c6a917dd9cef7920a6b35505e29bf59bed84a957409. Criteria 1 to 5, 7 and 8 are met; criterion 6 is unmet. F1 (blocking; class documentation write-back; criterion 6): row 41's fix (WO-219-D050, FUP-b0418fa8b09362be) admits override-record at a closed order (scripts/resume.mjs OFF_RAMP_PHASES, line 302), records the event in the ignored lane docs/control/local/pending-overrides, and has the next worktree start append it to the closed order's control segment (scripts/worktree.mjs lines 514 and 656). Because legalOffRamps now include override-record at closed, the session hook at `operator override: off` also takes this route for a closed selected order instead of giving its decisions-file advisory. Product 07 §Operator recovery controls still states, byte-identical to the base, that override-record appends in any open phase and that with no open order (closed, withdrawn or none selected) the override and what it changed go to the order's decisions instead (lines 962 to 975), and its Declined line still lists retroactive events for closed orders (lines 977 and 978). No product document names the pending lane, although the row's own source names the decisions-file advisory this fix replaces. F2 (follow-up; class records routing; declared surfaces scripts/resume.mjs, scripts/lib/pending-overrides.mjs and scripts/worktree.mjs): override-record run from a linked worktree at a closed order writes the record into that checkout's lane and prints that the next worktree start carries it, but worktree start reads only main's lane, so the record is not carried; when that worktree closes, the close helper archives it under main's retained records, which are never merged into the active control. Main refused override-record at a closed order, so F2 is no regression of main's behavior and breaks no criterion.",
  "evidence": [
    "git diff HEAD -- docs/product has no hunk in §Operator recovery controls. git show HEAD:docs/product/07-execution-guide.md lines 961 and 976 carry the same any-open-phase and retroactive-events sentences as the subject's lines 963 and 978. A search of docs/product, docs/AI-HARNESS-SECURITY.md and README.md finds no statement of the pending lane or of override-record at a closed order.",
    "docs/planning/work-order-map.md, candidate 1 of the fork-observations pass recorded 2026-10-18: the hook's advisory sends the record to the order's tracked decisions file; the shape is a pending lane that override-record writes at a closed order and that the next worktree start carries.",
    "packages/skeleton/src/harness-host.ts recordOperatorOverride gives the decisions-file advisory only when legalOffRamps lacks override-record; scripts/resume.mjs legalOffRamps reads OFF_RAMP_PHASES, which now lists closed for override-record.",
    "F2 reproduction on a disposable scratch copy of the subject with no remote and a linked worktree of its own: node scripts/resume.mjs override-record --work-order WO-218 --bypassed release-close --effects probe-recovery with human actor flags, run from the linked checkout, exited 0 and printed that it recorded a pending OperatorOverrideRecorded for WO-218 under docs/control/local/pending-overrides and that the next worktree start carries it. The record existed in the linked checkout's lane, and main's lane did not exist. carryPendingOverrides is called only with mainPath (scripts/worktree.mjs lines 514 and 656). Product 03 says archived worktree state is never merged into main's active queue or local records.",
    "Every other criterion held under this verification's probes: 50 followups --show reads (34 settled, 13 declined, 3 deferred, each latest disposition after activation at 2026-10-23T13:49:39.138Z); two --touching pages with 16 matches, only the 3 listed deferred rows among this order's rows, each with its packet; base pending 162 at register revision 71a8dde6ca5afd7abaf013d84b9763598e9e18680ec1908985427b44c635e753, recomputed from an export of c670e628, and 167 now; meta --check exit 0; git diff --check clean; format:check clean; the complete review row and the document row at the subject identity, and the harness and meta suites run here, all passing; 20 recorded repair controls and criterion 8's four arms replayed in the scratch copy with their recorded exits."
  ],
  "rejected": [
    {
      "option": "Pass because npm run test:docs and npm run meta -- --check pass",
      "reason": "Criterion 6 asks for the write-back in place where a fix changed a product statement; neither check reads what the stale sentences say."
    },
    {
      "option": "Route F1 as a follow-up",
      "reason": "The stale statements contradict a settled row's shipped behavior and criterion 6 names this duty, so it is an unmet acceptance criterion."
    },
    {
      "option": "Write the product text in this verification",
      "reason": "A verifier never edits the subject it judges; the repair holds the rule below."
    }
  ],
  "followup": "WO-219's repair, inside its declared surfaces. F1 (blocking): write back product 07 §Operator recovery controls in place. The override-record bullet states that a closed order's record goes to the ignored pending lane under main's control root, that the next worktree start appends it to that order's segment and regenerates the projection, that the session hook takes the same route for a closed selected order, and that a withdrawn or unselected order still sends the override to the order's decisions. The Declined line no longer lists retroactive events for closed orders, and the text cites WO-219-D050. If product 03's ignored control-lane paragraph is meant to list the lane's contents, name the pending lane there too. Check with npm run test:docs and npm run meta -- --check. F2 (follow-up): override-record at a closed order writes its pending record into main's lane, or refuses outside main and prints main's command, so the printed carry promise holds; add a case run from a linked worktree under the resume or worktree suite.",
  "reopenWhen": "A repair writes back the closed-order override route in product 07, or the closed-order override-record admission is withdrawn. F2 reopens when a pending record written outside main is either carried or refused."
}
```

## WO-219-D075 — VER-001: planning receipt 052's criterion:2 reopening condition for WO-219 has occurred

```json
{
  "id": "WO-219-D075",
  "date": "2026-10-23",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Record that the reopening condition of planning receipt 2026-10-22-planning-5bb6c2ac729c3e47-052's criterion:2 known issue for WO-219 has occurred, independently of the repair: WO-219's first verification failed (WO-219-D074). The condition's other branch has not occurred: npm run meta -- --check reads elapsedPerCodeByte 47.999 against WO-217's 102.9. The failure is one missing product write-back under criterion 6. The paired controls the known issue credits held: this verification replayed 20 of the 109 recorded controls at their recorded exits. Route: planning.",
  "evidence": [
    "The verify briefing's receipt 052 known issue for criterion:2, with its Reopen when text: WO-219's first verification fails, or its recorded elapsedPerCodeByte exceeds WO-217's 102.9.",
    "WO-219-D074.",
    "npm run meta -- --check on 2026-10-23: seeking-the-wrong-goal reads elapsedPerCodeByte 47.999 (delta -64.614); process health reads first verification failed in 4 of the last 8 closed orders."
  ],
  "rejected": [
    {
      "option": "Leave it in the report only",
      "reason": "A reopening condition the record shows as occurred is recorded as a decision with a named follow-up for the planning pass, as WO-218-D056 did."
    },
    {
      "option": "Count the failure as a recurrence of WO-218's criterion 2 class",
      "reason": "WO-218 VER-001 failed on settled cases that passed at the base; this failure is a missing product write-back, and the replayed controls failed with their fixes reverted."
    }
  ],
  "followup": "Next planning pass: reopen receipt 052's criterion:2 known issue for WO-219 (docs/planning/cost-table.json, trap seeking-the-wrong-goal). The first verification failed on one product write-back rather than on paired controls. Decide whether a batch order's settled rows owe a per-row write-back check when a fix changes a product statement, and whether the batch's elapsed time per code byte needs a bound or a split.",
  "reopenWhen": "A planning pass disposes the reopened known issue, or another follow-up batch's first verification fails."
}
```

## WO-219-D076 — Repair the closed-order override write-back

```json
{
  "id": "WO-219-D076",
  "date": "2026-10-23",
  "dispatch": "resume: fix",
  "kind": "decision",
  "decision": "Correct product 07 Operator recovery controls and product 03 Corpus policy in place for VER-001 F1. The earlier criterion 6 met claim omitted row 41's changed post-close behavior. Closed overrides are pending records under main's configured control root; the next worktree start carries validated events into their original closed orders' segments in the new worktree and refreshes its projection before removing unchanged pending files. The session hook uses the same legal command for a selected closed order. Withdrawn and unselected orders retain the decisions route. The general four-route introduction now excludes the pending route from its immediate checkpoint/projection claim, and the Declined line preserves existing events without denying the newly admitted append.",
  "evidence": [
    "docs/verifications/WO-219/VER-001.md F1 and WO-219-D074 establish the missing write-back; the filed report is unchanged.",
    "WO-219-D050, scripts/resume.mjs override-record, scripts/lib/pending-overrides.mjs recordPendingOverride and carryPendingOverrides, scripts/worktree.mjs start and target start.",
    "packages/skeleton/src/harness-host.ts recordOperatorOverride uses legalOffRamps. The shared dependency-free packages/compiler/src/operator-control.mjs advisory also contained the same stale closed-to-decisions instruction; it now names the main pending route, capture prerequisite and the narrower decisions route. scripts/operator-control.mjs and generated hook fallbacks consume that advice.",
    "npm run publication:check after the product edits reported full heading coverage and two stale source locks; npm run sync owns their regeneration before the final gates."
  ],
  "rationale": "The product contract must describe the shipped lifecycle route and its failure handling. A documentation-only NoOp would preserve the false decisions-file instruction and leave criterion 6 unmet. The additional introduction correction closes the same documentation class beyond the report's quoted bullet.",
  "rejected": [
    {
      "option": "Withdraw closed-order override admission",
      "reason": "Step 15 and D050 explicitly require the pending route; removing it would undo an authorized deliverable."
    },
    {
      "option": "Edit the filed verification or its source decision to remove the failure",
      "reason": "The report correctly judges its recorded subject and remains immutable. The repair records new evidence."
    }
  ],
  "reopenWhen": "The pending route's location, carry transaction, admission phases or failure behavior changes."
}
```

## WO-219-D077 — Keep pending override recording in the checkout that start reads

```json
{
  "id": "WO-219-D077",
  "date": "2026-10-23",
  "dispatch": "resume: fix",
  "kind": "decision",
  "decision": "Repair VER-001 F2 inside the declared resume surface. A closed-order override command outside the main control-plane checkout must refuse before recording, preserve all supplied capture bytes and tracked control, and print a shell-quoted command selecting the same order in main. A capture remains local and the refusal names the same-path/same-hash prerequisite in main. Branch and detached linked worktrees receive the same rule. Main retains the pending route and worktree start retains its existing carry and malformed-lane behavior.",
  "evidence": [
    "docs/verifications/WO-219/VER-001.md F2 and WO-219-D074 reproduce the linked-checkout lane that start never reads.",
    "scripts/worktree.mjs passes mainPath to carryPendingOverrides at both start sites; scripts/lib/pending-overrides.mjs records in its supplied root.",
    "scripts/lib/git.mjs mainWorktree resolves the checked-out main branch; requireOperatorCapture requires a contained ignored capture under the selected root's intake.",
    "The actor-attested adjacent-0001 queue records the cause, scope, announcement and safe-boundary check-in before implementation. Revision 2 adds the same stale route in the shared fallback advisory and its emitted-hook fixture.",
    "docs/evidence/WO-219/repair-ver001-controls.json: the new routing fixture failed before the main-checkout refusal (branch command exit 0 instead of 1) and passed with it, including detached selection, capture preservation and execution of the printed remedy. The complete resume script exited 0. The advisory probe failed against the original source and passed against the repaired source."
  ],
  "rationale": "The carry promise is the invariant, not merely successful creation of a local file. The NoOp would strand the record until close archives it outside active control. Refusing with a usable remedy preserves one writer per worktree and requires no new cross-checkout write grant. Forwarding to main would need separate writer and capture handling, so it is not an equivalent in-scope alternative under the existing effect boundary.",
  "rejected": [
    {
      "option": "Silently write main's lane from a linked checkout",
      "reason": "That writes another worktree without its writer reservation and can rebind a relative capture to absent or different bytes."
    },
    {
      "option": "Read every worktree's pending lane during start or recover it from retained archives",
      "reason": "This expands the carry and ownership contract; archived worktree records explicitly never merge into active local state."
    }
  ],
  "reopenWhen": "A supported caller cannot follow the explicit main route, or an independently authorized cross-checkout writer and capture protocol replaces it."
}
```

## WO-219-D078 — Validate the repair and preserve its remaining planning boundary

```json
{
  "id": "WO-219-D078",
  "date": "2026-10-23",
  "dispatch": "resume: fix",
  "kind": "decision",
  "decision": "Keep the locally prepared v0.94.0 release and D005's component classifications. The closed-order route and its advice are repairs within that already prepared behavior. Settle D074's FUP-d0af6cc30bccf70d after the sensitive controls and complete review; retain D075's FUP-938f66ad9b65e086 for the next planning pass. Complete the handoff and document gate before recording repair-complete. The outcome matches D076 and D077's bounded scope, with no new cross-worktree writer or changed acceptance criterion.",
  "evidence": [
    "npm run release -- prepare --local exited 0 and retained v0.94.0. npm run sync exited 0: runtime, harness, authority evidence and publication were stale and regenerated; artifact-identity, verification, feedback and harness evidence checks remained current. docs/evidence/current.json now selects WO-219 authority 005 and artifact-identity, verification and feedback 001.",
    "New inputs read for regeneration judgment: scripts/lib/evidence-sources.mjs registers packages/compiler/src/operator-control.mjs; packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS does not contain any of the repair's four source/fixture edits. Product 07's planning requirements owe the deterministic re-mint of each edition whose check stales. scripts/verification-evidence.mjs compares deterministic regenerated output. No judged feedback behavior changed and no live feedback episode is owed.",
    "npm run publication:check after sync passed full coverage of 255/255 headings and 29/45 source sections. Product 03 and 07 source locks are current.",
    "docs/evidence/WO-219/repair-ver001-controls.json records the routing negative/positive and advisory old/repaired controls. docs/evidence/WO-219/repair-ver001-gate.json records npm test -- --review exit 0 at 2026-10-23T22:06:34.512Z, duration 1668026 ms, 42 required suites, 108 executed task rows, zero failed or unrun tasks and unchanged code/build identities.",
    "docs/evidence/WO-219/repair-ver001-followups.json rechecks all fifty exact show commands after the repair disposition: 34 settled, 13 declined, three deferred, all unchanged. Pending count moved from implementation's 167 to verification's 169 and then to 168 after D074 was settled. All three current touching pages equal the baseline reader on the same register and changed-file inputs, with 17 matches including D075's planning row. The comparison retains its first stale-input attempt and corrected current-input run.",
    "A sequential bounded inventoryMaterial probe finished at 2026-10-23T22:08:48.249Z with exit 0 and an empty inventory. The repair made no manual scratch clone; fixture repositories are cleaned by their owners. No new worker was spawned during repair. The implementation-ready reviews remain the six-worker historical record, not a new repair review claim."
  ],
  "rationale": "The complete passing row binds the repaired code; the final document gate will bind the finished handoff. Reusing the old implementation row would judge different code. A second release bump would double-count the same unreleased behavior. Regenerating only stale deterministic outputs preserves current identical editions. Settling the planning observation would exceed this repair's evidence and authority.",
  "rejected": [
    {
      "option": "NoOp on verification's D074 follow-up after repairing its two findings",
      "reason": "That would leave an already executed repair recorded as pending. The canonical follow-up disposition now cites the repair decisions, controls and passing complete gate."
    },
    {
      "option": "Re-mint every evidence edition or run a live feedback episode solely because a registered source changed",
      "reason": "The checked product rule keys deterministic editions to stale output and live feedback to judged behavior. Sync established only authority output staleness here; the repair edits no judged feedback source."
    },
    {
      "option": "Treat the repaired write-back as disposal of D075's reopened planning question",
      "reason": "The first verification failure remains historical fact. Its question about per-row write-back checks and batch cost belongs to planning, and the new register row remains named in README and handoff."
    }
  ],
  "reopenWhen": "The final document gate fails, a registered edition becomes stale, judged feedback behavior changes, or independent verification finds a remaining failure of the main pending-route contract."
}
```

## WO-219-D079 — VER-002: pass; a closed-order hook receipt still routes effects to decisions

```json
{
  "id": "WO-219-D079",
  "date": "2026-10-23",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Pass VER-002 at code identity effd942bf8351214bbefe46b32655ddc03e4981f7cb3d6e6e0aaaf0477faf940. Criteria 1 to 8 are met, and VER-001 F1 and F2 are repaired: product 07 §Operator recovery controls and product 03 now state the closed-order pending route, and a closed-order override-record outside main refuses before writing and prints a quoted main command that works. F4 (follow-up; class post-close hook guidance; declared surface packages/skeleton/src/harness-host.ts recordOperatorOverride): at a closed selected order the session hook records the pending event, but its success receipt reads only 'DotLn: recorded OperatorOverrideRecorded'. The receipt matches lines that start with 'Recorded OperatorOverrideRecorded', and the closed route prints 'Recorded pending OperatorOverrideRecorded ... the next worktree start carries it'. The hook's context then tells the role to record what the override changed in the order's decisions. That is the closed order's tracked decisions file, which row 41's source says clean main cannot carry and which product 07 now reserves for withdrawn or unselected orders. F4 breaks no criterion: no criterion judges the hook's post-record text, and product 07 is silent on where effects go after a successful hook record. It is no regression either, because main's advisory gave a closed order the same decisions instruction. It does meet the reopening condition of D074's settled row (verification reproduces missing or contradictory post-close override guidance), so this decision reopens D074.",
  "evidence": [
    "F4 reproduction, bounded, in a disposable no-remote copy of the subject tree 99af05647661093b87ccb0a8b8f2a0d009c1c78a with the pinned runtime .runtime/harness/97f20343943fb571 and its built dist directories. WO-219's segment was set aside in the copy so that status --json selected a closed order (WO-009, closed, legalOffRamps correct and override-record). The real emitted .claude/hooks/session.mjs received the UserPromptSubmit prompts 'operator override: probe the closed-order receipt' and then 'operator override: off'. The exit wrote docs/control/local/pending-overrides/WO-009-83407051-2a64-40a5-8cbb-606229888ff6.json and returned systemMessage '... DotLn: recorded OperatorOverrideRecorded' with additionalContext 'DotLn: recorded OperatorOverrideRecorded Its effects read \"unobserved\": record what the override changed in the order's decisions.'",
    "packages/skeleton/src/harness-host.ts recordOperatorOverride: the receipt finder (line.startsWith(\"Recorded OperatorOverrideRecorded\")) and the constant additionalContext; scripts/resume.mjs override-record prints 'Recorded pending OperatorOverrideRecorded for <order> in <lane path>; the next worktree start carries it into the reviewed change.' at a closed order.",
    "Row 41's source (docs/planning/work-order-map.md, candidate 1 of the fork-observations pass recorded 2026-10-18): the hook's advisory sent the record to the order's tracked decisions file, which clean main cannot carry. Product 07 §Operator recovery controls after D076: for a withdrawn or unselected order the override and what it changed go to the order's decisions instead.",
    "Main's behavior for a closed selected order: recordOperatorOverride returned the advisory 'no selected open order records it (phase closed); record the override and what it changed in the order's decisions instead', because override-record was not legal at closed (VER-001 F1).",
    "Every criterion held under VER-002's own probes, all recorded in docs/verifications/WO-219/VER-002.md. The F2 control replayed in the copy at 0 with the fix and 1 with only the refusal block reverted; the reverted bytes equal the recorded beforeSha256 ac35d964. Row 41's closed-admission control and row 3's verification-allocation control, the two recorded controls that revert scripts/resume.mjs, each replayed at 0 and 1. Criterion 8's four arms replayed at 0, 0, 0 and 1 with the recorded fixture and runtime hashes. 50 followups --show reads gave 34 settled, 13 declined and 3 deferred, all after activation. The three --touching pages gave 17 matches at pending 168. The harness and meta suites passed 8 of 8 each, and meta --check, format:check and git diff --check passed. The complete npm test row at 22:06:34.512Z and the document row at 22:14:25.948Z stand at this code identity."
  ],
  "rejected": [
    {
      "option": "Fail VER-002 on F4",
      "reason": "Product 07 §Verification review and attack binds the verdict to the criteria. A defect in the declared surfaces that breaks no criterion and no behavior main had takes the follow-up route, and F4 breaks neither."
    },
    {
      "option": "Board F4 as a new follow-up row",
      "reason": "D074's row was settled by the repair with this exact reopening condition. A reopens observation puts the reproduced trigger on that row, so the post-close guidance class keeps one row rather than two."
    },
    {
      "option": "Leave F4 in the report only",
      "reason": "A defect met and not fixed is recorded as a decision with its follow-up; the report cites this decision."
    }
  ],
  "reopens": {
    "decisionId": "WO-219-D074",
    "observation": "VER-002 reproduced post-close override guidance that is missing and contradictory at a closed selected order (F4 in WO-219-D079): the session hook's success receipt omits that the record is pending and that the next worktree start carries it, and its context sends what the override changed to the closed order's tracked decisions file. Rule a repair must hold: at a closed selected order, the hook's receipt names the pending record and its carry, and its effects instruction names a route a pull request can carry. One such route is a further override-record --effects run from main; the closed order's tracked decisions file is never named. Open orders keep their decisions instruction. The doc comment above recordOperatorOverride stops saying 'selected open order'. Add a case at a closed selected order under harness-fixtures or harness."
  },
  "reopenWhen": "A repair changes the hook's closed-order receipt and effects instruction under the rule above, or the closed-order hook route is withdrawn."
}
```

## WO-219-D080

<!-- integration refs/dotln/checkpoint/WO-219/10 -->

```json
{
  "id": "WO-219-D080",
  "date": "2026-10-23",
  "dispatch": "resume: final review; worktree integrate WO-219",
  "decision": "Integration took in nothing: local main, the main the helper fetched and the branch base are all c670e6288ecb221ef2416cef06f920006866bc5d, the branch carries no commit of its own, no authored conflict arose and no projection was resolved by hand. Carried-forward claims, judged in FINAL-001: the repair's complete review row at code identity effd942bf8351214bbefe46b32655ddc03e4981f7cb3d6e6e0aaaf0477faf940 stood for the integrated tree, because the identity probe read the same value after the merge; this review then repaired VER-002's F4 (D081), which moved the identity to 4f4c7e501ef83c20ab4ea9b8e02efc5a64ae6f2a8946b6d458ea9a7dc347b9f0, and ran a fresh complete review there, so the earlier row is superseded rather than consumed; the amended order (D061, criterion 8, bound to receipt 052) is the order VER-002 judged and the order this review judges; application target v0.94.0 remains current over the v0.93.0 baseline with no component-version collision (kernel 0.7.0, compiler 0.31.0, skeleton 0.67.0, console 0.4.7 are this order's own bumps, D005, and main has published no newer version); the selected editions (authority at WO-219 revision 007 after this review's sync, artifact identity, verification and feedback at revision 001) and the sibling registry's v0.93.0 row are unchanged evidence inputs, the sibling receipt of 2026-10-23T13:48:19Z being release-close bookkeeping carried in at activation and present in no commit of main. The affected checks the helper printed pass at the reviewed tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-219/10",
    "base c670e6288ecb221ef2416cef06f920006866bc5d",
    "upstream c670e6288ecb221ef2416cef06f920006866bc5d",
    "release preparation: WO-219 target v0.94.0 remains current. Files changed: docs/evidence/WO-219/meta.json. Meter snapshot: docs/evidence/WO-219/meta.json, 4070 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity at the integrated tree, before this review's repair: effd942bf8351214bbefe46b32655ddc03e4981f7cb3d6e6e0aaaf0477faf940, the identity of the repair's passing complete review row recorded 2026-10-23T22:06:34.512Z.",
    "gateCodeIdentity after the F4 repair (D081): 4f4c7e501ef83c20ab4ea9b8e02efc5a64ae6f2a8946b6d458ea9a7dc347b9f0; the fresh npm test -- --review row recorded 2026-10-23T23:23:08.092Z at that identity, 42 required suites, 108 fresh tasks, exit 0, 1576.501 s.",
    "Affected checks at the reviewed tree, each exit 0: npm run publication:check (29 and 45 linked source sections match, both editions current); node scripts/harness.mjs check (35 surfaces); npm run release -- check-surfaces --local (six package publish refusals as expected); npm run meta -- --check (the two boarded cold-start breaches, no reopen candidate); git diff --check; npm run format:check; node scripts/comment-labels.mjs (589 code files, 0 failures)."
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

Integration date: 2026-10-23. Original base: `c670e6288ecb221ef2416cef06f920006866bc5d`.
Fetched main: `c670e6288ecb221ef2416cef06f920006866bc5d`. Checkpoint: `refs/dotln/checkpoint/WO-219/10`.
Named stash retained: `069450f6c96e429e3ae3dc1f3d1dfd58e6a2b19f` (WO-219 integrate 2026-10-23).
Resolved projections: none.
Release preparation: WO-219 target v0.94.0 remains current. Files changed: docs/evidence/WO-219/meta.json. Meter snapshot: docs/evidence/WO-219/meta.json, 4070 bytes. Tag observation: local snapshot only.
Carried-forward claims: judged in [FINAL-001](../../final-reviews/WO-219/FINAL-001.md); the repair's complete review row at code identity `effd942bf8351214bbefe46b32655ddc03e4981f7cb3d6e6e0aaaf0477faf940` stood for the integrated tree, this review's F4 repair (D081) moved the identity to `4f4c7e501ef83c20ab4ea9b8e02efc5a64ae6f2a8946b6d458ea9a7dc347b9f0` and a fresh complete review passed there, the amended order is the order judged, v0.94.0 remains current with no component-version collision, and the selected editions and the sibling registry row are unchanged evidence inputs. Acceptance: pass, recorded by `final-review-result`.
Authored conflicts observed: none.
Affected checks: run at the reviewed tree by the final review, each exit 0 (publication check with both editions current, harness check 35 surfaces, release surfaces, meta check with the two boarded breaches, whitespace, formatting and the comment-label check).

## WO-219-D081 — Repair the closed-order hook receipt and effects route at final review

```json
{
  "id": "WO-219-D081",
  "date": "2026-10-23",
  "dispatch": "resume: final review",
  "decision": "Repair VER-002 F4 in this review, inside the order's declared surface packages/skeleton/src/harness-host.ts, under the rule WO-219-D079 recorded on WO-219-D074's reopened row. At a closed selected order the session hook's receipt now carries the lifecycle's own line, 'Recorded pending OperatorOverrideRecorded for <order> in <lane file>; the next worktree start carries it into the reviewed change', and its context tells the role to record what the override changed with a further npm run resume -- override-record run from main's checkout naming that order, which the next worktree start carries beside the first record; it never names the closed order's tracked decisions file. Open orders keep their decisions instruction, and the function's doc comment no longer says 'selected open order'. One harness-fixtures case drives the real emitted session hook at a closed selected order on main and asserts the receipt, the context, the unchanged control segment and the one pending record with its capture. Settle FUP-d0af6cc30bccf70d again on this decision. FINAL-001 lists no finding of its own: F4 is verification's finding, repaired here as product 07 admits, with its fix and passing evidence in the report's prose.",
  "evidence": [
    "docs/verifications/WO-219/VER-002.md F4 and WO-219-D079's reopens object: the receipt finder matched only lines starting 'Recorded OperatorOverrideRecorded', so the closed route's 'Recorded pending …' line fell through to the generic receipt, and the constant context sent the effects to the order's decisions.",
    "packages/skeleton/src/harness-host.ts recordOperatorOverride: the receipt matcher admits the pending line, the effects instruction branches on the selected order's phase, and the doc comment names both routes. scripts/resume.mjs override-record prints the pending line at a closed order from main (WO-219-D050, D077).",
    "docs/evidence/WO-219/final-review-controls.json: the new case passed with the fix (3 of 3 with the two WO-158 open-order cases) and failed with only the hook source restored to refs/dotln/checkpoint/WO-219/10 and rebuilt, on the old fallback receipt; restored, it passed again.",
    "The doc comment was rephrased after the control to lead with what the hook does, because the comment-label check refuses a comment line that leads with an order identifier and the edited line's fingerprint was no longer in docs/control/comment-baseline.json; node scripts/comment-labels.mjs --write removed that one stale fingerprint and admitted none. npm run sync then regenerated the harness bundle and the authority edition (WO-219 revision 007); node scripts/harness.mjs check, npm run format:check, git diff --check and the comment-label check pass.",
    "The complete review row npm test -- --review at code identity 4f4c7e501ef83c20ab4ea9b8e02efc5a64ae6f2a8946b6d458ea9a7dc347b9f0 (recorded 2026-10-23T23:23:08.092Z, 42 required suites, exit 0) covers the harness-fixtures suite with the new case; npm test -- --only harness and --only meta were rerun under the bounded wrapper at that identity.",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS does not list harness-host.ts, so no live feedback episode is owed; scripts/lib/evidence-sources.mjs registers it for the authority, feedback and harness editions, whose deterministic re-mint sync performed and whose checks pass.",
    "FUP-589642d0e0c714c8 (WO-226-D021) names registeredTargetNearMiss and releaseCloseAdmission in the same file; this repair touches neither, so that row keeps its disposition."
  ],
  "rejected": [
    {
      "option": "Leave F4 boarded for the next order that edits harness-host.ts",
      "reason": "The register this order was cut from shows that route delivering none of the 40 rows listed at filing; the defect is this order's own, in its declared surface, with a recorded repair rule, and the repair is small."
    },
    {
      "option": "Route the effects to the closed order's decisions file with a warning",
      "reason": "Row 41's source and product 07 after D076 reserve the decisions route for withdrawn or unselected orders; a closed order's tracked file is what clean main cannot carry."
    },
    {
      "option": "List the repaired F4 as this review's escape in the findings block",
      "reason": "Verification found it; counting it as an escape would misstate the measure that final reviews report."
    }
  ],
  "reopenWhen": "Verification or a later review reproduces missing or contradictory post-close override guidance in the hook, the shared advisory or product 07, or the closed-order hook route is withdrawn."
}
```

## WO-219-D082 — Leave the matched register rows and record the review observations

```json
{
  "id": "WO-219-D082",
  "date": "2026-10-23",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all eight criteria at code identity 4f4c7e501ef83c20ab4ea9b8e02efc5a64ae6f2a8946b6d458ea9a7dc347b9f0 and disposes one register row, FUP-d0af6cc30bccf70d, settled on D081 after the F4 repair. The other matched rows keep their dispositions: the three operator packets (FUP-16a4af39c710459b, FUP-a6cf30a8b7bc4a83, FUP-b3454d6ce3594ef3) wait for the operator's word at the pull request with their safe defaults selected, and the reviewer records no choice for the operator; D008's and D009's observations (FUP-d2646e66a2dfdb40, FUP-e08668268dea62b1) and D075's planning row (FUP-938f66ad9b65e086) stand as their decisions record, the receipt's second clause not having occurred (elapsedPerCodeByte 61.523 against 102.9); FUP-524a82332e21e127's two triggers did not occur (one criterion failed, not more than a third of the rows; implementation elapsed about 6.1 hours against 20); and the eleven outside-batch rows D062 and D072 judged are unchanged by this review, FUP-589642d0e0c714c8 among them because the F4 repair touches recordOperatorOverride alone. Two authority editions were minted by this review's syncs (006 by the run that stopped at the comment-label check, 007 selected); both are retained. The ignored local lane keeps the executor's probe scripts, which are not part of the reviewed change.",
  "evidence": [
    "npm run plan -- followups --touching --work-order WO-219 at register revision a9b667c77f0057d3d3cce386eb21d6d313a8deb5ddf8f3c87c6947b306c7ff7a: 18 of 169 pending rows matched before the settlement, one of them needs-review (FUP-d0af6cc30bccf70d at source revision 2); 17 of 168 after it (register revision 514a8c85c9d151c0dab55eadac1112357ca6855c0f857bf9fdd70eb12133ba23).",
    "docs/evidence/WO-219/meta.json at the integrated tree: elapsedPerCodeByte 61.52329611994905, implementation elapsed 22066031 ms; docs/control/orders/WO-219.jsonl: WorkOrderActivated 2026-10-23T13:49:39.138Z, VerificationCompleted (fail) 21:10:00.788Z on criterion 6 alone.",
    "git diff HEAD -- packages/skeleton/src/harness-host.ts contains no hunk in registeredTargetNearMiss or releaseCloseAdmission; this review's hunks are the recordOperatorOverride doc comment, receipt matcher and effects instruction.",
    "docs/evidence/WO-219/authority/ holds editions 001 to 007; docs/evidence/current.json selects 007 for authority and 001 for artifact identity, verification and feedback.",
    "docs/evidence/WO-219/operator-packets.json: safeDefaultsSelected true, noResponseRequested true; each packet's reopenWhen names the review of the WO-219 pull request."
  ],
  "rejected": [
    {
      "option": "Decide a packet in the operator's place at final review",
      "reason": "Each packet names a choice the order reserved to the operator; the reviewer surfaces them in the pull request with the selected default and records no choice."
    },
    {
      "option": "Dispose FUP-938f66ad9b65e086 as not occurred",
      "reason": "The first clause occurred (VER-001 failed); the row is the planning pass's question about per-row write-back checks and a batch cost bound, which this review cannot answer."
    },
    {
      "option": "Remove the unselected authority edition 006",
      "reason": "Editions are retained, not hidden; the executor's 001 to 004 stand beside 005 the same way."
    }
  ],
  "reopenWhen": "The operator's word at the pull request chooses a packet's route; the next planning pass disposes FUP-938f66ad9b65e086; or a later order opens one of the eleven outside-batch seams by its own condition."
}
```
