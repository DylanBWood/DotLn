# Engineering review of the gate-reuse line, WO-125 through WO-131

Recorded 2026-09-14 during the WO-131 repair, under amendment 17 of the work
order. Reviewer: the WO-131 repair session (Claude Code 2.1.270,
`claude-fable-5-1` at max effort, self-reported). The subject is the code and
evidence these six orders left in the tree at the repair's checkpoint, read at
current bytes: `scripts/test-runner.mjs`, `scripts/lib/suite-evidence.mjs`,
`scripts/lib/suite-replica.mjs`, `scripts/lib/suite-sandbox.mjs`,
`scripts/lib/lifecycle-evidence.mjs`, `packages/skeleton/src/gate-evidence.mjs`,
`packages/skeleton/src/gate-deadlines.mjs`, the evidence and spawn paths of
`packages/skeleton/src/harness-host.ts`, the evidence step of
`scripts/release.mjs`, the six orders' decisions and their verification and
final-review reports. Measurements below were taken on the operator's host in
this sandboxed session unless a row says otherwise.

The question asked was whether the work was programmed and written as well as
it could be. The short answer: the mechanism is sound and the cost model is
right, and the line failed its own purpose three times for one reason that no
order named. Every reuse key was measured inside one shell session, so each
order shipped a key that carried a value of that session and discovered it
only when another session paid a full gate. This repair removes the last two
such values and makes the runner name the next one.

## What is sound

- **Evidence by exact tree.** A lifecycle transition needs a recorded green
  run at the current tree hash, from any session, with `git diff --check`
  beside it (`scripts/lib/lifecycle-evidence.mjs`). A failed verification
  needs only the diff check. The ledger is bounded at 256 rows with per-tree
  archives and failed output stored by digest
  (`packages/skeleton/src/gate-evidence.mjs`). This is the right shape and it
  has not failed.
- **Sealed suite successes keyed by declared inputs.** The key covers the
  declared candidate bytes, listings and modes, the declared Git state, the
  projected environment, the toolchain digests and the installed roots; the
  after-gate snapshot invalidates any row whose inputs moved during the gate;
  a refused narrowing falls back to the whole-tree contract under a distinct
  key. The seal and the source provenance are correct and the fixtures cover
  the invalidation classes.
- **Replica execution.** A narrowed suite runs in a copy of exactly its
  declared inputs with the installed roots linked from one verified read-only
  copy, a replica repository where declared, `GIT_CEILING_DIRECTORIES` at an
  unlistable parent and no candidate path in arguments or environment. The
  four undeclared-read counterexamples fail loudly. The installed-link and
  partial-copy defects that broke the WO-130 release close are repaired in
  WO-131 and covered.
- **Deadlines from declared load.** A gate child's timeout is its measured
  baseline times a factor the scheduler declares, the peer set at a hit is
  recorded, and the gate row carries every task's start, end and peers. The
  exclusivity re-measurement (WO-128 F2) was honest about its 204 s cost.
- **The write guard during a live gate** (WO-125 D003, D004, D005) has held
  through every later order; its one cost is that a session cannot stop its
  own gate (VER-001 O1), which belongs to the recovery-helper candidate.

## Findings, ranked

### R1 — reuse was conditional on a kernel denial no role session can obtain (blocking; repaired, D019)

VER-001 F1 and F2. Amendment 13 and D009 made a narrowed success recordable
and reusable only under an applied `sandbox-exec` denial, which every
sandboxed Claude or Codex session on this host refuses to start. The first
independent later-phase gate therefore ran 807.236 s with 79 fresh tasks at a
document-only delta, and a byte-identical rerun re-executed because the
unavailable branch produced no key at all. Criterion 5 had said the opposite
in as many words. Repaired by removing the four guards; the probe, wrapper and
sealed provenance remain, and every gate and suite row still records whether
the denial applied. Fixtures: `scripts/test-suite-sandbox.mjs` (unavailable
host narrows, records, reuses; a protected record is reused without the
denial; an available session reuses an unprotected one), the three-role
lifecycle fixture with sandboxed later sessions, and the release-close
composition fixture with a sandboxed close.

### R2 — per-shell PATH entries forked every narrowed key across sessions (blocking; repaired, D020)

With the denial forced available, every narrowed key in this session differed
from the operator's records of minutes earlier in the environment class. The
session PATH carried two dangling fnm multishell directories named by shell
process id and a dangling harness plugin directory. Nothing in WO-129, WO-130
or the WO-131 changed-session row varied PATH between shells, so the
mechanism would have measured zero cross-session reuse even after R1.
Repaired: a replica's PATH, in execution and key, is the ordered list of
existing physical directories, deduplicated, with candidate entries keeping
their replica mapping. Two sessions now share a key exactly when every
executable resolves through the same physical directories in the same order.
Fixture in `scripts/test-suite-evidence.mjs`.

### R3 — the fresh explanation could not name which variable changed (high; repaired)

`explainSuiteFresh` named the input class only. For source and documents it
listed paths; for the environment it said "environment". That is why R2
survived three orders and why WO-130 D009 diagnosed three variables by
inspection rather than by evidence. Records now carry a per-variable digest
map beside the key (never a value), and a fresh line reads
`environment: LANG, PATH`. Older records without the map keep validating.

### R4 — the success cache grew without bound (medium; repaired)

