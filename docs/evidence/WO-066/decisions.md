# WO-066 decisions

## WO-066-D001

```json
{
  "id": "WO-066-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Implement the post-PR continuation beside the observer, with host-recorded review items entering the existing RepairHost and deriveRepairOrder. Keep one round per item on RepairOriginal.roundLimit, where WO-055 implemented it; preserve the original contract, surfaces, named tests and writer envelope. Human comments receive no automatic disposition; refused comments stop with their identifier. A fresh observer event, rather than a local resolved bit, establishes completion.",
  "evidence": [
    "WO-066 Objective, Design and criteria 1–4; all four typed prerequisite dependencies are met in canonical status",
    "repair.ts places roundLimit on RepairOriginal with default two; WO-055 FINAL-001 Non-blocking item 3 names the wording mismatch",
    "RepairHost already persists executable programs and child source/verification receipts; pull-request-observer.mjs writes only changed observations to publication/"
  ],
  "rejected": [
    { "option": "A separate repair engine", "reason": "It would duplicate the existing containment and original-contract verification obligations." },
    { "option": "A post-PR reactor slice", "reason": "Publication, gh and its single writer are already script-side; WO-066 explicitly declines this alternative." },
    { "option": "NoOp", "reason": "Opening and observing a PR would still leave every repair and disposition to recurring operator supervision, blocking WO-112, WO-118 and WO-123." }
  ],
  "goalAlignment": "Advances the source-to-deliverable critical path and removes recurring operator rescue. Policy resistance: publication grants stay out of worker authority. Commons and escalation: serial per-item repair and one shared live audit/digest measurement avoid additional launches. Drift and rule beating: verification precedes push and fresh GitHub state establishes resolution. Success to the successful: reuse wins for preserved contract checks, not investment alone. Seeking the wrong goal: fixture transcripts establish the bounded behavior; no live-loop claim. Naive Interventionism: existing verification and publication behavior stay consumed through their interfaces; the new review entry bypasses only the adverse verifier witness, never scope or authority.",
  "reopenWhen": "A package consumer needs in-process post-PR orchestration, or a review item cannot enter without widening another derivation rule."
}
```

## WO-066-D002

```json
{
  "id": "WO-066-D002",
  "kind": "experiment",
  "date": "2026-09-30",
  "dispatch": "resume: next",
  "decision": "Keep real scratch Git and fake gh fixtures rather than replacing them with in-memory events; decline the economy experiment because it cannot establish the required Git effects.",
  "question": "Can in-memory fixtures replace scratch Git repositories and CLI doubles for this order?",
  "evidence": ["WO-066 criteria 1, 4 and 5 require a pushed branch, ancestry refusal and an ordinary signed-commit log positive control."],
  "rejected": [{ "option": "In-memory events only", "reason": "Cannot establish those real Git effects and refusals." }],
  "alternatives": ["In-memory events only", "Real scratch Git and fake gh with worker/verifier doubles"],
  "observation": "Criteria 1, 4 and 5 require a pushed branch, ancestry refusal and positive control of a configured signature program. An in-memory fixture cannot establish those observations.",
  "budget": { "wallSeconds": 60 },
  "execution": "declined",
  "reason": "In-memory fixtures cannot establish the real Git effects these criteria require.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["none; declined before execution"], "source": "actor-attested decision; no experiment run" },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["none; declined before execution"], "summary": "No efficiency change claimed; preserve executable evidence." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "reopenWhen": "A cheaper fixture can still demonstrate the required real Git effects and refusals."
}
```

## WO-066-D003

