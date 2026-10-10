# WO-198 FINAL-001 — final review

**Verdict:** pass. Every gate row a worktree records now carries the shared refs it saw at start and end, a failed row prints one `shared refs moved:` line naming each field that changed since the same check's previous row or during the run, a passing row prints nothing, and a fixture shows a sibling's commit, annotated tag and push landing on `main` between two runs of a linked worktree's document and plain gates while every task keeps its result. All five criteria are met at the integrated subject, which is byte-identical to the one VER-005 judged. This review found no new defect: the findings block is empty, the verifier's one board (B1, [D004](../../evidence/WO-198/decisions.md#wo-198-d004--verification-fail-on-a-regression-a-malformed-earlier-snapshot-shows-one-defect-outside-the-surfaces-boarded)) stays boarded, no follow-up row's seam was opened, and the planning receipt's cost condition on `runner-fixtures`, which holds as written, is recorded for planning in [D021](../../evidence/WO-198/decisions.md#wo-198-d021--final-review-pass-at-the-integrated-subject-the-receipts-cost-condition-recorded-for-planning) with its measurements.

**Subject:** [`docs/work-orders/WO-198-a-worktree-gate-names-what-moved.md`](../../work-orders/WO-198-a-worktree-gate-names-what-moved.md) on branch `wo-198`, uncommitted over `main` at `bb84ae82bd5b8e0b92a3face9578e9c3672ba61a`, which is also the base the third repair integrated ([D010](../../evidence/WO-198/decisions.md#wo-198-d010)): `main` had not moved since, so this review's integration fast-forwarded nothing and resolved no conflict.

- VER-005 judged code identity `a5923da78b9a4172b5178361bacfab9b5ecdec98d3912331f378e79a28ea67c8`. The identity was read before integration and again after it and is unchanged, so the executor's fresh `npm test -- --review` row at that identity (recorded 2026-10-10T00:34:59.431Z, 90 fresh tasks, 1,731.679 s, exit 0) is the row this review's composed gate reuses. No behavioral byte was edited in this review.
- The order differs from `main` only in its heading's version label, `(v0.73.1)`, assigned at activation as v0.72.1 ([D001](../../evidence/WO-198/decisions.md#wo-198-d001)) and retimed above the observed v0.73.0 baseline at the third repair's integration ([D010](../../evidence/WO-198/decisions.md#wo-198-d010)). The five criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-198/` holds no `ideation.md`. The nomination provenance is the 2026-10-07 machinery-reset planning pass (§4.1) and its refutation receipt 041, whose one WO-198 known issue is the `runner-fixtures` cost condition judged under Known issues below. The order's own receipt known issue (the reduced table may not hold the task the operator saw flip) is carried unchanged: no live flip has been observed since the order.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.296) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the 17 WO-198 runner cases under the bounded runner, the real-corpus comparison of the reader against direct Git, the gate-index readback, the duration readings and the printed affected checks.

**Process cost:** entry 143414 tokens; handoff 5560487 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 5a4027b4-374a-4555-ba89-4066728c62c6`.

- Entry was observed at 2026-10-10T01:12:12.611Z, after 3 steps and 2 commands: 91,945 cached input, 50,927 cache-write, 36 uncached input and 506 output tokens.
- Handoff was observed at 2026-10-10T01:29:06.883Z, after both gates had passed and the PR body and release notes were written, 85 steps and 84 commands in: 5,184,165 cached input, 325,194 cache-write, 774 uncached input and 50,354 output tokens; subagents observed 0 of the cap of 20. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The report, the decision, the result transition, the commits and the publish step follow the cutoff.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate was not run fresh, because integration left the code identity unchanged and the runner composed a passing row from the executor's 37 reused tasks plus the always-fresh format preflight in 7.82 s; a fresh run at this identity cost the executor 1,731.7 s. The focused cases, the real-corpus probe and the affected checks ran here in under two minutes of compute. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-198/FINAL-001.md`.

Read in full: the order; VER-001 to VER-005; the control log; `handoff.md`, `implementation-handoff.md`, `self-review.md` and `repair4-self-review.md`; `repair4-fixture-transcript.txt`, the tails of `repair4-docs-gate.txt` and `repair4-review-gate.txt`; D001 to D019 and the helper's draft D020; `meta.json`; the complete diffs of `packages/skeleton/src/gate-evidence.mjs`, `scripts/test-runner.mjs` and `scripts/test-runner.test.mjs`; the product 07 write-back; the version, package and lockfile changes; the regenerated harness manifest and hooks (snapshot path, hashes and the 0.35.1 label only); the regenerated index, history, decisions-index and follow-up-register diffs; product 07 §Independent workflows and integration and §Verification review and attack; product 08 §PRs and commits; the planning pass §4.1, its catalog row and refutation receipt 041's WO-198 entry; `package.json` and `docs/control/budgets.json`.

Reviewed: the complete subject diff against `main` after integration: 33 modified tracked files (1,324 insertions, 179 deletions), of which the six source, test and version files account for 982 insertions and 4 deletions, plus the untracked order records (the control segment, evidence, verifications and this review's directory). The generated projections were judged by their generators' checks, not read line by line.

Lenses, and why:

- **Correctness and tests:** the diagnostic runs on every gate and sits in the failure path before the row is recorded, so four verifications found a way for it to lose a row or a line; the lens is whether any remains after the fourth repair.
- **Design and coupling:** the snapshot must stay outside the code identity and the verdict, and the strict identity helper must stay strict while the diagnostic reads degrade.
- **Operator flow:** the reader of a failed row must get one line that names a field, and a passing row must stay quiet.
- **Maintainer in six months:** two sentinels (`absent` and `unreadable`) with different comparison rules, a validator and a history lookup inside a catch.

Goal alignment:

- **Traps:**
  - Carrying VER-005's pass across an integration without checking that the integrated bytes are the judged bytes.
  - Treating the receipt's fired cost condition on `runner-fixtures` as a reason to fail, to trim the fixture in review or to leave it as a report sentence.
  - Spending a fresh 29-minute review gate at an identity whose tasks already passed.
  - Reading the four verifications' repair loop as grounds to attack the diagnostic again from scratch rather than to re-derive the rule the fifth report settled.
- **What I did:**
  - Read the code identity before and after integration, re-ran the 17 WO-198 cases, compared the reader with direct Git on the real corpus, read every row at the identity directly from the hot index, and ran every printed affected check.
  - Measured the task's duration in the review row and in main's index, found the growth predates the order, and recorded the condition with its readings and a planning follow-up in D021.
  - Let the runner compose the review gate from the executor's passing tasks at the unchanged identity.
  - Re-derived each criterion from the fixture output, the rows and the source, and carried VER-005's twelve transition scenarios and 72-gate matrix on its evidence.
- **NoOp:** leaving the order unreviewed keeps every worktree gate row silent about the shared refs it saw, so the next suite that fails after a sibling merge costs the operator the hour the order was filed to remove.

Integration: `npm run backup:intake` archived the three intake placeholders into the session scratch, and `npm run worktree -- integrate WO-198 --intake-backup <archive>` checkpointed the work (`refs/dotln/checkpoint/WO-198/23`), kept the named stash `c1c0f8dcb332ae8c005879e4b7db492b19769863`, fetched `main` at the order's base, re-applied the work and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (v0.73.1 remains current above the observed v0.73.0), the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures; only the meter snapshot and the meter block of `PR.md` changed. Before the helper ran, `git ls-remote` showed origin's `main` at `bb84ae82` and its newest tag `v0.73.0`, equal to the local snapshot every gate row at this identity records. [D020](../../evidence/WO-198/decisions.md#wo-198-d020) records both bases, the unchanged identity, the carried-forward claims and the component check: upstream carries skeleton 0.57.0 and this order advances it to 0.57.1 with the console pin and lockfile, which no upstream commit consumed; the evidence editions this order minted (revision 004) remain the selected ones.

## Earlier findings

- **VER-001 F1** (a malformed earlier snapshot crashed a failed gate before it recorded): repaired by [D005](../../evidence/WO-198/decisions.md#wo-198-d005--repair-incomplete-diagnostic-baselines-without-hiding-the-failed-gate), re-verified by VER-002 to VER-005. In my run the two retained whole-gate cases and the 21-shape validator case pass; by source, `completeSharedRefs` is checked on both snapshots before any nested read.
- **VER-002 F2** (a damaged gate-history archive stopped a failed gate from recording): repaired by [D007](../../evidence/WO-198/decisions.md#wo-198-d007--keep-diagnostic-history-failures-from-interrupting-failed-gate-recording); the damaged-archive and unselectable-timestamp cases pass in my run; by source, the whole previous-row selection sits inside the catch and the comparison and `recordGateChecks` sit outside it.
- **VER-002 F3** (sixteen whole-gate cases for a pure validator): folded in by [D008](../../evidence/WO-198/decisions.md#wo-198-d008--exercise-malformed-snapshot-shapes-without-repeating-the-fixture-gate); the validator case took 0.5 ms in my run.
- **VER-003 F4** (a shared ref Git could not enumerate made the snapshot throw where `main`'s gate passed): repaired by [D012](../../evidence/WO-198/decisions.md#wo-198-d012--keep-every-shared-ref-read-diagnostic-when-git-cannot-complete-it) and re-shaped by D017; VER-004 and VER-005 each ran a 36-gate matrix on the subject and on `HEAD`. In my run the unreadable-tag and damaged-`packed-refs` cases pass; by source, every read in `readSharedRefs` goes through the one non-throwing helper and the strict `git()` helper is byte-identical to `main`.
- **VER-004 F5** (the repaired comparison never named a branch created or removed, and dropped the whole snapshot when one field was degraded): repaired by [D017](../../evidence/WO-198/decisions.md#wo-198-d017--compare-observed-absence-and-withhold-only-unreadable-fields), confirmed by VER-005's S1 to S12. In my run the linked-worktree witness prints exactly `shared refs moved: since previous: origin/main absent..<id>` once, and the direct comparison case covers each `unreadable` field on either side.
- **VER-001 B1** (the harness evidence command records a snapshot-less `npm test` row that hides the next since-previous delta): stays boarded as D004 and FUP-f5f10101e717d59b, deferred to the next order that edits `runHarnessEvidenceChecks`. It is outside the declared surfaces and breaks no criterion at this identity; no such row was recorded here, and a reviewer writes no behavioral fix.
- **Adversary and improver** (0 found; 0 fixed; 0 recorded, [`self-review.md`](../../evidence/WO-198/self-review.md)): the two Codex workers at `implementation-ready` confirmed the row-selection order that VER-001 then checked in source; neither varied the shape of earlier rows or the ref states, which is where F1 to F5 lay. VER-001 judged their claims and that judgment carries. The four repairs used the separate-pass fallback, which product 07 admits before `repair-complete`.

## Criterion judgments

**Criterion 1:** met

- Rows at this identity, read directly from the hot index: the executor's `npm run test:docs` at 00:05:43.731Z and 00:41:11.814Z and `npm test` review at 00:34:59.431Z, VER-005's document row at 01:00:24.139Z, the verification result's inline document row at 01:05:50.918Z, and this review's document row at 01:25:43.019Z and composed review row at 01:25:59.569Z. Each carries `sharedRefs.start` and `.end` with `originMain`, `main`, `tags.count`, `tags.newest` and `dotlnRefs`; mine read `bb84ae82` for both branches, 153 annotated `v` tags with newest `v0.73.0`, and 1657 `refs/dotln/` refs at start and end.
- On the real corpus, `readSharedRefs` under the bounded runner matched direct Git on all five values (both branch ids, 153 annotated of 153 `v` tags, newest by tagger date `v0.73.0`, 1657 refs) in 41.6 ms.
- Missing refs read `absent` without a throw: the `tolerate absent branches` and `distinguish clean unresolved refs` cases pass in my run, and VER-005's nine-state Git classification is carried. A read Git cannot complete records `unreadable` in its own field, so the four fields are always present (the `retain unknown fields` case).

**Criterion 2:** met

- In my run the forced-failure case prints one line naming `origin/main <a>..<b>`, `main <a>..<b>`, `tags +v9000.0.1 (count 0..1, newest absent..v9000.0.1)` and `refs/dotln/ 0..1`, all prefixed `since previous:`; the unselectable-history and incomplete-baseline cases print one `during run:` line each; the round-trip case prints one line carrying both intervals; the branch-creation witness prints exactly one line naming `origin/main absent..<id>`.
- VER-005's twelve scenarios (S1 to S12), which vary creation, removal, both intervals at once and degraded fields at either row, are carried on its evidence; no probe printed more than one line.
- Passing rows print none: the sibling case asserts it for both gates and the composed run, and my own two gates printed no `shared refs moved:` line (the review gate's transcript was searched).

**Criterion 3:** met

- `WO-198 a sibling merge and tag during a worktree's gates change no result and are named on the row` passes in my run (2.16 s): a linked worktree on `wo-900` runs the document and plain gates, the main checkout commits a change to a file the `alpha` task reads, tags annotated `v9000.0.1`, adds a `refs/dotln/` ref and pushes `main` and the tag to a bare origin, and both gates rerun with `--again`; every task keeps exit 0, the second rows carry the new snapshot (`tags.count` 0 to 1, `dotlnRefs` 0 to 1, both branches moved), no delta line prints, and a composed plain run also passes. The forced-failure case prints the line.
- `runner-fixtures` ran fresh and passed in the executor's review row at this identity (126.537 s) and is the task my composed row reuses; all 17 WO-198 cases pass in 13.16 s under the bounded runner.

**Criterion 4:** met

- No task flipped in the reduced table: [D002](../../evidence/WO-198/decisions.md#wo-198-d002) records the first output, D017 the rerun, and my run reproduces the sibling PROOF lines with every task at exit 0. The reduced table is three fixture tasks; the order's own receipt known issue records that limit, and the delta line is what attributes a live flip.
- The five defects the fixture and the verifiers found in the diagnostic (F1 to F5) are each repaired at the cause with their own regressions, as listed under Earlier findings.

**Criterion 5:** met

- Product 07 §Independent workflows and integration carries the three sentences in place (lines 713 to 715): the rule, the no-invented-baseline rule, and the `absent`/`unreadable` rule; the document measures 184,398 of its 196,693-byte ceiling. [D014](../../evidence/WO-198/decisions.md#wo-198-d014--correct-the-stale-review-freshness-statement) corrected the stale review-freshness sentence in §Discipline under the operator's authorized adjacent item.
- Re-mints: `docs/evidence/current.json` selects WO-198 revision 004 for authority, artifact identity and verification and retains WO-073's feedback edition; revisions 001 to 003 exist beside it. My document gate ran `authority-evidence`, `artifact-evidence`, `verification-evidence` and `feedback-evidence` fresh, each passing.
- `npm run test:docs` passes 32 of 32 suites in 122.59 s at the integrated tree (32 fresh tasks), recorded 2026-10-10T01:25:43.019Z. `npm test -- --review` at code identity `a5923da7…` composes a passing row from the executor's 37 reused tasks plus the always-fresh format preflight: 38 suites, 0 failed, 7.82 s, exit 0, recorded 2026-10-10T01:25:59.569Z as `host-gate:a5923da7…:npm test`, identity and build output unchanged; the executor's fresh run at this identity was 90 tasks in 1,731.679 s.
- `git diff --check` and `git diff HEAD --check` are clean and `npm run format:check` reports every matched file formatted. Root `package.json` is unchanged; only the skeleton label, the console's existing pin and the lockfile move from 0.57.0 to 0.57.1, so no dependency is added.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **A failed gate now reads the whole gate history.** The previous-row lookup calls `readGateChecks(repo)`, which reads the hot index and every archive; VER-002 timed the main checkout's 1,670 archives and 10,760 rows at 439 ms. It runs only on a non-zero exit, inside the catch, and adds no read to a passing gate. It touches the concern of the open row ER4-005 (a recurring gate's cost should not grow with closed history), so it is named under Follow-up register and left to that row rather than counted as a defect: it breaks no criterion and no behavior `main` had.
- **The `runner-fixtures` task is above the receipt's threshold.** Recorded under Known issues with the readings and a planning follow-up; the growth predates the order.
- **A ref Git cannot read because of file permissions reads `absent`** (VER-005's note). Git itself reports such a ref missing, and the rule classifies by Git's result; a delta line would then name `<id>..absent`, which is what any task reading that ref sees.
- **The delta line is richer than the order's sketch.** It prefixes each change with `since previous:` or `during run:` and spells a tag change with count and newest. It is still one line naming each changed field, which is what criterion 2 asks.

## Implementation review

- **Correctness.** The reader's four Git calls go through one helper that keeps only a successful command's stdout or the quiet branch read's clean exit 1; a failure discards partial output, so a count is never invented. The comparison runs only on two structurally complete snapshots, treats `absent` as a value and skips exactly the field that is `unreadable` on either side. The history lookup is the only thing inside the catch; the comparison and `recordGateChecks` are outside it, so a persistence failure still surfaces. The strict `git()` helper that computes the tree and code identity is unchanged, and the snapshot is a row field the identity never reads.
- **Design.** Two sentinels with distinct rules is the minimum that satisfies both F4's rule (a degraded read never changes the gate) and criterion 2 (every observed change is named); VER-004's Git matrix showed the distinction is Git's own exit code, so no extra read was added. The `unreadable` string cannot collide with a commit id or a `v` tag name. A simpler alternative, comparing only the two runs' final values, was rejected in D002 because it misses a move back to the previous value, which the round-trip case now guards.
- **Operator flow.** A failed row yields one line; a passing row and a composed run stay quiet; a degraded shared ref in another worktree cannot fail or silence this one's gate.
- **Maintainer in six months.** The rule lives in three places that agree: the product 07 paragraph, D017's corrected rule, and the comments above `readSharedRefs` and `sharedRefChanges`. The one thing a reader will pause on is that `completeSharedRefs` admits `unreadable` where it rejects `absent` for a count: `absent` is a branch or tag-name value, never a count, and the direct validator case pins that. The fixture file grows by 829 lines, but D008's split keeps whole-gate cases to the behaviors a gate must witness and sends input shapes to direct tests.
- **Clean-room screen.** The snapshot names Git refs and this repository's own control namespace; the fixtures use generic names and a temporary bare origin; nothing names a managed host, a forge account or an internal service.

## Follow-up register

`npm run plan -- followups --touching` lists 22 pending rows by textual match at the integrated tree. This review disposes none, because no listed row's seam was opened and no condition occurred:

- One is this order's own board, deferred on its own terms: FUP-f5f10101e717d59b (D004, B1).
- FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost should not grow with closed history) matches product 07 and the runner. This order adds one whole-history read on a failed gate only, timed at 439 ms over 10,760 rows; the row's own condition (the document gate's median) is unchanged by it, so the row stays open with this observation and nothing here reopens it.
- FUP-3d6a8147368bdf1c (gate marker expiry; reopen when an order edits `activeGateRuns`, `gateProcessStart` or marker removal) and FUP-bf51ac5cd8143d98 (reopen when the next order edits `gateTreeHash`) match `gate-evidence.mjs` because this order edits it; neither named function changed, so neither condition occurred. FUP-079f827e1b11eb1e and FUP-5e52eb500e395237 match the same file and name `gateTreeHash` and `findGateCheck`, also untouched.
- FUP-5094b24d6d68d2e4 (WO-186-D047, planning with the next order that opens the runner's case timing, the gate index reader or the product read guard) matches the fixture file; this order calls `readGateChecks` but does not open the reader, and planning's row is untriaged, so it is left for planning.
- FUP-f1c7a256bec46737 (WO-054-D006, cold-start ceilings) matches product 07; `node scripts/harness-context.mjs --check` reports every role unchanged and within its ceiling in both skill roots (executor 28,112 of 29,246; reviewer 26,884 of 28,884), so the condition did not occur. FUP-0a7c93eed06727ce (WO-187-D013, optimize product 07) matches the document this order grows by six lines to 184,398 of 196,693 bytes, within the ceiling.
- FUP-adf6621e7f958dd8 (ER4-006, retained evidence links its inputs) names this order's four `authority.json` copies; repeated authority copies measure 8,374,430 of 195,267,385 evidence bytes (4.29%), under the row's 10% reopening line, and this order does not edit `scripts/authority-evidence.mjs`.
- FUP-67a07b670440cf5a (findings-block judgment) matches product 07; this report's block is measured and empty. FUP-4b70089b028849f0 (ER5-002) matches the register itself.
- The remaining ten (FUP-8fb7ae17dd0fad5b, FUP-de6162b279f66709, FUP-d0a9719cc2e4ec55, FUP-e821aa2ced3aa111, FUP-e8f5399db33d0b5a, FUP-642d7a4beaed2272, FUP-acfe4bfda716d8fb, FUP-749c959a41178a3b, FUP-fd05316b6030ef73, FUP-bd3e66761dc301ed) match `scripts/test-runner.mjs`, the fixture file, the README or generated projections, and this change opens none of their seams.

`npm run meta` reports the standing reopen candidate WO-150-D003 (`coldStartBytes.executor` above 24,576), which earlier reviews also recorded; the executor measures 28,112 and did not change here.

## Known issues and carry-ins

- **WO-179 VER-002's follow-up** (reopen when a planning pass counts a review rerun caused by main movement): allocated here as the fixture. Criterion 3's case is that fixture, and it passes.
- **Live flip without a delta line** (the order's receipt known issue, 2026-10-07): not reopened, because no live flip has been observed since this order. B1 names the one known path where a live failure would print no since-previous line.
- **`runner-fixtures` growth** (refutation receipt 041, criterion 3; reopen when the task's duration after WO-198 is above its thirty-day median before WO-198 plus one quarter): the condition holds as written, and the growth predates the order. The fresh task read 126.537 s in the executor's review row at this identity; the 219 fresh passing tasks in main's index from 2026-09-09 to activation have a median of 21.754 s, so the threshold is 27.192 s; main's own task read 72 to 94 s on 2026-10-09 before activation and 64 to 67 s on most of 2026-10-05 and 2026-10-06; the task rose from 77.7 s at the first WO-198 row to 126.5 s across the four repairs, under concurrent review tasks. The 17 WO-198 cases take 13.16 s in isolation. The condition is recorded for planning in D021's follow-up (FUP-8bac5e3bddd12494), not repaired here: the fixture is the criterion-3 deliverable, the cases are already split into whole-gate witnesses and direct tests (D008, D017), and trimming a reviewed fixture in review would remove evidence to pass a check.
- **WO-196's reuse known issue** (a reused review row whose task result depended on a shared ref passes without the task re-running unless reuse compares the recorded `sharedRefs`): not this order's scope, and noted as an observation: this review's composed row reused 37 tasks at an identity whose start and end snapshots equal the executor's fresh row on all four fields, so the reuse here is at unchanged shared refs by observation, not by check.
- **Operator-review assumption 1** (extend the table to the operator's named suite): no suite was named, so it does not apply.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section patch edition for v0.73.1.

The proposed PR title is `:loud_sound: A worktree's gate records the shared refs it saw and names the ones that moved when a task fails`. Its gitmoji is `:loud_sound:`, the catalog's entry for adding or updating logs, because the change's purpose is a recorded diagnostic and one printed line on failure. The title leads with what the gate's reader gets; the reader's two sentinels, the five repairs and the version list belong to the body. The last five merged titles run 20, 21, 19, 20 and 18 words; this title's 19 words come from its two clauses, not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Times are 2026-10-10 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage <session>` (entry) | 01:12:12 | 0 | 143,414 tokens, dispatch scope |
| `gateCodeIdentity` (worktree) before integration | 01:15 | 0 | `a5923da7…`, equal to VER-005's subject and the executor's fourth-repair rows |
| hot-index readback at this identity (read directly) | 01:15 | 0 | 5 gate rows before this review, each with a four-field `start` and `end` |
| `git ls-remote --heads origin main`; `--tags origin 'v0.7*'` | 01:17 | 0 | `bb84ae82`; newest `v0.73.0` |
| `npm run backup:intake`; `npm run worktree -- integrate WO-198 --intake-backup <archive>` | 01:17:59–01:18:50 | 0 | archive of 3 placeholders; checkpoint 23; stash `c1c0f8dc…`; bases equal; no conflict; ten projections regenerated |
| `gateCodeIdentity` after integration | 01:19 | 0 | `a5923da7…` |
| `npm run publication:check` | 01:19 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/harness.mjs check` | 01:19 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 01:19 | 0 | every license and publish-refusal row passes |
| `node scripts/docs-check.mjs`; `npm run work-orders -- index --check`; `npm run format:check`; `git diff --check`; `git diff HEAD --check` | 01:20 | 0 each | 15 documents, 0 failures, product 07 at 184,398 of 196,693; both index pages current; all files formatted; clean |
| `node --test --test-name-pattern=WO-198 scripts/test-runner.test.mjs` (bounded) | 01:21 | 0 | 17 passed, 0 failed, 13.16 s |
| real-corpus `readSharedRefs` vs direct Git (bounded) | 01:21:54 | 0 | equal on all five values; 41.6 ms |
| `runner-fixtures` durations from the worktree and main indexes | 01:22 | 0 | as under Known issues |
| `npm run plan -- followups --touching` (three pages) | 01:16–01:17 | 0 | 22 rows matched; none disposed |
| `node scripts/harness-context.mjs --check` | 01:27 | 0 | six roles unchanged, five within ceilings, refuter unset, both roots |
| repeated `authority.json` bytes over `docs/evidence` | 01:27 | 0 | 211 copies, 40 distinct, 8,374,430 of 195,267,385 bytes (4.29%) |
| D020 completed; `npm run meta`; `npm run format`; `git diff --check` | 01:23 | 0 | D020 indexed; one standing reopen candidate (WO-150-D003); clean |
| `npm run test:docs` | 01:23:40–01:25:43 | 0 | 32 passed, 0 failed, 122.59 s, 32 fresh tasks, recorded 01:25:43.019Z |
| `npm test -- --review` (background) | 01:25:49–01:25:59 | 0 | composed at `a5923da7…`: 38 passed, 0 failed; 37 tasks reused from the executor's fresh row and 1 fresh (format); 7.82 s; recorded 01:25:59.569Z |
| `node scripts/harness.mjs usage <session>` (handoff) | 01:29:06 | 0 | 5,560,487 tokens, dispatch scope |

After the gate figures were filled into this report, the PR body and the release notes, `npm run meta`, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D020's completion and D021;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, history and publication-lock projections.

No behavioral source was edited. The intake backup and the probe scripts live in the session scratch; the focused suite's own cleanup removed its temporary repositories, and no scratch repository remains in the worktree.

Goal alignment outcome: matched. The integrated bytes are the judged bytes, each criterion was re-run or re-read here, B1 stayed boarded, the fired cost condition was measured and routed to planning rather than repaired in review, the review row was composed rather than repeated, and the reviewed state is ready to commit.
