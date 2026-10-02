# WO-107 decisions

## WO-107-D001

```json
{
  "id": "WO-107-D001",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Measure the unchanged base 2bae7d407af2d5d07d16c5b15dc63134e277eabd with two independently seeded executions. Use seeds wo107-base-a-20261002 and wo107-base-b-20261002; two warm-ups and nine repetitions for function/demo scenarios, one warm-up and three repetitions for build/kernel-suite/skeleton-suite scenarios. Shuffle eligible scenarios each round; run only one measurement at a time.",
  "evidence": [
    "docs/work-orders/WO-107-profiling-baseline.md",
    "docs/planning/work-order-map.md#counterfactual-profiling-work-orders",
    "packages/kernel/src/core.ts",
    "packages/kernel/src/store.ts",
    "packages/skeleton/src/scenario.ts",
    "docs/evidence/WO-115/scheduling-comparison.json"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves the authorized baseline absent; does not discharge the measurement order."
    },
    {
      "option": "One timing or concurrent harness executions",
      "reason": "Cannot provide repeated distributions or isolate this harness from its own overlapping workload."
    },
    {
      "option": "Ten complete suite repetitions per execution",
      "reason": "Historical skeleton duration alone would consume about 105 minutes including warm-ups; three retained observations per execution provide the required descriptive distribution with explicitly limited sample size."
    }
  ],
  "reopenWhen": "A failed observation, source drift or inability to reproduce the declared registry requires recording the failure before changing the protocol."
}
```

## WO-107-D002

```json
{
  "id": "WO-107-D002",
  "kind": "experiment",
  "date": "2026-10-02",
  "dispatch": "resume: next",
  "decision": "Keep fresh suite measurements; decline substitution with existing gate timings.",
  "question": "Can existing gate timings replace fresh scenario-f measurements?",
  "alternatives": [
    "Reuse WO-115 gate durations",
    "Measure full build and direct kernel/skeleton suites at this base"
  ],
  "observation": "WO-115 measurements belong to an older source and gate schedule, while WO-107 requires two complete executions at its pinned base.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "Reusing historical timings cannot establish this order’s required fresh baseline.",
  "cost": {
    "wallSeconds": 34.932,
    "tokens": null,
    "commands": [
      "Read docs/evidence/WO-115/scheduling-comparison.json and WO-107; record this decision"
    ],
    "source": "Wall time from 2026-10-02T00:48:38.475Z through this decision write; token attribution unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["No experiment executed; fresh measurements retained by decision"],
    "summary": "No method change or recurring saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/evidence/WO-115/scheduling-comparison.json",
    "docs/work-orders/WO-107-profiling-baseline.md"
  ],
  "rejected": [
    {
      "option": "Substitute historical durations",
      "reason": "Different source and scheduling conditions."
    }
  ],
  "reopenWhen": "A later order explicitly accepts historical gate timing as its measurement subject."
}
```

Goal and critical path: supply the first reusable observation corpus for the declared-versus-observed cost loop; this evidence order does not advance or reorder the runtime delivery path. Policy resistance and drift to low performance: keep existing behavior and all gates. Commons and escalation: predeclare counts, retain every result, no repeated campaign in the check. Success to the successful: compare fresh measurements with historical reuse explicitly. Shifting the burden: one executable registry and reproducible comparison remove manual collation. Rule beating: validate samples, schedule, complete scenario sets and recalculated statistics, including failures and outliers. Seeking the wrong goal: no speed target, capability promotion or optimization suggestion. Naive Interventionism: new corpus only, existing runtime remains the measured subject; NoOp leaves the required observation gap.

