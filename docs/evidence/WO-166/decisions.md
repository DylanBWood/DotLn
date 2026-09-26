# WO-166 decisions

## WO-166-D001

```json
{
  "id": "WO-166-D001",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "Reserve a Codex dispatch writer before its lifecycle event, keep the session observation after the transition, and release the same actor at each role's actual completion. Identify a verified Codex ancestor as owner; otherwise record a pid-less thread owner whose liveness stays unknown.",
  "evidence": [
    "docs/work-orders/WO-166-session-boundaries.md criteria 1 and 2",
    "scripts/resume.mjs dispatch switch and post-switch beginHarnessSessionOnce",
    "packages/skeleton/src/harness-host.ts reserveHarnessWriter and harnessHostProcess",
    "scripts/lib/executor-handoff.mjs executorWriterRelease",
    "docs/evidence/WO-139/decisions.md WO-139-D005",
    "node scripts/harness.mjs writer --show reported reserved:false after this Codex next dispatch"
  ],
  "rationale": "Mission and critical path: make worktree ownership and handoff dependable without operator rescue. Policy resistance, escalation and shifting the burden favor the existing reservation and completion commands over a manual reserve or release step. Commons keeps one writer and two read-only auditors under the session cap of 20. Drift and rule beating require a real npm ancestor-chain fixture and a foreign-holder refusal before the control event. Success to the successful does not preserve the current post-event placement merely because it already measures sessions. Seeking the wrong goal rejects a nominal lock owned by a process that exits with the dispatch. Naive Interventionism keeps Claude's owner selection, the current writer contract, conservative unknown liveness and durable-result-before-release ordering. NoOp leaves the observed unreserved Codex session and its repeated manual recovery.",
  "rejected": [
    { "option": "Reserve by a separate operator or agent command", "reason": "Adds a step that past sessions missed and shifts supervision back to the operator." },
    { "option": "Use the nearest non-shell ancestor or a time lease", "reason": "The nearest process in an npm dispatch exits immediately; a lease can expire while a live session is idle." },
    { "option": "Release before recording completion", "reason": "Another writer could enter before the durable result and final projection." }
  ],
  "reopenWhen": "An executable host chain cannot identify the Codex process safely, a dispatch still appends under a foreign writer, or a completed role leaves its own reservation."
}
```

## WO-166-D002

```json
{
  "id": "WO-166-D002",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the existing harness fixture and final gate sequence; decline a separate economy timing experiment for the new wait command.",
  "question": "Would a separate timing harness for gate waiting save meaningful repeated execution cost?",
  "alternatives": ["Extend the existing harness fixture and run the required product and document gates once at the final subject.", "Build and time a second gate-wait harness before implementation."],
  "observation": "scripts/test-harness.mjs already has isolated gate-marker and writer fixtures, while WO-166 requires the full npm test and documentation gate regardless of a timing result.",
  "budget": { "wallSeconds": 120 },
  "execution": "declined",
  "reason": "A second harness would duplicate fixture preparation and cannot replace either required gate; no credible recurring saving is observed.",
  "cost": { "wallSeconds": 0, "tokens": null, "commands": ["None: separate timing experiment declined before execution"], "source": "No timing experiment run; token cost remains part of the dispatch usage observation." },
  "effect": { "wallSecondsPerOrder": null, "tokensPerOrder": null, "commands": ["node --test scripts/test-harness.mjs", "npm test", "npm run test:docs"], "summary": "Keep the established fixture and gate path; no time or token improvement claimed." },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": ["scripts/test-harness.mjs existing gate fixtures", "docs/work-orders/WO-166-session-boundaries.md criterion 8"],
  "rejected": [{ "option": "Create another timing harness", "reason": "It duplicates setup without a measured benefit or a gate it can replace." }],
  "reopenWhen": "Measured gate development feedback becomes material across orders or the current fixture cannot exercise wait behavior."
}
```

## WO-166-D003

```json
{
  "id": "WO-166-D003",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "Record an ignored outcome for each harness evidence invocation and let evidence --wait use it only with a current-tree check row. The outcome is keyed after deterministic projection preparation, and a missing row exits 2.",
  "evidence": [
    "packages/skeleton/src/gate-evidence.mjs readGateChecks sorts check rows by recordedAt",
    "packages/skeleton/src/harness-host.ts runHarnessEvidenceChecks records npm test and git diff --check separately",
    "scripts/lib/evidence-preparation.mjs refreshes tracked projections before the checks",
    "scripts/test-harness.mjs WO-166 wait fixture covers pass, failed invocation with a newer passing diff row, timeout, and no row"
  ],
  "rationale": "The newest row is the row to print, but it can be a passing diff check after a failed npm test; it cannot alone determine the invocation verdict. The local outcome file preserves that verdict without changing the check, control-event or writer contracts. A missing row is unknown even if a stale sidecar says pass. Capturing the tree after preparation binds the outcome to the same subject as the checks.",
  "rejected": [
    { "option": "Infer the gate result from the newest row", "reason": "A failed npm check followed by a passing diff check would return a false pass." },
    { "option": "Change the checks.json schema or control events", "reason": "The order explicitly keeps both contracts unchanged, and existing consumers need no change." },
    { "option": "Continue following the gate log", "reason": "It has no terminal result marker and repeats the open-ended monitor failure that prompted this order." }
  ],
  "reopenWhen": "A gate writes no check row for a completed result, the outcome and check tree identities differ after preparation, or a waiter reports a pass for a failed invocation."
}
```

## WO-166-D004

