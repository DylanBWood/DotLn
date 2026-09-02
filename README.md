# DotLn

> **Stay with the idea. Let DotLn carry the work around it.**

**DotLn is built to increase the chance that an operator can remain in a genuine
psychological flow state while working with AI.** It moves the surrounding work
from babysitting toward dependable workflow: research, capability-building,
coordination, routine procedure, recovery, and verification happen automatically
when authorized, predictably when routine, and helpfully when a genuinely
material decision needs the operator. Dependability is a means; the operator
staying with the idea, direction, and judgment is the aim.

**DotLn is a local-first workbench for turning human judgment into behavior you
can inspect, replay, and learn to trust.**

Every useful agent workflow accumulates hard-won lessons:

- do not delete what you cannot prove is dead;
- show evidence before claiming success;
- preserve the operator's intent across handoffs;
- ask only when the decision is genuinely material; and
- let absence reduce authority, never enlarge it.

Today, those lessons usually end up in a giant prompt, one person's memory, or
nowhere durable at all. DotLn is building a third option: compile each lesson
into the smallest mechanism that can actually carry it—a guard, reactor,
evaluator, workflow gate, typed support, or task-local instruction.

In RPG terms, loading every correction into every session is like taking your
**whole stash into every map**, or linking **every support gem to every skill**.
You pay for mechanics that do nothing and invite interactions you never meant to
create.

In plain English: give each task only the rules it needs, enforce the dangerous
ones outside the model, and preserve the evidence needed to understand what
happened later.

```text
intent → task-scoped build → bounded WorkOrder → disposable executor
                              │                         │
                       authority guard              evidence
                              │                         │
                              └────── event log ← verifier
                                               │
                                      replay / inspect / resume
```

Models can rotate. Sessions can die. The organization's memory, constraints, and
standards remain.

## The smallest proof that the idea works

> **Executable product baseline: the `v0.2.0` walking skeleton.**
>
> It is deliberately narrow: deterministic kernel, fake executor, separate
> deterministic fake verifier, and terminal projections. Maintenance releases
> can harden its evidence and lifecycle without pretending the planned real
> model worker or interactive application already exists.

The executable scenario gives a Repo Gardener one active mechanic: **Seiri /
Sort / 整理**.

```text
🌙 operator away
      → ⏱️ 20-minute virtual pulse
      → 🐛 Repo Gardener inspects a fixture repository
      → 🔎 evidence-backed deletion candidates
      → 🛡️ deletion structurally refused
      → ✅ candidates checked by the fake verifier
      → ☀️ operator returns
      → 💤 future and already-queued work cancelled
```

The CLI renders the live JSONL log as a numbered timeline and zero-asset glyph
scene. The test suite replays that same log and proves the decisions remain
identical.

Current evidence was recorded with Node 22 on macOS. The complete shell suite
uses macOS-specific utilities and fails loudly on unsupported platforms. The
kernel has zero runtime dependencies; the skeleton depends only on the local
kernel package. Neither has yet earned a broader platform claim. See the
compatibility manifest for the exact profile.

Run it:

```bash
npm install
npm run skeleton
```

The final receipt should be:

```text
verified=true candidates=1
```

Run the complete repository evidence suite:

```bash
npm test
```

That suite covers the kernel and skeleton alongside intake backup,
resume-control, recovery checkpoints, real-Git worktree lifecycle, and guarded
release-close behavior.

Read the layered [v0.2.0 release notes](docs/releases/v0.2.0-notes.md) and
[compatibility manifest](docs/releases/v0.2.0.md) for the exact evidence,
version axes, and known limitations.

## What `v0.2.0` proves—and what it does not

It proves that:

- a framework-free, zero-runtime-dependency kernel can keep decisions pure;
- virtual time and logged state can reproduce controller behavior;
- authority can refuse an effect structurally instead of asking a model to
  remember not to do it;
- persisted commands can recover after a crash without duplicating the fake
  adapter's effect;
- operator return can cancel future work and turn a queued pulse into a traced
  `NoOp`; and
- friendly glyphs can remain projections of real event state.

It does **not** yet provide:

- real Claude, Codex, human, or shell worker adapters;
- the general loadout and support composition compiler;
- saved community builds or compatibility migration;
- a web, spatial, or drag-and-drop console;
- SQLite persistence, hosted operation, or a published package; or
- the complete independently verified source-to-deliverable pipeline.

Those are roadmap commitments, not retroactive descriptions of the current
release.

## The RPG skin carries real mechanics

DotLn borrows the build vocabulary of RPGs such as Path of Exile because it is a
surprisingly good language for scoped, composable behavior—not because the
mechanics are decorative.

| RPG view         | DotLn mechanic                                                                |
| ---------------- | ----------------------------------------------------------------------------- |
| Build / loadout  | The exact behavior assembled for this task                                    |
| Active skill     | Something the actor can do                                                    |
| Support gem      | A typed modifier that participates only through a valid link                  |
| Reservation cost | Context, tools, attention, or resources held by a mechanic                    |
| Map / zone       | The repository and isolated worktree                                          |
| Summon           | A disposable worker episode                                                   |
| Save point       | A serializable continuation                                                   |
| Combat log       | The append-only event and evidence history                                    |
| Guarded ability  | Authority checked before an effect can occur                                  |
| Item tooltip     | Grants, restrictions, obligations, cadence, and cancellation made inspectable |