```json
{
  "id": "WO-066-D003",
  "date": "2026-09-30",
  "dispatch": "resume: next; continue",
  "decision": "Bind target publication to the request's explicit repositoryId before any remote call, neutralize signature programs on host Git reads, and admit only the sandbox-exec spelling of a writer's named test. Bind the CLI's repair input to the original writer, authority, contract and named tests before a child can start. Add threadId to screened observations so the publication host can use structured GraphQL dispositions. These changes preserve D001's contract and one-round boundary.",
  "evidence": [
    "WO-066 focused fixture run: 8 tests passed, including real local Git push/recovery, missing-effect refusal, foreign-head refusal and the ordinary-log signature positive control",
    "Additional focused run: review-witness negative derivations and CLI repair-input binding passed (2 tests)",
    "source-change-confinement.test.ts positively establishes outside read, common-Git write and local network connectivity without confinement, then establishes denial through both runFocusedTest and the exact writer shell command",
    "source-change-host.test.ts and writer.test.ts verify the exact confined spelling is admitted and the raw named command is denied",
    "GitHub primary documentation: https://docs.github.com/en/graphql/reference/pulls defines addPullRequestReviewThreadReply and resolveReviewThread"
  ],
  "rejected": [
    { "option": "Trust the current origin URL as the repository identity", "reason": "Target configuration is writable by the source worker; an independently named request identity is required." },
    { "option": "Allow the raw named test command in Claude", "reason": "The target can rewrite test code; an exact command alone does not confine its effects." },
    { "option": "Count the GraphQL mutation response as completion", "reason": "The order requires a later recorded observer event at the repaired head." }
  ],
  "limits": "Claude's launch vector auto-admits Read/Edit/Write and exact Bash commands for the confined test, git add and the host commit message; permission-prompts none declines other unattended shell requests. The local host permission route enforces the same named-command spelling. These settings are not a whole-worker OS sandbox and cannot establish confinement of Read/Edit/Write, Git internals, descendants or indirect process/IPC access. The native Claude allowlist's complex sandbox-profile matching has not been live-qualified here; the executable shell and host permission route are fixture-qualified. The macOS profile denies network, writes outside its root and direct reads outside admitted runtime paths; process execution and IPC remain admitted. Non-macOS confinement is unavailable. Effect receipts make the tested kill after recorded push idempotent; a kill after a remote effect but before its receipt remains a non-atomic boundary, and a rejection reply could repeat there.",
  "compatibility": "Review witness and RepairHost options are additive. Target request schema 1 now requires canonical HOST/OWNER/REPO in repositoryId; older requests fail closed until they add the explicit binding. No new dependency or grant reaches a writer.",
  "goalAlignment": "D001's critical-path and system-trap comparison still holds: these carry-ins protect the reused boundaries without adding a new repair engine, poller or live-loop claim. NoOp leaves target-controlled executable configuration and unconfined tests in the publication path.",
  "reopenWhen": "A live writer cannot execute the exact confined test, or a required consumer needs stronger whole-process isolation or atomic remote recovery."
}
```

## WO-066-D004

