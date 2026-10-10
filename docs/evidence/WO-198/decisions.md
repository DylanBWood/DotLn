# WO-198 decisions

## WO-198-D005 — Repair incomplete diagnostic baselines without hiding the failed gate

```json
{
  "id": "WO-198-D005",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "Validate both snapshots before comparing them. A complete snapshot has nonempty string originMain and main fields, a non-array tags object with a nonnegative safe-integer count and nonempty string newest, and a nonnegative safe-integer dotlnRefs. Missing or malformed snapshots supply no baseline, just like a legacy row; do not normalize missing fields, search past the latest row, or change the gate verdict. The current valid start/end interval remains independently comparable. Record the failed row and its summary even when the latest earlier same-check row is incomplete.",
  "evidence": [
    "VER-001 F1 and the checked sharedRefChanges source show tags.count was read before recordGateChecks with only a truthiness guard on the earlier snapshot.",
    "Before the implementation repair, node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-198 (incomplete|an incomplete)' scripts/test-runner.test.mjs exited 1: empty snapshots, missing tags and null tags threw TypeError; the other incomplete or malformed shapes printed invented deltas. No passing evidence is claimed for that red run.",
    "After the guard, node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs passed 22 tests in 11.093 seconds (bounded wall-clock), recorded 2026-10-09T19:44:25.411Z. repair-fixture-transcript.txt preserves the output.",
    "Sixteen malformed earlier snapshots each leave two durable rows, with the new row at exit 1 and carrying its own complete four-field start/end snapshot, exactly one failure summary and no invented delta. The cases include the report's empty and missing-tags shapes, plus every missing field, null/string/array tags and malformed field types.",
    "The extra incomplete-baseline case uses null tags and moves the shared refs during the failed run. It records the failure and prints exactly one line naming origin/main, main, tags and refs/dotln/ for during-run movement, with no since-previous interval.",
    "The original sibling document/plain, forced-failure and round-trip fixtures still pass; no task flips in the reduced table. The repair leaves the previous-row selection and harness-host writer untouched, so VER-001 B1 remains on D004's existing follow-up.",
    "Final repaired identity ea32fb1e1fc56cf81ad6b61b5dd3962bc25d0a32c827473d57ca324346d3822e: npm run test:docs passed 32 checks in 100.983 seconds at 2026-10-09T19:48:23.880Z; npm test -- --review passed 38 suites and 90 fresh tasks in 1488.838 seconds at 2026-10-09T20:13:18.609Z. Both rows carry complete start/end snapshots; repair-row-readback.json preserves them. No repository edit or agent launch occurred while either gate ran.",
    "The full review's runner-fixtures task passed in 97.181 seconds. The new sixteen-variant parent case took 7.787 seconds and is fifth among its slowest cases; its focused run took 6.211 seconds. This is an observed repair cost, not a claim of a comparable runtime regression: D004 already records the task's growth for planning, and the whole review also recorded shared host-lane waits. Authority, artifact-identity and verification edition --check commands passed after a bounded build; their declared source projections do not change in this repair, so the immutable WO-198 revision 001 editions remain selected."
  ],
  "rationale": "Rule beating: handling only a missing tags object would leave partial snapshots printing fabricated changes. Validate the whole schema without inventing values. Naive interventionism: the reported class is in the declared runner surface; preserve the existing row-selection policy and the independently recorded B1 route. NoOp leaves the reproduced diagnostic crash. The outcome of the focused check matches the intended repair.",
  "rejected": [
    {
      "option": "Default missing tag counts and ref names",
      "reason": "Would invent a baseline and label missing values as observed movement."
    },
    {
      "option": "Catch the comparison error and suppress every diagnostic",
      "reason": "Would conceal other defects and movement observed between the current run's valid start and end."
    },
    {
      "option": "Search an older row for a complete snapshot",
      "reason": "Would report movement since an older run as movement since the previous run; D002 already rejects that meaning change."
    }
  ],
  "reopenWhen": "An incomplete or malformed earlier snapshot prevents recording a failed gate, invents a delta, or hides movement between the current run's valid start and end; a future snapshot schema change must update this guard and the malformed-record cases together."
}
```

## WO-198-D001

