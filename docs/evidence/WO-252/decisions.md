# WO-252 decisions

## WO-252-D001

```json
{
  "id": "WO-252-D001",
  "date": "2026-11-02",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.112.0, the next minor above the observed release baseline v0.111.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.111.0 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-252-release-close-owns-what-the-kit-wrote.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-252-D002

<!-- integration refs/dotln/checkpoint/WO-252/2 -->

```json
{
  "id": "WO-252-D002",
  "date": "2026-11-02",
  "dispatch": "resume: next; worktree integrate WO-252, on the operator's direction during this dispatch",
  "decision": "Integrate main at b9e843b6 into this worktree before the review ladder and the complete run, at the operator's word 'integrate latest main'. The upstream took in WO-248 (v0.111.1, the pull-request process table), which touches release.mjs's two pull-request meter calls, test-process-debt.mjs, test-release.sh, test-runner.mjs and product 07, none of them at the lines this order changes; the merge had no authored conflict and v0.112.0 stays this order's target, since WO-248 took a patch version. No claim of this order had been judged before the integration, so none is carried forward: every criterion is judged at the integrated identity by this order's own checks and its one complete run.",
  "evidence": [
    "refs/dotln/checkpoint/WO-252/2",
    "base e6aaeeccfca2441712cce6c0ed5578de7e04390b",
    "upstream b9e843b6978e057d6794b9d0a76af557e9547ba0",
    "release preparation: WO-252 target v0.112.0 remains current. Files changed: docs/evidence/WO-252/meta.json. Meter snapshot: docs/evidence/WO-252/meta.json, 4156 bytes. Tag observation: local snapshot only.",
    "The operator's words during this dispatch: 'integrate latest main'.",
    "git diff --name-only e6aaeecc b9e843b6: release.mjs (renderMetaTable now takes the order), test-process-debt.mjs, test-release.sh, test-runner.mjs and product 07 among this order's files; none of contributor.ts, temporary-root-records.mjs, packages/skeleton/package.json or the role oracles, so the skeleton bump and the role oracle this order mints both stand on main's."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or drop a stash before application completes",
      "reason": "Both histories and unfinished recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-11-02. Original base: `e6aaeeccfca2441712cce6c0ed5578de7e04390b`.
Fetched main: `b9e843b6978e057d6794b9d0a76af557e9547ba0`. Checkpoint: `refs/dotln/checkpoint/WO-252/2`.
Named stash dropped after completed application: `15d954d2317467cefbd369055021fa0425a125b6` (WO-252 integrate 2026-11-02).
Resolved projections: README.md, docs/control/current.md, docs/work-orders/README.md.
Release preparation: WO-252 target v0.112.0 remains current. Files changed: docs/evidence/WO-252/meta.json. Meter snapshot: docs/evidence/WO-252/meta.json, 4156 bytes. Tag observation: local snapshot only.
Carried-forward claims: none; no criterion of this order had been judged before the integration, and each is judged at the integrated identity.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-252-D003

```json
{
  "id": "WO-252-D003",
  "date": "2026-11-02",
  "dispatch": "resume: next; the operator's message during this dispatch",
  "decision": "Run this order's review ladder on Codex: each round launches through the kit helper, npm run worker -- review --kind criteria|design|consistency|combined --host codex --order WO-252 --round N, with --recheck <report> for a recheck and --since <tree> for a last combined round, instead of Claude dotln-worker agents. Each launch counts one use against subagentCap; the rounds, the three briefs, the admission rule and the reviews lane are unchanged.",
  "evidence": [
    "The operator's words during this dispatch: 'use codex for your review agents'.",
    "The executor role text names npm run worker -- review --host codex as the route to a review worker on the other host and counts a kit launch as one use (WO-250)."
  ],
  "rejected": [
    {
      "option": "Claude dotln-worker reviewers, the role text's default",
      "reason": "The operator directed Codex for this order's review workers."
    }
  ],
  "reopenWhen": "The operator directs another host, or the helper cannot launch a Codex worker in this session, which the handoff then records with the launch's output."
}
```

## WO-252-D004

```json
{
  "id": "WO-252-D004",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 1, the glob forms",
  "decision": "A disposable entry may carry two wildcard forms: `**` as a whole segment matches any number of segments, and `*` matches any characters within one segment, a leading dot included. The registration refuses an entry whose last segment is wholly wildcards, naming the floor that keeps a declaration from naming every ignored file (`*`, `**`, `**/*`, `libs/**`, `libs/*/**`), and an entry that puts `**` inside a segment; `**/*.tsbuildinfo` and `**/node_modules` are admitted, and literal entries keep their meaning. A listed path lies under an entry when a leading run of its segments matches the whole entry; the shortest such run is the match's root (disposableMatchRoot), so a node_modules nested inside a matched one is part of it. The close takes matched roots from the ignored listing it already holds (disposableRoots), inspects each as a declared path was inspected, refusing a link on the way to one and naming the pattern that matched it, deletes the listed files and prunes each root; a literal entry is still inspected and pruned whether or not a file lies under it. The record keeps a literal entry's row as { path, files } and gives a pattern's row its matches, each matched root with its file count. A refusal's named directory never covers declared output, so an undeclared file beside matched output is named by the outermost directory that holds only undeclared material; the refusal's wording is unchanged.",
  "evidence": [
    "scripts/lib/config.mjs validateDisposablePaths; scripts/lib/target-worktree-close.mjs disposableMatchRoot, disposableRoots, disposableRows, inspectDisposable and deleteDisposable.",
    "scripts/test-configuration-root.mjs: the five floor refusals and two in-segment refusals name their entry; the admitted set sorts **/*.tsbuildinfo, **/node_modules, libs/*/dist beside the literal entries.",
    "scripts/test-target-worktree-close.mjs: **/node_modules closes sixteen nested Vite and Vitest caches and the root's node_modules on the first attempt, the record listing seventeen matches with one file each; libs/*/dist refuses an ignored libs/a/src/dist naming libs/a/src/ and leaves libs/a/dist until the remedy, then deletes libs/a/dist; a link at libs/c/node_modules refuses as 'declared root libs/c/node_modules (matched by **/node_modules) has a symlinked component' with the outside directory untouched.",
    "A first fixture run named libs/ for the undeclared file because Git's --directory listing collapsed a wholly untracked libs/ that also held declared output; the named directory now excludes declared output, as it already excluded installed files."
  ],
  "traps": [
    "A pattern that silently matched across segments would delete libs/a/src/dist; the segment rule and its refusal case pin `*` to one segment.",
    "A pattern walked on disk instead of matched on the listing would cost a traversal of every cache; the listing the close holds is the only input."
  ],
  "rejected": [
    {
      "option": "A regular expression",
      "reason": "The order's axis: a path language the operator reads without a manual."
    },
    {
      "option": "A built-in default deleting nested node_modules everywhere",
      "reason": "An undeclared deletion is what the close exists to refuse; one class line carries it for every registration."
    },
    {
      "option": "Naming a common ancestor that also holds declared output in the refusal",
      "reason": "Its remedy would tell the operator to remove or declare regenerable output the close removes itself."
    }
  ],
  "reopenWhen": "An operator needs a third form, a close record shows a match the segment rule misread, or a refusal names a directory that holds declared output or the kit's residue."
}
```

## WO-252-D005

```json
{
  "id": "WO-252-D005",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 2, the kit's residue in a target",
  "decision": "A target close names the kit's own writes in the target before either judgment and refuses none of them: what retainWorktreeJournals would move from the target's fixed harness lane docs/control/local/harness/ (session journals and logs, session states and sidecars, the gate index, suite-success/ and deadlines/) and the order's reviews lane docs/control/local/reviews/<WO>/; a writer directory the writer protocol proves released (no writer.json, an empty writer/); the regular file .runtime/.metadata_never_index; the files of a .runtime/harness/<16 hex> snapshot that a serving launchpad runtime would install, proven as below; and the temporary-root ledger's .runtime/temporary-roots/roots/<uuid>.jsonl segments. closeClean and the undeclared-material judgment both exclude exactly those listed paths, and any other file under the lane or .runtime/ is judged as before. A held writer still stops the close as writer-held before any judgment or deletion. After the judgment passes the journals move first, into main's retained lane for the order beside the launchpad worktree's journals, merged as a retried close merges; then the released writer, the marker, the snapshot and the ledger are deleted, then declared output, the bundle and the worktree. Only the listed files go: a snapshot directory loses the untracked and ignored files the listing named and the directories they leave empty, so a tracked file there stays, and a listed directory under it, such as an untracked nested repository, is judged like any other path (the criteria review's round 1 F1). Each kind proves its ownership by content, never by its name alone (the criteria recheck's F1): a snapshot file is the kit's only where the snapshot the launchpad runtime the target's hooks load, or main's runtime, would install carries that directory's content-addressed name and lists the file's path with the same size and SHA-256, or the same package link, as computed from that runtime's own package source by the emit's inventory, never read from another snapshot directory (the combined review's round 3 F1: a same-named launchpad directory proved nothing, since an operator's note mirrored into both passed), so an operator's file placed in the snapshot's directory, an edited package file and a snapshot no serving runtime computes are refused as undeclared; the marker is the kit's only while empty, as markUnindexed writes it; and a ledger segment only while its first row carries the token its file name names. targetCleanup.residue records the journals' lane, files, bytes and outcome, each deleted path with its kind, files, bytes and outcome, and ledgerRoots, the number of roots the ledger registered. Those roots are carried into the record's ownedTemporaryRoots before the ledger is deleted, so the close's own prune judges them, and once the target is gone each is judged by its marker (D008). Deviation from the order's Cost text, which keeps the ledger 'only once every root it registers has been removed, else kept with the close's blocker naming the root': no blocker is raised for a root the ledger registers.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts ensureHarnessSessionScratch passes the session's own root as the temporary repository: a session run in the target registers its scratch, which lives under the system temporary directory and outside the target, in the target's ledger, and markUnindexed writes the target's .runtime/.metadata_never_index; that is the fork's residue.",
    "Session scratch keeps a 24-hour window, and a Codex session's end is not observed, so a root the target's ledger registers is usually retained at close time; a blocker would stop such closes for a day, refusing what the kit's own sessions wrote, against the objective.",
    "scripts/release.mjs finishPublishedWorktreeOperation already carries a launchpad worktree's bound roots into ownedTemporaryRoots and lets that worktree's ledger go with it; WO-237-D004 judges a root whose repository is gone by its marker.",
    "scripts/test-target-worktree-close.mjs: the fork-shaped close moves three journal files and deletes the released writer, the marker, the snapshot and the ledger, and its record names each and carries the registered scratch root; the refusal case names .env, .runtime/notes.txt, docs/control/local/notes.txt and the four snapshot-directory files below, nothing the kit wrote, and keeps every residue path, and a writer.json or a non-empty writer/ stops the close as writer-held with nothing moved.",
    "scripts/lib/target-worktree-close.mjs verifiedSnapshots and snapshotEntry: harnessInstallation({ runtimeRoot }) for entry.runtimeRoot and main, read only when the listing names a .runtime/harness/ path; measured at 53 to 71 ms per runtime root over 542 package files (this worktree and main, 2026-11-02).",
    "scripts/test-target-worktree-close.mjs: the refusal case mirrors a note beside the snapshot's packages, a note inside one and a package file under a snapshot name no runtime computes into main and the target, and edits one package file in the target; all four are named as undeclared and kept. With the earlier same-named-peer rule restored, the same case failed: the refusal named only the edited file among the four.",
    "scripts/test-target-worktree-close.mjs: the tracked-file case deletes a package file and a node_modules/@dotln link of the snapshot (files: 2) and keeps the tracked file in that directory."
  ],
  "traps": [
    "Deleting what the kit did not write: the residue is a closed list of paths, not the directories that hold them.",
    "Moving the journals after a later step could fail would delete residue first and lose the retry's merge; the move goes first and a failed move deletes nothing."
  ],
  "rejected": [
    {
      "option": "Keep the ledger and stop the close while a registered root remains",
      "reason": "The order's Cost text; it would refuse what the kit's sessions wrote for as long as their scratch is retained, while the launchpad close already carries such roots in its record."
    },
    {
      "option": "Deleting .runtime/ wholesale",
      "reason": "The order's axis: the directory name is the kit's convention, not the kit's property."
    },
    {
      "option": "Writing the paths to the clone's info/exclude",
      "reason": "The order's axis: exclude files are refused as deletion authority, and the journals would still be undeclared."
    },
    {
      "option": "Deleting the ledger without carrying its roots",
      "reason": "The close's prune would never judge them."
    },
    {
      "option": "Comparing a target snapshot file with the same path in a launchpad's same-named snapshot directory",
      "reason": "The combined review's round 3 F1: the directory is not verified, so a note mirrored into both passed as the kit's."
    },
    {
      "option": "Proving the target's snapshot directory by recomputing its name from its own contents",
      "reason": "The name depends on the runtime-file list of the version that installed it, which the close holds only for its own runtime; it would also refuse the whole snapshot for one stray file instead of naming that file."
    }
  ],
  "reopenWhen": "A target's ledger registers a root inside the target, a carried root is lost to every later prune, a target lane holds a kit file class the residue does not list, or a target close is refused for a snapshot an earlier runtime of a serving launchpad installed."
}
```

## WO-252-D006

```json
{
  "id": "WO-252-D006",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3, the blocker class and the children timings",
  "decision": "The close record gains blocker: { class, step, message }, null while an attempt completes. The class list lives in scripts/lib/release-steps.mjs (CLOSE_BLOCKER_CLASSES) and each refusal is classed where it is raised: closeBlocker(class, message) at the throw, or withBlockerClass(class, operation) around an operation all of whose refusals are of one class; a refusal that already names a class keeps it, and an unclassed one records other. withReleaseStep names the innermost step on a refusal it passes; each blocker row records its class and step; the attempt's blocker is the refusal that stopped it, or else its first unresolved blocker row. The finish and settle processes print 'Close blocker class: <class>' for their refusal, which the parent's blocker row takes. Classes: the target's undeclared ignored material and the finish's ignored material are undeclared-ignored-material; closeClean's refusal, a dirty main and the finish's dirty worktree are not-clean; a held or unreadable writer and a writer transition lock are writer-held; reconciliation, the preservation proof, the submodule refusal, unpreserved untracked material, a leftover's proof and a failed journal move are preservation-refused; an unreadable, unwritable, linked or undeletable declared root and the kit residue's deletion are declared-root-unreadable; the egress probe and the target order's reachability probe are host-denied; the target base fetch and the fetches of main are base-fetch; a tag of another order, object or annotation is foreign-tag; a starter refusal is starter-refresh; the surface check, the tag push and the GitHub Release calls are publication. The worktree-removal row gains children, rows on that step and not steps: base-fetch, disposable-deletion with files and bytes, finder-metadata, journal-retention, git-worktree-remove, branch-delete and preservation. The close times them with timeRemovalChild and addRemovalChild; the finish and settle processes time theirs and print one 'Removal timings:' line the parent adds. No child region contains a nested step or another child, so the children's sum stays within the row's durationMs, which keeps its meaning. A deletion is timed in a finally and counts each file as it goes, walking a listed directory such as a nested repository in sorted order without following links instead of removing it in one call, so a deletion that stops part way, inside a directory included, still records its time, files and bytes (the design review's F2 and the criteria review's F3, completed after both rechecks); the finish's shared validators carry their classes, so its preview pass refuses with the same class as its locked pass (the design review's F1); and a target release tag held elsewhere is foreign-tag, as the launchpad's own is (the criteria review's F4). The summary prints 'Close stopped: <class> in step <step>.'",
  "evidence": [
    "scripts/lib/release-steps.mjs; scripts/release.mjs record.blocker, the blocker rows and the 'Removal timings:' and 'Close blocker class:' lines; scripts/worktree.mjs timed and its exit path; scripts/lib/target-worktree-close.mjs and scripts/lib/worktree-removal.mjs at each refusal.",
    "scripts/test-release.sh: the success case's record has a null blocker and the seven children within the row's duration, base fetch, journal retention, Git's removal and preservation each above zero; the journal-failure case's record has blocker { class: preservation-refused, step: worktree-removal } with the EACCES message; the foreign-tag case prints 'Close stopped: foreign-tag in step publication.'",
    "scripts/test-target-worktree-close.mjs: the fork-shaped close's row holds the seven children within its durationMs; the refusal cases record undeclared-ignored-material, declared-root-unreadable and writer-held, each at worktree-removal."
  ],
  "rejected": [
    {
      "option": "Reading the class from the message text",
      "reason": "The order's axis: natural-language reading; the class is assigned where the refusal is raised."
    },
    {
      "option": "Children as steps",
      "reason": "withReleaseStep admits only the seven names and subtracts nested time from the parent, so the step's own figure would shrink."
    },
    {
      "option": "An eighth child for the remainder",
      "reason": "The remainder is the row's duration less the children, the judgments and listings between them; a named row for unexplained time adds no information."
    }
  ],
  "reopenWhen": "A stopped close records other where a listed class applies, a record's children exceed its row, or WO-246 adds its bounded fetch, which takes base-fetch."
}
```

## WO-252-D007

```json
{
  "id": "WO-252-D007",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 4, the feed block",
  "decision": "plan failures reads each retained close attempt's blocker within the feed's window and adds localReleaseCloses.blockers: byClass, byOrder with otherOrderRows past the top six, and repeated, each class that stopped the closes of three or more distinct orders, with its order count; a successful close between them does not reset it. The plan start block carries closeBlockersRepeated only when a class repeats, so the block keeps its bound otherwise, and plan start prints each as 'close blocker repeated: <class> across N orders' from lines failuresAtStart hands it before fitting the block, so a block that overruns its bound and drops them still has every line printed (the consistency review's F2 and the criteria review's F2: eleven repeated classes overrun the bound). An attempt recorded before this field carries no blocker and counts in no class.",
  "evidence": [
    "scripts/lib/plan-failures.mjs closeBlockers and repeatedCloseBlockerLines; scripts/refute-plan.mjs start.",
    "scripts/test-process-debt.mjs: three orders each stopped once by undeclared-ignored-material with a successful close between two of them, and one order stopped by writer-held; plan failures counts them by class and by order and names the first as repeated across three orders; plan start prints the line and the start block carries it."
  ],
  "rejected": [
    {
      "option": "Classing older attempts from their reasons",
      "reason": "The order's axis: no class is read from message text, and an invented class would count a refusal nobody classed."
    }
  ],
  "reopenWhen": "A planning pass needs blocker counts by step, or the start block overruns its bound with the line."
}
```

## WO-252-D008

```json
{
  "id": "WO-252-D008",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 5, the orphan's second proof and the four recovery repairs",
  "decision": "writeTemporaryOwner re-stamps a renumbered device where the owner repository is gone on the marker's word: the marker inside the directory must carry the record's token, beside the inode it already compares; where the owner repository exists, the ledger binding WO-237 built is still required. The four interrupted-removal cases WO-237-D013 boarded are repaired. A child left at its own aside inside a parent's aside binds through the parent's registration (ledgerBinding compares the relocated place with the child's own aside). A child finished from a parent's aside records its moving and removed rows under its own registration (removeVerifiedTemporaryRoot), so the registration ends and its segment leaves with it. A segment waits while its own latest place aside exists, wherever the removal recorded it, and while its root, or its own aside, may sit inside the aside of an absent ancestor, found on disk whichever repository's ledger recorded that move (retireTemporaryLedger, heldByAncestorAside). The empty directory a removal leaves under its token's aside name after deleting the owner record and before rmdir is a removal-remains candidate, removed with rmdir after an inode check and ended in the judging repository's ledger, while an unmarked aside that holds anything stays retained. The token-and-inode refusal, the ledger binding for a present repository and every payload-retention boundary stay.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-237/verification-recovery-probes.mjs: all four probes report reproduced false, each failing on its own defect assertion (the contradiction is null, no removed row remains at the relocated path, the aside is no longer retained, the child's segment survives retirement).",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-237/final-review-probes.mjs: repositoryGoneAndRenumbered reads candidate and restamped true, where FINAL-001 F1 read the device-changed refusal; the bound root with its repository present is re-stamped as before.",
    "scripts/test-temporary-roots.mjs: an orphan with a renumbered device is a candidate, re-stamped with its inode and token unchanged and removed by pruneHarness apply, while a copied marker on a new inode stays refused with its payload; the four regressions each keep their payload assertions; all 76 cases pass under the bounded wrapper; scripts/test-fixture-temp-root.sh passes."
  ],
  "traps": [
    "WO-237-D004's copied-marker trap: a directory on another volume whose inode happens to match a copied marker. The marker proof is admitted only where no owner repository exists to hold a ledger; kit copies exclude markers and seeds keep them out of Git, so such a coincidence also needs a hand copy of a marker into a directory whose owner checkout is gone.",
    "WO-237-D004 rejected recognizing the aside name in legacy backfill because a failed restore could strand a replacement under that name; removal-remains admits only an empty directory and removes it with rmdir, so nothing a stranded replacement held can be deleted."
  ],
  "rejected": [
    {
      "option": "Deleting on the token alone",
      "reason": "The order's axis: WO-237-D004's inode rule."
    },
    {
      "option": "Carrying a closing worktree's registrations into main's ledger",
      "reason": "WO-237-D015's alternative; ledgerBinding reads the owner repository's ledger, so main's would bind nothing for a root another checkout owns."
    },
    {
      "option": "Listing a child's recorded aside as a top-level root",
      "reason": "The parent's aside already lists it as a nested root, and a nested candidate is removed with its top-level parent."
    }
  ],
  "reopenWhen": "A reproduced recovery case deletes a payload that should be retained, a re-stamp is observed on a directory whose inode changed, or a root a removal moved aside is found that no prune lists."
}
```

## WO-252-D009

```json
{
  "id": "WO-252-D009",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 6, the role text",
  "decision": "Every role but the router gains one sentence among the shared corrections: when expired or retained temporary roots need removing, the session runs node scripts/harness.mjs prune --apply itself under host permissions and records its receipt, handing the operator the printed command only after a recorded host denial of that exact command, the fallback release close keeps for its publish. The router writes nothing and runs no prune, so it carries no shared correction. The release-close sentence on disposable output gains the two glob forms with the last-segment floor, the close moving or deleting the kit's own residue in the target, and the remedy for undeclared output: declare it, or remove it from this launchpad session by the target's path, never by a session or writer in the target. packages/skeleton/fixtures/wo252-role-baseline.json pins every role at both economy settings over the WO-250 oracle, which stays byte-exact. Measured by the gate-followups rule (the source CLAUDE.md with its harness block replaced by the projected block, plus each projected skill), each root but the router grows by the common sentence's 302 bytes and release-close by 699: executor 41,987 (from 41,685), verifier 36,711 (36,409), planner 27,664 (27,362), reviewer 39,134 (38,832), refuter 25,815 (25,513), release-close 26,590 (25,891), router 16,379 unchanged. Release-close now passes its effective ceiling of 26,410, and the executor's, verifier's and planner's overruns over 40,194, 35,221 and 24,576 grow; under product 07's one route for cold-start ceilings the reviewed rules stay whole and the overruns are boarded below, with no ceiling raised and no acceptance recorded. The reviewer stays within 39,600 and the router within 16,384. FUP-2c6f5a9f24ed56e1's reopening condition, another reviewed rule changing the measured overrun, has occurred; it is marked a duplicate of this decision's follow-up, which carries all four roots.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts sharedCorrections and disposableOutput; npm run sync regenerated the harness bundle and manifest.",
    "The measurement script applied test-gate-followups.mjs's rule to the regenerated bundle on the integrated tree, with the same figures before and after the integration.",
    "docs/control/budgets.json effective ceilings: executor 40,194, verifier 35,221, reviewer 39,600, release-close 26,410 (the latest acceptances), planner 24,576, refuter none, router 16,384; product 07 §Discipline's one route boards a breach as a follow-up."
  ],
  "rejected": [
    {
      "option": "A new phrase or skill for the prune",
      "reason": "The order's axis: a phrase the operator types is still the operator doing it; the role runs the command."
    },
    {
      "option": "Raising the release-close ceiling or recording an acceptance",
      "reason": "Product 07 retired that route; a breach is boarded for optimization with equivalent usefulness."
    },
    {
      "option": "Trimming the new sentences to fit",
      "reason": "No needed rule is cut to fit a ceiling."
    }
  ],
  "followup": "Optimize the installed cold starts of the executor, verifier, planner and release-close roots with equivalent usefulness. With the review ladder, the counting rule, the change review helper's route and the common prune sentence every root but the router carries, and the release-close root's glob, residue and remedy clause, the executor reads 41,987 bytes against its effective 40,194, the verifier 36,711 against 35,221, the planner 27,664 against 24,576 and release-close 26,590 against 26,410, measured by the gate-followups rule, with no ceiling raised, no acceptance recorded and no duty cut.",
  "reopenWhen": "A planning allocation can verify equivalent usefulness while reducing those cold starts below their unchanged ceilings, or another reviewed rule changes the measured overrun."
}
```

## WO-252-D010

```json
{
  "id": "WO-252-D010",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 8, the target close's printed handoff",
  "decision": "Once an attempt completes with no blocker and the target worktree removed, or a dry run would remove it, a target close's summary prints two lines (targetCloseHandoffLines in scripts/lib/release-close-handoff.mjs); a stopped close, even one whose tag is already pushed, hands back neither (the consistency review's F3): 'Target <id> published tag: <tag>.' with the tag the close published or found current, or 'none (no-release policy)', or 'none (<outcome>; <tag>)' for a declared release that has not published, and 'Target <id> reviewed commit: <commit>.' naming the passing final review's targetSubject.commit, which the close reads from the order's folded control state at the merged revision, because the status projection omits it, before any publication step, and records as publication.target.reviewedCommit; an unreadable state reads unknown. Writing the registering launchpad's instance profile is declined: a profile is an instance-owned standing document, and a generated block in it is a kit template change every instance's profile would need.",
  "evidence": [
    "scripts/test-target-worktree-release.mjs: the declared release's publishing close prints 'Target target published tag: v0.1.0.' and the reviewed commit the target held after its final review, and the record's target row carries it; scripts/test-target-worktree-close.mjs: the no-release close prints 'none (no-release policy)' and its reviewed commit.",
    "The order's design bullet 'The profile rows stay the instance's' (the fork's item 8)."
  ],
  "rejected": [
    {
      "option": "Writing the instance profile's reviewed source and latest release",
      "reason": "The order's decline: instance-owned text, and a template change for every instance."
    },
    {
      "option": "Reading the reviewed commit from the status projection",
      "reason": "The projection carries no targetSubject; a first run printed unknown."
    }
  ],
  "reopenWhen": "A second instance asks for the profile rows, or the fork's pass measures the copy as a cost."
}
```

## WO-252-D011

```json
{
  "id": "WO-252-D011",
  "date": "2026-11-02",
  "dispatch": "resume: next; release preparation",
  "decision": "Bump @dotln/skeleton from 0.79.0 to 0.80.0, a minor change under 0.x for new exports (temporaryRemovalRemains and removeTemporaryRemovalRemains) and changed behavior in temporary-root-records.mjs and the role text, with its pins in package-lock.json and packages/console/package.json; no other component's sources changed, so no other version moves, and the console's own version stays as WO-250 left a pin-only change.",
  "evidence": [
    "npm run sync's release-surfaces check: 'FAIL component-version @dotln/skeleton: src changed; observed 0.79.0; previous v0.111.0 0.79.0; expected a different version', every other component 'src unchanged'.",
    "bf72ae10 (WO-250) bumped the skeleton by one minor version and moved only the console's pin."
  ],
  "rejected": [
    {
      "option": "A patch bump",
      "reason": "The skeleton gains exports and changes what a prune removes; the kit's practice gives such orders a minor."
    }
  ],
  "reopenWhen": "Main publishes 0.80.0 for another order before this one closes, which integration retimes as bookkeeping."
}
```

## WO-252-D012

```json
{
  "id": "WO-252-D012",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 9, the measurements",
  "decision": "Record the measurements the order asks for. A close record's worktree-removal row before this order held only its durationMs; on the fork-shaped fixture, which the base refuses on its first attempt for the nested caches and the kit's residue, the row now reads 1,454.5 ms with base-fetch 200.5, disposable-deletion 5.3 (20 files), finder-metadata 4.5, journal-retention 13.1, git-worktree-remove 69.1, branch-delete 18.7 and preservation 90.2, the rest of the step being the two closes' judgments and listings. The judgment cost on a listing of the fork's 42,340 files under seventeen node_modules roots (best of five, under the bounded wrapper): the base's prefix test over seventeen literal entries 30.7 ms, this order's matcher over the same literal entries 48.3 ms, one **/node_modules pattern 15.4 ms, and the residue's per-path tests 1.1 ms; each is milliseconds against the fork's 58 s to 3 min 28 s steps. Each root's bytes are in D009. The target-worktree suite's duration before and after is recorded at handoff from the gate rows of this order's preflight and complete run.",
  "evidence": [
    "scripts/test-target-worktree-close.mjs's fork-shaped case prints its row as a test diagnostic.",
    "A scratch benchmark imported disposableMatchRoot from this tree over 42,340 synthetic paths shaped libs/project-N/node_modules/.vite/deps/chunk-K.js and node_modules/.vite/deps/chunk-K.js."
  ],
  "rejected": [
    {
      "option": "Running the fork-shaped fixture on the base for a before timing",
      "reason": "The base refuses that fixture's first attempt, which is the defect; its row has no parts to compare."
    }
  ],
  "reopenWhen": "A close record shows a child above a second on the fixture, or the matcher measures above the base's prefix test on a listing of the fork's size."
}
```

## WO-252-D013

```json
{
  "id": "WO-252-D013",
  "date": "2026-11-02",
  "dispatch": "resume: next; step 3, the record fields, adjacent defect",
  "decision": "Record and board a defect the blocker field exposed, with its observed limit. When release close runs the subject's own helper from main, the bootstrap path test-release.sh's success case takes, the close-scope prune that follows the worktree removal imports scripts/lib/harness-prune.mjs, which in turn loads packages/skeleton/dist/src/harness-host.js, from the worktree the finish has just removed, so that attempt records a prune blocker (class other, step worktree-removal, 'Cannot find module …') and its cleanup reads blocked; a retry through main's helper prunes and records no blocker. Loading the prune module before the removal only moves the failure to the harness host module, so the repair is to run the post-removal prune from main's runtime, which takes more than a bounded change in this order. The success case asserts the null blocker on main's retry and keeps the step children's assertions on the bootstrap attempt.",
  "evidence": [
    "bash scripts/test-release.sh --case success under the bounded wrapper: with a null-blocker assertion on the bootstrap attempt, the record read { class: 'other', step: 'worktree-removal', message: \"Cannot find module '…/project-wo099/scripts/lib/harness-prune.mjs' imported from …/project-wo099/scripts/release.mjs\" }.",
    "With the import loaded before the removal (tried and reverted), the same assertion read \"Cannot find module '…/project-wo099/packages/skeleton/dist/src/harness-host.js' imported from …/project-wo099/scripts/lib/harness-prune.mjs\".",
    "The case passes with the assertion on main's retry, whose attempt records blocker null."
  ],
  "rejected": [
    {
      "option": "Load the prune module before the worktree removal",
      "reason": "Its own runtime import from the removed tree fails next; a partial load adds code without removing the blocker."
    },
    {
      "option": "Assert a null blocker on the bootstrap attempt",
      "reason": "It would fail on the defect this decision boards; the retry through main's helper is the path that completes."
    }
  ],
  "followup": "Run release close's post-removal prune from main's runtime when the helper runs from the subject worktree it removes (the bootstrap path), so a bootstrap close records no prune blocker for modules its own removal deleted. Paths: scripts/release.mjs finishPublishedWorktreeOperation, scripts/lib/harness-prune.mjs, scripts/lib/temporary-prune.mjs.",
  "reopenWhen": "A bootstrap close's prune blocker is the only blocker left on a published release that nobody retries, or an order takes the follow-up."
}
```

## WO-252-D014

```json
{
  "id": "WO-252-D014",
  "date": "2026-11-03",
  "dispatch": "resume: next; the repair after the first complete run failed",
  "decision": "The first complete run, npm test -- --review over tree 17247f42 from 2026-11-03T00:07:04Z, stopped after 18 s at the configuration-root structural preflight: test-configuration-root.mjs's rule that no control-plane script keeps a literal document root named the residue judgment's writer path, residueWriter in scripts/lib/target-worktree-close.mjs (D005); format passed, and every other required suite was skipped behind that preflight, each counted failed. The focused probes before it ran only that suite's disposable-path cases, not the whole file. The writer's path is now derived from dispatchJournalDirectory, the fixed harness lane the hooks write and writerTeardownBlocker reads, joined with writer, so the close names the same relative directory and the residue rows keep their path. The repair's diff is four changed source lines in one file, under the fifty-line threshold, so its ladder starts at round three: one combined Codex worker over the change since the failed run's tree, which the gate row records as a hash only and which was rebuilt in a temporary index, the real index and working files untouched, and matched to that hash.",
  "evidence": [
    "The gate row for npm test: treeHash 17247f4204450642e9d0e0f0c8e3f48e09bd1506, exitCode 1, gateSelection review, recordedAt 2026-11-03T00:07:23.028Z; its summary read 'npm test: 1 passed; 43 failed', configuration-root failing first with 'resolve these through scripts/lib/config.mjs: scripts/lib/target-worktree-close.mjs: \"docs/control/local/harness/writer\"' and each later suite reporting the failed structural preflight.",
    "node --test scripts/test-configuration-root.mjs under the bounded wrapper after the repair: 25 tests, 25 passed.",
    "The tree rebuilt from the working tree with the repair's lines restored, in a temporary GIT_INDEX_FILE: 17247f4204450642e9d0e0f0c8e3f48e09bd1506, equal to the gate row; git diff --numstat from it to the repaired tree: 3 added and 1 removed in scripts/lib/target-worktree-close.mjs.",
    "packages/skeleton/src/dispatch-journal.mjs dispatchJournalDirectory and packages/skeleton/src/writer-teardown.mjs writerTeardownBlocker both resolve the lane as docs/control/local/harness under the root they are given."
  ],
  "rejected": [
    {
      "option": "Resolve the writer through docPath(target, \"control\", ...)",
      "reason": "The hooks and the writer teardown use the fixed lane, not a configured control root, so a target with a configured root would name a directory no writer uses."
    },
    {
      "option": "Exempt the close module from the structural rule",
      "reason": "It would weaken the guard the rule exists for, for a path the fixed lane's own helper already names."
    }
  ],
  "reopenWhen": "The writer protocol moves its directory out of the fixed harness lane, or the dispatch journal directory becomes configurable."
}
```

## WO-252-D015

```json
{
  "id": "WO-252-D015",
  "date": "2026-11-03",
  "dispatch": "resume: verify",
  "decision": "Independently judge all nine original criteria without changing the implementation. Consume the executor complete review row at code identity eca05d352fd2c90cd322749640cd65606995e23bd77eaa588562d32fc0cd90be, which gateCheckStands reports current, and reproduce the changed paths through bounded probes. No worker is needed: every named claim can be exercised in this session. The session readback is Codex CLI 0.166.0, gpt-6-astra, selected effort max; preserve that actual selection and report it, rather than claiming the recommended xhigh. No hard dollar-cap control is available in this transport.",
  "evidence": [
    "The verify dispatch allocated docs/verifications/WO-252/VER-001.md; current code identity equals the executor review row recorded 2026-11-03T00:55:58.273Z, exit 0, gateSelection review, gateCheckStands true.",
    "docs/evidence/WO-252/verification-probes.mjs varies glob depth, punctuation and Unicode, emits complete runtime snapshots with the production installer, and checks all fourteen generated role roots.",
    "Read the order, its cited implementation and product sections, WO-237-D009/D013/D015 and the recovery script, all eight executor review reports, their dispositions and the full changed implementation. The cited ignored nomination is single-copy in main; its item 3 corroborates the public synthesis and is not copied here."
  ],
  "processFailure": "The initial unfiltered status and several oversized source batches were truncated; after continuation this recurred on status and a log tail containing a nested structural result. The disposition is bounded section reads and JSON field selection before emission, retaining full gate, status and probe captures in session scratch. verification-results.json contains only selected test names, diagnostic objects and bounded completion fields. Truncated tails are not evidence for a verdict; generated and oversized outputs are judged by their consumers and generation checks. The nomination path is absent from this worktree and was read at the main worktree selected by git worktree list.",
  "traps": [
    "A passing executor fixture is not proof for an omitted runtime-update state: use complete production-emitted snapshots and a current-snapshot control.",
    "A defensive ownership check must retain foreign files while still recognizing legitimate kit residue; do not recommend directory-name deletion.",
    "The executor decision to exclude a role is not an amendment of an all-roots acceptance criterion; inspect the emitted roots and preserve the router authority boundary.",
    "Repeated full gates would consume work without changing the subject: use the current complete review row and focused reproductions, then one document gate after the final record edit."
  ],
  "rejected": [
    {
      "option": "NoOp: endorse the executor handoff without independent probes",
      "reason": "The verification role owes an independent attack, implementation review and reproduction of the claims that support its verdict."
    },
    {
      "option": "Repair the implementation while verifying it",
      "reason": "This phase is read-only for implementation; route failures to the next executor repair."
    }
  ],
  "reopenWhen": "A source change moves the code identity, a required probe cannot run here, or the operator changes the scope."
}
```

## WO-252-D016

```json
{
  "id": "WO-252-D016",
  "date": "2026-11-03",
  "dispatch": "resume: verify; criterion 2",
  "decision": "Record VER-001 F1 as blocking criterion 2. A complete snapshot produced by preserveHarnessRuntime closes on the first attempt when it is the current runtime snapshot. A second fixture uses the same production installer before and after a package-version update, with both complete snapshots left in the target and the serving runtime restored to its current bytes. The close refuses the earlier kit-produced snapshot as undeclared-ignored-material at worktree-removal and retains both snapshots. verifiedSnapshots computes only the current inventories of the serving runtime and main; it holds no proof of the earlier installed inventory. D005 recorded this as untested and a reopening condition, but that does not narrow the original requirement that the installed snapshot is removed and the close never refuses what the kit wrote. Keep the foreign-file checks; the repair must retain or recover verifiable ownership of earlier installed snapshots.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/verification-probes.mjs: the glob control and complete current snapshot pass; the runtime-update snapshot case fails with exit 1.",
    "The current-snapshot control inventories 542 regular files and deletes 548 entries including six package links, blocker null.",
    "The update case reports status 1, targetCleanup.outcome retained, blocker.class undeclared-ignored-material, blocker.step worktree-removal, namesEarlierSnapshot true, and both snapshots retained.",
    "scripts/lib/target-worktree-close.mjs verifiedSnapshots, snapshotEntry and targetResidue; scripts/lib/harness.mjs preserveHarnessRuntime and runtimeSnapshotPath."
  ],
  "rejected": [
    {
      "option": "Treat the real earlier installed snapshot as an unsupported fabricated directory",
      "reason": "Both trees were emitted by the production installer; the changed package manifest is confined to the fixture runtime and restored before close."
    },
    {
      "option": "Delete every path beneath a snapshot-shaped directory",
      "reason": "Criterion 2 and the executor review findings require foreign notes, edited files and tracked content to survive."
    }
  ],
  "followup": "WO-252 repair F1: preserve verifiable installed-snapshot ownership across runtime updates, remove legitimate earlier snapshots at target close, retain the foreign-file and tracked-content refusals, and make the VER-001 runtime-update reproduction pass.",
  "reopenWhen": "The repaired close passes the complete current and earlier-snapshot probes while the existing foreign-file and tracked-content controls remain green."
}
```

## WO-252-D017

```json
{
  "id": "WO-252-D017",
  "date": "2026-11-03",
  "dispatch": "resume: verify; criterion 6",
  "decision": "Record VER-001 F2 as blocking the all-roots clause of criterion 6. The emitted set has fourteen role roots: the twelve ordinary phase roots carry the prune-ownership sentence and recorded-host-denial fallback, while the Codex and Claude router roots contain neither. D009 and the new regression deliberately exempt the router, but the filed criterion says every root and no operator amendment or waiver narrows it. Keep the router read-only: a repair can make its guide explain that the delegated, authorized phase session owns the prune and may hand the command to the operator only after the exact host denial. This is a repairable guidance omission, not a no-candidate criterion defect and not authority for the router to execute a prune.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern=\"every emitted role root\" docs/evidence/WO-252/verification-probes.mjs: exit 1; roots 14; missing .agents/skills/dotln-router/SKILL.md and .claude/skills/dotln-router/SKILL.md.",
    "packages/skeleton/src/loadouts/contributor.ts sharedCorrections and the router-special branches; scripts/test-harness.mjs WO-252 role test explicitly skips the router and asserts it contains no prune command.",
    "WO-252 criterion 6 and D009; the router guide admits no project writes and delegates each lifecycle phase to a fresh session."
  ],
  "rejected": [
    {
      "option": "Record criterion 6 met on the twelve roots the executor test selects",
      "reason": "That selection omits two emitted roots the criterion includes."
    },
    {
      "option": "Give the router cleanup authority",
      "reason": "The read-only router boundary remains required; its guidance can communicate the delegated phase responsibility without executing it."
    }
  ],
  "followup": "WO-252 repair F2: communicate cleanup ownership and the exact-host-denial fallback in both emitted router roots, scoped to the authorized phase session, and extend the regression to every emitted root without weakening router authority.",
  "reopenWhen": "All fourteen emitted roots communicate the ownership and fallback rule, the router remains read-only, and harness check and the updated role oracle pass."
}
```

## WO-252-D018

```json
{
  "id": "WO-252-D018",
  "date": "2026-11-03",
  "dispatch": "resume: verify; handoff correction",
  "decision": "Correct the unfiled VER-001 actor header to exactly the normalized actor the completion command prints. The first verification-result fail attempt was refused before any VerificationCompleted event because the report included accountLabel not-applicable while the supplied completion flags normalize without that optional field. Remove the extra field, preserve the actual Codex CLI version, model, selected effort and source, regenerate the decision index and rerun the document gate for the changed candidate. The product identity and both blocking findings are unchanged.",
  "evidence": [
    "npm run resume -- verification-result fail --harness codex-cli --harness-version 0.166.0 --model gpt-6-astra --effort max --source codex-session-readback exited 1: verification report actor header does not match the completion actor. Its expected JSON has harness, harnessVersion, model, effort and source only.",
    "Canonical status after the refusal remains WO-252 verifying with latestVerdict null and verification-result the legal next action.",
    "Before the correction, the document gate passed all 27 checks at the candidate tree; changing the report requires a new exact-tree row. The current complete review row remains usable at the unchanged code identity."
  ],
  "processFailure": "The verifier inferred an optional normalized actor field from an earlier actor record instead of deriving the current completion shape. The error supplied the exact five-field actor; the unfiled report is corrected in place, not amended after filing. No criterion, verdict or implementation is changed to resolve this bookkeeping failure.",
  "rejected": [
    {
      "option": "Change the completion flags to preserve the unnecessary optional report field",
      "reason": "The session supplied no account label; the five recorded session fields already attest the actual actor."
    },
    {
      "option": "Reuse the earlier document row after correcting the report",
      "reason": "That row covers different authored bytes."
    }
  ],
  "reopenWhen": "The next completion attempt rejects the corrected actor or the exact-candidate document row is absent."
}
```

## WO-252-D019

```json
{
  "id": "WO-252-D019",
  "date": "2026-11-03",
  "dispatch": "resume: fix; VER-001 F1, criterion 2",
  "decision": "A target close proves a harness snapshot by its content, whichever runtime installed it, and never by its directory name. The rule the repaired close holds: a file under .runtime/harness/<name>/ is the kit's only when a name input whose digest is <name> lists it with the same size and SHA-256, or the same package link, and every directory above it is a real directory. The name input is the serving runtime's own, as before; or the record the installer wrote into the snapshot, .dotln-snapshot.json, the canonical { files, inventory } whose fnv1a64 is the name; or, for a snapshot installed before records were written, the snapshot's own package inventory with a serving runtime's pinned file list, when the two reproduce the name (provenRuntimeSnapshot and runtimeSnapshotContent in scripts/lib/harness.mjs, verifiedSnapshots in scripts/lib/target-worktree-close.mjs). preserveHarnessRuntime writes the record into every snapshot it creates and never into an existing one. The leading dot keeps the record out of runtimePackageInventory, checkRuntimeSnapshot and the gate's instance digest, so no snapshot name, runtime pin or gate identity moves. Before deleting any file of a snapshot it proved without a record, the close writes that record there (not counting it among the target's files), and it deletes every snapshot's record after its other files, so a deletion that stops part way leaves what remains provable on the next attempt, whichever proof the first attempt used. A file the listing names at that path is judged like any other path: under a declared root it is deleted as declared output, and otherwise it is refused as undeclared material. A file already there that the listing does not name, such as one the repository tracks, serves only when it is the record byte for byte; any other file there stops the close before anything moves, naming it, since a stopped deletion's remainder could not be proven again. A foreign file, an edited package byte, a record that does not hash to its own directory's name and a tracked file stay refused or kept, as before. This takes up an option D005 rejected, proving a snapshot by recomputing its name from its own contents, only for a snapshot that neither a serving runtime nor a record proves. The record supplies the pinned list D005 said the close lacked. Without a record, a stray file inside the package inventory makes the whole snapshot unproven, so every one of its files is refused rather than the one file.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='production-emitted' docs/evidence/WO-252/verification-probes.mjs: both probes pass. The runtime-update probe reads status 0, outcome removed and neither snapshot retained; the current-snapshot control deletes 549 entries (542 files, six package links and the record) with a null blocker. Before the repair the same command failed the runtime-update probe with exit 1 and undeclared-ignored-material at worktree-removal.",
    "scripts/test-target-worktree-close.mjs 'WO-252 snapshots earlier runtimes installed are the kit's residue too, …': three snapshots sit in the target, all installed by preserveHarnessRuntime: one from a runtime whose pinned list lacked an entry, carrying its record; one with another package version whose record was removed, as an installer before records left it; and the current one. A note inside a package of the first is refused alone, and nothing is deleted. An edited package byte in the second leaves that snapshot unproven, so its files are refused, the other two snapshots are never named, and nothing is deleted. With an unwritable directory in each of the two earlier snapshots, one close stops by EACCES inside each in turn, and each keeps that snapshot's record: the installer's for the first, the one the close wrote for the second. The last retry deletes all three snapshots with a null blocker. With the record sorted first the case fails at the record assertion, and without the close's own record write it fails there for the second snapshot.",
    "Same-day correction after the repair's first review round: the round's criteria F2 and design F2 showed that a snapshot proven only by its own content became unprovable after a deletion that stopped part way. This decision first recorded that case as its limit, rejecting a record written by the close. The close now writes the record before deleting, and the limit names only snapshots installed before records whose pinned list no serving runtime holds. The second round's design F1 found the remaining gap, a file the repository tracks at the record's path; the close now stops for it unless it is the record itself. The third round's F1 showed that this stop also caught a listed file under a declared root, which the close deleted as declared output before; the stop now applies only to a file the listing does not name. In 'WO-252 a foreign file at a snapshot's record path under a declared root is deleted as declared output, …', with .runtime declared, a foreign file at a current snapshot's record path goes as declared output (one file) and the snapshot's package file as its residue (one file), with a null blocker on the first attempt; with the listing check removed, the same case stops.",
    "scripts/test-target-worktree-close.mjs 'WO-252 the kit's snapshot cleanup removes only its listed files, …' runs twice. With the record tracked byte for byte beside a tracked file, the close deletes the planted package file and link (two files) and both tracked files stay in the merged base. With another tracked file at the record's path, both close modes stop as declared-root-unreadable naming it, and the package file and link stay.",
    "scripts/test-harness.mjs 'WO-252 a snapshot carries the input its name hashes, …': the record hashes to its directory's name, and the inventory and checkHarness pass over it. A fresh install writes it, and an existing snapshot is never rewritten to add it. Without a record a snapshot proves itself only with a serving runtime's matching pinned list, and a changed package byte breaks that proof. A record edited in place, or copied under another name, proves nothing. A snapshot from a runtime with another pinned list is proven only by its record, and a snapshot name reached through a link proves nothing.",
    "A scratch measurement on a copy of this checkout's installed snapshot (542 package files, best of five, under the bounded wrapper): the record is 102,894 bytes; the record proof takes 0.7 ms and the content proof 22.5 ms."
  ],
  "traps": [
    "Deleting by name: a directory named like a snapshot proves nothing, a record must hash to its own directory's name, and each file must still match the input it carries.",
    "Moving snapshot names, pins or gate identities: the record lives inside the snapshot under a dot name every reader passes over, and only new snapshots get one."
  ],
  "rejected": [
    {
      "option": "Write a record into an existing snapshot when an emit or bootstrap meets it",
      "reason": "Installed snapshots stay immutable; one installed before records proves itself by its own content instead."
    },
    {
      "option": "A record holding only the pinned file list",
      "reason": "A stray file inside the package inventory would leave the whole snapshot unproven instead of naming the file, and a snapshot whose deletion stopped part way could not be proven again."
    },
    {
      "option": "Prove an earlier snapshot by its directory name, or by a launchpad's retained snapshot of that name",
      "reason": "A name proves nothing (VER-001's repair rule and D005), and a launchpad prunes its own superseded snapshots."
    },
    {
      "option": "Keep each proven name input outside the target, in main's retained lane, for a retry to read",
      "reason": "A second store to write, read and clean for every attempt, where the record the installer already defines carries the same proof inside the snapshot and leaves with it."
    }
  ],
  "limit": "A snapshot installed before records whose pinned list matches no serving runtime is refused as undeclared, as before this repair. Snapshots installed from this release on carry their record.",
  "reopenWhen": "A target close is refused for a snapshot that carries a record or matches a serving runtime's pinned list, or a snapshot installed before records whose list no serving runtime holds is observed in a target."
}
```

## WO-252-D020

```json
{
  "id": "WO-252-D020",
  "date": "2026-11-03",
  "dispatch": "resume: fix; VER-001 F2, criterion 6",
  "decision": "Every emitted root now states the prune rule, the router's included, and the router stays read-only. The router gains one sentence: it runs no prune, and the phase session it launches runs node scripts/harness.mjs prune --apply itself under host permissions and records its receipt, handing the operator the printed command only after a recorded host denial of that exact command. This reverses D009's exclusion of the router (VER-001 F2: criterion 6 says every root). The router's boundary is unchanged: DOTLN_ROUTER_WRITE_REFUSED still refuses the prune command in a router session, which the router boundary regression now asserts. packages/skeleton/fixtures/wo252-repair-role-baseline.json pins every role at both economy settings over wo252-role-baseline.json, which stays byte-exact; only the two router roots change. Measured by the gate-followups rule, the router reads 16,634 bytes against its ceiling of 16,384 (16,379 before), and every other root is unchanged. Under product 07's one route for cold-start ceilings the sentence stays whole, and the router's overrun is boarded with the other four in this decision's follow-up, with no ceiling raised and no acceptance recorded. scripts/test-gate-followups.mjs now judges a router breach by that route, as it judges every other root, instead of holding the router to a hard limit the route does not state. FUP-f94a7707660da133's reopening condition, another reviewed rule changing the measured overrun, has occurred; it is marked a duplicate of this decision's follow-up.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='every emitted role root' docs/evidence/WO-252/verification-probes.mjs passes over all fourteen roots, where VER-001 recorded exit 1 naming both router roots.",
    "scripts/test-harness.mjs 'WO-252 every emitted role root gives the prune to the session that needs it …' asserts the command and the denial fallback in every root: the router's own sentence in both router roots, with no instruction to run the prune itself, and the shared sentence in the other twelve. 'router dispatch is metadata only …' refuses node scripts/harness.mjs prune --apply in a router session with DOTLN_ROUTER_WRITE_REFUSED.",
    "A scratch measurement by the gate-followups rule over the regenerated bundle: executor 41,987, verifier 36,711, planner 27,664, refuter 25,815, release-close 26,590, reviewer 39,134 and router 16,634 bytes. Every role's hash but the two router roots matches wo252-role-baseline.json at both economy settings.",
    "docs/control/budgets.json: the router's ceiling is 16,384 with no acceptance; product 07 §Discipline's one route boards a breach as a follow-up."
  ],
  "traps": [
    "Giving the router the prune: the sentence names the phase session as the one that runs it, and the router's write boundary keeps refusing the command.",
    "Cutting a rule to fit the router's ceiling: product 07's route keeps the sentence whole and boards the overrun."
  ],
  "rejected": [
    {
      "option": "Give the router the shared sentence that tells the session to run the prune itself",
      "reason": "The router writes nothing, and its boundary refuses the command; the sentence would instruct what the router may not do."
    },
    {
      "option": "Trim other router sentences to fit 16,384 bytes",
      "reason": "No needed rule is cut to fit a ceiling; an optimization with equivalent usefulness is the follow-up's work."
    },
    {
      "option": "Raise the router's ceiling or record an acceptance",
      "reason": "Product 07 retired that route."
    },
    {
      "option": "Rewrite wo252-role-baseline.json in place",
      "reason": "A reviewed role oracle stays byte-exact; an authorized role change gets its own linked oracle."
    }
  ],
  "followup": "Optimize the installed cold starts of the executor, verifier, planner, release-close and router roots with equivalent usefulness. With the review ladder, the counting rule, the change review helper's route, the common prune sentence, the release-close root's glob, residue and remedy clause and the router's prune sentence, the executor reads 41,987 bytes against its effective 40,194, the verifier 36,711 against 35,221, the planner 27,664 against 24,576, release-close 26,590 against 26,410 and the router 16,634 against 16,384, measured by the gate-followups rule, with no ceiling raised, no acceptance recorded and no duty cut.",
  "reopenWhen": "A planning allocation can verify equivalent usefulness while reducing those cold starts below their unchanged ceilings, or another reviewed rule changes the measured overrun."
}
```

## WO-252-D021

```json
{
  "id": "WO-252-D021",
  "date": "2026-11-03",
  "dispatch": "resume: fix; the repair's first review round, criterion 3",
  "decision": "A derived worktree that release close keeps now carries the class of the refusal that kept it, and its removal is timed like the order's own worktree. reconcileDerivedWorktrees classes each refusal where it is raised: a held writer is writer-held, uncommitted changes not-clean, an active gate other, and an inventory, reconciliation, preservation or journal-move failure preservation-refused, through the same withBlockerClass wrappers the finish uses. The ignored-material check keeps its own class, undeclared-ignored-material. The first refusal's class is printed after the kept line as 'Derived worktree blocker: {path, class}', and release close records it on that worktree's blocker row, and so on the attempt's blocker when that row is the first unresolved one, where it recorded other before. The derivative's reconciliation and preservation copies are timed as preservation and its journal move as journal-retention, so a settle reports them among the worktree-removal children. This fulfils D006's reopening condition, a stopped close recording other where a listed class applies (the round's criteria F3 and F4 and design F1 and F3). The same round's consistency findings are bookkeeping, fixed with it: the new close regression was missing from scripts/fixtures/target-worktree-cases.json, and scripts/lib/release-steps.mjs, which release.mjs, worktree.mjs, plan-failures.mjs and the worktree-removal library import, is now a declared machinery source of the six suites that declare one of those importers or import one in their fixtures (sync-fixtures, launchpad-planning, harness-fixtures, runner-fixtures, process-debt and, after the second round's consistency recheck, plan-refutation), so a change to the class list or step names selects them; configuration-root already covered it by its scripts/lib/ prefix.",
  "evidence": [
    "node scripts/harness.mjs bounded -- bash scripts/test-release.sh --case derived: the dirty derivative's settle blocker and the stopped attempt's blocker both read not-clean at worktree-removal. With the row's class put back to other, the same case fails 'other' against 'not-clean'.",
    "node scripts/harness.mjs bounded -- bash scripts/test-worktree.sh: a settle with no subject worktree moves a derivative's session journal into main's lane and prints Removal timings with journal-retention, preservation and git-worktree-remove above zero. Before this change, settle never timed journal-retention.",
    "scripts/fixtures/target-worktree-cases.json: 80 declarations and 111 names, the repair's two new close cases beside the snapshot cleanup case they follow; scripts/test-runner.test.mjs 'target-worktree file tasks keep all declared cases …' passes."
  ],
  "rejected": [
    {
      "option": "Read a derivative's class from its kept line's reason text",
      "reason": "D006's axis: a class is assigned where the refusal is raised, never read from natural language."
    },
    {
      "option": "Record the two criterion-3 findings and leave them",
      "reason": "Both are bounded repairs on the order's own feature, and the reopening condition D006 names had occurred."
    }
  ],
  "reopenWhen": "A stopped close records other where a listed class applies, or a settle's removal spends time that no child names."
}
```

## WO-252-D022

```json
{
  "id": "WO-252-D022",
  "date": "2026-11-03",
  "dispatch": "resume: fix; the repair's first review round, criterion 2",
  "decision": "Record, and do not change, the round's criteria F1: the target close deletes its temporary-root ledger while roots it registers may remain, carrying them in the close record's ownedTemporaryRoots instead of keeping the ledger and stopping with a blocker that names the root, as the order's Cost text and execution plan put it. D005 made and recorded that deviation. Criterion 2 requires a close holding the ledger, none of it declared, to close on its first attempt with the ledger gone. The fork-shaped close's ledger registers the session's own scratch, which keeps a 24-hour window, so keeping the ledger with a blocker would refuse that close for a day, against the criterion and the objective. VER-001 judged the ledger handling and found it passing. The finding's second point, that a target which survives a failed worktree removal no longer holds the ledger its roots' ownership reads, is transient: the roots stay in the close record for its prune, and while the target survives, temporaryLedgerContradiction retains each of them, the second round's addition, so none is deleted or lost. Once the retried close removes the target that check no longer applies, and D008's marker proof judges each root as an orphan. The second round restated the finding as not held, since this decision leaves the behaviour unchanged.",
  "evidence": [
    "WO-252 criterion 2 and its Cost text; D005's decision, evidence and deviation; VER-001 criterion 2 (the ledger and the fork-shaped residue controls pass).",
    "docs/control/local/reviews/WO-252/repair-2/round-1-criteria.md F1."
  ],
  "rejected": [
    {
      "option": "Keep the ledger and stop the close while a registered root remains",
      "reason": "It refuses what the kit's own sessions wrote for as long as their scratch is retained, against criterion 2's first-attempt close."
    }
  ],
  "reopenWhen": "A carried root is lost to every later prune, or a target that survived a failed removal refuses a root its deleted ledger registered at every read until the close is retried, or the operator holds the Cost text over criterion 2."
}
```

## WO-252-D023

```json
{
  "id": "WO-252-D023",
  "date": "2026-11-03",
  "dispatch": "resume: verify; VER-002",
  "decision": "Re-derive all original criteria touched by the repair and reproduce VER-001's two findings independently, without changing implementation. Read the complete changed implementation and all execution and repair review reports, and use bounded single-process probes. No worker is planned because the named claims can be run in this session. Consume the executor's complete review evidence only after checking its current code identity. The session readback supplies Codex CLI 0.166.0, gpt-6-astra, selected effort max; preserve the actual supplied selection rather than claiming the order's recommended xhigh. The transport exposes no hard dollar-cap control, so the suggested USD 5 cap is unenforced.",
  "evidence": [
    "Canonical status selected WO-252 ready-to-verify; npm run resume -- verify allocated docs/verifications/WO-252/VER-002.md and reserved this worktree's writer.",
    "Entry usage: 57768 total tokens, source codex-transcript-counter, scope dispatch, cutoff 2026-11-03T05:44:21.538Z; monetary cost unavailable. Dispatch standing is within an 8-hour wall bound and three complete runs; no workers used.",
    "VER-001, the repaired handoff and D019-D022 identify snapshot ownership, every-root guidance, derived-worktree timings and blocker classes, and the ledger-lifetime deviation as the changed claims to check."
  ],
  "processFailure": "Initial and resumed unfiltered status, oversized source/report batches and meta's unrestricted summary were truncated. Correct by selecting fields and bounded source sections before emission, preserving full command captures in session scratch, and re-reading verdict-relevant omitted sections. No truncated output is accepted as probe or gate evidence. The first format:check failed only on this verifier's new verification-002-probes.mjs; path-scoped formatting corrected that evidence file and the repeated check passed. No implementation formatting is changed.",
  "traps": [
    "An earlier passing snapshot reproduction now uses the new installer: additionally inspect compatibility with snapshots created before ownership records existed and with an older pinned list.",
    "Ownership checks must preserve foreign and tracked content and retry safely after interruption; use the existing refusal and interrupted-delete cases.",
    "A recorded design deviation is not an amendment; judge ledger lifetime against the original criterion and supported recovery behavior.",
    "Passing gates do not replace independent probes, but unchanged current-identity complete evidence avoids an unnecessary full gate rerun."
  ],
  "rejected": [
    {
      "option": "NoOp: carry the repair handoff's verdict without independent checking",
      "reason": "Verification owes an attack and review at the repaired subject."
    },
    {
      "option": "Edit implementation while judging it",
      "reason": "The verifier records evidence and routes unmet criteria to repair."
    }
  ],
  "reopenWhen": "A current identity differs from the recorded gate, a supported probe disproves a claim, a probe cannot run in this session, or the operator changes scope."
}
```

## WO-252-D024

```json
{
  "id": "WO-252-D024",
  "date": "2026-11-03",
  "dispatch": "resume: verify; VER-002 criterion 2",
  "decision": "Keep VER-001 F1 open for a genuine pre-record snapshot whose historical pinned list differs from the current one. The original reproduction now passes because it uses the repaired installer; the additional independent probe runs the unmodified production harness module from dc447da848e4a14c2c61e48ff91ba969351c6040 in the local target fixture. That module's own harnessInstallation and preserveHarnessRuntime emit a snapshot with 41 pinned files and no ownership record. The current installer has 42 pins, adding document-quality.js. With both snapshots present, close exits 1 as undeclared-ignored-material at worktree-removal and retains both. The copied fixture packages supply the payload; this does not claim a complete build of the historical release. The input is production installer output with its real historical list, not a hand-authored snapshot directory. D019's recorded limitation is therefore exercised, and it does not narrow criterion 2's installed-snapshot requirement. Route F1 as blocking criterion 2, with the existing foreign-file and tracked-content protections retained.",
  "evidence": [
    "docs/evidence/WO-252/verification-002-probes.mjs, pre-record installer case: previousPins 41, currentPins 42, previousHasRecord false, closeStatus 1, outcome retained, namesLegacySnapshot true, previousRetained true and currentRetained true.",
    "git log -1 -S '\"packages/skeleton/dist/src/document-quality.js\"' -- scripts/lib/harness.mjs selects 29151045a; its parent is the historical source used in the probe. The test reads that source without changing its bytes and removes the temporary module before close.",
    "scripts/lib/harness.mjs provenRuntimeSnapshot tries only supplied runtimeFileLists for a record-less snapshot; scripts/lib/target-worktree-close.mjs verifiedSnapshots supplies only the serving runtimes' current lists.",
    "All four VER-001 probes, all eight WO-252 target-close cases, the snapshot-record unit test and the all-roots/router-boundary tests pass on this same code identity. Those controls do not cover this pre-record historical-list combination."
  ],
  "rejected": [
    {
      "option": "Treat the documented compatibility limit as a passing criterion",
      "reason": "No amendment or waiver excludes the kit's earlier installed snapshots, and the original F1 repair rule explicitly covers them."
    },
    {
      "option": "Delete an unproven snapshot by its directory name",
      "reason": "The ownership and foreign-file refusals remain necessary. Recover verifiable historical ownership or migrate it while that proof is available."
    }
  ],
  "followup": "WO-252 VER-002 F1: complete earlier-snapshot compatibility for record-less snapshots whose historical pinned list differs from current serving runtimes; preserve or recover verifiable ownership, keep foreign and tracked content protected, and pass the historical-installer reproduction alongside the current and interrupted-delete controls.",
  "reopenWhen": "The historical-installer probe closes successfully with both snapshots removed while the foreign-file, tracked-content and interrupted-deletion controls remain green."
}
```

## WO-252-D025

```json
{
  "id": "WO-252-D025",
  "date": "2026-11-03",
  "dispatch": "resume: verify; VER-002 baseline regression and D022 reopening",
  "decision": "Route the ledger-lifetime issue as a blocking reproduced regression, rather than treating the Cost-versus-first-attempt wording dispute alone as a blocker. A valid expired root with a dead owner is a prune candidate before close. With the target worktree locked through Git's ordinary worktree lock, the exact baseline target-close helper from b9e843b6978e057d6794b9d0a76af557e9547ba0 refuses the close and preserves its ledger, so ordinary prune eligibility remains. After restoring the repaired helper in the same local fixture, close deletes the ledger and then Git refuses worktree removal. The target remains, the root is carried in ownedTemporaryRoots, but judgeTemporaryRoot now refuses it because its owner's surviving checkout has no ledger registration. This is the specific stopped-removal reopening condition D022 names, and it removes behavior the baseline provided. Data is retained and unlocking then retrying close succeeds; the defect is the loss of the independent cleanup route while the target remains, not permanent data loss. Repair the proof lifetime without weakening the existing-owner ledger check or requiring ordinary successful closes to wait for live scratch to expire.",
  "evidence": [
    "docs/evidence/WO-252/verification-002-probes.mjs, stopped target removal case: baseline closeStatus 1, ledgerRetained true and pruneCandidate true; repaired targetRetained true, ledgerRetained false, registeredRootCaptured true, afterCandidate false, afterReason the owner's ledger does not register this root's token at this path.",
    "The baseline and repaired helpers run in the same local fixture with the same valid root, locked target and surrounding release harness. Only the helper is replaced between arms. Fixture commits and pushes stay in its local bare repositories.",
    "The cleanup finally unlocks the fixture target and reruns close successfully, establishing the existing recovery and bounding the consequence.",
    "scripts/lib/target-worktree-close.mjs deletes residue.ledger before git worktree remove; scripts/lib/temporary-prune.mjs checks temporaryLedgerContradiction before candidate selection; D005 records the deviation and D022 explicitly reopens on this observed refusal until a close retry."
  ],
  "rejected": [
    {
      "option": "Block solely because the implementation differs from the Cost paragraph",
      "reason": "The original criterion also requires the successful first-attempt ledger cleanup. The route here rests on the executed baseline regression, not a new criterion or a preferred design."
    },
    {
      "option": "Ignore missing ledger proof whenever a target still exists",
      "reason": "That would weaken the ownership boundary. Preserve a valid binding through failure or restore it before handing back the stopped close."
    },
    {
      "option": "Leave the issue as the untested D022 deviation",
      "reason": "The independent baseline control now reproduces its named reopening condition and confirms lost behavior."
    }
  ],
  "followup": "WO-252 VER-002 F2: preserve or restore valid temporary-root ownership when target removal stops after residue cleanup, so a root that was eligible for ordinary prune remains eligible while its owner checkout survives; keep the existing-owner ledger boundary and successful first-attempt close behavior, and pass the baseline-controlled stopped-removal probe.",
  "reopenWhen": "The stopped-removal probe preserves prune eligibility under the repaired helper, the ordinary close still succeeds with live retained scratch, and no foreign root is admitted."
}
```

## WO-252-D026

```json
{
  "id": "WO-252-D026",
  "date": "2026-11-03",
  "dispatch": "resume: fix; VER-002 F1, criterion 2",
  "decision": "A snapshot installed before records is proven by its own package files with the pinned file list its release used, whichever list the serving runtime pins. The rule the repaired close holds: every release that named a snapshot by its pinned list and package inventory but wrote no record into it, v0.83.0 to v0.111.1, pinned one of two ordered lists, and scripts/lib/harness.mjs keeps both as PRE_RECORD_RUNTIME_FILE_LISTS: the 42 paths v0.103.0 to v0.111.1 pinned, and the same without packages/skeleton/dist/src/document-quality.js, which v0.83.0 to v0.102.0 pinned. provenRuntimeSnapshot tries each distinct list once, the serving runtimes' first, so such a snapshot is proven exactly when its own files, hashed as its release hashed them, reproduce its directory's name. That name covers every package byte (each file's size, SHA-256 and executable bit in the inventory), so this proof is as strong as a serving runtime's: an edited byte or a file inside the package tree leaves the snapshot unproven and every file of it refused, a file beside the packages is refused alone, a tracked file stays, and the close writes the record into the snapshot before deleting any of it, as for every snapshot proven without one, so a deletion that stops part way stays provable; a file the listing names at the record's path is declared output, since the judgment refuses undeclared material, and the close deletes it first so the record can take its place. The lists are history, never the runtime's own pins, and never grow: every release from this one writes the record. This closes D019's limit for every snapshot whose name covers its content. A snapshot from a release before v0.83.0 is still refused: its name is the digest of its pinned files alone, so no digest the kit holds covers its other package files, and deleting them would take its name as proof, which VER-002's repair rule forbids.",
  "evidence": [
    "A survey of every revision of scripts/lib/harness.mjs: from d77886704 (2026-10-17, first in tag v0.83.0) through this order's base b9e843b6 (v0.111.1) the name is fnv1a64(canonicalStringify({ files, inventory })) with byte-identical runtimeFileEntry, sortedRuntimeInventory, runtimePackageInventory and hash code. packages/skeleton/src/runtime-inputs.mjs is unchanged since d77886704 created it, and fnv1a64 and canonicalStringify in packages/compiler/src/normalize.ts since 2026-10-07. The pinned list took two values: 41 paths from d77886704 to f41633016 (tags v0.83.0 to v0.102.0) and 42 from 29151045a (v0.103.0), which inserts document-quality.js at index 15 and keeps the rest in order. v0.82.0 and earlier named a snapshot fnv1a64(JSON.stringify(runtimeFiles)), over 5 to 40 pinned files only.",
    "A scratch probe in the session scratch loaded each release's own installer, v0.82.0, v0.83.0, v0.102.0, v0.103.0 and v0.111.1, beside today's modules, as VER-002's probe did, and installed a record-less snapshot. The repaired provenRuntimeSnapshot, given no serving runtime's list, proved the four from v0.83.0 on (29 to 33 ms each, including the inventory's SHA-256 of every package file) and not v0.82.0's.",
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/verification-002-probes.mjs: the pre-record installer case passes with closeStatus 0, outcome removed, previousRetained false and currentRetained false, where VER-002 recorded exit 1.",
    "scripts/test-harness.mjs 'WO-252 a snapshot a release before records installed proves itself by the list that release pinned, …' reads scripts/fixtures/wo252-pre-record-snapshots.json: a 44-file runtime holding every path v0.82.0, v0.83.0 and v0.111.1 pinned, and the name each release's own installer gave a snapshot of it. The kept lists are exactly the two inventory-named releases' lists; today's naming gives each its recorded name, and with its record removed and no serving runtime's list its own files prove it; an edited package byte leaves it unproven; v0.82.0's recorded name is the digest of its pinned files alone, and its snapshot is not proven.",
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/repair-3-release-history-probes.mjs reads this checkout's tags: 33 releases from v0.83.0 to v0.111.1, 22 pinning the 41-path list (v0.83.0 to v0.102.0) and 11 the 42-path list (v0.103.0 to v0.111.1), each naming by its list and inventory, and v0.82.0 naming by its pinned files; each fixture release's own installer, loaded beside today's modules, gives the fixture's runtime the recorded name and writes no record, and the repaired proof takes the two inventory-named snapshots and not v0.82.0's.",
    "scripts/test-target-worktree-close.mjs 'WO-252 snapshots earlier runtimes installed are the kit's residue too, …' gains a fourth snapshot with the list v0.83.0 to v0.102.0 pinned and no record while the serving runtime pins 42 paths: an edit in another snapshot never names it, the third interrupted attempt stops inside it and keeps the record the close wrote, and the last retry deletes all four with a null blocker.",
    "Mutation: with the frozen lists removed from provenRuntimeSnapshot, both harness tests and the close case fail, the close refusing .runtime/harness/17f0d410c695848c, the 41-path snapshot, as undeclared.",
    "Expected-data change: in scripts/test-harness.mjs 'WO-252 a snapshot carries the input its name hashes, …', a record-less snapshot of today's list is now proven with no serving list, by the frozen 42-path list, so its checks that only a record proves a snapshot and that an edited record proves nothing move to a snapshot whose list no release pinned (today's without its first path).",
    "Same-day correction after the repair's first review round. Its criteria F2 showed a declared file at a record-less snapshot's record path (a registration naming **/.dotln-snapshot.json) kept the close from writing the record, so a deletion that stopped part way left the rest unprovable and refused; the close now deletes that declared file first and writes the record. In 'WO-252 a declared file at a snapshot's record path gives way to the record before any of the snapshot goes, …' a snapshot of the v0.83.0 to v0.102.0 list with foreign bytes at its record path stops by EACCES part way, holding the kit's record, and the retry closes with a null blocker; without the deletion the case fails with the foreign bytes still there. Its design F2 showed the first harness regression ran the releases' installers from this checkout's tags beside today's modules, so a checkout without the tags failed and a later change to scripts/lib could break it through an old installer's imports; the regression now reads the committed fixture, and the history survey is this evidence's probe."
  ],
  "traps": [
    "A list that proves too much: each is an exact historical sequence, and the name still has to reproduce from the snapshot's own bytes over an inventory that covers every package byte.",
    "A frozen table that drifts from history: the harness regression compares the kept lists with those the fixture records from the releases, in either direction, and the evidence probe checks every release tag's list against them."
  ],
  "reopens": {
    "decisionId": "WO-252-D019",
    "observation": "D019 limited the content proof to a serving runtime's pinned list and reopened when a snapshot installed before records whose list no serving runtime holds was observed in a target; VER-002's probe installed one with the production installer at dc447da8, the last commit with the 41-path list, between v0.102.0 and v0.103.0."
  },
  "rejected": [
    {
      "option": "Read the historical lists from the launchpad's Git history at close time",
      "reason": "An exported instance carries no kit history, a shallow or squashed clone loses it, and the close would read history on every target close; the lists never change once their releases are cut."
    },
    {
      "option": "Accept a snapshot from before v0.83.0 by its pinned files and its layout",
      "reason": "No digest covers its other package files, so an operator's file inside its package tree would be deleted on its name's word."
    },
    {
      "option": "Write a record into an installed snapshot when a runtime update meets it",
      "reason": "D019 keeps installed snapshots immutable, and the runtimes that installed these cannot be changed after the fact; the frozen lists prove them without a migration."
    },
    {
      "option": "Prove an earlier snapshot by a launchpad's snapshot directory of the same name",
      "reason": "D005: that directory is not verified, so a file mirrored into both would pass."
    },
    {
      "option": "Run the releases' installers from history in the harness suite",
      "reason": "The round's design F2: a checkout without the release tags fails, and an old installer's imports tie later changes to scripts/lib to it; the committed fixture pins the same names, and the evidence probe reruns the installers."
    }
  ],
  "limit": "A snapshot that a release before v0.83.0 installed, named by its pinned files alone, is refused as undeclared material and its directory named.",
  "reopenWhen": "A target close is refused for a snapshot a release from v0.83.0 installed, or a snapshot from a release before v0.83.0 is observed in a target."
}
```

## WO-252-D027

```json
{
  "id": "WO-252-D027",
  "date": "2026-11-03",
  "dispatch": "resume: fix; VER-002 F2, the baseline regression that reopens D022",
  "decision": "The target's temporary-root ledger leaves only with the target. The rule the repaired close holds: while the target stands, every root its ledger registered before the attempt stays registered there, so a prune judges each such root as it did before the close. The close deletes the ledger last, immediately before Git removes the worktree (takeLedger), after the other residue, the declared output and the bundle; if Git's removal stops while the target directory stands, it writes each segment back byte for byte (putBack), never into a removed worktree, through a link or over a file, the record's ledger row reads restored and the deletion's counts exclude what came back. A removal that stops before Git's leaves the ledger untouched, and a segment that cannot be deleted stops the close with those already taken written back. Once the target is gone its roots are carried in ownedTemporaryRoots and judged by their markers, as before. temporaryLedgerContradiction is unchanged, and a successful close still deletes the ledger on its first attempt without waiting for retained scratch. This reverses D022's judgment that the stopped case was transient: VER-002's baseline-controlled probe showed a root that main's helper left prunable became unprunable until a retry.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/verification-002-probes.mjs: the stopped-removal case passes with targetRetained true, ledgerRetained true, registeredRootCaptured true and afterCandidate true, the stop classed other at worktree-removal, where VER-002 recorded ledgerRetained false and afterCandidate false.",
    "scripts/test-target-worktree-close.mjs 'WO-252 a target removal that Git stops leaves the temporary-root ledger as it was, …': with the target locked, the close stops at worktree-removal; the segment is back byte for byte, the expired root is prunable before and after, the ledger row reads restored, the disposable-deletion child counts only the marker, and the root is carried; after unlocking, the retry removes the target, the ledger row reads deleted and the retry's own prune removes the root.",
    "scripts/test-target-worktree-close.mjs 'WO-252 a declared-output deletion that stops leaves the temporary-root ledger untouched, …' (darwin, an immutable file under the declared output): the close refuses naming that file, the segment is untouched, no ledger row is recorded and the root stays prunable. This stop is one VER-002 did not quote: before the repair the ledger went with the other residue, before declared output.",
    "Mutations: without putBack the locked case fails reading the segment (ENOENT); with the ledger taken before declared output, as before the repair, the declared-output case fails the same way.",
    "All ten WO-252 close cases passed in one bounded run, 79.6 s, and all thirteen after the repair's first review round, 95.4 s; the complete run at tree e0e8afa0 passed with them.",
    "The stopped close prints Git's own refusal, 'cannot remove a locked working tree', which names no fixture path; the record's blocker row carries the retry command, as the launchpad worktree's own removal does for a Git refusal."
  ],
  "traps": [
    "Recreating a removed worktree for its ledger: putBack writes only while the target directory itself stands and creates only the ledger's own directories, never through a link.",
    "Weakening the existing-owner check: nothing outside the owner's own ledger stands in for it."
  ],
  "reopens": {
    "decisionId": "WO-252-D022",
    "observation": "D022 recorded the deleted ledger as transient for a target that survives a failed removal; its reopening condition, a surviving target refusing a root its deleted ledger registered at every read until a retry, is what VER-002's probe reproduced."
  },
  "rejected": [
    {
      "option": "Keep the ledger and stop the close while a root it registers remains",
      "reason": "D005 and D022: a session's scratch keeps 24 hours, so the close would refuse what the kit's own sessions wrote for a day, against criterion 2's first-attempt close."
    },
    {
      "option": "Accept the close record's captured roots as the owner's ledger while the target stands",
      "reason": "A record in main is not the owner's ledger; VER-002's repair rule keeps the existing-owner check."
    },
    {
      "option": "Leave an ignored ledger for Git to remove with the worktree",
      "reason": "An untracked ledger stops Git's removal unless forced, and forcing would remove anything else untracked that appeared; one kind of residue would get two behaviours."
    },
    {
      "option": "Move the ledger into main's lane before the removal and back after a stop",
      "reason": "A second store to write and clean, and a prune between the move and the stop would still find no ledger in the owner."
    }
  ],
  "limit": "A close killed during Git's removal, after the ledger's deletion, leaves a surviving target without it until a retried close removes the target, when the carried roots are judged by their markers.",
  "reopenWhen": "A target that survives a stopped removal refuses a root its ledger registered before the attempt, or a close is observed killed inside Git's removal with a registered root still present."
}
```

## WO-252-D028

```json
{
  "id": "WO-252-D028",
  "date": "2026-11-03",
  "dispatch": "resume: fix; the second repair's first review round, criteria F1",
  "decision": "A close moves or deletes none of the kit's residue that it reaches through a link. The rule the repaired close holds: the session lane docs/control/local/harness/ and the order's change-review lane move into main's retained lane only when every directory from the worktree down to them is a real directory inside it (directoryWithin in scripts/lib/worktree-removal.mjs, for every caller of retainWorktreeJournals and journalMoveSources), and a released writer directory is deleted only when it is reached the same way (realDirectories in scripts/lib/target-worktree-close.mjs). The rest of the residue comes from Git's listing, which names nothing beyond a link. So a target that tracks docs/control as a link to a directory elsewhere closes with that directory's files where they are, as main's close left them. The execution's target journal move followed such a link: planJournalMoves checked only the last directory, and Git's tracked-file filter matches nothing beyond a link, so a journal outside the target would have moved into main's lane, and an empty writer directory there would have been removed.",
  "evidence": [
    "scripts/test-target-worktree-close.mjs 'WO-252 what a tracked link in the target reaches is not the close's to move or delete, …': a target tracking docs/control as a link to a directory outside it, which holds a journal, an empty writer directory and a change review, closes with a null blocker, its journals outcome nothing and nothing deleted; all three stay outside, and main's lane holds no such journal. With the planner's earlier last-directory check restored, the case fails: the journals read moved.",
    "A scratch repository tracking docs/control as a link: git ls-files -- docs/control/local/harness exits 0 with no output, and neither the untracked listing nor git status names a file beyond the link.",
    "The round's criteria F1, against tree 0922c676: main's target close moved no journals."
  ],
  "rejected": [
    {
      "option": "Refuse the close when a lane is reached through a link",
      "reason": "What lies beyond the link belongs to the repository or to wherever the link points, not to the worktree; main's close removed such a target and left it, and Git's removal deletes the link itself."
    }
  ],
  "reopenWhen": "A kit session's journals are found written through a link in a target and lost at its removal, or a close moves or deletes a file outside the worktree it closes."
}
```

## WO-252-D029

```json
{
  "id": "WO-252-D029",
  "date": "2026-11-03",
  "dispatch": "resume: fix; the second repair's first review round, design F1",
  "decision": "A journal-retention refusal is preservation-refused wherever it is raised: retainWorktreeJournals and journalMoveSources class every refusal themselves, so the preview release close runs before a target close's move, a launchpad finish's preview and the target's residue judgment record the class the move records. Before, the target close's preview and the launchpad finish preview called the helper unwrapped and recorded other. The target close's own wrapper is removed; the launchpad callers keep theirs, which also cover retainJournals' resolving of the worktree's path before the helper runs, and a refusal that already names a class keeps it.",
  "evidence": [
    "scripts/test-target-worktree-close.mjs 'WO-252 a journal move the lane refuses stops a target close as preservation-refused, in its preview as in the move': a directory where main's lane keeps a target journal refuses both --dry-run and --publish with 'Journal lane entry is not a regular file', blocker preservation-refused at worktree-removal, and the journal stays. With the helper's class set to other, the --dry-run arm records other.",
    "D006 lists a failed journal move as preservation-refused, and D021 classed a derived worktree's through its caller's wrapper."
  ],
  "rejected": [
    {
      "option": "Wrap each preview call at its caller",
      "reason": "Every new caller would have to remember it (the round's design F1)."
    }
  ],
  "reopenWhen": "A journal-retention refusal is recorded under another class."
}
```

## WO-252-D030

```json
{
  "id": "WO-252-D030",
  "date": "2026-11-03",
  "dispatch": "resume: verify; VER-003",
  "decision": "Independently judge the repaired subject against every original criterion, reproduce the previous verification findings, review the whole implementation and all executor review rounds, and use bounded probes confined to disposable fixtures. No worker is planned because this session can run the named claims. Consume a complete review row only after checking its current code identity; run the document gate after the final authored edit. Preserve the session's supplied model and effort in the attestation: Codex CLI 0.166.0, gpt-6-astra, max, source codex-session-readback. The verifier recommendation is xhigh; this transport exposes no hard dollar-cap control, so the suggested USD 5 cap is unenforced.",
  "evidence": [
    "Canonical status selected WO-252 ready-to-verify. npm run resume -- verify allocated docs/verifications/WO-252/VER-003.md and reserved this session's writer; operator control reported ordinary workflow mode.",
    "Entry usage: 50172 total tokens, source codex-transcript-counter, scope dispatch, cutoff 2026-11-03T15:41:33.194Z; monetary cost unavailable. Standing: 0 h 0 min of 8 h 0 min, zero of three complete runs, zero workers used.",
    "VER-002 and repair decisions D026-D029 identify historical snapshot proof, ledger restoration after stopped removal, linked-lane preservation and journal-refusal classes as the repaired claims. VER-001's all-roots guidance claim also remains in the verification scope."
  ],
  "processFailure": "The initial status and oversized source, handoff and decision batches were truncated. Their scope exceeded the output budget. Correct by selecting fields and smaller sections before emission, keeping full command captures in session scratch and rereading omitted verdict-relevant text. No truncated output is accepted as gate or probe evidence. A file-length inventory encountered directories, and a source search named a nonexistent gate-claims module; resolve files from the repository before the next read. These read failures changed no implementation.",
  "traps": [
    "Passing fixtures using today's installer do not alone establish historical compatibility; check actual release-installer evidence and the immutable historical list fixture.",
    "A successful retry does not prove ordinary prune survives a stopped removal; reproduce the baseline-controlled locked-target case and inspect restoration's failure behavior.",
    "A deletion rule must preserve foreign and tracked content; use existing supported refusal controls and inspect the ownership boundary without devising bypasses.",
    "A recorded limitation is not an amendment, while an unsupported constructed input is not a blocking criterion failure; classify findings from supported behavior and the original requirements.",
    "A full gate is costly and cannot substitute for independent evidence; reuse only matching current-identity rows and execute focused probes."
  ],
  "rejected": [
    {
      "option": "NoOp: accept the repaired handoff without independent checking",
      "reason": "The operator requested independent verification of the repaired subject."
    },
    {
      "option": "Change implementation to make verification pass",
      "reason": "The verifier owns evidence and its verdict, and routes an unmet requirement to repair."
    }
  ],
  "reopenWhen": "The current identity differs from the passing row, a supported probe disproves a claim, a required reproduction cannot run here, or the operator changes the scope."
}
```

## WO-252-D031

```json
{
  "id": "WO-252-D031",
  "date": "2026-11-03",
  "dispatch": "resume: verify; VER-003 outcome",
  "decision": "Judge all nine criteria met at the filed handoff, after the final document gate passes. VER-001's snapshot and all-roots findings and VER-002's historical-installer and stopped-removal findings are repaired: their six original independent tests pass on the current subject. The added independent probe passes two consecutive locked close attempts with two expired roots and journal updates: both ledger segments return byte for byte, both roots remain ordinarily prunable, each registration is carried once, the journal rows merge, and the successful retry removes the target and both roots. The thirteen WO-252 target-close cases, historical-list audit, configuration, harness, blocker-feed and temporary-root cases also pass. No new blocking defect or follow-up was established. No implementation or product-document change is made by verification.",
  "evidence": [
    "docs/evidence/WO-252/verification-003-results.json records twelve bounded commands, all exit 0, with 54 passing test checks and no failures or skips. docs/evidence/WO-252/verification-003-probes.mjs records the new repeated-close reproduction.",
    "gateCodeIdentity and findGateCheck read code identity dfbf687b51a680dc5836c1b20c7d0567ff7de143f1287d30006838d2b7b24d26 and the executor's complete row recorded 2026-11-03T14:58:32.380Z, exit 0, 118 tasks, no missing required suite; gateCheckStands returns true. A duplicate complete run is not owed at that identity.",
    "npm run format:check passes; harness check reports 42 generated surfaces; npm run publication:check passes. The source and package-lock diff introduces no dependency or lint/type suppression. Both git diff --check and git diff --cached --check pass before report preparation; lifecycle completion checks the authored candidate again.",
    "Review covered the authored implementation and test diff, adjacent producer/consumer contracts, the twenty-one execution and repair review reports and their dispositions, both earlier verification reports, and the order's citations. Generated surfaces are judged by their source trace and current check evidence. The nomination capture absent in this worktree was found in main's single-copy intake and its cited release-close item read there; it was neither copied nor changed.",
    "The release-history audit verifies 33 releases' pinned lists and reruns the three fixture releases' installers against its small runtime. v0.83.0 and v0.111.1 are proven without records; v0.82.0 retains D026's explicit refusal. This establishes the recorded compatibility range, not compatibility with every historical snapshot. The original four WO-237 recovery defects are covered by the eight current passing temporary-root regressions; the old probe asserts those defects and is not a passing-test oracle."
  ],
  "limits": [
    "D026's pre-v0.83.0 snapshot refusal remains: the old name binds only pinned files, not all package bytes. No new target-close failure in the supported content-proof forms was reproduced, and verification supplies no waiver or broader compatibility claim.",
    "D027's abrupt process termination inside Git removal and unsuccessful ledger write-back remain untested. The supported Git-lock refusal, pre-removal deletion failure and repeated successful restoration are exercised.",
    "The cold-start optimization, bootstrap post-removal prune and whole-suite duration follow-ups remain as the executor recorded them. Verification did not rerun the entire target-worktree suite or perform external publication."
  ],
  "rejected": [
    {
      "option": "NoOp on verification and accept only the executor's signatures",
      "reason": "The earlier failures and repeated-recovery variation required independent execution, now completed."
    },
    {
      "option": "Rerun the complete product gate at the same identity",
      "reason": "The intact current-identity row covers the required suites; focused independent probes add evidence without repeating its 0 h 42 min run."
    },
    {
      "option": "Expand this verification into implementation changes for recorded limits",
      "reason": "No new unmet criterion or baseline regression was established, and the verifier does not modify its own subject. Preserve the existing reopening conditions."
    }
  ],
  "reopenWhen": "A supported target close reproduces a remaining failure, a preservation boundary fails, the code identity changes, the final document gate fails, or D026/D027's recorded reopening condition is observed."
}
```

## WO-252-D032

```json
{
  "id": "WO-252-D032",
  "date": "2026-11-03",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass WO-252 at the filed handoff on the executor's passing complete review row, reused at the code identity recomputed on the working tree, dfbf687b51a680dc5836c1b20c7d0567ff7de143f1287d30006838d2b7b24d26, which integration left unchanged because main has not moved from the activation base b9e843b6. Every original criterion is judged met on evidence re-executed in this review: the three verification probe files (VER-001's two findings, VER-002's two and VER-003's repeated-close variation) and the criteria's named fixtures were rerun under the bounded wrapper, one process at a time, and all pass. No source is edited here and no worker is launched: the one maintainability row this order's prune edit sits beside, WO-233-D078's ancestor-check name (FUP-3fc196bee33d6d9e), is a source change that would move the identity and owe a 0 h 42 min complete run over bytes no verifier judged, so it stays with planning as WO-233's review left it. The release surfaces are written from their contracts, and completion consumes the complete row at this identity and the document row for the exact candidate tree without running a gate.",
  "evidence": [
    "gateCodeIdentity on the working tree, imported from scripts/lib/gate-evidence.mjs in a session-scratch script, returns dfbf687b51a680dc5836c1b20c7d0567ff7de143f1287d30006838d2b7b24d26; findGateCheck(root, 'npm test') returns the row recorded 2026-11-03T14:58:32.380Z at tree e0e8afa0, selection review, exit 0, 118 fresh tasks, and gateCheckStands(row, rows, root) returns true.",
    "git rev-parse HEAD main origin/main all print b9e843b6978e057d6794b9d0a76af557e9547ba0 after git fetch --dry-run printed nothing; npm run worktree -- integrate WO-252 fetched origin and printed 'Integration took in nothing: the worktree is not behind main.'",
    "Under node scripts/harness.mjs bounded --, one process at a time: node --test docs/evidence/WO-252/verification-probes.mjs, verification-002-probes.mjs and verification-003-probes.mjs each exit 0; the thirteen WO-252 cases of scripts/test-target-worktree-close.mjs pass (13 of 13, 93.0 s), the three WO-252 cases of scripts/test-harness.mjs (3 of 3), the five temporary-root cases of criterion 5 (5 of 5), the two WO-252 cases of scripts/test-process-debt.mjs (2 of 2), scripts/test-configuration-root.mjs (25 of 25) and scripts/test-target-worktree-release.mjs (6 of 6, 83.6 s). The fork-shaped case printed worktree-removal 1,649.9 ms: base-fetch 216.4, disposable-deletion 6.3, finder-metadata 5.0, journal-retention 14.3, git-worktree-remove 69.9, branch-delete 20.0 and preservation 94.1.",
    "node scripts/harness.mjs check: 42 generated surfaces; git diff --check and git diff --cached --check print nothing.",
    "git diff main -- scripts/lib/temporary-prune.mjs touches judgeTemporaryRoot's removal-remains branch and applyTemporaryCandidate only; the ancestor check FUP-3fc196bee33d6d9e names is in neither hunk."
  ],
  "traps": [
    "Crediting the complete row without checking that the identity it judged is the identity under review: the identity was recomputed on the working tree through the gate's own function and the row's standing was read through gateCheckStands.",
    "Reading VER-003's pass as this review's own evidence: the probe files and the criteria's named fixtures were re-executed here.",
    "Repairing a maintainability row here because it is small: a source edit moves the identity and owes a complete run with no verification after it.",
    "Spawning a worker over a subject three ladders, twenty-one reports and three verifications already attacked: none was spawned; the plan was zero against the cap of 20.",
    "Disposing register rows on a textual match: the twenty-five matched rows were read and only the three whose recorded condition occurred are re-deferred (D033)."
  ],
  "rejected": [
    {
      "option": "NoOp: pass on VER-003 alone without the identity check, the reruns and the surfaces",
      "reason": "The reviewer owns the acceptance judgment, the integration check and the release surfaces."
    },
    {
      "option": "Start a fresh npm test -- --review at the same identity",
      "reason": "The passing complete row stands at the integrated identity; a duplicate run adds 0 h 42 min of waiting and changes nothing it judges."
    },
    {
      "option": "Rename the prune's ancestor check within the Boy Scout bound",
      "reason": "A source change moves the identity and owes a complete run over bytes no verifier judged; the row stays boarded with WO-233's tradeoff."
    }
  ],
  "reopenWhen": "The code identity changes before the merge, a supported target close reproduces a failure the reruns did not, the document gate fails on the candidate tree, or the operator changes the scope."
}
```

## WO-252-D033

```json
{
  "id": "WO-252-D033",
  "date": "2026-11-03",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Re-defer the three register rows whose recorded conditions this order met and leave the other twenty-two matched rows as they are with the readings below. FUP-957602bc42e32e1d (WO-217-D053) and FUP-8dd0eb609946b9d1 (WO-249-D025): their condition, another role edit or reviewed rule changing the measured overrun, occurred, because the common prune sentence, the release-close root's glob, residue and remedy clause and the router's prune sentence changed every installed role root; measured by the gate-followups rule the executor reads 41,987 bytes against its effective 40,194, the verifier 36,711 against 35,221, the planner 27,664 against 24,576, release-close 26,590 against 26,410 and the router 16,634 against 16,384, with the reviewer and refuter within their bounds; D020 boards the five overruns as FUP-9d8c66a3ce8654f6 under product 07's one route, no ceiling moved and no acceptance was recorded. FUP-eed385be08e5bdd9 (WO-226-D022): its condition occurred, because this order re-mints the role oracle twice, as wo252-role-baseline.json over WO-250's and wo252-repair-role-baseline.json over that, and edits scripts/test-gate-followups.mjs so that the router's breach is judged by the same boarded-follow-up route as every other root instead of a hard limit; the chain walk, the effective-ceiling and acceptance checks and the historical inequality are kept. Left as they are: FUP-3fc196bee33d6d9e, because this order's prune edit adds the removal-remains judgment and never touches the ancestor check the row names, and a rename at final review would move the identity; FUP-34bee344f576ba39, because the plan-failures edit adds the close blockers block, not the escape counts the row's condition names; FUP-dfde4050da06d43b, because the sequence failure did not recur: each complete run started after its ladder's last round ended (repair 3's round 2 ended 14:14:39Z and its run started 14:16:38Z); FUP-ea936acad1506e18, because the snapshot record and the two kept historical pin lists are snapshot maintenance that does not evaluate deriving the import closure, and no snapshot failed to load a reachable module; FUP-ac86ee429dee2947, because its condition is a planning allocation and D020 carries the planner's current figure; FUP-770baf2f452c669e, because the shared prune sentence is not the planner's entropy sentence the row names; FUP-912adb42a652b75f, because the product and guide edits are judged by the document gate at the exact candidate tree and the complete row's identity keys code; FUP-977e50f635de762d, because the release.mjs edits are the blocker classes and children, not the kit close's runtime refusal; FUP-911dc28a35dc4c44 and FUP-dc138fc0fac6a3fc, because the test-harness edits are the role roots and the snapshot proof, not the target resolution or the refusal text; FUP-2ce66cf6a0602982, because the refute-plan edit prints the repeated-blocker line and counts nothing; FUP-fb8cbeabbddef397, because no plan-check median reading above 9 s was observed; FUP-17ea51254e5a7256, FUP-d0a9719cc2e4ec55, FUP-fc889fc98e33c547 and FUP-941fd291e0fd1033, which name a path or this order in their text only; this order's own rows FUP-6606e739a1ae8678 and FUP-9d8c66a3ce8654f6, which planning triages; and the untriaged rows FUP-1116ba845c557862, FUP-225e0993974f3f4b, FUP-4763c82de6324631 and FUP-8bf500303e6adfce, which match paths this order touched (the release summary gains the residue and blocker lines beside, not in, the starter-seed lines FUP-8bf500303e6adfce would add) and whose triage is planning's.",
  "evidence": [
    "npm run plan -- followups --touching at register revision 4edf6beb… read 251 pending rows and 25 matched over four pages, paged with --cursor; --show read the three rows' current dispositions, each WO-250-D020's.",
    "D020's measurements by the gate-followups rule over the regenerated bundle: executor 41,987, verifier 36,711, planner 27,664, refuter 25,815, release-close 26,590, reviewer 39,134 and router 16,634 bytes; packages/skeleton/fixtures/wo252-role-baseline.json and wo252-repair-role-baseline.json are the two oracles the chain in scripts/test-gate-followups.mjs now walks first.",
    "docs/evidence/WO-252/handoff.md: repair 3's round 2 at tree e0e8afa0 ended before the complete run at that tree started 2026-11-03T14:16:38Z.",
    "git diff main -- scripts/lib/temporary-prune.mjs scripts/lib/plan-failures.mjs scripts/refute-plan.mjs scripts/test-harness.mjs scripts/release.mjs: the hunks named in the readings above."
  ],
  "rejected": [
    {
      "option": "Dispose every matched row on its textual match",
      "reason": "A match is a pointer for judgment; a disposition on a match alone would misstate what happened."
    },
    {
      "option": "Triage the four untriaged rows here",
      "reason": "Triage of a nomination is the planning pass's; this review records only that their seams are not this order's."
    }
  ],
  "reopenWhen": "A planning pass evaluates instruction-byte optimization, a records merge brings a disagreeing disposition on one of these rows, or a later review finds a left row's seam opened by this order."
}
```

## WO-252-D034

```json
{
  "id": "WO-252-D034",
  "date": "2026-11-03",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Board the one defect this review found as a follow-up, not a repair: the registration floor bounds a disposable pattern's form and not the material it reaches. validateDisposablePaths refuses only a last segment with no literal part, so `**/*.*` is admitted, and segmentMatches lets `*` match a leading dot, so that one entry matches `.env`, an operator note, a writer record and the `.runtime` directory itself as roots; a close under such a declaration deletes them as declared output instead of refusing them as undeclared. Criterion 1 is met as written (the four refused forms and the admitted `**/*.tsbuildinfo`), the kit's own residue is never counted as disposable because the target's disposable set excludes the residue paths, and main had no glob at all, so no criterion is unmet and no behavior main had is broken: the route is follow-up and the class escape, the floor being in the declared surfaces and the gap named by planning receipt 062 before execution. A repair here, tightening the floor to require a literal run beyond punctuation or judging the matched set at close against the kit's lane and the root's dotfiles, is a source edit that moves the identity and owes a complete run over bytes no verifier judged; it belongs to the next order or repair in the declared surfaces. The receipt's other five known-issue findings are judged from the record in the evidence below: none has occurred, two are not yet judgeable, and one is a Cost-line omission for the planner.",
  "evidence": [
    "node scripts/harness.mjs bounded -- node --test docs/evidence/WO-252/final-review-probes.mjs: 1 of 1 passing. loadConfig admits a class declaring **/*.*; disposableMatchRoot('**/*.*', …) returns .env, docs/control/local/notes.txt, docs/control/local/harness/writer.json and libs/a/.secret.key at their own paths, .runtime for .runtime/notes.txt and for a snapshot file beneath it, and null for Makefile and libs/a/LICENSE.",
    "scripts/lib/config.mjs validateDisposablePaths: the floor is the last segment with every * removed being non-empty, so any literal character, a dot included, admits the segment; scripts/lib/target-worktree-close.mjs segmentMatches treats a leading dot as any other character, as the order's design states.",
    "docs/planning/refutations/2026-11-02-planning-ef8570011ad28e17-062.md, WO-252 criterion 1 finding: the floor bounds the pattern's form, not the material it can delete; its reopening condition, a registration admitted whose declaration matches an operator note, a writer file or a .env, is what the probe shows by construction.",
    "Receipt 062, criterion 3 (an unattributed remainder): D012 attributes the remainder of the fork-shaped row to the two closes' judgments and listings, and this review's rerun read the row at 1,649.9 ms with children summing 426.0 ms; the remainder is attributed in words and not measured, so the receipt's condition has not occurred and the exact partition stays the planning carry-in the handoff names.",
    "Receipt 062, criterion 3 (WO-246's fetch bound and the base-fetch class): the close classes any failure of fetchRemoteBranch as base-fetch where it is caught, so a bound raised inside that fetch takes the class; not judgeable until WO-246 runs.",
    "Receipt 062, criterion 4 (manualCloseoutSteps null): not judgeable until five orders close after this one.",
    "Receipt 062, criterion 5 (read amplification above WO-237's 3.99): docs/evidence/WO-252/meta.json reads readAmplification 2.93 against WO-237's 3.99; not occurred.",
    "Receipt 062, criterion 8 (a code change for criterion 8 the Cost does not name): D010 records targetCloseHandoffLines in scripts/lib/release-close-handoff.mjs and reviewedCommit on the record's target publication, which the Cost paragraph does not name and the execution plan's step 8 does name; the scope was declared in the order, so the condition occurred as the receipt framed it and the consequence is a Cost-line omission for the planner, not unnamed scope."
  ],
  "rejected": [
    {
      "option": "Tighten the floor in this review",
      "reason": "A source edit moves the code identity and owes a 0 h 42 min complete run with no verification after it; the gap is a hardening of a declaration the instance writes, not a criterion failure."
    },
    {
      "option": "Fail the review on the receipt's criterion 1 finding",
      "reason": "Criterion 1 is met as written, no behavior main had is broken, and the operator's direction of 2026-11-01 routes a hardening to the follow-up funnel."
    }
  ],
  "followup": "Make the disposable floor bound what a declaration reaches and not only its form: refuse at registration a last segment whose literal part is only punctuation, such as `*.*` or `.*`, or judge the matched set at close and refuse a declaration whose matches reach the kit's lane (docs/control/local), a dotfile at the root such as `.env`, or `.runtime` itself, with cases in scripts/test-configuration-root.mjs and scripts/test-target-worktree-close.mjs. Paths: scripts/lib/config.mjs validateDisposablePaths, scripts/lib/target-worktree-close.mjs disposableMatchRoot and the target judgment. Reproduction: docs/evidence/WO-252/final-review-probes.mjs.",
  "reopenWhen": "A target close deletes an operator note, a `.env` or the kit's lane under an admitted declaration, or a planning pass allocates the floor."
}
```
