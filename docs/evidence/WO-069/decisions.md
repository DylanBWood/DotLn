# WO-069 decisions

## WO-069-D001

```json
{
  "id": "WO-069-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Ship `dotln.config.json` schema version 1 with four sections — `roots`, `repositories`, `build`, `release` — validated positively with unknown keys refused, and consume only `roots` in this order. `repositories` is required to be an object of objects; `build` (`loadout`, `profile`, `overlay`) and `release` (`readmeBlock`, `componentVersions`, `corpus`, `publicationCheck`) are validated and exposed with today's behaviour as their defaults, and left for the orders that own them.",
  "evidence": [
    "docs/work-orders/WO-069-configuration-root.md",
    "docs/work-orders/WO-033-compiled-starter-export.md",
    "scripts/lib/config.mjs",
    "scripts/test-configuration-root.mjs"
  ],
  "rejected": [
    {
      "option": "Wire the `release` toggles into the release surfaces now",
      "reason": "It is a behaviour change to the release plane that no acceptance criterion asks for and that criterion 1's byte-identity would have to absorb; WO-074/WO-076 own the consuming side."
    },
    {
      "option": "Omit `build` and `release` from version 1",
      "reason": "The cited umbrella wording defines the schema with those sections; declaring and validating them now keeps one schema version rather than two."
    },
    {
      "option": "Environment variables per root",
      "reason": "Recorded in the order: one reviewable file beats a set of variables."
    },
    {
      "option": "A global mutable config object",
      "reason": "Recorded in the order: the loaded configuration is passed explicitly, so a fixture launchpad and the real one can be resolved in one process."
    }
  ],
  "reopenWhen": "The first consumer of `build` or `release` (WO-074, WO-076) finds the declared shape insufficient, or a launchpad needs a section this version refuses."
}
```

Goal and critical path: the control plane must be able to run a launchpad whose
document layout is not this repository's. Until this order it could not, which
blocks the export kit and every target-repository child of WO-033. The schema is
the smallest reviewable surface that makes the layout data instead of code.

System traps: policy resistance is bounded because an absent file changes
nothing; commons cost is one loader plus one guard suite, not a per-script
convention; drift to low performance is checked by the byte-identity transcripts
below; escalation is bounded by keeping `repositories`, `build` and `release`
validated but unconsumed; success to the successful is countered by recording
the declined alternatives the order already named; shifting the burden is
avoided because the guard refuses a new literal rather than asking a reviewer to
notice one; rule beating is countered by a guard that reads the sources rather
than a convention in prose; seeking the wrong goal is checked against a fixture
launchpad that actually drives the lifecycle, not against the count of literals
removed. Naive Interventionism: the defaults reproduce today exactly, so the
change can be judged by what it does not alter.

## WO-069-D002

```json
{
  "id": "WO-069-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Resolve the launchpad as `DOTLN_LAUNCHPAD` first, then by walking up from the running `scripts/` checkout to the first directory containing `dotln.config.json` or a `.git` entry, then the scripts' own checkout. The working directory never selects a launchpad.",
  "evidence": [
    "scripts/lib/config.mjs",
    "scripts/test-resume.sh",
    "scripts/test-configuration-root.mjs",
    "docs/product/07-execution-guide.md#where-the-control-plane-finds-its-documents"
  ],
  "rejected": [
    {
      "option": "Walk up from the working directory, as WO-033 phase 1 describes",
      "reason": "Observed failure, not a preference: every fixture in this suite copies `scripts/` into a temporary checkout and runs it with the working directory still inside this repository. A working-directory ascent made `scripts/test-resume.sh`'s WO-019 boundary fixture read this repository's own documents instead of its own, and it would let one checkout's session write into another's. `DOTLN_LAUNCHPAD` covers the case the ascent was meant to serve."
    },
    {
      "option": "Consult the Git top level only when it differs from the scripts' checkout",
      "reason": "It never differs in a checkout, so the branch would be unreachable; treating `.git` as a stopping condition of the same ascent keeps the umbrella's wording and stays safe."
    }
  ],
  "reopenWhen": "A vendored kit (WO-074/WO-075) or a target worktree (WO-072) needs a launchpad that neither the ascent nor `DOTLN_LAUNCHPAD` can name."
}
```

## WO-069-D003

