# WO-046 decisions

## WO-046-D001

Executable continuation boundary (2026-09-15)

```json
{
  "id": "WO-046-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Keep Program.T as the authoring grammar; add a recursive ExecutableProgramV1 union, constructor overloads, and a typed decoder at persisted-state reads.",
  "evidence": [
    "packages/kernel/src/types.ts",
    "packages/kernel/src/core.ts",
    "packages/skeleton/src/reactor.ts",
    "corpus/harness/wo101-program-corpus.test.mjs"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves deferred or malformed continuations to fail after execution begins." },
    { "option": "Implement deferred kinds", "reason": "No consumer or semantics is authorized by this order." },
    { "option": "Generic child parameters throughout the authoring grammar", "reason": "Overloads preserve existing constructors without changing every node interface." },
    { "option": "Stepper-only runtime validation", "reason": "Does not protect the persisted-state boundary before dispatch." }
  ],
  "reopenWhen": "A valid existing continuation fails decoding, a new executable kind gains semantics, or measured decoding cost requires a different boundary."
}
```

The mission contribution is dependable recovery for the always-on runtime:
persisted data must describe work the stepper can execute. The current code
accepts the full grammar and casts stored programs. Preserve serialized bytes,
event schema, hash inputs and all existing executable semantics. Validate every
Program child, event draft, Act command, pattern and predicate reference. Await
timeouts retain the full Cadence grammar: the Program stepper returns waits and
does not evaluate their cadence. Registry availability remains an execution
environment concern. Unknown structural fields are refused; JSON payloads remain
opaque data. The decoder accepts serialized JSON or an already parsed value.

Policy resistance and fixes that fail: one boundary contract replaces casts;
constructor overloads keep authoring and execution compatible. Commons and
escalation: no dependency or extra operator gate, read-only advisory review,
focused checks before the required full gate. Drift and rule beating: executable
corpus outputs remain pinned, with negative nested and malformed fixtures and
compile-time equality checks. Success to the successful: compare overloads with
generic grammar and dedicated constructors; choose the smallest compatible
surface. Shifting the burden: reject bad persisted values before dispatch instead
of requiring operator recovery. Wrong goal: retain capability L2 until real-session
continuation evidence exists; passing types alone do not prove that target.
Naive Interventionism: the existing grammar supports authoring deferred kinds;
preserve that function, avoid migration and retain immutable historical evidence.
Smallest probes are kernel decoding, type compilation and unchanged replay vectors.

Entry usage at 2026-09-15T22:31:40.131Z: total tokens unknown, source unavailable,
scope dispatch. No cost reduction is claimed. Final counters belong in ignored
receipts and the handoff.

## WO-046-D002

Local release and evidence (2026-09-15)

```json
{
  "id": "WO-046-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Stage application v0.21.0, kernel 0.4.0 and skeleton 0.18.0; refresh immutable evidence editions and generated runtime pins.",
  "evidence": ["package-lock.json", "docs/work-orders/WO-046-executable-program-split.md", "docs/evidence/current.json"],
  "rejected": [
    { "option": "Patch kernel", "reason": "Narrowed stepper input and replacement decoder are public API changes under 0.x." },
    { "option": "Bump compiler or console", "reason": "Their implementation and artifact identity are unchanged." },
    { "option": "Reuse historical source evidence", "reason": "New runtime bytes require a fresh edition; prior editions remain immutable." }
  ],
  "reopenWhen": "Integration consumes the target version or executable evidence detects semantic or artifact identity drift."
}
```

The local tag snapshot contains v0.20.0. The activation left the heading
unassigned; assign the next minor target before canonical release preparation.
Skeleton's new persisted-input rejection boundary merits a minor bump. No new
dependency is added. Capability remains L2; the real-episode continuation target
is still unproven. The pre-2026-09-09 ledger duty is discharged here and in the
decisions index under the current executor procedure.

Review caught a direct-input array prototype hole: a nonstandard array iterator
could disagree with validated elements. Require ordinary array prototypes and
pin rejection with a regression; this is within the decoder obligation.

## Outcome and documentation correction

The promised boundary behavior is demonstrated by 93 kernel tests, ten focused
continuation/fold tests and the unchanged 38,920-evaluation Program corpus.
The full executor gate passed 19 suites / 62 fresh tasks with zero failures.
Live feedback verification completed; fixture, semantic-hash and artifact-identity
comparisons remain unchanged. The extra decoder rejects malformed persisted data
before dispatch without implementing deferred semantics. No total-cost saving is
claimed; entry usage counters were unavailable. The final observation remains in
the ignored usage receipt and handoff.

Same-day correction: the initial write-back treated the capability inventory as a
current row. Its header pins a historical evidence window. Preserve that row and
place WO-046's L2/E0 reassessment in a dated addendum, following the existing
addenda. Only documentation changed after the passing product gate.
