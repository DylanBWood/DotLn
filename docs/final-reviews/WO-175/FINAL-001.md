# WO-175 — FINAL-001

**Verdict:** pass. All eleven criteria are met against the original order, on VER-001's reproductions and this review's fresh product gate. `main` had not moved since the executor's base, so no integration was needed. The new module `scripts/lib/planning-conditions.mjs` was untracked, so the earlier gate identity did not key it. I staged it and ran a fresh `npm test -- --review` at the identity that now keys it. At close this review settles ER4-003, ER4-004 and ER4-007, as `close-register.md` specifies. The order's catalog row carries the planning pass's weighing of receipt 035. One direction there was implemented the other way: `plan start` measures the timing rows at entry. One reopening observation it names cannot be judged from the record. Both are recorded with follow-ups (D015, D016), not failed. The untracked-source gap recurred, and D017 reopens WO-173-D018 with that observation.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 85804 tokens; handoff 16092809 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-175 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage`. The entry cutoff is 2026-10-01T00:30:06.046Z and the handoff sample is 2026-10-01T00:52:07.355Z (101 steps, 90 commands), before this report was filed. Both are cumulative transcript counters; 15,788,899 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. The largest wall-clock cost was the fresh product gate (829.36 s). Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject and evidence

The verified subject is the uncommitted worktree over base `60eeecdccc3f3717da492a7416435d2227639bc5`. The numbered verification sequence is complete: [VER-001](../../verifications/WO-175/VER-001.md) passed, and no repair followed. The report hashes to the control log's `reportHash` (`38ad0d15…`). Between VER-001's checkpoint `refs/dotln/checkpoint/WO-175/4` and this dispatch's `/5`, only the control log, `current.md` and the work-order index changed.

No ideation breakout receipt applies. The evidence folder holds none. The control log records no scope expansion or amendment, and the order's only diff is its version heading. The planning receipt that judged the order at filing is covered under [Catalog-row duties](#catalog-row-duties).

Integration. `git ls-remote origin refs/heads/main` and the local `main` both name `60eeecdc`, the executor's base, so `worktree integrate` had nothing to merge and was not run. The newest release tag on `origin` is `v0.58.1`, so the `v0.58.2` target and skeleton 0.47.1 do not collide. The paired WO-059 worktree is also at `60eeecdc` and unmerged.

I reviewed:
- the order, its cited sources, product 07 §Independent workflows and integration, and product 08 §PRs and commits;
- the handoff, `fixtures.md`, `checks.json`, `close-register.md`, the listing and meter captures, and D001–D014;
- the full diff:
  - the meter's declared metric names, the predicate evaluator, the read-time refusal and the health line;
  - the new conditions module, the `plan conditions` command and the `plan start` block;
  - the release list's root and cold-cache parameters and its main-module guard;
  - the entropy dispatch's temporary root, inventory, witness sentence, cleanup and launch scope;
  - the protocol's request field, validation and instruction sentence;
  - the new fixtures in `test-process-debt`, `test-entropy-review` and `test-plan-refutation`, and the release-close fixture's environment;
- the write-backs to the reviewer's guide, `followups.md` and product 07.

The diff matches the order's design. The meter's candidate list, its health line and the listing's predicate rows all read one evaluator, `evaluateDecisionConditions`, so they cannot disagree. The read-time refusal checks the operator and value shape before the metric name.

Clean-room screen: I searched the tracked diff, the new module, the evidence folder, VER-001 and this review's files. No user path, account identity, private host or secret shape appears. The one temporary-path example in D014 elides its host-specific prefix.

## Criteria

**Criterion 1:** met, on VER-001's reproduction. `predicate-reproduction.mjs --baseline` fails with `Missing expected exception` against the `feb7a92e` meter, which equals the base. Against the current source it prints the refusal naming `WO-999-D001` and `coldStartBytes.misspelled`. The integrated fixture passed in this review's gate (process-debt).

**Criterion 2:** met. At this review's tree, `node scripts/meta.mjs --check --json` exits 0 and lists `reopenCandidates: [WO-150-D003]`. Its `decisionConditions` row has values `[26903]` against `> 24576`, `holds: true`, `reopened: false`. The health line reads `1 reopen candidates`, equal to the list's length. Budget rows carry `coldStartBytes.<role>` and `sequenceBytes`. VER-001 matched the meter's 43 declared order-metric names against the 43 observed. The real-meter fixture removes a holding predicate after a later `reopens` record; it passed in this review's gate.

