# WO-147 — Resident lock contention: a host lock that vanishes between a contender's check and its read is treated as absent or contended and retried, never thrown, so a presence command or a resident transaction under live contention waits instead of failing (version assigned at activation)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The worker store's acquisition path
re-inspects a lock that disappears under its guard; the resident store's
transaction retry keeps its pattern; the WO-143 boundary fixtures obtain
their dead process id at use. No event, envelope, schema, predicate or
guard-record change; a store written by v0.32.1 opens unchanged. Assigned
at activation under the standing opt-out default.
**Cost:** adds no step, gate, hook, key or receipt; adds one two-process
fixture that pauses a contender between its observation and its read of
`host.lock` (the existing pause-point fixture extended to those calls), one
probe for the retirement inference below, and one dead-process-id helper
in the existing resident suite (durations unknown until built). Removes the
one recorded ownerless way a live-contended store ends a resident
transaction or presence command: a raw `ENOENT` reproduced two runs each on
the working tree and on released v0.32.0 (WO-143 VER-001 O1), stated as a
limit in the capability table's `runtime.resident` row. Removes the
recorded load-dependent failure of a WO-143 boundary case under the
canonical product gate (WO-069 D015: one synthetic abandoned host pid
observed as live; the identical compiled test then passed alone across all
344 boundaries), if the dead-pid hypothesis holds; if it does not, records
the cause. Wall-clock, tokens and context bytes of the order itself are
unknown until run.
**Nomination provenance:** WO-143 D004 (the verifier's boarded defect:
"Planner: nominate a bounded order before WO-111's first unattended hour",
priority medium) and WO-143 FINAL-001 (the race written into the capability
row as a stated limit, "D004's follow-up is placed ahead of" WO-111's
question); WO-069 D015 (the gate failure, priority high). Planner-synthesized
in the 2026-09-21 standard pass; the dispatch is captured verbatim in
ignored intake (SHA-256 in the ledger section). Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-143 merged (the owned guard and reclaim path this order
sits beside; closed, v0.32.1).
**Recommended placement:** lane pair with WO-148, directly after the
WO-138 and WO-071 pair and before WO-100 and WO-111; it edits
`packages/skeleton/src/worker-store.ts` (`acquire`, and `acquireGuard`'s
retirement if the inference reproduces), `packages/skeleton/test/resident.test.ts`
and `packages/skeleton/test/fixtures/worker-lock-process.ts`; WO-148 adds a
control-plane script and touches none of them. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-143",
    "relation": "satisfied-by-close",
    "reason": "the owned recovery guard and dead-owner reclaim this order keeps"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-143/decisions.md`
§WO-143-D004 (the race, the two-run reproduction and the retirement
inference) and §WO-143-D006 (the measured lock cycle);
`docs/final-reviews/WO-143/FINAL-001.md` (the race as a capability-row
limit); `docs/evidence/WO-069/decisions.md` §WO-069-D015 (the gate
failure); `packages/skeleton/src/worker-store.ts` (`acquire`: `present(lock)`
followed by `regularFile(lock)` and `readFileSync(lock)`; `acquireGuard`:
the retired target and its `rmSync`); `packages/skeleton/src/resident-store.ts`
(`transaction`: the retry pattern `already has a live host|recovery is busy`,
200 attempts at 10 ms); `packages/skeleton/test/resident.test.ts` (the four
WO-143 tests); `packages/skeleton/test/fixtures/worker-lock-process.ts`
(the pause-point peer); 03-architecture.md §Operator-presence policy (the
lifetime worker-store lock paragraph).

**Objective:** Under live contention, when a holder releases `host.lock`
after a contender has observed it and before the contender has read it,
`WorkerStore.acquire` re-inspects under the guard it already holds and
proceeds with the lock's true state (absent, or present with an owner whose
liveness is judged as today); no presence command or resident transaction
fails with a raw `ENOENT` from `host.lock`. The verifier's unreproduced
inference, a delayed claimant linking into a retired target during its
`rmSync` and making retirement throw `ENOTEMPTY` after `host.lock` is
published, is either reproduced and closed or recorded as not reproducible
with the exact probe that tried. The WO-143 filesystem-boundary fixtures
take their dead process id at the moment of use and assert its deadness,
so a pid reused under the product runner's concurrent load is a measured
condition, not an assumed one.

**Observed gap (dated 2026-09-21, `main` at `502d85f9`):**

- `acquire` checks `present(lock)`, then calls `regularFile(lock)` and
  `readFileSync(lock)` with nothing between them that tolerates the lock's
  removal; `ResidentStore.transaction` retries only the two messages
  `already has a live host` and `recovery is busy`, so the `ENOENT`
  propagates and the command or transaction fails. WO-143's verifier paused
  a contender after `present(host.lock)` while the holder released and got
  `ENOENT` on the working tree and on released v0.32.0, two runs each
  (D004). No event is written or lost and the store stays openable, which
  is why WO-143 boarded it instead of fixing it.
- The retirement inference (a delayed claimant linking into a retired
  target during `rmSync`, `ENOTEMPTY` after `host.lock` is published) was
  never reproduced (D004).
- During WO-069's canonical gate the WO-143 boundary matrix observed one
  synthetic abandoned host pid as live and failed; alone, the same compiled
  test passed all 344 boundaries. The pid-reuse hypothesis is unvalidated
  (WO-069 D015). The fixture's result file was already made atomic by
  WO-110 D006 for a different load-dependent failure of the same suite.

**Design (scope discipline):**

- The guard already excludes new writers; a holder's release is the only
  change that can happen to `host.lock` under it. So a vanished lock means
  the holder is gone: on `ENOENT` from the lock's stat or read, `acquire`
  re-runs the lock inspection once under the same guard and continues with
  what it finds. A lock that is present on re-inspection is judged exactly
  as today (a live owner refuses, a dead owner is reclaimed after the
  positive replay). No new error class and no wider retry regex: the
  transaction's retry pattern is unchanged, so a missing log or a malformed
  lock still refuses.
- The retirement inference gets a deterministic probe: the pause-point peer
  pauses inside the retirement's `rmSync` while a delayed claimant links.
  Reproduced, the retirement tolerates the late link (retry the removal
  after re-checking the canonical link, with the guard intact). Not
  reproduced after the probe's attempts, the decisions file records the
  probe and its result and the inference closes as unobserved.
- Each WO-143 boundary fixture spawns and waits for a short-lived child
  immediately before it needs a dead pid, records that pid, and asserts
  `process.kill(pid, 0)` throws `ESRCH` before and after the boundary.
  The named case then runs ten times under `npm test`'s concurrent load and
  ten times alone; a remaining failure is recorded with its cause, not
  retried away.
- Fail-conservative: every doubt refuses. The order widens what waits; it
  never widens what is written or reclaimed.
- **Declined alternatives, recorded:** retrying any `ENOENT` in
  `transaction` (would retry a missing log); a cross-process mutex or a
  lifetime lock (a new mechanism larger than the defect, and WO-143 declined
  the lifetime lock for the same reason); documenting the race and moving
  on (WO-111's first unattended hour would meet an ownerless defect, the
  reason D004 rejected NoOp).

**Deliverables:** the acquisition change; the retirement probe and, if it
reproduces, its repair; the dead-pid helper and the fixture changes; the
write-backs in criterion 5.

**Acceptance criteria (all required)**

1. Fixture, two real processes: the contender pauses after observing
   `host.lock` and before reading it, the holder releases, the contender
   resumes and acquires; no `ENOENT`, every prior event byte-identical, and
   `ResidentStore.transaction` completes on the contended path. A mutant
   with the re-inspection removed fails this fixture (the discriminating
   assertion WO-143 F2 required, applied here).
2. Probe: a delayed claimant links into the retired target while
   retirement's `rmSync` is paused. Either the `ENOTEMPTY` reproduces and
   the repaired retirement completes with the guard intact and the claimant
   refused, or the decisions file records the probe (pause points, attempts,
   observed outcome) and that the inference did not reproduce.
3. Every WO-143 boundary fixture obtains its dead pid at use and asserts
   deadness before and after; the case WO-069 D015 names passes ten
   consecutive runs under `npm test` and ten alone, both recorded; a
   remaining failure is recorded with its cause.
4. Live, unreadable and legacy guards refuse unchanged; a store written by
   v0.32.1 opens unchanged; the lock-cycle cost D006 measured (about 19 ms)
   is re-measured and reported with the change.
5. Write-backs land: the capability table gains a dated reassessment for
   `runtime.resident` that removes the contention limit or states what
   remains, judged by verification and final review; product 03's lifetime
   worker-store lock paragraph; the decisions file.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts and the probe record; `npm test`
once at final review. WO-111's first unattended hour is the reopening
observation.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** the quadratic append; a lifetime lock; the resident NoOp
identity by phase and arm generation (WO-142 D002, replay-sensitive and
separate); the unattended hour (WO-111); any change to what a dead-owner
reclaim writes.

**Operator-review assumptions**

1. Re-inspection inside `acquire` is preferred to a new retryable error
   class; the transaction's retry pattern stays as it is.
2. The pid-reuse hypothesis is tested by the fixture, not assumed by the
   order; a cause that turns out to be elsewhere is recorded, not hidden.
