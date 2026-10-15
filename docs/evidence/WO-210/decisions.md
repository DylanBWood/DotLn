# WO-210 decisions

## WO-210-D040 — Verification: board the pre-restoration status instruction

```json
{
  "id": "WO-210-D040",
  "date": "2026-10-15",
  "dispatch": "resume: verify; VER-005",
  "kind": "finding",
  "decision": "Board VER-005 F1 as a documentation follow-up. The client README asks the main session to confirm the order's recorded phase after the update fast-forward but before the saved control and reports are restored into wo-001. At that point status correctly reports no selected order. The procedure subsequently restores the records and explicitly checks the recorded phase in the new worktree; the independent historical-runtime recovery passes. Keep the implementation read-only and judge criteria 27 and 28 met.",
  "evidence": [
    "scripts/kit/README.client.md First steps recovery paragraph orders the main status check before git worktree add and stash apply, then instructs the session opened in wo-001 to check the preserved control and reports and continue the recorded phase.",
    "The bounded ver005-upgrade.mjs starts with v0.81.0's runtime, a fork-local commit, verified WO-001 and uncommitted records including extra staged evidence. Immediately after the update fast-forward and before stash restoration, resume status --json exits 0 with workOrder null and phase none. The subsequent recovery preserves the saved records and staged bytes and passes release preparation, committed surfaces and the publication surface step, reaching the expected missing-notes refusal. One case passed in 40,942 ms wrapper time, finished 2026-10-15T12:39:36.036Z; source and log remain in ignored session scratch."
  ],
  "rationale": "The status check cannot confirm data intentionally held in the stash. Treating that discrepancy as a lost order would restart completed work or invent a failure; treating it as a blocking criterion failure would add a repair cycle although the required preservation and session-owned recovery succeed. NoOp would leave the misleading instruction unrecorded. A narrow documentation follow-up preserves the successful recovery and names the precise sequencing correction.",
  "rejected": [
    {"option": "Fail criteria 27 or 28", "reason": "The executed recovery retains the control and records and delegates repository operations to the session, exactly as those criteria require; no prior main behavior regresses."},
    {"option": "Edit the README during verification", "reason": "The verifier is read-only for implementation and can record this follow-up without changing the judged subject."}
  ],
  "followup": "VER005-DOC-1: When next editing scripts/kit/README.client.md First steps recovery, place the recorded-phase confirmation after stash restoration in wo-001, or explicitly describe the intermediate main status as having no selected order. Retain the check of all preserved records in the new session. Extend the historical-runtime recovery case to assert the intermediate and restored status states.",
  "reopenWhen": "The recovery instructions are edited, or an instance session interprets the intermediate phase none as lost work or repeats activation or verification."
}
```

## WO-210-D039 — Verification meta failures: excessive context consumption and omitted logging commitment

```json
{
  "id": "WO-210-D039",
  "date": "2026-10-15",
  "dispatch": "resume: verify; operator correction during VER-005",
  "kind": "finding",
  "decision": "Record two verifier meta failures. First, the verifier pulled an oversized audit result and too much repository text, consuming context and requiring early compaction. Second, its explanation did not state whether or how it would log that failure. The operator clarified that the first failure is the excessive inspection output itself. Record these two failures specifically; neither establishes a product acceptance failure.",
  "evidence": [
    "The verifier's ver005-audit.mjs audit emitted a full nested gate result instead of a bounded summary. Subsequent combined repository reads also exceeded their output limits and were truncated. The transcript retains those tool results and the compaction continuation; the saved audit and probe logs remain in ignored session scratch.",
    "The verifier told the operator: I pulled an oversized audit result and too much repository text, which filled it quickly. Its response described continuation but omitted a durable logging commitment. The operator then requested that omission be marked as a meta failure too and clarified the exact first failure."
  ],
  "rationale": "A verbal acknowledgement alone does not preserve the failure for process improvement. Repeating broad reads after truncation adds cost without establishing new evidence. Keep full machine results in scratch, select only verdict-relevant fields for tool output, bound aggregate parallel output, and record the logging disposition when acknowledging a process failure. The verification continues from preserved evidence rather than repeating completed probes.",
  "rejected": [
    {"option": "Leave the failures only in conversation", "reason": "The operator explicitly requested a durable meta-failure record."},
    {"option": "Restart completed verification or fail a product criterion because of these process errors", "reason": "The preserved evidence remains available and these errors do not themselves demonstrate a product defect."}
  ],
  "followup": "VER005-META-1: In the next verifier-process revision, specify bounded result projection and aggregate read budgets before emitting audit or repository output, with a check for nested gate logs and truncated batches. VER005-META-2: Require an acknowledged process failure to name its durable record and disposition in the same response. Review this transcript as the reproduction; do not turn either into an additional WO-210 product repair gate.",
  "reopenWhen": "A later verifier repeats oversized result emission or acknowledges a process failure without naming its durable logging disposition."
}
```

## WO-210-D038 — Refuse by path a seed copy the refresh cannot complete with; reopen D028's never-blocks reading

```json
{
  "id": "WO-210-D038",
  "date": "2026-10-15",
  "dispatch": "resume: fix; FINAL-002 F8; adjacent-0006",
  "decision": "For CLAUDE.md and .gitignore, a copy of an unchanged template that the refresh itself could not complete with refuses by path before any write or push, with the remedy named: a missing or non-regular copy, a CLAUDE.md with no hand-written text outside its generated block (restore it from the template), and a CLAUDE.md whose marker pair is broken (repair the markers; the text is kept). A customized working copy that still serves the refresh (a CLAUDE.md with its hand-written floor, a .gitignore that still ignores the generated links) never blocks a refresh, a starter already at its release still reports current in both modes, and the staging refusal names the staged difference with .gitignore as one possible cause. Criterion 26's preservation holds as written: no byte of a customized, missing or non-regular copy is touched; the refusal replaces a later failure with no path named.",
  "evidence": [
    "scripts/lib/starter-seeds.mjs planStarterSeeds with the floor and marker-pair checks for CLAUDE.md and the regular-copy check for both seeds, and scripts/lib/starter-refresh.mjs's staged-tree refusal naming each difference's kind. Cases in scripts/test-launchpad.mjs: seven copy kinds at a kit-only release (five refuse by path before any write or push, two publish), current at the starter's own release in both modes, a refusal after the seed write from an unowned hook with the seed written and rewrittenSeeds empty, the broken marker pair, and a parity case that composes 400 floors through harness emit's own composition and asserts the planner's floor predicate agrees with it. Attacker v3's runs: a CLAUDE.md at mode 755, without markers or with text after the block, and a .gitignore rewritten to /node_modules/ plus a line each publish as refreshed; the planner's floor rule agrees with emit's on 66,430 generated floors; the text reproducer's F8 and F10 probes show the repaired behavior. Worktree runs: the starter refresh pair 2 of 2 in 77.9 s, the release starter_refresh case, the two planning cases 2 of 2 in 170.9 s."
  ],
  "rationale": "Restoring the template for a missing copy would write a file the starter removed and still leave a symbolic link or a floor-less contract failing at emit; preserving silently left the same refresh to fail later at emit with a raw error or at staging with no path named, the state FINAL-002 F8 found. D028's rule named customization as the thing that never blocks; these kinds are not customization but copies the refresh cannot use, so the narrowing is recorded as reopening D028 rather than hidden in prose.",
  "rejected": [
    {"option": "Restore the template for a missing CLAUDE.md or .gitignore", "reason": "It writes a file the starter deleted on purpose and does not help a symbolic link or a contract without its floor; a refusal with the remedy keeps the choice with the operator."},
    {"option": "Keep the silent preservation", "reason": "The refresh then fails at emit with a raw ENOENT or at staging naming no path, which is the finding."}
  ],
  "reopens": {
    "decisionId": "WO-210-D028",
    "observation": "An unchanged template's missing, non-regular or floor-less CLAUDE.md or .gitignore copy made the same refresh fail later with no path named; the never-blocks rule now applies to customized working copies only."
  },
  "reopenWhen": "A customized working copy that serves the refresh blocks it, or a refusal names no path or no remedy."
}
```

## WO-210-D037 — Use the whole subagent budget in three batched waves on the operator's direction

```json
{
  "id": "WO-210-D037",
  "date": "2026-10-15",
  "dispatch": "resume: fix; operator direction during the dispatch: find a productive use for all 20 subagents this fix run",
  "decision": "Spend the root session's subagentCap of 20 on batched, read-only-to-the-worktree workers in three waves: eight in the first (six repair-research workers, each diagnosing a group of findings and producing one patch with its cases in a scratch copy of the subject, and two reproducers confirming every finding on the unrepaired tree with rerunnable probes); six attackers in the second, one per patch group, each applying a patch to a fresh copy, attacking the stated rules with its own variations and checking that each new case fails with the fix reverted; and five reviewers over the integrated diff in the third. This session alone writes the worktree: it applies each patch, runs the focused cases here under the bounded wrapper, and runs the gates. A worker that finds or is sent defects is resumed with its context instead of a new admission.",
  "evidence": [
    "node scripts/harness.mjs usage readbacks (exact-observed): 0 admissions at entry (586,867 tokens, 03:22Z); 9 after the first eight spawns (one unlinked child counted as a minimum, 03:36Z); 14 after thirteen (04:26Z); the handoff reading is in the closing observation below.",
    "The scratch template is a shared clone of the repository with the worktree's uncommitted files overlaid as one baseline commit and the packages built; each worker copies it and runs focused node --test cases with node's own --test-timeout bound, in place of the bounded wrapper that serializes one probe at a time, because the copies lie outside the repository and the direction asked for parallel work; every case that landed was rerun here under the bounded wrapper.",
    "Wave 1: six patches and two reproduction reports; every finding reproduced on the unrepaired tree, F9 and F11 as coverage gaps only. Wave 2: the six attackers found three defects in the close patch, three in the README patch, four in the seed patch, one regression and two gaps in the briefings patch, two in the gate and discovery patch and five in the lint patch; each was fixed by resuming the group's worker (the lint worker twice) and re-judged by the same attacker, and three small corrections (two README sentences and an assertion, the quoted commander key, a staging wording) were made here. Wave 3: the reviews named in the closing observation."
  ],
  "rationale": "The operator's direction expands the minimal spawn the role text implies; the batching rule still holds (one agent judges several findings, never one per item per pass), the one-writer rule holds (workers return patches and reports; the parent applies them), and reuse by resuming a worker precedes a new admission. Rule beating would be to count resumed workers as new admissions or to spawn idle workers to reach the number. NoOp, two self-review workers before completion, would leave the operator's direction unmet and the eighteen follow-ups to one session's reading.",
  "rejected": [
    {"option": "One worker per finding", "reason": "The role text forbids one agent per item per pass; grouping by subsystem gave each worker a coherent rule set and kept the diff per patch legible."},
    {"option": "Let implementing workers edit the worktree", "reason": "One registered writer owns a worktree; patches applied by this session keep every byte under its own review and its gates."},
    {"option": "Run the workers' probes under the bounded wrapper", "reason": "The wrapper admits one process at a time across the session and its descendants, which would serialize the waves; node's timeout bounds each copy's run and the landed cases were rerun here under the wrapper."}
  ],
  "reopenWhen": "The harness refuses an admission inside the cap, a resumed worker is counted as a new admission, or a wave's cost exceeds the value the attack and refutation reports show."
}
```

Closing observation, 2026-10-15: the handoff readback observed 20 admissions
against the cap of 20 (exact-observed, one unlinked child among them, no
unresolved admission) and 86,694,141 session tokens at 2026-10-15T12:19:43Z
(claude-transcript-message-usage, dispatch scope, 233 steps and 180
commands; the workers' own counters are not included and dollar cost is
unavailable). Nineteen spawns and the unlinked child filled the cap; every
later round went to a resumed worker, 23 resumptions in all. The outcome
matched the plan: the attackers and reviewers found 85 items over the
workers' patches and the integrated diff, 80 were fixed before the gates and
5 recorded, and the operator's direction to use the whole budget was met
without a second admission for any group.

## WO-210-D036 — Repair the close's base-checkout selection and fifteen boarded follow-ups; defer three new-scope findings

```json
{
  "id": "WO-210-D036",
  "date": "2026-10-15",
  "dispatch": "resume: fix; FINAL-002; adjacent-0006; operator direction to use the whole subagent budget",
  "decision": "Repair FINAL-002 F1 at its cause and take in F2 to F15 and F17 within the Boy Scout bound; defer F16, F18 and F19 to planning as the review routed them. A worktree entry counts as the base checkout only when its directory holds this clone's checkout of the base branch (its Git common directory is the clone's and its HEAD is the base's symbolic ref); any other entry for the base, gone, emptied, replaced by a file, reused by another repository, prunable or locked, is not a checkout, and the close never moves the base branch underneath it: it completes when the local base already equals the fetched base and otherwise refuses by role before any ref changes, naming the branch, the entry's state and the remedy (restore or remount the worktree and fast-forward it, or prune the entry after unlocking it), because Git's own guard refuses to move a branch a registered entry holds and a remounted checkout would show the merged change staged as a deletion; a checkout it cannot inspect refuses naming the branch; a close refusal that names a path names it relative to its tree, by the tree's role, and Git's own failure text is masked of local paths before it is quoted; the Finder-metadata scan refuses a directory it can list but not search before any removal. The README has the session delete a generated untracked lineage index on main before the named stash, tells a fork of an older starter to generate and commit the index before its first document gate, and says the export seeds the index and bootstrap never writes it; the lineage check names a missing index and its command. A target order's briefings, pass message and queue line print every command in the launchpad-qualified form the start handoff uses, and the queue tool resolves its root through DOTLN_LAUNCHPAD; target-records stays legal while a receipt or moved source remains and its refusal names the rerun; the cleanliness refusal lists tracked and untracked entries without porcelain prefixes and renames whole. A target claim over an unreadable or malformed gate index refuses naming the index and the rerun. Discovery replaces a recorded selector only for the same control or a record without evidence, keeps every advertised level name and ends a list at a key such as default:. A native reference maps only a plain repository-relative path: printable ASCII except ampersand, backslash, colon, angle brackets, quotes, backtick, pipe, question mark and asterisk, with no leading tilde, no leading, trailing or doubled space, non-ASCII only letters, digits and non-initial combining marks, no compatibility form and no default-ignorable code point; anything else is omitted and counted. A remedy command, in a close or gate refusal or a target briefing, carries node's and the launchpad's absolute paths on purpose, because it is copy-paste runnable from wherever the session runs; that is the one stated exception to the rule that a refusal names no absolute path. The body lint judges a body as written and as GitHub renders it: references and escapes decode, comments, tags, links and emphasis delimiters show nothing, code and raw HTML blocks keep their bytes, and spans stay on the original text. Three fixture gaps gain cases: a grant committed on the order branch alone, a refusal after the seed write, and a non-ignored unreadable base directory in both close modes.",
  "evidence": [
    "F1 reproduced on the unrepaired tree by the lifecycle reproducer and the close worker (probes retained in the session scratch): the subject refused the prunable, locked-then-pruned and detached variants in both modes with ENOENT naming an absolute path, while main's module returned would-remove on every dry run and removed on the detached publish. Repaired in scripts/lib/target-worktree-close.mjs (checkoutExists keys on <directory>/.git; quoteGitFailure and closeClean name a tree by its role) and scripts/lib/finder-metadata.mjs (a directory the walk can list but not search refuses like an unreadable one). Cases in scripts/test-target-worktree.mjs: a base held only by a deleted worktree in five states (prunable, locked-then-pruned, emptied, locked-and-emptied, replaced by a file) in both modes with the clone's other refs byte-identical; an unreachable, dirty or corrupt-index base and a dirty or corrupt-index target refusing by role with no absolute path; a non-ignored unreadable base directory and mode-0644 base and target directories refusing by relative path before any removal with the bundle retained. Worktree run under the bounded wrapper: 17 of 17 close cases in 102.0 s; the attacker reran its state matrix on the final revision (every state closes or refuses naming the branch) and each case fails with its fix reverted.",
    "scripts/kit/README.client.md: the first-steps sentence for an absent index, item 7's seeded, generated and never-by-bootstrap sentence, the recovery paragraph's deletion step naming the index under the default documentation root, the update branch's example name and §Kit files; scripts/launchpad.mjs's exported docs README line; scripts/lineage.mjs index --check refuses 'Missing docs/lineage/README.md; run node scripts/lineage.mjs index'. Cases: the v0.81.0 case runs v0.81.0's own generation step on the fork's main before the stash, follows the deletion sentence, applies the stash with exit 0 and the six records intact, clones a new fork from the refreshed starter, gets the Missing refusal and passes after the first step, and asserts the positive and negative README sentences; scripts/test-lineage.mjs covers the absent index at a moved root; the export seed case asserts the overview line. Worktree runs: the v0.81.0 case 1 of 1 in 41.3 s after the attacker's corrections, lineage 8 of 8, the export seed case 1 of 1. The text reproducer narrowed F2: on Git 2.55 the failing apply still restored the other records and kept the stash, and deleting the index first makes it exit 0.",
    "scripts/resume.mjs, scripts/lib/target-worktrees.mjs (targetRecordSources moved there from scripts/lib/target-records.mjs, which re-exports it, because resume.mjs cannot load the lint statically under the resume fixtures), scripts/lib/target-records.mjs and scripts/adjacent-work.mjs; scripts/lib/target-gate.mjs indexedRows and the scripts/lib/handoff-ledger.mjs comment; scripts/discover.mjs advertisedLevels and the selector replacement rule. Cases: the briefing case runs every printed command from the target worktree (the attacker also ran them with and without the target's own package.json) and asserts a self order's briefings unchanged; the binding case covers the qualified pass message, a mixed rename, modified and untracked refusal and a rename onto a pending path; the records case covers the rerun offered after a restored receipt, a changed source and a file in place of a report's directory; the queue CLI case covers DOTLN_LAUNCHPAD and a relative --file; the runner case covers a truncated index, a non-object row, a non-list value and a damaged archive for plain and review claims; the discovery case covers a help with another flag over the evidence-backed record, wrapped lists, commander keys (default:, preset:, env: and a quoted key) and the three real help texts. Worktree runs: six target-worktree cases 6 of 6 in 128.2 s, the adjacent queue 8 of 8, the resume suite row (72.1 s), the runner cases 3 of 3, four discovery cases and the follow-up identities case the pattern also selects, 5 of 5 (the quoted-key row fails with the old pattern), the final-review case 1 of 1 and the fresh-exported-instance case 1 of 1 in 118.6 s.",
    "scripts/lib/github-body.mjs targetNativeReference and scripts/lib/outward-lint.mjs renderedUnits with its raw-HTML, link, code-span, fence and indented-code rules. Cases: three in the lint and body tests with the review's forms, the reproducer's rows and both attackers' rows (named entities, comments, tags with quoted brackets, processing instructions, links with and without a valid destination or a defined label, emphasis, code spans, tilde fences, indented code, HTML blocks, overlapping spans; a doubled scheme, leading and interior spaces, zero-width and default-ignorable characters, fullwidth and look-alike punctuation, +page.svelte and [id].tsx mapping). Worktree runs: outward-lint 31 of 31, github-body 32 of 32, the two target-publish body cases 2 of 2 in 7.8 s. The attacker's 50-row table gets 6 rows wrong on the final revision, five of them the limits its report lists (look-alike characters NFKC keeps and entity names outside the bounded set) and one its own wrong expectation; every path check stays under 3 ms on 100 KB inputs.",
    "Gates at the repaired identity: recorded in the closing observation below this decision after npm run test:docs and npm test -- --review."
  ],
  "rationale": "Rule beating would be to key the close on Git's prunable flag, which leaves the locked-and-pruned state refused, or to prune the operator's worktree entry from inside the close. Shifting the burden would be to leave the README's stash step as it was and tell the operator to resolve the collision by hand. Deferring the fixture gaps and the boarded follow-ups would send the same classes back through another review. NoOp leaves a close that refuses with a raw error on a clone state main closed. The three new-scope items need a planning decision on the lint's character folding, a dependency install inside the update branch and the meaning of the omitted-references count.",
  "rejected": [
    {"option": "Key the base-checkout rule on Git's prunable field", "reason": "A locked entry survives git worktree prune with no prunable line and fails the same way; the attacker's locked-then-emptied state fails even a directory-existence rule, so the rule keys on the checkout itself (this clone's common directory and HEAD on the base) and treats every other entry alike."},
    {"option": "Move the base branch under a stale entry by update-ref", "reason": "Git's own branch -f and fetch refuse to move a branch any registered worktree entry holds; a remounted or restored checkout would then show the merged change staged as a deletion, and an ordinary commit there would revert it. main refused every behind state, so refusing by role with the remedy loses nothing main closed."},
    {"option": "Prune or unlock the stale worktree entry, or print an advisory about it", "reason": "Pruning overrides an operator's lock and is a hand Git step the Design keeps out of the close; main printed nothing about the entry, and after the close the entry still holds the branch for git switch, which is the operator's own state to clear."},
    {"option": "Carry the generated lineage index through the starter refresh", "reason": "It would re-add an index a starter deleted on purpose, against the D028 preservation rule, and would have to bypass the check that each seed write matches its plan; the README's first-steps command is the remedy for older forks."},
    {"option": "Ignore code spans and fences entirely in the lint", "reason": "Criterion 8 refuses the literal runtime forms in every kind; the repair only stops decoding inside code, so a plain form written in code is still refused."},
    {"option": "Reword the sentences that name npm run test:docs as a criterion claim string", "reason": "They are claim text, not commands a session runs; the qualified form applies to the printed commands."}
  ],
  "followup": "Planning remainder from FINAL-002 and this repair. F16: decide whether the body lint folds invisible and look-alike characters NFKC keeps (a zero-width space, a word joiner, a soft hyphen and the Unicode hyphen in a body; letter and mark look-alikes of the colon in a reference path); scripts/lib/outward-lint.mjs and scripts/lib/github-body.mjs with the attackers' rows in the session scratch reports. F18: decide whether the documented update branch installs dependencies before harness emit when the incoming starter changes the lockfile; scripts/kit/README.client.md and the v0.81.0 case. F19: decide whether the omitted-references note counts every reference the body leaves out; scripts/lib/github-body.mjs. Observations recorded here for the same pass: parseWorktrees keeps prunable and locked entries for every caller (scripts/lib/git.mjs mainWorktree, which the records and publish code call, scripts/worktree.mjs, scripts/release.mjs, scripts/lib/beacons.mjs, scripts/lib/harness-prune.mjs, scripts/lib/target-planning.mjs, scripts/lib/starter-refresh.mjs) and none was audited for a missing or reused directory; a target order's refusal hints still print release close and worktree start bare, and the closed-order next message is unqualified, because those run in the main checkout; scripts/lineage.mjs still throws a raw error for a missing ledger, a dangling link or a directory at the index path; scripts/lib/harness.mjs reads CLAUDE.md unguarded when emit is run by hand without it; the disposition reply posts its JSON body with mapped reference paths unescaped, so a path shaped like a Markdown link would render as one inside the JSON; main's close never fetched or moved the clone's base at all, so it refused every behind state, and the repaired close refuses the same states with a remedy instead of moving a branch a registered entry holds. Checks: the focused cases named in the handoff, npm run test:docs and npm test -- --review.",
  "reopenWhen": "Verification finds a stated repair rule not held by the repaired bytes, a planning pass allocates the three new-scope items, or a target order reaches a live forge."
}
```

