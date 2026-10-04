## Release overview

This release keeps DotLn's own work from taking the machine down. On 2026-10-01 a probe over the corpus tests grew until the host ran out of memory. It stopped only because an agent in another worktree noticed and killed its processes. Now every process tree a DotLn session or gate starts runs under a memory budget measured as physical footprint, which counts memory held outside the JavaScript heap and compressed memory. A tree that crosses its budget is stopped automatically and recorded as a typed `memory-budget` stop that names the process, the budget and the measured peak. The visible changes:
- Gates, probes and bare commands an agent starts are all supervised, by the runner and by one guard per user on the host.
- Gates in every worktree and clone on the host share four lanes, and a waiting gate says whom it waits for.
- `node scripts/harness.mjs bounded --`, followed by the command, is the way to run a probe outside a gate.

The release is for operators and agents who run gates, probes and corpus lanes on a shared machine.

## Read before upgrading

- **Gates may wait.** Four lanes are shared by every gate on the host, across worktrees and clones. A gate that used to overlap another now waits for a free lane and prints a `WAIT host lanes` line naming its worktree and task and the holder.
- **Budgets stop work.** A task that passes one quarter of physical memory, a gate that passes one half, or all DotLn trees together passing two thirds, has the offending process groups killed. The stop is recorded and counted by `plan failures`. The budgets and the measured peaks they rest on are in `docs/control/budgets.json`, and each budget is more than eleven times its peak on the measuring host.
- **Stops are sampled.** Signals are read every second and a full footprint census runs every four seconds, with earlier censuses at startup and on memory pressure or swap growth. At the 2026-10-01 growth rate of about 3.4 GiB/s, a tree can overshoot by a nominal 3.4 to 13.6 GiB before it is stopped, plus observation and cleanup latency. Sampling is not a hard ceiling.
- **Containment is not absolute.** Ownership follows observed ancestry and the task's inherited output sockets. A process that drops every such mark before any ancestry edge is observed can still escape, as can a bare tree with its ancestry missing. This is recorded on FUP-d0a9719cc2e4ec55.
- **A running guard keeps its code.** A guard already running when you upgrade keeps its starting code until it retires (FUP-c1a89d52cc314af9).
- **Platform.** The footprint census is a small native helper compiled on first use, so a C compiler is required. Only macOS is exercised; Linux accounting is untested.
- **No new authority.** The wrapper adds no allow-list entry, and the guard is neither a system service nor an account setting. The census reads no process environments, arguments or paths.
- **Component versions.** The skeleton moves to 0.52.1, and the console pins it exactly. No dependency is added.

## Substantive changes

**Host guard.** Each role dispatch walks its own ancestry to the agent process and registers it with one guard per user. Every clone and exported instance finds that guard through the operating system's per-user temporary directory, whatever the repository or `TMPDIR`. The guard samples every process descended from a registered session or a running gate, and kills the offending process group on a breach, never the agent process itself. A guard stop names the largest member of the group. An unreadable signal is reported, and the guard keeps the others.

**Runner.** Each gate row records every task's peak footprint and the gate's. A breach kills the task, or every task of the gate, before any incident is written. An unwritable incident ledger is reported on the row and cannot keep a task alive. On SIGINT, SIGTERM or SIGHUP, the runner kills every task group it started and records no row. A detached descendant that outlives its task fails the task as `surviving-process`, named and killed. Captured output keeps a bounded tail with the dropped byte count, and failure diagnostics, including indented TAP failures, still print.

**Bounded probes.** `node scripts/harness.mjs bounded --`, followed by a command, runs that command with its arguments, environment, working directory and exit status unchanged, under the task budget, a 900-second deadline and a bounded output tail. A memory-budget stop exits 125. Every role's instructions now say to run probes this way, one at a time.

**Corpus tests.** The `wo102` tests compare a sweep's findings through one helper that reports the total, the first 32 findings and a digest, and never hands the whole collection to a structural assertion. A check refuses such an assertion in the declared test files. The corpus generator refuses to write a quarantine larger than its retention limit. With one planted drift, each `wo102` file now fails in 3 to 4 s at under 300 MB of footprint, where single test processes reached 24 and 27 GiB resident on 2026-10-01. The confirmation run showed the assertion error's construction and formatting as the grower.

## Progressive polish

Product 07 §Discipline and `docs/AI-HARNESS-SECURITY.md` describe the budgets, the guard, the shared lanes, the wrapper and the ownership limit. `plan failures` counts a stopped tree once when both the guard and the runner record it. Test and fixture stops go to disposable fixture repositories, never the real checkout's ledger. The seven earlier test rows are kept in an ignored archive outside the count. New fixtures pin each behavior, among them zero-filled and low-resident growth, double and triple forks, recycled descriptors, lane sharing at 16, 4 and 2 CPUs, and unwritable ledgers.

## Evidence and compatibility

Application `v0.66.1` is a patch release over `v0.66.0`, built from WO-185 on `main` at `340a67c9`. The skeleton moves 0.52.0 → 0.52.1. Kernel, compiler and console sources are unchanged apart from the console's exact pin, and no dependency was added.

The verification sequence:
- [VER-001](../../verifications/WO-185/VER-001.md) failed on a double-forked descendant that survived its task, with four adjacent defects.
- [VER-002](../../verifications/WO-185/VER-002.md) failed on a recycled descriptor that adopted unrelated processes.
- [VER-003](../../verifications/WO-185/VER-003.md) passed.
- [FINAL-001](FINAL-001.md) failed on three findings: a budget stop that recorded before it killed, a nonfinite quarantine that no longer round-tripped, and a wrapper that changed the command it ran.
- [VER-004](../../verifications/WO-185/VER-004.md) passed after their repair.
- [FINAL-002](FINAL-002.md) passed.

A fresh `npm test -- --review` at the reviewed subject passed 40 of 40 suites with 85 tasks in 852 s, with runner sampling at 0.955% of the gate's wall-clock. `npm run test:docs` passes.

Known limitations:
- The no-mark ownership gap and live-guard upgrades are recorded above.
- Five low-severity bookkeeping items from VER-004 stay recorded on FUP-e8f5399db33d0b5a: a possible second incident for one stopped tree, a guard stop that can be classified as an operator stop after a failed latest-incident write, one lease lookup per nested gate, lost denial detail, and a withdrawal failure labelled `launch`.
- Peaks are sampled, not continuous maxima.

Details are in the [decisions](../../evidence/WO-185/decisions.md) and the [handoff](../../evidence/WO-185/handoff.md).