```json
{
  "id": "WO-069-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Declare eighteen roots rather than the umbrella's twelve, and default a nested root under its parent: `orders` under `control` and `refutations` under `planning`, with every other root under the `docs` base. `workstreams` is declared with no control-plane surface; `lineage`, `product`, `discovery`, `observations` and `decisions` are added because this plane actually resolves them.",
  "evidence": [
    "docs/work-orders/WO-033-compiled-starter-export.md",
    "scripts/lib/config.mjs",
    "scripts/lib/meta.mjs",
    "scripts/check-publication.mjs",
    "scripts/lineage.mjs"
  ],
  "rejected": [
    {
      "option": "Exactly the umbrella's twelve roots",
      "reason": "This order's own objective is that every document root resolves through the loader. Six roots this plane reads — lineage, product, discovery, observations, decisions and the `docs` base itself — are absent from that list, and leaving them literal would leave the plane unportable while the guard reported success."
    },
    {
      "option": "Map `workstreams` onto `docs/lineage`",
      "reason": "No evidence supports the equation. WO-081's workstreams are a board view over work-order data, and no `docs/workstreams` surface exists; the root is declared and documented as carrying no surface yet."
    },
    {
      "option": "Give every root an independent default",
      "reason": "A launchpad that moves `control` would silently leave its order segments behind under the old path."
    }
  ],
  "reopenWhen": "A later order introduces a workstream document surface, or a root this plane reads is still missing from the schema."
}
```

## WO-069-D004

```json
{
  "id": "WO-069-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "The criterion 3 guard covers every non-test `.mjs` file under `scripts/`, excluding `scripts/lib/config.mjs` itself. Test files keep their literal default-layout paths. A literal is judged path-shaped: a `docs/...` string or template with no whitespace, or a `docs\\/` fragment inside a regular expression. A second root derivation is any `import.meta.url` or `import.meta.dirname` combined with a parent-directory traversal.",
  "evidence": [
    "scripts/test-configuration-root.mjs",
    "scripts/test-resume.sh",
    "scripts/test-control-segments.mjs"
  ],
  "rejected": [
    {
      "option": "Refuse literal roots in the test files too",
      "reason": "The suites' literal `docs/...` assertions are the independent check that an absent configuration still means today's layout. Deriving them from the same loader they test would make criterion 1's byte-identity self-confirming."
    },
    {
      "option": "Refuse every occurrence of the text `docs/`",
      "reason": "Help text, generated prose and historical links mention roots in sentences. Refusing those would push documentation into the loader without making anything portable."
    }
  ],
  "reopenWhen": "A literal root reaches a released surface through a file the guard does not read, or a prose exemption is used to smuggle a real resolution."
}
```

## WO-069-D005

```json
{
  "id": "WO-069-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Leave the compiled packages under `packages/` resolving their own Git-ignored local harness lane (`docs/control/local/...`) on the default path, and state the limit in product 07, in the fixture test and here.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs",
    "packages/skeleton/src/usage-observation.mjs",
    "packages/skeleton/src/writer-teardown.mjs",
    "packages/compiler/src/codex-continuation.mjs",
    "docs/work-orders/WO-033-compiled-starter-export.md",
    "scripts/test-configuration-root.mjs"
  ],
  "rejected": [
    {
      "option": "Import `scripts/lib/config.mjs` from the packages",
      "reason": "It inverts the kit/plane dependency that WO-033's Beacon-portability bullet reserves for WO-070, and it would put a launchpad-resolving script inside the exported kit before that decision is made."
    },
    {
      "option": "Duplicate the loader inside `packages/skeleton`",
      "reason": "Two loaders is exactly the condition this order removes."
    }
  ],
  "followup": "WO-070 carries the kit's own root resolution: the packages' `docs/control/local` lane should follow the launchpad configuration once the plane/kit module identity is settled. Until then a configured launchpad writes its ignored local harness state on the default path.",
  "reopenWhen": "WO-070 settles the module identity, or a launchpad cannot tolerate an ignored default-rooted local lane."
}
```

## WO-069-D006

