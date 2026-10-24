# WO-220 decisions

## WO-220-D001

```json
{
  "id": "WO-220-D001",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-06abc143a1c52367: declined. Keep complete mission observation with explicit omissions. Generated untracked evidence can still force unknown and human attention. Excluding generated files could certify an unreviewed change; a surface-first ranking cannot make an incomplete capsule complete. NoOp preserves this conservative hold rather than claiming that the harm disappeared.",
  "evidence": [
    "docs/evidence/WO-099/decisions.md#wo-099-d016",
    "mission-check-source.ts smallest-first sections and mission-check-protocol.ts omittedPaths admission; mission-check.test.ts omission controls",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A declared generated-evidence selection policy specifies evidence ownership and shows that no executable or out-of-surface change can evade the judge.",
  "reopens": {
    "decisionId": "WO-099-D016",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D002

```json
{
  "id": "WO-220-D002",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-165f9860f8f32a67: declined. Decline the complete console supervision basket. Current full-log reads grow with history; failed decode can reset notice history; a dead resident can retain its last frame; generic failures and the historical witness/test/document limitations remain. Incremental audit projection needs causal checkpoint semantics, and historical witness provenance cannot be reconstructed by changing current code. The budget label change in D004 fixes none of those claims. NoOp retains known limits and avoids presenting a partial console patch as the whole basket.",
  "evidence": [
    "docs/evidence/WO-117/decisions.md#wo-117-d007",
    "packages/console/src/live.ts renderLiveView/watchLiveView; packages/console/test/live.test.ts; the complete B2-B5, T1, R1-R6 ask in WO-117-D007",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A bounded console-supervision design supplies an event-log cursor/checkpoint, failure-preserving notification history, freshness behavior and a terminal/witness correction plan; historical reports remain immutable.",
  "reopens": {
    "decisionId": "WO-117-D007",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D003

```json
{
  "id": "WO-220-D003",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-2341c85c58331f3e: settled. Link truthful partial semantic inputs only for cannot-evaluate-revocation refusals. Accept state-only or the complete available environment suffix without a state; reject malformed order and invented partial environment fields. Complete authorization linkage stays strict.",
  "evidence": [
    "docs/evidence/WO-103/decisions.md#wo-103-d004",
    "packages/skeleton/test/audit.test.ts: audit links truthful partial revocation inputs without inventing missing inputs; control audit-partial, skeleton suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A canonical producer emits another truthful partial shape, or a forged suffix links to a refusal."
}
```

## WO-220-D004

```json
{
  "id": "WO-220-D004",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-2b9a8e696b38fb97: settled. Project expired between-step intents as one needs-human hold and retire their actor. Show terminal outcome beside the indexed phase, preserving the index and its verdict; label budget as portfolio-only. No lifecycle transition is fabricated. Product 04 now describes vertical actors, transport, expiry, holds and terminal visibility. This and D020 discharge WO-083/WO-183 carry-ins and supersede the earlier deferral of WO-118 D018/D013.",
  "evidence": [
    "docs/evidence/WO-118/decisions.md#wo-118-d018--final-review-follow-up-live-status-misses-how-a-resident-owned-continuation-ends",
    "packages/skeleton/test/runtime-status.test.ts: resident expiry between steps shows one hold and terminal outcomes preserve the indexed phase; packages/console/test/runtime-status.test.ts: resident status labels the budget as portfolio-only beside an intent outcome; controls intent-status and budget-label; docs/product/04-interfaces.md section Plural UI hosts, one projection contract",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A terminal result lacks a visible outcome, an expiry leaves a stale actor, or budget accounting is extended to include intent admissions."
}
```

## WO-220-D005

```json
{
  "id": "WO-220-D005",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-349058ac0342247d: settled. Declare minLength 1 for all ten T1 receipt strings and the summary, preserving existing maxima including summary 320. The emitted contract now agrees with host validation. Historical blocked/out-of-contract matrix cells are not recollected or relabeled.",
  "evidence": [
    "docs/evidence/WO-138/decisions.md#wo-138-d012--board-up-the-undeclared-t1-minimum-bound-named-by-ver-002-a1",
    "scripts/test-harness-probe.mjs: T1 emitted minimum and maximum match every receipt field's host validation; control t1-minimum; harness-probe suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "The host validator changes a field bound or a new T1 matrix requires fresh model observations."
}
```

## WO-220-D006

```json
{
  "id": "WO-220-D006",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-3d4b39cd4b2c4a08: declined. Decline adding resident audit action classes and relabeling the fold as part of this batch. Resident dispatch, outcome, holds and console events still appear in governed raw without L0/L1 action receipts, and fixture-oriented omission wording remains. Inventing causal action classes from event names would imply a consequence model that this source ask asks planning to nominate. NoOp preserves the raw evidence and makes no completeness claim.",
  "evidence": [
    "docs/evidence/WO-116/decisions.md#wo-116-d008--observed-limit-a-resident-stores-own-events-are-context-to-the-fold",
    "packages/skeleton/src/audit.ts deriveAuditRecords consequential types and omission strings; packages/console/test/console-commands.test.ts bound-resident audit parity",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A nominated resident action/causation model specifies which events form receipts and omissions, with fixtures for restart, repeated events, holds and console effects.",
  "reopens": {
    "decisionId": "WO-116-D008",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D007

```json
{
  "id": "WO-220-D007",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-49c4a5f7176252e7: settled. Catch recovery effect/observation failures after recoverTermination and close the command through the same host-admission-check refusal as dispatch admission. Deliver a pending signal first; an interruption admits neither refusal nor observation. Preserve saved-receipt recovery. WO-204 must retain this rule when rewriting the source host.",
  "evidence": [
    "docs/evidence/WO-199/decisions.md#wo-199-d015--verification-pass-ver-003-board-the-recovery-paths-untyped-host-refusal-which-a-refusal-coinciding-with-a-signal-now-reaches",
    "packages/skeleton/test/source-change-host.test.ts: recovered unreceipted dirty commits close with a typed host admission refusal; control recovery-refusal; skeleton suite; current feedback edition and live episode required after final source edit",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "Recovery can return an untyped admission failure, a signal becomes a permanent refusal, or WO-204 changes this boundary."
}
```

## WO-220-D008

```json
{
  "id": "WO-220-D008",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-4f8cd7989607ad3f: settled. Derive the resident NoOp key from reason, recorded phase and replayed arm generation. Old payloads need no migration; the derived key survives restart and permits a new receipt when phase or generation changes.",
  "evidence": [
    "docs/evidence/WO-142/decisions.md#wo-142-d002--preserve-replay-behavior-when-returning-resident-noop-identity",
    "packages/skeleton/test/resident.test.ts: resident NoOp identity survives replay and distinguishes phase and rearm; control noop-identity; skeleton suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "Replay and restart diverge or a new arm is deduplicated against an earlier arm."
}
```

## WO-220-D009

```json
{
  "id": "WO-220-D009",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-5d48c4f3c2a3730d: declined. Retain the current bounded-delay retry policy without a subject-failure counter. A repeatedly deadline- or budget-exhausted subject can buy further episodes until authority expiry; no paid spend was measured here. Budget exhaustion currently shares transport-failed with connectivity, so counting that code would also permanently hold transient outages. A durable subject counter requires a distinct cost-failure contract and recovery/concurrency rule. NoOp preserves availability and records the real cost risk; it does not assert a finite attempt count.",
  "evidence": [
    "docs/evidence/WO-112/decisions.md#wo-112-d061--board-unbounded-retries-of-judgment-episodes-that-fail-identically",
    "packages/skeleton/src/vertical-judgment-host.ts judgmentRetryable; worker-transport.ts decodeResult error_max_budget_usd; scripts/lib/vertical-runtime.mjs intake handling; vertical-resident.ts capped retry state",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A typed budget-exhaustion outcome and durable per-subject counting policy distinguish cost failures from reachability, or a live run observes repeated paid failure for one subject.",
  "reopens": {
    "decisionId": "WO-112-D061",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D010

```json
{
  "id": "WO-220-D010",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-7c269a184f75e742: settled. Bound combined review triages and outward actions to sixteen each per invocation, stopping with the next item before effect. Keep the eight-body allowance for new/changed bodies and external heads, excluding unchanged body rekeys caused by this invocation's own push. Validate cached resolution head, contract and sealed snapshot. Reset continuation failure backoff only on a new step receipt. Stored invalid triage results use D014's record-refusal path. Independent review repairs use stable item-specific worktree parents while retaining their original contracts and source command identities.",
  "evidence": [
    "docs/evidence/WO-112/decisions.md#wo-112-d046--board-five-lower-review-loop-and-resident-items-from-the-ver-005-adversary",
    "scripts/test-vertical-judgment.mjs: review invocation bounds combined inline and body triage before opening the next item; review invocation stops at its outward bound before disposing a further thread; three repair pushes rekey unchanged bodies without spending their eight-item allowance; cached resolution input rebinds its observed head, contract and snapshot before triage; WO-112 continuation backoff survives a no-progress return, caps repeated failures and never defers authority expiry; controls review-triage, review-outward, review-rekey, repair-worktrees, repair-legacy-parent, cached-resolution, continuation-backoff and judgment-replay; vertical suite",
    "packages/skeleton/test/repair.test.ts: namespaced repair resumes a recorded legacy worktree without another writer; control repair-legacy-parent; skeleton suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A legitimate loop cannot finish within the explicit invocation bound, a stale prepared subject reaches triage, or an undecided return resets retry history."
}
```

## WO-220-D011

```json
{
  "id": "WO-220-D011",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-88c339c51cfc1933: settled. Pass the run signal into browser evidence; kill and await the owned BrowserServer on abort, and admit no cancelled result. Preserve each attempt directory, recover its process record into a fresh directory, and retry without refusing the old directory.",
  "evidence": [
    "docs/evidence/WO-199/decisions.md#wo-199-d011--board-the-witnesses-steps-browser-scenario-which-the-abort-does-not-reach-and-whose-rerun-refuses-its-own-directory",
    "scripts/test-vertical.recovery.mjs: browser witness cancellation closes owned processes and resumes in a fresh attempt directory; controls browser-signal, browser-recovery and browser-startup; vertical suite; official Playwright BrowserServer kill documentation fetched through ctx7",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A signaled witness leaks an owned process, admits a result, or cannot resume from retained process records."
}
```

## WO-220-D012

```json
{
  "id": "WO-220-D012",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-89e29438bd71c524: declined. Keep the front-page parser's declared corpus limits: independently changing pictures, authority-file enumeration through working configuration, no-local-main comparison notice and the listed Unicode/name/receipt/sentence spellings. Closing those classes without observed renderer cases risks false refusals or a new parser. NoOp preserves the tested declared boundary. Generated blocks outside What runs today belong to WO-088's registration/content-pinning carry-in, not a silent settlement here.",
  "evidence": [
    "docs/evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice",
    "scripts/docs-check.mjs frontPageShapeFindings; scripts/fixtures/front-page-corpus.json; WO-189-D021 full known-limit list and reopening rule",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "WO-088 registers and pins its generated block, or an observed GitHub rendering or corpus misclassification supplies a bounded new guard case.",
  "reopens": {
    "decisionId": "WO-189-D021",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D013

```json
{
  "id": "WO-220-D013",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-8f0561e50754114f: settled. Archive the second collector before editing it and admit first, second and current protocol hashes. Retained measurement bytes remain immutable; the registry self-test is explicitly base-only and reports drift after source changes; retained schema checks still run, and new collection remains base-only. Keep the already-correct historical classification exception/current-entry check. Normalize generated comparison output to one final newline and regenerate only that derived Markdown. Coordinate this after-base rule with D017.",
  "evidence": [
    "docs/evidence/WO-107/decisions.md#wo-107-d010--final-review-the-lanes-own-checks-are-keyed-to-this-orders-bytes",
    "corpus/harness/wo107-schema.test.mjs: harness classification exception is exact and both collector revisions preserve timed bytes; harness records schema/summary checks; corpus generated comparison is byte identical and check never appends or rewrites; corpus/baselines/SCHEMA-WO-107.md Commands and retention; controls collector-archive and comparison-newline; wo107-schema suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A recorded protocol is unrecognized, timed-byte identity changes, or a newly collected baseline uses different source identity."
}
```

## WO-220-D014

```json
{
  "id": "WO-220-D014",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-b8440605da5a4eb2: settled. Distinguish a stored result that parses and binds but fails result validation from an episode failure. Intake counts a bounded host record fault; triage records explicit human attention. Do not relaunch an unchanged invalid record or relabel its provenance as a new episode.",
  "evidence": [
    "docs/evidence/WO-112/decisions.md#wo-112-d047--close-the-ver-005-classes-at-their-origin-one-judgment-failure-rule-admission-gated-preparation-and-own-registration-recovery",
    "scripts/test-vertical-judgment.mjs: stored intake result refusal is a bounded record fault with no new episode; stored triage result refusal ends needs-human and is never called an episode failure; control judgment-replay; vertical suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "Replay validation or binding rules change, or a corrupt record triggers a new paid episode."
}
```

## WO-220-D015

```json
{
  "id": "WO-220-D015",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-bcd4724fca7bff7a: settled. Use a full post-failure cooldown for preparation, matching continuation retries: notBefore uses the clock after the awaited failure. Long calls no longer spend the delay while still running. Keep capped doubling, later-draft fairness and authority-expiry precedence.",
  "evidence": [
    "docs/evidence/WO-112/decisions.md#wo-112-d053--board-the-preparation-retry-clock-choice-with-its-observed-contrast",
    "scripts/test-vertical.mjs: preparation retries cool down after short and slow failures, cap the delay and honor expiry; control preparation-clock; vertical suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A provider retry contract requires attempt-start spacing, supported by measured load and expiry evidence."
}
```

## WO-220-D016

```json
{
  "id": "WO-220-D016",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-c1d4be019802be0d: settled. Validate required Command/Act fields and JSON payload structure before new pending insertion and before new CommandPersisted append. A typed admission error carries persist/malformed/field. Replay uses its historical ID-only insertion, so old incomplete commands and scenario identities remain readable without rewriting logs.",
  "evidence": [
    "docs/evidence/WO-103/decisions.md#wo-103-d005",
    "packages/kernel/test/kernel.test.ts: new command admission rejects malformed structure while old logs replay unchanged; controls command-persist, command-append and command-serialization; kernel suite; WO-103 outbox replay and WO-105 current recovery invariants",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A well-formed historical log changes replay output, or a new malformed command reaches pending state or appended bytes."
}
```

## WO-220-D017

```json
{
  "id": "WO-220-D017",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-d093f77bd927f9dc: settled. Separate historical artifact-byte pins from current runtime invariants. Read retained oracle bytes at the recorded base; run every current cut and recovery law; report base-source-drift while separating only compiler version fields and the explicitly named version-bearing digests. Crash offsets, bytes, counts, classifications, pending/effect counts and outbox hashes remain pinned; changed byte geometry requires a reviewed baseline. Exact comparison including identity still applies at unchanged sources. Do not overwrite retained observations or pretend a drift report is an identical baseline.",
  "evidence": [
    "docs/evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main",
    "corpus/harness/wo105-skeleton.test.mjs: WO-105 after-base reports identity drift but still rejects changed crash-shape pins; full wo105-skeleton and wo105-store lane commands; corpus/manifests/WO-105.json afterBasePolicy; control corpus-after-base",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "The historical base becomes unavailable, a retained artifact hash changes, or current invariant coverage misses a behavioral regression."
}
```

## WO-220-D018

```json
{
  "id": "WO-220-D018",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-d22dc57e754ba35c: settled. Add deny-without-allow, with allowed other and denied act, to the complete authority factorial. Keep the seed and regenerate the expanded stream counts, winners, golden shards, manifest and precedence table. Audit carry-ins retain their finding identities while marking their linkage resolved; historical incomplete outbox replay remains explicit.",
  "evidence": [
    "docs/evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests",
    "corpus/harness/wo103-authority.test.mjs complete factorial; wo103-generators.test.mjs axis coverage and seeded selection; control authority-contest; direct WO-103 lane commands",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A precedence pair still has no joint contender or regeneration changes without its declared seed/factor change."
}
```

## WO-220-D019

```json
{
  "id": "WO-220-D019",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-e62d0d2771185a38: declined. Decline the cross-host personal delegation feature to planning. The product preference remains: meaningful distinct contributions when enabled, willing delegation when off. Current host-selected setting evidence and contribution enforcement do not establish that feature. A minimum-count gate without reliable mode/readback would launch unnecessary workers or falsely claim compliance. NoOp avoids changing account settings or weakening the requested floor.",
  "evidence": [
    "docs/evidence/WO-065/decisions.md#wo-065-d008",
    "docs/product/05-pattern-library.md Orchestration and quality policies; WO-065-D008; current role pins and shared subagentCap rules",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "A bounded host-binding order supplies truthful Claude/Codex mode readback and meaningful task-level contribution evidence for enabled and off modes, respecting cap, No Fan-Out and one writer.",
  "reopens": {
    "decisionId": "WO-065-D008",
    "observation": "This order expressly declines the implementation; the current harm and concrete reopening condition remain as recorded above."
  }
}
```

## WO-220-D020

```json
{
  "id": "WO-220-D020",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "FUP-eeb25ea9315438ad: settled. When a resident has an explicit vertical scheduler and the legacy portfolio actor is unbound, an idle intent tick skips that actor. A normal portfolio-only resident still reports ActorUnavailable, and other capability or configuration failures remain diagnostic. Together with D004, this resolves WO-083/WO-183's resident carry-ins and the earlier WO-118 D013/D018 deferral.",
  "evidence": [
    "docs/evidence/WO-118/decisions.md#wo-118-d013--the-witnessed-run-carries-criteria-1-to-5",
    "scripts/test-vertical.mjs: intent-only residents skip an unbound portfolio actor but ordinary portfolios still report it; control intent-only; vertical suite",
    "docs/evidence/WO-220/repair-controls.json records executed arms; completion is not claimed before those controls and required gates pass."
  ],
  "rejected": [
    {
      "option": "Leave the allocated row without a terminal disposition",
      "reason": "The order requires an explicit fixture-backed settlement or an honest decline."
    },
    {
      "option": "Treat a partial fix, a source read or a filtered-out case as full settlement",
      "reason": "The whole source ask and a sensitive executed regression are required."
    }
  ],
  "reopenWhen": "An ordinary bound portfolio dispatch is suppressed or an intent-only idle tick again emits a spurious unavailable receipt."
}
```

## WO-220-D021 — Release compatibility

```json
{
  "id": "WO-220-D021",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Prepare a minor application release locally. Bump kernel 0.7.0 to 0.8.0 for new-command structural admission, skeleton 0.67.0 to 0.68.0 for typed recovery refusal and projection/retry behavior, browser-evidence 0.1.0 to 0.2.0 for optional AbortSignal admission, and console 0.4.7 to 0.4.8 for budget labeling. Keep compiler and beacons unchanged. Internal dependency pins follow changed workspaces; no external dependency changes.",
  "evidence": [
    "package.json and package-lock.json dependency census; changed component source diff",
    "WO-220 release classification delegates the patch/minor judgment at activation"
  ],
  "rejected": [
    {
      "option": "Patch despite new acceptance/refusal behavior",
      "reason": "The order explicitly requires minor for changed commands, schemas or refusals."
    }
  ],
  "reopenWhen": "Integration observes a newer published version or review changes compatibility impact."
}
```

## WO-220-D022

```json
{
  "id": "WO-220-D022",
  "date": "2026-10-24",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.95.0, the next minor above the observed release baseline v0.94.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.94.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-220-boarded-follow-ups-the-resident-and-the-vertical.md"
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

## WO-220-D023 — Inspection and fixture corrections

```json
{
  "id": "WO-220-D023",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Record executor inspection and fixture setup errors separately from product evidence. Only a selected behavioral test with a passing current arm and a failing runtime reversion counts. Retain full logs in session scratch and emit bounded summaries. No setup failure is a negative control.",
  "evidence": [
    "Oversized batched reads were truncated; named sections were reread. Incorrect scripts/corpus and product filename guesses were corrected by rg --files; unmatched zsh globs and the first followups argument order yielded no evidence.",
    "A second preparation-clock case inherited the first case's expired clock; resetting its independent clock made both 50 ms and 3000 ms failure durations run. The corrected case passes.",
    "The initial kernel append cast failed TypeScript narrowing for readonly JSON arrays; an explicit record cast after object/array checks fixed compilation. The continuation fixture initially imported VerticalHost from vertical.ts instead of vertical-host.ts; only the corrected invocation reaches its assertions.",
    "The first outward-bound fixture read a nonexistent publication store and did not provide inline threads in the forge double. The double now supplies and resolves synthetic threads, tracks the pushed remote head, and the fixture reads the source host's publication store. Sorted IDs place R9 last among R1..R16; the corrected case passes.",
    "The second-collector hash was initially transcribed from an incomplete prefix instead of computing it; direct hashing of the four archived files produced 1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd and corrected the unfiled pin before validation.",
    "The first corpus generator invocation omitted its required --seed; it wrote no corpus. The corrected invocation uses wo103-seed-20261001. The first isolated-copy build wrapper lacked compiled harness imports; copying bootstrap dist outputs before rebuilding the isolated source fixes that setup."
  ],
  "misread": "A guessed path, truncated output, incomplete hash or incomplete fixture setup could serve as inspected or executable evidence.",
  "meant": "Check exact source, command entry contract and selected test output before claiming an observation.",
  "changed": "Use discovered paths, computed hashes, full scratch transcripts, corrected fixture data and isolated paired controls.",
  "rejected": [
    {
      "option": "Count a build, setup or import failure as a sensitive regression",
      "reason": "It does not reach the behavior the criterion requires."
    }
  ],
  "reopenWhen": "A later command or control fails before reaching its intended assertion."
}
```

## WO-220-D024 — Independent review repairs

```json
{
  "id": "WO-220-D024",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Accept all thirteen worker observations (eight distinct findings across the initial and follow-up reviews) and repair their source or evidence gaps. Use own enumerable command fields plus post-serialization admission; stop before opening the next inline item at outward exhaustion; recognize only the browser pre-launch file set when its process record is absent; replace the helper body-budget simulation with three real repair pushes; preserve capability diagnostics; narrow corpus drift handling to version-bearing identity fields and named digests while pinning crash behavior; state both corpus policies in their authoritative records. The real three-repair fixture also exposed a shared worktree path despite distinct item branches; isolate the repair parent by its stable item namespace without changing the contract. Preserve the original parent when an existing child command records that exact configured path; retain full source-host request validation. An interrupted legacy-layout regression pins path, log and writer-count continuity.",
  "evidence": [
    "Initial read-only criteria adversary: six findings; initial design improver: five findings; each follow-up raised the same legacy-layout finding, and both final readbacks found no remaining concrete defects; both Codex gpt-6.1-sol at max, separate fresh contexts with only the order and diff, no writable agents.",
    "Session scratch review-fixes.log: five current regressions passed and the real three-repair fixture reached a second-repair worktree collision; this is an implementation defect, not a setup failure.",
    "docs/evidence/WO-220/repair-controls.json records current positive and negative evidence; the complete gate and handoff provide final outcomes."
  ],
  "rejected": [
    {
      "option": "Keep the simulated counter test or weaken the three-repair expectation",
      "reason": "Neither exercises the live loop wiring or proves the requested recovery from repeated repair pushes."
    },
    {
      "option": "Skip all corpus comparisons after any source drift",
      "reason": "That would hide changed crash classifications, offsets, pending commands and side effects."
    },
    {
      "option": "NoOp on the worker observations",
      "reason": "The observed admission, recovery and test gaps would remain."
    }
  ],
  "reopenWhen": "A paired control or the complete gate exposes an unhandled case, or the corpus identity policy would hide a changed crash-shape pin."
}
```

## WO-220-D025 — Final evidence and register accounting

```json
{
  "id": "WO-220-D025",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "decision": "Finalize all twenty post-activation dispositions: fourteen settled and six declined. Use 26 isolated paired controls, direct complete WO-103/WO-105 lanes, deterministic evidence remints, and the authorized live feedback episode before the complete review gate. Keep pending count at 178; allocations were already closed, and no twenty-row reduction is claimed. Preserve historical editions, archived observations and source decisions. Refresh the installed harness and check its historical evidence without rewriting those live observations.",
  "evidence": [
    "docs/evidence/WO-220/register-after.json: each of twenty --show readbacks has the selected terminal disposition after activation; before/after pending 178. Six refreshed source-title excerpts temporarily made the count 184 during metadata sync, then their current source revisions were disposed.",
    "docs/evidence/WO-220/repair-controls.json: 26 positive exits 0 and 26 behavioral negative exits 1; new command persistence, append and serialization guards are independent controls; legacy logs retain replay behavior.",
    "docs/evidence/WO-220/supplemental-checks.json: regenerated authority factorial 2993760 cells and 509440 outbox deliveries; all 27 direct corpus-lane tests passed, including unchanged historical crash-shape pins.",
    "docs/evidence/WO-220/feedback-001/edition.json: new live audit, carried false; Codex gpt-6.1-sol at max completed ten fixtures on the final judged source.",
    "docs/evidence/WO-220/touching.json: the final query includes five pending other-batch rows after the machinery declaration and fixture corrections; they remain unchanged, and none of the twenty selected rows is pending.",
    "scripts/lib/generated-artifacts.mjs and scripts/harness-evidence.mjs: sync owns deterministic editions and installed output; historical harness episodes judge their recorded edition, with current behavior covered by fixtures."
  ],
  "rejected": [
    {
      "option": "Count allocations as twenty newly removed pending rows",
      "reason": "The register excluded them before activation."
    },
    {
      "option": "Carry the earlier feedback audit across changed judged behavior",
      "reason": "Changed repair, resident-state and source-host behavior requires the authorized live episode."
    },
    {
      "option": "Rerun every independent control after the legacy-parent-only refinement",
      "reason": "Re-run the two three-push controls and new legacy control, retain other identical reversion-source observations, then judge all current source together in the complete gate."
    }
  ],
  "reopenWhen": "A current source change invalidates a control, edition, direct-lane claim or complete-gate subject."
}
```

## WO-220-D026 — Complete-gate declaration correction

```json
{
  "id": "WO-220-D026",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Add the T1 test's direct first-party schema module to harness-probe machinerySources in scripts/test-runner.mjs. Keep the declaration preflight and all suite obligations intact, then format, sync and run a fresh complete review gate.",
  "evidence": [
    "First complete npm test -- --review, 2026-10-24T06:09:16.303Z: declarations failed with Missing machinerySources declaration: harness-probe: scripts/probes/local-model-role-qualification.mjs; three structural tasks passed and product suites did not run.",
    "scripts/test-harness-probe.mjs imports taskSchema and validateAnswer directly for the new T1 boundary case. scripts/test-runner.mjs lists the suite's direct first-party inputs.",
    "scripts/lib/evidence-sources.mjs and FEEDBACK_SOURCE_PATHS do not register scripts/test-runner.mjs; no judged implementation or immutable evidence edition changed in this correction."
  ],
  "misread": "The new T1 import could use the existing suite declaration unchanged.",
  "meant": "Every direct first-party test input belongs in that machinery suite's source declaration.",
  "changed": "One named module added to the declaration; no guard or test removed.",
  "rejected": [
    {
      "option": "Bypass declarations or use a focused row as the final gate",
      "reason": "The complete current review gate is required and the failure is a missing input declaration."
    }
  ],
  "reopenWhen": "A subsequent complete run identifies another undeclared input or an actual product regression."
}
```

## WO-220-D027 — Kernel export map correction

```json
{
  "id": "WO-220-D027",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Add assertCommand and CommandAdmissionError to the left column of the kernel README domain-model map. Keep their explanatory admission/replay paragraph and the exhaustive export-map test. Stop the already-failed complete gate through the canonical evidence stop command, reproduce the named kernel failure after this correction, then run a fresh complete gate.",
  "evidence": [
    "Second complete review attempt: kernel AC7 reported exactly CommandAdmissionError and assertCommand missing from the README map left column; description/prose mentions do not count.",
    "packages/kernel/test/ac7-readme-map.test.ts discovers the declaration exports and checks table names independently.",
    "node scripts/harness.mjs evidence --stop at 2026-10-24T06:16:24.500Z stopped the failed gate; the unfinished harness-fixtures task was stopped, not a newly diagnosed product defect and not a pass."
  ],
  "misread": "The API explanation paragraph satisfied the README export-map contract.",
  "meant": "Every exported symbol also needs its own left-column table entry.",
  "changed": "The two new symbols are named in a map row; implementation and judged feedback sources are unchanged.",
  "rejected": [
    {
      "option": "Relax the export-map assertion",
      "reason": "The assertion correctly caught incomplete public API documentation."
    }
  ],
  "reopenWhen": "The export surface or its authoritative mapping changes again."
}
```

## WO-220-D028 — Reference-projection fixture admission correction

```json
{
  "id": "WO-220-D028",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Give the reference-projection fixture a complete new command with commandId, workstreamId, Act kind and effect. Preserve its source-body projection, unrelated heartbeat and byte-for-byte reconstruction assertions. Keep the new append admission guard and historical replay semantics unchanged, reproduce the named test, then run a fresh complete review.",
  "evidence": [
    "Third complete review: skeleton's WO-154 a verifier stream committed by reference rebuilds byte for byte and leaves other records alone failed with CommandPersisted admission refused: malformed commandId at feedback-edition.test.js:137.",
    "packages/skeleton/test/feedback-edition.test.ts appended a newly constructed CommandPersisted with only intent.payload. The fixture tests body references, not malformed command admission or historical replay.",
    "Canonical evidence --stop at 2026-10-24T06:30:37.643Z reported active []; the stopped run supplies no complete pass. Other interrupted tasks are not diagnosed product failures.",
    "scripts/lib/evidence-sources.mjs and FEEDBACK_SOURCE_PATHS do not register this test fixture; this correction changes no judged implementation or immutable edition."
  ],
  "misread": "The existing projection-only fixture could continue appending its incomplete command after new-command admission became strict.",
  "meant": "A fixture using the new append boundary must supply a structurally valid command; historical replay remains the separate compatibility path.",
  "changed": "Only the fixture's command construction gains the required structural fields; its projection assertions are retained.",
  "rejected": [
    {
      "option": "Relax admission for the projection fixture or remove the fixture",
      "reason": "Neither is necessary: its intended projection behavior is exercised with a valid new command."
    }
  ],
  "reopenWhen": "The named fixture or a fresh complete review exposes a further incompatible caller."
}
```

## WO-220-D029 — Release retained fixture harnesses inside repair namespaces

```json
{
  "id": "WO-220-D029",
  "date": "2026-10-24",
  "dispatch": "resume: next",
  "kind": "correction",
  "decision": "Make the publication scenario's owned-harness cleanup descend through repair namespace directories and stop at each worktree. Remove each installed harness through removeTargetHarness before restoring an authentic fixture seed, preserving its ownership checks and the no-symlink refusal. Keep production worktree isolation and all publication assertions unchanged.",
  "evidence": [
    "Fourth complete review: target-publish failed repair cases with target exclude block drift or a missing target-worker-manifest after a prior case restored the same seed path.",
    "scripts/test-target-publish.mjs releaseScenarioHarness scanned only trees/<command>; new isolated repairs live at trees/<repair namespace>/<command>. Seed restoration replaced target bytes while the real launchpad retained the nested installation receipt and shared exclude registry.",
    "The complete gate was canonically stopped at 2026-10-24T06:35:17.437Z, with active [] and no passing complete row.",
    "The real target harness removal function remains the sole installation cleanup path; recursion ends at .git and does not enter a target worktree's source directories. The bounded node --test scripts/test-target-publish.mjs run passed all 61 cases at 2026-10-24T06:37:37.260Z."
  ],
  "misread": "The publication fixture's cleanup already covered the newly isolated repair worktree layout.",
  "meant": "Every retained fixture installation must be released before its authenticated seed replaces the underlying worktree, including nested repair namespaces.",
  "changed": "Only the test fixture cleanup traversal changes; no production admission, ownership guard or judged feedback source changes.",
  "rejected": [
    {
      "option": "Delete or ignore real launchpad installation receipts to make the tests pass",
      "reason": "That would bypass ownership checks and conceal incomplete fixture cleanup."
    },
    {
      "option": "Remove repair worktree isolation",
      "reason": "Independent same-contract review repairs would again collide on their command-named paths."
    }
  ],
  "reopenWhen": "An installation is retained after fixture restoration or a new layout is not covered by the worktree-bounded traversal."
}
```

## WO-220-D030 — Bind the delegated activation classification

```json
{
  "id": "WO-220-D030",
  "date": "2026-10-24",
  "dispatch": "resume: next; release classification assignment delegated by the reviewed order",
  "decision": "Bind the already selected minor classification through the canonical execution-amendment route. Preserve the assigned v0.95.0 title and every objective, acceptance criterion, dependency and non-goal. The amendment records the existing delegated activation choice and grants no new scope or planning verdict.",
  "evidence": [
    "Operator dispatch: resume: next. The filed WO-220 Release classification paragraph assigns classification at activation from the fixes: patch unless a command, flag, schema or refusal changes, then minor. New-command admission, typed recovery refusals and browser abort admission satisfy that condition; D021 and D022 record the classification and versions.",
    "Document gate at 2026-10-24T07:09:03.991Z: plan-refutation-current failed with existing work-order bytes changed. scripts/lib/plan-continuation.mjs normalizes the release title but does not normalize this delegated classification paragraph; scripts/lib/release-preparation.mjs requires an explicit classification.",
    "WO-218-D053 in docs/evidence/WO-218/decisions.md records the same delegated activation assignment and canonical amend-order route. scripts/lib/plan-receipts.mjs amendPlanOrder binds current order and decision bytes without changing criteria or disposing a hold.",
    "The current work-order diff contains only its assigned version title and the classification paragraph; the remaining order text is unchanged."
  ],
  "rejected": [
    {
      "option": "Return to an unassigned classification or call the changed acceptance behavior patch",
      "reason": "The reviewed order delegates the actual choice, its minor condition is met, and release preparation requires the explicit result."
    },
    {
      "option": "Invent a new operator scope expansion or weaken the planning check",
      "reason": "The filed classification rule and resume: next already authorize the bounded assignment; the existing binding route is sufficient."
    }
  ],
  "reopenWhen": "The assigned behavior, classification condition or any non-bookkeeping order text changes."
}
```

## WO-220-D031 — Preserve the retained qualification schema

```json
{
  "id": "WO-220-D031",
  "date": "2026-10-24",
  "dispatch": "resume: next; document-gate correction within the T1 schema repair",
  "decision": "Keep new T1 receipts' minimum lengths and validate historical records against the exact schema definition in their retained source. Recognize only an unambiguous exact current function or its prior form differing solely by the two T1 minimum-length declarations. Do not execute retained source. Derive only that historical T1 shape, retain all build, input, prompt and schema hashes, and refuse any other retained schema. Preserve every archive and episode byte.",
  "evidence": [
    "The first document gate's local-runner-double case failed baseline-local-T1-r1 because validateRecordInputs bound the old build hash but recomputed schemaHash from the newly tightened current taskSchema. The gate's five other unrun suites were not executed failures.",
    "WO-149-D007 and the exact retained source docs/evidence/WO-149/wo138-probe-source.mjs.txt establish the historical-build boundary. A byte comparison of taskSchema definitions found only the T1 field and summary minLength additions; the archive remains pinned to 3d9d6aa05c47bc6561e6850ea49c236611a3b462486f8311e4119953411f6907.",
    "The bounded full scripts/probes/local-model-role-qualification.test.mjs run passed all 13 cases at 2026-10-24T07:10:52.399Z, including all 38 retained records, rejection of current/altered build bindings, per-field hash mutations, and an unknown schema whose supplied build hash matches its changed source.",
    "The reused read-only design reviewer checked the actual adapter and test diff and reported zero concrete remaining issues. No new agent was spawned and the reviewer ran no tests."
  ],
  "misread": "Supplying the retained harness source was sufficient to keep historical records valid after the emitted schema changed.",
  "meant": "The retained build's schema must also match; current-schema hashes cannot stand in for the schema the historical episode received.",
  "changed": "A non-executing exact schema-definition adapter and historical/unknown-schema assertions; the new minimum lengths and every hash admission remain enforced.",
  "rejected": [
    {
      "option": "Rewrite the historical hashes, drop schema checks or rerun paid qualification episodes",
      "reason": "The exact retained schema can be checked deterministically without fabricating historical evidence or buying a new claim."
    },
    {
      "option": "Execute arbitrary retained source or accept any schema without minimum lengths",
      "reason": "Only the inspected exact prior definition is required; all other definitions fail closed."
    },
    {
      "option": "Undo the emitted minimum-length fix",
      "reason": "That would reopen the selected row and make its sensitive regression fail."
    }
  ],
  "reopenWhen": "A future schema changes beyond the recognized T1 bounds or a retained source cannot be matched exactly; it must receive an explicit compatibility decision instead of broad acceptance."
}
```

## WO-220-D032 — VER-001: pass; board the retained-schema recognition's dependence on the current function's source text

```json
{
  "id": "WO-220-D032",
  "date": "2026-10-24",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Pass VER-001 at code identity 881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6; all seven criteria are met. Board F1 (follow-up). WO-220-D031's validateRecordInputs recognizes a retained T1 schema by comparing the retained harness source's taskSchema text with the current function's text (exactly, or with only the two T1 minLength declarations removed). The base compared each record's schemaHash with the hash of the current taskSchema value, so an edit that leaves the schema value unchanged left retained records valid. Now a comment-only or formatting-only edit inside the current taskSchema refuses every retained WO-138 record as an unsupported retained task schema. No criterion requires that tolerance, the current records validate, and no runtime behavior changes, so the route is follow-up.",
  "evidence": [
    "docs/evidence/WO-220/verification-001/probes.json d031FormattingProbe: in the isolated copy, node scripts/harness.mjs bounded -- node --test --test-concurrency=1 scripts/probes/local-model-role-qualification.test.mjs passes 13 of 13 unchanged; after inserting one comment line in taskSchema it fails 1 of 13 (WO-138 committed episodes bind their retained historical build; current and altered builds are rejected) with 'episode input/prompt/schema/build binding differs: unsupported retained task schema'.",
    "scripts/probes/local-model-role-qualification.mjs validateRecordInputs: currentSchema is `export ${taskSchema.toString()}` and retainedSchema is the regex-extracted taskSchema text of harnessSource; the removed base lines compared record.schemaHash with sha256(stableStringify(taskSchema(cell.taskId, inputs)))."
  ],
  "rejected": [
    {
      "option": "Fail the verification on F1",
      "reason": "It breaks no criterion and no runtime behavior main had; product 07 routes a maintainability defect as a follow-up."
    },
    {
      "option": "Leave F1 in the report only",
      "reason": "A defect met and not fixed is recorded as a decision with a named follow-up."
    },
    {
      "option": "Change the recognition in this verification",
      "reason": "A verifier never edits the implementation it judges."
    }
  ],
  "followup": "A WO-220 repair, if one happens, or the next order that edits scripts/probes/local-model-role-qualification.mjs; low priority. Rule a repair must hold: retained-record schema recognition depends on the schema value that the pinned retained build defines, for example a table from retained build hash to its T1 schema hash, never on the current function's source text. A comment-only or formatting-only edit to taskSchema leaves all 38 retained records valid. Any change to a schema value still refuses them, and retained source is never executed.",
  "reopenWhen": "A repair binds retained schemas by value with a case that fails without it, or a later formatting change to taskSchema refuses retained records."
}
```

## WO-220-D033

<!-- integration refs/dotln/checkpoint/WO-220/6 -->

```json
{
  "id": "WO-220-D033",
  "date": "2026-10-24",
  "dispatch": "resume: final review; worktree integrate WO-220",
  "decision": "Integration took in nothing: local main, the main the helper fetched and the branch base are all f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1, the branch carries no commit of its own, no authored conflict arose and no projection was resolved by hand. Carried-forward claims, judged in FINAL-001: the executor's complete review row at code identity 881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6, which VER-001 consumed and judged, stands for the integrated tree, because the identity probe read the same value after the merge and this review changes no code; application target v0.95.0 remains current over the v0.94.0 baseline with no component-version collision (kernel 0.8.0, skeleton 0.68.0, browser-evidence 0.2.0 and console 0.4.8 are this order's own bumps, D021, and neither origin nor the local tags hold a release above v0.94.0); the selected editions (authority at WO-220 revision 002; artifact identity, verification and feedback at revision 001) and the sibling registry's v0.94.0 row are unchanged evidence inputs, the sibling receipt of 2026-10-23T23:53:21Z being release-close bookkeeping carried in at activation and present in no commit of main. The integration's own regeneration changed only this record, its index row and the order's meter snapshot. The affected checks the helper printed pass at the reviewed tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-220/6",
    "base f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1",
    "upstream f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1",
    "release preparation: WO-220 target v0.95.0 remains current. Files changed: docs/evidence/WO-220/meta.json. Meter snapshot: docs/evidence/WO-220/meta.json, 4104 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity from scripts/lib/gate-evidence.mjs after the merge and after the affected checks: 881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6, the identity of the passing npm test -- --review row recorded 2026-10-24T07:43:01.719Z (40 required suites, 106 fresh tasks, none unrun or reused, exit 0, 1,491.907 s).",
    "git ls-remote origin refs/heads/main and refs/remotes/origin/main: f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1. git tag -l and git ls-remote --tags origin: newest v0.94.0. Of docs/work-orders, only WO-220 and the generated index name v0.95.0.",
    "Against refs/dotln/checkpoint/WO-220/6 the integrated tree differs in docs/evidence/WO-220/decisions.md (this record), docs/evidence/WO-220/meta.json (the meter snapshot) and docs/lineage/decisions-index.md (this record's row); every other tracked and untracked file matches the checkpoint's blob.",
    "Affected checks at the reviewed tree, each exit 0 under node scripts/harness.mjs bounded: npm run publication:check (29 and 45 linked source sections match, both editions current); node scripts/harness.mjs check (35 generated surfaces); npm run release -- check-surfaces --local (license surfaces and the six package publish refusals as expected); npm run meta -- --check (the boarded cold-start and sequence-size advisories, no reopen candidate)."
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

Integration date: 2026-10-24. Original base: `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`.
Fetched main: `f80701eaa73d25fa8a54bb5e53aba357a0f2c5b1`. Checkpoint: `refs/dotln/checkpoint/WO-220/6`.
Named stash retained: `e9720d256cb9bd6a11ea6eb0992d457d397caacf` (WO-220 integrate 2026-10-24).
Resolved projections: none.
Release preparation: WO-220 target v0.95.0 remains current. Files changed: docs/evidence/WO-220/meta.json. Meter snapshot: docs/evidence/WO-220/meta.json, 4104 bytes. Tag observation: local snapshot only.
Carried-forward claims: judged in [FINAL-001](../../final-reviews/WO-220/FINAL-001.md); the executor's complete review row at code identity `881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6` stands for the integrated tree, v0.95.0 remains current with no component-version collision, and the selected editions and the sibling registry row are unchanged evidence inputs. Acceptance: FINAL-001's verdict, recorded by `final-review-result`.
Authored conflicts observed: none.
Affected checks: run at the reviewed tree by the final review, each exit 0 (publication check with both editions current, harness check 35 surfaces, release surfaces, meta check with the boarded advisories).

## WO-220-D034 — Final review: pass at the integrated identity; VER-001's F1 stays on its row

```json
{
  "id": "WO-220-D034",
  "date": "2026-10-24",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes all seven criteria at code identity 881d4a43ef351238cd74bc374006924fb5cf632521bd93561fb230b2f57b39e6, the identity the executor handed off, VER-001 judged and integration kept, and lists no finding of its own. VER-001's F1 (WO-220-D032, FUP-1330ac1551dff7d1: validateRecordInputs recognizes the retained WO-138 schema by the current taskSchema function's source text) stays on its row, untriaged, with its repair rule. It breaks no criterion and no runtime behavior main had. It fails closed with a message that names its cause ('unsupported retained task schema'), so the next edit that reformats taskSchema meets it in the local-runner-double suite rather than in a wrong evaluation. Its repair decides how a retained build's schema is recognized without executing that build, beside the function's rule that historical evaluation supplies the retained bytes and never a replacement hash or an allowlist; that choice about how historical evidence binds is better judged by its own verification than certified by the reviewer who writes it. The probe is a declared harness-probe machinery source, so a repair here would also owe a fresh complete review for a maintenance property. The other rows the touching query matches keep their dispositions. FUP-d0a9719cc2e4ec55 stands as its decision records it. FUP-d2646e66a2dfdb40 also stands: its canonical-demo sweep is still regenerated from the current runtime and compared with the base manifest, but a probe at the reviewed tree shows the mismatch WO-219-D008 recorded is the compiler version label alone, the digest this order's after-base policy masks, so planning can weigh that when it binds the sweep. FUP-268c774fd159addb, FUP-848fd8e2ac941bc3 and FUP-ce1f662a6b966a2a each name WO-220's activation (its executor may take the row inside the Boy Scout bound) as one reopening clause. That clause occurred at 2026-10-24T05:19:10.126Z and the executor did not take them, because criterion 4 leaves another batch's rows as they are; their other clauses stand, and the next planning pass re-triages them. Planning receipt 053's criterion-7 known issue has half its reopening condition: this order recorded the source-change-host.ts re-mint and a live feedback episode (feedback edition 001, carried false); WO-204 has not run.",
  "evidence": [
    "npm run plan -- followups --show for each of the twenty listed ids at the integrated tree, one bounded run, exit 0: 14 settled and 6 declined; each latest disposition is dated 2026-10-24T06:02:34.695Z to 06:02:36.558Z, after WorkOrderActivated at 05:19:10.126Z in docs/control/orders/WO-220.jsonl, sits on its row's latest source revision and names its WO-220 decision.",
    "npm run plan -- followups --touching under node scripts/harness.mjs bounded, exit 0, register revision 45a45d06237e91a4e18e9371d92cdd06a02b01f96866fdf1e60ec222d5b2349e: 144 paths, 179 pending, 6 matched on one page; FUP-268c774fd159addb, FUP-848fd8e2ac941bc3, FUP-ce1f662a6b966a2a, FUP-d0a9719cc2e4ec55 and FUP-d2646e66a2dfdb40 deferred, FUP-1330ac1551dff7d1 untriaged.",
    "The latest dispositions of FUP-268c774fd159addb, FUP-848fd8e2ac941bc3 and FUP-ce1f662a6b966a2a, recorded 2026-10-24T04:18:36Z to 04:18:38Z by the intake-mining planning pass, each list WO-220's activation among their reopening clauses beside a clause naming the next order that edits the row's own surface.",
    "scripts/probes/local-model-role-qualification.mjs validateRecordInputs: currentSchema is `export ${taskSchema.toString()}`, and the comment above the function requires historical evaluation to supply the retained source bytes, never a replacement hash or an allowlist. scripts/test-runner.mjs lists the probe among the harness-probe machinerySources, and its local-runner-double suite, a document suite, runs scripts/probes/local-model-role-qualification.test.mjs.",
    "At the reviewed tree after npm run build: node scripts/harness.mjs bounded -- node --test --test-concurrency=1 over the five WO-103 and WO-105 lane files passed 27 of 27 in 80.4 s and reported base-source-drift against 2b1af1abfd947068c402daa1ee24b447fc81b1af for 66 changed runtime sources, with every masked comparison passing.",
    "Canonical-demo probe at the reviewed tree after npm run build, under the bounded wrapper: runScenario(demoTree()).log is 23,831 bytes with sha256 975e9b68b015c5ce866d87e2c8b91aaea037fbadc6a9d02020ab76267ba9dfbd and carries compilerPackageVersion 0.31.0; replacing it with the base's 0.21.0 (packages/compiler/package.json at 2b1af1ab) gives 23,831 bytes and 9e8189597856ee30dac7701c603e2b2433bd23f0f9b5b62db8780db450a38964, the logSha256 corpus/manifests/WO-105.json pins for that sweep.",
    "docs/planning/refutations/2026-10-24-planning-783a352b583108a3-053.md judged WO-220 aligned-with-findings with one criterion-7 known issue; docs/evidence/WO-220/feedback-001/edition.json records liveAudit.carried false and evidence-source-inventory.json the Codex gpt-6.1-sol max episode over ten fixtures."
  ],
  "rejected": [
    {
      "option": "Repair F1 in this review",
      "reason": "It changes no runtime result and fails closed with its cause named. The repair is a recognition design for historical evidence (which retained builds are recognized, and by what value) beside the function's no-allowlist rule. It would owe a fresh complete review for a maintenance property, and the 2026-10-17 pass routes such rows to the next batch cut for the subsystem."
    },
    {
      "option": "Take FUP-ce1f662a6b966a2a inside the Boy Scout bound because its reopening clause names this order's activation",
      "reason": "Criterion 4 leaves another batch's rows as they are; the row is WO-225's, and its clause naming the next order that edits packages/console/src/values.ts still holds."
    },
    {
      "option": "Re-dispose the three rows whose WO-220 clause occurred",
      "reason": "Their dispositions belong to the planning pass that set them; the clause offered this order the rows and did not oblige it, and their other clauses still hold."
    }
  ],
  "reopenWhen": "A repair binds retained schemas by value with a case that fails without it (FUP-1330ac1551dff7d1); the next planning pass re-triages the three rows whose WO-220 clause occurred; or WO-204 records its own source-change-host.ts re-mint and live feedback episode, completing receipt 053's condition."
}
```
