# WO-039 second repair — recoverable writer reservations

**Source.** No `VER-002` exists. The independent verifier dispatched under the
regenerated bundle could not allocate one: `npm run resume -- verify` is a
write dispatch, and every write dispatch in that session was refused for lacking
an exclusive worktree. The operator filed a repair briefing in place of the
report and dispatched `resume: fix`. Canonical control records this repair
against [VER-001](../../verifications/WO-039/VER-001.md) because the lifecycle
knows no other failure source; the [first repair receipt](repair.md) already
maps VER-001's four findings. This receipt maps the briefing's findings.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

The session selector was the operator's `/model` choice at `max`; the harness
exposes an effort value to child processes but no recorded effective-session
readback exists for this version, so the source is self-reported.

## Instrument disclosure

This repair ran under the bundle it repairs, and reproduced the failure live.
Midway through the session the operator interrupted it; the harness resumed the
conversation in a new process with a new session id. The installed hook keys
the reservation by the session id, so the reservation this session had taken
under its earlier id became foreign, and every Edit, Write and non-metadata
Bash dispatch was refused with `write dispatch lacks a verified exclusive
worktree`. No route inside the governed session could inspect or clear it. The
operator removed the ignored lock file by hand, which was the only route that
existed. That episode is the briefing's Finding A observed in the executor
role, with a second trigger the briefing did not name: a resumed session in a
new process, not only a session that ended on a refused Stop.

The session was locked a second time by its own repair: the operator's first
install attempt ran through the session's shell prefix, which stays inside the
sandbox, so the build succeeded and the hook install was refused at the first
hook file. From then until the install completed from an outside terminal,
every hook in this session failed closed on the runtime pin mismatch, exactly
as the fail-closed design intends and exactly as unrecoverable from inside.

## Findings and repairs

### Finding A — a leaked reservation was unrecoverable from inside a governed session (blocking)

- **Confirmed.** The host derived the actor from the session id, created the
  lock with an exclusive create, and released it only after every Stop unit
  passed. The metadata allowlist admitted nothing that could inspect it, the
  permission effect mapped the local harness directory to a denied user-scope
  effect for Bash, Read and Write alike, the CLI exposed no writer action, and
  the bounded output reader requires a Git-visible file. The briefing's
  elimination against the compiled predicate was correct: the refusal was the
  specific boundary verdict, so the lock existed and its actor was foreign.
- **Direction chosen: owner liveness plus operator commands.** A reservation
  now records its owning harness process. The hook takes the pid the harness
  declares through `CLAUDE_PID` when that pid is a verified ancestor of the hook
  process, otherwise the nearest non-shell ancestor, and records the process
  start time whenever the process table is readable. Liveness is a signal-zero
  existence probe plus a start-time comparison when the table is readable. A
  foreign reservation whose owner is dead is reclaimed at the next write
  dispatch; the new lock names what it replaced, the session journal gains a
  `writerReclaimed` row, and the local `writer-events.jsonl` gains a
  `reclaimed` row. A live holder is honoured and the refusal names its
  truncated actor key and host process. A holder without a recorded owner is
  honoured. A session that finds its own recorded owner dead marks the lock's
  liveness unavailable rather than trusting an identity that was evidently not
  its process; such a lock is never reclaimed automatically.
- **Operator commands.** `node scripts/harness.mjs writer --show` prints the
  reservation (hashed actor key, host process, start time, liveness, what it
  reclaimed) and is admitted to the metadata allowlist, so a refused session
  can name the holder instead of guessing. `writer --release [--force]` removes
  the lock, refuses a live owner without `--force`, releases an unknown or dead
  owner without it, and logs an `operator-released` row. From inside a governed
  session the release form is an ordinary write dispatch, so the session's own
  writer guard still refuses it against a live foreign holder.
