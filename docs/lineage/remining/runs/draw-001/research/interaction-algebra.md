# Interactions as authorable temporal programs

Date: 2026-09-07. These are original application candidates under the operator's
expanded WO-109 direction. Treat RxJS as a design and experimental language for
interaction across scales: sensors, actions, commitments, coordination, memory,
feedback and adaptation. The ambition is to express any desired interaction
through composable events, time, state and effects, then inspect what the model
does. This is much broader than choosing when a UI callback fires.

## Documentation basis and implementation boundary

Context7 was used to resolve RxJS and inspect higher-order composition and
TestScheduler documentation. Some returned snippets described master rather
than the requested release; those snippets were discarded. API statements here
use the pinned **RxJS 7.8.2** documentation/source, not assumptions about latest.
No dependency or runtime lowering is selected by this research.

- [Operators guide](https://github.com/ReactiveX/rxjs/blob/7.8.2/docs_app/content/guide/operators.md)
  supplies composition/flattening semantics.
- [Marble-testing guide](https://github.com/ReactiveX/rxjs/blob/7.8.2/docs_app/content/guide/testing/marble-testing.md)
  describes virtual-time tests, run helpers and subscription assertions. In
  run mode one frame represents one virtual millisecond. Promises and arbitrary
  real I/O are not automatically virtualized by the TestScheduler.
- [mergeMap implementation](https://github.com/ReactiveX/rxjs/blob/7.8.2/src/internal/operators/mergeMap.ts)
  supplies the concurrency parameter and queueing boundary for that operator.

DotLn's kernel remains framework-independent. A future planner may select RxJS
for an equivalent authoring/execution adapter, a generated edge, a comparative
reference model, or several of these after a bounded conformance experiment.
The existing `expand()` candidate in product 05 is one experiment, not the
ceiling on the interaction vocabulary.

## Distinct patterns to preserve

Each IX record identifies an authorable distinction and a concrete scene. These
are proposals, not claims that every operation already runs in the kernel.

### IX-01 — Choose how a new request interacts with ongoing work

One actor is already responding when a new request arrives. Expose four
different policies instead of an implicit implementation choice:

| Policy                           | RxJS analogy | Consequence worth comparing                                                   |
| -------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| Replace the active inner stream  | switchMap    | New intent supersedes its previous subscription                               |
| Allow overlapping inner streams  | mergeMap     | Responses coexist; declared concurrency/admission matters                     |
| Queue inner work in order        | concatMap    | Earlier work finishes first; waiting may grow                                 |
| Ignore new arrivals while active | exhaustMap   | Current work remains undisturbed; ignored requests need an honest disposition |

Run one timed input trace through all four. Compare selected responses, waiting,
cancellation and work counts. Unsubscribing from a stream does not undo an
external effect already performed; actual cancellation depends on its adapter.

### IX-02 — Make a commitment a temporal object

A participant accepts a task, performs it, withdraws it or receives a changed
request. Model acceptance, eligibility, progress and terminal outcomes as events
over an explicit state machine. Compare superseding versus amending a commitment.
The modeled state comes from declared/observable facts, not inferred hidden intent.

### IX-03 — Author when several conditions create an opportunity

A toy moves only when its partner is ready and a passage is open; a device acts
only while a sensor condition and a permitted time window overlap. Show when
the conjunction becomes true, expires or changes before the effect begins.
This generalizes rendezvous/opportunity-window behavior across domains.

### IX-04 — Give collections explicit membership and closure

Apply AGA-04a–e to one group: all expected members, deadline, first result,
qualified early result with deadline fallback, or an explicit closing event.
Compare what is selected, what is missing and how late contributions are handled.
The same scene can represent troop reports, agent evidence or sensor readings.

### IX-05 — Preserve event time, receipt time and current relevance

A response arrives after the actor's objective changed. Replay it against its
original basis and then inspect its relevance now. Keep immutable receipt facts
separate from a revisable interpretation. Product 05 already preserves the rich
candidate; current EventEnvelope lacks a separate ingestion timestamp.

### IX-06 — Model absence as a scoped timed condition

A promised response has not arrived by a declared deadline. Compare waiting,
requesting status, taking a preauthorized alternative and marking an unresolved
outcome. Absence can drive an authored temporal policy; it does not itself
grant new authority or establish a person's motive.

### IX-07 — Distinguish persistence from a transient signal

An occupancy sensor flickers, a worker briefly loses connectivity, or a condition
becomes true for a moment. Compare immediate reaction with requiring a sustained
condition. Show both delayed action and the transient signal that was filtered.
Test entry and exit behavior, not just the first activation.

### IX-08 — Give activation and recovery different thresholds

A system oscillates between two states near one boundary. Author a separate
condition for leaving the active state, then compare with a single threshold.
Use original synthetic sensor/queue data. Preserve the cost of delayed recovery
alongside reduced oscillation; no universal threshold is proposed.

### IX-09 — Count recurrence by behavior identity and scope

The same failure reappears after a correction. Count distinct occurrences under
the correct rule version, scope and evidence that the correction applied.
Duplicate deliveries must not become extra failures. Compare windows and reset
conditions rather than adopting one universal frequency rule.

### IX-10 — Represent memory as a retained projection over experience

An actor accumulates relevant observations, forgets or expires selected state,
and restores it after replacement. Compare bounded windows, durable summaries
and source-addressed retrieval with explicit retained/lost information. A summary
points to detailed evidence; it does not silently replace it.

### IX-11 — Let later evidence revise an interpretation

An earlier event looked like a refusal but a later explicit reply identifies a
different target. Update the derived interpretation while preserving the source
event and already-observed effects. Show before/after explanations and affected
consumers. This is richer than a latest-message trigger.

### IX-12 — Author feedback delay and response rate independently

A late measurement prompts repeated interventions. Hold delay fixed while
changing reaction frequency, then improve observation latency separately.
Compare duplicate work, reversals, settling and missed urgent events. OF-06 and
MS-09 supply related experiments; they do not prescribe a universal controller.

### IX-13 — Route ownership through changing groups

A blocker becomes visible to ten actors. One accepts the next action, then
leaves. Compare broadcast-only coordination with explicit ownership transfer.
Make membership, acknowledgment and accepted responsibility observable. Reuse
authority/lease machinery where applicable; a group label alone is insufficient.

### IX-14 — Compare group objectives and local rules

Hold ten local policies fixed while changing one group instruction; reverse the
intervention. Compare formations, task allocation or local movement in a toy
world. AGA-09/32/35 preserve different coordination models; collecting results
does not itself implement spatial behavior.

### IX-15 — Keep requested, attempted and observed effects separate

A policy requests a movement, a worker action or a device state. Its adapter
delays, rejects, partly performs or confirms the request. The scene shows each
stage, including unresolved outcome, rather than animating a request as success.
This makes the same interaction understandable across real and simulated edges.

### IX-16 — Make cancellation consequential and inspectable

Cancel before work starts, during work, after an effect and after its receipt.
Record subscription/continuation teardown, retained evidence and the adapter's
actual cancellation capability. Test that unwanted later internal work stops
without claiming that already-performed external actions were reversed.

### IX-17 — Compare retry, pacing and admission

A provider or simulated resource refuses work temporarily. Compare paced retry,
queued work, reassignment and an explicit unresolved result under a fixed budget.
Preserve cause, attempt identity, duplicate handling and cost. Multiple actors
must not all wake simultaneously merely because the same delay expired.

### IX-18 — Import changing mixed-media artifacts as event sources

A tracker connector captures formatted text, related images, discussion and
revision. A later source change triggers review of affected interpretation and
evidence. Preserve generic interchangeable connectors and per-artifact meaning;
do not hardcode a color convention or treat OCR as truth. Product 03 already
specifies SourceAdapter/SourceBundle; this is a consumer/integration opportunity.

### IX-19 — Keep adaptation proposed, versioned and comparable

A pattern's outcome suggests changing its policy. Retain the candidate,
comparison results, adoption decision and later counterexample as explicit
events/versions. Compare old/new behavior before adoption. A learning loop can
change maintained artifacts without asserting that model weights changed.

### IX-20 — Compose interaction patterns at several scales

A small reaction becomes one part of a larger exchange, then a group routine.
Preserve input/output contracts, boundaries and observable internal decisions.
Compare an expanded view with a collapsed reusable pattern. Reuse should remove
authoring work while leaving exceptions and consequences inspectable.

### IX-21 — Separate observation delivery from the observed world

Compare polling and change events, delayed/duplicate delivery, unavailable
sensors and actor messages under the same world history. Keep world truth,
what each actor received and its accessible memory distinct. Different delivery
can change decisions without changing the underlying event.

### IX-22 — Separate simulated time from computation and display

Run the same closed input stream at different display rates and computation
speeds. Modeled deadlines/progress should follow declared time semantics. A live
boundary cannot consume an outside observation before it exists; show lag or a
declared substitute model. Product 11 already specifies this research boundary.

### IX-23 — Compare configurations through their first behavioral divergence

Keep a baseline and edit one policy. Pin initial state, input sequence, clock,
seed and recorded external outcomes; inspect the first differing decision and
subsequent paths. Show configuration delta beside execution delta. Separate
declared resource cost, observed event/invocation/cancellation counts and any
measured cost; do not turn virtual duration into monetary precision.

### IX-24 — Prove portability with several actor implementations

Apply a supported policy to deterministic toys, a recorded-result software
worker and simulated household devices. Expose unavailable capabilities before
running. Then assess a model-backed or actual-device adapter in its own scope.
The goal is one understandable interaction contract with explicit environmental
differences, not a promise that every implementation behaves identically.

## Smallest useful lab and later expansion

Start with a supported bounded cadence/condition/cancellation policy and authored
input stream. Compile two configurations, drive both with explicit virtual time
and compare event/decision traces and honest costs. Complete that author → apply
→ preview → change → compare loop for one actor, then apply it to ten. The
operator's desired visual authoring is the payoff, not a static dashboard.

The kernel currently evaluates Once, After, Every, Gate, Until and seeded
Backoff; other cadence kinds are deferred (`packages/kernel/src/core.ts:44`).
Done, Emit, Invoke, Await, Guard and Sequence execute; All/Race are deferred
(`core.ts:139`, `test/wo017-evaluable-kinds.test.ts:121`). Compiler restrictions
currently allow one active mechanic, one participating group and one pipeline
(`packages/compiler/src/compile.ts:538`). WO-037 owns multi-active work.

The existing statechart-JSON codec is an equivalent loadout representation,
not a transition editor. The compiled diff is static. The Seiri scenario records
a useful timeline but uses a fixture-driven scheduler. Therefore the new lab
needs a bounded virtual scheduling driver, authored input contract and paired
execution result; wrapping those existing renderers alone would not deliver it.

Use a small pure reference model and exact-version RxJS traces to test any chosen
lowering. Include overlaps, cancellation, errors, late/duplicate inputs, bounded
work and subscription teardown. Explain fresh model sampling as a new run and
recorded replay as a different claim. Expand the supported vocabulary when a
scene demonstrates a useful missing behavior; preserve every deferred IX idea
and its related book experiments for later concept-delivery batches.
