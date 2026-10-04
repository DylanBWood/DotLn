# WO-195 decisions

## WO-195-D021 — Final review: pass, no integration due, one named deferral

```json
{
  "id": "WO-195-D021",
  "date": "2026-10-04",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass final review of WO-195 with no source change; the only edit is emptying four whitespace-only transcript lines that staging exposed to git diff --cached --check. No integration is due: after git fetch, origin/main, local main and HEAD all name 72bc3ab3, the base that D017 to D019 integrated and VER-002 judged. Settle FUP-f9c8560de28a24e0 (D012's repair) on VER-002's fail-before and pass-after runs and this review's fresh gate. Defer FUP-a5c6ac8cb40bd52a by name. As WO-185-D016 records, worktree publish --target resolves the main-branch worktree (scripts/worktree.mjs:431) before it checks its arguments (:487-497). This order declares that file, but the defect is unrelated to its objective and criteria. This change alters neither line, and this review's gate did not meet the defect because main is checked out. A fix is new behavioral code, which a reviewer may not write and certify. Keeping it in this order would cost a repair, a fresh verification and another full gate.",
  "evidence": [
    "git fetch origin main, then git rev-parse origin/main main HEAD, prints 72bc3ab39608aa5a058fff8337d1584429289893 three times. gateCodeIdentity is 8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46 before and after this review staged the subject, equal to the identity VER-002 judged.",
    "npm test -- --again --review passed 41 of 41 suites with 91 fresh tasks in 859.845 s, recorded 2026-10-04T16:19:50.694Z at code identity 8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46, tree 4a8143cc49b0ce994703780b85ac7c7010e4153b. The first plain npm test -- --review found the executor's covering row of 2026-10-04T15:29:01.437Z and started no suite; the order names a run at final review, so --again ran it.",
    "Staging the untracked order records exposed four whitespace-only lines in regressions/printer-admission.txt and regressions/stale-runtime.txt to git diff --cached --check: Node assertion-diff indentation of two spaces. This review emptied those four lines and changed no other byte. Nothing hashes the transcripts, and the handoff names only their paths. git diff --check and git diff --cached --check then exit 0.",
    "VER-002 ran runtime_refresh, close_leftover, close_retry_paths and close_receipt_recovery against checkpoint 5's three close-path scripts (4/4 exit 1, each at its VER-001 behavior) and against the subject (4/4 exit 0). This review's gate ran the same cases inside the release suite.",
    "scripts/worktree.mjs:431 calls mainWorktree(toolRoot) for every action, and the publish --target usage check is at :487-497. The staged diff against 72bc3ab3 changes neither region. Its worktree.mjs hunks are two imports, removePreservedWorktree, its two callers and the publish handoff string at :638.",
    "npm run plan -- followups --touching --work-order WO-195 matched 23 of 178 pending rows at register revision 9e594e2ba413dad2976d38f3db6eaa4a3378b174864401c70d74e589dfe012e1. FINAL-001's Register section records each judgment."
  ],
  "reopens": {
    "decisionId": "WO-185-D016",
    "observation": "WO-195's final review met D016's worktree CLI ordering as a textual match on scripts/worktree.mjs, a file WO-195 declares. The ordering is unchanged at :431 before :487-497. WO-195-D021 defers it by name."
  },
  "goalAlignment": "Mission and critical path: the order removes operator rescue from the Claude release close and the planning pass. Passing it ships the admission, short output and complete cleanup to main, where its own close is the first live observation. Rule beating and seeking the wrong goal: this review judged admission facts, refusal order, disk, branch and permission assertions and the role bytes, not suite counts. Success to the successful: two verifications and a covering gate row did not replace the fresh gate the order names. Drift to low performance: the deferred items stay register rows with conditions (FUP-a5c6ac8cb40bd52a, FUP-8cfd3ff52146a016, FUP-da471832071118c7), not report sentences. Shifting the burden: the deferral hands planning an unrelated, environment-dependent usage-ordering defect with its reproduction, and keeps this order's close-path fix off that cycle. Escalation: failing the review for a pre-existing defect that no criterion depends on would add a repair, verification and gate cycle with nothing at stake for the objective. Policy resistance: no refusal, allow rule or dependency changes. Tragedy of the commons: one fresh gate, no subagent, and short read-only probes. Naive Interventionism: the reviewer changed no source. NoOp: without a pass, main keeps the closes that needed the operator's own command in 6 of 12 recorded Claude closes.",
  "rejected": [
    {"option": "Fail final review and route FUP-a5c6ac8cb40bd52a to repair under Adjacent Repair", "reason": "No WO-195 criterion depends on publish --target, the defect predates the order, and this change did not open its lines. Product 07's Adjacent Repair admits a named deferral for an unrelated change, and a repair cycle would delay the close-path behavior the order exists for."},
    {"option": "Reorder the publish --target check in this review", "reason": "A reviewer never writes a behavioral fix and certifies it (product 07 §Independent workflows and integration)."},
    {"option": "Leave the row untriaged with no judgment", "reason": "The row names a file this order declares. Adjacent Repair asks for a named deferral with its reversal condition."},
    {"option": "Run worktree integrate again", "reason": "origin/main has not moved since D017. A second run would add a checkpoint, stash and regeneration with no upstream change to take in."}
  ],
  "reopenWhen": "An order's criteria or design touch scripts/worktree.mjs action dispatch or argument checks, a gate again fails target-publish's usage case while no worktree has main checked out, or an operator meets the misleading error at a real target publish."
}
```

## WO-195-D020 — Accept the integrated repair evidence

```json
{
  "id": "WO-195-D020",
  "date": "2026-10-04",
  "dispatch": "resume: fix; scope expand: merge in main; executor handoff",
  "decision": "Judge all eight acceptance criteria met by the repaired, integrated subject and finish the executor handoff through repair-complete after the final output reads, index preparation and usage observation. Preserve VER-001, the refused earlier completion, both integration recovery references and all historical gates and failures. Independent verification, final review and the first live merged-main close remain separate dispatches.",
  "evidence": [
    "The integrated npm test -- --review exited 0: 41 suites passed, zero failed, 91 fresh tasks, duration 875780 ms. Its canonical row records code identity 8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46, tree hash 5fd3d2d3fe3088265b87c44ef0b934f881c4930d, evidenceRef host-gate:8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46:npm test and recorded cutoff 2026-10-04T15:29:01.437Z.",
    "A fresh read of npm test -- --review --list names 41 required suites. coveringGateCheck at the current code identity returns the integrated executed passing row with no missing suite. The earlier captured selection is historical; it is not substituted for this check.",
    "The complete integrated review passes harness-fixtures, process-debt, skeleton, runner-fixtures, worktree-integration and the release cases runtime_refresh, close_leftover, close_retry_paths and close_receipt_recovery. The host command ended with exit 0; no executor background monitor was started for this run.",
    "The integrated npm run test:docs exited 0: 24 suites passed, zero failed, 24 fresh tasks, duration 39699 ms. Its canonical row has the same code identity and tree hash, evidenceRef host-gate:8d2d7373fd068fd40c0db22cc6d0c39d766c9c7461f62b36d7b5f31e58df7f46:npm run test:docs and recorded cutoff 2026-10-04T15:33:40.750Z. findGateCheck returns that executed passing row at the integrated tree.",
    "The document gate passes publication, release surfaces, the four selected evidence checks, harness generation, planning, lineage and metadata. Authority remains revision 004 and artifact-identity, verification and feedback remain revision 003. D019's byte-preservation and release-collision checks retain their meaning; no dependency or new live episode was added.",
    "Queue revision 14 has no running or next item. The integrated gates reaffirm adjacent-0002's bounded repair after its pre-integration completion. The final authored handoff and refreshed index are checked again by repair-complete's inline document gate; its recorded RepairCompleted event is still required to finish this role."
  ],
  "goalAlignment": "Outcome against D013 and the operator's integration request: the fresh complete cases support retained refresh output, restricted-beacon access with surviving modes restored, per-path blocker isolation and receipt discovery despite absent history, with incoming main incorporated and both role histories preserved. Policy resistance: existing preservation and publication controls remain. Commons and drift: a single current executed row covers the current selection and a fresh document gate judges the integrated editions. Escalation and success to the successful: no new phase, agent or redundant edition was introduced. Shifting the burden: this session resolved the merge and collision and ran the required checks. Rule beating and seeking the wrong goal: actual path, branch, permission, transcript and coverage assertions establish the handoff, while stopped or old-identity gates do not. Naive Interventionism: the integration retained the core repair bytes and no live publication occurred. NoOp would leave the operator's request and RepairCompleted unfinished. The repeated gate is real integration cost; no token or waiting saving is claimed.",
  "rejected": [
    {"option": "Repeat the complete passing product review", "reason": "The current identity and suite coverage pass; no new implementation change, failure or unresolved executable concern warrants another product run."},
    {"option": "Advance verification or final review as part of repair-complete", "reason": "Those independent roles require their own operator dispatches."},
    {"option": "Drop recovery material or rewrite historical failures after passing", "reason": "The retained checkpoint, stash, immutable report and correction records remain valid evidence."}
  ],
  "reopenWhen": "Completion finds stale coverage or a failed final document check, or independent verification, final review or the first authorized live close supplies contrary behavior or new scope evidence."
}
```

