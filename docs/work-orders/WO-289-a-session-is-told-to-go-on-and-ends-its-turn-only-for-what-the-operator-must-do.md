# WO-289 — A session is told to go on, and ends its turn only for what the operator must do (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-288",
    "relation": "satisfied-by-close",
    "reason": "its Part F rewrites the executor's sentence on ending a turn and the day's line, and its Part A the sentence on answering the operator, which this order's steps are written against"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. Every sentence and message the kit gives
a session about when a turn ends says one thing: a dispatch runs to its
recorded completion, and a turn ends for the operator only on the
operator's pause, stop or cancel or on a block that is the operator's alone.
The executor's two supports announce and go on, an advisory says that the
call went on and asks the operator for nothing, and `analysis:` ends when
the operator dispatches. No refusal, failing check or fixed figure is
added, in core or in an instance. Assigned at activation under the standing
opt-out default.
**Cost:** adds one platform rule to six role roots, about four lines to
each; changes the text of two executor supports, three briefing and
context lines, three hook messages and one shared rule; adds one branch to
the operator-control reader and about ten cases. Removes from every
executor dispatch the instruction to offer a turn boundary before each
queued action, and from every later prompt of a session in analysis the
instruction to pause again. `packages/skeleton/src/loadouts/contributor.ts`,
`packages/skeleton/src/loadouts/executor-supports.ts`,
`packages/skeleton/src/stops.mjs`, `packages/skeleton/src/harness-host.ts`,
`packages/compiler/src/harness.ts` and
`packages/compiler/src/operator-control.mjs` are registered evidence
sources: the editions they stale are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited, so no feedback re-mint or live
episode is owed. One complete review run at handoff; a second at final
review only if the integrated identity moved. Wall-clock, tokens and steps
are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 3 (ignored capture SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`): the
work instance's sessions say one thing and end the turn, each time with a
question. The same failure is in core's record as WO-287-D090, filed as a
critical error on 2026-11-18 with the rule this order writes as its
follow-up, and as WO-288-D168.
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#why-a-session-stops-and-asks)
holds the reading, and
[its census](../planning/passes/the-kit-keeps-working-2026-11-23-stop-and-ask-census.md)
every text it rests on.
**Depends on:** WO-288 (its Part F rewrites the executor's sentence on
ending a turn and the day's line of a prompt's facts, and its Part A the
sentence on answering the operator; this order's steps are written against
those files as WO-288 leaves them).
**Recommended placement:** first after WO-288. An instance's sessions stop
on these texts today, and no part of this order waits on another order of
this pass.

**Objective:** A session that has been dispatched keeps working until its
dispatch records its completion. It puts a choice of route to the operator
as a recommendation it then follows, it reads steering when the operator
sends it, and it ends a turn to wait only where the operator said to pause
or stop or where a refusal or the host names something only the operator
can do. The texts the kit gives a session at the moment of choice (a role's
root, the dispatch briefing, the context a hook adds to a prompt, an
advisory, the pause the operator opens with `analysis:`) all say so, and
none of them says the opposite.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- The executor is told three times to announce and then make room for the
  operator. `intentToAct` in
  `packages/skeleton/src/loadouts/executor-supports.ts` has it proceed
  "after current work and a reasonable steering opportunity", and
  `operatorCheckIn` there has it offer that opportunity "through available
  asynchronous input or a turn boundary" before each queued item. Both are
  on by default (`executorSupportDefaults`). The dispatch briefing repeats
  them (`scripts/lib/executor-readiness.mjs`, the lines for
  `communication-intent` and `operator-check-in`), and the hook's dispatch
  context adds "Open the reply with one line that begins 'I intend to' …
  before any tool call" (`packages/skeleton/src/harness-host.ts`, in the
  function that builds the executor's context). A session that takes the
  turn boundary says one line and stops, at entry and before each queued
  action.
- The rule on when a turn ends reaches the executor alone, and only in
  WO-288's uncommitted text. On `main` the shared rule `blocked-turn`
  (`packages/skeleton/src/loadouts/contributor.ts`, author layer) tells every
  role to state a block and end its turn, and no rule tells a verifier, a
  reviewer, a planner or a router that a choice of route is its own to
  make. WO-287-D090's follow-up asks for the rule in every role and has been
  an untriaged register row (FUP-64e6bd4cfc576948) since 2026-11-18.
  WO-288-D168 records a turn that ended with work owed after the executor's
  rule was already in that worktree's root.
- An instance whose build overlay removes the author's layer loses
  `own-decisions`, `operator-aim`, `question-pathways`, `request-authority`
  and `blocked-turn` together (the layer table in `contributor.ts`), which
  are the sentences that tell a session to decide for itself, while the two
  supports above stay.
- The context the prompt hook adds to an unprefixed question
  (`OPERATOR_QUESTION_CONTEXT` in `packages/compiler/src/harness.ts`) still
  asks for an answer "one of two ways, with the evidence" where WO-288
  rewrites the role's sentence to answer at once with what is known
  (boarded there as WO-288-D187).
- An advisory is the refusal's body with one sentence appended.
  `stopAdvisory` in `packages/skeleton/src/stops.mjs` adds "Stop <id>
  advises in this root and the work goes on" after bodies that still say
  "The operator can authorize proceeding in ordinary language"
  (`scripts/lib/dispatch-bound.mjs`), "or wait for it to finish"
  (`GATE_STOP_TEXT` in `harness-host.ts`) and "would be exceeded" (the
  worker cap). Each is delivered as the hook's message to the session's user
  (`protocolAdvisory`), so the operator reads a line that asks for an
  authorization nothing needs.
- The shared rule on dispatch bounds (`contributor.ts`, the rule that opens
  "Dispatch bounds live in docs/control/budgets.json") ends "Without
  authorization … start no further complete gate, bounded probe or worker
  past an exhausted bound", in an instance as in core, although the stop
  `dispatch-bound` advises in an instance since v1.4.0.
- `analysis:` holds a session until the whole prompt `analysis: off`.
  `packages/compiler/src/operator-control.mjs` enters it on any prompt that
  opens with the prefix, keeps it for every later prompt of the session,
  gives each of them "Pause the current routine … do not resume it
  automatically", and skips the kit's hooks while it is on, so a
  `resume: next` typed then is not dispatched. Since v1.4.0 the drive's
  account (`scripts/lib/drive-account.mjs`) and the router's root send the
  operator to an `analysis:` session to read further.
- The operator's own reading on 2026-11-19, recorded as WO-288-D049, laid
  the work instance's stopped turns to the sentence that ends a turn when a
  day's figure is reached. WO-288 Part F removes that sentence and is not
  released. This order changes none of it and is written to follow it.

**Design (scope discipline):**

- **One platform rule, `turns`, in each role root that carries the shared
  rules.** Those are six: the executor's, the verifier's, the reviewer's,
  the release close's, the planner's and the refuter's. The router's root
  is written whole, holds no shared rule and keeps its own list of the
  stops a drive ends on. In the executor's own wording the rule says five
  things:
  - a dispatch runs to its recorded completion;
  - a choice of route is put as a recommendation that the session takes in
    the same turn;
  - a question put to the operator is not a block, so the session says
    what it will do if no answer comes and goes on with the steps that do
    not depend on it;
  - a turn ends to wait only on the operator's pause, stop or cancel, or
    on a block that a refusal or the host names as the operator's alone,
    stated once with the one line that clears it;
  - where a unit or a support speaks of pausing or asking, this rule
    decides when the turn ends.

  It is a platform rule because it says how a kit phrase works: a dispatch
  is not complete until its command records it. It takes in what
  `blocked-turn` says, and that id leaves the author's layer.
- **The two supports announce and go on.** Intent to Act keeps its one
  line at entry and before each queued action, which the adjacent queue
  records. Operator Check-In keeps reading the operator's messages and the
  queue at a safe boundary. Neither offers a pause: the operator steers by
  sending a message, which the host delivers while the session works.
- **A hook says what the role says.** The question context is the role's
  own sentence, taken from where the role's sentence is defined, so the two
  cannot drift apart again.
- **An advisory reports and asks for nothing.** At `advise` a message opens
  with what was observed and that the call went on. The sentence that names
  the line which changes the level stays. A sentence that tells the operator
  to authorize, wait or run a command is said only by a refusal.
- **The bound's rule follows the bound's message.** Where the stop refuses,
  the session records the operator's authorization before further bounded
  work, as today. Where it advises, the work goes on and the handoff says by
  how much the bound was passed.
- **`analysis:` ends when the operator dispatches.** A prompt that opens
  with `resume:`, `planning:`, `ideation:` or `drive:` ends an analysis the
  session is in and is dispatched as in any other session. While analysis is on, what every hook says after the entry prompt (a
  later prompt's context, a tool hook's message and the Stop hook's) is
  that analysis is on, that the operator's message is the direction to act
  on, and the line that ends it; the instruction to pause is given once,
  at entry. Where an `operator override:` is open under the analysis, a
  dispatch ends neither: the override keeps its own `off`, which records
  it, and the hook says so in one line. `operator override:` is otherwise
  unchanged.

Rejected:

- *Rewording `anti-oscillation` and `fail-conservative-correction`*, whose
  texts ask for a focused question and for diagnosis after a correction.
  They differ on cost: both live in `packages/skeleton/src/loadouts/feedback.ts`,
  a judged feedback source, so changing them owes a feedback re-mint and a
  live episode, which this order does not carry while an instance waits.
  The new rule decides when a turn ends where one of them speaks of asking,
  and the two texts are a register row of the pass.
- *Ending analysis at any prompt without the prefix.* It differs on what
  ends the pause, a dispatch or any message. Diagnosis takes several
  messages, and the kit's hooks are suspended during it so that a broken
  classifier cannot lock it out; an unprefixed follow-up question would
  restore them in the middle of the diagnosis they were suspended for.
- *Continuing a turn from the Stop hook* when a dispatch is unfinished. It
  rests on a host behavior and is WO-290, so that this order's texts do not
  wait on it.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-288's merged text, which moves the lines of `contributor.ts` this plan names. A step's check is
one case run under `node scripts/harness.mjs bounded -- node --test
--test-name-pattern`; no suite runs alone before the order's one complete
run except to reproduce a failure that run names.

1. `packages/skeleton/src/loadouts/contributor.ts`: add the shared rule
   `turns` to the shared rules, which six roots carry, in the platform layer
   of the layer table, with the reason beside it; remove
   `blocked-turn` as a separate id, its sentence being part of the new
   rule. Check: a new case in `scripts/test-harness.mjs` that emits into a
   fixture root and reads the rule in each of the six role roots, once
   with no overlay and once with an overlay that unequips `author`.
2. `packages/skeleton/src/loadouts/executor-supports.ts`: `intentToAct` and
   `operatorCheckIn` as the Design says. Check: the case of
   `scripts/test-process-debt.mjs` that reads the equipped supports' lines,
   changed to the new wording and to assert that neither text holds
   "steering opportunity" or "turn boundary".
3. `scripts/lib/executor-readiness.mjs`: the briefing's lines for
   `communication-intent` and `operator-check-in`, each ending with the
   instruction to go on in the same turn. Check: the same file's case for
   the briefing.
4. `packages/skeleton/src/harness-host.ts`, the executor's dispatch context:
   the "I intend to" sentence gains "then go on in the same turn". Check: a
   case in `scripts/test-harness.mjs` that reads the context of a
   `resume: next` prompt.
5. `packages/compiler/src/harness.ts`: `OPERATOR_QUESTION_CONTEXT` is built
   from the role's sentence on answering the operator, which moves to one
   exported constant both read. Check: a case in the compiler package's
   tests that compares the hook's context with the emitted role sentence.
6. `packages/skeleton/src/stops.mjs`, `stopAdvisory`: the advisory opens
   with what was observed and that the call went on; each advised body
   passes it only the observation. Then the three bodies: the dispatch
   bound's in `scripts/lib/dispatch-bound.mjs`, the live gate's in
   `harness-host.ts` (`GATE_STOP_TEXT` is the refusal's and stays; the
   advisory takes the observation alone) and the worker cap's in
   `packages/skeleton/src/subagent-budget.ts`. Check: one case for each
   of the three in `scripts/test-harness.mjs` or
   `scripts/test-dispatch-bound.mjs`, in a fixture root where the stop
   advises.
7. `contributor.ts`, the shared rule `dispatch-bounds`: its last sentence
   as the Design says. Check: the case of step 1 reads it.
8. `packages/compiler/src/operator-control.mjs`: a prompt that opens with a
   lifecycle dispatch phrase ends an analysis and is passed on to the
   dispatch reader; the message for a later prompt of a session in analysis
   as the Design says. Check: cases in the compiler package's operator-control tests for a
   later prompt, a tool hook and the Stop hook, and for a dispatch typed
   with an override open under the analysis; and one case in
   `scripts/test-harness.mjs` for each of `resume: next`, `planning:`,
   `ideation:` and `drive: WO-NNN` typed after `analysis:` in a fixture
   session, which reads the role context the hook gives.
9. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`:
   the emitted roots, hooks and the features page.
10. Write-backs: `docs/KIT.md`, "What is the kit's and what is the
    author's" (the rule table gains `turns` and loses `blocked-turn`) and
    "The build overlay" (the support list is unchanged; say that the two
    supports no longer pause); `docs/product/07-execution-guide.md`,
    "Operator recovery controls" (what ends analysis) and "Discipline"
    (when a turn ends, replacing what it says of a blocked turn);
    `scripts/kit/CLAUDE.template.md` and `CLAUDE.md`, the line on
    `analysis:` (it ends at a dispatch or at `analysis: off`).
11. The handoff sequence of §Discipline: the complete run,
    `npm run test:docs`, `implementation-ready`.

**Deliverables:** the rule and its layer; the two supports' texts; the
briefing, context and hook messages; the operator-control branch; the
cases; the emitted bundle and the features page; the write-backs.

**Acceptance criteria (all required)**

1. After `node scripts/harness.mjs emit`, each of the six role roots that
   carry the shared rules (`dotln-executor`, `dotln-verifier`,
   `dotln-reviewer`, `dotln-release-close`, `dotln-planner`,
   `dotln-refuter`) carries the rule `turns`, with an overlay that
   unequips `author` as with none (`npm test -- --only harness-fixtures`).
2. `npm run features -- list` shows `turns` as a platform rule
   (`npm test -- --only configuration-root`).
3. The executor's root and its dispatch briefing tell it to announce its
   intent in one line and go on in the same turn, and neither holds the
   words "steering opportunity" or "turn boundary"
   (`npm test -- --only process-debt`).
4. With `question-pathways` equipped, the context the prompt hook adds to
   an unprefixed question is the emitted role sentence on answering the
   operator, word for word (`npm test -- --only compiler`).
5. In a root where the stop advises, the messages of `live-gate`,
   `dispatch-bound` and `worker-cap` each open with what was observed and
   that the call went on, and none tells the operator to authorize, wait
   or run a command (`npm test -- --only harness-fixtures`).
6. The rule `dispatch-bounds`, in each of the six roots of criterion 1,
   says that where the bound's message is an advisory the work goes on
   (`npm test -- --only harness-fixtures`).
7. In a session where `analysis:` is on and no `operator override:` is
   open, a prompt that opens with a dispatch phrase ends the analysis, and
   the prompt hook gives that prompt the role context it gives the same
   prompt in a session that never entered analysis, by a case for each of
   `resume: next`, `planning:`, `ideation:` and `drive: WO-NNN`
   (`npm test -- --only harness-fixtures`).
8. While `analysis:` is on, the message each hook gives after the entry
   prompt (a later prompt's context, a tool hook's message and the Stop
   hook's) says that analysis is on and names `analysis: off`, and does not
   hold the words "Pause the current routine"
   (`npm test -- --only compiler`).
9. `docs/KIT.md` lists `turns` among the platform rules, and
   `docs/product/07-execution-guide.md` under "Operator recovery controls"
   says that a dispatch ends analysis where no override is open
   (`npm run test:docs`).
10. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only configuration-root`, `npm test -- --only process-debt`,
`npm test -- --only compiler`, `npm test -- --only skeleton`.

**Evidence gate:** under `docs/evidence/WO-289/`: the decisions, with the
rule's final wording and each changed message before and after; the
handoff.

**Write-back duty:** as step 10 lists. The release's Read before upgrading
says that an instance's executor no longer pauses after its announcement,
that `analysis:` now ends at a dispatch, and that an instance which
unequipped `blocked-turn` by id has that line named in one advisory.

**Known issues and carry-ins:**

- Named boy-scout item, same file as step 1: the executor's sentence on a
  decision's `dispatch` field says only "naming the operator dispatch",
  while the document check takes the field only where a control prefix
  opens it and it stays on one line of at most 240 characters
  (`scripts/docs-check.mjs`). State that form in the sentence. The form has
  failed a document gate in WO-284, WO-287 and WO-288
  (FUP-fab6c96ffe7d5f46, item 2).
- An advisory reaches the session's user and no context reaches the model
  (WO-287-D088, FUP-f069f9a8b2399ee6). This order changes what an advisory
  says and not where it is delivered.
- `anti-oscillation` and `fail-conservative-correction` keep their texts
  (the Design's first rejection).
- The register rows this order settles: FUP-64e6bd4cfc576948 (WO-287-D090)
  and item 2 of FUP-fab6c96ffe7d5f46.

**Non-goals:** a refusal of a turn's end or any other new stop (WO-290
weighs the Stop hook); the text of a refusal, which keeps its route and its
level sentence; the feedback units' texts; `operator override:`; the day's
line of a prompt's facts and the executor's own sentence on ending a turn,
which are WO-288's; the delivery channel of an advisory; the message after
a host's denial of a call; any change to what a stop judges or to its
level.

**Operator-review assumptions:** the rule on turns is a platform rule, so
an instance cannot remove it with the author's layer; the executor keeps
its one-line announcement at entry and before a queued action; and
`analysis:` stays on across ordinary messages until a dispatch or
`analysis: off`.
