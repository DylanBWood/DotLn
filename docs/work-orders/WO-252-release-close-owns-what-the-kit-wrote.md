# WO-252 — Release close owns what the kit wrote: a disposable declaration matches at any depth, a target close moves or deletes the kit's own residue instead of refusing it, no removal takes a writer in the target, the close record classes its blocker and times what the worktree removal spent, `plan failures` shows a repeated blocker class, a renumbered root whose checkout is gone is judged by its marker and the interrupted-removal cases are repaired, and no role hands a prune to the operator (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One widened declaration form, one new
judgment of kit residue, two record fields, one feed block and the prune's
second proof; a target that declared everything closes as before.
Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/lib/target-worktree-close.mjs`, a disposable
entry that may carry `**/` (any number of path segments) and `*` (within
one segment), matched by segments in `underDisposable` (122) and
enumerated from the ignored-file listing in `disposableRows` (214),
`inspectDisposable` (222) and `deleteDisposable` (181), which today walk a
declared root by path, and an entry whose last segment is a wildcard or
that has no literal segment (`*`, `**`, `**/*`) refused by the
registration's validation (`scripts/lib/config.mjs` 413 to 438, which today
refuses only absolute paths and the `.`, `..` and `.git` segments), so no
declaration names every ignored file; the kit's own residue in a target judged before the
undeclared-material refusal (the judgment at 741 to 795): the target's
`<documentationRoot>/control/local/**` (the journals a Codex release-close
session left when it took a temporary writer there; WO-237's known issue,
whose reopening condition the fork's item 3(b) met) moved into main's
retained lane for the order as the launchpad's journals are
(`retainWorktreeJournals`, `scripts/lib/worktree-removal.mjs` 85 to 130),
a released writer directory (one the writer protocol proves released: no
`writer.json` and an empty `writer/`, `packages/skeleton/src/writer-teardown.mjs`
105 to 124; a held writer still stops the close as `writer-held` before any
deletion, as the close does today at 697 to 709) and the rest of the lane
deleted, and the kit's own entries under `.runtime/` deleted
(`.runtime/.metadata_never_index` from `markUnindexed`,
`packages/skeleton/src/temporary-root-records.mjs` 312; the harness
snapshot under `.runtime/harness/` the bundle installed; the temporary-root
ledger `.runtime/temporary-roots/`, `temporaryLedgerPath` at 331 to 332,
after the close has pruned the roots it registers), with any other entry
under `.runtime/` left to the undeclared-material judgment as today and
`closeClean` (91) excluding the kit's own marker and ledger from its "not
clean" judgment, so the close never refuses what the kit wrote and never
deletes what it did not; in `scripts/release.mjs`
and `scripts/lib/release-steps.mjs` a `blocker` field on the close record
(`{ class, step, message }`) with a closed list of classes
(`undeclared-ignored-material`, `not-clean`, `writer-held`,
`preservation-refused`, `declared-root-unreadable`, `host-denied`,
`foreign-tag`, `starter-refresh`, `publication`, `other`) written when a
close stops, and on the `worktree-removal` row a `children` array
(`base-fetch`, the fetch of `target-worktree-close.mjs` 461 that runs inside
the step; `disposable-deletion` with files and bytes; `finder-metadata`;
`journal-retention`; `git-worktree-remove`; `branch-delete`;
`preservation`; each with its `durationMs`) and a `totalMs` that sums the
row's own `durationMs` and its children's, since `withReleaseStep`
(`release-steps.mjs` 20 to 37) subtracts nested time from the parent and
refuses a name outside its seven, so the children are rows on the step and
not steps; in
`scripts/lib/plan-failures.mjs` (`localReleaseCloses`, 1154) `blockers:
{ byClass, byOrder, repeated }` with `repeated` naming a class that
stopped the closes of three or more distinct orders within the retained
window, a successful close between them not resetting it (the fork's
pattern: each order refused once, then closed by hand), printed by `plan
start` as `close blocker repeated: <class> across N orders`; in `packages/skeleton/src/loadouts/contributor.ts`
the release-close sentence (101) saying that undeclared regenerable output
is removed from the launchpad session by the target's path and never by a
session or writer in the target, and one common sentence that a role runs `harness
prune --apply` itself under host permissions and records the receipt,
handing the printed command to the operator only after a recorded host
denial of that exact command, the fallback the release-close text already
keeps for its publish (the operator's item 5); in `packages/skeleton/src/temporary-root-records.mjs` the second proof
for a renumbered root whose owner repository no longer exists
(`readTemporaryOwner` 399, `ledgerBinding` 475, `writeTemporaryOwner` 530:
a marker inside the directory carrying the record's token with the record's
inode is accepted when no owner repository exists to hold a ledger, so the
root becomes a candidate instead of being refused at every read;
WO-237-D015), and the four interrupted-removal bookkeeping cases
`docs/evidence/WO-237/verification-recovery-probes.mjs` reproduces
(WO-237-D013: a child whose own removal stopped inside a parent's aside; a
relocated child's completed removal recorded under its original
registration; the empty unmarked aside between the final marker deletion
and `rmdir`; nested registrations held when the parent's move is recorded
in another repository); the kit guide §Owned cleanup and retention (the
glob form with an Nx and Vitest example, `**/node_modules`, `**/.vite` and
`**/.vitest` as one class declaration; the kit's residue; the blocker
classes); product 07 §Workflow closeout and releases and §Operator recovery
controls stated as built; cases in `scripts/test-target-worktree-close.mjs`
(a nested cache matched by `**/node_modules` and deleted; a journal lane
in the target moved to main's lane; the `.runtime` marker not refused; a
symlinked component under a glob still refused; the blocker class and the
children timings on the record), `scripts/test-release.sh` (the record
fields), `scripts/test-process-debt.mjs` (the blockers block and the
repeated line), `scripts/test-temporary-roots.mjs` and
`scripts/test-fixture-temp-root.sh` (the orphan proof and the four cases)
and `scripts/test-harness.mjs` (the roots). Removes: a target close that
refuses on its first attempt at every Nx or Vitest target because sixteen
nested `node_modules` caches sit outside a root-anchored declaration (the
fork's seven closes from WO-007 to WO-020, 2026-10-24 to 2026-11-01, each
refused and rerun by hand); a close that refuses the journals and the
marker the kit itself wrote (the fork's WO-026 and WO-020, three and four
attempts); a worktree-removal step of one to three and a half minutes whose
record cannot say what it spent them on; a feed that counts closes per
order and never shows the same blocker seven times; a renumbered root with
no owner that no kit route can remove (WO-237's FINAL-001 F1); and a role
that tells the operator to run the prune. Wall-clock: the glob match is a
segment comparison per ignored file against each declared entry; the
residue judgment is a prefix test on the listing the close already holds;
the children timings are the existing step's time divided; each measured
before and after in the decisions from a close record. Context bytes: this
file, about 22,000; the release-close and executor roots grow by two
sentences, measured against their ceilings under the standing route.
Commands: none new. Tokens: unknown until run. Steps: 11. Re-mints:
`temporary-root-records.mjs` and `contributor.ts` are runtime sources the
executor checks against `scripts/lib/evidence-sources.mjs` at activation
and re-mints deterministically where an edition is staled;
`scripts/lib/temporary-prune.mjs` and `temporary-prune-summary.mjs` are
registered sources with their own editions; no feedback-judged source
changes, so no live feedback episode; `scripts/release.mjs` and
`scripts/lib/plan-failures.mjs` are declared machinery sources, so `npm
test -- --review` runs before handoff.
**Nomination provenance:** the DotLn-Enterprise-Starter fork's first block of
2026-11-01, item 3 (its five asks: a disposable form matching at any depth
or a class default; the close owning its residue in a target; the role
text's remedy taking no writer in the target; `plan failures` projecting
close blocker classes; the close record naming what the worktree removal
spends its minutes on) and item 8 (the profile rows), relayed in the
operator's 2026-11-01 planning dispatch (ignored capture
`docs/intake/notes/planning-fork-blocks-close-residue-reviews-criteria-and-desktop-opt-in-2026-11-01.md`,
SHA-256 `65b3db5f78aa7bdba95e94ce62e12015afbc144e058b5699767040e37b22d0a2`),
boarded by WO-237-D009 (FUP-e872a59769b9a97a) for planning; the operator's
items 4 and 5 of the same dispatch (the symlink-escape message at WO-247's
close; the prune handed to the operator); WO-237-D015 (FUP-376d333e4dcd0518)
and WO-237-D013 (FUP-134a3766852c8f77). Filed by the
[2026-11-01 pass](../planning/fork-blocks-close-residue-reviews-criteria-desktop-opt-in-2026-11-01.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-233 (closed: the owned-resource prune, the retention
classes and the close-time prune this order extends); WO-239 (closed: the
close's timed steps and the bounded census); WO-237 (closed, v0.107.0: the
retained lane, the token-and-inode judgment and the four recovery cases
this order completes); WO-236 (closed: the target worktree registration
with `disposable` and `baseDisposablePolicy`).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-233",
    "relation": "satisfied-by-close",
    "reason": "the owned-resource prune, retention classes and close-time prune this order extends"
  },
  {
    "workOrderId": "WO-239",
    "relation": "satisfied-by-close",
    "reason": "the release close's timed steps and record this order divides and classes"
  },
  {
    "workOrderId": "WO-237",
    "relation": "satisfied-by-close",
    "reason": "main's retained lane, the renumbered-root judgment and the recovery cases it boarded"
  },
  {
    "workOrderId": "WO-236",
    "relation": "satisfied-by-close",
    "reason": "the target registration's disposable declaration this order widens"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/target-worktree-close.mjs`
