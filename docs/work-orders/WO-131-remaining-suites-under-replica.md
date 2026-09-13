# WO-131 — Every remaining reusable suite is declared and executed in its replica or retained with a reason, so a document-only change composes the full gate to the build, preparation, the live checks and the current-tree checks (version assigned at activation)

**Model:** any capable model; the measured composed gate runs on the
operator's machine. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure and local gate
evidence: declarations for the remaining suites and one optional kernel
denial; no exported runtime capability or contract changes. Assigned at
activation under the standing opt-out default.
**Cost:** adds path and environment declarations per narrowed suite and, where
the host permits a kernel sandbox, one availability probe per gate; no added
prompt, command or operator step per gate beyond WO-130's replica copies.
The release-close and installed-link repairs add bounded regression fixtures.
Removes the whole-tree executions from every document-only
gate: on 2026-09-11/12 the composed gates after a report write ran 32 fresh
tasks in 243–419 s while identical-tree reruns ran 10 fresh tasks in
41–47 s; the difference is the whole-tree class re-executing for bytes it
never read. The current-tree checks (`format`, `index`, `publication`,
`plan` and the evidence checks that read the real repository) and the live
checks always execute, so the measured target is the build, preparation and
those checks; the `plan` check alone took 33–35 s on 2026-09-12. The
post-transition class is WO-129's removal and is not counted here. Criteria 7,
10 and 11 also remove repeated declared-suite execution across role and
release-close sessions; their host rows must measure the wall-clock removal,
with token and context changes reported as observed or unavailable.
**Nomination provenance:** the operator's 2026-09-12 planning dispatch
relaying a second model's plan for proof-carrying gates; the same pass's
refutation receipts 009 and 010, after which the declaration mechanism was
rebuilt as WO-130's replica execution and the remaining declarations were
split into this order under the four-hour rule. Planner-synthesized draft;
the dispatch is preserved verbatim in the pass's ignored capture. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-130 merged (replica execution, the declaration table and
the loud failure this order's declarations rely on).
**Recommended placement:** fourth of the gate orders, after WO-130 in the same
serial lane; it edits `scripts/lib/suite-evidence.mjs`,
`scripts/test-runner.mjs`, `scripts/test-suite-evidence.mjs`,
`scripts/test-process-debt.mjs` and product 07. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-130",
    "relation": "hard",
    "reason": "replica execution, the declaration table and the loud failure that this order's declarations rely on"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Discipline (process
budget; gate execution and reuse); §Goal-aligned decisions;
`scripts/lib/suite-evidence.mjs` (the declaration table, `suiteEnvironment`);
`scripts/test-runner.mjs` (`suites`, `expandSuiteTasks`, `runGateChecks`);
`docs/evidence/WO-130/decisions.md` (D007, D009, D012);
`docs/final-reviews/WO-130/FINAL-001.md` (check 5);
`docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-010.md`;
`packages/skeleton/src/harness-host.ts` (`managedReleaseCommand`,
`metadataCommand`, `writerIsolationFacts`); `scripts/resume.mjs`
(`commandFor`, the `release-close` action); the release-close role text in
`packages/skeleton/src/loadouts/contributor.ts`;
`scripts/lib/suite-replica.mjs` (`createReplicaContext`, the installed copy);
`scripts/release.mjs` (`close`, `updateMainAndFinish`, `runEvidence`); the
retained WO-130 release-close failure record and closeout receipt under
`docs/control/local/retained/WO-130/` (local, ignored).

**Objective:** Every task the runner may reuse either carries a declaration
of the candidate paths and Git shape it needs and executes in its replica
under WO-130, or is retained whole-tree with a recorded reason. The
current-tree checks and the live checks are retained by construction. After
a document-only change, such as a verification report with its control
event, checkpoint and regenerated index, the full gate composes from prior
successes and re-executes only the build, preparation, the live checks and
the current-tree checks. Where the host permits a kernel sandbox, replica
runs additionally execute under a denial of reads from the candidate tree,
and the gate row records which tasks ran under it.