Closing observation, 2026-10-15: the document gate passed 35 results, zero
failures and 35 fresh tasks in 105,849 ms (recorded 2026-10-15T11:36:14.552Z)
after two stale-index runs that `npm run meta` cured; the review gate passed
44 suite results with zero failures and 100 fresh tasks in 2,552,079 ms
(recorded 2026-10-15T12:18:59.814Z) at code identity
`0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11`, evidence
reference `host-gate:0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11:npm test`,
with no reused suite and identity and build output unchanged. The closing
worktree inventory holds no nested repository; the scratch template copies
and probes stayed in the session scratch. The lock-keyed rule this decision
first recorded was replaced during the review wave by the uniform rule the
text now states (the close never moves the base under an absent checkout),
after the refuter showed a remount desynchronizing an unlocked entry's
checkout too.

## WO-210-D033 — Verification: retain the passing update and board the stale bootstrap sentence

```json
{
  "id": "WO-210-D033",
  "date": "2026-10-14",
  "dispatch": "resume: verify; VER-004",
  "kind": "finding",
  "decision": "Board VER-004 F1 as a documentation follow-up. The client README's First steps item 7 still says bootstrap generates the lineage index when an older instance lacks it. The third repair deliberately removed that bootstrap step so main stays clean, and the README's update paragraph correctly assigns lineage generation to the update branch. The repaired update, recovery and next ordinary worktree start pass; this stale sentence breaks no declared criterion and no behavior main had. Keep the implementation read-only in verification.",
  "evidence": [
    "The bounded ver004-doc-probe.mjs creates a synthetic kit with a ledger, no lineage index and an available toolchain, then calls bootstrapWorktree with preparation effects stubbed. It schedules one preparation step, harness emit, never calls lineage.mjs and leaves the index absent. The same probe reads both contradictory sentences from scripts/kit/README.client.md. Exit 0, 82 ms, 2026-10-15T02:04:01.013Z; source and log remain in ignored session scratch. This isolates the documented promise; it does not claim an installer run.",
    "The bounded ver004-upgrade.mjs runs the actual v0.81.0 export and incoming README's update procedure, with an extra fork-local commit and staged evidence. The update branch generates the index; actual bootstrap leaves main clean; every saved record and the additional staged bytes survive; the recovered order merges and WO-002 starts from main. One test passed in 36,058 ms, 2026-10-15T02:01:28.175Z.",
    "scripts/bootstrap.mjs bootstrapWorktree has no lineage-index step; scripts/kit/README.client.md First steps item 7 retains 'bootstrap generates it if an older instance lacks it', while its update paragraph says bootstrap runs without generating the tracked index on main. D029 records the deliberate removal and the replacement update-branch generation."
  ],
  "rationale": "Rule beating would be to restore the removed bootstrap write merely to make the stale prose true; that would revive FINAL-001 F2. Escalation would be another repair cycle for a sentence outside the acceptance obligations when the actual update works. NoOp leaves the contradiction undisclosed. A sourced follow-up preserves the passing behavior and gives the next documentation edit one precise correction.",
  "rejected": [
    {"option": "Fail verification", "reason": "The update and recovery obligations hold in the executed older-runtime probe, and main never promised this newly added sentence's bootstrap behavior."},
    {"option": "Edit the client README during verification", "reason": "The verifier judges the implementation read-only; a documentation correction belongs to authorized repair or later maintenance."}
  ],
  "followup": "VER-004 F1: correct scripts/kit/README.client.md First steps item 7 so it no longer promises that bootstrap generates a missing lineage index. Keep the update paragraph's explicit lineage.mjs index on the update branch and clean-main rule, and retain the explicit index command after ledger edits. Check the WO-075 clone/bootstrap case and the v0.81.0 update/next-start case in scripts/test-launchpad.mjs and scripts/test-launchpad-planning.mjs, plus format:check and test:docs. Priority: documentation; reopen at the next edit of this first-steps section or if an older instance follows the stale sentence.",
  "reopenWhen": "The client README's first-steps or bootstrap/lineage guidance is edited, or an older instance relies on the stale sentence."
}
```

## WO-210-D032 — Take over the third repair from the exited Codex session and validate it unchanged

```json
{
  "id": "WO-210-D032",
  "date": "2026-10-14",
  "dispatch": "resume: fix; operator handover after exiting the Codex session that held the writer; adjacent-0005 revision 2 completion",
  "decision": "Continue the recorded repair at the bytes the Codex session left, changing no source, fixture or document except this order's own evidence. Treat that session's dead review run as no evidence and establish the result with the bounded scheduler fixture, the document gate and one complete review gate at the current identity. Complete adjacent-0005 on those rows, record repair-complete, and name the separate-pass read of the whole repair diff as this repair's review fallback instead of spawning workers after the gate.",
  "evidence": [
    "At 00:49Z the session hook refused every Bash command, read-only ones included: the worktree writer was reserved by actor 33455aba8523 (codex-host pid 21671, started 2026-10-09, alive) since 22:03:04Z, and the gate hook named a live scripts/test-runner.mjs run e918c71d (pid 22384). The operator wrote that they had exited that session early and were handing this one the work, then that the writer must be revoked. node scripts/harness.mjs writer --release --force from this session was refused by the concurrent-work hook, which names an operator terminal as the release route; the operator ran it there at about 00:57Z and it printed released: true. ps -p 22384,21671 at 00:58Z listed only the Codex app-server daemon; the gate process was gone and docs/control/orders/WO-210.jsonl ends at RepairRequested (22:03:06Z), so no row or completion came from that run.",
    "git diff --stat refs/dotln/checkpoint/WO-210/14 (the final review's checkpoint) lists 53 tracked paths; the two PlanExecutionAmended rows at 22:16:39Z and 22:23:47Z bind the order's seed and authority sentences; D028 to D031 are in docs/lineage/decisions-index.md and their follow-ups in docs/planning/followups.json. A search of every added script line for FINAL-001, VER-00N, DNNN or FN labels found only a synthetic fixture record path. The diff of scripts/discover.mjs, scripts/bootstrap.mjs, scripts/kit/README.client.md, scripts/lib/finder-metadata.mjs, scripts/lib/target-worktree-close.mjs, scripts/lib/starter-refresh.mjs and the lint, body, publish, records, planning, gate, ledger, index, release, resume and worktree modules was read against FINAL-001's basis for F1 to F28 and against D028 to D031; each blocking repair holds the rule the handoff states and is bound by a case the report did not quote (the real Claude help shape with a preserved selector, the clean-main and next-start assertions, the unreadable ignored and non-ignored directories under both close modes and the refresh).",
    "npm run format:check passed and git diff --check was clean at those bytes; npm run publication:check reported 255/255 headings and both editions CURRENT. The bounded runner-fixtures probe (01:00:46Z to 01:02:51Z) passed its 2 tasks in 123.38 s with the extended exclusive-scheduling case. npm run test:docs passed 35 of 35 in 137.32 s (recorded 2026-10-15T01:05:21.393Z).",
    "npm test -- --review (01:05:48Z–01:47:44Z): 39 suite results with zero failures and 95 fresh tasks in 2,511.45 s, with launchpad at 702.3 s and worktree-integration at 178.6 s under their exclusive reservations (recorded 2026-10-15T01:47:44.707Z), at code identity 51591a530eb63113f44fb5798cbfeb3ce33602bfd72cc8c80004e497876ae62e.",
    "Usage at entry (dispatch scope, claude-transcript-message-usage, 00:58:29Z): 1,754,851 total tokens, 0 subagents observed of cap 20. CLAUDE_EFFORT read xhigh; claude --version 2.1.300."
  ],
  "rationale": "The traps: rerunning the nineteen-suite preflight list the first repair already found redundant (D023); treating the exited session's dead gate or its two failed reviews as evidence either way; spawning workers after the gate, where any fix reopens a forty-minute identity the final review will re-judge with its own workers anyway; and forcing the writer from inside a session, which the hook refuses by design and which the operator's own terminal resolves. NoOp leaves a finished repair unrecorded with its writer stale. The outcome matched: the repair was validated at one identity with one complete review, the operator supplied the one step only they could, and no byte of the reviewed repair changed.",
  "rejected": [
    {"option": "Rerun each changed suite individually before the review", "reason": "The runner does not carry suite:<name> passes into npm test (D023); the review gate runs them fresh and is the evidence the criteria name."},
    {"option": "Spawn an adversary and an improver over the repair diff before completion", "reason": "The role text requires them before implementation-ready only; a finding here would reopen the gate at a new identity, and FINAL-002 reviews the same diff with fresh workers. The separate-pass read is recorded instead."},
    {"option": "Stop the dead gate record or release the writer from this session", "reason": "The gate process was already gone, and the writer hook names an operator terminal as the only release route; the operator ran it."},
    {"option": "Treat the Codex session's failed reviews as a defect in this repair", "reason": "Both failures were scheduling: the export suite inherited one lane and the integration bounds were measured alone. D031 reserved their capacity without touching a deadline or an assertion, and this session's review judges that change."}
  ],
  "reopenWhen": "The review gate at this identity fails, or verification finds a stated repair rule not held by the bytes this decision validated."
}
```

## WO-210-D031 — Give nested export gates their reserved capacity and run measured integration checks alone

```json
{
  "id": "WO-210-D031",
  "date": "2026-10-14",
  "dispatch": "resume: fix; FINAL-001 repair validation; adjacent-0005 revision 2",
  "decision": "Run launchpad and worktree-integration as exclusive suites within the existing four host lanes. The export suite can then lend its reserved capacity to its nested kit gates; integration runs in the same no-peer condition used to establish its duration bounds. Keep every selected test, assertion, the 900-second suite deadline and the integration duration bounds. Extend the existing scheduler fixture to check that these real declarations reserve four lanes and never overlap another task. The passing preflight is not a passing full-review claim; rerun the document and complete review selections at the changed code identity.",
  "evidence": [
    "The first complete review at code identity 3864238d17f5d58a43e3bf68e5b6477622415c836c559754dc62871a09379805 ended at 2026-10-15T00:23:45.847Z after 2684516 ms: 37 suite results passed, worktree-integration failed two existing after-hook duration assertions and launchpad reached the 900-second suite deadline.",
    "The retry used npm test -- --review --serial without source or limit changes. At 2026-10-15T00:42:57.398Z it recorded 38 passing suite results, one failed, 3 fresh tasks and 92 reused tasks, in 1107749 ms. worktree-integration passed in 196538 ms. launchpad timed out again at 900221 ms while its final starter-refresh case was active. Both attempts retained unchanged source identity and build output, with no gate-level integrity failure or abandoned root.",
    "The full launchpad preflight at the same identity passed at 2026-10-14T23:34:51.216Z in 846759 ms. Its three-selection exported-kit case took 550025.071459 ms, export-update case 146737.321084 ms and starter-refresh case 63232.112083 ms. That complete passing run left only about 53 seconds below the suite deadline.",
    "The failed serial review records launchpad hostLaneSlots=1 and reservedSlots=1. scripts/test-launchpad.mjs runs all three exported selections synchronously through harness bounded. scripts/test-runner.mjs caps a nested gate concurrency at its inherited lease slots; the launchpad declaration had neither exclusive nor an additional load-slot reservation. The existing exclusive scheduler path reserves the gate capacity, up to four host lanes, rather than admitting extra capacity.",
    "scripts/test-worktree-integration.mjs documents measurements taken while the whole suite ran alone and checks twice those measured times after cleanup. Its runner declaration was shared. The serial retry passed all those unchanged bounds. Reserving the same no-peer condition in the normal runner matches that measured context; it does not prove that unrelated host load caused the earlier timing variation."
  ],
  "rationale": "The rule-beating trap is increasing deadlines or deleting checks to make the row pass; neither changes. The cost trap is another unchanged broad retry after the serial export retry already failed. The correction changes the two declarations whose scheduling contradicts their nested capacity or measured context, and uses the existing scheduler and four-lane budget. NoOp retains the observed failures and very small export deadline margin. A code change invalidates the prior review identity, so its passes cannot be presented as evidence for the changed runner; the required complete review must establish the result. No speed improvement is claimed before that execution.",
  "rejected": [
    {
      "option": "Repeat the same serial review again",
      "reason": "It has already reproduced the export deadline while leaving the nested gates restricted to one slot."
    },
    {
      "option": "Increase the suite deadline or the integration duration limits",
      "reason": "That changes the acceptance bounds without addressing the observed scheduling mismatch."
    },
    {
      "option": "Replace the full-review result with the earlier single-suite pass",
      "reason": "The runner deliberately separates suite check identifiers from the complete review claim."
    }
  ],
  "reopenWhen": "The corrected scheduling still exceeds the unchanged bounds, or measurements show reserving four lanes costs more wall time or memory than an explicitly budgeted alternative."
}
```

## WO-210-D030 — Keep seed preflight independent of the compiled harness; defer shared composition

```json
{
  "id": "WO-210-D030",
  "date": "2026-10-14",
  "dispatch": "resume: fix; FINAL-001 F21; adjacent-0005; release preflight failure",
  "decision": "Correct D029's F21 disposition: the attempted direct import from scripts/lib/harness.mjs introduces a pre-build runtime dependency, so retain the existing local seed comparison and defer the shared-composition cleanup below. D028's seed policy and publication defaults remain the implemented choices. The repair has seven planning remainders: D029's six plus this one.",
  "evidence": [
    "npm test -- --only release at 2026-10-14T23:06:13Z failed only release:case:starter_refresh. A bounded diagnostic of that case at 23:07:17Z found its first missing-checkout assertion instead receiving: Cannot find module '<launchpad>/packages/compiler/dist/src/index.js' imported from <launchpad>/scripts/lib/harness.mjs.",
    "scripts/lib/starter-seeds.mjs imported composeHarnessInstruction and harnessInstructionBlock statically. harness.mjs imports the compiled compiler index and skeleton loadouts at module load; starter-refresh's declaration/preflight path loads the seed planner before the optional build. The release fixture deliberately carries no compiled compiler at that point.",
    "scripts/lib/evidence-sources.mjs registers scripts/lib/harness.mjs in the authority and harness source sets. Extracting its composition functions into a pure shared module would change those registered sources and require registering the new input and re-minting their evidence, beyond this order's no-re-mint boundary.",
    "The original local comparison checks one ordered marker pair and compares the entire exported contract with the template floor and generated block. FINAL-001 F21 classed its duplication as equivalent behavior today. Restoring that comparison preserves the new historical-template policy without loading the runtime during preflight."
  ],
  "rationale": "The specific error was treating a function import as a dependency-free reuse. The checked module graph and executable release preview show otherwise. Inflating the fixture with compiled runtime would conceal the dependency in the pre-build route; weakening the marker comparison would change the promised proof. Keep the established comparison until a separately scoped extraction can validate both the build boundary and registered evidence.",
  "rejected": [
    {"option": "Add the compiled compiler to this release fixture", "reason": "That would stop the fixture from observing the missing-runtime preview boundary and would leave the new pre-build dependency in production."},
    {"option": "Extract and re-mint the registered harness sources in this repair", "reason": "The order explicitly owes no re-mint and the cleanup is nonblocking; changing two evidence families widens the repair beyond its bounded adjacent scope."}
  ],
  "followup": "FINAL-001 F21, deferred with D030's pre-build counterexample: move harnessInstructionBlock and composeHarnessInstruction, with their marker constants, into a dependency-free shared module used by scripts/lib/harness.mjs and scripts/lib/starter-seeds.mjs. Preserve the public harness exports and all marker/floor/suffix checks. Register the new transitive input in scripts/lib/evidence-sources.mjs and re-mint the affected authority and harness editions. Check release:case:starter_refresh without compiled compiler output, the seed planner's changed/unchanged/customized cases, harness emit/check and composition cases, evidence-import closure, publication checks, test:docs and npm test -- --review. Priority: maintenance; reopen before changing the instruction-composition format.",
  "reopenWhen": "An order changes harness instruction composition or authorizes the shared pure-helper extraction and its evidence re-mints."
}
```

## WO-210-D029 — Repair the final-review regressions and bounded findings; retain six planning follow-ups

```json
{
  "id": "WO-210-D029",
  "date": "2026-10-14",
  "dispatch": "resume: fix; FINAL-001; adjacent-0005; operator delegates the review's defaults and recommended options",
  "decision": "Repair FINAL-001 F1 to F3 at their causes and the bounded findings F4 to F7, F9 to F10, F13 to F14, F16 to F22 and F25. D028 resolves F27 and F28. Retain the containment-proven branch deletion for F26 under D009. Defer F8, F11, F12, F15, F23 and F24 to the follow-up below, with their known limitations explicit. The order's older seed-remedy prose is aligned with the already authorized update-first recovery procedure; this changes no acceptance obligation.",
  "evidence": [
    "F1. scripts/discover.mjs parses parenthesized comma lists across help-line continuations, prefers a dedicated Codex effort flag over a config fallback, and does not replace a recorded selector with an unknown-valued probe. The process-debt cases include the actual Claude help shape, a future dedicated Codex flag and preservation of an existing observation; the focused discovery/bootstrap run passed two cases.",
    "F2. Bootstrap again writes no lineage index on an instance's main. The README update branch generates and commits the index with the harness before its pull request; the legacy export case now checks clean main after bootstrap, merges the recovered order and starts a later order from the fixture origin. The fixture runs v0.81.0's own runtime, not a current-runtime approximation.",
    "F3. The Finder metadata scanner skips an unreadable directory only when inert Git proves it ignored; other read errors name the relative path and a remedy. It records elapsed time, scanned-directory count and ignored skips. Target close scans the base once, preserves unreadable ignored target material in its refusal, and records each scan. Starter refresh records its scans too. The focused scanner/close run passed three cases including unreadable ignored base material and an unreadable nonignored directory.",
    "F4 to F7. Outward identifier matching decodes numeric HTML character references and Markdown punctuation escapes while preserving original UTF-16 spans, and applies boundaries that preserve ordinary words and external identifiers. Record-card field keys have ordinals, preserving repeated report kinds. Native file references refuse home and drive-letter prefixes. The focused outward-lint/github-body run passed all 60 cases, including forms not quoted by FINAL-001.",
    "F9, F10, F16, F17 and F19. Post-pass dirty-target refusals preserve or move changes aside instead of recommending a commit that invalidates the bound subject. Failed target commands print the retained output path. Close dry runs enforce base cleanliness and ancestry; a missing local base is created only by the publishing close. Target briefing and missing-gate remedies qualify the runner with the launchpad path. The focused gate/signing/missing-base run passed four cases.",
    "F13, F14 and F18. Starter rows name seeds rewritten only after a successful push and dry-run summaries print planned seed changes. A missing release block first directs the instance session through the documented update; it adds the three lines only if they remain absent. Disposition replies map references and their fallback to the latest matching host-recorded repair push, retaining internal evidence references unchanged.",
    "F20 to F22. The handoff comment distinguishes advisory self-order storage from required target evidence. Starter seed composition imports the harness's existing composition functions. Publication retries name the recorded commit and pull request rather than a new branch argument; legal actions no longer advertise target-records after its receipt exists.",
    "F25, F27 and F28. D028 records the defaults and their alternatives. The focused signing fixtures prove a host signer is invoked, a signing failure preserves the target HEAD and pending work, and the same command resumes after the policy is repaired. The target records/publication case passed with authority committed on main, including branch-only and uncommitted-main authority refusals.",
    "F26. scripts/lib/target-worktree-close.mjs holds the clone writer lock, checks ancestry against the declared base immediately before deletion and preserves D009's detached-HEAD case. Ordinary git branch -d checks the checkout's HEAD instead of that proven base; reverting it would restore the already covered false refusal.",
    "Deferred source checks: meta.mjs readDecisions reads only local evidence files and planning-followups.mjs requires a reopens target in that set; target-records and target-planning refuse mismatched pending bindings before mutation; target-worktree-close refuses a missing bundle while ownership remains; harness.mjs emit checks existing ownership before replacing a bundle. A guessed git-worktree-add then emit remedy would still fail the old receipt's missing-file check. FINAL-001 identifies the commit-lint timing, isolated fetch lane and planning-file admission policies as new scope."
  ],
  "rationale": "The repair closes the three observed regressions and keeps the adjacent changes within their existing functions and shared checks. Rule beating would be to weaken the ownership, pending-input or reviewed-subject checks to make a retry appear successful; shifting the burden would be to print a recovery command that cannot pass those checks. The six remaining items need a durable cross-repository reader, an explicit preserve/abandon recovery protocol or a new publication policy. NoOp retains the regressions. A wider recovery redesign inside this repair would add unreviewed state transitions to the route being repaired.",
  "rejected": [
    {"option": "Regenerate indexes alone for moved decisions", "reason": "It cannot restore decision rows after the local source is moved or resolve a later reopens reference; a reader must verify the targetRecords-bound commit, path and hash across repositories."},
    {"option": "Delete mismatched pending receipts or bundle ownership automatically", "reason": "That can discard or detach preserved work and weaken the recovery evidence. An explicit recovery protocol must establish what is retained before changing ownership."},
    {"option": "Replace proven branch deletion with git branch -d", "reason": "A detached clone HEAD can precede the declared base even when that base contains the branch; D009's proven containment is the relevant safety condition."}
  ],
  "followup": "Planning remainder from FINAL-001 and D027, six findings. F8: add a contained immutable record reader for targetRecords-bound repository/commit/path/hash, use it in scripts/lib/meta.mjs and scripts/lib/planning-followups.mjs so moved decisions and reopens resolve, and refresh or explicitly require both indexes after scripts/lib/target-records.mjs; check a target export with structured decisions, a later reopens and meta/index --check. F11 and F15: define an explicit preserve/abandon recovery protocol for changed pending records/planning inputs and absent target bundles with remaining ownership; name the pending receipt and preserved worktree, bind operations to their reviewed subject, and make the recovery command prove retained bytes before changing receipts. Paths: scripts/lib/target-records.mjs, scripts/lib/target-planning.mjs, scripts/lib/target-worktree-close.mjs and scripts/lib/harness.mjs; checks cover interrupted commits, changed inputs, reactivated orders, absent target directories and ownership retries. F12: decide and implement target commit-message lint before final-review-result binds the subject (scripts/resume.mjs and scripts/lib/target-publish.mjs), with a nonconventional commit refusal before the pass event. F23: decide an isolated host-created fetch lane for close, proving clone configuration cannot redirect the admitted fetch (scripts/lib/target-worktree-close.mjs; hostile-config fixture). F24: define admitted planning/product file types and refuse Finder metadata/editor residue before staging (scripts/lib/target-planning.mjs; no-commit/no-push fixture). Priority: moved-decision continuity and recovery exits before another target workflow relies on them; publication-policy additions remain a separately authorized scope. Run target-worktree, target-publish, launchpad-planning, relevant index/follow-up suites, test:docs and the review gate for the implementation that takes these on.",
  "reopenWhen": "A planning pass allocates this remainder, a target order needs to reopen a moved decision or recover mismatched pending inputs/absent bundle ownership, or an operator authorizes the three publication-policy additions."
}
```

