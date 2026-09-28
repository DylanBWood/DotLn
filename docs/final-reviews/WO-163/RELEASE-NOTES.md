## Release overview

The top level of `scripts/` now holds only files that someone runs. Three import-only modules moved into `scripts/lib/`, and the library's one command block became the `scripts/release-fixtures.mjs` entry point. Three planning inputs that nothing read are retired, the follow-up register is marked generated, and the WO-042 mutation reproduction, whose check had failed on every tree since 2026-09-10, is kept as a historical record with a check that passes and states what it proves. Each change went through a recorded decision.

## Read before upgrading

A local script or checkout that imports `scripts/github-body.mjs`, `scripts/github-repository.mjs` or `scripts/release-notes.mjs` must import them from `scripts/lib/`; no stub remains at the old paths. A branch that edits `scripts/github-repository.mjs` and imports `./lib/git.mjs` there must change that import to `./git.mjs` after merging this release, or `scripts/worktree.mjs` and `scripts/release.mjs` stop loading. `node scripts/authority-mutation-evidence.mjs --write` is retired, and `--check` no longer compares the current tree with WO-042's snapshot. The three `docs/planning/*-dispositions.json` inputs for the process-debt, proof-carrying-gates and machinery stand-down passes are gone; their entries live in the receipts named in WO-163-D004, and Git history keeps their bytes.

## Substantive changes

`scripts/lib/github-body.mjs`, `scripts/lib/github-repository.mjs` and `scripts/lib/release-notes.mjs` replace the top-level files, and `scripts/worktree.mjs`, `scripts/release.mjs`, `scripts/lib/target-publish.mjs`, `scripts/lib/harness-prune.mjs` and the test fixtures import them there. The release workflow-tooling note matches both the old and new paths, so manifests that span the move re-derive the same notes. `scripts/release-fixtures.mjs` carries the list, save and copy actions that were inside `scripts/lib/release-fixtures.mjs`, with the same usage text and exit code. `.gitattributes` marks `docs/planning/followups.json` `dotln-generated`, without disabling its textual diff. The historical mutation check verifies the WO-042 transcript and summary against each other, confirms that the two recorded killing-test titles occur in package test source, and reports how far the executable subject has moved.

## Progressive polish

Three links in the closed WO-030 evidence table point at the moved files, with a dated note, and the table keeps its historical labels and counts. The work-order map's link to a retired input now names its commit and the receipt that carries its entries. Product 05's 5S section records this as the first launchpad Sort and Set in order.

## Evidence and compatibility

Application `v0.52.9` is a patch over `v0.52.8`. No package source, dependency, contract, gate step, control-event schema or edition changed. Criterion 4's diff-stat clause is unmet and waived by the operator: native `git diff --stat` does not show a custom attribute, and a diff-disabling attribute was ruled out. Independent verification failed once, on that clause and on three document-baseline exceptions that hid links the move had broken. It passed after the repair pointed the links at the moved files and removed the exceptions. The final review's gate passed 32 suites, 0 failed, in 569.08 s, on the code VER-002 judged.
