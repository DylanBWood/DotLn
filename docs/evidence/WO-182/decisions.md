# WO-182 decisions

Dispatch: `resume: next`, 2026-10-01. Current-session readback: Codex CLI
0.159.3, `gpt-6.1-sol`, effort `max`, source `codex-session-readback`.
One writer in this worktree; no subagents. Entry usage: 42,669 total tokens,
`codex-transcript-counter`, dispatch scope, cutoff 2026-10-01T19:27:54.739Z;
USD cost unknown.

## WO-182-D001 — Artifact bindings and explicit preparation inputs

```json
{
  "id": "WO-182-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Evaluate fourteen typed rows from the bound source episode, the current Git diff, replayed verification/baseline/review stores and an optional delivery-preparation.json in the source episode store. Preserve permissive operator publication; require the conjunction only with --require-deliverable-ready. Replay baseline and review producers before accepting their events; bind every input to the original contract, base and candidate. Missing inputs remain absent, including missing preparation. Preparation supplies a material-ambiguity inventory, named test/build/lint evidence selections and explicit post-publication monitoring ownership/policy. Monitoring is a prepared continuation, not a claim that an unopened PR has already been monitored. No producer or remote observation is invented.",
  "evidence": [
    "docs/work-orders/WO-182-deliverable-ready-conjunction.md criteria 1-5 and its operator-review assumptions",
    "docs/product/03-architecture.md DeliveryAdapter fourteen items and VerificationAdapter separate baseline/review episodes",
    "scripts/lib/github-body.mjs is the current implementation of the work order's scripts/github-body.mjs citation; acceptanceStatuses and generateTargetPullRequest",
    "scripts/lib/target-publish.mjs readEpisode, observeTarget and acceptanceMatrix already bind publication before ensureGh",
    "packages/skeleton/src/verification.ts projectAcceptanceEvidenceMatrices retains full evidence, baselineWitness and review; packages/skeleton/src/reactor.ts validates BaselineWitnessed and ReviewCompleted provenance",
    "packages/skeleton/src/review.ts ReviewCompleted retains subject/base, independent episode identities, conventions and findings",
    "scripts/lib/review-comment-loop.mjs requires an opened PR before observations or continuation effects, so pre-publication monitoring evidence must name prepared ownership rather than claim a completed observation"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "The unattended delivery lane would still have no executable readiness conjunction and the body would omit its gaps." },
    { "option": "Refuse every publication", "reason": "WO-064's operator proposal workflow is useful and this order explicitly preserves it." },
    { "option": "Accept a ready boolean or fourteen supplied verdicts", "reason": "That would let assertions bypass artifact evaluation, revision binding and provenance." },
    { "option": "Infer ambiguity, visuals or build/lint applicability from prose or filenames", "reason": "No typed artifact proves those conclusions; absent evidence must remain visible." },
    { "option": "Require a post-PR observation before opening the first PR", "reason": "That circular requirement prevents the loop from starting. Its prepared owner and stop policies are the pre-publication obligation." }
  ],
  "reopenWhen": "StoryContract/repository-profile/vertical composition producers define stronger preparation artifacts, a source event legitimately refers to a different contract, or deterministic fixtures reveal an unbound/stale artifact passing."
}
```

Mission and critical path: this interface removes recurring readiness judgment
from operator supervision and supplies the delivery prerequisite for WO-112 and
WO-118. Policy resistance and escalation are limited by the opt-in flag, leaving
operator proposal authority intact. Commons cost is one bounded local read and
evaluation, no new agents or remote checks. Drift to low performance and seeking
the wrong goal are addressed by explicit absent rows and the product's fourteen
requirements, rather than counting tests or receipts. Rule beating requires
contract/revision/provenance binding and negative fixtures. Shifting the burden
is reduced by named missing inputs, while unavailable producers remain visible.
Success to the successful was considered against a new checker engine; the
existing pure generator and episode replay already provide the required inputs.
Naive Interventionism: retain existing publication grants, outward lint,
idempotence and operator proposal behavior; probe with deterministic doubles;
the local change is reversible. NoOp leaves the unattended lane without a
readiness rule. These are design comparisons; executable benefit is judged at
handoff.

