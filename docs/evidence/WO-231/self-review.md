# WO-231 executor self-review

Two fresh independent `codex-spawn-agent` workers received only the work order and
the authored diff, with no inherited conversation. Both were launched with
`gpt-6.1-sol`, effort `max`; these are launch selections, not effective-effort
readback. They made no writes, ran no gates and launched no descendants. Session
fan-out was 2 of the configured 20-agent cap.

## Criteria adversary

Found 1 (P2): `controls.json` contained only the pre-change refusal, while criterion
1 requires both arms' exit codes and the unchanged activation base. Remedy: record
the executed post-change scenario. The worker found the shared rule, no-fetch
scope, unchanged lifecycle code and preserved existing tests consistent with the
order; it explicitly did not claim executed gate evidence.

Disposition: fixed in `controls.json` from the first complete run's passing
`target-worktree:file:test-target-worktree-start.mjs` task. Its assertions prove
transition exit 0, FinalReviewCompleted and the unchanged activation base. The
record states that the complete run itself failed separately on the inventory.

## Design and maintainability improver

Found 1 (medium), the same evidence gap: post-change exit codes and command
provenance were missing. It reported 0 demonstrated implementation defects and
found the helper independent of the publication runtime, with the existing rule
preserved and the diagnostics and cases within scope. It ran no tests.

Disposition: fixed by the same executed control record and explicit provenance.

self-review: found 2; fixed 2; recorded 0

These are the two workers' counts; they identified one unique issue. The complete
run subsequently found a separate test-inventory mismatch, corrected in the
fixture snapshot and the runner's exact-count assertions. The bounded reproduction
of that check passed; D004 records the correction. The fresh complete run passed
at 2026-10-25T02:07:18.989Z: 36 suites, 102 fresh tasks, no failures and no
unrun tasks. The code and build identities stayed unchanged throughout it.
