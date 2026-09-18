# WO-139 decisions

## WO-139-D001 — Bound the admission points the host can observe

```json
{
  "id": "WO-139-D001",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Count observable spawn admissions, probe descendant identity before choosing the key, and retain the open total-cap requirement.",
  "evidence": ["WO-139", "packages/skeleton/src/harness-host.ts", "docs/planning/vision-into-use-2026-09-17.md §11"],
  "rejected": ["NoOp retains recurring fan-out arithmetic.", "Advisory only misses the requested refusal.", "Script parsing cannot establish runtime fan-out; banning workflows removes useful batching."],
  "reopenWhen": "A live probe or official contract supplies pre-creation admission for every descendant or a native total cap."
}
```

Operator dispatch: `resume: next`, 2026-09-18. Authority:
[WO-139](../../work-orders/WO-139-subagent-cap.md), its cited planning §11,
and product 07 §Goal-aligned decisions and §Discipline. The checked host
classifies Agent, Task, Workflow and Codex spawn tools as `spawn`, but the
permission branch counts none. The existing probe records field shapes only;
identity relationships need a bounded live row before choosing a counter key.

The mission contribution is less recurring operator supervision of agent
fan-out while preserving evidence and host authority. This is resource-risk
reduction for independently verified execution, not a new critical-path
deliverable. Implement the selected cap at observed admission points, keep
unobserved totals unknown, and retain the open total-cap candidate. The
implementation will use the existing hook, usage and generated instruction
interfaces and no dependency. The repository consumes them directly.

NoOp retains uncapped observable fan-out and the operator's manual arithmetic.
An advisory alone misses the requested refusal. A harness setting has no
established total-cap guarantee in the order's evidence. Parsing workflow
scripts cannot establish runtime fan-out; banning workflows removes useful
batch execution. Those alternatives remain declined. Reopen the boundary
when a live probe or official contract supplies pre-creation admission for
every descendant, or a total-cap setting.

All eight traps: policy resistance is limited by preserving writer, gate and
planning guards and host permissions; commons consumption is charged to the
root rather than each subtree; explicit partial coverage avoids drift to a
weaker claim; grouped review prevents escalation through per-item review
trees; the native-setting alternative stays open rather than privileging
existing hooks; the counter removes recurring operator arithmetic rather
than shifting the burden; executable fixtures and live identity evidence
address rule beating; success means bounded observed fan-out, not more
receipts or agents. Under Naive Interventionism, preserve useful local
spawns, workflow batches and recovery; default 20 and `null` permit bounded
configuration. Missing or unreadable state must admit with its cause rather
than disable the host. The smallest useful probe is one direct Agent and one
two-agent workflow in isolated scratch state.

Execution fan-out: at most two read-only helpers, each judging a group of
questions, no nested helpers; the parent alone writes this worktree. Entry
usage counters are unavailable (dispatch scope, 2026-09-18T14:12:55Z);
no token total or cost is inferred. Live probe agents belong to separately
bounded scratch sessions and are recorded in the probe row.

## WO-139-D002 — Clear authorized execution amendments through planning continuation

```json
{
  "id": "WO-139-D002",
  "date": "2026-09-18",
  "dispatch": "scope expand: during resume: next; operator requests a durable fix for inherited planning-check failures",
  "decision": "Add an explicit source-bound execution-amendment event and helper to the existing planning control log; record WO-053's already-authorized amendment and preserve independent refutation holds.",
  "evidence": ["docs/final-reviews/WO-135/FINAL-001.md §The document gate on the integrated tree", "docs/evidence/WO-053/decisions.md#wo-053-d002", "Clean main at 494e682: node scripts/refute-plan.mjs check fails on changed criterion without text-bound disposition", "scripts/lib/plan-continuation.mjs"],
  "rejected": ["NoOp repeats the known failure and recurring operator rescue.", "A blanket exemption for closed orders hides unapproved changes.", "Inventing a hold disposition is invalid because receipt 017 has no WO-053 hold.", "A fresh planning pass for every authorized repair recreates the interruption."],
  "reopenWhen": "An unrecorded amendment is admitted, a live hold is discharged by an amendment, or ordinary release/execution metadata requires a new amendment."
}
```

The user explicitly expanded this order on 2026-09-18. Queue
`adjacent-0001` records the cause, fix, paths and checks. The older WO-047
cost observation issue was already settled; it is not this failure.

Mission/critical path: keep authorized execution moving through verification
without exporting routine scope accounting to a separate planning session.
The interface is an append-only typed event consumed by continuation checks,
with a command that binds it to the existing decision and exact order text.
NoOp preserves a reproducible red check on clean main. Policy resistance and
burden shifting favor honoring the operator's recorded execution authority;
commons and escalation favor one existing log rather than another review;
drift, rule beating and wrong-goal risks require exact text/decision bindings
and unchanged hold rules; success-to-the-successful does not justify keeping
the broken boundary. Naive Interventionism preserves immutable receipts,
unrecorded-change detection, recovery and ordinary release updates. The
smallest useful probe replays the real WO-053 change with negative mutations.

