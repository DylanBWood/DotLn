The roadmap's release history is now a table generated from the local annotated tags, and a version collision between two parallel orders is recorded once, as a decision in the integrating order's evidence. The roadmap, the README and the execution guide no longer gain a pair of activation and retiming paragraphs for every order, which the operator reported was discouraging parallel work orders.

`npm run release -- list --markdown` renders one row per annotated release tag: version, UTC date, the orders its manifest names, the version step and the component versions. It also records the snapshot of the tags it rendered. `--markdown --write` rewrites the one registered block in product 06. The docs check exempts only that block and holds it to its recorded tags: a changed row or a hand-written note fails at its line, a missing recorded tag is named, and a newer sibling tag is reported without failing. The Release boundary heading exempts nothing any more, so an unregistered marker pair or a demoted terminating heading can no longer hide prose from the byte count.

`release prepare` no longer touches product 06. A collision or an activation assignment changes the heading and the README version claim and is recorded as one structured decision with the superseded target, the new target and the release baseline; under `worktree integrate` the integration decision carries it. A conflicted decisions record refuses with its path and writes nothing. Two recovery paths lost that record and failed verification (VER-001 F1, VER-002 F2). The meter and PR outputs now precede the target edit, and a saved preparation outcome is filed before preparation runs again. A continued integration therefore records the collision exactly once.

The 66,778 bytes of retired notes, in seven ranges including main's v0.56.0 note, moved byte for byte to [the release-history notes](../../planning/release-history-notes.md), each range checked by SHA-256. Product 06's ceiling rises to 98,323 bytes because the standing release policy the heading exemption hid is now counted; the operator authorized this (D004). Components, dependencies and event schemas are unchanged; the application target is v0.56.1.

[FINAL-001](FINAL-001.md) records the final review and gates; [VER-003](../../verifications/WO-086/VER-003.md) passed all five criteria after [VER-001](../../verifications/WO-086/VER-001.md) and [VER-002](../../verifications/WO-086/VER-002.md) failed on the two recovery paths. Known limits are in the [decisions](../../evidence/WO-086/decisions.md). The receipt recognizer still misses dated labels without the bold-colon form (D013). A lane that still carries old-style roadmap notes, WO-172 today, moves them into its own decisions record at integration (D012). Recovery covers filesystem failures, not process interruption (D019, D022). A hand-run of the internal `--integration` flag during a pending integration can still leave a retime unrecorded; the helper never does this, and the final review boarded it with six smaller hardening items (D024).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-29T19:12:11.997Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-167 | 11,439,453 (Δ unavailable) / 5 | 3,044,426 (Δ unavailable) | 14 (Δ unavailable) / 232,580 (Δ unavailable) | 168,489,088 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ unavailable) | 0 (Δ unavailable) |
| WO-173 | 10,679,133 (Δ -760,320) / 5 | 2,587,931 (Δ -456,495) | 9 (Δ -5) / 118,695 (Δ -113,885) | 88,392,150 (Δ -80,096,938) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 1 (Δ 1) |
| WO-116 | 5,621,918 (Δ -5,057,215) / 3 | 961,856 (Δ -1,626,075) | 0 (Δ -9) / 0 (Δ -118,695) | 120,263,202 (Δ 31,871,052) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 0 (Δ -1) |
| WO-065 | 6,579,002 (Δ 957,084) / 5 | 1,624,996 (Δ 663,140) | 4 (Δ 4) / 68,105 (Δ 68,105) | 50,042,507 (Δ -70,220,695) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 0 (Δ 0) |
| WO-117 | 7,286,980 (Δ 707,978) / 3 | 1,762,820 (Δ 137,824) | 4 (Δ 0) / 60,947 (Δ -7,158) | 42,707,375 (Δ -7,335,132) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 0) | 0 (Δ 0) |
| WO-086 | 12,879,963 (Δ 5,592,983) / 4 | 1,554,281 (Δ -208,539) | 4 (Δ 0) / 80,694 (Δ 19,747) | 127,809,215 (Δ 85,101,840) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -2) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-086/executor | 11,798,997 (8,556,828) | 2,421,843 (unavailable) | 1,322 (unavailable) | 118,493,502 (103,493,005) | 1,747 (1,624) | unavailable (unavailable) / 1,019 |
| WO-086/verifier | 1,080,966 (-1,396,430) | 18,158 (-360,748) | 49 (-347) | 9,315,713 (-10,556,528) | 60 (-399) | unavailable (unavailable) / unavailable |
| WO-086/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-086/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-086/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-086/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
