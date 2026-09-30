The roadmap now holds the release ladder, its exit criteria and the generated release history. Its 863 lines of candidate and capability-policy text, twelve headings from Work-order navigation and identity through Candidate — local-model usefulness experiments, moved to a new [Moved from the roadmap](../../planning/work-order-map.md#moved-from-the-roadmap-2026-09-30) section of the planning map. Every heading keeps its slug, and the text is unchanged except two relative links rebased to the same targets. A reader of product 06 now finds the ladder without paging through proposals, and every candidate is where the register and planning passes already look for them.

Inbound links in the vision, the pattern library, the roles document, the capability table, the map itself, one closed order and the everyday edition now point at the map. The publication index drops the twelve moved rows, and both edition locks are refreshed. In the follow-up register, each of the seven moved candidate rows is a duplicate of its new map row, and that row carries the old status and reopening condition (five deferred, two settled). All 771 existing rows keep their full history. Product 06's byte ceiling falls from 98,323 to 40,775.

The move changed one link in the vision's What DotLn is not section and one in the capability table's introduction. Planning receipt 034 binds both, so the planning continuation check failed. The operator directed that the check be repaired within this order. `scripts/lib/plan-continuation.mjs` now admits a changed citation only after proving a pure relocation. Restoring the old destinations must reproduce the judged text exactly. The cited section must have moved from a product document to the public planning directory under the same slug, with its full content equal once relative links are resolved. The old heading must be gone, and the new one must not have existed when the receipt was judged. The check reports each admitted move as `relocated-planning-link`. It refuses changed target text, changed citing prose or link text, missing, ambiguous or pre-existing anchors, a copy left behind, destinations outside the planning directory or behind a symlink, and link forms whose meaning depends on context. No planning receipt changed.

`npm test -- --review` (31 suites) and `npm run test:docs` (23) pass at the same code identity. [VER-001](../../verifications/WO-087/VER-001.md) passed all four criteria, using its own preservation and register probes and nine mutations the check refused. [FINAL-001](FINAL-001.md) records this review. Limits are in the [decisions](../../evidence/WO-087/decisions.md). The capability table's link text still reads "roadmap", because the receipt binds that wording. Planning worker context still omits the vision footer and the capability introduction that the check binds; that gap is follow-up FUP-dc58e92c5cafc732 (D011). The generated release history lacks rows for v0.56.1 and v0.56.2, which the docs check reports as advisory and release tooling regenerates. The application target is v0.56.3. No component, dependency or event schema changes.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-30T01:01:14.521Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-116 | 5,621,918 (Δ unavailable) / 3 | 961,856 (Δ unavailable) | 0 (Δ unavailable) / 0 (Δ unavailable) | 120,263,202 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 3 (Δ unavailable) |
| WO-065 | 6,579,002 (Δ 957,084) / 5 | 1,624,996 (Δ 663,140) | 4 (Δ 4) / 68,105 (Δ 68,105) | 50,042,507 (Δ -70,220,695) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 0 (Δ -3) |
| WO-117 | 7,286,980 (Δ 707,978) / 3 | 1,762,820 (Δ 137,824) | 4 (Δ 0) / 60,947 (Δ -7,158) | 42,707,375 (Δ -7,335,132) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 0) | 1 (Δ 1) |
| WO-086 | 15,692,236 (Δ 8,405,256) / 7 | 1,554,281 (Δ -208,539) | 4 (Δ 0) / 80,694 (Δ 19,747) | 127,809,215 (Δ 85,101,840) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -2) | 4 (Δ 3) |
| WO-172 | 55,766,398 (Δ 40,074,162) / 11 | 4,036,347 (Δ 2,482,066) | 3 (Δ -1) / 28,017 (Δ -52,677) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 5) | 15 (Δ 11) |
| WO-087 | unavailable (Δ unavailable) / 0 | 376,615 (Δ -3,659,732) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 13,325,126 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -6) | 1 (Δ -14) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-087/executor | 3,562,667 (-42,193,242) | unavailable (unavailable) | unavailable (unavailable) | 13,325,126 (unavailable) | 119 (-2,413) | unavailable (unavailable) / 1,019 |
| WO-087/verifier | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-087/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-087/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-087/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-087/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
