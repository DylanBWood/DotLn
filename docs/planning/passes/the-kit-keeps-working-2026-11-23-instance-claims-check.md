# Ten kit behaviors an instance reported, checked against the source

Record of the [2026-11-23 planning pass](the-kit-keeps-working-2026-11-23.md). This is the report of one of its research workers (the `default` worker; the host reported claude-opus-5-5), read-only, at `main` `bc761ad9c` (v1.4.0) compared with tag v1.1.0, on 2026-11-23. Its brief gave it ten behaviors an instance on v1.1.0 reported, restated by the pass as claims about the kit alone. It is a worker's reading: what the pass checked itself is said in the pass document, with the file and line. The host refused the worker's own write of this file, so the pass filed the report as returned, with absolute checkout paths replaced by names.

Subject: this repository at `bc761ad9c` (v1.4.0), compared with tag v1.1.0, plus the unfinished WO-288 in the WO-288 worktree (its changes are uncommitted, read with `git diff HEAD`). Line numbers are v1.4.0's unless a tag is named. "Inference" marks a conclusion I drew from code I read but did not run.

## 1. A driven phase of a target order starts in the target worktree, under that worktree's guard

**Verdict.** Confirmed, including the KIT part. On the reported refusals: partly. At v1.1.0 every listed form is refused. At v1.4.0, in an instance whose target bundle has been emitted again, most only advise. A Read-tool read outside the order's recorded roots is still refused at every level.

**Where the working directory comes from**
- `scripts/lib/order-worktrees.mjs:61` sets `cwd = present && target ? directoryIdentity(target.target) : launchpad`, with `roots [launchpad, cwd]` at line 74.
- `drive-route.mjs` `routeFacts` sets `facts.cwd = trees.cwd` (291-294), and `routeOrder` copies it onto every route (191). The role makes no difference. The one exception is a merged closed order: release close gets main (491).
- `drive-session.mjs:946` passes `route.cwd` to `launchRole`, and `drive-worker.mjs:397-402` passes it on to `launchPhase`. `driveStatus` uses `trees.cwd` (75).
- The Claude launch adds only the launchpad and the host state root with `--add-dir` (`drive-worker.mjs:114-122`, `252-253`) and uses `--setting-sources user,project,local` (260-261).
- The kit plans for this:
  - `drive-prompts.mjs:146-150` tells a target-cwd worker that it has tool hooks but no prompt dispatch. Its first Bash call must be exactly `pwd -P`, the second `git rev-parse --show-toplevel`, and every launchpad command is spelled by its full path.
  - The worker note says "Other forms are refused" (101-107).
  - `summarizeAttempt` labels the attempt `"target-worktree"` (795-800).
  - Codex `enterDrivenWorker` refuses a cwd other than `trees.cwd` (`drive-worker.mjs:473`).
  - WO-083 cites WO-192 criterion 9, a phase worker completing its phrase in a target worktree (WO-083 lines 555-557).

**KIT.** `docs/KIT.md:923-935` says `worktree start` prints sessions that start in the launchpad (Claude: `claude`, then `resume: next`), and that starting inside the target selects its separate worker bundle. Nothing in KIT says a drive starts its phases in the target (I grepped for "driven" and "drive:" near "target"). The section is the same at v1.1.0 (lines 761-773).

**The guard.** The bundle is installed by `node scripts/harness.mjs emit --target`. Its files are listed at `scripts/lib/harness.mjs:1344-1354`. The hook is `runTargetHarnessHook` (`harness-host.ts:8956-9617`). It writes its state to the launchpad's `docs/control/local/harness/targets/<digest>/` (8996-9000, 881-886). That the session loads the target's project settings is an inference from `--setting-sources` and the cwd; the kit's own appendix assumes it.

