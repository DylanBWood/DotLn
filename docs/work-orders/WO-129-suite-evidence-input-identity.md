# WO-129 — Suite evidence keyed by declared inputs: a lifecycle transition, a commit of unchanged bytes or a sibling worktree no longer invalidates suites that did not read what changed, and every miss names what did (version assigned at activation)

**Model:** any capable model; the measured composed gate runs on the
operator's machine. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Local gate evidence only: the suite-success
record version increments, the cache moves, and the gate row gains additive
fields; the tag manifest's evidence contract, the lifecycle predicate and the
exact-tree aggregate are unchanged. Assigned at activation under the standing
opt-out default.
**Cost:** adds one declaration lookup per suite and one explanation line per
fresh task per gate; the shared cache adds no per-gate work and one directory
under the Git common directory. Removes the fully fresh full gate that today
follows every lifecycle transition: five of WO-125's ten fresh full runs
(3,876 s) followed a transition with no source change and re-executed all 78
tasks; at the current scope coverage they compose as 32-fresh/46-reused runs
(observed 243–419 s on 2026-09-11/12), and after WO-130 as 10-fresh/68-reused
runs (observed 41–47 s). The release close's full gate on main (78 fresh
tasks, 476 s at 2026-09-12T16:08Z) cannot reuse the reviewed worktree's
successes today because the cache is per worktree and the key hashes the path
and `HEAD`. Steps, commands and tokens per phase are unchanged.
**Nomination provenance:** the operator's 2026-09-12 planning dispatch
relaying a second model's plan for proof-carrying gates; the pass verified
its claims about the shared input key against `scripts/lib/suite-evidence.mjs`
and the retained gate rows, and corrected its lifecycle claim: the lifecycle
already accepts a composed exact-tree aggregate (WO-126-D009, D014), so the
repair is the key, the cache location and the miss explanation, not the
predicate. Planner-synthesized draft; the dispatch is preserved verbatim in
the pass's ignored capture. Opaque identifier, not a priority. Clean-room
screen: no stop condition.
**Depends on:** WO-126 merged (the suite-success cache, the composed aggregate
and the reviewed environment projection; closed at `v0.17.0`). WO-128 shares
the runner surface and is recommended first; it is not an input.
**Recommended placement:** second of the three gate orders, after WO-128 in
the same serial lane; it edits `scripts/lib/suite-evidence.mjs`,
`scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`,
`scripts/test-process-debt.mjs`, the generated-hook fixtures that prove the
cache path is refused, and product 07. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-126",
    "relation": "satisfied-by-close",
    "reason": "the suite-success cache, the composed exact-tree aggregate and the reviewed environment projection"
  },
  {
    "workOrderId": "WO-128",
    "relation": "reference-only",
    "reason": "shares the runner surface; recommended first in the same serial lane, not an input"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (process
budget: a full gate runs once per tree hash and its evidence is reused by
hash; gate execution and reuse; gate input protection); §Goal-aligned
decisions; 03-architecture.md §Session lifecycle & resilience;
`scripts/lib/suite-evidence.mjs` (`observeSuiteInputs`, `suiteInputHash`,
`cachePath`, `valid`, `saveSuiteSuccess`, `completeCoverage`);
`scripts/test-runner.mjs` (`expandSuiteTasks`, `runGateChecks`);
`scripts/lib/gate-evidence.mjs` (`gateTreeHash`, `gateInputPath`,
`findGateCheck`); `scripts/lib/lifecycle-evidence.mjs`
(`requireLifecycleEvidence`); `packages/skeleton/src/harness-host.ts`
(`contained`, `activeGateWriteRefusal`); `docs/evidence/WO-126/decisions.md`
(D009, D012, D014); `docs/evidence/WO-125/decisions.md` (D003 to D005);
`docs/control/orders/WO-125.jsonl` (the eighteen transitions).

**Objective:** A suite's reuse key is exactly what that suite reads: its
declared candidate paths, its declared Git state (none, `HEAD`, or ref
patterns), the projected environment, the toolchain digests and the installed
roots. Repository-global facts that no suite reads leave the shared key: every
ref, the commit identity, the physical checkout path, the CPU count, the OS
release and the complete configuration listing. Records live once per
repository under the Git common directory, so sibling worktrees and the main
checkout share them, with the existing seal and a new record version. Every
fresh task states which input class changed since the suite's newest prior
success. The exact-tree aggregate, the fail-closed defaults and the lifecycle
predicate are unchanged.

**Observed gap (dated 2026-09-12, `main` at `baa7a9e`):**

- `observeSuiteInputs` folds into every suite's `context`: `process.versions`,
  the platform and architecture, the OS release, `availableParallelism()`, a
  digest of the physical checkout path, the projected environment, the
  toolchain digests, `git rev-parse HEAD`, the complete `git for-each-ref`
  output, the complete `git config --list --show-origin` text and the local
  Git and npm configuration digests (`suite-evidence.mjs:337–355`); `runtime`
  hashes every file under `node_modules` and every `packages/*/dist`
  (`:189–201`, `:356`). The cache path is the worktree's own
  `docs/control/local/harness/suite-success` (`:391–398`).
- Measured consequence: after each of WO-125's transitions (implementation
  ready at 20:47Z; repair complete at 02:44Z, 12:52Z and 14:11Z; verification
  results at 23:07Z, 03:43Z, 13:46Z and 15:06Z) the next full gate reported 78
  fresh and 0 reused tasks (613–839 s). Within a phase, a document change
  reused 46 tasks (the six scoped suites and the 40 release cases; 243–419 s)
  and an identical tree reused 68 (41–47 s). Each transition appends a control
  event and creates a `refs/dotln/checkpoint/WO-125/N` ref (eighteen events,
  checkpoints through `/18`), which changes `for-each-ref` and therefore every
  key, although no suite reads a checkpoint ref.
