# WO-050 decisions

## WO-050-D001

Internal composition, unchanged decision boundary (2026-09-16)

```json
{
  "id": "WO-050-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Preserve public RuntimeState and complete Decision bytes; compose version-1 typed slices internally, with one selected fold and exported host selectors.",
  "evidence": [
    "packages/skeleton/src/reactor.ts",
    "docs/work-orders/WO-050-reactor-typed-state-slices.md"
  ],
  "rejected": [
    {
      "option": "Expose nested Decision state",
      "reason": "The operator explicitly selected preservation of complete Decision bytes."
    },
    {
      "option": "NoOp or package split",
      "reason": "WO-052 supplies the recorded consumer for an internal seam; a package boundary is unnecessary."
    }
  ],
  "reopenWhen": "WO-047 lands or an explicitly authorized public state contract replaces the legacy boundary."
}
```

Dispatch: `resume: next`. The operator explicitly selected preserving public
Decision bytes with internal typed slices after the executor identified that
adding a version field to serialized Decision state contradicts literal byte
identity. `SkeletonState.version: 1` therefore describes the internal composed
shape. The existing flat `RuntimeState` remains the compatibility boundary;
pure adapters compose and flatten it, without persisting state or adding an
event. The walking, worker, verification and feedback folds own typed slices;
the source-change slot has no fold. Hosts use exported selectors. WO-047 has
not landed, so reserved `rngState` and `policy` remain at the public top level.

This supplies WO-052's next host branch with an isolated state/fold seam on the
path to independently verified source changes. NoOp retains the shared bag and
requires the next host order to do this prerequisite. A package split adds an
unneeded dependency boundary. Changing event payloads or the complete Decision
contract would defeat the structural patch's compatibility promise. Reopen
the adapter when WO-047 lands or an explicitly authorized public state contract
change removes the need for the legacy shape.

Policy resistance and fixes that fail are addressed by preserving existing
authorization, cadence and one-decider ownership. Drift to low performance and
rule beating are checked against frozen complete Decisions, including state,
and actual exclusive dispatch by active mode and event type (event names are
already shared between modes). Seeking the wrong goal and shifting the burden
to the intervenor favor a seam the next host can extend without operator
rescue. Commons cost and escalation favor one writer, one read-only audit,
bounded fixtures and the existing gate rather than new machinery. Success to
the successful does not justify preserving the shared bag: the selected next
consumer supplies the recorded reversal condition. Naive Interventionism
requires retaining the functioning replay, lease fencing, refusal and recovery
paths, probing exact fixed input bytes before changing the fold. The change is
reversible source work; no branch commit or publication is authorized here.

## WO-050-D002

Identity evidence boundaries (2026-09-16)

```json
{
  "id": "WO-050-D002",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Capture synthetic worker fixtures once before refactoring; compare complete Decisions and projections on fixed input bytes, retaining historical refusal identities separately.",
  "evidence": [
    "packages/skeleton/fixtures/wo050-identity.json",
    "scripts/reactor-identity.mjs"
  ],
  "rejected": [
    {
      "option": "Compare only trace fields or normalize Decision state",
      "reason": "Would hide state differences and fail the operator-selected full identity boundary."
    },
    {
      "option": "Claim original WO-009 raw logs or successful old WO-010/011 replay",
      "reason": "Those worker logs were not retained and the old compiled-artifact logs already refuse today."
    }
  ],
  "reopenWhen": "A retained fixture changes or obsolete compiled artifact replay receives its own compatibility scope."
}
```

The read-only executor audit found no raw canonical worker logs in WO-009's
committed evidence, only summaries and test transcripts. Capture fresh
synthetic normal worker logs for both existing subprocess transports and
recovery rows 2/4/6 on the pre-refactor implementation, once, then replay those
fixed bytes on both implementations. These are fixture transports, not new
live-model observations. Include the frozen legacy scenario, current scenario
and crash recovery, feedback correction and successful current WO-048
verification/feedback editions.

Original WO-010 and WO-011 verification logs already refuse with persisted
compilation drift, and the original WO-011 audit refuses with policy drift.
Preserve their exact pre-refactor successful Decision prefixes, error location
and message; do not claim those historical inputs complete today. This is an
observed version-boundary limitation, not a regression introduced here.
Successful current editions provide the positive counterpart. Reopen replay
of obsolete compiled artifacts in a separately scoped compatibility decision.

## WO-050-D003

Local patch and source evidence (2026-09-16)

```json
{
  "id": "WO-050-D003",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Stage application v0.21.2 and skeleton 0.18.2 under the patch classification, refresh runtime pins and fresh verification/feedback evidence, and retain kernel/compiler versions.",
  "evidence": ["packages/skeleton/package.json", "package-lock.json", "docs/evidence/current.json"],
  "rejected": [{"option": "No component bump or overwrite old evidence", "reason": "Runtime source changed; its patch and current evidence must be explicit while historical bytes remain immutable."}],
  "reopenWhen": "Integration consumes the target version or independent verification finds changed behavior."
}
```

New subject inputs required by actual host reads are `worker-demo.ts`,
`beacon-observe.ts`, and `feedback-selfhost.ts`; selectors replace those reads
without adding behavior. The existing ownership and host-size guard is retained.
The audit caught a malformed-null verification error and custom predicate worker
context loss in the initial extraction; both were corrected before validation
and are now explicit regressions. Initial build failures were corrected before
the successful focused run; old build output was not accepted as current-source
evidence. Final cmp evidence supersedes the preliminary old-build comparison.

This order predates 2026-09-09; this decisions file and the generated decisions
index discharge its ledger write-back under the executor skill. Entry usage
is unknown (source unavailable, scope dispatch, cutoff
2026-09-16T00:16:55.891Z). No cost reduction is claimed; the adapter adds code to
preserve the public boundary while restricting each fold's state access.


### Source-change ownership correction

The final read-only audit identified that an open-ended walking `Omit` plus
rest projection would absorb a future source-change compatibility field.
The executor stopped its first gate through the canonical stop command after
94.3 seconds, with no check recorded, before changing any gate input. Reserve
optional `RuntimeState.sourceChange` now, omit it from walking ownership, and
project it only into the source-change slice. `initialState` still omits the
field, so current serialized Decisions remain byte-identical. WO-052 can
extend `SourceChangeSlice` and add its fold without changing walking ownership.
An executable assertion checks both absence from current serialized state and
exclusion from walking when the reserved slot is supplied. The first feedback
and authority editions remain historical; revision 001 binds the final source.


### Handoff outcome

The final source passes all 19 fixed full-Decision/projection identity cases,
24 focused tests, and the full gate's 19 suites / 62 fresh tasks (338.84 seconds,
zero failures). Final feedback revision 001 reached complete with an independent
read-only source verifier. The promised seam exists without changing current
Decision bytes; the source-change reservation is excluded from walking ownership.
The cost tradeoff is additional adapters and evidence rather than a claimed
runtime or workflow saving. No dependency, event schema or hash-preimage change
was introduced. Final counters remain in ignored receipts and the response.
