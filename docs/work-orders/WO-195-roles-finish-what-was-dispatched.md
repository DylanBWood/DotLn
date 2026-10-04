# WO-195 — Roles finish what the operator dispatched: a Claude release close runs from publication to a removed worktree and branch in one session, and a planning pass pushes its branch and opens its pull request (v0.66.2)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. The release-close admission reaches
the sessions it was written for, the helper's output is bounded, three
cleanup corrections, one release-close sentence replaced and one planner
sentence added; no new refusal and no lifecycle phase. Assigned at
activation under the standing opt-out default.
**Cost:** adds a recorded release-close dispatch and admission that
hold when main's built adapter is stale after the merge, a summary of
the close on standard output with the full report in the retained
record, one exported builder for the admitted command, a permission
restore before the subject is removed, removal of a subject directory
Git has already dropped, branch deletion in the run that removes the
worktree, and their fixtures. Removes: the operator's own command in 6
of the 12 Claude closes recorded from 2026-10-01 to 2026-10-03 (5 after
the auto-mode classifier denied the publish, 1 after a cleanup
blocker); an admission that fired in none of the 9 closes run since it
landed; 305 to 342 KB of helper output in each close session's context;
a role sentence that tells the session to hand a blocker or denial to
the operator; and the push-and-PR request the operator typed in 9 of
the 12 planning sessions since 2026-09-20. Re-mints: the deterministic
re-mint of each edition whose check the change stales
(`packages/skeleton/src/loadouts/contributor.ts` and
`packages/skeleton/src/harness-host.ts` are in the authority, feedback
and harness editions; `packages/compiler/src/harness.ts`, if the
admission lands in the generated hooks, is in all five), and one harness
bundle re-emit. No file the feedback verifier judges is edited
(`packages/skeleton/src/verification-worktree.ts` stays as it is), so
no live episode. `scripts/release.mjs` and `scripts/resume.mjs` are
declared machinery sources, so `npm test -- --review` runs before
handoff. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's planning dispatch of
2026-10-03 and its three mid-turn messages (captured verbatim in ignored
intake; SHA-256 in the ledger section of that date); the WO-184 close
session's own account of its two stops, pasted by the operator; the
helper's retained close records and the session journals of every
Claude close from 2026-10-01 to 2026-10-03; WO-178 D012 and D023 (the
admitted spelling, also WO-188 item 2); the
[planning document](../planning/release-close-finishes-2026-10-03.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: repository records and this operator's own sessions only; no
stop condition.
**Depends on:** WO-178 merged (the admission and the denial journal;
closed); WO-179 merged (the release-close sentence this order replaces;
closed); WO-176 merged (the close record and material rows; closed).
**Recommended placement:** next, as a third lane beside WO-185, which is
in flight; it has no hard edge with any queued order. This order edits
`packages/skeleton/src/harness-host.ts` (WO-185 and WO-186 also edit
it), possibly `packages/compiler/src/harness.ts` (the generated hooks'
fallback), `scripts/release.mjs`, `scripts/worktree.mjs`,
`scripts/resume.mjs` (WO-185 also edits it), `scripts/lib/git.mjs`,
`packages/skeleton/src/loadouts/contributor.ts` (WO-187 and WO-188 edit
it later), the generated role skills, their tests, product 07 and
`docs/AI-HARNESS-SECURITY.md`. Final review integrates main with
`worktree integrate`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-178",
    "relation": "satisfied-by-close",
    "reason": "the release-close admission and the PermissionDenied journal this order makes reach the closes they were written for"
  },
  {
    "workOrderId": "WO-179",
    "relation": "satisfied-by-close",
    "reason": "the release-close sentence this order replaces"
  },
  {
    "workOrderId": "WO-176",
    "relation": "satisfied-by-close",
    "reason": "the close record, material rows and cleanup this order completes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Workflow closeout and
releases and §Operator-opened planning pass; `docs/AI-HARNESS-SECURITY.md`
(the auto-mode row); `packages/skeleton/src/harness-host.ts`
(`releaseCloseAdmission`, the dispatch record that sets
`releaseCloseDispatch`); `packages/compiler/src/harness.ts` (the
generated hooks' fallback when the pinned runtime is unavailable);
`scripts/release.mjs` (`close`, `finishPublishedWorktree`);
`scripts/worktree.mjs` (`finish`, `removePreservedWorktree`,
`prepareBeaconDisposal`); `scripts/lib/git.mjs` (`removeMergedBranch`);
`packages/skeleton/src/loadouts/contributor.ts` (`releaseCloseRemedy`
and the planner procedure); `docs/evidence/WO-178/decisions.md` D012,
D013 and D023; the
[planning document](../planning/release-close-finishes-2026-10-03.md)
§2 to §5.

**Objective:** A Claude release close publishes the merged order's tag
and Release, removes its worktree and directory and deletes its merged
branch in the session the operator dispatched, without the operator
running a command. A planning pass ends with its branch pushed and its
pull request open.

**Observed gap (dated 2026-10-03, `main` at `efe62994`):**

- Of the 12 Claude close sessions with a retained record (WO-061, WO-062,
  WO-102, WO-103, WO-107, WO-124, WO-176 to WO-179, WO-182, WO-184), 6
  finished unaided. In 5 (WO-061, WO-102, WO-177, WO-179, WO-182) the
  auto-mode classifier denied `release.mjs close WO-NNN --publish`, the
  session reported and stopped, and the operator ran the command with
  `!`. In WO-184 the publish ran, cleanup stopped, and the operator
  removed the directory and re-ran the command. Both Codex closes
  (WO-105, WO-181) finished unaided.
- The admission WO-178 added (`harness-host.ts` `releaseCloseAdmission`)
  never fired: no session journal of the 9 closes since it landed holds a
  `releaseCloseAdmission` row. In 5 (WO-061, WO-124, WO-178, WO-179,
  WO-184) the prompt hook ran in its fallback with
  `pins-differ: built adapter unavailable` (`packages/compiler/src/harness.ts`
  fallback): the merge had changed the pinned runtime, the fallback
  records no dispatch, and the admission needs one. In the other 4
  (WO-062, WO-107, WO-177, WO-182) the dispatch was recorded, but the
  session ran the command with an output redirect or a shell-variable
  prefix, and the admission matches only the byte-exact command. The
  helper prints 305 to 342 KB; 11 of the 12 sessions wrapped it.
- WO-184: `git worktree remove` failed with "Permission denied" on 14
  directories that verification snapshots sealed at mode `0500`
  (`.runtime/wo184/material/dotln-wo056-*/{baseline,candidate}/snapshot`,
  sealed by `materialize` in `verification-worktree.ts`).
  `worktree.mjs` restores write permission only for beacon directories
  (`prepareBeaconDisposal`). Git had already dropped the worktree from
  its list, so the close record calls it `removed` (judged from
  `git worktree list` alone) while 10,574 files remained, and a re-run
  no longer sees the directory.
- The merged branch is deleted only when the subject worktree was absent
  when the run started (`release.mjs` `finishPublishedWorktree`, the
  `!subject?.worktree && !dryRun` branch). The dry run never mentions
  that deletion, so the WO-184 preview at 15:48 reported cleanup `clean`
  with no rows while `wo-184` still existed.
- The blocker retry commands are spelled `node '<root>/scripts/release.mjs'
  close WO-NNN --publish`, which the admission does not admit (WO-178
  D012, D023).
- The release-close sentence (`contributor.ts` `releaseCloseRemedy`)
  tells the session to report a blocker or host denial once with the
  operator's remedy, not to repeat publication and never to repeat
  transitions, and names no point at which the close is done. The WO-184
  session stopped twice on those words: at the permission failure, and
  again with the merged branch present because a re-run looked like a
  repeated publication.
- No role sentence or product text says who pushes a planning branch and
  opens its pull request; product 07 says only that the output "lands
  through the ordinary pull request". In 9 of the 12 planning sessions
  since 2026-09-20 the operator asked for it (7 typed directly, 2
  carried in a compaction summary).

**Design (scope discipline):**

- **The admission reaches the close.** After a merge that changes the
  pinned runtime, the `resume: release close` prompt records the
  release-close dispatch and the exact helper is admitted. The means is
  the executor's to choose and record: the generated fallback recording
  the dispatch and judging the admission with built-ins only, the
  dispatch hook rebuilding main's runtime before it records, or the
  admission reading a dispatch recorded in canonical control by this
  session. Whatever the means, the admission still requires every fact
  it requires today (a recorded release-close dispatch for that order,
  main as the working directory, canonical status listing
  `release-close`); when a fact cannot be read, nothing is admitted and
  the advisory says which fact was missing.
- **One spelling, short output.** One exported function builds the
  helper command in the spelling the admission matches; the resume
  briefing, the `worktree publish` handoff, the material command and
  every blocker retry print it (WO-188 item 2, taken here). `release
  close` writes a summary to standard output: the publication outcome,
  the tag and Release, each cleanup row and blocker with its admitted
  retry command, and the path of the full report, which it writes to
  the retained close lane beside `release-close.json`. A session has no
  reason to redirect the command.
- **Cleanup completes.** (a) After material preservation and before
  `git worktree remove`, write permission is restored on directories
  inside the subject that the current user owns and that lack it;
  symbolic links are not followed and nothing outside the subject
  changes. (b) A subject directory still on disk is never recorded
  `removed`. When Git has dropped the worktree and the directory
  remains, the same run, or a re-run whose retained record names that
  subject path, removes it only when it is no longer a registered
  worktree and the preservation receipt for that path verifies;
  otherwise a blocker names the path. (c) Once the subject worktree is
  gone, whether at the start or by this run, the merged branch is
  deleted in the same run; the dry run prints the deletion it would
  make.
- **The release-close sentence says when the close is done.** It is
  replaced by: run the printed helper command exactly as printed, with
  no redirect, prefix, `cd` or pipe; the close is done when the tag and
  Release exist, `git worktree list` shows no worktree for the order,
  its directory is gone and `git branch --list wo-NNN` is empty; a
  cleanup blocker is diagnosed and finished in this session, and
  re-running the same command is the retry, because it re-checks an
  existing Release and never publishes twice; a host denial of the exact
  command is retried once through the host permission flow before the
  operator is handed the printed command for `!`; material dispositions
  stay the operator's through `--material`; teardown is never forced.
- **A planning pass pushes and opens its pull request.** The planner
  procedure gains one sentence: after the refutation receipt is filed
  with its holds answered and `npm run test:docs` is green, a planning
  or ideation pass on a planning branch pushes that branch and opens its
  `:memo:` pull request; it never merges. The dispatch phrase is the
  operator's authorization for those two effects, as `resume: final
  review` is for the reviewed branch.
- **Declined alternatives, recorded:** a project `permissions.allow`
  rule for the helper (it would admit any order's publish whenever the
  rule matches, without the recorded dispatch or the legal action, and a
  committed absolute path fails the home-path screen); widening the
  admission to accept redirects (it admits writes to arbitrary paths and
  keeps 300 KB of output in the session); un-sealing snapshots inside
  `verification-worktree.ts` (a feedback-judged source, so a live
  episode, and the seal is right while verification runs); a separate
  order for the planner sentence (it shares this order's loadout source,
  re-mint and bundle re-emit).

**Deliverables:** the admission under a stale runtime with its
fixtures; the command builder and its users; the summary and the full
report; the permission restore, the leftover-directory removal and the
branch deletion with fixtures; the two sentences regenerated in both
harnesses; the write-backs.

**Acceptance criteria (all required)**

1. In a fixture main checkout whose built adapter is stale against its
   pins (the state the 5 fallback sessions show), a `resume: release
   close` prompt records the release-close dispatch, and the byte-exact
   helper command is admitted; with any one of the admission's facts
   missing it is not admitted and the advisory names the fact. The
   fixture fails against `efe62994`.
2. The resume briefing, the `worktree publish` handoff, the material
   command and every blocker retry print the command from one exported
   builder, and a fixture shows each printed command is admitted under
   the same facts; the bare `node` spelling no longer appears in the
   helper's output.
3. `release close` (publish, dry run and retry) writes a summary to
   standard output that names the full report's path, and the report in
   the retained close lane holds what standard output holds today; the
   summary's size on the fixture is recorded in the decisions file.
4. Fixtures in a linked subject and main pair: (a) a subject holding a
   nested directory at mode `0500` is removed and its declared material
   is preserved first; (b) a subject directory Git no longer lists is
   recorded as a blocker until it is removed, and a re-run removes it
   when the recorded preservation receipt verifies and refuses it when
   the receipt does not; (c) the merged branch is deleted by the run
   that removes the worktree, and the dry run prints that deletion.
   Each fails against `efe62994`.
5. The release-close and planner sentences in
   `packages/skeleton/src/loadouts/contributor.ts` read as the Design
   states, the generated skills in `.claude/skills` and `.agents/skills`
   carry them, and the words "repeat transitions" and "without repeating
   publication" are gone from the release-close root.
6. Write-backs: product 07 §Workflow closeout and releases states the
   completion condition and the retry, and §Operator-opened planning
   pass states that the pass pushes its branch and opens its pull
   request; the auto-mode row of `docs/AI-HARNESS-SECURITY.md` states
   when the admission applies; the decisions file records the
   admission's means and the measured summary size; the publication
   locks are refreshed.
7. The editions this change stales are re-minted and the harness bundle
   is re-emitted.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1, 2 and 4, each shown
failing at `efe62994`; `npm test -- --review` before
`implementation-ready` and again at final review. No live row: the
executor cannot run a real release close inside the order. The first
live observation is this order's own close, run from merged main by
`resume: release close` in Claude, and the next planning pass records
it.

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- WO-188 item 2 (one builder for the release-close command) is done
  here; WO-188 records it as not reproduced at activation, by its own
  rule for an item already fixed.
- A retry after `origin/main` has moved still refuses at
  `ensureExistingRelease` (WO-176 D029, FUP-da471832071118c7); the role
  sentence's retry is the re-run before main moves, and a refusal after
  a move is reported as a blocker. The row stays deferred.
- Ignored bytes under `.runtime/` beside a declared material path are
  not inventoried: the WO-184 fixture declared only each `target/`, and
  the 70 snapshot files beside them (14 with no other copy) were copied
  by hand before deletion. Runtime output is disposable by design; this
  order does not change that.
- Codex has no auto-mode classifier; the two sentences apply in both
  harnesses unchanged.

**Non-goals:** the moved-main retry; WO-188's other items; host or
account permission settings; any change to the classifier; a project
allow rule; Release edits, main pushes or merges by any role.

**Operator-review assumptions**

1. The planning dispatch authorizes pushing its own planning branch
   and opening its pull request, and nothing else.
2. A host denial of the exact command still reaches the operator, after
   one retry through the permission flow.
3. The executor chooses how the admission survives a stale runtime and
   records why.
