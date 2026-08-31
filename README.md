# DotLn

**A local-first workbench for building behavior you can inspect, replay, and
trust.**

DotLn asks a slightly different question about agentic software: what if the
important part were not the chat session, but the durable system around it?

An operator declares intent. DotLn compiles that intent into bounded work,
structural authority, cadence, continuations, and independent verification.
Executors can come and go. The event log, evidence, and identity lineage remain.

```text
intent → WorkOrder → disposable executor → evidence → verifier → reviewed PR
            ↑                                               │
            └──────────── replayable control loop ──────────┘
```

The project borrows from places that already know how to shape behavior:
organizational design, software patterns, 5S, statecharts, game systems, and
craft practice. Those ideas become typed mechanics instead of inspirational
prompt text. A Repo Gardener can equip Seiri. A support can strengthen a
behavior without silently granting authority. A cadence can wake work when the
operator leaves and cancel it when they return. Every friendly glyph maps back
to real state.

## What works today

The v0.2.0 walking skeleton runs a complete deterministic vertical:

- a Repo Gardener equips the Seiri maintenance contract;
- virtual time schedules bounded repository inspection while the operator is
  away;
- a fake executor produces evidence-backed deletion candidates;
- the authority guard structurally refuses deletion;
- an independent fake verifier checks the candidates;
- operator return cancels future work and turns a queued pulse into a traced
  NoOp; and
- the JSONL log replays to the same decisions and renders as a terminal timeline
  plus a zero-asset glyph scene.

```bash
npm install
npm run skeleton
```

The final line should read:

```text
verified=true candidates=1
```

Run all kernel, skeleton, backup, resume-control, and real-Git worktree tests:

```bash
npm test
```

## Designed for work that outlives a session

DotLn keeps planning, implementation, verification, repair, and final review as
separate evidence-bearing phases. Immutable `VER-NNN` and `FINAL-NNN` artifacts
preserve every loop instead of replacing yesterday's findings with today's
green checkmark.

The operator interface is intentionally becoming smaller:

```text
resume: status
resume: fix
resume: verify
resume: final review
resume: next
```

An append-only control log resolves those phrases to the active work order and
the exact artifacts a fresh session must read. Tested helpers also create new
WO worktrees, publish a final-reviewed branch as a PR, and clean up only after
the operator merges it.

## Where this could go

The longer horizon is a general workbench for versioned, composable behavior:

- paste JSON IR into a lightweight offline verifier and learn exactly which
  schema and application era it belongs to;
- run historical configurations on modern runtimes through inspectable JIT
  compatibility plans, or migrate them ahead of time without destroying the
  source;
- turn active and support mechanics on, off, emulated, or migratable per
  release—with explicit behavior when a saved build encounters an unavailable
  mechanic;
- share compact, regenerable builds that open in Preview rather than silently
  installing authority; and
- spawn blank actors or game sprites, equip algorithms and behavioral patterns,
  then simulate, replay, compare, and inspect their first divergence.

Those are product directions, not claims about the current release. The point
is the common substrate: behavior as versioned, inspectable material rather
than an ephemeral improvisation.

## The shape of the repository

- `packages/kernel/` — deterministic, framework-free event/decision core.
- `packages/skeleton/` — the Repo Gardener + Seiri executable vertical.
- `docs/product/` — durable product blueprint and compatibility horizons.
- `docs/work-orders/` — authoritative bounded implementation scope.
- `docs/verifications/` — immutable independent verification history.
- `docs/final-reviews/` — immutable closeout reports and PR handoffs.
- `docs/control/` — append-only resume state and its generated projection.
- `docs/intake/` — local-only raw ideation, intentionally excluded from Git.

Start with [the vision](docs/product/00-vision.md), explore
[the domain model](docs/product/02-domain-model.md), or run
[the walking skeleton](packages/skeleton/README.md).

## One boundary that does not move

This is a personal clean-room project. Employer code, configuration,
identifiers, internal services, and proprietary implementation details do not
belong here. Raw ideation stays local until it has been deliberately rewritten
across that boundary.
