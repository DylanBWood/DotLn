# WO-216 evidence

## Base observations

Source: `readGateChecks` over the main checkout, from 2026-10-13T19:35Z through 2026-10-17T18:00Z. Seven failed complete runs and seventeen failed document runs have task evidence; two additional outer harness failure summaries have no task timeline and are not separate executed gates. Failure minutes below are derived from task finish time minus the recorded run start (`recordedAt - durationMs`); skipped dependents are omitted.

| Recorded UTC | Gate | Run minutes | Failed tasks at minute |
| --- | --- | ---: | --- |
| 2026-10-13T19:42:01.726Z | npm run test:docs | 1.78 | plan-refutation-current: 0.99; plan: 1.04 |
| 2026-10-13T20:25:22.464Z | npm run test:docs | 0.54 | release-surfaces: 0.12 |
| 2026-10-13T20:26:20.248Z | npm run test:docs | 0.56 | index: 0.18; meta: 0.21 |
| 2026-10-13T21:54:48.929Z | npm test | 27.11 | process-debt: 5.68 |
| 2026-10-14T04:20:28.536Z | npm run test:docs | 0.91 | release-surfaces: 0.15; meta: 0.22; docs-check: 0.46 |
| 2026-10-14T04:28:01.433Z | npm run test:docs | 0.53 | meta: 0.18 |
| 2026-10-14T09:43:26.475Z | npm test | 0.11 | format: 0.11 |
| 2026-10-14T19:24:57.930Z | npm test | 41.28 | runner-fixtures: 22.30 |
| 2026-10-14T21:40:48.626Z | npm run test:docs | 1.01 | docs-check: 0.55 |
| 2026-10-15T00:23:45.847Z | npm test | 44.74 | worktree-integration: 18.18; launchpad: 29.29 |
| 2026-10-15T00:42:57.398Z | npm test | 18.46 | launchpad: 15.18 |
| 2026-10-15T03:04:59.276Z | npm run test:docs | 0.84 | docs-check: 0.46 |
| 2026-10-15T06:17:17.552Z | npm run test:docs | 0.59 | meta: 0.24 |
| 2026-10-15T11:34:06.562Z | npm run test:docs | 0.54 | meta: 0.22 |
| 2026-10-15T13:53:26.096Z | npm run test:docs | 0.60 | release-surfaces: 0.14 |
| 2026-10-15T15:46:28.421Z | npm test | 0.12 | format: 0.11 |
| 2026-10-15T16:41:46.058Z | npm run test:docs | 1.02 | authority-evidence: 0.21; artifact-evidence: 0.21; verification-evidence: 0.24; feedback-evidence: 0.26; docs-check: 0.53 |
| 2026-10-15T23:17:57.579Z | npm run test:docs | 0.55 | harness: 0.16; authority-evidence: 0.17; harness-evidence: 0.17 |
| 2026-10-15T23:18:50.105Z | npm run test:docs | 0.53 | authority-evidence: 0.17 |
| 2026-10-16T01:37:01.058Z | npm run test:docs | 0.58 | meta: 0.19 |
| 2026-10-16T07:02:59.247Z | npm test | 38.11 | wo107-schema: 21.18 |
| 2026-10-16T15:02:11.128Z | npm run test:docs | 0.66 | publication: 0.17 |
| 2026-10-16T16:21:49.439Z | npm run test:docs | 0.67 | authority-evidence: 0.26 |
| 2026-10-16T22:20:03.923Z | npm run test:docs | 0.73 | authority-evidence: 0.29; harness: 0.30; harness-evidence: 0.31 |

The worktree-integration failure in the first launchpad deadline run is retained as observed; the planning account groups the run by its launchpad failure. No product-defect conclusion is inferred from a task name alone.

## Three base runs of the reused checks

