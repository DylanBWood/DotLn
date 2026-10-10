# WO-198 repair self-review

Dispatch: `resume: fix`, settling VER-001 F1. Root actor: Codex CLI 0.162.0,
gpt-6.1-sol, effort max, source codex-session-readback. No worker was
spawned for this repair; the executor skill requires fresh workers before
implementation-ready only. This repair uses two separate root review passes
and does not claim independent worker judgment.

Criteria pass: found 0; fixed 0; recorded 0. Read the five criteria,
VER-001's repair rule, the guard and its callers, the new fixtures and the
focused transcript. Whole-snapshot validation rejects every missing field
without changing the gate's exit code. The earlier and during-run intervals
are still compared independently. The fixtures assert the durable failure
row, complete new snapshots and exactly one summary, beyond a resolved
promise. Sixteen variants cover the quoted empty/missing-tags shapes and
additional malformed shapes. The null-tags case retains all four fields of
the during-run diagnostic. The original four cases also pass.

Design pass: found 0; fixed 0; recorded 0. The helper stays local to the
runner's diagnostic and checks both arguments before any nested access or
comparison. It accepts the producer's nonempty names, absent sentinel and
nonnegative safe-integer counts; it imposes no hash-format or tag-version
policy. A malformed latest row supplies no baseline rather than causing a
search of older rows or normalization to invented values. The guard changes
no row selection, task standing, identity calculation or snapshot producer. The
fixture reuses the existing disposable-root and capture helpers and cleans
up through each test's teardown.

Limits: these are root review passes, not independent verification. The
full review and document gates are recorded separately in handoff.md after
they pass. VER-001 B1 remains boarded on D004's existing follow-up
FUP-f5f10101e717d59b; neither its writer nor the previous-row selection is
changed by this repair. The reduced-table live-case and two-sample limits
recorded in D002 still apply.
