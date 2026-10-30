# FINAL-001 — WO-235 final review

**Verdict:** pass. WO-235 delivers what its amended objective names: writing guidance that opens with each publication surface's contract and reader and ranks nothing by size, a `plan start` skeleton with the nine section headings product 07 lists, document evidence that binds the exact candidate tree, and the `quality pass: <target>` session command delivered through every generated role and, in Claude Code, from the prompt's own first content line. Everything this order had built for operator messages is withdrawn at the operator's direction ([D063](../../evidence/WO-235/decisions.md#wo-235-d063)), and `main`'s prompt router, journal, completions, planning receipt and Stop stand unchanged. All eleven current acceptance criteria are met on the evidence below. One follow-up is boarded (F1): a stale evidence-source declaration left by the withdrawn design. Nothing to integrate: `main`, `origin/main` and `HEAD` read one commit.

**Subject:** the `wo-235` working tree, uncommitted over `main` at `3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f`: 83 tracked files changed (3,842 insertions, 747 deletions) plus the untracked additions `packages/skeleton/src/document-quality.ts`, `scripts/lib/planning-document.mjs`, seven chained role oracles under `packages/skeleton/fixtures/`, the order's evidence, the five verification reports, the order's control log and two sibling receipts. Code identity `3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362`, read by `gateCodeIdentity` at this review and equal to the identity of the executor's complete review row and of VER-005. Dispatch checkpoint `refs/dotln/checkpoint/WO-235/27`.

**Actor:** the Claude Code reviewer, harness 2.1.314, model claude-fable-5-1, effort xhigh as the host's `CLAUDE_EFFORT` reports it (selected effort, not effective effort). The order recommends xhigh for the reviewer. No worker was spawned: 0 of the 20-agent cap, by the plan stated under Goal alignment.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.314","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

**Process cost:** entry 100,643 tokens; handoff 6,240,505 tokens; source claude-transcript-message-usage

Usage scope is the dispatch. The entry reading was taken at 2026-10-30T05:28:02Z and the handoff reading at 2026-10-30T05:51:31Z, before the document gate; both are cumulative request usage, mostly cached input, and dollar cost and reasoning tokens are unavailable from this counter. Dispatch standing at entry: 0 h 0 min of 8 h 0 min, 0 of 3 complete runs. Final counters stay in the ignored receipts and the handoff response.

## Dispatch and reading

Dispatch: `resume: final review`, recorded by the session hook (`FinalReviewRequested`, 2026-10-30T05:27:52.307Z); allocated report `docs/final-reviews/WO-235/FINAL-001.md`. Read in order: canonical status; the whole [amended order](../../work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md); [VER-001](../../verifications/WO-235/VER-001.md), [VER-002](../../verifications/WO-235/VER-002.md), [VER-003](../../verifications/WO-235/VER-003.md), [VER-004](../../verifications/WO-235/VER-004.md) and [VER-005](../../verifications/WO-235/VER-005.md); the executor's [handoff](../../evidence/WO-235/handoff.md) and [self-review](../../evidence/WO-235/self-review.md); decisions [D035](../../evidence/WO-235/decisions.md#wo-235-d035) to [D064](../../evidence/WO-235/decisions.md#wo-235-d064); the planning receipts [056](../../planning/refutations/2026-10-26-planning-ac3a85c89c586be3-056.md) and [058](../../planning/refutations/2026-10-29-planning-aa634f39243f266b-058.md) for this order's known issues; product 05 §Candidate — all eight system traps, product 07 §Goal-aligned decisions, §Independent workflows and integration, §Verification review and attack, §Discipline and §Model-specific notes, product 08 §PRs and commits; the final-review README; and the whole subject diff, source and tests, generated roles, hooks, manifest, fixtures, product and control documents.

## Goal alignment

The traps that would have changed what this review did, and what was done about each:

