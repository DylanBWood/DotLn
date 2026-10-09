# WO-188 self-review: adversary of the acceptance criteria

A fresh `dotln-worker` agent, spawned read-only before `implementation-ready`
on 2026-10-08 with only the order and the diff against 28d32e26, and asked to
show each criterion unmet. Its report follows verbatim; the executor's
disposition of each finding is in `decisions.md` (D003, D005, D006, D009,
D011, D014, D017, D024, D025, D026, D028, D029) and in the handoff. Paths in
the report are repository-relative.

## Report

WO-188 acceptance-criteria adversary report (read-only; base 28d32e26; worktree state as of 2026-10-08 ~00:10Z). Probes ran as scratch scripts outside the repository that import the worktree's own modules; nothing under the worktree was written.

1. Criterion 23. Severity: blocking. The comment check never sees an order identifier at the start of a JSDoc comment.
   - Where: scripts/lib/comment-labels.mjs:95 keeps the leading `*` of a block body on the first row, and line 139 tests ORDER_LEAD only against that first row.
   - Probe (commentLabelFindings plus feedbackSourcesComments): `/** WO-172: a recorded correction... */` gives []. A multi-line `/**` block whose first line is ` * WO-172: ...` gives []. `/* WO-172: lead */` gives order-lead.
   - Repository: `git grep -nE '^\s*/\*\* \(?WO-[0-9]{3}'` finds 29 such lines. checkCommentLabels(repo) flags none of them (48 findings, all baselined).
   - 9 of these lines sit in files outside every evidence edition, so the Design's rule that such lines are rewritten in this order is unmet: scripts/lib/meta.mjs:1188, scripts/lib/derived-contract.mjs:117, scripts/lib/target-repair.mjs:1, scripts/resident-bind.mjs:594, packages/skeleton/src/local-model-transport.ts:27 and :94, scripts/test-portfolio.mjs:217 and :267, scripts/test-vertical-judgment.mjs:58.
   - Fix: strip the JSDoc `*` from the first row and test the first non-empty row; add a `/**` case to scripts/test-comment-labels.mjs; rewrite the 9 lines; baseline the 20 registered ones.

2. Criterion 23. Severity: blocking. A file in no evidence edition still holds a finding label in a comment.
   - Where: scripts/lib/entropy-review.mjs:732 has "(VER-001 finding 3)". evidenceSources registers this file in no edition, and this order edited it.
   - Why it passes: FINDING_LABEL (comment-labels.mjs:20) only matches letter-plus-digit labels, and only bare F/N/R.
   - Probe: `// Fixes B3 from the review.` gives []; `// ... per finding 1 of VER-002` gives [].
   - Reports use other letters: `| X1 |` label rows in docs/verifications and docs/final-reviews count R 21, A 19, M 18, B 17, N 14, F 4.
   - Fix: rewrite line 732; widen FINDING_LABEL to numbered findings and the letters reports actually use.

3. Criterion 22. Severity: blocking (already recorded unmet in D024). The executor root grew instead of shrinking.
   - Evidence: `wc -c` gives 21,792 bytes for .claude/skills/dotln-executor/SKILL.md, against 21,255 for `git show 28d32e26:` of the same file. role-roots-before.txt and role-roots-after.txt agree.
   - D024 records the clause unmet and makes no trim.
   - Fix: none in code. The clause needs the operator's waive or a re-worded criterion before a pass.

4. Criterion 25. Severity: blocking. D028's confirmation from the registries is wrong.
   - D028 says FEEDBACK_SOURCE_PATHS holds "36 judged feedback sources" and that the only one touched is packages/compiler/src/artifact-identity.ts.
   - Counted in packages/skeleton/src/feedback-audit.ts: 59 entries. Intersecting the dist export with `git diff --name-only 28d32e26` gives three edited: package-lock.json, packages/skeleton/package.json, packages/compiler/src/artifact-identity.ts.
   - All three edits are version labels or pins, so the carry argument may still hold. The stated facts do not.
   - Fix: correct the count and the list in D028; state that all three are release-label changes the carry excluded.

5. Criterion 26. Severity: blocking. A write-back states something false.
   - Where: docs/product/05-pattern-library.md:1254-1255 says WO-188 is the first order executed under WO-196's fork trigger.
   - Evidence: WO-196 merged at fdb205c1 (2026-10-07 13:38 -0400). Activation in docs/control/orders: WO-197 at 2026-10-07T17:41:13Z, WO-199 at 2026-10-08T00:41:17Z. D001 itself cites WO-199's handoff comparison.
   - Fix: drop the clause, or name WO-197 and WO-199 as the first orders run under it.

