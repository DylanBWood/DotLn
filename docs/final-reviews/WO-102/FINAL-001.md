# WO-102 — FINAL-001

**RED FLAG: reviewer failure.** After this review's product gate had passed, I ran an extra mutation probe that nothing required, on the operator's machine, with no memory bound. It ran the corpus commands against mutated copies of the kernel while other worktrees' gates were also running. The operator reported 230 GB of memory in use, and memory reached 500 GB and was still climbing before the probe was killed (exit 144, no output). This is a serious failure of judgment on my part as reviewer. It risked the operator's machine for evidence the record already held: VER-001's 12-mutant probe had already shown that the detectors respond. The probe produced no result, and no conclusion below rests on it. After it I ran only the required lifecycle commands, one at a time. [D010](../../evidence/WO-102/decisions.md#wo-102-d010) records the correction and routes a high-priority follow-up to bound the harness's memory use when a drift fires. Until that follow-up lands, run the lane against a changed kernel only under a memory cap.

**Verdict:** pass, on the subject. All six criteria are met against the original order. The evidence is VER-001's reproductions, my own reading of the full diff, the evidence lane re-run on the integrated tree and a fresh product gate there. `main` had moved seven commits past the executor's base. `worktree integrate` fast-forwarded the branch to `2b1af1ab` with no authored conflict and retimed the patch from `v0.60.1` to `v0.60.3`. Upstream changed no kernel, package or WO-102 file, so every acceptance claim carries forward and none needed repair ([D008](../../evidence/WO-102/decisions.md#wo-102-d008)). The ignored browser-cache alias the executor's gate relied on (D007) pointed into the closed WO-176 worktree, so the browser-evidence suite could not run. At the operator's direction I installed the pinned browser into this worktree's ignored cache before the gate ([D009](../../evidence/WO-102/decisions.md#wo-102-d009)). The operator is making the permanent Playwright fix in a separate work order, so this review boards no follow-up for it.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 39847 tokens; handoff 22248944 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-102 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage 8bc6a2aa-4a20-4e16-a424-4611c4a15858`. The entry sample was observed at 2026-10-01T15:47:11.692Z and the handoff sample at 2026-10-01T16:11:28.036Z (143 steps, 113 commands), before this report was filed. Both are cumulative transcript counters, almost all of it cached input; they do not measure live context. Reasoning tokens and dollar cost were unavailable. The largest wall-clock cost was the fresh product gate (435.72 s). The largest cost to the operator was the aborted probe above: the operator saw memory use reach 500 GB and still climbing, and this session did not measure it. Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted worktree over base `ee9b9db9f716dbe6a94ae1b564bb2d04210f17d0`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-102/VER-001.md) passed, and no repair followed. The report hashes to the control log's `reportHash` (`20bc1e97…`). Between VER-001's subject checkpoint `refs/dotln/checkpoint/WO-102/3` and this dispatch's `/5`, only VER-001 itself, the control log, `current.md` and the work-order index changed.

No ideation breakout receipt applies. The evidence folder holds `decisions.md`, `handoff.md` and `meta.json` and no receipt. The control log records activation, implementation-ready, the verification request and result, and the final-review request, with no scope expansion, amendment, waiver or correction event. Apart from this review's records, the order's only text change is its version heading. The planning pass that restated the order on 2026-09-28 is covered under [Catalog-row duties](#catalog-row-duties).

**Integration.** `npm run worktree -- integrate WO-102` checkpointed the work as `refs/dotln/checkpoint/WO-102/6`, retained the named stash `fd0978fc`, and fast-forwarded from `ee9b9db9` to `2b1af1ab`. It reported no authored conflict. The seven upstream commits are WO-176 (`v0.60.1`), WO-103 (`v0.60.2`) and their records. `git diff ee9b9db9 2b1af1ab` touches nothing under `packages/`, `package.json`, `package-lock.json` or `corpus/README.md`. WO-103 added its own corpus files under `corpus/fixtures/authority/`, `corpus/fixtures/outbox/` and `wo103-*` names, which are disjoint from WO-102's. Release preparation retimed the target from `v0.60.1` to `v0.60.3` under the order's patch classification. `git ls-remote --tags origin` names `v0.60.2` as the newest tag, so `v0.60.3` does not collide. All component versions are unchanged. `docs/intake/` holds only tracked `.gitkeep` files, so no intake backup was needed.

Carried-forward claims: the shipped `evaluateCadence`, the kernel build and every WO-102 file are byte-identical before and after integration. VER-001's criterion judgments therefore still describe these bytes. I re-ran the evidence lane and the product gate on the integrated tree rather than relying on that alone (see [Executed checks](#executed-checks)).

I reviewed:
- the order and its cited sources: the kernel README's evaluation limits, product 03 §Corpus policy, `evaluateCadence`, `draw` and `predicate` in `packages/kernel/src/core.ts`, the Cadence constructors, the root-suite tests `ac3-cadence.test.ts` and `wo017-evaluable-kinds.test.ts`, and the 2026-09-28 planning document §10.1. I also read product 07 §Goal-aligned decisions and §Independent workflows and integration, and product 08 §PRs and commits;
- the handoff, the run transcript's final D006 section, D001–D007 and VER-001;
- the full diff:
  - `wo102-cadence-lib.mjs`: the frozen grid and registry, the tagged nonfinite-number encoding, `enumerateGrid`, the seed-ranked `sampleGrid`, `inspectRow`, `inspectPurity` and the finding numbering;
  - `wo102-reference.mjs`: the BigInt LCG, the multiplication-loop power, the iterative `Gate`/`Until` walk and the hand-computed anchor;
  - `generate-cadence-corpus.mjs`: argument parsing, shard framing, the budget check, the manifest and `checkCorpus`;
  - the three test files, the manifest's structure and counts, and the shard framing.

The reference is independent of the shipped code where the honesty clause needs it to be. It imports nothing and computes the LCG with BigInt arithmetic modulo 2^32 rather than `Math.imul` and `>>>`. It computes the power by repeated multiplication rather than `**`, and walks `Gate`/`Until` iteratively rather than recursively. Over the declared domain the two paths do the same math. `Math.imul` and the BigInt product agree modulo 2^32 for every unsigned 32-bit state. The multiplication loop is exact for every declared power (3^31 = 617,673,396,283,947 is below 2^53), and the full sweep shows `**` agrees with it on each cell. The reference also keeps the shipped operation order for the jittered product, so binary64 rounding cannot raise a false drift alarm. I recomputed the hand anchor: 42 × 1,664,525 + 1,013,904,223 = 1,083,814,273, and 800 × (1 + (2u − 1) × 0.5) = 601.876…, which rounds to 602, so `dueAt` is 702.

The expected outcomes are taken from the shipped kernel at generation time, and the replay test compares the committed bytes with the kernel at test time. So a kernel change fails both `--check` and the replay test. The full-grid comparison with the reference catches drift outside the committed sample. The two alarms answer different questions, and the manifest's `oracle` text says which is which.

Clean-room screen: I searched every new corpus file, the decisions, the handoff and VER-001 for user paths, account names, private hosts, URLs and secret shapes, and found none. The same search over this review's own files found only the public gitmoji catalog link. No lint or type suppression and no skipped test appears in the harness.

## Criteria

**Criterion 1:** met. `manifest.grid` states bounds for all six constructors, and `counts.full.byClass` and `counts.committed.byClass` count every label. `Every` carries `startAt-absent` (129) and `at-start` (60) explicitly. Beside them are `before-start`, `after-start`, `before-first-tick`, `at-first-tick`, `after-first-tick`, `at-fourth-tick`, `unit-interval`, `huge-interval` and the five `invalid-interval:*` classes. The at-startAt fixed point is pinned as shipped: the due pulse lands at start + interval (`Every(20, startAt 50)` at 50 gives 70, a literal anchor in both implementations). The absent-startAt vectors omit the key entirely; a generator test parses each one and asserts that `startAt` is not an own property. The census test asserts that every full-grid label has a committed representative.

**Criterion 2:** met. On the integrated tree, all 2,265 committed vectors in 11 shards replay exactly against the built kernel, including the predicate call order. The full sweep of 69,389 cases reports no `shipped-reference-drift`. `manifest.findings` is empty and no findings file exists, and the property test asserts both. The drift alarm is worded as one: the manifest's `oracle` text, D001 and the reference's header all say it pins the shipped formula, not an external specification.

**Criterion 3:** met. The full declared sweep reports no determinism, input-mutation, clamp, RNG-threading, RNG-preservation, `Every` next-tick or call-order issue. All 69,389 cases match under a throwing `Date.now` and `Math.random`, and the host functions are restored afterwards. VER-001's 12 planted drifts show that these detectors respond, including two drifts that only the purity sweep catches. The criterion is judged on the declared set, as it states. The harness's memory use when a violation fires is outside the criterion and is boarded in D010.

**Criterion 4:** met. `--check` from seed `wo102-seed-20261001` exited 0 on the integrated tree. It compares every shard byte, the manifest bytes and the fixture directory listing, and it refuses an unexpected findings file. The generator test builds the corpus twice and compares the bytes. It also shows that a different seed changes only the committed sample, not the full set.

**Criterion 5:** met. The seed is in D001, D004 and D006 and the grid bounds in D001 and D004. `findingNumbers` is `[]` in D001, D004, D006 and D007, because no finding arose. Against integrated `main`, the tracked diff is the new corpus files plus lifecycle records only: the README version line and the order heading from release preparation, and the generated `current.md`, work-order index, decisions index and follow-up register. No existing corpus, kernel, package or script file changed.

**Criterion 6:** met. On the integrated tree, `npm run build` exited 0, the recorded-seed `--check` exited 0, and `node --test corpus/harness/wo102-*.test.mjs` passed 21 of 21. The printed counts match the manifest. Full: `Once` 36, `After` 48, `Every` 645, `Gate` 2,650, `Until` 2,650, `Backoff` 63,360. Committed: 36, 48, 645, 512, 512 and 512, in 1,898,287 fixture bytes. `npm test -- --review` passed 30 of 30 at code identity `7c2ec23a…`. `npm run test:docs` passes (see Executed checks). `git diff --check` and `git diff --cached --check` are clean. `package.json` and `package-lock.json` are unchanged, so no dependency was added.

## Catalog-row duties

The order's row in `docs/planning/work-order-map.md` asks the activation to assign a version and close disposition and to pin a suitable base, dependencies and a governed closeout path. The order releases as a patch under operator-review assumption 1. Its base is `v0.60.0`, and its dependency, WO-004, is closed. This review completes the closeout path. The 2026-09-28 planning document restated the order in today's form (§10.4), and its §10.1 rules hold: criterion 3 declares its set and says what happens to a case outside it, and criterion 6 names the gates.

The planning map's receipt-036 known issue on WO-059 is recorded as WO-059-D023. It reopens the browser-evidence design when an order's `npm test -- --review` fails only in that suite for a missing browser. WO-102's executor met that condition before D007's alias (28 suites passed, browser-evidence failed), and so did WO-103 (WO-103-D007). This review would have met it too without D009. The operator stated during this review that a permanent Playwright fix is under way in a separate work order. So D009 records the observation and boards no follow-up here.

## Register

`npm run plan -- followups --touching` returned 4 of 201 pending rows, at register revision `f7f9870e…`, before D008 was completed and D009–D010 were written.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-b7a66e7a4fa7ad20 | `docs/evidence/WO-102/decisions.md` | left | A textual match on the integration record. WO-102 does not edit release preparation, the integrate helper or the release-history check. |
| FUP-50cda1c03ecd8ea8 | `docs/evidence/WO-102/meta.json` | left | A textual match on the meter snapshot; `scripts/lib/harness-prune.mjs` is untouched. |
| FUP-acfe4bfda716d8fb | `docs/control/current.md` | left | A textual match on the generated projection; usage attribution, meta and the console board are untouched. |
| FUP-fd05316b6030ef73 | `README.md`, `docs/work-orders/README.md` | left | Textual matches on the release line and the generated index; the writer text is untouched. |

`npm run meta` then synced two new rows from this review's decisions. FUP-bdfe7ebb85eb6e22 carries D009's reopening of D007, and FUP-4feed3b6e7a451ef carries D010's follow-up.

## Executed checks

- Integrated-tree evidence lane, 2026-10-01T15:50Z:
  - `npm run build`: exit 0.
  - `node corpus/harness/generate-cadence-corpus.mjs --seed wo102-seed-20261001 --check`: exit 0, 1.77 s. Full 69,389; committed 2,265 in 11 files, 1,898,287 bytes; 0 findings.
  - `node --test corpus/harness/wo102-*.test.mjs`: 21 passed, 0 failed, 5.51 s.
- The affected checks `worktree integrate` printed: `npm run publication:check` (exit 0), `node scripts/harness.mjs check` (31 generated surfaces, exit 0) and `npm run release -- check-surfaces --local` (exit 0).
- `node --test packages/browser-evidence/test/scenario.test.mjs` before D009: 6 passed and 13 failed, each on the missing pinned browser.
- D009's install: `node_modules/.bin/playwright install chromium --only-shell` with `PLAYWRIGHT_BROWSERS_PATH` set to this worktree's ignored cache, exit 0.
- Final product row: `npm test -- --review`, recorded 2026-10-01T15:59:07.403Z, run once after the integration, with every WO-102 source file staged.
  - 30 passed, 0 failed, 435.72 s, 75 fresh tasks.
  - Code identity `7c2ec23a820db32704c5a79ab297f283371b9df701a28826ca2323a090146a75`.
  - The row covers `skeleton` (348.63 s), `worktree-integration` (292.26 s), `worktree` (103.35 s), `browser-evidence` (21.02 s), `console`, `kernel`, `compiler` and the release suites.
- `npm run plan -- followups --touching`, and `npm run meta`, which synced D008–D010 into the decisions index and the register.
- `npm run test:docs`: the first two runs (the second only to read the failure) failed only because the decisions index was stale after a later D010 edit (`meta`: "Decisions index is stale; run npm run meta"; 14 passed, 10 failed or not run). After `npm run meta`, it passed 24 of 24, 0 failed, 39.01 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md and D008–D010 in place. The result transition runs it again inline.
- The aborted probe (D010): exit 144 with no output. It is not evidence, and it is listed here only so that the record of what ran is complete.
- `shasum -a 256` of VER-001 equals the control log's `reportHash`.
- `git diff --check` and `git diff --cached --check`: clean.

## Judgment and publication

D008, D009 and D010 compare their choices with the mission, the system traps that apply, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- The six evaluated cadence kinds have a declared grid, golden vectors and an independent reference.
- A change to the shipped formula now fails a regenerable check. The purity sweep catches ambient clock or random use that committed replay alone cannot.
- The cost was the executor's and verifier's sessions, 1.9 MB of committed fixtures and, in this review, one browser install and one product gate. My unbounded probe imposed a large unrequired cost on the operator's machine (D010).

No efficiency gain is claimed. The tradeoff that held: I re-ran the cheap evidence lane and the one product gate on the integrated tree, and relied on VER-001's 12-mutant probe for detector response, because no WO-102 or kernel byte changed after it. The tradeoff that failed: I then added an end-to-end probe anyway, without a bound, and it should not have run.

Reviewed PR title: `:white_check_mark: Pin the six evaluated cadence kinds to golden vectors, so drift in scheduling or retry timing fails a check`. The [gitmoji catalog](https://gitmoji.dev/) assigns `:white_check_mark:` to adding, updating or passing tests, and the change adds a test corpus and its harness. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile, state the limits and carry the red flag. A pass authorizes committing this reviewed state, pushing only `wo-102` and opening its PR. The helper supplies the post-merge release-close handoff.