## WO-195-D019

```json
{
  "id": "WO-195-D019",
  "date": "2026-10-04",
  "dispatch": "resume: fix; scope expand: merge in main; integration assessment",
  "decision": "Keep the integrated main and this repair, resolve the evidence selector for WO-195, and use a new linked role oracle for their combined instruction bytes. Retain both historical role snapshots and all revision 003 evidence. Select authority revision 004 because its checked bundle differs after integration; retain artifact-identity, verification and feedback revision 003 because their checks still pass. Retiming skeleton 0.52.1 to 0.52.2 preserves the already-declared patch impact after main consumed 0.52.1; keep compiler 0.25.1 and harness-host 0.34.3. The helper retimed the unpublished app target to v0.66.2. Run the complete current review and document gates before completion, preserving the refused earlier completion and all historical results.",
  "evidence": [
    "worktree integrate WO-195 fast-forwarded HEAD from 340a67c9797520213345ef6ba9c72bff8df2e0a1 to fetched main 72bc3ab39608aa5a058fff8337d1584429289893. The retained checkpoint is refs/dotln/checkpoint/WO-195/6 with preservation commit 9c38e59cb19f359cd5a8c743111fd5dae0eced06; named stash 368d4f69203980a755272bee387a5a76a0807774 remains retained. No authored branch commit was made.",
    "The helper reported authored conflicts only in docs/evidence/current.json and scripts/test-process-debt.mjs. The selector retains this order's editions; the test uses packages/skeleton/fixtures/wo195-integrated-role-baseline.json, with hash-bound backlinks to both the original WO-195 and upstream WO-185 snapshots. The helper's --continue completed generation with no authored conflict or pending step.",
    "The bounded optional-economy oracle check exited 0, verifying current default/opt-out role hashes, both roots, both historical chains and removal of only the executor economy paragraph. The new oracle pins original WO-195 SHA-256 0930608ab2561ed44949ba204203aa275a7b40dc5c78e31d42d67036b41850d6 and upstream WO-185 SHA-256 f67e48b79873202b56c069902f2338d54b1fef42d3c9eb29706d3d2cd7a72ef9.",
    "A bounded preservation comparison at 2026-10-04T15:09:54.439Z exited 0: 15 historical files remain byte-exact, covering all four revision 003 directories, VER-001, the original WO-195 role snapshot and the upstream WO-185 snapshot. scripts/release.mjs, scripts/lib/worktree-removal.mjs, scripts/lib/harness-runtime.mjs, scripts/worktree.mjs, packages/compiler/src/harness.ts and packages/skeleton/src/harness-host.ts match the pre-integration checkpoint exactly.",
    "Release check-surfaces --local initially reported skeleton source changed while its version still equaled v0.66.1's 0.52.1. After the patch retime and exact workspace/lockfile pin updates it exited 0. Compiler's 0.25.1 differs from main's 0.25.0; console source remains unchanged at 0.4.0. No dependency or compatibility change was introduced. release prepare --local confirms v0.66.2 remains current.",
    "Authority --check reported stale revision 003 bundle-diff.json. --write --edition WO-195 --revision 004 created the new immutable revision; that command does not change the authored current.json selector. After explicitly selecting 004, the normal --check exits 0. Artifact-identity, verification and feedback --check each exit 0 on retained revision 003; feedback retains the original live audit/verifier by reference and observes only component-label movement.",
    "publication:check, harness check (32 generated surfaces), harness evidence (52 checked surfaces, historical live smokes explicitly historical), plan check and git diff --check passed during integration preparation. The planning check classifies this order's changed title version as a release assignment, with its acceptance text unchanged. Current npm test -- --review --list returns 41 suites after main is incorporated; the old row has the old code identity and is not reused for the integrated result.",
    "The touching register was read through all 20 rows. FUP-f9c8560de28a24e0 carries the repair now implemented and awaits independent verification/final-review disposition. The following textual matches are left under their existing recorded conditions: FUP-f1c7a256bec46737, FUP-0132, FUP-04ec9fa011f39d93, FUP-0804477ea9d640a7, FUP-33173b7f87004a9c, FUP-4b70089b028849f0, FUP-51c310284c2fea17, FUP-7fd69f3bda6fa326, FUP-8cfd3ff52146a016, FUP-a6cf30a8b7bc4a83, FUP-acfe4bfda716d8fb, FUP-adf6621e7f958dd8, FUP-b3454d6ce3594ef3, FUP-cd1a227413938345, FUP-da471832071118c7, FUP-e821aa2ced3aa111, FUP-ec72b2ea596bdc75, FUP-fb8cbeabbddef397 and FUP-fd05316b6030ef73. This integration changes none of their named outside-write, attestation, attribution, live-writer, classifier, standing-text, TAP or moved-main retry contracts; matching a file does not dispose those rows."
  ],
  "goalAlignment": "Outcome and remaining critical path: main and the repair are combined with preserved recovery, and executable evidence supports the mechanical resolutions and valid release labels. Policy resistance: both role histories and immutable reports remain intact. Commons and drift: re-mint only the stale authority edition and judge the new gate at the actual integrated identity. Escalation and success to the successful: retain existing producers and unaffected checked editions. Shifting the burden: resolve the two conflicts and version collision in this session. Rule beating and seeking the wrong goal: byte comparisons, role assertions and release preflight precede the complete gate; its old row is not a current proxy. Naive Interventionism: no behavioral repair source changed during integration and no publication occurred. NoOp would leave the merged release preflight failing and the role oracle stale, so this bounded bookkeeping wins. No saving is claimed; the repeated gate is a real integration cost.",
  "rejected": [
    {"option": "Rewrite either historical role oracle for the combined role bytes", "reason": "A separately linked current oracle preserves both original meanings and executable byte checks."},
    {"option": "Rewrite authority revision 003 or mint all four editions", "reason": "Only authority's current check fails; three unaffected editions pass and their historical bytes must remain intact."},
    {"option": "Keep skeleton 0.52.1 because the original implementation bumped it", "reason": "Main consumed the same version; the integrated release preflight requires a distinct version for changed skeleton source, with the original patch impact retained."},
    {"option": "Treat the upstream ref movement as a new acceptance failure or file another immutable report", "reason": "It is authorized integration bookkeeping. The existing VER-001 remains the repair source and fresh independent verification follows the executor handoff."}
  ],
  "reopenWhen": "The complete integrated gate fails, a preserved historical byte changes, a registered evidence projection changes, or later independent verification or live close contradicts the carried repair claims."
}
```

## WO-195-D017 — Integrate main under the operator's scope expansion

