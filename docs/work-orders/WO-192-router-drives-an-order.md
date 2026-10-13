# WO-192 — One session drives an order through its whole lifecycle: a router that only routes starts a fresh worker for each phase and hands it nothing but the phrase, for the launchpad's own orders and for a registered target's, whose phase workers run in the target worktree under WO-049's bundle (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A new role and operator phrase, a
lifecycle identity per spawned worker, a sub-agent budget per phase
worker, generated agent definitions per role, the executor role's
preflight discipline, and a target-order branch in the executor, verifier
and reviewer roles; the four existing phrases keep their behavior. Assigned at activation under the standing
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
`route` reading of the canonical status (`scripts/resume.mjs`), and, in
`contributor.ts` (step 9), the preflight discipline in the executor's
ordered procedure and the target-order branch of the executor, verifier and
reviewer procedures. Removes:
the operator typing one phrase per phase into a separate terminal and
carrying each handoff by hand (at least four sessions for an order that
passes first time: execute, verify, final review and release close; more
for each repair), and on a host that meters only the main thread, the
phase work itself, which then runs in workers; by step 9, full gate runs
an executor would otherwise repeat with no relevant change or diagnosed
invalidation of their evidence; and, for a target order, the launchpad
`npm test` the role text still names, which WO-210's claims no longer
accept for that order.
The router's own context holds statuses, not work. Re-mints: `harness-host.ts`,
`subagent-budget.ts`, `harness.ts` and `contributor.ts` are registered
evidence sources, so the editions they stale are re-minted
deterministically; none is a file the feedback verifier judges, so no
live feedback episode; all are declared machinery sources, so
`npm test -- --review` runs before handoff. One live driven order is
paid in worker tokens (criterion 9). Cold-start bytes: a new root for
the router, and the executor, verifier and reviewer roots grow by step 9's
text; the other roots are unchanged. Commands: one operator phrase, `drive: WO-NNN`, and the
probe mode `--agent-identity` of `scripts/harness-probe.mjs` (step 1); the
four existing phrases stay. Steps: the operator's per-phase phrases and
handoffs become one phrase per drive and one after the merge; an executor
runs the order's **Preflight:** line before the first full gate and after
each repair (step 9); a target order's roles run the target gate in place
of `npm test` and its reviewer runs the records action (step 9). Wall-clock, tokens and context bytes are unknown
until run.
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
this one. Amended by the 2026-10-11 route pass (operator direction, item
(k), captured in ignored intake, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`): the
router drives target orders as well as launchpad orders; each phase's
worker runs in the target worktree WO-072 created, governed by WO-049's
bundle, launched from the instance; WO-072 is a hard dependency; placed
before WO-083 so the measured run is driven the way the operator drives
orders. Amended by the 2026-10-13 standard pass at `6dbd8771`
([planning document](../planning/standard-pass-2026-10-13.md) §6): the
Design and criterion 4 now say what step 4 and the 2026-10-07 decision say
(the worker is handed the phrase; the order is its working directory); steps
3, 7 and 8 and criterion 7 are written from what WO-072 landed (the
registry function, a target order's two worktrees, its merge in the clone
and its no-release close); a target order publishes through WO-210, a
typed hard edge; the instance's budget seed gains the router's keys.
Reshaped by the same pass under the operator's 2026-10-13 sizing direction
(planning document §12): WO-211 merged into WO-210, so the publication edge
names WO-210; the queue is serial, so the placement names its position;
the **Preflight:** line is added; the executor's role text gains the
preflight discipline of product 07 §Preflight before the full gate (step 9,
criterion 11), because this order already edits that file; the Design
names the live-run surfaces at the base; criteria 2 and 3 state step 8's
target merge read and step 3's kit budget seed. Amended in a second round by
the same pass under the operator's 2026-10-13 directions on target-order
gates and on where a repository's knowledge lives (planning document §12.7
and §12.8): step 9 also gives the executor, verifier and reviewer a
target-order branch (the target gate in place of the launchpad's `npm
test`, the target's documentation root read as repo-native authority, and
the reviewer's records-only commit), criterion 12 judges it, and the
executor's preflight text follows product 07 §Preflight before the full gate
as that section now words it.
**Depends on:** WO-072 (hard: the target worktree lifecycle whose
worktree a target order's phase workers run in and whose local registry
resolves the worktree grant); WO-187 merged (closed, v0.67.1: the generated
agent definition for spawned workers, which this order extends to one per
role); WO-139 merged (the
sub-agent counter; closed); WO-135 merged (the writer reservation;
closed); WO-130 merged (the phrase records its own dispatch; closed);
WO-158 merged (off-ramps the router stops for; closed); WO-210 merged (a
target order's publication from its worktree, which final review's
authority carries for a driven target order, and the target gate,
documentation root and records action step 9's role text names). WO-072
closed at v0.75.0.
**Recommended placement:** position 6 of the serial queue (planning
document §12), after WO-204 and before WO-083: it comes directly before
WO-083 at the operator's direction of 2026-10-11, so the measured run is
driven the way the operator will drive orders, and after WO-210, through
which its target orders publish. It has no dependency on the export
orders: a build that already carries the router is exported with it, and
an earlier export receives it through WO-077's update. This order edits
`harness-host.ts`,
`subagent-budget.ts`, `harness-command.ts`, `contributor.ts`,
`packages/compiler/src/harness.ts`, `scripts/resume.mjs`,
`scripts/harness.mjs`, product 07, product 05 and
`docs/AI-HARNESS-SECURITY.md`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-072",
    "relation": "hard",
    "reason": "the target worktree lifecycle whose worktree a target order's phase workers run in and whose local registry resolves the worktree grant"
  },
  {
    "workOrderId": "WO-210",
    "relation": "hard",
    "reason": "a driven target order's publication runs WO-210's command from its worktree, and the role text names WO-210's target gate, documentation root and records action"
  },
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
§Independent workflows and integration, §Operator recovery controls,
§Model-specific notes and §Preflight before the full gate (step 9 and
the **Preflight:** line below), and §Workflow closeout and releases (the
target-order paragraphs WO-210 writes: the target gate, the documentation
root and the records-only commit); `packages/skeleton/src/loadouts/contributor.ts`
`roleSteps` (executor, verifier and reviewer) and the executor's
target-order profile sentence; `docs/work-orders/WO-210-instance-orders-reach-release-close.md`
Design (the target gate, a target order's gate claims, the documentation
root and the records-only commit); `docs/PLAYBOOK.md` (implementer and verifier are
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
own sub-agent budget and records its own completion. The order may be the
launchpad's own or a registered target's (WO-071, WO-072): for a target
order each phase's worker runs in the target worktree WO-072 created,
governed by the bundle WO-049 emitted there, and is launched from the
instance, so the operator never opens a session in a target repository.

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
  names that worker, whether a worker can write in a directory added after the session
  started, whether a worker whose working directory is a target worktree
  carrying WO-049's bundle is governed by that bundle's hooks or by the
  parent session's, and whether a definition's pinned effort is the effort
  the host reports. The design below stands on those
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
- **What a worker is handed.** The phrase. The order is the worker's
  working directory: the order's worktree, or for a target order the target
  worktree, whose order WO-072's registry selects by branch (the 2026-10-07
  decision; step 4). A hook refuses a spawn from the router role whose
  prompt is anything else. The worker's definition preloads its role skill and pins the
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
  for an order with a worktree is granted that worktree's root by a grant
  kind derived from the order's recorded worktree, never from the prompt.
  For a target order the worker's working directory is the target worktree
  WO-072 created; the bundle WO-049 emitted there (hooks importing the
  launchpad's runtime snapshot by absolute path, the deny list,
  `CLAUDE.local.md`) governs its tool calls by construction in the
  separate-session form, and the probe records whether it does in the
  in-process form, whose host runs the parent session's hooks; where it does
  not, target orders take the separate-session form and launchpad orders may
  keep the in-process one. A target order has two worktrees (WO-072): the
  target's code worktree and the order's launchpad worktree, which holds its
  records and reports. The `order-worktree` grant for a target order resolves
  both through WO-072's registry (`targetWorktreeForOrder`,
  `scripts/lib/target-worktrees.mjs` line 195), comparing paths by physical
  identity (`directoryIdentity`, line 24; WO-072-D007).
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
  pull request; for a target order, the reviewer commits the reviewed
  target change before the passing result, writes the order's records into
  the target's documentation root as the records-only commit with `npm run
  resume -- target-records`, and final review runs WO-210's publication of
  that commit from the worktree and the records branch's own, with release
  close, which updates the target clone's base itself, after the operator
  merges both) and, typed again after the merge, what `resume: release
  close` carries. The router never merges.
- **Role text for target orders.** The worker of each phase reads the role
  text its definition preloads, so a target order's branch belongs in that
  text, not in the router: the executor, verifier and reviewer read the
  target's documentation root (WO-210) as repo-native authority beside its
  profile; make an order's write-backs to the repository's product documents
  in the target worktree under that root, as part of the reviewed change;
  run the target gate (`node scripts/target-gate.mjs WO-NNN`, `--review`
  where the order's final criterion names the review gate) for the order's
  own checks, never the launchpad's `npm test`, beside the launchpad's `npm
  run test:docs`; and skip `release prepare`, since a target order records no
  release (WO-210). The reviewer commits the reviewed target change before
  the passing result, then runs `npm run resume -- target-records`, which
  writes the order's file, decisions and reports into the documentation root
  as the records-only commit, and then the session publish and the records
  publish. A self order's procedure is unchanged.
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
  driving several orders at once (one order per phrase; concurrent orders
  use two routers in two sessions).
- **Live-run surfaces, at `6dbd8771`** (product 07 §Operator-opened
  planning pass, the live-run screen). Spawned-agent identity: WO-139's
  probe observed a child's `agent_id`, `agent_type` and `effort.level`
  (Claude 2.1.276); a nested spawn's attribution, a write under a late
  directory, the pinned effort and which hooks govern a worker in a target
  worktree are unknown until step 1's probe. A registered target's order in
  a fixture launchpad: exists (WO-072's fixture,
  `scripts/test-target-worktree.mjs`); WO-072's evidence records fixture
  runs and no live session working one. `drive:` and the router root:
  absent (this order). A target order's passing final review recording
  `targetSubject`: absent at the base (no source names it); WO-210 builds
  it first. Target publication and release close: not traversed by
  criterion 9 (criterion 8's fixtures cover them). The executor root's
  preflight discipline: absent (step 9); criterion 9's executor phase runs
  under it. The target gate, the documentation root, a target order's gate
  claims and the records action: absent at the base (WO-210 builds them,
  placed before this order); criterion 9's executor, verifier and reviewer
  phases run the target gate under step 9's target-order text.

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; steps 1 to 3, 5, 7 and 8 re-observed at `6dbd8771`, 2026-10-13, and step 9 written there the same day):**

1. Probe first: new `scripts/lib/agent-identity-probe.mjs` modelled on
   `scripts/lib/subagent-probe.mjs` (under `DOTLN_LIVE_HARNESS=1`); add mode
   `--agent-identity <new-file>` beside `--subagents` in `scripts/harness-probe.mjs` (line
   311); add the new lib to `machinerySources["harness-probe"]` in `scripts/test-runner.mjs`.
   Rows: the child's `agent_id`, `agent_type` and `effort.level`; a nested Agent call names
   its worker; a write under a directory added after the spawn; the pinned effort equals the
   child's reported level; a worker whose working directory is a target worktree carrying
   WO-049's bundle (emitted into WO-072's fixture) reports which hooks judged its tool call. WO-139's probe (`docs/evidence/WO-139/subagent-probe-2.json`,
   Claude 2.1.276) already observed the first three fields on a spawned agent; nested spawns,
   late directories and pinned effort are new. Check:
   `DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs --agent-identity docs/evidence/WO-192/host-probe.json`;
   a fixture in `scripts/test-harness-probe.mjs`; `npm test -- --only harness-probe`.
   A failed row selects the print-transport fallback for steps 4 to 6.
2. Definitions: `packages/compiler/src/harness.ts` lines 240 to 244: `worker?` becomes
   `workers?: { name, model, effort, description, skills?, body }[]`; loop the emitter
   (the `program.worker` block from line 955); `contributor.ts` line 855 lists `dotln-worker` plus one definition per
   lifecycle role (executor, verifier, reviewer, release-close) at the pinned model and effort
   of product 07 §Model-specific notes. No per-order parsing: an order's `**Effort:**` line
   stays advisory text. Check: `npm run build && node scripts/harness.mjs emit && node scripts/harness.mjs check`;
   a `scripts/test-harness.mjs` case edits `effort:` in an emitted definition and expects
   `harness drift: .claude/agents/<name>.md` (`scripts/lib/harness.mjs` line 674).
3. Router role: `contributor.router` in `contributorRoles` (`contributor.ts` line 107) with
   intents `["drive:"]`; `harness-host.ts` lines 4154 to 4157 prefix list gains `drive:` and
   lines 4160 to 4162 `auxiliary` gains `router`; `scripts/lib/process-budget.mjs` `dispatchKinds` (lines 6 to
   13) gains `router` and `docs/control/budgets.json` gains `dispatches.router` and
   `limits.coldStartBytes.router` (else `readBudgets` throws at line 38), and
   `scripts/kit/budgets.template.json` gains the same keys; because an instance's
   `docs/control/budgets.json` is an instance-owned seed that updates never rewrite,
   `readBudgets` reads an absent `router` entry as null, and a launchpad case updates an
   export made before this order and runs `npm run meta` in it. The router's own refusal
   sentence lives in the router root only; the one line naming the phrase goes in the
   generated block of `CLAUDE.md` beside the refuter's phrase (line 70), so the kit's
   floor template needs no edit, and no other root changes. Add the chained role oracle fixture
   `packages/skeleton/fixtures/wo192-role-baseline.json` (from the latest one), point the
   process-debt test that reads the baseline at it and add its path to
   `machinerySources["process-debt"]`. Check: `npm test -- --only harness-fixtures`;
   `npm test -- --only process-debt`; `npm test -- --only launchpad` (the update case).
4. Spawn admission (`harness-host.ts` line 4414): when `spawn && !input.agent_id &&
   session.role === "router"` and `tool_input.prompt` is not exactly one of the generated
   lifecycle phrases, refuse with `DOTLN_ROUTER_SPAWN_REFUSED`. The phrase list is the
   existing intents; the order is selected by the worker's cwd (the order's worktree), so no
   phrase carries an order id. Cases in `scripts/test-harness.mjs`.
5. Identity: `sessionKey` (`harness-host.ts` line 453) keys by `session_id` plus `agent_id`;
   the writer actor sites (lines 2073, 2830, 5028) carry `agentId`, printed by
   `harness writer --show`; the worker role comes from `agent_type` mapped to definition
   names. Check: `npm test -- --only harness-fixtures`.
6. Budget: `Counter.direct` entries (`subagent-budget.ts` lines 24 to 29) gain `spawner`;
   `fits()` checks the spawner against `subagentCap` and the root total against a new
   `budgets.json` `drivenSessionCeiling` (default four times the cap). Check:
   `npm run build && node --test packages/skeleton/dist/test/subagent-budget.test.js`.
7. Grant: `OutsideWriteGrant` (`harness.ts` lines 176 to 183) and its validator (300 to 316)
   gain `order-worktree`; `harness-host.ts` line 3636 resolves it from `git worktree list --porcelain` for the order's
   recorded branch, and for a target order from WO-072's registry through
   `targetWorktreeForOrder` (`scripts/lib/target-worktrees.mjs` line 195), granting the target
   worktree and the order's launchpad worktree, each compared by `directoryIdentity` (line 24);
   `contributor.ts` line 231 (`outsideWriteGrants`) adds it with its source; a case spells the
   launchpad through an alias and keeps the same grant. Check: `npm test -- --only harness-fixtures`.
8. Route: `projectOrder` (`scripts/resume.mjs` line 769) adds `route` from
   `legalActions` (line 214); merged is `git merge-base --is-ancestor <branch> origin/main`
   with no fetch (a stale `origin/main` reads as not yet merged, which is safe), and for a
   target order (its control state carries `repositoryId`) also the target branch an ancestor
   of the registry entry's `baseBranch` in the target clone, as `closeTargetWorktree`
   (`scripts/lib/target-worktree-close.mjs`) judges it before its no-release close; released is `localReleaseRecords`
   (`scripts/lib/release-records.mjs` line 29) or `publication.outcome: "no-release"` in
   `docs/control/local/retained/<WO>/release-close.json` (`scripts/release.mjs`: a target
   order's outcome at line 2304, the record written at line 2817). Re-entry and stop cases in
   `scripts/test-control-segments.mjs` (run by `scripts/test-resume.sh` line 1062). Check:
   `npm test -- --only resume`.
9. Role text in `packages/skeleton/src/loadouts/contributor.ts`. (a) The executor's preflight
   discipline: in `roleSteps.executor` (lines 576 to 588) the step that runs the full gate (line
   585) gains product 07 §Preflight before the full gate as that section words it: run the order's
   **Preflight:** line before the first full gate and after each repair, finish every code edit
   before the last full run, and repeat a full run only after a relevant change or a diagnosed
   invalidation of its evidence (a stopped run, an environment fault), with the reason recorded.
   (b) The target-order branch of the Design's "Role text for target orders": the executor's
   target-order profile sentence (line 120) and the verifier's and reviewer's procedures gain the
   documentation root as repo-native authority and the write-backs made under it; the executor's
   prepare step (line 580), the reviewer's surface step (line 602) and the full-gate steps of the
   executor (line 585), verifier (line 595) and reviewer (line 605) gain the target-order clause
   (no `release prepare`; the target gate in place of `npm test`, beside the launchpad's `npm run
   test:docs`); the reviewer's last step (line 607) gains the commit-first step,
   `npm run resume -- target-records` and both publications for a target order. No other role's
   procedure changes, and a self order's text is unchanged. Then `npm run build && node
   scripts/harness.mjs emit`; step 3's role oracle fixture
   (`packages/skeleton/fixtures/wo192-role-baseline.json`) pins the executor, verifier and reviewer
   roots as this step leaves them, so the order's role edits share one fixture; the decisions
   record the three roots' cold-start bytes before and after (the budget is advisory,
   `scripts/lib/process-budget.mjs` line 83). Check: `npm run harness -- check`; `npm test --
   --only harness`; `npm test -- --only process-debt`.
10. Live drive (criterion 9): a registered target's order from a fixture launchpad (WO-072's
    fixture) against a scratch target with a local bare remote, so the driven route is the one
    the operator uses, the fixture's registered repository declaring a gate of synthetic commands
    and the default documentation root (WO-210), each phase running under step 9's roots; the
    launchpad-order route is covered by criterion 8's table tests.
11. Write-backs: product 07 §"## Operator resume phrases" (the `drive:` phrase and the router,
    in place); product 05 §"### Orchestration and quality policies" (one sentence);
    `docs/AI-HARNESS-SECURITY.md` §"## DotLn hook boundary" (the spawn refusal and the
    worktree grant); `docs/PLAYBOOK.md` §"## Who does what" (the router);
    `packages/compiler/src/harness.ts` line 1196 unchanged (the shared paragraph grows no
    root); `docs/evidence/WO-192/decisions.md`; `npm run meta`; `node scripts/lineage.mjs index --check`;
    `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
12. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-192/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the probe rows; the router role, phrase and generated
root; the per-role agent definitions; the identity, reservation, budget
and grant changes with fixtures; the spawn-prompt refusal; the `route`
status reading; the executor root's preflight discipline; the target-order
branch of the executor, verifier and reviewer roots; one live driven order;
the write-backs below.

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
   with and without release evidence; for a target order, merged also
   requires the target branch to be an ancestor of the registered
   `baseBranch` in the target clone, and the table covers a target order
   merged only on the launchpad.
3. `drive: WO-NNN` in a fixture session selects the router role and
   records no lifecycle transition of its own; the generated router root
   states the whole procedure; `npm run harness -- check` is green and
   fails when a generated agent definition's model, effort or skill is
   edited by hand. One generator and one check rule produce and validate
   every agent definition in the bundle, WO-187's among them.
   `scripts/kit/budgets.template.json` carries `dispatches.router` and
   `limits.coldStartBytes.router`; `readBudgets` reads an absent `router`
   entry as null; a launchpad case updates an export made before this
   order and passes `npm run meta` in it.
4. A spawn from the router role whose prompt is not exactly a lifecycle
   phrase is refused with a typed reason (the order is the worker's working
   directory, never a prompt field); a spawn with the phrase is admitted; a worker's own spawns are not
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
   worktree's root and is refused under another order's; for a target order
   the roots are the target worktree and the order's launchpad worktree
   WO-072's registry resolves, compared by physical identity so an alias
   spelling keeps the grant; the grant appears in the worker's role record
   with its source.
8. Table tests cover re-entry: resume of an addressable worker,
   re-dispatch of an interrupted phase with the same briefing, the
   repair loop to its bound, each listed stop, and release close after
   an observed merge.
9. One order is driven live from `active` to a passing final review by one
   session: a registered target's order from a fixture launchpad against a
   scratch target with a local remote; the record shows one phrase typed,
   each phase's worker with its working directory in the target worktree,
   the model and effort as the host reports them, which hooks governed each
   worker's tool calls (the bundle's or the parent session's, as the probe
   found), each worker's sub-agent count, usage split between the router
   and its workers as far as the host exposes it, and each phase's gate
   claims standing on the fixture target's gate rows (its registered
   repository declares a gate of synthetic commands, WO-210), never on a
   launchpad `npm test` row. Publication, the records action and release
   close are covered by criterion 8's fixtures and WO-210's, not by this
   run.
