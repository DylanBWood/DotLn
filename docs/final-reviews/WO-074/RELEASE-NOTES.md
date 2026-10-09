## Release overview

This release adds the launchpad export: `npm run launchpad -- export`, given an empty destination directory, writes a new launchpad instance there from the HEAD commit of the checkout that holds the running scripts. The instance starts from a pinned, manifest-listed kit of the control plane, its suites, the operating documents and the templates a fork edits, with no intake, local settings, Beacons, runtime stores, TypeScript package source or evidence of this repository inside. It is the first physical slice of the platform and instance boundary product 03 describes, and the base the runtime build (WO-075), the overlay (WO-076), update (WO-077) and the sibling registry (WO-078) build on. The visible changes:
- One command exports the kit, reads every kit file as a Git blob at the commit, and writes `UPSTREAM.md` and `KIT-MANIFEST.json` naming that commit, its tag and a SHA-256 per kit file.
- Instance seeds (the operating contract, the client README, the first order, the conventions and the root READMEs) are written once and never listed, so a later kit update replaces listed files and touches nothing else.
- The private local-terms list of the launchpad screens every exported text before any write; a match refuses by file and line without printing the term.
- `--license none` exports a pending notice that grants no rights in place of the three license files.

The release is for the operator exporting their own starter and for any organization that forks a launchpad instance from DotLn core.

## Read before upgrading

- **The export carries no compiled runtime and no harness bundle.** Inside an export, `activate`, `status` and `implementation-ready` run without a build and emit control Beacons. In a Codex session (`CODEX_THREAD_ID` set) `next`, `verify`, `fix`, `final-review` and `release-close` refuse until a kit revision carries the runtime (WO-075), because their writer reservation needs it. `npm run build`, `npm test` and `npm run harness` do not run in the export; decision D007 records the export's own test command as a follow-up (FUP-8fb7ae17dd0fad5b).
- **The kit is the commit, not the work tree.** Uncommitted edits to kit paths are not exported; the command prints an advisory naming how many kit paths differ from HEAD. A kit file absent at the commit refuses the export by name.
- **The local-terms list is the launchpad's.** `DOTLN_LAUNCHPAD` or the ascent from the scripts' checkout selects it. With no list the export prints `unavailable` and that is never a pass; a list present but empty or malformed refuses; a match refuses before any write.
- **A destination inside another Git work tree** needs `git init` in the export before any control-plane command, or its scripts resolve the enclosing repository as their launchpad. The command prints that advisory.
- **An export destination outside a role's granted roots** needs an operator-named absolute root or an equipped support in a hooked session (the WO-144 carry-in); the fixtures write only under the system temporary root.
- **`--license none`** writes `LICENSE-PENDING.md` and sets the generated `package.json` to `UNLICENSED`; the verbatim `packages/beacons/package.json` keeps upstream's label because it is byte-identical to the commit. A fork replaces both with its own terms.
- **Offline install.** `npm ci --offline` against the exported lockfile was shown on this host's warm cache; a cold host runs `npm ci` with network.
- **Component versions.** Application v0.70.0 is a minor release over v0.69.2. No component package changes, no dependency is added, and `package.json` gains only the `launchpad` script.

## Substantive changes

