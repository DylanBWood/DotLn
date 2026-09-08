# Proposal: a concept registry that reaches actual application use

Date: 2026-09-07. Status: **proposed for a planning decision**.
The operator expanded WO-109 to propose an easier registry and a streamlined
path into the app, including recurring batches such as ten named concepts per
work order. This proposal does not activate implementation or select a schema.

## Problem and desired experience

A session cannot find an older idea under the wording used today. A related
concept has a ledger entry and product paragraph but no visible next action.
Research summaries merge different possibilities. A completed work order can
be mistaken for delivery of every idea it mentions. Valuable material remains
preserved without becoming usable or discoverable.

The desired path is short: capture an idea during the activity that revealed
it; find related concepts; choose a scene or experiment; deliver a named batch;
then open, use and compare the resulting behavior in the app. A fresh session
can answer **what could we build next?** and **what happened to this idea?**
without reading the entire archive.

Extend the existing pipeline. The ledger remains historical; product documents
remain durable understanding; work orders authorize execution. The registry
connects them and makes the remaining path to a real consumer visible.

## Evidence from this draw

- The current ideation procedure captures, synthesizes, appends to the ledger
  and promotes durable understanding (`07-execution-guide.md`, Operator-opened
  ideation mode). It does not provide one concise maintained query surface
  joining each concept to delivery and actual-use evidence.
- The ledger already preserves the aspiration for addressable ideas that never
  disappear. Its large source-oriented sections support provenance, but a
  concept can span several sections without one current destination.
- The planning map already holds the unallocated parity/drag-equip candidate.
  The shipped board is read-only; temporal authoring remains desired. This is
  stalled allocation/exposure, not an idea absent from the original sources.
- Ten feedback units compile, while WO-039/040 own ordinary-session governance.
  WO-041 explicitly retains the gap in the continuing correction-to-use path.
- The initial book shortlists bundled distinct possibilities. The
  [detailed research register](research/README.md) now preserves core ideas,
  alternatives and deferred leads. A ranked atlas cannot replace that inventory.

## Recommended registry

### One concept record; generated discovery views

Give each distinct screened concept a stable opaque ID independent of its title,
source filename, implementation, work order and temporary batch rank. Add aliases
and ordinary search terms. Splitting, combining, superseding or renaming a
concept preserves its earlier identity and the differences that motivated it.

The planner chooses the physical layout. Prefer small versioned text records
plus a generated index/query projection initially. A database, graph service or
embedding system is unnecessary unless retrieval evidence later warrants it.
Link existing sources and history in place; do not rewrite the ledger or copy
private intake into the registry.

Keep capture cheap: a rewritten idea, source reference and desired difference
or open question are enough. Add planning fields when selecting a concept.
Missing delivery information should appear as a useful gap, not block retention.

| Information                                        | Purpose                                                                  | Required when                    |
| -------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| ID, title, aliases, carried shape                  | Find the same concept across wording and sessions                        | Capture                          |
| Source, stratum, access limit                      | Distinguish intent, interpretation, research and unread leads            | Capture                          |
| Full detail, alternatives, caveats, examples       | Survive summaries without losing possibilities                           | Research occurs                  |
| Concrete scene and intended benefit                | Explain what using the concept enables                                   | Experiment/delivery selection    |
| Related, duplicate, split and superseded links     | Reuse prior thought while preserving differences                         | Relation is found                |
| Product/decision home or explicit gap              | Separate new meaning, stalled promotion and settled conflict             | Planning                         |
| Delivery form and consumer                         | Locate policy, support, UI, adapter, scenario, guidance or contract work | Planning                         |
| Next action and reopening condition                | Make deferred material recoverable                                       | Deferral or unresolved selection |
| Order, implementation and evidence links per slice | Trace progress without copying lifecycle state                           | An order is filed                |
| Actual-use witness and limitations                 | Distinguish compiled fixture from usable application behavior            | Claiming app use                 |

