# WO-204 — Source-writer command revocation survives host cleanup failures: the writer's owned command and profile files are removed independently, an absent file is tolerated, a surviving grant keeps refusing admission and after-tests, and process settlement, interruption and integrity are recorded even when cleanup fails (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** patch. A defect repair in the source-change
host's settlement path with a fault-injection matrix; no contract, schema or
command changes. Assigned at activation under the standing opt-out default.
**Cost:** adds absence-tolerant, independent removals and a recorded cleanup
outcome in `packages/skeleton/src/source-change-command.ts`, a reordered
settlement in `packages/skeleton/src/source-change-host.ts` (settle the
process, record interruption and integrity, then clean up and record the
cleanup's result), an injectable removal in the test fixture
`packages/skeleton/test/source-change-fixture.ts`, and the fault matrix in
`packages/skeleton/test/source-change-host.test.ts` and
`source-change-integrity.test.ts`. Removes the boundary WO-112 D043 left: an
unlink error that bypasses the `WorkerInterrupted` and integrity records and
a revocation flag that can claim an effect that did not happen. Wall-clock:
the skeleton suite grows by the matrix (each case a fixture episode; the
executor records the suite's duration against its 289.9 s thirty-day
median). Re-mints: `source-change-command.ts` and `source-change-host.ts`
are registered evidence sources (`scripts/lib/evidence-sources.mjs` lines 49
and 50), so the editions they stale are re-minted deterministically; neither
is a file the feedback verifier judges, so no live feedback episode;
`source-change-command.ts` is a declared source of the `harness-probe`
machinery suite (`scripts/test-runner.mjs` line 116), so
`npm test -- --review` runs before handoff. Tokens and context bytes are
unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (c) of the
three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`): the
three WO-112 source-writer boundaries become orders, not written acceptances,
before WO-083 touches the operator's repository. Source: WO-112 D043 and the
register row FUP-6b6274b0176af00d (VER-004's lower F3). Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: a scratch writer and
scratch repositories; nothing of any instance.
**Depends on:** WO-112 merged (closed: the source-change host, command and
fixture this order repairs); WO-199 merged (closed, v0.69.2: the recovery
through a recorded process group this order's restart case relies on). No
queued order.
**Recommended placement:** the machinery lane beside WO-080, after WO-118.
WO-080 edits `scripts/work-orders.mjs`, its fixtures, a workstreams
template, products 12 and 07; this order edits two skeleton sources, two
skeleton tests and one fixture, and writes product 03. Disjoint files and no
edge between them. WO-205 and WO-206 follow it serially because all three
edit `source-change-host.ts`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-112",
    "relation": "satisfied-by-close",
    "reason": "the source-change host, command and fixture this order repairs"
  },
  {
    "workOrderId": "WO-199",
    "relation": "satisfied-by-close",
    "reason": "recovery through a recorded process group, which the restart case relies on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Session lifecycle &
resilience and §Ports (the source-writer boundary); `docs/evidence/WO-112/decisions.md`
D040, D043 (the diagnosed ordering and the four rejected shortcuts) and
D047 to D050 (the triage repair that left this boundary);
`docs/verifications/WO-112/VER-004.md` F3; `packages/skeleton/src/source-change-command.ts`
(the returned cleanup and its `unlinkSync` calls at lines 70 to 120);
`packages/skeleton/src/source-change-host.ts` (`recoverTermination` at line
588, `checkIntegrity` at line 661, the run loop from line 920 with
`commandsLive` at lines 926 to 930, the catch and `WorkerInterrupted` record
at lines 1014 to 1064); `packages/skeleton/test/source-change-fixture.ts`,
`source-change-host.test.ts` and `source-change-integrity.test.ts`;
`packages/skeleton/src/worker-transport.ts` (the two writer accesses the
matrix covers).

**Objective:** When the source-change host settles a writer episode, the
writer's owned command route and profile are removed by two independent,
absence-tolerant removals; a removal that fails is recorded as a typed
cleanup outcome naming the surviving path; admission and after-tests refuse
while any grant survives; process settlement, `WorkerInterrupted` (where the
episode was interrupted) and the integrity check are recorded before the
cleanup's result is judged; and a restart removes the survivors and admits.
The matrix proves partial earlier removal, each unlink failure order,
persistent failure, restart recovery and the absence of any after-test or
admission with a live grant, for both writer accesses.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`; diagnosed 2026-10-06 in WO-112 D043):**

- `source-change-command.ts`'s returned cleanup unlinks the profile before
  the route (lines 77 to 119) with no tolerance for an already absent file:
  a profile removed by an earlier partial cleanup makes the second attempt
  throw before the route is touched.
- `source-change-host.ts` sets `commandsLive` false only after cleanup
  returns (lines 926 to 930); its catch calls cleanup before
  `checkIntegrity` and the `WorkerInterrupted` record (lines 1014 to 1064),
  so an unlink error bypasses both records; `finally` tries cleanup again.
- The host settles the process before cleanup on both paths, and recovery of
  an unreceipted prior attempt calls `recoverTermination` and
  `checkIntegrity` before further work (lines 588 and 803 to 804); these
  explain VER-004's lower classification and do not cure the missing
  evidence.
- No host unlink failure has been observed (the row's reopening condition);
  the fault has been reached only by source review.
- WO-083's activation preflight requires this boundary disposed by an order
  before the run touches the operator's repository (WO-083 criterion 1,
  amended 2026-10-11).

**Design (scope discipline):**

- Two removals, each tolerant of absence, each attempted whatever the other
  did; errors collected, never swallowed: `cleanup()` returns
  `{ removed: string[], survived: { path, code }[] }` and the host records
  `CommandCleanupFailed { path, code }` for each survivor.