(`closeClean` 91 to 120; `underDisposable` 122; `ignoredByTree` 128 to 160,
whose comment says neither an init template's `info/exclude` nor the
operator's global excludes may authorize deletion; `deleteDisposable` 181;
`disposableRows` 214; `inspectDisposable` 222 to 266; the target judgment
700 to 800 with the refusal at 791 to 795 and `requireReleasedBundleOwnership`
reading the clone's `info/exclude` at 378 to 395); `scripts/lib/release-steps.mjs`
(the seven step names; `withReleaseStep` with nested time excluded from the
parent); `scripts/release.mjs` (`withReleaseStep(record, "worktree-removal",
…)` at 2183, 3437 and 3456; `steps: releaseSteps()` at 4007);
`scripts/lib/worktree-removal.mjs` (`retainWorktreeJournals` 85 to 130;
`journalLane` 70); `scripts/lib/plan-failures.mjs` (`localReleaseCloses`
1154 to 1162; `closeTiming`); `packages/skeleton/src/temporary-root-records.mjs`
(`markUnindexed` 312; `readTemporaryOwner` 399; `ledgerBinding` 475;
`writeTemporaryOwner` 530; `removeVerifiedTemporaryRoot` 827);
`packages/skeleton/src/loadouts/contributor.ts` 101; the release-close role
text's cleanup paragraph; product 07 §Workflow closeout and releases (the
close-time prune and `plan start`'s apply) and §Operator recovery controls
("Cleanup is owned by the workflow, not handed to the operator");
`docs/evidence/WO-237/decisions.md#wo-237-d009`, `#wo-237-d013`,
`#wo-237-d015`; `docs/evidence/WO-237/verification-recovery-probes.mjs`;
WO-237's Known issues (the target keeps no journals of its own); the fork's
item 3 of 2026-11-01 in the nomination capture.

**Objective:** A target close succeeds on its first attempt when the
instance declared its build output once, in one line, and the close itself
never refuses the files it or its sessions wrote. When a close does stop,
its record says which class of blocker stopped it and what the worktree
removal spent its minutes on, and a planning pass sees a blocker that
repeats. A temporary root the kit owns is always removable by a kit route,
and no role hands the operator a prune to run.

**Observed gap (dated 2026-11-01 at `main` `64286ff8`, v0.107.0):**

- `underDisposable` matches a declared root by exact path or root-anchored
  prefix (122), and `deleteDisposable`, `inspectDisposable` and
  `disposableRows` walk each declared path (181, 214, 222). An Nx workspace
  with Vitest leaves `libs/<project>/node_modules/.vite` and `.vitest`
  under every project with a Vite configuration; the fork's seventeen
  retained close records show every target close since WO-007 refused on
  its first attempt with "target has undeclared ignored material" for
  sixteen or seventeen such directories, each removed by hand before a
  rerun; its next two orders declare the seventeen roots one by one.
- On 2026-10-31 the fork's Codex release-close sessions removed those
  caches under a temporary writer reservation in the target, leaving
  `docs/control/local/` journals there (ignored in the target, refused as
  undeclared on the next attempt) and `.runtime/.metadata_never_index`
  from `markUnindexed`, untracked in the target and refused by `closeClean`
  (91) as not clean before any disposable rule is read: three attempts for
  WO-026 and four for WO-020. WO-237's known issue said the target keeps no
  journals of its own and a target close moves nothing, reopening when a
  target bundle starts journaling into the target; WO-237-D009 recorded
  that it has.
- `releaseSteps` times seven steps (`release-steps.mjs`); the fork's
  `worktree-removal` step took 58 s, 54 s and 2 min 9 s, then 1 min 17 s,
  1 min 34 s, 2 min 22 s and 3 min 28 s, with the finder walk of 5,300
  directories at 0.2 s of it and 42,340 files under the declared roots; the
  record cannot say whether deletion or Git took the rest.
- `plan failures` counts local closes per order (`localReleaseCloses`,
  1154) and their total timing; a blocker's message is on the record and
  nothing counts its class, so seven identical refusals across seven orders
  were visible to no pass.
- WO-237's FINAL-001 F1 (D015): `readTemporaryOwner` re-stamps a differing
  device only under `ledgerBinding`, which is null when the owner
  repository no longer exists, so a root whose checkout a close removed and
  whose record predates a reboot is refused at every read and no kit route
  removes it; `harness prune --apply` and `scripts/temporary-root.mjs
  remove` both read the record first. WO-237's VER-001 (D013) reproduced
  four interrupted-removal bookkeeping cases, R1 to R4, and boarded them.
- The operator's item 5: sessions have told the operator to run `harness
  prune --apply`; product 07 §Operator recovery controls already says
  cleanup is owned by the workflow, and the role text says a session gives
  the operator a command only where the order or role names that fallback;
  no sentence names the prune as the session's own to run.
- The operator's item 4: "Worktree preservation refuses a symlink escape"
  (`scripts/lib/intake-reconciliation.mjs` 36) stopped WO-247's close once;
  WO-237-D009 records the cause (two Codex launcher links under a retained
  live-drive Codex home) and that WO-247-D003 restricted retained homes to
  `sessions/` and `session_index.jsonl`, so the cause is gone and the
  refusal, which keeps a preservation copy from following a link out of the
  checkout, stays.

**Design (scope discipline):**

- **A glob with two forms, judged on the listing.** `**/` matches any
  number of segments and `*` matches within one; the close enumerates
  matches from the ignored-file listing it already holds and deletes,
  inspects and counts those paths, so `**/node_modules` is one entry for a
  whole workspace. A symlinked component under a match is still refused, as
  under a declared root today. An entry whose last segment is a wildcard or
  that has no literal segment (`*`, `**`, `**/*`) is refused at
  registration, so no declaration can name every ignored file. Rejected: a built-in default that deletes
  nested `node_modules` everywhere (axis: an undeclared deletion is what
  the close exists to refuse; the kit guide shows the one-line declaration
  and a class may carry it for every registration). Rejected: a regular
  expression (axis: a path language the operator reads without a manual).
- **The kit knows its own residue, and only that.** The target's control
  lane and the kit's entries under `.runtime/` are the kit's writes; the
  close moves the journals to main's lane for the order, as it already does
  for the launchpad worktree, and deletes a released writer directory (one
  the writer protocol proves released; a held one still stops the close as
  `writer-held`, since WO-236's one-writer rule and the teardown's
  no-holder proof stand), the lane's remainder, the marker, the installed
  snapshot and the temporary-root ledger after pruning the roots it
  registers, before judging what remains, so the undeclared-material
  refusal names only what an operator or build left. A
  file under `.runtime/` the kit did not write is judged as any other
  ignored path, so a target that keeps its own `.runtime/` loses nothing to
  the close. Rejected: deleting `.runtime/**` wholesale (axis: the
  directory name is the kit's convention, not the kit's property). Rejected: writing the
  paths to the clone's `info/exclude` (axis: the close deliberately refuses
  exclude files as deletion authority, `ignoredByTree`'s comment; the
  journals would still be ignored and undeclared). Rejected: asking the
  instance to declare them (axis: the kit refusing what the kit wrote is
  the defect, the fork's item 3(b)).
- **No writer in the target for a removal.** The role text's remedy names
  the launchpad session and the target's path; a session or writer in the
  target is what left the journals. Rejected: a close that tolerates a
  live target writer (axis: WO-236's one-writer rule).
- **A blocker has a class; a step has children.** The record's `blocker`
  is one of a closed list and `plan failures` counts it; the removal row
  carries its children as rows on the step with a `totalMs` beside its own
  time, because `withReleaseStep` subtracts nested time from the parent and
  admits only its seven names, so the parent's figure and the children's
  both stay true. Rejected: parsing the
  message text for a class (axis: natural-language reading; the class is
  assigned where the refusal is raised).
- **The prune is the role's.** One common sentence; the routine homes
  stay as WO-237-D005 left them (`plan start` applies the full-scope prune
  at a cost it already pays; release close prunes its own scope; the
  explicit command is the session's recovery route), and the role hands the
  printed command to the operator only after a recorded host denial of it,
  the fallback the release-close text keeps for its publish. Rejected: the
  full census at every close (axis: WO-237-D005 measured 143 s for the all-scope
  census against a close the fork already finds slow). Rejected: a new
  phrase or skill for the prune (axis: the operator's item 5 offers it, and
  a phrase the operator types is still the operator doing it; the role runs
  the command).
- **The orphan's second proof is its marker.** With no owner repository to
  hold a ledger, the marker inside the directory carrying the record's
  token with the record's inode is the proof; a root with an owner keeps
  the ledger binding WO-237 built. Rejected: deleting on the token alone
  (axis: WO-237-D004's inode rule).
- **The profile rows stay the instance's.** The close's printed handoff
  names the published tag and the reviewed commit; writing the registering
  launchpad's profile is declined (the fork's item 8): a profile is an
  instance-owned standing document, and a generated block in it is a kit
  template change every instance's profile would need (reopen: a second
  instance asks, or the fork's pass measures the copy as a cost).
- **Live-run surfaces at the base.** The disposable judgment, the retained
  lane, the step timings, the close record, `plan failures`, the
  temporary-root records and the recovery probes: exist. The glob, the
  residue judgment, the blocker class, the children, the feed block, the
  orphan proof and the sentences: absent.

**Execution plan (the executor follows these steps in order; observed at `64286ff8`, 2026-11-01):**

1. `scripts/lib/target-worktree-close.mjs`: `underDisposable` matches `**/`
   and `*` by segments; `disposableRows`, `inspectDisposable` and
   `deleteDisposable` take the matched paths from the ignored listing, with
   the symlink and access checks kept per matched directory; the
   registration's `disposable` validation (`scripts/lib/config.mjs` 413 to
   438) admits the two forms and refuses an entry whose last segment is a
   wildcard or that has no literal segment. Check: `npm test -- --only
   target-worktree`; `npm test -- --only configuration-root`.
2. `scripts/lib/target-worktree-close.mjs` (700 to 800) with
   `scripts/lib/worktree-removal.mjs`: the kit's residue judged first; the
   target's journals moved by `retainWorktreeJournals` into main's lane for
   the order; a released writer directory, the rest of the lane, the marker,
   the installed snapshot and the temporary-root ledger deleted after the
   close prunes the ledger's roots, a held writer refused as `writer-held`
   before any deletion, every other `.runtime/` entry left to the judgment;
   `closeClean` (91) excludes the kit's marker and ledger; the record names what moved
   and what was deleted. Check: `npm test -- --only target-worktree`; `bash
   scripts/test-release.sh --case success` under the bounded wrapper.
3. `scripts/lib/release-steps.mjs` and `scripts/release.mjs`: the `children`
   rows and `totalMs` on the `worktree-removal` step (the base fetch of
   `target-worktree-close.mjs` 461 among them) and the `blocker` field with
   its closed list, assigned where each refusal is raised. Check: `npm test -- --only
   release`.
4. `scripts/lib/plan-failures.mjs` (`localReleaseCloses`): `blockers` with
   `byClass`, `byOrder` and `repeated` (a class that stopped the closes of
   three or more distinct orders, a success between them not resetting it);
   `plan start` prints the repeated line. Check: `npm test -- --only
   process-debt`.
5. `packages/skeleton/src/temporary-root-records.mjs`: the orphan's marker
   proof in `readTemporaryOwner` and `writeTemporaryOwner`; the four
   recovery cases of `verification-recovery-probes.mjs` repaired, each with
   its regression in `scripts/test-temporary-roots.mjs` or
   `scripts/test-fixture-temp-root.sh`; the token-and-inode refusal and
   every payload-retention boundary preserved. Check: `npm test -- --only
   fixture-temp-root`; `npm test -- --only harness-fixtures` (the suite that
   runs `scripts/test-temporary-roots.mjs`); `node scripts/harness.mjs
   bounded -- node docs/evidence/WO-237/verification-recovery-probes.mjs`.
6. `packages/skeleton/src/loadouts/contributor.ts`: the release-close
   sentence (101) and the common prune sentence; `npm run sync`; each root
   measured against its ceiling under the standing route. Check: `npm test
   -- --only harness`; `npm test -- --only harness-context`.
7. The kit guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`) §Owned cleanup and retention: the glob
   forms with the Nx and Vitest class example, the kit's residue, the
   blocker classes and the children timings. Check: `npm test -- --only
   launchpad`.
