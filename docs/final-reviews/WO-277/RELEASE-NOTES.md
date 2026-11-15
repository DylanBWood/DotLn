## Release overview

`v1.0.1` makes the starter's commands page, `docs/OPERATOR.md`, a page a person can set an instance up from. The starter's front page now sends a reader there first, and each of the page's seven steps opens with a paragraph that says what the step does, what to look for and what to do when it fails. The first step registers the private terms list before any session publishes. The page used to skip the list, so a first planning pass that followed it failed at its publish. The release changes documents and one seed: no code, no new refusal and no package version.

## Read before upgrading

- `docs/OPERATOR.md` is the place to start: the commands of each step, from a new instance to taking a release, with what to look for and what to do when one fails. `node scripts/launchpad.mjs commands` prints it before any install. It is a kit file, so every instance takes it with the update.
- The starter's front page names the page first. An instance whose front page is unchanged takes the new one in its update's merge; an instance whose front page is its own keeps it.
- The page puts the private terms list in its first step. An instance set up before this release that has no list registers one as step 1 says, with its own entries in place of the example's, before its next publish. Without a list the publish of a planning branch, of a kit update and of a target's change refuses, and an order's own publish goes on and prints that the files its branch changes were not screened.
- The release step now says how to keep this instance's side when taking an update: after the merge, `git checkout main -- <path>` for each file the preview lists as changed on both sides, `git rm <path>` where this instance deleted the file, and `git checkout main -- .claude/harness-manifest.json` when the merge stops on the harness manifest.
- Two histories the release step does not answer are resolved by hand before the emit. Where an earlier update reached this instance's `main` by a squash merge, a file only the starter changed is listed as changed on both sides, and the checkout above keeps the earlier update's bytes with nothing refusing. Keep the starter's bytes for such a file instead; the publish then refuses naming it, and `--take <path>` admits it, as the kit guide's Taking upstream updates says. Where this instance edited a kit file that the starter then changed, the merge stops on it and the page names no command for it: resolve it before going on, since the block's commit would otherwise conclude the merge with the conflict's markers in the file.

## Substantive changes

**The commands page.** The page is still generated from the kit guide's marked blocks, and its commands are the guide's own, byte for byte. Step 1 gains a second block, the three lines that register the private terms list, with what the host report and the harness check print and how to replace the example's entries. Step 2 says that `WO-001` is already the starter's one sequence entry and can run before the first planning pass, and what to do when the pass's publish refuses. Step 3 says what each phrase does and what `worktree start` prints for a carried and for an absent list. Step 4 says why the merge is a merge commit and that a stopped close is typed again. Step 5 says to run the update's lines one at a time, where to stop, and the three recoveries listed above. Steps 6 and 7 say what to ask a planning pass for when registering a repository and what an entry for core holds.

**The starter's front page and the guide's first paragraph.** Both send a person to the commands page before the kit guide. The guide's first paragraph says it is the reference the kit's roles and reviewers work from.

**What the guide says of an absent terms list.** The guide said an absent list refuses publication. It now says what each publish does: three refuse, and an order's own publish goes on unscreened and says so. The behavior is unchanged; the sentence is.

## Progressive polish

The roadmap's release table gains the `v1.0.0` row, and the sibling register records the starter's `v1.0.0` refresh.

## Evidence and compatibility

Planned tag `v1.0.1`, a patch above `v1.0.0`; release close writes the tag, the Release and its manifest at the merge commit of the reviewed branch, and refreshes the starter. Component versions are unchanged: `@dotln/beacons` 0.1.1, `@dotln/browser-evidence` 0.2.0, `@dotln/compiler` 0.44.0, `@dotln/console` 0.6.0, `@dotln/kernel` 0.8.0 and `@dotln/skeleton` 0.91.0. Node engines `^24.15.0 || ^26.0.0` and `engines.git` `>=2.31.0` are unchanged.

Verification: [VER-001](../../verifications/WO-277/VER-001.md) failed one criterion on an evidence file that held two home-directory paths, which the document gate refuses, and it was repaired with the release step's recovery for a deleted file. [VER-002](../../verifications/WO-277/VER-002.md) passed all four criteria. [FINAL-001](FINAL-001.md) passes on the complete review row at code identity `274d9bc7d57447f31227fc7a69cd769fb91065e4124205e4eb4bc2b389a4275e`, on the document gate at its final tree, and on its own reproductions of each criterion in this checkout and in a fresh export.

Known limitations. Whether each paragraph serves a person is the operator's reading, taken at the pull request; no first-time reader followed the page, nothing was published live and no managed machine ran it. The release step's two unanswered histories above are reproduced in [a recorded probe](../../evidence/WO-277/final-001/update-recovery-gaps.json) and carried as FUP-be21bcb82ee48a3a. A file an instance renamed and the starter then changed is seen by neither the preview nor the publish, and the release step's recovery meets two no-match errors for its old path (FUP-ed709688ea483bd1). The route for the harness manifest stays on the page until the update's emit is repaired (FUP-5621408816545b95). An order's own publish does not refuse without a terms list (FUP-493a210c3658ce32). The page has no regression case of its own (FUP-d088964c0f58f42e).

Deeper notes: [the order](../../work-orders/WO-277-the-starters-commands-page-tells-a-person-every-step.md), the [decisions](../../evidence/WO-277/decisions.md), the executor's [handoff](../../evidence/WO-277/handoff.md) and [the page](../../OPERATOR.md).
