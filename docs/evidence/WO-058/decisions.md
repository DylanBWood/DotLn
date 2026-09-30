# WO-058 decisions

## WO-058-D001

```json
{
  "id": "WO-058-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Add visual and network claim types and an optional closed witness union on VerificationEvidence. Every witness carries a sha256 contentHash; screenshots also repeat and validate their outer criterionId, snapshots name their content hash, network traces carry request method/url/bodyHash and response status/bodyHash, and console captures carry bounded level/message entries. A capture containing an error must have outcome fail. Admit visual passes only with a cited passing screenshot, network passes only with a cited passing trace, and refuse passes on a required check with a bound console error even when omitted. Keep the matrix and worktree-snapshot profile unchanged.",
  "evidence": [
    "WO-058 Design and criteria 1–4; copySubject currently positively selects legacy evidence and reserves hostTest; parseEvidenceResult owns unsupported-pass and contradictory-witness admission; reactor.ts maps only admitted evaluations to row status",
    "Product 02 Independent verification v1; compiler verification.ts and skeleton verification-protocol.ts and their existing tests were read before implementation",
    "At the selected base product 02 is 148729 bytes against ceiling 150611; product 10 is 25744 against 25825. Consolidate the existing WO-010 paragraph in product 10 rather than add a dated paragraph or raise its ceiling."
  ],
  "alternatives": [
    "Optional typed witness payload with existing evaluation admission",
    "A separate witness-to-verdict fold",
    "Free-form witness kinds",
    "Scenario grouping in the capsule",
    "NoOp"
  ],
  "rejected": [
    {
      "option": "Separate fold",
      "reason": "Would create a second acceptance path and violate the host-admitted-verifier contract."
    },
    {
      "option": "Free-form witness kinds",
      "reason": "Cannot establish the screenshot and trace requirements or a path-specific unknown-kind refusal."
    },
    {
      "option": "Scenario field",
      "reason": "One capture per covered criterion expresses the bounded two-criterion fixture without changing existing capsule grouping."
    },
    {
      "option": "NoOp",
      "reason": "Leaves visual and network evidence narrative, blocking WO-059 and WO-061."
    }
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "A typed evidence interface removes manual interpretation of screenshots and requests and enables the following browser-evidence producer and visual consumer.",
    "traps": {
      "policyResistance": "Use existing admission; retain legacy behavior and the behavior-only snapshot profile.",
      "tragedyOfTheCommons": "One writer, no delegated coding agents or browser dependency; settle judged source before the required live audit.",
      "driftToLowPerformance": "Positive and negative fixtures assert actual matrix statuses and exact refusal reasons.",
      "escalation": "No new gate or verdict source; use the existing required review and document gates.",
      "successToTheSuccessful": "Reject the competing fold for its authority conflict, rather than incumbent investment.",
      "shiftingTheBurden": "Typed admission removes recurring operator rescue of unsupported visual/network passes.",
      "ruleBeating": "A cited passing screenshot/trace is mandatory; omitted console errors still prevent acceptance.",
      "seekingTheWrongGoal": "Measure admitted outcomes and unchanged historical replay, not receipt volume."
    },
    "naiveInterventionism": "Preserve compiler purity, closed new payloads, positive selection elsewhere, exact absent-field bytes, source labels and unavailable-evidence behavior. Consumers use the existing compiler and result schema. Optional payloads and additive enums are reversible; browser-free fixtures are the smallest useful probe.",
    "noOp": "The gap remains and the dependent producer has no witness contract."
  },
  "reopenWhen": "A producer cannot express a required capture in the bounded shapes, historical replay changes beyond release labels, or an adapter needs explicit scenario grouping."
}
```

## WO-058-D002

