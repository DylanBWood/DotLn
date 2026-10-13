## Release overview

Application v0.79.0 lets an operator see what an update will do before it writes. Until now the first time a starter or an instance learned what an update changes was after the files had been written: `export --update` planned and wrote in one step, and a fork taking a starter revision by `git merge` had no view of the kit files the merge would touch. In this release `export --update /path/to/starter --preview`, run from core, prints the update's plan and writes nothing, and inside an instance `preview --from upstream/main` prints the same shape for the fetched starter revision the operator is about to merge, naming the kit files the merge will change apart from the unchanged ones. It serves the operator who decides when to take upstream changes, and the maintainer who needs the update's summary to say what its preview said.

The visible changes:
- `node scripts/launchpad.mjs export --update /path/to/starter --preview` prints every kit path's planned replace, add, remove or refuse with the refusal's reason and retained hash, the declared instance actions as applied or preserved, the incoming commit and tag, the build hash before and after and the sibling receipt it would write, exits 0, and changes no byte of the destination, core's sibling receipts or the sibling registry; `--apply --preview` shows which actions would apply and refuses an incompatible one before any write.
- The update's own summary and the preview are one renderer over one plan, so the rows match; a post-manifest receipt or registry failure now prints the completed plan and names the destination and receipt state.
- Inside an instance, `node scripts/launchpad.mjs preview --from upstream/main` reads the manifest, the declared actions and the harness snapshot at a fetched starter revision and prints the changed kit files, `unchanged` rows (an identical revision reports zero changes), local edits as refusals annotated when unchanged upstream, occupied new paths as collisions, and every declared action as manual work after the merge, with one that cannot fit the instance listed as `cannot apply` with its reason.
- An update refuses an absent still-carried source input before building core's runtime.
- The client README's §Taking upstream updates opens with "Preview before every update.", documents both forms and each output line, and states that a preview writes nothing and is not a receipt.

## Read before upgrading

- **No operator action and no component change.** No package version, dependency or lockfile moves. Existing exports take the new launchpad through `launchpad export --update`; the preview forms work against any destination or starter revision that carries a manifest.
- **The from-core preview still builds core's pinned runtime** to compute the incoming kit; it protects the destination and the two sibling-record trees, not core's own build output. The receipt path it names is reserved only by the actual update, so the timestamp can differ.
- **The in-instance preview is a manifest comparison, not a merge prediction.** Git can merge some edits the preview lists as refused; a starter's own edits can keep their retained manifest hashes and then read as `unchanged` in a fork that still holds the original bytes; files outside the manifests are outside the preview.
- **A fork that removed a kit file the incoming revision still carries gets a refusal, not rows.** The shared planner's absent-file rule names the path and the preview exits 1; the from-core update must keep that rule. The repair rule for the revision form is boarded ([D015](../../evidence/WO-203/decisions.md#wo-203-d015--verification-follow-up-a-revision-preview-refuses-when-the-instance-removed-a-kit-file), FUP-9c558fa0f869290e).
- **The from-core preview lists byte-identical carried paths as `replace`.** On the real kit an update that changes three kit files and adds one previews as 865 replacements; the rows are accurate and the README says so, and labelling them `unchanged` in the core preview and the update's summary alike is boarded ([D016](../../evidence/WO-203/decisions.md#wo-203-d016--verification-follow-up-the-from-core-preview-lists-byte-identical-paths-as-replace), FUP-bf112b957627334d).
- **The receipt's date moves earlier.** It is fixed at the end of planning, after the build, so it precedes the write by the apply duration; its fields and path rule are unchanged. Planning receipt 044's regression condition for the split did not otherwise occur on an 80-case differential probe and the real corpus.
- **Generated kit paths are still checked after the build.** Compiled and emitted paths get their absence check once the incoming set is known; a refusal there still writes nothing (FUP-dc79b4b1065bf66e).
- **The `launchpad` gate task stays large.** It read 480.7 s in the passing review gate, above twice its pre-WO-201 reading; the watch row FUP-b531e850b70f6d4e stays open for planning.
- **Versions.** Application v0.79.0 is a minor release over v0.78.0, assigned at activation under the order's classification. No component version changes and no dependency is added.

## Substantive changes

**The planning and applying halves** (`scripts/launchpad.mjs`). `planKitUpdate` reads the destination's prior and pending manifests, preflights still-carried inputs, builds, plans every kit path and declared action and computes the manifest, build hashes and proposed receipt date and path, with no write; `applyKitUpdate` journals the pending manifest, writes, renames, writes the manifest and closes with the receipt, carrying the plan into any post-manifest failure; `updateKit` composes them. `planUpdate` keeps its mutation kinds and retained hashes and records whether each path's bytes equal the incoming hash and whether upstream changed it.

**The renderer and the CLI.** `renderUpdatePlan` prints the counts and rows for the preview and the completed update; under a preview it adds the incoming commit and tag, the build hashes and the receipt line, and for a revision it counts `unchanged` separately, annotates refusals unchanged upstream and prints the starter revision and the scope line. `export --update` accepts `--preview` with or without `--apply`, refuses a duplicate flag and `--preview` without `--update`, and omits the sibling receipt line when previewing.

