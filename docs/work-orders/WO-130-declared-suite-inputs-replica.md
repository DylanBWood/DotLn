# WO-130 — Narrowed suites execute inside a replica of their declared inputs, so an undeclared file cannot influence any run, and the package suites stop re-executing for source they never read (v0.17.5)

**Model:** any capable model; the measured gates run on the operator's
machine. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure and local gate
evidence: the runner gains a replica execution path and a declaration table;
no exported runtime capability or contract changes. Assigned at activation
under the standing opt-out default.
**Cost:** adds one plain copy of the installed roots per fresh gate (43 MB of
`node_modules`, 2.5 MB of package builds and 10 MB of the pinned harness
snapshot, about 1,400 files, measured 2026-09-12) and one copy of each
narrowed suite's declared paths per fresh execution of that suite, in ignored
scratch; no step, command or prompt. Removes the re-execution of the package
suites after changes to source they never read: today every reusable suite's
key selects every non-document candidate file, so a change under `scripts/`,
`corpus/` or a fixture re-executes `kernel`, `compiler` and `skeleton`
(89–162 s for `skeleton` alone on 2026-09-12) although a declaration
covering only their built packages and declared documents would reuse them.
The post-transition class is WO-129's removal and the document-only class is
WO-131's; neither is counted here.
**Nomination provenance:** the operator's 2026-09-12 planning dispatch
relaying a second model's plan for proof-carrying gates, whose "explicit
per-suite dependencies" and "hermetic execution" defenses this order lowers
into execution inside a replica; refutation receipts 009 and 010 of the same
pass, whose holds on this order's criterion 2 showed that no finite set of
replica probes can validate a declaration against a guarded conditional read
(an existence check, a regular-file check, a declared flag that selects the
read), so validation is replaced by construction; and the pass's host probes
of 2026-09-12: nested `sandbox-exec` refused inside a sandboxed session
(`sandbox_apply: Operation not permitted`), forced clone-on-write refused
(`ENOSYS`), installed roots 55 MB in about 1,400 files. WO-126-D009 chose
conservative whole-tree reuse for unknown scopes because no mechanism
established a declaration; this order makes the declaration the suite's
world. Planner-synthesized draft; the dispatch is preserved verbatim in the
pass's ignored capture. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-129 merged (the per-suite key model, the shared cache and
the miss explanations that the replica key and its diagnostics build on).
**Recommended placement:** third of the gate orders, after WO-129 in the same
serial lane; it edits `scripts/lib/suite-evidence.mjs`,
`scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`,
`scripts/test-process-debt.mjs` and product 07. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-129",
    "relation": "hard",
    "reason": "the per-suite key model, the shared cache and the miss explanations that the replica key and its diagnostics build on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (process
budget; gate execution and reuse; gate input protection; write once, run
once); §Goal-aligned decisions; `scripts/lib/suite-evidence.mjs` (`scopes`,
`suiteScope`, `suiteInputHash`, `suiteEnvironment`); `scripts/test-runner.mjs`
(`suites`, `expand`, `executeSuite`, `expandSuiteTasks`);
`scripts/lib/gate-evidence.mjs` (`gateInstalledInputRoots`, `gateInputPath`);
`scripts/lib/release-fixtures.mjs` (the sealed template copy);
`docs/evidence/WO-126/decisions.md` (D009, D012);
`docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-009.md` and
`-010.md` (the holds on criterion 2); `docs/evidence/WO-129/decisions.md`
(once filed).

**Objective:** A narrowed suite never sees the candidate tree. The runner
executes it inside a replica that contains exactly its declared candidate
paths, the installed roots (`node_modules`, each `packages/*/dist` and
`.runtime/harness`) and, when declared, an initialized Git repository of
those files; the replica's working directory, the suite's arguments and its
projected environment carry no path into the candidate tree. The suite's
outcome is therefore a function of the declared bytes, the installed roots,
the toolchain and the projected environment, which are exactly its key. An
undeclared file cannot change a fresh run or a reused one, whether the suite
would read it unconditionally, after an existence check, after a
regular-file check, after reading a declared flag that selects the read, or
not at all: in every run the file does not exist. Whole-tree suites keep
running in the candidate tree. There is no validation step and no validation
record; the declaration is enforced by the replica at every execution.

**Observed gap (dated 2026-09-12, `main` at `baa7a9e`):**

