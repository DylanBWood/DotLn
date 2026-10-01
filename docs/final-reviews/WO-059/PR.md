# WO-059

WO-058 made a visual or network pass admissible only with a screenshot or a request trace, but nothing in the repository could drive a browser to produce one. This pull request lands WO-059. A new private workspace package, `@dotln/browser-evidence`, runs a saved scenario in a pinned headless Chromium over a checked-in synthetic application. It returns screenshot, DOM, accessibility, network and console witnesses bound to each criterion, and a caller records them as subject evidence before `VerificationOpened`. The kernel, the compiler and the verification host are unchanged and load no browser.

- **One entry point, `runScenario(scenario, env)`.** It takes a saved scenario file or object in a closed interpreter: navigate, fill, click, assertText, assertResponse and a bounded wait. Unknown actions or fields are refused before any effect. The package serves its own form, fetch endpoint and console pages on a loopback server and aborts requests to any other origin. Raw captures and a Playwright `trace.zip` stay in a new output directory. Each run owns a fresh browser and context, and closes them and its server before returning.
- **Five witness kinds for every criterion.** Each covered criterion gets a screenshot, a DOM snapshot, an accessibility snapshot, one network trace per request and a console capture. A failed assertion produces adverse evidence. A console error or a failed `console.assert` produces a failing console witness for every criterion, and WO-058's admission refuses a pass on it. Console entries are copied at capture, so a late message cannot change the saved witness or its hash.
- **Replay is exact over declared fields.** A saved scenario replays to the same DOM, accessibility text, console entries and normalized request and response hashes. The PNG hash is also equal under the WO-057 pin, which is the screenshot rule WO-057 observed. [`replay-fields.json`](../../../packages/browser-evidence/fixtures/replay-fields.json) names each omitted field and its reason.
- **Recovery after a host kill touches only what the adapter started.** The adapter records its own identity and the browser's process tree. The tree is rooted at the browser process observed as the adapter's child, with start times read in UTC. `recoverFrom` refuses while the recorded owner lives, even after it renames itself, and refuses a record without that root. It signals only processes in the recorded tree whose pid, start time and command still match. A bystander holding the recorded browser pid is left alone.
- **A missing browser is unavailable, never a pass.** Launching without the pinned headless shell yields `unavailable` witnesses with the reason, and the package suite fails with an install command scoped to the cache the suite actually uses. Other launch failures are also unavailable, without install advice.
- **The dependency is recorded.** `playwright` `1.63.0` is pinned exactly in the adapter. The lockfile adds only it, `playwright-core` `1.63.0` and the workspace link. `docs/LEGAL.md` §Current state carries the dependency inventory paragraph. `NOTICE` and the three pinned legal hashes are unchanged.

**Before the next gate.** Each fresh worktree must install the pinned headless shell before its first `npm test`. Until it does, the `browser-evidence` suite fails by design ([D023](../../evidence/WO-059/decisions.md#wo-059-d023--receipt-036-missing-browser-disposition)). From the repository root, the command is `PLAYWRIGHT_BROWSERS_PATH="$PWD/.runtime/playwright" npx playwright install chromium --only-shell`. The install costs a download, disk space and time. The suite also has to run outside host confinement.

**Versions and editions.** Application `v0.59.0` is a minor release over `v0.58.2`. `@dotln/browser-evidence` starts at 0.1.0. `@dotln/skeleton` 0.47.2 adds the adapter to its normalized evidence components. The console stays at 0.4.0 with its skeleton pin updated. The kernel and compiler are unchanged. The lockfile is a registered evidence source, so the authority, artifact-identity and verification editions were re-minted as WO-059/001. After integration with `v0.58.2`, feedback was re-minted as WO-059/002 from one live self-host episode on Claude Code `claude-opus-5-5` at `xhigh`, and the console's self-host case was re-pinned.

**Validation.** `npm test -- --review` passed at code identity `7f384f7b…`: 38 suites, 0 failed, 82 fresh tasks, 399.86 s, with `browser-evidence` taking 19.06 s. VER-003 ran that gate with `--again`. This review's invocation found the passing row at the unchanged identity and started no suite. `npm run test:docs` passes.
- [VER-001](../../verifications/WO-059/VER-001.md) failed because the printed install command installed into a different cache from the one the suite uses. [VER-002](../../verifications/WO-059/VER-002.md) passed after the repair.
- [FINAL-001](FINAL-001.md) failed on a recovery path that could SIGKILL a process the adapter never started. After that repair, [VER-003](../../verifications/WO-059/VER-003.md) reproduced FINAL-001's record shape and four variants against a live bystander. Each was refused or signalled nothing, and a recorded surviving process was signalled.
- [FINAL-002](FINAL-002.md) re-ran that record shape against a fresh build. It was refused, the record was unchanged and the bystander stayed alive.

**Known limits.**
- **Scope.** The evidence covers the synthetic application on the operator's macOS host under the WO-057 pin. Real targets, cross-platform screenshot stability and universal kill cleanup are unproved.
- **Signal path.** On this host, Chromium exits with its host, so the signal path is proven with Node and `/bin/sleep` survivors rather than a surviving Chromium.
- **Trust.** Recovery trusts the record file it is pointed at ([D027](../../evidence/WO-059/decisions.md#wo-059-d027--repair-outcomes-and-independent-handoff)).
- **Recording window.** A browser process started in the last 250 ms sampling interval before a host kill, if it also outlives its root, goes unrecorded.
- **Identity.** A process identity is its pid, its start second and its command.

The evidence for each limit is in the [decisions](../../evidence/WO-059/decisions.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-01T02:44:47.538Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-057 | 4,030,373 (Δ unavailable) / 3 | 409,734 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 4,032,819 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 0 (Δ unavailable) | 0 (Δ unavailable) |
| WO-066 | 9,373,182 (Δ 5,342,809) / 3 | 1,378,543 (Δ 968,809) | 4 (Δ unavailable) / 53,758 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-058 | 5,014,086 (Δ -4,359,096) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-174 | 13,456,142 (Δ 8,442,056) / 5 | 2,384,620 (Δ unavailable) | 4 (Δ unavailable) / 59,879 (Δ unavailable) | 50,171,251 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-175 | 8,027,049 (Δ -5,429,093) / 3 | 3,483,168 (Δ 1,098,548) | 4 (Δ 0) / 61,796 (Δ 1,917) | 52,710,657 (Δ 2,539,406) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ 0) | 0 (Δ 0) |
| WO-059 | 13,277,581 (Δ 5,250,532) / 7 | 3,716,930 (Δ 233,762) | 3 (Δ -1) / 23,786 (Δ -38,010) | 77,033,040 (Δ 24,322,383) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-059/executor | 9,320,489 (4,745,349) | unavailable (unavailable) | unavailable (unavailable) | 31,069,439 (15,879,262) | 230 (115) | unavailable (unavailable) / 1,019 |
| WO-059/verifier | 2,657,171 (696,496) | 129,404 (86,967) | 179 (56) | 24,989,746 (-1,610,401) | 210 (67) | unavailable (unavailable) / unavailable |
| WO-059/reviewer | 1,299,921 (-191,313) | 18,009 (unavailable) | 187 (104) | 20,973,855 (10,053,522) | 212 (118) | unavailable (unavailable) / unavailable |
| WO-059/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-059/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-059/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