```json
{
  "id": "WO-166-D004",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "Assign patch release v0.52.2; reserve the main control-plane worktree for release-close even when its briefing is requested from the merged subject; release only after a successful non-preview close. Select authority WO-166 revision 002 and feedback WO-166 revision 001, carrying the WO-070 live audit with no new episode.",
  "evidence": [
    "git tag --list v0.52.1 showed the local predecessor",
    "scripts/release.mjs close requires the main checkout and --publish performs completion",
    "scripts/test-release.sh surfaceclose and derived fixtures establish failed-close retention, dry-run retention and successful-close release",
    "node scripts/authority-evidence.mjs --write --edition WO-166 --revision 002 passed after the final registered-source correction",
    "node scripts/feedback-evidence.mjs --check verified the carried WO-166 revision 001",
    "node scripts/harness-context.mjs --check measured +313 bytes and unchanged verdicts for every profile"
  ],
  "rationale": "The role writes main during publication and the helper must run there; holding a merged subject's writer would survive into a different checkout and could never be released by the main helper. A failed surface check sets exit code 1 without throwing, so release must test the completion result. Authority revision 001 remains as the earlier immutable observation; the correction minted revision 002. Registered changes do not alter the feedback behavior set, allowing a deterministic carry.",
  "rejected": [
    { "option": "Reserve the subject worktree for release-close", "reason": "The helper runs and releases in main, and may remove the subject before returning." },
    { "option": "Release on any close return", "reason": "A surface-check failure returns normally with exit code 1 and is not completion." },
    { "option": "Rewrite authority revision 001", "reason": "Recorded evidence editions are immutable; the changed source needs a new revision." }
  ],
  "reopenWhen": "A real release-close completion leaves main reserved, a failed close erroneously releases it, a later registered-source edit stales authority revision 002, or final review integrates a sibling edition."
}
```

## WO-166-D005 — compiler release constant correction

```json
{
  "id": "WO-166-D005",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "corrects": "WO-166-D004 evidence-edition selection and the work order's initial re-mint cost",
  "decision": "Correct the compiler's embedded package version and re-mint all four selected evidence editions, carrying the same live feedback audit without a new episode.",
  "error": "I bumped @dotln/compiler to 0.19.2 but left COMPILER_PACKAGE_VERSION in packages/compiler/src/artifact-identity.ts at 0.19.1. I treated the component manifest change as complete release preparation and selected only authority and feedback editions.",
  "evidence": [
    "npm test: 27 suites passed and compiler failed its WO-029 package-version constant test (exit 1, 315.44 s)",
    "packages/compiler/test/artifact-identity.test.ts compares COMPILER_PACKAGE_VERSION with its executing package manifest",
    "scripts/lib/evidence-sources.mjs commonSources includes artifact-identity.ts and all four evidence kinds",
    "packages/skeleton/src/evidence-editions.mjs normalizes the constant as a component release label"
  ],
  "correction": "Set COMPILER_PACKAGE_VERSION to 0.19.2 and rebuild; select authority WO-166 revision 003, artifact identity WO-166 revision 001, verification WO-166 revision 001, and feedback WO-166 revision 002. Carry the same WO-070 live audit through feedback WO-166 revision 001 with no live episode. Keep authority revisions 001 and 002 and feedback revision 001 as immutable earlier observations. Record the corrected cost here while preserving the planning-bound Cost declaration. Re-run the full gate on the corrected subject.",
  "rejected": [
    { "option": "Leave the constant at 0.19.1", "reason": "The compiled package would misstate its own release and the package-version test is correctly failing." },
    { "option": "Edit earlier evidence editions", "reason": "They are immutable records of the earlier subject." },
    { "option": "Run a new live feedback episode", "reason": "The changed constant is a normalized release label and the deterministic carry verifies the same judged behavior." }
  ],
  "reopenWhen": "The corrected full gate fails, an edition check finds behavior drift beyond release labels, or final review integrates a newer source requiring another edition."
}
```

## WO-166-D006 — formatted bundle edition

```json
{
  "id": "WO-166-D006",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "After the documentation gate identified seven edited source files with formatting drift, format those files, rebuild and emit the generated bundle, then select authority WO-166 revision 004. Keep artifact identity and verification at WO-166 revision 001 and feedback at WO-166 revision 002 because their checks still pass.",
  "evidence": [
    "npm run test:docs: format failed on seven named edited source files; 13 other suites passed and seven dependent suites were not run",
    "Prettier formatted the seven named files",
    "node scripts/authority-evidence.mjs --check reported stale WO-166 revision 003 bundle-diff.json after rebuild and emit",
    "node scripts/authority-evidence.mjs --write --edition WO-166 --revision 004 passed",
    "artifact-identity-evidence, verification-evidence, feedback-evidence and console-fixtures checks passed unchanged after formatting"
  ],
  "rationale": "Formatting changed source and generated bundle bytes, so the authority snapshot needs a new immutable revision. The other checks still establish their selected records and do not warrant new episodes or editions. The document gate will run again against the formatted subject.",
  "rejected": [
    { "option": "Rewrite revision 003", "reason": "That revision records the pre-format bundle and remains immutable." },
    { "option": "Re-mint every edition again", "reason": "The other three checks pass on their existing selected records." }
  ],
  "reopenWhen": "A later bundle or registered authority source changes, another edition check fails, or the document gate still finds formatting drift."
}
```

## WO-166-D007