```json
{
  "id": "WO-069-D006",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Keep the exported default-layout constants (`LEGACY_CONTROL_PATH`, `CONTROL_ORDERS_PATH`, `orderSegmentPath`, `RECEIPTS`, `OVERRIDES`, `ADJACENT_QUEUE`, `FOLLOWUPS`, `LOCAL_AUTHORITY_GRANTS`, `PLAN_MAP`, `PLAN_LEDGER`) computed from the loader's defaults, and add root-aware accessors that the plane itself uses.",
  "evidence": [
    "scripts/lib/control.mjs",
    "scripts/lib/plan-receipts.mjs",
    "scripts/lib/planning-followups.mjs",
    "scripts/lib/adjacent-queue.mjs"
  ],
  "rejected": [
    {
      "option": "Replace the constants with functions everywhere",
      "reason": "It would rewrite several hundred call sites in the suites without changing any behaviour, against criterion 1's requirement that the existing suites pass unchanged."
    }
  ],
  "reopenWhen": "A default-layout constant is found on a path that a configured launchpad must move; the fixture launchpad test is the detector."
}
```

## WO-069-D007

```json
{
  "id": "WO-069-D007",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Record that the order's observed gap is stale and report the surface actually met. The order counts 81 literal roots and eleven root derivations from a 2026-09-06 sweep of `main` at 33e2c25; at execution, measured over `HEAD` (010b3ba5), the non-test surface under `scripts/` was 211 string literals, 52 template literals and 12 regular-expression fragments across 61 of 99 files, plus 35 root derivations in five shapes — two of which the sweep did not name (`import.meta.dirname`, and template literals carrying a root).",
  "evidence": [
    "docs/work-orders/WO-069-configuration-root.md",
    "docs/evidence/WO-069/configuration-root.md"
  ],
  "rejected": [
    {
      "option": "Report the order's counts as the observed surface",
      "reason": "They were not measured at this revision: 81 literal roots against 275 measured, and eleven derivations against 35. An unchecked inherited count is exactly the claim the evidence rule refuses."
    },
    {
      "option": "Narrow the work to the 81 occurrences the sweep named",
      "reason": "The guard would then pass while the plane stayed unportable, and the fixture launchpad test would fail."
    }
  ],
  "reopenWhen": "A refutation judges the dated gap and its missing cost evidence, which WO-126 already requires of this order."
}
```

## WO-069-D008

```json
{
  "id": "WO-069-D008",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Repair two adjacent defects met while executing, inside this order's paths: `scripts/test-worktree-integration.mjs` overlays the whole `scripts/lib` directory onto its clone instead of five named files, and `scripts/lib/intake-reconciliation.mjs` classifies ignored material against the launchpad it is reconciling.",
  "evidence": [
    "scripts/test-worktree-integration.mjs",
    "scripts/lib/intake-reconciliation.mjs",
    "scripts/lib/paths.mjs"
  ],
  "rejected": [
    {
      "option": "Add each newly required library file to the fixture's copy list",
      "reason": "The list was already a latent hazard: it mixes working-tree modules with the clone's committed peers, so any library change that spans two files splits the fixture. The directory overlay removes the hazard rather than deferring it."
    }
  ],
  "reopenWhen": "The integration fixture needs a committed library version to differ deliberately from the working tree."
}
```

## WO-069-D009

```json
{
  "id": "WO-069-D009",
  "decision": "Fail verification finding F1: the lineage command and planning-pass readers still resolve the default lineage root after a valid launchpad moves it. Keep the implementation unchanged for the executor to repair.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "scripts/lineage.mjs",
    "scripts/lib/plan-direct.mjs",
    "scripts/lib/plan-receipts.mjs"
  ],
  "reopens": {
    "decisionId": "WO-069-D006",
    "observation": "Matched default and configured fixtures show live consumers of PLAN_LEDGER and defaultDocRelative: default succeeds, configured lineage is read from docs/lineage and fails ENOENT."
  },
  "followup": "Repair WO-069 VER-001 F1: use root-aware paths for live lineage and planning consumers, audit remaining default constants, and add configured-root behavioral coverage.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records defects against the current subject; the executor owns repair."
    },
    {
      "option": "Pass on the green product gate and literal-root guard alone",
      "reason": "Independent executable counterexamples contradict the promised behavior."
    }
  ],
  "reopenWhen": "The executor repairs the named finding and a fresh independent verification reproduces the original acceptance criteria."
}
```

## WO-069-D010

