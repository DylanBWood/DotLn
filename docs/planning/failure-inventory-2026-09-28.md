# Failure inventory, 2026-09-28

Filed by the [2026-09-28 planning pass](failures-across-phases-2026-09-28.md) at the operator's direction that the recorded failures be addressed. It lists every judgment the control logs record as failed, with the findings that failed it, and every correction the decision records hold. The reports and decisions stay the authority; a row here is a pointer and a classification, in the planner's and the surveys' words.

Sources, read on `main` at `5f3849ec`: `docs/control/resume.jsonl` and the 95 segments under `docs/control/orders/` (961 events in the segments, 158 in the older log); the 96 reports those events name; the 928 structured decisions in 81 decisions files. Eight read-only surveys read the 96 reports whole, in batches by order, and classified each finding that caused the fail verdict; the planner read the 56 corrections. Times are event-to-event wall-clock between a request and its completion, so a wait inside an attempt is included; `unknown` means an event carries no time.

## How a finding is classified

| Field | Values |
| --- | --- |
| Class | `boundary-guard` a guard admits what it must refuse or refuses what it must admit; `behavior-edge` wrong for an input, state, ordering or failure path ordinary use has not reached; `behavior-ordinary` wrong on a path ordinary use reaches; `gate-red` a required gate or check fails at the subject; `not-implemented` a deliverable or part of a criterion is missing; `record-wrong` evidence, decisions, counts or claims are missing, stale or unsupported; `docs-writeback` a document write-back is missing or wrong; `order-text` the order could not be met as written; `scope-authority` a change outside the order's scope or authority; `integration-release` merge, retiming, re-mint or release mechanics; `test-does-not-prove` a test passes without proving its claim; `harness-environment` tooling caused the failure, not the change; `budget-missed` a stated bound was missed |
| Origin | the phase that introduced the defect: planning (the order text), implementation, repair, verification (the judge's own error), integration, harness, unknown |
| Found by | a constructed case, the criterion's own check, a gate run, a record audit, reading, integrating main |
| Ordinary use | whether the report shows the defect on real repository data or the normal path |
| Existing check | a command or check already in the repository that would have shown the defect to the executor before handoff, or none |
| History | new, persists from an earlier report, or introduced by the repair before it |

Severity is the report's own word, normalized: major and high read high; moderate, material and P2 read medium; minor and low read low. A finding the report only calls blocking reads `blocking, ungraded`.

## Failed judgments

### WO-003

**[VER-001](../verifications/WO-003/VER-001.md)** — verification, date unrecorded, judged by actor unrecorded; criteria judged unmet: 3; judging unknown, repair unknown; 20 other findings and observations.

- criterion 3 (blocking, ungraded): `test-does-not-prove`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The crash-restart test stays green when recovery from the durable log is replaced by handing over the in-memory command, so re-dispatch after restart is not demonstrated.

### WO-004

**[VER-001](../verifications/WO-004/VER-001.md)** — verification, date unrecorded, judged by actor unrecorded; criteria judged unmet: acceptance-evidence 6 (pushes only that tag); acceptance-evidence 9 (hardening review); judging unknown, repair unknown; 13 other findings and observations.

- B1 (blocking, ungraded): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Both push sites, the release tag push and the work-order branch push, omit the option that stops Git following tags, so with that configuration set Git also publishes unrelated local annotated tags.
- F1 (required, ungraded): `test-does-not-prove`, from implementation, found by the criterion's own check, not reached in ordinary use, existing check: re-reading the order's criterion list, new. No release or worktree test lists the remote refs after a push, so the acceptance clause that only the validated tag is pushed has no assertion that could observe a leak.
- F2 (required, ungraded): `order-text`, from planning, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list, new. The pre-handoff hardening review that an acceptance bullet requires left no durable record, and the bullet names no artifact, so it cannot be verified as written.
- F3 (required, ungraded): `behavior-ordinary`, from implementation, found by reading, reached in ordinary use, no existing check, new. The documented and printed release-close command cannot run for the closeout of this same order, because main lacks the release script until the order merges and no document covers that bootstrap.
- F4 (required, ungraded): `docs-writeback`, from implementation, found by reading, reached in ordinary use, no existing check, new. The playbook rewrite removed the PR-publication command and no durable document names it, leaving final review with push-and-PR authority but no documented way to use it.

### WO-006

**[VER-001](../verifications/WO-006/VER-001.md)** — verification, date unrecorded, judged by actor unrecorded; criteria judged unmet: 4; 8; judging unknown, repair unknown; 2 other findings and observations.

- 1 (blocking, ungraded): `record-wrong`, from harness, found by a record audit, reached in ordinary use, no existing check, new. Runbook and ADR-0003 state a Claude permission posture the machine contradicted: auto-allow was on after the operator switched modes mid-verification, and eleven local allow rules were undocumented.
- 2 (medium): `record-wrong`, from implementation, found by a record audit, reached in ordinary use, existing check: the publication check's printed locks, compared with the captured transcript, new. The captured staleness demonstration shows lock hashes that no shipped edition carries, because sources were edited and the locks regenerated after the capture without recapturing.

**[VER-002](../verifications/WO-006/VER-002.md)** — verification, date unrecorded, judged by actor unrecorded; no numbered criterion judged unmet; judging unknown, repair unknown; 3 other findings and observations.

- 1 (medium): `record-wrong`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. One index row labels the kernel-loop section verified although 8 of 14 cadence kinds and 5 of 11 program kinds that section pins throw as deferred in the shipped kernel.
- 2 (medium): `record-wrong`, from repair, found by a record audit, reached in ordinary use, existing check: the publication check's printed locks, compared with the cited section (lock pointer only), introduced by the repair before it. Three delivered statements no longer match the tree: the receipt pointer to the section holding the final locks, the section range in the discontinuity note, and the roadmap count of expansions.
- The judge's own error, as its report records it: The lead verifier withdrew three findings it had adjudicated itself, one a material ledger-duty claim, after its panel refuted them, and attributes 13 new local allow entries to its own fan-out.

### WO-007

**[VER-001](../verifications/WO-007/VER-001.md)** — verification, date unrecorded, judged by actor unrecorded; no numbered criterion judged unmet; judging unknown, repair unknown; 3 other findings and observations.

- F1 (blocking, ungraded): `scope-authority`, from planning, found by a record audit, reached in ordinary use, no existing check, new. Seven draft work orders share most of their text with local intake notes and carry no provenance record showing which text was the source.
- F2 (blocking, ungraded): `scope-authority`, from planning, found by reading, reached in ordinary use, no existing check, new. The raw intake notes of that day sat in the ignored intake folder of the work-order worktree rather than as the single copy in the main checkout.
- F3 (high): `order-text`, from planning, found by reading, reached in ordinary use, no existing check, new. A draft order forbids any tracked generated residue artifact yet lists a generated residue file as a deliverable that its tests compare, so its clauses cannot all be met.
- F4 (high): `order-text`, from planning, found by reading, reached in ordinary use, no existing check, new. A draft order lists intake reconciliation as a hard dependency while the work-order map and its own clean-room section treat it as activation preflight.
- F5 (high): `order-text`, from planning, found by reading, reached in ordinary use, no existing check, new. A draft order widens the size-coded beacon codeword with an authenticator field but requires no new size bound, sparse-file decision or feasibility proof.
- F6 (low): `order-text`, from planning, found by reading, ordinary use unknown, no existing check, new. A draft order names another order as a hard dependency only to avoid conflicting hunks, which a sibling draft treats as recommended sequencing.

### WO-019

**[VER-001](../verifications/WO-019/VER-001.md)** — verification, date unrecorded, judged by claude-code claude-opus-5; criteria judged unmet: 7; judging unknown, repair unknown; 7 other findings and observations.

- F1 (blocking, ungraded): `test-does-not-prove`, from implementation, found by a constructed case, not reached in ordinary use, existing check: re-reading the order's criterion list, new. The resume suite stays green with the final-review header check deleted, and five more new guards have no test case.

### WO-041

**[VER-001](../verifications/WO-041/VER-001.md)** — verification, 2026-09-07, judged by claude-code claude-opus-5; criteria judged unmet: 3; judging 19 min, repair 22 min; 5 other findings and observations.

- 1 (unlabeled): `boundary-guard`, from planning, found by a constructed case, ordinary use unknown, no existing check, new. The local-terms screen builds only one- and two-token candidates per line, so a listed term of three or more words in spaced form, or split across lines, passes while the screen reports present.
- 2 (unlabeled): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The deferral marker accepts any committed order that is not earlier in the sequence, including closed orders outside it, which suppresses the uncovered-thesis hold.
- The judge's own error, as its report records it: Its first full gate run failed on the work-order index made stale by its own dispatch event; it regenerated the index and reports the second, green run.

**[FINAL-001](../final-reviews/WO-041/FINAL-001.md)** — final review, 2026-09-07, judged by claude-code claude-fable-5-1; criteria judged unmet: 6 (README release block only); judging 9 min, repair 56 min; 8 other findings and observations.

- 1 (release target) (blocking, ungraded): `integration-release`, from integration, found by a gate run, reached in ordinary use, no existing check, new. The release target was published by the sibling order, which merged three minutes after the passing verification, so heading, README and roadmap need an authorized retime.
- 1 (README block) (blocking, ungraded): `docs-writeback`, from implementation, found by a gate run, reached in ordinary use, existing check: the release surfaces check, new. The README release block names two strict versions where the release-block rule, in force at the executor base revision, requires exactly one.
- 2 (blocking, ungraded): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: the release surfaces check, new. Eight skeleton source files were edited or added while the package version stayed unchanged, failing the component-version rule that predates the order.
- 3 (blocking, ungraded): `integration-release`, from integration, found by integrating main, reached in ordinary use, no existing check, new. Main moved after the passing verification: merging conflicts in seven files, and manifest changes from the sibling invalidate the accepted feedback edition, which needs a fresh live run.

### WO-039

**[VER-001](../verifications/WO-039/VER-001.md)** — verification, 2026-09-07, judged by claude-code claude-opus-5; criteria judged unmet: 3; judging 26 min, repair 77 min; no other finding or observation.

- Finding 1 (medium): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 3 says each generated hook), new. Generated finish.mjs Stop hook had no fixture proving its verdict equals feedbackBoundary or that removing the unit allows; the shared parity helper only handles a single-unit policy.
- Finding 2 (medium): `test-does-not-prove`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. Live smoke compared reads under a scope that refuses out-of-set reads, so an empty outside-set shows enforcement, not the skill; refused reads in two role records were neither disclosed nor path-recorded.
- Finding 3 (high): `behavior-ordinary`, from implementation, found by a gate run, reached in ordinary use, no existing check, new. Installed Stop output-review gate demanded whole-file read receipts for all 127 changed files; ten exceed the Read tool's token cap so can never mint one, and the refusal names no file or count.
- Finding 4 (low): `record-wrong`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. Executor receipt claimed fixtures reject stale owned files and unowned collisions; only one-byte drift and symlink refusal were asserted, leaving four refusal paths without a fixture.
- The judge's own error, as its report records it: First npm test run failed because the verifier's own verify transition staled the generated work-order index; it refreshed the index and re-ran green.

