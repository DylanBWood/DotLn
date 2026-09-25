## Release overview

This release gives each of four situations DotLn sessions kept improvising its own route. An operator who accepts a criterion unmet, withdraws an order, finds a wrong record, or leaves `operator override:` now has a `resume` command for it. Each command appends a typed event to the order's control log, which then shows in status, `current.md` and the work-order index. Before, the same act was a hand edit or a sentence in a report.

A withdrawn order enters a terminal `withdrawn` phase that claims no success, and every projection and dependency check understands it. While an `npm test` gate runs, sessions can now read files and Git history through a fixed read-only list instead of being refused. Writes that could change the gate's inputs are still refused.

The intended audience is the operator and every role session that runs the lifecycle, especially anyone who has had to rescue a record or wait out a gate.

## Read before upgrading

No migration is required, and historical orders keep their bytes: no event was appended to any existing order. New behavior an operator should know:

- `waive` and `withdraw` need an ignored, untracked capture of the operator's words under the intake root, plus its SHA-256 (`--capture`, `--capture-hash`). This is the `plan override --capture` shape. `waive` is refused to the order's own executor session.
- A verification or final review that judges a waived criterion must write `**Criterion N:** unmet, waived by K`, where K is the waiver event's ordinal. `verification-result` and `final-review-result` now refuse three things: a pass over an unwaived `unmet` line, a waiver the log lacks, and an `unmet` line that omits a recorded waiver.
- `withdrawn` has one exit: `activate` of a changed order revision carrying a new `**Reactivation (YYYY-MM-DD):**` note. The date must be a real calendar date, on or after the withdrawal.
- A withdrawal lives on the order's branch and reaches `main` only by an operator merge, because `worktree publish` still requires a closed order (`FUP-3a0c4ea52f8d6d08`).
- `correct` never changes a verdict or a report's bytes. A report path moves only to a file holding the bytes the result recorded.
- Verification and final-review result events now record the judged report's SHA-256 as `reportHash`.
- The live-gate read list is fixed, and Git reads on it must carry `--no-pager` or `-P`. Adding a program is a later order, not a session decision.
- Claude sessions gain a `host-scratchpad` outside-write grant, at the operator's direction. It covers only the one scratchpad directory Claude Code prints for that session.

## Substantive changes

**Four typed off-ramps.** `scripts/lib/control.mjs` folds four new events and validates each one's shape: `CriterionWaived`, `WorkOrderWithdrawn`, `RecordCorrected` and `OperatorOverrideRecorded`. `scripts/resume.mjs` adds the matching `waive`, `withdraw`, `correct` and `override-record` dispatches. Each dispatch carries the actor attestation and a recovery checkpoint, prints the event it appended, and refuses outside its legal phases, naming them. `status --json` gains `legalOffRamps`, `waivedCriteria`, `withdrawal`, `corrections` and `overrideRecords`. A corrected attestation is projected with the correcting ordinal.

**A terminal withdrawal.** `withdrawn` is settled like `closed` wherever a consumer asks whether an order is in flight: open orders, meta, gate attribution, resident binding and the session hook's completion obligations. It does not satisfy dependencies. A typed hard, satisfied-by-close or planning-deferral edge on a withdrawn order is `unmet` with `detail: withdrawn`. The index lists the disposition, unchecked, under Closed.

**The override exit is recorded.** When the operator types `operator override: off`, the generated Claude session hook appends `OperatorOverrideRecorded` with a hash-bound capture of the operator's prompts during the override. If the runtime, a live gate, the writer reservation or a missing open order prevents the record, the hook prints the exact `npm run resume -- override-record ...` command instead. The exit itself never waits on the record. Codex's `operator-control.mjs off` prints the same advisory.

**Reads during a live gate.** While an `npm test` gate is live, `packages/skeleton/src/harness-command.ts` admits a fixed read-only list stage by stage:

- `cat`, `head`, `tail`, `wc`, `ls` and `grep`
- print-only `sed -n`
- `git --no-pager diff|log|show|status|stash list`
- `node scripts/harness.mjs writer --show` and `npm run resume --silent -- status`

