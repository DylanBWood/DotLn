# WO-180 — FINAL-001

**Verdict:** pass. All six criteria are met against the original order, on VER-001's reproductions, my own reading of the full diff and a fresh product gate. `main` had not moved since the executor's base, so no integration was needed. The new test file `packages/skeleton/test/baseline.test.ts` was untracked, so the earlier gate identity did not key it. I staged it and ran a fresh `npm test -- --review` at the identity that now keys it. Two seams the composition must carry are recorded with a follow-up, not failed (D013): receipt 036's class-source duty, which no record discharges, and the per-run waiver that operator-review assumption 2 promises. The untracked-source gate gap recurred, and D014 reopens WO-173-D018 with that observation.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 86356 tokens; handoff 17676808 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-180 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage 9d7cdc00-a709-44e8-a440-e14cdc58aec7`. The entry sample was observed at 2026-10-01T11:45:06.058Z and the handoff sample at 2026-10-01T11:59:27.719Z (109 steps, 100 commands), before this report was filed. Both are cumulative transcript counters; 17,372,538 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. The largest wall-clock cost was the fresh product gate (391.94 s). Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted worktree over base `276db3e18406fc3c7a4aea7dabb4b9a0837255b0`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-180/VER-001.md) passed, and no repair followed. The report hashes to the control log's `reportHash` (`23ab1478…`). Between VER-001's checkpoint `refs/dotln/checkpoint/WO-180/4` and this dispatch's `/5`, only the control log, `current.md` and the work-order index changed. A temporary-index comparison of the whole worktree, untracked files included, against `/5` shows the same three files.

No ideation breakout receipt applies. The evidence folder holds none. The control log records no scope expansion or amendment, and the order's only diff is its version heading. The planning receipt that judged the order at filing is covered under [Catalog-row duties](#catalog-row-duties).

Integration. `git ls-remote origin refs/heads/main` and the local `main` both name `276db3e1`, the executor's base, so `worktree integrate` had nothing to merge and was not run. The newest release tag on `origin` is `v0.59.0`, so the `v0.60.0` target and skeleton 0.48.0 do not collide. The paired WO-176 worktree is also at `276db3e1` and unmerged.

I reviewed:
- the order, its cited sources (product 03 §VerificationAdapter, product 06's vertical, WO-123's objective), product 07 §Goal-aligned decisions and product 08 §PRs and commits;
- the handoff, the evidence README, `fixture.mjs`, both current live receipts, and D001–D012;
- the full diff:
  - the protocol's story, witness, context and comparison types, `createBaselineWitness`, `validateBaselineWitness`, `validateBaselineContext`, `compareBaseline`, `baselineDisposition`, and their wiring into `parseEvidenceResult`, `evidenceResultSchema`, `validateTransportRequest` and `transportPrompt`;
  - the reactor's `VerificationOpened` check, `BaselineWitnessed` fold, baseline dispatch naming, the result branch and its `attention` hold;
  - the host's recovery branch, `persistNext`'s stop and the `drainContinuation` loop;
  - the matrix projection and the worker store's saved-receipt context;
  - the new `baseline.test.ts` cases;
  - the two fixture repairs (`test-evidence-sources.mjs`, `test-worktree-integration.mjs`) and the generated harness, edition, console and publication-lock changes.

The diff matches the order's design. The host, not the actor, derives every outcome: a baseline actor result has exactly three fields (`kind`, `envelope`, `subjectRevision`), and `validateBaselineWitness` rebuilds the witness from the story, the capsule and the episode wherever it is checked (the fold, `baselineDisposition` and the comparison context). All rows on a snapshot subject are host-run live tests, because the compiler refuses snapshot evidence without a host-run test (`packages/compiler/src/verification.ts`, "snapshot evidence requires a host-run test"). So `baselineWitnessRows` labels only rows that are what the labels say. `drainContinuation` changes from one emission to a loop because a baseline result chains `BaselineWitnessed` before the ordinary result continuation; the unchanged legacy verification suites passed in this review's gate.

Clean-room screen: I searched the tracked diff, every untracked file including VER-001, and then this review's own files for user paths, account identities, private hosts, URLs and secret shapes. Only public registry and project URLs in the lockfile pins and the gitmoji catalog link appear. No new lint or type suppression appears in the source, test or fixture.

## Criteria

