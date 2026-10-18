# WO-216 executor self-review

Two fresh read-only workers received only the order and the fixed diff packet, without the executor’s reasoning or test claims. They were requested as `gpt-6.1-sol` at `max`, with no descendants. The third known worker in this session was the live feedback verifier (D013); the cap is 20. These are requested settings, not a claim of effective model internals.

## Criteria adversary

Found 3. The worker reported:

1. The configured-control fixture’s copied files were independent of its declaration, allowing declaration-only repair to hide a late omission.
2. A directory declaration admitted an absent entry or imported path because existence was checked only for explicit files.
3. Generic artifact sentinels and an injected feedback refusal did not establish the real inventory’s commands, dependencies, publication writer, carry refusal or runner stale row.

All three are fixed: narrow-copy fixtures consume their declared files; required directory-covered paths must exist except explicit doubles; the real-inventory fixture uses an isolated repository, genuine stale outputs, the actual sync writers and refusals, and a runner invocation. The bounded full sync probe passed all four cases at 2026-10-17T20:56:14.409Z, including byte-for-byte second-run stability. Final handoff gate evidence is recorded in the handoff.

## Design improver

Found 2. The worker independently reported the same copy/declaration drift and an execution-error classification defect: after a peer failed, a running task’s rejected execute promise could be recorded as unstarted cancellation.

The copy repair covers both workers’ first finding. The scheduler now distinguishes lane admission from begun execution and preserves a running peer’s exception as an executed failure, with timestamps and its original message. The bounded regression probe covers both a cancelled lane wait and a running peer rejection.

The improver also checked that the 29 moved launchpad case bodies match the original bodies, apart from moving the shared root declaration. Both reviews were static; neither worker ran a gate or changed a file. Five reported findings represent four distinct issues, all fixed: adversary 3 found / 3 fixed / 0 recorded; improver 2 found / 2 fixed / 0 recorded. Validation and final dispositions are in handoff.md.

After those reviews, execution of the exported-instance case required the compatibility updates recorded in D018: its assertions now account for structural admission, generated aliases and the separate structural row. All 29 case names remain unchanged; the earlier body comparison describes the packet the worker actually reviewed.