```json
{
  "id": "WO-166-D007",
  "date": "2026-09-26",
  "dispatch": "resume: verify; VER-001",
  "decision": "Fail independent verification and route eight reproduced, repairable defects to resume: fix. Criterion 3 is unmet: node scripts/harness.mjs evidence --wait prints {\"run\":null} and exits 2 for a passed harness-evidence invocation that reused cached check rows while its marker was live at wait start, because scripts/harness.mjs evaluates the recorded-after-start guard before the runId-matched outcome (F1). The release-close dispatch requested from a merged subject reserves main under the subject session's actor and then prescribes a new main session whose completion cannot release it, which contradicts the objective, design bullet 2 and D004's own reopening condition and reproduces the WO-050 VER-001 finding-1 shape in main when the owner is a thread (F2). Six smaller defects in the same surfaces are F3 to F8. Criteria 1, 2, 4, 5, 6 and 7 are met as worded; criterion 8 is judged in the report from this verifier's own gates.",
  "evidence": [
    "docs/verifications/WO-166/VER-001.md findings F1 to F8, each with its reproduction",
    "Scratch reproduction on the real command: a git-initialised root ignoring docs/control/local with an older passing row for its tree, a live gate-run-v1 marker begun by beginGateRun and a recorded outcome {status: passed} for that runId; node scripts/harness.mjs evidence --wait --timeout 5 exited 2 with {\"run\":null} after the marker was released, while the same files with no marker at wait start exited 0 with the row, and a row recorded after the marker start exited 0",
    "scripts/harness.mjs status expression: `!row || !observedAfterStart ? \"no-row\" : outcomeIsLatest ? outcome.status : ...` with observedAfterStart requiring row.recordedAt >= the earliest live marker's startedAt; packages/skeleton/src/harness-host.ts runHarnessEvidenceChecks returns the cached row when findGateCheck finds one for the tree; packages/skeleton/src/gate-evidence.mjs uniqueChecks dedupes an identical row so recordedAt stays old; two independent workflow agents reproduced the same case end to end with two consecutive harness evidence runs on an unchanged fixture tree",
    "scripts/resume.mjs release-close case: reserveCodexDispatch(mainPath) keys main's reservation by sha256(CODEX_THREAD_ID) of the dispatching session and prints, when the dispatch runs outside main, 'start a session in the main checkout and run the reviewed helper there'; scripts/release.mjs close releases through executorWriterRelease(realpathSync(process.cwd())) keyed by the helper process's own CODEX_THREAD_ID; scripts/lib/executor-handoff.mjs throws 'reservation remains' only when the remaining holder is its own actor; scratch reproduction: reserve as session S, run the release closure as session M, main stays reserved by S with alive unknown and M's dispatch is refused",
    "docs/evidence/WO-166/decisions.md D004 reopenWhen: 'A real release-close completion leaves main reserved'",
    "scripts/release.mjs main(): executorWriterRelease is awaited before close(), whose ensureReleaseRuntime builds a missing pinned runtime; scripts/lib/executor-handoff.mjs throws 'Writer release runtime unavailable; completion not recorded' when the runtime is absent and a reservation exists",
    "docs/product/07-execution-guide.md candidate section: new dated paragraph 'WO-166 implementation (2026-09-26, pending independent verification)' and closing sentence 'The branch's implementation evidence and independent reports determine closeout'; the 2026-09-19 paragraph still reads 'Allocated to WO-166'; docs/planning/standard-pass-2026-09-25.md §3: 'The candidate is edited in place in product 07 (no dated paragraph)'",
    "packages/skeleton/src/harness-host.ts releaseHarnessWriterByOperator: 'Writer reservation owner is alive; end that session or pass --force'; writerRefusal names 'writer --release' without --force; scratch reproduction: a live pid-owned holder's dispatch refusal names a release command that itself refuses",
    "scripts/test-release.sh surfaceclose case: exact output equality replaced by grep -Fq with no recorded reason; seed_release_close_writer substitutes a CommonJS adapter over the legacy writer.json layout for packages/skeleton/dist/src/harness-host.js",
    "packages/skeleton/src/loadouts/contributor.ts sessionBoundaries (312 bytes) and product 07 do not say the wait runs in the background under Claude Code; scripts/harness.mjs default timeout 1200 s exceeds the Claude Code Bash tool's 600 s foreground maximum; WO-166 design: 'In Claude Code the command runs in the background so the harness re-invokes on exit'",
    "scripts/harness.mjs evidence action: recordGateOutcome runs inside the finally after 'Final evidence passed.' is printed; a throw there sets exit code 1 for a passed run",
    "Executable evidence on the current subject: node --test scripts/test-harness.mjs 126 pass / 0 fail; node scripts/test-evidence-sources.mjs 5 pass / 0 fail; harness check 31 surfaces; harness-context --check exit 0; four edition checks exit 0; git diff --check exit 0"
  ],
  "rationale": "Mission and critical path: the order's outcome is dependable session boundaries without operator rescue; a wait command that reports no result for a passed gate and a release-close route that leaves main reserved for a session that never completes there both leave the operator rescuing again, which is the failure the order was allocated to remove. Policy resistance: the recorded-after-start guard was added to reject a stale row and now rejects the invocation's own recorded outcome; the fix is to let the runId-matched outcome decide first. Commons: three lenses and one refuter in one batch, no descendants, 4 of 20 admissions; the full product gate was run once because the tree hash had no row after the dispatch's projections and the wait command keys its answer by that hash; it repeated the executor's gate at the same code identity, which the report records as duplicate cost against WO-070 VER-001's correction. Drift to low performance: passing with a known wrong exit in the new command's core logic would normalize a proxy (the fixtures) over the criterion. Escalation: the repairs add no guard, gate or command. Success to the successful: the executor's design is kept; only its ordering, keying and text are corrected. Shifting the burden: routing to repair keeps the fix at the code and the briefing rather than at a later operator terminal. Rule beating: criterion 3's fixture set passes because it never records an outcome over cached rows, and criterion 1's release-close clause passes because both fixtures reuse one session id for dispatch and completion. Seeking the wrong goal: judged against the objective and the cited WO-050 finding, not the fixture count. Naive Interventionism: the verifier edits no implementation or product document; the transitional runtime skew and the synthetic-adapter fixture gap are boarded in D008 rather than widened into this repair. NoOp would ship a wait that a Claude executor running the role text in the foreground cannot complete and a release-close route that reintroduces the leak in main.",
  "rejected": [
    { "option": "Pass and board every finding as a follow-up", "reason": "F1 falsifies criterion 3 in a reachable case on the command this order introduces, and F2 contradicts the objective and D004's reopening condition on the surface this order edits." },
    { "option": "Judge criterion 1 unmet for the release-close role", "reason": "Its fixture clause is met as worded; the cross-session flow is a design gap the briefing prescribes, recorded as F2 rather than by rewriting the criterion." },
    { "option": "Judge criterion 7 unmet for the dated paragraph", "reason": "The behaviour is recorded inside the candidate section, so the criterion's letter holds; the form contradicts the cited planning decision and carries phase text, recorded as F4." },
    { "option": "Route the pre-merge runtime skew and the real-runtime release-close fixture into this repair", "reason": "Both need a linked subject/main pair or a second runtime version to exercise; boarded in D008 with a named follow-up." }
  ],
  "followup": "WO-166 VER-001 repair: F1 in scripts/harness.mjs evidence --wait, when an outcome exists for one of the awaited runIds at the current tree hash, let its status decide before the recorded-after-start guard, and add a fixture that awaits a harness evidence run over cached rows; F2 make the release-close dispatch's reservation releasable by the completion the briefing prescribes (reserve main only when the dispatch runs in main, or require the same session and say so), correct D004 and D001's evidence wording, and keep a thread-owned main from needing an operator release for a completed dispatch; F3 prepare the release-close writer release after ensureReleaseRuntime or refuse with a message naming the unbuilt main; F4 fold the shipped behaviour into product 07's candidate sentences and the 2026-09-19 paragraph without a dated header or phase text; F5 make the dispatch refusal name writer --release --force when the owner is alive and make the operator-release refusal name the holder fields; F6 restore the surfaceclose exact comparison or record why it was weakened; F7 say in the role text or product 07 that the wait runs in the background under Claude Code, or fit the default timeout to the foreground cap; F8 record the gate outcome without letting an I/O failure fail a passed evidence run. Re-mint the editions the changed sources stale and re-run both gates.",
  "reopenWhen": "A repaired wait still exits 2 for a passed invocation whose rows were cached, a release-close completion leaves main reserved, or any of F3 to F8 reproduces."
}
```

## WO-166-D008

```json
{
  "id": "WO-166-D008",
  "date": "2026-09-26",
  "dispatch": "resume: verify; VER-001",
  "decision": "Board up two limits met during verification without routing them to this repair: the release-close completion release is exercised only through a synthetic CommonJS adapter over the legacy writer.json layout in scripts/test-release.sh and a hand-called executorWriterRelease in scripts/test-harness.mjs, never through scripts/release.mjs against the real directory-instance writer protocol in a linked subject/main pair; and a main checkout still running the pre-WO-166 runtime judges a pid-less thread owner dead, because its ownerDead lacked the validPid guard, so a thread-owned reservation written into main by a subject dispatch can be reclaimed by main's older hook until main is rebuilt at close.",
  "evidence": [
    "scripts/test-release.sh seed_release_close_writer and its two call sites; scripts/test-harness.mjs WO-139 fixture releases the release-close reservation by calling executorWriterRelease(root, sessionId) directly",
    "docs/evidence/WO-166/implementation.md: 'An independent verifier must judge the actual current tree, including the release-close fixture's synthetic writer adapter and the main-worktree reservation route'",
    "git show HEAD:packages/skeleton/src/harness-host.ts ownerDead without validPid versus the current ownerDead with it; codexHostProcess returns {source: \"thread\"} when no codex ancestor is found",
    "scripts/resume.mjs release-close case reserves mainPath with the subject worktree's built runtime"
  ],
  "rejected": [
    { "option": "Route both into the F1 to F8 repair", "reason": "A real-runtime release-close fixture needs a linked subject/main pair and publication stubs beyond the current shell fixture, and the runtime skew exists only until main is rebuilt at the first close after merge; both widen the repair." },
    { "option": "Record them only as report sentences", "reason": "A met limit needs a decision and a named follow-up." }
  ],
  "followup": "Planner: add a fixture that drives node scripts/release.mjs close --publish against the real harness-host runtime and the writer/ directory protocol in a linked subject/main pair, covering the cross-session case F2 corrects; and record, in the release-close briefing or product 07, that main's pre-WO-166 hook reclaims a thread-owned reservation until main is rebuilt. Priority: medium.",
  "reopenWhen": "A real release-close leaves main reserved or reclaims a live session's reservation, or the shell fixture's adapter diverges from the runtime's writer protocol."
}
```

## WO-166-D009

```json
{
  "id": "WO-166-D009",
  "date": "2026-09-26",
  "dispatch": "resume: fix; VER-001",
  "corrects": "WO-166-D001 evidence wording and WO-166-D004 cross-session release-close reservation",
  "decision": "Repair VER-001 F1 through F8 within the existing order: prioritize an awaited run outcome over cached-row timestamps; reserve release-close only when dispatched in main and direct the subject handoff to dispatch there; identify an unbuilt main and retained reservation explicitly before close; fold the product write-back into existing sentences; make live-owner release guidance actionable; restore the exact surfaceclose comparison; specify Claude background waiting; and keep outcome-observation failures advisory.",
  "evidence": [
    "docs/verifications/WO-166/VER-001.md F1 through F8 and D007; scripts/harness.mjs rejects observedAfterStart before the run-matched outcome",
    "scripts/resume.mjs reserves main from the subject actor but tells the operator to start a new main session; scripts/lib/executor-handoff.mjs releases only the calling actor",
    "scripts/release.mjs prepares the release callback before ensureReleaseRuntime; the callback reports a generic missing-runtime refusal",
    "scripts/test-release.sh surfaceclose uses a substring comparison; packages/skeleton/src/harness-host.ts live-owner operator refusal omits holder details",
    "The existing D002 experiment declined a separate timing harness; this repair retains that decision and starts no second experiment",
    "This fix dispatch ran successfully with Codex session readback gpt-6-astra, xhigh, CLI 0.157.1; the pre-dispatch writer view was unreserved"
  ],
  "correction": "D001 did not date its reserved:false observation relative to the change. VER-001 inspected the executor journal and found acquisition at the next dispatch and release at completion; reserved:false must not be cited as proof of post-change dispatch behavior. D004 incorrectly assumed a cross-checkout handoff kept one session identity. A subject release-close briefing will leave main unreserved and require the new main session to run the release-close dispatch, then its helper; only that session reserves and releases main.",
  "rationale": "Mission and critical path: dependable role handoffs and gate results remove recurring operator rescue on the path to the source-to-deliverable loop. Policy resistance: use the matching outcome before the stale-row guard and retain the guard when no matching outcome exists. Commons: one writer, no subagents, existing fixtures and required gates; no new timing experiment. Drift to low performance and rule beating: add cached-invocation and cross-session dispatch regressions, preserving exact failure-output checks. Escalation and shifting the burden: keep existing dispatch/completion machinery; do not add a transfer protocol or a manual release to normal completion. Success to the successful: reject the existing subject-reserves-main route despite its prior decision. Seeking the wrong goal: completion must actually free the actor that owns main. Naive Interventionism: retain writer contracts, unknown liveness, failure retention, publication preflight and immutable verification reports. NoOp leaves the reproduced false no-row and stranded main writer.",
  "rejected": [
    {
      "option": "Transfer or force-release the subject actor from the new main session",
      "reason": "Weakens actor ownership and adds a protocol unnecessary when the handoff can dispatch in main."
    },
    {
      "option": "Build release runtime before all release-close preflight",
      "reason": "Changes refusal ordering and build cost; an explicit unbuilt-main refusal with preserved ownership satisfies F3 without changing publication behavior."
    },
    {
      "option": "Remove the cached-row freshness guard entirely",
      "reason": "Without a matching run outcome an older unrelated row must not be reported as the awaited invocation."
    },
    {
      "option": "Expand into D008 real-runtime publication fixture and transitional runtime skew",
      "reason": "Those limits remain on FUP-8cfd3ff52146a016; this repair exercises real dispatches in linked worktrees, but retains the separately boarded publication fixture scope."
    }
  ],
  "reopenWhen": "Any F1-F8 regression persists, a main dispatch fails to release at completion, or the required gates expose a new bounded defect."
}
```

## WO-166-D010

```json
{
  "id": "WO-166-D010",
  "date": "2026-09-26",
  "dispatch": "scope expand: merge main in",
  "decision": "Integrate current origin/main into the repairing WO-166 worktree through worktree integrate, preserving the uncommitted implementation, repair, immutable reports and canonical recovery material. Resolve authored conflicts within the existing behavior and validate the integrated result.",
  "evidence": [
    "Operator instruction: scope expand: merge main in",
    "Local main now includes WO-085 product-document bounds and layout changes; WO-166 has uncommitted implementation and repair changes",
    "scripts/lib/worktree-integration.mjs admits repairing and preserves checkpoint plus named stash before merging origin/main"
  ],
  "rationale": "Mission and critical path: validate the repair against the current shared product and documentation contracts. Policy resistance and rule beating require integration before the final gates. Commons and escalation favor the canonical helper and its projection handling over a second integration procedure. Drift, success to the successful, shifting the burden and wrong-goal risks favor retaining both orders and resolving concrete conflicts, not discarding either side. Naive Interventionism preserves recovery and immutable reports; NoOp leaves the explicitly requested integration undone. The work-order criteria are unchanged, so no planning-bound order amendment is needed.",
  "rejected": [
    {
      "option": "Commit or discard the pending repair before merging",
      "reason": "Canonical integration preserves the uncommitted deliverable without a premature branch commit or lost work."
    }
  ],
  "reopenWhen": "An authored conflict changes the required behavior, a new upstream contract requires repair, or integration cannot preserve both sides."
}
```

## WO-166-D011

<!-- integration refs/dotln/checkpoint/WO-166/6 -->

```json
{
  "id": "WO-166-D011",
  "date": "2026-09-26",
  "dispatch": "scope expand: merge main in; worktree integrate WO-166",
  "decision": "Integrated origin/main at 9cd8465c by fast-forward with no authored conflicts; retained checkpoint and named stash. The helper retimed the unpublished patch from v0.52.2 to v0.52.3. WO-085 adds document validation; existing compiler 0.19.2 and skeleton 0.44.2 patch bumps remain valid against v0.52.2. The eight WO-166 obligations are unchanged and this repair is validated on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-166/6",
    "base 6a5c323df4e2db298ec3ec0b16be61c6374b9cb8",
    "upstream 9cd8465c3ed52d530e1ee55f66d2b4e9c5c060a7"
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

Integration date: 2026-09-26. Original base: `6a5c323df4e2db298ec3ec0b16be61c6374b9cb8`.
Fetched main: `9cd8465c3ed52d530e1ee55f66d2b4e9c5c060a7`. Checkpoint: `refs/dotln/checkpoint/WO-166/6`.
Named stash retained: `d9cb331ea21cbfa6462b3dc79c18b024f80693e6` (WO-166 integrate 2026-09-26).
Resolved projections: docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-166: v0.52.2 → v0.52.3.
Files changed:
  docs/work-orders/WO-166-session-boundaries.md
  README.md
  docs/product/06-roadmap.md
  docs/final-reviews/WO-166/PR.md
Tag observation: local snapshot only..
Carried-forward claims: the order, VER-001 failure evidence and earlier immutable editions retain their recorded subjects. No authored merge changed a WO-166 criterion; the repair changes F1-F8 behavior and receives fresh independent verification after this handoff. Product-document validation added by WO-085 is included in the integrated document gate. Final review still owns its independent acceptance judgment.
Authored conflicts observed: none.
Affected checks: the helper selected npm test -- --review, publication, harness and local release checks. Final executed results are recorded in repair.md; this integration does not supply an acceptance verdict.

## WO-166-D012

```json
{
  "id": "WO-166-D012",
  "date": "2026-09-26",
  "dispatch": "resume: fix; VER-001 F6; integrated main",
  "decision": "Assert the exact release-close surface-failure output including its retained-writer advisory; select authority WO-166 revision 005 after the repaired bundle, retaining the other three passing editions.",
  "evidence": [
    "The focused surfaceclose fixture failed exact equality; its diff shows exactly one added line: Advisory: retained ignored material: docs/control/local/harness/writer.json",
    "release close reports ignored material; the fixture now deliberately seeds a writer, whereas check-surfaces does not report local material",
    "Five focused harness tests pass including real linked-worktree dispatch and cached evidence invocation",
    "authority --check reports stale revision 004 bundle-diff.json; artifact-identity, verification and carried-feedback checks pass",
    "Integrated release surface check passes compiler 0.19.2 and skeleton 0.44.2 against v0.52.2; publication source locks pass"
  ],
  "rationale": "The prior substring test hid an explainable output addition; exact equality with the one known advisory retains full report coverage. Only authority reports drift, so create its next immutable revision and preserve other passing editions, avoiding the unnecessary edition churn already corrected in D005-D006. The role-text addition is 350 UTF-8 bytes, under 400; cold-start verdicts are unchanged.",
  "rejected": [
    {
      "option": "Keep the substring assertion",
      "reason": "It would admit unrelated output differences."
    },
    {
      "option": "Remove the retained-material advisory",
      "reason": "The warning correctly reports preserved fixture material."
    },
    {
      "option": "Re-mint passing editions or run a new live episode",
      "reason": "Their checks establish the existing records and feedback behavior has not changed."
    }
  ],
  "reopenWhen": "Exact report equality fails again, another edition check reports drift, or a cold-start verdict changes."
}
```

## WO-166-D013

```json
{
  "id": "WO-166-D013",
  "date": "2026-09-26",
  "dispatch": "resume: fix; adjacent-0001 after integrated review gate",
  "decision": "Repair four stale process fixtures within the WO-166 boundaries, preserving the historical role-oracle chain and the distinction between writer admission and advisory session measurement.",
  "evidence": [
    "The integrated review gate passed harness-fixtures (226.15 s), then process-debt failed 4 of 96 tests; gate stopped through evidence --stop after 307.7 s with no full check recorded",
    "Focused reproduction: role hashes still compare to WO-161; the unbuilt-runtime test expects a successful Codex dispatch; subsequent measurement-fixture actors encounter the first case writer; the Claude hook fixture inherits the live parent CODEX_THREAD_ID and its refusal regex predates WO-166",
    "VER-001 N2 accepts missing-runtime dispatch refusal because a foreign writer cannot be judged without runtime; criterion 1 requires reservation before any event",
    "Adjacent queue revision 4 records the announcement, async steering opportunity, actor-attested check-in and start",
    "The operator answered Continue within those fixture paths; focused rerun passes all five selected tests (10.72 s)"
  ],
  "rationale": "Mission and critical path: regression evidence must exercise current reservation semantics without depending on the runner host. Policy resistance and rule beating favor testing admission failure separately from observation failure. Commons and escalation keep this one grouped fixture repair with no new runtime behavior or live audit. Drift, success to the successful and seeking the wrong goal require preserving the old oracle and adding the authorized successor, not overwriting history to pass. Shifting the burden removes repeat fixture diagnosis from future sessions. Naive Interventionism limits edits to the named tests and new oracle; NoOp leaves the integrated required review gate failing.",
  "rejected": [
    {
      "option": "Change runtime to allow unreserved Codex dispatch again",
      "reason": "Violates WO-166 criterion 1 and the verified missing-runtime admission decision."
    },
    {
      "option": "Erase the old role snapshots or remove hash assertions",
      "reason": "Loses the historical comparison; a new linked oracle retains it."
    },
    {
      "option": "Let session-entry cases share the first actor reservation",
      "reason": "They are independent synthetic sessions; each must release its own fixture writer."
    }
  ],
  "reopenWhen": "The updated process fixtures still fail, a refusal appends lifecycle state, observation failure is tested before writer admission, or historical snapshot bytes change."
}
```

## WO-166-D014

```json
{
  "id": "WO-166-D014",
  "date": "2026-09-26",
  "dispatch": "resume: verify; VER-002",
  "decision": "Pass independent verification of the repaired WO-166 subject: the eight VER-001 findings are repaired and all eight acceptance criteria are met. By the operator's selection, board three minor defects met during verification under one follow-up instead of another repair cycle. First, at the WO-166 close itself, a pulled main whose built runtime predates the merge lacks reserveCodexDispatchWriter, so a Codex release-close dispatch there would fail before any event with a TypeError after the pins-differ advisory (inference from code; not executed). Second, product 07's resume: release close row still says the exact helper command is projected by resume release-close, which the subject projection no longer prints. Third, a Codex dispatch whose per-session observation log is not a regular file is refused before its event, after acquireHarnessWriter has placed its reservation, because record() throws; an immediate retry by the same session is admitted. A candidate finding that the repaired subject briefing's main-session dispatch fails in a stale main is withdrawn: release close runs only in an up-to-date main.",
  "evidence": [
    "docs/verifications/WO-166/VER-002.md criteria 1 to 8 and the F1 to F8 re-checks",
    "Operator selection in the VER-002 session: record pass with a named follow-up rather than failing back to resume: fix",
    "Operator statement in the VER-002 session: release close cannot run unless main is up to date, because otherwise main would not know which work order is being closed; the release-close skill begins by verifying main and running resume status there",
    "scripts/resume.mjs reserveCodexDispatch destructures reserveCodexDispatchWriter from the built harness-host.js and calls it; the main checkout's packages/skeleton/dist/src/harness-host.js (built 2026-09-26 14:18) contains no reserveCodexDispatchWriter; git show HEAD:packages/skeleton/src/harness-host.ts contains none; no Git hook or core.hooksPath rebuilds main after a pull; scripts/lib/harness-runtime.mjs reportHarnessRuntime prints an advisory and continues",
    "docs/product/07-execution-guide.md resume: release close row: 'run the exact cd <main> && node <main>/scripts/release.mjs close WO-NNN --publish command projected by resume release-close or printed by worktree publish'; scripts/resume.mjs release-close case now prints the helper only when dispatched in main",
    "Scratch probe against the built runtime: with the session's .jsonl observation log replaced by a directory, reserveCodexDispatchWriter threw 'Host observation log is not a regular file', harnessWriterView still reported the reservation by that actor, and a second call by the same session was admitted; packages/skeleton/src/harness-host.ts acquireHarnessWriter calls placeWriterInstance, appendWriterEvent, then record(); scripts/test-process-debt.mjs WO-153 case now reserves before breaking the log, with the comment 'a broken journal before reservation now correctly refuses the dispatch itself'"
  ],
  "rationale": "Mission and critical path: the order's outcome, dependable session boundaries without operator rescue, holds on every judged criterion; the three defects fail before any lifecycle event and have a working route (rebuild main, the helper printed by worktree publish, or a retry). Policy resistance: another repair cycle for three narrow items would add oscillation the operator has already named. Commons: one refuter agent, 1 of 20 admissions; the product gate is the executor's row at the unchanged code identity, not a duplicate run. Drift to low performance and rule beating: the defects are recorded with evidence and a named follow-up rather than hidden behind met criteria. Escalation: no new guard or gate. Success to the successful: the repaired design is kept. Shifting the burden: the follow-up names the fix location so it is not rediscovered at release close. Seeking the wrong goal: judged against the objective, not fixture counts. Naive Interventionism: the verifier edits no implementation or product document. NoOp would leave the defects unrecorded.",
  "rejected": [
    { "option": "Fail back to resume: fix for these items", "reason": "The operator selected pass with a follow-up; every criterion is met, each defect fails before any event, and D008 already boards the same transitional runtime skew." },
    { "option": "Keep the stale-main briefing finding", "reason": "Withdrawn as a verifier misreading: the helper's own fetch and fast-forward and a shell fixture that starts main behind origin were read as the operator's practice. They are defensive steps, not evidence that release close runs in a stale main, and the operator states that it never does." },
    { "option": "Record the defects only as report sentences", "reason": "A defect met and not fixed needs a decision and a named follow-up." }
  ],
  "followup": "Planner: in the next order that edits scripts/resume.mjs or the release-close handoff, (a) make a Codex release-close dispatch in a main whose built runtime lacks reserveCodexDispatchWriter refuse with a message naming node scripts/bootstrap.mjs instead of a TypeError, or state in the release-close briefing that main is rebuilt after pulling the WO-166 merge; (b) update product 07's resume: release close row to the main-session route (dispatch in main, then its helper in the same session); (c) decide whether a per-session observation-log failure during Codex writer acquisition should stay a refusal or become an advisory with acquisition journaled in writer-events, and correct the WO-153 fixture comment to match. Priority: low.",
  "reopenWhen": "A Codex release-close dispatch in main fails after main's runtime is rebuilt, a refused dispatch appends a lifecycle event, or an observation-log failure strands a reservation its own session cannot reclaim."
}
```

## WO-166-D015

```json
{
  "id": "WO-166-D015",
  "date": "2026-09-26",
  "dispatch": "resume: final review; FINAL-001; the printed session scratch path is never created",
  "decision": "Board, at high priority, a defect this review met in use and WO-166 did not introduce: the harness tells every role session to use a DotLn session scratch path that nothing creates. harnessSessionScratch only computes <system-temp>/dotln/<session key>/scratch; the role-dispatch briefing, the Codex begin result, the session-scratch grant judgment and harness scratch print, return or judge that path, and none creates the directory. This review's first product-gate command redirected its log there; the redirect failed on the absent directory, npm test never started, and the reviewer's own trailing echo made the background task report exit 0. The reviewer caught it by the sub-second return and reran the gate without a redirect, so no false gate evidence was recorded. The operator states that sessions keep reporting the same absence and directs that a write is never attempted against a scratch directory that does not exist. WO-166 is not failed for it: no criterion reads the scratch path, the outside-write grant checks are a declared non-goal, and the helper and its call sites are unchanged by this order.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts harnessSessionScratch: join(tmpdir(), \"dotln\", digest(sessionId), \"scratch\"); its call sites are the role-dispatch additionalContext line that says to use the path for temporary work, beginHarnessSession's returned scratch, the session-scratch case of the outside-write grant roots, and scripts/harness.mjs scratch; none calls mkdir",
    "scripts/test-harness.mjs WO-144 outside-write case: asserts the permission hook allows a write under the scratch path, then the test itself runs mkdirSync(scratch, { recursive: true }) before writing; no fixture asserts that the directory exists after a dispatch",
    "git log -S harnessSessionScratch -- packages/skeleton/src/harness-host.ts: introduced by 904f8944 on 2026-09-19 (WO-144); git diff HEAD on this subject does not touch the helper or its call sites",
    "This session, after the final-review dispatch printed the path: ls of the session's directory under <system-temp>/dotln reported no such file or directory while the parent dotln directory existed; the first background gate task returned in under one second with the shell's no such file or directory and the wrapper's exit 0",
    "docs/evidence/WO-144/decisions.md D001 and D004 decide a DotLn-managed session scratch convention and its exposure at dispatch and through the CLI; a search of both records found no decision that creates the directory and none that declines to",
    "docs/evidence/WO-158/decisions.md D028 item (a), FUP-6996e331536d4389, deferred: a granted root replaced by a symlink carries the grant to its target, for session-scratch and host-scratchpad alike",
    "Operator direction in this session, paraphrased: a session must never be able to write to a scratch directory before it exists, and creating it is not optional"
  ],
  "rationale": "Mission and critical path: a role session that is handed a path and told to use it should not spend a turn, or lose a command, discovering the path is absent; that is recurring operator attention the mission moves into machinery. Rule beating is the material lens: the only fixture creates the directory itself, so the gate proves the write is permitted and never that the directory exists. Shifting the burden: every session improvises its own mkdir or falls back to another root, and the operator hears the same report each time. Policy resistance and escalation: creating the directory at the point of printing adds no step and no guard. Tragedy of the commons and drift are immaterial: one mkdir per dispatch. Seeking the wrong goal: the standard is that a printed path is usable, not that a grant row exists. Naive Interventionism bounds this review: the fix changes harness-host.ts, a registered evidence source, so it re-mints editions, changes the code identity the verifier and this review's gate judged, and would ship runtime code no verifier has seen; it belongs to an order, not to a reviewer's correction. NoOp leaves the defect recurring in every role session.",
  "rejected": [
    { "option": "Create the directory inside this final review", "reason": "It edits a registered source after independent verification, stales the selected editions and the product gate's code identity, and exceeds the non-substantive corrections a final review may make." },
    { "option": "Fail WO-166 back to repair for it", "reason": "No WO-166 criterion depends on the scratch path and the outside-write grant checks are a declared non-goal; the operator can still expand scope, which routes through repair and new verification." },
    { "option": "Fold it into FUP-6996e331536d4389 without a record of its own", "reason": "That row is deferred at medium priority on the symlink class; this defect is met in ordinary use by every role session and needs its own priority and fixture." }
  ],
  "followup": "Planner, high priority, the next order: the harness creates the session scratch directory (mode 0700, a real directory owned by the session user, never a symlink) at every point it prints or returns the path (the role-dispatch briefing in the Claude hook, beginHarnessSession under Codex and harness scratch), so a printed path always exists; a creation failure prints one advisory naming the path and the cause and never blocks the dispatch; a fixture drives a real dispatch and asserts the directory exists without creating it itself, and the WO-144 fixture's own mkdirSync is removed. Settle WO-158 D028 item (a) (FUP-6996e331536d4389) in the same change, because both fix the same root.",
  "reopenWhen": "A role session reports the printed scratch path absent after the fix lands, or a second order closes without the fix."
}
```

## WO-166-D016

```json
{
  "id": "WO-166-D016",
  "date": "2026-09-26",
  "dispatch": "resume: final review; FINAL-001; standing text silent about the Codex dispatch reservation",
  "decision": "Board three standing sentences outside the order's write-back duty that remain true for the path each describes and are silent or stale about the behaviour WO-166 ships. None fails a criterion: criterion 7 names product 07's stale-writer candidate, which records the behaviour in place, and criterion 5 names the two role sentences, which are present once in every skill. (a) The five-refusals paragraph generated from packages/compiler/src/harness.ts into CLAUDE.md and every role skill says Codex carries the duties as role text without automatic enforcement, while the same skills now say a Codex lifecycle dispatch reserves the writer, and the dispatch refuses a foreign holder before any event. (b) Product 02's writer paragraph describes the owner as the declared harness pid or the nearest non-shell ancestor of the hook and the refusal as naming the actor key and host process; it names neither the codex-host and pid-less thread owners a dispatch records nor the owner, reservation time, age and release command every refusal now carries. (c) Product 07's work-order index paragraph names implementation-ready and repair-complete as the completions that release the Codex writer; verification-result, final-review-result and a successful release close now release too.",
  "evidence": [
    "packages/compiler/src/harness.ts line 1046 and CLAUDE.md line 62: 'Claude hooks enforce these five refusals at observed boundaries; Codex carries the duties and grants as role text without automatic enforcement'; unchanged by this order's diff",
    "scripts/resume.mjs reserveCodexDispatch before appendTransition in verify, fix and final-review, in next when the phase is active and in release-close when dispatched in main; this review's probe of reserveCodexDispatchWriter against a live and a thread-owned foreign holder, both refused",
    "docs/product/02-domain-model.md lines 876 to 879 and 898 to 901 on this subject; packages/skeleton/src/harness-host.ts codexHostProcess and writerRefusal",
    "docs/product/07-execution-guide.md lines 334 to 338 on this subject; scripts/resume.mjs executorWriterRelease at verification-result and final-review-result; scripts/release.mjs close",
    "docs/product/07-execution-guide.md section Documentation freshness and ownership: the executor updates affected blueprint facts in the same pass; final review may make only non-substantive corrections and material mismatches return through repair",
    "docs/evidence/WO-166/decisions.md D014 item (b), FUP-b537eae489004287: product 07's release-close row is boarded as the same class"
  ],
  "rationale": "Mission and critical path: a reader of the blueprint should meet the Codex writer boundary once and consistently; the role sentence and the candidate already state it, so no session is misdirected today. Drift to low performance and rule beating: the freshness duty is the standard, and recording the gap keeps met criteria from hiding it. Policy resistance: item (a) sits beside the new role sentence in the same skill, the one place the two statements can be read as disagreeing. Naive Interventionism bounds this review: item (a) edits a registered source and re-mints editions; items (b) and (c) edit product documents under byte ceilings and move both publication locks after the product gate and independent verification; none is a non-substantive correction. Commons, escalation, success to the successful, shifting the burden and seeking the wrong goal are immaterial: three in-place sentence edits, no new step, no operator rescue. NoOp leaves three sentences that understate shipped behaviour until a reader or a planning pass trips on them.",
  "rejected": [
    { "option": "Judge criterion 7 unmet", "reason": "The criterion names the stale-writer candidate and the register rows; the candidate records the shipped behaviour in place." },
    { "option": "Edit the three sentences inside this final review", "reason": "One is generated from a registered source and two are product documents under ceilings and publication locks; the edits exceed a final review's non-substantive corrections and would follow the product gate." },
    { "option": "Record them only as report sentences", "reason": "A defect met and not fixed needs a decision and a named follow-up." }
  ],
  "followup": "Planner, low priority, with FUP-b537eae489004287 item (b) in the next order that edits the writer text or the release-close handoff: edit in place (a) the five-refusals sentence in packages/compiler/src/harness.ts so it says a Codex lifecycle dispatch reserves the writer and refuses a foreign holder while Codex tool calls remain unhooked, and regenerate; (b) product 02's writer paragraph so it names the codex-host and thread owners and the fields a refusal carries; (c) product 07's work-order index paragraph so it names every completion that releases.",
  "reopenWhen": "A session acts on one of the three sentences against the shipped behaviour, or the next order that edits the writer text closes without them."
}
```
