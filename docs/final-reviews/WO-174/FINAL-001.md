# WO-174 — FINAL-001

**Verdict:** pass. All nine criteria are met against the original order. This review integrated main's WO-058 (`e4426d28`) by fast-forward with no authored conflict. It staged the two new runner modules, which the earlier gate identities did not key, and ran a fresh product gate on the integrated tree. That gate passed with zero excluded reads in each guarded package. At close it settles ER4-001 for the package suites and ER4-002, as `close-register.md` specifies. It boards four items and reopens one deferred row. Two duties the planning passes put on the order's catalog row were not discharged by the executor, and one direction was implemented the other way. Each is recorded with a follow-up (D019–D023), not failed.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 134335 tokens; handoff 21858755 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-174 and allocated this path. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage`. The entry cutoff is 2026-09-30T20:51:09.201Z and the handoff sample is 2026-09-30T21:06:14.773Z, before this report was filed. Both are cumulative transcript counters; 21,533,544 of the handoff total is cached input. Reasoning tokens and dollar cost were unavailable. Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject, integration and evidence

The verified subject is the uncommitted worktree over base `dd141ad16dbd60e39ffb5afab21df57689cf4b79`. The numbered verification sequence is complete:
- [VER-001](../../verifications/WO-174/VER-001.md) failed on F1: a tracked consumer of a removed fixture export.
- A `resume: fix` repair followed.
- [VER-002](../../verifications/WO-174/VER-002.md) passed.

Both reports hash to the `reportHash` in the control log (`8424e4a7…` and `082a7e06…`). Between VER-002's subject checkpoint `refs/dotln/checkpoint/WO-174/7` and this dispatch's checkpoint `/9`, only four files changed: VER-002 itself, the control log, `current.md` and the work-order index.

No ideation breakout receipt applies. The evidence folder holds none. The control log records no scope expansion or amendment, and the order's only diff is its version heading. The planning receipts that judged the order at filing are covered under [Catalog-row duties](#catalog-row-duties).

Integration. Fetched main was `e4426d28` (WO-058 merged, v0.58.0). `npm run worktree -- integrate WO-174` ran with these results:
- It checkpointed `/10` and kept stash `a6893036…`.
- It fast-forwarded and re-applied the stash with no authored conflict.
- It regenerated the projections. The console fixture regeneration changed no byte.

Main changed no file under `scripts/` and no file this order edits. `git diff refs/dotln/checkpoint/WO-174/7` is empty at the integrated tree for these paths:
- the runner, its fixture test, the read guard, the closure check and the console fixture generator;
- `scripts/harness.mjs` and `scripts/test-harness.mjs`;
- the kernel and console tests;
- `gate-evidence.mjs`.

Main did add `verification-witness` tests to compiler and skeleton, which now run under the guard, and it edited product 02's verification section. The v0.58.1 target stays current above v0.58.0, and no component version collides. [D018](../../evidence/WO-174/decisions.md#wo-174-d018) records the bases, the carried-forward claims and the affected checks.

I reviewed:
- the order, its cited runner, reuse, identity and inventory sources, and product 07 §Discipline, §Goal-aligned decisions and §Independent workflows and integration;
- product 08 §PRs and commits;
- the handoff, `repair.md`, `costs.md`, the three drill transcripts, `non-node-commands.md`, `close-register.md` and D001–D017;
- the full diff:
  - `scripts/test-runner.mjs`: the guard hook, the shared skip pattern, `kernel-docs` and the repaired declarations;
  - both new modules;
  - the three new runner tests;
  - the console fixture helper, generator and board tests;
  - every renamed case in kernel, console and skeleton;
- product 07's two sentences and the README version line.

Every case diff is a `[document]` prefix, a lazy load of the same fixture or receipt module, or the console manifest loop moved under one tagged parent. No assertion changed.

A clean-room screen of the new modules, the decisions, the reports and this review's text found no user path, account identity, private host or secret shape. The only absolute paths are fixture and probe paths under temporary or nonexistent roots.

## Criteria

**Criterion 1:** met. On the integrated tree, the review's fresh gate recorded 0 excluded reads in each guarded package: kernel 0.47 s, compiler 0.77 s, console 17.80 s and skeleton 330.96 s. The observer ran in each task: kernel logged 2 child-command records, compiler 2, console 725 and skeleton 5,999. That run includes main's two new `verification-witness` suites. The guard covers the six required `node:fs` forms plus the callback forms, and it follows Node children that keep its options. VER-001 reproduced it, and it is byte-identical here. D008 and `non-node-commands.md` list the non-Node commands from one observed run. Limit: product script suites outside the package tasks are unguarded (D013).

**Criterion 2:** met, on VER-001's reproduction. The guard fixture fails against the base runner, which is identical to `feb7a92e`, with `the old runner returns zero here`. The fixture and runner are unchanged since then. `runner-fixtures` passed in this review's gate (21.22 s).

**Criterion 3:** met, carried forward from VER-001's drill with one changed input. At the integrated tree, main's WO-058 edited product 02's verification section. The drill's mechanism is unchanged: the identity source, the kernel case's tag and the `kernel-docs` row are byte-identical to the verified subject. Two parts are newly observed here: this gate shows that no product package reads an excluded path, and `kernel-docs` passes on main's product 02 in the document gate below. I did not repeat the bold-term drill on the integrated bytes.

**Criterion 4:** met, on VER-001's reproduction. The check failed against the base lists, naming `harness-fixtures: uncovered scripts/harness.mjs` among 74 pairs. It also failed a synthetic uncovered entry, import and spawned script, and it prints its transitive and computed-path boundary. The closure test passed on the integrated tree.

**Criterion 5:** met, on VER-001's reproduction. The mutant selects `configuration-root, harness-fixtures, harness, process-debt`, and the evidence-wait case fails on it (2 !== 1). The inputs are unchanged by the repair and by the integration.

**Criterion 6:** met. `costs.md` records the three before and after selections with durations; VER-001 matched them. For `scripts/harness.mjs` the increase is +502.535 s. D011 names the two exclusions that would remove it and why neither is applied. That crossing is also the reopening figure the planning pass adopted; see D021.

**Criterion 7:** met. `costs.md` records the product review gate at 402.242 s before and 396.299 s after, and the document gate at 16.144 s before and 36.323 s after. It also records the 43 retags (kernel 2, compiler 0, skeleton 22, console 19), which the diff confirms. The repair added two `[document]` regressions, which are not retags.

**Criterion 8:** met. Product 07 grows by 333 bytes over main's copy (156,718 to 157,051), inside the two cited §Discipline bullets. That is within the 400-byte bound, and `publication:check` passes. `decisions.md` holds D001–D023, and the decisions index lists them. ER4-001 and ER4-002 are retargeted at close by this review; see Register.

**Criterion 9:** met. Both commands ran on the integrated tree:
- `npm test -- --review` passed fresh: 32 suites, 0 failed, 76 fresh tasks, 380.85 s, identity `5ce3d229…`.
- `npm run test:docs` passes with this report in place, and completion runs it again inline.

`git diff --check` is clean. `package.json` and `package-lock.json` equal main's, so no dependency was added.

## Catalog-row duties

The order's catalog row in the [work-order map](../../planning/work-order-map.md) carries two receipts' known issues and one carry-in for the executor. The planning passes weighed them without editing the order. Neither verification judged them. The order's criteria do not contain them, so none fails this review. Each gap is recorded with a follow-up:

- **Carry-in not discharged ([D019](../../evidence/WO-174/decisions.md#wo-174-d019--the-catalog-rows-repeated-row-carry-in-is-not-discharged)).** The carry-in asked for an explanation, in criterion 6's table, of the twelve of forty `npm test` rows since WO-173 closed that ran fresh at an already-green identity. No record contains it. The map's candidate 4 is held on that explanation. This order's own record shows one source: both verifications reran with `--again` at identities the executor had already recorded green.
- **Guard-fault behavior implemented the other way ([D020](../../evidence/WO-174/decisions.md#wo-174-d020--a-guard-fault-turns-the-package-task-red)).** The pass directed that a guard which fails to load fails its own fixture and leaves the suite's verdict alone, with the choice recorded. The code fails closed instead, and no decision recorded it. An unloadable preload or manifest exits 1 before any case runs; my probe showed both. An unreadable observation log sets exit 1. I keep the fail-closed behavior because it serves the order's objective, and I route the disagreement to the planner.
- **Adopted cost figure crossed ([D021](../../evidence/WO-174/decisions.md#wo-174-d021--the-adopted-120-s-cost-figure-is-crossed)).** Receipts 035 and 036 set 120 s as the figure at which the cost question reopens. The `scripts/harness.mjs` review selection rose by 502.535 s, and D011 kept it without routing it anywhere.

Receipt 036's other known issues on this order are not triggered by what this review observed:
- The blocked outcome is unnamed.
- The read-form set: VER-001 saw the guard also catch `import()`, `require` and read streams.
- The document gate always runs fresh: every `test:docs` row in this order ran all its tasks fresh.
- The closure set is narrower than the title: no after-the-fact list patch has followed.

## Findings and follow-up dispositions

**Boarded, low severity ([D022](../../evidence/WO-174/decisions.md#wo-174-d022--guard-logs-accumulate-without-a-retention-rule)).** Each guarded product run writes about 4.6 MB of manifests and logs under the ignored `docs/control/local/harness/runner/product-reads/`, and nothing prunes them. After this order's runs the directory held about 42 MB. `checks.json` names each log, so a retention rule must keep or rewrite those references. It is not fixed here, because that would change the runner after verification.

**Reopened ([D023](../../evidence/WO-174/decisions.md#wo-174-d023--the-untracked-source-gaps-reopening-observation-occurred)).** FUP-7629e03c6573f5cb (WO-173-D018, the untracked-source gap) was deferred until "a gate row whose identity missed a new source file". The passing rows at `4ff5f77f` and `617f10c1` are such rows: the two new runner modules stayed untracked, so neither identity keyed them. D023's `reopens` object gives the row a second source revision for the planner. No wrong reuse followed; each of those rows ran fresh with `--again`.

**Register.** One `npm run plan -- followups --apply` batch applied the close disposition `close-register.md` specifies. It was applied against register revision `3d3a305b…`, which this review read after `npm run meta` synced D019–D023. The reasons and reopening conditions are recorded on the two rows in `docs/planning/followups.json`. ER4-001 (FUP-c494a909ca1c6017) is settled for the four product package suites only; the script-suite remainder stays FUP-b28b870422a74166 (D013), and the fixture overlay stays FUP-dc1335f4d10f6a75 (D014). ER4-002 (FUP-4f482b75a1071ab9) is settled with the direct-closure boundary stated.

`npm run plan -- followups --touching` listed 19 pending rows by textual match. Six are this order's own decision rows: D013, D014 and D019–D022, all untriaged for the planner. The rest are left:

| Row | Matched | Disposition | Why |
| --- | --- | --- | --- |
| FUP-7629e03c6573f5cb | runner, WO-174 | reopened (D023) | Its reopening condition is met, above. |
| FUP-fb8cbeabbddef397 (ER4-005) | runner, costs, product 07 | left open | D012 reopened it for the document gate's 36.3 s; it still needs its diagnosis. |
| FUP-a9a0591a63757bf2 | WO-174 | left | The gate's structural cut. Its condition waits for WO-174 and WO-179 to close; D019 records that WO-174's explanation is missing. |
| FUP-439252e49f6381fc | runner, product 07 | left | A document-maintenance sentence about `test:docs` preflights. The order did not edit that text. |
| FUP-e821aa2ced3aa111 | runner | left | TAP output for the remaining Node suites; a non-goal of this order. |
| FUP-b7a66e7a4fa7ad20, FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb | generated or evidence files | left | Release preparation, the integrate helper, the byte-proof writer and usage attribution are untouched. |
| FUP-f1c7a256bec46737, FUP-56b599e15f97e666, FUP-fd05316b6030ef73 | product 07, README, index | left | The product 07 edit is two sentences in §Discipline. Cold-start ceilings, resident-state wording and writer text are untouched. |
| FUP-4f8cd7989607ad3f, FUP-a07f6c1c479e80db | skeleton test files | left | Case renames only; the resident replay deduplication and the reactor imports are unchanged. |

Process meter (`npm run meta`, advisory): no observed budget breach and 0 reopen candidates. `guardRefusals` is 12 for this order, reported as insufficient evidence of worsening.

## Executed checks

- Final product row: `npm test -- --review`, recorded 2026-09-30T21:01:01.166Z.
  - 32 passed, 0 failed, 380,850 ms, 76 fresh tasks.
  - Code identity `5ce3d22957eafbc670faaceff96682322d38c17cb9bde0b9420b2a4fe03ae539`, tree `ff2abca2…`.
  - `gateCodeIdentity` recomputed after the gate gives the same identity.
  - The row covers the build, the four guarded packages, `worktree-integration` (267.14 s), `runner-fixtures`, `configuration-root`, `registrations`, `evidence-sources` and the product script suites.
- Integration's affected checks: `npm run publication:check`, `node scripts/harness.mjs check` and `npm run release -- check-surfaces --local` each exit 0.
- `npm run test:docs` passes with this report and the register batch in place; completion runs it again.
- Probe: a `--import` of a missing preload, and the guard with a missing manifest, each exit 1 before the case runs.
- Also passing: `git diff --check`, and my hash, checkpoint-diff and byte-size checks.

## Judgment and publication

[D018](../../evidence/WO-174/decisions.md#wo-174-d018) and D019–D023 compare their choices with the mission, all eight system traps, Naive Interventionism and NoOp. Against the promised benefit, the observed outcome is:
- A green product row no longer rests on a documentation byte it does not key. The four package suites read none; cases that do read one run fresh in the document gate every time.
- A change to a script a machinery suite names directly now selects that suite. REVIEW-004's mutant is caught.
- The cost is visible and routed: about 500 s more for a `scripts/harness.mjs` review and about 20 s more per document gate.
- The class is not closed beyond the package suites (D013, D014), and the order does not claim otherwise.

No efficiency gain is claimed. The tradeoff: I spent one fresh product gate, about 381 s, so that the publication-bound row keys the two new modules on the integrated tree. I relied on VER-001's drills and did not repeat them.

Reviewed PR title: `:white_check_mark: Keep a green test gate from vouching for documents and scripts it never rechecked`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to adding, updating or passing tests. The change's purpose is what a passing test row means. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-174` and opening its PR. The helper supplies the post-merge release-close handoff.