- The six reviewed scopes of WO-126-D009 (`kernel`, `compiler`, `skeleton`,
  `worktree`, `plan-refutation:fixtures`, `process-debt`) and the release
  cases reuse successes that executed in the candidate tree, on the basis of
  a human read inventory; nothing prevents a scoped suite from reading a
  document outside its scope, and every other suite selects the whole tree
  (`suite-evidence.mjs:86–107`, `:368–389`; `test-runner.mjs:455–466`).
- Receipt 009 held criterion 2 because a replica that omits undeclared files
  validates a suite that reads an optional file only when present; receipt
  010 held it again because a replica that substitutes a directory is skipped
  by a regular-file check, and because a validation record keyed without the
  declared inputs that select read paths stays current after a declared flag
  flips. Both are instances of one fact: a probe set cannot validate a
  declaration against an arbitrary guard, so a validated declaration must not
  license reuse of a run that executed against the real tree.
- Host probes of 2026-09-12 from a sandboxed role session: `sandbox-exec`
  with a read-denying profile is refused (`sandbox_apply: Operation not
  permitted`), so a kernel sandbox cannot be the mechanism for gates that
  run inside sessions; `COPYFILE_FICLONE_FORCE` is refused (`ENOSYS`), so
  replicas must be plain copies; the installed roots total 43 MB in 288 files
  (`node_modules`), 2.5 MB (package builds) and 10 MB in 1,053 files
  (`.runtime/harness`).
- Every reusable suite's key selects every non-document candidate file, so a
  source change anywhere re-executes the package suites: `skeleton` ran
  89–162 s in the 2026-09-12 fresh gates for changes under `scripts/`.

**Design (scope discipline):**

- Replica construction. Once per fresh gate the runner copies the installed
  roots into gate-owned scratch outside the candidate tree, verifies the copy
  against the observed installed roots and makes it read-only. For each
  fresh execution of a narrowed suite it builds, under a nonce-named
  directory whose parent the suite cannot list, a replica root holding the
  declared candidate paths (regular files with their modes; a symlink inside the declared set is
  recreated only when its target is inside the replica, otherwise the suite
  is not narrowed for that run) and links `node_modules`, each
  `packages/<name>/dist` and `.runtime/harness` to the per-gate copy, never
  to the candidate tree. A declaration's `git: replica-repo` initializes the
  replica as a repository with the declared files committed under a fixed
  identity and timestamp, for suites that need a repository root and nothing
  from the real history; `git: none` is the default. Nothing outside the
  replica is reachable by walking up from it except the read-only per-gate
  copy: the scratch parent is not listable and sibling replicas are
  nonce-named.
- Execution. The suite runs with the replica as its working directory; test
  globs expand in the replica; the projected environment replaces `PATH`
  entries inside the candidate tree with their replica counterparts and
  refuses narrowing when any other projected value would carry the candidate
  tree path; `TMPDIR` stays the suite's own temporary root. The existing
  before/after comparison of suite inputs in the candidate tree remains.
- Key. The narrowed suite's key is WO-129's key with the declaration as its
  scope: the declaration, the declared paths' bytes, types and listings, the
  installed roots, the toolchain, the projected environment, the command and
  the replica mechanism version. A fresh replica run and a reuse share the
  key by construction.
- Failure. A narrowed suite that fails in its replica fails the gate loudly,
  naming the suite and, from the suite's own diagnostic, the first path it
  could not read; the executor declares the path or retains the suite
  whole-tree with a reason. There is no silent fallback to the candidate
  tree: a replica failure is a declaration defect or a real defect, and the
  gate says which it could tell.
- What the replica establishes, and its one residual. Every access a suite
  makes through its working directory, its own files, relative paths and the
  projected environment is confined to the replica, whatever guard precedes
  it. Not prevented without a kernel sandbox is an absolute path into the
  candidate tree hard-coded in a suite or derived from nothing the runner
  projects. The runner refuses narrowing when its working directory, argument
  list or projected environment would reveal that path; the suites are
  in-repository source under review; and WO-131 adds a kernel denial of
  candidate-tree reads where the host permits one. This residual is the same
  one the reviewed scopes of WO-126 carry today; the replica removes the
  guarded-read class entirely.
- **Declined alternatives, recorded:** validation by probing replicas (receipts
  009 and 010: no finite probe set survives an arbitrary guard); a kernel
  sandbox as the primary mechanism (refused inside a sandboxed session on
  2026-09-12; retained as an additional denial where available, WO-131); an
  observation preload as the sole basis (it covers Node processes only, and
  the shell suites and Git children are unobservable without privileges);
  access-time tracking (it cannot capture a probe of an absent path);
  clone-on-write as a requirement (refused with `ENOSYS` in the session;
  plain copies of 55 MB suffice); a silent fallback to the candidate tree
  when a replica run fails (it would hide an incomplete declaration).

