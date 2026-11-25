# WO-297 — A day's figure that is reached ends no turn (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** patch. Where a root declares what a day may
use, the line a prompt's facts carry at or above that figure says that the
figure is reached and that no turn ends for it, and the executor's rule on
stopping no longer names the day's figure as a reason to end a turn. No
refusal, failing check or fixed figure is added. Assigned at activation
under the standing opt-out default.
**Cost:** changes one sentence of the day's line and its comment, the
opening of one executor rule (four bytes fewer in the executor's root, by
the texts below), the expected text of three cases, one row of a generated
rule table and one passage each of the kit guide and product 07. Removes,
from every prompt of an instance that declares a daily figure and has
reached it, the instruction to end the turn.
`packages/skeleton/src/observed-facts.ts` and
`packages/skeleton/src/loadouts/contributor.ts` are registered evidence
sources: the editions they stale are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited. One complete review run at handoff.
Wall-clock, tokens and steps are unknown until run.
**Nomination provenance:** the operator laid his work instance's stopped
turns to this text on 2026-11-19, and the fix has stood since then in
WO-288's worktree, unshipped
([the 2026-11-23 pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#why-a-session-stops-and-asks)).
The room the operator convened on 2026-11-25 placed it ahead of that
order's close, so that it ships whatever becomes of the order
([the room's plan](../planning/passes/data-is-the-record-2026-11-25.md#the-rooms-plan)).
**Depends on:** none.
**Recommended placement:** first. It shares one rule of
`contributor.ts` with WO-288, whose worktree holds a larger rewrite of
that rule; WO-288's integration takes its own text there, as its
direction says.

**Objective:** A session in a root that declares a daily figure is told,
once the figure is reached, that it is reached and that no turn ends for
it. The executor's root no longer tells an executor to end its turn when a
prompt's facts say so. Everything else about the day's line and about the
standing file is as it was.

**Observed gap (dated 2026-11-25 at `main` `77b5fc11e`, v1.4.0):**

- `renderDailyUse` in `packages/skeleton/src/observed-facts.ts` ends the
  day's line, at or above a figure, with the sentence `The daily figure is
  reached: finish the step in hand, write the standing and end the turn.
  This is advisory and refuses nothing.` The prompt hook puts that line
  among the facts of every prompt, in every role, wherever
  `docs/control/budgets.json` sets `spend.daily`.
- The executor's rule on stopping, in
  `packages/skeleton/src/loadouts/contributor.ts`, opens `When a prompt's
  facts say the day's figure is reached, or you stop with the order
  unfinished, finish the step in hand`, and both emitted executor roots
  carry it.
- A figure in tokens is compared with each session's total, cached input
  included, so it is reached early in a working day (the 2026-11-23 pass
  measured 15.4 million cached tokens of 15.8 million in its first 22
  minutes).
- Three cases pin today's text: in `scripts/test-observed-facts.mjs`, the
  case whose name opens `WO-276 criterion P2: the day's line carries the
  use and the figure`; in `scripts/test-harness.mjs`, the case whose name
  opens `WO-276 criterion P2: a prompt's facts carry the day's use`; and in
  `packages/skeleton/test/executor-supports.test.ts`, the case whose name
  opens `WO-276 criterion P4: the executor's emitted root`.
- `docs/KIT.md`, in its account of the day's figure, says that the line
  tells the executor to finish the step in hand, write the standing and
  end the turn. `docs/product/07-execution-guide.md`, in its passage on
  the standing file, says that an executor stopping at the day's figure
  writes the standing, and that a day's figure only adds the line that
  asks for the stop.
- `docs/evidence/WO-276/part-f/rule-table.md` records how each shared rule
  opens and its size, and the case whose name opens `WO-276 criterion F2`
  rebuilds that page from the built rules and fails on a byte's
  difference.

**Design (scope discipline):**

- **The line states and ends nothing.** At or above a figure the day's
  line ends with this sentence, which is the one WO-288's worktree holds,
  byte for byte, and the function's comment says the same:

  ```text
   The daily figure is reached. It is stated for the operator and ends no turn: go on with the order.
  ```

- **The executor's rule loses its first reason.** Its opening becomes the
  text below and the rest of the rule is unchanged. This is the smallest
  edit of `main`'s rule. WO-288's rewrite of the whole rule replaces it
  when that order integrates `main`, so the cases of this order assert
  only what that rewrite also satisfies: the facts line reads as the
  worktree's, and the executor's rule speaks of a day's figure without
  ending a turn for it.

  ```text
  A day's figure in a prompt's facts ends no turn. When you stop with the order unfinished, finish the step in hand,
  ```

- **What returns this order.** This is the rule the room of 2026-11-25
  signed, stated here as a trial
  ([the room's plan](../planning/passes/data-is-the-record-2026-11-25.md#4-what-returns-an-order-what-is-read-again-and-when-it-stops)).
  A criterion is met when its named evidence holds at the tree's identity
  and no ground below applies. The order returns to repair on:
  - a scenario below or a required suite failing at that identity,
    reproduced alone where possible and under the recorded concurrency and
    limits where the failure depends on them;
  - a retained reproduction of an earlier blocking finding that still
    shows a violation;
  - on supported input, in what this order adds or alters, a
    counterexample to an invariant a criterion states, a wrong result
    accepted or a record lost or misfiled;
  - a regression against `main` on supported input;
  - a breach of the clean-room floor or of an authority or credential
    boundary.

  Supported input is what a kit writer produces or a documented command's
  contract admits, and a faithful fixture of either counts whoever typed
  it. Where a command takes free text, that is text a writer actually
  produced or a form its contract names. A reproduction is judged by its
  input and its observed result, whoever found it.

  A refusal that names its remedy returns nothing where the contract
  permits that refusal. Wording returns the order only where a criterion
  requires an emitted text. Anything else is recorded as a follow-up with
  its reopening condition.

  A check that did not run neither passes nor returns. The judge gets it
  run through the host's permission flow; where only the owner can supply
  what it needs, the judge states that block once with the line that
  clears it, and waits.

Rejected:

- _Taking WO-288's whole executor rule._ It differs on what `main` can
  carry: that text names `evidence --wait --target`, which `main` does not
  have, and it belongs to that order's judgment.
- _Removing the day's line at the figure._ It differs on who the line is
  for: the operator reads it, and WO-276 gave it to him.
- _A criterion that a live session goes on at the figure._ It differs on
  what a command can settle on the candidate: a model's next action is not
  that. The re-cut of WO-289 carries an observed continuation.

**Execution plan (the executor follows these steps in order; observed at
`77b5fc11e`, 2026-11-25):** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. The controls, before any source changes: give the three cases of the
   Observed gap the texts of the Design, and run each alone. Each fails at
   the base. A case that passes there goes back to planning with its
   output, and the order stops.
2. `packages/skeleton/src/observed-facts.ts`, `renderDailyUse`: the
   sentence and the comment. Check: the first two cases, each alone.
3. `packages/skeleton/src/loadouts/contributor.ts`, the executor's rule on
   stopping: its opening. Check: the third case alone.
4. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`:
   the emitted executor roots and the editions the two sources stale. Then
   `node docs/evidence/WO-276/part-f/rule-table.mjs`, which rewrites the
   rule table's row for the rule step 3 edits. Check:
   `node docs/evidence/WO-276/part-f/rule-table.mjs --check`.
5. Write-backs: `docs/KIT.md`, the account of the day's figure (the line
   states that the figure is reached and ends no turn);
   `docs/product/07-execution-guide.md`, the passage on the standing file
   (an executor that stops writes the standing, and a day's figure asks
   for no stop).
6. The handoff sequence of §Discipline: the complete run,
   `npm run test:docs`, `implementation-ready`.

**Deliverables:** the day's line and its comment; the executor rule's
opening; the three cases; the emitted executor roots; the rule table's
row; the kit guide's passage and product 07's.

**Acceptance criteria (all required)**

1. At or above a figure, the day's line says that the figure is reached
   and that no turn ends. Supported input: the use and figure a root's
   `docs/control/budgets.json` and its sessions give. Command:
   `npm test -- --only harness-fixtures`, the day's-line case of
   `scripts/test-observed-facts.mjs`.

   | Given | Then |
   | --- | --- |
   | a figure in tokens and a day's use equal to it | the line ends with the Design's sentence and does not hold `end the turn` |
   | the same figure and a day's use below it | the line holds neither `The daily figure is reached` nor `ends no turn` |

   Control: the first row fails at the base, where the line ends with the
   sentence that holds `end the turn`. The second fails where the sentence
   is appended whatever the use.

2. The prompt hook delivers that line. Supported input: a prompt in a
   fixture root whose day's use has reached its figure. Command:
   `npm test -- --only harness-fixtures`, the case of
   `scripts/test-harness.mjs` that reads a prompt's facts.

   | Given | Then |
   | --- | --- |
   | the fixture of that case, with 1,650 tokens used of a figure of 1,650 | the day's line among the facts the hook returns ends with the Design's sentence |

   Control: the row fails at the base.

3. The executor's emitted root no longer ends a turn at a day's figure.
   Command: `npm test -- --only skeleton`, the case of
   `packages/skeleton/test/executor-supports.test.ts` that reads the
   emitted roots.

   | Given | Then |
   | --- | --- |
   | the emitted `dotln-executor` root under `.claude/skills` and under `.agents/skills` | each holds `A day's figure` and ``finish the step in hand, write `docs/evidence/WO-NNN/standing.md` and end the turn`` |
   | every emitted role root | none holds `say the day's figure is reached` |

   Control: the second row fails at the base, and so does the first on its
   first text.

4. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only skeleton`, `npm test -- --only process-debt`.

**Evidence gate:** under `docs/evidence/WO-297/`: the decisions, with each
changed text before and after, each control's failing output at the base
and the executor root's bytes before and after; the handoff; and one
recorded episode in a starter updated to this tree, with `spend.daily` set
below the day's use: whether a dispatched session took its next authorized
step after the day's line, and whether it ended its turn on an explicit
pause. The episode is evidence and no criterion: it is recorded whichever
way it falls, or its absence with the host's reason.

**Write-back duty:** as step 5 lists. The release's Read before upgrading
says that a reached daily figure no longer tells a session to end its
turn, and that an instance which set `spend.daily` to null to keep its
sessions working may set its figure again. It says that a session goes on
at the figure only if the recorded episode showed one do so.

**Known issues and carry-ins:**

- No criterion observes a session going on at the figure, since that is a model's choice and no command on the candidate settles it. The re-cut of WO-289 carries an observed continuation and an honored pause. Reopen: an instance on this release reports a turn ended at the day's line.
- WO-288's worktree rewrites the whole executor rule this order edits. If that order closes, its text replaces this one at its integration. If it parks, this order's text stands.
- The criteria and the Design's rule on what returns the order are written in the form the room of 2026-11-25 agreed, as a trial judged over the next five deliveries. Reopen: this order is returned on a reading of a criterion, or its first step finds a control that does not fail.
- The paired first round costs four reviewer launches on a change of two sentences. The rule in force asks it of every order until fifteen such rounds are read.
- On `main` the console's document task was stopped at its memory limit in two full document gates of two on 2026-11-24, and passed alone. If this order's document gate is stopped there and stops again on a second run, the order holds at that point and WO-288's attended attempt goes first, since its Part E removes the stop. The executor does not raise `memory.gateShare`: that setting is the owner's. Reopen: WO-288 is held, and the console fix is then filed alone and placed first.

**Non-goals:** the executor's other reasons to end a turn; the Stop hook's
line; what a session does while a worker or a gate runs; the rule
`blocked-turn` and the two executor supports, which are WO-289's; how the
day's use is counted or priced; the standing file; any refusal.

**Operator-review assumptions:** a reached daily figure informs and ends
nothing, in every role; the sentence is WO-288's, unchanged.