```json
{
  "id": "WO-069-D010",
  "decision": "Fail verification finding F2: projected(root) collects configured follow-up references but calls validate(state) without the root, rejecting a valid configured candidate.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "scripts/lib/planning-followups.mjs"
  ],
  "followup": "Repair WO-069 VER-001 F2: carry the launchpad through follow-up validation and test plan followups --sync with a moved product/planning/evidence root.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records defects against the current subject; the executor owns repair."
    },
    {
      "option": "Pass on the green product gate and literal-root guard alone",
      "reason": "Independent executable counterexamples contradict the promised behavior."
    }
  ],
  "reopenWhen": "The executor repairs the named finding and a fresh independent verification reproduces the original acceptance criteria."
}
```

## WO-069-D011

```json
{
  "id": "WO-069-D011",
  "decision": "Fail verification finding F3: the guard misses the existing two-step module-URL root derivation in writing-worker-probe.mjs, whose report default writes into the tool checkout despite DOTLN_LAUNCHPAD.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "scripts/lib/writing-worker-probe.mjs",
    "scripts/test-configuration-root.mjs"
  ],
  "reopens": {
    "decisionId": "WO-069-D004",
    "observation": "The guard passes while renderReport({date}) writes the report under the copied tool checkout instead of the separately configured launchpad. The remaining derivation stores the module directory in here before resolving ../.. ."
  },
  "followup": "Repair WO-069 VER-001 F3: centralize the remaining derivation, separate kit fixture inputs from launchpad outputs, and make the guard detect the demonstrated two-step form.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records defects against the current subject; the executor owns repair."
    },
    {
      "option": "Pass on the green product gate and literal-root guard alone",
      "reason": "Independent executable counterexamples contradict the promised behavior."
    }
  ],
  "reopenWhen": "The executor repairs the named finding and a fresh independent verification reproduces the original acceptance criteria."
}
```

## WO-069-D012

```json
{
  "id": "WO-069-D012",
  "decision": "Fail verification finding F4: the license-surface error handler now references block-scoped legalPath outside its scope, replacing the activation-base structured failure with ReferenceError when LEGAL.md is absent.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "scripts/license-surfaces.mjs",
    "scripts/test-license-surfaces.mjs"
  ],
  "followup": "Repair WO-069 VER-001 F4: keep the resolved legal path available to the error handler and cover missing or unreadable legal-document failures in default and configured layouts.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records defects against the current subject; the executor owns repair."
    },
    {
      "option": "Pass on the green product gate and literal-root guard alone",
      "reason": "Independent executable counterexamples contradict the promised behavior."
    }
  ],
  "reopenWhen": "The executor repairs the named finding and a fresh independent verification reproduces the original acceptance criteria."
}
```

## WO-069-D013

```json
{
  "id": "WO-069-D013",
  "decision": "Fail verification finding F5: the unchanged harness fixture copies newly dependent helper modules without config.mjs, so existing executable cases fail with ERR_MODULE_NOT_FOUND even though the product-only npm test passes.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "scripts/test-harness.mjs",
    "scripts/lib/harness.mjs"
  ],
  "followup": "Repair WO-069 VER-001 F5: make the harness fixtures carry the complete required dependency set; rerun the failing existing harness cases (57, 79, 82, 87), diagnose the operator-release barrier timeout, and pass the machinery gate without weakening assertions.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records defects against the current subject; the executor owns repair."
    },
    {
      "option": "Pass on the green product gate and literal-root guard alone",
      "reason": "Independent executable counterexamples contradict the promised behavior."
    }
  ],
  "reopenWhen": "The executor repairs the named finding and a fresh independent verification reproduces the original acceptance criteria."
}
```

## WO-069-D014

