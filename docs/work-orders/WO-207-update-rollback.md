# WO-207 — Update rollback: an instance returns to the kit state before its last update, restoring every kit file the update replaced, added or removed, reversing the instance actions that can be reversed and naming those that cannot, from core or inside the instance, with a re-emit to follow (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A rollback form on the launchpad, an
instance-owned update log the update writes, and a retained copy of replaced
kit files in the ignored local lane; the update's forward behavior keeps its
shape. Assigned at activation under the standing opt-out default.
**Cost:** adds an update log the update appends inside the destination
(`docs/control/kit/updates.jsonl`, instance-owned, never manifest-listed:
the time, the prior and new core commits, the prior manifest's files and
hashes, the pre-update commit of the destination when it has one, the plan
and the applied actions), a retained copy of each file the update replaces
or removes under the destination's ignored local lane, a `rollback` form in
`scripts/launchpad.mjs` runnable from core (`export --update <dir>
--rollback`) and inside the instance (`node scripts/launchpad.mjs rollback`),
reversal of reversible instance actions, fixture cases in
`scripts/test-launchpad.mjs`, and the client README's §Taking upstream
updates extended. Removes the state the operator named on 2026-10-11 for the
work instance: today the only way back from an update is Git archaeology by
hand. Wall-clock: the update gains one copy per replaced file (measured by
the fixture); a rollback costs the restores. Re-mints: `scripts/launchpad.mjs`
is not a registered evidence source; no edition re-mint, no live feedback
episode; the launchpad is a declared machinery source, so
`npm test -- --review` runs before handoff. Tokens and context bytes are
unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (d), second
half, of the three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`), and
the operator's answer 5 in the conversation-only session the same day
(ignored capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`): "an
undo of an upgrade or roll back, since i'll need that for the work
variation". Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: the fixture instance is a scratch artifact; the work
instance is named only as such.
**Depends on:** WO-203 (hard: the planning and applying halves of the update
and the shared renderer the rollback reuses and prints through); WO-077
merged (closed, v0.74.0).
**Recommended placement:** first of the serial tail after WO-083, as the
operator placed it ("rollback may follow"); WO-203 lands before WO-118. This
order edits `scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`,
`scripts/kit/README.client.md`, `scripts/kit/gitignore.template` (the
retained-copy lane is ignored) and one clause of products 03 and 12. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-203",
    "relation": "hard",
    "reason": "the update's planning and applying halves and the renderer the rollback reuses"
  },
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "the update this order undoes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (kit and instance file sets; the update); 12-workstream-application.md
§Arriving at the desk (the constrained managed host) and §One workstream
across repositories (the update loop); `scripts/launchpad.mjs` (`planUpdate`,
`planInstanceActions`, `readKitActions`, the three action kinds and their
refusals, `updateKit` and WO-203's halves, `KIT_MANIFEST_PENDING`,
`writeReplacement`); `scripts/kit/README.client.md` §Taking upstream updates
and §Opting in to instance actions; `scripts/kit/gitignore.template`;
`scripts/test-launchpad.mjs` (the update case at line 1726); the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5.

**Objective:** After an update, `node scripts/launchpad.mjs rollback` inside
the instance, or `export --update <dir> --rollback` from core, returns the
kit files to the state the update log records before that update: replaced
files restored byte for byte from the retained copy or from the destination's
pre-update commit, added kit files removed, removed files restored, refused
files untouched (the update never changed them), the manifest restored to
the prior manifest, reversible instance actions reversed (a `rename-root`
renamed back, an `add-config-field` removed when the update added it, a
`change-phrase` replaced back) and irreversible ones listed by id for the
operator, the rollback appended to the update log, and the re-emit
instruction printed; it refuses when a kit file changed since the update,
when the update is not the latest kit change in the log, or when a prior
file can be restored from neither source, naming the path.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- `updateKit` journals `KIT-MANIFEST.pending.json` before its writes and
  removes it after (lines 1606 to 1626): the journal serves an interrupted
  run's retry, not an undo, and the prior manifest is gone once the new one
  is written.
