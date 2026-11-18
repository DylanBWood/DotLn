# Part A: the cases it added or changed, each run alone

Run 2026-11-17 from 16:22:57 to 16:29:10 UTC by a script in session scratch (`case-runs.mjs`), one invocation a case:

```text
node scripts/harness.mjs bounded -- node --test --test-name-pattern '^<the case's whole name>$' <its file>
```

A package's TypeScript case runs from its built file under `dist/test/`. The script keeps each invocation's raw output before it reads it, and counts a case as passed only where the invocation exits 0, reports no failure and prints the named case's own passing result line, so an invocation whose pattern selected nothing is no pass.

**Result:** 45 invocations; 45 passed; 0 failed.

## Which cases the change added or changed

The Kind column is read from the syntax tree and the difference with the order's base (`b08b8e811`, the merge base with main), ending at the tree of Part A's checkpoint (`064ccc58983a`) (`case-inventory.mjs`, which parses each changed test file with the parser the repository's formatter uses). A case is a call of `test` whose first argument is a plain string, and its extent is that call's own first to last line. `added` is a case the base does not hold. `changed` is a case the base holds with a line of the difference inside its extent; a subtest made with `t.test` runs only when its parent runs, so a line inside one names its parent, the smallest thing a name pattern can select there.

By that reading the change added 17 cases and changed 21, 38 in all, and every one of them is a row below. Of the cases called changed, 0 hold the base's own bytes.

Each row is the invocation as it ran at the time shown, on the work tree as it stood then; the checkpoint was made at 17:01 UTC, after the part's three suites had passed.

7 rows below are `additional`: the case was run, and no line of its own differs from the base. The script first listed its cases by the test that opens before a changed line, which names the case standing before a helper or a new case that the change put after it; those invocations are kept as the additional coverage they are and are no part of the count above.

| Started (UTC) | Kind | File | Case | Exit | Tests | Pass | Fail | Own result line |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 16:22:57 | changed | `packages/compiler/test/harness.test.ts` | WO-049 target lowering is explicit, omits importRoot from metadata and emits PreToolUse only | 0 | 1 | 1 | 0 | ok 1 - |
| 16:22:58 | changed | `scripts/test-beacon-portability.mjs` | WO-070 copied control plane emits a decoded Beacon without TypeScript source or a built skeleton runtime | 0 | 1 | 1 | 0 | ok 1 - |
| 16:22:59 | additional | `scripts/test-configuration-root.mjs` | npm run limits lists every key, and --write keeps what the owner set while it refreshes the kit's figures | 0 | 5 | 5 | 0 | ok 1 - |
| 16:23:00 | added | `scripts/test-configuration-root.mjs` | a stop's level comes from its class and the root's kind until the root sets it | 0 | 5 | 5 | 0 | ok 1 - |
| 16:23:00 | added | `scripts/test-configuration-root.mjs` | a line that names no stop, no level or, in an instance, no feature is named once and ignored | 0 | 4 | 4 | 0 | ok 1 - |
| 16:23:01 | changed | `scripts/test-dispatch-bound.mjs` | configured lifecycle roots share the installed journal lane and preserve their request boundary | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:01 | additional | `scripts/test-dispatch-bound.mjs` | WO-276 criterion P7: a planner session starts at its own dispatch beside an earlier planner session's journal on the same dispatch line and counts none of its complete runs; an executor redispatched in one order's phase keeps the earlier start | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:01 | added | `scripts/test-dispatch-bound.mjs` | WO-287 criterion A4: with the dispatch bound spent, the probe wrapper and a re-dispatch start their work in an instance root and print the bound's advisory; at refuse, and in core, each is withheld as before | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:02 | changed | `scripts/test-features.mjs` | feature inventory reports elections, budgets, unread switches and escaped notes, and refuses the retired overlay choice | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:02 | changed | `scripts/test-features.mjs` | features render/check obey configured roots and distinguish built from queued consumers | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:03 | additional | `scripts/test-features.mjs` | private-destination preserves customized Secrets sections and refuses to rewrite them | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:03 | added | `scripts/test-features.mjs` | WO-287 criterion A8: the features list prints one row for each stop with its id, class, what it protects, its level in this root, who set it and the line or file that changes it, lists a lifecycle command's refusal with its way forward, and prints no Not electable list | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:04 | changed | `scripts/test-harness.mjs` | WO-146 three contributors share unique outputs while workers remain explicitly two | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:04 | changed | `scripts/test-harness.mjs` | WO-135 generated planning hooks refuse repository code paths and preserve documents, scratch and override | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:16 | changed | `scripts/test-harness.mjs` | WO-168 a granted session root is a real directory: a linked root grants nothing, a real or absent root grants, and an unreadable root advises once | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:27 | changed | `scripts/test-harness.mjs` | WO-144 generated hooks apply active-role grants to physical writes and removals | 0 | 1 | 1 | 0 | ok 1 - |
| 16:23:48 | changed | `scripts/test-harness.mjs` | WO-144 FINAL-001 F1 a moved working directory is still judged and journals in the hook's own project | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:04 | changed | `scripts/test-harness.mjs` | WO-246 a fork's clone refuses a gh pull-request or issue command that names no repository, naming origin, and admits every form that names one | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:23 | changed | `scripts/test-harness.mjs` | WO-276 criterion Q3: on a planning branch a read asks Git for no branch, a write outside the admitted paths is refused in the words it had, and a tool the table does not hold is asked the branch as a write is | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:28 | additional | `scripts/test-harness.mjs` | WO-284 criterion 8: the emitted reviewer and executor roots say, in the step that names the complete run, that an edit to documents alone owes the document gate and no complete run | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:28 | added | `scripts/test-harness.mjs` | WO-287 criterion A4: in an instance a planning-branch write, a write under a live gate, a launch past the dispatch bound and a worker past the cap go on with an advisory naming the stop and what it protects; in core each is denied as before | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:32 | added | `scripts/test-harness.mjs` | WO-287 criterion A5: in an instance another session's writer reservation and a write outside the project are refused as before, naming the stop and its line, and go on with the advisory where the owner sets advise | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:35 | added | `scripts/test-harness.mjs` | WO-287 criterion A9: a stop with its own switch keeps that switch: with desktop-control and plan-first unset their refusals answer in an instance as in core, and a stops line sets neither | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:37 | added | `scripts/test-harness.mjs` | WO-287 criterion A10: the emitted instruction block, the role roots and each hook refusal name no operator override: route past a refusal, and the block says a stop's level is its owner's to change | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:39 | added | `scripts/test-harness.mjs` | WO-287 criterion A11 and its step: an emit writes the levels a root lowers into every hook's configuration, and leaves out the host deny rules of the ssh and package-publish stops where the owner lowers them | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:41 | added | `scripts/test-harness.mjs` | WO-287 adjacent: an election the lifecycle cannot read refuses an executor's write and admits its reads and the commands whose destinations cannot be named, so the file at fault can be repaired | 0 | 1 | 1 | 0 | ok 1 - |
| 16:24:43 | changed | `scripts/test-launchpad-export.mjs` | the exported instance checks runtime, coordination records and explicit diagnostics separately | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:06 | changed | `scripts/test-launchpad-export.mjs` | WO-074 criteria 1, 2 and 5: without package source the export activates its first order, a transition emits a decodable control Beacon, an unmatched attestation records with the advisory, and a Codex dispatch reserves its writer on the carried runtime | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:16 | changed | `scripts/test-outward-lint.mjs` | copied CLI runs with relocated documents and no default document tree | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:17 | added | `scripts/test-review-worker.mjs` | WO-287 criterion A4: in an instance the review helper's launch past the cap starts its worker, counts the use and prints the cap's advisory; set to refuse it is withheld as in core | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:17 | changed | `scripts/test-runner.test.mjs` | kit checks execute fresh against ignored runtime and document inputs under full gate protection | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:23 | additional | `scripts/test-runner.test.mjs` | WO-284 criterion 4: no file on the gate path passes a time limit that is not read from the table, and every key of the table is read on that path | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:23 | added | `scripts/test-runner.test.mjs` | WO-287 criterion A6: in an instance a failed task whose stop is a record row is recorded as advised with its output, the tasks after it run and the selection passes naming the advised tasks; at refuse, for a task that is no stop, for a task ended for time, and in core, the selection fails as before | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:30 | added | `scripts/test-runner.test.mjs` | WO-287 criterion A6: the document check reports each failure with its own stop: in an instance a form defect alone leaves the task advised, a private absolute path alone fails it, and both together fail it naming the path and print the form defect as advised | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:32 | changed | `scripts/test-target-harness.mjs` | WO-049 target capabilities distinguish observed omissions from unavailable hooks | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:32 | changed | `scripts/test-target-harness.mjs` | WO-049 removal preserves appended user rules and refuses duplicate exclude markers before mutation | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:34 | changed | `scripts/test-target-harness.mjs` | WO-276 criterion Q1: a target installed while its bundle held a presence hook verifies, is replaced without the hook and is removed | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:36 | additional | `scripts/test-target-harness.mjs` | WO-276 criterion K3: a target worktree's emitted settings hold the launchpad's settings fragment as the launchpad's own do, its check passes on them, a fragment the merge refuses stops the emit before anything is written, and with the fragment removed the emit writes the bytes it writes with none | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:38 | added | `scripts/test-target-harness.mjs` | WO-287 criterion A11: a target worktree's bundle carries its launchpad's levels in every guard's configuration and leaves out the host deny rules of a lowered ssh or package-publish stop | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:40 | changed | `scripts/test-target-worktree-start.mjs` | WO-072 criterion 1: declared target base, governed ignored bundle and conventional commits | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:44 | changed | `scripts/test-target-worktree-start.mjs` | preparation retry resumes the recorded pair after bootstrap or harness failure | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:50 | additional | `scripts/test-target-worktree-start.mjs` | WO-276 criterion L4 (the count): only a commit's id is counted from, and a clone whose history cannot answer, shallow or partial, gives unknown and starts no transfer | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:51 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A1: in an instance a target worktree's guard allows a call the kit's scoping cannot judge, answering as the launchpad's hook does, and denies it where that stop is set to refuse | 0 | 1 | 1 | 0 | ok 1 - |
| 16:28:59 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A2: an effect the compiled authority names as denied is refused in an instance's target worktree, naming its stop and the line, and goes on with the advisory where that stop is set to advise | 0 | 1 | 1 | 0 | ok 1 - |
| 16:29:06 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A3: a target worktree's guard that cannot reach the launchpad's runtime allows the call and says nothing there is being judged, denies as before where its stop is set to refuse, and stands down while operator override: is on | 0 | 1 | 1 | 0 | ok 1 - |

## What is no case

The difference also changes lines outside every case in these files (an import, a helper, a fixture list): `scripts/test-configuration-root.mjs` (24 lines), `scripts/test-dispatch-bound.mjs` (1 line), `scripts/test-features.mjs` (4 lines), `scripts/test-harness.mjs` (84 lines), `scripts/test-review-worker.mjs` (1 line), `scripts/test-runner.mjs` (249 lines), `scripts/test-runner.test.mjs` (79 lines), `scripts/test-target-harness.mjs` (10 lines), `scripts/test-target-worktree-start.mjs` (60 lines). Such a line is run by every case of its file that uses it, and by the suites that hold the file.
