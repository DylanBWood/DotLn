# WO-124

Until now, the files and test commands of a work order derived from an issue had to be typed by hand. The only derivation that filled surfaces, the portfolio's, read discovery candidates, not a contract. This pull request lands WO-124. A StoryContract, a typed repository profile and a sealed worktree snapshot now yield the order's surfaces and tests. Each entry says where it came from, and when a requirement matches no file the result hands off to a person with the candidates instead of guessing. WO-123 and WO-118 consume it.

- **`deriveSurfaces(contract, profile, snapshotIndex, options?)`** in `@dotln/compiler`. A path named in an active requirement resolves only to files the snapshot index holds and gets a `rule`/`named-path` origin. A profile noun found in the requirement's text maps to its directories with a `rule`/`architecture` origin. A supplied inference adds an indexed path with an `inferred` origin and its rationale. A path the index does not hold stays a candidate and never becomes a surface. Each surface keeps every distinct origin.
- **Tests are whole profile commands.** A command is selected when one of its directories holds a derived surface, and its string is never rewritten or run.
- **Confidence gate.** Confidence is the share of active requirements that yield at least one surface. Below the caller's threshold, which defaults to 1, the result is `NeedsHuman` with the candidates and the uncovered requirement IDs. A `null` index, for a repository the snapshot cannot hold, hands off naming the bound: 1 to 100 regular UTF-8 files of at most 100,000 bytes each.
- **Typed inputs that refuse.** `RepoSurfaceProfile` (nouns with their directories, and commands with the directories each covers) and `SnapshotIndex` (path, UTF-8 size, SHA-256) decode before use. A malformed field refuses with its path, sparse array slots included. The path and noun rules are exported data in `SURFACE_RULE_PATTERNS`.
- **`readSnapshotIndex(capsule, snapshotPath)`** in `@dotln/skeleton` indexes a snapshot that WO-054's host produced. It checks the seal before and after reading and refuses drift. `verification-worktree.ts` is unchanged.
- **Write-backs.** Product 03 §Ports adds the derivation and its gate beside the ImpactMap sentence (232 bytes). Product 06's pipeline step `RepoProfile + ImpactMap` now says it is fixture-proven and that low coverage hands off (56 bytes).

**Version.** Integrated over `v0.63.1` (`a3da7127`), so application `v0.64.0` is a minor. Compiler goes from 0.23.0 to 0.24.0 and skeleton from 0.49.2 to 0.50.0, and the console pins both. Authority evidence is re-minted on the integrated source as WO-124 revision 003. Artifact identity and verification are WO-124 revision 002, and feedback is carried as WO-124 feedback-002 with no new live episode. No dependency is added.

**Validation.** `npm test -- --review` passed on the integrated tree: 35 suites, 0 failed, 423.47 s, at code identity `c9d73883c4bcc72cf7370a8bd00ea4897f0b0dbeb2e07d84a1e31b082668bcfe`. `npm run test:docs` passes. [VER-001](../../verifications/WO-124/VER-001.md) passed all six criteria with its own probes. [FINAL-001](FINAL-001.md) passed after integrating main, re-minting the authority edition, and rerunning the WO-124 tests and the eleven-fixture reproduction on the integrated build.

**Known limits.**
- The rules are literal. Nouns match whole words case-insensitively, so a plural does not match and the contract hands off. A bare path needs a slash.
- Three seams outside the fixtures are boarded for WO-123's planning ([D014](../../evidence/WO-124/decisions.md#wo-124-d014--final-review-passes-and-boards-three-derivation-seams-outside-the-fixtures)). A caller threshold of 0 returns `DerivedSurfaces` with no surfaces. An inferred entry alone counts as coverage. Prose `parser-other` matches the noun `parser`.
- The profile is a typed value supplied by fixtures. Mapping WO-073's profile document to it, the cartographer episode and repositories larger than the snapshot bound are outside this order.
- No model episode ran. Inferences are a labeled fixture double, and the hand-off rate on real issues is unobserved.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-02T00:18:42.793Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-178 | 12,691,894 (Δ unavailable) / 6 | 2,740,715 (Δ unavailable) | 4 (Δ unavailable) / 87,371 (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-177 | 2,898,257 (Δ -9,793,637) / 3 | 421,171 (Δ -2,319,544) | 4 (Δ 0) / 36,300 (Δ -51,071) | 14,343,231 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-182 | 5,812,601 (Δ 2,914,344) / 3 | 1,677,566 (Δ 1,256,395) | 3 (Δ -1) / 16,668 (Δ -19,632) | 18,764,996 (Δ 4,421,765) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 0 (Δ 0) |
| WO-061 | 5,072,289 (Δ -740,312) / 3 | 838,316 (Δ -839,250) | 4 (Δ 1) / 40,444 (Δ 23,776) | 24,874,201 (Δ 6,109,205) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-179 | 11,332,268 (Δ 6,259,979) / 5 | 3,400,549 (Δ 2,562,233) | 4 (Δ 0) / 75,390 (Δ 34,946) | 40,662,068 (Δ 15,787,867) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-124 | 2,347,367 (Δ -8,984,901) / 2 | 446,025 (Δ -2,954,524) | 3 (Δ -1) / 13,211 (Δ -62,179) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 2) | 0 (Δ 0) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-124/executor | 2,019,288 (-6,093,086) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / 1,019 |
| WO-124/verifier | 328,079 (-1,367,014) | 8,529 (-59,625) | 42 (-84) | 4,613,152 (-13,089,688) | 47 (-89) | unavailable (unavailable) / unavailable |
| WO-124/reviewer | 9,725 (-1,515,076) | unavailable (unavailable) | 32 (-1) | 84,655 (-755) | 33 (-2) | unavailable (unavailable) / unavailable |
| WO-124/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-124/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-124/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
