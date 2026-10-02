# WO-192 — One session drives an order through its whole lifecycle: a router that only routes starts a fresh worker for each phase and hands it nothing but the phrase (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A new role and operator phrase, a
lifecycle identity per spawned worker, a sub-agent budget per phase
worker, and generated agent definitions per role; the four existing
phrases keep their behavior. Assigned at activation under the standing
opt-out default.
**Cost:** adds a `router` role and the phrase `drive: WO-NNN` to the
Contributor build (`packages/skeleton/src/loadouts/contributor.ts`), one
generated agent definition per lifecycle role and effort an open order
names, from the generator and check rule WO-187 adds for spawned workers
(`packages/compiler/src/harness.ts`), a session record, role and
writer reservation keyed by session and agent
(`packages/skeleton/src/harness-host.ts`), a sub-agent count kept per
spawning worker (`packages/skeleton/src/subagent-budget.ts`), a refusal
of any router spawn whose prompt is not a lifecycle phrase, a worktree
root grant for the worker whose order owns that worktree, and a
`route` reading of the canonical status (`scripts/resume.mjs`). Removes:
the operator typing one phrase per phase into a separate terminal and
carrying each handoff by hand (at least four sessions for an order that
passes first time: execute, verify, final review and release close; more
for each repair), and on a host that meters only the main thread, the
phase work itself, which then runs in workers. The router's own context
holds statuses, not work. Re-mints: `harness-host.ts`,
`subagent-budget.ts`, `harness.ts` and `contributor.ts` are registered
evidence sources, so the editions they stale are re-minted
deterministically; none is a file the feedback verifier judges, so no
live feedback episode; all are declared machinery sources, so
`npm test -- --review` runs before handoff. One live driven order is
paid in worker tokens (criterion 9). Cold-start bytes: a new root for
the router; the other roots are unchanged. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, items 1,
12 and 16 (captured in ignored intake; SHA-256 in the ledger section of
that date); the founding ledger's preserved ideas of a main thread that
only directs traffic and of dispatch through sub-agents where a host
caps only the main thread (`docs/lineage/idea-ledger.md`, the founding
blueprint); WO-139 D003, whose reopening condition (a parent join
available before or at a child's first call) is tested by criterion 1;
the 2026-10-02 planning pass's reading of the dispatch hook, the
sub-agent counter and the host's documented agent mechanics
([planning document](../planning/standard-pass-2026-10-02.md) §8).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: applies; the constrained managed host is named only in generic
terms, no fact about any such host is recorded here, and what such a
host meters is observed by the instance's own first order, never by
this one.
**Depends on:** WO-187 (the generated agent definition for spawned
workers, which this order extends to one per role); WO-139 merged (the
sub-agent counter; closed); WO-135 merged (the writer reservation;
closed); WO-130 merged (the phrase records its own dispatch; closed);
WO-158 merged (off-ramps the router stops for; closed).
**Recommended placement:** after WO-118, first of the three orders that
make a starter instance workable on a constrained managed host; the
operator's notes ask for it once the starter exists, and the loop from a
starter instance is placed ahead so that no instance order waits in
front of the product exit. It has no
dependency on the export orders: a build that already carries the
router is exported with it, and an earlier export receives it through
WO-077's update. It may move into the machinery lane after WO-188 at
the operator's word, because it would also end the operator's own
phase-by-phase dispatch here. This order edits `harness-host.ts`,
`subagent-budget.ts`, `harness-command.ts`, `contributor.ts`,
`packages/compiler/src/harness.ts`, `scripts/resume.mjs`,
`scripts/harness.mjs`, product 07, product 05 and
`docs/AI-HARNESS-SECURITY.md`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-187",
    "relation": "hard",
    "reason": "the generated agent definition with a pinned model and effort, extended here to one per lifecycle role"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the sub-agent counter this order keys by spawning worker"
  },
  {
    "workOrderId": "WO-135",
    "relation": "satisfied-by-close",
    "reason": "the writer reservation this order keys by session and agent"
  },
  {
    "workOrderId": "WO-130",
    "relation": "satisfied-by-close",
    "reason": "phrase dispatch and the briefing a worker receives"
  },
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the off-ramps and recovery controls the router stops for"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator resume phrases
(the phrase table, the dispatch the phrase records, and the paragraph
on the external-effect authority of final review and release close),
§Independent workflows and integration, §Operator recovery controls and
§Model-specific notes; `docs/PLAYBOOK.md` (implementer and verifier are
different actors; a session identifier alone is not independence);
`packages/skeleton/src/harness-host.ts` (session record, role
resolution, writer identity, outside-write judgment);
`packages/skeleton/src/subagent-budget.ts`;
`docs/evidence/WO-139/decisions.md` D003 and the probe records beside
it; `scripts/resume.mjs` (legal actions by phase; `status --json`;
`briefing`); `scripts/harness.mjs` (`begin`, `writer --show`,
`usage`); `scripts/worktree.mjs` (`start`, `publish`);
`docs/AI-HARNESS-SECURITY.md` (effort attestation for spawned agents);
product 05 (the orchestration policies); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§8.

