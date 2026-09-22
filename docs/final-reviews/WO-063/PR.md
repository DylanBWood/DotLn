# WO-063

Branch names, commit messages and pull-request text can now be checked for shape and for leaked internal vocabulary before anything is pushed to a target repository. `lintOutwardArtifact({ kind, text, vocabulary, localTerms })` is a pure function over the four outward artifact kinds — `branch`, `commit`, `pr-title`, `pr-body` — and `node scripts/outward-lint.mjs <kind> < artifact` is the stdin CLI a host or hook can call. Every refusal names a stable rule and a span into the original text, and the exit codes are distinct: 0 pass, 1 refused, 2 local coverage unavailable, 3 usage or configuration failure.

**Why it matters.** Principle 16 says internal vocabulary never leaks into external artifacts, and WO-033's phase 2 specified the two-part deny list this delivers, but nothing checked an outward artifact before it left the launchpad — the existing local-terms check runs over committed prose only. WO-064 cannot apply a lint that does not exist, so this is its admitted prerequisite. Nothing calls the lint yet, by this order's own non-goal: no publish path, hook, worker prompt or target file changes here.

**The vocabulary deny has two parts, and an absent list is not a pass.** The public part is committed in `docs/control/outward-vocabulary.json` because it is public — `DotLn`, `launchpad`, `gem(s)`, `mask(s)`, exactly the terms Principle 16 names — and it is deliberately editable, along with the conventional type set. The private part goes through WO-039's `checkLocalTerms` unchanged, so the terms the Clean Room says must not re-enter are refused without ever being committed or hashed; local findings carry only a starting line and a count, never the matched text, the list or a raw exception. With no local list the result is `unavailable` with exit 2 rather than `pass`, and the public checks still run. Both files follow the configured control root, so copied tooling needs no default document tree.

**Matching is by whole token after per-character NFKC folding**, so `Dot`+ZWSP+`Ln`, `dot-ln`, fullwidth `Ｄｏｔ－Ｌｎ`, circled `ⒹⓞⓣⓁⓝ` and `Dot\nLn` are all caught, while `gemstone`, `unmask` and `launchpads` pass — the matcher joins tokens across separators and line breaks but never matches inside a word. Subjects and PR titles use `type(scope)?: summary` with an optional `!`, a declared lowercase type and at most 72 Unicode code points; commit bodies need an empty second line; branches use `type/lowercase-hyphenated-slug`, which also refuses a ref-traversal name like `fix/../main`.

**What a reviewer should know.** Two limits are real and recorded rather than fixed. The public terms are generic English, so `Apply the mask layer` refuses; the committed file is editable by design and [WO-063-D001](docs/evidence/WO-063/decisions.md#wo-063-d001) reopens on a legitimate target false positive. The `text.control-character` rule is an addition beyond the order's criteria and its class is narrower than "disguise": C0 except tab, LF and CR, plus DEL, U+2028 and U+2029, so bidi overrides and NEL pass; Trojan-Source coverage belongs to WO-064's integration or a fresh nomination. One defect met during review is not fixed here and is boarded up as [WO-063-D005](docs/evidence/WO-063/decisions.md#wo-063-d005): the WO-140 gate-sandbox fixture's teardown in `scripts/test-runner.test.mjs` failed the reviewer's first product gate with `ENOTEMPTY` after its own assertions passed, in a fixture this order does not touch; it did not recur, and its follow-up asks for the race to be diagnosed rather than retried away.

**Validation.** 27 focused fixtures pass, including a copied CLI running against relocated documents with no default document tree, a symlinked local list that leaks neither contents nor path, and the four distinct CLI exit codes. The reviewer's `npm test` passed 25 of 25 suites in 284.17 s at the code identity that includes the three new source files, with `outward-lint` among the required suites. This is an application patch, `v0.40.3`, with no runtime component, schema, dependency or publication-control change. Full evidence: the [implementation receipt](docs/evidence/WO-063/implementation.md), [VER-001](docs/verifications/WO-063/VER-001.md) and [FINAL-001](docs/final-reviews/WO-063/FINAL-001.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-22T02:14:44.628Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-150 | 3,104,354 (Δ unavailable) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-148 | 7,173,607 (Δ 4,069,253) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-147 | 11,712,829 (Δ 4,539,222) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-149 | 8,636,017 (Δ -3,076,812) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-063 | 2,742,659 (Δ -5,893,358) / 3 | 1,169,178 (Δ unavailable) | 3 (Δ unavailable) / 17,942 (Δ unavailable) | 21,682,801 (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 1 (Δ 1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-063/executor | 1,183,627 (-5,087,902) | unavailable (unavailable) | unavailable (unavailable) | 5,885,603 (unavailable) | 50 (unavailable) | unavailable (unavailable) / unavailable |
| WO-063/verifier | 549,616 (-753,769) | 58,786 (unavailable) | 53 (unavailable) | 6,361,710 (unavailable) | 60 (unavailable) | unavailable (unavailable) / unavailable |
| WO-063/reviewer | 1,009,416 (-51,687) | 34,650 (unavailable) | 91 (unavailable) | 9,435,488 (unavailable) | 98 (unavailable) | unavailable (unavailable) / unavailable |
| WO-063/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-063/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-063/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
