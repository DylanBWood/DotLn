## Release overview

DotLn can now derive a work order's files and test commands from the contract it implements. Until this release, a StoryContract said what an issue requires, but the surfaces and tests of an order derived from it had to be typed by hand. The compiler now resolves each active requirement against a repository profile and a sealed worktree snapshot index. Named paths and the profile's demonstrated architecture yield rule-labeled surfaces, and a supplied inference may add labeled entries with a rationale. The profile's commands covering those surfaces become the tests. When a requirement yields no surface, or the repository is too large for the snapshot, the result hands off to a person with the candidate list instead of guessing. This is the input the source-to-deliverable composition (WO-123) and the resident-owned loop (WO-118) build on.

## Read before upgrading

- **New public contract in `@dotln/compiler` 0.24.0.** The package exports `deriveSurfaces`, `decodeRepoSurfaceProfile`, `decodeSnapshotIndex`, `SURFACE_RULE_PATTERNS`, `SURFACE_SNAPSHOT_BOUND` and their types. `compileStoryContract`, `revise` and every existing export keep their shape.
- **New reader in `@dotln/skeleton` 0.50.0.** `readSnapshotIndex(capsule, snapshotPath)` reads only a snapshot WO-054's host produced. It refuses a capsule without one and refuses a mount whose files drifted. The verification host source is unchanged.
- **The result is a proposal, not authority.** `DerivedSurfaces` lists indexed files and whole profile commands with their origins. Nothing is executed, and a caller decides what to do with an `inferred` entry.
- **The default threshold is 1.** Any active requirement without a surface makes the result `NeedsHuman`. A caller may pass a lower threshold. At 0, a contract with no covered requirement returns `DerivedSurfaces` with no surfaces, and the composition that consumes it must decide whether that can become an order.
- **Evidence editions and pins move.** Authority is re-minted as WO-124 revision 003 on the integrated source. Artifact identity and verification are WO-124 revision 002, and feedback is carried as WO-124 feedback-002 with no new live episode. The console pins compiler 0.24.0 and skeleton 0.50.0, and its self-host fixtures follow the compiler label. No dependency is added.

## Substantive changes

**Derivation.** `deriveSurfaces(contract, profile, snapshotIndex, options?)` reads the contract's active requirement statements. A backticked path, or a bare path containing a slash, resolves to the indexed files at or under it and is recorded `rule`/`named-path`. A profile noun found at word boundaries in the remaining text maps to the noun's directories and is recorded `rule`/`architecture`. A supplied inference must name an active requirement, a repository path and a one-line rationale, and is recorded `inferred`. A path the index does not hold is a `not-in-snapshot` candidate, never a surface. A requirement with nothing is an `unmapped-requirement` candidate. Each surface keeps every distinct origin.

**Tests.** A profile command is selected whole when one of its directories holds a derived surface, and it lists those surfaces. The command string is returned byte for byte, never rewritten or run.

**Confidence gate.** Confidence is the share of active requirements that yield at least one surface. Below the caller's threshold the result is `NeedsHuman`, with a reason, the candidates and the uncovered requirement IDs. A contract with no active requirement also hands off. A `null` index hands off naming the snapshot bound: 1 to 100 regular UTF-8 files of at most 100,000 bytes each, with no symlinks, submodules or binary files.

**Determinism and refusal.** The same inputs give byte-identical output in any input order, the output is frozen and the inputs are not mutated. A profile, index, threshold or inference that does not decode refuses with the failing field's path, including an empty slot in a sparse array.

**Snapshot reader.** `readSnapshotIndex` validates the sealed mount with WO-054's existing check before and after reading. It compares each mounted file with the sealed contents and returns each file's path, UTF-8 byte size and SHA-256.

## Progressive polish

Product 03 §Ports now describes the pure derivation and its gate beside the ImpactMap sentence, distinct from the cartographer episode. Product 06's `RepoProfile + ImpactMap` pipeline step now notes that surfaces and tests are fixture-proven and that low coverage hands off. Eleven synthetic fixture cases cover named paths, architecture nouns, an inference, a missing path, an unmapped requirement, partial coverage at the default and half thresholds, an empty demonstrated directory, a noun boundary and a directory reference. They reproduce with `node docs/evidence/WO-124/fixtures.mjs --check`.

## Evidence and compatibility

Application `v0.64.0` is a minor release over `v0.63.1`, built from WO-124 integrated onto `main` at `a3da7127`. The order was executed on `v0.63.0` (`aa770898`). WO-179 merged meanwhile as `v0.63.1`, and the final review integrated it. `@dotln/compiler` moves from 0.23.0 to 0.24.0 and `@dotln/skeleton` from 0.49.2 to 0.50.0. The console changes only its pins and label-driven fixtures.

The verification sequence:
- [VER-001](../../verifications/WO-124/VER-001.md) passed on all six criteria, with its own probes for inferred paths missing from the index, case-insensitive nouns, a directory-prefix trap and `../` paths.
- [FINAL-001](FINAL-001.md) passed on the integrated tree. It boarded three seams that probes outside the fixtures reach ([D014](../../evidence/WO-124/decisions.md#wo-124-d014--final-review-passes-and-boards-three-derivation-seams-outside-the-fixtures)).

`npm test -- --review` passed on the integrated tree: 35 suites, 0 failed, 423.47 s, at code identity `c9d73883c4bcc72cf7370a8bd00ea4897f0b0dbeb2e07d84a1e31b082668bcfe`. `npm run test:docs` passes.

Known limitations:
- A caller threshold of 0 returns `DerivedSurfaces` with no surfaces when nothing is covered.
- A requirement covered only by an inferred entry counts toward confidence, so an inference alone can clear the default gate.
- The noun rule treats `-` as a boundary, so prose `parser-other` matches the noun `parser`. Plurals do not match.
- A backticked command or prose such as `and/or` appears as a `not-in-snapshot` candidate.
- The profile is a typed value. Mapping WO-073's profile document to it, the cartographer episode and repositories larger than the snapshot bound are outside this release. No model episode ran, and inferences are a labeled fixture double.

Details are in the [decisions](../../evidence/WO-124/decisions.md), the [handoff](../../evidence/WO-124/handoff.md) and the [implementation note](../../evidence/WO-124/implementation.md).
