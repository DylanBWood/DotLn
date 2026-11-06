# WO-257 handoff

The executor's implementation of WO-257 delivers the eighteen fixes, the third
allow rule, the kit guide and product 07 write-backs, the fork's paste-ready
block ([D030](decisions.md#wo-257-d030--step-20-the-paste-ready-block-for-the-forks-next-pass))
and the six carried follow-ups, each recorded in [decisions.md](decisions.md)
(D004 to D030; the review ladder's dispositions in D031 to D037). Two corrections are recorded against the order's own text:
the unclassified planning dispatches came from the host's pasted-content
wrapper, not the slash command's block (D002), and the auto-mode classifier
denied reading the intake captures from the main checkout (D003).

## Criteria

**Criterion 1:** met. `renderMetaTable` renders one sentence beginning "Against WO-997, the previous closed order:" listing wall clock, tokens, USD, commands, steps, bound stops and bound acceptances once each (`scripts/test-process-debt.mjs`, the subject meter case; process-debt). D004.

**Criterion 2:** met. The emitted planner root carries the no-update sentence naming a journaled `planning:` or `ideation:` dispatch and a pending entropy review or refutation dispatch; `node scripts/launchpad.mjs update --finish` under a planted planning row is refused naming the operator's in-session request, admitted with `--operator-request --capture <file> --capture-hash sha256:<digest>`, journaled and recorded in the sibling receipt (`scripts/test-launchpad-update.mjs`; launchpad); `harness check` passes in the generated preflight. D005.

**Criterion 3:** met. A fixture export without `documents.json` reaches `README.md` and its linked pages through the `front-page` default, and `How to start: README.md.` counts as a link (`scripts/test-docs-check.mjs` WO-257 case; docs-check-fixtures). D008.

**Criterion 4:** met. A changed renderer named in the explicit table (the writer, the module that renders the page, every module whose render or format function they import, a closure the test derives from the sources and pins inside the table, and the modules whose projected words the pages carry, named by hand) prints one `Read before upgrading` line carrying every changed renderer once and the union of the regeneration commands; a changed settings emitter or committed `.claude/settings.json` prints the new-session line; a release changing neither, a helper a writer imports included, prints only the source-only line (`scripts/test-release-preparation.mjs` WO-257 case; release-preparation). D009, D034, D035, D036; the exhaustive classification the repair round proposed is a follow-up.

**Criterion 5:** met. The target-subject receipt renders `<tmp>/…`, labels the planning branch, names the uninstalled copy, refuses the planted summary naming the line, passes docs-check, and the correction route keeps the retained original and rebinds the hashes (`scripts/test-entropy-review.mjs` criterion 5 case; plan-refutation). D010.

**Criterion 6:** met. A record filed by `target-records` ends with one provenance line naming the launchpad by its release display name (screened as its own surface, advisory when unset), the launchpad tree at filing (kept in the pending operation, so a retry writes the same bytes) and the record's path there, against which its relative links resolve (`scripts/test-target-worktree-publish.mjs`; target-worktree). D011, D031.

**Criterion 7:** met. The export fixture without product 00 passes `npm run plan -- check` between an order change and the receipt, and a product 00 present at a receipt's revision and removed by a later commit is refused by the committed judgment as a changed input by name, not by a thrown read (`scripts/test-launchpad-planning.mjs`; launchpad-planning). D012, D035, D036.

**Criterion 8:** met. The index shows an executor-unmet criterion by its later judgment with the executor's ordinal beside it (`scripts/test-work-orders.mjs` criterion 8 case; work-orders-fixtures). D013.

**Criterion 9:** met. Bootstrap in a fixture clone with a registered target and no mapping prints the diagnostic naming the places read (this checkout, the primary checkout, the main worktree) before any check fails, a linked worktree whose committed configuration registers the target reads the primary checkout's mapping, and a malformed mapping is named (`scripts/test-launchpad-export.mjs`; launchpad). D014, D031, D034.

**Criterion 10:** met. A valid header plus a malformed duplicate is refused naming both lines, and a header whose value is followed by a note, by text at a word boundary, or sits on the line after the label is read by main's expression anchored at each counted label (`scripts/test-target-worktree-release.mjs` four criterion 10 cases; target-worktree). D015, D034, D035, D036.

**Criterion 11:** met. The block fixture journals `planning:`, class `direction`, role `planner` at the dispatch line; the same text without the block the same; prose then a quoted dispatch none; the embedded Codex reader agrees; `harnessWorkerWords` reads `fable` after the block; a `<task-notification>` opening is journaled as `leadingElement` (`packages/compiler/test/harness.test.ts` WO-257 case; compiler; `scripts/test-harness.mjs` WO-226 rows; harness-fixtures). D016, with the cause corrected in D002.

**Criterion 12:** met. The over-ceiling planning fixture's dry run prints the measured size, the ceiling, the batch plan and every batch's prompt with its digest; the fixture transport runs one worker per batch and records one `round-1-criteria` report keyed by batch with every batch's Items rows; the record route takes a split round part by part (`--batch N`), binds each part to the plan at its record and, through `--brief-sha256`, to the dry run's brief, names every kept part in a merged refusal and merges when every part is in; `--since <tree>` carries only the documents changed since the tree, an untracked document unchanged since it left out; a document past a batch's room is a pointer to the checkout; an under-ceiling fixture launches one worker; a batch returning no report records nothing and is named (`scripts/test-review-worker.mjs` criterion 12 case and the two WO-257 round cases; plan-refutation). D017, D031, D034, D035.

**Criterion 13:** met. The separate-track fixture's subject lists the two open members after the sequenced orders under `subject.separateTrack`, the receipt validates after a member closes (the fold read at the receipt's revision), a receipt filed before the key keeps its subject, `amend-order` on one member is admitted; the closed member and the other workstream's order are not added (`scripts/test-plan-refutation.mjs` criterion 13 cases; plan-refutation); the export fixture's `plan refute` prompt names both members after WO-001 (`scripts/test-launchpad-planning.mjs`; launchpad-planning). D018, D031.

**Criterion 14:** met. A rules-recorded entry whose row is only in a retained lane passes with and without `order`; an entry with no row is refused naming the live directory and the retained lanes (`scripts/test-plan-refutation.mjs` rules case; plan-refutation). D019.

**Criterion 15:** met. `status` on an edited `current.md` warns naming `npm run resume -- status --refresh`; the refresh rewrites the file, appends no event and prints the same status; the next `status` prints no warning (`scripts/test-resume.sh`; resume). D020.

**Criterion 16:** met. A front page linking a decision record passes the entry-point check; the same link from Start here fails naming the record (`scripts/test-docs-check.mjs` WO-257 case; docs-check-fixtures). D021.

**Criterion 17:** met. The emitted `.claude/settings.json` and the Copilot settings carry `Bash(node scripts/worktree.mjs publish *)` beside WO-246's two rules; `harness check` passes; a release changing the settings emitter prints the new-session line (`scripts/test-harness.mjs` 'three publish helpers'; harness-fixtures; `scripts/test-release-preparation.mjs`; release-preparation). D022.

**Criterion 18:** met. `README.md` carries the Map link to `docs/README.md` and the Try it paragraph; `npm run test:docs` passed its front-page checks on 2026-11-06 (launchpad-docs: the front page is a pinned instance seed; docs-check: 17 product documents, 0 failures); `npm run plan -- documents` on 2026-11-06 read 338 standing documents with 325 unread rows in the five-release window and tagged none red. D023.

**Criterion 19:** met. The kit guide and product 07 state the fixes as built (D008, D009, D010, D017, D018, D019, D020, D022, D024, D025, D026, D027); `npm run publication:check` passed on 2026-11-06 after `npm run sync`.

**Criterion 20:** met. `npm test -- --review` passed on its third run (46 suites, 0 failed, 120 fresh tasks, 0 h 45 min, started 2026-11-06T15:35:19Z, tree `26fa8f7eb884`, code identity `874d70964c33`, recorded in the harness checks lane); `npm run test:docs` passed (27 of 27, 0 h 2 min, 2026-11-06T16:27Z) on its second run, the first having failed on one anchor, the decisions index's link to D010 whose heading carried placeholder markup the two anchor readers slug differently, retitled under D010; `git diff --check` clean (2026-11-06); no new dependency (`package-lock.json` changed only in the workspace pins).

## Review ladders

Round 1 ran six reviewers by the operator's direction (D028): the three Claude `dotln-worker` agents (claude-opus-5-5, xhigh; criteria, design, consistency over the order's diff, recorded in `docs/control/local/reviews/WO-257/round-1-<kind>.md`) and the three Codex astra workers through `npm run worker -- review --host codex --model astra --since 48cc35695eb3` (recorded in the since-lane `since-48cc35695eb3/`). Findings: Claude design 17, criteria 12 (1 blocking), consistency 12; Codex design 5, criteria 7 (6 blocking), consistency 3 (2 blocking); 56 in all, 9 blocking. Dispositions in D031 (fixed), D032 (recorded, not fixed) and D033.

Round 2 re-tasked the three Claude reviewers over the tree `d40715b61b6d` with their round-1 reports (`round-2-<kind>.md`): design held 11 of 17 and noted 2, criteria held 10 of 12 and found 2 (one should-fix), consistency found 11 of 12 fixed and found 6 (two should-fix). Every should-fix and note is fixed except the five design and one criteria items D032 records; dispositions in D034.

Repair ladder: the first complete run failed on one suite (below); its one-line repair took one combined round (`repair-1/round-4-combined.md`, tree `122cdd31759b`, over the change since the round-3 tree with round 3's report as rechecks): 4 of 5 rechecks held and 5 findings (2 blocking), four fixed and one recorded; dispositions in D036. No reviewer ran after it: the executor judged the remaining delta. The second repair, the regenerated declared-cases fixture, took no round under the ladder's skip for regenerated files (D037).

Round 3 launched one fresh combined worker over the delta since the round-2 tree `d40715b61b6d` with the three round-2 reports and the three Codex round-1 reports as rechecks (`round-3-combined.md`, tree `459acde5d2bc`): 17 of 19 rechecks held (design.2.F2 and consistency.1.F1 not held) and 5 findings (2 blocking), every one fixed; dispositions in D035. The round-2 consistency report was recorded as prose and carries no finding ids, so its six findings were judged through round 3's consistency trace rather than by id.

Uses against `subagentCap` 20: six launches (three Claude agents, three Codex workers through the helper) and three re-tasks through round 2, one launch in round 3 and one in the repair ladder's combined round: eleven by this executor's count; `harness usage` reads launched 5 (claude 5), re-tasked 3, remaining 12, since the helper's Codex launches are not Agent tool calls it observes.

## Complete runs

1. `npm test -- --review` started 2026-11-06T14:19:51Z at tree `45da23035b67` (code identity `5cb7286054e9`): failed after 11 min, 12 suites passed, outward-lint failed on its copied CLI's fixed module list (`scripts/lib/feature-registry.mjs` missing) and 33 suites were not started; repaired under D036.
2. `npm test -- --review` started 2026-11-06T15:05:55Z: failed after 26 min, 34 suites passed, runner-fixtures failed on its declared-cases pin for the target-worktree files (three WO-257 cases not yet in `scripts/fixtures/target-worktree-cases.json`) and 11 suites were not started; the fixture was regenerated by the test's own collection under D037, with no reviewer round over that regenerated record (the ladder's skip rule; D037).
3. `npm test -- --review` started 2026-11-06T15:35:19Z at tree `26fa8f7eb884` (code identity `874d70964c33`): passed, 46 suites, 0 failed, 120 fresh tasks, 0 h 45 min. No reviewer ran after it.

## Recorded, not fixed

D032 records round 1's design F11 (the dispatch hold's journal reader stays beside four readers), F13 (records admitted by the `front-page` id), F14 (`runChangeReview`'s length), F16 (the confinement tail copied in both renderers, pinned by the historical receipts' byte-exact re-rendering) and F17 (the remedy branched in four places), and criteria F11 (the emitted hook and the reader held equal by `harness check`); round 2 re-read each and held the disposition. D033 records the one refusal that widens in v0.119.0, the retired overlay's, for the final reviewer's Read before upgrading item.

