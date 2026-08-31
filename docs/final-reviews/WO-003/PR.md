## What this merges

The v0.2.0 walking skeleton: the 13-step Repo Gardener + Seiri vertical running
end-to-end against deterministic fakes — CLI, fake executor/verifier adapters,
fixture repo tree, JSONL event log, live-vs-replay decision traces, and the
zero-asset emoji-glyph scene (`packages/skeleton/`).

Alongside it, the operator machinery the WO-003 ideation expansion authorized:

- **Resume control plane:** append-only `docs/control/resume.jsonl`, generated
  `current.md` projection, and `scripts/resume.mjs` with the
  `resume: <intent>` dispatch protocol wired into the executor contract.
- **Worktree lifecycle helper** (`scripts/worktree.mjs`): guarded start /
  publish / finish with real-Git integration tests.
- **Intake backup utility** (`scripts/backup-intake.sh`) with its executable
  test suite.
- **Ideation-breakout doc surfaces:** `docs/product/10-ir-compatibility.md`
  plus updates across the domain model, architecture, interfaces, roadmap,
  execution guide, README, and PLAYBOOK.
- **Two repair guards** from the operator-authorized addendum: R1 —
  non-destructive recovery checkpoints (`refs/dotln/checkpoint/…`) before every
  resume transition; R2 — `worktree finish` refuses while any non-disposable
  ignored file remains (the `.env`-loss hazard closed end-to-end).

## Evidence

- `npm test`: 68/68, exit 0 (kernel, skeleton, backup, resume, checkpoint,
  worktree suites).
- `node packages/skeleton/dist/src/cli.js`: 21-line timeline, glyph scene,
  `verified=true candidates=1`.
- From-clean rebuild byte-identical to the committed `dist`.
- The crash-recovery mutation that exposed VER-001's blocking defect now fails
  the suite; live and replayed runs produce identical decision traces.

## Verification trail

- `docs/verifications/WO-003/VER-001.md` — fail; one blocking evidence-gate
  defect (crash-recovery test not bound to the durable log).
- Repair: `5e243d6` (blocking fix, committed alone), `5499f03` (R1),
  `56afa05` (R2), `5928d81` (hardening).
- `docs/verifications/WO-003/VER-002.md` — pass; both addendum guards meet
  their acceptance evidence in full.
- `docs/final-reviews/WO-003/FINAL-001.md` — pass, with six bounded
  documentation corrections applied at review (`6fb0043`).

## Known open items

Non-blocking findings are enumerated in the two VER reports and carried
forward, not restated here. Follow-on work recorded out of scope in the repair
addendum: intake durability beyond git checkpoints, checkpoint retention and a
`recover` action, verdict-time evidence sealing, and a standing hazard-drill
suite. Ledger entries for the R1 recovery-point concept and IDEA-02 await
planner synthesis. Tagging `v0.2.0` is a separately authorized post-merge
action per the work order's release policy.
