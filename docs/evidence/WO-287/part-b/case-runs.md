# Part B, and the repairs after Part A's readers: the cases it added or changed, each run alone

Run 2026-11-17 from 18:06:16 to 18:11:24 UTC by a script in session scratch (`case-runs.mjs`), one invocation a case:

```text
node scripts/harness.mjs bounded -- node --test --test-name-pattern '^<the case's whole name>$' <its file>
```

A package's TypeScript case runs from its built file under `dist/test/`. The script keeps each invocation's raw output before it reads it, and counts a case as passed only where the invocation exits 0, reports no failure and prints the named case's own passing result line, so an invocation whose pattern selected nothing is no pass.

**Result:** 27 invocations; 27 passed; 0 failed.

## Which cases the change added or changed

The Kind column is read from the syntax tree and the difference with the tree of Part A's checkpoint (`064ccc58983a`) (`case-inventory.mjs`, which parses each changed test file with the parser the repository's formatter uses). A case is a call of `test` whose first argument is a plain string, and its extent is that call's own first to last line. `added` is a case the base does not hold. `changed` is a case the base holds with a line of the difference inside its extent; a subtest made with `t.test` runs only when its parent runs, so a line inside one names its parent, the smallest thing a name pattern can select there.

By that reading the change added 15 cases and changed 8, 23 in all, and every one of them is a row below. Of the cases called changed, 0 hold the base's own bytes.

4 rows below are `additional`: the case was run, and no line of its own differs from the base. The script first listed its cases by the test that opens before a changed line, which names the case standing before a helper or a new case that the change put after it; those invocations are kept as the additional coverage they are and are no part of the count above.

