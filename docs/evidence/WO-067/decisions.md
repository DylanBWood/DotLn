# WO-067 decisions

## WO-067-D001

```json
{
  "id": "WO-067-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Compile optional presence policies with ordered phases, four separate axes, kernel cadence and transition data, and restrictions under the final compiled base; keep scheduling with WO-068 and omit empty presence from semantic identity.",
  "evidence": [
    "WO-067 and ADR-0007 require a reproducible build policy.",
    "Existing compile.ts, normalize.ts, authority.ts and view/hash tests establish the base and compatibility conventions."
  ],
  "rejected": [
    "NoOp leaves the resident gate without policy data.",
    "A new schedule language duplicates kernel cadences.",
    "Ambient runtime flags lose build identity; absence cannot grant authority."
  ],
  "reopenWhen": "A resident consumer demonstrates a missing transition or an existing policy-free semantic hash changes."
}
```

Operator dispatch: `resume: next`. Sources: WO-067, ADR-0007, product 03
§Operator-presence policy, compiler `compile.ts`, `normalize.ts`, `authority.ts`
and existing view/hash tests. The observed gap is a missing serializable policy;
the resident runtime needs inspectable cadence, transition and authority data.

Chosen: an optional collection with ordered phases, four separately named axes,
validated cadence/condition inputs, additive restrictions under the final compiled
base envelope, and explicit transitions for absence, verified success, failure,
return and idle expiry. A phase may restore an allowance removed by an earlier
phase; it cannot undo the compiled base's support denials or host controls.
Compilation emits data. A fixture interpreter will exercise that data with the
unchanged kernel cadence evaluator; scheduling and episode execution stay WO-068.
Empty policies do not enter the semantic hash. Views preserve phase order and
the tooltip derives its presence tracks from compiled values.

NoOp leaves the resident gate without a reproducible absence contract. A new
schedule language duplicates the kernel; an ambient runtime flag loses build
identity; interpreting absence as a grant violates the floor. None meets the
selected outcome. General curve languages and portfolio execution remain their
allocated work. Reopen on a resident consumer demonstrating a missing transition
or an existing policy-free hash changing.

System traps: policy resistance is controlled by preserving base restrictions;
commons cost is bounded by declared budgets and host-counted file/line ceilings;
drift is checked against fixed transition and compatibility expectations;
escalation is limited by emitting data without adding a supervisor or approval
loop. Existing cadences win over a new language for demonstrated compatibility,
not sunk cost (success to the successful). Durable build data reduces recurring
operator rescue (shifting the burden). Tests must consume compiled transitions
and kernel cadences, rather than merely assert shape (rule beating). The outcome
is the resident prerequisite, not fixture or receipt counts (wrong goal).

Naive Interventionism: preserve existing loadouts, hashes and kernel behavior;
the smallest useful probe is one three-phase fixture plus hostile narrowing
inputs. New semantics remain opt-in and reversible by removing the collection.
Entry process-cost counters are unknown: harness source `unavailable`, scope
`dispatch`, cutoff 2026-09-15T17:39:54.930Z. No measured savings are claimed.

## WO-067-D002

```json
{
  "id": "WO-067-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Complete the unassigned activation as application v0.19.0 and compiler 0.11.0 under the declared minor classification. Correct authority and return lowering from read-only review and test actual unit resource consumption.",
  "evidence": [
    "release prepare --local refused the version placeholder before editing.",
    "Latest observed local annotated release is v0.18.0.",
    "Read-only review identified inherited resource-key lookup and finish/kill gate ambiguity.",
    "First kernel fixture run showed authorization spends one unit per resource action."
  ],
  "rejected": [
    "Retain an unassigned target: release preparation cannot complete.",
    "Bump unchanged components: only compiler production source moves.",
    "Weaken the test to accept resource overflow: consume the returned envelope and assert exhaustion instead."
  ],
  "reopenWhen": "An observed release collision requires canonical retiming or a phase can exceed its compiled base."
}
```