The bounded baseline probe ran serially on 2026-10-17, finishing at 20:18:38Z. Values are wall-clock milliseconds; these were existing direct check commands before runner changes, not a structural-phase gate. All three executions passed except release-surfaces, which refused the selected order heading without an assigned version. Release preparation remains required. The `siblings` and `baseline-fingerprints` checks, which the structural phase also reuses, were not timed at the base; their handoff durations appear in the generated-task tables below.

| Check | Run 1 ms | Run 2 ms | Run 3 ms | Exits |
| --- | ---: | ---: | ---: | --- |
| format | 7561 | 7204 | 7095 | 0, 0, 0 |
| configuration-root | 5817 | 6147 | 6097 | 0, 0, 0 |
| registrations | 701 | 569 | 591 | 0, 0, 0 |
| declarations | 228 | 215 | 210 | 0, 0, 0 |
| meta | 4019 | 3784 | 3753 | 0, 0, 0 |
| lineage | 47 | 42 | 42 | 0, 0, 0 |
| index | 2182 | 2146 | 2070 | 0, 0, 0 |
| release-surfaces | 239 | 221 | 239 | 1, 1, 1 |
| harness | 230 | 168 | 162 | 0, 0, 0 |
| authority-evidence | 727 | 594 | 611 | 0, 0, 0 |
| role-oracle | 369 | 358 | 366 | 0, 0, 0 |
| artifact-evidence | 223 | 221 | 216 | 0, 0, 0 |
| verification-evidence | 1173 | 1130 | 1134 | 0, 0, 0 |
| harness-evidence | 372 | 358 | 346 | 0, 0, 0 |
| feedback-evidence | 2602 | 2518 | 2637 | 0, 0, 0 |
| publication | 140 | 132 | 139 | 0, 0, 0 |

## Launchpad case names at the base

The source has these 29 top-level cases. The final split is compared against this set without renaming or dropping a case.

- WO-074 criterion 1: a destination that is not an empty directory is refused before any write
- WO-074 criterion 1: a destination that cannot be read is refused before any write
- WO-074 criterion 1: the scripts are byte-identical to UPSTREAM.md's commit, the manifest hashes verify, and the manifest lists every kit file and no seed
- WO-074 criterion 1: an offline npm ci against the exported lockfile succeeds
- WO-075 criterion 1: the exported runtime is byte-identical to a rebuild at the named commit, sits at the paths the scripts import, is manifest-listed and holds no package source
- WO-201 criterion 4: verify checks runtime and compiled tests, and reports other kit edits without refusing
- the exported instance checks runtime, coordination records and explicit diagnostics separately
- WO-075 criterion 2: harness check passes inside the export and refuses a one-byte drift, no hook imports by absolute path, the snapshot is ignored, a second emit changes no listed byte, and every installed Read directive resolves
- [document] WO-075 criterion 4: the cold-start bytes of each role inside the export are not larger than core's
- WO-074 criteria 1, 2 and 5: without package source the export activates its first order, a transition emits a decodable control Beacon, an unmatched attestation records with the advisory, and a Codex dispatch reserves its writer on the carried runtime
- WO-074 criterion 3: the export holds no planted instance material and the manifest lists no instance path
- WO-074 criterion 3: the local-terms check runs over every exported text and prints present, unavailable, or refuses
- WO-074 criterion 4: the license files are core's pinned bytes and manifest-listed; --license none writes only LICENSE-PENDING.md
- WO-074 design: an export from a work tree that differs from HEAD carries the commit and says so
- WO-075 design: a package source that differs from HEAD refuses before any write, so the runtime is the commit's build
- WO-075 VER-001-F1: tracked build and emit bytes hidden by index flags refuse before destination creation
- WO-075 VER-001-F1: a missing tracked source hidden by skip-worktree refuses before any write
- WO-075 VER-001-F1: nested compilable files inside ignored source and test directories refuse before any write
- WO-075 VER-001-F1: a tracked source replaced by a same-byte symlink under assume-unchanged refuses before any write
- WO-075 design: the emit closure the export predicts with is pinned to HEAD, named from the import graph, and a dirty copy refuses before any write
- WO-075 design: a TypeScript module under a runtime package's sources travels only as compiled output, which the local-terms screen judges
- WO-075 design: a host Git configuration that would ignore a kit file refuses the export by name, and an export cannot be made from a kit
- WO-075 design: a fresh clone of the committed export lacks the ignored snapshot, its hooks report snapshot-missing and delegate to host permissions, and one emit restores the check
- WO-074 design: a kit file absent at the commit refuses by name, and a destination inside a Git work tree becomes its own repository
- WO-078 criterion 1: an export to a declared sibling writes its receipt inside the manifest step and regenerates the entry, and an update records the sibling by its repository name
- export update preserves ownership, validates actions and keeps the exported resident
- starter refresh publishes one verified commit and preserves every refusal boundary
- starter seed floor rule agrees with the harness emit's composition
- starter staged tree refuses clean-filter changes to verified bytes

