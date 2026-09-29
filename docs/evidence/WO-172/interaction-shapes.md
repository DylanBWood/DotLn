# Interaction shapes

These sketches model patterns in human collaboration, including work with agents. The point is the mechanism: what is remembered, what is ignored, what feeds back, and what would change the outcome. They are candidates grounded in observed interactions, not established explanations of anyone's motives.

The compact expressions are executable RxJS 7.8.2. The diagrams show **outputs**, with one character per value; `|` means completion. An open right edge ends the viewing window. Times and numeric gains are illustrative. The [paired examples](interaction-shapes.test.mjs) define the inputs and helper functions and check what happens when the stated condition changes. Passing them establishes stream behavior, not behavioral validity.

The [structured collection](interaction-shapes.json) holds sources, themes and revision history. [D027](decisions.md#wo-172-d027--revise-the-shapes-as-models-of-behavior) records this curation; earlier survey validation remains historical ([D026](decisions.md)).

## Permission

*Permission expires at the next sentence.*

```js
work$.pipe(withLatestFrom(authority$), concatMap(([work, grant]) => covers(grant, work) ? act$(work) : ask$(work)))
```

```text
--a---q---q|
```

**Read:** `a` = acts within the grant; `q` = asks again.

A collaborator keeps seeking permission for work already authorized. Authority is remembered, but matched to the wording of the request rather than its scope. A harmless restatement therefore looks like a fresh boundary.

**Model:** covers compares exact wording in this example; all three work items are within the same grant. act$ and ask$ each emit one response after a tick.

**What changes it:** Match the actual scope of the grant. All three actions proceed; genuinely new scope still requires authorization.

**Source:** survey-validation.json row 1 (WO-042 final review); survey-validation.json row 13 (WO-044).

## Loop

*A passing check buys another check.*

```js
doubt$.pipe(exhaustMap(() => check$.pipe(repeat({ delay: relief }))), takeUntil(settled$))
```

```text
--p---p---p-|
```

**Read:** `p` = same subject passes again.

Checks recur after passing, without a changed subject or new failure. Checking briefly relieves uncertainty but never establishes sufficiency. The same check restarts after that relief expires; further doubt during the ritual changes nothing.

**Model:** check$ emits pass then completes; relief is two illustrative ticks. settled$ is an explicit decision that the evidence is sufficient, at tick 12.

**What changes it:** Accept the first adequate result as sufficient. Settlement at tick 4 ends the cycle after one pass.

**Source:** survey-validation.json row 1 (WO-042 final review).

## Sprawl

*Every addition becomes the new minimum.*

```js
detail$.pipe(scan((draft, detail) => revise(draft, detail), seed), distinctUntilChanged())
```

```text
-a-b-c|
```

**Read:** `a` = Fix export offline; `b` = Fix export offline streaming; `c` = Fix export offline streaming CLI.

Successive titles accumulate individually defensible details and become harder to read. Each revision inherits every previous inclusion. The local decision is whether one more detail helps; the accumulated reading cost is never reconsidered.

**Model:** seed is Fix export; revise appends each proposed qualifier. Emissions are whole drafts, not individual characters.

**What changes it:** Recompose from the purpose and the currently relevant detail instead of preserving every earlier inclusion. Length stops ratcheting upward.

**Source:** survey-validation.json row 14 (WO-109 final review); docs/intake/images/WO-172-2026-09-29-pr-titles-1.png (ignored intake).

## Overshoot

*The correction becomes the next mistake.*

```js
feedback$.pipe(scan((position, target) => position + gain * (target - position), initial))
```

```text
-a-b-c-d|
```

**Read:** `a` = -2; `b` = 4; `c` = -8; `d` = 16.

A local correction is taken as a mandate to adopt the opposite extreme. The response depends on the current stance and applies excessive gain to the remaining error. Each correction crosses the target and creates a larger error of the opposite sign.

**Model:** One stylized policy axis; target 0, initial stance 1, gain 3. These are explanatory values, not fitted psychological measurements.

**What changes it:** Apply the correction at its actual scope and strength. At gain 1, the first response reaches the target and later feedback leaves it there.

**Source:** WO-172-D019; WO-172-D020.

## Unheard

*Agreement inside a closed vocabulary.*

```js
readings$.pipe(filter(reading => categories.has(reading.category)), scan(updateBelief, prior))
```

```text
-a-b-c--|
```

**Read:** `a` = acknowledgement, one supporting reading; `b` = acknowledgement, two; `c` = acknowledgement, three.

Repeated readers agree while the author supplies a meaning the rubric cannot represent. The vocabulary filters evidence before belief updates. Peer agreement accumulates; the author's out-of-vocabulary correction never reaches the update, so more agreement does not repair the misunderstanding.

**Model:** Three peer readings say acknowledgement; the final author reading says reinforcement. updateBelief counts consecutive supporting readings and resets on a changed category.

**What changes it:** Admit the author's missing category. Their reading changes the interpretation rather than disappearing before it can be considered.

**Source:** WO-172-D016; WO-172-D018; WO-172-D019.

## Distraction

*The aside takes over the mission.*

```js
message$.pipe(switchMap(message => respond$(message)))
```

```text
----s----|
```

**Read:** `s` = aside answered; goal result never arrives.

A side question displaces an unfinished task. Attention behaves as replacement: every new utterance cancels the current response, without first deciding whether it amends, interrupts or merely accompanies the task.

**Model:** The goal arrives at tick 1 and needs six ticks; a question at tick 3 needs one. Cancellation here models abandoned attention, not erased memory or an irreversible action being undone.

**What changes it:** Treat this question as an aside. A parallel response answers it while the original task still completes; an explicit replacement would remain a different case.

**Source:** intervention-subjects.json theme question-read-as-instruction; WO-054.

## Wall

*More effort. No new information.*

```js
attempt$.pipe(catchError(() => of('blocked')), repeat({ delay: pause }), scan(rememberCostOnly, initial))
```

```text
-a---b---c---d
```

**Read:** `a` = blocked, attempt 1; `b` = blocked, attempt 2; `c` = blocked, attempt 3; `d` = blocked, attempt 4.

The same blocked approach is attempted repeatedly without a change that could make it work. A refusal is converted into a resumable outcome. The loop remembers expenditure, but has no state for what the refusal taught it or whether the approach should change.

**Model:** Synthetic attempt$ fails after one tick; pause is three ticks. rememberCostOnly increments attempts and retains the blocked outcome. The viewing window ends at tick 16.

**What changes it:** Make a stable refusal terminal for this approach. One recorded blocked attempt replaces repeated expenditure; escalation needs genuinely new information or authority.

**Source:** survey-validation.json row 15 (WO-126 verification).

## Budget

*A borrowed deadline becomes a verdict.*

```js
work$.pipe(timeout({ first: limit }), catchError(() => of('abandoned')))
```

```text
----(a|)
```

**Read:** `a` = abandoned before the result.

Work is abandoned because an assumed budget is treated as a binding constraint. An arbitrary wait limit turns absence of a result so far into a decision to stop. The model exposes the choice of deadline, rather than equating slowness with failure.

**Model:** The synthetic result would arrive at tick 7; the assumed first-result limit is 4. No real duration is inferred from the transcript.

**What changes it:** Use the agreed budget. With a limit of 9, the same work yields its result at tick 7. Real resource limits can still justify stopping.

**Source:** survey-validation.json row 16 (planning pass on main).

## Breath

*The thought finishes after the message.*

```js
speech$.pipe(buffer(speech$.pipe(debounceTime(pause))), filter(parts => parts.length > 0), map(interpretTogether))
```

```text
--------a------b-|
```

**Read:** `a` = one assembled request: inspect and rewrite; `b` = the later request: explain.

Several short messages form one thought, including a correction of its unfinished wording. Interpretation waits for a pause, then applies amendments within the burst before acting. The resulting intent can differ from the first fragment or a literal concatenation.

**Model:** speech$ is shared; pause is three illustrative ticks. The first burst asks to inspect, adds preserve, then replaces preserve with rewrite. interpretTogether applies that replacement.

**What changes it:** At a pause of one tick, the same burst becomes four premature interpretations. Timing is a cue, not proof of shared intent; an explicit send boundary can override it.

**Source:** WO-172-D011.

## Envelope

*Recording the problem becomes solving it.*

```js
merge(documented$, resolved$).pipe(scan(measure, initial), filter(state => state.filed >= quota), take(1), map(() => 'done'))
```

```text
-----(d|)
```

**Read:** `d` = declared done with three filed and zero resolved.

A complete account of interventions is mistaken for progress on their subjects. Both documentation and resolution can be observed, but stopping is controlled by the easier proxy: the number filed. The process can declare success before anything is resolved.

**Model:** measure retains separate filed and resolved counts. Quota 3 is an illustrative stopping rule, not a claim about the surveyed workflow.

**What changes it:** Tie this stopping condition to resolution. On the same inputs, completion moves from tick 5 to tick 11, after three actual resolutions.

**Source:** WO-172-D022.

## Unseen

*The lesson remembers only the bruises.*

```js
feedback$.pipe(filter(keep), scan((value, event) => value + rate * (event.reward - value), 0))
```

```text
---a-----b|
```

**Read:** `a` = -0.5; `b` = -0.75.

Positive reinforcement is discarded while corrections shape the learned expectation. Selective attention changes the evidence used for learning. Repeated successes cannot offset corrections if praise is filtered out before the state updates.

**Model:** Illustrative rewards +1 and -1, learning rate 0.5; value is a toy learned expectation, not a measured emotion or trait. keep admits only negative feedback.

**What changes it:** Retain both praise and correction. The same event sequence produces a different trajectory, including what to continue doing.

**Source:** survey-validation.json row 4 (WO-126 ideation); WO-172-D018.

## Elsewhere

*Nearest is mistaken for cause.*

```js
reaction$.pipe(withLatestFrom(local$), map(([reaction, last]) => attribute(reaction, last)))
```

```text
---a-----b-|
```

**Read:** `a` = attributed to current local work; `b` = attributed to latest local completion.

A reaction is attributed to the latest visible activity although its trigger lies elsewhere. Recency supplies a convenient explanation when causal context is missing. Joining streams by time produces adjacency, not evidence that one event caused another.

**Model:** local$ holds the latest activity; attribute always blames it. The example's actual triggers are supplied separately by the author, not inferred from the diagram.

**What changes it:** Use an explicit author-supplied causal reference, or retain unknown. Reading another stream without such a link still would not establish causation.

**Source:** survey-validation.json row 3 (WO-006); survey-validation.json row 9 (WO-050 verification); WO-172-D018.

## Meta

*Explaining the repair becomes the work.*

```js
issue$.pipe(expand(issue => discuss$(issue)), map(issue => issue.level))
```

```text
a-b-c-d
```

**Read:** `a` = level 0: the task; `b` = level 1: handling the task; `c` = level 2: handling that intervention; `d` = level 3: handling the explanation.

Discussion of a failure creates a new discussion of how that discussion was handled. Each explanation produces the next unresolved issue at a higher level. Work recurses through its own framing because the response does not discharge the original obligation.

**Model:** issue$ starts at level 0; discuss$ returns one unresolved next-level issue after two ticks. The viewing window ends at tick 8; levels are abstractions, not transcript counts.

**What changes it:** An explanation that leads to a concrete resolution returns a resolved issue; discuss$ then returns EMPTY. Reflection can end in repair instead of another framing problem.

**Source:** the operator's messages at 2026-09-29T03:37Z to 03:38Z (meta and meta-meta interactions); WO-172-D019; WO-172-D020; the operator's reminder at 2026-09-29T03:59Z (expand).

## Scope

*Each finished task leaves more unfinished.*

```js
work$.pipe(expand(state => state.open > 0 ? finishOne$(state) : EMPTY), map(state => state.open))
```

```text
a-b-c-d
```

**Read:** `a` = 1; `b` = 2; `c` = 3; `d` = 4.

Work is completed while the outstanding workload still grows. Completion feeds new obligations back into the same queue. When each finish introduces more work than it closes, visible activity coexists with a growing backlog.

**Model:** One task initially open; finishOne$ closes one and adds two every two ticks. This reproduction rate is illustrative and is not inferred from backlog size. The viewing window ends at tick 8.

**What changes it:** Close the generating cause, or admit only necessary follow-ups. With zero new obligations from the same completion, the queue reaches zero. Legitimate operator expansion is still new demand, not failure.

**Source:** WO-172-D012; WO-172-D021; the operator's reminder at 2026-09-29T03:59Z (expand); intervention-subjects.json theme deferring-fixes; WO-172-D023.

## Reproduce the mechanical examples

Use an existing RxJS 7.8.2 installation, or install it in session scratch; no project dependency is required. Pass the directory containing its `node_modules` to the test file:

```sh
node docs/evidence/WO-172/interaction-shapes.test.mjs /path/to/scratch/rxjs-fixture
```

Operator definitions and marble notation: [RxJS 7.8.2 source](https://github.com/ReactiveX/rxjs/tree/7.8.2/src/internal/operators), [marble-testing guide](https://github.com/ReactiveX/rxjs/blob/7.8.2/docs_app/content/guide/testing/marble-testing.md).
