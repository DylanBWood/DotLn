# WO-252 handoff

The executor's ledger for WO-252 (v0.112.0, minor), as repaired after
[VER-001](../../verifications/WO-252/VER-001.md) and again after
[VER-002](../../verifications/WO-252/VER-002.md). Each criterion is judged
on its own line with its evidence, then the review ladders, the complete
runs, the measurements the order asks for, the follow-ups, what stays
untested, the actor attestations and the process cost. Decisions are in
[decisions.md](decisions.md): D001 to D014 from the execution, D015 to D018
from the first verification, D019 to D022 from the first repair, D023 to D025
from the second verification and D026 to D029 from the second repair.

**Criterion 1:** met. `scripts/test-target-worktree-close.mjs` "WO-252 one \*\*/node_modules entry closes nested Vite and Vitest caches and the root's cache on the first attempt, listing each under that entry": a registration declaring `**/node_modules` closes a target holding `libs/a/node_modules/.vite`, `libs/b/node_modules/.vitest` and `node_modules/.cache` on its first attempt with a null blocker; the summary prints `**/node_modules (6 in 3 matches)` and the record's row lists `libs/a/node_modules` (2 files), `libs/b/node_modules` (1) and `node_modules` (3). "WO-252 a one-segment glob takes only its depth, and a glob match through a link still refuses as a declared root does": under `libs/*/dist`, an ignored `libs/a/src/dist` is refused as undeclared and left in place, and the later close deletes `libs/a/dist` alone (one match, one file); a link at `libs/c/node_modules` refuses as `declared root libs/c/node_modules (matched by **/node_modules) has a symlinked component`, class `declared-root-unreadable`, with the outside directory untouched. `scripts/test-configuration-root.mjs` "configuration root": `*`, `**`, `**/*`, `libs/**` and `libs/*/**` are refused at registration naming the floor, `libs/**dist` and `**.tsbuildinfo` are refused as `**` inside a segment, and `**/*.tsbuildinfo` is admitted ([D004](decisions.md#wo-252-d004)).