**Deliverables:** the replica construction and execution path; the
declaration table with `git: none | replica-repo`; the migrated scopes; the
fixtures named below; the write-backs.

**Acceptance criteria (all required)**

1. For each narrowed suite, a fresh execution runs inside a replica
   containing exactly the declared candidate paths, the installed roots
   linked from one read-only per-gate copy verified against the observed
   installed roots and, when declared, an initialized repository of those
   files; the replica and the per-gate copy live outside the candidate tree
   under a nonce-named directory whose parent the suite cannot list; the
   replica's working directory, the suite's arguments and its projected
   environment contain no path into the candidate tree, or the suite is not
   narrowed for that run; a fixture proves the replica's contents, the
   read-only copy, the unlistable parent and the absence of the candidate
   tree path from the working directory, the arguments and the environment.
2. Four fixture suites read an undeclared candidate file unconditionally,
   after an existence check, after a regular-file check, and after reading a
   declared flag that selects the read. Under replica execution the first
   fails the gate naming the path; each of the other three produces the same
   outcome and the same key whether the undeclared file is absent, present,
   present as a directory or changed in the candidate tree; and flipping the
   declared flag changes the key while the fresh replica run still never sees
   the undeclared file. A fifth fixture proves that a symlink in the declared
   set whose target is outside the replica refuses narrowing for that run.
3. The six reviewed scopes and the release cases of WO-126-D009 execute in
   replicas; a scope that fails in its replica is declared further or
   retained whole-tree with a reason within this order, and the execution
   record names each outcome.
4. A narrowed suite's key covers the declaration, the declared paths' bytes,
   types and listings, the installed roots, the toolchain, the projected
   environment, the command and the replica mechanism version, and nothing
   else; the WO-129 miss explanations name the declared paths that changed; a
   fixture proves that a change under `scripts/` leaves a package suite whose
   declaration excludes it reused, and that a change under a declared
   directory re-executes it.
5. A narrowed suite that fails in its replica fails the gate, naming the
   suite and the first unreadable path from its diagnostic; no automatic
   fallback to the candidate tree exists; the same suite passing in the
   candidate tree does not change that outcome (fixture).
6. Measured on the operator's host: one fresh full gate records the replica
   setup wall-clock and the per-gate installed copy beside the suite
   durations; one source change under `scripts/` that no package suite
   declares composes the package suites, recorded beside a fresh run.
7. Write-backs land: 07 §Discipline (the gate execution and reuse bullet),
   `docs/evidence/WO-130/decisions.md` with dispatch sources and reopening
   conditions, the decisions index and the follow-up register; `npm test`
   green; `git diff --check` clean; no new dependency.

**Evidence gate:** `npm run harness -- evidence`; the fixture transcripts; the
operator-host rows of criterion 6.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** declarations for the remaining whole-tree suites and the
document-only composed gate (WO-131); the kernel denial where the host
permits it (WO-131); the key model and the cache (WO-129); deadlines and
exclusivity (WO-128); an observation runtime; deleting or merging tests.

**Operator-review assumptions**

1. Replicas and the per-gate installed copy live in scratch outside the
   candidate tree, never under the repository root, are disposable and are
   removed when the gate ends.
2. The absolute-path residual is accepted as the limit the reviewed scopes
   already carry, with in-repository review as its control until WO-131's
   kernel denial applies where the host permits it.

## Execution record

Known issue, operator override 2026-09-12. Refutation receipt 011 held
criterion 1: a declared fixture can contain an absolute path into the
candidate tree in its own source and read it without that path appearing in
its working directory, arguments or environment, so the replica does not
establish a universal execution boundary; the residual paragraph in the design
already names this case. The operator overrode the hold rather than reworking
the contract a third time: the pass plans a platform, and the residual is the
same one the reviewed scopes of WO-126 carry today. Treat it as a known issue
with review of narrowed suites as its control. Reopen when it becomes
applicable or bites: a narrowed suite is observed reading the candidate tree
through an absolute path the runner did not project, or a reused success is
contradicted by a fresh run of the same suite at the same key. Either
observation returns this order's criterion 1 to planning as a new decision
proposal. The override event, its actor and the capture's SHA-256 are in
`docs/control/plan-refutations.jsonl`.

