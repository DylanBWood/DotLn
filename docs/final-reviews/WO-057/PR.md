WO-059's browser adapter now has observed rows to pin a runtime on. A new [browser-runtime record](../../discovery/browser-runtime-2026-09-30.md) and its [JSON packet](../../discovery/browser-runtime-2026-09-30.json) show exactly pinned `playwright` `1.63.0` and Chromium headless shell `153.0.8010.12` on this macOS host. Both installed online from a scratch lockfile outside the workspace. The browser launched headless under the verification host's unchanged discovery sandbox and rendered one static fixture to equal screenshot hashes in two fresh processes. After SIGKILL of the Node parent, none of the recorded browser processes was left in the process table. A launchd-origin process with its whole inherited environment cleared also launched and closed the browser. The filtering-proxy row is `unavailable`, because the host configures no proxy.

[ADR-0002](../../decisions/0002-kernel-first-agentic-core.md#amendments) gains a dated amendment. It names WO-059's planned `packages/browser-evidence` package as the consumer of that pin, outside the kernel and compiler. [LEGAL](../../LEGAL.md#current-state) records the observation and the inventory duty: WO-059 records the pinned package and browser inventory, and `THIRD_PARTY_NOTICES` is due at the first built or bundled distribution, including browser and FFmpeg material. The [environment record](../../discovery/environment.md#wo-057-browser-runtime-addendum-2026-09-30) gains its addendum. No workspace manifest, lockfile, runtime source, `NOTICE`, license hash declaration or `environment.json` changes. The README's version line moves to `v0.56.4`.

Final review corrected one sentence in the record. Its list of removed variable names (four Codex names) comes from the probe's prefix filter over the executor's session, so it is not the whole removal. The removal is the `env -i` policy, and the record now says a consumer such as WO-059 criterion 5 clears the whole inherited environment ([D007](../../evidence/WO-057/decisions.md#wo-057-d007--state-the-no-server-rows-removed-names-as-a-projection)).

`npm test -- --review` (29 suites) passes at code identity `aa0c11eb…58409`, the executor's and verifier's, and `npm run test:docs` (23) passes. [VER-001](../../verifications/WO-057/VER-001.md) reinstalled the pin from nothing with its own scripts and reran every live row. Its lockfile, executable, license-file and screenshot hashes equal the executor's. [FINAL-001](FINAL-001.md) records this review. The evidence is one host, one pin, one static fixture, one SIGKILL trial and one standalone launch per observer. Whether a filtering proxy works is unknown. The record compares nothing with Playwright MCP ([D006](../../evidence/WO-057/decisions.md#wo-057-d006--distinguish-runtime-availability-from-an-mcp-architecture-choice)). No component, dependency or event schema changes.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-30T02:10:31.499Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-065 | 6,579,002 (Δ unavailable) / 5 | 1,624,996 (Δ unavailable) | 4 (Δ unavailable) / 68,105 (Δ unavailable) | 50,042,507 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 3 (Δ unavailable) | 0 (Δ unavailable) |
| WO-117 | 7,286,980 (Δ 707,978) / 3 | 1,762,820 (Δ 137,824) | 4 (Δ 0) / 60,947 (Δ -7,158) | 42,707,375 (Δ -7,335,132) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 3 (Δ 0) | 1 (Δ 1) |
| WO-086 | 15,692,236 (Δ 8,405,256) / 7 | 1,554,281 (Δ -208,539) | 4 (Δ 0) / 80,694 (Δ 19,747) | 127,809,215 (Δ 85,101,840) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -2) | 4 (Δ 3) |
| WO-172 | 55,766,398 (Δ 40,074,162) / 11 | 4,036,347 (Δ 2,482,066) | 3 (Δ -1) / 28,017 (Δ -52,677) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 6 (Δ 5) | 15 (Δ 11) |
| WO-087 | 5,168,783 (Δ -50,597,615) / 3 | 376,615 (Δ -3,659,732) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 13,325,126 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -6) | 1 (Δ -14) |
| WO-057 | unavailable (Δ unavailable) / 0 | 409,734 (Δ 33,119) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 4,032,819 (Δ -9,292,307) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ -1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-057/executor | 1,914,608 (-1,751,432) | unavailable (unavailable) | unavailable (unavailable) | 4,032,819 (-9,292,307) | 36 (-83) | unavailable (unavailable) / 1,019 |
| WO-057/verifier | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-057/reviewer | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-057/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-057/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-057/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