## Launchpad case names after the split

The runner-fixtures case compares the three files with the fixed 29-name base inventory and checks a peak of two concurrent tasks. The direct compatibility entry imports these files; the runner selects the file tasks.

### scripts/test-launchpad-export.mjs (24 cases)

- WO-074 criterion 1: a destination that is not an empty directory is refused before any write
- WO-074 criterion 1: a destination that cannot be read is refused before any write
- WO-074 criterion 1: the scripts are byte-identical to UPSTREAM.md's commit, the manifest hashes verify, and the manifest lists every kit file and no seed
- WO-074 criterion 1: an offline npm ci against the exported lockfile succeeds
- WO-075 criterion 1: the exported runtime is byte-identical to a rebuild at the named commit, sits at the paths the scripts import, is manifest-listed and holds no package source
- WO-201 criterion 4: verify checks runtime and compiled tests, and reports other kit edits without refusing
- the exported instance checks runtime, coordination records and explicit diagnostics separately
- WO-075 criterion 2: harness check passes inside the export and refuses a one-byte drift, no hook imports by absolute path, the snapshot is ignored, a second emit changes no listed byte, and every installed Read directive resolves
- [document] WO-075 criterion 4: the cold-start bytes of each role inside the export are not larger than core's
- WO-074 criteria 1, 2 and 5: without package source the export activates its first order, a transition emits a decodable control Beacon, an unmatched attestation records with the advisory, and a Codex dispatch reserves its writer on the carried runtime
- WO-074 criterion 3: the export holds no planted instance material and the manifest lists no instance path
- WO-074 criterion 3: the local-terms check runs over every exported text and prints present, unavailable, or refuses
- WO-074 criterion 4: the license files are core's pinned bytes and manifest-listed; --license none writes only LICENSE-PENDING.md
- WO-074 design: an export from a work tree that differs from HEAD carries the commit and says so
- WO-075 design: a package source that differs from HEAD refuses before any write, so the runtime is the commit's build
- WO-075 VER-001-F1: tracked build and emit bytes hidden by index flags refuse before destination creation
- WO-075 VER-001-F1: a missing tracked source hidden by skip-worktree refuses before any write
- WO-075 VER-001-F1: nested compilable files inside ignored source and test directories refuse before any write
- WO-075 VER-001-F1: a tracked source replaced by a same-byte symlink under assume-unchanged refuses before any write
- WO-075 design: the emit closure the export predicts with is pinned to HEAD, named from the import graph, and a dirty copy refuses before any write
- WO-075 design: a TypeScript module under a runtime package's sources travels only as compiled output, which the local-terms screen judges
- WO-075 design: a host Git configuration that would ignore a kit file refuses the export by name, and an export cannot be made from a kit
- WO-075 design: a fresh clone of the committed export lacks the ignored snapshot, its hooks report snapshot-missing and delegate to host permissions, and one emit restores the check
- WO-074 design: a kit file absent at the commit refuses by name, and a destination inside a Git work tree becomes its own repository

### scripts/test-launchpad-update.mjs (3 cases)

