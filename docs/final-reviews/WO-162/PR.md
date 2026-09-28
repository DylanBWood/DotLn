# WO-162

The scripts defined the same small helpers again and again. Seventeen files defined their own `git` wrapper and many more called Git directly. The same create-the-directory-then-write fixture writer was defined 31 times in 28 files, and a pretty-JSON serializer 11 times. Six receipt helpers were cloned between the planning and entropy receipt modules. A bare SHA-256 digest existed under several names beside an exported `sha256` that returns a prefixed string, so importing the wrong one would change a stored value. A fix to one copy never reached the others.

This pull request lands WO-162. Each helper now has one definition, and its former copies import it. Outputs, diagnostics and fixture bytes are unchanged, and that was measured at fixed inputs, by independent differentials and by the full gate.

- **Git calls have one home.** `scripts/lib/git.mjs` holds the only two Git subprocess declarations under `scripts/`. Former wrappers call `runGit` with their original flags, buffer limits, environment and failure messages. Callers that read a raw status or bytes call `spawnGit` or `execGit` with unchanged arguments ([D010](../../evidence/WO-162/decisions.md#wo-162-d010)). `lib/meta.mjs` and `lib/authority-probe.mjs` keep a thin wrapper, because they return null on failure.
- **One new module, `scripts/lib/helpers.mjs`.** It holds the fixture writer, the serializer, the bare-hex digest `sha256Hex` and the six receipt helpers that the planning and entropy receipt modules now share. Each receipt module keeps its own receipt-id grammar. `plan-subject.mjs` re-exports `sha256Hex` beside its unchanged prefixed `sha256` ([D008](../../evidence/WO-162/decisions.md#wo-162-d008)).
- **Five named JSON readers call `scripts/lib/paths.mjs`.** A new `rawErrors` option hands each caller the native error, so each caller's own message is unchanged.
- **The compiler imports its own normalizers.** `normalize.ts` exports `compareText` and `orderedUnique`, and `compile.ts` no longer re-declares them. `@dotln/compiler` moves from 0.19.3 to 0.19.4.
- **Four divergences are decided, not merged.** Three containment helpers, three equality helpers, the text validators' control-character classes and two fence parsers keep their behavior, each with the callers that depend on it ([D004](../../evidence/WO-162/decisions.md#wo-162-d004) to [D007](../../evidence/WO-162/decisions.md#wo-162-d007)).

**What a reviewer should know.**

- **The operator amended criterion 5 ([D012](../../evidence/WO-162/decisions.md#wo-162-d012)).** Changing compiler source requires a new compiler label, and the feedback policy hash includes that label. Four console self-host fixture files therefore changed: three expected outputs record the hash, and the fixture manifest records the matching feedback edition. The other 173 of 177 fixture-tree paths are byte-identical, and with the old label the current code reproduces the old fixtures exactly.
- **This branch was merged with `main` after WO-163 published ([D017](../../evidence/WO-162/decisions.md#wo-162-d017)).** WO-163 moved `github-repository.mjs` into `scripts/lib/`, and Git carried this order's added import across the rename without a conflict. The import now reads `./git.mjs`, as WO-163's pull request said it must. Four authored conflicts were resolved by keeping WO-163's changes whole and applying this order's helper adoption to what remained. The application version was retimed from `v0.52.9` to `v0.52.10`.
- **Two latent defects were found and left for planning.** The source-change and beacon guards accept a directory spelled in another letter case or through a volume alias, and the worktree guard checks identity only after `git worktree add`; this reproduces on a case-insensitive volume in scratch fixtures (`FUP-8369f2b4284e70a8`). Text containing U+0085 or U+2028 passes the handoff validator and fails the mission validator; no production path joins the two (`FUP-b789b81160c008ea`).
- **The executor removed one of its own uncommitted control rows by hand ([D016](../../evidence/WO-162/decisions.md#wo-162-d016)).** It had bound the criterion 5 amendment, corrected the decision's wording, and bound it again, and no command can withdraw a row whose decision text changed. The committed log is an unchanged byte prefix, and the final review accepted the removal. The machinery gap is `FUP-9625ca888d7d08f5`.
- **`compareText` and `orderedUnique` are now public names of `@dotln/compiler`**, because its index re-exports the module.
- **Some planning premises were wrong.** The order counted 20 writers, 9 serializers and 8 digest copies; the tree held more, and all were adopted. It assumed no `scripts/` file is a registered evidence source and that its files were disjoint from WO-163's ([D010](../../evidence/WO-162/decisions.md#wo-162-d010), [D003](../../evidence/WO-162/decisions.md#wo-162-d003)). Neither changes a criterion.
- **Left alone on purpose.** The skeleton protocol validator kit, because every file in it is a feedback source; the work-order map now carries its measurement. Inline sites with their own semantics, and single wrappers such as `identityDigest`.
- **The follow-up register's retained-evidence row reopened.** The final review measured 29.52 MB of tracked evidence added in the week to 2026-09-28, above that row's 10 MB condition. WO-162's share is 0.6 MB. The row returns to the planner (`FUP-5e2f4ce16f9e8be1`).

**How the review went.** A Codex executor implemented the order. [VER-001](../../verifications/WO-162/VER-001.md), run in Claude Code with twelve read-only helpers, failed it: criterion 5 could not hold as written, one decision rested on a false premise and missed a defect the verifier reproduced, and two decisions omitted callers. A Claude Code repair corrected the records in place and recorded the operator's amendment. [VER-002](../../verifications/WO-162/VER-002.md), run in Codex, passed all eight criteria. [FINAL-001](FINAL-001.md) read the full diff, merged `main`, and ran the review gate on the merged subject. The verifier, the executor and the reviewer each record their own process failures in their reports.

**Validation.** The reviewer's `npm test -- --review` passed **44 passed, 0 failed, 644.87 s, 88 fresh tasks, exit 0**, at code identity `8d933507…` on the merged subject. The fixed-input regression compares 31 former writers over 99 inputs, 4 serializer families, 8 digest definers and the Git and receipt adapters, and passes. The fixture comparison reports 177 paths, 173 unchanged and the four named files changed. `npm run test:docs`, `publication:check`, `harness check`, `meta --check`, `plan check` and the local release surfaces pass. `git diff --check` is clean, no dependency is added, and the diff adds no suppression.

This prepares application `v0.52.10` as a patch over `v0.52.9`, the classification the order declared. `@dotln/compiler` moves to 0.19.4 as a compatible patch; the skeleton and console pins and the lockfile follow, and the authority, artifact-identity, verification and feedback editions are re-minted under `docs/evidence/WO-162`. No live episode was run.

Full evidence: [decisions D001 to D017](../../evidence/WO-162/decisions.md), the [implementation record](../../evidence/WO-162/implementation.md), the [regression transcript](../../evidence/WO-162/helper-regression.txt), the [fixture digests](../../evidence/WO-162/fixture-digests.json), [VER-001](../../verifications/WO-162/VER-001.md), [VER-002](../../verifications/WO-162/VER-002.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-162-in-unit-helper-reuse.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-28T03:30:47.281Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections | Directions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-168 | 12,862,796 (Δ unavailable) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 195,038,374 (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 1 (Δ unavailable) |
| WO-171 | 8,494,635 (Δ -4,368,161) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 88,103,267 (Δ -106,935,107) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ -1) |
| WO-164 | 14,017,933 (Δ 5,523,298) / 8 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | 158,352,146 (Δ 70,248,879) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-170 | 10,327,714 (Δ -3,690,219) / 5 | 3,837,634 (Δ unavailable) | 0 (Δ unavailable) / 0 (Δ unavailable) | 102,085,188 (Δ -56,266,958) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 4 (Δ unavailable) | 0 (Δ 0) |
| WO-163 | 10,315,544 (Δ -12,170) / 5 | 2,285,041 (Δ -1,552,593) | 23 (Δ 23) / 405,178 (Δ 405,178) | 62,130,267 (Δ -39,954,921) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ -3) | 1 (Δ 1) |
| WO-162 | 11,164,476 (Δ 848,932) / 4 | 1,916,979 (Δ -368,062) | 3 (Δ -20) / 22,104 (Δ -383,074) | 92,198,379 (Δ 30,068,112) / unavailable (Δ unavailable) | 1,019 (Δ 0) | 1 (Δ 0) | 0 (Δ -1) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-162/executor | 7,063,627 (-725,573) | 665,994 (-356,818) | 506 (-193) | 47,177,395 (-3,725,393) | 643 (-295) | unavailable (unavailable) / 1,019 |
| WO-162/verifier | 4,100,849 (2,709,764) | 283,345 (283,196) | 1,221 (1,162) | 14,051,731 (2,906,220) | 1,317 (1,253) | unavailable (unavailable) / unavailable |
| WO-162/reviewer | 2,221,532 (1,086,273) | 200,656 (161,301) | 96 (30) | 30,969,253 (30,887,285) | 147 (67) | unavailable (unavailable) / unavailable |
| WO-162/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-162/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-162/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
