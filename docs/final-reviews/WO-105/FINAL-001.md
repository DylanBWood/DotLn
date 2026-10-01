# WO-105 — FINAL-001

**Verdict:** pass. All seven criteria are met against the original order. The evidence:
- VER-001's reproductions and independent probes;
- my own reading of the full diff and the shipped oracles;
- both sweeps and every `--check` re-run on the integrated tree;
- a fresh product gate.

`main` had moved to WO-181's `v0.61.0`, so I integrated it. Upstream bumped `@dotln/compiler` from 0.21.0 to 0.22.0 and changed `packages/skeleton/src/reactor.ts`. The corpus pins the demo's bytes and that file's hash at base `2b1af1ab`. On the integrated tree, both sweeps keep every count, per-offset classification and invariant, and the store and tree `--check` are byte-identical. The golden `--check`, both sweep commands and 3 of the 11 corpus tests do exit nonzero, on hashes alone. The only drift in the demo is the compiler version string. Replacing it makes the golden equal to the live run.

The order keys the golden to its base, and its evidence gate takes the corpus commands from the base transcript. This is therefore not an acceptance defect. I asked the operator, who chose pass with a follow-up. [D012](../../evidence/WO-105/decisions.md#wo-105-d012--final-review-the-corpuss-byte-pins-are-keyed-to-its-base-and-fail-on-later-main) records the evidence and boards the lane's after-base rule to `FUP-d093f77bd927f9dc`. The release retimes from `v0.60.3` to `v0.61.1`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 130785 tokens; handoff 12459941 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness before this procedure loaded. The canonical phase selected WO-105 and allocated this path. The actor values are this session's:
- Claude Code 2.1.287, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage ba4e533b-fef6-420a-b6da-a97a74c68aab`, scope `dispatch`.
- **Entry:** observed at 2026-10-01T17:53:58.985Z.
- **Handoff:** observed at 18:24:41.960Z (94 steps, 80 commands), before this report was filed.
- **Breakdown:** 12,208,467 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable, which means unknown, not zero.
- **Wall clock:** the largest costs were the product gate (1,108.32 s), the two sweeps on the integrated tree (70.4 s) and the corpus tests there (69.0 s).
- **Subagents:** the plan was none, out of the 20 available. The readback observed 0, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted WO-105 worktree on base `2b1af1abfd947068c402daa1ee24b447fc81b1af` (`v0.60.2`), checkpoint `refs/dotln/checkpoint/WO-105/3`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-105/VER-001.md) passed, and no repair followed. Its SHA-256 equals the control log's `reportHash` (`1ec947f1…`). Between `/3` and this dispatch's `/5`, only the control log, `current.md`, the work-order index and VER-001 changed. After integration, `git diff --cached refs/dotln/checkpoint/WO-105/3 -- corpus packages/kernel/test/fixtures/jsonl-protocols.json` lists only WO-102's upstream cadence files. The WO-105 corpus and the registry line are byte-identical to the verified subject.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope-expansion event. The order's text was amended once under the operator's registry exception (D009, D010). As VER-001 noted, `npm run plan -- amend-order` refuses an order outside the latest planning receipt, so that amendment is recorded in the decisions and the order rather than the planning log.

**Integration.** Local `main` and `origin/main` named `85d13906` (WO-181, `v0.61.0`), seven commits past the executor's base. Upstream changed these files in the corpus's scope:
- WO-102 (`v0.60.3`) added its cadence lane under `corpus/`.
- WO-181 changed `packages/compiler` (0.22.0) and `packages/skeleton` (0.49.0), including `reactor.ts`.
- Nothing under `packages/kernel/src` changed, and neither did the registry file.

`docs/intake/` holds only tracked `.gitkeep` files, so the helper needed no intake backup. `npm run worktree -- integrate WO-105`:
- checkpointed the work as `refs/dotln/checkpoint/WO-105/6`;
- retained the include-untracked stash `72900f84` (`WO-105 integrate 2026-10-01`);
- fast-forwarded the uncommitted branch to `85d13906` and re-applied the stash;
- regenerated the runtime, the harness bundle, the control projection, release preparation, the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures;
- reported no authored conflict.

Release preparation retimed the order from `v0.60.3` to `v0.61.1`. WO-102 had already released `v0.60.3`, so that collision is bookkeeping. A second `npm run release -- prepare` against origin's tags kept `v0.61.1`. No component version changes. I completed the helper's draft record as [D011](../../evidence/WO-105/decisions.md#wo-105-d011).

**Carried-forward claims.** I re-ran the corpus on the integrated tree, built with `NODE_OPTIONS=--max-old-space-size=512`. The results:
- The store and tree `--check` are byte-identical.
- The store sweep covers 72,345 cuts (117 clean-prefix, 72,228 loud-failure).
- The skeleton sweep covers 16,554 runs (12 recovered-prefix, 16,542 loud-failure).
- Every in-sweep invariant holds, and the counts and per-offset classifications equal the manifest's.

These fields differ:
- the canonical demo's `logSha256` in the store lane;
- the crash opening's `logSha256` and `recordsSha256`;
- the `traceSha256` of 9 of the 12 recovered cuts;
- both skeleton families' log, trace and replay digests.

The golden `--check` fails with `regeneration differs`. Golden and live both have 28 traces, 28 events and 23,831 log bytes, and their glyph scenes are equal. The first difference is `artifactIdentity.compilerPackageVersion` 0.21.0 → 0.22.0, and replacing that string in all 23 places makes the serialized traces, log and glyph scene equal. `node --test corpus/harness/wo105-*.test.mjs` passes 8 and fails 3: the golden test, and the store and skeleton tests that deep-compare the sweep against the manifest. The manifest pins `reactor.ts` at `f2e22003…`, and integrated `main` has `ba9e8954…`.

I reviewed:
- the order and its cited sources: `appendEvent`, `decodeLog` and `encodeLog` in `packages/kernel/src/store.ts`; `replay`, `replayOutbox` and `pendingCommands` in `core.ts`; `runScenario`, `replayScenario` and `ScenarioOptions` in `packages/skeleton/src/scenario.ts`; product 07 §Goal-aligned decisions and §Independent workflows and integration; product 03 §Corpus policy; product 08 §PRs and commits and §Release-note edition;
- the handoff, D001–D010, VER-001 and its integration advisory;
- the full diff. That covers all ten harness files, both test files, the store, golden and tree fixtures, the tree README, the manifest, the observations and the run transcript. It also covers every tracked change: the order's heading and exception text, the registry line, the README release line, the control projection, the generated index and the decisions index.

The diff matches the order's design:
- New files sit only under `corpus/fixtures/store/`, `corpus/fixtures/golden-traces/`, `corpus/fixtures/skeleton-trees/`, `corpus/harness/` and `corpus/manifests/`. The one existing-file edit outside the lifecycle records is the approved registry entry.
- `cutOracle` frames LF boundaries and parses each line itself. `classifyCut` compares a successful decode with that prefix by an iterative structural digest, so a silent divergence or a failing boundary would be classified, not trusted.
- `classifyRecovery` calls the shipped hook exactly once per offset. It counts effects through the independent `onExecutorClaim` callback and requires a loud failure to carry the decoder's own message with zero effects. `referencePending` recomputes pending commands without `replayOutbox`.
- `validateTree` recomputes inventory, edges, reachability, orphans and candidates from `tree.json` alone. Families must differ by more than file names.

Clean-room screen: I searched every new file, VER-001, the decisions and this review's own files for user paths, account identities, hosts, URLs and secret shapes, and found none. No lint, type or format suppression appears in the new sources.

## Criteria

**Criterion 1:** met, on the unchanged manifest and VER-001's reproduction. The manifest records:
- seed `wo105-crash-20261001`;
- event counts 0/1/8/64;
- byte sizes for every log;
- the 512-append chain;
- 72,345 store and 16,554 skeleton cut points.

The transcript's last complete attempt prints both totals. The integrated sweeps reproduced both totals.

**Criterion 2:** met. VER-001 reproduced both sweeps at the base with an independent every-cut store oracle and a 412-offset recovery spot check. On the integrated tree the two sweeps ran every declared offset again. There was no silent divergence and no boundary failure. Every recovered cut kept at most one effect per command ID, recomputed its pending commands and kept live/replay identity. Every unrecovered cut failed loudly with no effect. The canonical logs are not byte-identical to the declared ones, because of the version string (D012), and both satisfy the invariants.

**Criterion 3:** met. CRLF and depth-12000 have explicit classifications in `corpus/fixtures/store/index.json` and the manifest, with run-twice `replay` and `replayOutbox` determinism. The tree `--check` on the integrated tree re-validated all four families against their ground truth and their distinct live signatures, and confirmed live/replay identity. No family trips an assertion, and the planted throwing runner yields four explicit `excluded-with-reason` entries.

**Criterion 4:** met at the base commit, as the criterion is worded. VER-001 reproduced the golden against the shipped scenario at `2b1af1ab`. On the integrated tree it differs only by the compiler version string (D012). Live/replay identity holds for every tree family there, and none is excluded.

**Criterion 5:** met. The store and tree `--check` regenerate byte for byte from the recorded seed on the integrated tree. The golden `--check` holds at the base (VER-001) and is keyed to it (D012). `corpus/fixtures/skeleton-trees/README.md` and each `ground-truth.json` carry the non-normative label.

**Criterion 6:** met. D001 and D004 record the seed, sizes and family inventory, and the manifest's `findings` is empty, so no finding number was allocated. Against `85d13906`, `git diff --name-only -- package.json package-lock.json packages scripts .claude .agents corpus/README.md` lists only `packages/kernel/test/fixtures/jsonl-protocols.json`. That is the one approved registration (D010). Every other tracked change is a lifecycle record.

**Criterion 7:** met. The corpus commands carry forward from the base transcript and VER-001, as the evidence gate defines them. On the integrated tree, `npm run build`, the store and tree `--check` and both sweeps' coverage and invariants pass with the manifest's counts. The base-keyed hash comparisons fail there (D012). The final-review gates were run on the integrated tree:
- `npm test -- --review` passed at code identity `a20520b5…`.
- `npm run test:docs` passes.
- `git diff --check` and `git diff --cached --check` are clean, and no dependency changed.

## Register

`npm run plan -- followups --touching --work-order WO-105` on the integrated register (`324373ef…`, 205 pending) matched 4 rows, the same four D007 judged.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-b7a66e7a4fa7ad20 | `decisions.md` | left | Textual match; release preparation, the integrate helper and the release-history check are untouched. |
| FUP-50cda1c03ecd8ea8 | `meta.json` | left | Textual match on the meter snapshot; `harness-prune.mjs` is untouched. |
| FUP-acfe4bfda716d8fb | `current.md` | left | Textual match on the control projection; usage attribution is untouched. |
| FUP-fd05316b6030ef73 | `README.md`, the tree README, the work-order index | left | Textual match on the release line, a fixture README and generated index lines; the writer text is untouched. |

`npm run meta` then synced D012's follow-up as a new row, `FUP-d093f77bd927f9dc`.

## Executed checks

- Integration: `npm run worktree -- integrate WO-105` (no intake backup needed). Bases `2b1af1ab` → `85d13906`, checkpoint `/6`, stash `72900f84`, no authored conflicts.
- Printed affected checks on the integrated tree:
  - `npm run publication:check` passed.
  - `node scripts/harness.mjs check` reported 31 generated surfaces.
  - `npm run release -- check-surfaces --local`: 57 PASS, exit 0.
- Product row: `npm test -- --review --serial` with `NODE_OPTIONS=--max-old-space-size=512` (the operator's memory steering, D006), recorded 2026-10-01T18:19:36.501Z, after the order's new files were staged.
  - 30 passed, 0 failed, 1,108.32 s, 75 fresh tasks.
  - Code identity `a20520b5964bd0e8e0dbfbd9ff23fc5b304017b74ee94dd594e501cfb5900142`; `gateCodeIdentity` recomputed after the gate gives the same value.
- `npm run build`, then on the integrated tree:
  - `generate-store-corpus.mjs --seed wo105-crash-20261001 --check`: exit 0, 7 files.
  - `generate-tree-corpus.mjs --seed wo105-crash-20261001 --check`: exit 0, 4 families, 9 files.
  - `generate-golden-corpus.mjs --seed wo105-crash-20261001 --check`: exit 1, `regeneration differs` (D012).
  - `storeSweep()` and `skeletonSweep()`, compared field by field with the manifest: 72,345 and 16,554 cuts, invariants held, and only the digests listed above differ (70.4 s).
  - `node --test --test-concurrency=1 --test-reporter=spec corpus/harness/wo105-skeleton.test.mjs corpus/harness/wo105-store.test.mjs`: 8 passed, 3 failed (69.0 s).
- A golden comparison script in session scratch confirmed that the compiler version string is the only difference.
- `npm run meta`: synced D011 and D012 into the decisions index and D012's follow-up into the register. Health line: `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at earlier closes).
- `npm run release -- prepare` against origin's tags: `v0.61.1` remains current. The run refreshed the meter snapshot and the PR's meter block.
- `npm run test:docs -- --serial`, with this report, PR.md, RELEASE-NOTES.md, D011 and D012 in place: 24 passed, 0 failed, 79.08 s. The result transition runs it again inline.
- `git diff --check` and `git diff --cached --check`: clean.

## Judgment and publication

D012 compares its choice with the mission, the system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- Every declared cut of seven store logs and of the demo's crash opening is classified and pinned, with no silent divergence, at the base and on the integrated tree.
- The golden demo, the four tree families and their structural truth regenerate from the recorded seed at the base.
- The lane's byte pins do not survive a sibling's version bump. That limit is disclosed and boarded rather than chased with a re-recording.

No efficiency gain is claimed. The tradeoff: I spent one fresh product gate and about two and a half minutes of corpus runs on the integrated tree. That established that only identity bytes moved, instead of carrying the base verdict forward unexamined.

Reviewed PR title: `:white_check_mark: Pin that an event log cut at any byte decodes to its exact prefix or fails loudly, in the store and in crash recovery`. The gitmoji catalog assigns that shortcode to adding, updating or passing tests, and this change adds a test corpus. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state that the lane runs at its base for now. A pass authorizes committing this reviewed state, pushing only `wo-105` and opening its PR. The helper supplies the post-merge release-close handoff.