```json
{
  "id": "WO-198-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.72.1, the next patch above the observed release baseline v0.72.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.72.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-198-a-worktree-gate-names-what-moved.md"
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

## WO-198-D002

```json
{
  "id": "WO-198-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Keep shared-ref snapshots diagnostic only. Read origin/main, main, annotated v* tag count and newest name, and refs/dotln/ count before preflight and after tasks; compare a failed runner row with the latest local row of the same check that predates this run, plus its own start/end interval. Emit one line with both intervals, preserving a move back to a previous value. Older rows without a snapshot supply no inferred baseline. Newest tag means descending tagger date with full-name ordering breaking ties.",
  "evidence": [
    "Read product 07 Independent workflows, WO-179 D012 and VER-002 changedMachinery follow-up, WO-186 D006, and the six cited shared-state readers. Existing readers use ancestry, merge-base selection, local task evidence or report-only notices.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs: 4 tests passed, 0 failed, 4.173 seconds (2026-10-09T18:27:58Z). PROOF lines show unchanged alpha/beta task results in document and plain gates after the sibling commit and annotated v9000.0.1 are pushed to a temporary bare origin; no delta on passing rows.",
    "The forced-failure PROOF names origin/main, main, tags count/newest and refs/dotln/ once; a more recent document row does not replace the plain check baseline. An unchanged failed rerun prints no line. During-run and round-trip PROOF lines retain both observed intervals. Missing branches read absent; lightweight and non-v tags are excluded.",
    "No task flipped in the reduced-table fixture, so no shared-state reader repair was indicated. This bounded fixture does not claim coverage of every live task."
  ],
  "rationale": "The trap is treating ref movement as changed branch code or proof of cause. The snapshots never enter identity or verdict, and the line reports correlation. Leaving the runner unchanged preserves the attribution gap. The fixture edits an input on main that would fail alpha if it read main instead of its own worktree.",
  "rejected": [
    {
      "option": "Compare only the two final snapshots",
      "reason": "Misses a movement back to the previous value during a run."
    },
    {
      "option": "Copy tags into private namespaces or forbid sibling merges",
      "reason": "Contradicts the parallel workflow and the work-order design."
    },
    {
      "option": "Silently substitute an older row with a snapshot for a legacy latest row",
      "reason": "Would label an earlier interval as movement since the previous run."
    }
  ],
  "reopenWhen": "A live failure after a sibling merge prints no delta despite a difference in these recorded fields; extend the fixture with that task. Movements wholly between two samples or changes to tag/ref targets with unchanged counted fields are outside this small snapshot."
}
```

## WO-198-D003

```json
{
  "id": "WO-198-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.72.1, skeleton 0.56.1 and harness host 0.35.1 as compatible patches for additive diagnostic metadata. Update the existing console-to-skeleton pin and lockfile only; no new dependency. Select new immutable WO-198 revision 001 authority, artifact-identity and verification editions and retain the selected feedback edition.",
  "evidence": [
    "npm run release -- prepare --local assigned v0.72.1 above the observed local v0.72.0 baseline (D001).",
    "scripts/lib/evidence-sources.mjs includes gate-evidence.mjs in deterministic edition inputs; packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS does not include it or the runner. No live feedback subject changes are proposed.",
    "node scripts/harness.mjs bounded -- npm run build passed after the snapshot implementation.",
    "After rebuilding, authority-evidence.mjs --write and --check passed for 37 bundle comparisons; artifact-identity-evidence.mjs --write and --check passed for 4 files; verification-evidence.mjs --write and --check passed for 4 files. New editions are under docs/evidence/WO-198, preserving historical editions.",
    "feedback-evidence.mjs --check passed: carried live audit WO-199/feedback-004, selected by WO-188/feedback-001; only component release labels moved. Ten passing regressions and ten removal failures hold.",
    "npm test -- --only format passed in 6.22 seconds and its row contains matching sharedRefs.start/end. npm test -- --only runner-fixtures passed in 78.59 seconds. fixture-transcript.txt records the four focused cases and their PROOF lines.",
    "Final npm run test:docs: 32 passed, zero failed, 98.65 s. Final npm test -- --review: 38 passed, zero failed, 90 fresh tasks, 1396.33 s. Both at code identity e985b95a9c5f8e7f54e776a39fd3bee984148136747604aff369d9c13359eb1e; row-readback.json records the source rows and shared refs.",
    "Two fresh read-only gpt-6.1-sol/max workers judged only the order and diff: criteria adversary found 0; design improver found 0. self-review.md records their reports and limits. No review-driven code changes or deferred defect."
  ],
  "rejected": [
    {
      "option": "Rewrite historical evidence files",
      "reason": "Historical editions are immutable; the current selector can name this order's replacement editions."
    },
    {
      "option": "Bump unchanged component implementations",
      "reason": "The change is in skeleton and the installed host runtime; the console only needs its existing workspace pin updated."
    }
  ],
  "reopenWhen": "A check shows an additional behavior dependency changed, or integration consumes a prepared version."
}
```

## WO-198-D004 — Verification: fail on a regression a malformed earlier snapshot shows; one defect outside the surfaces boarded

```json
{
  "id": "WO-198-D004",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001 on one blocking finding. Criteria 1 to 5 are met. F1: when the latest earlier row of the same check has an object sharedRefs.end with no tags object (forged, damaged or stale), a failed gate throws \"TypeError: Cannot read properties of undefined (reading 'count')\". The throw comes from sharedRefChanges (scripts/test-runner.mjs:1916), called in the failure block (lines 2505-2524) before recordGateChecks (line 2525). So the gate records no row and prints no summary. Main's code (HEAD b06c6081) records the failed row and exits 1 on the same index. The change therefore breaks behavior main had, and a probe shows it, which is the blocking route in product 07 §Verification review and attack. F1 lies in a declared surface and goes to the repair. B1 is boarded, because it lies outside the declared criteria and surfaces. When npm test fails under node scripts/harness.mjs evidence, runHarnessEvidenceChecks (packages/skeleton/src/harness-host.ts:2782-2822) records its own 'npm test' row, with the code identity and without sharedRefs, after the runner's row. That row becomes the previous row of the same check, so the next failing npm test after a ref move prints no 'since previous' delta. Every row recorded at this order's identity carries the snapshot, so criterion 1 holds on the subject. The verifier leaves the implementation unchanged.",
  "evidence": [
    "F1 probe (forged.mjs and forged-compare.mjs in the host scratchpad, run under harness bounded): a one-commit fixture with a build task and a beta task that fails while fail-beta exists. Before the run, recordGateChecks adds a failed 'npm test' row dated one second earlier. That row carries sharedRefs {start: {}, end: {}} in one case and an end with originMain, main and dotlnRefs but no tags in another. The subject's runGate(['--serial', '--again']) rejects with \"Cannot read properties of undefined (reading 'count')\" and leaves 1 'npm test' row. The same probe against HEAD b06c6081's scripts and packages/skeleton/src, extracted with git archive, resolves exit 1 and leaves 2 rows in both cases. sharedRefs null and a string sharedRefs are tolerated by both.",
    "B1 probe (host-row.mjs in the host scratchpad, under harness bounded): a fixture whose package.json test script runs the subject's runGate and fails. Control: a failed runner run, then origin/main moved and annotated v9000.0.1 added, then a failed run prints 'shared refs moved: since previous: origin/main <a>..<b>; since previous: tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)'. Variant: the same sequence with runHarnessEvidence(repo) between the two failed runs. It returns an 'npm test' check with evidenceRef host-check:, exit 1, a codeIdentity and no sharedRefs, and records it after the runner's own failed row. The next failed run prints no delta line.",
    "Main's gate index holds 10 host-check 'npm test' rows, 5 of them failed, the latest 2026-09-21T05:04:39.822Z. Its latest host-check row of any check is 2026-10-09T16:27:35.108Z, so the evidence command is in current use.",
    "Rows at code identity e985b95a9c5f8e7f54e776a39fd3bee984148136747604aff369d9c13359eb1e in this worktree's index: suite:format, suite:runner-fixtures, two npm run test:docs rows and npm test (review). Each carries sharedRefs.start and .end with originMain, main, tags and dotlnRefs. The one other row since activation is the lifecycle 'git diff --check' bookkeeping row (inline-diff:, no codeIdentity, no start or end).",
    "Real corpus: readSharedRefs on this worktree took 29 ms. It matched an independent git read: origin/main and main b06c6081, 152 annotated v tags, newest v0.72.0 by tagger date, and 1631 refs/dotln/ refs at probe time (1629 on the executor's rows). A tree object at refs/remotes/origin/main and a dangling symbolic refs/heads/main both read absent without a throw.",
    "The executor's four WO-198 runner cases pass when I run them (4/4, 5.08 s under harness bounded), with the same PROOF shapes as fixture-transcript.txt.",
    "Receipt known issue for criterion 3: runner-fixtures' fresh passing task ran 77.733 s (single) and 89.198 s (review) at this identity. The median of the 219 fresh passing runner-fixtures tasks in main's index from 2026-09-09 to activation is 21.754 s, threshold 27.193 s, so the reopening condition holds as written. The growth predates WO-198: main's task moved from about 21 s to 64-94 s between 2026-10-03 and 2026-10-05 and read 90.767 s and 93.992 s on 2026-10-09 before activation. The four WO-198 cases total 4.12 s (executor) and 5.08 s (this verification), and none is among the task's five slowest cases."
  ],
  "rationale": "Rule beating: every criterion line reads met, and passing on that would file a gate that crashes, where main recorded the failure. The probe compares against main's own code, so the regression is observed rather than inferred. Escalation: F1 needs a well-formed index to be damaged or forged, and the gate still exits non-zero, so it never admits a false pass. Severity is low, but the written route makes a regression of main's behavior blocking, and the repair is a shape guard in a declared surface. B1 breaks no criterion and no behavior main had (main had no snapshot), and its writer is outside the declared surfaces, so it is boarded with its reproduction. Naive Interventionism: the verifier edits neither the runner nor harness-host. NoOp: passing leaves a crash path on the diagnostic this order adds.",
  "rejected": [
    {
      "option": "Board F1 as a follow-up because only a forged or damaged index triggers it",
      "reason": "Product 07 routes a change that breaks behavior main had, shown by a probe, as blocking, and it lists forged and stale records among the variations a verifier must try. Main records the failed row on the same index."
    },
    {
      "option": "Judge criterion 1 unmet on B1",
      "reason": "Criterion 1 is judged on the rows recorded at this order's identity. Every runner gate row there carries the snapshot. The harness-evidence row appears only when npm test fails under that command, which did not happen at this identity."
    },
    {
      "option": "Treat the runner-fixtures reopening condition as a WO-198 defect",
      "reason": "Main's task was already 64-94 s before activation. The WO-198 cases add about 4-5 s and are not among the slowest cases. The condition's literal reading is recorded for planning."
    },
    {
      "option": "Repair during verification",
      "reason": "The verifier does not edit the subject it judges."
    }
  ],
  "followup": "WO-198 resume: fix. (F1) sharedRefChanges must treat a snapshot that lacks originMain, main, a tags object with count and newest, or dotlnRefs as no baseline, the same as a legacy row without sharedRefs. The failed row is still recorded with exit 1 and its summary line. A runner fixture records an earlier same-check row with sharedRefs {start: {}, end: {}} and another whose end lacks tags, runs a failing gate, and asserts exit 1, a recorded failed row with its own four-field snapshot, and no throw. (B1, for the next order that edits runHarnessEvidenceChecks in packages/skeleton/src/harness-host.ts or the runner's previous-row selection; priority low, diagnostic only) After npm test fails under node scripts/harness.mjs evidence, the latest 'npm test' row the next failed run compares with must carry a snapshot. Either the evidence command keeps the runner's own failed row, or its host row carries that row's sharedRefs. Reproduce with a fixture whose npm test script runs the runner and fails: call runHarnessEvidence, move origin/main and add an annotated v tag, run the failing gate again, and assert a 'since previous' delta line.",
  "reopenWhen": "A repair changes sharedRefChanges or the previous-row selection; a failed npm test after harness evidence and a ref move prints no delta line; or the next order edits runHarnessEvidenceChecks."
}
```

## WO-198-D006 — Verification: F1 repaired; fail on a damaged gate-history archive that stops a failed gate from recording; the repair's test cost boarded

```json
{
  "id": "WO-198-D006",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-002",
  "kind": "finding",
  "decision": "Fail VER-002 on one blocking finding. Criteria 1 to 5 are met, and VER-001 F1 is repaired. F2: the failure block reads the gate history with readGateChecks(repo) (scripts/test-runner.mjs:2525). This order added that read. It reads the hot index and every archive in docs/control/local/harness/check-history. A damaged archive makes the read throw (packages/skeleton/src/gate-evidence.mjs:876-877 and the sort at :899). The throw escapes before recordGateChecks (scripts/test-runner.mjs:2544), so the failed gate records no row and prints no summary. Main's runner (HEAD b06c6081) never calls readGateChecks. Its only history read in a gate is the composition lookup, which catches the error, prints 'passing-row lookup unavailable' and runs the selection. So main records the failed row with exit 1 on the same index. The change breaks behavior main had, and a probe shows it, which is the blocking route in product 07 §Verification review and attack. F2 is the same class as F1: the delta diagnostic's reading of recorded history stops the failed gate from being recorded. It lies in a declared surface. The read and its position are unchanged since VER-001's subject, so this is a VER-001 escape and not a defect of the repair. VER-001 varied a row's snapshot fields but not the files the new read consumes. F3 (follow-up): the repair's sixteen-shape case runs a whole fixture gate per shape, which adds to the runner-fixtures growth the receipt names as a known issue. B1 stays on D004's follow-up. The verifier leaves the implementation unchanged.",
  "evidence": [
    "F1 repaired. Probe repair.mjs (host scratchpad, under harness bounded) records an earlier failed 'npm test' row and then runs a failing runGate(['--serial', '--again']). Five shapes were tried: {start: {}, end: {}}, an end with no tags, null, a string sharedRefs, and a tags count of 1e21. On the subject each records exit 1, leaves 2 'npm test' rows with a four-field new snapshot, prints one summary and prints no delta line. Controls: an earlier complete snapshot that differs prints exactly one line naming origin/main, main, tags count and newest, and refs/dotln/. An earlier snapshot of absent sentinels prints one line naming main alone. The guard therefore rejects only incomplete snapshots.",
    "F2 probe (archive.mjs, host scratchpad, under harness bounded). A one-commit fixture with a build task and a failing beta task holds one earlier failed 'npm test' row in its hot index. One damaged archive is written: '{}' (not an array), 'not json', '[null]', or truncated JSON under a 40-hex archive name. Each is run once with '--serial --again' and once with plain '--serial'. Subject: all eight runs reject ('Malformed host gate evidence', a JSON SyntaxError, or \"Cannot read properties of null (reading 'recordedAt')\"). The hot index keeps one 'npm test' row, and no 'npm test: N passed' summary prints. The same probe against HEAD b06c6081's scripts and skeleton source (git archive) resolves exit 1 in all eight runs, with two 'npm test' rows and one summary. The plain runs also print the existing 'passing-row lookup unavailable' line.",
    "Control, not counted: a hot index of '[null]' throws in both, because main's recordGateChecks also reads the hot file. A lone hot row with a numeric recordedAt did not reproduce in either, because a single-row sort calls no comparator. The CLI entry catches a thrown error and sets exit code 1, so F2 cannot produce a false pass.",
    "Real corpus: the main checkout holds 1670 archive files. A full readGateChecks of it read 10760 rows without error in 439 ms, so no damaged archive exists there now. This worktree holds none. Archives are written through a temporary file and a rename, so damage needs a hand edit, disk damage or a future format change, as F1 did.",
    "Re-derived claims at code identity ea32fb1e1fc56cf81ad6b61b5dd3962bc25d0a32c827473d57ca324346d3822e (gateCodeIdentity of this worktree, equal to the executor's rows). The WO-198 runner cases passed under harness bounded: 22 tests, 0 failed, 11.30 s. The sibling-merge, forced-failure, malformed-snapshot, incomplete-baseline and round-trip PROOF lines match repair-fixture-transcript.txt. npm run test:docs passed 32 of 32 in 114.41 s (recorded 2026-10-09T20:29:43.942Z). Its row carries a four-field start and end. The executor's npm test -- --review row (review selection, fresh, 38 required suites, 90 fresh tasks, exit 0, 1488.838 s, recorded 2026-10-09T20:13:18.609Z) is consumed at the same identity. npm run format:check and git diff --check are clean.",
    "F3 cost reading: in my focused run the sixteen-shape parent case took 6.45 s of the 11.30 s for the six WO-198 cases. VER-001 measured the original four at 5.08 s. In the executor's review row it took 7.787 s, and runner-fixtures took 97.181 s, against 89.198 s at VER-001's identity. The guard is a pure function of two snapshots."
  ],
  "rationale": "Rule beating: every criterion line reads met, and passing on that alone would file a failure block that crashes where main records the failed gate. Consistency: VER-001 routed F1, the same class at the same low likelihood and the same fail-safe exit, as blocking under the same rule. Routing F2 any differently would apply the rule by preference. Repair-loop trap (WO-112): the repair rule below covers the whole failure-block selection, not one input. The block's remaining inputs were enumerated: the hot index (main throws too), the archives (F2), the row filter and Date.parse (inside the same selection) and the comparison (F1, repaired). After one catch on the selection, no recorded data can make the block throw where main recorded. NoOp: passing leaves a second crash path in the diagnostic this order adds.",
  "rejected": [
    {
      "option": "Board F2 as a follow-up because only a damaged ignored archive triggers it",
      "reason": "Product 07 routes a change that breaks behavior main had, shown by a probe, as blocking. VER-001 routed F1 the same way at the same likelihood."
    },
    {
      "option": "Treat F2 as a new defect in the repair, which by product 07 is a follow-up",
      "reason": "The repair did not introduce the read. It existed unchanged at VER-001's subject, so the general route applies."
    },
    {
      "option": "Judge criterion 2 unmet on F2",
      "reason": "Criterion 2 is judged on recorded failed rows. As with F1, the defect stops a row from existing at all, which the main-behavior route judges."
    },
    {
      "option": "Make F3 blocking",
      "reason": "Test cost breaks no criterion and no behavior main had. The runner-fixtures growth predates WO-198 (D004)."
    },
    {
      "option": "Repair during verification",
      "reason": "The verifier does not edit the subject it judges."
    }
  ],
  "followup": "WO-198 resume: fix. (F2) No failure while reading or selecting the previous row of the same check may escape the failure block. That covers reading the hot index or an archive, parsing, sorting and filtering rows. Such a failure supplies no since-previous baseline, the same as a legacy row. The during-run interval is still compared, and the failed row is still recorded with exit 1 and its summary. Regression: a runner fixture writes one damaged archive under docs/control/local/harness/check-history, for example non-JSON bytes. It then runs a failing gate with --again and asserts exit 1, the failed row in the hot index with its own four-field snapshot, one summary line and no throw. A damaged hot index file stays out of scope, because main's recordGateChecks throws on it too. (F3, low; the next repair may fold it in under Adjacent Repair, otherwise the next order that edits scripts/test-runner.test.mjs) Keep VER-001's two named shapes ({start: {}, end: {}} and an end without tags) as whole-gate cases. Check the remaining malformed shapes by calling the snapshot guard directly, so the WO-198 cases stop running one fixture gate per shape. (B1) Unchanged; it stays on D004's follow-up.",
  "reopenWhen": "A repair changes the failure block's previous-row selection or sharedRefChanges; a damaged gate-history file stops a failed gate from recording; or runner-fixtures exceeds the receipt's threshold again after a repair adds whole-gate cases."
}
```

## WO-198-D007 — Keep diagnostic history failures from interrupting failed-gate recording

```json
{
  "id": "WO-198-D007",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-002 F2",
  "decision": "Catch errors across the complete previous-row lookup: history reads, parsing, sorting, filtering and timestamp conversion. An unsuccessful lookup supplies no since-previous baseline. Compare the current start/end snapshots independently, then record the failed row and its summary as before. Preserve latest-same-check selection when history is readable.",
  "evidence": [
    "Read the order and its citations, VER-002, the failure block, readGateChecks, readChecksFile, recordGateChecks and the existing runner fixtures. The history read was outside any catch and preceded durable recording.",
    "Before the source repair, node scripts/harness.mjs bounded -- node --test '--test-name-pattern=WO-198 (damaged|an unselectable)' scripts/test-runner.test.mjs failed both cases: non-JSON archive bytes threw SyntaxError from readChecksFile; one archived recordedAt object with a non-callable toString threw TypeError from Date.parse in the row filter. The timestamp case is an additional input VER-002 did not quote.",
    "repair2-before-transcript.txt records both cases passing after the catch. Each reads the hot index directly, independent of the damaged archive reader, asserts the durable exit-1 row and its complete snapshot, and asserts one summary. The timestamp case moves all four shared-ref fields during the run and retains exactly one during-run line with no since-previous interval.",
    "repair2-fixture-transcript.txt records all eleven focused tests passing in 8.301 seconds under the bounded runner. The existing sibling document/plain cases change no task result, and the forced-failure, malformed baseline and round-trip diagnostics remain covered.",
    "Product 07 states the failed-lookup rule in place. npm run publication:check passed after its software-engineer source lock was refreshed. A bounded build and all three selected authority, artifact-identity and verification --check commands passed; the WO-198 revision 001 editions remain current because their source projections did not change.",
    "npm run release -- prepare --local retained application v0.72.1; the existing skeleton 0.56.1, harness host 0.35.1 and console dependency pin remain compatible patches. The material inventory returned no nested repositories. Full gate evidence will be recorded in the current repair handoff."
  ],
  "rationale": "Repair-loop trap: a JSON-only catch would leave sort or Date.parse failures escaping, so the boundary contains the complete selection. Rule beating: catching the whole failure block could suppress current-run movement or recording errors, so comparison and recording stay outside it. NoOp preserves the demonstrated diagnostic crash. The focused outcome matches the intended repair.",
  "rejected": [
    {"option": "Repair or skip individual damaged archive files in the shared evidence reader", "reason": "Changes evidence trust and reuse behavior beyond this diagnostic; the bounded repair needs only an unavailable comparison baseline."},
    {"option": "Catch comparison and recording together with history selection", "reason": "Would hide current-run movement or a genuine persistence failure."},
    {"option": "Search past a snapshot-less host row to an older runner row", "reason": "Changes the meaning of previous run and disguises the separate harness writer defect B1. That defect remains on D004's FUP-f5f10101e717d59b, for the writer to preserve the runner snapshot."}
  ],
  "reopens": {
    "decisionId": "WO-198-D004",
    "observation": "This repair touches previous-row selection only to contain lookup exceptions. B1 remains observable as documented: the harness evidence writer can append a snapshot-less failed row. Preserve latest-row semantics and retain B1 on FUP-f5f10101e717d59b for the next order editing runHarnessEvidenceChecks; no B1 fix is claimed."
  },
  "reopenWhen": "Any diagnostic history-read or selection error escapes before recording a failed gate, or removing an unavailable baseline suppresses movement during the current run. A damaged hot index that recordGateChecks cannot write remains the existing persistence failure, outside F2."
}
```

## WO-198-D008 — Exercise malformed snapshot shapes without repeating the fixture gate

```json
{
  "id": "WO-198-D008",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-002 F3; operator reply Include the F3 cleanup",
  "decision": "Expose the runner's existing pure completeSharedRefs validator for direct tests. Keep the empty-snapshot and missing-tags shapes as whole-gate cases; test the remaining malformed inputs directly, with complete and absent-sentinel controls. Process this bounded cleanup through adjacent-0001 revision 1 using the same source paths and full review gate.",
  "evidence": [
    "At the safe boundary after F2's focused checks passed, the operator answered Include the F3 cleanup to the asynchronous check-in. The adjacent queue was reread, and the announcement, reply observation and start were recorded as actor-attested.",
    "Before: repair2-before-transcript.txt records sixteen whole fixture gates in the malformed-snapshot parent case, 7851.751 ms. After: repair2-fixture-transcript.txt records the two retained whole-gate cases in 981.744 ms and direct validation of 21 malformed shapes plus two valid controls in 0.379 ms. These are one bounded before/after observation each in this dispatch, not medians or a claim about the whole review duration.",
    "The direct matrix keeps every former variant and adds missing, null, string and array snapshots plus the verifier's unsafe 1e21 count. Both whole-gate cases still assert exit 1, the recorded row, its full new snapshot, one summary and no fabricated delta. An existing separate case still tests during-run movement with an invalid baseline.",
    "The full focused selection passed eleven tests, including both new archive regressions. F3 removes fourteen fixture-gate executions; F2 adds two distinct whole-gate regressions. The complete review remains required before handoff."
  ],
  "rationale": "Economy: compare repeated integration checks with direct schema checks while retaining the two required integration witnesses. The measured local reduction is about 6.87 seconds for the shape cases. NoOp retains avoidable process and Git work for a pure validation rule. The chosen split reduces that work while preserving the original failure reproductions.",
  "rejected": [
    {"option": "Keep all sixteen whole-gate variants", "reason": "Repeats fixture setup, child commands and Git reads for identical validator logic; the bounded comparison shows the cost."},
    {"option": "Replace every whole-gate case with validator tests", "reason": "Would lose proof that the caller preserves the durable failed row and summary on the two original failing shapes."}
  ],
  "reopenWhen": "Snapshot validation acquires I/O or stateful behavior, or a malformed input passes the direct guard yet interrupts the failed gate; retain integration coverage of any newly distinct caller behavior."
}
```

## WO-198-D009 — Integrate main during the repair at the operator's request

```json
{
  "id": "WO-198-D009",
  "date": "2026-10-09",
  "dispatch": "scope expand: merge in main",
  "decision": "Use npm run worktree -- integrate WO-198 in the repairing phase after the active document gate finishes. Preserve all pending repair and intake through the canonical backup, checkpoint and named stash. Resolve authored conflicts explicitly and run the required checks on the integrated identity before repair-complete.",
  "evidence": [
    "The operator explicitly requested scope expand: merge in main while the document gate ran.",
    "The active document gate subsequently passed 32 checks in 114.74 seconds. It reported the newer sibling v0.73.0 tag without failing branch-local release and index checks.",
    "Product 07 Independent workflows and integration admits worktree integrate in repairing, preserves recovery material, fetches main and tags and regenerates projections. The package mapping selects scripts/worktree.mjs; it and its integration helper have no local edits."
  ],
  "rationale": "Preserve-work trap: a hand merge over the dirty repair risks separating its evidence and code, so use the repository's recovery procedure. NoOp would leave the operator's explicit integration request undone. A new base or release collision is integration bookkeeping, not an additional verification finding.",
  "rejected": [
    {"option": "Defer main integration to final review", "reason": "The operator explicitly requests integration now, and the current repairing phase admits it."},
    {"option": "Reuse the old passing review as coverage of the integrated tree", "reason": "The integrated identity must receive its own required review gate."}
  ],
  "reopenWhen": "A merge conflict or changed evidence input requires a behavioral choice beyond preserving both reviewed upstream work and this repair."
}
```

## WO-198-D010

<!-- integration refs/dotln/checkpoint/WO-198/10 -->

```json
{
  "id": "WO-198-D010",
  "date": "2026-10-09",
  "dispatch": "resume: fix; worktree integrate WO-198",
  "decision": "Integrate main bb84ae82 into the repairing WO-198 worktree at the operator's explicit request. The branch fast-forwarded from b06c6081; the repair was reapplied from its retained stash. Preserve upstream repository-profile behavior and the complete WO-198 implementation. Resolve only evidence selection and compatible component labels: application v0.73.1, skeleton 0.57.1, the existing console pin and harness host 0.35.1. Select WO-198 revision 002 synthetic editions for the combined source and retain upstream's WO-073 feedback edition. Re-run document and review gates at the integrated identity before repair-complete; final review remains independent.",
  "evidence": [
    "refs/dotln/checkpoint/WO-198/10",
    "base b06c60812cf7a533d9a2286479893abe6904c4b2",
    "upstream bb84ae82bd5b8e0b92a3face9578e9c3672ba61a",
    "release preparation: Retimed WO-198: v0.72.1 → v0.73.1 above the observed release baseline v0.73.0. Files changed: docs/work-orders/WO-198-a-worktree-gate-names-what-moved.md, README.md, docs/evidence/WO-198/meta.json, docs/final-reviews/WO-198/PR.md. Meter snapshot: docs/evidence/WO-198/meta.json, 3596 bytes. Tag observation: local snapshot only.",
    "The canonical integration retained checkpoint 10, its named stash and the matching external intake archive. Four authored conflicts were resolved: docs/evidence/current.json, package-lock.json, packages/console/package.json and packages/skeleton/package.json. Upstream skeleton 0.57.0 contains new repository-profile behavior; the pending compatible diagnostic patch is retimed from 0.56.1 to 0.57.1 without changing its compatibility impact or adding dependencies.",
    "worktree integrate --continue completed with no authored conflicts or pending generation. It regenerated runtime, harness, control, release, indexes, follow-up register, publication locks and the selected console fixtures. The runner's only upstream change adds the WO-073 baseline to the machinery inventory; upstream does not change gate-evidence.mjs or the runner fixtures. The repaired failure block and tests remain present.",
    "After the integrated build, authority, artifact-identity and verification revision 002 --write and --check commands passed. These preserve revision 001 and upstream's historical editions. The feedback --check command carried the existing live audit named by WO-073, with ten passing regressions and ten removal failures; no new live episode is indicated.",
    "Same-day command correction: I assumed every evidence generator accepted authority-evidence's edition flags. Artifact-identity and verification rejected those flags before writing; their checked entrypoints instead use docs/evidence/current.json. Selected revision 002 there and used their supported --write commands. No historical evidence bytes were rewritten.",
    "Integrated identity f940fd38ea68907c1ced716820e5e1212673264ce2a1891208485ffe4f4fe611: npm run test:docs passed 32 checks in 121.396 seconds at 2026-10-09T20:51:04.914Z; npm test -- --review passed 38 suites and 90 fresh tasks in 1643.655 seconds at 2026-10-09T21:18:36.718Z. Both rows report unchanged code and build output and carry complete shared-ref snapshots. repair2-row-readback.json preserves the rows. No repository edit or worker launch occurred during either gate.",
    "The integrated review's runner-fixtures passed in 114.331 seconds with worktree-integration, portfolio and configuration-root concurrent at its start. None of the WO-198 cases is among its five slowest cases. This whole-suite observation is not comparable to the isolated F3 before/after experiment; D004's pre-existing suite-growth observation still stands. FUP-6f4da93aa109f4f1 is settled for F2/F3; B1 remains deferred on FUP-f5f10101e717d59b. Adjacent-0001 completed at queue revision 5 with the focused and full review evidence."
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

Integration date: 2026-10-09. Original base: `b06c60812cf7a533d9a2286479893abe6904c4b2`.
Fetched main: `bb84ae82bd5b8e0b92a3face9578e9c3672ba61a`. Checkpoint: `refs/dotln/checkpoint/WO-198/10`.
Named stash retained: `80eba89b9878e24bf49c7284f53a336fa69b3a45` (WO-198 integrate 2026-10-09).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-198: v0.72.1 → v0.73.1 above the observed release baseline v0.73.0. Files changed: docs/work-orders/WO-198-a-worktree-gate-names-what-moved.md, README.md, docs/evidence/WO-198/meta.json, docs/final-reviews/WO-198/PR.md. Meter snapshot: docs/evidence/WO-198/meta.json, 3596 bytes. Tag observation: local snapshot only.
Carried-forward claims: the five original WO-198 obligations and the F1 repair remain applicable. The F2/F3 repair stays in the same runner paths; upstream's fixture-inventory addition does not alter snapshot, comparison or recording logic. Revision 002 re-establishes the combined-source synthetic evidence. The integrated gates and criterion judgments are recorded in the repair handoff when passing; independent verification and final review remain separate dispatches.
Authored conflicts observed: docs/evidence/current.json, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks are printed by the command; the current repair handoff records their executed outcomes.

## WO-198-D011 — Verification: F2 and F3 repaired; fail on a shared-ref snapshot read that throws on a broken tag ref or damaged packed-refs

```json
{
  "id": "WO-198-D011",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-003",
  "kind": "finding",
  "decision": "Fail VER-003 on one blocking finding. Criteria 1 to 5 are met, VER-002 F2 is repaired, and F3 is folded in. F4: readSharedRefs (packages/skeleton/src/gate-evidence.mjs:479-511) enumerates v tags and refs/dotln/ through git(), which throws on any non-zero exit (:465-474). The runner calls it at gate start (scripts/test-runner.mjs:2063) and again inside the row literal after the last task (:2431), with no catch around either call. Two ref states make git for-each-ref exit 128 while main's gate path, which enumerates no refs, passes. One is a refs/tags/v* ref naming a missing object ('fatal: missing object', the tag read). The other is an unparseable packed-refs line ('fatal: unexpected line in .git/packed-refs', both for-each-ref reads). The gate then throws 'Tree observation failed: git for-each-ref', records no row and prints no summary. At start no task runs. At the end every task has already run and passed. On the same fixtures, main's runner (HEAD bb84ae82) passes and records the row, or records the failed row with exit 1. Tags and packed-refs are shared by every linked worktree, so one such ref fails every worktree's gate, including a run already under way. The change breaks behavior main had and a probe shows it: the blocking route in product 07 §Verification review and attack. F4 lies in declared surfaces. gate-evidence.mjs is byte-identical to VER-001's subject (checkpoint 3), so F4 escaped VER-001 and VER-002 and is not a defect of the repair. B1 stays on D004's follow-up. The verifier leaves the implementation unchanged.",
  "evidence": [
    "F4 probe (probe.mjs, host scratchpad, each run under harness bounded): a one-commit fixture with build, alpha and beta tasks and one annotated v1.0.0 tag. A loose refs/tags/v9.9.9 naming the missing object 1234567890123456789012345678901234567890 is written before the run. Subject, passing '--serial' gate: rejects 'Tree observation failed: git for-each-ref', 0 rows, no summary. HEAD bb84ae82 scripts and packages (git archive): exit 0, 1 row, one summary. The same with a failing beta: subject rejects with 0 rows; HEAD exit 1 with the failed row recorded.",
    "Mid-run: the same dangling tag ref is written through stopRequested once the first task has run. Subject: every task runs, then the end read rejects with 0 rows (passing and failing variants). HEAD: exit 0 (passing) or exit 1 (failing), with 1 row.",
    "Linked worktree, the order's scenario: a worktree on wo-900 runs '--document --serial'. The dangling ref is written in the main checkout's shared tag store, once before the run and once during it, after alpha runs. Subject rejects with 0 rows both times; HEAD exits 0 with 1 row both times.",
    "Damaged packed-refs: 'git pack-refs --all', then one appended 'garbage line'. Subject, passing gate: rejects 'Tree observation failed: git for-each-ref', 0 rows. HEAD: exit 0, 1 row. Direct Git 2.55.0: rev-parse --verify refs/heads/main^{commit}, the v tag for-each-ref and the refs/dotln/ for-each-ref each exit 128 with 'fatal: unexpected line in .git/packed-refs'; ls-files exits 0. readSharedRefs maps the rev-parse failure to absent, but not the two enumerations.",
    "Controls that do not throw, on the subject and HEAD alike: under refs/dotln/, a dangling loose ref (counted) and a garbage loose ref (skipped with a warning), a dangling refs/remotes/origin/main (reads absent), a broken symbolic refs/tags/v8.8.8 (skipped), and an annotated v7.7.7 tag object whose target is missing (counted). So the failing class is exactly an enumeration that Git cannot complete.",
    "F2 repaired. Five damaged archives ('not json', '{}', '[null]', truncated JSON, and a row whose recordedAt has a null toString), each with a failing beta, run under '--serial --again', '--serial', '--document --serial' and '--only beta': all 20 runs exit 1, record the failed row with a four-field snapshot and print no delta line. The three gate selections print one summary. The --only run prints its summary under its own check, the same as the HEAD control. VER-002 did not run the document and --only gates against a damaged archive. Both are now run.",
    "F3 repaired. In my run the direct validator case took 0.68 ms. The two retained whole-gate witnesses took 1.32 s together, and all eleven WO-198 cases took 10.66 s (11 of 11 pass under harness bounded).",
    "Re-derived claims at code identity f940fd38ea68907c1ced716820e5e1212673264ce2a1891208485ffe4f4fe611, the gateCodeIdentity of this worktree, equal to the executor's integrated rows. Rows at this identity: npm run test:docs at 20:51:04.914Z and 21:23:14.109Z, npm test (review) at 21:18:36.718Z, and my npm run test:docs at 21:46:05.403Z (32 of 32 in 142.31 s). Each carries start and end with the four fields. The executor's review row (review selection, fresh, 38 required suites, 90 fresh tasks, 0 reused, exit 0, 1643.655 s, identity and build output unchanged) is consumed. The real corpus snapshot matched direct Git reads: origin/main and main bb84ae82, 153 annotated v tags, newest v0.73.0, and 1646 refs/dotln/ refs. npm run format:check and git diff --check are clean."
  ],
  "rationale": "Rule beating: every criterion line reads met, but passing would ship a snapshot read that turns a shared ref Git cannot enumerate into a gate failure with no row, where main passes. That is the false failure this order exists to attribute. Consistency: VER-001 F1 and VER-002 F2 were routed blocking as the same class, at the same low likelihood and with the same fail-closed exit. F4 is stronger, because it also fails passing gates. Repair-loop trap (WO-112): the rule below covers every git read the snapshot makes, not the one shape the probe found. The diagnostic's inputs are now enumerated: the branch reads (absent on failure), the tag and refs/dotln/ enumerations (F4), history selection (F2, repaired) and snapshot comparison (F1, repaired). The controls show which ref states Git tolerates. Once the two enumerations degrade like the branch reads, no ref state that main's gate tolerates can make the diagnostic throw. NoOp: passing leaves a shared-state path to an unrecorded failure in every worktree.",
  "rejected": [
    {"option": "Board F4 as a follow-up because only a broken tag ref or damaged packed-refs triggers it", "reason": "Product 07 routes a change that breaks behavior main had, shown by a probe, as blocking. F1 and F2 were routed the same way at the same likelihood, and F4 also fails passing gates."},
    {"option": "Treat F4 as a new defect in the repair, which product 07 makes a follow-up", "reason": "readSharedRefs is byte-identical to VER-001's subject. The general route applies, as it did for F2."},
    {"option": "Judge criterion 1 unmet on F4", "reason": "Criterion 1's 'missing ref reads absent' names a ref that does not exist, and every row recorded at this identity carries the four fields. F4 stops a row from existing at all, which the main-behavior route judges, as with F1 and F2."},
    {"option": "Prescribe one representation for a degraded field", "reason": "The rule binds behavior (no throw, four fields, no fabricated movement). The executor chooses between excluding unreadable tags and a whole-field sentinel."},
    {"option": "Repair during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-198 resume: fix. (F4) No failure of a shared-ref read, at gate start or at the end, may change the gate's exit code, prevent recording its row or suppress its summary. That covers every git read in readSharedRefs: the two branch reads (already absent on failure), the v tag enumeration and the refs/dotln/ enumeration. A read that fails degrades its own field without throwing, as a missing branch reads absent, so the row still carries start and end with the four fields. A degraded field supplies no comparison baseline and is never reported as movement. For example, a refs/tags/v* ref whose object Git cannot read is not a readable annotated tag and stays out of count and newest. An enumeration that fails outright reads its fields as absent, and completeSharedRefs already rejects that as a baseline. Regression: a runner fixture writes a loose refs/tags/v* ref naming a missing object, (a) before a passing gate and (b) during a passing run through stopRequested. It asserts exit 0, one recorded row with a four-field start and end, one summary line and no throw. A failing variant asserts exit 1 and its recorded row. The damaged packed-refs case may share that fixture or be a direct readSharedRefs test. (B1) Unchanged; it stays on D004's follow-up.",
  "reopenWhen": "A repair changes readSharedRefs or either call site; any ref state that main's gate tolerates makes a gate throw, record no row, or print a delta line for a degraded field."
}
```

## WO-198-D012 — Keep every shared-ref read diagnostic when Git cannot complete it

```json
{
  "id": "WO-198-D012",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-003 F4",
  "decision": "Use one nonthrowing observation helper for all four Git reads in readSharedRefs. A nonzero exit or process-launch error discards that command's output. Failed tag enumeration records tags.count and tags.newest as absent; failed refs/dotln/ enumeration records dotlnRefs as absent. Each branch still records absent when no commit can be resolved. Keep the four-field start/end record, all successful observations and the strict Git helper used for code/tree identity unchanged. An incomplete enumeration supplies no snapshot baseline through the existing completeSharedRefs guard. A branch marked absent supplies no branch baseline: its missing or unreadable commit is never labeled movement. Known branch commits and valid tag/ref counts retain their existing comparisons.",
  "evidence": [
    "Read the original order, VER-003 F4 and D011, readSharedRefs, both runner call sites, completeSharedRefs, sharedRefChanges and the existing linked-worktree fixtures. The two enumeration reads used the throwing identity helper; branch reads already mapped nonzero exits to absent.",
    "Before the repair, node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-198 (failed shared-ref|unreadable shared|failed shared)' scripts/test-runner.test.mjs failed all three new parent tests at 2026-10-09T21:56:54.316Z with Tree observation failed: git for-each-ref. Passing and failing gate fixtures threw at the start snapshot. That run is red evidence, not a passing gate.",
    "After the repair, node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs passed 14 tests, zero failed, in 13.644 seconds at 2026-10-09T21:57:45.267Z. repair3-fixture-transcript.txt preserves the output and PROOF lines. The four new fixture gates took 3.108 seconds across two parent tests; no per-shape gate matrix was added.",
    "Direct Git witnesses confirm that a dangling v tag fails the objecttype enumeration and that damaged packed-refs fails every one of the four reads. A valid tag/ref count is retained before damage; a failed enumeration discards even partial output, and removing the broken tag restores the original snapshot. Only the failed tag fields degrade when the other reads succeed.",
    "Linked-worktree passing witnesses cover a broken tag before a document gate and during a plain gate after build. Both exit zero, record one durable row with four-field start/end snapshots and print one summary with no movement line. A failing tag-before witness preserves exit one and the failed row. The extra case VER-003 did not quote damages origin/main during a failed plain gate: it preserves exit one, its row and summary without printing the unreadable branch as movement.",
    "The sibling merge/tag, forced-failure, history-read, incomplete-baseline and round-trip cases all still pass. Their PROOF lines preserve known movement and show no task flipping in the reduced table. Product 07 records the failed-read rule in Independent workflows and integration.",
    "npm run release -- prepare --local reports target v0.73.1 remains current. The existing skeleton 0.57.1 and harness-host 0.35.1 compatible patches already classify these unpublished surfaces; no additional version step or new dependency is needed. The original and earlier repair handoffs are preserved, including repair2-handoff.md."
  ],
  "rationale": "Rule beating: a catch that substitutes zero or retains partial stdout would fabricate an observed count and later report invented movement. Keep unknown counts explicit and honor the existing whole-snapshot validation rule. Repair-loop trap: contain every diagnostic Git call at its source, including launch failures, rather than wrapping only the tag read or one runner call site. Scope trap: a damaged ref must not weaken the identity/persistence checks; only diagnostic reads degrade. NoOp leaves the independently reproduced path that loses even a completed passing gate. The focused result matches the intended repair.",
  "rejected": [
    {
      "option": "Catch all errors around the runner or weaken the shared identity Git helper",
      "reason": "Would hide failures in identity, task execution or durable persistence instead of containing only the optional diagnostic."
    },
    {
      "option": "Use zero, a partial count or an individually filtered tag list after failed enumeration",
      "reason": "A failed command does not prove a complete inventory, and inventing one can print a false movement line. Per-tag recovery adds reads without establishing the failed inventory was complete."
    },
    {
      "option": "Report a resolved branch becoming absent as observed movement",
      "reason": "The absent resolution cannot distinguish a missing branch from an unreadable object; the additional failing-gate regression demonstrates why it supplies no commit comparison baseline."
    },
    {
      "option": "Redesign the malformed-snapshot validator or run a gate for every damaged-ref shape",
      "reason": "The existing guard already rejects absent enumeration counts. Four actual gates establish start/end, passing/failing and linked-worktree behavior; direct reads cover the remaining input shapes without multiplying whole-gate cost."
    }
  ],
  "reopenWhen": "A diagnostic Git failure changes a gate verdict, interrupts its row or summary, consumes partial output or prints movement for an unobserved field. The conservative baseline also intentionally omits branch creation/deletion through absent and intervals with an unreadable enumeration; revisit only with a reliable observation that distinguishes missing from unreadable."
}
```

## WO-198-D013 — Preserve failed gate evidence and rerun the unpassed task at the current identity

```json
{
  "id": "WO-198-D013",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-003 F4",
  "decision": "Keep both failed review rows and their diagnostics. Run the required format, document and review sequence again after the bounded documentation correction. Use the current review composition rule to carry eligible passing tasks and execute the failed vertical suite again at its existing 900-second deadline. The new review remains a full review selection; neither an isolated control nor an earlier identity supplies its verdict.",
  "evidence": [
    "The bounded build passed. Harness emit recorded immutable snapshot c73fec2724b847db; earlier snapshots remain. Authority, artifact-identity and verification revision 003 editions were minted and checked, with revision 001 and 002 bytes retained. The feedback edition remains WO-073, carrying its checked WO-199 live audit; neither changed source belongs to the feedback-judged source list.",
    "npm run test:docs passed all 32 checks at 2026-10-09T22:04:40.059Z in 142.379 seconds, and again at 22:10:08.855Z in 141.878 seconds. Both use code identity 87bce92bb6e71517b977d75da3e904a4977c11a8b7c9f92c6e394253bbb4662d.",
    "The first npm test -- --review attempt failed at 22:05:00.199Z in 13.286 seconds: historical git show 4ead1d0ea1f1fea049f8369d99c852da602f9278:packages/compiler/fixtures/wo029-entropy-reducer.json returned status 255 with the requested file contents and empty stderr. git cat-file found the object; the bounded authority --check and the actual runner's isolated authority-evidence selection passed at unchanged source. The cause of that Git exit is unknown.",
    "The next full review row, recorded at 22:41:04.262Z in 1849.062 seconds, has 37 passing suites and one failure: vertical timed out after 900174 ms. It composed 84 fresh tasks with six eligible passing tasks carried from the earlier failed invocation. Authority-evidence executed afresh and passed. Code identity and build output stayed unchanged; all four shared-ref observations stayed equal between start and end, so the failure printed no movement line.",
    "Every completed vertical case reported exit zero before the suite deadline. The interrupted case was the baseline/candidate witness interruption regression. The earlier integrated review passed vertical in 842.379 seconds. Direct SHA-256 comparisons against checkpoint 12 show that test-vertical.mjs, test-vertical-judgment.mjs and test-vertical.recovery.mjs have not changed. The failed row records no memory failure or excluded product read. These observations establish the deadline failure, not its underlying timing cause.",
    "The full runner-fixtures suite passed in 129.31 seconds, including the focused repair cases and the existing bounded comparison of composed --review with forced-fresh --review --again. Worktree integration and all other selected suites passed. The passing tasks remain available to the next review at the same code identity under WO-196's rule.",
    "After the documentation correction, npm run test:docs passed 32 fresh checks in 114.714 seconds at 22:49:08.242Z. The controlled npm test -- --review passed all 38 required suites in 771.097 seconds at 23:02:15.560Z: two fresh tasks, format and vertical, and 88 reused tasks. Vertical passed in 763.463 seconds at the unchanged 900-second deadline. Both rows retain code identity 87bce92bb6e71517b977d75da3e904a4977c11a8b7c9f92c6e394253bbb4662d, unchanged build output and equal start/end shared refs. Independent parsing of the hot index agrees with readGateChecks. repair3-row-readback.json and repair3-gate-transcript.txt retain all seven third-repair document/control/review rows, including the failed attempts. This passing controlled execution does not establish the earlier timing cause."
  ],
  "rationale": "Evidence-before-claims: a Git error and a deadline are observed failures; neither proves a shared-ref cause. Rule beating: a focused pass cannot replace the required review, and an older passing vertical run cannot discharge the current failed execution. Economy: current composition retains executed passing work while rerunning the failure; an unchanged-code retry avoids repeating those passing tasks. NoOp would leave criterion 5 unmet. The controlled execution passed the complete required selection within the original bound, matching the chosen plan; the earlier Git and timing causes remain unknown.",
  "rejected": [
    {"option": "Call the first Git error a missing object or a shared-ref failure", "reason": "The object exists, the controls pass and the failed full row supplies no such causal evidence."},
    {"option": "Complete the repair using only the focused cases or the old integrated review", "reason": "The order requires a passing review at the current code identity, and the latest vertical execution failed."},
    {"option": "Raise the deadline or change vertical test scheduling on the timeout alone", "reason": "The three test files are unchanged and previously passed within the existing bound; the timing cause has not been established."},
    {"option": "Force every passing task fresh again", "reason": "WO-196 permits current-identity passing-task reuse, and its executed fixture compares both modes. Repeating passing work supplies no additional evidence for the timed-out task."}
  ],
  "reopenWhen": "The historical Git exit or the vertical deadline failure recurs in a controlled current-identity execution; retain the diagnostics and diagnose the repeated condition rather than repeatedly rerunning without new evidence."
}
```

## WO-198-D014 — Correct the stale review-freshness statement

```json
{
  "id": "WO-198-D014",
  "date": "2026-10-09",
  "dispatch": "resume: fix; adjacent-0002 revision 1",
  "kind": "correction",
  "misread": "I initially treated --review as forcing every selected task fresh, relying on WO-186 D006 and the older product 07 sentence. I described the six carried tasks in the running review as contrary to that rule.",
  "meant": "WO-196 superseded that part of the earlier rule: review selections may reuse eligible passing tasks at the current code identity, while --again forces every selected task fresh and the format preflight remains fresh. The current runner and its composition regression implement that rule.",
  "changed": "Corrected the claim directly in this conversation on 2026-10-09. Replaced the stale sentence in product 07 Discipline in place and refreshed only the affected software-engineer publication source lock. No runner behavior was changed for this correction.",
  "decision": "Process the one-sentence documentation correction through adjacent-0002 revision 1, within the existing product 07 surface and publication/document checks. Retain the current review composition and merge-base selection.",
  "evidence": [
    "Named new input: docs/work-orders/WO-196-the-handoff-is-one-command.md Design, the review-reuse bullet. It explicitly carries latest passing executions at the current code identity, keeps requiredSuites and gateSelection review, and leaves --again forced fresh.",
    "Read runGateChecks composition in scripts/test-runner.mjs and the existing scripts/test-runner.test.mjs case review composition retains source rows and reruns a task whose latest single-suite execution failed. It compares composed review with review --again, checks their passing results, and checks that a later failed task executes again. The full runner-fixtures suite passed in 129.31 seconds during this repair's review.",
    "Product 07 Discipline's handoff paragraph already states the current review-reuse rule; its later evidence-gate paragraph still paired --again with --review as always fresh. That contradiction is the diagnosed documentation defect, not a runner defect.",
    "The queue was recorded at revision 6 and announced at revision 7. After more than 60 seconds of evidence preparation with no new delivered operator steering, the safe-boundary reread still selected the announced item. The check-in and start are actor-attested, at queue revisions 8 and 9; they are not independent inbox observations.",
    "npm run publication:check -- --print-locks computed the affected lock, and npm run publication:check passed with all 254 product headings indexed after it was refreshed. npm run test:docs then passed all 32 checks in 114.714 seconds at 22:49:08.242Z. Both required results completed adjacent-0002 at queue revision 10; the queue has no next item."
  ],
  "rationale": "Evidence-before-claims: the newer order, implementation and executed fixture settle the rule; the older sentence cannot override them. Rule-beating trap: forcing every task fresh would repeat passing work to honor a superseded statement. Scope trap: changing composition would contradict the original order's non-goal. NoOp leaves contradictory guidance capable of producing the same mistaken choice. The correction changes only the documented rule and its publication lock.",
  "rejected": [
    {"option": "Change the runner to make every review fresh", "reason": "Contradicts WO-196, the passing existing regression and this order's preflight/composition non-goal."},
    {"option": "Leave the stale paragraph and cite only the newer paragraph", "reason": "Retains conflicting instructions in the same product document."},
    {"option": "Add a duplicate integration test for the prose correction", "reason": "The existing executed comparison establishes behavior; publication and document checks verify the bounded prose and source-lock edit."}
  ],
  "reopenWhen": "A later authorized order changes review reuse or forced-fresh semantics; reconcile all current descriptions against that order, implementation and executed evidence."
}
```

## WO-198-D015 — Verification: F4 repaired; fail on criterion 2, a comparison that withholds changed fields both snapshots read

```json
{
  "id": "WO-198-D015",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-004",
  "kind": "finding",
  "decision": "Fail VER-004 on criterion 2. VER-003 F4 is repaired: no shared-ref state tried changes a gate's exit code, row or summary. The repair introduced F5. sharedRefChanges (scripts/test-runner.mjs:1927) now skips a branch whenever either side reads absent (:1935-1937). readSharedRefs (packages/skeleton/src/gate-evidence.mjs:497) still maps every failed branch read, missing or unreadable, to absent. A branch that is created or removed by ordinary Git use is therefore never named. Examples are origin/main created by a first push, a removed remote, or a created main. The repair also rejects the whole snapshot once one enumeration is degraded (completeSharedRefs, :1905), so a readable origin/main or main move beside an unreadable tag is not named either. Criterion 2 requires one shared refs moved line naming each changed field, and the order's design makes absent a recorded branch value. VER-003's subject (checkpoint 12) named every one of these branch transitions in the same probe. A new defect in a repair that breaks a criterion is blocking (product 07 §Verification review and attack). F5 lies in declared surfaces. B1 stays on D004's follow-up. The verifier leaves the implementation unchanged.",
  "evidence": [
    "absent.mjs (host scratchpad, under harness bounded), one-commit fixture with build, alpha and a failing beta, two failed '--serial --again' gates. Subject: S1 origin/main created between the two gates (remote added, main pushed) prints no line; S2 the same plus annotated v1.0.0 prints one line naming only 'tags +v1.0.0 (count 0..1, newest absent..v1.0.0)'; S3 remote removed between prints no line; S4 origin/main created during the run prints no line; S5 main created in a repository on topic prints no line; S6 origin/main created from the main checkout between two failed gates in a linked worktree on wo-900 prints no line. Every run exits 1 and records its row. Checkpoint 12 (git archive of scripts and packages), same probe: S1 'since previous: origin/main absent..<id>', S2 the origin/main change and the tags change in one line, S3 '<id>..absent', S4 'during run: origin/main absent..<id>', S5 'main absent..<id>', S6 'origin/main absent..<id>'.",
    "mixed.mjs (host scratchpad, under harness bounded): a failed gate, then main committed and pushed so origin/main and main move, and a loose refs/tags/v9.9.9 naming a missing object, then a failed gate. Subject: exit 1, start reads both moved branch ids with tags {count: absent, newest: absent}, and no line prints. Both branch changes are readable and unnamed.",
    "gitmatrix.mjs (direct Git 2.55.0, host scratchpad): for refs/remotes/origin/main, 'rev-parse --verify --quiet <ref>^{commit}' exits 1 when the ref is missing, dangling or names a tree, and 128 when packed-refs is damaged. 'for-each-ref --format=%(objectname) <ref>' exits 0 with no output when the ref is missing, 0 with the id when it is dangling or names a tree, and 128 when packed-refs is damaged. Plain 'rev-parse --verify', the form readSharedRefs uses, exits 128 in every failing state. D012's rejected-option reason that resolution cannot distinguish a missing branch from an unreadable one is true only of that form.",
    "F4 re-probe (f4.mjs, host scratchpad, under harness bounded) in a linked worktree on wo-900 with the damage written in the main checkout's common Git directory. Three damage shapes: a dangling v tag, a garbage packed-refs line, and an unreadable refs/dotln/ subdirectory. Each was applied before and during the run, under plain '--serial --again', '--document --serial' and '--only beta', passing and failing: 36 runs. Subject: each exits as HEAD does (0 or 1), records one row with four-field start and end, prints one summary and no delta line. HEAD bb84ae82 (git archive): the same exit codes, rows and summaries in all 36. The unreadable refs/dotln/ subdirectory is skipped by Git with exit 0, so its ref is uncounted, at start and end alike.",
    "Re-derived at code identity 87bce92bb6e71517b977d75da3e904a4977c11a8b7c9f92c6e394253bbb4662d (gateCodeIdentity of this worktree, equal to the executor's third-repair rows). Every gate row at this identity carries start and end with the four fields: test:docs at 22:04:40.059Z, 22:10:08.855Z, 22:49:08.242Z, 23:10:54.763Z and mine at 23:31:33.510Z (32 of 32, 121.87 s); npm test review rows at 22:05:00.199Z (exit 1), 22:41:04.262Z (exit 1) and 23:02:15.560Z (exit 0); suite:authority-evidence at 22:06:42.083Z. The consumed review row has gateSelection review, 38 required suites, fresh format and vertical, every other task carried at this identity under WO-196's rule, identity and build output unchanged, exit 0. The 14 WO-198 runner cases pass in 11.70 s under harness bounded. Real corpus: readSharedRefs equals direct Git (bb84ae82 twice, 153 annotated v tags of 153, newest v0.73.0, 1650 refs/dotln/ refs) in 44.7 ms. npm run format:check and git diff --check are clean; root package.json is unchanged."
  ],
  "rationale": "Rule beating: the handoff marks criterion 2 met and the repair's tests assert no line for the shapes it chose not to compare, but the criterion names every changed field and the order records absent as a branch value. Consistency: F1, F2 and F4 each broke behavior main had; F5 breaks a criterion that held at VER-003's subject, so the same blocking route applies, and product 07's follow-up route for new repair defects covers only defects that break no criterion. Repair-loop trap (WO-112): the rule below covers the whole comparison class, every field in both intervals, so the next repair cannot pass by fixing one shape. The delta line's inputs are the four fields at three samples (previous end, start and end), each observed, absent or degraded; the rule fixes the result for every combination. Git's own exit codes supply the distinction, so the rule needs no new reads beyond one quiet flag or one enumeration. NoOp: passing ships a delta line that stays silent when a sibling's first push creates origin/main, the attribution this order exists to provide.",
  "rejected": [
    {"option": "Board F5 as a follow-up because the delta line is diagnostic and the gate result is unaffected", "reason": "Product 07 routes an unmet acceptance criterion as blocking, and criterion 2 is the delta line."},
    {"option": "Treat F5 as a new defect in the repair that breaks no criterion", "reason": "It breaks criterion 2. Checkpoint 12 named all six branch transitions in the same probe."},
    {"option": "Accept D012's conservative limit because absent cannot tell missing from unreadable", "reason": "Git distinguishes them: a quiet rev-parse exits 1 for a missing ref and 128 when packed-refs is damaged, and for-each-ref on the ref exits 0 with no output when it is missing."},
    {"option": "Judge the mixed shape met because VER-003 offered whole-snapshot rejection", "reason": "An offered option does not amend a criterion. D016 corrects that option."},
    {"option": "Route to the operator", "reason": "No choice here is the operator's: the criterion and Git's observed exit codes settle the rule."},
    {"option": "Prescribe one representation for a degraded branch", "reason": "The rule binds behavior. The executor chooses the value, provided it cannot be read as absent or as a count."},
    {"option": "Repair during verification", "reason": "The verifier does not edit the subject it judges."}
  ],
  "followup": "WO-198 resume: fix. (F5) Criterion 2 holds for every field that both compared snapshots read, since the previous row and during the run. (1) A branch Git reports as not existing reads absent, as criterion 1 says: Git completes the read and finds no such ref (git rev-parse --verify --quiet exits 1, or for-each-ref on the ref lists nothing). A change between absent and a commit id is a changed field that the delta line names, as at checkpoint 12. (2) Only a read Git cannot complete is degraded: a non-zero exit other than that clean not-found, such as exit 128 on damaged packed-refs, or a launch failure. A degraded field is recorded so that it cannot be read as absent or as a count, supplies no baseline for its own comparison and is never named. F4's rule still holds: no throw, and the exit code, row with four-field start and end, and summary are unchanged. A ref that exists but does not resolve to a commit (dangling, or naming a non-commit) may be recorded as absent or as degraded; the decision names which, and a value recorded as absent is compared as absent. (3) A degraded field withholds only its own comparison. Every other field that both snapshots read and that differs is named. A structurally malformed or legacy snapshot still supplies no baseline (F1's rule). (4) Correct product 07's third sentence in §Independent workflows and integration in place to state this rule. Regression, kept cheap for runner-fixtures: direct tests of the comparison cover origin/main created between two rows, created during a run and removed; main created; a degraded tag field beside moved origin/main and main (names both branches, not tags); and an all-degraded damaged packed-refs snapshot (names nothing). One gate witness, origin/main created between two failed gates in a linked worktree, asserts one line naming origin/main absent..<id>. The existing F4 gate cases keep passing. (B1) Unchanged; it stays on D004's follow-up.",
  "reopenWhen": "A repair changes readSharedRefs, sharedRefChanges, completeSharedRefs or either call site; a failed row omits a changed field that both snapshots read, names a degraded field, or any shared-ref state changes a gate's exit code, row or summary."
}
```

## WO-198-D016 — Correct VER-003's offered whole-snapshot option for a failed enumeration

```json
{
  "id": "WO-198-D016",
  "date": "2026-10-09",
  "dispatch": "resume: verify; VER-004",
  "kind": "correction",
  "misread": "VER-003 (D011) offered, as one option for F4, that an enumeration that fails outright reads absent, 'which completeSharedRefs already rejects as a baseline'. That treated rejecting the whole snapshot as consistent with criterion 2. The same rule said only that a degraded field supplies no comparison baseline.",
  "meant": "Criterion 2 requires the delta line to name each changed field. A degraded field may withhold only its own comparison, and every other field both snapshots read is still compared.",
  "changed": "D015's F5 rule supersedes that option. The executor followed an option the verifier offered, so the mixed shape is a verifier error carried into the repair. It is still a criterion 2 shortfall, and the next repair settles it with the rest of F5. VER-003's filed bytes are unchanged.",
  "decision": "Record the error in VER-003's offered option and replace it with the field-level rule in D015.",
  "evidence": [
    "D011 followup text: 'An enumeration that fails outright reads its fields as absent, and completeSharedRefs already rejects that as a baseline.'",
    "mixed.mjs at the subject: one degraded tag field and two readable moved branches print no line (D015 evidence)."
  ],
  "rejected": [
    {"option": "Leave VER-003's option standing and judge only the branch transitions", "reason": "That leaves a verifier-offered route that withholds readable changes, and the next repair could keep it."}
  ],
  "reopenWhen": "A later verification of WO-198 offers a repair option that withholds a readable field's comparison."
}
```

## WO-198-D017 — Compare observed absence and withhold only unreadable fields

```json
{
  "id": "WO-198-D017",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-004 F5",
  "kind": "correction",
  "misread": "D012 treated absent as both clean non-resolution and an unavailable read, and rejected a whole comparison interval when an enumeration failed. That omitted observed branch creation/removal and readable fields beside an unreadable inventory.",
  "meant": "Criterion 2 compares every field both snapshots observed, including absent. D015 and D016 distinguish a clean unresolved read from an unavailable read and withhold only the unavailable field. Structurally malformed and legacy snapshots still supply no baseline.",
  "changed": "Use quiet rev-parse: exit 1 records absent, exit 0 retains the commit, and every other exit or launch failure records unreadable. Failed enumerations record unreadable, never zero or partial output. The structural guard admits those explicit unreadable values, and sharedRefChanges skips only their corresponding field. Correct product 07's third sentence in place and refresh its checked publication source lock.",
  "decision": "Keep the four diagnostic fields and both comparison intervals. Missing, removed, dangling and non-commit branch refs record absent and compare as absent; unavailable reads record unreadable and supply no baseline for their own field. Retain the strict identity and persistence helpers and gate outcome behavior.",
  "evidence": [
    "Read WO-198, VER-004 F5, D015/D016, the cited shared-state readers, readSharedRefs, completeSharedRefs, sharedRefChanges, both failure-summary call sites and the existing runner fixtures before editing.",
    "Before repair, the two new focused tests failed: both absent-to-commit branches were omitted by the direct comparison, and an origin/main creation between two failed gates in a linked worktree printed no movement line. repair4-before-transcript.txt preserves the red run at 2026-10-09T23:58:53Z.",
    "After repair, node scripts/harness.mjs bounded -- node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs passed 17 tests with zero failures in 13.502 seconds, at 2026-10-10T00:00:04.845Z. repair4-fixture-transcript.txt preserves the output and PROOF lines.",
    "Direct comparison cases cover absence creation/removal, each unreadable field on either side beside changes to every other field, all-unreadable values and malformed/legacy baselines. The extra refs/dotln/ degradation cases were not quoted in VER-004. One linked-worktree witness names origin/main absent..<commit> exactly once between failed gates and independently reads both persisted failed rows and the summary.",
    "Direct Git witnesses show quiet rev-parse exits 1 for missing, dangling and tree-valued refs. A nonexistent checkout prevents launch and records every field unreadable without throwing. The damaged packed-refs witness records all fields unreadable; the dangling tag withholds only tags; recovery restores the observed inventory.",
    "Existing passing/failing damaged-ref, sibling merge/tag, forced-failure, malformed-baseline, archive-failure, during-run and round-trip regressions pass. No task flips in the reduced-table sibling fixture. That fixture does not cover every live task.",
    "publication:check initially named the expected stale software-engineer source lock after the authorized product sentence edit. --print-locks supplied the replacement; the subsequent check judges it, rather than accepting a guessed digest."
  ],
  "rationale": "Rule beating would retain tests that prove silence instead of the required readable change. The repair-loop trap is addressed for every field on both sides of the common comparison, not only the branch named in F5. Diagnostic failures remain contained at the reader and cannot weaken strict identity or persistence. NoOp retains the demonstrated attribution omissions. Choosing absent for clean dangling/non-commit reads is explicitly permitted by D015 and needs no extra Git call; its existing gate witness now names the observed unresolved commit rather than suppressing it.",
  "rejected": [
    {"option": "Keep skipping absent branches or reject the whole degraded snapshot", "reason": "Both reproduced paths violate criterion 2 and withhold observed changes."},
    {"option": "Use absent, zero or partial counts for an unavailable enumeration", "reason": "Conflates absence with failed observation or invents an inventory."},
    {"option": "Add an existence lookup to classify dangling/non-commit refs as unreadable", "reason": "D015 permits either representation. The clean unresolved-read rule is sufficient and retains four Git calls per sample without another lookup."},
    {"option": "Catch strict identity, execution or persistence failures", "reason": "Only the optional shared-ref diagnostic has authority to degrade."},
    {"option": "Run a whole gate for every comparison shape", "reason": "The comparison is pure; one new linked-worktree witness checks the printed line and durable row, while direct cases cover the input combinations."}
  ],
  "reopenWhen": "A failed row omits a differing field observed at both samples, names an unreadable field, loses its row or summary due to diagnostic reads, or a live task flips without the expected ref delta."
}
```

## WO-198-D018 — Preserve editions and correct the generator invocation

```json
{
  "id": "WO-198-D018",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-004 F5",
  "kind": "correction",
  "misread": "The artifact-identity and verification generators were invoked with the authority generator's --edition and --revision flags, despite their supported mode-only argument lists.",
  "meant": "authority-evidence accepts an explicit override; artifact-identity-evidence and verification-evidence use docs/evidence/current.json to select their immutable output destination.",
  "changed": "The unsupported invocations exited 2 and 1 with their usage messages before minting either edition. Select revision 004 in current.json, then use each generator's supported --write command. Retain every earlier revision and check the selected outputs.",
  "decision": "Retain application v0.73.1, skeleton 0.57.1 and harness host 0.35.1 as the existing unpublished compatible patches. Regenerate the installed harness as immutable snapshot 17cefbf2c2f320ac, retain previous snapshots, and mint/select WO-198 revision 004 authority, artifact-identity and verification evidence for the changed diagnostic module.",
  "evidence": [
    "npm run release -- prepare --local: WO-198 target v0.73.1 remains current; refreshed only meta.json and PR.md. No additional compatibility change or dependency is introduced by this diagnostic correction.",
    "npm run format and npm run build exit 0. node scripts/harness.mjs emit generates 34 surfaces; the resulting manifest selects .runtime/harness/17cefbf2c2f320ac in all three profiles. node scripts/harness.mjs check passes the 34 surfaces.",
    "node scripts/authority-evidence.mjs --write --edition WO-198 --revision 004 succeeds. The supported artifact-identity and verification --write commands mint four files each under revision 004. All three selected editions' --check commands exit 0.",
    "npm run publication:check passes both source locks and 254/254 indexed product headings after the in-place sentence update.",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS does not include the three changed source/test files. feedback-evidence --check exits 0: the retained WO-073 edition carries WO-199 feedback-004's live audit, and ten passing regressions plus ten removal failures pass. No live episode was launched.",
    "The canonical inventoryMaterial(process.cwd()) read returns an empty array; no nested scratch repository remains in the worktree."
  ],
  "rationale": "An already-staged compatible patch is sufficient for a bounded repair before publication. Regeneration updates the new source identity without overwriting the prior observations or installed snapshots. The unsupported flags were a preparation error, not a failed gate or a reason to alter acceptance.",
  "rejected": [
    {"option": "Overwrite revision 003 or keep its changed-source selector", "reason": "The historical records are immutable and the diagnostic source changed."},
    {"option": "Add another component version step", "reason": "The current labels already classify these changed components as unpublished compatible patches."},
    {"option": "Rebuild a live feedback audit solely for this diagnostic module", "reason": "The checked live-subject source list excludes the changed source/test files; the current audit is checked rather than presumed stale."}
  ],
  "reopenWhen": "An edition check rejects current source, a live feedback subject changes, or integration consumes the staged compatible release labels."
}
```

## WO-198-D019 — Record the passing subject and correct the progress claim

```json
{
  "id": "WO-198-D019",
  "date": "2026-10-09",
  "dispatch": "resume: fix; VER-004 F5",
  "kind": "correction",
  "misread": "One chat update described named vertical restart cases as passed while some of those lines were progress reports, not explicit successes.",
  "meant": "An active case name establishes progress only. Explicit ok lines establish individual successes; PASS vertical and the completed gate row establish the suite and whole review verdicts.",
  "changed": "Corrected the chat claim while the suite was active, naming the explicit ok lines for triage scheduling and backoff and leaving the whole verdict pending. The completed review now independently establishes that verdict at the repaired subject.",
  "decision": "Hand off the bounded F5 repair at code identity a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8, settle D015's follow-up on its passing evidence, and retain B1's existing deferred owner and the reduced-table fixture's live-task coverage limit.",
  "evidence": [
    "npm run test:docs exits 0: 32 suites, 32 fresh tasks, 126.059 seconds, recorded 2026-10-10T00:05:43.731Z.",
    "npm test -- --review exits 0: all 38 required suites, 90 fresh tasks, 1731.679 seconds, recorded 2026-10-10T00:34:59.431Z. Runner fixtures pass in 126.537 seconds and vertical passes in 878.244 seconds under its unchanged 900-second deadline. These are complete current-identity rows, not a consumption of the previous repair's result.",
    "repair4-row-readback.json selects both passing rows at the current code identity and independently agrees with the persisted hot index on their sharedRefs. Both identityUnchanged and buildOutputUnchanged are true. Every row carries all four fields at start and end.",
    "Both native gate processes and their canonical evidence waiters have exited. activeGateRuns returns zero. No repository file was written and no agent was started while either gate ran.",
    "A byte comparison of all 34 historical verification-report and revision-001/002/003 evidence files against checkpoint 17 finds zero changes. git diff alone reports the untracked files as absent from the index and cannot judge their current bytes; no recovery or report edit was needed.",
    "git diff --check exits 0. All recorded generation checks pass. The adjacent queue has both prior items completed and no next item; the canonical material inventory is empty."
  ],
  "rationale": "The outcome matches the announced repair: compare readable fields, preserve gate outcomes and contain every unavailable diagnostic read. Direct combinations plus one new linked-worktree witness keep the regression bounded. The full fresh review costs 28.861 minutes of work and waiting, overlapping its task durations; the 13.502-second focused run cannot substitute for this required whole-subject evidence. The larger runner-fixture growth remains D004's known observation; one timing sample does not attribute its variation to this repair.",
  "rejected": [
    {"option": "Treat progress lines or the prior repair's passing row as the current review", "reason": "Progress is not a verdict, and the code identity changed."},
    {"option": "Extend the vertical deadline or weaken the required gate", "reason": "The complete current-identity review passes within the existing bounds."},
    {"option": "Infer deleted immutable files from git diff on untracked paths", "reason": "Their independently read bytes all equal the canonical checkpoint; Git's index comparison is not that observation."},
    {"option": "Repair the separate snapshot-less harness writer here", "reason": "B1 remains on its established deferred follow-up for the next order editing that writer."}
  ],
  "reopenWhen": "A failed gate omits an observed changed field or names an unreadable field, a diagnostic read changes a gate outcome or persistence, or a live task flip exceeds the reduced fixture's coverage."
}
```

## WO-198-D020

<!-- integration refs/dotln/checkpoint/WO-198/23 -->

```json
{
  "id": "WO-198-D020",
  "date": "2026-10-10",
  "dispatch": "resume: final review; worktree integrate WO-198",
  "decision": "Integrate main at final review with the canonical helper. The fetched main equals the order's base, HEAD and origin/main at bb84ae82, so the branch fast-forwarded nothing, merged nothing and resolved no conflict; the uncommitted work was preserved through checkpoint 23 and the named stash and re-applied byte for byte. Carry every acceptance claim forward unchanged on VER-005's evidence at code identity a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8, read before and after integration. Retain application v0.73.1 above the observed v0.73.0 baseline, skeleton 0.57.1 with the console pin and lockfile above upstream's 0.57.0, harness host 0.35.1, and the selected WO-198 revision 004 authority, artifact-identity and verification editions beside upstream's WO-073 feedback edition. The regenerated projections changed only the meter snapshot and the meter block of PR.md.",
  "evidence": [
    "refs/dotln/checkpoint/WO-198/23",
    "base bb84ae82bd5b8e0b92a3face9578e9c3672ba61a",
    "upstream bb84ae82bd5b8e0b92a3face9578e9c3672ba61a",
    "release preparation: WO-198 target v0.73.1 remains current. Files changed: docs/evidence/WO-198/meta.json, docs/final-reviews/WO-198/PR.md. Meter snapshot: docs/evidence/WO-198/meta.json, 4112 bytes. Tag observation: local snapshot only.",
    "git ls-remote before the helper ran: origin's main is bb84ae82 and its newest tag is v0.73.0, equal to the local snapshot the gate rows record (153 annotated v tags, newest v0.73.0). No sibling published while this order was in verification.",
    "npm run worktree -- integrate WO-198 --intake-backup <session-scratch archive of the 3 intake placeholders>: bases bb84ae82 -> bb84ae82, authored conflicts none, stash c1c0f8dcb332ae8c005879e4b7db492b19769863 retained, ten projections regenerated. gateCodeIdentity read a5923da7… before and after.",
    "Affected checks on the integrated tree, each exit 0: npm run publication:check (254/254 headings, both outlines CURRENT); node scripts/harness.mjs check (34 generated surfaces); npm run release -- check-surfaces --local (every license and publish-refusal row passes); node scripts/docs-check.mjs (15 documents, 0 failures); npm run work-orders -- index --check (both pages current); npm run format:check; git diff --check and git diff HEAD --check clean. The review gate is recorded in D021.",
    "Component versions: upstream main carries skeleton 0.57.0 (consumed by WO-073 at v0.73.0); this order's 0.57.1, the console pin and the lockfile sit above it, so no collision and no dependency added. docs/evidence/current.json selects WO-198 revision 004 for authority, artifact identity and verification and retains WO-073's feedback edition, as D018 left it; no evidence input changed in integration."
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

Integration date: 2026-10-10. Original base: `bb84ae82bd5b8e0b92a3face9578e9c3672ba61a`.
Fetched main: `bb84ae82bd5b8e0b92a3face9578e9c3672ba61a`. Checkpoint: `refs/dotln/checkpoint/WO-198/23`.
Named stash retained: `c1c0f8dcb332ae8c005879e4b7db492b19769863` (WO-198 integrate 2026-10-10).
Resolved projections: none.
Release preparation: WO-198 target v0.73.1 remains current. Files changed: docs/evidence/WO-198/meta.json, docs/final-reviews/WO-198/PR.md. Meter snapshot: docs/evidence/WO-198/meta.json, 4112 bytes. Tag observation: local snapshot only.
Carried-forward claims: all five acceptance criteria and the five earlier findings' dispositions (F1 to F5 repaired, B1 deferred on FUP-f5f10101e717d59b) are carried on VER-005's evidence, because the judged bytes are the integrated bytes: the code identity is a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8 before and after integration, no authored path was resolved, and the regenerated projections changed only the meter snapshot and the PR body's meter block. The reviewer's own checks on the integrated tree and the acceptance judgment are in D021 and FINAL-001.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-198-D021 — Final review: pass at the integrated subject; the receipt's cost condition recorded for planning

```json
{
  "id": "WO-198-D021",
  "date": "2026-10-10",
  "dispatch": "resume: final review",
  "decision": "Pass FINAL-001. All five criteria are met at the integrated subject, code identity a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8, byte-identical to VER-005's subject. No new defect: the findings block is empty, B1 stays deferred on FUP-f5f10101e717d59b, and no touching follow-up row's seam was opened. The planning receipt's criterion-3 known issue on runner-fixtures holds as written and is routed to planning with its readings rather than repaired in review. Commit the reviewed state as coherent commits and publish the wo-198 branch with the PR body in docs/final-reviews/WO-198/PR.md.",
  "evidence": [
    "Integration (D020): bases bb84ae82 -> bb84ae82, no authored conflict, identity a5923da7… read before and after; affected checks publication:check, harness check, check-surfaces --local, docs-check, index --check, format:check and git diff --check all exit 0.",
    "Focused reproduction under node scripts/harness.mjs bounded: node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs passed 17 of 17 in 13.16 s; the branch-creation witness printed exactly one line naming origin/main absent..<id>, and the forced-failure line named origin/main, main, tags +v9000.0.1 and refs/dotln/ once.",
    "Real corpus under the bounded runner: readSharedRefs equals direct Git on both branch ids (bb84ae82), 153 annotated of 153 v tags, newest v0.73.0 by tagger date, and 1657 refs/dotln/ refs, in 41.6 ms.",
    "Hot index read directly: seven gate rows at this identity (the executor's two document rows and fresh review row, VER-005's document row, the verification result's inline document row, this review's document row at 01:25:43.019Z and composed review row at 01:25:59.569Z), each with a four-field start and end.",
    "npm run test:docs: 32 passed, 0 failed, 122.59 s, 32 fresh tasks, recorded 2026-10-10T01:25:43.019Z. npm test -- --review: 38 passed, 0 failed, 7.82 s, composed from 37 reused tasks of the executor's row at 00:34:59.431Z (90 fresh tasks, 1731.679 s) plus the fresh format preflight, identity and build output unchanged, recorded 2026-10-10T01:25:59.569Z. Neither gate printed a shared refs moved line.",
    "runner-fixtures readings: 126.537 s fresh in the executor's review row at this identity; 77.7 s at the first WO-198 row (18:33 single-suite) and 89.2, 97.2, 114.3, 129.3, 126.5 s across the five review rows; main's index holds 219 fresh passing tasks from 2026-09-09 to activation with median 21.754 s (threshold 27.192 s) and reads 72 to 94 s on 2026-10-09 before activation, 64 to 67 s on most of 2026-10-05 and 2026-10-06, and 21 to 39 s on 2026-10-03; the 17 WO-198 cases take 13.16 s in isolation.",
    "Follow-up register: 22 touching rows read over three pages; none disposed. Cold start unchanged in both roots (executor 28,112 of 29,246; reviewer 26,884 of 28,884). Repeated authority.json copies 8,374,430 of 195,267,385 evidence bytes (4.29%), under ER4-006's 10% line. Product 07 at 184,398 of 196,693 bytes.",
    "Process cost: entry 143414 tokens at 2026-10-10T01:12:12.611Z, handoff 5560487 tokens at 2026-10-10T01:29:06.883Z, source claude-transcript-message-usage, scope dispatch; subagents 0 of 20; reasoning tokens and dollar cost unavailable."
  ],
  "rationale": "Rule beating: carrying VER-005's pass across integration is sound only because the identity was read on both sides and the regenerated projections changed no judged byte; each criterion was re-derived from fixture output, rows and source rather than from the handoff's lines. Repair-loop trap: the fifth report settled the rule; this review reproduced it instead of reopening the attack, and found nothing. Rule-beating in the other direction: the fired runner-fixtures condition breaks no criterion and no behavior main had, and the fixture is the criterion-3 deliverable, so trimming it in review would remove reviewed evidence to pass a check; the condition is measured and routed to planning. Economy: the composed review row at the unchanged identity costs 7.82 s against the executor's 1731.7 s fresh run and is the row the order's evidence line names. NoOp leaves worktree gate rows silent about the shared refs they saw.",
  "rejected": [
    {"option": "Rerun the review gate fresh at the unchanged identity", "reason": "WO-196's composition rule carries passing tasks at the current code identity; the executor's fresh row at this identity exists, and a repeat supplies no new evidence."},
    {"option": "Fail or board the runner-fixtures growth as a defect of this order", "reason": "It breaks no criterion and no behavior main had; the growth predates the order (main's task read 72 to 94 s the same day before activation); product 07 makes such a finding a follow-up by rule, and the receipt's condition is a planning judgment."},
    {"option": "Reduce the fixture's whole-gate cases in review", "reason": "A reviewer writes no behavioral or test change and certifies it; D008 and D017 already split input shapes into direct tests."},
    {"option": "Reopen ER4-005 on the failure-path history read", "reason": "The read runs only on a failed gate, is bounded at 439 ms over 10,760 rows, and the row's own condition (the document gate's median) is unchanged; the observation is recorded on the row's text in FINAL-001."}
  ],
  "followup": "Planning, with the next pass that judges WO-198's catalog row or WO-197's task-growth rule: the refutation receipt 041 criterion-3 known issue on WO-198 fired. The runner-fixtures fresh task read 126.537 s in the review row at identity a5923da7 against the receipt's threshold of 27.192 s (219 main rows 2026-09-09 to activation, median 21.754 s), while main's own task read 72 to 94 s on 2026-10-09 before activation and the 17 WO-198 cases cost 13.16 s in isolation. Decide whether WO-197's duration rule applies to this task, whether the thirty-day median should be re-based on the rows after 2026-10-03, and whether a fixture-cost pass over the whole task is warranted; this order's cases are already split into whole-gate witnesses and direct tests (D008, D017).",
  "reopenWhen": "A live gate failure after a sibling merge prints no delta line despite a difference in the recorded fields; a reused review row at an unchanged identity hides a task whose result depended on a shared ref (WO-196's known issue); or planning re-bases the runner-fixtures threshold and this order's cases exceed their share of it."
}
```
