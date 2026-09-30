# WO-058

DotLn's verification contract typed a claim only as state or behavior, so a screenshot or a request log was prose a verifier could cite for anything. This pull request lands WO-058. A criterion can now be typed `visual` or `network`, an evidence item can carry one of five hash-bound witness kinds, and the host refuses a verifier's pass that the right witness does not support. WO-059's browser adapter will produce these witnesses, and WO-061 uses the visual claim type.

- **Five witness kinds, as plain data.** An evidence item may carry an optional `witness`: `screenshot` (a content hash and the criterion id it is bound to), `dom-snapshot`, `accessibility-snapshot`, `network-trace` (request method, URL and body hash; response status and body hash) or `console-capture` (level and message entries). Every witness carries a `sha256:` content hash, and every shape is closed. An unknown kind, a malformed or extra field, or a criterion typed outside the four claim types refuses at decode with its schema path. The compiler holds no browser code.
- **A visual pass needs a screenshot.** `parseEvidenceResult` refuses a `pass` for a visual criterion unless its cited evidence includes a passing `screenshot` bound to it (`visual pass requires screenshot`). DOM and accessibility snapshots alone leave the row `incomplete` through an admitted `unverified`.
- **A network pass needs a trace.** The same rule applies to a network criterion and a passing `network-trace` (`network pass requires trace`).
- **A console error fails its criterion.** A `console-capture` holding an error must have outcome `fail`. It refuses a `pass` for its criterion and required check even when the result omits it (`console error witness`), and a `fail` that cites it is admitted. A producer binds one capture to each criterion a scenario covers; the contract has no scenario field.
- **Nothing else decides.** A row's status still comes only from a host-admitted verifier evaluation, and an implementer's event cannot relabel it. The `worktree-snapshot` profile still admits only live behavior criteria with host-run tests, and it refuses a witness field. The verifier's prompt now states the three rules.

**Compatibility.** The contract stays `verification-v1`, and the accepted-result version stays 1. An evidence item without a witness lowers to the same bytes as before, and the verifier re-lowered all 179 recorded capsules to identical bytes. An older compiler or skeleton refuses a capsule that uses a new claim type or witness at decode, so keeping v1 fails closed. The compiler moves from 0.20.0 to 0.21.0 and the skeleton from 0.46.0 to 0.47.0, and the console's pins follow. The application target is v0.58.0, a minor release over v0.57.0. No dependency is added, and the kernel is unchanged.

**Validation.** `npm test -- --review` passed fresh at this code identity (34 suites, 0 failed) after the final review staged the new test suites, which the earlier gate identity did not include. `npm run test:docs` passes. [VER-001](../../verifications/WO-058/VER-001.md) passed all seven criteria and added 16 probes of its own, and [FINAL-001](FINAL-001.md) records this review. The admission evidence is browser-free fixtures run through the real admission check and matrix fold. The authority, artifact-identity, verification and feedback editions are re-minted at WO-058 revision 001. The feedback edition comes from one live self-host episode on Codex `gpt-6.1-sol` at `max`.

**Known limits.** A hash binds data, not authenticity: the contract cannot tell a real capture from a fabricated one with a matching hash, and real capture belongs to WO-059. The verifier's result schema offers all four claim types for every criterion. A live verifier could therefore emit a mismatched claim type that admission then refuses. That gap already existed between state and behavior, and it is recorded as a follow-up ([D010](../../evidence/WO-058/decisions.md#wo-058-d010)).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-30T16:48:06.315Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-086 | 15,692,236 (Δ unavailable) / 7 | 1,554,281 (Δ unavailable) | 4 (Δ unavailable) / 80,694 (Δ unavailable) | 127,809,215 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 4 (Δ unavailable) |
| WO-172 | 55,766,398 (Δ 40,074,162) / 11 | 4,036,347 (Δ 2,482,066) | 3 (Δ -1) / 28,017 (Δ -52,677) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 5) | 15 (Δ 11) |
| WO-087 | 5,168,783 (Δ -50,597,615) / 3 | 376,615 (Δ -3,659,732) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 13,325,126 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -6) | 1 (Δ -14) |
| WO-057 | 4,030,373 (Δ -1,138,410) / 3 | 409,734 (Δ 33,119) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 4,032,819 (Δ -9,292,307) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ -1) |
| WO-066 | 9,373,182 (Δ 5,342,809) / 3 | 1,378,543 (Δ 968,809) | 4 (Δ unavailable) / 53,758 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-058 | unavailable (Δ unavailable) / 0 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-058/executor | 1,495 (-7,082,874) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-058/verifier | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-058/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-058/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-058/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-058/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