Do not compress these facts into a maturity score. A concept can be understood
and partly implemented but lack an editor. Another can have a toy scene while
its literal source remains unread. Project a concise summary from linked facts;
reuse existing lifecycle terms where adequate and explicitly propose changes.

### Discover concepts from normal entry points

Link one current registry projection from the planning map, planning/ideation
entry points, work-order template and eventual application workshop. Avoid
independent hand-maintained lists of the same current facts.

Retrieve a small relevant set by ordinary words, aliases, desired behavior,
app layer, source or existing order. Return detail and the current next action.
Do not load the whole registry into every prompt. Begin with deterministic
text/metadata search and curated relationships; evaluate semantic retrieval only
against observed misses. Adding an alias after a real miss should be cheap.

Initial views should answer:

- What relates to this intent, changed surface or observed failure?
- What is preserved without a product decision or next action?
- What is planned without an order, or implemented without a usable consumer?
- What can join the next batch using existing capabilities?
- What can be tried in the app, and what evidence supports it?
- What was deferred, why, and what would reopen it?

Relevant retrieval supports judgment. It does not require a complete archive
scan before routine work or commands.

## One concept through the whole path

1. **Capture and preserve.** Keep raw intake local; synthesize a safe concept.
   Retain public citations/access limits and every distinct result before
   summary or ranking. Preserve portable capabilities behind private examples.
2. **Relate and decide.** Find existing concepts, product interpretations,
   decisions, executable behavior and candidate orders. Preserve differences
   before linking duplicates. Choose experiment, delivery, reinforcement,
   deferral or an explicit decision challenge.
3. **Try the shape.** Give a promising concept a scene and the cheapest meaningful
   experiment. A toy behavior or workshop lesson can be useful before a new
   kernel primitive is justified.
4. **Select a delivery batch.** Name exact concepts and usable slices, consumer,
   boundary, assumptions and acceptance. Extend an existing order if it already
   owns the missing step.
5. **Deliver and verify.** Update implementation and canonical understanding
   together. Link concept → order → implementation → independent evidence.
   Passing one slice does not complete every possible use of the concept.
6. **Use and return feedback.** Open the behavior in its consumer and observe
   the promised outcome. Retain counterexamples, revised scope and retirement
   decisions. Catalog growth is not itself evidence of learning.

Use existing Workstream + WorkOrder + Episode + Continuation and existing
ideation/verification authority. No competing lifecycle, popularity-based
activation or automatic widening of authority is proposed.

## Recurring concept-delivery batches

Recommend a continuing queue, with a fresh ordinary work order for each selected
batch. A batch can say **implement these ten named concepts**. The queue can grow
while the operator has no time to execute it; later planning selects another
batch without rediscovering the research. No reserved number family is needed.

Ten is useful when the concepts share a consumer and delivery substrate. It must
not conceal a large foundation inside a content batch. Planning may split a
batch or select fewer deep concepts under the chosen scope. Keep unselected
ideas visible and explicitly disposition changed scope. One demonstration does
not make an incomplete ten-item batch complete.

A batch delivers product behavior, not ten summaries. Its manifest says what
the operator can do afterward for each item, what existing capability supports
it, what extension is necessary and which scene proves use. Closeout links the
implementation and evidence back to every selected concept. Remaining ideas
stay available for the next batch.

Batches can deliver ten authorable patterns, ten executable lessons, ten
correction supports, or a smaller integration/adapter set. Do not force a
connector, preference and temporal operation into identical mechanic types.
Independent batches advance under existing independent workflow/evidence rules
and one writer per worktree.

### Illustrative ten-item temporal workshop queue

This makes the proposal reviewable; it is not a claim that every required
operator already executes. Establish the author/run/compare substrate, then
select which concepts fit the first batch.

