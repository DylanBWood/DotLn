# WO-103 — FINAL-001

**Verdict:** pass. All eight criteria are met against the original order. The evidence is VER-001's reproductions, my own reading of the full diff and the shipped oracle, a regeneration and corpus run on the integrated tree, and a fresh product gate. `main` had moved to WO-176's `v0.60.1`, so I integrated it. Upstream changed no kernel, audit, corpus or package file, so every corpus claim carries forward, and the release retimes from `v0.60.1` to `v0.60.2`. VER-001 listed mutation probes as not done, so I ran thirteen kernel mutations through the corpus's own sweeps. The sweeps detect twelve. The thirteenth swaps `effect denied` and `effect not allowed` and passes with zero divergences, because no declared cell fails both rules. Criterion 3 makes a case outside the declared set a follow-up, so I pass and board it in [D012](../../evidence/WO-103/decisions.md#wo-103-d012--final-review-one-precedence-pair-the-declared-factorial-never-contests).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 86437 tokens; handoff 21698123 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness before this procedure loaded. The canonical phase selected WO-103 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage 661c832f-2761-491f-9b67-c596fb00d829`.
- **Entry:** observed at 2026-10-01T15:18:05.947Z.
- **Handoff:** observed at 15:39:00.845Z (128 steps, 101 commands), before this report was filed.
- **Breakdown:** 21,392,133 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable, which means unknown, not zero.
- **Wall clock:** the largest costs were the product gate (419.80 s) and the probes (13 sweeps of about 25 s each, plus the unmutated baseline).
- **Subagents:** the plan was none, out of the 20 available. The readback observed 0, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted WO-103 worktree on base `ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0`, checkpoint `refs/dotln/checkpoint/WO-103/3`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-103/VER-001.md) passed, and no repair followed. Its SHA-256 equals the control log's `reportHash` (`516868a2…`). Between `/3` and this dispatch's `/5`, only the control log, `current.md`, the work-order index and VER-001 changed. The corpus bytes I staged equal `/3`'s: `git diff --cached refs/dotln/checkpoint/WO-103/3 -- corpus` is empty.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment. The order's catalog row in `docs/planning/work-order-map.md` asks to "assign version and close disposition; pin the landed WO-017 base". D006 assigns the patch, the manifest pins the base, and WO-017 FINAL-001's carry-in is reproduced as WO-103-F001 and F002.

**Integration.** `origin` and local `main` named `2f525014` (WO-176, `v0.60.1`), four commits past the executor's base. `git diff --stat ee9b9db9 2f525014` touches 43 files: WO-176's records and the `scripts/` release-close machinery. Nothing under `packages/` or `corpus/` changed, and neither did `package.json` or `package-lock.json`. `docs/intake/` holds no ignored file, so the helper needed no intake backup. `npm run worktree -- integrate WO-103`:
- checkpointed the work as `refs/dotln/checkpoint/WO-103/6`;
- retained the include-untracked stash `b1965500` (`WO-103 integrate 2026-10-01`);
- fast-forwarded the uncommitted branch to `2f525014` and re-applied the stash;
- regenerated the runtime, the harness bundle, the control projection, the decisions index, the follow-up register, meta, the work-order index and the publication locks;
- re-merged two projections (`current.md`, `followups.json`) and reported no authored conflict.

Release preparation retimed the order from `v0.60.1` to `v0.60.2`, above the observed `v0.60.1` tag, under the recorded patch classification. That collision is bookkeeping, and no component version changes. I completed the helper's draft record as [D011](../../evidence/WO-103/decisions.md#wo-103-d011).

**Carried-forward claims.** The corpus reads only `packages/kernel/dist` and `packages/skeleton/dist/src/audit.js`, and upstream changed neither source. VER-001's criterion 1–7 judgments therefore rest on unchanged inputs. I re-ran the criterion 8 commands on the integrated tree (see Executed checks): the seeded `--check` is byte-identical, the 14 corpus tests pass, and the unmutated probe reproduced the manifest's authority stream hash (`dcbd7d04…`).

I reviewed:
- the order and its cited sources: product 02's AuthorityEnvelope row; `authorize`, `effectMatches`, `persistCommand`, `applyCommandResult` and both `replayOutbox` overloads in `packages/kernel/src/core.ts`; product 07 §Goal-aligned decisions and §Independent workflows and integration; product 08 §PRs and commits and §Release-note edition;
- the handoff, D001–D010, VER-001 and the order's catalog row;
- the full diff. That covers the generator, both libraries, the three test files, the manifest, the findings file, the precedence table and both run transcripts. It also covers every tracked change: the release heading and README block, the control projection, the generated index, the decisions index and the two follow-up rows.

