# Workstream application — end-user workflow candidate

**Status:** operator-opened product exploration, 2026-09-04. This describes a
candidate application of DotLn for everyday software work. It is not an
implemented interface, a deployment claim, a new release rung, or a replacement
for the separately named `προτείνω` thesis. The application identity and first
deployment remain unannounced; this public design uses synthetic work only.

The product question is what a person does when they sit down to work: start an
outcome, make the decisions that need their judgment, inspect the result, and
return later without reconstructing the process. DotLn should carry the
coordination that currently lives in repeated prompts, remembered procedure,
and scattered repository sessions. A successful existing workflow is an outcome
baseline to preserve, even when the mechanism carrying it has become expensive.

This is the author's reference application profile. Its selected evidence,
authority, privacy, and recovery mechanisms follow
[the platform/instance boundary](03-architecture.md#platform-and-instance-boundary).
Other owners may assemble a different profile; their visible capabilities must
match what they equip.

## Arriving at the desk

Open one workstream view through the available terminal or console. The first
screen answers: what changed since the last visit, which outcomes are in
progress, what needs a decision, and what can continue under existing authority.
Repository sessions and model conversations are drill-down views. The workstream
is the thing the operator returns to.

On a constrained managed host, first use selects an instance and observes its
available repository access, execution transports, and persistence capabilities.
The view names what is usable, unavailable, or still unobserved. It does not
promise an install, a remote worker, a provider connection, background operation,
or access to another machine. Deployment topology is an open product choice.
A private instance is this case [operator direction, 2026-10-11]: a
separate, private fork of the starter on a constrained managed host where
core is never installed. It takes the kit by a Git merge from the starter when
its operator chooses, previewed first and reversible (WO-203, WO-207), with
the operator's build taken or pinned per update (WO-207); its repository
profiles may pin DotLn-Angular as an upstream reference (WO-073's convention)
and nothing more; it reaches core only through generic capability requests
(WO-193) or through its operator's own planning prompts to core, written in
generic terms (operator direction, 2026-10-30); and its own code, a tracker
source adapter among the first, lives at the instance extension point
(WO-207), never in core.

The operator selects repositories and the boundary of a proposed task. The
reference profile previews where its inputs and outputs would go and which
effects are authorized. An unavailable adapter leaves a concrete manual handoff
or a blocked capability, with the lost automation visible. Private source and
instance configuration stay in their governed environment. They are not setup
material for this public repository.

## One outcome from request to return

The following labels describe interactions, not proposed CLI command names.

| Moment | Operator action                                                                | Application response                                                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Start  | Describe the desired behavior in prose, or select a permitted source artifact. | Capture intent and source revision; show the outcome, known repository scope, assumptions, and completion criteria. An unclear request starts an exploration contract.                                         |
| Scope  | Correct the outcome or add a constraint.                                       | Inspect the relevant code and tests; propose the affected repositories, bounded work orders, dependencies, and required evidence. Show uncertainty where inspection has not established scope.                 |
| Begin  | Grant the displayed scope and effects, or use an applicable existing grant.    | Return a compact receipt: workstream, source revision, repository bases, current phase, evidence destination, next boundary, and whether input is needed.                                                      |
| Work   | Continue other work or inspect progress.                                       | Dispatch bounded episodes with the selected context and loadout; record results, failures, and continuations. Ask only for a material decision that existing authority cannot resolve.                         |
| Steer  | Change the desired outcome or answer a decision packet.                        | Record the change, identify affected plans and evidence, and retain still-valid work. A source revision change makes dependent claims visibly stale.                                                           |
| Review | Inspect a concrete result and its evidence.                                    | Present the behavior change, repository diffs, passing and failing checks, unresolved findings, and the next permitted action. In this profile, implementation readiness still needs independent verification. |
| Accept | Authorize the applicable merge, release, or other delivery boundary.           | Execute only that boundary when supported and authorized; distinguish verified, merged, released, and owner-accepted states. A blocked effect does not erase the prepared result.                              |
| Return | Reopen the workstream after an interruption or a new session.                  | Show the last trusted checkpoint, changes since departure, pending decisions, and the next legal action; resume from durable state.                                                                            |

The operator should not have to name a model for every routine step, shuttle
status between chats, or re-explain a settled decision after session turnover.
Role, model, effort, and transport choices remain inspectable and constrained by
the work order and environment. A quiet view means no decision is currently
required; it is never proof that an unobserved worker is still running.

## Replacing a successful but costly workflow

Migration starts with publicly expressible outcomes and synthetic scenarios.
No code, prompts, configuration, identifiers or internal service shapes of an
earlier workflow are imported. Existing behavior is described afresh as what the
operator needs to happen, not how it was implemented before.

Inventory the useful behaviors of each existing workflow generation
separately. Each obligation needs its own replacement and evidence; matching
their shared features does not prove parity with a capability present in only
one generation.

| Existing useful behavior to retain          | Candidate DotLn experience                                            | Evidence needed before retiring the old step                                                               |
| ------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A request becomes a scoped change.          | One captured outcome becomes a contract and bounded work orders.      | A synthetic request produces the expected acceptance criteria, non-goals, and material questions.          |
| Established standards guide implementation. | The task receives only the relevant mechanisms and source context.    | The important obligations still fire; startup and handoff burden are measured rather than assumed smaller. |
| Tests and review catch mistakes.            | Evidence remains attached to each claim and stage.                    | A planted defect reaches repair; unsupported completion cannot pass the selected gate.                     |
| An interrupted task can be recovered.       | A fresh session resumes the same durable objective.                   | Restart does not lose intent, repeat an external effect, or treat an unfinished step as complete.          |
| The operator knows what to do next.         | A concise receipt or decision packet replaces procedural restatement. | The operator can identify the next action and its reason without reopening earlier conversations.          |

Adopt one representative workflow increment at a time: describe and inspect a
single-repository task; prepare its change and evidence with manual delivery;
then exercise an authorized external worker and delivery boundary; finally
prove coordination across repositories. These are candidate adoption slices,
not a new build-order commitment. Keep a known-good way to finish the current
task until the corresponding slice has passed its acceptance demonstration.
[Scratch-loop proof](../evidence/WO-112/README.md) observes unaided intake, scope, tests, review triage and delivery on Claude and Codex; the [starter proof](../evidence/WO-118/README.md) adds resident-owned delivery, writer replacement, restart and review repair with all eight representative parity items observed-met, plus fresh-export live status; efficiency remains unmeasured.
Reusing an established working environment as a temporary execution edge is a
future adapter choice, not permission to bring its implementation here.

## One workstream across repositories

One operator-proposed pilot (2026-09-06) starts by using DotLn to help create
Enterprise Starter, then forking that starter as the coordination repository.
The fork issues work orders for multiple targets, including DotLn-Angular;
during the trial, Angular updates enter through that workflow. The trial
simulates an organization user's needs using personal/synthetic material and
tests scope, dispatch, target isolation, evidence, verification, and return
across repository boundaries. It must show that the workflow actually drove
the target changes; a starter skeleton and an independently developed app do
not establish that result. This is one candidate adoption path, not a canonical
topology or an implementation claim. Other paths remain open under the same
outcome and evidence requirements. See the [sibling-repository intentions](03-architecture.md#platform-and-instance-boundary).

The 2026-09-06 planning pass, as redirected the same day, took that path as
the first pilot and filed its two bounded routes (WO-033, cut into WO-049,
WO-064 and WO-069 to WO-079; WO-034, cut into WO-080 to WO-083). The route
runs across four repositories with four jobs [operator direction,
2026-10-11]. **Core** builds the control plane and the runtime, ships
releases and holds no Angular order; its own control records, orders,
evidence and reports are core's instance files and never enter the kit: the
kit is the product, not core's history. **DotLn-Enterprise-Starter is the
kit**, the export of core: public, under core's license files, never exported
with `--license none`, forkable by anyone, holding no orders of its own, and
refreshed by core's release close, which runs the export update in a
disposable worktree of the starter's recorded checkout, verifies it and pushes
one fast-forward commit to the starter's main (WO-215), performing the first
export when needed; WO-078’s receipts record each successful run in the next
order’s reviewed change; an instance opts into a starter update through a planning
pass that cuts the upgrade order (WO-207). **The operator's personal
instance** is a public fork of the starter on the operator's own account,
under the same license posture and the same clean-room floor as core, on the
operator's own machine where core is installed; it runs exactly what core
runs ([planning fixture evidence](../evidence/WO-202/commands-final.json); planning passes, orders cut by planning, the lifecycle by resume
phrases in worktrees, verification, final review, release close, and the
resident with intents where core uses them; intents and enterprise-tracker
items are additional entry points, never the only one), composes its own
overlay over the kit's build, registers DotLn-Angular as a target with an
Angular UI class and a repository profile, and holds `WS-001`, the Angular
orders' control state and raw evidence and its own planning documents, while
DotLn-Angular holds its own product documents, its planning passes and each
Angular order's file with its decisions, verification and final-review
reports, so every fork that works on it shares one history, and the instance
links each record where it lives (operator direction, 2026-10-13); it takes
the starter by a Git merge the operator chooses, landed through its own
update pull request and previewed first by the incoming revision's launchpad
with `preview --from <ref>`, which distinguishes unchanged kit
paths and reports incompatible manual actions individually ([WO-203 fixture
evidence](../evidence/WO-203/handoff.md); WO-210), followed by a re-emit of its own build. **DotLn-Angular**
is public under the same posture, receives conventional branches and pull
requests (each order's carrying its records under the registered
`documentationRoot` in a records-only commit after the reviewed change) and never a machinery file, and has three purposes: the reference for the architecture the
operator wants Angular applications to follow (Angular, Nx, NgRx Signal Store
with events, Transloco, as product 03 records), the demonstration that an
instance builds another repository through the workflow, and a console for
DotLn over the actor board's `uifa-board-v1` view model; its early work is
foundational and visual output verifies that things work. The loop closes
with generic capability requests from an instance to core (WO-193). The
terms: from an instance, the repositories the operator cuts orders for are
**registered target repositories** (WO-071); **sibling** stays core's term
for the starter and the Angular consumer in its registry (WO-078). The
operator works from the instance; an order names one repository; a
workstream spans several; a session in a target is rare, because the router
(WO-192) runs each phase's worker in the target worktree under WO-049's
bundle, launched from the instance. A session opened in the instance is
governed and oriented by its build: the role skill for the active order loads
the workstream document and the target's repository profile, with its pinned
references into this blueprint, on demand, so the operator never restates the
vision per session, and the instance's hook logs report which compiled units
fired there. WO-083 records one such run as its receipt. Other organizations
fork the same starter as their own instances; their workstreams,
repositories and evidence stay in their forks, and kit updates reach them as
reviewed upstream merges followed by a re-emit of their own build. The
operator's instance runs DotLn-Angular as its first workstream: the operator
reads what it produces, gives product and architecture feedback, customizes
the instance's own features and supports, and uses the DotLn UI there to
understand DotLn. DotLn WoW Forever, a public repository the operator
created empty on 2026-10-13, becomes a later target, and holes found along the way return to core through the request
intake (WO-193). An Angular order pays
DotLn-Angular's declared repository `gate` through the target gate runner,
plus the instance's document gate, never core's product gate (WO-210). WO-207 proposes, for the operator's review, that the
instance's gate run the carried kit suites once per kit update and its own
declared suites for its own additions.
The operator means to work only from instances, so core itself becomes a
registered target of the personal instance once the target route has carried an Angular order to
release close; until then core is also worked directly. The operator makes
no commits of their own in any repository, gives technical and product
guidance, types the dispatch phrases and merges pull requests; every change
comes through the workflow. The measure is
progress in all five repositories at once, without babysitting, with
feedback and bugs routed to where they belong and acted on (operator
direction, 2026-10-13).

A workstream owns an outcome spanning repositories and time. A repository owns
its local code history, branch/worktree, tests, and delivery boundaries. Each
bounded work order names its repository bases and scope; the workstream view
relates those results without collapsing them into one repository or one long
model session. Its distinct repositories can be reviewed as one subject set
with `entropy review --workstream WS-NNN`: one frozen committed repository,
pinned reviewer, blinded refutation and immutable launchpad receipt per
dispatch, including the launchpad only for `self`. `entropy subject
--workstream WS-NNN` identifies pending work, receipts to refute or consume,
and the next member. The pass disposes each receipt's survivors and allocates
accepted target-named register rows to the appropriate member orders (WO-224).

A launchpad keeps one `WS-NNN-<slug>.md` per outcome under its configured
`workstreams` root, following [the document convention](../workstreams/README.md).
The document holds the acceptance contract, members with repository and base,
dependency and compatibility plan, and delivery states. Leading
`**Workstream:** WS-NNN` order fields source membership; the document's
`dotln-workstream` JSON block mirrors those ids and repositories, including
implicit `self`, and names dependency edges. A mismatch refuses with the
order and field, except a closed member without the field is admitted from
the document with an advisory, preserving its order. Open members still
require the field. `track: separate` keeps an operator-designated stream out of
the proposed serial queue while retaining its grouping and complete cards.
The generated index and board's Workstreams section share one committed JSON
observation of repository, base, phase, verdict, integration and stale state,
plus the observed target commit and edges. Explicit index generation reads
registered clones; check reuses the snapshot without requiring those clones.
Integration is current, behind, diverged or unknown; stale is no, yes, yes or
unknown respectively. A self member's base and integration target both read
the launchpad's `refs/heads/main`; it stays current, stale no, regardless of
the branch running the refresh, and unreadable main stays unknown.
A later target change is observed on refresh, not silently folded into a check.

**Registered-target field (WO-071, 2026-09-21).** A bounded target order names
that boundary in leading metadata as `**Repository:** <id> @ <base-commit>`.
The launchpad's version-1 configuration resolves the id to its declared base
branch, relative worktree parent, opaque class and authority profile; absence of
the field means `self`. Activation retains only the public id and immutable base
commit in control state and projections, never the physical target or worktree
path. The profile narrows the compiled base, and any allowance beyond it is an
explicit `registered-repository` grant with retained provenance. This gives the
next target-worktree lifecycle a repository/revision/authority interface it can
consume without restating or silently widening the order.

Synthetic example: add a new optional response field in a service repository,
consume it in a client repository, and explain it in a documentation repository.
The operator starts one outcome and sees the dependency and compatibility plan.
The service and client still receive separate reviewable changes.

```mermaid
flowchart LR
  W[One outcome and acceptance contract] --> S[Service change]
  W --> C[Client change]
  W --> D[Documentation change]
  S --> I[Integration evidence on named revisions]
  C --> I
  D --> I
  I --> R[Workstream review and authorized delivery]
```

The graph describes evidence convergence; execution order follows the actual
dependency plan. A compatible service addition might land before its consumer,
while client work proceeds against a pinned fixture. The planner must make that
compatibility assumption explicit. A breaking contract would require a different
migration and delivery plan.

The workstream view shows each repository's base, current change, owner,
verification state, delivery state, and blockers, plus the cross-repository
acceptance evidence tied to exact revisions. A green service check cannot make
a failing client or stale integration check green. There is no assumed atomic
merge or rollback across repositories; partial delivery remains visible with
its next safe action.

Two workstreams may touch the same repository. They retain separate objectives
and evidence, with one writer per worktree in this profile. Shared-file or
contract conflicts become explicit coordination work before integration. A
change to a shared dependency identifies which workstream claims need renewed
evidence; it does not indiscriminately restart all work. Unrelated authorized
work may continue when one repository is blocked.

Public contributions are another candidate consumer of these independent
tracks. A contribution may be scoped into one or more work orders; the shared
view retains each order's workflow, current step, blockers, and evidence, and
links published releases to the changes they actually contain. The
[concurrent-workflow planning handoff](../planning/budget-window-work-order-ladders.md#fable-planning-handoff)
must define the grouping and release mapping. This adds a collaboration
scenario to the existing workstream model, with no new identity primitive.
The operator also proposes tenant-scoped tracks whose plans retain required
dependencies and recommended order across track boundaries. Tenant ownership,
visibility, capacity sharing, and the mapping to workstreams/contributions are
planning choices; this scenario does not equate a tenant with a model session
or grant cross-tenant authority through a shared status view.

## What exists and what must be proved

The repository currently demonstrates a pure kernel, composition compiler,
deterministic skeleton, and its own file-based work-order/control loop. The
compiler derives classified StoryContract statements and criterion drafts from
a SourceBundle, preserving provenance and marking affected items stale on revision.
The generated work-order index delivered by WO-026 improves navigation of that loop
with recorded lifecycle and release evidence; workstream documents now group
member orders in that index and the actor board using recorded target facts.
It does not implement an end-user portfolio, repository coordinator, or live
external execution service.

The real-worker, independent-verification, feedback, and console rungs in
[the roadmap](06-roadmap.md) remain their existing authorities. This candidate
supplies scenarios for evaluating them; it adds no implementation acceptance
criteria to those orders. [Terminal/console parity](04-interfaces.md#terminal-first-console-equal),
[source and dispatch ports](03-architecture.md#ports-what-keeps-work-flavored-verticals-pluggable),
and [durable workstreams](02-domain-model.md#memory-and-observation) supply the
existing concepts. No schema, package boundary, UI framework, provider, host
layout, or new command is selected here.

The [synthetic real-Git pilot](../evidence/WO-080/README.md) exercises a
single-repository member reaching closed from a target worktree (D1), a
client proceeding against a pinned contract while the service lands first
(D2), refusal of a second writer in an occupied worktree while another
worktree of that repository remains eligible (the refusal half of D4), and
session restart through `resume: next` under the emitted target bundle (D6).
These are mechanical demonstrations, not evidence of usefulness. Source-revision
staleness spreading to dependent claims (D3), D4's conflict half, an unavailable
execution edge with manual handoff (D5), and a workstream-level next safe action
remain FUP-b28d36edaa8630b1's candidates. The index's base-comparison stale mark
does not establish D3.

Before declaring a useful replacement, complete those demonstrations and compare
outcome quality, context restatement, manual handoffs, unnecessary interruptions,
and time to a trusted return state against a synthetic baseline of the operator's
successful workflow. WO-083 owns the witnessed run. The baseline and acceptance
thresholds still need to be chosen; smaller prompts alone are not proof of a
better application.

## Open product choices

- Which representative task best exposes the useful behaviors and the current
  coordination burden without requiring private source material?
- Which terminal, editor, and console entry points should the first slice
  expose, and what belongs on the initial workstream screen?
- Where does an instance keep its private workstream state, and which observed
  execution environments can participate without moving protected inputs?
- How should the operator define cross-repository acceptance, compatibility,
  conflict ownership, and partial-delivery recovery for the first pilot?
- What measurable parity and reduced coordination cost justify retiring each
  step of the existing workflow, and which advanced behaviors can wait?

Resolve these through bounded scenario work and environment evidence. Naming
an application, adding its first integration, allocating a work order, and
announcing a deployment remain separate decisions.
