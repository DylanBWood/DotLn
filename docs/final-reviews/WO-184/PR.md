# WO-184

The verifier, reviewer, story compiler, pull-request observer, publisher and writer each carried a defect that an earlier review had recorded. The composition order that comes next would have met every one. This change settles nineteen of them, each with its own fixture.

**Verifier.** A behavior verifier on a stream with an independent review now passes the behavior it verified and leaves scope and convention defects to the reviewer, instead of stopping for a human. This held in three of three live Claude attempts.

**Surface derivation.** A request from which no file surface can be derived, or a requirement only an inference covers, now goes to a human.

**Pull-request observer.** It no longer echoes response bytes on an error.

**Publisher.** A publish that requires readiness re-checks it before returning a recorded publication.

**Review loop.** It stops naming the item instead of reporting a false `resolved`.

**Writer.** Its confined test command now runs under a host-owned profile, and cannot write `.git`, `.claude`, `.dotln` or the local instruction file.

**Reactor.** It drops to 90,998 of its 100,000-character bound by moving three regions into a leaf module byte for byte. The eighteen recorded streams keep their decisions.

**Read before merging.** Surface derivation now hands off in cases that used to pass at threshold 0. A target whose tests write into `.git` will fail under the writer. A non-regular `dotln.config.json` refuses by path. A verification opening gains an optional `reviewNotice`; streams without it compile the same verifier command byte for byte. The compiler moves to 0.25.0 and the skeleton to 0.52.0, with no new dependency.

**Validation.** The final product gate (`npm test -- --review`) and the document gate pass at the reviewed subject. The final review repaired the verifier's two carried findings inside the order:
- the writer profile's parity with the protected paths;
- a staleness assertion.

It then re-ran the regeneration with a fresh live feedback audit. Two reasoned host imports remain in the reactor's import closure, and effective live model settings were not observable. Details: [FINAL-001](FINAL-001.md), [VER-002](../../verifications/WO-184/VER-002.md), [decisions](../../evidence/WO-184/decisions.md), [release notes](RELEASE-NOTES.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-03T05:43:14.197Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-061 | 5,072,289 (Δ unavailable) / 3 | 838,316 (Δ unavailable) | 4 (Δ unavailable) / 40,444 (Δ unavailable) | 24,874,201 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-179 | 11,332,268 (Δ 6,259,979) / 5 | 3,400,549 (Δ 2,562,233) | 4 (Δ 0) / 75,390 (Δ 34,946) | 40,662,068 (Δ 15,787,867) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-124 | 3,692,949 (Δ -7,639,319) / 3 | 446,025 (Δ -2,954,524) | 3 (Δ -1) / 13,211 (Δ -62,179) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 2) | 0 (Δ 0) |
| WO-107 | 7,947,102 (Δ 4,254,153) / 3 | 1,048,991 (Δ 602,966) | 3 (Δ 0) / 19,066 (Δ 5,855) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -2) | 2 (Δ 2) |
| WO-062 | 5,453,733 (Δ -2,493,369) / 5 | 930,666 (Δ -118,325) | 3 (Δ 0) / 22,101 (Δ 3,035) | 31,952,166 (Δ -78,533) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 1 (Δ -1) |
| WO-184 | 47,821,972 (Δ 42,368,239) / 2 | 2,212,088 (Δ 1,281,422) | 4 (Δ 1) / 94,960 (Δ 72,859) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-184/executor | 45,578,751 (42,443,131) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-184/verifier | 2,243,221 (795,526) | 219,105 (84,551) | 418 (313) | 11,491,308 (-6,603,009) | 470 (346) | unavailable (unavailable) / unavailable |
| WO-184/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-184/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-184/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-184/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