**Observed gap (dated 2026-09-12, `main` at `baa7a9e`):**

- After WO-130 the whole-tree class still holds `resume` (67–106 s),
  `harness-fixtures` (134–160 s), `console` (47–92 s),
  `work-orders-fixtures` (47–89 s), `runner-fixtures`, `checkpoint`,
  `github-body`, `release-preparation`, `license-fixtures`,
  `publication-fixtures`, `backup-intake`, `fixture-temp-root`,
  `adjacent-queue`, `authority-grants`, `artifact-corpus`, `mutation`, the
  document checks (`format`, `index`, `publication`, `plan`) and the evidence
  checks (`authority-evidence`, `artifact-evidence`, `verification-evidence`,
  `feedback-evidence`).
- Measured: composed gates after a report write took 243.5, 246.9, 371.5,
  413.6 and 418.7 s with 32 fresh and 46 reused tasks; identical-tree reruns
  took 40.6, 40.8, 46.9 and 42.1 s with 10 fresh and 68 reused.
- Nested `sandbox-exec` was refused inside a sandboxed role session on
  2026-09-12, so a kernel denial can apply only where the host permits it,
  such as an operator terminal; it must never be a condition of reuse.
- Cross-role reuse is zero (dated 2026-09-13; WO-130 D009 and FINAL-001
  check 5; added at the operator's direction on 2026-09-13). Cache reuse
  works within a session, and WO-126, WO-129 and WO-130 cut gate times
  significantly on that path, but a success does not yet carry across roles
  because the projected environment includes per-session values
  (`CLAUDE_PID`, `GIT_SSH_COMMAND` with a per-session proxy port, the
  harness-specific `TMPDIR`, `CLAUDE_CODE_EXECPATH`, `CODEX_HOME`), so every
  independent role pays a full fresh gate at identical declared bytes:
  WO-130's repair gate and VER-001 both ran 78 fresh tasks beside existing
  successes, and the final review measured 0 of 9 suites reusable from a
  third role. Fixing that needs a separate per-suite environment
  declaration; D009 files the proposal for planning, and this order carries
  it as criterion 7.
- The WO-130 release close failed inside the helper's own full gate (dated
  2026-09-13, `main` at `dfc0874`, WO-130 merged and closed; the retained
  local record is `docs/control/local/retained/WO-130/release-close-failure.json`
  with its closeout receipt beside it). The Codex session ran the helper from
  the subject worktree with main as its working checkout; the helper confirmed
  merge containment, fast-forwarded main, retained 46 files, handed off the
  gate evidence and removed the worktree and branch, then ran
  `npm run test:full` on main: 31 tasks fresh, 0 reused, 246 s, 30 suites
  passed, 7 failed, no tag and no Release. One cause. Main's install carries
  `node_modules/.bin/dotln`, the bin link npm creates from the skeleton
  package's `bin` field through the workspace link `node_modules/@dotln/skeleton`;
  the replica copier resolved that link lexically to
  `node_modules/@dotln/skeleton/dist/src/dotln.js`, which is no inventory
  entry, and refused `process-debt` with `Installed link leaves the copied
  graph`, although the physical target `packages/skeleton/dist/src/dotln.js`
  is inventoried and copied. The refused copy left its partial `installed`
  directory behind, so every later replica setup failed with `EEXIST`:
  `worktree`, `release:prepare` and its 40 cases, `kernel`, `compiler`,
  `skeleton` and `plan-refutation:fixtures`. The reviewed gates built 47
  replicas, so the reviewed worktree's install cannot have carried the link;
  any fresh `npm ci` creates it. The 47 replica tasks ran fresh at all because
  the release-close session's projected environment differs from the reviewed
  sessions' (the cross-role limit above), so the reviewed successes handed off
  from the worktree were not reused. The session's cwd was the worktree the
  helper removed, which is why release close is run from the worktree today
  and why that session is unusable afterwards.