**What the guard admits.** `drivenTargetRead` (5296-5318, identical at v1.1.0) admits:
- `metadataCommand(command, false)` (5133-5166):
  - `pwd`, `pwd -P`
  - `git rev-parse --show-toplevel`, `git rev-parse --abbrev-ref HEAD`
  - `git status --short`, optionally `--branch`
  - `git diff --check`, `git worktree list --porcelain`
- The live-gate list without node or npm (`harness-command.ts:1452-1453`, `1548-1569`, `1594-1643`):
  - `cat`, `head`, `tail`, `wc`, `ls`, `grep`
  - `sed -n` with a print-only script
  - git only after `--no-pager`
  - every stage of a pipeline must be on the list
- A full-path launchpad script whose `drivenCommandEffect` is `read` (1376-1440).
- Exactly `printenv DOTLN_LAUNCHPAD`, `printenv CLAUDE_EFFORT`, `printenv DOTLN_LAUNCHPAD CLAUDE_EFFORT` and `git status`.

Anything else goes to `shellWritePaths`. That returns null for any program outside `readCommand` (841-927) or the four write programs (1053-1094). A null result produces "target shell destinations unavailable; host must run opaque commands" (`harness-host.ts:9431-9440`).

**The reported forms.** Each falls outside the admitted list:
- `node --test`
- `git -C …`. The only `-C` form admitted is the reviewer's `git -C <pair> add|commit` (8780-8823).
- `shasum`
- any other `printenv`
- a grep pipeline with a stage that is not on the list, such as `sort`
- `git log --format=…` without `--no-pager`
- `git rev-parse HEAD`
- `node scripts/terms.mjs branch`. The relative path is the target's own script. Even by its full path, `terms` admits only `--plan-first WO-NNN` (1397-1402).
- `claude --version`

**The Read tool.** A path is admitted only inside the order's recorded roots or the session scratch (9201-9228). Any other absolute path becomes `settings.user` (`permissionEffect` 5776-5780). A shell `cat` of the same file is admitted. That inconsistency is an inference from 5296-5318 and 2295-2316.

**v1.1.0 against v1.4.0**
- `order-worktrees.mjs` has no diff between the tags. `drive-route.mjs` only moved `lifecycleRoutes` into a module.
- At v1.1.0 every judgment threw `DOTLN_TARGET_REFUSED` (v1.1.0 `harness-host.ts:8742-8921`).
- At v1.4.0 each judgment is a stop at its level (9026-9030). In an instance the record-class rows advise: target-classification, target-unlisted-effect, target-cwd, target-destinations, target-delegation and driven-roots (`stops.mjs:229-270`; KIT 2872-2875; `docs/evidence/WO-287/part-a/target-calls.md`).
- The work-class rows still refuse at every level: user-settings, target-bundle, credentials, unapproved remote and the writer reservation (`stops.mjs:80-178`).
- A bundle with no level map refuses (`stopLevelIn`, `stops.mjs:964-984`; KIT 2909-2916). So, by inference, a target worktree whose bundle was emitted before the update keeps v1.1.0's behavior until `emit --target` runs again.

**Open orders.** None changes this. WO-288's diffs to the drive files concern publication and time limits.

**Smallest change**
- Documentation: add a bullet to KIT §How a session reaches the target saying that a drive starts every phase except the close in the target, under its bundle. Its reader is the document gate.
- The remaining refusal: in `runTargetHarnessHook`'s `outsideEffect` (9218-9228), give a Read-tool path in main or in the host scratchpad a read effect. Keep the change local, because `permissionEffect` and `permissionEffects` are shared with the launchpad hook. Other reader: the denial cases in `test-target-worktree-start.mjs`.
- Alternative: run the verifier in `trees.launchpad` with the target added by `--add-dir`. That means changing `routeFacts` and `nativeLaunchDirectories`. The readers of `route.cwd` are:
  - `launchRole`
  - the `nativeProfile` appendix (`drive-prompts.mjs:148`)
  - `summarizeAttempt` and `phaseSessionReadback(route.cwd)` (824-828)
  - `phaseRoots` (`order-worktrees.mjs:16-20`; `drive-session.mjs:552`, `1010`)
  - Codex `enterDrivenWorker`

  Unknown: whether `target-gate.mjs` works with the launchpad as cwd.

