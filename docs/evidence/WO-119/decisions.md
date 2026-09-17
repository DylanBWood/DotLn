# WO-119 decisions

## WO-119-D001

```json
{
  "id": "WO-119-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Run bounded repo-native observation with the executable kernel program and persist a strictly validated discovery result in the resident's existing script observation event.",
  "evidence": ["docs/work-orders/WO-119-executable-discovery-producer.md", "packages/skeleton/src/actor-contract.ts", "packages/skeleton/src/script-episode.ts", "packages/skeleton/src/resident-state.ts", "packages/kernel/src/core.ts", "docs/work-orders/WO-073-repository-class-and-profile.md"],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves WO-100 without an executable candidate producer."},
    {"option": "Implement Program.All or let a model scan freely", "reason": "Neither is required for deterministic bounded observation."},
    {"option": "Precompute the expected stdout digest", "reason": "Discovery output depends on the target's actual state; a pinned expected answer would defeat the producer."},
    {"option": "New resident slice and event family", "reason": "The existing ScriptEpisodeObserved event can persist the typed result without another state machine."}
  ],
  "reopenWhen": "WO-073 defines its profile schema, WO-100 needs a richer measured size, or a target cannot fit the bounded complete observation."
}
```

The mission contribution is unattended evidence collection for WO-100's bounded
portfolio. This adds no repair, deletion, ranking or order-derivation authority.
The program uses Sequence, Guard, Invoke and Done and is actually stepped by
the kernel. Script stdout gains an explicit discovery contract; ordinary
digest-verified scripts keep their existing behavior. A schema check establishes
the shape of an observation, not independent verification of a proposed repair.

WO-073 is unimplemented. Accept conventions directly or a declared profile's
`dotln-discovery` JSON block; use package lint/test scripts and no speculative
placement/generated rules by default. Structured target repair history records
identify repeated repairs; prose similarity is not evidence. Missing optional
defaults mean no observations in that category; malformed declarations, resource
limits, unsafe paths and failed launches fail the episode. Candidate size is the
measured number of declared paths, not an estimate of implementation effort.

Policy resistance: reuse resident authorization and return handling. Commons:
bound files, bytes, commands, time and output. Drift: pin six candidates and test
negative cases. Escalation: no new lifecycle gate. Success to the successful:
preserve the manual reviewer and admit direct conventions without a new profile
framework. Shifting the burden: run without an operator await. Rule beating:
execute real seeded checks and a native script, rather than only injecting
candidates through a fake catalog. Wrong goal: deliver observations consumable
by the portfolio, not more review machinery. Naive Interventionism favors an
optional result mode and reusing the existing event; the smallest probe is a
scratch repository with deterministic facts. NoOp preserves current behavior
but leaves that critical-path input absent.

New required inputs: actor contract/catalog/supervisor, resident state and
tests, kernel stepper/types, WO-073's profile description, the existing Sort
fixture and compiler rule, evidence-source inventories and release preparation.
One root writer owns the worktree; delegated analysis is read-only.

Correction, 2026-09-16: the order cites the Entropy Reducer for the Sort candidate
shape. That module defines reviewer findings and a manual Program. The existing
Sort projection is in `packages/compiler/src/seiri.ts` and
`packages/skeleton/fixtures/repo-tree.json`: generated-stale classification,
no references, evidence, and no deletion authority. The new WorkCandidate carries
those same facts while extending the kinds for this order.

The pre-2026-09-09 ledger duty is discharged here and in the decisions index,
as required by the executor skill; that legacy duty does not edit the ledger.
Separate operator ideation does append the ledger under its own dispatch and
the breakout receipt.

## WO-119-D002

```json
{
  "id": "WO-119-D002", "date": "2026-09-16", "dispatch": "resume: next",
  "decision": "Use a single native discovery sandbox for the pinned resident producer, full canonical-output digest verification during pure replay, and stage application v0.26.0 / skeleton 0.22.0.",
  "evidence": ["packages/skeleton/src/script-episode.ts", "packages/skeleton/src/discovery-sandbox.ts", "packages/skeleton/src/work-candidate.ts", "packages/skeleton/test/discovery.test.ts"],
  "rejected": [
    {"option": "Nested sandbox-exec", "reason": "Direct checks passed, but the native resident episode failed before discovery because the outer sandbox cannot install another sandbox."},
    {"option": "Environment-variable bypass or an unsandboxed producer", "reason": "Neither establishes an episode-wide native boundary."},
    {"option": "First-line verification only", "reason": "A read-only review probe changed evidence beyond byte 160 without invalidating verification."}
  ],
  "reopenWhen": "A different native host, hostile-process containment requirement or evidence of a bypass invalidates this trusted owner-authored command boundary."
}
```

The supervisor recognizes only the exact Node/producer/target invocation and
selects a private bootstrap under one sandbox. Arbitrary script commands retain
the existing network-denying actor profile. Public discover and its CLI always
sandbox each check; no environment marker or public skip-sandbox flag exists.
The outer profile permits target writes and read-only system/tool/runtime paths;
the literal root-directory read is required for native process startup, as a
bounded profile-comparison probe established. Outside-target reads/writes and
network attempts remain denial tests. Relative source reads reject symlinks,
special files and incomplete inventories. The actor retains WO-068's honest
limits for hostile same-user processes and deliberately detached descendants.

The pure candidate module computes canonical JSON-plus-newline SHA-256 so replay
can compare all reported bytes to the host-observed stdout digest. Native crypto
cross-checks cover Unicode and multiple padding/block boundaries. Review also
found and corrected a corpus exclusion accidentally matching a real file named
`direct-conventions`, an impossible proposed home below a regular file, and the
soft SIGTERM timeout; all have regression coverage. These were implementation
corrections inside WO-119, not new adjacent scope.

Only skeleton behavior changes; the declared minor classification stages
0.22.0 and application v0.26.0 above the observed local v0.25.0. Release prepare
uses the local snapshot; final review integrates and retimes under the same
classification if needed. New transitive runtime/evidence inputs are named in
the existing inventories. No dependency, Program.All implementation, model
ranking, work derivation or settings change is introduced.

Final source review found two additional observation defects before the gate.
Executing package script bodies directly skipped npm pre/post hooks and lifecycle
variables, so defaults now invoke the installed npm CLI itself. A declared
non-npm manager or unavailable npm requires exact explicit conventions. A moved
placement source or removed generated file now ceases producing that candidate
instead of aborting rediscovery. Regression tests exercise both corrections.
The first feedback audit completed on the earlier subject and is preserved;
revision 002 binds these final behavior changes and completed all ten live
fixtures with verification. This extra audit is an
observed process cost, not a claimed saving. The scoped final read-only review
found no further material defect; independent work-order verification remains.

Document-check correction: the ideation scope note initially used a standalone
second-level heading. The existing planning-continuation checker admits execution
appendices only under `## Execution record`; the same scope note now appears
there as a third-level heading. Its authority, duties and text are unchanged;
no planning requirement or checker was weakened. Publication coverage also
adds the new architecture candidate and refreshes the two existing source locks.