## Untested

- A live Codex launch of batched briefs: criterion 12 ran under the fixture transport only; the record route's batch path and `--brief-sha256` ran under the fixture.
- The repair round's fixes had no later review round: the ladder ends at the combined round, so their checks are the executor's reading, the focused suites and the second complete run.
- The merged refusal that names every kept part of a split round has no fixture (D036).
- Integration with main: main did not move during this order (merge-base equals main at `be65193081651565deb32596d1698d361d6e515d`), so no integrate ran before the complete run.
- A live `launchpad update --finish` under a planning dispatch: the hold and the admission ran in the launchpad fixtures.

## Outcome against the order's aim

The outcome matched the order's aim: each of the eighteen instance returns is closed by a kit change tested where the instance met it, the kit guide and product 07 state the fixes as built, the fork's paste-ready block (D030) carries what its next pass must do, and the six carried follow-ups are delivered. Goal Alignment: the traps named at entry were the scope creep of the hook cause and the feedback-judged protocol; both held (D002 bounded the adjacent repair to the reader, D017 kept the protocol unchanged). The trap that did bite was the renderer boundary of criterion 4, which every review round reopened with a new example; it is closed by judgment in D036, with the exhaustive classification the last reviewer proposed recorded as a follow-up rather than built. The NoOp, leaving the returns to the instances' profiles, was rejected in the order itself.