The long-term composition surface is a **Path of Building for organizations**:
equip a pattern, inspect its exact compiled effect, compare builds, and replay
where two variants first diverge.

Only the Repo Gardener + Seiri loadout is executable today, and its loadout
shape is deliberately provisional. The general composition system remains ahead
on the roadmap.

## The bets underneath the game language

DotLn is opinionated about a few things:

- **A session is an incarnation, not a memory system.** Durable state lives in
  artifacts and the event log.
- **The core is deterministic; the edge may be strange.** Models, humans,
  browsers, and shell scripts can execute work, but they do not get to redefine
  the control logic invisibly.
- **Hard safety should be boring.** Permissions, guards, worktrees, and evidence
  gates carry invariants outside prompt prose.
- **Evidence comes before “done.”** A persuasive completion message is not a
  test result.
- **Implementer and verifier are different roles.** The system should make
  self-certification structurally difficult.
- **Every metaphor must reveal its mechanics.** RPG, business, statechart,
  function-table, timeline, and code views should resolve to the same truth—or
  say plainly when a projection is lossy.
- **The substrate is shared; the doctrine is yours.** DotLn aims to provide
  common composition, replay, authority, evidence, and inspection primitives
  without prescribing one universal organization.
- **The operator stays in the fun loop.** Choosing patterns, shaping identities,
  and exercising judgment remain first-class human work. The machinery should
  carry the clerical burden around them.

The scarce resource is not generation. It is the selection function: knowing
which combination is good, which correction matters, and when doing nothing is
the right decision.

## Three horizons, one kernel

The roadmap grows outward without changing the foundation:

1. **Work operating system** — bounded work, disposable workers, external
   memory, explicit authority, and evidence-backed completion.
2. **Executable pattern workshop** — compose craftsmanship, organizational
   patterns, roles, and supports as inspectable mechanics.
3. **Agent ecology and simulation laboratory** — compare builds, swap actors,
   replay counterfactuals, and find the first meaningful divergence.

The near-term path is concrete: audit projections, a real composition compiler,
real disposable-worker transports, independent verification, a feedback
compiler, then synchronized terminal and visual consoles.

See the [application release roadmap](docs/product/06-roadmap.md) for exit
criteria and the [IR compatibility horizon](docs/product/10-ir-compatibility.md)
for how old builds can remain inspectable on newer runtimes.

## The repository practices what the product preaches

DotLn's development loop already uses bounded work orders, separate
verification, immutable finding reports, final review, isolated worktrees,
recovery checkpoints, and an append-only control log.

A fresh session can resume from one compact operator phrase:

```text
resume: status
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The phrase resolves to the active work order and exact artifacts the session
must read. Older `VER-NNN` and `FINAL-NNN` reports remain immutable, so a later
green result never erases the path that produced it.

`resume: release close` is intentionally separate: after the operator merges a
reviewed PR, it authorizes guarded closeout and, when a new SemVer boundary is
eligible, publication of the annotated source tag. It never authorizes pushing
`main`, deploying, or publishing a package.

The [operator playbook](docs/PLAYBOOK.md) documents the complete loop.

## Repository map

- [`packages/kernel/`](packages/kernel/) — deterministic, framework-free event
  and decision core.
- [`packages/skeleton/`](packages/skeleton/) — executable Repo Gardener + Seiri
  vertical.
- [`docs/product/`](docs/product/) — durable product blueprint and compatibility
  horizons.
- [`docs/work-orders/`](docs/work-orders/) — bounded implementation authority.
- [`docs/verifications/`](docs/verifications/) — immutable independent
  verification history.
- [`docs/final-reviews/`](docs/final-reviews/) — immutable closeout reports and
  PR handoffs.
- [`docs/control/`](docs/control/) — append-only resume state and generated
  projection.
- [`docs/releases/`](docs/releases/) — release evidence, compatibility records,
  and layered notes.
- `docs/intake/` — local-only raw ideation, deliberately excluded from Git.

If you want the idea first, read [the vision](docs/product/00-vision.md). If you
want the machinery, start with
[the domain model](docs/product/02-domain-model.md) and
[architecture](docs/product/03-architecture.md). If you want to see something
move, run [the walking skeleton](packages/skeleton/README.md).

## One boundary that does not move

This is a personal clean-room project. Employer code, configuration,
identifiers, internal services, and proprietary implementation details do not
belong here.

Raw ideation stays local until it has been deliberately synthesized and
rewritten. The public repository contains original product reasoning and
implementation only.

<details>
<summary><strong>Why “DotLn”?</strong></summary>

“Days of the Natural Logarithm” hides _Dylan_ in `DAYs-of-the-LN` and nods to
the project's interest in behavior changing over time through composed
influences. The name is personal, mathematical, and just strange enough to fit
the thing being built.

</details>

DotLn is early on purpose: the current proof is small enough to understand all
the way through. The ambition is not.