```json
{
  "id": "WO-069-D014",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 through F5 by carrying the selected launchpad into every named live consumer and validator, using TOOL_ROOT only for writing-worker kit inputs while findLaunchpad selects its document outputs, preserving the legal-document path across its error handler, and adding config.mjs to the copied harness fixture dependency graph. Extend behavioral coverage with the verifier's configured-root and missing-file counterexamples and require the full machinery gate to pass without weakened assertions.",
  "evidence": [
    "docs/verifications/WO-069/VER-001.md",
    "docs/evidence/WO-069/configuration-root.md",
    "scripts/test-configuration-root.mjs",
    "scripts/test-license-surfaces.mjs",
    "scripts/test-harness.mjs"
  ],
  "rejected": [
    {
      "option": "Change launchpad discovery to start from the working directory",
      "reason": "VER-001 explicitly preserves D002, and the failures occur after a valid launchpad has already been selected. Carrying that root through consumers repairs the observed behavior without reopening copied-script isolation."
    },
    {
      "option": "Treat the operator-release barrier timeout as an unrelated deferred defect",
      "reason": "After config.mjs completed the harness fixture's copied dependency graph, all 108 harness fixture cases passed, including the barrier. Executable evidence resolves the verifier's stated causal uncertainty."
    },
    {
      "option": "Loosen the literal/root-derivation guard or the configured-reference validator",
      "reason": "That would make the existing checks pass while preserving the wrong-checkout writes and rejected configured references demonstrated by VER-001."
    },
    {
      "option": "Move the compiled packages' local harness lane in this repair",
      "reason": "D005 records that boundary for WO-070; none of VER-001 F1 through F5 requires a package/plane module-identity change."
    }
  ],
  "reopenWhen": "Fresh independent verification reproduces any VER-001 counterexample, finds another live default-layout consumer after a launchpad is selected, or the final product gate contradicts the targeted and machinery evidence."
}
```

Goal and critical path: the repair restores the portable-launchpad behavior
that WO-074 and the target-repository children consume, while retaining the
already-proven default byte identity. Policy resistance and rule beating are
addressed by passing the same launchpad to collection, validation, projection
and integration and by exercising the exact counterexamples, rather than
trusting the loader or guard in isolation. Drift to low performance and seeking
the wrong goal are checked by the configured behavior and full existing-suite
gate. Commons cost is one expanded product fixture plus the already-declared
machinery gate, with no subagent fan-out. Escalation is bounded to the five
findings. Success to the successful does not protect the default constants:
live consumers move to root-aware accessors while compatibility exports remain.
Shifting the burden is avoided because executable fixtures replace operator
inspection. Naive Interventionism favors these narrow data-flow repairs over a
new discovery mechanism or package/plane boundary. NoOp would leave five
reproducible failures on the configuration root that blocks the export path.

## WO-069-D015

```json
{
  "id": "WO-069-D015",
  "date": "2026-09-21",
  "dispatch": "resume: fix",
  "decision": "Record, but do not fold into WO-069, the adjacent concurrency-sensitive failure of WO-143's filesystem-boundary matrix. The canonical WO-069 gate observed one synthetic abandoned host PID as live; the identical compiled test then passed alone across all 344 boundaries. Package sources are unchanged by WO-069, and the failure's cause is not established.",
  "evidence": [
    "docs/evidence/WO-069/configuration-root.md",
    "packages/skeleton/test/resident.test.ts",
    "docs/control/local/harness/checks.json"
  ],
  "followup": "WO-143 follow-up: test whether allocating a freshly observed dead PID inside each filesystem-boundary fixture removes the concurrency-sensitive live-host failure; paths packages/skeleton/test/resident.test.ts and packages/skeleton/src/worker-store.ts; check the named WO-143 case under the product runner's concurrent load and alone; priority high because it can fail the canonical product gate.",
  "rejected": [
    {
      "option": "Change the package test or worker-store behavior inside WO-069",
      "reason": "The configuration-root order declares no package-source change, the isolated case passes, and the available evidence does not establish a runtime defect or validate the PID-reuse hypothesis."
    },
    {
      "option": "Ignore the failed canonical gate after an isolated pass",
      "reason": "A passing rerun does not erase the observed failure; the durable follow-up preserves its exact trigger, paths and check."
    },
    {
      "option": "Classify the failure as caused by WO-069",
      "reason": "Git diff shows no package source or test changes, the failure is in an unchanged WO-143 fixture, and WO-069's targeted and machinery checks pass."
    }
  ],
  "reopenWhen": "The failure reproduces with a freshly observed dead PID per fixture, appears when the named case runs alone, or evidence connects configured-root changes to the package runtime."
}
```

## WO-069-D016