The diff matches the order's design:
- It adds files only under `corpus/fixtures/authority/`, `corpus/fixtures/outbox/`, `corpus/harness/` and `corpus/manifests/`. Every tracked change is a lifecycle record.
- The authority oracle ranks its own eight failure flags with `indexOf(true)` and calls none of `authorize`, `effectMatches`, `predicate` or `commandId`. Its trace shapes and reason strings are pinned from the shipped code, as the Objective directs.
- Its semantic loop records every condition × event call and stops at the planted throw, as the shipped loop does.
- The outbox oracle derives the first persist and first result per ID from the whole log, rather than stepping the replay loop.

Clean-room screen: I searched every new file, VER-001, the decisions and this review's own files for user paths, account identities, hosts, URLs and secret shapes. Only the gitmoji catalog link below appears; the executor had already normalized the run transcripts. No lint, type or format suppression appears in the new sources.

## Criteria

**Criterion 1:** met, on VER-001's reproduction and the manifest. The eleven authority factors and their literal levels multiply to 2·3·3·3·2·3·3·7·9·4·11 = 2,694,384 cells, and the regeneration printed that count. The outbox declares 8·4·5 = 160 factor combinations over alphabets of 4, 6, 6 and 8 events. It enumerates at most 720 full orders per alphabet and 128 seeded orders above six events: 1,592 orders per combination, 254,720 orders and 509,440 delivery runs. The test `permutation caps and declared factor product are exact, seeded and unique` passed here.

**Criterion 2:** met. The full sweep compares each of the 2,694,384 cells with `isDeepStrictEqual`, on the whole `AuthorizationResult` and on the predicate-call record, and finds 0 divergences. The probes add evidence the criterion does not demand: six of the seven adjacent rank swaps each produce between 10,340 and 898,128 divergent cells. Swapping ranks 5 and 6 produces none (D012).

**Criterion 3:** met against the declared set.
- `runCell` records any exception as a mismatch, so zero mismatches means zero throws.
- The forged effects `null`, `true`, `{}`, `[]` and an omitted effect refuse with `effect is not a string`.
- Missing state, a missing environment, an unknown reference and early or late predicate errors all fail closed.
- The factorial crosses an early match with a late error. The test `early true cannot mask late error` asserts four calls and the refusal.
- The probe that stops semantic evaluation after a match produced 21,384 divergent cells, so the sweep does witness that every condition sees every event.

**Criterion 4:** met. Both `replayOutbox` overloads match the whole-log oracle on every enumerated order, once and with each event delivered twice, with 0 divergences. WO-103-F003 quarantines 960 cells where an incomplete command reaches `pendingCommands`, with its reproducing cell (`outbox-31840`), and D005 boards the repair to `FUP-c1d4be019802be0d`. The probes confirm that the oracle detects regressions: last-persist-wins produced 138,740 divergent cells, and labelling every remembered result `preceded-persist` produced 84,440.

**Criterion 5:** met. `audit-missing-state` refuses with `cannot evaluate revocation` and the suffix `[rngState:932122817, predicates]`; `audit-missing-env` refuses with `[state]`. In both, `deriveAuditRecords` keeps only the refusal's event ID, while the complete-input control does link its trace. The findings file records WO-103-F001 and F002 with these cells and the WO-017 carry-in, and D004 boards the repair to `FUP-2341c85c58331f3e`.

**Criterion 6:** met. `--seed wo103-seed-20261001 --check` regenerated the nine shards, the manifest, the findings file and the precedence table byte for byte on the integrated tree, exit 0. `buildPrecedenceTable` produces the table from the sweep's winners, and the census test asserts it equals the committed bytes. A wrong seed is refused.

**Criterion 7:** met. D003 and D010 record the seed, every factor level and the permutation cap, and D004 and D005 record the three finding numbers. VER-001 found `git diff ee9b9db9 -- package.json package-lock.json packages scripts` empty at the verified subject. After integration, the WO-103 diff against `2f525014` is 31 files: additions under `corpus/`, plus `README.md` and `docs/` lifecycle records.

**Criterion 8:** met. On the integrated tree:
- `npm run build`, the seeded `--check` and `node --test 'corpus/harness/wo103-*.test.mjs'` (14 of 14) pass, with counts matching the manifest.
- `npm test -- --review` passed at code identity `4f5124c9…`.
- `npm run test:docs` passes.
- `git diff --check` is clean, and no dependency changed.

The committed transcript holds the executor's build, check, corpus tests, `test:docs` and fresh `npm test`.

## Register

