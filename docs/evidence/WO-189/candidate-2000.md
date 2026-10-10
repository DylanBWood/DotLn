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
bring the taste, standards and corrections you have already paid for once;
DotLn compiles each into the smallest mechanism that can carry it, hands every
task only the rules it needs, enforces its chosen hard rules outside the model
and keeps a replayable record of what happened. Models rotate. Sessions die.
The judgment survives.

DotLn is not an agent, not an agent harness, and not an orchestration layer.
It is an **agentic platform**: the shared substrate on which people and
software actors hold work, authority and evidence. Harnesses run on it as
observed environments and an orchestration layer runs inside it; neither is
what it is. The guardrails here are an implementation loadout, not
commandments baked into the platform; another owner may choose stricter
doctrine, different doctrine, or a deliberately permissive profile, and the
owner decides which organization to build.

It is early, small, and deliberately honest about which of these sentences are
running code and which are still a promise. The first proof already walks.

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

The reference implementation answers with **compiled** rules, and the platform
makes those mechanisms composable rather than requiring every owner to equip
the same set:

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
the exact task state. The mission underneath is operator flow: not a promise
about anyone's psychology, but a steady removal of the interruptions,
repetition, ceremony and rediscovery that break it. The reference loop is:

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
This source prepares DotLn `v0.73.1`.
<!-- DOTLN-RELEASE-END -->

<!-- dotln-what-runs:start -->
Read the loop above from left to right; each stage below is running code.
Compile: a deterministic kernel and compiler turn a loadout graph into a bounded program and an authority envelope that is checked on every decision.
A typed reactor folds durable, decoded events into replayable state, so a crash after a command persists recovers without repeating the effect.
Run: the Repo Gardener plus Seiri scenario runs end to end from a JSONL event log with a separate fake verifier, and `npm run skeleton` prints its timeline and receipt.
The resident host, the `dotln` tool's `resident` and `presence` commands, drives a compiled presence policy from recorded time and explicit away and back edges, dispatching declared scripts, CLI workers or human handoffs without duplicate episodes; its recorded runs establish neither an installed service nor a measured payoff curve.
On its own cadence the resident asks whether the running work is still inside its contract, and a mission check that finds drift holds every further unattended dispatch until a human answers.
Change: disposable worker episodes on Claude Code and Codex have changed a synthetic module in isolated worktrees, passed its host test and committed, and a killed host recovers the existing commit instead of dispatching a second writer.
Verify: a blinded verifier, given nothing from the implementer, judges the change against its sealed contract and diff, and a bounded repair loop re-verifies the original contract after each repair.
A standalone browser evidence adapter runs saved scenarios on a synthetic local app and supplies screenshot, DOM, network and console witnesses to that verification.
Publish: the worktree tool's `publish` command opens a pull request for such a change on its target repository, pushing only the observed commit, only under an operator grant, and only after an outward lint of branch, commits, title and body.
The `dotln` tool's `vertical` command runs that whole loop unaided from a filed issue, waits for the automated reviewer and triages each review comment with evidence, so far in recorded scratch proofs.
Intend: `npm run dotln -- intent "Describe the work"` files a draft work order for review, and derived work shares the identity and lifecycle of authored work.
Inspect: the actor board (`npm run console -- board`) renders recorded actors, builds, mechanisms and evidence, and the live text console refreshes status and invokes commands over a loopback contract whose token sits in an owner-only descriptor.
Govern: this repository runs on the same machinery, with generated hooks that reserve one writer per worktree, refuse writes to gate inputs during a live gate and refuse unknown outside destinations, while every lifecycle step resumes from one phrase.
<!-- dotln-what-runs:end -->

**Not yet built, and not claimed:** general source-writing worker profiles
beyond the bounded transports above; composition semantics beyond the bounded
Seiri subset; saved community builds or compatibility migration; an
interactive web, spatial or drag-and-drop console; SQLite persistence, hosted
operation or a published package; the complete independently verified
source-to-deliverable pipeline; portable starter export, a portfolio in the
operator's own repositories and a measured absence payoff curve. The
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
glyphs that is a pure projection of that same log, and a receipt. The
[skeleton README](/packages/skeleton/README.md) documents the flags that add
the compiled-view hashes and the Beacon metadata demo, and
[CONTRIBUTING.md](/CONTRIBUTING.md) describes the toolchain and the test
runner.

