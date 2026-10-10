## Release overview

This release lets an existing export take core's kit updates. Until now a starter exported by `launchpad export` took core's later improvements only by hand, file by file. `node scripts/launchpad.mjs export --update` followed by the export's path, run from a core checkout at the commit to take, refreshes the export's kit by its manifest and leaves everything the instance owns alone. The visible changes:
- Kit files whose bytes still match the prior manifest are replaced; new kit files are added; dropped kit files are removed when unmodified.
- A locally edited kit file is printed as `refused:`, kept as it is, and keeps its prior manifest hash, so the next update refuses it again until the instance resolves it.
- Instance and overlay files are never touched by an update; a new kit path that an instance file already occupies is refused and stays outside the manifest.
- `UPSTREAM.md` and `KIT-MANIFEST.json` move to the new commit, and the output ends with the re-emit instruction `node scripts/harness.mjs emit`.
- The kit carries a typed `scripts/kit/KIT-ACTIONS.json` of dated instance actions, printed by every update and performed only when the instance opts in.

The release is for the operator who maintains a starter or a fork from this core, and for the agent roles that run an update inside a granted write root.

## Read before upgrading

- **Refusal, not merge.** A kit file the instance has edited is refused on every update and never merged; resolve it by hand and review the update before committing it. This is the order's design ([D002](../../evidence/WO-077/decisions.md#wo-077-d002--preserve-kit-ownership-across-repeated-updates)); the planning receipt's known issue that forks drift from core's process text through such refusals stands, and nothing in this release changes it.
- **Instance actions need two opt-ins.** `"kit": { "applyInstanceActions": true }` in the instance's `dotln.config.json` and `--apply` on the command line. Either alone performs nothing; `--apply` without the configuration refuses before any write. The closed `kit` section admits only that boolean; an unknown key or a non-boolean value refuses at load.
- **The exported `CLAUDE.md` can change under opt-in.** It stays an instance file, but a declared `change-phrase` action edits it when the instance has opted in; the contract template's old promise that an update never rewrites it is replaced by that exception ([D006](../../evidence/WO-077/decisions.md#wo-077-d006--independent-review-and-contract-consistency)).
- **Known limit: a root move can land inside a kit tree.** A kit-declared `rename-root` whose destination lies under `scripts/` or another kit tree is applied rather than refused; only a kit author can declare one, and the shipped action list is empty ([D007](../../evidence/WO-077/decisions.md#wo-077-d007--verification-ver-001-pass-three-update-follow-ups-boarded), FUP-eaad73517ca2a395).
- **Known limit: converged bytes are still refused.** A kit file whose bytes a fork brought by hand to exactly the incoming kit's bytes is still listed as locally modified and keeps its prior hash (same board).
- **Known limit: no retry after a failed instance write.** The update preflights every input and action, but if an opted-in root move fails after the kit files are written, the manifest stays at the old commit and a retry refuses; restore the export from Git (same board; the update promises no crash-atomic transaction).
- **Write grants.** The update writes outside the project. An agent running it needs the destination inside a root its role is granted; an order naming a destination alone grants nothing.
- **Component versions.** Application v0.74.0 is a minor over v0.73.1. No package version changes and no dependency is added.

## Substantive changes

**The update mode.** `scripts/launchpad.mjs` splits the exporter into `prepareKit`, which builds the commit's complete kit in memory with the same pinned-input, toolchain and local-terms checks as a fresh export, and `exportKit`, which keeps the destination write, repository initialization and in-export emit. `updateKit` reads and validates the prior manifest (schema, string commit and hashes, contained kit paths, no duplicates or overlaps), reads every prior kit file before the build, plans each sorted path as replace, add, remove or refuse, writes replacements through a temporary sibling and rename, writes the manifest last, and returns the plan and the applied actions for the printed summary. The manifest keeps a refused file's prior entry and records the new commit; `UPSTREAM.md` says that retained files are exceptions to that commit.

**Typed instance actions.** `readKitActions` admits only `rename-root` (`root`, `from`, `to`), `add-config-field` (dotted `field`, `value`) and `change-phrase` (`from`, `to` in `CLAUDE.md`), each with a distinct id and a calendar date. `planInstanceActions` preflights all of them against the destination before any write: a root move needs the configured root at `from` and nothing at `to`, moves declared child roots with it and refuses protected paths and symlinks; a configuration default is added only when absent and the whole draft must pass the closed configuration validator; a phrase is replaced exactly once and an already-applied replacement is preserved. Each applied or preserved action is printed; no control event is appended.

**The opt-in field.** `scripts/lib/config.mjs` gains the `kit` section with `applyInstanceActions` (boolean, default false), validated like every other section and present in the absent-configuration layout.

**Fixtures.** `scripts/test-launchpad.mjs` builds two commits in a synthetic source repository and exports the first; nine cases cover replacement and retained hashes on repeated updates, new-path collisions, nine refusals before any write, `--apply` without opt-in, the three action kinds and their repetition, declared child roots, a running exported resident across an opted-in update, and the byte equality of shared preparation against a staged export. `scripts/test-configuration-root.mjs` covers the `kit` section's admitted and refused shapes.

## Progressive polish

The client README template gains `Taking upstream updates` and `Opting in to instance actions`; its ownership paragraph and the contract template state the opted-in exception; product 07 §Where the control plane finds its documents lists `kit` among the optional sections and adds one sentence for the field in place; the software-engineer publication source lock is refreshed; the README's release claim reads v0.74.0.

## Evidence and compatibility

Application `v0.74.0` is a minor over `v0.73.1`, built from WO-077 integrated with `main` at `c6769090`, which is also the order's base; integration changed no judged byte ([D008](../../evidence/WO-077/decisions.md#wo-077-d008)). No package version changes and no dependency is added; the new code imports only `node:` built-ins and local modules. The manifest schema stays at 1, so exports written before this release update without migration. `dotln.config.json` without a `kit` section behaves exactly as before.

The verification sequence:
- [VER-001](../../verifications/WO-077/VER-001.md) passed: its probes over the real 596-file kit varied forged and stale manifests, configuration shapes, working directories, repeated updates and an action outside the declared set, and found three follow-up defects outside the criteria, boarded on D007.
- [FINAL-001](FINAL-001.md) passed at the integrated tree: the nine-case update fixture fresh under the bounded runner (9 of 9 in 39.7 s), the affected checks, `npm run test:docs` at 32 of 32 in 116.30 s, and `npm test -- --review` composed at the unchanged identity `43d2cf9c…` from the executor's fresh row (81 fresh tasks, 1,094.4 s).

Known limitations:
- A kit-declared root move can land inside a kit tree; converged bytes are still refused; a failed instance write after the kit writes needs a Git restore ([D007](../../evidence/WO-077/decisions.md#wo-077-d007--verification-ver-001-pass-three-update-follow-ups-boarded), FUP-eaad73517ca2a395).
- The resident fixture replaces the runtime with identical bytes between its two commits, so it shows continuity across an update, not across a changed runtime.
- Coverage is one macOS host with Node 26; no update of an operator's starter or fork has run yet.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-077/decisions.md) and the [handoff](../../evidence/WO-077/handoff.md).