```json
{
  "id": "WO-058-D002",
  "kind": "experiment",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep focused compiler/admission fixtures before one final evidence refresh and the required full review gate; no gate reduction or performance improvement is claimed.",
  "question": "Can focused browser-free fixtures establish the contract before paying evidence regeneration and the full gate?",
  "alternatives": [
    "Focused compiler and pure reactor fixtures, then final evidence refresh and required gate",
    "Run the full gate while the evidence editions are known stale",
    "Reuse the subprocess/Git demo for each new admission case"
  ],
  "observation": "The existing four compiler verification tests pass in 0.08 real seconds (/usr/bin/time), and the reactor exposes a pure event fold. New admission cases need no subprocess, Git repository or browser. An early full gate would still owe current evidence editions; it cannot replace the final required gate.",
  "evidence": [
    "packages/compiler/test/verification.test.ts; packages/skeleton/src/reactor.ts verification branch; baseline node --test: 4 passed, zero failures; /usr/bin/time real 0.08"
  ],
  "rejected": [
    { "option": "An early full gate as a substitute for final verification", "reason": "Known-stale editions still require regeneration and the work order explicitly requires the final review gate." },
    { "option": "Subprocess/Git setup for every witness case", "reason": "The admission and matrix claims can be exercised through the pure reactor; the unchanged historical suites retain their real-host coverage." }
  ],
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 95,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p node --test --test-reporter=tap packages/compiler/dist/test/verification.test.js",
      "read existing reactor, release procedure and decision format"
    ],
    "source": "elapsed wall clock from probe preparation through receipt construction; /usr/bin/time for the executed test; token counter unavailable"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "focused fixtures, deterministic re-mints, one live self-host episode, npm test -- --review, npm run test:docs"
    ],
    "summary": "Keep current test workflow; no savings against equivalent complete outcomes measured."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "reopenWhen": "A cheaper workflow establishes the same complete acceptance and historical replay evidence."
}
```

## WO-058-D003

