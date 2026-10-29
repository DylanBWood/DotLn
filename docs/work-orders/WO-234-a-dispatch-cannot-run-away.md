# WO-234 — A dispatch cannot run away: every role session carries a wall-clock bound and a complete-run bound read from the budgets file, the gate, the bounded wrapper and the lifecycle refuse to start past it, the hooks say where the session stands at every turn, an operator acceptance extends it on the record, and the meter reports every stop and what followed (v0.102.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. Two budget keys per dispatch kind with
their kit template, one shared reader, one refusal in the gate's host task,
one in the bounded wrapper, one in the lifecycle's re-dispatch, one new
control event with its `resume` route, a sixth hook refusal with its
security-document paragraph, two meter columns and one `plan failures`
block; no new operator phrase. Assigned at activation under the standing
opt-out default.
**Cost:** adds `scripts/lib/dispatch-bound.mjs` (new; reads the session
journal, the gate rows and the budgets, returns the dispatch's standing),
`dispatches.<role>.wallClockMs` and `.completeRuns` in
`docs/control/budgets.json` and `scripts/kit/budgets.template.json` with
their validation in `scripts/lib/process-budget.mjs`, the refusal in
`scripts/test-runner.mjs`'s `host` task, the refusal in
`scripts/lib/bounded-command.mjs`, the `accept-overrun` route and the
`DispatchBoundAccepted` event in `scripts/resume.mjs` and the control fold,
the standing line in the Stop hook and the sixth refusal in
`packages/skeleton/src/harness-host.ts`, the shared sentence in
`packages/skeleton/src/loadouts/contributor.ts` with its oracle re-mint,
`boundStops`, `boundAcceptances` and `afterStop` in `scripts/lib/meta.mjs`
and a `boundStops` block in `scripts/lib/plan-failures.mjs`, cases in
`scripts/test-runner.test.mjs`, `scripts/test-harness.mjs`,
`scripts/test-harness-fixtures` cases, `scripts/test-control-segments.mjs`
and `scripts/test-process-debt.mjs`, and sentences in product 07, the
security document, `CLAUDE.md`'s generated paragraph and the kit README.
Removes: the unbounded dispatch WO-192 ran (80,817,117 ms of executor wall
clock, 327,404,836 tokens, 109 gate steps and 17,144,915 ms of gate time in
one phase with no phase transition, stopped twice by the operator and never
by the system; WO-192's `meta.json` and decisions D076 and D084), and the
operator's attendance as the only stop. Wall-clock: one journal and gate-row
read per gate start, per probe start and per turn end (milliseconds);
nothing else. Context bytes: this file; every role's cold start grows by the
shared sentence of step 8, measured and recorded before and after. Commands:
`npm run resume -- accept-overrun` (new, agent-run from contextual operator authorization, before a run or after a stop);
`harness usage` gains the standing. Tokens: unknown until run. Steps: 11.
Re-mints: `harness-host.ts`, `harness-command.ts` and `contributor.ts` are
registered evidence sources, so the editions they stale are re-minted
deterministically. The operator's duration-presentation correction also changes
`gate-deadlines.mjs` and registers its formatter in `FEEDBACK_SOURCE_PATHS`,
so this execution owes one live feedback self-host episode and a new feedback
edition on those final judged sources. `test-runner.mjs`, `bounded-command.mjs` and
`process-budget.mjs` are declared sources of machinery suites, so `npm test
-- --review` runs before handoff; the role oracle is re-minted for the
shared sentence.
**Nomination provenance:** the operator's dispatch of 2026-10-26 (the pass's
capture in ignored intake, SHA-256
`6652d1057db77797fcba54da8d1998adb821528b42649a2d7d9a9c425bebbc72`, item 1:
more than twenty-four hours and still not complete); WO-192's D023 (the
meta-watcher the operator asked for: detect repeated failure or effort
without progress, give the operator or the system an intervention with
recorded authority, and judge whether interventions help), D076 and D084
(the two operator terminations and their reasons), and the 2026-10-24 pass's
known issue on WO-192 (the drive is trusted only after the record shows an
unattended run cannot consume the operator's budget in an afternoon or
continue down an unproductive path). Filed by the
[2026-10-26 pass](../planning/wo192-fixes-and-example-drift-2026-10-26.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition; no host is named beyond its generic form.
**Depends on:** WO-158 (closed, v0.49.0: the off-ramp routes whose typed
event, capture and refusal shape the acceptance route follows), WO-126
(closed: the budgets file, `readBudgets` and `budgetVerdict`), WO-144
(closed: the hook boundary and its five refusals, which gain a sixth),
WO-229 (closed, v0.93.0: the `host` structural task and the lane registry
the gate's refusal joins), WO-139 (closed: the session journal and usage
readback the standing reads). WO-192 is reference-only: its driven-run
stops (repair bound, incomplete bound, driven-session ceiling) bound a
router's workers and are unmerged; this order bounds the operator's own
dispatches and does not wait on them.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-158",
    "relation": "satisfied-by-close",
    "reason": "the off-ramp routes (typed event, operator capture with digest, legal-phase refusal, status projection) the accept-overrun route follows"
  },
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the budgets file, readBudgets and budgetVerdict that the two new keys and their acceptances extend"
  },
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the hook boundary and its five refusals, which this order extends by a sixth"
  },
  {
    "workOrderId": "WO-229",
    "relation": "satisfied-by-close",
    "reason": "the host structural task and the lane registry where the gate's bound refusal is judged"
  },
  {
    "workOrderId": "WO-139",
    "relation": "satisfied-by-close",
    "reason": "the session journal and the usage readback the standing is computed from"
  },
  {
    "workOrderId": "WO-192",
    "relation": "reference-only",
    "reason": "its driven-run stops bound a router's workers and are unmerged; its D023, D076 and D084 are this order's sources"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator recovery controls (the
four routes and their event shape; `analysis:` and `operator override:`),
§Preflight before the full gate (the six structural tasks; host admission;
the bounded wrapper's six-hour outer bound), §Discipline (stop the monitors
you started; two consecutive provider safeguard refusals), §Operator-opened
planning pass item 2 (`plan failures`: long phases and repeated gate runs);
`docs/control/budgets.json` (`dispatches`, `acceptances`, `unsetPolicy`);
`scripts/lib/process-budget.mjs` (`dispatchKinds` 6 to 13, `readBudgets` 14
to 60, `budgetVerdict` 62 to 72, `requireBudgets` 74); `scripts/lib/plan-failures.mjs`
(`longPhases` at 938: completed attempts above twice their phase median;
`repeatedGateRuns` at 945: product-gate rows at an identity already green;
the intervention classes at 672 and 786); `scripts/lib/bounded-command.mjs`
(the probe deadline and the six-hour outer bound, 11 to 13 and 44 to 46;
`deadlineMs` at 92); `scripts/test-runner.mjs` (the `host` structural task;
the lane registry; the gate row); `packages/skeleton/src/harness-host.ts`
(the prompt-hook record at 1250; the Stop hook advisory at 5689; the five
refusals); `scripts/lib/meta.mjs` (`usageByRole` and the `dispatches` rows
at about 1919 to 1960; `directions.byKind` at 922); `scripts/resume.mjs`
(`legalActions`, the off-ramp routes, `status --json`);
`docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19;
`docs/product/05-pattern-library.md` §Candidate role — Flow Steward (742)
and the trap table (353 and 356); WO-192's `docs/evidence/WO-192/meta.json`
and decisions D023, D076 and D084 in its worktree.

**Objective:** No dispatch runs past a bound the operator can read and
change. Each dispatch kind has a wall-clock bound and a complete-run bound
in the budgets file; the gate's host task refuses to start a complete or
review selection past either, the bounded wrapper refuses to start a probe,
the lifecycle refuses to re-dispatch the same phase, and under Claude the
hooks refuse a tool call that would start any of these, each naming the
bound, the standing and the two routes: `analysis:` to diagnose, or an
operator acceptance recorded by `npm run resume -- accept-overrun` with the
operator's captured words, which extends the bound for that order's phase
and nothing else. Focused reproductions (`--only`) and the lifecycle's
reads stay admitted, so a stop never locks out diagnosis. The Stop hook
prints the dispatch's standing at every turn so the operator sees the clock
without asking. The meter records every stop, every acceptance and the next
lifecycle event after each with its delay, and `plan failures` lists them,
so a planning pass reads whether a stop or an operator intervention helped,
which is the evaluation WO-192's D023 asked for, as data rather than as a
second lifecycle driver.

**Operator scope expansion (2026-10-28, WO-234-D002):** Present every
operator-facing duration in hours and minutes. Apply the shared formatter to
the changed admission, lifecycle, gate and meter output, including deadline
errors; retain exact numeric units in machine records. Regenerate the role
guidance and run the live feedback self-host required by the deadline-source
change before complete validation.

**Observed gap (dated 2026-10-26 at `main` `939af628`; WO-192's worktree read 2026-10-26T22:30Z):**

- WO-192's executor dispatch ran 80,817,117 ms (22.4 hours) of wall clock
  and 327,404,836 tokens in one phase, with 109 gate steps and 17,144,915
  ms (4.76 hours) of gate time, at least four complete reviews (number 18
  passed in 1,902.3 s; a later one failed in 1,900.6 s on an export-suite
  assertion; the next was refused by host memory after 1,622.9 s) and 45
  live-drive attempts of up to 4,500,000 ms each, and never left `active`
  (its `meta.json`, `usageByRole.executor`; D082, D083). The only stops
  were the operator's (D076 on the first session, D084 on the second, each
  with the operator's own assessment recorded). The 2026-10-24 pass's known
  issue on WO-192 asked for exactly this evidence before trusting a drive.
- The budgets file has no wall-clock or run-count key: `dispatches.<role>`
  carries `tokens` and `costUsd`, both `null` under the `unsetPolicy`
  ("Collect observed usage first"), and `readBudgets` validates only those
  and the cold-start ceilings (`process-budget.mjs` 30 to 36). No runtime
  reader consumes a dispatch ceiling: `harness-host.ts` reads `subagentCap`
  and the cold-start ceilings and nothing under `dispatches`;
  `budgetVerdict` is read by the meter after the fact. Observed usage now
  exists for 24 closed orders and one runaway.
- The signals exist only for planning. `plan failures` computes long phases
  (completed attempts above twice their phase median; medians over the
  record on 2026-10-26: implementation 4,927,430 ms, verification 1,042,596
  ms, final review 1,540,750 ms, repair 2,762,141 ms) and repeated gate runs
  (product-gate rows at an identity already green) from the committed
  record, after the order closes (938 to 950). Nothing reads them while the
  dispatch runs; WO-192's implementation attempt is 16.4 times its median.
- The gate bounds tasks, not dispatches: each task has its deadline, the
  bounded wrapper a 900-second probe deadline and a six-hour outer bound
  for a complete selection (`bounded-command.mjs` 11 to 13), the host task
  refuses memory pressure; a session may start the next run the moment one
  ends, and did.
- The driven-run stops WO-192 builds (repair bound, incomplete bound,
  `drivenSessionCeiling`, a phase timeout that is `null`) bound a router's
  workers; the attempt records show `drivenPhaseTimeoutMs: null` and the
  dollar limit scoped to phase workers. None bounds the operator's own
  executor, verifier or reviewer session, and the order is unmerged.
- D023's meta-watcher: the Flow Steward (product 05, 742) is a candidate
  role with no implementation; the operator asked for detection, an
  intervention with recorded authority, and an evaluation of whether
  interventions help; receipt 039 on WO-192 warned that a second lifecycle
  driver beside the resident invites disagreement.

**Design (scope discipline):**

- **The bound lives where the cost is paid.** The gate's host task, the
  bounded wrapper and the lifecycle's re-dispatch each read one shared
  standing (`dispatch-bound.mjs`: the session's role and dispatch start
  from its journal, the complete and review rows recorded for this checkout
  since that start, the budgets and any acceptance for this order and
  phase) and refuse past the bound in process, so the refusals hold under
  Codex and Copilot, whose tool calls are unhooked, as well as under
  Claude. Rejected: a watcher process that observes sessions and intervenes
  (axis: a second lifecycle driver, receipt 039's reopening condition on
  WO-192; the Flow Steward stays a candidate). Rejected: hook refusals
  alone (axis: Codex has no tool-call hooks; WO-192's sessions were Codex).
- **Two numbers, read from the record, owned by the operator.** Each
  dispatch kind gets `wallClockMs` and `completeRuns`. Implementation,
  verification, final review and repair select `local-median`: each consumer
  derives max(4 times its own completed phase median, 8 h 0 min), using
  8 h 0 min without history. Resolve history at the dispatch's original
  start so later completions cannot move a live bound. Export the policy,
  never this repository's observed durations. Explicit numeric overrides
  and null retain their meanings. Keep three complete
  runs per dispatch; release close, planner and refuter `null` until the
  record gives their medians. `null` disables a bound, as it does elsewhere
  in the file; the keys are the operator's to edit. The executor re-reads
  the medians at activation and records them. Rejected: a token or dollar
  bound now (axis: token counters are unavailable on some hosts, and the
  operator's unset policy on those keys stands; wall clock and gate runs are
  observed everywhere).
- **An acceptance is the extension, on the record.** `npm run resume --
  accept-overrun <wallClockMs|completeRuns> --ceiling <value> --reason
  <text> --capture <path> --capture-hash sha256:<digest> <actor-flags>`
  appends `DispatchBoundAccepted` to the order's control log, scoped to the
  order and its current phase, in the shape of WO-158's routes (the
  capture is the operator's own words at their digest; the order's own
  executor may record the operator's contextual authorization with its actual
  actor attestation and existing writer; no exact phrase, session exit or
  manual operator command is required). Early authorization to run as long
  as needed records `--ceiling unlimited` for both metrics, stored as null
  acceptance ceilings until the phase completes; the
  standing reads it; `status --json` projects it under `legalOffRamps` and
  `boundAcceptances`. Rejected: editing `acceptances` in the budgets file
  during a live gate (axis: a tracked gate input written mid-gate, which
  the gate refuses by design). Rejected: an automatic extension when the
  session is "making progress" (axis: a deterministic reading of progress
  does not exist; the planning screen refuses one).
- **The sixth refusal, and the standing at every turn.** Under Claude the
  PreToolUse hook refuses a tool call that starts a complete or review
  selection, a bounded probe or a worker launch past the bound with
  `DOTLN_DISPATCH_BOUND`, printing the standing and the two routes;
  `operator override:` suspends it as it does the other five; the Stop hook
  prints `dispatch standing: <elapsed> of <bound>; complete runs <n> of
  <bound>` each turn. The security document's boundary paragraph gains the
  sixth refusal and `CLAUDE.md`'s generated paragraph counts six. Rejected:
  refusing every tool call past the bound (axis: diagnosis and the
  lifecycle's reads must stay available; the stop is a stop on cost, not a
  lockout).
- **The evaluation is data in the meter.** `meta.mjs` records per order and
  per dispatch `boundStops` (count, metric, at), `boundAcceptances` and
  `afterStop` (the next lifecycle event and its delay); `plan failures`
  gains a `boundStops` block beside `longPhases`; the cost table carries
  the columns. A planning pass reads whether a stop was followed by a
  phase transition, a withdrawal or a repair, which answers D023's third
  question without a judge in the loop. Rejected: the watcher judging
  interventions itself (axis: D023's own warning; a judgment is a planning
  read of the record).
- **Codex and Copilot.** The in-process refusals hold; the shared role
  sentence states the bound, the standing command and the routes; the hook
  refusal and the turn-end standing are Claude's. Recorded as such in the
  security document.
- **Live-run surfaces at the base.** The host task's memory refusal: exists
  and refused twice on 2026-10-26. The bounded wrapper's deadlines: exist.
  The off-ramp routes and their capture shape: exist (WO-158). The session
  journal's `startedAt` and role: exist. The gate row's identity and time:
  exist. A dispatch standing: absent. A bound refusal anywhere: absent.

**Execution plan (the executor follows these steps in order; observed at `939af628`, 2026-10-26):**

1. `docs/control/budgets.json` and `scripts/kit/budgets.template.json`:
   `dispatches.<role>.wallClockMs` and `.completeRuns` for every
   `dispatchKinds` role: supported phases select consumer-local medians
   with the 8 h 0 min fallback; unsupported roles remain `null`; `scripts/lib/process-budget.mjs` `readBudgets` (14)
   validates numeric/null bounds and the consumer-local `local-median`
   wall-clock policy, and reads an absent key as `null`, so
   an export made before this order keeps `npm run meta`. Check: `npm test
   -- --only process-debt`; `npm test -- --only launchpad` (the update case).
2. `scripts/lib/dispatch-bound.mjs` (new): `dispatchStanding(root, {
   session })` reads the session journal (role, intent, `startedAt`), the
   gate rows recorded for the checkout since then (complete and review
   selections), the budgets and the order's `DispatchBoundAccepted` events,
   and returns `{ role, elapsedMs, wallClockMs, completeRuns, bound,
   acceptance, state: within|exceeded|unset }` with the two routes as text.
   Check: `npm test -- --only harness` (cases: within, exceeded on each
   metric, `null`, accepted, no journal).
3. `scripts/test-runner.mjs` `host` task: refuse to admit a complete or
   review selection when the standing is `exceeded`, naming the metric, the
   value, the bound and the routes; a focused `--only` selection is
   admitted; a stopped row records `boundStop: { metric, value, bound }`.
   Check: `npm test -- --only runner-fixtures`.
4. `scripts/lib/bounded-command.mjs`: refuse to start a probe past the
   bound with the same message. Check: `npm test -- --only harness`.
5. `scripts/resume.mjs`: `accept-overrun` (the route of the Design), legal
   in `active`, `needs-fix`, `repairing`, `verifying` and `final-review`,
   recorded in-session by the current agent, including the executor, from
   contextual operator authorization; `--ceiling unlimited` admits an
   early as-needed run for each metric. It is projected in `status --json`; `next` and `fix` refuse to re-dispatch a phase whose last
   dispatch ended `exceeded` without an acceptance, naming the route; the
   control fold validates `DispatchBoundAccepted`. Check: `npm test --
   --only checkpoint`; `npm test -- --only work-orders-fixtures`; the
   control-segment cases in `scripts/test-control-segments.mjs`.
6. `packages/skeleton/src/harness-host.ts`: the sixth refusal in the
   PreToolUse judgment (a Bash call that starts `npm test` without `--only`,
   `harness bounded`, or a worker launch, past the bound), its
   `DOTLN_DISPATCH_BOUND` reason, suspension under `operator override:`; the
   Stop hook's standing line beside the advisory at 5689; `harness usage`
   prints the standing. Check: `npm test -- --only harness-fixtures`; `npm
   test -- --only skeleton`.
7. `scripts/lib/meta.mjs` and `scripts/lib/plan-failures.mjs`: `boundStops`,
   `boundAcceptances` and `afterStop` per order and per dispatch in the
   meter and the cost table; the `boundStops` block in `plan failures`.
   Check: `npm test -- --only meta`; `npm test -- --only plan-refutation`.
8. `packages/skeleton/src/loadouts/contributor.ts`: the shared sentence
   every role carries (the `targetRoles` procedure, 553): the dispatch has a
   wall-clock and a complete-run bound in the budgets file, the standing is
   read with `harness usage <session>`, a stop names `analysis:` and
   `accept-overrun`, and no role runs a gate, probe or worker past the bound
   without the acceptance. Then `npm run build && node scripts/harness.mjs
   emit`; the role oracle fixture `packages/skeleton/fixtures/wo234-role-baseline.json`
   from the latest one with the chain intact; the decisions record each
   root's cold-start bytes before and after. Check: `npm run harness --
   check`; `npm test -- --only harness`; `npm test -- --only process-debt`.
9. `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19
   and the generated `CLAUDE.md` paragraph in `packages/compiler/src/harness.ts`
   (the five refusals become six, with the Codex row stated). Check: `npm
   run harness -- check`; `npm run publication:check`.
10. Write-backs: product 07 §Operator recovery controls (the bound, the
    standing, the acceptance route as a fifth route), §Preflight before the
    full gate (the host task's refusal; the wrapper's refusal), §Operator-opened
    planning pass item 2 (`plan failures` lists bound stops and what
    followed); `scripts/kit/README.client.md` (the keys and the route);
    `docs/evidence/WO-234/decisions.md` (the medians read at activation and
    the seeds); `npm run meta`; `node scripts/lineage.mjs index --check`;
    `node scripts/check-publication.mjs --print-locks`; `npm run
    publication:check`.
11. Handoff: finish source edits; `npm run format` and `npm run sync`; start
    one `npm test -- --review` in the background, never under the bounded
    wrapper, and await it with `node scripts/harness.mjs evidence --wait`;
    after it passes, complete `docs/evidence/WO-234/handoff.md`; `npm run
    test:docs` once after the last document edit; then `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the two keys and their template and validation; the
standing reader; the three in-process refusals; the acceptance route and
its event; the sixth hook refusal and the turn-end standing; the shared
role sentence and the re-minted oracle; the meter columns and the `plan
failures` block; the write-backs.

**Acceptance criteria (all required)**

1. `docs/control/budgets.json` and the kit template carry `wallClockMs` and
   `completeRuns` for every dispatch kind, with consumer-local median policy
   and its 8 h 0 min floor recorded in the decisions; `readBudgets` validates them, reads an absent
   key as `null`, and an export made before this order passes `npm run meta`
   after an update.
2. `dispatchStanding` returns `within`, `exceeded` or `unset` from the
   session journal, the gate rows since the dispatch start, the budgets and
   the order's acceptances; cases cover each state, each metric, a `null`
   bound, an acceptance and a missing journal.
3. The gate's host task refuses a complete or review selection past either
   bound, naming the metric, the value, the bound, `analysis:` and the
   acceptance command, and records the stop on the row; a focused `--only`
   selection is admitted; the paired control at the base admits the same
   selection, both arms' exit codes in `docs/evidence/WO-234/controls.json`.
4. The bounded wrapper refuses to start a probe past the bound with the same
   message; a probe within the bound runs as today.
5. `npm run resume -- accept-overrun` appends `DispatchBoundAccepted` with
   the operator's capture digest, scoped to the order and phase, admits the
   executor recording contextual operator authorization with its current
   writer, supports early as-needed ceilings, refuses outside its legal
   phases, and is
   projected in `status --json`; `next` and `fix` refuse to re-dispatch a
   phase whose last dispatch ended `exceeded` without one, and admit it
   with one.
6. Under Claude a tool call that starts a complete or review selection, a
   bounded probe or a worker launch past the bound is refused with
   `DOTLN_DISPATCH_BOUND` and the routes; reads and `--only` reproductions
   are admitted; `operator override:` suspends it; the Stop hook prints the
   standing every turn; `harness usage` prints it; fixtures cover the three
   starts and the override.
7. The meter records `boundStops`, `boundAcceptances` and `afterStop` per
   order and dispatch; the cost table carries them; `plan failures` lists
   the block; a fixture record with one stop followed by a repair shows the
   delay.
8. Every generated role root states the bound, the standing command and
   the routes; the role oracle fixture pins the roots with its chain intact;
   the decisions record each root's cold-start bytes before and after.
9. The security document and the generated `CLAUDE.md` paragraph state six
   refusals with the Codex and Copilot rows; `npm run harness -- check` is
   green.
10. Product 07 and the kit README state the mechanism as built (step 10);
    `npm run publication:check`, `npm test -- --review` and `npm run
    test:docs` green; `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only process-debt` and `npm test -- --only
launchpad` for step 1; `npm test -- --only harness` for steps 2, 4 and 8;
`npm test -- --only runner-fixtures` for step 3; `npm test -- --only
checkpoint` and `npm test -- --only work-orders-fixtures` for step 5;
`npm test -- --only harness-fixtures` and `npm test -- --only skeleton` for
step 6; `npm test -- --only meta` and `npm test -- --only plan-refutation`
for step 7; `npm test -- --only configuration-root` for every script step;
`npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases and controls of criteria 1 to 9; the
deterministic re-mints of the editions `harness-host.ts`,
`harness-command.ts` and `contributor.ts` stale; the re-minted role oracle;
`npm test -- --review` before `implementation-ready`, final review reusing
the passing complete row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 10 and criteria 9 and 10.

**Known issues and carry-ins:**
- FUP-02446577ce028d06 (WO-192-D023, the routed-run meta-watcher) is this
  order's source; its register row lives in WO-192's uncommitted worktree,
  so the filing pass allocates it in prose and on its own candidate row; the
  pass after WO-192's merge or withdrawal disposes the row (reopen: WO-192
  merges or is withdrawn). The watcher's two first questions (detection and
  an intervention with recorded authority) are met by the bound and the
  acceptance; its third (do interventions help) is met as meter data read
  by planning, not as a judge; reopen when a pass reads the `boundStops`
  block and cannot answer it.
- FUP-0104 (the Flow Steward) stays a candidate: this order adds no
  supervisor role (reopen: a planning pass names a consumer scenario for a
  steward beyond a bound).
- The default is max(4 times each consumer's own phase median, 8 h 0 min),
  with an 8 h 0 min fallback and a dispatch-start cutoff; a bound the operator
  changes is the operator's record in the budgets file (reopen: a dispatch
  stops within its median, or two consecutive closes record an acceptance
  on the same metric).
- The three drafts the operator declined on 2026-10-17 (FUP-94c0c0235e3aea67)
  included a time-budgeted gate; this order bounds a dispatch, not a gate
  task, and changes no task deadline; the filing pass records the
  distinction (reopen: the operator reads this order as the declined draft).
- WO-192's driven runs: when WO-192 lands, a router's phase workers are
  dispatches of their role and carry these bounds beside the driven-session
  ceiling; the router itself is the `router` dispatch kind WO-192 adds, and
  its keys follow the same shape (reopen: WO-192's close finds the shapes
  disagree).

**Non-goals:** token or dollar bounds; a watcher process or role; changing
any task deadline or the host-memory admission; bounding a planning pass or
a refuter (`null` until their medians exist); WO-192's router and its
driven-run stops; the residue of WO-233.