1. Running `npm run worktree -- integrate WO-235` because the procedure lists it (rule beating): `git rev-parse main origin/main HEAD`, `git ls-remote origin refs/heads/main` and `git merge-base HEAD main` all read `3db7571f`. In phase `final-review` the helper skips its not-behind-main no-op only for an active order, so here it would fetch, checkpoint, push the 83 changed and every untracked path onto the shared stash stack, merge nothing, regenerate ten projections and write a draft decision. The operator objected to that invocation when read-only ancestry shows nothing to integrate ([WO-236-D014](../../evidence/WO-236/decisions.md#wo-236-d014--explicit-integration-authority-and-gate-isolation)); the read-only evidence is the integration result, and [D065](../../evidence/WO-235/decisions.md#wo-235-d065) records it.
2. Rerunning the complete review for comfort (seeking the wrong goal) or crediting a row at another identity (rule beating): the identity was probed at entry with the row's own reader and equals the row's, so the row is reused as the rule says; nothing in this review changes source.
3. Spawning three workers for a subject five verifications already attacked (tragedy of the commons on the subagent cap): final review is acceptance, so this reviewer read the subject whole and reran the durable VER-005 probe, the oracle, the base-parity and removal checks itself.
4. Fixing F1 here and certifying the fix (a reviewer never implements an acceptance-relevant change; a source edit also moves the code identity and owes a fresh complete run for a declaration that changes no behavior): boarded with its reproduction in D065.
5. Treating the recorded off-ramps as open questions (shifting the burden): the two bound acceptances carry one capture hash and the three override records are complete; they are judged from the record and not put back to the operator.

The NoOp, passing on VER-005 and the standing rows without reading the subject, was rejected because the reviewer owns the acceptance judgment and the release surfaces. The outcome matched the intent: a pass on reproduced evidence, one boarded follow-up, release surfaces written from their contracts.

Subagent plan, stated before any spawn with 0 admissions at entry: none, against a `subagentCap` of 20.

## Integration

Both bases are `3db7571f1f0c19a935d4cbdff4c05cc3bfdee61f`: the activation base the order's control log and every verification name, `main`, `origin/main` at this review (`git ls-remote origin refs/heads/main`) and `git merge-base HEAD main`. No integration helper ran (Goal alignment, item 1). No merge commit, stash or regenerated projection exists from this review, so every verified claim is carried forward on its original evidence and the integrated code identity is the handoff identity, `3ca0cfc1…`. There is no version collision: `npm run release -- prepare --local` reports that the order's target `v0.103.0` remains current above the newest local release tag, and it changed only the order's meter snapshot and the PR body's meter block. The affected checks the helper would have printed were run on this tree: the complete `npm test -- --review` row at this identity (consumed, below), `npm run publication:check` (pass: 255 of 255 product headings indexed, both editions current), `node scripts/harness.mjs check` (pass: 35 generated surfaces) and `npm run release -- check-surfaces --local` (pass; one advisory names the untracked component source `document-quality.ts`, which the reviewed commits track).

## The verification sequence and its actors

| Report | Verdict | Findings | Report header | Control actor |
| --- | --- | --- | --- | --- |
| VER-001 (2026-10-29T15:37:53Z) | fail | F1–F4: the direction ledger proved a row, not an answer | `{"harness":"claude-code","harnessVersion":"2.1.312","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}` | same |
| VER-002 (18:59:48Z) | fail | F5 document-row regression; F6 lockout; F7 missing entries; F8 Stop re-entry | same as VER-001 | same; recorded under override ordinal 13 |
| VER-003 (2026-10-30T00:23:48Z) | fail | F1 a real host notification received the reminder; F2–F4 follow-ups | same as VER-001 | same |
| VER-004 (03:28:23Z) | fail | F1 a delivered operator prompt accounted for a later host queue entry | `{"harness":"codex-cli","harnessVersion":"0.166.0","model":"gpt-6.1-sol","effort":"max","source":"codex-session-readback"}` | same |
| VER-005 (05:23:38Z) | pass | none new; eight independent probe groups | same as VER-004 | same |

Every executor-role completion actor, from the order's control log:

| Event | Recorded at | Actor |
| --- | --- | --- |
| ImplementationReady | 2026-10-29T14:54:06Z | codex-cli 0.165.0, gpt-6-astra, max, codex-session-readback |
| ImplementationReady (superseding, override ordinal 5) | 2026-10-29T15:08:42Z | codex-cli 0.165.0, gpt-6-astra, max, codex-session-readback |
| RepairCompleted after VER-001 | 2026-10-29T18:01:53Z | codex-cli 0.165.0, gpt-6-astra, max, codex-session-readback |
| RepairCompleted after VER-002 | 2026-10-29T22:58:37Z | codex-cli 0.165.0, gpt-6-astra, max, codex-session-readback |
| RepairCompleted after VER-003 | 2026-10-30T03:00:38Z | claude-code 2.1.312, claude-opus-5-5, max, claude-session-readback |
| RepairCompleted after VER-004 | 2026-10-30T05:11:02Z | claude-code 2.1.314, claude-opus-5-5, max, claude-session-readback |

The order declares executor xhigh, verifier xhigh and reviewer xhigh. Every completed executor and verifier value is max, at or above its minimum, and the verifiers' report headers match their control actors. This review's intended completion actor is the header above, xhigh, equal to its minimum. The status projection reports the within-order drift honestly: its `effortDrift` holds the completions' single effort, max, so `docs/control/current.md` renders "none"; after this completion the pair max → xhigh will be the recorded drift. No criterion is waived, none is unmet, no withdrawal or correction is recorded; the two bound acceptances (ordinals 2 and 3, the executor's active phase, 10 h 0 min and 11 h 0 min) carry one capture hash and are judged from [D015](../../evidence/WO-235/decisions.md#wo-235-d015) and [D019](../../evidence/WO-235/decisions.md#wo-235-d019); the override records at ordinals 5, 13 and 14 are complete in the log.

## Criteria

**Criterion 1:** met. `git diff 3db7571f -- packages/skeleton/src/harness-host.ts` adds ten lines and removes none: the `qualityPassGuidance` import, the `quality pass:` entry of `operatorPrefixes` (class `direction`) and the first-content-line delivery with its comment; `scripts/lib/plan-failures.mjs` is byte-identical to base. The VER-005 probe's "base parity and removal" and "generated prompt hook uses only the current first content line" groups passed again under the bounded wrapper at 2026-10-30T05:35:16Z.

**Criterion 2:** met. A search of `packages/skeleton/src`, both hook and role trees, `CLAUDE.md`, the manifest and every non-test script for the private checklist, `host-agent-message`, `host-queued`, `readPromptRoute`, `operatorObservations`, the direction ledger and its file found nothing. Both generated trees are identical (`diff -rq`), and no checklist file, ledger or answer block exists; `docs/evidence/WO-235/answers/verify-002.md` is the content-free notice VER-002 links.

**Criterion 3:** met. `git diff 3db7571f -- scripts/resume.mjs` is one hunk, the evidence-briefing sentence. `handoff-ledger.mjs` changes comments only, and no completion reads answer state.

**Criterion 4:** met. `scripts/lib/planning-document.mjs` holds the nine headings; `refute-plan.mjs` writes the document with an exclusive open before `git switch -c` and removes only its own file when the switch fails while `main` is selected; a pre-existing document is refused by name. `plan-receipts.mjs` is byte-identical to base. The VER-005 probe's planning group passed again, and `plan-refutation` passed in the complete row.

**Criterion 5:** met. No size-ranking module, meter column or shorten advisory exists in the subject; `github-body.mjs` is byte-identical to base; `test-launchpad-planning.mjs` asserts that planning start and receipt print neither "best comparable" nor "shorten" on either stream. Byte measurements remain resource observations in the meter.

**Criterion 6:** met. `npm run reader -- profile` for `prTitle`, `prBody`, `commitSubject` and `releaseNotes` opens with `Contract:` naming the product sections and the judging functions, then `Document kind: record. Reader: …`, then the usefulness sentence, and names no example; `test-reader.mjs` resolves every named section and function, varies example lengths without changing the guidance and follows a relocated product root; the VER-005 probe's writing-guidance group passed again.

**Criterion 7:** met. All twelve installed role hashes equal `wo235-removal-role-baseline.json` at the default setting, and the installed root bytes equal the oracle's: executor 34,975; verifier 31,496; reviewer 33,944; release-close 22,657; planner 23,566; refuter 22,380 (each 1,123 below the quality-pass oracle, as D063 records). The seven oracles chain to `wo234-integration-role-baseline.json` and `test-gate-followups.mjs` walks the chain; `process-debt` passed in the complete row. Both trees carry the artifact-shape, usefulness, standing-document and expected-data rules with no sentence-count target.

**Criterion 8:** met. The subject adds no message record, answer command, transcript audit, approval, wait, persistent answer state or duplicate chat log; `gate-evidence.mjs` is byte-identical to base, so nothing new enters product or document identity; the standing documents describe only the retained mechanism.

**Criterion 9:** met. The `harness-host.ts` diff touches no Stop or finish line; `.claude/hooks/finish.mjs` differs from base only by the runtime snapshot path, skeleton version 0.39.0 and the file pins; the dotted-version exemption in `observed-facts.ts` ([D060](../../evidence/WO-235/decisions.md#wo-235-d060)) is the only change to what Stop journals, and `test-observed-facts.mjs` pins both arms. The security document states the quality-pass boundary after the six unchanged refusals.

**Criterion 10:** met. Products 05 and 07, the security document, the architecture page and the kit README describe the built mechanism; the planning map, examples guide and product 08 are consistent with it. The complete `npm test -- --review` row at this code identity passed at 2026-10-30T05:00:11.640Z after 0 h 31 min with all 45 selected checks, and completion consumes it; `npm run test:docs` runs once after this report's last edit and its row for the exact candidate tree is consumed at completion, with no earlier row credited for these records; `npm run publication:check`, `npm run format:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local` passed in this review; `git diff --check` is clean; the lockfile changes only the internal skeleton version and console's pin.

**Criterion 11:** met. The guidance is one shared constant in `document-quality.ts`, installed in all twelve roles (`executor-supports.test.ts` asserts the five target forms, the scope statement, the no-change outcome, immutable records and task continuation) and added to Claude's `additionalContext` only when `harnessPromptLine(input.prompt)` starts with the command; `test-harness.mjs` covers the five forms, blank-line and fenced leads, prose, quoted and envelope mentions, notices carrying the command behind their envelope after a delivered command (idle and mid-turn), queued words that open with the command, `analysis:` precedence under its own session, no prompt text in the journal and an unchanged control log; the VER-005 probe reproduced the history cases. Semantic document quality is a review judgment and is not scored.

## Findings

**F1 — a stale evidence-source declaration from the withdrawn design.** Route follow-up, class escape: it was present in the verified subject and inside the consistency reviewer's scope (evidence-source declarations), the kind VER-003 F4 named. `scripts/lib/evidence-sources.mjs` registers `scripts/lib/off-ramps.mjs` as the first common source of every evidence edition. The registration entered with the direction ledger: at `refs/dotln/checkpoint/WO-235/4` the same list registered `scripts/lib/direction-ledger.mjs`, which imported `sessionJournalKey` from `off-ramps.mjs`, and the unregistered-import rule then required both. D063 removed the ledger and left this line, which base does not have. No registered source imports `off-ramps.mjs` now; its importers are `resume.mjs`, `handoff-ledger.mjs`, `planning-followups.mjs` and `target-publish.mjs`, none registered. Effect: every edition inventory and the machinery coverage count `off-ramps.mjs` as an evidence source, so an edit to it re-mints the editions and selects the evidence suites without need. It breaks no criterion and no behavior `main` had, and no record names its cause. Reproduction, from the repository root: `git show refs/dotln/checkpoint/WO-235/4:scripts/lib/evidence-sources.mjs | grep -n 'off-ramps\|direction-ledger'` prints lines 9 and 10, `git show 3db7571f:scripts/lib/evidence-sources.mjs | grep -c off-ramps` prints 0, and `grep -rln off-ramps.mjs scripts packages --include='*.mjs' --include='*.ts'` names no registered source. Not fixed here (Goal alignment, item 4); D065 boards it for the next repair of this order or a planning pass, with the remedy of removing the line and re-minting the editions under a dated decision.

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "scripts/lib/evidence-sources.mjs still registers scripts/lib/off-ramps.mjs, a declaration the withdrawn direction ledger needed and no registered source now imports; boarded in WO-235-D065"}
]
<!-- dotln-findings:end -->

## Known issues, carry-ins and the planning receipts

Receipt 058 amended this order with five known issues for it, and receipt 056 filed it with one; each is judged at the final subject:

- **Criterion 7, drift to low performance (both receipts):** the reopening condition names a root above its ceiling, or a close above 32,292 bytes with no role-text removal recorded in the same order. Role-text removals are recorded in this order (D037: 304 to 417 bytes per root; D063: 1,123 per root). The executor (34,975), verifier (31,496) and release-close (22,657) roots stand above their earlier ceilings under dated acceptances in `docs/control/budgets.json` ([D005](../../evidence/WO-235/decisions.md#wo-235-d005): verifier 35,221 and release-close 26,410; [D044](../../evidence/WO-235/decisions.md#wo-235-d044): executor 40,194), and `process-debt` checks the current bytes against those ceilings in the complete row; the reviewer and planner raises of D044 are retired because D063 brought those roots back under their earlier ceilings. `npm run meta` reports the drift-to-low-performance reopen candidate on cold-start bytes (34,975, up 2,683 over WO-234, worsened over three consecutive order deltas); byte headroom is an operating-cost goal and the weighing is planning's; no useful rule was cut to fit, as the operator's usefulness direction requires.
- **Criterion 9, the Stop refusal's loop, its live-gate conflict and the stale count of five:** the Stop refusal was withdrawn (D035, D063), so neither condition can occur; the security document names six refusals.
- **Criterion 3, rule beating by a ledger entry:** moot, the ledger no longer exists.
- **Criterion 5, the shorten advisory against WO-238:** the advisory was removed ([D039](../../evidence/WO-235/decisions.md#wo-235-d039)); no conflict remains.

The order's own carry-ins hold: VER-002 F5 is restored and `test-runner.test.mjs` pins that a changed report, decision, generated index or newly introduced record invalidates the document row; VER-002 F6 to F8, VER-003 F1 and VER-004 F1 are withdrawn with their subject, and VER-004's expectation about un-enveloped queued words is withdrawn rather than met, as the order and D063 state; `main`'s router returns with its Claude Code 2.1.312 attribution gap, carried to planning by FUP-0f2a756698374d7e and FUP-8331693069c2747d together with the other operator-message follow-ups; the sequence title stays with planning under [D057](../../evidence/WO-235/decisions.md#wo-235-d057) and FUP-7d3d2e7566c8923e; WO-088 adjusts the skeleton's source lookup later; WO-236's and WO-238's carry-ins stand as written.

## Evidence consumed, reproductions and instruments

- **Complete row:** `host-gate:3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362:npm test`, exit 0, recorded 2026-10-30T05:00:11.640Z after 0 h 31 min, 45 required suites, worktree index, the only row at this identity; consumed, not rerun.
- **Document rows:** the executor's 05:10:42Z and VER-005's 05:23:13Z rows judged trees this dispatch has since changed, so neither is credited; the run after this report's last edit supplies the row completion consumes.
- **Reproductions in this review:** the durable VER-005 probe under `node scripts/harness.mjs bounded --`, eight of eight groups passed, exit 0, under a minute; the installed role hashes and root bytes against the newest oracle; base parity by `git diff 3db7571f` for the five base-identical modules and the counted `harness-host.ts` and `resume.mjs` hunks; the removed-term search; the identity probe; `diff -rq` of the two role trees; `npm run format:check`, `git diff --check`, `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local`; a search for nested repositories (none); `npm run reader -- profile` for the four surfaces written here.
- **Instruments under review that also record this work:** `resume.mjs` allocated this report and consumes its result; the document-row consumer judges this report's own candidate tree; `release prepare` wrote the PR body's meter block. The independent probes, base comparisons and field checks above support those instruments.

## Release surfaces and readiness

- **Version:** `v0.103.0`, minor, assigned at activation and current at this review; skeleton `0.73.0`, harness host `0.39.0`, console's pin updated, compiler unchanged at `0.33.0`.
- **Proposed PR title:** `:sparkles: Every written artifact starts from its contract and reader instead of a predecessor, document evidence binds the exact candidate tree, and a quality pass: command improves named documents in the current session`.
- **PR body:** [PR.md](PR.md), a level-one heading, prose for a reviewer deciding whether to accept the change, links relative to this directory, the meter block last. **Release notes:** [RELEASE-NOTES.md](RELEASE-NOTES.md), the five required sections. Both are written one physical line per paragraph.
- **Proposed commit series, created after the recorded pass:** the hedged-quantity scanner exemption with its test (an independent correction, D060); the three fixture stabilizations (D017, D019 and the target-worktree close fixture); the implementation with its tests, generated roles, hooks, manifest, oracles, versions, product and control documents and the amended order; then the order's records (decisions, evidence, the five verifications, this review and the control log). Each commit subject is plain and carries no attribution.
- **Readiness:** after `final-review-result pass` and the commits, `npm run worktree -- publish WO-235 --title <the title above> --body-file docs/final-reviews/WO-235/PR.md` pushes `wo-235` and opens the pull request for the operator's review. The operator merges; release close follows as a separate dispatch.

## Limits

- Semantic document quality, the actual editing judgment a `quality pass:` produces, and answer adequacy are not measured; the order claims none of them.
- No live Claude task notification was raised in this session; the envelope and history cases rest on the generated-hook fixtures and the VER-005 probe's synthetic replays through the current runtime.
- `main`'s router keeps its known attribution gap on Claude Code 2.1.312 for a queue entry without a command mode; it is planning's, not this order's.
- No provider spending cap applied; no worker ran; no integration helper ran.
