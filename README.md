# DotLn

> "I will take the entire Business, Leadership, and Personal Development shelf
> at Barnes & Noble and just map them to different agent / subagent
> communication structures... at once anyone who has read those books is an
> expert in some feature of the app — and it turns all those books into
> programming books overnight."

**DotLn turns hard-won ways of working into inspectable programs for AI
teams.**

DotLn is a local-first, model-agnostic **compiler and runtime for human
judgment**. This repository develops the reusable platform and the author's
opinionated personal implementation together. In that implementation, you bring
the taste, standards, and corrections you have already paid for once; DotLn
compiles each into the smallest mechanism that can carry it, hands every task
only the rules it needs, enforces its chosen hard rules outside the model, and
keeps a replayable record of what happened. Models rotate. Sessions die. The
judgment survives.

Those guardrails are an implementation loadout, not commandments baked into the
platform. Another owner may choose stricter doctrine, different doctrine, or a
deliberately permissive profile with no verification or replay capability. DotLn
supplies composable mechanisms and makes the selected capabilities visible; the
owner decides which organization to build.

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
project's vocabulary it brought **the whole stash into every map** — as if a
character carried gear for every damage type when the map called only for cold
resistance.

The author's reference implementation answers with **compiled** rules; the
platform makes these mechanisms composable rather than requiring every owner to
equip the same set:

- do not delete what you cannot prove is dead → a structural guard, not a plea;
- show evidence before claiming success → a gate the model cannot talk past;
- preserve the operator's intent across handoffs → a bounded work order, not a
  transcript;
- ask only when the decision is genuinely material → an interruption policy with
  six named conditions;
- make presence-conditioned changes explicit → a preauthorized policy may hold,
  shrink, grow, peak, reset, or loop scope and authority while naming which axis
  changed; the current skeleton exercises one conservative return rule.

In that profile, a session gets **a build, not a biography**: one active
behavior, a handful of linked supports, the profile's small safety layer, and
the exact task state. The mission underneath is operator flow. Not a promise
about anyone's psychology, which no software can make, but a steady removal of
the interruptions, repetition, ceremony, and rediscovery that break it without
violating the capabilities and boundaries that implementation selected.

The reference loop is:

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

<!-- DOTLN-RELEASE-BEGIN -->