- Release close after a merge is refused by the generated hooks for every
  spelling but one (dated 2026-09-13, same state). The host's managed release
  command admits from the main checkout exactly
  `node scripts/release.mjs close WO-NNN --publish` and its two absolute-path
  spellings, only in a session whose prompt was `resume: release close`, and
  when the subject worktree still exists it admits only that worktree's copy
  of the helper, the copy whose directory the helper removes; every other
  spelling is a writer dispatch into main and refuses with `write dispatch
  lacks a verified exclusive worktree`. That set excludes the handoff
  `npm run resume -- release-close` prints (`cd '<main>' && '<node>'
  '<main>/scripts/release.mjs' close WO-NNN --publish`, which names main's
  copy and which the permission hook also refuses for its `cd`), the
  `npm run release -- close WO-NNN --publish` command the lifecycle names as
  the legal action, and the `--dry-run` preview the release-close skill
  instructs. A merged, closed order therefore reads as a denied publication
  from main until the operator types the one admitted spelling, and no
  preview is possible at all.
- Gate wall-clock has not fallen across the three gate orders (operator
  observation 2026-09-13). WO-128, WO-129 and WO-130 each shipped a reuse
  mechanism, and the fresh full gate still takes 780–805 s (WO-130's measured
  gates), a role session at identical declared bytes still runs 78 fresh
  tasks (D009), a post-transition or document-only change still runs 32 fresh
  tasks (243–419 s), and the release close ran 31 fresh tasks plus a fresh
  replica build. Each mechanism so far is keyed on a value that changes
  between the sessions that need the reuse. This order is measured on that
  outcome, criterion 11, not on the presence of a mechanism. All three bullets
  were added at the operator's direction on 2026-09-13 during the WO-130
  release close.

**Design (scope discipline):**