```json
{
  "id": "WO-069-D016",
  "decision": "Record, and do not route to repair, the residual kit/launchpad conflation in the self-measurement and benchmark scripts: they bind one root to findLaunchpad() and then read kit paths under it, so a launchpad that is not the running scripts' checkout resolves tool fixtures where they do not exist. Observed: with DOTLN_LAUNCHPAD naming a separate launchpad, scripts/harness-context.mjs exports fixtureTree at <launchpad>/scripts/fixtures/harness-context/tree, which is absent, while its evidence output correctly follows the launchpad. No acceptance criterion names these scripts, the default layout keeps the two roots identical, and the failure is a loud missing read rather than a wrong-checkout write.",
  "evidence": [
    "docs/verifications/WO-069/VER-002.md",
    "scripts/lib/config.mjs",
    "scripts/harness-context.mjs",
    "scripts/harness-probe.mjs",
    "scripts/probe-codex-effort.mjs"
  ],
  "followup": "WO-070 follow-up: give the scripts that measure or benchmark this checkout an explicit TOOL_ROOT for kit inputs while their outputs keep the launchpad, as WO-069 VER-001 F3 settled for writing-worker-probe.mjs; paths scripts/harness-context.mjs, scripts/harness-probe.mjs, scripts/probe-codex-effort.mjs and scripts/harness-live-smoke.mjs; check by resolving each kit input under a DOTLN_LAUNCHPAD that is not the scripts' own checkout; priority low because the default layout is unaffected and the failure is a missing-path read.",
  "date": "2026-09-21",
  "dispatch": "resume: verify",
  "rejected": [
    {
      "option": "Fail verification and route this to repair",
      "reason": "No acceptance criterion names these scripts, the required lifecycle, index, status, times, usage, manifest, lineage, follow-up and meta commands all work under a separate launchpad, and the default layout is byte-identical to the activation base."
    },
    {
      "option": "Leave the observation only in the report",
      "reason": "A defect met and not fixed is boarded up with a named follow-up so it survives this order rather than living in one report sentence."
    },
    {
      "option": "Change the implementation during independent verification",
      "reason": "The verifier records against the current subject; repair belongs to an executor dispatch."
    }
  ],
  "reopenWhen": "A launchpad separate from the scripts' checkout has to run one of the named scripts, or WO-070 settles the kit/plane module identity that D005 already assigns to it."
}
```

## WO-069-D017

```json
{
  "id": "WO-069-D017",
  "decision": "Resolve the target-lane receipt under the worktree it belongs to. planHarnessPrune resolved the target receipt directory with docRelative(launchpad, ...) but its installation.json with docRelative(root, ...) inside the same loop, so one worktree's configured control root was used to name a path under another worktree. Changed root to launchpad in scripts/lib/harness-prune.mjs. Default layouts resolve both identically, so this is a no-op for today's repository, which ships no dotln.config.json; under a launchpad that declares a different control root the mismatch silently skipped every target lane rather than failing loudly. Taken as a bounded reviewer cleanup because it is a one-token change inside the order's own subject and the surrounding block already catches configuration errors into pinsUnknown.",
  "evidence": [
    "scripts/lib/harness-prune.mjs",
    "docs/work-orders/WO-069-configuration-root.md",
    "docs/verifications/WO-069/VER-002.md"
  ],
  "followup": "Reviewer follow-up: the same cross-root shape survives in fixture construction, where scripts/lib/copilot-qualification.mjs computes relative names with docRelative(repository, ...) and writes them under a freshly created fixture root that declares no configuration of its own; paths scripts/lib/copilot-qualification.mjs and scripts/harness-live-smoke.mjs; check by building each fixture from a source launchpad whose roots are non-default and running the fixture's own scripts inside it; priority low because a copy that preserves relative structure is defensible and the default layout keeps both sides identical.",
  "date": "2026-09-21",
  "dispatch": "resume: final review",
  "rejected": [
    {
      "option": "Leave the mismatch and record it only as a report sentence",
      "reason": "A defect met at review is fixed within the boy-scout bound or boarded up with a named follow-up; a report sentence alone does not survive this order."
    },
    {
      "option": "Fail final review and route it to repair",
      "reason": "No acceptance criterion depends on it, the default layout is provably unchanged, and a one-token correction inside a named subject path is smaller than a repair cycle."
    },
    {
      "option": "Also rewrite the fixture builders to separate source and fixture layouts",
      "reason": "That changes fixture construction semantics under a hypothetical configuration rather than cleaning an inconsistency, so it is nominated separately instead of widening this diff."
    }
  ],
  "reopenWhen": "A launchpad ships a dotln.config.json whose control root is not docs/control, or WO-070 settles the kit/plane boundary that D005 and D016 already assign to it."
}
```