## 2. Nothing checks that an order's named commands can run under the phase's route

**Verdict.** Confirmed.

**Evidence**
- The lane judge's only readers, at both tags, are the hook, the worker note and `test-drive.mjs`. Command: `git grep -l 'drivenCommandEffect\|targetLaneForms' v1.1.0|v1.4.0`.
- The checks that do exist test other things:
  - `criteriaAdvisories` (`work-orders.mjs:1380-1433`) flags figures, HEAD, git log and revision ranges in criteria text.
  - `checkPreflightSuites` (1437+) checks that the named suites exist.
  - `targetOrderPathAdvisories` (`plan-receipts.mjs:1734-1806`) flags identifiers in plan paths.
  - `openOrderPreflightAdvisories` (1833-1869) flags suites the plan's files owe.
- `briefingCommands` only respells the kit's own `npm run` forms (`resume.mjs:1496-1508`), and `targetBriefing` names the target gate (1606-1622).
- Activation (`worktree.mjs:848-870`) runs `resume activate` and judges no commands.
- Same at both tags.
- No open order covers it: a grep of all ten found nothing.

**Smallest change.** Add `targetLaneAdvisories` beside `targetOrderPathAdvisories`.
- It reads `executionPlanSpans` (1685-1721) and the code spans in the criteria.
- It judges each span with an exported pure `targetLaneJudgment(command, {launchpad, role, workOrder})` built from `drivenTargetRead`, `drivenCommandEffect` and `shellWritePaths`. `drivenTargetRead` and `metadataCommand` are private today and would need to be exported.
- It prints advisories, each with the admitted spelling.
- Call it from `checkPlanGate` and from the briefings at `resume.mjs:1701-1726` when the order has a target.
- Readers: the plan-refutation output, the briefing cases, and `targetLaneForms` (`drive-prompts.mjs:20-63`).

## 3. A driven attempt that met refusals and left the phase unchanged

**Verdict.** Partly.

**What the record holds**
- `summarizeAttempt` (790-850) records the cwd (795-800).
- The attempt carries the host exit code (`drive-transport.mjs:243-245`, 281) and `refusalCodes`, `refusalCounts` and `refusalStops` (`drive-stream.mjs:284-295`, 652-660).
- A kit-hook denial is counted (449-450) but does not set `facts.refused`. Only these do:
  - a host `permission_denied` on the worker's own call (556-586)
  - a refused lifecycle dispatch (266-271, 463-480)
  - certain native failures

  So the attempt is not marked refused.
- The attempt is not "completed" either: `settleAttempt` stores `completed: false` and `phaseAfter` (242-253).

**What the drive does**
- `driveLoop` increments `incomplete[action]` (347-355).
- `routeOrder` stops at a count of 2 with `incomplete-bound` (`drive-route.mjs:148-152`). So the drive re-dispatches exactly once: two attempts in all.
- The stop's text mentions no refusals.
- `drive.mjs why` does list them, saying "A refused call returns its refusal to whoever made it and ends nothing" (`drive-account.mjs:296-306`). For the first such attempt its next step is to drive again (232-233).
- Driving again before a transition is recorded meets the same stop.

**v1.1.0 against v1.4.0.** v1.1.0 had the same two attempts and the same stop (v1.1.0 `drive-route.mjs:151-153`, `drive-session.mjs:300-307`). It had no `completed` field and no `why` account; `drive-account.mjs` is new.

**Open orders.** None. WO-288's `driveLoop` change only maps a denied publish after a passing review to an `awaiting-publish` or `awaiting-merge` stop.