## Execution record

2026-09-13 executor result, prepared for independent verification. The fresh
operator-host full gate passed all 37 aggregate suites and 78 tasks in 805.284
seconds. Kernel, compiler, skeleton, worktree, plan-refutation:fixtures and
process-debt each executed successfully in a replica. Release preparation and
all 40 release cases also passed in replicas. No required scope was retained
whole-tree; the remaining suite scopes keep their existing whole-tree policy.

The gate created 47 replicas, using one verified read-only installed copy of
50,685,411 bytes in 1,099 files. That copy took 242.173 ms; per-replica setup
totalled 24,402.857 ms. A single temporary source file under scripts, outside
the three package declarations, then produced a green npm test in 48.063
seconds with kernel, compiler and skeleton reused at unchanged keys. Their
source executions totalled 210.411 seconds. Removing only that probe restored
the fresh measurement's exact candidate tree. Full and fast durations are
different inventories, not a speedup ratio.

The [execution evidence](../evidence/WO-130/README.md),
[per-task host rows](../evidence/WO-130/replica-measurements.json),
[nine-case fixture transcript](../evidence/WO-130/fixture-transcript.txt) and
[decisions and corrections](../evidence/WO-130/decisions.md) record the
outcomes, sources, tradeoffs and reopening conditions. Local release v0.17.5
patches skeleton to 0.15.5 without a new dependency or exported contract change.
The accepted absolute-path residual remains. The canonical harness evidence
gate is required before the implementation-ready transition.

## Execution record

2026-09-13 repair after VER-001, prepared for independent verification. F1
had one cause: this host's Claude Code sessions export a harness-injected Git
configuration family (`GIT_CONFIG_COUNT` with four `safe.directory` entries
naming the checkouts, and `GIT_CONFIG_PARAMETERS`), the replica projection
refused to narrow on it, and a refusal left every declared suite without any
key. The repair drops that family from the reviewed projection in execution
and key alike, keys a refused narrowing under the pre-order whole-tree
contract with the refusal named on the task row and a key distinct from any
replica key, bounds Git discovery in a `git: none` replica to its unlistable
parent, and makes every fixture assert replica creation (F2) and a non-null
baseline before comparing keys. The replica mechanism version is 2.

Measured in this Claude Code session with the injected configuration present:
`npm run test:full -- --fresh` passed all 37 aggregate suites and 78 tasks in
798.414 seconds, 47 in replicas with zero narrowing refusals, using one
verified read-only installed copy of 50,685,411 bytes in 1,099 files
(240.348 ms; per-replica setup 22,665.920 ms in total). The source-change
probe under `scripts/` then composed `npm test` in 51.917 seconds with kernel,
compiler and skeleton reused at unchanged keys (199.889 seconds of package
execution avoided) and no replica; removing the probe restored the fresh
tree hash. The eleven WO-130 fixtures and the collapsed WO-129 Git case pass
at the final bytes.

Operator scope expansions during the repair: the format gate covers code only
(Markdown, JSON and event logs are no longer formatter input), and the
operator's mission test for process checks was applied from recorded gate
history to the remaining non-code gate tasks and to the self read-back
obligation. The [repair evidence](../evidence/WO-130/README.md),
[measurement rows](../evidence/WO-130/replica-measurements.json),
[fixture transcript](../evidence/WO-130/fixture-transcript.txt) and
[decisions D007 to D009](../evidence/WO-130/decisions.md) record the outcomes,
verdicts, sources and reopening conditions. No package changed in the repair;
the local release target remains v0.17.5 with skeleton 0.15.5. Cross-role reuse
is still prevented by per-session environment values; that limit is recorded
for planning in D009 rather than repaired here.

Two corrections followed in the same dispatch. The session had begun without
recording its `fix` dispatch, so the lifecycle stayed in `needs-fix` and the
harness briefing never printed; recording it after the first passing gate moved
the tree and cost a second composed canonical gate (D010). At the operator's
direction the generated Claude session hook now records the dispatch named by
the `resume:` phrase itself, delivers the command's briefing, passes an
already-recorded dispatch and refuses one that is not legal in the current
phase; a process-debt fixture proves each behaviour and skeleton is 0.15.6 in
the unchanged v0.17.5 target (D011).

## Execution record

