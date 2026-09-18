# WO-139 — Repair of FINAL-001

Operator dispatch: `resume: fix`, 2026-09-18. The selected failure source is
[FINAL-001](../../final-reviews/WO-139/FINAL-001.md), findings F1 and F2.
Both findings are repaired; independent verification and final review remain
separate dispatches. [D006](decisions.md#wo-139-d006) records the choice,
alternatives, goal contribution and reopening conditions.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"xhigh","mode":"subagents","raw":"ultra","source":"codex-session-readback"}

## F1 — Installed cap behavior follows the pinned module

`scripts/lib/harness.mjs` now includes `subagent-budget.js` in its existing
runtime declaration. Module-only changes therefore affect snapshot identity,
snapshot reuse and integrity checks. The generated hooks and manifest were
regenerated; authority evidence is now [revision 003](authority/003/authority.json),
with its [bundle comparison](authority/003/bundle-diff.json). Earlier editions
and the original failure probes retain their bytes.

The new harness regression changes only the fixture's built cap default from
20 to 21. It asserts a new snapshot, current installed bytes, unchanged prior
snapshot bytes, and the changed default through the generated Stop hook. It
then alters and removes the installed cap module: both fail integrity checking
with the module named. Generated permission hooks retain advisory/no-denial
fallback, reporting `pins-differ` for changed bytes and `snapshot-missing` for
the missing pinned module.

## F2 — Budget and classification advisories keep separate throttles

The host marks actual budget responses at their creation sites with an internal
WeakSet. Both permission admission and SessionStart initialization warnings
carry that provenance; serialized host responses acquire no extra field.
Remote-agent classification messages no longer enter the budget bucket merely
because their text contains “subagent.”

The process regression checks that a missing-counter budget advisory is shown
once and suppressed on repetition, while the remote-agent classification
advisory still appears and suppresses the subsequent unclassified-tool message.
Suppressed messages retain journal evidence. The completion regression now
checks both the subagent summary and observed-facts section while preserving
its no-denial and writer-release assertions.

## Executed evidence and limits

- Before the source repair, the focused regressions reproduced unchanged
  snapshot identity after the module-only edit and the classification-throttle
  failure. After repair, all three focused cases passed.
- `npm test -- --review`: 32 suites passed, zero failed, including the complete
  harness and process-debt suites. The current-code gate and detailed timing
  remain in `docs/control/local/harness/checks.json`; the repair transcript is
  `docs/control/local/wo139-repair-review.txt`.
- Generated harness integrity and authority revision 003 checks passed;
  artifact, verification and feedback evidence checks passed with their
  existing selected editions.
- Planning continuation, formatting of the changed source and `git diff --check`
  passed. The adjacent queue has no unfinished item.
- `release prepare --local` confirmed the existing patch target `v0.29.5`;
  compiler `0.13.2` and skeleton `0.25.4` remain the staged component versions.
  No dependency was added.

One read-only helper reviewed both findings and the completed four-file code
delta, with no descendants or additional writer. Its review found no further
defect; executed checks provide the passing evidence. The observed benefit is
that module-only drift is detected and the previously failing review gate now
passes. No total-cap coverage expansion or performance improvement is claimed.
Codex enforcement remains role text, and unobserved agents remain unknown.
The local-terms list was unavailable; source was screened against the project's
clean-room floor. Final usage observations remain in ignored receipts and the
handoff response. No branch commit or publication was performed.
