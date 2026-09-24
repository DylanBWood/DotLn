# WO-155 decisions

## WO-155-D001

```json
{
  "id": "WO-155-D001",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "decision": "Measure the latest reachable released edition and the first committed snapshot containing each role’s latest global acceptance; retain advisory budget handling. Decide paragraph removal only after the loading observations.",
  "evidence": [
    "docs/work-orders/WO-155-single-source-floor.md",
    "docs/product/07-execution-guide.md#goal-aligned-decisions",
    "scripts/lib/process-budget.mjs",
    "scripts/lib/harness-context.mjs",
    "scripts/lib/meta.mjs",
    "docs/control/budgets.json",
    "docs/evidence/WO-155/cold-start-before.json"
  ],
  "rationale": "Mission: reduce recurring supervision of context growth while preserving the rules needed for the independently verified source-to-deliverable loop. Policy resistance and fixes that fail: keep one metric implementation shared by the CLI and meter. Commons: use one tree-size query per snapshot and a bounded loading probe. Drift: expose actual growth beside unchanged ceilings. Escalation: keep budget observations advisory and add no gate step. Success to the successful: compare batching with current per-file reads rather than preserve them by habit. Shifting the burden: resolve historical baselines mechanically. Rule beating: unavailable history yields null with a cause; no parsing historical prose into a claimed byte observation. Seeking the wrong goal: protect floor completeness before reducing bytes. Naive Interventionism: preserve existing functions, budgets and history; smallest probe is read-only loading plus a byte-equality comparison. NoOp leaves a fixed 2026-09-09 comparison and no acceptance trend.",
  "rejected": [
    {
      "option": "Trim rules, retire acceptance handling, or raise ceilings",
      "reason": "Excluded by the selected order and standing operator direction."
    },
    {
      "option": "Treat the acceptance ceiling or a number in its prose as measured bytes",
      "reason": "A ceiling is a limit; historical reason text can be superseded, as WO-146 D008 records."
    }
  ],
  "reopenWhen": "A supported skill loads without the floor, a history comparison is ambiguous, or executable measurements contradict the selected baseline."
}
```

## WO-155-D002

```json
{
  "id": "WO-155-D002",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Use one git ls-tree size query per snapshot for all installed floor and role files.",
  "question": "Can one tree-size query replace per-file Git reads without changing the measured bytes?",
  "alternatives": [
    "Keep 13 git show processes per snapshot.",
    "Read all 13 blob sizes with one git ls-tree query."
  ],
  "observation": "v0.46.0: all 13 sizes agree; individual 66.86229200000001 ms versus batch 5.4141249999999985 ms, 13 commands versus 1. This is one local probe, not a forecast of per-order savings.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 245.576,
    "tokens": null,
    "commands": [
      "13 git show calls and one git ls-tree -rlz v0.46.0 over the same 13 paths"
    ],
    "source": "Elapsed from the economy announcement at 18:55:11.996Z (current Codex transcript response_item) to first recording at 18:59:17.572Z, including preparation and recording; probe durations from performance.now, retained in ignored wo155-probes/economy.json. The earlier 317.132-second dispatch bound included 71.556 seconds before this experiment was selected and has been corrected from those timestamps."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "One git ls-tree per historical snapshot instead of 13 git show calls"
    ],
    "summary": "Twelve fewer Git processes per measured snapshot, with equal byte counts in the probe; end-to-end per-order savings unmeasured."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/lib/process-budget.mjs",
    "docs/evidence/WO-155/cold-start-before.json"
  ],
  "rejected": [
    {
      "option": "Keep per-file subprocesses",
      "reason": "The observed tree-size query returned identical bytes with fewer subprocesses."
    }
  ],
  "reopenWhen": "Tree sizes cease matching source bytes or missing-file handling regresses."
}
```

## WO-155-D003

