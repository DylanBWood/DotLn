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
opinionated personal implementation together. In that implementation, you
bring the taste, standards, and corrections you have already paid for once;
DotLn compiles each into the smallest mechanism that can carry it, hands every
task only the rules it needs, enforces its chosen hard rules outside the
model, and keeps a replayable record of what happened. Models rotate. Sessions
die. The judgment survives.

DotLn is not an agent, not an agent harness, and not an orchestration layer. It
is an **agentic platform**: the shared substrate on which people and software
actors hold work, authority, and evidence. Harnesses run on it as observed
environments and an orchestration layer runs inside it; neither is what it is.

Those guardrails are an implementation loadout, not commandments baked into the
platform. Another owner may choose stricter doctrine, different doctrine, or a
deliberately permissive profile with no verification or replay capability.
DotLn supplies composable mechanisms and makes the selected capabilities
visible; the owner decides which organization to build.

It is early, small, and deliberately honest about which of those sentences are
running code and which are still a promise. The first proof already walks. The
ambition does not fit in a paragraph, so this page is longer than one.

## What runs today

<!-- DOTLN-RELEASE-BEGIN -->
This source prepares DotLn `v0.73.1`.
<!-- DOTLN-RELEASE-END -->

<!-- dotln-what-runs:start -->
Follow one piece of work through the machinery that exists now.
It begins as an intent: `npm run dotln -- intent "Describe the work"` files a draft work order for review, and derived work shares the identity and lifecycle of authored work.
A deterministic kernel and compiler turn the order's loadout graph into a bounded program and an authority envelope that is checked on every decision, and a typed reactor folds durable, decoded events into replayable state.
The order is executed in an isolated worktree by a disposable worker episode on Claude Code or Codex, which in the recorded scratch proofs changed a synthetic module, passed its host test and committed; a killed host recovers the existing commit instead of dispatching a second writer.
A blinded verifier, given nothing from the implementer, judges the change against its sealed contract and diff, and a bounded repair loop re-verifies the original contract after each repair.
When the subject is a web page, a standalone browser evidence adapter runs saved scenarios on a synthetic local app and supplies screenshot, DOM, network and console witnesses to that verification.
The worktree tool's `publish` command then opens a pull request on the target repository, pushing only the observed commit, only under an operator grant for pushing and opening, and only after an outward lint of branch, commits, title and body passes.
The `dotln` tool's `vertical` command runs that whole loop unaided from a filed issue, waits for the automated reviewer and triages each review comment with evidence before resolving the thread, so far in recorded scratch proofs.
Around the work sits a resident host, the `dotln` tool's `resident` and `presence` commands, that drives a compiled presence policy from recorded time and explicit away and back edges, dispatching declared scripts, CLI workers or human handoffs without duplicate episodes; its recorded runs establish neither an installed service nor a measured payoff curve.
On its own cadence the resident asks whether the running work is still inside its contract, and a mission check that finds drift holds every further unattended dispatch until a human answers or a fresh judgment passes.
The whole run is inspectable: the actor board (`npm run console -- board`) renders recorded actors, builds, mechanisms and evidence, and the live text console refreshes status and invokes commands over a loopback contract whose token sits in an owner-only descriptor.
The first proof still walks: the Repo Gardener plus Seiri scenario runs end to end from a JSONL event log, refuses deletion structurally and verifies its candidates with a separate fake verifier, and `npm run skeleton` prints its timeline and receipt.
This repository runs on the same machinery: bounded work orders in worktrees, independent verification, a third-pass final review, publication and release close, each resumed from one phrase.
Generated hooks enforce the hard rules outside the model: one writer per worktree, no writes to gate inputs during a live gate, no repository writes outside documents on planning branches, a cap on observable sub-agents, and no writes to unknown destinations outside the project.
<!-- dotln-what-runs:end -->

### What that proves, and what it does not

Proven: a framework-free kernel can keep every decision pure, with no hidden
clock, randomness or I/O; virtual time plus a logged state reproduces the
scenario outputs the replay tests assert; authority can refuse an effect
structurally instead of asking a model to remember not to; a crash after
command persistence recovers without duplicating the effect; operator return
cancels future work and turns a queued pulse into a traced `NoOp`; friendly
glyphs stay honest projections of real event state.

