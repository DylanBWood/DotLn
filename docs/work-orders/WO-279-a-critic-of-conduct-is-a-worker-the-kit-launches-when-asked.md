# WO-279 — A critic of conduct is a worker the kit launches by name when asked, on the model an instance chooses, Opus 5.5 at xhigh by default, and on a cadence only where an instance turns one on (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. Worker kinds become data the kit
launches by name; the meta critic WO-276 ran from a copied script becomes
the first kind, launched through the kit's transport on any worker the
instance names and on `opus` (`claude-opus-5-5`) at `xhigh` by default,
only when someone asks for it; a cadence, whose due launches the session is
shown, runs only where an instance turns on the `critic-cadence` feature,
off by default; the kit screens the transcripts a critic reads before each
launch; the kit
checks one class of conduct the critics found most often. One refusal is
added: a launch whose transcripts hold a refuse-class entry of the private
list is withheld. It is keyed to no host property. Assigned at activation
under the standing opt-out default.
**Cost:** adds a build-free kinds module and an instance `kinds` section,
one launch command, a cadence module and a `due` command, one line in the
prompt hook's context and one beside the Stop hook's standing line, a
counts-only transcript screen, one request kind in the worker transport and
its protocol, the standing file's age check, and fifteen to twenty cases
(estimates, not bounds). Where an instance turns the cadence on, each
prompt in a dispatch reads the dispatch's journals and gate rows once more
(the standing reads them in about 6 ms a megabyte, WO-276-D103; this reading
unmeasured); with it off, as by default, nothing more is read.
Each critic launch costs a worker run of about fifteen to twenty minutes
(WO-276's critics) and one subagent use. It removes the copied launcher
and the timer the operator and WO-276's executor kept by hand, and the
critic's dependence on a Codex host, which the work laptop does not have.
`packages/skeleton/src/worker-transport.ts` and
`packages/skeleton/src/change-review-protocol.ts` are judged feedback
sources: this order owes the feedback re-mint and one live feedback
self-host episode, run after the step that edits them, and the
deterministic re-mint of every edition its other registered sources stale;
one complete review run at final review. Tokens and steps are unknown
until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-14
(journal digest
`90a23f1bbae9b79f3c760f130d682a0bf463281b37ab7c81d46eace1b1507603`) and
the operator's mid-turn message of 2026-11-15 00:14Z (journal digest
`7e7917015180c8b551d5c3cfcf234425c1016fb164b5147f31d9a61aab18e38a`),
which asked for the meta critic to be launched on this pass as WO-276 ran
it, and for the option to be codified with any model and effort and
Opus 5.5 at xhigh as its default so that it works on the work laptop. The
operator's requests during WO-276 of 2026-11-12, recorded in that order's
decisions, carry the design: register rows FUP-2de3c94204e13b7a
(WO-276-D077, a kind and a cadence as data), FUP-f9783edbe0b0fb56
(WO-276-D110, the meta critic as the first kind), FUP-9b9aaa27aa208bde
(WO-276-D115, two critic rows), FUP-c964896b30330ea2 (WO-276-D145, when the
clock starts and ends), FUP-532530eb14c5703d (WO-276-D143, item 4, the
critic's clock kept by hand), FUP-fd4fadccb76a8a9a and FUP-7fb5568a139c9621
(WO-276-D111 and D113, the record of criticisms), FUP-187c6e9dea8903cb
(WO-276-D182, the change-review prompt's output contract) and
FUP-23aca17371cf7b86 (WO-234-D028, whose condition occurred twice: the
gate-row reader that a malformed checks file stops) are allocated here.
Clean-room screen: the critic reads transcripts that in an instance hold
whatever its sessions read; the screen of this order's design withholds a
launch over a refuse-class entry and prints counts only.
**Depends on:** WO-277 by placement only; no hard edge.
**Recommended placement:** second, after WO-277: the operator asked for it
during this pass, and every later order can then run its critic through
the kit on the work laptop.
**Cites (read these sections):** `docs/evidence/WO-276/critic/README.md`,
`charter.md`, `launch.mjs` and `criticisms.md`; WO-276-D077, D101, D110,
D111, D113, D115, D143, D145, D165, D166 and D182;
`packages/skeleton/src/worker-catalog.mjs` and `worker-models.mjs`;
`scripts/worker.mjs`; `scripts/lib/worker-launch.mjs` (`launchWorker`,
`resolveLaunch`); `scripts/lib/review-worker.mjs` (`journalLaunch`,
`reviewsLane`, `admitCodexLaunch`); `packages/skeleton/src/worker-transport.ts`
(`changeReviewArgs`, `codexExecArgv`); `packages/skeleton/src/change-review-protocol.ts`
(`output`, `changeReviewResultSchema`); `packages/skeleton/src/usage-observation.mjs`
(the transcript directories it reads); `scripts/lib/terms.mjs`
(`localTermFindings`); `scripts/lib/dispatch-bound.mjs` (`dispatchStanding`,
`phaseJournalRows`); `packages/skeleton/src/gate-evidence.mjs`
(`readChecksFile`, `readGateChecks`, `passingGateResult`, `activeGateRuns`);
`packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch`, the prompt
hook's context, the Stop hook's standing line); `scripts/lib/config.mjs`
(`SECTION_KEYS`, `validateWorkers`); `scripts/lib/handoff-ledger.mjs` (the
standing file's path); product 05 §the cadence lines (19 to 23, 266).
**Objective:** An operator or an executor launches the critic of conduct
by name, `npm run worker -- launch critic`, on the instance's chosen worker
or on `opus` at `xhigh` when it names none, in Claude Code alone or with
Codex, through the kit's transport and its counted launches; the brief is
the fixed charter with the subject's names filled in, and nothing the
executor writes; the report lands in the subject's reviews lane and is
printed whole for the operator. Nothing launches a critic unless someone
asks, as the operator directed on 2026-11-15, except where an instance turns
on the `critic-cadence` feature in `dotln.config.json` (off by default):
there the session is shown each launch that falls due, from one interval
after its dispatch began until its complete run passes, deferred while a
gate runs, and each launch is journaled. Before every launch the kit screens the transcripts
the worker will read against the private list, by counts alone. The
critics' most frequent class of finding, a recovery record left stale, is
checked by the kit itself at each complete run's start.

**Observed gap (dated 2026-11-14 at `main` `ed66a822c`, v1.0.0):**

1. The three review kinds are code in four places (`KINDS` in
   `scripts/lib/review-worker.mjs` 60; `CHANGE_REVIEW_KINDS` in
   `packages/skeleton/src/change-review-protocol.ts` 8 to 13; the briefs in
   `packages/skeleton/src/loadouts/contributor.ts` 86 to 93; the lane in
   `reviewsLane`), and no other kind exists. WO-276's attacker, meta critic
   and every recurring launch ran from scripts in session scratch
   (WO-276-D077).
2. The critic is kept as `docs/evidence/WO-276/critic/launch.mjs`, which
   runs `codex exec` with flags copied from the helper, fakes
   `CODEX_THREAD_ID` to read a preamble, names Claude's transcripts by
   replacing `/` alone (the kit's reader, `usage-observation.mjs` 494 to 499,
   replaces every character that is not a letter or digit and honours
   `CLAUDE_CONFIG_DIR`), writes literal `docs/` paths, has no usage row, no
   `WorkerLaunched` row and no receipt, and is counted by no hook
   (`kitWorkerLaunch` counts `worker review` alone). It needs Codex, which a
   Claude-only instance, the work laptop's among them, does not have. On
   2026-11-15 this pass ran a scratch copy of it for the operator, since the
   kit has no command for it.
3. Nothing keeps a cadence: WO-276's executor and the operator kept the
   75-minute clock by hand and with a timer (README 152 to 153); the role
   text says nothing of it (WO-276-D143 item 4); product 05 records runtime
   cadence as not built (266).
4. The transcripts a critic reads hold every tool result of the sessions
   (charter 7), so in an instance they hold whatever its sessions read;
   WO-276-D101 screened them by a scratch script over `localTermFindings`,
   and `node scripts/terms.mjs check` accepts only paths inside the
   repository (`scripts/terms.mjs` 15 to 24).
5. A worker launched on the Agent route receives `changeReviewPrompt`
   without the CLI's schema argument; its `output()` (`change-review-protocol.ts`
   266 to 276) never names `schemaVersion`, which the schema requires (206)
   and `validateChangeReviewResult` demands (302 to 313), so such a return is
   refused for a field its brief did not name (WO-276-D182).
6. The class the critics found most often, on both sides of WO-276's
   thirtieth launch, is a recovery record left stale: 21 accepted points
   (`docs/evidence/WO-276/critic/criticisms.md`, class 1), several after a
   rule against it was written; one critic found a complete run started on
   a standing file forty minutes stale (WO-276-D144). Nothing compares
   `docs/evidence/<WO>/standing.md` with the results recorded since.
7. `readChecksFile` (`packages/skeleton/src/gate-evidence.mjs` 1106 to 1111)
   parses the checks file with a bare `JSON.parse`, so a malformed file
   stops every reader of gate rows, the dispatch standing at
   `scripts/lib/dispatch-bound.mjs` 372 among them (WO-234-D028; its
   condition occurred at WO-258 and again at WO-276, which edited that
   module).

**Design (scope discipline):**

- Kinds are data. The kit's rows live in a build-free
  `packages/skeleton/src/worker-kinds.mjs`, shipped as the worker table's
  modules are; an instance adds or overrides rows in a `kinds` section of
  `dotln.config.json`, validated as `workers` is, each refusal naming file
  and key. A row holds its brief (a charter path with named fields), its
  report lane, its permission profile, its default worker and an optional
  cadence. The kit ships one row, `critic`, from WO-276's charter, with
  `opus` at `xhigh` as its default worker; the three review kinds stay as
  the review helper's code. Rejected: moving the review kinds into the
  table now (axis: risk; WO-278 repairs that helper in the same release
  span, and a second change to its kinds would land on code a sibling is
  changing).
- One command launches a kind: `npm run worker -- launch <kind> [<worker
  or model>] [--effort <level>] [--order WO-NNN | --subject planning]
  [--print]`. It resolves the worker through the table, renders the brief,
  runs the screen of the next point, launches through the kit's transport
  with the kind's profile (a Claude worker read-only with the transcripts'
  directory added; a Codex worker in its read-only sandbox), journals a
  `WorkerLaunched` row with the kind and the launch's number, counts one
  use, writes the report to the lane and prints it whole. A new request
  kind in the transport carries the kind's free-form report; the
  change-review request keeps its four kinds and its schema. Rejected:
  shipping the kept script as a kit file (axis: transport; it bypasses the
  launch path, the journal and the count, and needs Codex).