At base, 13 kernel and 50 skeleton test files were counted from packages/*/test. WO-115 measured skeleton runs at 286.508 and 309.511 seconds: eight runs imply 2292.064–2476.088 seconds (38.2–41.3 minutes), excluding build, kernel and other scenarios. This is an estimate from historical samples, not a promise about this host window. The first declared warm-up re-measures the suite at the pinned base. The live demo means runScenario with its shipped deterministic fake executor/verifier; it invokes no model.

## WO-107-D003

```json
{
  "id": "WO-107-D003",
  "date": "2026-10-02",
  "dispatch": "resume: next; operator memory-safety direction and correction against artificially low caps",
  "decision": "Keep Node’s normal heap setting and use an external macOS watchdog for this order’s test/profiling processes: sample the owned process group and observed descendants every 250 ms, stop at 8 GiB aggregate RSS, non-normal memory pressure, 512 MiB additional host swap, 100 processes, unavailable monitoring or two-hour wall time. Stream child output to private files with a bounded summary buffer. Stop the campaign on the first failed sample and retain its transcript.",
  "evidence": [
    "The operator reported a previous test above 500 GB and directed host protection without lowering normal heap limits or distorting the workload",
    "docs/evidence/WO-102/decisions.md#wo-102-d010",
    "docs/evidence/WO-105/decisions.md#wo-105-d006",
    "node:v8 readback: default heap_size_limit 4.09375 GiB; node:os: 48 GiB physical memory",
    "sysctl readback before implementation: normal pressure (1), pre-existing swap 1491.06 MiB"
  ],
  "rejected": [
    {
      "option": "512 MiB old-space limit",
      "reason": "Would alter the normal heap/GC regime and could distort an otherwise valid timing sample."
    },
    {
      "option": "Unsupervised execution",
      "reason": "Does not respond to the operator’s prior runaway-memory incident."
    },
    {
      "option": "OS-wide process killing or global configuration",
      "reason": "Would affect other sessions and is unnecessary for supervising this order’s owned processes."
    }
  ],
  "reopenWhen": "Any cutoff, failed sample, incomplete monitor coverage, or normal workload approaching the emergency budget requires diagnosis; do not automatically retry or raise limits."
}
```

D003 supersedes the earlier plan only for safety supervision. The watchdog is sampled supervision, not a hard total-memory OS quota. Detached children that appear and reparent between samples may escape descendant attribution; Node’s default heap bound and the host pressure/swap observations are complementary. Cutoffs establish an interrupted measurement, never a performance verdict. This baseline uses the unchanged kernel and does not run WO-102 mutation probes. The prior incident is attributed to the operator’s report; its exact allocation cause remains unknown.

## WO-107-D004

```json
{
  "id": "WO-107-D004",
  "date": "2026-10-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.64.1, the next patch above the observed release baseline v0.64.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.64.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-107-profiling-baseline.md"
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

## WO-107-D005

```json
{
  "id": "WO-107-D005",
  "date": "2026-10-02",
  "dispatch": "resume: next; declared metric and replay boundary",
  "decision": "Use a 36-scenario registry; retain raw warm-ups and measured samples with eight resource distributions. Label CPU/RSS/heap as harness-only, child CPU/memory as unmeasured, and native memory pressure/swap as boundary samples. Compare both executions plus all pairwise differences descriptively, without thresholds or promotion. Keep comparison independent of current built runtime modules.",
  "evidence": [
    "corpus/baselines/SCHEMA-WO-107.md",
    "corpus/harness/wo107-scenarios.mjs",
    "corpus/harness/wo107-records.mjs",
    "node corpus/harness/wo107-bounded.mjs -- node --test --test-concurrency=1 --test-name-pattern=^harness corpus/harness/wo107-schema.test.mjs: nine passing checks; sampled peak 254885888 bytes; no swap growth or outer watchdog cutoff"
  ],
  "rejected": [
    {
      "option": "Present the harness RSS as total suite memory",
      "reason": "process.memoryUsage excludes child processes; that attribution would be false."
    },
    {
      "option": "Only compare medians or give a significance verdict",
      "reason": "Single figures hide variability and the small descriptive samples do not justify a population claim."
    },
    {
      "option": "Execute current runtime to regenerate historical comparisons",
      "reason": "Later runtime identity changes must not invalidate the ability to read the pinned observations."
    }
  ],
  "reopenWhen": "A later reviewed measurement requests process-tree CPU/memory distributions, a different base, statistical inference, or another host platform."
}
```

The platform consumer is the provisional JSONL and its deterministic comparison/check interface. All eight D001 lenses still apply: these choices retain reproducibility without expanding runtime authority, adding a dependency or treating observations as an efficiency-level claim.

## WO-107-D006

```json
{
  "id": "WO-107-D006",
  "date": "2026-10-02",
  "dispatch": "resume: next; second-execution failure diagnosis",
  "decision": "Stop after the failed kernel warm-up and prepare a one-entry JSONL protocol classification repair. The repair requires an explicit exception to WO-107’s new-files-only scope; do not apply it or retry the campaign before that authority exists.",
  "evidence": [
    "Second execution transcript: command/kernel warm-up, 102 tests / 101 pass / 1 fail; UNKNOWN_FIELD at $.baseCommit in the WO-045 store-history test",
    "packages/kernel/test/store-history.test.ts defaults every undeclared corpus JSONL to EventEnvelope",
    "packages/kernel/test/fixtures/jsonl-protocols.json already declares other corpus protocols",
    "scripts/lib/evidence-jsonl.mjs permits order-local evidence paths only and rejects parent traversal, so it cannot declare corpus/baselines from a new evidence file",
    "First execution: 36 complete records, 306 measurements, 69 warm-ups; watchdog peak 1131249664 bytes, zero swap growth",
    "Prepared exact one-entry patch: docs/control/local/wo107-jsonl-classification/proposed.patch"
  ],
  "rejected": [
    {
      "option": "Remove the document test, hide the observations or reinterpret them as kernel events",
      "reason": "Would evade the existing protocol-classification contract or the required full suite."
    },
    {
      "option": "Edit the existing fixture without an exception",
      "reason": "WO-107 explicitly prohibits existing-file edits outside lifecycle records."
    },
    {
      "option": "Automatically repeat the failed command",
      "reason": "The deterministic classification error will remain until the new protocol is registered."
    }
  ],
  "reopenWhen": "The operator authorizes the exact classification entry, or supplies a different bounded scope decision."
}
```

## WO-107-D007

```json
{
  "id": "WO-107-D007",
  "date": "2026-10-02",
  "dispatch": "scope expand: operator authorized the one-entry classification fix in this session",
  "decision": "Apply exactly one nonEventPaths declaration in packages/kernel/test/fixtures/jsonl-protocols.json for the WO-107 observations file. Amend the order to record this narrow scope exception. Keep the first execution unchanged, retain the failed second attempt, and disclose the classification-only metadata overlay on the successful second execution. Bind both collector revisions to archived source and prove every timed measurement function, registry, statistics function, schedule and watchdog unchanged before accepting their comparison.",
  "evidence": [
    "In-session operator approval of the exact one-entry classification exception; the actor-attested check-in is retained in the local adjacent-work queue",
    "WO-107-D006 diagnosis and prepared patch",
    "corpus/harness/wo107-initial-protocol: four byte-exact snapshots, combined SHA-256 feada88b7313d88268cf944257b879acb3d1492dc1651b649a44c37fbe3d2ba4",
    "First complete execution source identity and protocol hash retained in observations-2bae7d407af2d5d07d16c5b15dc63134e277eabd.jsonl"
  ],
  "rejected": [
    {
      "option": "Re-run the valid first execution after a metadata-only classification repair",
      "reason": "Adds about 22 minutes without changing the measured implementations or timed paths. The known classification difference can be disclosed and the original evidence retained."
    },
    {
      "option": "Pretend the collector revisions are identical",
      "reason": "The preflight classification check and report provenance differ; both exact protocol identities must remain visible."
    },
    {
      "option": "Expand repair to runtime behavior or general JSONL classification",
      "reason": "The operator authorized only the exact existing-registry declaration."
    }
  ],
  "reopenWhen": "The classification diff exceeds one exact entry, any timed path differs from the archived protocol, or a later comparison requires identical corpus inventory rather than this disclosed baseline condition."
}
```

D007 reopens D006 with explicit operator authorization. Mission and critical path remain the bounded evidence corpus. Policy resistance is resolved by registering the new protocol with the existing strict reader; commons and escalation favor retaining valid measurements; drift and rule beating are checked by unchanged assertions, full suites and exact timed-path parity; success to the successful and shifting the burden favor the existing registry over a new classifier; the wrong-goal and Naive Interventionism checks exclude runtime optimization. NoOp would leave both the second execution and required document gate failing.

The attempted `npm run plan -- amend-order WO-107 WO-107-D007` with the authorization reason was refused: “execution amendment requires an order in the current judged horizon and an authorization reason.” Inspection of `scripts/lib/plan-receipts.mjs` shows this command only admits orders in the latest planning receipt's `subject.orders`; WO-107 is outside that horizon. `npm run plan -- check` then passed (36 receipts, 25 passes). No planning event was invented or changed; the direct operator authorization is recorded above and in the order's bounded exception.

Before resuming the second execution, the focused store-history test passed and all ten harness tests passed. `protocolLineage()` verified the original protocol above and revised protocol `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd`, including exact timed-byte parity. The normalized pinned source inventory still equals the first execution's `5ce30da15ec3e47f5af343333f6ed6d3480e9c456f5a72385e97b83dee486b97`. The first 36 JSONL records retain SHA-256 `34226e64115c7dacc983677268e1c228448aee34907cf2a4cf292c01bbe14ccb` before the next append.

The public transcript preserves every event and failed attempt. Two absolute worktree-root occurrences in the failure stack were replaced with `<worktree>`; no measurement or command receipt changed. The exact original remains in ignored local recovery material. Public transcript hashes before/after that sole redaction are `72e971e3beefebd2b5d58c046cb16e1120988e9dd9adadee7d42239afd80977b` and `6e20e8038c5b2e7b5a40b7480971e9858132ff2d7ab49749a74df93399f8c013`. First-run observations were not rewritten.

## WO-107-D008

```json
{
  "id": "WO-107-D008",
  "date": "2026-10-02",
  "dispatch": "resume: next; baseline outcome and handoff preparation",
  "decision": "Retain both complete executions, every warm-up and measured sample, the long first-execution observation, and the earlier failed classification attempt. Deliver the provisional schema and read-only reproducible comparison without an efficiency promotion or optimization recommendation. Keep the six matched existing follow-ups on their recorded routes; this order adds no comparison candidate or unrelated repair.",
  "evidence": [
    "72 scenario records: 612 measured samples and 138 warm-ups across the two declared seeds",
    "Observation SHA-256 d433c425636a8c481f4ba0d2a28b1fa9905b4892a28ab7a8fc58b4dd668fc08f; the first 36 records retain their pre-append digest",
    "Generated comparison SHA-256 f7e19da1bb6f2b0457f0edea15c9b913789d72028b8c01334096b05624b81ff6; --compare --check passed without changing observations or report",
    "All 13 harness/schema tests passed after the final build, including immutable first-execution bytes, exact metadata exception and command-receipt validation",
    "npm test -- --serial: 29 suites / 74 fresh tasks passed at code identity 43bb28f92fc0145167115d1f951502c8373edb44d7737e581eb4206756c0063f, recorded 2026-10-02T02:20:50.951Z",
    "Both campaign watchdogs and the product gate recorded zero additional swap and no cutoff; sampled workload RSS peaks were 1131249664, 1129332736 and 1239662592 bytes respectively",
    "npm run plan -- followups --touching; six source sections read and judged below"
  ],
  "rejected": [
    {
      "option": "Discard the slower first-execution sample or re-run for a tighter distribution",
      "reason": "Would violate retention and turn the observation corpus into selected results."
    },
    {
      "option": "Interpret three suite repetitions as a statistically conclusive performance verdict",
      "reason": "This is descriptive evidence on one host with ambient load, cache state and a disclosed classification overlay."
    },
    {
      "option": "Implement the presentation-surface candidate or historical follow-up repairs in this order",
      "reason": "The order authorizes a bounded baseline; its explicit non-goals and one-entry exception do not grant those changes."
    }
  ],
  "reopenWhen": "A later reviewed order allocates another measurement cell, changes the pinned source or measured protocol, or needs a capability-level interpretation. Any resource cutoff remains an interrupted run requiring diagnosis, never a pass."
}
```

Outcome against D001's lenses: the baseline gap is filled with replayable records, while runtime behavior and the capability table remain unchanged. All declared samples and failures are retained; no resource limit was raised or reached. The original distinctions between evidence, interpretation, measurement cost and critical-path runtime work remain intact. The first-execution outlier is visible, and no speed target replaced the authorized goal.

The follow-up scan added these named inputs; none grants new scope:

- **FUP-0044**, planning map §Preserved unallocated candidates: activation matches the recorded suggested reopening condition, but the source is an unallocated comparison across terminal/API/desktop transports. WO-107 explicitly excludes candidate comparisons. Leave allocation to a later planning pass and keep this identifier visible to final review.
- **FUP-b7a66e7a4fa7ad20**, WO-086-D024: the collision recorder, integration helper and release-history checks are unchanged, and local release preparation encountered none of the recorded defects. The decision-file name is a textual match; retain the existing route.
- **FUP-50cda1c03ecd8ea8**, WO-171-D014: the generated meter snapshot matches by filename. No usage-pruning or byte-proof writer changes, and no partial-proof condition was observed. Retain its existing route.
- **FUP-71fc2efc208f597a**, WO-085-D004: the broader historical operator-chat sweep stays deferred. Same-day correction in this draft: D003 and D007 initially retained short operator phrases; those evidence entries now paraphrase the in-session directions, while the local approval check-in preserves their provenance. No closed record or immutable report was edited.
- **FUP-acfe4bfda716d8fb**, WO-158-D008: the generated control projection matches by path. Usage attribution and correction projection implementations are untouched; retain the existing route.
- **FUP-fd05316b6030ef73**, WO-168-D009: README/index names match, but only lifecycle version/index text and a new archive README were written. No writer-policy text or standing product sentence changed; retain the existing route.

## WO-107-D009

<!-- integration refs/dotln/checkpoint/WO-107/6 -->

```json
{
  "id": "WO-107-D009",
  "date": "2026-10-02",
  "dispatch": "resume: final review; worktree integrate WO-107",
  "decision": "Integrate main at 2bae7d40, the order's own base, into the uncommitted WO-107 worktree. Upstream had not moved, so the fast-forward changed nothing and no conflict arose. The application release stays v0.64.1 under the recorded patch classification, and WO-107 changes no component version, edition or dependency. Every claim carries forward with its original evidence, and the order's own checks re-ran on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-107/6",
    "base 2bae7d407af2d5d07d16c5b15dc63134e277eabd",
    "upstream 2bae7d407af2d5d07d16c5b15dc63134e277eabd",
    "release preparation: WO-107 target v0.64.1 remains current. Files changed: docs/evidence/WO-107/meta.json, docs/final-reviews/WO-107/PR.md. Meter snapshot: docs/evidence/WO-107/meta.json, 3987 bytes. Tag observation: local snapshot only.",
    "git ls-remote origin, 2026-10-02: refs/heads/main 2bae7d40; the newest v0.64 tag is v0.64.0, so v0.64.1 is untaken. docs/intake/ holds no ignored file, so no intake backup was required.",
    "git diff --cached refs/dotln/checkpoint/WO-107/3, after staging: only lifecycle records changed (the control log and projection, D009's stub, meta.json, PR.md's meter, VER-001, the decisions index and the work-order index). corpus/, packages/, scripts/ and the package files are byte-identical to the subject VER-001 verified.",
    "Integrated tree, 2026-10-02: npm run build exit 0; profile.mjs --compare … --check exit 0 with observations d433c425… and report f7e19da1… unchanged; node --test --test-reporter=tap corpus/harness/wo107-*.test.mjs 13 of 13 passed.",
    "Affected checks on the integrated tree: npm run publication:check exit 0; node scripts/harness.mjs check exit 0 (32 generated surfaces); npm run release -- check-surfaces --local exit 0 (57 PASS). npm test -- --review: 30 passed, 0 failed, 420.10 s, 75 fresh tasks, code identity d04f565cc0cc0dd634cdca6024eff5a18980c45e187d2fbd98369602d3de1897, recorded 2026-10-02T02:56:58.939Z, run after the order's new files were staged."
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

Integration date: 2026-10-02. Original base: `2bae7d407af2d5d07d16c5b15dc63134e277eabd`.
Fetched main: `2bae7d407af2d5d07d16c5b15dc63134e277eabd`. Checkpoint: `refs/dotln/checkpoint/WO-107/6`.
Named stash retained: `cf76a5fa63e409eae68e61a07c560cdc56949a17` (WO-107 integrate 2026-10-02).
Resolved projections: none.
Release preparation: WO-107 target v0.64.1 remains current. Files changed: docs/evidence/WO-107/meta.json, docs/final-reviews/WO-107/PR.md. Meter snapshot: docs/evidence/WO-107/meta.json, 3987 bytes. Tag observation: local snapshot only.
Carried-forward claims: upstream is the base, so no claim's inputs changed. Criteria 1, 4, 5 and 6 rest on the unchanged observations, transcript, schema and decisions, together with VER-001's independent re-derivation. Criteria 2 and 3 re-ran on the integrated tree: the 13 harness tests pass, and `--compare --check` reproduces the report byte for byte without changing the observations. Criterion 7's `npm test` row was re-established at the staged identity. `npm run test:docs` and `git diff --check` run at the result transition. FINAL-001 judged the integrated subject; D010 and D011 board what the review met.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-107-D010 — final review: the lane's own checks are keyed to this order's bytes

```json
{
  "id": "WO-107-D010",
  "date": "2026-10-02",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass the order and board the lane's after-base behavior with WO-105's. Every criterion holds at the subject, and the order pins its measurements to its base. Three of the lane's own checks are keyed to this order's bytes rather than to the evidence they protect, so ordinary later changes make them fail with messages that do not name the cause. (1) The self-test 'harness classification exception is exact' requires packages/kernel/test/fixtures/jsonl-protocols.json to hash to its WO-107 bytes (335e66e7…). The next order that declares its own JSONL there fails it, although WO-107's entry is unchanged. (2) The second execution's records are bound to the live bytes of the four collector modules (protocol 1d618f2f…), and only the first revision is archived. Any edit to profile.mjs, wo107-records.mjs, wo107-scenarios.mjs or wo107-bounded.mjs therefore makes criterion 7's --compare --check fail with 'known collector revision'. (3) The self-test 'harness registry covers every declared scenario' builds the registry against the current kernel and skeleton, so a new cadence kind, an evaluable deferred kind or a demo change fails it. The comparison generator also ends the report with a blank line, which git diff --cached --check reports (D011). The same collector revision pins those bytes, so the blank line can be fixed only together with (2). None of these is an acceptance defect. A reviewer may not write the harness change and certify it. How a corpus lane behaves after its base is the open question FUP-d093f77bd927f9dc already holds for WO-105.",
  "evidence": [
    "Reproduction 1, session scratch, 2026-10-02: validateClassification(base fixture, subject fixture) passes; adding one sibling nonEventPaths entry makes it throw ERR_ASSERTION on the whole-file hash (110f90c6… !== 335e66e7…), while nonEventPaths['corpus/baselines/observations-2bae7d40….jsonl'] still equals WO-107's declaration exactly.",
    "Reproduction 2, scratch copy of corpus/harness and corpus/baselines: --compare --check exits 0 unmodified; after appending one comment to the emit line of profile.mjs, outside every timed section, it exits 1 with 'AssertionError [ERR_ASSERTION]: known collector revision'. corpus/harness/profile.mjs protocolLineage and validateProvenance accept only the archived initial hash and the live modules' hash.",
    "(3) is an inference from code, not executed: corpus/harness/wo107-scenarios.mjs asserts the grid keys equal k.CADENCE_KINDS (line 195) and the exact message 'Cadence <kind> evaluation is deferred' for every non-evaluable kind (line 230), and wo107-schema.test.mjs runs every function scenario once against packages/*/dist.",
    "git diff --cached --check after staging: corpus/baselines/WO-107-comparison.md:6140: new blank line at EOF. comparison() in corpus/harness/wo107-records.mjs ends its line list with an empty string, joins the list with newlines and appends one more; --compare --check requires byte equality with that output.",
    "At the subject: npm run build; profile.mjs --compare … --check exit 0 (input d433c425…, report f7e19da1…, unchanged before and after); node --test --test-reporter=tap corpus/harness/wo107-*.test.mjs 13 of 13 passed.",
    "SCHEMA-WO-107.md discloses that the second execution is bound to the current modules and that the schema tests exercise current registry construction; it does not disclose the fixture-hash pin.",
    "Planning document failures-across-phases-2026-09-28.md §10.4 (The rest of the queue): WO-107 is restated so that 'its gate no longer appends to its own input' — the sense of 're-runnable' in the order."
  ],
  "followup": "Next order that edits the WO-107 lane, or the corpus-policy pass FUP-d093f77bd927f9dc names: decide this lane's after-base rule together with WO-105's. Archive the second collector revision (protocol 1d618f2f…) beside wo107-initial-protocol before any edit to the four collector modules, and make validateProvenance accept archived revisions. Have the classification self-test require WO-107's exact declaration and report base drift, instead of comparing the whole-file hash, once the fixture moves past this order's bytes. Keep the registry self-test as a check that runs only at the base, or label it as one. In that same revision, end the generated comparison with a single newline. Record the rule in SCHEMA-WO-107.md, and in corpus/README.md once the lane is named there.",
  "rejected": [
    {
      "option": "Fail FINAL-001 and route the repair through resume: fix",
      "reason": "Every criterion holds at the subject as the order words it. 07 §Independent workflows and integration returns only an acceptance defect through repair. 07 §Discipline keeps a repairable defect in its order, but a named deferral is still justified when the right fix is ambiguous or the role lacks authority, and both apply here. The fix needs an after-base rule for corpus lanes, which is FUP-d093f77bd927f9dc's open question and which the order's non-goals leave to corpus policy. A reviewer cannot write the fix. A repair cycle would cost an executor dispatch and a fresh verification without changing the recorded evidence."
    },
    {
      "option": "Edit the self-test or the comparison generator in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it. Any collector edit also invalidates the second execution's provenance until revision 2 is archived."
    },
    {
      "option": "State the limits only in the report",
      "reason": "A defect met in review is recorded here with a follow-up, not left as a report sentence."
    }
  ],
  "reopenWhen": "A later order edits the WO-107 lane, its fixture entry or its collector, re-records the baseline at a new base, settles FUP-d093f77bd927f9dc, or names the lane in corpus/README.md or product 03 §Corpus policy."
}
```

Goal alignment: the order's value is a trustworthy first observed column for the declared-versus-observed cost loop. That depends on the records and the read-only comparison, and both hold: the comparison never loads the current runtime (D005). The defects sit in the lane's self-checks and in its ability to accept a later collector edit. Rule beating and seeking the wrong goal favor passing on the evidence, not on checks that a sibling's unrelated entry would break. Fixes that fail and escalation argue against an in-order repair that settles one lane's after-base rule while WO-105's lane stays open. Drift to low performance argues against silence: a lane that fails on main without naming the cause invites people to ignore it. The follow-up, the PR and the release notes answer that. Naive Interventionism leaves the verified evidence unchanged. NoOp would publish the lane without saying which of its commands fail after its base.

Same-day correction, 2026-10-02: I cited the planning document's restatement of WO-107 as §10.3, but it stands in §10.4 (The rest of the queue, line 500). I meant §10.4. D010's evidence now names §10.4. FINAL-001 was filed and hash-bound before I saw the error, so its "What I reviewed" list still reads "§10.3 restatement of WO-107". That should read §10.4, and nothing else in the report depends on the section number.

## WO-107-D011 — final review: the lifecycle whitespace check never reads new files

```json
{
  "id": "WO-107-D011",
  "date": "2026-10-02",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Board a lifecycle gap that lies outside this order's criteria and surfaces: the inline whitespace check run by every lifecycle completion never reads new files. scripts/lib/lifecycle-evidence.mjs runs git diff --check with no base and no --cached, which compares the worktree with the index. An order's new files stay untracked through implementation and verification, and are staged before the reviewer's result, so the check passes whatever they contain. For WO-107, the handoff, VER-001 and every completion row record git diff --check as clean. After staging, git diff --cached --check reports corpus/baselines/WO-107-comparison.md:6140: new blank line at EOF. The committed tree already carries 410 such reports, all in byte-exact captures and generated outputs, so a repair must first decide which paths are exempt.",
  "evidence": [
    "scripts/lib/lifecycle-evidence.mjs:17 spawnGit(['diff', '--check']) and records the row as inline-diff:<treeHash>.",
    "This worktree, 2026-10-02: git diff --check passes with the 20 new files untracked; after git add, git diff --cached --check exits 2 with 'corpus/baselines/WO-107-comparison.md:6140: new blank line at EOF.'",
    "git diff --check 4b825dc642cb6eb9a060e54bf8d69288fbee4904 HEAD at 2bae7d40: 410 reports, in docs/evidence/WO-039 check captures, corpus/manifests/runs/WO-103-…-failed.log, LICENSE-docs and others.",
    "docs/planning/followups.json: no row names git diff --check's coverage; FUP-7629e03c6573f5cb (WO-173-D018) and the WO-169-D007 row cover untracked files in gate reuse and machinery selection only."
  ],
  "followup": "Planner: make the lifecycle whitespace check read what the order adds. Either check the order's diff against its base with untracked files included, or check untracked files directly. Decide whether byte-exact captures and generated reports are exempt by a Git attribute; the 410 committed reports show they exist today. Until then, a reviewer runs git diff --cached --check after staging and records the result.",
  "rejected": [
    {
      "option": "Fix scripts/lib/lifecycle-evidence.mjs in this review",
      "reason": "It is outside WO-107's declared surfaces and criteria, and a reviewer never writes a behavioral fix and certifies it."
    },
    {
      "option": "Judge WO-107 criterion 7 unmet on the staged diff",
      "reason": "The criterion names git diff --check, the command the lifecycle defines and runs, and it passes at the subject. The one reported line is in a generated, byte-pinned report whose fix D010 boards, and the repository's committed captures carry the same class of report."
    }
  ],
  "reopenWhen": "A planning pass opens the lifecycle checks, or a whitespace error in an order's new hand-authored source reaches main."
}
```

Goal alignment: this is a gap in the checks that supply the operator's evidence. Rule beating applies directly, because the row records clean without reading the bytes it claims to cover. Shifting the burden argues for a lifecycle fix rather than a duty on each reviewer, and the interim duty only bridges until that fix lands. Policy resistance: a strict check would refuse captured transcripts that must stay byte-exact, so the exemption decision comes first. NoOp leaves every new-file order with a vacuous whitespace row.