```json
{
  "id": "WO-195-D017",
  "date": "2026-10-04",
  "dispatch": "resume: fix; operator scope expansion",
  "decision": "The operator's current-session instruction scope expand: merge in main authorizes incorporating main into this repairing worktree. Use npm run worktree -- integrate WO-195, fully staging the three existing intent-to-add code inputs so its include-untracked stash can preserve them. Preserve the checkpoint, named stash, all existing implementation and immutable reports; resolve authored conflicts explicitly and regenerate the helper's projections. Run the required review and document checks at the integrated subject before RepairCompleted. This expands the integration chores, not the acceptance criteria or authority to publish.",
  "evidence": [
    "The operator explicitly requested scope expand: merge in main during the active repair after the first completion attempt was refused.",
    "npm run resume -- repair-complete exited 1 because the current review selection includes plan-refutation, absent from the 41-suite passing row. RepairCompleted was not recorded and the current writer remains reserved.",
    "The earlier D016/current-handoff statement that the passing row establishes all current criteria was wrong. npm test -- --review --list names plan-refutation. The origin/main reflog records a fast-forward at 2026-10-04T14:34:37Z, during the review that started at 14:29:23Z. changedMachinery now selects plan-refutation because scripts/lib/plan-failures.mjs differs behaviorally from the advanced origin/main. The existing row is an executed passing observation of its captured selection, not evidence for the new selection.",
    "The original HEAD is 340a67c9797520213345ef6ba9c72bff8df2e0a1; both local main and origin/main currently name 72bc3ab39608aa5a058fff8337d1584429289893. The canonical helper fetches main and records the actual fetched upstream rather than relying on these observations remaining current.",
    "Read product 07 Independent workflows and integration and scripts/lib/worktree-integration.mjs. The helper is admitted in repairing, checkpoints and retains its stash, rejects intent-to-add before effect, and performs generation only after authored conflicts are resolved. Ignored intake inventory found zero files requiring an external backup.",
    "npm run plan -- followups --touching was read through all three pages, naming 20 pending textual matches. Its FUP-f9c8560de28a24e0 row carries VER-001's D012 repair and is addressed by D013-D016; the other rows remain subject to their recorded conditions and the integration assessment. No listed row is disposed merely because a filename matches."
  ],
  "goalAlignment": "Mission and critical path: incorporate the operator-selected current base while preserving this repair and obtaining evidence for the actual handoff subject. Policy resistance: use the existing repairing-phase integration path and all preservation guards. Commons and drift: run one current gate after resolutions, and do not confuse the earlier captured selection with the expanded one. Escalation and success to the successful: no new workflow, role or agent is introduced. Shifting the burden: complete the merge and conflict resolution here. Rule beating and seeking the wrong goal: judge the integrated code and current suite coverage, preserving the refused completion. Naive Interventionism: checkpoint and stash precede the merge and only explicit conflicts are resolved. NoOp would leave the operator's merge request undone and the review claim unsupported.",
  "rejected": [
    {"option": "Record criterion 8 unmet and complete without the required integrated checks", "reason": "The operator requested completed repair plus main integration; the required evidence can be obtained in this session."},
    {"option": "Edit the passing gate row or remove plan-refutation from the selection", "reason": "The row records what ran and the new selection is supported by the advanced base; neither may be rewritten to pass."},
    {"option": "Discard pending files or drop the integration stash to simplify the merge", "reason": "Existing implementation, reports and recovery material must survive."}
  ],
  "reopenWhen": "The fetched upstream changes the merge assumptions, an authored conflict affects behavior or acceptance, or the integrated checks fail."
}
```

## WO-195-D016 — Accept the executed repair and complete the queue

```json
{
  "id": "WO-195-D016",
  "date": "2026-10-04",
  "dispatch": "resume: fix; VER-001; adjacent-0002 revision 1",
  "decision": "Record the bounded F1 and R1-R3 repair's executed passing review and document observations at its pre-integration code identity, and complete adjacent-0002 through its canonical queue command. Preserve VER-001 and all earlier failure/correction records. The initial claim that these rows establish all current criteria was contradicted by the completion refusal: the advanced origin/main expanded the required review selection. D017 records that correction and the operator's subsequent main-integration authorization. Independent verification, final review and the first live merged-main close remain separate dispatches.",
  "evidence": [
    "npm test -- --review exited 0: 41 suites passed, zero failed, 91 fresh tasks, duration 887067 ms. Its canonical row records code identity 2e73801389465f2505f95bb20727185faf8533a41dcf60d17c7ad22a525521f3, evidenceRef host-gate:2e73801389465f2505f95bb20727185faf8533a41dcf60d17c7ad22a525521f3:npm test and cutoff 2026-10-04T14:44:10.593Z.",
    "The complete review includes passing runtime_refresh, close_leftover, close_retry_paths and close_receipt_recovery cases, plus the full harness, process-debt, lifecycle, worktree, integration, skeleton and browser evidence checks. The required review's background wait exited 0 and ended.",
    "npm run test:docs exited 0: 24 suites passed, zero failed, duration 38326 ms. Its canonical row records the same code identity, evidenceRef host-gate:2e73801389465f2505f95bb20727185faf8533a41dcf60d17c7ad22a525521f3:npm run test:docs and cutoff 2026-10-04T14:45:12.588Z.",
    "findGateCheck at the current code identity and tree returns both executed passing rows. Neither has partial coverage; no reused task or interrupted gate is claimed as this review's fresh execution.",
    "npm run adjacent -- apply completed adjacent-0002 revision 1 with both required passing references. Queue revision 14 records both items completed and next null.",
    "D015 retains the incorrect diagnostic command, both stopped runs and their added cost. D010 retains the original two hard failures. D014 retains the focused failure-to-pass evidence and checked edition/source-registry decision. The final handoff and index will be checked again by repair-complete's inline document gate."
  ],
  "goalAlignment": "Outcome against D013: the complete executed cases support retained refresh output, restricted-beacon retry without surviving permission changes, per-path blocker isolation, and receipt discovery despite absent history. Policy resistance and commons: existing guards and shared checks passed, with no added workflow or agent. Drift and seeking the wrong goal: directory, branch, permission and transcript assertions establish behavior beyond a clean summary label. Escalation and success to the successful: no extra phase or edition churn was needed. Shifting the burden: the selected helper performs the bounded recovery; the executor completed its required checks and queue. Rule beating: current code identity includes the formerly untracked source inputs, and stopped runs do not count. Naive Interventionism: no real publication or host setting effect was introduced. NoOp would leave the recorded failure unresolved; the repaired outcome is supported by the fresh gates. No token or waiting saving is claimed.",
  "rejected": [
    {"option": "Continue broadening or repeating the passing review", "reason": "All required current suites passed; no new change, failure or unresolved executable concern warrants another full product run."},
    {"option": "Advance verification or final review in this repair", "reason": "Those are independent roles selected by separate operator dispatches; the executor hands off its repaired subject."},
    {"option": "Erase the earlier failures after passing", "reason": "Their reports and correction receipts remain valid historical evidence and are preserved."}
  ],
  "reopenWhen": "Independent verification, final review or the first authorized live close supplies contrary behavior or new scope evidence."
}
```

## WO-195-D015 — Correct the diagnostic command and stop duplicate gates

```json
{
  "id": "WO-195-D015",
  "date": "2026-10-04",
  "dispatch": "resume: fix; validation correction",
  "decision": "The executor used node scripts/harness.mjs evidence as a status diagnostic without reading that command's branch. That was wrong: with no --wait flag it prepares evidence and starts another npm test. Stop both owned gate trees through the canonical evidence --stop command, preserve their diagnostics, and run one fresh required npm test -- --review. Neither interrupted run is acceptance evidence. Use evidence --wait and host process completion for the new gate; no plain evidence command is a read-only observation.",
  "evidence": [
    "The mistaken command printed 'Prepared owned evidence projections in 1914.2 ms' and started npm test. The checked scripts/harness.mjs evidence branch calls beginGateRun, prepareHarnessEvidence and runHarnessEvidence; the --wait branch only awaits observations.",
    "activeGateRuns then named the original review runner plus the accidental harness evidence owner and its nested npm test/runner. All were owned by this repair session.",
    "node scripts/harness.mjs evidence --stop exited 0 at 2026-10-04T14:27:44.992Z, reported four stopped marker rows and active [], and explicitly recorded no check.",
    "The required review stopped after 398.9 seconds with no check. Its preflight and harness-fixtures had passed; process-debt was interrupted by the stop request, and not-started suites were not executed failures. The accidental evidence command also exited 1 after its owned stop. The existing background wait exited 2 with run null and has ended.",
    "This correction changes no behavioral source or verdict and erases no prior failure. The mistake added unnecessary execution and waiting cost; no saving or completed full gate is claimed."
  ],
  "goalAlignment": "The correction returns validation to one observable required result. Commons and shifting the burden: acknowledge the wasted duplicate execution and resolve it within the same session. Rule beating and drift: an interrupted gate is not a passing check and cancellation is not a product failure. Policy resistance, escalation, success to the successful and seeking the wrong goal do not justify source changes or a new workflow. Naive Interventionism: use the existing owned stop path and preserve work. NoOp would leave duplicate validation competing and an ambiguous result, so stopping and rerunning wins.",
  "rejected": [
    {"option": "Treat plain harness evidence as read-only or reuse either stopped gate as a pass", "reason": "Checked command source and stop output directly contradict both claims."},
    {"option": "Report interrupted/not-started suites as reproduced behavioral defects", "reason": "The canonical stop caused their result; their assertions did not complete."},
    {"option": "Kill guessed processes or ask the operator to clean up the duplicate", "reason": "The canonical stop knows these owned gates and returned active [], with no operator intervention needed."}
  ],
  "reopenWhen": "The required fresh review fails, an owned gate remains active, or a command intended as observation can mutate gate inputs and has not been checked before use."
}
```

## WO-195-D014 — Focused repairs pass; retain the current editions