## The bets

- **A session is an incarnation, not a memory.** Durable state lives in
  artifacts and the event log.
- **Deterministic core, strange edge.** Models, humans, browsers and shell
  scripts execute work. None of them get to redefine the control logic
  invisibly.
- **Hard safety is boring.** Permissions, guards, worktrees and evidence gates
  carry the chosen invariants outside prompt prose; prose is the last mechanism
  choice.
- **Evidence precedes "done."** A persuasive completion message is not a test
  result.
- **Implementer and verifier are different roles,** making self-certification
  structurally awkward.
- **Doing nothing is a decision.** `NoOp` is a first-class intent with a
  reason, evidence and a re-check cadence.
- **Every metaphor reveals its mechanics.** RPG, business card, statechart,
  function table, timeline and code views resolve to the same truth, or say
  plainly that they are lossy.
- **The substrate is shared; the doctrine is yours.** DotLn ships legos, not a
  finished organization.
- **No fake numbers, ever.** Declared mechanics, computed attributes and
  empirical performance are never blurred together.

The scarce resource is not generation. It is the **selection function**:
knowing which combination is good, which correction matters, and when the
right move is to wait.

## Who works here

UIFA (“wee-fuh”, User Interfaces for Actors) names the interface direction, and
the humans around it have names too: the **UIFA product lead** who keeps the
future state sharp, the **showrunner** who sequences bounded work across
parallel workflows, the **engineer** who hand-crafts roles and supports, the
**tester** who invents the scenarios automation then repeats forever, and
**devops**, who builds the machinery that makes the machinery. One person can
wear all five hats in an afternoon. The full treatment, with the five roles
mapped onto a kitchen, a hospital ward, a film crew and more, is in
[UIFA roles](/docs/product/13-uifa-roles.md).

## The game is not decoration

DotLn borrows the build vocabulary of action RPGs because it turns out to be an
excellent typed language for scoped, composable behavior.

| RPG view        | DotLn mechanic                                                 |
| --------------- | -------------------------------------------------------------- |
| Build / loadout | The exact behavior compiled for this task                      |
| Support gem     | A typed modifier that participates only through a valid link   |
| Map / zone      | The repository and its isolated worktree                       |
| Summon          | A disposable worker episode                                    |
| Combat log      | The append-only event and evidence history                     |
| Guarded ability | Authority checked before an effect can occur                   |

Links are **scope, not sequence**. Rarity encodes provenance, never power. A
rate-limit debuff shows the real backoff timer. And the second thesis is about
authoring: the business, leadership and personal-development shelf becomes a
library of executable patterns, so anyone who has read those books already
knows a feature of the app. 5S, the Ladder of Leadership, mitigated speech,
Theory of Constraints, optimal stopping: each is being mapped to exact
mechanics that render in whichever view you prefer. The long-term surface is a **Path of
Building for organizations**: equip a pattern, see its exact compiled diff,
compare builds, and replay to the first event where two variants diverge.

## Three horizons, one kernel

1. **Work operating system.** Bounded work, disposable workers, external
   memory, explicit authority, evidence-backed completion. The immediate
   product.
2. **Executable pattern workshop.** The shelf-to-mechanism compiler and the
   drag-a-card-onto-an-agent authoring surface. The differentiated product.
3. **Agent ecology and simulation laboratory.** Paired counterfactual runs,
   first-divergence detection, actor swaps over recorded logs. The research
   product. Deterministic replay is what makes it possible at all.

The [roadmap](/docs/product/06-roadmap.md) climbs there one visible payoff at
a time. The release the roadmap calls teammate-ready has one exit criterion:
a person who has never read these docs declares one bounded intent and
receives a verifiable result, witnessed by a non-author. Beyond it sits the
named flagship, **προτείνω**: a
small, persistent simulated community where you select a resident or a group,
write to them in prose, and watch what changes, what does not, and why the
system believes your words participated; the scoreboard is a paired
counterfactual branch. Candidate first world: a basketball squad. See
[προτείνω](/docs/product/11-protino.md).

## Sources, license, and legal posture