**Objective:** The operator types one phrase naming an order and one
session carries it from its current phase to a pull request ready to
merge, then, typed again after the merge, through release close. That
session only routes: every phase is done by a fresh worker that
received the phrase and nothing else, runs its own dispatch, keeps its
own sub-agent budget and records its own completion.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- One phrase dispatches one role in one terminal, typed by the operator;
  nothing chains phases. `worktree start` ends by printing the next
  phrase for the operator to enter by hand.
- Role resolution and automatic dispatch happen only in the prompt and
  session hooks. A spawned agent receives neither: no hook is registered
  for an agent's start, and the hook that resolves a phrase reads the
  operator's prompt.
- The session record, the role and the writer identity are all keyed by
  the root session's identifier, which every spawned agent shares; each
  operator prompt resets the role.
- The sub-agent counter is one per root session: every descendant of
  every worker would count against one budget of twenty. WO-139 D003
  declined to attribute a child to a parent because the child's hook
  payloads named no spawner, and reopens when a parent join becomes
  available.
- The host's documentation, read on 2026-10-02 for the installed
  version, says a tool call made inside a spawned agent carries that
  agent's identifier and type, that an agent definition can pin model,
  effort and preloaded skills, that agents nest, and that an agent's
  start cannot be refused while its spawning tool call can. None of
  this has been probed in this repository at that version: it is the
  design's premise and criterion 1 tests it.
- An order's worktree is a sibling directory of the main checkout;
  default roles are granted only temporary and scratch roots outside
  their own checkout.
- A passing final review sets the phase to closed; whether the release
  was closed is read from local tags and an ignored local record, not
  from the control log. From the log alone a running phase and an
  interrupted one look the same.
- The resident and the portfolio drive target orders through runtime
  actors; none of that drives this repository's own role lifecycle.

**Design (scope discipline):**

- **Probe first.** Before any mechanism: on the installed host version,
  record what a tool call inside a spawned agent carries (agent
  identifier, type, effort), whether the spawning call inside a worker
  names that worker, whether a worker can write in a directory added
  after the session started, and whether a definition's pinned effort
  is the effort the host reports. The design below stands on those
  rows. Where a row fails, the order takes the fallback named at the
  end of this section and says so; it does not build on an unobserved
  behavior.
- **The router role.** `drive: WO-NNN` selects it. Its whole procedure:
  read `npm run resume -- status --json` for the order; take the one
  routable action; spawn the worker for that action by its generated
  agent type with the phrase as the entire prompt; wait; read the status
  again; repeat. It reads no order, diff, report or log, edits nothing,
  and never passes one worker's output to another. It reports each
  transition in one line.
- **What a worker is handed.** The phrase and the order identifier. A
  hook refuses a spawn from the router role whose prompt is anything
  else. The worker's definition preloads its role skill and pins the
  model and effort the order names for that role; the worker runs the
  lifecycle command and `briefing` itself, as a Codex session does
  today, and records its own completion.