2026-09-13 repair after VER-002, prepared for independent verification. F1 had
one cause: the D011 prompt dispatch ran the lifecycle as soon as the canonical
status allowed it, without the writer-isolation boundary and the active-gate
refusal that reject the same ordinary tool command. The repair admits the
dispatch exactly as that command: the session hook models it as the equivalent
Bash invocation, the active-gate refusal judges it first, and the
writer-isolation boundary runs the lifecycle spawn as its guarded effect with
the same compiled unit the writer hook carries. A live gate or another
session's live reservation refuses the dispatch with the pre-tool hook's
reason before any event, checkpoint or control projection changes and reserves
nothing; an admitted dispatch holds the reservation the session's first write
would take; `next` stays the metadata command it is on the tool path; the
already-recorded, illegal and read-only paths are unchanged. The host
compiles that unit from the loadout inventory it ships with and refuses when
the emitted manifest records another feedback policy hash, so the admission
policy is the writer hook's policy at the same hash; skeleton 0.15.7 stays
within the v0.17.5 patch target and the compiler is unchanged (a compiler
route was tried and reverted, D014).

A new process-debt fixture drives the generated hook files against the real
lifecycle for both guarded cases, the uncontended dispatch and `next`; the
D011 fixture asserts the host's dispatch policy equals the writer hook's
policy and that a manifest recording another policy hash refuses. At the
repaired bytes the focused process-debt session-hook cases passed 9 of 9, the
harness writer fixtures 16 of 16 and the compiler tests 97 of 97, and VER-002's
own real-lifecycle probe passes with its assertions inverted to require refusal
and no mutation. The [evidence](../evidence/WO-130/README.md) and
[decisions D012 and D013](../evidence/WO-130/decisions.md) record the sources,
rejected designs and reopening conditions.

Operator direction during the repair (D013): the dispatch briefing reaches
only the model, so the session hook now also prints a one-line terminal
receipt naming the recorded command, work order, role and equipped supports on
every dispatch in every session, and the delivered context requires the reply
to open with the `I intend to` line before any tool call. Bundle
regeneration writes `.claude/hooks` and `.claude/skills`, which this
session's sandbox denies; the operator ran the emit outside the sandbox, and
the canonical harness evidence gate then passed inside it: 37 aggregate suites
and 78 tasks, all fresh, in 780.37 seconds at tree `7b6d6248`, after a first
attempt at the reverted compiler-route bytes stopped at its evidence preflights
(D014).

## Execution record

2026-09-13 repair after VER-003, prepared for independent verification. F1 had
one cause: the already-recorded branch of the session hook's dispatch returned
a continuation note and a short receipt without obtaining the equipment
briefing, so a session resuming a recorded repair started without the support
list and the intent instruction the recording session received. The repair
gives the lifecycle a read-only `npm run resume -- briefing` command that
projects the recorded dispatch's briefing for the current phase from the same
builders the transitions print, and routes the already-recorded branch through
the one delivery the recorded path uses: the context carries the briefing and
the intent instruction, the terminal receipt names the equipped supports, the
lifecycle stays byte-identical and no reservation is taken. A lifecycle that
exposes legal actions but cannot project the briefing refuses the resumed
phrase naming the failure. Skeleton 0.15.8 within the unchanged v0.17.5
target; the compiler is unchanged (D015).

At the repaired bytes the two WO-130 process-debt dispatch fixtures pass
against the lifecycle stub and the real lifecycle through the generated hook
files, including a resumed `fix` after the recording session released the
worktree; the WO-129 three-role lifecycle composition passes; the resume
shell suite passes 8 of 8; the whole harness suite passes 23 of 23 with the
new command classified as metadata; and VER-003's reproduction
with its two missing-delivery assertions inverted passes with five supports
and the instruction on both sessions, unchanged lifecycle bytes and no
reservation. The [evidence](../evidence/WO-130/README.md),
[transcript](../evidence/WO-130/fixture-transcript.txt) and
[decision D015](../evidence/WO-130/decisions.md) record the sources, rejected
designs and reopening conditions. Bundle regeneration writes `.claude/hooks`
and `.claude/skills`, which this session's sandbox denies; the operator ran
`npm run harness -- emit` outside the sandbox, after which authority edition
004 was recorded and selected and the canonical harness evidence gate passed
all 37 aggregate suites and 78 tasks in 793.47 seconds, all fresh, at tree
`3ab76ea9`. Its first attempt stopped at the publication preflight until the
software-engineer edition's source lock was re-pinned to the two updated 07
sections.
