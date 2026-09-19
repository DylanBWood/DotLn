# WO-143 — Resident lock recovery: a resident killed at any instant restarts without a human, because the lock-recovery guard names its owner and a dead owner's guard is reclaimed after the same inspection a dead owner's lock gets (v0.32.1)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. The worker store's acquisition guard
gains an owner record and a reclaim path; the resident's polling loop stops
cycling the lock after a kill. No event, envelope, schema or predicate
changes; a store written by the previous version opens unchanged. Assigned
at activation under the standing opt-out default.
**Cost:** adds no step, gate, hook, key or receipt; adds one small file
inside the guard directory per acquisition and one kill-inside-the-window
fixture to the existing resident suite (duration unknown until built).
Removes the one recorded way an unattended resident stops for good: a kill
inside a window measured at 0.004 to 0.017 s per transaction (WO-068
VER-001), which the resident enters several times per tick and again on
every 0.020 s poll while an episode runs, leaves a guard directory that
refuses every later start until a human deletes it. Removes the capability
table's recorded blocker for `runtime.resident` level 2. Wall-clock, tokens
and context bytes of the order itself are unknown until run.
**Nomination provenance:** WO-068 VER-001 F1 and FINAL-001 F1 and O2 (a
planner nomination with a repair shape); the 2026-09-16 capability pass,
which declined level 2 until "F1's append-lock recovery window closed under
test on the once and loop paths"; the operator's 2026-09-19 direction that a
planning pass plans what it finds instead of deferring it, captured verbatim
in ignored intake. Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident host; closed, v0.23.0); WO-048
merged (the inspect-before-reclaim contract this order keeps; closed).
**Recommended placement:** directly after the cleanup pair, lane pair with
WO-144, whose surfaces (the harness host's pre-tool guards, the compiled
hook configuration, the contributor loadout) this order does not touch. It
edits `packages/skeleton/src/worker-store.ts`,
`packages/skeleton/src/resident-store.ts`,
`packages/skeleton/src/resident-host.ts` and their tests, after WO-142
(which edits one message in `worker-store.ts` and the NoOp key in
`resident-host.ts`). A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-068",
    "relation": "satisfied-by-close",
    "reason": "the resident host whose store this order makes restartable"
  },
  {
    "workOrderId": "WO-048",
    "relation": "satisfied-by-close",
    "reason": "the inspect-before-reclaim contract the reclaim path keeps"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/final-reviews/WO-068/FINAL-001.md`
§F1 and §O2; `docs/verifications/WO-068/VER-001.md` F1 (the measured window
and the reproduction); `packages/skeleton/src/worker-store.ts` (`acquire`,
the `host-lock-recovery` guard, the liveness check on `host.lock`);
`packages/skeleton/src/resident-store.ts` (`transaction`, the dead-owner
reclaim with its positive replay); `packages/skeleton/src/resident-host.ts`
(the polling loop); `packages/skeleton/test/resident.test.ts` (the SIGKILL
fixture that waits for both lock files to clear);
`docs/planning/capability-table.md` (the `runtime.resident` row);
[the planning document](../planning/outstanding-cleanup-2026-09-19.md) §10.

**Objective:** A resident process killed at any instant, including inside
lock acquisition, is followed by a start that inspects the store, finds the
guard's owner dead, reclaims it and continues, with no event lost or
truncated and no human step. A guard whose owner is alive, or whose owner
record is unreadable, still refuses for inspection exactly as today.

**Observed gap (dated 2026-09-19, `main` at `3b3533f8`):**

- `WorkerStore.acquire` creates the directory `host-lock-recovery` and
  removes it only in a `finally`. `host.lock` carries an owner whose
  liveness is checked; the guard carries none, so an abandoned guard refuses
  permanently with "host lock recovery is busy or interrupted; inspect
  before recovery" (`packages/skeleton/src/worker-store.ts`).
- WO-068 VER-001 measured the window at 0.004 to 0.017 s per transaction
  and reproduced the refusing store. `ResidentStore.transaction` runs a full
  acquire and release for every transaction, several per tick, and on each
  0.020 s poll that observes a change while an episode is in flight.
- The resident fixture waits for both `host.lock` and `host-lock-recovery`
  to clear before it sends SIGKILL, so no fixture covers the window
  (`packages/skeleton/test/resident.test.ts`; WO-068 D003 discloses it).
- After `killed` is set the polling loop's transaction body does nothing and
  still cycles the lock (FINAL-001 O2).

**Design (scope discipline):**

- The guard records its owner's process id, the fact `host.lock` records
  and checks with a signal-zero probe, atomically with its creation, so no
  instant exists in which a guard is present without an owner that a later
  start can judge (a prepared owner record linked or renamed into place, not
  a directory made first and filled second). A start that meets a guard
  reads the owner: alive refuses as today; dead runs the same positive
  replay the dead-owner lock reclaim runs and then removes the guard;
  unreadable or partial, which the new construction cannot produce, refuses
  for inspection.
- Reclaim is serialized so two starts cannot both reclaim one guard.
- The polling loop skips the transaction once a kill is issued.
- Fail-conservative: every doubt refuses. The order widens what restarts
  unaided; it never widens what is written.
- **Declined alternatives, recorded:** a timeout on the guard (a slow
  inspection under load would be reclaimed while alive); removing the guard
  (WO-048's contract needs the inspection to be exclusive); one long-lived
  lock for the resident's lifetime (changes the once and loop paths' shared
  store contract; larger than the defect).

**Deliverables:** the owner record and reclaim path; the loop change; the
fixtures below; the write-backs in criterion 5.

**Acceptance criteria (all required)**

1. Fixture, once path and loop path: a real resident subprocess receives
   SIGKILL while `host-lock-recovery` exists, and between each pair of
   system calls that create and remove it (the fixture steps the window
   deterministically rather than racing it); the next start reclaims,
   appends exactly one `ScriptEpisodeLost` where an episode was in flight,
   keeps every prior event byte-identical, and continues. Thirty consecutive
   kill-and-restart rounds end with a store that opens.
2. Fixture: a guard whose owner is alive refuses with the present message;
   a guard with a missing, partial or malformed owner record refuses for
   inspection; two concurrent starts against one dead guard produce one
   reclaim and one refusal or wait, never two reclaims.
3. Fixture: a store directory written by the released version (a guard
   absent, `host.lock` present or absent) opens unchanged; an ownerless guard
   left by the released version still refuses for inspection, and the
   refusal names the directory to inspect.
4. After a kill is issued the polling loop performs no lock cycle (asserted
   by counting acquisitions in the fixture).
5. Write-backs land: the skeleton README's sentence on interrupted
   lock-recovery guards; product 03's resident section; the capability
   table gains a dated reassessment for `runtime.resident` stating which
   level the evidence now supports and citing this order's fixtures, judged
   by verification and final review; the decisions file.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test` once at final review.
The first unattended hour (WO-111) is the reopening observation.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** the quadratic append (each append decodes the whole log); a
torn log, which still refuses for inspection; hostile same-user
interference; any change to event shapes; the NoOp dedupe key and the
budget minimum (WO-142 rows B12).

**Operator-review assumptions**

1. A dead owner's guard may be reclaimed without a human, as a dead owner's
   lock already is.
2. An owner whose process id the signal-zero probe reports absent is dead,
   as the lock's reclaim already assumes. A recycled process id makes a dead
   owner look alive, which refuses: the safe direction, at the cost of one
   human step in that rare case. Adding a start identity to close it is the
   executor's recorded choice, not a requirement.