The activation retained its version placeholder, so `release prepare --local`
refused before editing. Complete the already-declared minor assignment as
application `v0.19.0`, next minor above observed local annotated `v0.18.0`,
and compiler `0.11.0`. Only compiler production source moves; the skeleton's
compiler dependency pin follows it. This is an initial assignment, not a change
to a previously assigned target. No dependency is added and no publication is
authorized. Reopen for an observed release collision through the existing helper.

Read-only implementation review found prototype-inherited resource names could
bypass a numeric ceiling lookup. Own-property checks and `toString`/`constructor`
regressions close that hole. It also separated cancelling future cadences on
return from interrupting only discretionary `kill` episodes, and retained
base-equal wildcard allowances with their inherited denials. These are corrections
inside the original authority/return acceptance scope, not additional mechanisms.

The first executable probe passed compiler validation, views and transition
fixtures; one resource assertion misread the kernel as accepting an action
quantity. The kernel spends one resource unit per authorization. The corrected
test consumes the returned envelope until the declared ceiling is exhausted,
then asserts refusal. Host-counted change size remains a separate resident duty.

The first full gate passed 18 groups and failed the console group's three
selfhost assertions. Its fixture manifest still pinned compiler 0.10.0's WO-132
audit; compiler 0.11.0 correctly made its persisted compilation and policy stale.
The existing `console-fixtures.mjs --record-current-selfhost` recorder repins
the fixture to the independently verified WO-067 audit and regenerates its three
renders. Historical evidence is preserved; console production code and version
stay unchanged. Reopen if the fresh audit cannot supply the acceptance matrix
and observed feedback counts. Documentation review also corrected the tooltip
attribution: reset/loop belongs to PULSE; return and expiry belong to INTERRUPT.

## WO-067-D003

```json
{
  "id": "WO-067-D003",
  "date": "2026-09-15",
  "dispatch": "resume: next; operator explicitly replied Proceed with the bounded repair to the adjacent snapshot repair.",
  "decision": "Pin the compiler artifact-identity module in harness runtime files so a compiler-only version change creates a fresh immutable snapshot; retain previous snapshots and prove the generated writer hook runs.",
  "evidence": [
    "The generated hook named compiler 0.11.0 while reused snapshot 7b3c264bb69b6f3f still loaded compiler 0.10.0; invocation reported Pinned harness runtime unavailable.",
    "scripts/lib/harness.mjs fingerprints its runtimeFiles list, which omitted the compiler module that supplies the version checked by assertHarnessRuntime.",
    "node --test --test-name-pattern=\"WO-067 compiler-only\" scripts/test-harness.mjs passed; the emitted hook reserves its writer under the new pin.",
    "node scripts/harness.mjs check passed after regeneration."
  ],
  "rejected": [
    "NoOp would leave this compiler release with generated hooks rejecting their own runtime.",
    "Rewrite the old immutable snapshot or remove compiler version checks: destroys the pin rather than repairing it.",
    "Hash every file in the installed worktree: unrelated edits would create new runtimes and exceed this bounded defect."
  ],
  "reopenWhen": "A changed runtime dependency can reuse a snapshot while its admission identity or behavior differs."
}
```

This preserves the resident prerequisite and removes operator rescue after a compiler release. Policy resistance and shifting the burden were observed in the hook refusal. Commons cost and escalation favor one extra pinned module and one existing regression. Rule beating and drift are checked by running the emitted hook, not merely comparing paths. Success to the successful and wrong-goal risks favor the bounded key repair over replacing snapshot architecture. Naive Interventionism preserves old snapshots and admission checks; NoOp leaves a reproduced failure.

The explicit harness session start did not itself reserve a writer; this session initially misread it as doing so. No second coding writer was used (both helpers were read-only), and writer observations showed no competing holder. After discovering the missing registration, the current built host fact API registered this session; regenerated hooks then became usable. This is an actor-attested correction, not a claim of automatic Codex hooks or earlier registration.
