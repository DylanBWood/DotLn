## Release overview

Application v0.76.1 makes the WO-107 profiling lane green again and keeps its hash-pinned collector files from drifting unseen. The lane hashes four modules under `corpus/harness/` whole, comments included, and records that hash as the provenance of every committed observation. On 2026-10-09 a comment-only rewrite in WO-188 changed one line of `profile.mjs`, so 36 of the 72 committed records carried a protocol hash no current source produced and the lane failed with `known collector revision` while every gate stayed green, because no gate ran it. This release records that drift under WO-107's own rule, restores the one comment to its earlier bytes, and declares the four files once so that the formatter and the comment scan leave them alone and the review gate judges them when they change. It serves the contributors who run or extend the corpus lanes, and the verifiers and reviewers who read the review gate.

The visible changes:
- The four files carry a `dotln-pinned-bytes` Git attribute and are listed in `.prettierignore`; `npm run format` and the comment check skip them.
- `npm test -- --review` runs the lane's schema test as the machinery row `wo107-schema` whenever the schema test or one of the four collectors changed against the merge base. The plain and document gates never run it.
- Two tests fail when the attribute set, the formatter ignores or the row's declared sources stop matching the list of files the collector hashes.
- The lane's classification case accepts unrelated declarations added to the shared kernel fixture, while still requiring WO-107's exact declaration to remain.

## Read before upgrading

- **No operator action and no component change.** No package version, dependency or lockfile moves. The four collector files hash to `1d618f2f…` again, the hash 36 committed records carry, and no record or measurement was re-collected.
- **The protection covers four files.** Only the files `protocolLineage` names carry the attribute: `profile.mjs`, `wo107-records.mjs`, `wo107-scenarios.mjs` and `wo107-bounded.mjs`. WO-105's lane keeps its own base-keyed pins and its register row FUP-d093f77bd927f9dc, and a rewriter that reads neither the attribute nor `.prettierignore` is outside this protection.
- **Adding a hashed file is a three-list change.** A file added to or removed from `protocolLineage`'s input list fails the schema case and the comment-labels case until `.gitattributes`, `.prettierignore` and the row's `machinerySources` entry all follow. The tests compare each list to the collector's own literal, never to each other; the schema case also requires `protocolHash`'s literal to match in order.
- **The review row needs the built tree.** `wo107-schema` is declared with `needsBuild`, because the lane's registry case imports `packages/*/dist`. A change to one of its five sources without `npm test -- --review` stays outside every gate, as before.
- **A negation line defeats the formatter check.** Both tests read `.prettierignore` as text and keep the lines that start with `corpus/harness/`. Appending `!corpus/harness/profile.mjs` makes Prettier format that file while both tests pass. The repair rule is to also resolve each collector input through Prettier's own ignore resolution ([D005](../../evidence/WO-200/decisions.md#wo-200-d005--verification-pass-ver-001-board-the-declaration-tests-textual-reading-of-the-formatter-ignore-list-which-a-negation-line-defeats), FUP-984094128fe71900).
- **Comment edits inside the four files move the hash.** The scan no longer reads them and the formatter no longer rewrites them, but an authored edit still changes provenance, and the review row then fails until the change is judged. WO-107 D010's remaining asks, archiving the second collector revision before a semantic edit, labelling the registry self-test as base-only and ending the comparison report with one newline, each change the pinned bytes and stay on FUP-8f0561e50754114f.
- **Planning condition held.** Planning receipt 044's criterion-5 condition occurred: WO-200 activated with D001 naming no consumer of the WO-107 baseline. The next planning pass takes it ([D006](../../evidence/WO-200/decisions.md#wo-200-d006--verification-planning-receipt-044s-criterion-5-reopening-condition-for-wo-200-has-occurred), FUP-2eddaaaa1ea5d3c3).

## Substantive changes