| Started (UTC) | Kind | File | Case | Exit | Tests | Pass | Fail | Own result line |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 18:06:16 | added | `scripts/test-drive.mjs` | WO-287 criterion A4: the driver starts a phase past the drive's budget where the budget's stop advises, counting the use and saying so, and withholds it where the stop refuses | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:16 | changed | `scripts/test-features.mjs` | feature inventory reports elections, budgets, unread switches and escaped notes, and refuses the retired overlay choice | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:17 | additional | `scripts/test-features.mjs` | WO-287 criterion A8: the features list prints one row for each stop with its id, class, what it protects, its level in this root, who set it and the line or file that changes it, lists a lifecycle command's refusal with its way forward, and prints no Not electable list | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:17 | added | `scripts/test-features.mjs` | WO-287 criterion B1: the features list prints one row for each feedback unit and each shared role rule with its id, its layer, how it is enforced, whether this root equips it and the overlay line that changes it | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:17 | added | `scripts/test-features.mjs` | WO-287 criterion B3: an overlay that names single ids removes or restores exactly those, a platform-layer id in unequip is named in one advisory and kept, and in an instance an unknown id is named in one advisory and ignored | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:18 | changed | `scripts/test-harness.mjs` | disabled harness keeps core and kit floors while removing built navigation and runtime warnings | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:20 | changed | `scripts/test-harness.mjs` | WO-287 criterion A10: the emitted instruction block, the role roots and each hook refusal name no operator override: route past a refusal, and the block says a stop's level is its owner's to change | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:21 | additional | `scripts/test-harness.mjs` | WO-287 adjacent: an election the lifecycle cannot read refuses an executor's write and admits its reads and the commands whose destinations cannot be named, so the file at fault can be repaired | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:23 | added | `scripts/test-harness.mjs` | WO-287 Part B step 1: the configured program for an overlay that names one unit and one rule carries neither, and names what it leaves out | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:24 | added | `scripts/test-harness.mjs` | WO-287 criterion B2: with unequip author in an instance's overlay the role roots carry no author-layer unit's line and no author-layer rule's sentence, the settings register no hook of an author-layer unit, and every role's numbered steps and every platform-layer rule remain | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:25 | added | `scripts/test-harness.mjs` | WO-287 criterion B4: with no unit or rule id in its overlay an instance's role roots name in their Origin comments the unit ids they named at the order's base and carry every shared rule's sentence | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:27 | added | `scripts/test-harness.mjs` | WO-287 criterion B5: harness check passes in an instance whose overlay unequips author-layer rules, a later emit leaves them absent, and the session hook gives no context of a rule left out | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:30 | added | `scripts/test-harness.mjs` | WO-287 criterion B6: core's root emits its Clean Room section and its residue line as before, and no overlay id, stop or rule names the floor | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:32 | added | `scripts/test-launchpad-export.mjs` | WO-287 criterion B6: a fresh export's CLAUDE.md says its Clean Room and Secrets sections are the owner's own text, its kit guide has the section that states which layer is whose, and its features list prints the rules and no line saying the floor cannot be chosen | 0 | 1 | 1 | 0 | ok 1 - |
| 18:06:38 | changed | `scripts/test-launchpad-update.mjs` | export update preserves ownership, validates actions and keeps the exported resident | 0 | 19 | 19 | 0 | ok 1 - |
| 18:10:26 | added | `scripts/test-launchpad-update.mjs` | WO-287 criterion B5: an update plans a generated surface the instance's build leaves out as left out where its harness manifest names it and its check passes, and a surface the prior kit did not list as the instance's own emit's | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:33 | changed | `scripts/test-review-worker.mjs` | WO-287 criterion A4: in an instance the review helper's launch past the cap starts its worker, counts the use and prints the cap's advisory; set to refuse it is withheld as in core | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:34 | changed | `scripts/test-runner.test.mjs` | dispatch bounds stop complete host admission on each metric and preserve focused reproduction | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:38 | added | `scripts/test-runner.test.mjs` | WO-287 criterion A6: the line naming advised stops is read from the document check alone, so a suite that prints one is recorded as passed | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:39 | additional | `scripts/test-target-worktree-start.mjs` | WO-276 criterion L4 (the count): only a commit's id is counted from, and a clone whose history cannot answer, shallow or partial, gives unknown and starts no transfer | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:40 | changed | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A1: in an instance a target worktree's guard allows a call the kit's scoping cannot judge, answering as the launchpad's hook does, and denies it where that stop is set to refuse | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:49 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A1: a session standing under the worktree's root or outside it is advised of that once, and everything else of its calls is still judged | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:54 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A1: a target worktree's guards keep the levels of their last emit, and its check and its launchpad name the stops that have changed since and the emit that brings them current | 0 | 1 | 1 | 0 | ok 1 - |
| 18:10:59 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A2: desktop control is denied in an instance's target worktree whatever its levels and its election, naming its own stop and no line that lowers it | 0 | 1 | 1 | 0 | ok 1 - |
| 18:11:03 | changed | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A2: an effect the compiled authority names as denied is refused in an instance's target worktree, naming its stop and the line, and goes on with the advisory where that stop is set to advise | 0 | 1 | 1 | 0 | ok 1 - |
| 18:11:13 | additional | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A3: a target worktree's guard that cannot reach the launchpad's runtime allows the call and says nothing there is being judged, denies as before where its stop is set to refuse, and stands down while operator override: is on | 0 | 1 | 1 | 0 | ok 1 - |
| 18:11:18 | added | `scripts/test-target-worktree-start.mjs` | WO-287 criterion B8: with the attribution unit unequipped, or author, an emit into a registered target worktree writes no attribution setting and registers no attribution hook, its check passes, and the writer reservation there answers at its stop's level | 0 | 1 | 1 | 0 | ok 1 - |

## What is no case

The difference also changes lines outside every case in these files (an import, a helper, a fixture list): `scripts/test-drive.mjs` (3 lines), `scripts/test-features.mjs` (61 lines), `scripts/test-harness.mjs` (43 lines), `scripts/test-launchpad-export.mjs` (1 line), `scripts/test-launchpad-update.mjs` (1 line), `scripts/test-review-worker.mjs` (1 line), `scripts/test-runner.mjs` (50 lines), `scripts/test-runner.test.mjs` (1 line), `scripts/test-target-worktree-start.mjs` (53 lines). Such a line is run by every case of its file that uses it, and by the suites that hold the file.