**Criterion 1:** met, on VER-001's reproduction and this review's gate. The `WO-180 AC1` case commits WO-056's planted `left + Math.abs(right)` as the base. The `AC-signed/contract` row fails with exit 1, labelled `subject: baseline`, `origin: host`, `source: live`, and `BaselineWitnessed` reads `reproduced`. The repaired candidate completes with every row verified and `baselineFindings: []`, and both streams replay to identical state. The eight baseline cases carry the `[document]` tag, so the document gate's `skeleton-docs` suite runs them; it passed in this review (see Executed checks).

**Criterion 2:** met. The `passing` variant records `not-reproduced` with `AC-signed/contract: expected exit 1; observed exit 0.`. The composition double returns `BaselineNotReproduced` naming `story-signed-addition` with no implementation dispatch. A story classed `new` records `walked` and continues. The composition is a double of WO-123's sequence, as the criterion asks.

**Criterion 3:** met. The `WO-180 AC3` case refuses a baseline actor result carrying `rows`, `baseline` or `outcome` with `episode result shape`, the same closed-shape admission that keeps host-run rows out of actor results today. A forged `BaselineWitnessed` with `actorId: implementer` is ignored and the following continuation fails replay. VER-001's probes extended this to verifier and repair results.

**Criterion 4:** met. `codex-live-004.json` (Codex CLI 0.159.2, launch `gpt-6.1-sol`/`max`) and `claude-live-004.json` (Claude Code 2.1.286, launch `claude-opus-5-5`/`xhigh`) both have `status: passed`, `pendingRow: null` and `BaselineWitnessed` reading `reproduced`. Their rows are `host-test:0` (pass, exit 0) and `host-test:1` (fail, exit 1), labelled baseline, host and live, and each candidate comparison is `complete` with no finding. I recomputed the seven runtime source hashes in each receipt: 7 of 7 match the current bytes in both. Each records its confinement: actor tools and network disabled and macOS `sandbox-exec` test confinement, and for Codex an isolated home removed with the user configuration and trust table unchanged.

**Criterion 5:** met. Product 03 §VerificationAdapter's Baseline-first sentence is replaced in place: the file grows from 173,848 to 173,954 bytes (+106), and VER-001 measured the new sentence at 351 bytes, within 400. `decisions.md` holds D001–D014, and the decisions index lists them. WO-123's catalog row reads `WO-180: hard (unmet) — the baseline witness episode the composition sequences before the change`, which names the step; D004 records why the executor kept the existing text.

**Criterion 6:** met. This review's `npm test -- --review` passed 37 of 37 at the identity that keys the new test file (see Executed checks). `npm run test:docs` passes, `git diff --check` is clean, and the manifests change only skeleton 0.47.2 to 0.48.0 and the console's exact pin, so no dependency was added.

## Catalog-row duties

The order's row in `docs/planning/work-order-map.md` carries receipt 036's known issue: before WO-061's StoryContract lands, the executor "treats a contract that names a failing behavior as a defect story and records the class source; a defect story recorded as `walked` reopens it". No WO-180 record mentions it, and VER-001 did not judge it. In the landed primitive, the class is a caller input: `BaselineStory.kind` is `new` or `defect`, `BaselineWitnessed` records it, and nothing reads a contract or records where the class came from. By construction a `defect` story never records `walked`, so the receipt's reopening condition cannot occur inside this primitive. The hazard moves to the caller, which can pass `new` and skip the stop. The criteria do not require the duty, and the contract reader belongs to the composition, so I pass and board it in D013 with operator-review assumption 2's waiver, which also has no carrier.

## Register

`npm run plan -- followups --touching` returned 12 pending rows.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-f12a1f894923b2b2 | `reactor.ts` | kept open, observation added | Its seam occurred again: WO-180 opened `reactor.ts` and paid two live feedback audits (D007, D009). The executor neither took the three items nor recorded them as left. The row was already open for planning after WO-066 met the same seam. |
| FUP-005a8af5234cb3f3 | `verification-protocol.ts` | left | The condition needs two of the five protocol files; WO-180 touches only `verification-protocol.ts`. |
| FUP-5d191eb1b77b3431 | `reactor.ts` | left | None of its four conditions occurred: both live workers ran, no revocation event type was added, the candidate verifier was a double and no stored stream failed. |
| FUP-3a0ac2cbb53c255e | `reactor.ts` | left | No planning pass accepted the re-keying. |
| FUP-757da8687d847eab | `verification-protocol.ts` | left | The change adds the `baselineFindings` schema beside the evaluation `claimType` enum and leaves the enum as it was. |
| FUP-dc1335f4d10f6a75, FUP-b7a66e7a4fa7ad20 | `test-worktree-integration.mjs` | left | The fixture edit adds dependency links; the overlay, release preparation, the integrate helper and the history check are untouched. |
| FUP-adf6621e7f958dd8 | authority copies, product 03 | left | `scripts/authority-evidence.mjs` is untouched. Repeated authority copies are 6,876,996 of 161.2 MB of tracked and new evidence bytes, 4.27%, below 10%. |
| FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb, FUP-e55e258d37cb3f20, FUP-fd05316b6030ef73 | generated, evidence or product files | left | Textual matches; the meter's prune writer, usage attribution, follow-up tooling and the writer text are untouched. |