**Smallest change.** In `driveLoop`, when the attempt did not finish and `refusalCounts` is not empty, stop immediately, for example with a `guard-refused` stop naming `refusalStops`.
- Readers: `endedBy` and `nextStep` (`drive-account.mjs:128-237`), `stopNeedsAccount`, the router role text's list of stops (`contributor.ts`, which WO-288 F2 also edits), and the `test-drive` cases.
- A lighter alternative: only name the refusals in the text of `incomplete-bound`.

## 4. A verifier's pass is accepted without an executed record for each criterion's check

**Verdict.** Confirmed.

**What `verification-result pass` checks** (`resume.mjs:2265-2343`)
- the phase
- the actor and the effort (874-879)
- the report file and its actor (2283-2297)
- the cost line
- `requireCriterionLines` (`off-ramps.mjs:514-541`; `judgeReport` 348-502), which checks that the report agrees with the log
- gate claims, only for met criteria that name `test:docs`, `npm test [-- --review]` or `target-gate` (`handoff-ledger.mjs:148-156`, 283-293, `requireGateClaims` 488+). A target order uses `targetGateEvidence`.
- `git diff --check` (`lifecycle-evidence.mjs:65-125`)

**What it does not check**
- the report's own account of its lane
- the verifier session's refused calls
- any other command a criterion names

I also found no check that a pass judges every declared criterion. Only the executor's ledger requires that (`handoff-ledger.mjs:349-356`). This is an inference from reading; no case was run.

**v1.1.0 against v1.4.0.** Same: `off-ramps.mjs` has no diff, and the changed hunks of `resume.mjs` are elsewhere.

**Open orders.** None for verification. WO-288's uncommitted review helper adds an advisory, "the host refused N of the worker's tool calls".

**Smallest change.**
- For a pass, read the verifier session's `refusedCalls` (as `phaseSessionReadback` does, `harness-host.ts:8700-8720`; for a target order, from the target lane). Refuse, or advise, when the report does not name them.
- In `judgeReport`, require a pass to judge every declared criterion.
- Readers: `requireCriterionLines` at `resume.mjs:2299` and `2473` (final review shares it), and `judgeCriterionLines`, which has no caller.

## 5. The dispatch bound's wall clock

**Verdict.** Partly.

**How the bound is set**
- `budgets.json:27` sets `"local-median"`, with its source at line 22.
- That resolves to max(4 × the local median, 8 h), or 8 h with no history (`process-budget.mjs:117-155`, 202-217).

**How elapsed and worked time are computed** (`dispatchStanding`, `dispatch-bound.mjs:311-424`)
- `elapsedMs = now − anchor` (387).
- `workedMs = elapsedMs − idleMs` (396).
- The bound compares **`workedMs`** (398).
- The anchor is the earliest dispatch of the same role, phrase and order since the phase boundary. For `resume: next` the boundary is `WorkOrderActivated` (`bindDispatchBound`, `harness-host.ts:609-694`). Elapsed time therefore runs from the first `resume: next` after activation, through every later session and every stop.
- Idle time (`idleTime`, 251-280) counts only gaps longer than 10 minutes (192) that begin at a `Stop` row, in the journals `phaseJournalRows` reads (289-306). A session killed with no `Stop` row has its gap counted as worked.

**Target worktrees (inference)**
- `phaseJournalRows` reads only `docs/control/local/harness/<key>.jsonl`, but a target session's rows live under `…/harness/targets/<digest>/` (881-886, 8996-9000). So the bound cannot see that session's activity.
- The target hook never judges the bound; the launchpad hook does, at 7776-7798.
- Where a target order meets the bound instead:
  - `requireRedispatchBound` (`resume.mjs:2355`, 3441) and the probe wrapper (`bounded-command.mjs:64`), both reading the launchpad lane
  - the drive's per-attempt watchdog, which uses the same `wallClockMs` (`drive-session.mjs:512-529`)

  Which of these the instance met is unknown.

