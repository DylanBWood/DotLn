# WO-180

Until now a repair was verified against the candidate alone, so a fix whose named test passed there was accepted with no evidence that the test had ever failed. This pull request lands WO-180. Before any implementation, a `baseline` episode runs the story's named tests on the sealed base snapshot and records the host's results as `BaselineWitnessed`. A defect the base does not reproduce stops with a typed `BaselineNotReproduced` before the change. A later candidate verification cannot pass a criterion whose named test did not fail on the base.

- **One more episode kind on the existing host.** It reuses WO-054's sealed snapshot and `VerificationHost`, with the same confinement and blinding as verification. The driver opens with `baselineContext: { kind: "baseline", story }`. The actor has no tools and returns only an envelope; the host derives the outcome from its own test rows. Compiler claim types, `verification-v1` and result version 1 are unchanged, and a stream opened without the context keeps its old bytes and replay.
- **Three typed outcomes.** A defect story names each regression by criterion, check, exact command and expected nonzero exit. `reproduced` needs every named test to fail with that exit. Anything else records `not-reproduced` with what the host observed, and `baselineDisposition` returns the stop naming the story. A `new` story records `walked` and continues. An actor that asks for human attention holds the stream with no witness.
- **Rows the actor cannot write.** The matrix exposes the base's host-run rows as `subject: baseline`, `origin: host`, `source: live`. Actor-supplied rows, outcomes or baselines are refused by the closed result shape. A forged or edited `BaselineWitnessed` fails replay, and a story naming an unsealed command is refused.
- **The comparison rule.** Candidate verification opens with `baselineContext: { kind: "comparison", witness }` over the same contract and named tests. The host computes a `baseline-test-did-not-fail` finding for each named defect test whose base row did not fail as named. The verifier must return those findings verbatim and cannot pass that criterion, so a candidate whose tests pass is `unverified`.

**Left to the composition.** WO-123 sequences the episode; here a fixture double stands in for it. Two seams are recorded for that order in [D013](../../evidence/WO-180/decisions.md#wo-180-d013). First, the caller declares the story's class, and a defect story passed as `new` walks past the stop, so the class source must be recorded where a contract is read. Second, the operator's per-run waiver of a non-reproduction stop has no carrier yet. Under this comparison rule, a waived run still cannot pass the defect criterion.

**Two fixture setups completed.** The evidence-source fixture now keeps uncommitted audit source bytes in its own temporary object database ([D010](../../evidence/WO-180/decisions.md#wo-180-d010)). The integration fixture links Playwright and the browser-evidence package v0.59.0 added ([D012](../../evidence/WO-180/decisions.md#wo-180-d012)). Production code and assertions are unchanged; each is a separate commit.

**Versions and editions.** Application `v0.60.0` is a minor release over `v0.59.0`. `@dotln/skeleton` is 0.48.0, and the console stays at 0.4.0 with its exact pin updated. The verification protocol is a registered evidence source, and `reactor.ts` is a judged feedback source. So the authority edition was re-minted as WO-180/002, artifact identity and verification as WO-180/003, and feedback as WO-180/003 from one live self-host audit on Codex `gpt-6.1-sol` at `max`. The console's self-host case and the Claude Code harness pins were regenerated.

**Validation.** `npm test -- --review` passed at code identity `a78509b5…`: 37 suites, 0 failed, 391.94 s. This review ran it after staging `packages/skeleton/test/baseline.test.ts`, which the earlier rows' identity did not key ([D014](../../evidence/WO-180/decisions.md#wo-180-d014)). `npm run test:docs` passes. The live rows on WO-056's synthetic repository, [Codex](../../evidence/WO-180/codex-live-004.json) and [Claude Code](../../evidence/WO-180/claude-live-004.json), each record `reproduced`. In each, the signed test fails with exit 1 and the repaired candidate completes with no comparison finding. [VER-001](../../verifications/WO-180/VER-001.md) passed with 22 admission probes and re-derived both receipts. [FINAL-001](FINAL-001.md) passed.

**Known limits.**
- **Platform.** Reproduction is proven on macOS only. Elsewhere, test execution is unavailable, and a defect story records `not-reproduced`.
- **Actors.** The live rows' model and effort are launch selections; effective values are unknown. The candidate actor is a process double.
- **Trust.** The comparison witness is trusted from the host-recorded opening, as host-run rows are today.
- **Scope.** Browser witnesses on the base and the composition itself are later work.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T12:02:48.656Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-066 | 9,373,182 (Δ unavailable) / 3 | 1,378,543 (Δ unavailable) | 4 (Δ unavailable) / 53,758 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-058 | 5,014,086 (Δ -4,359,096) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-174 | 13,456,142 (Δ 8,442,056) / 5 | 2,384,620 (Δ unavailable) | 4 (Δ unavailable) / 59,879 (Δ unavailable) | 50,171,251 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-175 | 8,027,049 (Δ -5,429,093) / 3 | 3,483,168 (Δ 1,098,548) | 4 (Δ 0) / 61,796 (Δ 1,917) | 52,710,657 (Δ 2,539,406) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-059 | 13,869,681 (Δ 5,842,632) / 8 | 3,716,930 (Δ 233,762) | 3 (Δ -1) / 23,786 (Δ -38,010) | 77,033,040 (Δ 24,322,383) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-180 | 4,382,562 (Δ -9,487,119) / 2 | 1,695,186 (Δ -2,021,744) | 3 (Δ 0) / 18,410 (Δ -5,376) | 48,716,481 (Δ -28,316,559) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-180/executor | 3,557,462 (-5,763,027) | unavailable (unavailable) | unavailable (unavailable) | 20,699,527 (-10,369,912) | 154 (-76) | unavailable (unavailable) / 1,019 |
| WO-180/verifier | 825,100 (-1,832,071) | 27,135 (-102,269) | 67 (-112) | 10,340,146 (-14,649,600) | 78 (-132) | unavailable (unavailable) / unavailable |
| WO-180/reviewer | 867,629 (-1,024,392) | 29,540 (11,531) | 106 (-81) | 17,676,808 (-3,297,047) | 134 (-78) | unavailable (unavailable) / unavailable |
| WO-180/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-180/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-180/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