- WO-078 criterion 1: an export to a declared sibling writes its receipt inside the manifest step and regenerates the entry, and an update records the sibling by its repository name
- export update preserves ownership, validates actions and keeps the exported resident
- starter refresh publishes one verified commit and preserves every refusal boundary

### scripts/test-launchpad-seeds.mjs (2 cases)

- starter seed floor rule agrees with the harness emit's composition
- starter staged tree refuses clean-filter changes to verified bytes

## Handoff observations

Historical initial-implementation identity: `bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219`. The rows below are passing, executed observations at that identity, collected at 2026-10-17T22:07:50.442Z. The ImplementationReady event at 2026-10-17T22:08:51.733Z consumed these structural, thirteen focused and document rows. They are retained as historical evidence; current repair observations follow below. No complete review run is claimed here.

That initial handoff's structural phase took **29.907 seconds** wall-clock. Its six tasks ran serially before the selected work.

| Structural task | Seconds | Exit |
| --- | --- | --- |
| format | 6.770 | 0 |
| configuration-root | 5.534 | 0 |
| registrations | 0.780 | 0 |
| declarations | 0.263 | 0 |
| generated | 16.384 | 0 |
| host | 0.066 | 0 |

The generated task retains the following independently timed child checks. The runtime row inspects the source/output receipt without building.

| Generated check | Seconds | Exit |
| --- | --- | --- |
| runtime | 0.094 | 0 |
| meta | 4.314 | 0 |
| lineage | 0.046 | 0 |
| index | 2.176 | 0 |
| release-surfaces | 1.879 | 0 |
| siblings | 0.310 | 0 |
| harness | 0.189 | 0 |
| role-oracle | 0.367 | 0 |
| authority-evidence | 0.604 | 0 |
| artifact-evidence | 0.222 | 0 |
| verification-evidence | 1.228 | 0 |
| feedback-evidence | 2.686 | 0 |
| harness-evidence | 0.362 | 0 |
| console-fixtures | 0.429 | 0 |
| baseline-fingerprints | 1.264 | 0 |
| publication | 0.152 | 0 |

The launchpad files ran under their separate 900-second deadlines, with the scheduler admitting at most two file tasks at once. Their preserved 29 case names are listed above.

| Launchpad file task | Seconds | Exit |
| --- | --- | --- |
| launchpad:file:test-launchpad-export.mjs | 164.231 | 0 |
| launchpad:file:test-launchpad-seeds.mjs | 4.863 | 0 |
| launchpad:file:test-launchpad-update.mjs | 247.940 | 0 |

### Consumed handoff rows

| Check | Recorded UTC | Wall seconds | Evidence reference |
| --- | --- | --- | --- |
| structural | 2026-10-17T22:07:21.845Z | 29.907 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:structural:2026-10-17T22:07:21.845Z` |
| suite:runner-fixtures | 2026-10-17T21:50:55.975Z | 136.833 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:runner-fixtures` |
| suite:configuration-root | 2026-10-17T21:51:27.601Z | 30.056 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:configuration-root` |
| suite:sync-fixtures | 2026-10-17T21:54:38.736Z | 189.656 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:sync-fixtures` |
| suite:resume | 2026-10-17T21:56:37.297Z | 116.917 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:resume` |
| suite:harness | 2026-10-17T21:57:10.053Z | 31.143 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:harness` |
| suite:harness-context | 2026-10-17T21:57:42.659Z | 31.046 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:harness-context` |
| suite:launchpad-docs | 2026-10-17T21:58:18.983Z | 34.776 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:launchpad-docs` |
| suite:process-debt | 2026-10-17T22:00:49.308Z | 148.429 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:process-debt` |
| suite:launchpad | 2026-10-17T21:44:54.762Z | 278.355 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:launchpad` |
| suite:authority-evidence | 2026-10-17T21:45:28.384Z | 31.959 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:authority-evidence` |
| suite:feedback-evidence | 2026-10-17T21:46:03.169Z | 33.298 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:feedback-evidence` |
| suite:harness-evidence | 2026-10-17T21:46:35.850Z | 31.147 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:harness-evidence` |
| suite:evidence-sources | 2026-10-17T21:48:05.663Z | 88.238 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:evidence-sources` |
| npm run test:docs | 2026-10-17T22:07:21.845Z | 144.550 | `host-gate:bd4ef0fe2fc6bb6576395d17c7a9e64ba1b5b29ec179658972a1bf52ef265219:npm run test:docs` |