```json
{
  "id": "WO-195-D014",
  "date": "2026-10-04",
  "dispatch": "resume: fix; VER-001; adjacent-0002 revision 1",
  "decision": "Keep the D013 repair after executing the focused failures and passes. Carry the discovered subject uncertainty across blocked retries and recover a receipt after a previous preview, while excluding paths whose latest real outcome is removed. Capture child stdout before parsing its bookkeeping lines, so a parse failure cannot discard the diagnostic transcript. Retain selected revision 003 editions and the existing emitted bundle because this repair changes none of their registered sources and their current checks pass. Put the three existing untracked code inputs into the index with intent-to-add before the new gate, without a branch commit, so the gate identity includes their current bytes.",
  "evidence": [
    "Before source repair, bash scripts/test-release.sh --case runtime_refresh exited 1 at 'WO-195 refresh announcement escaped the retained report'; --case close_leftover exited 1 with EACCES at the anchored restricted beacon scandir; --case close_retry_paths exited 1 at 'unrelated blocker survives removal of first leftover'; --case close_receipt_recovery exited 1 because cleanup was clean instead of blocked.",
    "After source repair, those four focused cases exited 0. runtime_refresh covers stale pins and a missing snapshot on the no-release path. close_leftover covers primary and derivative paths with valid, corrupt and missing proofs and verifies mode 0111 survives verification/refusal. close_retry_paths preserves an unrelated settle failure, ignores a superseded retained row after its removed outcome, and leaves reoccupied branch worktrees untouched.",
    "The final close_receipt_recovery run exited 0 for missing history, unreadable history and a prior preview followed by a partial direct finish. Corrupt preserved bytes retain the path and branch, including a second blocked retry; restored bytes let the same helper remove the directory and branch.",
    "The focused WO-133 source-only runtime diagnosis test and release case inventory test each pass. The default refresh callers remain exercised; the added sink receives the announcement.",
    "evidenceSources reports no changed registered source for authority, artifact-identity, verification, feedback or harness. All four edition --check commands exit 0, and harness check verifies 32 generated surfaces. No edition or live episode is fabricated.",
    "npm run release -- prepare --local reports WO-195 target v0.66.1 remains current. npm run publication:check passes after the product 07 receipt/retry write-back and software-engineer source lock refresh.",
    "VER-001 records that the old code identity omitted untracked sources. The three existing code inputs are scripts/lib/worktree-removal.mjs, scripts/test-close-admission.mjs and packages/skeleton/fixtures/wo195-role-baseline.json. Intent-to-add makes them tracked inputs for the repair gate without committing or discarding existing work. The complete required review and document gates remain pending at this decision."
  ],
  "goalAlignment": "The executed failures and passes support D013's critical-path repair and its comparison with all eight traps, Naive Interventionism and NoOp. The additional preview and repeated-blocker cases prevent a clean proxy from replacing disk and branch evidence. Intent-to-add binds authored code to the gate, reducing rule beating without a new workflow. Retaining unchanged checked editions avoids extra compute and historical evidence churn; no saving is quantified.",
  "rejected": [
    {"option": "Re-mint every edition despite unchanged registered inputs", "reason": "Current source registries and all four checks support retaining revision 003; a timestamp change alone is not new evidence."},
    {"option": "Use the original implementation's passing review row", "reason": "The repaired script bytes differ. Criterion 8 requires a complete current review and document gate."},
    {"option": "Treat a would-remove preview as a completed removal", "reason": "A subsequent direct finish can leave a bound receipt and directory; discovery must still recover it."},
    {"option": "Resolve an unbound whole-action settle failure when one directory is removed", "reason": "Its cause can concern another path. Only a blocker explicitly bound to the removed path can be cleared by that removal."}
  ],
  "reopenWhen": "The complete current gate fails, a registered edition source changes, or later close evidence contradicts transcript completeness, surviving-mode restoration or path-specific retry behavior."
}
```

## WO-195-D013 — Repair the retained-output and leftover-retry classes

```json
{
  "id": "WO-195-D013",
  "date": "2026-10-04",
  "dispatch": "resume: fix; VER-001",
  "decision": "Repair F1 and R1-R3 as one bounded batch. Give refreshHarnessRuntime a backward-compatible output sink and pass release close's retained transcript writer. Open only the existing anchored restricted beacon directories while checking/removing a leftover, restoring their original permissions whenever they survive. Recover receipt-bound paths when close history cannot name them; keep the branch while any such unidentified subject remains. Use each path's latest recorded cleanup outcome, exclude paths already recorded removed, resolve only blockers bound to the removed path, and give every retained row an actionable reason. Preserve all existing admission, writer, gate and preservation checks. Retain D001's fixture preparation and decline a second economy experiment.",
  "evidence": [
    "npm run resume --silent -- status --json selected WO-195 in needs-fix with VER-001 fail; npm run resume -- fix recorded RepairRequested and reserved this Codex session's writer.",
    "VER-001 and D012 reproduce F1 and R1 and identify R2-R3 by source reading. Current scripts/release.mjs finishPublishedWorktree gathers all historical rows and resolves blockers by action alone. Its no-release path calls refreshHarnessRuntime, whose announcement bypasses writeOutput.",
    "scripts/lib/worktree-removal.mjs snapshots restricted beacon directories without prepareBeaconDisposal; scripts/worktree.mjs already uses that anchored preparation before preservation and restores permissions on failed removal.",
    "The new readable input scripts/lib/harness-runtime.mjs is the concrete F1 output writer. scripts/test-process-debt.mjs already exercises refreshHarnessRuntime's unchanged default output/build semantics; it and scripts/test-release.sh supply shared regression checks.",
    "The existing removal receipts bind main, work order and absolute subject, with byte proofs checked again before deletion. Receipt discovery will not replace those proofs or authorize disposal from a path alone. Previously removed paths with surviving receipts must stay excluded when close history records their completed outcome.",
    "D001 records the order's sole economy decision; existing release templates and linked-worktree fixtures remain the preparation. No new dependency, live publication, account setting, extra agent or branch commit is needed."
  ],
  "goalAlignment": "Mission and critical path: make the dispatched close finish its recovery without operator rescue and retain all diagnostic output. Policy resistance: keep writer/gate and preservation guards and restore surviving beacon modes. Commons: reuse fixture preparation and add focused failures before the full review. Drift to low performance: a retained row must expose its reason and retry. Escalation: add no phase, refusal or approval loop. Success to the successful: compare the existing anchored beacon helper and receipt lane with broad permission changes or a new recovery log; reuse wins because their bindings already exist. Shifting the burden: the close discovers and finishes proved leftovers itself. Rule beating: add stale no-release, restricted-beacon, multiple-path and unreadable-history cases beyond the quoted reproductions. Seeking the wrong goal: judge removed directories, preserved bytes and complete reports, rather than clean labels. Naive Interventionism: reversible source changes, isolated fixtures and restoration on failure precede the required gate; no host setting changes. NoOp leaves criterion 3 false and the reproduced beacon retry dependent on hand chmod, so bounded repair wins.",
  "rejected": [
    {"option": "Waive criterion 3 or defer the three cleanup findings", "reason": "No waiver was authorized; each has a concrete bounded repair in the selected close surfaces and shares the required checks."},
    {"option": "Intercept process.stdout globally or remove the refresh announcement", "reason": "A local sink preserves existing callers and the complete diagnostic record without changing process-wide output."},
    {"option": "Make every subject directory readable before verifying preservation", "reason": "Only the established anchored disposable beacon lane needs temporary access; broad permission changes would enlarge effects unnecessarily."},
    {"option": "Scan receipts and retry all previously removed paths", "reason": "A completed path can be reused; latest terminal outcomes must prevent historical receipts from attaching unrelated worktrees to this close."},
    {"option": "Delete the branch when no close record names the subject", "reason": "A bound removal receipt can still name a directory on disk. Missing subject identity is not evidence that cleanup completed."}
  ],
  "reopenWhen": "The focused regressions or required review contradict these rules, receipt discovery cannot bind a path safely, or the later live close exposes output or recovery behavior absent from the fixtures."
}
```

## WO-195-D001 — Economy: retain the existing fixture preparation

```json
{
  "id": "WO-195-D001",
  "date": "2026-10-03",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the existing fixture preparation and decline an additional setup refactor.",
  "question": "Would sharing more fixture preparation reduce iteration cost while preserving the prior-version regressions this order requires?",
  "alternatives": [
    "Keep the existing harness and linked-release fixtures",
    "Refactor their preparation into an additional shared template"
  ],
  "observation": "scripts/test-harness.mjs already has a fixture constructor; scripts/test-release.sh already uses verified release templates. A second setup refactor would change the regression harness while its prior-version failures are being established.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "The existing preparation already supplies the required independent cases; a further fixture refactor has no measured benefit and would obscure the baseline comparison.",
  "cost": {
    "wallSeconds": 0.0078013330000000014,
    "tokens": null,
    "commands": [
      "rg -n \"function fixture|release_template|saveReleaseTemplate\" scripts/test-harness.mjs scripts/test-release.sh"
    ],
    "source": "Timed bounded reaffirmation of the existing setup and decline recording; no experiment run. Excludes ordinary order implementation and source reading. Token counters unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "rg -n \"function fixture|release_template|saveReleaseTemplate\" scripts/test-harness.mjs scripts/test-release.sh"
    ],
    "summary": "Keep current preparation; no saving or improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/test-harness.mjs fixture constructor",
    "scripts/test-release.sh verified template preparation",
    "Executor entry harness usage: token counters unavailable"
  ],
  "rejected": [
    {
      "option": "Refactor fixture setup during the regression comparison",
      "reason": "No measured benefit; the setup already has shared constructors/templates and changing it would obscure prior-version failures."
    }
  ],
  "reopenWhen": "Equivalent fixture runs show setup dominates iteration time after the regressions are established."
}
```

