# WO-075 self-review: Improver of design, simplicity and maintainability

One fresh `dotln-worker` (claude-opus-5-5, the pinned model; effort not read back by the host, unknown), given only the order and the executor's diff, read-only, on 2026-10-09 before `implementation-ready`. Findings as returned, each with the executor's disposition. Counts: 28 found; 27 fixed; 1 recorded.

| Finding | Severity | Claim | Disposition |
| --- | --- | --- | --- |
| R1 | major | The bundle-screen fixture used a term absent from every emitted surface, so it would pass without the bundle being screened. | fixed: the term is `fail-conservative-correction`, present in every emitted skill, and the case asserts a refusal row naming a `.claude/skills/...` path. |
| R2 | major | The kit block, the first-order template, the README and product 03 told a fresh clone to run `harness emit`, which cannot load its runtime before `npm ci`. | fixed: all four name `node scripts/bootstrap.mjs` (`npm ci`, then the emit). |
| R3 | minor | `expectedHarnessBundle` re-implemented emitHarness's CLAUDE.md composition. | fixed: `composeHarnessInstruction(floor, block)` in scripts/lib/harness.mjs serves emitHarness and the prediction. |
| R4 | minor | The CLI summary echoed the child emit's and check's output, with two counts and two local-terms statuses. | fixed: counts only; the fixture regex loosened accordingly. |
| R5 | minor | UPSTREAM.md's runtime groups swallowed the build-free `src/*.mjs` modules under a "built at export time" label. | fixed: the groups cover `package.json` and `dist/src/**`; the build-free modules list one per line again, and the fixture asserts it. |
| R6 | minor | The seeded `docs/product/README.md` said the kit carries only 07. | fixed: it names 08 and why. |
| R7 | minor | The smoke copied the directive files after the scratch commit, leaving them untracked in the session's repository. | fixed: the copy runs before `git add`. |
| R8 | minor | The smoke's profile selection fell back to position. | fixed: the claude-code profile is required by harness. |
| R9 | minor | Post-write refusals left a partial destination without saying so; the ignore check ran last. | fixed: the ignore check runs right after `git init`; every post-write refusal names the partial export and its missing manifest. |
| R10 | minor | Three dirty-input refusals, one per run, with a mislabelled cause and no remedy. | fixed: one refusal lists build inputs, emit scripts and ignored files with the remedy. |
| R11 | minor | The ignored-file scan refused on files tsc cannot compile (`.DS_Store`). | fixed: only compilable extensions count; a `.DS_Store` plant must not refuse. |
| R12 | minor | The fresh-clone case depended on an earlier case's commit; `initRepository(kit)` re-initialized the export's repository. | fixed: `configureRepository` for the kit; the clone case commits its own export. |
| R13 | minor | The cold-start case was coupled to core's hand-edited floor with a 32-byte margin, used strict `<` and a hard-coded row count. | fixed: `<=`, a derived count, every export row must find a core row; D008 records the coupling and the follow-up to emit the directives from the bundle. |
| R14 | minor | README step 3 and the first-order item overstated what `harness check` verifies. | fixed (with F3). |
| R15 | note | Stale WO-074 docstrings on `kitPackage` and `kitLockfile`. | fixed. |
| R16 | note | A dead `relative` import; `readRuntime` exported and sorted for nothing. | fixed: import dropped, helper private and unsorted. |
| R17 | note | The EMIT_CLOSURE comment overstated what the prediction runs. | fixed: reworded (scripts/harness.mjs stays pinned because it chooses the emit's options in the export). |
| R18 | note | `exportKit(root, ...)` refused every root but TOOL_ROOT. | fixed: `exportKit(destination, options)` with the root fixed inside and the reason in the docstring. |
| R19 | note | A hand-rolled git spawn beside `runGit`. | fixed: `runGit` with `onFailure`. |
| R20 | note | "Root has tsconfig.json" stood for "has package sources" in two scripts and two fixtures. | fixed: `hasPackageSources(root)` in scripts/lib/paths.mjs (a `packages/<name>/tsconfig.json`), used by bootstrap and the export; the process-debt fixtures write `packages/kernel/tsconfig.json`. |
| R21 | note | Three assertions pinned implementation details (a dead regex branch, Node's wording, tsc's tsbuildinfo location). | fixed. |
| R22 | note | `bundleMatchesLaunchpad` is redundant when the scripts' checkout is the launchpad. | fixed: kept as a boolean (false when absent) with the comment that it carries weight under `DOTLN_LAUNCHPAD`; `passed` requires it true. |
| R23 | note | The smoke's reproducibility depended on an environment scrub kept outside the script. | fixed: the smoke removes the parent session's `CLAUDE*` variables itself. |
| R24 | note | The floor was screened twice. | fixed: the composed CLAUDE.md covers it; the seed is not screened separately. |
| R25 | note | "Refuses before any write" ignored the build's writes into this checkout's ignored dist. | fixed: the docstring says before any write to the destination. |
| R26 | note | Product 03 carried fixture outcomes and grew almost four times the Cost line's figure. | fixed: trimmed to the architecture (179,317 bytes); D011 records the overrun and its reason. |
| R27 | note | LEGAL repeated WO-074's last sentence word for word. | fixed. |
| R28 | note | The README cited a core register ID a fork cannot resolve. | fixed: it names the file at the commit UPSTREAM.md names. |

Recorded, not fixed: R13's structural suggestion (emit the Read directives from the compiled bundle) is a compiler change outside this order and is the follow-up D008 names. Per-criterion judgments as returned: 6 partial (R2, R6, R26, all fixed); the others were outside the design lens.
