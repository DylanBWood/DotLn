# WO-131 — Every remaining reusable suite is declared and executed in its replica or retained with a reason, so a document-only change composes the full gate to the build, preparation, the live checks and the current-tree checks (version assigned at activation)

**Model:** any capable model; the measured composed gate runs on the
operator's machine. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. Test infrastructure and local gate
evidence: declarations for the remaining suites and one optional kernel
denial; no exported runtime capability or contract changes. Assigned at
activation under the standing opt-out default.
**Cost:** adds one declaration per suite and, where the host permits a kernel
sandbox, one availability probe per gate; nothing per gate beyond WO-130's
replica copies. Removes the whole-tree executions from every document-only
gate: on 2026-09-11/12 the composed gates after a report write ran 32 fresh
tasks in 243–419 s while identical-tree reruns ran 10 fresh tasks in
41–47 s; the difference is the whole-tree class re-executing for bytes it
never read. The current-tree checks (`format`, `index`, `publication`,
`plan` and the evidence checks that read the real repository) and the live
checks always execute, so the measured target is the build, preparation and
those checks; the `plan` check alone took 33–35 s on 2026-09-12. The
post-transition class is WO-129's removal and is not counted here.
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
`scripts/lib/suite-evidence.mjs` (the declaration table);
`scripts/test-runner.mjs` (`suites`, `expandSuiteTasks`, `runGateChecks`);
`docs/evidence/WO-130/decisions.md` (once filed);
`docs/planning/refutations/2026-09-12-planning-dc998fb93c27e337-010.md`.

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
- **Declined alternatives, recorded:** making the kernel denial a
  prerequisite of narrowing (unavailable inside sessions, where most gates
  run); porting the shell suites to Node test cases in this order (the
  cold-gate candidate; the replica makes them narrowable as they are).

**Deliverables:** the declarations and retentions; the kernel denial where
available with its probe; the composition fixture; the operator-host
measurement; the write-backs.

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

**Evidence gate:** `npm run harness -- evidence`; the fixture transcripts; the
operator-host rows of criteria 4 and 5.

**Write-back duty:** sources and reopening conditions in the order's decisions
file; the ledger is reserved for operator ideation and planning synthesis.
Record corrections the same day as what was misread, meant and changed.

**Non-goals:** the replica mechanism itself (WO-130); the key model and the
cache (WO-129); deadlines and exclusivity (WO-128); porting shell suites to
Node; deleting or merging tests; a kernel sandbox as a condition of reuse.

**Operator-review assumptions**

1. The operator runs the kernel-denial probe once from a terminal so both
   answers are on record; the sandboxed answer is already observed.
2. A suite retained whole-tree with a reason is an accepted outcome of this
   order, not a defect.
