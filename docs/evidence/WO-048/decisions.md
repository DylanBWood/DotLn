# WO-048 decisions

## WO-048-D001

Decode persisted state before recovery effects (2026-09-15)

```json
{
  "id": "WO-048-D001",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Inspect store artifacts under the acquisition guard before reclaiming a lock; validate receipts against reconstructed requests before host events, and preserve unpublished staging files for inspection.",
  "evidence": [
    "packages/skeleton/src/worker-store.ts",
    "packages/skeleton/src/worker-host.ts",
    "packages/skeleton/src/verification-host.ts",
    "docs/work-orders/WO-048-worker-host-on-disk-decode.md"
  ],
  "rejected": [
    { "option": "NoOp", "reason": "Recovery currently changes locks and appends events before discovering malformed saved receipts." },
    { "option": "General schema layer or SQLite", "reason": "Existing result parsers and capsule compiler supply the bounded shape checks; changing persistence adds unrelated compatibility and migration work." },
    { "option": "Delete malformed or pending files", "reason": "Would destroy operator inspection evidence and violate byte-preserving refusal." },
    { "option": "Persist a new request format", "reason": "The order forbids contract changes; caller context and existing log capsules suffice for receipts recovery actually consumes." }
  ],
  "reopenWhen": "A valid historical store regresses, a new read bypasses the inventory, or a production consumer needs request reconstruction beyond these bounded profiles."
}
```

The mission contribution is dependable recovery for the always-on runtime and independently verified source-to-deliverable loop. Observed hazards are unchecked lock/receipt casts, producing-episode substitution before validation, host events before cached-result validation, and deletion of leftover staging bytes. Preserve fsynced appends, exclusive writer serialization, immutable completed receipts, existing transport result contracts and capsule hashes.

New subject inputs needed to reach the actual recovery boundary are `worker-demo.ts`, `verification-demo.ts`, and the verification caller in `feedback-selfhost.ts`. Capsules are persisted inside `CommandPersisted` events, not separate files. Verification capsules contain their original request subject; historical inspection logs do not contain the complete fixture. The store scans wrapper/episode/key shapes and stored capsules; concrete recovery callers reconstruct their complete request and re-run `parseTransportResult` and stable-key equality before lock reclaim. This adds no serialized shape. An independent read-only executor assistant confirmed the ordering hazards and reconstruction limit; the parent remains the only writer.

System traps: policy resistance/fixes that fail is addressed by retaining existing parsers and lock serialization; drift to low performance by explicit no-effects assertions; rule beating by recovery entry-point tests with dead locks and expired leases. Commons and escalation costs are bounded by one store scan and focused corpus cases, with no added dependency or approval ritual. Success to the successful is addressed by comparing schema/persistence alternatives on actual scope and compatibility cost. Shifting the burden improves through path-specific refusal without recurring partial-recovery cleanup. Seeking the wrong goal is checked against safe recovery, not receipt volume. Naive Interventionism: preserve successful crash recovery and completed history; the smallest probe is malformed recovery alongside unchanged WO-009/WO-010 fixtures. Stricter staging refusal requires operator inspection, deliberately preserving evidence instead of silently deleting it. Code is reversible; no stored history is rewritten.

The order predates 2026-09-09, so this decisions file and generated index discharge its ledger write-back under the executor skill. Entry process counters are unknown (source unavailable, scope dispatch, cutoff 2026-09-15T22:32:03.290Z). Final counters remain in ignored receipts and the response; no total-cost saving is claimed.

### Boundary review and corrections

The full replay now runs under preflight, including the tail after the last
persisted command; lease payloads receive positive field checks. Dangling
symlinks are observed with `lstat`, because `existsSync` would misclassify them
as absent and allow a lock change before a failing create. All saved receipts,
including verification results, must be successfully loaded with original
request context during acquisition; an empty callback cannot bypass this.
Existing callbacks cover every production consumer. The original model-selection
mismatch diagnostic is preserved before request reconstruction.

The initial inventory test classified `store.read()` as a raw filesystem read;
it now distinguishes the explicitly inventoried wrapper from byte-reading APIs.
The first fresh-feedback regression report preceded the final all-receipt
context check, so it is retained as an unselected preliminary edition. The
final source uses feedback revision `001`. The evidence manifest requires an
explicit `revision: null` for an unnumbered edition; the initial verification
generation refused the omitted value without writing an edition, and that
manifest entry was corrected the same day.

