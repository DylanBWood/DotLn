# WO-149 FINAL-001 — Codex sessions begin at lifecycle dispatch

**Verdict: pass.** The delivered subject meets all five acceptance criteria, VER-002 reproduced each of them independently, and I re-ran the order's own evidence gate at the reviewed, staged bytes: `npm test -- --review`, 32 passed, 0 failed, 533.15 s, 76 fresh tasks, exit 0. The two operator-authorized expansions that travel with the order are in scope and recorded. One defect is met and not fixed here, recorded as D009 with a named follow-up; it is outside every acceptance criterion and both independent refutation receipts already classified it as a known issue rather than a hold.

Dispatch: `resume: final review` on 2026-09-21, recorded by the harness as `npm run resume -- final-review`. The human actor is the operator who dispatched this review; the attestation below records the session that executed it.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

**Process cost:** entry 84528 tokens; handoff 9587810 tokens; source claude-transcript-message-usage

Entry observed 2026-09-21T23:42:44.996Z; handoff observed 2026-09-21T23:58:21.411Z; scope dispatch. The harness's own briefing reported every counter as `unknown (counter-unavailable)` at 23:42:39; the direct readback 6 s later returned counters, so the briefing's unavailability was a timing artifact of the session journal and not an absent channel. Model is read from this session's environment and the CLI version from `claude --version` (2.1.278). No effective-effort readback channel exists in this harness, so `xhigh` is the operator-attested value carried by this order's four recorded attestations and its `effortDrift` row, not a session readback. Subagents 0 of the 20-agent cap, exact-observed, uncounted remainder unknown; the fan-out plan for this review was zero spawns and none was spawned. The 533 s gate dominates this dispatch's wall-clock and was not optional: the order assigns one `npm test` to final review, the executor deliberately did not spend it, and the release manifest consumes the reviewer's row.

## Instrument disclosure

Four files under review also recorded or checked this review. `scripts/resume.mjs` is the dispatch path that admitted `resume: final review` and allocated this report. `packages/skeleton/src/harness-host.ts` contains the `measureHarnessUsage` that produced the counters above. `scripts/harness.mjs` is the command I read them with. `scripts/test-process-debt.mjs` is one of the 32 suites in the gate I ran. No part of the verdict rests on the counter values.

This review ran in Claude Code, not Codex, so the order's operator-review assumption 1 did not hold for a third time. Criterion 3's second branch is the one in force throughout, and it is judged as evidence below.

## The order against the delivered subject

Criteria 1, 2, 4 and 5 are met and were reproduced in VER-002 against these bytes; I re-executed the gate rather than re-deriving each fixture assertion, and checked the three claims that a later change could have invalidated. `node scripts/harness.mjs check` reports 31 generated surfaces. `npm run publication:check` reports 273/273 product headings with both editions current at 30 and 45 linked sections. `npm run plan -- check` exits 0, and its only workspace-only entry for WO-149 is a `release-assignment` of `v0.40.2` — the same normalized kind already committed for WO-138, WO-071, WO-150, WO-147 and WO-148 — so the order's one text change, `(version assigned at activation)` → `(v0.40.2)`, needs no `PlanExecutionAmended` row and none exists.

Criterion 3's live row I judged on its own terms, because it is the criterion the order exists for and the only one whose evidence is not reproducible by re-running a command. The row at `docs/evidence/WO-149/live-codex-dispatch.md` carries a physical cost line reading `entry 2044066 tokens; handoff 2785639 tokens; source codex-transcript-counter`, and its JSON records the fixture's absent-then-present session record, the `next` → executor mapping, a `startedAt` inside a published bracket, empty adopted authorship, a byte-identical repeat and the dispatch source hash. VER-001's objection was attributability, not existence: the `explicit-session-entry` source string is written by the primitive and does not distinguish a dispatch from a manual `harness begin`. VER-002 closed that physically, by listing the live fixture tree and finding no `scripts/harness.mjs` in it at all, with the tree's `scripts/resume.mjs` hashing to the reviewed source. That is the right shape of answer: it excludes the manual path by absence rather than by narrative. The row's own stated limit — that the counters are the launching session's totals sampled around the invocation, not isolated fixture compute — is a limitation it declares rather than one a reader has to find, which is the standard this repository holds itself to.

