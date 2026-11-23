# WO-290 — A turn that leaves a dispatch unfinished goes on once (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. Where a session ends its turn while its
lifecycle dispatch has recorded no completion and nothing the kit can
observe needs the operator, the Stop hook has the session go on, once, and
tells it why. This adds one row to the table of stops, `unfinished-turn`,
which protects the owner's order from standing idle with nothing for the
owner to do. At `refuse` the row denies only the end of a turn, so no work
is stopped by it, and that is the level it stands at in core and in an
instance; one line of `dotln.config.json` sets it to `advise`, where the
hook names the unfinished dispatch and the turn ends, or to `off`. Assigned
at activation under the standing opt-out default.
**Cost:** adds one decision to the Stop hook, one row and its level, one
reason text and about eight cases; adds to a session that stops early one
continued turn, whose tokens are unknown until run. Removes nothing.
`packages/skeleton/src/harness-host.ts`, `packages/skeleton/src/stops.mjs`
and `packages/skeleton/src/observed-facts.ts` are registered evidence
sources: the editions they stale are re-minted with `npm run sync`. No file
of `FEEDBACK_SOURCE_PATHS` is edited. One complete review run at handoff.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 3 (ignored capture SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`). WO-288's
Part F boards this as a register row and keeps it out of that order
(WO-288-D049): a refusal of a turn's end that leaves an order unfinished
with no block only the operator can clear.
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#why-a-session-stops-and-asks)
gives the reason for a mechanism beside WO-289's sentences: in the record
of the critics, a sentence held where a command's default or a hook stood
behind it, and a turn ended with work owed after the rule was already in
the session's root (WO-288-D168).
**Depends on:** WO-288 (its Part F has the Stop hook's line name a dispatch
that has not recorded its completion, which this order's decision reads)
and WO-289 (the rule `turns`, which the reason given to the session
repeats).
**Recommended placement:** after WO-289 and WO-291. It rests on a host
behavior, so it is filed apart from WO-289's texts and does not hold them.

**Objective:** A session dispatched to execute, repair, verify or review an
order does not sit idle between the operator's visits. When it ends a turn
with its dispatch unfinished, and it is not waiting on a task of its own,
on a plan's approval or under a pause the operator opened, the kit sends it
back to work once, with a reason that names what is unfinished. The session
then goes on, or says in one line what only the operator can do and ends
its turn, which the kit then lets it do.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- The Stop hook lets every turn of the main session end. Its path in
  `packages/skeleton/src/harness-host.ts` (the `finish` kind) returns a
  status message alone, and `packages/skeleton/src/observed-facts.ts` says
  of it "Stop never returns a blocking decision". The one stop it denies is
  a spawned worker's with tasks of its own still running, in core
  ([the census](../planning/passes/the-kit-keeps-working-2026-11-23-stop-and-ask-census.md),
  §2.6).
- The hook already reads what the decision needs. Its input type holds
  `stop_hook_active` and `background_tasks`, and the worker's stop uses
  both.
- Under Codex the compaction adapter already permits one continuation
  after a premature stop (`scripts/test-codex-continuation.mjs`). Claude
  Code sessions have nothing of the kind.
- The host's published reference
  (<https://code.claude.com/docs/en/hooks>, sections "Stop input" and "Stop
  decision control", read on 2026-11-23) says that a Stop hook's
  `decision: "block"` with a `reason` prevents the stop and gives the
  reason to the model; that `stop_hook_active` is true when the turn is
  already continuing from a Stop hook; that the host ends the turn after
  eight continuations in a row; that the input lists the session's
  background tasks; and that the hook does not run when the user interrupts.
- WO-287-D090 and WO-288-D168 record turns that ended with work owed and
  nothing asked of the operator, the second for 43 minutes.

**Design (scope discipline):**

- **The decision reads recorded state and never the session's words.** The
  hook continues a turn when all of these hold: the session's journaled
  dispatch is `resume: next`, `resume: fix`, `resume: verify` or
  `resume: final review`; the order's control state shows that dispatch's
  phase not yet completed; the host does not report the turn as already
  continuing from a Stop hook; no background task of the session is
  running; no plan is proposed and unapproved; and neither `analysis:` nor
  `operator override:` is on. In every other state the turn ends as today.
- **Once.** A second stop in a row ends the turn. A session that was told
  to pause, or that only the operator can unblock, therefore spends one
  short turn saying so.
- **The reason is the rule.** It names the order and the dispatch, says
  that nothing recorded needs the operator, and gives the two courses of
  the rule `turns`: take the route you would recommend and go on, or say in
  one line what only the operator can do and end the turn.
- **A row with a level.** `unfinished-turn` is a row of the table of stops.
  `refuse` continues the turn, `advise` names the unfinished dispatch in
  the hook's line and lets the turn end, `off` says nothing. It stands at
  `refuse` in core and in an instance, since at that level it stops no
  work, and one line changes it.
- **Hosts.** The form of the hook's output is the executor's, read from the
  host's page at execution. Codex keeps its adapter. A host that ignores
  the output ends the turn as today.

Rejected:

- *Deciding from the session's last message*, by reading whether it ends in
  a question. It differs on what is read, recorded state or prose: no
  criterion of this kit rests on a deterministic reading of natural
  language, and a question is sometimes the right end of a turn.
- *Continuing until the dispatch completes.* It differs on how many times
  the hook insists. A session that must stop would be held in a loop that
  only the operator's interrupt ends, which is the cost this order exists
  to remove.
- *The planner, the refuter, the router and the release close.* They differ
  on what a turn's end means: a planning session converses, a router stops
  by design at each of its stops, and a close hands the operator a command
  when the host declines its publish.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-288's and WO-289's merged text. A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `packages/skeleton/src/stops.mjs`: the row `unfinished-turn`, with what
   it protects and its level in core and in an instance. Check: a case in
   `scripts/test-features.mjs` that reads the row from the features page of
   a fixture root.
2. `packages/skeleton/src/harness-host.ts`, the `finish` path: one function
   that takes the Stop input, the session's journaled dispatch and the
   order's control state and returns continue or end, with the reason, as
   the Design's first bullet lists. Check: one case for each row of
   criterion 1's table in `scripts/test-harness.mjs`.
3. `harness-host.ts`, the same path: at `refuse` the hook's output prevents
   the stop in the form the host's page gives and journals the
   continuation; at `advise` the status line names the unfinished dispatch;
   at `off` neither. Check: three cases in `scripts/test-harness.mjs`.
4. `packages/skeleton/src/observed-facts.ts`: the comment and the status
   line that say the Stop hook never blocks, corrected to what it now does.
   Check: the case of step 3 reads the line.
5. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`.
6. Write-backs: `docs/KIT.md`, "Stops" (the row, its three levels and the
   line that sets each); `docs/product/07-execution-guide.md`, "Discipline"
   (what the kit does when a turn ends with a dispatch unfinished);
   `CLAUDE.md` and `scripts/kit/CLAUDE.template.md`, the count and the list
   of refusals in the harness paragraph, which the emit writes.
7. The handoff sequence of §Discipline.

**Deliverables:** the row; the decision and its reason; the cases; the
emitted hook; the write-backs.

**Acceptance criteria (all required)**

1. At the level `refuse`, the Stop hook's output for each state below is as
   the table says (`npm test -- --only harness-fixtures`). "Unfinished"
   means a journaled `resume: next`, `resume: fix`, `resume: verify` or
   `resume: final review` whose completion the order's control log does not
   hold.

   | State when the turn ends | The hook |
   | --- | --- |
   | Unfinished, and none of the rows below holds | prevents the end and gives a reason |
   | Unfinished, and the host reports the turn as already continuing from a Stop hook | lets it end |
   | Unfinished, and a background task of the session is running | lets it end |
   | Unfinished, and a plan is proposed and not approved | lets it end |
   | Unfinished, and `analysis:` or `operator override:` is on | lets it end |
   | The dispatch's completion is recorded, or the session holds no such dispatch | lets it end |

2. The reason the hook gives names the order's id and the dispatch phrase
   and says both courses: go on by the route the session would recommend,
   or say in one line what only the operator can do and end the turn
   (`npm test -- --only harness-fixtures`).
3. With `"stops": {"unfinished-turn": "advise"}` the hook lets the turn of
   the table's first row end and its line names the order and the
   unfinished dispatch; with `"off"` its output holds neither
   (`npm test -- --only harness-fixtures`).
4. In a root that sets no line for it, `npm run features -- list` shows
   `unfinished-turn` at `refuse`, in core and in an exported instance, with
   the line that changes it (`npm test -- --only harness-fixtures`).
5. `docs/KIT.md` under "Stops" states the row's three levels and that at
   `refuse` it denies only the end of a turn (`npm run test:docs`).
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only skeleton`, `npm test -- --only launchpad`.

**Evidence gate:** under `docs/evidence/WO-290/`: the decisions, with the
host page's sentences the output form was read from and the date read; the
hook's output for each row of criterion 1 as the cases record it; the
handoff. A live session in which the hook continued a turn is recorded if
one occurs during execution, and its absence fails nothing: the cases judge
the hook's output, and the host's page is the evidence for what the host
does with it.

**Write-back duty:** as step 6 lists. The release's Read before upgrading
names the row and the line that lowers it.

**Known issues and carry-ins:**

- The host ends a turn after eight continuations in a row whatever a hook
  says; this order's hook asks for one.
- Copilot reuses the Claude registration, and what it does with a Stop
  hook's output is unobserved. Where it ignores the output the turn ends as
  today.
- A session the operator told in plain words to stop is continued once and
  says so; the kit reads no such words.
- The register row this order settles: the one WO-288's criterion 40 files
  for a refusal of a turn's end.

**Non-goals:** any reading of the session's message; a second
continuation; the planner's, refuter's, router's or release close's turns;
Codex's adapter; a refusal of any tool call; a change to what completes a
dispatch.

**Operator-review assumptions:** the row stands at `refuse` in an instance
as in core, on the reading that it stops no work; the four dispatches named
are the ones it covers; and one continuation is enough.
