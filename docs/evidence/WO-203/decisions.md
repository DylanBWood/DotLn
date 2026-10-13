# WO-203 decisions

## WO-203-D001

```json
{
  "id": "WO-203-D001",
  "date": "2026-10-12",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.79.0, the next minor above the observed release baseline v0.78.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.78.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-203-update-preview.md"
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

## WO-203-D002 — One plan, one rendering, the existing update rules

```json
{
  "id": "WO-203-D002",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Split updateKit into planKitUpdate and applyKitUpdate, keep updateKit as their immediate composition, and use renderUpdatePlan for both CLI forms and the completed update. The planned value carries the candidate bytes, retained manifest, instance mutations and proposed receipt date/path; only apply writes the destination, pending journal, receipt and registry. The receipt writer shares its filename calculation with planning. Unchanged kept paths retain the existing replace classification, and instance-owned collisions retain no manifest hash. A core preview without --apply lists actions as preserved/no opt-in; with --apply it runs the same opt-in and action checks as an update.",
  "evidence": [
    "scripts/launchpad.mjs planUpdate, planKitUpdate, applyKitUpdate, renderUpdatePlan and CLI",
    "scripts/lib/siblings.mjs receiptPath and writeReceipt",
    "docs/evidence/WO-203/launchpad-targeted.log: 14 passing cases; core previews matched 879 plan rows for both opt-in states and preserved every destination, receipt and registry byte"
  ],
  "rationale": "Goal traps: a separate preview planner could drift from apply, so both use the same planned value and renderer; a claimed zero-write preview could hide the source runtime build, so documentation explicitly bounds preservation to destination and sibling records; calling every refusal a Git conflict would overstate the existing planner, so the revision form describes conservative update judgments. NoOp leaves the first visible plan after writes. The targeted fixture matches the intended inspect-before-update outcome.",
  "rejected": [
    { "option": "Write into a temporary destination and diff it", "reason": "The existing planner already judges without destination writes; a copied apply adds cost and a second path." },
    { "option": "Change replace to unchanged in this order", "reason": "The work order preserves update behavior and asks for parity; the README explains that replace can keep identical bytes." },
    { "option": "Require an unedited local harness manifest to report the prior build", "reason": "Local edits are retained kit refusals, not a new reason to stop the remaining update. Unreadable snapshot metadata is reported as unknown." }
  ],
  "reopenWhen": "A preview and immediate update disagree on unchanged inputs, or a future update contract introduces an unchanged category or persistent plans."
}
```

## WO-203-D003 — A pinned starter revision and honest snapshot metadata

```json
{
  "id": "WO-203-D003",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Resolve --from to a commit once under exportEnvironment, then read the kit manifest, action declaration and harness manifest from that pinned revision. Reuse the disk manifest validator and read the typed actions and declared fnv1a64 snapshot from that revision. A starter can be a true fork or re-emit its harness while retaining prior kit manifest hashes, so metadata is shape-validated without imposing equality to those retained hashes. The current snapshot is metadata rather than verification of current runtime bytes. Report-only action planning bypasses application opt-in, supplies the default configuration draft when no file exists, and describes hypothetical manual actions after a Git merge. It never writes a receipt or performs a merge.",
  "evidence": [
    "scripts/lib/harness.mjs harnessInstallation computes runtimeSnapshot from ordered per-runtime-file hashes, separately from KIT-MANIFEST.json's SHA-256 records",
    "scripts/launchpad.mjs readManifest, previewFromRevision, manifestBuildHash and planInstanceActions",
    "scripts/test-launchpad.mjs fetched-starter fixture: bare remote, initial fork, fetched changed revision, local edit, occupied new path and incoming actions read despite a different local declaration"
  ],
  "rationale": "Correction to the order's two-read cost estimate: SHA-256 kit entries do not contain the declared fnv1a64 build snapshot. A third metadata blob read plus one revision-resolution call is required to show the existing build identity accurately; this adds no write or dependency. The plan's replace/refuse rows do not compute Git's three-way merge result. The client README states the manifest boundary and manual action semantics.",
  "rejected": [
    { "option": "Present a hash of the SHA-256 manifest entries as the receipt's build hash", "reason": "It is a different identity and would mislabel the value." },
    { "option": "Resolve the caller's branch independently for each blob", "reason": "A moving ref could combine metadata from different revisions." },
    { "option": "Run the merge or apply the instance actions during revision preview", "reason": "The operator retains both actions; the work order authorizes inspection only." }
  ],
  "reopenWhen": "The kit schema carries a directly usable build identity, or a later order authorizes precise Git merge prediction or action application inside an instance."
}
```

## WO-203-D004 — Carry-in dispositions and the remaining pre-build bound

```json
{
  "id": "WO-203-D004",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Address FUP-584d6021928bdfdb's three allocated items. First, preparation calls an update preflight after reading the pinned commit's sources and before building: absent still-carried source paths and determinable derived paths refuse there, preserving the interrupted-update dropped-path exception. Generated compiled and emitted paths still receive their full check after building because their incoming set is not yet known; that optimization remainder is left. Second, post-manifest receipt/registry failures carry the completed update plan into the CLI summary and retain exit 1 with distinct destination/receipt-state diagnostics; pending-journal cleanup failure also names its state and carries the plan. Export's existing error already names its completed destination and receipt state. Third, disk and Git manifests share validation; configuration and sibling declarations now share object/text/known-key primitives, and the sibling/work-order generators share the stale-line calculation in scripts/lib/validation.mjs. Their schema-specific error prefixes remain unchanged, and the emit closure pins the new helper.",
  "evidence": [
    "docs/evidence/WO-078/decisions.md D004 and D009",
    "Read-only carry-in worker reviewed the cited planner, preflight, journal and error paths; source destinations differ from incoming compiled/emitted sets",
    "scripts/launchpad.mjs prepareKit preflight, applyKitUpdate and CLI catch; scripts/lib/validation.mjs and its callers",
    "scripts/test-launchpad.mjs missing-input cases assert unchanged build-output inode and mtime; post-manifest failure case distinguishes receipt failure from registry failure"
  ],
  "rejected": [
    { "option": "Treat every absent kitPath as still carried before building", "reason": "Membership in an allowed tree is not evidence the incoming build contains that path; it would break legitimate removals and interrupted retries." },
    { "option": "Infer the incoming generated set from stale dist files", "reason": "The old build cannot establish the next build's output set." },
    { "option": "Leave all duplicate validators in place", "reason": "The existing second consumers and shared checks warrant the small pure extraction without changing any schema." }
  ],
  "followup": "If a future compiler or harness change exposes an authoritative incoming generated-path inventory before atomicBuild, use it in the update preflight to reject absent still-carried compiled/emitted kit files before building. Keep the final planUpdate check, legitimate upstream removals and pending-manifest dropped-path exception; cover packages/*/dist and emitted harness paths in scripts/test-launchpad.mjs. Until then the remaining cost is one source build before an input refusal, with no destination or sibling-record write.",
  "reopenWhen": "An authoritative generated-path inventory becomes available before the build, or measured operator cost warrants implementing one within an adjacent compiler/harness order."
}
```

## WO-203-D005 — Independent review removes an invalid true-fork restriction

```json
{
  "id": "WO-203-D005",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Accept the criteria adversary's one finding and remove the new incoming metadata hash-equality check. The pinned revision is the source of incoming action and harness metadata, and the existing true-fork rule permits those files to differ from retained kit hashes. Preserve shape validation, add a starter-side edit case with retained hashes, and correct D003 in place. The independent design improver reported zero findings. Also replace a faulty test assumption that a registry host without Git must fail: the observed command returned success, so the fixture now plants a nonregular registry path to exercise the intended post-receipt error deterministically.",
  "evidence": [
    "docs/evidence/WO-203/self-review.md: fresh criteria adversary 1 finding; fresh design improver 0",
    "scripts/test-launchpad.mjs fetched-starter test edits incoming KIT-ACTIONS.json and valid harness metadata while preserving the kit manifest hashes",
    "docs/evidence/WO-203/launchpad-targeted-final.log: post-manifest fixture expected status 1 and observed 0; other update cases passed"
  ],
  "rejected": [
    { "option": "Require the starter to rewrite its kit manifest hashes after every valid edit", "reason": "That changes the existing retained-hash ownership contract instead of making its preview work." },
    { "option": "Keep the nondeterministic registry failure setup", "reason": "It did not establish the error path the test claims to cover." }
  ],
  "reopenWhen": "Revision preview rejects valid starter edits, or the deterministic receipt/registry failure fixtures no longer exercise their named states."
}
```

## WO-203-D006 — Bounded preparation comparison and release scope

```json
{
  "id": "WO-203-D006",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Keep shared in-memory preparation rather than staging an export to inspect it. The existing bounded comparison ran both arms against the same incoming kit and found identical bytes across 870 files (16,025,627 bytes): preparation took 2,407 ms and staged export plus reading took 2,825 ms in the final targeted run. The new core previews took a source build and no destination/sibling writes. Stage only the application's declared minor v0.79.0; no package source or dependency changed, so every component version remains unchanged and all package-publication refusals remain installed.",
  "evidence": [
    "docs/evidence/WO-203/launchpad-regression.log: 15 passing cases in 111,032 ms; bounded comparison equal:true, preparedMs:2407, stagedExportAndReadMs:2825",
    "npm run release -- prepare --local assigned v0.79.0 above local v0.78.0",
    "npm run release -- check-surfaces --local passed the application target, all six unchanged component versions, exact workspace pins and package-publication refusals"
  ],
  "rationale": "Both comparison arms produced the same kit bytes. Preparation avoids destination effects and measured 418 ms less in this fixture; these local timings do not promise a speedup on another host. The in-instance preview uses Git metadata reads and tree hashing without a source build. No live feedback episode or edition re-mint is required because the changed launchpad sources are machinery, not registered feedback evidence inputs.",
  "rejected": [
    { "option": "Bump every component with the application", "reason": "The package source trees are unchanged and the release check requires only changed components to move." },
    { "option": "Use the staged-copy arm for previews", "reason": "It produces no additional planning evidence and pays the export's writes and checks." }
  ],
  "reopenWhen": "Candidate bytes diverge between the two arms, a changed package source requires its own version bump, or representative timings change the cost tradeoff."
}
```

## WO-203-D007 — Carry the extracted dependency into bounded fixture copies

```json
{
  "id": "WO-203-D007",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Repair this implementation's fixture dependency lists: test-harness, test-configuration-root and test-outward-lint copy config.mjs into small script trees, so they must also copy its new pure validation.mjs dependency. The first full review gate exposed ERR_MODULE_NOT_FOUND in harness fixtures. Stop that failed run with harness evidence --stop, preserve its output, add the missing dependency to all three observed bounded copies, check the affected cases, and rerun format and both required gates. Keep the shared validators and existing assertions.",
  "evidence": [
    "First npm test -- --review run: harness-fixtures cases 53, 54, 55, 61 and 71 failed; errors name scripts/lib/validation.mjs imported from the copied config.mjs",
    "node scripts/harness.mjs evidence --stop stopped the owned review gate after 176.5 s and recorded no passing check",
    "Repository search for config.mjs in scripts and package tests found bounded copy lists in scripts/test-harness.mjs, scripts/test-configuration-root.mjs and scripts/test-outward-lint.mjs"
  ],
  "rejected": [
    { "option": "Remove the shared validator extraction to satisfy incomplete fixture copies", "reason": "The extraction addresses the allocated carry-in without changing schemas; copied import closures must include its dependency." },
    { "option": "Suppress or skip the failing harness fixtures", "reason": "The failures identify an incomplete test installation and the existing assertions remain useful." }
  ],
  "reopenWhen": "Another bounded script copy omits a transitive dependency, or the corrected fixture/import checks fail."
}
```

## WO-203-D008 — Preserve the import-closure order and replay the supervisor timeout

```json
{
  "id": "WO-203-D008",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Keep EMIT_CLOSURE sorted as its existing import-graph fixture requires: move the new validation.mjs entry after terms.mjs without changing membership. The second full review gate also reported that the unchanged supervisor signal test did not observe its episode group within five seconds. Stop the failed gate, retain its failure evidence, and replay both cases sequentially under the same suiteEnvironment. Both passed; the supervisor timeout's cause is unestablished, so retain its implementation, deadline and assertions and rerun the required gates at the corrected code identity.",
  "evidence": [
    "Second npm test -- --review run: launchpad emit-closure fixture expected a sorted declaration and found validation.mjs between config.mjs and git.mjs; preview cases preserved all three trees and matched 879 plan rows in both opt-in modes",
    "The same gate: skeleton WO-184 criterion 17 failed after 5159 ms with episode group never started; no package source changed",
    "node scripts/harness.mjs evidence --stop stopped the owned run; no passing complete check was recorded",
    "docs/evidence/WO-203/gate-repair-probe.log: unchanged supervisor signal test passed in a 1416 ms run; corrected import-closure test passed in a 7660 ms run"
  ],
  "rationale": "The existing closure assertion establishes the ordering contract directly. A passing isolated replay does not establish why the concurrent gate timed out; it is evidence to retry the full gate, not evidence to weaken the test. The executor initially missed the earlier skeleton failure in progress excerpts, then checked the full failure records and corrected the status in the conversation.",
  "rejected": [
    { "option": "Sort the expected value inside the test", "reason": "The declaration was already sorted; preserving that contract is the smaller correction." },
    { "option": "Extend the supervisor deadline or suppress the signal test", "reason": "No checked evidence establishes a defect in the implementation or the deadline, and the unchanged test passed on replay." }
  ],
  "reopenWhen": "The supervisor startup timeout reproduces and diagnostic evidence identifies its cause, or the import-closure graph and declaration differ again."
}
```

## WO-203-D009 — Bound the supervisor fixture's readiness observation

```json
{
  "id": "WO-203-D009",
  "date": "2026-10-12",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "Reopen D008 after the next shared full gate reproduced the supervisor startup timeout. Repair only packages/skeleton/test/resident-actors.test.ts: poll its durable readiness file, retain early supervisor IPC/exit failures, use the existing scheduler-aware deadline helper with a measured 3000 ms solo baseline and the unchanged 5000 ms standalone minimum, and request graceful supervisor cleanup before forced cleanup. Keep every SIGINT, SIGTERM, SIGHUP and process-group assertion. No runtime source, dependency or component API changes.",
  "evidence": [
    "Third npm test -- --review run: the same supervisor startup test failed with episode group never started after 10222 ms across its signal loop; the owned gate was stopped without a passing complete row",
    "docs/evidence/WO-203/supervisor-diagnostic.log: guarded single-case diagnostic passed; docs/evidence/WO-203/supervisor-ordered-diagnostic.log: original file position and all 509 skeleton cases passed with startup capture, while the signal case took 6862 ms across three signals",
    "docs/evidence/WO-203/supervisor-startup-baseline.log: guarded isolated startup measurements were 2985, 245 and 275 ms; round the observed maximum to 3000 ms for deadlineLimit",
    "packages/skeleton/src/gate-deadlines.mjs: standalone retains the minimum; declared shared load scales the measured baseline by two per scheduler slot and records deadline-hit classification",
    "docs/evidence/WO-203/supervisor-repair.log: the original signal assertions passed under standalone and declared four-slot load; bounds were 5000 and 24000 ms respectively",
    "Canonical adjacent queue: adjacent-0001 announced, actor-attested steering check recorded, and started after the queue was reread; the executor remained the sole writer"
  ],
  "rationale": "The original test trusted one filesystem event, discarded partial-read errors and hid early supervisor failure behind a timer. Those observation defects are directly visible in source. Load sensitivity is an inference from two shared-gate failures versus passing isolated and ordered package runs; neither a lost notification nor a slow prelaunch has been established as the historical timeout's exact cause. The repair observes durable state and exposes the next failure, while using the project's measured-load rule rather than an arbitrary unbounded wait. A scratch diagnostic initially changed file order, so its pass was not treated as an equivalent whole-suite replay; the ordered replay retained all cases.",
  "rejected": [
    { "option": "Keep repeating the full gate without better startup observations", "reason": "The second occurrence satisfied D008's reopening condition and still hid the underlying startup result." },
    { "option": "Claim the runtime's signal teardown was broken", "reason": "Both failures occurred before a signal was sent, and all teardown assertions passed in the isolated and ordered package runs." },
    { "option": "Skip a signal, suppress its assertion, or use an unbounded startup wait", "reason": "Those choices would remove the behavior the existing fixture protects." }
  ],
  "reopenWhen": "The calibrated deadline is hit within declared load, early-failure diagnostics identify a runtime defect, or the fixture leaves a process group after failure."
}
```

## WO-203-D010 — Give each vertical test file its own bounded task

```json
{
  "id": "WO-203-D010",
  "date": "2026-10-12",
  "dispatch": "resume: next; adjacent-0001 revision 2",
  "decision": "Expand the existing vertical suite into three canonical file tasks, retaining its declared files, Node flags, product-read guards, confinement requirements and the existing 900000 ms task limit. Each file task retains two reserved scheduler slots, so capacity four admits at most two vertical files concurrently. Existing prefix aggregation requires every file task to pass. Keep the already passing supervisor fixture repair.",
  "evidence": [
    "docs/evidence/WO-203/vertical-timeouts.json: two complete gates at the unchanged code identity failed only vertical, with no completed-case assertion failure; the full first run passed launchpad, skeleton and the other 32 suites",
    "First run: the judgment file completed 37 cases in 560566 ms before recovery obtained a Node file worker; recovery then completed seven cases in 299975 ms and was interrupted in its eighth case by the suite deadline",
    "Unchanged canonical retry: 85 passing task executions were reused, format and vertical ran fresh, and vertical again timed out after 900178 ms; judgment completed in 546172 ms before recovery completed seven cases in 302008 ms",
    "scripts/test-runner.mjs expandSuiteTasks and aggregateSuiteRows already give release cases separate task budgets and require complete prefixed-member coverage",
    "docs/evidence/WO-203/vertical-task-fixtures.log: executable sentinels prove all three files run exactly once; missing, duplicate, failed, timed-out and unexecuted members fail aggregation; the scheduler admits at most two file tasks",
    "The first full gate after task expansion exposed four missing machinery source declarations introduced by the fixture changes: scripts/lib/validation.mjs for harness-fixtures and all three vertical test paths for runner-fixtures. The owned gate was stopped, the exact missing paths were added to the source inventory, and the coverage assertion remains unchanged.",
    "Canonical adjacent queue revision 2 extends the current bounded validation repair to scripts/test-runner.mjs and scripts/test-runner.test.mjs after a new intent announcement, actor-attested check-in and reread"
  ],
  "rationale": "The checked defect is that time queued behind another file consumes recovery's aggregate task deadline. This is not evidence of a preview defect or a stuck test. The unchanged retry was a bounded comparison with 85 reused passes and no fresh peer suite; it reproduced the limit, so another identical retry is not justified. Splitting tasks retains a finite bound for each executing file while giving the aggregate suite separate task budgets. Completed main-file case durations of 835558\u2013849405 ms are not a complete-file pass: each resulting task must still pass its actual deadline.",
  "rejected": [
    {
      "option": "NoOp or another identical retry",
      "reason": "Both completed attempts timed out with continued progress; the second already removed fresh peer suites."
    },
    {
      "option": "Raise or remove the fixed task deadline, skip cases, or mark the aggregate passed from partial case results",
      "reason": "Those choices do not repair the observed queue accounting and would weaken or misstate the required evidence."
    },
    {
      "option": "Run the same unsplit suite with --serial",
      "reason": "The option only changes the outer scheduler; the internal two-file worker queue and its shared task deadline remain."
    }
  ],
  "reopenWhen": "A single vertical file times out, a declared file is omitted or executed twice, the two-file bound changes, or task composition admits incomplete coverage."
}
```

## WO-203-D011 — Verification: fail; criterion 3 is unmet because the revision preview cannot show what the merge changes

```json
{
  "id": "WO-203-D011",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001. At code identity 5dada0db317a1eb9181f2f944ef18acc39d52ab6374476cab6b6797aca3269fe, criteria 1, 2, 4, 5 and 6 are met and criterion 3 is unmet. F1 (blocking, criterion 3): preview --from <ref> does not identify the kit files the merge will change. planUpdate classifies every kept path as replace, including paths whose incoming manifest hash equals the instance's current bytes, and renderUpdatePlan prints one undifferentiated replace row for each. F2 (blocking, criterion 3): the report-only revision preview refuses outright, printing no plan row and no declared action, when one incoming action cannot be applied to the instance. F3 (follow-up): a locally modified kit path whose incoming hash equals its prior hash is printed as a locally modified refusal. The order's design reads that row as a merge conflict, but Git merges such a file cleanly and keeps the local edit.",
  "evidence": [
    "F1 probe, synthetic starter, bare remote and fork in session scratch, under harness bounded (2026-10-12). Revision B changes a.md, the harness snapshot and KIT-ACTIONS.json, drops c.md, adds d.md and leaves e.md and f.md unchanged. The fork's preview --from origin/main prints 'kit files: 5 replaced', with 'replace:' rows for a.md, e.md and f.md that cannot be told apart. preview --from HEAD, a revision whose manifest equals the instance's own (the merge is a no-op), prints 6 replace rows.",
    "F1 source: scripts/launchpad.mjs:1404-1428 counts a path as kept when the current bytes equal the incoming, prior or pending hash, and pushes kind replace whenever the incoming manifest carries it. scripts/launchpad.mjs:1949 renders every non-refused row as '<kind>: <path>'. The fetched-starter fixture asserts only that 'replace: <changed>' is present (scripts/test-launchpad.mjs:2403). The core fixture records 879 matching plan-filter lines for a revision that changes a few kit paths (docs/evidence/WO-203/launchpad-regression.log:27-28).",
    "F1 disclosure: scripts/kit/README.client.md:336 says replace includes files whose bytes already match, and line 387 says an unchanged upstream path may still be listed as replaced. Disclosing the gap does not make the output name the changed files.",
    "F2 probe, same fork: the starter adds a change-phrase action whose 'from' phrase the fork's instance-owned CLAUDE.md does not contain. preview --from origin/main exits 1 with 'cannot apply probe-phrase: expected one phrase in .../CLAUDE.md' and prints zero stdout lines. Source: previewFromRevision calls planInstanceActions with reportOnly (scripts/launchpad.mjs:1891), and reportOnly mode still throws at scripts/launchpad.mjs:1640-1643.",
    "F3 probe, same fork: b.md is edited locally and unchanged upstream. The preview prints 'refused: .../b.md (locally modified; ...)'. In a throwaway copy, a real git merge of origin/main conflicts only on d.md (add/add) and leaves b.md unconflicted.",
    "Reproduced without finding: D005's retained-hash starter edit (KIT-ACTIONS.json bytes differ from the retained manifest hash) previews with exit 0 and both incoming actions. preview refuses a missing --from value, extra arguments, an option-like ref, a tree ref and a subdirectory root without a manifest, and every probe leaves the fork tree byte-identical."
  ],
  "rejected": [
    {"option": "Judge criterion 3 met because 'replace: <changed>' appears in the output", "reason": "The criterion asks the preview to print the kit files the merge will change. A list that labels every unchanged kit file the same way, and reports 6 replacements for a no-op revision, does not identify them, and the operator's stated aim is to know what will come in."},
    {"option": "Route F2 as a follow-up", "reason": "For a realistic input, an instance-owned contract that no longer carries an action's phrase, the preview prints neither the declared actions nor any plan row that criterion 3 requires. The README calls those actions hypothetical manual work after the merge."},
    {"option": "Fail on F3", "reason": "Criterion 3 names a locally modified kit file as refuse, and the README discloses the conservative judgment. It breaks no criterion and no behavior main had."},
    {"option": "Change the update's writes or plan kinds to repair F1", "reason": "Not required. The criterion needs the changed set identified. The update's writes, receipt and the WO-078 update cases must stay as they are (planning receipt criterion:2)."}
  ],
  "reopens": {"decisionId": "WO-203-D002", "observation": "D002 rejected an unchanged classification for parity. The revision preview's criterion requires the kit files the merge will change, which the current replace rows do not identify. Parity is kept as long as both forms share the planner and renderer."},
  "followup": "WO-203 resume: fix. (F1) preview --from <ref> identifies the kit files whose incoming manifest hash differs from the instance's current bytes, separately from kit files the merge leaves unchanged. A revision whose manifest equals the instance's reports no changed kit file. Keep one planner and one renderer, so the core preview's plan rows still equal the following update's (criterion 2), and leave the update's writes, receipt and existing update cases unchanged. Extend the fetched-starter fixture to assert that an unchanged kit path is not presented as changed, and bring the README rows in line. (F2) In the report-only revision preview, an incoming action that cannot apply to this instance becomes its own action-plan row naming the reason. The kit plan rows and every declared action still print, and the preview is not refused for it. The core --apply preview and the update keep refusing before any write. Add a fixture case with an unappliable change-phrase action against an instance-owned CLAUDE.md. Check: npm test -- --only launchpad, npm test -- --review and npm run test:docs. (F3, boarded) Once rows distinguish changed paths, label a locally modified refusal whose incoming hash equals its prior hash as unchanged upstream (no merge conflict expected), in the revision preview's rows and README.",
  "reopenWhen": "A repair changes planUpdate, planInstanceActions' report-only mode or renderUpdatePlan; a revision preview again labels an unchanged kit path like a changed one; or a report-only preview refuses on an action it only describes."
}
```

## WO-203-D012 — Repair the revision rows and isolate incompatible manual actions

```json
{
  "id": "WO-203-D012",
  "date": "2026-10-12",
  "dispatch": "resume: fix; VER-001",
  "decision": "Keep planUpdate's mutation kinds, retained hashes and apply semantics, and add its observed current/incoming and prior/incoming hash comparisons to each row. The shared renderer uses those comparisons in revision previews to classify byte-identical paths as unchanged, counting them separately from replacements, additions and removals. A refused local edit with an unchanged incoming manifest hash is annotated unchanged upstream, no merge conflict expected. In report-only action planning, isolate each hypothetical action's configuration, writes and renames: an incompatible action becomes a cannot-apply row with its reason, its staged effects are discarded, and later actions are still assessed. Actual core --apply previews and updates retain their pre-write refusal. Correct the README and the two in-place product clauses. This closes the three repair rules D011 names within the existing launchpad paths.",
  "evidence": [
    "docs/verifications/WO-203/VER-001.md F1: an identical revision reports six replacements; F2: an incompatible phrase action exits 1 with no plan output; F3: a local edit unchanged upstream is unconflicted in a real merge",
    "scripts/launchpad.mjs planUpdate already reads the current, prior, pending and incoming hashes; applyKitUpdate consumes mutation kinds rather than the new comparisons",
    "scripts/launchpad.mjs planInstanceActions previously shared one mutable draft and threw on any action; report-only mode now restores a failed action's draft, renames and writes and validates hypothetical configuration changes per action",
    "scripts/test-launchpad.mjs assertions cover an identical revision, changed versus unchanged paths, a locally modified path unchanged upstream, already-converged replacement/addition and an already-absent removal, missing and ambiguous phrases, an invalid configuration default, an occupied rename destination and a following valid action; both core --apply forms must still refuse without a pending journal",
    "docs/evidence/WO-203/repair-targeted.log: harness-bounded update fixture passed 14 tests, zero failures, in 108449 ms at 2026-10-12T22:14:12.582Z; both core preview opt-in states matched 880 plan rows and preserved all three protected trees"
  ],
  "rationale": "Goal traps: changing mutation kinds could alter core update and retry behavior, so only revision rendering interprets the shared hash comparisons; a separate preview planner could drift from apply, so no second planner is introduced; swallowing an action error could leak a partially changed draft into later results, so failed hypothetical actions restore their staged state. NoOp leaves criterion 3 unmet. The intended outcome is a complete inspect-before-merge report with honest unchanged rows and actionable manual failures.",
  "rejected": [
    { "option": "Change unchanged paths' apply kinds", "reason": "The existing update and interrupted-update behavior is part of the repair's preserved obligation; comparing bytes supplies the revision distinction without changing writes." },
    { "option": "Catch only change-phrase errors", "reason": "An incompatible rename or invalid configuration default is the same report-only failure class and must retain a row rather than abort the report." },
    { "option": "Catch the whole action planner and omit its results", "reason": "That loses the individual reasons and every later declared action's assessment." }
  ],
  "reopens": {
    "decisionId": "WO-203-D011",
    "observation": "The repair implements D011's two blocking rules and its boarded row clarification. The previous handoff incorrectly treated the presence of a changed path's replace row as sufficient; VER-001 shows that it did not identify the changed set. This repair adds distinct unchanged rows and complete per-action reporting. Passing evidence and criterion judgments are recorded in the repaired handoff."
  },
  "reopenWhen": "A revision preview again counts a byte-identical path as changed, an incompatible manual action suppresses kit or later action rows, or the core update's preserved mutation/refusal behavior changes."
}
```

## WO-203-D013 — Preserve declaration values across hypothetical draft changes

```json
{
  "id": "WO-203-D013",
  "date": "2026-10-12",
  "dispatch": "resume: fix; adjacent-0002",
  "decision": "Repair the observed reference-sharing defect within the same action planner and fetched-starter fixture: clone an add-config-field declaration's value before inserting it into the mutable configuration draft. Preserve the incoming declarations exactly while later hypothetical actions change or restore the draft. Extend the existing fixture with an object-valued release default before an invalid nested default, and retain a bounded direct probe. This is a bounded adjacent repair in the current paths with the shared checks, recorded at adjacent-0002 revision 1.",
  "evidence": [
    "scripts/launchpad.mjs add-config-field branch assigned parent[key] = action.value, sharing an incoming object with the mutable draft",
    "docs/evidence/WO-203/action-value-before.log: the harness-bounded direct revision probe failed in 285 ms at 2026-10-12T22:23:23.608Z; an incoming release value {} became {invalidDefault: true} despite the failed action's draft rollback",
    "node scripts/harness.mjs evidence --stop at 2026-10-12T22:22:26.431Z stopped the owned review gate; its terminal reported stopped by request after 223.1 s with no check recorded. No gate input was edited while it ran.",
    "Fixture correction: the occupied-destination action used root orders with from docs/work-orders, but scripts/lib/config.mjs maps workOrders to docs/work-orders and orders to docs/control/orders. Change the declared root to workOrders so the case exercises its occupied destination rather than a mismatched source root.",
    "docs/evidence/WO-203/action-value-after.log: the same bounded probe passes after cloning declaration values; the incoming empty object is preserved and the later valid default is assessed after the invalid one",
    "docs/evidence/WO-203/repair-targeted-final.log: 14 passed, zero failed, 109290 ms, ended 2026-10-12T22:28:47.624Z. The fetched-starter output preserves every original declaration including the empty object; both core preview modes match 880 following-update plan rows and preserve all three protected trees."
  ],
  "rationale": "A restored draft alone does not restore an aliased input declaration. Clone at the boundary where data enters mutable planning state; this keeps the action report faithful and gives failed actions no mutation path back to their source. Actual application receives the same values and preserves its validation and write behavior. NoOp leaves an incorrect action declaration in the preview. The stopped review run is not passing evidence and the final required gates rerun after the repair.",
  "rejected": [
    { "option": "Restore every incoming action after each failure", "reason": "A successful nested default can also mutate an earlier declaration; separating input data from the draft closes both paths without reconstructing the declarations." },
    { "option": "Defer the observed defect", "reason": "The fix is one assignment in the current action-reporting paths, and the existing fetched-starter fixture can assert the rule without another export or dependency." }
  ],
  "reopenWhen": "Hypothetical or actual action planning mutates the incoming declaration data, or object-valued configuration defaults cease to preserve their intended application values."
}
```

## WO-203-D014 — Partition the large execution file without omitting a case

```json
{
  "id": "WO-203-D014",
  "date": "2026-10-12",
  "dispatch": "resume: fix; adjacent-0002 revision 2",
  "decision": "Retain the action-value repair and extend the queued validation repair in scripts/test-runner.mjs and its existing fixtures. The main vertical file runs in two complementary tasks: its source-bound statement and wording matrices use a name pattern, and the remaining workflow cases use that same skip pattern. The judgment and recovery files remain their own tasks. Every task retains the existing 900000 ms limit, product read guard, confinement requirement and two reserved scheduler slots, admitting at most two vertical tasks at once. Aggregation still requires each declared task once with a passing result; missing, duplicated, unexecuted or timed-out members remain failures. Add an executable dispatch fixture covering each selected family, ordinary and future workflow names, and a nested selected case.",
  "evidence": [
    "docs/evidence/WO-203/repair-review-failed.json: npm test -- --review at code identity 45c3b5d5bfb3445c29312563f4886c2c02a894e9907ff7c6134f153e7846d070 recorded exit 1 at 2026-10-12T23:09:24.066Z after 2230105 ms; 35 suites passed and only vertical:file:test-vertical.mjs failed, failureKind timeout, 900185 ms. Launchpad passed 487280 ms, judgment 583510 ms and recovery 376390 ms as the terminal recorded.",
    "scripts/test-runner.mjs expandSuiteTasks creates one task per vertical file; executeSuite's clock therefore includes every case in the main file. nodeTests already supports name and skip patterns and aggregation rejects incomplete coverage.",
    "scripts/test-vertical.mjs contains large composed-baseline, requirement-voice, resident statement-role and healthy-wording matrices before later restart, authority and crash-recovery cases; the failed terminal reached the in-flight resident cases after the wording matrix, leaving later cases unexecuted.",
    "scripts/test-runner.test.mjs already proves the two-task concurrency bound and refuses missing, duplicate, unexecuted and timed-out task results; extend its real-process dispatch test to judge cases across complementary partitions.",
    "docs/evidence/WO-203/vertical-partition-fixtures.log: both bounded fixtures passed at 2026-10-12T23:16:24.558Z in 772 ms. Real child-process output executes all four selected families, ordinary and future workflow names, and a nested selected case exactly once; scheduling admits two tasks, and incomplete or failed aggregation is refused."
  ],
  "rationale": "Goal traps: filtering without a complement could silently lose tests, so the same regular expression selects one task and excludes it from the other, with actual process output proving each case once; loosening the timer would change the existing resource bound, so each task keeps 900000 ms; adding tasks could overfill the host, so each still reserves two of four slots. NoOp leaves criterion 6 unmet. The named failure is total workload under one task clock, not an observed failed product assertion; the fixture code and assertions remain intact.",
  "rejected": [
    { "option": "Raise the execution file's deadline", "reason": "It changes the standing task bound instead of making a large workload dispatch within that bound." },
    { "option": "Run only the cases left after the timeout and call the gate passing", "reason": "The required gate judges complete coverage at the current identity, and the failed partial execution cannot supply it." },
    { "option": "Split the test source physically and extract all shared setup", "reason": "The existing runner already supports complementary selection; moving the large fixture's setup and source is wider than this dispatch repair." }
  ],
  "reopens": {
    "decisionId": "WO-203-D010",
    "observation": "Separate file clocks removed queued-file time, but the main file's own workload still exceeded one clock in the fresh repair gate. Preserve that split and partition only this file's large matrices."
  },
  "reopenWhen": "A vertical task omits or duplicates a case, loses its guards or bound, or either complementary partition again exceeds the standing task deadline."
}
```

## WO-203-D015 — Verification follow-up: a revision preview refuses when the instance removed a kit file

```json
{
  "id": "WO-203-D015",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Board VER-002 F1 as a follow-up; it does not block. At code identity 4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1, preview --from <ref> refuses the whole preview when the instance has removed a manifest-listed kit file that the incoming revision still carries. It prints no plan row and no declared action, while Git merges that revision without touching the removal. Class: report-only refusal on a kit input (operator flow), in the declared planUpdate and previewFromRevision surfaces. It breaks no criterion. Criterion 3 names locally modified kit files, occupied new paths, the changed kit files and the declared actions. The refusal names the path. The client README's update paragraph already says missing still-carried kit files refuse by path. main had no preview.",
  "evidence": [
    "VER-002 probe, synthetic starter, bare remote and fork in the DotLn session scratch, under harness bounded (2026-10-13). Starter revision B changes a.md, drops c.md, adds d.md and leaves e.md unchanged. The fork commits git rm of .claude/skills/probe/e.md. preview --from origin/main exits 1 with empty stdout and 'error: cannot read regular file: <fork>/.claude/skills/probe/e.md', and leaves the fork byte-identical. A real git merge of origin/main in a throwaway copy conflicts only on the d.md add/add and leaves e.md removed.",
    "Source: planUpdate throws on a path that is absent, listed in the prior manifest, carried by the incoming manifest and not dropped by a pending update (scripts/launchpad.mjs:1401-1402). This is the core update's input-failure rule, which previewFromRevision shares by design (D002, D003).",
    "VER-002 differential probe: the VER-001 subject (refs/dotln/checkpoint/WO-203/3) and the current subject return the same error for this input. The repair neither introduced nor changed it."
  ],
  "rejected": [
    {"option": "Fail VER-002 on it", "reason": "Criterion 3's named cases all print. The refusal is the shared planner's documented input rule and names the path the operator must restore. Product 07 routes a defect that breaks no criterion and no behavior main had as a follow-up, so the repair loop ends when the criteria hold."},
    {"option": "Drop the refusal for every caller", "reason": "The from-core update must still refuse an absent still-carried file before writing (WO-077, WO-078). Only the report-only revision preview describes rather than applies."}
  ],
  "followup": "In the in-instance revision preview only (preview --from <ref>), an absent manifest-listed kit path that the incoming manifest still carries becomes its own row naming a local removal. When its incoming hash equals its prior hash, the row is marked unchanged upstream. Every other kit row and every declared action still prints, and the preview exits 0. The from-core preview and the update keep refusing such a path before any write. Add a fetched-starter fixture case with a committed instance removal, and a README line in Taking upstream updates. Check: npm test -- --only launchpad and npm run test:docs.",
  "reopenWhen": "An operator removes a kit file in an instance and the preview blocks a merge they meant to take, or the planner's absent-file rule changes."
}
```

## WO-203-D016 — Verification follow-up: the from-core preview lists byte-identical paths as replace

```json
{
  "id": "WO-203-D016",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Board VER-002 F2 as a follow-up; it does not block. On the real corpus, the from-core preview prints a replace row for every carried kit path whose bytes the update would rewrite unchanged, so the operator cannot read from it which kit files will change. Class: undifferentiated core preview rows (operator flow), in the declared shared renderer. Criterion 1 asks for each path's planned replace, add, remove or refuse, and the update does rewrite those paths, so the rows are accurate and criterion 1 holds. The README says replace includes files whose bytes already match. D002 and D012 deliberately kept the unchanged distinction to revision rendering.",
  "evidence": [
    "VER-002 real-corpus probe under harness bounded (2026-10-13). A depth-1 scratch clone of HEAD 7f5f2805 carries the subject's 25 changed files, committed, with node_modules copied. It exports the real kit of 866 files to a scratch destination named like a declared sibling. A core commit then edits scripts/kit/README.client.md, adds scripts/probe-added.mjs and declares one add-config-field action. export --update <starter> --preview prints 'kit files: 865 replaced; 1 added; 0 removed; 1 refused.'",
    "The update that follows renders the same 867 plan rows. In the starter's Git history it changes only UPSTREAM.md, scripts/kit/KIT-ACTIONS.json and scripts/kit/README.client.md, adds scripts/probe-added.mjs and rewrites KIT-MANIFEST.json, so 862 of the 865 replace rows rewrite identical bytes.",
    "planUpdate already records unchanged for every row (scripts/launchpad.mjs:1429-1433). renderUpdatePlan uses it only when planned.revision is set (scripts/launchpad.mjs:1952-1955)."
  ],
  "rejected": [
    {"option": "Fail VER-002 on it", "reason": "Criterion 1 is met as written, the README discloses the behavior, and criterion 3's changed-set duty applies to the revision preview, which now meets it. A defect that breaks no criterion is a follow-up."},
    {"option": "Change the update's mutation kinds", "reason": "Not needed: the planner's unchanged comparison already distinguishes the rows. Changing kinds would touch the update and retry behavior that the planning receipt's criterion:2 known issue protects."}
  ],
  "reopens": {"decisionId": "WO-203-D012", "observation": "D012 confined the byte comparison to revision rendering. On the real corpus, the from-core preview of an update that changes three kit files and adds one still lists 865 replacements, which does not tell the operator what will come in."},
  "followup": "The shared renderUpdatePlan labels and counts byte-identical replace rows as unchanged in the from-core preview and in the update's own summary alike, as it already does in the revision preview. This keeps the preview's plan rows equal to the following update's (criterion 2). Leave planUpdate's mutation kinds, the writes, the receipt and the WO-078 update cases unchanged, and align the README's Taking upstream updates rows. Extend the core preview fixture to assert that an unchanged carried path is not listed as replace. Check: npm test -- --only launchpad and npm run test:docs.",
  "reopenWhen": "An operator cannot tell from a from-core preview which kit files an update changes, or the update's summary format changes."
}
```

## WO-203-D017 — Final review: integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-203/10 -->

```json
{
  "id": "WO-203-D017",
  "date": "2026-10-13",
  "dispatch": "resume: final review; worktree integrate WO-203",
  "decision": "Integration took in nothing: the base and the fetched main are both 7f5f2805c2b9017897e0e1741f1e9518b10f4acc, origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-203/10), retained its named stash c955dba826e126fb4c22e944561f9f657f81d235, took the intake backup from a fresh npm run backup:intake of the three ignored intake files into the session scratch, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main; harness check passes with 34 surfaces), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. Every acceptance claim is carried forward unchanged: VER-002's six criterion judgments at code identity 4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1; the executor's passing npm test -- --review row at that identity (2026-10-13T00:00:37.363Z, 36 suites, 91 fresh tasks, exit 0); VER-001's F1 to F3 as repaired (D011, D012, D013; reproduced in VER-002's Earlier findings); VER-002's F1 and F2 as boarded (D015, D016); the executor's self-review (four read-only workers: found 1, fixed 1; the repair's two separate passes: found 2, fixed 2). gateCodeIdentity returned the same identity before and after integration, and the generated harness surfaces (.claude, .agents, .codex) have no diff against main. Release preparation keeps application v0.79.0 under the order's minor classification: local tags end at v0.78.0, origin lists v0.78.0 and no v0.79.0, check-surfaces --local reports the release block v0.79.0 over v0.78.0 and no component bump required for any of the six workspaces, and package.json, package-lock.json and packages/*/package.json are not in the diff, so no component version or dependency collides. No evidence edition is registered to this order (the launchpad is a declared machinery source, not a registered evidence source), so integration owes no re-mint. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper and npm test -- --review runs in the handoff sequence and is recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-203/10",
    "base 7f5f2805c2b9017897e0e1741f1e9518b10f4acc",
    "upstream 7f5f2805c2b9017897e0e1741f1e9518b10f4acc",
    "git ls-remote --heads origin at 00:37Z: refs/heads/main 7f5f2805; git log main..HEAD empty; git ls-remote --tags origin lists v0.78.0 and no v0.79.0",
    "release preparation: WO-203 target v0.79.0 remains current. Files changed: docs/evidence/WO-203/meta.json, docs/final-reviews/WO-203/PR.md. Meter snapshot: docs/evidence/WO-203/meta.json, 4051 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-13T00:39:10Z to 00:39:25Z, each exit 0: npm run publication:check (254/254 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.79.0 against latest local tag v0.78.0; six components src unchanged, no bump required; github-body-profile passes on PR.md), node scripts/lineage.mjs index --check (170 sections), node scripts/check-publication.mjs --print-locks (both locks equal the committed values), npm run format:check; git diff --check clean. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity before and after integration: 4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1; git diff --stat main -- .claude .agents .codex is empty"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-13. Original base: `7f5f2805c2b9017897e0e1741f1e9518b10f4acc`.
Fetched main: `7f5f2805c2b9017897e0e1741f1e9518b10f4acc`. Checkpoint: `refs/dotln/checkpoint/WO-203/10`.
Named stash retained: `c955dba826e126fb4c22e944561f9f657f81d235` (WO-203 integrate 2026-10-13).
Intake backup: `DotLn-wo203-intake-20261013T003842Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-203 target v0.79.0 remains current. Files changed: docs/evidence/WO-203/meta.json, docs/final-reviews/WO-203/PR.md. Meter snapshot: docs/evidence/WO-203/meta.json, 4051 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-002's six criterion judgments and the executor's passing review row at code identity `4de390c1…`, which the integrated tree keeps; VER-001's F1 to F3 as repaired (D011 to D013) and VER-002's F1 and F2 as boarded (D015, D016); the executor's self-review and repair passes (found 1, fixed 1; found 2, fixed 2). No acceptance claim changed, because integration changed no judged byte.
Authored conflicts observed: none.
Affected checks: three of the four printed checks pass on the integrated tree (evidence above); the review gate is in FINAL-001.

## WO-203-D018 — Final review: pass FINAL-001 at the integrated subject; the readiness row settled, the order's follow-ups left for planning

```json
{
  "id": "WO-203-D018",
  "date": "2026-10-13",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass the final review of WO-203 at the integrated subject, code identity 4de390c177f92ce4bb932ad47a79b8d3f592bed430674a702d377ce47958f7d1, the identity VER-002 judged; integration changed no judged byte (D017). All six criteria hold: the from-core preview prints every kit path's planned kind with the refusal's reason and retained hash, the declared actions as applied or preserved, the incoming commit and tag, the build hash before and after and the receipt it would write, exits 0 and leaves the destination and both sibling-record trees byte-identical with no pending manifest; the preview's plan rows equal the following update's, rendered by one function; the in-instance preview against a fetched starter revision prints the changed kit files apart from unchanged ones, a local edit as a refusal (annotated when unchanged upstream), an occupied new path as a collision and the actions declared at that revision including those that cannot apply, and refuses a root or revision without a manifest; the client README documents both forms, that a preview writes nothing and is not a receipt, and the rule to preview before every update; the write-backs land in place with FUP-584d6021928bdfdb's three items recorded as fixed and its generated-path remainder deferred; and the gates are green with git diff --check clean and no dependency change. This review found no new defect. VER-002's two follow-ups stay boarded (D015, D016) with their register rows untriaged for planning, together with D012's row that D016 reopened; they are the order's own boarded follow-ups, not seams this change opened, and fixing them at final review would change the planner's refusal rule and the update's own summary without fresh verification. Known issues: planning receipt 044's criterion:2 condition (a different tree, plan or receipt for the WO-078 update inputs after the split) did not occur on the available evidence: VER-002's 80-case differential probe found identical kinds, reasons, retained hashes and errors, the WO-078 update cases pass unchanged in the consumed gate, and the real-corpus update rendered the plan its preview showed; the one observable difference is that the receipt's date is fixed at the end of planning, earlier by the apply duration, with the same fields and path rule. Its criterion:1 condition (WO-118 held behind this order) did not occur: WO-118 is next in the sequence and this review closes the order ahead of it. Register: FUP-3b39865f91df30a7 is settled by D009's readiness-observation repair, with the case passing in the executor's two complete review gates after the repair and reused in this review's composed gate; FUP-b531e850b70f6d4e stays open with this order's launchpad task reading (480,677 ms in the passing review gate, 487,280 ms in the failed repair gate, against the pre-WO-201 123,776 ms reading) added to planning's bound question; FUP-dc79b4b1065bf66e stays deferred as the executor left it; the other 21 textually matched rows are left as they are because this change opened none of their seams and none of their conditions occurred. Product gate: this review's npm test -- --review row at 4de390c1… is composed (36 suites, exit 0, 8,813 ms, one fresh preflight task and 90 tasks reused from the executor's fresh row of 2026-10-13T00:00:37.363Z at the same identity), as product 07 §Discipline provides for a review gate at an identity whose tasks already passed.",
  "evidence": [
    "docs/final-reviews/WO-203/FINAL-001.md: criterion judgments, Executed checks and the findings block",
    "D017 (integration took in nothing)",
    "VER-002 (pass; D015, D016) at code identity 4de390c1…, report hash sha256:bc9f191a… equal to the recorded VerificationCompleted reportHash; VER-001 (fail; D011) report hash sha256:939cc5ed… equal to its recorded reportHash",
    "The executor's fresh npm test -- --review row at 4de390c1… recorded 2026-10-13T00:00:37.363Z: 36 suites, 91 fresh tasks, exit 0, 2,137,999 ms; launchpad 480,677 ms; the four vertical tasks 566,246, 361,423, 558,337 and 382,468 ms",
    "This review's npm run test:docs row at 4de390c1… recorded 2026-10-13T00:43:43.960Z: 35 passed, 0 failed, 133,536 ms, 35 fresh tasks; its npm test -- --review row recorded 2026-10-13T00:44:09.188Z: composed, 36 passed, 0 failed, 8,813 ms, 1 fresh and 90 reused tasks",
    "The affected checks and preflights under node scripts/harness.mjs bounded at 00:39:10Z to 00:39:25Z (D017); gateCodeIdentity before and after integration 4de390c1…",
    "npm run plan -- followups --touching: 27 matched of 253 pending at register revision 9f9681a8…, read over four pages; one apply request settles FUP-3b39865f91df30a7"
  ],
  "rejected": [
    {
      "option": "Fail the review on VER-002's F1 (a revision preview refuses when the instance removed a kit file) or F2 (the from-core preview lists byte-identical paths as replace)",
      "reason": "Each breaks no criterion and no behavior main had: F1 is the shared planner's documented absent-file rule, which the from-core update must keep, and F2's rows are accurate where criterion 1 asks for each path's planned kind. Product 07 routes such defects as follow-ups and ends the repair loop when the criteria hold."
    },
    {
      "option": "Fix D015 and D016 in this review within the Boy Scout bound",
      "reason": "Both change behavior the verifier judged on the real corpus: the planner's refusal rule and the update's own summary rows. A final review may admit low-risk adjacent cleanup, not a planner or renderer change without fresh independent verification; each is boarded with its repair rule and fixture duty."
    },
    {
      "option": "Rerun a fresh product gate instead of the composed row",
      "reason": "The code identity is unchanged from the executor's fresh passing row, and the runner composes a review gate from tasks that already passed at that identity by design; a fresh 36-minute rerun would add no evidence about the subject."
    }
  ],
  "reopenWhen": "A criterion judged met is shown unmet at this identity, the first real update or starter merge an operator previews disagrees with its preview on manifest-listed paths, or a register disposition above is shown wrong."
}
```