- **Rejected, with reasons preserved.** A time-based lease: an idle live
  session is not a dead one, and handing its worktree to a second writer is the
  case the unit exists to prevent; the guard errs toward refusal with an
  explicit operator path instead. Widening the metadata allowlist to lifecycle
  commands: they write control state. Releasing in a `finally` around the Stop
  units: a refused Stop does not end the session, so releasing there admits a
  second writer mid-session; the release stays after an accepted finish.
- **Layering.** The compiled predicate is unchanged. Liveness is host fact
  collection: a dead owner's reservation is not a writer, so the host omits it
  and reclaims before the sole predicate runs.

### Finding B — output-review obligation scope (operator decision, unchanged)

The obligation still follows the branch diff from the session-entry revision.
This session wrote source and receipts and inherited the rest; its own Stop is
expected to refuse on the same gate until the operator settles that question.
Nothing here changes it.

### Corroboration — the VER-001 finding-3 diagnostics

Not re-repaired. The refusal still names the missing paths and count and points
at the bounded output reader; the writer refusal now follows the same pattern.

## Fixtures

`scripts/test-harness.mjs` gains one test and one assertion:

- The new test seeds a **foreign reservation** directly, as the briefing
  requires, and walks the cases: a foreign lock whose owner is the live test
  process refuses Edit and Write through both the in-process boundary and the
  generated subprocess, names the truncated holder and both operator commands,
  and is never replaced; the metadata view is admitted and reserves nothing;
  the release form is refused inside the session, refused by the operator CLI
  without `--force`, and released with it, logging `operator-released`; a
  foreign lock without an owner is honoured, shows `alive: "unknown"`, and an
  operator releases it unforced; a foreign lock whose owner is an exited
  process is reclaimed once, with the previous actor and pid in the lock, the
  journal and the event log, after which the session keeps its reservation; an
  operator releases a dead-owner lock unforced; a self-owned lock without an
  owner gains the fixture-controlled owner; a self-owned lock with a dead owner
  is marked liveness-unavailable and, once foreign, is refused and never
  reclaimed. Unit removal permits every refused request.
- The first test now asserts the event log reads `acquired` then `released`
  across one session's reservation and accepted finish.

Fixtures pin the harness-process identity to the test process through the
declared pid, so an outer session's process cannot leak into fixture state and
the recorded owner is live for the run.

## Live evidence under the real harness

The operator installed the regenerated bundle and ran
`DOTLN_LIVE_HARNESS=1 node scripts/harness-live-suite.mjs` from a terminal
outside the sandbox. Six immutable records resulted, all passing with exit 0,
effective `xhigh`, the launch model observed, zero refused or out-of-set native
reads, a resolved role skill, the refused fixture commit and a finished
observer:

| Record                                                               | Reservation evidence                                                                                                                                                                                                                |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [executor-012](harness-live/executor-012.json)                       | One acquisition, owner from `CLAUDE_PID`, owner pid equals the launched harness process, events `acquired` then `released`, released at finish                                                                                      |
| [verifier-008](harness-live/verifier-008.json)                       | Same shape as the executor record                                                                                                                                                                                                   |
| [reviewer-007](harness-live/reviewer-007.json)                       | Same shape as the executor record                                                                                                                                                                                                   |
| [release-close-007](harness-live/release-close-007.json)             | Same shape from `main`; its four refused write dispatches are the branch rule refusing source writes on `main`, not a holder refusal                                                                                                |
| [writer-foreign-dead-001](harness-live/writer-foreign-dead-001.json) | Seeded foreign lock with an exited owner: one reclaim naming the seeded actor and pid, no refused write dispatch, events `reclaimed` then `released`, released at finish                                                            |
| [writer-foreign-live-001](harness-live/writer-foreign-live-001.json) | Seeded foreign lock with a live owner process: no acquisition, no reclaim, two refused write dispatches, the seeded holder named in the refusal the session received, reservation still foreign at finish, `writer --show` admitted |