- Revocation is a fact, not a flag: `commandsLive` becomes false only when
  no owned file survives; while any survives, admission and the focused
  after-tests refuse with a typed reason naming the path, and the episode
  ends in that refusal rather than a pass.
- Evidence before judgment: the host settles the process, records
  `WorkerInterrupted` where the episode was interrupted and the integrity
  check's result, then runs cleanup and records its outcome; the order of
  these records is asserted by the matrix.
- Restart recovery: `recoverTermination` re-attempts the removals of a
  prior attempt's survivors and admits only when none survives.
- Faults are injected through the fixture (`source-change-fixture.ts` gains
  an `unlink` override per path and per call count), never by changing host
  permissions in the test tree; both writer accesses of
  `worker-transport.ts` run the same matrix.
- **Declined alternatives, recorded (D043's four, carried):** ignoring
  cleanup errors or marking commands revoked before removal (admission could
  continue with a live route); exists checks alone (one retry fixed,
  persistent failure and record ordering not); treating the resident's
  triage retry as the fix (a different boundary); a NoOp without a
  registered action (the operator's direction is the action).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `packages/skeleton/src/source-change-command.ts`: the returned cleanup
   (lines 70 to 120) becomes two independent removals (`removeOwned(path)`
   tolerating `ENOENT`), returns `{ removed, survived }` and never throws for
   a removal failure. Check: a unit case in
   `packages/skeleton/test/source-change-host.test.ts` for a profile already
   absent (route still removed, nothing thrown).
2. `packages/skeleton/src/source-change-host.ts`: the run loop (lines 920 to
   1070): settle the process, record `WorkerInterrupted` and the integrity
   result, then call cleanup; record `CommandCleanupFailed` per survivor;
   `commandsLive` false only when `survived` is empty; admission and the
   focused after-tests refuse with `SourceChangeRefusal("command-route-live",
   path)` while any survivor exists. Check: the matrix cases below.
3. `packages/skeleton/src/source-change-host.ts`: `recoverTermination` (line
   588) re-attempts removal of the prior attempt's survivors and refuses
   admission until none survives. Check: the restart case.
4. `packages/skeleton/test/source-change-fixture.ts`: an injectable `unlink`
   (per path, per call count, persistent or once) and a reader of the
   recorded event order. Check: the fixture's own self-test case.
5. `packages/skeleton/test/source-change-host.test.ts` and
   `source-change-integrity.test.ts`: the matrix: partial earlier removal;
   profile fails then route; route fails then profile; persistent failure;
   restart recovery; no after-test or admission with a live grant; each for
   both writer accesses; each asserting the record order (settlement,
   interruption where applicable, integrity, cleanup outcome). Check:
   `npm run build && node --test packages/skeleton/dist/test/source-change-host.test.js
   packages/skeleton/dist/test/source-change-integrity.test.js`.
6. The vertical's recovery probe still passes: `node scripts/harness.mjs
   bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`.
7. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Session lifecycle & resilience": one sentence on the settlement
   order and the surviving-grant refusal, in place;
   `docs/evidence/WO-204/decisions.md`; the deterministic re-mints of the
   editions `source-change-command.ts` and `source-change-host.ts` stale
   (`docs/evidence/current.json`); `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-204/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the independent, absence-tolerant removals with a recorded
outcome; the reordered settlement; the restart re-attempt; the fixture's
fault injection; the matrix; the write-backs below.

**Acceptance criteria (all required)**

1. A profile already removed by an earlier partial cleanup leaves the route
   removed, the revocation recorded and nothing thrown (fixture).
2. With the profile's removal failing and then the route's, and with the
   route's failing and then the profile's, the other removal is attempted,
   each failure is recorded as `CommandCleanupFailed` naming the path, and
   admission and the focused after-tests refuse with a typed reason while
   the survivor exists; the records show settlement, `WorkerInterrupted`
   where the episode was interrupted, and the integrity result before the
   cleanup outcome (fixture, both orders, both writer accesses).
3. Under persistent removal failure the episode ends in the typed refusal
   naming the surviving path, never in a pass or an `observed` status
   (fixture).
4. After a restart, recovery removes the prior attempt's survivors and
   admits only when none survives (fixture).
5. No case of the matrix reaches an after-test or an admission while any
   grant survives (fixture assertion over every case); the vertical's
   recovery probe passes at the repaired subject.
6. Write-backs land, each in place with no dated paragraph: product 03
   §Session lifecycle & resilience (one sentence); the decisions file; the
   deterministic re-mints recorded; the publication locks refreshed. No byte
   figure binds these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the matrix under `node --test`; the recovery probe;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(a declared machinery source changes) and again at final review.

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- FUP-6b6274b0176af00d (WO-112 D043) is allocated here at the operator's
  direction; its reopening observation (a host unlink failure) has not
  occurred, and the matrix injects the fault instead.
- The skeleton suite's duration against its thirty-day median (289.9 s on
  2026-10-11) is recorded at handoff; growth above twice the median is a
  decision, not a trimmed case.
- WO-205 and WO-206 edit `source-change-host.ts` after this order; each
  rebases on the other's merge in sequence order.

**Non-goals:** the writer-writable Git interpretation (WO-205); shared-object
protection (WO-206); the resident's triage retry (a different boundary,
D043); changing host permissions in any fixture; a new command or schema.

**Operator-review assumptions**

1. The fault matrix stands in for the unobserved host failure; a later
   observed unlink failure is new evidence for a repair, not a reason to
   wait.
2. Both writer accesses are covered by the same fixture matrix; no live
   harness episode is owed, since no feedback-judged file changes.