- **Identity per worker.** The session record, the role, the effort
  attestation and the writer reservation are keyed by session and
  agent. The router holds no writer. A worker's reservation is released
  by its completion or by the router's recorded observation that the
  worker ended.
- **A budget per worker.** A spawn is counted against the agent whose
  tool call made it. Each phase worker has the configured cap for its
  own descendants; the router has its own count of phase workers. The
  root-wide total is bounded as well: `docs/control/budgets.json` gains
  a ceiling for a driven session, by default the cap times the four
  lifecycle phases, and a drive that reaches it stops.
- **Where work happens.** The router runs in the main checkout. A worker
  for an order with a worktree is granted that worktree's root by a
  grant kind derived from the order's recorded worktree, never from the
  prompt.
- **Stops, each with the next step in one line.** A pull request waiting
  for the operator's merge; a finding routed to the operator; an
  off-ramp or a typed correction; `analysis:` or `operator override:`;
  a refused dispatch; three verification failures or two final-review
  failures on one order; a worker that ended without recording its
  completion twice in the same phase; an exhausted budget.
- **Re-entry.** The same phrase continues from the canonical status. A
  phase recorded as dispatched and not completed is resumed in its
  worker if that worker is still addressable, and otherwise
  re-dispatched: the phrase finds the dispatch recorded and gives a
  fresh worker the same briefing. After the merge the phrase runs
  release close from the main checkout and finishes when a local
  release tag names the order or its close records a no-release
  disposition.
- **Authority.** `drive: WO-NNN` carries what `resume: final review`
  carries (commit the reviewed state, push the order's branch, open the
  pull request) and, typed again after the merge, what
  `resume: release close` carries. The router never merges.
- **Independence.** A worker started fresh with only the phrase has no
  context from the executor's session. The order records this as the
  rule's reading for driven orders and leaves the four phrases as they
  are for anyone who wants separate sessions.
- **Other harnesses.** Under Codex the router is role text over the
  spawn call's model and effort arguments, without the hook refusals,
  as the cap is today; under Copilot it is advisory. Both rows are
  recorded as untested unless a probe runs.
- **Fallback if a probe row fails.** Each phase worker is a separate
  root session started through the existing print transport in the
  order's worktree, which needs no identity or counter change; what a
  metered host counts for such a session is then the instance's
  question.
- **Declined alternatives, recorded:** a resident coordinator (product
  03 says the automation direction adds none, and the resident's actors
  run commands, not role sessions); letting the router read reports to
  decide what to do (it would carry one worker's judgment into the
  next; the canonical status is the only input); disabling the cap for
  a driven session (it removes the bound the operator asked each worker
  to have); a control event for release close (the tag is the record);
  driving several orders at once (one order per phrase; lane pairs use
  two routers in two sessions).

**Deliverables:** the probe rows; the router role, phrase and generated
root; the per-role agent definitions; the identity, reservation, budget
and grant changes with fixtures; the spawn-prompt refusal; the `route`
status reading; one live driven order; the write-backs below.

**Acceptance criteria (all required)**

1. `docs/evidence/WO-192/host-probe.json` records, for the installed
   host version, each behavior named under "Probe first" as observed,
   absent or untestable, with the payload fields seen. The decisions
   state which design the rows select, and every later criterion is met
   in that design.
2. `npm run resume -- status --json` gains a `route` object naming at
   most one routable action, the role that performs it, and otherwise a
   stop reason from the listed set; a table test covers every phase,
   each stop, a merged and an unmerged pull request, and a closed order
   with and without release evidence.
3. `drive: WO-NNN` in a fixture session selects the router role and
   records no lifecycle transition of its own; the generated router root
   states the whole procedure; `npm run harness -- check` is green and
   fails when a generated agent definition's model, effort or skill is
   edited by hand. One generator and one check rule produce and validate
   every agent definition in the bundle, WO-187's among them.
