# WO-280 — The five-second discovery timeout is traced to its child and its cause, and repaired or left recording what it needs (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** patch. Discovery's bound error names the child,
its error code, signal, status and elapsed time, and a deadline hit is
recorded with the gate's load; where a cause is reproduced, its repair. No
refusal is added. Assigned at activation under the standing opt-out
default.
**Cost:** adds about 20 lines in `packages/skeleton/src/discovery.ts` (the
error's fields and the observed spawn), fixture-local controls and three to
five cases, and whatever repair a reproduced cause needs (estimates, not
bounds). `discovery.ts` is a judged feedback source and a registered
evidence source of all five editions: the order owes the feedback re-mint
and one live feedback self-host episode, run after the step that edits it,
and the deterministic re-mint of the five editions; one complete review run
at final review. It removes a complete run lost to an intermittent failure
(one observed: the first complete run of WO-276's repair of VER-004, about
fifty minutes) and an error that cannot be told from two others. Tokens and
steps are unknown until run.
**Nomination provenance:** the operator's direction during WO-276's repair
of VER-004, recorded in WO-276-D151, that the timeout be investigated and
fixed as a follow-up and not inside that order (register row
FUP-27ff5c4e26de1675, allocated here), and the operator's planning dispatch
of 2026-11-14 (journal digest
`90a23f1bbae9b79f3c760f130d682a0bf463281b37ab7c81d46eace1b1507603`), which
asked for the follow-ups left over. Clean-room screen: core's own test and
source; nothing from an instance.
**Depends on:** none.
**Recommended placement:** after WO-278; its gate runs serve every later
order.
**Cites (read these sections):** WO-276-D150, D151 and D153 and
`docs/evidence/WO-276/repair-ver004/discovery-timeout.json`;
`packages/skeleton/src/discovery.ts` (the checks, the sandboxed spawn and
its bound, the error builder); `packages/skeleton/src/discovery-sandbox.ts`;
`packages/skeleton/src/gate-deadlines.mjs` (`observedSpawnSync`,
`deadlineLimit`); `packages/skeleton/test/discovery.test.ts` (the case "WO-119
default npm checks honor lifecycle scripts and package environment");
`scripts/test-runner.mjs` (the `skeleton` row and its concurrency); product
07 §Research and guided-operator work orders and the Standard artifacts
paragraph on judged feedback sources.
**Objective:** A discovery check that runs past its bound says which child
it was, with its error code, signal, status and elapsed time, and the gate
records the load beside it; the order establishes, by a controlled
reproduction that fails before a repair and passes after it, which cause
made the first `npm run --silent lint` of a fresh root exceed five seconds,
and repairs it while keeping real npm lifecycle and environment coverage and
the rule that a timeout is never a candidate; or it records `negative` or
`inconclusive` with what was tried and the instrument left in place.

**Observed gap (dated 2026-11-14 at `main` `ed66a822c`, v1.0.0):**

1. The case failed once, in the first complete run of WO-276's repair of
   VER-004, at its first `discover` call after 5,007 ms; it passed alone in
   1,453 ms (1,609 ms under the bounded wrapper) and in the next complete run
   (WO-276-D150, D151; `discovery-timeout.json`). Each `spawnSync` call has
   its own 5,000 ms bound (`discovery.ts` 317 to 331), so the child that ran
   out was the first check of the first call, `npm run --silent lint`, the
   first npm process in a new HOME (an inference from the arithmetic).
2. The bound error (`discovery.ts` 332 to 333, through 38 to 40) drops the
   error code, signal, status, pid, the check and its argv, the elapsed time
   and the captured output, so a timeout, an output overflow (`ENOBUFS`) and
   a failed spawn read the same. `observedSpawnSync`
   (`gate-deadlines.mjs` 164 to 191), which records a deadline hit with the
   concurrent tasks and the host's load, is used by other skeleton modules;
   `discovery.ts` imports the plain `spawnSync` (line 1).
3. The case's passing time was 751.6 ms on 2026-09-16, 510.8 on 2026-10-01
   and 500.7 on 2026-10-05, then 1,329.6 and 1,499.4 on 2026-10-12, with no
   change to `discovery.ts` between; the headroom to the bound fell from
   about tenfold to 3.4-fold, cause unknown.
4. Candidate causes, none established: CPU contention slowing npm's cold
   start beside up to eight lanes and a second skeleton file, with the
   compile cache disabled (`discovery.ts` 323 to 325); npm's update notifier
   on the first call in a fresh HOME, unawaited before `process.exit`, its
   lookup under a sandbox that denies the network; `sandbox-exec`'s own cost
   under load; a descendant holding the output pipe. A shared npm cache or
   lock is ruled out: HOME and TMPDIR are a fresh root per case (319 to 322).

**Design (scope discipline):**

- Instrument first: the bound error keeps the check, its argv's command
  name, the error code, signal, status and the child's elapsed time, and the
  spawn goes through `observedSpawnSync`, so the next hit in a complete run
  records its load. No production deadline changes without a cause
  (WO-276-D150 and D151 rejected raising it).
- Reproduce each candidate with controls a case can hold: a fixture-local
  `.npmrc` (`timing=true`, `update-notifier=false`), a delay shim first on
  the fixture's path, a busy-loop load beside the single case, the same case
  through `discoverWithinActor` against `discover` for the sandbox's share,
  and a script that leaves a descendant on the pipe. A cause counts as found
  only where its control fails the case before a repair and passes after
  it, both arms recorded with their exit codes (product 07's screen for a
  case that settles a row).
- Repair the cause found, in the smallest form: an npm setting in the
  stripped environment for the notifier, the existing `deadlineLimit`
  scaling under declared gate load for contention, or what the evidence
  names. Rejected: retrying the check (axis: honesty; it hides the cause the
  operator asked for).
- This is a research order in product 07's sense for its question (which
  cause): its reproductions live in the order's evidence directory, and its
  outcome is `ready`, `negative` or `inconclusive`. Budget: one attempt per
  candidate of the Observed gap, each a single case under the bounded
  wrapper, and at most four hours of the executor's worked time on step 2.
  It stops when a candidate's control fails the case and its repair passes
  it, or when every candidate has been tried within the budget.

**Execution plan (the executor follows these steps in order; observed at
`ed66a822c`, 2026-11-14):**

1. `packages/skeleton/src/discovery.ts` (the error builder and the spawn):
   the fields of the Design and `observedSpawnSync`; cases in
   `packages/skeleton/test/discovery.test.ts` that a timeout, an overflow and
   a failed spawn read differently. Then the feedback re-mint and the live
   feedback self-host episode on the instance's `default` worker. Check:
   `npm test -- --only skeleton` and `npm test -- --only feedback-evidence`.
2. Reproductions under `docs/evidence/WO-280/` (scripts and their records),
   one per candidate, each with its control's two arms and exit codes, run
   as single cases under `node scripts/harness.mjs bounded`.
3. The repair of the cause step 2 found, with its case; or, where none
   reproduces, the decisions record `negative` or `inconclusive` with each
   candidate's arms. Check: `npm test -- --only skeleton`.
4. `npm run sync` for the five editions. Check: `npm test -- --only
   authority-evidence`, `npm test -- --only artifact-evidence`, `npm test
   -- --only verification-evidence`, `npm test -- --only harness-evidence`.
5. Write-backs: `docs/evidence/WO-280/decisions.md` (the outcome, each
   candidate's evidence and reopening condition) and the regenerated
   decisions index; product 07 needs no change. Then the handoff sequence of
   product 07 §Discipline.

**Deliverables:** the bound error's fields and the observed spawn; the
reproductions and their records; the repair or the recorded outcome; the
episode's record; the re-minted editions; the decisions.

**Acceptance criteria (all required)**

1. Under `npm test -- --only skeleton`, a discovery check that runs past its
   bound fails with an error naming the check, its command, the error code,
   signal, status and elapsed time, and an output overflow and a failed spawn
   each fail with their own code.
2. Each candidate cause of the Observed gap has a record under
   `docs/evidence/WO-280/` labelled `observed`, `blocked`, `unavailable` or
   `ambiguous`, with its control and both arms' exit codes where it ran, and
   the reason where it did not.
3. The execution record's first sentence names the outcome as `ready`,
   `negative` or `inconclusive`. Where `ready`, the repair's case fails with the repair
   reverted and passes with it, both arms recorded; real npm lifecycle and
   environment coverage remains in the case, and a timed-out check is never
   a candidate.
4. The feedback re-mint and the live episode are recorded under
   `docs/evidence/WO-280/`, or their recorded absence with the host's reason.
5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only skeleton`, `npm test -- --only
feedback-evidence`, `npm test -- --only authority-evidence`, `npm test --
--only artifact-evidence`, `npm test -- --only verification-evidence`, `npm
test -- --only harness-evidence` and, where a repair touches the runner's
scheduling, `npm test -- --only runner-fixtures`; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-280/`: each reproduction's two
arms; the error's three forms; the episode's record; `npm run resume --
status --json` after `implementation-ready`.

**Write-back duty:** the decisions and the index; the release's notes name
the error's new fields.

**Known issues and carry-ins:** until WO-278 lands, the first round is
launched as WO-276-D118 records. Whether the case's tripling between
2026-10-05 and 2026-10-12 shares this cause is part of step 2's question,
not an assumption.

**Non-goals:** raising the bound without a cause; changing the sandbox
profile's rules; a retry.

**Operator-review assumptions:** an `inconclusive` outcome with the
instrument in place is an acceptable end, as product 07's research orders
allow.
