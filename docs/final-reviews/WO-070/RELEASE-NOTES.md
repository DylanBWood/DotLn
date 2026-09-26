## Release overview

This release gives the control plane its own home for the Beacon codebooks and their filesystem leaves. Until now the seven build-free Beacon modules lived inside `packages/skeleton`, and the lifecycle scripts loaded them once from that package's source and once from its compiled `dist/`: two module identities of one library, both inside the package a launchpad export leaves behind. They now live in the private, build-free `@dotln/beacons` workspace. Lifecycle scripts import that source directly, the skeleton imports it by name, and a control plane copied to a root with no `packages/skeleton` activates an order and decodes its control Beacon.

The intended audience is the operator and anyone preparing to export the control plane (WO-074, WO-075), for whom this is the bounded prerequisite; every Beacon byte, codebook and fixture is unchanged.

## Read before upgrading

No migration is required for in-tree consumers, and no Beacon file, codebook or fixture changes meaning.

- The modules `beacon-codebook.mjs`, `beacon-io.mjs`, `beacon-provenance.mjs`, `beacon-v3-codebook.mjs`, `beacon-v3-fs.mjs`, `control-beacon-fs.mjs` and `control-codebook.mjs` leave `packages/skeleton/src` and `packages/skeleton/dist/src`. A local script that imported them from either path must import the same file name under `packages/beacons/src/` or through `@dotln/beacons/`.
- Release-tag reading moves from `scripts/lib/release-records.mjs` to `scripts/lib/release-tags.mjs`. `release-records.mjs` re-exports every name it exported before, so existing importers need no change; new importers that only read tags may import the new module and avoid loading the gate-evidence module.
- Any root that assembles DotLn packages by hand must now carry `packages/beacons` and a `node_modules/@dotln/beacons` link beside the built packages; the harness snapshot, the launchpads, the qualification root and the shipped fixtures do this themselves.
- The harness snapshot identity still hashes only its pinned `dist` files, so a change confined to the Beacon leaves reuses an existing snapshot, as the unpinned `dist` codebook copies did before this release.
- One paid live feedback episode ran under operator authorization, and the authority and feedback evidence editions are re-minted as `WO-070/001`. No host setting, refusal, authority envelope or permission mode changes.

## Substantive changes

**The `@dotln/beacons` workspace.** `packages/beacons` (`0.1.0`, private, Apache-2.0, publish refused like every DotLn package) holds the seven leaves with an exports map and a package-owned `types.d.mts` whose codebook-backed unions derive from the codebook constants. Two leaves are byte-identical to their skeleton originals; the other five change only JSDoc type paths. The skeleton's TypeScript modules and tests import the workspace by name; the control-plane library, the benchmark scripts, the script tests and the shared fixture installer import its source by path; and a new grep test over `scripts/` rejects any skeleton or compiled-Beacons path to a leaf.

**Build and runtime assembly.** The atomic build stages build-free workspaces beside the compiled packages so strict `checkJs` checks the leaves without emitting a copy. `scripts/lib/harness.mjs` exports `runtimeModuleDirectory`, which says what a package ships: a built package its `dist`, a build-free workspace its `src`. The immutable harness runtime snapshot, the authority-probe launchpad and the target-harness fixture use it; the Copilot qualification root, the live smoke and the test-harness, process-debt and worktree-integration fixtures copy and link `packages/beacons`. A new harness test copies an installed snapshot outside every checkout and imports its hook host from there.

**Activation without skeleton source.** `scripts/lib/dependencies.mjs` reads release tags through the new `release-tags.mjs`, so activating an order no longer loads the skeleton's gate-evidence module. The portability suite copies `scripts/`, `packages/beacons` and `.gitignore` into an empty Git root with no `node_modules` and no `packages/skeleton`, activates an order there and decodes both the public and the verifier control Beacon from file size with the copied codebook, with the recorded transition time as mtime.

**Evidence and release accounting.** `beacons` joins kernel, compiler, skeleton and console as a release component whose labels the evidence editions and the feedback pins record compare by content, so a later Beacon version bump is a label rather than a judged behavior change. The evidence-source inventories name the moved paths and resolve deep `@dotln/` package imports to their source leaves. The release surface check covers the new workspace's license, privacy, publish refusal and workspace pin.

