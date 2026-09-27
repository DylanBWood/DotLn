# WO-170 FINAL-001 — final review

**Verdict:** pass. WO-170 asked that the meter on `main` keep what a closed order's sessions observed, read what it cannot observe as unavailable instead of zero, and count how often the operator directed the work. The subject writes a bounded per-order snapshot at `release prepare` where the journals are. It reads that snapshot, then the retained usage copies, after the close. It recovered usage totals by role for the 77 closed orders whose copy the main checkout held, and it counts directions from committed files. [VER-001](../../verifications/WO-170/VER-001.md) failed criterion 3 on an older usage observation winning after ten collision-preserved copies. [VER-002](../../verifications/WO-170/VER-002.md) passed all seven criteria after the repair. This review read the full subject diff, re-ran the review gate, audited all 77 recovered snapshots against the operator's main checkout, recomputed the five orders' directions and disposed the twelve rows its own `--touching` run returned. It changed no source. One finding is recorded, not fixed, in [D019](../../evidence/WO-170/decisions.md#wo-170-d019--final-review-passes-and-records-that-the-direction-count-reads-agent-written-labels): the direction count reads the dispatched agent's own labels, so it undercounts. The order specified that rule, and the operator, asked during this review, chose to pass and record it.

**Subject:** [`docs/work-orders/WO-170-meter-keeps-what-sessions-observed.md`](../../work-orders/WO-170-meter-keeps-what-sessions-observed.md) on branch `wo-170`, uncommitted, over `main` at `cb526f1dddb7ac96ba3af33f11632d8debc7f5d1`. `git ls-remote origin refs/heads/main`, `origin/main`, local `main` and the merge base all name `cb526f1d`, so no integration was needed or run. The dispatch checkpoint is `refs/dotln/checkpoint/WO-170/9` (`1930a8e1`).

- The recorded `reportHash` values of VER-001 (`sha256:aabd0729…`) and VER-002 (`sha256:54525f43…`) equal the reports' current SHA-256.
- The order's text differs from `main` only in its heading's `(v0.52.8)` label, written at activation. The seven criteria are the original ones.
- The review gate ran at code identity `99f38f8f7c99243b2f14f8761ac6fa79972292c44b5f8bcae9c9fece5529c761`, the identity of the repair's gate and VER-002's gate, so the tracked non-generated code is the code VER-002 judged. What this review wrote afterwards is documents and the ignored register request only: D019, the decisions index, the register, the evidence README's Limits sentence, the refreshed snapshot and meter block, this report, the PR body and the release notes.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.283","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. Midway, the operator said they had never used the dispatch strings I had quoted, and asked what the order does. When I put the direction-count finding to them with three choices (pass and record it, fail, or stop), they chose to pass and record it. They made no other choice about the verdict. The harness version is from `claude --version`, and the model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session; it is the selected effort, not the effective one. The order asks for `reviewer any`. Subagent plan, stated before any spawn: none, against the cap of 20 with 0 observed at entry. The executor's four reviewers and skeptic, VER-001's two reviewers and two independent verifications had already read this subject. I judged that more helpers would add cost without adding a lens, and the root did the review alone. None was spawned.

