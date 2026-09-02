# DotLn

> **Stay with the idea. Let DotLn carry the work around it.**

DotLn is a local-first, model-agnostic **compiler and runtime for human
judgment**. You bring the taste, the standards, and the corrections you have
already paid for once. DotLn compiles each one into the smallest mechanism that
can carry it, hands every task only the rules it needs, enforces the dangerous
ones outside the model, and keeps a replayable record of what happened. Models
rotate. Sessions die. The judgment survives.

It is early, small, and deliberately honest about which of those sentences are
running code and which are still a promise. The first proof already walks. The
ambition does not fit in a paragraph, so this README is longer than one.

## Why this exists

Working with AI agents drifts into babysitting. You restate context, supply
procedure, coordinate tools, check "done" claims that are not evidence, and
recover stalled work. Your attention goes to the machinery instead of the idea.

The usual fix is a bigger prompt. A predecessor system, not present in this
repo, proved the concept and then collapsed under its own success: roughly 140
hard-won rules loaded as prose, hundreds of thousands of tokens of always-on
context, rules firing wrongly or vanishing when they mattered most. In this
project's vocabulary it brought **the whole stash into every map**, as if every
support gem were linked to every skill.

DotLn's answer is not fewer rules. It is **compiled** rules:

- do not delete what you cannot prove is dead → a structural guard, not a plea;
- show evidence before claiming success → a gate the model cannot talk past;
- preserve the operator's intent across handoffs → a bounded work order, not a
  transcript;
- ask only when the decision is genuinely material → an interruption policy with
  six named conditions;
- let absence reduce authority, never enlarge it → a presence rule the product
  specifies and the current skeleton exercises when the operator returns.

A session gets **a build, not a biography**: one active behavior, a handful of
linked supports, a tiny immutable safety layer, and the exact task state. The
mission underneath is operator flow. Not a promise about anyone's psychology,
which no software can make, but a steady removal of the interruptions,
repetition, ceremony, and rediscovery that break it, without exporting the cost
into correctness, authority, evidence, or privacy.

```text
intent → task-scoped build → bounded WorkOrder → disposable executor
                              │                         │
                       authority guard              evidence
                              │                         │
                              └────── event log ← verifier
                                               │
                                      replay / inspect / resume
```

## What runs today

The published boundary at the start of WO-007 is `v0.2.3`. Its executable heart
is the **walking skeleton** first shipped in `v0.2.0`: a deterministic kernel
with zero runtime dependencies, a fake executor, a separate fake verifier, and
terminal projections. No model is in the loop yet. That is the point. It proves
the kernel's shape is real before anything unpredictable is plugged into it.

The scenario gives a **Repo Gardener** one active mechanic, **Seiri / Sort
/ 整理**, the first S of 5S:

```text
🌙 operator steps away
      → ⏱️ a 20-minute virtual pulse fires
      → 🐛 Repo Gardener inspects a fixture repository
      → 🔎 evidence-backed deletion candidates
      → 🛡️ deletion structurally refused (base rank holds no such authority)
      → ✅ candidates checked by the separate fake verifier
      → ☀️ operator returns
      → 💤 future pulses cancelled; the one already queued becomes a traced NoOp
```

```bash
npm install
npm run skeleton
```

You get a numbered timeline derived from the JSONL event log, one line of glyphs
that is a pure projection of that same log, and a receipt:

```text
🐛 Repo Gardener  ◌ dormant  ⏱️ pulsing  🔎 inspecting  🛡️ inverted/refused  ✅ verified  ☀️ phase:returned  💤 faded/cancelled

verified=true candidates=1
```

The test suite replays that log and binds the trace and timeline identity it
currently asserts; a planned reactor rewrite closes the remaining structural gap
between the separately maintained live and replay paths. `npm test` runs the
configured root evidence suite: kernel, skeleton, publication freshness, intake
backup, resume control, recovery checkpoints, real-Git worktree lifecycle, and
guarded release close; frozen corpus lanes remain separate. Evidence was
recorded with Node 22 on macOS; the shell suites use macOS utilities and fail
loudly elsewhere. See the [release index](docs/releases/README.md),
[v0.2.0 notes](docs/releases/v0.2.0-notes.md), and
[v0.2.0 compatibility manifest](docs/releases/v0.2.0.md).

