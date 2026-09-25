# WO-158 FINAL-002 — final review

**Verdict:** pass. WO-158 asked for four typed off-ramps with their own `resume` routes, a terminal `withdrawn` phase that every projection knows, an override record appended at `operator override: off`, and a live `npm test` gate that admits a fixed read-only list while still refusing every redirecting or unlisted command. [FINAL-001](FINAL-001.md) failed only criterion 6, on a live-gate Git prefix loop (its F1). [Repair 002](../../evidence/WO-158/repair-002.md) fixed that loop in one line with a bounded regression ([D030](../../evidence/WO-158/decisions.md#wo-158-d030)), and [VER-003](../../verifications/WO-158/VER-003.md) passed all nine criteria. This review re-judged criterion 6 with its own probe of the built runtime: 1,062,930 command spellings, each returning within 0.4 ms and none disagreeing with the expected rule. It also ran the product gate on the staged tree: 40 suites passed and none failed. I found no new defect. `main` has not moved since FINAL-001 integrated it, so this review integrated nothing.

**Subject:** [`docs/work-orders/WO-158-lifecycle-off-ramps.md`](../../work-orders/WO-158-lifecycle-off-ramps.md) on branch `wo-158`, uncommitted over HEAD `0c727915a0582120cbe12d41f48ada53ddd7e5ce`, which is `main` after WO-159 and is the tree FINAL-001 integrated. The dispatch checkpoint is `refs/dotln/checkpoint/WO-158/16` (`5759c81d`).
- Against VER-003's result checkpoint `/15` (`bf963061`), the dispatch checkpoint differs only in `docs/control/current.md`, `docs/work-orders/README.md` and the `FinalReviewRequested` row.
- VER-003's recorded `reportHash` equals the report's current SHA-256 (`330ae11d…`), and so do VER-002's (`026e8d60…`) and FINAL-001's (`120cc05e…`).
- Since FINAL-001's result checkpoint `/11`, the only change outside `docs/` is the one-line classifier repair in `packages/skeleton/src/harness-command.ts`, its 109-line regression in `scripts/test-harness.mjs`, and 14 regenerated hooks plus the harness manifest. The regenerated files differ only in the new runtime snapshot id and file hashes.

The judged subject is the staged tree: 108 paths against `main` before this review's own records (32 added, 76 modified). The product gate recorded tree `9bc23a93784bba406f381e096d47aa66f0aad87d` and code identity `50f0c0565cad8d08212c08f30db6b5e43a3ff58d0f8fcf9c65aa5ae54c578f41`. That is the identity repair 002's and VER-003's gates recorded. No branch commit existed before this review.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.282","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no other choice during the review. The harness version is from `claude --version`. The model is this session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT` value read by this session: selected effort, not effective. The order asks for `reviewer any`. No subagent was planned or spawned: 0 of the cap of 20 (`harness usage`: exact-observed). Since FINAL-001 the subject had changed only by a one-line repair and its regression, and FINAL-001's two read-only review agents had already judged the rest of the diff. So one reviewer judging the delta and re-running every check was the smaller plan that still covered the change.

**Process cost:** entry 82398 tokens; handoff 18228831 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope, from `node scripts/harness.mjs usage 4a62f452-da8a-46e8-84c2-938afb5760ec`. The entry reading was observed at 2026-09-25T16:03:55.393Z. The handoff reading was observed at 2026-09-25T16:19:24.745Z (127 steps, 92 commands, 0 subagents of cap 20, exact-observed), after the judgment text was complete and before the result transition. Both include reused cached input. Reasoning tokens and dollar cost are unavailable from this counter, which means unknown, not zero. The largest wait was the product gate (569.53 s), during which this session read the subject through the live-gate list the order adds.

## Goal-aligned judgment

The order is record-truth and throughput machinery, not a lettered critical-path gate (receipt 028). It moves recurring rescue out of prose into typed events and projections, and it lets sessions keep reading while a gate runs. So the question for this review was whether the repaired classifier ends for every spelling and still refuses writes, without reopening a path the earlier repairs closed.

- **Rule beating** and **success to the successful** decided how I checked. The F4 fixture passed earlier because it spelled the one prefix order the loop survived, and VER-002 passed on that fixture. So I did not accept the repair's regression or VER-003's 2,904-input sweep as the evidence. I generated every sequence of up to four tokens over the three prefix flags and eight other Git options, crossed with eleven subcommand forms and six tails, and compared each result with the rule written out independently.
- **Policy resistance / fixes that fail:** the one-line change keeps the no-pager requirement and every guard D025 added. Paged reads, `stash show`, `blame`, `--output`, `--ext-diff`, `%G` formats and every chained write stay refused in the probe.
- **Shifting the burden:** this session met the list as a user during its own gate. The refusal text named the list each time, and the documented `git --no-pager --no-optional-locks` reads were admitted without rescue.
- **Naive Interventionism:** the remaining observations stay boarded with their register rows rather than folded into this review; none sits on a criterion's path.
- **NoOp**, withholding the pass, would hold back a green, independently verified subject that replaces the recurring improvisation the catalog records.
- The remaining lenses are immaterial here. One gate and no agents is the whole load (tragedy of the commons, escalation). The criteria and cold-start ceilings are unchanged (drift to low performance). The measured outcome is route use and gate reads, not suite counts (seeking the wrong goal).

## Criteria

- **Criterion 1:** met. The four routes, their phase refusals and the `status --json`, `current.md` and index projections are unchanged since VER-002 and FINAL-001 judged them met ([D002](../../evidence/WO-158/decisions.md#wo-158-d002)). This review's gate re-ran their fixture matrix in the `resume` suite (`scripts/test-off-ramps.mjs`), along with the `worktree`, `work-orders-fixtures`, `derived-orders` and `skeleton` suites. That matrix covers each event's legal and illegal phases and a withdrawn order a typed dependency reads as unmet. This session's own status projects `legalOffRamps`, `waivedCriteria`, `withdrawal`, `corrections` and `overrideRecords`. A checkpoint correction leaves no stale restore command in `latestCheckpoint`, because the correcting event is itself checkpointed, or marked unavailable, when it is appended.
- **Criterion 2:** met. `waive` and `withdraw` check a contained, ignored, untracked, non-empty capture against its stated SHA-256. `waive` refuses the order's executor, and the pass-with-waiver and fail-without-waiver fixtures pass in this gate ([D003](../../evidence/WO-158/decisions.md#wo-158-d003), [D004](../../evidence/WO-158/decisions.md#wo-158-d004), [D009](../../evidence/WO-158/decisions.md#wo-158-d009)). I read `judgeCriterionLines`: it refuses a pass over an unwaived unmet line, a waiver the log lacks, an unmet line omitting a recorded waiver, and conflicting lines for one criterion. The Codex environment evasion stays boarded under [D029](../../evidence/WO-158/decisions.md#wo-158-d029) (a).
- **Criterion 3:** met. `withdrawn` refuses every dispatch but `activate`, which requires a changed authority and a new calendar-valid reactivation note ([D005](../../evidence/WO-158/decisions.md#wo-158-d005), [D007](../../evidence/WO-158/decisions.md#wo-158-d007), [D022](../../evidence/WO-158/decisions.md#wo-158-d022)). The index lists the disposition unchecked under Closed, and the sequence and plan checks settle withdrawn edges; their fixtures passed in this gate. The publication gap stays with `FUP-3a0c4ea52f8d6d08`.
- **Criterion 4:** met. `correct` refuses `verdict` and any unlisted field, never writes a report, and moves a report path only to the bytes the result's recorded `reportHash` names ([D008](../../evidence/WO-158/decisions.md#wo-158-d008), [D023](../../evidence/WO-158/decisions.md#wo-158-d023)). The fold projects corrected attestations with `correctedBy` and recomputes effort drift. The `CLAUDE_EFFORT` disagreement refusal is in place and its fixture passed. This order's own three recorded `reportHash` values equal their reports' current SHA-256, so no filed report changed.
- **Criterion 5:** met. The generated session hook appends `OperatorOverrideRecorded` at `operator override: off` with a hash-bound, exclusively created capture. It prints the exact advisory command when the runtime cannot record, including from its outer catch when the pinned runtime is unavailable ([D012](../../evidence/WO-158/decisions.md#wo-158-d012), [D024](../../evidence/WO-158/decisions.md#wo-158-d024)). The hook generator is unchanged since VER-002. Its generated-hook cases passed in this gate's `harness-fixtures` suite (200.68 s), and Codex carries the duty in role text.
- **Criterion 6:** met. The FINAL-001 F1 loop is gone: `liveGateGit` now advances its index on every recognized prefix token, so the loop ends for any finite argument list.
  - Against the installed runtime snapshot the hooks import, 1,062,930 inputs returned within 0.4 ms each. They were every sequence of zero to four tokens over `--no-pager`, `-P`, `--no-optional-locks`, `-c`, `core.pager=x`, `-C`, `/tmp`, `--git-dir=.git`, `--paginate`, `-p` and `--exec-path`, crossed with eleven subcommand forms and six tails.
  - 1,740 were admitted, and 0 disagreed with the rule "only prefix flags before a listed read, at least one pager-disabling flag, no guarded option, and no tail other than a pipe into `head` or `2>&1`".
  - During this session's own gate, the generated hooks admitted `git --no-pager` reads, `grep`, `tail`, `wc`, `sed -n` and `ls`, including pipelines of them. They refused commands containing `printf`, `date`, `cut`, `sort`, an unquoted glob or a `2>/dev/null` redirect, each time naming the list.
  - The repair's regression passed in `harness-fixtures`. It runs 44 bounded classifier inputs and 48 judgments through the three pre-tool hooks under a live gate, including chained writes to a gate input.
  - The `-c core.fsmonitor=false` status form is admitted by the WO-142 vocabulary, not by the list, and stays with `FUP-9e2be6bfac0708fe`.
- **Criterion 7:** met. All twelve generated role skills carry the `Off-ramps (WO-158)` sentence, and the verifier and reviewer texts carry the criterion-line form. Product 07 §Operator recovery controls closes the recovery event shape with the four routes, and the resume-phrase table carries four rows. `npm run harness -- check` reports 31 generated surfaces. `node scripts/harness-context.mjs --check` measures executor 25,819/29,246, verifier 22,698/25,151, reviewer 23,780/24,576, release-close 14,649/16,384 and planner 16,797/24,576; refuter measures 16,372 with no ceiling. No ceiling is breached, so the standing 2026-09-17 route was not needed ([D013](../../evidence/WO-158/decisions.md#wo-158-d013)).
- **Criterion 8:** met. `docs/evidence/current.json` selects authority `WO-158/004`, artifact identity `WO-158/001`, verification `WO-158/001` and feedback `WO-158/002`. Feedback `WO-158/002` carries WO-159's live audit and claims no live episode. All four edition checks passed as suites of this gate, and `evidence:console --check` matches its four cases ([D015](../../evidence/WO-158/decisions.md#wo-158-d015), [D026](../../evidence/WO-158/decisions.md#wo-158-d026)).
- **Criterion 9:** met. `npm test -- --review` passed 40 suites with 0 failed at the code identity above, and `npm run test:docs` passed after this report (see Checks). `git diff --cached --check main` is clean. The lockfile and manifests change only `@dotln/compiler` `0.18.0` → `0.19.0` and `@dotln/skeleton` `0.41.0` → `0.42.0` with their workspace pins, so no dependency was added. The diff adds no lint or type suppression.

## Findings

None. This review met no defect that it leaves unrecorded. The boarded observations keep their register rows, and no criterion requires them:

- [D028](../../evidence/WO-158/decisions.md#wo-158-d028) (`FUP-6996e331536d4389`): the hook and grant seam, including the medium symlink swap of a granted root.
- [D029](../../evidence/WO-158/decisions.md#wo-158-d029) (`FUP-7b4b41e2875f852d`): the control-plane seam.
- D005's `FUP-3a0c4ea52f8d6d08`: the withdrawn-order publication gap.
- `FUP-9e2be6bfac0708fe`: the WO-142 fsmonitor admission, carried as this worktree's one adjacent-queue known issue.

## Integration with `main`

None was needed. `git ls-remote origin refs/heads/main` and the local `main` both read `0c727915`, which is HEAD and the merge base, and origin's `v0.48.0` tag peels to the same commit. FINAL-001's integration record ([D026](../../evidence/WO-158/decisions.md#wo-158-d026)) stands: the skeleton retime to `0.42.0`, the carried WO-159 feedback audit, and the retained stash `caf830d5` and checkpoint `/10`. `npm run release -- prepare` against origin's tags reports that `v0.49.0` remains current.

## Verification sequence

1. **Implementation** (Claude Code 2.1.282, `claude-opus-5-5`, `xhigh`; [decisions D001 to D020](../../evidence/WO-158/decisions.md)): the fold, routes, projections, classifier list, hook `off` handling, fixtures, role text and product 07. The executor's own adversarial review confirmed and fixed 15 defects before handoff (D020).
2. **[VER-001](../../verifications/WO-158/VER-001.md)** (Codex CLI 0.156.1, `gpt-6-sol`, `ultra` recorded `xhigh`/subagents): fail on criteria 3 to 6. It found four reproduced defects: an impossible reactivation date, a report-path correction rebinding a pass to other bytes, same-second override captures overwriting each other, and a configured pager run by an admitted `git log`.
3. **[Repair](../../evidence/WO-158/repair.md)** (Claude Code 2.1.282, `claude-fable-5-1`, `xhigh`): each defect fixed with a regression ([D022](../../evidence/WO-158/decisions.md#wo-158-d022) to [D025](../../evidence/WO-158/decisions.md#wo-158-d025)).
4. **[VER-002](../../verifications/WO-158/VER-002.md)** (Codex CLI 0.156.1, `gpt-6-sol`, `xhigh`): pass at code identity `1172bcf9…`.
5. **[FINAL-001](FINAL-001.md)** (Claude Code 2.1.282, `claude-opus-5-5`, `xhigh`, two read-only agents): integrated WO-159 and retimed the skeleton. It failed criterion 6 on the prefix loop the pager repair had introduced ([D027](../../evidence/WO-158/decisions.md#wo-158-d027)) and boarded D028 and D029.
6. **[Repair 002](../../evidence/WO-158/repair-002.md)** (Codex CLI 0.157.0, `gpt-6-astra`, `xhigh`): the one-line fix, the regression that failed with a 5 s timeout before the fix, and authority `WO-158/004` ([D030](../../evidence/WO-158/decisions.md#wo-158-d030)).
7. **[VER-003](../../verifications/WO-158/VER-003.md)** (Claude Code 2.1.282, `claude-opus-5-5`, `xhigh`): pass, with a 2,904-input sweep and a mutation check that restored the old line and reproduced the hang.

Every verification of a repair ran on a different model and harness from that repair. VER-003 and both final reviews share the implementation's model and harness. This review's probe and gate are its own evidence, not VER-003's.

Ideation receipt 028 judged the order `aligned-with-findings` with six known issues, and each reached a decision. Pipelines are judged stage by stage (D011). The capture's authorship is observed through `recordingSession` (D003). The override's words are captured and the no-`off` session is boarded (D012). The effort refusal admits when there is no readback (D008). Cold-start headroom was measured within the ceilings, and the reviewer's figure of 23,780 is below 24,576 (D013). A reactivated order leaves `withdrawn` in every projection (D007). None of their reopening conditions is observed on this subject.

## Checks

Executed by this reviewer on the staged tree, 2026-09-25:

| Check | Result |
| --- | --- |
| Classifier probe, installed runtime `41853b351d9f5602`, 120 s alarm | 1,062,930 inputs; 1,740 admitted; 0 mismatches; slowest 0.398 ms; exit 0 |
| `npm test -- --review` (Claude Code shell; runner `sandbox.inForce: false`) | **40 passed, 0 failed, 569.53 s, 84 fresh tasks, exit 0**, recorded 2026-09-25T16:15:42.293Z; tree `9bc23a93…`, code identity `50f0c056…`; includes `harness-fixtures` 200.68 s, `skeleton` 296.31 s, `resume` 33.88 s and the four edition suites |
| `npm run harness -- check` | 31 generated surfaces |
| `node scripts/harness-context.mjs --check` (both installed roots) | every role with a ceiling within it; figures under criterion 7 |
| `npm run evidence:console -- --check` | selfhost, control, refutations and missing match |
| `npm run plan -- check` | exit 0 |
| `npm run publication:check` | PASS; both editions CURRENT |
| `npm run release -- check-surfaces --local` | 44 PASS, 0 FAIL, exit 0 |
| `npm run release -- prepare` (origin tags) | `v0.49.0` remains current; no files changed besides the PR meter |
| `git diff --cached --check main` | clean |
| Recorded `reportHash` of VER-002, FINAL-001 and VER-003 | each equals the report's current SHA-256 |
| `npm run test:docs`, after this report | first run: 13 passed, 8 failed. `release-surfaces` refused the release notes' `<id>` and `<ordinal>` placeholders as raw HTML, and seven other suites reported FAIL at 0.00 s, which I infer means they did not start. After I rewrote the placeholders: **21 passed, 0 failed, 24.14 s, 21 fresh tasks** |

## Evidence gate, write-back, non-goals and assumptions

- **Evidence gate:** satisfied.
  - Fixture transcripts: `scripts/test-off-ramps.mjs` in the `resume` suite.
  - Generated-hook tests: the WO-158 cases in `harness-fixtures`.
  - `npm test` ran once at final review, above.
  - No live row, as the order specifies.
- **Write-back duty:** decisions D001 to D030 carry sources and reopening conditions, and the product 07 paragraphs are present. The duty assigns register rows `FUP-e468ee64ac00c70a` and `FUP-eba6a79fc106bd28` to close, and both stay `allocated` to WO-158 now; `FUP-e468ee64ac00c70a` is also allocated to WO-160 for the amendment-row withdrawal. This worktree's adjacent queue holds one known-issue item and no deferral that a retarget could attach to them. A reviewer does not write register dispositions, so both rows settle at close through planning's `followups apply`, as WO-159's allocated rows did.
- **Non-goals held:**
  - No off-ramp event exists in any control segment or the legacy log, so no retroactive event was written for a closed order.
  - Verdict correction is refused.
  - `docs/control/plan-refutations.jsonl` is unchanged, which leaves the integrate helper and the amendment-row withdrawal to WO-160.
  - The sandbox vocabulary is untouched (WO-161).
  - What a verification judges is unchanged. The criterion-line convention is only the recording form the order asks for.
- **Operator-review assumptions:**
  - 1 held: the executor is refused a waiver, and a waiver names the operator's captured words.
  - 2 held for the sequence and the index. A withdrawn order still does not satisfy a dependency, as D005 records.
  - 3 held: `LIVE_GATE_READ_LIST` is one constant, and product 07 says that adding a program is a later order.

## Handoff

Result: `final-review-result pass`. On pass, this review commits the reviewed series, pushes `wo-158` and opens its pull request. It merges nothing and publishes no release, tag or package.