6. Criterion 13. Severity: blocking on the criterion's wording (the order's 2026-10-07 carry-in narrows it).
   - The criterion says a new `evidence` or operator-named field quoting the operator without a digest fails at completion.
   - scripts/test-docs-check.mjs:1410 asserts that an `evidence` quotation only produces the advisory record `WO-999-D001/evidence-1`. An untyped operator-named field (`operatorAuthorization`) is also advisory only.
   - Only a typed `operatorQuote` fails (scripts/docs-check.mjs:472), and only inside docs-check. No fixture shows a completion refusing.
   - D015 cites the planning pass's narrowing.
   - Fix: the reviewer or operator records the narrowed reading as criterion 13's reading, or evidence-field findings without a digest become failures (forward only) with a completion fixture.

7. Criterion 15. Severity: blocking (the evidence does not show the criterion with the overlay as shipped).
   - In docs/evidence/WO-188/ac15-overlay-evidence.txt, step 2 (export removed: 5 failures) ran before step 6 changed the overlay filter to leave out the console's generated fixtures.
   - The removed-export run was not repeated after step 6.
   - Its "first failure detail:" line is empty.
   - Two of the five step-2 failures (untracked stash collision; WO-167 --continue) also failed in step 4 with the bytes restored, for the fixtures-manifest reason.
   - The committed fixture only checks that the bytes are copied.
   - Fix: rerun step 2 with the final overlay and record the failing assertion that names the console build, or add a focused committed case.

8. Criterion 7. Severity: minor. The enqueue route attributes a task notice to the operator.
   - Probe: recordOperatorMessage on a transcript whose relevant row is `{type:"queue-operation",operation:"enqueue",content:<notice>}` journals source claude-prompt-hook, attribution operator, routeSource transcript-enqueue. WO-142's decisions (lines 342-343) record notices in this enqueue-with-content shape.
   - Cause: packages/skeleton/src/harness-host.ts:874 reads `row.commandMode` on enqueue rows. No record shows that field exists there.
   - Checked and not a problem: a hook_success row after the queued attachment is filtered out, so the shape WO-178 D014 recorded is classified correctly.
   - Fix: an enqueue match with no recorded mode is `unattributed`; add that fixture.

