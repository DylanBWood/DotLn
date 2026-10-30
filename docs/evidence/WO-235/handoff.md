# WO-235 repair handoff

This is the executor's judgment of the [amended order](../../work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md) after the repair of [VER-004](../../verifications/WO-235/VER-004.md). During that repair the operator directed that everything this order adds for operator messages be removed, limited to this order's own additions. [D063](decisions.md#wo-235-d063) records the authorization, the amendment and the follow-ups. The order now delivers:

- contract-first, useful document guidance and the planning skeleton;
- exact-tree document coverage;
- `quality pass: <target>` for bounded document work.

Independent verification remains a separate dispatch.

## What this repair changed

**Removed, with `main` restored where this order had replaced it:**

- the prompt hook's private reply-checklist reminder;
- the shared role sentence on direct questions, the private checklist, host notifications, earlier aims, the correction freeze and register;
- the prompt router that had replaced `main`'s `promptRoute`, with its journal-path helper, the `host-agent-message` and `host-queued` sources and the plan-failures host-source rule;
- the fixtures built for answer state, including the completion parity fixture and its base pin;
- the product, security, architecture, kit and work-order-map text that described them.

**Kept:** contract-first writing guidance, the planning skeleton, exact-tree document rows, the hedge-scanner fix and the `quality pass:` command.

**VER-004 F1:** its class is prompt observations reused after their delivery. The removal closes it: no prompt guidance reads history any more. Quality pass guidance follows the prompt's own first content line, the line every dispatch prefix is read from, and yields to an active operator control. A task notification or another agent's report opens with its envelope there, so it never receives the guidance, whatever came before it. The new history fixture covers a case VER-004 did not quote: after an operator's command delivered without a queue entry, idle and mid-turn notices and an agent report carrying the command behind their envelopes receive nothing. F1's other quality pass expectation, that un-enveloped words queued with the command's bytes receive none, is withdrawn rather than met: the hook infers no sender, and under `main`'s router such a queue entry has unknown authorship. The fixture pins that behavior too.

**Returned to planning:** `main`'s router brings back its known gap, WO-219-D042's reopening (FUP-0f2a756698374d7e). VER-004's own probe shows it: the later queue entry journals `unattributed`, not `host-task-notification`. D063's follow-up, FUP-8331693069c2747d, lists the seven follow-ups that rest on the removed work for planning to dispose together. FUP-d1b15b1b3e4dc761, which had allocated WO-236-D020's prompt-answer action to WO-235, is deferred.

## Acceptance judgments

**Criterion 1:** met. `git diff 3db7571f -- packages/skeleton/src/harness-host.ts` adds ten lines: the `qualityPassGuidance` import, the `quality pass:` journal class and the first-content-line delivery with its comment. `git diff 3db7571f -- scripts/lib/plan-failures.mjs` is empty. A search of `packages/skeleton/src`, `packages/skeleton/dist`, `.claude/hooks`, `.claude/harness-manifest.json`, `CLAUDE.md` and both role trees finds no `Private reply checklist`, `host-agent-message`, `host-queued`, `readPromptRoute` or `operatorObservations`. `harness-fixtures` passed in the complete row.

**Criterion 2:** met. Neither role tree contains any part of the removed sentence: the private checklist, whole-batch reconciliation, host-notification, earlier-aims, correction-freeze and register text. Both trees match `wo235-removal-role-baseline.json` at both economy settings, and `executor-supports.test.ts` no longer requires the sentence. No checklist file, per-message ledger or answer block exists. `docs/evidence/WO-235/answers/verify-002.md` is the content-free notice VER-002 links. `skeleton` and `process-debt` passed in the complete row.

**Criterion 3:** met. `git diff 3db7571f -- scripts/resume.mjs` changes only the evidence-briefing sentence. The criteria adversary traced the completion routes' imports and found only comment changes in `scripts/lib/handoff-ledger.mjs`.

**Criterion 4:** met. `plan start` writes the nine headings product 07 lists, kept in `scripts/lib/planning-document.mjs`. `scripts/test-plan-refutation.mjs` asserts them and the removal of the prepared document after a failed branch switch. `git diff 3db7571f -- scripts/lib/plan-receipts.mjs` is empty. `plan-refutation` passed in the complete row.

**Criterion 5:** met. No size-ranking module or meter column exists. `scripts/test-launchpad-planning.mjs` asserts that planning start and receipt print no shorten advisory, and `launchpad-planning` passed in the complete row. The completion commands are base's (criterion 3); base `resume.mjs` and `handoff-ledger.mjs` contain no such text.

**Criterion 6:** met. This repair left `writingGuidance` unchanged. It opens each surface with its contract, then the kind and reader, and selects no example. `scripts/test-reader.mjs` resolves each named section and function, varies example lengths and follows a relocated product root. The `npm run test:docs` row supplies `reader-fixtures`.

**Criterion 7:** met. Both trees keep the artifact, usefulness and standing-document rules, with no sentence-count target. `wo235-removal-role-baseline.json` chains to `wo235-quality-pass-role-baseline.json`, sha256 `699f1dcfee672649e2424bb4995a325b7dc302039114be36b2ba24c43e3da7be`. D063 records each root's before and after bytes, each 1,123 smaller, and the expected-data cause. `scripts/test-gate-followups.mjs` checks the seven-link chain, and `scripts/test-process-debt.mjs` checks each link's hash. `process-debt` passed in the complete row.

**Criterion 8:** met. This order adds no message record, answer command, transcript audit, approval, wait, persistent answer state or duplicate chat log. The fixtures and standing text that described them are removed; the criterion 1 and 2 searches and the product 05, product 07, security, architecture, kit README and work-order-map edits establish this. Product and document identity keep base's rules.

**Criterion 9:** met. The `harness-host.ts` diff touches no Stop code. `.claude/hooks/finish.mjs` differs from base only by its runtime snapshot path, skeleton version and file pins. The dotted-version hedge exemption in `observed-facts.ts` (D060) is the only change to what Stop journals. `docs/AI-HARNESS-SECURITY.md` states the quality pass boundary after the six refusals.

**Criterion 10:** met.

- **Documents:** products 05 and 07, security, architecture, the kit README and the work-order map describe the built mechanism.
- **Document evidence:** it covers the exact candidate tree through `runner-fixtures`' document-row cases, including record edits after a prior pass.
- **Gates and checks:**
  - `npm test -- --review` passed at 2026-10-30T05:00:11.640Z after 0 h 31 min: 45 required checks, none failed or unrun, 111 fresh tasks, code identity `3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362`.
  - `npm run test:docs` runs after the last document edit for the exact candidate tree, and completion consumes that row.
  - `npm run publication:check` passed.
  - `git diff --check` is clean.
  - No dependency was added; the lockfile changes only internal versions.

**Criterion 11:** met. Every generated role carries the `quality pass: <target>` guidance with its five target forms. In Claude, the hook also adds it when the prompt's own first content line opens with the command. It reads no history and yields to an active operator control. `scripts/test-harness.mjs` covers:

- the five target forms, blank-line and fenced openings, and a missing target;
- prose, quoted and envelope mentions;
- notices after an operator's delivered command, idle and mid-turn;
- words queued with the command's bytes;
- `analysis:` precedence, under its own session;
- an unchanged control log.

`harness-fixtures` passed in the complete row. Semantic document quality remains a review judgment.

## Executable evidence and release

- **Probes:** the bounded runs of both quality pass tests, the oracle chain test, the plan check and VER-004's route probe are recorded in D063.
- **The complete run:** it ran from 04:29Z to 05:00Z with evidence row `host-gate:3ca0cfc162d216be36ba9544001b08e3c6d59d6bb2f7c01397e31f709cd2b362:npm test`. `main` and this worktree had equal heads, so no integration was needed.
- **The prepared release:** release preparation was rerun after the removal. It reports v0.103.0 still current and refreshed only `docs/evidence/WO-235/meta.json`.
- **Repository state:** the adjacent queue is complete, with nothing running or next. No scratch repository was created in the worktree.

## Independent review, actor and limits

The three worker reports are summarized in [self-review.md](self-review.md). In all, they found 41 issues:

- 30 were fixed;
- 11 are recorded with reasons;
- of the recorded ones, only the planning-owned sequence title is a defect left in place, named in D063 for the next planning pass.

self-review: found 41; fixed 30; recorded 11

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.314","model":"claude-opus-5-5","effort":"max","source":"claude-session-readback"}

**Process cost:** `node scripts/harness.mjs usage` read 64,552,318 total tokens, source `claude-transcript-message-usage`, scope `dispatch`, observed 2026-10-30T05:01:08Z. Dollar cost and reasoning tokens are unavailable from this counter. The order recommends xhigh; the operator selected max for this session, recorded as given. Dispatch standing was 1 h 29 min of 8 h 0 min, with 1 of 20 complete runs and 3 subagents of the 20 cap.

**Limits:**

- `main`'s router returns with its 2.1.312 attribution gap; FUP-0f2a756698374d7e and FUP-8331693069c2747d carry it to planning.
- Words queued with a quality pass command's bytes receive the guidance whoever queued them; on the supported host, host messages arrive in envelopes.
- Structural evidence proves delivery and noninterference. It does not prove semantic document quality.
