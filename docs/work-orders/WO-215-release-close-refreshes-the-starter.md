# WO-215 — Core's release close refreshes DotLn-Enterprise-Starter: after a published release, `resume: release close` runs the export update (the first export, while the starter holds none) into the starter's recorded checkout inside a disposable worktree, verifies the result as an export verifies itself, pushes exactly one fast-forward commit to the starter's main, records the run and holds WO-078's receipt for the next order's change; a missing, dirty, diverged or misbound checkout or a failed verification refuses with nothing pushed and is recorded, and the operator's fork is never touched (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. The release-close phrase gains one
external effect (one fast-forward commit to a declared export sibling's
main) and its close record gains a refresh row; `worktree clone` admits a
declared export sibling's id; `worktree start` carries pending sibling
receipts into the new worktree; the first refresh of a starter that holds
no export performs that export. No command or flag is added and the hand
route (`launchpad export --update`) keeps its behavior. Assigned at
activation under the standing opt-out default.
**Cost:** adds `scripts/lib/starter-refresh.mjs` (new: the checkout and
remote checks, a disposable worktree of the recorded checkout, the update
through `planKitUpdate` and `applyKitUpdate` with the receipt held back, or
the first export through `exportKit` into an empty directory copied into
that worktree, the export's own verification, one commit, the bare-lane push, the
fast-forward and the pending receipt); a refresh row in release close's
record and summary (`scripts/release.mjs`); a pending receipt lane and its
carry at `worktree start` (`scripts/lib/siblings.mjs`,
`scripts/siblings.mjs`, `scripts/worktree.mjs`); an export-sibling
admission in `worktree clone` (`scripts/lib/target-worktrees.mjs`); the
export's self-verification factored out of `exportKit` and the two push
helpers exported unchanged (`scripts/launchpad.mjs`,
`scripts/lib/target-publish.mjs`); fixtures in `scripts/test-launchpad.mjs`,
`scripts/test-release.sh`, `scripts/test-worktree.sh`,
`scripts/test-target-worktree.mjs` and `scripts/test-siblings.mjs`; one
sentence pair in the release-close role text
(`packages/skeleton/src/loadouts/contributor.ts`). Removes the hand-run
`launchpad export --update` after each core release, the separate starter
commit and push it needed, and the receipt commit WO-078's
operator-review assumption 2 left to the change in which the operator ran
the update (FUP-efcc590126413a41). Wall-clock: each publishing release
close pays one kit preparation (`prepareKit`, `scripts/launchpad.mjs` line
821: the commit's build, the predicted bundle and the local-terms screen),
one update, an emit, a check and a kit verify inside the starter, one
commit, one fetch and one push; unknown until measured (step 12 records the
fixture's figures; the first live figure is this order's own release
close, which is a first export). The `launchpad` gate task gains at most
three kit preparations, the first export, one update and one failed
verification (FUP-b531e850b70f6d4e's watch, step 12). Context bytes: the release-close
role text grows by about two sentences at cold start (bounded by the
`harness-context` and `launchpad-docs` suites); the close summary gains one
line per declared export sibling. Commands: none added for the operator;
`worktree clone` admits one more kind of id; release close gains one
effect under its existing phrase. Tokens: unknown until run; a refusal
adds one diagnosis to the close session. Steps: none added on success; the
receipt rides in the next order's reviewed change, not a step of its own.
Re-mints: `packages/skeleton/src/loadouts/contributor.ts` is a registered
evidence source in the authority, feedback and harness inventories
(`scripts/lib/evidence-sources.mjs` lines 163, 261 and 332), so each
edition its change stales is re-minted deterministically and the harness
bundle is re-emitted; no edited file is in `FEEDBACK_SOURCE_PATHS`
(`packages/skeleton/src/feedback-audit.ts` lines 15 to 78), so no live
feedback episode is owed; `scripts/launchpad.mjs`, `scripts/release.mjs`,
`scripts/worktree.mjs` and the loadouts directory are declared machinery
sources (`scripts/test-runner.mjs` lines 114, 131, 184, 209, 219, 238, 300
and 366), so `npm test -- --review` runs before handoff. None of the other
edited scripts is a registered evidence source; the order does not edit
`scripts/lib/git.mjs`, which is.
**Nomination provenance:** filed by the 2026-10-13 standard planning pass
([planning document](../planning/standard-pass-2026-10-13.md) §5 and
§12.1) on the operator's answer to the planner's question about the
starter refresh: each core release is to reach DotLn-Enterprise-Starter on
its own, with release close running the export update, verifying, committing
and pushing it to the starter's main and recording the run, so nobody runs
the update by hand; the operator's fork takes a starter update separately,
through a dedicated planning pass that cuts the upgrade order (WO-207). The
operator makes no commits of their own and merges pull requests, so this
push is release close's own effect under the release-close phrase.
Carries FUP-efcc590126413a41 (route pass candidate 2, deferred on
2026-10-11 until the operator asked; the operator asked on 2026-10-13).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
the starter is the operator's public repository (product 03 §Platform and
instance boundary); fixtures use synthetic repository names and local bare
remotes; no local path appears in this order or may appear in its evidence.
**Depends on:** WO-078 merged (closed, v0.74.3: the declaration, the
receipt shape and the registry generator); WO-203 merged (closed, v0.79.0:
the update's planning and applying halves); WO-157 merged (closed,
v0.45.0: the hookless bare-lane push and the push-URL binding before any
rewrite); WO-201 merged (closed, v0.77.0: `launchpad verify` and the
export's in-kit gate selections that core's review gate already runs);
WO-072 merged (closed, v0.75.0: the ignored clone map and `worktree
clone`). No queued order.
**Recommended placement:** position 1 of the serial queue (planning
document §12), before WO-210: every later release, WO-210's first, then
reaches the starter, and so the operator's fork's upstream, without a
hand-run step. This order edits `scripts/release.mjs`,
`scripts/launchpad.mjs`, `scripts/worktree.mjs`,
`scripts/lib/target-worktrees.mjs`, `scripts/lib/target-publish.mjs`,
`scripts/lib/siblings.mjs`, `scripts/siblings.mjs`, the new module, five
test files, `contributor.ts` and the generated bundle, products 07, 03 and
12, `docs/PLAYBOOK.md`, `docs/AI-HARNESS-SECURITY.md` and `docs/README.md`.
WO-210 next edits `scripts/release.mjs`, `scripts/launchpad.mjs`,
`scripts/worktree.mjs` and products 07 and 03; WO-192 edits
`contributor.ts`; WO-207 edits the update path in `scripts/launchpad.mjs`.
Each rebases on this order and re-reads its anchors. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-078",
    "relation": "satisfied-by-close",
    "reason": "the sibling declaration, the five-field receipt and the registry generator a refresh records into"
  },
  {
    "workOrderId": "WO-203",
    "relation": "satisfied-by-close",
    "reason": "planKitUpdate and applyKitUpdate, the update's halves the refresh runs between its checks"
  },
  {
    "workOrderId": "WO-157",
    "relation": "satisfied-by-close",
    "reason": "the hookless bare-lane push and the push URL read before any rewrite, which the refresh reuses"
  },
  {
    "workOrderId": "WO-201",
    "relation": "satisfied-by-close",
    "reason": "launchpad verify and the export's three gate selections that core's review gate already runs"
  },
  {
    "workOrderId": "WO-072",
    "relation": "satisfied-by-close",
    "reason": "the ignored clone map and worktree clone this order extends to a declared export sibling"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 07-execution-guide.md §Operator resume
phrases — how you get dispatched (the `resume: release close` row and the
console parity sentence), §Workflow closeout and releases (the `--publish`
paragraph and the target-publish paragraph), §Documentation freshness and
ownership, §Preflight before the full gate (the **Preflight:** line below)
and §Model-specific notes; 03-architecture.md §Platform and instance
boundary (the sibling-repository paragraph and the update paragraph);
12-workstream-application.md §One workstream across repositories (the
four-repository paragraph); `docs/PLAYBOOK.md` §End-of-workflow release
task and §The loop, per work order (the clone-map paragraph);
`docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144, 2026-09-19
(the release-close paragraph); the planning document §12.1, §12.4 and
§12.11; `docs/planning/three-repository-route-2026-10-11.md` §8 (the
core-to-starter NoOp row) and §10; the map's §Candidates — returns from the
three-repository route pass (recorded 2026-10-11, second), item 2;
`docs/work-orders/WO-078-sibling-registry.md` **Design** and
operator-review assumption 2; `docs/work-orders/WO-203-update-preview.md`
**Objective**; `docs/siblings/siblings.json`; `docs/siblings/README.md`;
`scripts/launchpad.mjs` (`harnessInExport` lines 784 to 796, `prepareKit`
lines 821 to 1063 with the local-terms screen at line 1042,
`destinationNames` lines 1065 to 1079, `closeWithReceipt` lines 1085 to
1103, `exportKit` lines 1108 to 1183 with its self-verification at lines
1143 to 1165, `verifyKit` lines 1302 to 1328, `planUpdate` lines 1384 to
1435, `planKitUpdate` lines 1695 to 1797 with the instruction-file exclusion
at line 1747, `applyKitUpdate` lines 1801 to 1859, the build-hash readers
lines 1865 to 1889, `renderUpdatePlan` lines 1950 to 2004 with the re-emit
line at 2000, the CLI lines 2006 to 2079); `scripts/release.mjs`
(`releaseCloseSummary` lines 209 to 257, `ensureTrackedClean` lines 290 to
296, `ensureOriginReachable` line 317, `updateMain` lines 1716 to 1728,
`close` lines 2258 to 2490 with the target path at 2299 to 2319, the
lower-version path at 2365 to 2379, the equal-version path at 2385 to 2422,
the prepared path at 2462 to 2467 and the published path at 2469 to 2490,
the close record and writer release in `main` lines 2829 to 2956);
`scripts/lib/siblings.mjs` (`decodeReceipt` line 169, `receiptPath` line
191, `resolveReceipt` lines 199 to 217, `writeReceipt` lines 233 to 266,
`readReceipts` lines 271 to 322); `scripts/siblings.mjs` (`writeRegistry`
line 298); `scripts/lib/target-worktrees.mjs` (`cloneMapPath` lines 17 to
18, `writeMap` lines 62 to 76, `recordRepositoryClone` lines 88 to 94);
`scripts/worktree.mjs` (`clone` lines 583 to 589, `start` lines 598 to 701,
usage line 1042); `scripts/lib/target-publish.mjs` (`pushUrl` lines 172 to
196, `pushObservedCommit` lines 197 to 242); `scripts/lib/github-repository.mjs`
(`HOST_GIT_READ` lines 6 to 17, `parseGitHubTarget` lines 41 to 83);
`packages/skeleton/src/loadouts/contributor.ts` (`releaseCloseRemedy`
lines 75 to 76, the release-close facet lines 178 to 193, the target form
lines 539 to 551); `scripts/test-runner.mjs` (the `launchpad`, `release`,
`siblings` and `siblings-fixtures` rows at lines 721, 761, 803 and 810;
`kit-verify` at line 648); the fixtures at `scripts/test-launchpad.mjs`
lines 114, 680, 741, 1921 to 2110 and 2355 to 2364,
`scripts/test-target-publish.mjs` lines 247 to 264 and 499 to 508,
`scripts/test-release.sh` lines 70 to 96, `scripts/test-worktree.sh` line
97 and `scripts/test-target-worktree.mjs` lines 189, 472 and 503;
`docs/evidence/WO-201/gate-in-kit.json`.

**Objective:** Every core release reaches DotLn-Enterprise-Starter with no
hand-run step. After `release close WO-NNN --publish` has published (or
re-confirmed) the tag and its Release, the helper, in a launchpad whose
sibling declaration names an export sibling with a recorded local checkout,
runs the export update for the released commit into a disposable worktree
of that checkout (or, while the starter holds no `KIT-MANIFEST.json`, the
first export of that commit), verifies the result the way an export verifies itself,
commits it once and pushes that commit as a fast-forward of the starter's
`main` to the starter's own repository, fast-forwards the checkout, writes
WO-078's receipt into main's ignored lane for the next `worktree start` to
carry into a reviewed change, and records the run in the close record and
summary. A missing, dirty, diverged or misbound checkout, a refused plan
row or a failed verification refuses before any push, leaves the checkout
and the remote as they were, and is recorded as a close blocker with the
same retry command. Nothing is pushed anywhere else: not core's main, not
a tag, not another branch, and never the operator's fork.

**Observed gap (dated 2026-10-13 at main `6dbd8771`, tag `v0.80.0`):**

- Release close publishes only the tag and its Release. `close` reads no
  sibling declaration (`scripts/release.mjs` names a sibling only in a
  comment about worktrees, line 355), product 07 §Workflow closeout and
  releases says never to push main, and both forms of the release-close
  role text say to publish only the tag and Release and never push main
  (`contributor.ts` lines 192 and 550).
- The update writes files, not commits. `applyKitUpdate` journals the
  planned manifest, writes the plan's rows and the manifest
  (`scripts/launchpad.mjs` lines 1801 to 1831) and then writes the receipt;
  it never commits, pushes, emits or checks inside the destination. The
  operating contract is excluded from the candidates (line 1747) and the
  rendered plan ends by telling the reader to re-emit (line 2000).
- The receipt lands in the launchpad's tracked tree.
  `closeWithReceipt` writes `docs/evidence/siblings/<id>/<date>.json` and
  regenerates `docs/siblings/README.md` and `docs/siblings/tag-observations.json`
  in the launchpad (lines 1085 to 1103). Release close runs in main, refuses
  tracked dirt before publication (`ensureTrackedClean`, lines 290 to 296,
  called at line 2485) and on the next close (`updateMain`, line 1717), and
  pushes no main commit; so an update run from release close as it stands
  would leave main dirty with nobody to commit it.
- No refresh has been recorded. `docs/evidence/siblings/` holds no file at
  `6dbd8771` (`git ls-tree` lists none) and the registry reads "not
  evidenced" in every receipt field of the starter's entry.
- The starter holds no export (observed read-only with `gh` by the planner
  at 2026-10-13T18:57Z). DotLn-Enterprise-Starter is public with one
  commit, "Initial commit" (2026-09-20T00:40:22Z); its root has no
  `KIT-MANIFEST.json` (the contents API answered 404); `main` is not
  branch-protected; it has 0 forks, so the operator's fork does not exist
  yet. DotLn-Angular likewise holds only its initial commit of
  2026-09-20. The update path alone would therefore refuse at this order's
  own release close, and since the operator makes no commits of their own,
  nobody else would make the first export.
- `exportKit` needs an empty destination and initializes its own
  repository (`checkDestination` lines 247 to 266; `exportKit` runs `git init` in
  the destination at line 1130), so it cannot write into a clone that
  already holds a commit.
- No checkout is declared. The only record of a local clone is the ignored
  clone map, and `recordRepositoryClone` admits only an id declared under
  `repositories` in `dotln.config.json` (`scripts/lib/target-worktrees.mjs`
  lines 88 to 94); core has no `dotln.config.json`. The sibling declaration
  names the starter as an `export` sibling by its public repository name and
  holds no path (`docs/siblings/siblings.json`); product 03 §Platform and
  instance boundary links it under the same owner as core's origin.
- The parts exist. Target publish pushes one observed commit from a
  host-created bare repository with hooks off, to origin's configured push
  URL read before any rewrite and bound to the expected repository
  (`scripts/lib/target-publish.mjs` lines 172 to 242, WO-157). An export
  verifies itself by its own emit, a comparison with the predicted bundle
  and its own check (`scripts/launchpad.mjs` lines 1143 to 1165), and
  `launchpad verify` checks carried runtime bytes against the manifest
  (lines 1302 to 1328). Core's review gate already exports the commit's kit
  and runs its three gate selections inside it in the `launchpad` suite
  (`scripts/test-launchpad.mjs` line 741; the kit's own `npm test` ran in
  41.7 s, `docs/evidence/WO-201/gate-in-kit.json`).
- FUP-efcc590126413a41 deferred the automation on 2026-10-11 until the
  operator asked or three hand-run updates were recorded; the operator asked
  on 2026-10-13 (planning document §12.1).

**Design (scope discipline):**

- **Only after a published release, only to a declared export sibling.**
  The refresh runs in `close` after the tag and Release exist, on the
  published path and on the equal-version path when `--publish` is given,
  after cleanup, so a refresh outcome never changes the publication or
  cleanup outcome. It never runs for a target order, a lower-version
  close, a prepared close without `--publish` or a dry run (which
  previews). It runs once per sibling the launchpad's declaration names with
  `relation.kind` `export`; an exported instance carries no declaration
  (`docs/siblings/` is not a kit document, `KIT_FILES`), so the operator's
  fork and every other instance refresh nothing.
- **The checkout is recorded once, outside Git.** `worktree clone
  <sibling-id> <absolute-path>` records it in the existing ignored clone map
  when the id names a declared export sibling. The path never enters a
  committed file, the close record's refresh row or the summary. An
  unrecorded checkout is a refusal that names the command shape; the role
  asks the operator for the path.
- **The push target is bound, not configured.** The checkout's origin push
  URL, read before any rewrite (`pushUrl`), must name
  `<core's origin host>/<core's origin owner>/<sibling id>`; core's origin
  is the GitHub repository release close already proves reachable. A fork
  on the operator's account cannot share that name, and the push goes only
  to `refs/heads/main` of that URL, through the bare lane with hooks and
  the checkout's own configuration off, with no tags and no force; a
  non-fast-forward is the remote's refusal.
- **Checks before any write, in order:** main's HEAD is the published tag's
  commit (otherwise the row is `skipped`: main has moved past the tag and
  the next release refreshes the starter); the checkout is recorded, a
  physical Git top level and not main itself; it is on `main`;
  `git status --porcelain --untracked-files=all` is empty; the push URL is bound; after a hookless `git fetch origin main`
  its `main` equals `origin/main`, or is behind it and is fast-forwarded
  first, and otherwise (ahead or diverged) refuses; `origin/main` exists
  (an empty remote refuses). With no `KIT-MANIFEST.json` on `origin/main`
  the row takes the first-export path below. A manifest that already names
  the released commit makes the row `current` and nothing is pushed; one
  naming a descendant of the released commit (a later release already
  reached the starter) makes it `skipped`; one naming a commit that is
  neither refuses.
- **The update runs in a disposable worktree.** A detached worktree of the
  checkout at `origin/main`, under the system temporary directory, takes
  the update, the emit and the commit; it is removed whatever the outcome.
  A failed refresh therefore leaves the checkout clean and at its prior
  commit, and nobody has to reset it. Declined: updating the checkout in
  place (a failure would leave uncommitted kit files that only a
  destructive reset clears, and no role may discard work); a fresh clone
  per release (the operator's direction names a starter checkout, and the
  dirty and diverged refusals keep it honest at no clone cost).
- **The update is the existing one.** `planKitUpdate(worktree, { launchpad:
  main })` without `--apply`; its resolved sibling must be the one being
  refreshed; any `refuse` row (a locally modified kit file or an
  instance-owned collision) refuses, because the starter holds no instance
  material and must equal the kit. `applyKitUpdate` runs with the receipt
  held back (a receipt resolution with no sibling, so `closeWithReceipt`
  writes nothing in main, lines 1085 to 1087). Instance actions are not
  applied; the row lists them as the update's renderer does.
- **The first export, once.** While `origin/main` holds no
  `KIT-MANIFEST.json`, the refresh runs the existing `exportKit` (default
  license, never `--license none`) into an empty directory under the
  system temporary directory; the export verifies itself there as it
  always does, and its destination resolves to no declared sibling, so it
  writes no receipt in main. The export's committable tree (its non-ignored
  files, `git ls-files --cached --others --exclude-standard`, the
  `AGENTS.md` symbolic link kept a link) is then copied over the disposable
  worktree, which sits at the initial commit. A path of the initial commit
  that the export also writes takes the export's bytes; one the export does
  not write is kept; the row lists both by repository-relative name. A
  path where the initial commit holds a directory or a non-regular file and
  the export writes a file, or the reverse, refuses. The worktree then gets
  the same verification as an update, the commit sits on top of the
  initial commit, and the row is `refreshed` with `firstExport: true`.
  Every later release takes the update path.
- **Verification is the export's own.** In the worktree: the workspace
  links, the starter's own `node scripts/harness.mjs emit`, every predicted
  bundle surface compared with what the emit wrote (the operating contract
  by its marked block, as `harness check` reads it, because the starter's
  floor is a seed the update never refreshes), the starter's own
  `node scripts/harness.mjs check`, then its own `node scripts/launchpad.mjs
  verify`. The staged change set must be exactly the plan's changed rows,
  `KIT-MANIFEST.json` and `CLAUDE.md` (for a first export: exactly the
  export's tree, with no deletion); anything else refuses. Declined:
  `npm ci` and the kit's own `npm test` in the starter (release close runs
  no suite or install, and core's review gate, whose row release close
  consumes at the code identity the merged source must share, already
  exported a committed copy of the same kit sources and ran the kit's three
  gate selections inside it in the `launchpad` suite, `scripts/test-launchpad.mjs`
  lines 230 to 283 and 741).
- **One commit, one fast-forward.** The commit's parent is the starter
  remote's `main` head; its message is a fixed template (a subject naming
  the release tag, a body naming the core commit, the manifest hash and the
  build hash) with no attribution trailer; it runs with hooks off and the
  host's configured identity. After the push the checkout's `main` and its
  tracking ref are fast-forwarded to the pushed commit.
- **The receipt rides in the next order's change.** After a successful push
  the refresh writes WO-078's five-field receipt, unchanged in shape and
  file name, into a pending lane under main's ignored control-local root,
  never into main's tracked tree. The next `worktree start` copies each
  pending receipt into the new worktree's evidence root, regenerates the
  registry there and removes the pending file, so the receipt enters main
  with that order's reviewed commit, as WO-078's assumption 2 intended for
  the change in which the update ran. A `current` row writes a pending
  receipt only when no committed or pending receipt records the starter's
  manifest hash, which recovers a push whose receipt write failed. Declined:
  release close committing to core's main (forbidden; the operator merges);
  a pull request in core for the receipt (a second publication the
  operator did not ask for); leaving the registry stale (WO-078's removal of
  the manual lookup would lapse).
- **A refusal is a close blocker, not a publication failure.** The refresh
  never throws out of `close` and never changes `record.publication`. A
  refused row adds a blocker (`action: "starter-refresh"`, the reason and
  the same retry command), sets a nonzero exit so the dispatch's writer stays
  reserved, and the role reports it without cleaning, resetting or
  committing in the starter checkout. A `current` or `skipped` row is no
  blocker. A retry is the same command; it finds the published release,
  then refreshes or reports `current`.
- **Imports stay lazy.** `close` imports the refresh module only when the
  declaration names an export sibling (as it imports
  `target-worktree-close.mjs`, line 2306); the module imports
  `scripts/launchpad.mjs` only at the update step, so every refusal before
  it runs without the export's sources.

**Execution plan (the executor follows these steps in order; observed at `6dbd8771`, 2026-10-13):**

1. Base observation, no code: create `docs/evidence/WO-215/README.md`
   recording, at the base, that `docs/evidence/siblings/` holds no file
   and the registry's starter entry reads "not evidenced"; the starter's
   `main` re-observed read-only (`git ls-remote` and a fetch into a
   scratch clone under the system temporary directory when egress is
   available, otherwise `unknown` with the command tried; never a push):
   its commits, whether `KIT-MANIFEST.json` exists, and the initial
   commit's paths by name, against the planner's 2026-10-13T18:57Z
   reading (one initial commit, no manifest);
   and the `launchpad` gate task's latest fresh duration from the gate
   rows. No local path is written. Check: `npm run test:docs`.
2. `scripts/lib/siblings.mjs`: `exportSiblings(declaration)` (the entries
   whose relation is `export`); `pendingReceiptPath(root, sibling, date)`
   under the control root's ignored `local/` directory through
   `docRelative` (the `configuration-root` suite refuses a literal root);
   `writeReceipt(root, fields, { pending })` writing the same five fields
   and file name there; `readPendingReceipts(root, declaration)` decoding
   each with `decodeReceipt` (line 169) and refusing by path a malformed
   file or an undeclared sibling; `receiptRecorded(root, sibling,
   manifestHash)` over committed and pending receipts. Check:
   `scripts/test-siblings.mjs` cases for each (a pending receipt written,
   read back and refused when malformed; the committed registry unchanged
   by a pending write); `npm test -- --only siblings-fixtures`.
3. `scripts/lib/target-worktrees.mjs` (`recordRepositoryClone`, lines 88 to
   94) and `scripts/worktree.mjs` (`clone`, lines 583 to 589; usage line
   1042): admit an id the launchpad's declaration names as an export
   sibling, besides a registered repository; a consumer sibling and an
   undeclared id refuse with today's message; the map stays ignored and
   untracked (`writeMap`, lines 62 to 76). Check:
   `scripts/test-target-worktree.mjs` cases beside the clone mapping at
   line 189; `npm test -- --only target-worktree`.
4. `scripts/launchpad.mjs`: move the export's self-verification (workspace
   links, lines 1143 to 1150; emit, predicted-surface comparison and check,
   lines 1151 to 1165) into an exported `verifyExportTree(target, bundle,
   { instructionBlock })` that `exportKit` calls with its whole-file
   comparison unchanged; with `instructionBlock` the operating contract is
   compared by its marked block. Export the build-hash reader of a
   committed harness manifest (lines 1865 to 1889) for the `current` row's
   receipt. `exportKit` itself is unchanged; the first export calls it as
   it is. `scripts/lib/target-publish.mjs`: export `pushUrl` and
   `pushObservedCommit` unchanged. Check: `npm test -- --only launchpad`
   (existing export cases) and `npm test -- --only target-publish`.
5. `scripts/lib/starter-refresh.mjs` (new): `refreshStarters({ main,
   head, tag, dryRun })` returning one row per declared export sibling, in
   the order the Design gives: the checks before any write; the `current`
   and ancestry decisions from `origin/main:KIT-MANIFEST.json`; the
   disposable detached worktree (removed in a `finally`, with the first
   export's temporary directory); while no manifest exists, `exportKit`
   into the temporary directory, the copy of its committable tree with the
   kept and replaced initial paths listed, and the type-collision refusal;
   otherwise `planKitUpdate`
   with the sibling identity and refused-row checks; `applyKitUpdate` with
   the receipt held back; `verifyExportTree` with the marked-block
   comparison and the starter's own `launchpad verify`; the staged-set
   check; the hookless commit from the fixed template; `pushObservedCommit`
   to the bound URL as `<commit>:refs/heads/main` (it fetches a named
   branch from the repository it is given, so the commit sits on a
   temporary branch of the checkout that the `finally` deletes); the
   checkout's fast-forward; the pending receipt. A row holds the sibling id, the
   outcome (`refreshed`, `current`, `skipped` or `refused`), `firstExport`
   (true only for a first export, with the kept and replaced initial
   paths), the starter's commit
   before and after, the tag, the core commit, the manifest and build
   hashes, the pending receipt's repository-relative path and the reason;
   never the checkout's path. A dry run performs the checks with the fetch
   and returns `would refresh <before> to <head>` with no worktree, no
   write in the checkout's work tree and no push. The module names no
   document root and its comments carry no report labels. Check: step 6.
6. `scripts/test-launchpad.mjs`: one test over local bare remotes. A
   declared `starter-fixture` export sibling (as the WO-078 case, lines 1921
   to 1941); the fixture core's origin and the starter's origin under one
   fixture owner, each a GitHub URL rewritten to a local bare repository by
   a fixture-global `url.<bare>.insteadOf` (as
   `scripts/test-target-publish.mjs` lines 499 to 508); a committed starter
   export (`commitExport`, line 114) cloned bare (as the preview case, lines
   2355 to 2364) and a checkout of it recorded with `worktree clone`; a kit
   change committed and tagged in the fixture core. The starter's bare
   remote starts with only an initial commit (a `README.md` the export
   replaces and one file it does not write), as the real starter does.
   Cases, in this order: (j) first export: the bare remote's `main` gains
   exactly one commit whose parent is the initial commit, as a
   fast-forward with no other ref or tag; the commit holds the export's
   tree and `KIT-MANIFEST.json` naming the fixture core's commit and tag;
   the initial `README.md` carries the seed's bytes and the other initial
   file is kept, both listed in the row; a fresh clone passes `launchpad
   verify` and `harness check`; the row is `refreshed` with
   `firstExport: true`; a pending receipt holds the committed manifest's
   hash; the fixture core's tracked and untracked non-ignored state is
   unchanged; and a second initial-commit remote whose initial commit holds
   a directory where the export writes a file refuses with nothing pushed;
   then a further kit change committed and tagged in the fixture core, and
   (a) update success: the
   bare remote's `main` gains exactly one commit whose parent is its prior
   head, no other ref changes and no tag appears, the commit's
   `KIT-MANIFEST.json` names the fixture core's commit and tag, a fresh
   clone of the bare remote passes `launchpad verify` and `harness check`,
   the checkout is clean at the pushed commit, no worktree remains, the
   pending receipt holds the five fields with the committed manifest's hash,
   and the fixture core's tracked and untracked non-ignored state is
   unchanged; (b) a rerun is `current` and pushes nothing; (c) the
   checkout reset to its prior commit is behind, is fast-forwarded and is
   `current`; (d) a tracked edit and, separately, an untracked file refuse
   before any write; (e) a local commit (ahead) and a commit pushed to the
   bare remote from a second clone plus a local commit (diverged) refuse;
   (f) an origin naming another repository, and one naming the same
   repository under another owner, refuse before the fetch; (g) a starter
   whose committed `CLAUDE.md` holds no floor outside the generated block
   fails the emit: refused, nothing pushed, the checkout clean at its prior
   commit, no worktree and no pending receipt; (h) a fixture launchpad with
   no declaration returns no row; (k) the dirty, ahead and misbound
   refusals of (d) to (f) hold on an initial-commit remote too (one case
   each, before any preparation); (i) a fixture core whose HEAD is one
   commit past the tag, and separately a starter whose manifest names a
   later fixture-core commit, are `skipped` with nothing written. The
   committed starter export of the earlier fixture setup is replaced by
   case (j)'s first export, so only (j), (a) and (g) prepare a kit; the
   test's diagnostic records each case's wall-clock. Check:
   `npm test -- --only launchpad`; `npm test -- --only configuration-root`.
7. `scripts/release.mjs`: in `close`, after `finishPublishedWorktree` on
   the published path (line 2486) and on the equal-version path when
   `--publish` is given (line 2418), import the module (only when the
   declaration names an export sibling) and call `refreshStarters` with
   main, HEAD and the tag; on the dry-run paths (lines 2399 to 2405 and
   2452 to 2458) call its preview; on the target, lower-version and
   prepared paths call nothing. Initialize `record.starterRefresh` as an
   empty list in `main`'s record (lines 2829 to 2865) and store the rows;
   a refused row pushes a blocker `{ action: "starter-refresh", reason,
   command: releaseCloseCommand(root, workOrderId) }` and sets
   `process.exitCode = 1`, so the writer stays reserved (lines 2893 to
   2920); the refresh never throws out of `close` and never writes
   `record.publication`. `releaseCloseSummary` (lines 209 to 257) prints one
   line per row: `Starter refresh <id>: <outcome>` with the before and after
   commits or the reason. Check: step 8.
8. `scripts/test-release.sh`: starter cases in the fixture (lines 70 to
   96), each over local bare remotes and copying whatever the module
   imports: (a) with no declaration every existing case passes unchanged
   and the record's `starterRefresh` is empty; (b) a declared export
   sibling with no recorded checkout: the tag and Release are published,
   the publication outcome is `published`, the summary names the blocker
   and the same retry command, the exit status is 1 and the writer is
   retained; (c) a recorded checkout whose origin names another repository
   is refused before the fetch and its bare remote is unchanged; (d) a
   recorded checkout whose `origin/main` manifest already names the
   published commit is `current`: no push, no blocker, the writer released,
   and one pending receipt written; (e) `--dry-run` prints the refresh
   preview and writes nothing; (f) a lower-version close and a close
   without `--publish` attempt no refresh; (g) in
   `scripts/test-target-worktree.mjs`, the target release close it already
   drives (beside line 503) records no refresh row with an export sibling
   declared. None of these cases prepares a kit. Check:
   `npm test -- --only release`; `npm test -- --only target-worktree`;
   `npm test -- --only process-debt`; `npm test -- --only
   launchpad-planning`.
9. `scripts/worktree.mjs` (`start`, lines 598 to 701) with
   `scripts/siblings.mjs` and `scripts/lib/siblings.mjs`: after
   `ensureClean(mainPath)` (line 624) and before any worktree exists, read the pending
   receipts (a malformed one refuses start with nothing created); once the
   launchpad worktree exists, on the self route and the target route, and
   before activation, copy each pending receipt unchanged into the
   worktree's evidence root (refusing a differing file already there),
   regenerate the worktree's registry (`writeRegistry`, `scripts/siblings.mjs`
   line 298), then remove the pending files and print one line naming the
   carried receipts. A regeneration failure keeps the worktree and the
   pending files and names the retry, as the bootstrap failure does. The
   carry imports `scripts/siblings.mjs` only when a pending receipt exists.
   Check: `scripts/test-worktree.sh` cases after the start at line 97 (a
   pending receipt for a declared export sibling is carried, `node
   scripts/siblings.mjs index --check` passes in the subject, main is clean
   and the pending lane empty; a malformed pending receipt refuses start
   with no worktree and no branch); `npm test -- --only worktree`;
   `npm test -- --only harness-fixtures`; `npm test -- --only siblings`.
10. `packages/skeleton/src/loadouts/contributor.ts`: in the release-close
    facet (lines 178 to 193) and its target form (lines 539 to 551), the
    description and the helper sentence (lines 191 and 549) name the
    refresh: where the launchpad declares an export sibling, the helper
    then refreshes its recorded checkout and pushes one fast-forward commit
    to that sibling's main; the publish-only sentence (lines 192 and 550)
    admits exactly that one further effect and still forbids Release
    edits, pushes to core's main or to any other branch or repository, force
    pushes, merges, package publication and settings changes; one sentence
    says a starter-refresh refusal is a blocker the session reports, asking
    the operator one focused question when the checkout is unrecorded or
    dirty, and never cleans, resets or commits in the starter checkout.
    Then `npm run build` and `npm run harness -- emit`. Check:
    `npm run harness -- check`; `npm test -- --only harness`;
    `npm test -- --only harness-context`; `npm test -- --only launchpad-docs`.
11. Re-mints: after the build and emit, run each edition's check
    (`node scripts/authority-evidence.mjs --check`,
    `node scripts/feedback-evidence.mjs --check` and the harness edition's
    check) and re-mint deterministically under this order each one the
    change stales, the feedback edition by `--carry` when only pins moved
    (`scripts/feedback-evidence.mjs` lines 255 to 283). Check:
    `npm test -- --only authority-evidence`; `npm test -- --only
    feedback-evidence`; `npm test -- --only harness-evidence`;
    `npm test -- --only evidence-sources`; `npm test -- --only
    runner-fixtures`.
12. Measurement: record in the evidence README the fixture's per-case
    wall-clock from step 6 (the success case split into preparation,
    update, verification, commit and push) and the `launchpad` task's fresh
    duration at the order's first review gate beside step 1's reading;
    judge FUP-b531e850b70f6d4e's reopening condition and record the judgment
    in the decisions file. Check: the README holds both sets.
13. Write-backs (each heading re-read at the base; each lands in place):
    product 07 §Operator resume phrases — how you get dispatched: the
    `resume: release close` row's last cell adds that the helper refreshes
    each declared export sibling with a recorded checkout;
    product 07 §Workflow closeout and releases: one paragraph, **Starter
    refresh (WO-215).**, stating that after the tag and Release exist the
    phrase authorizes exactly one further external effect, one commit
    pushed as a fast-forward to the `main` of each declared export
    sibling, bound to core's origin owner and the sibling's name, from the
    recorded checkout through a disposable worktree; the checks and
    refusals; the verification; the pending receipt and its carry at the
    next `worktree start`; the record row; a refusal as a blocker with the
    same retry; and the setup through `worktree clone`; the sentence that
    forbids pushing main names core's main and keeps the rest of the list;
    product 03 §Platform and instance boundary: one sentence that release
    close refreshes the starter after each release (WO-215) and an instance
    takes an update through its own planning pass (WO-207);
    product 12 §One workstream across repositories: the starter sentence
    this pass wrote in the future tense becomes present, dropping the
    hand-run fallback;
    `docs/PLAYBOOK.md` §End-of-workflow release task: the sentence saying
    neither form pushes a main commit says neither pushes to core's main,
    and the publish form also pushes the starter refresh's one commit when
    an export sibling's checkout is recorded; §The loop, per work order:
    the clone-map paragraph names the export-sibling form;
    `docs/AI-HARNESS-SECURITY.md` §DotLn hook boundary — WO-144,
    2026-09-19: the release-close paragraph names the refresh push and its
    hookless lane;
    `docs/README.md` §Map: the evidence line says the `siblings/`
    receipts also come from release close's starter refresh, carried by
    the next `worktree start`;
    `docs/evidence/WO-215/decisions.md`: the receipt route and its declined
    alternatives, the disposable worktree, the verification set and the
    declined in-starter gate, the push binding, the refusal-as-blocker
    rule, the commit identity and signing choice, the seeds and instance
    actions left alone, and the launchpad-task judgment; `npm run meta`;
    `npm run publication:check`; `node scripts/check-publication.mjs
    --print-locks` if a locked section changed. Product 07 stays under its
    ceiling in `docs/control/doc-ceilings.json`.
14. Handoff sequence: `npm run format`; `npm run test:docs`;
    `npm test -- --review`; complete `docs/evidence/WO-215/handoff.md`;
    `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the refresh module and its fixtures; the release-close
wiring, record row, summary line and dry-run preview; the export-sibling
clone admission; the pending receipt lane and its carry at `worktree
start`; the factored export self-verification and the exported push
helpers; the role text, the regenerated bundle and the re-mints; the
measurements; the decisions; the write-backs below.

**Acceptance criteria (all required)**

1. `release close WO-NNN --publish`, after the tag and Release exist (the
   published path and the equal-version retry), in a launchpad whose
   declaration names an export sibling with a recorded checkout, pushes
   to that sibling's repository exactly one commit whose parent is the
   remote `main` head, as a fast-forward of `refs/heads/main`, with no
   other ref and no tag changed and no force; the commit's
   `KIT-MANIFEST.json` names the released commit and tag; the checkout ends
   clean at the pushed commit and no disposable worktree remains; main's
   tracked and untracked non-ignored state is unchanged (step 6, case a).
   While the starter's `origin/main` holds no `KIT-MANIFEST.json`, the same
   close performs the first export instead: one commit on top of the
   remote's head holding the export's tree (initial-commit paths the export
   writes take its bytes, others are kept, both listed), pushed as a
   fast-forward of `main`, verified as criterion 2 requires, recorded
   `refreshed` with `firstExport: true`; a file/directory collision with
   the initial commit refuses with nothing pushed; every later release
   takes the update path (step 6, case j).
2. The refreshed tree passes the export's own emit with every predicted
   surface equal (the operating contract by its marked block), its own
   `harness check` and its own `launchpad verify`, and its staged change set
   is exactly the plan's changed rows, `KIT-MANIFEST.json` and `CLAUDE.md`.
   A refused plan row, a failed emit, check or verify, or any other staged
   path refuses with nothing pushed, the checkout clean at its prior commit,
   no worktree and no receipt (step 6, case g).
3. Each of these refuses before any write in the checkout or the remote,
   naming the reason: no recorded checkout; a recorded path that is not a
   physical Git top level or is main itself; a checkout not on `main`;
   tracked or untracked non-ignored changes; a local `main` ahead of or
   diverged from `origin/main` after the fetch; an origin push URL, read
   before any rewrite, that does not name core's origin host and owner and
   the sibling's id; no `main` on the remote; a starter
   manifest naming a core commit that is neither an ancestor nor a
   descendant of the released commit. A checkout behind its remote is
   fast-forwarded first. These refusals hold on the first-export path too.
   Main's HEAD past the published tag, or a starter manifest naming a
   descendant of the released commit, makes the row `skipped` with no
   blocker (step 6, cases c to f, i and k).
4. A rerun after a refresh reports `current` and pushes nothing; a
   `current` row writes a pending receipt only when no committed or pending
   receipt records the starter's manifest hash (step 6, case b; step 8,
   case d).