Two facts these records settle. The harness passes its own pid to hooks as
`CLAUDE_PID`, and in every session it was a verified ancestor of the hook and
equal to the process the suite launched, so the primary owner identity is
exact and the ancestor fallback was never needed. And the two scenario records
are the briefing's required proof under Claude Code rather than Codex: the
generated hooks fired, reclaimed a dead owner's reservation, and refused a live
one by name.

In this executor session, after the install, `node scripts/harness.mjs writer
--show` reported this session's own reservation with an owner from
`CLAUDE_PID` whose pid equalled the session's harness process and `alive:
true`; the same command was refused as unavailable before the install, which
is the fail-closed pin behaving as specified.

## Validation

The hooks this session runs under pin the built runtime bytes, and the Bash
sandbox refuses writes into `.claude/hooks`, so rebuilding in this worktree
would have failed every later hook closed with no way to reinstall from inside.
Validation therefore ran first in a detached scratch worktree carrying the same
dirty tree, built from the changed source, with its bundle re-emitted there;
the full gate in this worktree ran after the operator's install.

- [repair-002-fixtures-001.txt](repair-002-fixtures-001.txt): all 14 harness
  fixtures pass in the scratch build, including the new foreign-reservation
  test. Scratch paths are reduced to a shape.
- [repair-002-checks-001.txt](repair-002-checks-001.txt): the first full
  `npm test` in the scratch build passes formatting, the local release and
  license surfaces, every lifecycle, recovery, worktree, release and index
  fixture group, the publication locks, the rebuilt 288 runtime tests and the
  14 harness tests, then stops at `harness check` with drift on the generated
  hooks. That drift was the executor's own: a tree resync had copied the
  worktree's installed hook files over the scratch's freshly emitted ones.
- [repair-002-checks-002.txt](repair-002-checks-002.txt): after re-emitting
  in scratch, `harness check` and the context measurement pass, the live
  evidence gate fails only with `executor: live runtime drift` because the
  then-current role records pinned the previous runtime, and every step after
  it passes: plan refutation, the 8 identity-corpus tests, the artifact,
  verification and feedback evidence editions, and the 21 mutation
  self-tests. The rebuilt `harness-host.js` hash is identical across both
  builds.
- [repair-002-checks-003.txt](repair-002-checks-003.txt): a clean full
  `npm test` in the re-emitted scratch build passes every step up to the live
  evidence gate and stops there on the same drift, the expected state before
  the live suite ran.
- [repair-002-checks-004.txt](repair-002-checks-004.txt): the full gate in
  this worktree after installation and the live suite, run through
  `npm run harness -- evidence` so the installed completion hooks also hold
  the executed-check receipt.
- The re-emitted bundle differs from the previously installed one in exactly
  twelve surfaces: the eleven generated hook files, whose pinned runtime hash
  for `packages/skeleton/dist/src/harness-host.js` changes, and the manifest.
  Skills, settings, the instruction block and the context measurement are
  unchanged.

## Limits

Same-user bookkeeping, not isolation from a hostile process. Pid reuse is
guarded by the start time only where the process table is readable; without it
a reused pid could make a dead owner look alive, which fails toward refusal and
the operator path. The ancestor fallback can name a short-lived wrapper if a
harness interposes one; the self-check then disables liveness for that lock
instead of letting the misidentification reclaim. The reclaim between two
sessions racing for the same dead lock was last-writer-wins in this repair.
Corrected 2026-09-07 after `VER-002` finding F1: the loser could unlink the
winner's live replacement after the winner had already been authorized, so
both sessions proceeded, and refusing the loser's later dispatch did not
retract that authorization. The [third repair receipt](repair-003.md) replaces
this recovery with steps that act only on the observed instance. A governed
Claude Code session still cannot install a runtime change into its own
worktree: the install and the live suite are outside-terminal steps, and a
session that rebuilds the runtime before the install locks itself out until
the install completes.