10. Write-backs: product 07 §Operator resume phrases gains the phrase
    and the authority sentence; product 05's orchestration policies name
    the router as their first host binding; `docs/AI-HARNESS-SECURITY.md`
    states the per-agent identity and what stays root-wide; `docs/PLAYBOOK.md`
    states the independence reading; the decisions file and index; the
    harness manifest's refusal list; the publication locks refreshed.
11. The executor root the Contributor build emits states the discipline
    of product 07 §Preflight before the full gate as that section words it:
    run the order's **Preflight:** line before the first full gate and after
    each repair, finish every code edit before the last full run, and repeat
    a full run only after a relevant change or a diagnosed invalidation of
    its evidence, with the reason recorded. No other role's procedure changes
    for it; `npm run harness -- check` is green; the role oracle fixture pins
    the new executor root with its chain intact; the decisions record the
    executor root's cold-start bytes before and after; criterion 9's executor
    phase runs under that root.
12. The executor, verifier and reviewer roots the Contributor build emits
    state, for a target order: read its documentation root as repo-native
    authority beside its profile; make the order's write-backs to the
    repository's product documents in the target worktree under that root;
    run the target gate (`node scripts/target-gate.mjs WO-NNN`, with
    `--review` where the final criterion names the review gate) for the
    order's own checks, never the launchpad's `npm test`, beside the
    launchpad's `npm run test:docs`; skip `release prepare`; and, for the
    reviewer, commit the reviewed target change before the passing result,
    then run `npm run resume -- target-records` and both publications. A self
    order's text in the three roots is unchanged; `npm run harness -- check`
    is green; the role oracle fixture pins the three roots with their chain
    intact; the decisions record their cold-start bytes before and after;
    criterion 9's phases run under them.
13. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only harness-probe` for step 1,
`npm test -- --only harness-fixtures` and `npm test -- --only harness` for
steps 2–5 and 7, `npm test -- --only process-debt` and
`npm test -- --only launchpad` for step 3, `npm test -- --only skeleton`
for step 6, `npm test -- --only resume` for step 8,
`npm test -- --only harness` and `npm test -- --only process-debt` for
step 9, `npm test -- --only authority-evidence`,
`npm test -- --only artifact-evidence`,
`npm test -- --only verification-evidence`,
`npm test -- --only feedback-evidence` and
`npm test -- --only harness-evidence` once the deterministic re-mints are
written (every edition registers `packages/compiler/src/harness.ts`), and
`npm run test:docs` when a document changes (step 11), each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the probe record; the fixtures and table tests of
criteria 2 to 8; the live run of criterion 9 with its usage record; the
generated executor, verifier and reviewer roots and role oracle fixture of
criteria 11 and 12; the
deterministic re-mints; `npm test -- --review` before
`implementation-ready` and again at final review.

**Write-back duty:** as listed in criterion 10.

**Known issues and carry-ins:**
- 2026-10-13 reshape (the operator's sizing direction, planning document
  §12): the publication edge names WO-210, the carrier the provenance
  records; the executor root gains the preflight discipline here (step 9,
  criterion 11) because this order already edits `contributor.ts` and owes
  its re-mints and role oracle fixture. `contributor.ts` is a registered
  evidence source but not a file the feedback verifier judges
  (`FEEDBACK_SOURCE_PATHS`, `packages/skeleton/src/feedback-audit.ts` line
  15), so step 9 owes no live feedback episode; the live run its text meets
  is criterion 9's drive. Criteria 2 and 3 now state step 8's target merge
  read and step 3's kit budget seed, which no criterion named.
- 2026-10-13 second round (planning document §12.7 and §12.8): WO-210
  (placed before this order) makes a target order's gate claims resolve to
  the target's own declared tests and writes the order's records into the
  target's documentation root; the role text still names `npm test` and the
  launchpad's records only, so step 9 gives the three lifecycle roles a
  target-order branch (criterion 12) in the same edit and fixture as the
  preflight discipline, and closes WO-210's known issue on the generated
  reviewer skill. The executor's preflight text follows product 07's
  current wording (repeat a full run only after a relevant change or a
  diagnosed invalidation of its evidence, with the reason recorded), not the
  earlier "only after the code identity changes", which the alignment review
  found exceeds the operator's direction. "Skip `release prepare` for a
  target order" is the planner's reading of WO-210's no-release rule; the
  executor confirms it against WO-210's landed prepare and records it.
- 2026-10-13 standard pass: the Design and criterion 4 said the worker is
  handed the phrase and the order identifier while step 4 and the
  2026-10-07 decision said no phrase carries one (the criterion-plan
  agreement screen); all three now say the phrase, with the order from the
  working directory. WO-072 has landed: steps 7 and 8 and criterion 7 name
  its registry function, a target order's two worktrees, physical identity
  (WO-072-D007, after WO-072's VER-001 failed on a lexical comparison) and
  the merge in the target clone. A target order publishes through WO-210
  (hard edge), because `worktree publish --target` publishes only a
  source-change episode. Step 3 seeds the router's budget keys in the kit
  and reads an absent entry as null, so an instance exported before this
  order keeps `npm run meta`; its `CLAUDE.md` line goes in the generated
  block. Watched, not taken: a target order's worker runs the order
  launchpad's commands with `DOTLN_LAUNCHPAD` exported (WO-072's handoff),
  and the fixture suites WO-201-D002 names inherit it
  (FUP-2518166a22767f47); FUP-d72bf62d3c82ca3f's trigger (an order that edits
  harness emit) matches step 2's emitter loop, but its build-none disclosure
  is outside this order's objective and stays deferred.
- 2026-10-11 route pass (operator direction, item (k)): target orders are
  in scope; each phase's worker runs in the target worktree under WO-049's
  bundle, launched from the instance; the probe gains the target-worktree
  row and the live drive is a target order; WO-072 is a typed hard edge;
  placed directly before WO-083.
- 2026-10-11 standard pass: two rows on the agent definitions this order
  regenerates are allocated here, for the Boy Scout bound or a recorded
  reason to leave each: FUP-82e9f0bda503c40c (WO-187 D020: the worker pin
  is written in the role text and in the worker constant with nothing
  comparing them; the Claude worker type shares its name with the Codex
  permission profile and restricts no tools; the compiler's worker-name
  pattern admits digits and the installer's agent-path pattern does not)
  and FUP-ea936acad1506e18 (the runtime pin list in
  `scripts/lib/harness.mjs` is kept by hand while the import closure grows;
  this order changes the bundle's shape again, the row's trigger). The
  rows' `plan failures` item (escapes 0 for an order with no measured
  review) stays with planning.
- 2026-10-02 standard pass (second): FUP-67a3ccb3b295200e is allocated
  here: a spawn counts against the agent whose tool call made it and the
  root-wide total stays reported (criterion 6), after criterion 1's probe
  of what the host exposes; it reopens if this order is withdrawn or closes
  with the item returned to the register.
- Stale on 2026-10-07 and corrected above: the Cost line's "the other roots
  are unchanged" (the router's refusal now lives in its own root, so it
  holds; the 2026-10-13 reshape adds step 9's text to the executor root,
  which the Cost line now names); the gap's "none of this has been probed" (WO-139's probe
  observed three of the fields); WO-187 is closed and the worker
  definition is emitted and manifest-hashed.
- Decided by the 2026-10-07 pass: one definition per lifecycle role at the
  pinned model and effort, no per-order parsing of `**Effort:**`
  (prose-parsing screen); the phrase list is the existing intents and the
  order is the worker's cwd; merged is judged without a fetch. Reopen: an
  order needs a per-role effort the pin does not give.
- The role oracle fixture chain (step 3) is a duty every role-text order
  owes and none named before this pass.

- WO-139's counter treats an unresolved overlap between a direct spawn
  and a child's first call as a reported minimum; that stays.
- A dead Codex writer still needs a release on the operator's word: the
  router stops there and prints the recovery phrase (`operator override:`),
  under which a session runs `node scripts/harness.mjs writer --release`;
  the operator types the phrase and runs no command (operator direction,
  2026-10-13).
- The process-wide effort variable names the root's effort inside a
  spawned agent's shell; the attestation for a worker must come from
  the worker's own hook payload or definition, never from that
  variable.
- The executor's cold-start bytes already exceed the planning
  condition's predicate, an operator-reserved question; a worker's
  preloaded skill is the same root and changes nothing there. Step 9 grows
  that root by its sentence; the decisions record the bytes before and
  after (criterion 11).
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
managed host meters; changing what any phase does, beyond step 9's role
text (the executor's preflight discipline and the target-order branch of
the executor, verifier and reviewer); WO-210's target gate, records action
and publications themselves; the resident and the
portfolio (target orders are in scope since 2026-10-11); a control event
for release close.

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
5. This order is placed after WO-204 and directly before WO-083 at the
   operator's direction of 2026-10-11, so the measured run is driven the way
   the operator drives orders; nothing in it depends on the export.
6. The executor's preflight discipline belongs in this order's edit of the
   Contributor build rather than in an order of its own (the operator's
   2026-10-13 sizing direction, planning document §12).
7. The target-order branch of the executor, verifier and reviewer text
   belongs in this order too: it edits the same procedures, fixture and
   re-mints, and WO-210 leaves role text to it (planning document §12.7).
   For a target order the roles run the target gate, never the launchpad's
   `npm test`, for the order's own checks, and the reviewer writes the
   order's records into the target's documentation root through WO-210's
   records action.
