# WO-192 implementation handoff

Status: implementation and all reviews are finished, and the complete run passed on the final code. Every criterion is met except criterion 17, which is **unmet**. Its last clause fails: Codex CLI 0.166.0 reached passing final review and then had its release close declined for a reason nobody has seen, and no full lifecycle ran on the final bytes on either host. Its first clause has exceptions: four low defects the reviews reproduced are not repaired. An executor does not waive its own criterion, so the operator decides: waive it, amend it, or leave it to be judged as it stands. [WO-192-D102](decisions.md#wo-192-d102--stop-rerunning-codexs-refused-close-and-leave-criterion-17-open) records the last clause.

The router drives one selected order through fresh lifecycle workers using canonical status and exact lifecycle phrases. Registered target orders run their phase work in the target worktree and consume target and document gates. The operator's merge stays a deliberate boundary. The actual WO-192 verification and final review remain separate dispatches.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.314","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

Sessions on this order:

- **This Claude Code session (attested above):** integrated main at 03b66a26 and ran criterion 17, all seven review rounds, live attempts 46 to 51 and this dispatch's four complete runs. Its version is the one every record of its transcript carries; the binary now on disk reads 2.1.316. Its effort is the selected value read from `CLAUDE_EFFORT`.
- **Earlier Claude Code session:** 2.1.310, `claude-fable-5-1` at `xhigh`, resumed the order after D076 and is recorded in D077.
- **Earlier Codex sessions:** 0.164.0, `gpt-6-astra` at max, implemented the order until D076.

**Criterion 1:** met — [host-probe.json](host-probe.json) records Claude Code 2.1.310's observed child identity, selected effort, nested spawner and late-directory behavior, with the absent target hook and working-directory boundary, and D001 selects the prescribed separate-session fallback. That was the installed version when the probe ran on 2026-10-25, which is when the order's first step asks for it. The binary installed now is 2.1.316 and was not re-probed; this session and attempts 48 and 51 ran the selected design on 2.1.314.

**Criterion 2:** met — `scripts/lib/drive-route.mjs` supplies the one route calculation that canonical status and the driver share. The table tests cover every phase and stop, merged and unmerged orders, closed orders with and without release evidence, and a target order merged only on the launchpad. Criterion 17 moved the target test to the remote base a drive fetches. D099 reads a launchpad merge by close's own rule and supersedes the formula in the order's step 8; this criterion stands. D065 requires completed cleanup before reporting released.

**Criterion 3:** met — the router fixture selects its role with no lifecycle transition or writer reservation. One generator and checker in `packages/compiler/src/harness.ts` produce the role definitions and detect model, effort and skill drift, and the complete run's generated and harness checks pass at 42 surfaces. Kit budgets include the router entries, absent legacy entries read as null, and the passing launchpad-update case emits the harness and runs meta with the older budget bytes preserved.

**Criterion 4:** met — a router spawn needs a known lifecycle phrase and the agent type that phrase names (D094). A free prompt, an omitted type, no prompt, `__proto__`, `constructor`, `Task` and `Workflow` are refused with a typed reason, the phrase with its type is admitted, and a phase worker's own spawns stay outside the rule. [baseline-spawn.json](baseline-spawn.json) retains the required counterexample against `08845c71`.

**Criterion 5:** met — passing hook and driver fixtures give lifecycle workers separate session records, roles and effort attestations and one exclusive writer. A worker's recorded completion or `SubagentStop` releases the reservation, and `harness writer --show` names the holding agent. D090 scopes the per-agent key to lifecycle workers, so a helper works inside its spawner's session; D090's regression uses real generated hooks.

**Criterion 6:** met — the passing skeleton and harness fixtures exercise per-spawner admission, independent worker caps, nested and repeated observations, result joins and the shared driven ceiling. The generated roots' fan-out sentence states both limits, at 20 per spawner and 80 per driven run. Unresolved observations stay minima and unobserved coverage stays unknown. Codex gains no Claude hook parity. A guaranteed cap across every spawn path stays deferred under D045 and FUP-67a3ccb3b295200e.

**Criterion 7:** met — `resolveOrderWorktrees` supplies one physical registry binding to routing and grants. The passing permission regression exercises the registered target and launchpad pair, an alias, another order's refusal and recorded grant provenance. D093 makes a failed root lookup withhold only that grant, so the outside-write guard stays on. These are declared grants and observed host boundaries, not arbitrary-process confinement.

**Criterion 8:** met — passing driver tables and process regressions cover re-entry, fresh interrupted attempts with the same phrase, repair and incomplete-attempt bounds, every listed stop, concurrent entry, owner cancellation, supervisor loss and release close after an observed merge. The driver now starts a fresh worker for every attempt, so resuming an addressable worker is a contract of the route's table that no live path reaches (D097). Attempts 44, 45, 48 and 51 exercise routing after observed synthetic merges.

**Criterion 9:** met — [Claude attempt 48](live-drive-attempt-48.json) and [Codex attempt 49](live-drive-attempt-49.json) each retain a native router driving an active registered target order through ImplementationReady, passing verification and passing final review from one typed phrase. Each phase's working directory is the target worktree, and its gate claims stand on the fixture target's gate rows, never a launchpad `npm test` row. The receipts record hook source, each worker's sub-agent count and usage split between router and workers. They record model and effort as the host reports them: Codex reports neither, and the receipt says so.

**Criterion 10:** met — product 07 records the phrase, authority, routing and limits; product 05 names the router as the first orchestration binding; the security document records per-agent identity and what stays root-wide; PLAYBOOK states the independence reading. D004 and D088 explain why the router-only refusal adds no seventh universal refusal. Decisions D001 to D103 and their index are current, and publication artifacts are current after sync.

**Criterion 12:** met — the executor, verifier and reviewer roots carry the target documentation, product write-back, qualified gate, release-prepare and reviewer commit, records and publication duties. Self-order text in those roots changes only where criteria 6, 7 and 15 require: the fan-out sentence, the `order-worktree` grant and the executor's preflight line. `harness check` passes, and the oracle `wo192-integration-role-baseline.json` pins the roots with its chain intact. D088's after figures match the installed roots today: executor 37,901 against the accepted 40,194, verifier 32,734 against 35,221, reviewer 35,504 against 39,600 and router 15,014 against 16,384. D095 boards the separate question of launch text, which those figures do not count. Criterion 9's phases ran under these roots.

**Criterion 13:** met — `npm test -- --review` passed at 2026-10-31T07:04:06Z, and `npm run test:docs` passed after this handoff's last edit. `git diff --check` is clean. No dependency was added: the package and lockfile changes are this order's version bumps.

**Criterion 14:** met — [native-qualification.md](native-qualification.md) maps all five roles for both hosts, each with its supplied model and effort, available readback, usage and sub-agent counts with unknown coverage stated. Claude: attempts 39 and 44 on 2.1.310, and 48 and 51 on 2.1.314. Codex: attempt 45 on 0.164.0 performs all five; on 0.166.0, attempts 49 and 50 perform four and report release close refused, which this criterion admits as an observed boundary. Both hosts complete the executor-to-final-review target lifecycle with actual target and document gate evidence. These are synthetic local merges and no-release closes; no real project was published or merged.

**Criterion 15:** met — D075 fixes the late lifecycle-test failure without changing the product and document gate architecture or reuse rules. `scripts/test-resume.sh` takes `--fixtures-only` or `--documents-only`; the synthetic lifecycle fixtures run as the `resume` product preflight, which blocks later product suites on failure, including under `--keep-going`; the two current-record comparisons form the document-gated `resume-docs` selection; default direct invocation keeps its full coverage. D085 keeps the preflight after a bounded comparison. The runner regressions pass in the complete and document rows.

**Criterion 16:** met — README contains the operator's four What runs today sentences in two paragraphs and keeps the preferred Why this exists opening, followed by the account of daily delivery, recorded decisions and continuity. D073 records direct-filing provenance. The repository document checker and receipt-backed amendment regression pass, keeping the changed, withdrawn and foreign binding refusals and the control and shape refusals.

**Criterion 17:** unmet — the named repair clauses are met; the last clause is not, and the first has exceptions. "Both hosts drive live again on the final code" fails two ways. Codex CLI 0.166.0 drove through passing final review (attempt 49), but its release close was declined in all three runs for a reason nobody has seen, and this criterion has no observed-boundary wording. And no full lifecycle ran on the final bytes on either host: Claude's stands on attempts 48 and 51 together, and attempt 49 predates a diagnostic-label change. WO-192-D102 records this. "The defects reproduced by the independent reviews … are repaired with regressions" holds for all but four low defects, which D098 and D099 record and Independent review below names. The named repair clauses stand on D090 and D092 to D101, each with regressions in the complete row: a non-lifecycle agent holds no writer and keeps the role's grants; a driven worker's helper stays read-only; `SubagentStop` releases a lifecycle worker; the route judges a target merge at the remote base a drive fetches, bounds only repairs still to come and clears stale drive facts; a driven worker's context reaches no suite; a live launchpad gate binds the target lane's writes; the router writes nothing and each phrase must name its agent type. [driver-launch-arguments.json](driver-launch-arguments.json) retains all 18 host, role and shape cells identical through the driver's restructure.

Criterion 11 is retired by the order's dated planning amendment and is not judged.

## What the unmet clause means in use

On Codex CLI 0.166.0 a driven order reaches a passing final review and a merge, and then stops at release close with `dispatch-refused`. Re-entry refuses a change of host, so the drive cannot be finished on Claude, and the stop names no next step. Running the phrase by hand in an attended session is the route left, and it was not exercised. On Claude the whole Objective holds. The hosts also ran under unlike conditions: Claude with the sandbox off under fixture settings, Codex in its workspace-write sandbox under automatic review. FUP-0d7e98297efa0b60 carries the question.

## Executed evidence

The passing complete run is `host-gate:8aead38946e0f352e51aee65104cc3fc8996b8dbeaa0e34c8df0b72c1ba746d6:npm test`, recorded at 2026-10-31T07:04:06.449Z in 1,321.7 seconds, on tree `9d4d5924768e6f3c89d57cd0e6b6fa5ad745f0b7`. It reports 46 of 46 required suites, none unrun or stale, with code identity and build output unchanged. The runner composed it: 36 tasks ran fresh, and it reused 79 tasks that had passed in the previous complete run at the same identity. Nothing was composed by hand.

| Complete run | Length | Result | Cause |
| --- | --- | --- | --- |
| 2026-10-30 22:22Z | 15 min | Failed | A stale generated-file pin and a real guard defect (D093) |
| 2026-10-30 22:46Z | 12 min | Failed | A stale role list (D093) |
| 2026-10-31 05:57Z | 36 min | Failed | The Mac idle-slept 13 minutes in, and a suite limit counted the time asleep (D103) |
| 2026-10-31 06:42Z | 22 min | Passed | |

The first two started with no reviewer restart, which [process-recovery-2026-10-30.md](process-recovery-2026-10-30.md) records. The third changed no code, so the role's restart "on the changed code" had nothing to review, and D103 records that reading for the verifier to check. The rerun held a temporary `caffeinate` assertion and `pmset -g log` shows no sleep during it. The assertion itself went unobserved, because the live gate refuses `pmset`.

Main has not moved: this branch, local main and the remote are all at 03b66a26, so no integration is owed.

The release is prepared as application v0.104.0, compiler 0.34.0, skeleton 0.74.0 and harness host 0.40.0. The console's version is unchanged while its workspace dependencies follow. Feedback revision 003 is selected (D096). Format and sync completed, and the branch stays uncommitted for final review.

Live attempts 46 and 47 ran on code still changing and are not completion evidence (D092). Complete review 18 of 2026-10-26 and the earlier gates of D067 to D075 are history, and this handoff stands on none of them.

## Independent review

self-review: found 156; fixed 141; recorded 15

[self-review.md](self-review.md) records both review generations, each round, and every recorded finding with its decision:

| Reviewer | Earlier Codex workers (found/fixed/recorded) | Integrated Claude `dotln-worker` agents (found/fixed/recorded) |
| --- | --- | --- |
| Criteria | 18/18/0 | 47/40/7 |
| Design | 11/11/0 | 37/35/2 |
| Consistency | none | 43/37/6 |

No finding is open. All three integrated reviewers finished on the final code before the passing complete run and were not restarted after it. A finding counts once per reviewer and round that reported it, so these totals overstate distinct defects.

Of the 15 recorded findings, five need a rule and went to planning: the cold-start route, launch text, a nested helper's root mapping and spawned evidence sources (D095), and the squash-merge policy (D099). The squash merge was reproduced by running: it reads as unmerged in the route and in close alike.

The other ten are low items the executor left as they are. Three of them are reproduced defects, each reproduced by running:

- A hung remote's transport child survives the fetch limit, though the drive does not wait for it (D098).
- A reactivated order inherits an earlier release or close receipt and can route as released. One of 178 order segments has been reactivated (D099).
- `routeFacts` called with no events skips the pass check and reads as merged. Only tests call it that way (D099).

The other seven are wording, records and a missing test:

- The lane error prefix, the router's weaker merge sentence and the order's superseded step 8 (D099).
- The floor's grant sentence (D094).
- An operator's own Codex router having no session, where the reviewer offered stating the limit as one of two answers (D101, D102).
- The worker note's "each helper's normal arguments", broader than the target lane admits, and no direct test of `harness begin`'s refusal path (D102).

**These ten depart from the order's expansion**, which says to repair every finding unless one honestly needs planning, and none of them does. The last two were small fixes a reviewer named. The session left them before the complete run, saying another code edit would restart the reviewers for little gain. That is a cost reason, which the operator ruled out on D089, so it does not stand. One consideration remains, and only for the note: it is launch text, so changing it would take attempts 50 and 51, the only live runs on the final bytes, off them. The session did not reopen passed code on its own judgment, because the accepted plan ends here and the recovery note says nothing is reordered without asking. The operator can overrule this.

## Limits and follow-ups

Boarded by this dispatch, all deferred:

- FUP-dfde4050da06d43b: build the recovery into DotLn's machinery (D091).
- FUP-dd1ac63cf4883d5f: evidence sources, the cold-start route and driven-start figures (D095).
- FUP-b5211779c719d804: a publication fixture that cannot reach a real host, and the squash-merge policy (D099).
- FUP-6fc6c71d838b7368: whether a failed diagnostic read should end a host lane wait. Its one failure's cause is still unknown (D100).
- FUP-0d7e98297efa0b60: how a driven Codex order finishes, and a code identity on live receipts (D102).
- FUP-17ea51254e5a7256: gates that hold off system sleep and name it when it happens (D103).

Carried from before: cold-start optimization FUP-e08668268dea62b1, runtime pin-list maintenance FUP-ea936acad1506e18, the planning-owned remainder of FUP-82e9f0bda503c40c, unobservable spawn paths FUP-67a3ccb3b295200e, native sandbox-policy selection FUP-ec3d1b98b15afd49 and the meta-watcher FUP-02446577ce028d06. None of these is delivered supervision or an unattended-operation guarantee.

Known limits that block nothing: an operator's own Codex drive session records no usage (D101); attempt 49's executor shows two collaboration calls against a sub-agent count of 0, so the three-reviewer duty is unshown on Codex; hosted merges and the self-order lane were not driven live. The failed 05:57Z run's interrupted suite left 16 fixture roots in the system temporary directory, outside the repository.

## Process cost

- **Usage:** the readback at 2026-10-31T07:09:53Z (source `claude-transcript-message-usage`, scope dispatch) counts 233,515,970 total tokens: input 886, cached input 229,632,815, cache write 2,902,615 and output 979,654. Reasoning tokens and USD cost are unavailable, so they are unknown. It observed 595 steps and 427 commands.
- **Reviewers:** three `dotln-worker` reviewers, 3 of the 20-agent cap (exact-observed), with no unlinked children.
- **Standing:** 12 h 57 min at that readback and 4 of 20 complete runs. The operator accepted continuing past the 8-hour wall-clock bound, recorded at 2026-10-30T23:26:11Z.
- **Live runs:** attempt 46 $20.40, attempt 47 at least $25.05 with its final total unknown, attempt 48 $36.97 and attempt 51 $1.15, so at least $83.57 on Claude. USD is unavailable for Codex attempts 49 and 50 and the capture run.

Goal alignment: the outcome matched the plan the operator accepted, which ran in its written order from the recovery on, and it fell short on one host. The Objective holds on Claude: one phrase to a pull request ready to merge, then, typed again after the merge, through release close. On Codex CLI 0.166.0 only the first half holds. The direction to make all fixes here held except for the ten low findings named under Independent review, three of them reproduced defects.

## Output reads

Current authored outputs were read: this handoff, [native-qualification.md](native-qualification.md), [process-recovery-2026-10-30.md](process-recovery-2026-10-30.md) and decisions D088 to D103. Of the 23 reviewer reports, the last two rounds were read in full at their source, and the earlier ones through their counts and finding lists. [self-review.md](self-review.md) was written from those, and its earlier section read only in part. Generated and oversized artifacts stand on the current sync inventory and the passing generation, oracle, publication, harness and evidence checks. All live workers and reviewers have ended, and no monitor or sleep assertion the executor started remains. Under Claude Code the writer releases at Stop.