## WO-048-D002

Local patch release and evidence (2026-09-15)

```json
{
  "id": "WO-048-D002",
  "date": "2026-09-15",
  "dispatch": "resume: next",
  "decision": "Stage application v0.20.1 and skeleton 0.17.1, retain the kernel/compiler contracts and immutable prior evidence, and refresh the runtime bundle and verification/feedback editions.",
  "evidence": ["package-lock.json", "docs/product/06-roadmap.md", "docs/evidence/current.json"],
  "rejected": [
    { "option": "No component bump", "reason": "The skeleton runtime changed and must carry its classified patch impact." },
    { "option": "New schema, dependency or hash rule", "reason": "This hardening composes existing transport/capsule validators without changing their contracts." },
    { "option": "Overwrite previous evidence", "reason": "Historical observations retain their recorded source and immutable bytes." }
  ],
  "reopenWhen": "Integration consumes the staged version, independent verification finds a compatibility regression, or current evidence checks fail."
}
```

Local tag observation is v0.20.0; `release prepare --local` accepts v0.20.1
under the order's existing patch classification. Only the skeleton component
and its runtime version pins advance. The artifact-identity check preserves
the original semantic hashes and frozen oracle; authority evidence remains
valid under the existing release-label projection. Historical live records
are checked as their original episodes, not relabeled as new live runs.

### Handoff outcome

The observed result matches the promised recovery benefit: final-source corpus
and inventory checks passed 75 tests; every malformed recovery left store bytes
unchanged. The full product gate passed 19 suites / 62 fresh tasks in 262.93
seconds, including the unchanged worker and verification fixtures. The fresh
live feedback audit reached complete with both criteria independently verified.
No dependency, persisted contract or semantic-hash rule changed. The stricter
request-context requirement is documented for custom store callers, and pending
files retain their explicit inspection requirement. No total-cost reduction is
claimed; final dispatch counters remain in ignored receipts and the response.

The first full-gate attempt overlapped a metadata refresh and was explicitly
stopped, with no check recorded; the final passing gate started only after
generation completed. Its retained stopped transcript and implementation report
record the same-day process correction. No code changed after the final pass.

## WO-048-D003

Retime the staged release during final-review integration (2026-09-15)

```json
{
  "id": "WO-048-D003",
  "date": "2026-09-15",
  "dispatch": "resume: final review",
  "decision": "Retime the staged release from application v0.20.1 / skeleton 0.17.1 to v0.21.1 / skeleton 0.18.1 after WO-046 published v0.21.0 / skeleton 0.18.0, preserving the order's recorded patch classification and declared compatibility impact.",
  "evidence": [
    "README.md",
    "docs/product/06-roadmap.md",
    "package-lock.json",
    "packages/skeleton/package.json",
    "packages/skeleton/src/harness-host.ts",
    "packages/skeleton/src/loadouts/contributor.ts",
    "docs/work-orders/WO-048-worker-host-on-disk-decode.md"
  ],
  "rejected": [
    { "option": "Keep v0.20.1 / 0.17.1", "reason": "Upstream consumed the staged numbers; the branch would claim a version below its own base." },
    { "option": "Reclassify above patch", "reason": "The integrated source adds no contract, schema, dependency or hash change, so the recorded patch classification still holds." },
    { "option": "Return the order to repair", "reason": "Retiming an unpublished release under its existing classification is final-review integration work, not a behavioral defect." }
  ],
  "reopenWhen": "Another sibling publishes v0.21.1 before this branch merges, or a check on the integrated tree shows a compatibility impact beyond patch."
}
```

Correction recorded under D002's stated reopening condition ("Integration
consumes the staged version"). What was misread: nothing in the original
judgment; D002 was correct at its recorded subject, where the observed local
tag was `v0.20.0`. What was meant: the smallest patch above the then-current
release for the skeleton runtime alone. What changed: WO-046 merged to `main`
as `v0.21.0` with skeleton `0.18.0` while this branch was in final review, so
the same patch intent now lands at `v0.21.1` / `0.18.1`.

The retiming also moves `HARNESS_HOST_VERSION` and both contributor-profile
`skeletonVersion` literals to `0.18.1`. Observation for the operator, not a
finding against this order: `main` carries those three constants at `0.17.0`
while its `packages/skeleton/package.json` reads `0.18.0`, so WO-046 bumped the
package without its runtime literals. This order's own declared bump is what
brings them back into agreement; WO-046's gap is its own record.