**Not yet built, and not claimed:** general source-writing worker profiles
beyond the bounded transports above; composition semantics beyond the bounded
Seiri subset; saved community builds or compatibility migration; an
interactive web, spatial, or drag-and-drop console; SQLite persistence, hosted
operation, or a published package; the complete independently verified
source-to-deliverable pipeline; portable starter export, a portfolio in the
operator's own repositories and a measured absence payoff curve. Scheduled
capabilities are roadmap rungs with exit criteria; the rest remain explicit
horizons rather than promises with invented dates. The
[goal review](/docs/planning/refutations/README.md) retains the reopening
observations, [CONTRIBUTING.md](/CONTRIBUTING.md) covers the toolchain and
tests, and published source records are on the
[GitHub Releases page](https://github.com/DylanBWood/DotLn/releases).

## Try it

```bash
npm install
npm run skeleton
```

The scenario gives a **Repo Gardener** one active mechanic, **Seiri / Sort /
整理**, the first S of 5S:

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

You get a numbered timeline derived from the JSONL event log, one line of
glyphs that is a pure projection of that same log, and a receipt:

```text
🐛 Repo Gardener  ◌ dormant  ⏱️ pulsing  🔎 inspecting  🛡️ inverted/refused  ✅ verified  ☀️ phase:returned  💤 faded/cancelled
```

The [skeleton README](/packages/skeleton/README.md) documents the flags that
add the three-view semantic-hash receipt and the Beacon metadata demo, and
[CONTRIBUTING.md](/CONTRIBUTING.md) describes the toolchain, the test runner
and the sandbox posture.

## Why this exists

Working with AI agents drifts into babysitting. You restate context, supply
procedure, coordinate tools, check "done" claims that are not evidence, and
recover stalled work. Your attention goes to the machinery instead of the idea.

The usual fix is a bigger prompt. A predecessor system, not present in this
repository, proved the concept and then collapsed under its own success:
roughly 140 hard-won rules loaded as prose, hundreds of thousands of tokens of
always-on context, rules firing wrongly or vanishing when they mattered most.
In this project's vocabulary it brought **the whole stash into every map**, as
if a character carried gear for every damage type when the map called only for
cold resistance.

The author's reference implementation answers with **compiled** rules; the
platform makes these mechanisms composable rather than requiring every owner to
equip the same set:

- do not delete what you cannot prove is dead → a structural guard, not a plea;
- show evidence before claiming success → a gate the model cannot talk past;
- preserve the operator's intent across handoffs → a bounded work order, not a
  transcript;
- ask only when the decision is genuinely material → an interruption policy
  with six named conditions;
- make presence-conditioned changes explicit → a preauthorized policy may hold,
  shrink, grow, peak, reset, or loop scope and authority while naming which
  axis changed; the current skeleton exercises one conservative return rule.

In that profile, a session gets **a build, not a biography**: one active
behavior, a handful of linked supports, the profile's small safety layer, and
the exact task state. The mission underneath is operator flow. Not a promise
about anyone's psychology, which no software can make, but a steady removal of
the interruptions, repetition, ceremony, and rediscovery that break it, without
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

## Who works here: five UIFA roles

UIFA (“wee-fuh”, User Interfaces for Actors) is the name for the interface
direction, and the humans around it have names too. One person can wear all
five hats in an afternoon.

- **UIFA product lead** knows the domain and its screens and keeps sharpening
  the future state; the platform transcribes and stores that vision.
- **UIFA showrunner** (architect plus scrum master) sequences bounded work
  across parallel workflows and knows what is active, blocked, and closed.
- **UIFA engineer** hand-crafts the actor experience: roles, supports, link
  groups, and temporal structures, instead of letting a model guess the mapping.
- **UIFA tester** tests whether a proposed shape, role, or support does what it
  should in the circumstances that matter, and invents the scenarios automation
  then repeats forever.
- **UIFA devops** builds the machinery that makes the machinery: the control
  plane, compilers, generators, and evidence gates.

People stay in these loops because their prior associations differ from a
model's, and that judgment is where an implementation's secret sauce lives.
The full treatment, with the same five roles mapped onto a kitchen, a hospital
ward, a film crew, a classroom, a farm, an orchestra, a basketball team, and an
open-source project, is in [UIFA roles](/docs/product/13-uifa-roles.md).

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
executable through the pinned graph; other active mechanics, saved builds, and
interactive editing remain deferred.

## Three horizons, one kernel

1. **Work operating system.** Bounded work, disposable workers, external memory,
   explicit authority, evidence-backed completion. The immediate product.
2. **Executable pattern workshop.** The shelf-to-mechanism compiler and the
   drag-a-card-onto-an-agent authoring surface. The differentiated product.
3. **Agent ecology and simulation laboratory.** Paired counterfactual runs,
   first-divergence detection, actor swaps over recorded logs. The research
   product. Deterministic replay is what makes it possible at all.

The [roadmap](/docs/product/06-roadmap.md) climbs there one visible payoff at
a time: audit projections, a real composition compiler, a real disposable
worker, independent verification, a feedback compiler, then synchronized
terminal and visual consoles, and a launchpad export of this repository's
process kit that other organizations can fork. The release the roadmap calls
teammate-ready has one exit criterion: a person who has never read these docs
declares one bounded intent and receives a verifiable result, witnessed by a
non-author.

Beyond it sits the named flagship, **προτείνω**: a small, persistent simulated
community where you select a resident or a group, write to them in prose at any
length, and watch what changes, what does not, and why the system believes your
words participated. Residents may ignore, misread, adopt, or relay what you
said, and the scoreboard is a paired counterfactual branch rather than a
before-and-after. Candidate first world: a basketball squad. See
[προτείνω](/docs/product/11-protino.md).

## Things you would not expect to find in here

- **Refusal is an event, not a politeness.** When the Gardener reaches for
  deletion, the kernel does not ask it nicely to stop. It records the refusal,
  and code that depended on the denied effect quietly succeeding will not get
  it.
- **Presence is policy, not a one-way brake.** An owner may preauthorize
  time-conditioned shrinkage or growth, a peak, and a reset or loop. The
  author's Blackjack analogy: raising the stake after losses makes the profit
  on the eventual first win rise, peak, then decline; for workers, continued
  operator absence can enable larger useful work up to a peak, then smaller
  work on the downswing. The losing streak corresponds only to time away.
- **Index cards are a planned frontend.** They worked once; a physical-card
  importer is specified to map them to the IR. The ambient end state is a
  magnetic LED whiteboard whose digital form is a living index card.
- **The optometrist is a ranking algorithm.** "Better like this, or like this?"
  is specified as pairwise preference aggregation over comparison events, with
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
- **Nothing in the blueprint is allowed to disappear.** The idea ledger is
  append-only and superseding an entry requires naming what it replaces. That
  was an operator directive against recency bias, and it is why intermediate
  ideas keep resurfacing on purpose.
- **There is a candidate mechanic whose whole job is to argue for leaving things
  alone.** "Beware of naive interventionism" asks what compensating function the
  current mess might be serving before anyone is allowed to clean it.

## Sources, license, and legal posture

DotLn makes no claim that its pieces, or even this mixture of them, are novel.
The [sources and inspirations register](/docs/lineage/inspirations.md) is the
living best-known account of the books, methods, papers, stories, games, tools,
conversations, failures, personal practice, and ambient culture that shaped it.
An influence can be named before it has a clean DotLn mapping; `unknown`,
`source forgotten`, and `ambient` are better than laundering inheritance into a
claim of invention. Names identify sources and imply no affiliation or
endorsement. Attribution alone grants no permission to copy protected expression
or code.

Code is licensed under the [Apache License 2.0](/LICENSE) and documentation
under [Creative Commons Attribution 4.0](/LICENSE-docs); see
[`NOTICE`](/NOTICE) for the copyright notice. The names DotLn, προτείνω, and
UIFA are not licensed as source identifiers; a fork may say it is based on
DotLn without implying affiliation or endorsement. Outside contributions are
accepted under the same licenses with a sign-off; see
[CONTRIBUTING.md](/CONTRIBUTING.md) for the rule and the operator exemption.
Packages stay private until a separate publication decision. The decision
record, its scope for code, documentation, names, contributions, and
distribution, and the gates that remain open are in
[docs/LEGAL.md](/docs/LEGAL.md).

## The repo runs on itself

DotLn is being built with its own process, and the machinery under construction
is also the machinery in force. Work happens in bounded work orders inside
isolated worktrees. A model that implements never verifies its own work; a
blinded second session does, and writes an immutable numbered report. Final
review is a third pass. A fresh session resumes from one phrase:

```text
resume: status
resume: times
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The phrase resolves against an append-only control log to the active work order
and the exact artifacts the session must read. Illegal transitions refuse and
append nothing. Every state-changing transition attempts a recovery checkpoint
first and records when one is unavailable. The reviewer supplies one
product-gate row keyed by code identity. The release manifest records that
row's reviewed tree beside the merged tree, and publication requires matching
code identity. The annotated tag names the merged commit and carries the
manifest.

Driving the car while building it has consequences the docs spell out. Past
artifacts are judged against the process that existed when they were made, and
a missing artifact whose convention had not been invented yet is not a defect.
A new guard binds new work and never rewrites history to look tidy. When the
instrument you are using to judge is itself the thing under review, you say so.
The receipts include the embarrassing ones, and they stay as historical
evidence. The planning reviewer that judges this repository's own plans is
itself compiled from DotLn primitives: identity, role, loadout, authority
envelope, and all. Gödel, Escher, Bach is on the sources list for a reason.

Yes, there is currently more blueprint than code. The ledger records that ratio
as an open tension rather than a settled virtue, and the strangler experiment is
explicit: typed mechanisms are meant to progressively absorb the prose. The
[operator playbook](/docs/PLAYBOOK.md) has the whole loop.

## Map

- [`packages/kernel/`](/packages/kernel/) — deterministic, framework-free event
  and decision core.
- [`packages/compiler/`](/packages/compiler/) — the pure composition compiler,
  artifact identity, feedback units and harness lowering.
- [`packages/skeleton/`](/packages/skeleton/) — the executable Repo Gardener +
  Seiri vertical, the resident host, disposable workers and verification.
- [`packages/console/`](/packages/console/) — the actor board, its versioned
  JSON contract, the live text console and the resident command client.
- [`packages/browser-evidence/`](/packages/browser-evidence/) — the standalone
  browser witness adapter.
- [`packages/beacons/`](/packages/beacons/) — build-free Beacon codebooks and
  encoders the control plane shares.
- [`scripts/`](/scripts/) — the control plane: resume, worktree, release, intake
  backup, and their shell suites.
- [`docs/product/`](/docs/product/) — the blueprint: vision, principles, domain
  model, architecture, interfaces, patterns, roadmap, execution guide,
  publication compiler, audit and privacy, IR compatibility, προτείνω, the
  workstream application candidate, and the UIFA roles.
- [`docs/work-orders/`](/docs/work-orders/) — bounded implementation authority,
  one file per unit of work.
- [`docs/verifications/`](/docs/verifications/) and
  [`docs/final-reviews/`](/docs/final-reviews/) — immutable, numbered evidence
  history.
- [`docs/control/`](/docs/control/) — the append-only resume log and its
  generated projection.
- [`docs/lineage/`](/docs/lineage/) — the idea ledger and public sources and
  inspirations register.
- [`docs/LEGAL.md`](/docs/LEGAL.md) — the license decision and the gates that
  remain open.
- [`docs/decisions/`](/docs/decisions/) — historical decision records; preserve
  their sources and append a sourced reopening when evidence or operator
  direction changes them.
- [`docs/releases/`](/docs/releases/) — release evidence and the tag-manifest
  template.
- [`docs/publication/`](/docs/publication/) — the same blueprint compiled for
  different readers, with a hash lock that proves when an edition has gone
  stale.
- [`corpus/`](/corpus/) — committed test corpora that regenerate byte-for-byte
  from recorded seeds.
- `docs/intake/` — raw ideation, local only, deliberately outside Git.

If you want the idea first, read [the vision](/docs/product/00-vision.md). If
you want the machinery, start with
[the domain model](/docs/product/02-domain-model.md) and
[architecture](/docs/product/03-architecture.md). If you want to see something
move, run [the skeleton](/packages/skeleton/README.md).

## One boundary that does not move

This is a personal clean-room project. Employer code, configuration,
identifiers, internal services, and proprietary implementation details do not
belong here and never will. Raw ideation stays local in `docs/intake/` until
it has been deliberately processed under the repository's promotion policy:
ordinary material is synthesized and rewritten, while explicitly authorized
operator drafts or reviewed source references may retain exact text with
provenance. Public material is clean-room-reviewed product reasoning and
implementation; attributed retained expression is identified rather than
claimed as original.

## Why "DotLn"?

_Days of the Natural Logarithm._ The letters of DAY and LN rearrange into the
author's first name, and the phrase is a small technical pun: soft behavioral
influences may evolve through additive log-odds composition, one candidate
policy for how compatible supports can stack. Hard-precedence layers do not.
Personal, mathematical, and just strange enough to fit the thing being built.

DotLn is early on purpose. The current proof is small enough to understand all
the way through. The ambition is not, and the plan is to keep the proof honest
while the ambition catches up.