```json
{
  "id": "WO-058-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.58.0, the next minor above the observed release baseline v0.57.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.57.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-058-visual-and-network-claim-types.md"
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

## WO-058-D004

```json
{
  "id": "WO-058-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Retain verification-v1 and accepted-result version 1. Release the compiler as 0.21.0 and skeleton as 0.47.0, both compatible minor extensions, with exact workspace pins. The kernel and console sources and all pre-existing verification tests remain unchanged. Consolidate product 10's existing WO-010 paragraph and amend product 02 in place.",
  "evidence": [
    "Focused transcript witness-fixtures.tap: 13 passed, zero failures; optional witness absence preserves legacy subject bytes",
    "The unchanged skeleton verification and verification-worktree suites: 35 passed, zero failures, zero skips; recorded WO-010 and WO-011 streams replay to complete; WO-154's earlier-label capsule and drift tests pass",
    "release check-surfaces --local: v0.58.0 above v0.57.0; compiler/skeleton changed and bumped; kernel/console source unchanged; all exact dependency pins pass",
    "Measured product 02 148729 -> 149450 (+721 <= 800), ceiling 150611; product 10 25744 -> 25665 (-79 <= 200), ceiling 25825; publication check passes 253/253 headings and both source locks",
    "git diff names no kernel source, reactor.ts, console source or pre-existing verification test changes"
  ],
  "rejected": [
    {
      "option": "verification-v2",
      "reason": "No recorded capsule or tested historical stream changes its lowering; the optional member emits no bytes when absent."
    },
    {
      "option": "Patch releases",
      "reason": "Two claim types, five witness kinds and three admission rules are additive capability."
    },
    {
      "option": "Raise document ceilings",
      "reason": "The in-place consolidation meets both bounded write-back allowances and existing ceilings."
    }
  ],
  "goalAlignment": "D001's comparison holds. Historical replay preserves existing functions and prevents rule beating by renamed compatibility. The source interface enables WO-059/061; neither a kernel change nor a new verdict source is needed.",
  "reopenWhen": "The full review gate finds any historical lowering/replay drift, or a later consumer needs a non-additive witness migration."
}
```

## WO-058-D005

```json
{
  "id": "WO-058-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Refresh the installed harness deterministically and select new immutable WO-058 revision 001 authority, artifact-identity, verification and feedback editions. Run one read-only live feedback self-host episode after the last judged source edit on Codex gpt-6.1-sol at max, then pin the console self-host fixture to that edition.",
  "evidence": [
    "WO-058 criterion 6; evidence-sources.mjs registers both changed contract files in each evidence suite and feedback-audit.ts judges them",
    "harness emit completed with 31 generated surfaces; authority --write completed with 34 bundle comparisons; artifact --write recorded four files preserving the semantic hash and frozen oracle; verification --write recorded four files with planted defect/repair/staleness/replay; feedback --write recorded ten passing regressions and ten removal failures",
    "Source and test diff read before live launch; all manifest/lock release edits precede the live audit",
    "Root usage before launch reports zero observed subagents with cap 20 and unknown unobserved remainder. Plan: one read-only verifier leaf through the work order's existing transport; tools disabled; no delegated coding agents or descendants."
  ],
  "rejected": [
    {
      "option": "Carry the prior live audit",
      "reason": "Judged behavior source changed, so a label-only carry cannot establish the new source."
    },
    {
      "option": "Rewrite prior editions",
      "reason": "They are immutable historical observations."
    },
    {
      "option": "Launch before contract and release edits settle",
      "reason": "A later judged-source edit would require another live episode."
    }
  ],
  "goalAlignment": "Account for the shared paid verifier and preserve its source binding. No additional gate or worker fleet is introduced; the live audit is an explicit order obligation, not evidence of visual browser behavior.",
  "reopenWhen": "A judged source changes after this episode, or any current edition check refuses its recorded subject."
}
```

## WO-058-D006

```json
{
  "id": "WO-058-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep the eight existing textual follow-up matches on their recorded routes; none authorizes widening WO-058. The final reviewer judges and disposes the existing identifiers. No new adjacent item is diagnosed or queued.",
  "evidence": [
    "npm run plan -- followups --touching: eight matches; npm run adjacent -- list: revision 0, no items",
    "FUP-005a8af5234cb3f3's validator-kit condition requires touching two protocol files; this order edits verification-protocol.ts only",
    "FUP-c31c7bcab9270f49 / WO-157 D024 was read: the current schema already has zero findings without failing witnesses, nonempty bounded finding lists, bounded strings and surface enums. The unchanged WO-157 item-16 test passes. Its current comment leaves control characters with admission; no broader schema completeness claim is made.",
    "Other matches are on generated meter/control outputs, the release README line, the new authority edition or product sections outside this order's edited subsection."
  ],
  "existingFollowups": [
    {
      "id": "FUP-b7a66e7a4fa7ad20",
      "observation": "Release collision/history hardening; this order consumes release prepare, edits no implementation."
    },
    {
      "id": "FUP-005a8af5234cb3f3",
      "observation": "Protocol validator kit; only one protocol touched, so its two-file reopening condition is not met."
    },
    {
      "id": "FUP-50cda1c03ecd8ea8",
      "observation": "Usage-proof digest matching; only generated meta.json matches, no prune writer edit."
    },
    {
      "id": "FUP-71a27b368d93f135",
      "observation": "Path-free source-worker test; no source-worker profile or named-test launch change."
    },
    {
      "id": "FUP-acfe4bfda716d8fb",
      "observation": "RecordCorrected usage attribution; only generated current.md matches, no attribution logic change."
    },
    {
      "id": "FUP-adf6621e7f958dd8",
      "observation": "Authority evidence deduplication; no evidence script or reference contract edit."
    },
    {
      "id": "FUP-c31c7bcab9270f49",
      "observation": "Current bounded schema tightening and existing test pass; leave historical follow-up disposition to final review."
    },
    {
      "id": "FUP-fd05316b6030ef73",
      "observation": "Standing writer prose; this order edits the verification subsection, not the writer text."
    }
  ],
  "rejected": [
    {
      "option": "Expand this order into validator consolidation, publication machinery or usage attribution",
      "reason": "No diagnosed bounded defect in those untouched implementations; the rows' explicit routes remain available."
    }
  ],
  "reopenWhen": "A failing case at an edited seam reproduces one of these debts, or the operator expands this order."
}
```

## WO-058-D007

```json
{
  "id": "WO-058-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next; same-day correction",
  "decision": "Stop the premature harness-evidence runs through the canonical gate-stop command, preserve all work, finish report and edition inputs, and run the order's explicit npm test -- --review gate with stable inputs.",
  "misread": "I treated npm run harness -- evidence as an isolated harness check and then treated node scripts/harness.mjs evidence without flags as a status read. Both launch npm test; the first was live while decisions and evidence pins were still being completed, and the second started another run.",
  "meant": "Harness evidence is a full gate wrapper; evidence --wait is the read/wait interface, and gate inputs must stay unchanged while a gate runs.",
  "changed": "Read scripts/harness-entry.mjs and scripts/harness.mjs's evidence branch. Ran node scripts/harness.mjs evidence --stop, which stopped this worktree's active runs and returned active: [] with no check recorded. Neither interrupted run is claimed as evidence. No source or recorded live episode was discarded.",
  "evidence": [
    "scripts/harness-entry.mjs begins a gate before build and invokes scripts/harness.mjs; its evidence branch invokes npm test",
    "gate-stop readback at 2026-09-30T16:57:43.932Z: all requested worktree runs stopped; active []; no check recorded",
    "The first partial skeleton output included a feedback-edition assertion while the replacement was still unrecorded; it is an interrupted observation, not a completed verdict."
  ],
  "rejected": [
    {
      "option": "Treat completed subtests in an interrupted changing-input run as the required pass",
      "reason": "No completed passing gate row exists for it."
    }
  ],
  "reopenWhen": "Any gate input needs another write during the final run; stop it before that write and rerun after the inputs settle."
}
```

## WO-058-D008

```json
{
  "id": "WO-058-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Record the completed live feedback episode into WO-058 feedback-001 and pin the console self-host case to it. Keep the visual/network evidence claim limited to the browser-free fixtures.",
  "evidence": [
    ".runtime/wo058-feedback-001/verifier/events.jsonl WorkerAttemptStarted: transport codex-cli-exec, CLI 0.159.2, model gpt-6.1-sol, effort max; one recorded attempt",
    "Live verifier matrix phase complete; AC-causal-fixtures and AC-context verified; 76 events; event-span elapsed 67373 ms",
    "feedback-evidence --record-selfhost resolved references byte-for-byte: projected 81052 bytes from the 2272170-byte stream, with pins for package-lock.json, packages/skeleton/package.json and packages/compiler/src/artifact-identity.ts",
    "feedback-evidence --check: live audit judged current source, ten passing regressions and ten removal failures; 1192 fewer matched instruction bytes",
    "console-fixtures --record-current-selfhost recorded JSON, terminal and HTML for the new selected edition"
  ],
  "configuration": {
    "harness": "codex-cli",
    "harnessVersion": "0.159.2",
    "model": "gpt-6.1-sol",
    "effort": "max",
    "transport": "codex-cli-exec",
    "store": ".runtime/wo058-feedback-001",
    "edition": "docs/evidence/WO-058/feedback-001",
    "attempts": 1,
    "eventSpanMs": 67373
  },
  "rejected": [
    {
      "option": "Claim this live feedback audit is browser evidence",
      "reason": "Its subject is the feedback compiler; visual/network admission is established by the separate declared fixtures."
    }
  ],
  "goalAlignment": "The required current-source live judgment completed in one attempt after the final judged-source edit. D005's one-worker plan held; no root coding delegation was used. The existing interface and reference-edition format preserve historical bytes.",
  "reopenWhen": "A judged source changes or the edition no longer resolves to the recorded live subject."
}
```

## WO-058-D009

```json
{
  "id": "WO-058-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next; executor handoff",
  "decision": "Hand off the complete bounded deliverable with all seven criteria met on executor evidence. The final complete review gate passes at the current code identity; the document gate passes and completion rechecks it inline after final report edits. Retain the interrupted gate history in D007 and the existing follow-up routes in D006.",
  "evidence": [
    "npm test -- --review exited 0: 34 suites passed, 0 failed, 405.96 s, 78 fresh tasks; authority, artifact-identity, verification, feedback and harness checks all pass",
    "npm run test:docs exited 0: 23 passed, 0 failed, 15.88 s, 23 fresh tasks; canonical rows copied to gate-records.json and bounded summaries to review-gate.txt/doc-gate.txt",
    "Focused fixtures: 13 passed; unchanged verification/snapshot suites: 35 passed; historical recorded streams remain replayable and frozen artifact evidence is unchanged",
    "Final current-source live feedback edition is recorded in D008; no judged-source edit follows it",
    "git diff --check passes; dependency diff contains only workspace release labels/pins; kernel, reactor and console sources unchanged; publication locks current; adjacent queue empty"
  ],
  "rejected": [
    {
      "option": "Use the stopped gates or waive a required criterion",
      "reason": "A complete current-identity review row and the final inline document check satisfy the declared obligations without an off-ramp."
    }
  ],
  "goalAlignment": "D001's promised interface is delivered: the declared positive/negative fixtures establish evidence admission and matrix behavior while legacy replay stays intact. D002 keeps the current workflow and claims no cost reduction. D007's premature launches added avoidable work; the correction stops them without a false pass, preserves their observations and establishes a complete stable-input result.",
  "reopenWhen": "Independent verification finds a case within the declared fixture set failing, a required current-source check becomes stale, or final integration changes the judged source."
}
```

## WO-058-D010

```json
{
  "id": "WO-058-D010",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Pass WO-058 on all seven criteria against the original order and accept verification-v1 (operator-review assumption 1) by the Design's test. Stage the three new source files and run the final product gate at the staged identity. Settle FUP-c31c7bcab9270f49, whose condition this order met, and leave the other seven touching rows as textual matches. Board one schema gap without fixing it here: the evaluation claimType enum lists every claim type for every capsule.",
  "evidence": [
    "Base dd141ad1 equals local main, origin/main and the remote main ref, so no integration ran; tags end at v0.57.0, so target v0.58.0 is free. VER-001's SHA-256 recomputes to the logged reportHash c53c90bb...0494. At dispatch, every authored blob equalled the verifier's subject checkpoint refs/dotln/checkpoint/WO-058/3, except VER-001 itself, the control log and generated projections.",
    "gateCodeIdentity keys git ls-files, and the two verification-witness suites and the wo058 fixture were untracked, so the executor's and verifier's identity afb17aaf... excluded them. After staging them: npm test -- --review, 34 passed, 0 failed, 402.66 s, 78 fresh tasks, at code identity fd8769db8b505d5f4880b4b2120ce98859be570844c9b763e68c3d553cddfe2a. The nine WO-058 tests and WO-157 item 16 pass when run directly.",
    "Assumption 1 (inference from source): the pre-change copySubject returns only named fields and assertVerificationTask compares a re-lowering byte for byte, so an older reader refuses a capsule that uses a new claim type ('claim type') or a witness ('compiled capsule drift'). Keeping v1 therefore fails closed for older readers, and VER-001 re-lowered 179 of 179 recorded capsules to identical bytes.",
    "FUP-c31c7bcab9270f49 (WO-157 D024) reopens at 'the next order that edits evidenceResultSchema'. This order edits that function's claimType enum. The tightening landed with WO-157 item 16 (commit 4001a2b7, 2026-09-24), and that test passes unchanged. Settled through docs/evidence/WO-058/final-review-followup-request.json; register 56ca7968... to c7b08cce....",
    "The seven other touching rows match shared or generated files by text, and their conditions did not occur: FUP-005a8af5234cb3f3 needs two of the five protocol files and this order touches one; for FUP-adf6621e7f958dd8, repeated authority.json copies are 6,624,946 of 158,399,410 docs/evidence bytes (4.18%, below its 10%), and scripts/authority-evidence.mjs is untouched; FUP-b7a66e7a4fa7ad20, FUP-50cda1c03ecd8ea8, FUP-71a27b368d93f135, FUP-acfe4bfda716d8fb and FUP-fd05316b6030ef73 name seams this order does not edit.",
    "evidenceResultSchema gives evaluations claimType enum [...CLAIM_TYPES] beside a criterionId enum, so a result pairing a criterion with another claim type is schema-valid, and parseEvidenceResult refuses it as 'evaluation criterion'. This existed between state and behavior before this order. The Design's additive enum members widen it to four values for every capsule; WO-058's self-host capsule mixes state and behavior. No live refusal of this shape is observed."
  ],
  "rejected": [
    {
      "option": "Require verification-v2",
      "reason": "The Design's test holds: no recorded capsule lowers to different bytes, the optional member emits none when absent, and older readers refuse the new members at decode."
    },
    {
      "option": "Narrow the claimType enum in this review",
      "reason": "It edits verification-protocol.ts, a judged feedback source, so criterion 6 would require another live episode and four re-minted editions. The Design names additive enum members, and the gap is low-severity and pre-existing."
    },
    {
      "option": "Accept the executor's and verifier's gate row",
      "reason": "Its identity excluded the new untracked suites; a row keyed to the committed files is needed."
    }
  ],
  "goalAlignment": "Mission and critical path: WO-059's adapter gets typed witness kinds and WO-061 gets the visual claim type, so a screenshot or request trace is judged by admission instead of read as narrative. Rule beating: a visual or network pass without its witness is refused, and an omitted console error still blocks. The gate row now keys the tests that establish this. Seeking the wrong goal: the claim is admission over browser-free fixtures; no browser capture is claimed. Policy resistance and escalation: no new gate or verdict source. Commons: one extra product gate, needed because the prior identity excluded the new suites; no third live episode and no subagents. Drift to low performance: the boarded schema gap is recorded, not normalized. Shifting the burden: the follow-up names its landing seam. Success to the successful: v2 was judged on the Design's test, not on investment in v1. Naive Interventionism: this review changes no source, and the row disposition and decision are records. NoOp (passing on the old row, leaving the met row and the gap unrecorded) would leave the new tests outside the gate's key and the schema gap without a route.",
  "followup": "Narrow evidenceResultSchema's evaluation claimType enum to the claim types the capsule's criteria carry, and couple it to criterionId where the live transports' accepted schema keywords allow. Add a fixture showing a mismatched claim type is schema-invalid. Land it with the next order that edits verification-protocol.ts and re-mints the feedback edition.",
  "reopenWhen": "A live verifier refuses with 'evaluation criterion' for a mismatched claim type, or an order edits evidenceResultSchema."
}
```
