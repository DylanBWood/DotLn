# WO-043 decisions

## WO-043-D001

```json
{
  "id": "WO-043-D001",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 typed dependency design and acceptance criteria 1–4",
  "decision": "Keep dependency authority in the work-order header and share one parser and projection between index, selected CLI status and activation. Closure evidence retains the final-review verdict. Typed release readiness observes current local annotated DotLn tags in HEAD ancestry, independently of the index's historical release-attribution snapshot.",
  "evidence": [
    "scripts/lib/dependencies.mjs",
    "scripts/test-work-orders.mjs: typed parser, projection, ancestry and index/status parity fixtures",
    "scripts/test-dependency-resume.mjs: refusal preserves event and projection bytes"
  ],
  "rejected": [
    "A separate registry would duplicate the authority file.",
    "Control-log waiver events would change the phase-only schema outside this order.",
    "Token-based activation refusal would recreate the historical-reference defect.",
    "Using the attribution tag snapshot for dependency readiness could disagree with current status when a required release becomes available.",
    "A scheduler or recommendation engine is outside the selected dependency question."
  ],
  "reopenWhen": "A concrete consumer needs a dependency source beyond work-order authorities, or measured status cost warrants a cache that preserves the same current ancestry evidence."
}
```

The pure lifecycle `statusProjection` keeps an optional dependency argument;
the CLI supplies the selected authority's projection. Historical revision
consumers can keep projecting lifecycle state without silently reading current
work-order files. No selection yields `dependencies: null`.

## WO-043-D002

```json
{
  "id": "WO-043-D002",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 forward-only migration; later dated umbrella decision in WO-036",
  "decision": "Migrate all 85 currently open records, including WO-118 through WO-125 from the revised horizon. Preserve all 40 closed or historical authorities byte-for-byte. Transcribe the graph's entries, supplement its four corpus nodes from their Depends on prose, and represent umbrella successors as non-blocking superseded entries. WO-036 follows its later 2026-09-09 supersession by WO-126.",
  "evidence": [
    "docs/evidence/WO-043/migration.json: 85 prose comparisons and 245 typed entries",
    "docs/planning/critical-path-2026-09-08.json: observed 109 nodes and 207 edges",
    "docs/work-orders/WO-036-evidence-runner.md: 2026-09-09 umbrella notice",
    "docs/work-orders/WO-102-cadence-corpus.md",
    "docs/work-orders/WO-103-authority-outbox-corpus.md",
    "docs/work-orders/WO-105-crash-shape-corpus.md",
    "docs/work-orders/WO-107-profiling-baseline.md"
  ],
  "rejected": [
    "Backfilling closed WO-042 would violate the order's forward-only fence; both its unchanged token projection and the seed graph's satisfied entries have no blocker.",
    "Stopping at WO-117 would omit the same planning pass's revised open horizon.",
    "Keeping WO-036's old release dependencies as its current meaning would ignore the later operator-authored umbrella decision.",
    "Rewriting the dated graph to conceal its omissions would erase migration evidence."
  ],
  "reopenWhen": "A later reviewed planning decision changes a relation, a deferral is waived with a date, or a successor no longer carries the named umbrella obligation."
}
```

For an umbrella entry, `workOrderId` identifies a successor and `by` names that
same successor. This lists every child without a prohibited self-reference to
the umbrella. Supersession conveys lineage; it neither blocks dependencies nor
grants activation authority to an umbrella whose notice says it is not activatable.

## WO-043-D003

```json
{
  "id": "WO-043-D003",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; standing release assignment default and WO-043 patch classification",
  "decision": "Assign application v0.17.1 above the observed local annotated v0.17.0 baseline. Keep all component versions because the deliverable changes only control-plane scripts and documents. Prepare the release locally.",
  "evidence": [
    "docs/product/06-roadmap.md: Release boundary",
    "docs/work-orders/WO-043-typed-dependency-truth.md: release classification",
    "npm run release -- prepare --local: target v0.17.1 remains current"
  ],
  "rejected": [
    "A component bump would claim a package change that this order does not contain.",
    "Publication is not authorized by the executor dispatch."
  ],
  "reopenWhen": "A sibling release consumes v0.17.1 before integration, or an authorized scope change alters a component's compatibility impact."
}
```

The inherited ledger duty is discharged here and in the generated decisions
index under the executor skill's forward-only substitution. The product
write-backs retain the three distinct answers: legal action, dependency
eligibility and recommendation.

## WO-043-D004

```json
{
  "id": "WO-043-D004",
  "date": "2026-09-11",
  "dispatch": "Operator resume: next; WO-043 required header migration and full application gate",
  "decision": "Extend planning continuation only for WO-043's reviewed dependency transcription. Compare relation fields with the seed at the original judgment revision, require that seed to remain byte-identical, preserve the four corpus prose mappings and reviewed umbrella successors, and remove only the inserted metadata block before the existing byte-preservation checks. Preserve the original planning receipts and their subject hashes.",
  "evidence": [
    "The first canonical full gate passed 35 suites and failed the console live release-list observation and plan-refutation:current.",
    "scripts/lib/plan-continuation.mjs and scripts/lib/plan-dependency-migration.mjs",
    "scripts/test-plan-refutation.mjs: reviewed migration before and after commit, unchanged receipt, refusal of omitted edges, changed relations, unreviewed waiver, objective edit, seed drift and absent migration authority",
    "The current planning gate accepted 74 typed migrations inside its judged horizon; the migration receipt independently covers all 85 open authorities."
  ],
  "rejected": [
    "Rewriting immutable planning receipts would replace the independent judgment with executor-authored evidence.",
    "Ignoring arbitrary dependency blocks would silently admit new planning decisions.",
    "Dropping the planning gate would leave the required full application check incomplete.",
    "Changing package behavior to mask a transient source-unavailable observation would exceed this order's no-packages fence without a demonstrated package defect."
  ],
  "reopenWhen": "A later planning pass changes dependency meanings, the original seed is intentionally revised, or another migration needs its own reviewed authority and bounded continuation rule."
}
```

Same-day correction: I initially treated the new dependency headers as ordinary
execution metadata, but the existing continuation comparator recognizes only
specific execution updates. The full gate exposed that mismatch. The bounded
transcription rule above supplies the missing classification without changing
the judged plan. I also changed the assigned release heading to `(v0.17.1)`,
the established release-assignment form.

The initial console failure reported `release:list` unavailable; a standalone
`npm run release --silent -- list` then exited successfully with the local
release records. A timeout under concurrent load is a possible cause, not an
established diagnosis. The canonical retry must pass that same console check.