| Behavior                            | What the operator can try                             | Source / boundary                                   |
| ----------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Delayed action with cancellation    | Start a response and cancel before its deadline       | Existing timing subset; interaction research        |
| Repeat while permitted              | Apply a cadence and observe its explicit stop         | Existing Every/Gate/Until subset                    |
| First acceptable contribution       | Compare a fast result with later alternatives         | AG-04, AGA-04c; join contract required              |
| Deadline closes partial collection  | Inspect what arrived and what remains missing         | AGA-04b; partial closure is not universal success   |
| Event closes a round                | End a collection by operator/domain event             | AGA-04e; no guessed timer substitution              |
| Account for delayed feedback        | Compare eager retry with pending-evidence policy      | OF-06; identical authored trace                     |
| Group versus individual instruction | Change a group objective while keeping local policies | AGA-09; coordination differs from collect-all       |
| Different observations              | Give actors different evidence, then equalize it      | AG-07; input manifests                              |
| Polling versus change events        | Reveal a brief sensor change between polls            | AGA-22; substantive reading still needed            |
| Conflicting action proposals        | Compare priority and a permitted combination          | AGA-33; reconcile WO-037; authority is not averaged |

Retain automatic enterprise-tracker import as a separate integration candidate:
choose an interchangeable connector, import an external ticket artifact into a
bounded intent and decide when updates affect the workstream. Start with a
synthetic connector contract. Synchronization/external effects need their own
scoped semantics and evidence. A private example must not erase the generic use
case or restrict the idea to one vendor.

## Bounded implementation slices for planning

| Slice                           | Deliverable and decision test                                                                        | Reuse                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Registry/retrieval pilot        | Seed this draw and a small older-ledger sample; fresh session finds relevant concepts and next steps | Existing source history, work-order index and planning entry points |
| One end-to-end delivery witness | One concept becomes usable app behavior with linked independent evidence and feedback                | Parity/consumer candidate, WO-033/034, compiler/kernel              |
| Batch template and first batch  | Named concept manifest, per-item acceptance and evidence write-back                                  | Existing lifecycle/template; WO-037/039/040 where relevant          |
| Continuing batches              | Select the next useful set and reuse the substrate                                                   | No number family, mandatory wave barrier or new engine              |

The planner may combine the first two if one bounded order proves the complete
path. The registry earns maintenance through retrieval and delivered use, not
metadata completion. Physical storage, query API and automation remain decisions.

## Acceptance and falsifiers

Use original/public synthetic inputs and a frozen evaluation set. Tests should
exercise meaningful behavior rather than mirror the chosen file layout.

- A fresh planning session retrieves a book concept and an older ledger idea
  under realistic alternative wording; compare misses and reconstruction effort.
- Source, concept, product decision, order, implementation and app-use witness
  can be traversed in both directions for the delivery slice.
- Related concepts remain distinct after ranking and a session handoff. A
  deferred alternative can be found by its reopening condition.
- A passing compiler fixture without a consumer is reported honestly. Missing
  or stale evidence is visible and never silently counted as use.
- A ten-item batch has ten explicit outcomes or unresolved dispositions. An
  unchanged item cannot inherit another item's success.
- Retraction identifies affected dependents, preserves history and leaves
  unrelated evidence valid.
- The operator captures a fragment without planning fields and tries one
  delivered concept without reading internal schemas.

Simplify or reject the design if maintenance exceeds benefit, sessions still
need whole-archive reads, live status is manually duplicated, or ideas accumulate
without better selection and actual consumer use. A search demo alone is not
enough. Retain an explicit honest result when a trial fails.

## Decision requested from the next planning session

Decide whether to adopt the registry/recurring-batch direction, select the
minimal canonical record/projection, name the first retrieval and app-use
witness, and allocate bounded implementation order(s). Keep temporal behavior
authoring and comparison as the initial consumer payoff. Reuse existing orders
instead of duplicating implemented feedback, continuation and recovery work.

The operator requested this proposal and recurring delivery model. The schema,
format, query API, automation, exact first batch, sequence and release assignment
remain open. No full ledger migration or new kernel type is implied.
