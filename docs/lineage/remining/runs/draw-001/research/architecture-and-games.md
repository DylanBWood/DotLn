# Architecture and games — detailed idea records

Research date: 2026-09-07. Ideas AG-01–AG-08 are original applications inspired
by the sources below. The repository audit distinguishes implemented substrate,
planned work and additional product experiments. It does not activate any work.

## Sources and actual access

- **Patterns of Enterprise Application Architecture**, Martin Fowler with
  contributors, first edition. Publisher publication date November 5, 2002;
  copyright 2003. ISBN 9780321127426. Inspected selected official pattern
  summaries and sample front matter/contents, not the complete book.
  [Publisher](https://www.informit.com/store/patterns-of-enterprise-application-architecture-9780321127426),
  [78-page sample](https://www.informit.com/content/images/9780321127426/samplepages/9780321127426.pdf),
  [author catalog](https://martinfowler.com/eaaCatalog/).
- **Enterprise Integration Patterns**, Gregor Hohpe and Bobby Woolf, first
  edition. Published October 10, 2003; copyright 2004. ISBN 9780321200686.
  Selected author-maintained entries and publisher excerpts, not the full book.
  [Publisher](https://www.informit.com/store/enterprise-integration-patterns-designing-building-9780321200686),
  [98-page sample](https://www.informit.com/content/images/9780321200686/samplepages/0321200683.pdf).
- **AI for Games, Third Edition**, Ian Millington, CRC Press, copyright 2019.
  ISBN 9781138483972. Inspected title/copyright pages, detailed contents and
  substantive introductory sections 1.2, 2.1 and 2.4 in a 104-page publisher
  preview. Later algorithm chapters are discovery leads, not researched
  algorithm claims. [Publisher](https://www.routledge.com/AI-for-Games-Third-Edition/Millington/p/book/9781138483972),
  [preview](https://api.pageplace.de/preview/DT0400.9781351053297_A36789489/preview-9781351053297_A36789489.pdf).
  The preview places Execution Management in chapter 10, World Interfacing in
  11 and Tools and Content Creation in 12; the product page's abbreviated
  contents differ. The author's [aicore repository](https://github.com/idmillington/aicore)
  identifies its code as obsolete first-edition material, not third-edition code.

## AG-01 — Author an application operation once, use it through several views

**Source meaning.** Service Layer, credited to Randy Stafford, defines
application operations and coordinates their responses. Transaction Script and
Domain Model offer different organizations for that logic. A service boundary
does not imply a separately deployed service or remote call.
[Service Layer](https://martinfowler.com/eaaCatalog/serviceLayer.html),
[Transaction Script](https://martinfowler.com/eaaCatalog/transactionScript.html),
[Domain Model](https://martinfowler.com/eaaCatalog/domainModel.html),
[distribution costs](https://martinfowler.com/articles/distributed-objects-microservices.html).

**Application and scene.** An operator edits a temporal policy in a UI and
rehearses the same edit in a fixture. Both invoke the same application operation:
validate an artifact/version, compile its policy, request a bounded run and
return inspectable results. Applying a correction or resuming a workstream is
another consumer of this principle. Place operations in the application;
policy preparation stays in the compiler and execution in the runtime.

**Experiment and falsifier.** Implement one operation through two entry points,
an operator surface and an executable fixture. They must agree on authority,
accepted inputs and resulting evidence. Divergent rules falsify the seam; an
abstraction that removes no duplication may be needless. Begin with an ordinary
procedure; a richer model needs repeated invariants or transitions to justify it.

**Audit and destination.** Existing compiler codecs provide equivalent loadout
views, but statechart JSON embeds a graph in one equipped state; it is not a
temporal transition editor (`packages/compiler/src/views.ts:154`). The closest
product route is the existing unallocated authoring/parity candidate
(`docs/planning/work-order-map.md` §Preserved unallocated candidates). Refine
its application contract before adding a second execution model.

## AG-02 — Distinguish stale intent from expired time

**Source meaning.** David Rice's Optimistic Offline Lock checks conflicts before
committing work spanning transactions; validation and update belong together.
Message Expiration addresses an independently elapsed deadline.
[Optimistic Offline Lock](https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html),
[Message Expiration](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageExpiration.html).

**Application and scene.** Two disposable workers begin with artifact revision
A. The operator changes a relevant condition to B before they return. Retain
their proposals as evidence while validating whether each still applies.
Elapsed time, changed meaning and unrelated edits are distinct conditions.
Expose the disposition in the application; use existing acceptance contracts.

**Experiment and falsifier.** Change one relevant condition during two attempts.
Accept a compatible result and retain an incompatible proposal with a reason.
A stale proposal changing current state without validation is failure; rejecting
every harmless edit is overbroad. Do not lock resources throughout a model call
or silently reinterpret old output under new instructions.

**Audit and destination.** Stale-result fencing already exists: unknown commands,
expired authority, superseded leases and operator return are rejected; admitted
duplicates are inert (`packages/skeleton/src/reactor.ts:393`). Verification
checks the current subject revision (`reactor.ts:1790`). WO-009/010/029 own this
substrate; WO-034 plans broader source-revision projection. Preserve the idea as
a workshop scene and UI explanation, not a claim that fencing is missing.

## AG-03 — Make uncertain effect recovery inspectable

**Source meaning.** Idempotent Receiver tolerates duplicates through suppression
or effect semantics. Transactional Client controls messaging commit boundaries;
it does not imply an atomic transaction with every external service.
[Idempotent Receiver](https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html),
[Transactional Client](https://www.enterpriseintegrationpatterns.com/patterns/messaging/TransactionalClient.html).

**Application and scene.** An adapter performs an authorized effect and crashes
before its response is recorded. The recovery view distinguishes request
recorded, effect attempted, known outcome and unresolved outcome. The runtime
owns adapters and receipts; the workshop exposes failure scenes; the application
offers the appropriate intervention.

**Experiment and falsifier.** Give a fake sink a durable counter. Inject failures
before invocation, after invocation and before receipt persistence; redeliver.
Duplicate external execution or a false success claim fails. Specify effect
identity, deduplication retention and sink capabilities. A message ID alone is
insufficient; unsupported sinks may require reconciliation, not blind retry.

**Audit and destination.** Kernel outbox replay/dedup (`core.ts:598`) and immutable
request-bound WorkerStore receipts (`worker-store.ts:127`) already exist at a
bounded inspection boundary. They do not prove arbitrary external-write
exactly-once behavior. WO-103/105 already cover wider authority/outbox/crash
evidence. Reuse those contracts and retain this as application/adapter content.

## AG-04 — Author what counts as enough evidence in a fan-out

**Source meaning.** Aggregator separates correlation, completion and
combination. Correlation Identifier associates replies with requests.
Resequencer restores a specified order and needs an order-preserving downstream
channel. These are separate choices.
[Aggregator](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html),
[Correlation Identifier](https://www.enterpriseintegrationpatterns.com/patterns/messaging/CorrelationIdentifier.html),
[Resequencer](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Resequencer.html).

**Application and scene.** Three specialists contribute to research. One returns
twice, one fails, and one returns after synthesis starts. Show which distinct
contributions count, why synthesis became eligible and how late evidence can
amend it. Let the authored policy choose all-required, threshold or operator
close. Keep arrival order, causal prerequisites and display order separate.

**Experiment and falsifier.** Compare two completion policies under duplicate,
missing, late and reordered replies. A duplicate satisfying a threshold, a late
reply silently changing a published conclusion, or order dependence in a claimed
order-independent result fails. Do not globally reorder the accepted event log
or serialize independent evidence for presentation convenience.

**Audit and destination.** `All` and `Race` are explicit deferred program kinds
(`packages/kernel/test/wo017-evaluable-kinds.test.ts:121`). Opinion cohorts
already have seal, late-result, partial-completion and dissent candidate
contracts (`docs/product/03-architecture.md:654`); WO-018 did not implement them.
A consequential interaction extension should reuse these. Ten independently
simulated actors do not themselves require a collect-all join.

## AG-05 — Let durable work outlive its current worker

**Source meaning.** Process Manager retains state and selects subsequent steps
using intermediate results. The authors warn that universal use adds overhead
and can obscure simpler designs.
[Process Manager](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html).

**Application and scene.** A workstream awaits an operator decision; its worker
disappears. Tomorrow a replacement resumes from recorded progress. The process
owns coordination state; workers own bounded attempts. Keep a linear recipe
linear. This is an application built over existing runtime facilities.

**Experiment and falsifier.** Use one branch, one parallel pair and one operator
pause. Replace workers at each boundary. Requiring undocumented conversation,
repeating completed work or failing to explain step eligibility falsifies the
design. A universal workflow kernel is not justified by expressibility alone.

**Audit and destination.** Serializable residuals and worker-death recovery have
tests (`packages/kernel/test/ac4-continuations.test.ts:86`,
`packages/skeleton/test/worker.test.ts:459`). WO-034 deliberately uses workstream
documents/projections without a new lifecycle. Preserve this as an acceptance
scene and ownership principle, not missing continuation machinery.

## AG-06 — Make behavior a reusable authored asset

**Source meaning.** Millington describes reusable behavior components configured
by authored data, with tools packaging the data for runtime use. Tool usability
affects which decision techniques are practical (preview sections 2.4.1–2.4.3,
printed pages 35–38).

**Application and scene.** An operator authors when a troop waits, an agent
restarts work, or a simulated device reacts to occupancy. A behavioral
correction is also an authored asset: scope, examples, exceptions and compiled
version. The workshop previews consequences before adoption. Compiler and
workshop own authoring; a profile references adopted versions; runtime executes.

**Experiment and falsifier.** Express one correction with three positive cases
and two exceptions; run a deterministic controller and an LLM worker against
the policy. Repeated prompt restatement, unexplained scope or hidden
contradictions fail. Compare representations by editability and explanatory
value. A graph is a candidate, not an automatic prerequisite. Separate authoring
representation, execution contract and adoption authority.

**Audit and destination.** Ten feedback units and typed corrections already
compile (`docs/product/02-domain-model.md:406`). WO-039 brings saved builds to
ordinary sessions and WO-040 migrates rules. Compilation currently requires one
active mechanic/group/pipeline (`packages/compiler/src/compile.ts:538`);
WO-037 owns multi-active groups. Behavior trees, GOAP and other algorithms remain
valid research leads, but this pass only located their later chapters. Read and
experiment before specifying their semantics or choosing a primitive.

## AG-07 — Control what each actor can observe

**Source meaning.** Millington distinguishes decision selection, group strategy,
world information interfaces and execution infrastructure. World interfacing is
a substantial debugging concern (preview sections 1.2.2–1.2.5, pages 11–13).

**Application and scene.** Two actors disagree. One received an old criterion;
one received its revision. A branch gives both equal observations; another
changes only policy. Inspect received information, accessible memory and
recorded decisions separately from world truth. Target simulation inputs,
runtime manifests and compiler-pinned policy versions.

**Experiment and falsifier.** Start with two actors and one stale observation.
Change one variable per branch. Missing input provenance or several uncontrolled
changes prevents a causal interpretation. Recorded replay uses recorded model
results; a fresh model call is a new experiment. Do not grant every actor all
history by default or treat an actor's statement as world truth.

**Audit and destination.** Beacon sensing validates selected channels
(`packages/skeleton/src/beacon-perception.ts:133`). Product 11 already separates
history, observations, memory and beliefs, and specifies paired runs and first
divergence (`11-protino.md:128,267`). A general simulator/first-divergence function
was not found in the audited sources. A bounded actor laboratory can test this
application gap; a simulated worker/device witness can later test portability.

## AG-08 — Explain interventions through observable behavior

**Source meaning.** Millington argues that added complexity does not guarantee
better perceived behavior; observers may misread sensible actions when context
is absent, and changes draw attention (preview sections 2.1.1–2.1.4, pages 21–24).

**Application and scene.** Returning to several actors, the operator sees which
is progressing, which needs a decision and which can continue independent work.
Expose its actual condition, policy, evidence and available intervention. After
an edit, show which subsequent events changed. Target the workstream UI,
workshop and adopted presentation preferences.

**Experiment and falsifier.** Present ten short interrupted-work scenes and
measure correct interventions and reconstruction effort. More wrong choices,
indistinguishable waiting/blocking or no benefit over plain evidence falsifies
the presentation. Do not substitute personality theater, fabricated progress,
invented reasons or supposed private reasoning for recorded conditions.

**Audit and destination.** The shipped board is read-only HTML without script or
forms (`packages/console/README.md:25`). WO-034 plans the consumer shell; the
unallocated parity/drag-equip candidate includes temporal views. Static compiled
diffs compare categories, declared costs and semantic hashes
(`packages/compiler/src/render.ts:89`), not executed paths. The Seiri scenario
has events/decisions/timeline/counts but a fixture-driven schedule
(`packages/skeleton/src/scenario.ts:62,166`). A useful lab needs an authored
input stream and bounded virtual scheduling driver. Compare declared costs
separately from observed event/invocation/cancellation/effect counts; WO-107 is
the existing deterministic-profiling route.

## Combined experiments retained for planning

1. One application operation used by UI and fixture; a complete
   correction/continuation scene through worker replacement (AG-01/05/06/08).
2. An inspectable stale-result, effect-recovery and fan-out failure workshop
   reusing existing contracts (AG-02/03/04), not rebuilding shipped machinery.
3. An observation-controlled two-actor scene with paired counterfactual runs
   (AG-07), followed by a portability witness with simulated workers/devices.
4. A temporal authoring/comparison contract joining static configuration delta
   to ordered event/decision delta under identical inputs, clock and seed.
5. One supported policy applied visually to an actor, then ten independent
   actors, with a later join extension only when the scene needs coordinated
   completion. Scrub both runs and show the first divergence and truthful costs.

No algorithm family, distributed service, universal process manager, global
ordering rule or new kernel type is selected by these research records. Those
remain possible technical choices with explicit reopening evidence.
