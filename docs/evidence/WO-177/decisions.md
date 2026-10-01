# WO-177 decisions

## WO-177-D001

```json
{
  "id": "WO-177-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Change the named launch defaults in place and extend their existing fixtures to observe launch arguments and receipt attestations. Probe spawn_agent twice in this Codex session, once with explicit pinned selectors and once with selectors omitted; both workers are read-only and spawn no descendants. Preserve the compiled Claude reviewer requirement and the distinction between selected and effective values.",
  "evidence": [
    "WO-177 design and acceptance criteria 1–5; product 07 §Model-specific notes records the operator's 2026-09-30 direction",
    "Source inspection: entropy-review TRANSPORT_DEFAULTS selects gpt-6-sol/xhigh; writing-worker SELECTORS and authorityLaunch select claude-fable-5 and gpt-6-sol; subagent-probe launch and record select claude-fable-5",
    "worker-transport canonicalWorkerArgs forwards the requested model and effort; buildAttestation preserves effectiveModel/effectiveEffort as unknown",
    "Available spawn_agent schema accepts model and reasoning_effort overrides with fork_turns none; omitted overrides inherit parent selections",
    "Entry readback: Codex CLI 0.159.3, gpt-6.1-sol/max, source codex-session-readback; harness usage observes zero subagents, cap 20, unknown uncounted remainder",
    "docs/product/07-execution-guide.md §Goal-aligned decisions"
  ],
  "rejected": [
    {
      "option": "NoOp / rely on every caller to override selectors",
      "reason": "Leaves the demonstrated disagreement with the operator's pinned defaults and recurring supervision of launch flags."
    },
    {
      "option": "Centralize selectors or alter attestation/transport schemas",
      "reason": "The existing paths forward and record selectors; a constants patch and executable fixtures suffice within WO-177's authority."
    },
    {
      "option": "Change role-session recommendations, historical attestations or deliberately low-effort probe cells",
      "reason": "Those are independent operator choices, historical evidence or explicit experiment selectors; this order changes defaults."
    }
  ],
  "lenses": {
    "policyResistance": "Keep the compiled Claude requirement and existing transport overrides; no new refusal or admission rule.",
    "commons": "Two bounded read-only workers, no descendants, one repository writer; use focused fixtures and the required review gate. Model spend and performance differences are not measured.",
    "drift": "Assert the exact operator-pinned standard in launch arguments and attestations.",
    "escalation": "Reuse existing fixtures, records and the decisions index; introduce no gate, schema or dependency.",
    "successToSuccessful": "Change existing defaults because of the operator's explicit direction, without claiming a model-quality comparison.",
    "shiftingBurden": "Default launches need fewer manual selector corrections.",
    "ruleBeating": "Exercise command-family receipt paths through fake workers and inspect actual launch arguments; worker readback remains selected-session evidence, never effective inference.",
    "wrongGoal": "This risk-reduction patch improves reliable review and probe execution in the source-to-deliverable loop; it does not directly deliver the always-on runtime.",
    "naiveInterventionism": "Preserve useful caller overrides, intentional probe variants and immutable history. Changes are local and reversible; existing synthetic fixtures and two read-only spawns are the smallest probes of the named gap."
  },
  "reopenWhen": "The operator changes the pins, a default launch or receipt disagrees with them, or the host exposes different spawn selectors/readback semantics."
}
```

## WO-177-D002

```json
{
  "id": "WO-177-D002",
  "date": "2026-10-01",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "kind": "experiment",
  "decision": "Keep the existing focused-fixture and required review-gate method; decline a separate test-sequencing benchmark.",
  "question": "Would benchmarking a different test sequence reduce the cost of this bounded default update?",
  "alternatives": [
    "Benchmark repeated full gates against focused fixtures followed by the full gate",
    "Use the existing focused fixtures and run the required full review gate after the final code changes"
  ],
  "observation": "The order requires the full review gate and document gate; existing fixtures already exercise the affected launch and receipt paths. No additional sequencing bottleneck has been established.",
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "A separate benchmark adds repeated gate cost before a demonstrated saving in a small defaults patch.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["Source inspection only; no separate experiment command executed"],
    "source": "Actor-attested zero experiment runtime; preparation and recording were not separately timed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["Required focused fixtures, npm test -- --review and npm run test:docs retained"],
    "summary": "No adopted improvement or measured saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["WO-177 evidence gate and criterion 5; existing entropy, harness, authority and resident-binding fixtures"],
  "rejected": [
    { "option": "Skip or replace the required full review gate", "reason": "The work order explicitly requires it." }
  ],
  "reopenWhen": "Measured gate cost establishes a repeatable bottleneck with an equivalent-output sequencing improvement."
}
```