**[VER-002](../verifications/WO-039/VER-002.md)** — verification, 2026-09-08, judged by codex-cli gpt-6-astra; no numbered criterion judged unmet; judging 19 min, repair 61 min; no other finding or observation.

- F1 (high): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. Two sessions reclaiming the same dead holder's reservation could both be admitted: the later reclaimer unlinked the path without checking it still held what it had observed, deleting the first's live lock.

**[VER-003](../verifications/WO-039/VER-003.md)** — verification, 2026-09-08, judged by codex-cli gpt-6-astra; criteria judged unmet: 8; judging 14 min, repair 106 min; no other finding or observation.

- F1 (high): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-002. A session's self-refresh kept the same reservation file name, so a reclaimer that had already judged the old owner dead removed the refreshed reservation and was admitted beside the owner.
- F2 (high): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-002. Unforced operator release judged liveness on one observation, then retired a second unvalidated observation, removing a live replacement while journaling the old dead holder.
- F3 (medium): `gate-red`, from repair, found by a gate run, reached in ordinary use, existing check: npm test (or node scripts/harness-evidence.mjs), introduced by the repair before it. npm test exited 1: the newest live-holder smoke record was passed:false because its pass rule required an attribution refusal the session never attempted; receipt links still named older runs.

**[FINAL-001](../final-reviews/WO-039/FINAL-001.md)** — final review, 2026-09-08, judged by claude-code claude-opus-5; no numbered criterion judged unmet; judging 15 min, repair 452 min; no other finding or observation.

- F1 (blocking, ungraded): `integration-release`, from integration, found by integrating main, reached in ordinary use, no existing check, new. Main advanced by two merged orders adding a workspace; merging changes the feedback-evidence subject hash, so the WO-039 edition goes stale and needs a fresh live audit the reviewer must not author.

### WO-042

**[VER-001](../verifications/WO-042/VER-001.md)** — verification, 2026-09-09, judged by codex-cli gpt-6-astra; criteria judged unmet: 5; judging 576 min, repair 38 min; no other finding or observation.

- F1 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Contradiction guard accepted an authored note naming an exact opposite-envelope effect id when an em dash, en dash or ellipsis followed it; the tokenizer excluded only a small ASCII punctuation set.

### WO-126

**[VER-001](../verifications/WO-126/VER-001.md)** — verification, 2026-09-10, judged by claude-code claude-opus-5; criteria judged unmet: 6; 8; 18; judging 28 min, repair 226 min; 5 other findings and observations.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Rewritten classifier compared exact program names, so path-qualified git push, gh pr create and npm publish classified as allowed shell.run where the superseded regex denied them.
- F2 (high): `budget-missed`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test at the delivered tree, new. Fast gate took 143.74 s and 139.37 s against its 120 s budget at the delivered tree, so npm test exited 1 with all suites green; the receipt's 106.9 s was measured at an earlier tree.
- F3 (medium): `boundary-guard`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. Tokenizer split on newlines before quoting, so commands with a multi-line quoted argument were refused, with the same message as a destroyed runtime; the verifier's own commands hit it.
- F4 (medium): `scope-authority`, from implementation, found by reading, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 18: no new dependency), new. Build shelled out to python3 for directory exchange, an undeclared host prerequisite, although criterion 18 says no new dependency and the receipt said none was added.

**[VER-002](../verifications/WO-126/VER-002.md)** — verification, 2026-09-10, judged by claude-code claude-fable-5-1; criteria judged unmet: 8; judging 50 min, repair 50 min; 4 other findings and observations.

- F10 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-001. Classifier stripped only path prefixes and the env and command wrappers, so exec, time, nohup, timeout, nice, xargs, eval, subshell and group forms of denied effects classified as allowed shell.run.
- F11 (medium): `boundary-guard`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. Attribution guard matched 'git commit' anywhere in the raw command text, so echo and grep commands that only quote it were refused with the runtime-unavailable message.
- F12 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. An unquoted parameter expansion in the program or subcommand position, such as git $P origin, classified as shell.run instead of being refused as an invocation the classifier cannot read.
- The judge's own error, as its report records it: Notes its own read-only probes ran during the full gate and may have contributed to the F13 fixture timeout; the idle re-run is its controlled observation.

**[VER-003](../verifications/WO-126/VER-003.md)** — verification, 2026-09-10, judged by claude-code claude-fable-5-1; criteria judged unmet: 8; judging 50 min, repair 46 min; one other finding or observation.

- F17 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-002. A shell reading a piped program, and node, perl, python3, ruby and awk one-liners containing git push, classified as allowed shell.run; the prior regex denied every one.
- F18 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Inline git alias configuration, git send-pack and gh api, comment, review and issue writes classified as shell.run; not regressions, but against the classifier's rule to refuse what it cannot read.
- F19 (medium): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. Session state was written by truncate-then-write, so concurrent hooks on one session read partial JSON and refused tool calls with the catch-all runtime message; seen live, then reproduced.
- The judge's own error, as its report records it: Discloses its own error: its gate command also ran git add --intent-to-add, staging 77 entries it later removed; it also says VER-002's repair direction did not separate interpreters from data programs.

**[VER-004](../verifications/WO-126/VER-004.md)** — verification, 2026-09-10, judged by claude-code claude-fable-5-1; criteria judged unmet: 8; judging 66 min, repair 46 min; one other finding or observation.

- F21 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-003. Groups or redirected stages piped to a shell, csh and tcsh, combined interpreter flags, unlisted interpreters, and quoted shell commands under find -exec, script or sudo classified as shell.run.
- F22 (medium): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-003. gh api with an --input body, and gh api graphql --input, classified as a read; the classifier implied POST only for field flags, short of the repair's own decision D015.

**[VER-005](../verifications/WO-126/VER-005.md)** — verification, 2026-09-10, judged by claude-code claude-fable-5-1; criteria judged unmet: 8; 17; judging 61 min, repair 49 min; 2 other findings and observations.

- F24 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-004. The literal floor skipped effect programs' own arguments and dropped assignment values, so npm, pnpm and yarn exec, git -c diff.external, GIT_EXTERNAL_DIFF and X='git push' expansions classified shell.run.
- F25 (medium): `not-implemented`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. Meter's policy-resistance guardRefusals read 0 after six live refusals because no hook refusal is journaled, so the signal criterion 17 names can never move.
- F26 (low): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Program names were matched case-sensitively, so GIT push, GH pr create and NPM publish classified as shell.run on a case-insensitive filesystem where they run the real program.
- The judge's own error, as its report records it: Says VER-004's repair direction exempted operand-classified effect programs and so left F24 open; also its own tail discarded the only output of a failed release case.

**[VER-006](../verifications/WO-126/VER-006.md)** — verification, 2026-09-10, judged by claude-code claude-fable-5-1; criteria judged unmet: 8; judging 27 min, repair 54 min; one other finding or observation.

- F29 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, persists from VER-005. Operands after an effect program's subcommand were treated as data, so git rebase -x, bisect run, filter-branch, difftool -x, npm explore, yarn workspace exec and git config routes admitted denied commands.
- The judge's own error, as its report records it: Says VER-005's repair direction (other subcommand operands stay data) was followed and did not list the operands these programs execute; its probe also added one row to the order's meter.

### WO-127

**[FINAL-001](../final-reviews/WO-127/FINAL-001.md)** — final review, 2026-09-11, judged by codex-cli gpt-6-astra; criteria judged unmet: 5; judging 27 min, repair 24 min; one other finding or observation.

- F1 (blocking, ungraded): `gate-red`, from harness, found by a gate run, reached in ordinary use, no existing check, new. The reviewer gate passed 36 of 37 suites: a generated-hook subprocess stalled reading its input and hit the 20 s deadline, the same unrepaired timeout the order was chartered to diagnose.
- The judge's own error, as its report records it: Records that a resumed observer misattributed the executor's interim edits to the old review session, so a fresh failed-handoff session re-adopted only the reviewer's own eleven outputs.

### WO-043

**[VER-001](../verifications/WO-043/VER-001.md)** — verification, 2026-09-11, judged by claude-code claude-opus-5; criteria judged unmet: 6; judging 40 min, repair 73 min; 5 other findings and observations.

- F1 (low): `docs-writeback`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. The audience/status index row for a roadmap section that still holds candidate material was changed from planned to implemented, overstating maturity against the index rule for mixed sections.

**[VER-002](../verifications/WO-043/VER-002.md)** — verification, 2026-09-11, judged by claude-code claude-opus-5; criteria judged unmet: execution-record obligation: command prefixes (partly met); judging 36 min, repair 24 min; no other finding or observation.

- F2 (low): `not-implemented`, from repair, found by the criterion's own check, reached in ordinary use, existing check: re-reading the execution record's obligation list, introduced by the repair before it. The two new session-command prefixes exist only in the hand-written floor; no generated Contributor instruction carries them, though the obligation and product 07 say they do.
- F3 (medium): `scope-authority`, from repair, found by reading, reached in ordinary use, no existing check, introduced by the repair before it. The repair reworded existing paragraphs of the locked hand-written floor, shrinking it to stay under a byte ceiling, with no recorded operator authorization of the new text.
- F4 (low): `docs-writeback`, from repair, found by reading, reached in ordinary use, no existing check, introduced by the repair before it. Product 07's cold-start table lists the new goal-card read for no role and still states the old refuter input boundary, contradicting the regenerated skills.
- F5 (medium): `record-wrong`, from repair, found by a record audit, reached in ordinary use, no existing check, introduced by the repair before it. The committed cost meter sums two partial measurement windows, so executor tokens read about 44% below what the session counters give for the two completed dispatches.
- The judge's own error, as its report records it: Notes that VER-001 first reported token usage as null although the transcript held the counts, and was corrected after recording.

### WO-125