Criterion 5's gate is the row recorded at `2026-09-21T23:56:14.296Z` against tree `0b5cd428d138ddf810b191c8f9b33fb475851b49` and code identity `b23aa5d5a2cc7b92cb595ad7c857ab92b3b873833f3848948dad43815304d823`, run unsandboxed so the `needs: outside-sandbox` suite was included rather than excluded. `git diff --check` is clean in the working tree and the index. The only `package-lock.json` movement is `@dotln/skeleton` 0.34.1 → 0.34.2 with the console's exact pin following; compiler 0.17.0, kernel 0.6.0 and console 0.1.7 are unchanged, matching D004.

## The verification sequence

VER-001 failed the order correctly and for the right reasons. Its two majors were not procedural: criterion 3's live row had no artifact of either permitted kind, and the order's own `scripts/resume.mjs` edit newly caused `--review` to select a `configuration-root` suite that was failing on a defect the order had disposed as out of scope. That second finding is the more valuable one, because the order was staged to arrive here with a red gate and no recorded expectation that it would be red, and because the verifier reached it by composing three executed observations rather than by running the gate it could not afford. It also declined to cure the gap itself, which was correct.

VER-002 passed on the repaired subject and closed all four findings with reproduction rather than assertion: it ran the full 32-suite gate end to end, inspected the live fixture tree on disk, compared the retained probe source against the merge-base blob with `cmp`, and executed the historical replay. Its three recorded observations are each real and each correctly not routed to repair. Observation A — that `docs/evidence/WO-138/audit.mjs` no longer passes from the repository root — is the one with an operator consequence, and I have promoted it into the release notes' read-before-upgrading section rather than leaving it in a verification report, since a reader following WO-138's documented checks would otherwise meet an unexplained failure. Observation C corrects a stale hash prefix in D003 through D007's `correction` block, which is this repository's convention for correcting a recorded decision without rewriting it.

I found no disagreement with either verdict and no claim in VER-002 that did not reproduce.

## The ideation receipt

Both independent refutation receipts over the 2026-09-21 standard pass — `2026-09-21-planning-9d2888b45f687bc6-022` and its continuation `2026-09-21-planning-1457ac11ba15715d-023` — judge WO-149 `aligned-with-findings` with no hold, over order hash `sha256:294dc8700d60f079c35ba29241f6b71cd85c7af7a0d6db5c765cc57100e05f3c`. The planner's own pass at `docs/planning/standard-pass-2026-09-21.md` places the order in a one-entry slot after WO-147 and WO-148, records that its live row "proves aim, not the work, and says so", and disposes all twelve findings across the three orders as known issues.

Four of the receipts' WO-149 findings are answered by the delivered subject: the begin does sit inside the one command every Codex dispatch passes through; the fixture did land in a named existing suite (`process-debt`) rather than a new one, which D002 records as its economy experiment; the two harnesses' counter windows are each labelled by source in every receipt; and the live row is the check against a pinned fixture transcript going stale. Two remain open by design and are correctly outside the order: the refuter and planning dispatches are not in the five-dispatch set, and no criterion binds the cost table's `tokens` metric, so the promised Codex column shows up on the first Codex-dispatched order after this one rather than here. The seventh finding is the one I have routed to a follow-up below.

## Finding — recorded, not fixed here

A Codex lifecycle dispatch whose session begin throws for any reason other than the already-began refusal fails the entire command *after* its transition has been appended. `beginHarnessSessionOnce` rethrows every other error — an executed probe confirms it, `beginHarnessSessionOnce(root, "wo149-review-probe", "not-a-role")` rethrowing `Invalid harness session` — and `scripts/resume.mjs:1153-1175` does not catch it. The surrounding handler at lines 1214-1220 converts a post-transition failure into the "Completion recorded; final handoff failed. Do not repeat the transition." guidance only when `releaseExecutorWriter` is set, and that is assigned only in `implementation-ready` (line 903) and `repair-complete` (line 1010). `verify` (line 927), `fix` (line 999) and `final-review` (line 1035) append their transitions inside their case blocks, before the begin at line 1157, and `process.stdout.write(message)` at line 1226 sits after the try. So a begin failure exits 1, withholds the dispatch briefing that carries the allocated report path, and leaves a recorded transition the role text forbids repeating — for a measurement concern.

Both refutation receipts named this path under `failureBehavior`: "an unguarded failure would refuse lifecycle work for a measurement concern", and "the mechanism should log and proceed with a cause code". D001 rejected catching every begin failure on the ground that it "would hide invalid roles, missing identities, snapshot failures and future host errors" — a sound objection to a *silent* catch, but the adjacent unbuilt-runtime branch eleven lines below already shows the shape that keeps a failure visible without refusing: a named stderr advisory and an admitted dispatch.