The work order's shortened source citation is resolved to
`scripts/lib/github-body.mjs` from the file inventory and the publisher's import;
no missing source is guessed. WO-112/WO-118 catalog rows are generated, so the
required flag will be added through the catalog renderer, preserving their
authority documents.

Same-day correction: the first implementation spelled the monitoring command
`worktree resolve`; the checked CLI branch/help in `scripts/worktree.mjs` names
`worktree resolve-pr`. The evaluator and both fixture configurations now require
the actual entrypoint.

## WO-182-D002 — Economy: decline a separate optimization experiment

```json
{
  "id": "WO-182-D002",
  "kind": "experiment",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep the existing focused publication fixtures for development and the required full review/document gates for handoff; decline an additional optimization probe because this order has no observed feedback-time bottleneck.",
  "question": "Would a separate test-selection optimization save enough time to justify preparation and measurement on this order?",
  "alternatives": [
    "Benchmark filtered versus complete publication suites before implementation",
    "Keep existing focused suites during development and all declared gates at handoff"
  ],
  "observation": "scripts/test-github-body.mjs and scripts/test-target-publish.mjs already isolate this bounded behavior; no measured delay in this session justifies an additional benchmark.",
  "budget": { "wallSeconds": 30 },
  "execution": "declined",
  "reason": "No measured publication feedback bottleneck justifies a separate optimization probe on this order.",
  "cost": {
    "wallSeconds": 0.0002782090000000004,
    "tokens": null,
    "commands": ["node -e: host performance-clock measurement of final decline-receipt read/edit/write"],
    "source": "Host performance clock measures final decline-receipt preparation and recording; earlier deliberation is unmeasured. No optimization experiment ran; token cost is unknown."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["node --test scripts/test-github-body.mjs scripts/test-target-publish.mjs", "npm test -- --review", "npm run test:docs"],
    "summary": "Current method retained; no saving or regression claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["Existing focused publication test files; WO-182 criterion 5 requires full review and documentation checks."],
  "rejected": [
    { "option": "Additional benchmark", "reason": "Preparation and measurement spend time without an observed bottleneck." },
    { "option": "Replace required full gates with focused fixtures", "reason": "That would not discharge criterion 5." }
  ],
  "reopenWhen": "Focused publication feedback becomes an observed material bottleneck in a later order."
}
```

## WO-182-D003

