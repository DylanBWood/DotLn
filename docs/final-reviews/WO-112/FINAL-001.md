# WO-112 FINAL-001 — final review

**Verdict:** pass, by operator override. WO-112 asked for one witnessed run of WO-123's composition from a scratch issue to a reviewed pull request, measured and scored item by item against v1's loop, and, under the operator's scope expansions, the run-time intake and triage episodes, the review-check wait, the Codex writer's launch repair and host integrity checks for every writer. All six criteria are met on carried run evidence and a fresh `npm test -- --review` at the unchanged code identity. This review found one defect it judged blocking: a writer launched through the vertical records no process group, so after a crash or interrupt the issue is sealed `refused` even when the writer finished cleanly (F1, [D065](../../evidence/WO-112/decisions.md#wo-112-d065--board-at-the-operators-override-a-vertical-writer-that-records-no-process-group-so-its-recovery-seals-the-issue-refused)). The operator directed under `operator override:` that F1 be boarded as a follow-up and the order passed ([D067](../../evidence/WO-112/decisions.md#wo-112-d067--record-final-001-as-a-pass-at-the-operators-explicit-override)). This pass is operator-authorized, not a measured passing review. A second finding, a mislabelled interruption reason, is boarded (F2, D066). The review also made two failures of its own, recorded in D063 and D064.

**Subject:** [`docs/work-orders/WO-112-core-run-loop-proof.md`](../../work-orders/WO-112-core-run-loop-proof.md) on branch `wo-112`, uncommitted on `HEAD` `8218616b`, which is `main` and `origin/main` (`git ls-remote origin refs/heads/main` at review). No integration was needed, so no integration decision or merge commit exists, and every claim below judges the same base the verifications judged. The dispatch checkpoint is `refs/dotln/checkpoint/WO-112/31` (`c2a57ee0`).

- The reports: the recorded `reportHash` of VER-001 to VER-007 each equals the report's current SHA-256.
- Carried bytes: a temporary-index snapshot of the working tree differs from VER-007's subject, checkpoint 28 (`87d5729f`), only in decisions, VER-007's report and evidence, the decisions index, the register and control projections; no file under `packages/`, `scripts/` or `.claude/` differs.
- The order: it differs from `main` by the scope expansions D012, D015, D017 and D022–D025 and the release classification, bound by `PlanExecutionAmended` rows that the document gate's planning suites check.
- Ideation: no ideation breakout receipt applies, and `docs/evidence/WO-112/` holds none. The operator's scope expansions are recorded in D012's `operatorAuthorization` and the amended order; the operator directions during verification are in D059 and D062, and those during this review in D063, D064 and D067.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.292","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session. During the review they said they would pass the order whatever the review found, directed the two corrections recorded in D063 and D064, and then gave `operator override: mark F1 blocking w/e as a follow up and pass this work order`, followed by `operator override: off`; the harness appended `OperatorOverrideRecorded` at control ordinal 31. The harness version is `claude --version`. The model is this session's model as the host reports it. Effort `xhigh` is `CLAUDE_EFFORT` as this session read it: the selected effort, not the effective one. The order recommends `reviewer any`.

Subagent plan, stated before the first spawn: one fresh `dotln-worker` adversary over the order and the whole subject diff, no descendants, against the cap of 20 with 0 observed at entry. One was launched by type with no model override. The host reported 248,326 worker tokens, 99 tool uses and 1,074,077 ms. The counter at handoff reads 1 subagent, exact-observed, 19 remaining, uncounted remainder unknown.

**Process cost:** entry 41077 tokens; handoff 19989897 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage d373f892-d493-4b42-814a-932b75a7b650`. Entry was observed at 2026-10-07T04:44:28.685Z and handoff at 05:25:45.557Z over 122 steps and 107 commands, before this report, the release text, the result transition and publication. Both count reused cached input, so they do not measure live context. Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. The adversary's tokens are the host's figure, outside the root total. The largest waits were the product gate (1,860,352 ms) and the adversary (1,074,077 ms), which ran concurrently; see D063.

## Goal-aligned judgment

The mission contribution is the first unaided issue-to-PR loop, which WO-118 waits on. That loop's evidence holds; its recovery after an interrupt does not.

- **Rule beating and seeking the wrong goal:** VER-007's operator-directed pass was not taken as the goal. The review re-derived the subject, ran the gate fresh and executed the adversary's claims before routing them.
- **Policy resistance and fixes that fail:** seven verifications each found new recovery defects in the integrity machinery. F1 is one more, at the seam between the vertical's wrapper and the host; D065 names a repair rule that keeps D028's checks.
- **Shifting the burden:** the operator chose F1's route, which only the operator's override can do. WO-118 inherits D060 and D065 and should repair them before relying on stop-and-rerun.
- **Drift to low performance:** the stale "review pending" status in this order's own capability-table row was corrected in place before merge.
- **Escalation and the commons:** one worker and one gate. The review cost the commons twice: its adversary's probes were starved by its own gate (D063), and it briefly put the operator's profane wording into a public record (D064).
- **Naive Interventionism:** the review changed no behavioral source.
- **NoOp:** leaving the order unmerged keeps WO-118 blocked.

## Criteria

- **Criterion 1:** met. The repair representative (issue 3, Claude workers) and control (issue 4, Codex workers) receipts are byte-identical to the evidence VER-002 to VER-007 judged; VER-003's read-only forge readback at its cutoff found both pull requests open and unmerged at their recorded heads with generated title and body, every inline thread resolved and the control's rejection carrying evidence. The representative's inline suggestion was accepted, repaired, re-verified and resolved, its summary acknowledged, terminal `resolved`, nothing `NeedsHuman`; the control rejected the incorrect suggestion with contract, page and host-test references, terminal `resolved`. No visual criterion was filed. No new forge read ran in this review.
- **Criterion 2:** met, on the unchanged outward receipts: the configured outward lint passes every branch, title, body and commit artifact, and the tree scans find no declared term or prefix. Coverage is the declared set only.
- **Criterion 3:** met. The receipt's measures carry their methods, and all eight parity items are scored observed-met for the two repair runs, each with its evidence; the earlier runs keep their D013 scores.
- **Criterion 4:** met. Every measure and parity row is labeled `observed`, `launch-claim` or `unknown`; model tokens, cost, human touch time and main-thread context are `unknown`.
- **Criterion 5:** met.
  - Product 06 grows by 201 bytes (79,690 → 79,891) and product 12 by 163 (18,164 → 18,327), against limits of 300 and 200, both in place.
  - The README sentence sits inside the release block, whose version line is rewritten to `v0.68.0`; it continues an existing paragraph rather than adding one after the block. The adversary read it as appended; this review judges it folded, as VER-001 and VER-002 did.
  - The capability table appends the dated `vertical.source-to-pr` section; this review corrected that unmerged row's status from "verification/review pending" to the actual results.
  - Decisions D001–D067, their index rows and the publication locks are present; the document gate checks them.
- **Criterion 6:** met.
  - `npm test -- --review` passed at code identity `b47f2d3090c98aebafedbd5ccf7a490e233877d7fabdf4c4961e4c7fba3fa926`: 38 passed, 0 failed, 1,860.35 s, 88 fresh tasks, forced-fresh by the review selection, identity and build output unchanged, recorded 2026-10-07T05:19:01.282Z.
  - `npm run test:docs` runs inline in the result transition with `git diff --check`; `git diff --check` and `git diff --cached --check` exited 0 before the gate.
  - Dependencies: the skeleton moves 0.53.1 → 0.54.0 and the console's exact pin and the lockfile follow; nothing else changes and no dependency is added.

## Findings

### F1 — a writer launched through the vertical records no process group; crash and interrupt recovery seal the issue `refused`

**Route:** follow-up at the operator's override; the reviewer judged it blocking. **Class:** escape. It was present in every verified subject since D027/D028 and inside verification's review scope: VER-003 considered a null group and judged it "not reachable on the supported macOS host".

`verticalTransport` (`scripts/lib/vertical-transport.mjs`) returns its dispatch before it launches the inner one and exposes no `processGroup`. `SourceChangeHost` records `SourceChangeProcessStarted` right after `dispatch()` (`source-change-host.ts:733`), so every vertical writer is recorded with `processGroup: null`. Recovery of an unreceipted attempt now requires that group (`:509-521`). After the host dies while a writer runs, the next invocation throws, `VerticalHost` records the step `refused` (`vertical-host.ts:203-216`), and the fold seals the terminal `refused` (`vertical.ts:855-865`). The same crash through the direct transport recovers, and the vertical recovered at `HEAD`. Without a group, `settle()` also checks `alive()` once after the wrapper's early rejection, so an authority interruption throws "source-change worker has not terminated" and records neither `SourceChangeProcessStopped` nor `WorkerInterrupted`.

Reproduction, executed by this review after the gate:

```zsh
node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs
```

2026-10-07T05:22:24.865Z–05:22:30.195Z, exit 0:

| Case | Recorded group | Outcome |
| --- | --- | --- |
| crash-vertical | none | recovery throws "source-change recovery lacks worker termination evidence" |
| crash-direct | 75082 | recovery `observed` |
| revoke-vertical | none | first run throws "source-change worker has not terminated"; no stop or interruption recorded |

This is distinct from D060: D060's repair acts on a recorded group that is still alive, and through the vertical no group is ever recorded. D065 holds the repair rule and regressions.

### F2 — host admission refusals after a writer's result are recorded as `WorkerInterrupted` "transport-failed"

**Route:** follow-up. **Class:** escape. This order moved `tree.effect()`, the one-commit host-message check, `observe()` and receipt save inside the dispatch `try` (`source-change-host.ts:789-818`; at `HEAD` they followed it at lines 547 and 558). A plain error from any of them is recorded as a transport failure. The refusal still happens and no work is accepted; only the reason is wrong (D066).

### Adversary items not counted here

- Writers outliving a terminal interrupt is D060, passed at VER-007's override; this review's run of the adversary's interrupt probe reproduced it again (writer alive 1.5 s after the host's SIGINT).
- Unbounded paid retries of a judgment that fails identically are D061, already boarded.
- The README write-back is judged folded, under criterion 5.
- Grafts were judged unreachable for the Codex writer and only able to fake a commit count; not pursued.

The adversary's probes, run by this review at 05:19:55Z–05:21:06Z under `harness bounded`, gave the same outcomes as the committed probe above.

<!-- dotln-findings:start -->
[
  {"id": "F1", "route": "follow-up", "class": "escape", "summary": "A writer launched through the vertical records no process group, so crash or interrupt recovery seals the issue refused (D065; blocking in the reviewer's judgment, boarded at the operator's override)."},
  {"id": "F2", "route": "follow-up", "class": "escape", "summary": "Host admission refusals after a writer's result are recorded as WorkerInterrupted transport-failed (D066)."}
]
<!-- dotln-findings:end -->

## The review's own failures

- **D063:** this review dispatched its adversary with instructions to run probes under `harness bounded` and then started the `--review` gate 61 s later. The live gate refused every probe, so the adversary returned source inferences only, at 248,326 tokens and 1,074,077 ms. WO-187's FINAL-001 records the same collision. The probes were run by the reviewer after the gate; D063's follow-up asks for a mechanical guard.
- **D064:** when recording D063, this review copied the operator's profane wording verbatim into a public decision record. It was replaced with a neutral classification within minutes, before any commit or push; a case-insensitive search of the working tree, the index and the scratch diffs then found no match.

## Handoff

The adversary has ended and every probe has finished; no background monitor remains. On recording, this review commits the reviewed state, pushes `wo-112` and opens its PR with [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md). The operator keeps merge authority. D060, D061, D065 and D066 are open follow-ups in the register; WO-118 should take D060 and D065 before it relies on stopping and rerunning a vertical.