**Criterion 2:** met. `scripts/test-target-worktree-close.mjs` "WO-252 a fork-shaped target closes on its first attempt: …": a target holding `docs/control/local/harness/` journals, a `reviews/WO-999/` lane, a released writer directory, the `.runtime/.metadata_never_index` marker, a file of the harness snapshot the launchpad runtime installs and a temporary-root ledger, none declared, closes on its first attempt with no earlier attempt stopped; the journals and the review are in main's `local/retained/WO-999/harness/` lane, `targetCleanup.residue` records the journals moved (three files) and the writer, marker, snapshot and ledger deleted, and the ledger's registered root is carried in `ownedTemporaryRoots`. "WO-252 a target close refuses what the kit did not write and stops on a held writer before deleting anything": in both modes `.env`, `.runtime/notes.txt`, an operator note in the lane, a note beside the snapshot's packages and one inside a package, each mirrored into main's snapshot directory, a package file under a snapshot name no runtime computes and an edited package file are refused as undeclared and kept with every residue path; `writer.json` or a non-empty `writer/` then stops the close as `writer-held` with nothing moved or deleted. "WO-252 the kit's snapshot cleanup removes only its listed files, so a tracked file beside them survives": with the record tracked byte for byte beside a tracked file, the snapshot's package file and package link go (two files) and both tracked files stay in the merged base; with another tracked file at the record's path, both close modes stop as `declared-root-unreadable` naming it and nothing is deleted ([D019](decisions.md#wo-252-d019)). "WO-252 a foreign file at a snapshot's record path under a declared root is deleted as declared output, …": with `.runtime` declared, an untracked foreign file at the record's path goes as declared output beside the snapshot's own residue on the first attempt. Snapshot ownership is proven against the serving runtime's own package source (the combined review's round three F1); restoring the earlier same-named-directory rule makes the refusal case fail ([D005](decisions.md#wo-252-d005)). The repair of VER-001 F1 proves a snapshot an earlier runtime installed by its content, never its name ([D019](decisions.md#wo-252-d019)). "WO-252 snapshots earlier runtimes installed are the kit's residue too, …" puts three snapshots in the target, all installed by `preserveHarnessRuntime`: one from a runtime whose pinned list differed, proven by the record its installer wrote; one installed before records, proven by its own package files; and the current one. A note inside the first is refused alone, and an edited package byte in the second refuses that snapshot's files without naming the other two; nothing is deleted on either refusal. With an unwritable directory in each earlier snapshot, a close stops by EACCES part way through each in turn and keeps its record, the installer's or the one the close wrote before deleting a record-less snapshot, and the last retry deletes all three with a null blocker. In `scripts/test-harness.mjs`, "WO-252 a snapshot carries the input its name hashes, …" covers the record's digest, a fresh install writing it, an existing snapshot never rewritten, the content proof and its refusals. Both VER-001 snapshot probes pass. The repair of VER-002 F1 proves a snapshot installed before records by its own package files with the pinned list its release used, which the kit keeps for v0.83.0 to v0.111.1, whichever list the serving runtime pins ([D026](decisions.md#wo-252-d026)): "WO-252 a snapshot a release before records installed proves itself by the list that release pinned, …" reads `scripts/fixtures/wo252-pre-record-snapshots.json`, the names the v0.82.0, v0.83.0 and v0.111.1 installers gave a snapshot of one small runtime: the kept lists are those releases' lists, today's naming gives each recorded name, each record-less snapshot is proven with no serving runtime's list, an edited one is not, and v0.82.0's, named by its pinned files alone, is not; `docs/evidence/WO-252/repair-3-release-history-probes.mjs` reads the 33 release tags from v0.83.0 to v0.111.1 and reruns those installers to reproduce the fixture. The close case above adds a snapshot of the v0.83.0 to v0.102.0 list, proven by that list alone through its interrupted deletion and deleted with the others, and "WO-252 a declared file at a snapshot's record path gives way to the record before any of the snapshot goes, …" keeps such a snapshot provable when a declared file sat at its record path. After the repair's first review round, "WO-252 what a tracked link in the target reaches is not the close's to move or delete, …" closes a target that tracks `docs/control` as a link with the journal, writer directory and review beyond it untouched ([D028](decisions.md#wo-252-d028)). The repair of VER-002 F2 takes the temporary-root ledger last, immediately before Git removes the worktree, and writes it back when that removal stops ([D027](decisions.md#wo-252-d027)): in "WO-252 a target removal that Git stops leaves the temporary-root ledger as it was, …" a locked target's close stops with the segment back byte for byte, its row `restored`, and an expired root it registers prunable before and after; the retry removes the target and its own prune removes the root; in "WO-252 a declared-output deletion that stops leaves the temporary-root ledger untouched, …" the ledger is never taken. Both VER-002 probes pass: the pre-record installer's snapshot closes with status 0 and neither snapshot retained, and the stopped removal keeps the ledger and the root's candidacy.

**Criterion 3:** met. `scripts/test-release.sh` `release_case_success`: the worktree-removal row carries the seven children `base-fetch`, `disposable-deletion`, `finder-metadata`, `journal-retention`, `git-worktree-remove`, `branch-delete` and `preservation`, each with a finite `durationMs`, their sum within the row's own `durationMs`, deletion with its files and bytes, and main's retry records `blocker: null`; `release_case_journal_failure` records `blocker { class: preservation-refused, step: worktree-removal }`; `release_case_close_foreign_tag` prints `Close stopped: foreign-tag in step publication.`. The target close cases assert the seven step names unchanged (`assertRemovalChildren`) and record `undeclared-ignored-material`, `declared-root-unreadable` and `writer-held` at `worktree-removal`; the nested-repository case counts each file its deletion took before an immutable file stopped it ([D006](decisions.md#wo-252-d006)). After the repair's first review round, `release_case_derived` records a kept dirty derivative's blocker, and the stopped attempt's, as `not-clean` at `worktree-removal` where they read `other`, and `scripts/test-worktree.sh`'s standalone settle moves a derivative's session journal and reports `journal-retention`, `preservation` and `git-worktree-remove` above zero ([D021](decisions.md#wo-252-d021)). After the second repair's first review round a refused journal move is `preservation-refused` in a close's preview as in its move: "WO-252 a journal move the lane refuses stops a target close as preservation-refused, …" records that class at `worktree-removal` in both `--dry-run` and `--publish` ([D029](decisions.md#wo-252-d029)).

**Criterion 4:** met. `scripts/test-process-debt.mjs` "WO-252 plan failures counts stopped closes by blocker class and plan start prints a class repeated across three orders": `plan failures` prints `localReleaseCloses.blockers` by class and by order and names as repeated a class that stopped three distinct orders' closes with a successful close between two of them, and `plan start` prints `close blocker repeated: <class> across 3 orders`; "WO-252 plan start prints every repeated close blocker class even when the start block must drop them to fit its bound" keeps all eleven classes' lines when the block overruns ([D007](decisions.md#wo-252-d007)).

**Criterion 5:** met. `scripts/test-temporary-roots.mjs` "a renumbered root whose owner repository is gone is proven by its marker and removed by prune apply": the orphan is a candidate after the device renumbering, re-stamped with its inode and token unchanged and removed by `pruneHarness` apply, while a copied marker on another inode stays refused with its payload. The four cases of `docs/evidence/WO-237/verification-recovery-probes.mjs` pass as regressions with their payload assertions: "a child whose own removal stopped inside its parent's aside stays bound and held until a prune finishes both", "a child finished from its parent's aside ends its own registration", "an empty unmarked aside a stopped removal left is removed, and a non-empty one keeps its payload" and "a nested registration in another repository's ledger waits while its parent sits aside"; the probes themselves report every case reproduced false ([D008](decisions.md#wo-252-d008)).

**Criterion 6:** met. `scripts/test-harness.mjs` "WO-252 every emitted role root gives the prune to the session that needs it …" covers all fourteen emitted roots. The release-close root says the removal takes no session or writer in the target. Twelve roots say the session runs `node scripts/harness.mjs prune --apply` itself and hands the printed command to the operator only after a recorded host denial of it. Both router roots, repaired after VER-001 F2, say the router runs no prune and the phase session it launches does, under the same fallback, and "router dispatch is metadata only …" still refuses that command in a router session with `DOTLN_ROUTER_WRITE_REFUSED`. The VER-001 all-roots probe passes, and `node scripts/harness.mjs check` passes ([D009](decisions.md#wo-252-d009), [D020](decisions.md#wo-252-d020)).

**Criterion 7:** met. `docs/KIT.md` (the registration step's glob example and §Owned cleanup) and `docs/product/07-execution-guide.md` (§Operator recovery controls, the close's steps, children and blocker, the disposable globs, the kit's residue with its snapshot proof, and the temporary-root orphan and recovery cases) state the glob forms, the residue, the blocker classes, the children timings and the prune rule as built. After the repair both also state the snapshot proof by content and its record ([D019](decisions.md#wo-252-d019)) and the router's sentence beside every other root's prune rule ([D020](decisions.md#wo-252-d020)), and product 07 states a kept derived worktree's class and timed parts ([D021](decisions.md#wo-252-d021)). After the second repair both state the pinned lists kept for snapshots installed before records and the refusal of one from before v0.83.0 ([D026](decisions.md#wo-252-d026)), the ledger's deletion last with its write-back after a stopped removal ([D027](decisions.md#wo-252-d027)), and that a lane or writer directory reached through a link stays where it points ([D028](decisions.md#wo-252-d028)); product 07 also states that a refused journal move is `preservation-refused` in a preview as in the move ([D029](decisions.md#wo-252-d029)). `npm run publication:check` passes (`PASS publication bootstrap checks`, 45 software-engineer and 29 everyday-user linked source sections current), after `npm run sync` relocked the software-engineer edition over the edited product 07 section.

**Criterion 8:** met. `scripts/test-target-worktree-release.mjs`: the declared release's publishing close prints `Target target published tag: v0.1.0.` and `Target target reviewed commit: <commit>.`, the commit the target held at its final review, asserted on the printed output, and the stopped and partially published closes print neither; the fork-shaped close in `scripts/test-target-worktree-close.mjs` prints `Target target published tag: none (no-release policy).` and its reviewed commit ([D010](decisions.md#wo-252-d010)).

**Criterion 9:** met. After the second repair, `npm test -- --review` passed at tree `e0e8afa01e49a7aca7114214c2b0dffbe85a6dcc`, the tree its review ladder's second round read, code identity `dfbf687b51a680dc5836c1b20c7d0567ff7de143f1287d30006838d2b7b24d26`, recorded 2026-11-03T14:58:32Z: 45 passed, 0 failed, 118 fresh tasks and 0 reused, 0 h 42 min, with main and origin's main at `b9e843b6` from start to end. `npm run test:docs` runs once after this handoff's last edit, and completion consumes its passing row for the exact candidate tree. `git diff --check` and `git diff --cached --check` are clean. No new dependency: neither repair changes a package manifest or the lockfile, `package-lock.json` adds and removes no package, and the order's one dependency edit is the console's workspace pin `@dotln/skeleton` 0.79.0 to 0.80.0 with that bump ([D011](decisions.md#wo-252-d011)).

## Review ladder

self-review: found 32; fixed 30; recorded 2; rounds 3 (execution rounds 1 to 3 with 7 Codex workers, 13 found and fixed; repair 1 started at round 3 with 1 worker, its diff 4 lines, 0 found; repair 2, the fix of VER-001, rounds 1 to 3 with 7 Codex workers, 14 found, 12 fixed and 2 recorded; repair 3, the fix of VER-002, rounds 1 and 2 with 6 Codex workers, 5 found and 5 fixed, its round 3 skipped because round 2 changed no code); unreviewed 0 lines (repair 3's complete run ran at the tree its round 2 read; the 52 lines repair 2 left after its round three and the execution's 270 were read by the whole-diff first rounds of repairs 3 and 2)

Every worker ran on Codex at the operator's instruction "use codex for your
review agents" ([D003](decisions.md#wo-252-d003)), through `npm run worker --
review --host codex --order WO-252`: `codex-cli-exec` 0.166.0, model
`gpt-6.1-sol` at effort `max` pinned on the command line, with no host
readback, so the effective effort is unknown. The reports are in the ignored
lane `docs/control/local/reviews/WO-252/`, which release close moves into the
order's retained lane.

- Round 1, tree `4ebbc84b` against the merge base `b9e843b6`: criteria
  (`round-1-criteria.md`, 4 findings: F1 and F2 blocking, F3 and F4
  should-fix), design (`round-1-design.md`, 2 should-fix) and consistency
  (`round-1-consistency.md`, 3: F1 and F2 blocking, F3 should-fix). All nine
  were fixed.
- Round 2, tree `5f1e1960` since `4ebbc84b`: each reviewer rechecked its own
  findings (`round-2-criteria.md`, `round-2-design.md`,
  `round-2-consistency.md`) and all nine fixes held. Three new findings were
  admitted under the rule: criteria F1 (blocking, criterion 2: a snapshot
  owned by its directory name) and criteria F2 with design F1 (should-fix,
  criterion 3: deletion counts lost inside a recursively removed directory).
  All three were fixed. The design reviewer's one bounded probe exited 1 in
  its sandbox with `getconf: confstr: DARWIN_USER_TEMP_DIR: Input/output
  error` before any test ran, so its conclusions rest on source inspection.
- Round 3, one combined worker, tree `9926dab7` since `5f1e1960`
  (`round-3-combined.md`): the two should-fix fixes held, and criteria F1
  held for a note in the target alone. Its one new finding, F1 (blocking,
  criterion 2), showed that a foreign file mirrored into a launchpad's
  same-named snapshot directory still passed. The fix proves each snapshot
  file against the serving runtime's own package source; no reviewer ran
  after round three, and the executor judged that delta: the new regression
  passes, and with the earlier rule restored it fails, naming only one of
  the four foreign snapshot files ([D005](decisions.md#wo-252-d005)).
- Repair 1, after the first complete run failed at the structural
  preflight ([D014](decisions.md#wo-252-d014)): one combined worker at round
  three, tree `5ca2c3c3` since the failed run's tree `17247f42`
  (`repair-1/round-3-combined.md`), 0 findings, with the checkout unchanged
  across the episode.
- Repair 2, this fix of VER-001's F1 and F2, in `repair-2/`. Following
  [D003](decisions.md#wo-252-d003), its workers ran on Codex through the same
  helper with the same pins and readback limits. Every worker's single
  bounded probe exited before any test ran, on the same `getconf` sandbox
  error, so each judged by source.
  - Round 1, tree `95d63fee` against the merge base `b9e843b6`, over the
    whole diff. Criteria (`round-1-criteria.md`, 4 findings) reported F1
    blocking (the target ledger deleted while roots it registers remain)
    and three should-fix: F2, a pre-record snapshot unprovable after a
    stopped deletion; F3, a derivative's removal untimed; F4, a derivative's
    blocker class lost. Design (`round-1-design.md`, 3 should-fix) duplicated
    criteria F4, F2 and F3 as its F1, F2 and F3. Consistency
    (`round-1-consistency.md`, 2) reported F1 blocking (the new close case
    missing from the case inventory) and F2 should-fix (`release-steps.mjs`
    undeclared for its consumers' suites). Eight were fixed
    ([D019](decisions.md#wo-252-d019), [D021](decisions.md#wo-252-d021)).
    Criteria F1 is recorded, not fixed: it is D005's deviation, which
    criterion 2's first-attempt close requires
    ([D022](decisions.md#wo-252-d022)).
  - Round 2, tree `dd9d474b` since `95d63fee`: each reviewer rechecked its
    own findings. Criteria F2, F3 and F4 held; design F1 and F3 held;
    consistency F1 held. Design F2 and consistency F2 were not held, and
    each fix was completed: a file the repository tracks at a record's path
    now stops the close unless it is the record, and plan-refutation now
    declares `release-steps.mjs`. Criteria restated F1 as not held, since
    D022 leaves it unchanged. That makes 3 findings: 2 fixed, 1 recorded.
  - Round 3, one combined worker, tree `6c970be1` since `dd9d474b`
    (`round-3-combined.md`), 2 blocking findings, both fixed. F1: the
    round-two stop also caught a listed file under a declared root, which is
    declared output; the stop now applies only to a file the listing does
    not name, with a new case. F2: the record unit test still expected the
    record entry without the text field round one added. It was my miss: I
    had not rerun that test after changing the entry. No reviewer ran after
    round three. I judged the remaining delta, 52 lines since `6c970be1`
    (43 added and 9 removed), with the eight WO-252 close cases, the harness
    record test and a mutation run: with the listing check removed, the new
    declared-root case stops.
- Repair 3, this fix of VER-002's F1 and F2, in `repair-3/`, on Codex through
  the same helper with the same pins and readback limits
  ([D003](decisions.md#wo-252-d003)). Every worker's single bounded probe
  again exited before any test ran, on the same `getconf` sandbox error, so
  each judged by source; my bounded runs of the cases each fix names, and
  the complete run, executed them.
  - Round 1, tree `0922c676` against the merge base `b9e843b6`, over the
    whole diff, 5 findings, all fixed. Criteria (`round-1-criteria.md`): F1
    blocking, a regression from main: the target close's journal move
    followed a tracked link in the target to files outside it, now refused
    for every lane and the released writer
    ([D028](decisions.md#wo-252-d028)); F2 should-fix, criterion 2: a
    declared file at a record-less snapshot's record path kept the record
    from being written, so a stopped deletion left the rest unprovable, now
    deleted first ([D026](decisions.md#wo-252-d026)). Design
    (`round-1-design.md`): F1 should-fix, a refused journal move in a
    preview recorded `other`, now classed in the shared helper
    ([D029](decisions.md#wo-252-d029)); F2 should-fix, the first harness
    regression ran old installers from the release tags, now a committed
    fixture, the history survey moving to the evidence probe
    ([D026](decisions.md#wo-252-d026)). Consistency
    (`round-1-consistency.md`): F1 note, the two follow-ups the reopening of
    D019 and D022 created were left undisposed; FUP-b50961a9b107dc85 and
    FUP-971c54891d587f3d are now settled.
  - Round 2, tree `e0e8afa0` since `0922c676`: each reviewer rechecked its
    own findings (`round-2-criteria.md`, `round-2-design.md`,
    `round-2-consistency.md`); all five fixes held and nothing new was
    found. With no fix after round 2, round 3 did not run, and the complete
    run read the same tree.

Worker uses: the execution and repair 1 launched 8, all Codex, with 0
re-tasks. Repair 2 launched 7 more, all Codex kit launches, with 0 re-tasks,
against its own cap of 20. Its usage readback counts 8 uses (Codex 7,
unattributed 1); by inference the eighth is the helper's `--dry-run`
preview, which the hook counts by its literal command. Repair 3 launched 6,
all Codex kit launches, with 0 re-tasks: its readback reads launched 6
(Codex 6, unattributed 0), 14 of its 20 remaining. The execution's
unreviewed figure counted the change from its round three's tree `9926dab7`
to the failed run's tree `17247f42`: 187 lines added and 83 removed in seven
files, read since by repair 2's first round.

## Complete runs

1. Tree `17247f42`, started 2026-11-03T00:07:04Z, 0 h 0 min (18 s): format
   passed and configuration-root failed on the literal writer path in
   `scripts/lib/target-worktree-close.mjs`; every other required suite was
   skipped behind that preflight. The repair derives the path from
   `dispatchJournalDirectory` ([D014](decisions.md#wo-252-d014)).
2. Tree `5ca2c3c3`, started 2026-11-03T00:17:09Z, 0 h 39 min: 44 passed, 0
   failed, every required suite fresh.
3. The repair's run, tree `08f9480d`, started 2026-11-03T03:37:01Z, 0 h 39
   min: 45 passed, 0 failed, 118 fresh tasks, none reused. Another
   worktree's complete run held the host's shared lanes until its process
   exited at 03:36:42Z, so this run started after that. A full-scope prune
   refuses while any gate holds those lanes, and a bounded probe of three
   prune tests during an earlier run of that worktree had failed on exactly
   that refusal.
4. The second repair's run, tree `e0e8afa0`, started
   2026-11-03T14:16:38Z, 0 h 42 min: 45 passed, 0 failed, 118 fresh tasks,
   none reused; its structural preflight passed in 0 h 0 min (37.7 s).

## Measurements

- The `target-worktree` suite, before and after, as `npm run plan --
  conditions` measures it: before, the whole suite's latest fresh task took
  0 h 10 min (611.3 s) against its 0 h 2 min (126.6 s) median over 38
  samples, the figure the order cites; `plan conditions` lists that
  condition under FUP-e96221b106cd136a.
  After, in the passing run the suite runs as four file tasks: start 0 h 4
  min (228.7 s), publish 0 h 4 min (253.5 s), release 0 h 2 min (131.0 s)
  and close 0 h 9 min (552.0 s). The close file, which holds this order's
  six new cases, ran against its 0 h 7 min (448.5 s) median over 117
  samples, under its 0 h 11 min (672.7 s) threshold, so the order's
  reopening condition is not met. The six cases took 0 h 1 min (41.6 s)
  together in one bounded run.
  In the repair's run the four tasks took 0 h 4 min (214.8 s), 0 h 5 min
  (273.0 s), 0 h 2 min (118.6 s) and 0 h 8 min (485.9 s), the close file
  now holding eight WO-252 cases. It stays under the same threshold, so the
  reopening condition is still not met. In the last bounded run of the eight
  cases, their own durations sum to 0 h 1 min (62.4 s). In the second
  repair's run they took 0 h 2 min (143.1 s), 0 h 4 min (210.3 s), 0 h 2 min
  (106.6 s) and 0 h 8 min (484.1 s), the close file holding thirteen WO-252
  cases, still under the 0 h 11 min (672.7 s) threshold, so the reopening
  condition is not met; the thirteen took 0 h 2 min (95.4 s) in one bounded
  run of the close file.
- The repair's snapshot record, on a copy of this checkout's installed
  snapshot of 542 package files (best of five, under the bounded wrapper):
  102,894 bytes; the record proof 0.7 ms and the content proof 22.5 ms
  ([D019](decisions.md#wo-252-d019)). After the second repair the content
  proof tries each distinct list once, the serving runtimes' and the two
  kept ones, and reads each pinned file's digest once: 29 to 33 ms for each
  of the snapshots the v0.83.0, v0.102.0, v0.103.0 and v0.111.1 installers
  left in a scratch root over this checkout's runtime, with no serving list
  ([D026](decisions.md#wo-252-d026)).
- Before the second repair's review ladder, its ten WO-252 target close
  cases, two new ones and the extended snapshot case among them, took
  0 h 1 min (79.6 s) in one bounded run.
- The worktree-removal children on the fork-shaped fixture and the glob
  matcher's cost over 42,340 paths are in
  [D012](decisions.md#wo-252-d012). A focused bounded run of the fork-shaped
  case after the round-three fix (2026-11-03T00:01Z) printed the row at
  1,829.1 ms: base-fetch 241.2, disposable-deletion 5.3, finder-metadata
  4.9, journal-retention 15.3, git-worktree-remove 92.6, branch-delete 21.0
  and preservation 106.1. The complete run's log does not print that
  diagnostic.
- The snapshot proof computes the serving runtime's inventory once per
  runtime root, only when the target's listing names a `.runtime/harness/`
  path: 53.4 ms for main and 70.5 ms for this worktree over 542 package
  files ([D005](decisions.md#wo-252-d005)).

## Follow-ups and known issues

- FUP-9d8c66a3ce8654f6 ([D020](decisions.md#wo-252-d020)), deferred: the
  executor, verifier, planner, release-close and router roots exceed their
  cold-start ceilings after this order's sentences, the router by 250 bytes
  after the repair's sentence; the ceilings stay and the optimization is
  boarded. FUP-f94a7707660da133 ([D009](decisions.md#wo-252-d009)) is its
  duplicate.
- FUP-40c684232c707187 ([D016](decisions.md#wo-252-d016)) and
  FUP-f64a48b767db8642 ([D017](decisions.md#wo-252-d017)), the verifier's
  repair items for VER-001's F1 and F2, are settled by
  [D019](decisions.md#wo-252-d019) and [D020](decisions.md#wo-252-d020).
- FUP-e5ec1010d050239b ([D024](decisions.md#wo-252-d024)) and
  FUP-cfed59c2e48409b8 ([D025](decisions.md#wo-252-d025)), the verifier's
  repair items for VER-002's F1 and F2, are settled by
  [D026](decisions.md#wo-252-d026) and [D027](decisions.md#wo-252-d027),
  and so are FUP-b50961a9b107dc85 and FUP-971c54891d587f3d, the items their
  reopening of [D019](decisions.md#wo-252-d019) and
  [D022](decisions.md#wo-252-d022) opened.
- FUP-6606e739a1ae8678 ([D013](decisions.md#wo-252-d013)): a bootstrap close's
  post-removal prune cannot load modules its own removal deleted; main's
  retry completes with a null blocker.
- FUP-e96221b106cd136a, the cold-gate structural cuts candidate
  (`docs/planning/work-order-map.md`): `plan conditions` lists the
  `target-worktree` whole-suite duration condition under it; this order
  adds thirteen close cases, two of them in the first repair and five in the
  second, and leaves it open.
- Taken by this order, as its known issues list: FUP-e872a59769b9a97a (the
  fork's asks 3(a) to 3(e) and 8, steps 1 to 4 and 8), FUP-376d333e4dcd0518
  and FUP-134a3766852c8f77 (step 5). WO-237's known issue that a target keeps
  no journals of its own is closed by step 2.
- Deviation recorded in [D005](decisions.md#wo-252-d005): the order's Cost
  text keeps the ledger while a root it registers remains; the close instead
  carries those roots into `ownedTemporaryRoots` and deletes the ledger, so
  no close stops for the kit's own session scratch. Since
  [D027](decisions.md#wo-252-d027) the ledger leaves only with the target:
  deleted immediately before Git's removal and written back if that removal
  stops, so a target that survives a stopped close keeps every root it
  registered as prunable as before, which [D022](decisions.md#wo-252-d022)
  had left open.

## Untested

- A snapshot that a release before v0.83.0 installed, named by its pinned
  files alone, is still refused as undeclared
  ([D026](decisions.md#wo-252-d026)'s limit); the harness regression checks
  that refusal's premise against the name v0.82.0's own installer recorded,
  and no target close case plants one. The earlier releases' installers run
  only in the evidence probe, which reads the kit's release tags; the suites
  read the committed fixture, and the target close suite, which an exported
  instance also runs, builds its record-less snapshots with the current
  installer and the kept v0.83.0 to v0.102.0 list.
- A close killed inside Git's removal, after the ledger is taken, is not
  exercised ([D027](decisions.md#wo-252-d027)'s limit), and neither is a
  ledger that cannot be written back.
- The nested-repository partial-deletion case needs the immutable flag and
  runs only on darwin.
- The execution's round-two design reviewer ran no probe, and every
  reviewer of both repairs' ladders had its bounded probe exit before any
  test ran (the sandbox error above), so those reviews rest on source
  inspection; each repair's own bounded runs, its mutation runs and its
  complete run executed every changed case.

## Actor attestation

Executor: Claude Code 2.1.316, model `claude-opus-5-5`, effort `max` read
back from `CLAUDE_EFFORT` and selected by the operator for the session
(`--source claude-session-readback`); the order's Effort field names
executor xhigh, and this session ran at the operator's max. Session
`4cfd4216-88c4-495c-a5b0-da660e75bf93`. Reviewers: as in the ladder above.

Repair executor (`resume: fix` after VER-001): Claude Code 2.1.316 (the
running session's own installation; the `claude` command on the path
reports 2.1.317), model `claude-opus-5-5`, effort `max` read back from
`CLAUDE_EFFORT` (`--source claude-session-readback`). Session
`742596bb-2036-40fd-95fe-27b993326a4b`.

Second repair executor (`resume: fix` after VER-002): Claude Code 2.1.317
(the session's `CLAUDE_CODE_EXECPATH` names that version, and `claude
--version` reports it), model `claude-opus-5-5`, effort `max` read back from
`CLAUDE_EFFORT` (`--source claude-session-readback`); the order names
executor xhigh, and the operator selected max for this session. Session
`631cc92b-43b7-4ee8-bdbe-affd94c38f1b`.

## Process cost

`node scripts/harness.mjs usage 4cfd4216-88c4-495c-a5b0-da660e75bf93` at
2026-11-03T01:00:38Z, source `claude-transcript-message-usage`, scope
dispatch: 314,229,092 total tokens (input 1,242; cached input 312,455,093;
cache write 1,192,206; output 580,551; reasoning output unknown); cost
unknown. Dispatch standing 3 h 19 min of 8 h 0 min, complete runs 1 of 20
(the counter holds the passing run; the 18-second failed run is not in it),
within bounds; 736 steps and 522 commands. The eight Codex workers report
18,066,383 tokens in their result envelopes, between 0 h 3 min and 0 h 13 min
each. Counters after this reading stay in the ignored receipts.

The repair: `node scripts/harness.mjs usage
742596bb-2036-40fd-95fe-27b993326a4b` at 2026-11-03T04:18:51Z, source
`claude-transcript-message-usage`, scope dispatch: 121,534,999 total tokens
(input 584; cached input 120,610,296; cache write 622,604; output 301,515;
reasoning output unknown); cost unknown. Dispatch standing 2 h 45 min of 8 h
0 min, complete runs 1 of 20, within bounds; 366 steps and 235 commands.
The seven Codex workers report 17,458,905 tokens in their result envelopes,
between 0 h 5 min and 0 h 14 min each. Waiting for another worktree's
complete run to release the host's lanes took 0 h 37 min of the standing
(the waiter ran from 03:00:01Z to 03:36:42Z), with only handoff edits done
meanwhile. Counters after this reading stay in the ignored receipts.

The second repair: at entry, `node scripts/harness.mjs usage
631cc92b-43b7-4ee8-bdbe-affd94c38f1b` at 2026-11-03T12:56:03Z read 397,042
total tokens; at 2026-11-03T14:59:37Z, source
`claude-transcript-message-usage`, scope dispatch, it read 101,573,618 total
tokens (input 528; cached input 100,692,959; cache write 591,509; output
288,622; reasoning output unknown); cost unknown. Dispatch standing 2 h 4 min
of 8 h 0 min, complete runs 1 of 20, within bounds; 324 steps and 221
commands. The six Codex workers report 11,267,426 tokens in their result
envelopes, between 0 h 3 min and 0 h 15 min each. The complete run's 0 h 42
min was waiting with no repository write. Counters after this reading stay
in the ignored receipts.

## Goal alignment

The outcome matches the objective: the fork-shaped close declares its
nested caches in one line and closes on its first attempt, the kit's own
journals, writer, marker, snapshot and ledger are moved or deleted rather
than refused, and anything else, an operator note mirrored into a
launchpad's snapshot directory included, is still refused. A stopped close
names its blocker class and step, the worktree removal says where its time
went, `plan start` shows a class repeated across three orders, a renumbered
orphan is removable by `harness prune --apply`, and no role hands the
operator a prune before a recorded host denial.

The repair closes VER-001's two gaps without loosening either protection.
A snapshot an earlier runtime installed is proven by its content, through
the record its installer now writes or, before records, its own package
files, and is deleted. A foreign, edited or tracked file stays, and a
stopped deletion stays provable. Every emitted root, the router's included,
names the session's prune and its one fallback, while the router still runs
none. Two adjacent gaps the repair's review found are closed with it: a
derived worktree's lost blocker class, and its removal's untimed parts.

The second repair closes VER-002's two gaps the same way. A snapshot that any
release from v0.83.0 installed before records is proven by its own bytes
with the list that release pinned, so the kit's earlier residue closes after
an update, while a foreign, edited or tracked file is still refused or kept;
only a snapshot from before v0.83.0, whose name proves none of its package
files, is refused. A target that survives a stopped removal keeps its
temporary-root ledger as it was, so the roots it registers stay as prunable
as they were before the close, and a successful close still removes the
ledger on its first attempt. Its review found one regression the execution
had introduced, closed with it: the target close's journal move followed a
tracked link out of the target, and now nothing reached through a link is
moved or deleted.