```json
{
  "id": "WO-155-D003",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "decision": "Decline criterion 2 under criterion 1: retain the full refusals paragraph in each generated skill because the fresh Claude Explore worker received no floor before its skill read.",
  "evidence": [
    "docs/evidence/WO-155/skill-loading.json",
    "docs/evidence/WO-146/operator-qualification.md",
    "packages/compiler/src/harness.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/work-orders/WO-155-single-source-floor.md"
  ],
  "rationale": "The supported fresh-worker path disproves the completeness prerequisite. A later Copilot explore-task probe independently observed the same omission (skill-loading.json). This is the selected order’s explicit fallback; metric work proceeds. The actual emission site is packages/compiler/src/harness.ts (HARNESS_BOUNDARIES), not the contributor source named in the proposal; retaining it requires no generator change or new role baseline. No current role prose or floor bytes are removed.",
  "rejected": [
    {
      "option": "Remove duplication anyway",
      "reason": "Would remove the only observed copy received by the fresh Claude worker."
    },
    {
      "option": "Change worker loading or add new Read directives",
      "reason": "Outside the bounded emission/metric order and changes reviewed role procedure."
    }
  ],
  "reopenWhen": "Fresh Claude and Copilot workers receive the entire floor before reading a Contributor skill, and every supported loading path has the same floor-before-skill observation."
}
```

## WO-155-D004

```json
{
  "id": "WO-155-D004",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "decision": "Assign v0.46.1 and skeleton 0.39.1; implement the explicit advisory --check switch and retain the selected order’s authority/feedback re-mint and one live self-host episode.",
  "evidence": [
    "docs/work-orders/WO-155-single-source-floor.md",
    "docs/product/06-roadmap.md#release-boundary",
    "docs/evidence/current.json",
    "docs/evidence/WO-154/implementation.md",
    "scripts/lib/evidence-sources.mjs",
    "scripts/harness-context.mjs",
    "scripts/test-process-debt.mjs"
  ],
  "rationale": "The activation heading retained its placeholder. Local tags and the README establish v0.46.0; the declared patch default selects v0.46.1. Skeleton moves only for the order’s explicit edition duty and its consumer pin follows, with no runtime behavior change. The new schema-3 cold-start observation is additive to the existing bytes/previousBytes/delta fields, with an explicit latest-reachable-release baseline instead of the hard-coded v0.16.0. --check now evaluates budget advisories and documents its non-refusing semantics. The authority, feedback, artifact and verification checks all passed before re-mint: the premise that every registered-source edit forces a live episode is outdated under WO-154’s behavior key. Nevertheless criterion 5 explicitly requires this one live episode and two fresh editions; their reason is that requested observation, not a claim that the earlier audit went stale. Artifact and verification keep their passing selected editions. The product additions change no headings or audience link targets; the publication check’s two source locks are refreshed against the reviewed new bytes.",
  "rejected": [
    {
      "option": "Skip the explicitly required re-mint because prior checks pass",
      "reason": "Would leave criterion 5 unfulfilled; this order authorizes one episode."
    },
    {
      "option": "Mint new artifact/verification editions too",
      "reason": "No criterion requires them and executable checks retain those editions."
    },
    {
      "option": "Make --check refuse budget breaches",
      "reason": "Would change the acceptance route and advisory behavior excluded by the order."
    },
    {
      "option": "Retire --check",
      "reason": "Existing role instructions, product text and the gate use it; explicit advisory evaluation preserves those callers."
    }
  ],
  "reopenWhen": "A changed source makes an evidence edition stale, release integration changes the baseline, or operator direction changes the explicit live-episode duty."
}
```

## WO-155-D005

