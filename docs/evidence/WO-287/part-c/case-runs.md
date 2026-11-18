# Part C, and the repairs after Part B's readers: the cases it added or changed, each run alone

Run 2026-11-17 from 19:34:02 to 19:38:07 UTC by a script in session scratch (`case-runs.mjs`), one invocation a case:

```text
node scripts/harness.mjs bounded -- node --test --test-name-pattern '^<the case's whole name>$' <its file>
```

A package's TypeScript case runs from its built file under `dist/test/`. The script keeps each invocation's raw output before it reads it, and counts a case as passed only where the invocation exits 0, reports no failure and prints the named case's own passing result line, so an invocation whose pattern selected nothing is no pass.

**Result:** 13 invocations; 13 passed; 0 failed.

## Which cases the change added or changed

The Kind column is read from the syntax tree and the difference with the tree of Part B's checkpoint (`77f7f21764e7`) (`case-inventory.mjs`, which parses each changed test file with the parser the repository's formatter uses). A case is a call of `test` whose first argument is a plain string, and its extent is that call's own first to last line. `added` is a case the base does not hold. `changed` is a case the base holds with a line of the difference inside its extent; a subtest made with `t.test` runs only when its parent runs, so a line inside one names its parent, the smallest thing a name pattern can select there.

By that reading the change added 2 cases and changed 11, 13 in all, and every one of them is a row below. Of the cases called changed, 0 hold the base's own bytes.

The part's own three cases (the document check's, the configuration case and the features list's) first ran alone between 19:03:58 and 19:04:02 UTC, before the part's suites; this run is of every case as it stood after the readers' repairs.

| Started (UTC) | Kind | File | Case | Exit | Tests | Pass | Fail | Own result line |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 19:34:02 | changed | `scripts/test-configuration-root.mjs` | a stop's level comes from its class and the root's kind until the root sets it | 0 | 6 | 6 | 0 | ok 1 - |
| 19:34:02 | added | `scripts/test-docs-check.mjs` | WO-287 criterion C1: in an instance the paraphrase rule's stop advises with one line for each file however many runs it holds and fails nothing; at refuse and in core each run fails as before, off says nothing, and the election advises where the root sets no level | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:04 | changed | `scripts/test-features.mjs` | legacy feature overlays share schema and regular-file validation | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:04 | changed | `scripts/test-features.mjs` | WO-287 criterion A8: the features list prints one row for each stop with its id, class, what it protects, its level in this root, who set it and the line or file that changes it, lists a lifecycle command's refusal with its way forward, and prints no Not electable list | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:05 | changed | `scripts/test-features.mjs` | WO-287 criterion B1: the features list prints one row for each feedback unit and each shared role rule with its id, its layer, how it is enforced, whether this root equips it and the overlay line that changes it | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:05 | added | `scripts/test-features.mjs` | WO-287 criterion B1: applying the overlay line a rule's row prints changes whether that rule is equipped and changes no other, whatever the overlay's two lists hold | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:05 | changed | `scripts/test-features.mjs` | WO-287 criterion B3: an overlay that names single ids removes or restores exactly those, a platform-layer id in unequip is named in one advisory and kept, and in an instance an unknown id is named in one advisory and ignored | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:06 | changed | `scripts/test-harness.mjs` | WO-287 criterion B2: with unequip author in an instance's overlay the role roots carry no author-layer unit's line and no author-layer rule's sentence, the settings register no hook of an author-layer unit, and every role's numbered steps and every platform-layer rule remain | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:07 | changed | `scripts/test-harness.mjs` | WO-287 criterion B6: core's root emits its Clean Room section and its residue line as before, and no overlay id, stop or rule names the floor | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:08 | changed | `scripts/test-launchpad-export.mjs` | WO-287 criterion B6: a fresh export's CLAUDE.md says its Clean Room and Secrets sections are the owner's own text, its kit guide has the section that states which layer is whose, and its features list prints the rules and no line saying the floor cannot be chosen | 0 | 1 | 1 | 0 | ok 1 - |
| 19:34:14 | changed | `scripts/test-launchpad-update.mjs` | export update preserves ownership, validates actions and keeps the exported resident | 0 | 19 | 19 | 0 | ok 1 - |
| 19:37:55 | changed | `scripts/test-launchpad-update.mjs` | WO-287 criterion B5: an update plans a generated surface the instance's build leaves out as left out where its harness manifest names it and its check passes, and a surface the prior kit did not list as the instance's own emit's | 0 | 1 | 1 | 0 | ok 1 - |
| 19:38:01 | changed | `scripts/test-target-worktree-start.mjs` | WO-287 criterion A1: a target worktree's guards keep the levels of their last emit, and its check and its launchpad name the stops that have changed since and the emit that brings them current | 0 | 1 | 1 | 0 | ok 1 - |

## What is no case

The difference also changes lines outside every case in these files (an import, a helper, a fixture list): `scripts/test-docs-check.mjs` (7 lines), `scripts/test-features.mjs` (2 lines). Such a line is run by every case of its file that uses it, and by the suites that hold the file.
