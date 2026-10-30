# WO-239 decisions

## WO-239-D001 — Remove the startup prune preview under operator direction

```json
{
  "id": "WO-239-D001",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator-directed startup correction",
  "decision": "Remove the temporaryPruneSummary call from worktree start and correct product 07 and the kit README. The operator directed: remove it; it definitely doesnt belong in worktree start. The authorized correction concerns the startup preview only. Automatic pruning, the planning preview and the update preview retain their existing behavior. Continue the original WO-239 execution after completing this correction.",
  "evidence": [
    "scripts/worktree.mjs awaited temporaryPruneSummary(mainPath) after ensureClean and before reading pending receipts or creating the worktree. scripts/lib/temporary-prune-summary.mjs invokes pruneHarness with its default global scope and apply false.",
    "WO-233-D046 explicitly deferred changing the global startup census and named startup cost affecting an order as a reopening condition. The operator now reports a 0 h 10 min startup delay and expressly rejects this placement; that duration is operator-reported, not independently profiled.",
    "The worktree fixture substitutes a preview function that throws if invoked. The unchanged startup implementation fails the bounded fixture at the malformed-receipt case with worktree start must not invoke the prune preview, before any worktree is created. Both baseline attempts exit 1; a traced repeat confirms this failure source.",
    "The first changed-tree invocation passes startup but later fails with Codex writer reservation unavailable because the executor incorrectly ran the fixture with its live session environment. The corrected bounded invocation uses scripts/lib/suite-evidence.mjs suiteEnvironment, as the canonical runner does. The entire bash scripts/test-worktree.sh script then prints worktree tests passed and exits 0 at 2026-10-29T14:36:16.575Z, including the preview-throwing startup case and all existing publication, preservation, close and Beacon cases. This is bounded fixture evidence, not a complete review row.",
    "npm run publication:check initially reports the software-engineer edition source lock stale after the product paragraph changes. Refreshing that lock from scripts/check-publication.mjs --print-locks restores a passing publication check. npm run meta refreshes the decision index; git diff --check passes.",
    "Same-day correction: the executor misread the request for an explanation before edits as a continuing pause on the whole order and stopped after the startup correction. The operator objected to the idle session. The original resume: next still authorizes WO-239, so execution continues in the same owned worktree without repeating dispatch."
  ],
  "rejected": [
    "Keeping the synchronous census contradicts the operator correction.",
    "Hiding the output would retain the startup work and its delay.",
    "Moving or adding a preview elsewhere would choose a destination the operator left undecided.",
    "Changing deletion, ownership or retention rules is unnecessary for removing an informational startup call."
  ],
  "reopenWhen": "A worktree start invokes the prune planner again, or the operator explicitly chooses another placement for the removed preview."
}
```

## WO-239-D002 — Finish the three reviews before the complete run

```json
{
  "id": "WO-239-D002",
  "date": "2026-10-29",
  "dispatch": "resume: next; permanent operator correction",
  "decision": "All three required execution/fix reviewers finish, and their findings are resolved or recorded, before the complete run starts. They are not restarted after a successful complete run. Final handoff write-backs belong to the executor. Apply this now and permanently to the Contributor source, emitted role guidance and product 07.",
  "evidence": [
    "The operator directed: i don't want any of the 3 required reviewer subagents to be active after a successful full gate run, or if they are, none of their findings should cause a change that would necessitate a new full gate run; then: make that a permanent change.",
    "Contributor executor step 9 and product 07 previously required the same consistency reviewer to check final write-backs after a passing complete run. That ordering could introduce a new source change after validation."
  ],
  "rejected": [
    "Leaving reviewers active after success requires a second class of post-gate findings and can trigger another complete run.",
    "Dropping an unresolved acceptance defect to preserve a passing gate would defeat evidence before claims. Review findings are resolved before the run instead."
  ],
  "reopenWhen": "The operator changes the timing rule or a required reviewer remains active or restarts after the successful complete run."
}
```

## WO-239-D003