The list refuses redirects, heredocs, expansions and wrappers, `sed` write and execute commands, and paged reads. For Git it also refuses output files, external diff and textconv programs, and signature checks. The refusal text names the list.

**Role text and product 07.** Every generated role skill carries one sentence naming the four routes, and the verifier and reviewer texts carry the criterion-line form. Product 07 §Operator recovery controls closes the open recovery event shape with the four routes, and its resume-phrase table gains four rows.

## Progressive polish

The harness bundle was re-emitted for the new sources, and the authority edition was re-minted as `WO-158/004`. Artifact identity and verification stay at `WO-158/001`. Feedback `WO-158/002` carries WO-159's live audit and adds no episode. The console self-host fixtures were regenerated. The existing lifecycle, work-order, derived-order, plan-refutation and process-debt fixtures gained off-ramp cases, and one new script, `scripts/test-off-ramps.mjs`, covers each route's legal and illegal phases.

## Evidence and compatibility

**Release and versions.** This prepares application `v0.49.0` as a minor release over `v0.48.0` (`0c727915`), the classification the order declared. `@dotln/compiler` moves `0.18.0` → `0.19.0` and `@dotln/skeleton` `0.41.0` → `0.42.0`, with the console's pins and the lockfile following. Kernel and console versions are unchanged, and no dependency was added.

**Product gate.** The reviewer's `npm test -- --review` binds the released bytes: **40 suites, 0 failed, 569.53 s, 84 fresh tasks, exit 0**, on tree `9bc23a93784bba406f381e096d47aa66f0aad87d` at code identity `50f0c0565cad8d08212c08f30db6b5e43a3ff58d0f8fcf9c65aa5ae54c578f41`. It was recorded at 2026-09-25T16:15:42.293Z with no sandbox in force.

**Verification sequence.**

1. [VER-001](../../verifications/WO-158/VER-001.md) failed four reproduced defects: an impossible reactivation date, a report-path correction rebinding a pass to other bytes, same-second override captures overwriting each other, and a configured pager run by an admitted `git log`.
2. The first [repair](../../evidence/WO-158/repair.md) fixed each with a regression, and [VER-002](../../verifications/WO-158/VER-002.md) passed.
3. [FINAL-001](FINAL-001.md) integrated WO-159 and failed on a loop the pager repair had introduced: a second Git prefix token hung every live-gate hook.
4. [Repair 002](../../evidence/WO-158/repair-002.md) fixed it in one line with a bounded regression, and [VER-003](../../verifications/WO-158/VER-003.md) passed.
5. [FINAL-002](FINAL-002.md) passed with its own classifier probe and the product gate.

**Known limitations.** Each of the first six has a register row.

- Under Codex, which has no hook-made writer reservation, removing the session variable from a `waive` command records the waiver with `recordingSession.role: unobserved` rather than refusing it.
- The `CLAUDE_EFFORT` disagreement refusal applies only to the `claude-code` harness spelling.
- `current.md` shows a withdrawn order only on that order's own branch. This item and the two above are recorded in [D029](../../evidence/WO-158/decisions.md#wo-158-d029), `FUP-7b4b41e2875f852d`.
- A granted outside-write root swapped for a symlink carries the grant to its target. WO-144's session scratch already had this class.
- Repository hooks and `%G` pretty formats are not screened by the configured-program check. This item and the symlink swap are recorded in [D028](../../evidence/WO-158/decisions.md#wo-158-d028), `FUP-6996e331536d4389`.
- `git --no-pager status` under a configured fsmonitor is still admitted through the WO-142 metadata vocabulary (`FUP-9e2be6bfac0708fe`).
- Copilot and Codex hosts were not exercised live, and no live episode was run.

Deeper notes: [decisions D001 to D030](../../evidence/WO-158/decisions.md), the two repair records, the three verification reports, both final reviews and [the order](../../work-orders/WO-158-lifecycle-off-ramps.md).
