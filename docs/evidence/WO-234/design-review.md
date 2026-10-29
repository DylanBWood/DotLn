# WO-234 independent design review

Findings: 3; fixed: 3; recorded/deferred: 0; remaining: 0.

1. Localize standing-observation failures so the existing permission judgments
   still run; preserve a known refusal when recording it fails.
2. Read acceptance events through the canonical control store and fold.
3. Keep Stop standing collection best effort, preserving accumulated advice
   and cleanup when that observation fails.

The reviewer confirmed all three corrected. The separate phase anchor retains
session read/authorship history and the legacy journal fallback. The cross-order
`afterStop` observation was transferred to the criteria reviewer and is counted
there rather than twice. The final recheck also confirmed parent-side gate
admission, original session birth for provenance, the preserved Stop prefix,
and removal of the unrequested startup count. No further design finding
remained in the final read.

Launch selection: Codex `spawn_agent`, `gpt-6.1-sol`, effort `max`, fresh context.
Effective worker model/effort readback was not reported. The worker reviewed
source and tests read-only, ran no probes or suites, and wrote no files. The
executor files this returned review; executable validation belongs to the
complete review and document gates.
