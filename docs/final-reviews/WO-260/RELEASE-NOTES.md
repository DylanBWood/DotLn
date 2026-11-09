## Release overview

For anyone running the kit on a host whose Git is older than 2.40, this release makes the kit run there. Since v0.121.0 the kit declared a Git floor of 2.40.0, and `node scripts/harness.mjs check`, `harness evidence` and every `npm test` selection refused an older Git before running anything. The floor is now Git 2.31.0, and the six Git forms the kit called that are newer than that version are replaced by forms Git 2.31.0 has, at each call site and with no version switch, so the code a Git 2.31.0 host runs is the code every gate here runs. Core gains a record of the Git forms the files under `scripts/` and `packages/` name, and a check that fails when a change adds one nobody has confirmed against the floor. It is a patch release with no instance action.

## Read before upgrading

`package.json` now reads `engines.git` `>=2.31.0` where it read `>=2.40.0`. A host on Git 2.31.0 through 2.39 is admitted by `harness check`, `harness evidence` and every `npm test` selection. A Git below 2.31.0 is still refused, with the floor and the version read; an instance that must run there lowers `engines.git` in its own `package.json`, the one place the floor is declared, and reports to core what failed.

No real Git 2.31.0 ran before this release. The host that built it holds none and denied the build from Git's source, so the evidence is a stand-in Git that reports that version and refuses or echoes the six forms as Git 2.31.0 does. Any other way Git 2.31.0 differs first shows on a host that runs it. A failure met there is a defect of this release's objective: report it with the command and Git's words.

Four recovery messages of `npm run worktree -- integrate` name different commands. Where a retained stash needed inspecting they named `git stash show --include-untracked --patch`, a Git 2.32 form; they now name `git stash show --patch` for the stash and, for its untracked files, `git show --patch` on the stash's third parent, written as the stash's id followed by `^3`.

An instance has nothing to do beyond its ordinary update. The surface check below runs in core only, so no instance gate changes, and an instance's own scripts are not judged by it.

For work in core: the structural phase has a seventh task, `git-surface`, between `generated` and `host`. A change under `scripts/` or `packages/` that names a Git subcommand, option or `GIT_*` variable the record lacks fails `npm test` with the form, its file and its line. Confirm the form against Git 2.31.0's manual, then run `node scripts/structural-checks.mjs git-surface --record` and review the record's diff; a form newer than the floor is scoped to the files that need it with the reason it is safe there.

## Substantive changes

Release close and the gates: the code identity at a committed revision reads that revision's attributes through a temporary index, where it used `git check-attr --source` (Git 2.40). A release close's classification no longer stops on an older Git. The identity is unchanged, and a Git that fails the classification for another reason still stops the close with Git's exit code and words, classed as the host's runtime.

Publication and target orders: an order's publish reads its own committed body, and a target order's record and planning reads check a committed entry's mode, through one tree-entry reader over `git ls-tree -z`, where each used `ls-tree --format` (Git 2.36). Each keeps the refusal it printed.

The host guard: the outside-write grant for the main checkout's intake reads `git worktree list --porcelain` without `-z` (Git 2.36). A main checkout path that holds a newline leaves the grant unresolved.

The stash prune: the prune and its drop read the reference backend from the repository's `extensions.refStorage`, where they asked `git rev-parse --show-ref-format`, which an older Git prints back.

Source-change admission: the integrity check runs `git fsck` with `--no-references` and, when Git exits 129 on that option, once without it.

The Git floor: `engines.git` is `>=2.31.0`. The floor rests on two forms Git 2.31.0 introduced that the scripts use, `git rev-parse --path-format` and configuration pairs set through the environment.

The recorded Git surface: `scripts/lib/git-surface.json` lists 474 forms the files under `scripts/` and `packages/` name, each confirmed against Git 2.31.0's manual or source, and 14 forms that are newer or are a test's own invention, admitted only in the files that need them with a reason. `node scripts/structural-checks.mjs git-surface` fails on a form the record lacks and on a record whose floor differs from `engines.git`; `--record` rewrites the forms from the tree and never moves a scoped form into them.

Fixtures and the authority probe: a fixture's Git reads only a home inside the fixture, on every supported Git, where the fixtures relied on `GIT_CONFIG_GLOBAL` (Git 2.32), which an older Git ignores. The authority probe's own Git, its payload's push and the Git children of the harness it launches are isolated the same way; the launched harness keeps the developer's home for its sign-in.

## Progressive polish

A test that read a symbolic reference with `git symbolic-ref --no-recurse` (Git 2.39) reads the loose reference instead. `@dotln/skeleton` moves to 0.90.0 with the console's pin and the lockfile; the harness manifest and the generated Claude hooks carry the new runtime snapshot; the feedback edition is re-minted from one live self-host episode, the authority edition carries by reference, and the console fixtures follow the new edition. A handoff in core consumes a structural row of the seven tasks core runs, and the lane measurement measures core's seven and an export's six. One target-release fixture case opts into the ignore line it had been getting from the developer's own Git configuration. The kit guide and product 07 carry the write-backs with their decision links.

## Evidence and compatibility

Planned tag `v0.122.1`, a patch above `v0.122.0`; release close writes the tag, the Release and its manifest at the merge commit of the reviewed branch. Component versions: `@dotln/skeleton` 0.90.0 with the console's pin moved; `@dotln/kernel` 0.8.0, `@dotln/compiler` 0.43.0 and `@dotln/console` 0.5.0 unchanged; no dependency added. Node engines `^24.15.0 || ^26.0.0` unchanged; `engines.git` `>=2.31.0`.

Verification: [VER-001](../../verifications/WO-260/VER-001.md) and [VER-002](../../verifications/WO-260/VER-002.md) each failed one criterion on a shell quoting shape that hid a newer option from the surface check, and each was repaired. [VER-003](../../verifications/WO-260/VER-003.md) passed all seven criteria. [FINAL-001](FINAL-001.md) passes on the complete review row at code identity `00cad38aa337787a27655fd20543fb4fe7eb4692ff1b0db51987e8027cf647c9` (46 suites, 122 tasks, all executed) with its own reproductions of each criterion.

Known limitations. No real Git 2.31.0 binary ran (WO-260-D013). The surface check reads source statically: arguments assembled at run time and the shell shapes the header of `scripts/lib/git-surface.mjs` lists are outside it, and whether an existing parser should read them is carried as FUP-d7ca8a89d9313a2b (WO-260-D027). A `GIT_*` name written as a shorthand property is not named, carried as FUP-0122789e67993b48 (WO-260-D037). The check lists `scripts/` and `packages/` and not the six script files the kit carries under `corpus/`, whose forms are at or below the floor today, carried as FUP-0c05d0b507dcd53f (WO-260-D039). On Git 2.48 and 2.49 the `fsck` fallback also checks the shared references, which its comment does not say, carried as FUP-7fe71f232887391b (WO-260-D040). `git -c core.fsmonitor=false` is a hook path before Git 2.36: by a reading of Git 2.31.0's source the hook fails and the refresh scans in full, at the cost of one process per refresh, and no run has confirmed it (WO-260-D013).

Deeper notes: [the order](../../work-orders/WO-260-the-kit-runs-on-git-2-31.md), the [decisions](../../evidence/WO-260/decisions.md) and the executor's [handoff](../../evidence/WO-260/handoff.md).