The base had no structural phase; the three serial direct-check timings above are its comparison. These historical observations establish the initial handoff, not the five-close cost claim in D011.

## Repair handoff observations

Current code identity: `f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d`. Collected at 2026-10-18T02:52:57.597Z. All rows below passed at this identity. The thirteen declared Preflight suites, structural row and document row supply the repair handoff; skeleton and harness-fixtures additionally clear VER-001 F1 and F2. The standalone format selection establishes the prescribed initial structural check. No complete review run is claimed.

The selected structural phase took **31.270 seconds** wall-clock, with the following six task durations.

| Task | Seconds | Exit |
| --- | ---: | ---: |
| format | 7.189 | 0 |
| configuration-root | 5.416 | 0 |
| registrations | 0.716 | 0 |
| declarations | 0.272 | 0 |
| generated | 17.503 | 0 |
| host | 0.066 | 0 |

Its generated task retains these child-check timings, including execution of the actual historical role oracle through the new checker.

| Task | Seconds | Exit |
| --- | ---: | ---: |
| runtime | 0.096 | 0 |
| meta | 4.764 | 0 |
| lineage | 0.047 | 0 |
| index | 2.123 | 0 |
| release-surfaces | 1.934 | 0 |
| siblings | 0.308 | 0 |
| harness | 0.217 | 0 |
| role-oracle | 0.435 | 0 |
| authority-evidence | 0.631 | 0 |
| artifact-evidence | 0.233 | 0 |
| verification-evidence | 1.303 | 0 |
| feedback-evidence | 2.846 | 0 |
| harness-evidence | 0.375 | 0 |
| console-fixtures | 0.440 | 0 |
| baseline-fingerprints | 1.527 | 0 |
| publication | 0.162 | 0 |

The three launchpad files passed under their existing separate 900-second deadlines. The unchanged 29-case inventory is listed above. An earlier launchpad selection at this same identity recorded exit 1 after 275.037 seconds at 2026-10-18T02:40:44.095Z: the nested kit gate refused host memory warning, pressure 2, after its other five structural tasks passed. The update file passed and fail-fast left the seeds file unstarted. A bounded host check observed normal pressure 1 at 2026-10-18T02:41:11.314Z; the selection was rerun with unchanged source and limits. The passing row below is that later run.

| Task | Seconds | Exit |
| --- | ---: | ---: |
| launchpad:file:test-launchpad-export.mjs | 168.413 | 0 |
| launchpad:file:test-launchpad-seeds.mjs | 5.159 | 0 |
| launchpad:file:test-launchpad-update.mjs | 251.210 | 0 |

### Repair handoff rows