## WO-177-D003

```json
{
  "id": "WO-177-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.61.3, the next patch above the observed release baseline v0.61.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.61.2 (local tags)",
    "patch classification declared in docs/work-orders/WO-177-spawned-agents-run-the-pinned-models.md"
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

## WO-177-D004

```json
{
  "id": "WO-177-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Retain the existing transport and attestation mechanisms. Use the CLI command-family fixtures with model dispatch replaced by FakeEntropyTransport to prove default review/refutation requests, arguments and filed attestations; extend the existing authority/writing-worker fixtures and execute the subagent probe through a stub CLI. Record the two successful real spawn observations as selected-session evidence only.",
  "evidence": [
    "Focused command: node --test scripts/test-entropy-review.mjs scripts/test-harness-probe.mjs scripts/test-authority-probe.mjs scripts/test-resident-bind.mjs; 82 passed, 0 failed, 42.963 seconds",
    "The WO-177 CLI fixture covers both transports, review and refutation, argument selectors, receipt identity/source and unknown effective values; its receipts remain synthetic fixture evidence",
    "Historical negative replay: read TRANSPORT_DEFAULTS from b51a58a8 with git show, replace only that exported Codex row in an isolated test process, and run the same WO-177 CLI fixture; expected exit 1, actual gpt-6-sol versus expected gpt-6.1-sol, 0.237 seconds. No tracked source or historical receipt was modified",
    "Existing authorityLaunch fixture observes both harnesses and sandbox modes; existing writing-worker stub fixture observes selected values in argsShape and actor; subagent stub fixture observes its CLI arguments and saved actor record",
    "docs/evidence/WO-177/spawn-agent.md: explicit model/reasoning_effort and omitted-selector calls both accepted; each worker's own status reports gpt-6.1-sol/max on Codex CLI 0.159.3",
    "npm run build --silent and npm run publication:check passed; no package source, dependency, compiled reviewer requirement or attestation schema changed"
  ],
  "rejected": [
    {
      "option": "Add a production fake-transport injection or change the receipt schema",
      "reason": "A test-local dispatch replacement exercises the existing default and filing paths without introducing a production route."
    },
    {
      "option": "Claim effective values or compare model quality/cost from accepted selectors",
      "reason": "The observations establish selected metadata and arguments only; effective execution, quality and relative spend are unmeasured."
    },
    {
      "option": "Treat the replay as a full historical-tree gate",
      "reason": "Only the historical default row was replayed against the current fixture and host; this is a targeted negative regression check."
    }
  ],
  "goalAlignment": "The observed launch and receipt agreement addresses drift, rule beating and recurring operator correction. Two read-only workers and existing synthetic suites bound shared compute and process escalation. Existing transport overrides and explicit low-effort experiment cells retain their useful functions under Naive Interventionism. NoOp would preserve the checked stale defaults. D001's remaining system-trap comparison stands; this patch advances reliable worker selection rather than claiming a direct runtime milestone or model-performance improvement.",
  "reopenWhen": "A transport overrides these defaults incorrectly, a fixture no longer witnesses its launch/receipt path, or a changed host reports different selector inheritance or effective readback."
}
```

## WO-177-D005

```json
{
  "id": "WO-177-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next; implementation handoff",
  "decision": "Hand off all five criteria as met for independent verification at the checked code identity. Retain v0.61.3 as a local patch target, unchanged component versions and dependencies, the two spawn observations, and the synthetic transport evidence. Record implementation-ready with the actual Codex session actor after final output reads and index preparation.",
  "evidence": [
    "npm test -- --review: 33 suites passed, 0 failed, 78 fresh tasks, 421.171 seconds; recorded 2026-10-01T19:47:32.350Z at code identity 99b0a04c498b8a0ee949746c8d88f23c139159632263e235844db7cb8b2b4e7c",
    "npm run test:docs: 24 checks passed, 0 failed, 24 fresh tasks, 38.676 seconds; recorded 2026-10-01T19:48:33.229Z at the same code identity; the completion runs the final document check inline",
    "git diff --check passed; git diff --exit-code HEAD -- package.json package-lock.json packages passed; no new dependency, package source or registered feedback source changed",
    "Document growth measured against HEAD: AI-HARNESS-SECURITY 375 bytes within 600; reducer README 85 bytes within 200",
    "D004's focused run and historical-row negative replay; spawn-agent.md's two accepted calls and selected-session readbacks",
    "npm run adjacent -- list: revision 0, no items or next item",
    "npm run plan -- followups --touching: seven textual matches; their named implementation seams or reopening conditions are not changed by this defaults patch"
  ],
  "existingFollowups": [
    { "id": "FUP-b7a66e7a4fa7ad20", "judgment": "Left as open: release-preparation/collision/history hardening is not edited; this order executes the existing local preparation helper." },
    { "id": "FUP-33173b7f87004a9c", "judgment": "Left as deferred: the edited harness section describes model selectors, not the destination adapter's &> or = shell rules." },
    { "id": "FUP-50cda1c03ecd8ea8", "judgment": "Left as deferred: a generated meta snapshot matches textually; the harness-prune byte-proof writer is unchanged." },
    { "id": "FUP-71fc2efc208f597a", "judgment": "Left as deferred: the current document gate passed, and this order edits no retained historical fingerprint or protected provenance field." },
    { "id": "FUP-acfe4bfda716d8fb", "judgment": "Left as deferred: current.md is a generated lifecycle projection; usage attribution and the console board are unchanged." },
    { "id": "FUP-fd05316b6030ef73", "judgment": "Left as deferred: model-default documentation and release/index projections do not edit the named standing writer/refusal sentences." },
    { "id": "FUP-84e5edb1566a4db1", "judgment": "Left as untriaged: the changed entropy fixture matches textually; packages/skeleton/src/entropy-review-protocol.ts and its outputInstructions sentence are unchanged." }
  ],
  "rejected": [
    { "option": "Re-run the full review gate after report/index-only writes", "reason": "The passing row covers the current code identity; the final document gate checks the final document bytes inline." },
    { "option": "Change the unrelated follow-up implementations on textual matches", "reason": "The checked diff does not open their named seams or establish their reopening conditions; their existing dispositions remain for final-review judgment." },
    { "option": "Commit or publish from the executor dispatch", "reason": "Implementation readiness hands off to independent verification and final review; branch publication remains a separate authorized role." }
  ],
  "goalAlignment": "Observed defaults, command arguments, attestations and worker metadata now agree with the pinned selection. D001's eight-lens and NoOp comparison stands. Useful transport overrides, intentional experiment selectors and historical evidence remain. Full review and document checks establish the bounded behavior; model quality, effective execution and per-order cost savings remain unmeasured. D002 is the sole economy decision and claims no adopted improvement.",
  "reopenWhen": "Independent verification finds a missed default, disagreement between arguments and attestations, or host selector behavior that contradicts the two recorded observations; retime only if integration observes a version collision."
}
```

## WO-177-D006

```json
{
  "id": "WO-177-D006",
  "date": "2026-10-01",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board, not fail: some launch defaults outside the six this order lists still select the retired models. `npm run plan -- refute --transport codex-cli-exec` without --model or --effort launches gpt-6-sol at xhigh (scripts/refute-plan.mjs:510-519). scripts/harness-probe.mjs:169-170 and scripts/target-worker-smoke.mjs:72-73 launch gpt-6-sol or claude-fable-5 at xhigh. scripts/harness-live-smoke.mjs:282-283, scripts/evidence-mission-check.mjs:31-32, scripts/probe-codex-effort.mjs:89 and :228, and scripts/evidence-resident-actors.mjs:37-38 and :94 also name them; some of these regenerate historical evidence about that model. Product 07 §Model-specific notes says a refuter or probe that a session launches runs Codex gpt-6.1-sol at max or Claude Code claude-opus-5-5 at xhigh. It also assigns to WO-177 every compiled default and probe that still names gpt-6-sol or claude-fable-5, so once WO-177 closes that sentence names a closed order as owner of the defaults that remain. Criteria 1 and 2 cover the entropy route and the three probes this order's Cost and Cites name, and each holds; no criterion names the other files. Class: an order's inventory is narrower than the product rule it implements.",
  "evidence": [
    "VER-001 grep over scripts, packages/skeleton/src and packages/console/src for gpt-6-sol and claude-fable-5 found the seven files above. It also found scripts/test-entropy-review.mjs:1217, an explicit buildAttestation input that is not a default.",
    "scripts/refute-plan.mjs:510-519: the model is --model, else claude-opus-5-5 for claude-cli-print and gpt-6-sol for codex-cli-exec; the effort is --effort, else xhigh for every transport except fake. Product 07 lines 1088-1091 admit this route only on an explicit operator request.",
    "docs/product/07-execution-guide.md lines 2095-2101 (§Model-specific notes, the spawned-agent rule and its WO-177 assignment).",
    "WO-177 Observed gap item 1, Cost and Design list six defaults in entropy-review, writing-worker-probe, authority-probe and subagent-probe.",
    "Not judged here: scripts/resident-bind.mjs:73-79 DEFAULT_JUDGE selects claude-sonnet-5 and gpt-6-luna at xhigh for the resident judge (WO-157 item 7, WO-100 D007). Its reopening condition names an operator change to a role default. Whether the 2026-09-30 direction reaches the resident judge is for the operator or the planner."
  ],
  "goalAlignment": "Mission: a refuter or probe that a session launches runs the pinned selection without a flag. Seeking the wrong goal: if WO-177 closes while product 07 still assigns the remainder to it, the rule looks discharged. Naive Interventionism: the verifier edits no source. Several files regenerate historical evidence about gpt-6-sol, and changing their model would rewrite what that evidence measured, so each file needs its own judgment. NoOp: an operator-requested Codex plan refutation runs the retired model at xhigh while product 07 says otherwise. Policy resistance, escalation, shifting the burden, drift, rule beating, commons and success to the successful are immaterial: no refusal, gate or schema is involved.",
  "rejected": [
    {"option": "Fail criterion 2", "reason": "The three probes are the ones the order's Cost and Cites name, and each holds; harness-probe.mjs and the smoke scripts are not among them."},
    {"option": "Change the files in this verification", "reason": "A verifier edits no implementation, and the historical-evidence scripts need a keep-or-change judgment per file."}
  ],
  "followup": "Planner, at the next planning pass: file or amend an order that classifies each file above. A live launch default changes to Codex gpt-6.1-sol at max or Claude claude-opus-5-5 at xhigh, with a fixture that observes the launch arguments as WO-177's fixtures do; the codex-cli-exec plan refutation default in scripts/refute-plan.mjs is a live route. A historical-evidence regenerator keeps its model and says so in the file. Rewrite the sentence in product 07 §Model-specific notes that assigns the remainder to WO-177 so it names the new owner, or states that none remain. Paths: scripts/refute-plan.mjs, scripts/harness-probe.mjs, scripts/target-worker-smoke.mjs, scripts/harness-live-smoke.mjs, scripts/evidence-mission-check.mjs, scripts/probe-codex-effort.mjs, scripts/evidence-resident-actors.mjs, docs/product/07-execution-guide.md. Checks: the matching fixtures, npm test -- --review and npm run test:docs. Priority medium: today an operator-requested Codex plan refutation runs the retired model.",
  "reopenWhen": "An operator-requested plan refutation or probe launches without --model, or an order edits one of these files or product 07's spawned-agent rule."
}
```

## WO-177-D007

```json
{
  "id": "WO-177-D007",
  "date": "2026-10-01",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board, not fail: the in-place edit of the AI-HARNESS-SECURITY Entropy Reducer launch paragraph now reads 'Claude defaults to claude-opus-5-5 at xhigh and Codex to gpt-6.1-sol at max (WO-177; previously claude-fable-5-1 at max and gpt-6-astra with effort unknown)'. The parenthetical belonged to WO-100 and recorded the values before WO-100. Rewritten to cite WO-177, it credits WO-177 with the Claude default, which WO-100 set and this order left unchanged. It also drops the Codex default WO-177 replaced: gpt-6-sol at xhigh, set by WO-100. Criterion 4 requires the paragraph to name the new defaults in place, and it does. Class: provenance lost in an in-place edit.",
  "evidence": [
    "git diff HEAD -- docs/AI-HARNESS-SECURITY.md: the parenthetical changed from 'WO-100; previously' to 'WO-177; previously' with the same historical values (current lines 393-395).",
    "git show b51a58a8:scripts/lib/entropy-review.mjs TRANSPORT_DEFAULTS: codex-cli-exec gpt-6-sol at xhigh, claude-cli-print claude-opus-5-5 at xhigh.",
    "WO-177 Observed gap item 2: AI-HARNESS-SECURITY said Codex defaults to gpt-6-sol at xhigh (WO-100)."
  ],
  "goalAlignment": "Mission: a reader of the security document can tell which order set each default. Drift: each in-place edit that rewrites the provenance loses one more step of history. Naive Interventionism: the verifier edits no subject document; the repair is one sentence. NoOp: the paragraph misattributes one default and omits the value it replaced. The other traps are immaterial for a provenance sentence.",
  "rejected": [
    {"option": "Fail criterion 4", "reason": "The criterion requires the new defaults named in place; both are named correctly. Only the provenance parenthetical is wrong."}
  ],
  "followup": "Executor of the next order that edits docs/AI-HARNESS-SECURITY.md §Harness version, model and effort readback, or a WO-177 repair if one occurs: restore the chain in place. For example: 'Claude defaults to claude-opus-5-5 at xhigh (WO-100) and Codex to gpt-6.1-sol at max (WO-177; WO-100 set gpt-6-sol at xhigh; before WO-100, claude-fable-5-1 at max and gpt-6-astra with effort unknown)'. Paths: docs/AI-HARNESS-SECURITY.md. Checks: npm run test:docs and npm run publication:check. Priority low.",
  "reopenWhen": "An order edits the Entropy Reducer launch paragraph or changes either transport default."
}
```

## WO-177-D008 — final review: pass, D007 repaired in place, D006 stays with planning

```json
{
  "id": "WO-177-D008",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass WO-177 on all five criteria against the original order, on VER-001's reproductions, this review's reading of the full diff and its own run of the WO-177 fixtures. Repair D007 in place: the AI-HARNESS-SECURITY Entropy Reducer launch paragraph now credits WO-100 with the Claude default, WO-177 with the Codex default, keeps WO-100's replaced gpt-6-sol at xhigh and keeps the pre-WO-100 values. The section's growth against HEAD is 431 bytes, within the order's 600. Concur with D006 and leave its row with planning: the remaining retired-model launch defaults are outside the six this order names. One fact strengthens it: WO-100 set the Codex default in scripts/lib/entropy-review.mjs and scripts/refute-plan.mjs together, so the plan-refutation route is the twin of the default this order changed and was left behind. The order's title says every compiled default and probe; the criteria and design name six. The PR title and release notes claim the six. No integration: origin and local main are at the executor's base.",
  "evidence": [
    "docs/evidence/WO-100/decisions.md: the correction that changed scripts/lib/entropy-review.mjs TRANSPORT_DEFAULTS and scripts/refute-plan.mjs to default Codex to gpt-6-sol at xhigh",
    "scripts/refute-plan.mjs:510-519 at this subject: codex-cli-exec without --model selects gpt-6-sol; every non-fake transport without --effort selects xhigh",
    "git diff HEAD -- docs/AI-HARNESS-SECURITY.md after the repair: 431 bytes of growth; git diff --check clean",
    "node --test-name-pattern=WO-177 scripts/test-entropy-review.mjs --fixtures-only: 1 passed, 0 failed. node --test with the WO-177, sandbox launch selector, WO-044 probe and WO-157 bind patterns over test-harness-probe, test-authority-probe and test-resident-bind: 5 passed, 0 failed, 22.6 s",
    "git fetch; git rev-list --count HEAD..origin/main and HEAD..main: 0 and 0; tags end at v0.61.2 locally and on origin",
    "Clean-room screen over the tracked diff and the new evidence files: no user path, account identity, host, URL or secret shape; no lint or type suppression added under scripts"
  ],
  "rejected": [
    {
      "option": "Fail FINAL-001 and route a repair that changes refute-plan.mjs and the other launch defaults",
      "reason": "All five criteria hold for the six named defaults and three named probes. The other files are outside the order's Cost, Design and criteria, some regenerate historical evidence, and taking them would widen the order without an operator scope expansion. D006's follow-up gives them to planning."
    },
    {
      "option": "Rewrite product 07's sentence that assigns the remaining defaults to WO-177 in this review",
      "reason": "The sentence must name the order that will own the remainder, which planning has not filed. D006's follow-up carries the rewrite."
    },
    {
      "option": "Leave D007 for the next order that edits the section",
      "reason": "The misattribution is in the paragraph this order edited, the repair is one sentence inside its byte allowance, and publishing it would ship a wrong provenance claim."
    }
  ],
  "goalAlignment": "Mission: a launched review worker or probe runs the operator's pinned selection without a flag, and the record says what ran. For the six named defaults this now holds in launch arguments and receipts. Seeking the wrong goal is the material trap: a closed WO-177 under a title that says every default could read as discharging product 07's rule while the plan-refutation route still launches the retired model; the PR and release text name the six, and D006's row stays pending. Drift: D007's repair keeps the provenance chain instead of letting each in-place edit drop a step. Naive Interventionism: the review changed no source and one sentence of documentation. NoOp would publish a wrong attribution. Policy resistance, commons, escalation, success to the successful, shifting the burden and rule beating are immaterial: no gate, refusal, schema or dependency changes.",
  "reopenWhen": "A default launch or receipt for the six named defaults disagrees with the operator's pins, the pins change, or the Entropy Reducer launch paragraph's provenance is edited again."
}
```