`npm run plan -- followups --touching` on the integrated register (`78c15749…`, 200 pending) matched 6 rows.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-2341c85c58331f3e | WO-103, the findings file and the authority test | left untriaged | This order's own follow-up for F001 and F002 (D004). Planning allocates the audit-owned order. |
| FUP-c1d4be019802be0d | WO-103, the findings file and the outbox test | left untriaged | This order's own follow-up for F003 (D005). Planning allocates the kernel-owned order. |
| FUP-b7a66e7a4fa7ad20 | `decisions.md` | left | Textual match; release preparation, the integrate helper and the release-history check are untouched. |
| FUP-50cda1c03ecd8ea8 | `meta.json` | left | Textual match on the meter snapshot; `harness-prune.mjs` is untouched. |
| FUP-acfe4bfda716d8fb | `current.md` | left | Textual match on the control projection; usage attribution is untouched. |
| FUP-fd05316b6030ef73 | `README.md`, the work-order index | left | Textual match on generated release and index lines; the writer text is untouched. |

`npm run meta` then synced D012's follow-up as a new untriaged row, `FUP-d22dc57e754ba35c`.

## Executed checks

- Integration: `npm run worktree -- integrate WO-103` (no intake backup needed). Bases `ee9b9db9` → `2f525014`, checkpoint `/6`, stash `b1965500`, no authored conflicts.
- Printed affected checks on the integrated tree:
  - `npm run publication:check` passed.
  - `node scripts/harness.mjs check` reported 31 generated surfaces.
  - `npm run release -- check-surfaces --local`: 57 PASS, exit 0.
- Product row: `npm test -- --review`, recorded 2026-10-01T15:35:15.508Z, after the order's new files were staged.
  - 30 passed, 0 failed, 419.80 s, 75 fresh tasks.
  - Code identity `4f5124c90989392afcb162d31af03b889f75f556cc25ea28443e6688bdc88071`; `gateCodeIdentity` recomputed after the gate gives the same value.
  - The row covers `skeleton` (343.36 s), `worktree-integration` (279.13 s), `browser-evidence` (19.34 s), `console` (17.70 s), `kernel`, `compiler`, `artifact-corpus`, `release-preparation` and the release cases.
- `npm run build`, then `node corpus/harness/generate-authority-corpus.mjs --seed wo103-seed-20261001 --check`: exit 0. It reported 2,694,384 cells, 220,968 predicate calls, 254,720 orders and 509,440 delivery runs. Fixtures: 9 files, 1,152 rows, 2,304,495 bytes. Findings: F001–F003. Time: 30.38 s.
- `node --test 'corpus/harness/wo103-*.test.mjs'`: 14 passed, 0 failed, 25.94 s.
- Mutation probes (D012): 13 mutated copies of `packages/kernel/dist/src`, each swept by the corpus's own `sweepAuthority` or `sweepOutbox`, plus an unmutated baseline. The baseline showed 0 divergences and the manifest's stream hash. Twelve mutations were detected and one was not.
- `npm run meta`: synced D011 and D012 into the decisions index and D012's follow-up into the register. Health line: `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes).
- `npm run release -- prepare`, twice after the decision edits: the `v0.60.2` target remains current against origin's tags, and the runs refreshed the meter snapshot and the PR's meter block.
- `npm run test:docs`, with this report, PR.md, RELEASE-NOTES.md, D011 and D012 in place: 24 passed, 0 failed, 37.43 s. The result transition runs it again inline.
- `git diff --check`: clean.

## Judgment and publication

D012 compares its choice with the mission, the system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- Every declared authority cell and outbox order replays against an independent oracle with zero divergences, and regenerates byte for byte from the recorded seed.
- Three shipped defects are pinned with reproducing cells and routed to follow-ups, with no change to shipped behavior.
- Twelve of thirteen deliberate kernel regressions fail the sweep. The one that passes is named and boarded.

No efficiency gain is claimed. The tradeoff: I spent about six minutes of probes and one fresh product gate to judge whether the evidence would catch a regression, not only whether it agrees with today's kernel.

The raw transcript `WO-103-ee9b9db9…-failed.log` keeps trailing whitespace in its `[browser-evidence]` lines, as VER-001 observed and as the committed `WO-108-gate.log` does. `git diff --cached --check` flags only that file (20 lines). The lifecycle's `git diff --check` compares the worktree with the index and is clean, and no publish or release step in `scripts/` checks whitespace. Rewriting the file would alter preserved evidence bytes, so it stays.

Reviewed PR title: `:white_check_mark: Check every declared authorization and outbox case against an independent oracle, and pin the three defects it finds`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to adding, updating or passing tests, and this change adds a test corpus that passes with its findings quarantined. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-103` and opening its PR. The helper supplies the post-merge release-close handoff.
