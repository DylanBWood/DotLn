# Current control state

## WO-276

- Work order: WO-276
- Work-order path: docs/work-orders/WO-276-the-queue-lands-as-one-order.md
- Phase: closed
- Latest verification: VER-007
- Verification path: docs/verifications/WO-276/VER-007.md
- Latest verdict: pass
- Final review: FINAL-002
- Final-review path: docs/final-reviews/WO-276/FINAL-002.md
- Latest attestation: harness claude-code; version 2.1.325; model claude-fable-5-2; effort max; source claude-session-readback; account not-applicable
- Effort drift: xhigh -> xhigh (subagents) (raw: ultra) -> max
- Latest recordedAt: 2026-11-14T19:07:59.550Z
- Elapsed implementation: 56 h 6 min
- Elapsed verification: 0 h 13 min
- Elapsed repair: 1 h 35 min
- Elapsed finalReview: 1 h 17 min
- Latest checkpoint: deef765dcb1318c4decb24838d072403bf19973e (restore: `git checkout refs/dotln/checkpoint/WO-276/102 -- .`)
- Legal next actions: release-close, next, activate
- Legal off-ramps: correct, override-record, retract
- Bound acceptances: active wallClockMs=24 h 0 min (ordinal 2); active subagentCap=100 (ordinal 3); active wallClockMs=48 h 0 min (ordinal 4); active subagentCap=220 (ordinal 5); active wallClockMs=72 h 0 min (ordinal 6); active wallClockMs=96 h 0 min (ordinal 7); repairing subagentCap=50 (ordinal 33)
- Defective criteria: 51 (contradiction, ordinal 10), 121 (contradiction, ordinal 11), 123 (contradiction, ordinal 12)
- Criteria: 51 defective (contradiction) by ordinal 10 (executor: unmet at handoff, ordinal 38); 121 defective (contradiction) by ordinal 11 (executor: unmet at handoff, ordinal 38); 123 defective (contradiction) by ordinal 12 (executor: unmet at handoff, ordinal 38)

Generated from the append-only `docs/control/resume.jsonl` and `docs/control/orders/WO-NNN.jsonl` segments; do not edit this projection manually.