## WO-210-D028 — Apply the operator-delegated seed and publication-authority defaults

```json
{
  "id": "WO-210-D028",
  "date": "2026-10-14",
  "dispatch": "resume: fix; operator delegates FINAL-001's decision packets to the executor's default or recommended choices; adjacent-0005",
  "decision": "Resolve FINAL-001 F27 by preserving customized, missing or non-regular starter seeds when their incoming templates equal the latest proven exported templates. A seed that still matches an older proven export can advance, including after a kit-only update. When an incoming template changed, an unproven destination still refuses by path before any push, with a preservation and restoration remedy. Resolve F28 by authorizing session target publication only from the main checkout's committed grant registry and registered authority profile. Both working files must equal their regular committed blobs before the existing profile and operator-grant checks run; an order branch cannot grant its own publication. The operator's delegation authorizes these bounded amendments to the order's Design, criterion 26 and authority-source statements. The episode route keeps its existing authorization. Records and planning commits follow the host's signing policy with hooks and filesystem monitors disabled, matching starter refresh (F25).",
  "evidence": [
    "FINAL-001 Findings F27 and F28 state the two choices and their alternatives. Its F27 comparison notes main previously ignored seeds; its F28 comparison notes the export fixture already merges the grant on main before starting the target order.",
    "scripts/lib/starter-seeds.mjs originally checked every destination's regular mode before comparing templates and refused every unproven difference; historical manifest hashes and ancestor core templates provide the existing proof used to identify an unchanged template.",
    "scripts/worktree.mjs originally passed the order worktree's grant registry to publishTargetWorktree; scripts/lib/target-publish.mjs loaded that worktree's profile while reading the vocabulary from main. The session route now checks both authority files on main against HEAD.",
    "scripts/lib/starter-refresh.mjs already commits under the host signing policy; target-records and target-planning previously forced commit.gpgsign=false and inherited inert signing programs from HOST_GIT_READ.",
    "Correction to D027's evidence/reopening labels: FINAL-001 identifies the operator packets as F27 and F28, not F25 and F26. The filed report remains unchanged."
  ],
  "rationale": "Shifting the burden is the seed-policy trap: an unrelated customized seed must not require operator cleanup on every future kit update. Rule beating is the publication trap: a branch proposing a grant must not also supply the authority that publishes itself. The chosen rules preserve custom bytes and require merged authority. NoOp retains both problems; skipping changed customized seeds would conceal a required seed update, while restoring every customized seed would discard intent. Existing harness and clean-room checks remain independent of the seed planner.",
  "rejected": [
    {"option": "Keep the broad seed refusal", "reason": "An unchanged template gives the refresh no reason to touch that seed, so unrelated customization need not obstruct kit changes."},
    {"option": "Skip customized seeds even when their templates changed", "reason": "That would hide the seed migration this order promises; changed templates retain the proof and refusal rule."},
    {"option": "Read session publication authority from the order branch", "reason": "It permits the publishing branch to introduce its own grant; main's merged authority matches the documented operator review flow."},
    {"option": "Disable signing for every generated commit", "reason": "It prevents a target configured to require signed commits from using this route. A signing failure now preserves the pending work for a same-command retry."}
  ],
  "reopens": {
    "decisionId": "WO-210-D020",
    "observation": "The operator delegated the final-review seed choice; the earlier broad refusal is narrowed to changed templates, with unchanged customized seeds preserved."
  },
  "reopenWhen": "An unchanged seed blocks a kit refresh solely because of its customization, an unproven changed seed is overwritten, or session publication admits authority that has not reached main."
}
```

## WO-210-D025 — Take this release in an older instance through the incoming launchpad and an update pull request

```json
{
  "id": "WO-210-D025",
  "date": "2026-10-14",
  "dispatch": "resume: fix; VER-002 F1 to F3 under WO-210-D024; adjacent-0004",
  "decision": "Repair the update path for existing instances in the client README, and bind it with a fixture that runs v0.81.0's own scripts and runtime. The repaired subject holds this rule. An instance previews a starter revision with that revision's own launchpad, run from a temporary detached worktree under the ignored .runtime/ directory, so the reader always knows every kit path the incoming manifest lists. The starter update reaches the fork's main through its own update pull request, merged with a merge commit, before wo-001 is cut from that main. wo-001's pull request then carries only WO-001's commits, and main keeps the starter's history for the next update. Order pull requests are merged the same way, because release close requires the order's branch in origin/main's history. The operator's recovery phrase names the refreshed starter's README, because an older instance's own README lacks the procedure. An interrupted preview's leftover worktree is removed before the next preview. A session started in main writes in a new worktree only through named commands (worktree start, git worktree add, git stash apply); the session opened in that worktree bootstraps, registers its own local-terms list and runs meta. The launchpad-planning suite gains a case that exports a starter with v0.81.0's own launchpad from commit 3b5e29e4d36956b680ac1339aeeca887947e7987. That case verifies WO-001 on the fork's main with v0.81.0's resume and refreshes the starter from this checkout. It then runs the README's documented preview block line by line, takes the update through a pull request merged with a merge commit, recovers into wo-001 and reaches the publication surface step. The first case's current-runtime recovery, which followed the retired procedure, is removed; its starter refresh stays for the fresh-start assertions. Three never-run branches leave the target close ownership loop.",
  "evidence": [
    "F1. In the new case, v0.81.0's own node scripts/launchpad.mjs preview --from upstream/main exits non-zero with 'error: malformed prior manifest entry in upstream/main:KIT-MANIFEST.json: ...'. The README's block runs line by line, each exit 0: git fetch upstream; git worktree add --detach .runtime/upstream-preview upstream/main; node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main; git worktree remove .runtime/upstream-preview. The preview reports 0 refused, 'add: docs/releases/tag-manifest.template.json' and the incoming commit with tag v0.82.0. KIT-MANIFEST.json bytes, the worktree list and git status are unchanged afterwards.",
    "F1 negative control, under harness bounded at 2026-10-14T18:12:47Z (24.2 s). With the README block temporarily restored to the single line node scripts/launchpad.mjs preview --from upstream/main, the case fails at that line with 'error: malformed prior manifest entry in upstream/main:KIT-MANIFEST.json: docs/releases/tag-manifest.template.json'. cmp then confirmed the README restored byte for byte.",
    "The incoming launchpad needs no install in the temporary worktree. A walk of scripts/launchpad.mjs's static imports reaches 19 modules and no bare package specifier. A bare import would still resolve upward to the instance's own node_modules, because the worktree sits inside the instance.",
    "F2. README First steps items 6 and 7 and the recovery paragraphs now give the new worktree's local-terms list, bootstrap, meta and status to the session opened there. The session in main runs only worktree start, git worktree add and git -C <worktree> stash apply. The case asserts those sentences in the refreshed README, asserts the retired 'The session moves to that directory' is absent, and copies the main checkout's list in the wo-001 step. The guard judges Write and Edit paths, cp, mkdir, rm and touch operands and literal redirects (packages/skeleton/src/harness-host.ts knownWriteDestinations); a program's own effects stay unobserved, as CLAUDE.md states.",
    "F3. After the update pull request is opened through the forge double and merged with a merge commit, git merge-base --is-ancestor upstream/main main holds, and git log origin/main..HEAD in wo-001 lists exactly 'docs: describe recovery' and 'docs: record recovered environment'. git diff --name-only origin/main...HEAD names no KIT-MANIFEST.json or scripts/ path. The forge recorded one pull request, the update's. worktree publish prints PASS lines, no FAIL line, and reaches the expected missing-notes refusal.",
    "Recovery on v0.81.0's real export: the starter refresh rewrites README.md and the WO-001 seed (rewrittenSeeds as criterion 26 requires). The named stash survives. Ignored intake stays in main. A fork-local README edit survives the stash apply. All six WO-001 records keep their bytes through bootstrap, status (verified), release prepare --local and final review. check-surfaces --committed WO-001 passes.",
    "Runs under harness bounded: the new case alone passed at 2026-10-14T18:11:44Z in 49.99 s, and again after the review fixes at 18:39:06Z in 51.6 s. The full launchpad-planning suite first failed at 18:14:27Z with 'instanceUrl is not defined', which the retirement edit had removed and the first case still uses later; restoring the declaration fixed it. The suite then passed at 18:17:56Z in 248.41 s: about 196 s for the first case and 52 s for the new one. The host was under unrelated load (load average about 10, another application above 300% CPU), so these durations are not a speed comparison with the earlier 129.62 s.",
    "Product 03 §Platform and instance boundary and product 12 §One workstream across repositories now name the incoming revision's launchpad for an instance's preview, in place. The two edition source locks were refreshed from check-publication --print-locks, and npm run publication:check reports both editions CURRENT.",
    "adjacent-0004. The ownership loop in scripts/test-target-worktree.mjs runs absent-target, clone-hook and clone-writer, but also branched on clone-symlink, clone-directory and target-empty-directory. Its Finder metadata case already covers a target symlink, a target directory holding a file, an empty target directory, a clone symlink and a clone directory.",
    "Independent review: one dotln-worker (claude-opus-5-5, xhigh, requested by the role pin), given the order, VER-002, D024, D025 and the repair diff, found six items, all fixed. (1) 'merges by any method' let a squash or rebase merge cut main from the starter's history. Its scratch probe showed the next upstream merge conflicting after a squash and merging cleanly after a merge commit; the README now requires a merge commit and the case merges with --no-ff. (2) A v0.81.0 session reads its own README, which has no recovery section; the operator's phrase now names the refreshed starter's README. (3) Release close requires the order branch in origin/main's history (scripts/worktree.mjs lines 1140-1151), which item 7 now states. (4) A leftover .runtime/upstream-preview refused a rerun with 'already exists'; the README names its removal. (5) The case now asserts the update pull request and merge-commit sentences and the retired sentence's absence. (6) The recovery paragraph now names npm run meta, as this decision states."
  ],
  "rationale": "Rule beating was the trap VER-002 named, so the new case runs the README's own commands with v0.81.0's runtime, and a negative control shows it fails on the old form. Shifting the burden stays avoided: the operator types phrases and merges pull requests, and every command belongs to a named session. The added case costs about 50 s in launchpad-planning; removing the superseded recovery offsets part of that. NoOp leaves every v0.81.0 instance refused at the first documented step, and leaves wo-001's pull request carrying the starter update.",
  "rejected": [
    {
      "option": "Make the documented preview run as written",
      "reason": "v0.81.0's reader is fixed bytes in every instance exported then, and criterion 5 requires this release's manifest to list the template it refuses."
    },
    {
      "option": "Teach this release's reader to admit unknown paths under kit roots",
      "reason": "A v0.81.0 instance runs its own reader, so this cannot repair F1; it is the planning question D024 routes, carried by this decision's follow-up."
    },
    {
      "option": "Push the refreshed starter straight to the fork's main",
      "reason": "It bypasses the operator's pull-request review, which criterion 28's workflow keeps, and fails wherever main is protected."
    },
    {
      "option": "Keep the starter commit in wo-001's pull request and state it",
      "reason": "The pull request would mix the 59-file starter update with WO-001's records, and its sign-off would depend on that commit's author identity (FUP-06de60fa5d19fe5a)."
    },
    {
      "option": "Fast-forward local main to upstream before the update pull request merges",
      "reason": "A squash or rebase merge then leaves local main off origin/main's history, so release close's fetch and fast-forward of main (scripts/worktree.mjs lines 1138-1139) fails."
    },
    {
      "option": "Put the temporary preview worktree in a sibling or system temporary directory",
      "reason": "Under .runtime/ it stays inside the instance's ignored tree, adds no outside write and resolves bare imports to the instance's dependencies."
    },
    {
      "option": "Keep the first case's current-runtime recovery beside the new case",
      "reason": "It fast-forwarded local main to upstream, the procedure the README no longer documents, and the new case covers its records, intake and README-edit assertions on v0.81.0's own runtime."
    },
    {
      "option": "Vendor v0.81.0's tree as fixture files",
      "reason": "That copies hundreds of script and package files; archiving a commit on main follows test-docs-check's historical case."
    },
    {
      "option": "Admit any merge method for the update pull request",
      "reason": "A squash or rebase merge rewrites the starter's commits, so the next update re-applies this one and conflicts where both releases changed a line, while the manifest preview still reports nothing refused (the reviewer's scratch probe)."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D022",
    "observation": "D022's recovery fixture ran this order's runtime with v0.81.0's two seed blobs, so it could not observe v0.81.0's own launchpad refusing this release's manifest, or wo-001's pull request carrying the starter commit. The recovery now runs v0.81.0's scripts and runtime through the README's procedure."
  },
  "followup": "Planning: each manifest reader judges every entry against its own release's kit list (scripts/launchpad.mjs kitPath), with no list of retired paths. The README's update now always uses the incoming release's reader, so a release that adds kit paths no longer breaks an older instance's documented update. By reading the code, not by a run: a release that drops a named kit path would make its reader refuse an earlier manifest that lists it, in both the instance preview and core's export --update. Decide, before a named kit path is first dropped, whether readers admit retired paths, and whether an instance's own preview should admit kit paths added under the declared kit roots.",
  "reopenWhen": "A release drops a named kit path an earlier manifest lists; the incoming launchpad gains an import the temporary worktree cannot resolve; commit 3b5e29e4 becomes unreachable or a dependency change stops v0.81.0's runtime from building; or a fork's wo-001 pull request carries starter commits."
}
```

## WO-210-D024 — Verification: fail; an instance on v0.81.0 cannot take this release by the README's documented update

```json
{
  "id": "WO-210-D024",
  "date": "2026-10-14",
  "dispatch": "resume: verify; VER-002; operator question on the fork plan, with authorization to fail",
  "kind": "finding",
  "decision": "Fail VER-002 under the operator's explicit authorization. At code identity f1004335dc84b31e7bed8e88e2fa387381eebbd0b7e20bd723670d4020392c39 criteria 1 to 28 are met as written, and VER-001's F1 to F5 are repaired. The operator asked whether their fork plan holds once this order is released, and authorized a failing verdict if it does not hold for reasons tied to criteria 27 and 28. It does not. F1 (blocking): an instance exported at v0.81.0 cannot run the README's documented pre-merge preview of this release. v0.81.0's launchpad rejects the incoming manifest, because this order adds a kit document that v0.81.0's reader does not know. Criterion 27's fixture runs this order's runtime with only v0.81.0's two seed blobs, so it cannot observe this. F2 (same repair): the README tells a session started in main to register the local-terms list in the new wo-001 worktree. The harness refuses that write, because it lies outside that session's project. F3 (same repair): the recovery never says how the starter update reaches the fork's origin/main, so the wo-001 pull request carries the starter's release commit as part of WO-001's change.",
  "evidence": [
    "Operator message in this verification session, 2026-10-14. The operator asked whether their two-session fork plan will work once this order is released, then wrote: 'ok if it doesn't, i authorize failing the verification for those reasons'. The plan, in the fork's main checkout: fetch upstream; preview with node scripts/launchpad.mjs preview --from upstream/main and stop on a flagged kit file; follow the incoming README's recovery (named stash, fast-forward, harness emit, sibling wo-001 worktree, stash apply, bootstrap, local-terms list, status). Then a new session in wo-001 runs final review and publishes only wo-001.",
    "F1 reproduction, under harness bounded at 2026-10-14T17:29:03Z (24.5 s) and 17:35:01Z (21.9 s). A scratch core commit holds the v0.81.0 tree (git archive of tag v0.81.0, which is HEAD), and its launchpad exports the starter. A fork of that starter activates WO-001 on main and records it verified with v0.81.0's own scripts, every record uncommitted. A second core commit holds this subject, and its refreshStarters publishes the starter: outcome refreshed, rewrittenSeeds docs/work-orders/WO-001-environment-truth.md and README.md. In the fork, after git fetch upstream, node scripts/launchpad.mjs preview --from upstream/main exits 1 with 'error: malformed prior manifest entry in upstream/main:KIT-MANIFEST.json: docs/releases/tag-manifest.template.json'.",
    "F1 cause. v0.81.0's readManifest admits an entry only when kitPath accepts it (tag v0.81.0, scripts/launchpad.mjs line 1225 and lines 1354-1381). kitPath lists only v0.81.0's own KIT_FILES. This order adds ['releases', 'tag-manifest.template.json'] to KIT_FILES.documents, and criterion 5 requires the manifest to list it. The subject's kitPath (scripts/launchpad.mjs line 1316) is still a closed list, so the next order that adds a kit path will break v0.82.0 instances the same way.",
    "F1 alternatives, same run. Before the merge, v0.81.0's node scripts/launchpad.mjs verify passes on a clean fork. After one kit file is edited, it reports 'kit: 1 kit files differ from the manifest'. This release's own launchpad, run from a temporary detached worktree of upstream/main with the fork's main checkout as the working directory, previews the fork: '42 replaced; 11 added; 3 removed; 0 refused'. With the edit, it reports 'refused: docs/PLAYBOOK.md (locally modified ...)'. git worktree remove then removes the temporary worktree.",
    "The recovery itself holds on v0.81.0's real kit, same run. These all pass: the named stash; the fast-forward (ancestry check exit 0); harness emit in main, which leaves main clean; git worktree add; git stash apply, with no conflict and all eleven untracked records restored; bootstrap; and resume status in wo-001 (phase verified, legal next action final-review). Then the final-review dispatch passes, the update supplies the (v0.1.0) heading, the minor classification and the release block, and release prepare --local reports 'target v0.1.0 remains current'.",
    "F2. The README's recovery paragraph says the session that made the stash and the fast-forward 'runs node scripts/bootstrap.mjs, registers the ignored local-terms list there' (scripts/kit/README.client.md lines 168-169). First steps item 6 says the session that ran worktree start 'moves to that directory, registers its ignored local-terms list' (line 140). The list is a file at docs/control/local/terms.txt in the new worktree (item 4). The harness judges Write and Edit paths, cp, mkdir, rm and touch operands, and literal redirects against the session's own worktree root. It refuses a destination outside that root unless the session's role holds a containing outside-write grant (packages/skeleton/src/harness-host.ts knownWriteDestinations line 3411 and outsideWriteResponse lines 3614-3762; scripts/test-harness.mjs lines 6291 and 8380). A session given the recovery instruction has no resume phrase, so it has no role and no grant. This is an inference from the code and its tests; it was not run in a live fork session.",
    "F3. In the same simulation, wo-001's range against the fork's origin/main is one commit, 'Refresh starter to v0.82.0', which changes 59 files. The self publish pushes wo-001 and opens its pull request against main (scripts/worktree.mjs lines 1059-1067). Its sign-off rule reads origin/main..HEAD (scripts/lib/contributions.mjs lines 7-15). A refresh commit passes that rule only when it carries the exempt author identity, as the current starter's commit does (read-only); the rule was not run in the simulation. Nothing in the recovery paragraph moves the fork's origin/main."
  ],
  "rejected": [
    {
      "option": "Pass and board the findings",
      "reason": "The operator authorized a failing verdict if the plan does not hold for reasons tied to criteria 27 and 28. The documented update fails for every instance on v0.81.0, the population the D020 expansion targets, and the recovery fixture cannot observe it."
    },
    {
      "option": "Judge criterion 27 or 28 unmet",
      "reason": "Both hold as written. The fixture starts from v0.81.0's seed bytes, as criterion 27 names, and the README assigns update and recovery to the session, as criterion 28 names. The defects are in the README's procedure and in the fixture's model of an older instance."
    },
    {
      "option": "Fail on the plan's amend-order step",
      "reason": "plan amend-order refuses an order outside a planning receipt's judged horizon ('execution amendment requires an order in the current judged horizon and an authorization reason'), and the seeded WO-001 is in none. That is existing behavior, not this order's, so the operator's plan is corrected instead."
    },
    {
      "option": "Spawn a worker to reproduce the plan",
      "reason": "Every probe ran in this session. Product 07 admits a verifier's worker only for a claim the verifier cannot run itself."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D020",
    "observation": "The legacy recovery was proven with this order's runtime and v0.81.0's two seed blobs. An instance running v0.81.0's own scripts recovers the same way, but cannot run the README's documented preview of this release."
  },
  "followup": "WO-210 resume: fix. (F1) An instance exported at v0.81.0 can follow the README's procedure for taking this release without a refusal: its documented preview either runs as written, or the README names the supported form for a release whose manifest adds kit paths. One verified form: this release's launchpad, run from a temporary detached worktree of upstream/main, in the instance's own checkout. Add a fixture case that exports an instance with v0.81.0's scripts and runtime, not only its seed blobs, and drives it through that procedure and the recovery. (F2) The README assigns the local-terms list, and every other file the new wo-001 worktree needs, to the session opened in that worktree or to a named command. It never tells a session started in main to write there. (F3) The README states how the refreshed starter reaches the fork's origin/main under phrases and pull-request merges, and what the wo-001 pull request then contains. Check: npm test -- --only launchpad-planning, npm test -- --only launchpad, npm run test:docs and npm test -- --review. (Planning) The subject's own manifest reader stays a closed list, so the next kit-path addition repeats F1 for v0.82.0 instances; the planner decides whether previews admit new kit paths under the declared kit roots.",
  "reopenWhen": "A repair changes the README's update or recovery procedure, the kit manifest reader or the legacy recovery fixture; or an instance on an earlier release cannot preview or take a later one."
}
```