**Collector provenance** (`corpus/harness/profile.mjs`). One comment line returns to its bytes before commit `1aea2dea`, so the four hashed files produce `1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd` and every one of the 72 committed records validates. The drift is recorded first, in [D001](../../evidence/WO-200/decisions.md#wo-200-d001--record-the-collector-drift-before-restoring-its-bytes): the commit, its date, both hashes, the 36 affected records, the red interval from 2026-10-09 to 2026-10-12 and the cause class, a repository-wide rewriter reaching hash-pinned bytes outside every gate.

**Declarations** (`.gitattributes`, `.prettierignore`). Four rows set `dotln-pinned-bytes`, under a comment that says why: collector provenance hashes whole files, including comments and whitespace. The same four paths join the exact-bytes group of the formatter's ignore file.

**Comment scan** (`scripts/lib/comment-labels.mjs`). `commentFiles` asks `git check-attr` for `dotln-generated` and `dotln-pinned-bytes` in one call and excludes a file with either set. The restored bare `D007` token in `profile.mjs` therefore needs no entry in `docs/control/comment-baseline.json`, which is unchanged and has no corpus entry.

**Runner** (`scripts/test-runner.mjs`, `scripts/lib/machinery-coverage.mjs`). `machinerySources` gains `wo107-schema` with the schema test and the four collectors as its sources and is exported; `protection` gains the row's sentence; the row is declared beside `artifact-corpus` with `needsBuild`. One reasoned coverage exclusion names the schema test's runner import: runner changes are judged by `runner-fixtures`, and the collector row keeps exactly its five sources.

**Tests** (`corpus/harness/wo107-schema.test.mjs`, `scripts/test-comment-labels.mjs`). The schema case "the hashed collector files are exactly the pinned-bytes files" extracts `protocolLineage`'s literal input list, requires `protocolHash`'s literal to match it in order, and compares the attribute set over every tracked file, the `corpus/harness/` ignore entries and the row's declared sources to that list. The classification case validates the historical fixture from WO-107's commit with the unchanged validator and separately requires today's fixture to retain WO-107's exact declaration ([D002](../../evidence/WO-200/decisions.md#wo-200-d002--operator-authorized-classification-test-repair)). The comment-labels suite gains a fixture case, in which an attributed file holding a bare decision token is absent from the scan while a direct read still finds the token, and a real-repository case comparing the attribute set and the ignore entries to the same anchor.

**Documents.** Product 03 §Corpus policy states the rule in one sentence. `corpus/baselines/SCHEMA-WO-107.md` §Commands and retention carries one dated line naming the review row, the reversed drift and the classification repair.

## Progressive polish

The README's release claim becomes v0.76.1 and the order's heading carries its version. Both publication source locks are refreshed for the product 03 sentence. The comment scan's failure message names pinned sources beside generated ones, and the historical fixture variable in the classification case is renamed to say what it holds. The decisions index, follow-up register, control projection, work-order index and sibling registry are regenerated.

## Evidence and compatibility

Application `v0.76.1` is a patch over `v0.76.0`, built from WO-200 on `main` at `73061e52`, also the order's base; `main` did not move during the order, so integration merged nothing ([D007](../../evidence/WO-200/decisions.md#wo-200-d007)). No component version, dependency or lockfile changes. The collector hash, the schema, the measurements and the comparison report are unchanged; the only collector byte change is the restored comment.

The verification sequence:
- [VER-001](../../verifications/WO-200/VER-001.md) passed all five criteria at code identity `1acd288a…`: the four collectors byte-identical to WO-107's commit, all 72 records validating, the lane 14 of 14 in the built tree, nine mutations of the three lists failing their anchored tests, the row selected for a collector or schema-test change and for nothing else, and the plain gate never running it. It boarded the negation-line gap (D005) and routed receipt 044's fired condition to planning (D006).
- [FINAL-001](FINAL-001.md) passed at the integrated tree: it re-ran the lane, the comment check, the seven fixtures, the coverage case and both gate selections under the bounded runner, recomputed the hash and confirmed the attribute set and the formatter's effective ignores on the real repository, found no new defect, and re-deferred the two carried-in register rows by what the change did ([D008](../../evidence/WO-200/decisions.md#wo-200-d008--final-review-pass-final-001-at-the-integrated-subject-two-carried-in-register-rows-re-deferred-by-name)).

The executor's `npm test -- --review` at code identity `1acd288a…` passed 33 suites with 85 fresh tasks in 1,355.7 s, the new row in 1.5 s; its scratch proofs record twelve expected assertion failures and the three selection checks. The final review's gates at the same identity: `npm run test:docs` passed 35 of 35 in 128.2 s at the report, and `npm test -- --review` reused those tasks, ran `format` fresh and passed 33 of 33 in 8.56 s.

Known limitations:
- The formatter check is textual; a negation line in `.prettierignore` defeats it (D005).
- The protection covers the four WO-107 collectors only; WO-105's lane is unchanged.
- The second collector revision is not archived, the registry self-test is not labelled base-only, and the comparison report keeps its trailing blank line (FUP-8f0561e50754114f).
- Execution evidence is from one macOS host with Git and Node 26; no later edit to the collectors has yet exercised the review row on `main`.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-200/decisions.md) and the [handoff](../../evidence/WO-200/handoff.md).
