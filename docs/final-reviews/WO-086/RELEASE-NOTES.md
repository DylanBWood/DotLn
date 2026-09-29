## Release overview

DotLn v0.56.1 makes the annotated tags the release record. The roadmap's release history is now a table generated from those tags, and a version collision between two parallel orders is recorded once, as the integrating order's decision. Readers of the roadmap, the README and the execution guide no longer meet a pair of activation and retiming paragraphs for every order, which the operator reported was discouraging parallel work orders.

## Read before upgrading

No event schema, component version, dependency or published tag changes. `npm run release -- prepare` no longer reads or writes product 06. At a collision it changes the order heading and the README version claim and appends one decision to `docs/evidence/WO-NNN/decisions.md`; under `worktree integrate` the integration decision carries it instead. It refuses, writing nothing, while that decisions record has an authored conflict. A heading ending in `(version assigned at activation)` is now filled with the next version under the order's classification.

The document gate no longer exempts product 06 §Release boundary by its heading. Only the registered `dotln-release-history` block is exempt, and any other marker pair exempts nothing. A hand edit inside the block, or a recorded tag the checkout lacks, fails `npm run test:docs`, so a checkout needs the recorded tags fetched. A newer local tag is reported and never refuses; `npm run release -- list --markdown --write` regenerates the table.

A lane that still carries old-style activation or collision paragraphs under §Release boundary moves them into its own decisions record when it integrates main; the document gate refuses them in product 06 as new receipts. Product 06's byte ceiling rises from 91,876 to 98,323 because the standing release policy the heading exemption hid is now counted, as the operator authorized.

## Substantive changes

Release history: `npm run release -- list --markdown` prints one row per local annotated DotLn release tag, newest first: the version, the tag's UTC date, the orders its manifest names with each heading's display name, the version step over the previous release, and the component versions. The block records a snapshot of the tags it was generated from. `--markdown --write` rewrites the registered block in product 06. The default `release list` output is unchanged.

Document gate: the docs check holds the registered block to its recorded tags. A changed row or a hand-written note inside it refuses at its line, and a missing or remade recorded tag is named. A sibling publishing a newer tag is reported, so it cannot turn another worktree's gate red. A demoted, quoted or hidden terminating heading exempts nothing.

Collision record: a retime or an activation assignment is written as a structured decision with the superseded target, the new target and the observed release baseline, never as roadmap or README prose. Integration recovery keeps that record whole. The meter and pull-request outputs are written before the target changes. If the integration decision cannot be written after a successful preparation, the saved outcome is filed first on continuation. Either way, a continued integration records the collision exactly once.

Retired notes: 66,778 bytes of hand-kept notes, in seven ranges including the note main added for v0.56.0, moved byte for byte to the release-history notes in planning, each range checked by SHA-256.

## Progressive polish

Product 07's integration sentence and activation duty, product 10's version-axes pointer and wording, the documentation README's exemption sentence and the ceiling policy now describe the generated block. The publication index, edition locks, document baseline, decisions index and follow-up register follow those edits.

## Evidence and compatibility

Prepared source tag: `v0.56.1`; reviewed base: `4d7c3319aed15abc9ae80a2ea3badadfcba5e878`, fast-forwarded from original base `3a68c517668555ae201feb8f1d51ee86c9e9ada0`. The [release manifest contract](../../releases/README.md) binds the merged source commit and reviewed gate when the operator later authorizes release close. Components are unchanged: beacons 0.1.0, compiler 0.20.0, console 0.4.0, kernel 0.6.0 and skeleton 0.45.1. The supported Node engine remains >=26.0.0 and <27, and no dependency is added.

[FINAL-001](FINAL-001.md) records the final product and document gates. [VER-001](../../verifications/WO-086/VER-001.md) and [VER-002](../../verifications/WO-086/VER-002.md) failed on collision provenance lost after an output failure; both paths were repaired, and [VER-003](../../verifications/WO-086/VER-003.md) passed all five criteria. Known limits are recorded in the [decisions](../../evidence/WO-086/decisions.md): the receipt recognizer misses dated labels without the bold-colon form, one product 07 sentence misnames the gate that runs `check-surfaces --local`, recovery guarantees cover filesystem failures, not process interruption, and a hand-run of the internal `--integration` flag during a pending integration can still leave a retime unrecorded, which the helper never does.
