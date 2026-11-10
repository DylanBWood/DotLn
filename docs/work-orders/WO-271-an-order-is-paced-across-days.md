# WO-271 — An order is paced across days: an instance declares a daily figure, each prompt shows the session what the day has used against it, a session that reaches it writes where the order stands and stops, the next day's briefing names that standing, and the dispatch bound counts the time sessions worked instead of the time between them

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One optional figure in an instance's
budgets; one line in the facts the prompt hook prints; one section of an
order's handoff file and one line in the briefing; the dispatch bound's
wall-clock reading. No refusal is added; one refusal fires later than it
does today. An instance that declares no figure and whose phases finish
in a sitting behaves as today. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/lib/process-budget.mjs` (`readBudgets`), an
optional `spend.daily` figure in tokens or dollars; in
`packages/skeleton/src/observed-facts.ts` and the prompt hook that calls
it, the day's use and the advisory, recurring work at each prompt (one
read of the day's usage rollup; unmeasured, and measured by this order
from the hook's timing rows before and after, where a prompt hook takes
about three seconds today); in `scripts/lib/dispatch-bound.mjs`, the
reading of a phase's active time from its sessions' journal rows; in
`scripts/resume.mjs` (`executionBriefing`), one line naming the standing
section; in `packages/skeleton/src/loadouts/contributor.ts` (the
executor), the stopping rule; cases in the suites the Preflight names;
the kit guide, product 07 and the decisions. Removes these states: an
order that pauses overnight refused its gates and worker launches the
next morning because eight hours passed; a session with no way to know
the day's figure is spent; the next day's session rediscovering where the
work stood from the diff. Tokens and wall-clock: unknown until this
order's handoff records them. Re-mints: the editions the registered
sources this order edits stale, deterministically; no file in
`FEEDBACK_SOURCE_PATHS` changes, so no live feedback episode is owed. The
files this order edits are declared sources of machinery suites, so the
final criterion names `npm test -- --review`. Steps: the executor's,
below.
**Nomination provenance:** the operator's statements of 2026-11-09 that
the work budget is a daily figure per person and that a work order there
may take several days to stay within it (ignored captures SHA-256
`e1c8d0ae73fb667fbfa8aa82a58b9c6d054eaa53a521fd82a84bc8612e573237` and
`4d0cd689f95336c7236ba11355d4378c222fda9a7a5192ff1e38869d463b7353`); the
continuation candidate (FUP-d8769cd30e3501af) and the context-continuity
candidate (FUP-0091), read by
[the 2026-11-09 pass](../planning/passes/whole-plan-and-codebase-review-2026-11-09.md).
**Depends on:** WO-266 (open: the usage by day and the instance's prices
this order's figure is compared with); WO-234 (closed: the dispatch
bound).
**Recommended placement:** ninth, after WO-270 and after WO-266, whose
report it reads.
**Cites (read these sections):** `scripts/lib/dispatch-bound.mjs` (where
the elapsed time is taken from the dispatch's start to now);
`scripts/lib/process-budget.mjs` (`readBudgets`);
`scripts/kit/budgets.template.json` (the three roles whose wall-clock
bound is `local-median`); `packages/skeleton/src/observed-facts.ts` (the
usage line); `packages/skeleton/src/harness-host.ts` (the prompt hook
that prints the facts); `packages/skeleton/src/dispatch-journal.mjs`;
`scripts/resume.mjs` (`executionBriefing`); `scripts/lib/handoff-ledger.mjs`
(how the handoff file is read at `implementation-ready`);
`scripts/lib/checkpoint.mjs` (what a checkpoint holds); the kit guide's
section on budgets and bounds; product 07 §Operator recovery controls
(the dispatch bound) and §Discipline (the handoff sequence).

**Objective:** An instance says what a day may use. A session sees, at
each prompt, what the day has used against that figure, and when the
figure is reached it finishes the step in hand, writes where the order
stands and stops. The next day's session is pointed at that standing and
continues, and the time the order sat overnight is not counted against
the phase's bound.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- The bound counts the gaps. `scripts/lib/dispatch-bound.mjs` takes a
  phase's elapsed time as now less the dispatch's start, and the kit's
  budgets template gives the executor, the verifier and the reviewer a
  wall-clock bound of `local-median`, which resolves to four times the
  instance's own median for the phase and never less than eight hours.
  An order whose implementation is spread over three days passes it on
  the second morning, after which a complete gate, a bounded probe and a
  worker launch are refused until an acceptance is recorded from the
  operator's words. The planning session that filed this order shows the
  reading: its standing reported 22 hours 56 minutes elapsed from a
  dispatch begun the day before.
- A session does not know the day's use. The prompt hook prints the
  session's own usage at each prompt; nothing sums a day across sessions
  or compares it with a figure, and `docs/control/budgets.json` has no
  field for one. Every token and dollar bound in the template is null.
- Nothing records where a phase stood when a session ended. A checkpoint
  holds the worktree's tracked and untracked files at each lifecycle
  event, and the handoff file is written at `implementation-ready`.
  Between events a session that stops leaves the diff and the decisions
  written so far, and the next session reads its way back in.
- The budget the operator states is per person and per day, and an order
  on a capable model can use a day's starting figure in one sitting. The
  2026-11-09 pass's estimate, from WO-260's recorded tokens and the
  token classes of two measured sessions at list prices, put one of
  core's orders at two to three times that figure.

**Design (scope discipline):**

- The figure is the instance's and is advisory. `spend.daily` in
  `docs/control/budgets.json` holds a number of tokens or, where the
  instance has declared prices under WO-266, a number of dollars. The
  prompt hook adds one line to its facts: the day's use so far, summed
  over this checkout's sessions for the calendar day in the host's local
  time, and the figure. At or above the figure the line says to finish
  the step in hand, write the standing and end the turn. It refuses
  nothing, because the person at the keyboard may have reason to go on
  and the figure the operator gave is itself a guidance. Rejected: a
  refusal at the figure (the axis is who decides: a hard stop in the
  middle of a repair leaves a worse state than the overrun).
- The standing is a section of the order's handoff file. The executor
  creates `docs/evidence/WO-NNN/handoff.md` at its first stop if it does
  not exist and keeps one section there, replaced at each stop: the
  steps of the execution plan done, the step in hand and its state, what
  comes next, and what is undecided. At `implementation-ready` the
  section leaves and the file becomes the handoff it is today. The
  briefing of an active order names the section when the file has one.
  Rejected: a decision record at each stop (the axis is what a decision
  is: a stopping point is state that is overwritten, and the decisions
  file is already largely a log). Rejected: a new lifecycle event for a
  pause (the axis is blast radius: every reader of the control log would
  learn an event that changes no phase).
- The bound measures work. A phase's wall-clock reading is the sum of
  the spans in which its sessions' journals show activity, a gap between
  two journal rows longer than a stated idle interval contributing
  nothing. The interval is a constant beside the reading. A phase worked
  for nine hours without a break is refused where it is today.
- On every host the record shows this order changes when one refusal
  fires and adds none: on this repository's host and on the work laptop
  alike, a phase that would have been refused for elapsed time is
  refused for worked time, later or not at all.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/dispatch-bound.mjs` (the standing's elapsed reading):
   compute the phase's wall-clock value from its sessions' journal rows as
   the Design states, with the idle interval exported as a named
   constant, and keep the elapsed time since the dispatch's start as a
   separate, reported field. Check: `npm test -- --only harness-fixtures`,
   whose file loads the dispatch-bound cases.
2. `scripts/lib/process-budget.mjs` (`readBudgets`): admit an optional
   `spend.daily` object with `tokens` or `usd`, each a positive number or
   null, refusing any other shape by field;
   `scripts/kit/budgets.template.json`: the field, null. Check: `npm test
   -- --only process-debt`.
3. `packages/skeleton/src/observed-facts.ts` and the prompt hook in
   `packages/skeleton/src/harness-host.ts`: when a daily figure is
   declared, print the day's use from WO-266's rollup and the figure, and
   at or above it the stopping advisory; print nothing more when none is
   declared. Record the prompt hook's timing rows before and after.
   Check: `npm test -- --only harness-fixtures`.
4. `packages/skeleton/src/loadouts/contributor.ts` (the executor) and
   `scripts/resume.mjs` (`executionBriefing`): the stopping rule and the
   standing section's four parts in the executor's text; the briefing
   names the section when the order's handoff file has one;
   `scripts/lib/handoff-ledger.mjs`: `implementation-ready` refuses a
   handoff file that still carries the standing section, naming it.
   Check: `npm test -- --only resume`, `npm test -- --only skeleton` and
   `npm test -- --only compiler`.
5. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide (pacing an order across days: where
   the figure is declared, what a session is shown, the standing, and
   that the bound counts worked time); product 07 §Operator recovery
   controls (the bound's reading) and §Discipline (the standing section
   before the handoff); `docs/evidence/WO-271/decisions.md`. Then the
   handoff sequence of product 07 §Discipline.

**Deliverables:** the bound's worked-time reading; the daily figure and
its line in the facts; the standing section with the briefing's line and
the handoff check; the executor's rule; the cases; the write-backs and
the decisions.

**Acceptance criteria (all required)**

1. With journal rows that show two spans of activity half an hour long
   and twenty hours apart, the dispatch standing reports one hour of
   wall-clock for the phase and a bounded probe is admitted under an
   eight-hour bound; with rows that show nine hours of unbroken activity
   it is refused with the message the bound gives today; the standing
   also reports the elapsed time since the dispatch began.
2. With a daily figure declared and the day's recorded use below it, the
   facts printed at a prompt carry the day's use and the figure; with the
   use at or above it they also carry the stopping advisory; with no
   figure declared they are the facts printed at the base.
3. A `spend.daily` that is not an object of the two admitted fields, or
   that holds a negative number, is refused when the budgets load, naming
   the field.
4. Every installed executor root carries the stopping rule; with an
   active order whose handoff file holds a standing section the execution
   briefing names it, and without one it prints as at the base;
   `implementation-ready` on a handoff file that still holds the section
   is refused naming it.
5. The kit guide and product 07 state the figure, the line a session is
   shown, the standing and the bound's reading, each linking this order's
   decisions. Check: `npm run test:docs`.
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures` for steps 1 and 3;
`npm test -- --only process-debt` for step 2; `npm test -- --only resume`, `npm test -- --only skeleton`
and `npm test -- --only compiler` for step 4; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-271/`: the two standings of
criterion 1; the three printed facts of criterion 2 with the hook's
timing rows before and after; the briefing with and without a standing;
`npm run resume -- status --json` after `implementation-ready`.

**Write-back duty:** as listed in step 5 and criterion 5; sources and
reopening conditions in `docs/evidence/WO-271/decisions.md`.

**Known issues and carry-ins:**

- FUP-d8769cd30e3501af (what a continuation carries) and FUP-0091
  (context continuity): this order is their allocation for an attended
  order paused by choice; a resident-owned continuation stays with those
  rows.
- The day's use is this checkout's sessions. A person working in two
  checkouts, or a team sharing one figure, sums by hand; a figure per
  person across checkouts reopens when the work instance reports the
  need.
- A verifier's or a reviewer's phase is short and takes no standing;
  only the executor's text carries the rule.
- A day's use in dollars needs the instance's prices and the token
  classes of WO-266; with tokens only, the figure is in tokens.
- A session that ends without writing a standing leaves what it leaves
  today. The advisory asks for the standing; nothing enforces it before
  `implementation-ready`.
- The idle interval is the planner's first figure, ten minutes; the
  executor records the reading on this repository's own journals and a
  later pass re-reads it.

**Non-goals:** a refusal at the daily figure; a pause event in the
control log; a weekly or per-initiative cap; summing use across
checkouts or people; moving an order between clones; a standing for
phases other than the executor's.

**Operator-review assumptions:** that a daily figure the session is shown
and asked to honor serves better than one it is stopped by; that worked
time is what the phase bound was meant to limit; that a standing
overwritten at each stop, in the file that becomes the handoff, is where
the next session should look; and that ten minutes is a fair first idle
interval.