## WO-210-D023 — Settle repaired findings at the passing repair identity

```json
{
  "id": "WO-210-D023",
  "date": "2026-10-14",
  "dispatch": "resume: fix; completed adjacent-0003 revision 5",
  "decision": "Retain all F1–F5 fixes, the Finder metadata behavior and the bound starter-seed/recovery expansion. Complete the adjacent repair queue after all nineteen named suites pass at the repaired code identity; settle the reopened repair follow-ups and leave the explicitly nonblocking performance judgment with planning. Finish the document and review gates before recording RepairCompleted.",
  "evidence": [
    "All nineteen named preflights passed between 2026-10-14T15:52:44Z and 16:18:05Z at code identity f1004335dc84b31e7bed8e88e2fa387381eebbd0b7e20bd723670d4020392c39. The session scratch repair-preflights.json and repair-preflight-<suite>.log retain every command, exit, duration and gate result.",
    "The full target-worktree task passed in 233.87 s, release suite in 99.53 s, launchpad in 572.03 s and launchpad-planning in 129.34 s. The latter includes exact v0.81.0 template hashes, uncommitted verified-pass recovery, and preservation through preparation and final review. Only the two changed seed templates differ from v0.81.0; git diff v0.81.0 -- scripts/kit confirms the baseline boundary.",
    "Five repair workers produced twelve distinct findings after deduplication; integrated fixes and tests are recorded in repair-review.md. The original implementation reviews remain separate evidence. No worker or root published to a live remote.",
    "Publication source locks pass. The bounded repair audit reports zero changed registered evidence sources in all five families and unchanged Goal-aligned decisions SHA-256 7a48a753d0255b622593e88d32ff9ac906137f35157fbb5e52984ec81454755c.",
    "FUP-b332899ec1254d12, FUP-b46754ad55a891d6, FUP-9458f0db725731cc, FUP-00b15d92d53011b2 and FUP-a82ccc79f22fba40 are settled through the canonical register. FUP-92711a92e1d05874 is explicitly deferred to planning as D013 requires; the unrelated instance-author exemption remains the declared non-goal."
  ],
  "rationale": "NoOp after passing probes would leave the lifecycle repair unfinished. Retain the executable evidence and preservation boundaries. The nineteen individual suites took about twenty-five minutes before the complete review ran fresh at the same identity. This sequence duplicated coverage; the closing observation records the mistaken reuse expectation and the correction. The expanded suites also perform additional recovery and refusal work, so their durations are not a speed comparison against the earlier smaller suites.",
  "rejected": [
    {
      "option": "Claim completion from focused probes alone",
      "reason": "The order requires the document gate, review gate and canonical repair completion; focused probes alone do not establish those results."
    },
    {
      "option": "Change historical reports, remint registered evidence or remove expensive cases",
      "reason": "None is authorized or necessary to establish the repaired behavior."
    }
  ],
  "reopenWhen": "A required final gate fails or independent verification finds an unmet criterion in the repaired subject."
}
```

Closing observation, 2026-10-14: the document gate passed 35 results in
101,262 ms; review passed 39 suite results and 95 fresh tasks in 1,864,828 ms,
with no failures or reused tasks. Both retained code identity
`f1004335dc84b31e7bed8e88e2fa387381eebbd0b7e20bd723670d4020392c39`
and build output. Calling the preceding nineteen full-suite runs preflights
obscured their cost. The expectation that review could reuse them was wrong:
`scripts/lib/gate-reuse.mjs` admits passing evidence from the same check ID,
while `--only` records `suite:<name>`. The operator challenged the repeated
hour-long validation sequence. The correction is focused regression probes
during edits, then the required complete gate; repeat broader testing only
for new changes, failures or unresolved coverage. This repair changes no
runner behavior and preserves all executed evidence.

## WO-210-D022 — Prove prior-export seeds before session-owned recovery

```json
{
  "id": "WO-210-D022",
  "date": "2026-10-14",
  "dispatch": "resume: fix; bound operator expansion WO-210-D020",
  "decision": "Preflight starter template seeds from committed trees before updating or pushing. Admit a changed seed only when its regular-file bytes match an exported template in reachable starter history, whose manifest hash and ancestor core template agree. Handle current-manifest stale seeds and list rewritten paths. Keep ordinary kit updates and generated control/planning records unchanged. Exercise the exact v0.81.0 seed blobs with the current runtime in the existing export fixture, preserving the verified uncommitted order through actual starter refresh and session-owned fast-forward recovery.",
  "evidence": [
    "prepareKit emits eight direct template seeds plus generated instance records. The new starter-seeds helper lists only those direct copies; the CLAUDE floor comparison excludes the generated harness block. planKitUpdate already prepares their incoming bytes, so the refresh uses that existing preparation after the committed-tree preflight.",
    "A latest-manifest-only baseline cannot recognize seeds left behind by earlier kit-only updates. The starter fixture now includes a same-core-commit stale-seed case and protects committed custom bytes, executable mode, missing files, symlinks and a symlinked parent before any push. Focused execution and final gates are still pending at this decision.",
    "Historical fixture blobs are copied exactly from v0.81.0 commit 3b5e29e4d36956b680ac1339aeeca887947e7987. The source README records that this is historical seed compatibility with the current runtime, not an execution of the historical runtime. Recovery uses ordinary Git and lifecycle commands; it adds no product escape hatch and makes no hand edit to the release fields after recovery.",
    "The first focused cleanup integration passed planning publication, both metadata cases and the hook case. Two extra registry assertions used the transient start journal after successful start had consumed it; changing them to the persistent target registry corrects the test observation. The refused closes already retained their clone HEAD and worktrees."
  ],
  "rationale": "NoOp leaves the changed seeds unreachable to future forks. The overwrite trap is addressed by exact prior-export provenance and whole-plan refusal; the incomplete-history trap retains a named refusal rather than guessing; the weak-fixture trap is addressed by a verified-pass uncommitted activation and the actual refresh path. Reuse the existing export preparation instead of another build just to inspect seed bytes.",
  "rejected": [
    {
      "option": "Trust only the latest starter manifest or any arbitrary old core template",
      "reason": "The former rejects unchanged seeds left by a kit-only refresh; the latter does not prove that the starter ever exported those bytes."
    },
    {
      "option": "Add a release-preparation escape hatch that repairs old seeds automatically",
      "reason": "The requested starter update can supply the corrected release fields while ordinary recovery preserves the existing records. A new migration command is not established as necessary."
    },
    {
      "option": "Overwrite customized seeds or all generated instance records",
      "reason": "The operator requires a named refusal for differences and preservation of WO-001 control and records."
    }
  ],
  "reopenWhen": "A proven unmodified seed cannot refresh, a custom seed or mode changes, a seed-only update pushes an unrelated path, or legacy verified recovery loses records or requires a manual release-field repair."
}
```

## WO-210-D021 — Bind publication to committed grants and installed ownership

```json
{
  "id": "WO-210-D021",
  "date": "2026-10-14",
  "dispatch": "resume: fix; five-worker review; adjacent-0003 revision 4",
  "decision": "Require target planning's operator-grant registry to match its committed bytes while allowing unrelated draft documents, and use invocation-local host Git flags for its cleanliness check. Before session publication, verify the existing installed-bundle receipt, manifest and files through checkTargetHarness, then derive the installed paths. Keep shared registered harness and Git sources unchanged.",
  "evidence": [
    "The independent executable worker used actual planning commands with local Git origins and forge doubles. A configured fsmonitor ran once and publication succeeded in 2,033 ms. A disabled-monitor happy control succeeded without the marker; an invalid branch refused without forge effects. Committed grants.json containing [] plus an uncommitted valid operator grant also published in 2,140 ms, while an empty registry refused and a committed valid grant passed. The bounded planning run completed in 11,240 ms; scratch/agent5/planning-probes.log and JSONL preserve exact commands, source hashes and effects.",
    "The worker force-added the real installed .claude/settings.json into a reviewed target commit. An intact live manifest refused publication in 1,360 ms. Removing only the ignored live manifest, with the installation receipt unchanged, then published that installed file in 1,853 ms. A normal target change with an intact bundle passed in 1,833 ms. The bounded run completed in 31,671 ms; scratch/agent5/manifest-publication-probe.log and JSONL retain the evidence. Its successful probe exit asserts reproduction, not product correctness.",
    "Root's six cleanup regressions now pass in 16,878 ms at 2026-10-14T15:26:46Z after the D019 changes. The absent-target and clone-writer cases refuse before moving the clone; the target hook does not execute. New metadata assertions still need integration into the ordinary fixtures before final gates."
  ],
  "rationale": "These failures bypass explicit publication authority and installed-file boundaries. NoOp leaves those confirmed effects admitted. Comparing only the authority input avoids blocking unrelated planning drafts; existing harness validation supplies the ownership contract without inventing a second receipt format or changing edition inputs.",
  "rejected": [
    { "option": "Require the entire planning launchpad to be clean", "reason": "Only committed operator authority is needed for this boundary; unrelated draft documents can remain in progress." },
    { "option": "Trust the mutable manifest installed array", "reason": "The real installed-file probe shows that deleting this ignored file defeats the current guard while installation ownership remains." },
    { "option": "Refactor the registered harness module to expose a new ownership observer", "reason": "The existing check validates present installations; changing a registered evidence source would violate this order's no-remint boundary. Close's absent-directory ownership observation remains local and covered by its fixture." },
    { "option": "Treat same-tree target gate reuse or a later gate declaration as a new defect", "reason": "The order explicitly permits byte-identity reuse and publishes its recorded final-review snapshot. The workers found no contradictory criterion or reproduced failure for these hypotheses." }
  ],
  "reopenWhen": "Uncommitted operator authority publishes, a target-configured hook runs during the host planning check, or an absent or drifted bundle manifest permits publication of installed files."
}
```

## WO-210-D020 — Refresh unchanged starter seeds and recover the verified main activation

```json
{
  "id": "WO-210-D020",
  "date": "2026-10-14",
  "dispatch": "resume: fix; explicit operator scope expansion for starter seeds and exact fork recovery",
  "decision": "Extend WO-210 while retaining VER-001 F1–F5. Starter refresh must carry changed seed templates into the starter only when each affected starter copy matches a prior export; any other difference refuses with its path before a push. Record every rewritten seed in the refresh row. Add the operator's v0.81.0 recovery scenario: verified-pass WO-001 on main with all control and report records uncommitted, followed by starter refresh, an instance-session fast-forward and recovery into wo-001. Prove release preparation, committed surfaces and the publication surface step without manual edits while preserving the order's control and records. Make the README assign update and recovery commands to the instance's session after operator direction; the operator uses phrases and merges pull requests.",
  "evidence": [
    "The operator explicitly authorized this expansion in this repair session and required a structured decision plus npm run plan -- amend-order. Their described fork state is an operator-attested scenario to reproduce, not a claim that this session read or changed the live fork.",
    "scripts/lib/starter-refresh.mjs calls planKitUpdate/applyKitUpdate for an existing export, whose manifest excludes seeds. WO-210 changes scripts/kit/README.client.md and scripts/kit/first-order.template.md, so carrying only their template paths does not update the starter's own README and WO-001 copies.",
    "WO-215's known issue explicitly reopens when a seed template change must reach the starter's own copy (docs/work-orders/WO-215-release-close-refreshes-the-starter.md, Known issues). Its D002 left seed ownership unchanged. The operator identifies that condition as met; this repair adds only guarded updates of unchanged prior-export copies.",
    "The local v0.81.0 tag resolves to 3b5e29e4d36956b680ac1339aeeca887947e7987. The existing launchpad-planning recovery fixture uses current seeds and stops at the active phase, so it does not establish the requested legacy verified-pass case. New input reads include WO-215's design and decisions, prior seed blobs, launchpad preparation/update functions and the starter/recovery fixtures."
  ],
  "rationale": "NoOp leaves future forks with the stale activation and release inputs despite updating the kit. Avoid overwriting instance customization by requiring exact prior-export provenance, avoid shifting the work to the operator by documenting the session-owned update/recovery, and avoid a weak recovery test by preserving the uncommitted verified-pass records from the actual reported starting state.",
  "rejected": [
    { "option": "Overwrite every seed during an ordinary kit update", "reason": "The operator authorizes guarded starter refresh, and customized seed copies must refuse rather than be replaced." },
    { "option": "Test only a fresh current export or an active order", "reason": "Neither reproduces the operator's v0.81.0 verified-pass activation with uncommitted records." },
    { "option": "Ask the operator to run Git recovery commands", "reason": "The explicit workflow assigns those commands to the instance's own session after the operator's phrase." }
  ],
  "reopens": { "decisionId": "WO-215-D002", "observation": "WO-210 changes seed templates that must reach the starter's own copies, meeting the prior order's documented seed-refresh reopening condition." },
  "reopenWhen": "A changed seed fails to reach an unchanged starter copy, customized seed bytes are overwritten or published, or the legacy verified-pass recovery loses records or still needs a hand edit."
}
```

## WO-210-D019 — Use five independent workers and repair reproduced cleanup gaps

```json
{
  "id": "WO-210-D019",
  "date": "2026-10-14",
  "dispatch": "resume: fix; operator request for five subagents; adjacent-0003 revision 3",
  "decision": "Use five fresh workers in two waves for cleanup, lifecycle, all acceptance criteria, design and executable verification, with one repository writer. Extend the current repair to the six cleanup cases reproduced from their review: ignored non-regular Finder entries in the clone, an empty target metadata directory, clone writer bypass, missing-target ownership residue and target hook execution. Share a narrow metadata type check with starter refresh; protect base updates with the existing writer lock; retain absent targets with ownership residue; use the established host Git flags; validate the bundle before reading its installed paths.",
  "evidence": [
    "The operator explicitly requested five subagents to attack, verify and improve both the fix and overall changes. The host admits three workers alongside the root, so they start in two waves. Every worker was requested as gpt-6.1-sol at max with no inherited conversation. Four inspect source only; the fifth has one exclusive bounded-probe lane in synthetic repositories. No worker writes the project or dispatches a lifecycle role.",
    "The initial final-identity target-worktree preflight passed in 203.87 s and resume in 75.44 s. The remaining preflight driver was stopped after the active suite completed so worker review could run without a live gate. These are pre-extension observations, not the final gate claim.",
    "Root's bounded agent-cleanup-reproductions.mjs failed all four required-refusal assertions in 19,573 ms at 2026-10-14T15:12:32Z. Ignored clone metadata symlinks/directories, an empty target metadata directory and a clone writer reservation each allowed close exit 0, moved the clone and removed the target.",
    "Root's bounded agent-cleanup-additional.mjs failed both assertions in 9,769 ms at 2026-10-14T15:14:11Z. Removing/unregistering the target before close left its installation and exclude ownership but still reported success; a clone post-merge sentinel hook also executed during close. Both logs are retained in the repair session's scratch.",
    "The metadata cases reveal an acceptance gap beyond Git's ordinary file inventory: Git omits empty directories and ignores the clone entries. A filesystem type check limited to the exact Finder basename can cover those cases without making unrelated ignored clone material a blocker. The scan skips Git administration and never descends through symbolic links."
  ],
  "rationale": "The requested independent attacks found outcomes the prior fixtures did not establish. NoOp would retain the reproduced failures. Avoid expanding the metadata exception to other file categories, avoid bypassing writer ownership for an apparently clean checkout, and retain uncertain ownership rather than guessing teardown after a directory disappears. Source-only recommendations remain hypotheses until an executable probe establishes their effect.",
  "rejected": [
    { "option": "Treat a successful Git status as proof that every metadata entry is a regular file", "reason": "The empty-directory and ignored-clone probes show that those entries are absent from the status inventory." },
    { "option": "Remove stale-looking ownership when the target has disappeared", "reason": "Known ownership remains recovery evidence; a named refusal preserves it until the installed bundle can be restored." },
    { "option": "Let all five agents edit the worktree", "reason": "The one-writer floor remains in force; root integrates reviewed fixes and tests." }
  ],
  "reopenWhen": "Any reproduced cleanup case returns, an agent finding remains unresolved without a durable disposition, or the scoped metadata scan changes unrelated material."
}
```

## WO-210-D016 — Repair the verifier's four adjacent findings

```json
{
  "id": "WO-210-D016",
  "date": "2026-10-14",
  "dispatch": "resume: fix; VER-001 F2–F5; adjacent-0003",
  "decision": "Compare each target gate command with its own input tree and HEAD while retaining any mutation as a selection failure; name missing repository registration in every target briefing; require a conventional docs title before target planning publication; refuse target close with a missing bundle manifest while its installation receipt or shared-exclude registry member remains, naming restoration and the exact retry command.",
  "evidence": [
    "The bounded pre-repair focused run failed all four cases in 15,062 ms at 2026-10-14T14:48:17Z (repair-adjacent-before.log). The repaired run passed all four in 24,840 ms at 2026-10-14T14:49:21Z (repair-adjacent-after.log). Logs remain in the repair session's ignored scratch.",
    "The gate fixture passes an innocent command after a mutator, fails the command that restores the original bytes and the command that changes HEAD, passes the final innocent command, and still fails the selection. Command rows bind their actual input state.",
    "The missing-registration fixture exercises next, verify, final-review and fix plus their read-only briefings. Each returns the named registration diagnostic and the expected lifecycle phase without a TypeError. The planning fixture rejects feat and fix titles before publication and still publishes the valid docs title.",
    "The close fixture removes the owned bundle and tests both dry-run and publishing refusal, first with the installation receipt and then with only the exclude registry member. Both worktrees and the shared exclude and registry bytes remain intact. Restoring the installed receipt and bundle allows ordinary close and removes the exclude block."
  ],
  "rationale": "These bounded repairs share the selected order's target lifecycle and fixtures. NoOp leaves false attribution, a dispatch diagnostic failure, a mismatched planning subject and a falsely clean teardown. Avoid rule beating by testing a restoration command and registry-only ownership; avoid destructive recovery guesses by retaining the source until its installed ownership can be verified.",
  "rejected": [
    { "option": "Stop running commands after the first mutation", "reason": "The declared selection can retain useful independent command outcomes while still failing overall." },
    { "option": "Delete exclude and installation state when the manifest is missing", "reason": "The manifest is needed to verify the installed bundle; retaining it with a concrete recovery instruction is the bounded repair." },
    { "option": "Change the planning design to permit feat and fix subjects", "reason": "The docs-only publication contract already supplies a precise type and does not require widening." }
  ],
  "reopenWhen": "A command is blamed for earlier mutation, a target briefing throws for missing registration, planning publishes a non-docs subject, or close reports clean while known bundle ownership remains."
}
```

## WO-210-D018 — Validate Finder metadata on the starter-refresh route

```json
{
  "id": "WO-210-D018",
  "date": "2026-10-14",
  "dispatch": "resume: fix; D017 operator scope amendment; adjacent-0003",
  "decision": "Filter starter checkout status only for untracked, contained regular files whose exact basename is .DS_Store. Keep those files in place during preview and refresh; preserve ordinary rejection of tracked changes, unrelated untracked work and symbolic links. Use NUL-delimited status so nested paths containing spaces are handled exactly.",
  "evidence": [
    "The bounded starter_refresh fixture failed before the repair at 2026-10-14T14:54:10Z in 4,185 ms with 'Starter refresh starter-fixture: refused; recorded checkout has tracked or untracked changes'. The checkout held only root and nested regular untracked Finder files beyond its committed seed.",
    "After the repair, the same case passed at 2026-10-14T14:58:49Z in 23,541 ms. Preview left files, status, refs and HEAD unchanged; publishing close reached current with no new push and preserved both metadata files. The case also refused and retained an unrelated untracked file and a .DS_Store symlink. A tracked-edit guard was added afterward and is covered by the final release preflight.",
    "New repair inputs are scripts/lib/starter-refresh.mjs and release_case_starter_refresh in scripts/test-release.sh. D017 extends criterion 25 through the canonical order-amendment receipt. No global Git configuration or user settings were changed."
  ],
  "rationale": "The recorded checkout survives refresh, so ignoring the exact harmless status entries completes the requested behavior without deleting its metadata. Target worktree teardown separately removes disposable metadata only where Git requires that for ordinary removal, as D015's comparison demonstrates. The observed result matches the operator's requested category.",
  "rejected": [
    { "option": "Remove every untracked file before refresh", "reason": "That would erase unrelated work and exceeds the Finder-only authorization." },
    { "option": "Require an existing Git ignore rule", "reason": "The reproduced first-export checkout has no applicable ignore rule, and the user cannot keep recurring Finder files out of these checkouts." }
  ],
  "reopenWhen": "A regular Finder file blocks starter refresh, preview changes metadata bytes, or real checkout changes pass this exception."
}
```

## WO-210-D017 — Apply the operator's Finder exception to starter refresh too

```json
{
  "id": "WO-210-D017",
  "date": "2026-10-14",
  "dispatch": "resume: fix; scope expand: disposable macOS metadata at release close",
  "decision": "Carry the same operator-authorized .DS_Store exception into starter refresh's separate checkout-cleanliness check. Regular untracked Finder files at any depth do not block a preview or publishing close. Tracked changes, symbolic links and unrelated untracked files still refuse. Extend criterion 25 to this release-close route and cover it in the existing starter-refresh release fixture.",
  "evidence": [
    "The operator's 2026-10-14 scope expansion refers to Finder metadata in a target repository during the previous order's release close and authorizes deleting or ignoring it when deciding cleanliness. The exact previous error and repository were not supplied; no claim is made about that incident's precise code path.",
    "scripts/lib/starter-refresh.mjs clean() reads all porcelain status entries, and refresh checks it before remote binding and publication. Therefore an ordinary untracked .DS_Store blocks this second release-close route too. This is a source-based inference to be exercised by the release fixture.",
    "Core and kit .gitignore already exclude Finder metadata, while the starter fixture begins from an empty registered checkout. A contained regular-file exception covers a checkout before the first export as well as an existing kit without changing Git configuration."
  ],
  "rationale": "A target-close-only exception would leave the same operator-authorized class failing in starter refresh. Keep the exception in the two cleanup consumers rather than changing edition-registered shared Git helpers. NoOp leaves this observed source condition unchanged; a blanket cleanliness relaxation would hide real work.",
  "rejected": [
    { "option": "Change a user's global Git ignore configuration", "reason": "The command can implement the requested behavior without altering account or tool settings." },
    { "option": "Ignore every hidden or untracked file", "reason": "The authorization concerns Finder metadata only; other local work retains its existing protections." }
  ],
  "reopenWhen": "Finder metadata still blocks a release-close cleanliness check, or this exception admits tracked changes or non-regular entries."
}
```