I did not fix it here. It changes error-handling behavior rather than cleaning an adjacent path, it reverses a judged executor decision, and a reviewer edit would ship the one behavior in this order that no independent verification judged. I did not fail the order for it either: every acceptance criterion is met, the plan disposed the path as a known issue, and reaching it needs an unwritable session store, a stale `dist` bundle or a control-read failure. It is recorded at [D009](../../evidence/WO-149/decisions.md#wo-149-d009) with a named follow-up registered as `FUP-97f4f0f32ef29007`, and stated in the release notes' known limitations.

## Scope beyond the order, judged

Three expansions travel with this order. Each is operator-authorized in its dispatch line and recorded.

D005 adopts the operator's verifier direction as a shared rule — `xhigh` rather than `max`, and a USD 5 cap only where the transport has a hard dollar control — and raises `FEEDBACK_VERIFIER_LIMITS.maxBudgetUsd` from `3.00` to `5.00`. Its `correction` block is the substantive part: the executor first described the Codex feedback verifier as capped, then checked the argument vector and found that only `claude-cli-print` receives `--max-budget-usd`. The durable note now refuses to call an unenforced limit a cap, which is the right generalization from a single misread. The cost is 219 bytes in the verifier role, inside its ceiling.

D007 reopens D003 under an explicit operator scope expansion and repairs the `configuration-root` failure at its cause. I judged the construction rather than the narrative: the retained `wo138-probe-source.mjs.txt` is the pre-repair committed source, all 38 episodes bind it, no WO-138 evidence file changed, and the regression rejects the current build, a one-byte alteration and each of four changed hashes. The tradeoff VER-002 recorded as observation B is real — the binding's strength now rests on a committed hash rather than on the file system — and it is the correct trade against rewriting 38 executed episode records, which would have fabricated evidence. D007 records it with a reopening condition.

D006 re-mints the authority and feedback editions at revision 002 because the Contributor loadout is a registered source of both, retaining revision 001 as superseded residue rather than rewriting it; `authority-evidence --check`, `feedback-evidence --check`, `verification-evidence --check` and `console-fixtures --check` all pass at those bytes. D008 repairs the role oracle the first full gate caught, by pinning a new contemporaneous baseline and walking the historical chain rather than replacing a snapshot.

## Checks executed at the reviewed bytes

- `npm test -- --review`: **32 passed; 0 failed; 533.15 s; 76 fresh tasks; exit 0**, unsandboxed, tree `0b5cd428`, code identity `b23aa5d5`, recorded 2026-09-21T23:56:14.296Z.
- `npm run test:docs`: **19 passed; 0 failed; 27.27 s; 19 fresh tasks** on the final documents.
- `git diff --check`: clean in the working tree and, after staging, in the index.
- `node scripts/harness.mjs check`: 31 generated surfaces.
- `npm run publication:check`: 273/273 headings; both editions current.
- `npm run plan -- check`: exit 0.
- `npm run release -- prepare --local`: target `v0.40.2` remains current; no files changed; meter block refreshed.
- `npm run release -- check-surfaces --local`, `npm run work-orders -- index --check`, `npm run format:check`, `node scripts/authority-evidence.mjs --check`, `node scripts/feedback-evidence.mjs --check`, `node scripts/verification-evidence.mjs --check`, `node scripts/console-fixtures.mjs --check`: all pass.
- `node scripts/harness.mjs writer --show`: this session holds the single writer reservation for the worktree.

## Limits

- I re-ran the gate but did not re-derive every fixture assertion VER-002 reproduced; for criteria 1, 2 and 4 I relied on that reproduction plus the three independently re-executed checks named above.
- The live row is ignored local state at a path that a later session or a reboot may remove. I did not re-inspect the fixture tree myself; VER-002's inspection is the evidence, and its method — absence of `scripts/harness.mjs` in the tree — is what makes it checkable rather than attested.
- The gate ran once, on this worktree, at these bytes. `main` was at the same commit as `HEAD` throughout, so no integration or retime was needed and none was performed.
- Effort is operator-attested, not read back; the harness exposes no effective-effort channel.
- D009's failure path is established by reading the code path with an executed probe of the rethrow half. I did not make a live begin fail, which would have meant damaging this repository's control state during a review.