**What the refusal prints.** `dispatchBoundMessage` (440-449):

`DOTLN_DISPATCH_BOUND: wall clock=<worked>, bound=<b>. dispatch standing: <worked> worked (<elapsed> elapsed) of <b>; complete runs …; exceeded.` followed by the routes.

It does not print the start, the reading time, the idle time subtracted, which journals were read, or `wallClockBasis` (the sample count, the median and the 8 h floor). The standing record does hold `startedAt` and `wallClockBasis` (402-422). `harness usage` prints the whole standing, `elapsedMs` and `workedMs` included (`harness.mjs:206-228`).

**v1.1.0 against v1.4.0.** The logic is the same. v1.4.0 adds levels: the `dispatch-bound` stop advises in an instance, where it refused at v1.1.0.

**Open orders.** WO-288 (uncommitted) moves the idle interval to the `dispatch.idle-gap` time-limit key and adds "complete runs unavailable". It does not print the basis. Its Known issues keep worked time as row B07 (order lines 690-701).

**Smallest change.**
- Return `idleMs`, the journals read and `now` from `dispatchStanding`, and print the start, the end, the idle time and `wallClockBasis` in `dispatchBoundMessage`.
- Readers: `requireDispatchBound`, the hook at 7795, `dispatchBoundResult`, `dispatchStandingLine`, and the cases that assert the message.
- Separately, have `phaseJournalRows` also read the order's target-lane journals.

## 6. No withdrawal of a final review; `override-record`'s order; where the hook writes

**Verdict.** Confirmed, with one nuance.

**What remains open in the closed phase**
- The off-ramps legal in closed are `correct`, `override-record` and `retract` (`resume.mjs:389-413`).
- `correct` can change only these fields, never a verdict (`control.mjs:79-94`): `model`, `effort`, `source`, `harnessVersion`, `reportPath`, `checkpointRef`, `checkpointSha` and `productGate`.
- `retract` acts only on a waiver or a defect (`control.mjs:35-38`; `resume.mjs:2847-2854`). The nuance: retracting such a record before the merge returns the order to `needs-fix` (2924-2933).
- `activate` is legal in closed (`lifecycle-actions.mjs:25`). A reactivation leaves the old review in the log.

**Which order `override-record` takes**
- It takes the selected order: `--work-order`, else the branch's order, else `selectWorkOrder`. In main that is the single open order or, failing that, the latest closed one (`control-store.mjs:244-280`).
- For a closed order run outside main it refuses, and its message prints a rerun with `--work-order` (`resume.mjs:3399-3415`).
- In main it writes to the ignored pending lane `docs/control/local/pending-overrides` (`pending-overrides.mjs:25`, 174+), which the next start carries (`worktree.mjs:850`, 1049).
- Inference: activation runs in the order's own worktree (`worktree.mjs:848-870`), so main's log does not hold an unmerged order.
  - With `--work-order`, main refuses the order as unknown (`control-store.mjs:264-267`).
  - Without it, main appends to its own open order (`resume.mjs:3422`). This reproduces the report of a record landing on a different order.

**Where the hook writes.** `recordOperatorOverride` (`harness-host.ts:8072-8219`) runs `node <root>/scripts/resume.mjs override-record … --work-order <selected>` with `cwd` set to the session's checkout (8140-8162).
- For an open order the event goes into that checkout's tracked `docs/control/orders/WO-NNN.jsonl`. Restoring that file from a backup would drop it.
- For a closed order run from its worktree, the hook prints "not appended".

**v1.1.0 against v1.4.0.** Same (v1.1.0 `resume.mjs:3376`; v1.1.0 `harness-host.ts:7774`).

**Open orders.** None. WO-288 only gives the hook a `hook.override-record` time limit.

