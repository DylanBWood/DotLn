# WO-068 decisions

## WO-068-D001

```json
{
  "id": "WO-068-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Use a shared presence interpreter, optional resident slice and inspected lifetime plus append locks for the local resident.",
  "evidence": ["packages/skeleton/test/presence.test.ts", "packages/skeleton/src/worker-store.ts", "docs/work-orders/WO-068-resident-host.md"],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves the compiled policy without a consuming host."},
    {"option": "Harness scheduler, network daemon or duplicate interpreter", "reason": "Unavailable or unrelated mechanisms do not satisfy this bounded order."}
  ],
  "reopenWhen": "Fixtures cannot establish return precedence, restart identity or one-tick equivalence."
}
```

Dispatch: `resume: next`. The resident turns the compiled presence policy into
an operator-started offline process, unblocking the mission and portfolio
consumers on the critical path. Reuse WO-067's interpreter and the kernel's
cadence/authorization functions, WO-050's optional slice, WO-047's explicit
replay projector and WO-009/048's inspected exclusive host lock. A short append
lock also admits the separate human presence command while the host runs.
One root writer owns this worktree; delegated reviews are read-only.

NoOp leaves the compiler without a consuming host and requires recurring manual
launches. A harness scheduler is unavailable in the cited C-U3/X-U3 observations;
a network daemon, actor fallback and duplicate interpreter add unrelated behavior.
The selected solution preserves existing serialized states and introduces no
dependency or system-service installation. Reopen if fixtures cannot establish
return precedence, restart identity or one-tick equivalence.

Goal-alignment comparison: policy resistance is addressed by sharing the emitted
guards and checking return before dispatch/outcome; the commons by one host and
one bounded episode; drift by retaining byte-identity and executable acceptance;
escalation by adding no lifecycle gate; success-to-the-successful by retaining
the scheduler-driven one-tick alternative; shifting the burden by replay and
inspected recovery; rule beating by real process, lock and network-boundary
checks alongside doubles; wrong-goal risk by delivering script execution rather
than receipts as the product. Naive Interventionism favors the optional slice
and existing lock pattern over changing the kernel or execution environment.
The smallest useful probe is the three-phase fake-clock fixture, followed by
real process checks; actor availability must name unsupported environments.

## Correction — interpreter citation, 2026-09-16

The order names `packages/compiler/test/presence.test.ts` as containing the
fixture interpreter. Inspection found compilation tests there; the interpreter
is in `packages/skeleton/test/presence.test.ts`. The intended shared interpreter
will be extracted from that file and used by its existing tests and the host.

## WO-068-D002

```json
{
  "id": "WO-068-D002", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Use a native macOS no-network script supervisor, exact argv and declared resource/output contracts; unsupported actor kinds remain unavailable.",
  "evidence": ["packages/skeleton/src/actor-catalog.ts", "packages/skeleton/src/script-episode.ts", "packages/skeleton/test/resident.test.ts"],
  "rejected": [{"option": "Cleared environment alone or an unsandboxed fallback", "reason": "Neither enforces the no-network contract."}, {"option": "Treat exit zero or actor prose as verification", "reason": "The host must check a declared output expectation."}],
  "reopenWhen": "A new host boundary is observed or a consumer needs richer verification than exit status plus expected stdout digest."
}
```

Native probes and fixtures establish the sandbox's loopback EPERM, literal argv,
working directory and no inherited sentinel. A disposable supervisor retains the
bounded deadline and kills the ordinary script process group on IPC disconnect,
including resident SIGKILL. A malicious process that defeats group membership is
outside this trusted owner-authored script contract. Resource amounts are
pre-dispatch reservations checked against scope and authority, not actual edit
measurements. No independent source-change correctness claim is made.

The immutable configuration lives in a dedicated store's `resident.json` and
its first configuration event. It declares one actor per phase. The CLI exposes
only the actual script capability; test hosts inject their fixture capability.
The arm generation joins the specified deterministic identity tuple to avoid
collisions when separate fresh arms have the same sampled due time. No startup
or shutdown events distinguish two once invocations from a two-tick loop.
Recompilation and result-schema checks run during recovery before lock reclaim.

## WO-068-D003

```json
{
  "id": "WO-068-D003", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Complete the activation assignment at application v0.23.0 and skeleton 0.19.0; regenerate pinned runtime dependencies and a fresh feedback edition.",
  "evidence": ["docs/work-orders/WO-068-resident-host.md", "packages/skeleton/package.json", "scripts/lib/harness.mjs", "scripts/lib/evidence-sources.mjs"],
  "rejected": [{"option": "No component bump or reuse old behavior-source evidence", "reason": "A new runtime and reactor dependencies require a minor component and current evidence."}],
  "reopenWhen": "Final integration consumes the staged version or source changes invalidate the selected edition."
}
```

The order's heading still contained an activation placeholder. The local tag
snapshot tops at v0.22.1, so v0.23.0 completes its declared minor assignment.
Only skeleton changes behavior; kernel/compiler/console versions remain.
Additional necessary subject inputs are `resident-state.ts`, `resident-store.ts`,
`presence-machine.ts`, `script-episode.ts`, the native script fixtures,
`feedback-audit.ts` and the runtime/evidence dependency inventories. The snapshot
and audit now name the reactor's new transitive modules. `scenario.ts` needs no
change, so its conditional driver extraction is not triggered.

Entry usage: unknown, source unavailable, scope dispatch, cutoff
2026-09-16T14:50:45.277Z. Read-only delegated reviews identified malformed event
admission, missing resource checks and a presence-store symlink seam; all were
corrected inside this deliverable with focused regressions before final checks.
The delivered benefit remains the runnable foundation described in D001; no
measured cost savings or live-model runtime maturity is claimed.