- The suites that read the real repository's Git state are `index` (annotated
  tags in `HEAD` ancestry and the control segments), `plan-refutation:current`
  (committed `HEAD` blobs) and the seven `reuse: "live"` checks, which always
  execute. Every other suite builds its own fixture repositories.
- A miss is printed as `PASS`/`FAIL` with no reason; the gate row records
  fresh and reused counts but not why a task was fresh.

**Design (scope discipline):**

- The existing `scopes` table gains, per suite, a Git-state declaration: none
  (default), `HEAD`, or ref patterns such as `refs/tags/*`; the declared state
  is hashed into that suite's key only. The shared context keeps only what
  every suite can read: `process.versions`, platform and architecture, the
  reviewed environment projection, the toolchain digests, the installed roots
  (whole, for this order), and the Git configuration keys that change how any
  suite reads the tree (`core.*`, `filter.*`, hooks and attribute paths)
  rather than the whole listing. OS release, CPU count and the physical path
  are execution facts recorded in the row, not key inputs.
- Records move to `<git common dir>/dotln/suite-success/<suite digest>/<inputHash>.json`
  with the existing seal and `version: 3`; version 2 records are invalid and
  never migrated. The generated hooks already refuse agent tool writes under
  `.git` through `contained()` and the gate-input protection; a fixture proves
  it for the new path.
- Beside each success record the runner keeps the per-class digests (source,
  documents, git, environment, toolchain, runtime, declaration) so a miss can
  name the classes that differ from the newest prior success, printed as
  `FRESH <task> (documents: docs/verifications/…)` with bounded path lists,
  or `no prior success`.
- **Declined alternatives, recorded:** a folder rule ("everything outside
  `docs/`"; WO-126-D009 rejected it because some documents are inputs); one
  behavior hash for the whole tree (the composition of per-suite keys is the
  identity; a single number would need its own declaration model and would
  hide which suite is stale); keying by commit identity (a commit of identical
  bytes must reuse); a remote or signed cache (no second machine or writer
  exists; reopen at the first shared runner); changing the lifecycle predicate
  (it already accepts the composed aggregate).

**Deliverables:** the declarations and the minimal shared key; the shared
cache with its record version; the miss explanations; the fixtures named
below; the write-backs.

**Acceptance criteria (all required)**

1. Every suite in the inventory carries a Git-state declaration (none, `HEAD`,
   or ref patterns); `index` and `plan-refutation:current` declare theirs, the
   `reuse: "live"` checks keep executing, and the runner refuses reuse for an
   undeclared suite name (fail closed, fixture-proven).
2. The shared key no longer contains the physical path, `availableParallelism()`,
   the OS release, `git rev-parse HEAD`, the complete `for-each-ref` output or
   the complete configuration listing, while the guards for hook paths,
   filters, attribute and exclude files remain keyed inputs; a fixture proves
   that a new `refs/dotln/checkpoint/*` ref, a new branch, a commit of
   identical bytes and an appended control event change no suite key except
   for suites declaring that state, and that a changed declared ref or `HEAD`
   changes exactly their keys.
3. Records live once per repository under the Git common directory; a fixture
   with two worktrees at identical candidate bytes and installed inputs proves
   the second reuses the first's successes and that one differing candidate
   byte does not; agent tool writes to the cache path are refused through the
   generated hooks (as WO-125's F3 fixtures do); a malformed, foreign-version
   or unsealed record is ignored.
4. Every fresh task's `FRESH` line and gate-row entry names the input classes
   that differ from the suite's newest prior success (source, documents, git,
   environment, toolchain, runtime, declaration) with bounded path lists, or
   `no prior success`; a fixture proves one explanation per class; the
   aggregate row keeps `executionMode`, `freshSuites` and `reusedSuites`.
5. A synthetic three-role episode in the process-debt fixtures (implementation
   ready; a verification report and `verification-result pass`; a final-review
   report and `final-review-result pass`; no source change) composes each
   later full gate from the earlier one's successes, re-executing only the
   build, preparation, the live checks and suites whose declared documents
   changed; the fixture asserts the fresh and reused counts and that each
   aggregate row names its exact tree.
6. A runner, suite-evidence or gate-evidence source change, a `reusable: false`
   snapshot and `--fresh` still execute everything fresh; the declaration
   version is part of the key; the existing fixtures are kept.
7. On the operator's host, the first full gate after a lifecycle transition
   with no source change reports `composed` with at least the 46 currently
   scoped tasks reused; the row is recorded in `docs/evidence/WO-129/` beside
   WO-125's 78-fresh rows.
8. Write-backs land: 07 §Discipline (the identity rule in the gate execution
   and reuse bullet), `docs/evidence/WO-129/decisions.md` with dispatch
   sources and reopening conditions, the decisions index and the follow-up
   register; `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** `npm run harness -- evidence`; the fixture transcripts; the
operator-host composed row of criterion 7.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** declarations for the whole-tree suites and any narrowing of
the installed roots per package (WO-130); deadlines and exclusivity (WO-128);
a remote cache, signed records or a second writer; any change to the
lifecycle predicate or the exact-tree aggregate; deleting or merging tests.

**Operator-review assumptions**

1. The cache may live under the Git common directory: outside every worktree's
   closeout archive, disposable, rebuilt by execution.
2. The release close on main composes from the reviewed worktree's successes
   when its suites' inputs match; the operator may still run `--fresh` at any
   close, and the tag manifest keeps recording the gate it ran or reused.