- The screen: a counts-only entry point over a directory outside the
  repository reads the transcripts the brief names against the private
  list; a refuse-class line withholds the launch and says how many lines of
  which class, never a term; an absent list is said and does not withhold a
  launch in core, as `terms check` treats it, and does in an instance whose
  list is required by its publish (the instance's own setting).
- The transcripts are the executor's host's, read where the kit's usage
  reader reads them (Claude's projects directory under `CLAUDE_CONFIG_DIR`,
  Codex's sessions, Copilot's session state); where the host keeps none the
  kit can read, the launch says so and launches nothing.
- A critic runs on request by default. A cadence is off until an instance
  turns on `features.critic-cadence` (a row of
  `scripts/lib/feature-registry.mjs`, default off, as `plan-first` is); its
  interval is the kind's, 75 minutes unless the instance's `kinds` section
  sets another. With the feature off, `due` names nothing and neither hook
  adds a line. Where it is on, the cadence is computed, never run by a
  daemon: `dueLaunches` in a new `scripts/lib/worker-cadence.mjs` reads the dispatch
  standing's start, the kind's newest `WorkerLaunched` row in the dispatch's
  journals and the gate rows; a launch is due one interval after the later
  of the dispatch's start and the last launch, deferred while a gate runs,
  and the clock ends at the dispatch's first passing complete run
  (WO-276-D145, D165, D166). `npm run worker -- due` prints it; the prompt
  hook adds one line to the session's context and the Stop hook one beside
  the standing line when a launch is due. The executor's role text for the
  active and repairing phases says to launch a due kind where the instance
  has turned the cadence on, and to hand any critic's report to the operator
  whole before answering it. Rejected: a background
  timer (axis: process; product 05 and the kit's rule against an orphan
  timer, 1805 to 1807).
- The briefed critic of plan and cost (WO-276-D115) is not a row yet: its
  reopening condition is the operator's word on which kind a later order
  runs or what the briefed kind is told. This order records the input a
  command could render for it and builds no such command.
- The record of criticisms gets a kit place: the launch writes the report
  to the lane, and the executor records each point's judgment in the
  order's decisions as WO-276 did; `npm run plan -- failures` counts a
  dispatch's critic launches beside its review rounds.
- The kit checks class 1 itself: at the start of a complete run and at a
  handoff of an order whose standing file exists, an advisory names the
  standing file when it was last written before the newest gate row or
  lifecycle event of the order, by file time and row time alone. It refuses
  nothing. Rejected: comparing the standing file's prose with the record
  (axis: the planning screen; no criterion reads free prose
  deterministically).
- `readChecksFile` reads a malformed checks file as unavailable with its
  cause, as the standing already does for an unreadable journal.
- The change-review prompt's output section names every field the result
  schema requires, read from the schema (WO-276-D182).

**Execution plan (the executor follows these steps in order; observed at
`ed66a822c`, 2026-11-14):**

1. `packages/skeleton/src/worker-kinds.mjs` (new; build-free) with the
   `critic` row and its validator; `scripts/launchpad.mjs`
   (`BUILD_FREE_MODULES`) and `scripts/lib/evidence-sources.mjs`
   (`commonSources`, if `worker-catalog.mjs` imports it); `scripts/lib/config.mjs`
   (`SECTION_KEYS`, the `kinds` validator). The charter moves to a kit path
   the export carries (under `scripts/kit/` or `docs/`, the executor's
   choice, named in the decisions), with fields for the subject in place of
   core's literal paths. Check: `npm test -- --only harness-fixtures`,
   `npm test -- --only evidence-sources` and `npm test -- --only
   configuration-root`.
2. `packages/skeleton/src/worker-transport.ts` (a request kind for a kind's
   report, its Claude and Codex argv with the profile's directories) and
   `packages/skeleton/src/change-review-protocol.ts` (`output` names the
   schema's required fields, WO-276-D182); then the feedback re-mint and the
   live feedback self-host episode on the instance's `default` worker, as
   product 07 §Operator-opened planning pass requires of an order that edits
   a judged source. Check: `npm test -- --only plan-refutation`, `npm test
   -- --only feedback-evidence` and the episode's record.
3. `scripts/lib/terms.mjs` (a counts-only reading of files outside the
   repository) and `scripts/terms.mjs` (its command); cases for a clean
   directory, a refuse-class match counted and never printed, and an absent
   list. Check: `npm test -- --only harness-fixtures` and `npm test --
   --only runner-fixtures`.
4. `scripts/lib/worker-launch.mjs` (`launchKind`, the transcripts'
   directory from the usage reader's rules) and `scripts/worker.mjs`
   (`launch`, `due`); `journalLaunch` moves from `scripts/lib/review-worker.mjs`
   to `worker-launch.mjs` to serve both commands; cases with the fake
   transport for a Claude and a Codex launch, `--print`, a withheld launch
   and a host with no transcripts. Check: `npm test -- --only
   plan-refutation` and `npm test -- --only launchpad-planning`.
5. `scripts/lib/feature-registry.mjs` (the `critic-cadence` row, off by
   default), `scripts/lib/worker-cadence.mjs` (new, `dueLaunches`, which
   answers nothing due while the feature is off) and
   `packages/skeleton/src/gate-evidence.mjs` (`readChecksFile` reads a
   malformed file as unavailable); cases for the first launch one interval
   in, a launch deferred by a running gate, the clock ended by a passing
   complete run, and a malformed checks file. Check: `npm test -- --only
   harness-fixtures` and `npm test -- --only process-debt`.
6. `packages/skeleton/src/harness-host.ts` (`kitWorkerLaunch` counts
   `worker launch`; the prompt hook's line; the Stop hook's line) and
   `scripts/lib/review-worker.mjs` (`admitCodexLaunch` likewise); cases.
   Check: `npm test -- --only harness-fixtures` and `npm test -- --only
   runner-fixtures`.
7. The standing file's age advisory at a complete run's start
   (`scripts/test-runner.mjs`, where the run's start prints its notices) and
   at a handoff (`scripts/lib/handoff-ledger.mjs`); cases. Check:
   `npm test -- --only runner-fixtures` and `npm test -- --only
   process-debt`.
8. `scripts/lib/plan-failures.mjs`: count a dispatch's critic launches
   beside its review rounds. Check: `npm test -- --only plan-refutation`.
9. `packages/skeleton/src/loadouts/contributor.ts`: the executor's active
   and repairing steps launch a due kind and hand its report to the
   operator whole before answering it; then `node scripts/harness.mjs emit`
   and `npm run sync`. Check: `node scripts/harness.mjs check`.
10. Write-backs: product 05, the cadence lines (a cadence is data on a kind,
    computed at each prompt, with no timer); product 07 §Review helper and
    round reports (the kinds, the launch and the screen); `docs/KIT.md`
    §Planning in this instance (how an instance runs the critic, chooses its
    worker and sets a cadence); `docs/evidence/WO-276/critic/README.md` gains
    no sentence, since it is a record; `docs/evidence/WO-279/decisions.md`
    with the dispositions of the sixteen classes of
    `docs/evidence/WO-276/critic/criticisms.md` that the 2026-11-14 pass
    recorded, and the regenerated decisions index. Then the handoff
    sequence of product 07 §Discipline.

**Deliverables:** the kinds module and the instance section; the critic's
charter as a kit file; the launch and due commands; the transport's request
kind and the protocol's output contract; the counts-only screen; the
cadence module and the two hook lines; the counted launch; the standing
file's advisory; the checks reader; the role text; the write-backs,
decisions, the episode's record, regenerated roots and editions.

**Acceptance criteria (all required)**

1. Under `npm test -- --only plan-refutation`, with the fake transport:
   `npm run worker -- launch critic --order WO-NNN` with no worker named
   launches `opus` at `xhigh` on the Claude route, with the transcripts'
   directory added read-only and the charter's fields filled; naming `astra`
   launches it on the Codex route in its read-only sandbox; each writes the
   report to the order's reviews lane, prints it whole and journals a
   `WorkerLaunched` row with the kind and its number; `--print` launches
   nothing.
2. An instance's `kinds` section that names another worker and effort for
   `critic` changes the launch accordingly, and a malformed section is
   refused naming `dotln.config.json` and the key (`npm test -- --only
   configuration-root`).
3. With a refuse-class entry of the private list present in a transcript,
   the launch is withheld, its output names the counts of lines by class and
   no term, and no worker starts; with none, the launch proceeds (`npm test
   -- --only harness-fixtures`).
4. With `features.critic-cadence` absent or off, `npm run worker -- due`
   names nothing at any time and neither hook adds a line. With it on,
   `due` names a critic launch due one interval after the dispatch began,
   names none while a gate runs and names none after the dispatch's complete
   run has passed, and the prompt hook's context and the Stop hook's line
   carry the same answer (`npm test -- --only harness-fixtures`).
5. The hook counts `npm run worker -- launch critic` as one use and
   `--print` as none (`npm test -- --only harness-fixtures`).
6. At a complete run's start and at a handoff, a standing file written
   before the order's newest gate row is named in an advisory, and a newer
   one is not (`npm test -- --only runner-fixtures`).
7. A malformed checks file makes the dispatch standing read its gate rows
   as unavailable with the cause, and no reader throws (`npm test -- --only
   harness-fixtures`).
8. `changeReviewPrompt`'s output section names every field
   `changeReviewResultSchema` requires, `schemaVersion` among them, by a
   case that reads the schema (`npm test -- --only plan-refutation`); the
   feedback re-mint and the live episode are recorded under
   `docs/evidence/WO-279/`, or their recorded absence with the host's
   reason.
9. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only plan-refutation`, `npm test -- --only
harness-fixtures`, `npm test -- --only configuration-root`, `npm test --
--only evidence-sources`, `npm test -- --only launchpad-planning`, `npm
test -- --only runner-fixtures`, `npm test -- --only process-debt`, `npm
test -- --only harness-evidence`, `npm test -- --only authority-evidence`,
`npm test -- --only artifact-evidence`, `npm test -- --only
verification-evidence`, `npm test -- --only feedback-evidence`, `npm test
-- --only meta` and `npm test -- --only registrations` for the steps that
name them; the structural phase; the complete run with `npm test --
--review` at final review.

**Evidence gate:** under `docs/evidence/WO-279/`: a fake-transport launch on
each route with its journal row; the withheld launch's output; the `due`
answers; the standing advisory; the live episode's record; `npm run resume
-- status --json` after `implementation-ready`.

**Write-back duty:** as step 10 lists; the release's Read before upgrading
says how to run the critic, that it defaults to `opus` at `xhigh`, how an
instance chooses another worker or a cadence, and that a launch reads the
host's transcripts after a counts-only screen against the private list.

**Known issues and carry-ins:**

- Until WO-278 lands, this order's first round is launched as
  WO-276-D118 records.
- The briefed critic (WO-276-D115) waits for the operator's word.
- A Claude critic's shell is the kind's profile, which must admit the read
  tools the charter names (`rg`, `jq`, `tail`, `sed`) for the transcripts'
  directory alone; the profile is the executor's to set and the decisions
  name it.

**Non-goals:** a background scheduler or timer; the briefed critic; moving
the review kinds into the table; launching a critic on a host the instance
has not elected; any change to what a critic may write (nothing).

**Operator-review assumptions:** a critic launches only when someone asks
for it, and a cadence only where an instance turns on `critic-cadence`, as
the operator directed on 2026-11-15 (journal digest
`84e8b237fba52405b7797b918d107e9a1041ac24e23f6e9b576d91617bb9ef0f`);
`opus` at `xhigh` is the critic's default worker in every instance, as the
operator directed the same night; 75 minutes is the kit row's interval, the
cadence WO-276 used, and an instance sets its own; an absent private list
withholds no launch in core.