```json
{
  "id": "WO-239-D003",
  "date": "2026-10-29",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.102.1, the next patch above the observed release baseline v0.102.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.102.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "patch classification declared in docs/work-orders/WO-239-release-close-prepares-before-it-loads-and-runs-once.md"
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

## WO-239-D004 — Patch the role package and preserve the oracle history

```json
{
  "id": "WO-239-D004",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator correction recorded in WO-239-D002",
  "decision": "Bump skeleton from 0.72.0 to 0.72.1 for the bounded Contributor guidance change, updating the console's exact dependency and lockfile entries. Preserve compiler 0.33.0 and console 0.5.0 because their source behavior did not change. Emit both skill roots and mint wo239-role-baseline.json with wo234-integration-role-baseline.json as its byte-exact parent, retaining its recovery and upstream chains. Re-mint the deterministic Contributor authority edition through sync.",
  "evidence": [
    "The order classifies these backward-compatible close and role changes as patch. release prepare --local assigned application v0.102.1 above v0.102.0 in WO-239-D003.",
    "The independent consistency reviewer identified the skeleton source change, console workspace pin and lockfile as one version obligation. Product 10's component rule and release.mjs compare changed component source with the previous release.",
    "harness-context-before.json and harness-context-after.json measure both installed roots. Executor: 32,292 to 33,817 UTF-8 bytes, growth 1,525, effective ceiling 34,953 and remaining headroom 1,136. This includes the timing and consistency-brief corrections in WO-239-D007, D010 and D011; the intermediate measurements were 32,732 and 33,099. Release-close: 19,992 to 20,093, growth 101, ceiling 21,266. The other four role totals do not change. Both roots have the same totals. These are measured bytes, not estimated tokens.",
    "The new oracle pins default and economy-opt-out role bytes from harnessInstallation. Process-debt and gate-followups retain digest checks through the historical, branch and upstream chains, and the current costs start at the immediately preceding oracle's bytes.",
    "The permanent pre-gate review rule is asserted by the role regression and pinned by the oracle; no post-pass consistency-review instruction remains in the emitted executor guidance."
  ],
  "rejected": [
    "Rewriting the prior oracle would erase the reviewed history.",
    "A compiler or console source version bump would imply a source change those components do not contain.",
    "Trimming reviewed duties to fit a smaller prompt is unnecessary: both changed roots remain within their effective ceilings."
  ],
  "reopenWhen": "Changed component source, workspace pins, emitted role bytes or measured cold-start totals no longer match this evidence."
}
```

## WO-239-D005 — Prepare before import, preserve proof, and measure owned work

```json
{
  "id": "WO-239-D005",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Extract source-only close prerequisites, including main synchronization, before child runtime preparation and any built import. Later runtime sites assert freshness. Accumulate exclusive timings in seven stable rows, including writer retirement/session cleanup in prune. Scope the close census to its captured order roots, main's retained lane and checkout-owned temporary registrations. Keep compact counts/digests on the advisory and removal receipt, with a digest-bound full inventory sidecar in the same lane and paths behind --list-material. Guard integration with the existing host lane observation, and resolve the phase's actual incoming ref before its no-op check.",
  "evidence": [
    "release.mjs imported executorWriterRelease before its in-close ensureReleaseRuntime calls; executor-handoff imports harness-host.js, which loads compiler modules. Source-only buildFreshness and harnessRuntimeCause can decide preparation without that import. The paired stale-compiler control records the baseline export/prediction mismatch and a first-invocation successful refresh at the changed helper.",
    "The design reviewer recommended extracting prerequisites before preparation, one finally-based exclusive timer, and a digest-bound inventory sidecar to preserve retry semantics. The sidecar reader validates its exact lane-relative content-addressed filename, byte digest and summaries before using it; legacy inline arrays still verify.",
    "The criteria reviewer identified a second path list from renderIntakeReconciliation during worktree finish. Retained-control rendering now defaults to compact output and finish/settle propagate --list-material. Ordinary intake reconciliation retains its existing path display.",
    "The criteria reviewer identified writer retirement/session cleanup outside every timing row. That completion now runs inside prune; the real-writer fixture adds controlled session-cleanup work and checks it is measured.",
    "The first new integration no-op used local main in every phase. The criteria review showed that repair/final review could then miss a newer origin/main. Those phases now fetch and resolve origin/main once before preservation; active execution keeps the existing local-main behavior. A regression keeps local main stale while origin advances.",
    "A close captures the closing worktree's temporary registration tokens before removal destroys its ledger. Discovery admits a captured path only while its owner token and repository still match. Existing ownership, liveness, retention and final deletion checks remain in the prune.",
    "The final criteria review found the same binding was missing from main's existing registration arm: a stale ledger could admit a reused foreign path. Close scope now checks the current token and physical repository for registered and captured roots alike; global discovery is unchanged. Controls cover the foreign replacement, the captured root after its checkout/ledger is gone, and a changed captured token.",
    "plan failures keeps older close counts and summarizes the latest eight attempts with valid steps and total wall-clock endpoints. Skipped rows are explicit zero-duration rows; repeated steps accumulate and nested time is charged only to its own step."
  ],
  "rejected": [
    "Moving one import or cache-busting its URL cannot reliably replace the wide in-process compiler graph.",
    "Caching a global census would reuse a stale ownership observation; scoped fresh discovery is sufficient.",
    "Dropping the detailed inventory would break byte-proven removal retries; leaving all paths inline would keep oversized records and transcripts.",
    "A new gate-running flag would duplicate the existing host lane state.",
    "A no-op based only on local main in repair/review would silently change which upstream the lifecycle integrates."
  ],
  "reopenWhen": "A close imports built code before preparation, a scoped prune loses an owned candidate, a compact receipt weakens preservation proof, timings omit owned work, or integration skips an incoming upstream commit."
}
```

## WO-239-D006 — Keep the paired controls and their limits

```json
{
  "id": "WO-239-D006",
  "date": "2026-10-29",
  "dispatch": "resume: next",
  "decision": "Use the order's paired runtime and integration experiments, and explicit census/output measurements, as controls. Keep failed fixture setup observations with their corrections. Treat production close duration as unmeasured until a real close records steps; do not turn the filing pass's estimate into a performance claim.",
  "evidence": [
    "controls.json records both stale-compiler exit codes: baseline 1 with the exact export/compiler mismatch, changed helper 0 with starter refreshed in one publish invocation and child build observed before parent dist loading. The baseline also encountered an unrelated live-lane prune refusal; its separate starter refusal remains the expected negative control.",
    "The final-review integration baseline executes one real stash push before the observer stops it, exit 1; the changed helper exits 0 without a stash or scratch allocation and keeps untracked bytes. Active and repairing no-ops and the stale-local-main/advanced-origin regression also pass. A fixture-local process-reader correction was required before both lane guards passed.",
    "The close census reads zero of 1,000 foreign gate-fixture owner files; explicit all scope reads all 1,000. The driver was corrected to bind each synthetic root's device and inode and clean those roots by token. Existing suite negative-cleanup roots keep their deliberate retention behavior.",
    "The 2,000-file control checks the full retained transcript, not just stdout. Its advisory is 198 bytes and removal receipt 995 bytes; paths appear with --list-material. Proof tests retain legacy inline compatibility and reject missing, altered, misbound and symlinked inventory.",
    "The design reviewer found an interruption-recovery defect in direct writes to a permanent digest filename. Publication now uses an exclusive preparation sibling and atomic no-clobber link; failed writes cannot poison the permanent name. The reviewer rechecked and closed its one finding as fixed; the proof fixture exercises interruption then retry."
  ],
  "rejected": [
    "A green summary without inspecting the retained transcript would miss the original oversized path list.",
    "A no-op observed only after cleanup would miss a transient stash or scratch allocation.",
    "NoOp leaves the observed stale compiler, needless preservation and global close census in place.",
    "A passing bounded fixture is not a complete review gate. The current complete run remains required."
  ],
  "reopenWhen": "A control stops exercising its named mechanism, the full gate exposes an acceptance defect, or a real close's step timings disprove the expected reduction in work."
}
```

## WO-239-D007 — Recheck each new code batch with the same three workers

```json
{
  "id": "WO-239-D007",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator correction after the failed complete run",
  "decision": "After any new set of code changes, restart all three existing reviewers on the current diff and finish their rechecks before the next complete run. Put that requirement in the general executor duty and directly in its failed-gate repair step, and assert both emitted instructions in the role regression. Preserve ordinary-edit continuity and the successful-run handoff rule. Reuse the same three workers in this execution; do not substitute earlier completed judgments for review of the repair.",
  "evidence": [
    "The operator directed: the 3 reviewers need to restart after any new set of code changes. The operator also rejected treating ordinary edits do not expire reviews as a conflict: continuing the same workers and restarting their review of a new batch are compatible.",
    "The first complete run failed in declarations at 2026-10-29T15:18:36.095Z. The executor's next-step announcement omitted restarting all three after repair. Its explanation then incorrectly blamed the rule about a successful run, which did not apply to this failed run. No successful complete row existed and no permanent guidance was changed on that explanation before the operator stopped it.",
    "The executor treated no stop as a halt and resumed when the operator objected to idleness. The subsequent explanation again overreached by calling ordinary-edit continuity a conflict. The correction is to recheck the new code batch with the same workers, not to discard their assignment after each edit.",
    "The source executor failure step went directly from repair and format to a fresh complete run. scripts/lib/handoff-ledger.mjs checks only the shape of the self-review summary and advises when it is absent; it does not prove review occurrence or bind judgments to current code. The executor corrected its inaccurate claim that the summary was required.",
    "The role regression now asserts the new-code-batch duty and the failed-gate step in the emitted executor skill. This checks instruction completeness, not host observation that workers complied. No new receipt gate or reviewer-expiry mechanism is added."
  ],
  "rejected": [
    "Using the successful-run restriction to explain a failed-gate repair confuses two different workflow points.",
    "Replacing all three agents after every ordinary edit is not the requested restart and discards useful continuity.",
    "Leaving the failure step as repair, format, rerun repeats the omission that caused this mistake.",
    "Claiming an instruction regression proves independent review actually occurred would overstate its evidence."
  ],
  "reopenWhen": "A new code batch reaches a complete run without all three existing reviewers rechecking it, or the emitted failure procedure again omits that cycle."
}
```

## WO-239-D008 — Read shell dependency paths without JavaScript tokenization

```json
{
  "id": "WO-239-D008",
  "date": "2026-10-29",
  "dispatch": "resume: next; bounded repair of the complete-run failure",
  "decision": "Collect literal first-party script paths conservatively from shell entry source, including comments and heredocs, and continue using JavaScript tokens for JavaScript and TypeScript entries. Retain the existing file-existence and declared-coverage checks. Name this conservative shell boundary in the coverage description.",
  "evidence": [
    "The first complete review row exited 1 at declarations, whose retained output says Source scanner did not advance at byte 20899. A bounded source scan reproduces that error in scripts/test-fixture-temp-root.sh and nonadvancing tokens in other shell sources; JavaScript/TypeScript sources in that scan complete. The new census heredoc exposed an existing language mismatch in machinery-coverage.mjs, which sent shell entries through the JavaScript scanner.",
    "The regression places unquoted and quoted paths before and after a heredoc, embeds JavaScript template syntax, and includes an apostrophe in a shell comment. It requires every existing path, including the conservative comment path, to be declared.",
    "The repaired node scripts/structural-checks.mjs declarations passes under the bounded wrapper at 2026-10-29T15:28:34.733Z. The bounded machinery test selection passes 10 tests with 0 failures at 2026-10-29T15:28:45.095Z. These focused checks reproduce and repair the failed stage; a new complete run remains required after all three reviewer rechecks."
  ],
  "rejected": [
    "Dropping shell entries from coverage would hide real copied and spawned inputs.",
    "Editing the new census control to avoid a scanner token would preserve the underlying language mismatch.",
    "Adding a shell execution parser or a dependency is unnecessary for this explicitly conservative declaration check."
  ],
  "reopenWhen": "A shell literal script path is missed or a conservative comment path imposes an unjustified declaration that cannot use the existing reasoned exclusion."
}
```

## WO-239-D009 — Preserve source-only refusals before preparing runtime

```json
{
  "id": "WO-239-D009",
  "date": "2026-10-29",
  "dispatch": "resume: next; bounded release repair",
  "decision": "Move source-only release surfaces, tag conflicts and required authentication into close prerequisites before child runtime preparation, and pass their checked context to close without repeating them. Synchronize compact-output consumers and bind the overlapping-close fixture to its actual history-read boundary. Preserve refusal-before-build, publication authority and exact history ordering.",
  "evidence": [
    "The second complete run failed surfaceclose and surfaceclose_linked; the executor stopped the remaining run at 2026-10-29T15:46:06.849Z. Retained release records show runtime preparation before release-surface refusal. The existing fixture explicitly requires invalid surfaces and missing authentication to refuse before build; moving those source-only checks earlier preserves that contract while still preparing before built imports.",
    "Focused traces identified obsolete path-list assertions in surfaceclose, dirty, settings_scope, stale_helpers and success after compact retained-material output became the default. The assertions now validate summary counts/digest and explicit --list-material path output. Runtime-refresh assertions follow the changed entry preparation message; the lower-version fixture prepares its stale runtime once and still publishes nothing.",
    "Corrections during reproduction: the first compact-summary assertion assumed prose instead of the actual JSON; parsing the summary fixes that mismatch. The executor also guessed two builds in success preview; a trace observed exactly one, so the assertion was restored to one. A focused run refused unformatted release.mjs; formatting was completed before the next run. These failed attempts are retained, not passing evidence.",
    "The next focused release run at 2026-10-29T16:11:06.793Z failed close_overlap because its source injection still matched the removed close call. The fixture now pauses immediately after Object.assign(record, history), the boundary its lock test actually observes. Its bounded recheck passed at 2026-10-29T16:11:56.492Z with both attempts retained and the second starting after the first receipt.",
    "npm test -- --only release under the bounded wrapper passed at 2026-10-29T16:14:23.744Z: eight groups passed, zero failed, all release cases executed, including the refusal, overlap, compact material, real writer, stale compiler and starter refresh cases. The row code identity is dfda55cd08cb8627e10bbbd5e904061e8ca6614a499e1d0e88819ccbba9b54f3. This is focused repair evidence, not the still-required complete run."
  ],
  "rejected": [
    "Permitting builds before invalid surfaces or missing required authentication would weaken an existing refusal contract.",
    "Deleting exact history-order assertions because an instrumentation string changed would stop testing the overlapping-close defect.",
    "Restoring path lists by default would undo the compact output deliverable; explicit opt-in retains inspectability."
  ],
  "reopenWhen": "A source-only refusal again prepares runtime first, a changed output leaves an unexamined test consumer, or overlapping closes lose or reorder either attempt."
}
```

## WO-239-D010 — Finish implementation and write-backs before reviewer launch

```json
{
  "id": "WO-239-D010",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator-directed reviewer timing",
  "decision": "Launch or restart all three independent execution/fix reviewers only after implementation or the repair batch and its write-backs are complete. Do not use them as early scouts. Preserve the same workers across code batches, all-three rechecks after new code, completion before the complete run and no reviewer restart after success. State this in the existing worker duty, ordered launch step and failed-gate repair step.",
  "evidence": [
    "The operator explicitly directed the fixing agent to finish its changes before launching the three reviewers and asked for that rule to be permanent. This is separate from the requested consistency-brief correction.",
    "The old ordered step required reviews to finish before the gate but did not explicitly forbid launching them while implementation was still underway. The failure step likewise needed to name finished repair write-backs before restarting reviewers.",
    "Producer-to-test tracing found packages/skeleton/test/executor-supports.test.ts still requiring the same consistency reviewer after the successful gate. That stale expectation contradicted WO-239-D002 and is replaced with the executor-owned handoff requirement, pre-launch completion and failed-gate recheck ordering. The emitted-role regression checks the ordered launch and repair steps; the chained oracle pins the resulting guidance.",
    "At continuation the executor initially described the prior completed review cycle as current. The current queue and later repair record showed a new batch still awaiting review; the chat correction and this record preserve that distinction. No new full gate or worker review was started on the mistaken reading.",
    "The bounded ordered-handoff regression passed at 2026-10-29T16:21:14.452Z with one executed test and zero skips. The bounded role-oracle check passed at 2026-10-29T16:21:14.187Z. Sync selected deterministic authority revision 003 while retaining revisions 001 and 002; publication check then passed with both editions current."
  ],
  "rejected": [
    "Early scouting does not review a completed batch and can leave later edits outside the three judgments.",
    "Replacing agents on ordinary edits discards continuity; the operator required restarting their review, not new assignments.",
    "An audit checklist in the executor procedure is outside the operator's narrower consistency-brief correction and is not added."
  ],
  "reopenWhen": "A reviewer starts before its implementation/repair batch and write-backs are finished, a new batch skips any of the three rechecks, or a reviewer runs after a successful complete gate."
}
```

## WO-239-D011 — Trace changed producers to their test consumers in the consistency brief

```json
{
  "id": "WO-239-D011",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator-directed consistency brief",
  "decision": "Use the retained failed-gate audit to strengthen only the existing consistency reviewer brief. Require tracing changed documents, emitted output and helpers to consuming tests by path, symbol, old/new text and byte/count pins; follow transitive imports and fixture copy/export manifests. Check oracle selectors, command/field inventories, runtime setup, gate environment and timing assumptions, and search for the same failure shapes in relevant retained failures. Preserve intentional exact contracts, update expectations from requirements, replace incidental prose coupling with semantic assertions, and report concrete producer/consumer pairs, dispositions and unsearched boundaries.",
  "evidence": [
    "The operator requested all retained failed gates over the preceding 48 h 0 min to 72 h 0 min, emphasizing document/output edits whose consumers retain old exact text or byte counts. The operator then explicitly limited the permanent change to the existing consistency reviewer brief, rejecting a duplicate executor audit step.",
    "gate-failure-audit.md and gate-failure-audit.json cover 2026-10-26T15:47:18.000Z through 2026-10-29T15:47:18.000Z: 2622 retained record files in four registered checkouts, 299 unique check rows, 88 failed rows including 20 structural companions and 68 other failed records. All 225 referenced failure-output files were read; none was missing and no record failed to parse. These are rows, not 88 complete runs; removed or unretained records are outside coverage.",
    "The catalog identifies stale role/oracle byte consumers, exact authority arrays and command/field inventories, human-duration parsing, owner-file inventories, missing transitive fixture modules, declarations and generated locks. Historical decision citations corroborate the named causes. Actual code defects, host refusals, mixed cases and unsupported causal guesses remain separately labelled.",
    "The current diff repeats the same shapes: release fixtures assumed the old path lists and close call text, and executor-supports still required post-pass consistency review. These concrete producer/consumer pairs are corrected, and the completed audit is supplied to the restarted consistency reviewer with the corresponding source and generated surfaces.",
    "The first emit refused the expanded 2301-character combined review paragraph under the existing 2000-character role-line contract. The same duties are now separate lines for review setup, the consistency brief and review completion; the contract is unchanged. Build and emit then passed, and both installed executor roots measure 33817 bytes with 1136 bytes remaining below their effective ceiling."
  ],
  "rejected": [
    "Generic related-metadata wording failed to direct the reviewer to test consumers of changed documents and outputs.",
    "Calling every failed assertion unrelated to code would erase real defects, intentional limits and unknown causes.",
    "Replacing every exact assertion would weaken deliberate authority, count, size and history contracts. Only incidental coupling is a candidate for semantic assertions.",
    "Duplicating these checks in the executor procedure would violate the operator's final scope correction."
  ],
  "reopenWhen": "A changed producer reaches the complete gate with a missed stale test consumer of these shapes, or the audit coverage or cause attribution is contradicted by retained evidence."
}
```

## WO-239-D012 — Preserve compact defaults and repair their consumers

```json
{
  "id": "WO-239-D012",
  "date": "2026-10-29",
  "dispatch": "resume: next; completed-review repair",
  "decision": "Resolve consistency findings C4 and C5 as one finished repair batch: correct PLAYBOOK to place source-only surface/tag/auth checks before child preparation, and make detailed archive/intake path assertions explicitly request --list-material or listMaterial true. Check compact defaults separately and retain privacy, byte preservation and no-mutation checks. Make the audit file count reconstructible by publishing its five intermediate aggregate references. Restart all three existing reviewers only after these repairs and write-backs are finished.",
  "evidence": [
    "All three reviewers finished their completed-batch review before this repair. Criteria and design found no new issue. Consistency found C4 in PLAYBOOK ordering and C5 in two compact-output consumers: test-process-debt and test-worktree. These are two findings; the related path assertions within the worktree script belong to C5.",
    "The bounded before-control at 2026-10-29T16:34:48.569Z recorded exit 1 for the selected archive-renderer test at its old default path assertion. The full worktree script also exited 1 at its earlier Unicode/newline intake-path expectation. Source tracing identified three intake-detail previews plus the retained-control preview that must opt into paths. The first attempted driver passed an empty stdin through the bounded wrapper and executed no named case; its zero exit is discarded as evidence. A file-backed driver supplied the actual negative control.",
    "The corrected renderer test checks the compact summary and omitted archive paths, then explicit listing, unchanged source/main snapshots, no private contents or content digests, and the original byte-preservation assertions. The CLI fixture retains Unicode path quoting and preview no-mutation checks; it checks compact retained output before the explicit detailed preview.",
    "The same bounded driver passed at 2026-10-29T16:37:49.319Z: the archive-renderer test executed once with zero skips; bash scripts/test-worktree.sh printed worktree tests passed and its six control-beacon cases passed. Both child exit codes are 0. Publication check reports 255 indexed product headings and both editions current; git diff --check is clean.",
    "Consistency counted 220 distinct top-level/failed-leaf audit references against the claimed 225 scanned files. Repeating the original recursive traversal identified five failed intermediate generated aggregate outputs: main rows 9/10, 41/42, 57/58 and 59/60, plus one shared by WO-235 rows 76/77/82/83. All five retained files were read and their exact references, byte sizes and row bindings are now in intermediateAggregateOutputs. Deduplicating the direct and aggregate inventories gives 225; no classification or original count changed."
  ],
  "rejected": [
    "Restoring default path lists to satisfy old assertions would undo the compact-output contract.",
    "Dropping the path, privacy or no-mutation assertions would remove the behavior those fixtures were written to protect.",
    "Treating the 220 direct references as proof that only 220 files were scanned would ignore the retained intermediate aggregate nodes; leaving the distinction implicit would keep the count difficult to audit.",
    "Reusing the previous reviews without rechecking the test-code repair would violate the operator-directed all-three restart rule."
  ],
  "reopenWhen": "A default compact output consumer again requires hidden details, a preview mutates source or main, source-only checks move after preparation, or the audit inventory no longer reconstructs its stated total."
}
```

## WO-239-D013 — Resume one complete run after the requested pause

```json
{
  "id": "WO-239-D013",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator continuation after pause",
  "decision": "Resume the unfinished validation after the operator's continuation, extending the complete-run ceiling from three to four for one additional run. Preserve the existing wall-clock bound and every acceptance requirement. Before launch, read the canonical active-gate inventory as well as process state; retain the stopped rows as stopped evidence. The completed reviews still cover the unchanged code batch.",
  "evidence": [
    "Same-day correction: the executor's continuation scan missed an existing scripts/test-runner.mjs --review process and launched a duplicate. Its command filter did not include test-runner.mjs; the later canonical stop named both runs, and process cwd confirmed that both belonged to this worktree. No claim that the earlier run was absent was supported by that partial scan.",
    "The two stopped rows retain starts at 2026-10-29T16:45:38.715Z and 2026-10-29T16:49:21.431Z. Both record stopped true and exit 1 at code identity f8047daf341209ad934acf62f2e68a5d5630f14a71923c4147ae16a662babf4a; neither is passing complete evidence. The canonical stop at 2026-10-29T16:54:34.296Z reported no active gate, and neither runner PID remained.",
    "The operator subsequently requested continuation. The ignored operator capture binds that instruction and its pause context to the DispatchBoundAccepted event. The usage readback reports three complete runs against the ceiling of three; the needed extension is one run, not unlimited work.",
    "On continuation, activeGateRuns returned an empty inventory and the process scan found no test runner. gateCodeIdentity returned the same f8047daf341209ad934acf62f2e68a5d5630f14a71923c4147ae16a662babf4a identity. Main and the worktree HEAD remain equal, so no integration or new code batch is involved. All three existing reviewers remain finished with ten findings fixed and none open."
  ],
  "rejected": [
    "A narrow process-name search alone is not evidence that no gate is active.",
    "Combining stopped or focused rows cannot substitute for the required passing complete run.",
    "An unlimited extension would exceed the specific continuation needed here.",
    "Restarting finished reviewers without a new code batch would repeat work; their judgments still cover the current code."
  ],
  "reopenWhen": "The active-gate inventory or code identity changes before launch, another code batch is needed, or validation needs a further extension."
}
```

## WO-239-D014 — Continue through implementation readiness under operator direction

```json
{
  "id": "WO-239-D014",
  "date": "2026-10-29",
  "dispatch": "resume: next; operator completion direction",
  "decision": "Record phase-scoped unlimited wall-clock and complete-run ceilings under the operator's direction to continue until the order is ready for verification. This supersedes D013's single-run interpretation. Continue repairs, the same three independent reviewer rechecks and validation until ImplementationReady is recorded; verification and publication retain their separate authority.",
  "evidence": [
    "The operator directed continuation until verification readiness while the complete run was active. The ignored capture records those actual words and their executor-phase context. The authorization is interpreted as covering the resources necessary to reach that named completion boundary, under the executor skill's ordinary-language acceptance route.",
    "The complete run subsequently reported a failure in the emitted-role corrections test. The canonical stop at 2026-10-29T18:17:28.990Z stopped the sole active run and reported an empty active inventory. No acceptance or completion is inferred from that stopped run."
  ],
  "rejected": [
    "Stopping again at the exhausted run ceiling would contradict the operator's explicit completion direction.",
    "Changing repository-wide defaults or accepting unmet criteria would exceed this phase-scoped authorization.",
    "Starting verification would advance beyond the boundary the operator named."
  ],
  "reopenWhen": "The operator pauses or changes direction, an external input or authority is actually required, or the executor phase completes."
}
```

## WO-239-D015 — Check release-close obligations across support settings

```json
{
  "id": "WO-239-D015",
  "date": "2026-10-29",
  "dispatch": "resume: next; complete-run regression repair",
  "decision": "Repair the emitted-role corrections test to assert the one-publish invocation, exact-command restrictions and conditional preview as separate obligations. Retain its checks across both support settings and every profile, and retain all other role assertions. The implementation and emitted instructions already express the required behavior; this repair changes their stale test consumer only. Finish the write-backs and restart all three existing reviewers before another complete run.",
  "evidence": [
    "The complete run reported not ok 108 for WO-179 and WO-195 emitted roles carry their assigned corrections across support settings. It was stopped at 2026-10-29T18:17:29.336Z; interrupted concurrent suites supply no passing or additional defect verdict. The run's completed process-debt and harness-fixtures groups passed, but the stopped row is not complete evidence.",
    "The bounded before-control at 2026-10-29T18:19:54.163Z executed the named role test once, with one failure and zero skips. Its expected expression was Run the printed helper command exactly as printed, with no redirect, prefix, cd or pipe. Contributor source and both emitted release-close roots instead say to run the printed --publish helper command once, exactly as printed, with the same restrictions and a preview only for a prerequisite in doubt.",
    "Source tracing located the obsolete expression at packages/skeleton/test/executor-supports.test.ts:142. The old/new instruction search across packages, scripts and both installed role roots found that one old consumer. The replacement separately requires the --publish invocation once, the unchanged prohibition on redirect/prefix/cd/pipe, and the conditional --dry-run instruction. No product source, oracle, version or emitted root changes in this repair.",
    "The bounded build passed at 2026-10-29T18:20:11.216Z. The entire executor-supports test file then passed at 2026-10-29T18:20:16.174Z: eight executed tests, zero failures, zero skips. This covers the emitted-role corrections, support composition, ordered handoff and reviewer duties together. git diff --check is clean. These focused results repair the observed failure; a passing complete run remains required.",
    "The build changed package snapshot metadata. Sync regenerated the installed harness snapshots and selected deterministic authority revision 004, retaining 001 through 003. The role oracle remained current; role instructions, measured root bytes, source behavior and versions remain unchanged. The consistency recheck includes those regenerated snapshot and authority consumers."
  ],
  "rejected": [
    "Restoring the old emitted sentence would remove the new one-invocation instruction.",
    "Deleting the old assertion without checking its exact-command restrictions would weaken the regression.",
    "Running only the changed assertion after repair could miss another stale assertion in the same role consumer; the full test file is the bounded repair check.",
    "Reusing pre-repair reviews for the changed test code would violate the all-three recheck requirement."
  ],
  "reopenWhen": "A release-close role loses one of these obligations, another consumer still requires the old sentence, or the complete run exposes another acceptance defect."
}
```

## WO-239-D016 — Preserve the stash-failure fixture's incoming-work precondition

```json
{
  "id": "WO-239-D016",
  "date": "2026-10-29",
  "dispatch": "resume: next; integration regression repair",
  "decision": "Keep the completed-receipt restoration test and give its second integration attempt real incoming work. First assert that an unchanged upstream returns successfully despite the held index lock and leaves the completed receipt byte-exact. Then commit an additional fixture file on the fixture's main branch, push it to its local bare origin, and retain the existing forced-stash-failure and completed-receipt byte assertions. Change the fixture precondition, not the required no-op behavior.",
  "evidence": [
    "The complete review at code identity 6bb4dd83a38f82dd40522679e5faa9f499b88c67c10afeea2124b3f089955dc6 reported one executed failing group, worktree-integration, and was recorded stopped at 2026-10-29T18:55:45.201Z. Case 13 failed its nonzero-status assertion: actual 0. Gate cleanup reported 1470 roots removed, 53 retained and zero blockers; the stopped row supplies no complete pass.",
    "scripts/test-worktree-integration.mjs completed its first integration, saved the completed receipt, held the subject index lock and invoked integration again without advancing upstream. The new guard in worktree-integration.mjs returns before preservation when upstream is already an ancestor. The fixture therefore no longer reached the stash failure it was meant to exercise. The executor introduced that behavioral boundary without adapting this existing fixture, and the independent reviews missed the dependency. The operator's question was answered with this exact causal explanation.",
    "The repaired case explicitly checks the no-op and unchanged receipt before adding next-upstream-fixture.md to the fixture-local main and publishing that commit only to the fixture's local bare origin. The next invocation reaches the forced stash failure and still requires the prior completed receipt's exact bytes. No production guard or preservation behavior changes.",
    "The bounded focused case passed at 2026-10-29T19:02:31.096Z: one executed test, zero failures and zero skips. The entire worktree-integration test file then passed at 2026-10-29T19:07:07.441Z: 46 tests, zero failures and zero skips. This includes the active, repairing and final-review no-op controls, advanced-origin integration and both live-lane refusals. The driver uses the runner's suiteEnvironment to isolate fixture sessions. git diff --check is clean.",
    "This is a test-fixture repair within the existing integration deliverable. Version assignments, role instructions and product source remain unchanged. All three existing reviewers must recheck the completed batch and write-backs before the next complete run."
  ],
  "rejected": [
    "Forcing preservation when upstream is already included would undo criterion 5 and the operator's no-op requirement.",
    "Changing the expected failure to success alone would stop testing restoration after a real stash failure.",
    "Removing the completed-receipt byte assertion would weaken the earlier recovery contract.",
    "Treating the passing focused case as sufficient without checking the rest of the integration file would leave related state assumptions unexamined."
  ],
  "reopenWhen": "A no-op changes a completed receipt, an incoming-work stash failure loses its prior receipt, or another fixture relies on preservation without incoming work."
}
```

## WO-239-D017 — Compare command routes without pinning measured churn

```json
{
  "id": "WO-239-D017",
  "date": "2026-10-29",
  "dispatch": "resume: next; complete-run adjacent test repair",
  "decision": "Keep the target-worktree briefing test comparing the printed document-gate route with the launchpad-local route, while normalizing only the numeric file-churn samples in addition to its existing volatile fields. Preserve exit status, diagnostics, cleanup counts, telemetry field presence and source. Add a deterministic comparator regression, retain the real routing case, and append the one new case to the existing inventory with its intentional declaration and name count pins. Finish this repair and its write-backs before restarting the same three reviewers.",
  "evidence": [
    "The complete review at code identity 46fde57ef5316935d3549a563c5468e9d40be3b02b409a4332fb17e1e1e9f510 reported one executed failing group, target-worktree:file:test-target-worktree-start.mjs. The file executed 29 tests: 28 passed, one failed, zero skipped. The canonical stop recorded the run as stopped at 2026-10-29T19:35:56.887Z and the active inventory was empty. Its passing groups do not supply a complete pass.",
    "The retained output is docs/control/local/harness/check-output/fe315b5641595e5a6f2fc1e26c4f962d09053b67a9304adb6b29c1ecbd1fadb5.log. An independent textual diff of its expected and actual blocks confirms exactly one difference: bytesWritten 2826105 versus 2826106. Both command routes returned exit 1 with the same expected fixture-format refusal, task diagnostics and zero cleanup blockers. The comparator already normalized timestamps and resident-memory samples but left file-churn samples exact. This is an incidental measurement dependency in the test, not evidence of a routing or production cleanup defect.",
    "The deterministic regression first ran against the unchanged comparator at 2026-10-29T19:38:00.599Z and failed on that one-byte change: one executed test, zero skips. The repaired comparator then passed the sample-variation control and real briefing route at 2026-10-29T19:38:17.707Z: two tests, zero failures and zero skips. The control also requires status changes, failure text, cleanup blockers, telemetry source changes, null samples and missing fields to remain distinguishable.",
    "The entire target-start file passed at 2026-10-29T19:40:13.183Z: 30 tests, zero failures and zero skips. The bounded driver uses suiteEnvironment to isolate fixture sessions. The repair changes test code only; production telemetry remains measured and unmodified.",
    "Tracing the new case found scripts/fixtures/target-worktree-cases.json and the target-worktree scheduling regression in scripts/test-runner.test.mjs. The inventory preserves every old entry and appends one declaration/name; its deliberate pins move from 69 to 70 declarations and 100 to 101 distinct registered names. The focused inventory/scheduling regression passed at 2026-10-29T19:40:47.925Z: one test, zero failures and zero skips. Existing suite entry tracking and test-file prefix declarations cover these consumers. Versions, installed guidance, authority and oracle content are unchanged."
  ],
  "rejected": [
    "Keeping exact per-run measurements in a route-equivalence assertion leaves the observed nondeterministic failure intact; another retry would not repair it.",
    "Dropping the cleanup line or comparing only exit status would conceal diagnostic, blocker or telemetry-shape differences. The narrower numeric-sample normalization preserves those distinctions.",
    "Making production churn counts deterministic would misrepresent measured work and exceeds this fixture repair.",
    "Removing or replacing historical case-inventory entries would weaken the existing coverage contract. Only the new case and its corresponding counts are added."
  ],
  "reopenWhen": "A genuine command-route difference is hidden by normalization, telemetry shape or source changes go undetected, or another per-run sample causes the route comparison to fail."
}
```

## WO-239-D018 — Retain strict refusal checks after a native child abort

```json
{
  "id": "WO-239-D018",
  "date": "2026-10-29",
  "dispatch": "resume: next; complete-run native abort diagnosis",
  "decision": "Keep the license and publication-refusal checks unchanged. Record the observed native Node abort, its correlation to the failed license fixture and the passing unchanged bounded recheck, then run a new complete review at the same code identity. The completed D017 worker reviews continue to cover those unchanged bytes; no new code batch or review restart is needed.",
  "evidence": [
    "The complete review at code identity 9dbe7da19dc0f172756b570ad821fe49afaf3deefead65b61745e451889973c6 reported one executed failing group, license-fixtures. The canonical stop recorded the run stopped at 2026-10-29T20:01:11.793Z and an empty active inventory. Interrupted groups are not additional defect verdicts, and the stopped row supplies no complete pass.",
    "The retained failure at docs/control/local/harness/check-output/283ffc66dbce8758dee907e4a5e991381641587fe8c7fca0e432e5bf0f20bebe.log reports a real npm dry-run child exiting SIGABRT without the required DOTLN_PACKAGE_PUBLISH_REFUSED marker. The license checker correctly refuses that outcome; the fixture comparison expected the ordinary deliberate exit 1 with its marker.",
    "The host crash report node-2026-10-29-160051.ips records the abort at 2026-10-29T20:00:50.5282Z, within the failed suite interval 20:00:27.153Z through 20:00:58.608Z. Its parent process matches the license fixture command-emitter identity in docs/control/local/harness/runner/product-reads/license-fixtures-54827dd2-23bd-4048-a062-6acff100acd3.jsonl. The fault stack runs through _LSApplicationCheckIn, uv__set_process_title, uv_set_process_title and node::ProcessTitleSetter before abort. The report says abort() called; it does not establish why that native check-in aborted. No memory-pressure, license-policy or routing cause is inferred. Only these relevant diagnostic facts are recorded, not the private host report.",
    "The full unchanged license fixture passed under the bounded wrapper at 2026-10-29T20:02:08.722Z: 11 tests, zero failures and zero skips. Both real npm manifest checks produced the required deliberate refusal, and the negative tests still rejected missing npm, unrelated failures and an invalid success with a marker. The driver uses suiteEnvironment. No production source, test source, dependency, runtime, oracle or version was changed for this diagnosis.",
    "All three workers already completed D017 at this same code identity with 13 findings fixed and none open. The operator requires all three to recheck every new code batch; the unchanged recheck here creates no such batch. The new complete run remains required and cannot be composed from this focused pass."
  ],
  "rejected": [
    "Accepting SIGABRT or merely any nonzero child exit as a successful publication refusal would erase the required marker and weaken the guard.",
    "Changing the fixture expectation, suppressing the test or forcing a stable outcome would conceal the observed native process failure.",
    "Adding a retry or changing the installed runtime without a reproduced cause would introduce unsupported behavior beyond this diagnosis.",
    "Restarting the same workers without changed code would repeat their completed judgments without addressing the observed native abort."
  ],
  "reopenWhen": "The same native abort recurs, the unchanged bounded license check fails, or evidence identifies a reproducible product or runtime defect requiring a concrete repair."
}
```

## WO-239-D019 — Integrate main's document-contract release, retime the patch and chain one integration oracle

<!-- integration refs/dotln/checkpoint/WO-239/5 -->

```json
{
  "id": "WO-239-D019",
  "date": "2026-10-30",
  "dispatch": "resume: next; operator: integrate latest main",
  "decision": "Take in main 297bf4f1 (WO-235's v0.103.0 document-contract release and its fixture stabilizations) through main's integration helper, which fast-forwarded the uncommitted branch and re-applied this order's work. Resolve the nine authored conflicts additively. Retime skeleton 0.72.1 to 0.73.1 above main's published 0.73.0, retaining this order's patch impact, with the console's exact pin and the lockfile following; the helper retimed the application release v0.102.1 to v0.103.1; compiler 0.33.0 and console 0.5.0 stay. Keep this order's four rewritten executor procedure steps together with main's rewritten document-check step. Keep the shared comparableGateResult normalizer, which already carries main's write-counter normalization, and drop main's duplicate local copy. Mint wo239-integration-role-baseline.json with main's head wo235-removal-role-baseline.json as historical parent and this branch's wo239-role-baseline.json as branch parent; the startup-bytes chain starts at it, the role-oracle check reads it and walks both chains, and the process-debt suite declares it. Sync re-minted the stale authority edition as WO-239 revision 005. These resolutions are new code, so all three independent reviewers recheck the integrated diff before the complete run.",
  "evidence": [
    "Operator words during resume: next: integrate latest main. At entry local main and origin/main were both 297bf4f167415b17b44608b3e98a7a619862bbeb (git ls-remote), five commits ahead of the original base 3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f. No test or gate process was running, and the prior Codex writer process 52438 had exited (ps).",
    "Main's scripts/worktree.mjs integrate WO-239 ran against this worktree with a digest-checked external intake backup in the session scratch (DotLn-wo239-intake-20261030T061021Z.zip, five files). It preserved refs/dotln/checkpoint/WO-239/5 and stash 561ab0e8, fast-forwarded to 297bf4f1, applied the stash and listed nine authored conflicts. The --continue pass regenerated the runtime, harness bundle, control projection, release preparation, decisions index and meta, work-order index, sibling registry, publication locks and console fixtures, reported no authored conflict and dropped only its own named stash.",
    "The conflicts: skeleton 0.73.0 (main) against 0.72.1 (branch), with the console pin and two lockfile entries; contributor.ts, where main rewrote only the document-check step (base line 626) and this branch rewrote the four steps before it (622 to 625); test-target-worktree-start.mjs, where main added the filesCreated, filesDeleted and bytesWritten normalization to a local timings helper this branch had already replaced with the tested top-level comparableGateResult (WO-239-D017); the role-oracle consumers in test-runner.mjs, test-process-debt.mjs and test-gate-followups.mjs, where main's seven-link WO-235 chain and this branch's single oracle both descend from wo234-integration-role-baseline.json; and the authority pointer in docs/evidence/current.json (WO-235 017 against WO-239 004).",
    "Integrated installed roots, measured as the oracle tests measure them (CLAUDE.md plus each role skill, UTF-8 bytes): executor 34,975 to 36,500 (+1,525) and release-close 22,657 to 22,758 (+101); verifier 31,496, reviewer 33,944, planner 23,566 and refuter 22,380 unchanged. The growth equals this branch's reviewed additions exactly. Executor fits its accepted 40,194 ceiling and release-close its accepted 26,410. All twelve installed role files match the new oracle's hashes.",
    "npm run sync: authority-evidence stale, then current, selecting WO-239 revision 005 and retaining 001 to 004; every other artifact, including role-oracle and feedback-evidence, was already current, so no live feedback episode is owed.",
    "Main changed none of this order's primary sources (release.mjs, harness-prune.mjs, worktree-removal.mjs, worktree-integration.mjs, plan-failures.mjs). It changed the cited harness-host.ts, harness.mjs and test-harness.mjs. Both sides changed resume.mjs, test-release.sh, test-plan-refutation.mjs, test-runner.test.mjs, executor-supports.test.ts, product 07 and the kit README, which merged without conflict and read coherently on main's text."
  ],
  "traps": [
    "A generated-file or version conflict is not an acceptance verdict; regenerate from the combined authored sources and retime without widening the patch.",
    "Selecting either branch's oracle would drop the other reviewed history; chain one integration oracle to both and keep every earlier oracle byte-exact.",
    "Two fixes of one flake leave two normalizers to drift; keep the tested shared one."
  ],
  "rejected": [
    "NoOp leaves the worktree behind the main the operator asked to take in, so the handoff run would judge a tree final review must integrate again.",
    "Keeping main's local timings helper beside comparableGateResult duplicates the same normalization without its regression test.",
    "Rewriting wo239-role-baseline.json or wo235-removal-role-baseline.json to the integrated bytes would erase the subjects their reviews judged.",
    "Hand-picking an authority pointer; sync's check decides staleness and mints the next revision."
  ],
  "reopenWhen": "A concrete integrated check or independent review finds changed acceptance behavior, a broken oracle link, or a stale source or version declaration."
}
```

Integration date: 2026-10-30. Original base: `3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f`.
Fetched main: `297bf4f167415b17b44608b3e98a7a619862bbeb`. Checkpoint: `refs/dotln/checkpoint/WO-239/5`.
Named stash dropped after completed application: `561ab0e832d2738daf26e2c17d4fe0bf69cead66` (WO-239 integrate 2026-10-30).
Resolved projections: .agents/skills/dotln-executor/SKILL.md, .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/failure-observer.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permission-denied.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, .claude/skills/dotln-executor/SKILL.md, README.md, docs/control/current.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-239: v0.102.1 → v0.103.1 above the observed release baseline v0.103.0. Files changed: docs/work-orders/WO-239-release-close-prepares-before-it-loads-and-runs-once.md, README.md, docs/evidence/WO-239/meta.json. Meter snapshot: docs/evidence/WO-239/meta.json, 4571 bytes. Tag observation: local snapshot only.
Carried-forward claims: no earlier judgment is claimed for the integrated bytes. Main changed none of the primary sources behind criteria 1 to 5, so their paired controls in [controls.json](controls.json) remain the record of both arms, and the complete run re-executes their regression suites on the integrated tree. Criterion 6's role text is merged and its oracle re-minted here; criterion 7's write-backs sit on main's rewritten product 07 and kit README. Both are judged again by `npm run publication:check`, the complete run and `npm run test:docs`. The handoff records each criterion against those integrated rows.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/package.json, packages/skeleton/package.json, packages/skeleton/src/loadouts/contributor.ts, scripts/test-gate-followups.mjs, scripts/test-process-debt.mjs, scripts/test-runner.mjs, scripts/test-target-worktree-start.mjs.
Affected checks, each under `node scripts/harness.mjs bounded --` on 2026-10-30 between 06:20 and 06:21 UTC, exit 0: `node scripts/harness.mjs check` (35 generated surfaces); `npm run release -- check-surfaces --local` (release block v0.103.1, skeleton 0.73.1 against v0.103.0's 0.73.0, every workspace pin exact, all license refusals marked); `npm run publication:check` (255 of 255 product headings indexed, both publication pages current). The printed `npm test -- --review` is the handoff's complete run; it follows the integrated reviews.
`npm run meta` reports one reopen candidate, drift-to-low-performance on executor coldStartBytes 36,500 (Δ 1,525) over three consecutive order deltas. That growth is exactly this order's reviewed executor additions, unchanged by the merge (WO-239-D004 measured the same 1,525 bytes before integration), and fits the accepted 40,194 ceiling. The candidate is recorded here for the next planning pass, as WO-234's final review recorded its own, and changes nothing in this order.

## WO-239-D020 — Resolve the integrated reviews and state the global walk as built

```json
{
  "id": "WO-239-D020",
  "date": "2026-10-30",
  "dispatch": "resume: next; integrated independent reviews",
  "decision": "Resolve all 21 distinct findings of the three fresh integrated reviews before the complete run. Fix them as follows. The role-oracle walk follows every recorded parent link, pins the integration's branch parent by name and requires every role oracle to stay reachable. The integrate guard resolves main's checkout without throwing, letting the primary checkout stand for it while a planning pass has it off main; it compares checkouts by physical path through the host-lane relation and reads local main only in the active phase. One helper binds a registered or captured temporary root to its checkout by token and physical path, for both the close's capture and the scoped discovery. Every prune reader resolves its scope through one function. The removal receipt's summaries have one definition. The timed step wrappers name their record parameter. One writer seals the close record and repeats no advisory. The unreachable closed-phase refusal inside close() is removed, and the writer release's prune timing is explained where it runs. One median serves both plan-failures summaries. Both handoff printers' one-invocation wording is pinned and the old preview wording refused. Product 07, the kit README and the PLAYBOOK state the global walk, the integration order, the paths diagnostic's admission and the runtime preparation as built. Record four findings without change: the executor's review-then-integrate step order, a per-role growth-equality pin, the latest-eight attempts reading that includes previews and refusals, and redundant but consistent consistency-review and --dry-run sentences in the role text. The handoff's pre-integration facts are replaced after the complete run. This order's premise that the session-end prune keeps the global walk was false; the follow-up records the routine global apply this order removed from the close.",
  "evidence": [
    "Three fresh read-only dotln-worker reviewers (claude-opus-5-5) judged the integrated diff without writes, tests or probes: design found 12 (5 should-fix, 7 notes), consistency 7 (1 should-fix, 6 notes) and criteria 5 (3 should-fix, 2 notes). The criteria walk finding duplicates the design walk finding, the criteria handoff-wording finding duplicates the consistency one, and the criteria lane-path note duplicates the design one, leaving 21 distinct findings and none blocking.",
    "Oracle walk: from wo235-removal-role-baseline.json the old historical-only walk reached all 40 linked oracles; from wo239-integration-role-baseline.json it reached 40 of 42 and no longer checked wo234-recovery-role-baseline.json or wo234-role-baseline.json byte-exact. Following historical, branch and upstream links reaches all 42, all 80 recorded digests match, and every role-baseline fixture is reachable from the current oracle. The criteria reviewer showed one appended byte in either missed file passed the old walk.",
    "Main's checkout: mainWorktree in scripts/lib/git.mjs throws 'no main-branch control-plane worktree found' when no checkout has main, and plan start switches the primary checkout to a planning branch (scripts/refute-plan.mjs). The base integrate helper needed no main checkout. primaryWorktree returns the checkout that owns the common Git directory, whatever its branch, and checkoutRelation in scripts/lib/host-lanes.mjs compares physical paths, as pruneHarness's holder filter does. The new regression case switches the fixture's primary checkout to a planning branch: a lane holder there is refused by name, and once it is released the active integration takes in local main.",
    "Global walk: pruneCompletedHarnessSession calls pruneSessionTemporaryRoots, which filters this repository's ledger to the session's session-scratch and worker-capture rows. temporaryRetentionPassed has callers only in scripts/lib/temporary-prune.mjs. The global walk's production entries are harness prune (scripts/harness.mjs), the read-only summary plan start prints (scripts/refute-plan.mjs passes no scope), and the close, now close-scoped; kit update preview's summary passes the repository scope (scripts/launchpad.mjs) and does not walk the system temporary directory. Base product 07 never claimed a session-end global walk; the claim came from this order's objective, design and operator-review assumption, and from its own write-backs.",
    "Root binding: owner markers store realpathSync of the repository (ensureTemporaryRoot); the close compared resolve(checkout) while the scoped discovery compared realpathSync(root), so a checkout listed by a symlinked path lost its roots at capture.",
    "The release.mjs static import graph, now including scripts/lib/temporary-prune.mjs, spans 70 files and loads no packages/*/dist module (read-only import walk), so criterion 1's load order holds.",
    "WO-239-D005 summarizes the latest eight timed attempts; the reader also counts dry runs separately, and the role text now makes a preview optional rather than a standing first step."
  ],
  "traps": [
    "A reviewer's should-fix on reviewed design is not a criterion verdict; fix it when it removes a real drift or failure shape, and record it when the change would only move reviewed text.",
    "A false premise in the order is not this executor's to rewrite into scope; state the mechanism as built and route the open product question to planning."
  ],
  "rejected": [
    "Restoring a global walk at close, or adding one to every session end: the order bounds the close census and leaves the global prune's semantics out of scope, and the measured 186.9 s census at each session end would cost more than the close saved.",
    "Skipping the main-holder check when no checkout has main would let integration race a gate in the control-plane checkout during a planning pass.",
    "Swapping the executor's review and integration steps would change the operator-directed review lifecycle beyond this order; the existing duty already requires the three rechecks an integration's new code needs, as WO-239-D019 followed.",
    "Pinning per-role growth equality would pin one merge's arithmetic; the twelve role hashes already pin the integrated bytes and WO-239-D019 records the measured equality.",
    "Excluding previews or refusals from close timing would hide minutes they cost; WO-239-D005's attempts reading stands until such samples dominate the median.",
    "Merging the overlapping consistency-review sentences or dropping '--dry-run previews' would rewrite independently reviewed role text for redundancy alone and mint another oracle."
  ],
  "followup": "Decide where routine apply-mode cleanup of expired temporary roots outside a close's scope lives, now that a close prunes only its own scope and the session-end prune never walked the system temporary directory; today only an explicit harness prune --apply removes them. Measure the census cost at each candidate home (session end, plan start, a scheduled run) before choosing, and keep the close bounded. Paths: scripts/lib/harness-prune.mjs, scripts/lib/temporary-prune.mjs, packages/skeleton/src/temporary-root-records.mjs, docs/product/07-execution-guide.md §Workflow closeout and releases.",
  "reopenWhen": "A complete run or recheck shows one of these fixes changing acceptance behavior, previews or refusals dominate the latest-eight close median, or an integration at a named point is refused."
}
```

## WO-239-D021 — Resolve the integrated rechecks and correct the census entries

```json
{
  "id": "WO-239-D021",
  "date": "2026-10-30",
  "dispatch": "resume: next; integrated review rechecks",
  "decision": "Resolve the six new recheck findings before the complete run. Link product 07's census sentence to the decision's full heading anchor. State that an explicit harness prune and the read-only census plan start prints both walk the system temporary directory, that only harness prune --apply removes expired roots outside a close's scope, and that kit update preview's census stays within its repository; correct WO-239-D020's evidence to match. Declare all fifteen undeclared role oracles as process-debt inputs. Add a regression case that binds a root through a symlinked checkout path. Leave the two handoff printers' one-invocation wordings separate, each pinned by its own test. The handoff will state the order's false operator-review assumption and the carry-in's status.",
  "evidence": [
    "The design recheck confirmed its twelve findings settled (eleven fixed, the step-order finding recorded) and found one note: the release-close and worktree-publish printers state the one-invocation rule in different words. The consistency recheck confirmed C1 to C7 and found three: a blocking missing anchor (docs-check linkFailures reported decisions.md#wo-239-d020 at product 07), plan start's census walking the system temporary directory contrary to the new sentence, and a directory listing read by the oracle test outside the suite's declared inputs. The criteria recheck confirmed A1, A2, A3 and A5 fixed and A4 recorded, and found two: no regression case for the symlinked root binding, and the false operator-review assumption needing an explicit handoff statement.",
    "scripts/refute-plan.mjs calls temporaryPruneSummary(root) with no scope, so pruneScope defaults to all and the system temporary directory is a census base; scripts/launchpad.mjs passes scope repository, whose bases are empty. Same-day correction: WO-239-D020's evidence and the first wording of the product 07 and kit README sentences named update preview as a global walk and harness prune as the only one. They were wrong about which censuses walk the system temporary directory; plan start's read-only census does and update preview's does not. The evidence item and both documents now say so; the removal half was already correct.",
    "machinerySources process-debt declared 28 of the 43 role oracles; it now declares all 43. The suite's inputs match by path prefix, but the fixtures directory also holds about twenty fixtures other suites use, so a directory prefix would schedule this exclusive suite for unrelated changes. The three duplicate entries in that list (writer-teardown.mjs, worktree-material.mjs, git.mjs) predate this order on main.",
    "A bounded probe in the session scratch registered a session-scratch root under a physical checkout, read it back through a symlink to that checkout and found boundTemporaryRoots returns it with the physical repository and the scoped close admits it; the listed path differs from the physical one, so the former resolve(checkout) comparison would not have bound it. The same assertions now run in scripts/test-fixture-temp-root.sh's close-scope block.",
    "Carry-in status: WO-233-D046's own reopening conditions are a writer alone retaining an expired root, start census cost affecting an order, or accumulating empty owned containers. WO-239-D001 acted on the start census cost by removing that census under operator direction; the other two were not observed. This order's carry-in condition, that the scoped close census retains an expired root the global walk would have removed, has not occurred in the census's own sense: the close census does not judge roots outside its scope. The practical gap behind it, expired roots outside a close's scope waiting for an explicit harness prune --apply, is FUP-69af2e1da022aa7a."
  ],
  "rejected": [
    "A shared sentence constant for the two printers: they close different handoffs, each wording is pinned and refuses the old preview phrasing, and coupling them would cost another review round for no change in behavior.",
    "Declaring the whole packages/skeleton/fixtures/ prefix: it would select the exclusive process-debt suite whenever an unrelated fixture changes.",
    "Recording a reopen of WO-233-D046: none of its conditions occurred beyond the start census cost WO-239-D001 already resolved, and the new cleanup question has its own follow-up."
  ],
  "reopenWhen": "The two printers' one-invocation wordings diverge in meaning, a newly minted role oracle is left undeclared, or a scoped close leaves an expired root that its own scope should have removed."
}
```

## WO-239-D022 — Report the temp-root success after every case and enforce oracle declarations

```json
{
  "id": "WO-239-D022",
  "date": "2026-10-30",
  "dispatch": "resume: next; integrated review rechecks",
  "decision": "Fix the design recheck's two notes before the complete run. The temp-root test now prints its success line after its last case, so a failure in the close-scope block can no longer follow a passing line in a retained log. A test now requires every role oracle in the fixtures directory to be a declared input of the process-debt suite, turning WO-239-D021's manual declaration duty into a failing check. The criteria and consistency rechecks of the third batch found nothing new.",
  "evidence": [
    "scripts/test-fixture-temp-root.sh printed 'fixture temp-root tests passed' before the close-scope block this order appended; set -euo pipefail kept the exit status correct, and no script reads the marker. The block now runs before that line, and the file still ends with one newline.",
    "Before WO-239-D021, 15 of 43 role oracles were undeclared, so the manual step had been missed across many orders. The new test in scripts/test-gate-followups.mjs lists the fixtures directory and reports any role oracle missing from the declared process-debt inputs; on the current tree the list is empty.",
    "Recheck counts for the third batch: criteria new 0, consistency new 0, design new 2 (both fixed here).",
    "The final rechecks of this batch found nothing new from design or criteria. Consistency noted that the new test, like the sync-selection test beside it, reads machinerySources from scripts/test-runner.mjs, which process-debt does not declare, so an edit that only drops a declaration would not select the suite. Minting an oracle also edits the declared test-process-debt.mjs and test-gate-followups.mjs, which select it."
  ],
  "rejected": [
    "Recording both notes unchanged: each is a few lines on code this order added, and the second converts a recorded reopening condition into an executable check.",
    "Declaring scripts/test-runner.mjs as a process-debt input: it would schedule that exclusive suite on every runner edit, the trade-off WO-239-D021 rejected for the fixtures-directory prefix."
  ],
  "reopenWhen": "A role oracle is minted outside the fixtures directory, or the temp-root test gains a case after its success line."
}
```

## WO-239-D023 — Assert the close's prerequisite-first order in the kit recovery case

```json
{
  "id": "WO-239-D023",
  "date": "2026-10-30",
  "dispatch": "resume: next; complete-run failure repair",
  "decision": "Update the kit recovery case's close step to the order this order built and documented: with the carried host module removed and a local-path origin, the close refuses at its source-only origin prerequisite and leaves the runtime untouched. Keep that case's bootstrap assertions for the release-close reservation and the session entry, and its check that none of the three refusals names npm run build. Defer a test of the kit close's runtime remedy after its prerequisites pass to a release-ready kit fixture.",
  "evidence": [
    "The complete review run at code identity 89293078771c, recorded 2026-10-30T07:33:38Z after 0 h 25 min, reported 42 passed and 2 failed. scripts/test-launchpad-export.mjs case 25 (a fast-forwarded export restores its selected runtime for recovery, harness entry and finish) expected /Release-close runtime is not built.*node scripts\\/bootstrap\\.mjs/ and received 'origin must identify exactly one matching GitHub HOST/OWNER/REPO fetch and push target'. Four later tasks (three vertical files and the launchpad seeds file) were not started after it.",
    "Every earlier WO-239 complete run (ten rows on 2026-10-29) recorded this file as unrun, so this run was the first to execute the case against the reordered close.",
    "At the base, the close entry released the writer, which refused with the bootstrap remedy when harness-host.js was missing, before close() checked origin. WO-239-D005 moved the source-only prerequisites, origin reachability among them, ahead of runtime preparation and any built import, as product 07 §Workflow closeout and releases states. The case's origin is a local bare repository, so the close now refuses there first.",
    "The repaired case passed alone under node scripts/harness.mjs bounded with the runner's suiteEnvironment: 1 test, 1 pass, in 0 h 0 min (case 11,481 ms, process 15,996 ms).",
    "The writer-release refusal naming node scripts/bootstrap.mjs is now reached only after the prerequisites pass and preparation finds no cause. No current fixture both passes a kit close's prerequisites and removes a carried runtime module; this case was its only test.",
    "A kit commits its carried runtime (scripts/kit/gitignore.template; the export fixture adds every file), so a deleted runtime module leaves the tracked tree dirty. Once origin passes, updateMain's ensureTrackedClean refuses with the deleted path, which points at restoring the tracked file; a committed deletion instead reaches preparation, whose verifyKit failure names the module. Neither names npm run build, and the base's bootstrap remedy could not restore a tracked module either, since a kit's bootstrap has no build step.",
    "Same-day correction: this record first said a GitHub-shaped origin would move the refusal to authority or surfaces. The criteria recheck showed that the tracked-clean check refuses first, because a kit commits its carried runtime. The rejected item and the follow-up now say so."
  ],
  "rejected": [
    "Moving runtime preparation or the writer release back ahead of the prerequisites: WO-239-D005 and product 07 refuse an invalid release before preparing or importing runtime.",
    "Giving this fixture a GitHub-shaped origin: the deleted module is tracked in a kit, so updateMain's tracked-clean check would refuse next, still before runtime preparation.",
    "Adding node scripts/bootstrap.mjs to the kit preparation failure: a kit's bootstrap has no build step and cannot restore a deleted carried runtime module, so that remedy would be unproven."
  ],
  "followup": "Pin the kit close's runtime refusal after its prerequisites pass: in a release-ready kit fixture such as the launchpad-planning kit release case, commit the removal of a carried runtime module, then assert that the close refuses at runtime preparation naming that module before any built import, that its remedy actually restores the kit and that it never names npm run build; an uncommitted removal refuses earlier at the tracked-clean check. Paths: scripts/test-launchpad-planning.mjs, scripts/release.mjs (ensureReleaseRuntime and the writer-release refusal), scripts/lib/release-kit-runtime.mjs.",
  "reopenWhen": "A kit close that passes its prerequisites refuses a missing carried runtime without a working remedy, or names npm run build."
}
```

## WO-239-D024 — Verify the recorded subject with independent probes

```json
{
  "id": "WO-239-D024",
  "date": "2026-10-30",
  "dispatch": "resume: verify",
  "decision": "Judge the selected WO-239 implementation without integrating or editing it. Consume the executor's executed passing complete row only after matching the current code identity, then independently reproduce the runtime, census, compact-output, preservation, integration, timing and role claims. File the allocated VER-001 pass only after the final document row and whitespace check succeed. Keep the already recorded global-cleanup and kit-failure-path follow-ups visible rather than treating an untested path or the corrected session-end premise as a reproduced defect.",
  "evidence": [
    "Canonical status selected WO-239 in ready-to-verify; operator controls reported ordinary workflow mode. The single verify dispatch allocated docs/verifications/WO-239/VER-001.md and reserved this session's writer.",
    "Current code identity 41629663fd2d2cc1514acf4074dbc36aa26d850745cd1fdff71bef9c2102b25d matches the executed complete row recorded 2026-10-30T08:20:48.836Z, with all 44 required groups and none unrun. A repeated complete product gate would judge the same code; the final document gate judges the changed records separately.",
    "docs/evidence/WO-239/verification-001.json retains eleven successful bounded probes and the portable source of the verifier's independent assertions. The observed controls include a child build before parent built imports, a first-invocation starter refresh, close/global foreign-owner reads of 0/1000, the 2000-file compact transcript, removal-proof fault cases, seven focused integration cases and six role/preservation cases. Separate format, publication and generated-harness checks passed.",
    "The static import walk reached 70 source modules without built imports. Independent timing assertions cover nested exclusivity, repeated and throwing calls, skipped rows, multiple orders and unordered histories, malformed/legacy records, a window filter and a tie. Current installed root measurements agree with D019; the earlier harness-context-after.json remains historical pre-integration evidence.",
    "Same-day process correction: broad status/report batches exceeded their output budgets; one unquoted nonexistent shell glob also aborted its intended search, and later searches named nonexistent candidate filenames. npm run meta also returned oversized console output, although its host completion reported exit 0. Those reads were partial or failed, never passing evidence. Verdict-relevant fields were read through selected canonical projections, literal known paths, byte-paged scratch diffs and current generated checks; the generated decision-index row was read directly rather than inferring it from the partial meta console report. Full probe output stayed in scratch and its bounded results and selected observations are retained in verification-001.json. The final gate's full output is redirected to scratch for selected readback. No implementation or lifecycle result depended on a truncated or failed read.",
    "The selected-session readback is codex-cli 0.166.0, gpt-6.1-sol, effort max, source codex-session-readback. This is recorded as supplied despite the verifier's xhigh recommendation. No effective-effort or dollar-cap readback is invented; no agent was launched. The final document-gate result belongs to the subsequent completion event, not this pre-gate measurement cutoff."
  ],
  "traps": [
    "A green older row cannot establish a changed subject: compare code identity before reuse, and require a document row for the final candidate tree.",
    "A compact stdout alone could hide a path list in the retained transcript or weaken proof: check the full fixture transcript and independently reproduce inventory refusals.",
    "The session-end global-walk premise and earlier root-byte snapshot are not current facts: use the checked implementation, D020/D021 and current installed bytes.",
    "Repeated timing visits can double-count nested work: assert exclusive totals and failure finalization independently."
  ],
  "rejected": [
    "NoOp would leave the operator's requested verification unfinished; the executor's reviews do not replace an independent criterion judgment.",
    "Starting another complete product run despite a matching standing complete row would add waiting without resolving a new code uncertainty.",
    "Editing an implementation or changing a criterion to obtain a green verdict would exceed the verifier's authority.",
    "Turning the unmeasured production close estimate or deferred kit failure-path coverage into a tested result would invent evidence."
  ],
  "reopenWhen": "A criterion probe fails, the code identity changes before filing, the final document gate fails, a scoped close misses an owned candidate, or a recorded existing follow-up's concrete reopening condition occurs."
}
```

## WO-239-D025 — Accept the integrated subject on its standing complete row

```json
{
  "id": "WO-239-D025",
  "date": "2026-10-30",
  "dispatch": "resume: final review",
  "decision": "Pass WO-239 at final review on the recorded subject without a source edit, a new complete run or a worker. Run the integrate helper because the order's own guard now makes that call safe: it fetched origin/main, found it already an ancestor of HEAD and returned before any checkpoint, stash or merge scratch. Reuse the executor's passing complete review row because the working tree's code identity equals the row's. Rerun the stale-compiler, compact-close, real-writer and temporary-root cases, seven focused integration tests, the role-oracle tests and the plan-refutation suite under the bounded wrapper, walk the close's import graph, and run the publication, format, harness, release-surface and whitespace checks. Judge the planning receipt's three known issues and the order's carry-ins from the current subject and record their dispositions in FINAL-001. List no finding. Write the PR body and release notes from their contracts, commit the implementation and the records as two commits after the recorded pass, and publish only the reviewed branch.",
  "evidence": [
    "git rev-parse main origin/main and git merge-base main HEAD all read 297bf4f167415b17b44608b3e98a7a619862bbeb after git fetch origin. npm run worktree -- integrate WO-239 printed that it took in nothing; git stash list stayed empty, refs/dotln/checkpoint/WO-239/9 remained the newest checkpoint and docs/control/local/integration.json kept its 02:16 modification time. This is criterion 5's no-op path observed on the real subject, not a fixture.",
    "gateCodeIdentity read 41629663fd2d2cc1514acf4074dbc36aa26d850745cd1fdff71bef9c2102b25d at entry, equal to the complete row host-gate:41629663fd2d2cc1514acf4074dbc36aa26d850745cd1fdff71bef9c2102b25d:npm test recorded 2026-10-30T08:20:48.836Z, exit 0, executed, intact, not partial, 44 required suites, 113 fresh tasks, none unrun, 0 h 33 min. The identity, not the dispatch time, says what was tested, so no new complete run is owed.",
    "Bounded probes in this review, each exit 0: test-release.sh --case stale_compiler (child build finished before the parent's first built import; starter refreshed on the first invocation; 11 s), --case close_compact (2,000 ignored files; advisory 198 bytes; removal receipt 995 bytes; 14 s), --case close_real_writer (seven timed rows; session cleanup charged to prune; 11 s), test-fixture-temp-root.sh (close scope read 0 of 1,000 foreign owner files, global scope read 1,000; 4 s), the focused integration tests (active, repairing and final-review no-ops with zero stash pushes and zero merge-scratch allocations; advanced origin taken in; live holders in the subject and in main refused by name; the planning-branch primary checkout refused then admitted; the stash-failure continuation preserved; 31 s), the focused role-oracle and declaration tests (1 s) and npm test -- --only plan-refutation (8 passed, 0 failed, 0 h 2 min). A static walk of release.mjs's import graph reached 70 modules with no packages/*/dist import and no unresolved relative import.",
    "npm run format:check, git diff --check, node scripts/harness.mjs check (35 generated surfaces), npm run publication:check (255 of 255 headings indexed, both editions current) and npm run release -- check-surfaces --local (release-block v0.103.1 above local v0.103.0; skeleton 0.73.1 with the console pin; every other component unchanged) all passed before the records were written.",
    "The planning receipt 058 known issues at the current subject: the release-close root grew 101 bytes to 22,758 against a 26,410 ceiling and one of its two --dry-run previews sentences was replaced by the optional-preview sentence, so its reopening condition did not occur; readHolders already filters lane records through laneHolderAlive, so the integrate guard cannot name a dead holder; the kit-root preparation path is covered by source inspection and the existing kit preview cases while its failure path after passing prerequisites stays boarded in WO-239-D023 as FUP-977e50f635de762d.",
    "The order's carry-ins: WO-233-D046's conditions did not occur beyond the start-census cost WO-239-D001 resolved, and the scoped-close reopening condition cannot occur in the census's own sense because the close judges no root outside its scope (WO-239-D021); WO-236-D014 is taken whole by the two guards and the executor sentence, and this review's own integrate call exercised the no-op guard at a named point; the fork receives the fix with this release; the build's duration at a real close remains unmeasured until the first close records its steps.",
    "Entry usage read by node scripts/harness.mjs usage: 157,904 tokens at 2026-10-30T08:51:07Z, source claude-transcript-message-usage, scope dispatch; subagents 0 of 20. The handoff reading is in FINAL-001."
  ],
  "traps": [
    "Rerunning the complete review for comfort would add 0 h 33 min of waiting and judge the same bytes; the identity match is the rule's condition and it holds.",
    "Skipping the integrate helper because an earlier review skipped it would ignore that this order changed the helper; running it was both the procedure and a live observation of criterion 5.",
    "Turning the planning receipt's known issues or the order's false session-end premise into findings would list defects the current subject does not have; each is judged from the record and the code and stated in the report.",
    "Spawning reviewers for a subject six independent reviews and a verification already attacked would spend the shared cap on duplicated judgment; the reviewer owns acceptance and reproduced the claims itself."
  ],
  "rejected": [
    "Failing or boarding the --dry-run form's new runtime preparation as a regression: a preview also imports built modules through the prune and target-close helpers, product 07 states the entry prepares before any built import, and the release fixtures pin the new build in the no-release path deliberately.",
    "Editing any source or test in this review: nothing needed it, and a source edit would move the code identity and owe a fresh complete run.",
    "Passing on VER-001 and the standing rows without reading the subject: the reviewer owns the acceptance judgment and the release surfaces."
  ],
  "reopenWhen": "The first production close after this release records a runtime refusal, a starter-refresh refusal on its first invocation or a steps row that contradicts the fixture timings; an integration at a named lifecycle point is refused by a lane its own session did not start; or a scoped close misses an owned candidate."
}
```
