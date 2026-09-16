# WO-047 decisions

## WO-047-D001

Explicit replay environment projection (2026-09-15)

```json
{
  "id": "WO-047-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Add an optional per-step environment projector; keep the reserved-key fallback unchanged and let the skeleton own its state projection.",
  "evidence": [
    "packages/kernel/src/core.ts",
    "packages/kernel/test/ac2-replay-store.test.ts",
    "packages/skeleton/src/reactor.ts",
    "packages/skeleton/src/scenario.ts",
    "docs/product/02-domain-model.md"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Keeps future typed state slices coupled to the kernel's literal state keys." },
    { "option": "Persist the environment on every event", "reason": "Changes the event schema and duplicates state already derived from the log." },
    { "option": "Remove the fallback", "reason": "Breaks existing callers without a consumer need." },
    { "option": "Global projector setter", "reason": "Adds hidden mutable state to the deterministic kernel." }
  ],
  "reopenWhen": "A supported replay changes decisions or bytes, or a consumer needs a new environment field or a different state layout."
}
```

The mission contribution is dependable replay and recovery for the always-on
runtime. WO-050 can move RNG and policy into typed slices once their layout is
owned by the application. The smallest probe compares full decisions and bytes
for the existing scenario and a kernel fixture with nested RNG and policy.

The callback receives the current pre-step state and event, never ambient time.
Replay retains ownership of event time and the predicate registry. Preserve the
legacy environment field order. Reject a non-finite RNG from a supplied projector
before invoking the reactor; leave the omitted-projector fallback's existing
numeric behavior untouched, including raw JavaScript numbers outside JSON.
An explicitly supplied default projector follows the explicit validation rule.
Purity remains an author obligation, as it already is for reactors.

AC3's reserved keys mean application-state lookups, not every `rngState` or
`policy` token: those names are also legitimate KernelEnv fields and authorization
trace inputs. The source test isolates all reserved application-state reads in
the exported fallback without changing cadence or authorization. This records
the interpretation before implementation; the order's other obligations remain.

Policy resistance/fixes that fail: preserve the old fallback and use one explicit
skeleton projector across recovery paths. Commons and escalation: no dependency,
new operator step or extra state schema; use read-only review and focused tests
before the required full gate. Drift and rule beating: compare complete decisions,
serialized bytes and actual non-default RNG evolution, not only final state.
Success to the successful: compare the explicit callback with envelope data,
global configuration and NoOp; choose the smallest compatible seam. Shifting the
burden: application code owns its state layout instead of requiring kernel edits.
Wrong goal: the outcome is replay independence, not a claim that typed slices or
the always-on loop are already delivered. Naive Interventionism: retain existing
fallback consumers, hashes, event framing, clock and predicate ownership; keep
the change additive and reversible.

Entry process cost: total tokens unknown, source unavailable, scope dispatch,
cutoff 2026-09-16T00:17:01.962Z. No cost saving is claimed. Final counters belong
in ignored receipts and the handoff. This pre-2026-09-09 order's ledger duty is
discharged by this record and its generated decisions-index row.

## WO-047-D002

Release and runtime evidence (2026-09-15)

```json
{
  "id": "WO-047-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Stage application v0.22.0, kernel 0.5.0 and skeleton 0.18.2; refresh generated runtime pins and the authority and feedback editions.",
  "evidence": ["package-lock.json", "docs/evidence/current.json", "scripts/lib/evidence-sources.mjs", "packages/skeleton/src/feedback-audit.ts"],
  "rejected": [
    { "option": "Kernel patch only", "reason": "An additive public replay API merits a minor version within the order's patch-to-minor classification." },
    { "option": "Bump compiler or console", "reason": "Neither implementation changes." },
    { "option": "Reuse the live feedback audit", "reason": "The audited reactor and recovery source changes, requiring a new real verifier run." },
    { "option": "Replace all historical evidence", "reason": "Immutable editions preserve provenance; retain artifact and verification outputs if their checks prove unchanged bytes." }
  ],
  "reopenWhen": "Integration consumes a staged version or evidence shows changed decisions, hashes, artifact identity or feedback behavior."
}
```

The local tag snapshot ends at v0.21.1. The skeleton patch changes ownership of
environment projection while preserving behavior. Updating its existing exact
kernel dependency adds no dependency. Eight runtime replay calls and two evidence
consumers use the explicit projector. Runtime pins and feedback audit source
identity change; application event and semantic-hash inputs do not.

## Pre-gate outcome

The focused kernel/scenario/beacon run passed 134 tests. Six stored streams
compare full decision bytes, including the 54-event feedback-verifier log;
scenario variants and the WO-003 trace oracle agree. Artifact and verification
editions pass unchanged. The live feedback verifier completed and its current
source audit passes. Read-only review prompted single-sample projected values
and an end-to-end omitted-projector non-finite regression, both within the
existing acceptance obligation. No adjacent item remains. The required full
suite is still pending at this cutoff; no total-cost saving is inferred.


## Final outcome

The required full gate passed 19 suites / 62 fresh tasks with zero failures in
256.13 seconds. The compatibility review found only component/runtime pin changes
in the lockfile and generated hooks; policy and capability configuration and
hash preimages remain unchanged. The additive seam removes the reserved-layout
requirement for explicit callers while retaining the existing fallback. No
scope expansion or adjacent item remains. Total usage remains unmeasured rather
than inferred from passing tests or the feedback projection's byte savings.

