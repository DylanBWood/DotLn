# WO-147 implementation — resident host-lock contention

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-5.6-sol","effort":"xhigh","source":"codex-session-readback"}

Dispatch: `resume: next`, 2026-09-21. The canonical selector chose active
WO-147 in `/Users/dylanwood/Projects/DotLn-wo147`, with this Codex session as
the one registered writer. Zero subagents were spawned against the cap of 20.
No commit, push, pull request, deployment, tag or package publication was
performed.

`WorkerStore.acquire` now re-inspects `host.lock` once, under the existing
acquisition guard, when the first inspection loses a lock to `ENOENT`. The
second observation is handled by the existing absent/live/dead logic; malformed
state and every non-`ENOENT` failure still refuse. Filesystem codes survive the
path-named decoder, so the change retains WO-048's read-attribution invariant.
`ResidentStore.transaction` keeps its retry expression and no event, envelope,
schema, predicate or guard record changed.

The real-process fixture covers direct acquisition and a resident transaction:
the contender pauses after `lstatSync(host.lock)`, the holder releases, the
contender resumes and succeeds, and prior event bytes remain identical. Removing
the guarded second inspection makes that fixture fail on raw `ENOENT`; restoring
it passes. The retirement probe did not reproduce the proposed `ENOTEMPTY`
failure in 20 attempts, so the production retirement path is unchanged.

Application `v0.39.1` is staged under the order's patch classification, the next
patch above the observed local annotated `v0.39.0` tag. Skeleton advances from
`0.34.0` to `0.34.1`, and console's exact skeleton pin advances with it. No
third-party dependency changed.

## Acceptance evidence

- **Criterion 1 — contention.** The direct and resident paths pass with two
  real processes; event-log bytes are unchanged. The single-inspection mutant
  fails in 193.86 ms on `ENOENT` from `lstat(host.lock)`. The restored combined
  contention/retirement selection passes in 4.161 s.
- **Criterion 2 — retirement.** Twenty deterministic attempts paused the
  retiring owner before `rmSync`, placed a delayed hard-link claim in the
  retired target after `host.lock` publication, and observed 20 original
  acquisitions plus 20 delayed refusals. No attempt produced `ENOTEMPTY` or a
  retirement failure. D003 records the exact negative disposition.
- **Criterion 3 — dead PID and stability.** Each of the four WO-143 fixture
  families creates a fresh just-exited PID at use and asserts `ESRCH` after the
  boundary. The named 344-boundary case passed ten final-code runs under the
  skeleton runner's file concurrency and ten final-code runs alone: **20/20,
  6,880 crash boundaries**. Runner wall seconds were 260, 266, 264, 264, 263,
  264, 262, 261, 313 and 297 (2,714 s total); isolated wall seconds were 157,
  158, 157, 194, 210, 158, 157, 154, 160 and 156 (1,661 s total).
- **Criterion 4 — refusals, compatibility and cost.** The final relevant
  selection passes live, unreadable, legacy, malformed, concurrent-reclaim and
  delayed-claim guards plus the two WO-147 cases: six selected tests, zero
  failures, 5.066 s. The released-event compatibility fixture remains in that
  selection. Two 400-cycle measurements after 20 warm-ups report medians
  17.942 ms and 17.296 ms (p99 23.174 and 23.167 ms), versus WO-143's recorded
  approximately 19 ms median.
- **Criterion 5 — write-backs.** Product 03 explains the bounded re-inspection
  and fresh PID evidence; the capability table carries its dated staged
  reassessment; D001–D007 record the decisions, corrections, stability evidence
  and reopening conditions.
- **Criterion 6 — final gate.** `npm test` passed **22 suites, 0 failures** in
  287.06 s with 66 fresh tasks; skeleton passed in 284.10 s. `git diff --check`
  and `npm run format:check` are clean. `npm run release -- check-surfaces
  --local`, `npm run publication:check` and `npm run plan -- check` pass. No
  dependency was added. The skeleton bump changed one embedded generated
  version; `harness emit` refreshed it and `harness check` passes all 31
  generated surfaces.

[Fixture and stability evidence](fixtures.md) records the commands, pauses,
timings, mutation and discarded pre-final observations. [Decisions](decisions.md)
records the bounded design and the independent-refutation carry-in. Verification
and final review remain separate dispatches.

## Economy and process cost

The equipped economy question considered a permanent command for the one-off
ten-plus-ten protocol. A bounded consumer search found no second user, so D002
keeps the existing npm and Node commands and adds no recurring command surface.
The search took 0.1 s; separately attributable preparation, recording and token
costs are unavailable. The repeated stability evidence cost 4,375 wall seconds
across the two retained series, excluding build and orchestration overhead.

At entry and handoff the native usage command returned `Begin the harness
session before measuring usage`. Therefore the available session total is
unknown, its source is unavailable, its scope is unknown and its cutoff is
unknown; an unavailable counter is not zero.

## Limits and follow-up

The proof assumes conforming local writers honor the acquisition guard. A
hostile same-user process that creates or removes `host.lock` behind that guard
is outside this order. Only `ESRCH` establishes death; ambiguous liveness still
refuses. The negative retirement probe pauses at the recursive removal entry,
not inside a native directory traversal, and D003 states when that inference
reopens. The repeated fixture evidence addresses the observed synthetic PID
reuse hypothesis; it does not claim the first unattended hour owned by WO-111.

Follow-up queue revision 0 is empty at entry and handoff. The WO-048 static-read
failure encountered during the first runner-loaded attempt was repaired inside
the order (D007), not deferred. No adjacent defect remains diagnosed and
unfixed.
