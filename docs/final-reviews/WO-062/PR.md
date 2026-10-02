# WO-062

Until now no DotLn code read a tracked-work artifact, so the source-to-deliverable vertical started from a hand-written contract. This pull request lands WO-062. The skeleton's new `fetchIssueBundle(repo, number, { directory })` reads one GitHub issue, its comments and their edit history through the existing `gh` helper, read-only. It maps them into a WO-060 `SourceBundle` whose revision id is the issue's last-updated time. Every item passes WO-060's screen before anything is stored, with the forge host as the only allowed link host. The bundle is written under its hash with a text-free receipt beside it, and an unchanged issue fetched again gives the same hash. WO-123 is its first consumer.

- **What enters the bundle.** Only the current title, body and comments. Authors become role labels: the issue author is `reporter`, a `Bot` actor or a `[bot]` login is `automation`, and every other commenter is `reviewer`. Edit history becomes text-free receipt entries and revisions whose changed spans cover the whole retained current item; no earlier version is stored. Image markup keeps its spans, and its byte hash is recorded as unavailable because the API does not supply one.
- **What is left out, and how a consumer learns it.** An item holding a declared secret shape, or a link to any other host, is left out and recorded with its id, shape, API path and span, never its text. Earlier versions pass the same screen, so a credential pasted and later edited out still stops the result. A comment whose author role cannot be determined is left out and named, and a declared field the response lacks is recorded absent. Any of these marks the result `stopped`, and `requireCompleteIssueBundle` throws an `incomplete` refusal naming the first item.
- **What refuses outright.** A missing or unauthenticated `gh`, a failing call, output that is not JSON, GraphQL errors, a malformed field (named by its API path) and an issue that changes during the read each refuse with a reason and store nothing. `gh` diagnostics are never echoed. A stored file with different bytes under the same name, or a symlink, refuses rather than being replaced.

**The repair.** [VER-001](../../verifications/WO-062/VER-001.md) failed the first implementation. It had read GitHub's `UserContentEdit.diff` as a change summary and stored each version as a section. Read-only queries showed each `diff` holds a full version, listed newest first, with the newest equal to the current text. So the bundle duplicated current text, presented earlier versions as current, and could keep a role-withheld comment's text through its newest edit. The repair keeps only current text, screens history without storing it and names each role omission ([D011](../../evidence/WO-062/decisions.md#wo-062-d011--current-text-only-explicit-role-omissions)).

**Validation.** `npm test -- --review` passed on the integrated tree at code identity `8618ab93…`: 30 suites, 0 failed, 410.06 s. `npm run test:docs` passes. 14 focused tests replay recorded-shape JSON through a fake `gh` without network access. They cover all ten of WO-060's declared shapes and URL forms in current bodies, comments and earlier versions, and each refusal the order names. Two read-only fetches of a public issue reproduced the bundle and receipt hashes. [VER-002](../../verifications/WO-062/VER-002.md) and [FINAL-001](FINAL-001.md) passed.

**Known limits.** The full-version reading of `diff` rests on sampled public reads, not on documented API behavior; D011 reopens if GitHub changes it. The screen catches only WO-060's declared shapes. With the forge host as the only allowed host, real issues lose many items: a public `cli/cli` issue lost 13 of its 43 comments to links to other hosts. A deleted revision or a secret that survives only in an earlier version stops the result, and a control character anywhere refuses the fetch. One query asks for up to 100 comments, each with up to 100 full earlier versions, into a 16 MiB reply buffer. A larger reply refuses as a generic `gh` failure and stores nothing.

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-10-02T03:11:55.616Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-182 | 5,812,601 (Δ unavailable) / 3 | 1,677,566 (Δ unavailable) | 3 (Δ unavailable) / 16,668 (Δ unavailable) | 18,764,996 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 1 (Δ unavailable) | 0 (Δ unavailable) |
| WO-061 | 5,072,289 (Δ -740,312) / 3 | 838,316 (Δ -839,250) | 4 (Δ 1) / 40,444 (Δ 23,776) | 24,874,201 (Δ 6,109,205) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ 0) |
| WO-179 | 11,332,268 (Δ 6,259,979) / 5 | 3,400,549 (Δ 2,562,233) | 4 (Δ 0) / 75,390 (Δ 34,946) | 40,662,068 (Δ 15,787,867) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -1) | 0 (Δ 0) |
| WO-124 | 3,692,949 (Δ -7,639,319) / 3 | 446,025 (Δ -2,954,524) | 3 (Δ -1) / 13,211 (Δ -62,179) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 2 (Δ 2) | 0 (Δ 0) |
| WO-107 | 7,947,102 (Δ 4,254,153) / 3 | 1,048,991 (Δ 602,966) | 3 (Δ 0) / 19,066 (Δ 5,855) | 32,030,699 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 0 (Δ -2) | 2 (Δ 2) |
| WO-062 | 4,583,315 (Δ -3,363,787) / 4 | 930,666 (Δ -118,325) | 3 (Δ 0) / 22,101 (Δ 3,035) | 31,952,166 (Δ -78,533) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 1) | 1 (Δ -1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-062/executor | 3,135,620 (-3,198,099) | unavailable (unavailable) | unavailable (unavailable) | 13,818,895 (-11,189,038) | 96 (-80) | unavailable (unavailable) / 1,019 |
| WO-062/verifier | 1,447,695 (951,425) | 134,554 (unavailable) | 105 (54) | 18,094,317 (11,155,313) | 124 (70) | unavailable (unavailable) / unavailable |
| WO-062/reviewer | 8,621 (-1,108,492) | 24,254 (unavailable) | 25 (4) | 38,954 (-44,808) | 28 (6) | unavailable (unavailable) / unavailable |
| WO-062/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-062/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-062/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