## WO-047-D003

Repair publication freshness after VER-001 F1 (2026-09-15)

```json
{
  "id": "WO-047-D003",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Use the roadmap's existing bold delivery-note form and recompute both audience-edition source locks after reviewing their linked claims.",
  "evidence": [
    "docs/verifications/WO-047/VER-001.md",
    "docs/product/06-roadmap.md",
    "docs/product/08-publication-compiler.md",
    "docs/publication/everyday-ai-user-toc.md",
    "docs/publication/software-engineer-toc.md",
    "scripts/check-publication.mjs"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Leaves an order-introduced publication regression and stale derivative locks for downstream repair." },
    { "option": "Index a new roadmap subsection", "reason": "A staged delivery addendum needs no new navigation heading; adjacent notes already use bold paragraphs." },
    { "option": "Change edition prose or source-base revisions", "reason": "The linked summaries remain accurate; the base revision records source-set provenance rather than current-byte freshness." }
  ],
  "reopenWhen": "Publication checks still fail, an audience summary contradicts the implemented projector contract, or the delivery note needs a separately navigable section."
}
```

The repair protects dependable documentation for the replay seam that enables
WO-050. Entry reproduction confirmed one missing roadmap heading and two stale
edition locks. The same-day correction is that the implementation write-back
was incomplete at its publication derivatives, despite the earlier completion
claim. Both TOCs link the updated Events and decisions section without asserting
the old reserved-key-only contract; their wording remains accurate. Refreshing
the hashes records current source bytes, not independent factual agreement.

Drift to low performance and rule beating: restore the existing publication
check and inspect the claims before refreshing hashes. Shifting the burden:
repair the derivatives here instead of requiring reviewer rescue. Policy
resistance: preserve the index's heading contract and edition provenance.
Commons and escalation: one read-only advisory task and existing checks suffice;
add no new process. Success to the successful: compare the existing paragraph
form with an indexed subsection and NoOp. Seeking the wrong goal: correct the
delivered reading surfaces, not just the test result. Naive Interventionism:
the edits are reversible and preserve replay behavior, source links, and the
publication checker. No new application behavior or dependency is needed.

The operator directed a hold before returning to verification. Complete the
repair evidence and checks, then leave the lifecycle in `repairing`; do not run
`repair-complete` until further instructions. Entry token total is unknown,
source unavailable, scope dispatch, cutoff 2026-09-16T01:05:49.600Z.

## WO-047-D004

Bounded capability-table correction and planning follow-up (2026-09-15)

```json
{
  "id": "WO-047-D004",
  "date": "2026-09-15",
  "dispatch": "resume: fix",
  "decision": "Normalize the inherited capability-table header to its existing console schema; defer inherited planning-cost and continuation reconciliation to the next planning continuation.",
  "evidence": [
    "docs/planning/capability-table.md",
    "packages/console/src/text-sources.ts",
    "packages/console/test/board.test.ts",
    "scripts/lib/plan-subject.mjs",
    "scripts/lib/plan-continuation.mjs",
    "docs/evidence/WO-047/repair-001.md"
  ],
  "rejected": [
    { "option": "NoOp on the table header", "reason": "A one-cell schema mismatch hides all capability rows; normalizing the heading restores the existing contract without changing claims." },
    { "option": "Widen the console parser", "reason": "The document can use the supported schema; another accepted spelling adds code without a consumer need." },
    { "option": "Refresh planning cost hashes during repair", "reason": "The retained legacy judgment binds cost-table bytes. Reconciliation of historical scope changes needs planning provenance, not a hash-only update." }
  ],
  "reopenWhen": "The corrected table still fails console collection, or the planning continuation reconciles the authorized WO-045 and WO-046 changes with its retained judgment."
}
```

The document gate exposed both issues. Root probes reproduced them at HEAD,
and the planning failure also occurs at the repair-entry checkpoint. The table
uses `Remaining gate` where `parseCapabilities` requires `Blocking-gate
reassessment`; normalizing only that heading in memory restores all 30 rows.
The plan source changed after its cost measurement through WO-045 acceptance
and WO-046 capability write-backs. Existing judgment provenance must be retained.

Goal and NoOp: restore the operator's capability view with one document edit;
preserve planning evidence until its owner reconciles the continuation. Policy
resistance and rule beating: use the existing parser schema and do not pass a
planning check by merely refreshing a hash. Drift and shifting the burden:
repair the concrete view regression now. Commons and escalation: run its
existing focused check, not another unchanged application gate. Success to the
successful: compare a document correction, parser expansion and NoOp. Seeking
the wrong goal: restore readable capabilities rather than expand the runtime.
Naive Interventionism: retain every capability claim, level and remaining gate;
the header change is reversible and adds no dependency or component bump.

Adjacent item 1 was announced, the application gate reached a safe boundary,
the operator's merge-wait instruction was processed, and the current queue was
reread before starting. Item 2 is deferred to the next planning continuation
for the authorized WO-045/WO-046 write-backs; validate it with `npm run plan --
check` and `npm run test:docs`. No parallel-merge check or version update is
authorized until the operator reports that merge complete.

Subsequent operator direction released the verification hold and assigned the
administrative tasks to final review. Record the repair handoff without checking
the parallel merge or changing versions; preserve the planning follow-up and
the existing check results. See the repair receipt's operator hold and release.
