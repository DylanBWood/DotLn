# DotLn

> "The true work of the inventor consists in choosing among these combinations
> so as to eliminate the useless ones... the rules that must guide the choice
> are extremely fine and delicate. It's almost impossible to state them
> precisely; they must be felt rather than formulated." — Poincaré, via Pirsig

**DotLn turns hard-won ways of working into inspectable programs for AI
teams.** It is for people who work with AI agents and would rather spend their
attention on the idea than on the babysitting, and for any owner who brings
their own doctrine to a shared substrate; the author's own implementation is
its first user.

DotLn is a local-first, model-agnostic **compiler and runtime for human
judgment**. You bring the taste, standards and corrections you have already
paid for once; DotLn compiles each into the smallest mechanism that can carry
it, hands every task only the rules it needs, enforces the hard rules outside
the model and keeps a replayable record of what happened. Models rotate.
Sessions die. The judgment survives. The scarce resource was never generation;
it is the **selection function**, knowing which combination is good, which
correction matters, and when the right move is to wait.

> "I will take the entire Business, Leadership, and Personal Development shelf
> at Barnes & Noble and just map them to different agent / subagent
> communication structures... at once anyone who has read those books is an
> expert in some feature of the app — and it turns all those books into
> programming books overnight."

That is the second thesis, about authoring: the patterns people already know,
5S, the Ladder of Leadership, mitigated speech and Theory of Constraints, are
being mapped to exact mechanics, so anyone who has read those books will
already know a feature of the app. DotLn is not an agent, not an agent harness,
and not an orchestration layer. It is an **agentic platform**: the shared
substrate on which people and software actors hold work, authority and
evidence. The guardrails in this repository are the author's own loadout, not
commandments; another owner may choose stricter or different doctrine, and the
owner decides which organization to build. The people around the work are the
five **UIFA** roles (“wee-fuh”, User Interfaces for Actors): product lead,
showrunner, engineer, tester and devops
([UIFA roles](/docs/product/13-uifa-roles.md)). This page says which of its
sentences are running code and which are still a promise.

## Try it

With Node 26, two commands install the workspace and run the first proof:

```bash
npm install
npm run skeleton
```

A **Repo Gardener** with one active mechanic, **Seiri**, inspects a fixture
repository while the operator is away, is structurally refused the deletion
it reaches for, has its candidates checked by a separate fake verifier, and
stands down when the operator returns. You get a numbered timeline derived from
the event log, one line of glyphs projected from the same log, and a receipt.
Then look around: `npm run console -- board` renders actors, builds and evidence
from the repository's logs, and `npm run dotln -- intent "Describe the work"`
files a draft work order from one sentence. The
[skeleton README](/packages/skeleton/README.md) documents every flag.

## What runs today

<!-- DOTLN-RELEASE-BEGIN -->
This source prepares DotLn `v0.74.1`.
<!-- DOTLN-RELEASE-END -->

<!-- dotln-what-runs:start -->
Hand DotLn one sentence of intent and it files a draft work order; once you or a resident you have authorized admits it, the machinery, not your attention, carries the rules.
The compiler turns that order's loadout into a program and an authority envelope that the kernel checks on every decision, so a worker that reaches for an effect it was never granted is refused, and the refusal is an event you can replay.
A disposable worker on Claude Code or Codex does the work in its own worktree, passes the host's test and commits, and a blinded verifier that never saw the worker judges the change against the contract, sending it back to a fresh worker until the original contract passes or the repair budget runs out and a person decides.
When the change is good, a publish step opens the pull request, waits for the automated reviewer and answers each comment with evidence; so far these runs are recorded scratch proofs on synthetic modules, and a browser adapter can add screenshot, network and console witnesses when the subject is a web page.
While you are away, a resident host keeps the loop moving under a presence policy you set, and a mission check on a fixed cadence holds unattended dispatch whenever it finds the work off its contract or cannot tell.
Everything above records its events in typed, versioned logs, so the actor board and the live console can show you the actors, builds and evidence in those logs, and the first proof, the Repo Gardener plus Seiri scenario, still replays from its own log today.
This repository is built with the same roles: a work order merges after an independent verification and a final review, a release close follows, each step resumes from one phrase, and this page now changes only through such an order.

