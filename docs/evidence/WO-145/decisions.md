# WO-145 decisions

## WO-145-D001

```json
{
  "id": "WO-145-D001",
  "date": "2026-09-20",
  "dispatch": "resume: next; operator selected WO-110 and WO-099 as the later trials on 2026-09-20",
  "decision": "Add one optional executor-only tinkerer-economy support through the existing immutable support switches, off by default; validate experiment decisions in the existing generator. Trial orders: WO-145, WO-110, WO-099.",
  "evidence": [
    "docs/work-orders/WO-145-tinkerer-economy-experiment.md",
    "packages/skeleton/src/loadouts/executor-supports.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
    "scripts/lib/meta.mjs",
    "docs/product/05-pattern-library.md#candidate--tinkerer--scientist"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Would leave the explicitly allocated experiment untested for another planning pass."
    },
    {
      "option": "Adaptive modifier first",
      "reason": "No fixed-cadence outcome baseline yet."
    },
    {
      "option": "Periodic or probabilistic activation",
      "reason": "Adds selection state before one-per-order value is known."
    },
    {
      "option": "An agent per quality aspect",
      "reason": "Larger compute and coordination cost than this bounded support."
    },
    {
      "option": "Equip every role or default-on",
      "reason": "Method choices belong to the executor; defaults await the three-trial reading."
    }
  ],
  "reopenWhen": "After both WO-110 and WO-099 have recorded their trials, the next planning pass totals all trial cost and applies the pre-registered reading; sooner if authority, budget, default-off or role isolation fails."
}
```

Goal and critical path: test a bounded way to reduce recurring implementation cost and operator prompting. This is operator-prioritized tooling, not a new dependency of the source-to-deliverable runtime path. Benefit remains unproven until measured.

System traps: policy resistance is bounded by unchanged authority and gates; commons cost includes experiment time, tokens and prompt bytes; drift to low performance is checked by unchanged outcome standards and regression records; escalation is bounded by one experiment and 900 s; success to the successful is countered by credible alternatives and a NoOp option; shifting the burden is tested by whether the support elicits an opportunity without rescue; rule beating is countered by commands for cost/effect and allowing no-change outcomes; seeking the wrong goal is checked against net savings and preserved correctness, not experiment counts. Naive Interventionism: keep useful current guarantees, default off, use existing support composition, and remove equipment reversibly if value is absent.

Trials selected by the operator: WO-145 (packages plus scripts: the decision generator), WO-110 (packages: local-model transport), WO-099 (packages: resident mission check). Results belong in `docs/evidence/WO-145/decisions.md`, `docs/evidence/WO-110/decisions.md` and `docs/evidence/WO-099/decisions.md`. This receipt selects trials, not activation or broader effect authority. At each later trial equip `tinkerer-economy` explicitly through `contributorConfiguredProgram({ "tinkerer-economy": true })` / `harnessInstallation({ supports: { "tinkerer-economy": true } })`, then restore default equipment at handoff.

The later trials share a lane pair, so their selection adds no execution dependency: the third completed trial is whichever finishes last. Totals wait for all three records. Pre-registered reading: after the third trial, its decisions file totals all experiment costs and each adopted recurring saving in seconds and tokens per affected order (unknown counters stay unknown). Propose default equipment only if at least one adopted saving over the next ten orders exceeds the whole trial experiment cost, with no recorded regression. Otherwise remain optional; withdraw if all three trials are declined or inconclusive. Carry last adopted-improvement date, experiments since that adoption and each outcome without implementing adaptive pressure. The next planning pass updates the existing register row from this record.

### First experiment pre-registration

Question: can the existing test-name filter shorten development feedback for decision-record edits while the full file still passes? Alternatives: run all of `scripts/test-process-debt.mjs` on each development iteration; run its two existing decision-focused tests during iteration and the full file at integration. Compare one full-file run with three focused runs on the same unmodified source. Adopt the focused iteration command only if all runs pass and its slowest run takes less than half the full-file run; this is a development method only, not permission to omit required checks. A timeout or failure makes the result inconclusive. Budget: 900 s wall-clock including experiment preparation, measurement and recording; 180 s maximum for any child process. Tokens: observe session counters before and after, label their broader scope. No new dependency or recurring check.

Pre-registration recorded at 2026-09-20T06:24:23.267Z.

## WO-145-D002

