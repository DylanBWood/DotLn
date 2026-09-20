# Binding a resident to the active work — candidate

**Planning observation:** 2026-09-20 during WO-099, raised by the operator
while reading the mission-check implementation. The mechanism the resident
needs to watch an order now exists; the path from "I opened a worktree for
WO-NNN" to "a resident is watching it" does not. Nothing here is a defect in
WO-068, WO-099 or the operator's workflow. They were built to different
boundaries and the boundary between them is empty.

## What is observed

- `dotln resident --store <dir> --policy <id> [--tick <ms> | --once]` is
  operator-started and, in the skeleton runbook's own words, "independent of
  Contributor stages". One process per launchpad, under an exclusive lock on
  its store. No system daemon or scheduler is installed (WO-068 non-goal).
- Nothing starts one. `scripts/bootstrap.mjs` runs `npm ci`, `npm run build`
  and `harness emit`; `scripts/worktree.mjs` contains no resident logic;
  `resume` never touches it.
- A store's configuration is immutable within that store:
  `decodeResidentConfiguration` refuses a changed configuration, and the
  runbook states that changing the policy or an actor requires a fresh store
  with the old one retained for inspection.
- Every actor declares an absolute `cwd`. A `mission-check` actor additionally
  declares a `MissionSource`: the worktree root, the repository-relative
  contract path, the base commit, the declared surfaces and the decision
  window. All of it is hand-written into `resident.json`.
- Presence from a working session is opt-in per session: the generated hooks
  call `recordHarnessHeartbeat`, which returns immediately unless
  `DOTLN_RESIDENT_STORE` is bound in that session's environment. Nothing binds
  it today.
- The operator works one worktree per order with phases split across sessions,
  and WO-030 made the control model hold several in-flight orders at once.

## The friction this produces

Watching a real order means hand-writing a store: the compiled graph, its
environment, one actor per phase, and a `MissionSource` whose base commit and
declared surfaces are copied out of the order by hand. Because configuration
is immutable per store, the next order needs a new store, and a store left
pointing at a finished order keeps judging a worktree nobody is working in —
quietly, because a stale capsule is still a valid capsule. WO-099's own live
row had to build a synthetic worktree and a purpose-built store to be
observed at all; that is honest for a mechanism proof and useless as a daily
path.

## What a candidate must decide

| Concern | Required planning result |
| --- | --- |
| Who owns the binding | An explicit operator command, a store generated from canonical control state at activation, or a step in the worktree helper. Each puts the declaration in a different place and makes a different thing stale. |
| Store lifetime | Whether a store follows an order (created at activation, retained at close) or a launchpad, given that configuration is immutable within a store and old stores are retained for inspection. |
| Where declared surfaces come from | They are hand-declared today. Deriving them changes a contract the mission check leans on: the out-of-surface rule is only ever as good as the declaration, so a machine-derived surface list is a product decision, not a convenience. |
| Concurrency | The lock is per store, so several residents can coexist, but the presence curve's semantics assume one policy advancing on one episode at a time. Decide whether absence work serializes across in-flight orders or each order gets its own armed policy. |
| Session presence binding | Whether the worktree helper should export `DOTLN_RESIDENT_STORE` for stage sessions, remembering that every hook signal is actor origin and only explicit `away`/`back` is human. |
| Staleness | What the resident should do when its declared base commit, contract path or worktree no longer matches the canonical active order. Refusing and naming the mismatch is the conservative default; silently judging the old subject is the current behavior. |

## Out of scope for this candidate

- Deriving *what work to do* during absence remains WO-100; this candidate is
  only about aiming an existing policy at an existing worktree.
- No installed daemon, launchd or systemd unit (WO-068's standing non-goal).
  `--once` under the operator's own scheduler stays the launch mode.
- Automatic repair of a drift remains WO-055 and WO-100 composing later.
- The unattended hour remains WO-111; nothing here claims endurance.