**The in-instance form.** `previewFromRevision` resolves `--from` to one commit under the export's isolated Git environment, reads the three metadata blobs at that revision with the disk manifest's validator, plans against the instance tree and assesses the declared actions in report-only mode, where a failed hypothetical action becomes a `cannot apply` row and its staged configuration, writes and renames are restored before the next action; an incoming object-valued default is cloned so a later action cannot alter the printed declaration.

**The update's carry-ins** (`scripts/launchpad.mjs`, `scripts/lib/validation.mjs`, `scripts/lib/siblings.mjs`). Preparation calls an update preflight after reading the pinned sources and before building; the receipt writer takes the planned date and shares its path calculation with planning; the object, text, known-key and stale-line predicates live once and keep each caller's error wording.

**The fixtures** (`scripts/test-launchpad.mjs`). A `treeSnapshot` over modes, symlinks and `.git`; the core preview case in both opt-in states with an unreadable snapshot; the fetched-starter case with a bare remote, an identical revision, a retained-hash starter edit, inherited `GIT_*` isolation, a converged copy, seven unfit actions against two contracts, and missing and malformed revision manifests; the post-manifest receipt and registry failure cases; no-build assertions on refusals; both `--apply` forms refusing without a pending journal; an interrupted-update preview.

**The gate repairs** (`scripts/test-runner.mjs`, `scripts/test-runner.test.mjs`, `packages/skeleton/test/resident-actors.test.ts`). The `vertical` suite runs as four bounded tasks, the main file split by one name pattern and its complement, each keeping the 900-second bound, the product-read guard and two reserved slots, with a real-process fixture proving every case runs once and aggregation refusing a missing, duplicated, failed or timed-out member. The supervisor signal case polls its durable readiness file, surfaces early supervisor failures, bounds the wait by a measured baseline under the deadline helper and retires the group before forcing it.

**Documents.** The client README's §Taking upstream updates and §Opting in to instance actions document both preview forms; product 03 §Platform and instance boundary and product 12 §One workstream across repositories cite the fixture evidence in place.

## Progressive polish

The README's release claim becomes v0.79.0 and the order's heading carries its version. Both publication source locks are refreshed. The three fixture copy lists carry the new validation helper, which the emit closure pins in its sorted place. The decisions index, follow-up register, control projection, work-order index, sibling registry and meter are regenerated. The evidence directory keeps the targeted and regression fixture logs, the supervisor diagnostics, the vertical timing records, the failed repair gate row, the repair review and the meter snapshot.

## Evidence and compatibility

Application `v0.79.0` is a minor release over `v0.78.0`, built from WO-203 on `main` at `7f5f2805`, also the order's base; `main` did not move during the order, so integration merged nothing ([D017](../../evidence/WO-203/decisions.md#wo-203-d017--final-review-integration-took-in-nothing-every-acceptance-claim-carried-forward)). No component version, dependency or lockfile changes. The update's mutation kinds, writes and the WO-078 update cases are unchanged; the receipt's date moves to the end of planning.

The verification sequence:
- [VER-001](../../verifications/WO-203/VER-001.md) failed on criterion 3: the revision preview printed `replace` for every kept path and 6 replacements for a no-op revision, and refused outright when one declared action did not fit the instance; a local edit unchanged upstream read as a conflict. The repair ([D012](../../evidence/WO-203/decisions.md#wo-203-d012--repair-the-revision-rows-and-isolate-incompatible-manual-actions) to [D014](../../evidence/WO-203/decisions.md#wo-203-d014--partition-the-large-execution-file-without-omitting-a-case)) added the `unchanged` rows, the per-action isolation, the declaration cloning, the annotation and the vertical partition.
- [VER-002](../../verifications/WO-203/VER-002.md) passed all six criteria: a synthetic starter against real merges, an 80-case differential probe showing identical kinds, reasons, retained hashes and errors before and after the repair, and the real 866-file kit exported, previewed, updated and merged in a scratch clone with the protected trees hashed unchanged; two follow-ups boarded.
- [FINAL-001](FINAL-001.md) passed at the integrated tree with no new finding: the affected checks, the document gate (35 of 35) and the composed review gate (36 of 36 at the unchanged identity) are under its Executed checks ([D018](../../evidence/WO-203/decisions.md#wo-203-d018--final-review-pass-final-001-at-the-integrated-subject-the-readiness-row-settled-the-orders-follow-ups-left-for-planning)).

The executor's `npm test -- --review` at code identity `4de390c1…` passed 36 suites and 91 fresh tasks in 2,138.0 s, recorded 2026-10-13T00:00:37.363Z, after one failed repair gate in which only the main vertical file exceeded its task clock; `npm run test:docs` passed 35 of 35 in the executor's, the verifier's and the reviewer's runs at that identity.

Known limitations:
- The from-core preview builds core's pinned runtime.
- The in-instance preview compares manifests; it does not predict Git's exact merge, and files outside the manifests are outside it.
- A fork that removed a still-carried kit file gets a refusal, not rows.
- The from-core preview lists byte-identical carried paths as `replace`.
- Generated kit paths are absence-checked after the build.
- Execution evidence is from one macOS host with Node 26; no real starter or instance has yet previewed an update on this release.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-203/decisions.md) and the [handoff](../../evidence/WO-203/handoff.md).