```json
{
  "id": "WO-155-D005",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "decision": "Deliver the measured trend with criterion 2 declined and no byte reduction claimed; preserve all ceilings, acceptances and generated skill bytes.",
  "evidence": [
    "docs/evidence/WO-155/skill-loading.json",
    "docs/evidence/WO-155/cold-start-before.json",
    "docs/evidence/WO-155/cold-start-after.json",
    "scripts/test-process-debt.mjs",
    "packages/skeleton/fixtures/wo157-role-baseline.json",
    "docs/evidence/WO-155/authority/001/authority.json",
    "docs/evidence/WO-155/feedback-001/edition.json",
    "docs/product/07-execution-guide.md#read-order-for-a-cold-start"
  ],
  "observations": [
    {
      "role": "executor",
      "before": 25183,
      "after": 25183,
      "ceiling": 29246,
      "previousEditionBytes": 25183,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": 25183,
      "lastAcceptanceDelta": 0,
      "acceptanceCause": null
    },
    {
      "role": "verifier",
      "before": 21893,
      "after": 21893,
      "ceiling": 25151,
      "previousEditionBytes": 21893,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": 21061,
      "lastAcceptanceDelta": 832,
      "acceptanceCause": null
    },
    {
      "role": "reviewer",
      "before": 23071,
      "after": 23071,
      "ceiling": 24576,
      "previousEditionBytes": 23071,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": 21299,
      "lastAcceptanceDelta": 1772,
      "acceptanceCause": null
    },
    {
      "role": "release-close",
      "before": 14013,
      "after": 14013,
      "ceiling": 16384,
      "previousEditionBytes": 14013,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": 12437,
      "lastAcceptanceDelta": 1576,
      "acceptanceCause": null
    },
    {
      "role": "planner",
      "before": 16161,
      "after": 16161,
      "ceiling": 24576,
      "previousEditionBytes": 16161,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": null,
      "lastAcceptanceDelta": null,
      "acceptanceCause": "no-acceptance"
    },
    {
      "role": "refuter",
      "before": 15736,
      "after": 15736,
      "ceiling": null,
      "previousEditionBytes": 15736,
      "previousEditionDelta": 0,
      "lastAcceptanceBytes": null,
      "lastAcceptanceDelta": null,
      "acceptanceCause": "no-acceptance"
    }
  ],
  "rationale": "The promised saving was conditional on completeness, and the live worker observation defeats that prerequisite. Both generated roots and the floor remain byte-identical to HEAD and pass the current generator check; the existing WO-157 role oracle still passes, so manufacturing a new role snapshot would claim a nonexistent prose change. The CLI and drift signal now share explicit measured baselines. Two tests join the existing process-debt suite; scripts/test-runner.mjs is unchanged, with 56 suite declarations and zero added gate steps. The independent self-host episode returned complete on its first attempt, with ten fixtures and 1,192 saved instruction bytes in its unrelated matched feedback projection; that feedback number is not this order’s cold-start saving. Goal outcome: known growth and preserved complete rules, with no change to the acceptance route or new dependency.",
  "rejected": [
    {
      "option": "Report the proposal’s 1,667-byte saving or its old executor ceiling",
      "reason": "The fallback preserves bytes and current observed executor ceiling is 29,246, not the proposal’s historical 24,576."
    },
    {
      "option": "Add another suite or mutate the existing role oracle",
      "reason": "The metrics fit two cases in the existing suite and generated roles are unchanged."
    }
  ],
  "reopenWhen": "A supported fresh-worker path establishes floor-before-skill loading everywhere, a historical snapshot is unavailable or wrong, or changed source invalidates the recorded checks."
}
```

## WO-155-D006

```json
{
  "id": "WO-155-D006",
  "date": "2026-09-24",
  "dispatch": "resume: verify; VER-001 N1",
  "decision": "Board up a minor presentation defect found in verification. The new drift-to-low-performance rows in renderMeta print an unset (null) cold-start ceiling as 'ceiling unavailable'. The meter's legend and its budget rows keep unset ceilings ('ceiling unset') separate from unavailable observations. The JSON (ceiling null, verdict unset) is correct, and no verdict depends on the label.",
  "evidence": [
    "scripts/lib/meta.mjs renderMeta drift rows format the ceiling with display(row.ceiling), which renders null as 'unavailable'.",
    "npm run meta -- --check on 2026-09-24 at product-code identity 46fe97a1: '.claude/skills/refuter: 15,736 bytes; ceiling unavailable; …; unset', beside the budget row 'current/coldStartBytes.refuter: 15,736; ceiling unset; unset' and the legend 'Unavailable observations are not zero; unset ceilings are not approvals of a future limit.'",
    "docs/verifications/WO-155/VER-001.md"
  ],
  "rejected": [
    {
      "option": "Fail VER-001 for repair",
      "reason": "The label's JSON value is correct and no verdict depends on it. Criterion 3's per-role ceiling is reported, so a repair and re-verification cycle is not proportionate."
    },
    {
      "option": "Edit the renderer during verification",
      "reason": "A verifier never edits implementation to turn its own verdict green."
    }
  ],
  "followup": "Render an unset cold-start ceiling in the meter's drift rows as 'ceiling unset', matching the budget rows and legend, and assert it for an unset role in the process-debt render test. Priority: low; it can ride with the next order that edits scripts/lib/meta.mjs.",
  "reopenWhen": "Another meter or CLI row renders an unset limit as unavailable, or a consumer parses the rendered drift row."
}
```