### What that proves, and what it does not

Proven:

- a framework-free kernel can keep every decision pure, with no hidden clock,
  randomness, or I/O;
- virtual time plus a logged state can reproduce the scenario outputs currently
  asserted by the replay tests;
- authority can **refuse an effect structurally** instead of asking a model to
  remember not to;
- a crash after command persistence recovers without duplicating the fake
  adapter's effect;
- operator return cancels future work and turns a queued pulse into a traced
  `NoOp`;
- friendly glyphs can stay honest projections of real event state.

Not yet built, and not claimed:

- real Claude, Codex, human, or shell worker adapters;
- the general loadout and support composition compiler;
- saved community builds or compatibility migration;
- a web, spatial, or drag-and-drop console;
- SQLite persistence, hosted operation, or a published package;
- the complete independently verified source-to-deliverable pipeline.

Scheduled capabilities are roadmap rungs with exit criteria; the rest remain
explicit horizons rather than promises with invented dates. The next rung after
`v0.2.3` is audit projections over the same log: a receipt, a causal timeline,
and governed raw, each naming exactly what it omits. This checkout contains that
rung under review; it is not part of the published boundary named above.

## The bets

- **A session is an incarnation, not a memory.** Durable state lives in
  artifacts and the event log. The workflow remembers the worker; the worker
  never needs to remember the workflow.
- **Deterministic core, strange edge.** Models, humans, browsers, and shell
  scripts execute work. None of them get to redefine the control logic
  invisibly.
- **Hard safety is boring.** Permissions, guards, worktrees, and evidence gates
  carry invariants outside prompt prose. Prose is the ninth and last mechanism
  choice.
- **Evidence precedes "done."** A persuasive completion message is not a test
  result.
- **Implementer and verifier are different roles,** and the system makes
  self-certification structurally awkward.
- **Doing nothing is a decision.** `NoOp` is a first-class intent with a reason,
  evidence, a re-check cadence, and the condition that would make action useful.
- **Every metaphor reveals its mechanics.** RPG, business card, statechart,
  function table, timeline, and code views resolve to the same truth, or say
  plainly that they are lossy.
- **The substrate is shared; the doctrine is yours.** DotLn ships legos, not a
  finished organization. Bundled patterns are examples, never privileged kernel
  behavior.
- **No fake numbers, ever.** Declared mechanics, computed attributes, and
  empirical performance are never blurred together.

The scarce resource is not generation. It is the **selection function**: knowing
which combination is good, which correction matters, and when the right move is
to wait.

## The game is not decoration

DotLn borrows the build vocabulary of action RPGs because it turns out to be an
excellent typed language for scoped, composable behavior.

| RPG view         | DotLn mechanic                                                                |
| ---------------- | ----------------------------------------------------------------------------- |
| Build / loadout  | The exact behavior compiled for this task                                     |
| Active skill     | Something the actor can do                                                    |
| Support gem      | A typed modifier that participates only through a valid link                  |
| Reservation cost | Context, tools, attention, or budget a mechanic holds while equipped          |
| Map / zone       | The repository and its isolated worktree                                      |
| Summon           | A disposable worker episode                                                   |
| Save point       | A serializable continuation                                                   |
| Combat log       | The append-only event and evidence history                                    |
| Guarded ability  | Authority checked before an effect can occur                                  |
| Item tooltip     | Grants, restrictions, obligations, cadence, and cancellation, all inspectable |

Links are **scope, not sequence**. Rarity encodes provenance, never power. A
rate-limit debuff is meant to show the real backoff timer. Set bonuses are meant
to compile to real state-machine transitions. And the second thesis is about
authoring: the business, leadership, and personal-development shelf becomes a
library of executable patterns, so anyone who has read those books already knows
a feature of the app. 5S, the Ladder of Leadership, mitigated speech, Theory of
Constraints, optimal stopping: each is being mapped to exact mechanics that can
render in whichever view you prefer.