- Replaced files are overwritten through `writeReplacement`; nothing keeps
  their prior bytes. The destination may be a repository with the prior
  state committed (the client README says to review and commit each update),
  but nothing records which commit held it, and an update taken on an
  uncommitted tree has no committed prior.
- Instance actions move roots, add configuration fields and change phrases
  (`planInstanceActions`, line 1408); the update prints what it applied and
  nothing records how to reverse each.
- The client README's §Taking upstream updates ends at "review the update
  before committing it"; the recovery it implies is `git revert` by hand,
  which also reverts the instance's own commits made since.
- The work instance, a private fork on a constrained managed host where core
  is never installed (product 12, 2026-10-11), takes updates by Git merge and
  can hold no core checkout to re-run anything from.

**Design (scope discipline):**

- The update records what it did where the instance can read it. Each update
  appends one row to `docs/control/kit/updates.jsonl` inside the destination
  (instance-owned; the kit never lists it): `{ at, fromCommit, toCommit,
  priorManifest: { commit, files: [{ path, sha256 }] }, newManifestSha256,
  preUpdateCommit | null, plan, applied }`. The rollback reads the last row.
- Two sources for prior bytes, tried in order: the retained copy the update
  writes under the destination's ignored local lane
  (`docs/control/local/kit/rollback/<priorManifestSha256>/<path>`) before
  replacing or removing a file, then `git show <preUpdateCommit>:<path>` when
  the destination had a commit; a restore is accepted only when the restored
  bytes hash to the prior manifest's entry; otherwise the rollback refuses
  naming the path and restores nothing.
- Rollback is all or nothing: every restore is verified against the prior
  manifest before the first write, as the update verifies before its writes;
  the restored manifest is the prior manifest's bytes.
- Instance actions reverse by kind: `rename-root` renames back when the
  renamed root is where the action left it; `add-config-field` removes the
  field when the log says the update added it (a value that existed before is
  left); `change-phrase` replaces `to` with `from` when exactly one
  occurrence exists; anything else is listed by id as not reversed, with the
  file to edit.
- Refusals: a kit file whose current hash differs from the new manifest's
  (edited since the update); an update that is not the latest row; a
  missing retained copy with no committed prior; a destination without a
  manifest. Each names its path or row.
- The rollback appends a row of kind `rollback` to the same log, prints
  the restored, removed and reversed sets through WO-203's renderer, and
  ends with `re-emit: node scripts/harness.mjs emit`; it writes no receipt in
  core and moves no registry.
