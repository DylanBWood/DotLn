# WO-127 decisions

WO-127-D005 supersedes D004's proposed timeout disposition.

## WO-127-D001

```json
{
  "id": "WO-127-D001",
  "date": "2026-09-11",
  "dispatch": "Operator requested automatic retained-control preservation, publication of the pending release and cleanup after the WO-126 closeout failure.",
  "decision": "Extend the existing reconciliation and finish helpers with an ignored archive per work order, exclusive collision copies, whole-plan validation and final byte proof. Keep main active state and gate-evidence handoff separate.",
  "evidence": [
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/worktree.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-worktree.sh"
  ],
  "rejected": [
    {
      "option": "Make all local control state disposable or use another manual closeout script",
      "reason": "The operator requires preservation through the existing guarded lifecycle."
    }
  ],
  "reopenWhen": "A demonstrated retention case cannot be represented by the per-order archive without changing its recovery guarantees.",
  "kind": "decision"
}
```

## WO-127-D004

```json
{
  "id": "WO-127-D004",
  "date": "2026-09-11",
  "dispatch": "Operator asked whether the unchanged test passing meant the timeout would be left for another session to fix.",
  "kind": "correction",
  "misread": "A successful unchanged rerun was presented as sufficient evidence for the harness timeout obligation.",
  "meant": "My interpretation was that the timeout needed a code repair; the operator later clarified that the concern was whether the tests do useful work for DotLn.",
  "changed": "Replaced 28 repeated read-observer subprocess launches with the exact observer API already used by the adjacent receipt fixtures. Retained a generated-hook subprocess and added stale-current-byte rejection after the commit. The baseline case took 2810.186 ms; the experimental case, with the added authored file and stale-byte check, took 1135.196 ms. All original cross-commit and auxiliary-prompt assertions remain.",
  "decision": "Exercise receipt semantics in process and the generated process boundary once in this fixture; retain the existing twenty-second process deadline and run the complete harness suite fresh.",
  "evidence": [
    "scripts/test-harness.mjs",
    "docs/work-orders/WO-127-release-close-recovery.md#execution-record"
  ],
  "rejected": [
    {
      "option": "Accept an unchanged rerun or increase subprocess timeouts",
      "reason": "I judged the repeated startup work worth reducing. This was my engineering choice, not a technique restriction supplied by the operator."
    }
  ],
  "reopenWhen": "The changed fixture fails or its remaining generated-hook process reproduces the timeout; that is a repair finding, not a retry-only disposition."
}
```

## WO-127-D002

```json
{
  "id": "WO-127-D002",
  "date": "2026-09-11",
  "dispatch": "Operator directed repair after the merged WO-126 release gate failed.",
  "decision": "Use the existing exact cost-source projection, acceptance match, recorded revision ancestry and observation-after-recorded-revision bound. Remove the whole-file last-commit timestamp comparison, which rejects execution-only edits and merges despite identical planning inputs.",
  "evidence": [
    "scripts/lib/plan-subject.mjs",
    "scripts/test-plan-refutation.mjs",
    "docs/planning/cost-table.json"
  ],
  "rejected": [
    {
      "option": "Refresh the timestamp on existing planning evidence",
      "reason": "That hides the incorrect freshness predicate and needlessly invalidates immutable planning receipts."
    }
  ],
  "reopenWhen": "A cost-bearing change can pass without a matching source projection and valid recorded observation.",
  "kind": "decision"
}
```

## WO-127-D003

```json
{
  "id": "WO-127-D003",
  "date": "2026-09-11",
  "dispatch": "Operator corrected missing progress and Intent to Act, then explicitly required saving actual runtime and token measurements or permanently removing recurring unmeasured-cost output.",
  "misread": "An earlier silence request was carried past later steering, the repair queue had not recorded its intent, and the shared cost instruction produced repeated missing-measurement narration.",
  "meant": "Continue the authorized repair with visible progress and the equipped queue behavior; collect actual usage and stop recurring unmeasured-cost boilerplate.",
  "changed": "Recorded the actual chat announcement and message-boundary check-in through the local queue. Replaced the shared role cost instruction with sourced evidence collection and removed missing-cost narration from operator updates.",
  "decision": "Keep measurements in evidence and communicate concrete progress. Queue records attest the actor's actions; they do not claim automatic runtime activation or host inbox visibility.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/product/07-execution-guide.md#discipline",
    "scripts/adjacent-work.mjs"
  ],
  "rejected": [
    {
      "option": "Keep repeating that costs are unmeasured",
      "reason": "The operator explicitly rejected that output."
    }
  ],
  "reopenWhen": "The operator explicitly changes the communication preference.",
  "kind": "correction"
}
```