## WO-210-D014 — Treat Finder metadata as disposable during target close

```json
{
  "id": "WO-210-D014",
  "date": "2026-10-14",
  "dispatch": "resume: fix; scope expand: disposable macOS metadata at release close",
  "decision": "Accept the operator's explicit scope expansion to delete or ignore .DS_Store files when judging cleanliness. Apply it to registered-target release close, including its target worktree and clone base checkout: regular untracked .DS_Store files at any depth are disposable whether Git ignores them or not. Dry runs leave them in place; publishing close may remove them before Git operations. Add criterion 25 while preserving all original criteria and VER-001's immutable findings.",
  "evidence": [
    "Operator message in this repair session on 2026-10-14 reports that the previous order's release close complained about Finder metadata in the target repository and expressly authorizes deleting or ignoring those files because they recur without operator control. This is operator-attested; the previous close's raw output was not supplied.",
    "scripts/lib/paths.mjs disposableBasename already recognizes .DS_Store, and core and kit .gitignore files already ignore it. scripts/lib/target-worktree-close.mjs instead calls ensureClean and treats every ignored non-bundle path as a blocker, so the target route omits the existing disposable-metadata policy.",
    "VER-001 F1 and WO-210-D012 require the ignored-material remedy to exclude bundle-owned paths and their ancestors. The same target-close fixture and checks cover the added metadata exception."
  ],
  "rationale": "Avoid recurring operator cleanup while retaining protection for actual local work. Rule beating would admit the ignored case but still refuse a non-ignored Finder file or leave Git worktree removal blocked; exercise both forms through the public close command. Avoid second-order data loss by restricting the exception to regular untracked files with the exact basename and never following symlinks. NoOp leaves the operator's reported close blocker in place.",
  "rejected": [
    { "option": "Ignore all hidden files or all ignored target material", "reason": "That would discard settings, dependencies and other local work outside the operator's metadata authorization." },
    { "option": "Require the operator to maintain ignore rules or remove metadata manually", "reason": "The explicit direction requires close to handle recurring Finder files itself." },
    { "option": "Change shared Git or evidence identity helpers", "reason": "The reported problem is target release close; its local checks can handle the exception without changing edition-registered behavior or unrelated gate identities." }
  ],
  "reopens": { "decisionId": "WO-072-D003", "observation": "The operator explicitly authorizes disposable Finder metadata as a narrow exception to preserving every unexpected ignored target file." },
  "reopenWhen": "A regular untracked .DS_Store still blocks target close, or cleanup removes tracked or non-metadata material under this exception."
}
```

## WO-210-D001 — Observe the instance release failures before product changes

```json
{
  "id": "WO-210-D001",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Keep the one-export probe as the baseline and repair only the kit-specific missing input; retain validation of declared legal pins and all carried license/publication controls.",
  "evidence": [
    "Before any product change, the bounded npm test -- --only launchpad-planning passed with a 44,398 ms task, 44,768 ms gate. Passing stdout is discarded by the runner, so a bounded direct node --test rerun retained the observation output (42,307 ms wrapper); no product change intervened.",
    "baseline-release-probe.json holds every non-PASS line. The local and committed surface checks and both license checks failed only on the absent docs/LEGAL.md pins. This is a core-only input and is repaired by reporting those pins unavailable in a kit. The local tag-observation line is order-state information, retained.",
    "The probe supplied the missing heading version, minor classification and README block before prepare; these are unseeded instance surfaces, addressed by the planned seed edits. Prepare passed. Its created PR stub, absent session meter, local tag snapshot and unavailable reader profile are informational state/core-input diagnostics, not failed release checks; they remain explicitly reported.",
    "The user is exercising the first order in their personal starter fork. Their later seven-item issue report expands this order's scope; WO-210-D003 records that input separately from this baseline."
  ],
  "rationale": "NoOp leaves all four observed checks failing. Avoid rule beating by retaining pin validation whenever the file is declared and by testing symlinks and non-kit roots; avoid shifting setup work to the operator by repairing the seeds; avoid escalation by extending the current release and test paths.",
  "rejected": [
    {
      "option": "Seed core legal history or skip all kit license rules",
      "reason": "The instance owns its legal record, while the carried license bytes and publication guards still need their existing checks."
    }
  ],
  "reopenWhen": "A configured exported instance still fails on a core-only release input, or a declared malformed input is accepted."
}
```

## WO-210-D002 — Carry the release schema and compose the instance goal standard

```json
{
  "id": "WO-210-D002",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Carry the schema-only release manifest and use compiled kernel declarations in an instance; preserve core's goal subject and compose an instance's goal standard from the marked shared rules and its own purpose.",
  "evidence": [
    "Release close's builder reads the resolved releases/tag-manifest.template.json (now carried); package.json, packages/*/package.json and package-lock.json (carried/generated); packages/kernel/src/types.ts in core or dist/src/types.d.ts in a kit (compiled declarations carried); packages/kernel/dist/src/index.js and its imports (carried compiled runtime). The npm version, OS and Git commit/tree/tag data are local observations, not omitted core documents.",
    "The builder, releaseEdition and tagMessage read the instance's resolved control segments and legacy log, referenced work orders, and final-review RELEASE-NOTES.md when required by that history. These are instance-owned. Review artifact paths enumerate the instance's verifications and finalReviews directories. Empty directories and absent legacy notes use their existing fallback; no core report is imported. The release evidence lookup reads the instance's review event and local gate evidence. Publication also reads the instance's remote configuration and any existing annotated tag; a forge is not required by previewReleaseManifest. The release-note parser and template shape remain unchanged.",
    "Instance goalStandard is the Goal-aligned decisions heading, followed in source order by each verbatim dotln-goal-rules block, then the sole nonempty dotln-purpose block at the resolved product/purpose.md path, or its named unavailable line. Newlines between pieces separate them; block contents are not interpreted. Missing, unbalanced or malformed rule markers and invalid or symlinked purpose files refuse. Core retains the complete original section.",
    "The target-order surface changes passed the release suite (113,466 ms task) and target-worktree suite (38,537 ms task)."
  ],
  "rationale": "NoOp leaves a release-close source read unavailable and imports core's purpose into the instance. Carrying core product history or synthesizing a purpose would invent authority. The schema and compiled declaration are already defined inputs; optional instance records retain their validation.",
  "rejected": [
    {
      "option": "Copy kernel TypeScript source or silently omit schema compatibility",
      "reason": "The kit already carries declarations and runtime constants; its manifest must describe those actual carried bytes."
    }
  ],
  "reopenWhen": "The manifest preview or complete instance fixture observes another unavailable core-only read, or a historical core subject hash changes."
}
```

## WO-210-D003 — Integrate the operator's first-order findings

```json
{
  "id": "WO-210-D003",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Accept the operator's explicit scope expansion: give the seeded order the ordinary wo-001 worktree path and preserve already-started main work through named recovery; repair effort discovery, export closure, upstream pointers, lineage initialization and readable follow-up titles. Document host access without changing sandbox settings or registered host-lock runtime.",
  "evidence": [
    "The operator supplied a seven-item report from their personal Enterprise Starter fork at kit v0.81.0, citing its WO-001-D004 through D008 and discovery record. Those fork files were not independently read; the supplied observations are operator-attested. The local implementation confirms the main/worktree conflict, effort flag mismatch, excluded runner-fixtures dependencies, incomplete upstream pointer enumeration, missing initial lineage index and 200-character title slicing.",
    "The revised one-export launchpad-planning fixture starts WO-001 through worktree start and passes release prepare, local and committed release surfaces, and both license checks from the seeds alone: 45,511 ms task, 45,760 ms gate. No fixture heading, classification or README repair is needed.",
    "The operator copied their local Claude settings into the fork to disable its sandbox. They no longer have the original stderr. After the change, the confinement check reported inForce: false and the lock probe acquired and released twice. This supports the reported successful checks after the change; it does not independently identify the original failing operation or prove its cause. No local settings are copied, changed or committed by this work.",
    "The first launchpad suite rerun found one README selection mismatch: release-surfaces and license-surfaces belong to the kit document selection, not its plain or review selection. A bounded list probe established the exact selections and the README was corrected. The subsequent full launchpad suite exposed a new top-level docs-check import requiring Prettier in install-free preview and sibling-refresh paths; moving that import into prepareKit repaired the dependency boundary. Its 15-case targeted rerun passed in 110,544 ms. After the later configuration-fixture repairs recorded in D011, the complete launchpad suite passed in 494,150 ms gate / 495,521 ms wrapper, including all three carried selections and update preservation.",
    "The one-export recovery fixture passed in 48,250 ms task / 48,540 ms gate. It preserves the main activation's control bytes, tracked changes, untracked evidence, ignored intake and named stash while preparing the recovered wo-001 worktree. Discovery flag/value, title-boundary and the initial lock-diagnostic probes passed four cases in 906 ms. The optional diagnostic experiment was later withdrawn: host-resources.mjs and host-lock.c are registered common/feedback evidence inputs, so changing them would invalidate editions and violate this order’s no-remint boundary. With the original stderr unavailable, documented access requirements satisfy the requested sandbox guidance without an unsupported diagnosis. The host files and their test are byte-identical to the baseline."
  ],
  "rationale": "The worktree path preserves the release and review authority checks. Named stash recovery preserves both tracked and untracked work and retains the recovery ref. Excluding the three core-only runner-fixtures entry points preserves the declared suite boundary without exporting an unrelated corpus. Generated lineage output derives from the instance's own seed ledger. Missing effort values remain unknown rather than inferred from a different harness.",
  "rejected": [
    {
      "option": "Allow the first order to publish main or automatically disable an operator's sandbox",
      "reason": "Neither is necessary to make the documented lifecycle work; main publication would bypass the selected branch authority, and the sandbox's original failure was not captured."
    }
  ],
  "reopenWhen": "A clean exported instance still requires manual seed repair, the named recovery loses work, or a captured sandbox failure shows that the access guidance or diagnostic is incomplete."
}
```

## WO-210-D004 — Keep runtime identifiers in control records and publish target references

```json
{
  "id": "WO-210-D004",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Use the frozen runtimeIdentifierForms list and targetReadinessEvidence table for outward text, while retaining internal readiness values and event evidence references.",
  "evidence": [
    "runtimeIdentifierForms contains source-event:, baseline-event:, review-event:, verification:, contract:, delivery-preparation# and evt_<digits>. The first five require an immediately following identifier character; checks use normalized Unicode with source spans. Ordinary prose labels remain valid.",
    "targetReadinessEvidence rows are: source-revision: Source revision matched head commit {head}.; contract: Contract section.; ambiguity: No unresolved material ambiguity for commit {head}.; baseline: Baseline reproduced or walked at commit {base} before implementation.; repo-native: Repository conventions independently reviewed at commit {head}.; scope: Changed paths checked against declared scope at commit {head}.; checks: Applicable tests, build and lint passed for commit {head}.; live-behavior: Passing behavior evidence for commit {head}.; visual: Visual claims inspected for commit {head}.; acceptance: Acceptance section; each criterion has passing evidence for commit {head}.; independent: Independent verification and review of commit {head}.; final-diff: Final diff from {base} to {head} reviewed.; grounded-body: Contract, Acceptance and Change sections bound to commit {head}.; monitoring: Monitoring owner and stop policies recorded for commit {head}.",
    "targetNativeReference maps commit ids, contained file paths qualified by the head commit, acceptance criterion numbers and known body sections; unknown references are counted and omitted. A disposition reply falls back to its head commit if no reference maps. PullRequestThreadDisposed retains the judgment's original references; deliverableReady retains its original rows. The extracted targetChangeSection preserves the pinned episode block.",
    "Bounded outward-lint, github-body and target-publish suites passed: tasks 550 ms, 200 ms and 102,250 ms respectively. The target-publish rerun also checks malformed publication arguments before main-worktree lookup."
  ],
  "rationale": "NoOp leaks runtime labels into target-facing artifacts. Rewriting internal receipts would corrupt replay evidence. The fixed table changes presentation alone and never publishes command text that may contain host paths.",
  "rejected": [{ "option": "Render arbitrary evidence strings after removing a few prefixes", "reason": "Unknown forms would still leak control vocabulary or machine paths and would imply evidence without a known mapping." }],
  "reopenWhen": "A target-facing artifact still carries a runtime identifier, or a new native reference requires an explicit mapping."
}
```

## WO-210-D005 — Bind target checks, review and records to committed bytes

```json
{
  "id": "WO-210-D005",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Require a clean committed target before a passing final review; bind its declared review selection and move reviewed records in one subsequent records-only commit before publication.",
  "evidence": [
    "repositories.<id>.gate declares named argv/timeoutMs commands and plain/review selections. documentationRoot defaults to docs and uses the launchpad document layout. Unlike worktreeParent, it refuses .. because records must remain inside the target. New activations record the declared documentationRoot so the pure fold can reject a records event that changes it; older activations remain readable. Creation and publication also check the current registration.",
    "The bounded wrapper accepts cwd and timeoutMs while retaining launchpad memory budgets. Target gate command rows and a selection row carry repositoryId, treeHash, commit, selection, names, execution outcome, duration and evidence reference. Output goes under the configured ignored check-output lane. Selection success requires unchanged tree and HEAD. Target claims never substitute launchpad npm test rows; document claims retain the inline document gate.",
    "FinalReviewCompleted.targetSubject has exactly repositoryId, branch, baseCommit and commit. targetGate has exactly repositoryId, commit, treeHash, selection, names, durationMs, evidenceRef and recordedAt. A clean commit with the tested tree may reuse an earlier review run at those bytes; a later failed run defeats an older pass. The outward gate section names every passing command and aggregate duration; no per-command times are invented from the aggregate event.",
    "TargetRecordsCommitted names the repository, branch, reviewed parent, new commit, root and each order/decisions/verification/final-review path and SHA-256. Report input hashes use the existing sha256: convention; record blob hashes are raw SHA-256 hex. All source, destination and local-term refusals precede writes. Identical pre-existing regular documents are allowed; publication permits unchanged recorded blobs but rejects every changed path outside the recorded set, deletions, renames and mode changes. The order stays as activation authority; decisions and reports leave only after the event appends.",
    "The session publication reads committed control and a committed contained regular body. It requires the records commit's single reviewed parent and exact recorded blobs, an admitted operator grant naming both effects in effects and operations, the registered profile, a single GitHub push URL, and complete outward/body checks. It reuses the isolated push lane and records PullRequestOpened under main's ignored target-publications/WO-NNN. The records publication proves equal launchpad code identities at HEAD and merge base or requires the reviewer gate; it carries no target release notes.",
    "The two-route target review probe passed in 8,328 ms, including missing/stale/failed gate and clean-commit refusals. Configuration-root passed in 5,250 ms task / 6,190 ms gate. Three focused claim/identity/bounded-wrapper tests passed in 1,489 ms. The records and publication probe passed in 15,906 ms before closeout was added. The target gate failure/timeout/mutation probe passed; full-suite reruns remain required after subsequent changes."
  ],
  "rationale": "NoOp leaves target orders depending on unrelated launchpad tests and offers no published reviewed target commit. Avoid substituting status assertions for measured target bytes; avoid copying private terms or host command paths into public text. Reuse the existing kernel authorization and host push boundary.",
  "rejected": [{ "option": "Publish whichever target HEAD happens to exist after review", "reason": "That would allow unreviewed source changes. Only the validated records commit may follow the reviewed commit." }],
  "reopenWhen": "A changed target can publish without a new review, or records/gate evidence cannot be traced to their tested and reviewed bytes."
}
```

## WO-210-D006 — Complete target closeout and planning publication in the existing lanes

```json
{
  "id": "WO-210-D006",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Let release close fetch and fast-forward the target clone's base, list foreign ignored directories once, and publish target planning through the same authorized host lane.",
  "evidence": [
    "Close first refuses a dirty base checkout, fetches objects with an empty refmap, and proves fast-forwardability before changing refs. Dry-run updates only the remote-tracking observation. Ignored material is listed with --directory after filtering bundle-owned files, with the exact releaseCloseCommand remedy. A target that has only bundle-owned ignored files remains disposable under the existing checks.",
    "The extended local-forge route merged only on the forge, then verified dry-run left the clone base unchanged, a deps/ refusal retained both worktrees and the bundle, and a publishing retry fast-forwarded the clone and removed both branches/worktrees without tags. Together with the original close case it passed in a 31,788 ms bounded probe.",
    "That probe exposed the unchanged gate store's canonical checks.json as other ignored material under a relocated control root. The worktree cleanup now admits only that derived index and addressed check-history files, using checksPath rather than a document-root literal. Arbitrary neighboring files retain the existing refusal; paths.mjs and gate-evidence.mjs remain unchanged. Target command output uses the configured control root.",
    "Target planning accepts only regular files in planning/ and product/ under the registered documentation root, checks profile/grant and outward artifacts before the read-only fetch, proves the specified base against the fetched branch, then uses a temporary target worktree and the shared publication lock/push/PR/log lane. Local refusals precede remote access; ancestry necessarily uses the required read-only fetch, and every refusal precedes remote mutation. A publication failure preserves the temporary worktree with its path; success removes it and prints repository/commit/path links. Its synthetic forge test passed after the fixture included the real plan command import closure."
  ],
  "rationale": "NoOp requires the operator to update a clone manually and leaves planning records in the wrong repository. The fetch preflight avoids changing clone refs on a known divergence or dirty base. Reusing publication code avoids a second authorization policy.",
  "rejected": [{ "option": "Treat every file under the old default control lane as disposable", "reason": "Only the known derived gate cache is justified; unknown ignored material must remain protected." }],
  "reopenWhen": "A failed base preflight changes clone refs, close loses ignored material, or target planning publishes a path outside the declared document segments."
}
```

## WO-210-D007

