# WO-158 repair 002 — FINAL-001 F1

Dispatch: `resume: fix`, 2026-09-25. Canonical status selected WO-158 in
`needs-fix`; this Codex session ran `npm run resume -- fix` once and repaired
the integrated, uncommitted subject retained by
[FINAL-001](../../final-reviews/WO-158/FINAL-001.md).

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.157.0","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

The dispatch briefing supplied the model, effort and CLI version from the
active Codex session. No subagent was used. The decision is
[WO-158-D030](decisions.md#wo-158-d030), reopening
[D027](decisions.md#wo-158-d027), whose finding is registered as
`FUP-25e1b23c7b844eb1`.

## Repair and evidence

`liveGateGit` in `packages/skeleton/src/harness-command.ts` now consumes
each recognized prefix on every loop iteration. Previously the index advance
was inside `unpaged ||= ...`, whose right operand stopped executing after
`--no-pager` or `-P` made `unpaged` true. The one-line repair uses an ordinary
`if` to record that flag after consuming the prefix.

The new `WO-158 FINAL-001 F1` case in `scripts/test-harness.mjs` first runs
44 classifier inputs in a child process with a five-second standalone bound:
six prefix sequences across `diff`, `log`, `show`, `status` and `stash list`,
incomplete commands, chained writes, repeated lock flags without a pager
flag, and the documented `-c core.fsmonitor=false` status spelling. It then
checks eight reads and their eight chained writes through each of the three
generated pre-tool hooks with an active `npm test` marker: 24 admissions and
24 denials, with each hook process bounded at twenty seconds. The `-c` form
still enters through the existing WO-142 metadata vocabulary; the fixed
live-gate list continues to exclude arbitrary Git configuration flags.

Before the source repair, this new regression failed after 5,004.7 ms with
`ETIMEDOUT` and `SIGTERM`, independently reproducing FINAL-001 F1. After the
repair and rebuild, the complete focused WO-158 run passed all five cases in
23.35 s; the new case took 5.08 s including fixture setup and all hook calls.

| Executed check | Observation |
| --- | --- |
| `npm run harness -- evidence` (`npm test`) | 27 suites passed, 0 failed; 71 tasks; 291.242 s, recorded at 2026-09-25T15:37:06.317Z |
| `node scripts/test-runner.mjs --only harness-fixtures` | Build and the full harness fixture suite passed; 2 tasks, 0 failures; 196.29 s (fixture suite 195.72 s) |
| `node --test --test-name-pattern 'WO-158' scripts/test-harness.mjs` | 5 passed, 0 failed, including the reproduced prefix-order regression |
| `npm run harness -- check` | All 31 generated surfaces current after emit |
| `node scripts/authority-evidence.mjs --check` | Revision 003 was stale after the source edit; revision 004 was minted, selected in `docs/evidence/current.json`, and verified with 34 bundle comparisons |
| Artifact-identity, verification and feedback edition checks | Passed at their retained selections; feedback carries WO-159's live audit; no live episode |
| `node scripts/harness-context.mjs --check` | Every role with a configured ceiling remains within it; refuter has no configured ceiling |
| `npm run plan -- check` | Passed with the existing release assignments and planning receipt |
| `npm run release -- prepare --local` | Target `v0.49.0` remains current under the existing minor classification |
| `git diff --check` | Clean, including the check recorded by the product gate |

The product gate judged code identity
`50f0c0565cad8d08212c08f30db6b5e43a3ff58d0f8fcf9c65aa5ae54c578f41` and tree
`304dc64e79883cc23b463d329af899d55365507e`. Its full result is retained in
`docs/control/local/harness/checks.json`. Documentation checks run after this
receipt is authored; their outcome and final counters are reported at the
handoff rather than copied into a new measurement of this receipt.

## Outcome and limits

The repaired path admits the reported prefix orders and reaches the write
refusal for each chained gate-input write. The regression establishes this
through generated hook processes and a live gate marker; it does not claim a
new interactive Claude or Copilot host session. D028 and D029's separately
registered observations retain their existing dispositions. The worktree's
adjacent queue has no queued or running item. No operator steering arrived
during this repair (actor-attested, not an inbox readback).

The release retains the integrated compiler `0.19.0` and skeleton `0.42.0`
versions recorded by D026. This repair adds no dependency. Product 07 already
states the required admission and refusal behavior, so D030 records the
implementation correction without changing that contract or the order's
criteria. Filed verification and final-review reports retain their bytes.

Economy: D001's existing focused-then-full strategy was followed, with no
second experiment. Its full harness run remains distinct from the product
gate. Entry usage was 49,399 total tokens, source `codex-transcript-counter`,
scope `dispatch`, cutoff 2026-09-25T15:27:53.079Z. Dollar cost is unavailable.
Final counters stay in the ignored usage receipt and the handoff response.

The executor handoff is `repair-complete`, for a fresh `resume: verify`.
Independent verification and final review judge this repaired subject in
their own dispatches.