## WO-195-D002 — Rebuild before dispatch; prove preservation before disposal

```json
{
  "id": "WO-195-D002",
  "date": "2026-10-03",
  "dispatch": "resume: next",
  "decision": "In the generated session fallback, narrowly recover a release-close prompt from main by rebuilding and re-emitting the installed runtime under the existing writer/teardown lock, then replay the prompt through the normal hook exactly once. Retain normal dispatch and admission checks rather than implementing a second lifecycle or authority evaluator. Use one exported helper-command builder for every script printer. Persist the existing close output beside its retained record and emit a summary. Restore owned directory write permissions only after material preservation; retain a durable byte proof for recovering a directory Git has already unregistered; delete the merged branch once both its registration and directory are gone.",
  "evidence": [
    "packages/compiler/src/harness.ts fallback records only a delegated advisory; packages/skeleton/src/harness-host.ts recordDispatch supplies releaseCloseDispatch only through a normal hook.",
    "scripts/lib/harness.mjs pins an immutable .runtime/harness snapshot; scripts/build.mjs and harness emit are needed to recreate the merged runtime and snapshot without installing dependencies or running a suite.",
    "scripts/worktree.mjs verifies preserved material before Git removal, but prepares permissions only for beacons; scripts/release.mjs judges removal from Git's list alone and deletes a branch only when no subject existed at entry.",
    "scripts/lib/intake-reconciliation.mjs byte proofs are process-local, so a retry after partial Git deletion needs a separately retained verification receipt bound to the original subject path.",
    "WO-178 D012 and D023 identify every divergent retry printer; D013 identifies correction precedence and is a bounded adjacent repair on the admission this order edits."
  ],
  "goalAlignment": "Mission and critical path: remove recurring operator rescue from the existing publication/cleanup prerequisite to a usable independently verified source-to-deliverable loop. Policy resistance: preserve all five refusals and the admission's existing facts; correction state must withhold admission. Commons: short output removes repeated context consumption, with full evidence retained. Drift: completion requires actual disk and branch removal. Escalation: no new phase, scheduler or refusal. Success to the successful: compare rebuilding with a built-in fallback and canonical dispatch reading on their authority and maintenance costs. Shifting the burden: the same dispatched session finishes cleanup and retries. Rule beating: run printer outputs through admission and require prior-version regression failures; Git's list is insufficient. Seeking the wrong goal: judge completed close behavior, not receipt volume. Naive Interventionism: retain material preservation, pinned runtime validation, host permission decisions and idempotent publication; reversible source changes precede isolated fixtures. NoOp leaves the documented stranded dispatch, oversized output and incomplete removal unchanged.",
  "rejected": [
    {"option": "A built-in fallback that duplicates dispatch and admission", "reason": "It would duplicate canonical control and writer policy; rebuilding permits the existing implementation to judge those facts."},
    {"option": "Read a canonical dispatch without preparing runtime", "reason": "The fallback has not recorded that dispatch and the absent pinned snapshot still prevents the normal permission hook."},
    {"option": "Use bootstrap with installation or browser preparation", "reason": "The close needs the installed dependencies and runtime only; additional preparation is unnecessary."},
    {"option": "Admit wrapped commands or add permissions.allow", "reason": "Would weaken exact-command authorization; short output removes the observed incentive to wrap."},
    {"option": "Unseal verification snapshots in their producer", "reason": "The seal is correct during verification and that source is outside this order's behavioral authority."},
    {"option": "Remove an unregistered directory on path alone", "reason": "An absent Git row proves neither preservation nor safe disposal; retain and verify the original proof."}
  ],
  "reopenWhen": "The isolated stale-runtime fixture cannot complete normal dispatch after a guarded build/re-emit, or a verified leftover directory cannot be safely removed without broadening authority."
}
```

## WO-195-D003