## WO-127-D005

```json
{
  "id": "WO-127-D005",
  "date": "2026-09-11",
  "dispatch": "Operator asked how the test change helped DotLn and whether I was sidestepping useful testing. The later clarification explicitly says the concern was keeping useful tests; no ban on reruns or in-process testing was given.",
  "kind": "correction",
  "misread": "I attributed bans on rerun-only dispositions and in-process testing to the operator, who did not give those instructions.",
  "meant": "Keep tests that establish useful DotLn behavior. Attribute engineering interpretations and implementation choices to the agent; record operator instructions accurately.",
  "changed": "Restored every generated-hook subprocess invocation, retained the additional stale-byte assertion and traced real subprocess operations in isolated diagnostic runs. Both the normal and release execution environments completed 167 hook processes without reproducing the stall; no runtime fix is claimed from those passes.",
  "decision": "Retain useful cross-commit, stale-byte and generated-hook evidence. Judge test structure by the behavior it validates and disclose what executed observations establish.",
  "evidence": [
    "scripts/test-harness.mjs",
    "docs/work-orders/WO-127-release-close-recovery.md#execution-record"
  ],
  "rejected": [
    {
      "option": "Retain the in-process substitution as the timeout fix",
      "reason": "I withdrew my claim that the optimization established a runtime timeout fix. The operator did not prescribe or prohibit the testing technique."
    }
  ],
  "reopenWhen": "Executed evidence or the operator actual instructions change the required behavior or useful coverage."
}
```

## WO-127-D006

```json
{
  "id": "WO-127-D006",
  "date": "2026-09-11",
  "dispatch": "Repair FINAL-001 after the operator required useful tests and completion of the release.",
  "decision": "Replace the generated hook's synchronous fd-0 JSON read with asynchronous stream consumption. Test actual authorship and cross-commit receipts through generated hooks, plus separate large and chunked UTF-8 transport and truncated-input refusal.",
  "evidence": [
    "docs/final-reviews/WO-127/FINAL-001.md",
    "packages/skeleton/src/harness-host.ts",
    "scripts/test-harness.mjs",
    "docs/work-orders/WO-127-release-close-recovery.md#final-001-repair"
  ],
  "observations": {
    "trace": "Local metadata-only trace83052 ends at readFileSync fd0 begin at29.958083ms; fifth isolated repetition timed out. It records no input contents.",
    "focusedDurationMs": 2019.102709,
    "minimalProbe": "100 synchronous and100 asynchronous minimal pipe processes passed; no broader runtime cause is asserted."
  },
  "rejected": [
    {
      "option": "Treat an unchanged successful retry as the repair",
      "reason": "The review failure recurred; the traced input operation provides a concrete repair boundary."
    },
    {
      "option": "Adopt every inherited generated file to test cross-commit authored output",
      "reason": "Real Write/Read hook observations test the authored-file obligation directly; large message coverage is retained separately."
    }
  ],
  "reopenWhen": "The asynchronous path stalls or a generated-process fixture demonstrates changed input, receipt or refusal behavior."
}
```

## WO-127-D007

```json
{
  "id": "WO-127-D007",
  "date": "2026-09-11",
  "dispatch": "The operator explicitly requested fixing repeated stage failures caused by stale generated material.",
  "decision": "Prepare only owned mutable projections in the canonical evidence command after build and before tree identity. Keep unchanged outputs untouched and make package tests wait for preflights. Preserve explicit review inputs and immutable evidence; select a new authority revision for the repaired runtime.",
  "evidence": [
    "scripts/lib/evidence-preparation.mjs",
    "scripts/test-process-debt.mjs",
    "scripts/test-runner.mjs",
    "scripts/test-runner.test.mjs",
    "docs/product/07-execution-guide.md#discipline"
  ],
  "rejected": [
    {
      "option": "Automatically refresh all evidence, publication locks and release targets",
      "reason": "Those carry historical observations or explicit reviewed source/version choices; preparation cannot silently replace that authority."
    },
    {
      "option": "Start package tests while preflights can still refuse",
      "reason": "Prior stale-output failures consumed expensive package workload before the refusal; the shared dependency barrier prevents that waste."
    }
  ],
  "reopenWhen": "Another deterministic owned projection repeatedly causes preparation failures, or evidence shows the preparation changes authored inputs or weakens validation."
}
```