8. Confirm at activation that the target close's printed handoff names the
   published tag and the reviewed commit; add them if it does not; record
   the finding in the decisions.
9. Write-backs: product 07 §Workflow closeout and releases (the glob, the
   residue, the record fields) and §Operator recovery controls (the
   session runs the prune); `docs/evidence/WO-252/decisions.md` (a close
   record's children timings before and after on the fixture; the glob
   match and residue judgment measured; each root's bytes); re-mint any
   edition the runtime sources stale; `npm run meta`; `node
   scripts/lineage.mjs index --check`; `npm run publication:check`.
10. Run the fork-shaped case end to end in the target-worktree fixture: a
    registration declaring `**/node_modules` with sixteen nested caches, a
    journal lane and the `.runtime` marker in the target, closing on the
    first attempt with the record showing the moved lane, the deleted
    paths, no blocker and the children timings.
11. Handoff: integrate `main` first when it has moved (WO-233's rule);
    finish source edits; `npm run format` and `npm run sync`; the
    independent reviews the executor root requires; one `npm test --
    --review` in the background awaited with `node scripts/harness.mjs
    evidence --wait`; `docs/evidence/WO-252/handoff.md`; `npm run test:docs`
    once after the last document edit; `npm run resume --
    implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the glob forms; the residue judgment; the blocker class
and the children timings; the feed block; the orphan proof and the four
repairs; the two sentences; the kit guide and product 07.

**Acceptance criteria (all required)**

1. In the target-worktree fixture, a registration declaring
   `**/node_modules` closes a target holding `libs/a/node_modules/.vite`,
   `libs/b/node_modules/.vitest` and `node_modules/.cache` on the first
   attempt, the record listing the three under that entry with their file
   counts; a registration declaring `libs/*/dist` deletes `libs/a/dist` and
   leaves `libs/a/src/dist`; a symlinked component under a match refuses as
   a declared root does today; a registration declaring `*`, `**`, `**/*`
   or `libs/**` is refused at registration naming the floor.
2. A target holding `<documentationRoot>/control/local/harness/` journals,
   a released writer directory, the temporary-root ledger and
   `.runtime/.metadata_never_index`, none declared, closes on the first
   attempt: the journals are in main's retained lane for the order beside
   the launchpad worktree's, the released writer, the lane's remainder, the
   ledger, the marker and the installed snapshot are gone, and the record
   names each; a held writer (`writer.json` or a non-empty `writer/`) stops
   the close as `writer-held` before any deletion; an operator note, a stray
   `.env` and a file under `.runtime/` the kit did not write are still
   refused as undeclared.
3. A close that stops records `blocker.class` from the closed list with
   its step and message; the `worktree-removal` row carries `children` rows
   named `base-fetch`, `disposable-deletion` (files, bytes),
   `finder-metadata`, `journal-retention`, `git-worktree-remove`,
   `branch-delete` and `preservation`, each with `durationMs`, and a
   `totalMs` equal to the row's own `durationMs` plus its children's, while
   the seven step names and `withReleaseStep`'s nesting are unchanged.
4. `npm run plan -- failures` prints `blockers` by class and by order and
   names as repeated a class that stopped the closes of three distinct
   orders with a successful close between two of them; `plan start` prints
   the repeated line.
5. A temporary root whose owner repository no longer exists and whose
   marker carries the record's token with the record's inode is a prune
   candidate after a device renumbering and is removed by `harness prune
   --apply`; one whose inode differs stays refused; the four cases of
   `verification-recovery-probes.mjs` pass as regressions with their
   payload-retention assertions.
6. The emitted release-close root says a removal of undeclared output
   takes no session or writer in the target, every root says the session
   runs `harness prune --apply` itself and hands the printed command to the
   operator only after a recorded host denial of it, and `harness check`
   passes.
7. The kit guide and product 07 state the glob forms, the kit's residue,
   the blocker classes, the children timings and the prune rule as built;
   `npm run publication:check` is green.
8. The target close's printed handoff names the published tag and the
   reviewed commit (confirmed or added in step 8).
9. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only target-worktree` for steps 1, 2 and 10;
`npm test -- --only configuration-root` for step 1; `npm test -- --only
release` for steps 2 and 3; `npm test -- --only process-debt` for step 4;
`npm test -- --only fixture-temp-root` and `npm test -- --only
harness-fixtures` for step 5;
`npm test -- --only harness` and `npm test -- --only harness-context` for
step 6; `npm test -- --only launchpad` for step 7; `npm run test:docs` when
a document changes; each under `node scripts/harness.mjs bounded --`; then
one `npm test -- --review` (07-execution-guide.md §Preflight before the
full gate).

**Evidence gate:** the fixtures of criteria 1 to 5; the deterministic
re-mints of any edition the runtime sources stale; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 9 and criterion 7.

**Known issues and carry-ins:**

- WO-237-D009 (FUP-e872a59769b9a97a): the fork's asks 3(a) to 3(e) and 8
  are taken in steps 1 to 4 and 8; the launchpad's own push helper and the
  `update --finish` fetch of the same follow-up are WO-246's (reopen: a
  fork close is refused for the kit's own residue after this release).
- WO-237-D015 (FUP-376d333e4dcd0518) and WO-237-D013
  (FUP-134a3766852c8f77) are taken in step 5 (reopen: a reproduced
  recovery case deletes a payload that should be retained).
- WO-237's known issue that a target keeps no journals of its own is
  closed by step 2: a target bundle does journal into the target, and the
  close now moves them (reopen: a target lane holds a file class the
  retention does not list).
- The symlink-escape refusal at `intake-reconciliation.mjs` 36 is kept;
  its one occurrence's cause left with WO-247-D003 (reopen: a close is
  refused on a symlink that no retained home explains).
- The `target-worktree` suite runs about ten minutes (`plan conditions`
  2026-11-01: 611 s against a 190 s median, unexplained); this order adds
  cases to it and records the suite's duration before and after (reopen:
  the suite exceeds its median by more after this order).

**Non-goals:** a built-in deletion default; exclude files as deletion
authority; a prune at every close over the whole temporary directory; a
new phrase or skill for the prune; writing an instance's repository
profile; the launchpad's own push helper and the finish fetch (WO-246).

**Operator-review assumptions:** that `**/` and `*` are the two forms an
operator wants and a regular expression is not; that moving a target's
journals into main's retained lane is right because the launchpad's already
go there; that the fork's item 8 is answered by the printed values and the
profile stays the instance's. Reopen on the operator's word.