```json
{
  "id": "WO-182-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.62.0, the next minor above the observed release baseline v0.61.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.61.2 (local tags)",
    "minor classification declared in docs/work-orders/WO-182-deliverable-ready-conjunction.md"
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

## WO-182-D004 — Correct the monitoring entrypoint

```json
{
  "id": "WO-182-D004",
  "kind": "correction",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "misread": "The initial typed monitoring preparation used worktree resolve.",
  "meant": "The actual CLI entrypoint is worktree resolve-pr and publication commands require a WO-NNN argument.",
  "changed": "The evaluator, both fixture configurations, artifact contract and generated catalog command now name the checked executable entrypoints.",
  "decision": "Require the actual worktree resolve-pr entrypoint in the evaluator and both fixture configurations; catalog command examples include the required WO-NNN argument.",
  "evidence": ["scripts/worktree.mjs action resolve-pr and its checked CLI help"],
  "rejected": [{"option": "Leave the shorthand as the typed command", "reason": "The recorded preparation must name an executable entrypoint."}],
  "reopenWhen": "The public review-loop entrypoint changes."
}
```

Handoff outcome, checked 2026-10-01: the expected critical-path contribution is
now executable. Deterministic fixtures resolve all fourteen evidence references,
reject stale/unbound/synthetic and self-reviewed inputs, and show exactly one
missing item stopping required publication before remote effects. The same store
without the flag opens a proposal carrying that gap; a replayed nonvisual store
passes with thirteen evidenced rows and one not-applicable row. The full review
and document gates passed, including the existing grants, repair, drift and
idempotence behavior. These observations support less recurring readiness
judgment in the unattended lane; operator interruption or time savings were not
measured.

The D001 trap comparisons still hold at this bounded handoff: visible absent
rows oppose drift to low performance and seeking the wrong goal; negative
revision/provenance fixtures oppose rule beating; preserving operator proposals
limits policy resistance and escalation. Existing replay and generation keep
commons cost local, and the named gaps reduce shifting the burden without
pretending missing producers exist. Reusing those existing mechanisms avoids
success to the successful through a new checker engine. Against Naive
Interventionism, unchanged grants and passing regression cases preserve the
existing authority and recovery behavior. Against NoOp, the fourteen-item
conjunction and body now execute. Preparation producers and live composition
remain visible integration obligations for their own orders, not invented
evidence or a diagnosed deferred defect here. No adjacent repair item was opened.

## WO-182-D005

<!-- integration refs/dotln/checkpoint/WO-182/6 -->

```json
{
  "id": "WO-182-D005",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-182",
  "decision": "Integrate main at 855450ea (WO-177 as v0.61.3) into the uncommitted WO-182 worktree by fast-forward, with no authored conflict. The v0.62.0 target stays current as the next minor above v0.61.3. Neither side changed a package version, manifest or generated hook, so no component version collides. Upstream changed none of the files WO-182's claims rest on, so VER-001's five judgments carry forward on unchanged inputs, and the product gate was run again on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-182/6",
    "base 1d00bc58af32ecfcc6080e21a62179709bf5efe7",
    "upstream 855450ea7054e86b231a890f6e2e40648bdb4b7e",
    "release preparation: WO-182 target v0.62.0 remains current. Files changed: docs/evidence/WO-182/meta.json, docs/final-reviews/WO-182/PR.md. Meter snapshot: docs/evidence/WO-182/meta.json, 4110 bytes. Tag observation: local snapshot only.",
    "git diff --name-only 1d00bc58 855450ea: 25 files. These are WO-177's entropy-review and three probe modules with their tests, scripts/test-resident-bind.mjs, its records and two documents, plus README.md's release line, the follow-up register, the decisions index, the work-order index and the control projection. None is a WO-182 source, test or fixture, and nothing is under packages/ or .claude/. git ls-remote origin: tag v0.61.3 peels to 855450ea.",
    "The only overlapping paths were README.md and three generated projections; the helper resolved them. docs/intake/ holds only .gitkeep files, so no intake backup was required.",
    "After integration, git diff refs/dotln/checkpoint/WO-182/5 limited to WO-182's six changed scripts and product 03 is empty. The untracked scripts/fixtures/target-publish/readiness.mjs hashes to the checkpoint's blob 721b5c9a. The integrated source for this order is byte-identical to the subject VER-001 judged.",
    "Affected checks on the integrated tree: node scripts/harness.mjs check (32 generated surfaces), npm run publication:check, npm run release -- check-surfaces --local and npm run plan -- check all exit 0. The final product gate result is recorded in FINAL-001."
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

Integration date: 2026-10-01. Original base: `1d00bc58af32ecfcc6080e21a62179709bf5efe7`.
Fetched main: `855450ea7054e86b231a890f6e2e40648bdb4b7e`. Checkpoint: `refs/dotln/checkpoint/WO-182/6`.
Named stash retained: `1f5b9a001a6418118660e4648a5b567d33b05e4a` (WO-182 integrate 2026-10-01).
Resolved projections: README.md, docs/control/current.md, docs/work-orders/README.md.
Release preparation: WO-182 target v0.62.0 remains current. Files changed: docs/evidence/WO-182/meta.json, docs/final-reviews/WO-182/PR.md. Meter snapshot: docs/evidence/WO-182/meta.json, 4110 bytes. Tag observation: local snapshot only.
Carried-forward claims: main changed none of the files this order's claims rest on. `scripts/lib/github-body.mjs`, `scripts/lib/target-publish.mjs`, both test files, the readiness fixture, `scripts/worktree.mjs`, `scripts/work-orders.mjs` and product 03 are byte-identical to checkpoint `/5`. VER-001's judgments on criteria 1 to 4 therefore carry forward on unchanged inputs. Criterion 5's gate was run again on the integrated tree, and the document gate ran with the final-review records in place. FINAL-001 judged the integrated subject.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-182-D006 — final review: pass, and two seams the required runs inherit

```json
{
  "id": "WO-182-D006",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass WO-182 on all five criteria against the original order, on VER-001's probes, this review's reading of the full diff and a fresh product gate on the integrated tree. Board two seams for the runs that will require readiness, without failing the order. (1) From source, not executed: publishTargetOrder returns an already recorded PullRequestOpened before it evaluates readiness. So publish --target with --require-deliverable-ready for a head an operator already opened without the flag exits 0 ('Already published ...; nothing pushed') even when items were absent. That call opens no pull request, so criterion 3 and the objective hold. A run that reads the exit status as readiness would still be wrong. (2) Read from source and the artifact contract: no producer writes delivery-preparation.json, and three items read only that owner-declared file: no unresolved material ambiguity, tests/build/lint and monitored loop. The file must carry deliveryContractHash, an export of scripts/lib/github-body.mjs that no command line prints, and the diffHash recorded in the source host's SourceChangeObserved event. Tests/build/lint has no not-applicable route, so a target without a build or lint step can pass only if its owner selects a passing witness under that category. A run with the flag refuses on all three items until something writes the file. The WO-112 and WO-118 catalog rows name the flag but not the file. D001's reopenWhen names stronger producers, but no follow-up routes the duty.",
  "evidence": [
    "scripts/lib/target-publish.mjs publishTargetOrder: const previous = already(); if (previous) return previous; precedes authorizePublication, observeTarget, readinessArtifacts and the requireDeliverableReady refusal",
    "scripts/lib/target-publish.mjs readDeliveryPreparation reads only <store>/delivery-preparation.json; no script under scripts/ or packages/ writes that file outside scripts/test-target-publish.mjs (git grep delivery-preparation)",
    "scripts/lib/github-body.mjs deliverableReady: the ambiguity, checks and monitoring rows require preparationBound; the checks row requires a nonempty selection for each of tests, build and lint",
    "docs/evidence/WO-182/artifact-contract.md: 'The owner declares category meaning'; 'A missing convention, ambiguity inventory, build/lint witness or monitoring owner stays absent until a producer records it'",
    "docs/work-orders/WO-123-vertical-composition.md hard dependency on WO-182: 'the deliverable-ready conjunction the run requires before publication'",
    "VER-001 limits: the all-evidenced visual path is shown on the in-memory projection only; monitoring is a prepared owner and policy, not an observation"
  ],
  "rejected": [
    { "option": "Fail the order", "reason": "Neither seam contradicts a declared criterion. Criterion 3 asks that a store with an absent item refuse before any remote call, and the repeat makes no remote call. The order's operator-review assumption 2 and D001 keep an item absent until its producer exists." },
    { "option": "Fix the repeat in this review", "reason": "Refusing, re-evaluating or reporting readiness on a recorded publication changes WO-064's idempotent repeat for every caller. Which one the loop needs is the composition's decision, not a bounded cleanup." },
    { "option": "NoOp: leave both only in the report", "reason": "D001 records no follow-up, so planning would not route the producer duty to the composition that depends on it." }
  ],
  "followup": "Planner, before WO-123 activates (and for WO-112's and WO-118's runs): (1) name the step that writes delivery-preparation.json: the ambiguity inventory from WO-061's StoryContract, the tests/build/lint selections and any not-applicable rule from the repository profile, and the monitoring owner from the resident. (2) Decide what a run that requires readiness does when the head already has a recorded publication opened without the flag: refuse, re-evaluate readiness, or read the recorded body.",
  "reopenWhen": "WO-123, WO-112 or WO-118 activates; a producer for delivery-preparation.json lands; or a run with --require-deliverable-ready reports success over a recorded publication."
}
```

Goal alignment. The mission contribution under review is the one D001 promised: the unattended lane gets a readiness rule that is not the operator, and the operator keeps the proposal route. Both hold in the executed fixtures. The two seams are where the trap comparison still bites downstream. A repeat that reads as success is rule beating by exit status. A preparation file with no producer shifts the burden onto whoever composes the run. Recording them as a routed follow-up keeps them visible without widening this order. Against Naive Interventionism, the review changes no source. Against NoOp, leaving them only in the report would drop them from planning.
