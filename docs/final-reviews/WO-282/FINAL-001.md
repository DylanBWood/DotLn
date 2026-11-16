# WO-282 — FINAL-001

**Verdict:** pass. All five criteria are met. No finding blocks. Three findings are listed: two were fixed in this review and one is boarded in [WO-282-D023](../../evidence/WO-282/decisions.md#wo-282-d023--final-review-the-subject-passes-the-guides-release-note-bullet-is-corrected-from-an-executed-reading-and-seven-follow-up-rows-are-disposed). This review also made three critical errors of its own conduct, as the operator classified them; they are recorded in [WO-282-D024](../../evidence/WO-282/decisions.md#wo-282-d024--critical-errors-a-complete-run-after-a-document-only-edit-and-the-rule-that-none-ever-follows-one) and stated below.

An instance can take a starter release without the two repairs by hand that one reported on 2026-11-14. The emit keeps an instance's own `.codex/` files after a merge that took the starter's harness manifest, where `main`'s manifest records their bytes. The update preview says which side of a conflicted manifest to keep. A sync carries the dispositions of a follow-up row whose key a reader change moved. The runtime guard, the grafts refusal and the register's stale refusal are repaired as the order's fourth gap lists them.

This review changed one bullet of the kit guide and one sentence of product 07, and no source or test. The bullet said the kit uses commit subjects for an instance's release entries, which the verifier boarded as inaccurate from a reading of the code. The reviewer ran the release's own reader: an order that commits its reviewed notes has them read. The bullet and the release notes now say so.

## Critical errors in this review

The operator classified three errors of this review as critical. None changes a criterion's judgment; each is the reviewer's conduct.

1. **A complete gate for a document-only edit.** After the edit to the guide's bullet, the reviewer ran `npm test -- --review --again --keep-going`. A passing complete review row stood at the unchanged code identity, and the rule in product 07 and in the reviewer's role text is to reuse it and run the document gate. The run took 0 h 51 min, passed, and was not owed. The reviewer had read two pending follow-up rows and an earlier order's choice as though they were the rule.
2. **No direct answer.** When the operator objected, the reviewer checked texts and wrote records for about five minutes before it answered.
3. **A cause reported instead of removed.** Having named the two pending rows as what misled it, the reviewer proposed to leave them pending and said they would mislead later sessions.

The operator's standing direction is recorded as the rule: a complete gate never runs after a change to documents alone. What this review did so that it does not recur: it declined both rows on that direction, wrote the rule into product 07 where that document says what keeps code identity, and disposed the record's own row open so that plan start lists it first. What it could not do: the role texts are compiled source, so adding the sentence there is the critical follow-up in D024.

## Subject, bases and actor

The subject is the WO-282 working tree on branch `wo-282`, which held no branch commit before this review. Its base is `b77e5173ec8564f3f1f0ddda432edac53ad9098f`. Local `main`, `origin/main` and the merge base are that commit, read after the integration's fetch. The code identity is `f6f4596eaa1a4dda49bcfc16a850832b3161d1b880423f574bee804eaee89030`, the one the executor's run and VER-001 judged. It was read at entry and again after the guide edit and did not move, because the identity leaves every path under `docs/` out.

The reviewer was Claude Code 2.1.325 running `claude-fable-5-2`. Effort is `max`, the operator's selection for this session, read back from `CLAUDE_EFFORT`. That is the selected effort, not the effective one; the order recommends `high` for the reviewer. No worker or subagent was launched: 0 of the cap of 20.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.325","model":"claude-fable-5-2","effort":"max","source":"claude-session-readback"}

**Process cost:** entry 103362 tokens; handoff 42158239 tokens; source claude-transcript-message-usage

Usage is the dispatch scope of `node scripts/harness.mjs usage`, read at 2026-11-16T14:20:09Z on entry and at 2026-11-16T15:40:51Z before this report was filed; the work after that reading is not in the figure. Most of the handoff total is cached input (41,464,180 tokens); output was 174,568 tokens. No cost in dollars is available. The dispatch standing at that reading was 0 h 47 min worked, 1 h 21 min elapsed, of its 8 h bound, with 1 of 3 complete runs, the one that was not owed.

## Integration

`npm run worktree -- integrate WO-282` fetched `origin/main` and its tags and took in nothing: the worktree is not behind `main`. Both bases are therefore `b77e5173ec8564f3f1f0ddda432edac53ad9098f`, no path was resolved, and no draft integration decision was written. `npm run release -- prepare`, read against origin's tags, left the target at `v1.2.0`, the next minor above `v1.1.0`.

Carried forward with their original evidence: every claim of VER-001 on criteria 1, 2 and 3 and on the first, second and fourth statements of criterion 4, since no byte under them changed. Derived again here: the third statement of criterion 4, whose bullet this review rewrote.

The worktree carried, from the release close of the order before this one, the starter's `v1.1.0` refresh receipt with its two register files. It is committed as a change of its own. The roadmap's release table ends at `v1.0.1` while `docs/control/release-history.json` records `v1.1.0`. Product 07 permits that state, the docs check reports the newer tag without refusing, and no step of the integration list names the table, so this review does not rewrite it; `npm run release -- list --markdown --write` adds the row.

## What was read

The order and each decision it cites (WO-276-D059, D065, D155, D160, D162 and D200; WO-258-D004). The whole diff of source and tests against the base, with the functions around each change: `emitHarness` and its Git helper, `planUpdate`, `changedOnBothSides` beside `plainHistory`, `renderUpdatePlan`, and `projected`, `dispose` and `collectFollowupSources`. The guide's section Taking upstream updates whole, as it stands in the candidate. Decisions D001 to D022, the handoff, the criticisms record, VER-001 and the verifier's three probes with their results, and the executor's executable evidence. The eighteen pending follow-up rows that name a changed file or this order, each in its order's decisions file. The eight reports of the paired ladder in the ignored reviews lane were not read again; VER-001 read all eight and this review read the executor's dispositions of them (D013, D014 and D016).

## Criteria

**Criterion 1:** met. The case "WO-282: a starter manifest replaces older Codex bytes main owns and refuses edits or an enclosing repository's ownership before any write" stands beside the WO-054 case in `scripts/test-harness.mjs`, and the harness-fixtures suite passed in the complete review rows at this code identity. Through the CLI it puts a Claude-only manifest on disk over a `main` whose manifest records the three `.codex/` files, gets emit exit 0 with older recorded bytes replaced and check exit 0, then edits each of the three files in turn and gets exit 1 naming that file with every installed file and the manifest unchanged. Read in the source: the lookup runs once, only for a present `.codex/` file the on-disk manifest does not list, names the root's own `.git` and work tree, drops inherited repository routing and ignores replacement objects, and admits a file only on its path and whole-file hash; any failure of the read admits nothing. VER-001's probe P1 holds the layouts the case does not: a linked worktree, no `main`, an unreadable manifest on `main`, and no manifest on disk. The [executable evidence](../../evidence/WO-282/update-evidence.json) records both arms with their exit codes. Limit, by design: the emit reads the branch named `main`.

**Criterion 2:** met. The launchpad suite passed in the complete review rows at this code identity. The "WO-276 criterion I6" subtest asserts the exact line, that it stands before the first kit row, and that the row still reads `re-emitted: .claude/harness-manifest.json`, for the update's plan and for the preview. The executor's recorded output of a real `launchpad preview --from main` shows the line directly above that row. The two runtime-guard cases are arms of "WO-282: an update checks incoming and pending runtime additions before the harness, and admits an interrupted removal": an altered incoming-only file and an altered pending-only file each leave the check unasked with `runtime-differs`, kit bytes ask it once, a prior file the pending kit dropped is admitted when absent, and one absent with no pending kit stays untrusted. The grafts arms of "WO-276 criteria I1 and I2" refuse the publish naming a grafts file, through `info/grafts` and through `GIT_GRAFT_FILE`, with no push. Read in the source: the guard's condition for an absent file is `!previous.has(path) || (pending !== null && !planned.has(path))`, which is the order's third step. Limit: the widened guard can refuse an update the old guard admitted. The order's header says no refusal is tightened and its third step requires this; the executor recorded the conflict (D013, R1-O) and the release notes state it under Read before upgrading.

**Criterion 3:** met. The process-debt suite passed in the complete review rows at this code identity. "WO-282: a newly re-keyed candidate carries current dispositions by unchanged source, deterministically" holds the four arms: a current disposition leaves the old row `duplicate` naming the new one at the earlier disposition's time and the new row holding both dispositions at `sourceRevision: 1`, with `planningFollowups(root).pending` 0; a stale disposition, a changed body and an already-missing old row each leave the old row needing review and the new one untriaged; two roots project the same bytes; and a second sync changes nothing. "WO-276 criterion R3" asserts the refusal `reread follow-ups at register revision <revision>` with the register unchanged. Read in the source: a pair is carried only where it is unique in both directions, the refs and the last present hash are equal, and the old row's latest disposition names its last present revision. VER-001's probe P3 carries an allocated disposition and finds this repository's own register current under the new projection.

**Criterion 4:** met. In `docs/KIT.md`, Taking upstream updates: the side of `.claude/harness-manifest.json` a conflicted merge keeps and why are stated under The kit's rows and in step 2 of What the update does to each file; what the preview and the merge show for an elected host's surfaces is stated under A host the starter lacks (no host-specific rows once neither kit manifest lists them, Git removes nothing the merge base lacks, the re-emit writes an elected host's surfaces); the release-note contract an instance's own order no longer switches on is the bullet "Commit each order's release notes" under An instance older than v1.0.0, as this review corrected it; and the private list's comment and marker forms are the second paragraph of "Sort the local-terms list", linking The local-terms list, which is under First steps. The forms match `parseLocalTerms` in `scripts/lib/terms.mjs`, read again here. `grep -n "remove. rows" docs/KIT.md` printed no line and exited 1 after the edit, and `node scripts/lib/operator-commands.mjs --check` reported the generated commands page current. `npm run test:docs` runs once after this report's last edit, and the completion consumes its passing row for the exact candidate tree.

**Criterion 5:** met. `npm test -- --review` stands on a passing complete review row at the code identity above. Two stand there: the executor's, recorded 2026-11-16T08:46:10.834Z with 122 tasks run fresh, which was sufficient; and this review's, recorded 2026-11-16T15:26:30.792Z, exit 0, 45 suites passed and none failed, 122 tasks run fresh and none reused, code and build output unchanged during the run (`host-gate:f6f4596eaa1a4dda49bcfc16a850832b3161d1b880423f574bee804eaee89030:npm test`). The completion consumes the newest. The complete review row covers the plain `npm test` claim and the declared Preflight suites, as VER-001's probe P4 showed with the completion's own reader. `npm run test:docs` runs once after this report's last edit, and the completion consumes its passing row.

## The changed standing documents

`docs/KIT.md` is the one authored standing document the order changes; `docs/OPERATOR.md` and the `README.md` release block change only by their generators, at the version. Each changed passage of the guide was read in its subsection.

- **A host the starter lacks** replaces a sentence that was false for every update after the one in which the starter stopped shipping Codex. It states what is so and can be followed.
- **The kit's rows** gains one sentence on the preview's line. **A file both sides changed** lists a grafts file among the histories that cannot be judged. **What the update does to each file** widens step 1 to the three kits' runtime files and separates a from-core replacement from a conflict in a Git merge in step 2. Each is a replacement or an addition in place that states the current rule.
- **Sort the local-terms list** gains a paragraph on the comment and marker forms, with its link.
- **Commit each order's release notes** is the bullet this review rewrote; finding F1 gives the reason and the evidence.

This review also added one sentence to `docs/product/07-execution-guide.md`, Discipline, beside the sentence on what keeps code identity: an edit to documents alone keeps it, owes the document gate on the exact tree, and no role runs the complete gate after it. It states the rule, links D024, and regenerated one publication lock.

No passage holds a dated account, and none is one its reader cannot follow. One point of form is boarded as F3.

## Findings

F1, follow-up, fixed in this review. VER-001's finding: the guide's bullet on the release-note contract and the staged release notes said the kit uses commit subjects for an instance's release entries. VER-001 rested on a reading of `scripts/release.mjs`. This review ran the reader, `releaseNoteEntries`, in four repositories ([probe](../../evidence/WO-282/final-review-001/release-note-entries.mjs), [result](../../evidence/WO-282/final-review-001/release-note-entries.json), exit 0 under the bounded wrapper). In a kit root an order whose merge commits its `RELEASE-NOTES.md` has that file read, and an order that commits none is listed under the commit-subject fallback with nothing refused; the same holds after an instance's own `WO-024`. In core's own root the contract refuses a release whose order committed none. The bullet now reads "Commit each order's release notes" and says that a release still reads an order's reviewed notes where its merge commits them, and that without the contract a release is no longer refused for an order that committed none. The release notes say the same. Class `escape`, as VER-001 classed it: the sentence was in the verified subject and inside verification's scope. Passing evidence: the probe, and the document gate over the corrected guide.

F2, follow-up, fixed in this review. The completion advisory at the handoff named the pending follow-up rows this change touches, and the handoff recorded no disposition for them. Two name this order's own edits: WO-260-D040 asks the next order that edits `scripts/lib/git-surface.json` for a correction, and WO-277-D005 names the sync suite's recovery case that the executor repaired. This review read all eighteen matched rows and disposed seven; D023 lists each with its reason and the eleven left as they are. Class `escape`: the handoff was part of the verified subject. No criterion depends on it.

F3, follow-up, boarded. Three decision links of this order stand in a paragraph of their own after the last subsection's Decisions line of the guide's section, where the section's form puts each on the Decisions line of the subsection its passage is in. The links resolve and the passages can be followed. Class `escape`. It is boarded in D023 with a second item: no suite holds what a release reads of an instance's notes, so a case beside "WO-276 criterion R1" should hold the probe's four arms.

<!-- dotln-findings:start -->
[
  {
    "id": "F1",
    "route": "follow-up",
    "class": "escape",
    "summary": "The guide's release-note bullet said an instance's release entries use commit subjects; fixed in this review from an executed reading and recorded in WO-282-D023."
  },
  {
    "id": "F2",
    "route": "follow-up",
    "class": "escape",
    "summary": "The handoff recorded no disposition for the pending follow-up rows the change touches; fixed in this review, which disposed seven of them (WO-282-D023)."
  },
  {
    "id": "F3",
    "route": "follow-up",
    "class": "escape",
    "summary": "Three decision links in the guide's update section stand apart from their subsections' Decisions lines, and no suite holds the kit-root release-note reading; boarded in WO-282-D023."
  }
]
<!-- dotln-findings:end -->

## Follow-up rows disposed

`npm run plan -- followups --touching` matched eighteen pending rows. Seven are disposed, with the row of D024, in one batch under one register revision:

- WO-282-D022 (the verifier's row on F1): settled by the correction of the bullet.
- WO-277-D005 (the roadmap's table and the sync suite's recovery case): deferred. The case now passes on a tree whose record names a tag the table lacks; which step writes the table is still open.
- WO-277-D006 (the commands page's route for the harness manifest): declined. A merge that stops on the manifest still needs a side, and the page's route is the side the guide and the preview now name.
- WO-260-D040 (the Git form inventory's note on `fsck`): deferred again. This order edited the inventory only through its recording command, and the correction pairs the note with a comment in a judged feedback source.
- WO-281-D029 (five dense sentences of the guide): deferred. This order wrote into the guide and none of the five is in a passage it changed.
- WO-245-D005 and WO-277-D018 (run product suites again when a document changes): declined on the operator's direction.
- WO-282-D024 (the critical errors): open, so that plan start lists it first.

The other eleven are left as they are; D023 names them.

## Release surfaces and commits

The release notes hold the five sections, one physical line to a paragraph. Read before upgrading carries the order's two duties (the emit keeps an instance's own host surfaces through a merge that took the starter's manifest; a re-keyed row is carried only where both rows are retired and created in one sync), the widened runtime guard, and the corrected account of the release-note contract and the private list's forms. The pull-request body leads with the resulting behavior; its meter block is release preparation's.

The branch is committed as three changes: the starter's `v1.1.0` refresh receipt; the order's change, with its source, tests, guide and generated pages; and the order's records, with the sentence in product 07 and its lock.

## For the operator's reading

- The bullet this review rewrote, `docs/KIT.md` under An instance older than v1.0.0, "Commit each order's release notes".
- The sentence this review added to product 07, Discipline, and D024's follow-up for the role texts.
- The runtime guard is stricter than before, against the order's header and by its third step. The release notes say so.
- The roadmap's release table has no `v1.1.0` row. The next order, or a documents pull request, can add it with `npm run release -- list --markdown --write`.
- The commands page keeps its route for a merge that stops on the harness manifest (WO-277-D006's row, declined here with its reason).

## Limits

The emit's ownership reading covers `.codex/` and reads the branch named `main` (D002). A full CLI emit of the real bundle in a linked worktree is untested; VER-001's probe ran the library call there. Concurrent carries and dispositions on two branches need a resolution by hand (D016). The probe for F1 reaches a private function through a load hook in its own process; no committed case holds it (F3).

## Terms screen

`node scripts/terms.mjs branch` screened 44 changed files, this report among them, and listed 0 lines in either mode, so the reviewer read 0 lines.

## Goal alignment and cost

The outcome matched the goal on the subject: the criteria were judged on the reviewed tree, the release surfaces say what the code does, and each defect met is fixed or boarded with its route. It did not match on conduct or cost. The complete run added 0 h 51 min of the clock and most of this session's tokens for a result the reuse rule already supplied, and the operator had to correct it three times. The trap was real and was named wrongly: the reviewer called reuse the trap, where the trap was treating a pending proposal as a duty. NoOp did not apply to the review itself, since the dispatch owes a filed review; it did apply to the run.