**Not yet built, and not claimed:** general source-writing worker profiles; composition beyond the Seiri subset; saved community builds; an interactive web or spatial console; SQLite persistence, hosted operation or a published package; the complete verified source-to-deliverable pipeline; portable starter export, a portfolio in the operator's own repositories and a measured absence payoff curve.
The [goal review](/docs/planning/refutations/README.md) keeps the reopening observations, [CONTRIBUTING.md](/CONTRIBUTING.md) covers the toolchain and tests, and releases are on the [GitHub Releases page](https://github.com/DylanBWood/DotLn/releases).
<!-- dotln-what-runs:end -->

## Why this exists

Working with AI agents drifts into babysitting: restating context, checking
"done" claims that are not evidence, recovering stalled work. The usual fix is
a bigger prompt. A predecessor system collapsed under roughly 140 rules loaded
as prose; it brought **the whole stash into every map**. DotLn answers with
**compiled** rules:

- do not delete what you cannot prove is dead → a structural guard, not a plea;
- show evidence before claiming success → a gate the model cannot talk past;
- preserve the operator's intent across handoffs → a bounded work order, not a
  transcript;
- ask only when the decision is material → an interruption policy with six
  named conditions, specified and not yet compiled;
- make presence-conditioned changes explicit → a policy that may hold, shrink,
  grow, peak, reset, or loop scope while naming which axis changed; the
  current skeleton exercises one conservative return rule.

A session gets **a build, not a biography**: one active behavior, a few linked
supports, a small safety layer and the exact task state. The reference loop:

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

- **A session is an incarnation, not a memory.** Durable state lives in
  artifacts and the event log.
- **Deterministic core, strange edge.** Models, humans, browsers and scripts do
  the work; none redefines the control logic invisibly.
- **Hard safety is boring.** Guards, worktrees and evidence gates carry the
  invariants; prose is the last mechanism.
- **Evidence precedes "done."** A persuasive completion message is not a test.
- **Implementer and verifier are different roles,** so self-certification is
  structurally awkward.
- **Doing nothing is a decision.** `NoOp` carries a reason and a re-check.
- **Every metaphor reveals its mechanics,** or admits it is lossy.
- **The substrate is shared; the doctrine is yours.**
- **No fake numbers, ever.**

## The game is not decoration

DotLn borrows the vocabulary of action RPGs because it is a good typed language
for scoped behavior: a loadout is the behavior compiled for one task, a
support is a typed modifier that joins only through a valid link, a summon is a
disposable worker. Links are **scope, not sequence**. Rarity encodes
provenance, never power. The long-term surface is a **Path of Building for
organizations**: equip a pattern, see its compiled diff, replay to the first
event where two variants diverge.

## Three horizons, one kernel

1. **Work operating system.** Bounded work, disposable workers, explicit
   authority, evidence-backed completion. The immediate product.
2. **Executable pattern workshop.** The shelf-to-mechanism compiler. The
   differentiated product.
3. **Agent ecology and simulation laboratory.** Paired counterfactual runs over
   recorded logs. The research product.

The [roadmap](/docs/product/06-roadmap.md) climbs there one visible payoff at
a time. The release the roadmap calls teammate-ready has one exit criterion:
a person who has never read these docs declares one bounded intent and
receives a verifiable result, witnessed by a non-author. Beyond it sits
**προτείνω**, a small simulated community you write to in prose; candidate
first world, a basketball squad ([προτείνω](/docs/product/11-protino.md)).

## The repo runs on itself

Work happens in bounded work orders inside isolated worktrees. A model that
implements never verifies its own work; a blinded second session does, and a
third pass reviews. A fresh session resumes from one phrase:

```text
resume: status
resume: times
resume: next
resume: fix
resume: verify
resume: final review
resume: release close
```

The phrase resolves against an append-only control log to the active order
and the exact artifacts to read; the reviewer's gate is keyed by code identity,
and publication requires the reviewed tree and the merged tree to share it.
Driving the car while building it has consequences the
[execution guide](/docs/product/07-execution-guide.md) spells out, receipts
included; the planning reviewer that judges this repository's own plans is
itself compiled from DotLn primitives, and Gödel, Escher, Bach is on the
sources list for a reason. There is more blueprint than code, recorded as an
open tension, and the strangler experiment is explicit: typed mechanisms are
meant to absorb the prose. The [operator playbook](/docs/PLAYBOOK.md) has the
whole loop.

## Map

- [`packages/kernel/`](/packages/kernel/) — the deterministic event core.
- [`packages/compiler/`](/packages/compiler/) — the pure composition compiler.
- [`packages/skeleton/`](/packages/skeleton/) — the Repo Gardener + Seiri
  vertical, the resident host and the workers.
- [`packages/console/`](/packages/console/) — the actor board and live console.
- [`packages/browser-evidence/`](/packages/browser-evidence/) — the browser
  witness adapter.
- [`packages/beacons/`](/packages/beacons/) — the Beacon codebooks.
- [`scripts/`](/scripts/) — the control plane: resume, worktree, release.
- [`docs/product/`](/docs/product/) — the blueprint.
- [`docs/work-orders/`](/docs/work-orders/) — bounded authority, one file per
  unit of work.
- [`docs/verifications/`](/docs/verifications/) and
  [`docs/final-reviews/`](/docs/final-reviews/) — immutable evidence.
- [`docs/control/`](/docs/control/) — the append-only resume log and the
  control records.
- [`docs/lineage/`](/docs/lineage/) — the idea ledger and sources.
- [`docs/decisions/`](/docs/decisions/) — decision records.
- [`docs/releases/`](/docs/releases/) — release evidence.
- [`docs/publication/`](/docs/publication/) — compiled editions.
- [`docs/LEGAL.md`](/docs/LEGAL.md) — the license decision.
- [`corpus/`](/corpus/) — regenerable test corpora.
- `docs/intake/` — raw ideation, local only.

Idea first: [the vision](/docs/product/00-vision.md). Machinery:
[the domain model](/docs/product/02-domain-model.md) and
[architecture](/docs/product/03-architecture.md). Something moving:
[the skeleton](/packages/skeleton/README.md).

## Sources and license

DotLn claims no novelty; the
[sources and inspirations register](/docs/lineage/inspirations.md) records
what shaped it. Names identify sources and imply no affiliation. Code is under
the [Apache License 2.0](/LICENSE), documentation under
[Creative Commons Attribution 4.0](/LICENSE-docs); see [`NOTICE`](/NOTICE),
[docs/LEGAL.md](/docs/LEGAL.md) and [CONTRIBUTING.md](/CONTRIBUTING.md).

## One boundary that does not move

This is a personal clean-room project. Employer code, configuration,
identifiers and internal detail do not belong here and never will. Raw
ideation stays local in `docs/intake/` until it is synthesized under the
promotion policy.

## Why "DotLn"?

_Days of the Natural Logarithm._ DAY and LN rearrange into the author's first
name, and the pun is technical: soft influences may stack through additive
log-odds composition. DotLn is early on purpose; the proof is small enough to
understand all the way through, and the plan is to keep it honest while the
ambition catches up.