The long-term surface is a **Path of Building for organizations**: equip a
pattern, see its exact compiled diff, compare builds, and replay to the first
event where two variants diverge. Today only the Repo Gardener + Seiri loadout
is executable, and its shape is deliberately provisional.

## Three horizons, one kernel

1. **Work operating system.** Bounded work, disposable workers, external memory,
   explicit authority, evidence-backed completion. The immediate product.
2. **Executable pattern workshop.** The shelf-to-mechanism compiler and the
   drag-a-card-onto-an-agent authoring surface. The differentiated product.
3. **Agent ecology and simulation laboratory.** Paired counterfactual runs,
   first-divergence detection, actor swaps over recorded logs. The research
   product. Deterministic replay is what makes it possible at all.

The release ladder climbs there one visible payoff at a time: audit projections,
a real composition compiler, a real disposable worker, independent verification,
a feedback compiler, then synchronized terminal and visual consoles. `v1.0.0`
has one exit criterion: a person who has never read these docs declares one
bounded intent and receives a verifiable result, witnessed by a non-author.

Past 1.0 sits the named flagship, **προτείνω**: a small, persistent simulated
community where you select a resident or a group, write to them in prose at any
length, and watch what changes, what does not, and why the system believes your
words participated. Residents may ignore, misread, adopt, or relay what you
said, and the scoreboard is a paired counterfactual branch rather than a
before-and-after. Candidate first world: a basketball squad. See
[the roadmap](docs/product/06-roadmap.md) and
[προτείνω](docs/product/11-proteino.md).

## Things you would not expect to find in here

- **Refusal is an event, not a politeness.** When the Gardener reaches for
  deletion, the kernel does not ask it nicely to stop. It records
  `CommandRefused`, and code that depended on the denied effect quietly
  succeeding will not get it.
- **Absence shrinks authority.** Most automation gets bolder the longer you are
  gone. DotLn specifies prolonged absence as a degradation toward read-only work
  and `NoOp`; the current skeleton proves the narrower return/cancellation
  behavior. The utility curve captures "too much reorganization in the ten
  minutes you got up for coffee."
- **Index cards are a planned frontend.** They worked once; a physical-card
  importer is specified to map them to the IR. The ambient end state is a
  magnetic LED whiteboard, and its digital form is a living index card that can
  pulse, equip, ghost, split, and replay.
- **The optometrist is a ranking algorithm.** "Better like this, or like this?"
  is specified as pairwise preference aggregation over `Comparison` events, with
  "about the same" as a legitimate stopping signal.
- **The party is commedia dell'arte.** Whiteface plans, Auguste makes,
  Contra-Auguste tries to break it, the Watcher narrates, and Lazzi are bounded
  side routines with tight budgets. They are masks, worn not owned, and the
  names never leak into a pull request.
- **The planned glyph grammar is a functional program.** Reduced opacity is
  dormant, blur is stale, a vertical flip is failed, a horizontal mirror is the
  semantic opposite, and inversion is an adversarial stance. You equip
  "Evidence-Bound," never "blue glow."
- **Memento is the execution model.** A protagonist with no session memory who
  stays coherent only through durable external artifacts he has disciplined
  himself to trust. Inception is nested episodes on different time bases. Ex
  Machina is why implementer and verifier are separated by structure rather than
  by habit.
- **The 12 Days of Christmas rule.** A replacement singer joining on day four
  needs the current verse, tempo, and score, not a recording of every prior
  performance. That is why fresh task-scoped sessions are normal here.
- **Nothing in the blueprint is allowed to disappear.** The idea ledger is
  append-only, holds every significant founding idea from eleven chats, four
  notes files, and forty-six images, and superseding an entry requires naming
  what it replaces. That was an operator directive against recency bias, and it
  is why intermediate ideas keep resurfacing on purpose.
- **There is a candidate mechanic whose whole job is to argue for leaving things
  alone.** "Beware of naive interventionism" asks what compensating function the
  current mess might be serving before anyone is allowed to clean it.

## The repo runs on itself

