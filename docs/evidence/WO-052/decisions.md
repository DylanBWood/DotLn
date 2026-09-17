# WO-052 decisions

## WO-052-D001 — Recover the effect from Git under the existing host lease

```json
{
  "id": "WO-052-D001",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Add one source-change slice and a separate source-change host, preserving the inspection host. Persist the original focused-test observation before dispatch; recover the target branch's descendant commit before considering another dispatch; save a distinct immutable commit receipt without inventing a worker result.",
  "evidence": [
    "docs/work-orders/WO-052-source-change-host.md",
    "packages/skeleton/src/worker-host.ts",
    "packages/skeleton/src/worker-store.ts",
    "packages/skeleton/src/worker-worktree.ts",
    "packages/skeleton/src/worker-protocol.ts",
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/src/reactor.ts",
    "docs/evidence/WO-009/README.md",
    "docs/work-orders/WO-049-target-worktree-bundle.md"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "The transport and governed bundle exist, but no host connects them or recovers a source effect; WO-053 remains blocked." },
    { "option": "Reuse detached inspection worktree verification", "reason": "It requires HEAD equal to base and no ignored files, incompatible with a committed writer branch and governed bundle." },
    { "option": "Redispatch every expired attempt", "reason": "A commit may already exist without a saved result; a second writer could duplicate the effect." },
    { "option": "Synthesize a completed worker envelope on Git recovery", "reason": "Git proves the effect, not a worker self-report. A distinct host receipt retains that distinction." },
    { "option": "Generic effect framework or remote publication", "reason": "One receipt consumer needs neither abstraction nor remote authority." }
  ],
  "reopenWhen": "Scratch recovery evidence contradicts the receipt/lease design, a real target requires another lifecycle in WO-053, or an independent review finds a missing authority or preservation boundary."
}
```

This completes the host part of critical-path gate D2 toward the first external
source change. Policy resistance/fixes that fail: one existing store lock and
lease protocol fence retries, while the host checks the actual branch, base,
diff surfaces and bundle. Commons and escalation: use process doubles and one
writer; add no dependency, remote operation or new operator approval ritual.
Drift and rule beating: require real Git commits and retained before/after test
observations, rather than accepting worker prose. Success to the successful:
reuse the two supported transports without preferring either. Shifting the
burden: automatic commit inspection removes recurring crash triage. Seeking the
wrong goal: the outcome is one recoverable source effect, not more receipts.
Naive Interventionism: preserve inspection, existing slice folds and all frozen
Decision traces; scratch repositories are the smallest useful probe. The new
slice owns its workstream's lifecycle events so source completion cannot invoke
the inspection continuation. No historical source-change workstream exists.

New inputs: `source-change-environment.ts`, `verification-protocol.ts`,
`worker-status.ts`, `scenario.ts`, `writer.test.ts`, `reactor-slices.test.ts`,
the target emitter/check/remove implementation, and existing release/evidence
generation scripts supply the routing and validation contracts. The cited
WO-049 implementation supersedes the order's old `--out` spelling with
`emit --target ... --runtime-root ...`; finish uses its paired removal and safe
Git worktree removal. A source receipt never grants push, rebase or discard.

Entry actor: Codex CLI 0.154.0, gpt-6-astra, ultra (xhigh, mode subagents),
`codex-session-readback`. Entry process counters were unavailable at
2026-09-17T01:55:24.115Z, scope dispatch; tokens, cost and activity are unknown.

## WO-052-D002 — Bind the three opaque commands to the live source host

```json
{
  "id": "WO-052-D002",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Issue a strictly decoded launchpad-side route for the exact focused test, git add -A and host-message commit, fenced by owner liveness, expiry, branch/base and message identity. Keep native compiled permission, writer and attribution guards active.",
  "evidence": [
    "packages/skeleton/README.md#target-worktree-bundle",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/source-change-command.ts",
    "packages/skeleton/fixtures/source-change-cli.mjs",
    "packages/skeleton/test/source-change-host.test.ts"
  ],
  "rejected": [
    { "option": "NoOp or process doubles that skip native guards", "reason": "The existing target permission hook refuses opaque test and commit commands; a successful ungoverned double alone would hide the integration gap." },
    { "option": "Allow arbitrary shell commands in target profiles", "reason": "Only three host-selected commands are needed; generic shell containment is neither available nor claimed." },
    { "option": "Treat WorkOrder.requiredEvidence as proof", "reason": "Requirements cannot authorize themselves; authorityEvidence is separately supplied and request-bound." }
  ],
  "reopenWhen": "WO-053 reveals a different native command behavior, live orphan-writer behavior contradicts the stated limits, or another compiled consumer needs a different command contract."
}
```

