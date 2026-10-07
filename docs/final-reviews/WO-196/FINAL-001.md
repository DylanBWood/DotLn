# WO-196 FINAL-001 — final review

**Verdict:** pass. WO-196 asked that a role following its numbered steps cannot lose a product gate to formatting, a record write or a badly timed worker, and does not pay a fresh review gate for bytes a passing row already covers. It also asked that the adversary and the improver run once, at the end of implementation. This review judged the nine criteria against the subject integrated with `main` at `ae782ef9`, which had not moved since activation. All nine are met and nothing blocking was found. The findings block is empty. This review made one source edit: it removed the `runGit` import that VER-002 left unused in `scripts/docs-check.mjs` (N1, [D016](../../evidence/WO-196/decisions.md#wo-196-d016--remove-the-unused-rungit-import-during-final-review)). Because that edit changed the code identity, a fresh `npm test -- --review` ran at the reviewed identity and passed 38 of 38 suites with 88 fresh tasks in 1,797.84 s at code identity `e6013da3…`, recorded 2026-10-07T16:33:48.047Z.

**Subject:** [`docs/work-orders/WO-196-the-handoff-is-one-command.md`](../../work-orders/WO-196-the-handoff-is-one-command.md) on branch `wo-196`, uncommitted. `HEAD`, the order's base and the fetched `main` are all `ae782ef9d76f538434d1eff42090b164456dacff`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-196/9` (`285d4eb7`) and the integration checkpoint is `/10`.

- The reports: the recorded `reportHash` of VER-001 and VER-002 each equals the report's current SHA-256 (`b20a4c85…` and `80a53860…`).
- The order: it differs from `main` only in its heading's version label, `(v0.69.0)` in place of `(version assigned at activation)`, which `release prepare` wrote (D002).
- Ideation: no ideation breakout receipt applies, and the evidence folder holds none.
- Carried bytes: a full-tree comparison through a temporary index against checkpoints 9 and 10 differs only in documents. Every source byte VER-002 judged at code identity `8017b3c5…` is carried unchanged into the integration. D016's one-line edit is the only source change after it, and the reviewed identity is `e6013da389e2f9cec924e5f4b620aedb9cfb9a1ca2bcef604973695ae455ab2a`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.292","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. During the review they said the decision on the unused import had to be immediate. This review removed it at once (D016). They made no choice about the verdict. The harness version comes from `claude --version`. The model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` as this session read it, which is the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before any spawn: none, against a `subagentCap` of 20 with 0 observed at entry. The reviewer procedure spawns a worker only to reproduce a named claim, and every claim this verdict rests on was reproducible in this session. The counter at handoff reads 0 subagents, exact-observed, with 20 remaining and an unknown uncounted remainder.

**Process cost:** entry 89175 tokens; handoff 11816733 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage d4e51828-3a37-49d8-a5ad-a08ec1479b7d`.

- Entry was observed at 2026-10-07T15:54:35.829Z.
- Handoff was observed at 2026-10-07T16:34:14.105Z, after the product gate and before this report's final document gate and the result transition. It counts 11,557,523 cached input, 209,287 cache-write, 152 uncached input and 49,771 output tokens over 86 steps and 76 commands.
- Both readings count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero.
- The largest wait was the fresh review gate (1,797.84 s). It was fresh because D016 changed the code identity. VER-002's composed review at the previous identity took 7.07 s against the executor's fresh 1,815.45 s at that identity.

## Goal-aligned judgment

- **Rule beating:** VER-002's pass was not taken as the verdict. This review read the whole source diff again and re-ran the integration's affected checks. Its own gates judge the subject after D016.
- **Shifting the burden:** the one open defect in a declared surface was repaired here rather than left on the register for a later order, as D014's reopening condition asked. Its cost was one fresh review gate, 1,797.84 s, which this review accepted.
- **NoOp:** without merging, every later order keeps losing review gates to formatting and pays fresh review gates at unchanged identities.

The outcome matched: the order's objective holds at the reviewed identity, and the one carried defect is closed.

## Criteria

- **Criterion 1:** met. `runGateChecks` prepends the `format` row to every selection that is not `--only`, `--document` or `--machinery` (`scripts/test-runner.mjs:1967-1971`). `scheduleSuites` runs it alone, before the build and before any carried result. If it fails, every other row is finished as unexecuted with Prettier's output and `Run npm run format, then rerun this command.` (`:1619-1642`). VER-001 and VER-002 reproduced this with the repository's real `format:check` script, `.prettierignore` and Prettier, as a child process, for plain, `--review`, `--again` and `--review --again`. Each exited 1 in under a second with no product task executed. `--only` and `--machinery` ran no format. This review's own review gate ran `format` first (`PASS format 7.13 s`, its first task).
- **Criterion 2:** met. The review selection no longer bypasses `coveringTaskResults`. `executionMode` is `forced-fresh` only with `--again`, and the all-tasks-reused shortcut R1 named is gone, so every composition runs through the one scheduler and row builder. VER-002's composed review at identity `8017b3c5…` recorded `executionMode: "composed"`, `freshReason: "always-fresh-preflight"`, format as the only fresh task, 87 reused tasks each naming the executor's fresh row, and `requiredSuites` equal to that row's 38. `scripts/test-resume.sh`, the release scripts and `scripts/lib/release-records.mjs` have no diff from `main`, and `release:case:composed_evidence` passed in this review's gate. `findGateCheck` and `reviewedProductGate` key on the check id, the code identity and `requiredSuites`, not on `executionMode` (VER-001), which confirms operator-review assumption 3.
- **Criterion 3:** met. On the integrated tree the executor, verifier and reviewer skills open with numbered steps and then `Rules:`. The handoff steps read format (`format:check` for the read-only verifier), `npm run test:docs`, the product gate with "while it runs, write nothing under the repository and start no agent", the records, and the completion command. This review followed the reviewer's eight steps in that order. `grep -c "five refusals"` prints 0 for all twelve skills and 1 for `CLAUDE.md`, which has no diff. The `.claude` and `.agents` roots are byte-identical. [`rule-sentences.diff`](../../evidence/WO-196/rule-sentences.diff) and VER-001's line-by-line comparison with `main` show every other baseline rule line present once after `Rules:`. `node scripts/harness.mjs check` passes with 33 generated surfaces.
- **Criterion 4:** met. The executor sentence names two fresh `dotln-worker` agents, an adversary of the criteria and an improver of design, simplicity and maintainability, before `implementation-ready` only. The verifier sentence names its own probes, the two reports, a worker only to reproduce one named claim, and the follow-up route. The reviewer carries the route sentence, read in this session at line 56 of its skill. Each agrees with product 07 §Verification review and attack. The order's own sequence followed the new text: the executor ran the two workers at `implementation-ready` ([adversary](../../evidence/WO-196/adversary.md), [improver](../../evidence/WO-196/improver.md)), the repair ran none, and neither verification nor this review spawned one.
- **Criterion 5:** met. The executor skill carries WO-188 item 22's sentences: the Tinkerer fork sentence and the goal-alignment sentence that names only the traps that change what you do. No skill contains `900`. The executor briefing no longer prints the 900-second Tinkerer line (`scripts/lib/executor-readiness.mjs`), and a work order's `**Experiment:**` header is projected into the briefing in its place (`scripts/resume.mjs:426-435`).
- **Criterion 6:** met. CLAUDE.md plus each skill, the same in both roots: executor 29,777 → 28,128 bytes (ceiling 29,246), verifier 26,077 → 25,380 (29,831), reviewer 27,882 → 26,831 (28,884). These are recorded in D005 and [`role-measurements.json`](../../evidence/WO-196/role-measurements.json). `docs/control/budgets.json` has no diff, so no acceptance was added.
- **Criterion 7:** met. `harness-host.ts:4421-4428` appends one advisory naming each live run's id and kind when a spawn is admitted during a gate, through the existing `record` path, and admission is unchanged. The fixture `spawn during a live gate is admitted with one advisory; no live gate gives none` passed in this review's gate. `readHandoffLedger` takes `{ selfReview }`, and its only production callers are `implementation-ready` (default on) and `repair-complete` (`selfReview: false`, `scripts/resume.mjs:1484`). `scripts/test-verification-review.mjs` asserts both, inside the `resume` row of this review's document gate.
- **Criterion 8:** met. An over-ceiling product document is an `ADVISORY … bytes over ceiling; planning resets ceilings` notice, never a failure. Missing and malformed entries still fail, and the raise rule and its helpers are removed. The runner prints a passing task's `ADVISORY` and `NEWER` lines (`scripts/test-runner.mjs:2260-2263`), so `npm run test:docs` shows the advisory. VER-002 reproduced it through the real runner as a child process. `docs-check-fixtures` passed in this review's document gate. D016 removed only the now-unused `runGit` import, and `node scripts/docs-check.mjs` still exits 0 with 0 failures over 15 documents.
- **Criterion 9:** met.
  - The re-mints are selected in `docs/evidence/current.json`: authority, artifact identity and verification at WO-196 revision 004, and feedback 001. Earlier preparations are preserved, and the evidence rows pass.
  - The write-backs hold. PLAYBOOK §The loop, per work order, carries the composed-row statement and the four-step handoff sentence. The decisions record the root bytes and the rule-sentence diff. `npm run publication:check` passes.
  - Gates: `npm test -- --review` passed 38 of 38 suites with 88 fresh tasks in 1,797.84 s at code identity `e6013da3…`, recorded 2026-10-07T16:33:48.047Z. `npm run test:docs` passed 29 of 29 in 123.68 s before the gate. On the final documents it first failed `release-surfaces`, because the release notes' placeholder tokens inside inline code read as raw HTML. After that line was reworded it passed 29 of 29 in 107.98 s, and `final-review-result` runs it again inline.
  - `git diff --check` and `git diff --cached --check` exit 0.
  - No dependency was added. The lockfile and manifests move only the internal compiler 0.25.4 and skeleton 0.55.0 pins.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

This review found no defect beyond what the verifications recorded. VER-002 found the one defect this review repaired, N1 (the unused `runGit` import), and boarded it as FUP-c24585c3b7bebf38. Verification caught it, so it is not an escape, and it is not listed again. D016 records the repair, and the row is settled.

Notes, not findings:

- **One extra blank line in every generated role.** `packages/compiler/src/harness.ts` removed `HARNESS_BOUNDARIES` from the role template and left its two surrounding empty strings, so each skill has two blank lines before the support units. Markdown renders this the same as one, and it costs one byte per root.
- **A failed preflight row reads as composed.** VER-002 noted that a review row whose format preflight fails at an identity with passing tasks records `executionMode: "composed"` and `freshReason: "always-fresh-preflight"` with `reusedSuites: 0`. Only the runner and its tests read `freshReason`, and the row's exit code is 1.

## Integration

- `npm run worktree -- integrate WO-196` found `main` at `ae782ef9`, equal to the base. It stored preservation checkpoint `/10` and named stash `9a83872a` (`WO-196 integrate 2026-10-07`), merged nothing, re-applied the work and regenerated the projections. There were no authored conflicts. No ignored intake file exists in this worktree, so no intake backup was named.
- No component version collides. The release target v0.69.0 stays above v0.68.0, and `npm run release -- check-surfaces --local` passes.
- The printed affected checks all exit 0: `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` and the integrated `npm test -- --review`. So does `npm run plan -- check`.
- D015 completes the draft integration record with the carried-forward claims.

## Register

`npm run plan -- followups --touching --work-order WO-196` returned 34 rows at revision `d5f005e6…`. This review read every page, and read the six rows allocated to WO-196 with `--show`. One `followups --apply` batch of eight requests moved the register to `115bcff9…`.

| Row | Disposition | Why |
| --- | --- | --- |
| FUP-3799fb396f911d8a (WO-112 D049) | settled | Criterion 1: format runs first and the gate refuses to start otherwise. |
| FUP-117dc832458dc6e2 (WO-112 D057) | settled | Answered as the order filed it: the procedure leaves nothing to write during the gate, and criterion 7 advises. The watcher stays declined on FUP-1bd1a1561feb3a57. |
| FUP-ac99e09feec05a3b (WO-112 D063) | settled | Criterion 7, with the procedures ordering the worker before the gate. |
| FUP-f4bf5a4ada0c1420 (WO-187 D051) | settled | Criterion 4: a separate adversary and improver. |
| FUP-8ce4b4b0104ba41b (WO-187 D005) | settled | Criterion 6: the executor root is 28,128 bytes against 29,246. |
| FUP-b8fd526baef52c4f (WO-196 D010) | settled | The repair delivered F1 and R1, and VER-002 reproduced both. |
| FUP-c24585c3b7bebf38 (WO-196 D014) | settled | Removed by this review (D016). |
| FUP-3f9d788f4d8c89ac (WO-187 D034) | returned to open | The planning pass allocated it here for the tolerant self-review forms. WO-187's close had already withdrawn those forms, WO-196's text never names the row, and the self-review reader is unchanged. Three items remain: the receipt fallback, the counts listed as a failure item, and the agent-path pattern. |

Each settled row keeps the reopening condition the planning pass gave it. The other matched rows are left as they are, because the change only matched them textually or their conditions name events after WO-196 merges. That covers FUP-a0a5ff5624f75eb2 (`resume qualify`), FUP-1bd1a1561feb3a57 (the record-write watcher), FUP-ed7136a8228e83f8, FUP-8a4e201d861208ad and FUP-be1103fbfdd14653 (evidence volume, a week after the merge). `npm run meta` still prints `REOPEN WO-150-D003` for `coldStartBytes.executor > 24576`. That threshold predates the 29,246 ceiling criterion 6 judges, and the executor root at 28,128 bytes remains above it.

## Verification sequence

1. **Activation:** 2026-10-07T08:16:09Z, checkpoint 1.
2. **Implementation** (Codex CLI 0.160.1, `gpt-6-astra`, max): `ImplementationReady` at 10:00:01Z. D001 to D009. Two fresh workers (`gpt-6.1-sol`, max, as supplied) ran at `implementation-ready`. The adversary found one defect, which was fixed, and the improver found none.
3. **[VER-001](../../verifications/WO-196/VER-001.md)** (Claude Code 2.1.292, `claude-opus-5-5`, xhigh): fail at 14:38:03Z on criterion 8 (F1: the document gate did not print the ceiling advisory), with R1 to Adjacent Repair (D010).
4. **Repair** (Codex CLI 0.160.1, `gpt-6.1-sol`, max): 14:39:31Z to 15:35:57Z. D011 to D013. No workers, as the new text directs.
5. **[VER-002](../../verifications/WO-196/VER-002.md)** (Claude Code 2.1.292, `claude-opus-5-5`, xhigh): pass at 15:53:46Z, with N1 boarded (D014).
6. **This review** (Claude Code 2.1.292, `claude-opus-5-5`, xhigh): dispatched 15:54:28Z, checkpoint 9. D015 and D016.

The two verifications took 1,636 s and 982 s from dispatch to result. The second consumed the executor's fresh review row and ran one composed review gate of 7.07 s. The first verification failed on a criterion, not on an in-surface defect, as product 07's criteria-bound verdict now directs.

## Executed checks

Every probe outside the gates was read-only or ran under `node scripts/harness.mjs bounded`.

- **State:** `resume status --json`, `harness writer --show`, usage at entry and handoff, `git fetch origin main` and the base comparison.
- **Hashes:** the two report hashes against their control events. The full tree, compared through a temporary index, against checkpoints 9 and 10.
- **Integration:** `worktree integrate`, `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` and `npm run plan -- check`.
- **Review:** the full source diff against `main`, by file. The per-identifier import counts of `scripts/docs-check.mjs`. A scan of added lines for new lint or type suppressions, `.only` and skipped tests, which found none. The removed test assertions, each of which is replaced by one for the authorized behavior.
- **D016:** `node --check` and a bounded `node scripts/docs-check.mjs`.
- **Register:** the touching listing through every cursor, `--show` for eight rows, and the `--apply` batch.
- **Gates:** `npm run format`; `npm run test:docs` (29 of 29, 123.68 s); `npm test -- --review` once, after the last source edit, with the new fixture file staged; then `npm run test:docs` on the final documents: one `release-surfaces` failure on the release notes' wording, then 29 of 29 in 107.98 s.
- **Clean room:** a search of this order's evidence, verification and final-review records, the new fixture and these reports for home paths, host temporary paths, e-mail addresses and URLs found none. No employer material, credential or internal address appears.

## Limits

- The order's measures need later orders: the escape count over three orders after this one (assumption 1), and whether the ceiling advisory alone is enough (receipt 041).
- The spawn advisory was not exercised live, because the procedure forbids starting an agent while a gate runs. It rests on the fixture.
- The composed review row is keyed to the code identity alone until WO-198 records shared refs, as the order's last known issue states. No composed row in this order passed where a fresh run failed.
- Worker effective effort and dollar cost are unobserved.