Final runner review also corrected failed-supervisor launch settlement, inherited
Node flags, UTF-8/CR first-line extraction and the timeout path for detached
output-pipe holders. Ordinary descendants are reaped; a deliberately detached
process is not claimed contained, but cannot keep the host waiting beyond the
script deadline. A crash fixture exposed idle polling entering the short lock's
recovery window; polling now checks the log size and takes append ownership only
when new events need folding. Interrupted acquisition guards still refuse for
inspection under the existing worker-store contract. The real crash fixture
kills an in-flight script while no append transaction is active.

The first feedback audit completed before these runner corrections. Its report
and ignored live store remain preserved; revision 002 is the final selected
feedback/authority edition. Artifact and verification editions from WO-133 pass
their current checks byte-identically and remain selected. Host/store monitoring
is covered by the resident suite; the feedback audit's declared source projection
covers the reactor and its imported dependencies, not the entire application.

The first full gate exposed WO-016's literal one-file decider census and was
stopped after 74.8 seconds without a success row, before any input edit. The
work order explicitly moves its compiled interpreter into the runtime. Retain
one reactor boundary and extend that census only for the two named pure helpers:
`presence-machine.ts` evaluates cadences; `resident-state.ts` authorizes. Their
pure import checks include the new `actor-contract.ts`; subprocess code remains
in the catalog. Deterministic episode identity now uses the kernel's existing
command-identity hash over the full policy/phase/cadence/due-time/arm tuple.
`scenario.ts` itself remains unchanged and its size ceiling remains intact.
Revision 002 binds this final pure dependency boundary; earlier immutable
feedback/authority editions remain historical. The expanded focused suite passes
45 tests, including the architecture census and unchanged full Decision bytes.

At the executor handoff, the final `npm test` passed on 2026-09-16 at
15:48:44.181Z: 19 suites, zero failures and 63 fresh tasks in 248,809 ms.
The outcome supports D001's bounded consuming host and D002's native script
contract; the documented unavailable actors and containment limits remain.
The extra audit editions and interrupted first gate are retained costs, not a
claimed efficiency improvement. Independent verification can reopen any
acceptance claim using the recorded source and fixture evidence.

## WO-068-D004

```json
{
  "id": "WO-068-D004", "date": "2026-09-16", "dispatch": "resume: final review; operator instruction during the dispatch to fix the appended README \"What runs today\" block",
  "decision": "Rewrite the README release block as four labelled paragraphs and tell the next author to rewrite rather than append; nominate the per-order \"one sentence\" write-back duty that causes the accretion.",
  "evidence": ["README.md", "scripts/release.mjs", "scripts/lib/release-preparation.mjs", "docs/product/07-execution-guide.md"],
  "rejected": [
    {"option": "NoOp", "reason": "The block grows one sentence per order and nothing prunes it; it had reached 26 sentences on one physical line."},
    {"option": "Reorganize without pruning", "reason": "Keeps every appended claim and so does not stop the accretion the operator named."},
    {"option": "Enforce a length or shape in release check-surfaces", "reason": "A machine limit on prose invites gaming and is not the operator's complaint; the cause is the authoring duty."}
  ],
  "reopenWhen": "The block passes fifteen sentences again, or a release surface check begins to depend on its prose."
}
```

Dispatch: the operator's explicit instruction during `resume: final review`, recorded
as a scope expansion rather than presented as boy-scout cleanup. The block is
bounded only by `releaseBlockRule` (`scripts/release.mjs:407-459`): exact marker
lines, one ordered block, exactly one strict version. Nothing constrained its
content, so thirty orders appended thirty sentences. Roughly two thirds had also
drifted into contributor process detail already documented in product 07 at lines
260, 1012-1013, 1338, 1366, 1409 and 1437.

The rewrite is four labelled paragraphs at 2,889 bytes, down from 3,685, keeping
all five links. No test asserts the block's prose; that was checked before
writing. Every process claim removed from the front page was confirmed to remain
recorded in product 07 or in the skeleton README's own release stack. The
authoring comment avoids the `DOTLN-RELEASE-BEGIN`/`-END` tokens because
`release prepare` (`scripts/lib/release-preparation.mjs:82-88`) throws unless
exactly two lines name them. After the edit `release check-surfaces` reports
`PASS release-block: observed v0.23.0`, `publication:check` is unchanged and
needed no lock regeneration, and Prettier passes.

The root cause is outside a reviewer's reach and is nominated to planning: the
write-back duty itself. This order's criterion 7 says `README "What runs today"
(one sentence)`, and that phrasing is written fresh into each order rather than
inherited from a template, so it reproduces the accretion until the planner stops
filing it. Reopen on either condition above.

## Correction — capability write-back and the planning gate, 2026-09-16

Criterion 7 requires a dated `runtime.resident` capability row. What was missed
at execution and at verification is that `runtime.resident` is a capability id no
planning pass has judged, and `checkPlanContinuation` accepts an appended
capability section only as a `dated reassessment` of already-known ids
(`scripts/lib/plan-continuation.mjs:70-94`). The row therefore leaves
`npm run test:docs` red on this branch: `plan` and `plan-refutation-current` both
report `planning pass needs a receipt matching the current subject`. Removing the
WO-068 section makes `npm run plan -- check` exit 0; renaming its heading to
`dated reassessment` moves the failure to `new capability id runtime.resident`.
The heading was deliberately left as written, because the section is honestly an
addition and relabelling it would hide the real condition. No executor repair can
discharge this, so it is recorded as a merge prerequisite needing a planning
dispatch, not routed to repair. Reopen when a planning pass admits the capability
or the checker learns a dated-addition form for ids the filing order introduces.
