# WO-294 — Main works on an order's worktree whatever its configuration holds, and a drive starts from a checkout off main (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** patch. A command run in the main checkout that
reads an order's worktree reads that worktree's document roots and no other
part of its configuration, so an order that adds a configuration key can be
driven, read and integrated by the released kit; and a drive finds its
control plane in the primary checkout when no worktree holds `main`. No
refusal is added, and a checkout's own commands refuse an unknown key in
its own configuration as before. Assigned at activation under the standing
opt-out default.
**Cost:** adds one reader of a checkout's roots, its use at the lookups
that cross from one checkout's code into another's files, one branch in the
order-worktree lookup and about six cases. Removes, for each drive during a planning pass, the operator's switch of
the primary checkout back to `main` or a run of the phases by hand, and
for an order that adds a configuration key the drive, the status and the
integration that refuse. `scripts/lib/config.mjs`, `scripts/lib/order-worktrees.mjs` and
`scripts/lib/target-worktrees.mjs` are declared sources of the
`configuration-root` or `harness-fixtures` suite. No registered evidence
source's judged behavior and no file of `FEEDBACK_SOURCE_PATHS` is edited.
One complete review run at handoff. Wall-clock, tokens and steps are
unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-23,
item 1 (ignored capture SHA-256
`0c80efbd379f8ab2ec03fe24a966d335faed0e8d35fc2b3cd9eb5770d075a270`): the
first drive of WO-288 did not start. Pasted with it, another session's
diagnosis, kept in the ignored planning lane (SHA-256
`2b32d7f2aedf1109240d70d3d2e93c1206ecd63d43c007718aab9bebbc858f91`).
[The planning pass](../planning/passes/the-kit-keeps-working-2026-11-23.md#why-the-drive-did-not-start)
reproduced it and found the second cause.
**Depends on:** none.
**Recommended placement:** last. It stops no instance: an instance's
orders change no kit validator. Until it lands, an order of core's that
adds a configuration key is run by its phrases in its own worktree.

**Objective:** The operator types `drive: WO-NNN` and the drive starts,
whatever keys the order's own configuration has gained and whatever branch
the primary checkout is on. The integration that a final review runs from
main works on the same order. A checkout still refuses an unknown key in
its own configuration when its own commands load it.

**Observed gap (dated 2026-11-23 at `main` `bc761ad9c`, v1.4.0):**

- Main's lookup of an order's worktrees loads that worktree's whole
  configuration with main's validator. `resolveOrderWorktrees` in
  `scripts/lib/order-worktrees.mjs` asks `targetWorktreeForOrder` for the
  order's launchpad worktree first; `targetRegistryPath` in
  `scripts/lib/target-worktrees.mjs` builds the registry's path with
  `docPath`; and `docRelative` in `scripts/lib/config.mjs` calls
  `loadConfig` on that worktree, whose `validateConfig` refuses any
  top-level key outside `SECTION_KEYS`.
- WO-288 adds the section `kinds` and uses it in core's own
  `dotln.config.json`. Run from this checkout on 2026-11-23,
  `loadConfig` on WO-288's worktree returned: `invalid DotLn configuration
  in <the worktree>/dotln.config.json: unknown configuration key "kinds";
  known keys: version, roots, repositories, classes, build, release, kit,
  drive, features, stops, derivedOrders, portfolios, contributions,
  historicalWorkOrders, workers, extensions`, and
  `resolveOrderWorktrees(root, "WO-288", { allowNoMain: true })` threw the
  same. WO-288's configuration also elects a feature name main does not
  know.
- The lookup's callers are the drive (`scripts/lib/drive-session.mjs`,
  `scripts/lib/drive-route.mjs`, `scripts/lib/drive-account.mjs`,
  `scripts/lib/drive-worker.mjs`), the hook's order-worktree grant
  (`scripts/lib/order-worktree-grants.mjs`) and the release close
  (`scripts/release.mjs`). So `drive`, `drive status` and `drive why` all
  stop on the key before the order's worktree is reached.
- The integration has the same reading. `scripts/lib/worktree-integration.mjs`
  builds its paths with `docRelative` on the worktree it integrates, and
  the executor's and the reviewer's steps run main's
  `scripts/worktree.mjs integrate` against the registered worktree. Not
  run in this pass; read.
- The orders before WO-288 that added a key (the `stops` section among
  them) did not use it in core's own configuration, so the worktree's file
  held nothing main did not know.
- A second cause stops the same command. With the primary checkout on a
  planning branch, `node scripts/drive.mjs why WO-288` printed "Drive
  stopped: no main-branch control-plane worktree found" (the same function,
  which requires a worktree on `refs/heads/main` unless its caller passes
  `allowNoMain`; the drive's callers do not). A planning pass holds the
  primary checkout on its branch from its start until someone switches
  back, so no drive runs meanwhile.

**Design (scope discipline):**

- **A reader of roots.** One exported function returns a checkout's
  document roots from its configuration, validating the version and the
  `roots` section and reading nothing else. The lookups that cross from
  one checkout's code into another's files use it: the registry, clone-map
  and pending-start paths, the order-worktree lookup and the integration's
  paths. `loadConfig`, `docPath` and `docRelative` stay strict for a
  checkout's own commands.
- **Anything else comes from main.** Where a command run in main needs
  another section for an order (a repository's registration, a drive
  setting), it reads main's own configuration, as the lookup already falls
  back to main's registry.
- **The fixture finds the sites.** The order's fixture is an order worktree
  whose configuration holds a section key and a feature name main does not
  know. The executor runs each command the criteria name against it and
  moves each site that refuses, listing them in the decisions.
- **The primary checkout is the control plane when none holds `main`.** The
  drive's callers admit it, as the grant and the release close already do.
  The drive's record and the order's status are read and written where they
  are today.

Rejected:

- *A loader that reads any other checkout leniently*, deciding by path. It
  differs on who decides that a read is of another checkout, the call site
  or the loader. The kit's fixtures and an exported root load
  configurations of roots other than the scripts' own and must keep
  refusing an unknown key there.
- *Main running the order worktree's own scripts for every read of it.* It
  differs on whose code reads a checkout's files. It costs a process for
  each read and binds main to the output of every later version of each
  script.
- *Keeping a new key out of core's own configuration until its order
  merges.* It differs on where the constraint falls, the kit or each order
  that adds a key: WO-288 could not have run its own critic's election
  under it.

**Execution plan (the executor follows these steps in order; observed at
`bc761ad9c`, 2026-11-23):** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `scripts/lib/config.mjs`: the exported reader of a checkout's roots, and
   a path helper beside `docPath` that uses it. Check: two cases in
   `scripts/test-configuration-root.mjs` (an unknown section key beside
   valid roots returns the roots; a malformed `roots` section refuses and
   names the file).
2. `scripts/lib/target-worktrees.mjs`, `targetRegistryPath`, `cloneMapPath`
   and the pending-start path: built with that helper. Check: a case in
   `scripts/test-drive.mjs` with the fixture worktree of the Design.
3. `scripts/lib/order-worktrees.mjs`, `resolveOrderWorktrees`: resolve the
   primary checkout as the control plane when no worktree holds `main`,
   for the drive's callers. Check: a case in `scripts/test-drive.mjs` with
   the main checkout on another branch.
4. `scripts/lib/worktree-integration.mjs`: each path it builds for the
   worktree it integrates, with the helper. Check: a case in
   `scripts/test-worktree-integration.mjs` with the fixture worktree.
5. The remaining sites the fixture shows, each named in the decisions with
   its file and function, in `scripts/lib/drive-session.mjs`,
   `scripts/lib/drive-route.mjs`, `scripts/lib/drive-account.mjs`,
   `scripts/lib/drive-worker.mjs`, `scripts/lib/order-worktree-grants.mjs`
   and `scripts/release.mjs`. Check: the cases of steps 2 to 4 run through
   them.
6. Write-backs: `docs/product/07-execution-guide.md`, "Where the control
   plane finds its documents" (after "Validation is positive and unknown
   keys refuse": what a command reads of another checkout's configuration)
   and "Operator resume phrases" (a drive's control plane);
   `docs/KIT.md`, "When a routed run stops" (where a drive may be
   started).
7. The handoff sequence of §Discipline.

**Deliverables:** the reader and its helper; the lookups that use it; the
control-plane branch; the cases; the list of sites in the decisions; the
write-backs.

**Acceptance criteria (all required)**

1. With a fixture order worktree whose `dotln.config.json` holds a section
   key and a feature name that the main checkout's kit does not know,
   `node scripts/drive.mjs status WO-NNN` run in the main checkout prints
   the order's phase (`npm test -- --only harness-fixtures`).
2. In that fixture a drive with the fake host launches the order's next
   phase in the order's worktree (`npm test -- --only harness-fixtures`).
3. In that fixture `node scripts/worktree.mjs integrate WO-NNN` run from
   the main checkout ends as it ends for the same fixture without the two
   unknown names (`npm test -- --only worktree-integration`).
4. With no worktree on `main`, `node scripts/drive.mjs status WO-NNN` run
   in the primary checkout prints the order's phase
   (`npm test -- --only harness-fixtures`).
5. With no worktree on `main`, a drive with the fake host launches the
   order's next phase (`npm test -- --only harness-fixtures`).
6. `node scripts/harness.mjs check`, run in a checkout whose own
   configuration holds an unknown section key, refuses and names the key
   (`npm test -- --only configuration-root`).
7. Product 07 under "Where the control plane finds its documents" says
   that a command reads the roots alone of another checkout's
   configuration (`npm run test:docs`).
8. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only configuration-root`,
`npm test -- --only harness-fixtures`,
`npm test -- --only worktree-integration`, `npm test -- --only release`,
`npm test -- --only target-worktree`.

**Evidence gate:** under `docs/evidence/WO-294/`: the decisions, with every
site moved and the command that showed it; the handoff.

**Write-back duty:** as step 6 lists.

**Known issues and carry-ins:**

- Reading the roots alone assumes the order has not changed what a root means. An order that renames or reinterprets a root key would be driven and integrated from main on the older reading. Reopen: a drive or an integration run from main acts on a root value that the order's own commands read differently.
- No criterion reads another checkout's configuration that does not parse. The reader refuses it with the file named, as `loadConfig` in `scripts/lib/config.mjs` refuses a configuration it cannot open. Reopen: status or a drive from main against such a worktree ends without naming the file.
- WO-288 adds the key that shows this defect and is first in the sequence, and this order is last. If the integration WO-288's handoff and final review run from main refuses on that key, as the code reads, WO-288 integrates with its own worktree's script on the operator's word and records the route. Reopen: that route fails too, and this order is then placed ahead of WO-288's final review.
- A drive that stops on a thrown failure prints the failure's message and
  not its account (item 1 of WO-287-D086's follow-up,
  FUP-9c62f95113543599). Named boy-scout item, same files as step 5: print
  the account's lines there too.
- After the operator's merge a release close still needs `main` checked
  out and current, and says so itself.
- An order worktree whose `roots` section is malformed still stops main's
  lookup, with the file named.

**Non-goals:** any change to what a checkout's own commands refuse in its
own configuration; running one checkout's scripts from another; the
drive's modes, phases or stops; an instance's update of its kit.

**Operator-review assumptions:** a drive may start while the primary
checkout is on a planning branch; and main need read nothing of an order's
configuration but its roots.