**Launchpad export.** `scripts/launchpad.mjs` (new) exports the kit of the running checkout's HEAD: `scripts/**` with the kit templates under `scripts/kit/`, `packages/beacons/**`, the nine build-free `.mjs` package modules the scripts import, `LICENSE`, `LICENSE-docs` and `NOTICE`, the execution guide and the playbook whole, and the implementation-overlay template, each a Git blob read at the commit with its file mode. It generates a `package.json` with core's script names and exact development pins, a lockfile pruned to the beacons workspace and the closure of those pins, `dotln.config.example.json` (today's layout, declaring only the `docs` base), `UPSTREAM.md` and `KIT-MANIFEST.json`. A destination that exists and is not an empty readable directory, a symbolic link, an unknown option and a kit file absent at the commit each refuse before any write.

**Instance seeds.** Written once and never manifest-listed: `CLAUDE.md` with a hand-written clean-room and secrets floor, the resume phrases and a marked provenance block that points at `UPSTREAM.md` and `KIT-MANIFEST.json`; `AGENTS.md` symlinked to it; `AI-HARNESS-SECURITY.md` from a sanitized template; the client README; `.gitignore` (core's minus `dist/` and build info, since a starter commits its runtime); the first order `WO-001-environment-truth.md` in WO-001's shape with the harness smoke, the local-terms registration step and four generic audit questions; `docs/planning/sequence.md` naming it; the workstream and repository-profile conventions; one README per seeded document root; `docs/intake/.gitkeep`; and an empty `packages/skeleton/loadouts/grants.json`.

**Local-terms screening.** The export runs `checkLocalTerms` over every text it will write, the manifest included, against the launchpad's list, and prints `local-terms list: present (N texts checked)`, `local-terms list: unavailable; no text was checked against a local-terms list`, or refuses with the file and line of each match and never the term. The destination is created only after every refusal has passed, so a refused export writes nothing.

**Gate row.** The `launchpad` suite, `scripts/test-launchpad.mjs`, joins `npm test` with one case per criterion and two design cases; it needs no build. The fixtures commit a bounded copy of the work tree into a temporary repository, plant one of each excluded item (force-added so the allowlist alone keeps it out), and export from it.

## Progressive polish

Product 03 §Platform and instance boundary gains one undated paragraph naming the kit's first slice; `docs/LEGAL.md` §Current state gains the dated observation that the kit carries the three pinned license files by default and no bundled third-party material; `docs/README.md` §Map names `scripts/kit/`; `scripts/license-surfaces.mjs` exports its pinned license hashes for the fixture, with no behavior change. The authority, artifact-identity and verification evidence editions were re-minted deterministically as WO-074 revision 001 and the feedback edition carried from WO-199 feedback-004 with no live episode, because `package.json` is a common source of the inventories; the two publication source locks were refreshed.

## Evidence and compatibility

Application `v0.70.0` is a minor release over `v0.69.2`, built from WO-074 on `main` at `28d32e26`, which the branch, local `main` and `origin/main` all named at integration. No component package changes; kernel, compiler, skeleton, console, beacons and browser-evidence versions are unchanged. No dependency is added.

The verification sequence:
- [VER-001](../../verifications/WO-074/VER-001.md) passed on fourteen independent probe groups, a fresh fixture run and an export from its own committed copy against the main checkout's list.
- [FINAL-001](FINAL-001.md) passed: the fixture suite fresh (10 of 10), criterion 6 reproduced from a committed copy of the reviewed tree against the operator's list (`present (305 texts checked)`), the license census of both exports, the clean-room screen of the kit-authored texts, and every affected check at the integrated tree.

The executor's `npm test -- --review` at code identity `7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d` passed 35 suites and 85 fresh tasks in 1,044.0 s; the `launchpad` suite passed in 9.7 s. The final review's gate at the same identity reused those tasks, ran `format` fresh and passed 35 of 35 in 60.98 s. `npm run test:docs` passes 29 of 29. All four evidence editions check current.

Known limitations:
- The export's own `npm test` does not run until a kit revision carries the runtime build ([D007](../../evidence/WO-074/decisions.md#wo-074-d007--the-exports-own-test-command-is-a-follow-up), FUP-8fb7ae17dd0fad5b).
- The verbatim scripts carry the operator's public author constant, core's instance identity inside byte-identical kit files ([D010](../../evidence/WO-074/decisions.md#wo-074-d010--write-backs-carry-ins-and-the-kits-instance-identity), FUP-06de60fa5d19fe5a).
- One fixture under `scripts/fixtures/` carries data derived from a verification report of this repository, outside criterion 3's declared set ([D011](../../evidence/WO-074/decisions.md#wo-074-d011--self-review-findings-and-a-follow-up-outside-criterion-3s-declared-set), FUP-e624167a7f6555f6).
- The offline install was shown on a warm cache; a host without network was not exercised, and the fixtures ran on macOS.

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-074/decisions.md) and the [handoff](../../evidence/WO-074/handoff.md).