```json
{
  "id": "WO-195-D003",
  "date": "2026-10-03",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.66.1, the next patch above the observed release baseline v0.66.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.66.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-195-roles-finish-what-was-dispatched.md"
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

## WO-195-D004 — Correct removal proofs and preserve correction precedence

```json
{
  "id": "WO-195-D004",
  "date": "2026-10-03",
  "dispatch": "resume: next; operator continue",
  "decision": "Stream ordinary file and preserved-destination digests; compare the anchored disposable .control-beacons/ lane by entry kind and size. Withhold release-close admission during a typed correction before considering the exact helper.",
  "evidence": [
    "scripts/lib/paths.mjs classifies .control-beacons as disposable; scripts/test-worktree.sh exercises sparse beacon signal files larger than a single Node Buffer.",
    "The initial pre-removal snapshot treated those sparse signals as ordinary buffered content and failed the broader worktree fixture. scripts/lib/worktree-removal.mjs now uses 64 KiB reads for ordinary byte proofs and size metadata only for the anchored disposable beacon lane. The full worktree fixture passes.",
    "WO-178 D013 requires typed correction to precede destructive admission; the existing release-close fast path bypassed that state. The WO-195 printer fixture proves admission is withheld with a typed-correction advisory.",
    "An initial stdout-capture edit also changed an embedded child cadence probe to call the parent's writeOutput; the child cannot access that function. Its process.stdout.write was restored and release close_completion, close_leftover and material fixtures pass.",
    "Prior-version probes initially reached compatibility/setup failures. The fixture-only compatibility builder, explicit sealed-removal assertion and partial-unregistration stub now reach the intended behavioral failures recorded under regressions/. Host temporary roots are normalized in the filed transcripts."
  ],
  "rejected": [
    {"option": "Read sparse beacon holes into memory or hash their logical multi-gigabyte content", "reason": "These disposable signal bytes are not preserved material; the size is their observed state and reading holes adds cost without preservation evidence."},
    {"option": "Omit ordinary content or preserved-destination digests", "reason": "A leftover directory must still match the preservation proof before disposal."},
    {"option": "Let an exact release-close helper bypass typed correction", "reason": "Contradicts the existing fail-conservative correction duty; adjacent-0001 records this bounded repair."}
  ],
  "reopenWhen": "The anchored beacon lane ceases to be disposable, an ordinary or preserved file cannot be streamed, or a typed correction is admitted by another release-close path."
}
```

## WO-195-D005 — Judge completed behavior and retain the full output

```json
{
  "id": "WO-195-D005",
  "date": "2026-10-03",
  "dispatch": "resume: next",
  "decision": "Retain the full close transcript beside its close record and print the publication, cleanup, branch, blocker/retry and report-path summary. Judge cleanup from both Git registration and the actual directory; the same command safely retries existing publication.",
  "evidence": [
    "bash scripts/test-release.sh --case close_completion measured shell-captured UTF-8 summary sizes: publish 512 bytes, dry-run 763 bytes, retry 347 bytes. Command substitution excludes the final newline; these are isolated fixture measurements, not a prediction for every real close.",
    "The close_completion fixture checks the report path, retained removal proof, preserved saved.txt bytes, a symlink target whose mode stays 0500, removal of the subject directory, same-run branch deletion and its dry-run preview.",
    "close_leftover checks corrupted preserved bytes remain blocked, then proves a valid receipt permits a retry; missing and differently bound receipts keep the directory and branch. Actual blocker and material commands are evaluated through the admission hook.",
    "regressions/results.json records five exit-1 runs against efe62994. Their assertions identify missing stale-runtime dispatch, an unadmitted material command, missing branch-deletion preview, a remaining sealed subject directory and an incorrect removed outcome while the directory exists.",
    "The first real Claude close remains this order's later release-close dispatch from merged main. No live publication or host-classifier observation is claimed by this executor."
  ],
  "goalAlignment": "The isolated outcomes support the critical-path choice in D002: normal dispatch recovers, printed commands admit under their existing facts, and cleanup finishes or reports a proved blocker. All eight system traps, Naive Interventionism and NoOp were compared in D002; current evidence adds no new phase, general allow rule, material disposition or publication authority. Short stdout reduces context use while retaining evidence. Existing moved-main retry refusal remains deferred as the order requires.",
  "rejected": [
    {"option": "Drop detailed output after summarizing", "reason": "Would remove diagnostic and preservation evidence needed by a cleanup retry."},
    {"option": "Claim a live Claude close from isolated fixtures", "reason": "The executor cannot publish this order before its separate review, merge and release-close dispatch."}
  ],
  "reopenWhen": "The first live close contradicts an isolated result or a summary omits an active blocker, admitted retry or retained-report path."
}
```

## WO-195-D006 — Act on the two requested source critiques

```json
{
  "id": "WO-195-D006",
  "date": "2026-10-03",
  "dispatch": "resume: next; operator requested an adversarial subagent and one principal software engineer improver subagent",
  "decision": "Use two read-only consultants with no further delegation, retain the executor as sole writer, and repair their concrete close-path findings before the required review gate. Revise the pending adjacent-0001 item to group these bounded corrections with its existing typed-correction repair.",
  "evidence": [
    "Before spawning, docs/control/budgets.json had subagentCap 20 and harness usage reported zero observed agents, remaining 20 and unknown uncounted remainder. The explicit session fan-out was two consultants and no descendants.",
    "The adversarial consultant reproduced finishPublishedWorktree in memory: a surviving unregistered derivative recorded in a previous cleanup.worktrees row disappeared on retry, which reported clean without attempting removal. The helper now reloads all surviving retained paths; current registration and the existing writer/gate/preservation proof still decide removal. close_leftover now covers primary and detached derivative paths, each with valid, corrupt and missing receipts, and passes.",
    "Both consultants observed a generated 15 s UserPromptSubmit session-hook bound versus four 120 s child bounds and one 30 s replay in recovery. Only that generated project session hook now has 600 s; other hooks keep 15 s. The stale fixture checks the emitted envelope exceeds 510 s and records exactly one dispatch. The current targeted admission suite passes. Real slow-host termination is untested.",
    "The principal consultant found a failed publication surface report set refusal without a blocker. It now records the failing lines and the shared helper retry; surfaceclose checks the actual short stdout. The legacy fixture wrapper consumes only its named retained report and normalizes prior report filenames when comparing detailed surface output. The direct summary expectation uses process.execPath, since command -v node can name a symlink.",
    "Both consultants re-read the applied patch and reported no remaining blocking source finding. The adversarial consultant also exercised valid, missing and registered-path retry behavior in memory. Their confirmations are supplementary source review, not a canonical verifier or final-review dispatch and not executable full-gate evidence.",
    "Formatting and the consultant repairs changed source bytes after initial evidence minting. Select fresh revision 002 for all four deterministic editions, retain the earlier editions, and re-emit the harness bundle before the review gate."
  ],
  "goalAlignment": "The findings concern the same dispatched close and its completion proof, so bounded repair advances D002's critical path. Restoring retained derivative rows prevents drift and an incorrect clean outcome; aligning the hook bound avoids shifting recovery back to the operator; an actionable refusal summary preserves diagnostics while reducing context. All existing admission facts, preservation rules, host decisions and publication boundaries remain the deciding evidence. The two requested readers provide critique without a second writer or a new workflow role.",
  "rejected": [
    {"option": "Treat consultant confirmation as verification or skip the full review gate", "reason": "The operator requested critique; the active executor still owes the work order's executed acceptance checks and separate canonical verification."},
    {"option": "Remove a retained derivative by its previous path alone", "reason": "Current registration, writer/gate state and the bound preservation receipt must still be checked."},
    {"option": "Raise every hook timeout or change host/account settings", "reason": "Only the generated project prompt session hook contains this bounded recovery path."},
    {"option": "Add an additional broad refactor or second economy experiment", "reason": "The concrete fixes fit the named source paths; D001's retained preparation remains sufficient."}
  ],
  "reopenWhen": "Executed fixtures or the first live Claude close contradict a reviewed assumption, or a retained derivative/refusal becomes invisible on a later retry."
}
```

## WO-195-D007 — Complete the feedback carry and console projection

```json
{
  "id": "WO-195-D007",
  "date": "2026-10-03",
  "dispatch": "resume: next",
  "decision": "Complete the selected feedback edition with --carry from WO-184 feedback-003 and regenerate the console's current self-hosted fixture through its existing recorder. Preserve the original live audit and verifier streams by reference; run no new live episode.",
  "evidence": [
    "The first npm test -- --review exited 1 after 3.77 s in feedback-evidence preflight: ENOENT for WO-195/feedback-002/selfhost-audit.jsonl. The dependent suites did not execute.",
    "Correction: I treated feedback-evidence --write as a complete edition refresh. Its source writes only feedback.json; --carry creates the schema-2 edition record naming the existing audit and verifier streams, and refuses if judged behavior changed.",
    "HEAD's current-evidence manifest selected WO-184 feedback revision 003. node scripts/feedback-evidence.mjs --carry docs/evidence/WO-184/feedback-003 passed, reporting only component release labels moved and no live episode.",
    "node scripts/console-fixtures.mjs --record-current-selfhost recorded the selected maturity report and retained live audit/verifier references, then regenerated the selfhost JSON, terminal and HTML projections. This is existing evidence bookkeeping; the console behavior and package version do not change."
  ],
  "rejected": [
    {"option": "Copy historical live logs into the new edition or fabricate a fresh self-host audit", "reason": "The supported carry record preserves provenance and checks judged behavior without rewriting historical evidence."},
    {"option": "Ignore the preflight or report dependent suites as executed failures", "reason": "The gate stopped at an incomplete evidence edition; acceptance still requires a complete passing review gate."}
  ],
  "reopenWhen": "The carry check reports changed judged behavior or the recorded console inputs no longer resolve to their pinned bytes."
}
```

## WO-195-D008 — Preserve historical role oracles and judge the new hook deadline

```json
{
  "id": "WO-195-D008",
  "date": "2026-10-03",
  "dispatch": "resume: next",
  "decision": "Keep SessionStart and UserPromptSubmit binding checks while judging their intentionally different deadlines explicitly. Record a new WO-195 default/opt-out role oracle linked by SHA-256 to the unchanged WO-179 oracle, and preserve the whole historical chain.",
  "evidence": [
    "The review gate's harness-fixtures group passed 153 of 154 tests; WO-133's stale-hook test failed its first comparison because SessionStart has timeout 15 and the prompt session hook now has timeout 600. A targeted run reproduced that exact diff.",
    "The process-debt group also compared those hooks including timeout. Its economy support test still expected the WO-179 planner/release-close hashes. A targeted run reproduced both failures.",
    "Stopped the owned gate through harness evidence --stop before modifying test inputs; the command reported active [] and the stopped gate recorded no complete check.",
    "The hook tests still compare command/type bindings, keep presence hooks separate and assert SessionStart 15 s. The prompt recovery bound is explicitly above its 510 s child budget. Existing stale-advisory deduplication and observer-silence assertions remain.",
    "packages/skeleton/fixtures/wo195-role-baseline.json uses the existing harnessInstallation default/opt-out generator, hashes the complete unchanged wo179-role-baseline.json and records the authorized current role prose. The process-debt test still verifies every historical backlink, both roots and that economy opt-out removes only the executor economy paragraph.",
    "The targeted process-debt hook-wiring and role-oracle tests pass after this correction; the affected stale-hook tests are rerun before the complete review gate. No compiler or product behavior was changed in this bookkeeping correction."
  ],
  "rejected": [
    {"option": "Return the prompt hook to 15 s to satisfy the old equality", "reason": "Would restore the reviewed recovery-budget defect."},
    {"option": "Rewrite WO-179's role hashes or remove the historical oracle check", "reason": "Historical snapshots are evidence; the authorized WO-195 prose needs a separately linked current oracle."},
    {"option": "Treat targeted passes or a stopped full gate as complete acceptance", "reason": "The order still requires a complete passing npm test -- --review row."}
  ],
  "reopenWhen": "The hook bindings differ beyond their intended deadline or a historical/default/opt-out role projection no longer matches its recorded source."
}
```

## WO-195-D009 — Preserve compiler purity and finish the legacy fixture updates

```json
{
  "id": "WO-195-D009",
  "date": "2026-10-03",
  "dispatch": "resume: next; continued required review validation",
  "decision": "Store stale-main recovery as literal generated hook source rather than executable compiler code. Keep the compiler purity tests unchanged. Complete the affected fixture inputs, role assertions, machinery coverage and writer-retention expectation before another complete review gate.",
  "evidence": [
    "The review run passed harness-fixtures and process-debt, then exposed five failed assertions: two skeleton cases, the derived release case, machinery coverage in runner-fixtures and compiler purity. The owned gate was stopped through harness evidence --stop after 821.1 s; active [] was reported and no complete check was recorded. Worktree-integration's interruption was caused by that stop and is not a separate behavioral finding.",
    "Correction: I placed recoverReleaseClose in executable compiler source and emitted it with toString(). The existing WO-008 purity assertion identified its Node and dynamic imports. The intended host-only recovery is now a literal releaseCloseRecovery string, like the surrounding emitted hook text. WO-132 and WO-008 purity checks pass without editing their tests.",
    "After build and harness emit, a byte comparison found the emitted recovery body identical to the prior compiled function body: sha256:f334dffa10c1a415f13fa5fe69f91143bfeeac578443273c93ab992ce223f6b1. The stale-main normal-dispatch fixture passes.",
    "The beacon CLI fixture returned empty refusal stdout. Source inspection showed its minimal skeleton source copy omitted writer-teardown.mjs, which the new worktree-removal import requires. Adding that leaf makes the existing permission/refusal, metadata-only observation, replay and lifecycle-byte checks pass; the refusal assertion now includes stderr for diagnosis.",
    "WO-179's emitted-role assertion still required the release-close sentence WO-195 explicitly replaces. It now checks the authorized completion, exact command, retry, host flow and material rules, plus the planning push/PR authorization. All shared WO-179 rules, both harnesses and both economy settings remain checked. The targeted case passes.",
    "The machinery coverage assertion identified scripts/worktree.mjs as uncovered by harness-fixtures, whose new printer fixture invokes it. Adding that actual input makes the unchanged coverage assertion pass.",
    "The derived release fixture failed its assertion that the writer was gone while a dirty derivative remained blocked. It now requires writer retention, preserves the dirty file, and checks writer release after the fixture removes its own synthetic blocker and the same helper completes a retry. The targeted derived case passes.",
    "Both existing read-only consultants re-read these bounded adjustments and found no blocking defect. The adversarial consultant also parsed the literal recovery source and checked guards, replay input/sentinel, failure withholding and lock release in memory. Neither ran repository tests or wrote files; no additional agents or descendants were used.",
    "The compiler source changed after revision 002, so select fresh revision 003 deterministic editions, preserve earlier editions and re-emit the harness bundle. Feedback judged source remains unchanged; the supported carry retains the original live episode by reference.",
    "A console refresh was started before the background feedback carry finished and failed with ENOENT for the selected audit input. Correction: await that carry's successful completion before the dependent recorder. The rerun recorded the current selfhost projections, and console-fixtures --check matched all five fixture cases."
  ],
  "goalAlignment": "The corrections preserve the original close deliverable and the compiler's existing platform boundary. Literal host source avoids coupling compiler consumers to Node facilities; unchanged purity guards judge that boundary. Current role assertions judge the authorized new prose without rewriting historical oracles. Retaining the writer through a blocker supports the same-session completion goal. D002's comparison with all eight traps, Naive Interventionism and NoOp still applies: no new dependency, authority, phase, material disposition or live-publication claim is introduced.",
  "rejected": [
    {"option": "Allow Node or dynamic imports in the compiler purity test", "reason": "Would weaken the existing compiler boundary to accommodate host-only code that belongs in emitted text."},
    {"option": "Restore the superseded role sentence or release the writer with blocked cleanup", "reason": "Would satisfy historical expectations by undoing this order's required completion behavior."},
    {"option": "Treat targeted passes or the stopped review as acceptance", "reason": "The order still requires a complete passing review gate and document gate."}
  ],
  "reopenWhen": "The emitted recovery body diverges unexpectedly, the unchanged purity guard finds executable host imports, or a required fixture contradicts completed-close behavior."
}
```

## WO-195-D010 — Record the executor's two hard failures

**Hard failure #1: implementation and validation failure by the executor.** I
introduced a compiler-purity regression, treated an incomplete feedback edition
as ready, started a dependent console refresh before its carry completed, and
restarted expensive full reviews before checking all affected assertions. These
errors wasted the operator's time and delayed the required handoff. D007–D009
record the checked failures and corrections. The fourth complete review also
failed: `npm test -- --review` reported 40 passed and 1 failed in 867.82 s, with
failed release cases `prepare`, `stale_helpers` and `success`. Their exact causes
are still being diagnosed. WO-195 remains unfinished.

**Hard failure #2: invented reporting convention by the executor.** I created
`.runtime/wo195-diagnostics/executor-failure.md`, then presented that scratch file
as a failure report without saying that I had invented its name and that it was
provisional. It is not a standard DotLn report path. The operator had to ask
whether it was standard and explicitly required this mistake to be recorded as
failure #2. The established executor surfaces are this decisions file and the
handoff. The scratch receipt is preserved; these numbered judgments belong here
and will be cited by the handoff.

Passing checks later will not erase either hard failure. These are executor
failures, not fabricated verifier/final-review verdicts or lifecycle events.

```json
{
  "id": "WO-195-D010",
  "date": "2026-10-03",
  "dispatch": "resume: next; operator demanded a hard failure judgment and numbered the invented reporting convention as failure #2",
  "decision": "Record both numbered hard failures on the existing decisions surface and cite them from the executor handoff. Preserve the provisional scratch receipt without presenting it as a standard report. Diagnose every failed release assertion before another full review; do not claim readiness without a passing required gate.",
  "evidence": [
    "Operator messages at 18:44:16, 18:49:11 and 18:55:26 UTC requested the hard failure judgment, questioned the scratch path's status and explicitly required failure #2.",
    "The executor skill names docs/evidence/WO-NNN/decisions.md and handoff.md; it does not define executor-failure.md as a report convention.",
    "D007-D009 retain the incomplete edition, dependency sequencing, purity and affected-assertion corrections.",
    "The fourth npm test -- --review completed at 18:55:10.697 UTC with exit 1, 89 fresh tasks, 40 passed suites and 1 failed suite; release cases prepare, stale_helpers and success failed. No ImplementationReady event has been recorded."
  ],
  "rejected": [
    {"option": "Present the scratch filename as a standard DotLn report", "reason": "It was an executor invention; established surfaces must carry the durable judgment."},
    {"option": "Soften or erase these failures after successful checks", "reason": "A later technical pass does not undo the executor's implementation, validation and reporting failures."},
    {"option": "Invent a failed verifier verdict or abandon the order without an operator instruction", "reason": "The current request records executor failures; canonical verification remains a separate role and the authorized implementation task remains active."}
  ],
  "reopenWhen": "New checked evidence changes a specific factual statement; retain both failure judgments and append the correction rather than obscuring them."
}
```

## WO-195-D011 — Finish the detailed-output fixture migration

```json
{
  "id": "WO-195-D011",
  "date": "2026-10-03",
  "dispatch": "resume: next; diagnose the fourth failed review",
  "decision": "Use the existing retained-report reader for the stale-helper and success fixtures that invoke the subject's reviewed script directly, and require the canonical absolute Node helper in prepare. Preserve their detailed intake, manifest, publication, cleanup and retry assertions. Keep the separate summary cases on actual stdout.",
  "evidence": [
    "The completed review at code identity 566c7cea0b22b2cd25df7ae2625ffa735d906c1753536ba45bf434d1dedd2e16 passed 40 suites and failed release; its only failed release cases were prepare, stale_helpers and success.",
    "Three separate bash -x scripts/test-release.sh --case runs reproduced exit 1. prepare failed its obsolete npm run release -- close command expectation. stale_helpers and success failed their first detailed-intake assertions against the new summary stdout; both bypassed the release_close wrapper's retained-report reader.",
    "Fact correction: these three failures were missed fixture migrations, not newly observed publication or preservation failures. The former detailed bytes remain in the retained report named by stdout. The shared reader now also serves the direct subject-script invocations without changing which script they execute.",
    "After the correction, bash scripts/test-release.sh --case prepare, --case stale_helpers and --case success each completed with exit 0. Their intake-byte, stale-main-marker, manifest, same-run branch deletion, publication idempotence and metadata-refusal checks remain in place.",
    "No product source or deterministic-edition source changed in this correction; revision 003 remains selected. A complete passing required review is still outstanding. D010's two hard failure judgments remain unchanged."
  ],
  "rejected": [
    {"option": "Put the detailed transcript back on stdout", "reason": "Would reverse the bounded-output deliverable; the actual summary has its own direct fixtures."},
    {"option": "Remove the detailed assertions or invoke the stale main helper instead", "reason": "Would lose the existing preservation and reviewed-subject bootstrap guarantees."},
    {"option": "Declare readiness from the three targeted passes", "reason": "Criterion 8 still requires a complete passing npm test -- --review row and test:docs."}
  ],
  "reopenWhen": "A direct close fixture cannot resolve its named retained report or the required complete review finds another failure."
}
```

## WO-195-D012 — Verification: fail on criterion 3; three findings to the repair

```json
{
  "id": "WO-195-D012",
  "date": "2026-10-04",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on criterion 3 alone. In a no-release close (the order's version is below the latest release) whose pinned runtime is stale, scripts/release.mjs:2128 calls refreshHarnessRuntime, which writes 'Refreshing pinned runtime (<cause>); npm run build.' straight to process.stdout (scripts/lib/harness-runtime.mjs:199) instead of through writeOutput. That line still reaches stdout ahead of the summary, and the retained full report does not hold it, so the report does not hold what standard output holds today on that path. The other seven criteria are met. Three further findings inside the order's declared surfaces go to the repair's Adjacent Repair: R1, a leftover holding restricted beacon directories can never pass leftover verification; R2, retry bookkeeping resolves unrelated blockers and re-checks every earlier row path; R3, a leftover no retained record names lets the branch be deleted and cleanup read clean.",
  "evidence": [
    "F1 reproduction: a session-scratch copy of scripts/test-release.sh pointed at this worktree's scripts, with one added case. The case pins an old materialized runtime, re-pins to unmaterialized bytes, commits WO-099 at v0.0.2 below v0.2.0 and runs release close WO-099 --publish. The outcome is no-release. The first stdout line is 'Refreshing pinned runtime (pins-differ); npm run build.', and the full report named on stdout does not contain it. A reviewer's independent source reading found the same line and no other direct stdout writer among the scripts/lib modules release.mjs imports.",
    "R1 reproduction (session scratch, real scripts/lib/worktree-removal.mjs): a subject holding .control-beacons/restricted/<64 hex> and a receipt whose snapshot matches it. verifyWorktreeRemoval passes while the directory is 0o700. At 0o111, the mode packages/beacons/src/control-beacon-fs.mjs:149 creates and prepareBeaconDisposal's restore puts back after a failed removal (scripts/worktree.mjs removePreservedWorktree callers), verifyWorktreeRemoval and removeUnregisteredWorktree both throw EACCES at scandir and the subject stays. After a manual chmod 0o700 the same receipt removes it.",
    "R2 (source reading, read-only reviewer, checked by the verifier against the diff): release.mjs finishPublishedWorktree marks every blocker of the matching finish or settle action resolved when any one leftover is removed, so a different row's settle failure loses its reason and retry line in row.blockers and the summary. It also gathers every row path from every previousAttempts entry whatever its outcome, so a path an earlier attempt removed and something later reoccupies (for example another branch's registered worktree) becomes a retained row with no reason.",
    "R3 (source reading): when no retained record names the subject (record unreadable, or the earlier partial removal came from worktree.mjs finish run directly), subjectPath is undefined, subjectRemoved is true, the merged branch is deleted and cleanup is clean while the unregistered directory remains. Its removal receipt under docs/control/local/retained/WO-NNN/ names the path, but nothing reads that lane. The order requires recovery only for a path a retained record names, so R3 contradicts no criterion. Branch deletion in this state predates the order.",
    "Criteria 1, 2 and 4 fixtures pass at the subject. The current WO-195 harness fixtures and the close_completion, close_sealed and close_leftover release cases each fail when run against an efe62994 archive in session scratch, with the stale-main prompt receiving only the pins-differ fallback advisory and no dispatch.",
    "Gates at code identity 37d386a60065d7e18a43612c4ebb1e12981383d612bf595030af92cc2277a56a: the executor's npm test -- --review row (41 suites, recorded 2026-10-03T19:18:25.772Z) covers the 41-suite --review selection, and no non-document file changed after that gate started. This verification's npm run test:docs passed 24 of 24 at 2026-10-04T05:14:47.399Z. git diff --check is clean."
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order's objective is a close that finishes in the dispatched session from a bounded summary. F1 is small in bytes, but it breaks the criterion that the retained report is the whole record. R1 leaves a cleanup that cannot finish without a hand chmod, which is the operator rescue the order exists to remove.",
    "traps": "Rule beating weighs against passing criterion 3 on fixture modes when a reachable publish path contradicts its text. Escalation weighs against failing criterion 4 on R1, R2 or R3, whose clauses each hold: blockers name their paths and nothing unsafe is deleted. Shifting the burden weighs for sending all four to one repair batch with rules, rather than leaving them as report sentences. Drift to low performance is answered by an executed reproduction for F1 and R1. Policy resistance, commons, success to the successful and seeking the wrong goal are unchanged by the verdict.",
    "naiveInterventionism": "The verifier edits no subject source. The reproductions ran in session scratch against the real scripts.",
    "noOp": "Passing would file a false claim that the report holds all of today's stdout, and would leave R1 to surface at a live close as a blocker that cannot clear."
  },
  "rejected": [
    {"option": "Judge criterion 3 met on its publish, dry-run and retry fixtures", "reason": "The no-release outcome is a publish invocation, and the criterion states a property of the retained report, not of the fixtures. The reproduction shows that property false on a reachable path."},
    {"option": "Fail criterion 4 on R1", "reason": "Criterion 4(b) refuses removal when the receipt does not verify and names the path, and that holds. R1 is a liveness gap in how verification reads restricted beacons, not unsafe removal."},
    {"option": "Board R1, R2 and R3 to a later order", "reason": "Each sits in a declared surface (scripts/release.mjs, scripts/worktree.mjs and the new scripts/lib/worktree-removal.mjs), so product 07's Adjacent Repair rule keeps them in this order."},
    {"option": "Repair during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-195 resume: fix. (F1) Every line release close writes during a close reaches the retained report, and stdout carries only the summary. Route the no-release refreshHarnessRuntime line through the transcript, and add a no-release, stale-runtime fixture asserting both. Otherwise the operator waives criterion 3 with npm run resume -- waive 3, naming their words. (R1) Leftover verification and removal read anchored restricted beacon directories the way finish does: restore owner access before the snapshot and restore the mode on failure. A fixture leaves a 0o111 restricted beacon directory behind a partial removal and shows a valid receipt removes it on retry. (R2) A leftover removal resolves only blockers that name that path. Earlier row paths are re-checked only when an earlier attempt left that path retained. A retained row always carries a reason and retry line. (R3) Settle through Adjacent Repair or record a reasoned deferral: a retained removal receipt for the order that names a directory still on disk keeps the branch and a blocker naming the path. Checks: npm test -- --review and npm run test:docs.",
  "reopenWhen": "A repair or an operator waiver settles criterion 3; the repair changes admission, removal or summary behavior that criteria 1, 2 or 4 judge; or a live close shows a leftover blocker that its receipt should have cleared."
}
```

## WO-195-D018

<!-- integration refs/dotln/checkpoint/WO-195/6 -->

```json
{
  "id": "WO-195-D018",
  "date": "2026-10-04",
  "dispatch": "resume: fix; worktree integrate WO-195",
  "decision": "Operator-authorized integration mechanics are complete in the repairing worktree. D019 records the two authored resolutions, linked combined-role oracle, preserved historical bytes, component collision assessment and carried repair source. D020 records the executed passing integrated review and document gates; final review will judge the resulting independently verified subject.",
  "evidence": [
    "refs/dotln/checkpoint/WO-195/6",
    "base 340a67c9797520213345ef6ba9c72bff8df2e0a1",
    "upstream 72bc3ab39608aa5a058fff8337d1584429289893",
    "release preparation: Retimed WO-195: v0.66.1 → v0.66.2 above the observed release baseline v0.66.1. Files changed: docs/work-orders/WO-195-roles-finish-what-was-dispatched.md, README.md, docs/evidence/WO-195/meta.json, docs/final-reviews/WO-195/PR.md. Meter snapshot: docs/evidence/WO-195/meta.json, 3494 bytes. Tag observation: local snapshot only."
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

Integration date: 2026-10-04. Original base: `340a67c9797520213345ef6ba9c72bff8df2e0a1`.
Fetched main: `72bc3ab39608aa5a058fff8337d1584429289893`. Checkpoint: `refs/dotln/checkpoint/WO-195/6`.
Named stash retained: `368d4f69203980a755272bee387a5a76a0807774` (WO-195 integrate 2026-10-04).
Resolved projections: .claude/harness-manifest.json, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-195: v0.66.1 → v0.66.2 above the observed release baseline v0.66.1. Files changed: docs/work-orders/WO-195-roles-finish-what-was-dispatched.md, README.md, docs/evidence/WO-195/meta.json, docs/final-reviews/WO-195/PR.md. Meter snapshot: docs/evidence/WO-195/meta.json, 3494 bytes. Tag observation: local snapshot only.
Carried-forward claims: executor assessment in D019 preserves the six core repair sources byte-for-byte, resolves the selector and role oracle, and checks the retimed component labels. D020 records the complete integrated acceptance checks passing; independent verification and final review retain their separate judgments.
Authored conflicts observed: docs/evidence/current.json, scripts/test-process-debt.mjs.
Affected checks were printed by the command and executed in the complete integrated gates recorded by D020.