DotLn is being built with its own process, and the machinery under construction
is also the machinery in force. Work happens in bounded work orders inside
isolated worktrees. A model that implements never verifies its own work; a
blinded second session does, and writes an immutable numbered report. Final
review is a third pass. A fresh session resumes from one phrase:

```text
resume: status
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The phrase resolves against an append-only control log to the active work order
and the exact artifacts the session must read. Illegal transitions refuse and
append nothing. Every state-changing transition attempts a recovery checkpoint
first and records when one is unavailable. A release tag names the reviewed
merged commit, and its annotation is where the manifest now lives, so a tag can
never quietly describe a different commit than the one it names.

Driving the car while building it has consequences the docs spell out. Past
artifacts are judged against the process that existed when they were made, and a
missing artifact whose convention had not been invented yet is not a defect. A
new guard binds new work and never rewrites history to look tidy. When the
instrument you are using to judge is itself the thing under review, you say so.
The receipts include the embarrassing ones: for three work orders the executor
ran at low reasoning effort while the playbook said otherwise, nothing detected
it, and the nominated fix is a work order that turns declared effort into an
attested, checked fact instead of prose. One drafted work order goes further and
asks DotLn to compile, from its own primitives, the reviewer session that
drafted several of the other work orders: identity, role, loadout, authority
envelope, and all. Gödel, Escher, Bach is on the sources list for a reason.

Yes, there is currently more blueprint than code. The ledger records that ratio
as an open tension rather than a settled virtue, and the strangler experiment is
explicit: typed mechanisms are meant to progressively absorb the prose. The
[operator playbook](docs/PLAYBOOK.md) has the whole loop.

## Map

- [`packages/kernel/`](packages/kernel/) — deterministic, framework-free event
  and decision core.
- [`packages/skeleton/`](packages/skeleton/) — the executable Repo Gardener +
  Seiri vertical.
- [`scripts/`](scripts/) — the control plane: resume, worktree, release, intake
  backup, and their shell suites.
- [`docs/product/`](docs/product/) — the blueprint: vision, principles, domain
  model, architecture, interfaces, patterns, roadmap, execution guide,
  publication compiler, audit and privacy, IR compatibility, προτείνω.
- [`docs/work-orders/`](docs/work-orders/) — bounded implementation authority,
  one file per unit of work.
- [`docs/verifications/`](docs/verifications/) and
  [`docs/final-reviews/`](docs/final-reviews/) — immutable, numbered evidence
  history.
- [`docs/control/`](docs/control/) — the append-only resume log and its
  generated projection.
- [`docs/lineage/`](docs/lineage/) — the idea ledger.
- [`docs/decisions/`](docs/decisions/) — settled questions. Do not relitigate
  them.
- [`docs/releases/`](docs/releases/) — release evidence and the tag-manifest
  template.
- [`docs/publication/`](docs/publication/) — the same blueprint compiled for
  different readers, with a hash lock that proves when an edition has gone
  stale.
- [`corpus/`](corpus/) — committed test corpora that regenerate byte-for-byte
  from recorded seeds.
- `docs/intake/` — raw ideation, local only, deliberately outside Git.

If you want the idea first, read [the vision](docs/product/00-vision.md). If you
want the machinery, start with
[the domain model](docs/product/02-domain-model.md) and
[architecture](docs/product/03-architecture.md). If you want to see something
move, run [the skeleton](packages/skeleton/README.md).

## One boundary that does not move

This is a personal clean-room project. Employer code, configuration,
identifiers, internal services, and proprietary implementation details do not
belong here and never will. Raw ideation stays local until it has been
deliberately synthesized and rewritten. Everything public is original product
reasoning and implementation.

## Why "DotLn"?

_Days of the Natural Logarithm._ The letters of DAY and LN rearrange into the
author's first name, and the phrase is a small technical pun: soft behavioral
influences may evolve through additive log-odds composition, one candidate
policy for how compatible supports can stack. Hard-precedence layers do not.
Personal, mathematical, and just strange enough to fit the thing being built.

DotLn is early on purpose. The current proof is small enough to understand all
the way through. The ambition is not, and the plan is to keep the proof honest
while the ambition catches up.
