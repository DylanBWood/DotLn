# WO-290 — A turn that leaves a dispatch unfinished goes on once (version assigned at activation)

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-288",
    "relation": "satisfied-by-close",
    "reason": "its Part F has the Stop hook's line name a dispatch that has not recorded its completion, which this order's decision reads"
  },
  {
    "workOrderId": "WO-289",
    "relation": "satisfied-by-close",
    "reason": "the rule on turns, whose two courses the reason given to the session repeats"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. Where a session ends its turn while its
lifecycle dispatch has recorded no completion and nothing the kit can
observe needs the operator, the Stop hook has the session go on, once, and
tells it why. This is a feature an owner elects, `continue-unfinished-turn`,
on unless a root turns it off. It adds no stop: it denies no tool call,
fails no check and declines no command's job, and the one thing it holds
back, for one turn, is a session's own stop. Assigned at activation under
the standing opt-out default.
**Cost:** adds one decision to the Stop hook, one feature and its default,
one reason text and about eight cases; adds to a session that stops early
one continued turn, whose tokens are unknown until run. Removes nothing.
`packages/skeleton/src/harness-host.ts` and
`packages/skeleton/src/observed-facts.ts` are registered evidence sources:
the editions they stale are re-minted with `npm run sync`. No file of
`FEEDBACK_SOURCE_PATHS` is edited. One complete review run at handoff.
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
**Depends on:** WO-288 and WO-289, as the block above types them.
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
- The kit's table of stops gives a row a level by its class
  (`stopDefault` in `packages/skeleton/src/stops.mjs`): a row that is not
  of class `work` advises in an instance, and class `work` means loss or
  exposure that cannot be undone. A turn that ends early is neither, so a
  row of that table would stand at `advise` exactly where an instance's
  sessions need it on. The kit's other hook-held order of work,
  plan-first, is a feature with a switch of its own
  (`scripts/lib/feature-registry.mjs`).

**Design (scope discipline):**

- **The decision reads recorded state and never the session's words.** The
  hook continues a turn when all of these hold: the session's journaled
  dispatch is `resume: next`, `resume: fix`, `resume: verify` or
  `resume: final review`; the order's control state shows that dispatch's
  phase not yet completed; the host does not report the turn as already
  continuing from a Stop hook; no background task of the session is
  running; no plan is proposed and unapproved; and neither `analysis:` nor
  `operator override:` is on. In every other state the turn ends, which is
  what happens in all of them now.
- **Once.** A second stop in a row ends the turn. A session that was told
  to pause, or that only the operator can unblock, therefore spends one
  short turn saying so.
- **The reason is the rule.** It names the order and the dispatch, says
  that nothing recorded needs the operator, and gives the two courses of
  the rule `turns`: take the route you would recommend and go on, or say in
  one line what only the operator can do and end the turn.
- **A feature, on unless turned off.** `continue-unfinished-turn` is a row
  of the features page, in core and in an instance, with
  `"features": {"continue-unfinished-turn": false}` as the line that turns
  it off. Off, the hook's line names the unfinished dispatch, as WO-288
  leaves it, and the turn ends.
- **Hosts.** The form of the hook's output is the executor's, read from the
  host's page at execution. Codex keeps its adapter. A host that ignores
  the output ends the turn as it does now.

Rejected:

- _A row of the table of stops with a level._ It differs on which control
  the owner turns. By the table's own rule the row would advise in an
  instance, where it is needed on; and giving it the class that refuses
  everywhere would call an early stop a loss that cannot be undone, which
  it is not.
- _Deciding from the session's last message_, by reading whether it ends in
  a question. It differs on what is read, recorded state or prose: no
  criterion of this kit rests on a deterministic reading of natural
  language, and a question is sometimes the right end of a turn.
- _Continuing until the dispatch completes._ It differs on how many times
  the hook insists. A session that must stop would be held in a loop that
  only the operator's interrupt ends, which is the cost this order exists
  to remove.
- _The planner, the refuter, the router and the release close._ They differ
  on what a turn's end means: a planning session converses, a router stops
  by design at each of its stops, and a close hands the operator a command
  when the host declines its publish.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** The plan is to be read against WO-288's and
WO-289's merged text. A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `scripts/lib/feature-registry.mjs`: the feature
   `continue-unfinished-turn`, instance scope, default on, with what it
   does and the line that turns it off. Check: a case in
   `scripts/test-features.mjs` that reads the row from the features page of
   a fixture root and of an exported instance.
2. `packages/skeleton/src/harness-host.ts`, the `finish` path: one function
   that takes the Stop input, the session's journaled dispatch and the
   order's control state and returns continue or end, with the reason, as
   the Design's first bullet lists. Check: one case for each row of
   criterion 1's table in `scripts/test-harness.mjs`.
3. `harness-host.ts`, the same path: with the feature on, the hook's output
   prevents the stop in the form the host's page gives and journals the
   continuation; with it off, the status line names the unfinished
   dispatch and the turn ends. Check: two cases in
   `scripts/test-harness.mjs`.
4. `packages/skeleton/src/observed-facts.ts`: the comment and the status
   line that say the Stop hook never blocks, corrected to what it now does.
   Check: the case of step 3 reads the line.
5. `node scripts/harness.mjs emit`, then `npm run sync` and `npm run meta`.
6. Write-backs: `docs/KIT.md`, "What each feature does" and "The feature
   table" (the feature, its default and its line);
   `docs/product/07-execution-guide.md`, "Discipline" (what the kit does
   when a turn ends with a dispatch unfinished).
7. The handoff sequence of §Discipline.

**Deliverables:** the feature; the decision and its reason; the cases; the
emitted hook; the write-backs.

**Acceptance criteria (all required)**

1. With the feature on, the Stop hook's output for each state below is as
   the table says (`npm test -- --only harness-fixtures`). "Unfinished"
   means a journaled `resume: next`, `resume: fix`, `resume: verify` or
   `resume: final review` whose completion the order's control log does not
   hold.

   | State when the turn ends                                                         | The hook                            |
   | -------------------------------------------------------------------------------- | ----------------------------------- |
   | Unfinished, and none of the rows below holds                                     | prevents the end and gives a reason |
   | Unfinished, and the host reports the turn as already continuing from a Stop hook | lets it end                         |
   | Unfinished, and a background task of the session is running                      | lets it end                         |
   | Unfinished, and a plan is proposed and not approved                              | lets it end                         |
   | Unfinished, and `analysis:` or `operator override:` is on                        | lets it end                         |
   | The dispatch's completion is recorded, or the session holds no such dispatch     | lets it end                         |

2. The reason the hook gives names the order's id and the dispatch phrase
   and says both courses: go on by the route the session would recommend,
   or say in one line what only the operator can do and end the turn
   (`npm test -- --only harness-fixtures`).
3. With `"features": {"continue-unfinished-turn": false}` the hook lets the
   turn of the table's first row end, and its line names the order and the
   unfinished dispatch (`npm test -- --only harness-fixtures`).
4. In a root that makes no election, `npm run features -- list` shows
   `continue-unfinished-turn` on, in core and in an exported instance
   (`npm test -- --only configuration-root`).
5. `docs/KIT.md` states the feature, its default and that it holds back
   only the end of a turn, once (`npm run test:docs`).
6. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`,
`npm test -- --only configuration-root`, `npm test -- --only skeleton`,
`npm test -- --only launchpad`.

**Evidence gate:** under `docs/evidence/WO-290/`: the decisions, with the
host page's sentences the output form was read from and the date read; the
hook's output for each row of criterion 1 as the cases record it; the
handoff. A live session in which the hook continued a turn is recorded if
one occurs during execution, and its absence fails nothing: the cases judge
the hook's output, and the host's page is the evidence for what the host
does with it.

**Write-back duty:** as step 6 lists. The release's Read before upgrading
names the feature and the line that turns it off.

**Known issues and carry-ins:**

- A driven phase of an order against a target runs under the target
  worktree's guards, which journal no dispatch, so the continuation does
  not reach it. An attended session started in the launchpad is reached.
- The host ends a turn after eight continuations in a row whatever a hook
  says; this order's hook asks for one.
- Copilot reuses the Claude registration, and what it does with a Stop
  hook's output is unobserved. Where it ignores the output the turn ends as
  it does now.
- A session the operator told in plain words to stop is continued once and
  says so; the kit reads no such words.
- The register row this order settles: the one WO-288's criterion 40 files
  for a refusal of a turn's end.

**Non-goals:** any reading of the session's message; a second
continuation; the planner's, refuter's, router's or release close's turns;
Codex's adapter; a refusal of any tool call; a row of the table of stops; a
change to what completes a dispatch.

**Operator-review assumptions:** the feature is on by default, in an
instance as in core; the four dispatches named are the ones it covers; and
one continuation is enough.