4. A spawn from the router role whose prompt is not exactly a lifecycle
   phrase with the order identifier is refused with a typed reason; a
   spawn with the phrase is admitted; a worker's own spawns are not
   judged by this rule. Fixtures cover the three, and the first fails
   against `08845c71`.
5. Two fixture workers in one root session hold separate session
   records, roles and effort attestations; the second cannot write while
   the first holds the worktree's reservation; a worker's recorded
   completion releases it; `harness writer --show` names the holding
   agent.
6. A spawn made by a worker counts against that worker; a worker at its
   cap is refused while the router and another worker are not; the
   root-wide total is reported and refused at the driven-session
   ceiling; the unattributable case is counted as a stated minimum, as
   today.
7. A worker for an order with a recorded worktree may write under that
   worktree's root and is refused under another order's; the grant
   appears in the worker's role record with its source.
8. Table tests cover re-entry: resume of an addressable worker,
   re-dispatch of an interrupted phase with the same briefing, the
   repair loop to its bound, each listed stop, and release close after
   an observed merge.
9. One order is driven live in a scratch clone with a local remote from
   `active` to a passing final review by one session: the record shows
   one phrase typed, each phase's worker, model and effort as the host
   reports them, each worker's sub-agent count, and usage split between
   the router and its workers as far as the host exposes it. Publication
   and release close are covered by criterion 8's fixtures, not by this
   run.
10. Write-backs: product 07 §Operator resume phrases gains the phrase
    and the authority sentence; product 05's orchestration policies name
    the router as their first host binding; `docs/AI-HARNESS-SECURITY.md`
    states the per-agent identity and what stays root-wide; `docs/PLAYBOOK.md`
    states the independence reading; the decisions file and index; the
    harness manifest's refusal list; the publication locks refreshed.
11. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Evidence gate:** the probe record; the fixtures and table tests of
criteria 2 to 8; the live run of criterion 9 with its usage record; the
deterministic re-mints; `npm test -- --review` before
`implementation-ready` and again at final review.

**Write-back duty:** as listed in criterion 10.

**Known issues and carry-ins:**

- WO-139's counter treats an unresolved overlap between a direct spawn
  and a child's first call as a reported minimum; that stays.
- A dead Codex writer still needs the operator's release; the router
  stops there.
- The process-wide effort variable names the root's effort inside a
  spawned agent's shell; the attestation for a worker must come from
  the worker's own hook payload or definition, never from that
  variable.
- The executor's cold-start bytes already exceed the planning
  condition's predicate, an operator-reserved question; a worker's
  preloaded skill is the same root and changes nothing there.
- WO-187's single agent definition for spawned workers stays for
  adversaries, readers and research workers.
- Receipt 038: budgets per worker alone would leave a driven session's
  total unbounded; criterion 6 adds the ceiling. Reopen if a drive
  records a root-wide total above it, or a host usage limit stops a
  drive.
- Receipt 038: WO-187 and this order both generate agent definitions in
  one source file; criterion 3 requires one generator and one check
  rule. Reopen if the bundle holds definitions from two generators.

**Non-goals:** merging a pull request; driving more than one order per
phrase; any scheduler or queue; observing or naming what a particular
managed host meters; changing what any phase does; the resident, the
portfolio or target orders; a control event for release close.

**Operator-review assumptions**

1. The phrase is `drive: WO-NNN`, and it carries the authority of the
   phrases it dispatches, including release close when typed again
   after the merge.
2. A fresh worker that was handed only the phrase satisfies the rule
   that the implementer and the verifier are different actors.
3. Each phase worker gets the configured sub-agent cap for itself; the
   router's own count of phase workers has the same cap.
4. If the host does not expose what the design needs, the fallback of
   one separate session per phase is delivered instead, and the order
   says which.
5. This order is placed after WO-118 because the notes ask for it once
   the starter exists and the product exit should not wait behind it;
   nothing in it depends on the export.
