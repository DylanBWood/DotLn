## Release overview

DotLn v0.56.3 separates the roadmap from the proposals it used to carry. Product 06 now holds the release ladder, its exit criteria and the generated release history. Its twelve candidate and capability-policy sections, 863 lines, moved to the planning map under their original slugs with their register history intact. The planning continuation check now admits a citation whose target only moved, and it proves the move before admitting it.

## Read before upgrading

No event schema, component version, dependency or planning receipt changes. Links to the moved headings in product 06 (from `#work-order-navigation-and-identity-candidate` through `#candidate--local-model-usefulness-experiments`) now resolve in `docs/planning/work-order-map.md` under the same fragments, so a bookmark keeps its fragment and changes only its file from `06-roadmap.md` to `work-order-map.md`. The publication index no longer lists those twelve headings, and product 06's byte ceiling is 40,775 bytes (from 98,323), so new candidate text belongs in the planning map, not the roadmap.

## Substantive changes

Roadmap split: the interval from Work-order navigation and identity through Candidate — local-model usefulness experiments left product 06. It lives in the planning map's Moved from the roadmap (2026-09-30) section, unchanged except two relative links rebased to the same targets. The v0.0.0 rung keeps its formatting directive. The follow-up register records each of the seven moved candidate rows as a duplicate of its new map row, and the new row carries the former status and reopening condition.

Planning continuation: when a planning receipt's vision or capability source changes only by a link destination, `npm run plan -- check` admits it as a `relocated-planning-link` after proving the relocation. Restoring the old destinations must reproduce the judged text. The cited section must have moved from a product document to the public planning directory under the same slug, with identical content once relative links are resolved. The old heading must be gone, and the new one absent from the judged destination. Changed wording, ambiguous or missing anchors, a copy left behind, symlinked or outside destinations, and context-dependent link forms are refused. Existing dated capability additions keep their validation.

## Progressive polish

Inbound links in the vision, the pattern library, the roles document, the capability table, the planning map, one closed order and the everyday edition point at the map. The documentation README names the roadmap's scope and the candidates' new home. The publication locks, decisions index and follow-up register follow those edits.

## Evidence and compatibility

Prepared source tag: `v0.56.3`; reviewed base: `c57fd557a4f6617fa64cffc1bfd491140cb082d6`. The [release manifest contract](../../releases/README.md) binds the merged source commit and reviewed gate when the operator later authorizes release close. Components are unchanged: beacons 0.1.0, compiler 0.20.0, console 0.4.0, kernel 0.6.0 and skeleton 0.45.2. The supported Node engine remains >=26.0.0 and <27, and no dependency is added; the check's Markdown parsing uses the existing pinned prettier 3.9.6.

[FINAL-001](FINAL-001.md) records the final product and document gates, and [VER-001](../../verifications/WO-087/VER-001.md) passed all four criteria. Known limits are in the [decisions](../../evidence/WO-087/decisions.md). The capability table's link text still reads "roadmap", because the planning receipt binds that wording. The planning worker's context still omits the source passages the continuation check binds (FUP-dc58e92c5cafc732). The roadmap's generated history lacks rows for v0.56.1 and v0.56.2 until release tooling regenerates it.