**Smallest change.**
- Add a passing, closed, unmerged `FinalReviewCompleted` to `RETRACTABLE_RECORDS`, with a fold back to `verified`. `OffRampRetracted` is already an attention event (`drive-route.mjs:81-92`).
  - Readers: the `control.mjs` fold, the `retract` case, `passAtBase` (`drive-route.mjs:258-266`), `plan-failures` and `validatePending`.
- In main, make `override-record` refuse when `--work-order` is absent. The hook always passes it (8152-8153).

## 7. Review-round provenance

**Verdict.** Partly. All references are to `recordAgentReview` (`review-worker.mjs:2476-2652`).

**What holds**
- A refused report is not recorded as the round's report. It is kept as `round-N-<kind>.refused.md` with a note (`keepUnrecorded` 1518-1530; 2618-2631). It is not lost, but nothing records it later.
- `--from <file>` records whatever text it is given. The record has no field for where that text came from; only host, model and effort are attested (2492-2530).

**What does not hold.** The recorder never records a round with no tree. When neither `--tree` nor the report names a tree, it records the working tree at the time of recording, labelled "the working tree when it was recorded" (2635-2652). For a report recovered later, that tree may not be the one reviewed.

**v1.1.0 against v1.4.0.** Same (v1.1.0 line 2433).

**Open orders.** WO-288 Part B (WO-278) removes one cause of refusal, a sentence before the Items table (criterion B1). Its paired launch records its own tree. Neither changes the recorder's tree fallback or adds a source field.

**Smallest change.** Require `--tree` when the text names none, and accept `--source <worker-return|transcript>` with the source file's SHA-256 in the record.
- Readers: `RECORD_USAGE` (2310), `readPrior` and recheck, `round-findings.mjs`, `plan-failures.mjs`, the verifier's reading of the lane, and the executor role text in `contributor.ts`.

## 8. Process cost recorded as unknown

**Verdict.** Confirmed, with one correction to the claim.

**What the cost line reads**
- The report's cost line is the session's own `harness usage <session>` (verifier skill lines 20 and 78; forms at `receipt-cost.mjs:8-21`). It does not read the router's counter.
- From a target worktree, `measureHarnessUsage` reads the launchpad lane and finds no session (`harness-host.ts:4772-4800`; `harness.mjs:193-205`), so the result is "unknown; cause no-session".
- Core accepted this gap in WO-192-D097 (`docs/evidence/WO-192/decisions.md:1885`).

**What the drive records**
- `routerUsage` is always null with source `host-router-counter-unavailable` (`drive-session.mjs:1111-1115`); only fixtures fill it.
- Each attempt holds `costUsd`, `usage`, `startedAt` and `finishedAt` (`drive-transport.mjs:299-309`).
- `drive.mjs` prints them per attempt without summing (`drive.mjs:14-28`). The only sum computed is the dollar allowance (`drive-session.mjs:596-612`).
- `meta.mjs` does not read drive records.

**Tags and open orders.** The same at both tags, and no open order changes it.

**Smallest change.**
- Make `harness usage` look in the order's target lane, or
- have the verification and final-review briefings (`resume.mjs:1725-1737`) print the drive record's summed cost and duration for that role, as a new cost-line source.

Readers: `judgeCostLine` (`receipt-cost.mjs:41-79`) and `checkReceiptCostLines`.

## 9. Effort attested from `CLAUDE_EFFORT`

**Verdict.** Partly.

**What holds**
- A Claude Code attestation is bound to `CLAUDE_EFFORT` while that variable is set. `parseActor` refuses any other value, and any source other than `claude-session-readback` (`resume.mjs:813-834`).
- The hook's override flags prefer `CLAUDE_EFFORT` over the hook input's level (`harness-host.ts:8037-8047`).
- Core's own discovery record calls the variable "selected, not effective" (`discover.mjs:186-200`; `harness-runtime.mjs:167-182`).
- Two other effort sources exist and nothing compares them with the attestation:
  - the hook journals each call's `effort.level` (`harness-host.ts:1611-1613`)
  - the drive keeps the effort from the init row (`drive-stream.mjs:593-599`)