D001's mission/trap comparison applies. This closes an explicitly documented
WO-052 integration obligation, with no new global permission or compiler rule.
The native-hook fixture prevents rule beating. Source-specific authority is
checked for all three local effects; a route cannot replace that authority.
The emitter's runtime inventory now includes the new pure slice and command
route modules; all new host modules enter the feedback source inventory.

Correction from the read-only audit: the first implementation passed the
WorkOrder's required-evidence list to authorization as if it were observed.
That was unsupported. The host now accepts separate established evidence and
the fixture proves an unmet requirement refuses even when both requirement
lists name it. Authority is rechecked around the host's after-test. The worker
lease ends with its process; commit recovery and host testing do not pretend
that an expired worker lease is renewed. The same audit identified safe-refusal
limits for interrupted preparation/finish, now explicit in the runbook.

Final route audit correction: shell classification alone described Git commands
as `shell.run`. The route's narrower `git.local` effect now receives its own
compiled-target authorization check. A native-hook fixture narrows the target
envelope, admits its test command and refuses Git despite a valid host route.
The route grants neither the source envelope nor the target envelope new effects.

Full-gate correction (2026-09-17): the first gate exposed missing reactor-import
and WorkerStore receipt-read inventory entries. Inspecting the complete purity
assertion also showed that the host called the kernel authority decider directly,
contrary to the existing pure-reactor ownership rule. The host now checks authority
through a pure reactor helper with the same intent, envelope and context; the
prohibition on host-owned kernel decisions remains intact. The test explicitly
pins the new fold's pure dependencies, and every new receipt read is listed with
its positive decoder and consumer. Three focused inventory/purity checks pass.
The gate was stopped before edits; its failure log remains in ignored local
evidence. The old empty-slot runbook statement is corrected. This is completion
of D001's host/slice boundary, with no widened authority or new architecture.

## WO-052-D003 — Stage the classified release and current evidence

```json
{
  "id": "WO-052-D003",
  "date": "2026-09-17",
  "dispatch": "resume: next",
  "decision": "Prepare application v0.28.0 and skeleton 0.24.0 under the order's minor classification; refresh bundle pins, deterministic evidence and the existing read-only feedback audit after source stabilizes.",
  "evidence": ["docs/work-orders/WO-052-source-change-host.md", "scripts/lib/release-preparation.mjs", "scripts/feedback-evidence.mjs", "docs/evidence/WO-051/decisions.md"],
  "rejected": [
    { "option": "NoOp or retain stale evidence", "reason": "The work order requires a release and fresh runtime evidence." },
    { "option": "Live source-change launch or remote publication", "reason": "Those are separate WO-053/WO-064 and review/release actions." },
    { "option": "Bump unchanged kernel/compiler packages or event schema", "reason": "The behavior is additive skeleton host/slice work; no dependency or hash preimage changes." }
  ],
  "reopenWhen": "Final integration advances the release baseline or verification identifies a source change requiring a fresh immutable evidence revision."
}
```

Local tags show v0.27.0; skeleton is 0.23.0. The canonical release helper
requires a strict initial heading/README version, so resolve the activation
placeholder first. The pre-2026-09-09 order's ledger duty is discharged by this
decisions file and generated index under the executor skill. D001's goal/trap
analysis applies: reuse existing generation/check mechanisms, preserve old
editions, and avoid a separate gate or operator arbitration.

The runtime correction above requires authority and feedback revision `001`.
The first WO-052 editions remain immutable; `docs/evidence/current.json` selects
the replacement after generation, with a fresh read-only audit for that source.

## WO-052-D004 — Report the inherited `process-debt` failure; do not repair it here

```json
{
  "id": "WO-052-D004",
  "date": "2026-09-17",
  "dispatch": "resume: final review",
  "decision": "Record the reviewer's failing `npm test -- --review` row and its causation proof in FINAL-001, the pull-request body and the release notes, and carry WO-052's pass on the product gate its AC6 names. The three failing `process-debt` subtests assert the pre-presence hook wiring and are reproduced byte-for-byte on a clean `main` extract that contains none of this order's changes; they are WO-121's regression and belong to a separately verified bounded order, not to this diff.",
  "evidence": [
    "docs/control/local/harness/checks.json",
    "scripts/test-process-debt.mjs",
    "scripts/test-runner.mjs",
    "packages/compiler/src/harness.ts",
    ".claude/settings.json",
    "docs/product/07-execution-guide.md#independent-workflows-and-integration"
  ],
  "rejected": [
    { "option": "Repair the three assertions in this order", "reason": "A reviewer never writes a behavioral fix and certifies it, the correct assertions are a presence-contract design choice this order does not own, and the repair would widen WO-052 beyond its named surfaces." },
    { "option": "Fail WO-052", "reason": "All six acceptance criteria are established at the reviewed tree, and the failure reproduces on `main` without one byte of this delivery; failing here would route a sibling's regression to the wrong order's repair." },
    { "option": "Report only the passing product gate", "reason": "The `--review` selection is the reviewer's own required check. Omitting its result would hide a red gate from the operator and from the next order to touch these sources." },
    { "option": "NoOp on the report as well", "reason": "The next order that changes a `process-debt` declared source meets the same red gate with no record of why." }
  ],
  "reopenWhen": "A bounded order repairs the assertions against the presence hook wiring and an independent verification passes them, or a later `--review` shows any part of the failure depends on WO-052's bytes."
}
```