This source is DotLn `v0.6.0`. Optional Beacon output now encodes the latest consequential episode state in exact file size and event-derived mtime, with the matching L0 receipt inside. A separate fake-executor claim exposes its self-reported provenance; the constellation reads metadata alone. The default scenario output changes only its package-version banner. The generated [work-order index](docs/work-orders/README.md) leads with the operator's proposed sequence and control-derived progress, with complete evidence below; current Protíno content lives at its corrected path. The walking skeleton still runs the compiled Repo Gardener + Seiri scenario. Its executor and verifier remain deterministic fakes. The Entropy Reducer's compiler and operator-mediated review evidence remain available; model transport, `Program.All`, and Beacon control-plane dogfood are deferred. Read published records on the [GitHub Releases page](https://github.com/DylanBWood/DotLn/releases), or render one locally with `npm run release -- notes <tag>`.
<!-- DOTLN-RELEASE-END -->

The walking skeleton first shipped in application release `v0.2.0`.

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

Run `npm run skeleton -- --compiled-diff` to add the three-view semantic-hash
receipt and the exact Seiri item tooltip, including every support's declared
mechanism, prompt-token, runtime, and episode cost.

Add `npm run skeleton -- --beacons .beacons` to write the demo's two Beacon
files into the explicitly selected, gitignored directory. The constellation
shows an earlier self-reported `verification/passed` claim beside the host's
latest evidenced `external-effect/observed` state (schedule cancellation),
sorted by exact byte size. Dates are 1970-relative because the demo uses virtual
time. Omitting the flag creates no beacon files. The path must be gitignored
when inside this repository and cannot be under `docs/intake`.

Size intentionally reveals the codebook fields; denying file-content reads
still leaves metadata visible. Provenance is a channel label, not writer
authentication or authority. See the [codebook and usage](packages/skeleton/README.md#beacon-metadata-projection)
and the [fresh host probe](docs/discovery/beacon-probe-2026-09-04.md).

The test suite feeds that log through the same pure reactor used by the live
host and compares complete decisions and semantic projections, including a
negative verifier outcome. `npm test` runs the configured root evidence suite:
kernel, compiler, skeleton, publication freshness, intake backup, resume control,
recovery checkpoints, real-Git worktree lifecycle, and guarded release close,
including the GitHub-body profile; frozen corpus lanes remain separate.
Evidence was recorded with Node 22 on macOS; the shell suites use macOS
utilities and fail loudly elsewhere. See the
[release index](docs/releases/README.md),
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
- composition semantics beyond the bounded Seiri v1 subset;
- saved community builds or compatibility migration;
- a web, spatial, or drag-and-drop console;
- SQLite persistence, hosted operation, or a published package;
- the complete independently verified source-to-deliverable pipeline.

Scheduled capabilities are roadmap rungs with exit criteria; the rest remain
explicit horizons rather than promises with invented dates. The audit
projections over the same log are a receipt, a causal timeline, and governed
raw, each naming exactly what it omits.

## The bets

- **A session is an incarnation, not a memory.** In the reference workflow,
  durable state lives in artifacts and the event log. The workflow remembers
  the worker; the worker never needs to remember the workflow.
- **Deterministic core, strange edge.** Models, humans, browsers, and shell
  scripts execute work. None of them get to redefine the control logic
  invisibly.
- **This implementation's hard safety is boring.** Permissions, guards,
  worktrees, and evidence gates carry its chosen invariants outside prompt
  prose. Prose is the ninth and last mechanism choice in that loadout.
- **In this implementation, evidence precedes "done."** A persuasive completion
  message is not a test result.
- **Its implementer and verifier are different roles,** making
  self-certification structurally awkward. Another profile may label an outcome
  owner-accepted or unverified instead.
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
event where two variants diverge. Today the Repo Gardener + Seiri loadout is
executable through the pinned v1 graph; other active mechanics, saved builds,
and interactive editing remain deferred.

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
[προτείνω](docs/product/11-protino.md).

## Things you would not expect to find in here

- **Refusal is an event, not a politeness.** When the Gardener reaches for
  deletion, the kernel does not ask it nicely to stop. It records
  `CommandRefused`, and code that depended on the denied effect quietly
  succeeding will not get it.
- **Presence is policy, not a one-way brake.** An owner may preauthorize
  time-conditioned shrinkage or growth, including progressive stakes and a
  reset or loop. The author's candidate profile favors bounded housekeeping so
  the changes remain easy to understand on return; the current skeleton proves
  only one conservative return/cancellation branch. Availability of a powerful
  adapter remains separate from permission to use it. At work-order scale, an
  opted-in unattended portfolio can run small already-authorized orders first,
  then treat larger preauthorized orders as capacity-permitting options.
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
- **Memento is the reference execution profile.** A protagonist with no session
  memory who stays coherent only through durable external artifacts he has
  disciplined himself to trust. Inception is nested episodes on different time
  bases. Ex Machina is why the author's assurance profile separates implementer
  and verifier by structure rather than by habit.
- **The Twelve Days of Christmas context analogy.** Each later verse carries
  the earlier material with it. Starting a fresh session with an enormous
  inherited context is like beginning the song on day five: the first verse
  you sing is already long. DotLn aims to preserve durable history while
  loading only the context needed for the present task, so past success does
  not become an ever-growing admission cost to new work.
- **Nothing in the blueprint is allowed to disappear.** The idea ledger is
  append-only, holds every significant founding idea from eleven chats, four
  notes files, and forty-six images, and superseding an entry requires naming
  what it replaces. That was an operator directive against recency bias, and it
  is why intermediate ideas keep resurfacing on purpose.
- **There is a candidate mechanic whose whole job is to argue for leaving things
  alone.** "Beware of naive interventionism" asks what compensating function the
  current mess might be serving before anyone is allowed to clean it.

## Sources, license, and legal posture

DotLn makes no claim that its pieces—or even this mixture of them—are novel. The
[Sources and inspirations register](docs/lineage/inspirations.md) is the living
best-known account of the books, methods, papers, stories, games, tools,
conversations, failures, personal practice, and ambient culture that shaped it.
An influence can be named before it has a clean DotLn mapping; `unknown`,
`source forgotten`, and `ambient` are better than laundering inheritance into a
claim of invention. Names identify sources and imply no affiliation or
endorsement. Attribution alone grants no permission to copy protected expression
or code.

This repository currently grants **no project license**. Public source is not
the same as open source; GitHub's service terms still permit viewing and
reproduction through GitHub functionality, including in-service forking. No
permanent license has been chosen because this remains personal research, but
that ambiguity must end at the first canonical decision gate: outside
contributions; package, executable, container, dataset, model, or asset
distribution; a hosted or multi-user service; collection of another person's
account data, prompts, logs, telemetry, or other personal information; sale,
licensing, fundraising, or material marketing; or substantial investment in a
DotLn or feature-brand name. The observed state, options,
package-publication gap, and controlling checklist are in
[Legal and licensing posture](docs/LEGAL.md).

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
- [`docs/lineage/`](docs/lineage/) — the idea ledger and public sources and
  inspirations register.
- [`docs/LEGAL.md`](docs/LEGAL.md) — current no-license posture and the gates
  that force an explicit choice.
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
deliberately processed under the repository's promotion policy: ordinary
material is synthesized and rewritten, while explicitly authorized operator
drafts or reviewed source references may retain exact text with provenance.
Public material is clean-room-reviewed product reasoning and implementation;
attributed retained expression is identified rather than claimed as original.

## Why "DotLn"?

_Days of the Natural Logarithm._ The letters of DAY and LN rearrange into the
author's first name, and the phrase is a small technical pun: soft behavioral
influences may evolve through additive log-odds composition, one candidate
policy for how compatible supports can stack. Hard-precedence layers do not.
Personal, mathematical, and just strange enough to fit the thing being built.

DotLn is early on purpose. The current proof is small enough to understand all
the way through. The ambition is not, and the plan is to keep the proof honest
while the ambition catches up.