**What is unknown.** Whether the host's variable can read xhigh while the session runs at max. That is host behavior.

**The drift line.** It reports every change of effort between attestations (`resume.mjs:881-882`, 960). Core's own `docs/control/current.md:14` reads `xhigh -> max`, from phases that ran at different efforts.

**The repair route today.** `correct … --set effort= --set source=operator-attested` (`control.mjs:846-866`). A correction is a drive-attention event.

**Tags and open orders.** The same at both tags. No open order touches it; the related follow-up rows are allocated to closed orders WO-157 and WO-158.

**Smallest change.**
- In `parseActor`, read the hook-observed effort the way `observedClaudeVersion` reads the version (`harness-runtime.mjs:140-164`). When it differs from `CLAUDE_EFFORT`, accept it with source `hook-input`.
- Make `hookActorFlags` prefer the hook input.
- Readers: the `correct` rule (`resume.mjs` near 3330-3340), `effortPair`, `claudeSessionReport` and `hasRecordedEffortValue`.

## 10. The `launchpad update` preview

**Verdict.** Partly.

**What holds**
- A file whose bytes equal the incoming kit's is replaced, not refused (`planUpdate`, `launchpad.mjs:1941-1946`, 1998; WO-078-D004).
- Otherwise the preview prints `refused: <path> (locally modified; prior hash retained: <sha>)` (1978-1997, 3603-3604).
- A revision preview adds "unchanged upstream" where it applies (2004).
- Nothing says whether a differing local change is already contained in what the incoming kit sets.

**v1.1.0 against v1.4.0.** Same (v1.1.0 lines 1847 and 3448).

**Open orders**
- WO-288 (uncommitted) files this as follow-up D054, "Filed, not built here", under criterion F7 (`WO-288 worktree: docs/evidence/WO-288/decisions.md:2783-2801`; order lines 629-636).
- WO-207 (queued) edits the same functions, but for removed files and `unchanged` labels.

**Smallest change.**
- Where the prior kit bytes are available, run a three-way merge of the local, prior and incoming bytes in `planUpdate`. Mark `localChangeInIncoming` when the result equals the incoming bytes, and have `renderUpdatePlan` say so.
- Readers: `renderUpdatePlan`, the retained-hash path (2352-2354), the receipt and `test-launchpad-update.mjs`.
- A change that sets the same value in a different file, D054's time-limit case, is beyond a byte merge.

## Which path each claim lies on

| Claim | Every target order | Unusual path only | Also orders with no target |
| --- | --- | --- | --- |
| 1 | Yes. Every driven target order, every phase except the close. Attended sessions in the launchpad do not meet it. | | No |
| 2 | Yes. The stricter lane makes it bite on target orders (inference). | | Yes |
| 3 | | Only when a phase ends without recording completion. Likelier with refusals (inference). | Yes, any driven order |
| 4 | Yes | | Yes |
| 5 | Yes, every dispatch. On target sessions the hook does not judge it and the idle reading is blind (inference). | | Yes. An instance advises at v1.4.0. |
| 6 | | Undoing a review, or an override on a closed order | Yes |
| 7 | | Agent-route recorded rounds that are refused, recovered or recorded with no tree | Yes |
| 8 | Yes. Verification and final review of every driven target order (WO-192-D097). | | The unsummed drive cost: any driven order |
| 9 | Yes, every Claude Code attestation. Whether it misreports is unknown. | | Yes |
| 10 | | At update time, for locally modified kit files | Not tied to an order |

## Unknowns

- Which command produced the instance's dispatch-bound refusal.
- Whether `CLAUDE_EFFORT` can differ from a session's running effort.
- Whether a `--print` session started with `--add-dir <launchpad>` also loads the launchpad's hooks.
- Whether `target-gate.mjs` runs with the launchpad as cwd.

None of these was read or run.