The three subtests are `every installed hook is wired to a harness event or the
Git commit boundary`, `WO-131 operator-control precedes runtime, state, Git,
gate and writer checks in every generated hook`, and `WO-132 missing bootstrap
runtime delegates every pre-tool hook to host permissions`. The first asserts
that emitted `SessionStart` hooks deep-equal `UserPromptSubmit` hooks and that
`Stop` carries exactly one hook; `packages/compiler/src/harness.ts` wires
`SessionStart` to `session.mjs` alone and appends a presence hook to each of the
four harness events, so both assertions contradict the repository's own
committed `.claude/settings.json` at `main`. The other two walk every wired hook
and reach the presence hooks, which carry no operator-control branch.

The failure surfaced now because `process-debt` declares
`packages/skeleton/src/harness-host.ts` among its sources and WO-052 is the
first order since `417c094` to change it; the WO-121 series changed
`scripts/lib/harness.mjs` and `scripts/test-runner.mjs`, neither of which that
suite declares, so its own `--review` run of 28 suites did not select it.
Causation was measured, not inferred: `git archive main` was extracted to a
scratch tree, built, and the three subtests run there fail with byte-identical
errors.

Goal alignment: the mission cost of shipping is one red machinery suite already
present on `main`; the cost of repairing it here is a reviewer-certified change
to what a check proves, inside an order that does not own the contract. Rule
beating is the live trap in both directions — a green gate obtained by narrowing
the check, or a pass claimed by running only the suite that already passes — so
both gate results are recorded with their code identity. NoOp on the repair wins
because the defect is stable, reversible and fully described; NoOp on the report
loses because the next order pays the diagnosis again.

## WO-052-D005 — Hand the new-capability-id gate condition back to the planner a second time

```json
{
  "id": "WO-052-D005",
  "date": "2026-09-17",
  "dispatch": "resume: final review",
  "decision": "Record criterion 5's new capability id `worker.source-change` as a merge prerequisite cleared only by a planning dispatch, leave the executor's `dated addition` heading and the row itself untouched, and re-raise WO-068's still-open nomination rather than inventing a reviewer-local workaround.",
  "evidence": [
    "scripts/lib/plan-continuation.mjs",
    "docs/final-reviews/WO-068/FINAL-001.md",
    "docs/planning/capability-table.md",
    "docs/planning/refutations/2026-09-16-planning-496d3a8cf6dab3e9-015.json",
    "docs/work-orders/WO-052-source-change-host.md"
  ],
  "rejected": [
    { "option": "Rename the heading to `dated reassessment`", "reason": "It relabels a genuinely new capability as a reassessment, hides the first failure behind a less legible second one, and makes a planner-owned decision inside a reviewer dispatch. It also clears nothing: the id check still refuses." },
    { "option": "Delete the capability row", "reason": "Criterion 5 requires it." },
    { "option": "Author a planning receipt at final review", "reason": "A refutation dispatches a model transport on the operator's budget and is the planner's dispatch, not the reviewer's." },
    { "option": "Fail the order", "reason": "It would route a planning-subject change to a repair phase that cannot discharge it; the same reasoning WO-068's review recorded." }
  ],
  "reopenWhen": "A planning pass admits `worker.source-change` into the judged subject, or the planner adopts WO-068's durable repair so that a filing order's own new capability ids are admitted by the pass that files it."
}
```

This is the second order to meet the condition and the first to meet it after the
durable repair was nominated. WO-068 recorded it for `runtime.resident` on
2026-09-16; the operator cleared that instance with a planning pass, and receipt
`2026-09-16-planning-496d3a8cf6dab3e9-015` judges a subject containing the id.
Nothing in the mechanism changed since, so every future order whose write-back
duty names a new capability key reproduces it. Escalation is the live trap: the
cheap local move is a one-word heading edit that would make the first error
disappear and teach nobody anything, and the second-cheapest is a reviewer-authored
receipt that would manufacture the very judgment the gate exists to require.
Both were declined; the cost of the honest path is one operator dispatch before
merge, and it is stated in the report, the pull-request body and the release notes.