| Check | Recorded UTC | Wall seconds | Evidence reference |
| --- | --- | ---: | --- |
| structural | 2026-10-18T02:52:36.846Z | 31.270 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:structural:2026-10-18T02:52:36.846Z` |
| suite:runner-fixtures | 2026-10-18T02:26:00.429Z | 136.018 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:runner-fixtures` |
| suite:configuration-root | 2026-10-18T02:26:32.021Z | 29.951 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:configuration-root` |
| suite:sync-fixtures | 2026-10-18T02:29:47.243Z | 193.549 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:sync-fixtures` |
| suite:resume | 2026-10-18T02:31:43.503Z | 114.522 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:resume` |
| suite:harness | 2026-10-18T02:32:16.506Z | 31.045 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:harness` |
| suite:harness-context | 2026-10-18T02:32:49.907Z | 31.706 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:harness-context` |
| suite:launchpad-docs | 2026-10-18T02:33:29.477Z | 37.772 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:launchpad-docs` |
| suite:process-debt | 2026-10-18T02:36:07.292Z | 155.999 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:process-debt` |
| suite:launchpad | 2026-10-18T02:46:16.859Z | 282.462 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:launchpad` |
| suite:authority-evidence | 2026-10-18T02:46:51.474Z | 32.675 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:authority-evidence` |
| suite:feedback-evidence | 2026-10-18T02:47:27.800Z | 34.331 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:feedback-evidence` |
| suite:harness-evidence | 2026-10-18T02:48:02.126Z | 32.621 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:harness-evidence` |
| suite:evidence-sources | 2026-10-18T02:49:33.331Z | 89.014 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:evidence-sources` |
| npm run test:docs | 2026-10-18T02:52:36.846Z | 148.350 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:npm run test:docs` |

### Supplemental repair rows

| Check | Recorded UTC | Wall seconds | Evidence reference |
| --- | --- | ---: | --- |
| suite:skeleton | 2026-10-18T02:18:08.215Z | 273.121 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:skeleton` |
| suite:harness-fixtures | 2026-10-18T02:23:42.457Z | 332.379 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:harness-fixtures` |
| suite:format | 2026-10-18T02:13:33.336Z | 29.918 | `host-gate:f09d6ade4b8facd8092da2b5e85c45dee825de2d7a7eb6d143a18709e7b14a5d:format` |

The original handoff rows above and the superseded a2d23a294c5e5d64f003afc62a1cabb2d7dce91d9269859b38b844c670f25764 repair rows supply no current claim. [D023](decisions.md#wo-216-d023--preserve-lock-coverage-within-its-measured-test-budget) records the stopped process-debt run, the two measured lock-fixture arms (20818.368 ms and 13024.495 ms), and the decision to retain the original 21200 ms limit while avoiding a repeated matrix. The repaired case also passed inside the full harness-fixtures selection in 13.704 seconds against that same 21.200-second limit. All required selections were rerun after the correction. These timings are observations, not the five-close savings claim.

## Second repair handoff observations

Current code identity: `0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8`. Collected at 2026-10-18T13:41Z from the gate index. This repair answers FINAL-001 (D027): F1, F2 and F3 are repaired (D029 to D031), nine follow-ups are taken within the Boy Scout bound and F8 and F11 are deferred (D032), and the operator's scope expansion adds the three suites below for the four fork items (D028). Every row below passed at this identity. No complete review run is claimed; the next final review runs one fresh `npm test -- --review --again`.

The structural phase of the last selection (`skeleton`, the companion row recorded at 2026-10-18T13:40:53.100Z) took **26.182 seconds** wall-clock with these six task durations; across the nineteen selections the companion took 25.9 to 27.9 seconds.

| Task | Seconds | Exit |
| --- | ---: | ---: |
| format | 6.264 | 0 |
| configuration-root | 4.752 | 0 |
| registrations | 0.537 | 0 |
| declarations | 0.236 | 0 |
| generated | 14.249 | 0 |
| host | 0.055 | 0 |

Its generated task's sixteen child checks, retained as metadata without their passing output (F3):

| Task | Seconds | Exit |
| --- | ---: | ---: |
| runtime | 0.028 | 0 |
| meta | 3.926 | 0 |
| lineage | 0.038 | 0 |
| index | 1.818 | 0 |
| release-surfaces | 1.608 | 0 |
| siblings | 0.266 | 0 |
| harness | 0.149 | 0 |
| role-oracle | 0.326 | 0 |
| authority-evidence | 0.532 | 0 |
| artifact-evidence | 0.202 | 0 |
| verification-evidence | 1.041 | 0 |
| feedback-evidence | 2.296 | 0 |
| harness-evidence | 0.324 | 0 |
| console-fixtures | 0.386 | 0 |
| baseline-fingerprints | 1.133 | 0 |
| publication | 0.125 | 0 |

The three launchpad files passed under their separate 900-second deadlines in the `launchpad` selection recorded at 2026-10-18T13:17:38.007Z.

| Task | Seconds | Exit |
| --- | ---: | ---: |
| launchpad:file:test-launchpad-export.mjs | 149.202 | 0 |
| launchpad:file:test-launchpad-seeds.mjs | 4.444 | 0 |
| launchpad:file:test-launchpad-update.mjs | 220.650 | 0 |

Row size after F3's repair, read over the last 24 rows at this identity: mean 18,922 bytes, largest 28,625 bytes, against the mean 334,630 bytes FINAL-001 measured for single-suite rows before it; no `output` field remains at any depth of `cases` or `taskTimeline` across the 42 rows at this identity.

### Second repair handoff rows

The structural row, the sixteen Preflight suites of the amended order and the document row, in the order the Preflight field names them; `harness-fixtures` and `skeleton` follow as D027 directed, and the standalone `format` selection is the prescribed initial structural check.

| Check | Recorded UTC | Wall seconds | Evidence reference |
| --- | --- | ---: | --- |
| structural | 2026-10-18T13:40:53.100Z | 26.182 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:structural:2026-10-18T13:40:53.100Z` |
| suite:runner-fixtures | 2026-10-18T13:05:01.302Z | 121.485 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:runner-fixtures` |
| suite:configuration-root | 2026-10-18T13:05:28.598Z | 26.316 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:configuration-root` |
| suite:sync-fixtures | 2026-10-18T13:08:18.050Z | 168.462 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:sync-fixtures` |
| suite:resume | 2026-10-18T13:09:59.138Z | 100.100 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:resume` |
| suite:harness | 2026-10-18T13:10:27.324Z | 27.189 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:harness` |
| suite:harness-context | 2026-10-18T13:10:55.523Z | 27.193 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:harness-context` |
| suite:launchpad-docs | 2026-10-18T13:11:27.184Z | 30.667 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:launchpad-docs` |
| suite:process-debt | 2026-10-18T13:13:29.941Z | 121.763 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:process-debt` |
| suite:launchpad | 2026-10-18T13:17:38.007Z | 247.072 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:launchpad` |
| suite:authority-evidence | 2026-10-18T13:18:06.556Z | 27.472 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:authority-evidence` |
| suite:feedback-evidence | 2026-10-18T13:18:36.815Z | 29.164 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:feedback-evidence` |
| suite:harness-evidence | 2026-10-18T13:19:05.099Z | 27.205 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:harness-evidence` |
| suite:evidence-sources | 2026-10-18T13:20:22.588Z | 76.402 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:evidence-sources` |
| suite:authority-grants | 2026-10-18T13:20:50.489Z | 26.902 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:authority-grants` |
| suite:target-worktree | 2026-10-18T13:28:04.881Z | 433.391 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:target-worktree` |
| suite:launchpad-planning | 2026-10-18T13:31:44.479Z | 218.613 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:launchpad-planning` |
| npm run test:docs | 2026-10-18T13:02:03.254Z | 133.605 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:npm run test:docs` |

### Supplemental second repair rows

| Check | Recorded UTC | Wall seconds | Evidence reference |
| --- | --- | ---: | --- |
| suite:harness-fixtures | 2026-10-18T13:36:35.153Z | 289.687 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:harness-fixtures` |
| suite:skeleton | 2026-10-18T13:40:53.100Z | 256.959 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:skeleton` |
| suite:format | 2026-10-18T13:02:58.791Z | 27.852 | `host-gate:0859ff092e29c72adb8812a12ceecc8fed770cf5a63d6de979a5be5cdc7859a8:format` |

The nineteen selections ran serially from 13:02:30Z to 13:40:53Z (about 38 minutes, with the structural companion paid once per selection). The `f09d6ade…` rows above supply no current claim. The document row is rerun after this section and the handoff are written; the row the completion consumes is named in the handoff. These timings are observations, not the five-close savings claim.
