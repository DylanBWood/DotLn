# DotLn launchpad

This repository is a launchpad instance exported from DotLn core: the control
plane under `scripts/` with its suites, the build-free Beacon workspace under
`packages/beacons`, the operating documents and the templates a new instance
starts from. `UPSTREAM.md` names the core commit and tag the kit was read from;
`KIT-MANIFEST.json` lists every kit file with its SHA-256. Everything the
manifest does not list is instance-owned: the configuration, the control
records, work orders, evidence, verification and final-review reports, the
operating contract's hand-written floor and this instance's overlays.

## First steps

1. `git init` first, before any control-plane command, then review the files
   and commit them. The control plane records checkpoints as Git refs and
   needs a repository with at least one commit; until the export is its own
   repository, its scripts would resolve an enclosing one as their launchpad.
2. `npm ci` (or `npm ci --offline` with a warm cache): installs the pinned
   development dependencies from the exported lockfile and links the
   `packages/beacons` workspace.
3. Register the private local-terms list at `docs/control/local/terms.txt`,
   one term per line; the directory is ignored by Git. `npm run terms -- check
   <paths>` prints `local-terms list: present` or `unavailable`, and refuses on
   a match by file and line without printing the term.
4. Copy `dotln.config.example.json` to `dotln.config.json` only when this
   instance moves a document root; an absent file means the default layout
   under `docs/`. The example declares only the `docs` base, from which every
   other root derives; a root declared on its own stays where it is declared
   when the base moves.
5. Activate the pre-drafted first order:
   `npm run resume -- activate WO-001 docs/work-orders/WO-001-environment-truth.md`,
   then `npm run resume -- status` (`--json` is the canonical record).
6. Open a session that reads the operating contract (`CLAUDE.md`, symlinked as
   `AGENTS.md`); the resume phrases name the dispatch, and until a kit revision
   carries the role skills the session runs the `npm run resume -- <action>`
   commands itself.

## What runs here, and what does not yet

Shown to run without a build in this export: `activate`, `status` and
`implementation-ready`, each emitting the control Beacons under
`.control-beacons/`. In a Codex session (`CODEX_THREAD_ID` set) `next`,
`verify`, `fix`, `final-review` and `release-close` refuse until a kit
revision carries the runtime, because their writer reservation needs it.
`npm run build` needs the TypeScript source core keeps, and `npm test` and
`npm run harness` need its output, so neither runs here. That is a recorded
limit of this kit revision, not a defect of your instance; a later revision
carries the runtime and the harness bundle.

## Attestations

Every lifecycle completion records the harness, version, model, effort and
source. An unmatched version or effort is recorded as supplied with an
advisory and is never refused for lacking discovery; a Claude Code session that
exports `CLAUDE_EFFORT` attests that effort with
`--source claude-session-readback`. Core compares attestations with its
discovery record at `docs/discovery/environment.json`; a fresh fork has none,
so every attestation here prints
`Advisory: attestation recorded as supplied; <harness> <version> effort <effort> has no matching discovery observation.`
until this instance records its own discovery, which is the first order's
deliverable. The advisory is informational and the completion records all the
same.

## Kit files and instance files

Kit files are the manifest-listed set: `scripts/**` (the kit templates under
`scripts/kit/` among them), `packages/beacons/**`, the build-free modules
under `packages/*/src/*.mjs`, `package.json`, `package-lock.json`,
`dotln.config.example.json`, `UPSTREAM.md`, the license files,
`docs/product/07-execution-guide.md`, `docs/PLAYBOOK.md` and
`docs/publication/implementation-overlay-template.md`. A later kit revision
replaces these and touches nothing else. Instance files are yours:
`dotln.config.json`, `docs/control/`, `docs/work-orders/`, `docs/evidence/`,
`docs/verifications/`, `docs/final-reviews/`, `docs/workstreams/`,
`docs/repositories/`, `docs/planning/`, the product overlay and the build
overlay, `CLAUDE.md`, `AI-HARNESS-SECURITY.md`, this README, `.gitignore`
and every root README the export seeded once, the workstream and
repository-profile conventions included; their upstream sources stay under
`scripts/kit/` for a later revision to refresh. Two READMEs are generated
rather than seeded: `docs/work-orders/` gets the index at the first lifecycle
transition (`activate`) and `docs/lineage/` gets its index from
`node scripts/lineage.mjs index` once a ledger exists.

## License

The license files this export carries are listed in the manifest and
`UPSTREAM.md`. An export made with `--license none` carries
`LICENSE-PENDING.md` in their place, a notice that grants no rights, and its
generated `package.json` says `UNLICENSED`; replace both with the terms the
owner of this repository decides. The verbatim `packages/beacons/package.json`
keeps upstream's label in either export because it is byte-identical to the
commit.