- Declarations follow WO-130's table: candidate paths and `git: none |
  replica-repo`. The shell suites (`resume`, `checkpoint`,
  `work-orders-fixtures`, `publication-fixtures`, `backup-intake`,
  `fixture-temp-root`) run from their replica copies with their scripts,
  libraries and the Node scripts they invoke declared; a suite that needs
  the real repository, its refs or its local state is a current-tree check
  and is retained whole-tree by construction.
- The kernel denial is an addition, never a condition: the runner probes
  once per gate whether a read-denying sandbox can be applied, records the
  result in the gate row, and, when it can, wraps replica runs in a denial
  of reads from the candidate tree; when it cannot, replica execution alone
  carries the reuse decision.
- Per-suite environment declaration. A suite's declaration names the
  environment variables it reads; its execution and its key carry only
  those variables and the toolchain, keeping WO-126-D012's rule that
  execution and key see the same variables, so a per-session value the
  suite never reads cannot fork its key across roles. A suite without an
  environment declaration keeps the reviewed projection it has today. The
  nested full-gate fixtures that set the gate's wall-clock are declared
  under the same rule, since they are where the cross-role cost is paid.
- Release-close admission. Every spelling the lifecycle prints or names is
  admitted read-only from the main checkout: the handoff
  `npm run resume -- release-close` prints, the command the lifecycle names
  as the legal release-close action, and the `--dry-run` preview the role
  text instructs beside `--publish`. The handoff names main's copy of the
  helper, which is the reviewed copy once the order is merged and which
  survives the removal of the subject worktree; it carries no `cd` when
  printed from main, and the host treats a leading change into the checkout
  the session already occupies as the no-op it is. A spelling outside the
  set keeps refusing with the writer-isolation reason. Release close runs in
  a session started in main; the worktree the helper removes is never the
  session's cwd.
- Installed links resolve through the copied graph. The copier follows only
  copied links, one hop at a time, until a link's target is a copied entry;
  a hop that leaves the repository or lands outside the copied graph refuses
  as today, and an accepted link keeps its original relative target, so every
  replica that was accepted before is byte-identical and no mechanism version
  bump is owed. The per-gate installed copy is built under a private name and
  published by one rename; a copy that failed names its cause to every later
  suite in that gate instead of leaving a partial directory.
- Release close reuses the reviewed gate. With the per-suite environment
  declaration and the remaining declarations, the helper's evidence step on a
  merged order composes from the reviewed successes handed off with the
  worktree, whatever the release-close session's harness or environment, and
  runs fresh only the build, preparation, the live checks and the
  current-tree checks. The helper's checks and what it publishes are
  unchanged; only which successes its evidence step can reuse changes.
- **Declined alternatives, recorded:** making the kernel denial a
  prerequisite of narrowing (unavailable inside sessions, where most gates
  run); porting the shell suites to Node test cases in this order (the
  cold-gate candidate; the replica makes them narrowable as they are);
  dropping the per-session variables from the shared projection for every
  suite (WO-130 D007 rejected it: some suites read harness identity, and
  the declaration is the sound form); admitting release-close spellings by
  pattern rather than by an exact set (the exact set is what makes the
  managed command a read-only fact for the writer boundary).

**Deliverables:** the declarations and retentions; the kernel denial where
available with its probe; the composition fixture; the operator-host
measurement; the per-suite environment declaration with its cross-role
measurement; the release-close admission repair with its fixture; the replica
copier repair with its fixture; the release-close reuse fixture and this
order's assigned release close as its first live row; the measured gate rows of criterion 11;
the write-backs.

**Acceptance criteria (all required)**

1. Every task the runner may reuse has a declaration of the candidate paths
   and Git shape it needs, or an explicit whole-tree retention with its
   reason; the current-tree checks and the live checks are retained by
   construction and named as such in the table.
2. Each declared suite executes in its replica under WO-130 and passes; a
   suite that fails in its replica is declared further or retained
   whole-tree, and the execution record names each outcome; the six shell
   suites named above are in scope and run from their replica copies.
3. In the WO-129 three-role fixture, the gates after the verification report
   and after the final-review report re-execute only the build, preparation,
   the live checks and the current-tree checks; the fixture asserts the
   counts.
4. On the operator's host, a document-only change (a verification report,
   its control event and checkpoint, and the regenerated index) composes the
   full gate; the row, its fresh task list and its wall-clock are recorded in
   `docs/evidence/WO-131/` beside the 2026-09-11/12 composed rows (243–419 s)
   and identical-tree rows (41–47 s).
5. Where the host permits a kernel sandbox, replica runs additionally execute
   under a denial of reads from the candidate tree, the gate row records for
   each narrowed task whether the denial applied and the probe's result once
   per gate, and unavailability changes no reuse decision; a fixture proves
   the wrapping and the record with a stub, and a probe on the operator's
   terminal and inside a sandboxed session records both answers.
6. Write-backs land: 07 §Discipline (the gate execution and reuse bullet),
   `docs/evidence/WO-131/decisions.md` with dispatch sources and reopening
   conditions, the decisions index and the follow-up register; `npm test`
   green; `git diff --check` clean; no new dependency.
7. Per-suite environment declarations land for every narrowed suite: a
   declared suite's execution and key carry only its declared variables and
   the toolchain; a fixture proves that changing an undeclared per-session
   value (`CLAUDE_PID`, `GIT_SSH_COMMAND`, the harness `TMPDIR`) leaves the
   key unchanged while changing a declared one re-executes the suite; and on
   the operator's host a second role session at identical declared bytes
   reuses the package suites, with the row recorded in
   `docs/evidence/WO-131/` beside D009's 78-fresh rows.
8. The release-close handoff is admitted as printed: the spelling
   `npm run resume -- release-close` prints, the command the lifecycle names
   as the legal release-close action, the release-close role text and the
   host's managed release command agree on one spelling with no `cd`;
   `--dry-run` is admitted read-only from the main checkout; a process-debt
   fixture drives the generated hook files with the printed handoff and with
   the `--dry-run` preview on main and asserts both are admitted, and asserts
   that a spelling outside the set still refuses with the writer-isolation
   reason and takes no reservation.
9. The replica copier accepts an installed link whose target resolves
   through copied links to a copied entry, including npm's workspace bin
   links, and recreates it with its original relative target; a link whose
   resolution leaves the copied graph still refuses; a failed installed copy
   leaves no directory behind and every later suite in that gate reports the
   same cause; a fixture proves all three, and on the operator's host a fresh
   `npm ci` in a clean checkout followed by `npm run test:full` passes with
   every narrowed suite in a replica.
10. Release close of a merged order re-executes no package suite and no
    replica suite whose declared inputs match the reviewed successes handed
    off with the worktree, whatever the release-close session's harness or
    environment. A release-close fixture merges a reviewed order, hands off
    its evidence, closes from main under a different session environment and
    asserts that only the build, preparation, the live checks and the
    current-tree checks ran fresh. The first live row is this order's close
    from a session started in main, publishing the version assigned at
    activation after criteria 8 and 9 have landed. The already-published
    WO-130 release remains historical failure and recovery evidence; it is
    not republished to satisfy this criterion.
11. Measured on the operator's host and recorded in `docs/evidence/WO-131/`
    beside the WO-128 to WO-130 rows: the fresh full gate is no slower than
    WO-130's 780–805 s; a document-only or post-transition change composes
    the full gate within the identical-tree band (41–47 s) plus the build,
    preparation and live checks; a second role session at identical declared
    bytes reuses every declared suite; a release close at the reviewed tree
    reuses every declared suite. A row outside its band fails the criterion,
    and no averaged speedup is claimed.

**Evidence gate:** `npm run harness -- evidence`; the fixture transcripts; the
operator-host rows of criteria 4, 5, 7, 9, 10 and 11.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** the replica mechanism itself (WO-130); the key model and the
cache (WO-129) beyond the per-suite environment declaration of criterion 7;
deadlines and exclusivity (WO-128); porting shell suites to Node; deleting or
merging tests; a kernel sandbox as a condition of reuse; any change to what
the release helper itself checks or publishes (criterion 8 changes only which
spellings the hooks admit and what the handoff prints; criterion 10 changes
only which recorded successes its evidence step can reuse).

**Operator-review assumptions**

1. The operator runs the kernel-denial probe once from a terminal so both
   answers are on record; the sandboxed answer is already observed.
2. A suite retained whole-tree with a reason is an accepted outcome of this
   order, not a defect.
3. The first live release-close measurement uses this order's version
   assigned at activation and a session started in main; no tag is created
   by hand. The release-close row is collected by the authorized closeout
   role after merge; the pre-merge verifier checks the release-close fixture
   and the remaining host rows, and the closeout receipt records the live
   result before claiming the release-close measurement complete.

**Planning completion, 2026-09-13:** The operator directed completion of this
branch so the next work order can start. The public
[v0.17.5 release](https://github.com/DylanBWood/DotLn/releases/tag/v0.17.5)
was published at 22:40:57 UTC on this date, after the failure captured above.
The live-row target therefore follows this order's assigned release, while
the earlier failure remains evidence. The generated cost evidence and index
are refreshed for the reviewed subject.

This repair enables the next gate-reuse order on the route to the resident
runtime and the independently verified external-change loop. NoOp would leave
an already-published release as a new acceptance target and keep the branch
behind stale evidence. Policy resistance and rule beating are addressed by
preserving the independent verdict, declared-input checks and measured bands;
drift to low performance and seeking the wrong goal are addressed by keeping
the operator-host outcomes as the standard. Commons cost, escalation and
shifting the burden favor one generated refresh and one independent review
over another operator repair cycle. Success to the successful supplies no
reason to retain the obsolete release target. Under Naive Interventionism,
the useful release history, review gates and sequence stay intact; the bounded
document correction is reversible. Reopen if release allocation or the live
closeout evidence contradicts these assumptions.