**Process cost:** entry 83059 tokens; handoff 12930734 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage a6e30d3e-682d-4cee-ba52-48728de214f5`. The entry reading was observed at 2026-09-27T23:13:07.121Z. The handoff reading was observed at 23:34:09.144Z, after the judgment text, the PR body and the release notes were written and before `test:docs` and the result transition. It counts 12,651,520 cached input, 210,129 cache-write, 176 uncached input and 68,909 output tokens over 90 steps and 82 commands. The harness counted 0 subagents, exact-observed, 20 of the cap of 20 remaining. Both readings count reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The largest wait was the review gate, 638.97 s. I did the diff reading, the fixture reading and the dispatch hand count beside it with read-only commands.

## Goal-aligned judgment

The order is not on a lifecycle critical path. Its promised benefit is that a planning pass can read, from `main`, what an order cost and how often the operator had to step in. The answer must not be a false zero, and it must survive worktree removal and the next prune. The questions for this review were three. Does each value the meter now shows come from an observation? Do the 77 recovered snapshots carry exactly the retained rows? Does the new direction count measure what its name says?

- **Seeking the wrong goal** is the material lens, and it produced the finding. `operatorDirections` counts decision records whose `dispatch` field begins with one of four prefixes. That field is written by the dispatched agent as a control prefix plus a paraphrase, and `resume:` is an admitted prefix. The count therefore follows how agents labelled the operator's steps. An agent that files every step under `resume:` drives it to zero while supervision stays the same. On `main`, WO-115 reads 0 although two of its decisions record an operator scope expansion (D019).
- **Shifting the burden:** the order removes a hand count from planning, and the false-zero correction count is gone. Without D019, a planning pass would read WO-115's 0 as no intervention and put the burden back on the operator to notice.
- **Rule beating:** I checked whether any criterion could pass without its intent. Criterion 4's fixture hand-counts only prefix-shaped dispatches, which is the rule the order wrote. So it passes, and the gap it misses is the one D019 records. The recovery certificate (`usageCopies`) is exactly what the prune reads, and every digest matched its copy's bytes.
- **Policy resistance:** the 76 digests let the prune release those lanes after the merge (an inference from D008 and WO-171's rule). The totals by role survive in Git, and the per-dispatch rows do not. That is the order's design ("the totals survive a prune"), and the PR body says it.
- **Tragedy of the commons:** 77 snapshots of at most 3,550 bytes replace two whole-meter copies of about 100 KB each. Each prepare-written snapshot stays within 8 KB; this order's own is 3,809 bytes.
- **Drift to low performance:** VER-001's failure and the repair are recorded as they happened (D015, D017). This review's gate took 638.97 s against VER-002's 645.01 s, and both figures are given.
- **Escalation, success to the successful:** no gate, event, grant or refusal is added, and the direction count carries no threshold, as the order requires.
- **Naive Interventionism:** I did not widen the counting rule in this review. Which `resume:` labels are directions (a takeover after a crashed session, "continue", an approval) is a classification for planning, and editing verified source would need a new gate.
- **NoOp** leaves `main` reporting 0 corrections from no journal and "unavailable" tokens for 77 orders whose usage exists, and leaves the 76 lanes kept by WO-171's rule indefinitely.

## Criteria

**Criterion criterion:1:** met

`release:case:prepare_independent` passed in this review's gate. It runs `release prepare --local` without an order journal (no snapshot, and the message `Meter snapshot not written: this checkout holds no session journal of WO-099.`) and then with one, when it writes WO-099's row alone within 8,192 bytes with one guard refusal, one Stop refusal and one journal correction. The process-debt fixture holds the heaviest row within the bound, replaces it on a later write and runs `meta --write`. I read `writeOrderSnapshot`: it refuses a closed or withdrawn order, a checkout with no journal and an oversized row, and says why in each case. This review's own `release prepare` printed `Meter snapshot: docs/evidence/WO-170/meta.json, 3809 bytes.`

**Criterion criterion:2:** met

The closed-order fixture, which I read and which passed in the gate, reads guard refusals, Stop refusals, corrections, commands, steps and read bytes from a snapshot after the journals are gone. With neither journal nor snapshot, each reads `null`, `operatorCorrections` is `null` with source `unavailable`, and the table cell reads `unavailable`, although a release-close journal and usage row of the order are present. On `main`'s meter, WO-166's correction cell reads `unavailable` where the 2026-09-27 cost table read 0.

**Criterion criterion:3:** met

The retained-only fixture reports 154 tokens with each copy named in `source.usage`, and covers per-role precedence and an unknown dispatch. The repaired `latestUsage` orders rows by `recordedAt`, then the observation cutoff, before selecting. The collision fixture drives `recordUsageObservation` and `reconcileWorktreeMaterial` through `.from-WO-999-10` and gets 200 in both readers, VER-001's case. My audit recomputed every recovered snapshot's `usageByRole` from the main checkout's copies with the repaired reader, and all 77 matched.

**Criterion criterion:4:** met

The fixture hand-counts two `scope expand:` decisions, one `operator override:` decision and one `RecordCorrected` event as 4, and an order with none as 0. The table column, the text line, the shifting-the-burden indicator and its directions list carry the count. The order's rule is met as written. D019 records that this rule misses directions an agent filed under `resume:`.

**Criterion criterion:5:** met

- **This order's PR body shows its snapshot's figures.** This review's `release prepare` rewrote both from one collection at cutoff 2026-09-27T23:28:58.545Z. The WO-170 row and the snapshot agree: 9,004,472 ms over 4 attempts, 3,837,634 gate ms, 102,085,188 tokens, 1,019 declared prompt tokens, 4 corrections and 0 directions. Per role, the executor has 86,580,508 tokens, the verifier 9,941,368 and the reviewer 5,563,312. The four corrections are journal events: two from the implementation and two hedged-quantity observations in this review.
- **Directions for the five orders closed on 2026-09-25 and 2026-09-26, as `main` computes them** (`closedDirections` over the committed record at `cb526f1d`, this order's library): **WO-070 0, WO-115 0, WO-165 0, WO-085 2, WO-166 2.** The counted four are `scope expand:` decisions. Uncounted `resume:`-prefixed labels naming the operator: WO-070 1, WO-115 10, WO-165 2, WO-085 1, WO-166 0 (D019).
- **Recovery.** I wrote a read-only audit from the worktree against the main checkout's retained lanes. It found 77 lanes with a usage copy and 77 snapshots, each holding its own order's row alone. The largest is 3,550 bytes, and they carry 2,262 rows. All 76 certified digests equal their copies' SHA-256. WO-067's copy is listed as uncarried, and no copy was modified after the activation at 20:29:23Z. [recovery.json](../../evidence/WO-170/recovery.json) lists the 37 closed orders without a copy, and 77 + 37 equals the 114 closed orders.

**Criterion criterion:6:** met for this phase

Product 07's meter sentence is edited in place, from 188,350 to 188,390 bytes (+40 against a 300-byte bound). Decisions D001 to D019 are recorded, and the decisions index is refreshed. `FUP-a33f893036882d16` and `FUP-85562931791378d4` read `allocated` to WO-170. Retargeting them is the close-stage write-back the order names; no record claims it happened. The babysitting-rate row is only partly answered: D019's row `FUP-80a2f11e1e0874d8` carries the remainder.

**Criterion criterion:7:** met

`npm test -- --review` passed: 34 passed, 0 failed, 638.97 s, 78 fresh tasks, exit 0 (details under Checks). `npm run test:docs` passed after this report, the PR body and the release notes were written. `git diff --check` is clean. `package.json` and the lockfile are unchanged, and the registered evidence sources `packages/skeleton/src/correction-observation.mjs` and `packages/skeleton/src/observed-facts.ts` are unchanged. The diff under `scripts/` and `packages/` adds no lint, type or format suppression.

## Rows this order's `--touching` run returned

After D019 was synced, `npm run plan -- followups --touching` returned twelve rows at register revision `3b9b51c2e5aed9cb73ecc0f5320664d8dba685bdf9d7309f624ab7b7e19c4131` (103 paths and WO-170, 149 pending). One batch through `followups --apply` disposed all twelve, and the register moved to `4fc323999645db75486c0b4a125b4d171c33990b973d54bec01f46ad0449ac7f`. Each reason cites this report. The two provenance rows are allocated and not in the pending feed.

| Row | Matched | Disposition recorded | Why |
| --- | --- | --- | --- |
| FUP-71fc2efc208f597a | decisions.md, index | open, unchanged | WO-170's decisions quote no operator chat; D019 paraphrases. |
| FUP-dc6c139003bd4b89 | WO-170 | open, remaining clause | Field chosen and written (D007, D008, D011); no step refreshes a snapshot after `worktree finish`. |
| FUP-50cda1c03ecd8ea8 | harness-prune.mjs, meta.json files | deferred, narrowed | Digest clause done by D008; proof-partial clause remains. |
| FUP-56b599e15f97e666 | product 07 | deferred, same condition | False match; resident-state.ts untouched. |
| FUP-8cfd3ff52146a016 | release.mjs, test-harness.mjs, test-release.sh | deferred, same condition | Only prepare changed; release close untouched. |
| FUP-acfe4bfda716d8fb | current.md | deferred, narrowed | Meta's part decided (D014); resume usage and the board remain. |
| FUP-e2cf2122a642d1e0 | release.mjs | deferred, same condition | Release listing untouched. |
| FUP-e62c63344f52405f | harness-prune.mjs | deferred, same condition | Only `usageRetention` changed. |
| FUP-f1c7a256bec46737 | product 07 | deferred, same condition | Every profile at delta 0; reviewer 24,171 of 24,576. |
| FUP-fa028783f3f6b17f | meta.mjs | deferred, same condition | Condition met by the prepare edit; the draft-ownership member recurred here and its seam is untouched. |
| FUP-fd05316b6030ef73 | README, product 07, indexes | deferred, same condition | The writer text is untouched. |
| FUP-80a2f11e1e0874d8 (D019) | WO-170 | open, for the next planning pass | Minted by this review. |

## Findings

One is recorded, not routed to repair. No criterion fails.

- **F1, moderate, established by reading and by count: the direction count follows agent-written labels** (`scripts/lib/meta.mjs` `operatorDirections`; `scripts/docs-check.mjs` `validDispatch`). A decision's `dispatch` is the dispatched agent's paraphrase after one of seven prefixes, and a step the operator took inside a `resume:` dispatch is filed as `resume: …; operator …` and skipped. At `main`: 871 dispatches over 114 closed orders, 71 counted, 165 others in 44 orders naming the operator after a non-direction prefix. Not all 165 are directions: seven WO-115 labels record a takeover after a stopped Codex session. The rule is the order's (Design, fourth bullet), so the defect is in the measure's design. Recorded in D019 with follow-up `FUP-80a2f11e1e0874d8`. The PR body, the release notes and the evidence README's Limits call the column a lower bound.
- **Observation, existing behaviour: the read-obligation cell reads `0 / 0` for WO-170 at final review,** where the repair's prepare read 13 files and 223,586 bytes. The computation predates this order and is unchanged by it. I did not trace it further.
- **Observation, inference from code: the recovered lanes become releasable after the merge.** The 76 certified copies stop holding their lanes under WO-171's usage rule once `main` carries these snapshots, and an apply may then remove them under its other rules. This is the order's design; it is stated in the PR body and release notes.

## Reviewer errors in this session

- I first presented dispatch strings such as `resume: fix; operator scope expand` and `Operator resume:` as if they were phrases someone had said. The operator said they had never used them. They are agent-written labels, and that correction became F1's key fact.
- I stated the gate's length as "about 11 minutes" and a suite as "about 250 s" without naming their source. The harness flagged both. The figures came from VER-002's gate (645.01 s) and WO-171's review (harness-fixtures 251.64 s), and this run measured 638.97 s.
- Beside the live gate I ran `git worktree list`, a loop with a shell expansion, a `cut` pipe and an unquoted glob. Each is outside the admitted read list, and each was refused with nothing written. I re-ran them in admitted forms or after the gate.
- My first `followups --apply` named a file in session scratch, and the command refused a request outside the repository. I copied it to the ignored `docs/control/local/` and applied it there.
- I joined two files' output with `echo ======`. zsh expanded the `=` word and the command exited 1 after the first file had printed, the same error WO-171's reviewer recorded. I read the second file on its own.

## Verification sequence

1. **Implementation** (executor, Claude Code, `claude-opus-5-5`, xhigh, per the [evidence README](../../evidence/WO-170/README.md)): activated at 2026-09-27T20:29:23Z; `ImplementationReady` at 21:55:05Z. D001 to D014. Four reviewers and a skeptic confirmed six defects, each fixed with a fixture (D012). The first review gate failed on a literal intake path (D013), and the second passed 34 suites in 632.45 s.
2. **[VER-001](../../verifications/WO-170/VER-001.md)** (Codex CLI 0.157.1, `gpt-6-astra`, ultra recorded as xhigh with subagents, `codex-session-readback`): fail at 22:19:47Z. Criterion 3 was unmet through F1: after ten collision-preserved copies, the meter and the recovery took 190 where the newest observation held 200. N1 was an overbroad Limits sentence. D015 and D016 record them.
3. **Repair** (executor, Claude Code, `claude-opus-5-5`, xhigh): `RepairRequested` at 22:20:29Z, `RepairCompleted` at 22:42:34Z. D017 orders rows by recording time before selection, and D018 qualifies the sentence. Its gate passed 34 suites in 640.10 s at code identity `99f38f8f…`.
4. **[VER-002](../../verifications/WO-170/VER-002.md)** (Codex CLI 0.157.1, `gpt-6-sol`, xhigh, `codex-session-readback`): pass on all seven criteria at 23:11:33Z. Its gate passed 34 suites in 645.01 s at the same identity.
5. **FINAL-001** (this report): dispatched at 23:12:58Z, checkpoint 9. No finding routed to repair; F1 is recorded in D019.

## Checks

| Check | Result |
| --- | --- |
| `git ls-remote origin refs/heads/main`, `origin/main`, local `main`, merge base | all `cb526f1d`; no integration at review |
| Tags | local and `origin` end at `v0.52.7`; `v0.52.8` is free |
| `npm test -- --review` | 34 passed, 0 failed, 638.97 s, 78 fresh tasks, exit 0; recorded 2026-09-27T23:25:42.806Z; code identity `99f38f8f…`, tree `d9e6a3da`; row `host-gate:99f38f8f7c99243b2f14f8761ac6fa79972292c44b5f8bcae9c9fece5529c761:npm test` |
| Recovery audit against the main checkout (read-only) | 77 of 77 snapshots, one row each, max 3,550 bytes, 2,262 rows, 76 digests equal, `usageByRole` recomputed equal, WO-067 uncarried, no copy modified after activation |
| Directions at `main` (`closedDirections`) | WO-070 0, WO-115 0, WO-165 0, WO-085 2, WO-166 2; 71 of 871 dispatches counted; 165 uncounted labels name the operator |
| `npm run release -- prepare --local` | `v0.52.8` remains current; wrote the snapshot (3,809 bytes) and the PR meter block at one cutoff |
| `npm run plan -- followups --touching`, then `--apply` of a 12-request batch | 12 rows at `3b9b51c2…`; all applied; register `4fc32399…` |
| `node scripts/harness-context.mjs --check` | every profile at delta 0; reviewer 24,171 of 24,576 |
| `node scripts/harness.mjs check` | 31 generated surfaces |
| `npm run publication:check` | pass |
| `npm run release -- check-surfaces --local` | 51 PASS, 0 FAIL |
| `node scripts/meta.mjs --check`, `npm run plan -- check` | exit 0, exit 0 |
| `git diff --check` | clean |
| Manifests, lockfile, registered evidence sources, added suppressions | unchanged, unchanged, unchanged, none |
| `npm run test:docs` | 23 passed, 0 failed, 12.35 s, 23 fresh tasks, after this report, the PR body and the release notes were written. It was rerun after this row was written. |

## Evidence gate, write-back, non-goals and assumptions

- **Evidence gate:** the fixture transcripts are in [fixtures.txt](../../evidence/WO-170/fixtures.txt). The snapshot this order's own `release prepare` wrote is [meta.json](../../evidence/WO-170/meta.json), refreshed by this review. The five orders' direction counts are under criterion 5. `npm test -- --review` ran before `implementation-ready`, at the repair, at VER-002 and here, with no live row.
- **Write-back:** product 07 is edited in place; decisions D001 to D019 are recorded; the provenance rows are under criterion 6.
- **Non-goals held:** no journal-derived signal is recovered for orders whose worktrees are gone, except the three earlier whole-meter rows the order found. No journal is retained. The five unsourced signals stay `null`, there is no threshold on any count, and the console board and the usage observer are untouched.
- **Operator-review assumptions:** (1) "A direction is counted from what the record already publishes." It holds, with the qualification D019 adds: what the record publishes is the agent's label, not the operator's words. (2) A patch with no live row fits a measurement change whose criteria are fixtures and one observed snapshot.

## Handoff

On pass, this review commits the reviewed state in coherent commits with plain subjects and runs `npm run worktree -- publish WO-170` with the reviewed title and the committed `docs/final-reviews/WO-170/PR.md`. That pushes the `wo-170` branch and opens its pull request. The operator's phrase authorizes nothing further. The merge, `main`, the `v0.52.8` tag and the release stay with the operator and release close, which runs in the `main` checkout after the merge and retargets the two provenance rows.