## Progressive polish

The harness bundle, the hooks and the manifest were re-emitted for the changed reactor pin and the new snapshot. The authority edition is re-minted as `WO-070/001` and the feedback edition as `WO-070/001` from one live `claude-cli-print` episode with `claude-sonnet-5` at `xhigh`; artifact identity and verification stay at `WO-161/001`. The publication editions' source locks were refreshed. Product 02's codebook section, product 03's Layer diagram and prose, the skeleton README, ADR 0002 and product 06's release boundary describe the workspace; the configuration-root test's comment points at the deferred plane/kit follow-up.

## Evidence and compatibility

**Release and versions.** This prepares application `v0.51.1` as a patch release over `v0.51.0` (`64f9326f`), the classification the order declared for a module-identity refactor with byte-identical fixtures. `@dotln/beacons` is new at `0.1.0`; `@dotln/skeleton` moves `0.43.1` → `0.43.2` for its compatible import change, with the console's pin and the lockfile following. Compiler, kernel and console versions are unchanged, and no third-party dependency was added.

**Product gate.** The reviewer's `npm test -- --review` binds the released bytes: **42 suites, 0 failed, 586.91 s, 86 fresh tasks, exit 0**, recorded 2026-09-26T00:42:27.004Z on tree `5251e1d317d50270a9bef9cd59251d21a40765a1`, at code identity `3679af7623d491a2ad350194eab8698499461be262e4990a98d612e4fcb2cc67`, with no confinement in force; the executor's final `npm test` (343,956 ms) and VER-001's `npm test` (293,618 ms) recorded the same identity.

**Verification sequence.**

1. The [implementation](../../evidence/WO-070/implementation.md) ran in two segments of one dispatch: a Codex session moved the leaves and stopped in a provider outage; Claude continued at the operator's direction, ran the full gates, repaired every root that assembled packages without the workspace, registered the component, applied the review repairs, disposed the carry-ins and ran the authorized live episode and re-mint ([D001](../../evidence/WO-070/decisions.md#wo-070-d001) to [D011](../../evidence/WO-070/decisions.md#wo-070-d011)).
2. [VER-001](../../verifications/WO-070/VER-001.md) passed all five criteria with its own focused runs of the normative and exhaustive Beacon tests, a namespace-identity check, a type-overlay probe and a parsed lockfile comparison.
3. [FINAL-001](FINAL-001.md) passed with its own reproduction of the leaf byte comparison, the module identity, the portability suite and the old-path search, every check re-run and the review gate.

**Known limitations.**

- Criterion 2 is scoped to the seven Beacon leaves. `gate-evidence.mjs` and `usage-observation.mjs` are still loaded from skeleton source by some scripts and from `dist` by others; neither holds module-level state ([D006](../../evidence/WO-070/decisions.md#wo-070-d006)), and the plane/kit root resolution carried from WO-069 is deferred to the export-kit orders ([D009](../../evidence/WO-070/decisions.md#wo-070-d009), `FUP-a058e82c0bbd9b6d`).
- `scripts/test-evidence-sources.mjs` assumes the selected feedback edition is its own live audit and fails whenever the selection is a carried one; it passes again now that the selection is live ([D011](../../evidence/WO-070/decisions.md#wo-070-d011), `FUP-04bdf07955e1e24f`).
- The harness live smoke gained the workspace link and was not run; the builders it shares are covered by the `harness-probe` and `harness-fixtures` suites and the snapshot test.
- `BeaconActionClass` in `packages/beacons/src/types.d.mts` is a hand-written union mirroring the skeleton's; the staged build and the encoder's own field check catch drift in either direction, and deriving it from the codebook is left to a later order.

Deeper notes: [decisions D001 to D011](../../evidence/WO-070/decisions.md), the [implementation record](../../evidence/WO-070/implementation.md), the [verification report](../../verifications/WO-070/VER-001.md), the final review and [the order](../../work-orders/WO-070-beacon-portability.md).
