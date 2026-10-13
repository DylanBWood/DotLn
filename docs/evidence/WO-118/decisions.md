# WO-118 decisions

Dispatch: `resume: next`, 2026-10-12 local date (2026-10-13 UTC).
Root readback: Codex CLI 0.162.1, gpt-6-astra, ultra,
codex-session-readback. One writer; one read-only research worker launched
on gpt-6.1-sol / max, with no effective-model readback claimed.

## WO-118-D001

```json
{
  "id": "WO-118-D001",
  "date": "2026-10-13",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.80.0, the next minor above the observed release baseline v0.79.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.79.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-118-resident-owned-loop-from-starter.md"
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

## WO-118-D002 — Preserve the failed starter observation

```json
{
  "id": "WO-118-D002",
  "date": "2026-10-13",
  "dispatch": "resume: next; operator scratch-target direction",
  "decision": "Record the initial live run as refused after the native source writer was killed while the resident stayed alive. Preserve the run and its typed stop. Do not infer actor replacement from the passing host-death probe or promote starter parity. Record the console's absence independently. Runtime repair awaits a scope disposition because this order composes and witnesses and explicitly excludes runtime fixes.",
  "evidence": [
    "base-recovery.json: bounded required recovery probe exit 0; both host-crash cases observed recovery",
    "export-receipt.json: 866 manifest files verified after instance configuration, harness emit/check exit 0; packages/console/dist/src/cli.js absent",
    "initial-run.json and kill.json: native Codex writer SIGKILL at 2026-10-13T01:19:36.705Z, resident kept alive; one source attempt; final source-change refused",
    "event-log.json: same admitted vertical across the resident restart; model baseline assessment present; ambiguous control IntentHeld",
    "packages/skeleton/src/source-change-host.ts interruption catch; packages/skeleton/src/vertical-host.ts execute-error terminal refusal; packages/skeleton/src/vertical-resident.ts terminal finished set",
    "Operator selected the personal scratch repository in this dispatch and said its contents and effects were unrestricted; the exact selector stays in local run material"
  ],
  "rejected": [
    { "option": "Count the host-crash probe as actor replacement", "reason": "It kills the host and explicitly starts a fresh host; the live run killed only the actor and did not replace it." },
    { "option": "Manually restart a source host or inject a successful result", "reason": "The acceptance criterion requires the resident to replace the actor without further prompting." },
    { "option": "Copy the core console into the exported instance", "reason": "That would conceal the export's missing capability and cease to test the starter as shipped." },
    { "option": "NoOp on the observed failure", "reason": "The critical-path proof remains false unless the actual failure and missing console receive an explicit route." }
  ],
  "reopenWhen": "The operator authorizes a bounded runtime repair here or a separate core order ships actor replacement and console export, followed by a fresh unchanged-runtime starter proof."
}
```

Goal alignment: avoid a passing demonstration built by manually replacing the
runtime's missing handoff, or expanding an evidence-only order without authority.
Preserve the existing interruption, termination, integrity and authority checks.
The actual observation failed criterion 2's actor-replacement obligation.

Setup correction: the first local configuration supplied an absolute
`repositories.scratch.worktreeParent`. `loadConfig` refused it as requiring a
relative normalized POSIX path. The configuration now uses `../trees`; the
runtime's own `vertical.json` uses the physical absolute path. The admitted
configuration check passed before any intent or resident was launched. The
already-created ambiguous issue was reused; the setup was not repeated remotely.

## WO-118-D003 — Authorized repairs and fresh proof

```json
{
  "id": "WO-118-D003",
  "date": "2026-10-13",
  "dispatch": "resume: next; explicit operator scope expansion",
  "decision": "Repair actor replacement and console export within WO-118, then rerun the starter proof from an export of the repaired candidate. Preserve the initial failed run and every acceptance obligation.",
  "evidence": [
    "Operator answered the scope question with: Repair both in WO-118 (Recommended).",
    "The question explicitly named actor replacement and console export and the current runtime-fix exclusion.",
    "WO-118-D002 and repair-plan.md diagnose both failures from the initial live observation."
  ],
  "rejected": [
    {
      "option": "Keep WO-118 evidence-only and defer both fixes",
      "reason": "The operator explicitly selected repair in this order."
    },
    {
      "option": "Retry arbitrary writer failures or bypass the export boundary",
      "reason": "Only typed interruption under current authority can reuse existing bounded recovery; the new starter must carry its runtime through a real export."
    }
  ],
  "reopenWhen": "A further defect needs scope beyond these repairs or the existing admitted execution obligations."
}
```

Component impact: skeleton 0.58.0 → 0.58.1 for the recovery behavior repair;
console's exact skeleton dependency and the lock follow that patch. Console
source, public schemas and dependencies are unchanged. Application v0.80.0
remains the order's minor target. Neither vertical-host.ts nor launchpad.mjs
is an evidence-edition source or feedback-judged source in the current registry;
checks will establish whether regeneration is needed. WO-204 retains its
independent command/profile cleanup and surviving-grant refusal obligations;
this change does not implement those.

## WO-118-D004 — Exact authorized status writeback

```json
{
  "id": "WO-118-D004",
  "date": "2026-10-13",
  "dispatch": "resume: next; additional explicit operator scope expansion",
  "decision": "Repair the planning continuation gate so the unchanged reviewed acceptance criterion can own an exact authorized vision status writeback. Bind the reviewed and current story-section hashes in this decision through the current execution amendment; preserve all other planning input checks and historical receipts.",
  "evidence": [
    "Operator answered: Repair the document gate in WO-118 (Recommended).",
    "The scope question explicitly named the required vision status sentence and rejection of other planning changes.",
    "npm run plan -- check refused sequence, vision, roles or order inventory changed after the authorized order amendment.",
    "scripts/lib/plan-subject.mjs hashes The one-paragraph story; checkPlanContinuation fixes it while WO-118 criterion 6 requires the status sentence."
  ],
  "rejected": [
    {
      "option": "Remove the required status sentence or omit vision from planning input hashes",
      "reason": "The first violates criterion 6 and the second weakens unrelated planning checks."
    },
    {
      "option": "Treat this as a fresh planning pass or override an invented hold",
      "reason": "The repair preserves the existing reviewed subject and binds an authorized execution writeback; neither a new planning verdict nor a hold disposition occurred."
    },
    {
      "option": "Defer the document gate repair",
      "reason": "Operator explicitly selected this repair within WO-118."
    }
  ],
  "reopenWhen": "A different product section needs an execution-writeback route, or accepted section or criterion bytes change.",
  "executionWritebacks": [
    {
      "path": "docs/product/00-vision.md",
      "section": "The one-paragraph story",
      "criterionId": "criterion:6",
      "criterionHash": "sha256:3f9f9647441a9e82df11a0d7c331cd48cb0d7391f2512ddd9cd3b1c609734efb",
      "sourceHash": "sha256:8bab0822506793b72af969c7882b4eea981c3ae27e34c0911da4ed94629d8407",
      "acceptedHash": "sha256:0685358ac74db8c280949a48e99ba3b06d69b032b381a0856a4f33e2bf94d53a"
    }
  ]
}
```

## WO-118-D005 — Dispatch launch allowance

```json
{
  "id": "WO-118-D005",
  "date": "2026-10-13",
  "dispatch": "resume: next; explicit operator launch-budget exception",
  "decision": "Allow up to 32 total agent/model launches for this WO-118 dispatch only. Preserve the global 20-launch default. Reserve two fresh launches for independent final self-review; the corrected starter observation may use up to 18 additional launches after the 12 already observed.",
  "evidence": [
    "Operator answered: Allow up to 32 for this dispatch (Recommended).",
    "The scope question named the corrected starter configuration and two independent reviews, and limited the exception to this dispatch.",
    "Explicit launch accounting at this decision: one research worker, four model launches in the original starter observation, seven model launches in the repaired observation; total 12. Reusing the research worker does not launch another agent."
  ],
  "rejected": [
    {"option": "Change the global subagent cap", "reason": "The operator authorized an exception for this dispatch only."},
    {"option": "Discard failed-attempt launch costs", "reason": "All actual launches remain part of the dispatch cost."}
  ],
  "reopenWhen": "The dispatch would need more than 32 launches or a later dispatch needs its own exception."
}
```

## WO-118-D006 — Correct the instance publication setup

```json
{
  "id": "WO-118-D006",
  "date": "2026-10-13",
  "dispatch": "resume: next; corrected starter observation",
  "decision": "Preserve the repaired attempt as a lint refusal caused by missing instance publication configuration. Start a fresh export and run after seeding the public outward vocabulary and one synthetic local deny marker and observing positive and negative preflight controls. Keep all prior launch costs and evidence.",
  "evidence": [
    "repaired-attempt/receipt.json: two source attempts under one command and episode, one source commit, baseline test exit 1 and source test exit 0; terminal lint refused before publication.",
    "Bounded wo118-record-repaired.mjs reproduced the exact missing-vocabulary error from checkOutwardArtifact against the retained instance, and counted seven model launches and one commit.",
    "scripts/outward-lint.mjs requires the contained outward-vocabulary file; scripts/lib/target-publish.mjs refuses unavailable local-term coverage. Both configuration files were omitted by the executor.",
    "Fresh setup preflight passes branch, commit, title and body; the synthetic local deny marker is refused. No private terms list was read or copied."
  ],
  "rejected": [
    {"option": "Treat the generic lint refusal as a new core defect", "reason": "The retained instance is missing required instance-owned configuration; direct invocation reproduces that cause."},
    {"option": "Resume or rewrite the terminal attempt", "reason": "A fresh run keeps failed history and launch accounting intact."},
    {"option": "Copy private publication terms into scratch", "reason": "Only public vocabulary and a declared synthetic control belong in this scratch proof."}
  ],
  "reopenWhen": "A configured publication preflight fails or the declared screening scope proves insufficient."
}
```

## WO-118-D007 — Live vertical status

```json
{
  "id": "WO-118-D007",
  "date": "2026-10-13",
  "dispatch": "resume: next; explicit live-status scope expansion",
  "decision": "Repair the live status projection for logical vertical-host work and intent NeedsHuman holds using existing runtime-status-v1 fields. Preserve native child evidence separately; do not present a logical step as an observed native model launch. Add regression coverage and a separate live visibility witness from a fresh export. Preserve the successful loop and its original console transcript.",
  "evidence": [
    "Operator answered: Repair live status in WO-118 (Recommended).",
    "The question named the omitted vertical work and intent holds, criterion 4, and the exclusion of further runtime fixes.",
    "The repaired and corrected console transcripts show no live episodes and no holds although the resident log contains IntentStepStarted and IntentHeld.",
    "packages/skeleton/src/runtime-status.ts currently projects ScriptEpisodeDispatched/state.episodes and handoffs/mission/dispatch holds, but omits state.intentStep and state.intents.",
    "The work order explicitly judges phases on vertical receipts; a logical vertical-host row can expose recorded execution without new native transport claims."
  ],
  "rejected": [
    {
      "option": "Treat console export as sufficient visibility",
      "reason": "The observed missing actor and hold states would remain."
    },
    {
      "option": "Add native transport lifecycle instrumentation for this projection fix",
      "reason": "Existing recorded logical execution and holds satisfy the bounded display repair; child launch and replacement remain evidenced in their own native stores, with no invented model claims."
    }
  ],
  "reopenWhen": "Native per-child actor visibility is required, or the logical status fails to agree with the recorded resident state.",
  "executionWritebacks": [
    {
      "path": "docs/product/00-vision.md",
      "section": "The one-paragraph story",
      "criterionId": "criterion:6",
      "criterionHash": "sha256:3f9f9647441a9e82df11a0d7c331cd48cb0d7391f2512ddd9cd3b1c609734efb",
      "sourceHash": "sha256:8bab0822506793b72af969c7882b4eea981c3ae27e34c0911da4ed94629d8407",
      "acceptedHash": "sha256:58c78ca800096e3871ea0546dcfc589f2050bb72aaa1ac54dfe82ec2c4fffeed"
    }
  ]
}
```

## WO-118-D008 — Observed outcome and separate visibility witness

```json
{
  "id": "WO-118-D008",
  "date": "2026-10-13",
  "dispatch": "resume: next; completion of authorized repairs and starter proof",
  "decision": "Record the corrected starter loop as observed through fresh resolved review, and retain the later fresh-export visibility witness as a separate bounded observation. All eight representative parity items are observed-met. Keep efficiency unknown and preserve both failed attempts. Goal alignment: the requested resident-owned starter loop and authorized repairs were demonstrated; the pre-existing ambiguous-answer consumption limit remains explicitly carried.",
  "evidence": [
    "completed-run/receipt.json and its bounded collector: 14 completed vertical steps, 13 model launches, stable admission across resident restart, two native source attempts under one command/episode, one source commit, one review repair commit, wrong suggestion rejected with evidence, fresh resolved observation.",
    "The collector checks the original publication head as an ancestor of the remote delivered head, with exactly one repair commit and a matching local repair ref. The source branch remains at the original publication head because the repair uses its own worktree; equality with that original branch is not the delivery invariant.",
    "The scratch review control author was configured during verification before publication, as the receipt explicitly records; it supplies only scenario author classification, no disposition, model verdict or grant.",
    "visibility-run/receipt.json and console.txt: four native models in a fresh export; active logical vertical-host/source-change, filed intent, derived order and contract hold are visible; presence return prevents further phases after source completion.",
    "The research review found omitted terminal retry/repair holds and typed refusal status. Both are now covered by bounded reason codes and the native recovery fixture; replay, restart and private-diagnostic tests pass.",
    "Explicit final launch accounting: research 1; initial live 4; repaired live 7; completed live 13; visibility live 4; fresh improver 1; fresh adversary 1; total 31 against the dispatch-only allowance of 32. Reused workers add no launch."
  ],
  "rejected": [
    {"option": "Replace failed evidence with the successful run", "reason": "The failure causes, configuration omission and their costs remain part of the observed history."},
    {"option": "Repeat the entire delivery loop for a pure status projection change", "reason": "The projection does not change execution; a separate fresh native visibility witness establishes its missing display behavior within the remaining launch budget."},
    {"option": "Claim native child identity or efficiency from the logical display", "reason": "The display has no such readback; native replacement is established separately and comparable cost measures were not collected."},
    {"option": "NoOp: retain the original console omission", "reason": "It would leave criterion 4 unmet despite the successful delivery run."}
  ],
  "reopenWhen": "A broader replacement or efficiency claim is requested, native child visibility is required, or equivalent configured runs fail the observed scope."
}
```

## WO-118-D009 — Verification: fail; criterion 4 is unmet because no run was both shown live and audited

```json
{
  "id": "WO-118-D009",
  "date": "2026-10-13",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on F1. At code identity d8ffd82c432b71a70d504da5f1b8df04eb44a457fe8987da65ddb60dfbf9a7d3, criteria 1, 2, 3, 5, 6 and 7 are met and criterion 4 is unmet. F1 (blocking, criterion 4): no run was both shown in the live console with its actors, phases and holds and reproduced by the audit afterward. Through all 14 phases of the completed starter run the console showed one portfolio actor, no live episode and no hold, also after the ambiguous control's IntentHeld. The repaired display was witnessed only in a separate fresh-export run that stopped after source-change, ran no delivery, review, kill or restart, and recorded no audit. The amended Design keeps the acceptance obligations unchanged. F3 (follow-up, declared runtime-status surface): every admitted intent that ever started a step keeps a vertical-host actor row in live status for good. F4 (follow-up, declared evidence surface): no receipt records which of WO-123-D044's five items the run met, as the order's carry-in requires. F2 is boarded separately in WO-118-D010.",
  "evidence": [
    "F1, completed run: completed-run/console.txt has 24 frames; all 23 that render status read 'Actors: probe: portfolio (unknown)', 'Live episodes: none' and 'Holds: none', including the frame after IntentHeld. completed-run/status-snapshots.json holds 14 snapshots, each with that single portfolio actor, no live episode and no hold. Raw resident log: the hold is evt_95, IntentHeld for WO-901 at step contract.",
    "F1, visibility witness: visibility-run/receipt.json records 4 model launches (intake 2, baseline 1, source 1), a presence return during source-change and no delivery claim. The run's commands.json holds presence away, two intents and presence back, and no audit command. Its retained run directory holds no audit output.",
    "F1, audit: completed-run/audit.txt has no L0 receipts and no L1 entries. The 29 vertical events appear only in the governed raw view.",
    "F1, order and decisions: the amended Design says 'verify the display from a fresh export without changing acceptance obligations'. D008 rejects repeating the delivery loop to stay within the launch budget, and rejects keeping the original console because 'It would leave criterion 4 unmet'.",
    "F1, real-corpus replay probe (bounded, 2026-10-13): replaying the completed run's 98 resident events through the repaired projectRuntimeStatus shows all 14 phases as live vertical-host episodes and the contract hold for WO-901. The repair works on the real log, but a reconstruction afterward is not the live console during the run.",
    "F3 probe (bounded, 2026-10-13): the completed run's replayed state with 0, 5 and 20 added finished intents projects 1, 6 and 21 vertical-host actor rows. The console's Actors line grows from 67 to 252 to 807 characters, and terminally refused ones raise dispatch holds from 2 to 4 to 12. Source: packages/skeleton/src/runtime-status.ts pushes one actor for every admitted intent with a recorded IntentStepStarted and has no terminal filter.",
    "F4: initial-run.json records the admitted intent's model-produced baselineAssessment, the check FUP-faae1df8f1022634 asks for. No receipt, README, handoff or decision names D044's five items. In this run: no resolution repair was killed (item 1); both issues were in vertical.json before the resident started (item 2); no return used a kill policy (item 3, the visibility return used finish); authority decoded (item 4); every writer ran on codex-cli-exec (item 5)."
  ],
  "rejected": [
    {"option": "Judge criterion 4 met on the separate visibility witness", "reason": "The criterion binds the live display and the afterward audit to the run. The witness is another, partial run with no audit, and the Design amendment kept the obligations unchanged."},
    {"option": "Judge criterion 4 met because its phases are judged on the vertical's receipts", "reason": "The 2026-10-07 decision moves only the phases. During the run the console still owes the run's actors and holds, and it showed neither the vertical's actor nor the ambiguous control's hold. D008 itself records the original console as leaving criterion 4 unmet."},
    {"option": "Route F1 to the operator", "reason": "The repair stays inside the order's declared evidence surface and existing authority: the scratch-repository grant and a fix dispatch's own launch allowance. The operator's alternative is the waive off-ramp for criterion 4."},
    {"option": "Fail criterion 1 on the mid-run review-control author mapping", "reason": "The mapping is how the operator-planted suggestion reaches triage (WO-073's automationLogins). It supplies no disposition, judgment or grant, and the receipt names it with its timing. The repair moves it into setup."},
    {"option": "Fail criterion 2 because the restart is not itself a log event", "reason": "The runtime has no resident lifecycle event, and the order builds nothing new. The logs record the resumption under the same binding key, derived order and command identities, and the fault-injection record places the restart between evt_12 and evt_13."}
  ],
  "goalAlignment": {
    "traps": "Rule beating: accepting a partial witness of another run as the run's live view. Shifting the burden: leaving WO-083 to find out whether the live view works end to end. Escalation: the repair is one more scratch run of the same scenario, not new scope.",
    "noOp": "A pass would certify a live view that no run has shown from intent to terminal state."
  },
  "followup": "WO-118 resume: fix. (F1) From a fresh export of the repaired subject, run the representative scenario again from the filed intent to its terminal state. Include the actor kill, the resident restart and both control scenarios, with the shipped console live throughout. Record that run's console transcript, its status snapshot at each settlement and its dotln audit transcript, so one run carries criteria 1 to 5. Do the review-control author mapping as setup, before the first intent. Keep the earlier runs as evidence. (F3) Project a vertical-host actor row only for an admitted intent whose vertical is not terminal; a terminal vertical contributes at most its hold. Add a status test with several finished intents, and align the kit README if the display changes. (F4) The new receipt records each of WO-123-D044's five items and whether this run met its condition. Check: node --test scripts/test-vertical.recovery.mjs, node --test packages/skeleton/dist/test/runtime-status.test.js, npm test -- --review and npm run test:docs. The operator's alternative to F1 is a waiver of criterion 4 that names the visibility witness and the completed-run audit as standing evidence; F3 and F4 then remain follow-ups.",
  "reopenWhen": "A repair changes the runtime-status projection or the run evidence, a run is recorded whose console and audit both cover it from intent to terminal state, or the operator waives criterion 4."
}
```

## WO-118-D010 — Verification follow-up: target-facing text carries runtime identifiers outside the declared outward set

```json
{
  "id": "WO-118-D010",
  "date": "2026-10-13",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board VER-001 F2 as a follow-up; it does not block. The delivered pull request carries DotLn runtime identifiers outside the configured outward vocabulary and outside the receipt's listed terms and prefixes. The generated body cites verification:vertical_<key>_0, source-event, baseline-event and review-event ids of the form evt_N, and delivery-preparation#/ pointers. The runtime's rejection reply posts a JSON object with disposition and evidenceRefs, including a contract:<id> reference. The branch is fix/intent-<key>. Criterion 3 is judged against its declared set and passes. This meets planning receipt 2026-10-11-planning-fb68306765535a9d-044's criterion:3 reopening condition. The body, reply and branch generators predate this order and lie outside its declared surfaces.",
  "evidence": [
    "Read-only probe of the live pull request (bounded, 2026-10-13): its branch, title, body, both commit messages, two non-empty review bodies and three review comments, the runtime's reply among them, each pass checkOutwardArtifact against the instance's configured vocabulary and its synthetic deny marker. The receipt's outward.json covers the branch, title, body and commits only.",
    "The same probe's wider scan finds 'intent' in the branch and 'vertical' in the body. The body equals the receipt's generatedBody once the run key and hex ids are normalized. The reply reads {\"disposition\":\"rejected\",\"evidenceRefs\":[\"contract:<id>\",\"<sha>:index.html\",\"<sha>:host-test:0\"]}.",
    "Tree scan at the delivered head: 6 tracked files and no hit for the receipt's terms and path prefixes or the wider set (dotln, launchpad, work order, WO-, resident, vertical, loadout, harness, .runtime, docs/control, packages/skeleton, dotln.config)."
  ],
  "rejected": [
    {"option": "Fail criterion 3", "reason": "The criterion is judged against the declared set, and a case outside it is a follow-up by its own text and by the planning receipt's known issue."},
    {"option": "Repair it in WO-118", "reason": "The generators belong to WO-064, WO-066 and WO-112 and are outside this order's declared surfaces and authorized repairs."}
  ],
  "followup": "Planner, before WO-083's run against an operator repository: decide whether runtime evidence identifiers belong in target-facing text (generated pull-request bodies, disposition replies, branch names). If they do not, extend the outward screen to the generated body's evidence references and to reply bodies, render target-native references (commit, path, test), and add fixtures. If they do, declare the admitted forms in the outward vocabulary so the declared set names them. Check: npm test -- --only outward-lint, npm test -- --only target-publish and npm run test:docs.",
  "reopenWhen": "A review of an operator repository's pull request finds a DotLn identifier, or the outward vocabulary or generated body format changes."
}
```

## WO-118-D011 — Repair dispatch: run the witnessed rerun and restore the host guard

Dispatch: `resume: fix`, 2026-10-13, repairing VER-001. Root readback: Claude
Code, `claude-opus-5-5`, effort `max` from `CLAUDE_EFFORT`
(claude-session-readback; selected, not effective), Ultracode on.

```json
{
  "id": "WO-118-D011",
  "date": "2026-10-13",
  "dispatch": "resume: fix; VER-001 repair; two operator decisions in this dispatch",
  "decision": "Repair the blocking criterion-4 finding by its own rule: one fresh witnessed run from a new export of the repaired subject, writing to the operator's scratch repository under this dispatch's authorization. Restore the host guard by stopping the stale guard and the waiting guards behind it, so the bounded wrapper and both gates run again. Count native model launches with subagents under this dispatch's cap of 20: the driver aborts the run at its eighteenth native launch, and at most two Claude review workers follow it.",
  "evidence": [
    "Asked how the repair should proceed, the operator chose the recommended option to run the witnessed rerun. The question named the new ambiguous-control issue, the resident's push and pull request under the instance's standing grant, the planted suggestion and NeedsHuman answer posted from the operator's account, and the launch abort at 18 within the cap of 20. The host's auto-mode classifier had refused the setup as an external-system write.",
    "Asked how the stuck host guard should be handled, the operator chose the recommended option to let the executor stop it.",
    "Guard diagnosis, 2026-10-13T10:29Z to 10:46Z. The bounded wrapper and the session's guard registration failed with 'Host guard startup observation unavailable'. The guard directory held no guard.json. A guard started 2026-10-08 from the removed WO-188 worktree still ran, and its lock helper held guard.flock. Three later guards waited on that lock: one from this session's start and two from this dispatch's bounded build calls. test-runner.mjs registers every gate through ensureHostGuard, so both npm test and npm run test:docs failed at the same point.",
    "After the stop: a fresh guard started from this worktree's code and wrote guard.json, and a bounded no-op probe exited 0 (2026-10-13T10:46:14Z).",
    "During the diagnosis, before this decision, the package build and the native recovery suite ran directly because the bounded wrapper could not start (fix-checks.json). The review gate reruns the recovery suite under the restored guard.",
    "The VER-001 repair rule in WO-118-D009 and its reopening condition: a run whose console and audit both cover it from intent to terminal state."
  ],
  "rejected": [
    {"option": "Waive criterion 4", "reason": "The operator chose the run. A waiver is the operator's off-ramp and would leave no run that was both shown live and audited."},
    {"option": "Pause after the local projection repair", "reason": "The operator chose the run, and the blocking finding stays open without it."},
    {"option": "Leave the stale guard and keep working outside the guard", "reason": "Every gate registers through the guard, so neither gate could run. Bypassing it would remove the host's memory supervision rather than repair it; the two direct runs during diagnosis were the exception."},
    {"option": "Write a substitute guard.json for the running guard", "reason": "That fabricates the guard's own record instead of restoring a guard that writes it."}
  ],
  "goalAlignment": {
    "traps": "Rule beating: a second partial witness would repeat F1, so the run carries the kill, the restart, both controls, delivery and review together. Escalation: one run, with a launch abort and no retry without the operator. Shifting the burden: the stuck guard blocked every DotLn session on this host, so it is restored and its cause routed rather than worked around.",
    "noOp": "Without the run the order stays failed on criterion 4. Without the guard no gate row can be recorded."
  },
  "followup": "Machinery planner: a long-lived host guard can lose its guard.json record while it still holds guard.flock (observed 2026-10-13, cause unknown; one candidate is the operating system's cleanup of week-old temporary files). After that, every ensureHostGuard call starts another guard that waits on the lock forever and fails after 5 s, so the bounded wrapper and every gate fail on the host. Have the running guard re-assert its record each census, or let ensureHostGuard recognize a live lock holder; never start another waiter while one is already queued; add a host-guard test that removes the record under a live guard. Check: node --test scripts/test-host-guard.test.mjs.",
  "reopenWhen": "The run needs an eighteenth launch, a retry, or writes beyond the scratch repository, or the guard loses its record again before the follow-up lands."
}
```

## WO-118-D012 — Finished continuations leave live status

```json
{
  "id": "WO-118-D012",
  "date": "2026-10-13",
  "dispatch": "resume: fix; the VER-001 repair rule in WO-118-D009 for unbounded status rows",
  "decision": "Repair projectRuntimeStatus so it projects a vertical-host actor row and live episode only while an admitted intent's latest step has not settled terminally. A continuation whose latest IntentStepSettled matches its latest IntentStepStarted with terminal true has finished: it leaves the actor list and contributes at most one hold, only when its outcome still awaits a human (NeedsHuman, retry, repair or refused). A pause between steps is not a finish, so its row stays. The kit README states the display rule; no schema, event or scheduling changes.",
  "evidence": [
    "packages/skeleton/src/runtime-status.ts: the terminal branch precedes the actor row, the live episode and the hold.",
    "packages/skeleton/test/runtime-status.test.ts, 'finished vertical continuations leave live status and keep at most one hold each'. Twenty resolved, three refused, one terminal NeedsHuman and one terminal repair continuation project no actor row. A paused continuation keeps an unknown row and the running one keeps an available row with its live episode. The three refused, the terminal NeedsHuman and repair outcomes and an admission hold each appear once. After the running step settles terminally its row and episode retire and the holds are unchanged. 10 of 10 pass (fix-checks.json).",
    "probe-status-retirement.mjs replays the new test's own ledger. Through the pre-repair projection the visibility run exported it gives 27 vertical-host rows, still 27 after the running step settles. Through the repaired build it gives 2, the paused and running continuations, then 1. The six holds match in both, so the new test fails on the pre-repair code (fix-checks.json).",
    "Scope: this corrects the live-status projection repair the operator authorized in WO-118-D007, and WO-118-D009 routes it to this fix dispatch.",
    "node --test scripts/test-vertical.recovery.mjs: 15 of 15 with the repaired projection, including the terminal hold cases (fix-checks.json)."
  ],
  "rejected": [
    {"option": "Drop terminal holds too", "reason": "A refused or NeedsHuman continuation still awaits the operator; hiding it would hide a decision the console exists to show."},
    {"option": "Cap the number of rows", "reason": "A cap hides live work arbitrarily; the terminal settlement is the recorded fact that ends a row."},
    {"option": "Read terminal state from the vertical stores", "reason": "The projection reads only the resident ledger and state; the ledger's terminal settlement already carries the fact."}
  ],
  "reopenWhen": "A continuation can start a step after a terminal settlement, or a terminal hold gains a recorded answer that should retire it."
}
```

## WO-118-D013 — The witnessed run carries criteria 1 to 5

```json
{
  "id": "WO-118-D013",
  "date": "2026-10-13",
  "dispatch": "resume: fix; the VER-001 repair rule in WO-118-D009 for the live view, the carry-in record and the run",
  "decision": "Record the witnessed run from a fresh export of the repaired subject as the run that carries criteria 1 to 5, and keep every earlier run as evidence. The repair holds this rule for the live-view class: one run carries the criteria. Its shipped console runs from before the first command until after the terminal state. In its change-driven frames it paints every step that lasts two console refreshes (two seconds) or more as live vertical work, the hold while work runs, the derived order's status, the work after the resident restart and the finished state. Its status snapshots cover each settlement, and its audit reproduces the same stores. The witnessed receipt records each of WO-123-D044's five conditions and whether the run met it. One observed behavior outside the repairs is routed below.",
  "evidence": [
    "witnessed-run/receipt.json and check-witnessed-run.mjs (bounded, exit 0). The representative intent ran all 14 phases to a resolved terminal state with no NeedsHuman. The resident restarted between bundle and contract under one admission and one opened vertical. The source writer was killed with SIGKILL after one heartbeat, with no commit and no edited path, and replaced under the same command and episode after its process group stopped; one source commit and one review repair commit followed. Model triage accepted the delayed whitespace suggestion and rejected the planted one with three evidence references; both threads are resolved, and the delivered head re-verifies against the original criterion.",
    "Console: 73 frames from the exported instance's console. 37 were painted on observed changes, 18 are status frames the driver requested at the settlements, hold, kill, planting and terminal state, and 18 repaint the live view after them. Seven steps lasted two seconds or more (baseline, source-change, verification, review, publish, observation, resolution), and change-driven frames alone painted each as an available vertical-host actor, as well as lint. The contract hold shows beside live work, derived order WO-902 shows active, a status frame after the restart shows the same work, and the final frame has no vertical-host row while the hold remains.",
    "Snapshots: one per settlement (14), plus the hold, kill and terminal state, and one marker row for the restart with no view. Each view shows the hold and at most one vertical-host row, the terminal one none, and each equals its copied file with the run key aliased.",
    "Audit: dotln audit over the vertical store holds all 29 events in its governed raw view, equal to the retained log; its L0 receipts and causal entries are empty, as in the completed run. dotln audit over the resident store was recorded too.",
    "Human side: presence away and two intent filings are the only human-origin events. The control-author mapping preceded the resident's first start and the first filing. The answer to the ambiguous control was posted before the representative intent was filed and was not consumed. The kill, the restart and the planted suggestion all precede the terminal state. Console input was only status requests, which append no event, until the driver closed the console with quit after the terminal state.",
    "Carried items: none of WO-123-D044's five conditions occurred. The target lists 3 worktrees, none prunable. Both issues were configured at setup. The in-flight policy is finish and presence was only away. Authority admitted. Every writer ran on codex-cli-exec. The admitted intent carries its model-produced baseline assessment (FUP-faae1df8f1022634).",
    "Launches: 13 native model launches (2 intake records, 7 worker attempts, 4 triage records), under the run's abort at 18. No Claude subagent had been spawned by this point.",
    "Observed outside the repairs: evt_15, ActorUnavailable for the probe phase, 'portfolio execution unavailable: no WO-120, WO-052 and WO-054 hosts are bound to this resident', recorded after the hold while no draft waited. Live status then showed an actor-unavailable dispatch hold for the rest of the run; the vertical continuation completed unaffected. The completed run recorded the same event (its evt_98) one second after its own ambiguous hold, which came after its vertical had terminated, so there the hold never appeared beside vertical work."
  ],
  "rejected": [
    {"option": "Keep the separate visibility witness as criterion 4's evidence", "reason": "VER-001 rejected it: it is a partial run with no audit."},
    {"option": "Hide the actor-unavailable hold in the projection now", "reason": "The resident recorded the event. Changing how an unbound portfolio actor schedules or displays is a product choice outside the authorized repairs."},
    {"option": "Rerun with both intents filed together to avoid the idle cadence", "reason": "The completed run filed them together and met the same event once its hold came; reordering only moves the behavior later, and would spend another run's launches. This run meets every criterion."},
    {"option": "Rewrite the product status sentences for the new run", "reason": "They state what was observed and remain true. The vision sentence is bound by its exact writeback route, and the capability section, this order's own appended text, now cites the witnessed receipt."}
  ],
  "goalAlignment": {
    "traps": "Rule beating: the checker asserts the console against step durations from the ledger, not against a hand-picked frame list. Seeking the wrong goal: the run repeats the whole loop, not only the display. Shifting the burden: the unbound-actor hold is routed with a condition before WO-083, not left for that run to discover.",
    "noOp": "Without this record the order holds no run that was both shown live and audited.",
    "outcome": "Matched: one run carries criteria 1 to 5, and the earlier runs remain."
  },
  "followup": "Planner, before WO-083's run: a starter resident whose portfolio actor has no bound execution hosts records ActorUnavailable whenever its cadence finds no draft or runnable continuation. Live status then shows a standing actor-unavailable dispatch hold beside resident-owned vertical work for the rest of the run. This was observed in WO-118's witnessed run after the ambiguous control's hold. Decide whether an intent-only portfolio phase should skip the unbound actor, report it as configuration rather than as a dispatch hold, or clear the hold once vertical work dispatches. Check: node --test packages/skeleton/dist/test/runtime-status.test.js and node --test scripts/test-vertical.recovery.mjs.",
  "reopenWhen": "A later run's console misses a step that lasts two refreshes or more, the audit stops reproducing a store the console showed, or the unbound-actor behavior changes."
}
```

## WO-118-D014 — Independent review of the repair

```json
{
  "id": "WO-118-D014",
  "date": "2026-10-13",
  "dispatch": "resume: fix; two fresh dotln-worker reviews of the repair",
  "decision": "Two fresh read-only reviewers judged the repair diff and the retained run. A criteria adversary and a design improver each found no blocking issue, and the adversary could not refute that the witnessed run closes VER-001's live-view, status-row and carry-in findings. Fix every finding about evidence accuracy and checker strength. Decline the changes to files the witnessed export carries: after the run they would make the final subject differ from the export the run used, for wording or naming alone. Route the pre-existing home-directory paths both reviewers met in WO-187's records.",
  "evidence": [
    "self-review.md lists all 26 findings with their dispositions. Improver: 15 found, 12 fixed, 3 recorded. Adversary: 11 found, 9 fixed, 2 recorded.",
    "Fixed: the checker now derives each claim from the retained stores. That covers the outward screen over the recorded pull request and the runtime's reply, the verification at the delivered head, thread resolution from the recorder's kept read, all five carried conditions and the recomputed measures. It ties the committed console, snapshot and audit transcripts to their sources and holds the restart between the bundle settlement and the contract start. It parses console frames strictly, counts only change-driven frames as the console's report, and checks that the export's runtime equals the core build. The recorder keeps the thread read, inventories the setup's one remote write and leaves the export's build hashes unredacted. The discrimination probe is committed and reproducible. D011, D012 and D013, the README, the measure methods and the capability section's audit wording are corrected.",
    "Rerun after the fixes: check-witnessed-run.mjs and probe-status-retirement.mjs both exit 0 under the bounded wrapper (fix-checks.json)."
  ],
  "rejected": [
    {"option": "Name the four awaiting-operator results in runtime-status.ts", "reason": "Behavior-neutral naming in a shipped runtime file. It would change the build the witnessed export carried."},
    {"option": "Trim the new status test's admission hold and comment its stand-in step", "reason": "The compiled test ships in the kit; the case is redundant but correct."},
    {"option": "Reword the kit README's hold sentence", "reason": "The kit carries that file. The current sentence is true: refused and NeedsHuman continuations keep their holds, and nothing clears them yet."},
    {"option": "Rewrite the product status sentences for the new run", "reason": "They remain true, and the vision sentence is bound by its exact writeback route."},
    {"option": "Add a recent-outcome row for resolved continuations", "reason": "A design option for WO-083's planner, not a defect; the derived order's status still shows in the order list."},
    {"option": "Correct WO-187's records in this order", "reason": "They are a closed order's evidence outside this order's surfaces; a correction belongs to that order's record."}
  ],
  "followup": "Planner, privacy cleanup: at HEAD, docs/evidence/WO-187/decisions.md (WO-187-D043), three WO-187 evidence files (verification-002/root-probes.json, repair-004/review-gate.json, repair-004/document-gate.json) and the follow-up register row derived from WO-187-D043 contain the operator's absolute home-directory path. The document gate refuses such paths only in Markdown, against a baseline. Decide whether to correct those records to aliases, recorded as a correction on WO-187, and whether the home-path refusal should also cover JSON evidence under docs/. Check: npm run test:docs.",
  "reopenWhen": "A verifier finds a fixed item regressed, or a later order changes a file the witnessed export carried and the declined wording changes become free to make."
}
```

## WO-118-D015 — Verification: board the checker's build-drift exit behavior

```json
{
  "id": "WO-118-D015",
  "date": "2026-10-13",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Board the witnessed-run checker's build-drift exit behavior as a nonblocking follow-up. Its final currentBuildMatchesExport field reports a mismatch, but the process still exits zero. The recorded export and current subject do match: independent verifier assertions compared all 241 exported JavaScript files with the current build, all 662 candidate source files with the subject, and all 913 manifest entries with the exported files. This does not break a WO-118 criterion at the recorded subject or behavior main had, so it does not fail the verdict. The verifier leaves the implementation and executor's checker unchanged.",
  "evidence": [
    "docs/evidence/WO-118/verification-002/probe.mjs checker-negative, under node scripts/harness.mjs bounded, supplies synthetic extra bytes for the current runtime-status build through a process-local read interception. No file changes. The executor's check-witnessed-run.mjs exits 0 and prints currentBuildMatchesExport false. verification-002/probes.json records the result.",
    "check-witnessed-run.mjs asserts exported.runtimeHashes equals exported.coreBuildHashes, both in the recorded export receipt. The newly computed builtNow comparison is only a console.log field, not an assertion.",
    "Independent local and export-candidate probes pass: 241 exported JavaScript files equal the current build; 662 source files equal the witnessed candidate; verifyKit verifies 913 manifest files with zero differences. The current product-gate code identity equals the executor's recorded passing review gate."
  ],
  "rejected": [
    {
      "option": "Fail the current run or rerun its native actors",
      "reason": "The current subject matches the witnessed export, independently asserted. A future mismatch is a checker weakness, not a failed present criterion; another live run would add external effects and model launches without resolving that weakness."
    },
    {
      "option": "Change the executor's checker during verification",
      "reason": "The verifier judges the subject and writes evidence; it does not repair the implementation it judges."
    }
  ],
  "goalAlignment": {
    "traps": "Rule beating: an exit-zero receipt can be mistaken for a passing build-identity assertion. Escalation: do not convert an independently proven match into another live-run requirement. Preserve the explicit false result and route the narrow missing assertion.",
    "noOp": "The current verification can pass, but a later caller relying only on the checker's exit code could carry a run across build drift."
  },
  "followup": "Evidence maintainer, before reusing check-witnessed-run.mjs to certify another subject: make current build versus recorded export equality an asserted check, and give missing current build output an explicit unavailable result. Add a negative control equivalent to verification-002/probe.mjs checker-negative that expects the checker to exit nonzero when one current build file differs; retain the passing current-subject check. Check: node scripts/harness.mjs bounded -- node docs/evidence/WO-118/check-witnessed-run.mjs and npm run test:docs. This is inside WO-118's declared evidence surface and is eligible for an adjacent repair if another repair dispatch occurs.",
  "reopenWhen": "The witnessed checker is reused after a source or build change, or a caller treats its exit code as proof that the current build matches the export."
}
```

## WO-118-D016 — Verification: retain a documentation inventory follow-up

```json
{
  "id": "WO-118-D016",
  "date": "2026-10-13",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Record product 03's stale starter inventory as a nonblocking documentation follow-up. Its Platform and instance boundary section still describes the compiled runtime as kernel, compiler and skeleton and the export as four workspaces. WO-118 adds console, making four runtime packages and five workspaces including beacons. The kit README already names the four runtime packages correctly. Product 03 is outside criterion 6's named write-backs and this order's declared document repairs, and the export actually carries the console, so this does not fail an acceptance criterion or regress executable behavior.",
  "evidence": [
    "docs/product/03-architecture.md, Platform and instance boundary, the paragraph beginning The kit's first slice: compiled runtime of kernel, compiler and skeleton; lockfile pruned to them and the four workspaces.",
    "scripts/launchpad.mjs RUNTIME_PACKAGES contains kernel, compiler, skeleton and console; KIT_WORKSPACES prepends packages/beacons. scripts/kit/README.client.md names the console in the carried runtime and documents its build-free live command.",
    "VER-002's export checks verify all 913 manifest entries and assert equality of 241 exported JavaScript files with the current build; the witnessed shipped console transcript shows the same run through terminal settlement."
  ],
  "rejected": [
    {
      "option": "Edit product 03 in this read-only verification",
      "reason": "The verifier records findings and does not change the implementation or expand this order's write-backs."
    },
    {
      "option": "Fail criterion 6 or treat the console as absent",
      "reason": "The required product 00, product 12, README and capability-table write-backs hold, and the executable export evidence proves the console is present."
    }
  ],
  "followup": "Documentation maintainer, at the next starter-export or product 03 maintenance change: update Platform and instance boundary's kit inventory to include console and five workspaces, or describe the inventory by its canonical runtime-package declaration so another addition cannot stale the count. Keep the absence of browser-evidence explicit where relevant. Check: npm run publication:check and npm run test:docs.",
  "reopenWhen": "A reader relies on product 03 to inspect an export, or the starter package inventory or that section changes."
}
```

## WO-118-D017 — Final review: integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-118/10 -->

```json
{
  "id": "WO-118-D017",
  "date": "2026-10-13",
  "dispatch": "resume: final review; worktree integrate WO-118",
  "decision": "Integration took in nothing: the base and the fetched main are both 6421221bb46fcb42ed85af112f0c1c2b539200b8, origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-118/10), retained its named stash 20c4b1f9e1b53a297247c1bfb8e1add9a97bbbdb, verified the intake backup that a fresh npm run backup:intake made of the three ignored intake files in the session scratch, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (no diff against main under .claude, .agents and .codex; harness check passes with 34 surfaces), the control projection, the release preparation (meter snapshot and PR meter), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry, the publication locks and the selected console fixtures. Every acceptance claim is carried forward unchanged: VER-002's seven criterion judgments at code identity 99fb21b175c81af5e893fdbd22fe96663e9ae34df959772247cd2dac98f35448; the executor's passing npm test -- --review row at that identity (2026-10-13T11:58:03.830Z, 36 suites, 91 fresh tasks, exit 0); VER-001's F1, F3 and F4 as repaired (D012, D013) and its F2 as boarded (D010); VER-002's F1 and F2 as boarded (D015, D016); the executor's implementation reviews (found 2, fixed 2) and repair reviews (found 26, fixed 21, recorded 5 in D014). gateCodeIdentity returned the same identity before and after integration. Release preparation keeps application v0.80.0 under the order's minor classification: local tags end at v0.79.0, origin lists v0.79.0 and no v0.80.0, and check-surfaces --local reports the release block v0.80.0 over v0.79.0, @dotln/skeleton's src changed with 0.58.1 over 0.58.0, every other component's src unchanged with no bump required, and the console's exact skeleton pin at 0.58.1, so no component version collides. The five evidence editions register packages/skeleton/package.json and package-lock.json, whose only change is the component release label that evidenceSourceContent normalizes away (WO-152 D004), and no feedback-judged source changed, so integration owes no re-mint. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper; npm test -- --review runs in the handoff sequence and is recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-118/10",
    "base 6421221bb46fcb42ed85af112f0c1c2b539200b8",
    "upstream 6421221bb46fcb42ed85af112f0c1c2b539200b8",
    "git ls-remote origin at 14:08Z: refs/heads/main 6421221b and no wo-118 branch; git log main..HEAD empty; git ls-remote --tags origin lists v0.79.0 and no v0.80.0; no local v0.80.0 tag",
    "release preparation: WO-118 target v0.80.0 remains current. Files changed: docs/evidence/WO-118/meta.json, docs/final-reviews/WO-118/PR.md. Meter snapshot: docs/evidence/WO-118/meta.json, 4412 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-13T14:09:15Z to 14:09:43Z, each exit 0: npm run publication:check (254/254 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.80.0 against latest local tag v0.79.0; skeleton src changed at 0.58.1; five other components unchanged with no bump; workspace pins exact; github-body-profile passes on PR.md), node scripts/lineage.mjs index --check (170 sections), node scripts/check-publication.mjs --print-locks (both locks equal the committed values), npm run format:check and npm run plan -- check (authorized-execution-writeback bound by WO-118-D007); git diff --check clean. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity before and after integration: 99fb21b175c81af5e893fdbd22fe96663e9ae34df959772247cd2dac98f35448; git diff --stat main -- .claude .agents .codex is empty",
    "scripts/lib/evidence-sources.mjs registers packages/skeleton/package.json and package-lock.json in the authority, artifact-identity, verification, feedback and harness editions and none of the order's other changed files; product 07 records that evidenceSourceContent normalizes component release labels away; FEEDBACK_SOURCE_PATHS names none of the changed files"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Regenerating projections is integration bookkeeping and never a finding (product 07 §Independent workflows and integration); no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-13. Original base: `6421221bb46fcb42ed85af112f0c1c2b539200b8`.
Fetched main: `6421221bb46fcb42ed85af112f0c1c2b539200b8`. Checkpoint: `refs/dotln/checkpoint/WO-118/10`.
Named stash retained: `20c4b1f9e1b53a297247c1bfb8e1add9a97bbbdb` (WO-118 integrate 2026-10-13).
Intake backup: `DotLn-wo118-intake-20261013T140842Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-118 target v0.80.0 remains current. Files changed: docs/evidence/WO-118/meta.json, docs/final-reviews/WO-118/PR.md. Meter snapshot: docs/evidence/WO-118/meta.json, 4412 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's seven criterion judgments and the executor's passing review row at code identity `99fb21b1…`, which the integrated tree keeps; VER-001's F1, F3 and F4 as repaired (D012, D013) and its F2 as boarded (D010); VER-002's F1 and F2 as boarded (D015, D016); the executor's implementation and repair reviews (found 2, fixed 2; found 26, fixed 21, recorded 5 in D014). No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: three of the four printed checks pass on the integrated tree (evidence above); the review gate is in FINAL-001.

## WO-118-D018 — Final review follow-up: live status misses how a resident-owned continuation ends

```json
{
  "id": "WO-118-D018",
  "date": "2026-10-13",
  "dispatch": "resume: final review; FINAL-001 F1, F4, F6 and F11",
  "kind": "finding",
  "decision": "Board, not fix, four gaps in how live status shows resident-owned work. None fails a criterion or breaks behavior main had, because main's status showed no vertical work at all. F1, in this order's D012 surface: a continuation whose authority or wall budget expires between steps ends NeedsHuman in its vertical store only. No terminal IntentStepSettled reaches the resident ledger, so status keeps the last settled step as a vertical-host actor row with availability unknown and shows no hold, contrary to the kit README's sentence that a continuation which ended awaiting a decision keeps its hold. F4, older than this order: the budget line projects only portfolio-actor dispatch, so it read 0 episodes consumed in all 73 witnessed frames although intent admission charges the same portfolio budget. F6, also older: the order list keeps the derived order WO-902 active and the representative WO-901 draft through the terminal settlement, so once the finished continuation leaves the actor list the console shows nothing about the outcome; D014 declined a recent-outcome row because the derived order's status still shows, but that status never changes. F11: product 04 §runtime-status-v1 does not describe the logical vertical-host rows, the resident transport or the intent hold codes, which only the kit README states. The witnessed run met criterion 4 as written: it did not expire, and the console showed its actors, phases, holds and order status.",
  "evidence": [
    "F1 reproduction (bounded, 2026-10-13T14:36Z): a runtime reviewer's read-only probe over the vertical fixture with the resident path settles bundle, contract and surfaces, then sets the clock past binding.authority.expiresAt (600120) and ticks twice. The vertical terminal is NeedsHuman at derived-order with reason 'vertical authority or wall budget expired'; the resident ledger still holds three non-terminal settlements; status actors are probe:portfolio:unknown and surfaces:vertical-host:unknown; holds are empty after both ticks.",
    "F1 code: packages/skeleton/src/vertical-host.ts records the expiry receipt without starting a step; packages/skeleton/src/vertical-scheduling.ts appends IntentStepSettled only when the resident's intentStep matches the receipt's command, and intentStep is null between steps; packages/skeleton/src/runtime-status.ts retires a continuation only on a terminal IntentStepSettled for its latest started command; scripts/kit/README.client.md says that a continuation which ended awaiting a decision keeps its hold.",
    "F4: packages/skeleton/src/runtime-status.ts builds the budget only from state.portfolio, as main does; packages/skeleton/src/vertical.ts admits an intent only while its spent budget stays below portfolio.budget, and intentBudgetUsed counts each admitted intent; witnessed-run/console.txt reads '0 episodes used' or 'episodes 0 consumed' in all 73 frames.",
    "F6: witnessed-run/console.txt shows 'WO-902: active' in all 63 order-list lines and 'WO-901: draft' in all 66, including the final status frame after the terminal settlement.",
    "F11: docs/product/04-interfaces.md describes runtime-status-v1 as selecting configured actors; packages/skeleton/src/runtime-status.ts adds vertical-host actors keyed by continuation step, live episodes with transport resident and launch claims source none, and intent-needs-human:<step> and intent-refused:<step> holds; the decoder and packages/console/runtime-status-v1.schema.json accept them as free strings.",
    "Observations, not findings: the projection rebuilds verticalProgram(key) for every admitted intent on each publication, about 23 µs per intent and 47 ms at 2,000 finished intents by a bounded probe; a step kept pending after an actor death shows as an available live episode until relaunch, also while presence or a dispatch hold delays the relaunch (inference from code); an event with a null payload makes the projection throw, but replayResident rejects such a ledger first with 'invalid resident event payload' (bounded probe), so no resident path reaches it."
  ],
  "rejected": [
    {
      "option": "Fail the review on F1",
      "reason": "No criterion names an expired continuation, and main showed no vertical status at all; product 07 routes an in-surface defect that breaks no criterion as a follow-up."
    },
    {
      "option": "Repair the projection or the scheduler in this review",
      "reason": "A runtime change after two verifications would ship unverified behavior and need a fresh product gate; the reviewer's Boy Scout bound covers low-risk cleanup, not a new projection rule."
    },
    {
      "option": "Reword the kit README sentence now",
      "reason": "It holds for every continuation that ends by a step's settlement and the witnessed export carried it; the follow-up makes it true for an expiry between steps or narrows it, and the release text names the limit meanwhile."
    }
  ],
  "followup": "Planner, before WO-083's run: make live status show how every resident-owned continuation ends. (F1) When a continuation's authority or wall budget expires between steps, either have the resident record a terminal settlement for that stop or have projectRuntimeStatus treat an admitted intent whose binding.authority.expiresAt is at or before state.at, with no matching intentStep, as finished: drop its actor row and project one intent-needs-human hold. Add a status regression for an expiry between steps, and keep scripts/kit/README.client.md's hold sentence true. (F4) Project intent admission's budget use into runtime-status-v1's budget, or label the line as portfolio-actor spending only, with a status test that admits one intent. (F6) Decide how the console shows a finished continuation or derived-order progress once its row retires, together with FUP-eeb25ea9315438ad's question. (F11) Describe the vertical-host rows, the resident transport and the intent hold codes in product 04 §runtime-status-v1. Optional in the same change: skip or memoize the program walk for finished intents. Check: node --test packages/skeleton/dist/test/runtime-status.test.js, node --test scripts/test-vertical.recovery.mjs, npm test -- --review, npm run publication:check and npm run test:docs.",
  "reopenWhen": "A later run's console shows a stale vertical-host row or omits a hold for a continuation that ended, or an order changes runtime-status-v1's actors, holds or budget."
}
```

## WO-118-D019 — Final review follow-up: the source host drops a writer's requiresHuman, and the Codex writer's commit command fails under its Git grants

```json
{
  "id": "WO-118-D019",
  "date": "2026-10-13",
  "dispatch": "resume: final review; FINAL-001 F2, F3 and F5",
  "kind": "finding",
  "decision": "Board three source-actor items found in the retained runs and the diff. None fails a criterion or breaks behavior main had. F2: in every WO-118 starter run, each native source writer that returned a result reported status blocked with requiresHuman true, including both writers of the witnessed run, the source writer's replacement attempt and the review repair's writer. The source-change host, which this order does not change, records the envelope and admits the step on its own integrity, worktree, effect, observed-commit and test observations; it never reads status or requiresHuman, so no hold, NeedsHuman or receipt field carries the writer's request. The witnessed run's claims stay true as stated (the control log holds no NeedsHuman, and no operator tended a harness) and are read alongside this record. F3: each writer's summary says the supplied git commit exited 128 after sandbox denials on .git/packed-refs.lock and .git/rr-cache, yet each commit landed and matched the host's observation. The writers ran codex-cli-exec 0.162.1; WO-112-D017 qualified the dotln-writer grants at 0.160.0 and grants the worktree's gitdir and the common objects, refs and logs, which do not include the common directory's packed-refs lock or rr-cache. The host's Git configuration enables rerere, a likely source of the rr-cache write (inference). D017's reopening condition, a live Codex writer failing to commit through these grants, has occurred in substance: the commit command fails although the commit lands. F5: the interrupted-writer branch WO-118-D003 added also changes the operator path. Under dotln vertical a killed writer now leaves the source step pending, so the command prints a pending continuation and exits 1 and a rerun retries it within the source host's two-attempt bound, where main refused the issue. That matches WO-199's rerun semantics, but no test runs it through runVerticalIssue.",
  "evidence": [
    "F2 reproduction (bounded, 2026-10-13): a read-only scan of every WorkerResultObserved event in the retained run directories finds the witnessed run's source writer (evt_131) and review repair writer (evt_98) at status blocked with requiresHuman true, each followed by two SourceChangeIntegrityChecked events, SourceChangeObserved and CommandResult. The completed run's source writer, the repaired attempt and the visibility run read the same; only the completed run's repair writer reported completed. The evidence reviewer's independent scan agrees.",
    "F2 code: packages/skeleton/src/source-change-host.ts reads only observedCommit from the envelope before admitting, and git diff HEAD shows that file unchanged. Product 02 says requiresHuman independently records whether an operator decision is needed; packages/skeleton/src/worker-protocol.ts tells the writer to report requiresHuman when an operator decision is needed and says the host observes denial accounting separately; the envelopes record observedDenials as unavailable.",
    "F3: the witnessed source store's WorkerAttemptStarted events record codex-cli-exec 0.162.1, gpt-6.1-sol and max; the writers' summaries name the exit 128 and the denied paths; the retained target clone holds packed-refs and no rr-cache directory, and git config reports rerere.enabled true from the host configuration. WO-112-D017's grants and its reopenWhen are in docs/evidence/WO-112/decisions.md.",
    "F5: scripts/lib/vertical-runtime.mjs passes the operator path an active observer that admits a launch when no dispatch hold, revocation or open machine step exists and authority is unexpired; packages/skeleton/src/vertical-host.ts breaks on WorkerFailure('interrupted') for source-change when active(true) admits; packages/skeleton/src/dotln.ts prints a pending continuation and sets exit code 1; scripts/test-vertical.recovery.mjs covers the resident path in five modes and a direct VerticalHost with and without active, not runVerticalIssue (reading, not executed)."
  ],
  "rejected": [
    {
      "option": "Fail the review because the writers asked for operator verification",
      "reason": "Each writer's uncertainty was whether its commit landed; the host observed the commit, its match with the writer's observedCommit and the test going from exit 1 to exit 0, and independent verification passed the delivered head against the original criterion. Criterion 1 judges the control log, which holds no NeedsHuman, and the host's admission rule predates this order and lies outside its surfaces."
    },
    {
      "option": "Make the source-change host read requiresHuman in this review",
      "reason": "A runtime change to an unchanged host is outside this order's authorized repairs and would ship without verification."
    },
    {
      "option": "Leave the grant row settled",
      "reason": "Its own reopening condition occurred in every run of this order, and the next live writer against an operator repository meets the same denials."
    }
  ],
  "reopens": {
    "decisionId": "WO-112-D017",
    "observation": "In every WO-118 starter run on 2026-10-13 the codex-cli-exec 0.162.1 source writer reported that the supplied git commit exited 128 after sandbox denials on .git/packed-refs.lock and .git/rr-cache, although each commit landed and matched the host's observation; each writer then returned blocked with requiresHuman true. D017 qualified the grants at 0.160.0. The register row FUP-c842faafbe34c7da is reopened with this evidence."
  },
  "followup": "Planner, before WO-083's run against an operator repository: (F2) decide whether the source-change host turns a writer's blocked status or requiresHuman into a typed hold, or records an explicit host-verified supersession event that names the request and the observation that answered it, so the receipt shows both; add a source-change host case for the choice. (F3) Requalify the Codex dotln-writer grants at the installed CLI on a host whose Git configuration enables rerere and holds packed refs: grant or neutralize the common directory's packed-refs lock and rr-cache writes, and record denials from the host's own denial log rather than the writer's summary. (F5) Add one operator-path case: runVerticalIssue with a writer killed before commit returns a pending continuation, and a rerun completes the step without a second commit. Check: node --test scripts/test-vertical.recovery.mjs, the source-change host cases in npm test -- --review, and npm run test:docs.",
  "reopenWhen": "A live writer's commit command fails again under the grants, a run's receipt claims no human request while a writer reported one, or an order changes source-change admission."
}
```

## WO-118-D020 — Final review follow-up: an authorized story writeback does not compose with a vision citation relocation

```json
{
  "id": "WO-118-D020",
  "date": "2026-10-13",
  "dispatch": "resume: final review; FINAL-001 F7 and F8",
  "kind": "finding",
  "decision": "Board F7 and fix F8. F7: checkPlanContinuation proves a vision citation relocation over the whole product 00 file. Once the authorized story writeback is committed, the story no longer equals its judged bytes and carries one more inline link, so the gate refuses a relocated planning link that main admits until the next planning pass judges the new vision. No order in the current sequence relocates a vision citation, and for every input state the new code admits at least what main admits, so nothing main had breaks. F8: product 07 placed the writeback sentences before 'Do this during authorized execution…', whose citation then read as the writeback rule's source, and it did not say that only the order's current amendment carries a writeback. This review moved the writeback sentences after that citation, added that a later amendment of the order restates the writeback, cited WO-118-D004 and D007, and refreshed the software-engineer edition's lock. Recorded with it: WO-118-D004's reopening condition (accepted section bytes change) occurred when D007 rebound the writeback from accepted hash sha256:0685358a… to sha256:58c78ca8… for the completed run's sentence; D007's own text records only the live-status repair, and its rebinding reason is in its PlanExecutionAmended row. The binding itself is correct: the recomputed criterion, source and accepted hashes equal D007's entry. A writeback's criterion is an unchanged-text anchor, so the authority rests on the operator's decision and its amend-order row, as product 07 states.",
  "evidence": [
    "F7 reproduction (bounded, 2026-10-13): in a planning reviewer's scratch clones of this repository, moving product 05's 'Candidate — success under growth' section to a new planning file and rebasing the vision link in §What DotLn is not passes the gate on main's state (relocated-planning-link) and refuses on a simulated WO-118 merge ('sequence, vision, roles or order inventory changed'); the simulated merge alone passes with authorized-execution-writeback for WO-118. This review reran the gate on all three clones with the same results.",
    "F7 code: scripts/lib/plan-continuation.mjs calls relocatedLinks with complete: true over the whole vision file when a vision input other than the authorized story differs; the planning reviewer traced the refusal to the inline-link count and the restored-bytes comparison (inference from the code; the refusal is observed).",
    "F8: scripts/lib/plan-receipts.mjs currentAmendments keeps the latest PlanExecutionAmended row per receipt and order, and checkPlanGate passes only those rows of the latest receipt to checkPlanContinuation; the planning reviewer's bounded attack re-amended WO-118 with a decision lacking the writeback, and the gate then refused. After this review's edit, npm run publication:check reports both editions CURRENT, npm run plan -- check passes with authorized-execution-writeback and node scripts/lineage.mjs index --check passes.",
    "D004 executionWritebacks acceptedHash sha256:0685358ac74db8c280949a48e99ba3b06d69b032b381a0856a4f33e2bf94d53a; D007 acceptedHash sha256:58c78ca800096e3871ea0546dcfc589f2050bb72aaa1ac54dfe82ec2c4fffeed; the docs/control/plan-refutations.jsonl rows of 02:15:39Z and 02:39:58Z bind D007.",
    "Anchor: the planning reviewer's bounded attack added an executionWritebacks entry to WO-200-D002 naming WO-200 criterion:2, which says nothing about product 00, and the gate admitted it after amend-order; naming WO-200's amended criterion:1 refused with 'execution writeback requires its unchanged reviewed criterion'."
  ],
  "rejected": [
    {
      "option": "Fail the review on F7",
      "reason": "No criterion names a relocation, no queued order performs one, and the window closes at the next planning pass."
    },
    {
      "option": "Edit D004 or D007 to record the rebinding",
      "reason": "Both are bound by PlanExecutionAmended rows, and editing a bound decision breaks its binding; this record carries the reopening instead."
    },
    {
      "option": "Require the writeback's criterion to cite product 00",
      "reason": "A semantic check of criterion text is a design change for the planner; product 07 already states that the decision and its amendment carry the authority."
    }
  ],
  "reopens": {
    "decisionId": "WO-118-D004",
    "observation": "Accepted story bytes changed after D004: D007 rebound the exact writeback from acceptedHash sha256:0685358a… to sha256:58c78ca8… for the completed run's sentence, and the planning check passes on D007's binding."
  },
  "followup": "Machinery planner: let an authorized story writeback compose with other admitted vision continuations. Prove a vision citation relocation against the current vision with the authorized story section restored to its judged bytes, or apply the writeback after the relocation proof; add a fixture that commits a writeback and then relocates a vision citation; optionally make the refusal name a writeback the current amendment dropped. Check: node scripts/test-plan-refutation.mjs, npm run plan -- check and npm run test:docs.",
  "reopenWhen": "An order needs to relocate a vision citation before the next planning pass, or another product section needs an execution-writeback route."
}
```

## WO-118-D021 — Final review: pass FINAL-001 at the integrated subject; eleven follow-ups, three fixed in place

```json
{
  "id": "WO-118-D021",
  "date": "2026-10-13",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass the final review of WO-118 at the integrated subject, code identity 99fb21b175c81af5e893fdbd22fe96663e9ae34df959772247cd2dac98f35448, the identity VER-002 judged; integration changed no judged byte (D017), and this review's edits change no code byte. All seven criteria hold: one witnessed run from a fresh export of the reviewed subject carries the resident-owned loop from the filed intent to a resolved terminal state with only the admitted human events, replaces a killed writer under the same command and episode without a second commit and resumes after the resident's restart under the same identities, delivers a pull request whose delayed comment is repaired and re-observed resolved and whose planted suggestion is rejected with evidence, shows its actors, phases, holds and order status in the instance's own console and is reproduced by the audit's governed raw view, labels every measure and parity score with a method, lands every write-back in place, and passes both gates with no new dependency. The review found eleven follow-ups and no blocking finding. F1, F4, F6 and F11 are boarded in D018, F2, F3 and F5 in D019 and F7 in D020. F8 to F10 are fixed here within the Boy Scout bound: product 07's writeback paragraph (D020); the evidence README's list of what check-witnessed-run.mjs compares, narrowed to the committed console, snapshot and vertical audit transcripts and the retained resident audit, after this review compared the committed resident audit with the retained one (116 equal event ids and types); and final-001/witnessed-supplement.json with its read-only collector, which copies the six directories the witnessed run wrote outside the repository as shapes under the system temporary root, the export's own checks (913 kit files, 34 emitted and checked harness surfaces, 913 verified, local-terms list unavailable), the delivery's branch and commit-subject shapes and all 13 native episodes' launch claims before the run directory can be purged. The evidence README also records the writers' requiresHuman reports (D019). Skeleton's patch level is accepted: products 06 and 10 require a different version when a component's src changes, D003, D007 and D012 frame both runtime changes as repairs within runtime-status-v1's existing fields, and the console's src is unchanged. The register disposes eight rows whose trigger fired or whose seam this change opened, and the order's own new rows stay untriaged for planning.",
  "evidence": [
    "docs/final-reviews/WO-118/FINAL-001.md: criterion judgments, the findings block, the register and Executed checks",
    "D017 (integration took in nothing); D018, D019 and D020 (the boarded follow-ups with their repair rules and FUP-2b9a8e696b38fb97, FUP-6c444dbf9a4d92bb and FUP-c8ec65f056105759)",
    "VER-002 (pass; D015, D016) at code identity 99fb21b1…, report hash sha256:a9a6228f… equal to the recorded VerificationCompleted reportHash; VER-001 (fail; D009, D010) report hash sha256:8307ec42… equal to its recorded reportHash",
    "The executor's fresh npm test -- --review row at 99fb21b1… recorded 2026-10-13T11:58:03.830Z: 36 suites, 91 fresh tasks, exit 0, 1,335,688 ms",
    "This review's bounded runs at 99fb21b1…, 2026-10-13: node --test packages/skeleton/dist/test/runtime-status.test.js, 10 of 10 in 2.42 s; node --test scripts/test-vertical.recovery.mjs, 15 of 15 in 294.5 s; node scripts/test-plan-refutation.mjs --fixtures-only, 88 of 88 in 53.4 s, including both new writeback cases",
    "This review's npm run test:docs row at 99fb21b1… recorded 2026-10-13T15:04:59.133Z: 35 passed, 0 failed, 101,279 ms, 35 fresh tasks; its npm test -- --review row recorded 2026-10-13T15:05:15.982Z: composed, 36 passed, 0 failed, 6,524 ms, 1 fresh and 90 reused tasks, identityUnchanged and buildOutputUnchanged",
    "Four read-only dotln-worker reviewers (runtime, planning gate, evidence, criteria) returned 21 items; this review reproduced F1 (an expiry probe), F2 (a writer-status scan of every retained run), F3 (the writers' harness versions and the target's Git configuration), F7 (the gate on three scratch clones) and F9 (the resident-audit comparison), and confirmed F4, F5, F6, F8, F10 and F11 by reading the cited code and records",
    "npm run plan -- followups --touching: 47 matched of 263 pending at register revision 1f8f11d4… after npm run meta minted the three new rows; one batch request moved the register to d0b02059…, re-deferring FUP-0091, FUP-3d4b39cd4b2c4a08, FUP-441469088613e52a, FUP-7e0490f3c107e919, FUP-9625ca888d7d08f5, FUP-b8440605da5a4eb2 and FUP-50a41e39f51a3e01 with their observations and reopening FUP-c842faafbe34c7da (264 pending)"
  ],
  "rejected": [
    {
      "option": "Fail the review on F1, F2 or F3",
      "reason": "Each breaks no criterion and no behavior main had: main's status showed no vertical work at all, the source-change host's admission rule and the Codex grants predate this order and lie outside its surfaces, and the writers' commits landed and were verified. Product 07 routes such defects as follow-ups and ends the repair loop when the criteria hold."
    },
    {
      "option": "Repair the projection, the source-change host or the grants within the Boy Scout bound",
      "reason": "Each is a runtime behavior change after two verifications; a final review admits low-risk adjacent cleanup, not new runtime rules without fresh independent verification."
    },
    {
      "option": "Run the live loop again",
      "reason": "The retained stores, the live pull request and three independent re-derivations already establish the run; another run would add remote effects and native launches without new evidence about the subject."
    },
    {
      "option": "Rerun a fresh product gate instead of a composed row",
      "reason": "The code identity is unchanged from the executor's fresh passing row, and the runner composes a review gate from tasks that already passed at that identity by design; this review instead reran the order's three central suites itself."
    }
  ],
  "reopenWhen": "A criterion judged met is shown unmet at this identity, WO-083's run contradicts a claim of the witnessed run, or a register disposition above is shown wrong."
}
```