```json
{
  "id": "WO-145-D002",
  "kind": "experiment",
  "date": "2026-09-20",
  "dispatch": "resume: next; WO-145 acceptance criterion 3",
  "decision": "Adopt the existing decision-focused test command for development iterations; retain the full file at integration and all required final checks.",
  "question": "Can focused decision tests shorten development feedback while the unchanged full file passes?",
  "alternatives": [
    "Run the entire process-debt test file on each iteration",
    "Use the two decision-focused tests during iteration and the full file at integration"
  ],
  "observation": "All runs must pass; the slowest focused run must take less than half the full-file time.",
  "budget": {
    "wallSeconds": 900
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 163.546,
    "tokens": 497138,
    "commands": [
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs",
      "node --test scripts/test-process-debt.mjs",
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs",
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs"
    ],
    "source": "Wall-clock: pre-registration through this result write; command execution in experiment-measurement.json. Token observation: {\"activity\":{\"stepCount\":5,\"commandsRun\":null,\"source\":\"transcript tool-call metadata; wrapped command count may be unavailable\"},\"source\":\"codex-transcript-counter\",\"scope\":\"dispatch\",\"observedAt\":\"2026-09-20T06:25:45.351Z\",\"usage\":{\"inputTokens\":493810,\"cachedInputTokens\":480896,\"cacheWriteInputTokens\":0,\"outputTokens\":3328,\"reasoningOutputTokens\":941,\"totalTokens\":497138,\"costUsd\":null},\"context\":{\"capacityTokens\":258400,\"lastRequestTokens\":104956,\"classification\":\"last reported request size, not live occupancy\"}}"
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs",
      "node --test scripts/test-process-debt.mjs",
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs",
      "node --test --test-name-pattern='^(decisions require dispatch|only named actions and observed reopenings)' scripts/test-process-debt.mjs"
    ],
    "summary": "Full file: 59.009737208 s, 79 passing tests. Focused: three runs, 2 passing tests each, slowest 0.2680353329999998 s. Saving 58.741701875 s per eligible development iteration in this sample, not per order; frequency and token effect unknown. Final coverage unchanged."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-20",
    "experimentsSinceAdoption": 0
  },
  "evidence": [
    "docs/evidence/WO-145/experiment-measurement.json",
    "Pre-registered comparison above; unchanged source for all four measurements"
  ],
  "rejected": [
    {
      "option": "Full file on every local decision-record edit",
      "reason": "The focused tests passed in under half the full-file time; the full file is still required at integration."
    },
    {
      "option": "Replace the full validation with filtered tests",
      "reason": "They exercise 2 of 79 tests and cannot establish equivalent integration coverage."
    }
  ],
  "reopenWhen": "The full file finds a failure missed by the focused selection, the relevant test names change, or third-trial totals fail the pre-registered reading."
}
```

This is one local paired observation, with three focused samples and one full sample. It does not prove a general benchmark, token saving, changed application behavior or saving on every order. No source was edited during the measurements. The recorded wall window ends here; later implementation and validation belong to the order cost, not this experiment.

## WO-145-D003

```json
{
  "id": "WO-145-D003",
  "date": "2026-09-20",
  "dispatch": "resume: next",
  "decision": "Preserve whole-loadout provenance and test executor-only instruction changes separately from the Origin metadata. Stage application v0.34.0 and skeleton 0.30.0; regenerate the default-off harness and new authority/feedback evidence editions.",
  "evidence": [
    "packages/compiler/src/harness.ts: lowerToHarness uses one semanticHash for every origin",
    "packages/skeleton/fixtures/wo145-role-baseline.json: v0.33.2 role byte hashes",
    "Targeted fixtures: all 12 default-off role files match the previous release; non-executor instructions are unchanged when equipped",
    "Cold start: 23,347 bytes equipped versus 22,174 default, ceiling 24,576; both harnesses"
  ],
  "rejected": [
    {
      "option": "Rewrite origins to keep non-executor files entirely byte-identical when on",
      "reason": "Would misstate the equipped loadout or require changing compiler provenance beyond this support."
    },
    {
      "option": "Change the compiler or runtime schema",
      "reason": "The existing support switches and instruction lowering suffice."
    },
    {
      "option": "Bump unchanged components",
      "reason": "Only skeleton source behavior changes; console follows its exact dependency pin."
    }
  ],
  "reopenWhen": "A verifier requires literal full-file byte equality when equipped, role instructions leak to another role, or the cold-start ceiling is breached."
}
```

Criterion 1 distinction: default-off files are byte-identical including metadata; when on, every Origin semanticHash changes because it describes the whole loadout, while only executor instructional text changes. No compiler provenance has been suppressed. The enabled paragraph adds 1,154 bytes of instructions and 19 bytes in its support origin id (1,173 total). The compatibility fixtures remove only the one Origin comment for the enabled non-executor comparison.

The first-trial token count is the available transcript counter in its recorded time window, including contemporaneous required source reads. It is not a causal allocation to the experiment or a measured token saving. The timing JSON displayed an unquoted test regex although execution used separate argv entries; the same-day correction quotes it for shell reproduction without changing any measurements.

## WO-145-D004

```json
{
  "id": "WO-145-D004",
  "date": "2026-09-20",
  "dispatch": "resume: next; equipped Adjacent Repair; adjacent-0001 announced before the final gate completed",
  "decision": "Correct two inherited publication sentences that denied the bounded live verification evidence already described in the same release block and WO-056 record.",
  "evidence": [
    "README.md: the WO-056 paragraph describes live Claude/Codex verification, while the inherited Not yet sentence included live model verification",
    "docs/publication/everyday-ai-user-toc.md: inherited live model verification remains unwitnessed wording",
    "docs/evidence/WO-056/README.md: bounded live verification and repair evidence",
    "npm run publication:check; npm run release -- check-surfaces --local; git diff --check: all passed after the two-file correction"
  ],
  "rejected": [
    {
      "option": "NoOp or defer to another order",
      "reason": "Would retain a known contradiction in the two publication surfaces already being reviewed for this release."
    },
    {
      "option": "Claim general live verification is complete",
      "reason": "WO-056 proves a bounded planted-defect verification/repair case, not every target or unattended workflow."
    }
  ],
  "reopenWhen": "New evidence changes the bounded live-verification claim or either publication again contradicts its cited evidence."
}
```

This bounded documentation repair supports honest operator decisions, not a new critical-path feature. The D001 trap comparison still applies: correct the outcome claim (drift/wrong goal/rule beating), preserve its limits and existing checks (policy resistance), consume no new runtime or recurring work (commons/escalation), and remove a contradiction without requiring operator rescue (shifting the burden). No competing mechanism is excluded (success to the successful); the two prose edits are reversible (Naive Interventionism).