**Criterion 3:** met, on VER-001's run and the executor's capture. The listing prints ten fixed rows plus the WO-150-D003 row, each with its source ids, value, threshold and holds, and the line `1 hold; 2 unknown. Not evaluated: 1177 decision conditions and 799 register rows.` It exits 0. The plan-check row cites FUP-fb8cbeabbddef397, with the two WO-156 rows as historical provenance; D003 records that reading against the register. The unresolved-source fixture refuses `WO-999-D404`. At this review's tree the listing exited 0 at 2026-10-01T00:49:33Z in 25.04 s, at load averages 13.32/11.00/8.58 on 16 CPUs. It printed `1 hold; 2 unknown. Not evaluated: 1180 decision conditions and 802 register rows.`; the counts grew by VER-001's three decisions and their register rows. Tracked status was the same before and after.

**Criterion 4:** met. VER-001 ran `plan start` from a clean `main` in a clone: the block sat between `failures` and `followups`, 227 bytes. The executor's capture is 228 bytes. The planning-refutation fixture asserts the unavailable form within 1 KB and passed in this review's gate. What the block measures at entry departs from the planning pass's direction; see D015.

**Criterion 5:** met. The default listing took 23.84 and 23.16 s for the executor and 23.13 s for VER-001, under 60 s. The two document-gate rows could not fit: `--slow` took 133.36 and 148.60 s. They sit behind `--slow`, as the criterion allows, and nothing else was cut. D010 records the time, host load and each row's value on the day.

**Criterion 6:** met, on VER-001's reproduction and the committed fixture. Fake-transport review and refutation launches each wrote the `TMPDIR` they received: the sibling `tmp`, inside the scratch parent and outside `repo/`. The fixture asserts both received values and the review prompt's instruction. VER-001 showed the refutation prompt's instruction by reproduction; D012 boards the missing fixture assertion and the run-on join. Real transports spawn synchronously inside `dispatch` and pass `process.env`, so they receive the value too. D013 boards the side effect: host temporaries are created in that directory during the launch.

**Criterion 7:** met. New receipts record `temporaryDirectory {observed, count, bytes, sha256}`, and the witness says `Episode temporary directory: N path(s), B bytes.` only when the field exists. VER-001 filed receipts in a clone with 2 paths and 278 bytes, and 2 paths and 275 bytes. In the worktree, `npm run entropy -- check` returns `status: ok` over seven mechanism receipts and two pre-mechanism receipts. That check compares each stored receipt with its re-rendering byte for byte.

**Criterion 8:** met, on VER-001's reproduction. Filing removed scratch parents that held read-only directories. An immutable file forced a real removal failure: `entropy receipt` exited 0, filed the receipt, and printed one line naming the parent. The fixture covers both paths. It runs in the `plan-refutation` suite, which declares the entropy sources, and passed in this review's gate.

**Criterion 9:** met, on the executor's transcript and VER-001's reproduction. From a frozen copy made by the dispatch, with its sibling `TMPDIR`, the portfolio suite passed 3 of 3. With the root nested in a checkout it failed 2 of 3, as REVIEW-004 recorded. No live episode ran. The capability claim stays at fixture level until the next `planning: entropy reducer` receipt.

**Criterion 10:** met. The write-backs are present in the reviewer's guide (§What the reviewer may run), `followups.md` (one sentence naming the command) and product 07's planning procedure (one sentence, under 200 bytes). `decisions.md` holds D001–D017, and the decisions index lists them. This review retargets ER4-003, ER4-004 and ER4-007 at close; see Register.

**Criterion 11:** met. `npm test -- --review` passed fresh at this review's tree: 41 suites, 0 failed, 85 fresh tasks, 0 reused, 829,363 ms, recorded 2026-10-01T00:48:51.755Z. Its code identity `a560289d…` keys the staged module (D017). `npm run test:docs` passes with this report in place, and completion runs it again inline. The edition and console-pin suites passed in the gate. `git diff --check` is clean. Root `package.json` is unchanged; the lockfile changes only the skeleton version and the console's pin of it, so no dependency was added.

## Catalog-row duties

The order's row in the [work-order map](../../planning/work-order-map.md) carries receipt 035's nine known issues, weighed in the [planning document](../../planning/entropy-review-004-2026-09-30.md) §11 without editing the order. Neither the executor nor VER-001 judged them. The order's criteria do not contain them, so none fails this review.