**[VER-001](../verifications/WO-125/VER-001.md)** — verification, 2026-09-11, judged by claude-code claude-opus-5; criteria judged unmet: 2 (refusal clause); judging 38 min, repair 214 min; 7 other findings and observations.

- F1 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. On the admitted CLI version the adapter forwards any effort string except unknown, including unobserved and malformed values that the previous code refused before launch.
- F3 (blocking, ungraded): `harness-environment`, from verification, found by a gate run, reached in ordinary use, no existing check, new. The verifier wrote its report while its own full gate was running; the runner's input comparison voided the run after 651 s, and no hook refused the write.
- The judge's own error, as its report records it: F3 is the verifier's own error: it wrote and edited this report while its full gate was running, which voided that run.

**[VER-002](../verifications/WO-125/VER-002.md)** — verification, 2026-09-12, judged by claude-code claude-opus-5; criteria judged unmet: 5; execution-record F3 scope (partly met); judging 55 min, repair 28 min; 6 other findings and observations.

- F1 (medium): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. During a live gate the new write guard compares protected roots case-sensitively, so case-variant spellings of installed and build directories are admitted on a case-insensitive disk.
- F2 (low): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The guard treats a dangling symlink as itself and resolves parent traversal before symlinks, so writes through such pre-existing links in scratch create files in the protected tree.
- F3 (medium): `gate-red`, from repair, found by a gate run, reached in ordinary use, no existing check, introduced by the repair before it. The new held-gate fixture holds each stage for a fixed 30 s while its work takes about 28 to 31 s, so it failed the canonical gate under ordinary load (36 of 37 suites).

**[VER-003](../verifications/WO-125/VER-003.md)** — verification, 2026-09-12, judged by claude-code claude-opus-5; criteria judged unmet: execution-record F3 scope (not fully met); judging 51 min, repair 20 min; 5 other findings and observations.

- F1 (low): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, new. The guard resolves paths, not inodes: a pre-existing hard link in ignored scratch to a tracked file lets shell redirects change that tracked file during a live gate.

### WO-129

**[VER-001](../verifications/WO-129/VER-001.md)** — verification, 2026-09-13, judged by claude-code claude-fable-5-1; criteria judged unmet: 2; 3 (partly met); judging 20 min, repair 19 min; 7 other findings and observations.

- F1 (high): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. Suite keys still hash the checkout path through the npm local-prefix variable, so a sibling worktree or main at identical bytes reuses nothing through the canonical npm entry points.

### WO-130

**[VER-001](../verifications/WO-130/VER-001.md)** — verification, 2026-09-13, judged by claude-code claude-opus-5; criteria judged unmet: 7 (npm test clause); judging 56 min, repair 36 min; 8 other findings and observations.

- F1 (blocking, ungraded): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test, but only when run inside a Claude Code role session on the host, new. Git configuration variables injected into Claude Code sessions make narrowing refuse and leave declared suites without keys, so the canonical gate is red (35 of 37) and nothing is reused there.
- The judge's own error, as its report records it: Its first reading of a fixture failure suggested a replica leak; isolation runs showed replica creation had refused and the fixture had run Git in the real worktree.

**[VER-002](../verifications/WO-130/VER-002.md)** — verification, 2026-09-13, judged by codex-cli gpt-6-astra; criteria judged unmet: D011 automatic-dispatch expansion; judging 8 min, repair 76 min; no other finding or observation.

- F1 (high): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The new prompt hook runs the lifecycle dispatch without the writer-ownership and active-gate checks, so a prompt records a transition for which the equivalent shell command is refused.
- The judge's own error, as its report records it: Two probe setups failed before dispatch (a missing module, timestamps without milliseconds) and one measurement check compared the wrong table; all were corrected before the reported results.

**[VER-003](../verifications/WO-130/VER-003.md)** — verification, 2026-09-13, judged by codex-cli gpt-6-astra; criteria judged unmet: D013 receipt and intent expansion; judging 7 min, repair 56 min; no other finding or observation.

- F1 (medium): `not-implemented`, from repair, found by a constructed case, reached in ordinary use, no existing check, introduced by the repair before it. A new session resuming an already-recorded repair gets only a short continuation note; the support list and opening-intent instruction promised for every dispatch are not delivered.

### WO-131

**[VER-001](../verifications/WO-131/VER-001.md)** — verification, 2026-09-14, judged by claude-code claude-opus-5; criteria judged unmet: 7 (live row); 11 (second role session); 15 (amendment); judging 50 min, repair 78 min; 4 other findings and observations.

- F1 (blocking, ungraded): `order-text`, from planning, found by a gate run, reached in ordinary use, existing check: running criterion 7's own measurement: npm run harness -- evidence in a second sandboxed role session, new. Reuse of declared suites requires a kernel read denial that no sandboxed role session on the host can obtain, so an independent later-phase gate ran 807 s with 79 fresh and 0 reused tasks.
- The judge's own error, as its report records it: Records that usage collection was not registered at entry and that it paid two full gates instead of one; a session identifier in the report was redacted at final review.

### WO-044

**[VER-001](../verifications/WO-044/VER-001.md)** — verification, 2026-09-14, judged by codex-cli gpt-6-astra; criteria judged unmet: 1; 2; 5; 6; 9; 10; 12; judging 9 min, repair 51 min; no other finding or observation.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The nested-repository emptiness test only checked whether HEAD resolves, so repositories holding commits on another branch or staged-only data were classed as disposable scaffolding.
- F2 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Derived-worktree cleanup checked uncommitted changes and active gates but never the writer reservation, so it removed a clean worktree whose writer process was still alive.
- F3 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Gate stop signalled only the direct child of a suite and waited for its streams to close, so a grandchild holding inherited pipes kept cancellation pending past the escalation window.
- F4 (medium): `record-wrong`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. The probe recorder labelled rows observed and attributed refusals to a policy when no matching request or denial was retained; the committed X-U2 run carried no such evidence.
- F5 (medium): `record-wrong`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. Concurrent and background run files recorded the default effort while their saved launch arguments selected low, and the report introduction repeated the wrong value.
- F6 (medium): `record-wrong`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. Detached probes left raw stdout and stderr spool files on disk while every run record declared that no raw transcript was retained.
- F7 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Suite input keys treated any execute bit as the Git executable bit, so a group or other execute bit that Git ignores changed the reuse key.
- F8 (medium): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 5) against the committed run file, new. The resident-launched SIGKILL row was labelled observed although its run file showed no kill delivered, no matched session and no worktree snapshot; the Codex row came from help text.

**[VER-002](../verifications/WO-044/VER-002.md)** — verification, 2026-09-14, judged by claude-code claude-opus-5; criteria judged unmet: 8; judging 43 min, repair 122 min; 3 other findings and observations.

- F1 (medium): `integration-release`, from implementation, found by a record audit, reached in ordinary use, existing check: npm ls (standard npm command; no repository gate runs it), new. The skeleton manifest and lockfile still pinned compiler 0.9.2 after the compiler moved to 0.9.3, so npm ls reported an invalid dependency that no gate or release preflight reads.
- The judge's own error, as its report records it: Discloses that one of its own full gates failed on a git temp-file error it attributes to its sandboxed session and does not count against the order.

**[VER-003](../verifications/WO-044/VER-003.md)** — verification, 2026-09-15, judged by codex-cli gpt-6-astra; criteria judged unmet: 15; judging 18 min, repair 34 min; 2 other findings and observations.

- F1 (medium): `behavior-ordinary`, from repair, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (npm run harness -- evidence --fail), introduced by the repair before it. The documented command npm run harness -- evidence --fail was rejected by the generic option parser before the evidence branch saw the flag; it printed usage, exited 1 and recorded no check.

**[VER-004](../verifications/WO-044/VER-004.md)** — verification, 2026-09-15, judged by claude-code claude-opus-5; criteria judged unmet: 8; judging 12 min, repair 21 min; no other finding or observation.

- F1 (medium): `integration-release`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. The README release block was moved to v0.17.7 but still named compiler 0.9.2 and skeleton 0.15.11 while the tree ships 0.9.3 and 0.15.12; no release check reads bare component versions.

### WO-132

**[VER-001](../verifications/WO-132/VER-001.md)** — verification, 2026-09-15, judged by claude-code claude-opus-5; criteria judged unmet: 12; judging 60 min, repair 22 min; 7 other findings and observations.

- F1 (blocking, ungraded): `behavior-ordinary`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (npm run meta) and reading its printed promise lines, new. The Cost extraction stopped at the first physical line, so npm run meta printed the addition clause as the promised removal for every wrapped declaration and could never mark a shortfall.
- The judge's own error, as its report records it: Records that its first test:docs run was red until it performed its own pending work-order index refresh (O5).

**[VER-002](../verifications/WO-132/VER-002.md)** — verification, 2026-09-15, judged by claude-code claude-opus-5; criteria judged unmet: 9; judging 44 min, repair 21 min; 9 other findings and observations.

