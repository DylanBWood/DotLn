# WO-271 — An order is paced across days: an instance declares a daily figure, each prompt shows the session what the day has used against it, a session that reaches it writes where the order stands and stops, the next day's briefing names that standing, and the dispatch bound counts the time sessions worked instead of the time between them

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. One optional figure in an instance's
budgets; one line in the facts the prompt hook prints; one standing file beside an active order's evidence and one line in the
briefing; the dispatch bound's wall-clock reading. No refusal is added; one refusal fires later than it
does today. An instance that declares no figure and whose phases finish
in a sitting behaves as today. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/lib/process-budget.mjs` (`readBudgets`), an
optional `spend.daily` figure in tokens or dollars; in
`packages/skeleton/src/observed-facts.ts` and the prompt hook that calls
it, the day's use and the advisory, recurring work at each prompt (one call of the day reading WO-266 adds;
unmeasured, and measured by this order
from the hook's timing rows before and after, where a prompt hook takes
about three seconds today); in `scripts/lib/dispatch-bound.mjs`, the
reading of a phase's active time from its sessions' journal rows; in `scripts/resume.mjs` (`executionBriefing` and the
`implementation-ready` transition), one line naming the standing file and
that file's removal; in `packages/skeleton/src/loadouts/contributor.ts` (the
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
**Depends on:** WO-266 (open: the reading of usage by day and the
instance's prices this order's figure is compared with); WO-264 (open: it
makes each shared rule a record that names its roles, and this order's
stopping rule is such a record naming the executor); WO-234 (closed: the
dispatch bound).
**Recommended placement:** thirteenth, after WO-270 and after WO-266, whose
usage reading it shares.
**Cites (read these sections):** `scripts/lib/dispatch-bound.mjs` (where
the elapsed time is taken from the dispatch's start to now);
`scripts/lib/process-budget.mjs` (`readBudgets`);
`scripts/kit/budgets.template.json` (the three roles whose wall-clock
bound is `local-median`); `packages/skeleton/src/observed-facts.ts` (the
usage line); `packages/skeleton/src/harness-host.ts` (the prompt hook
that prints the facts); `packages/skeleton/src/dispatch-journal.mjs`;
`scripts/resume.mjs` (`executionBriefing`); `scripts/lib/handoff-ledger.mjs`
(how the handoff file is read at `implementation-ready`);
`scripts/lib/checkpoint.mjs` (what a checkpoint holds); the kit guide §Owned cleanup and retention (where the dispatch bounds are
described) and §Planning in this instance; product 07 §Operator recovery controls
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
  instance has declared prices under WO-266, a number of dollars. The prompt hook adds one line to its facts: the day's use so far, from the
  reading of the usage ledger by local calendar day that WO-266 adds, and
  the figure. At or above the figure the line says to finish the step in
  hand, write the standing and end the turn. Where the figure is in
  dollars and the day's sessions attest a model the instance has declared
  no price for, the line gives the day's tokens and says the estimate is
  unavailable. It refuses
  nothing, because the person at the keyboard may have reason to go on
  and the figure the operator gave is itself a guidance. Rejected: a
  refusal at the figure (the axis is who decides: a hard stop in the
  middle of a repair leaves a worse state than the overrun).
- The standing is a file of its own, `docs/evidence/WO-NNN/standing.md`,
  that exists only while the order is being executed. The executor writes
  it at a stop and replaces it at the next: the steps of the execution
  plan done, the step in hand and its state, what comes next, and what is
  undecided. The briefing of an active order names the file when it
  exists, and `implementation-ready` removes it and says so, so the
  handoff file is never edited for it and nothing is refused. Rejected: a
  section of the handoff file (the axis is the refusal it needs: a section
  left in a handoff would have to be refused at `implementation-ready`,
  and this order adds none).
  Rejected: a decision record at each stop (the axis is what a decision
  is: a stopping point is state that is overwritten, and the decisions
  file is already largely a log). Rejected: a new lifecycle event for a
  pause (the axis is blast radius: every reader of the control log would
  learn an event that changes no phase).
- The bound measures work. A phase's wall-clock reading is the sum of the
  spans in which its sessions' journals show activity. The time from a
  tool call's start row to its end row is worked however long it is, so a complete run of three quarters of an hour made in the foreground
  counts whole. A wait on background work counts only where that work's
  own calls are rows of the session's journal; where they are not the
  wait is idle, which makes the bound more lenient and never stricter,
  and the decisions record which the executor observed; a gap between one call's end, or a prompt, and the next row that
  is longer than a stated idle interval contributes nothing. The interval is a constant beside the reading. A phase worked
  for nine hours without a break is refused where it is today.
- On every host the record shows this order changes when one refusal
  fires and adds none: on this repository's host and on the work laptop
  alike, a phase that would have been refused for elapsed time is
  refused for worked time, later or not at all.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/lib/dispatch-bound.mjs` (the standing's elapsed reading):
   compute the phase's wall-clock value from its sessions' journal rows as
   the Design states, pairing a tool call's start and end rows, with the
   idle interval exported as a named constant, and keep the elapsed time
   since the dispatch's start as a separate, reported field. The cases
   elsewhere that stop a phase on this bound are read with it and changed
   only where the reading changes them: the one in
   `scripts/test-runner.test.mjs` and those in `scripts/test-off-ramps.mjs`.
   Check: `npm test -- --only harness-fixtures`, whose file loads the
   dispatch-bound cases, `npm test -- --only runner-fixtures` and `npm
   test -- --only resume`.
2. `scripts/lib/process-budget.mjs` (`readBudgets`): admit an optional
   `spend.daily` object with `tokens` or `usd`, each a positive number or
   null, refusing any other shape by field;
   `scripts/kit/budgets.template.json`: the field, null. Check: `npm test
   -- --only process-debt`.
3. `packages/skeleton/src/observed-facts.ts` and the prompt hook in
   `packages/skeleton/src/harness-host.ts`: when a daily figure is declared, print the day's use from the reading
   WO-266 adds and the figure, at or above it the stopping advisory, and
   the unavailable estimate where a dollar figure meets a model with no
   declared price; print nothing more when none is declared. Record the prompt hook's timing rows before and after.
   Check: `npm test -- --only harness-fixtures`.
4. `packages/skeleton/src/loadouts/contributor.ts` (a rule record naming
   the executor) and `scripts/resume.mjs` (`executionBriefing` and the
   `implementation-ready` transition): the stopping rule and the standing
   file's four parts in the executor's text; the briefing names
   `docs/evidence/WO-NNN/standing.md` when it exists; the transition
   removes the file and prints that it did.
   Check: `npm test -- --only resume`, `npm test -- --only skeleton` and
   `npm test -- --only compiler`.
5. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §Owned cleanup and retention (the bound counts worked time)
   and §Planning in this instance (pacing an order across days: where the
   figure is declared, what a session is shown and the standing), adding
   no second-level heading; product 07 §Operator recovery controls (the bound's reading) and
   §Discipline (the standing file before the handoff); `docs/evidence/WO-271/decisions.md`. Then the
   handoff sequence of product 07 §Discipline.

**Deliverables:** the bound's worked-time reading; the daily figure and
its line in the facts; the standing file with the briefing's line and its
removal at handoff; the executor's rule; the cases; the write-backs and
the decisions.

**Acceptance criteria (all required)**

1. With journal rows that show two spans of activity half an hour long
   and twenty hours apart, the dispatch standing reports one hour of
   wall-clock for the phase and a bounded probe is admitted under an
   eight-hour bound; with rows that show nine hours of unbroken activity
   it is refused with the message the bound gives today; with one tool call
   whose start and end rows are fifty minutes apart, the fifty minutes are
   counted; the standing also reports the elapsed time since the dispatch
   began.
2. With a daily figure declared and the day's recorded use below it, the
   facts printed at a prompt carry the day's use and the figure; with the use at or above it they also carry the stopping advisory; with a
   dollar figure and a model that has no declared price they carry the
   day's tokens and say the estimate is unavailable; with no figure
   declared they are the facts printed at the base.
3. A `spend.daily` that is not an object of the two admitted fields, or
   that holds a negative number, is refused when the budgets load, naming
   the field.
4. The emitted executor root carries the stopping rule, by the rule-record
   case of the skeleton suite (`npm test -- --only skeleton`), and `node
   scripts/harness.mjs check` shows the installed roots equal the emitted
   ones; with an active
   order that has a `standing.md` beside its evidence the execution
   briefing names it, and without one it prints as at the base;
   `implementation-ready` removes the file, prints that it did, and
   completes as at the base.
5. The kit guide and product 07 state the figure, the line a session is
   shown, the standing and the bound's reading, each linking this order's
   decisions. The verifier reads the
   named section; `npm run test:docs` judges its links and form.
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures` for steps 1 and 3;
`npm test -- --only runner-fixtures` and `npm test -- --only resume` for
step 1; `npm test -- --only process-debt` for step 2; `npm test -- --only resume`, `npm test -- --only skeleton`
and `npm test -- --only compiler` for step 4; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-271/`: the two standings of
criterion 1; the three printed facts of criterion 2 with the hook's
timing rows before and after; the briefing with and without a standing file;
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
  today. The advisory asks for the standing and nothing enforces it.
- The standing file is never committed: an order's work is uncommitted
  until its final review, and the file is removed at
  `implementation-ready`.
- The idle interval is the planner's first figure, ten minutes; the
  executor records the reading on this repository's own journals and a
  later pass re-reads it.

**Non-goals:** a refusal at the daily figure; a pause event in the control log; a section in the handoff file; a weekly or per-initiative cap; summing use across
checkouts or people; moving an order between clones; a standing for
phases other than the executor's.

**Operator-review assumptions:** that a daily figure the session is shown
and asked to honor serves better than one it is stopped by; that worked
time is what the phase bound was meant to limit; that a standing overwritten at each stop, in a file the briefing names, is
where the next session should look; and that ten minutes is a fair first idle
interval.