9. Criterion 12. Severity: minor. New entropy run records still carry a private temporary path.
   - Where: `subject.scratchRepository` keeps an absolute system-temp path (scripts/lib/entropy-review.mjs:380 and :1497). The committed docs/instance/entropy-reducer/runs/REVIEW-005.json shows both fields absolute today.
   - The screen reads Markdown only, and only under the configured roots. Untouched private-temp paths remain in packages/console/README.md:27 and :373, packages/skeleton/README.md:836, packages/skeleton/fixtures/wo050/README.md:5.
   - Probe near misses that pass HOME_PATH (scripts/docs-check.mjs:495): `/root/...`, `/var/tmp/...`, `/tmp/.dotln-...` (DotLn's own dot-name style), and a JSON-escaped `\/Users\/...`.
   - Fix: write scratchRepository as a placeholder or relative to the temp root; widen the regex and the scope.

10. Criterion 21. Severity: minor. The helper-reuse detector misses new scripts.
    - scripts/test-helper-reuse.mjs:329 lists tracked files only. This order's new scripts/lib/comment-labels.mjs, scripts/comment-labels.mjs and scripts/test-comment-labels.mjs are untracked and so unscanned (`git ls-files` on them prints 0 lines).
    - `directGit` also misses `execSync("git status")` and a Git program held in a variable.
    - Fix: add `--others --exclude-standard`; match a quoted `git` followed by a space or the closing quote.

11. Criterion 24. Severity: minor. Some relative-link forms slip through, and the regenerated evidence is weaker than it reads.
    - Probe of relativeLinkFailures and absoluteBodyLinks (scripts/lib/github-body.mjs:126-127): these are neither rewritten nor flagged: `[x](<a b.md>)`, `[x](p.md 'title')`, `[x](file(1).md)`, `<a href="rel">`, `[nested [b]](rel)`.
    - A definition `[r]: <rel path>` is rewritten to a wrong URL, which then passes the check.
    - The regenerated WO-199 meter in wo199-pr-body.md is rendered from this worktree's collection, so it holds a WO-188 row and a WO-188/executor dispatch row.
    - wo199-regeneration.json reports `before.unavailableCells: 0` beside 75 `unavailable` tokens.
    - Order rows whose values are all unavailable are kept; the Design says such rows are omitted.
    - Fix: read links from the Markdown parser's link nodes; render the meter at WO-199's cutoff.

12. Criterion 1. Severity: minor. Two nested-repository cases the release fixtures do not cover.
    - Linked worktree (probe: inventoryMaterial plus scratchRepositoryFacts): a linked worktree of another repository placed under an ignored path is classified disposable ("commit state unknown") and goes to rmSync with its uncommitted files. Its record says remoteHeld false although the owning repository holds the commit.
    - The base fixture that kept linked metadata ("WO-176 repository disposal uses ... linked metadata") was deleted, but scripts/lib/paths.mjs:190 still says linked worktrees need an explicit word.
    - Untracked, unignored nested repository: it is not in the inventory at all (probe: listed false), so close keeps it as dirt instead of removing it. Every release fixture uses an ignored `scratch-material/` path.
    - Fix: refuse or route gitfile-linked worktrees through their owning repository; fix the comment; add fixtures for both cases.

13. Criterion 3. Severity: minor. The reference-transaction half of the hook fixture proves nothing.
    - No Git call in the close path writes a ref.
    - A scratch repository given the same reads without the disabling flags printed "reads WITHOUT disabling flags fired: fsmonitor" and never fired reference-transaction.
    - The fixture's real coverage is the planted fsmonitor (scripts/test-process-debt.mjs:10885-10907).
    - Fix: correct the claim in D003 and D005, or plant a hook that a read can trigger.

14. Criterion 4. Severity: minor. The submodule fixture lacks the trigger of the original defect.
    - release_case_submodule_force (scripts/test-release.sh:1245) uses a derived worktree with no untracked intake unit. D037 (a) is about `--force`, which the old code passed only when such a unit existed, so base behaviour there differs only in the message.
    - Fix: plant a `docs/intake/x` repository in the same worktree.

15. Criterion 9. Severity: minor. The correction list never grows.
    - correctionsNotRecorded is a frozen list of 15 ids from WO-172. Only scripts/lib/meta.mjs:151 and a test read it; nothing writes it.
    - So a future decision whose dispatch names a correction is never counted, and D011's title overclaims.
    - Fix: state the limit, or have the direction reading regenerate the list.

16. Criterion 17. Severity: minor. The reserved lane-name list is incomplete.
    - RESERVED_LANE_NAMES (scripts/refute-plan.mjs:95) omits names the lane's own tools read: authority-grants.json (scripts/lib/authority-grants.mjs:17), adjacent-work.jsonl, resident, entropy, plan, refutations, process, derived-orders.
    - An export to a missing authority-grants.json would create the grant registry file.
    - Fix: confine exports to a dedicated subdirectory of the lane.

17. Criteria 23 and 12. Severity: minor. Neither baseline is protected against growth.
    - Nothing compares docs/control/comment-baseline.json or doc-baseline.json `homePaths` with the base and refuses an added fingerprint.
    - The comment baseline's `admitted` map lets a file outside every edition in with any reason (scripts/lib/comment-labels.mjs readBaseline and checkCommentLabels).
    - Fix: refuse added fingerprints and admissions against main's copy.

18. Criterion 23. Severity: minor. Shell heredoc data is judged as comments.
    - Probe: a `.sh` heredoc data line `# WO-099 — fixture heading` is flagged order-lead.
    - Trailing `cmd # WO-044: ...` comments are judged too, but only because the second probe line was itself a heredoc line.
    - Fix: skip heredoc bodies in shellComments.

found 18

Criteria I could not break (fixture run and passing, or code read): 2 and 6 (the WO-178 near-miss tests at scripts/test-harness.mjs:1426 and WO-195 printers; recorded not reproduced); 5 (prune fixture passes); 8 (D010 holds the Copilot observation; the fixture passes, and the hook answered a failed Bash call live in this session); 10, 11, 14, 16, 18, 19, 20 (fixtures pass or the code matches); 13's repair record (all 8 paraphrased keys and the reader fix are no longer findings; 0 current advisories); new-record screen (no private path, personal identifier or quoted operator words in any new WO-188, discovery or baseline file).

Criterion I could not attack with executable evidence: 27. At review time the two latest recorded `npm run test:docs` gates both exited 1. The first failed on a soft wrap in docs/final-reviews/WO-188/PR.md; the second's failing tasks were not read. The work is in progress. `git --no-pager diff --check` is clean, harness and authority checks pass now, and the package changes are version pins only, so no new dependency. Final green needs the executor's handoff runs.

## Executor disposition

Fixed before handoff: 1 (JSDoc first row, first non-empty row; nine lines rewritten; twenty baselined), 2 (label regex widened to a numbered finding before or after its report and to the letters reports use; the entropy line rewritten), 4 (D028 corrected from the built export), 5 (the clause dropped), 7 (steps 7 to 9 of the evidence), 10 (untracked scripts and a quoted `git` followed by a space), 11 in part (angle-bracket destinations, quoted titles, bracketed definitions, encoded paths, all-unavailable order rows omitted; parser-based reading and HTML anchors recorded as limits in D026), 12 in part (a linked worktree is never scratch and a disposable word on it refuses; the untracked unignored case is the D003 follow-up), 13 (D003 and D005 corrected), 14 (an intake unit in the fixture), 16 (the lane's own names reserved), 18 (heredoc data lines are not comments). Recorded, not fixed: 3 (criterion 22 stays unmet in the handoff), 6 (criterion 13 is judged by the order's own 2026-10-07 carry-in), 8 (D009 follow-up FUP-d4493f4251e69c87), 9 (D014 limits), 15 (D011 limit), 17 (D025 limit).