The first listing ran at register revision `34d8e443…`. `npm run meta` then synced D013 (a new untriaged row carrying its follow-up) and D014 (a fifth source revision on FUP-7629e03c6573f5cb, which stays needs-review), giving `5692642b…`. One `npm run plan -- followups --apply` batch against that revision kept FUP-f12a1f894923b2b2 open with this review's observation and produced `a9ae11fa…`. I then corrected two phrases in D013's rationale and D014's observation; `npm run meta` resynced the register to `eaa7d248…`, so FUP-7629e03c6573f5cb carries a sixth source revision with the corrected text and stays needs-review. The other rows only matched a path by text and stay as they are.

## Executed checks

- Final product row: `npm test -- --review`, recorded 2026-10-01T11:57:34.019Z, after staging `packages/skeleton/test/baseline.test.ts`.
  - 37 passed, 0 failed, 391.94 s, 81 fresh tasks.
  - Code identity `a78509b50bffcc24eef4d41b09bd98e92ad0410b973db95e46251e3fe4111a6e`; `gateCodeIdentity` recomputed after the gate gives the same value.
  - The row covers `skeleton` (336.26 s), `worktree-integration` (274.07 s), `evidence-sources` (59.18 s), `browser-evidence` (19.19 s), `console` (17.63 s), `kernel`, `compiler` and the edition and release suites. The two adjacent fixture repairs (D010, D012) hold in it.
  - A second `npm test -- --review` found that row and started no suite.
- `npm run test:docs`: 24 passed, 0 failed, 36.14 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md, D013 and D014 in place; `skeleton-docs` passed in 16.42 s. The result transition runs it again inline.
- `node --test packages/skeleton/dist/test/baseline.test.js` on the output the gate built: the eight baseline cases, 8 of 8, 3.99 s.
- `npm run meta`, twice: synced D013 and D014 into the decisions index and the register; health line `no observed budget breach; … 1 reopen candidates` (WO-150-D003, as at WO-175's close).
- `npm run plan -- followups --apply`: one row, register `5692642b…` to `a9ae11fa…`.
- `npm run release -- prepare`, twice: the `v0.60.0` target remains current against origin's tags. The second run, after the last decision edit, refreshed the meter snapshot (4,151 bytes) and the PR's meter block.
- `npm run test:docs` again after those edits: 24 passed, 0 failed, 37.38 s.
- Receipt check: SHA-256 of the seven runtime sources named by `codex-live-004.json` and `claude-live-004.json`, 7 of 7 matching in each.
- Subject check: a temporary-index diff of the whole worktree against `refs/dotln/checkpoint/WO-180/5` names only `current.md`, the control log and the work-order index.
- `git diff --check` and `git diff --cached --check`: clean.

## Judgment and publication

D013 and D014 compare their choices with the mission, all eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- Before a change, the host records whether the base reproduces the named defect, and a non-reproducing defect story stops with a typed result that names it.
- A later candidate verification cannot pass a criterion whose named test did not fail on the base, and the actor cannot supply or alter the baseline rows.
- The cost was one current live baseline row per harness (15.47 s and 6.13 s, D009), two live feedback audits after judged-source changes (D007, D009) and this review's product gate.

No efficiency gain is claimed. The tradeoff: I spent one fresh product gate (391.94 s) so that the publication-bound row keys the new test file. I relied on VER-001's 22 probes and receipt replay, and repeated only the source-hash check and the focused baseline cases.

Reviewed PR title: `:test_tube: Reproduce the defect on the base before any change, so a repair cannot pass on a test that never failed`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to adding a failing test. The change's main purpose is to witness the named test failing before the change. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-180` and opening its PR. The helper supplies the post-merge release-close handoff.