DotLn makes no claim that its pieces, or even this mixture of them, are novel.
The [sources and inspirations register](/docs/lineage/inspirations.md) is the
living best-known account of the books, methods, papers, stories, games, tools
and failures that shaped it; `unknown` and `ambient` are better than
laundering inheritance into a claim of invention. Names identify sources and
imply no affiliation or endorsement.

Code is licensed under the [Apache License 2.0](/LICENSE) and documentation
under [Creative Commons Attribution 4.0](/LICENSE-docs); see
[`NOTICE`](/NOTICE) for the copyright notice, [CONTRIBUTING.md](/CONTRIBUTING.md)
for the sign-off rule and [docs/LEGAL.md](/docs/LEGAL.md) for the decision
record. Packages stay private until a separate publication decision.

## The repo runs on itself

DotLn is being built with its own process, and the machinery under
construction is also the machinery in force. Work happens in bounded work
orders inside isolated worktrees. A model that implements never verifies its
own work; a blinded second session does, and writes an immutable numbered
report. Final review is a third pass. A fresh session resumes from one phrase:

```text
resume: status
resume: times
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The phrase resolves against an append-only control log to the active work
order and the exact artifacts the session must read. Illegal transitions
refuse and append nothing. The reviewer supplies one product-gate row keyed by
code identity; the release manifest records that row's reviewed tree beside
the merged tree, and publication requires the two to match.

Driving the car while building it has consequences the docs spell out. Past
artifacts are judged against the process that existed when they were made, and
a new guard binds new work without rewriting history to look tidy. The receipts
include the embarrassing ones. The planning reviewer that judges this
repository's own plans is itself compiled from DotLn primitives: identity,
role, loadout, authority envelope and all. Gödel, Escher, Bach is on the
sources list for a reason.

Yes, there is currently more blueprint than code. The ledger records that
ratio as an open tension rather than a settled virtue, and the strangler
experiment is explicit: typed mechanisms are meant to progressively absorb the
prose. The [operator playbook](/docs/PLAYBOOK.md) has the whole loop.

## Map

- [`packages/kernel/`](/packages/kernel/) — the deterministic, framework-free
  event and decision core.
- [`packages/compiler/`](/packages/compiler/) — the pure composition compiler,
  artifact identity and harness lowering.
- [`packages/skeleton/`](/packages/skeleton/) — the executable Repo Gardener +
  Seiri vertical, the resident host, workers and verification.
- [`packages/console/`](/packages/console/) — the actor board, the live text
  console and the resident command client.
- [`packages/browser-evidence/`](/packages/browser-evidence/) — the standalone
  browser witness adapter.
- [`packages/beacons/`](/packages/beacons/) — build-free Beacon codebooks and
  encoders.
- [`scripts/`](/scripts/) — the control plane: resume, worktree, release,
  intake backup, and their suites.
- [`docs/product/`](/docs/product/) — the blueprint, from the vision to the
  UIFA roles.
- [`docs/work-orders/`](/docs/work-orders/) — bounded implementation
  authority, one file per unit of work.
- [`docs/verifications/`](/docs/verifications/) and
  [`docs/final-reviews/`](/docs/final-reviews/) — immutable, numbered evidence
  history.
- [`docs/control/`](/docs/control/) — the append-only resume log and its
  generated projection.
- [`docs/lineage/`](/docs/lineage/) — the idea ledger and the public sources
  and inspirations register.
- [`docs/decisions/`](/docs/decisions/) and [`docs/LEGAL.md`](/docs/LEGAL.md)
  — historical decision records and the license decision.
- [`docs/releases/`](/docs/releases/) and
  [`docs/publication/`](/docs/publication/) — release evidence, and the
  blueprint compiled for different readers.
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
operator drafts may retain exact text with provenance.

## Why "DotLn"?

_Days of the Natural Logarithm._ The letters of DAY and LN rearrange into the
author's first name, and the phrase is a small technical pun: soft behavioral
influences may evolve through additive log-odds composition, one candidate
policy for how compatible supports can stack. Hard-precedence layers do not.
Personal, mathematical, and just strange enough to fit the thing being built.

DotLn is early on purpose. The current proof is small enough to understand all
the way through. The ambition is not, and the plan is to keep the proof honest
while the ambition catches up.
