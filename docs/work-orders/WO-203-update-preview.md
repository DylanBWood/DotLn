# WO-203 — Update preview: before any write, an update shows what it will replace, add, remove and refuse and which instance actions it would apply or preserve, from core against a starter or an instance and inside an instance against the starter revision it is about to merge (v0.79.0)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A new flag on the update and a new
command form inside an instance; the update's writes keep their behavior.
Assigned at activation under the standing opt-out default.
**Cost:** adds a split of `updateKit` in `scripts/launchpad.mjs` into a
planning half and an applying half, a `--preview` flag that runs the first
half and prints, one renderer shared by the preview and the update's
summary, a `preview --from <ref>` form that reads the incoming manifest and
actions from a Git revision inside an instance, two fixture cases in
`scripts/test-launchpad.mjs`, and the client README's §Taking upstream
updates extended. Removes the point of no return the operator named on
2026-10-11: today the first time an instance learns what an update changes
is after it has written. Wall-clock: the from-core preview costs the source
build `prepareKit` already pays (tens of seconds, measured by the fixture);
the in-instance form costs two `git show` reads and a hash of the tree.
Re-mints: `scripts/launchpad.mjs` is not a registered evidence source; no
edition re-mint, no live feedback episode; the launchpad is a declared
machinery source, so `npm test -- --review` runs before handoff. Tokens and
context bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (d), first
half, of the three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`), and
the operator's answer 5 in the conversation-only session the same day
(ignored capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`): the
operator decides when to take upstream changes, "with a dry run or idea of
what will come in before we hit a point of no return". Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: the fixture starter
and instance are scratch artifacts.
**Depends on:** WO-077 merged (closed, v0.74.0: the update this order
previews); WO-078 merged (closed, v0.74.3: the receipt and registry the
preview must not write). No queued order.
**Recommended placement:** alone, directly after WO-202 and before WO-118,
so that the preview exists before the first update the operator takes into
a real instance: the operator exports after WO-202, and WO-118's release
close is the first core change that follows. This order edits
`scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`,
`scripts/kit/README.client.md`, one clause of product 03 and one of product
12. WO-201 and WO-202 edit the launchpad and the README before it. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "the update whose plan the preview shows before any write"
  },
  {
    "workOrderId": "WO-078",
    "relation": "satisfied-by-close",
    "reason": "the receipt and registry a preview must leave unwritten"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (the kit and instance file sets); 12-workstream-application.md
§One workstream across repositories (the update loop); `scripts/launchpad.mjs`
(`planUpdate` from line 1279, `readKitActions` from line 1329,
`planInstanceActions` from line 1408, `updateKit` from line 1547, the CLI
block from line 1646, `readPriorManifest`, `readPendingManifest`,
`closeWithReceipt`); `scripts/kit/README.client.md` §Taking upstream updates
and §Opting in to instance actions; `scripts/test-launchpad.mjs` (the
WO-078 criterion 1 case at line 1535 and the update case at line 1726);
`docs/evidence/WO-078/decisions.md` D004 and D009; the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5.

**Objective:** `node scripts/launchpad.mjs export --update <dir> --preview`,
run from core, prints the plan the update would apply (each kit path with
replace, add, remove or refuse and the refusal's reason and retained hash),
the instance actions it would apply or preserve, the incoming commit and tag,
the build hash before and after, and the receipt it would write, and writes
nothing: no file, no pending manifest, no receipt, no registry change.
Inside an instance, `node scripts/launchpad.mjs preview --from <ref>` reads
the incoming `KIT-MANIFEST.json` and `scripts/kit/KIT-ACTIONS.json` at a Git
revision of the starter remote and prints the same shape for the merge the
operator is about to take: the kit files the merge will change, the kit
files this instance edited that will conflict, the new kit paths an instance
file occupies, and the actions declared at the incoming revision. The client
README documents both forms and the rule that an update is previewed first.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- `updateKit` (`scripts/launchpad.mjs` line 1547) computes `plan` with
  `planUpdate` and `instance` with `planInstanceActions`, then writes the
  pending manifest and the files at once (lines 1606 onward) and closes with
  the receipt. The CLI accepts `export --update <dir> [--apply]` only (lines
  1655 to 1663). Nothing prints a plan without writing.
- `planUpdate(prior, next, directory, pending)` (line 1279) judges each path
  from the prior manifest, the incoming manifest and the destination's
  current bytes; it needs no incoming bytes. `planInstanceActions(directory,
  actions, kitPaths)` (line 1408) judges declared actions against the
  destination. Both are callable without writing.
- Inside an instance there is no core checkout; the incoming kit of a
  starter merge is a Git revision whose `KIT-MANIFEST.json` and
  `scripts/kit/KIT-ACTIONS.json` `git show <ref>:<path>` can read. The
  sibling receipts live in core's tree (`writeReceipt(launchpad, ...)`),
  never in the destination, so an instance's preview cannot read receipts.
- The client README's §Taking upstream updates says to "review the update
  before committing it": the review happens after the writes.
- WO-078 D009 (FUP-584d6021928bdfdb) left three Boy Scout items on the
  update path for the next adjacent change: preflight absent still-carried
  kit inputs before the build, include the destination and receipt state in
  post-manifest failure summaries, and share the small validators.

**Design (scope discipline):**

- One plan, two halves. `planKitUpdate(destination, { apply, launchpad })`
  returns `{ prior, prepared, plan, actions, instance, manifest, buildHash,
  receipt: { sibling, path } }` and writes nothing; `applyKitUpdate(planned)`
  performs today's writes. `updateKit` becomes the composition, so the
  preview and the update share every judgment by construction; the fixture
  asserts the preview's plan equals the update's plan on the same inputs.
- One renderer. `renderUpdatePlan(planned, { preview })` prints the counts
  and rows the CLI prints today (lines 1668 to 1696), with the preview
  adding the incoming commit and tag, the build hash before and after, and
  the receipt path it would write; the update's own summary uses the same
  function, so what the preview showed is what the update says it did.
- The in-instance form reads manifests, not bytes: `preview --from <ref>`
  uses `readManifestFile` on `git show <ref>:KIT-MANIFEST.json`,
  `readKitActions` on `git show <ref>:scripts/kit/KIT-ACTIONS.json`, and
  `planUpdate(currentManifest, incomingManifest, root, pending)` over the
  instance's tree; a `refuse: locally modified` row is a file the merge will
  conflict on, a `refuse: instance-owned collision` row is a kit path the
  instance occupies. The preview says what to expect; the merge stays the
  operator's Git operation and the re-emit stays theirs.
- A preview is not a receipt: it writes nothing and the registry does not
  move. The README says so.
- **Declined alternatives, recorded:** a `--dry-run` that writes to a
  temporary copy and diffs it (pays the writes to avoid them); previewing
  from the receipts (an instance has none); making the in-instance form
  perform the merge (the merge is the operator's; WO-209 adds the channel
  choice on top of it); a second plan computation for the preview (two
  judgments drift).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/launchpad.mjs`: split `updateKit` (line 1547) into
   `export async function planKitUpdate(destination, options)` (everything
   up to and including `planInstanceActions` and the retained manifest) and
   `export function applyKitUpdate(planned)` (the pending manifest, the
   writes, the renames, the manifest and the receipt); `updateKit` calls
   both. Check: the existing update cases (`scripts/test-launchpad.mjs`
   lines 1535 and 1726) pass unchanged.
2. `scripts/launchpad.mjs`: `export function renderUpdatePlan(planned,
   { preview })` producing the lines the CLI prints today plus, under
   `preview`, `incoming: <commit> (<tag>)`, `build: <old> -> <new>`,
   `receipt: would write <path>` or `receipt: none (<reason>)`; the CLI
   update branch uses it. Check: a fixture case compares the rendered lines
   of a preview and of the following update for equality on the plan rows.
3. `scripts/launchpad.mjs` CLI (line 1646 onward): accept `--preview` on
   `export --update <dir>` (with or without `--apply`, which then only
   affects which actions are shown as applied) and refuse `--preview`
   combined with nothing else to update; `--preview` runs `planKitUpdate`
   and `renderUpdatePlan` and exits 0. Check: the fixture asserts no file,
   pending manifest, receipt or registry byte changed (hash the destination
   and `docs/evidence/siblings/` and `docs/siblings/` before and after).
4. `scripts/launchpad.mjs`: `export async function previewFromRevision(root,
   ref)`: `git show <ref>:KIT-MANIFEST.json` and `git show
   <ref>:scripts/kit/KIT-ACTIONS.json` through `runGit` with
   `exportEnvironment()`, `readManifestFile`-style validation, then
   `planUpdate(readPriorManifest(root), incoming, root, readPendingManifest(root))`
   and `planInstanceActions(root, actions, kitPaths)` in report-only mode;
   CLI form `preview --from <ref>`; refuse when the root holds no manifest
   or the revision holds none. Check: a fixture builds a starter bare
   remote, exports twice (two core commits or a planted kit change), forks
   an instance, edits one kit file and occupies one new kit path, fetches,
   and asserts the preview shows the replace, the refuse and the collision.
5. FUP-584d6021928bdfdb (WO-078 D009): in `planKitUpdate`, preflight absent
   still-carried kit inputs before the source build; in `applyKitUpdate`'s
   post-manifest failure summaries include the destination and receipt
   state; share the small validators where a second consumer exists. Record
   each as fixed or left in the decisions.
6. `scripts/kit/README.client.md` §"## Taking upstream updates": the preview
   forms, what each line means, that a preview writes nothing and is not a
   receipt, and the rule: preview before every update. Check: the README
   travels manifest-listed (the WO-074 criterion 1 case).
7. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Platform and instance boundary": one clause in the kit-update
   sentence (an update shows its plan before it writes);
   `docs/product/12-workstream-application.md` §"## One workstream across
   repositories": the update loop's "previewed first" clause gains its
   evidence; `docs/evidence/WO-203/decisions.md`;
   `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-203/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the planning and applying halves; the shared renderer; the
`--preview` flag; the `preview --from <ref>` form; the two fixture cases;
the README; the write-backs below.

**Acceptance criteria (all required)**

1. `export --update <dir> --preview` from core prints every kit path's
   planned replace, add, remove or refuse with the refusal's reason and
   retained hash, the instance actions that would be applied or preserved,
   the incoming commit and tag, the build hash before and after and the
   receipt it would write, exits 0, and changes no byte of the destination,
   core's `docs/evidence/siblings/` or `docs/siblings/` (fixture: hashes
   before and after equal; no pending manifest).
2. The preview's plan rows equal the plan rows of the update that follows on
   the same inputs, rendered by one function (fixture).
3. Inside a fixture instance that forked a starter, `preview --from <ref>`
   against the starter's fetched revision prints the same shape: a locally
   modified kit file as refuse, an occupied new kit path as collision, the
   kit files the merge will change, and the actions declared at that
   revision; it refuses when the root or the revision holds no manifest.
4. The client README's §Taking upstream updates documents both forms, that a
   preview writes nothing and is not a receipt, and the rule to preview
   before every update.
5. Write-backs land, each in place with no dated paragraph: product 03
   §Platform and instance boundary (the clause); product 12 §One workstream
   across repositories (the evidence); the decisions file, with
   FUP-584d6021928bdfdb's three items recorded as fixed or left; the
   publication locks refreshed. No byte figure binds these write-backs.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the two fixture cases; `npm run test:docs`;
`npm test -- --review` before `implementation-ready` (the launchpad is a
declared machinery source) and again at final review.

**Write-back duty:** as listed in criteria 4 and 5.

**Known issues and carry-ins:**

- FUP-584d6021928bdfdb (WO-078 D009) is allocated here within the Boy Scout
  bound: this order restructures the update path those items sit on.
- The update's preview and its rollback (WO-207) share the planning half;
  WO-207 depends on this order's split.
- The in-instance form previews a merge from a manifest comparison; a merge
  that changes a kit file in a way the manifest does not describe (a file
  outside the manifest) is outside the preview, which says so in the README.

**Non-goals:** performing or undoing the merge; the rollback (WO-207); the
build channel (WO-209); a preview of instance files (they are the
instance's; an update never touches them); receipts for previews.

**Operator-review assumptions**

1. The operator previews before every update they take into the starter or
   an instance, by hand; no automation runs an update.
2. The merge from the starter into an instance stays an ordinary Git merge
   the operator performs, followed by `node scripts/harness.mjs emit`.