5. Every row is recorded in `release-close.json` (`starterRefresh`) and the
   summary prints one line per row; neither names the checkout's path. A
   refused row adds a `starter-refresh` blocker with the same retry
   command, exits nonzero and keeps the dispatch's writer; the publication
   outcome, tag and Release are unchanged by any refresh outcome (step 8,
   cases b to d).
6. No refresh is attempted for a launchpad with no export sibling declared
   (an exported instance, the operator's fork), a target order, a
   lower-version close, a close without `--publish`, or a dry run, which
   prints the preview and writes nothing; the refresh fetches and pushes
   only the bound starter URL (step 6, case h; step 8, cases a, e, f and g).
7. After a successful push the receipt, in WO-078's five fields and file
   name, is written only to main's ignored pending lane. The next `worktree
   start` copies each pending receipt into the new worktree's evidence
   root, regenerates the registry there (its `index --check` passes), leaves
   main clean and empties the lane; a malformed pending receipt refuses the
   start with no worktree and no branch (steps 2 and 9).
8. `worktree clone <id> <absolute-path>` records a declared export
   sibling's checkout in the ignored clone map; a consumer sibling and an
   undeclared id refuse as before (step 3).
9. Every fixture reaches only local bare remotes behind GitHub URLs
   rewritten in fixture-global Git configuration; no test fetches from or
   pushes to a network remote; the `launchpad` suite gains at most three
   kit preparations (the first export, one update, one failed
   verification); the evidence records the cases' wall-clock and the
   `launchpad` task's duration before and after, with the judgment of
   FUP-b531e850b70f6d4e's condition (steps 6, 8 and 12). No duration binds
   this criterion.
10. Both forms of the release-close role text name the refresh as the
    helper's one further external effect, forbid every other push, force
    and merge, and make a refusal a reported blocker that never cleans,
    resets or commits in the starter checkout; the bundle is regenerated
    and `npm run harness -- check` passes (step 10).
11. Write-backs land in place with no dated paragraph: product 07 (the
    release-close row and §Workflow closeout and releases, including the
    authority sentence), product 03, product 12, `docs/PLAYBOOK.md`,
    `docs/AI-HARNESS-SECURITY.md`, `docs/README.md` and the decisions file;
    publication locks refreshed if a locked section changed; product 07
    within its ceiling.
12. `npm test -- --review` and `npm run test:docs` green; the deterministic
    re-mints of the editions `contributor.ts` stales (authority, feedback
    and harness, as their checks report) recorded; no live feedback episode
    is owed; `git diff --check` clean; no new dependency.

**Preflight:** `npm test -- --only siblings-fixtures` for step 2,
`npm test -- --only target-worktree` for step 3,
`npm test -- --only launchpad` and `npm test -- --only target-publish` for
step 4, `npm test -- --only launchpad` and `npm test -- --only
configuration-root` for steps 5–6, `npm test -- --only release`,
`npm test -- --only target-worktree`, `npm test -- --only process-debt`
and `npm test -- --only launchpad-planning` for steps 7–8, `npm test -- --only worktree`,
`npm test -- --only harness-fixtures` and `npm test -- --only siblings` for
step 9, `npm test -- --only harness`, `npm test -- --only harness-context`
and `npm test -- --only launchpad-docs` for step 10,
`npm test -- --only authority-evidence`, `npm test -- --only
feedback-evidence`, `npm test -- --only harness-evidence`,
`npm test -- --only evidence-sources` and `npm test -- --only
runner-fixtures` for step 11, and `npm run test:docs` when a document
changes (steps 1, 12 and 13), each under `node scripts/harness.mjs
bounded --`; then one `npm test -- --review` (07-execution-guide.md
§Preflight before the full gate).

**Evidence gate:** the fixtures under `npm test -- --only launchpad`,
`release`, `worktree`, `target-worktree` and `siblings-fixtures`;
`npm run harness -- check`; each edition's check after its re-mint;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(declared machinery sources change) and again at final review. No
criterion needs a model run or a push to a real repository; the first live
refresh is this order's own release close (operator-review assumption 5).

**Write-back duty:** as listed in criterion 11 and step 13.

**Known issues and carry-ins:**

- FUP-efcc590126413a41 is allocated here; its reopening condition (the
  operator asks) occurred on 2026-10-13.
- WO-078's operator-review assumption 2 put the receipt in the change in
  which the operator ran the update, and named receipt 009's bookkeeping
  concern if that commit counted as bookkeeping. Here the receipt rides in
  the next order's reviewed commit, with no commit of its own; the
  decisions file says so for the final reviewer, who sees
  `docs/evidence/siblings/` and `docs/siblings/` change in a subject that
  did not run the update.
- The planner observed the starter at 2026-10-13T18:57Z with one initial
  commit and no export, so this order's own release close is a first
  export. Step 1 re-observes it at the base; the initial commit's paths
  that the export does not write stay in the starter and are listed in the
  row.
- The starter's seeds (`README.md`, `.gitignore`, the `CLAUDE.md` floor,
  `AI-HARNESS-SECURITY.md`, the seeded root READMEs) are never refreshed:
  the update writes manifest-listed kit files only, and a template change
  reaches the starter under `scripts/kit/`. Reopen when a seed template
  change must reach the starter's own copy.
- Kit instance actions are not applied in the starter; the row lists the
  declared actions as `preserved/no opt-in`. Reopen when a declared action
  targets a path the starter holds.
- FUP-5c2082d9fc28dbbf (WO-075 D017: export reads honor replace refs) stays
  deferred: the refresh's preparation reads core's main as every export
  does, and this checkout listed no `refs/replace` ref on 2026-10-13; its
  reopening condition is unchanged.
- FUP-b531e850b70f6d4e watches the `launchpad` task; step 6 limits the
  suite to three kit preparations (the starter export the case needs in
  any form, one update, one failed verification) and step 12 records the
  judgment.
- `HOST_GIT_READ` sets both signing programs to `/usr/bin/false`
  (`scripts/lib/github-repository.mjs` lines 6 to 17). If the host's
  global configuration signs commits, a commit under that whole set fails;
  the executor decides whether the refresh commit runs with hooks off only,
  signing following the host's configuration, and records it.
- The starter's `main` was not branch-protected at 2026-10-13T18:57Z. If
  protection is added later, the remote refuses the direct push and the row
  records it.
- The resident console serves the same release-close helper (product 07
  §Operator resume phrases — how you get dispatched), so a console-driven
  close refreshes the starter too.
- Line anchors shift for the orders after this one: WO-210 cites
  `scripts/release.mjs`, `scripts/worktree.mjs` and `scripts/launchpad.mjs`
  lines, WO-192 edits `contributor.ts`, WO-207 edits the update path. When
  WO-207 adds an update log and retained copies, a refresh writes them in
  its disposable worktree and discards them with it unless WO-207 decides
  otherwise.
- WO-213 (position 3) screens JSON records under the document roots for
  home paths; the carried receipt holds none, and the refresh row names no
  path.

**Non-goals:** the operator's fork taking a starter update (WO-207's
planning-pass route) and any fetch from or write to the fork or any other
instance; automatic pull-request merging in core or the starter; pushing
anywhere but the bound starter's `main` (no core main push, no tag or
Release in the starter, no other branch, no force); a pull request in the
starter; a first export into a remote with no commit at all (an empty
remote refuses); refreshing seeds after the first export or
applying instance actions in the starter; `npm ci` or the kit's own gate in
the starter; changing the hand route (`launchpad export --update` keeps
writing its receipt into the launchpad); a control event for a refresh
(WO-078's non-goal for receipts); a registry of forks.

**Operator-review assumptions**

1. The refresh pushes directly to the starter's `main`, one fast-forward
   commit per release, not through a pull request, as the operator chose.
2. The push target is bound to core's origin host and owner and the
   sibling's declared name; a starter moved to another owner refuses until
   an order changes the binding.
3. Release close never commits to core: the receipt waits in main's ignored
   lane and rides in the next order's reviewed change.
4. The starter is verified by the export's own self-check and `launchpad
   verify`, not by the kit's full gate, because core's review gate, at the
   code identity release close requires, already exported a copy of the
   same kit sources and ran the kit's three gate selections inside it.
5. The first live refresh is this order's own release close, and it is the
   starter's first export. Before it,
   the operator names the local path of a starter checkout (or asks a role
   to create one), and the release-close role records it with `worktree
   clone` on that word; the path stays in the ignored clone map.
6. A refresh refusal after a published release is a close blocker with the
   same retry command, not a publication failure.
7. The refresh commit carries the host's configured Git identity under the
   release-close dispatch and a fixed message; the operator makes no commit
   by hand.
8. The first export keeps any path of the starter's initial commit that the
   export does not write (and replaces those it does), listing both in the
   row; it deletes nothing from the starter's history or tree.
