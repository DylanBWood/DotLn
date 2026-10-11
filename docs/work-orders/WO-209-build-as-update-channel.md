# WO-209 — The build as a selectable update channel: an instance takes machinery with its build pinned at the prior compiled definitions, both together, or the build alone, through a pinned build the emit composes from, with the compiler contract guarded and the overlay composing over whichever build is pinned (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. The kit manifest partitions its files into
build and machinery, the update takes a channel, the configuration records
the pin, and `harness emit` and `check` honor it; today's default (both) is
unchanged. Assigned at activation under the standing opt-out default.
**Cost:** adds a build partition to the kit manifest written by
`scripts/launchpad.mjs` (`kitManifest`: the compiled definition modules the
emit lowers from, `packages/skeleton/dist/src/loadouts/contributor.js` and
`feedback.js`, with the loadout's semantic hash and the compiler package
version they were compiled with), a `channel` on the update (`both`,
`machinery`, `build`; `--channel` on the command, `build.channel` in the
configuration as the default) honored by `planUpdate`, a `build.pin` the
configuration records (the pinned modules' hashes and the instance commit
that holds them), `harness emit` lowering from the pinned modules and
`harness check` accepting the declared pin, an in-instance form
`node scripts/launchpad.mjs build --pin|--take` for the merge path, a
compiler-contract guard, fixture cases in `scripts/test-launchpad.mjs` and
`scripts/test-harness.mjs`, and the client README's channel section.
Removes the coupling the record names: today the operator's compiled
definitions arrive with every machinery update, and an instance can neither
take machinery while keeping its build nor take a build alone. Wall-clock:
the update's plan gains a partition; the emit's cost is unchanged. Re-mints:
`scripts/lib/harness.mjs` is a registered build-only source
(`scripts/lib/evidence-sources.mjs` lines 176 and 384 to 392), so the
editions it stales are re-minted deterministically; `scripts/lib/config.mjs`
is an excluded import sibling; no feedback-judged file changes, so no live
feedback episode; the launchpad and the harness library are declared
machinery sources, so `npm test -- --review` runs before handoff. Tokens and
context bytes are unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (h) of the
three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`): the
planner chooses between the Contributor loadout as a definition pack per
product 03 and a pinned build the emit composes from; the operator's
default for the personal instance is both channels, and the work instance
decides per update. The conversation-only session the same day (ignored
capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`)
located the build in `contributor.ts` and found no channel. The planner
chose the pinned build (the Design records why) and recorded the definition
pack as a candidate. Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: scratch instances only.
**Depends on:** WO-076 (hard: the overlay composes over the kit build;
this order makes "the kit build" the pinned one, and both change
`harness emit`); WO-203 (hard: the update's planning and applying halves
the channel partitions); WO-077 merged (closed, v0.74.0).
**Recommended placement:** in the serial tail after WO-208. This order
edits `scripts/launchpad.mjs`, `scripts/lib/harness.mjs`,
`scripts/lib/config.mjs`, `scripts/test-launchpad.mjs`,
`scripts/test-harness.mjs`, the kit README and products 03 and 12; WO-208
edits `config.mjs` before it. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the overlay composes over the kit build, which this order makes the pinned build; both change harness emit"
  },
  {
    "workOrderId": "WO-203",
    "relation": "hard",
    "reason": "the update's planning and applying halves the channel partitions"
  },
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "the update the channel selects within"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary ("What DotLn exports is a build"; kit, instance and overlay sets)
and §Package ecosystem and marketplaces (definition packs; "Updates create
new versions and a semantic diff"); 12-workstream-application.md §One
workstream across repositories (the update loop); `scripts/lib/harness.mjs`
(`harnessInstallation` from line 95: the imports of
`contributorConfiguredProgram`, `contributorProfiles` and `personalFeedback`
at lines 36 and 37, `runtimeFiles`, `runtimeSnapshot`, the manifest's
`origin.semanticHash` and `compilerPackageVersion`; `preserveHarnessRuntime`
at line 328; `checkHarness` at line 368); `scripts/lib/config.mjs`
(`BUILD_KEYS` at line 62, `validateBuild` at lines 318 to 327);
`scripts/launchpad.mjs` (`kitManifest` at line 306, `KIT_FILES`,
`planUpdate`, WO-203's halves, `readPriorManifest`);
`packages/skeleton/src/loadouts/contributor.ts` and `feedback.ts` (the
compiled definitions); `.claude/harness-manifest.json` (`origin`,
`compilerPackageVersion`); `docs/work-orders/WO-076-instance-build-overlay.md`
(the overlay's composition); the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5.

**Objective:** The kit manifest names its build: the compiled definition
modules the emit lowers from, their loadout semantic hash and the compiler
package version they were compiled with. An update takes a channel: `both`
(today's behavior), `machinery` (every kit file except the build modules;
the instance's configuration records the pin, the modules stay at their
pinned bytes, `harness emit` lowers from them and `harness check` accepts
the pin), or `build` (the build modules alone, followed by the re-emit); the
channel comes from `--channel` or the configuration's `build.channel`, and
a `machinery` update that would install a compiler package of a different
major version than the pin was compiled with refuses and names the choice.
Inside an instance that merges from the starter, `node scripts/launchpad.mjs
build --pin` restores the pinned modules from the instance's own history and
`build --take` adopts the merged build and moves the pin. WO-076's overlay
composes over whichever build is pinned.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- The emit lowers the Contributor loadout from the compiled modules
  `packages/skeleton/dist/src/loadouts/contributor.js` and `feedback.js`
  (`scripts/lib/harness.mjs` lines 36 and 37, `contributorConfiguredProgram`
  and `personalFeedback`); `harnessInstallation` accepts only the
  `contributor` loadout (line 95) and records the loadout's semantic hash and
  the compiler package version in the manifest's `origin` and
  `compilerPackageVersion`.
- The kit manifest (`kitManifest`, line 306; schema 1) lists every file with
  a hash and no partition; `planUpdate` judges every path alike, so an
  update replaces the definition modules with every machinery change.
- The configuration's `build` section admits `loadout`, `profile` and
  `overlay` (`BUILD_KEYS`, line 62); nothing records a pin or a channel.
- `checkHarness` (line 368) computes the expected installation from the
  current `packages/*/dist` and refuses a snapshot or surface that differs;
  a pinned older definition module would read as drift.
- WO-076's overlay composes over "the kit's Contributor build"; with one
  build per kit revision there is no other build to compose over.
- Product 03 §Package ecosystem describes definition packs and starter
  implementations with no privileged status over local definitions; the
  loadout is TypeScript compiled into the skeleton package, not data a pack
  could carry, and WO-097 and WO-098 (the rule migration batches) are the
  queued orders that move rules into compiled units.
- The work instance takes updates by Git merge (product 12, 2026-10-11): a
  channel that lives only in the update command does not reach it.

**Design (scope discipline):**

- **The choice, recorded.** A definition pack would make the loadout data the
  current compiler reads; today the loadout is code (`contributor.ts`,
  `feedback.ts`), its lowering is the compiler's, and turning it into data is
  the rule migration's subject (WO-097, WO-098) and product 10's IR work. A
  pinned build keeps the modules as they are, partitions the manifest, and
  lets the emit lower from the pinned modules with the current compiler. The
  pinned build is chosen; the definition pack is recorded as a candidate
  with its reopening condition (the loadout's definitions compile from data,
  or a second owner needs a build core does not ship).
- **The build is the compiled definitions.** `build.files` in the manifest
  names `packages/skeleton/dist/src/loadouts/contributor.js` and
  `feedback.js`, the loadout semantic hash and the compiler package version
  of the kit revision; everything else manifest-listed is machinery. The
  runtime the hooks import (`runtimeFiles`) stays machinery: it is the
  engine, not the definitions.
- **Channel in the plan.** `planUpdate` takes `channel`: under `machinery`
  the build files are planned as `keep` at their prior hashes and the new
  manifest records `build.pin = { files, semanticHash, compilerPackageVersion,
  commit }` from the prior manifest; under `build` only the build files are
  planned and the manifest's machinery entries keep their prior hashes;
  under `both` today's plan. WO-203's preview shows the partition and the
  channel.
- **Compatibility guard.** A `machinery` update whose incoming
  `compilerPackageVersion` has a different major version than the pin's
  refuses before any write and prints the two choices (`--channel both`, or
  take nothing); a `build` update whose incoming definitions were compiled
  for a different major than the installed compiler refuses the same way.
- **The emit and the check honor the pin.** `harnessInstallation` reads
  `build.pin` from the configuration and imports the definition modules from
  the pinned files (the kit files at their pinned bytes, tracked in the
  instance); `checkHarness` expects the pinned modules' hashes where the pin
  is declared and today's where it is not; the manifest's `origin` records
  the pinned semantic hash.
- **The merge path.** Inside an instance, `build --pin` restores the two
  modules from the instance's history (`git show <pin.commit>:<path>`),
  verifies their hashes against the pin and writes them; `build --take`
  adopts the merged modules and records the new pin from the merged
  manifest; both print the re-emit instruction. The README says a merge
  brings every kit file and the instance chooses afterward.
- **Defaults.** `build.channel` absent means `both`; the operator's personal
  instance keeps `both`; the work instance sets its channel per update.
- **Declined alternatives, recorded:** the definition pack now (the
  candidate above); pinning the hooks' runtime too (engine and definitions
  would drift against the scripts); a per-file channel (two sets are
  enough; a third is a request); applying the channel inside a Git merge
  (the merge is the operator's; the two forms follow it).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/launchpad.mjs`: `kitManifest` (line 306) writes schema 2 with
   `build: { files: [...], semanticHash, compilerPackageVersion }` read from
   the export's emitted harness manifest (`origin.semanticHash`,
   `compilerPackageVersion`); `readPriorManifest` accepts schema 1 (no
   partition: every file machinery) and 2. Check: the WO-074 criterion 1
   case (the manifest lists every kit file) extended to the partition.
2. `scripts/lib/config.mjs`: `BUILD_KEYS` (line 62) gains `channel` (`both`,
   `machinery`, `build`) and `pin` (`{ files: [{ path, sha256 }],
   semanticHash, compilerPackageVersion, commit }`), validated in
   `validateBuild` (lines 318 to 327). Check: configuration cases.
3. `scripts/launchpad.mjs`: `planUpdate` takes `channel` and the prior
   manifest's `build`; plans `keep` rows for the pinned files under
   `machinery`, only build rows under `build`, and today's plan under `both`;
   `planKitUpdate` (WO-203) reads `--channel` or the destination
   configuration's `build.channel`, applies the compatibility guard, and
   writes `build.pin` into the destination's `dotln.config.json` under
   `machinery` (through the configuration writer the instance actions use).
   Check: fixture cases for the three channels and the guard.
4. `scripts/lib/harness.mjs`: `harnessInstallation` reads the configuration's
   `build.pin` and imports `contributorConfiguredProgram`,
   `contributorProfiles` and `personalFeedback` from the pinned module paths
   when declared; `checkHarness` expects the pinned hashes; the installation
   manifest's `origin` carries the pinned semantic hash. Check:
   `scripts/test-harness.mjs` cases: emit from a pin equals the emit of the
   pinned revision; check passes with the pin and refuses a module that
   differs from it.
5. `scripts/launchpad.mjs`: `build --pin` and `build --take` forms as the
   Design states; refuse when the history lacks the pinned blobs or the
   hashes differ. Check: fixture cases on a fixture instance that merged a
   starter revision.
6. WO-076's overlay: a fixture case composes an overlay over a pinned build
   and asserts the result equals composing it at the pinned revision.
7. `scripts/kit/README.client.md` §"## Taking upstream updates": the channel
   section (what the build is, the three channels, the guard, the pin, the
   merge-path forms, the default). Check: the README travels manifest-listed.
8. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Platform and instance boundary": the kit-update sentence gains the
   channel (machinery, build or both; the pin) in place; §"### Package
   ecosystem and marketplaces": one clause recording the definition pack as
   the reopening alternative; `docs/product/12-workstream-application.md`
   §"## One workstream across repositories": the update loop's channel
   clause gains its evidence; `docs/evidence/WO-209/decisions.md` (the
   choice recorded with its reopening condition); the deterministic re-mints
   of the editions `scripts/lib/harness.mjs` stales; `node scripts/lineage.mjs
   index --check`; `node scripts/check-publication.mjs --print-locks`;
   `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-209/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the manifest partition; the channel in the plan and the
guard; the pin in the configuration; the emit and check honoring it; the
merge-path forms; the fixture cases; the README; the write-backs below.

**Acceptance criteria (all required)**

1. The kit manifest names its build files, loadout semantic hash and compiler
   package version; a schema 1 manifest is read with every file as machinery
   (fixture).
2. An update under `machinery` replaces every kit file except the build
   modules, which stay at their pinned bytes, records `build.pin` in the
   destination's configuration and leaves the emitted bundle at the pinned
   build after the re-emit; under `build` only the build modules change and
   the re-emit produces the new build over unchanged machinery; under `both`
   the plan equals today's; WO-203's preview shows the partition and the
   channel in each case (fixture).
3. A `machinery` update whose incoming compiler package major differs from
   the pin's, and a `build` update whose definitions were compiled for a
   different major than the installed compiler, refuse before any write and
   print the two choices (fixture).
4. `harness emit` from a pinned build produces the bundle the pinned
   revision produced, and `harness check` passes with the pin declared and
   refuses a pinned module whose bytes differ (fixture).
5. Inside a fixture instance that merged a starter revision, `build --pin`
   restores the pinned modules from the instance's history and verifies
   their hashes, `build --take` adopts the merged modules and moves the pin,
   and each prints the re-emit instruction; both refuse when the history
   lacks the pinned blobs (fixture).
6. An overlay composed over a pinned build equals the composition at the
   pinned revision (fixture); a rollback (WO-207) after a channelled update
   restores what the plan listed (fixture).
7. Write-backs land, each in place with no dated paragraph: product 03
   §Platform and instance boundary (the channel) and §Package ecosystem (the
   definition-pack alternative); product 12 §One workstream across
   repositories (the evidence); the client README's channel section; the
   decisions file with the recorded choice; the deterministic re-mints; the
   publication locks refreshed. No byte figure binds these write-backs.
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the launchpad and harness fixture cases;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`
(declared machinery sources change) and again at final review.

**Write-back duty:** as listed in criterion 7.

**Known issues and carry-ins:**

- The definition pack is the recorded alternative: a candidate in the
  planning map with the reopening condition that the loadout's definitions
  compile from data or a second owner needs a build core does not ship.
- The pinned definitions run against the current compiler within one major
  version; a definition that depends on a compiler behavior the major kept
  but changed is found by criterion 4's equality case, which compares the
  emit against the pinned revision's bundle.
- The work instance's per-update choice is made on the merge path through
  `build --pin` or `build --take`; the channel flag serves updates run from
  core.

**Non-goals:** the definition pack; pinning the hooks' runtime; per-file
channels; the overlay's own semantics (WO-076); applying a channel inside a
Git merge; the preview and rollback themselves (WO-203, WO-207), which this
order composes with.

**Operator-review assumptions**

1. The build is the two compiled definition modules and what they lower
   into; the hooks' runtime is machinery.
2. The personal instance keeps `both`; the work instance chooses per update
   and may stay pinned indefinitely, which is the true-fork path for the
   build alone, not for the machinery.