The next checked layer exposed a second inherited failure: WO-053 had replaced
WO-052's capability row instead of appending its reassessment. Restore the exact
judged row and append the exact newer assessment, preserving both sources and
their limits. A narrow pre-commit continuation recognizes that representation
repair only when every committed change is a same-ID table row preserved exactly
in a valid dated appendix. It reports `pending-capability-history-repair`; after
commit the normal reassessment rule applies. Restoring a clean-looking workspace
without preserving the newer claims remains a failure. This adds no new receipt
or operator command and changes no hold rule. The clean-main defect therefore
has two recorded causes, both exercised before and after fixture commits.

## WO-139-D003 — Count evidence without inventing a parent join

```json
{
  "id": "WO-139-D003",
  "date": "2026-09-18",
  "dispatch": "resume: next",
  "decision": "Key the counter by observed root session and child identity; reserve direct invocations, join only exact returned identities, and label unresolved overlap as a minimum distinct count.",
  "evidence": ["docs/evidence/WO-139/subagent-probe-2.json", "packages/skeleton/test/subagent-budget.test.ts", "scripts/test-harness.mjs WO-139 fixture"],
  "rejected": ["Charging direct admission and its child twice refuses already-admitted work.", "Assigning pending credits by arrival order invents a parent relation.", "Agent type is not a reliable workflow origin: workflow agents can select an ordinary type.", "NoOp leaves all observed admissions unbounded."],
  "reopenWhen": "A pre-creation or first-call parent join becomes available, a native total cap is established, or an uncounted path exceeds the intended budget."
}
```

The admission table and exact coverage limits are in [README](README.md).
Probe 1's Workflow guard used the wrong path form; probe 2 corrected it and
retained both outcomes. Read-only grouped review identified temporal exclusions
(a new direct spawn cannot be an already-observed child), persistence of the
first child observation on a refused nested spawn, preservation of existing
execution records, and decision-file containment. The implementation and
regressions now account for those cases. No unsupported causal join or exact
global count is claimed. This refines D001's evidence comparison: the native
hook's missing join is a remaining limitation, not a reason to invent identity.

| Harness / path | Admission and accounting | Limit |
| --- | --- | --- |
| Claude Agent | Parent PreToolUse reserves a unit before creation; exact result joins child identity afterwards. | Native host denial after admission may leave a conservative reservation; no speculative refund. |
| Claude Task | Same classified direct-spawn branch, covered by fixtures. | No live Task call in this row; it is a compatibility adapter, not separately observed native creation. |
| Claude Workflow | Parent call needs remaining budget, consumes no unit itself. | Descendants already exist before their first hook. |
| Claude workflow `agent()` | Each attributable `agent_id` is recorded at its first admitted tool call in the root counter. | Tool-free agents are unseen; unresolved direct admissions can overlap later child observations. |
| Codex `collaboration.spawn_agent` | Classified as spawn, but no project hook in the recorded Codex profile; role text and the stated session plan apply. | No automatic refusal or measured creation total is claimed. |

## WO-139-D004 — Stage the classified patch locally

```json
{
  "id": "WO-139-D004",
  "date": "2026-09-18",
  "dispatch": "resume: next with authorized planning-repair scope expansion",
  "decision": "Stage application v0.29.5, compiler 0.13.2 and skeleton 0.25.4; preserve package publication controls and all historical evidence.",
  "evidence": ["WO-139 patch classification", "Latest observed local tag v0.29.4", "Changed compiler boundary text and skeleton host/instruction source"],
  "rejected": ["No release contradicts the standing classified-release default.", "Bumping unchanged kernel or console source would misstate compatibility impact."],
  "reopenWhen": "Final-review integration observes a newer published release or a changed compatibility impact."
}
```

The activation had left the release placeholder unassigned. The executor
completed it under product 06 §Release boundary, aligned the README source
claim and changed component metadata, then ran `release prepare --local`.
It reported the target current against the local tag snapshot; no remote
publication or branch commit is part of this dispatch.

WO-139's batching instruction and shared boundary/planning guidance measured
17,477 verifier cold-start bytes in both generated roots, over 16,384. Raise
that ceiling by one 4 KB step to 20,480 and record a dated acceptance in the
existing budgets file under the standing operator instruction. Preserve the
reviewed rules; other configured role ceilings remained within their bounds.

Outcome: the bounded admission fixtures, live identity probe, current planning
check, 41 planning regressions, document gate and full product gate passed.
The two inherited planning failures are repaired in this branch, with exact
future amendment bindings and history-preserving reassessments. NoOp would
have kept the reproduced failure. The remaining subagent identity gaps are
explicit; no exact creation total or Codex hook enforcement is claimed.

## WO-139-D005 — Release the writer as part of executor completion

