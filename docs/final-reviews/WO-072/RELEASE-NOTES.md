## Release overview

This release gives a registered target repository a work-order lifecycle of its own. An operator who has registered a repository and recorded its local clone can start a work order against it, work in a worktree of that repository under the governed bundle, run the resume commands from there, and close the order when both branches have merged. The visible changes:
- `worktree start` for an order that declares a registered repository creates the target's worktree at the declared base commit under the configured parent and the launchpad's order worktree beside it, emits the target-worker bundle as ignored files, echoes the repository's authority profile and prints the launchpad command to run from the target.
- `status`, `next`, `verify` and `final-review` run from the target worktree select the order through the launchpad, by physical identity, and write every report in the launchpad.
- `release close` for a target order records `no-release`, removes the target bundle, worktree and merged branch after proving containment, then closes the launchpad worktree, and creates no tag in either repository.
- A new `worktree clone` action, given the repository id and the clone's absolute path, records where a registered repository lives on this machine.

The release is for operators running the three-repository route, where DotLn governs work in a repository other than itself, and for the orders that build on it (WO-082 and the pilot).

## Read before upgrading

- **New ignored local state.** The main launchpad's control-local directory gains `repository-clones.json` (the clone map), `target-worktrees.json` (the target registry) and `target-starts.json` (pending-start receipts); the order launchpad holds its own registry copy. All are ignored, written atomically, and never enter a control event, the work-order index or a target commit. Nothing migrates.
- **Selection changes only where targets exist.** A launchpad whose configuration declares `repositories`, or that holds a target registry, now selects an order from a foreign directory only through that registry. From an unregistered directory it selects no order and says so, and `status --json` exits 1 with the sentence on stderr. Earlier, such a launchpad selected its branch order from any directory. A launchpad with neither declarations nor registry, including this repository today, behaves as before.
- **Refusals before creation.** `worktree start` for a target refuses before `git worktree add` when the id has no clone recorded, the clone is not a Git top level, the parent or clone is spelled other than the filesystem's identity, the planned target and launchpad paths overlap or differ only by letter case, or the order is an umbrella record. Each refusal leaves no worktree, branch or registry entry.
- **Preparation is retried, never cleaned up.** When bootstrap or the bundle emit fails after the worktrees exist, the start is preserved and the same command resumes it. Nothing deletes a target worktree or branch on failure.
- **Close refuses conservatively.** A target close refuses when the target branch is not merged into the declared base, when tracked files are dirty, when the target writer is not proven released, and when the worktree holds ignored material outside the bundle manifest. In the last case the refusal lists every ignored file and names no remedy; plain `git worktree remove` would remove that worktree. Remove or move the listed paths by hand and rerun the close ([D010](../../evidence/WO-072/decisions.md#wo-072-d010--final-review-pass-final-001-board-the-target-closes-ignored-material-refusal-which-lists-every-file-and-names-no-remedy), FUP-00b15d92d53011b2).
- **Host requirements.** Selection and creation read the physical directory through `/bin/pwd -P`. The execution evidence is from one case-insensitive macOS volume; no Linux or case-sensitive run is claimed.
- **Component versions.** Application v0.75.0 is a minor release over v0.74.3. No component package version changes, and no dependency is added.

## Substantive changes

**Target start.** `targetStartPlan` resolves the clone and parent from the ignored clone map and the registered `worktreeParent`, requiring each to be its own physical spelling, and plans the target path as the clone's basename plus `-woNNN` under the parent and the launchpad order worktree as today. Before either worktree is created, the start writes a pending receipt binding the pair, the base commits and the order's bytes. It then creates the target worktree on `wo-NNN` at the declared base, the launchpad worktree on `wo-NNN` at `origin/main`, activates the order in the launchpad, runs the launchpad's bootstrap, emits the target-worker bundle with the main launchpad's pinned runtime, checks it, records the target in both registries and clears the receipt. A retry validates the receipt against the current authority and paths, accepts only a worktree whose branch, top level and base ancestry match, and resumes preparation without a second activation.

**Selection from a target.** `resume` compares the physical identity of the working directory's Git top level with the launchpad's. When they differ and the launchpad has repository declarations or a target registry, the registry entry for the top level, bound to this launchpad's physical identity, supplies the order, and the target branch must be that order's `wo-NNN`. An explicit `--work-order` that differs refuses. `usage`, `times`, `activate` and `status --all` are unaffected.

**Target close.** `release close` reads the merged control state's repository identity, requires the order closed, records `no-release` and skips version, surface and tag handling. With `--publish` or `--dry-run` it proves the target branch an ancestor of the declared base, takes the target writer lock, checks the bundle it owns, refuses foreign ignored material, removes the bundle and the worktree, deletes the merged branch, forgets the registry entries and then finishes the launchpad worktree through the existing path. The retained close record carries the target cleanup row, and a repeated close reads it.

**Umbrella pre-check.** `worktree start` reads the order for an umbrella record before fetching and again after fast-forwarding `main`, before any `git worktree add`, for target and plain orders alike. This is the worktree half of FUP-bd3e66761dc301ed; the kit-seed half stays with its register row.

## Progressive polish

The real-Git `target-worktree` suite joins the product selection with its protection description. The `worktree` usage line names the `clone` action. The release-close summary prints a no-release line without a tag or GitHub Release field, and a target-cleanup line when one exists. Product 07 §Where the control plane finds its documents and §Workflow closeout and releases each gain one undated paragraph, and the playbook's implement step describes the target loop. Plain `worktree start` passes the new worktree to activation as `DOTLN_LAUNCHPAD` explicitly.

## Evidence and compatibility

Application `v0.75.0` is a minor release over `v0.74.3`, built from WO-072 on `main` at `0aee17a9`. Kernel, compiler, skeleton, console, beacons, browser-evidence and harness host versions are unchanged. No dependency is added. The order edits none of its named registered sources, so no edition re-mint or live feedback episode is owed, and both publication editions check current.

The verification sequence:
- [VER-001](../../verifications/WO-072/VER-001.md) failed. A launchpad spelled through a symlink or in another letter case selected no order where the base selected it, and `status --json` printed plain text with exit 0.
- [VER-002](../../verifications/WO-072/VER-002.md) passed the repair, which compares physical launchpad identity and makes the JSON form refuse, and boarded the target's no-selection sentence as a follow-up.
- [FINAL-001](FINAL-001.md) passed and boarded the ignored-material close refusal.

The executor's `npm test -- --review` at code identity `4c2df81b…` passed 35 suites with 87 fresh tasks in 1,448.560 s. The final review's gate at the same identity reused those tasks, ran `format` fresh and passed 35 of 35 in 6.24 s. `npm run test:docs` passes 35 of 35. The review's bounded run of the target-worktree suite passed 10 of 10 in 29.1 s with the case variants and the volume alias exercised. Main did not move during the order, so integration changed only documents.

Known limitations:
- Run from a target worktree with `main`'s own scripts and no `DOTLN_LAUNCHPAD`, the no-selection sentence calls a listed target unregistered and does not name the launchpad that selects it ([D008](../../evidence/WO-072/decisions.md#wo-072-d008--verification-pass-ver-001-f1-and-f2-repaired-the-targets-no-selection-message-is-a-follow-up), FUP-f82660a8edb23a4d).
- A target close that meets ignored material outside the bundle lists every file and names no remedy ([D010](../../evidence/WO-072/decisions.md#wo-072-d010--final-review-pass-final-001-board-the-target-closes-ignored-material-refusal-which-lists-every-file-and-names-no-remedy), FUP-00b15d92d53011b2).
- The start handoff ends with `codex` and `enter: resume: next` in a target that carries no role skill; how that phrase behaves there was not run.
- Without `--publish` or `--dry-run`, a target close records `no-release`, removes nothing and does not print the command to run next.
- Per-repository release policy stays open; a target order closes without a release.
- The fixtures ran on one case-insensitive macOS volume.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-072/decisions.md) and the [handoff](../../evidence/WO-072/handoff.md).