## Follow-ups

The six carried follow-ups are delivered: FUP-1116ba845c557862 (D024), FUP-3c371de4deb7c876 (D009), FUP-3d64b267a45d2f34 (D025), FUP-712bb6562937332a (D011), FUP-a9efc000150d7e9f (D026), FUP-b40bcf1b69c77008 (D027); FUP-6dfaa29e3f0ba4fd's ceiling half (D017, with the remainder as a new follow-up) and FUP-78158140c6ac12aa (D023). The operator's request for an auto-merge election is recorded as a follow-up (D029).

## Attestation

Claude Code 2.1.318, claude-fable-5-1, effort max, source claude-session-readback: this session exports `CLAUDE_EFFORT=max`, which the resume command reads before any operator attestation. The operator's authorization to run past the 8 h wall-clock bound (their words of 2026-11-06, captured in the ignored intake lane) is recorded as `DispatchBoundAccepted` for both metrics, ceiling as needed.

## Process cost

Read with `node scripts/harness.mjs usage 1a21fa6f-0fad-4c0b-86c6-f5663b011dac` at 2026-11-06T16:20:46Z (source claude-transcript-message-usage, scope dispatch, cutoff the dispatch's start 2026-11-06T03:36:26Z): 242,235,354 total tokens, of which 238,464,035 cached input, 2,659,003 cache writes, 15,030 uncached input and 1,097,286 output; reasoning tokens and USD cost unavailable (unknown). Wall clock 12 h 45 min of the dispatch, including 0 h 9 min the second complete run waited for host lanes; 1,027 commands over 1,216 steps. Complete runs: three (0 h 11 min failed, 0 h 26 min failed, 0 h 45 min passed); document gate: two (0 h 2 min each). Workers: by this executor's count eleven uses of the cap of 20 (six round-1 launches, three round-2 re-tasks, one round-3 launch, one repair-round launch); `harness usage` reads launched 5 (claude 5), re-tasked 3, remaining 12, since the three Codex workers ran through the helper rather than as observed Agent calls. Compared with the one-reviewer-per-kind ladder the executor root names, the operator's six-reviewer round 1 roughly doubled round 1's worker tokens and found 56 distinct findings (9 blocking) where three reviewers would have found the Claude trio's 41; the Codex trio's 15 included the batching, footer and separate-track defects that shaped the later rounds, so the extra round-1 cost bought the defects the later rounds would otherwise have found one round later each.

self-review: found 76; fixed 69; recorded 7; rounds 4; unreviewed 379 lines (the repair round's fixes, the regenerated declared-cases fixture and the D010 retitle after the ladder's last round, six files, judged by the executor under D036 and D037). Reports: `docs/control/local/reviews/WO-257/round-1-criteria.md`, `round-1-design.md`, `round-1-consistency.md`, `since-48cc35695eb3/round-1-criteria.md`, `since-48cc35695eb3/round-1-design.md`, `since-48cc35695eb3/round-1-consistency.md`, `round-2-criteria.md`, `round-2-design.md`, `round-2-consistency.md`, `round-3-combined.md` and `repair-1/round-4-combined.md`. The executor read every changed standing document's diff as a whole after each round, every decision record against the code it names, and this handoff against the order's twenty criteria; the two judgments the final reviewer should weigh first are the renderer boundary closed in D036 and the reviewer round skipped over the regenerated declared-cases fixture in D037.