```json
{
  "id": "WO-066-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.57.0, the next minor above the observed release baseline v0.56.3, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.56.3 (local tags)",
    "minor classification declared in docs/work-orders/WO-066-review-comment-resolution-loop.md"
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
## WO-066-D005

```json
{
  "id": "WO-066-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next; write-backs and release preparation",
  "decision": "Edit the existing publication/repair paragraphs in product 02 and the pipeline sentence in product 06; keep their ceilings. Stage skeleton 0.46.0 for the additive review entry and confined test behavior, updating the console's exact dependency pin without bumping unchanged components. Select WO-066 revision 001 for the authority, artifact-identity, verification and feedback evidence, re-emit and check the current harness, and re-pin the console's selfhost case.",
  "evidence": [
    "At HEAD: product 02 148368 bytes, ceiling 150611, headroom 2243; current +361 bytes, headroom 1882",
    "At HEAD: product 06 39975 non-exempt bytes, ceiling 40775, headroom 800; current +91 bytes, headroom 709; measurement excludes only its registered release-history block",
    "Publication locks were stale immediately after the product edits; refreshed locks pass publication:check (253/253 indexed headings)",
    "authority-evidence --write records the existing unchanged programs, migrations, denials and bundle comparisons; artifact-identity --write and verification-evidence --write record four current files each",
    "harness emit records 31 generated surfaces; harness-evidence checks 51 surfaces and explicitly retains historical live smokes as historical",
    "release check-surfaces --local passes application v0.57.0, changed skeleton 0.46.0 and all exact workspace pins",
    "console-fixtures --record-current-selfhost records current JSON, terminal and HTML; feedback-evidence --check confirms the live audit judged the current source"
  ],
  "rejected": [
    { "option": "Raise the product ceilings", "reason": "The edits fit both the order's tighter byte allowance and existing headroom." },
    { "option": "Retain prior editions after registered source changes", "reason": "They would not witness this source; prior immutable evidence is preserved instead." },
    { "option": "Bump compiler, kernel or console", "reason": "Their src is unchanged; only the console's exact skeleton dependency moves." }
  ],
  "reopenWhen": "A source edit stales an edition, a dependency pin drifts, or integration changes the application release baseline."
}
```

## WO-066-D006

```json
{
  "id": "WO-066-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next; executor-owned live episode",
  "decision": "Use one live Claude feedback verifier launch for both the required feedback self-host audit and the before/after user-state reading. Record digests only and keep the transient verifier repository outside this worktree in granted session scratch.",
  "evidence": [
    "claude-state.json: Claude Code 2.1.285, claude-cli-print, model claude-opus-5-5, effort xhigh; 25607 ms, exit 0; before 2026-09-30T02:14:48.224Z, after 2026-09-30T02:15:13.848Z",
    "User settings digest is identical before/after; user-local settings are absent both times; canonical project-registry digest is identical before/after. No settings or registry content is retained.",
    "Feedback subject sha256:28ba83e95d467e470c6bd80bba5a6e6a18e3898d3959ed7efaab31bdf7cc3a2b is unchanged across the launch, after the last judged-source edit",
    "feedback-001/edition.json names this live audit, not a carry; its recorded WorkerAttemptStarted pins claude-opus-5-5 and xhigh with a 600000 ms deadline and $5 cap, effective model/effort unknown",
    "feedback-evidence --record-selfhost validates independent verifier results and exact byte reconstruction before storing the reference stream; --check passes ten regressions and ten removal failures, with 1192 fewer instruction bytes in the matched projection"
  ],
  "rejected": [
    { "option": "A second Claude launch solely for the digest measurement", "reason": "The required audit already supplies one executor-owned launch; another would add cost without establishing the requested single observation more directly." },
    { "option": "Save settings or registry content", "reason": "The criterion requests digests and the clean-room floor excludes private account/project content." },
    { "option": "A repository nested in this worktree", "reason": "The operator requires cleanup of nested repositories; session scratch keeps transient mounts outside release-close's subject." }
  ],
  "limits": "This is one launch with unchanged digests, not proof that all Claude launches preserve user state; ambient concurrent changes are not excluded. Selected model/effort are recorded, effective readback is unknown. The live episode judges feedback sources, not the post-PR loop; that loop's evidence uses labeled doubles and real local Git. No GitHub scratch repository was used; any future GitHub scratch work is restricted by the operator to DylanBWood/dotln_scratch_001.",
  "goalAlignment": "Shares required evidence collection without an extra agent or launch, advances the critical-path carry-in and preserves D001's separation of fixture and live claims. NoOp leaves the user-state effect unobserved.",
  "reopenWhen": "Another launch changes either digest, a judged source changes, or live post-PR orchestration is selected by its later work order."
}
```

## WO-066-D007

```json
{
  "id": "WO-066-D007",
  "date": "2026-09-30",
  "dispatch": "resume: next; equipped Adjacent Repair",
  "decision": "Correct the cited skeleton README's feedback verifier cap from $3 to $5 without changing runtime or adding a new launch. Keep test/live mounts outside the worktree and verify the operator's cleanup constraint before the final gate.",
  "evidence": [
    "verification-protocol.ts FEEDBACK_VERIFIER_LIMITS.maxBudgetUsd is 5.00 and the live WorkerAttemptStarted records that exact cap; the README still said $3",
    "Adjacent queue revision 5: adjacent-0001 completed, with diagnosed cause, one-line scope, intent/check-in and passing node scripts/docs-check.mjs; transcript is adjacent-docs-check.txt",
    "Command-level accepted-thread fixture passes after correcting its launchpad selection and moving child-directory creation after transport authorization; no child directory or remote call on disabled live workers",
    "repository-cleanup.json at 2026-09-30T02:22:45.403Z: direct traversal finds zero nested .git directories or files in the worktree or granted session scratch; symlinks are not followed"
  ],
  "rejected": [
    { "option": "Leave the inherited README claim", "reason": "Executable source and this launch disagree with it; the bounded documentation repair is already authorized." },
    { "option": "Run another live verifier to demonstrate the cap", "reason": "The existing launch receipt and source pin establish the configured limit; no extra launch is needed." }
  ],
  "goalAlignment": "Keeps the actual bound visible to operators and removes release-close residue without changing product architecture; D001's trap analysis remains applicable. NoOp carries a false operational claim forward.",
  "reopenWhen": "The configured verifier cap changes or a later operation creates a nested repository."
}
```

## WO-066-D008

```json
{
  "id": "WO-066-D008",
  "date": "2026-09-30",
  "dispatch": "resume: next; final gate repair",
  "decision": "Keep the production Git-read overrides and repair the worktree/release Git doubles to normalize leading -c options only for their configured-URL interception, forwarding the original argv for ordinary Git calls. Stop the first gate before editing its inputs and rerun the complete gate after focused validation.",
  "evidence": [
    "The first npm test -- --review passed regenerated evidence and harness fixtures, then worktree and release cases refused origin identity because their stubs expected remote at argv position 3; Git instead expanded the fixture URL rewrite",
    "harness evidence --stop stopped run 3fa4668d-21df-479d-a5f9-6f154696a6dc; test runner reports stopped after 352.8 seconds and no check recorded",
    "scripts/test-worktree.sh and test-release.sh have the two affected fixed-position wrappers; the target-publish wrapper already normalizes options and preserves forwarded originals",
    "Focused worktree suite, release success case and release concurrent case pass after repair; standalone fixture commands omit CODEX_THREAD_ID, matching the canonical suite environment's omission of root session metadata",
    "feedback-evidence --check still confirms the live audit judged current source; only script-side test fixtures changed, outside the judged feedback source list"
  ],
  "rejected": [
    { "option": "Remove the shared Git overrides", "reason": "Would restore the executable target-configuration gap this order is required to close." },
    { "option": "Skip failing release or worktree suites", "reason": "The order requires the complete review gate; updating their doubles preserves their existing assertions." },
    { "option": "Dispatch another live verifier", "reason": "The judged sources are unchanged; the current edition check establishes this, and an extra live launch cannot test these script fixtures." }
  ],
  "reopenWhen": "Another fixture depends on fixed Git option positions, or the rerun reports a different failure."
}
```

## WO-066-D009

```json
{
  "id": "WO-066-D009",
  "date": "2026-09-30",
  "dispatch": "resume: next; continue; final gate repair",
  "decision": "Keep native confinement, use an empty read-only home and disable Node's compile cache in both exact writer and focused host test environments. Update the authority-probe fixture to expect the confined command and refuse the raw command. Preserve revision 001 and mint current revision 002, with a new live feedback audit after this judged-source change.",
  "correction": "The dirty source was initially attributed to npm's home cache. The controlled probe instead recorded untracked node-compile-cache files, and changing HOME alone did not fix it. The corrected cause is npm enabling Node's compile cache, whose default location is under TMPDIR; the confined environment sets TMPDIR to the source tree.",
  "evidence": [
    "harness evidence --stop stopped run 1700c2c6-991d-4feb-9eac-90354948c25b at 2026-09-30T02:44:10.845Z before input edits; no passing gate row was recorded",
    "Controlled fixture preload observed node-compile-cache files; installed npm lib/cli.js calls module.enableCompileCache()",
    "Context7 /nodejs/node, official doc/api/module.md and cli.md: default cache uses os.tmpdir(); NODE_DISABLE_COMPILE_CACHE=1 disables it (https://github.com/nodejs/node/blob/main/doc/api/module.md)",
    "cache-regression focused run: five tests pass, covering npm source cleanliness through both host and exact writer routes, pathless portfolio verification, authority revocation, canonical writer shape and direct confinement denials",
    "Authority, artifact-identity and verification revision 002 were minted; harness emit/check passes; feedback-evidence --check confirms feedback-002 judged current source; console selfhost JSON, terminal and HTML re-pinned",
    "claude-state-002.json: Claude Code 2.1.285, claude-opus-5-5, xhigh, 35760 ms, exit 0, selected configuration; source unchanged across the launch",
    "Before 2026-09-30T03:00:35.724Z and after 2026-09-30T03:01:11.495Z: settings and canonical project-registry digests unchanged; user-local settings absent; no contents retained"
  ],
  "rejected": [
    {
      "option": "Permit caches outside the source root",
      "reason": "Would weaken the required write boundary; the optional Node cache can be disabled."
    },
    {
      "option": "Delete untracked files after a test",
      "reason": "Could hide real source side effects; keep the existing clean-tree refusal."
    },
    {
      "option": "Carry the first live audit after a judged-source edit",
      "reason": "Its recorded subject is stale; the current edition requires a fresh judgment."
    }
  ],
  "livePlan": {
    "purpose": "Refresh the required audit after the actual source correction, preserving the first immutable episode",
    "totalVerifierLaunches": 2,
    "currentLaunchModel": "claude-opus-5-5",
    "effort": "xhigh",
    "budgetUsdPerLaunch": 5,
    "deadlineMsPerLaunch": 600000,
    "subagentCap": 20,
    "observableCollaborationAgents": 0,
    "unobservedDescendants": "unknown"
  },
  "limits": "The digest observation is per launch. Registry baselines differ between the two launches; ambient activity between observations is not attributed to either launch. Effective model and effort remain unknown. D003 confinement and non-atomic remote-effect limits still apply.",
  "goalAlignment": "Preserves D001 scope and system-trap comparison: a normal named check must work without widening authority or hiding side effects. NoOp leaves the review gate failing; the narrow correction avoids a second repair architecture.",
  "reopenWhen": "A named test needs additional environment support, another source edit stales the audit, or the complete review gate reports another failure."
}
```

## WO-066-D010

```json
{
  "id": "WO-066-D010",
  "date": "2026-09-30",
  "dispatch": "resume: next; final authored-output read",
  "decision": "Restore independent expectations in the canonical writer fixture: normalize only the exact confined test spelling back to the historical named command, compare all other arguments against the immutable historical fixture, and require the complete current three-command allowlist and prompt spelling.",
  "evidence": [
    "Final output read found the allowlist expected value copied from the actual argv; that comparison could not detect a widened native allowlist",
    "harness evidence --stop stopped run d96e1a93-5807-4608-b88a-3d2b95de4d57 before the test edit at 2026-09-30T03:12:41.296Z; no passing check recorded",
    "Canonical writer-shape test passes with the independent comparison and exact current allowlist",
    "feedback-evidence --check still confirms feedback-002 judged current source; the writer test is outside registered and judged feedback sources"
  ],
  "rejected": [
    {
      "option": "Retain the actual-derived expected value",
      "reason": "Could conceal a regression in the transport grant spelling."
    },
    {
      "option": "Remint live evidence for this test-only correction",
      "reason": "The judged source is unchanged and the edition check passes."
    }
  ],
  "reopenWhen": "The transport intentionally changes another pinned argument or the complete review gate reports a different failure."
}
```

## WO-066-D011

```json
{
  "id": "WO-066-D011",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Pass VER-001 with every criterion met, and board two reproduced loop-outcome defects that lie outside the fixture observations. (1) The loop computes its PullRequestReviewLoopStopped status from the latest observation's unresolved items only. A mapped check that is still running on the repaired head, or that ends in a conclusion the observer does not class as a failure, therefore leaves its item needs-human while the loop stops resolved. (2) The observe stage measures freshness from the stage's own start. A kill after the observer appended the post-disposition observation, but before the stage result was recorded, ends the resumed item needs-human although that observation shows the thread resolved at the repaired head. Also board one coverage gap: no fixture reaches pushRepairedHead's own refusal of an unverified head.",
  "evidence": [
    "REPRO-A uses a session-scratch copy of scripts/test-target-publish.mjs. Its fake gh reports the mapped unit check IN_PROGRESS on any head except the initial one; otherwise it is the WO-066 AC1 check scenario. Result: one repair launch and one PullRequestRepairPushed; ReviewItemFinished is needs-human with reason 'no fresh post-disposition resolution observation'; the latest observation's checks are [{unit, IN_PROGRESS}]. The returned and recorded stop is status resolved with reason 'fresh observation has no unresolved items'.",
    "Cause A: scripts/lib/review-comment-loop.mjs selects the terminal stop from unresolved observation items (lines 286-303) without consulting item terminals. scripts/lib/pull-request-observer.mjs adds a ci-failure item only for the CI_FAILURES states FAILURE, ERROR, TIMED_OUT, STARTUP_FAILURE and ACTION_REQUIRED. A pending, cancelled, neutral or skipped check therefore has no item.",
    "REPRO-B uses the same scratch copy with the default accepted-thread scenario, wrapping observe so it throws after the second real observePullRequest call. The post-disposition observation is recorded with R1 resolved at the remote head. After resume the log still holds two observations, one launch, one push and one disposition. ReviewItemFinished is needs-human with the same reason, and the loop stops resolved.",
    "Cause B: the observe stage compares the fresh observation's event number with the log length read when the stage begins (review-comment-loop.mjs lines 419-436). On resume that length already includes the appended observation, and the observer appends nothing for unchanged state.",
    "Coverage: the refusal text 'the repaired head is not independently verified' occurs only at scripts/lib/target-publish.mjs line 356. The failed-verification fixture stops at the loop's own repair-status guard first.",
    "Criterion 1 names a check observed passing, and criterion 2 is judged against its fixture observations; each fixture case passes. Criterion 3's properties (no second push, no reprompt) hold in REPRO-B."
  ],
  "rejected": [
    {
      "option": "Fail criterion 1 or 3 on these reproductions",
      "reason": "Both lie outside the fixture observations and the criteria's stated properties; the order says such a case is a follow-up, not a failure."
    },
    {
      "option": "Repair the loop during verification",
      "reason": "The verifier judges the existing subject; a repair owns implementation changes and their checks."
    }
  ],
  "followup": "WO-066 follow-up (review-loop outcome). Record PullRequestReviewLoopStopped as resolved only when every opened item's terminal is resolved from a fresh observation; otherwise stop needs-human, naming the first unresolved item. Treat a mapped check as resolved only when a fresh observation on the repaired head shows SUCCESS. Leave a pending check awaiting a later observation rather than counting it resolved. Measure observation freshness from the item's last recorded effect receipt (PullRequestRepairPushed or PullRequestThreadDisposed), not from the stage start, so a resumed observe stage accepts an observation appended after that receipt. Add fixtures for a pending and a cancelled mapped check, a kill after the observer's append, and pushRepairedHead refusing an unverified or failing acceptance matrix for the exact head. Paths: scripts/lib/review-comment-loop.mjs, scripts/lib/target-publish.mjs, scripts/test-target-publish.mjs. Checks: the new fixtures, npm test -- --review and npm run test:docs. Priority: before WO-123 composes the loop into the vertical.",
  "reopenWhen": "The follow-up is selected, WO-123 or WO-112 consumes the loop's stop status, or a live run records a resolved stop while an item is unresolved.",
  "goalAlignment": "Mission and critical path: the loop removes post-PR operator rescue on the source-to-deliverable path, so its terminal status must not claim resolution the observation lacks. Drift to low performance and rule beating: judged against the reproduced loop output, not the green fixtures alone. Seeking the wrong goal: the loop's stop is the signal WO-123 consumes. Commons and escalation: two read-only reviewers batched criteria 1-4 and 5-7 (2 of 20 admissions), and no live launch was added. Policy resistance, shifting the burden and success to the successful: the defects go to a named repair with concrete rules rather than back to the operator, and the passing gate does not outweigh the reproductions. Naive Interventionism: board rather than widen the criteria or edit the subject. NoOp would leave a false resolved stop unrouted."
}
```

## WO-066-D012

```json
{
  "id": "WO-066-D012",
  "date": "2026-09-30",
  "dispatch": "resume: verify",
  "decision": "Criterion 6 is met, but one statement in D003 is unsupported: that Claude's launch vector auto-admits exact Bash commands for the confined test. The admitted Bash rule is the confined command itself, and its sandbox profile contains three asterisks. Claude Code documents an asterisk in a Bash rule as matching any text, so the native rule admits a family of commands. The emitted host permission hook enforces the exact spelling and denies a widened variant. Record the correction and board a follow-up.",
  "reopens": {
    "decisionId": "WO-066-D003",
    "observation": "The native allowlist entry Bash(<confined command>) contains three asterisk wildcards, in the profile's deny network, deny file-write and allow file-write operation names. Its exactness depends on the host permission hook."
  },
  "evidence": [
    "packages/skeleton/src/discovery-sandbox.ts: discoverySandbox emits (deny network*), (deny file-write*) and (allow file-write* (subpath root) ...). confinedTestCommand embeds that profile, and worker-transport.ts passes Bash(<confinedTestCommand>) in --allowedTools.",
    "Claude Code permissions documentation (https://code.claude.com/docs/en/permissions, Wildcard patterns, read 2026-09-30): 'A * in a Bash rule matches any text, including spaces' and 'A rule with no * matches one exact command.' No escape for a literal asterisk is documented.",
    "Verifier probe (session-scratch hook.mjs over the built WO-052 source-change fixture): the rule has 3 wildcards. A variant that adds (allow network*) and (allow file-write*) matches the rule under the documented semantics; this was modelled, not matched by a live Claude process. The emitted .claude/hooks/permissions.mjs returns no decision for the exact confined command and deny for both the widened variant and the raw named command.",
    "D003's limits already state that native matching of the complex profile is not live-qualified and that the host permission route enforces the same spelling."
  ],
  "rejected": [
    {
      "option": "Fail criterion 6",
      "reason": "The fixture refusals reproduce, and D003 records both what the settings refuse and what they cannot establish. The combined route (allowlist plus hook) denies the widened variant; the inaccuracy is in how one layer is described."
    },
    {
      "option": "Launch a live Claude writer to qualify native matching",
      "reason": "The documented semantics establish the wildcard. A paid live launch would change neither the correction nor the follow-up."
    }
  ],
  "followup": "WO-066 follow-up (writer allowlist exactness). Remove the asterisk wildcards from the command text that Claude's native Bash rule admits. For example, pass sandbox-exec -f a host-owned profile file outside the worktree, or name the network and file-write operations without wildcards. Add a fixture asserting that the allowlisted text contains no asterisk and that the emitted hook denies a widened variant. Until then, describe the native rule as a wildcard family whose exactness depends on the host hook. Paths: packages/skeleton/src/discovery-sandbox.ts, packages/skeleton/src/worker-transport.ts, packages/skeleton/test/writer.test.ts, packages/skeleton/test/source-change-host.test.ts. Checks: those tests and npm test -- --review. Priority: normal, before a live Claude writer runs a named test under WO-112.",
  "reopenWhen": "The follow-up is selected, the confined command changes, or a live Claude writer runs a named test without the host permission hook installed."
}
```

## WO-066-D013

<!-- integration refs/dotln/checkpoint/WO-066/6 -->

```json
{
  "id": "WO-066-D013",
  "date": "2026-09-30",
  "dispatch": "resume: final review; worktree integrate WO-066",
  "decision": "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
  "evidence": [
    "refs/dotln/checkpoint/WO-066/6",
    "base 1674ea5e9dfc8f8dfe85db1ed76d46d8af30689e",
    "upstream 74c47d42cb508457ad6393635fc68fef33292b72",
    "release preparation: WO-066 target v0.57.0 remains current. Files changed: docs/evidence/WO-066/meta.json, docs/final-reviews/WO-066/PR.md. Meter snapshot: docs/evidence/WO-066/meta.json, 4093 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-09-30. Original base: `1674ea5e9dfc8f8dfe85db1ed76d46d8af30689e`.
Fetched main: `74c47d42cb508457ad6393635fc68fef33292b72`. Checkpoint: `refs/dotln/checkpoint/WO-066/6`.
Named stash retained: `1e0040f5f06d69cd5f2042566c9bba53c984249c` (WO-066 integrate 2026-09-30).
Resolved projections: README.md, docs/control/current.md, docs/work-orders/README.md.
Release preparation: WO-066 target v0.57.0 remains current. Files changed: docs/evidence/WO-066/meta.json, docs/final-reviews/WO-066/PR.md. Meter snapshot: docs/evidence/WO-066/meta.json, 4093 bytes. Tag observation: local snapshot only.
Carried-forward claims: completed by the final review. The order and VER-001 keep their recorded subject, the working tree over base `1674ea5e`. The integration fast-forwarded the uncommitted branch to fetched main `74c47d42`, which adds WO-057's four commits: documents, evidence and reports only (`git diff --stat 1674ea5e 74c47d42` lists 18 files, none under `scripts/` or `packages/`). Both sides touched only the README release line, the control projection, the decisions index and the work-order index, which the helper regenerated. VER-001's judgments on all ten criteria carry forward with their original evidence: the tracked code identity is unchanged (`73acb752…`, the row the verifier's fresh gate recorded), no component version collides, and the selected evidence editions are still WO-066/002. WO-057 published v0.56.4, so v0.57.0 remains the next minor and nothing was retimed. One document byte range changed after verification, the final review's restoration in product 06 ([D014](#wo-066-d014)); it touches no criterion's executable evidence. Checks on the integrated tree are in [FINAL-001](../../final-reviews/WO-066/FINAL-001.md).
Authored conflicts observed: none.
Affected checks are printed by the command; the final review's results are in FINAL-001.

## WO-066-D014

```json
{
  "id": "WO-066-D014",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-001: all ten criteria are met on the integrated tree, judged against the order as written. Restore the roadmap's source revision guard, which the product 06 write-back had removed from the pipeline sentence, as a documentation fix inside the Boy Scout bound. Board one reproduced loop defect that verification did not meet: an accepted automated review comment with no line makes the loop throw at the repair stage and leaves the item pending, so every rerun throws again and no later item on that pull request is reached. Settle the three carry-in register rows this order discharged, open the verification's two follow-ups and this one for planning, reopen the reactor row whose condition occurred, and mark the reopened D003 row a duplicate of D012's.",
  "evidence": [
    "Integration: D013. npm test -- --review on the integrated tree found the verifier's complete passing row at the unchanged code identity 73acb7520bba8e9698c5ad7285a26a04efdfc07d0d6dc318a509fc8b7fd52fa9 (39 suites, 701.19 s, recorded 2026-09-30T03:50:34.262Z) and started no suite. node scripts/harness.mjs check, npm run release -- check-surfaces --local (51 PASS lines), npm run publication:check, node scripts/docs-check.mjs and git diff --check HEAD exit 0. The fresh npm run test:docs result is in FINAL-001.",
    "Roadmap: at base 1674ea5e the pipeline sentence of product 06 section Application version pending, Source-to-deliverable vertical, ends 'post-PR loop (CI classification, comment triage, source revision guard)'. The executor's write-back replaced the last two items and the guard was gone. Product 03 section Ports still gives the post-submission loop 'upstream source drift watched (revision guard)', WO-061 cites this roadmap section for the source revision guard and its criterion 6 amends the guard's invalidation into the same sentence, and no decision records a removal. The restored phrase adds 23 bytes: product 06 is 114 bytes over the order's base against the 200 allowed, and 40,089 non-exempt bytes under the unchanged 40,775 ceiling (docs-check).",
    "Reproduction: docs/evidence/WO-066/final-review-reproduction.txt. The order's reviewScenario with one automation thread comment whose line the fake gh reports null, judged accept. Both runs throw 'review loop refused: repair derivation: malformed or foreign host review item: NOLINE'; zero launches, pushes and mutations; the item is pending at repair with no ReviewItemFinished and no PullRequestReviewLoopStopped.",
    "Cause: scripts/lib/pull-request-observer.mjs omits line when the forge reports null. admittedTriage in scripts/lib/review-comment-loop.mjs does not check it, and the repair stage throws when deriveRepairOrder answers NeedsHuman (lines 364-373) instead of recording a human result. A changed judgment for the pending item is refused as recovery request drift (lines 317-322), so the request cannot route around it. Inferred from the same path and not reproduced: a judgment naming a criterion whose requiredChecks omit the matched test reaches the same throw.",
    "D011's two loop defects read in the code as the verifier describes them: the stop status comes from the latest observation's unresolved items alone (review-comment-loop.mjs lines 286-304), and freshness is measured from the log length at the start of the observe stage (lines 419-436).",
    "Register: npm run plan -- followups --touching listed 18 pending rows before integration. The dispositions are in docs/evidence/WO-066/final-review-followup-requests.json. FUP-f12a1f894923b2b2 (three recorded items in reactor.ts) reopens at 'the next order that opens reactor.ts and pays a live feedback episode'; this order did both, took none of the three and recorded none as left.",
    "Clean-room screen of the 23,342-line subject diff: no local path, secret shape or internal address in an added line. The URLs are the npm registry, two public documentation pages, the Node repository and fixture hosts."
  ],
  "rejected": [
    {
      "option": "Fail the review on the wedge or on D011's defects",
      "reason": "Each lies outside the fixture observations the criteria are judged against, and the order says a case outside them is a follow-up, not a failure. Each fails closed for the item: nothing is pushed or disposed."
    },
    {
      "option": "Repair the loop in this review",
      "reason": "Product 07 section Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it."
    },
    {
      "option": "Board the roadmap phrase instead of restoring it",
      "reason": "It is 23 bytes of documentation inside the order's own write-back and byte bound. Boarding would leave WO-061's cited phrase missing when that order activates."
    },
    {
      "option": "Rerun the product gate with --again",
      "reason": "The code identity equals the one the verifier's fresh run recorded about four hours earlier on this host; main added documents only, and the document gate ran fresh. The cost is that no product suite executed in this session."
    }
  ],
  "followup": "WO-066 follow-up (review-loop refusal route). When deriveRepairOrder refuses at the repair stage, end the item needs-human with the derivation's reason and offending value instead of throwing with the repair command pending. Refuse an automated comment that has no positive line at triage, as NeedsHuman naming the item. Add a fixture for a thread comment whose line is null, and one for a judgment whose criterion does not require the matched test. Paths: scripts/lib/review-comment-loop.mjs, scripts/test-target-publish.mjs. Checks: the new fixtures, npm test -- --review and npm run test:docs. Priority: with D011's follow-up, before WO-123 composes the loop or WO-112 runs it live.",
  "reopenWhen": "The follow-up is selected; WO-112 or WO-123 consumes the loop; or WO-061 or WO-124 amends the pipeline sentence and finds the guard or the loop wording wrong.",
  "goalAlignment": "Mission and critical path: the loop is the post-PR step of the source-to-deliverable route that WO-112, WO-118 and WO-123 build on; passing it moves that route, and the boarded defects are what those orders would otherwise meet live. Rule beating and drift to low performance: green fixtures were not taken as the judgment; the review read the whole diff and ran its own reproduction, which found a wedge on a common forge value. Seeking the wrong goal: the loop's stop event is the signal a composing order reads, so its two known false or missing stops are routed to named repairs due before that consumer. Shifting the burden: the follow-ups carry concrete rules, paths and checks, so planning does not need the operator to rediscover them. Policy resistance and escalation: no new gate or process is added; the register rows are disposed through the existing command. Tragedy of the commons: no subagent and no live launch; the runner reused the recorded gate row. Success to the successful: the verifier's pass was not a reason to skip the diff, and the reuse of its row is stated as a tradeoff. Naive Interventionism: the one edit restores a planned roadmap element that product 03 and WO-061 still rely on; it is 23 bytes, reversible, and changes no behavior. NoOp would merge a roadmap that silently drops the guard and leave the wedge unrecorded."
}
```