1,909 records and 154 MB accumulated in 38 hours, 1.1 MB per gate from the
seven whole-tree inventories alone, because the current-tree checks write a
full-tree path map every gate and nothing pruned. WO-126 VER-001 F8 raised
this for the checks ledger, which was bounded; the suite cache WO-129 added
was not. Repaired: each suite keeps its newest 24 records, pruned at save
time; a concurrent gate reading a pruned record simply runs fresh. Fixture in
`scripts/test-suite-evidence.mjs`.

### R5 — subagent spawns were refused with a misleading label (high; repaired, D021, adjacent-0007)

`permissionEffect` in `packages/skeleton/src/harness-host.ts` threw a plain
`Error` for every spawn-class tool, and the hook's catch-all reported any plain
error as `host facts or pinned runtime unavailable`. A read-only Explore
delegation in this session was refused under that label; the same label hid
WO-126 VER-003 F19 and WO-131 VER-001 O1. The refusal was policy, the label a
defect, and the policy cost throughput for no isolation gain, since the
subagent's own tool calls pass the same guards. Repaired: a same-host spawn is
admitted as a read-only effect and reserves nothing, a remote spawn is refused
by name, classification refusals carry their own message, and the catch-all
names the failure class. Proven through the emitted hook in
`scripts/test-process-debt.mjs`. The emit that installs the changed host wrote
the manifest and snapshot and was refused at `.claude/hooks` by this session's
sandbox; the operator installs the hooks from a terminal with
`npm run harness -- emit`.

### R6 — the evidence command runs the full gate for a verdict that needs only the diff check (medium; not changed)

VER-001 O2. `npm run harness -- evidence` always runs `npm run test:full`,
while a failing verification needs only `git diff --check`. With R1 and R2
repaired the composed gate costs about a minute in any session, which is why
this is not repaired here: it would change the host command and re-pin the
runtime for a saving that the reuse already delivers. Named for planning.

### R7 — three orders each keyed reuse on a value of the measuring session (design; recorded)

WO-129 shipped keyed on the checkout path through npm's environment (VER-001
F1), WO-130 on `CLAUDE_PID`, `GIT_SSH_COMMAND` and `TMPDIR` (D009), WO-131 on
denial availability and PATH (R1, R2). The criterion that would have caught
all three, "a second role session at identical declared bytes reuses", was
each time satisfied by a same-session proxy. The durable correction is
procedural and cheap: the cross-session row is produced only by a different
process started from a different shell, and the runner now names the
variable when it misses. The next verification of this order is that row.

### R8 — accepted design limits, now written down

- The scheduler's gate context (`DOTLN_GATE_*`) is execution-only and
  outside the key by design; it names runner diagnostics and this host's
  declared load. The comment in `suiteEnvironment` now says so.
- The key omits the CPU count and OS release, so a success is valid only on
  the machine that recorded it; the cache lives in that machine's Git common
  directory and WO-129 D003 already names cross-machine sharing as a
  reopening condition.
- Whole-tree records for the current-tree checks carry the full inventory.
  They reuse only at an identical tree, which the identical-tree reruns show
  happens; R4 bounds their cost.
- The absolute-path residual: a suite that reads an undeclared candidate file
  by a literal absolute path in a session without the denial is not caught.
  The real-host counterexample still runs where the denial is available, and
  D019 records the reopening condition.

## Per-order assessment

| Order | What it built | Judgment |
| --- | --- | --- |
| WO-125 | Codex effort selection; the live-gate write guard with process-owned markers and hard-link protection | Sound; the guard is conservative and has held. |
| WO-126 | Lifecycle evidence by tree hash, advisory Stop, read obligations, the meter, the effect classifier | Sound in shape; seven verifications were spent mostly on the shell classifier, whose residuals F31 to F33 are carried as follow-ups. The full-gate reliability finding (F13, F33) was resolved by WO-128. |
| WO-128 | Load-derived deadlines, timeline rows, exclusivity re-measured | Sound and honestly measured; D010 left the scheduling flags as an operator decision and amendment 15 reopened it. |
| WO-129 | Declared-input keys, shared cache under the Git common directory, fresh explanations | Sound model; shipped with the checkout path in the key (F1) and, unmeasured, the per-shell PATH (R2). The explanation gap (R3) is the reason both took another order to see. |
| WO-130 | Replica execution, installed copy, replica repository, undeclared-read counterexamples | Sound and the most valuable step in the line; its release close failed on the installed-link and partial-directory defects WO-131 repaired. D009 was a later amendment, not the original design. |
| WO-131 | Remaining declarations, per-suite environment declaration, release-close admission, installed-link repair, operator controls, measured return | Declarations complete and the measured same-session return real; the cross-session claim was a proxy (R7) and the denial condition reversed the order's own criterion 5 (R1). |

## Bounded repairs applied in this session

- Removed the denial condition from `replicaPlan`, `suiteInputHash`,
  `valid` and `saveSuiteSuccess` (R1).
- Canonical replica PATH in `projectReplicaEnvironment` (R2).
- Per-variable environment digests in records and explanations (R3).
- Success-cache pruning at 24 records per suite (R4).
- Same-host subagent spawns admitted, remote ones refused by name, typed
  classification refusals and a catch-all that names its failure (R5).
- Fixtures for each, the three-role and release-close fixtures under
  sandboxed later sessions, the product 07 rule, D019 to D021, amendments
  16 and 17.

## Filed elsewhere

- Planning: R6, and the recovery helper that VER-001 O1 belongs to.