- F1 (blocking, ungraded): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The write guard read >&file as a write to a path beginning with &, which the ignore rules classed as scratch, so the hooks admitted live-gate writes into packages/*/dist and ./node_modules.
- The judge's own error, as its report records it: O3 records that VER-001 F1 wrongly attributed an under-six-minutes promise to the Cost paragraph of the order.

**[VER-003](../verifications/WO-132/VER-003.md)** — verification, 2026-09-15, judged by codex-cli gpt-6-astra; criteria judged unmet: 9; judging 13 min, repair 17 min; no other finding or observation.

- F1 (blocking, ungraded): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The redirect repair skipped numeric and dash operands after >>& as well as >&, but zsh treats them as filenames after >>&, so the adapter returned no destination and the hooks admitted the write.

**[VER-004](../verifications/WO-132/VER-004.md)** — verification, 2026-09-15, judged by claude-code claude-opus-5; criteria judged unmet: 9; judging 11 min, repair 13 min; no other finding or observation.

- F1 (blocking, ungraded): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, new. zsh clobber-override redirects such as >!file were recorded with a leading ! in the destination, which the ignore rules classed as scratch, so hooks admitted live-gate writes into dist and node_modules.

### WO-045

**[VER-001](../verifications/WO-045/VER-001.md)** — verification, 2026-09-15, judged by claude-code claude-opus-5; no numbered criterion judged unmet; judging 14 min, repair 48 min; 6 other findings and observations.

- F1 (blocking, ungraded): `integration-release`, from verification, found by a record audit, reached in ordinary use, no existing check, new. The order staged application v0.19.0 and compiler 0.10.1, but a sibling order had published v0.19.0 with compiler 0.11.0 from main, so the staged release could not be published as prepared.

### WO-047

**[VER-001](../verifications/WO-047/VER-001.md)** — verification, 2026-09-16, judged by claude-code claude-opus-5; no numbered criterion judged unmet; judging 29 min, repair 24 min; 9 other findings and observations.

- F1 (blocking, ungraded): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run publication:check, new. The roadmap write-back added a heading with no publication index row and the domain-model edit left both audience-edition source locks stale, so publication:check failed where main passes.
- The judge's own error, as its report records it: Records that its subagent workflow raised 20 candidate findings, 10 of which were refuted or dropped, including a proposed version-literal defect it rejected (O5).

### WO-133

**[FINAL-001](../final-reviews/WO-133/FINAL-001.md)** — final review, 2026-09-16, judged by claude-code claude-opus-5; criteria judged unmet: 7; judging 29 min, repair 20 min; 8 other findings and observations.

- F1 (blocking, ungraded): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test -- --review, new. The new runtime_refresh release case was added to the release test script but not to the hard-coded expected case inventory, so runner-fixtures failed and the review gate exited 1.

### WO-049

**[VER-001](../verifications/WO-049/VER-001.md)** — verification, 2026-09-16, judged by claude-code claude-opus-5; criteria judged unmet: 3; judging 28 min, repair 48 min; 13 other findings and observations.

- F1 (blocking, ungraded): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Target removal deleted the managed exclude block by substring, taking its separator newline and joining user lines so an ignore rule was lost; a duplicated block left a complete residual block.
- The judge's own error, as its report records it: Records an initial misreading of effort labels in the Codex smoke (L3), a spurious deny from its own non-canonical probe path (O7) and subagent candidates it refuted (L4).

### WO-121

**[VER-001](../verifications/WO-121/VER-001.md)** — verification, 2026-09-17, judged by claude-code claude-opus-5; criteria judged unmet: 6; judging 21 min, repair 15 min; no other finding or observation.

- F1 (blocking, ungraded): `harness-environment`, from harness, found by a gate run, reached in ordinary use, existing check: npm test (the executor gate had already failed this fixture once before handoff; its isolated rerun passed and the cause was recorded as unknown), new. npm test exits 1 because the release runtime-refresh fixture, whose diagnostics alone the order changed, clones a bare origin while Git automatic maintenance repacks it after a push.
- The judge's own error, as its report records it: The verifier piped its first full gate run through tail, lost the failure detail and had to run the gate again.

### WO-139

**[FINAL-001](../final-reviews/WO-139/FINAL-001.md)** — final review, 2026-09-18, judged by codex-cli gpt-6-astra; criteria judged unmet: 5 (partly, F1); 7; judging 25 min, repair 27 min; no other finding or observation.

- F1 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The hook host imports the new cap module, but the pinned runtime file list omits it, so a changed module keeps the old snapshot identity and a deleted snapshot copy still passes harness check.
- F2 (medium): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test -- --review, new. The review gate fails process-debt twice: substring-based advisory bucketing breaks the throttle between classification advisories, and a Stop-output assertion was not updated for the new Subagents line.

### WO-054

**[VER-001](../verifications/WO-054/VER-001.md)** — verification, 2026-09-18, judged by claude-code claude-opus-5; criteria judged unmet: scope expansion: preserve explicit interruption; judging 47 min, repair 26 min; 5 other findings and observations.

- F1 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. The newly generated Codex hook file fails the Prettier check and cannot be reformatted without causing harness drift, so the document gate turns red once the branch merges.
- F2 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The Codex continuation adapter recognises a typed stop through one anchored pattern only, so wordings such as a stop with a leading word or a question mark are missed and a continuation is forced after compaction.
- The judge's own error, as its report records it: The verifier ran a full npm test before checking that the recorded executor gate row already covered the same code identity, which cost 344 s and blocked its shell.

**[VER-002](../verifications/WO-054/VER-002.md)** — verification, 2026-09-18, judged by claude-code claude-opus-5; no numbered criterion judged unmet; judging 11 min, repair 6 min; no other finding or observation.

- N1 (high): `docs-writeback`, from implementation, found by a gate run, reached in ordinary use, existing check: node scripts/harness-context.mjs --check, new. The role-text sentence the order adds puts the executor and release-close cold-start totals over their ceilings, and the budgets file has neither a raised ceiling nor a dated acceptance.
- The judge's own error, as its report records it: Records that VER-001 did not report the breach although it was already present at that subject.

### WO-142

**[VER-001](../verifications/WO-142/VER-001.md)** — verification, 2026-09-19, judged by claude-code claude-opus-5; criteria judged unmet: 1; 7; row A4; row B2; row B3; row B14; judging 86 min, repair 44 min; 14 other findings and observations.

- F1 (blocking, ungraded): `behavior-ordinary`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. Refreshing the work-order index on every transition takes 15 to 28 s here, so hook dispatches hit their 12 s timeout: the event is appended, the dispatch is reported failed and the index stays stale.
- F2 (blocking, ungraded): `behavior-ordinary`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. Background Bash dispatches and completion notices are still not journaled in Claude Code: the code reads an id key and a notice form the harness does not emit, and the scope-stamp regression cannot fail.
- F3 (blocking, ungraded): `boundary-guard`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. The new per-program flag allowlists make the live-gate guard refuse read-only forms it admitted at activation, including common grep, head and ls spellings.
- F4 (blocking, ungraded): `test-does-not-prove`, from implementation, found by a constructed case, not reached in ordinary use, existing check: re-reading the required result of row B14 (none weakened) against the test diff, new. The regex assertion in the kernel coupling test was replaced by an AST check that flags only bare-identifier receivers, so a planted reserved-state read passes although the row forbids weakening.
- The judge's own error, as its report records it: One helper ran an early recursive search over docs/ before excluding the intake directory; its output was filtered and nothing was shown or copied.

**[VER-002](../verifications/WO-142/VER-002.md)** — verification, 2026-09-19, judged by claude-code claude-opus-5; criteria judged unmet: 1; row B2; row B3; judging 40 min, repair 33 min; 10 other findings and observations.

- F1 (blocking, ungraded): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, persists from VER-001. The notice parser and terminal-state lists omit the native killed status of Claude Code, so a task whose killed notice arrives stays dispatched with growing elapsed time.
- F2 (blocking, ungraded): `boundary-guard`, from implementation, found by a constructed case, reached in ordinary use, no existing check, persists from VER-001. Thirteen further read-only forms the activation guard admitted are still refused during a live gate; the repair restored only the seven forms VER-001 quoted.
- The judge's own error, as its report records it: The first prune before/after digest pair differed while helper hooks wrote the journal and was not kept; the claim rests on a second pair diffed line by line.

**[VER-003](../verifications/WO-142/VER-003.md)** — verification, 2026-09-19, judged by claude-code claude-opus-5; criteria judged unmet: 1; row B2; judging 23 min, repair 20 min; 2 other findings and observations.

- F1 (blocking, ungraded): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. A later tool observation without a status, such as a text result or a failed stop, replaces the terminal state of a task with unknown and restarts its elapsed time.
- The judge's own error, as its report records it: The verifier wrote a probe copy of a script into the worktree by mistake and deleted it about a minute later; its first transcript replay silently ingested nothing until cwd was rewritten.

### WO-144

**[VER-001](../verifications/WO-144/VER-001.md)** — verification, 2026-09-19, judged by claude-code claude-opus-5; criteria judged unmet: 2 (met in fixture; fails at real-session width); judging 14 min, repair 23 min; 2 other findings and observations.

- F1 (high): `boundary-guard`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. The new guard treats a discard redirect to the null device as an outside-project write, so any command whose redirect the extractor can name is refused in Claude sessions.
- F2 (high): `boundary-guard`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. On the operator's platform the default grants refuse the system scratch and the harness scratchpad, and the granted DotLn scratch root cannot be found: no text defines its session key and no command prints the path.

**[FINAL-001](../final-reviews/WO-144/FINAL-001.md)** — final review, 2026-09-19, judged by claude-code claude-fable-5-1; criteria judged unmet: 5; 2 (met by fixture; objective fails at session width); judging 10 min, repair 40 min; no other finding or observation.

- F1 (high): `boundary-guard`, from planning, found by a constructed case, reached in ordinary use, no existing check, new. The hooks resolve their root only while the working directory equals the worktree root, so after one persisted directory change a known ungranted outside write is admitted and no journal row is written.
- F2 (medium): `docs-writeback`, from planning, found by the criterion's own check, reached in ordinary use, no existing check, new. A literal redirect is judged only on the few programs the extractor knows, so the npm command of the recorded incident is still admitted, and the documents say redirects are covered without stating this.
- The judge's own error, as its report records it: Discloses one 6-byte probe file left in the system temporary directory, because removing it would need the guard or the defect under review.

### WO-146

**[VER-001](../verifications/WO-146/VER-001.md)** — verification, 2026-09-20, judged by claude-code claude-opus-5; criteria judged unmet: 12; judging 17 min, repair 14 min; 6 other findings and observations.

- N1 (medium): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. Two order-owned files failed the pinned formatter check, so the docs gate was red and the format preflight kept five further document suites from running.
- The judge's own error, as its report records it: The verifier built a malformed scratch path that the outside-write hook refused, then reran against the session scratch.

### WO-090

**[VER-001](../verifications/WO-090/VER-001.md)** — verification, 2026-09-20, judged by claude-code claude-opus-5; criteria judged unmet: 1; judging 8 min, repair 24 min; 2 other findings and observations.

- N1 (blocking, ungraded): `order-text`, from planning, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command; the executor ran it and recorded the result in WO-090-D001, new. Criterion 1 demands a lower directed-load total per role, but the relocated sections were never in any role's directed set, so totals are byte-identical and no compliant repair can lower them.
- The judge's own error, as its report records it: The verifier's own link checker mis-slugged four decisions-index anchors, which it recorded as false positives.

### WO-099

**[VER-001](../verifications/WO-099/VER-001.md)** — verification, 2026-09-20, judged by codex-cli gpt-5.6-sol; criteria judged unmet: 1; 2; 5; judging 23 min, repair 22 min; 3 other findings and observations.

- F1 (high): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. The resident reused the command bound to the declared subject, so any changed work was refused before the judge ran, and a fresh passing judgment had no production path to clear an existing hold.
- F2 (high): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. The capsule ignored untracked files and silently cut paths, diff text and clauses at fixed limits, so out-of-surface work could be certified on-mission.
- F3 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. Adding the presence policy to the Contributor loadout made the historical authority fixture compile to the new identity, so the authority-evidence task in the docs gate failed.
- F4 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. The selected feedback evidence edition was recorded before the final source set, so the docs gate reported it stale against the delivered subject.
- The judge's own error, as its report records it: A diagnostic format command the verifier ran pins a write flag and reformatted the eight files the gate had named; disclosed as verifier contamination.

**[VER-002](../verifications/WO-099/VER-002.md)** — verification, 2026-09-20, judged by codex-cli gpt-5.6-sol; criteria judged unmet: 1; 2; judging 14 min, repair 44 min; 2 other findings and observations.

- F1 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. When the model episode failed after the capsule was observed, the resident folded an empty unknown and dropped host-proved structural drift, its finding and the correction event.
- F2 (high): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The untracked-file reader added by the first repair followed a symlink out of the worktree, put outside bytes in the capsule and still admitted a pass; reads were unbounded before allocation.

**[VER-003](../verifications/WO-099/VER-003.md)** — verification, 2026-09-20, judged by codex-cli gpt-6-astra; criteria judged unmet: 1; 2; judging 10 min, repair 47 min; 3 other findings and observations.

- F1 (high): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. A capsule inside the path bound produced more host findings than re-validation admits, so the observation threw and no hold or correction was recorded.
- F2 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Any failure reading an existing decision history was swallowed as an empty history over which a pass was admitted, and a zero decision window returned the whole history.

**[VER-004](../verifications/WO-099/VER-004.md)** — verification, 2026-09-20, judged by claude-code claude-opus-5; criteria judged unmet: 1; 2; judging 10 min, repair 32 min; 4 other findings and observations.

- F1 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Untracked work was listed with ignore rules applied, so out-of-surface changes in ignored paths never reached the capsule and passed as on-mission while the judge was told the list was complete.

**[VER-005](../verifications/WO-099/VER-005.md)** — verification, 2026-09-20, judged by claude-code claude-opus-5; criteria judged unmet: 4; judging 11 min, repair 11 min; 3 other findings and observations.

- F1 (high): `behavior-ordinary`, from repair, found by a constructed case, reached in ordinary use, no existing check, introduced by the repair before it. The ignored-entry baseline fingerprinted collapsed directories by modification time, so one ordinary build raised a hold that returned after every clearance, while the write-backs claimed the opposite.
- The judge's own error, as its report records it: The verifier first attributed the finding to criteria 1 and 2, then corrected the ground to criterion 4 after re-reading their scoping to doubles and fixtures.

### WO-110

**[VER-001](../verifications/WO-110/VER-001.md)** — verification, 2026-09-20, judged by codex-cli gpt-5.6-sol; no numbered criterion judged unmet; judging 13 min, repair 37 min; 2 other findings and observations.

- F1 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. Seven order-owned source, test and probe files failed the repository formatter, leaving the docs gate's format task red.
- F2 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. Regenerated harness surfaces no longer matched the retained authority evidence edition and no new edition or revision was selected, so the authority-evidence task failed.
- F3 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. Four modified files are registered feedback behavior sources, yet no new feedback evidence edition was recorded, so the feedback-evidence task reported stale evidence.

### WO-069

**[VER-001](../verifications/WO-069/VER-001.md)** — verification, 2026-09-21, judged by codex-cli gpt-6-astra; criteria judged unmet: 1; 3; judging 17 min, repair 26 min; 2 other findings and observations.

- F1 (high): `not-implemented`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Lineage and planning-pass readers still resolve default-layout paths, so a launchpad that moves the docs root fails with a missing-file error.
- F2 (high): `behavior-ordinary`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Follow-up projection collects references under configured roots but validates them without passing the root, rejecting a valid configured candidate.
- F3 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. A two-step module-URL root derivation in the writing-worker probe escapes the guard's patterns and sends reports to the tool checkout instead of the selected launchpad.
- F4 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. A path variable declared inside the try block is referenced in its catch, so a missing legal document now throws a reference error instead of the base's structured failing rule.
- F5 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: the machinery suites (npm test -- --review today), new. Existing harness fixtures copy library files one by one and omit the new config loader, so four machinery cases fail; the product-only gate never runs them.
- The judge's own error, as its report records it: Early probes lacked scratch and checkpoint prerequisites and used a non-physical temporary path that hit a separate Git-root check; the verifier fixed its fixtures and reran.

### WO-138

**[VER-001](../verifications/WO-138/VER-001.md)** — verification, 2026-09-21, judged by claude-code claude-opus-5; criteria judged unmet: 2; judging 6 min, repair 43 min; 4 other findings and observations.

- F1 (blocking, ungraded): `behavior-ordinary`, from implementation, found by a record audit, reached in ordinary use, existing check: re-reading its own results and episode records (remote 0 of 5, all transport-failed); the decision packet already disclosed the failures, new. The probe's schema emits a keyword the remote transport rejects before inference; the error text was discarded, and the comparator floor was recorded as met without being exercised.

### WO-148

**[VER-001](../verifications/WO-148/VER-001.md)** — verification, 2026-09-21, judged by codex-cli gpt-5.6-sol; criteria judged unmet: 2; 3; 5; judging 22 min, repair 22 min; 2 other findings and observations.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The staleness check compares only four stored source fields, so a store retargeted through other fields is declared fresh and gets launch lines.
- F2 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. After a retained store is moved, the check succeeds on the new directory but prints launch and presence commands that name the missing original location.
- F3 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Bind writes the path-bearing store under a configured control root without proving the lane is ignored, so absolute paths land in Git-visible files.

### WO-149

**[VER-001](../verifications/WO-149/VER-001.md)** — verification, 2026-09-21, judged by claude-code claude-opus-5; criteria judged unmet: 3; judging 9 min, repair 34 min; 3 other findings and observations.

- Finding 1 (high): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 3's fallback branch); the executor's record names the gap, new. Criterion 3's live Codex row does not exist: verification ran in Claude Code and the fallback fixture-order dispatch line was never filed in the evidence directory.
- Finding 2 (high): `gate-red`, from integration, found by a gate run, reached in ordinary use, existing check: npm test -- --review (the executor had seen the suite fail, WO-149-D003), new. The order's edit to the resume script makes the review gate select the configuration-root suite, which fails on an untouched probe; the known red suite was deferred without reconciling criterion 5.

### WO-152

**[VER-001](../verifications/WO-152/VER-001.md)** — verification, 2026-09-22, judged by codex-cli gpt-5.6-sol; criteria judged unmet: 4; judging 14 min, repair 28 min; no other finding or observation.

- F1 (medium): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 4); the executor recorded the omission in WO-152-D004, new. The executor knowingly skipped criterion 4's required edition re-mint and live self-host episode because the retained editions were not stale, without an operator amendment.

### WO-151

**[VER-001](../verifications/WO-151/VER-001.md)** — verification, 2026-09-22, judged by codex-cli gpt-5.6-sol; criteria judged unmet: 1; 6; 7; 8; judging 25 min, repair 34 min; one other finding or observation.

- Finding 1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Pending-review admission refuses only an identical subject hash, which includes tracked status, so a second review of the same commit after the tree changes overwrites the one pointer and orphans the first.
- Finding 2 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. The authority edition was minted before the final planner procedure and generated bundle settled, so authority-evidence fails and blocks six document suites, including the entropy row.
- Finding 3 (high): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list (criterion 7) against the filed receipt, new. The live refutation receipt records no post-episode tracked status, after-inventory or scratch delta because the filing code never computes them.

### WO-064

**[VER-001](../verifications/WO-064/VER-001.md)** — verification, 2026-09-22, judged by codex-cli gpt-6-sol; criteria judged unmet: 1; judging 10 min, repair 16 min; no other finding or observation.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Publish picks the acceptance matrix by commit only, so a same-head matrix with unrelated criteria is rendered as verified evidence in the target pull-request body instead of being refused.

### WO-100

**[VER-001](../verifications/WO-100/VER-001.md)** — verification, 2026-09-22, judged by codex-cli gpt-6-sol; criteria judged unmet: 2; judging 9 min, repair 19 min; no other finding or observation.

- F1 (high): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. A correct Sort move checked by an admitted command that names no shared path yields no verification surface; the host throws before the verifier runs and the curve resets.

**[VER-002](../verifications/WO-100/VER-002.md)** — verification, 2026-09-22, judged by codex-cli gpt-6-sol; criteria judged unmet: 4; judging 9 min, repair 8 min; no other finding or observation.

- F1 (low): `docs-writeback`, from implementation, found by reading, reached in ordinary use, no existing check, new. The planning-refutation guide still states the pre-migration model and effort defaults, contradicting the command's new defaults and the other current guide.

**[FINAL-001](../final-reviews/WO-100/FINAL-001.md)** — final review, 2026-09-22, judged by claude-code claude-opus-5-5; criteria judged unmet: 5; judging 23 min, repair 22 min; 5 other findings and observations.

- F1 (unlabeled): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test -- --review, new. Reviewer gate is red: the new portfolio suite declares an outside-sandbox need, breaking the gate-inventory invariant test; no decision, test expectation or product sentence was updated.

### WO-157

**[VER-001](../verifications/WO-157/VER-001.md)** — verification, 2026-09-23, judged by codex-cli gpt-6-sol; criteria judged unmet: 3; 9; 11; 12; judging 14 min, repair 2238 min; one other finding or observation.

- F1 (low): `not-implemented`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list, new. The file-to-directory refusal names the path but not the configured files ceiling the criterion requires; the fixture asserts only the narrower text.
- F2 (low): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The untracked-path witness hashes newline-joined names, so two different legal path lists containing newlines hash alike and the receipt reports the listing as identical.
- F3 (medium): `boundary-guard`, from implementation, found by the criterion's own check, ordinary use unknown, existing check: re-reading the order's criterion list, new. With the session effort variable readable, a completion attesting a different effort as operator-attested is recorded with only an advisory instead of being refused; a test expects that pass.
- F4 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The import-closure check's pattern misses chained dynamic imports and semicolonless static imports, so an unregistered sibling imported that way raises no finding.

### WO-153

**[VER-001](../verifications/WO-153/VER-001.md)** — verification, 2026-09-24, judged by codex-cli gpt-6-sol; criteria judged unmet: 1; judging 7 min, repair 32 min; no other finding or observation.

- F1 (medium): `behavior-edge`, from planning, found by a constructed case, not reached in ordinary use, no existing check, new. The catch always reports cause no-session, but a begin that fails after the session record is written leaves a session whose usage readback gives another cause; a repeat dispatch is then silent.

### WO-154

**[VER-001](../verifications/WO-154/VER-001.md)** — verification, 2026-09-24, judged by codex-cli gpt-6-astra; criteria judged unmet: 2; judging 11 min, repair 66 min; no other finding or observation.

- VER-001-F1 (high): `behavior-ordinary`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command after a rebuild, new. After a compiler release-label change is built, both check and carry fail with compiled policy drift, so a pins-only change cannot retain or carry the live audit; the test checked before rebuilding.

### WO-156

**[VER-001](../verifications/WO-156/VER-001.md)** — verification, 2026-09-24, judged by claude-code claude-opus-5-5; criteria judged unmet: 2; judging 14 min, repair 26 min; no other finding or observation.

- F1 (blocking, ungraded): `budget-missed`, from planning, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (executor measured 2.85 s and recorded the miss in D003), new. Plan check takes 2.68 to 2.75 s against the required under-2 s bound; the remaining cost is Git spawning, which the order listed as a non-goal.

**[VER-002](../verifications/WO-156/VER-002.md)** — verification, 2026-09-24, judged by codex-cli gpt-6-astra; criteria judged unmet: 1; judging 10 min, repair 11 min; no other finding or observation.

- F1 (blocking, ungraded): `boundary-guard`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. The new prefetch applies the regular-file requirement to an unused legacy map hint, so a valid sequence whose legacy map is a symlink is rejected where the original reader accepted it.
- F2 (blocking, ungraded): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. Batched receipt reads overflow the unchanged 16 MiB Git buffer when individually readable receipts are large in aggregate, failing a read the original per-file reader accepted.

### WO-114

**[VER-001](../verifications/WO-114/VER-001.md)** — verification, 2026-09-24, judged by claude-code claude-opus-5-5; criteria judged unmet: 5; 1 (partial); 2 (partial); 4 (partial); judging 37 min, repair 17 min; 3 other findings and observations.

- VER-001-F1 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test, repeated (intermittent; the executor's one recorded run passed), new. Per-event status publication with file and directory sync slows an existing restart test enough that the product gate timed out in one of two runs on the unchanged subject.
- VER-001-F2 (high): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. Writers of one store read different work-order indexes, so the projected order section flips with the last writer and a restart rebuild differs.
- VER-001-F3 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Publication runs unguarded inside append, so a failed disposable projection write aborts the resident's operation after the event is durable, losing an episode or leaving the lock held.
- The judge's own error, as its report records it: D009 qualifies the report's verdict line: the gate failure was intermittent (one of two runs), not deterministic; the verdict is unchanged.

### WO-111

**[VER-001](../verifications/WO-111/VER-001.md)** — verification, 2026-09-24, judged by claude-code claude-opus-5-5; criteria judged unmet: 2; 5; 3 (partial); 4 (partial); judging 55 min, repair 26 min; 11 other findings and observations.

- B1 (blocking, ungraded): `scope-authority`, from implementation, found by the criterion's own check, reached in ordinary use, no existing check, new. The live worker launches added trust entries to the operator's user-level Codex configuration, outside the portfolio, and the receipts labelled outside host paths unknown rather than reporting it.
- B2 (blocking, ungraded): `docs-writeback`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: re-reading the order's criterion list, new. The replan checkpoint was answered in the critical-path document and a decision, not in the planning map the criterion names; the map still says the decision is pending.
- B3 (blocking, ungraded): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm run test:docs, new. The document gate is red: a new ledger section sits below the founding-corpus boundary and two evidence streams are unregistered; seven dependent suites refuse on the preflight.

**[VER-002](../verifications/WO-111/VER-002.md)** — verification, 2026-09-24, judged by claude-code claude-opus-5-5; criteria judged unmet: 2; 3 (partial, not blocking); judging 13 min, repair 22 min; 2 other findings and observations.

- B1 (blocking, ungraded): `scope-authority`, from implementation, found by a record audit, reached in ordinary use, existing check: the order's own receipt check (reports criterion 2 unmet), persists from VER-001. The documentary repair disclosed but could not undo the change to the user-level Codex configuration; the subject's own corrected receipts record criterion 2 as unmet with no operator exception.
- The judge's own error, as its report records it: The route section was rewritten after filing (D016): the filed text wrongly sent criterion 2 to operator decisions outside the lifecycle instead of to a repair.

### WO-159

**[VER-001](../verifications/WO-159/VER-001.md)** — verification, 2026-09-25, judged by codex-cli gpt-6-sol; criteria judged unmet: 2; judging 11 min, repair 18 min; one other finding or observation.

- F1 (high): `not-implemented`, from implementation, found by reading, reached in ordinary use, no existing check, new. The writing-worker probe allocates one isolated home and one digest record per row, so its concurrent row's three launches and its recovery launch share a home and lack per-launch records.

### WO-158

**[VER-001](../verifications/WO-158/VER-001.md)** — verification, 2026-09-25, judged by codex-cli gpt-6-sol; criteria judged unmet: 3; 4; 5; 6; judging 17 min, repair 30 min; no other finding or observation.

- F1 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Reactivating a withdrawn order accepts a note with an impossible calendar date, because the parser checks digit shape and compares strings without calendar validation.
- F2 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. A report-path correction moves a recorded pass to a different file with other bytes and an unmet criterion; only basename and containment are checked, not content identity.
- F3 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Two override exits within one second write the same capture file name with overwrite semantics, so the first event's recorded hash no longer matches its captured words.
- F4 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. During a live gate the admitted Git log can run a configured pager, an unlisted program able to write; the configured-program check omits pager settings and environment.

**[FINAL-001](../final-reviews/WO-158/FINAL-001.md)** — final review, 2026-09-25, judged by claude-code claude-opus-5-5; criteria judged unmet: 6; judging 29 min, repair 16 min; 2 other findings and observations.

- F1 (high): `boundary-guard`, from repair, found by a constructed case, reached in ordinary use, no existing check, introduced by the repair before it. The live-gate Git prefix parser never advances past a second prefix token, so the documented two-prefix read loops until the hook timeout; on fail-open hosts a chained write goes unjudged.

### WO-161

**[VER-001](../verifications/WO-161/VER-001.md)** — verification, 2026-09-25, judged by claude-code claude-opus-5-5; no numbered criterion judged unmet; judging 26 min, repair 25 min; 8 other findings and observations.

- F1 (high): `not-implemented`, from implementation, found by reading, reached in ordinary use, no existing check, new. The generator dropped the Codex approval sentence but kept its dependent clause about Git escalation, which six generated role skills still emit unscoped; the criterion's word search cannot see it.
- F2 (low): `docs-writeback`, from implementation, found by reading, reached in ordinary use, no existing check, new. A package README still states that native sandbox and approval remain in force, and the playbook calls the retained Claude posture current.

### WO-160

**[VER-001](../verifications/WO-160/VER-001.md)** — verification, 2026-09-25, judged by claude-code claude-opus-5-5; criteria judged unmet: 7; 8; judging 33 min, repair 35 min; 21 other findings and observations.

- F1 (medium): `behavior-ordinary`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command against the real repository's packed stash ref, new. Stash prune previews published-order stashes as removable but its drop requires a loose stash ref; with the ref packed, as in the real repository, apply throws and leaves an inventory file.
- F2 (high): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The own-write read credit covers every path changed since the last snapshot, so another writer's change inside a tool window or before an explicit observe loses the advisory the baseline gave.

**[VER-002](../verifications/WO-160/VER-002.md)** — verification, 2026-09-25, judged by claude-code claude-opus-5-5; criteria judged unmet: 7; judging 26 min, repair 19 min; 9 other findings and observations.

- F5 (medium): `behavior-edge`, from repair, found by a constructed case, not reached in ordinary use, no existing check, introduced by the repair before it. On the entries-remain path the repaired drop removes the packed stash row; if Git's pack-refs prune interleaves, the loose ref is deleted too and every retained stash becomes unreachable.

### WO-115

**[VER-001](../verifications/WO-115/VER-001.md)** — verification, 2026-09-26, judged by codex-cli gpt-6-astra; criteria judged unmet: 1; 3; 5; judging 13 min, repair 22 min; no other finding or observation.

- F1 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. A valid request queued behind a long-running console command got no response headers, timed out after about 301 s, and left no invocation or result receipt in replay.
- gate limitation (unlabeled): `harness-environment`, from harness, found by a gate run, reached in ordinary use, no existing check, new. npm test failed in worktree-integration: its fixture clones moving main and overlays the branch scripts, and a sibling merge had moved Beacon files those scripts still import.
- The judge's own error, as its report records it: An earlier diagnostic rerun pointed at the outer clone and failed four cases; the verifier replaced it with a corrected nine-pass run and marked it as not product evidence.

**[VER-002](../verifications/WO-115/VER-002.md)** — verification, 2026-09-26, judged by codex-cli gpt-6-astra; criteria judged unmet: 5; judging 11 min, repair 14 min; no other finding or observation.

- G1 (medium): `harness-environment`, from harness, found by a gate run, reached in ordinary use, existing check: npm test (the repair run recorded exit 1 for this cause before handoff), persists from VER-001. The full npm test still fails in the worktree-integration fixture that mixes moving main with the branch scripts; no console defect remains and the queue repair verified clean.

**[FINAL-001](../final-reviews/WO-115/FINAL-001.md)** — final review, 2026-09-26, judged by codex-cli gpt-6-astra; criteria judged unmet: 5; judging 25 min, repair 32 min; no other finding or observation.

- F1 (medium): `gate-red`, from unknown, found by a gate run, reached in ordinary use, no existing check, new. Neither complete gate on the integrated subject passed: one run timed out in the unchanged status-watcher test (2 s), the retry in the unchanged resident acquisition matrix (240 s); cause not established.

**[VER-004](../verifications/WO-115/VER-004.md)** — verification, 2026-09-26, judged by claude-code claude-opus-5-5; no numbered criterion judged unmet; judging 18 min, repair 29 min; 4 other findings and observations.

- F1 (medium): `record-wrong`, from repair, found by a record audit, reached in ordinary use, no existing check, introduced by the repair before it. The repair made the skeleton suite exclusive in the gate scheduler without the same-source before/after comparison a standing product rule requires, and left the product 07 scheduling paragraph stale.

### WO-085

**[VER-001](../verifications/WO-085/VER-001.md)** — verification, 2026-09-26, judged by claude-code claude-opus-5-5; criteria judged unmet: 1; judging 57 min, repair 30 min; 17 other findings and observations.

- F1 (medium): `boundary-guard`, from implementation, found by a record audit, reached in ordinary use, no existing check, new. The new docs check resolves docs/-prefixed links in final-review PR bodies from the repository root, an undeclared rule that lets 308 links broken in every renderer pass outside the declared inventory.
- F2 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Any hand-written start/end comment marker pair in a product document exempts its contents from the byte ceiling and from receipt and candidate detection.
- The judge's own error, as its report records it: An intermediate test:docs run failed only meta on the then-unfilled cost line of this report, and the first run failed on the pending link to this same report (the mechanism F3 describes).

### WO-166

**[VER-001](../verifications/WO-166/VER-001.md)** — verification, 2026-09-26, judged by claude-code claude-fable-5-1; criteria judged unmet: 3; judging 70 min, repair 30 min; 18 other findings and observations.

- F1 (blocking, ungraded): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. evidence --wait exits 2 with no row for a passed evidence run whose check rows were reused from cache, because the recorded-after-start guard is evaluated before the recorded outcome of that run.
- F2 (medium): `behavior-ordinary`, from implementation, found by a constructed case, reached in ordinary use, no existing check, new. A release-close dispatch from a merged subject reserves main under that session actor, then directs a new main session whose completion cannot release the reservation.
- The judge's own error, as its report records it: Records that its full npm test repeated the passing executor gate at the same code identity, 312.54 s of duplicate cost.

### WO-168

**[VER-001](../verifications/WO-168/VER-001.md)** — verification, 2026-09-27, judged by codex-cli gpt-6-sol; criteria judged unmet: 4; 11; judging 19 min, repair 37 min; no other finding or observation.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, existing check: re-reading the order's criterion list (executor decision D006 had already recorded this admission), new. During a live gate the permissions hook admits a listed read with a combined redirect followed by further words; a shell without that operator runs those words as a separate command, so the form can write a gate input.
- F2 (medium): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, existing check: re-reading the order's criterion list (executor decision D006 had already recorded this admission), new. A word beginning with an equals sign, a shell expansion, is accepted on the live-gate read list although the criterion requires expansions to stay refused.
- F3 (medium): `harness-environment`, from harness, found by a gate run, reached in ordinary use, no existing check, new. The full review gate run by the verifier failed one process-debt case that compares two writer-refusal strings, each carrying an age in seconds computed from a separate clock read.

### WO-171

**[VER-001](../verifications/WO-171/VER-001.md)** — verification, 2026-09-27, judged by codex-cli gpt-6-sol; criteria judged unmet: 5; judging 15 min, repair 30 min; no other finding or observation.

- F1 (high): `boundary-guard`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. The prune usage-retention rule matches only the canonical usage file name, so a collision-preserved copy can be deleted with no committed snapshot naming it.

### WO-164

**[VER-001](../verifications/WO-164/VER-001.md)** — verification, 2026-09-27, judged by codex-cli gpt-6-sol; criteria judged unmet: 2; judging 12 min, repair 19 min; no other finding or observation.

- F1 (high): `budget-missed`, from implementation, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (the executor timing record already showed 6.2 s cold), new. First-call (cold cache) collectSources took 5.8 to 6.3 s against the unqualified under-3-s bound; only the warm path (about 0.65 s) met it.

**[FINAL-001](../final-reviews/WO-164/FINAL-001.md)** — final review, 2026-09-27, judged by claude-code claude-opus-5-5; criteria judged unmet: 6; judging 25 min, repair 59 min; 5 other findings and observations.

- F1 (high): `gate-red`, from implementation, found by a gate run, reached in ordinary use, existing check: npm test -- --review, new. The review gate failed: the configuration-root suite rejects the new release-list cache module for deriving the scripts directory from its own URL instead of through the configuration module.
- The judge's own error, as its report records it: Lists five reviewer errors: a shell expansion, an unmatched glob, three commands refused beside the live gate, a search complexity limit, and a meta refusal of a decision lacking rejected choices.

### WO-170

**[VER-001](../verifications/WO-170/VER-001.md)** — verification, 2026-09-27, judged by codex-cli gpt-6-astra; criteria judged unmet: 3; judging 16 min, repair 22 min; one other finding or observation.

- F1 (medium): `behavior-edge`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. Retained usage copies are read in lexical path order, so after ten collision-preserved copies the tenth file sorts before the second to ninth and an older observation replaces the latest.
- The judge's own error, as its report records it: Initial verifier-fixture setup errors (missing rejected choices, a timestamp without milliseconds) were corrected in temporary storage before the successful probe.

### WO-162

**[VER-001](../verifications/WO-162/VER-001.md)** — verification, 2026-09-28, judged by claude-code claude-opus-5-5; criteria judged unmet: 5; 7; judging 59 min, repair 66 min; 12 other findings and observations.

- F1 (unlabeled): `record-wrong`, from implementation, found by a constructed case, not reached in ordinary use, no existing check, new. A decision claimed the source-change guard compares canonical roots and found no reachable defect; a case-variant parent path reproduces a containment bypass, and no follow-up named it.
- F2 (unlabeled): `record-wrong`, from implementation, found by a record audit, reached in ordinary use, existing check: re-reading the order's criterion list, new. Two decisions omit dependent callers that criterion 7 requires them to name, including the skeleton protocol validators the order itself lists.
- F3 (unlabeled): `order-text`, from planning, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (the executor fixture digest comparison had shown the four changed files), new. Criterion 5 demands byte-identical fixtures, but the compiler source change criterion 6 requires forces a version bump that alters four console self-host fixtures, so both cannot hold.
- The judge's own error, as its report records it: The verifier records stopping its review workflow after an operator question that was not an instruction, leaving one refuter unfinished; the verdict does not depend on that group.

### WO-163

**[VER-001](../verifications/WO-163/VER-001.md)** — verification, 2026-09-28, judged by codex-cli gpt-6-astra; criteria judged unmet: 4; judging 15 min, repair 19 min; one other finding or observation.

- F1 (medium): `order-text`, from planning, found by the criterion's own check, reached in ordinary use, existing check: running the criterion's own command (executor decision D006 had recorded the clause as not demonstrated), new. The diff statistics still show the register with ordinary line counts; the generated attribute is set but does not mark the file generated there, and the plan forbids a diff-disabling attribute.
- F2 (medium): `scope-authority`, from implementation, found by a record audit, reached in ordinary use, existing check: npm run test:docs (docs-check fails on the three links without the added exceptions, as executor D005 recorded), new. The order added three doc-baseline exceptions to suppress links its own file moves broke in closed evidence, without operator authorization for extending the baseline.

## Corrections

A correction is a structured decision that records what a role misread, what was meant and what changed. Fifty-six exist; two name a follow-up, so the other fifty-four never entered the follow-up register. The class is the planner's reading: `claim-beyond-evidence` stated more than the evidence showed; `halted-or-asked` stopped, paused or put to the operator what the record or the role's authority settled; `direction-misapplied` widened, narrowed or misattributed an operator direction; `order-text` the order's own text was wrong (a planning failure); `order-misread` the order was right and was read wrongly; `procedure-error` a lifecycle or record procedure performed wrongly; `wasted-cost` gate runs, edits or live episodes that added no evidence; `contract-weakened` the acceptance contract or its receipts changed to obtain a pass; `design-error` an implementation design mistake corrected during the work.

| Decision | Date | Phase | Class | What failed |
| --- | --- | --- | --- | --- |
| [WO-126-D003](../evidence/WO-126/decisions.md#wo-126-d003) | 2026-09-09 | implementation | `direction-misapplied` | Reduced a missing equipped behavior to a matter of communication, then treated the accepted diagnosis as a second misunderstanding. |
| [WO-126-D008](../evidence/WO-126/decisions.md#wo-126-d008) | 2026-09-09 | repair | `design-error` | The cost estimate left out the observer's own snapshots, and the evidence cache kept successful output without bound. |
| [WO-126-D010](../evidence/WO-126/decisions.md#wo-126-d010) | 2026-09-10 | repair | `claim-beyond-evidence` | Direct timing observations were offered as proof for the gate's canonical entry point without checking that the two invocations were equivalent. |
| [WO-126-D014](../evidence/WO-126/decisions.md#wo-126-d014) | 2026-09-10 | verification | `wasted-cost` | The verifier edited its report after the gate, so one factual fix and one line wrap each cost another gate run and another whole-file read. |
| [WO-126-D019](../evidence/WO-126/decisions.md#wo-126-d019) | 2026-09-10 | repair | `halted-or-asked` | A conversation-only question was taken as permission to pause the repair, and the turn ended after the answer. |
| [WO-126-D022](../evidence/WO-126/decisions.md#wo-126-d022) | 2026-09-10 | repair | `wasted-cost` | Broad gates were rerun and narrated turn after turn in the order whose purpose was to remove that cost. |
| [WO-127-D003](../evidence/WO-127/decisions.md#wo-127-d003) | 2026-09-11 | implementation or repair, unlabeled | `direction-misapplied` | An earlier request for silence was carried past later steering, and the repair queue had not recorded its intent. |
| [WO-127-D004](../evidence/WO-127/decisions.md#wo-127-d004) | 2026-09-11 | repair | `claim-beyond-evidence` | A passing rerun of an unchanged test was presented as enough to discharge a timeout obligation. |
| [WO-127-D005](../evidence/WO-127/decisions.md#wo-127-d005) | 2026-09-11 | implementation or repair, unlabeled | `direction-misapplied` | Engineering choices were attributed to the operator, who had not given those instructions. |
| [WO-128-D003](../evidence/WO-128/decisions.md#wo-128-d003) | 2026-09-12 | implementation | `claim-beyond-evidence` | A startup preload was used as a neutral timing instrument although it changed an input the fixtures judge. |
| [WO-128-D009](../evidence/WO-128/decisions.md#wo-128-d009) | 2026-09-12 | implementation | `procedure-error` | A dated heading was written where the continuation contract requires the exact execution-record heading. |
| [WO-128-D010](../evidence/WO-128/decisions.md#wo-128-d010) | 2026-09-12 | final review | `order-text` | The order's Cost line predicted a saving from removing exclusivity; the same-source comparison measured about 204 s more per fresh gate. |
| [WO-129-D002](../evidence/WO-129/decisions.md#wo-129-d002) | 2026-09-13 | implementation or repair, unlabeled | `direction-misapplied` | Version admission was removed altogether where the direction was a minimum version with no upper bound. |
| [WO-129-D005](../evidence/WO-129/decisions.md#wo-129-d005) | 2026-09-13 | repair | `design-error` | Checkout-local path normalization and a same-process fixture were taken as enough for reuse across worktrees. |
| [WO-130-D003](../evidence/WO-130/decisions.md#wo-130-d003) | 2026-09-13 | implementation | `claim-beyond-evidence` | A queued repair was recorded complete with exit 0 before its test result was read; the result was exit 1. |
| [WO-130-D010](../evidence/WO-130/decisions.md#wo-130-d010) | 2026-09-13 | repair | `procedure-error` | The repair began without recording its dispatch, so the lifecycle stayed in needs-fix and the briefing was never printed. |
| [WO-130-D013](../evidence/WO-130/decisions.md#wo-130-d013) | 2026-09-13 | repair | `design-error` | Delivery of the briefing to the model was taken as delivery to the operator, who saw neither the supports nor the intent line. |
| [WO-130-D014](../evidence/WO-130/decisions.md#wo-130-d014) | 2026-09-13 | repair | `wasted-cost` | A repair shipped through a compiler release that staled three evidence editions, one of them paid for with a live model episode. |
| [WO-131-D015](../evidence/WO-131/decisions.md#wo-131-d015) | 2026-09-14 | planning | `procedure-error` | The reviewed acceptance block was edited as if that were an ordinary execution continuation. |
| [WO-131-D016](../evidence/WO-131/decisions.md#wo-131-d016) | 2026-09-14 | implementation or repair, unlabeled | `halted-or-asked` | A conversation-only question ended execution again, four days after the same failure was corrected in WO-126. |
| [WO-049-D002](../evidence/WO-049/decisions.md#wo-049-d002) | 2026-09-16 | implementation | `direction-misapplied` | An admission of guessing was treated as a wording defect instead of as evidence of the reasoning failure. |
| [WO-049-D005](../evidence/WO-049/decisions.md#wo-049-d005) | 2026-09-16 | implementation | `claim-beyond-evidence` | Readback was declared unavailable without inspecting the session record, and a harness preference was placed in the shared floor. |
| [WO-049-D006](../evidence/WO-049/decisions.md#wo-049-d006) | 2026-09-16 | implementation | `direction-misapplied` | A preference for one harness was extended to a separately launched worker. |
| [WO-133-D002](../evidence/WO-133/decisions.md#wo-133-d002--sessionstart-means-the-actual-host-event) | 2026-09-16 | implementation | `order-text` | The order assumed a session-start hook was already registered; it was not. |
| [WO-133-D004](../evidence/WO-133/decisions.md#wo-133-d004--keep-historical-compiler-identity-explicit-in-test-oracles) | 2026-09-16 | implementation | `design-error` | A marker function with file effects was placed in the pure compiler, and historical fixtures were expected to follow a compiler patch unchanged. |
| [WO-054-D007](../evidence/WO-054/decisions.md#wo-054-d007) | 2026-09-18 | verification | `direction-misapplied` | The verifier investigated what the ideation had not asked for, then stopped at raw capture; the operator needed three corrections to obtain the documented default. |
| [WO-099-D010](../evidence/WO-099/decisions.md#wo-099-d010) | 2026-09-20 | implementation | `order-misread` | An operator-review assumption was read as deciding who runs the live row, so the row was filed at the fixture level. |
| [WO-099-D015](../evidence/WO-099/decisions.md#wo-099-d015) | 2026-09-20 | repair | `design-error` | The capsule was completed at dispatch while the command built at declaration was reused, and a clearance no production path could append was counted as one. |
| [WO-146-D014](../evidence/WO-146/decisions.md#wo-146-d014---correction-d012s-cold-start-figures-were-superseded-two-bytes-per-role-by-its-own-continuation) | 2026-09-20 | repair | `claim-beyond-evidence` | Cold-start totals superseded by the order's own later change were left standing as its figures. |
| [WO-146-D015](../evidence/WO-146/decisions.md#wo-146-d015---correction-d008s-cold-start-figures-and-the-budget-acceptance-quote-a-superseded-measurement) | 2026-09-20 | final review | `claim-beyond-evidence` | A second set of superseded cold-start totals stood in a decision and in a budget acceptance's reason. |
| [WO-148-D003](../evidence/WO-148/decisions.md#wo-148-d003) | 2026-09-21 | implementation | `order-text` | The order's objective read as though the mission policy declares the vision path and thesis headings; it declares neither. |
| [WO-148-D010](../evidence/WO-148/decisions.md#wo-148-d010) | 2026-09-21 | implementation | `claim-beyond-evidence` | An in-process cycle stood in for the run the criterion names, and an attempt without a verdict was labelled observed. |
| [WO-148-D011](../evidence/WO-148/decisions.md#wo-148-d011) | 2026-09-21 | implementation | `order-misread` | A criterion about physical paths was read as covering three named artefacts, so the report carried a home-directory path. |
| [WO-148-D019](../evidence/WO-148/decisions.md#wo-148-d019) | 2026-09-21 | repair | `claim-beyond-evidence` | A green product gate was reported as showing the changed scripts clean although that gate never runs the formatter; the document gate then failed. |
| [WO-100-D008](../evidence/WO-100/decisions.md#wo-100-d008) | 2026-09-22 | implementation | `claim-beyond-evidence` | An effort default was left unknown on the unchecked premise that the configured effort would apply; the launch ignores user configuration. |
| [WO-100-D019](../evidence/WO-100/decisions.md#wo-100-d019) | 2026-09-22 | repair | `claim-beyond-evidence` | Two decisions, a verification and a repair record cite a section of the security document that does not exist. |
| [WO-111-D012](../evidence/WO-111/decisions.md#wo-111-d012) | 2026-09-24 | repair | `claim-beyond-evidence` | Write-backs named the wrong cause for a portfolio stop, called an accurate drift finding a fixture error and said release preparation changed no files. |
| [WO-111-D014](../evidence/WO-111/decisions.md#wo-111-d014) | 2026-09-24 | repair | `procedure-error` | Completion of a scoped repair was conflated with acceptance of the proof, so repair-complete was withheld. |
| [WO-111-D016](../evidence/WO-111/decisions.md#wo-111-d016) | 2026-09-24 | verification | `halted-or-asked` | A failed verification routed the order to three operator decisions outside the lifecycle where the only legal action was a repair within the order's authority. |
| [WO-114-D009](../evidence/WO-114/decisions.md#wo-114-d009--correction-ver-001s-headline-overstates-the-gate-result) | 2026-09-24 | verification | `claim-beyond-evidence` | A verdict line described an intermittent failure as a failing gate. |
| [WO-114-D011](../evidence/WO-114/decisions.md#wo-114-d011--correct-contract-and-evidence-claims) | 2026-09-24 | repair | `claim-beyond-evidence` | A decoder's ownership and a schema export were misdescribed, and a live audit was called necessary before the registered source set was checked. |
| [WO-111-D017](../evidence/WO-111/decisions.md#wo-111-d017) | 2026-09-25 | repair | `wasted-cost` | Another live rerun was treated as the necessary next repair despite its cost; the operator ended the cycling on one criterion. |
| [WO-111-D018](../evidence/WO-111/decisions.md#wo-111-d018) | 2026-09-25 | repair | `procedure-error` | A verifier's note was followed as a direction to edit a historical planning document. |
| [WO-111-D019](../evidence/WO-111/decisions.md#wo-111-d019) | 2026-09-25 | repair | `contract-weakened` | A demand for a prompt decision was taken as authority to weaken the judged criterion and to reclassify an observed outside write as accepted. |
| [WO-111-D020](../evidence/WO-111/decisions.md#wo-111-d020) | 2026-09-25 | repair | `contract-weakened` | An incidental launch defect was treated as a permanent blocker, and the acceptance text and receipts were briefly changed to obtain a pass. |
| [WO-158-D016](../evidence/WO-158/decisions.md#wo-158-d016) | 2026-09-25 | implementation | `design-error` | A fixture's teardown handled a race during removal and not in the permission walk before it. |
| [WO-158-D017](../evidence/WO-158/decisions.md#wo-158-d017) | 2026-09-25 | implementation | `order-text` | The planning pass filed eight orders without the release placeholder the continuation check expected. |
| [WO-159-D004](../evidence/WO-159/decisions.md#wo-159-d004) | 2026-09-25 | implementation | `order-text` | The command in the order's criterion could not list what the criterion says it lists. |
| [WO-159-D013](../evidence/WO-159/decisions.md#wo-159-d013) | 2026-09-25 | implementation | `order-text` | The planning pass recorded a baseline of one trust entry; the operator's edit had not been saved and the file still held 43. |
| [WO-159-D014](../evidence/WO-159/decisions.md#wo-159-d014) | 2026-09-25 | implementation | `order-text` | The order named one registered source; the change edits eight, seven of them judged feedback sources. |
| [WO-159-D018](../evidence/WO-159/decisions.md#wo-159-d018) | 2026-09-25 | repair | `design-error` | A probe row was treated as one episode where it holds several invocations. |
| [WO-162-D013](../evidence/WO-162/decisions.md#wo-162-d013) | 2026-09-27 | repair | `halted-or-asked` | The executor stopped the operator with a blocking question about a mechanical consequence it already held the evidence for, and held its writes while background agents ran. |
| [WO-162-D014](../evidence/WO-162/decisions.md#wo-162-d014) | 2026-09-27 | repair | `claim-beyond-evidence` | Five decisions and the roadmap stated more than was measured: a defect called unreachable reproduced, and an inventory was called whole that was not. |
| [WO-162-D016](../evidence/WO-162/decisions.md#wo-162-d016) | 2026-09-27 | repair | `procedure-error` | A decision bound by an amendment row was edited and bound again; no text could then satisfy both rows. |
| [WO-163-D019](../evidence/WO-163/decisions.md#wo-163-d019--correction-the-verifier-started-a-product-gate-it-did-not-need) | 2026-09-28 | verification | `wasted-cost` | The verifier started the full product gate before reading the passing row already recorded for the same code identity. |
| [WO-163-D021](../evidence/WO-163/decisions.md#wo-163-d021--correction-the-final-reviewer-asked-the-operator-to-confirm-a-waiver-they-had-already-given) | 2026-09-28 | final review | `halted-or-asked` | The final reviewer asked the operator to confirm a waiver the record already showed as authorized; it was the third dispatch to raise it. |
