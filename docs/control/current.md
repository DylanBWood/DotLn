# Current control state

## WO-235

- Work order: WO-235
- Work-order path: docs/work-orders/WO-235-no-artifact-shaped-by-its-predecessor.md
- Phase: closed
- Latest verification: VER-005
- Verification path: docs/verifications/WO-235/VER-005.md
- Latest verdict: pass
- Final review: FINAL-001
- Final-review path: docs/final-reviews/WO-235/FINAL-001.md
- Latest attestation: harness claude-code; version 2.1.314; model claude-fable-5-1; effort xhigh; source claude-session-readback; account not-applicable
- Effort drift: max -> xhigh
- Latest recordedAt: 2026-10-30T05:55:37.053Z
- Elapsed implementation: unknown
- Elapsed verification: 0 h 10 min
- Elapsed repair: 1 h 39 min
- Elapsed finalReview: 0 h 28 min
- Latest checkpoint: 9ce3676462f8c2746e990c789d9b671155992927 (restore: `git checkout refs/dotln/checkpoint/WO-235/28 -- .`)
- Legal next actions: release-close, next, activate
- Legal off-ramps: correct, override-record
- Bound acceptances: active wallClockMs=10 h 0 min (ordinal 2); active wallClockMs=11 h 0 min (ordinal 3)
- Override records: ordinal 5 (bypassed implementation-ready active-phase precondition for correction of premature completion; effects preserved ImplementationReady ordinal 4 and its checkpoint, recorded superseding ImplementationReady after current full-review and document evidence checks, kept ready-to-verify phase without dispatching another role), ordinal 13 (bypassed verification-result direction check on VER-001's ten pre-repair messages (VER-002 F6), criterion 10 document row at the final platform-document identity; effects VerificationCompleted VER-002 fail appended through the control append path with checkpoint refs/dotln/checkpoint/WO-235/11, document gate run 9412160a stopped after 0 h 12 min waiting on another checkout's host lanes), ordinal 14 (bypassed dotln-hook-enforcement; effects unobserved)

Generated from the append-only `docs/control/resume.jsonl` and `docs/control/orders/WO-NNN.jsonl` segments; do not edit this projection manually.
