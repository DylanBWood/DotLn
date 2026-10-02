# WO-185 — No order can exhaust the host: memory budgets for every DotLn-launched process tree and one set of gate lanes per machine (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** machinery
**Release classification:** patch. One guard process and its registration,
runner budgets and signal handling, one shared lane count, bounded
assertions in one corpus lane; no lifecycle phase and no new refusal of a
tool call.
**Cost:** adds a host guard (`scripts/host-guard.mjs`, started by the
dispatch command every harness already runs, one live instance per
machine under the Git common directory) that samples every process
descended from a registered agent session and from a running gate and
kills the offending process group; per-task and per-gate footprint
budgets in `scripts/test-runner.mjs` with the measured peak recorded on
every gate row; termination handling and a cap on captured output in the
runner; a lane count shared by every worktree of this repository;
`harness bounded -- <command>` as the one-line wrapper for a probe run
outside a gate; bounded comparisons in `corpus/harness/wo102-*.test.mjs`
and one shared helper; one role sentence. Removes: the only control that
ended the 2026-10-01 incident was another agent noticing and killing a
sibling session's processes; a gate left running without limit when its
runner dies; three or more full gates overlapping on sixteen cores (24%
of post-reuse gate wall time overlapped another order's gate). Sampling
overhead is unknown until measured (criterion 2 bounds it). Re-mints:
`scripts/test-runner.mjs` and `scripts/resume.mjs` are declared
machinery sources, so `npm test -- --review` runs before handoff; the
session is registered from `scripts/resume.mjs`, which every harness
runs at dispatch, so no generated hook and no registered evidence
source changes; if the executor finds that path cannot see the agent
process and registers from `packages/skeleton/src/harness-host.ts`
instead, the decisions say why, the harness bundle is regenerated and
the editions it stales are re-minted deterministically; no file the
feedback verifier judges is edited (`gate-deadlines.mjs` is out of
scope), so no live episode. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 7
(captured in ignored intake; SHA-256 in the ledger section of that
date); WO-102 D010 and register row FUP-4feed3b6e7a451ef (planner, high
priority); WO-105 D006; the 2026-10-02 planning pass's forensic read
([planning document](../planning/standard-pass-2026-10-02.md) §5).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: host facts are this machine's own; no stop condition.
**Depends on:** WO-107 merged (the bounded wrapper this order reuses;
closed); WO-174 merged (the runner as it stands; closed).
**Recommended placement:** the machinery lane of the head pair, beside
WO-184. This order edits `scripts/test-runner.mjs`, `scripts/harness.mjs`,
`scripts/resume.mjs` (the registration), `scripts/lib/` (the guard and
the lane count) and `corpus/harness/`; WO-184 edits
`packages/skeleton/src/` reactor, review and verification sources, the
compiler and the `scripts/lib` delivery modules. WO-186 edits the runner
next and waits for this order. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-107",
    "relation": "satisfied-by-close",
    "reason": "the bounded wrapper and its sampling this order reuses"
  },
  {
    "workOrderId": "WO-174",
    "relation": "satisfied-by-close",
    "reason": "the runner and product read guard as they stand"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/evidence/WO-102/decisions.md` D010
(the incident, the misreading and the follow-up);
`docs/evidence/WO-105/decisions.md` D006 (what stopped it; the 512 MiB
heap cap); `docs/evidence/WO-107/decisions.md` D003 and D008 (the
operator's rejection of artificially low caps; the measured gate peak);
`corpus/harness/wo107-bounded.mjs` (the sampler: aggregate resident
memory, pressure, swap, process count, time);
`scripts/probes/local-runner-load.mjs`; `scripts/test-runner.mjs`
(`executeSuite`, `scheduleSuites`, `runGateChecks`);
`packages/skeleton/src/gate-evidence.mjs` (`beginGateRun`, the per-worktree
markers); `corpus/harness/wo102-properties.test.mjs`,
`wo102-generators.test.mjs`; `corpus/mutation/mutate.mjs`;
`.claude/settings.json` (the registered hooks); the
[2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§5.

**Objective:** A process tree started by a DotLn session or gate cannot
take the machine down. Whatever started it (a gate task, a manual corpus
lane, a probe an agent typed), it is stopped when its memory footprint
passes a budget stated as a share of physical memory, the stop is a
typed, recorded failure that names the process and its measured peak,
and the known unbounded failure path in the corpus tests is removed at
its source.

**Observed gap (dated 2026-10-02, `main` at `08845c71`):**

- On 2026-10-01 a final reviewer ran an unrequired mutation probe over
  the three `wo102` test files with no bound. Single test processes
  reached 25,448,464 and 28,508,960 KiB resident on a 48 GiB host; the
  operator reported 230 GB and later 500 GB in use. It ended because the
  WO-105 executor, in another worktree, listed processes and killed them
  (WO-102 D010; WO-105 D006). No control stopped it.
- A second event that afternoon is unattributed: the system's
  out-of-memory report of 16:54:33Z names one `node` process at 388.56 GiB
  of footprint, 4.9 GiB of it resident and the rest compressed, about
  114 s after it started; 579 processes were killed for low swap. Three
  full gates were running in three worktrees at the time. Whether it was
  DotLn's is unknown.
- Resident memory does not show this growth. Both existing watchdogs
  (`wo107-bounded.mjs`, `local-runner-load.mjs`) sum resident memory from
  `ps`; the second event would have stayed under an 8 GiB resident
  threshold while the host ran out. The system's footprint figure is
  readable without privilege (`top -l 1 -stats pid,ppid,mem`, `footprint`),
  and so are the pressure level and swap use (`sysctl`).
- The likely mechanism is inferred, not measured: a failing
  `assert.deepStrictEqual` over 63,432 to 126,792 findings against an
  empty array builds a line diff whose trace is kept in typed arrays
  outside the V8 heap, so a heap ceiling (`--max-old-space-size`) does not
  bound it. `wo102-properties.test.mjs` (the two property comparisons)
  and `wo102-generators.test.mjs` (the full-grid comparison) hold such
  assertions.
- The runner bounds wall-clock only: 900 s per task, four lanes per
  gate. It captures task output without a cap, installs no termination
  handler (its detached tasks outlive it with no timer), checks for
  leftover temporary roots but not leftover processes, and nothing
  counts gates across worktrees.
- A command an agent runs outside the runner has no bound at all, which
  is how the first event began. `corpus/mutation/mutate.mjs` strips
  `NODE_OPTIONS` and runs package test files at the default concurrency
  of fifteen.
- No footprint baseline exists for any task. The one measured figure is
  resident: a full serial `npm test` peaked at 1,239,662,592 bytes
  across its processes (WO-107 D008).

**Design (scope discipline):**

- **Budgets are shares of physical memory, generous by intent.** One
  task's process tree: one quarter. One gate: one half. Everything
  attributed to DotLn sessions and gates on the machine: two thirds.
  The values live in `docs/control/budgets.json` beside their basis (the
  measured peaks this order records) and are never trimmed to fit; a
  task that needs more raises its own figure with the measurement.
- **The guard does not depend on the agent.** The dispatch command
  walks its own ancestry to the agent process and registers it as a
  root, under every harness; the guard walks the process table from
  registered roots and live gate markers,
  reads the cheap host signals (pressure level, swap growth) on a short
  interval and per-process footprint on a longer one or when a signal
  fires, and on a breach sends the kill to the offending process group
  at once, never to the agent process itself. A second guard start finds
  the first and exits. A guard that cannot read a signal says which and
  keeps the others.
- **The runner enforces the same budgets for its own tasks**, records
  the peak footprint each task reached on the gate row, fails the task
  with the typed reason `memory-budget` and the measured figure, kills
  its task groups on interrupt, termination and hang-up, sweeps for
  surviving task processes when the gate ends, and keeps a bounded tail
  of each task's output with the dropped byte count.
- **Lanes are shared.** The four-lane cap becomes a machine-wide count
  under the Git common directory: a gate takes lanes as they free up and
  prints that it is waiting and for which worktree. Final review's gate
  takes its lanes like any other.
- **A probe outside a gate runs under `harness bounded -- <command>`**,
  which applies the task budget and prints the typed stop. The role text
  says so in one sentence; the guard still covers a session that ignores
  it.
- **The corpus lane's failure path is bounded at its source.** A sweep
  keeps the first findings up to a fixed count and a total; a test
  compares counts, the kept findings and a digest, through one shared
  helper, and never hands an unbounded collection to a structural
  assertion.
- **The mechanism is confirmed or corrected under a bound.** With the
  task budget set low, one planted drift is run once; the sampled stack
  either shows the assertion diff or the decisions record what it showed
  instead.
- **Declined alternatives, recorded:** a V8 heap ceiling as the bound (it
  misses memory outside the heap, which is where both events grew, and
  the operator rejected low caps in WO-107 D003; kept only as an
  optional default for runner-launched processes if the measurement
  shows it helps); operating-system address-space limits (not a
  dependable cap on this platform and able to stop the runtime from
  starting; unverified, so not relied on); a system service installed
  outside the repository (an account setting, not this order's to
  change); refusing unwrapped commands in the tool hook (a refusal that
  turns on command classification, the class of rule the stand-down
  removed); a resident-memory watchdog (the second event shows it blind).

**Deliverables:** the guard, its registration and its incident rows; the
runner's budgets, peaks, signal handling, survivor sweep and output cap;
the shared lane count; `harness bounded`; the bounded corpus assertions
and helper; the confirmation record; the budgets with their basis; the
role sentence; fixtures; the write-backs below.

**Acceptance criteria (all required)**

1. A fixture process that allocates zero-filled memory until told to
   stop, and stops by its own ceiling at one eighth of physical memory
   so the fixture cannot harm the host, is run three ways with the task
   budget set below that ceiling for the test: as a gate task, under
   `harness bounded`, and as a bare child of a registered session with
   only the guard watching. Each run ends with the fixture's process
   group killed before it reaches its own ceiling, a typed
   `memory-budget` stop naming the process, the budget and the measured
   peak footprint, and no surviving descendant. The same three runs with
   a fixture whose resident memory stays low while its footprint grows
   end the same way.
2. A gate row records each task's peak footprint and the gate's. The
   budgets in `docs/control/budgets.json` name the measured peaks they
   rest on, from one full `npm test -- --review` on this host, and each
   budget is at least four times its measured peak. The decisions record
   the guard's and the runner's sampling cost from that run; if either
   adds more than two percent to the gate's wall-clock, the interval is
   raised and the overshoot it allows at the second event's growth rate
   (about 3.4 GiB per second) is stated.
3. A runner that receives an interrupt, a termination or a hang-up kills
   every task group it started and records no row; a fixture task that
   leaves a detached child alive fails the gate with the child named;
   captured output above the cap is cut to its tail with the dropped
   byte count, and a failing task's diagnostic lines still print.
4. Two gates started in two worktrees of one repository never hold more
   lanes together than the machine-wide count; the second prints that it
   waits and for whom, and both pass. A stale lane holder whose process
   no longer exists is reclaimed without a human. A fixture pins each
   case.
5. With one planted drift over the full grid, each `wo102` test file
   fails in bounded time and memory under the task budget, reporting the
   total, the kept findings and the digest, and passes unchanged on the
   unmodified kernel. A check over `corpus/harness/` test files refuses
   a structural equality assertion whose argument is a sweep's findings
   collection and names the helper. The judgment is against the
   declared set, the `wo102` files and the helper's consumers; a case
   outside it is a follow-up, not a failure.
6. The confirmation run is recorded: the command, the budget, the
   sampled stack and what it shows. If the assertion diff is not the
   grower, the record says what was, and criterion 5's helper is judged
   against that cause.
7. Write-backs land, each in place: the role sentence in the generated
   skill roots (a probe outside a gate runs under `harness bounded`, one
   process at a time); product 07 §Discipline (the budgets, the guard,
   the shared lanes); `docs/AI-HARNESS-SECURITY.md` where it describes
   what a session may run; the decisions file; register row
   FUP-4feed3b6e7a451ef retargeted at close.
8. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts of criteria 1, 3, 4 and 5 with
the host they ran on; the measured peaks and sampling cost; the
confirmation record; `npm test -- --review` before `implementation-ready`
because `scripts/test-runner.mjs` is a declared machinery source, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 7.

**Known issues and carry-ins:** none at filing. The order's own tests
must never run an unbounded allocation: every fixture carries its own
ceiling (criterion 1).

**Non-goals:** changing which suites a gate runs or reusing their results
(WO-186); a guard for processes no DotLn session or gate started; a
system service or account setting; per-suite time budgets; bounding
`corpus/mutation/mutate.mjs` beyond running it under `harness bounded`
(its own concurrency is a follow-up if the wrapper proves too coarse);
attributing the second event.

**Operator-review assumptions**

1. Budgets of one quarter, one half and two thirds of physical memory
   are generous enough not to be stingy and small enough to keep the
   machine usable; the operator may set other shares at review.
2. Killing a process group that crosses a budget is acceptable without
   asking, since the alternative observed twice was the host running out
   of memory; the stop is recorded and counted by `plan failures`.
3. Gates that wait for lanes are preferable to gates that overlap; the
   wait is printed, and WO-186 reduces how much each gate needs to run.
4. The guard is started by the project's own dispatch and gate commands
   and lives only while a session or gate does; it is not installed as
   a system service.
