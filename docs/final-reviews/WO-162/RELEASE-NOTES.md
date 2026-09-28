## Release overview

The repository's scripts now define each small shared helper once. Git calls go through one module, fixture writes, pretty JSON and bare SHA-256 digests come from one new helper module, and the planning and entropy receipt modules share six helpers they used to duplicate. The compiler imports two normalizers it used to declare twice. Nothing a user of DotLn observes changes; the release is for people who maintain the machinery, who now fix a helper in one place.

## Read before upgrading

No action is required. `@dotln/compiler` is 0.19.4, and `compareText` and `orderedUnique` are now exported from it. The generated hooks pin a new runtime snapshot, and the console's self-host fixtures follow the feedback edition recorded under `docs/evidence/WO-162`. A local script that defines its own Git wrapper or fixture writer keeps working; new scripts should import `runGit`, `spawnGit` or `execGit` from `scripts/lib/git.mjs` and `write`, `json` or `sha256Hex` from `scripts/lib/helpers.mjs`. `sha256` in `scripts/lib/plan-subject.mjs` still returns a `sha256:`-prefixed string; use `sha256Hex` for the bare form. A branch that integrates after this release and edits `scripts/lib/github-repository.mjs` imports Git helpers there from `./git.mjs`.

## Substantive changes

`scripts/lib/git.mjs` holds the only Git subprocess declarations under `scripts/`. `runGit` gains options for callers that need the raw result, `execFileSync` diagnostics or their own failure handling, and `spawnGit` and `execGit` pass arguments through unchanged. `scripts/lib/helpers.mjs` is new and holds `write`, `json`, `sha256Hex`, `timestamp`, `validDigest`, `exact`, `parseWithLabel`, `ensureDirectory` and `locked`. `parseJson` and `readJsonFile` in `scripts/lib/paths.mjs` accept a `rawErrors` option. The evidence-source registry names the helper, Git and path modules, because evidence tools now import them. In the compiler, `normalize.ts` exports the two normalizers and `compile.ts` imports them.

## Progressive polish

About ninety scripts and test fixtures changed only by importing a helper in place of a local copy, and unused imports left behind by that change were removed. One regression, run inside the existing process suite, compares every former writer, serializer and digest definition with the shared one at fixed inputs. The work-order map's skeleton validator candidate carries this order's measurement.

## Evidence and compatibility

Application `v0.52.10` is a patch over `v0.52.9`; `@dotln/compiler` 0.19.4 is a compatible patch over 0.19.3, and the skeleton and console pins follow. No dependency, contract, schema, gate step or role text changed. Of 177 fixture-tree paths, 173 are byte-identical; four console self-host files follow the compiler label under the operator's amendment of criterion 5. Independent verification failed once, on that criterion as first written and on three decision records, and passed all eight criteria after the repair. The final review merged `main` after WO-163 published, and its gate passed 44 suites, 0 failed, in 644.87 s on the merged subject. Two latent defects found during the work are recorded for planning and not fixed: path guards that accept a variant spelling of a directory, and text validators that disagree between the handoff and mission interfaces.