- **Timing rows at entry, implemented the other way ([D015](../../evidence/WO-175/decisions.md#wo-175-d015)).** The pass directed that `plan start` run the rows that are not timings and print the timing rows as not measured at entry. `conditionsAtStart` runs the whole default table instead, including twelve timed probe runs, before the branch exists: 22.2 s in the executor's capture and 24.4 s in VER-001's clone. No decision records the choice. I keep it, because it is a fresh count and not the stored count the direction guarded against, and I route the question to the planner.
- **Re-mint cost not recorded ([D016](../../evidence/WO-175/decisions.md#wo-175-d016)).** The pass named "the recorded re-mint cost exceeds the 384 s the order cites" as a reopening observation. Only the live audit's 61.8 s is recorded. The deterministic re-mints and the self-host re-pin were not timed, so the observation is unknown.

The other seven are met or not triggered:
- **No blocked outcome named.** Operator flow, as planned.
- **Refusal where the title says "absent".** The refusal is at read time. The health line is what becomes computed or absent, and it is.
- **One metric, two verdicts.** WO-150-D003 is listed. Its reopening observation is two consecutive planning entries that list it undisposed. The block is not merged, so no real planning entry has printed it yet; VER-001's run was a drill in a clone.
- **Hand-kept table.** By design.
- **Rows behind a flag read as complete.** The two `--slow` rows appear by name as `unknown (not measured; use --slow)`, and the count line says `2 unknown`. The summary line itself does not name them; I judge the intent met by the named rows.
- **Inventory of one directory.** The witness sentence names each place observed: tracked status, the untracked listing, the copy's inventory and the temporary directory. It also says ignored paths and contents are not observed.
- **No live row at close.** Stated in the order and the reviewer's guide.

## Findings and follow-up dispositions

**From VER-001, accepted as boarded.** D012 is the instruction's run-on join and the missing refutation assertion. D013 is the host temporaries inside the worker's directory during the launch. D014 is the runner-fixtures teardown race, which reopened WO-157-D016. I agree with each disposition and its route. D012 and D013 are low severity and would re-mint five editions or edit `worker-transport.ts`, which the order cites read-only. D014 is outside this order's files. In this review's gate `runner-fixtures` passed (21.46 s), so D014's race did not recur here.

**Reopened ([D017](../../evidence/WO-175/decisions.md#wo-175-d017)).** The executor's row and VER-001's rerun were keyed at `e15fa662…` while `scripts/lib/planning-conditions.mjs` was untracked. Staging it changes the identity to `a560289d…`. WO-174-D023 reported the same gap one order earlier. Both rows ran fresh, so nothing was wrongly reused. D017's `reopens` object adds this observation to FUP-7629e03c6573f5cb.

**Register.** One `npm run plan -- followups --apply` batch applied the close disposition `close-register.md` specifies. It ran against register revision `00166e0d…`, which this review read after `npm run meta` synced D015–D017, and produced `504c81ce…`. ER4-003 (FUP-a7461ebe9627663d), ER4-004 (FUP-72adcb05563bb99b) and ER4-007 (FUP-ae897de944b750d6) are settled with no targets, and each keeps its reopening condition. ER4-007's reason states its evidence level: fake-transport launches, the receipt inventory, read-only cleanup and the frozen-copy portfolio run. It names the next `planning: entropy reducer` receipt as the first live row and says the Codex sandbox gains no grant. The 29 rows the listing names after the sync include D015 and D016.

`npm run plan -- followups --touching --work-order WO-175` listed 27 pending rows by textual match. Two are VER-001's own rows (D012, D013), untriaged for the planner. One recurred and is reopened above. The rest are left:

| Row | Matched | Disposition | Why |
| --- | --- | --- | --- |
| FUP-7629e03c6573f5cb | runner | reopened (D017) | Its observation occurred again, above. |
| FUP-fb8cbeabbddef397 (ER4-005) | runner, plan, product 07 | left open | The listing now measures its three thresholds. The document gate holds (36.0 s executor, 41.5 s VER-001, against 30 s); it was already open for diagnosis (WO-174-D012). |
| FUP-f1c7a256bec46737 | product 07 | left open | The cold-start ceiling. WO-150-D003, now listed, is the pass's to dispose. |
| FUP-005a8af5234cb3f3 | protocol | left | Its trigger is an order that pays a live audit and touches two of the five protocol files; this order touches one. |
| FUP-adf6621e7f958dd8 (ER4-006) | authority edition | left | `scripts/authority-evidence.mjs` is untouched. One 50,410-byte copy leaves repeated copies near 3.4% of 158.5 MB of tracked evidence, far from 10%. |
| FUP-dc6c139003bd4b89, FUP-fa028783f3f6b17f, FUP-9cb0a7e667913624, FUP-b3454d6ce3594ef3 | `meta.mjs` | left | The snapshot writer, release preparation, correction counting and the operator-step reader are untouched. The meter edits are the evaluator, the refusal and the health line. |
| FUP-b7a66e7a4fa7ad20, FUP-e2cf2122a642d1e0, FUP-8cfd3ff52146a016, FUP-dc1335f4d10f6a75 | `release.mjs` | left | The edit adds a root and a cold-cache option to the release list and guards the entry. Release preparation, the history check, `manifestWorkOrders`, the close and the integration fixture are untouched. |
| FUP-e55e258d37cb3f20, FUP-50a41e39f51a3e01 | `refute-plan.mjs` | left | The first is a non-goal row that keeps its route. The second concerns the goal standard, which is untouched. |
| FUP-e821aa2ced3aa111, FUP-e34029d1192ce82e, FUP-439252e49f6381fc | runner | left | The runner edit adds the new module to two suites' declared sources; TAP, the guard-fault question and the preflight sentence are untouched. |
| FUP-dc58e92c5cafc732 | plan-refutation test | left | The fixture gains the conditions field; continuation context is untouched. |
| FUP-50cda1c03ecd8ea8, FUP-1615e610542d4e33, FUP-b28b870422a74166, FUP-acfe4bfda716d8fb | evidence or control files | left | Textual matches on generated or evidence files. |
| FUP-56b599e15f97e666, FUP-fd05316b6030ef73 | product 07, READMEs | left | `resident-state.ts` and the writer text are untouched. |

Process meter (`npm run meta`, advisory): no observed budget breach and 1 reopen candidate, WO-150-D003, as criterion 2 expects. `guardRefusals` is 9 for this order, reported as insufficient evidence of worsening.

## Executed checks

- Final product row: `npm test -- --review`, recorded 2026-10-01T00:48:51.755Z.
  - 41 passed, 0 failed, 829,363 ms, 85 fresh tasks, 0 reused.
  - Code identity `a560289d26fd23b33436d47900de56907ff5b3081c8dfd09cffa36acb68061bc`, tree `71258ae6…`.
  - `gateCodeIdentity` recomputed after the gate gives the same identity.
  - The row covers `plan-refutation` with the entropy fixtures (67.21 s), `process-debt` (100.56 s), `meta`, `runner-fixtures`, `evidence-sources` (58.75 s), the four edition suites, `console`, `portfolio`, `skeleton` (343.48 s) and `worktree-integration` (302.61 s).
- `node scripts/meta.mjs --check --json`: exit 0, WO-150-D003 listed, health line `1 reopen candidates`.
- `npm run plan -- conditions`: exit 0, 25.04 s, 1 hold and 2 unknown, tracked status unchanged.
- `npm run entropy -- check`: `ok`.
- `npm run release -- prepare`: the `v0.58.2` target remains current against origin's tags. It refreshed the meter snapshot (4,050 bytes) and the PR's meter block.
- `npm run plan -- followups --apply`: three rows settled, register revision `504c81ce…`.
- `npm run test:docs`: the first run failed its `release-surfaces` preflight because my release notes wrote `coldStartBytes.` followed by a bracketed role name, which the notes profile reads as raw HTML. After rewording, it passed 24 of 24 in 38.37 s with this report, the decisions and the register batch in place. Completion runs it again inline.
- `git diff --check` and `git diff --cached --check`: clean.
- My hash and checkpoint-diff checks pass.

## Judgment and publication

D015–D017 compare their choices with the mission, all eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- A planning pass opens with a fresh count of named thresholds that hold, and the listing shows every value and why any is unknown. The one predicate that held unseen is now listed.
- The meter's count is computed or visibly unavailable.
- A review's temporary files go to a directory its receipt inventories and its filing removes, past read-only leftovers. The portfolio suite that failed in REVIEW-004 passes from a dispatched copy.
- The cost is about 23 s per listing and 22 to 24 s per planning entry. One live audit of 61.8 s and USD 1.49 paid for the instruction sentence.

No efficiency gain is claimed. The tradeoff: I spent one fresh product gate (829 s) so that the publication-bound row keys the new module. I relied on VER-001's drills and did not repeat them.

Reviewed PR title: `:chart_with_upwards_trend: Report crossed reopening thresholds when a planning pass opens, so reviews stop finding them by hand`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to adding or updating analytics or tracking code. The change's main purpose is to measure recorded thresholds and report them. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-175` and opening its PR. The helper supplies the post-merge release-close handoff.