- **Declined alternatives, recorded:** `git revert` of the update commit
  (reverts the instance's own later commits with it and needs a committed
  update); keeping prior bytes in the kit manifest (the manifest is the
  kit's, not the instance's history); reversing every action kind by
  heuristics (an unreversible action is listed, never guessed); a rollback
  that runs the re-emit itself (the emit is the operator's reviewed step, as
  after an update).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/launchpad.mjs`, `applyKitUpdate` (WO-203's half): before each
   replace or remove, copy the current file to
   `docs/control/local/kit/rollback/<priorManifestSha256>/<path>` inside the
   destination (`mkdirSync` recursive, `writeReplacement`); after the
   manifest write, append the update row to `docs/control/kit/updates.jsonl`
   (new `appendUpdateLog(destination, row)`; `preUpdateCommit` from
   `git rev-parse HEAD` under `exportEnvironment()` when the destination is
   a repository with a commit, else null). Check: the update case at
   `scripts/test-launchpad.mjs` line 1726 asserts the row and the copies.
2. `scripts/kit/gitignore.template`: the lane `docs/control/local/` is
   already ignored by the seeded `.gitignore`; confirm and record; add no
   new pattern unless the seed lacks it. Check: `git status` in the fixture
   instance after an update shows no retained copy.
3. `scripts/launchpad.mjs`: `export function rollbackKit(destination)`: read
   the last row of the log (refuse when absent or when its kind is
   `rollback`); refuse when any new-manifest file's current hash differs
   from the row's `newManifestSha256` listing (edited since); for each plan
   entry compute the restore source (retained copy, then
   `git show <preUpdateCommit>:<path>`), verify its hash against the prior
   manifest, and refuse naming the path when neither matches; then write:
   restore replaced and removed files, unlink added files, reverse actions
   by kind (`rename-root`, `add-config-field`, `change-phrase`) or list them,
   write the prior manifest's bytes as `KIT-MANIFEST.json`, append the
   `rollback` row, print through `renderUpdatePlan`. CLI forms:
   `export --update <dir> --rollback` and `rollback [<dir>]`. Check: fixture
   cases below.
4. `scripts/test-launchpad.mjs`: cases: (a) update then rollback restores
   every kit file to the prior manifest's hashes, the manifest equals the
   prior one, added files are gone, removed files are back, instance files
   are byte-identical; (b) an applied `rename-root`, `add-config-field` and
   `change-phrase` are reversed and an unknown-state action is listed; (c)
   refusals: a kit file edited after the update, a second rollback with no
   newer update, a missing retained copy on a destination with no commit,
   and the same case with a committed prior restoring from Git; (d) the
   from-core and in-instance forms produce identical trees. Check:
   `npm test -- --only launchpad`.
5. `scripts/kit/README.client.md` §"## Taking upstream updates": the update
   log, the retained copies, the two rollback forms, what reverses and what
   is listed, the refusals, and that a rollback is followed by the re-emit.
   Check: the README travels manifest-listed (the WO-074 criterion 1 case).
6. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Platform and instance boundary": the kit-update clause gains "and
   can be rolled back to the prior kit state"; `docs/product/12-workstream-application.md`
   §"## Arriving at the desk": the constrained-managed-host paragraph's
   "previewed first and reversible" clause gains its evidence;
   `docs/evidence/WO-207/decisions.md`; `node scripts/lineage.mjs index
   --check`; `node scripts/check-publication.mjs --print-locks`;
   `npm run publication:check`.
7. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-207/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the update log and retained copies; the rollback form in
both places; the action reversals; the fixture cases; the README; the
write-backs below.

**Acceptance criteria (all required)**

1. After an update in the fixture instance, a rollback restores every kit
   file to the prior manifest's hash, restores the prior manifest, removes
   the files the update added, restores the files it removed, and leaves
   every instance file byte-identical (fixture).
2. Reversible instance actions are reversed (`rename-root`,
   `add-config-field` the update added, `change-phrase`) and an action in an
   unexpected state is listed by id with the file to edit, not guessed
   (fixture).
3. The rollback refuses, writing nothing and naming the path or row, when a
   kit file was edited after the update, when no newer update exists above
   the last rollback, and when a prior file is restorable from neither the
   retained copy nor the pre-update commit; with a committed prior and no
   retained copy it restores from Git and verifies the hash (fixture).
4. The from-core form and the in-instance form produce byte-identical trees
   on the same fixture (fixture); each appends a `rollback` row to the
   update log and writes no receipt in core.
5. The client README's §Taking upstream updates documents the log, the
   retained copies, both rollback forms, the reversals and refusals, and the
   re-emit that follows.
6. Write-backs land, each in place with no dated paragraph: product 03
   §Platform and instance boundary (the clause); product 12 §Arriving at the
   desk (the evidence); the decisions file; the publication locks refreshed.
   No byte figure binds these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture cases; `npm run test:docs`;
`npm test -- --review` before `implementation-ready` (the launchpad is a
declared machinery source) and again at final review.

**Write-back duty:** as listed in criteria 5 and 6.

**Known issues and carry-ins:**

- The retained copies live in the destination's ignored local lane; a fresh
  clone of the instance has none and falls back to the pre-update commit,
  which the log records only when the destination was committed at update
  time; the README says so.
- The build channel (WO-209) partitions an update's files; a rollback
  restores whatever the log's plan lists, so the two compose without a
  special case, which WO-209's fixture asserts.

**Non-goals:** reverting the instance's own commits; a rollback older than
the last update (one step back; repeat for more only when each row is the
latest); rolling back an export (there is no prior state); running the
re-emit; receipts for rollbacks in core.

**Operator-review assumptions**

1. One step back per rollback is the accepted shape; a deeper undo is a
   repeat of rollback after the intervening rows are themselves rolled back.
2. An action the rollback cannot reverse is listed for the operator rather
   than reversed by guess.