```json
{
  "id": "WO-210-D007",
  "date": "2026-10-14",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.82.0, the next minor above the observed release baseline v0.81.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.81.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-210-instance-orders-reach-release-close.md"
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

## WO-210-D008 — Export evidence and stable follow-up history

```json
{
  "id": "WO-210-D008",
  "date": "2026-10-14",
  "dispatch": "resume: next; scope expand:",
  "decision": "Keep historical follow-up revisions and dispositions stable across a display-only title change; record the complete exported-instance route and retain the explicitly excluded contribution-identity follow-up.",
  "evidence": [
    "The first register sync with readable title excerpts would append 512 revisions, 511 changing only title presentation. The alternate comparison uses the full source hash and other source fields, preserving immutable old titles and current dispositions; substantive changes still append a revision with the readable title. Its legacy-title/deferred-status/substantive-change fixture passed in 306 ms. The unfiled 511 display-only projections from this session were removed before resync; committed history and dispositions were unchanged.",
    "After correction of fixture-only schema assertions and synthetic sign-off identity, the complete one-export launchpad-planning suite passed in 98,470 ms gate / 99,749 ms bounded wrapper. It exercises seed preparation, named main recovery, license and manifest reads, purpose/marker refusals, target gate and final-review bindings, the records commit, both publications, moved-record refusals, origin-only target merge, close and index links. Its growth beyond twice the historical 33,150 ms is the added lifecycle/publication drives and repeated license surface checks, retained rather than dropped.",
    "The target publication/refusal, records-integrity and gate mutation probes passed four cases in 68,629 ms. They check dirty inputs, missing bindings, profiles/grants, URLs, body provenance and outward text; record parent/path/mode/blob failures; dirty/divergent/fetch-failed clone bases; and ignored-directory retention. Later cache-neighbor and unchecked-out-base assertions passed in the full target-worktree preflight: 172,590 ms gate / 174,020 ms wrapper.",
    "The export found an actual generated-body defect: the launchpad identity proof had no blank line before its closing marker. The proof now passes assertGitHubBodyProfile, checked in 320 ms. The failed export was 92,270 ms; the repaired complete run is the successful observation above.",
    "All five registered evidence source families share host-resources.mjs and host-lock.c; the separate feedback subject lists both too. The optional lock diagnostic experiment was removed, leaving these files and their test byte-identical to HEAD. The changed-file/source audit intersects evidence-sources only at config.mjs, which is explicitly excluded from every edition; the feedback source list has no changed path. No remint or live feedback episode is owed.",
    "The fixture operator has its own synthetic name and matching Signed-off-by trailers; the export publication accepted those commits. scripts/lib/contributions.mjs still exempts only its existing operatorAuthor constant. Configurable instance exemption identity remains FUP-06de60fa5d19fe5a, explicitly excluded by this order; the test does not claim that this missing configuration now exists."
  ],
  "rationale": "NoOp on titles leaves new excerpts cut mid-word; reclassifying hundreds of settled records for display alone would add unrelated planning work. NoOp on the generated publication body blocks the observed route. No package source or dependency changed, so the additive application release is v0.82.0 and component versions stay fixed.",
  "rejected": [
    {
      "option": "Rewrite historical titles or silently change their dispositions",
      "reason": "Those are retained history; the complete source hash already detects meaningful revision changes."
    }
  ],
  "reopens": {
    "decisionId": "WO-074-D010",
    "observation": "The exported instance published under a distinct synthetic author with matching DCO sign-offs, while contributions.mjs still retains its core operatorAuthor exemption. Configuring an instance-specific exemption remains the named non-goal."
  },
  "reopenWhen": "A display-only change reopens an item, an instance with matching DCO sign-offs fails publication, or the operator authorizes an instance-specific exemption configuration."
}
```

## WO-210-D009 — A target order prepares without assigning an instance release

```json
{
  "id": "WO-210-D009",
  "date": "2026-10-14",
  "dispatch": "resume: next; adjacent-0001",
  "decision": "For a selected open target order, release prepare validates its worktree and versionless authority and returns no-release without changing files; retain the existing self-order preparation path.",
  "evidence": [
    "The complete-input baseline fixture failed with the strict-version requirement in 2,025 ms. An earlier fixture omitted README.md and therefore reached a different guard; that setup was corrected before drawing the baseline conclusion.",
    "The repaired focused fixture passed in 2,036 ms and later assertions retain the wrong-branch and closed-phase refusals. The full target-worktree and release suites then passed in 146,620 ms and 112,320 ms; adjacent-0001 was completed against those checks.",
    "The full target suite exposed a separate closeout issue when the clone HEAD is detached: containment against the declared base passed, but branch -d compared the old detached HEAD and refused. Close now removes the branch only after its explicit base-containment proof. The closeout and preparation-retry cases passed together in 57,822 ms; the retry failure itself was an erroneous test-variable replacement, corrected in place."
  ],
  "rationale": "NoOp leaves the executor unable to finish a versionless target order. Assigning a self release would contradict the target no-release contract. A validated read-only result preserves that contract and the phase/branch guards.",
  "rejected": [
    {
      "option": "Skip release preparation in every role or assign a synthetic target version",
      "reason": "The ordinary command can express the no-release result without bypassing its selection checks or inventing a release."
    }
  ],
  "reopenWhen": "A target preparation changes a file or assigns a version, or self-order preparation changes behavior."
}
```

## WO-210-D010 — Dispose the five delivered follow-ups and retain the explicit identity non-goal

```json
{
  "id": "WO-210-D010",
  "date": "2026-10-14",
  "dispatch": "resume: next",
  "decision": "Settle the five follow-ups named in criterion 23 on their executable evidence; defer the distinct instance-author exemption configuration named by WO-074-D010.",
  "evidence": [
    "FUP-a065bc5b99e40660: the complete export route passes local/committed release checks with optional legal pins; FUP-3cceac0fff2dba94: the same fixture checks the kit rule blocks and declared or unavailable purpose.",
    "FUP-a272d577fd351b43: the outward-lint, github-body and target-publish suites pass with native references and retained internal evidence; FUP-00b15d92d53011b2: the close fixture lists deps/ once, preserves ignored content, prints the exact remedy and closes on retry.",
    "FUP-a5c6ac8cb40bd52a: target-publish usage cases pass before main-worktree lookup. These outcomes are implementation evidence; independent verification and final review remain separate roles.",
    "FUP-06de60fa5d19fe5a is not settled: the export accepts a distinct author with matching sign-offs, but contributions.mjs still uses its core exemption constant. D008 reopens the original decision and the order explicitly excludes configuring that exemption."
  ],
  "rationale": "NoOp leaves delivered follow-ups allocated and falsely implies the excluded identity configuration was supplied. The register must distinguish the tested behavior from the remaining configuration gap.",
  "rejected": [
    {
      "option": "Mark the author-identity item settled because a synthetic author published",
      "reason": "Matching DCO sign-offs exercise the existing rule, not an instance-specific exemption."
    }
  ],
  "reopenWhen": "Any settled behavior regresses in an instance, or the operator authorizes instance-specific exemption configuration."
}
```

## WO-210-D011 — Resolve executor self-review findings

```json
{
  "id": "WO-210-D011",
  "date": "2026-10-14",
  "dispatch": "resume: next; executor self-review",
  "decision": "Repair all four worker findings, preserve exact retry authority through ignored receipts, and bind target gate evidence to the current command definitions.",
  "evidence": [
    "The required two fresh read-only workers received only the order and diff. Criteria review found one source-confirmed self-claim regression and one literal-path concern; design review found two confirmed recovery gaps. Their reports are self-review-criteria.md and self-review-design.md. Explicit session spawn count is two, with no descendants against cap 20.",
    "Target records now persist their parent/root/record hashes before writes, validate an interrupted records-only child on retry, and finish hash-verified removals after an already-recorded event. Effective corrected report paths are honored. Changed sources or unrelated target changes refuse without removing them.",
    "Target planning keeps an input-bound pending receipt, verifies the existing one-parent document commit, and retries publication/cleanup through the original publication log. Temporary paths use the physical host spelling; the first retry test exposed the macOS /var versus /private/var alias. That correction passed the planning fixture in 7,805 ms. Cleanup only removes an empty scratch directory, preserving extra material.",
    "The focused self/target gate-claim tests passed in 682 ms. They retain unchanged self parsing and refuse reuse after argv changes under the same target command name. The event targetGate retains its exact eight-key shape; only ignored command/selection rows gain the definition hash.",
    "The expanded publication, records-recovery and planning-retry probes passed three cases in 80,084 ms. They additionally check literal-path roots, changed source retention, changed planning input refusal, an unchanged reviewed subject, a runtime identifier in a commit, an installed bundle path and a resolved forge identity mismatch. The final target-worktree preflight, including cleanup interruption after publication, passed in 172,590 ms gate / 174,020 ms wrapper. The larger target suite retains the additional refusal and interruption cases rather than dropping them to match its earlier duration.",
    "The runner's dependency-coverage guard found the added fixture inputs missing from machinerySources. Declaring their actual direct imports and literal source paths repaired the selection boundary; the focused guard passed in 228 ms and the full runner-fixtures suite in 90,700 ms gate / 91,970 ms wrapper.",
    "The next complete export run failed two configuration-root cases. A focused root run reproduced both in 7,572 ms wrapper: the lifecycle fixture omitted the new ignored command-definition hash, and the literal-root scanner mistook the outward docs branch type for a document root. The fixture now supplies the actual definition hash and branch validation splits the type and slug explicitly, preserving the grammar. The focused suite passed in 6,160 ms gate / 7,397 ms wrapper. Export assertion failures now retain both stdout and stderr so nested case diagnostics remain visible.",
    "The final complete export lifecycle fixture passed in 99,770 ms gate / 101,092 ms wrapper; plan-refutation passed in 55,220 ms, plan-refutation-current in 3,290 ms, plan in 3,530 ms, index in 2,210 ms, release-surfaces in 2,820 ms and license-surfaces in 1,710 ms. The configured-root fix leaves the registered evidence-source intersections empty and the protected Goal-aligned decisions section byte-identical to HEAD."
  ],
  "rationale": "NoOp would leave retries stranded after side effects and change self-order behavior. Receipts reuse the existing contained, ignored local-map persistence and published event log; they do not grant authority or accept changed bytes. Literal pathspecs preserve the already-declared path grammar. A target command change must invalidate its old result even when the target tree and command name stay the same.",
  "rejected": [
    {
      "option": "Delete preserved branches or source files to make retries appear clean",
      "reason": "That loses recoverable work and breaks the existing preservation rule."
    },
    {
      "option": "Reuse an arbitrary child commit after interruption",
      "reason": "Only the saved operation and the exact reviewed-parent/record-blob validation establish the intended child."
    }
  ],
  "reopenWhen": "A retry changes the bound inputs, repeats a recorded remote effect, loses material, or a self order newly demands a target gate."
}
```

## WO-210-D012 — Verification: fail; the target close's ignored-material listing names a bundle directory, a behavior main had right

```json
{
  "id": "WO-210-D012",
  "date": "2026-10-14",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Fail VER-001. At code identity 482f71bd8b0cab2e17703b80c90f970796c9ab22eff155a76b1794662e327433 criteria 1 to 24 are met as written. F1 (blocking): the change breaks a behavior main had, and a probe on both trees shows it. A registered target holds an ignored file that the bundle does not own inside a directory that also holds bundle-owned files, here .claude/settings.local.json. Release close then refuses naming '.claude/, .claude/settings.local.json'. Its new remedy says to move or remove the listed paths, and that covers the bundle's hooks, settings and manifest. Main named only .claude/settings.local.json. F2 to F5 are boarded follow-ups in the declared surfaces. F2: a target gate command that runs after a mutating command is recorded as failed and as having changed the target, although it exited 0 and changed nothing. F3: a target order's briefing throws a TypeError when the order's repository is no longer registered. By the code, verify and final-review append their transition before they build the briefing. F4: the target planning commit takes the title's type, not the Design's docs type. F5 (also on main): with the bundle manifest gone, close reports clean but keeps the bundle's exclude block and registry member.",
  "evidence": [
    "F1, subject, under harness bounded at 2026-10-14T14:03:55Z and 14:05:26Z. The fixture is adapted from scripts/test-target-worktree.mjs. The target's committed .gitignore ignores .claude/settings.local.json. The order closes through target-records, the launchpad records branch is merged on main, and the forge merge happens on the target origin only. With .claude/settings.local.json present in the target worktree, release close WO-999 --dry-run exits 1 with 'target has ignored material; source retained: .claude/, .claude/settings.local.json. Move or remove the listed paths, then rerun <node> <launchpad>/scripts/release.mjs close WO-999 --dry-run'. In this fixture .claude/ holds six bundle-owned files: four hooks, settings.json and target-worker-manifest.json.",
    "F1, following that remedy, same run. With .claude/ removed, the next --publish refuses naming CLAUDE.local.md, a bundle-owned file the close no longer recognizes because its manifest went with .claude/. With CLAUDE.local.md removed, close prints 'Cleanup: clean' and removes both worktrees and both branches. The clone's shared .git/info/exclude still holds the '# target-worker <key>' block with every bundle path. The launchpad main's docs/control/local/harness/excludes/<key>.json still holds the member.",
    "F1, base, under harness bounded at 2026-10-14T14:05:05Z. The same fixture and input run with HEAD's scripts, extracted by git archive. release close WO-999 --dry-run refuses with 'target has ignored material; source retained: .claude/settings.local.json'. With that file removed, --publish closes and no target-worker line remains in the clone's .git/info/exclude. The subject also closes cleanly, and removes the exclude block, when only the foreign file is removed.",
    "F1 cause: scripts/lib/target-worktree-close.mjs lines 158-176. The bundle excludes its paths file by file. git ls-files --others --ignored --exclude-standard --directory then emits .claude/ as well as each ignored file under it. A scratch repository shows the same. The filter keeps any directory entry with at least one foreign file under it, even when bundle-owned files are under it too. It also keeps a file entry that a kept ancestor already covers. Criterion 12's deps/ case is unaffected and passes: deps/ holds no bundle path.",
    "F2, under harness bounded at 2026-10-14T14:02:17Z. The review selection is [a-innocent, b-ignored, f-noisy, c-mutate, d-innocent]. The selection fails, which is correct, and c-mutate's row fails, which is correct. d-innocent runs 'process.exit(0)', yet its row records exitCode 1 and the runner prints 'FAIL target target d-innocent (39 ms): command changed target bytes or HEAD'. scripts/lib/target-gate.mjs lines 102-113 compare every command's after-state with the tree and HEAD read before the first command. The executor's case runs 'untracked' before 'mutate', so it cannot tell the two attributions apart.",
    "F3, under harness bounded at 2026-10-14T14:02:37Z. WO-999's repository is removed from the order launchpad's dotln.config.json, and another repository is kept. npm run resume -- briefing exits 1 with 'Cannot read properties of undefined (reading 'documentationRoot')'. resume status still renders. targetBriefing (scripts/resume.mjs lines 1099-1106) reads repositories[state.repositoryId] without a check. By the code, verify (lines 1463-1470) and final-review (lines 1598-1606) append their transition before they build the briefing; fix (line 1553) and next build it first, so they refuse with nothing appended. Only briefing was run in this state.",
    "F4, under harness bounded at 2026-10-14T14:06:38Z. npm run plan -- target-publish target --base <commit> --from <dir> --branch docs/target-plan --title 'feat: record target plan' --body-file <body> pushes a commit whose subject is 'feat: record target plan' and opens one pull request. scripts/lib/target-planning.mjs line 135 sets the commit message to the title. The Design says 'commits them with a conventional docs: subject'. Criterion 21 does not name the type, and the subject passes the outward lint.",
    "F5: scripts/lib/target-worktree-close.mjs lines 147-157 and 183-184 build the owned set and run removeTargetHarness only while .claude/target-worker-manifest.json exists. HEAD's closeTargetWorktree has the same condition. My F1 probe reaches it by following the printed remedy."
  ],
  "rejected": [
    {
      "option": "Judge criterion 12 unmet",
      "reason": "Criterion 12 names its input: a committed .gitignore ignoring deps/ and files under deps/pkg/. With that input the refusal lists deps/ once, names the remedy and the exact command, and the retry closes."
    },
    {
      "option": "Route F1 as a follow-up",
      "reason": "Main listed only the foreign file. The subject also lists a directory of bundle-owned files and tells the reader to move or remove it. Followed, that leaves residue in the shared clone and a close recorded as clean. From 2026-10-13 the operator makes no repository change by hand (the order's Observed gap), so a role, not the operator, would act on this remedy at the next target close (inference from that direction). Product 07 §Verification review and attack routes a broken main behavior that a probe shows as blocking."
    },
    {
      "option": "Fail VER-001 on F2, F3 or F4",
      "reason": "The target gate is new, and criterion 16 names the mutating command, which holds. F3 needs a registration removed from a misconfigured instance, where the subject refuses every target step by name anyway; main printed briefings there only because it never read the registration. F4 breaks no criterion."
    },
    {
      "option": "Spawn a worker to reproduce F1",
      "reason": "Every probe ran in this session. Product 07 admits a verifier's worker only for a named claim the verifier cannot run itself."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D006",
    "observation": "D006 says ignored material is listed with --directory after bundle-owned files are filtered out. When a foreign ignored file sits in a directory that also holds bundle-owned files, the listing names that directory as well as the file, and its remedy covers the bundle."
  },
  "followup": "WO-210 resume: fix. (F1) In scripts/lib/target-worktree-close.mjs list only ignored material the bundle does not own. List a directory entry only when no bundle-owned path lies under it; otherwise list its foreign files one by one. Never list an entry together with one of its ancestors. Keep the deps/ case as one entry, and keep the remedy and the exact close command. Add a scripts/test-target-worktree.mjs case: an ignored foreign file inside .claude/ is listed alone; once it is removed, close removes both worktrees and the clone's exclude block. Check: npm test -- --only target-worktree, npm test -- --review and npm run test:docs. (F2, boarded) In scripts/lib/target-gate.mjs, judge each command against the tree and HEAD read just before it, so a mutation is attributed only to the command after which they first differ. Any change still fails the selection. (F3, boarded) targetBriefing names a missing registration, or uses the activation's recorded documentationRoot, instead of throwing. No dispatch throws after it appends its transition. (F4, boarded) Refuse a target planning title whose type is not docs before any remote call, or record the Design change in the decisions. (F5, boarded) When the bundle manifest is gone but the launchpad's exclude registry still names the target, close removes the exclude block and the registry member, or names the remedy, before it records clean. FUP-00b15d92d53011b2's settled disposition rests on this listing, and the final review disposes the row.",
  "reopenWhen": "A repair changes closeTargetWorktree's listing or bundle removal, runTargetGate's attribution, targetBriefing or the planning commit subject; or a target close again names a path that holds bundle-owned files."
}
```

## WO-210-D013 — Verification: the target suites' growth, recorded for the planning receipt's criterion:24 condition

```json
{
  "id": "WO-210-D013",
  "date": "2026-10-14",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Record the figures behind the reopening condition of planning receipt 2026-10-13-planning-4f74762e1dd466b6-045's criterion:24 known issue for WO-210. That condition reads: launchpad-planning or target-worktree grows by a material share of the full gate. The receipt does not define 'material', so the planner judges whether the condition has occurred. The order's own watch holds: launchpad-planning runs above twice WO-202's 33.15 s, and D008 records the cause, the added release, records and publication drives, without dropping a case. Route: planning, not blocking.",
  "evidence": [
    "Isolated preflights recorded in handoff.md: launchpad-planning 99.77 s against 33.15 s in WO-202-D013's final review and 40.8 s in its verification; target-worktree 172.59 s against 27.8 s for ten tests in WO-072-D007.",
    "The executor's npm test -- --review row at this code identity (2026-10-14T12:37:45.669Z, 1,783.76 s wall-clock, 39 suites, 95 fresh tasks): target-worktree 197.26 s and launchpad-planning 107.59 s, run concurrently with the other suites. Their isolated growth comes to about 211 s."
  ],
  "rejected": [
    {
      "option": "Fail on suite growth",
      "reason": "No criterion bounds the duration. The order asks that growth above the watch be recorded with its cause, and D008 does that."
    }
  ],
  "followup": "Planning: judge criterion:24's reopening condition against these figures and the next counted order's elapsedPerCodeByte. Any reduction keeps every case, as the order's known issue requires.",
  "reopenWhen": "A later order records launchpad-planning or target-worktree slower again, or the planner judges the growth material."
}
```

## WO-210-D015 — Repair the close listing and execute the Finder metadata exception

```json
{
  "id": "WO-210-D015",
  "date": "2026-10-14",
  "dispatch": "resume: fix; VER-001 F1; scope expand: disposable Finder metadata; adjacent-0002",
  "decision": "List only foreign ignored material, with no bundle-owned descendant under a listed directory and no entry duplicated by a listed ancestor. Apply D014's exception locally in target close: separate tracked dirt from untracked files, admit only regular untracked .DS_Store files, and remove those files before the publishing close's ordinary Git operations. Dry runs preserve them. Keep the shared edition-registered Git and path helpers unchanged.",
  "evidence": [
    "The new bounded target-close regressions failed 3 of 3 before the repair at 2026-10-14T14:38:47Z: the listing included .claude/ and .claude/hooks/ alongside their foreign descendants; non-ignored Finder files made the clone base dirty; ignored Finder files blocked the target dry run. The nested .claude/hooks/local-cache/ case extends the report's settings.local.json reproduction.",
    "The repaired focused run passed 3 of 3 at 2026-10-14T14:40:52Z in 20,469 ms wrapper time. It exercises both close modes, ignored and non-ignored metadata at root and nested paths, tracked .DS_Store changes, a .DS_Store symlink and a directory with that name. Foreign material and bundle bytes survive refusals, dry runs retain metadata, publishing close removes both worktrees, and the shared exclude block is gone.",
    "The complete npm test -- --only target-worktree preflight passed at 2026-10-14T14:45:07Z: build and target-worktree both passed; task 188.23 s, gate 189.35 s, wrapper 190.70 s. Output is retained as repair-target-close.log in the repair session's ignored scratch.",
    "Bounded comparison at 2026-10-14T14:41:30Z, 142 ms: ignoring a non-ignored .DS_Store in our cleanliness judgment alone leaves git worktree remove refusing with exit 128 because the untracked file remains. Deleting that exact regular untracked file first lets ordinary worktree removal exit 0 without force. The selected approach combines read-only admission during dry-run with deletion during publishing close.",
    "Additional repair inputs: scripts/lib/git.mjs ensureClean; scripts/lib/paths.mjs containedRegularFile and disposableBasename; scripts/lib/harness.mjs bundle ownership and exclude registry; scripts/lib/adjacent-queue.mjs queue protocol. No instance repository or private settings were read."
  ],
  "rationale": "Avoid rule beating by testing the foreign file inside a bundle directory and the non-ignored metadata case, not just deps/. Avoid shifting the burden to the operator by clearing disposable metadata in the command. Preserve the useful refusal for all actual local work. NoOp retains the reproduced unsafe remedy and the operator's recurring close failure. The observed close behavior matches the intended outcome.",
  "rejected": [
    { "option": "Keep Git's directory listing whenever it contains one foreign file", "reason": "The failing fixture proves that the directory can also contain bundle-owned files." },
    { "option": "Only filter .DS_Store from the refusal", "reason": "The bounded comparison shows non-ignored metadata would still block ordinary Git teardown." },
    { "option": "Force-remove the worktree", "reason": "Exact metadata deletion succeeds without bypassing Git's checks for unrelated changes." }
  ],
  "reopens": { "decisionId": "WO-210-D006", "observation": "VER-001 demonstrated that its directory-collapse claim failed for mixed bundle directories. The new fixtures bind the corrected ownership rule." },
  "reopenWhen": "A close remedy names an ancestor of a bundle file, duplicates an ancestor and descendant, or treats unrelated material as disposable Finder metadata."
}
```

## Seed recovery and worker-review observations — 2026-10-14

The complete legacy recovery fixture passed in 131,102 ms at
2026-10-14T15:48:22.992Z (`repair-legacy-recovery.log` in this session's
scratch). The first attempt reached recovery intact but release preparation
correctly refused the fixture's unstructured decision record; the synthetic
record now has the documented JSON shape. Reused read-only workers caught
and root fixed the fixture's missing publication title and duplicate forge
directory, and a CLAUDE seed comparison that could discard authored text after
the generated block. The whole contract now must match a prior exported floor
plus one ordered generated block. The real refresh fixture changes that floor
and checks trailing instructions and malformed markers.

[Five-worker repair review](repair-review.md) records assignments, deduplicated
findings, fixes and evidence limits. The final required gates are still pending.

The focused real starter refresh fixture passed in 38,007 ms at
2026-10-14T15:50:01.791Z (`repair-starter-seeds.log`). It covers README, first
order and CLAUDE template replacement, named refusal for custom bytes/modes,
missing files, symlinks, redirected ancestors, authored contract suffixes and
malformed markers, plus current-manifest stale seeds and idempotent retry.
Release preparation was rerun after this expansion and retains `v0.82.0`.

## WO-210-D026 — Final review: integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-210/14 -->

```json
{
  "id": "WO-210-D026",
  "date": "2026-10-14",
  "dispatch": "resume: final review; worktree integrate WO-210",
  "decision": "Integration took in nothing: the base and the fetched main are both 3b5e29e4d36956b680ac1339aeeca887947e7987 (the v0.81.0 release commit), origin/main names the same commit, and the branch carries no commit of its own. Before the run, the five new source files the executor had marked intent-to-add (scripts/lib/target-gate.mjs, scripts/lib/target-planning.mjs, scripts/lib/target-records.mjs, scripts/target-gate.mjs, scripts/test-target-publication-fixture.mjs) were staged fully by the helper's printed remedy, a staging change that moved no byte. The helper checkpointed the work (refs/dotln/checkpoint/WO-210/14), retained its named stash d19c17c23c98100f6ffbc3ec672b28af46827b39, needed no intake backup because docs/intake holds only its three tracked placeholder files and no ignored material, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main, since the order changes no role text), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. Every acceptance claim is carried forward unchanged: VER-003's twenty-eight criterion judgments at code identity e0d1dbeb72cb7e1056a63bfff2ab1b33c922443dd8b11d8a9a4759a1b96751ee, which carry VER-002's independent reproductions on unchanged runtime paths and VER-001's on paths the two repairs did not touch; the executor's passing npm test -- --review row at that identity (2026-10-14T20:05:53.924Z, 39 suites, 95 fresh tasks, exit 0, 2,383,488 ms) and its document rows; VER-001's F1 as repaired (D015) and F2 to F5 as repaired (D016), reproduced in VER-002's Earlier findings; VER-002's F1 to F3 as repaired (D025), reproduced in VER-003's upgrade probe; the three operator scope expansions bound by three PlanExecutionAmended rows (D014, D017, D020) with criteria 25 to 28; and the executor's self-review (two workers at implementation: found 4, fixed 4; five workers at the first repair: found 12, fixed 12; one worker at the second repair: found 6, fixed 6). gateCodeIdentity returned the same identity before and after integration, and git diff --stat against the integration checkpoint shows no tracked file changed by the regeneration except the decisions index row this stub added (the checkpoint commit holds the untracked records and sources, which the comparison shows as deletions, not a change). Release preparation keeps application v0.82.0 under the order's minor classification: local tags end at v0.81.0, v0.82.0 is unassigned, and check-surfaces --local reports the release block v0.82.0 over v0.81.0 with every component unchanged (beacons 0.1.1, browser-evidence 0.1.0, compiler 0.27.0, console 0.4.2, kernel 0.6.0, skeleton 0.59.0; no bump required) and the package manifests and lockfile byte-identical to main. No registered evidence source changes (the executor's and each verifier's audit of the five edition sets and the feedback list), so integration owes no re-mint and no live episode. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper and npm test -- --review runs in the handoff sequence and is recorded in FINAL-001.",
  "evidence": [
    "refs/dotln/checkpoint/WO-210/14 (preservation commit 76906c67ab711af17c3ff8335a6478a35f753e7e)",
    "base 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "upstream 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "git log main..HEAD empty before integration; git ls-remote origin refs/heads/main and git rev-parse main origin/main HEAD all 3b5e29e4 before the helper's fetch; the helper's fetch found no newer origin/main",
    "The helper's first run refused five intent-to-add entries by name and printed git add -- for them; after that staging it ran to completion: Bases 3b5e29e4 -> 3b5e29e4, authored conflicts none, pending none, receipt complete at stage applied (docs/control/local/integration.json)",
    "release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4434 bytes. Tag observation: local snapshot only.",
    "Affected checks and preflights under node scripts/harness.mjs bounded, one at a time, 2026-10-14T20:51:32Z to 20:51:46Z, each exit 0: npm run publication:check (255/255 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.82.0 against latest local tag v0.81.0; six components src unchanged, no bump required; six workspace pins exact; github-body-profile passes on PR.md; the three docs/LEGAL.md pins and every license rule PASS), node scripts/lineage.mjs index --check (172 sections), node scripts/work-orders.mjs index --check (README and HISTORY current), node scripts/siblings.mjs index --check (registry current), node scripts/check-publication.mjs --print-locks (both locks equal the committed values); npm run format:check passes and git diff --check and git diff --cached --check are clean. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity before and after integration: e0d1dbeb72cb7e1056a63bfff2ab1b33c922443dd8b11d8a9a4759a1b96751ee, the identity of the executor's passing review row (20:05:53.924Z) and of the four document rows recorded since (20:08:39Z, 20:11:47Z, 20:27:41Z, 20:31:26Z); git diff --stat refs/dotln/checkpoint/WO-210/14 lists docs/lineage/decisions-index.md (+1) as the only tracked change the regeneration made",
    "git status --porcelain -- .claude .agents is empty and git diff --stat main -- .claude .agents packages/skeleton is empty: the regenerated harness bundle and manifest equal main's",
    "docs/intake holds docs/intake/chats/.gitkeep, docs/intake/images/.gitkeep and docs/intake/notes/.gitkeep, all tracked; git status --ignored -- docs/intake lists nothing, so the helper's intake check needed no --intake-backup"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub, indexes and registry, or the carried starter receipt, as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration, and the receipt rode in on this order's worktree start as WO-215's design provides."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-14. Original base: `3b5e29e4d36956b680ac1339aeeca887947e7987`.
Fetched main: `3b5e29e4d36956b680ac1339aeeca887947e7987`. Checkpoint: `refs/dotln/checkpoint/WO-210/14`.
Named stash retained: `d19c17c23c98100f6ffbc3ec672b28af46827b39` (WO-210 integrate 2026-10-14).
Intake backup: none needed; `docs/intake` holds only its three tracked placeholder files and no ignored material.
Resolved projections: none.
Release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4434 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim of VER-003 at code identity `e0d1dbeb…`, the executor's passing review and document rows at that identity, the two repairs' settled findings and the three bound scope expansions, as the record above states; no acceptance judgment is recorded here, FINAL-001 records it.
Authored conflicts observed: none.
Affected checks: run under the bounded wrapper on the integrated tree, each exit 0, as the record's evidence lists; `npm test -- --review` is recorded in FINAL-001.

## WO-210-D027 — Final review: fail FINAL-001 on three regressions of main's behavior; twenty-three follow-ups boarded, two operator packets, four register rows re-recorded

```json
{
  "id": "WO-210-D027",
  "date": "2026-10-14",
  "dispatch": "resume: final review; FINAL-001; three read-only reviewers and one refuter",
  "kind": "finding",
  "decision": "Fail the final review of WO-210 at the integrated subject, code identity e0d1dbeb72cb7e1056a63bfff2ab1b33c922443dd8b11d8a9a4759a1b96751ee, the identity VER-003 judged; integration changed no judged byte (D026) and all twenty-eight criteria hold as written. The verdict rests on three regressions of behavior main had, each shown by a probe, inside the subject's changed files. F1: scripts/discover.mjs effortSelectorFromHelp recognises only a `choices:`/`possible values:` list or a pipe list, while Claude Code 2.1.300's real `claude --help` prints `--effort <level>` with the levels on the next line as `(low, medium, high, xhigh, max)`, so the probe records values \"unknown\" where main recorded the five values whenever `--effort` appeared; scripts/resume.mjs hasRecordedEffortValue requires an array, so after a discovery rerun a Claude attestation at any effort other than the discovering session's own CLAUDE_EFFORT prints `has no matching discovery observation` (the selected-readback branch still admits that one value), which the kit's first order (scripts/kit/first-order.template.md line 76) promises will not happen for an observed effort; for codex-cli, help holding `--config` now replaces the evidence-backed selector in docs/discovery/environment.json with values \"unknown\", a record main left untouched. F2: scripts/bootstrap.mjs now runs `lineage.mjs index` in a kit whose idea ledger exists without its generated index, and the client README's update procedure ends with that bootstrap on `main`; an instance exported at v0.81.0 (ledger seeded, index never seeded, and the starter refresh carries no generated seed) therefore leaves an untracked docs/lineage/README.md on `main`, where scripts/lib/git.mjs ensureClean counts untracked files, so the next `worktree start` refuses `working tree is not clean`, and release close's updateMain `git merge --ff-only origin/main` is refused by Git for the identical untracked file once the recovered `wo-001` pull request (whose own bootstrap committed that index) has merged; only a hand step outside the documented procedure (removing or committing the untracked file on main) repairs it, and the operator makes no repository change by hand (direction of 2026-10-13); main's bootstrap wrote nothing outside ignored paths. updateMain also runs for a target order's close (scripts/release.mjs line 2385). F3: scripts/lib/finder-metadata.mjs assertFinderMetadataTypes walks every directory except .git with readdirSync and no error handling, and scripts/lib/target-worktree-close.mjs calls it on the target and unconditionally on the clone's base checkout (dry run included) while scripts/lib/starter-refresh.mjs calls it on the starter checkout; an unreadable ignored directory in the clone's base checkout makes every target close and dry run fail with a raw `EACCES: permission denied, scandir '<absolute path>'`, where `git status --porcelain --untracked-files=all` and `git ls-files --others --exclude-standard` exit 0 and main never read the base checkout (on the target side main's ignored-material refusal already covered such a directory, and the starter path records the error redacted inside its row); the walk also descends every ignored tree of the target, the base and the starter checkout synchronously at every close, dry run and refresh with no recorded duration. Twenty-three further defects are follow-ups with their repair rules in this decision's followup (F4 to F26), three of them new scope, and two are operator decision packets stated in FINAL-001 (F27: whether a customized or missing starter seed whose template did not change should block every later kit refresh, as D020's 'any other difference refuses' is implemented; F28: whether the session publication's grant registry and authority profile are read from main's committed registry or from the order worktree's branch, which the Design leaves unnamed). The three verifications' claims stand: each criterion holds on the fixtures and probes the reports name, VER-001's F1 to F5 and VER-002's F1 to F3 are repaired, and the executor's passing review row at this identity is the gate the criteria stand on. The next repair fixes F1 to F3 at their causes with the fixtures this decision names, and fixes the boarded follow-ups within the Boy Scout bound or leaves each with a recorded reason; fresh verification then re-derives the touched criteria. Register: FUP-06de60fa5d19fe5a is re-recorded deferred at its current source revision; FUP-b28b870422a74166 and FUP-0c10689747f83675 are re-recorded deferred because their condition 'an order edits the release suite' fired on this order's scripts/test-release.sh edit while the suite gained no read of an identity-excluded input; FUP-1315c82ef74fb832 is re-recorded deferred because its condition 'the next order that edits scripts/resume.mjs' fired, VER-001 F3 met its item (1)'s hazard and D016 repaired the briefing without changing the append order; FUP-92711a92e1d05874 and FUP-aa129ef63aeef2b1 stay deferred as the order's own planning remainders; FUP-94f789b2dcdd30e7 (WO-215-D020's twelve follow-ups) stays untriaged for planning although this order edits the surfaces it names, since none was allocated here; the other 43 textually matched rows are left as they are because this change opened none of their seams and none of their conditions occurred.",
  "evidence": [
    "docs/final-reviews/WO-210/FINAL-001.md: criterion judgments, the findings block, the decision packets for F25 and F26, and Executed checks",
    "D026 (integration took in nothing); VER-003 (pass) at code identity e0d1dbeb…, report hash sha256:d86ccf7a… equal to its recorded reportHash; VER-002 (fail; D024) sha256:f18add80… and VER-001 (fail; D012) sha256:afd65db1… equal to theirs",
    "F1 probe, 2026-10-14T21:09Z in the session scratch: `claude --help` captured from Claude Code 2.1.300 prints `--effort <level>                      Effort level for the current session` and on the next line `(low, medium, high, xhigh, max)`; probeHarness('claude-code', <that help>) returns effortSelector {control: '--effort', values: 'unknown'}; main's scripts/discover.mjs lines 89-93 recorded values ['low','medium','high','xhigh','max'] whenever /--effort\\b/ matched; scripts/resume.mjs lines 547-561 admit a selector only when Array.isArray(sessionSelector.values); line 618 prints the advisory; docs/discovery/environment.json holds codex-cli sessionEffortSelector with five values and an evidence pointer, which discoverHarness (scripts/discover.mjs lines 124-125) would replace because codex's help shows `-c, --config`; the process-debt fixture's Claude case feeds `--effort <level>` with no level list and expects 'unknown', so the real form is never exercised",
    "F2 probes, 2026-10-14T21:13Z: scripts/lib/git.mjs ensureClean runs `git status --porcelain --untracked-files=all` and throws on any entry; scripts/worktree.mjs line 793 calls ensureClean(mainPath) in the start path; scripts/release.mjs updateMain (lines 1767-1773) runs ensureTrackedClean then `git merge --ff-only origin/main`; a scratch repository with an untracked docs/lineage/README.md byte-identical to the commit being merged refuses with `error: The following untracked working tree files would be overwritten by merge: docs/lineage/README.md` (exit 1); scripts/kit/gitignore.template and core's .gitignore name no lineage path; `git show v0.81.0:scripts/launchpad.mjs` seeds docs/lineage/idea-ledger.md and generates no lineage README; scripts/lib/starter-seeds.mjs lists eight template seeds and no generated index; scripts/kit/README.client.md lines 549-551 tell the main session to fast-forward main and run bootstrap; scripts/test-launchpad-planning.mjs line 1442 runs that bootstrap on the fork's main and the case checks neither main's status afterwards nor a later start or close",
    "F3 probe, 2026-10-14T21:13Z: a scratch repository with an ignored mode-000 directory gives `git status --porcelain --untracked-files=all` exit 0 while assertFinderMetadataTypes(root) throws EACCES naming the absolute path; scripts/lib/target-worktree-close.mjs calls it inside closeClean for the target and at `if (baseCheckout) assertFinderMetadataTypes(baseCheckout)` before the dry-run branch; scripts/lib/starter-refresh.mjs clean() calls it on the starter checkout; main's closeTargetWorktree never read the base checkout and listed ignored material only through git ls-files",
    "F4 to F24 and the two operator packets: each verified against the named lines by this reviewer, the probes recorded in FINAL-001's Earlier findings (the entity-escaped `evt&#95;12` body lints pass while the raw form is refused; `subcontract:abc`, `prevt_1` and `evt_1ABC2` are refused; `file:~/x.ts` and a `file:` reference beginning with a drive letter such as `C:/` map to 'contained' references; scripts/lib/meta.mjs readDecisions skips a missing decisions.md and planning-followups.mjs requires a reopened decision to exist; scripts/lib/target-planning.mjs refuses a changed pending input at line 208 before the try that names the preserved worktree; packages/console/src/text-sources.ts line 175 keeps one value per card field)",
    "Three read-only dotln-worker reviewers over three surface groups reported 27 items (5, 10 and 12); one refuter judged each proposed route real, upheld the three blocking routes with two wording corrections (the advisory reaches attestations at an effort other than the discovering session's; removing the untracked file is a hand step, not a Git command) and one scope limit (F3's regression is the base checkout, where main never read), moved the commit-lint timing item to new scope as already accepted by the order's Known issues, dropped the passing-output sub-item as the Design's stated behavior, and added four missed items, two taken as findings (F25, F26) and two folded into F2's and F3's repair rules; this reviewer reduced the set to the 28 findings FINAL-001 lists",
    "The executor's fresh npm test -- --review row at e0d1dbeb… recorded 2026-10-14T20:05:53.924Z: 39 suites, 95 fresh tasks, exit 0, 2,383,488 ms; this review's bounded reproductions at the integrated tree: the v0.81.0 upgrade case (pass, 51,371 ms) and the target records-and-publication case (pass, 89,731 ms)"
  ],
  "rejected": [
    {
      "option": "Pass and board F1 to F3 as follow-ups",
      "reason": "Product 07 §Verification review and attack routes a change that breaks a behavior main had, shown by a probe, as blocking, and the final-review rule makes only a finding that breaks no main behavior a follow-up by rule. F1 reaches every Claude attestation after the kit's own first order runs discovery, F2 leaves the operator's own fork refused at its next start and at release close after the exact procedure this order documents, and F3 fails every close on a clone that holds one unreadable ignored directory; each is repaired at its cause in one bounded repair."
    },
    {
      "option": "Judge a criterion unmet",
      "reason": "All twenty-eight hold as written at this identity on the fixtures and probes the reports name; the regressions sit beside the criteria in the same declared surfaces."
    },
    {
      "option": "Fix F1 to F3 in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; a behavioral repair returns through resume: fix and fresh independent verification."
    },
    {
      "option": "Route F27 and F28 as follow-ups",
      "reason": "Each names a choice the operator makes: whether D020's 'any other difference refuses' was meant to let one customized seed block every later kit refresh, and which checkout's registry and profile authorize a session publication."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D003",
    "observation": "Two of the first-order repairs D003 records regress main's behavior on real inputs: the effort-selector discovery records 'unknown' for Claude Code's actual help text and overwrites codex's evidence-backed record, and the bootstrap lineage-index step, run on main by the documented update, leaves an untracked generated file that refuses the next start and the release close's fast-forward."
  },
  "followup": "WO-210 resume: fix. (F1) scripts/discover.mjs: effortSelectorFromHelp parses the real help forms, including a parenthesized comma list on the flag's line or its continuation, beside `choices:` and pipe lists, and admits a dedicated effort flag for codex when its help shows one; discoverHarness never replaces a recorded selector with values 'unknown' and keeps the existing evidence-backed record when the probe cannot read values; the process-debt case feeds the captured real `claude --help` text (2.1.300) and asserts the five values, and asserts a recorded codex selector survives a probe that reads 'unknown'. (F2) The documented update leaves main clean: generate the lineage index on the update branch beside the re-emit, or carry the generated index in the kit update, and make bootstrap on main write no tracked-path file; scripts/test-launchpad-planning.mjs asserts `git status --porcelain --untracked-files=all` on the fork's main is empty after the documented procedure and that a next `worktree start` from that main succeeds, and the client README states the result. (F3) scripts/lib/finder-metadata.mjs tolerates an unreadable directory without a raw EACCES or an absolute path (skip it, or refuse by a path relative to the checkout with the remedy), does not descend ignored trees it has no reason to inspect or records its duration, walks the base checkout once per close, and the target-close and starter-refresh fixtures include an unreadable ignored directory. Check: npm test -- --only process-debt, npm test -- --only launchpad-planning, npm test -- --only target-worktree, npm test -- --only release, npm test -- --only launchpad, npm run test:docs and npm test -- --review. (F4 to F26, boarded; fix within the Boy Scout bound or record the reason) (F4) screen literal()'s inputs or decode numeric character references and Markdown escapes before identifier.runtime matches a body; (F5) give the rule a left boundary and a right boundary for evt_<digits> so ordinary words and external ids pass while DotLn's forms are refused; (F6) make each record card field unique or list the records in one field; (F7) refuse `~` and drive-letter prefixes in targetNativeReference; (F8) target-records regenerates or names npm run meta and npm run work-orders -- index, meta indexes a moved decisions file through targetRecords instead of dropping its rows, and a reopens reference to a moved decision resolves; the export case gives WO-002 JSON decisions before implementation-ready and checks meta --check and index --check after the move; (F9) post-pass cleanliness refusals in target-records and the session publish name the paths and say to remove or move them, never to commit; (F10) print the failing command's output path; (F11) name the pending receipt's path and a discard route in both refusals, and bind the records receipt to the reviewed commit; (F12, new scope) lint the target's commit messages at final-review-result, before the pass binds them; (F13) set rewrittenSeeds only after the push and print the dry run's seedChanges; (F14) align the zero-marker remedy, the README and product 07's update sentence; (F15) name the restore route when the target directory is absent; (F16) run the base cleanliness and fast-forward checks in the dry run and name the file in the dirty-base refusal; (F17) create or name the missing local base branch instead of reporting a fast-forward failure; (F18) map disposition references against the repaired head; (F19) print the launchpad-qualified runner command in target briefings; (F20) correct the requireGateClaims comment or guard the target lookup; (F21) import the harness composition rule in starter-seeds; (F22) log the recorded branch on a rerun and offer target-records only while it can run; (F23, new scope) decide whether the close's fetch should run through a host-created lane as WO-157's push does; (F24, new scope) refuse Finder metadata and editor files under planning/ and product/; (F25) decide one signing policy for the records-only and planning commits, which force commit.gpgsign off while starter refresh follows the host's policy, so a target that requires signed commits can merge them; (F26) delete the target branch with the Design's `git branch -d` after the containment proof, or record why -D stays. (F27, F28) operator decision packets in FINAL-001.",
  "reopenWhen": "The repair changes a judged surface (fresh verification re-derives it), an operator answers F25 or F26, or a target order reaches a live forge."
}
```

## WO-210-D034 — Final review: the second integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-210/21 -->

```json
{
  "id": "WO-210-D034",
  "date": "2026-10-15",
  "dispatch": "resume: final review; worktree integrate WO-210; FINAL-002",
  "decision": "Integration took in nothing: the base and the fetched main are both 3b5e29e4d36956b680ac1339aeeca887947e7987 (the v0.81.0 release commit), origin/main names the same commit, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-210/21), retained its named stash 22968a44d7d2566a9cdee52689998dd5e4210014 beside FINAL-001's d19c17c2, needed no intake backup because docs/intake holds only its three tracked placeholder files, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. gateCodeIdentity is 51591a530eb63113f44fb5798cbfeb3ce33602bfd72cc8c80004e497876ae62e before and after integration, the identity of the executor's passing npm test -- --review row of 2026-10-15T01:47:44.707Z (39 suites, 95 fresh tasks, exit 0, 2,511,451 ms) and of the four document rows recorded since; git diff --stat against the integration checkpoint shows the decisions index row this stub added as the only tracked change. Every acceptance claim is carried forward unchanged: VER-004's twenty-eight criterion judgments at that identity, which carry VER-003's, VER-002's and VER-001's independent reproductions on paths the three repairs did not touch; FINAL-001's blocking F1 to F3 as repaired in the third repair (D029) and verified by VER-004's older-runtime, scanner and discovery probes; F4 to F7, F9, F10, F13, F14, F16 to F20, F22 and F25 as repaired (D029), F21 as reverted with its pre-build counterexample (D030), F26 as retained under D009, F8, F11, F12, F15, F23 and F24 as deferred to planning (D029), and F27 and F28 as resolved by the operator-delegated defaults (D028); the three operator scope expansions (D014, D017, D020) and the two delegated amendments (D028, D029) bound by five PlanExecutionAmended rows; and the executor's self-review record (two workers at implementation, five at the first repair, one at the second, the separate-pass read at the third, D032). Release preparation keeps application v0.82.0 under the order's minor classification: local tags end at v0.81.0, v0.82.0 is unassigned, and check-surfaces --local reports the release block v0.82.0 over v0.81.0 with every component unchanged (beacons 0.1.1, browser-evidence 0.1.0, compiler 0.27.0, console 0.4.2, kernel 0.6.0, skeleton 0.59.0; no bump required) and the package manifests and lockfile byte-identical to main. No registered evidence source changes, so integration owes no re-mint and no live episode. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper and npm test -- --review runs in the handoff sequence and is recorded in FINAL-002.",
  "evidence": [
    "refs/dotln/checkpoint/WO-210/21",
    "base 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "upstream 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "git log main..HEAD empty before integration; git rev-parse main origin/main HEAD all 3b5e29e4 before the helper's fetch; the helper printed Bases 3b5e29e4 -> 3b5e29e4, authored conflicts none, and a retained stash 22968a44d7d2566a9cdee52689998dd5e4210014 (WO-210 integrate 2026-10-15)",
    "release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4506 bytes. Tag observation: local snapshot only.",
    "Affected checks and preflights under node scripts/harness.mjs bounded, one at a time, 2026-10-15T02:25:12Z to 02:25:17Z, each exit 0: npm run publication:check (255/255 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.82.0 against latest local tag v0.81.0; six components src unchanged, no bump required; six workspace pins exact; github-body-profile passes on PR.md; the three docs/LEGAL.md pins and every license rule PASS), node scripts/lineage.mjs index --check (172 sections), node scripts/work-orders.mjs index --check (README and HISTORY current), node scripts/siblings.mjs index --check (registry current), node scripts/check-publication.mjs --print-locks (both locks equal the committed values); npm run format:check passes and git diff --check and git diff --cached --check are clean",
    "gateCodeIdentity before and after integration: 51591a530eb63113f44fb5798cbfeb3ce33602bfd72cc8c80004e497876ae62e; readGateChecks at that identity lists the executor's npm test review row (exit 0, executed, 2,511,451 ms, recorded 2026-10-15T01:47:44.707Z, evidence host-gate:51591a53…:npm test) and four npm run test:docs rows (01:05:21Z, 01:52:34Z, 02:07:08Z, 02:10:23Z); git diff --stat refs/dotln/checkpoint/WO-210/21 over the tracked tree lists docs/lineage/decisions-index.md (+1) as the only change the regeneration made",
    "git status --porcelain -- .claude .agents is empty and the harness bundle and manifest equal main's; docs/intake holds only its three tracked .gitkeep placeholders",
    "Bounded reruns at the integrated tree, one at a time, 02:26:43Z to 02:27:36Z, each exit 0: the WO-210 discovery case of scripts/test-process-debt.mjs (330 ms), the three Finder-metadata cases of scripts/test-target-worktree.mjs (16,046 ms) and the v0.81.0 upgrade case of scripts/test-launchpad-planning.mjs (36,388 ms)"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub, indexes and registry as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-15. Original base: `3b5e29e4d36956b680ac1339aeeca887947e7987`.
Fetched main: `3b5e29e4d36956b680ac1339aeeca887947e7987`. Checkpoint: `refs/dotln/checkpoint/WO-210/21`.
Named stash retained: `22968a44d7d2566a9cdee52689998dd5e4210014` (WO-210 integrate 2026-10-15).
Intake backup: none needed; `docs/intake` holds only its three tracked placeholder files and no ignored material.
Resolved projections: none.
Release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4506 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim of VER-004 at code identity `51591a53…`, the executor's passing review and document rows at that identity, the three repairs' settled findings, the deferred remainders and the five bound amendments, as the record above states; no acceptance judgment is recorded here, FINAL-002 records it.
Authored conflicts observed: none.
Affected checks: run under the bounded wrapper on the integrated tree, each exit 0, as the record's evidence lists; `npm test -- --review` is recorded in FINAL-002.

## WO-210-D035 — Final review: fail FINAL-002 on one regression of main's behavior; eighteen follow-ups boarded, draft release surfaces retained

```json
{
  "id": "WO-210-D035",
  "date": "2026-10-15",
  "dispatch": "resume: final review; FINAL-002; two read-only reviewers and one refuter",
  "kind": "finding",
  "decision": "Fail the final review of WO-210 at the integrated subject, code identity 51591a530eb63113f44fb5798cbfeb3ce33602bfd72cc8c80004e497876ae62e, the identity VER-004 judged; integration changed no judged byte (D034) and all twenty-eight criteria hold as written. The verdict rests on one regression of behavior main had, shown by a probe on both trees, inside the subject's changed files: scripts/lib/target-worktree-close.mjs selects the clone's base checkout as the first worktree Git lists on refs/heads/<base>, parseWorktrees keeps an entry Git marks prunable with its branch line intact, and withWriterReservationLock on that missing path throws a raw ENOENT naming the absolute path before any check, so the dry run and the publishing close both refuse when the base branch is held by a linked worktree whose directory was deleted; main's close never read the base checkout and returned would-remove on the same fixture. Eighteen further defects are follow-ups with their repair rules in this decision's followup; three of them ask for something the order did not set out to do and are new scope. The refuter's variant of the regression, a locked worktree deleted and then pruned, survives git worktree prune with a locked line and fails the same way, so the repair keys on the directory's existence, not on Git's prunable flag. Two of the follow-ups bear on the order's own update procedure: an older instance whose main holds the untracked lineage index v0.81.0's README told it to generate cannot apply the recovery stash in wo-001 after the update branch commits that path, and a fork of the refreshed starter never receives the lineage index seed while the README no longer tells it to generate one, so its first document gate fails the lineage row. The four verifications' claims stand: each criterion holds on the fixtures and probes the reports name, VER-001's, VER-002's and FINAL-001's findings are repaired as recorded, and the executor's passing review row at this identity is the gate the criteria stand on. The next repair fixes F1 at its cause with the fixture this decision names, fixes the boarded follow-ups within the Boy Scout bound or leaves each with a recorded reason, and fresh verification re-derives the touched criteria. PR.md and RELEASE-NOTES.md stay in the final-review directory as this review's drafts, written at this identity with the fail outcome stated in their validation paragraphs; a failing review publishes nothing, and the passing review rewrites or re-validates them from the repaired subject. Register: no matched row's condition occurred and no seam opened beyond the order's own rows; the fifty-four matched rows are left as FINAL-001 judged them, with this order's own remainders (FUP-92711a92e1d05874, FUP-aa129ef63aeef2b1, FUP-c9dc1abccd1f1a9d, FUP-cf950d70e66c50bf, FUP-5682890b65853e70, FUP-2a2be2cc2807f530) and WO-215's twelve (FUP-94f789b2dcdd30e7) with planning; the repair that takes F3 and F4 settles FUP-5682890b65853e70 with them.",
  "evidence": [
    "docs/final-reviews/WO-210/FINAL-002.md: criterion judgments, the findings block and Executed checks",
    "D034 (the second integration took in nothing); VER-004 (pass) at code identity 51591a53…, report hash equal to its recorded reportHash; the executor's fresh npm test -- --review row at that identity (2026-10-15T01:47:44.707Z, 39 suites, 95 fresh tasks, exit 0, 2,511,451 ms)",
    "F1 probe, 2026-10-15T02:45Z under the bounded wrapper, the lifecycle reviewer's probe-close-prunable.mjs rerun by this reviewer: a scratch origin, a clone on branch work, a target wo-999 merged into origin's main, a linked worktree holding main whose directory was deleted, and a registry entry; the subject's closeTargetWorktree dry run refused with ENOENT: no such file or directory, lstat '<scratch>/held-main', while main's module (git show main:scripts/lib/target-worktree-close.mjs with its imports rewritten to absolute paths, run over the current helper libraries) printed dry run outcome would-remove; git worktree list --porcelain in the fixture clone lists the deleted worktree with branch refs/heads/main and a prunable line, which scripts/lib/git.mjs parseWorktrees keeps",
    "F2 probe, 02:43Z in a scratch repository: an untracked docs/lineage/README.md and an untracked control segment stashed with --include-untracked on main, the same index committed on the update branch and merged, a wo-001 worktree added from main; git -C wo-001 stash apply exits 1 with 'docs/lineage/README.md already exists, no checkout' and 'could not restore untracked files from stash', the tracked README edit applied, the control segment not restored, the stash retained",
    "F3 and F4: scripts/lib/starter-seeds.mjs lists eight template seeds, scripts/lib/starter-refresh.mjs admits only those and the manifest files in its staged set, scripts/launchpad.mjs seeds docs/lineage/README.md only in prepareKit, scripts/kit/README.client.md item 7 says the export seeds the index and no longer carries v0.81.0's generation step, §Kit files says it is generated; the text reviewer's q5 probe: lineage index --check on a root with only the ledger throws ENOENT naming no remedy",
    "F12 probe, 02:43Z under the bounded wrapper: targetNativeReference maps a doubled scheme before an absolute home path, a leading space before an absolute path, a zero-width prefix and a fullwidth tilde to '<path> at <head>' while file:~/x.ts and file:C:/x are refused",
    "F5 to F11 and F13 to F19: each read at the named lines by this reviewer against the reviewers' probes (probe-gate-index.mjs, probe-seeds.mjs, f1.mjs, f4.mjs, f4b.mjs, f7.mjs, stash.sh in the session scratch) and the fixtures they name",
    "Two read-only dotln-worker reviewers (claude-opus-5-5, xhigh by definition) reported ten items each over the lifecycle and the text surfaces; one refuter judged each item's truth, route and class; this reviewer reproduced the items the verdict and the operator's procedure rest on and reduced the set to the nineteen findings FINAL-002 lists",
    "Bounded reruns at the integrated tree, each exit 0: the WO-210 discovery case (1 of 1, 330 ms), the three Finder-metadata cases (3 of 3, 16,046 ms) and the v0.81.0 upgrade case (1 of 1, 36,388 ms)"
  ],
  "rejected": [
    {
      "option": "Pass and board F1 as a follow-up because its trigger is rare",
      "reason": "Product 07 §Verification review and attack routes a change that breaks a behavior main had, shown by a probe, as blocking, and FINAL-001 applied that rule to the same module's unreadable-directory case; the refusal also prints an absolute path, which F3's rule forbade. The fix is a few lines and one fixture case."
    },
    {
      "option": "Judge a criterion unmet",
      "reason": "All twenty-eight hold as written at this identity on the fixtures and probes the reports name; the regression sits beside criterion 12 in the same declared surface, and criteria 27 and 28 hold on the fixture they name while F2 and F3 lie in the procedure's text and its unexercised preconditions."
    },
    {
      "option": "Fix F1 and the README findings in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; the kit README is inside the code identity, so even its one-sentence corrections return through resume: fix and fresh verification."
    },
    {
      "option": "Remove the draft PR body and release notes",
      "reason": "Both are accurate drafts at this identity whose validation paragraphs state this fail; keeping them saves the passing review a rewrite, and nothing publishes them before a passing result."
    }
  ],
  "reopens": {
    "decisionId": "WO-210-D029",
    "observation": "The third repair's close reads the clone's base checkout through a worktree listing that keeps prunable entries, so a deleted linked worktree holding the base branch now refuses the close main closed; and its README update procedure neither clears an older instance's generated lineage index before the stash nor tells a fork of the refreshed starter to generate one."
  },
  "followup": "WO-210 resume: fix. (F1) scripts/lib/target-worktree-close.mjs: select the base checkout only among worktrees whose directory exists on disk, treating a prunable, locked-and-deleted or otherwise missing entry for the base branch as not checked out, so the publishing close updates the ref and the dry run judges against origin/<base> as the Design provides; never print an absolute path in a refusal; scripts/test-target-worktree.mjs closes a target whose clone base is held by a deleted linked worktree, prunable and locked, in both modes and asserts would-remove, then no-release, with the clone's other refs unchanged. (F2) scripts/kit/README.client.md: before the named stash the session removes a generated untracked docs/lineage/README.md on main, which the update branch regenerates and commits, or the recovery applies the stash with that path excluded; the v0.81.0 case runs v0.81.0's step 6 (node scripts/lineage.mjs index and npm run meta on the fork's main) before the stash. (F3, F4) the README's first steps tell a fork of a starter exported before this release to run node scripts/lineage.mjs index and commit it with its setup commit before the first gate, or the seed planner carries the generated index into a starter that lacks it; §Kit files and item 7's bootstrap sentence (D033) say the same thing the planning section says. (F5) qualify every command the target briefings and the pass message print with the launchpad path or the DOTLN_LAUNCHPAD form the start handoff uses. (F6) keep target-records a legal action while a pending records receipt or an unremoved moved source remains, and name the rerun in the moved-source refusal. (F7) guard the target gate lookup against an unreadable index with a refusal naming the file, and make the ledger comment's first paragraph agree. (F8) for CLAUDE.md and .gitignore, a missing copy of an unchanged template refuses by path before the write, or the refresh restores the template for those two seeds; record the choice. (F9, F10, F11) add the branch-only grant case, a post-write refusal with the printed seed texts, and a non-ignored unreadable base directory in both close modes. (F12) refuse a path that is not a plain contained relative path after trimming and after rejecting a nested scheme, control, zero-width and fullwidth characters. (F13) decode named HTML entities and strip HTML comments and tags in a body before the runtime match, and skip code spans and fences. (F14) replace a recorded selector only when the probe's control equals the record's or the record has no evidence pointer, and record an unknown level name beside the known ones. (F15) print paths without the porcelain prefix and read -z entries whole. (F17) skip code spans and fences before the runtime match. (F16, F18, F19, new scope) decide at planning whether the lint folds invisible characters, whether the update branch installs dependencies before emit, and whether the omitted-references note counts every reference the body leaves out. Check: npm test -- --only target-worktree, npm test -- --only launchpad, npm test -- --only launchpad-planning, npm test -- --only outward-lint, npm test -- --only github-body, npm test -- --only process-debt, npm test -- --only resume, npm run test:docs and npm test -- --review.",
  "reopenWhen": "The repair changes a judged surface (fresh verification re-derives it), a planning pass allocates the three new-scope items, or a target order reaches a live forge."
}
```

## WO-210-D041 — Final review: the third integration took in nothing; every acceptance claim carried forward

<!-- integration refs/dotln/checkpoint/WO-210/28 -->

```json
{
  "id": "WO-210-D041",
  "date": "2026-10-15",
  "dispatch": "resume: final review; worktree integrate WO-210; FINAL-003",
  "decision": "Integration took in nothing: the base, the fetched main and origin/main are all 3b5e29e4d36956b680ac1339aeeca887947e7987 (the v0.81.0 release commit), and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-210/28), retained its named stash e5573469c6814556a4ae1362ca01c70a23f41917 beside FINAL-002's 22968a44 and FINAL-001's d19c17c2, needed no intake backup because docs/intake holds only its three tracked placeholder files, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. gateCodeIdentity is 0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11 before and after integration, the identity of the executor's passing npm test -- --review row of 2026-10-15T12:18:59.814Z (44 suite results, 100 fresh tasks, exit 0, 2,552,079 ms) and of the document rows recorded since; compared over tracked and untracked files, the regeneration changed only this record's stub, its decisions index row, the meter snapshot and the PR stub's meter. Every acceptance claim is carried forward unchanged: VER-005's twenty-eight criterion judgments at that identity, which carry VER-004's and the earlier reports' independent reproductions on paths the fourth repair did not touch; FINAL-002's blocking F1 as repaired at its cause (D036) and probed by VER-005 with a moved locked base checkout in both close modes; F2 to F15 and F17 as repaired (D036, D038); F16, F18 and F19 as deferred to planning (D036, FUP-69bd004155a6ec30); VER-005's documentation follow-up (D040) and its two process failures (D039); the operator's direction to spend the subagent budget on the fourth repair (D037); and the five PlanExecutionAmended rows that bind the order's amended text (D014, D017, D020, D028, D029), to which the fourth repair added none. Release preparation keeps application v0.82.0 under the order's minor classification: local tags end at v0.81.0, v0.82.0 is unassigned, and check-surfaces --local reports the release block v0.82.0 over v0.81.0 with every component unchanged (beacons 0.1.1, browser-evidence 0.1.0, compiler 0.27.0, console 0.4.2, kernel 0.6.0, skeleton 0.59.0; no bump required) and the package manifests and lockfile byte-identical to main. No registered evidence source changes, so integration owes no re-mint and no live episode. Of the four printed affected checks, three pass on the integrated tree under the bounded wrapper and npm test -- --review runs in the handoff sequence and is recorded in FINAL-003.",
  "evidence": [
    "refs/dotln/checkpoint/WO-210/28",
    "base 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "upstream 3b5e29e4d36956b680ac1339aeeca887947e7987",
    "git ls-remote origin refs/heads/main and git rev-parse origin/main HEAD all 3b5e29e4 before the helper's fetch; the helper printed Bases 3b5e29e4 -> 3b5e29e4, authored conflicts none, and a retained stash e5573469c6814556a4ae1362ca01c70a23f41917 (WO-210 integrate 2026-10-15)",
    "release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4520 bytes. Tag observation: local snapshot only.",
    "Affected checks and preflights in one run under node scripts/harness.mjs bounded, 2026-10-15T13:03:44Z to 13:03:56Z, each exit 0: npm run publication:check (255/255 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.82.0 against latest local tag v0.81.0; six components src unchanged, no bump required; six workspace pins exact; github-body-profile passes on PR.md and RELEASE-NOTES.md; 57 PASS lines and no FAIL), node scripts/lineage.mjs index --check (172 sections), node scripts/work-orders.mjs index --check (README and HISTORY current), node scripts/siblings.mjs index --check (registry current), node scripts/check-publication.mjs --print-locks, npm run format:check, git diff --check and git diff --cached --check",
    "gateCodeIdentity before and after integration: 0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11; readGateChecks at that identity lists the executor's npm test review row (exit 0, executed, 2,552,079 ms, recorded 2026-10-15T12:18:59.814Z, evidence host-gate:0c0748d7…:npm test) and the npm run test:docs rows since 11:36:14Z, the latest passing at 12:54:11Z; a temporary index over tracked and untracked files shows docs/evidence/WO-210/decisions.md (this stub), docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md and docs/lineage/decisions-index.md as the only paths the regeneration changed",
    "git status --porcelain -- .claude .agents is empty and the harness bundle and manifest equal main's; docs/intake holds only its three tracked .gitkeep placeholders"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub, indexes and registry as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-15. Original base: `3b5e29e4d36956b680ac1339aeeca887947e7987`.
Fetched main: `3b5e29e4d36956b680ac1339aeeca887947e7987`. Checkpoint: `refs/dotln/checkpoint/WO-210/28`.
Named stash retained: `e5573469c6814556a4ae1362ca01c70a23f41917` (WO-210 integrate 2026-10-15).
Intake backup: none needed; `docs/intake` holds only its three tracked placeholder files and no ignored material.
Resolved projections: none.
Release preparation: WO-210 target v0.82.0 remains current. Files changed: docs/evidence/WO-210/meta.json, docs/final-reviews/WO-210/PR.md. Meter snapshot: docs/evidence/WO-210/meta.json, 4520 bytes. Tag observation: local snapshot only.
Carried-forward claims: every claim of VER-005 at code identity `0c0748d7…`, the executor's passing review and document rows at that identity, the four repairs' settled findings, the deferred remainders and the five bound amendments, as the record above states; no acceptance judgment is recorded here, FINAL-003 records it.
Authored conflicts observed: none.
Affected checks: run under the bounded wrapper on the integrated tree, each exit 0, as the record's evidence lists; `npm test -- --review` is recorded in FINAL-003.

## WO-210-D042 — Final review: pass FINAL-003; six low follow-ups boarded, none breaks a behavior main had

```json
{
  "id": "WO-210-D042",
  "date": "2026-10-15",
  "dispatch": "resume: final review; FINAL-003; three read-only reviewers",
  "kind": "finding",
  "decision": "Pass the final review of WO-210 at the integrated subject, code identity 0c0748d762645dd71479a88a61bfd0ea76cc648c295d16efeb993af54a4b9b11, the identity VER-005 judged and the executor's fresh npm test -- --review row passed; integration changed no judged byte (D041) and all twenty-eight criteria hold. FINAL-002's blocking F1 is repaired at its cause, and no item this review found breaks a behavior main had in a route the product supports. A1: with a stale worktree entry holding the clone's base, a local base that already contains the merged order branch and origin's base moved on, the close refuses with the stale-entry remedy where main's close, which never fetched, closed; the refusal is the Design's own route, because the Design moves an unchecked-out base with git fetch origin <base>:<base> and Git refuses that fetch while any registered entry holds the branch (probe below), but D036's sentence that the repaired close loses nothing main closed is wrong for this sub-state. The other five are low: the publishing close moves an unchecked-out base with update-ref, which skips Git's guard for a worktree rebasing the base (A2); a stale writer-transition lock refuses the close naming an absolute temporary path and no rerun command (A3); the shared redaction no longer masks a local path inside a file:// URL or after a colon in starter refresh's quoted Git text, reachable only through a file:// URL rewrite and printed only locally (A4); the unmerged-branch refusal quotes Git's command line with no condition or rerun command (A5); and the body lint's rendered view overflows the call stack on one code block of about 124,500 characters or more, which no route produces (B1). Each is boarded with its repair rule below.",
  "evidence": [
    "docs/final-reviews/WO-210/FINAL-003.md: criterion judgments, the findings block and Executed checks",
    "D041 (the third integration took in nothing); VER-005 (pass) at code identity 0c0748d7…; the executor's fresh npm test -- --review row at that identity (2026-10-15T12:18:59.814Z, 44 suite results, 100 fresh tasks, exit 0, 2,552,079 ms)",
    "Three read-only dotln-worker reviewers, scratch probes and logs under the DotLn session scratch final-003/: the lifecycle reviewer's close matrix over main's, checkpoint 22's and checkpoint 28's closeTargetWorktree in both modes (A1 to A5; logs/close-matrix.txt, close-states2.txt, close-states3.txt, rebase-guard.txt, redact-compare.jsonl); the text reviewer's lint, discovery and starter probes (B1 in logs/q2-stack.txt and q2-cli.txt; a v0.81.0 export of main refreshed by the subject to refreshed then current; 2,479 lint runs over 175 PR bodies, 166 release notes and 1,069 commits with identical non-runtime findings on both trees; the installed claude, codex and copilot help parsed with no regression); the core reviewer's fold of all 175 control segments, 45 historical refutation subject hashes, self publication, release surfaces and configuration on both trees with no difference for an order without repositoryId",
    "Git guard probe by this reviewer, 2026-10-15T13:29Z in the session scratch: a clone whose main is held by a linked worktree deleted from disk (git worktree list marks it prunable) refuses git fetch origin main:main with fatal: refusing to fetch into branch 'refs/heads/main' checked out at '<scratch>/held', exit 128"
  ],
  "rejected": [
    {
      "option": "Fail on A1 as a regression of main's close",
      "reason": "Main closed that state only because it never updated the base; the order's Design makes the close update the base and names the route Git refuses there, so the named refusal with its remedy is the designed outcome, not an unintended break. The inaccurate D036 sentence is a record defect, boarded here."
    },
    {
      "option": "Fail on B1 or A4 because a function-level probe shows main's output differing",
      "reason": "Neither changes an outcome any supported route reaches: every body the repository has published lints identically on both trees, and the starter refresh pushes to a GitHub URL. A three-line fix each belongs to the next order that edits those files."
    },
    {
      "option": "Spend the planned refuter on the six items",
      "reason": "The operator directed the review back to its outcome; each item's route follows from the reviewers' probes, the Git guard probe and the Design's text without another twenty-minute pass."
    }
  ],
  "followup": "Next order that edits these surfaces, low priority. (A1) scripts/lib/target-worktree-close.mjs: when a stale entry holds the base and the local base already contains the order branch, decide whether the close completes without moving the base (updating only refs/remotes/origin/<base>) instead of refusing; D036's 'loses nothing main closed' is corrected here. (A2) Move an unchecked-out base with git fetch origin <base>:<base> as the Design names, keeping Git's guard for a worktree rebasing it, instead of update-ref. (A3) Name the stale writer-transition lock by role, print the rerun command and a recovery route. (A4) scripts/lib/git.mjs redactPaths: mask a local absolute path inside a file:// URL and after a colon as starter refresh's own redaction did, keeping https paths readable. (A5) The unmerged-branch refusal names the condition and the rerun command instead of Git's command line. (B1) scripts/lib/outward-lint.mjs: push rendered character units in a loop rather than spreading one argument per code point, with a case over 130,000 characters in one fence. Reproductions: the probes named in this record's evidence.",
  "reopenWhen": "A target close, a starter refresh or a publication meets one of these states in live use, or a planning pass allocates the row."
}
```