```json
{
  "id": "WO-139-D005",
  "date": "2026-09-18",
  "dispatch": "scope expand: fix Codex retaining its executor/fix writer lock",
  "decision": "Make implementation-ready and repair-complete perform the final index refresh and release only the current Codex session's writer reservation after the durable result and observations. No operator release command is part of handoff.",
  "evidence": ["WO-139's completed executor handoff retained its reservation with no release journal row", "scripts/resume.mjs had no writer release", "packages/skeleton/src/harness-host.ts releases at Claude Stop, which the Codex profile does not provide", "scripts/test-harness.mjs WO-139 Codex executor and fix completion fixture"],
  "rejected": ["NoOp leaves the next role blocked by completed work.", "A new manual release command shifts cleanup to the operator and was explicitly rejected.", "Treating a dead owner as released hides the leaked reservation.", "Releasing before the final index write creates an ownership gap.", "Force-releasing or selecting the latest session can remove another actor's reservation."],
  "reopenWhen": "A successful executor/fix completion leaves its own reservation, later required writes reacquire it, or completion removes a different session's reservation."
}
```

Correction: the previous executor response claimed a finished handoff while
leaving the writer reserved. The operator correctly identified that retained
reservation as the bug. The first proposed extra handoff command was also
wrong: ordinary completion must perform cleanup automatically. The operator
reports the regression began yesterday; the inspected repository history
retains Claude's Stop release and does not identify a removed automatic Codex
release. Do not turn that unknown provenance into a contrary claim about the
operator's observed behavior.

Mission/critical path: make the completed executor yield the worktree to the
next role without operator rescue. Policy resistance and burden shifting favor
cleanup in the existing command. Commons and escalation favor keeping the
single-writer protocol and adding no new workflow command. Drift, rule beating
and wrong-goal risks require real successful and rejected lifecycle executions,
with the final index written before release and another holder preserved.
Success-to-the-successful grants no exemption to the current session. NoOp
retains the reproduced failure; Naive Interventionism rules out weakening the
reservation, liveness or worktree-teardown protections.

This explicit expansion arrived after ImplementationReady. The canonical phase
remains ready-to-verify; no failure report, repair dispatch or duplicate result
is invented to represent the operator's additional authority. The decision and
updated execution evidence record the added scope before independent verification.

The release callback is prepared before append and runs after the final
projection attempt. Rejected pre-append validation keeps ownership. Once the
event records, even a final index write failure releases the session's own
reservation and reports that the recorded transition must not be repeated.
The regression injects an existing index temporary file to exercise that path,
preserves a subsequent verifier's reservation, and keeps the fixture host alive
through both normal handoffs.

Outcome: the focused handoff regression, existing resume suite, all 51 harness
cases, 19 product suites and 17 document checks passed. The current planning
check remains green. The ordinary commands own cleanup; neither operator rescue
nor a dead-process assumption is part of the successful handoff.

## WO-139-D006 — Repair runtime identity and advisory provenance

```json
{
  "id": "WO-139-D006",
  "date": "2026-09-18",
  "dispatch": "resume: fix",
  "decision": "Pin the imported cap module in the existing runtime declaration and mark actual budget advisories at their source so classification throttling remains independent; reconcile the Stop fixture with its two preserved sections.",
  "evidence": ["docs/final-reviews/WO-139/FINAL-001.md F1 and F2", "scripts/lib/harness.mjs runtimeFiles", "packages/skeleton/src/harness-host.ts advisory selection", "scripts/test-process-debt.mjs"],
  "rejected": ["NoOp leaves installed behavior stale and the required review gate failing.", "Matching the word subagent cannot distinguish budget provenance from remote-agent classification.", "A second manual runtime check adds recurring operator work instead of repairing the existing integrity check."],
  "reopenWhen": "A required module changes without changing the installed runtime identity, snapshot damage passes integrity checks, or one advisory family suppresses another."
}
```

Mission and critical path: preserve dependable independently verified execution
by making installed cap behavior follow reviewed bytes, without recurring
operator diagnosis. FINAL-001 reproduced module-only drift and two failing
regressions. The repair stays within those findings, retains the advisory
fallback and four-refusal boundary, and adds no dependency or workflow step.

Policy resistance and rule beating favor one pin declaration consumed by
generation and integrity checks. Commons, escalation and burden shifting favor
focused regressions and one grouped read-only review, not recurring manual
inspection. Drift and seeking the wrong goal require executed installed behavior
and a passing review gate, not a green generation count alone.
Success-to-the-successful gives neither the existing pin list nor text matching
an exemption. Under Naive Interventionism, preserve useful spawning, recovery,
immutable snapshots and per-cause throttling; the smallest probe changes only
the cap module in a disposable fixture. NoOp retains the demonstrated defects.

Fan-out plan: one read-only helper, no descendants; this executor is the sole
writer. Entry usage at 2026-09-18T16:41:11Z reports token and cost counters
unavailable (dispatch scope); observed spawns 0/20 with unknown uncounted
remainder. The explicit Codex helper count after admission is one.
