The new `console live --store <dir>` keeps resident activity, open orders and audit access together on one refreshing terminal screen. Plain `away`, `back`, `diff` and `audit` controls use the existing resident client; inspection results stay in scrollback until Enter resumes the screen. Commands retain their terminal result bytes and ordinary events plus the two console receipts.

The resident now continues with coded unavailable orders for a missing launchpad, malformed regular-file configuration and missing, malformed or nonregular index data. Nonblocking index/binding reads prevent FIFO startup hangs at those paths, and lifetime acquisition removes stale status temporaries.

Update strict status consumers with the new schema/decoder: old views remain accepted, but an older decoder rejects the new optional `workOrders.reason` field. Application v0.56.0 stages console 0.4.0 and skeleton 0.45.1 with the existing dependencies.

[Final review](FINAL-001.md) records the product and document gates; [fixture transcript](../../evidence/WO-117/fixtures.txt) records 22 passing focused tests. The [operator witness](../../evidence/WO-117/witness.md#final-review-correction--2026-09-29) concerns an earlier build; [VER-001](../../verifications/WO-117/VER-001.md) separately reproduced the final build in a real-resident terminal probe.

Known limits remain explicit: passive observation retains stale status after a resident crash, refresh work grows with event-log history, and recovery can repeat an old script notice. A configuration-path FIFO can still block startup. Terminal-mode tests and diagnostic improvements remain [named planning follow-ups](../../evidence/WO-117/decisions.md#wo-117-d012). Resident logs have no L0/L1 audit entries; recent-event labels and full audit L4 expose script results.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-29T17:55:51.237Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-060 | 6,799,386 (Δ unavailable) / 3 | 1,775,953 (Δ unavailable) | 21 (Δ unavailable) / 292,085 (Δ unavailable) | 103,210,110 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-167 | 11,439,453 (Δ 4,640,067) / 5 | 3,044,426 (Δ 1,268,473) | 14 (Δ -7) / 232,580 (Δ -59,505) | 168,489,088 (Δ 65,278,978) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 1) | 0 (Δ 0) |
| WO-173 | 10,679,133 (Δ -760,320) / 5 | 2,587,931 (Δ -456,495) | 9 (Δ -5) / 118,695 (Δ -113,885) | 88,392,150 (Δ -80,096,938) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 1 (Δ 1) |
| WO-116 | 5,621,918 (Δ -5,057,215) / 3 | 961,856 (Δ -1,626,075) | 0 (Δ -9) / 0 (Δ -118,695) | 120,263,202 (Δ 31,871,052) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ -1) | 0 (Δ -1) |
| WO-065 | 6,579,002 (Δ 957,084) / 5 | 1,624,996 (Δ 663,140) | 4 (Δ 4) / 68,105 (Δ 68,105) | 50,042,507 (Δ -70,220,695) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 1) | 0 (Δ 0) |
| WO-117 | 5,719,565 (Δ -859,437) / 2 | 1,762,820 (Δ 137,824) | 4 (Δ 0) / 60,947 (Δ -7,158) | 42,707,375 (Δ -7,335,132) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 0) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-117/executor | 3,242,169 (87,276) | unavailable (unavailable) | unavailable (unavailable) | 15,000,497 (-1,481,666) | 123 (1) | unavailable (unavailable) / 1,019 |
| WO-117/verifier | 2,477,396 (237,168) | 378,906 (100,407) | 396 (133) | 19,872,241 (-3,096,656) | 459 (146) | unavailable (unavailable) / unavailable |
| WO-117/reviewer | 1,464,211 (280,330) | unavailable (unavailable) | unavailable (unavailable) | 7,834,637 (-2,756,810) | 53 (-72) | unavailable (unavailable) / unavailable |
| WO-117/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-117/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-117/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
